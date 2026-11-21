import { Officer, OfficerStats } from '../types';

export type SeasonId = 'spring' | 'summer' | 'autumn' | 'winter';
export type SeasonalWeatherId =
  | 'sunny'
  | 'rainy'
  | 'heavy_rain'
  | 'windy'
  | 'foggy'
  | 'dense_fog'
  | 'snow';

export interface SeasonalTacticalModifiers {
  marchSpeedMultiplier: number;
  moraleBonus: number;
  powerModifier: number;
  firePowerMultiplier: number;
  cavalryMultiplier: number;
  archerMultiplier: number;
  siegeBonus: number;
  defenseBonus: number;
  agricultureYieldMultiplier: number;
  commerceYieldMultiplier: number;
}

export interface SeasonDefinition {
  id: SeasonId;
  name: string;
  nameEn: string;
  icon: string;
  months: [number, number, number];
  badgeClass: string;
  climateSummary: string;
  weatherWeights: SeasonalWeatherId[];
  statModifiers: Partial<OfficerStats>;
  tacticalModifiers: SeasonalTacticalModifiers;
  statSummary: string;
  tacticalSummary: string;
}

export const SEASONS: Record<SeasonId, SeasonDefinition> = {
  spring: {
    id: 'spring',
    name: '春季',
    nameEn: 'Spring',
    icon: '🌸',
    months: [3, 4, 5],
    badgeClass: 'is-spring',
    climateSummary: '春风解冻、甘霖渐沛，偶有晨雾细雨交织。',
    weatherWeights: ['sunny', 'rainy', 'foggy', 'windy', 'sunny', 'heavy_rain', 'rainy'],
    statModifiers: {
      politics: 4,
      charisma: 5,
      leadership: 2,
    },
    tacticalModifiers: {
      marchSpeedMultiplier: 1.05,
      moraleBonus: 6,
      powerModifier: 3,
      firePowerMultiplier: 1.0,
      cavalryMultiplier: 1.05,
      archerMultiplier: 1.0,
      siegeBonus: 0,
      defenseBonus: 0,
      agricultureYieldMultiplier: 1.25,
      commerceYieldMultiplier: 1.05,
    },
    statSummary: '政治 +4 · 魅力 +5 · 统帅 +2',
    tacticalSummary: '行军 +5% · 士气 +6 · 屯田 +25% · 骑兵 +5%',
  },
  summer: {
    id: 'summer',
    name: '夏季',
    nameEn: 'Summer',
    icon: '☀️',
    months: [6, 7, 8],
    badgeClass: 'is-summer',
    climateSummary: '盛夏炎炽，骄阳似火或暴雨倾盆交替出现。',
    weatherWeights: ['sunny', 'heavy_rain', 'sunny', 'windy', 'rainy', 'heavy_rain', 'dense_fog'],
    statModifiers: {
      force: 5,
      intelligence: 3,
      leadership: -2,
    },
    tacticalModifiers: {
      marchSpeedMultiplier: 0.95,
      moraleBonus: -2,
      powerModifier: 5,
      firePowerMultiplier: 1.35,
      cavalryMultiplier: 1.0,
      archerMultiplier: 1.1,
      siegeBonus: 4,
      defenseBonus: -2,
      agricultureYieldMultiplier: 1.0,
      commerceYieldMultiplier: 1.1,
    },
    statSummary: '武力 +5 · 智力 +3 · 统帅 -2',
    tacticalSummary: '火计 +35% · 攻城 +4 · 战力 +5 · 行军 -5%',
  },
  autumn: {
    id: 'autumn',
    name: '秋季',
    nameEn: 'Autumn',
    icon: '🍂',
    months: [9, 10, 11],
    badgeClass: 'is-autumn',
    climateSummary: '秋高气爽、骏马肥壮，朔风起处多伴清雾。',
    weatherWeights: ['sunny', 'windy', 'foggy', 'sunny', 'dense_fog', 'windy', 'rainy'],
    statModifiers: {
      leadership: 5,
      intelligence: 4,
      politics: 2,
      charisma: 2,
    },
    tacticalModifiers: {
      marchSpeedMultiplier: 1.12,
      moraleBonus: 8,
      powerModifier: 6,
      firePowerMultiplier: 1.15,
      cavalryMultiplier: 1.2,
      archerMultiplier: 1.1,
      siegeBonus: 6,
      defenseBonus: 4,
      agricultureYieldMultiplier: 1.35,
      commerceYieldMultiplier: 1.15,
    },
    statSummary: '统帅 +5 · 智力 +4 · 政治 +2 · 魅力 +2',
    tacticalSummary: '骑兵 +20% · 行军 +12% · 士气 +8 · 秋收 +35%',
  },
  winter: {
    id: 'winter',
    name: '冬季',
    nameEn: 'Winter',
    icon: '❄️',
    months: [12, 1, 2],
    badgeClass: 'is-winter',
    climateSummary: '岁暮天寒、暴雪封道，重雾凛风骤起。',
    weatherWeights: ['snow', 'dense_fog', 'snow', 'windy', 'foggy', 'snow', 'sunny'],
    statModifiers: {
      force: -4,
      leadership: 4,
      intelligence: 2,
      politics: -3,
    },
    tacticalModifiers: {
      marchSpeedMultiplier: 0.78,
      moraleBonus: -8,
      powerModifier: -6,
      firePowerMultiplier: 0.8,
      cavalryMultiplier: 0.85,
      archerMultiplier: 0.9,
      siegeBonus: -8,
      defenseBonus: 10,
      agricultureYieldMultiplier: 0.7,
      commerceYieldMultiplier: 0.9,
    },
    statSummary: '统帅 +4 · 智力 +2 · 武力 -4 · 政治 -3',
    tacticalSummary: '守城 +10 · 攻城 -8 · 行军 -22% · 农产 -30%',
  },
};

