import { Officer } from '../types';

export type MigrationCause =
  | 'disaster_exodus'
  | 'refugee_flee'
  | 'prosperity_pull'
  | 'imperial_resettlement';

export interface MigrationCityStats {
  prosperity: number;
  defense: number;
  grain: number;
  population: number;
}

export interface MigrationCityRef {
  id: string;
  name: string;
  x: number;
  y: number;
  region: string;
  theater: string;
}

export interface MigrationWave {
  id: string;
  tick: number;
  cause: MigrationCause;
  fromCityId: string;
  fromCityName: string;
  toCityId: string;
  toCityName: string;
  count: number;
  timestamp: string;
  summary: string;
}

export interface MigrationState {
  lastProcessedTick: number;
  totalMigrated: number;
  waves: MigrationWave[];
  logs: string[];
}

export interface ResettlementQuote {
  ok: boolean;
  error?: string;
  goldCost: number;
  grainCost: number;
  distance: number;
  grainSourceCityId: string;
  prosperityBonus: number;
}

export interface ResettlementExecutionResult {
  ok: boolean;
  error?: string;
  quote: ResettlementQuote;
  state: MigrationState;
  cityStats: Record<string, MigrationCityStats>;
  gold: number;
}

export const MIN_CITY_POPULATION = 5000;
export const MIN_ORIGIN_AFTER_RESETTLEMENT = 10000;
export const RESETTLEMENT_SCALES = [2000, 5000, 10000] as const;

export const MIGRATION_CAUSE_META: Record<
  MigrationCause,
  { label: string; shortLabel: string; color: string; description: string }
> = {
  disaster_exodus: {
    label: '灾荒流徙',
    shortLabel: '灾荒',
    color: '#fb7185',
    description: '疫病水旱等天灾侵袭郡城，百姓背井离乡前往周边安稳之邑。',
  },
  refugee_flee: {
    label: '战乱避难',
    shortLabel: '战乱',
    color: '#fb923c',
    description: '攻城锋镝所及，民众携带家眷逃离兵燹城池，避入近邻安全郡县。',
  },
  prosperity_pull: {
    label: '乐土归附',
    shortLabel: '归附',
    color: '#34d399',
    description: '仓廪充实、仁政清平之城吸引贫瘠或局势动荡之地流民自发投奔。',
  },
  imperial_resettlement: {
    label: '敕令徙民',
    shortLabel: '徙民',
    color: '#38bdf8',
    description: '君主颁布屯田实边或移风易俗之诏令，耗费钱粮有组织迁徙人口。',
  },
};

const BENEVOLENT_TRAIT_RE = /仁德|宽仁|难民庇护|安抚|名望|善政|济民/;

export function createInitialMigrationState(): MigrationState {
  return {
    lastProcessedTick: -1,
    totalMigrated: 0,
    waves: [],
    logs: [],
  };
}

export function computeCityLivability({
  cityId,
  stats,
  isDisasterAffected,
  ownerFactionId,
  officers,
}: {
  cityId: string;
  stats: MigrationCityStats | undefined;
  isDisasterAffected: boolean;
  ownerFactionId: string | undefined;
  officers: Officer[];
}): number {
  void cityId;
  if (!stats) return 0;
  const grainScore = Math.min(100, Math.round((stats.grain / 3200) * 100));
  const base =
    stats.prosperity * 0.5 + grainScore * 0.3 + Math.min(100, stats.defense) * 0.2;
  const disasterPenalty = isDisasterAffected ? 28 : 0;

  let benevolenceBonus = 0;
  if (ownerFactionId && ownerFactionId !== 'ronin') {
    const benevolentCount = officers.filter(
      o =>
        o.factionId === ownerFactionId &&
        o.traits.some(t => BENEVOLENT_TRAIT_RE.test(t)),
    ).length;
    benevolenceBonus = Math.min(12, benevolentCount * 4);
  }

  return Math.max(0, Math.min(100, Math.round(base - disasterPenalty + benevolenceBonus)));
}

