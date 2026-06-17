import React, { useState, useEffect } from 'react';
import { LogMessage, Faction } from '../types';
import { Terminal, Shield, Award, Map, RefreshCw } from 'lucide-react';

interface MissionBriefingProps {
  faction: Faction;
  credits: number;
  waveCount: number;
  structuresPlaced: { id: string; type: string }[];
  unitsCount: number;
  logMessages: LogMessage[];
  onAddLogMessage: (text: string, type: 'info' | 'warning' | 'danger' | 'success') => void;
}

interface CampaignMission {
  title: string;
  codename: string;
  location: string;
  objectiveText: string;
  targetRefineryCount: number;
  targetDefenseCount: number;
  targetWaveCount: number;
  flavor: string;
}

const CAMPAIGNS: Record<Faction, CampaignMission[]> = {
  ALLIES: [
    {
      title: 'Operation: Hell March',
      codename: 'EAGLE EYE D-1',
      location: 'New York Coastline',
      objectiveText: 'Establish perimeter by placing 1 Ore Refinery and surviving up to Wave 2 of the Soviet Fleet attacks.',
      targetRefineryCount: 1,
      targetDefenseCount: 1,
      targetWaveCount: 2,
      flavor: 'Commander! The Soviet Navy has staged a backdoor amphibious assault near Liberty Island. Secure our power grid, construct defense pillboxes, and safeguard the Construction Yard at all costs.'
    },
    {
      title: 'Operation: Chrono Defense',
      codename: 'LIGHTNING ROD',
      location: 'Black Forest, Germany',
      objectiveText: 'Secure German Einstein Laboratory. Gather $15,000 cash for research and build 2 advanced Prism Towers.',
      targetRefineryCount: 2,
      targetDefenseCount: 2,
      targetWaveCount: 4,
      flavor: 'Professor Einstein has successfully calibrated the Prism Array. However, Yuri mind-clones are marching through the hills. Protect the laboratory using focused laser defenses.'
    }
  ],
  SOVIETS: [
    {
      title: 'Operation: Red Dawn',
      codename: 'HAMMER FORCE D-2',
      location: 'Washington D.C. Suburbs',
      objectiveText: 'Establish a Tesla power core. Place 2 Tesla Reactors and 1 Tesla Obelisk on the front lines.',
      targetRefineryCount: 1,
      targetDefenseCount: 1,
      targetWaveCount: 2,
      flavor: 'The capital is already within grasp, but Allied GIs are gathering sandbags to block our tank batteries. Build lightning arrays to vaporize Allied heavy armor.'
    },
    {
      title: 'Operation: Polar Storm',
      codename: 'ALASKA DRIFT',
      location: 'Chukotka Peninsula',
      objectiveText: 'Dismantle the weather controller! Train 4 armored tanks, and hold the line against wave 5.',
      targetRefineryCount: 2,
      targetDefenseCount: 3,
      targetWaveCount: 5,
      flavor: 'Allies are channeling a lightning storm over our base. Use Soviet heavy Rhino or Apocalypse divisions. Secure ore reserves before we run dry!'
    }
  ],
  YURI: [
    {
      title: 'Operation: Brain Wash',
      codename: 'MIND MATRIX',
      location: 'London, United Kingdom',
      objectiveText: 'Erect the Psychic Mind-Mutator unit. Accumulate $8,000 cash and complete defense structures.',
      targetRefineryCount: 1,
      targetDefenseCount: 2,
      targetWaveCount: 3,
      flavor: 'Yuri is master of all minds. London is sleeping, but Allied security forces are pushing back. Put down psychic barrier walls and mind-slicing towers to initiate submission.'
    }
  ]
};

