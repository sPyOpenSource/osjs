import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Officer } from '../types';
import AvatarRenderer from './AvatarRenderer';
import { applySeasonalOfficerModifiers, SEASONS, SeasonId } from '../utils/seasons';
import { CITIES, getNearbyTargetCities } from './TacticalMap';
import {
  playHeavyImpactSound,
  playParrySound,
  playDodgeSound,
  playUltimateSound,
  playTauntSound,
  playVictorySound,
  playDefeatSound,
} from '../utils/audio';
import { Swords, Shield, Zap, Sparkles, Trophy, RotateCcw, Swords as SwordIcon, Heart, Play, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FACTION_DEFAULT_CITY_NAME: Record<string, string> = {
  shu: '成都',
  wei: '许昌',
  wu: '建业',
  lubu: '洛阳',
  yuanshao: '邺城',
  rome: '罗马',
  macedon: '佩拉・雅典',
  persia: '泰西封',
  kushan: '布路沙布逻',
  yamatai: '邪马台',
  carthage: '迦太基',
  steppe: '漠北龙城',
  france: '巴黎',
  russia: '莫斯科',
  wuzhou: '洛阳',
  qing: '北平',
  qin: '长安',
  tang: '长安',
  ming: '建业',
  germany: '巴黎',
  europe: '罗马',
  netherlands: '伦敦',
  america: '纽约',
};

const ORIGIN_CITY_ALIASES: Array<[string, string]> = [
  ['咸阳', '长安'],
  ['紫禁城', '北平'],
  ['托勒密埃及', '亚历山大港'],
  ['孔雀帝国', '华氏城'],
  ['天竺', '华氏城'],
  ['贵霜', '布路沙布逻'],
  ['波斯', '泰西封'],
  ['匈奴', '漠北龙城'],
  ['塞外草原', '漠北龙城'],
  ['法兰西', '巴黎'],
  ['德意志', '巴黎'],
  ['欧洲联盟', '罗马'],
  ['葡萄牙', '罗马'],
  ['尼德兰', '伦敦'],
  ['大明', '建业'],
  ['北美合众国', '纽约'],
  ['纽约', '纽约'],
];

export function resolveOfficerCityName(officer: Officer): string {
  const rawHome = officer.homeCity?.trim();
  if (rawHome) {
    const matched = CITIES.find(c => c.name === rawHome || c.id === rawHome);
    return matched ? matched.name : rawHome;
  }

  const origin = officer.origin ?? '';
  if (origin) {
    for (const city of CITIES) {
      if (origin.includes(city.name)) {
        return city.name;
      }
    }
    for (const [keyword, cityName] of ORIGIN_CITY_ALIASES) {
      if (origin.includes(keyword)) {
        return cityName;
      }
    }
  }

  return FACTION_DEFAULT_CITY_NAME[officer.factionId] ?? '';
}

export function getAllowedNearbyCityNames(anchorCityInput?: string): {
  anchorCityName: string;
  allowedCityNames: Set<string>;
} {
  const trimmed = anchorCityInput?.trim() ?? '';
  if (!trimmed) {
    return { anchorCityName: '', allowedCityNames: new Set() };
  }
  const matchedCity = CITIES.find(c => c.name === trimmed || c.id === trimmed);
  if (!matchedCity) {
    return { anchorCityName: trimmed, allowedCityNames: new Set([trimmed]) };
  }
  const nearby = getNearbyTargetCities(matchedCity.id, CITIES);
  return {
    anchorCityName: matchedCity.name,
    allowedCityNames: new Set([matchedCity.name, ...nearby.map(c => c.name)]),
  };
}

interface DuelArenaProps {
  officers: Officer[];
  playerFactionId?: string;
  playerFactionName?: string;
  currentCityId?: string;
  soundEnabled: boolean;
  seasonId?: SeasonId;
  initialFighting?: boolean;
  onClose?: () => void;
  playClashSound: () => void;
  playDrumSound: () => void;
}

interface DuelistState {
  officer: Officer;
  hp: number;
  maxHp: number;
  rage: number;
  isParrying: boolean;
  isTaunted: boolean;
  shieldValue: number;
}

type SFMoveState =
  | 'idle'
  | 'walk'
  | 'jump'
  | 'jab'
  | 'heavy'
  | 'hadouken'
  | 'shoryuken'
  | 'guard'
  | 'hit'
  | 'taunt'
  | 'ko';

interface FighterSim {
  side: 'left' | 'right';
  officer: Officer;
  x: number;
  y: number;
  vy: number;
  facing: 1 | -1;
  state: SFMoveState;
  stateTick: number;
  stateDuration: number;
  hitApplied: boolean;
  hp: number;
  maxHp: number;
  trailHp: number;
  rage: number;
  isParrying: boolean;
  hitstun: number;
  combo: number;
  comboTimer: number;
  dashTargetX: number | null;
  pendingAttack: 'jab' | 'heavy' | 'shoryuken' | null;
}

interface ProjectileSim {
  id: number;
  owner: 'left' | 'right';
  x: number;
  y: number;
  vx: number;
  damage: number;
  color: string;
}

interface ArenaSim {
  left: FighterSim;
  right: FighterSim;
  projectiles: ProjectileSim[];
  clockSeconds: number;
  tickCount: number;
  hitstop: number;
  roundOver: boolean;
  aiThinkCooldown: { left: number; right: number };
}

interface ArenaVisualSnapshot {
  left: FighterSim;
  right: FighterSim;
  projectiles: ProjectileSim[];
  clockSeconds: number;
  hitstop: number;
}

function buildFighterSim(side: 'left' | 'right', officer: Officer): FighterSim {
  const maxHp = Math.round(180 + officer.stats.force * 2.4);
  return {
    side,
    officer,
    x: side === 'left' ? 26 : 74,
    y: 0,
    vy: 0,
    facing: side === 'left' ? 1 : -1,
    state: 'idle',
    stateTick: 0,
    stateDuration: 0,
    hitApplied: false,
    hp: maxHp,
    maxHp,
    trailHp: maxHp,
    rage: 0,
    isParrying: false,
    hitstun: 0,
    combo: 0,
    comboTimer: 0,
    dashTargetX: null,
    pendingAttack: null,
  };
}

function getFactionBodyColors(factionId: string): {
  gi: string;
  giBorder: string;
  belt: string;
  headband: string;
  aura: string;
} {
  switch (factionId) {
    case 'shu':
      return { gi: '#065f46', giBorder: '#34d399', belt: '#fbbf24', headband: '#ef4444', aura: '#34d399' };
    case 'wei':
      return { gi: '#1e3a8a', giBorder: '#60a5fa', belt: '#cbd5e1', headband: '#38bdf8', aura: '#60a5fa' };
    case 'wu':
      return { gi: '#881337', giBorder: '#fb7185', belt: '#fde047', headband: '#f43f5e', aura: '#fb7185' };
    default:
      return { gi: '#78350f', giBorder: '#fbbf24', belt: '#f8fafc', headband: '#ef4444', aura: '#f59e0b' };
  }
}

function StreetFighterRig({
  fighter,
  side,
  tauntMsg,
}: {
  fighter: FighterSim;
  side: 'left' | 'right';
  tauntMsg: string;
}) {
  const colors = getFactionBodyColors(fighter.officer.factionId);
  const st = fighter.state;
  const tick = fighter.stateTick;
  const isAttacking = st === 'jab' || st === 'heavy' || st === 'hadouken' || st === 'shoryuken';

  // Articulated limb kinematics driven by move state and frame tick
  const bobY = st === 'idle' ? Math.sin(Date.now() / 160 + (side === 'left' ? 0 : 1.5)) * 2.5 : 0;
  const torsoTilt =
    st === 'ko'
      ? -86
      : st === 'hit'
      ? -18
      : st === 'jab'
      ? 14
      : st === 'heavy'
      ? -10
      : st === 'hadouken'
      ? 18
      : st === 'shoryuken'
      ? 10
      : st === 'walk'
      ? 8
      : st === 'guard'
      ? -6
      : 4;

  const frontArmRotate =
    st === 'jab'
      ? -85
      : st === 'heavy'
      ? -35
      : st === 'hadouken'
      ? -88
      : st === 'shoryuken'
      ? -162
      : st === 'guard'
      ? -115
      : st === 'taunt'
      ? -132
      : st === 'hit'
      ? 35
      : st === 'walk'
      ? -45 + Math.sin(tick * 0.9) * 18
      : -58;

  const backArmRotate =
    st === 'hadouken'
      ? -84
      : st === 'guard'
      ? -105
      : st === 'jab'
      ? 22
      : st === 'shoryuken'
      ? 28
      : st === 'walk'
      ? -20 - Math.sin(tick * 0.9) * 18
      : -32;

  const frontLegRotate =
    st === 'heavy'
      ? -96
      : st === 'jump' || st === 'shoryuken'
      ? -44
      : st === 'walk'
      ? Math.sin(tick * 0.9) * 28
      : st === 'guard'
      ? 12
      : 16;

  const backLegRotate =
    st === 'heavy'
      ? 18
      : st === 'jump' || st === 'shoryuken'
      ? 32
      : st === 'walk'
      ? -Math.sin(tick * 0.9) * 28
      : -18;

  return (
    <div
      data-testid={`sf-fighter-${side}`}
      data-sf-state={st}
      style={{
        left: `${fighter.x}%`,
        bottom: '22px',
        transform: 'translateX(-50%)',
      }}
      className="absolute flex flex-col items-center pointer-events-none select-none z-20 will-change-transform"
    >
      {/* Dynamic ground shadow scaled by air height */}
      <div
        style={{
          transform: `scale(${Math.max(0.45, 1 - fighter.y / 180)})`,
          opacity: Math.max(0.25, 0.72 - fighter.y / 170),
        }}
        className="w-16 h-3 bg-black/75 rounded-full blur-[2px] absolute -bottom-1.5 z-0"
      />

      {/* Taunt speech bubble (unflipped) */}
      <AnimatePresence>
        {tauntMsg && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: -4 }}
            exit={{ scale: 0.5, opacity: 0 }}
            style={{ bottom: `${118 + fighter.y}px` }}
            className={`absolute ${side === 'left' ? 'left-0 rounded-bl-none' : 'right-0 rounded-br-none'} z-40 bg-slate-900/95 border border-amber-500/50 text-slate-100 px-3 py-1.5 rounded-2xl text-[10.5px] font-serif leading-tight whitespace-nowrap shadow-xl`}
          >
            <span className="text-amber-400 block font-bold mb-0.5">🗣️ 阵前挑衅：</span>
            {tauntMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elevated Martial Artist Body Container */}
      <div
        style={{
          transform: `translateY(${-(fighter.y + bobY)}px) scaleX(${fighter.facing})`,
        }}
        className="relative w-24 h-28 flex items-end justify-center z-10 transition-transform duration-75"
      >
        {/* Guard / Parry Force Field */}
        {(st === 'guard' || fighter.isParrying) && (
          <div className="absolute inset-x-1 top-1 bottom-0 rounded-2xl border-2 border-teal-400/80 bg-teal-400/15 shadow-[0_0_18px_rgba(45,212,191,0.45)] animate-pulse z-30" />
        )}

        {/* Shoryuken Rising Dragon Flame Aura */}
        {st === 'shoryuken' && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-28 bg-gradient-to-t from-orange-500/80 via-amber-300/60 to-transparent rounded-full blur-[3px] animate-pulse z-20" />
        )}

        {/* Hadouken Double-Palm Energy Sphere */}
        {st === 'hadouken' && (
          <div className="absolute right-0 top-9 w-8 h-8 rounded-full bg-cyan-300/90 border-2 border-white shadow-[0_0_20px_rgba(34,211,238,0.95)] z-30 animate-ping" />
        )}

        {/* Fighter Torso + Limbs Assembly */}
        <div
          style={{
            transform: `rotate(${torsoTilt}deg) translateY(${st === 'ko' ? '28px' : st === 'guard' ? '6px' : '0px'})`,
            opacity: st === 'ko' ? 0.65 : 1,
          }}
          className="relative w-20 h-24 origin-bottom flex flex-col items-center transition-transform duration-75"
        >
          {/* Hit flash tint */}
          {st === 'hit' && (
            <div className="absolute inset-0 bg-rose-500/45 rounded-xl blur-[1px] z-30" />
          )}

          {/* Back Leg */}
          <div
            style={{ transform: `rotate(${backLegRotate}deg)` }}
            className="absolute bottom-2 left-6 w-3.5 h-10 origin-top rounded-b-md bg-slate-900 border border-slate-700 z-0"
          >
            <div className="absolute bottom-0 inset-x-0 h-2.5 bg-amber-900/90 rounded-b-md border-t border-amber-500/40" />
          </div>

          {/* Front Leg (with High Kick crescent slash on heavy) */}
          <div
            style={{ transform: `rotate(${frontLegRotate}deg)` }}
            className="absolute bottom-2 right-6 w-4 h-10 origin-top rounded-b-md bg-slate-800 border border-slate-600 z-10"
          >
            <div className="absolute bottom-0 inset-x-0 h-3 bg-amber-800 rounded-b-md border-t border-amber-400/50" />
            {st === 'heavy' && (
              <div className="absolute -bottom-3 -left-2 w-8 h-8 rounded-full border-b-4 border-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.9)]" />
            )}
          </div>

          {/* Back Arm */}
          <div
            style={{ transform: `rotate(${backArmRotate}deg)` }}
            className="absolute top-10 left-5 w-3 h-9 origin-top rounded-full bg-amber-200/90 border border-amber-700/50 z-0"
          >
            <div className="absolute bottom-0 inset-x-0 h-3 rounded-full bg-rose-700 border border-amber-400/60" />
          </div>

          {/* Martial Gi / Armored Torso */}
          <div
            style={{
              backgroundColor: colors.gi,
              borderColor: colors.giBorder,
            }}
            className="absolute top-8 w-9 h-9 rounded-t-lg rounded-b-sm border-2 shadow-md z-10 flex flex-col items-center justify-end overflow-hidden"
          >
            {/* V-neck gi lapel */}
            <div className="w-4 h-3 bg-amber-100/85 rotate-45 -mt-2 mb-auto" />
            {/* Obi Martial Belt */}
            <div
              style={{ backgroundColor: colors.belt }}
              className="w-full h-2 border-y border-black/40"
            />
          </div>

          {/* Head + Avatar + Iconic Street Fighter Headband */}
          <div className="absolute top-0 w-10 h-10 rounded-xl overflow-visible z-20">
            <div
              style={{ borderColor: colors.giBorder }}
              className="w-10 h-10 rounded-xl overflow-hidden border-2 bg-slate-900 shadow-lg relative"
            >
              <AvatarRenderer style={fighter.officer.avatarStyle} />
            </div>
            {/* Flowing Martial Headband (Hachimaki) */}
            <div
              style={{ backgroundColor: colors.headband }}
              className="absolute top-1 -inset-x-0.5 h-1.5 rounded-sm shadow"
            />
            <div
              style={{ backgroundColor: colors.headband }}
              className={`absolute top-1 -left-3 w-3.5 h-1.5 rounded-l-full origin-right ${
                isAttacking || st === 'walk' ? '-rotate-12' : 'rotate-12'
              }`}
            />
            <div
              style={{ backgroundColor: colors.headband }}
              className="absolute top-2 -left-2.5 w-3 h-1 rounded-l-full origin-right rotate-[28deg] opacity-90"
            />
          </div>

          {/* Front Striking Arm + Fist / Fist Trail */}
          <div
            style={{ transform: `rotate(${frontArmRotate}deg)` }}
            className="absolute top-10 right-5 w-3.5 h-10 origin-top rounded-full bg-amber-200 border border-amber-800/60 z-20"
          >
            {/* Martial Wristwrap & Fist */}
            <div className="absolute bottom-0 -inset-x-0.5 h-3.5 rounded-full bg-rose-600 border border-amber-300 shadow" />
            {st === 'jab' && (
              <div className="absolute -bottom-5 left-0 w-3 h-6 bg-gradient-to-b from-amber-300 to-transparent rounded-full opacity-90" />
            )}
            {st === 'shoryuken' && (
              <div className="absolute -bottom-6 -left-1 w-5 h-8 bg-gradient-to-b from-yellow-200 via-orange-500 to-transparent rounded-full shadow-[0_0_16px_rgba(251,191,36,0.95)]" />
            )}
          </div>
        </div>
      </div>

      {/* Unflipped Name Tag + Combo Badge */}
      <div className="relative z-30 mt-1 flex items-center gap-1">
        <span
          className={`text-[9.5px] font-serif font-black px-2 py-0.5 rounded border shadow ${
            side === 'left'
              ? 'bg-slate-950/95 border-amber-500/60 text-amber-300'
              : 'bg-slate-950/95 border-rose-500/60 text-rose-300'
          }`}
        >
          {side === 'left' ? 'P1' : 'P2'} · {fighter.officer.name}
        </span>
      </div>
    </div>
  );
}

