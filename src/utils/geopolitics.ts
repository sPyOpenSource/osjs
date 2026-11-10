export interface WorldEffect {
  stability?: Record<string, number>;
  relations?: [string, string, number][];
}
export interface WorldEvent {
  id: string;
  month: number;
  title: string;
  description: string;
  effect: WorldEffect;
  trade?: { factions?: string[]; pair?: [string, string]; multiplier: number; embargo?: boolean };
  choices: { label: string; summary: string; effect: WorldEffect }[];
}

// Alternate-history game situations, not assertions about real-world events.
export const EVENTS_2026: WorldEvent[] = [
  { id: 'tariffs', month: 1, title: '跨大西洋关税争端', description: '美欧关税谈判陷入僵局，跨大西洋粮运成本上升。',
    effect: { relations: [['america', 'europe', -20]], stability: { america: -3, europe: -5 } },
    trade: { pair: ['america', 'europe'], multiplier: 1.3 },
    choices: [
      { label: '推动关税磋商', summary: '美欧关系 +15；双方稳定 +2', effect: { relations: [['america', 'europe', 15]], stability: { america: 2, europe: 2 } } },
      { label: '支持反制关税', summary: '美欧关系 −15；欧盟稳定 +4', effect: { relations: [['america', 'europe', -15]], stability: { europe: 4 } } },
    ] },
  { id: 'energy', month: 3, title: '欧洲能源供应冲击', description: '能源供应争议扩大，俄欧贸易短暂中断，欧洲国内承压。',
    effect: { relations: [['russia', 'europe', -25]], stability: { europe: -8, germany: -6, russia: -4 } },
    trade: { pair: ['russia', 'europe'], multiplier: 1, embargo: true },
    choices: [
      { label: '斡旋能源协议', summary: '俄欧关系 +20；欧盟稳定 +4', effect: { relations: [['russia', 'europe', 20]], stability: { europe: 4 } } },
      { label: '推动供应多元化', summary: '美欧关系 +10；德意志稳定 +5', effect: { relations: [['america', 'europe', 10]], stability: { germany: 5 } } },
    ] },
  { id: 'ports', month: 5, title: '北海港口网络中断', description: '港口网络遭遇故障，尼德兰商路延误，联合修复成为外交议题。',
    effect: { stability: { netherlands: -10 }, relations: [['netherlands', 'europe', -5]] },
    trade: { factions: ['netherlands'], multiplier: 1.4 },
    choices: [
      { label: '联合修复港口', summary: '尼欧关系 +15；尼德兰稳定 +7', effect: { relations: [['netherlands', 'europe', 15]], stability: { netherlands: 7 } } },
      { label: '优先本国修复', summary: '尼德兰稳定 +10；尼欧关系 −5', effect: { stability: { netherlands: 10 }, relations: [['netherlands', 'europe', -5]] } },
    ] },
  { id: 'food', month: 7, title: '极端天气与粮食压力', description: '多地歉收引发粮价压力，各国讨论联合粮运与出口保护。',
    effect: { stability: { america: -6, france: -8, germany: -5, russia: -5, europe: -6, netherlands: -4 } },
    trade: { factions: ['america', 'france', 'germany', 'russia', 'europe', 'netherlands'], multiplier: 1.25 },
    choices: [
      { label: '组织联合粮运', summary: '法欧关系 +10；法兰西、欧盟稳定 +5', effect: { relations: [['france', 'europe', 10]], stability: { france: 5, europe: 5 } } },
      { label: '保护本国供应', summary: '法兰西稳定 +8；法欧关系 −10', effect: { stability: { france: 8 }, relations: [['france', 'europe', -10]] } },
    ] },
  { id: 'security', month: 9, title: '欧洲安全峰会', description: '欧洲各方就安全与共同市场达成初步合作，区域商路成本下降。',
    effect: { relations: [['france', 'europe', 15], ['germany', 'europe', 15], ['netherlands', 'europe', 15]], stability: { europe: 5, france: 3, germany: 3, netherlands: 3 } },
    trade: { factions: ['france', 'germany', 'europe', 'netherlands'], multiplier: 0.85 },
    choices: [
      { label: '深化共同市场', summary: '法欧关系 +10；欧盟稳定 +4', effect: { relations: [['france', 'europe', 10]], stability: { europe: 4 } } },
      { label: '保留政策自主', summary: '法兰西稳定 +5；法欧关系 −10', effect: { stability: { france: 5 }, relations: [['france', 'europe', -10]] } },
    ] },
  { id: 'summit', month: 11, title: '年末多边贸易会谈', description: '各方尝试缓和争端，美俄外交重启，全球粮运风险有所降低。',
    effect: { relations: [['america', 'russia', 10], ['america', 'europe', 10]], stability: { america: 3, russia: 3, europe: 3 } },
    trade: { multiplier: 0.9 },
    choices: [
      { label: '签署合作公报', summary: '美俄关系 +15；双方稳定 +3', effect: { relations: [['america', 'russia', 15]], stability: { america: 3, russia: 3 } } },
      { label: '坚持双边谈判', summary: '美欧关系 +10；美利坚稳定 +5', effect: { relations: [['america', 'europe', 10]], stability: { america: 5 } } },
    ] },
];

export interface WorldState {
  stability: Record<string, number>;
  relations: Record<string, number>;
  occurred: string[];
  responses: Record<string, number>;
}
export const pairKey = (a: string, b: string) => [a, b].sort().join(':');
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
export const campaignTick = (year: number, month: number, xun: number) => (year - 2026) * 36 + (month - 1) * 3 + xun - 1;
export function createWorldState(factions: { id: string }[]): WorldState {
  return { stability: Object.fromEntries(factions.map(f => [f.id, 70])), relations: {}, occurred: [], responses: {} };
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
  return { multiplier, blocked, relation, stability };
}