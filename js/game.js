// Chef d'orchestre du jeu : c'est le seul module qui connaît tous les autres.
// Chaque module (bird, pipes, background, ui, audio...) ignore l'existence
// des autres, ce qui garde chaque fichier court et testable isolément.
import { GameState } from './state.js';
import { Bird } from './bird.js';
import { PipeManager } from './pipes.js';
import { Background } from './background.js';
import { checkBirdCollisions } from './collision.js';
import { getSpeedForScore } from './difficulty.js';
import * as audio from './audio.js';
import { getBestScore, saveBestScoreIfHigher } from './storage.js';
import { renderScore, renderHomeScreen, renderGameOverPanel, renderFlash } from './ui.js';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GROUND_HEIGHT,
  PIPE_SPEED_BASE,
  PIPE_SPAWN_INTERVAL,
  GAMEOVER_INPUT_DELAY,
  PANEL_FADE_DURATION,
} from './config.js';

const IDLE_BACKGROUND_SPEED = PIPE_SPEED_BASE * 0.5;
const FLASH_DECAY_PER_SECOND = 3.5;

export class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.bird = new Bird();
    this.pipes = new PipeManager();
    this.background = new Background();

    this.state = GameState.HOME;
    this.score = 0;
    this.bestScore = getBestScore();
    this.isNewBest = false;

    this.currentSpeed = PIPE_SPEED_BASE;
    this.spawnTimer = 0;
    this.flashAlpha = 0;
    this.gameOverPhase = 'falling'; // 'falling' -> 'panel'
    this.gameOverTimer = 0;

    this.bird.reset(CANVAS_HEIGHT / 2);
  }

  setState(newState) {
    if (newState === GameState.PLAYING) {
      this.score = 0;
      this.currentSpeed = PIPE_SPEED_BASE;
      this.spawnTimer = PIPE_SPAWN_INTERVAL;
      this.pipes.reset();
      this.background.reset();
      this.bird.reset(CANVAS_HEIGHT / 2);
      this.flashAlpha = 0;
    } else if (newState === GameState.GAMEOVER) {
      const previousBest = this.bestScore;
      this.bestScore = saveBestScoreIfHigher(this.score);
      this.isNewBest = this.score > previousBest;
      this.gameOverPhase = 'falling';
      this.gameOverTimer = 0;
      this.flashAlpha = 1;
      audio.playHit();
    }
    this.state = newState;
  }

  // Appelé par input.js à chaque appui/clic/touche, avec les coordonnées
  // logiques du point d'appui (nulles pour le clavier).
  handleFlap() {
    switch (this.state) {
      case GameState.HOME:
        this.setState(GameState.PLAYING);
        this.bird.flap();
        audio.playFlap();
        break;
      case GameState.PLAYING:
        this.bird.flap();
        audio.playFlap();
        break;
      case GameState.GAMEOVER:
        if (this.gameOverPhase === 'panel' && this.gameOverTimer >= GAMEOVER_INPUT_DELAY) {
          this.setState(GameState.PLAYING);
        }
        break;
    }
  }

  update(dt) {
    switch (this.state) {
      case GameState.HOME:
        this.updateHome(dt);
        break;
      case GameState.PLAYING:
        this.updatePlaying(dt);
        break;
      case GameState.GAMEOVER:
        this.updateGameOver(dt);
        break;
    }
  }

  updateHome(dt) {
    this.background.update(dt, IDLE_BACKGROUND_SPEED);
    this.bird.updateIdle(dt, CANVAS_HEIGHT / 2);
  }

  updatePlaying(dt) {
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.currentSpeed = getSpeedForScore(this.score);
      this.pipes.spawnPipe(this.score);
      this.spawnTimer += PIPE_SPAWN_INTERVAL;
    }

    this.background.update(dt, this.currentSpeed);
    this.bird.updatePhysics(dt);
    this.pipes.update(dt, this.currentSpeed, this.bird.x, () => this.onPipePassed());

    const groundY = CANVAS_HEIGHT - GROUND_HEIGHT;
    if (checkBirdCollisions(this.bird.getHitbox(), this.pipes.pipes, groundY)) {
      this.setState(GameState.GAMEOVER);
    }
  }

  updateGameOver(dt) {
    const groundY = CANVAS_HEIGHT - GROUND_HEIGHT;

    if (this.gameOverPhase === 'falling') {
      this.bird.updateFalling(dt, groundY);
      if (this.bird.onGround) {
        this.gameOverPhase = 'panel';
        audio.playGameOver();
      }
    } else {
      this.gameOverTimer += dt;
    }

    if (this.flashAlpha > 0) {
      this.flashAlpha = Math.max(0, this.flashAlpha - FLASH_DECAY_PER_SECOND * dt);
    }
  }

  onPipePassed() {
    this.score += 1;
    audio.playScore();
  }

  render() {
    const ctx = this.ctx;
    this.background.renderSky(ctx);
    this.background.renderClouds(ctx);
    this.pipes.render(ctx);
    this.background.renderGround(ctx);
    this.bird.render(ctx);

    switch (this.state) {
      case GameState.HOME:
        renderHomeScreen(ctx, this.bestScore);
        break;
      case GameState.PLAYING:
        renderScore(ctx, this.score);
        break;
      case GameState.GAMEOVER: {
        const panelAlpha =
          this.gameOverPhase === 'panel' ? Math.min(1, this.gameOverTimer / PANEL_FADE_DURATION) : 0;
        renderGameOverPanel(ctx, {
          score: this.score,
          bestScore: this.bestScore,
          isNewBest: this.isNewBest,
          alpha: panelAlpha,
        });
        renderFlash(ctx, this.flashAlpha);
        break;
      }
    }
  }
}
