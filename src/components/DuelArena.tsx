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

export default function DuelArena({ officers, playerFactionId, playerFactionName, currentCityId, soundEnabled, seasonId = 'spring', playClashSound, playDrumSound, onClose }: DuelArenaProps) {
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

  // Combat loop states
  const [isFighting, setIsFighting] = useState<boolean>(false);
  const [currentTurn, setCurrentTurn] = useState<'left' | 'right'>('left');
  const [roundCount, setRoundCount] = useState<number>(1);
  const [battleLogs, setBattleLogs] = useState<string[]>([]);
  
  // Dynamic status of duelists
  const [leftDuelist, setLeftDuelist] = useState<DuelistState | null>(null);
  const [rightDuelist, setRightDuelist] = useState<DuelistState | null>(null);

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

  // Animated fight states
  type DuelActionState = 'idle' | 'charging' | 'striking' | 'dodging' | 'parrying' | 'taunting' | 'hit' | 'dead';
  const [leftActionState, setLeftActionState] = useState<DuelActionState>('idle');
  const [rightActionState, setRightActionState] = useState<DuelActionState>('idle');
  const [isAnimatingAction, setIsAnimatingAction] = useState<boolean>(false);
  const [lastTauntMsg, setLastTauntMsg] = useState<{left: string; right: string}>({ left: '', right: '' });
  const [sparkParticles, setSparkParticles] = useState<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    duration: number;
    color: string;
  }[]>([]);
  const [dustPuffs, setDustPuffs] = useState<{
    id: number;
    side: 'left' | 'right';
    xPct: number;
    vx: number;
    scale: number;
  }[]>([]);
  const [clashImpact, setClashImpact] = useState<{
    id: number;
    type: 'slash' | 'heavy' | 'ultimate' | 'parry';
    crit: boolean;
    direction: 'left-to-right' | 'right-to-left';
  } | null>(null);
  const [ultBanner, setUltBanner] = useState<{
    officerName: string;
    moveName: string;
    side: 'left' | 'right';
  } | null>(null);
  const [stageShake, setStageShake] = useState<'none' | 'light' | 'heavy'>('none');

  const logEndRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const floatingIdCounter = useRef<number>(0);

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

  const spawnSparks = (side: 'left' | 'right', count = 18, intense = false) => {
    const centerOffset = side === 'left' ? -18 : 18;
    const palette = intense
      ? ['#fde047', '#f97316', '#ef4444', '#ffffff']
      : ['#fbbf24', '#f59e0b', '#ef4444'];
    const newParticles = Array.from({ length: count }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.45;
      const speed = (intense ? 90 : 55) + Math.random() * (intense ? 115 : 70);
      return {
        id: floatingIdCounter.current++ + Math.random(),
        x: centerOffset + (Math.random() * 24 - 12),
        y: Math.random() * 26 - 13,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 24,
        size: intense ? 4 + Math.random() * 5 : 3 + Math.random() * 3.5,
        duration: 0.55 + Math.random() * 0.35,
        color: palette[i % palette.length],
      };
    });
    setSparkParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      const ids = new Set(newParticles.map(p => p.id));
      setSparkParticles(prev => prev.filter(p => !ids.has(p.id)));
    }, 950);
  };

  const spawnDust = (side: 'left' | 'right') => {
    const puffs = Array.from({ length: 5 }).map((_, i) => ({
      id: floatingIdCounter.current++ + Math.random(),
      side,
      xPct: side === 'left' ? 16 + i * 5 : 84 - i * 5,
      vx: side === 'left' ? -(22 + Math.random() * 28) : 22 + Math.random() * 28,
      scale: 0.7 + Math.random() * 0.6,
    }));
    setDustPuffs(prev => [...prev, ...puffs]);
    setTimeout(() => {
      const ids = new Set(puffs.map(p => p.id));
      setDustPuffs(prev => prev.filter(p => !ids.has(p.id)));
    }, 650);
  };

  const triggerStageShake = (intensity: 'light' | 'heavy') => {
    setStageShake(intensity);
    setTimeout(() => setStageShake('none'), intensity === 'heavy' ? 540 : 440);
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

  // Combat loop initialization
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

    // Set Initial Duelist state with HP relative to Force, up to 370
    const leftMax = 150 + leftOfficer.stats.force * 2.2;
    const rightMax = 150 + rightOfficer.stats.force * 2.2;

    setLeftDuelist({
      officer: leftOfficer,
      hp: leftMax,
      maxHp: leftMax,
      rage: 0,
      isParrying: false,
      isTaunted: false,
      shieldValue: 0
    });

    setRightDuelist({
      officer: rightOfficer,
      hp: rightMax,
      maxHp: rightMax,
      rage: 0,
      isParrying: false,
      isTaunted: false,
      shieldValue: 0
    });

    setLeftActionState('idle');
    setRightActionState('idle');
    setIsAnimatingAction(false);
    setLastTauntMsg({ left: '', right: '' });
    setSparkParticles([]);
    setDustPuffs([]);
    setClashImpact(null);
    setUltBanner(null);
    setStageShake('none');

    setIsFighting(true);
    setRoundCount(1);
    setCurrentTurn(leftOfficer.stats.force >= rightOfficer.stats.force ? 'left' : 'right');
    setWinnerSide(null);
    setBattleLogs([
      `📢 阵前擂鼓！${activeSeason.icon} ${activeSeason.name}演武单挑战火燃起（${activeSeason.statSummary}）！`,
      `🏁 【${leftOfficer.name}】(武力 ${leftOfficer.stats.force}) 挺枪跃马入主阵左侧。`,
      `🏁 【${rightOfficer.name}】(武力 ${rightOfficer.stats.force}) 横刀跨坐，傲立校场右侧！`,
      `💡 根据武将敏捷与爆发，率先攻袭者为：【${leftOfficer.stats.force >= rightOfficer.stats.force ? leftOfficer.name : rightOfficer.name}】！`
    ]);
  };

  const executeAction = (action: 'slash' | 'heavy' | 'parry' | 'ultimate' | 'taunt') => {
    if (!leftDuelist || !rightDuelist || winnerSide || isAnimatingAction) return;

    setIsAnimatingAction(true);

    const attacker = currentTurn === 'left' ? leftDuelist : rightDuelist;
    const defender = currentTurn === 'left' ? rightDuelist : leftDuelist;
    const setAttacker = currentTurn === 'left' ? setLeftDuelist : setRightDuelist;
    const setDefender = currentTurn === 'left' ? setRightDuelist : setLeftDuelist;
    const setAttackerSlash = currentTurn === 'left' ? setLeftSlash : setRightSlash;
    const setDefenderShake = currentTurn === 'left' ? setRightShake : setLeftShake;
    const defenderSide = currentTurn === 'left' ? 'right' : 'left';
    const attackerSide = currentTurn === 'left' ? 'left' : 'right';

    const setAttackerAction = currentTurn === 'left' ? setLeftActionState : setRightActionState;
    const setDefenderAction = currentTurn === 'left' ? setRightActionState : setLeftActionState;

    let damage = 0;
    const hitRoll = Math.random() * 100;
    const criticalRoll = Math.random() * 100;
    let isHit = true;
    let isCrit = false;
    let actionLog = '';

    // Play synthesized sound effect via unified audio engine
    if (soundEnabled) {
      if (action === 'slash') playClashSound();
      else if (action === 'heavy') playHeavyImpactSound();
      else if (action === 'parry') playParrySound();
      else if (action === 'ultimate') playUltimateSound();
      else if (action === 'taunt') playTauntSound();
    }

    if (action === 'slash') {
      const acc = 85 + (attacker.officer.stats.force - defender.officer.stats.force) * 0.25;
      if (hitRoll > acc) {
        isHit = false;
      } else {
        const base = 20 + attacker.officer.stats.force * 0.18;
        damage = Math.floor(base * (1 - defender.officer.stats.force * 0.002) * (Math.random() * 0.3 + 0.85));
        if (criticalRoll < 12) {
          isCrit = true;
          damage = Math.floor(damage * 1.5);
        }
      }

      if (!isHit) {
        actionLog = `⚔️ 第${roundCount}合：[${attacker.officer.name}] 飞身一招横扫，却被 [${defender.officer.name}] 仰天铁板桥险险躲过！`;
      } else {
        actionLog = isCrit
          ? `⚡ 第${roundCount}合：💥会心一击！[${attacker.officer.name}] 刀法破空，悍然砍中 [${defender.officer.name}] 肩吞，撕开 【${damage}】 点重创！`
          : `⚔️ 第${roundCount}合：[${attacker.officer.name}] 急冲近前，错身战马，手中神兵轻取 [${defender.officer.name}] 侧肋，造成 【${damage}】 点伤害。`;
      }

      setAttacker(prev => {
        if (!prev) return null;
        return { ...prev, rage: Math.min(100, prev.rage + 18), isParrying: false };
      });
    } else if (action === 'heavy') {
      const acc = 60 + (attacker.officer.stats.force - defender.officer.stats.force) * 0.15;
      if (hitRoll > acc) {
        isHit = false;
      } else {
        const base = 40 + attacker.officer.stats.force * 0.32;
        damage = Math.floor(base * (1 - defender.officer.stats.force * 0.001) * (Math.random() * 0.4 + 0.8));
        if (criticalRoll < 20) {
          isCrit = true;
          damage = Math.floor(damage * 1.6);
        }
      }

      if (!isHit) {
        actionLog = `🪵 第${roundCount}合：[${attacker.officer.name}] 孤注一掷挥舞重兵狂砸，却因破绽过大，被 [${defender.officer.name}] 灵动闪到一旁！`;
      } else {
        actionLog = isCrit
          ? `💥 第${roundCount}合：🚨震天雷霆！[${attacker.officer.name}] 借战马奔袭狂澜之势劈山倒海，[${defender.officer.name}] 架挡不及，连人带马狂退，惨受 【${damage}】 点破骨重击！`
          : `🪵 第${roundCount}合：[${attacker.officer.name}] 沉腰运劲，巨力崩山的一劈当头砸落，直撄 [${defender.officer.name}] 面门，砸下 【${damage}】 点碎甲重创！`;
      }

      setAttacker(prev => {
        if (!prev) return null;
        return { ...prev, rage: Math.min(100, prev.rage + 25), isParrying: false };
      });
    } else if (action === 'parry') {
      const heal = Math.floor(15 + attacker.officer.stats.leadership * 0.15);
      actionLog = `🛡️ 第${roundCount}合：[${attacker.officer.name}] 凝神屏息，立刀护胸，使出绝学【稳守招架】，恢复了 【${heal}】 点元气与身形，防御大幅升腾！`;
      triggerFloatingText(`+${heal} 💖`, attackerSide, 'heal');
      setAttackerAction('parrying');
      setClashImpact({
        id: floatingIdCounter.current++,
        type: 'parry',
        crit: false,
        direction: currentTurn === 'left' ? 'left-to-right' : 'right-to-left',
      });
      setTimeout(() => setClashImpact(null), 420);

      setAttacker(prev => {
        if (!prev) return null;
        return {
          ...prev,
          hp: Math.min(prev.maxHp, prev.hp + heal),
          isParrying: true,
          rage: Math.min(100, prev.rage + 12)
        };
      });
    } else if (action === 'ultimate') {
      const ultName = getUltimateName(attacker.officer);
      setShowUltFlash(true);
      setUltBanner({ officerName: attacker.officer.name, moveName: ultName, side: attackerSide });
      setTimeout(() => setShowUltFlash(false), 750);
      setTimeout(() => setUltBanner(null), 900);

      const base = 55 + attacker.officer.stats.force * 0.45;
      damage = Math.floor(base * (Math.random() * 0.2 + 0.9));
      isCrit = true;

      actionLog = `🔥 第${roundCount}合：☄️【狂怒神威】！[${attacker.officer.name}] 仰天长啸，虎目怒睁，浑身杀意燃作滔天战火，挥舞绝世神兵祭出威震华夏之绝技『${ultName}』！[${defender.officer.name}] 躲避无门，直受狂涛骇浪般的 【${damage}】 点毁灭大创！`;

      setAttacker(prev => {
        if (!prev) return null;
        return { ...prev, rage: Math.max(0, prev.rage - 50), isParrying: false };
      });
    } else if (action === 'taunt') {
      const rageDrain = Math.floor(20 + attacker.officer.stats.charisma * 0.15);
      actionLog = `🗣️ 第${roundCount}合：[${attacker.officer.name}] 拍马伫立沙场，戟指狂笑，厉声喝骂！[${defender.officer.name}] 怒气上涌导致破绽丛生，其怒气值惨降了 【${rageDrain}】 点！`;
      triggerFloatingText(`怒气 -${rageDrain} 🌀`, defenderSide, 'rage');

      setAttackerAction('taunting');
      const randomQuote = TAUNT_QUOTES[Math.floor(Math.random() * TAUNT_QUOTES.length)];
      setLastTauntMsg(prev => ({ ...prev, [currentTurn]: randomQuote }));
      setTimeout(() => {
        setLastTauntMsg(prev => ({ ...prev, [currentTurn]: '' }));
      }, 2100);
      setTimeout(() => {
        setAttackerAction('idle');
      }, 650);

      setDefender(prev => {
        if (!prev) return null;
        return { ...prev, rage: Math.max(0, prev.rage - rageDrain) };
      });
      setAttacker(prev => {
        if (!prev) return null;
        return { ...prev, rage: Math.min(100, prev.rage + 15), isParrying: false };
      });
    }

    // Resolve Parry damage reduction BEFORE floating badge & HP subtraction
    let parriedAmount = 0;
    if (damage > 0 && defender.isParrying) {
      parriedAmount = Math.floor(damage * 0.55);
      damage = damage - parriedAmount;
      actionLog += ` (🛡️ 因稳招化劲，抵免了 ${parriedAmount} 点伤害！)`;
    }

    // Sequence visual combat choreography cleanly
    const isAttackMove = action === 'slash' || action === 'heavy' || action === 'ultimate';
    const chargeDelay = action === 'ultimate' ? 280 : 180;
    const resolveDelay = action === 'ultimate' ? 760 : isAttackMove ? 560 : 420;

    if (isAttackMove) {
      setAttackerAction('charging');
      spawnDust(attackerSide);

      setTimeout(() => {
        setAttackerAction('striking');
        setAttackerSlash(true);
        setTimeout(() => setAttackerSlash(false), 450);

        if (!isHit) {
          setDefenderAction('dodging');
          triggerFloatingText('闪避 MISS', defenderSide, 'miss');
          if (soundEnabled) playDodgeSound();
          setTimeout(() => {
            setDefenderAction(defender.isParrying ? 'parrying' : 'idle');
          }, 420);
        } else {
          setDefenderAction(parriedAmount > 0 ? 'parrying' : 'hit');
          setDefenderShake(true);
          setTimeout(() => setDefenderShake(false), 450);

          spawnSparks(defenderSide, action === 'ultimate' ? 28 : action === 'heavy' || isCrit ? 22 : 16, action === 'ultimate' || action === 'heavy' || isCrit);
          setClashImpact({
            id: floatingIdCounter.current++,
            type: action === 'ultimate' ? 'ultimate' : action === 'heavy' ? 'heavy' : 'slash',
            crit: isCrit,
            direction: currentTurn === 'left' ? 'left-to-right' : 'right-to-left',
          });
          setTimeout(() => setClashImpact(null), 480);

          if (action === 'ultimate' || action === 'heavy' || isCrit) {
            triggerStageShake('heavy');
          } else {
            triggerStageShake('light');
          }

          if (parriedAmount > 0) {
            triggerFloatingText(`-${damage} 🛡️格挡`, defenderSide, 'parry');
          } else if (isCrit) {
            triggerFloatingText(`-${damage} 🔥 会心!`, defenderSide, 'crit');
          } else {
            triggerFloatingText(`-${damage} ⚔️`, defenderSide, 'hit');
          }

          setDefender(prev => {
            if (!prev) return null;
            const newHp = Math.max(0, prev.hp - damage);
            return { ...prev, hp: newHp, rage: Math.min(100, prev.rage + Math.floor(damage * 0.4)) };
          });

          setTimeout(() => {
            setDefenderAction(prev => (prev === 'dead' ? 'dead' : defender.isParrying ? 'parrying' : 'idle'));
          }, action === 'ultimate' ? 540 : 420);
        }
      }, chargeDelay);

      setTimeout(() => {
        setAttackerAction(prev => (prev === 'dead' ? 'dead' : 'idle'));
      }, resolveDelay - 40);
    }

    addLog(actionLog);

    const checkWinLose = (leftCurrentHp: number, rightCurrentHp: number) => {
      if (leftCurrentHp <= 0 && rightCurrentHp <= 0) {
        addLog('⚖️ 战况惊烈！两大巅峰武圣拼尽余力对戳，同坠马下，竟成平手不分轩轾！');
        setWinnerSide('draw');
        setLeftActionState('dead');
        setRightActionState('dead');
        if (soundEnabled) playDefeatSound();
        return true;
      }
      if (rightCurrentHp <= 0) {
        addLog(`🎉 大捷！左侧名将 【${leftDuelist?.officer.name}】 绝尘凯旋，将 【${rightDuelist?.officer.name}】 震落马下，赢得演武大胜！`);
        setWinnerSide('left');
        setRightActionState('dead');
        if (soundEnabled) playVictorySound();
        return true;
      }
      if (leftCurrentHp <= 0) {
        addLog(`🎉 大捷！右侧名将 【${rightDuelist?.officer.name}】 怒吼震天，横戟挑落 【${leftDuelist?.officer.name}】 首级铠吞，夺得大胜！`);
        setWinnerSide('right');
        setLeftActionState('dead');
        if (soundEnabled) playVictorySound();
        return true;
      }
      return false;
    };

    // Resolve turn transition strictly after the clash animation finishes
    setTimeout(() => {
      setIsAnimatingAction(false);
      setLeftDuelist(curLeft => {
        setRightDuelist(curRight => {
          if (!curLeft || !curRight) return curRight;

          const isGameOver = checkWinLose(curLeft.hp, curRight.hp);
          if (!isGameOver) {
            const nextSide = currentTurn === 'left' ? 'right' : 'left';
            setCurrentTurn(nextSide);
            setRoundCount(prev => prev + 1);
          }
          return curRight;
        });
        return curLeft;
      });
    }, resolveDelay);
  };

  // Automated AI simulation ticker
  useEffect(() => {
    if (!isFighting || winnerSide || isAnimatingAction) return;

    // AI controls right turn if not player_vs_player, AI controls left turn if ai_vs_ai
    const isLeftAi = combatType === 'ai_vs_ai';
    const isRightAi = combatType !== 'player_vs_player';

    if ((currentTurn === 'left' && isLeftAi) || (currentTurn === 'right' && isRightAi)) {
      const timer = setTimeout(() => {
        const actor = currentTurn === 'left' ? leftDuelist : rightDuelist;
        const opp = currentTurn === 'left' ? rightDuelist : leftDuelist;
        if (!actor || !opp) return;

        // Smart decision tree based on HP and Rage
        if (actor.rage >= 50) {
          executeAction('ultimate');
        } else if (actor.hp < actor.maxHp * 0.35 && Math.random() < 0.45) {
          executeAction('parry');
        } else if (opp.rage >= 50 && Math.random() < 0.4) {
          // Prevent ultimate damage by parrying!
          executeAction('parry');
        } else if (Math.random() < 0.35 && opp.rage > 30) {
          executeAction('taunt');
        } else if (Math.random() < 0.45) {
          executeAction('heavy');
        } else {
          executeAction('slash');
        }
      }, 850);

      return () => clearTimeout(timer);
    }
  }, [isFighting, currentTurn, leftDuelist, rightDuelist, winnerSide, combatType, isAnimatingAction]);

  const resetDuel = () => {
    setIsFighting(false);
    setLeftDuelist(null);
    setRightDuelist(null);
    setBattleLogs([]);
    setWinnerSide(null);
    setLeftActionState('idle');
    setRightActionState('idle');
    setIsAnimatingAction(false);
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
          
          {/* ================= FIGHTING ARENA THEATER STAGE ================= */}
          <div
            ref={stageRef}
            className={`w-full bg-slate-950 border border-slate-900 rounded-3xl h-72 md:h-80 overflow-hidden relative shadow-inner flex flex-col justify-between p-4 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-950/25 via-slate-950 to-black z-10 ${
              stageShake === 'heavy' ? 'animate-shake-heavy' : stageShake === 'light' ? 'animate-shake' : ''
            }`}
            id="battle-theater-canvas"
          >
            {/* Background Atmosphere Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
              {/* Arena Horizon & Ground Perspective */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-amber-950/20 via-slate-900/30 to-transparent border-t border-slate-800/50 z-0" />
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[78%] h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

              {/* Waving Castle/Camp Battlements Silhouette */}
              <div className="absolute bottom-16 inset-x-0 h-1 flex justify-around opacity-20">
                <div className="w-4 h-8 bg-slate-800 rounded-t-sm" />
                <div className="w-4 h-8 bg-slate-800 rounded-t-sm" />
                <div className="w-4 h-8 bg-slate-800 rounded-t-sm" />
                <div className="w-4 h-8 bg-slate-800 rounded-t-sm" />
              </div>

              {/* Floating dust/wind streaks */}
              <motion.div
                animate={{ x: ['100%', '-100%'] }}
                transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                className="absolute inset-y-0 w-64 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent pointer-events-none rotate-12"
              />
              <motion.div
                animate={{ x: ['120%', '-80%'] }}
                transition={{ repeat: Infinity, duration: 18, ease: 'linear', delay: 4 }}
                className="absolute inset-y-0 w-48 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent pointer-events-none -rotate-12"
              />

              {/* Central Glowing Battlefield Seal */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 flex flex-col items-center">
                <Swords className="text-amber-500 scale-[2.5]" />
                <span className="text-[10px] font-mono tracking-widest text-amber-500 font-bold mt-4 uppercase">虎牢演武擂</span>
              </div>
            </div>

            {/* Ultimate Cut-In Banner */}
            <AnimatePresence>
              {ultBanner && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0.2 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 1.15 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="absolute inset-x-0 top-6 z-40 pointer-events-none flex justify-center px-4"
                >
                  <div className="bg-gradient-to-r from-transparent via-rose-950/95 to-transparent border-y border-amber-400/70 px-10 py-2 text-center shadow-[0_0_24px_rgba(245,158,11,0.35)]">
                    <span className="text-[10px] font-mono tracking-widest text-amber-300 block">
                      🔥 {ultBanner.officerName} · 无双奥义发动
                    </span>
                    <strong className="text-base md:text-lg font-serif font-black tracking-widest text-amber-100">
                      『{ultBanner.moveName}』
                    </strong>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Left/Right Military Standards (Faction Flags) */}
            {(() => {
              const leftFaction = leftDuelist ? getFactionLetter(leftDuelist.officer.name) : '群';
              const rightFaction = rightDuelist ? getFactionLetter(rightDuelist.officer.name) : '群';

              const flagStyles = {
                '蜀': 'from-emerald-900 to-teal-950 border-emerald-600/50 text-emerald-300',
                '魏': 'from-blue-900 to-indigo-950 border-blue-600/50 text-blue-300',
                '吴': 'from-rose-900 to-red-950 border-rose-600/50 text-rose-300',
                '群': 'from-amber-900 to-orange-950 border-amber-600/50 text-amber-300'
              };

              return (
                <div className="absolute inset-0 pointer-events-none flex justify-between px-6 py-8 z-10">
                  <motion.div
                    animate={{ rotate: [-2, 2, -2], y: [0, 2, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                    className="flex flex-col items-center origin-bottom"
                  >
                    <div className="w-1 h-32 bg-slate-800 rounded-full relative shadow-lg">
                      <div className={`absolute top-2 left-1/2 w-8 h-12 bg-gradient-to-b ${flagStyles[leftFaction as keyof typeof flagStyles]} border rounded-r-lg shadow-md p-1 flex flex-col justify-center items-center font-serif font-black text-xs leading-none select-none`}>
                        {leftFaction}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ rotate: [2, -2, 2], y: [0, 2, 0] }}
                    transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
                    className="flex flex-col items-center origin-bottom"
                  >
                    <div className="w-1 h-32 bg-slate-800 rounded-full relative shadow-lg">
                      <div className={`absolute top-2 right-1/2 w-8 h-12 bg-gradient-to-b ${flagStyles[rightFaction as keyof typeof flagStyles]} border rounded-l-lg shadow-md p-1 flex flex-col justify-center items-center font-serif font-black text-xs leading-none select-none`}>
                        {rightFaction}
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })()}

            {/* Gallop Dust Clouds */}
            <div className="absolute inset-x-0 bottom-8 h-16 pointer-events-none z-15">
              <AnimatePresence>
                {dustPuffs.map(d => (
                  <motion.div
                    key={d.id}
                    initial={{ x: 0, y: 0, scale: 0.4, opacity: 0.7 }}
                    animate={{ x: d.vx, y: -14, scale: d.scale * 1.45, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    style={{ left: `${d.xPct}%`, bottom: '6px' }}
                    className="absolute w-5 h-3 rounded-full bg-amber-200/25 blur-[2px]"
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Central Clash Shockwave & Cross-Slash Arcs */}
            <AnimatePresence>
              {clashImpact && (
                <motion.div
                  key={clashImpact.id}
                  initial={{ opacity: 0, scale: 0.35 }}
                  animate={{ opacity: [0, 1, 0], scale: clashImpact.type === 'ultimate' ? [0.45, 1.55, 1.85] : [0.45, 1.15, 1.35] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: clashImpact.type === 'ultimate' ? 0.5 : 0.38, ease: 'easeOut' }}
                  className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
                >
                  <svg width="160" height="160" viewBox="0 0 160 160" className="overflow-visible">
                    {/* Expanding Shockwave Ring */}
                    <circle
                      cx="80"
                      cy="80"
                      r={clashImpact.type === 'ultimate' ? 62 : 44}
                      fill="none"
                      stroke={clashImpact.type === 'parry' ? '#2dd4bf' : clashImpact.crit || clashImpact.type === 'ultimate' ? '#fbbf24' : '#f87171'}
                      strokeWidth={clashImpact.type === 'ultimate' ? 4 : 2.5}
                      strokeDasharray={clashImpact.type === 'parry' ? '8 6' : undefined}
                      opacity="0.9"
                    />
                    {clashImpact.type !== 'parry' && (
                      <>
                        {/* Primary Slash Crescent */}
                        <path
                          d={
                            clashImpact.direction === 'left-to-right'
                              ? 'M 25 125 Q 75 25 138 30'
                              : 'M 135 125 Q 85 25 22 30'
                          }
                          fill="none"
                          stroke={clashImpact.type === 'ultimate' ? '#fde047' : '#ffffff'}
                          strokeWidth={clashImpact.type === 'ultimate' ? 7 : clashImpact.type === 'heavy' ? 5.5 : 4}
                          strokeLinecap="round"
                        />
                        {/* Secondary Cross Slash on Heavy/Crit/Ultimate */}
                        {(clashImpact.crit || clashImpact.type === 'heavy' || clashImpact.type === 'ultimate') && (
                          <path
                            d={
                              clashImpact.direction === 'left-to-right'
                                ? 'M 32 32 Q 82 78 130 132'
                                : 'M 128 32 Q 78 78 30 132'
                            }
                            fill="none"
                            stroke="#fb7185"
                            strokeWidth={clashImpact.type === 'ultimate' ? 5 : 3.5}
                            strokeLinecap="round"
                          />
                        )}
                      </>
                    )}
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Spark Collision Particles overlay (deterministic radial bursts) */}
            <div className="absolute inset-0 pointer-events-none z-30">
              {sparkParticles.map(p => (
                <motion.div
                  key={p.id}
                  initial={{ x: `calc(50% + ${p.x}px)`, y: `calc(54% + ${p.y}px)`, scale: 1.15, opacity: 1 }}
                  animate={{
                    x: `calc(50% + ${p.x + p.vx}px)`,
                    y: `calc(54% + ${p.y + p.vy}px)`,
                    scale: 0.15,
                    opacity: 0
                  }}
                  transition={{ duration: p.duration, ease: "easeOut" }}
                  className="absolute rounded-full"
                  style={{
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    backgroundColor: p.color,
                    boxShadow: `0 0 8px ${p.color}`
                  }}
                />
              ))}
            </div>

            {/* ================= STAGE FIGHTER CONTAINERS ================= */}
            {leftDuelist && rightDuelist && (() => {
              const stageWidth = stageRef.current?.clientWidth ?? 640;
              const chargeDist = Math.round(Math.min(175, stageWidth * 0.22));
              const strikeDist = Math.round(Math.min(245, stageWidth * 0.31));

              return (
                <div className="absolute inset-0 flex items-end justify-between px-8 md:px-16 pb-9 z-20">
                  {/* LEFT ANIMATED COMBATANT */}
                  <motion.div
                    animate={
                      leftActionState === 'charging' ? { x: chargeDist, y: -8, rotate: 9, scale: 1.04 } :
                      leftActionState === 'striking' ? { x: strikeDist, y: -16, rotate: -8, scale: 1.1 } :
                      leftActionState === 'dodging' ? { x: -34, y: -12, rotate: -14, opacity: 0.72 } :
                      leftActionState === 'parrying' ? { x: -8, y: 0, rotate: -3, scale: 1.02 } :
                      leftActionState === 'taunting' ? { x: 14, y: -20, rotate: [0, -5, 5, 0] } :
                      leftActionState === 'hit' ? { x: -36, y: 8, rotate: -16, scale: 0.96 } :
                      leftActionState === 'dead' ? { x: -45, y: 46, rotate: -86, opacity: 0.45 } :
                      { x: 0, y: [0, -3, 0], rotate: 0, scale: 1, opacity: 1 }
                    }
                    transition={
                      leftActionState === 'charging' ? { duration: 0.18, ease: "easeOut" } :
                      leftActionState === 'striking' ? { type: "spring", stiffness: 380, damping: 20 } :
                      leftActionState === 'dodging' ? { duration: 0.16, ease: "easeOut" } :
                      leftActionState === 'hit' ? { duration: 0.18, ease: "easeOut" } :
                      leftActionState === 'idle' ? { y: { repeat: Infinity, duration: 1.6, ease: "easeInOut" }, x: { duration: 0.24 } } :
                      { duration: 0.3 }
                    }
                    className="relative flex flex-col items-center"
                  >
                    {/* Left Taunt Speech Bubble */}
                    <AnimatePresence>
                      {lastTauntMsg.left && (
                        <motion.div
                          initial={{ scale: 0.4, opacity: 0, y: 15 }}
                          animate={{ scale: 1, opacity: 1, y: -5 }}
                          exit={{ scale: 0.4, opacity: 0 }}
                          className="absolute bottom-28 left-0 z-30 bg-slate-900/95 border border-amber-500/40 text-slate-100 px-3 py-1.5 rounded-2xl rounded-bl-none text-[10.5px] font-serif leading-tight whitespace-nowrap shadow-xl"
                        >
                          <span className="text-amber-400 block font-bold mb-0.5">🗣️ 阵前嘲讽：</span>
                          {lastTauntMsg.left}
                          <div className="absolute -bottom-1.5 left-2 w-3 h-3 bg-slate-900 border-r border-b border-amber-500/40 transform rotate-45" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Parry Shield Aura bubble */}
                    {leftActionState === 'parrying' && (
                      <motion.div
                        animate={{ scale: [1, 1.12, 1], opacity: [0.55, 0.9, 0.55] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        className="absolute inset-0 -m-3 border-2 border-dashed border-teal-400 rounded-full pointer-events-none z-15 flex items-center justify-center bg-teal-500/10 shadow-[0_0_18px_rgba(45,212,191,0.3)]"
                      />
                    )}

                    {/* Left Officer Polearm / Glaive Weapon + Crescent Trail */}
                    <motion.div
                      animate={
                        leftActionState === 'striking' ? { rotate: [-35, 58, -10], scale: 1.18 } :
                        leftActionState === 'charging' ? { rotate: -22, x: 4 } :
                        leftActionState === 'parrying' ? { rotate: -65, x: 6, y: -8 } :
                        { rotate: 6, scale: 1 }
                      }
                      transition={{ duration: 0.24, ease: "easeOut" }}
                      className="absolute -right-14 bottom-5 w-20 h-10 origin-left pointer-events-none z-20 flex items-center"
                    >
                      <svg width="82" height="36" viewBox="0 0 82 36" className="overflow-visible drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                        <line x1="0" y1="20" x2="58" y2="20" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />
                        <path d="M54 14 Q74 10 80 20 Q68 26 54 22 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.2" />
                        <path d="M52 20 Q48 27 44 29" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" fill="none" />
                        {leftSlash && (
                          <path d="M40 2 Q78 8 74 34" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.85" />
                        )}
                      </svg>
                    </motion.div>

                    {/* Character Avatar base */}
                    <div className={`w-16 h-16 rounded-2xl overflow-hidden border-2 ${currentTurn === 'left' ? 'border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.45)]' : 'border-slate-800'} relative bg-slate-900 shrink-0 z-10`}>
                      {leftActionState === 'hit' && (
                        <motion.div
                          initial={{ opacity: 0.85 }}
                          animate={{ opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className="absolute inset-0 bg-rose-500/60 z-20"
                        />
                      )}
                      <AvatarRenderer style={leftDuelist.officer.avatarStyle} />
                    </div>

                    {/* Horse riding base */}
                    <motion.div
                      animate={
                        leftActionState === 'charging' || leftActionState === 'striking'
                          ? { rotate: [-4, 4, -4], y: [0, -3, 0] }
                          : { rotate: 0, y: 0 }
                      }
                      transition={{ duration: 0.22, repeat: leftActionState === 'charging' ? Infinity : 0 }}
                      className="relative mt-1 text-center shrink-0 z-10 select-none pointer-events-none flex flex-col items-center"
                    >
                      <span className="text-[22px] scale-x-[-1] filter drop-shadow">🐎</span>
                      <span className="text-[9px] font-serif font-black bg-slate-950/90 border border-slate-800 px-1.5 py-0.5 rounded text-amber-500 block -mt-1">{leftDuelist.officer.name}</span>
                    </motion.div>

                    {/* Bottom shadow */}
                    <div className="w-14 h-2.5 bg-black/55 rounded-full filter blur-[2px] absolute -bottom-1 z-0" />
                  </motion.div>

                  {/* RIGHT ANIMATED COMBATANT */}
                  <motion.div
                    animate={
                      rightActionState === 'charging' ? { x: -chargeDist, y: -8, rotate: -9, scale: 1.04 } :
                      rightActionState === 'striking' ? { x: -strikeDist, y: -16, rotate: 8, scale: 1.1 } :
                      rightActionState === 'dodging' ? { x: 34, y: -12, rotate: 14, opacity: 0.72 } :
                      rightActionState === 'parrying' ? { x: 8, y: 0, rotate: 3, scale: 1.02 } :
                      rightActionState === 'taunting' ? { x: -14, y: -20, rotate: [0, 5, -5, 0] } :
                      rightActionState === 'hit' ? { x: 36, y: 8, rotate: 16, scale: 0.96 } :
                      rightActionState === 'dead' ? { x: 45, y: 46, rotate: 86, opacity: 0.45 } :
                      { x: 0, y: [0, -3, 0], rotate: 0, scale: 1, opacity: 1 }
                    }
                    transition={
                      rightActionState === 'charging' ? { duration: 0.18, ease: "easeOut" } :
                      rightActionState === 'striking' ? { type: "spring", stiffness: 380, damping: 20 } :
                      rightActionState === 'dodging' ? { duration: 0.16, ease: "easeOut" } :
                      rightActionState === 'hit' ? { duration: 0.18, ease: "easeOut" } :
                      rightActionState === 'idle' ? { y: { repeat: Infinity, duration: 1.6, ease: "easeInOut", delay: 0.2 }, x: { duration: 0.24 } } :
                      { duration: 0.3 }
                    }
                    className="relative flex flex-col items-center"
                  >
                    {/* Right Taunt Speech Bubble */}
                    <AnimatePresence>
                      {lastTauntMsg.right && (
                        <motion.div
                          initial={{ scale: 0.4, opacity: 0, y: 15 }}
                          animate={{ scale: 1, opacity: 1, y: -5 }}
                          exit={{ scale: 0.4, opacity: 0 }}
                          className="absolute bottom-28 right-0 z-30 bg-slate-900/95 border border-amber-500/40 text-slate-100 px-3 py-1.5 rounded-2xl rounded-br-none text-[10.5px] font-serif leading-tight whitespace-nowrap shadow-xl"
                        >
                          <span className="text-amber-400 block font-bold mb-0.5">🗣️ 阵前嘲讽：</span>
                          {lastTauntMsg.right}
                          <div className="absolute -bottom-1.5 right-2 w-3 h-3 bg-slate-900 border-l border-b border-amber-500/40 transform rotate-45" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Parry Shield Aura bubble */}
                    {rightActionState === 'parrying' && (
                      <motion.div
                        animate={{ scale: [1, 1.12, 1], opacity: [0.55, 0.9, 0.55] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        className="absolute inset-0 -m-3 border-2 border-dashed border-teal-400 rounded-full pointer-events-none z-15 flex items-center justify-center bg-teal-500/10 shadow-[0_0_18px_rgba(45,212,191,0.3)]"
                      />
                    )}

                    {/* Right Officer Halberd / Spear Weapon + Crescent Trail */}
                    <motion.div
                      animate={
                        rightActionState === 'striking' ? { rotate: [35, -58, 10], scale: 1.18 } :
                        rightActionState === 'charging' ? { rotate: 22, x: -4 } :
                        rightActionState === 'parrying' ? { rotate: 65, x: -6, y: -8 } :
                        { rotate: -6, scale: 1 }
                      }
                      transition={{ duration: 0.24, ease: "easeOut" }}
                      className="absolute -left-14 bottom-5 w-20 h-10 origin-right pointer-events-none z-20 flex items-center justify-end"
                    >
                      <svg width="82" height="36" viewBox="0 0 82 36" className="overflow-visible drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                        <line x1="82" y1="20" x2="24" y2="20" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />
                        <path d="M28 14 Q8 10 2 20 Q14 26 28 22 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.2" />
                        <path d="M30 20 Q34 27 38 29" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" fill="none" />
                        {rightSlash && (
                          <path d="M42 2 Q4 8 8 34" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.85" />
                        )}
                      </svg>
                    </motion.div>

                    {/* Character Avatar base */}
                    <div className={`w-16 h-16 rounded-2xl overflow-hidden border-2 ${currentTurn === 'right' ? 'border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.45)]' : 'border-slate-800'} relative bg-slate-900 shrink-0 z-10`}>
                      {rightActionState === 'hit' && (
                        <motion.div
                          initial={{ opacity: 0.85 }}
                          animate={{ opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className="absolute inset-0 bg-rose-500/60 z-20"
                        />
                      )}
                      <AvatarRenderer style={rightDuelist.officer.avatarStyle} />
                    </div>

                    {/* Horse riding base */}
                    <motion.div
                      animate={
                        rightActionState === 'charging' || rightActionState === 'striking'
                          ? { rotate: [4, -4, 4], y: [0, -3, 0] }
                          : { rotate: 0, y: 0 }
                      }
                      transition={{ duration: 0.22, repeat: rightActionState === 'charging' ? Infinity : 0 }}
                      className="relative mt-1 text-center shrink-0 z-10 select-none pointer-events-none flex flex-col items-center"
                    >
                      <span className="text-[22px] filter drop-shadow">🐎</span>
                      <span className="text-[9px] font-serif font-black bg-slate-950/90 border border-slate-800 px-1.5 py-0.5 rounded text-amber-500 block -mt-1">{rightDuelist.officer.name}</span>
                    </motion.div>

                    {/* Bottom shadow */}
                    <div className="w-14 h-2.5 bg-black/55 rounded-full filter blur-[2px] absolute -bottom-1 z-0" />
                  </motion.div>
                </div>
              );
            })()}
          </div>

          {/* Interactive Player Combat Action bar */}
          <div className="bg-slate-950 p-4.5 rounded-2xl border border-slate-900 flex flex-col gap-3">
            {winnerSide ? (
              /* Winner State Announcement Banner */
              <div className="text-center py-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <span className="text-sm font-serif font-black text-amber-400 block tracking-widest flex items-center justify-center gap-1.5">
                  <Trophy className="text-amber-500 animate-bounce" size={16} />
                  🏆 三军见证！演武竞技尘埃落定 🏆
                </span>
                <span className="text-xs text-slate-300 block mt-1.5 leading-relaxed max-w-lg mx-auto font-serif">
                  {winnerSide === 'draw'
                    ? '双方武艺登峰造极，两败俱伤坠马，不枉一世名豪宿怨！'
                    : `${winnerSide === 'left' ? '左军大捷！' : '右军大捷！'}名将【${winnerSide === 'left' ? leftDuelist!.officer.name : rightDuelist!.officer.name}】于第 ${roundCount} 合中阵前斩胜，扬威疆域沙场！`}
                </span>
              </div>
            ) : (
              /* Tactical Actions selection buttons */
              (() => {
                const isLeftTurn = currentTurn === 'left';
                const isLeftAi = combatType === 'ai_vs_ai';
                const isRightAi = combatType !== 'player_vs_player';
                const isAiThinking = (isLeftTurn && isLeftAi) || (!isLeftTurn && isRightAi);
                const actionsDisabled = isAiThinking || isAnimatingAction;

                return (
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                      <span>🕹️ 控制盘: 【{isLeftTurn ? leftDuelist!.officer.name : rightDuelist!.officer.name}】的战斗回合</span>
                      <span>
                        {isAiThinking
                          ? '🤖 敌将正在思索克敌阵法...'
                          : isAnimatingAction
                          ? '⚔️ 正在交锋过招...'
                          : '👉 请点击下方招式对敌将造成物理克制...'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <button
                        onClick={() => executeAction('slash')}
                        disabled={actionsDisabled}
                        className="bg-slate-900 hover:bg-slate-850 disabled:opacity-45 text-slate-200 border border-slate-800 rounded-xl p-3 text-xs font-serif text-left transition hover:border-amber-500/40 active:scale-95 cursor-pointer flex flex-col gap-1"
                      >
                        <span className="font-bold text-amber-400 flex items-center gap-1">🗡️ 抢攻/对斩</span>
                        <span className="text-[9.5px] text-slate-500 font-sans block leading-tight">高命中(90%)，稳健出招。蓄斗气18。</span>
                      </button>

                      <button
                        onClick={() => executeAction('heavy')}
                        disabled={actionsDisabled}
                        className="bg-slate-900 hover:bg-slate-850 disabled:opacity-45 text-slate-200 border border-slate-800 rounded-xl p-3 text-xs font-serif text-left transition hover:border-amber-500/40 active:scale-95 cursor-pointer flex flex-col gap-1"
                      >
                        <span className="font-bold text-rose-400 flex items-center gap-1">🪵 崩山重击</span>
                        <span className="text-[9.5px] text-slate-500 font-sans block leading-tight">低命中(65%)，破裂伤害。蓄斗气25。</span>
                      </button>

                      <button
                        onClick={() => executeAction('parry')}
                        disabled={actionsDisabled}
                        className="bg-slate-900 hover:bg-slate-850 disabled:opacity-45 text-slate-200 border border-slate-800 rounded-xl p-3 text-xs font-serif text-left transition hover:border-amber-500/40 active:scale-95 cursor-pointer flex flex-col gap-1"
                      >
                        <span className="font-bold text-teal-400 flex items-center gap-1">🛡️ 稳守招架</span>
                        <span className="text-[9.5px] text-slate-500 font-sans block leading-tight">防御接下回合伤害50%并少许体力恢复。</span>
                      </button>

                      <button
                        onClick={() => executeAction('ultimate')}
                        disabled={actionsDisabled || (isLeftTurn ? leftDuelist!.rage < 50 : rightDuelist!.rage < 50)}
                        className={`rounded-xl p-3 text-xs font-serif text-left transition flex flex-col gap-1 cursor-pointer border ${
                          (isLeftTurn ? leftDuelist!.rage >= 50 : rightDuelist!.rage >= 50) && !actionsDisabled
                            ? 'bg-amber-500/10 hover:bg-amber-500/15 border-amber-500 text-amber-200 active:scale-95'
                            : 'bg-slate-900 border-slate-800 text-slate-500 opacity-50'
                        }`}
                      >
                        <span className="font-bold text-amber-400 flex items-center gap-1">🔥 傲世绝技</span>
                        <span className="text-[9.5px] font-sans block leading-tight">
                          需斗气 ≥ 50。100%命中，无视招架破竹大招！
                        </span>
                      </button>

                      <button
                        onClick={() => executeAction('taunt')}
                        disabled={actionsDisabled}
                        className="bg-slate-900 hover:bg-slate-850 disabled:opacity-45 text-slate-200 border border-slate-800 rounded-xl p-3 text-xs font-serif text-left transition hover:border-amber-500/40 active:scale-95 cursor-pointer flex flex-col gap-1 col-span-2 md:col-span-1"
                      >
                        <span className="font-bold text-sky-400 flex items-center gap-1">🗣️ 阵前嘲讽</span>
                        <span className="text-[9.5px] text-slate-500 font-sans block leading-tight">心理打击！扣损敌将25点怒气斗气。</span>
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
