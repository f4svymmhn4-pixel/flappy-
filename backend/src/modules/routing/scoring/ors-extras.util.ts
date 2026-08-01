import { SegmentExtras } from './scoring.types';
import { lineStringLengthM } from '../../../common/geo/geo.util';

/** Label tables from the OpenRouteService `extra_info` documentation. */
export const ORS_SURFACE_LABELS: Record<number, string> = {
  0: 'unknown',
  1: 'paved',
  2: 'unpaved',
  3: 'asphalt',
  4: 'concrete',
  5: 'cobblestone',
  6: 'metal',
  7: 'wood',
  8: 'compacted_gravel',
  9: 'fine_gravel',
  10: 'gravel',
  11: 'dirt',
  12: 'ground',
  13: 'ice',
  14: 'paving_stones',
  15: 'sand',
  16: 'woodchips',
  17: 'grass',
  18: 'grass_paver',
};

export const ORS_WAYTYPE_LABELS: Record<number, string> = {
  0: 'unknown',
  1: 'state_road',
  2: 'road',
  3: 'street',
  4: 'path',
  5: 'track',
  6: 'cycleway',
  7: 'footway',
  8: 'steps',
  9: 'ferry',
  10: 'construction',
};

export const ORS_WAYCATEGORY_FLAGS: Record<number, string> = {
  0: 'none',
  1: 'highway',
  2: 'steps',
  3: 'unpaved_road',
  4: 'ferry',
  5: 'track',
  6: 'tunnel',
  7: 'pedestrian',
  8: 'bridge',
  9: 'ford',
};

interface OrsExtraLayer {
  values: Array<[number, number, number]>;
}

export interface OrsExtras {
  surface?: OrsExtraLayer;
  waytype?: OrsExtraLayer;
  waycategory?: OrsExtraLayer;
  steepness?: OrsExtraLayer;
  suitability?: OrsExtraLayer;
  green?: OrsExtraLayer;
  noise?: OrsExtraLayer;
}

/**
 * ORS returns extras as index ranges over the route's coordinate array, e.g.
 * `surface.values = [[0, 12, 3], [12, 40, 10], ...]` meaning coordinates 0-12
 * are surface id 3 (asphalt). This walks every layer and turns it into a
 * flat list of segments with real distances, so the scoring engine can
 * weight each criterion by how much of the ride it actually covers.
 */
export function extractSegments(
  coordinates: Array<[number, number, number?]>,
  extras: OrsExtras,
): SegmentExtras[] {
  const segments: SegmentExtras[] = [];

  // Use whichever layer has the finest granularity to drive segment boundaries;
  // surface is the most consistently populated layer in practice.
  const driver = extras.surface ?? extras.waytype ?? extras.suitability;
  if (!driver) {
    const coords2d = coordinates.map(([lon, lat]) => [lon, lat] as [number, number]);
    return [{ distanceM: lineStringLengthM(coords2d) }];
  }

  const findValueAt = (layer: OrsExtraLayer | undefined, idx: number): number | undefined => {
    const range = layer?.values.find(([start, end]) => idx >= start && idx < end);
    return range?.[2];
  };

  for (const [start, end] of driver.values) {
    const segCoords = coordinates.slice(start, end + 1).map(([lon, lat]) => [lon, lat] as [number, number]);
    const distanceM = lineStringLengthM(segCoords);
    if (distanceM <= 0) continue;

    segments.push({
      distanceM,
      surface: ORS_SURFACE_LABELS[findValueAt(extras.surface, start) ?? 0],
      wayType: ORS_WAYTYPE_LABELS[findValueAt(extras.waytype, start) ?? 0],
      steepness: findValueAt(extras.steepness, start),
      suitability: findValueAt(extras.suitability, start),
      greenness: findValueAt(extras.green, start),
      noise: findValueAt(extras.noise, start),
    });
  }

  return segments.length > 0 ? segments : [{ distanceM: 0 }];
}
