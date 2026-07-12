// Gère le tableau des paires de tuyaux : génération, défilement, détection du
// franchissement (score) et rendu. Le rythme de spawn et la vitesse courante
// sont décidés par game.js (voir sa boucle updatePlaying) ; l'écart vertical
// de chaque tuyau est figé au moment de sa création (voir difficulty.js), si
// bien qu'un tuyau déjà à l'écran ne change jamais de forme en vol.
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GROUND_HEIGHT,
  PIPE_WIDTH,
  PIPE_CAP_HEIGHT,
  PIPE_CAP_OVERHANG,
  PIPE_MIN_TOP_MARGIN,
  COLOR_PIPE_LIGHT,
  COLOR_PIPE_DARK,
  COLOR_PIPE_EDGE,
} from './config.js';
import { getGapForScore } from './difficulty.js';

export class PipeManager {
  constructor() {
    this.pipes = [];
  }

  reset() {
    this.pipes = [];
  }

  spawnPipe(score) {
    const gap = getGapForScore(score);
    const playfieldBottom = CANVAS_HEIGHT - GROUND_HEIGHT;
    const minCenter = PIPE_MIN_TOP_MARGIN + gap / 2;
    const maxCenter = playfieldBottom - PIPE_MIN_TOP_MARGIN - gap / 2;
    const gapCenterY = minCenter + Math.random() * Math.max(0, maxCenter - minCenter);

    this.pipes.push({
      x: CANVAS_WIDTH,
      gapCenterY,
      gapTop: gapCenterY - gap / 2,
      gapBottom: gapCenterY + gap / 2,
      scored: false,
      collisionRects: [],
    });
  }

  // speed : px/s courant, fourni par game.js (recalculé à chaque spawn de tuyau).
  // onScore : callback appelé quand un tuyau vient d'être franchi par l'oiseau.
  update(dt, speed, birdX, onScore) {
    const playfieldBottom = CANVAS_HEIGHT - GROUND_HEIGHT;

    for (const pipe of this.pipes) {
      pipe.x -= speed * dt;

      pipe.collisionRects = [
        { x: pipe.x, y: 0, width: PIPE_WIDTH, height: pipe.gapTop },
        { x: pipe.x, y: pipe.gapBottom, width: PIPE_WIDTH, height: playfieldBottom - pipe.gapBottom },
      ];

      if (!pipe.scored && pipe.x + PIPE_WIDTH < birdX) {
        pipe.scored = true;
        onScore();
      }
    }

    this.pipes = this.pipes.filter((pipe) => pipe.x + PIPE_WIDTH > 0);
  }

  render(ctx) {
    for (const pipe of this.pipes) {
      this.renderPipeSegment(ctx, pipe.x, 0, pipe.gapTop, true);
      const playfieldBottom = CANVAS_HEIGHT - GROUND_HEIGHT;
      this.renderPipeSegment(ctx, pipe.x, pipe.gapBottom, playfieldBottom - pipe.gapBottom, false);
    }
  }

  renderPipeSegment(ctx, x, y, height, isTopPipe) {
    if (height <= 0) return;
    const gradient = ctx.createLinearGradient(x, 0, x + PIPE_WIDTH, 0);
    gradient.addColorStop(0, COLOR_PIPE_DARK);
    gradient.addColorStop(0.5, COLOR_PIPE_LIGHT);
    gradient.addColorStop(1, COLOR_PIPE_DARK);

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, PIPE_WIDTH, height);
    ctx.strokeStyle = COLOR_PIPE_EDGE;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, PIPE_WIDTH, height);

    // Embouchure élargie côté ouverture, pour la silhouette caractéristique d'un tuyau.
    const capY = isTopPipe ? y + height - PIPE_CAP_HEIGHT : y;
    ctx.fillStyle = gradient;
    ctx.fillRect(x - PIPE_CAP_OVERHANG, capY, PIPE_WIDTH + PIPE_CAP_OVERHANG * 2, PIPE_CAP_HEIGHT);
    ctx.strokeRect(x - PIPE_CAP_OVERHANG, capY, PIPE_WIDTH + PIPE_CAP_OVERHANG * 2, PIPE_CAP_HEIGHT);
  }
}
