export interface WorldEffect {
  stability?: Record<string, number>;
  relations?: [string, string, number][];
}
export interface WorldEvent {
  id: string;
  month: number;
  title: string;
  category?: 'trade' | 'tech' | 'energy' | 'logistics' | 'climate' | 'security' | 'finance' | 'diplomacy';
  description: string;
  effect: WorldEffect;
  trade?: { factions?: string[]; pair?: [string, string]; multiplier: number; embargo?: boolean };
  choices: { label: string; summary: string; effect: WorldEffect }[];
}

// Alternate-history game situations for 2026 multi-polar campaign, grounded in 2026 macro themes.
export const EVENTS_2026: WorldEvent[] = [
  {
    id: 'tariffs',
    month: 1,
    category: 'trade',
    title: '跨大西洋关税与产业补贴争端',
    description: '美欧就钢铝、电动车与绿色产业补贴关税谈判陷入僵局，跨大西洋集装箱与粮运成本上升。',
    effect: { relations: [['america', 'europe', -18], ['america', 'france', -10]], stability: { america: -3, europe: -5, germany: -3 } },
    trade: { pair: ['america', 'europe'], multiplier: 1.3 },
    choices: [
      {
        label: '推动跨大西洋关税豁免磋商',
        summary: '美欧关系 +15；美法关系 +8；美、欧稳定 +2',
        effect: { relations: [['america', 'europe', 15], ['america', 'france', 8]], stability: { america: 2, europe: 2 } },
      },
      {
        label: '启动对等反制关税护盘本土制造',
        summary: '美欧关系 −12；欧盟、德意志稳定 +3',
        effect: { relations: [['america', 'europe', -12]], stability: { europe: 3, germany: 2 } },
      },
    ],
  },
  {
    id: 'ai_chips',
    month: 2,
    category: 'tech',
    title: '全球 AI 算力治理与光刻设备管制',
    description: '围绕前沿算力芯片与极紫外光刻机出口许可的谈判升温，尼德兰精密制造与欧陆科技链承压。',
    effect: {
      relations: [['america', 'netherlands', -8], ['netherlands', 'europe', 6]],
      stability: { netherlands: -4, america: 2, europe: -2 },
    },
    trade: { factions: ['america', 'netherlands', 'europe'], multiplier: 1.2 },
    choices: [
      {
        label: '签署多边 AI 安全与半导体供应链框架',
        summary: '美荷关系 +12；尼欧关系 +8；尼德兰、欧盟稳定 +4',
        effect: {
          relations: [['america', 'netherlands', 12], ['netherlands', 'europe', 8]],
          stability: { netherlands: 4, europe: 3 },
        },
      },
      {
        label: '收紧关键设备单边许可配额',
        summary: '美利坚稳定 +4；美欧关系 −8；尼德兰稳定 −3',
        effect: { stability: { america: 4, netherlands: -3 }, relations: [['america', 'europe', -8]] },
      },
    ],
  },
  {
    id: 'energy',
    month: 3,
    category: 'energy',
    title: '欧洲能源供应冲击与黑海航运风险',
    description: '管网维护与黑海航道安全争议扩大，俄欧双边贸易短暂中断，欧陆工业电价再度承压。',
    effect: { relations: [['russia', 'europe', -22]], stability: { europe: -7, germany: -6, russia: -5 } },
    trade: { pair: ['russia', 'europe'], multiplier: 1, embargo: true },
    choices: [
      {
        label: '经由多边机制斡旋能源与黑海运粮走廊',
        summary: '俄欧关系 +18；欧盟、德意志稳定 +4',
        effect: { relations: [['russia', 'europe', 18]], stability: { europe: 4, germany: 3 } },
      },
      {
        label: '加速跨大西洋 LNG 与风光绿电替代',
        summary: '美欧关系 +10；德意志、尼德兰稳定 +5',
        effect: { relations: [['america', 'europe', 10]], stability: { germany: 5, netherlands: 4 } },
      },
    ],
  },
  {
    id: 'ports',
    month: 5,
    category: 'logistics',
    title: '北海港口数字调度网故障',
    description: '鹿特丹与北海沿岸港口群遭遇网络与自动化调度中断，尼德兰转口物流延误。',
    effect: { stability: { netherlands: -9, europe: -3 }, relations: [['netherlands', 'europe', -5]] },
    trade: { factions: ['netherlands'], multiplier: 1.4 },
    choices: [
      {
        label: '联合欧盟网络防御中心协同抢修',
        summary: '尼欧关系 +15；尼德兰稳定 +7',
        effect: { relations: [['netherlands', 'europe', 15]], stability: { netherlands: 7, europe: 2 } },
      },
      {
        label: '优先启用本国人工港口应急预案',
        summary: '尼德兰稳定 +9；尼欧关系 −4',
        effect: { stability: { netherlands: 9 }, relations: [['netherlands', 'europe', -4]] },
      },
    ],
  },
  {
    id: 'food',
    month: 7,
    category: 'climate',
    title: '北半球极端热浪与粮食出口压力',
    description: '盛夏持续高温干旱引发主产区减产预期，各国围绕粮食储备与出口配额展开磋商。',
    effect: { stability: { america: -5, france: -7, germany: -5, russia: -5, europe: -6, netherlands: -4 } },
    trade: { factions: ['america', 'france', 'germany', 'russia', 'europe', 'netherlands'], multiplier: 1.25 },
    choices: [
      {
        label: '组织联合国气候韧性与联合粮运计划',
        summary: '法欧关系 +10；美俄关系 +6；法兰西、欧盟稳定 +5',
        effect: { relations: [['france', 'europe', 10], ['america', 'russia', 6]], stability: { france: 5, europe: 5 } },
      },
      {
        label: '优先锁定战略粮仓与出口关税配额',
        summary: '法兰西、德意志稳定 +6；法欧关系 −8',
        effect: { stability: { france: 6, germany: 4 }, relations: [['france', 'europe', -8]] },
      },
    ],
  },
  {
    id: 'security',
    month: 9,
    category: 'security',
    title: '欧洲防务自主与共同市场峰会',
    description: '法、德、荷与欧盟理事会就联合防务采购与单一市场深化达成框架协议，区域互联成本下降。',
    effect: {
      relations: [['france', 'europe', 14], ['germany', 'europe', 14], ['netherlands', 'europe', 12], ['france', 'germany', 10]],
      stability: { europe: 5, france: 4, germany: 4, netherlands: 3 },
    },
    trade: { factions: ['france', 'germany', 'europe', 'netherlands'], multiplier: 0.85 },
    choices: [
      {
        label: '设立欧洲联合防务与绿色基建债券',
        summary: '法欧关系 +10；欧盟、法兰西稳定 +4',
        effect: { relations: [['france', 'europe', 10]], stability: { europe: 4, france: 4 } },
      },
      {
        label: '保持各国财政与防务采购自主权',
        summary: '德意志、尼德兰稳定 +4；法欧关系 −6',
        effect: { stability: { germany: 4, netherlands: 4 }, relations: [['france', 'europe', -6]] },
      },
    ],
  },
  {
    id: 'debt_crisis',
    month: 10,
    category: 'finance',
    title: '高利率周期与主权再融资波动',
    description: '主要经济体国债到期再融资规模攀升，外汇与大宗商品融资利率出现阶段性波动。',
    effect: { stability: { america: -4, france: -5, europe: -4, russia: -4 } },
    trade: { multiplier: 1.15 },
    choices: [
      {
        label: '协调央行流动性互换与财政整顿路径',
        summary: '美、法、欧稳定 +5；美欧关系 +6',
        effect: { stability: { america: 5, france: 5, europe: 4 }, relations: [['america', 'europe', 6]] },
      },
      {
        label: '坚持紧缩货币优先压制通胀',
        summary: '德意志稳定 +5；法兰西稳定 −3',
        effect: { stability: { germany: 5, france: -3 } },
      },
    ],
  },
  {
    id: 'summit',
    month: 11,
    category: 'diplomacy',
    title: '年末多边和平峰会与贸易走廊重启',
    description: '联合国及多方大国在年末重开多边对话，探讨缓和制裁摩擦、恢复粮食与海运安全走廊。',
    effect: { relations: [['america', 'russia', 10], ['america', 'europe', 10]], stability: { america: 3, russia: 3, europe: 3 } },
    trade: { multiplier: 0.9 },
    choices: [
      {
        label: '签署多边降级与航运安全公报',
        summary: '美俄关系 +15；俄欧关系 +10；美、俄、欧稳定 +3',
        effect: { relations: [['america', 'russia', 15], ['russia', 'europe', 10]], stability: { america: 3, russia: 3, europe: 2 } },
      },
      {
        label: '巩固核心盟友双边互惠协议',
        summary: '美欧关系 +12；美利坚稳定 +5',
        effect: { relations: [['america', 'europe', 12]], stability: { america: 5 } },
      },
    ],
  },
];

