// Détection de collision AABB (rectangles alignés sur les axes). Simple,
// rapide et suffisant : Flappy Bird n'a jamais eu besoin de collisions
// pixel-perfect, et l'oiseau utilise une hitbox légèrement réduite (voir
// bird.js) pour rester indulgent, comme le jeu original.

export function rectsIntersect(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

// Renvoie true si l'oiseau touche un tuyau ou le sol. Le plafond est géré à
// part dans bird.js (rebond, pas une collision mortelle).
export function checkBirdCollisions(birdHitbox, pipes, groundY) {
  if (birdHitbox.y + birdHitbox.height >= groundY) return true;

  for (const pipe of pipes) {
    for (const rect of pipe.collisionRects) {
      if (rectsIntersect(birdHitbox, rect)) return true;
    }
  }
  return false;
}
