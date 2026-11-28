import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sword,
  X,
  Trophy,
  AlertTriangle,
  Sparkles,
  Star,
  RefreshCw,
} from 'lucide-react';
import { Officer, Faction } from '../types';
import { applySeasonalOfficerModifiers, SEASONS, SeasonId } from '../utils/seasons';
import {
  playMoveSound as playUnifiedMoveSound,
  playClashSound as playUnifiedClashSound,
  playArrowSound,
  playFireSound,
  playHeavyImpactSound,
  playHealSound,
  playVictorySound as playUnifiedVictorySound,
  playDefeatSound as playUnifiedDefeatSound,
} from '../utils/audio';

interface City {
  id: string;
  name: string;
  pinyin: string;
  x: number;
  y: number;
  region: string;
  description: string;
}

interface WarModeProps {
  originCity: City;
  targetCity: City;
  attackerFaction: Faction;
  defenderFaction: Faction;
  attackingOfficer: Officer | null;
  defendingOfficer: Officer | null;
  weatherId: 'sunny' | 'rainy' | 'heavy_rain' | 'windy' | 'foggy' | 'dense_fog' | 'snow';
  seasonId?: SeasonId;
  soundEnabled: boolean;
  initialPhase?: 'fighting' | 'victory' | 'defeat';
  autoDeploy?: boolean;
  battleNonce?: number;
  onBattleComplete: (
    winner: 'attacker' | 'defender',
    goldReward: number,
    epicRelic?: string,
    conqueredCityId?: string,
  ) => void;
  onClose: () => void;
}

type CardType =
  | 'barbarian'
  | 'archer'
  | 'giant'
  | 'wall_breaker'
  | 'hero'
  | 'rage_spell'
  | 'heal_spell';

type TroopKind = 'barbarian' | 'archer' | 'giant' | 'wall_breaker' | 'hero';

type BuildingKind =
  | 'town_hall'
  | 'cannon'
  | 'archer_tower'
  | 'mortar'
  | 'gold_storage'
  | 'wall';

interface TroopUnit {
  id: string;
  kind: TroopKind;
  name: string;
  icon: string;
  x: number; // 0..100%
  y: number; // 0..100%
  hp: number;
  maxHp: number;
  dps: number;
  speed: number; // % per tick
  range: number; // % distance
  cooldown: number;
  maxCooldown: number;
  targetId: string | null;
  ragedTicks: number;
  facing: 1 | -1;
  attackFlash: number;
}

interface DefenseBuilding {
  id: string;
  kind: BuildingKind;
  name: string;
  icon: string;
  x: number;
  y: number;
  size: number; // visual width/height hint
  hp: number;
  maxHp: number;
  isDefense: boolean;
  isWall: boolean;
  dps: number;
  range: number;
  splashRadius: number;
  cooldown: number;
  maxCooldown: number;
  hitFlash: number;
  turretAngle: number;
}

interface SpellZone {
  id: string;
  kind: 'rage_spell' | 'heal_spell';
  x: number;
  y: number;
  radius: number;
  ticksLeft: number;
  maxTicks: number;
}

interface RaidProjectile {
  id: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  x: number;
  y: number;
  progress: number; // 0..1
  speed: number;
  kind: 'arrow' | 'cannonball' | 'mortar' | 'slash' | 'bomb';
  damage: number;
  splashRadius: number;
  fromSide: 'attacker' | 'defender';
  targetId: string;
}

interface FloatingBadge {
  id: string;
  x: number;
  y: number;
  text: string;
  tone: 'dmg' | 'heal' | 'boom' | 'loot';
}

interface RaidSim {
  troops: TroopUnit[];
  buildings: DefenseBuilding[];
  spells: SpellZone[];
  projectiles: RaidProjectile[];
  deckCounts: Record<CardType, number>;
  heroDeployed: boolean;
  heroAbilityUsed: boolean;
  raidStarted: boolean;
  timeRemaining: number; // seconds (starts 180)
  tickCount: number;
  destructionPct: number;
  stars: number; // 0..3
  townHallDestroyed: boolean;
  lootGold: number;
  phase: 'fighting' | 'victory' | 'defeat';
}

interface RaidSnapshot {
  troops: TroopUnit[];
  buildings: DefenseBuilding[];
  spells: SpellZone[];
  projectiles: RaidProjectile[];
  deckCounts: Record<CardType, number>;
  heroDeployed: boolean;
  heroAbilityUsed: boolean;
  raidStarted: boolean;
  timeRemaining: number;
  destructionPct: number;
  stars: number;
  townHallDestroyed: boolean;
  lootGold: number;
}

interface CardMeta {
  id: CardType;
  name: string;
  subtitle: string;
  icon: string;
  colorClass: string;
  badgeText: string;
  isSpell?: boolean;
}

const TROOP_DECK_META: CardMeta[] = [
  {
    id: 'barbarian',
    name: '陷阵蛮勇',
    subtitle: '近战群攻 · 速拆外围',
    icon: '⚔️',
    colorClass: 'border-amber-500/60 bg-amber-950/35 text-amber-300',
    badgeText: '近战',
  },
  {
    id: 'archer',
    name: '神射弓手',
    subtitle: '隔墙远程 · 集火箭雨',
    icon: '🏹',
    colorClass: 'border-rose-500/60 bg-rose-950/35 text-rose-300',
    badgeText: '远程',
  },
  {
    id: 'giant',
    name: '铁甲巨人',
    subtitle: '高血肉盾 · 优先拆炮',
    icon: '🛡️',
    colorClass: 'border-emerald-500/60 bg-emerald-950/35 text-emerald-300',
    badgeText: '优先防御',
  },
  {
    id: 'wall_breaker',
    name: '爆破工兵',
    subtitle: '专炸城墙 · 破口开路',
    icon: '💣',
    colorClass: 'border-orange-500/60 bg-orange-950/35 text-orange-300',
    badgeText: '破墙×8',
  },
  {
    id: 'hero',
    name: '无双主将',
    subtitle: '统帅亲征 · 铁拳狂暴',
    icon: '👑',
    colorClass: 'border-yellow-400/75 bg-yellow-950/40 text-yellow-300',
    badgeText: '英雄',
  },
  {
    id: 'rage_spell',
    name: '狂暴法术',
    subtitle: '圈内移速攻速+60%',
    icon: '⚡',
    colorClass: 'border-purple-500/70 bg-purple-950/40 text-purple-300',
    badgeText: '法术',
    isSpell: true,
  },
  {
    id: 'heal_spell',
    name: '治愈神泉',
    subtitle: '持续回血护航主力',
    icon: '💚',
    colorClass: 'border-teal-400/70 bg-teal-950/40 text-teal-300',
    badgeText: '法术',
    isSpell: true,
  },
];

