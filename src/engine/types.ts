// Types partagés du moteur de simulation. Modules purs, aucune dépendance UI.

export type AttributeKey =
  | "puissance"
  | "vitesse"
  | "technique"
  | "vision"
  | "mental"
  | "conditionPhysique"
  | "jeuAuPied"
  | "discipline";

export const ATTRIBUTE_KEYS: AttributeKey[] = [
  "puissance",
  "vitesse",
  "technique",
  "vision",
  "mental",
  "conditionPhysique",
  "jeuAuPied",
  "discipline",
];

export type Attributes = Record<AttributeKey, number>;

export type PositionId =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export type InjurySeverity = "benigne" | "moyenne" | "severe" | "longue";

export interface StatDefinition {
  key: string;
  label: string;
  unit: "count" | "percent";
  /** Attributs pertinents pour cette statistique (moyenne pondérée simple). */
  attributes: AttributeKey[];
  /** Valeur moyenne par match à un niveau de référence (attribut moyen = 70). */
  baseAvg: number;
}

export interface PositionDef {
  id: PositionId;
  name: string;
  ligne: "premiere-ligne" | "deuxieme-ligne" | "troisieme-ligne" | "charnière" | "trois-quarts";
  weights: Attributes;
  peakAge: number;
  declineMultiplier: number;
  injuryBaseRate: number;
  injurySeverityWeights: Record<InjurySeverity, number>;
  cardBaseRate: { yellow: number; red: number };
  stats: StatDefinition[];
  fallback: PositionId[];
  careerSpan: { min: number; max: number };
}

export interface InjuryRecord {
  season: number;
  matchIndex: number;
  severity: InjurySeverity;
  weeksOut: number;
}

export interface DisciplineRecord {
  season: number;
  matchIndex: number;
  card: "yellow" | "red";
  suspensionWeeks: number;
}

export interface Player {
  name: string;
  nationality: string;
  position: PositionId;
  age: number;
  /** Valeur à 17 ans, fixée à la création — sert de point de départ à la courbe d'âge. */
  startAttributes: Attributes;
  /** Valeur de plateau (pic de carrière) par attribut — peut croître légèrement avec l'entraînement (§7). */
  peakAttributes: Attributes;
  /** Valeur effective actuelle, recalculée à chaque saison via la courbe d'âge. */
  attributes: Attributes;
  fatigue: number;
  reputation: number; // 0-100, baisse avec les cartons/commissions
  injuryHistory: InjuryRecord[];
  disciplineHistory: DisciplineRecord[];
  concussionCount: number;
  retired: boolean;
}

export interface MatchLog {
  matchIndex: number;
  played: boolean;
  statLine: Record<string, number>;
  injury?: InjuryRecord;
  discipline?: DisciplineRecord;
}

export interface SeasonSummary {
  season: number;
  age: number;
  matchesScheduled: number;
  matchesPlayed: number;
  weeksOutInjury: number;
  weeksOutSuspension: number;
  statTotals: Record<string, number>;
  injuries: InjuryRecord[];
  disciplineEvents: DisciplineRecord[];
  ovrStart: number;
  ovrEnd: number;
}

export interface CareerLog {
  player: Player;
  seasons: SeasonSummary[];
  retirementAge: number;
  retirementReason: "choisie" | "declin" | "blessure-recurrente" | "commotions";
}
