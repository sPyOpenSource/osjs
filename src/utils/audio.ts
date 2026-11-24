/**
 * Unified Web Audio API Sound Effects & Procedural Pentatonic BGM Engine.
 * Zero external audio assets required; all BGM themes and combat/UI SFX
 * synthesize cleanly through master SFX and BGM gain buses.
 */

export type BgmTrack = 'menu' | 'campaign' | 'battle';

export interface AudioContextInput {
  showStartMenu: boolean;
  activeTab: 'roster' | 'creator' | 'bonds' | 'map' | 'duel' | 'affairs' | 'diplomacy' | 'viewer3d';
  inSiegeBattle?: boolean;
}

export function clampVolume(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function getBgmTrackForContext(input: AudioContextInput): BgmTrack {
  if (input.showStartMenu) return 'menu';
  if (input.activeTab === 'duel' || input.inSiegeBattle) return 'battle';
  return 'campaign';
}

interface EngineState {
  sfxEnabled: boolean;
  bgmEnabled: boolean;
  sfxVolume: number;
  bgmVolume: number;
  currentTrack: BgmTrack | null;
  isBgmPlaying: boolean;
}

const state: EngineState = {
  sfxEnabled: true,
  bgmEnabled: true,
  sfxVolume: 0.75,
  bgmVolume: 0.42,
  currentTrack: null,
  isBgmPlaying: false,
};

let audioCtx: AudioContext | null = null;
let sfxMasterGain: GainNode | null = null;
let bgmMasterGain: GainNode | null = null;
let bgmTimer: ReturnType<typeof setInterval> | null = null;
let bgmStep = 0;

function ensureAudioGraph(): { ctx: AudioContext; sfxGain: GainNode; bgmGain: GainNode } | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    audioCtx = new AudioContextClass();
  }
  if (!sfxMasterGain) {
    sfxMasterGain = audioCtx.createGain();
    sfxMasterGain.gain.setValueAtTime(state.sfxEnabled ? state.sfxVolume : 0, audioCtx.currentTime);
    sfxMasterGain.connect(audioCtx.destination);
  }
  if (!bgmMasterGain) {
    bgmMasterGain = audioCtx.createGain();
    bgmMasterGain.gain.setValueAtTime(state.bgmEnabled ? state.bgmVolume : 0, audioCtx.currentTime);
    bgmMasterGain.connect(audioCtx.destination);
  }
  return { ctx: audioCtx, sfxGain: sfxMasterGain, bgmGain: bgmMasterGain };
}

export function unlockAudio(): boolean {
  const graph = ensureAudioGraph();
  if (!graph) return false;
  if (graph.ctx.state === 'suspended') {
    graph.ctx.resume().catch(() => {});
  }
  return true;
}

export function setSfxEnabled(enabled: boolean): void {
  state.sfxEnabled = enabled;
  if (audioCtx && sfxMasterGain) {
    sfxMasterGain.gain.setTargetAtTime(enabled ? state.sfxVolume : 0, audioCtx.currentTime, 0.03);
  }
}

export function setSfxVolume(volume: number): void {
  state.sfxVolume = clampVolume(volume);
  if (audioCtx && sfxMasterGain && state.sfxEnabled) {
    sfxMasterGain.gain.setTargetAtTime(state.sfxVolume, audioCtx.currentTime, 0.03);
  }
}

export function setBgmEnabled(enabled: boolean): void {
  state.bgmEnabled = enabled;
  if (audioCtx && bgmMasterGain) {
    bgmMasterGain.gain.setTargetAtTime(enabled ? state.bgmVolume : 0, audioCtx.currentTime, 0.08);
  }
  if (!enabled) {
    stopBgm();
  }
}

export function setBgmVolume(volume: number): void {
  state.bgmVolume = clampVolume(volume);
  if (audioCtx && bgmMasterGain && state.bgmEnabled) {
    bgmMasterGain.gain.setTargetAtTime(state.bgmVolume, audioCtx.currentTime, 0.05);
  }
}

// ============================================================================
// Procedural BGM Sequencer (Menu / Campaign / Battle Themes)
// ============================================================================

interface TrackPattern {
  stepMs: number;
  melody: (number | null)[];
  bass: (number | null)[];
  drumSteps: number[];
  accentSteps: number[];
  leadWave: OscillatorType;
  filterCutoff: number;
}

// Note frequencies (Hz)
const N = {
  G2: 98.0, A2: 110.0, B2: 123.47, C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0,
};

