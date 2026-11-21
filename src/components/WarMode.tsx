import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sword, Shield, Flame, Play, Volume2, VolumeX, X, Trophy, AlertTriangle, 
  Sparkles, Compass, Target, ArrowRight, RefreshCw, ChevronRight, User, ShieldAlert
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
  onBattleComplete: (winner: 'attacker' | 'defender', goldReward: number, epicRelic?: string, conqueredCityId?: string) => void;
  onClose: () => void;
}

interface Unit {
  id: string;
  name: string;
  type: 'infantry' | 'cavalry' | 'archers' | 'ram';
  icon: string;
  row: number;
  col: number;
  maxHp: number;
  hp: number;
  atk: number;
  def: number;
  canMoveTwo: boolean;
  activeBuffs: { type: 'shield_wall' | 'burning' | 'double_atk'; duration: number }[];
  isDead: boolean;
  description: string;
}

interface EnemyUnit {
  id: string;
  name: string;
  type: 'patrol_infantry' | 'patrol_cavalry' | 'gate' | 'wall_archer';
  icon: string;
  row: number;
  col: number;
  maxHp: number;
  hp: number;
  atk: number;
  def: number;
  activeBuffs: { type: 'burning' | 'stunned'; duration: number }[];
  isDead: boolean;
}

interface Projectile {
  id: string;
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  type: 'arrow' | 'slash' | 'fire' | 'stone' | 'ram';
}

interface FloatingEffect {
  id: string;
  x: number;
  y: number;
  content: string;
  color: string;
}

interface ImpactBurst {
  id: string;
  x: number;
  y: number;
  kind: 'arrow' | 'slash' | 'fire' | 'stone' | 'ram';
}

