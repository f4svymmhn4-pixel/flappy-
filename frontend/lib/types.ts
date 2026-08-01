import type { Feature, LineString } from 'geojson';

export type BikeType = 'road' | 'gravel' | 'mtb' | 'electric' | 'city';
export type Difficulty = 'very_easy' | 'easy' | 'medium' | 'sporty' | 'very_sporty';
export type ElevationProfile = 'very_flat' | 'flat' | 'some_hills' | 'rolling' | 'mountain' | 'custom';
export type Priority =
  | 'tourism'
  | 'performance'
  | 'scenery'
  | 'quiet_roads'
  | 'max_bike_lanes'
  | 'climbing'
  | 'descent'
  | 'training'
  | 'leisure';

export interface Bike {
  id: string;
  name: string;
  type: BikeType;
  isDefault: boolean;
}

export interface GenerateRoutePayload {
  start: { address?: string; lat?: number; lon?: number };
  bikeType: BikeType;
  bikeId?: string;
  distanceKm: number;
  durationMinutes?: number;
  difficulty: Difficulty;
  elevationProfile: ElevationProfile;
  elevationCustomM?: number;
  priority: Priority;
  isLoop: boolean;
  avoidGravel?: boolean;
  avoidDirt?: boolean;
  avoidForest?: boolean;
  avoidCityCenter?: boolean;
  avoidTraffic?: boolean;
  avoidTrunkRoads?: boolean;
  avoidNoBikeLane?: boolean;
  avoidIndustrial?: boolean;
  avoidRoadworks?: boolean;
  followBikeLanes?: boolean;
  preferSmallRoads?: boolean;
  avoidTrafficLights?: boolean;
  avoidStopSigns?: boolean;
  preferRiverside?: boolean;
  preferVineyards?: boolean;
  preferViewpoints?: boolean;
  preferLakes?: boolean;
  preferOcean?: boolean;
}

export type PoiCategory =
  | 'viewpoint'
  | 'lake'
  | 'vineyard'
  | 'monument'
  | 'bridge'
  | 'castle'
  | 'village'
  | 'river'
  | 'ocean';

export interface RoutePoi {
  id: string;
  category: PoiCategory;
  name: string;
  lat: number;
  lon: number;
  distanceFromStartM: number;
  description?: string;
  wikipediaUrl?: string;
  photoUrl?: string;
}

export interface ScoreBreakdown {
  beauty: number;
  safety: number;
  flow: number;
  tourism: number;
  surfaceQuality: number;
  funFactor: number;
  variety: number;
  explanations: Record<string, string>;
}

export interface RouteRecord {
  id: string;
  name: string;
  geojson: Feature<LineString>;
  distanceM: number;
  durationS: number;
  ascentM: number;
  descentM: number;
  avgSpeedKmh: number;
  pctFlat: number;
  pctClimb: number;
  pctDescent: number;
  pctBikeLane: number;
  pctSecondary: number;
  pctDepartmental: number;
  scoreTotal: number;
  scoreBreakdown: ScoreBreakdown;
  starRating: number;
  starExplanation: string;
  pois: RoutePoi[];
  provider: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface DeepLink {
  app: string;
  label: string;
  url: string | null;
  supportLevel: 'full' | 'approximate' | 'manual_import';
  note: string;
}
