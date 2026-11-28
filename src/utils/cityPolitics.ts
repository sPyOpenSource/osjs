import { Faction, Officer } from '../types';

export interface CityControllerActionState {
  controllerId: string;
  activePlayerFactionId: string;
  bannerFactionId: string;
  isOwnCity: boolean;
  isUnowned: boolean;
  isEnemyCity: boolean;
  isLeader: boolean;
  ownFactionCityCount: number;
  canClaim: boolean;
  canCoup: boolean;
  canDissolve: boolean;
}

const RULER_HONORIFIC_RE = /(大帝|一世|二世|女王|单于)$/;

/**
 * Determine whether an officer is the reigning leader of a non-ronin faction.
 */
export function isOfficerFactionLeader(
  officer: Pick<Officer, 'name' | 'factionId'> | undefined,
  faction: Pick<Faction, 'id' | 'ruler'> | undefined,
): boolean {
  if (!officer || !faction || faction.id === 'ronin') return false;
  if (officer.factionId !== faction.id) return false;
  if (officer.name === faction.ruler) return true;

  const officerBase = officer.name.replace(RULER_HONORIFIC_RE, '');
  const rulerBase = faction.ruler.replace(RULER_HONORIFIC_RE, '');
  return officerBase.length >= 2 && officerBase === rulerBase;
}

export interface CityControllerContext {
  cityId: string;
  cityOwnership: Record<string, string>;
  cities: { id: string }[];
  factions: Faction[];
  officers: Officer[];
  protagonistId?: string;
  playerFactionId?: string;
  playerFactions?: string[];
  dissolvedFactionIds?: Iterable<string>;
}

/**
 * Compute permitted political actions for the selected city's controller control:
 * - Unowned city (`ronin`) -> can claim
 * - City belonging to another faction -> can coup
 * - Player is the faction leader with active territory -> can dissolve faction
 */
export function getCityControllerActionState({
  cityId,
  cityOwnership,
  cities,
  factions,
  officers,
  protagonistId,
  playerFactionId,
  playerFactions,
  dissolvedFactionIds,
}: CityControllerContext): CityControllerActionState {
  const controllerId = cityOwnership[cityId] || 'ronin';
  const protagonist = protagonistId
    ? officers.find(o => o.id === protagonistId)
    : undefined;

  const rawFactionId =
    protagonist?.factionId ??
    playerFactionId ??
    playerFactions?.[0] ??
    'ronin';

  const dissolvedSet = new Set(dissolvedFactionIds ?? []);
  const activePlayerFactionId =
    rawFactionId !== 'ronin' && !dissolvedSet.has(rawFactionId)
      ? rawFactionId
      : 'ronin';

  const bannerFactionId =
    rawFactionId !== 'ronin'
      ? rawFactionId
      : playerFactions?.find(fid => fid !== 'ronin') ??
        factions.find(f => f.id !== 'ronin')?.id ??
        'shu';

  const activeFaction = factions.find(f => f.id === activePlayerFactionId);
  const ownFactionCityCount =
    activePlayerFactionId === 'ronin'
      ? 0
      : cities.filter(c => (cityOwnership[c.id] || 'ronin') === activePlayerFactionId).length;

  const isUnowned = controllerId === 'ronin';
  const isOwnCity = activePlayerFactionId !== 'ronin' && controllerId === activePlayerFactionId;
  const isEnemyCity = !isUnowned && !isOwnCity;
  const isLeader = isOfficerFactionLeader(protagonist, activeFaction);

  return {
    controllerId,
    activePlayerFactionId,
    bannerFactionId,
    isOwnCity,
    isUnowned,
    isEnemyCity,
    isLeader,
    ownFactionCityCount,
    canClaim: isUnowned && bannerFactionId !== 'ronin',
    canCoup: isEnemyCity && bannerFactionId !== 'ronin',
    canDissolve: isLeader && ownFactionCityCount > 0,
  };
}

/**
 * Claim an unowned (`ronin`) city under the player's banner faction.
 */
export function applyClaimCity(
  cityOwnership: Record<string, string>,
  cityId: string,
  bannerFactionId: string,
): { ok: boolean; nextOwnership: Record<string, string> } {
  const current = cityOwnership[cityId] || 'ronin';
  if (current !== 'ronin' || !bannerFactionId || bannerFactionId === 'ronin') {
    return { ok: false, nextOwnership: cityOwnership };
  }
  return {
    ok: true,
    nextOwnership: {
      ...cityOwnership,
      [cityId]: bannerFactionId,
    },
  };
}

/**
 * Stage a coup to overthrow another faction's control of a city and transfer it
 * to the player's banner faction.
 */
