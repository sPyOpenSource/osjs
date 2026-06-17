import React from "react";
import { Terminal } from "lucide-react";
import { GameLog } from "../types";

interface BattleLogsProps {
  logs: GameLog[];
  onClear: () => void;
}

export default function BattleLogs({ logs, onClear }: BattleLogsProps) {
  return (
    <div id="combat-terminal-logs" className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 flex flex-col h-full font-mono select-none">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-405">
          <Terminal className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>TACTICAL FEED CONSOLE</span>
        </div>
        {logs.length > 0 && (
          <button
            id="clear-terminal-btn"
            onClick={onClear}
            className="text-[9px] text-slate-500 hover:text-slate-350 transition-colors uppercase cursor-pointer"
          >
            Flush Feeds
          </button>
        )}
      </div>

      <div id="logs-terminal-viewport" className="flex-1 overflow-y-auto max-h-[145px] space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800 pr-1 text-[11px]">
        {logs.length === 0 ? (
          <div className="text-slate-650 italic text-center py-6 text-[10px]">
            No live combat feeds detected. Calibrating HUD...
          </div>
        ) : (
          logs.map((log) => {
            let colorClass = "text-slate-400";
            if (log.type === "combat") colorClass = "text-rose-400 font-medium";
            if (log.type === "kill") colorClass = "text-yellow-400 font-bold bg-yellow-950/15 px-1 py-0.5 rounded";
            if (log.type === "health") colorClass = "text-emerald-400 font-medium";
            if (log.type === "ammo") colorClass = "text-amber-400 font-medium";
            if (log.type === "level") colorClass = "text-cyan-403 font-bold border-l border-cyan-500/40 pl-1";
            if (log.type === "system") colorClass = "text-slate-550 italic";
            if (log.type === "chat") colorClass = "text-sky-400 font-medium";

            return (
              <div key={log.id} className="leading-normal transition-all duration-300">
                <span className="text-slate-600 text-[9px] mr-1.5">
                  [{log.timestamp}]
                </span>
                <span className={colorClass}>
                  {log.message}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