export function pickSafestDestination({
  originCity,
  cities,
  cityStats,
  activeDisasterCityIds,
  cityOwnership,
  officers,
}: {
  originCity: MigrationCityRef;
  cities: MigrationCityRef[];
  cityStats: Record<string, MigrationCityStats>;
  activeDisasterCityIds: Set<string>;
  cityOwnership: Record<string, string>;
  officers: Officer[];
}): MigrationCityRef | null {
  let bestCity: MigrationCityRef | null = null;
  let bestScore = -Infinity;

  for (const candidate of cities) {
    if (candidate.id === originCity.id) continue;
    const stats = cityStats[candidate.id];
    if (!stats) continue;

    const livability = computeCityLivability({
      cityId: candidate.id,
      stats,
      isDisasterAffected: activeDisasterCityIds.has(candidate.id),
      ownerFactionId: cityOwnership[candidate.id],
      officers,
    });
    const dist = Math.hypot(candidate.x - originCity.x, candidate.y - originCity.y);
    const sameTheaterBonus = candidate.theater === originCity.theater ? 12 : 0;
    const unaffectedBonus = activeDisasterCityIds.has(candidate.id) ? -35 : 14;
    const score = livability + sameTheaterBonus + unaffectedBonus - dist * 1.15;

    if (score > bestScore) {
      bestScore = score;
      bestCity = candidate;
    }
  }

  return bestCity;
}

function applyPopulationTransfer(
  cityStats: Record<string, MigrationCityStats>,
  fromCityId: string,
  toCityId: string,
  count: number,
  prosperityGain = 1,
): Record<string, MigrationCityStats> {
  const from = cityStats[fromCityId];
  const to = cityStats[toCityId];
  if (!from || !to || count <= 0) return cityStats;

  return {
    ...cityStats,
    [fromCityId]: {
      ...from,
      population: Math.max(MIN_CITY_POPULATION, from.population - count),
    },
    [toCityId]: {
      ...to,
      population: to.population + count,
      prosperity: Math.min(100, to.prosperity + prosperityGain),
    },
  };
}

