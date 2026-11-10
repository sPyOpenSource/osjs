import React, { useCallback, useMemo } from 'react';
import {
  UserPlus, User, Shield, Sword, Target, Plus, X, Award
} from 'lucide-react';
import { Officer, RpgCharacter, Party, Equipment, EquipmentSlot } from '../types';
import { xpForLevel } from '../utils/rpg';
import AvatarRenderer from './AvatarRenderer';
import Button from './Button';

const SLOTS: { key: EquipmentSlot; label: string; icon: React.ElementType }[] = [
  { key: 'weapon', label: '武器', icon: Sword },
  { key: 'armor', label: '防具', icon: Shield },
  { key: 'accessory', label: '饰品', icon: Target }
];

interface PartyPanelProps {
  party: Party;
  characters: Record<string, RpgCharacter>;
  officers: Officer[];
  availableEquipment: Equipment[];
  onRecruit: (officerId: string) => void;
  onDismiss: (officerId: string) => void;
  onSpendSkillPoint: (officerId: string, skillId: string) => void;
  onEquip: (officerId: string, slot: EquipmentSlot, equipment: Equipment) => void;
}

export default function PartyPanel({
  party,
  characters,
  officers,
  availableEquipment,
  onRecruit,
  onDismiss,
  onSpendSkillPoint,
  onEquip
}: PartyPanelProps) {
  const memberIds = useMemo(
    () => [party.protagonistId, ...party.companionIds],
    [party]
  );

  const isInParty = useCallback((id: string) => memberIds.includes(id), [memberIds]);

  const recruitable = useMemo(
    () => officers.filter(o => o.id !== party.protagonistId && !isInParty(o.id)),
    [officers, party.protagonistId, isInParty]
  );

  const companionCount = party.companionIds.length;
  const atLimit = companionCount >= 4;

  const characterFor = (officerId: string) =>
    characters[officerId] ?? { officerId, level: 1, xp: 0, skillPoints: 0, learnedSkills: [], equipment: {} };

  const xpPct = (officerId: string) => {
    const c = characterFor(officerId);
    const next = xpForLevel(c.level + 1);
    return next > 0 ? Math.min(100, Math.round((c.xp / next) * 100)) : 100;
  };

  const handleRecruit = useCallback(
    (officerId: string) => {
      onRecruit(officerId);
    },
    [onRecruit]
  );

  return (
    <section className="party-panel" aria-label="队伍">
      <div className="party-heading">
        <User size={18} />
        <h2>队伍</h2>
        <span className="trade-muted">
          {memberIds.length} 名成员 · 同伴 {companionCount}/4
        </span>
      </div>

      {/* Members */}
      <div className="party-members">
        {memberIds.map(officerId => {
          const officer = officers.find(o => o.id === officerId);
          const char = characterFor(officerId);
          const isProtagonist = officerId === party.protagonistId;
          const nextLevelXp = xpForLevel(char.level + 1);
          const xpPercent = xpPct(officerId);
          return (
            <article
              key={officerId}
              className={`party-card ${isProtagonist ? 'party-card-protagonist' : ''}`}
              data-testid={`party-card-${officerId}`}
            >
              <div className="party-card-header">
                <div className="party-card-avatar">
                  {officer ? (
                    <AvatarRenderer style={officer.avatarStyle} size={44} />
                  ) : (
                    <div className="h-11 w-11 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <User size={20} />
                    </div>
                  )}
                </div>
                <div className="party-card-info">
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="text-lg font-bold">{officer?.name || officerId}</h3>
                    <span className="text-xs font-mono text-amber-400">Lv.{char.level}</span>
                    {isProtagonist && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40">
                        主角
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{char.learnedSkills.length} 技能点可用</p>
                  {/* XP bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-amber-500 transition-all duration-500"
                      style={{ width: `${xpPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-2">
                    <span>经验 {char.xp}</span>
                    <span>下级 {nextLevelXp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">技能点</span>
                    <Button
                      id={`party-spend-${officerId}`}
                      data-testid={`party-spend-${officerId}`}
                      onClick={() => onSpendSkillPoint(officerId, `skill-lv${char.level}`)}
                      disabled={char.skillPoints <= 0}
                    >
                      <Plus size={12} /> 学习
                    </Button>
                  </div>
                </div>
                <div className="party-card-actions">
                  {!isProtagonist && (
                    <Button
                      id={`party-dismiss-${officerId}`}
                      data-testid={`party-dismiss-${officerId}`}
                      onClick={() => onDismiss(officerId)}
                      className="party-dismiss-button"
                    >
                      <X size={14} />
                    </Button>
                  )}
                </div>
              </div>

              {/* Equipment slots */}
              <div className="party-equipment">
                <span className="trade-muted block text-[10px] uppercase tracking-wider mb-1.5">装备</span>
                <div className="party-slot-list">
                  {SLOTS.map(slot => {
                    const equipped = char.equipment[slot.key];
                    const canEquip = availableEquipment.filter(e => e.slot === slot.key && !equipped);
                    return (
                      <div key={slot.key} className="party-slot">
                        <label className="party-slot-label">
                          <span>{slot.icon ? <slot.icon size={12} /> : null}</span>{slot.label}
                        </label>
                        {equipped ? (
                          <span className="party-equipped" title={equipped.name}>
                            {equipped.name}
                          </span>
                        ) : canEquip.length ? (
                          <select
                            id={`party-equip-${officerId}-${slot.key}`}
                            data-testid={`party-equip-${officerId}-${slot.key}`}
                            className="party-slot-select"
                            defaultValue=""
                            onChange={e => {
                              const id = e.target.value;
                              if (!id) return;
                              const item = availableEquipment.find(e => e.id === id);
                              if (item) onEquip(officerId, slot.key, item);
                            }}
                          >
                            <option value="">装备 …</option>
                            {canEquip.map(item => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="party-empty">空位</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Recruitment */}
      <div className="party-recruit">
        <div className="party-section-header">
          <UserPlus size={16} />
          <h3>招募同伴</h3>
          <span className={`trade-muted ${atLimit ? 'text-slate-500' : ''}`}>
            {atLimit ? '同伴已满（4/4）' : `可招募 ${4 - companionCount} 位`}
          </span>
        </div>
        <div className="party-recruit-list">
          {recruitable.length ? (
            recruitable.map(officer => (
              <Button
                key={officer.id}
                id={`party-recruit-${officer.id}`}
                data-testid={`party-recruit-${officer.id}`}
                disabled={atLimit}
                onClick={() => handleRecruit(officer.id)}
                className="party-recruit-button"
              >
                <UserPlus size={14} /> {officer.name}
              </Button>
            ))
          ) : (
            <p className="trade-muted text-sm">无可招募武将</p>
          )}
        </div>
      </div>

      {/* Award legend */}
      <div className="party-legend">
        <Award size={14} />
        <span className="trade-muted text-sm">
          完成任务可获得经验、黄金、粮草、装备与武将奖励；装备在“装备”栏从背包中装备。
        </span>
      </div>
    </section>
  );
}