function createVillageBuildings(
  targetCityName: string,
  defendingOfficer: Officer | null,
  seasonDefenseBonus: number,
): DefenseBuilding[] {
  const defMod = defendingOfficer
    ? Math.max(0.85, 1 + (defendingOfficer.stats.leadership - 65) * 0.006)
    : 1;
  const wallMod = 1 + seasonDefenseBonus * 0.015;

  return [
    // Center Town Hall (50% star + TH star)
    {
      id: 'b_th',
      kind: 'town_hall',
      name: `${targetCityName} · 主城大本营`,
      icon: '🏰',
      x: 54,
      y: 50,
      size: 56,
      hp: Math.round(1250 * defMod * wallMod),
      maxHp: Math.round(1250 * defMod * wallMod),
      isDefense: false,
      isWall: false,
      dps: 0,
      range: 0,
      splashRadius: 0,
      cooldown: 0,
      maxCooldown: 99,
      hitFlash: 0,
      turretAngle: 0,
    },
    // Front Cannons
    {
      id: 'b_cannon_top',
      kind: 'cannon',
      name: '虎蹲重加农炮',
      icon: '💣',
      x: 37,
      y: 34,
      size: 40,
      hp: Math.round(440 * defMod),
      maxHp: Math.round(440 * defMod),
      isDefense: true,
      isWall: false,
      dps: 22,
      range: 28,
      splashRadius: 0,
      cooldown: 10,
      maxCooldown: 24,
      hitFlash: 0,
      turretAngle: 180,
    },
    {
      id: 'b_cannon_bot',
      kind: 'cannon',
      name: '城关铁加农炮',
      icon: '💣',
      x: 37,
      y: 66,
      size: 40,
      hp: Math.round(440 * defMod),
      maxHp: Math.round(440 * defMod),
      isDefense: true,
      isWall: false,
      dps: 22,
      range: 28,
      splashRadius: 0,
      cooldown: 14,
      maxCooldown: 24,
      hitFlash: 0,
      turretAngle: 180,
    },
    // Rear Archer Towers
    {
      id: 'b_arch_top',
      kind: 'archer_tower',
      name: '高台连弩哨塔',
      icon: '🗼',
      x: 68,
      y: 26,
      size: 40,
      hp: Math.round(400 * defMod),
      maxHp: Math.round(400 * defMod),
      isDefense: true,
      isWall: false,
      dps: 15,
      range: 36,
      splashRadius: 0,
      cooldown: 6,
      maxCooldown: 14,
      hitFlash: 0,
      turretAngle: 180,
    },
    {
      id: 'b_arch_bot',
      kind: 'archer_tower',
      name: '飞檐守备箭塔',
      icon: '🗼',
      x: 68,
      y: 74,
      size: 40,
      hp: Math.round(400 * defMod),
      maxHp: Math.round(400 * defMod),
      isDefense: true,
      isWall: false,
      dps: 15,
      range: 36,
      splashRadius: 0,
      cooldown: 9,
      maxCooldown: 14,
      hitFlash: 0,
      turretAngle: 180,
    },
    // Splash Mortar in rear core
    {
      id: 'b_mortar',
      kind: 'mortar',
      name: '霹雳轰天迫击炮',
      icon: '☄️',
      x: 78,
      y: 50,
      size: 44,
      hp: Math.round(460 * defMod),
      maxHp: Math.round(460 * defMod),
      isDefense: true,
      isWall: false,
      dps: 46,
      range: 46,
      splashRadius: 11,
      cooldown: 24,
      maxCooldown: 48,
      hitFlash: 0,
      turretAngle: 180,
    },
    // Resource Gold Storages (give high % & loot)
    {
      id: 'b_gold_top',
      kind: 'gold_storage',
      name: '军需黄金库',
      icon: '🪙',
      x: 52,
      y: 20,
      size: 38,
      hp: 360,
      maxHp: 360,
      isDefense: false,
      isWall: false,
      dps: 0,
      range: 0,
      splashRadius: 0,
      cooldown: 0,
      maxCooldown: 99,
      hitFlash: 0,
      turretAngle: 0,
    },
    {
      id: 'b_gold_bot',
      kind: 'gold_storage',
      name: '府库粮饷仓',
      icon: '🏛️',
      x: 52,
      y: 80,
      size: 38,
      hp: 360,
      maxHp: 360,
      isDefense: false,
      isWall: false,
      dps: 0,
      range: 0,
      splashRadius: 0,
      cooldown: 0,
      maxCooldown: 99,
      hitFlash: 0,
      turretAngle: 0,
    },
    // Defensive Stone Walls enclosing West/Core approach
    {
      id: 'b_wall_1',
      kind: 'wall',
      name: '青石城垣',
      icon: '🧱',
      x: 27,
      y: 38,
      size: 28,
      hp: Math.round(460 * wallMod),
      maxHp: Math.round(460 * wallMod),
      isDefense: false,
      isWall: true,
      dps: 0,
      range: 0,
      splashRadius: 0,
      cooldown: 0,
      maxCooldown: 99,
      hitFlash: 0,
      turretAngle: 0,
    },
    {
      id: 'b_wall_2',
      kind: 'wall',
      name: '青石城垣',
      icon: '🧱',
      x: 27,
      y: 50,
      size: 28,
      hp: Math.round(460 * wallMod),
      maxHp: Math.round(460 * wallMod),
      isDefense: false,
      isWall: true,
      dps: 0,
      range: 0,
      splashRadius: 0,
      cooldown: 0,
      maxCooldown: 99,
      hitFlash: 0,
      turretAngle: 0,
    },
    {
      id: 'b_wall_3',
      kind: 'wall',
      name: '青石城垣',
      icon: '🧱',
      x: 27,
      y: 62,
      size: 28,
      hp: Math.round(460 * wallMod),
      maxHp: Math.round(460 * wallMod),
      isDefense: false,
      isWall: true,
      dps: 0,
      range: 0,
      splashRadius: 0,
      cooldown: 0,
      maxCooldown: 99,
      hitFlash: 0,
      turretAngle: 0,
    },
    {
      id: 'b_wall_4',
      kind: 'wall',
      name: '侧翼石垒',
      icon: '🧱',
      x: 45,
      y: 50,
      size: 28,
      hp: Math.round(460 * wallMod),
      maxHp: Math.round(460 * wallMod),
      isDefense: false,
      isWall: true,
      dps: 0,
      range: 0,
      splashRadius: 0,
      cooldown: 0,
      maxCooldown: 99,
      hitFlash: 0,
      turretAngle: 0,
    },
  ];
}

function createInitialSim(
  targetCityName: string,
  defendingOfficer: Officer | null,
  seasonDefenseBonus: number,
  initialPhase: 'fighting' | 'victory' | 'defeat',
): RaidSim {
  return {
    troops: [],
    buildings: createVillageBuildings(targetCityName, defendingOfficer, seasonDefenseBonus),
    spells: [],
    projectiles: [],
    deckCounts: {
      barbarian: 12,
      archer: 10,
      giant: 4,
      wall_breaker: 3,
      hero: 1,
      rage_spell: 2,
      heal_spell: 1,
    },
    heroDeployed: false,
    heroAbilityUsed: false,
    raidStarted: false,
    timeRemaining: 180,
    tickCount: 0,
    destructionPct: 0,
    stars: 0,
    townHallDestroyed: false,
    lootGold: 0,
    phase: initialPhase,
  };
}

function toSnapshot(sim: RaidSim): RaidSnapshot {
  return {
    troops: sim.troops.map(t => ({ ...t })),
    buildings: sim.buildings.map(b => ({ ...b })),
    spells: sim.spells.map(s => ({ ...s })),
    projectiles: sim.projectiles.map(p => ({ ...p })),
    deckCounts: { ...sim.deckCounts },
    heroDeployed: sim.heroDeployed,
    heroAbilityUsed: sim.heroAbilityUsed,
    raidStarted: sim.raidStarted,
    timeRemaining: sim.timeRemaining,
    destructionPct: sim.destructionPct,
    stars: sim.stars,
    townHallDestroyed: sim.townHallDestroyed,
    lootGold: sim.lootGold,
  };
}

