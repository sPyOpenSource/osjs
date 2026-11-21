export type DisasterCategory = 'pandemic' | 'tsunami' | 'earthquake' | 'flood' | 'drought';
export type DisasterSeverity = 'moderate' | 'severe' | 'catastrophic';
export type DisasterWeatherId = 'heavy_rain' | 'dense_fog' | 'snow' | 'windy';

export interface DisasterCityTarget {
  id: string;
  name: string;
  theater: string;
}

export interface DisasterCityStores {
  prosperity: number;
  defense: number;
  grain: number;
  population: number;
}

export interface DisasterChoice {
  id: string;
  label: string;
  summary: string;
  goldCost: number;
  cityRecovery: {
    defenseDelta?: number;
    prosperityDelta?: number;
    grainDelta?: number;
    populationDelta?: number;
  };
  freightMultiplierOverride?: number;
  diplomacyBoost?: number;
}

export interface HistoricalDisasterEvent {
  id: string;
  category: DisasterCategory;
  severity: DisasterSeverity;
  title: string;
  historicalReference: string;
  description: string;
  era: 'ancient' | 'modern' | 'all';
  triggerMonth: number;
  triggerXun: number;
  targetTheaters: string[];
  weatherOverride?: DisasterWeatherId;
  cityEffects: {
    defenseDelta?: number;
    prosperityDelta?: number;
    grainPctDelta?: number;
    populationPctDelta?: number;
  };
  tradeFreightMultiplier: number;
  durationTicks: number;
  choices: DisasterChoice[];
}

export interface OccurredDisasterRecord {
  eventId: string;
  triggeredTick: number;
  affectedCityIds: string[];
  affectedCityNames: string[];
  resolvedChoiceId?: string;
  resolvedChoiceLabel?: string;
  freightMultiplierOverride?: number;
}

export interface DisasterState {
  occurred: OccurredDisasterRecord[];
  logs: string[];
}

export const DISASTER_CATEGORY_META: Record<
  DisasterCategory,
  { label: string; icon: string; badgeClass: string }
> = {
  pandemic: {
    label: '瘟疫',
    icon: '🦠',
    badgeClass: 'is-pandemic',
  },
  tsunami: {
    label: '大海啸',
    icon: '🌊',
    badgeClass: 'is-tsunami',
  },
  earthquake: {
    label: '大地震',
    icon: '🌋',
    badgeClass: 'is-earthquake',
  },
  flood: {
    label: '特大洪涝',
    icon: '⛈️',
    badgeClass: 'is-flood',
  },
  drought: {
    label: '大旱 / 蝗灾',
    icon: '🔥',
    badgeClass: 'is-drought',
  },
};

