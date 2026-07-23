import { ATTRIBUTE_KEYS, type Attributes, type PositionDef } from "./types.js";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Note globale indicative (OVR), pondérée par les poids du poste. Résumé
 *  pour le joueur (hiérarchie, mercato) — jamais utilisée seule par la
 *  simulation de match, qui pioche dans les attributs pertinents. */
export function computeOVR(weights: Attributes, attributes: Attributes): number {
  let total = 0;
  for (const key of ATTRIBUTE_KEYS) {
    total += weights[key] * attributes[key];
  }
  return Math.round(total / 100);
}

/** Moyenne pondérée simple d'un sous-ensemble d'attributs, pour piloter les
 *  statistiques par poste et les probabilités de blessure/discipline. */
export function averageOf(attributes: Attributes, keys: AttributesKeysArg): number {
  if (keys.length === 0) return 0;
  const total = keys.reduce((sum, key) => sum + attributes[key], 0);
  return total / keys.length;
}

type AttributesKeysArg = (keyof Attributes)[];

/**
 * Attributs de plateau (valeur au pic de carrière) tirés à la création du
 * personnage : les attributs les plus pondérés pour le poste reçoivent une
 * cible plus haute, avec un aléa contrôlé par la graine.
 */
export function generatePeakAttributes(position: PositionDef, potential: number, rngNoise: (range: number) => number): Attributes {
  const result = {} as Attributes;
  for (const key of ATTRIBUTE_KEYS) {
    const weight = position.weights[key];
    // Un attribut à poids 30 vise ~88 de plateau à potentiel max, un
    // attribut à poids 1 vise ~55 : le poste façonne le profil du joueur.
    const target = 50 + (weight / 32) * 45 * potential;
    result[key] = Math.round(clamp(target * rngNoise(0.16), 30, 99));
  }
  return result;
}

/** Valeur de départ à 17 ans : une fraction du plateau, plus faible pour les
 *  attributs les plus exigeants (mental, jeu au pied) qui se travaillent
 *  dans la durée. */
export function generateStartAttributes(peak: Attributes): Attributes {
  const result = {} as Attributes;
  const startFraction: Record<keyof Attributes, number> = {
    puissance: 0.6,
    vitesse: 0.75,
    technique: 0.55,
    vision: 0.45,
    mental: 0.4,
    conditionPhysique: 0.65,
    jeuAuPied: 0.45,
    discipline: 0.55,
  };
  for (const key of ATTRIBUTE_KEYS) {
    result[key] = Math.round(clamp(peak[key] * startFraction[key], 20, 90));
  }
  return result;
}
