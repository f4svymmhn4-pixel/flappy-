// Orchestration d'une partie côté UI : pas de logique de jeu ici, seulement
// des appels aux modules purs de src/engine, saison par saison, pilotés par
// les clics de l'utilisateur.

import { computeOVR } from "../../src/engine/attributes.js";
import { defaultSeasonContext, evaluateRetirement, type RetirementDecision } from "../../src/engine/career.js";
import { createPlayer } from "../../src/engine/player.js";
import { getPosition } from "../../src/engine/positions.js";
import { applyOffseason } from "../../src/engine/progression.js";
import { createRng, type Rng } from "../../src/engine/rng.js";
import { simulateSeason } from "../../src/engine/season.js";
import type { Player, PositionDef, PositionId, SeasonSummary } from "../../src/engine/types.js";

export interface CareerFlavor {
  gabarit: string;
  temperament: string;
  origine: string;
}

export interface NewCareerOptions {
  name: string;
  nationality: string;
  position: PositionId;
  flavor: CareerFlavor;
  seed: number;
}

export class GameSession {
  readonly rng: Rng;
  readonly player: Player;
  readonly positionDef: PositionDef;
  readonly flavor: CareerFlavor;
  readonly seasons: SeasonSummary[] = [];
  seasonNumber = 1;
  retired = false;
  retirementReason: RetirementDecision["reason"] | undefined;

  constructor(options: NewCareerOptions) {
    this.rng = createRng(options.seed);
    this.player = createPlayer({
      name: options.name,
      nationality: options.nationality,
      position: options.position,
      rng: this.rng,
    });
    this.positionDef = getPosition(options.position);
    this.flavor = options.flavor;
  }

  get ovr(): number {
    return computeOVR(this.positionDef.weights, this.player.attributes);
  }

  playSeason(): SeasonSummary {
    if (this.retired) {
      throw new Error("La carrière est terminée.");
    }
    const context = defaultSeasonContext(this.player.age);
    const summary = simulateSeason(this.player, this.seasonNumber, this.rng, context);
    this.seasons.push(summary);

    const decision = evaluateRetirement(this.player, this.positionDef, this.seasons, this.rng);
    if (decision) {
      this.retired = true;
      this.retirementReason = decision.reason;
      this.player.retired = true;
    } else {
      applyOffseason(this.player, summary.matchesPlayed, summary.matchesScheduled, this.rng);
      this.seasonNumber += 1;
    }
    return summary;
  }
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}