export const SEASON_ORDER: SeasonId[] = ['spring', 'summer', 'autumn', 'winter'];

const clampStat = (value: number, min = 1, max = 100) => Math.max(min, Math.min(max, Math.round(value)));

export function getSeasonFromMonth(month: number): SeasonDefinition {
  const normalized = (((Math.floor(month) - 1) % 12) + 12) % 12 + 1;
  if (normalized >= 3 && normalized <= 5) return SEASONS.spring;
  if (normalized >= 6 && normalized <= 8) return SEASONS.summer;
  if (normalized >= 9 && normalized <= 11) return SEASONS.autumn;
  return SEASONS.winter;
}

export function getSeasonalWeatherForTick(
  seasonId: SeasonId,
  year: number,
  month: number,
  xun: number
): SeasonalWeatherId {
  const pool = SEASONS[seasonId].weatherWeights;
  const tickIndex = Math.abs(Math.floor(year) * 36 + Math.floor(month) * 3 + Math.floor(xun));
  return pool[tickIndex % pool.length];
}

export function getOfficerSeasonalStatDeltas(seasonId: SeasonId): OfficerStats {
  const mods = SEASONS[seasonId].statModifiers;
  return {
    leadership: mods.leadership ?? 0,
    force: mods.force ?? 0,
    intelligence: mods.intelligence ?? 0,
    politics: mods.politics ?? 0,
    charisma: mods.charisma ?? 0,
  };
}

export function applySeasonalOfficerModifiers(
  officer: Officer,
  seasonId: SeasonId
): Officer & { statDeltas: OfficerStats } {
  const deltas = getOfficerSeasonalStatDeltas(seasonId);
  const stats: OfficerStats = {
    leadership: clampStat(officer.stats.leadership + deltas.leadership),
    force: clampStat(officer.stats.force + deltas.force),
    intelligence: clampStat(officer.stats.intelligence + deltas.intelligence),
    politics: clampStat(officer.stats.politics + deltas.politics),
    charisma: clampStat(officer.stats.charisma + deltas.charisma),
  };
  return {
    ...officer,
    stats,
    statDeltas: {
      leadership: stats.leadership - officer.stats.leadership,
      force: stats.force - officer.stats.force,
      intelligence: stats.intelligence - officer.stats.intelligence,
      politics: stats.politics - officer.stats.politics,
      charisma: stats.charisma - officer.stats.charisma,
    },
  };
}

export function getSeasonalTacticalPreview(
  seasonId: SeasonId,
  weatherMovementRatio = 1
) {
  const season = SEASONS[seasonId];
  const tac = season.tacticalModifiers;
  const combinedMovementRatio = Math.max(
    0.25,
    Math.min(1.25, Math.round(weatherMovementRatio * tac.marchSpeedMultiplier * 100) / 100)
  );
  return {
    season,
    ...tac,
    combinedMovementRatio,
    netSiegePowerDelta: tac.powerModifier + tac.siegeBonus,
  };
}
