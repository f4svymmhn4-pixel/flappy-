// Orchestration d'une carrière complète, saison par saison, jusqu'à la
// retraite — moteur testable en CLI, sans UI (jalon 2 du brief).

import { clamp, computeOVR } from "./attributes.js";
import { createPlayer } from "./player.js";
import { getPosition } from "./positions.js";
import { applyOffseason } from "./progression.js";
import { createRng } from "./rng.js";
import { DEFAULT_SEASON_CONTEXT, simulateSeason, type SeasonContext } from "./season.js";
import type { CareerLog, PositionId } from "./types.js";

export interface CareerOptions {
  name: string;
  nationality: string;
  position: PositionId;
  /** 0-1, potentiel caché. Aléatoire si omis. */
  potential?: number;
  seed: number;
  seasonContext?: SeasonContext;
  /** Garde-fou anti-boucle infinie ; une carrière réaliste tient largement en-dessous. */
  maxSeasons?: number;
}

const FORMATION_SEASON_MATCHES: SeasonContext = { matchesScheduled: 14 };
// Fenêtre glissante plutôt que cumul sur toute la carrière : un pilier joue
// beaucoup plus de saisons qu'un ailier, un seuil cumulatif effacerait donc
// artificiellement l'avantage de longévité voulu par le modèle (§3 du
// doc — un pilier tient jusqu'à 37-38 ans malgré une exposition aux
// blessures plus élevée que les 3/4).
const SEVERE_INJURY_WINDOW_SEASONS = 4;
const SEVERE_INJURY_RETIREMENT_THRESHOLD = 4;
const CONCUSSION_RETIREMENT_THRESHOLD = 3;

export function simulateCareer(options: CareerOptions): CareerLog {
  const rng = createRng(options.seed);
  const player = createPlayer({
    name: options.name,
    nationality: options.nationality,
    position: options.position,
    potential: options.potential,
    rng,
  });
  const positionDef = getPosition(options.position);
  const seasons: CareerLog["seasons"] = [];
  const maxSeasons = options.maxSeasons ?? 25;

  let retirementReason: CareerLog["retirementReason"] = "declin";

  for (let seasonNumber = 1; seasonNumber <= maxSeasons; seasonNumber++) {
    const isFormation = player.age < 19;
    const context = options.seasonContext ?? (isFormation ? FORMATION_SEASON_MATCHES : DEFAULT_SEASON_CONTEXT);
    const summary = simulateSeason(player, seasonNumber, rng, context);
    seasons.push(summary);

    if (player.concussionCount >= CONCUSSION_RETIREMENT_THRESHOLD) {
      retirementReason = "commotions";
      break;
    }
    const recentSevereInjuries = seasons
      .slice(-SEVERE_INJURY_WINDOW_SEASONS)
      .flatMap((s) => s.injuries)
      .filter((i) => i.severity === "severe" || i.severity === "longue").length;
    if (recentSevereInjuries >= SEVERE_INJURY_RETIREMENT_THRESHOLD) {
      retirementReason = "blessure-recurrente";
      break;
    }

    if (player.age >= positionDef.careerSpan.max) {
      retirementReason = "declin";
      break;
    }

    const ovr = computeOVR(positionDef.weights, player.attributes);
    if (player.age >= positionDef.careerSpan.min && ovr < 45) {
      const retireChance = clamp((player.age - positionDef.careerSpan.min) / 10, 0.05, 0.6);
      if (rng.chance(retireChance)) {
        retirementReason = "choisie";
        break;
      }
    }

    applyOffseason(player, summary.matchesPlayed, summary.matchesScheduled, rng);
  }

  player.retired = true;
  return { player, seasons, retirementAge: player.age, retirementReason };
}
