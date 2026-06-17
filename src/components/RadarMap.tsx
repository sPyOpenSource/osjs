import React from "react";
import { PlayerState, Enemy, LevelConfig, RemotePlayer } from "../types";

interface RadarMapProps {
  player: PlayerState;
  enemies: Enemy[];
  level: LevelConfig;
  otherPlayers?: RemotePlayer[];
}

export default function RadarMap({ player, enemies, level, otherPlayers = [] }: RadarMapProps) {
  const grid = level.wallGrid;
  const rows = grid.length;
  const cols = grid[0].length;

  return (
    <div id="radar-minimap-container" className="bg-slate-950/70 backdrop-blur-[2px] border border-cyan-500/30 rounded-lg p-2 flex flex-col font-mono select-none shadow-[0_0_15px_rgba(6,182,212,0.15)] pointer-events-auto">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1 mb-1.5 text-[8px] sm:text-[9px]">
        <span className="text-cyan-400 font-bold uppercase tracking-wider">
          🛰️ TAC-RADAR
        </span>
        <span className="text-slate-400 text-[8px]">
          [{player.x.toFixed(1)}, {player.y.toFixed(1)}]
        </span>
      </div>

      {/* Grid Radar overlay container */}
      <div className="relative aspect-square w-full max-w-[125px] sm:max-w-[140px] mx-auto bg-slate-950/50 rounded border border-slate-800/80 overflow-hidden flex flex-col gap-[1px] p-0.5 shadow-inner">
        {grid.map((row, r) => (
          <div key={`minimap-row-${r}`} className="flex flex-1 gap-[1px]">
            {row.map((cell, c) => {
              // Highlight cell color
              let cellClass = "bg-slate-950/10";
              let title = "Path";

              if (cell === 1 || cell === 2 || cell === 3) {
                cellClass = "bg-slate-700/60 border-[0.5px] border-slate-800/50";
                title = "Wall";
              } else if (cell === 4) {
                cellClass = "bg-cyan-500/20 animate-pulse border border-cyan-500/40";
                title = "Exit Gate";
              }

              // Check if player is present on this coordinate
              const isPlayerCell = Math.floor(player.x) === c && Math.floor(player.y) === r;

              // Check if enemies are located here
              const enemiesHere = enemies.filter((e) => e.health > 0 && Math.floor(e.x) === c && Math.floor(e.y) === r);

              // Check if other players are located here
              const otherPlayersHere = otherPlayers.filter((op) => Math.floor(op.x) === c && Math.floor(op.y) === r);

              return (
                <div
                  key={`minimap-col-${c}`}
                  className="flex-1 aspect-square relative"
                  title={title}
                >
                  {/* Base terrain */}
                  <div className={`w-full h-full transition-all duration-150 ${cellClass}`} />

                  {/* Red enemies spot indicator */}
                  {enemiesHere.length > 0 && !isPlayerCell && (
                    <div className="absolute inset-0.5 rounded-full bg-red-500 animate-pulse z-10" />
                  )}

                  {/* Remote players tracker indicator */}
                  {otherPlayersHere.length > 0 && !isPlayerCell && (
                    <div 
                      className="absolute inset-0.5 rounded-full animate-pulse z-10"
                      style={{ backgroundColor: otherPlayersHere[0].color }}
                    />
                  )}

                  {/* Pulsing exit gate icon */}
                  {cell === 4 && (
                    <div className="absolute inset-0.5 rounded-full bg-cyan-500 animate-pulse z-1" />
                  )}

                  {/* Cyan Player point inside grid */}
                  {isPlayerCell && (
                    <div className="absolute inset-0 flex items-center justify-center z-15">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 border border-black flex items-center justify-center shadow-md">
                        {/* Direction Arrow Vector pointer */}
                        <div
                          className="w-1 h-1 border-t border-r border-black rotate-[45deg] scale-75 origin-center transition-transform"
                          style={{
                            transform: `rotate(${player.angle + Math.PI / 4}rad) translate(-0.5px, 0.5px)`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-1.5 grid grid-cols-3 gap-0.5 text-[7.5px] text-slate-400 font-mono text-center">
        <div className="flex items-center gap-0.5 justify-center">
          <div className="w-1 h-1 rounded-full bg-cyan-450" />
          <span>PLY</span>
        </div>
        <div className="flex items-center gap-0.5 justify-center animate-pulse">
          <div className="w-1 h-1 rounded-full bg-red-500" />
          <span>ENM</span>
        </div>
        <div className="flex items-center gap-0.5 justify-center">
          <div className="w-1 h-1 bg-cyan-500/30 border border-cyan-400/50" />
          <span>EX</span>
        </div>
      </div>
    </div>
  );
}
