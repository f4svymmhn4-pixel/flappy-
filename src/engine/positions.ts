// Données des 15 postes — dérivées de docs/modele-rugby.md §3.
// Fichier de données pur, aucune logique ici.

import { ATTRIBUTE_KEYS, type Attributes, type PositionDef, type PositionId } from "./types.js";

function weights(partial: Partial<Attributes>): Attributes {
  const result = {} as Attributes;
  for (const key of ATTRIBUTE_KEYS) {
    result[key] = partial[key] ?? 0;
  }
  const sum = ATTRIBUTE_KEYS.reduce((total, key) => total + result[key], 0);
  if (Math.abs(sum - 100) > 0.01) {
    throw new Error(`Les poids d'un poste doivent sommer à 100 (obtenu ${sum})`);
  }
  return result;
}

const FORWARD_CONTACT_SEVERITY = { benigne: 0.45, moyenne: 0.37, severe: 0.12, longue: 0.06 };
const BACKS_LIGHT_SEVERITY = { benigne: 0.5, moyenne: 0.32, severe: 0.12, longue: 0.06 };
const SPEEDSTER_SEVERITY = { benigne: 0.4, moyenne: 0.33, severe: 0.15, longue: 0.12 };

const CONTACT_CARDS = { yellow: 0.12, red: 0.008 };
const BACKS_CARDS = { yellow: 0.06, red: 0.004 };