export default function DuelArena({
  officers,
  playerFactionId,
  playerFactionName,
  currentCityId,
  soundEnabled,
  seasonId = 'spring',
  initialFighting = false,
  playClashSound,
  playDrumSound,
  onClose,
}: DuelArenaProps) {
  const activeSeason = SEASONS[seasonId];
  const myFactionOfficers = useMemo(
    () =>
      playerFactionId
        ? officers.filter(o => o.factionId === playerFactionId)
        : officers,
    [officers, playerFactionId],
  );
  // Combat selection states
  const [selectedLeftId, setSelectedLeftId] = useState<string>('');
  const [selectedRightId, setSelectedRightId] = useState<string>('');
  const [combatType, setCombatType] = useState<'player_vs_ai' | 'ai_vs_ai' | 'player_vs_player'>('player_vs_ai');

  // Precompute initial candidates so `initialFighting={true}` can mount straight into active arena (e.g. tests)
  const initialPair = useMemo(() => {
    if (!initialFighting) return null;
    const rawL =
      myFactionOfficers.find(o => o.name.includes('关羽')) ?? myFactionOfficers[0];
    if (!rawL) return null;
    const anchor = currentCityId?.trim() || resolveOfficerCityName(rawL);
    const { allowedCityNames } = getAllowedNearbyCityNames(anchor);
    const candidates =
      allowedCityNames.size === 0
        ? officers.filter(o => o.id !== rawL.id)
        : officers.filter(o => {
            if (o.id === rawL.id) return false;
            const cName = resolveOfficerCityName(o);
            return cName !== '' && allowedCityNames.has(cName);
          });
    const rawR =
      candidates.find(o => o.name.includes('吕布')) ??
      candidates[0] ??
      officers.find(o => o.id !== rawL.id) ??
      rawL;
    const leftOff = applySeasonalOfficerModifiers(rawL, seasonId);
    const rightOff = applySeasonalOfficerModifiers(rawR, seasonId);
    return { leftOff, rightOff };
  }, [initialFighting, myFactionOfficers, officers, currentCityId, seasonId]);

  const initialSim: ArenaSim | null = initialPair
    ? {
        left: buildFighterSim('left', initialPair.leftOff),
        right: buildFighterSim('right', initialPair.rightOff),
        projectiles: [],
        clockSeconds: 99,
        tickCount: 0,
        hitstop: 0,
        roundOver: false,
        aiThinkCooldown: { left: 10, right: 10 },
      }
    : null;

  // Combat loop states
  const [isFighting, setIsFighting] = useState<boolean>(Boolean(initialSim));
  const [currentTurn, setCurrentTurn] = useState<'left' | 'right'>('left');
  const [roundCount, setRoundCount] = useState<number>(1);
  const [battleLogs, setBattleLogs] = useState<string[]>(() =>
    initialPair
      ? [
          `🥊 【街头快打演武】Round 1 — FIGHT!`,
          `🏁 P1【${initialPair.leftOff.name}】vs P2【${initialPair.rightOff.name}】`,
        ]
      : [],
  );

  // Dynamic status of duelists (synced from real-time simulation)
  const [leftDuelist, setLeftDuelist] = useState<DuelistState | null>(() =>
    initialSim
      ? {
          officer: initialSim.left.officer,
          hp: initialSim.left.hp,
          maxHp: initialSim.left.maxHp,
          rage: 0,
          isParrying: false,
          isTaunted: false,
          shieldValue: 0,
        }
      : null,
  );
  const [rightDuelist, setRightDuelist] = useState<DuelistState | null>(() =>
    initialSim
      ? {
          officer: initialSim.right.officer,
          hp: initialSim.right.hp,
          maxHp: initialSim.right.maxHp,
          rage: 0,
          isParrying: false,
          isTaunted: false,
          shieldValue: 0,
        }
      : null,
  );

  // Visual feedback states
  const [leftShake, setLeftShake] = useState<boolean>(false);
  const [rightShake, setRightShake] = useState<boolean>(false);
  const [leftSlash, setLeftSlash] = useState<boolean>(false);
  const [rightSlash, setRightSlash] = useState<boolean>(false);
  const [floatingText, setFloatingText] = useState<{
    id: number;
    text: string;
    side: 'left' | 'right';
    tone?: 'hit' | 'crit' | 'heal' | 'miss' | 'parry' | 'rage';
  }[]>([]);
  const [showUltFlash, setShowUltFlash] = useState<boolean>(false);
  const [winnerSide, setWinnerSide] = useState<'left' | 'right' | 'draw' | null>(null);
  const [lastTauntMsg, setLastTauntMsg] = useState<{ left: string; right: string }>({ left: '', right: '' });
  const [sparkParticles, setSparkParticles] = useState<{
    id: number;
    xPct: number;
    yPx: number;
    vx: number;
    vy: number;
    size: number;
    duration: number;
    color: string;
  }[]>([]);
  const [dustPuffs, setDustPuffs] = useState<{
    id: number;
    xPct: number;
    vx: number;
    scale: number;
  }[]>([]);
  const [clashImpact, setClashImpact] = useState<{
    id: number;
    type: 'slash' | 'heavy' | 'ultimate' | 'parry';
    crit: boolean;
    xPct: number;
    yPx: number;
    direction: 'left-to-right' | 'right-to-left';
  } | null>(null);
  const [ultBanner, setUltBanner] = useState<{
    officerName: string;
    moveName: string;
    side: 'left' | 'right';
  } | null>(null);
  const [stageShake, setStageShake] = useState<'none' | 'light' | 'heavy'>('none');
  const [arenaSnap, setArenaSnap] = useState<ArenaVisualSnapshot | null>(() =>
    initialSim
      ? {
          left: { ...initialSim.left },
          right: { ...initialSim.right },
          projectiles: [],
          clockSeconds: initialSim.clockSeconds,
          hitstop: 0,
        }
      : null,
  );

  const logEndRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const floatingIdCounter = useRef<number>(0);
  const simRef = useRef<ArenaSim | null>(initialSim);
  const keysRef = useRef<Set<string>>(new Set());
  const virtualHoldRef = useRef<{
    leftMove: -1 | 0 | 1;
    leftGuard: boolean;
    rightMove: -1 | 0 | 1;
    rightGuard: boolean;
  }>({ leftMove: 0, leftGuard: false, rightMove: 0, rightGuard: false });
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;
  const combatTypeRef = useRef(combatType);
  combatTypeRef.current = combatType;

  const TAUNT_QUOTES = [
    "三姓家奴，安敢在此门前叫阵！",
    "燕人张翼德在此！谁敢与我决一死战？",
    "竖子不足与谋！看吾青龙偃月刀！",
    "吾有无双上将，顷刻便可斩你！",
    "插标卖首之徒，安敢口出狂言！",
    "鼠辈，看吾取尔项上人头！",
    "曹贼，今日便是尔之死期！",
    "看枪！七进七出，直取敌将！",
    "江东小霸王在此，谁来领死！",
    "尔等插标卖首，岂足挂齿！",
    "吾乃常山赵子龙是也，安敢犯我疆土！",
    "看招！取你首级如探囊取物耳！"
  ];

  const spawnSparksAt = (xPct: number, yPx: number, count = 18, intense = false) => {
    const palette = intense
      ? ['#fde047', '#f97316', '#ef4444', '#ffffff']
      : ['#fbbf24', '#38bdf8', '#ef4444'];
    const newParticles = Array.from({ length: count }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.45;
      const speed = (intense ? 85 : 50) + Math.random() * (intense ? 110 : 65);
      return {
        id: floatingIdCounter.current++ + Math.random(),
        xPct,
        yPx,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 20,
        size: intense ? 4.5 + Math.random() * 5 : 3 + Math.random() * 3.5,
        duration: 0.48 + Math.random() * 0.28,
        color: palette[i % palette.length],
      };
    });
    setSparkParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      const ids = new Set(newParticles.map(p => p.id));
      setSparkParticles(prev => prev.filter(p => !ids.has(p.id)));
    }, 850);
  };

  const spawnDustAt = (xPct: number, dir: 1 | -1 = 1) => {
    const puffs = Array.from({ length: 4 }).map((_, i) => ({
      id: floatingIdCounter.current++ + Math.random(),
      xPct: Math.max(6, Math.min(94, xPct - dir * i * 2)),
      vx: -dir * (18 + Math.random() * 24),
      scale: 0.65 + Math.random() * 0.55,
    }));
    setDustPuffs(prev => [...prev, ...puffs]);
    setTimeout(() => {
      const ids = new Set(puffs.map(p => p.id));
      setDustPuffs(prev => prev.filter(p => !ids.has(p.id)));
    }, 550);
  };

  const triggerStageShake = (intensity: 'light' | 'heavy') => {
    setStageShake(intensity);
    setTimeout(() => setStageShake('none'), intensity === 'heavy' ? 420 : 280);
  };

  const effectiveLeftId = useMemo(() => {
    if (selectedLeftId && myFactionOfficers.some(o => o.id === selectedLeftId)) {
      return selectedLeftId;
    }
    if (myFactionOfficers.length === 0) return '';
    const guanYu = myFactionOfficers.find(o => o.name.includes('关羽'));
    return guanYu ? guanYu.id : myFactionOfficers[0].id;
  }, [selectedLeftId, myFactionOfficers]);

  const effectiveLeftOfficer = useMemo(
    () => myFactionOfficers.find(o => o.id === effectiveLeftId) ?? null,
    [myFactionOfficers, effectiveLeftId],
  );

  const anchorCityInput = useMemo(() => {
    if (currentCityId?.trim()) return currentCityId.trim();
    if (effectiveLeftOfficer) return resolveOfficerCityName(effectiveLeftOfficer);
    return '';
  }, [currentCityId, effectiveLeftOfficer]);

  const { anchorCityName, allowedCityNames } = useMemo(
    () => getAllowedNearbyCityNames(anchorCityInput),
    [anchorCityInput],
  );

  const rightCandidates = useMemo(() => {
    if (allowedCityNames.size === 0) return [];
    return officers.filter(o => {
      if (effectiveLeftId && o.id === effectiveLeftId) return false;
      const cityName = resolveOfficerCityName(o);
      return cityName !== '' && allowedCityNames.has(cityName);
    });
  }, [officers, allowedCityNames, effectiveLeftId]);

  const effectiveRightId = useMemo(() => {
    if (selectedRightId && rightCandidates.some(o => o.id === selectedRightId)) {
      return selectedRightId;
    }
    if (rightCandidates.length === 0) return '';
    const luBu = rightCandidates.find(o => o.name.includes('吕布'));
    return luBu ? luBu.id : rightCandidates[0].id;
  }, [selectedRightId, rightCandidates]);

  // Default initial selections (Left camp restricted to player's faction)
  useEffect(() => {
    if (effectiveLeftId !== selectedLeftId) {
      setSelectedLeftId(effectiveLeftId);
    }
    if (effectiveRightId !== selectedRightId) {
      setSelectedRightId(effectiveRightId);
    }
  }, [effectiveLeftId, effectiveRightId, selectedLeftId, selectedRightId]);

  // Scroll duel logs automatically
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [battleLogs]);

  // Pre-configured Epic Duel presets
  const MATCHUPS = [
    {
      name: '🦁 虎牢关绝顶武斗：关羽 vs 吕布',
      leftName: '关羽',
      rightName: '吕布'
    },
    {
      name: '🌾 葭萌关挑灯夜战：张飞 vs 马超',
      leftName: '张飞',
      rightName: '马超'
    },
    {
      name: '🐉 龙行神威断长坂：赵云 vs 曹操',
      leftName: '赵云',
      rightName: '曹操'
    },
    {
      name: '👑 帝王霸道之弈：刘备 vs 孙策',
      leftName: '刘备',
      rightName: '孙策'
    }
  ];

  const loadMatchup = (leftName: string, rightName: string) => {
    const left = myFactionOfficers.find(o => o.name.includes(leftName)) ?? myFactionOfficers[0];
    const right = rightCandidates.find(o => o.name.includes(rightName));
    if (left) setSelectedLeftId(left.id);
    if (right) setSelectedRightId(right.id);
  };

  // Helper to trigger floating damage/heal/evade text above avatars
  const triggerFloatingText = (
    text: string,
    side: 'left' | 'right',
    tone: 'hit' | 'crit' | 'heal' | 'miss' | 'parry' | 'rage' = 'hit'
  ) => {
    const id = floatingIdCounter.current++;
    setFloatingText(prev => [...prev, { id, text, side, tone }]);
    setTimeout(() => {
      setFloatingText(prev => prev.filter(t => t.id !== id));
    }, 1400);
  };

  const addLog = (msg: string) => {
    setBattleLogs(prev => [...prev, msg]);
  };

  // Generate unique custom ultimate titles based on historical records or officer name
  const getUltimateName = (off: Officer) => {
    if (off.name.includes('关羽')) return '青龙傲世大断首';
    if (off.name.includes('张飞')) return '万人敌破胆八荒吼';
    if (off.name.includes('赵云')) return '七进七出枪出如龙';
    if (off.name.includes('吕布')) return '神鬼无双戟灭天下';
    if (off.name.includes('马超')) return '西凉铁骑断绝枪';
    if (off.name.includes('刘备')) return '雌雄双股御前九式';
    if (off.name.includes('曹操')) return '天授奸雄绝尘一剑';
    if (off.name.includes('诸葛亮')) return '奇门八阵九天玄雷';
    if (off.name.includes('周瑜')) return '赤壁红莲焦土烽火';
    if (off.name.includes('孙策')) return '小霸王怒涛劈击';
    return `${off.name.slice(0, 2)}无双绝尘断`;
  };

  const getFactionLetter = (name: string) => {
    if (name.includes('关羽') || name.includes('张飞') || name.includes('赵云') || name.includes('刘备') || name.includes('诸葛亮')) return '蜀';
    if (name.includes('曹操') || name.includes('夏侯') || name.includes('司马') || name.includes('郭嘉') || name.includes('张辽') || name.includes('徐晃') || name.includes('典韦') || name.includes('许褚')) return '魏';
    if (name.includes('孙权') || name.includes('孙策') || name.includes('周瑜') || name.includes('陆逊') || name.includes('甘宁') || name.includes('太史慈') || name.includes('黄盖')) return '吴';
    return '群';
  };

  // Combat loop initialization (Real-Time Street Fighter 2D Arena)
  const startDuel = () => {
    const rawLeftOfficer = myFactionOfficers.find(o => o.id === effectiveLeftId);
    const rawRightOfficer = rightCandidates.find(o => o.id === effectiveRightId);

    if (!rawLeftOfficer || !rawRightOfficer) {
      return;
    }

    const leftOfficer = applySeasonalOfficerModifiers(rawLeftOfficer, seasonId);
    const rightOfficer = applySeasonalOfficerModifiers(rawRightOfficer, seasonId);

    if (soundEnabled) {
      playDrumSound();
    }

    const sim: ArenaSim = {
      left: buildFighterSim('left', leftOfficer),
      right: buildFighterSim('right', rightOfficer),
      projectiles: [],
      clockSeconds: 99,
      tickCount: 0,
      hitstop: 0,
      roundOver: false,
      aiThinkCooldown: { left: 8, right: 10 },
    };
    simRef.current = sim;
    keysRef.current.clear();
    virtualHoldRef.current = { leftMove: 0, leftGuard: false, rightMove: 0, rightGuard: false };

    setLeftDuelist({
      officer: leftOfficer,
      hp: sim.left.hp,
      maxHp: sim.left.maxHp,
      rage: 0,
      isParrying: false,
      isTaunted: false,
      shieldValue: 0,
    });
    setRightDuelist({
      officer: rightOfficer,
      hp: sim.right.hp,
      maxHp: sim.right.maxHp,
      rage: 0,
      isParrying: false,
      isTaunted: false,
      shieldValue: 0,
    });

    setArenaSnap({
      left: { ...sim.left },
      right: { ...sim.right },
      projectiles: [],
      clockSeconds: 99,
      hitstop: 0,
    });

    setLastTauntMsg({ left: '', right: '' });
    setSparkParticles([]);
    setDustPuffs([]);
    setClashImpact(null);
    setUltBanner(null);
    setStageShake('none');
    setIsFighting(true);
    setRoundCount(1);
    setCurrentTurn('left');
    setWinnerSide(null);
    setBattleLogs([
      `🥊 【街头快打演武】Round 1 — FIGHT！(${activeSeason.icon} ${activeSeason.name})`,
      `🏁 P1【${leftOfficer.name}】(武力 ${leftOfficer.stats.force}) 摆出起手拳架站位左侧！`,
      `🏁 P2【${rightOfficer.name}】(武力 ${rightOfficer.stats.force}) 沉腰立势迎战右侧！`,
      `🎮 操作说明：A/D 移动，W 跳跃，S 格挡，J 轻拳，K 重脚，L 波动气功，U 升龙奥义，I 挑衅（或点击下方招式键）。`,
    ]);
  };

  // Start a specific Street Fighter move for a fighter inside simRef
  const startFighterMove = (
    sim: ArenaSim,
    side: 'left' | 'right',
    move: 'jab' | 'heavy' | 'hadouken' | 'shoryuken' | 'guard' | 'taunt' | 'jump',
    allowRushAssist = false,
  ) => {
    const actor = side === 'left' ? sim.left : sim.right;
    const opp = side === 'left' ? sim.right : sim.left;
    if (sim.roundOver || actor.state === 'ko' || actor.hitstun > 0) return;
    if (
      actor.state === 'jab' ||
      actor.state === 'heavy' ||
      actor.state === 'hadouken' ||
      actor.state === 'shoryuken'
    ) {
      return;
    }

    if (move === 'jump') {
      if (actor.y <= 1) {
        actor.vy = 13.2;
        actor.state = 'jump';
        actor.stateTick = 0;
        actor.stateDuration = 26;
        spawnDustAt(actor.x, actor.facing);
        if (soundEnabledRef.current) playDodgeSound();
      }
      return;
    }

    if (move === 'guard') {
      actor.state = 'guard';
      actor.stateTick = 0;
      actor.stateDuration = 16;
      actor.isParrying = true;
      actor.dashTargetX = null;
      actor.pendingAttack = null;
      return;
    }

    if (move === 'taunt') {
      actor.state = 'taunt';
      actor.stateTick = 0;
      actor.stateDuration = 20;
      actor.dashTargetX = null;
      actor.pendingAttack = null;
      const rageDrain = Math.floor(16 + actor.officer.stats.charisma * 0.14);
      opp.rage = Math.max(0, opp.rage - rageDrain);
      actor.rage = Math.min(100, actor.rage + 12);
      const quote = TAUNT_QUOTES[Math.floor(Math.random() * TAUNT_QUOTES.length)];
      setLastTauntMsg(prev => ({ ...prev, [side]: quote }));
      setTimeout(() => setLastTauntMsg(prev => ({ ...prev, [side]: '' })), 1900);
      triggerFloatingText(`怒气 -${rageDrain}`, opp.side, 'rage');
      if (soundEnabledRef.current) playTauntSound();
      addLog(`🗣️ [${actor.officer.name}] 阵前喝骂挑衅！[${opp.officer.name}] 怒气滑落 ${rageDrain} 点！`);
      return;
    }

    if (move === 'shoryuken') {
      if (actor.rage < 50) return;
      const dist = Math.abs(actor.x - opp.x);
      if (allowRushAssist && dist > 19) {
        actor.dashTargetX = opp.x - actor.facing * 12;
        actor.pendingAttack = 'shoryuken';
        actor.state = 'walk';
        spawnDustAt(actor.x, actor.facing);
        return;
      }
      actor.rage = Math.max(0, actor.rage - 50);
      actor.state = 'shoryuken';
      actor.stateTick = 0;
      actor.stateDuration = 26;
      actor.hitApplied = false;
      actor.isParrying = false;
      actor.vy = 14.5;
      actor.x = Math.max(8, Math.min(92, actor.x + actor.facing * 6));
      const ultName = getUltimateName(actor.officer);
      setShowUltFlash(true);
      setUltBanner({ officerName: actor.officer.name, moveName: ultName, side });
      setTimeout(() => setShowUltFlash(false), 650);
      setTimeout(() => setUltBanner(null), 900);
      if (soundEnabledRef.current) playUltimateSound();
      return;
    }

    if (move === 'hadouken') {
      actor.state = 'hadouken';
      actor.stateTick = 0;
      actor.stateDuration = 18;
      actor.hitApplied = false;
      actor.isParrying = false;
      actor.dashTargetX = null;
      actor.pendingAttack = null;
      if (soundEnabledRef.current) playClashSound();
      return;
    }

    // Melee strikes (jab / heavy) with optional button rushdown assist
    const dist = Math.abs(actor.x - opp.x);
    if (allowRushAssist && dist > 18) {
      actor.dashTargetX = opp.x - actor.facing * 12;
      actor.pendingAttack = move;
      actor.state = 'walk';
      spawnDustAt(actor.x, actor.facing);
      return;
    }

    actor.state = move;
    actor.stateTick = 0;
    actor.stateDuration = move === 'jab' ? 11 : 19;
    actor.hitApplied = false;
    actor.isParrying = false;
    actor.x = Math.max(8, Math.min(92, actor.x + actor.facing * (move === 'jab' ? 2.2 : 3.8)));
  };

  // Apply real-time hit collision & combo / guard resolution
  const applyFighterHit = (
    sim: ArenaSim,
    attacker: FighterSim,
    defender: FighterSim,
    kind: 'jab' | 'heavy' | 'hadouken' | 'shoryuken',
    impactX: number,
    impactY: number,
  ) => {
    if (sim.roundOver || defender.state === 'ko') return;

    const isGuarding = defender.state === 'guard' || defender.isParrying;
    const isCrit = kind === 'shoryuken' || (kind === 'heavy' && Math.random() < 0.25);

    let rawDmg =
      kind === 'jab'
        ? 14 + attacker.officer.stats.force * 0.14
        : kind === 'heavy'
        ? 28 + attacker.officer.stats.force * 0.26
        : kind === 'hadouken'
        ? 20 + attacker.officer.stats.force * 0.16 + attacker.officer.stats.intelligence * 0.08
        : 52 + attacker.officer.stats.force * 0.42;

    if (isCrit && kind !== 'shoryuken') rawDmg *= 1.35;

    let dmg = Math.round(rawDmg * (1 - defender.officer.stats.force * 0.0015));
    if (isGuarding && kind !== 'shoryuken') {
      dmg = Math.max(3, Math.floor(dmg * 0.25));
      defender.rage = Math.min(100, defender.rage + 10);
      attacker.rage = Math.min(100, attacker.rage + 6);
      if (soundEnabledRef.current) playParrySound();
      triggerFloatingText(`-${dmg} 🛡️防住`, defender.side, 'parry');
      setClashImpact({
        id: floatingIdCounter.current++,
        type: 'parry',
        crit: false,
        xPct: impactX,
        yPx: impactY,
        direction: attacker.facing === 1 ? 'left-to-right' : 'right-to-left',
      });
      setTimeout(() => setClashImpact(null), 320);
    } else {
      defender.hitstun = kind === 'jab' ? 9 : kind === 'heavy' ? 15 : kind === 'shoryuken' ? 22 : 12;
      defender.state = 'hit';
      defender.stateTick = 0;
      defender.stateDuration = defender.hitstun;
      defender.dashTargetX = null;
      defender.pendingAttack = null;
      defender.x = Math.max(7, Math.min(93, defender.x + attacker.facing * (kind === 'shoryuken' ? 8 : kind === 'heavy' ? 6 : 3)));
      if (kind === 'shoryuken') {
        defender.vy = 10.5;
      }

      attacker.combo = defender.hitstun > 0 ? attacker.combo + 1 : 1;
      attacker.comboTimer = 42;
      attacker.rage = Math.min(
        100,
        attacker.rage + (kind === 'jab' ? 14 : kind === 'heavy' ? 22 : kind === 'hadouken' ? 15 : 0),
      );
      defender.rage = Math.min(100, defender.rage + Math.floor(dmg * 0.35));

      sim.hitstop = kind === 'shoryuken' ? 5 : kind === 'heavy' ? 3 : 2;
      if (soundEnabledRef.current) {
        if (kind === 'heavy' || isCrit) playHeavyImpactSound();
        else playClashSound();
      }
      if (defender.side === 'left') {
        setLeftShake(true);
        setTimeout(() => setLeftShake(false), 260);
      } else {
        setRightShake(true);
        setTimeout(() => setRightShake(false), 260);
      }
      if (attacker.side === 'left') {
        setLeftSlash(true);
        setTimeout(() => setLeftSlash(false), 260);
      } else {
        setRightSlash(true);
        setTimeout(() => setRightSlash(false), 260);
      }

      spawnSparksAt(impactX, impactY, kind === 'shoryuken' ? 26 : kind === 'heavy' ? 20 : 12, kind === 'shoryuken' || isCrit);
      setClashImpact({
        id: floatingIdCounter.current++,
        type: kind === 'shoryuken' ? 'ultimate' : kind === 'heavy' ? 'heavy' : 'slash',
        crit: isCrit,
        xPct: impactX,
        yPx: impactY,
        direction: attacker.facing === 1 ? 'left-to-right' : 'right-to-left',
      });
      setTimeout(() => setClashImpact(null), 350);

      if (kind === 'shoryuken' || kind === 'heavy' || isCrit) triggerStageShake('heavy');
      else triggerStageShake('light');

      const hitLabel =
        kind === 'shoryuken'
          ? `-${dmg} 🔥升龙破!`
          : isCrit
          ? `-${dmg} 💥重创!`
          : `-${dmg}`;
      triggerFloatingText(hitLabel, defender.side, kind === 'shoryuken' || isCrit ? 'crit' : 'hit');
    }

    defender.hp = Math.max(0, defender.hp - dmg);
    setRoundCount(r => r + 1);

    if (kind === 'shoryuken') {
      addLog(`🔥 升龙奥义！【${attacker.officer.name}】一记『${getUltimateName(attacker.officer)}』将【${defender.officer.name}】轰飞，造成 ${dmg} 点伤害！`);
    } else if (kind === 'heavy' && !isGuarding) {
      addLog(`🦵 【${attacker.officer.name}】崩山旋风重脚击中【${defender.officer.name}】，造成 ${dmg} 点伤害！`);
    } else if (kind === 'hadouken' && !isGuarding) {
      addLog(`🔵 【${attacker.officer.name}】波动气功波贯体而过，对【${defender.officer.name}】造成 ${dmg} 点伤害！`);
    }

    if (defender.hp <= 0) {
      sim.roundOver = true;
      defender.state = 'ko';
      attacker.state = 'taunt';
      setWinnerSide(attacker.side);
      addLog(`🏆 K.O.! 【${attacker.officer.name}】凌厉连段击倒【${defender.officer.name}】，赢得街头演武大捷！`);
      if (soundEnabledRef.current) playVictorySound();
    }
  };

  // Trigger player button click / tap moves
  const executeAction = (
    action: 'slash' | 'heavy' | 'parry' | 'ultimate' | 'taunt' | 'hadouken' | 'jump',
    targetSide?: 'left' | 'right',
  ) => {
    const sim = simRef.current;
    if (!sim || sim.roundOver) return;
    const controlledSide: 'left' | 'right' =
      targetSide ?? (combatType === 'player_vs_player' ? currentTurn : 'left');
    if (combatType === 'ai_vs_ai') return;

    setCurrentTurn(controlledSide);
    const mapped =
      action === 'slash'
        ? 'jab'
        : action === 'parry'
        ? 'guard'
        : action === 'ultimate'
        ? 'shoryuken'
        : action;
    startFighterMove(sim, controlledSide, mapped, true);
  };

  const stepMove = (side: 'left' | 'right', dir: -1 | 1) => {
    const sim = simRef.current;
    if (!sim || sim.roundOver) return;
    const f = side === 'left' ? sim.left : sim.right;
    if (f.hitstun > 0 || f.state === 'ko') return;
    f.dashTargetX = null;
    f.pendingAttack = null;
    f.x = Math.max(8, Math.min(92, f.x + dir * 4.5));
    if (f.y <= 0) {
      f.state = 'walk';
      f.stateTick += 1;
      spawnDustAt(f.x, dir);
    }
  };

  // Keyboard Arcade Controls
  useEffect(() => {
    if (!isFighting || winnerSide) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
      const sim = simRef.current;
      if (!sim || sim.roundOver) return;
      const mode = combatTypeRef.current;
      if (mode === 'ai_vs_ai') return;

      const code = e.code;
      if (
        ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(code)
      ) {
        e.preventDefault();
      }
      const alreadyHeld = keysRef.current.has(code);
      keysRef.current.add(code);
      if (alreadyHeld) return;

      // P1 Attack & Jump Triggers
      if (code === 'KeyW' || (mode === 'player_vs_ai' && code === 'ArrowUp')) {
        startFighterMove(sim, 'left', 'jump');
      } else if (code === 'KeyJ') {
        startFighterMove(sim, 'left', 'jab');
      } else if (code === 'KeyK') {
        startFighterMove(sim, 'left', 'heavy');
      } else if (code === 'KeyL') {
        startFighterMove(sim, 'left', 'hadouken');
      } else if (code === 'KeyU') {
        startFighterMove(sim, 'left', 'shoryuken');
      } else if (code === 'KeyI') {
        startFighterMove(sim, 'left', 'taunt');
      }

      // P2 Triggers (Local 2P)
      if (mode === 'player_vs_player') {
        if (code === 'ArrowUp') startFighterMove(sim, 'right', 'jump');
        else if (code === 'Digit1' || code === 'Numpad1') startFighterMove(sim, 'right', 'jab');
        else if (code === 'Digit2' || code === 'Numpad2') startFighterMove(sim, 'right', 'heavy');
        else if (code === 'Digit3' || code === 'Numpad3') startFighterMove(sim, 'right', 'hadouken');
        else if (code === 'Digit4' || code === 'Numpad4') startFighterMove(sim, 'right', 'shoryuken');
        else if (code === 'Digit5' || code === 'Numpad5') startFighterMove(sim, 'right', 'taunt');
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [isFighting, winnerSide]);

  // Real-time ~30fps Street Fighter simulation loop
  useEffect(() => {
    if (!isFighting || winnerSide) return;

    const interval = setInterval(() => {
      const sim = simRef.current;
      if (!sim || sim.roundOver) return;

      sim.tickCount += 1;
      if (sim.hitstop > 0) {
        sim.hitstop -= 1;
        return;
      }

      const mode = combatTypeRef.current;
      const keys = keysRef.current;
      const hold = virtualHoldRef.current;

      // 1) Process player continuous movement & guard inputs
      const updatePlayerLocomotion = (side: 'left' | 'right') => {
        const f = side === 'left' ? sim.left : sim.right;
        const isAi = (side === 'left' && mode === 'ai_vs_ai') || (side === 'right' && mode !== 'player_vs_player');
        if (isAi || f.hitstun > 0 || f.state === 'ko') return;
        const busyAttack =
          f.state === 'jab' || f.state === 'heavy' || f.state === 'hadouken' || f.state === 'shoryuken' || f.state === 'taunt';
        if (busyAttack) return;

        let moveDir = 0;
        let wantGuard = false;
        if (side === 'left') {
          if (keys.has('KeyA') || (mode === 'player_vs_ai' && keys.has('ArrowLeft')) || hold.leftMove === -1) moveDir -= 1;
          if (keys.has('KeyD') || (mode === 'player_vs_ai' && keys.has('ArrowRight')) || hold.leftMove === 1) moveDir += 1;
          wantGuard = keys.has('KeyS') || (mode === 'player_vs_ai' && keys.has('ArrowDown')) || hold.leftGuard;
        } else {
          if (keys.has('ArrowLeft') || hold.rightMove === -1) moveDir -= 1;
          if (keys.has('ArrowRight') || hold.rightMove === 1) moveDir += 1;
          wantGuard = keys.has('ArrowDown') || hold.rightGuard;
        }

        if (wantGuard && f.y <= 0) {
          f.state = 'guard';
          f.isParrying = true;
          f.dashTargetX = null;
          f.pendingAttack = null;
        } else if (moveDir !== 0) {
          f.isParrying = false;
          f.dashTargetX = null;
          f.pendingAttack = null;
          f.x = Math.max(8, Math.min(92, f.x + moveDir * 1.65));
          if (f.y <= 0) {
            f.state = 'walk';
            f.stateTick += 1;
          }
        } else if (!f.dashTargetX && f.y <= 0) {
          f.isParrying = false;
          f.state = 'idle';
        }
      };

      updatePlayerLocomotion('left');
      updatePlayerLocomotion('right');

      // 2) Reactive real-time AI decisions
      const runAi = (side: 'left' | 'right') => {
        const isAi = (side === 'left' && mode === 'ai_vs_ai') || (side === 'right' && mode !== 'player_vs_player');
        if (!isAi) return;
        const actor = side === 'left' ? sim.left : sim.right;
        const opp = side === 'left' ? sim.right : sim.left;
        if (actor.hitstun > 0 || actor.state === 'ko') return;
        const busy =
          actor.state === 'jab' || actor.state === 'heavy' || actor.state === 'hadouken' || actor.state === 'shoryuken' || actor.state === 'taunt';
        if (busy) return;

        // Jump over incoming Hadouken fireball
        const incomingFireball = sim.projectiles.find(
          p => p.owner !== side && Math.abs(p.x - actor.x) < 16 && Math.sign(p.vx) === Math.sign(actor.x - p.x),
        );
        if (incomingFireball && actor.y <= 1 && Math.random() < 0.72) {
          startFighterMove(sim, side, 'jump');
          return;
        }

        // Advance or space during cooldown
        const dist = Math.abs(actor.x - opp.x);
        if (sim.aiThinkCooldown[side] > 0) {
          sim.aiThinkCooldown[side] -= 1;
          if (actor.state === 'walk' && dist > 14) {
            actor.x = Math.max(8, Math.min(92, actor.x + actor.facing * 1.35));
            actor.stateTick += 1;
          }
          return;
        }

        sim.aiThinkCooldown[side] = 8 + Math.floor(Math.random() * 8);

        if (opp.state !== 'idle' && opp.state !== 'walk' && dist < 20 && Math.random() < 0.35) {
          startFighterMove(sim, side, 'guard');
        } else if (actor.rage >= 50 && dist < 22 && Math.random() < 0.7) {
          startFighterMove(sim, side, 'shoryuken');
        } else if (dist > 26 && Math.random() < 0.55) {
          startFighterMove(sim, side, 'hadouken');
        } else if (dist > 16) {
          actor.state = 'walk';
          actor.isParrying = false;
        } else {
          const roll = Math.random();
          if (roll < 0.48) startFighterMove(sim, side, 'jab');
          else if (roll < 0.84) startFighterMove(sim, side, 'heavy');
          else if (opp.rage > 40 && roll < 0.94) startFighterMove(sim, side, 'taunt');
          else startFighterMove(sim, side, 'guard');
        }
      };

      runAi('left');
      runAi('right');

      // 3) Advance fighter physics, dash-assists, and frame windows
      const stepFighter = (actor: FighterSim, opp: FighterSim) => {
        // Delayed yellow/red damage trail decay
        if (actor.trailHp > actor.hp) {
          actor.trailHp = Math.max(actor.hp, actor.trailHp - 1.6);
        } else {
          actor.trailHp = actor.hp;
        }

        if (actor.comboTimer > 0) {
          actor.comboTimer -= 1;
          if (actor.comboTimer === 0) actor.combo = 0;
        }

        // Dash assist toward target
        if (actor.dashTargetX !== null && actor.hitstun <= 0) {
          const diff = opp.x - actor.x;
          const dist = Math.abs(diff);
          if (dist <= 16 && actor.pendingAttack) {
            const pending = actor.pendingAttack;
            actor.dashTargetX = null;
            actor.pendingAttack = null;
            startFighterMove(sim, actor.side, pending, false);
          } else {
            const stepDir = diff >= 0 ? 1 : -1;
            actor.x = Math.max(8, Math.min(92, actor.x + stepDir * 3.1));
            actor.state = 'walk';
            actor.stateTick += 1;
          }
        }

        // Vertical jump / Shoryuken gravity
        if (actor.y > 0 || actor.vy > 0) {
          actor.y += actor.vy;
          actor.vy -= 1.2;
          if (actor.y <= 0) {
            actor.y = 0;
            actor.vy = 0;
            if (actor.state === 'jump') actor.state = 'idle';
          }
        }

        if (actor.hitstun > 0) {
          actor.hitstun -= 1;
          if (actor.hitstun === 0 && actor.state === 'hit') {
            actor.state = 'idle';
          }
        }

        // Advance active move frame
        if (
          actor.state === 'jab' ||
          actor.state === 'heavy' ||
          actor.state === 'hadouken' ||
          actor.state === 'shoryuken' ||
          actor.state === 'guard' ||
          actor.state === 'taunt'
        ) {
          actor.stateTick += 1;

          // Active Hitbox Frames
          const dist = Math.abs(actor.x - opp.x);
          const heightDiff = Math.abs(actor.y - opp.y);

          if (actor.state === 'jab' && !actor.hitApplied && actor.stateTick >= 3) {
            actor.hitApplied = true;
            if (dist <= 17 && heightDiff < 55) {
              applyFighterHit(sim, actor, opp, 'jab', (actor.x + opp.x) / 2, 54 + opp.y);
            } else if (soundEnabledRef.current) {
              playDodgeSound();
            }
          } else if (actor.state === 'heavy' && !actor.hitApplied && actor.stateTick >= 6) {
            actor.hitApplied = true;
            if (dist <= 20 && heightDiff < 65) {
              applyFighterHit(sim, actor, opp, 'heavy', (actor.x + opp.x) / 2, 58 + opp.y);
            } else if (soundEnabledRef.current) {
              playDodgeSound();
            }
          } else if (actor.state === 'shoryuken' && !actor.hitApplied && actor.stateTick >= 4) {
            actor.hitApplied = true;
            if (dist <= 22) {
              applyFighterHit(sim, actor, opp, 'shoryuken', (actor.x + opp.x) / 2, 66 + opp.y);
            }
          } else if (actor.state === 'hadouken' && !actor.hitApplied && actor.stateTick >= 7) {
            actor.hitApplied = true;
            sim.projectiles.push({
              id: floatingIdCounter.current++,
              owner: actor.side,
              x: actor.x + actor.facing * 5,
              y: 44 + actor.y,
              vx: actor.facing * 2.4,
              damage: Math.round(20 + actor.officer.stats.force * 0.18),
              color: actor.side === 'left' ? '#38bdf8' : '#fb7185',
            });
          }

          if (actor.stateDuration > 0 && actor.stateTick >= actor.stateDuration) {
            actor.isParrying = false;
            actor.state = actor.y > 0 ? 'jump' : 'idle';
            actor.stateTick = 0;
          }
        }
      };

      stepFighter(sim.left, sim.right);
      stepFighter(sim.right, sim.left);

      // 4) Grounded auto-facing + soft body collision separation
      if (sim.left.y <= 1 && sim.right.y <= 1) {
        if (sim.left.x < sim.right.x) {
          sim.left.facing = 1;
          sim.right.facing = -1;
        } else {
          sim.left.facing = -1;
          sim.right.facing = 1;
        }
        const sep = Math.abs(sim.left.x - sim.right.x);
        if (sep < 8.5) {
          const push = (8.5 - sep) / 2;
          if (sim.left.x <= sim.right.x) {
            sim.left.x = Math.max(8, sim.left.x - push);
            sim.right.x = Math.min(92, sim.right.x + push);
          } else {
            sim.left.x = Math.min(92, sim.left.x + push);
            sim.right.x = Math.max(8, sim.right.x - push);
          }
        }
      }

      // 5) Advance Hadouken projectiles & check collisions
      const remainingProjectiles: ProjectileSim[] = [];
      for (const proj of sim.projectiles) {
        proj.x += proj.vx;
        if (proj.x < 2 || proj.x > 98) continue;

        // Clash with opposing projectile!
        const opposing = sim.projectiles.find(
          other => other.id !== proj.id && other.owner !== proj.owner && Math.abs(other.x - proj.x) < 4,
        );
        if (opposing) {
          spawnSparksAt(proj.x, proj.y, 14, true);
          continue;
        }

        const target = proj.owner === 'left' ? sim.right : sim.left;
        const owner = proj.owner === 'left' ? sim.left : sim.right;
        if (Math.abs(proj.x - target.x) < 6.5 && Math.abs(proj.y - (38 + target.y)) < 36) {
          applyFighterHit(sim, owner, target, 'hadouken', target.x, proj.y);
          continue;
        }
        remainingProjectiles.push(proj);
      }
      sim.projectiles = remainingProjectiles;

      // 6) Arcade 99s countdown timer (1 sec every 30 ticks)
      if (sim.tickCount % 30 === 0 && !sim.roundOver) {
        sim.clockSeconds = Math.max(0, sim.clockSeconds - 1);
        if (sim.clockSeconds === 0) {
          sim.roundOver = true;
          const leftPctRem = sim.left.hp / sim.left.maxHp;
          const rightPctRem = sim.right.hp / sim.right.maxHp;
          if (Math.abs(leftPctRem - rightPctRem) < 0.005) {
            setWinnerSide('draw');
            addLog('⏱️ TIME OVER！双方血量旗鼓相当，平局收场！');
            if (soundEnabledRef.current) playDefeatSound();
          } else {
            const winSide = leftPctRem > rightPctRem ? 'left' : 'right';
            setWinnerSide(winSide);
            const winName = winSide === 'left' ? sim.left.officer.name : sim.right.officer.name;
            addLog(`⏱️ TIME OVER！【${winName}】凭借更高余血获胜！`);
            if (soundEnabledRef.current) playVictorySound();
          }
        }
      }

      // Sync React visual snapshot & status cards
      setArenaSnap({
        left: { ...sim.left },
        right: { ...sim.right },
        projectiles: sim.projectiles.map(p => ({ ...p })),
        clockSeconds: sim.clockSeconds,
        hitstop: sim.hitstop,
      });

      if (sim.tickCount % 3 === 0 || sim.roundOver) {
        setLeftDuelist(prev =>
          prev
            ? {
                ...prev,
                hp: Math.round(sim.left.hp),
                rage: Math.round(sim.left.rage),
                isParrying: sim.left.isParrying,
              }
            : prev,
        );
        setRightDuelist(prev =>
          prev
            ? {
                ...prev,
                hp: Math.round(sim.right.hp),
                rage: Math.round(sim.right.rage),
                isParrying: sim.right.isParrying,
              }
            : prev,
        );
      }
    }, 33);

    return () => clearInterval(interval);
  }, [isFighting, winnerSide]);

  const resetDuel = () => {
    simRef.current = null;
    keysRef.current.clear();
    setIsFighting(false);
    setLeftDuelist(null);
    setRightDuelist(null);
    setArenaSnap(null);
    setBattleLogs([]);
    setWinnerSide(null);
    setLastTauntMsg({ left: '', right: '' });
    setSparkParticles([]);
    setDustPuffs([]);
    setClashImpact(null);
    setUltBanner(null);
    setStageShake('none');
  };

  const leftPct = leftDuelist ? (leftDuelist.hp / leftDuelist.maxHp) * 100 : 100;
  const rightPct = rightDuelist ? (rightDuelist.hp / rightDuelist.maxHp) * 100 : 100;

  return (
    <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col gap-6" id="duel-arena-main">
      {/* Absolute Ultimate Skill Flash Overlay */}
      <AnimatePresence>
        {showUltFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.85, 0.35, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 z-40 bg-gradient-to-r from-rose-600/30 via-amber-400/25 to-rose-600/30 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center border-b border-slate-900 pb-4">
        <div>
          <h2 className="text-xl font-serif font-black tracking-wider text-amber-500 flex items-center gap-2">
            <SwordIcon className="animate-pulse text-rose-500" size={20} />
            沙盘两军：巅峰武将阵前单挑竞技台
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            阵前武将单挑不仅彰显三军神威，更能让胜方统率狂揽士气，甚至直接在沙盘上俘虏敌国宿将！
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-300">
            {activeSeason.icon} {activeSeason.name} · {activeSeason.statSummary}
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-400 hover:text-slate-100 bg-slate-900 hover:bg-slate-850 cursor-pointer"
            >
              返回沙盘
            </button>
          )}
        </div>
      </div>

      {!isFighting ? (
        /* ================= SELECTION PHASE VIEW ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Left Selection (Span 5) */}
          <div className="lg:col-span-5 bg-slate-900/40 p-5 rounded-2xl border border-slate-900 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-widest block">
                【阵前主将 - 左单挑营{playerFactionName ? ` · ${playerFactionName}` : ''}】
              </label>
              {playerFactionId && (
                <span className="text-[11px] font-mono text-slate-500">
                  麾下 {myFactionOfficers.length} 位
                </span>
              )}
            </div>
            <select
              id="select-left-duelist"
              value={effectiveLeftId}
              disabled={myFactionOfficers.length === 0}
              onChange={(e) => setSelectedLeftId(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer disabled:opacity-50"
            >
              {myFactionOfficers.length === 0 ? (
                <option value="">当前所属阵营暂无可出战武将</option>
              ) : (
                myFactionOfficers.map(off => (
                  <option key={off.id} value={off.id}>{off.name} (武力: {off.stats.force} | 统帅: {off.stats.leadership})</option>
                ))
              )}
            </select>

            {/* Quick Preview of Left Officer */}
            {myFactionOfficers.length === 0 ? (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-center text-xs font-mono text-slate-500">
                当前所属阵营暂无可出战武将。
              </div>
            ) : myFactionOfficers.find(o => o.id === effectiveLeftId) && (
              (() => {
                const off = applySeasonalOfficerModifiers(myFactionOfficers.find(o => o.id === effectiveLeftId)!, seasonId);
                return (
                  <div className="flex gap-4 bg-slate-950 p-4 rounded-xl border border-slate-900">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-800 shrink-0">
                      <AvatarRenderer style={off.avatarStyle} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-black text-slate-200 text-sm leading-none">{off.name}</span>
                        {off.styleName && <span className="text-[10px] text-slate-500 font-mono">字{off.styleName}</span>}
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2.5 text-[10px] font-mono">
                        <div className="bg-slate-900 p-1.5 rounded text-center border border-slate-800/60 text-slate-450">
                          <span className="text-slate-500 block">武艺力</span>
                          <span className="font-bold text-amber-500">{off.stats.force}{off.statDeltas.force !== 0 ? ` (${off.statDeltas.force > 0 ? `+${off.statDeltas.force}` : off.statDeltas.force})` : ''}</span>
                        </div>
                        <div className="bg-slate-900 p-1.5 rounded text-center border border-slate-800/60 text-slate-450">
                          <span className="text-slate-500 block">统帅力</span>
                          <span className="font-bold text-teal-400">{off.stats.leadership}{off.statDeltas.leadership !== 0 ? ` (${off.statDeltas.leadership > 0 ? `+${off.statDeltas.leadership}` : off.statDeltas.leadership})` : ''}</span>
                        </div>
                        <div className="bg-slate-900 p-1.5 rounded text-center border border-slate-800/60 text-slate-450">
                          <span className="text-slate-500 block">极上智</span>
                          <span className="font-bold text-blue-400">{off.stats.intelligence}{off.statDeltas.intelligence !== 0 ? ` (${off.statDeltas.intelligence > 0 ? `+${off.statDeltas.intelligence}` : off.statDeltas.intelligence})` : ''}</span>
                        </div>
                      </div>
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {off.skills.slice(0, 2).map((sk, sidx) => (
                          <span key={sidx} className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-serif">{sk.split(' ')[0]}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
          </div>

          {/* Setup / Presets Controls (Span 2) */}
          <div className="lg:col-span-2 flex flex-col gap-4 justify-center items-center py-4">
            <span className="text-xl font-bold text-rose-500 animate-pulse">VS</span>
            
            {/* Play Modes Selection */}
            <div className="flex flex-col gap-1 w-full text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">对决演武模式</span>
              {[
                { id: 'player_vs_ai', name: '🕹️ 阵前亲征 (人机)' },
                { id: 'ai_vs_ai', name: '🤖 沙盘自动演义 (观战)' },
                { id: 'player_vs_player', name: '👥 双雄共演 (本地双人)' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setCombatType(mode.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-serif border transition-all cursor-pointer ${
                    combatType === mode.id 
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 font-bold shadow-inner' 
                      : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode.name}
                </button>
              ))}
            </div>

            {/* Duel Start Button */}
            <button
              onClick={startDuel}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-slate-100 font-serif font-black tracking-widest text-xs py-3.5 rounded-xl shadow-lg hover:shadow-red-500/10 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5 border border-red-500/30"
            >
              <Play size={13} fill="currentColor" />
              策马引兵，单挑决战！
            </button>
          </div>

          {/* Right Selection (Span 5) */}
          <div className="lg:col-span-5 bg-slate-900/40 p-5 rounded-2xl border border-slate-900 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-widest block">【阵前主将 - 右单挑营】</label>
              {anchorCityName && (
                <span className="text-[11px] font-mono text-slate-500">
                  {anchorCityName}及邻近 {rightCandidates.length} 位
                </span>
              )}
            </div>
            <select
              id="select-right-duelist"
              value={effectiveRightId}
              disabled={rightCandidates.length === 0}
              onChange={(e) => setSelectedRightId(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer disabled:opacity-50"
            >
              {rightCandidates.length === 0 ? (
                <option value="">当前城池及邻近城池暂无可出战武将</option>
              ) : (
                rightCandidates.map(off => {
                  const cityLabel = resolveOfficerCityName(off);
                  return (
                    <option key={off.id} value={off.id}>
                      {off.name}{cityLabel ? ` · ${cityLabel}` : ''} (武力: {off.stats.force} | 统帅: {off.stats.leadership})
                    </option>
                  );
                })
              )}
            </select>

            {/* Quick Preview of Right Officer */}
            {rightCandidates.length === 0 ? (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-center text-xs font-mono text-slate-500">
                当前城池及邻近城池暂无可出战武将。
              </div>
            ) : rightCandidates.find(o => o.id === effectiveRightId) && (
              (() => {
                const off = applySeasonalOfficerModifiers(rightCandidates.find(o => o.id === effectiveRightId)!, seasonId);
                return (
                  <div className="flex gap-4 bg-slate-950 p-4 rounded-xl border border-slate-900">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-800 shrink-0">
                      <AvatarRenderer style={off.avatarStyle} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-black text-slate-200 text-sm leading-none">{off.name}</span>
                        {off.styleName && <span className="text-[10px] text-slate-500 font-mono">字{off.styleName}</span>}
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2.5 text-[10px] font-mono">
                        <div className="bg-slate-900 p-1.5 rounded text-center border border-slate-800/60 text-slate-450">
                          <span className="text-slate-500 block">武艺力</span>
                          <span className="font-bold text-amber-500">{off.stats.force}{off.statDeltas.force !== 0 ? ` (${off.statDeltas.force > 0 ? `+${off.statDeltas.force}` : off.statDeltas.force})` : ''}</span>
                        </div>
                        <div className="bg-slate-900 p-1.5 rounded text-center border border-slate-800/60 text-slate-450">
                          <span className="text-slate-500 block">统帅力</span>
                          <span className="font-bold text-teal-400">{off.stats.leadership}{off.statDeltas.leadership !== 0 ? ` (${off.statDeltas.leadership > 0 ? `+${off.statDeltas.leadership}` : off.statDeltas.leadership})` : ''}</span>
                        </div>
                        <div className="bg-slate-900 p-1.5 rounded text-center border border-slate-800/60 text-slate-450">
                          <span className="text-slate-500 block">极上智</span>
                          <span className="font-bold text-blue-400">{off.stats.intelligence}{off.statDeltas.intelligence !== 0 ? ` (${off.statDeltas.intelligence > 0 ? `+${off.statDeltas.intelligence}` : off.statDeltas.intelligence})` : ''}</span>
                        </div>
                      </div>
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {off.skills.slice(0, 2).map((sk, sidx) => (
                          <span key={sidx} className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-serif">{sk.split(' ')[0]}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
          </div>

          {/* Preset Epic Historical Duels Footer (Span 12) */}
          <div className="lg:col-span-12 mt-2 pt-4 border-t border-slate-900">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-3">🔥 经典历史史诗单挑对局：一键演武</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {MATCHUPS.map((match, idx) => (
                <button
                  key={idx}
                  onClick={() => loadMatchup(match.leftName, match.rightName)}
                  className="bg-slate-900 hover:bg-slate-850 p-3 rounded-xl border border-slate-850 text-left text-xs font-serif transition-colors hover:border-amber-500/40 cursor-pointer flex flex-col gap-1 text-slate-300"
                >
                  <span className="font-bold text-amber-400">{match.name.split('：')[0]}</span>
                  <span className="text-[10px] text-slate-500 font-sans block">{match.name.split('：')[1]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ================= ACTIVE COMBAT ARENA VIEW ================= */
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Main Visual Fighting Panel (Left vs Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* LEFT DUELIST PANEL (Span 5) */}
            <div 
              className={`lg:col-span-5 bg-slate-900 border ${leftDuelist?.isParrying ? 'border-teal-500/40 ring-1 ring-teal-500/20' : 'border-slate-850'} p-5 rounded-2xl flex flex-col gap-4 relative transition-all duration-350 ${
                leftShake ? 'animate-shake' : ''
              }`}
            >
              {/* Turn indicator glow */}
              {currentTurn === 'left' && !winnerSide && (
                <div className="absolute inset-0 border border-amber-500/50 rounded-2xl animate-pulse pointer-events-none" />
              )}

              {/* Floating hit/healing text animation overlay */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none flex flex-col gap-1">
                <AnimatePresence>
                  {floatingText.filter(t => t.side === 'left').map(t => (
                    <motion.span
                      key={t.id}
                      initial={{ scale: 0.45, y: 16, opacity: 0 }}
                      animate={{ scale: t.tone === 'crit' ? 1.32 : 1.12, y: -28, opacity: 1 }}
                      exit={{ opacity: 0, y: -42 }}
                      transition={{ duration: 0.55, ease: 'easeOut' }}
                      className={`text-base md:text-lg font-serif font-black whitespace-nowrap bg-slate-950/95 px-2.5 py-0.5 rounded-lg border shadow-lg ${
                        t.tone === 'heal'
                          ? 'text-emerald-400 border-emerald-500/40'
                          : t.tone === 'miss'
                          ? 'text-slate-300 border-slate-600/50'
                          : t.tone === 'parry'
                          ? 'text-teal-300 border-teal-500/40'
                          : t.tone === 'rage'
                          ? 'text-sky-300 border-sky-500/40'
                          : t.tone === 'crit'
                          ? 'text-amber-300 border-amber-400/70 drop-shadow-[0_0_12px_rgba(251,191,36,0.65)]'
                          : 'text-rose-400 border-rose-500/40 drop-shadow-[0_0_10px_rgba(239,68,68,0.45)]'
                      }`}
                    >
                      {t.text}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>

              {/* Avatar and Info Header */}
              <div className="flex items-center gap-4">
                <div className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${currentTurn === 'left' ? 'border-amber-500' : 'border-slate-800'} relative shrink-0`}>
                  <AvatarRenderer style={leftDuelist!.officer.avatarStyle} />
                  
                  {/* Slash animation overlay line */}
                  {leftSlash && (
                    <motion.div 
                      initial={{ x: '-100%', y: '-100%' }}
                      animate={{ x: '100%', y: '100%' }}
                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-500 to-transparent w-[300%] h-[300%] pointer-events-none rotate-45 z-10"
                      style={{ borderLeft: '4px solid #ef4444' }}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <span className="text-base font-serif font-black text-slate-200">{leftDuelist!.officer.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono block">武力: <strong className="text-amber-500">{leftDuelist!.officer.stats.force}</strong> | 统率: {leftDuelist!.officer.stats.leadership}</span>
                    </div>
                    {leftDuelist!.isParrying && (
                      <span className="text-[9px] font-serif bg-teal-500/10 text-teal-400 border border-teal-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5"><Shield size={8} /> 招架防备中</span>
                    )}
                  </div>

                  {/* HP Health Bar */}
                  <div className="mt-3.5">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span className="flex items-center gap-0.5 font-bold"><Heart size={9.5} className="text-red-500" /> 元气精力 HP</span>
                      <span>{leftDuelist!.hp} / {leftDuelist!.maxHp} ({Math.round(leftPct)}%)</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-900">
                      <motion.div
                        initial={{ width: '100%' }}
                        animate={{ width: `${leftPct}%` }}
                        className={`h-full bg-gradient-to-r ${leftPct > 35 ? 'from-emerald-500 to-teal-500' : 'from-red-600 to-rose-600'}`}
                      />
                    </div>
                  </div>

                  {/* Rage / Power Bar */}
                  <div className="mt-2.5">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span className="flex items-center gap-0.5 font-bold text-amber-500"><Zap size={9.5} /> 狂怒斗气 Rage</span>
                      <span>{leftDuelist!.rage} / 100</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-900">
                      <motion.div
                        animate={{ width: `${leftDuelist!.rage}%` }}
                        className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION MENU AND ROUND DISPLAY (Span 2) */}
            <div className="lg:col-span-2 flex flex-col justify-center items-center py-4 gap-4 bg-slate-900/10 p-4 rounded-2xl border border-slate-900 min-h-[160px]">
              <div className="text-center font-serif">
                <span className="text-[10px] font-mono text-slate-500 tracking-widest block uppercase mb-1">演武对垒</span>
                <span className="text-lg font-black text-amber-400">第 {roundCount} 合</span>
                {!winnerSide && (
                  <span className="text-[9.5px] font-serif font-black px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 block mt-2 animate-pulse">
                    【{currentTurn === 'left' ? leftDuelist!.officer.name : rightDuelist!.officer.name}】出招
                  </span>
                )}
              </div>

              {/* Reset/Rematch Button when finished */}
              {winnerSide && (
                <div className="flex flex-col gap-2 w-full">
                  <button
                    onClick={resetDuel}
                    className="w-full bg-slate-900 hover:bg-slate-850 text-slate-200 py-2.5 rounded-xl text-xs font-serif border border-slate-800 transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw size={12} />
                    重整旗鼓 (重置)
                  </button>
                  <button
                    onClick={startDuel}
                    className="w-full bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs font-serif transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play size={12} fill="currentColor" />
                    再战一回合！
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT DUELIST PANEL (Span 5) */}
            <div 
              className={`lg:col-span-5 bg-slate-900 border ${rightDuelist?.isParrying ? 'border-teal-500/40 ring-1 ring-teal-500/20' : 'border-slate-850'} p-5 rounded-2xl flex flex-col gap-4 relative transition-all duration-350 ${
                rightShake ? 'animate-shake' : ''
              }`}
            >
              {/* Turn indicator glow */}
              {currentTurn === 'right' && !winnerSide && (
                <div className="absolute inset-0 border border-amber-500/50 rounded-2xl animate-pulse pointer-events-none" />
              )}

              {/* Floating hit/healing text animation overlay */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none flex flex-col gap-1">
                <AnimatePresence>
                  {floatingText.filter(t => t.side === 'right').map(t => (
                    <motion.span
                      key={t.id}
                      initial={{ scale: 0.45, y: 16, opacity: 0 }}
                      animate={{ scale: t.tone === 'crit' ? 1.32 : 1.12, y: -28, opacity: 1 }}
                      exit={{ opacity: 0, y: -42 }}
                      transition={{ duration: 0.55, ease: 'easeOut' }}
                      className={`text-base md:text-lg font-serif font-black whitespace-nowrap bg-slate-950/95 px-2.5 py-0.5 rounded-lg border shadow-lg ${
                        t.tone === 'heal'
                          ? 'text-emerald-400 border-emerald-500/40'
                          : t.tone === 'miss'
                          ? 'text-slate-300 border-slate-600/50'
                          : t.tone === 'parry'
                          ? 'text-teal-300 border-teal-500/40'
                          : t.tone === 'rage'
                          ? 'text-sky-300 border-sky-500/40'
                          : t.tone === 'crit'
                          ? 'text-amber-300 border-amber-400/70 drop-shadow-[0_0_12px_rgba(251,191,36,0.65)]'
                          : 'text-rose-400 border-rose-500/40 drop-shadow-[0_0_10px_rgba(239,68,68,0.45)]'
                      }`}
                    >
                      {t.text}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>

              {/* Avatar and Info Header */}
              <div className="flex items-center gap-4">
                <div className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${currentTurn === 'right' ? 'border-amber-500' : 'border-slate-800'} relative shrink-0`}>
                  <AvatarRenderer style={rightDuelist!.officer.avatarStyle} />
                  
                  {/* Slash animation overlay line */}
                  {rightSlash && (
                    <motion.div 
                      initial={{ x: '-100%', y: '-100%' }}
                      animate={{ x: '100%', y: '100%' }}
                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-500 to-transparent w-[300%] h-[300%] pointer-events-none rotate-45 z-10"
                      style={{ borderLeft: '4px solid #ef4444' }}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <span className="text-base font-serif font-black text-slate-200">{rightDuelist!.officer.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono block">武力: <strong className="text-amber-500">{rightDuelist!.officer.stats.force}</strong> | 统率: {rightDuelist!.officer.stats.leadership}</span>
                    </div>
                    {rightDuelist!.isParrying && (
                      <span className="text-[9px] font-serif bg-teal-500/10 text-teal-400 border border-teal-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5"><Shield size={8} /> 招架防备中</span>
                    )}
                  </div>

                  {/* HP Health Bar */}
                  <div className="mt-3.5">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span className="flex items-center gap-0.5 font-bold"><Heart size={9.5} className="text-red-500" /> 元气精力 HP</span>
                      <span>{rightDuelist!.hp} / {rightDuelist!.maxHp} ({Math.round(rightPct)}%)</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-900">
                      <motion.div
                        initial={{ width: '100%' }}
                        animate={{ width: `${rightPct}%` }}
                        className={`h-full bg-gradient-to-r ${rightPct > 35 ? 'from-emerald-500 to-teal-500' : 'from-red-600 to-rose-600'}`}
                      />
                    </div>
                  </div>

                  {/* Rage / Power Bar */}
                  <div className="mt-2.5">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span className="flex items-center gap-0.5 font-bold text-amber-500"><Zap size={9.5} /> 狂怒斗气 Rage</span>
                      <span>{rightDuelist!.rage} / 100</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-900">
                      <motion.div
                        animate={{ width: `${rightDuelist!.rage}%` }}
                        className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* ================= STREET FIGHTER 2D ARENA THEATER STAGE ================= */}
          <div
            ref={stageRef}
            className={`w-full bg-slate-950 border-2 border-slate-800 rounded-3xl h-80 md:h-96 overflow-hidden relative shadow-[inset_0_0_50px_rgba(0,0,0,0.85)] flex flex-col justify-between bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/35 via-slate-950 to-black z-10 ${
              stageShake === 'heavy' ? 'animate-shake-heavy' : stageShake === 'light' ? 'animate-shake' : ''
            }`}
            id="battle-theater-canvas"
          >
            {/* div:nth-of-type(1) — Dojo Perspective Backdrop + Arcade Health HUD */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
              {/* Dojo Roof Beams & Lantern Glow */}
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/75 via-slate-950/35 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-amber-950/45 via-stone-900/65 to-slate-900/20 border-t-2 border-amber-500/25" />
              <div
                className="absolute bottom-0 inset-x-0 h-20 opacity-20"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, transparent, transparent 46px, rgba(245,158,11,0.35) 47px, rgba(245,158,11,0.35) 48px)',
                }}
              />

              {/* Central Dojo Emblem */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 flex flex-col items-center">
                <Swords className="text-amber-500 scale-[2.6]" />
                <span className="text-[10px] font-mono tracking-[0.35em] text-amber-400 font-black mt-4 uppercase">
                  STREET DUEL · 虎牢武道馆
                </span>
              </div>

              {/* Top Street Fighter II/IV Style Arcade Health HUD */}
              {arenaSnap && (
                <div
                  data-testid="sf-arcade-hud"
                  className="absolute top-3 inset-x-4 md:inset-x-6 flex items-start justify-between gap-3 z-30"
                >
                  {/* P1 Health Bar (Drains from left outward toward center KO) */}
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[11px] font-serif font-black text-amber-200 px-1">
                      <span className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-mono font-black">
                          1P
                        </span>
                        {arenaSnap.left.officer.name}
                      </span>
                      <span className="text-amber-400 font-mono text-[10px]">
                        {winnerSide === 'left' ? '★ ' : ''}HP {Math.round(arenaSnap.left.hp)}
                      </span>
                    </div>
                    <div className="h-4 w-full bg-rose-950/90 border-2 border-slate-200/80 rounded-sm overflow-hidden relative shadow-lg">
                      {/* Delayed red trail bar */}
                      <div
                        style={{
                          width: `${Math.max(0, Math.min(100, (arenaSnap.left.trailHp / arenaSnap.left.maxHp) * 100))}%`,
                        }}
                        className="absolute right-0 inset-y-0 bg-rose-500 transition-[width] duration-150"
                      />
                      {/* Primary yellow health fill draining toward center */}
                      <div
                        style={{
                          width: `${Math.max(0, Math.min(100, (arenaSnap.left.hp / arenaSnap.left.maxHp) * 100))}%`,
                        }}
                        className="absolute right-0 inset-y-0 bg-gradient-to-l from-yellow-300 via-amber-400 to-amber-500"
                      />
                    </div>
                    {arenaSnap.left.combo >= 2 && (
                      <span className="text-xs font-mono font-black text-amber-300 tracking-wider drop-shadow self-start mt-0.5">
                        {arenaSnap.left.combo} HIT COMBO!
                      </span>
                    )}
                  </div>

                  {/* Center 99s Arcade KO Clock */}
                  <div className="shrink-0 flex flex-col items-center px-2 pt-0.5">
                    <span className="text-[8.5px] font-mono font-black tracking-widest text-rose-400 uppercase leading-none mb-0.5">
                      K.O.
                    </span>
                    <div
                      data-testid="sf-arcade-clock"
                      className="w-12 h-10 rounded-lg bg-slate-950/95 border-2 border-amber-400/80 flex items-center justify-center font-mono text-xl font-black text-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.4)]"
                    >
                      {String(arenaSnap.clockSeconds).padStart(2, '0')}
                    </div>
                  </div>

                  {/* P2 Health Bar (Drains from right outward toward center KO) */}
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[11px] font-serif font-black text-rose-200 px-1">
                      <span className="text-rose-400 font-mono text-[10px]">
                        HP {Math.round(arenaSnap.right.hp)}{winnerSide === 'right' ? ' ★' : ''}
                      </span>
                      <span className="flex items-center gap-1.5">
                        {arenaSnap.right.officer.name}
                        <span className="px-1.5 py-0.5 rounded bg-rose-500 text-slate-950 text-[9px] font-mono font-black">
                          2P
                        </span>
                      </span>
                    </div>
                    <div className="h-4 w-full bg-rose-950/90 border-2 border-slate-200/80 rounded-sm overflow-hidden relative shadow-lg">
                      <div
                        style={{
                          width: `${Math.max(0, Math.min(100, (arenaSnap.right.trailHp / arenaSnap.right.maxHp) * 100))}%`,
                        }}
                        className="absolute left-0 inset-y-0 bg-rose-500 transition-[width] duration-150"
                      />
                      <div
                        style={{
                          width: `${Math.max(0, Math.min(100, (arenaSnap.right.hp / arenaSnap.right.maxHp) * 100))}%`,
                        }}
                        className="absolute left-0 inset-y-0 bg-gradient-to-r from-yellow-300 via-amber-400 to-amber-500"
                      />
                    </div>
                    {arenaSnap.right.combo >= 2 && (
                      <span className="text-xs font-mono font-black text-rose-300 tracking-wider drop-shadow self-end mt-0.5">
                        {arenaSnap.right.combo} HIT COMBO!
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* div:nth-of-type(2) — Bottom Super Combo Bars & Martial Faction Standards */}
            {(() => {
              const leftFaction = leftDuelist ? getFactionLetter(leftDuelist.officer.name) : '群';
              const rightFaction = rightDuelist ? getFactionLetter(rightDuelist.officer.name) : '群';
              const p1Super = arenaSnap ? arenaSnap.left.rage : 0;
              const p2Super = arenaSnap ? arenaSnap.right.rage : 0;

              return (
                <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4">
                  {/* Subtle Faction Flags flanking middle background */}
                  <div className="flex justify-between items-center mt-14 px-2 opacity-40">
                    <span className="px-2 py-1 rounded border border-amber-500/40 bg-slate-900/80 font-serif text-xs font-black text-amber-300">
                      {leftFaction}阵营
                    </span>
                    <span className="px-2 py-1 rounded border border-rose-500/40 bg-slate-900/80 font-serif text-xs font-black text-rose-300">
                      {rightFaction}阵营
                    </span>
                  </div>

                  {/* Bottom Segmented SUPER COMBO Meters */}
                  <div
                    data-testid="sf-super-bars"
                    className="flex items-center justify-between gap-6 px-2 pb-0.5"
                  >
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-[9px] font-mono font-black tracking-widest text-sky-400 uppercase shrink-0">
                        SUPER {Math.round(p1Super)}%
                      </span>
                      <div className="flex-1 h-2 bg-slate-900/95 border border-sky-500/40 rounded-sm overflow-hidden">
                        <div
                          style={{ width: `${Math.min(100, p1Super)}%` }}
                          className={`h-full transition-[width] duration-75 ${
                            p1Super >= 50
                              ? 'bg-gradient-to-r from-sky-400 via-cyan-300 to-amber-300'
                              : 'bg-sky-500'
                          }`}
                        />
                      </div>
                    </div>

                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest shrink-0">
                      ARCADE SUPER METER
                    </span>

                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-900/95 border border-rose-500/40 rounded-sm overflow-hidden flex justify-end">
                        <div
                          style={{ width: `${Math.min(100, p2Super)}%` }}
                          className={`h-full transition-[width] duration-75 ${
                            p2Super >= 50
                              ? 'bg-gradient-to-l from-rose-400 via-orange-400 to-amber-300'
                              : 'bg-rose-500'
                          }`}
                        />
                      </div>
                      <span className="text-[9px] font-mono font-black tracking-widest text-rose-400 uppercase shrink-0">
                        {Math.round(p2Super)}% SUPER
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* div:nth-of-type(3) — Projectiles (Hadouken Energy Waves) & Footwork Dust Clouds */}
            <div className="absolute inset-0 pointer-events-none z-25">
              {arenaSnap?.projectiles.map(proj => (
                <div
                  key={proj.id}
                  data-testid="sf-hadouken-projectile"
                  style={{
                    left: `${proj.x}%`,
                    bottom: `${22 + proj.y}px`,
                    transform: `translateX(-50%) scaleX(${proj.vx >= 0 ? 1 : -1})`,
                  }}
                  className="absolute flex items-center"
                >
                  <div
                    style={{ backgroundColor: proj.color }}
                    className="w-8 h-3 rounded-l-full opacity-70 blur-[2px] -mr-2"
                  />
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      boxShadow: `0 0 18px 6px ${proj.color}`,
                    }}
                    className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center"
                  >
                    <div
                      style={{ backgroundColor: proj.color }}
                      className="w-4 h-4 rounded-full animate-pulse"
                    />
                  </div>
                </div>
              ))}

              <AnimatePresence>
                {dustPuffs.map(d => (
                  <motion.div
                    key={d.id}
                    initial={{ x: 0, y: 0, scale: 0.4, opacity: 0.7 }}
                    animate={{ x: d.vx, y: -14, scale: d.scale * 1.45, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.48, ease: 'easeOut' }}
                    style={{ left: `${d.xPct}%`, bottom: '20px' }}
                    className="absolute w-5 h-3 rounded-full bg-amber-200/30 blur-[2px]"
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* div:nth-of-type(4) — Hit Sparks, Clash Shockwaves, Super Cut-In & K.O. Overlays */}
            <div className="absolute inset-0 pointer-events-none z-35">
              {/* Super Cut-In Banner */}
              <AnimatePresence>
                {ultBanner && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0.2 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 1.15 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute inset-x-0 top-16 flex justify-center px-4"
                  >
                    <div className="bg-gradient-to-r from-transparent via-rose-950/95 to-transparent border-y border-amber-400/80 px-10 py-1.5 text-center shadow-[0_0_24px_rgba(245,158,11,0.45)]">
                      <span className="text-[10px] font-mono tracking-widest text-amber-300 block">
                        🔥 {ultBanner.officerName} · 升龙奥义发动
                      </span>
                      <strong className="text-base md:text-lg font-serif font-black tracking-widest text-amber-100">
                        『{ultBanner.moveName}』
                      </strong>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Arcade K.O.! Overlay */}
              {winnerSide && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="px-8 py-2.5 rounded-2xl bg-slate-950/90 border-2 border-amber-400 shadow-[0_0_32px_rgba(245,158,11,0.55)] text-center">
                    <span className="text-3xl md:text-4xl font-mono font-black tracking-[0.22em] text-amber-300 drop-shadow">
                      {winnerSide === 'draw' ? 'DRAW GAME' : 'K.O.!'}
                    </span>
                    <span className="block text-xs font-serif text-slate-200 mt-1">
                      {winnerSide === 'draw'
                        ? '势均力敌 · 平手收场'
                        : `${winnerSide === 'left' ? leftDuelist?.officer.name : rightDuelist?.officer.name} YOU WIN!`}
                    </span>
                  </div>
                </div>
              )}

              {/* Directional Clash Impact Ring */}
              <AnimatePresence>
                {clashImpact && (
                  <motion.div
                    key={clashImpact.id}
                    initial={{ opacity: 0, scale: 0.35 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: clashImpact.type === 'ultimate' ? [0.45, 1.45, 1.7] : [0.45, 1.05, 1.25],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.34, ease: 'easeOut' }}
                    style={{ left: `${clashImpact.xPct}%`, bottom: `${clashImpact.yPx}px` }}
                    className="absolute -translate-x-1/2 translate-y-1/2"
                  >
                    <svg width="110" height="110" viewBox="0 0 110 110" className="overflow-visible">
                      <circle
                        cx="55"
                        cy="55"
                        r={clashImpact.type === 'ultimate' ? 46 : 32}
                        fill="none"
                        stroke={
                          clashImpact.type === 'parry'
                            ? '#2dd4bf'
                            : clashImpact.crit || clashImpact.type === 'ultimate'
                            ? '#fbbf24'
                            : '#f87171'
                        }
                        strokeWidth={clashImpact.type === 'ultimate' ? 4 : 2.5}
                        strokeDasharray={clashImpact.type === 'parry' ? '6 5' : undefined}
                      />
                      {clashImpact.type !== 'parry' && (
                        <path
                          d={
                            clashImpact.direction === 'left-to-right'
                              ? 'M 18 90 Q 55 18 92 24'
                              : 'M 92 90 Q 55 18 18 24'
                          }
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                      )}
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Radial Impact Sparks */}
              {sparkParticles.map(p => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, scale: 1.15, opacity: 1 }}
                  animate={{ x: p.vx, y: p.vy, scale: 0.15, opacity: 0 }}
                  transition={{ duration: p.duration, ease: 'easeOut' }}
                  className="absolute rounded-full"
                  style={{
                    left: `${p.xPct}%`,
                    bottom: `${p.yPx}px`,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    backgroundColor: p.color,
                    boxShadow: `0 0 8px ${p.color}`,
                  }}
                />
              ))}
            </div>

            {/* div:nth-of-type(5) — STREET FIGHTER STAGE FIGHTER CONTAINERS */}
            <div
              data-testid="sf-fighter-stage"
              className="absolute inset-0 z-20 pointer-events-none"
            >
              {arenaSnap && (
                <>
                  <StreetFighterRig
                    fighter={arenaSnap.left}
                    side="left"
                    tauntMsg={lastTauntMsg.left}
                  />
                  <StreetFighterRig
                    fighter={arenaSnap.right}
                    side="right"
                    tauntMsg={lastTauntMsg.right}
                  />
                </>
              )}
            </div>
          </div>

          {/* Interactive Street Fighter Arcade Combat Deck */}
          <div className="bg-slate-950 p-4.5 rounded-2xl border border-slate-900 flex flex-col gap-3">
            {winnerSide ? (
              /* Winner State Announcement Banner */
              <div className="text-center py-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <span className="text-sm font-serif font-black text-amber-400 block tracking-widest flex items-center justify-center gap-1.5">
                  <Trophy className="text-amber-500 animate-bounce" size={16} />
                  🏆 三军见证！街头武道演武尘埃落定 🏆
                </span>
                <span className="text-xs text-slate-300 block mt-1.5 leading-relaxed max-w-lg mx-auto font-serif">
                  {winnerSide === 'draw'
                    ? '双方拳脚齐飞难分高下，战至钟响平局收场！'
                    : `${winnerSide === 'left' ? '1P 大捷！' : '2P 大捷！'}名将【${winnerSide === 'left' ? leftDuelist!.officer.name : rightDuelist!.officer.name}】凌厉连段击倒对手，赢得武道单挑大胜！`}
                </span>
              </div>
            ) : (
              (() => {
                const controlledSide = combatType === 'player_vs_player' ? currentTurn : 'left';
                const controlledFighter = controlledSide === 'left' ? leftDuelist : rightDuelist;
                const isAiOnly = combatType === 'ai_vs_ai';
                const superReady = (controlledFighter?.rage ?? 0) >= 50;

                return (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap justify-between items-center gap-2 text-xs font-mono text-slate-400">
                      <div className="flex items-center gap-2">
                        <span>
                          🕹️ 实时街机操控: 【{controlledFighter?.officer.name}】
                        </span>
                        {combatType === 'player_vs_player' && (
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => setCurrentTurn('left')}
                              className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer ${
                                currentTurn === 'left'
                                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                                  : 'bg-slate-900 border-slate-800 text-slate-500'
                              }`}
                            >
                              操控 1P
                            </button>
                            <button
                              type="button"
                              onClick={() => setCurrentTurn('right')}
                              className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer ${
                                currentTurn === 'right'
                                  ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                                  : 'bg-slate-900 border-slate-800 text-slate-500'
                              }`}
                            >
                              操控 2P
                            </button>
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {isAiOnly
                          ? '🤖 双方 AI 正在实时对轰博弈中...'
                          : combatType === 'player_vs_player'
                          ? '1P: WASD+JKLUI | 2P: 方向键+12345'
                          : '键盘: A/D 走位 · W 跳跃 · S 格挡 · J/K/L/U/I 出招'}
                      </span>
                    </div>

                    {/* Arcade D-Pad Movement & Guard Row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={isAiOnly}
                        onClick={() => stepMove(controlledSide, -1)}
                        onPointerDown={() => {
                          if (controlledSide === 'left') virtualHoldRef.current.leftMove = -1;
                          else virtualHoldRef.current.rightMove = -1;
                        }}
                        onPointerUp={() => {
                          if (controlledSide === 'left') virtualHoldRef.current.leftMove = 0;
                          else virtualHoldRef.current.rightMove = 0;
                        }}
                        onPointerLeave={() => {
                          if (controlledSide === 'left') virtualHoldRef.current.leftMove = 0;
                          else virtualHoldRef.current.rightMove = 0;
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 text-xs font-mono text-slate-200 cursor-pointer active:scale-95"
                      >
                        ◀ 后撤 [A]
                      </button>
                      <button
                        type="button"
                        disabled={isAiOnly}
                        onClick={() => executeAction('jump', controlledSide)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 text-xs font-mono text-slate-200 cursor-pointer active:scale-95"
                      >
                        ▲ 跃起 [W]
                      </button>
                      <button
                        type="button"
                        disabled={isAiOnly}
                        onClick={() => executeAction('parry', controlledSide)}
                        onPointerDown={() => {
                          if (controlledSide === 'left') virtualHoldRef.current.leftGuard = true;
                          else virtualHoldRef.current.rightGuard = true;
                        }}
                        onPointerUp={() => {
                          if (controlledSide === 'left') virtualHoldRef.current.leftGuard = false;
                          else virtualHoldRef.current.rightGuard = false;
                        }}
                        onPointerLeave={() => {
                          if (controlledSide === 'left') virtualHoldRef.current.leftGuard = false;
                          else virtualHoldRef.current.rightGuard = false;
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-teal-500/30 text-xs font-mono text-teal-300 cursor-pointer active:scale-95"
                      >
                        🛡️ 稳守格挡 [S]
                      </button>
                      <button
                        type="button"
                        disabled={isAiOnly}
                        onClick={() => stepMove(controlledSide, 1)}
                        onPointerDown={() => {
                          if (controlledSide === 'left') virtualHoldRef.current.leftMove = 1;
                          else virtualHoldRef.current.rightMove = 1;
                        }}
                        onPointerUp={() => {
                          if (controlledSide === 'left') virtualHoldRef.current.leftMove = 0;
                          else virtualHoldRef.current.rightMove = 0;
                        }}
                        onPointerLeave={() => {
                          if (controlledSide === 'left') virtualHoldRef.current.leftMove = 0;
                          else virtualHoldRef.current.rightMove = 0;
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 text-xs font-mono text-slate-200 cursor-pointer active:scale-95"
                      >
                        ▶ 突进 [D]
                      </button>
                    </div>

                    {/* Street Fighter Special & Normal Attack Buttons */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <button
                        type="button"
                        onClick={() => executeAction('slash', controlledSide)}
                        disabled={isAiOnly}
                        className="bg-slate-900 hover:bg-slate-850 disabled:opacity-45 text-slate-200 border border-slate-800 rounded-xl p-3 text-xs font-serif text-left transition hover:border-amber-500/40 active:scale-95 cursor-pointer flex flex-col gap-1"
                      >
                        <span className="font-bold text-amber-400 flex items-center justify-between gap-1">
                          <span>🥊 轻拳抢攻</span>
                          <kbd className="text-[9px] font-mono px-1 rounded bg-slate-800 text-slate-300">J</kbd>
                        </span>
                        <span className="text-[9.5px] text-slate-500 font-sans block leading-tight">
                          极速刺拳近身连打，自动突进补位。蓄Super 14。
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => executeAction('heavy', controlledSide)}
                        disabled={isAiOnly}
                        className="bg-slate-900 hover:bg-slate-850 disabled:opacity-45 text-slate-200 border border-slate-800 rounded-xl p-3 text-xs font-serif text-left transition hover:border-rose-500/40 active:scale-95 cursor-pointer flex flex-col gap-1"
                      >
                        <span className="font-bold text-rose-400 flex items-center justify-between gap-1">
                          <span>🦵 崩山重脚</span>
                          <kbd className="text-[9px] font-mono px-1 rounded bg-slate-800 text-slate-300">K</kbd>
                        </span>
                        <span className="text-[9.5px] text-slate-500 font-sans block leading-tight">
                          旋风重踢击退敌将，高硬直破防。蓄Super 22。
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => executeAction('hadouken', controlledSide)}
                        disabled={isAiOnly}
                        className="bg-slate-900 hover:bg-slate-850 disabled:opacity-45 text-slate-200 border border-slate-800 rounded-xl p-3 text-xs font-serif text-left transition hover:border-sky-500/40 active:scale-95 cursor-pointer flex flex-col gap-1"
                      >
                        <span className="font-bold text-sky-400 flex items-center justify-between gap-1">
                          <span>🔵 波动气功</span>
                          <kbd className="text-[9px] font-mono px-1 rounded bg-slate-800 text-slate-300">L</kbd>
                        </span>
                        <span className="text-[9.5px] text-slate-500 font-sans block leading-tight">
                          远程发射气功波横穿武道馆！蓄Super 15。
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => executeAction('ultimate', controlledSide)}
                        disabled={isAiOnly || !superReady}
                        className={`rounded-xl p-3 text-xs font-serif text-left transition flex flex-col gap-1 cursor-pointer border ${
                          superReady && !isAiOnly
                            ? 'bg-amber-500/10 hover:bg-amber-500/15 border-amber-500 text-amber-200 active:scale-95'
                            : 'bg-slate-900 border-slate-800 text-slate-500 opacity-50'
                        }`}
                      >
                        <span className="font-bold text-amber-400 flex items-center justify-between gap-1">
                          <span>🔥 升龙奥义</span>
                          <kbd className="text-[9px] font-mono px-1 rounded bg-slate-800 text-amber-300">U</kbd>
                        </span>
                        <span className="text-[9.5px] font-sans block leading-tight">
                          需 Super ≥ 50。无视格挡腾空升龙重创！
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => executeAction('taunt', controlledSide)}
                        disabled={isAiOnly}
                        className="bg-slate-900 hover:bg-slate-850 disabled:opacity-45 text-slate-200 border border-slate-800 rounded-xl p-3 text-xs font-serif text-left transition hover:border-amber-500/40 active:scale-95 cursor-pointer flex flex-col gap-1 col-span-2 md:col-span-1"
                      >
                        <span className="font-bold text-emerald-400 flex items-center justify-between gap-1">
                          <span>🗣️ 阵前嘲讽</span>
                          <kbd className="text-[9px] font-mono px-1 rounded bg-slate-800 text-slate-300">I</kbd>
                        </span>
                        <span className="text-[9.5px] text-slate-500 font-sans block leading-tight">
                          挑衅敌将削减其 Super 槽并自增 12 气力。
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })()
            )}
          </div>

          {/* Scrolling combat dialogue narrator log (Span 12) */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
              <Activity size={12} />
              两军沙盘阵前名将武技演武对局演义日志:
            </span>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 h-52 overflow-y-auto font-mono text-[11.5px] leading-relaxed space-y-1.5 scrollbar-thin">
              {battleLogs.map((log, idx) => {
                let colClass = 'text-slate-400';
                if (log.includes('💥') || log.includes('会心一击')) colClass = 'text-amber-400 font-bold';
                if (log.includes('🔥') || log.includes('狂怒神威')) colClass = 'text-rose-400 font-black';
                if (log.includes('🛡️')) colClass = 'text-teal-400';
                if (log.includes('📢') || log.includes('🏁')) colClass = 'text-sky-350 font-serif';
                if (log.includes('🎉')) colClass = 'text-emerald-400 font-bold';
                
                return (
                  <p key={idx} className={`${colClass} border-b border-slate-900/60 pb-1.5`}>
                    {log}
                  </p>
                );
              })}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
