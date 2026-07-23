// Progression / déclin d'une saison à l'autre — docs/modele-rugby.md §7.
// Le choix d'axe d'entraînement est auto-piloté ici (l'UI du jalon 3/4
// permettra au joueur de choisir manuellement) : on muscle en priorité
// l'attribut le plus pondéré par le poste et le plus en retard sur son
// propre plafond, sous contrainte de temps de jeu de la saison écoulée.

import { clamp } from "./attributes.js";
import { attributeValueAtAge } from "./ageCurve.js";
import { getPosition } from "./positions.js";
import type { Rng } from "./rng.js";
import { ATTRIBUTE_KEYS, type AttributeKey, type Player } from "./types.js";

function pickTrainingAxis(player: Player): AttributeKey {
  const positionDef = getPosition(player.position);
  let best: AttributeKey = "puissance";
  let bestScore = -Infinity;
  for (const key of ATTRIBUTE_KEYS) {
    const weight = positionDef.weights[key];
    if (weight <= 0) continue;
    const room = player.peakAttributes[key] - player.attributes[key];
    const score = weight * 0.6 + room * 0.4;
    if (score > bestScore) {
      bestScore = score;
      best = key;
    }
  }
  return best;
}

export function applyOffseason(player: Player, matchesPlayed: number, matchesScheduled: number, rng: Rng): void {
  const positionDef = getPosition(player.position);
  const playingTimeRatio = matchesScheduled > 0 ? matchesPlayed / matchesScheduled : 0;

  if (player.age <= positionDef.peakAge + 2) {
    const trainedKey = pickTrainingAxis(player);
    const ageFactor = clamp(1 - (player.age - 17) / 20, 0.15, 1);
    const gain = 3 * ageFactor * clamp(playingTimeRatio, 0.1, 1) * rng.noise(0.6);
    player.peakAttributes[trainedKey] = clamp(player.peakAttributes[trainedKey] + gain, 30, 99);
  }

  player.age += 1;

  for (const key of ATTRIBUTE_KEYS) {
    player.attributes[key] = Math.round(
      attributeValueAtAge({
        age: player.age,
        startValue: player.startAttributes[key],
        peakValue: player.peakAttributes[key],
        peakAge: positionDef.peakAge,
        attribute: key,
        declineMultiplier: positionDef.declineMultiplier,
      }),
    );
  }

  // La fraîcheur ne se remet jamais totalement à zéro d'une saison sur
  // l'autre après 30 ans passés — reflète l'accumulation de charge (§4).
  const baseRecovery = player.age > positionDef.peakAge + 2 ? 0.5 : 0.75;
  player.fatigue = clamp(player.fatigue * (1 - baseRecovery), 0, 1);
}