export function advanceMigrations({
  state,
  cities,
  cityStats,
  cityOwnership,
  activeDisasterCityIds,
  officers,
  currentTick,
  timestampLabel,
}: {
  state: MigrationState;
  cities: MigrationCityRef[];
  cityStats: Record<string, MigrationCityStats>;
  cityOwnership: Record<string, string>;
  activeDisasterCityIds: Set<string>;
  officers: Officer[];
  currentTick: number;
  timestampLabel: string;
}): {
  state: MigrationState;
  cityStats: Record<string, MigrationCityStats>;
  newWaves: MigrationWave[];
} {
  if (currentTick < 0 || currentTick <= state.lastProcessedTick) {
    return { state, cityStats, newWaves: [] };
  }

  let nextStats = { ...cityStats };
  const createdWaves: MigrationWave[] = [];
  const createdLogs: string[] = [];
  let totalAdded = 0;

  // 1. Disaster-driven exodus from affected cities (up to 2 affected cities per tick)
  const affectedOrigins = cities
    .filter(c => activeDisasterCityIds.has(c.id))
    .filter(c => (nextStats[c.id]?.population ?? 0) >= 15000)
    .slice(0, 2);

  for (const origin of affectedOrigins) {
    const dest = pickSafestDestination({
      originCity: origin,
      cities,
      cityStats: nextStats,
      activeDisasterCityIds,
      cityOwnership,
      officers,
    });
    if (!dest) continue;

    const originPop = nextStats[origin.id].population;
    const rawCount = Math.min(5500, Math.max(2000, Math.round((originPop * 0.032) / 100) * 100));
    const count = Math.min(rawCount, Math.max(0, originPop - MIN_CITY_POPULATION));
    if (count < 1000) continue;

    nextStats = applyPopulationTransfer(nextStats, origin.id, dest.id, count, 1);
    const wave: MigrationWave = {
      id: `mig-${currentTick}-dis-${origin.id}-${dest.id}-${createdWaves.length}`,
      tick: currentTick,
      cause: 'disaster_exodus',
      fromCityId: origin.id,
      fromCityName: origin.name,
      toCityId: dest.id,
      toCityName: dest.name,
      count,
      timestamp: timestampLabel,
      summary: `${origin.name}因灾荒动荡，${count.toLocaleString()}名流民携眷南渡北迁至${dest.name}谋生。`,
    };
    createdWaves.push(wave);
    createdLogs.push(`🚶 【灾荒流徙】${timestampLabel} · ${wave.summary}`);
    totalAdded += count;
  }

  // 2. Periodic prosperity-pull migration every 2 ticks when no disaster wave saturated
  if (currentTick > 0 && currentTick % 2 === 0 && cities.length >= 2) {
    const scored = cities
      .filter(c => Boolean(nextStats[c.id]))
      .map(c => ({
        city: c,
        livability: computeCityLivability({
          cityId: c.id,
          stats: nextStats[c.id],
          isDisasterAffected: activeDisasterCityIds.has(c.id),
          ownerFactionId: cityOwnership[c.id],
          officers,
        }),
      }));

    const candidateOrigins = scored
      .filter(s => (nextStats[s.city.id]?.population ?? 0) >= 20000)
      .sort((a, b) => a.livability - b.livability);
    const candidateDests = scored
      .filter(s => !activeDisasterCityIds.has(s.city.id))
      .sort((a, b) => b.livability - a.livability);

    const weakest = candidateOrigins[0];
    const strongest = candidateDests.find(d => weakest && d.city.id !== weakest.city.id);

    if (weakest && strongest && strongest.livability - weakest.livability >= 16) {
      const originPop = nextStats[weakest.city.id].population;
      const count = Math.min(
        3500,
        Math.max(1500, Math.round(((strongest.livability - weakest.livability) * 85) / 100) * 100),
      );
      if (originPop - count >= MIN_CITY_POPULATION) {
        nextStats = applyPopulationTransfer(nextStats, weakest.city.id, strongest.city.id, count, 1);
        const wave: MigrationWave = {
          id: `mig-${currentTick}-pull-${weakest.city.id}-${strongest.city.id}`,
          tick: currentTick,
          cause: 'prosperity_pull',
          fromCityId: weakest.city.id,
          fromCityName: weakest.city.name,
          toCityId: strongest.city.id,
          toCityName: strongest.city.name,
          count,
          timestamp: timestampLabel,
          summary: `${strongest.city.name}仓廪丰足、政通人和（宜居 ${strongest.livability}），吸引${weakest.city.name} ${count.toLocaleString()}名百姓自发归附。`,
        };
        createdWaves.push(wave);
        createdLogs.push(`🌾 【乐土归附】${timestampLabel} · ${wave.summary}`);
        totalAdded += count;
      }
    }
  }

  const nextState: MigrationState = {
    lastProcessedTick: currentTick,
    totalMigrated: state.totalMigrated + totalAdded,
    waves: [...createdWaves, ...state.waves].slice(0, 24),
    logs: [...createdLogs, ...state.logs].slice(0, 30),
  };

  return {
    state: nextState,
    cityStats: nextStats,
    newWaves: createdWaves,
  };
}

export function triggerWarRefugeeWave({
  state,
  fromCityId,
  cities,
  cityStats,
  cityOwnership,
  activeDisasterCityIds,
  officers,
  currentTick,
  timestampLabel,
}: {
  state: MigrationState;
  fromCityId: string;
  cities: MigrationCityRef[];
  cityStats: Record<string, MigrationCityStats>;
  cityOwnership: Record<string, string>;
  activeDisasterCityIds: Set<string>;
  officers: Officer[];
  currentTick: number;
  timestampLabel: string;
}): {
  state: MigrationState;
  cityStats: Record<string, MigrationCityStats>;
  wave: MigrationWave | null;
} {
  const origin = cities.find(c => c.id === fromCityId);
  const originStats = cityStats[fromCityId];
  if (!origin || !originStats || originStats.population < 15000) {
    return { state, cityStats, wave: null };
  }

  const dest = pickSafestDestination({
    originCity: origin,
    cities,
    cityStats,
    activeDisasterCityIds,
    cityOwnership,
    officers,
  });
  if (!dest) {
    return { state, cityStats, wave: null };
  }

  const rawCount = Math.min(6500, Math.max(3000, Math.round((originStats.population * 0.04) / 100) * 100));
  const count = Math.min(rawCount, Math.max(0, originStats.population - MIN_CITY_POPULATION));
  if (count < 1000) {
    return { state, cityStats, wave: null };
  }

  const nextStats = applyPopulationTransfer(cityStats, origin.id, dest.id, count, 0);
  const wave: MigrationWave = {
    id: `mig-${currentTick}-war-${origin.id}-${dest.id}-${state.waves.length}`,
    tick: Math.max(0, currentTick),
    cause: 'refugee_flee',
    fromCityId: origin.id,
    fromCityName: origin.name,
    toCityId: dest.id,
    toCityName: dest.name,
    count,
    timestamp: timestampLabel,
    summary: `${origin.name}遭遇战火围城，${count.toLocaleString()}名居民携老扶幼避往${dest.name}。`,
  };

  return {
    state: {
      ...state,
      totalMigrated: state.totalMigrated + count,
      waves: [wave, ...state.waves].slice(0, 24),
      logs: [`🛡️ 【战乱避难】${timestampLabel} · ${wave.summary}`, ...state.logs].slice(0, 30),
    },
    cityStats: nextStats,
    wave,
  };
}