export interface WorldState {
  stability: Record<string, number>;
  relations: Record<string, number>;
  occurred: string[];
  responses: Record<string, number>;
}

const BASELINE_STABILITY_2026: Record<string, number> = {
  america: 68,
  europe: 64,
  france: 61,
  germany: 63,
  netherlands: 73,
  russia: 59,
};

const BASELINE_RELATIONS_2026: [string, string, number][] = [
  ['france', 'germany', 45],
  ['germany', 'europe', 40],
  ['france', 'europe', 35],
  ['netherlands', 'europe', 35],
  ['america', 'europe', 20],
  ['america', 'france', 15],
  ['america', 'netherlands', 25],
  ['russia', 'netherlands', -30],
  ['russia', 'europe', -45],
  ['america', 'russia', -40],
];

export const KEY_AXES_2026: Array<{ a: string; b: string; label: string }> = [
  { a: 'america', b: 'europe', label: '美 ↔ 欧（跨大西洋关系）' },
  { a: 'france', b: 'germany', label: '法 ↔ 德（欧陆核心轴心）' },
  { a: 'netherlands', b: 'europe', label: '荷 ↔ 欧（北海港口与光刻链）' },
  { a: 'russia', b: 'europe', label: '俄 ↔ 欧（能源与安全走廊）' },
  { a: 'america', b: 'russia', label: '美 ↔ 俄（大国战略博弈）' },
];

