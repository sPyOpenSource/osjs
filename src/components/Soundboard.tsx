import React, { useState } from 'react';
import { playSynthSound } from '../utils/audioSynth';
import { Volume2, Terminal, Play, Radio, Sparkles } from 'lucide-react';
import { RETRO_QUOTES } from '../constants/gameData';

export default function Soundboard({
  onAddLogMessage,
  webSocketSend,
}: {
  onAddLogMessage: (text: string, type: 'info' | 'warning' | 'danger' | 'success') => void;
  webSocketSend?: (type: string, payload: any) => void;
}) {
  const [customPhrase, setCustomPhrase] = useState('');
  const [accent, setAccent] = useState<'EVA' | 'SOVIET' | 'YURI'>('EVA');

  // Trigger synthesized audio effects
  const playSfx = (type: string, label: string) => {
    playSynthSound(type);
    onAddLogMessage(`Tactical audio playback: Triggered retro SFX "${label}"`, 'info');
    if (webSocketSend) {
      webSocketSend("soundboard_trigger", { soundName: type, quote: label });
    }
  };

  // Convert custom text to retro military radio speech broadcast!
  const triggerTextSpeech = () => {
    if (!customPhrase.trim()) {
      onAddLogMessage('Please input a radio broadcast message first!', 'warning');
      return;
    }

    if (webSocketSend) {
      webSocketSend("soundboard_trigger", { soundName: 'speech_custom', quote: `${accent}:${customPhrase}` });
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel(); // stop previous speech

      const utterance = new SpeechSynthesisUtterance(customPhrase);
      
      // Mimic different mechanical voice structures
      if (accent === 'SOVIET') {
        utterance.rate = 0.85;
        utterance.pitch = 0.75;
      } else if (accent === 'YURI') {
        utterance.rate = 0.95;
        utterance.pitch = 0.6;
      } else {
        // Electronic EVA assistant
        utterance.rate = 1.05;
        utterance.pitch = 1.1;
      }

      window.speechSynthesis.speak(utterance);
      onAddLogMessage(`Radio broadcast: ${accent} announces "${customPhrase}"`, 'success');
    } else {
      onAddLogMessage('Browsing platform does not support inline SpeechSynthesis. Emulating synth beep.', 'warning');
      playSynthSound('alert_low_power');
    }
  };

  return (
    <div id="soundboard_panel" className="bg-neutral-950 border border-neutral-800 rounded p-4 shadow-2xl relative">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-800">
        <Volume2 className="w-4 h-4 text-amber-500 animate-pulse" />
        <h2 className="text-xs font-mono tracking-widest text-amber-500 uppercase">
          Westwood Retro Voice Synth & Radio Deck
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Synthesizer Board */}
        <div>
          <p className="text-[10px] font-mono text-neutral-400 mb-2 uppercase tracking-wide">
            Interactive Analog Soundboard
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {[
              { type: 'click', label: 'Tactical Click', icon: '🖱️' },
              { type: 'building', label: 'Base Building', icon: '🧱' },
              { type: 'construction_complete', label: 'Unit Ready', icon: '🎖️' },
              { type: 'tesla_zap', label: 'Tesla Arc', icon: '⚡' },
              { type: 'prism_fire', label: 'Prism Laser', icon: '📐' },
              { type: 'bullet', label: 'Gatling Shell', icon: '🔫' },
              { type: 'explosion', label: 'Heavy Bombard', icon: '💥' },
              { type: 'siren', label: 'Red Alert Siren', icon: '🚨' },
              { type: 'warp', label: 'Chronoshift Shift', icon: '🌀' },
              { type: 'unit_promoted', label: 'Elite Level', icon: '⭐' },
              { type: 'psychic_blast', label: 'Yuri Blast', icon: '🧠' },
              { type: 'alert_low_power', label: 'Grid Malfunction', icon: '🔌' },
            ].map(snd => (
              <button
                id={`snd_btn_${snd.type}`}
                key={snd.type}
                onClick={() => playSfx(snd.type, snd.label)}
                className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 focus:border-amber-400 rounded p-1.5 text-left transition-all flex items-center gap-1.5 focus:outline-none"
              >
                <span className="text-xs bg-neutral-950 p-1 rounded font-mono">{snd.icon}</span>
                <span className="text-[10px] font-mono leading-tight truncate text-neutral-300">{snd.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Vintage Command Vocal radio announcer */}
        <div className="bg-neutral-900 border border-neutral-800 rounded p-3 flex flex-col justify-between">
          <div className="font-mono text-[10px] text-neutral-400 flex items-center justify-between mb-2 pb-1 border-b border-neutral-800/60">
            <span className="flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> COMMAND VOICE BROADCAST
            </span>
            <span className="text-neutral-500 text-[9px]">SPEECH CODER</span>
          </div>

          <div className="space-y-2">
            <input
              id="speech_phrase_input"
              type="text"
              value={customPhrase}
              onChange={e => setCustomPhrase(e.target.value)}
              placeholder="Enter orders (e.g. Warning: Nuclear silo launched!)"
              className="w-full bg-neutral-950 border border-neutral-800 text-amber-400 font-mono text-[11px] rounded px-2 py-1.5 focus:outline-none focus:border-amber-500 placeholder-neutral-600 truncate"
            />

            <div className="flex gap-1">
              {(['EVA', 'SOVIET', 'YURI'] as const).map(style => (
                <button
                  id={`voice_style_${style.toLowerCase()}`}
                  key={style}
                  onClick={() => setAccent(style)}
                  className={`flex-1 font-mono text-[9px] py-1 border transition-all rounded ${accent === style ? 'bg-amber-600 border-amber-400 text-black font-extrabold' : 'bg-neutral-950 border-neutral-850 hover:bg-neutral-900 text-neutral-400'}`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <button
            id="speak_button"
            onClick={triggerTextSpeech}
            className="w-full mt-3 bg-matrix-green hover:bg-emerald-600 bg-emerald-700 text-white font-mono font-bold text-xs py-2 rounded border border-emerald-500 hover:border-emerald-400 transition-all flex items-center justify-center gap-1.5 focus:outline-none"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> TRANSMIT BATTLE ALERT BROADCAST
          </button>
        </div>
      </div>

      {/* Retro famous lines */}
      <div className="mt-3 pt-3 border-t border-neutral-900 flex flex-wrap gap-1.5">
        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1 mr-1">
          <Terminal className="w-3 h-3 text-neutral-600" /> Presets:
        </span>
        {RETRO_QUOTES.slice(0, 5).map((q, idx) => (
          <button
            id={`preset_quote_btn_${idx}`}
            key={idx}
            onClick={() => {
              setCustomPhrase(q.text);
              onAddLogMessage(`Loaded preset: "${q.text}" (${q.source})`, 'info');
              playSynthSound('click');
            }}
            className="bg-neutral-900/60 hover:bg-neutral-800 text-[10px] font-mono text-amber-400/80 hover:text-amber-300 border border-neutral-800/50 px-2 py-0.5 rounded transition-all"
          >
            {q.source}: "{q.text.split('.')[0]}..."
          </button>
        ))}
      </div>
    </div>
  );
}
