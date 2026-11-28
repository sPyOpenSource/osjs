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