export default function MissionBriefing({
  faction,
  credits,
  waveCount,
  structuresPlaced,
  unitsCount,
  logMessages,
  onAddLogMessage,
}: MissionBriefingProps) {
  const [activeMissionIndex, setActiveMissionIndex] = useState(0);

  const missions = CAMPAIGNS[faction] || [];
  const currentMission = missions[activeMissionIndex] || missions[0];

  // Calculated objective statistics
  const refineryCount = structuresPlaced.filter(s => s.type.toLowerCase().includes('ore')).length;
  // defenses towers
  const defenseCount = structuresPlaced.filter(s => 
    s.type.includes('prism') || s.type.includes('tesla') || s.type.includes('turret') || s.type.includes('shield') || s.type.includes('psychic') || s.type.includes('gatling')
  ).length;

  const refineryComplete = refineryCount >= currentMission.targetRefineryCount;
  const defenseComplete = defenseCount >= currentMission.targetDefenseCount;
  const waveComplete = waveCount >= currentMission.targetWaveCount;

  const missionCompleted = refineryComplete && defenseComplete && waveComplete;

  const [notifiedCompleted, setNotifiedCompleted] = useState<string | null>(null);

  useEffect(() => {
    if (missionCompleted && notifiedCompleted !== currentMission.title) {
      onAddLogMessage(`★ MISSION ACCOMPLISHED: ${currentMission.title}! You have established absolute regional control.`, 'success');
      setNotifiedCompleted(currentMission.title);
    }
  }, [missionCompleted, currentMission, notifiedCompleted]);

  // Handle map change/reset
  const rotateMission = () => {
    const nextIdx = (activeMissionIndex + 1) % missions.length;
    setActiveMissionIndex(nextIdx);
    onAddLogMessage(`Tactical objectives swapped: Mobilized for ${missions[nextIdx].title}`, 'info');
  };

  return (
    <div id="mission_briefing_panel" className="bg-neutral-950 border border-neutral-800 rounded p-4 shadow-2xl flex flex-col md:flex-row gap-4 h-full">
      {/* Briefing Text Column */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-2 pb-1 border-b border-neutral-800">
            <h2 className="text-xs font-mono tracking-widest text-amber-500 uppercase flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-500" />
              Tactical Mission Dossier
            </h2>
            <span className="text-[10px] font-mono text-red-500 font-extrabold animate-pulse">
              CODENAME: {currentMission.codename}
            </span>
          </div>

          <p className="text-sm font-semibold text-neutral-100 font-mono tracking-wide mb-1">
            {currentMission.title}
          </p>
          <p className="text-[9px] font-mono text-neutral-500 mb-2 uppercase tracking-wider">
            THEATRE OF WAR: <span className="text-neutral-300">{currentMission.location}</span>
          </p>

          <p id="mission_flavor_text" className="text-xs text-neutral-400 font-sans leading-relaxed tracking-normal mb-3 border-l-2 border-neutral-800 pl-2.5">
            {currentMission.flavor}
          </p>
        </div>

        {/* Change / Next button and status bar */}
        {missions.length > 1 && (
          <button
            id="next_mission_btn"
            onClick={rotateMission}
            className="flex items-center gap-1.5 font-mono text-[10px] text-amber-400 hover:text-amber-300 transition-all bg-neutral-900 border border-neutral-850 hover:border-amber-600 px-3 py-1.5 rounded w-fit capitalize cursor-pointer focus:outline-none"
          >
            <RefreshCw className="w-3 h-3 animate-spin" /> CYCLE ALTERNATIVE OPERATION
          </button>
        )}
      </div>

      {/* Target Objectives Checkboxes */}
      <div className="w-full md:w-64 bg-neutral-900 border border-neutral-800 p-3 rounded flex flex-col justify-between">
        <div>
          <div className="font-mono text-[10px] text-neutral-400 flex items-center gap-1 mb-2.5 uppercase tracking-wider">
            <Award className="w-4 h-4 text-yellow-500" /> Objective Checklist
          </div>

          <div className="space-y-2">
            {/* Obj 1: Refinery */}
            <div className="flex items-center justify-between text-xs font-mono p-1.5 rounded bg-neutral-950 border border-neutral-850">
              <span className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={refineryComplete}
                  readOnly
                  className="accent-yellow-500 rounded border-neutral-800 w-3.5 h-3.5 pointer-events-none"
                />
                <span className="text-neutral-300 text-[11px]">Install Refinery Matrix</span>
              </span>
              <span className={refineryComplete ? 'text-green-400' : 'text-neutral-500'}>
                ({refineryCount}/{currentMission.targetRefineryCount})
              </span>
            </div>

            {/* Obj 2: Defense Towers */}
            <div className="flex items-center justify-between text-xs font-mono p-1.5 rounded bg-neutral-950 border border-neutral-850">
              <span className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={defenseComplete}
                  readOnly
                  className="accent-yellow-500 rounded border-neutral-800 w-3.5 h-3.5 pointer-events-none"
                />
                <span className="text-neutral-300 text-[11px]">Erect Defensive Sentry</span>
              </span>
              <span className={defenseComplete ? 'text-green-400' : 'text-neutral-500'}>
                ({defenseCount}/{currentMission.targetDefenseCount})
              </span>
            </div>

            {/* Obj 3: Wave survival */}
            <div className="flex items-center justify-between text-xs font-mono p-1.5 rounded bg-neutral-950 border border-neutral-850">
              <span className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={waveComplete}
                  readOnly
                  className="accent-yellow-500 rounded border-neutral-800 w-3.5 h-3.5 pointer-events-none"
                />
                <span className="text-neutral-300 text-[11px]">Repell Intrusion Waves</span>
              </span>
              <span className={waveComplete ? 'text-green-400 font-bold' : 'text-neutral-500 font-bold'}>
                (Wave {Math.max(0, waveCount - 1)}/{currentMission.targetWaveCount})
              </span>
            </div>
          </div>
        </div>

        {/* Global summary badge */}
        <div className="mt-3 pt-2.5 border-t border-neutral-800/60 flex items-center justify-between">
          <span className="text-[10px] font-mono text-neutral-500">HQ COM STATUS:</span>
          {missionCompleted ? (
            <span className="bg-green-900 border border-green-500 text-green-200 px-2.5 py-0.5 rounded text-[9px] font-mono font-black tracking-widest animate-pulse">
              VICTORY RECOLLECTED
            </span>
          ) : (
            <span className="bg-amber-950 border border-amber-600 text-amber-400 px-2.5 py-0.5 rounded text-[9px] font-mono font-black tracking-widest">
              ENGAGING COMBAT
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
