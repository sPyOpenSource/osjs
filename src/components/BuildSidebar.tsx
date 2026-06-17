import React, { useState, useEffect } from 'react';
import { Faction, TabType, StructureTypeInfo, BuildQueueItem } from '../types';
import { STRUCTURES_DATA, DEFENSES_DATA } from '../constants/gameData';
import { playSynthSound } from '../utils/audioSynth';
import { Coins, Zap, ShieldQuestion, Construction, RefreshCw } from 'lucide-react';

interface BuildSidebarProps {
  faction: Faction;
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  setPlacementItem: (item: any) => void;
  onAddLogMessage: (text: string, type: 'info' | 'warning' | 'danger' | 'success') => void;
  powerStatus: { prod: number; cons: number };
  setPowerStatus: React.Dispatch<React.SetStateAction<{ prod: number; cons: number }>>;
}

export default function BuildSidebar({
  faction,
  credits,
  setCredits,
  setPlacementItem,
  onAddLogMessage,
  powerStatus,
  setPowerStatus,
}: BuildSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('STRUCTURES');
  const [queue, setQueue] = useState<BuildQueueItem[]>([]);
  const [activeBuildingId, setActiveBuildingId] = useState<string | null>(null);

  // Auto update Power calculations whenever structures list change is handled by parent,
  // but let's provide interactive manual power adjustment or statistics calculation of costs
  const activeStructuresList = STRUCTURES_DATA[faction] || [];
  const activeDefensesList = DEFENSES_DATA[faction] || [];

  const visibleItems = activeTab === 'STRUCTURES' ? activeStructuresList : activeDefensesList;

  // Build Queue progress ticker (100% finished constructs)
  useEffect(() => {
    const queueInterval = setInterval(() => {
      setQueue(prevQueue => {
        let completedItemName: string | null = null;

        const nextQueue = prevQueue.map(item => {
          if (item.paused || item.progress >= 100) return item;

          // Find the building metadata info
          const allBuilds = [...activeStructuresList, ...activeDefensesList];
          const bInfo = allBuilds.find(b => b.id === item.id);
          if (!bInfo) return item;

          // Speed factor depends on whether there is power deficit!
          const powerDeficit = powerStatus.cons > powerStatus.prod;
          const buildSpeed = powerDeficit ? 10.0 : 25.0; // 50% slower if low power

          const nextProgress = Math.min(100, item.progress + buildSpeed);
          
          if (nextProgress >= 100) {
            completedItemName = bInfo.name;
          }

          return {
            ...item,
            progress: nextProgress
          };
        });

        // Trigger side-effects outside of the immediate state update call stack to prevent React rendering errors
        if (completedItemName) {
          const nameRef = completedItemName;
          setTimeout(() => {
            playSynthSound('construction_complete');
            onAddLogMessage(`Construction complete: ${nameRef} is ready for tactical placement!`, 'success');
          }, 0);
        }

        return nextQueue;
      });
    }, 120);

    return () => clearInterval(queueInterval);
  }, [activeStructuresList, activeDefensesList, powerStatus, onAddLogMessage]);

  // Click a sidebar option to start building it
  const handleItemClick = (item: StructureTypeInfo) => {
    // Check if affordable
    if (credits < item.cost) {
      onAddLogMessage(`Insufficient Credits! Cannot afford ${item.name}.`, 'danger');
      playSynthSound('alert_low_power');
      return;
    }

    // Single item build limit
    const alreadyBuilding = queue.some(q => q.id === item.id);
    if (alreadyBuilding) {
      onAddLogMessage(`${item.name} is already in the construction queue.`, 'warning');
      return;
    }

    // Deduct credits
    setCredits(prev => Math.max(0, prev - item.cost));
    playSynthSound('building');
    onAddLogMessage(`Construction started: Allocating resources to craft ${item.name}...`, 'info');

    // Add to local queue
    setQueue(prev => [
      ...prev,
      {
        id: item.id,
        category: activeTab,
        progress: 0,
        paused: false,
      }
    ]);
  };

  // Place complete building onto the battlefield
  const handlePlaceItem = (queued: BuildQueueItem) => {
    const allBuilds = [...activeStructuresList, ...activeDefensesList];
    const bInfo = allBuilds.find(b => b.id === queued.id);
    if (!bInfo) return;

    // Call map component placement mode
    setPlacementItem({
      id: bInfo.id,
      name: bInfo.name,
      cost: bInfo.cost,
      category: queued.category,
      icon: bInfo.icon
    });

    // Remove from queue
    setQueue(prev => prev.filter(q => q.id !== queued.id));

    // Update global power grid statistics
    setPowerStatus(prev => {
      const nextProd = bInfo.power > 0 ? prev.prod + bInfo.power : prev.prod;
      const nextCons = bInfo.power < 0 ? prev.cons + Math.abs(bInfo.power) : prev.cons;
      return {
        prod: nextProd,
        cons: nextCons
      };
    });
  };

  // Calculate Power Gauge percent
  const powerPercentage = powerStatus.prod > 0 
    ? Math.min(100, Math.round((powerStatus.cons / powerStatus.prod) * 100))
    : 100;

  let powerGaugeColor = 'bg-emerald-500';
  if (powerPercentage > 95) {
    powerGaugeColor = 'bg-red-500 animate-pulse';
  } else if (powerPercentage > 75) {
    powerGaugeColor = 'bg-yellow-500';
  }

  return (
    <div id="command_sidebar_panel" className="bg-neutral-950 border border-neutral-800 rounded p-4 flex flex-col h-full shadow-2xl relative">
      {/* Absolute futuristic metal screw corner details */}
      <div className="absolute top-1 left-1 text-[8px] text-neutral-800">＋</div>
      <div className="absolute top-1 right-1 text-[8px] text-neutral-800">＋</div>
      <div className="absolute bottom-1 left-1 text-[8px] text-neutral-800">＋</div>
      <div className="absolute bottom-1 right-1 text-[8px] text-neutral-800">＋</div>

      {/* Credit Counter */}
      <div className="bg-neutral-900 border-2 border-neutral-800 rounded p-3 mb-4 text-center relative shadow-inner">
        <div className="absolute top-1 left-2 text-[8px] font-mono tracking-widest text-neutral-500">CREDITS</div>
        <div className="flex items-center justify-center gap-2 mt-1.5">
          <Coins className="w-5 h-5 text-yellow-500 animate-pulse" />
          <span className="font-mono text-2xl font-black tracking-widest text-green-400">
            ${credits.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Interactive Power Bar */}
      <div className="bg-neutral-900 border border-neutral-800 p-2.5 rounded mb-4 font-mono text-[11px] relative">
        <div className="flex justify-between items-center mb-1 pb-1 border-b border-neutral-800/60">
          <span className="flex items-center gap-1 text-neutral-400">
            <Zap className="w-3.5 h-3.5 text-yellow-500" /> POWER GRID
          </span>
          <span className="text-white font-bold">
            {powerStatus.cons} / {powerStatus.prod} MW
          </span>
        </div>
        
        {/* Power Line Indicators */}
        <div className="w-full h-3.5 bg-neutral-950 rounded-full border border-neutral-800 overflow-hidden relative">
          <div 
            className={`h-full ${powerGaugeColor} transition-all duration-300`} 
            style={{ width: `${powerPercentage}%` }}
          />
          {/* Deficit warning label */}
          {powerStatus.cons > powerStatus.prod && (
            <div className="absolute inset-0 flex items-center justify-center text-[8px] font-extrabold text-red-100 uppercase bg-red-600/10 pointer-events-none animate-pulse">
              LOW POWER STATE
            </div>
          )}
        </div>
      </div>

      {/* Tab Selectors (Structures vs Defenses) */}
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {(['STRUCTURES', 'DEFENSES'] as TabType[]).map(tab => (
          <button
            key={tab}
            id={`tab_select_${tab.toLowerCase()}`}
            onClick={() => {
              playSynthSound('click');
              setActiveTab(tab);
            }}
            className={`font-mono text-[10px] tracking-widest py-1.5 px-2 text-center rounded border transition-all focus:outline-none uppercase ${activeTab === tab ? 'bg-amber-600 hover:bg-amber-500 text-black border-amber-400 font-extrabold' : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border-neutral-800'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Visible tech option building cards */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar max-h-[320px]">
        {visibleItems.map(item => {
          // Check if currently inside construction progress queue
          const queueItem = queue.find(q => q.id === item.id);
          const isComplete = queueItem && queueItem.progress >= 100;
          const isBuilding = queueItem && queueItem.progress < 100;

          return (
            <div
              id={`cmd_sidebar_item_${item.id}`}
              key={item.id}
              onClick={() => {
                if (isComplete) {
                  handlePlaceItem(queueItem);
                } else if (!isBuilding) {
                  handleItemClick(item);
                }
              }}
              className={`bg-neutral-900 border hover:border-amber-500 p-2.5 rounded transition-all cursor-pointer select-none group relative ${isComplete ? 'ring-2 ring-emerald-500 border-emerald-400 animate-pulse bg-emerald-950/20' : 'border-neutral-800'}`}
            >
              {/* Build Progress overlay */}
              {isBuilding && (
                <div className="absolute inset-0 bg-neutral-950/85 rounded flex flex-col justify-center items-center z-10 p-1">
                  <RefreshCw className="w-4 h-4 text-amber-500 animate-spin mb-1" />
                  <p className="text-[10px] font-mono text-amber-500 font-bold">
                    BUILDING {Math.floor(queueItem.progress)}%
                  </p>
                  <div className="w-16 h-1.5 bg-neutral-850 rounded mt-1 border border-neutral-800 overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${queueItem.progress}%` }} />
                  </div>
                </div>
              )}

              {/* Ready placement overlay button */}
              {isComplete && (
                <div className="absolute top-1 right-2 bg-emerald-600 text-black px-1.5 py-0.5 rounded text-[8px] font-mono font-black animate-bounce">
                  READY
                </div>
              )}

              <div className="flex items-start gap-2">
                <span className="text-xl bg-neutral-950 p-1.5 rounded border border-neutral-800 leading-none group-hover:scale-105 transition-all">
                  {item.icon}
                </span>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-neutral-100 font-mono truncate leading-none mb-1">
                    {item.name}
                  </h3>
                  <p className="text-[9px] text-neutral-400 leading-tight line-clamp-1 group-hover:line-clamp-none transition-all">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Technical indicators footer */}
              <div className="flex items-center justify-between text-[9px] font-mono text-yellow-500 mt-2 pt-1.5 border-t border-neutral-800">
                <span className="flex items-center gap-1 font-bold text-green-400">
                  ${item.cost}
                </span>
                <span className="text-neutral-500">
                  {item.power > 0 ? `+${item.power} MW` : `${item.power} MW`}
                </span>
              </div>
            </div>
          );
        })}

        {visibleItems.length === 0 && (
          <div className="text-center py-6 border border-dashed border-neutral-800 rounded bg-neutral-950">
            <ShieldQuestion className="w-6 h-6 text-neutral-600 mx-auto mb-1" />
            <p className="text-[10px] text-neutral-500 font-mono">No military options unlocked.</p>
          </div>
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-neutral-850 text-center">
        <p className="text-[9px] font-mono text-neutral-500 leading-none">
          C&C RADAR HUD TERMINAL v2.0
        </p>
      </div>
    </div>
  );
}
