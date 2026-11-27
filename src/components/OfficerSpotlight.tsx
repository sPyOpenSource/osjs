import React from 'react';
import { Faction, Officer } from '../types';
import AvatarRenderer from './AvatarRenderer';

export interface OfficerSpotlightProps {
  officer: Officer | null;
  candidates: Officer[];
  factions: Faction[];
  scenarioYear: number;
  currentCityName?: string;
  onSelectOfficerId: (officerId: string) => void;
  onCollapse: () => void;
}

export default function OfficerSpotlight({
  officer,
  candidates,
  factions,
  scenarioYear,
  currentCityName,
  onSelectOfficerId,
  onCollapse,
}: OfficerSpotlightProps) {
  const factionName = officer
    ? (factions.find(f => f.id === officer.factionId)?.name ?? officer.factionId)
    : '';
  const emptyOptionText = currentCityName
    ? `${currentCityName} 暂无其他同城武将`
    : '暂无其他可选武将';

  return (
    <div id="officer-spotlight-card" className="p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-mono font-semibold text-slate-400">
          {currentCityName ? `${currentCityName} 同城武将` : '当前聚焦武将'}
        </span>
        <button
          type="button"
          onClick={onCollapse}
          className="text-xs font-mono text-slate-400 hover:text-slate-200 cursor-pointer"
          aria-label="收起军师栏"
        >
          收起
        </button>
      </div>

      <label className="block">
        <span className="sr-only">
          {currentCityName
            ? `选择 ${currentCityName} 同城武将（不含本人）`
            : '选择对话或聚焦武将（不含本人）'}
        </span>
        <select
          id="select-spotlight-officer"
          aria-label={
            currentCityName
              ? `选择 ${currentCityName} 同城武将（不含本人）`
              : '选择聚焦武将（不含本人）'
          }
          value={officer?.id ?? ''}
          disabled={candidates.length === 0}
          onChange={e => onSelectOfficerId(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/60 focus:outline-none rounded-lg px-2.5 py-1.5 text-xs text-slate-200 cursor-pointer disabled:opacity-50"
        >
          {candidates.length === 0 ? (
            <option value="">{emptyOptionText}</option>
          ) : (
            candidates.map(cand => {
              const candFaction = factions.find(f => f.id === cand.factionId)?.name ?? cand.factionId;
              return (
                <option key={cand.id} value={cand.id}>
                  {cand.name} · {candFaction}
                </option>
              );
            })
          )}
        </select>
      </label>

      {officer ? (
        <>
          <div className="flex items-center gap-3.5">
            <AvatarRenderer style={officer.avatarStyle} size={64} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <h3 className="font-serif text-base font-bold text-slate-100 leading-snug">
                  {officer.name}
                </h3>
                {officer.styleName && (
                  <span className="text-xs text-slate-400 font-mono">字{officer.styleName}</span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                {factionName} · {scenarioYear} 年
              </p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-slate-800/70 text-center font-mono text-[11px] tabular-nums">
            <div>
              <span className="text-slate-500 block">统</span>
              <strong className="text-teal-400">{officer.stats.leadership}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">武</span>
              <strong className="text-amber-400">{officer.stats.force}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">智</span>
              <strong className="text-sky-400">{officer.stats.intelligence}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">政</span>
              <strong className="text-emerald-400">{officer.stats.politics}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">魅</span>
              <strong className="text-rose-300">{officer.stats.charisma}</strong>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-lg border border-slate-800/80 bg-slate-950/70 px-3 py-2.5 text-[11px] text-slate-400 leading-relaxed">
          <p className="text-slate-300 font-medium">{emptyOptionText}</p>
          <p className="text-slate-500 mt-0.5">切换至有其他武将驻守的城池即可在此聚焦选将。</p>
        </div>
      )}
    </div>
  );
}
