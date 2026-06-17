import React from "react";
import { Weapon } from "../types";

interface WeaponSelectorProps {
  weapons: Weapon[];
  currentIndex: number;
  onSelect: (index: number) => void;
  isFiring: boolean;
  isReloading?: boolean;
  onReload?: () => void;
}

export default function WeaponSelector({
  weapons,
  currentIndex,
  onSelect,
  isFiring,
  isReloading = false,
  onReload,
}: WeaponSelectorProps) {
  return (
    <div id="weapon-selector-hud" className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 flex flex-col font-mono select-none">
      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-2.5">
        ☣️ WEAPON ARSENAL LOADOUT
      </label>

      <div className="flex flex-col gap-2">
        {weapons.map((w, idx) => {
          const isSelected = idx === currentIndex;
          const isOutOfAmmo = w.ammo === 0;

          return (
            <div
              key={w.id}
              onClick={() => onSelect(idx)}
              className={`flex flex-col p-2.5 rounded border transition-all duration-150 cursor-pointer text-left ${
                isSelected
                  ? "bg-cyan-950/40 border-cyan-550 shadow-md shadow-cyan-950 text-white"
                  : "bg-slate-900/40 border-slate-800/80 text-slate-450 hover:bg-slate-900/80 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2.5">
                  {/* Large Emoji visual element */}
                  <div className={`text-xl flex items-center justify-center p-1 rounded bg-slate-900 border border-slate-800 h-9 w-9 ${
                    isSelected && isFiring ? "scale-110 rotate-3 text-cyan-400" : ""
                  }`}>
                    {w.emoji}
                  </div>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1.5 font-sans">
                      <span>{w.name}</span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      )}
                    </div>
                    <div className="text-[9px] text-slate-500 uppercase mt-0.5">
                      DMG: {w.damage} • RANGE: {w.range}
                    </div>
                  </div>
                </div>

                {/* Ammo clips indicator */}
                <div className="text-right flex flex-col items-end">
                  <span className={`text-xs font-bold font-mono ${
                    isOutOfAmmo
                      ? "text-rose-500 animate-pulse font-extrabold"
                      : isSelected
                      ? "text-cyan-400"
                      : "text-slate-350"
                  }`}>
                    {w.ammo} / {w.maxAmmo}
                  </span>
                  
                  {/* Small indicator visual level bar */}
                  <div className="w-12 bg-slate-800 h-1 rounded-full overflow-hidden mt-1 border border-slate-900">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isOutOfAmmo ? "bg-rose-600" : isSelected ? "bg-cyan-400" : "bg-slate-500"
                      }`}
                      style={{ width: `${(w.ammo / w.maxAmmo) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Reload Button and status panel for the active selected weapon */}
              {isSelected && (
                <div className="mt-2.5 pt-2 border-t border-slate-900/80 flex justify-between items-center gap-2">
                  <span className={`text-[9px] uppercase font-bold tracking-tight transition-all ${
                    isReloading ? "text-cyan-400 font-extrabold animate-pulse" : "text-slate-500"
                  }`}>
                    {isReloading ? "⚙️ RELOADING ARSENAL CLIP..." : "TACTICAL SYSTEM READY"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onReload && !isReloading) {
                        onReload();
                      }
                    }}
                    disabled={isReloading}
                    className={`px-2.5 py-1 rounded text-[9px] font-extrabold uppercase transition-all duration-150 flex items-center gap-1 cursor-pointer border ${
                      isReloading
                        ? "bg-slate-900 text-slate-600 border-slate-850 cursor-not-allowed"
                        : "bg-cyan-950/50 hover:bg-cyan-900/40 text-cyan-400 hover:text-cyan-300 border-cyan-800 hover:border-cyan-550"
                    }`}
                    title="Manual Reload Weapons Drive [R Key]"
                  >
                    <span>RELOAD [R]</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