export const HISTORICAL_DISASTERS: HistoricalDisasterEvent[] = [
  {
    id: 'covid_19_pandemic',
    category: 'pandemic',
    severity: 'catastrophic',
    title: '全球大流行疫情',
    historicalReference: '2019–2023 年 COVID-19 全球公共卫生危机',
    description:
      '高传染性呼吸道疫病沿国际航路迅速蔓延，多国口岸封控、市井萧条、粮草供应链受阻，守军减员与民心承压。',
    era: 'modern',
    triggerMonth: 2,
    triggerXun: 1,
    targetTheaters: ['europe', 'central', 'eastsea', 'mideast'],
    weatherOverride: 'dense_fog',
    cityEffects: {
      prosperityDelta: -14,
      populationPctDelta: -0.06,
      grainPctDelta: -0.08,
    },
    tradeFreightMultiplier: 1.45,
    durationTicks: 6,
    choices: [
      {
        id: 'vaccine_relief',
        label: '紧急采购疫苗与野战医疗救治',
        summary: '耗费 300 金：恢复受疫城池繁荣 +10、人口稳回，商路运费附加回落至 1.15x，各国好感 +6',
        goldCost: 300,
        cityRecovery: { prosperityDelta: 10, populationDelta: 4500 },
        freightMultiplierOverride: 1.15,
        diplomacyBoost: 6,
      },
      {
        id: 'quarantine_lockdown',
        label: '严令封城检疫并配给军粮',
        summary: '耗费 120 金：城防秩序 +6、粮仓补给 +350 石，优先稳定城池守备',
        goldCost: 120,
        cityRecovery: { defenseDelta: 6, grainDelta: 350 },
        freightMultiplierOverride: 1.3,
      },
    ],
  },
  {
    id: 'pacific_indian_tsunami',
    category: 'tsunami',
    severity: 'catastrophic',
    title: '环太平洋 / 印度洋特大海啸',
    historicalReference: '2004 年印度洋海啸 / 2011 年东日本海啸（及古典地中海大海啸）',
    description:
      '海底强震引发百尺海啸巨浪席卷沿海重镇与河口商港，堤防坍塌、仓廪进水、海上丝路与航运严重阻断。',
    era: 'all',
    triggerMonth: 4,
    triggerXun: 2,
    targetTheaters: ['eastsea', 'southeast', 'europe'],
    weatherOverride: 'heavy_rain',
    cityEffects: {
      defenseDelta: -18,
      prosperityDelta: -10,
      grainPctDelta: -0.18,
      populationPctDelta: -0.04,
    },
    tradeFreightMultiplier: 1.4,
    durationTicks: 5,
    choices: [
      {
        id: 'seawall_rebuild',
        label: '急调工兵抢筑海塘并打捞粮秣',
        summary: '耗费 250 金：受灾城池城防 +14、余粮抢救 +500 石，航运运费缓解至 1.1x',
        goldCost: 250,
        cityRecovery: { defenseDelta: 14, grainDelta: 500 },
        freightMultiplierOverride: 1.1,
        diplomacyBoost: 4,
      },
      {
        id: 'maritime_aid',
        label: '派遣跨境赈灾船队稳固民心',
        summary: '耗费 180 金：受灾城池繁荣 +9、人口 +3,000，提升各国友好度 +8',
        goldCost: 180,
        cityRecovery: { prosperityDelta: 9, populationDelta: 3000 },
        freightMultiplierOverride: 1.2,
        diplomacyBoost: 8,
      },
    ],
  },
  {
    id: 'eurasian_mega_earthquake',
    category: 'earthquake',
    severity: 'catastrophic',
    title: '亚欧大陆断裂带强震（里氏 8 级）',
    historicalReference: '2008 汶川地震 / 1923 关东地震 / 公元115年安条克大地震',
    description:
      '地壳剧烈错动，震中诸城城墙倾颓、驿道断裂、市肆损毁严重，急需抢修城防与跨区调运救援物资。',
    era: 'all',
    triggerMonth: 6,
    triggerXun: 1,
    targetTheaters: ['central', 'silkroad', 'mideast'],
    cityEffects: {
      defenseDelta: -22,
      prosperityDelta: -12,
      populationPctDelta: -0.05,
    },
    tradeFreightMultiplier: 1.3,
    durationTicks: 5,
    choices: [
      {
        id: 'fortify_rubble',
        label: '全军动员抢修城垣防线',
        summary: '耗费 220 金：震区城池城防 +18、繁荣 +5，迅速恢复边防',
        goldCost: 220,
        cityRecovery: { defenseDelta: 18, prosperityDelta: 5 },
        freightMultiplierOverride: 1.1,
      },
      {
        id: 'open_granaries',
        label: '开仓放粮赈济震区流民',
        summary: '耗费 150 金：震区余粮补给 +450 石、人口稳回 +3,500，各国声望好感 +5',
        goldCost: 150,
        cityRecovery: { grainDelta: 450, populationDelta: 3500 },
        diplomacyBoost: 5,
      },
    ],
  },
  {
    id: 'jianan_great_plague',
    category: 'pandemic',
    severity: 'severe',
    title: '建安大疫（中原时疫流行）',
    historicalReference: '公元 194–217 年东汉末年建安大疫与伤寒流行',
    description:
      '战乱频仍导致时疫横行州郡，军旅疲敝、城邑人口锐减，医圣张仲景所著《伤寒杂病论》方药成为救世良方。',
    era: 'ancient',
    triggerMonth: 3,
    triggerXun: 2,
    targetTheaters: ['central', 'southeast'],
    weatherOverride: 'dense_fog',
    cityEffects: {
      prosperityDelta: -10,
      populationPctDelta: -0.07,
      grainPctDelta: -0.06,
    },
    tradeFreightMultiplier: 1.3,
    durationTicks: 5,
    choices: [
      {
        id: 'herbal_relief',
        label: '征召名医施药煮汤救治军民',
        summary: '耗费 200 金：受疫城池人口稳回 +4,000、繁荣 +8，减轻商路恐慌',
        goldCost: 200,
        cityRecovery: { prosperityDelta: 8, populationDelta: 4000 },
        freightMultiplierOverride: 1.05,
        diplomacyBoost: 5,
      },
      {
        id: 'strict_camp',
        label: '分营隔离并加发粮饷',
        summary: '耗费 100 金：城防 +5、余粮 +300 石',
        goldCost: 100,
        cityRecovery: { defenseDelta: 5, grainDelta: 300 },
      },
    ],
  },
  {
    id: 'spanish_flu_1918',
    category: 'pandemic',
    severity: 'catastrophic',
    title: '1918 跨洲大流感疫情',
    historicalReference: '1918–1920 年世界大流感疫情（Spanische Grippe）',
    description:
      '随远征部队与铁路港口迅速传播的烈性流感席卷亚欧大陆，各交战国后勤与城市劳动力大幅下滑。',
    era: 'modern',
    triggerMonth: 8,
    triggerXun: 1,
    targetTheaters: ['europe', 'central', 'silkroad'],
    weatherOverride: 'dense_fog',
    cityEffects: {
      prosperityDelta: -11,
      populationPctDelta: -0.06,
    },
    tradeFreightMultiplier: 1.35,
    durationTicks: 5,
    choices: [
      {
        id: 'field_hospitals',
        label: '扩建红十字野战医院与公卫通报',
        summary: '耗费 240 金：人口回稳 +3,500、繁荣 +9，各国好感 +6',
        goldCost: 240,
        cityRecovery: { prosperityDelta: 9, populationDelta: 3500 },
        freightMultiplierOverride: 1.1,
        diplomacyBoost: 6,
      },
      {
        id: 'border_screening',
        label: '陆海口岸检疫限行',
        summary: '耗费 100 金：城防 +4，抑制城内进一步减员',
        goldCost: 100,
        cityRecovery: { defenseDelta: 4, populationDelta: 1500 },
      },
    ],
  },
  {
    id: 'yangtze_monsoon_flood',
    category: 'flood',
    severity: 'severe',
    title: '江河流域特大暴雨洪涝',
    historicalReference: '历代长江黄河大水 / 近代超强台风季洪灾',
    description:
      '连旬暴雨致大江决堤，农田淹没、官道泥泞，前线粮草损耗陡增，各地迫切需要疏浚筑堤。',
    era: 'all',
    triggerMonth: 7,
    triggerXun: 3,
    targetTheaters: ['central', 'southeast'],
    weatherOverride: 'heavy_rain',
    cityEffects: {
      defenseDelta: -10,
      prosperityDelta: -8,
      grainPctDelta: -0.2,
    },
    tradeFreightMultiplier: 1.25,
    durationTicks: 4,
    choices: [
      {
        id: 'dike_dredge',
        label: '徵发民夫筑堤泄洪并补种晚稻',
        summary: '耗费 180 金：受灾城池城防 +8、余粮抢救 +600 石',
        goldCost: 180,
        cityRecovery: { defenseDelta: 8, grainDelta: 600 },
        freightMultiplierOverride: 1.05,
      },
      {
        id: 'emergency_grain_buy',
        label: '紧急调运外埠存粮平抑米价',
        summary: '耗费 130 金：繁荣 +7、余粮 +400 石',
        goldCost: 130,
        cityRecovery: { prosperityDelta: 7, grainDelta: 400 },
      },
    ],
  },
  {
    id: 'steppe_blizzard_drought',
    category: 'drought',
    severity: 'severe',
    title: '极寒暴雪与大旱蝗灾并发',
    historicalReference: '明末小冰期寒潮 / 关中大旱与草原子夜雪灾',
    description:
      '反常气象导致北方极寒封路、内陆大旱蝗虫过境，牛马冻馁、粮仓告急，商旅运费大幅上涨。',
    era: 'all',
    triggerMonth: 10,
    triggerXun: 2,
    targetTheaters: ['steppe', 'silkroad'],
    weatherOverride: 'snow',
    cityEffects: {
      prosperityDelta: -9,
      grainPctDelta: -0.22,
    },
    tradeFreightMultiplier: 1.3,
    durationTicks: 4,
    choices: [
      {
        id: 'winter_supply_convoy',
        label: '组编防寒驼马队抢运冬粮炭薪',
        summary: '耗费 160 金：灾区余粮 +650 石、繁荣 +6',
        goldCost: 160,
        cityRecovery: { grainDelta: 650, prosperityDelta: 6 },
        freightMultiplierOverride: 1.05,
      },
      {
        id: 'tax_exemption',
        label: '免除灾区本季赋税以养民力',
        summary: '耗费 90 金：繁荣 +9、人口 +2,000',
        goldCost: 90,
        cityRecovery: { prosperityDelta: 9, populationDelta: 2000 },
      },
    ],
  },
];

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export function disasterCampaignTick(scenarioYear: number, year: number, month: number, xun: number): number {
  return (year - scenarioYear) * 36 + (month - 1) * 3 + (xun - 1);
}