const TRACK_PATTERNS: Record<BgmTrack, TrackPattern> = {
  // Tranquil Guzheng-style D pentatonic arpeggio for Start Menu
  menu: {
    stepMs: 390,
    melody: [
      N.D4, N.A4, N.B4, N.D5,
      N.E5, null, N.D5, N.B4,
      N.A4, N.G4, N.E4, N.G4,
      N.A4, null, N.D4, null,
    ],
    bass: [
      N.D3, null, null, null,
      N.B2, null, null, null,
      N.G2, null, null, null,
      N.A2, null, null, null,
    ],
    drumSteps: [],
    accentSteps: [0, 4, 8, 12],
    leadWave: 'triangle',
    filterCutoff: 1350,
  },
  // Grand strategic C pentatonic campaign theme
  campaign: {
    stepMs: 310,
    melody: [
      N.C4, N.E4, N.G4, N.A4,
      N.C5, null, N.A4, N.G4,
      N.E4, N.G4, N.A4, N.D5,
      N.C5, N.A4, N.G4, null,
      N.E4, N.D4, N.C4, N.D4,
      N.E4, N.G4, N.A4, N.C5,
      N.D5, N.C5, N.A4, N.G4,
      N.E4, N.D4, N.C4, null,
    ],
    bass: [
      N.C3, null, null, null,
      N.A2, null, null, null,
      N.G2, null, null, null,
      N.C3, null, N.G2, null,
      N.A2, null, null, null,
      N.C3, null, null, null,
      N.G2, null, N.A2, null,
      N.C3, null, null, null,
    ],
    drumSteps: [0, 8, 16, 24, 28],
    accentSteps: [0, 4, 8, 12, 16, 20, 24],
    leadWave: 'triangle',
    filterCutoff: 1700,
  },
  // Driving D minor pentatonic war-drum & battle theme
  battle: {
    stepMs: 225,
    melody: [
      N.D4, null, N.F4, N.G4,
      N.A4, N.D5, N.C5, N.A4,
      N.G4, N.F4, N.D4, N.F4,
      N.A4, null, N.G4, null,
      N.D4, N.F4, N.A4, N.C5,
      N.D5, N.F5, N.D5, N.C5,
      N.A4, N.G4, N.F4, N.G4,
      N.A4, N.F4, N.D4, null,
    ],
    bass: [
      N.D3, null, N.D3, null,
      N.A2, null, N.A2, null,
      N.G2, null, N.G2, null,
      N.A2, null, N.C3, null,
      N.D3, null, N.D3, null,
      N.F3, null, N.D3, null,
      N.C3, null, N.A2, null,
      N.D3, null, N.A2, null,
    ],
    drumSteps: [0, 3, 6, 8, 11, 14, 16, 19, 22, 24, 26, 28, 30],
    accentSteps: [0, 4, 8, 12, 16, 20, 24, 28],
    leadWave: 'sawtooth',
    filterCutoff: 1450,
  },
};

