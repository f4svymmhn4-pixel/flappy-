import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { LatLon } from '../../common/geo/geo.util';

/**
 * Fallback elevation lookup for when a routing provider doesn't return
 * elevation itself (ORS normally does via `elevation: true`; this is used
 * for the GraphHopper fallback path or if ORS omits altitude on some points).
 */
@Injectable()
export class ElevationService {
  private readonly logger = new Logger(ElevationService.name);
  private readonly url: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.url = this.config.get<string>('apis.openElevationUrl')!;
  }

  async computeAscentDescent(points: LatLon[]): Promise<{ ascentM: number; descentM: number }> {
    try {
      const { data } = await firstValueFrom(
        this.http.post(this.url, {
          locations: points.map((p) => ({ latitude: p.lat, longitude: p.lon })),
        }),
      );
      const elevations: number[] = data.results.map((r: { elevation: number }) => r.elevation);
      let ascent = 0;
      let descent = 0;
      for (let i = 1; i < elevations.length; i++) {
        const diff = elevations[i] - elevations[i - 1];
        if (diff > 0) ascent += diff;
        else descent += Math.abs(diff);
      }
      return { ascentM: Math.round(ascent), descentM: Math.round(descent) };
    } catch (error) {
      this.logger.warn(`Open-Elevation lookup failed: ${(error as Error).message}`);
      return { ascentM: 0, descentM: 0 };
    }
  }
}