export function createInitialDisasterState(): DisasterState {
  return { occurred: [], logs: [] };
}

export function getDisastersForScenario(scenarioYear: number): HistoricalDisasterEvent[] {
  const isModern = scenarioYear >= 1900;
  return HISTORICAL_DISASTERS.filter(event => {
    if (event.era === 'all') return true;
    return isModern ? event.era === 'modern' : event.era === 'ancient';
  });
}

export function pickAffectedCities(
  event: HistoricalDisasterEvent,
  cities: DisasterCityTarget[]
): DisasterCityTarget[] {
  if (event.targetTheaters.includes('all')) {
    return cities.slice(0, 6);
  }
  const matched = cities.filter(c => event.targetTheaters.includes(c.theater));
  if (matched.length === 0) return cities.slice(0, 3);
  return matched.slice(0, 5);
}

export function applyDisasterEvent(input: {
  state: DisasterState;
  event: HistoricalDisasterEvent;
  cities: DisasterCityTarget[];
  cityStats: Record<string, DisasterCityStores>;
  tick: number;
  timestampLabel: string;
}): {
  applied: boolean;
  state: DisasterState;
  cityStats: Record<string, DisasterCityStores>;
  record?: OccurredDisasterRecord;
  weatherOverride?: DisasterWeatherId;
} {
  const { state, event, cities, cityStats, tick, timestampLabel } = input;
  if (state.occurred.some(r => r.eventId === event.id)) {
    return { applied: false, state, cityStats };
  }

  const affected = pickAffectedCities(event, cities);
  const nextStats: Record<string, DisasterCityStores> = { ...cityStats };

  for (const city of affected) {
    const cur = nextStats[city.id] ?? { prosperity: 70, defense: 70, grain: 1500, population: 90000 };
    const nextDefense = clamp(cur.defense + (event.cityEffects.defenseDelta ?? 0), 10, 100);
    const nextProsperity = clamp(cur.prosperity + (event.cityEffects.prosperityDelta ?? 0), 10, 100);
    const grainFactor = 1 + (event.cityEffects.grainPctDelta ?? 0);
    const popFactor = 1 + (event.cityEffects.populationPctDelta ?? 0);

    nextStats[city.id] = {
      defense: nextDefense,
      prosperity: nextProsperity,
      grain: Math.max(100, Math.round(cur.grain * grainFactor)),
      population: Math.max(5000, Math.round(cur.population * popFactor)),
    };
  }

  const meta = DISASTER_CATEGORY_META[event.category];
  const cityNames = affected.map(c => c.name);
  const record: OccurredDisasterRecord = {
    eventId: event.id,
    triggeredTick: tick,
    affectedCityIds: affected.map(c => c.id),
    affectedCityNames: cityNames,
  };

  const log = `${meta.icon} [${timestampLabel}] 【${event.title}】爆发！波及 ${cityNames.join('、')}，商路运费暂时升至 ${Math.round(event.tradeFreightMultiplier * 100)}%。`;

  return {
    applied: true,
    state: {
      occurred: [record, ...state.occurred],
      logs: [log, ...state.logs].slice(0, 30),
    },
    cityStats: nextStats,
    record,
    weatherOverride: event.weatherOverride,
  };
}

