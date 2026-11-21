import { Faction, Officer, Party, RelationshipRelation } from '../types';
import { DiplomacyState, getDiplomaticStanding, getRelationScore, hasAlliance } from './diplomacy';

/** Maximum number of companions a party may hold (protagonist excluded). */
export const MAX_COMPANIONS = 8;

/** Diplomatic relation score at or below which foreign officers refuse recruitment. */
export const DIPLOMACY_REFUSAL_THRESHOLD = -30;

const WARM_BOND_TYPES = new Set<RelationshipRelation['type']>([
  'Sworn Brother',
  'Spouse',
  'Confidant',
  'Trust',
  'Lord',
]);

export interface RecruitRefusal {
  refused: boolean;
  kind?: 'rival' | 'hostile_faction';
  shortLabel?: string;
  reason?: string;
}

export interface RecruitRefusalContext {
  candidate: Officer;
  party: Party;
  officers: Officer[];
  relationships?: RelationshipRelation[];
  diplomacyState?: DiplomacyState;
  playerFactionId?: string;
  factions?: Faction[];
}

/**
 * Determine whether a candidate officer refuses recruitment because of bad
 * personal relationships (Rival with protagonist or any current companion) or
 * cold/hostile faction diplomacy (score <= -30 without a warm bond to the protagonist).
 */
export function getRecruitRefusal({
  candidate,
  party,
  officers,
  relationships = [],
  diplomacyState,
  playerFactionId,
  factions = [],
}: RecruitRefusalContext): RecruitRefusal {
  const officerById = new Map(officers.map(officer => [officer.id, officer]));
  const memberIds = [party.protagonistId, ...party.companionIds];
  const memberSet = new Set(memberIds);

  // 1. Personal rivalry with protagonist first, then any active companion.
  let rivalMemberId: string | undefined;
  for (const rel of relationships) {
    if (rel.type !== 'Rival') continue;
    let otherId: string | undefined;
    if (rel.fromOfficerId === candidate.id && memberSet.has(rel.toOfficerId)) {
      otherId = rel.toOfficerId;
    } else if (rel.toOfficerId === candidate.id && memberSet.has(rel.fromOfficerId)) {
      otherId = rel.fromOfficerId;
    }
    if (!otherId || otherId === candidate.id) continue;
    if (otherId === party.protagonistId) {
      rivalMemberId = otherId;
      break;
    }
    if (!rivalMemberId) {
      rivalMemberId = otherId;
    }
  }

  if (rivalMemberId) {
    const rivalName = officerById.get(rivalMemberId)?.name ?? rivalMemberId;
    if (rivalMemberId === party.protagonistId) {
      return {
        refused: true,
        kind: 'rival',
        shortLabel: '宿敌拒召',
        reason: `${candidate.name} 与主公 ${rivalName} 系生平宿敌，断然拒召。`,
      };
    }
    return {
      refused: true,
      kind: 'rival',
      shortLabel: '宿怨拒召',
      reason: `${candidate.name} 与帐下 ${rivalName} 素有宿怨，不愿同营共事。`,
    };
  }

  // 2. Warm personal bonds with the protagonist override faction diplomatic hostility.
  const hasWarmBondWithProtagonist = relationships.some(
    rel =>
      WARM_BOND_TYPES.has(rel.type) &&
      ((rel.fromOfficerId === candidate.id && rel.toOfficerId === party.protagonistId) ||
        (rel.toOfficerId === candidate.id && rel.fromOfficerId === party.protagonistId)),
  );
  if (hasWarmBondWithProtagonist) {
    return { refused: false };
  }

  // 3. Cold or hostile faction diplomacy blocks foreign non-allied recruitment.
  const myFactionId = playerFactionId ?? officerById.get(party.protagonistId)?.factionId;
  if (
    diplomacyState &&
    myFactionId &&
    candidate.factionId &&
    myFactionId !== 'ronin' &&
    candidate.factionId !== 'ronin' &&
    candidate.factionId !== myFactionId &&
    !hasAlliance(diplomacyState, myFactionId, candidate.factionId)
  ) {
    const score = getRelationScore(diplomacyState, myFactionId, candidate.factionId);
    if (score <= DIPLOMACY_REFUSAL_THRESHOLD) {
      const standing = getDiplomaticStanding(diplomacyState, myFactionId, candidate.factionId);
      const factionName = factions.find(f => f.id === candidate.factionId)?.name ?? candidate.factionId;
      return {
        refused: true,
        kind: 'hostile_faction',
        shortLabel: `${standing.label}·拒召`,
        reason: `${candidate.name} 效忠 ${factionName}，当前与我方邦交${standing.label}（好感 ${score}），拂袖婉拒入营。`,
      };
    }
  }

  return { refused: false };
}

/**
 * Officers the player may pick as protagonist.
 *
 * Prefers officers belonging to the selected player factions. When that
 * intersection is empty (a scenario can feature a faction with no famous
 * officers), it falls back to the scenario's featured factions, and only then
 * to the full roster.
 */
export function getCandidateOfficers(
  officers: Officer[],
  factions: string[],
  fallbackFactions: string[] = []
): Officer[] {
  const inFactions = officers.filter(officer => factions.includes(officer.factionId));
  if (inFactions.length) return inFactions;

  if (fallbackFactions.length) {
    const inFallback = officers.filter(officer => fallbackFactions.includes(officer.factionId));
    if (inFallback.length) return inFallback;
  }

  return officers;
}

