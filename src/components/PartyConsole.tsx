import type {
  Equipment,
  EquipmentSlot,
  Officer,
  Party,
  RelationshipRelation,
  RpgCharacter,
} from '../types';
import { FACTIONS } from '../data';
import type { DiplomacyState } from '../utils/diplomacy';
import { getRecruitRefusal, MAX_COMPANIONS, type RecruitRefusal } from '../utils/party';
import PartyRoster from './PartyRoster';
import RecruitPool from './RecruitPool';

export interface RecruitNotice {
  officerId: string;
  officerName: string;
  reason: string;
}

interface PartyConsoleProps {
  party: Party;
  characters: Record<string, RpgCharacter>;
  officers: Officer[];
  /** Optional subset of officers to offer in the recruit pool (e.g. filtered by search/faction). Defaults to every officer. */
  recruitCandidates?: Officer[];
  availableEquipment: Equipment[];
  onRecruit: (officerId: string) => void;
  onDismiss: (officerId: string) => void;
  onSpendSkillPoint: (officerId: string, skillId: string) => void;
  onEquip: (officerId: string, slot: EquipmentSlot, equipment: Equipment) => void;
  relationships?: RelationshipRelation[];
  diplomacyState?: DiplomacyState;
  playerFactionId?: string;
  recruitNotice?: RecruitNotice | null;
}

export default function PartyConsole({
  party,
  characters,
  officers,
  recruitCandidates,
  availableEquipment,
  onRecruit,
  onDismiss,
  onSpendSkillPoint,
  onEquip,
  relationships,
  diplomacyState,
  playerFactionId,
  recruitNotice,
}: PartyConsoleProps) {
  const memberIds = [party.protagonistId, ...party.companionIds];
  const recruitable = (recruitCandidates ?? officers).filter(officer => !memberIds.includes(officer.id));
  const atLimit = party.companionIds.length >= MAX_COMPANIONS;

  const refusalsByOfficerId: Record<string, RecruitRefusal> | undefined =
    relationships || diplomacyState
      ? Object.fromEntries(
          recruitable.map(candidate => [
            candidate.id,
            getRecruitRefusal({
              candidate,
              party,
              officers,
              relationships,
              diplomacyState,
              playerFactionId,
              factions: FACTIONS,
            }),
          ]),
        )
      : undefined;

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
          {recruitNotice && (
            <p
              className="recruit-pool-refusal-banner"
              role="alert"
              data-testid="recruit-refusal-banner"
            >
              {recruitNotice.reason}
            </p>
          )}
          <RecruitPool
            officers={recruitable}
            atLimit={atLimit}
            onRecruit={onRecruit}
            refusalsByOfficerId={refusalsByOfficerId}
          />
        </section>
      </div>
    </section>
  );
}

