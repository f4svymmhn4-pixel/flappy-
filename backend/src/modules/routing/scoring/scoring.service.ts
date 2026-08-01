import { Injectable } from '@nestjs/common';
import { Preferences, Priority } from '../../../entities/preferences.entity';
import { RoutePoi } from '../../poi/poi.types';
import { SegmentExtras, ScoreBreakdown, RouteQualitySummary } from './scoring.types';

const BIKE_FRIENDLY_WAYTYPES = new Set(['cycleway']);
const SECONDARY_WAYTYPES = new Set(['street', 'road']);
const DEPARTMENTAL_WAYTYPES = new Set(['state_road']);
const ROUGH_SURFACES = new Set(['gravel', 'dirt', 'ground', 'sand', 'cobblestone', 'grass']);
const SMOOTH_SURFACES = new Set(['asphalt', 'paved', 'paving_stones', 'concrete']);

/** Weight given to each score criterion depending on the ride's declared priority. */
const PRIORITY_WEIGHTS: Record<Priority, Partial<Record<keyof Omit<ScoreBreakdown, 'explanations'>, number>>> = {
  tourism: { tourism: 1.5, beauty: 1.2 },
  performance: { flow: 1.5, surfaceQuality: 1.3 },
  scenery: { beauty: 1.6, tourism: 1.1 },
  quiet_roads: { safety: 1.4, flow: 1.2 },
  max_bike_lanes: { safety: 1.3, surfaceQuality: 1.2 },
  climbing: { funFactor: 1.3 },
  descent: { funFactor: 1.3, flow: 1.1 },
  training: { flow: 1.4, surfaceQuality: 1.2 },
  leisure: { beauty: 1.3, variety: 1.2 },
};

@Injectable()
export class ScoringService {
  /** Weighted-by-distance percentage split across categories used in the UI stats panel. */
  computeDistribution(segments: SegmentExtras[]) {
    const total = segments.reduce((sum, s) => sum + s.distanceM, 0) || 1;
    const bikeLane = segments.filter((s) => s.wayType && BIKE_FRIENDLY_WAYTYPES.has(s.wayType));
    const secondary = segments.filter((s) => s.wayType && SECONDARY_WAYTYPES.has(s.wayType));
    const departmental = segments.filter((s) => s.wayType && DEPARTMENTAL_WAYTYPES.has(s.wayType));

    const sumDist = (arr: SegmentExtras[]) => arr.reduce((sum, s) => sum + s.distanceM, 0);

    return {
      pctBikeLane: round1((sumDist(bikeLane) / total) * 100),
      pctSecondary: round1((sumDist(secondary) / total) * 100),
      pctDepartmental: round1((sumDist(departmental) / total) * 100),
    };
  }

  /** Splits distance into flat / climbing / descending thirds from steepness extra_info. */
  computeGradientSplit(segments: SegmentExtras[]) {
    const total = segments.reduce((sum, s) => sum + s.distanceM, 0) || 1;
    let flat = 0;
    let climb = 0;
    let descent = 0;
    for (const seg of segments) {
      if (seg.steepness === undefined || seg.steepness === 0) flat += seg.distanceM;
      else if (seg.steepness > 0) climb += seg.distanceM;
      else descent += seg.distanceM;
    }
    return {
      pctFlat: round1((flat / total) * 100),
      pctClimb: round1((climb / total) * 100),
      pctDescent: round1((descent / total) * 100),
    };
  }

