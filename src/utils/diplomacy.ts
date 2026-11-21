import { Faction, Officer } from '../types';
import { pairKey } from './geopolitics';

export type DiplomaticMissionType = 'gift' | 'trade_pact' | 'alliance';
export type DiplomaticStanding = 'hostile' | 'cold' | 'neutral' | 'friendly' | 'allied';

export interface DiplomaticLogEntry {
  id: string;
  timestampLabel: string;
  playerFaction: string;
  targetFaction: string;
  envoyName: string;
  missionType: DiplomaticMissionType;
  accepted: boolean;
  previousScore: number;
  newScore: number;
  delta: number;
  cost: number;
  message: string;
}

export interface DiplomacyState {
  relations: Record<string, number>;
  tradePacts: string[];
  alliances: string[];
  logs: DiplomaticLogEntry[];
}

export interface MissionQuote {
  valid: boolean;
  error?: string;
  cost: number;
  successChance: number; // 0-100
  projectedGainMin: number;
  projectedGainMax: number;
  projectedRejectDelta: number;
  envoyBonus: number;
}

export interface MissionExecutionResult {
  ok: boolean;
  error?: string;
  state: DiplomacyState;
  gold: number;
  entry?: DiplomaticLogEntry;
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const INITIAL_RELATION_PAIRS: [string, string, number][] = [
  ['shu', 'wu', 35],
  ['shu', 'wei', -55],
  ['wei', 'wu', -40],
  ['wei', 'lubu', -65],
  ['shu', 'lubu', -25],
  ['wei', 'yuanshao', -45],
  ['rome', 'carthage', -60],
  ['rome', 'macedon', 15],
  ['macedon', 'persia', -45],
  ['persia', 'kushan', 20],
  ['tang', 'steppe', -20],
  ['qing', 'russia', 15],
  ['france', 'europe', 35],
  ['germany', 'europe', 40],
  ['netherlands', 'europe', 35],
  ['france', 'germany', 45],
  ['america', 'europe', 20],
  ['russia', 'europe', -35],
  ['america', 'russia', -40],
];

export function createInitialDiplomacyState(factions: Faction[]): DiplomacyState {
  const validIds = new Set(factions.map(f => f.id));
  const relations: Record<string, number> = {};
  for (const [a, b, score] of INITIAL_RELATION_PAIRS) {
    if (validIds.has(a) && validIds.has(b)) {
      relations[pairKey(a, b)] = clamp(score, -100, 100);
    }
  }
  return {
    relations,
    tradePacts: validIds.has('france') && validIds.has('germany') ? [pairKey('france', 'germany')] : [],
    alliances: validIds.has('shu') && validIds.has('wu') ? [pairKey('shu', 'wu')] : [],
    logs: [],
  };
}

export function getRelationScore(state: DiplomacyState, factionA: string, factionB: string): number {
  if (!factionA || !factionB || factionA === factionB) return 0;
  return state.relations[pairKey(factionA, factionB)] ?? 0;
}

export function hasTradePact(state: DiplomacyState, factionA: string, factionB: string): boolean {
  if (!factionA || !factionB || factionA === factionB) return false;
  return state.tradePacts.includes(pairKey(factionA, factionB));
}

export function hasAlliance(state: DiplomacyState, factionA: string, factionB: string): boolean {
  if (!factionA || !factionB || factionA === factionB) return false;
  return state.alliances.includes(pairKey(factionA, factionB));
}

export function getDiplomaticStanding(
  state: DiplomacyState,
  factionA: string,
  factionB: string
): { standing: DiplomaticStanding; label: string; badgeClass: string } {
  if (hasAlliance(state, factionA, factionB)) {
    return {
      standing: 'allied',
      label: '军事同盟',
      badgeClass: 'text-amber-300 border-amber-400/50 bg-amber-950/50',
    };
  }
  const score = getRelationScore(state, factionA, factionB);
  if (score >= 30) {
    return {
      standing: 'friendly',
      label: '友善邦交',
      badgeClass: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/40',
    };
  }
  if (score > -30) {
    return {
      standing: 'neutral',
      label: '中立观望',
      badgeClass: 'text-slate-300 border-slate-700 bg-slate-900/60',
    };
  }
  if (score > -70) {
    return {
      standing: 'cold',
      label: '猜忌冷淡',
      badgeClass: 'text-orange-300 border-orange-500/40 bg-orange-950/40',
    };
  }
  return {
    standing: 'hostile',
    label: '势同水火',
    badgeClass: 'text-rose-300 border-rose-500/40 bg-rose-950/40',
  };
}

function getEnvoyTraitBonus(envoy: Officer | null | undefined): number {
  if (!envoy) return 0;
  let bonus = 0;
  const joinedTraits = envoy.traits.join(' ');
  if (joinedTraits.includes('人道斡旋') || joinedTraits.includes('联合组阁')) bonus += 12;
  if (joinedTraits.includes('仁德') || joinedTraits.includes('名望') || joinedTraits.includes('万国通使')) bonus += 8;
  if (joinedTraits.includes('辩才') || joinedTraits.includes('外交')) bonus += 8;
  return bonus;
}

export function quoteEnvoyMission(input: {
  state: DiplomacyState;
  playerFaction: string;
  targetFaction: string;
  missionType: DiplomaticMissionType;
  envoy?: Officer | null;
  gold: number;
  giftAmount?: number;
}): MissionQuote {
  const { state, playerFaction, targetFaction, missionType, envoy, gold, giftAmount = 300 } = input;

  if (!playerFaction || !targetFaction || playerFaction === targetFaction) {
    return {
      valid: false,
      error: '请选择其他国家或势力作为出使对象。',
      cost: 0,
      successChance: 0,
      projectedGainMin: 0,
      projectedGainMax: 0,
      projectedRejectDelta: 0,
      envoyBonus: 0,
    };
  }
  if (playerFaction === 'ronin' || targetFaction === 'ronin') {
    return {
      valid: false,
      error: '在野势力暂无国书礼制，无法派遣正式使节。',
      cost: 0,
      successChance: 0,
      projectedGainMin: 0,
      projectedGainMax: 0,
      projectedRejectDelta: 0,
      envoyBonus: 0,
    };
  }

  const politics = envoy?.stats.politics ?? 60;
  const charisma = envoy?.stats.charisma ?? 60;
  const traitBonus = getEnvoyTraitBonus(envoy);
  const envoyBonus = Math.round((politics - 60) * 0.4 + (charisma - 60) * 0.35 + traitBonus);
  const currentScore = getRelationScore(state, playerFaction, targetFaction);

  if (missionType === 'gift') {
    if (!Number.isSafeInteger(giftAmount) || giftAmount < 100 || giftAmount > 5000) {
      return {
        valid: false,
        error: '赠礼金额须为 100–5,000 金的整数。',
        cost: 0,
        successChance: 0,
        projectedGainMin: 0,
        projectedGainMax: 0,
        projectedRejectDelta: 0,
        envoyBonus,
      };
    }
    if (gold < giftAmount) {
      return {
        valid: false,
        error: `国库黄金不足，赠礼需 ${giftAmount.toLocaleString()} 金。`,
        cost: giftAmount,
        successChance: 100,
        projectedGainMin: 0,
        projectedGainMax: 0,
        projectedRejectDelta: 0,
        envoyBonus,
      };
    }
    const baseGain = Math.round(giftAmount / 45) + Math.max(0, Math.round(envoyBonus / 3));
    return {
      valid: true,
      cost: giftAmount,
      successChance: 100,
      projectedGainMin: clamp(baseGain, 8, 35),
      projectedGainMax: clamp(baseGain + 6, 10, 40),
      projectedRejectDelta: 0,
      envoyBonus,
    };
  }

  if (missionType === 'trade_pact') {
    const cost = 150;
    if (hasTradePact(state, playerFaction, targetFaction)) {
      return {
        valid: false,
        error: '双方已缔结《通商条约》，无需重复遣使。',
        cost,
        successChance: 0,
        projectedGainMin: 0,
        projectedGainMax: 0,
        projectedRejectDelta: 0,
        envoyBonus,
      };
    }
    if (gold < cost) {
      return {
        valid: false,
        error: `国库黄金不足，遣使缔约需 ${cost} 金礼费。`,
        cost,
        successChance: 0,
        projectedGainMin: 0,
        projectedGainMax: 0,
        projectedRejectDelta: 0,
        envoyBonus,
      };
    }
    const rawChance = 54 + currentScore * 0.48 + envoyBonus + (hasAlliance(state, playerFaction, targetFaction) ? 20 : 0);
    const successChance = clamp(Math.round(rawChance), 15, 98);
    return {
      valid: true,
      cost,
      successChance,
      projectedGainMin: 12,
      projectedGainMax: 18,
      projectedRejectDelta: -5,
      envoyBonus,
    };
  }

  // missionType === 'alliance'
  const cost = 300;
  if (hasAlliance(state, playerFaction, targetFaction)) {
    return {
      valid: false,
      error: '双方早已盟誓歃血，同盟存续中。',
      cost,
      successChance: 0,
      projectedGainMin: 0,
      projectedGainMax: 0,
      projectedRejectDelta: 0,
      envoyBonus,
    };
  }
  if (gold < cost) {
    return {
      valid: false,
      error: `国库黄金不足，会盟使团需 ${cost} 金仪仗礼费。`,
      cost,
      successChance: 0,
      projectedGainMin: 0,
      projectedGainMax: 0,
      projectedRejectDelta: 0,
      envoyBonus,
    };
  }
  const rawChance =
    32 +
    currentScore * 0.62 +
    envoyBonus * 1.1 +
    (hasTradePact(state, playerFaction, targetFaction) ? 16 : 0);
  const successChance = clamp(Math.round(rawChance), 10, 96);
  return {
    valid: true,
    cost,
    successChance,
    projectedGainMin: 20,
    projectedGainMax: 28,
    projectedRejectDelta: -6,
    envoyBonus,
  };
}

export function executeEnvoyMission(input: {
  state: DiplomacyState;
  factions: Faction[];
  playerFaction: string;
  targetFaction: string;
  missionType: DiplomaticMissionType;
  envoy?: Officer | null;
  gold: number;
  giftAmount?: number;
  timestampLabel?: string;
  roll?: number; // 0..1 optional deterministic roll for testing
}): MissionExecutionResult {
  const {
    state,
    factions,
    playerFaction,
    targetFaction,
    missionType,
    envoy,
    gold,
    giftAmount = 300,
    timestampLabel = '当前回合',
    roll,
  } = input;

  const quote = quoteEnvoyMission({ state, playerFaction, targetFaction, missionType, envoy, gold, giftAmount });
  if (!quote.valid) {
    return { ok: false, error: quote.error, state, gold };
  }

  const pFaction = factions.find(f => f.id === playerFaction);
  const tFaction = factions.find(f => f.id === targetFaction);
  const pName = pFaction?.name || playerFaction;
  const tName = tFaction?.name || targetFaction;
  const tRuler = tFaction?.ruler || '主政者';
  const envoyName = envoy?.name || `${pName}礼宾使`;

  const key = pairKey(playerFaction, targetFaction);
  const previousScore = getRelationScore(state, playerFaction, targetFaction);
  const r = roll !== undefined ? clamp(roll, 0, 0.999999) : Math.random();

  const accepted = missionType === 'gift' ? true : r * 100 < quote.successChance;

  let delta: number;
  if (accepted) {
    const spread = quote.projectedGainMax - quote.projectedGainMin;
    delta = quote.projectedGainMin + Math.round(r * spread);
  } else {
    delta = quote.projectedRejectDelta;
  }

  const newScore = clamp(previousScore + delta, -100, 100);
  const actualDelta = newScore - previousScore;

  const nextRelations = { ...state.relations, [key]: newScore };
  const nextTradePacts =
    accepted && missionType === 'trade_pact' && !state.tradePacts.includes(key)
      ? [...state.tradePacts, key]
      : state.tradePacts;
  const nextAlliances =
    accepted && missionType === 'alliance' && !state.alliances.includes(key)
      ? [...state.alliances, key]
      : state.alliances;

  const signedDelta = actualDelta >= 0 ? `+${actualDelta}` : `${actualDelta}`;
  let message: string;
  if (missionType === 'gift') {
    message = `🎁 【赠礼修好】${envoyName} 奉 ${pName} 国书携 ${quote.cost.toLocaleString()} 金厚礼出使 ${tName}。${tRuler} 欣然纳礼，双方邦交好感 ${signedDelta}（${previousScore} → ${newScore}）。`;
  } else if (missionType === 'trade_pact') {
    message = accepted
      ? `📜 【通商条约缔结】${envoyName} 舌灿莲花与 ${tName} ${tRuler} 签定互市商约！商路运费减免 25%，邦交好感 ${signedDelta}（${previousScore} → ${newScore}）。`
      : `🚫 【通商磋商搁浅】${envoyName} 出使 ${tName} 提议通商，${tRuler} 以关税与边防之虑婉拒国书，双方邦交 ${signedDelta}（${previousScore} → ${newScore}）。`;
  } else {
    message = accepted
      ? `🤝 【歃血同盟】${envoyName} 折冲樽俎，与 ${tName} ${tRuler} 正式缔结攻守同盟！双方邦交 ${signedDelta}（${previousScore} → ${newScore}）。`
      : `❄️ 【会盟未成】${envoyName} 赴 ${tName} 请盟，${tRuler} 尚存猜忌未予应允，双方邦交 ${signedDelta}（${previousScore} → ${newScore}）。`;
  }

  const entry: DiplomaticLogEntry = {
    id: `dip-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    timestampLabel,
    playerFaction,
    targetFaction,
    envoyName,
    missionType,
    accepted,
    previousScore,
    newScore,
    delta: actualDelta,
    cost: quote.cost,
    message,
  };

  return {
    ok: true,
    state: {
      relations: nextRelations,
      tradePacts: nextTradePacts,
      alliances: nextAlliances,
      logs: [entry, ...state.logs].slice(0, 40),
    },
    gold: gold - quote.cost,
    entry,
  };
}

export function cancelDiplomaticPact(input: {
  state: DiplomacyState;
  factions: Faction[];
  playerFaction: string;
  targetFaction: string;
  pactType: 'trade_pact' | 'alliance';
  timestampLabel?: string;
}): DiplomacyState {
  const { state, factions, playerFaction, targetFaction, pactType, timestampLabel = '当前回合' } = input;
  const key = pairKey(playerFaction, targetFaction);
  const pName = factions.find(f => f.id === playerFaction)?.name || playerFaction;
  const tName = factions.find(f => f.id === targetFaction)?.name || targetFaction;
  const previousScore = getRelationScore(state, playerFaction, targetFaction);
  const penalty = pactType === 'alliance' ? -25 : -12;
  const newScore = clamp(previousScore + penalty, -100, 100);
  const actualDelta = newScore - previousScore;

  const nextTradePacts = pactType === 'trade_pact' ? state.tradePacts.filter(k => k !== key) : state.tradePacts;
  const nextAlliances = pactType === 'alliance' ? state.alliances.filter(k => k !== key) : state.alliances;

  const entry: DiplomaticLogEntry = {
    id: `dip-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    timestampLabel,
    playerFaction,
    targetFaction,
    envoyName: pName,
    missionType: pactType,
    accepted: true,
    previousScore,
    newScore,
    delta: actualDelta,
    cost: 0,
    message: `💔 【废止盟约】${pName} 宣布废止与 ${tName} 的${pactType === 'alliance' ? '军事同盟' : '通商条约'}，邦交好感 ${actualDelta}（${previousScore} → ${newScore}）。`,
  };

  return {
    relations: { ...state.relations, [key]: newScore },
    tradePacts: nextTradePacts,
    alliances: nextAlliances,
    logs: [entry, ...state.logs].slice(0, 40),
  };
}

export interface FactionRelationDatum {
  factionId: string;
  name: string;
  ruler: string;
  color: string;
  score: number;
  standing: DiplomaticStanding;
  standingLabel: string;
  hasTradePact: boolean;
  hasAlliance: boolean;
  potentialAlly: boolean;
}

export function buildRelationChartData(
  state: DiplomacyState,
  factions: Faction[],
  playerFaction: string
): FactionRelationDatum[] {
  return factions
    .filter(f => f.id !== 'ronin' && f.id !== playerFaction)
    .map(f => {
      const score = getRelationScore(state, playerFaction, f.id);
      const { standing, label } = getDiplomaticStanding(state, playerFaction, f.id);
      const pact = hasTradePact(state, playerFaction, f.id);
      const allied = hasAlliance(state, playerFaction, f.id);
      return {
        factionId: f.id,
        name: f.name,
        ruler: f.ruler,
        color: f.color,
        score,
        standing,
        standingLabel: label,
        hasTradePact: pact,
        hasAlliance: allied,
        potentialAlly: allied || score >= 30 || (score >= 10 && pact),
      };
    })
    .sort((a, b) => {
      if (a.hasAlliance !== b.hasAlliance) return a.hasAlliance ? -1 : 1;
      if (b.score !== a.score) return b.score - a.score;
      return a.name.localeCompare(b.name, 'zh-CN');
    });
}

