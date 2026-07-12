// Point d'entrée : configure le canvas (résolution logique fixe, mise à
// l'échelle DPR-aware), démarre la boucle de jeu unique et branche les
// entrées utilisateur. Aucun autre fichier ne touche au DOM en dehors de
// celui-ci et de input.js.
import { CANVAS_WIDTH, CANVAS_HEIGHT, MAX_DELTA_TIME } from './config.js';
import { Game } from './game.js';
import { initInput } from './input.js';
import * as audio from './audio.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const muteBtn = document.getElementById('mute-btn');

const game = new Game(ctx);

// --- Mise à l'échelle responsive -------------------------------------------
// Le jeu raisonne toujours dans l'espace logique 400x600 ; seule cette
// fonction connaît la taille réelle de l'écran et la densité de pixels.
function resizeCanvas() {
  const scale = Math.min(window.innerWidth / CANVAS_WIDTH, window.innerHeight / CANVAS_HEIGHT);
  const dpr = window.devicePixelRatio || 1;

  canvas.style.width = `${CANVAS_WIDTH * scale}px`;
  canvas.style.height = `${CANVAS_HEIGHT * scale}px`;
  canvas.width = CANVAS_WIDTH * scale * dpr;
  canvas.height = CANVAS_HEIGHT * scale * dpr;

  ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --- Entrées -----------------------------------------------------------------
initInput(canvas, {
  onFirstInteraction: () => {
    audio.initAudio();
    audio.resumeAudio();
  },
  onFlap: () => game.handleFlap(),
});

muteBtn.addEventListener('click', () => {
  const muted = audio.toggleMuted();
  muteBtn.textContent = muted ? '🔇' : '🔊';
});
muteBtn.textContent = audio.isMuted() ? '🔇' : '🔊';

// --- Boucle de jeu unique, jamais recréée ------------------------------------
// evite toute fuite : une seule requestAnimationFrame pour toute la durée de
// vie de la page, y compris à travers les redémarrages de partie.
let lastTime = 0;
let isPaused = false;

document.addEventListener('visibilitychange', () => {
  isPaused = document.hidden;
});

function loop(currentTime) {
  if (!isPaused) {
    let dt = (currentTime - lastTime) / 1000;
    dt = Math.min(Math.max(dt, 0), MAX_DELTA_TIME);
    game.update(dt);
    game.render();
  }
  lastTime = currentTime;
  requestAnimationFrame(loop);
}

requestAnimationFrame((time) => {
  lastTime = time;
  requestAnimationFrame(loop);
});