export function advanceDisasters(input: {
  state: DisasterState;
  scenarioYear: number;
  year: number;
  month: number;
  xun: number;
  cities: DisasterCityTarget[];
  cityStats: Record<string, DisasterCityStores>;
}): {
  state: DisasterState;
  cityStats: Record<string, DisasterCityStores>;
  newlyTriggered: HistoricalDisasterEvent[];
  weatherOverride?: DisasterWeatherId;
} {
  const { state, scenarioYear, year, month, xun, cities, cityStats } = input;
  const tick = disasterCampaignTick(scenarioYear, year, month, xun);
  if (tick < 0) {
    return { state, cityStats, newlyTriggered: [] };
  }

  const eligible = getDisastersForScenario(scenarioYear);
  let nextState = state;
  let nextStats = cityStats;
  const newlyTriggered: HistoricalDisasterEvent[] = [];
  let weatherOverride: DisasterWeatherId | undefined;
  const timestampLabel = `${year}年 ${month}月 ${['上旬', '中旬', '下旬'][clamp(xun - 1, 0, 2)]}`;

  for (const event of eligible) {
    const eventTick = (event.triggerMonth - 1) * 3 + (event.triggerXun - 1);
    if (tick < eventTick) continue;
    if (nextState.occurred.some(r => r.eventId === event.id)) continue;

    const res = applyDisasterEvent({
      state: nextState,
      event,
      cities,
      cityStats: nextStats,
      tick,
      timestampLabel,
    });
    if (res.applied) {
      nextState = res.state;
      nextStats = res.cityStats;
      newlyTriggered.push(event);
      if (res.weatherOverride) weatherOverride = res.weatherOverride;
    }
  }

  return { state: nextState, cityStats: nextStats, newlyTriggered, weatherOverride };
}

