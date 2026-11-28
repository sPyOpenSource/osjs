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