export function applyCoupCity(
  cityOwnership: Record<string, string>,
  cityId: string,
  activePlayerFactionId: string,
  bannerFactionId: string,
): { ok: boolean; previousControllerId: string; nextOwnership: Record<string, string> } {
  const current = cityOwnership[cityId] || 'ronin';
  if (
    current === 'ronin' ||
    current === activePlayerFactionId ||
    !bannerFactionId ||
    bannerFactionId === 'ronin' ||
    current === bannerFactionId
  ) {
    return { ok: false, previousControllerId: current, nextOwnership: cityOwnership };
  }
  return {
    ok: true,
    previousControllerId: current,
    nextOwnership: {
      ...cityOwnership,
      [cityId]: bannerFactionId,
    },
  };
}

/**
 * Dissolve a leader's faction, releasing every city it holds back to unowned (`ronin`).
 */
export function applyDissolveFaction(
  cityOwnership: Record<string, string>,
  cities: { id: string }[],
  factionId: string,
): { ok: boolean; releasedCityIds: string[]; nextOwnership: Record<string, string> } {
  if (!factionId || factionId === 'ronin') {
    return { ok: false, releasedCityIds: [], nextOwnership: cityOwnership };
  }
  const releasedCityIds: string[] = [];
  const nextOwnership: Record<string, string> = { ...cityOwnership };
  for (const city of cities) {
    if ((nextOwnership[city.id] || 'ronin') === factionId) {
      nextOwnership[city.id] = 'ronin';
      releasedCityIds.push(city.id);
    }
  }
  if (releasedCityIds.length === 0) {
    return { ok: false, releasedCityIds: [], nextOwnership: cityOwnership };
  }
  return {
    ok: true,
    releasedCityIds,
    nextOwnership,
  };
}

export interface CoupChallenge {
  nonce: number;
  cityId: string;
  cityName: string;
  attackerFactionId: string;
  attackerFactionName: string;
  defenderFactionId: string;
  defenderFactionName: string;
  attackerOfficerId: string;
  defenderOfficerId: string;
}

export interface CoupResolution {
  nonce: number;
  cityId: string;
  cityName: string;
  winnerSide: 'left' | 'right' | 'draw';
  winnerFactionId: string;
  attackerFactionId: string;
  defenderFactionId: string;
  winnerOfficerName: string;
  loserOfficerName: string;
}

/**
 * Pick the challenger (player side) and city defender champion for a coup duel.
 */
export function selectCoupDuelists({
  officers,
  cityName,
  attackerFactionId,
  defenderFactionId,
  protagonistId,
}: {
  officers: Officer[];
  cityName: string;
  attackerFactionId: string;
  defenderFactionId: string;
  protagonistId?: string;
}): { attackerOfficer: Officer | undefined; defenderOfficer: Officer | undefined } {
  const protagonist = protagonistId
    ? officers.find(o => o.id === protagonistId)
    : undefined;

  const attackerPool = officers
    .filter(o => o.factionId === attackerFactionId)
    .sort((a, b) => b.stats.force - a.stats.force);

  const attackerOfficer =
    (protagonist && protagonist.factionId === attackerFactionId ? protagonist : undefined) ??
    attackerPool[0] ??
    protagonist ??
    officers[0];

  const defenderPool = officers
    .filter(o => o.factionId === defenderFactionId && o.id !== attackerOfficer?.id)
    .sort((a, b) => {
      const aStationed =
        a.homeCity === cityName || (a.origin && a.origin.includes(cityName)) ? 1 : 0;
      const bStationed =
        b.homeCity === cityName || (b.origin && b.origin.includes(cityName)) ? 1 : 0;
      if (aStationed !== bStationed) return bStationed - aStationed;
      return b.stats.force - a.stats.force;
    });

  const defenderOfficer =
    defenderPool[0] ??
    officers.find(
      o => o.id !== attackerOfficer?.id && o.factionId !== attackerFactionId,
    ) ??
    officers.find(o => o.id !== attackerOfficer?.id) ??
    attackerOfficer;

  return { attackerOfficer, defenderOfficer };
}

/**
 * Resolve city ownership from the outcome of a coup Duel Arena match:
 * - Left (challenger) wins -> challenger's faction takes the city
 * - Right (defender) wins or draw -> defender keeps the city
 */
export function resolveCoupOutcome(
  challenge: CoupChallenge,
  winnerSide: 'left' | 'right' | 'draw',
  winnerOfficerName: string,
  loserOfficerName: string,
): CoupResolution {
  const winnerFactionId =
    winnerSide === 'left'
      ? challenge.attackerFactionId
      : challenge.defenderFactionId;

  return {
    nonce: challenge.nonce,
    cityId: challenge.cityId,
    cityName: challenge.cityName,
    winnerSide,
    winnerFactionId,
    attackerFactionId: challenge.attackerFactionId,
    defenderFactionId: challenge.defenderFactionId,
    winnerOfficerName,
    loserOfficerName,
  };
}

