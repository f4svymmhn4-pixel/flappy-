import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import type { Feature, LineString } from 'geojson';
import { LatLon } from '../../../common/geo/geo.util';
import { OrsRouteResult } from './openrouteservice.client';
import { BikeType } from '../../../entities/bike.entity';

/**
 * Fallback provider used only when OpenRouteService is unreachable or its
 * daily quota is exhausted. GraphHopper's free tier does not expose the same
 * per-segment surface/waytype breakdown as ORS `extra_info`, so routes
 * generated here get a coarser, distance/elevation-only score (see
 * ScoringService.scoreWithoutExtras).
 */
@Injectable()
export class GraphHopperClient {
  private readonly logger = new Logger(GraphHopperClient.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.get<string>('apis.graphHopperUrl')!;
    this.apiKey = this.config.get<string>('apis.graphHopperKey')!;
  }

  get isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  private mapProfile(bikeType: BikeType): string {
    switch (bikeType) {
      case 'road':
        return 'racingbike';
      case 'mtb':
        return 'mtb';
      case 'electric':
        return 'bike'; // GraphHopper has no dedicated e-bike weighting on the free tier
      default:
        return 'bike';
    }
  }

  async generateRoundTrip(
    start: LatLon,
    bikeType: BikeType,
    lengthM: number,
  ): Promise<OrsRouteResult> {
    const url = `${this.baseUrl}/route`;
    const { data } = await firstValueFrom(
      this.http.get(url, {
        params: {
          key: this.apiKey,
          point: `${start.lat},${start.lon}`,
          profile: this.mapProfile(bikeType),
          'round_trip.distance': lengthM,
          'round_trip.seed': Math.floor(Math.random() * 1000),
          algorithm: 'round_trip',
          points_encoded: false,
          elevation: true,
          type: 'json',
        },
      }),
    );

    const path = data.paths[0];
    const geojson: Feature<LineString> = {
      type: 'Feature',
      properties: {},
      geometry: path.points,
    };

    return {
      geojson,
      distanceM: Math.round(path.distance),
      durationS: Math.round(path.time / 1000),
      ascentM: Math.round(path.ascend ?? 0),
      descentM: Math.round(path.descend ?? 0),
      extras: {},
    };
  }

  async geocode(address: string): Promise<LatLon | null> {
    try {
      const { data } = await firstValueFrom(
        this.http.get(`${this.baseUrl}/geocode`, {
          params: { key: this.apiKey, q: address, limit: 1 },
        }),
      );
      const hit = data?.hits?.[0];
      if (!hit) return null;
      return { lat: hit.point.lat, lon: hit.point.lng };
    } catch (error) {
      this.logger.warn(`GraphHopper geocoding failed: ${(error as Error).message}`);
      return null;
    }
  }
}
