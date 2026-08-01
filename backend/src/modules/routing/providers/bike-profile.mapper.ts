import { BikeType } from '../../../entities/bike.entity';
import { Preferences } from '../../../entities/preferences.entity';

export type OrsProfile =
  | 'cycling-road'
  | 'cycling-regular'
  | 'cycling-mountain'
  | 'cycling-electric';

/** ORS `extra_info` layers we request on every route to feed the scoring engine. */
export const ORS_EXTRA_INFO = ['surface', 'waytype', 'waycategory', 'steepness', 'suitability', 'green', 'noise'];

/**
 * Maps the chosen bike + user preferences onto an OpenRouteService cycling
 * profile and the `avoid_features` list. This is where the hard rules from
 * the spec live, e.g. road bikes never get routed onto gravel/forest tracks.
 */
export function mapBikeToOrsProfile(bikeType: BikeType): OrsProfile {
  switch (bikeType) {
    case 'road':
      return 'cycling-road';
    case 'gravel':
      return 'cycling-regular'; // regular profile tolerates unpaved/track ways, unlike cycling-road
    case 'mtb':
      return 'cycling-mountain';
    case 'electric':
      return 'cycling-electric';
    case 'city':
    default:
      return 'cycling-regular';
  }
}

export function buildAvoidFeatures(bikeType: BikeType, prefs: Preferences): string[] {
  const avoid = new Set<string>();

  // Hard rule from the spec: road bikes never go through fords or ferries.
  if (bikeType === 'road') {
    avoid.add('fords');
    avoid.add('ferries');
  }
  if (prefs.avoidRoadworks) avoid.add('fords'); // ORS has no direct "roadworks" avoid; fords is the closest hazard proxy
  return Array.from(avoid);
}

/**
 * Hints passed to the scoring/POI layer (not native ORS params) describing
 * which OSM surfaces/way types must be excluded post-hoc since ORS
 * avoid_features does not cover them directly (gravel, forest, unpaved...).
 */
export interface SurfaceExclusionRules {
  excludeSurfaces: string[];
  excludeWayTypes: string[];
  excludeLanduse: string[];
}

export function buildSurfaceExclusionRules(
  bikeType: BikeType,
  prefs: Preferences,
): SurfaceExclusionRules {
  const excludeSurfaces = new Set<string>();
  const excludeWayTypes = new Set<string>();
  const excludeLanduse = new Set<string>();

  if (bikeType === 'road') {
    // Never gravel, sand, dirt or degraded tracks for a road bike.
    ['gravel', 'unpaved', 'ground', 'dirt', 'sand', 'grass', 'compacted'].forEach((s) =>
      excludeSurfaces.add(s),
    );
    excludeWayTypes.add('track');
    excludeWayTypes.add('path');
  }

  if (prefs.avoidGravel) excludeSurfaces.add('gravel');
  if (prefs.avoidDirt) {
    excludeSurfaces.add('dirt');
    excludeSurfaces.add('ground');
    excludeSurfaces.add('unpaved');
  }
  if (prefs.avoidForest) excludeLanduse.add('forest');
  if (prefs.avoidIndustrial) excludeLanduse.add('industrial');

  return {
    excludeSurfaces: Array.from(excludeSurfaces),
    excludeWayTypes: Array.from(excludeWayTypes),
    excludeLanduse: Array.from(excludeLanduse),
  };
}