export default function WarMode({
  originCity,
  targetCity,
  attackerFaction,
  defenderFaction,
  attackingOfficer,
  defendingOfficer,
  weatherId,
  seasonId = 'spring',
  soundEnabled,
  initialPhase = 'fighting',
  autoDeploy = false,
  battleNonce = 0,
  onBattleComplete,
  onClose,
}: WarModeProps) {
  const activeSeason = SEASONS[seasonId];
  const seasonalAttacker = useMemo(
    () => (attackingOfficer ? applySeasonalOfficerModifiers(attackingOfficer, seasonId) : null),
    [attackingOfficer, seasonId],
  );
  const seasonalDefender = useMemo(
    () => (defendingOfficer ? applySeasonalOfficerModifiers(defendingOfficer, seasonId) : null),
    [defendingOfficer, seasonId],
  );

  const initialSim = useMemo(
    () =>
      createInitialSim(
        targetCity.name,
        seasonalDefender,
        activeSeason.tacticalModifiers.defenseBonus,
        initialPhase,
      ),
    [targetCity.name, seasonalDefender, activeSeason.tacticalModifiers.defenseBonus, initialPhase],
  );

  const simRef = useRef<RaidSim>(initialSim);
  const idCounter = useRef<number>(1);
  const arenaRef = useRef<HTMLDivElement>(null);
  const soundEnabledRef = useRef<boolean>(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  const [battlePhase, setBattlePhase] = useState<'fighting' | 'victory' | 'defeat'>(initialPhase);
  const [selectedCard, setSelectedCard] = useState<CardType>('giant');
  const [snap, setSnap] = useState<RaidSnapshot>(() => toSnapshot(initialSim));
  const [floatingBadges, setFloatingBadges] = useState<FloatingBadge[]>([]);
  const [screenShake, setScreenShake] = useState<'none' | 'light' | 'heavy'>('none');
  const [battleLogs, setBattleLogs] = useState<string[]>([
    `🏰 部落突袭展开！[${attackerFaction.name}] ${attackingOfficer?.name || '攻城主帅'} 兵临 [${targetCity.name}] 营寨外围！`,
    `${activeSeason.icon} 节令 [${activeSeason.name}]：${activeSeason.tacticalSummary}`,
    `👉 选择下方兵种或法术卡片，点击绿地营寨外围即可空降放兵，摧毁大本营与 50%/100% 建筑夺星！`,
  ]);

  const addLog = (msg: string) => {
    setBattleLogs(prev => [msg, ...prev].slice(0, 60));
  };

  const spawnFloatingBadge = (
    x: number,
    y: number,
    text: string,
    tone: 'dmg' | 'heal' | 'boom' | 'loot' = 'dmg',
  ) => {
    const id = `fb_${idCounter.current++}`;
    setFloatingBadges(prev => [...prev.slice(-18), { id, x, y, text, tone }]);
    setTimeout(() => {
      setFloatingBadges(prev => prev.filter(f => f.id !== id));
    }, 900);
  };

  const resetRaid = () => {
    const fresh = createInitialSim(
      targetCity.name,
      seasonalDefender,
      activeSeason.tacticalModifiers.defenseBonus,
      'fighting',
    );
    simRef.current = fresh;
    setSnap(toSnapshot(fresh));
    setBattlePhase('fighting');
    setSelectedCard('giant');
    setFloatingBadges([]);
    setBattleLogs([
      `🏰 重新整备兵团！[${attackerFaction.name}] 再度围绕 [${targetCity.name}] 营寨列阵！`,
      `👉 点击兵种卡并在草地外围点放兵力，或点击「全军一键突袭」！`,
    ]);
  };

  useEffect(() => {
    resetRaid();
    if (autoDeploy) {
      const t = setTimeout(() => {
        handleAllInDeploy();
      }, 150);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetCity.id, originCity.id, weatherId, seasonId, battleNonce, autoDeploy]);

  const spawnTroopOrSpellAt = (card: CardType, rawX: number, rawY: number, silentLog = false) => {
    const sim = simRef.current;
    if (sim.phase !== 'fighting' || sim.deckCounts[card] <= 0) return false;

    const x = Math.max(4, Math.min(96, rawX));
    const y = Math.max(6, Math.min(94, rawY));

    if (card === 'rage_spell' || card === 'heal_spell') {
      sim.deckCounts[card] -= 1;
      sim.raidStarted = true;
      sim.spells.push({
        id: `sp_${idCounter.current++}`,
        kind: card,
        x,
        y,
        radius: 17,
        ticksLeft: card === 'rage_spell' ? 210 : 190,
        maxTicks: card === 'rage_spell' ? 210 : 190,
      });
      if (soundEnabledRef.current) playHealSound();
      spawnFloatingBadge(
        x,
        y,
        card === 'rage_spell' ? '⚡ 狂暴光环!' : '💚 治愈神泉!',
        'heal',
      );
      if (!silentLog) {
        addLog(
          card === 'rage_spell'
            ? '⚡ 施放【狂暴药水】！紫色光环笼罩战区，友军移速攻速暴涨！'
            : '💚 施放【治愈神泉】！金色泉水持续救治圈内奋战将士！',
        );
      }
      setSnap(toSnapshot(sim));
      return true;
    }

    sim.deckCounts[card] -= 1;
    sim.raidStarted = true;

    const heroForce = seasonalAttacker ? seasonalAttacker.stats.force : 78;
    const heroLdr = seasonalAttacker ? seasonalAttacker.stats.leadership : 76;
    const sunnyBoost = weatherId === 'sunny' ? 1.15 : 1;

    const spec: Record<
      TroopKind,
      { name: string; icon: string; hp: number; dps: number; speed: number; range: number; cd: number }
    > = {
      barbarian: {
        name: '陷阵蛮勇',
        icon: '⚔️',
        hp: 155,
        dps: Math.round(24 * sunnyBoost),
        speed: 0.95,
        range: 5.5,
        cd: 16,
      },
      archer: {
        name: '神射弓手',
        icon: '🏹',
        hp: 90,
        dps: Math.round(22 * activeSeason.tacticalModifiers.archerMultiplier),
        speed: 0.9,
        range: 17,
        cd: 16,
      },
      giant: {
        name: '铁甲巨人',
        icon: '🛡️',
        hp: 580,
        dps: 32,
        speed: 0.56,
        range: 6,
        cd: 22,
      },
      wall_breaker: {
        name: '爆破工兵',
        icon: '💣',
        hp: 85,
        dps: 340,
        speed: 1.25,
        range: 5.2,
        cd: 8,
      },
      hero: {
        name: attackingOfficer?.name || '攻城主帅',
        icon: '👑',
        hp: Math.round(760 + heroLdr * 4.5),
        dps: Math.round((46 + heroForce * 0.4) * sunnyBoost),
        speed: 0.85,
        range: 6.8,
        cd: 14,
      },
    };

    const s = spec[card];
    sim.troops.push({
      id: `tr_${idCounter.current++}`,
      kind: card,
      name: s.name,
      icon: s.icon,
      x,
      y,
      hp: s.hp,
      maxHp: s.hp,
      dps: s.dps,
      speed: s.speed,
      range: s.range,
      cooldown: 4,
      maxCooldown: s.cd,
      targetId: null,
      ragedTicks: 0,
      facing: x > 54 ? -1 : 1,
      attackFlash: 0,
    });

    if (card === 'hero') {
      sim.heroDeployed = true;
      if (!silentLog) {
        addLog(`👑 主帅【${s.name}】亲赴前线跃入战团！`);
      }
    }
    if (soundEnabledRef.current) playUnifiedMoveSound();

    // Auto-switch selected card if stack depleted
    if (sim.deckCounts[card] === 0) {
      const nextAvailable = TROOP_DECK_META.find(m => sim.deckCounts[m.id] > 0);
      if (nextAvailable) setSelectedCard(nextAvailable.id);
    }
    setSnap(toSnapshot(sim));
    return true;
  };

  const handleArenaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const sim = simRef.current;
    if (sim.phase !== 'fighting') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 100;
    const yPct = ((e.clientY - rect.top) / Math.max(1, rect.height)) * 100;
    spawnTroopOrSpellAt(selectedCard, xPct, yPct);
  };

  const handleAllInDeploy = () => {
    const sim = simRef.current;
    if (sim.phase !== 'fighting') return;

    // Classic CoC perimeter wave deployment: Giants front-west, Wall Breakers center-west, Barbarians & Archers fan out, Hero follows!
    const giantCount = sim.deckCounts.giant;
    for (let i = 0; i < giantCount; i++) {
      spawnTroopOrSpellAt('giant', 13, 30 + (i * 40) / Math.max(1, giantCount - 1), true);
    }
    const wbCount = sim.deckCounts.wall_breaker;
    for (let i = 0; i < wbCount; i++) {
      spawnTroopOrSpellAt('wall_breaker', 11, 42 + i * 8, true);
    }
    const barbCount = sim.deckCounts.barbarian;
    for (let i = 0; i < barbCount; i++) {
      const sideTop = i % 2 === 0;
      spawnTroopOrSpellAt(
        'barbarian',
        sideTop ? 12 + (i % 4) * 3 : 12 + (i % 4) * 3,
        sideTop ? 18 + i * 3 : 56 + i * 2.5,
        true,
      );
    }
    const archCount = sim.deckCounts.archer;
    for (let i = 0; i < archCount; i++) {
      spawnTroopOrSpellAt('archer', 7 + (i % 3) * 2, 16 + (i * 68) / Math.max(1, archCount - 1), true);
    }
    if (sim.deckCounts.hero > 0) {
      spawnTroopOrSpellAt('hero', 10, 50, true);
    }
    addLog('🚩 【全军一键突袭】铁甲巨人前排抗炮，爆破手拆墙，蛮勇与弓手两翼包抄总攻！');
  };

  const triggerHeroAbility = () => {
    const sim = simRef.current;
    if (sim.phase !== 'fighting' || !sim.heroDeployed || sim.heroAbilityUsed) return;
    const hero = sim.troops.find(t => t.kind === 'hero' && t.hp > 0);
    if (!hero) return;

    sim.heroAbilityUsed = true;
    hero.hp = Math.min(hero.maxHp, hero.hp + Math.round(hero.maxHp * 0.35));
    hero.ragedTicks = 200;
    // Summon 4 loyal retinue Barbarians around the Hero (Classic Barbarian King Iron Fist!)
    for (let i = 0; i < 4; i++) {
      sim.troops.push({
        id: `tr_ret_${idCounter.current++}`,
        kind: 'barbarian',
        name: '亲卫死士',
        icon: '⚔️',
        x: Math.max(6, Math.min(94, hero.x + (i % 2 === 0 ? -4 : 4))),
        y: Math.max(8, Math.min(92, hero.y + (i < 2 ? -5 : 5))),
        hp: 165,
        maxHp: 165,
        dps: 28,
        speed: 1.05,
        range: 5.5,
        cooldown: 4,
        maxCooldown: 14,
        targetId: null,
        ragedTicks: 180,
        facing: hero.facing,
        attackFlash: 0,
      });
    }
    if (soundEnabledRef.current) playHeavyImpactSound();
    spawnFloatingBadge(hero.x, hero.y, '🔥 英雄铁拳狂暴!', 'boom');
    addLog(`🔥 【英雄技发动】${hero.name} 狂暴觉醒并召唤 4 队亲卫死士冲锋！`);
    setSnap(toSnapshot(sim));
  };

  const concludeBattleEarly = () => {
    const sim = simRef.current;
    if (sim.phase !== 'fighting') return;
    const win = sim.stars > 0;
    sim.phase = win ? 'victory' : 'defeat';
    setBattlePhase(sim.phase);
    if (win) {
      if (soundEnabledRef.current) playUnifiedVictorySound();
      addLog(`🏆 鸣金收兵！取得 ${sim.stars} ★ (${sim.destructionPct}% 摧毁度) 攻城胜利！`);
    } else {
      if (soundEnabledRef.current) playUnifiedDefeatSound();
      addLog('💀 撤兵收队：尚未夺得半颗战星，强袭失利！');
    }
  };

  // Real-Time 33ms Clash of Clans Simulation Engine
  useEffect(() => {
    if (battlePhase !== 'fighting') return;

    const timer = setInterval(() => {
      const sim = simRef.current;
      if (sim.phase !== 'fighting') return;

      sim.tickCount += 1;
      if (!sim.raidStarted) return;

      // 1) Update Raid Countdown (1 sec every 30 ticks)
      if (sim.tickCount % 30 === 0) {
        sim.timeRemaining = Math.max(0, sim.timeRemaining - 1);
        if (sim.timeRemaining === 0) {
          const outcome = sim.stars >= 1 ? 'victory' : 'defeat';
          sim.phase = outcome;
          setBattlePhase(outcome);
          if (outcome === 'victory') {
            if (soundEnabledRef.current) playUnifiedVictorySound();
            addLog(`⏱️ 战时已尽！以 ${sim.stars} ★ (${sim.destructionPct}%) 拿下 [${targetCity.name}]！`);
          } else {
            if (soundEnabledRef.current) playUnifiedDefeatSound();
            addLog('⏱️ 强袭超时且未能取星，兵马撤退！');
          }
          setSnap(toSnapshot(sim));
          return;
        }
      }

      // 2) Advance Active Spells (Rage & Heal)
      sim.spells = sim.spells
        .map(sp => ({ ...sp, ticksLeft: sp.ticksLeft - 1 }))
        .filter(sp => sp.ticksLeft > 0);

      // 3) Advance Troops AI & Movement
      const aliveNonWall = sim.buildings.filter(b => b.hp > 0 && !b.isWall);
      const aliveDefenses = aliveNonWall.filter(b => b.isDefense);
      const aliveWalls = sim.buildings.filter(b => b.hp > 0 && b.isWall);

      for (const troop of sim.troops) {
        if (troop.hp <= 0) continue;
        if (troop.attackFlash > 0) troop.attackFlash -= 1;

        // Check Spell Auras
        const inRage = sim.spells.some(
          sp => sp.kind === 'rage_spell' && Math.hypot(sp.x - troop.x, sp.y - troop.y) <= sp.radius,
        );
        const inHeal = sim.spells.some(
          sp => sp.kind === 'heal_spell' && Math.hypot(sp.x - troop.x, sp.y - troop.y) <= sp.radius,
        );
        if (inRage) troop.ragedTicks = Math.max(troop.ragedTicks, 5);
        else if (troop.ragedTicks > 0) troop.ragedTicks -= 1;

        if (inHeal && troop.hp < troop.maxHp) {
          troop.hp = Math.min(troop.maxHp, troop.hp + 1.45);
        }

        const rageSpeedMult = troop.ragedTicks > 0 ? 1.5 : 1;
        const rageDmgMult = troop.ragedTicks > 0 ? 1.6 : 1;

        // Pick target by CoC priority
        let pool: DefenseBuilding[] = aliveNonWall;
        if (troop.kind === 'giant' && aliveDefenses.length > 0) {
          pool = aliveDefenses;
        } else if (troop.kind === 'wall_breaker' && aliveWalls.length > 0) {
          pool = aliveWalls;
        }

        let target = pool.find(b => b.id === troop.targetId && b.hp > 0) ?? null;
        if (!target && pool.length > 0) {
          let bestDist = Infinity;
          for (const candidate of pool) {
            const d = Math.hypot(candidate.x - troop.x, candidate.y - troop.y);
            if (d < bestDist) {
              bestDist = d;
              target = candidate;
            }
          }
          troop.targetId = target ? target.id : null;
        }

        // Melee troops hitting an intervening Wall break through it if close along path
        if (
          target &&
          !target.isWall &&
          troop.kind !== 'archer' &&
          troop.kind !== 'wall_breaker'
        ) {
          const blockingWall = aliveWalls.find(w => {
            const dw = Math.hypot(w.x - troop.x, w.y - troop.y);
            const dt = Math.hypot(target!.x - troop.x, target!.y - troop.y);
            return dw < 7.5 && dw < dt && Math.sign(w.x - troop.x) === Math.sign(target!.x - troop.x);
          });
          if (blockingWall) target = blockingWall;
        }

        if (!target) continue;

        const dx = target.x - troop.x;
        const dy = target.y - troop.y;
        const dist = Math.hypot(dx, dy) || 0.01;
        troop.facing = dx >= 0 ? 1 : -1;

        if (dist > troop.range) {
          const step = troop.speed * rageSpeedMult;
          troop.x = Math.max(3, Math.min(97, troop.x + (dx / dist) * step));
          troop.y = Math.max(5, Math.min(95, troop.y + (dy / dist) * step));
        } else {
          if (troop.cooldown > 0) {
            troop.cooldown -= rageSpeedMult;
          } else {
            troop.cooldown = troop.maxCooldown;
            troop.attackFlash = 6;

            if (troop.kind === 'wall_breaker') {
              // Suicide bomb dealing 8x vs Walls!
              const blastDmg = target.isWall ? troop.dps * 2.4 : troop.dps;
              target.hp = Math.max(0, target.hp - blastDmg);
              target.hitFlash = 8;
              troop.hp = 0;
              if (soundEnabledRef.current) playFireSound();
              spawnFloatingBadge(target.x, target.y, `-${Math.round(blastDmg)} 💥`, 'boom');
              setScreenShake('heavy');
              setTimeout(() => setScreenShake('none'), 260);
            } else if (troop.kind === 'archer') {
              const dmg = Math.round(troop.dps * rageDmgMult);
              sim.projectiles.push({
                id: `pr_${idCounter.current++}`,
                fromX: troop.x,
                fromY: troop.y,
                toX: target.x,
                toY: target.y,
                x: troop.x,
                y: troop.y,
                progress: 0,
                speed: 0.16,
                kind: 'arrow',
                damage: dmg,
                splashRadius: 0,
                fromSide: 'attacker',
                targetId: target.id,
              });
              if (soundEnabledRef.current && sim.tickCount % 3 === 0) playArrowSound();
            } else {
              const dmg = Math.round(troop.dps * rageDmgMult);
              target.hp = Math.max(0, target.hp - dmg);
              target.hitFlash = 6;
              if (soundEnabledRef.current && sim.tickCount % 4 === 0) playUnifiedClashSound();
              spawnFloatingBadge(target.x, target.y - 3, `-${dmg}`, 'dmg');
            }
          }
        }
      }

      // 4) Advance Defense Buildings Targeting
      const aliveTroops = sim.troops.filter(t => t.hp > 0);
      const fogRangeMult = weatherId === 'dense_fog' ? 0.85 : 1;
      for (const b of sim.buildings) {
        if (b.hitFlash > 0) b.hitFlash -= 1;
        if (b.hp <= 0 || !b.isDefense) continue;

        if (b.cooldown > 0) {
          b.cooldown -= 1;
          continue;
        }

        // Find closest alive troop within defense range (Mortar has deadzone < 9)
        let bestTarget: TroopUnit | null = null;
        let bestDist = Infinity;
        for (const tr of aliveTroops) {
          const d = Math.hypot(tr.x - b.x, tr.y - b.y);
          if (d <= b.range * fogRangeMult && (b.kind !== 'mortar' || d >= 8) && d < bestDist) {
            bestDist = d;
            bestTarget = tr;
          }
        }

        if (bestTarget) {
          b.cooldown = b.maxCooldown;
          b.turretAngle = Math.atan2(bestTarget.y - b.y, bestTarget.x - b.x) * (180 / Math.PI);
          const projKind =
            b.kind === 'mortar' ? 'mortar' : b.kind === 'cannon' ? 'cannonball' : 'arrow';
          sim.projectiles.push({
            id: `dp_${idCounter.current++}`,
            fromX: b.x,
            fromY: b.y,
            toX: bestTarget.x,
            toY: bestTarget.y,
            x: b.x,
            y: b.y,
            progress: 0,
            speed: b.kind === 'mortar' ? 0.065 : b.kind === 'cannon' ? 0.14 : 0.19,
            kind: projKind,
            damage: b.dps,
            splashRadius: b.splashRadius,
            fromSide: 'defender',
            targetId: bestTarget.id,
          });
          if (soundEnabledRef.current && b.kind === 'cannon') playHeavyImpactSound();
        }
      }

      // 5) Advance Projectiles & Apply Impacts
      const nextProjectiles: RaidProjectile[] = [];
      for (const p of sim.projectiles) {
        p.progress += p.speed;
        p.x = p.fromX + (p.toX - p.fromX) * Math.min(1, p.progress);
        p.y = p.fromY + (p.toY - p.fromY) * Math.min(1, p.progress);

        if (p.progress >= 1) {
          if (p.fromSide === 'attacker') {
            const b = sim.buildings.find(bld => bld.id === p.targetId && bld.hp > 0);
            if (b) {
              b.hp = Math.max(0, b.hp - p.damage);
              b.hitFlash = 5;
              spawnFloatingBadge(b.x, b.y - 3, `-${p.damage}`, 'dmg');
            }
          } else {
            if (p.splashRadius > 0) {
              for (const tr of sim.troops) {
                if (tr.hp > 0 && Math.hypot(tr.x - p.toX, tr.y - p.toY) <= p.splashRadius) {
                  tr.hp = Math.max(0, tr.hp - p.damage);
                }
              }
              spawnFloatingBadge(p.toX, p.toY, `-${p.damage} ☄️`, 'boom');
              setScreenShake('light');
              setTimeout(() => setScreenShake('none'), 220);
            } else {
              const tr = sim.troops.find(u => u.id === p.targetId && u.hp > 0);
              if (tr) {
                tr.hp = Math.max(0, tr.hp - p.damage);
                spawnFloatingBadge(tr.x, tr.y - 2, `-${p.damage}`, 'dmg');
              }
            }
          }
          continue;
        }
        nextProjectiles.push(p);
      }
      sim.projectiles = nextProjectiles;
      sim.troops = sim.troops.filter(t => t.hp > 0);

      // 6) Recompute CoC Destruction %, Town Hall Star & Total Stars
      const scoreBuildings = sim.buildings.filter(b => !b.isWall);
      const destroyedCount = scoreBuildings.filter(b => b.hp <= 0).length;
      const newPct = Math.round((destroyedCount / Math.max(1, scoreBuildings.length)) * 100);
      const th = sim.buildings.find(b => b.kind === 'town_hall');
      const thDown = Boolean(th && th.hp <= 0);

      if (thDown && !sim.townHallDestroyed) {
        sim.townHallDestroyed = true;
        addLog(`💥 捷报！[${targetCity.name}] 主城大本营轰然坍塌，夺得关键大本星 ★！`);
        setScreenShake('heavy');
        setTimeout(() => setScreenShake('none'), 350);
      }

      if (newPct >= 50 && sim.destructionPct < 50) {
        addLog('⭐ 摧毁度突破 50%，稳稳摘得一星 ★！');
      }

      sim.destructionPct = newPct;
      sim.stars = (newPct >= 50 ? 1 : 0) + (thDown ? 1 : 0) + (newPct >= 100 ? 1 : 0);
      sim.lootGold = Math.round(newPct * 8 + (thDown ? 240 : 0));

      // Check 100% 3-Star Victory or Full Army Wipe
      if (newPct >= 100) {
        sim.phase = 'victory';
        setBattlePhase('victory');
        if (soundEnabledRef.current) playUnifiedVictorySound();
        addLog(`🏆 100% 三星横扫平推！！！[${targetCity.name}] 营寨化作焦土，掠得军饷 ${sim.lootGold} 金！`);
      } else {
        const remainingCards =
          sim.deckCounts.barbarian +
          sim.deckCounts.archer +
          sim.deckCounts.giant +
          sim.deckCounts.wall_breaker +
          sim.deckCounts.hero;
        if (remainingCards === 0 && sim.troops.length === 0) {
          const outcome = sim.stars >= 1 ? 'victory' : 'defeat';
          sim.phase = outcome;
          setBattlePhase(outcome);
          if (outcome === 'victory') {
            if (soundEnabledRef.current) playUnifiedVictorySound();
            addLog(`🎉 全军力战到底！最终收获 ${sim.stars} ★ (${newPct}%)，成功攻破 [${targetCity.name}]！`);
          } else {
            if (soundEnabledRef.current) playUnifiedDefeatSound();
            addLog(`💀 全军覆没！摧毁度止步 ${newPct}%，未能摘星，只能退军！`);
          }
        }
      }

      setSnap(toSnapshot(sim));
    }, 33);

    return () => clearInterval(timer);
  }, [battlePhase, targetCity.name, weatherId]);

  const handleVictoryClose = () => {
    const relList = [
      { name: '方天画戟 (Double Crescent Halberd)' },
      { name: '青龙偃月刀 (Green Dragon Blade)' },
      { name: '赤兔神驹 (Legendary Red Hare)' },
      { name: '青釭宝剑 (Peerless Qinggang Sword)' },
      { name: '诸葛连弩 (Prime Zhuge Arbalest)' },
    ];
    const chosenRelic = relList[Math.floor(Math.random() * relList.length)];
    const goldRewarded = Math.max(450, snap.lootGold + snap.stars * 180);
    onBattleComplete('attacker', goldRewarded, chosenRelic.name, targetCity.id);
  };

  const handleDefeatClose = () => {
    onBattleComplete('defender', -150, undefined, targetCity.id);
  };

  const totalRemainingTroops =
    snap.deckCounts.barbarian +
    snap.deckCounts.archer +
    snap.deckCounts.giant +
    snap.deckCounts.wall_breaker +
    snap.deckCounts.hero;

  const mins = Math.floor(snap.timeRemaining / 60);
  const secs = snap.timeRemaining % 60;
  const clockFormatted = `${mins}:${String(secs).padStart(2, '0')}`;

  return (
    <div
      id="war-mode-panel"
      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col min-h-[620px] transition-all relative"
    >
      {/* div:nth-of-type(1) — Visual Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-900 flex justify-between items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/25 via-slate-950 to-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/15 border border-amber-500/35 rounded-xl flex items-center justify-center text-amber-400">
            <Sword size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-700/40 font-bold">
                CLASH SIEGE
              </span>
              <span className="text-xs font-serif font-black tracking-tight text-amber-400">
                {originCity.name} ⚔️ {targetCity.name} 部落掠夺攻城战
              </span>
            </div>
            <h2 className="text-sm font-serif font-black text-slate-100 mt-0.5 leading-relaxed">
              实时点兵破寨：{attackingOfficer?.name || '攻城主帅'} 强袭 {defendingOfficer?.name || '守城宿将'} 营盘
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono text-slate-500 block">节令与天象</span>
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-xs text-emerald-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-bold font-mono">
                {activeSeason.icon} {activeSeason.name}
              </span>
              <span className="text-xs text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-bold font-serif">
                {{
                  sunny: '☀️ 晴空万里',
                  rainy: '🌧️ 细雨湿道',
                  heavy_rain: '⛈️ 狂澜暴雨',
                  windy: '💨 朔北狂风',
                  foggy: '🌫️ 晨烟薄雾',
                  dense_fog: '🌁 弥天浓雾',
                  snow: '❄️ 冰雪封疆',
                }[weatherId] || '☀️ 晴空万里'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 hover:text-rose-400 rounded-lg text-slate-500 transition-colors cursor-pointer"
            title="退出战役"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* div:nth-of-type(2) — Main Clash of Clans 3-Column Battle Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 p-5">
        {/* div:nth-of-type(1) — LEFT: Commander & Raid Star Status (Span 3) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 relative">
            <div className="absolute top-0 right-0 p-2 bg-amber-500/10 text-amber-400 text-[9px] font-mono rounded-bl font-black uppercase">
              掠夺指挥
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase block">攻城统帅</span>
            <h3 className="text-sm font-serif font-black text-slate-200 mt-1 flex items-center gap-1.5">
              👑 {attackingOfficer?.name || '在野义军大将'}
            </h3>

            {seasonalAttacker && (
              <div className="grid grid-cols-3 gap-2 mt-3 font-mono text-[10px] text-center">
                <div className="p-1 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-500 block">统帅</span>
                  <strong className="text-teal-400">{seasonalAttacker.stats.leadership}</strong>
                </div>
                <div className="p-1 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-500 block">武力</span>
                  <strong className="text-amber-400">{seasonalAttacker.stats.force}</strong>
                </div>
                <div className="p-1 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-500 block">智谋</span>
                  <strong className="text-indigo-400">{seasonalAttacker.stats.intelligence}</strong>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={triggerHeroAbility}
              disabled={!snap.heroDeployed || snap.heroAbilityUsed || battlePhase !== 'fighting'}
              className="w-full mt-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 disabled:from-slate-900 disabled:to-slate-900 disabled:border-slate-800 disabled:opacity-45 text-slate-950 disabled:text-slate-500 py-2 rounded-lg text-xs font-serif font-black flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer border border-amber-400/30"
            >
              <Sparkles size={12} />
              {snap.heroAbilityUsed
                ? '✓ 英雄铁拳已爆发'
                : snap.heroDeployed
                ? '🔥 发动英雄狂暴铁拳!'
                : '需先部署无双主将上阵'}
            </button>
          </div>

          {/* 3-Star Raid Objectives Card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2.5">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block font-bold">
              ★ 部落战夺星条件
            </span>
            <div className="space-y-1.5 text-xs font-serif">
              <div
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border ${
                  snap.destructionPct >= 50
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400'
                }`}
              >
                <span>★ 摧毁建筑达 50%</span>
                <span className="font-mono font-bold">{snap.destructionPct}%</span>
              </div>
              <div
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border ${
                  snap.townHallDestroyed
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400'
                }`}
              >
                <span>★ 摧毁主城大本营</span>
                <span className="font-mono font-bold">
                  {snap.townHallDestroyed ? '已陷落' : '坚守中'}
                </span>
              </div>
              <div
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border ${
                  snap.destructionPct >= 100
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400'
                }`}
              >
                <span>★ 100% 平推三冠</span>
                <span className="font-mono font-bold">
                  {snap.destructionPct >= 100 ? '三星!' : '待完成'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-900 flex justify-between text-[11px] font-mono">
              <span className="text-slate-500">待遣兵力</span>
              <strong className="text-emerald-400">{totalRemainingTroops} 队</strong>
            </div>
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-500">战利掠夺金</span>
              <strong className="text-yellow-400">+{snap.lootGold} 金</strong>
            </div>
          </div>
        </div>

        {/* div:nth-of-type(2) — MIDDLE: CLASH OF CLANS REAL-TIME RAID ARENA (Focused Target!) */}
        <div
          data-testid="coc-battlefield-column"
          className="lg:col-span-7 bg-slate-950 border-2 border-amber-500/25 p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden min-h-[660px] shadow-2xl"
        >
          {/* Top Clash Destruction %, Stars & Raid Timer HUD */}
          <div
            data-testid="coc-raid-hud"
            className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 z-10"
          >
            {/* 3-Star Meter + Destruction % */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1" data-testid="coc-stars-meter">
                {[1, 2, 3].map(idx => (
                  <Star
                    key={idx}
                    size={20}
                    className={
                      snap.stars >= idx
                        ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.85)]'
                        : 'text-slate-700 fill-slate-900'
                    }
                  />
                ))}
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block leading-none">
                  总体摧毁度
                </span>
                <strong
                  data-testid="coc-destruction-pct"
                  className="text-lg font-mono font-black text-amber-300 leading-tight"
                >
                  {snap.destructionPct}%
                </strong>
              </div>
              <div className="w-24 sm:w-32 h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                <div
                  style={{ width: `${snap.destructionPct}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-[width] duration-150"
                />
              </div>
            </div>

            {/* Raid Countdown & Quick Deploy Actions */}
            <div className="flex items-center gap-2">
              <div
                data-testid="coc-raid-timer"
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-amber-500/40 font-mono text-xs font-black text-amber-300"
              >
                ⏱️ {clockFormatted}
              </div>
              <button
                type="button"
                onClick={handleAllInDeploy}
                disabled={totalRemainingTroops === 0 || battlePhase !== 'fighting'}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white text-[11px] font-serif font-black cursor-pointer shadow active:scale-95"
              >
                ⚡ 全军一键突袭
              </button>
            </div>
          </div>

          {/* Interactive Clash of Clans Village Battlefield (#war-live-arena) */}
          <motion.div
            ref={arenaRef}
            id="war-live-arena"
            data-testid="coc-village-arena"
            onClick={handleArenaClick}
            className="relative w-full my-2.5 aspect-[4/3] min-h-[410px] rounded-2xl overflow-hidden border-2 border-emerald-900/70 select-none cursor-crosshair shadow-[inset_0_0_50px_rgba(0,0,0,0.45)]"
            style={{
              backgroundColor: '#254a28',
              backgroundImage:
                'radial-gradient(ellipse at center, rgba(74, 140, 74, 0.38) 0%, rgba(30, 62, 34, 0.92) 85%), repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 34px, transparent 34px, transparent 68px), repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 34px, transparent 34px, transparent 68px)',
            }}
            animate={
              screenShake === 'heavy'
                ? { x: [-7, 7, -5, 5, 0], y: [-3, 3, 0] }
                : screenShake === 'light'
                ? { x: [-3, 3, 0], y: [-1, 1, 0] }
                : { x: 0, y: 0 }
            }
            transition={{ duration: 0.24 }}
          >
            {/* Outer Red-Dashed Village Boundary / Deployment Zone */}
            <div className="absolute inset-4 rounded-xl border-2 border-dashed border-rose-400/35 pointer-events-none">
              <div className="absolute inset-0 rounded-xl bg-amber-950/10" />
            </div>

            {/* Scouting Prompt Banner (before first troop deployed) */}
            {!snap.raidStarted && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 pointer-events-none bg-slate-950/90 border border-amber-400/60 px-4 py-1.5 rounded-full text-[11px] font-serif font-bold text-amber-200 shadow-xl whitespace-nowrap">
                🎯 点击草地任意位置空降兵力或法术，立即开战！
              </div>
            )}

            {/* Cobblestone Village Courtyard Paths */}
            <div className="absolute left-[27%] right-[16%] top-[48%] h-3 bg-stone-500/20 rounded-full pointer-events-none" />
            <div className="absolute left-[53%] top-[18%] bottom-[18%] w-3 bg-stone-500/20 rounded-full pointer-events-none" />

            {/* Active Spell Rings (Rage & Heal) */}
            {snap.spells.map(sp => (
              <div
                key={sp.id}
                data-testid={`coc-spell-${sp.kind}`}
                style={{
                  left: `${sp.x}%`,
                  top: `${sp.y}%`,
                  width: `${sp.radius * 2}%`,
                  height: `${sp.radius * 2}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute rounded-full border-2 pointer-events-none z-15 animate-pulse ${
                  sp.kind === 'rage_spell'
                    ? 'border-purple-400 bg-purple-500/25 shadow-[0_0_24px_rgba(168,85,247,0.65)]'
                    : 'border-emerald-300 bg-emerald-400/25 shadow-[0_0_24px_rgba(52,211,153,0.65)]'
                }`}
              />
            ))}

            {/* Village Defense & Resource Buildings */}
            {snap.buildings.map(b => {
              const destroyed = b.hp <= 0;
              const hpPct = Math.max(0, Math.min(100, (b.hp / b.maxHp) * 100));

              return (
                <div
                  key={b.id}
                  data-testid={`coc-building-${b.kind}`}
                  style={{
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                    width: `${b.size}px`,
                    height: `${b.size}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  title={`${b.name} (${Math.round(b.hp)}/${b.maxHp})`}
                  className="absolute flex flex-col items-center justify-center pointer-events-none z-20"
                >
                  {destroyed ? (
                    <div className="w-full h-full rounded-lg bg-stone-900/80 border border-stone-700/60 flex items-center justify-center text-sm opacity-65">
                      {b.isWall ? '🪨' : '🔥'}
                    </div>
                  ) : (
                    <div
                      className={`w-full h-full rounded-xl border-2 flex flex-col items-center justify-center relative shadow-lg transition-transform ${
                        b.hitFlash > 0 ? 'scale-95 brightness-150 border-white' : ''
                      } ${
                        b.kind === 'town_hall'
                          ? 'bg-gradient-to-b from-amber-800 to-stone-900 border-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.45)]'
                          : b.isDefense
                          ? 'bg-slate-900/95 border-rose-500/80'
                          : b.isWall
                          ? 'bg-stone-700 border-stone-400/75 rounded-md'
                          : 'bg-amber-950/90 border-yellow-500/70'
                      }`}
                    >
                      <span
                        className={
                          b.kind === 'town_hall'
                            ? 'text-2xl leading-none'
                            : b.isWall
                            ? 'text-sm leading-none'
                            : 'text-lg leading-none'
                        }
                      >
                        {b.icon}
                      </span>
                      {b.kind === 'town_hall' && (
                        <span className="text-[8px] font-serif font-black text-amber-300 mt-0.5 leading-none">
                          大本营
                        </span>
                      )}

                      {/* Building HP Bar */}
                      {b.hp < b.maxHp && (
                        <div className="absolute -top-2 inset-x-0.5 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-black/60">
                          <div
                            style={{ width: `${hpPct}%` }}
                            className={`h-full ${b.isDefense ? 'bg-rose-500' : 'bg-amber-400'}`}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Deployed Autonomous Troops */}
            {snap.troops.map(tr => {
              const hpPct = Math.max(0, Math.min(100, (tr.hp / tr.maxHp) * 100));
              return (
                <div
                  key={tr.id}
                  data-testid={`coc-troop-${tr.kind}`}
                  style={{
                    left: `${tr.x}%`,
                    top: `${tr.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute flex flex-col items-center pointer-events-none z-30"
                >
                  {/* Troop HP Bar */}
                  <div className="w-7 h-1 bg-slate-950 rounded-full overflow-hidden mb-0.5 border border-black/70">
                    <div
                      style={{ width: `${hpPct}%` }}
                      className="h-full bg-emerald-400"
                    />
                  </div>
                  <div
                    style={{
                      transform: `scaleX(${tr.facing}) scale(${tr.attackFlash > 0 ? 1.2 : 1})`,
                    }}
                    className={`rounded-full flex items-center justify-center shadow-md border ${
                      tr.kind === 'hero'
                        ? 'w-9 h-9 bg-amber-900 border-yellow-300 text-lg shadow-[0_0_14px_rgba(250,204,21,0.7)]'
                        : tr.kind === 'giant'
                        ? 'w-8 h-8 bg-emerald-900 border-emerald-400 text-base'
                        : 'w-6 h-6 bg-slate-900 border-sky-400 text-xs'
                    } ${tr.ragedTicks > 0 ? 'ring-2 ring-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.9)]' : ''}`}
                  >
                    {tr.icon}
                  </div>
                </div>
              );
            })}

            {/* Flying Projectiles (Arrows, Cannonballs, Mortar Shells) */}
            {snap.projectiles.map(p => (
              <div
                key={p.id}
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute pointer-events-none z-40"
              >
                {p.kind === 'mortar' ? (
                  <span className="text-base drop-shadow-[0_0_8px_rgba(249,115,22,0.95)]">☄️</span>
                ) : p.kind === 'cannonball' ? (
                  <div className="w-3 h-3 rounded-full bg-slate-950 border border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)]" />
                ) : (
                  <div className="w-2.5 h-1 rounded-full bg-amber-300 shadow-[0_0_6px_rgba(253,224,71,0.95)]" />
                )}
              </div>
            ))}

            {/* Floating Damage / Heal / Explosion Text */}
            <AnimatePresence>
              {floatingBadges.map(fb => (
                <motion.span
                  key={fb.id}
                  initial={{ opacity: 1, y: 0, scale: 0.7 }}
                  animate={{ opacity: 0, y: -22, scale: 1.15 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.75, ease: 'easeOut' }}
                  style={{ left: `${fb.x}%`, top: `${fb.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 text-xs font-mono font-black whitespace-nowrap drop-shadow-[0_2px_3px_rgba(0,0,0,0.95)] ${
                    fb.tone === 'heal'
                      ? 'text-emerald-300'
                      : fb.tone === 'boom'
                      ? 'text-amber-300 text-sm'
                      : 'text-rose-400'
                  }`}
                >
                  {fb.text}
                </motion.span>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Clash-Style Troop & Spell Deployment Deck */}
          <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-900 z-10">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>
                🃏 选定兵卡：
                <strong className="text-amber-300 ml-1">
                  {TROOP_DECK_META.find(m => m.id === selectedCard)?.icon}{' '}
                  {TROOP_DECK_META.find(m => m.id === selectedCard)?.name}
                </strong>
                （点击上方营地外围空降）
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetRaid}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10.5px] text-slate-300 cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw size={10} /> 重开攻城
                </button>
                <button
                  id="btn-war-end-turn"
                  type="button"
                  onClick={concludeBattleEarly}
                  disabled={battlePhase !== 'fighting' || !snap.raidStarted}
                  className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-[10.5px] font-serif font-bold cursor-pointer"
                >
                  🔔 鸣金结算 ({snap.stars}★)
                </button>
              </div>
            </div>

            <div
              data-testid="coc-troop-deck"
              className="grid grid-cols-4 sm:grid-cols-7 gap-2"
            >
              {TROOP_DECK_META.map(card => {
                const count = snap.deckCounts[card.id];
                const isSelected = selectedCard === card.id;
                const depleted = count <= 0;

                return (
                  <button
                    key={card.id}
                    type="button"
                    data-testid={`coc-card-${card.id}`}
                    disabled={depleted || battlePhase !== 'fighting'}
                    onClick={() => setSelectedCard(card.id)}
                    className={`relative rounded-xl p-2 border text-left transition flex flex-col items-center gap-0.5 cursor-pointer ${
                      depleted
                        ? 'bg-slate-900/40 border-slate-800/60 opacity-40 grayscale cursor-not-allowed'
                        : isSelected
                        ? `${card.colorClass} ring-2 ring-amber-400 -translate-y-1 shadow-lg`
                        : 'bg-slate-900 border-slate-800 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-slate-950 border border-amber-500/60 text-[10px] font-mono font-black text-amber-300">
                      ×{count}
                    </span>
                    <span className="text-xl leading-none mt-0.5">{card.icon}</span>
                    <span className="text-[10.5px] font-serif font-black truncate w-full text-center mt-0.5">
                      {card.name}
                    </span>
                    <span className="text-[8.5px] font-mono text-slate-400 leading-none">
                      {card.badgeText}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* div:nth-of-type(3) — RIGHT: Live Raid Chronicle (Span 2) */}
        <div className="lg:col-span-2 flex flex-col justify-between bg-slate-950 p-4 rounded-xl border border-slate-900 lg:min-h-[660px]">
          <div className="flex justify-between items-center border-b border-slate-900 pb-2 mb-2">
            <span className="text-xs font-serif font-black text-amber-400 flex items-center gap-1">
              ⚔️ 掠夺战报
            </span>
            <span className="text-[9px] font-mono text-slate-500 uppercase">Raid Log</span>
          </div>

          <div className="flex-1 overflow-y-auto text-[11px] font-mono space-y-1.5 pr-1 lg:max-h-[492px] scrollbar-thin bg-slate-950/20 p-2 rounded-xl border border-slate-800">
            {battleLogs.map((log, idx) => {
              let textColClass = 'text-slate-300';
              if (log.includes('💥') || log.includes('⚡') || log.includes('⭐'))
                textColClass = 'text-amber-300 font-bold';
              if (log.includes('🏆') || log.includes('🎉') || log.includes('👑'))
                textColClass = 'text-emerald-400 font-bold';
              if (log.includes('💀')) textColClass = 'text-rose-400';

              return (
                <p
                  key={idx}
                  className={`leading-relaxed border-b border-slate-800/30 pb-1.5 ${textColClass}`}
                >
                  {log}
                </p>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-900 mt-2 grid grid-cols-2 gap-2 text-center text-[10px] font-mono">
            <div className="bg-slate-900/60 p-1 rounded border border-slate-800">
              <span className="text-slate-500 text-[9px] block">突袭部落</span>
              <strong style={{ color: attackerFaction.color }}>{attackerFaction.name}</strong>
            </div>
            <div className="bg-slate-900/60 p-1 rounded border border-slate-800">
              <span className="text-slate-500 text-[9px] block">守寨营垒</span>
              <strong style={{ color: defenderFaction.color }}>{defenderFaction.name}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Victory Overlay Banner Modal */}
      {battlePhase === 'victory' && (
        <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center z-50">
          <div className="max-w-md bg-slate-900 p-8 rounded-3xl border border-emerald-500/30 text-center space-y-5 shadow-2xl">
            <Trophy size={56} className="text-yellow-400 mx-auto animate-bounce" />
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map(idx => (
                <Star
                  key={idx}
                  size={28}
                  className={
                    snap.stars >= idx
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-700 fill-slate-800'
                  }
                />
              ))}
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-black">
                【{snap.stars} 星掠夺大捷 · {snap.destructionPct}% 摧毁】
              </span>
              <h3 className="text-xl md:text-2xl font-serif font-black text-slate-50">
                夺关平寨：战功赫赫！
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                军团强袭 <strong>[{targetCity.name}]</strong> 营寨大获全胜，城防已归【{attackerFaction.name}】节制！
              </p>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">战利掠夺黄金:</span>
                <strong className="text-yellow-400 font-bold">
                  + {Math.max(450, snap.lootGold + snap.stars * 180)} Gold
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">势力版图归属:</span>
                <strong className="text-emerald-300">
                  {targetCity.name} 归入【{attackerFaction.name}】
                </strong>
              </div>
            </div>
            <button
              id="btn-war-claim-victory"
              type="button"
              onClick={handleVictoryClose}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-100 text-xs font-bold py-3.5 px-6 rounded-xl transition cursor-pointer"
            >
              班师回朝 · 领取战利品
            </button>
          </div>
        </div>
      )}

      {/* Defeat Overlay Banner Modal */}
      {battlePhase === 'defeat' && (
        <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center z-50">
          <div className="max-w-md bg-slate-900 p-8 rounded-3xl border border-rose-500/30 text-center space-y-5 shadow-2xl">
            <AlertTriangle size={56} className="text-rose-500 mx-auto animate-pulse" />
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-rose-400 uppercase tracking-widest font-black">
                【0 星折戟 · 突袭失利】
              </span>
              <h3 className="text-xl md:text-2xl font-serif font-black text-slate-50">
                营防坚固：暂退整军！
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                <strong>[{targetCity.name}]</strong> 炮火猛烈，此次突袭摧毁度为 {snap.destructionPct}%，未能摘下战星。城池仍由【{defenderFaction.name}】坚守！
              </p>
            </div>
            <button
              id="btn-war-claim-defeat"
              type="button"
              onClick={handleDefeatClose}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold py-3 px-6 rounded-xl border border-slate-700 transition cursor-pointer"
            >
              整顿余部 · 返回沙盘
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