  score(
    segments: SegmentExtras[],
    prefs: Preferences,
    pois: RoutePoi[],
    trafficNoiseAvailable: boolean,
  ): RouteQualitySummary {
    const total = segments.reduce((sum, s) => sum + s.distanceM, 0) || 1;
    const weightedAvg = (pick: (s: SegmentExtras) => number | undefined, fallback: number) => {
      let acc = 0;
      let coveredDistance = 0;
      for (const seg of segments) {
        const v = pick(seg);
        if (v === undefined) continue;
        acc += v * seg.distanceM;
        coveredDistance += seg.distanceM;
      }
      return coveredDistance > 0 ? acc / coveredDistance : fallback;
    };

    const suitabilityAvg = weightedAvg((s) => s.suitability, 6); // ORS suitability is 0-10
    const greennessAvg = weightedAvg((s) => s.greenness, 5);
    const noiseAvg = weightedAvg((s) => s.noise, 4);

    const smoothDistance = segments
      .filter((s) => s.surface && SMOOTH_SURFACES.has(s.surface))
      .reduce((sum, s) => sum + s.distanceM, 0);
    const roughDistance = segments
      .filter((s) => s.surface && ROUGH_SURFACES.has(s.surface))
      .reduce((sum, s) => sum + s.distanceM, 0);

    const { pctBikeLane } = this.computeDistribution(segments);

    const surfaceQuality = clamp(round1((smoothDistance / total) * 100 - (roughDistance / total) * 30 + 20));
    const safety = clamp(round1(suitabilityAvg * 8 + pctBikeLane * 0.2 - (noiseAvg - 4) * 5));
    const beauty = clamp(round1(greennessAvg * 8 + pois.length * 3));
    const tourism = clamp(round1(pois.length * 12 + (prefs.preferViewpoints ? 10 : 0)));
    const flow = clamp(
      round1(
        100 -
          (trafficNoiseAvailable ? noiseAvg * 6 : 20) -
          (prefs.avoidTrafficLights || prefs.avoidStopSigns ? -5 : 0),
      ),
    );
    const funFactor = clamp(round1((suitabilityAvg + greennessAvg) * 5 + (100 - surfaceQuality) * 0.1));
    const variety = clamp(
      round1(new Set(segments.map((s) => s.wayType).filter(Boolean)).size * 15 + pois.length * 5),
    );

    const breakdown: ScoreBreakdown = {
      beauty,
      safety,
      flow,
      tourism,
      surfaceQuality,
      funFactor,
      variety,
      explanations: {
        beauty: `Verdure et nature estimées à ${Math.round(greennessAvg * 10)}/100, ${pois.length} point(s) remarquable(s) repéré(s) sur le tracé.`,
        safety: `Voies jugées adaptées au vélo à ${Math.round(suitabilityAvg * 10)}/100, ${pctBikeLane}% du parcours sur piste/bande cyclable.`,
        flow: `Trafic et nuisances sonores estimés bas (indice ${Math.round(noiseAvg * 10)}/100) pour une conduite fluide.`,
        tourism: `${pois.length} point(s) d'intérêt touristique identifié(s) à proximité immédiate du tracé.`,
        surfaceQuality: `${round1((smoothDistance / total) * 100)}% de revêtement lisse (asphalte/béton), ${round1((roughDistance / total) * 100)}% de revêtement irrégulier.`,
        funFactor: 'Combine variété des voies et qualité de conduite pour estimer le plaisir de pilotage.',
        variety: `${new Set(segments.map((s) => s.wayType).filter(Boolean)).size} type(s) de voies différents empruntés, favorisant un parcours varié.`,
      },
    };

    const weights = PRIORITY_WEIGHTS[prefs.priority] ?? {};
    const criteria: Array<keyof Omit<ScoreBreakdown, 'explanations'>> = [
      'beauty',
      'safety',
      'flow',
      'tourism',
      'surfaceQuality',
      'funFactor',
      'variety',
    ];
    let weightedSum = 0;
    let weightTotal = 0;
    for (const key of criteria) {
      const w = weights[key] ?? 1;
      weightedSum += breakdown[key] * w;
      weightTotal += w;
    }
    const scoreTotal = clamp(round1(weightedSum / weightTotal));
    const starRating = Math.round((scoreTotal / 100) * 5 * 2) / 2; // nearest 0.5 star

    const { pctFlat, pctClimb, pctDescent } = this.computeGradientSplit(segments);
    const { pctSecondary, pctDepartmental } = this.computeDistribution(segments);

    return {
      scoreTotal,
      starRating,
      starExplanation: this.explainStars(starRating, prefs, breakdown),
      breakdown,
      pctFlat,
      pctClimb,
      pctDescent,
      pctBikeLane,
      pctSecondary,
      pctDepartmental,
    };
  }

  private explainStars(stars: number, prefs: Preferences, breakdown: ScoreBreakdown): string {
    const best = Object.entries(breakdown)
      .filter(([k]) => k !== 'explanations')
      .sort((a, b) => (b[1] as number) - (a[1] as number))[0];
    const priorityLabel = prefs.priority.replace('_', ' ');
    return (
      `${stars}/5 — ce parcours excelle sur le critère "${best[0]}" (${best[1]}/100), ` +
      `ce qui correspond bien à votre priorité "${priorityLabel}".`
    );
  }
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, n));
}