export function quoteResettlement({
  fromCityId,
  toCityId,
  amount,
  cities,
  cityStats,
  cityOwnership,
  playerFactionId,
  gold,
}: {
  fromCityId: string;
  toCityId: string;
  amount: number;
  cities: MigrationCityRef[];
  cityStats: Record<string, MigrationCityStats>;
  cityOwnership: Record<string, string>;
  playerFactionId?: string;
  gold: number;
}): ResettlementQuote {
  const fromCity = cities.find(c => c.id === fromCityId);
  const toCity = cities.find(c => c.id === toCityId);
  const emptyQuote: ResettlementQuote = {
    ok: false,
    goldCost: 0,
    grainCost: 0,
    distance: 0,
    grainSourceCityId: fromCityId,
    prosperityBonus: 0,
  };

  if (!fromCity || !toCity) {
    return { ...emptyQuote, error: '请选择有效的迁出城池与迁入城池。' };
  }
  if (fromCity.id === toCity.id) {
    return { ...emptyQuote, error: '迁出城池与迁入城池不能为同一座城邑。' };
  }
  if (!Number.isInteger(amount) || amount < 1000 || amount > 15000) {
    return { ...emptyQuote, error: '单次敕令迁徙人口须在 1,000 至 15,000 人之间。' };
  }

  const fromStats = cityStats[fromCity.id];
  const toStats = cityStats[toCity.id];
  if (!fromStats || !toStats) {
    return { ...emptyQuote, error: '所选城池户籍文书尚不完备。' };
  }

  const distance = Math.round(Math.hypot(fromCity.x - toCity.x, fromCity.y - toCity.y) * 10) / 10;
  const goldCost = Math.round((amount / 1000) * (18 + Math.round(distance * 0.65)));
  const grainCost = Math.round(amount / 25);
  const prosperityBonus = amount >= 5000 ? 2 : 1;

  const hasControlledCities =
    Boolean(playerFactionId && playerFactionId !== 'ronin') &&
    cities.some(c => cityOwnership[c.id] === playerFactionId);

  const fromOwner = cityOwnership[fromCity.id];
  const toOwner = cityOwnership[toCity.id];

  // Choose grain source city: prefer controlled endpoint with enough grain
  const ownedEndpoints = [toCity.id, fromCity.id].filter(id => cityOwnership[id] === playerFactionId);
  let grainSourceCityId =
    ownedEndpoints.find(id => (cityStats[id]?.grain ?? 0) >= grainCost) ??
    ownedEndpoints[0] ??
    fromCity.id;

  if (hasControlledCities && fromOwner !== playerFactionId && toOwner !== playerFactionId) {
    return {
      ...emptyQuote,
      goldCost,
      grainCost,
      distance,
      grainSourceCityId,
      prosperityBonus,
      error: '须至少掌握迁出地或迁入地其中一城，方可颁发敕令迁徙政令。',
    };
  }

  if (fromStats.population - amount < MIN_ORIGIN_AFTER_RESETTLEMENT) {
    return {
      ...emptyQuote,
      goldCost,
      grainCost,
      distance,
      grainSourceCityId,
      prosperityBonus,
      error: `${fromCity.name}需保留至少 ${MIN_ORIGIN_AFTER_RESETTLEMENT.toLocaleString()} 名基础民户，当前人口不足以迁出。`,
    };
  }

  if (gold < goldCost) {
    return {
      ...emptyQuote,
      goldCost,
      grainCost,
      distance,
      grainSourceCityId,
      prosperityBonus,
      error: `库银不足：敕令迁徙安家费需 ${goldCost.toLocaleString()} 金。`,
    };
  }

  if (!hasControlledCities) {
    // Fallback check when player has no owned cities (e.g. ronin testing)
    grainSourceCityId = (cityStats[toCity.id]?.grain ?? 0) >= grainCost ? toCity.id : fromCity.id;
  }

  const sourceGrain = cityStats[grainSourceCityId]?.grain ?? 0;
  if (sourceGrain < grainCost) {
    const sourceName = cities.find(c => c.id === grainSourceCityId)?.name ?? grainSourceCityId;
    return {
      ...emptyQuote,
      goldCost,
      grainCost,
      distance,
      grainSourceCityId,
      prosperityBonus,
      error: `${sourceName}仓粮不足：途中口粮需 ${grainCost.toLocaleString()} 石（现存 ${sourceGrain.toLocaleString()} 石）。`,
    };
  }

  return {
    ok: true,
    goldCost,
    grainCost,
    distance,
    grainSourceCityId,
    prosperityBonus,
  };
}

