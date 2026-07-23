// Disposition de la feuille de match interactive — regroupement classique
// d'une composition d'équipe (1re ligne, 2e ligne, 3e ligne, charnière,
// centres, arrières), pas une liste déroulante (brief §6).

import type { PositionId } from "../../src/engine/types.js";

export const FORMATION_ROWS: PositionId[][] = [
  [1, 2, 3],
  [4, 5],
  [6, 8, 7],
  [9, 10],
  [12, 13],
  [11, 15, 14],
];
