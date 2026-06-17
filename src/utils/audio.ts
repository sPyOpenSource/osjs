/**
 * Web Audio API synthesizer for retro-style game sound effects.
 * Synthesizes a war drum for expeditions and a metallic clash/combat sound for logs.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

/**
 * Plays a deep war drum sound effect.
 * Synthesized using a low frequency oscillator swept rapidly downward
 * combined with a warm low-pass filter and smooth exponential volume decay.
 */
export function playDrumSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Browser standard safety check: resume context if suspended by user gesture policy
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const bassOsc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  // Primary body: low-frequency sine
  osc.type = 'sine';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.exponentialRampToValueAtTime(45, now + 0.28);

  // Sub-bass layer for extra heavy punch
  bassOsc.type = 'triangle';
  bassOsc.frequency.setValueAtTime(90, now);
  bassOsc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

  // Filter out clicking / high-end harshness to make it a deep classic drum
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(250, now);

  // Exp decay gain envelope
  gainNode.gain.setValueAtTime(0.75, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

  // Connection chain
  osc.connect(filter);
  bassOsc.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(now);
  bassOsc.start(now);
  
  osc.stop(now + 0.4);
  bassOsc.stop(now + 0.4);
}

/**
 * Plays a crisp metallic clash sound effect.
 * Synthesized using multiple high-frequency detuned wave oscillators
 * with rapid volume and pitch decay, mimicking physical swords clashing.
 */
export function playClashSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  const now = ctx.currentTime;
  const gainNode = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  // Core metallic non-harmonic frequencies for authentic rattle ring
  const frequencies = [820, 1150, 1420, 1980, 2460];
  const oscillators: OscillatorNode[] = [];

  // Bandpass filter to isolate the metallic frequency region (around 1kHz - 3kHz)
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1800, now);
  filter.frequency.linearRampToValueAtTime(1200, now + 0.15); // descending filter freq
  filter.Q.setValueAtTime(2.0, now);

  frequencies.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    
    // Alternate types to create complex distortion harmonics
    osc.type = idx % 2 === 0 ? 'triangle' : 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);
    
    // Drastic descending frequency sweep to mimic sword sliding/impact scraper
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + 0.12);

    const individualGain = ctx.createGain();
    individualGain.gain.setValueAtTime(0.22, now);
    individualGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(individualGain);
    individualGain.connect(filter);
    
    osc.start(now);
    osc.stop(now + 0.16);
    
    oscillators.push(osc);
  });

  // Fast-decay master volume envelope
  gainNode.gain.setValueAtTime(0.55, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  filter.connect(gainNode);
  gainNode.connect(ctx.destination);
}
