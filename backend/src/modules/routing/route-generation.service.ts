import { Injectable, Logger } from '@nestjs/common';
import type { Feature, LineString, MultiPolygon } from 'geojson';
import { BikeType } from '../../entities/bike.entity';
import { Preferences } from '../../entities/preferences.entity';
import { destinationPoint, LatLon } from '../../common/geo/geo.util';
import { OpenRouteServiceClient, OrsRouteResult } from './providers/openrouteservice.client';
import { GraphHopperClient } from './providers/graphhopper.client';
import { buildAvoidFeatures, mapBikeToOrsProfile } from './providers/bike-profile.mapper';
import { extractSegments } from './scoring/ors-extras.util';
import { ScoringService } from './scoring/scoring.service';
import { PoiService } from '../poi/poi.service';
import { RoutePoi } from '../poi/poi.types';
import { RouteQualitySummary } from './scoring/scoring.types';

export interface GenerateRouteInput {
  start: LatLon;
  bikeType: BikeType;
  preferences: Preferences;
  isLoop: boolean;
}

export interface GeneratedRoute {
  geojson: Feature<LineString>;
  distanceM: number;
  durationS: number;
  ascentM: number;
  descentM: number;
  avgSpeedKmh: number;
  quality: RouteQualitySummary;
  pois: RoutePoi[];
  provider: 'openrouteservice' | 'graphhopper';
}

/** Base cruising speed (km/h) per bike type on flat, good-quality tarmac. */
const BASE_SPEED_KMH: Record<BikeType, number> = {
  road: 27,
  gravel: 22,
  mtb: 18,
  electric: 24,
  city: 16,
};

const DIFFICULTY_SPEED_FACTOR: Record<Preferences['difficulty'], number> = {
  very_easy: 0.8,
  easy: 0.9,
  medium: 1,
  sporty: 1.1,
  very_sporty: 1.2,
};

@Injectable()
export class RouteGenerationService {
  private readonly logger = new Logger(RouteGenerationService.name);

  constructor(
    private readonly ors: OpenRouteServiceClient,
    private readonly graphHopper: GraphHopperClient,
    private readonly poiService: PoiService,
    private readonly scoringService: ScoringService,
  ) {}

  async generate(input: GenerateRouteInput): Promise<GeneratedRoute> {
    const { start, bikeType, preferences, isLoop } = input;
    const lengthM = Math.round(preferences.distanceKm * 1000);
    const profile = mapBikeToOrsProfile(bikeType);
    const avoidFeatures = buildAvoidFeatures(bikeType, preferences);

    const scenerySeeking =
      Object.values({
        v: preferences.preferViewpoints,
        l: preferences.preferLakes,
        vy: preferences.preferVineyards,
        o: preferences.preferOcean,
        r: preferences.preferRiverside,
      }).some(Boolean) && ['tourism', 'scenery', 'leisure'].includes(preferences.priority);

    const searchRadiusM = isLoop ? lengthM * 0.35 : lengthM * 0.6;

    const [candidates, avoidPolygons] = await Promise.all([
      scenerySeeking ? this.poiService.findCandidates(start, searchRadiusM, preferences) : Promise.resolve([]),
      preferences.avoidIndustrial
        ? this.buildIndustrialAvoidPolygon(start, searchRadiusM)
        : Promise.resolve(undefined),
    ]);

    let result: OrsRouteResult;
    let provider: 'openrouteservice' | 'graphhopper' = 'openrouteservice';

    try {
      if (!this.ors.isConfigured) throw new Error('ORS_API_KEY not configured');
      result = await this.routeViaOrs({
        start,
        profile,
        lengthM,
        isLoop,
        avoidFeatures,
        avoidPolygons,
        candidates,
      });
    } catch (error) {
      this.logger.warn(
        `OpenRouteService generation failed, falling back to GraphHopper: ${(error as Error).message}`,
      );
      provider = 'graphhopper';
      result = await this.graphHopper.generateRoundTrip(start, bikeType, lengthM);
    }

    const coordinates = result.geojson.geometry.coordinates as Array<[number, number, number?]>;
    const coords2d = coordinates.map(([lon, lat]) => [lon, lat] as [number, number]);
    const segments = extractSegments(coordinates, result.extras);

    const pois =
      candidates.length > 0 ? await this.poiService.buildRouteHighlights(coords2d, candidates) : [];

    const quality = this.scoringService.score(segments, preferences, pois, provider === 'openrouteservice');
    const avgSpeedKmh = this.estimateAverageSpeed(bikeType, preferences, quality);

    return {
      geojson: result.geojson,
      distanceM: result.distanceM,
      durationS: result.durationS,
      ascentM: result.ascentM,
      descentM: result.descentM,
      avgSpeedKmh,
      quality,
      pois,
      provider,
    };
  }

