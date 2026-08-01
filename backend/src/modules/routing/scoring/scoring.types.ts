/** Per-criterion 0-100 sub-scores plus a human-readable explanation for each. */
export interface ScoreBreakdown {
  beauty: number;
  safety: number;
  flow: number;
  tourism: number;
  surfaceQuality: number;
  funFactor: number;
  variety: number;
  explanations: Record<keyof Omit<ScoreBreakdown, 'explanations'>, string>;
}

export interface SegmentExtras {
  distanceM: number;
  surface?: string; // ORS "surface" extra_info label
  wayType?: string; // ORS "waytype" extra_info label
  steepness?: number; // ORS "steepness" extra_info value
  suitability?: number; // ORS "suitability" extra_info value (0-10, higher = better for cycling)
  greenness?: number; // ORS "greenness" extra_info value (0-10)
  noise?: number; // ORS "noise" extra_info value (0-10, higher = noisier)
}

export interface RouteQualitySummary {
  scoreTotal: number; // 0-100
  starRating: number; // 0-5 in 0.5 steps
  starExplanation: string;
  breakdown: ScoreBreakdown;
  pctFlat: number;
  pctClimb: number;
  pctDescent: number;
  pctBikeLane: number;
  pctSecondary: number;
  pctDepartmental: number;
}
