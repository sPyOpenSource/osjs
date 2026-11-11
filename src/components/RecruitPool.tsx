import React from 'react';
import { Officer } from '../types';
import { FACTIONS } from '../data';
import { Shield, Swords, Brain, Scroll, Sparkles } from 'lucide-react';
import Button from './Button';

interface RecruitPoolProps {
  officers: Officer[];
  atLimit: boolean;
  onRecruit: (officerId: string) => void;
}

const STAT_ICONS: Record<keyof Officer['stats'], React.ElementType> = {
  leadership: Shield,
  force: Swords,
  intelligence: Brain,
  politics: Scroll,
  charisma: Sparkles,
};

export default function RecruitPool({ officers, atLimit, onRecruit }: RecruitPoolProps) {
  const matchedFaction = (factionId: string) => FACTIONS.find((f) => f.id === factionId);

  const topStat = (officer: Officer) => {
    const stats = Object.entries(officer.stats) as [keyof Officer['stats'], number][];
    stats.sort((a, b) => b[1] - a[1]);
    return stats[0];
  };

  if (officers.length === 0) {
    return (
      <div className="party-recruit-empty">
        <p className="trade-muted text-sm">无可招募武将</p>
      </div>
    );
  }

  return (
    <div className="party-recruit-list">
      {officers.map((officer) => {
        const [statKey, statVal] = topStat(officer);
        const Icon = STAT_ICONS[statKey];
        const faction = matchedFaction(officer.factionId);
        return (
          <Button
            key={officer.id}
            id={`btn-recruit-${officer.id}`}
            data-testid={`btn-recruit-${officer.id}`}
            disabled={atLimit}
            onClick={() => onRecruit(officer.id)}
            className="party-recruit-button"
          >
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold">{officer.name}</span>
              <span
                className="text-[10px] font-mono text-slate-400 bg-slate-950/60 px-1.5 py-0.5 rounded border border-slate-800/60"
              >
                {faction?.name || officer.factionId}
              </span>
              <span className="ml-auto text-[10px] font-mono">
                <Icon size={10} className="text-slate-400 inline" />
                {statVal}
              </span>
            </div>
            <span className="block text-[10px] text-amber-400 font-mono mt-0.5">招募</span>
          </Button>
        );
      })}
    </div>
  );
}