function scheduleBgmStep(track: BgmTrack): void {
  if (typeof document !== 'undefined' && document.hidden) return;
  if (!state.bgmEnabled || !state.isBgmPlaying) return;
  const graph = ensureAudioGraph();
  if (!graph || graph.ctx.state !== 'running') return;

  const { ctx, bgmGain } = graph;
  const pattern = TRACK_PATTERNS[track];
  const stepIdx = bgmStep % pattern.melody.length;
  const now = ctx.currentTime;
  const stepDur = pattern.stepMs / 1000;

  // Melody voice (plucked string / lute + soft filter)
  const melodyFreq = pattern.melody[stepIdx];
  if (melodyFreq) {
    const osc = ctx.createOscillator();
    const harmonic = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = pattern.leadWave;
    osc.frequency.setValueAtTime(melodyFreq, now);

    harmonic.type = 'sine';
    harmonic.frequency.setValueAtTime(melodyFreq * 2, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(pattern.filterCutoff, now);
    filter.frequency.exponentialRampToValueAtTime(420, now + stepDur * 1.4);

    const isAccent = pattern.accentSteps.includes(stepIdx);
    const peak = track === 'battle' ? (isAccent ? 0.24 : 0.16) : (isAccent ? 0.22 : 0.14);
    const noteLength = track === 'menu' ? stepDur * 1.9 : stepDur * 1.35;

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + noteLength);

    const harmonicGain = ctx.createGain();
    harmonicGain.gain.setValueAtTime(0.28, now);

    osc.connect(filter);
    harmonic.connect(harmonicGain);
    harmonicGain.connect(filter);
    filter.connect(gain);
    gain.connect(bgmGain);

    osc.start(now);
    harmonic.start(now);
    osc.stop(now + noteLength + 0.04);
    harmonic.stop(now + noteLength + 0.04);
  }

  // Warm bass drone / pulse
  const bassFreq = pattern.bass[stepIdx % pattern.bass.length];
  if (bassFreq) {
    const bassOsc = ctx.createOscillator();
    const bassFilter = ctx.createBiquadFilter();
    const bassGain = ctx.createGain();

    bassOsc.type = 'triangle';
    bassOsc.frequency.setValueAtTime(bassFreq, now);

    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(340, now);

    const bassDur = track === 'battle' ? stepDur * 1.5 : stepDur * 3.4;
    bassGain.gain.setValueAtTime(0.001, now);
    bassGain.gain.linearRampToValueAtTime(track === 'battle' ? 0.26 : 0.2, now + 0.04);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + bassDur);

    bassOsc.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(bgmGain);

    bassOsc.start(now);
    bassOsc.stop(now + bassDur + 0.05);
  }

  // Subtle frame/war drum rhythm
  if (pattern.drumSteps.includes(stepIdx)) {
    const drumOsc = ctx.createOscillator();
    const drumGain = ctx.createGain();
    const isDownbeat = stepIdx % 8 === 0;

    drumOsc.type = 'sine';
    drumOsc.frequency.setValueAtTime(isDownbeat ? 115 : 88, now);
    drumOsc.frequency.exponentialRampToValueAtTime(40, now + 0.14);

    drumGain.gain.setValueAtTime(track === 'battle' ? (isDownbeat ? 0.34 : 0.2) : 0.14, now);
    drumGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    drumOsc.connect(drumGain);
    drumGain.connect(bgmGain);

    drumOsc.start(now);
    drumOsc.stop(now + 0.18);
  }

  bgmStep = (bgmStep + 1) % pattern.melody.length;
}

export function stopBgm(): void {
  if (bgmTimer) {
    clearInterval(bgmTimer);
    bgmTimer = null;
  }
  state.isBgmPlaying = false;
  state.currentTrack = null;
  if (audioCtx && bgmMasterGain) {
    bgmMasterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.08);
  }
}

export function syncBgm(shouldPlay: boolean, track: BgmTrack): void {
  if (!shouldPlay || !state.bgmEnabled) {
    if (state.isBgmPlaying) stopBgm();
    return;
  }

  const graph = ensureAudioGraph();
  if (!graph) return;
  if (graph.ctx.state === 'suspended') {
    graph.ctx.resume().catch(() => {});
  }

  if (state.isBgmPlaying && state.currentTrack === track && bgmTimer) {
    graph.bgmGain.gain.setTargetAtTime(state.bgmVolume, graph.ctx.currentTime, 0.08);
    return;
  }

  if (bgmTimer) {
    clearInterval(bgmTimer);
    bgmTimer = null;
  }

  state.currentTrack = track;
  state.isBgmPlaying = true;
  bgmStep = 0;

  graph.bgmGain.gain.setTargetAtTime(state.bgmVolume, graph.ctx.currentTime, 0.12);
  scheduleBgmStep(track);
  bgmTimer = setInterval(() => {
    scheduleBgmStep(track);
  }, TRACK_PATTERNS[track].stepMs);
}

// ============================================================================
// Synthesized Tactical & Combat Sound Effects (SFX)
// ============================================================================

function getActiveSfxBus(): { ctx: AudioContext; sfxGain: GainNode } | null {
  if (!state.sfxEnabled) return null;
  const graph = ensureAudioGraph();
  if (!graph) return null;
  if (graph.ctx.state === 'suspended') {
    graph.ctx.resume().catch(() => {});
  }
  return { ctx: graph.ctx, sfxGain: graph.sfxGain };
}

/**
 * Plays a deep war drum sound effect.
 */
