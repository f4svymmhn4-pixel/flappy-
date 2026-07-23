// Orchestration d'une carrière complète, saison par saison, jusqu'à la
// retraite — moteur testable en CLI, sans UI (jalon 2 du brief).
//
// evaluateRetirement() est extraite pour être rejouée telle quelle par l'UI
// pas-à-pas (jalon 3) : une seule source de vérité pour les conditions de
// fin de carrière, jamais dupliquée entre le CLI et l'écran de jeu.

import { clamp, computeOVR } from "./attributes.js";
import { createPlayer } from "./player.js";
import { getPosition } from "./positions.js";
import { applyOffseason } from "./progression.js";
import { createRng, type Rng } from "./rng.js";
import { DEFAULT_SEASON_CONTEXT, simulateSeason, type SeasonContext } from "./season.js";
import type { CareerLog, Player, PositionDef, PositionId, SeasonSummary } from "./types.js";

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

export const FORMATION_SEASON_MATCHES: SeasonContext = { matchesScheduled: 14 };
export const FORMATION_MAX_AGE = 19;

// Fenêtre glissante plutôt que cumul sur toute la carrière : un pilier joue
// beaucoup plus de saisons qu'un ailier, un seuil cumulatif effacerait donc
// artificiellement l'avantage de longévité voulu par le modèle (§3 du
// doc — un pilier tient jusqu'à 37-38 ans malgré une exposition aux
// blessures plus élevée que les 3/4).
const SEVERE_INJURY_WINDOW_SEASONS = 4;
const SEVERE_INJURY_RETIREMENT_THRESHOLD = 4;
const CONCUSSION_RETIREMENT_THRESHOLD = 3;

export interface RetirementDecision {
  reason: CareerLog["retirementReason"];
}

/** Contexte de saison par défaut selon l'âge (centre de formation avant 19 ans). */
export function defaultSeasonContext(age: number): SeasonContext {
  return age < FORMATION_MAX_AGE ? FORMATION_SEASON_MATCHES : DEFAULT_SEASON_CONTEXT;
}

/**
 * Évalue si la carrière s'arrête à l'issue de la saison qui vient d'être
 * jouée. Ne modifie rien : à appeler après avoir poussé le résumé de saison
 * dans `seasons`, avant d'appliquer l'intersaison suivante.
 */
export function evaluateRetirement(
  player: Player,
  positionDef: PositionDef,
  seasons: SeasonSummary[],
  rng: Rng,
): RetirementDecision | undefined {
  if (player.concussionCount >= CONCUSSION_RETIREMENT_THRESHOLD) {
    return { reason: "commotions" };
  }

  const recentSevereInjuries = seasons
    .slice(-SEVERE_INJURY_WINDOW_SEASONS)
    .flatMap((s) => s.injuries)
    .filter((i) => i.severity === "severe" || i.severity === "longue").length;
  if (recentSevereInjuries >= SEVERE_INJURY_RETIREMENT_THRESHOLD) {
    return { reason: "blessure-recurrente" };
  }

  if (player.age >= positionDef.careerSpan.max) {
    return { reason: "declin" };
  }

  const ovr = computeOVR(positionDef.weights, player.attributes);
  if (player.age >= positionDef.careerSpan.min && ovr < 45) {
    const retireChance = clamp((player.age - positionDef.careerSpan.min) / 10, 0.05, 0.6);
    if (rng.chance(retireChance)) {
      return { reason: "choisie" };
    }
  }

  return undefined;
}

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
    const context = options.seasonContext ?? defaultSeasonContext(player.age);
    const summary = simulateSeason(player, seasonNumber, rng, context);
    seasons.push(summary);

    const decision = evaluateRetirement(player, positionDef, seasons, rng);
    if (decision) {
      retirementReason = decision.reason;
      break;
    }

    applyOffseason(player, summary.matchesPlayed, summary.matchesScheduled, rng);
  }

  player.retired = true;
  return { player, seasons, retirementAge: player.age, retirementReason };
}
