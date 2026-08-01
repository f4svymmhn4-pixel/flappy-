import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { v4 as uuid } from 'uuid';
import type { Position } from 'geojson';
import { bboxAround, haversineDistanceM, LatLon } from '../../common/geo/geo.util';
import { Preferences } from '../../entities/preferences.entity';
import { PoiCategory, RoutePoi } from './poi.types';

interface OverpassElement {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface Candidate {
  category: PoiCategory;
  name: string;
  lat: number;
  lon: number;
  tags: Record<string, string>;
}

const OVERPASS_QUERY_BY_CATEGORY: Record<PoiCategory, string> = {
  viewpoint: 'node["tourism"="viewpoint"]',
  lake: 'way["natural"="water"]["water"!="reservoir"]',
  vineyard: 'way["landuse"="vineyard"]',
  monument: 'node["historic"~"monument|memorial"]',
  castle: 'node["historic"="castle"]',
  bridge: 'way["bridge"="yes"]["highway"]',
  village: 'node["place"~"village|hamlet"]',
  river: 'way["waterway"="river"]',
  ocean: 'way["natural"="coastline"]',
};

/** Landuse/leisure tags used to build ORS `avoid_polygons` for industrial zones. */
const INDUSTRIAL_QUERY = 'way["landuse"="industrial"]';

@Injectable()
export class PoiService {
  private readonly logger = new Logger(PoiService.name);
  private readonly overpassUrl: string;
  private readonly openTripMapKey: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.overpassUrl = this.config.get<string>('apis.overpassUrl')!;
    this.openTripMapKey = this.config.get<string>('apis.openTripMapKey')!;
  }