/**
 * Assign ownership of a contested city after a WarMode battle:
 * whichever faction wins (attacker or defender) holds the city.
 */
export function resolveWarBattleOwnership(
  cityOwnership: Record<string, string>,
  targetCityId: string,
  winner: 'attacker' | 'defender',
  attackerFactionId: string,
  defenderFactionId: string,
): { winnerFactionId: string; nextOwnership: Record<string, string> } {
  const winnerFactionId =
    winner === 'attacker' ? attackerFactionId : defenderFactionId;
  return {
    winnerFactionId,
    nextOwnership: {
      ...cityOwnership,
      [targetCityId]: winnerFactionId,
    },
  };
}

export interface WarSiegeOutcomeInput {
  destructionPct: number;
  townHallDestroyed: boolean;
  remainingTroopCards: number;
  activeTroopsCount: number;
  inFlightAttackerProjectiles: number;
  timeRemaining: number;
  manualSettle?: boolean;
}

export interface WarSiegeOutcomeResult {
  finished: boolean;
  winner: 'attacker' | 'defender' | null;
  reason: 'ongoing' | 'total_destruction' | 'town_hall_captured' | 'repelled' | 'timeout' | 'army_wiped';
}

/**
 * Evaluate win/lose state for a WarMode city siege:
 * - 100% destruction -> immediate attacker victory
 * - When battle ends (manual settle, timer expires, or army wiped with no in-flight attacker projectiles):
 *   - Attacker wins ONLY if the Town Hall (主城大本营) was destroyed (or 100% destroyed)
 *   - Otherwise (even with >= 50% outer building destruction), defender holds the city
 */
export function evaluateWarSiegeOutcome({
  destructionPct,
  townHallDestroyed,
  remainingTroopCards,
  activeTroopsCount,
  inFlightAttackerProjectiles,
  timeRemaining,
  manualSettle = false,
}: WarSiegeOutcomeInput): WarSiegeOutcomeResult {
  if (destructionPct >= 100) {
    return { finished: true, winner: 'attacker', reason: 'total_destruction' };
  }
  if (manualSettle) {
    return {
      finished: true,
      winner: townHallDestroyed ? 'attacker' : 'defender',
      reason: townHallDestroyed ? 'town_hall_captured' : 'repelled',
    };
  }
  if (timeRemaining <= 0) {
    return {
      finished: true,
      winner: townHallDestroyed ? 'attacker' : 'defender',
      reason: townHallDestroyed ? 'town_hall_captured' : 'timeout',
    };
  }
  if (
    remainingTroopCards <= 0 &&
    activeTroopsCount <= 0 &&
    inFlightAttackerProjectiles <= 0
  ) {
    return {
      finished: true,
      winner: townHallDestroyed ? 'attacker' : 'defender',
      reason: townHallDestroyed ? 'town_hall_captured' : 'army_wiped',
    };
  }
  return { finished: false, winner: null, reason: 'ongoing' };
}

export interface AiCounterAttackPlan {
  aggrievedFactionId: string;
  targetFactionId: string;
  originCityId: string;
  targetCityId: string;
  attackingOfficerId: string | null;
  defendingOfficerId: string | null;
}

/**
 * Plan a targeted computer AI counter-attack when a faction is attacked or couped:
 * - Picks the aggrieved AI faction's nearest staging city and strongest commander
 * - Targets the aggressor's contested/exposed city (or closest enemy-held city)
 */
