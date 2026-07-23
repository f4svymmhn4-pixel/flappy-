// Modèle de blessures — docs/modele-rugby.md §5.
// P(blessure) = base_poste × mod_âge × mod_fatigue × mod_condition_physique

import { clamp } from "./attributes.js";
import type { InjuryRecord, InjurySeverity, Player, PositionDef } from "./types.js";
import type { Rng } from "./rng.js";

const SEVERITY_WEEKS: Record<InjurySeverity, [number, number]> = {
  benigne: [1, 2],
  moyenne: [3, 6],
  severe: [8, 16],
  longue: [24, 52],
};

/** Le protocole commotion impose un minimum incompressible, jamais raccourci. */
export const COMMOTION_MIN_WEEKS = 3;

export function injuryProbability(player: Player, position: PositionDef): number {
  const ageOverPeak = Math.max(0, player.age - (position.peakAge + 3));
  const modAge = 1 + ageOverPeak * 0.03;
  const modFatigue = 1 + player.fatigue * 0.6;
  const modCondition = clamp(1 - (player.attributes.conditionPhysique - 50) / 200, 0.7, 1.3);
  return clamp(position.injuryBaseRate * modAge * modFatigue * modCondition, 0, 0.6);
}

export function rollInjury(
  player: Player,
  position: PositionDef,
  season: number,
  matchIndex: number,
  rng: Rng,
): InjuryRecord | undefined {
  if (!rng.chance(injuryProbability(player, position))) return undefined;

  const severity = rng.weightedPick(
    (Object.entries(position.injurySeverityWeights) as [InjurySeverity, number][]).map(
      ([value, weight]) => ({ value, weight }),
    ),
  );
  const [min, max] = SEVERITY_WEEKS[severity];
  let weeksOut = rng.int(min, max);

  // Une commotion sur blessure "moyenne" déclenche le protocole obligatoire.
  const isConcussion = severity === "moyenne" && rng.chance(0.12);
  if (isConcussion) {
    weeksOut = Math.max(weeksOut, COMMOTION_MIN_WEEKS);
  }

  return { season, matchIndex, severity, weeksOut, isConcussion };
}