  /** Fetches candidate POIs within `radiusM` of `center`, filtered to categories the user actually wants. */
  async findCandidates(center: LatLon, radiusM: number, prefs: Preferences): Promise<Candidate[]> {
    const categories = this.selectCategories(prefs);
    if (categories.length === 0) return [];

    const bbox = bboxAround(center, radiusM);
    const [minLon, minLat, maxLon, maxLat] = bbox;
    const bboxStr = `${minLat},${minLon},${maxLat},${maxLon}`;

    const filters = categories.map((c) => `${OVERPASS_QUERY_BY_CATEGORY[c]}(${bboxStr});`).join('\n');
    const query = `[out:json][timeout:25];(\n${filters}\n);out center tags;`;

    try {
      const { data } = await firstValueFrom(
        this.http.post(this.overpassUrl, `data=${encodeURIComponent(query)}`, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          timeout: 20_000,
        }),
      );
      return this.mapElements(data.elements ?? [], categories);
    } catch (error) {
      this.logger.warn(`Overpass POI query failed: ${(error as Error).message}`);
      return [];
    }
  }

  /** Fetches industrial-zone polygons to feed ORS `avoid_polygons`. */
  async findIndustrialZones(center: LatLon, radiusM: number): Promise<Position[][]> {
    const [minLon, minLat, maxLon, maxLat] = bboxAround(center, radiusM);
    const query = `[out:json][timeout:25];(${INDUSTRIAL_QUERY}(${minLat},${minLon},${maxLat},${maxLon});); out geom;`;
    try {
      const { data } = await firstValueFrom(
        this.http.post(this.overpassUrl, `data=${encodeURIComponent(query)}`, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          timeout: 20_000,
        }),
      );
      return (data.elements ?? [])
        .filter((el: { geometry?: Array<{ lat: number; lon: number }> }) => el.geometry?.length)
        .map((el: { geometry: Array<{ lat: number; lon: number }> }) => el.geometry.map((p) => [p.lon, p.lat]));
    } catch (error) {
      this.logger.warn(`Overpass industrial-zone query failed: ${(error as Error).message}`);
      return [];
    }
  }

  /** Keeps only candidates close to the actual route and enriches them with Wikipedia/photo data. */
  async buildRouteHighlights(
    routeCoordinates: Array<[number, number]>,
    candidates: Candidate[],
    maxCount = 8,
  ): Promise<RoutePoi[]> {
    const nearRoute = candidates
      .map((c) => ({ c, ...this.distanceToRoute(c, routeCoordinates) }))
      .filter(({ minDistanceM }) => minDistanceM < 350)
      .sort((a, b) => a.minDistanceM - b.minDistanceM)
      .slice(0, maxCount);

    const enriched = await Promise.all(
      nearRoute.map(async ({ c, distanceFromStartM }) => this.enrich(c, distanceFromStartM)),
    );
    return enriched.sort((a, b) => a.distanceFromStartM - b.distanceFromStartM);
  }

  private selectCategories(prefs: Preferences): PoiCategory[] {
    const categories: PoiCategory[] = [];
    if (prefs.preferViewpoints) categories.push('viewpoint');
    if (prefs.preferLakes) categories.push('lake');
    if (prefs.preferVineyards) categories.push('vineyard');
    if (prefs.preferOcean) categories.push('ocean');
    if (prefs.preferRiverside) categories.push('river');
    if (prefs.priority === 'tourism' || prefs.priority === 'scenery' || prefs.priority === 'leisure') {
      categories.push('monument', 'castle', 'village', 'bridge');
    }
    return Array.from(new Set(categories));
  }

  private mapElements(elements: OverpassElement[], categories: PoiCategory[]): Candidate[] {
    const candidates: Candidate[] = [];
    for (const el of elements) {
      const lat = el.lat ?? el.center?.lat;
      const lon = el.lon ?? el.center?.lon;
      if (lat === undefined || lon === undefined || !el.tags) continue;

      const category = this.inferCategory(el.tags, categories);
      if (!category) continue;

      candidates.push({
        category,
        name: el.tags.name ?? this.defaultName(category),
        lat,
        lon,
        tags: el.tags,
      });
    }
    return candidates;
  }

  private inferCategory(tags: Record<string, string>, allowed: PoiCategory[]): PoiCategory | null {
    if (tags.tourism === 'viewpoint' && allowed.includes('viewpoint')) return 'viewpoint';
    if (tags.natural === 'water' && allowed.includes('lake')) return 'lake';
    if (tags.landuse === 'vineyard' && allowed.includes('vineyard')) return 'vineyard';
    if (tags.historic === 'castle' && allowed.includes('castle')) return 'castle';
    if (tags.historic && allowed.includes('monument')) return 'monument';
    if (tags.bridge === 'yes' && allowed.includes('bridge')) return 'bridge';
    if (tags.place && allowed.includes('village')) return 'village';
    if (tags.waterway === 'river' && allowed.includes('river')) return 'river';
    if (tags.natural === 'coastline' && allowed.includes('ocean')) return 'ocean';
    return null;
  }

  private defaultName(category: PoiCategory): string {
    const labels: Record<PoiCategory, string> = {
      viewpoint: 'Point de vue',
      lake: 'Plan d’eau',
      vineyard: 'Vignoble',
      monument: 'Monument',
      castle: 'Château',
      bridge: 'Pont remarquable',
      village: 'Village',
      river: 'Rivière',
      ocean: 'Littoral',
    };
    return labels[category];
  }

  private distanceToRoute(candidate: Candidate, routeCoordinates: Array<[number, number]>) {
    let minDistanceM = Infinity;
    let distanceFromStartM = 0;
    let cumulative = 0;
    for (let i = 0; i < routeCoordinates.length; i++) {
      const [lon, lat] = routeCoordinates[i];
      const d = haversineDistanceM({ lat: candidate.lat, lon: candidate.lon }, { lat, lon });
      if (d < minDistanceM) {
        minDistanceM = d;
        distanceFromStartM = cumulative;
      }
      if (i > 0) {
        const [plon, plat] = routeCoordinates[i - 1];
        cumulative += haversineDistanceM({ lat: plat, lon: plon }, { lat, lon });
      }
    }
    return { minDistanceM, distanceFromStartM };
  }

  private async enrich(candidate: Candidate, distanceFromStartM: number): Promise<RoutePoi> {
    const poi: RoutePoi = {
      id: uuid(),
      category: candidate.category,
      name: candidate.name,
      lat: candidate.lat,
      lon: candidate.lon,
      distanceFromStartM: Math.round(distanceFromStartM),
    };

    const wikiTitle = candidate.tags.wikipedia?.split(':').pop();
    if (wikiTitle) {
      try {
        const { data } = await firstValueFrom(
          this.http.get(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`),
        );
        poi.description = data.extract;
        poi.wikipediaUrl = data.content_urls?.desktop?.page;
        poi.photoUrl = data.thumbnail?.source;
      } catch {
        // Wikipedia summary is a nice-to-have; silently skip on failure/404.
      }
    }

    if (!poi.photoUrl && this.openTripMapKey) {
      try {
        const { data } = await firstValueFrom(
          this.http.get('https://api.opentripmap.com/0.1/en/places/radius', {
            params: {
              apikey: this.openTripMapKey,
              radius: 200,
              lon: candidate.lon,
              lat: candidate.lat,
              limit: 1,
            },
          }),
        );
        const feature = data?.features?.[0];
        const xid = feature?.properties?.xid;
        if (xid) {
          const detail = await firstValueFrom(
            this.http.get(`https://api.opentripmap.com/0.1/en/places/xid/${xid}`, {
              params: { apikey: this.openTripMapKey },
            }),
          );
          poi.photoUrl = detail.data?.preview?.source ?? poi.photoUrl;
          poi.description = poi.description ?? detail.data?.wikipedia_extracts?.text;
        }
      } catch {
        // OpenTripMap is optional (requires its own free API key); skip on failure.
      }
    }

    return poi;
  }
}