export const pairKey = (a: string, b: string) => [a, b].sort().join(':');
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
export const campaignTick = (year: number, month: number, xun: number) => (year - 2026) * 36 + (month - 1) * 3 + xun - 1;

export function createWorldState(factions: { id: string }[]): WorldState {
  const stability = Object.fromEntries(
    factions.map(f => [f.id, BASELINE_STABILITY_2026[f.id] ?? 70])
  );
  const validIds = new Set(factions.map(f => f.id));
  const relations: Record<string, number> = {};
  for (const [a, b, score] of BASELINE_RELATIONS_2026) {
    if (validIds.has(a) && validIds.has(b)) {
      relations[pairKey(a, b)] = clamp(score, -100, 100);
    }
  }
  return { stability, relations, occurred: [], responses: {} };
}

function applyEffect(state: WorldState, effect: WorldEffect): WorldState {
  const stability = { ...state.stability }, relations = { ...state.relations };
  for (const [id, delta] of Object.entries(effect.stability || {})) {
    if (id in stability) stability[id] = clamp(stability[id] + delta, 0, 100);
  }
  for (const [a, b, delta] of effect.relations || []) {
    const key = pairKey(a, b);
    relations[key] = clamp((relations[key] || 0) + delta, -100, 100);
  }
  return { ...state, stability, relations };
}

export function advanceWorld(state: WorldState, scenarioYear: number, tick: number): WorldState {
  if (scenarioYear !== 2026 || tick < 0) return state;
  let next = state;
  for (const event of EVENTS_2026) {
    if (tick < (event.month - 1) * 3 || next.occurred.includes(event.id)) continue;
    next = applyEffect(next, event.effect);
    next = { ...next, occurred: [...next.occurred, event.id] };
  }
  return next;
}

export function respondToEvent(state: WorldState, id: string, choice: number): WorldState {
  const event = EVENTS_2026.find(e => e.id === id);
  const response = event?.choices[choice];
  if (!response || !state.occurred.includes(id) || id in state.responses) return state;
  return { ...applyEffect(state, response.effect), responses: { ...state.responses, [id]: choice } };
}

export function activeEvents(state: WorldState, tick: number) {
  return EVENTS_2026.filter(e => state.occurred.includes(e.id) && tick >= (e.month - 1) * 3 && tick < (e.month - 1) * 3 + 6);
}

export function worldTradePolicy(state: WorldState, a: string, b: string, tick: number) {
  const relation = state.relations[pairKey(a, b)] || 0;
  const stability = Math.min(state.stability[a] ?? 70, state.stability[b] ?? 70);
  let multiplier = (1 - relation / 200) * (1 + Math.max(0, 70 - stability) / 100);
  let blocked = false;
  for (const event of activeEvents(state, tick)) {
    const trade = event.trade;
    if (!trade || (trade.pair && pairKey(...trade.pair) !== pairKey(a, b)) || (trade.factions && !trade.factions.includes(a) && !trade.factions.includes(b))) continue;
    multiplier *= trade.multiplier;
    blocked ||= trade.embargo === true;
  }
  return { multiplier: Math.round(multiplier * 100) / 100, blocked, relation, stability };
}