export function playDrumSound(): void {
  const bus = getActiveSfxBus();
  if (!bus) return;
  const { ctx, sfxGain } = bus;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const bassOsc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.exponentialRampToValueAtTime(45, now + 0.28);

  bassOsc.type = 'triangle';
  bassOsc.frequency.setValueAtTime(90, now);
  bassOsc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(250, now);

  gainNode.gain.setValueAtTime(0.75, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

  osc.connect(filter);
  bassOsc.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(sfxGain);

  osc.start(now);
  bassOsc.start(now);
  osc.stop(now + 0.4);
  bassOsc.stop(now + 0.4);
}

/**
 * Plays a crisp metallic blade clash sound effect.
 */
export function playClashSound(): void {
  const bus = getActiveSfxBus();
  if (!bus) return;
  const { ctx, sfxGain } = bus;
  const now = ctx.currentTime;

  const gainNode = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const frequencies = [820, 1150, 1420, 1980, 2460];

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1800, now);
  filter.frequency.linearRampToValueAtTime(1200, now + 0.15);
  filter.Q.setValueAtTime(2.0, now);

  frequencies.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    osc.type = idx % 2 === 0 ? 'triangle' : 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + 0.12);

    const individualGain = ctx.createGain();
    individualGain.gain.setValueAtTime(0.22, now);
    individualGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(individualGain);
    individualGain.connect(filter);

    osc.start(now);
    osc.stop(now + 0.16);
  });

  gainNode.gain.setValueAtTime(0.55, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  filter.connect(gainNode);
  gainNode.connect(sfxGain);
}

/**
 * Plays a classical pentatonic chime for harvests, trade completions, and diplomacy gains.
 */
export function playHarvestSound(): void {
  const bus = getActiveSfxBus();
  if (!bus) return;
  const { ctx, sfxGain } = bus;
  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5];

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.08);

    gainNode.gain.setValueAtTime(0.001, now + idx * 0.08);
    gainNode.gain.linearRampToValueAtTime(0.25, now + idx * 0.08 + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);

    osc.connect(gainNode);
    gainNode.connect(sfxGain);

    osc.start(now + idx * 0.08);
    osc.stop(now + idx * 0.08 + 0.55);
  });
}

/**
 * Plays a crisp woodblock/stone UI tap sound for navigation & commands.
 */
export function playClickSound(): void {
  const bus = getActiveSfxBus();
  if (!bus) return;
  const { ctx, sfxGain } = bus;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(680, now);
  osc.frequency.exponentialRampToValueAtTime(340, now + 0.055);

  gain.gain.setValueAtTime(0.16, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc.connect(gain);
  gain.connect(sfxGain);
  osc.start(now);
  osc.stop(now + 0.07);
}

/**
 * Plays a brisk unit march / tactical positioning sound.
 */
export function playMoveSound(): void {
  const bus = getActiveSfxBus();
  if (!bus) return;
  const { ctx, sfxGain } = bus;
  const now = ctx.currentTime;

  [0, 0.07].forEach((offset, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(i === 0 ? 220 : 275, now + offset);
    osc.frequency.exponentialRampToValueAtTime(140, now + offset + 0.08);

    gain.gain.setValueAtTime(0.18, now + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.09);

    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(now + offset);
    osc.stop(now + offset + 0.1);
  });
}

/**
 * Plays a taut bowstring twang + high-speed arrow whistle.
 */
export function playArrowSound(): void {
  const bus = getActiveSfxBus();
  if (!bus) return;
  const { ctx, sfxGain } = bus;
  const now = ctx.currentTime;

  const twang = ctx.createOscillator();
  const twangGain = ctx.createGain();
  twang.type = 'triangle';
  twang.frequency.setValueAtTime(420, now);
  twang.frequency.exponentialRampToValueAtTime(180, now + 0.11);
  twangGain.gain.setValueAtTime(0.24, now);
  twangGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  twang.connect(twangGain);
  twangGain.connect(sfxGain);
  twang.start(now);
  twang.stop(now + 0.13);

  const whistle = ctx.createOscillator();
  const whistleGain = ctx.createGain();
  whistle.type = 'sine';
  whistle.frequency.setValueAtTime(1850, now + 0.03);
  whistle.frequency.exponentialRampToValueAtTime(920, now + 0.2);
  whistleGain.gain.setValueAtTime(0.11, now + 0.03);
  whistleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
  whistle.connect(whistleGain);
  whistleGain.connect(sfxGain);
  whistle.start(now + 0.03);
  whistle.stop(now + 0.24);
}

/**
 * Plays a roaring fire burst for fire arrows and incendiary stratagems.
 */
export function playFireSound(): void {
  const bus = getActiveSfxBus();
  if (!bus) return;
  const { ctx, sfxGain } = bus;
  const now = ctx.currentTime;

  const bufferSize = Math.floor(ctx.sampleRate * 0.36);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.45));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(650, now);
  filter.frequency.linearRampToValueAtTime(1400, now + 0.14);
  filter.frequency.exponentialRampToValueAtTime(320, now + 0.35);
  filter.Q.setValueAtTime(1.2, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.55, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(sfxGain);
  noise.start(now);
}

