// Point d'entrée unique pour toutes les interactions (souris, tactile, clavier).
// Les écouteurs sont posés une seule fois, pour toute la durée de vie de la page :
// aucune fuite d'écouteurs entre les parties.
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './config.js';

// callbacks: { onFlap(logicalX|null, logicalY|null), onFirstInteraction() }
export function initInput(canvas, callbacks) {
  let hasInteracted = false;

  function notifyFirstInteraction() {
    if (hasInteracted) return;
    hasInteracted = true;
    callbacks.onFirstInteraction();
  }

  function toLogicalCoords(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }

  function handlePointerDown(event) {
    event.preventDefault();
    notifyFirstInteraction();
    const { x, y } = toLogicalCoords(event.clientX, event.clientY);
    callbacks.onFlap(x, y);
  }

  function handleKeyDown(event) {
    if (event.code !== 'Space' && event.code !== 'ArrowUp') return;
    event.preventDefault();
    notifyFirstInteraction();
    callbacks.onFlap(null, null);
  }

  canvas.addEventListener('pointerdown', handlePointerDown, { passive: false });
  window.addEventListener('keydown', handleKeyDown);
}
