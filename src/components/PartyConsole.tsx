import type { Equipment, EquipmentSlot, Officer, Party, RpgCharacter } from '../types';
import { MAX_COMPANIONS } from '../utils/party';
import PartyRoster from './PartyRoster';
import RecruitPool from './RecruitPool';

interface PartyConsoleProps {
  party: Party;
  characters: Record<string, RpgCharacter>;
  officers: Officer[];
  availableEquipment: Equipment[];
  onRecruit: (officerId: string) => void;
  onDismiss: (officerId: string) => void;
  onSpendSkillPoint: (officerId: string, skillId: string) => void;
  onEquip: (officerId: string, slot: EquipmentSlot, equipment: Equipment) => void;
}

export default function PartyConsole({
  party,
  characters,
  officers,
  availableEquipment,
  onRecruit,
  onDismiss,
  onSpendSkillPoint,
  onEquip,
}: PartyConsoleProps) {
  const memberIds = [party.protagonistId, ...party.companionIds];
  const recruitable = officers.filter(officer => !memberIds.includes(officer.id));
  const atLimit = party.companionIds.length >= MAX_COMPANIONS;

  return (
    <section className="party-console" aria-label="队伍控制台">
      <div className="party-console-panes">
        <div className="party-console-pane" data-testid="party-console-roster">
          <PartyRoster
            party={party}
            characters={characters}
            officers={officers}
            availableEquipment={availableEquipment}
            onDismiss={onDismiss}
            onSpendSkillPoint={onSpendSkillPoint}
            onEquip={onEquip}
          />
        </div>

        <section
          className="party-console-pane"
          data-testid="party-console-recruit"
          aria-labelledby="party-console-recruit-heading"
        >
          <header className="party-console-heading">
            <h2 id="party-console-recruit-heading">招募同伴</h2>
            <span className="party-console-count trade-muted">
              {`同伴 ${party.companionIds.length}/${MAX_COMPANIONS}`}
            </span>
          </header>
          <RecruitPool officers={recruitable} atLimit={atLimit} onRecruit={onRecruit} />
        </section>
      </div>
    </section>
  );
}