interface UnitMotion {
  dx: number;
  dy: number;
  mode: 'lunge' | 'hit';
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
  onBattleComplete,
  onClose
}: WarModeProps) {
  const activeSeason = SEASONS[seasonId];
  const seasonalAttacker = attackingOfficer ? applySeasonalOfficerModifiers(attackingOfficer, seasonId) : null;
  const seasonalDefender = defendingOfficer ? applySeasonalOfficerModifiers(defendingOfficer, seasonId) : null;
  // Battle state constants
  const GRID_ROWS = 20;
  const GRID_COLS = 20; // 0-3: Player Base, 4-11: Mid-Field, 12-18: Moat Outskirts, 19: Wall & Gate

  // Combat States
  const [turn, setTurn] = useState(1);
  const [maxTurns] = useState(15);
  const [actionPoints, setActionPoints] = useState(3);
  const [maxActionPoints] = useState(3);
  const [battlePhase, setBattlePhase] = useState<'intro' | 'fighting' | 'victory' | 'defeat'>('intro');
  const [battleLogs, setBattleLogs] = useState<string[]>([]);
  
  // Tactical General Skill
  const [tacticUsed, setTacticUsed] = useState(false);

  // Player units
  const [playerUnits, setPlayerUnits] = useState<Unit[]>([]);
  // Enemy units
  const [enemyUnits, setEnemyUnits] = useState<EnemyUnit[]>([]);

  // Selection states
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [showMoveTargets, setShowMoveTargets] = useState<{row: number, col: number}[]>([]);
  const [showAttackTargets, setShowAttackTargets] = useState<{row: number, col: number}[]>([]);
  const [viewPerspective, setViewPerspective] = useState<'tactical' | 'diorama'>('tactical');
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  // 2D Animation feedback states
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [floatingEffects, setFloatingEffects] = useState<FloatingEffect[]>([]);
  const [impactBursts, setImpactBursts] = useState<ImpactBurst[]>([]);
  const [unitMotions, setUnitMotions] = useState<Record<string, UnitMotion>>({});
  const [screenShake, setScreenShake] = useState<'none' | 'light' | 'heavy'>('none');

  // Helper to trigger 2D sliding projectile animations, unit lunge/hit recoil, impact shockwaves, & floating damage numbers
  const triggerCombatFeedback = (
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    projType: 'arrow' | 'slash' | 'fire' | 'stone' | 'ram',
    dmgText: string,
    dmgColor: string = 'text-rose-500 font-extrabold text-base',
    options?: { attackerId?: string; targetId?: string; delayMs?: number }
  ) => {
    const startDelay = options?.delayMs ?? 0;
    const travelMs = projType === 'slash' ? 320 : projType === 'ram' ? 380 : 480;

    setTimeout(() => {
      const projId = 'proj_' + Math.random().toString(36).substr(2, 9);
      const effectId = 'effect_' + Math.random().toString(36).substr(2, 9);
      const burstId = 'burst_' + Math.random().toString(36).substr(2, 9);

      const dCol = toCol - fromCol;
      const dRow = toRow - fromRow;
      const len = Math.hypot(dCol, dRow) || 1;
      // Screen-space projected unit nudge (isometric X flows diagonally across screen)
      const lungeDist = projType === 'slash' || projType === 'ram' ? 14 : 6;
      const recoilDist = projType === 'ram' || projType === 'stone' ? 12 : 8;
      const nx = dCol / len;
      const ny = dRow / len;

      if (options?.attackerId) {
        const atkId = options.attackerId;
        setUnitMotions(prev => ({
          ...prev,
          [atkId]: { dx: Math.round(nx * lungeDist), dy: Math.round(ny * lungeDist * 0.6), mode: 'lunge' }
        }));
        setTimeout(() => {
          setUnitMotions(prev => {
            if (!prev[atkId] || prev[atkId].mode !== 'lunge') return prev;
            const next = { ...prev };
            delete next[atkId];
            return next;
          });
        }, 260);
      }

      // Add projectile
      setProjectiles(prev => [...prev, {
        id: projId,
        fromRow,
        fromCol,
        toRow,
        toCol,
        type: projType
      }]);

      // After projectile lands, remove projectile, trigger target recoil/flash, shockwave ring, floating dmg & screen shake
      setTimeout(() => {
        setProjectiles(prev => prev.filter(p => p.id !== projId));

        const targetPercentX = (toCol * (100 / GRID_COLS)) + (100 / GRID_COLS / 2);
        const targetPercentY = (toRow * (100 / GRID_ROWS)) + (100 / GRID_ROWS / 2);

        setImpactBursts(prev => [...prev, {
          id: burstId,
          x: targetPercentX,
          y: targetPercentY,
          kind: projType
        }]);
        setTimeout(() => {
          setImpactBursts(prev => prev.filter(b => b.id !== burstId));
        }, 520);

        if (options?.targetId) {
          const tgtId = options.targetId;
          setUnitMotions(prev => ({
            ...prev,
            [tgtId]: { dx: Math.round(nx * recoilDist), dy: Math.round(ny * recoilDist * 0.6), mode: 'hit' }
          }));
          setTimeout(() => {
            setUnitMotions(prev => {
              if (!prev[tgtId] || prev[tgtId].mode !== 'hit') return prev;
              const next = { ...prev };
              delete next[tgtId];
              return next;
            });
          }, 300);
        }

        setFloatingEffects(prev => [...prev, {
          id: effectId,
          x: targetPercentX,
          y: targetPercentY,
          content: dmgText,
          color: dmgColor
        }]);

        if (projType === 'ram' || projType === 'stone') {
          setScreenShake('heavy');
          setTimeout(() => setScreenShake('none'), 420);
        } else if (projType === 'fire' || projType === 'slash') {
          setScreenShake('light');
          setTimeout(() => setScreenShake('none'), 280);
        }

        // Remove damage float indicator after 1.15s
        setTimeout(() => {
          setFloatingEffects(prev => prev.filter(f => f.id !== effectId));
        }, 1150);
      }, travelMs);
    }, startDelay);
  };

  // Sound presets routed through unified audio engine
  const playMoveSound = () => { if (soundEnabled) playUnifiedMoveSound(); };
  const playAttackSound = (projType: 'arrow' | 'slash' | 'fire' | 'stone' | 'ram' = 'slash') => {
    if (!soundEnabled) return;
    if (projType === 'arrow') playArrowSound();
    else if (projType === 'fire') playFireSound();
    else if (projType === 'ram' || projType === 'stone') playHeavyImpactSound();
    else playUnifiedClashSound();
  };
  const playSkillSound = () => { if (soundEnabled) playHealSound(); };
  const playDefeatSound = () => { if (soundEnabled) playUnifiedDefeatSound(); };
  const playVictorySound = () => { if (soundEnabled) playUnifiedVictorySound(); };

  // Set up scenario elements & initialize units
  const initBattle = () => {
    // Generate Stats based on seasonal-modified leaders' core attributes
    const atkLdrMod = seasonalAttacker ? Math.floor((seasonalAttacker.stats.leadership - 60) / 4) : 5;
    const atkForMod = seasonalAttacker ? Math.floor((seasonalAttacker.stats.force - 60) / 4) : 5;
    const defLdrMod = seasonalDefender ? Math.floor((seasonalDefender.stats.leadership - 60) / 4) : 5;
    const defPolMod = seasonalDefender ? Math.floor((seasonalDefender.stats.intelligence - 60) / 4) : 5;

    // Weathers adjustments
    const weatherBuffsLog = {
      sunny: '☀️ 今日春和景明，骑士风驰：【骁骑营】突击破敌威力提升 20%！',
      rainy: '🌧️ 天降微雨，薪水微湿：【弩弓营】火箭威力微损，泥泞稍滞冲车。',
      heavy_rain: '⛈️ 狂澜暴雨倾盆，薪柴尽湿：【弩弓营】火计战法完全禁用！骑兵与冲车深陷泥沼，唯智力高超者可借水攻破城！',
      windy: '💨 朔风呼啸，风助火威：火箭爆裂引燃伤害提升！箭矢精度偶有偏斜。',
      foggy: '🌫️ 晨雾弥漫，奇兵遮锁：【步兵营】贴身肉搏将无视敌众 50% 防备甲胄！',
      dense_fog: '🌁 弥天重雾，咫尺莫辨：【步兵营】隐匿贴身无视敌众 75% 防甲！神机谋士可策动【八阵借雾】奇袭！',
      snow: '❄️ 冰雪漫野，严寒封塞：兵卒行动受滞，战阵需高统帅凝聚军心！'
    }[weatherId] || '☀️ 天候平稳，三军进击！';

    // Initial log
    setBattleLogs([
      `⚔️ 决战开始！攻方：[${attackerFaction.name}] ${attackingOfficer?.name || '无名义军'} 统御大军压境。`,
      `🛡️ 守方：[${defenderFaction.name}] ${defendingOfficer?.name || '守城宿将'} 严阵坚守 [${targetCity.name}] 城关！`,
      `${activeSeason.icon} 节令天象 [${activeSeason.name}]：${activeSeason.tacticalSummary}（${activeSeason.statSummary}）`,
      weatherBuffsLog,
      `📜 精兵布阵：攻方携冲车誓要夺门，两军关隘前，沙场生死各安天命！`
    ]);

    // Attackers
    setPlayerUnits([
      {
        id: 'infantry_1',
        name: '前军陷阵步兵',
        type: 'infantry',
        icon: '🛡️',
        row: 9,
        col: 2,
        maxHp: 400 + atkLdrMod * 6,
        hp: 400 + atkLdrMod * 6,
        atk: 65 + atkForMod * 1.5,
        def: 50 + atkLdrMod * 2,
        canMoveTwo: false,
        activeBuffs: [],
        isDead: false,
        description: '大盾坚甲，攻守兼备。使用【盾墙】防御远程暗箭，推进抵挡主力。'
      },
      {
        id: 'cavalry_1',
        name: '双翼突击轻骑',
        type: 'cavalry',
        icon: '🐎',
        row: 11,
        col: 2,
        maxHp: 320 + atkLdrMod * 4,
        hp: 320 + atkLdrMod * 4,
        atk: 90 + atkForMod * 2.5,
        def: 30 + atkLdrMod * 1,
        canMoveTwo: true,
        activeBuffs: [],
        isDead: false,
        description: '势如奔雷，疾驰纵横。特技【突击】对同排远处敌方发起巨额冲杀，对步骑克制明显。'
      },
      {
        id: 'archers_1',
        name: '白耳射声强弩',
        type: 'archers',
        icon: '🏹',
        row: 7,
        col: 1,
        maxHp: 280 + atkLdrMod * 3,
        hp: 280 + atkLdrMod * 3,
        atk: 75 + atkForMod * 2,
        def: 25 + atkLdrMod * 0.8,
        canMoveTwo: false,
        activeBuffs: [],
        isDead: false,
        description: '连弩齐攒，矢石如雨。特技【火箭】造成高额远程创伤，且能重燃并灼烧门阙！'
      },
      {
        id: 'ram_1',
        name: '攻城铁甲冲车',
        type: 'ram',
        icon: '🪵',
        row: 10,
        col: 1,
        maxHp: 500 + atkLdrMod * 10,
        hp: 500 + atkLdrMod * 10,
        atk: 20,
        def: 40 + atkLdrMod * 3,
        canMoveTwo: false,
        activeBuffs: [],
        isDead: false,
        description: '巍峨巨杠，克日崩门。近身抵达最右侧【主城门】格后，可施展大摧毁【撞砸主门】！'
      }
    ]);

    // Defenders
    setEnemyUnits([
      {
        id: 'enemy_patrol_1',
        name: `${defendingOfficer?.name || '守将'}麾下 刀盾巡备军`,
        type: 'patrol_infantry',
        icon: '👮',
        row: 8,
        col: 14,
        maxHp: 350 + defLdrMod * 5,
        hp: 350 + defLdrMod * 5,
        atk: 55 + defPolMod * 1.5,
        def: 40 + defLdrMod * 2,
        activeBuffs: [],
        isDead: false
      },
      {
        id: 'enemy_patrol_2',
        name: `${defendingOfficer?.name || '守将'}督骁 游弋重骑兵`,
        type: 'patrol_cavalry',
        icon: '🏇',
        row: 12,
        col: 14,
        maxHp: 300 + defLdrMod * 4,
        hp: 300 + defLdrMod * 4,
        atk: 75 + defPolMod * 2,
        def: 35 + defLdrMod * 1.5,
        activeBuffs: [],
        isDead: false
      },
      {
        id: 'enemy_wall_archer_1',
        name: '女墙垛口守城强弩手',
        type: 'wall_archer',
        icon: '🎯',
        row: 8,
        col: 19,
        maxHp: 150,
        hp: 150,
        atk: 55,
        def: 10,
        activeBuffs: [],
        isDead: false
      },
      {
        id: 'enemy_wall_archer_2',
        name: '垛堞伏射巨石滚木岗',
        type: 'wall_archer',
        icon: '🪨',
        row: 12,
        col: 19,
        maxHp: 150,
        hp: 150,
        atk: 60,
        def: 15,
        activeBuffs: [],
        isDead: false
      },
      {
        id: 'enemy_gate_1',
        name: '重闸拒马・铁甲主城门',
        type: 'gate',
        icon: '🏰',
        row: 10,
        col: 19,
        maxHp: 800 + defLdrMod * 12 + activeSeason.tacticalModifiers.defenseBonus * 8,
        hp: 800 + defLdrMod * 12 + activeSeason.tacticalModifiers.defenseBonus * 8,
        atk: 0,
        def: 60 + defLdrMod * 3 + activeSeason.tacticalModifiers.defenseBonus,
        activeBuffs: [],
        isDead: false
      }
    ]);

    setTurn(1);
    setActionPoints(3);
    setTacticUsed(false);
    setSelectedUnitId(null);
    setShowMoveTargets([]);
    setShowAttackTargets([]);
    setProjectiles([]);
    setFloatingEffects([]);
    setImpactBursts([]);
    setUnitMotions({});
    setScreenShake('none');
    setBattlePhase('fighting');
  };

  useEffect(() => {
    initBattle();
  }, [selectedCityIdFallback()]);

  function selectedCityIdFallback() {
    return targetCity.id + "-" + originCity.id + "-" + weatherId + "-" + seasonId;
  }

  // Handle player selection of units
  const handleUnitClick = (unit: Unit) => {
    if (battlePhase !== 'fighting') return;
    if (unit.isDead) return;

    if (selectedUnitId === unit.id) {
      // Toggle off
      setSelectedUnitId(null);
      setShowMoveTargets([]);
      setShowAttackTargets([]);
      return;
    }

    playMoveSound();
    setSelectedUnitId(unit.id);
    
    // Calculate possible move spaces (Up, Down, Left, Right)
    const moves: {row: number, col: number}[] = [];
    const adjacents = [
      { r: -1, c: 0 },
      { r: 1, c: 0 },
      { r: 0, c: -1 },
      { r: 0, c: 1 }
    ];

    if (unit.canMoveTwo) {
      // Cavalry can move up to 4 spaces on 20x20 grid
      for (let rDiff = -4; rDiff <= 4; rDiff++) {
        for (let cDiff = -4; cDiff <= 4; cDiff++) {
          if (Math.abs(rDiff) + Math.abs(cDiff) > 0 && Math.abs(rDiff) + Math.abs(cDiff) <= 4) {
            const tr = unit.row + rDiff;
            const tc = unit.col + cDiff;
            if (tr >= 0 && tr < GRID_ROWS && tc >= 0 && tc < GRID_COLS - 1) { // Cannot overlaps the castle wall col (4)
              moves.push({ row: tr, col: tc });
            }
          }
        }
      }
    } else {
      // Normal units can move up to 2 spaces on 20x20 grid
      for (let rDiff = -2; rDiff <= 2; rDiff++) {
        for (let cDiff = -2; cDiff <= 2; cDiff++) {
          if (Math.abs(rDiff) + Math.abs(cDiff) > 0 && Math.abs(rDiff) + Math.abs(cDiff) <= 2) {
            const tr = unit.row + rDiff;
            const tc = unit.col + cDiff;
            if (tr >= 0 && tr < GRID_ROWS && tc >= 0 && tc < GRID_COLS - 1) {
              moves.push({ row: tr, col: tc });
            }
          }
        }
      }
    }

    // Filter moves: can't move into a spot occupied by another active friendly unit
    const finalMoves = moves.filter(mv => 
      !playerUnits.some(pu => !pu.isDead && pu.id !== unit.id && pu.row === mv.row && pu.col === mv.col)
    );
    setShowMoveTargets(finalMoves);

    // Calculate possible attackers in range
    const attacks: {row: number, col: number}[] = [];
    enemyUnits.forEach(enemy => {
      if (enemy.isDead) return;

      const rDist = Math.abs(unit.row - enemy.row);
      const cDist = Math.abs(unit.col - enemy.col);

      if (unit.type === 'archers') {
        // Archers range is 6 (proportional to 20x20 grid)
        if (rDist + cDist <= 6) {
          attacks.push({ row: enemy.row, col: enemy.col });
        }
      } else if (unit.type === 'ram') {
        // Battering Ram can strike anything within 2 spaces in front on same row
        if (rDist === 0 && (cDist <= 2 || enemy.col === unit.col)) {
          attacks.push({ row: enemy.row, col: enemy.col });
        }
      } else {
        // General melee range changed to 2 on 20x20 grid
        if (rDist + cDist <= 2) {
          attacks.push({ row: enemy.row, col: enemy.col });
        }
      }
    });

    setShowAttackTargets(attacks);
  };

  // Perform unit movement
  const handleMoveTo = (row: number, col: number) => {
    if (actionPoints <= 0) {
      addLog('⚔️ 军令调度不足：本回合没有空闲行动令（AP）指挥将校！请直接结束回合或施策！');
      return;
    }

    const unit = playerUnits.find(u => u.id === selectedUnitId);
    if (!unit) return;

    // Is move target valid?
    if (!showMoveTargets.some(t => t.row === row && t.col === col)) return;

    playMoveSound();

    setPlayerUnits(prev => prev.map(u => {
      if (u.id === unit.id) {
        return { ...u, row, col };
      }
      return u;
    }));

    setActionPoints(p => p - 1);
    addLog(`🏃 指挥 [${unit.name}] 移防至 坐标 [${String.fromCharCode(65 + row)}${col + 1}] (${col <= 3 ? '后军营' : col <= 11 ? '平原川' : col <= 18 ? '护城堑' : '城阙墙'})。`);

    // Reset selection helper
    setSelectedUnitId(null);
    setShowMoveTargets([]);
    setShowAttackTargets([]);
  };

  // Execute attack command
  const handleAttack = (enemy: EnemyUnit) => {
    if (actionPoints <= 0) {
      addLog('⚔️ 三军鼓响震天，奈何调度用尽：行动令 AP 不足！');
      return;
    }

    const u = playerUnits.find(pu => pu.id === selectedUnitId);
    if (!u) return;

    // Verify distance
    if (!showAttackTargets.some(t => t.row === enemy.row && t.col === enemy.col)) return;

    playAttackSound();
    let dmg = Math.max(15, Math.floor(u.atk * (1 - enemy.def / 150) + Math.random() * 20));

    // Skill adjustments
    let skillText = '';
    
    // Weather and Intelligence tactical skill adjustments
    if (u.type === 'cavalry') {
      dmg = Math.floor(dmg * activeSeason.tacticalModifiers.cavalryMultiplier);
      if (weatherId === 'sunny') {
        dmg = Math.floor(dmg * 1.25);
        skillText = '⚡ 烈阳破袭：平川飞驰，骁骑突击威力倍增！';
      } else if (weatherId === 'heavy_rain') {
        dmg = Math.floor(dmg * 0.75);
        skillText = '⛈️ 泥泞陷蹄：暴雨深泽使战马陷入泥沼，冲势受挫！';
      } else if (weatherId === 'snow') {
        dmg = Math.floor(dmg * 0.8);
        skillText = '❄️ 冰雪封道：战马蹄下打滑，突击杀伤折损！';
      } else {
        skillText = '🐎 铁骑突袭破阵！';
      }
    }

    if (u.type === 'archers') {
      dmg = Math.floor(dmg * activeSeason.tacticalModifiers.archerMultiplier);
    }

    if (u.type === 'infantry') {
      if (weatherId === 'dense_fog') {
        // In dense fog, ignore 75% defense due to total concealment
        const rawArmorPenDmg = Math.floor(u.atk * (1 - (enemy.def * 0.25) / 150) + Math.random() * 35);
        dmg = Math.max(dmg, rawArmorPenDmg);
        skillText = '🌁 幽雾匿袭：步兵在弥天重雾中无声切近，透穿敌众 75% 甲胄！';
      } else if (weatherId === 'foggy') {
        // ignore 50% defense
        const rawArmorPenDmg = Math.floor(u.atk * (1 - (enemy.def * 0.5) / 150) + Math.random() * 20);
        dmg = Math.max(dmg, rawArmorPenDmg);
        skillText = '🌫️ 雾里藏刀：极速切入，刀锋无视敌众半数甲胄！';
      }
    }

    // High Intelligence commander stratagem in heavy rain (Water flooding gate/troops)
    if (weatherId === 'heavy_rain' && seasonalAttacker && seasonalAttacker.stats.intelligence >= 80) {
      const waterBonus = Math.floor(seasonalAttacker.stats.intelligence * 0.7);
      dmg += waterBonus;
      skillText += ` 🌊【水淹七军】军师借暴雨引波涛破寨 (+${waterBonus}水计伤害)！`;
    }

    // High Intelligence commander stratagem in dense fog (Ghost ambush)
    if (weatherId === 'dense_fog' && seasonalAttacker && seasonalAttacker.stats.intelligence >= 85) {
      const fogIntelBonus = Math.floor(seasonalAttacker.stats.intelligence * 0.85);
      dmg += fogIntelBonus;
      skillText += ` 👁️‍🗨️【八阵遁甲】鬼神莫测之伏兵奇袭 (+${fogIntelBonus}智谋暴击)！`;
    }

    if (u.type === 'ram' && enemy.type === 'gate') {
      dmg = Math.max(120, Math.floor(220 + Math.random() * 90 + (activeSeason.tacticalModifiers.siegeBonus - activeSeason.tacticalModifiers.defenseBonus) * 4));
      skillText = `💥 【冲车攻城】巨柱轰砸城闸（${activeSeason.icon}${activeSeason.name}攻城修正），闸门裂隙，石屑飞扬，守卒大惊！`;
    }

    // Apply double attack buff if active
    if (u.activeBuffs.some(b => b.type === 'double_atk')) {
      dmg *= 2;
      skillText += ' ⚔️【魏武神勇】伤害翻倍！';
    }

    // Shield check on enemy if gate
    if (enemy.type === 'gate') {
      // reduce damage heavily if infantry guards or patrols are still guarding the outskirts (col 12 to 18 on 20x20)
      const alivePatrols = enemyUnits.filter(e => !e.isDead && (e.col >= 12 && e.col <= 18));
      if (alivePatrols.length > 0 && u.type !== 'ram') {
        dmg = Math.floor(dmg * 0.35);
        skillText += ' 🛡️ [城堑守军尚在拦截，门阀难以直接触碰，威力扣减 65%]';
      }
    }

    // Apply 2D animation feedback & weapon-specific sound
    let projType: 'arrow' | 'slash' | 'fire' | 'stone' | 'ram' = 'slash';
    if (u.type === 'archers') {
      projType = 'arrow';
    } else if (u.type === 'ram') {
      projType = 'ram';
    }
    playAttackSound(projType);

    triggerCombatFeedback(
      u.row,
      u.col,
      enemy.row,
      enemy.col,
      projType,
      `-${dmg}`,
      'text-rose-500 font-serif font-black text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]',
      { attackerId: u.id, targetId: enemy.id }
    );

    // Apply Damage
    setEnemyUnits(prev => prev.map(e => {
      if (e.id === enemy.id) {
        const nextHp = Math.max(0, e.hp - dmg);
        return {
          ...e,
          hp: nextHp,
          isDead: nextHp <= 0
        };
      }
      return e;
    }));

    setActionPoints(p => p - 1);
    addLog(`💥 [${u.name}] 主动攻袭 [${enemy.name}]，造成了 【${dmg}】 点重创！${skillText}`);

    if (enemy.hp - dmg <= 0) {
      addLog(`💀 捷报：敌备 [${enemy.name}] 生死线土崩瓦解，悉数覆灭！`);
    }

    // Reset selection helper
    setSelectedUnitId(null);
    setShowMoveTargets([]);
    setShowAttackTargets([]);

    // Check Victory conditions after player attacks
    checkBattleResolution();
  };

  // Special active skills
  const handleSpecialSkill = (unit: Unit) => {
    if (actionPoints <= 0) {
      addLog('⚔️ 无法调度将校绝技：行动点 AP 不足！');
      return;
    }

    playSkillSound();

    if (unit.type === 'infantry') {
      // Shield wall
      setPlayerUnits(prev => prev.map(u => {
        if (u.id === unit.id) {
          return {
            ...u,
            activeBuffs: [...u.activeBuffs, { type: 'shield_wall', duration: 2 }]
          };
        }
        return u;
      }));

      // 2D animation feedback floating effect
      const uX = (unit.col * (100 / GRID_COLS)) + (100 / GRID_COLS / 2);
      const uY = (unit.row * (100 / GRID_ROWS)) + (100 / GRID_ROWS / 2);
      const fId = 'sh_' + Math.random().toString(36).substr(2, 9);
      setFloatingEffects(prev => [...prev, {
        id: fId,
        x: uX,
        y: uY,
        content: '🛡️ 鱼鳞盾墙结阵！',
        color: 'text-teal-400 font-serif font-black text-xs bg-slate-950/90 px-2 py-1 rounded-xl border border-teal-500/40 shadow-lg'
      }]);
      setTimeout(() => setFloatingEffects(prev => prev.filter(f => f.id !== fId)), 1500);

      setActionPoints(ap => ap - 1);
      addLog(`🛡️ [步兵营] 竖合严盾：【鱼鳞大盾墙】结阵！所受所有抛射矢石、滚木伤害大幅扣减 75% （持续 2 回合）！`);
    }

    else if (unit.type === 'archers') {
      if (weatherId === 'rainy' || weatherId === 'heavy_rain') {
        addLog(weatherId === 'heavy_rain' 
          ? '⛈️ 狂澜暴雨倾盆：江河暴涨，薪柴引火完全灭绝！火计遭到绝命封锁，无法引燃火矢！' 
          : '🌧️ 泥泽潮湿：漫天微雨打湿了火引燃薪！火计封锁，无法燃点火矢！');
        return;
      }

      // Check if gate or normal unit is in range (proportionally increased to 6 on 20x20 grid)
      const validTargets = enemyUnits.filter(e => !e.isDead && Math.abs(unit.row - e.row) + Math.abs(unit.col - e.col) <= 6);
      if (validTargets.length === 0) {
        addLog('🏹 白耳弩兵环顾，目前打击射程（3格）内，并无存活守城军资！');
        return;
      }

      // Fire Arrow at closest or gates
      const target = validTargets.find(t => t.type === 'gate') || validTargets[0];
      const fireDmg = Math.floor((40 + Math.random() * 30) * activeSeason.tacticalModifiers.firePowerMultiplier);
      playAttackSound('fire');

      // Trigger projectile and floating damage/burning feedback in 2D Space!
      triggerCombatFeedback(
        unit.row,
        unit.col,
        target.row,
        target.col,
        'fire',
        `-${fireDmg} 🔥`,
        'text-amber-500 font-serif font-black text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]',
        { attackerId: unit.id, targetId: target.id }
      );

      setEnemyUnits(prev => prev.map(e => {
        if (e.id === target.id) {
          return {
            ...e,
            hp: Math.max(0, e.hp - fireDmg),
            activeBuffs: [...e.activeBuffs, { type: 'burning', duration: 3 }],
            isDead: (e.hp - fireDmg) <= 0
          };
        }
        return e;
      }));

      setActionPoints(ap => ap - 1);
      addLog(`🔥 [弩弓营] 火引千钧！箭簇敷油燃火齐射 [${target.name}]（${activeSeason.icon}${activeSeason.name}火威×${activeSeason.tacticalModifiers.firePowerMultiplier}），打出 【${fireDmg}】 猛烧痛创！城池上空陷入烈火余晖灼烧！`);
    }

    else if (unit.type === 'cavalry') {
      // Cavalry fast double attack setup
      setPlayerUnits(prev => prev.map(u => {
        if (u.id === unit.id) {
          return {
            ...u,
            activeBuffs: [...u.activeBuffs, { type: 'double_atk', duration: 1 }]
          };
        }
        return u;
      }));

      // 2D animation feedback floating effect
      const uX = (unit.col * (100 / GRID_COLS)) + (100 / GRID_COLS / 2);
      const uY = (unit.row * (100 / GRID_ROWS)) + (100 / GRID_ROWS / 2);
      const fId = 'da_' + Math.random().toString(36).substr(2, 9);
      setFloatingEffects(prev => [...prev, {
        id: fId,
        x: uX,
        y: uY,
        content: '⚡ 武安蓄力 200% 暴击！',
        color: 'text-amber-400 font-serif font-black text-xs bg-slate-950/90 px-2 py-1 rounded-xl border border-amber-500/40 shadow-lg'
      }]);
      setTimeout(() => setFloatingEffects(prev => prev.filter(f => f.id !== fId)), 1500);

      setActionPoints(ap => ap - 1);
      addLog(`⚡ [骁骑营] 勒马啸天：武安突袭大统令！下一次极速贴身冲刺输出将爆发双倍 200% 电光暴击！`);
    }

    else if (unit.type === 'ram') {
      // Ram rapid repairing
      setPlayerUnits(prev => prev.map(u => {
        if (u.id === unit.id) {
          return {
            ...u,
            hp: Math.min(u.maxHp, u.hp + 120)
          };
        }
        return u;
      }));

      // 2D animation feedback floating effect
      const uX = (unit.col * (100 / GRID_COLS)) + (100 / GRID_COLS / 2);
      const uY = (unit.row * (100 / GRID_ROWS)) + (100 / GRID_ROWS / 2);
      const fId = 'rp_' + Math.random().toString(36).substr(2, 9);
      setFloatingEffects(prev => [...prev, {
        id: fId,
        x: uX,
        y: uY,
        content: '🛠️ 耐久度修复 +120',
        color: 'text-emerald-400 font-serif font-black text-xs bg-slate-950/90 px-2 py-1 rounded-xl border border-emerald-500/40 shadow-lg'
      }]);
      setTimeout(() => setFloatingEffects(prev => prev.filter(f => f.id !== fId)), 1500);

      setActionPoints(ap => ap - 1);
      addLog(`🛠️ 攻城工匠众志成城：随军配重铁板抢修，[冲车] 紧急缝补回满 【120】 点耐久度！`);
    }

    // Reset select
    setSelectedUnitId(null);
    setShowMoveTargets([]);
    setShowAttackTargets([]);
  };

  // High-level ruler/officer general tactic
  const handleGeneralTactic = () => {
    if (tacticUsed) return;
    if (battlePhase !== 'fighting') return;

    playSkillSound();
    setTacticUsed(true);

    const ldr = seasonalAttacker ? seasonalAttacker.stats.leadership : 75;
    const int = seasonalAttacker ? seasonalAttacker.stats.intelligence : 75;
    const rulerName = attackingOfficer ? attackingOfficer.name : '攻城大帅';

    // Different tactics depending on ruler / active faction
    let tacticMessage = '';
    
    if (attackerFaction.id === 'wei' || rulerName.includes('曹')) {
      // Double Action points this turn
      setActionPoints(p => p + 3);
      tacticMessage = `👑 霸者统御：行【十面埋伏】兵书秘策，本回合大军突破极限获得额外 3 行动战令（AP+3）！`;
    } 
    else if (attackerFaction.id === 'shu' || rulerName.includes('刘') || rulerName.includes('诸葛')) {
      // Heal all surviving comrades
      setPlayerUnits(prev => prev.map(u => {
        if (u.isDead) return u;
        const curHp = Math.min(u.maxHp, u.hp + Math.floor(120 + int * 0.8));
        return { ...u, hp: curHp };
      }));
      tacticMessage = `☯️ 卧龙妙算 / 仁义天德：漫天落玉甘露！令全军活络兵马，所有前线负伤队团复苏治疗得 【${Math.floor(120 + int * 0.8)}】 点血气！`;
    } 
    else if (attackerFaction.id === 'wu' || rulerName.includes('孙') || rulerName.includes('周')) {
      // Burn enemies
      setEnemyUnits(prev => prev.map(e => {
        if (e.isDead || e.type === 'gate') return e;
        return {
          ...e,
          hp: Math.max(0, e.hp - 80),
          activeBuffs: [...e.activeBuffs, { type: 'burning', duration: 2 }],
          isDead: (e.hp - 80) <= 0
        };
      }));
      tacticMessage = `🔥 【江东火策】顺风纵火，城下化作修罗焦炭！除了闸门本身，所有敌方杂役巡防营遭受暴风连环烈火重创 80 点生命，陷入剧烈燃烧状态！`;
    } 
    else {
      // General inspire: ATK boost & heal
      setPlayerUnits(prev => prev.map(u => {
        if (u.isDead) return u;
        return { ...u, hp: Math.min(u.maxHp, u.hp + 60), atk: u.atk + 15 };
      }));
      tacticMessage = `⚔️ 校阅点将・百川归海：三军奋勇，全体在场宿将兵器大淬火锋锐 +15 点，并紧急抢疗一新！`;
    }

    addLog(`📢 【明公施策】 ${rulerName} 挥舞帅纛，在两军阵前喝令高吟：`);
    addLog(tacticMessage);
    checkBattleResolution();
  };

  // Helper log addition
  const addLog = (msg: string) => {
    setBattleLogs(prev => [msg, ...prev]);
  };

  // Check battle ending conditions
  const checkBattleResolution = () => {
    setTimeout(() => {
      // Gate check
      const gate = enemyUnits.find(u => u.type === 'gate');
      if (gate && gate.isDead) {
        setBattlePhase('victory');
        playVictorySound();
        addLog('🎉 凯旋捷报！！！沉重的主寨城闸大门崩毁碎裂！攻城军怒号涌入，斩关夺标成功！');
        return;
      }

      // Check if all enemy defense guards/officers are destroyed
      const activeEnemies = enemyUnits.filter(e => !e.isDead && e.type !== 'gate');
      if (activeEnemies.length === 0) {
        setBattlePhase('victory');
        playVictorySound();
        addLog('🎉 捷报大捷！！！扼防城门的一切阻击巡边军、高墙弩手全盘覆没！全军鸣金受降，城关洞开！');
        return;
      }

      // Check if player units are all wiped out
      const alivePlayerUnits = playerUnits.filter(p => !p.isDead);
      if (alivePlayerUnits.length === 0) {
        setBattlePhase('defeat');
        playDefeatSound();
        addLog('💀 折戟沉沙！！！我部折损了全数主力大营！前线攻坚部队悉数殉国溃退，本场突击失败！');
        return;
      }
    }, 100);
  };

  // AI Opponent's Turn execution
  const executeEnemyTurn = () => {
    if (battlePhase !== 'fighting') return;

    addLog('🛡️ ─────── [敌军回合 雁阵齐齐反扑] ───────');

    // 1. Process active buffs/debuffs tick
    setPlayerUnits(prev => prev.map(u => {
      if (u.isDead) return u;
      const nextBuffs = u.activeBuffs.map(b => ({ ...b, duration: b.duration - 1 })).filter(b => b.duration > 0);
      return { ...u, activeBuffs: nextBuffs };
    }));

    setEnemyUnits(prev => prev.map(e => {
      if (e.isDead) return e;
      
      let nextHp = e.hp;
      let nextBuffs = e.activeBuffs.map(b => ({ ...b, duration: b.duration - 1 }));

      // Burning ticks
      if (e.activeBuffs.some(b => b.type === 'burning')) {
        const burnDmg = 35 + (weatherId === 'windy' ? 25 : 0);
        nextHp = Math.max(0, nextHp - burnDmg);
        
        // Spawn 2D floating hot embers
        const eX = (e.col * (100 / GRID_COLS)) + (100 / GRID_COLS / 2);
        const eY = (e.row * (100 / GRID_ROWS)) + (100 / GRID_ROWS / 2);
        const fId = 'eb_' + e.id + '_' + Math.random().toString(36).substr(2, 9);
        setFloatingEffects(pts => [...pts, {
          id: fId,
          x: eX,
          y: eY,
          content: `-${burnDmg} 🔥`,
          color: 'text-amber-500 font-serif font-black text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] animate-pulse'
        }]);
        setTimeout(() => setFloatingEffects(pts => pts.filter(p => p.id !== fId)), 1200);

        addLog(`🔥 燃烈残响：[${e.name}] 遭受烈火爆裂焚烧，坠血 ${burnDmg}！`);
      }

      nextBuffs = nextBuffs.filter(b => b.duration > 0);

      return {
        ...e,
        hp: nextHp,
        activeBuffs: nextBuffs,
        isDead: nextHp <= 0
      };
    }));

    // 2. Automated Wall Archers & Patrol forces engage with staggered volleys
    let enemyActionIdx = 0;
    enemyUnits.forEach(enemy => {
      if (enemy.isDead) return;

      if (enemy.type === 'wall_archer') {
        // Targets the closest or highest-HP player unit
        const alivePlayers = playerUnits.filter(p => !p.isDead);
        if (alivePlayers.length > 0) {
          // Sort by column (closest to Wall has higher column index)
          alivePlayers.sort((a, b) => b.col - a.col);
          const target = alivePlayers[0];

          // Calculate Damage
          let wallArrowAtk = enemy.atk;
          const isShielded = target.activeBuffs.some(b => b.type === 'shield_wall');
          
          let finalDmg = Math.max(8, Math.floor(wallArrowAtk * (1 - target.def / 180)));
          if (isShielded) {
            finalDmg = Math.floor(finalDmg * 0.25);
          }

          // Trigger staggered 2D projectile animations
          triggerCombatFeedback(
            enemy.row,
            enemy.col,
            target.row,
            target.col,
            'arrow',
            `-${finalDmg}`,
            isShielded
              ? 'text-teal-400 font-mono font-bold text-xs bg-slate-900/95 px-1 rounded border border-teal-500/20 shadow-md'
              : 'text-rose-500 font-serif font-black text-base drop-shadow-[0_1.5px_3px_black]',
            { attackerId: enemy.id, targetId: target.id, delayMs: enemyActionIdx++ * 220 }
          );

          setPlayerUnits(prev => prev.map(p => {
            if (p.id === target.id) {
              const hpLeft = Math.max(0, p.hp - finalDmg);
              return { ...p, hp: hpLeft, isDead: hpLeft <= 0 };
            }
            return p;
          }));

          addLog(`🏹 [${enemy.name}] 凭高借重，俯视垛口狂射箭弩！中射 [${target.name}]，打出 【${finalDmg}】 点矢伤！${isShielded ? ' (🛡️ 铁鱼大盾墙：伤害极速偏卸减免！)' : ''}`);
        }
      }

      // 3. Patrol forces engage
      else if (enemy.type === 'patrol_infantry' || enemy.type === 'patrol_cavalry') {
        const alivePlayers = playerUnits.filter(p => !p.isDead);
        if (alivePlayers.length > 0) {
          // Patrols search for player unit in its row, else closest in distance
          let target = alivePlayers.find(p => p.row === enemy.row) || alivePlayers[0];
          
          // Row check or move adjacent (within 2 columns on 20x20 grid)
          const cDist = Math.abs(enemy.col - target.col);
          if (cDist <= 2) {
            // attack!
            let opDmg = Math.max(10, Math.floor(enemy.atk * (1 - target.def / 160) + Math.random() * 15));
            
            // Trigger staggered 2D attack slash animation
            triggerCombatFeedback(
              enemy.row,
              enemy.col,
              target.row,
              target.col,
              'slash',
              `-${opDmg}`,
              'text-rose-500 font-serif font-black text-base drop-shadow-[0_1.5px_3.5px_black]',
              { attackerId: enemy.id, targetId: target.id, delayMs: enemyActionIdx++ * 220 }
            );

            setPlayerUnits(prev => prev.map(p => {
              if (p.id === target.id) {
                const curHp = Math.max(0, p.hp - opDmg);
                return { ...p, hp: curHp, isDead: curHp <= 0 };
              }
              return p;
            }));
            addLog(`⚔️ 守哨 [${enemy.name}] 刀尖突击，挺刃反扑 [${target.name}]，悍勇斩去 【${opDmg}】 点威风！`);
          } else {
            // march closer to block player (Cavalry marches 2 columns, Infantry matches 1 column)
            const speed = enemy.type === 'patrol_cavalry' ? 2 : 1;
            const nextCol = Math.max(0, enemy.col - speed);
            if (!enemyUnits.some(eu => !eu.isDead && eu.row === enemy.row && eu.col === nextCol)) {
              setEnemyUnits(prev => prev.map(eu => {
                if (eu.id === enemy.id) return { ...eu, col: nextCol };
                return eu;
              }));
              addLog(`🏃 阻击巡兵 [${enemy.name}] 收紧包围网，向左侧推盾推进至第 [${nextCol + 1}] 列！`);
            }
          }
        }
      }
    });

    // Check resolve
    checkBattleResolution();

    // Stagger turn increment
    setTurn(t => {
      if (t >= maxTurns) {
        setBattlePhase('defeat');
        addLog('⌛ 狂风扬沙，日落寒塞：长风号响，守城大队援军已将我军反包抄，强袭超时，吞恨溃遁！');
      }
      return t + 1;
    });

    // Replenish player AP
    setActionPoints(maxActionPoints);
  };

  // Claim campaign reward
  const handleVictoryClose = () => {
    // Generate special randomized rewards based on high force/intelligence
    const relList = [
      { name: '方天画戟 (Double Crescent Halberd)', type: 'relic', bonus: '武力 +25', desc: '虎牢雄威，无双豪气！' },
      { name: '青龙偃月刀 (Green Dragon Blade)', type: 'relic', bonus: '武力 +20 | 统帅 +10', desc: '义薄云天，万夫莫开！' },
      { name: '赤兔神驹 (Legendary Red Hare)', type: 'relic', bonus: '速度 +30 | 生存率 +50%', desc: '人中吕布，马中赤兔。' },
      { name: '青釭宝剑 (Peerless Qinggang Sword)', type: 'relic', bonus: '武力 +15 | 穿斩甲胄', desc: '能削铁如泥，白刃闪烁。' },
      { name: '诸葛连弩 (Prime Zhuge Arbalest)', type: 'relic', bonus: '统帅 +15 | 连射', desc: '诸葛亮躬自指点，十弹齐发。' }
    ];

    const chosenRelic = relList[Math.floor(Math.random() * relList.length)];
    const goldRewarded = 600 + Math.floor(Math.random() * 400);

    // callback to update global state
    onBattleComplete('attacker', goldRewarded, chosenRelic.name, targetCity.id);
  };

  const handleDefeatClose = () => {
    onBattleComplete('defender', -150);
  };

  return (
    <div id="war-mode-panel" className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col min-h-[620px] transition-all relative">
      {/* Visual Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-900 flex justify-between items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/20 via-slate-950 to-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center text-rose-500">
            <Sword size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/30 font-bold">WAR MODE</span>
              <span className="text-xs font-serif font-black tracking-tight text-amber-500">
                {originCity.name} ⚔️ {targetCity.name} 设卡城防战
              </span>
            </div>
            <h2 className="text-sm font-serif font-black text-slate-100 mt-0.5 leading-relaxed">
              攻城拔寨合战指挥：{attackingOfficer?.name || '公孙瓒'} 击敌 {defendingOfficer?.name || '张辽'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono text-slate-500 block">节令与天象</span>
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-xs text-emerald-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-bold font-mono" title={activeSeason.tacticalSummary}>
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
                  snow: '❄️ 冰雪封疆'
                }[weatherId] || '☀️ 晴空万里'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-850 hover:text-rose-400 rounded-lg text-slate-500 transition-colors"
            title="退出战役"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Intro Modal or Playing Panel layout */}
      {battlePhase === 'intro' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950/40 relative min-h-[450px]">
          <div className="max-w-md bg-slate-950 p-6 rounded-2xl border border-rose-905 space-y-4 shadow-xl">
            <ShieldAlert size={48} className="text-rose-500 mx-auto animate-bounce" />
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-black text-slate-200">两军对峙：战役鼓震三军</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                你将率领 [步兵营、强弩营、骁骑营、攻城冲车]。通过消耗行动令 AP，控制部队进驻阵线克关突刺，撞砸并攻破最右侧 [铁闸主城门]！
              </p>
            </div>
            
            <div className="bg-slate-900/65 p-3 rounded-xl border border-slate-800 text-left text-[11px] text-slate-400 space-y-2 font-sans">
              <p className="font-bold text-slate-200">📜 攻城法则（战局攻略）:</p>
              <ul className="list-disc pl-4 space-y-1 text-slate-400">
                <li><strong className="text-slate-200">攻破闸门/歼敌</strong>: 使最右侧【阁道主城门】血槽归零，或摧折合防驻宿兵，即可夺关克城！</li>
                <li><strong className="text-slate-200">步兵与冲车</strong>: 攻坚核心。冲车抵在城下后，施展专属攻坚，具有震天大杀伤！</li>
                <li><strong className="text-slate-200">双绝技突击</strong>: 点击角色后注意使用兵团特技，有扭转乾坤之神效。</li>
                <li><strong className="text-slate-200">名帅大政令</strong>: 每场极速搏杀中，主帅有一次施展王霸之策的大招机会！</li>
              </ul>
            </div>

            <button
              onClick={() => setBattlePhase('fighting')}
              className="w-full bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-500/10 text-slate-100 text-xs font-black uppercase py-3 rounded-xl tracking-widest transition duration-200 cursor-pointer"
            >
              擂鼓：开始关隘攻坚战！
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 p-5">
          {/* LEFT: Dashboard containing Player Commander statistics (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 relative">
              <div className="absolute top-0 right-0 p-2 bg-rose-500/10 text-rose-500 text-[9px] font-mono rounded-bl font-black uppercase">
                攻方・主纛
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase block">攻城统领</span>
              <h3 className="text-sm font-serif font-black text-slate-200 mt-1 flex items-center gap-1.5">
                👑 {attackingOfficer?.name || '在野义军大将'}
              </h3>
              
              {seasonalAttacker && (
                <div className="grid grid-cols-3 gap-2 mt-3 font-mono text-[10px] text-center">
                  <div className="p-1 bg-slate-900 rounded border border-slate-850">
                    <span className="text-slate-500 block">统帅</span>
                    <strong className="text-teal-400">{seasonalAttacker.stats.leadership}</strong>
                  </div>
                  <div className="p-1 bg-slate-900 rounded border border-slate-850">
                    <span className="text-slate-500 block">武力</span>
                    <strong className="text-amber-400">{seasonalAttacker.stats.force}</strong>
                  </div>
                  <div className="p-1 bg-slate-900 rounded border border-slate-850">
                    <span className="text-slate-500 block">智谋</span>
                    <strong className="text-indigo-400">{seasonalAttacker.stats.intelligence}</strong>
                  </div>
                </div>
              )}

              <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed mt-2.5">
                大军雄厚物资，可施用 【武将专属秘策】 大幅撼动当前战局。
              </p>

              <button
                onClick={handleGeneralTactic}
                disabled={tacticUsed || battlePhase !== 'fighting'}
                className="w-full mt-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 disabled:from-slate-900 disabled:to-slate-900 disabled:border-slate-850 disabled:opacity-40 text-slate-950 disabled:text-slate-500 py-2 rounded-lg text-xs font-serif font-black flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer active:scale-97"
              >
                <Sparkles size={11.5} />
                {tacticUsed ? '⚠️ 主帅将星大计已施用' : '📢 施展主帅专属大策战令'}
              </button>
            </div>

            {/* Selected部曲详细说明卡 */}
            {selectedUnitId ? (() => {
              const unit = playerUnits.find(u => u.id === selectedUnitId);
              if (!unit) return null;
              const hasShield = unit.activeBuffs.some(b => b.type === 'shield_wall');
              const isDouble = unit.activeBuffs.some(b => b.type === 'double_atk');

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-955 p-3 rounded-xl border border-slate-900 divide-y divide-slate-900/65"
                >
                  <div className="pb-2.5 flex items-start gap-2">
                    <span className="text-2xl p-1.5 bg-slate-900 rounded-xl border border-slate-805">{unit.icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-teal-400 font-bold block">
                        {unit.type === 'infantry' && '🟢 步兵排头营'}
                        {unit.type === 'archers' && '🎯 强弩神射营'}
                        {unit.type === 'cavalry' && '🐎 宿卫骁骑先锋'}
                        {unit.type === 'ram' && '🚧 破城重装铁车'}
                      </span>
                      <h4 className="text-xs font-serif font-black text-slate-100 truncate mt-0.5">{unit.name}</h4>
                    </div>
                  </div>

                  <div className="py-2 grid grid-cols-2 gap-2 text-center text-[10px] font-mono">
                    <div className="bg-slate-900/60 p-1 rounded-md border border-slate-900/60">
                      <span className="text-slate-500 block text-[9px]">兵部生命</span>
                      <strong className="text-emerald-400">{unit.hp} / {unit.maxHp}</strong>
                    </div>
                    <div className="bg-slate-900/60 p-1 rounded-md border border-slate-900/60">
                      <span className="text-slate-500 block text-[9px]">战伤攻值</span>
                      <strong className="text-rose-450">{unit.atk} 攻</strong>
                    </div>
                  </div>

                  <p className="py-1.5 text-[9.5px] text-slate-450 leading-relaxed font-sans">
                    {unit.description}
                  </p>

                  <div className="pt-2">
                    <span className="text-[9.5px] font-mono text-slate-500 block mb-1.5">兵种核心绝技（耗 1 AP）:</span>
                    <button
                      onClick={() => handleSpecialSkill(unit)}
                      disabled={actionPoints <= 0 || battlePhase !== 'fighting'}
                      className="w-full py-2 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-900 disabled:text-slate-650 disabled:border-slate-850 text-slate-100 text-[11px] font-serif font-black rounded-lg transition-all border border-teal-500/20 hover:border-teal-400/40 active:scale-97 cursor-pointer"
                    >
                      🔮 施施阵：【
                      {unit.type === 'infantry' && '鱼鳞大盾墙'}
                      {unit.type === 'archers' && '流星流矢火焚'}
                      {unit.type === 'cavalry' && '连环八阵冲刺'}
                      {unit.type === 'ram' && '天崩巨槌撞阁'}
                      】
                    </button>
                    {hasShield && <p className="text-[9px] text-teal-450 font-mono mt-1.5 flex items-center gap-1">🛡️ 【大护】受伤害减少 75%（持 2 回合）</p>}
                    {isDouble && <p className="text-[9px] text-amber-500 font-mono mt-1.5 flex items-center gap-1">⚔️ 【双击】本回合增加 50% 抛射输出伤害</p>}
                  </div>
                </motion.div>
              );
            })() : (
              <div className="bg-slate-950/40 p-4 py-5 rounded-xl border border-dashed border-slate-850 text-center text-xs text-slate-500 leading-relaxed">
                🛡️ 暂未调度中坚兵勇
                <p className="text-[10px] text-slate-600 mt-1">
                  点击战场中的我军兵营，即可在此观察状态与施展合战计策！
                </p>
              </div>
            )}
          </div>

          {/* MIDDLE: Interactive tactical Grid Battlefield Map (Span 7) */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-900 p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden min-h-[660px]">
            {/* Visual Grid Backdrop */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Upper state stats indicators */}
            <div className="flex justify-between items-center text-xs border-b border-slate-900 pb-2.5 mb-3 z-10 relative">
              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-350">
                <span>作战旬期:</span>
                <span className="text-amber-500 font-bold font-serif text-xs px-2 py-0.5 bg-slate-900 border border-slate-800 rounded">
                  第 {turn} / {maxTurns} 回合
                </span>
              </div>

              {/* Action points AP representation */}
              <div className="flex items-center gap-1">
                <span className="text-[10.5px] font-mono text-teal-400 font-bold uppercase mr-1">军令行下 (AP):</span>
                <div className="flex gap-1">
                  {[...Array(maxActionPoints)].map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-3.5 h-3.5 rounded border transition-all ${
                        idx < actionPoints 
                          ? 'bg-teal-500 border-teal-400 rotate-45 shadow-sm shadow-teal-500/20' 
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Live Tactical Battlefield View (div:nth-of-type(3)) */}
            <motion.div
              id="war-live-arena"
              className="relative w-full my-2 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/90 select-none flex flex-col shadow-2xl"
              animate={
                screenShake === 'heavy'
                  ? { x: [-9, 9, -8, 8, -4, 4, 0], y: [-4, 4, -3, 3, 0] }
                  : screenShake === 'light'
                  ? { x: [-4, 4, -3, 3, 0], y: [-2, 2, 0] }
                  : { x: 0, y: 0 }
              }
              transition={{ duration: screenShake === 'heavy' ? 0.4 : 0.25 }}
            >
              {/* Top Live Frontline Strength & View Controls Bar */}
              {(() => {
                const alivePlayers = playerUnits.filter(u => !u.isDead);
                const aliveEnemies = enemyUnits.filter(e => !e.isDead);
                const gateUnit = enemyUnits.find(e => e.type === 'gate');
                const atkTotalHp = alivePlayers.reduce((sum, u) => sum + u.hp, 0);
                const atkMaxHp = Math.max(1, playerUnits.reduce((sum, u) => sum + u.maxHp, 0));
                const defTotalHp = aliveEnemies.reduce((sum, e) => sum + e.hp, 0);
                const defMaxHp = Math.max(1, enemyUnits.reduce((sum, e) => sum + e.maxHp, 0));
                const atkPct = Math.round((atkTotalHp / atkMaxHp) * 100);
                const defPct = Math.round((defTotalHp / defMaxHp) * 100);

                return (
                  <div className="shrink-0 px-3 py-2 bg-slate-950/95 border-b border-slate-800/80 grid grid-cols-12 items-center gap-2 text-[11px] z-20">
                    <div className="col-span-5 flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-sm shrink-0"
                        style={{ backgroundColor: attackerFaction.color }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 font-mono text-[10px]">
                          <span className="font-serif font-bold text-slate-100 truncate">
                            {attackerFaction.name} ({alivePlayers.length}/{playerUnits.length} 营)
                          </span>
                          <span className="text-emerald-400 tabular-nums shrink-0">{atkPct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mt-1 border border-slate-800">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-300"
                            style={{ width: `${atkPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 flex flex-col items-center justify-center">
                      <button
                        id="btn-war-view-toggle"
                        type="button"
                        onClick={() => setViewPerspective(p => (p === 'tactical' ? 'diorama' : 'tactical'))}
                        className="px-2 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[10px] font-mono text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
                        title="切换战场视角"
                      >
                        {viewPerspective === 'tactical' ? '俯瞰平视' : '沙盘透视'}
                      </button>
                    </div>

                    <div className="col-span-5 flex items-center gap-2 min-w-0">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 font-mono text-[10px]">
                          <span className="text-rose-400 tabular-nums shrink-0">
                            {gateUnit ? `城门 ${gateUnit.hp}/${gateUnit.maxHp}` : `${defPct}%`}
                          </span>
                          <span className="font-serif font-bold text-slate-100 truncate">
                            {defenderFaction.name} ({aliveEnemies.length} 守备)
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mt-1 border border-slate-800 flex justify-end">
                          <div
                            className="h-full bg-rose-500 transition-all duration-300"
                            style={{ width: `${defPct}%` }}
                          />
                        </div>
                      </div>
                      <span
                        className="w-2.5 h-2.5 rounded-sm shrink-0"
                        style={{ backgroundColor: defenderFaction.color }}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Main Full-Width Live Battlefield Viewport */}
              <div
                className="relative w-full aspect-[4/3] min-h-[410px] overflow-hidden bg-[radial-gradient(ellipse_at_center,_#111c33_0%,_#060b16_100%)]"
                style={{ perspective: '1100px' }}
              >
                {/* Dynamic Animated Weather Overlays */}
                {weatherId === 'sunny' && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-40 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.08)_0%,_transparent_65%)]">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full bg-yellow-400/35 blur-xs"
                        style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 20}%` }}
                        animate={{ y: [-18, 18, -18], opacity: [0.2, 0.7, 0.2] }}
                        transition={{ duration: 3.5 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    ))}
                  </div>
                )}

                {weatherId === 'rainy' && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
                    {[...Array(14)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-0.5 h-6 bg-sky-400/40 rounded-full"
                        style={{ left: `${i * 7.5}%`, top: '-30px' }}
                        animate={{ y: ['0%', '1150%'], x: ['0px', '-45px'] }}
                        transition={{ duration: 0.7 + (i % 3) * 0.15, repeat: Infinity, delay: (i % 4) * 0.1, ease: 'linear' }}
                      />
                    ))}
                  </div>
                )}

                {weatherId === 'heavy_rain' && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-40 bg-sky-950/20">
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      animate={{ opacity: [0, 0, 0.35, 0, 0, 0.18, 0] }}
                      transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    {[...Array(24)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-8 bg-sky-300/60 rounded-full shadow-[0_0_4px_rgba(56,189,248,0.5)]"
                        style={{ left: `${i * 4.2}%`, top: '-40px' }}
                        animate={{ y: ['0%', '1200%'], x: ['0px', '-65px'] }}
                        transition={{ duration: 0.45 + (i % 4) * 0.08, repeat: Infinity, delay: (i % 5) * 0.06, ease: 'linear' }}
                      />
                    ))}
                  </div>
                )}

                {weatherId === 'windy' && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-xs"
                        style={{ right: '-30px', top: `${15 + i * 11}%` }}
                        animate={{ x: ['110%', '-1100%'], rotate: [0, 360], y: [0, 22, -22, 0] }}
                        transition={{ duration: 1.6 + (i % 3) * 0.3, repeat: Infinity, delay: (i % 3) * 0.15, ease: 'linear' }}
                      >
                        {i % 2 === 0 ? '🍃' : '💨'}
                      </motion.div>
                    ))}
                  </div>
                )}

                {weatherId === 'foggy' && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-40 bg-slate-900/10">
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-36 h-36 rounded-full bg-slate-200/10 blur-xl"
                        style={{ left: `${i * 25}%`, top: `${15 + (i % 2) * 40}%` }}
                        animate={{ scale: [1, 1.3, 1], x: [-25, 25, -25] }}
                        transition={{ duration: 5.5 + i * 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    ))}
                  </div>
                )}

                {weatherId === 'dense_fog' && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-40 bg-indigo-950/25 backdrop-blur-[0.5px]">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-44 h-44 rounded-full bg-indigo-200/20 blur-2xl"
                        style={{ left: `${(i % 4) * 28}%`, top: `${Math.floor(i / 4) * 45}%` }}
                        animate={{ scale: [0.9, 1.35, 0.9], x: [-35, 35, -35], opacity: [0.22, 0.5, 0.22] }}
                        transition={{ duration: 4.5 + i * 0.8, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    ))}
                  </div>
                )}

                {weatherId === 'snow' && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-40 bg-cyan-950/10">
                    {[...Array(18)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full bg-white/70 shadow-sm"
                        style={{ left: `${i * 5.8}%`, top: '-20px' }}
                        animate={{ y: ['0%', '1150%'], x: [0, (i % 2 === 0 ? 28 : -28), 0] }}
                        transition={{ duration: 2.2 + (i % 3) * 0.6, repeat: Infinity, delay: (i % 4) * 0.2, ease: 'linear' }}
                      />
                    ))}
                  </div>
                )}

                {/* LIVE 20x20 TACTICAL STAGE */}
                <div
                  className="absolute inset-0 origin-center transition-transform duration-300"
                  style={{
                    transform: viewPerspective === 'diorama' ? 'rotateX(22deg) scale(0.95)' : 'none',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Terrain Zones Backdrop Aligned to Columns 0-19 */}
                  <div
                    className="absolute inset-0 grid pointer-events-none z-0"
                    style={{ gridTemplateColumns: 'repeat(20, minmax(0, 1fr))' }}
                  >
                    {/* Col 0 - 3: Attacker Rear Camp */}
                    <div
                      className="border-r border-teal-500/20 bg-gradient-to-r from-teal-950/35 via-emerald-950/15 to-transparent flex flex-col justify-between py-3 px-2 relative"
                      style={{ gridColumn: 'span 4' }}
                    >
                      <div className="text-[10px] font-serif font-bold text-teal-300/75 tracking-wider text-center">
                        后军本营
                      </div>
                      <div className="flex flex-col gap-5 items-center justify-center opacity-45">
                        <span className="text-xl">⛺</span>
                        <motion.span
                          className="text-lg drop-shadow-[0_0_8px_rgba(234,179,8,0.45)]"
                          animate={{ scale: [1, 1.15, 1], rotate: [-4, 4, -4] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          🔥
                        </motion.span>
                        <span className="text-lg">🚩</span>
                      </div>
                      <div className="text-[9px] font-mono text-teal-500/50 text-center">攻方营垒</div>
                    </div>

                    {/* Col 4 - 11: Contested Plains */}
                    <div
                      className="border-r border-slate-700/25 bg-[radial-gradient(ellipse_at_center,_rgba(51,65,85,0.22)_0%,_transparent_75%)] flex flex-col justify-between py-3 px-2 relative"
                      style={{ gridColumn: 'span 8' }}
                    >
                      {/* Central Siege Road leading horizontally toward gate row 10 */}
                      <div className="absolute inset-x-0 top-[47%] h-[11%] bg-amber-950/20 border-y border-amber-700/15 pointer-events-none" />
                      <div className="text-[10px] font-serif font-bold text-slate-300/65 tracking-wider text-center relative">
                        平原战线
                      </div>
                      <div className="flex justify-around items-center opacity-25 relative">
                        <span className="text-sm">🪨</span>
                        <span className="text-xs">🪵</span>
                        <span className="text-sm">🌾</span>
                      </div>
                      <div className="text-[9px] font-mono text-slate-500/70 text-center relative">交锋开阔地</div>
                    </div>

                    {/* Col 12 - 18: Moat & Outer Fortress Approach */}
                    <div
                      className="border-r border-sky-500/25 bg-gradient-to-r from-sky-950/20 via-slate-900/35 to-rose-950/15 flex flex-col justify-between py-3 px-2 relative"
                      style={{ gridColumn: 'span 7' }}
                    >
                      {/* Animated Moat Canal down Col 12 */}
                      <motion.div
                        className="absolute inset-y-0 left-0 w-[28.5%] bg-gradient-to-b from-sky-500/15 via-cyan-500/25 to-sky-500/15 border-x border-sky-400/25 pointer-events-none"
                        animate={{ opacity: [0.65, 1, 0.65] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      {/* Assault Bridge over Moat aligned with Gate Row 10 */}
                      <div className="absolute left-0 w-[30%] top-[46%] h-[13%] bg-amber-800/45 border-y border-amber-400/40 pointer-events-none" />

                      <div className="text-[10px] font-serif font-bold text-sky-300/75 tracking-wider text-center relative">
                        护城河堑
                      </div>
                      <div className="flex flex-col gap-8 items-start pl-2 opacity-30 relative">
                        <span className="text-xs">🌊</span>
                        <span className="text-xs">🌊</span>
                      </div>
                      <div className="text-[9px] font-mono text-sky-400/60 text-center relative">外濠拒马阵</div>
                    </div>

                    {/* Col 19: Fortress Rampart Wall & Gatehouse */}
                    <div
                      className="bg-gradient-to-b from-slate-800/85 via-rose-950/55 to-slate-800/85 border-l-2 border-amber-500/35 flex flex-col justify-between py-2 px-0.5 relative"
                      style={{ gridColumn: 'span 1' }}
                    >
                      <div className="text-[8px] font-serif font-black text-rose-300/80 text-center leading-tight">
                        城墙
                      </div>
                      <div className="w-full h-[14%] rounded bg-rose-950/60 border border-amber-500/40 flex items-center justify-center text-[9px] text-amber-300 font-serif font-bold">
                        门
                      </div>
                      <div className="text-[8px] font-mono text-rose-300/70 text-center">壁垒</div>
                    </div>
                  </div>

                  {/* ACTIVE PROJECTILES LAYER */}
                  <AnimatePresence>
                    {projectiles.map(proj => {
                      const fromX = proj.fromCol * (100 / GRID_COLS) + 100 / GRID_COLS / 2;
                      const fromY = proj.fromRow * (100 / GRID_ROWS) + 100 / GRID_ROWS / 2;
                      const toX = proj.toCol * (100 / GRID_COLS) + 100 / GRID_COLS / 2;
                      const toY = proj.toRow * (100 / GRID_ROWS) + 100 / GRID_ROWS / 2;
                      const angleDeg = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);
                      const duration = proj.type === 'slash' ? 0.32 : proj.type === 'ram' ? 0.38 : 0.48;

                      return (
                        <motion.div
                          key={proj.id}
                          className="absolute z-40 w-10 h-10 -ml-5 -mt-5 flex items-center justify-center pointer-events-none"
                          initial={{ left: `${fromX}%`, top: `${fromY}%`, scale: 0.85, opacity: 0.95 }}
                          animate={{ left: `${toX}%`, top: `${toY}%`, scale: proj.type === 'slash' ? 1.35 : 1.05, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration, ease: proj.type === 'slash' ? 'easeOut' : 'easeInOut' }}
                        >
                          {proj.type === 'arrow' && (
                            <div className="flex items-center justify-center" style={{ transform: `rotate(${angleDeg}deg)` }}>
                              <svg viewBox="0 0 40 16" className="w-9 h-4 drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]">
                                <defs>
                                  <linearGradient id={`arrowGrad_${proj.id}`} x1="0%" y1="50%" x2="100%" y2="50%">
                                    <stop offset="0%" stopColor="rgba(251,191,36,0)" />
                                    <stop offset="65%" stopColor="#fbbf24" />
                                    <stop offset="100%" stopColor="#ffffff" />
                                  </linearGradient>
                                </defs>
                                <line x1="2" y1="8" x2="31" y2="8" stroke={`url(#arrowGrad_${proj.id})`} strokeWidth="2.6" strokeLinecap="round" />
                                <polygon points="38,8 28,3.5 30.5,8 28,12.5" fill="#fef08a" />
                              </svg>
                            </div>
                          )}
                          {proj.type === 'fire' && (
                            <div className="relative flex items-center justify-center">
                              <div className="absolute w-7 h-7 rounded-full bg-orange-500/50 blur-[3px] animate-ping" />
                              <span className="text-2xl drop-shadow-[0_0_8px_rgba(249,115,22,0.95)]">🔥</span>
                            </div>
                          )}
                          {proj.type === 'ram' && (
                            <div className="relative flex items-center justify-center">
                              <div className="absolute w-8 h-3 rounded-full bg-amber-500/40 blur-[2px]" />
                              <span className="text-2xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">🪵</span>
                            </div>
                          )}
                          {proj.type === 'stone' && (
                            <motion.span
                              className="text-xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 0.45, repeat: Infinity, ease: 'linear' }}
                            >
                              🪨
                            </motion.span>
                          )}
                          {proj.type === 'slash' && (
                            <motion.svg
                              viewBox="0 0 48 48"
                              className="w-11 h-11 drop-shadow-[0_0_8px_rgba(251,191,36,0.95)]"
                              style={{ transform: `rotate(${angleDeg}deg)` }}
                              animate={{ scale: [0.7, 1.45, 0.9], rotate: [angleDeg - 30, angleDeg + 40] }}
                              transition={{ duration: 0.32, ease: 'easeOut' }}
                            >
                              <path
                                d="M12 6 C34 12, 38 30, 14 42 C28 28, 26 16, 12 6 Z"
                                fill="#fde047"
                                stroke="#f97316"
                                strokeWidth="1.5"
                              />
                            </motion.svg>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {/* IMPACT SHOCKWAVE RINGS LAYER */}
                  <AnimatePresence>
                    {impactBursts.map(burst => {
                      const ringColor =
                        burst.kind === 'fire'
                          ? 'border-orange-400 bg-orange-500/25 shadow-[0_0_14px_rgba(249,115,22,0.7)]'
                          : burst.kind === 'ram' || burst.kind === 'stone'
                          ? 'border-amber-300 bg-amber-500/25 shadow-[0_0_16px_rgba(245,158,11,0.7)]'
                          : burst.kind === 'slash'
                          ? 'border-rose-400 bg-rose-500/25 shadow-[0_0_12px_rgba(244,63,94,0.7)]'
                          : 'border-amber-300 bg-amber-400/20 shadow-[0_0_10px_rgba(251,191,36,0.65)]';

                      return (
                        <motion.div
                          key={burst.id}
                          className="absolute z-40 w-12 h-12 -ml-6 -mt-6 flex items-center justify-center pointer-events-none"
                          style={{ left: `${burst.x}%`, top: `${burst.y}%` }}
                          initial={{ opacity: 0.95, scale: 0.3 }}
                          animate={{ opacity: 0, scale: 2.3 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.45, ease: 'easeOut' }}
                        >
                          <div className={`w-full h-full rounded-full border-2 ${ringColor}`} />
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {/* FLOATING COMBAT INDICATORS LAYER */}
                  <AnimatePresence>
                    {floatingEffects.map(ef => (
                      <motion.div
                        key={ef.id}
                        className={`absolute z-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center select-none whitespace-nowrap ${ef.color}`}
                        style={{ left: `${ef.x}%`, top: `${ef.y}%` }}
                        initial={{ opacity: 1, scale: 0.6, y: 0 }}
                        animate={{ opacity: 0, scale: 1.25, y: -36 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.1, ease: 'easeOut' }}
                      >
                        {ef.content}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* PLAYER UNITS LAYER */}
                  <div className="absolute inset-0 z-30 pointer-events-none">
                    {playerUnits.filter(u => !u.isDead).map(unit => {
                      const isSelected = selectedUnitId === unit.id;
                      const hasShield = unit.activeBuffs.some(b => b.type === 'shield_wall');
                      const isDouble = unit.activeBuffs.some(b => b.type === 'double_atk');
                      const motionState = unitMotions[unit.id];
                      const isHit = motionState?.mode === 'hit';
                      const isLunging = motionState?.mode === 'lunge';

                      return (
                        <motion.div
                          key={unit.id}
                          className="absolute p-[1px] flex items-center justify-center"
                          style={{
                            width: `${100 / GRID_COLS}%`,
                            height: `${100 / GRID_ROWS}%`,
                          }}
                          animate={{
                            left: `${unit.col * (100 / GRID_COLS)}%`,
                            top: `${unit.row * (100 / GRID_ROWS)}%`,
                            scale: isSelected ? 1.12 : 1,
                          }}
                          transition={{ type: 'spring', stiffness: 150, damping: 18 }}
                        >
                          <motion.div
                            className={`w-full h-full rounded-md bg-slate-950/95 border flex flex-col items-center justify-center relative shadow-md ${
                              isHit
                                ? 'border-rose-400 shadow-rose-500/40'
                                : isSelected
                                ? 'border-teal-300 ring-2 ring-teal-400/50 shadow-teal-500/30'
                                : 'border-emerald-400/70'
                            }`}
                            animate={{
                              x: motionState ? motionState.dx : 0,
                              y: motionState ? motionState.dy : 0,
                              scale: isLunging ? 1.18 : isHit ? 0.9 : 1,
                            }}
                            transition={
                              motionState
                                ? { duration: 0.16, ease: 'easeOut' }
                                : { duration: 0.2 }
                            }
                          >
                            {isHit && (
                              <div className="absolute inset-0 rounded-md bg-rose-500/45 pointer-events-none z-40" />
                            )}
                            <span className="text-sm sm:text-base leading-none">{unit.icon}</span>
                            <div className="w-[84%] bg-slate-900 h-1 rounded-full mt-0.5 overflow-hidden">
                              <div
                                className="bg-emerald-400 h-full transition-all duration-300"
                                style={{ width: `${(unit.hp / unit.maxHp) * 100}%` }}
                              />
                            </div>
                            {(hasShield || isDouble) && (
                              <span className="absolute -top-1.5 -right-1.5 text-[9px] leading-none bg-slate-950 rounded px-0.5 border border-teal-500/60">
                                {hasShield ? '🛡️' : '⚡'}
                              </span>
                            )}
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* ENEMY UNITS LAYER */}
                  <div className="absolute inset-0 z-30 pointer-events-none">
                    {enemyUnits.filter(e => !e.isDead).map(enemy => {
                      const isBurning = enemy.activeBuffs.some(b => b.type === 'burning');
                      const motionState = unitMotions[enemy.id];
                      const isHit = motionState?.mode === 'hit';
                      const isLunging = motionState?.mode === 'lunge';

                      return (
                        <motion.div
                          key={enemy.id}
                          className="absolute p-[1px] flex items-center justify-center"
                          style={{
                            width: `${100 / GRID_COLS}%`,
                            height: `${100 / GRID_ROWS}%`,
                          }}
                          animate={{
                            left: `${enemy.col * (100 / GRID_COLS)}%`,
                            top: `${enemy.row * (100 / GRID_ROWS)}%`,
                          }}
                          transition={{ type: 'spring', stiffness: 150, damping: 18 }}
                        >
                          <motion.div
                            className={`w-full h-full rounded-md border flex flex-col items-center justify-center relative shadow-md ${
                              isHit
                                ? 'border-amber-300 bg-rose-950/95'
                                : enemy.type === 'gate'
                                ? 'border-amber-400/90 bg-rose-950/90'
                                : 'border-rose-500/80 bg-slate-950/95'
                            }`}
                            animate={{
                              x: motionState ? motionState.dx : 0,
                              y: motionState ? motionState.dy : 0,
                              scale: isLunging ? 1.16 : isHit ? 0.9 : 1,
                            }}
                            transition={
                              motionState
                                ? { duration: 0.16, ease: 'easeOut' }
                                : { duration: 0.2 }
                            }
                          >
                            {isHit && (
                              <div className="absolute inset-0 rounded-md bg-amber-400/35 pointer-events-none z-40" />
                            )}
                            <span className="text-sm sm:text-base leading-none">{enemy.icon}</span>
                            <div className="w-[84%] bg-slate-900 h-1 rounded-full mt-0.5 overflow-hidden">
                              <div
                                className="bg-rose-500 h-full transition-all duration-300"
                                style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
                              />
                            </div>
                            {isBurning && (
                              <span className="absolute -top-1.5 -right-1.5 text-[9px] leading-none bg-orange-950 rounded px-0.5 border border-orange-400">
                                🔥
                              </span>
                            )}
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* INTERACTIVE 20x20 GRID CELLS LAYER */}
                  <div
                    className="absolute inset-0 z-40 grid gap-0"
                    style={{ gridTemplateRows: `repeat(${GRID_ROWS}, minmax(0, 1fr))` }}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {[...Array(GRID_ROWS)].map((_, rIdx) => (
                      <div
                        key={rIdx}
                        className="grid h-full gap-0"
                        style={{ gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))` }}
                      >
                        {[...Array(GRID_COLS)].map((_, cIdx) => {
                          const pUnit = playerUnits.find(u => !u.isDead && u.row === rIdx && u.col === cIdx);
                          const eUnit = enemyUnits.find(u => !u.isDead && u.row === rIdx && u.col === cIdx);
                          const isMoveTarget = showMoveTargets.some(t => t.row === rIdx && t.col === cIdx);
                          const isAttackTarget = showAttackTargets.some(t => t.row === rIdx && t.col === cIdx);
                          const isHovered = hoveredCell?.row === rIdx && hoveredCell?.col === cIdx;

                          return (
                            <div
                              key={cIdx}
                              onMouseEnter={() => setHoveredCell({ row: rIdx, col: cIdx })}
                              onClick={() => {
                                if (isMoveTarget) {
                                  handleMoveTo(rIdx, cIdx);
                                } else if (isAttackTarget && eUnit) {
                                  handleAttack(eUnit);
                                } else if (pUnit) {
                                  handleUnitClick(pUnit);
                                }
                              }}
                              title={
                                pUnit
                                  ? `${pUnit.name} (${pUnit.hp}/${pUnit.maxHp})`
                                  : eUnit
                                  ? `${eUnit.name} (${eUnit.hp}/${eUnit.maxHp})`
                                  : `${String.fromCharCode(65 + rIdx)}${cIdx + 1}`
                              }
                              className={`w-full h-full relative flex items-center justify-center transition-colors border border-slate-800/20 ${
                                isMoveTarget || isAttackTarget || pUnit
                                  ? 'cursor-pointer'
                                  : 'cursor-default'
                              } ${
                                isMoveTarget
                                  ? 'bg-teal-500/20 hover:bg-teal-400/35 ring-1 ring-inset ring-teal-400/60'
                                  : isAttackTarget
                                  ? 'bg-rose-500/25 hover:bg-rose-500/45 ring-1 ring-inset ring-rose-400/80'
                                  : isHovered
                                  ? 'bg-amber-400/10 ring-1 ring-inset ring-amber-400/45'
                                  : ''
                              }`}
                            >
                              {isMoveTarget && !pUnit && (
                                <span className="w-2 h-2 rounded-full bg-teal-300/80 shadow-[0_0_6px_rgba(45,212,191,0.8)] pointer-events-none" />
                              )}
                              {isAttackTarget && (
                                <motion.span
                                  className="w-4 h-4 rounded-full border-2 border-rose-400 pointer-events-none"
                                  animate={{ scale: [0.85, 1.15, 0.85] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Live Tactical Readout & Legend Strip */}
              {(() => {
                const activeCell = hoveredCell;
                const inspectedPlayer = activeCell
                  ? playerUnits.find(u => !u.isDead && u.row === activeCell.row && u.col === activeCell.col)
                  : playerUnits.find(u => !u.isDead && u.id === selectedUnitId);
                const inspectedEnemy = activeCell
                  ? enemyUnits.find(e => !e.isDead && e.row === activeCell.row && e.col === activeCell.col)
                  : undefined;
                const coord = activeCell
                  ? `${String.fromCharCode(65 + activeCell.row)}${activeCell.col + 1}`
                  : inspectedPlayer
                  ? `${String.fromCharCode(65 + inspectedPlayer.row)}${inspectedPlayer.col + 1}`
                  : null;
                const zoneCol = activeCell?.col ?? inspectedPlayer?.col;
                const zoneLabel =
                  zoneCol === undefined
                    ? ''
                    : zoneCol <= 3
                    ? '后军本营'
                    : zoneCol <= 11
                    ? '平原战线'
                    : zoneCol <= 18
                    ? '护城河堑'
                    : '城防城墙';

                return (
                  <div className="shrink-0 px-3 py-2 bg-slate-950/95 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-mono z-20">
                    <div className="flex items-center gap-2 text-slate-300 min-w-0">
                      {inspectedPlayer ? (
                        <>
                          <span className="text-emerald-400 font-bold">我军</span>
                          <span className="text-slate-100 font-serif font-bold">{inspectedPlayer.icon} {inspectedPlayer.name}</span>
                          <span className="text-slate-500">·</span>
                          <span className="text-emerald-300 tabular-nums">HP {inspectedPlayer.hp}/{inspectedPlayer.maxHp}</span>
                          <span className="text-slate-500">·</span>
                          <span className="text-amber-300 tabular-nums">攻 {inspectedPlayer.atk} / 防 {inspectedPlayer.def}</span>
                          {coord && <span className="text-slate-500">[{coord} · {zoneLabel}]</span>}
                        </>
                      ) : inspectedEnemy ? (
                        <>
                          <span className="text-rose-400 font-bold">敌军</span>
                          <span className="text-slate-100 font-serif font-bold">{inspectedEnemy.icon} {inspectedEnemy.name}</span>
                          <span className="text-slate-500">·</span>
                          <span className="text-rose-300 tabular-nums">HP {inspectedEnemy.hp}/{inspectedEnemy.maxHp}</span>
                          <span className="text-slate-500">·</span>
                          <span className="text-amber-300 tabular-nums">攻 {inspectedEnemy.atk} / 防 {inspectedEnemy.def}</span>
                          {coord && <span className="text-slate-500">[{coord} · {zoneLabel}]</span>}
                        </>
                      ) : coord ? (
                        <>
                          <span className="text-slate-400">战格 {coord}</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-300">{zoneLabel}</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-500">点击我军部队即可调度或攻击</span>
                        </>
                      ) : (
                        <span className="text-slate-400">
                          点击我军部队查看移动与攻击范围 · 护城河桥位于中路第 11 行
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-slate-400 shrink-0">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-xs bg-emerald-400 inline-block" /> 我军
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-xs bg-rose-500 inline-block" /> 敌军
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-teal-300 inline-block" /> 可移防
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full border border-rose-400 inline-block" /> 可击之
                      </span>
                    </div>
                  </div>
                );
              })()}
            </motion.div>

            {/* End Turn bar control panel for user */}
            <div className="mt-2.5 pt-3 border-t border-slate-900 flex justify-between gap-3 items-center z-10 relative">
              <p className="text-[10px] text-slate-500 font-mono">
                💡 战术提示: 点击自己的将兵，可高亮可移动或射击区域，耗AP下达调度令。
              </p>

              <button
                id="btn-war-end-turn"
                onClick={executeEnemyTurn}
                disabled={battlePhase !== 'fighting'}
                className="py-2.5 px-6 bg-rose-600 hover:bg-rose-500 text-slate-100 text-xs font-serif font-black rounded-xl tracking-wider shadow-md hover:shadow-rose-600/10 active:scale-97 transition duration-150 cursor-pointer"
              >
                🔔 调度完毕：传金结束回合 →
              </button>
            </div>
          </div>

          {/* RIGHT: Live battle scrolling chronicle / logs (Span 2) */}
          <div className="lg:col-span-2 flex flex-col justify-between bg-slate-950 p-4 rounded-xl border border-slate-900 lg:min-h-[660px]">
            <div className="flex justify-between items-center border-b border-slate-900 pb-2 mb-2">
              <span className="text-xs font-serif font-black text-rose-500 flex items-center gap-1">
                ⚔️ 两军战记
              </span>
              <span className="text-[9px] font-mono text-slate-500 uppercase">Chronicle</span>
            </div>

            {/* Log list box */}
            <div className="flex-1 overflow-y-auto text-[11.5px] font-mono space-y-1.5 pr-1 lg:max-h-[492px] scrollbar-thin bg-slate-950/20 p-2.5 rounded-xl border border-slate-800">
              {battleLogs.map((log, idx) => {
                let textColClass = 'text-slate-300';
                if (log.includes('💥') || log.includes('⚔️') || log.includes('🔥')) textColClass = 'text-amber-400';
                if (log.includes('🎉') || log.includes('👑') || log.includes('☯️')) textColClass = 'text-emerald-400 font-bold';
                if (log.includes('💀') || log.includes('🚨') || log.includes('⚠️')) textColClass = 'text-rose-450';
                if (log.includes('🏃')) textColClass = 'text-sky-400';
                if (log.includes('🛡️')) textColClass = 'text-teal-400';

                return (
                  <p key={idx} className={`leading-relaxed border-b border-slate-800/30 pb-1.5 ${textColClass}`}>
                    {log}
                  </p>
                );
              })}
            </div>

            {/* Faction metadata displays */}
            <div className="pt-3 border-t border-slate-900 mt-2 grid grid-cols-2 gap-2 text-center text-[10px] font-mono">
              <div className="bg-slate-900/60 p-1 rounded border border-slate-850">
                <span className="text-slate-500 text-[9px] block">攻城兵团</span>
                <strong style={{ color: attackerFaction.color }}>{attackerFaction.name}</strong>
              </div>
              <div className="bg-slate-900/60 p-1 rounded border border-slate-850">
                <span className="text-slate-500 text-[9px] block">驻防部曲</span>
                <strong style={{ color: defenderFaction.color }}>{defenderFaction.name}</strong>
              </div>
            </div>
          </div>

          {/* Victory overlay banner modal */}
          {battlePhase === 'victory' && (
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center z-50">
              <div className="max-w-md bg-slate-900 p-8 rounded-3xl border border-emerald-500/30 text-center space-y-6 shadow-2xl relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-slate-900 to-slate-900">
                <Trophy size={60} className="text-yellow-500 mx-auto animate-bounce drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]" />
                
                <div className="space-y-2">
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-black">【大破坚城・关前大捷】</span>
                  <h3 className="text-xl md:text-2xl font-serif font-black text-slate-50">华夏一统：功勋显赫！</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                    明公勇武无双！大军成功攻入 <strong>[${targetCity.name}]</strong> 的雄险要障城。主帅斩关擒将功成，名震华夏四海，军民无不闻风俯首！
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850/60 text-left space-y-3 font-mono text-[11px]">
                  <p className="text-emerald-400 font-bold block text-center border-b border-emerald-950 pb-1.5">🎁 实时犒劳点兵犒赏物资</p>
                  <div className="flex justify-between">
                    <span className="text-slate-500">夺关开军饷黄金:</span>
                    <strong className="text-yellow-405 font-bold">+ {600 + Math.floor(Math.random() * 400)} Gold</strong>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-500">割据领地势力更迭:</span>
                    <strong className="text-slate-205 py-0.5 px-2 bg-slate-900 rounded text-right leading-tight">
                      {targetCity.name}归入【{attackerFaction.name}】
                    </strong>
                  </div>
                  <div className="flex flex-col border-t border-slate-800 pt-2 mt-1">
                    <span className="text-slate-500">缴获极上稀代古物:</span>
                    <strong className="text-teal-400 mt-0.5 text-xs">
                      ✨ 战利古物稀兵武器 (入主帅背囊装备)
                    </strong>
                  </div>
                </div>

                <button
                  id="btn-war-claim-victory"
                  onClick={handleVictoryClose}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-100 text-xs font-bold py-3.5 px-6 rounded-xl transition duration-200 cursor-pointer"
                >
                  解散战团・班师回朝
                </button>
              </div>
            </div>
          )}

          {/* Defeat overlay banner modal */}
          {battlePhase === 'defeat' && (
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center z-50">
              <div className="max-w-md bg-slate-900 p-8 rounded-3xl border border-rose-500/30 text-center space-y-6 shadow-2xl relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/20 via-slate-900 to-slate-900">
                <AlertTriangle size={60} className="text-rose-500 mx-auto animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.2)]" />
                
                <div className="space-y-2">
                  <span className="text-xs font-mono text-rose-450 uppercase tracking-widest font-black">【折戟关隘・吞败撤兵】</span>
                  <h3 className="text-xl md:text-2xl font-serif font-black text-slate-50">呜呼：前线攻坚失利！</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                    <strong>[${targetCity.name}]</strong> 的防备工事坚不可摧，扼城守卒极是顽固。在箭雨矢石和坚守反扑中，我方主力军团折损殆尽，余部只能退师后退安民！
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850/60 text-left font-mono text-[11px] space-y-1.5">
                  <p className="text-rose-405 font-bold block text-center border-b border-rose-950 pb-1.5">💡 折戟抚邮慰劳</p>
                  <div className="flex justify-between">
                    <span className="text-slate-500">收拢安葬兵马抚恤:</span>
                    <strong className="text-rose-350">- 150 黄金军功</strong>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed pt-1.5 border-t border-slate-800">
                    主公莫忧，留得青山！建议多在起源地进行【招兵买马】、登入更高属性的猛将、或在天象气象“浓雾/烈日”气候下再次奇袭，必定凯旋！
                  </p>
                </div>

                <button
                  id="btn-war-claim-defeat"
                  onClick={handleDefeatClose}
                  className="w-full bg-slate-950 hover:bg-slate-850 text-slate-350 hover:text-slate-100 text-xs font-bold py-3 px-6 rounded-xl border border-slate-850 transition duration-200 cursor-pointer"
                >
                  割须弃袍，撤师整装
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