export const POSITIONS: Record<PositionId, PositionDef> = {
  1: {
    id: 1,
    name: "Pilier gauche",
    ligne: "premiere-ligne",
    weights: weights({ puissance: 30, technique: 25, conditionPhysique: 15, discipline: 10, mental: 10, vision: 5, vitesse: 3, jeuAuPied: 2 }),
    peakAge: 29,
    declineMultiplier: 0.55,
    injuryBaseRate: 0.075,
    injurySeverityWeights: FORWARD_CONTACT_SEVERITY,
    cardBaseRate: CONTACT_CARDS,
    fallback: [3, 4],
    careerSpan: { min: 20, max: 37 },
    stats: [
      { key: "melees_tenues_pct", label: "Mêlées tenues", unit: "percent", attributes: ["technique", "puissance"], baseAvg: 88 },
      { key: "plaquages", label: "Plaquages", unit: "count", attributes: ["puissance", "conditionPhysique"], baseAvg: 8 },
    ],
  },
  2: {
    id: 2,
    name: "Talonneur",
    ligne: "premiere-ligne",
    weights: weights({ technique: 30, puissance: 20, conditionPhysique: 20, vision: 12, mental: 10, discipline: 5, vitesse: 2, jeuAuPied: 1 }),
    peakAge: 28,
    declineMultiplier: 0.65,
    injuryBaseRate: 0.07,
    injurySeverityWeights: FORWARD_CONTACT_SEVERITY,
    cardBaseRate: CONTACT_CARDS,
    fallback: [3],
    careerSpan: { min: 20, max: 35 },
    stats: [
      { key: "touches_reussies_pct", label: "Touches trouvées", unit: "percent", attributes: ["technique"], baseAvg: 87 },
      { key: "plaquages", label: "Plaquages", unit: "count", attributes: ["puissance", "conditionPhysique"], baseAvg: 10 },
    ],
  },
  3: {
    id: 3,
    name: "Pilier droit",
    ligne: "premiere-ligne",
    weights: weights({ puissance: 32, technique: 23, conditionPhysique: 15, discipline: 10, mental: 10, vision: 5, vitesse: 3, jeuAuPied: 2 }),
    peakAge: 30,
    declineMultiplier: 0.5,
    injuryBaseRate: 0.075,
    injurySeverityWeights: FORWARD_CONTACT_SEVERITY,
    cardBaseRate: CONTACT_CARDS,
    fallback: [1, 4],
    careerSpan: { min: 20, max: 38 },
    stats: [
      { key: "melees_tenues_pct", label: "Mêlées tenues", unit: "percent", attributes: ["technique", "puissance"], baseAvg: 88 },
      { key: "plaquages", label: "Plaquages", unit: "count", attributes: ["puissance", "conditionPhysique"], baseAvg: 8 },
    ],
  },
  4: {
    id: 4,
    name: "Deuxième ligne (touche/poussée)",
    ligne: "deuxieme-ligne",
    weights: weights({ puissance: 25, technique: 22, conditionPhysique: 18, mental: 12, vision: 10, discipline: 8, vitesse: 3, jeuAuPied: 2 }),
    peakAge: 28,
    declineMultiplier: 0.6,
    injuryBaseRate: 0.085,
    injurySeverityWeights: FORWARD_CONTACT_SEVERITY,
    cardBaseRate: CONTACT_CARDS,
    fallback: [5, 6],
    careerSpan: { min: 19, max: 35 },
    stats: [
      { key: "touches_gagnees", label: "Ballons de touche gagnés", unit: "count", attributes: ["technique", "puissance"], baseAvg: 6 },
      { key: "plaquages", label: "Plaquages", unit: "count", attributes: ["puissance", "conditionPhysique"], baseAvg: 11 },
    ],
  },
  5: {
    id: 5,
    name: "Deuxième ligne (plaquages/alignement)",
    ligne: "deuxieme-ligne",
    weights: weights({ puissance: 24, conditionPhysique: 20, technique: 18, mental: 13, vision: 12, discipline: 8, vitesse: 3, jeuAuPied: 2 }),
    peakAge: 27,
    declineMultiplier: 0.65,
    injuryBaseRate: 0.09,
    injurySeverityWeights: FORWARD_CONTACT_SEVERITY,
    cardBaseRate: CONTACT_CARDS,
    fallback: [4, 6],
    careerSpan: { min: 19, max: 34 },
    stats: [
      { key: "plaquages", label: "Plaquages", unit: "count", attributes: ["puissance", "conditionPhysique"], baseAvg: 13 },
      { key: "turnovers", label: "Turnovers provoqués", unit: "count", attributes: ["technique", "vision"], baseAvg: 1 },
    ],
  },
  6: {
    id: 6,
    name: "Troisième ligne aile (combat/volume)",
    ligne: "troisieme-ligne",
    weights: weights({ puissance: 22, conditionPhysique: 22, technique: 16, mental: 14, vision: 12, discipline: 8, vitesse: 4, jeuAuPied: 2 }),
    peakAge: 27,
    declineMultiplier: 0.8,
    injuryBaseRate: 0.085,
    injurySeverityWeights: FORWARD_CONTACT_SEVERITY,
    cardBaseRate: CONTACT_CARDS,
    fallback: [8, 5],
    careerSpan: { min: 19, max: 33 },
    stats: [
      { key: "plaquages", label: "Plaquages", unit: "count", attributes: ["puissance", "conditionPhysique"], baseAvg: 15 },
      { key: "turnovers", label: "Turnovers provoqués", unit: "count", attributes: ["technique", "vision"], baseAvg: 1.5 },
    ],
  },
  7: {
    id: 7,
    name: "Troisième ligne aile (grattage/vitesse au sol)",
    ligne: "troisieme-ligne",
    weights: weights({ technique: 22, conditionPhysique: 22, vision: 16, puissance: 16, mental: 12, discipline: 6, vitesse: 5, jeuAuPied: 1 }),
    peakAge: 26,
    declineMultiplier: 0.85,
    injuryBaseRate: 0.08,
    injurySeverityWeights: FORWARD_CONTACT_SEVERITY,
    cardBaseRate: CONTACT_CARDS,
    fallback: [6, 8],
    careerSpan: { min: 19, max: 32 },
    stats: [
      { key: "turnovers", label: "Turnovers gagnés (grattages)", unit: "count", attributes: ["technique", "vision"], baseAvg: 2 },
      { key: "plaquages", label: "Plaquages", unit: "count", attributes: ["puissance", "conditionPhysique"], baseAvg: 13 },
    ],
  },
  8: {
    id: 8,
    name: "Numéro 8",
    ligne: "troisieme-ligne",
    weights: weights({ puissance: 25, conditionPhysique: 20, vision: 16, technique: 15, mental: 12, discipline: 6, vitesse: 5, jeuAuPied: 1 }),
    peakAge: 27,
    declineMultiplier: 0.75,
    injuryBaseRate: 0.075,
    injurySeverityWeights: FORWARD_CONTACT_SEVERITY,
    cardBaseRate: CONTACT_CARDS,
    fallback: [6, 5],
    careerSpan: { min: 19, max: 33 },
    stats: [
      { key: "metres_gagnes", label: "Mètres gagnés", unit: "count", attributes: ["puissance", "vitesse"], baseAvg: 40 },
      { key: "plaquages", label: "Plaquages", unit: "count", attributes: ["puissance", "conditionPhysique"], baseAvg: 12 },
    ],
  },
  9: {
    id: 9,
    name: "Demi de mêlée",
    ligne: "charnière",
    weights: weights({ vision: 26, technique: 24, mental: 16, conditionPhysique: 12, vitesse: 10, jeuAuPied: 8, discipline: 3, puissance: 1 }),
    peakAge: 27,
    declineMultiplier: 0.55,
    injuryBaseRate: 0.06,
    injurySeverityWeights: BACKS_LIGHT_SEVERITY,
    cardBaseRate: BACKS_CARDS,
    fallback: [10],
    careerSpan: { min: 20, max: 35 },
    stats: [
      { key: "passes_reussies_pct", label: "Passes réussies", unit: "percent", attributes: ["technique", "vision"], baseAvg: 92 },
      { key: "metres_au_pied", label: "Mètres au pied (box-kick)", unit: "count", attributes: ["jeuAuPied"], baseAvg: 90 },
    ],
  },
  10: {
    id: 10,
    name: "Demi d'ouverture",
    ligne: "charnière",
    weights: weights({ jeuAuPied: 26, vision: 24, mental: 18, technique: 14, conditionPhysique: 8, vitesse: 5, puissance: 3, discipline: 2 }),
    peakAge: 29,
    declineMultiplier: 0.45,
    injuryBaseRate: 0.05,
    injurySeverityWeights: BACKS_LIGHT_SEVERITY,
    cardBaseRate: BACKS_CARDS,
    fallback: [15],
    careerSpan: { min: 20, max: 37 },
    stats: [
      { key: "reussite_pied_pct", label: "Réussite au pied", unit: "percent", attributes: ["jeuAuPied", "mental"], baseAvg: 78 },
      { key: "passes_decisives", label: "Passes décisives", unit: "count", attributes: ["vision", "technique"], baseAvg: 1.2 },
    ],
  },
  11: {
    id: 11,
    name: "Ailier (vitesse pure/finition)",
    ligne: "trois-quarts",
    weights: weights({ vitesse: 30, technique: 20, puissance: 14, vision: 12, mental: 10, conditionPhysique: 10, discipline: 3, jeuAuPied: 1 }),
    peakAge: 25,
    declineMultiplier: 1.15,
    injuryBaseRate: 0.045,
    injurySeverityWeights: SPEEDSTER_SEVERITY,
    cardBaseRate: BACKS_CARDS,
    fallback: [15, 13],
    careerSpan: { min: 19, max: 31 },
    stats: [
      { key: "essais", label: "Essais", unit: "count", attributes: ["vitesse", "technique"], baseAvg: 0.35 },
      { key: "defenseurs_battus", label: "Défenseurs battus", unit: "count", attributes: ["vitesse", "technique"], baseAvg: 2.2 },
    ],
  },
  12: {
    id: 12,
    name: "Premier centre",
    ligne: "trois-quarts",
    weights: weights({ puissance: 26, technique: 18, vision: 16, mental: 14, conditionPhysique: 14, vitesse: 8, discipline: 3, jeuAuPied: 1 }),
    peakAge: 26,
    declineMultiplier: 0.9,
    injuryBaseRate: 0.08,
    injurySeverityWeights: FORWARD_CONTACT_SEVERITY,
    cardBaseRate: BACKS_CARDS,
    fallback: [13, 8],
    careerSpan: { min: 19, max: 32 },
    stats: [
      { key: "metres_gagnes", label: "Mètres gagnés", unit: "count", attributes: ["puissance", "vitesse"], baseAvg: 35 },
      { key: "plaquages", label: "Plaquages", unit: "count", attributes: ["puissance", "conditionPhysique"], baseAvg: 9 },
    ],
  },
  13: {
    id: 13,
    name: "Deuxième centre",
    ligne: "trois-quarts",
    weights: weights({ vitesse: 20, vision: 22, technique: 18, mental: 14, puissance: 14, conditionPhysique: 10, discipline: 1, jeuAuPied: 1 }),
    peakAge: 26,
    declineMultiplier: 1.0,
    injuryBaseRate: 0.06,
    injurySeverityWeights: SPEEDSTER_SEVERITY,
    cardBaseRate: BACKS_CARDS,
    fallback: [12, 11],
    careerSpan: { min: 19, max: 32 },
    stats: [
      { key: "defenseurs_battus", label: "Défenseurs battus", unit: "count", attributes: ["vitesse", "vision"], baseAvg: 2.5 },
      { key: "plaquages_offensifs", label: "Plaquages offensifs (cut)", unit: "count", attributes: ["vision", "technique"], baseAvg: 1.5 },
    ],
  },
  14: {
    id: 14,
    name: "Ailier (vitesse pure/contre-attaque)",
    ligne: "trois-quarts",
    weights: weights({ vitesse: 30, technique: 20, puissance: 13, vision: 13, mental: 10, conditionPhysique: 10, discipline: 3, jeuAuPied: 1 }),
    peakAge: 25,
    declineMultiplier: 1.15,
    injuryBaseRate: 0.045,
    injurySeverityWeights: SPEEDSTER_SEVERITY,
    cardBaseRate: BACKS_CARDS,
    fallback: [15, 13],
    careerSpan: { min: 19, max: 31 },
    stats: [
      { key: "essais", label: "Essais", unit: "count", attributes: ["vitesse", "technique"], baseAvg: 0.35 },
      { key: "metres_parcourus", label: "Mètres parcourus", unit: "count", attributes: ["vitesse"], baseAvg: 55 },
    ],
  },
  15: {
    id: 15,
    name: "Arrière",
    ligne: "trois-quarts",
    weights: weights({ jeuAuPied: 20, vision: 20, technique: 18, mental: 16, vitesse: 12, conditionPhysique: 10, puissance: 3, discipline: 1 }),
    peakAge: 27,
    declineMultiplier: 0.85,
    injuryBaseRate: 0.06,
    injurySeverityWeights: BACKS_LIGHT_SEVERITY,
    cardBaseRate: BACKS_CARDS,
    fallback: [10, 13],
    careerSpan: { min: 19, max: 33 },
    stats: [
      { key: "metres_relance", label: "Mètres en relance", unit: "count", attributes: ["vision", "technique"], baseAvg: 60 },
      { key: "plaquages", label: "Plaquages", unit: "count", attributes: ["puissance", "conditionPhysique"], baseAvg: 6 },
    ],
  },
};

export function getPosition(id: PositionId): PositionDef {
  const def = POSITIONS[id];
  if (!def) throw new Error(`Poste inconnu : ${id}`);
  return def;
}
