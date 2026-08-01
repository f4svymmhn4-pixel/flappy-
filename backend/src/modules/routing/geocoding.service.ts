import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { LatLon } from '../../common/geo/geo.util';
import { OpenRouteServiceClient } from './providers/openrouteservice.client';

/**
 * Turns a free-text address into coordinates. Tries ORS Pelias geocoding
 * first (same API key as routing), then falls back to the public Nominatim
 * instance (OpenStreetMap, no key required, rate-limited to ~1 req/s).
 */
@Injectable()
export class GeocodingService {
  private readonly logger = new Logger(GeocodingService.name);

  constructor(
    private readonly ors: OpenRouteServiceClient,
    private readonly http: HttpService,
  ) {}

  async geocode(address: string): Promise<LatLon | null> {
    if (this.ors.isConfigured) {
      const result = await this.ors.geocode(address);
      if (result) return result;
    }

    try {
      const { data } = await firstValueFrom(
        this.http.get('https://nominatim.openstreetmap.org/search', {
          params: { q: address, format: 'json', limit: 1 },
          headers: { 'User-Agent': 'bike-route-generator/1.0' },
        }),
      );
      const hit = data?.[0];
      if (!hit) return null;
      return { lat: parseFloat(hit.lat), lon: parseFloat(hit.lon) };
    } catch (error) {
      this.logger.warn(`Nominatim geocoding failed: ${(error as Error).message}`);
      return null;
    }
  }
}
