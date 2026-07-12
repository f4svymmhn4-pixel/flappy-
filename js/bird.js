// L'oiseau : physique (gravité, saut), rotation, animation des ailes et rendu.
// Toutes les formes sont dessinées au Canvas 2D — aucun sprite externe.
import {
  BIRD_X,
  BIRD_RADIUS,
  HITBOX_SHRINK,
  GRAVITY,
  FLAP_VELOCITY,
  TERMINAL_VELOCITY,
  MAX_ROTATION_UP,
  MAX_ROTATION_DOWN,
  WING_FLAP_PERIOD,
  IDLE_BOB_AMPLITUDE,
  IDLE_BOB_SPEED,
  COLOR_BIRD_BODY,
  COLOR_BIRD_BELLY,
  COLOR_BIRD_WING,
  COLOR_BIRD_BEAK,
  COLOR_BIRD_EYE,
} from './config.js';

const WING_FRAME_COUNT = 3;

export class Bird {
  constructor() {
    this.reset(300);
  }

  reset(startY) {
    this.x = BIRD_X;
    this.y = startY;
    this.velocityY = 0;
    this.rotation = 0;
    this.wingFrame = 0;
    this.wingTimer = 0;
    this.idleTimer = 0;
    this.onGround = false;
  }

  flap() {
    this.velocityY = FLAP_VELOCITY;
  }

  // Physique complète : gravité, déplacement, rebond sur le plafond, rotation.
  updatePhysics(dt) {
    this.velocityY = Math.min(this.velocityY + GRAVITY * dt, TERMINAL_VELOCITY);
    this.y += this.velocityY * dt;

    if (this.y - BIRD_RADIUS < 0) {
      this.y = BIRD_RADIUS;
      if (this.velocityY < 0) this.velocityY = 0;
    }

    this.updateRotation();
    this.updateWings(dt);
  }

  // Fait tomber l'oiseau jusqu'au sol après une collision, puis l'immobilise
  // progressivement (pas d'arrêt brutal).
  updateFalling(dt, groundY) {
    this.velocityY = Math.min(this.velocityY + GRAVITY * dt, TERMINAL_VELOCITY);
    this.y = Math.min(this.y + this.velocityY * dt, groundY - BIRD_RADIUS);
    if (this.y >= groundY - BIRD_RADIUS) {
      this.velocityY = 0;
      this.onGround = true;
    }
    this.rotation = MAX_ROTATION_DOWN;
  }

  // Petit mouvement de balancier sur l'écran d'accueil : pas de gravité.
  updateIdle(dt, baseY) {
    this.idleTimer += dt;
    this.y = baseY + Math.sin(this.idleTimer * IDLE_BOB_SPEED) * IDLE_BOB_AMPLITUDE;
    this.rotation = Math.sin(this.idleTimer * IDLE_BOB_SPEED) * 0.15;
    this.updateWings(dt);
  }

  updateRotation() {
    if (this.velocityY < 0) {
      const t = this.velocityY / FLAP_VELOCITY; // 0..1, 1 = vitesse de saut max
      this.rotation = MAX_ROTATION_UP * t;
    } else {
      const t = this.velocityY / TERMINAL_VELOCITY; // 0..1
      this.rotation = MAX_ROTATION_DOWN * t;
    }
  }

  updateWings(dt) {
    this.wingTimer += dt;
    if (this.wingTimer >= WING_FLAP_PERIOD) {
      this.wingTimer -= WING_FLAP_PERIOD;
      this.wingFrame = (this.wingFrame + 1) % WING_FRAME_COUNT;
    }
  }

  // Hitbox carrée, plus petite que le sprite visuel : collisions indulgentes,
  // fidèles à la sensation du jeu original.
  getHitbox() {
    const r = BIRD_RADIUS * HITBOX_SHRINK;
    return { x: this.x - r, y: this.y - r, width: r * 2, height: r * 2 };
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Corps
    ctx.fillStyle = COLOR_BIRD_BODY;
    ctx.beginPath();
    ctx.ellipse(0, 0, BIRD_RADIUS, BIRD_RADIUS * 0.82, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ventre
    ctx.fillStyle = COLOR_BIRD_BELLY;
    ctx.beginPath();
    ctx.ellipse(-BIRD_RADIUS * 0.15, BIRD_RADIUS * 0.25, BIRD_RADIUS * 0.62, BIRD_RADIUS * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Aile (angle qui varie selon la frame courante pour simuler le battement)
    const wingAngles = [-0.1, 0.3, 0.7];
    ctx.save();
    ctx.translate(-BIRD_RADIUS * 0.1, BIRD_RADIUS * 0.05);
    ctx.rotate(wingAngles[this.wingFrame]);
    ctx.fillStyle = COLOR_BIRD_WING;
    ctx.beginPath();
    ctx.ellipse(0, 0, BIRD_RADIUS * 0.55, BIRD_RADIUS * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Bec
    ctx.fillStyle = COLOR_BIRD_BEAK;
    ctx.beginPath();
    ctx.moveTo(BIRD_RADIUS * 0.75, -BIRD_RADIUS * 0.12);
    ctx.lineTo(BIRD_RADIUS * 1.35, BIRD_RADIUS * 0.05);
    ctx.lineTo(BIRD_RADIUS * 0.75, BIRD_RADIUS * 0.3);
    ctx.closePath();
    ctx.fill();

    // Œil
    ctx.fillStyle = COLOR_BIRD_EYE;
    ctx.beginPath();
    ctx.arc(BIRD_RADIUS * 0.42, -BIRD_RADIUS * 0.25, BIRD_RADIUS * 0.14, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
