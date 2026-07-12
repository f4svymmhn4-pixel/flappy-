// Les trois états possibles du jeu. game.js est seul responsable des
// transitions entre eux (voir Game#setState) : cela évite d'éparpiller des
// "if on vient de changer d'état" dans update()/render().
export const GameState = Object.freeze({
  HOME: 'HOME',
  PLAYING: 'PLAYING',
  GAMEOVER: 'GAMEOVER',
});