  private async routeViaOrs(opts: {
    start: LatLon;
    profile: ReturnType<typeof mapBikeToOrsProfile>;
    lengthM: number;
    isLoop: boolean;
    avoidFeatures: string[];
    avoidPolygons?: MultiPolygon;
    candidates: Array<{ lat: number; lon: number }>;
  }): Promise<OrsRouteResult> {
    const { start, profile, lengthM, isLoop, avoidFeatures, avoidPolygons, candidates } = opts;

    // "Intelligent" bending: if we found scenery candidates, route explicitly
    // through the best 1-2 of them instead of a blind round_trip, so the ride
    // actually visits the viewpoint/lake/vineyard rather than passing nearby.
    if (candidates.length > 0) {
      const chosen = candidates.slice(0, isLoop ? 2 : 1);
      const waypoints: LatLon[] = isLoop
        ? [start, ...chosen.map((c) => ({ lat: c.lat, lon: c.lon })), start]
        : [start, ...chosen.map((c) => ({ lat: c.lat, lon: c.lon }))];

      try {
        return await this.ors.generateThroughWaypoints({ waypoints, profile, avoidFeatures, avoidPolygons });
      } catch (error) {
        this.logger.warn(`Waypoint-bent route failed, falling back to round_trip: ${(error as Error).message}`);
      }
    }

    if (isLoop) {
      return this.ors.generateRoundTrip({ start, profile, lengthM, avoidFeatures, avoidPolygons });
    }

    // One-way ride: project a destination point and let ORS route to it.
    // 0.85 factor compensates for real road distance exceeding straight-line
    // distance; the resulting distance will approximate, not exactly match,
    // the requested length (a true graph search would optimize this further).
    const destination = destinationPoint(start, Math.random() * 360, lengthM * 0.85);
    return this.ors.generateThroughWaypoints({
      waypoints: [start, destination],
      profile,
      avoidFeatures,
      avoidPolygons,
    });
  }

  private async buildIndustrialAvoidPolygon(
    start: LatLon,
    radiusM: number,
  ): Promise<MultiPolygon | undefined> {
    const zones = await this.poiService.findIndustrialZones(start, radiusM);
    if (zones.length === 0) return undefined;
    return {
      type: 'MultiPolygon',
      coordinates: zones.map((ring) => [
        ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1]
          ? ring
          : [...ring, ring[0]],
      ]),
    };
  }

  private estimateAverageSpeed(
    bikeType: BikeType,
    preferences: Preferences,
    quality: RouteQualitySummary,
  ): number {
    const base = BASE_SPEED_KMH[bikeType] * DIFFICULTY_SPEED_FACTOR[preferences.difficulty];
    const climbPenalty = (quality.pctClimb / 100) * 0.35; // steeper routes slow the average down
    const surfaceFactor = 0.7 + (quality.breakdown.surfaceQuality / 100) * 0.3;
    const speed = base * (1 - climbPenalty) * surfaceFactor;
    return Math.round(speed * 10) / 10;
  }
}
