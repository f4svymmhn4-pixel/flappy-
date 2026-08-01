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