/**
 * Plays a heavy weapon / siege battering ram impact sound.
 */
export function playHeavyImpactSound(): void {
  const bus = getActiveSfxBus();
  if (!bus) return;
  const { ctx, sfxGain } = bus;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const sub = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(210, now);
  osc.frequency.exponentialRampToValueAtTime(42, now + 0.3);

  sub.type = 'triangle';
  sub.frequency.setValueAtTime(115, now);
  sub.frequency.exponentialRampToValueAtTime(28, now + 0.28);

  gain.gain.setValueAtTime(0.45, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);

  osc.connect(gain);
  sub.connect(gain);
  gain.connect(sfxGain);

  osc.start(now);
  sub.start(now);
  osc.stop(now + 0.36);
  sub.stop(now + 0.36);
}

export function playParrySound(): void {
  const bus = getActiveSfxBus();
  if (!bus) return;
  const { ctx, sfxGain } = bus;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1600, now);
  osc.frequency.linearRampToValueAtTime(1220, now + 0.09);

  gain.gain.setValueAtTime(0.32, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

  osc.connect(gain);
  gain.connect(sfxGain);
  osc.start(now);
  osc.stop(now + 0.16);
}

export function playDodgeSound(): void {
  const bus = getActiveSfxBus();
  if (!bus) return;
  const { ctx, sfxGain } = bus;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1150, now);
  osc.frequency.exponentialRampToValueAtTime(520, now + 0.18);

  gain.gain.setValueAtTime(0.22, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

  osc.connect(gain);
  gain.connect(sfxGain);
  osc.start(now);
  osc.stop(now + 0.22);
}

export function playUltimateSound(): void {
  const bus = getActiveSfxBus();
  if (!bus) return;
  const { ctx, sfxGain } = bus;
  const now = ctx.currentTime;

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'sawtooth';
  osc2.type = 'sine';
  osc1.frequency.setValueAtTime(140, now);
  osc1.frequency.linearRampToValueAtTime(740, now + 0.36);
  osc2.frequency.setValueAtTime(280, now);
  osc2.frequency.exponentialRampToValueAtTime(1120, now + 0.42);

  gain.gain.setValueAtTime(0.16, now);
  gain.gain.linearRampToValueAtTime(0.42, now + 0.34);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.56);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(sfxGain);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.6);
  osc2.stop(now + 0.6);
}

export function playTauntSound(): void {
  const bus = getActiveSfxBus();
  if (!bus) return;
  const { ctx, sfxGain } = bus;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.linearRampToValueAtTime(110, now + 0.24);

  gain.gain.setValueAtTime(0.32, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.27);

  osc.connect(gain);
  gain.connect(sfxGain);
  osc.start(now);
  osc.stop(now + 0.29);
}

export function playHealSound(): void {
  const bus = getActiveSfxBus();
  if (!bus) return;
  const { ctx, sfxGain } = bus;
  const now = ctx.currentTime;

  [523.25, 659.25, 783.99].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.06);
    gain.gain.setValueAtTime(0.18, now + i * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.26);

    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(now + i * 0.06);
    osc.stop(now + i * 0.06 + 0.28);
  });
}

export function playVictorySound(): void {
  const bus = getActiveSfxBus();
  if (!bus) return;
  const { ctx, sfxGain } = bus;
  const now = ctx.currentTime;

  const fanfare = [
    { freq: 523.25, delay: 0, dur: 0.18 },
    { freq: 659.25, delay: 0.13, dur: 0.18 },
    { freq: 783.99, delay: 0.26, dur: 0.18 },
    { freq: 1046.5, delay: 0.4, dur: 0.55 },
  ];

  fanfare.forEach(({ freq, delay, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + delay);
    gain.gain.setValueAtTime(0.28, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);
    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(now + delay);
    osc.stop(now + delay + dur + 0.04);
  });
}

export function playDefeatSound(): void {
  const bus = getActiveSfxBus();
  if (!bus) return;
  const { ctx, sfxGain } = bus;
  const now = ctx.currentTime;

  [
    { freq: 349.23, delay: 0, dur: 0.28 },
    { freq: 293.66, delay: 0.22, dur: 0.28 },
    { freq: 220.0, delay: 0.44, dur: 0.55 },
  ].forEach(({ freq, delay, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, now + delay);

    osc.frequency.setValueAtTime(freq, now + delay);
    gain.gain.setValueAtTime(0.2, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(sfxGain);
    osc.start(now + delay);
    osc.stop(now + delay + dur + 0.04);
  });
}