export function respondToDisaster(input: {
  state: DisasterState;
  eventId: string;
  choiceId: string;
  cityStats: Record<string, DisasterCityStores>;
  gold: number;
  timestampLabel: string;
}): {
  ok: boolean;
  error?: string;
  state: DisasterState;
  cityStats: Record<string, DisasterCityStores>;
  gold: number;
  diplomacyBoost: number;
} {
  const { state, eventId, choiceId, cityStats, gold, timestampLabel } = input;
  const recordIndex = state.occurred.findIndex(r => r.eventId === eventId);
  if (recordIndex === -1) {
    return { ok: false, error: '该灾害事件尚未发生。', state, cityStats, gold, diplomacyBoost: 0 };
  }
  const record = state.occurred[recordIndex];
  if (record.resolvedChoiceId) {
    return { ok: false, error: '该灾害已执行应急响应方案。', state, cityStats, gold, diplomacyBoost: 0 };
  }

  const event = HISTORICAL_DISASTERS.find(e => e.id === eventId);
  const choice = event?.choices.find(c => c.id === choiceId);
  if (!event || !choice) {
    return { ok: false, error: '未找到有效的赈灾应急方案。', state, cityStats, gold, diplomacyBoost: 0 };
  }
  if (gold < choice.goldCost) {
    return {
      ok: false,
      error: `国库黄金不足，执行【${choice.label}】需 ${choice.goldCost} 金。`,
      state,
      cityStats,
      gold,
      diplomacyBoost: 0,
    };
  }

  const nextStats: Record<string, DisasterCityStores> = { ...cityStats };
  for (const cityId of record.affectedCityIds) {
    const cur = nextStats[cityId];
    if (!cur) continue;
    nextStats[cityId] = {
      defense: clamp(cur.defense + (choice.cityRecovery.defenseDelta ?? 0), 10, 100),
      prosperity: clamp(cur.prosperity + (choice.cityRecovery.prosperityDelta ?? 0), 10, 100),
      grain: Math.max(100, cur.grain + (choice.cityRecovery.grainDelta ?? 0)),
      population: Math.max(5000, cur.population + (choice.cityRecovery.populationDelta ?? 0)),
    };
  }

  const nextOccurred = [...state.occurred];
  nextOccurred[recordIndex] = {
    ...record,
    resolvedChoiceId: choice.id,
    resolvedChoiceLabel: choice.label,
    freightMultiplierOverride: choice.freightMultiplierOverride,
  };

  const log = `🛟 [${timestampLabel}] 【应急处置 · ${event.title}】已执行「${choice.label}」（支出 ${choice.goldCost} 金），${choice.summary}。`;

  return {
    ok: true,
    state: {
      occurred: nextOccurred,
      logs: [log, ...state.logs].slice(0, 30),
    },
    cityStats: nextStats,
    gold: gold - choice.goldCost,
    diplomacyBoost: choice.diplomacyBoost ?? 0,
  };
}

