import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import type { Feature, LineString, MultiPolygon } from 'geojson';
import { LatLon } from '../../../common/geo/geo.util';
import { OrsProfile, ORS_EXTRA_INFO } from './bike-profile.mapper';
import { OrsExtras } from '../scoring/ors-extras.util';

export interface OrsRouteResult {
  geojson: Feature<LineString>;
  distanceM: number;
  durationS: number;
  ascentM: number;
  descentM: number;
  /** Per-way extra_info summaries (surface/waytype/steepness/suitability/green/noise). */
  extras: OrsExtras;
}

export interface OrsRoundTripOptions {
  start: LatLon;
  profile: OrsProfile;
  lengthM: number;
  avoidFeatures?: string[];
  avoidPolygons?: MultiPolygon;
  seed?: number;
}

export interface OrsWaypointsOptions {
  waypoints: LatLon[]; // ordered, first === last for a loop
  profile: OrsProfile;
  avoidFeatures?: string[];
  avoidPolygons?: MultiPolygon;
}

@Injectable()
export class OpenRouteServiceClient {
  private readonly logger = new Logger(OpenRouteServiceClient.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.get<string>('apis.openRouteServiceUrl')!;
    this.apiKey = this.config.get<string>('apis.openRouteServiceKey')!;
  }

  get isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  /** Generates a real loop starting/ending at `start` using ORS's round_trip option. */
  async generateRoundTrip(opts: OrsRoundTripOptions): Promise<OrsRouteResult> {
    const body: Record<string, unknown> = {
      coordinates: [[opts.start.lon, opts.start.lat]],
      elevation: true,
      extra_info: ORS_EXTRA_INFO,
      options: {
        round_trip: {
          length: opts.lengthM,
          points: 4,
          seed: opts.seed ?? Math.floor(Math.random() * 1000),
        },
        ...(opts.avoidFeatures?.length ? { avoid_features: opts.avoidFeatures } : {}),
        ...(opts.avoidPolygons ? { avoid_polygons: opts.avoidPolygons } : {}),
      },
    };
    return this.directions(opts.profile, body);
  }

  /** Routes through explicit ordered waypoints (used to bend the loop through POIs). */
  async generateThroughWaypoints(opts: OrsWaypointsOptions): Promise<OrsRouteResult> {
    const body: Record<string, unknown> = {
      coordinates: opts.waypoints.map((p) => [p.lon, p.lat]),
      elevation: true,
      extra_info: ORS_EXTRA_INFO,
      ...(opts.avoidFeatures?.length || opts.avoidPolygons
        ? {
            options: {
              ...(opts.avoidFeatures?.length ? { avoid_features: opts.avoidFeatures } : {}),
              ...(opts.avoidPolygons ? { avoid_polygons: opts.avoidPolygons } : {}),
            },
          }
        : {}),
    };
    return this.directions(opts.profile, body);
  }

  async geocode(address: string): Promise<LatLon | null> {
    const url = `${this.baseUrl}/geocode/search`;
    try {
      const { data } = await firstValueFrom(
        this.http.get(url, {
          params: { api_key: this.apiKey, text: address, size: 1, 'boundary.country': 'FR' },
        }),
      );
      const feature = data?.features?.[0];
      if (!feature) return null;
      const [lon, lat] = feature.geometry.coordinates;
      return { lat, lon };
    } catch (error) {
      this.logger.warn(`ORS geocoding failed for "${address}": ${(error as Error).message}`);
      return null;
    }
  }

  private async directions(profile: OrsProfile, body: Record<string, unknown>): Promise<OrsRouteResult> {
    const url = `${this.baseUrl}/v2/directions/${profile}/geojson`;
    const { data } = await firstValueFrom(
      this.http.post(url, body, {
        headers: {
          Authorization: this.apiKey,
          'Content-Type': 'application/json; charset=utf-8',
        },
      }),
    );

    const feature = data.features[0] as Feature<LineString>;
    const summary = feature.properties?.summary ?? {};
    const ascent = feature.properties?.ascent ?? 0;
    const descent = feature.properties?.descent ?? 0;

    return {
      geojson: feature,
      distanceM: Math.round(summary.distance ?? 0),
      durationS: Math.round(summary.duration ?? 0),
      ascentM: Math.round(ascent),
      descentM: Math.round(descent),
      extras: feature.properties?.extras ?? {},
    };
  }
}
