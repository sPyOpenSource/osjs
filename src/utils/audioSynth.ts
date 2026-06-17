// Play retro audio sounds using Web Audio API

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Low level helper to play a noise explosion
function playNoise(duration: number, type: 'explosion' | 'bullet' | 'tesla', volume = 0.5) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  // Fill with white noise
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noiseNode = ctx.createBufferSource();
  noiseNode.buffer = buffer;

  const filterNode = ctx.createBiquadFilter();
  if (type === 'explosion') {
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(400, ctx.currentTime);
    filterNode.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + duration);
  } else if (type === 'bullet') {
    filterNode.type = 'bandpass';
    filterNode.frequency.setValueAtTime(1200, ctx.currentTime);
    filterNode.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + duration);
  } else {
    filterNode.type = 'highpass';
    filterNode.frequency.setValueAtTime(2000, ctx.currentTime);
  }

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(volume ?? 0.5, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  noiseNode.connect(filterNode);
  filterNode.connect(gainNode);
  gainNode.connect(ctx.destination);

  noiseNode.start();
}

export const playSynthSound = (soundType: string) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  try {
    switch (soundType) {
      case 'click': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1500, now);
        osc.frequency.setValueAtTime(1000, now + 0.05);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(now + 0.08);
        break;
      }

      case 'alert_low_power': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.setValueAtTime(100, now + 0.15);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(now + 0.25);
        break;
      }

      case 'building': {
        // Double tone hum
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(220, now);
        osc1.frequency.linearRampToValueAtTime(260, now + 0.3);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(440, now);
        osc2.frequency.linearRampToValueAtTime(520, now + 0.3);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(now + 0.3);
        osc2.stop(now + 0.3);
        break;
      }

      case 'construction_complete': {
        // Westwood fanfare note sequence: C4, G4, C5 quick chords
        const times = [0, 0.1, 0.2, 0.3];
        const freqs = [261.63, 392.00, 523.25, 783.99]; // C4, G4, C5, G5
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + times[idx]);
          
          gain.gain.setValueAtTime(0.12, now + times[idx]);
          gain.gain.exponentialRampToValueAtTime(0.001, now + times[idx] + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + times[idx]);
          osc.stop(now + times[idx] + 0.45);
        });
        break;
      }

      case 'tesla_zap': {
        // Crackle + sweeping sine
        playNoise(0.25, 'tesla', 0.25);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(1500, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(now + 0.35);
        break;
      }

      case 'prism_fire': {
        // Beam sweep up
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(2800, now + 0.25);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(now + 0.3);
        break;
      }

      case 'bullet': {
        playNoise(0.08, 'bullet', 0.15);
        break;
      }

      case 'explosion': {
        playNoise(0.6, 'explosion', 0.5);
        // Add extreme bass rumble
        const sineOsc = ctx.createOscillator();
        const sGain = ctx.createGain();
        sineOsc.type = 'sine';
        sineOsc.frequency.setValueAtTime(110, now);
        sineOsc.frequency.linearRampToValueAtTime(20, now + 0.5);

        sGain.gain.setValueAtTime(0.4, now);
        sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        sineOsc.connect(sGain);
        sGain.connect(ctx.destination);

        sineOsc.start();
        sineOsc.stop(now + 0.5);
        break;
      }

      case 'siren': {
        // Red alert alarm! Oscillating siren!
        const duration = 1.6;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(500, now);
        
        // Siren frequency oscillation
        for (let t = 0; t < duration; t += 0.25) {
          osc.frequency.linearRampToValueAtTime(800, now + t + 0.1);
          osc.frequency.linearRampToValueAtTime(450, now + t + 0.25);
        }

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.setValueAtTime(0.2, now + duration - 0.2);
        gain.gain.linearRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(now + duration);
        break;
      }

      case 'warp': {
        // Chronoshift warp
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.6);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        // Flanger effect representation
        const modulator = ctx.createOscillator();
        const mGain = ctx.createGain();
        modulator.frequency.value = 15; // 15 Hz vibration
        mGain.gain.value = 100;
        
        modulator.connect(mGain);
        mGain.connect(osc.frequency);

        osc.connect(gain);
        gain.connect(ctx.destination);

        modulator.start();
        osc.start();
        
        modulator.stop(now + 0.6);
        osc.stop(now + 0.6);
        break;
      }

      case 'unit_promoted': {
        // Rising chime fanfare
        const chords = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        chords.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0.12, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.35);
        });
        break;
      }

      case 'psychic_blast': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.5);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(now + 0.5);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.warn('Audio synthesis issue:', err);
  }
};
