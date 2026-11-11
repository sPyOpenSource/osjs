import React from 'react';
import { Officer } from '../types';
import { FACTIONS } from '../data';
import { Shield, Swords, Brain, Scroll, Sparkles, type LucideIcon } from 'lucide-react';
import Button from './Button';
import { getRating } from '../utils/rating';

interface RecruitPoolProps {
  officers: Officer[];
  atLimit: boolean;
  onRecruit: (officerId: string) => void;
}

const STAT_DISPLAY: Record<keyof Officer['stats'], { icon: LucideIcon; label: string }> = {
  leadership: { icon: Shield, label: '统率' },
  force: { icon: Swords, label: '武力' },
  intelligence: { icon: Brain, label: '智力' },
  politics: { icon: Scroll, label: '政治' },
  charisma: { icon: Sparkles, label: '魅力' },
};

const STAT_KEYS = Object.keys(STAT_DISPLAY) as (keyof Officer['stats'])[];
const FACTIONS_BY_ID = new Map(FACTIONS.map((faction) => [faction.id, faction]));

function topStat(officer: Officer): [keyof Officer['stats'], number] {
  return STAT_KEYS.reduce<[keyof Officer['stats'], number]>(
    (best, key) => (officer.stats[key] > best[1] ? [key, officer.stats[key]] : best),
    ['leadership', officer.stats.leadership],
  );
}

export default function RecruitPool({ officers, atLimit, onRecruit }: RecruitPoolProps) {
  if (officers.length === 0) {
    return <p className="trade-muted text-sm">无可招募武将</p>;
  }

  return (
    <div>
      {atLimit && (
        <p className="recruit-pool-limit" role="status">
          同伴已满（4/4），无法继续招募
        </p>
      )}
      <ul className="recruit-pool-list">
        {officers.map((officer) => {
          const [statKey, statVal] = topStat(officer);
          const { icon: Icon, label } = STAT_DISPLAY[statKey];
          const factionName = FACTIONS_BY_ID.get(officer.factionId)?.name || officer.factionId;
          const rating = getRating(statVal);
          return (
            <li key={officer.id} data-testid={`recruit-card-${officer.id}`}>
              <Button
                data-testid={`btn-recruit-${officer.id}`}
                disabled={atLimit}
                onClick={() => onRecruit(officer.id)}
                className="recruit-pool-button"
              >
                <span className="recruit-pool-row">
                  <span className="recruit-pool-name">{officer.name}</span>
                  <span className="recruit-pool-faction">{factionName}</span>
                  <span className="recruit-pool-stat">
                    <Icon size={10} aria-hidden="true" />
                    <span className="sr-only">{label}</span>
                    {statVal}
                    <span className={`recruit-pool-grade ${rating.color}`} aria-hidden="true">
                      {rating.letter}
                    </span>
                  </span>
                </span>
                <span className="recruit-pool-cta">招募</span>
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
