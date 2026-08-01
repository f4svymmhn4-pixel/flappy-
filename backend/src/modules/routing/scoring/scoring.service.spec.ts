import { ScoringService } from './scoring.service';
import { SegmentExtras } from './scoring.types';
import { Preferences } from '../../../entities/preferences.entity';

function makePrefs(overrides: Partial<Preferences> = {}): Preferences {
  return {
    id: 'p1',
    userId: 'u1',
    distanceKm: 40,
    difficulty: 'medium',
    elevationProfile: 'rolling',
    priority: 'scenery',
    avoidGravel: false,
    avoidDirt: false,
    avoidForest: false,
    avoidCityCenter: true,
    avoidTraffic: true,
    avoidTrunkRoads: true,
    avoidNoBikeLane: false,
    avoidIndustrial: true,
    avoidRoadworks: true,
    followBikeLanes: true,
    preferSmallRoads: true,
    avoidTrafficLights: false,
    avoidStopSigns: false,
    preferRiverside: false,
    preferVineyards: false,
    preferViewpoints: true,
    preferLakes: false,
    preferOcean: false,
    isLoop: true,
    createdAt: new Date(),
    ...overrides,
  } as Preferences;
}

describe('ScoringService', () => {
  const scoring = new ScoringService();

  it('rates a smooth, bike-lane-heavy route higher than a rough, laneless one', () => {
    const goodSegments: SegmentExtras[] = [
      { distanceM: 8000, surface: 'asphalt', wayType: 'cycleway', suitability: 9, greenness: 7, noise: 2 },
      { distanceM: 2000, surface: 'asphalt', wayType: 'street', suitability: 7, greenness: 6, noise: 3 },
    ];
    const badSegments: SegmentExtras[] = [
      { distanceM: 8000, surface: 'gravel', wayType: 'track', suitability: 2, greenness: 2, noise: 8 },
      { distanceM: 2000, surface: 'dirt', wayType: 'road', suitability: 1, greenness: 1, noise: 9 },
    ];

    const goodPrefs = makePrefs();
    const goodResult = scoring.score(goodSegments, goodPrefs, [], true);
    const badResult = scoring.score(badSegments, goodPrefs, [], true);

    expect(goodResult.scoreTotal).toBeGreaterThan(badResult.scoreTotal);
    expect(goodResult.starRating).toBeGreaterThanOrEqual(badResult.starRating);
  });

  it('computes gradient split percentages summing to ~100', () => {
    const segments: SegmentExtras[] = [
      { distanceM: 5000, steepness: 0 },
      { distanceM: 3000, steepness: 2 },
      { distanceM: 2000, steepness: -3 },
    ];
    const split = scoring.computeGradientSplit(segments);
    expect(split.pctFlat + split.pctClimb + split.pctDescent).toBeCloseTo(100, 0);
    expect(split.pctFlat).toBeCloseTo(50, 0);
  });

  it('boosts the tourism score when priority=tourism and POIs are present', () => {
    const segments: SegmentExtras[] = [{ distanceM: 10000, surface: 'asphalt', suitability: 6, greenness: 5 }];
    const pois = [
      { id: '1', category: 'viewpoint' as const, name: 'Belvédère', lat: 44.8, lon: -0.6, distanceFromStartM: 1000 },
    ];
    const withoutTourismPriority = scoring.score(segments, makePrefs({ priority: 'performance' }), [], true);
    const withTourismPriority = scoring.score(segments, makePrefs({ priority: 'tourism' }), pois, true);

    expect(withTourismPriority.breakdown.tourism).toBeGreaterThan(0);
    expect(withTourismPriority.scoreTotal).toBeGreaterThanOrEqual(withoutTourismPriority.scoreTotal - 5);
  });

  it('keeps starRating within [0, 5] in 0.5 steps', () => {
    const segments: SegmentExtras[] = [{ distanceM: 10000, surface: 'asphalt', suitability: 10, greenness: 10 }];
    const result = scoring.score(segments, makePrefs(), [], true);
    expect(result.starRating).toBeGreaterThanOrEqual(0);
    expect(result.starRating).toBeLessThanOrEqual(5);
    expect((result.starRating * 2) % 1).toBe(0);
  });
});
