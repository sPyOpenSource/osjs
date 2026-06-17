import React, { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { setMuted, getMuted, playSelect } from "../utils/audio";

export default function SoundToggle() {
  const [muted, setMutedState] = useState(getMuted());

  const handleToggle = () => {
    const newState = !muted;
    setMuted(newState);
    setMutedState(newState);
    if (!newState) {
      setTimeout(() => {
        playSelect();
      }, 50);
    }
  };

  return (
    <button
      id="sound-toggle-btn"
      onClick={handleToggle}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-mono transition-all duration-200 cursor-pointer ${
        muted
          ? "bg-slate-900/40 border-slate-700/50 text-slate-400 hover:text-slate-300 hover:border-slate-600"
          : "bg-cyan-950/40 border-cyan-800/60 text-cyan-405 hover:bg-cyan-900/40 hover:text-cyan-300"
      }`}
      title={muted ? "Unmute Tactical SFX" : "Mute Sound"}
    >
      {muted ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-rose-400" />
          <span>AUDIO: MUTED</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>AUDIO: ACTIVE</span>
        </>
      )}
    </button>
  );
}
