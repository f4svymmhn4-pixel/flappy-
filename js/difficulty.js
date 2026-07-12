// La difficulté augmente en continu avec le score, sans jamais faire de saut
// brutal : deux courbes exponentielles qui plafonnent (vitesse) ou planchent
// (écart entre les tuyaux) doucement vers une limite. Fonctions pures, faciles
// à vérifier indépendamment du reste du jeu.
import {
  PIPE_SPEED_BASE,
  PIPE_GAP_BASE,
  DIFFICULTY_MAX_SPEED_MULT,
  DIFFICULTY_SPEED_RAMP_RATE,
  DIFFICULTY_MIN_GAP,
  DIFFICULTY_GAP_RAMP_RATE,
} from './config.js';

export function getSpeedForScore(score) {
  const mult =
    DIFFICULTY_MAX_SPEED_MULT -
    (DIFFICULTY_MAX_SPEED_MULT - 1) * Math.exp(-DIFFICULTY_SPEED_RAMP_RATE * score);
  return PIPE_SPEED_BASE * mult;
}

export function getGapForScore(score) {
  return (
    DIFFICULTY_MIN_GAP +
    (PIPE_GAP_BASE - DIFFICULTY_MIN_GAP) * Math.exp(-DIFFICULTY_GAP_RAMP_RATE * score)
  );
}