export function executeResettlement({
  state,
  fromCityId,
  toCityId,
  amount,
  cities,
  cityStats,
  cityOwnership,
  playerFactionId,
  gold,
  currentTick,
  timestampLabel,
}: {
  state: MigrationState;
  fromCityId: string;
  toCityId: string;
  amount: number;
  cities: MigrationCityRef[];
  cityStats: Record<string, MigrationCityStats>;
  cityOwnership: Record<string, string>;
  playerFactionId?: string;
  gold: number;
  currentTick: number;
  timestampLabel: string;
}): ResettlementExecutionResult {
  const quote = quoteResettlement({
    fromCityId,
    toCityId,
    amount,
    cities,
    cityStats,
    cityOwnership,
    playerFactionId,
    gold,
  });

  if (!quote.ok) {
    return {
      ok: false,
      error: quote.error,
      quote,
      state,
      cityStats,
      gold,
    };
  }

  const fromCity = cities.find(c => c.id === fromCityId)!;
  const toCity = cities.find(c => c.id === toCityId)!;

  let nextStats = applyPopulationTransfer(
    cityStats,
    fromCityId,
    toCityId,
    amount,
    quote.prosperityBonus,
  );
  const grainSource = nextStats[quote.grainSourceCityId];
  nextStats = {
    ...nextStats,
    [quote.grainSourceCityId]: {
      ...grainSource,
      grain: Math.max(0, grainSource.grain - quote.grainCost),
    },
  };

  const wave: MigrationWave = {
    id: `mig-${currentTick}-decree-${fromCityId}-${toCityId}-${state.waves.length}`,
    tick: Math.max(0, currentTick),
    cause: 'imperial_resettlement',
    fromCityId: fromCity.id,
    fromCityName: fromCity.name,
    toCityId: toCity.id,
    toCityName: toCity.name,
    count: amount,
    timestamp: timestampLabel,
    summary: `颁布徙民实边诏书，由${fromCity.name}迁调 ${amount.toLocaleString()} 名编户充实${toCity.name}，拨银 ${quote.goldCost.toLocaleString()} 金、军粮 ${quote.grainCost.toLocaleString()} 石。`,
  };

  const nextState: MigrationState = {
    ...state,
    totalMigrated: state.totalMigrated + amount,
    waves: [wave, ...state.waves].slice(0, 24),
    logs: [`📜 【敕令徙民】${timestampLabel} · ${wave.summary}`, ...state.logs].slice(0, 30),
  };

  return {
    ok: true,
    quote,
    state: nextState,
    cityStats: nextStats,
    gold: gold - quote.goldCost,
  };
}
