// Modèle de discipline — docs/modele-rugby.md §6.
// Carton jaune : 10 minutes, pas de conséquence portée ici (simulée dans le
// résultat du match). Carton rouge : citation résolue par un barème de
// commission, modulé par la réputation du joueur (récidive = plus sévère).

import { clamp } from "./attributes.js";
import type { DisciplineRecord, Player, PositionDef } from "./types.js";
import type { Rng } from "./rng.js";

function disciplineFactor(discipline: number): number {
  return clamp((110 - discipline) / 80, 0.3, 1.8);
}

export function yellowCardProbability(player: Player, position: PositionDef): number {
  return clamp(position.cardBaseRate.yellow * disciplineFactor(player.attributes.discipline), 0, 0.4);
}

export function redCardProbability(player: Player, position: PositionDef): number {
  return clamp(position.cardBaseRate.red * disciplineFactor(player.attributes.discipline), 0, 0.08);
}

const SUSPENSION_BANDS: Array<{ min: number; max: number; weight: number }> = [
  { min: 2, max: 3, weight: 0 }, // pondération recalculée selon réputation
  { min: 4, max: 6, weight: 0 },
  { min: 6, max: 10, weight: 0 },
];

function suspensionWeeks(reputation: number, rng: Rng): number {
  // Réputation basse -> commission plus sévère (récidive/danger perçu comme élevé).
  const repFactor = clamp((100 - reputation) / 100, 0, 1);
  const bands = [
    { ...SUSPENSION_BANDS[0]!, weight: 0.55 - 0.35 * repFactor },
    { ...SUSPENSION_BANDS[1]!, weight: 0.3 },
    { ...SUSPENSION_BANDS[2]!, weight: 0.15 + 0.35 * repFactor },
  ];
  const band = rng.weightedPick(bands.map((b) => ({ value: b, weight: Math.max(0.01, b.weight) })));
  return rng.int(band.min, band.max);
}

export interface DisciplineRoll {
  record: DisciplineRecord;
  reputationDelta: number;
}

export function rollDiscipline(
  player: Player,
  position: PositionDef,
  season: number,
  matchIndex: number,
  rng: Rng,
): DisciplineRoll | undefined {
  if (rng.chance(redCardProbability(player, position))) {
    const weeksOut = suspensionWeeks(player.reputation, rng);
    return {
      record: { season, matchIndex, card: "red", suspensionWeeks: weeksOut },
      reputationDelta: -8,
    };
  }
  if (rng.chance(yellowCardProbability(player, position))) {
    return {
      record: { season, matchIndex, card: "yellow", suspensionWeeks: 0 },
      reputationDelta: -1,
    };
  }
  return undefined;
}
