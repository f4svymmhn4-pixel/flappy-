// Accès localStorage centralisé et protégé : certains navigateurs (Safari en
// navigation privée, par exemple) lèvent une exception à l'accès — le jeu ne
// doit jamais planter pour autant.
import { STORAGE_KEY_BEST_SCORE, STORAGE_KEY_MUTED } from './config.js';

export function getBestScore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BEST_SCORE);
    const value = parseInt(raw, 10);
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

// Enregistre le score s'il dépasse le record actuel et renvoie le nouveau record.
export function saveBestScoreIfHigher(score) {
  const best = getBestScore();
  if (score <= best) return best;
  try {
    localStorage.setItem(STORAGE_KEY_BEST_SCORE, String(score));
  } catch {
    // Stockage indisponible : le record vit seulement le temps de la session.
  }
  return score;
}

export function getMuted() {
  try {
    return localStorage.getItem(STORAGE_KEY_MUTED) === 'true';
  } catch {
    return false;
  }
}

export function saveMuted(muted) {
  try {
    localStorage.setItem(STORAGE_KEY_MUTED, String(muted));
  } catch {
    // Ignoré : la préférence ne sera simplement pas retenue.
  }
}
