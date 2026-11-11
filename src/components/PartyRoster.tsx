import React from 'react';
import { Plus, Shield, Sword, Target, User, Users, X, type LucideIcon } from 'lucide-react';
import { Equipment, EquipmentSlot, Officer, Party, RpgCharacter } from '../types';
import { xpForLevel } from '../utils/rpg';
import AvatarRenderer from './AvatarRenderer';
import Button from './Button';

const MAX_COMPANIONS = 4;
const AVATAR_SIZE = 36;

const SLOTS: { key: EquipmentSlot; label: string; icon: LucideIcon }[] = [
  { key: 'weapon', label: '武器', icon: Sword },
  { key: 'armor', label: '防具', icon: Shield },
  { key: 'accessory', label: '饰品', icon: Target },
];

function defaultCharacter(officerId: string): RpgCharacter {
  return { officerId, level: 1, xp: 0, skillPoints: 0, learnedSkills: [], equipment: {} };
}

function characterFor(characters: Record<string, RpgCharacter>, officerId: string): RpgCharacter {
  return characters[officerId] ?? defaultCharacter(officerId);
}

function xpPercentFor(character: RpgCharacter): number {
  const next = xpForLevel(character.level + 1);
  return next > 0 ? Math.min(100, Math.round((character.xp / next) * 100)) : 100;
}

function officerFor(officers: Officer[], officerId: string): Officer | undefined {
  return officers.find(officer => officer.id === officerId);
}

interface PartyRosterProps {
  party: Party;
  characters: Record<string, RpgCharacter>;
  officers: Officer[];
  availableEquipment: Equipment[];
  onDismiss: (officerId: string) => void;
  onSpendSkillPoint: (officerId: string, skillId: string) => void;
  onEquip: (officerId: string, slot: EquipmentSlot, equipment: Equipment) => void;
}

export default function PartyRoster({
  party,
  characters,
  officers,
  availableEquipment,
  onDismiss,
  onSpendSkillPoint,
  onEquip,
}: PartyRosterProps) {
  const memberIds = [party.protagonistId, ...party.companionIds];

  return (
    <section className="party-roster" aria-label="队伍">
      <header className="party-roster-heading">
        <Users size={16} aria-hidden="true" />
        <h2>队伍</h2>
        <span className="party-roster-count trade-muted">
          {`成员 ${memberIds.length} · 同伴 ${party.companionIds.length}/${MAX_COMPANIONS}`}
        </span>
      </header>

      <div className="party-roster-list">
        {memberIds.map(officerId => {
          const officer = officerFor(officers, officerId);
          const character = characterFor(characters, officerId);
          const isProtagonist = officerId === party.protagonistId;
          const name = officer?.name || officerId;
          const nextLevelXp = xpForLevel(character.level + 1);
          const xpPercent = xpPercentFor(character);

          return (
            <article
              key={officerId}
              className={`party-card ${isProtagonist ? 'party-card-protagonist' : ''}`}
              data-testid={`party-card-${officerId}`}
            >
              <div className="party-card-header">
                <div className="party-card-avatar">
                  {officer ? (
                    <AvatarRenderer style={officer.avatarStyle} size={AVATAR_SIZE} />
                  ) : (
                    <span className="party-avatar-fallback" aria-hidden="true">
                      <User size={16} />
                    </span>
                  )}
                </div>

                <div className="party-card-info">
                  <div className="party-card-title">
                    <h3 className="party-card-name">{name}</h3>
                    <span className="party-card-level">{`Lv.${character.level}`}</span>
                    {isProtagonist && <span className="party-card-badge">主角</span>}
                  </div>

                  <div className="party-card-skills">
                    <span className="party-card-skill-points">
                      {`技能点 ${character.skillPoints}`}
                    </span>
                    <Button
                      data-testid={`party-spend-${officerId}`}
                      className="party-spend-button"
                      disabled={character.skillPoints <= 0}
                      onClick={() => onSpendSkillPoint(officerId, `skill-lv${character.level}`)}
                    >
                      <Plus size={11} aria-hidden="true" /> 学习
                    </Button>
                  </div>

                  <div className="party-xp">
                    <span className="party-xp-track" aria-hidden="true">
                      <span className="party-xp-fill" style={{ width: `${xpPercent}%` }} />
                    </span>
                    <span className="party-xp-label">
                      {`经验 ${character.xp} / ${nextLevelXp}`}
                    </span>
                  </div>
                </div>

                {!isProtagonist && (
                  <Button
                    data-testid={`party-dismiss-${officerId}`}
                    className="party-dismiss-button"
                    aria-label={`解散 ${name}`}
                    onClick={() => onDismiss(officerId)}
                  >
                    <X size={12} aria-hidden="true" />
                  </Button>
                )}
              </div>

              <div className="party-slot-list">
                {SLOTS.map(slot => {
                  const equipped = character.equipment[slot.key];
                  const options = availableEquipment.filter(
                    item => item.slot === slot.key && !equipped,
                  );
                  const Icon = slot.icon;

                  return (
                    <div
                      key={slot.key}
                      className="party-slot"
                      data-testid={`party-slot-${officerId}-${slot.key}`}
                    >
                      <span className="party-slot-label">
                        <Icon size={12} aria-hidden="true" />
                        {slot.label}
                      </span>
                      {equipped ? (
                        <span className="party-equipped" title={equipped.name}>
                          {equipped.name}
                        </span>
                      ) : options.length ? (
                        <select
                          className="party-slot-select"
                          defaultValue=""
                          aria-label={`${name} ${slot.label}`}
                          onChange={event => {
                            const itemId = event.target.value;
                            if (!itemId) return;
                            const item = availableEquipment.find(entry => entry.id === itemId);
                            if (item) onEquip(officerId, slot.key, item);
                          }}
                        >
                          <option value="">装备 …</option>
                          {options.map(item => (
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
            </article>
          );
        })}
      </div>
    </section>
  );
}
