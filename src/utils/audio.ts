// Web Audio API procedural synthesizer for the Battlefield Tactics FPS.
// Keeps state for sound toggling and lazily builds AudioContext on user interaction.

let audioCtx: AudioContext | null = null;
let isMuted = true;

// Background ambient drone state variables
let ambientOsc: OscillatorNode | null = null;
let ambientOsc2: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;

export function setMuted(muted: boolean) {
  isMuted = muted;
  if (!muted) {
    if (!audioCtx) {
      initAudioContext();
    }
    startAmbientDrone();
  } else {
    stopAmbientDrone();
  }
}

export function getMuted(): boolean {
  return isMuted;
}

function initAudioContext() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  } catch (e) {
    console.warn("Failed to initialize AudioContext:", e);
  }
}

function playTone(freqStart: number, freqEnd: number, duration: number, type: OscillatorType = "sine", gainValStart = 0.1) {
  if (isMuted) return;
  if (!audioCtx) {
    initAudioContext();
    if (!audioCtx) return;
  }
  
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freqStart, audioCtx.currentTime);
  if (freqEnd !== freqStart) {
    osc.frequency.exponentialRampToValueAtTime(freqEnd, audioCtx.currentTime + duration);
  }

  gainNode.gain.setValueAtTime(gainValStart, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

// Crisp metallic pop for pistol shots
export function playPistol() {
  playTone(950, 150, 0.1, "triangle", 0.15);
}

// Deep, heavy overlapping blast for shotgun fire
export function playShotgun() {
  if (isMuted) return;
  // Pellet 1 - low punch
  playTone(280, 40, 0.25, "sawtooth", 0.18);
  // Pellet 2 - crunch
  setTimeout(() => {
    playTone(180, 30, 0.2, "triangle", 0.15);
  }, 10);
  // Pellet 3 - higher pop
  setTimeout(() => {
    playTone(450, 80, 0.15, "sawtooth", 0.1);
  }, 20);
}

// Fast futuristic laser chime for Plasma gun
export function playPlasma() {
  playTone(800, 2200, 0.12, "sine", 0.08);
}

// Combat selection chime
export function playSelect() {
  playTone(550, 750, 0.06, "sine", 0.05);
}

// Player movement stepping bob
export function playStep() {
  playTone(60, 20, 0.05, "triangle", 0.04);
}

// Heavy wall crash / kill impact
export function playExplosion() {
  playTone(95, 20, 0.45, "sawtooth", 0.25);
}

// Deep impact oof when player takes damage
export function playOof() {
  playTone(140, 70, 0.18, "sawtooth", 0.25);
}

// Generic backup pickup chime
export function playPickup() {
  if (isMuted) return;
  playTone(440, 880, 0.15, "sine", 0.1);
  setTimeout(() => {
    playTone(660, 1320, 0.2, "sine", 0.08);
  }, 70);
}

// Specific Health powerup rising synthesizer chime
export function playHealthPickup() {
  if (isMuted) return;
  const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playTone(freq, freq * 1.05, 0.2, "sine", 0.06);
    }, idx * 55);
  });
}

// Specific Ammunition mechanical clatter loading chime
export function playAmmoPickup() {
  if (isMuted) return;
  playTone(220, 440, 0.1, "triangle", 0.1);
  setTimeout(() => {
    playTone(380, 760, 0.12, "sawtooth", 0.08);
  }, 80);
}

// Specific Deflector Shield energy sweep glow
export function playShieldPickup() {
  if (isMuted) return;
  playTone(160, 960, 0.35, "sine", 0.1);
  setTimeout(() => {
    playTone(280, 1680, 0.25, "sine", 0.05);
  }, 45);
}

// Clicking action when attempting to fire with depleted ammunition clips
export function playOutOfAmmo() {
  if (isMuted) return;
  playTone(1500, 1500, 0.03, "triangle", 0.08);
  setTimeout(() => {
    playTone(1100, 1100, 0.03, "triangle", 0.07);
  }, 50);
}

// Tactical team Chat transceiver intercept audio tone
export function playChatNotification() {
  if (isMuted) return;
  playTone(1100, 1400, 0.07, "sine", 0.05);
  setTimeout(() => {
    playTone(1500, 1800, 0.07, "sine", 0.05);
  }, 65);
}

// Different echoing firing tone of remote peer clients shooting weapons
export function playPeerFired() {
  if (isMuted) return;
  playTone(550, 120, 0.14, "sawtooth", 0.04);
}

// Teleporting action sweeping sound when progressing to higher difficulty quadrants
export function playTeleport() {
  if (isMuted) return;
  playTone(120, 3600, 0.95, "sine", 0.12);
}

// Alien/Cyber beast alarm alert shout
export function playEnemyAlert() {
  if (isMuted) return;
  playTone(330, 110, 0.3, "sawtooth", 0.12);
}

// Victory fanfare
export function playVictory() {
  if (isMuted) return;
  const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // ascending arpeggio
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playTone(freq, freq, 0.25, "sine", 0.12);
    }, idx * 100);
  });
}

// Defeat funeral arpeggio
export function playDefeat() {
  if (isMuted) return;
  const notes = [220.00, 196.00, 164.81, 110.00]; // descending notes
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playTone(freq, freq * 0.9, 0.4, "sawtooth", 0.15);
    }, idx * 150);
  });
}

// Internal Space Station engine hum generators
function startAmbientDrone() {
  if (isMuted) return;
  if (!audioCtx) {
    initAudioContext();
    if (!audioCtx) return;
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  // Prevent multiple overlapping instances
  stopAmbientDrone();

  try {
    ambientGain = audioCtx.createGain();
    ambientGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    // Smooth fade in representing active cooling systems
    ambientGain.gain.linearRampToValueAtTime(0.025, audioCtx.currentTime + 2.0);

    ambientOsc = audioCtx.createOscillator();
    ambientOsc.type = "triangle";
    ambientOsc.frequency.setValueAtTime(51.91, audioCtx.currentTime); // Deep Ab1 hum

    ambientOsc2 = audioCtx.createOscillator();
    ambientOsc2.type = "sine";
    ambientOsc2.frequency.setValueAtTime(104.3, audioCtx.currentTime); // Ab2 slight de-tuned note

    ambientOsc.connect(ambientGain);
    ambientOsc2.connect(ambientGain);
    ambientGain.connect(audioCtx.destination);

    ambientOsc.start();
    ambientOsc2.start();
  } catch (e) {
    console.warn("Could not fire ambient loop:", e);
  }
}

function stopAmbientDrone() {
  try {
    if (ambientOsc) {
      ambientOsc.stop();
      ambientOsc = null;
    }
    if (ambientOsc2) {
      ambientOsc2.stop();
      ambientOsc2 = null;
    }
    if (ambientGain) {
      ambientGain.disconnect();
      ambientGain = null;
    }
  } catch (e) {
    // Fail silently or log
  }
}
