// Ciel en dégradé, nuages en parallaxe (défilement lent) et sol défilant en
// boucle infinie. Tout est dessiné procéduralement, aucune image externe.
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GROUND_HEIGHT,
  GROUND_TILE_WIDTH,
  COLOR_SKY_TOP,
  COLOR_SKY_BOTTOM,
  COLOR_CLOUD,
  COLOR_GROUND_BASE,
  COLOR_GROUND_STRIPE,
  COLOR_GROUND_TOP,
} from './config.js';

const CLOUD_PARALLAX_FACTOR = 0.35;
const CLOUDS = [
  { x: 40, y: 90, scale: 1.0 },
  { x: 220, y: 60, scale: 0.7 },
  { x: 340, y: 140, scale: 0.85 },
  { x: 120, y: 180, scale: 0.6 },
];

export class Background {
  constructor() {
    this.groundOffset = 0;
    this.cloudOffset = 0;
  }

  reset() {
    this.groundOffset = 0;
    this.cloudOffset = 0;
  }

  update(dt, speed) {
    this.groundOffset = (this.groundOffset + speed * dt) % GROUND_TILE_WIDTH;
    this.cloudOffset = (this.cloudOffset + speed * CLOUD_PARALLAX_FACTOR * dt) % CANVAS_WIDTH;
  }

  renderSky(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT - GROUND_HEIGHT);
    gradient.addColorStop(0, COLOR_SKY_TOP);
    gradient.addColorStop(1, COLOR_SKY_BOTTOM);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_HEIGHT);
  }

  renderClouds(ctx) {
    ctx.fillStyle = COLOR_CLOUD;
    for (const cloud of CLOUDS) {
      // Deux passages décalés d'une largeur d'écran pour une boucle continue.
      for (const shift of [0, -CANVAS_WIDTH]) {
        const x = ((cloud.x - this.cloudOffset) % CANVAS_WIDTH) + CANVAS_WIDTH + shift;
        this.drawCloud(ctx, x, cloud.y, cloud.scale);
      }
    }
  }

  drawCloud(ctx, x, y, scale) {
    ctx.beginPath();
    ctx.ellipse(x, y, 26 * scale, 14 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 18 * scale, y + 4 * scale, 18 * scale, 11 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x - 18 * scale, y + 4 * scale, 16 * scale, 10 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  renderGround(ctx) {
    const groundY = CANVAS_HEIGHT - GROUND_HEIGHT;

    ctx.fillStyle = COLOR_GROUND_TOP;
    ctx.fillRect(0, groundY, CANVAS_WIDTH, 6);

    ctx.fillStyle = COLOR_GROUND_BASE;
    ctx.fillRect(0, groundY + 6, CANVAS_WIDTH, GROUND_HEIGHT - 6);

    ctx.fillStyle = COLOR_GROUND_STRIPE;
    const startX = -this.groundOffset;
    for (let x = startX; x < CANVAS_WIDTH; x += GROUND_TILE_WIDTH) {
      ctx.fillRect(x, groundY + 6, GROUND_TILE_WIDTH / 2, GROUND_HEIGHT - 6);
    }
  }
}
