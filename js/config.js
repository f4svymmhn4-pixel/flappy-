// Toutes les constantes réglables du jeu vivent ici : rien d'autre ne devrait
// contenir de "nombre magique" pour la physique, les couleurs ou les tailles.

// --- Résolution logique du canvas -----------------------------------------
// Tout le code de jeu raisonne dans cet espace fixe ; le rendu à l'écran
// (haute densité de pixels, redimensionnement) est géré une seule fois dans main.js.
export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 600;

// --- Sol --------------------------------------------------------------------
export const GROUND_HEIGHT = 90;
export const GROUND_TILE_WIDTH = 40;

// --- Oiseau -------------------------------------------------------------------
export const BIRD_X = 100;
export const BIRD_RADIUS = 16;
export const HITBOX_SHRINK = 0.7; // hitbox plus petite que le sprite = collisions plus indulgentes
export const GRAVITY = 1400; // px/s²
export const FLAP_VELOCITY = -430; // px/s (négatif = vers le haut)
export const TERMINAL_VELOCITY = 700; // px/s, vitesse de chute maximale
export const MAX_ROTATION_UP = -0.5; // radians, inclinaison max vers le haut
export const MAX_ROTATION_DOWN = Math.PI / 2; // radians, inclinaison max vers le bas
export const WING_FLAP_PERIOD = 0.09; // secondes entre deux frames d'aile

// --- Tuyaux -------------------------------------------------------------------
export const PIPE_WIDTH = 70;
export const PIPE_CAP_HEIGHT = 22;
export const PIPE_CAP_OVERHANG = 6;
export const PIPE_SPEED_BASE = 180; // px/s au score 0
export const PIPE_GAP_BASE = 170; // px au score 0
export const PIPE_SPAWN_INTERVAL = 1.5; // secondes entre deux tuyaux
export const PIPE_MIN_TOP_MARGIN = 60; // marge mini entre un tuyau et le haut/bas du terrain de jeu

// --- Difficulté progressive ---------------------------------------------------
export const DIFFICULTY_MAX_SPEED_MULT = 1.9;
export const DIFFICULTY_SPEED_RAMP_RATE = 0.045;
export const DIFFICULTY_MIN_GAP = 120;
export const DIFFICULTY_GAP_RAMP_RATE = 0.04;

// --- Boucle de jeu -------------------------------------------------------------
export const MAX_DELTA_TIME = 1 / 30; // seconde ; on ne simule jamais plus lentement que 30 FPS

// --- Animation écran d'accueil / fin de partie ---------------------------------
export const IDLE_BOB_AMPLITUDE = 8;
export const IDLE_BOB_SPEED = 2.4;
export const GAMEOVER_INPUT_DELAY = 0.4; // secondes avant qu'un appui relance la partie
export const PANEL_FADE_DURATION = 0.3;

// --- Couleurs -------------------------------------------------------------------
export const COLOR_SKY_TOP = '#6ec6ff';
export const COLOR_SKY_BOTTOM = '#cfeeff';
export const COLOR_CLOUD = 'rgba(255, 255, 255, 0.8)';
export const COLOR_GROUND_BASE = '#ded18f';
export const COLOR_GROUND_STRIPE = '#c9b774';
export const COLOR_GROUND_TOP = '#7ec850';
export const COLOR_PIPE_LIGHT = '#7ec850';
export const COLOR_PIPE_DARK = '#57a13d';
export const COLOR_PIPE_EDGE = '#3f7c2c';
export const COLOR_BIRD_BODY = '#ffce38';
export const COLOR_BIRD_BELLY = '#fff3c4';
export const COLOR_BIRD_WING = '#f4a71d';
export const COLOR_BIRD_BEAK = '#ff8a3d';
export const COLOR_BIRD_EYE = '#2b2b2b';
export const COLOR_TEXT = '#ffffff';
export const COLOR_TEXT_SHADOW = 'rgba(0, 0, 0, 0.35)';
export const COLOR_PANEL_BG = 'rgba(30, 34, 45, 0.88)';
export const COLOR_BUTTON = '#ffce38';
export const COLOR_BUTTON_TEXT = '#3f2d00';

// --- Stockage local -------------------------------------------------------------
export const STORAGE_KEY_BEST_SCORE = 'flappyClone.bestScore';
export const STORAGE_KEY_MUTED = 'flappyClone.muted';

// --- Textes (français) -----------------------------------------------------------
export const TEXT = {
  title: 'Flappy Bird Original',
  play: 'Jouer',
  replay: 'Rejouer',
  tapToStart: 'Touchez ou appuyez sur Espace',
  bestScore: 'Meilleur score',
  score: 'Score',
  gameOver: 'Partie terminée',
  newBest: 'Nouveau record !',
};
