import { generatePeakAttributes, generateStartAttributes } from "./attributes.js";
import { getPosition } from "./positions.js";
import type { Rng } from "./rng.js";
import type { Player, PositionId } from "./types.js";

export interface CreatePlayerOptions {
  name: string;
  nationality: string;
  position: PositionId;
  /** 0-1, potentiel caché tiré à la création (1 = futur international). */
  potential?: number;
  rng: Rng;
}

const CREATION_AGE = 17;

export function createPlayer(options: CreatePlayerOptions): Player {
  const { name, nationality, position, rng } = options;
  const potential = options.potential ?? clampPotential(rng.float() * 0.6 + rng.noise(0.3) * 0.2);
  const positionDef = getPosition(position);

  const peakAttributes = generatePeakAttributes(positionDef, potential, (range) => rng.noise(range));
  const startAttributes = generateStartAttributes(peakAttributes);

  return {
    name,
    nationality,
    position,
    age: CREATION_AGE,
    startAttributes,
    peakAttributes,
    attributes: startAttributes,
    fatigue: 0,
    reputation: 60,
    injuryHistory: [],
    disciplineHistory: [],
    concussionCount: 0,
    retired: false,
  };
}

function clampPotential(value: number): number {
  return Math.min(1, Math.max(0.15, value));
}
