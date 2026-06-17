import React, { useState } from 'react';
import { Faction } from '../types';
import { BookOpen, RefreshCw, Zap, Crosshair, Award } from 'lucide-react';
import { STRUCTURES_DATA, INFANTRY_DATA, VEHICLES_DATA } from '../constants/gameData';

export default function NostalgiaEncyclopedia() {
  const [activeFaction, setActiveFaction] = useState<Faction>('ALLIES');
  const [selectedTopic, setSelectedTopic] = useState<'UNITS' | 'STRUCTURES' | 'TRIVIA'>('UNITS');

  const triviaPool = [
    {
      title: 'Hell March Sound Theme',
      body: 'Frank Klepacki wrote "Hell March 2" for Red Alert 2 by blending heavy metal guitar riffs, synth sirens, and the sound of marching synthetic boots. It became C&C\'s iconic theme song.'
    },
    {
      title: 'Kirov Airship Armor',
      body: 'In real game code, a single fully-promoted elite Kirov Airship regenerates hitpoints over time and drops bombs with high structural splash damage, capable of leveling whole Soviet encampments.'
    },
    {
      title: 'Prism Tower Array Syncing',
      body: 'When Prism Towers are built close to each other, their beams join together to channel energy into the primary firing tower, increasing laser damage output by up to 200% for rapid armored zaps!'
    },
    {
      title: 'Tanya Adams & Yuri Mind Clones',
      body: 'Tanya Adams is immune to telepathic mind-control and can blow up buildings instantly with C4 charges, making her the Allies\' ultimate commando weapon against Yuri camps.'
    }
  ];

  return (
    <div id="encyclopedia_panel" className="bg-neutral-950 border border-neutral-800 rounded p-4 shadow-2xl relative">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-amber-500 animate-pulse" />
          <h2 className="text-xs font-mono tracking-widest text-amber-500 uppercase">
            C&C Military Database (RA2 Encyclopedia)
          </h2>
        </div>

        {/* Faction Pills */}
        <div className="flex gap-1">
          {(['ALLIES', 'SOVIETS', 'YURI'] as Faction[]).map(fac => (
            <button
              id={`ency_fac_pills_${fac.toLowerCase()}`}
              key={fac}
              onClick={() => setActiveFaction(fac)}
              className={`text-[9px] font-mono tracking-widest py-0.5 px-2 rounded-sm border transition-all ${activeFaction === fac ? 'bg-amber-600 hover:bg-amber-500 text-black border-amber-400 font-extrabold' : 'bg-neutral-900 border-neutral-850 hover:bg-neutral-800 text-neutral-400'}`}
            >
              {fac}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mb-3">
        {(['UNITS', 'STRUCTURES', 'TRIVIA'] as const).map(topic => (
          <button
            id={`ency_topic_btn_${topic.toLowerCase()}`}
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            className={`font-mono text-[10px] pb-1 border-b-2 transition-all ${selectedTopic === topic ? 'text-amber-400 border-amber-500' : 'text-neutral-500 border-transparent hover:text-neutral-400'}`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Database viewer content */}
      <div className="bg-neutral-900/60 border border-neutral-850 rounded p-3 min-h-[140px] max-h-[220px] overflow-y-auto custom-scrollbar">
        {selectedTopic === 'UNITS' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[...(INFANTRY_DATA[activeFaction] || []), ...(VEHICLES_DATA[activeFaction] || [])].map(unit => (
              <div key={unit.id} className="bg-neutral-950 border border-neutral-800 p-2 rounded flex gap-2">
                <span className="text-2xl bg-neutral-900 p-1 rounded border border-neutral-850 self-start leading-none mt-0.5">
                  {unit.icon}
                </span>
                <div className="flex-1 min-w-0 font-mono">
                  <h4 className="text-[11px] font-bold text-white uppercase">{unit.name}</h4>
                  <p className="text-[9px] text-neutral-400 leading-tight mb-2.5">{unit.description}</p>
                  
                  {/* Combat Stats */}
                  <div className="flex items-center gap-3 text-[8px] text-amber-500/80 pt-1.5 border-t border-neutral-900/80">
                    <span className="flex items-center gap-1">
                      <Crosshair className="w-2.5 h-2.5" /> DMG: {unit.damage}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5" /> HP: {unit.hp}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-2.5 h-2.5" /> COST: ${unit.cost}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTopic === 'STRUCTURES' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {STRUCTURES_DATA[activeFaction]?.map(struct => (
              <div key={struct.id} className="bg-neutral-950 border border-neutral-800 p-2 rounded flex gap-2">
                <span className="text-2xl bg-neutral-900 p-1 rounded border border-neutral-850 self-start leading-none mt-0.5">
                  {struct.icon}
                </span>
                <div className="flex-1 min-w-0 font-mono">
                  <h4 className="text-[11px] font-bold text-white uppercase">{struct.name}</h4>
                  <p className="text-[9px] text-neutral-400 leading-tight mb-1.5">{struct.description}</p>
                  <p className="text-[9px] text-green-400">Construction cost: ${struct.cost}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTopic === 'TRIVIA' && (
          <div className="space-y-3">
            {triviaPool.map((t, idx) => (
              <div key={idx} className="bg-neutral-950 border border-neutral-800 p-2.5 rounded font-mono">
                <h4 className="text-xs font-bold text-amber-400 mb-1">💡 {t.title}</h4>
                <p className="text-[10px] text-neutral-350 leading-relaxed font-sans">{t.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-2 flex justify-between items-center text-[9px] font-mono text-neutral-500">
        <span>STRATEGIC INTEL DATABANK</span>
        <span>SECURITY CLEARANCE: LEVEL 5</span>
      </div>
    </div>
  );
}