export function planAiCounterAttack({
  cityOwnership,
  cities,
  officers,
  aggrievedFactionId,
  targetFactionId,
  preferredTargetCityId,
}: {
  cityOwnership: Record<string, string>;
  cities: { id: string; x: number; y: number }[];
  officers: Officer[];
  aggrievedFactionId: string;
  targetFactionId: string;
  preferredTargetCityId?: string;
}): AiCounterAttackPlan | null {
  if (
    !aggrievedFactionId ||
    aggrievedFactionId === 'ronin' ||
    !targetFactionId ||
    targetFactionId === 'ronin' ||
    aggrievedFactionId === targetFactionId
  ) {
    return null;
  }

  const stagingCities = cities.filter(
    c => (cityOwnership[c.id] || 'ronin') === aggrievedFactionId,
  );
  const targetCities = cities.filter(
    c => (cityOwnership[c.id] || 'ronin') === targetFactionId,
  );
  if (stagingCities.length === 0 || targetCities.length === 0) {
    return null;
  }

  const preferredTarget = preferredTargetCityId
    ? targetCities.find(c => c.id === preferredTargetCityId)
    : undefined;

  let chosenOrigin = stagingCities[0];
  let chosenTarget = preferredTarget ?? targetCities[0];
  let bestDist = Infinity;

  const candidateTargets = preferredTarget ? [preferredTarget] : targetCities;
  for (const origin of stagingCities) {
    for (const target of candidateTargets) {
      const dist = Math.hypot(origin.x - target.x, origin.y - target.y);
      if (dist < bestDist) {
        bestDist = dist;
        chosenOrigin = origin;
        chosenTarget = target;
      }
    }
  }

  const combatScore = (o: Officer) =>
    o.stats.leadership * 0.4 + o.stats.force * 0.35 + o.stats.intelligence * 0.25;

  const attackingOfficer =
    officers
      .filter(o => o.factionId === aggrievedFactionId)
      .sort((a, b) => combatScore(b) - combatScore(a))[0] ?? null;

  const defendingOfficer =
    officers
      .filter(o => o.factionId === targetFactionId)
      .sort((a, b) => combatScore(b) - combatScore(a))[0] ?? null;

  return {
    aggrievedFactionId,
    targetFactionId,
    originCityId: chosenOrigin.id,
    targetCityId: chosenTarget.id,
    attackingOfficerId: attackingOfficer?.id ?? null,
    defendingOfficerId: defendingOfficer?.id ?? null,
  };
}

/**
 * Determine whether the human player controls at least one side of a battle.
 * WarMode should only open when the player is an active combatant (attacker or defender).
 */
export function isPlayerFactionInBattle({
  attackerFactionId,
  defenderFactionId,
  playerFactionId,
  playerFactions = [],
}: {
  attackerFactionId: string;
  defenderFactionId: string;
  playerFactionId?: string;
  playerFactions?: string[];
}): boolean {
  const playerIds = new Set<string>();
  if (playerFactionId && playerFactionId !== 'ronin') {
    playerIds.add(playerFactionId);
  }
  for (const id of playerFactions) {
    if (id && id !== 'ronin') {
      playerIds.add(id);
    }
  }
  if (playerIds.size === 0) return false;
  return playerIds.has(attackerFactionId) || playerIds.has(defenderFactionId);
}

export type WarPacingId = 'low' | 'normal' | 'high';

export interface WarPacingPreset {
  id: WarPacingId;
  label: string;
  rivalIntervalMs: number;
  autoPlayIntervalMs: number;
  playerSiegeCooldownMs: number;
  counterAttackCooldownMs: number;
  counterAttackGraceMs: number;
  counterAttackOnLossChance: number;
  counterAttackOnRepelChance: number;
}

export const WAR_PACING_PRESETS: Record<WarPacingId, WarPacingPreset> = {
  low: {
    id: 'low',
    label: '舒缓 (低频)',
    rivalIntervalMs: 30000,
    autoPlayIntervalMs: 12000,
    playerSiegeCooldownMs: 60000,
    counterAttackCooldownMs: 45000,
    counterAttackGraceMs: 6500,
    counterAttackOnLossChance: 0.45,
    counterAttackOnRepelChance: 0.2,
  },
  normal: {
    id: 'normal',
    label: '适中 (标准)',
    rivalIntervalMs: 18000,
    autoPlayIntervalMs: 7500,
    playerSiegeCooldownMs: 35000,
    counterAttackCooldownMs: 30000,
    counterAttackGraceMs: 5000,
    counterAttackOnLossChance: 0.65,
    counterAttackOnRepelChance: 0.3,
  },
  high: {
    id: 'high',
    label: '激战 (高频)',
    rivalIntervalMs: 9000,
    autoPlayIntervalMs: 4000,
    playerSiegeCooldownMs: 15000,
    counterAttackCooldownMs: 15000,
    counterAttackGraceMs: 3500,
    counterAttackOnLossChance: 0.85,
    counterAttackOnRepelChance: 0.45,
  },
};

export function shouldTriggerAiCounterAttack({
  now,
  lastCounterAttackAt,
  pacing,
  cityLost,
  roll,
}: {
  now: number;
  lastCounterAttackAt: number;
  pacing: WarPacingId;
  cityLost: boolean;
  roll: number;
}): boolean {
  const cfg = WAR_PACING_PRESETS[pacing];
  if (lastCounterAttackAt > 0 && now - lastCounterAttackAt < cfg.counterAttackCooldownMs) {
    return false;
  }
  const threshold = cityLost ? cfg.counterAttackOnLossChance : cfg.counterAttackOnRepelChance;
  return roll < threshold;
}

