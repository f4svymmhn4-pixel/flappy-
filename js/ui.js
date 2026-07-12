// Tout l'habillage textuel : score en jeu, écran d'accueil, écran de fin de
// partie. Dessiné directement au Canvas 2D, aucune ressource externe.
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  COLOR_TEXT,
  COLOR_TEXT_SHADOW,
  COLOR_PANEL_BG,
  COLOR_BUTTON,
  COLOR_BUTTON_TEXT,
  TEXT,
} from './config.js';

function drawText(ctx, text, x, y, { size = 20, weight = '700', align = 'center', color = COLOR_TEXT } = {}) {
  ctx.font = `${weight} ${size}px "Segoe UI", Arial, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = COLOR_TEXT_SHADOW;
  ctx.fillText(text, x + 2, y + 2);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function drawButton(ctx, label, x, y, width, height) {
  ctx.fillStyle = COLOR_BUTTON;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 10);
  ctx.fill();
  drawText(ctx, label, x + width / 2, y + height / 2, { size: 20, color: COLOR_BUTTON_TEXT });
}

export function renderScore(ctx, score) {
  drawText(ctx, String(score), CANVAS_WIDTH / 2, 70, { size: 48 });
}

export function renderHomeScreen(ctx, bestScore) {
  drawText(ctx, TEXT.title, CANVAS_WIDTH / 2, 140, { size: 30 });
  drawText(ctx, `${TEXT.bestScore} : ${bestScore}`, CANVAS_WIDTH / 2, 185, { size: 16 });
  drawButton(ctx, TEXT.play, CANVAS_WIDTH / 2 - 60, 360, 120, 46);
  drawText(ctx, TEXT.tapToStart, CANVAS_WIDTH / 2, 430, { size: 13, weight: '400' });
}

// alpha : 0..1, pour un fondu d'apparition une fois l'oiseau posé au sol.
export function renderGameOverPanel(ctx, { score, bestScore, isNewBest, alpha }) {
  if (alpha <= 0) return;

  const panelWidth = 260;
  const panelHeight = 210;
  const panelX = CANVAS_WIDTH / 2 - panelWidth / 2;
  const panelY = CANVAS_HEIGHT / 2 - panelHeight / 2 - 20;

  ctx.save();
  ctx.globalAlpha = alpha;

  ctx.fillStyle = COLOR_PANEL_BG;
  ctx.beginPath();
  ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 14);
  ctx.fill();

  drawText(ctx, TEXT.gameOver, CANVAS_WIDTH / 2, panelY + 38, { size: 22 });
  drawText(ctx, `${TEXT.score} : ${score}`, CANVAS_WIDTH / 2, panelY + 80, { size: 18 });
  drawText(ctx, `${TEXT.bestScore} : ${bestScore}`, CANVAS_WIDTH / 2, panelY + 108, { size: 18 });
  if (isNewBest) {
    drawText(ctx, TEXT.newBest, CANVAS_WIDTH / 2, panelY + 134, { size: 14, color: '#ffe27a' });
  }
  drawButton(ctx, TEXT.replay, CANVAS_WIDTH / 2 - 60, panelY + panelHeight - 56, 120, 42);

  ctx.restore();
}

export function renderFlash(ctx, alpha) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.restore();
}
