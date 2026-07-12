// Tous les effets sonores sont synthétisés à la volée avec l'API Web Audio :
// aucun fichier audio externe, donc aucun risque de droit d'auteur et aucun
// chargement asynchrone à gérer.
import { getMuted, saveMuted } from './storage.js';

let audioCtx = null;
let masterGain = null;
let noiseBuffer = null;
let muted = getMuted();

// L'AudioContext ne peut être créé qu'après un geste utilisateur (politique des
// navigateurs) : cette fonction est appelée une seule fois, au premier appui.
export function initAudio() {
  if (audioCtx) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContextClass();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = muted ? 0 : 1;
  masterGain.connect(audioCtx.destination);
  noiseBuffer = createNoiseBuffer();
}

export function resumeAudio() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function createNoiseBuffer() {
  const duration = 0.2;
  const length = Math.floor(audioCtx.sampleRate * duration);
  const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

export function isMuted() {
  return muted;
}

export function setMuted(value) {
  muted = value;
  if (masterGain) masterGain.gain.value = muted ? 0 : 1;
  saveMuted(muted);
}

export function toggleMuted() {
  setMuted(!muted);
  return muted;
}

// --- Enveloppe utilitaire : gain qui monte vite puis redescend en exponentiel ---
function envelope(gainNode, peak, attack, decay, startTime) {
  const g = gainNode.gain;
  g.cancelScheduledValues(startTime);
  g.setValueAtTime(0.0001, startTime);
  g.exponentialRampToValueAtTime(peak, startTime + attack);
  g.exponentialRampToValueAtTime(0.0001, startTime + attack + decay);
}

export function playFlap() {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.09);
  envelope(gain, 0.25, 0.01, 0.11, now);
  osc.connect(gain).connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.13);
}

export function playScore() {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  [
    { freq: 880, start: 0 },
    { freq: 1320, start: 0.06 },
  ].forEach(({ freq, start }) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + start);
    envelope(gain, 0.2, 0.005, 0.09, now + start);
    osc.connect(gain).connect(masterGain);
    osc.start(now + start);
    osc.stop(now + start + 0.1);
  });
}

export function playHit() {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const source = audioCtx.createBufferSource();
  source.buffer = noiseBuffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 800;
  const gain = audioCtx.createGain();
  envelope(gain, 0.35, 0.005, 0.18, now);
  source.connect(filter).connect(gain).connect(masterGain);
  source.start(now);
  source.stop(now + 0.2);
}

export function playGameOver() {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.5);
  envelope(gain, 0.2, 0.01, 0.5, now);
  osc.connect(gain).connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.55);
}
