// Courbe d'âge générique — docs/modele-rugby.md §2.
// Trois phases : croissance (17 -> pic-3), plateau (pic-3 -> pic+2),
// déclin (au-delà de pic+2), avec une pente de déclin propre à chaque
// attribut, modulée par un multiplicateur de poste.

import type { AttributeKey } from "./types.js";

/** Pente de déclin de référence par attribut (docs/modele-rugby.md §2). */
export const DECLINE_PENTE_BASE: Record<AttributeKey, number> = {
  vitesse: 1.0,
  conditionPhysique: 0.85,
  puissance: 0.55,
  technique: 0.35,
  jeuAuPied: 0.3,
  vision: 0.15,
  mental: 0.1,
  discipline: 0.1,
};

const MIN_ATTRIBUTE_VALUE = 15;

/** Progression avec rendements décroissants, t dans [0,1] -> [0,1]. */
export function growthProgress(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - clamped, 1.6);
}

export interface AgeCurveParams {
  age: number;
  startValue: number;
  peakValue: number;
  peakAge: number;
  attribute: AttributeKey;
  declineMultiplier: number;
}

/**
 * Valeur effective d'un attribut à un âge donné, étant donné sa valeur de
 * départ (17 ans) et sa valeur de plateau (pic de carrière).
 */
export function attributeValueAtAge(params: AgeCurveParams): number {
  const { age, startValue, peakValue, peakAge, attribute, declineMultiplier } = params;
  const growthEndAge = peakAge - 3;
  const plateauEndAge = peakAge + 2;

  if (age <= growthEndAge) {
    const span = Math.max(1, growthEndAge - 17);
    const t = (age - 17) / span;
    return startValue + (peakValue - startValue) * growthProgress(t);
  }

  if (age <= plateauEndAge) {
    return peakValue;
  }

  const yearsIntoDecline = age - plateauEndAge;
  const pente = DECLINE_PENTE_BASE[attribute] * declineMultiplier;
  const decline = pente * Math.pow(yearsIntoDecline, 1.25);
  return Math.max(MIN_ATTRIBUTE_VALUE, peakValue - decline);
}