export function getActiveDisasterRecords(
  state: DisasterState,
  currentTick: number
): Array<{ record: OccurredDisasterRecord; event: HistoricalDisasterEvent; remainingTicks: number }> {
  const active: Array<{
    record: OccurredDisasterRecord;
    event: HistoricalDisasterEvent;
    remainingTicks: number;
  }> = [];
  for (const record of state.occurred) {
    const event = HISTORICAL_DISASTERS.find(e => e.id === record.eventId);
    if (!event) continue;
    const elapsed = currentTick - record.triggeredTick;
    if (elapsed >= 0 && elapsed < event.durationTicks) {
      active.push({
        record,
        event,
        remainingTicks: event.durationTicks - elapsed,
      });
    }
  }
  return active;
}

export function getDisasterTradePolicy(
  state: DisasterState | undefined,
  currentTick: number
): { freightMultiplier: number; activeLabels: string[] } {
  if (!state) return { freightMultiplier: 1, activeLabels: [] };
  const active = getActiveDisasterRecords(state, currentTick);
  if (active.length === 0) return { freightMultiplier: 1, activeLabels: [] };

  let freightMultiplier = 1;
  const activeLabels: string[] = [];
  for (const item of active) {
    const mult = item.record.freightMultiplierOverride ?? item.event.tradeFreightMultiplier;
    freightMultiplier *= mult;
    activeLabels.push(`${DISASTER_CATEGORY_META[item.event.category].icon} ${item.event.title}`);
  }
  return {
    freightMultiplier: Math.round(freightMultiplier * 100) / 100,
    activeLabels,
  };
}
