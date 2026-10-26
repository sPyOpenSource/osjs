import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sword, Shield, Flame, Play, Volume2, VolumeX, X, Trophy, AlertTriangle, 
  Sparkles, Compass, Target, ArrowRight, RefreshCw, ChevronRight, User, ShieldAlert
} from 'lucide-react';
import { Officer, Faction } from '../types';

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
  weatherId: 'sunny' | 'rainy' | 'windy' | 'foggy';
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

export default function WarMode({
  originCity,
  targetCity,
  attackerFaction,
  defenderFaction,
  attackingOfficer,
  defendingOfficer,
  weatherId,
  soundEnabled,
  onBattleComplete,
  onClose
}: WarModeProps) {
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

  // 2D Animation feedback states
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [floatingEffects, setFloatingEffects] = useState<FloatingEffect[]>([]);
  const [screenShake, setScreenShake] = useState(false);

  // Helper to trigger 2D sliding projectile animations & floating damage text numbers
  const triggerCombatFeedback = (
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    projType: 'arrow' | 'slash' | 'fire' | 'stone' | 'ram',
    dmgText: string,
    dmgColor: string = 'text-rose-500 font-extrabold text-base'
  ) => {
    const projId = 'proj_' + Math.random().toString(36).substr(2, 9);
    const effectId = 'effect_' + Math.random().toString(36).substr(2, 9);

    // Add projectile
    setProjectiles(prev => [...prev, {
      id: projId,
      fromRow,
      fromCol,
      toRow,
      toCol,
      type: projType
    }]);

    // After 600ms projectile has landed, remove projectile, spawn rising damage text, and trigger screen shake if high impact
    setTimeout(() => {
      setProjectiles(prev => prev.filter(p => p.id !== projId));
      
      // Map percentage center points of cells for floating feedback (Grid cell coordinates logic)
      const targetPercentX = (toCol * (100 / GRID_COLS)) + (100 / GRID_COLS / 2);
      const targetPercentY = (toRow * (100 / GRID_ROWS)) + (100 / GRID_ROWS / 2);

      setFloatingEffects(prev => [...prev, {
        id: effectId,
        x: targetPercentX,
        y: targetPercentY,
        content: dmgText,
        color: dmgColor
      }]);

      if (projType === 'ram' || projType === 'stone') {
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 450);
      }

      // Remove damage float indicator after 1.2s
      setTimeout(() => {
        setFloatingEffects(prev => prev.filter(f => f.id !== effectId));
      }, 1200);
    }, 600);
  };

  // Sound Synth Helper
  const playBeep = (freq: number, type: OscillatorType = 'sine', duration: number = 0.1) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Ignore audio synthesis block
    }
  };

  // Sound presets
  const playMoveSound = () => playBeep(261.63, 'triangle', 0.15); // C4
  const playAttackSound = () => { playBeep(220, 'sawtooth', 0.1); playBeep(330, 'sawtooth', 0.12); };
  const playSkillSound = () => { playBeep(523.25, 'sawtooth', 0.08); playBeep(659.25, 'sine', 0.08); playBeep(783.99, 'sine', 0.2); };
  const playDefeatSound = () => { playBeep(349.23, 'sawtooth', 0.3); playBeep(220, 'sawtooth', 0.4); };
  const playVictorySound = () => { playBeep(523.25, 'sine', 0.15); playBeep(659.25, 'sine', 0.15); playBeep(783.99, 'sine', 0.15); playBeep(1046.5, 'sine', 0.4); };

  // Set up scenario elements & initialize units
  const initBattle = () => {
    // Generate Stats based on leaders' core attributes
    const atkLdrMod = attackingOfficer ? Math.floor((attackingOfficer.stats.leadership - 60) / 4) : 5;
    const atkForMod = attackingOfficer ? Math.floor((attackingOfficer.stats.force - 60) / 4) : 5;
    const defLdrMod = defendingOfficer ? Math.floor((defendingOfficer.stats.leadership - 60) / 4) : 5;
    const defPolMod = defendingOfficer ? Math.floor((defendingOfficer.stats.intelligence - 60) / 4) : 5;

    // Weathers adjustments
    const weatherBuffsLog = {
      sunny: '☀️ 今日春和景明，骑士风驰：【骁骑营】突击破敌威力提升 20%！',
      rainy: '🌧️ 天降倾盆大雨，薪火难燃：【弩弓营】火箭重创战法禁用，泥泞不便，冲车移速受制。',
      windy: '💨 朔风呼啸，风助火威：火箭爆裂引燃伤害提升！箭矢精度偶有偏斜。',
      foggy: '🌫️ 浓雾弥漫，奇兵遮锁：【步兵营】贴身肉搏将无视敌众 50% 防备甲胄！'
    }[weatherId];

    // Initial log
    setBattleLogs([
      `⚔️ 决战开始！攻方：[${attackerFaction.name}] ${attackingOfficer?.name || '无名义军'} 统御大军压境。`,
      `🛡️ 守方：[${defenderFaction.name}] ${defendingOfficer?.name || '守城宿将'} 严阵坚守 [${targetCity.name}] 城关！`,
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
        maxHp: 800 + defLdrMod * 12,
        hp: 800 + defLdrMod * 12,
        atk: 0,
        def: 60 + defLdrMod * 3,
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
    setBattlePhase('fighting');
  };

  useEffect(() => {
    initBattle();
  }, [selectedCityIdFallback()]);

  function selectedCityIdFallback() {
    return targetCity.id + "-" + originCity.id + "-" + weatherId;
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
    
    // Sunny/Windy modifications
    if (u.type === 'cavalry') {
      if (weatherId === 'sunny') {
        dmg = Math.floor(dmg * 1.25);
        skillText = '⚡ 烈阳破袭：骁骑突击威力倍增！';
      } else {
        skillText = '🐎 铁骑突袭破阵！';
      }
    }

    if (u.type === 'infantry' && weatherId === 'foggy') {
      // ignore 50% defense
      const rawArmorPenDmg = Math.floor(u.atk * (1 - (enemy.def * 0.5) / 150) + Math.random() * 20);
      dmg = Math.max(dmg, rawArmorPenDmg);
      skillText = '🌫️ 雾里藏刀：极速切入，刀锋无视敌众半数甲胄！';
    }

    if (u.type === 'ram' && enemy.type === 'gate') {
      dmg = Math.floor(220 + Math.random() * 90);
      skillText = '💥 【冲车攻城】巨柱轰砸城闸，闸门裂隙，石屑飞扬，守卒大惊！';
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

    // Apply 2D animation feedback
    let projType: 'arrow' | 'slash' | 'fire' | 'stone' | 'ram' = 'slash';
    if (u.type === 'archers') {
      projType = 'arrow';
    } else if (u.type === 'ram') {
      projType = 'ram';
    }

    triggerCombatFeedback(
      u.row,
      u.col,
      enemy.row,
      enemy.col,
      projType,
      `-${dmg}`,
      'text-rose-500 font-serif font-black text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] animate-bounce'
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
      if (weatherId === 'rainy') {
        addLog('🌧️ 泥泽潮湿：漫天暴雨严重打湿了火引燃薪！火计封锁，无法燃点火矢！');
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
      const fireDmg = Math.floor(40 + Math.random() * 30);

      // Trigger projectile and floating damage/burning feedback in 2D Space!
      triggerCombatFeedback(
        unit.row,
        unit.col,
        target.row,
        target.col,
        'fire',
        `-${fireDmg} 🔥`,
        'text-amber-500 font-serif font-black text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] animate-pulse'
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
      addLog(`🔥 [弩弓营] 火引千钧！箭簇敷油燃火齐射 [${target.name}]，打出 【${fireDmg}】 猛烧痛创！城池上空陷入烈火余晖灼烧！`);
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

    const ldr = attackingOfficer ? attackingOfficer.stats.leadership : 75;
    const int = attackingOfficer ? attackingOfficer.stats.intelligence : 75;
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

    // 2. Automated Wall Archers Shoot
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

          // Trigger continuous 2D projectile animations
          triggerCombatFeedback(
            enemy.row,
            enemy.col,
            target.row,
            target.col,
            'arrow',
            `-${finalDmg}`,
            isShielded
              ? 'text-teal-400 font-mono font-bold text-xs bg-slate-900/95 px-1 rounded border border-teal-500/20 shadow-md'
              : 'text-rose-500 font-serif font-black text-base drop-shadow-[0_1.5px_3px_black]'
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
            
            // Trigger 2D attack slash animation
            triggerCombatFeedback(
              enemy.row,
              enemy.col,
              target.row,
              target.col,
              'slash',
              `-${opDmg}`,
              'text-rose-550 font-serif font-black text-base drop-shadow-[0_1.5px_3.5px_black] animate-bounce'
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
            <span className="text-[10px] font-mono text-slate-500 block">战局天象</span>
            <span className="text-xs text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-bold font-serif">
              {{ sunny: '☀️ 晴空万里', rainy: '🌧️ 瓢泼大雨', windy: '💨 朔北狂风', foggy: '🌫️ 满陇毒雾' }[weatherId]}
            </span>
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
              
              {attackingOfficer && (
                <div className="grid grid-cols-3 gap-2 mt-3 font-mono text-[10px] text-center">
                  <div className="p-1 bg-slate-900 rounded border border-slate-850">
                    <span className="text-slate-500 block">统帅</span>
                    <strong className="text-teal-400">{attackingOfficer.stats.leadership}</strong>
                  </div>
                  <div className="p-1 bg-slate-900 rounded border border-slate-850">
                    <span className="text-slate-500 block">武力</span>
                    <strong className="text-amber-400">{attackingOfficer.stats.force}</strong>
                  </div>
                  <div className="p-1 bg-slate-900 rounded border border-slate-850">
                    <span className="text-slate-500 block">智谋</span>
                    <strong className="text-indigo-400">{attackingOfficer.stats.intelligence}</strong>
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

            {/* 3D Isometric Battlefield Arena Graphics Layout */}
            <motion.div 
              className="relative w-full max-w-[420px] aspect-[1.18] my-3 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border-4 border-slate-900 select-none mx-auto flex items-center justify-center p-1 shadow-2xl"
              style={{ perspective: '1200px' }}
              animate={screenShake ? { x: [-8, 8, -8, 8, -3, 3, 0], y: [-3, 3, -3, 3, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              {/* Dynamic Animated Weather Overlays (Rendered Screen-Space Flat for elegant contrast) */}
              {weatherId === 'sunny' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-40 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.06)_0%,_transparent_65%)]">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 rounded-full bg-yellow-400/30 blur-xs"
                      style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 20}%` }}
                      animate={{ y: [-20, 20, -20], opacity: [0.2, 0.7, 0.2] }}
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
                      className="absolute w-0.5 h-6 bg-sky-450/40 rounded-full"
                      style={{ left: `${i * 7.5}%`, top: '-30px' }}
                      animate={{ y: ['0%', '1150%'], x: ['0px', '-45px'] }}
                      transition={{ duration: 0.7 + (i % 3) * 0.15, repeat: Infinity, delay: (i % 4) * 0.1, ease: 'linear' }}
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
                      animate={{ x: ['110%', '-1100%'], rotate: [0, 360], y: [0, 25, -25, 0] }}
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
                      animate={{ scale: [1, 1.35, 1], x: [-30, 30, -30] }}
                      transition={{ duration: 5.5 + i * 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  ))}
                </div>
              )}

              {/* ROTATED ISOMETRIC MAP STAGE WRAPPER */}
              <div 
                style={{
                  width: '124%',
                  height: '124%',
                  transform: 'rotateX(58deg) rotateZ(-45deg) scale(0.72)',
                  transformStyle: 'preserve-3d',
                }}
                className="absolute transform-gpu w-full h-full origin-center"
              >
                {/* Columns Scenic Background Graphics Layer */}
                <div className="absolute inset-0 grid pointer-events-none z-0" style={{ gridTemplateColumns: 'repeat(20, minmax(0, 1fr))' }}>
                  {/* Col 0 - 3: Rear Army Camp */}
                  <div className="border-r border-slate-800/25 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-950/20 via-transparent to-transparent flex flex-col justify-between p-2" style={{ gridColumn: 'span 4' }}>
                    <div className="text-[9px] font-serif font-black text-teal-600/40 uppercase tracking-widest text-center">后军本营</div>
                    <div className="flex flex-col gap-4 items-center justify-center py-2">
                      <span className="text-xl opacity-30 animate-pulse">⛺</span>
                      <motion.span 
                        className="text-lg opacity-45 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]"
                        animate={{ scale: [1, 1.15, 1], rotate: [-5, 5, -5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        🔥
                      </motion.span>
                    </div>
                    <div className="text-[8px] font-mono text-slate-800 text-center">SAFE ZONE</div>
                  </div>

                  {/* Col 4 - 11: Buffer Plains & Obstacles */}
                  <div className="border-r border-slate-800/25 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/40 via-transparent to-transparent flex flex-col justify-between p-2" style={{ gridColumn: 'span 8' }}>
                    <div className="text-[9px] font-serif font-black text-slate-500/40 uppercase tracking-widest text-center">平原前川</div>
                    <div className="flex justify-around items-center opacity-15">
                      <span className="text-sm">🪨</span>
                      <span className="text-xs">🪵</span>
                      <span className="text-sm">🪵</span>
                    </div>
                    <div className="text-[8px] font-mono text-slate-800 text-center">MIDPLAIN COMBAT ZONE</div>
                  </div>

                  {/* Col 12 - 18: Moat crossing, gate outskirts */}
                  <div className="border-r border-slate-800/25 bg-sky-955/5 flex flex-col justify-between p-2 relative" style={{ gridColumn: 'span 7' }}>
                    {/* Decorative moat streaming river line */}
                    <div className="absolute inset-y-0 right-1 w-1 bg-sky-500/10 pointer-events-none" />
                    <div className="text-[9px] font-serif font-black text-sky-600/40 uppercase tracking-widest text-center">护城壕堑</div>
                    <div className="flex flex-col gap-6 items-center justify-center opacity-20">
                      <span className="text-xs">🌊</span>
                      <span className="text-xs">🌊</span>
                    </div>
                    <div className="text-[8px] font-mono text-slate-800 text-center">OUTER FORTRESS</div>
                  </div>

                  {/* Col 19: Castle Wall Fortifications & Towers */}
                  <div className="bg-slate-900/60 flex flex-col justify-between p-1.5 relative border-l-2 border-slate-850" style={{ gridColumn: 'span 1' }}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-955/5 via-transparent to-transparent opacity-40 pointer-events-none" />
                    
                    <div className="h-[30%] bg-slate-950/80 rounded-lg border border-slate-800/60 p-1 flex flex-col justify-between items-center">
                      <span className="text-[8px] font-serif font-black text-rose-500/45 block text-center leading-tight">女墙垛口</span>
                      <motion.span 
                        className="text-sm mt-1"
                        animate={{ y: [-1, 1, -1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        🏹
                      </motion.span>
                    </div>

                    <div className="h-[30%] bg-rose-955/20 rounded-lg border border-rose-900/30 p-1 flex flex-col justify-between items-center">
                      <span className="text-[8px] font-serif font-black text-amber-500/50 block text-center leading-tight">闸门道</span>
                      <motion.span 
                        className="text-lg drop-shadow-[0_0_10px_rgba(225,29,72,0.3)] mt-1"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2.2, repeat: Infinity }}
                      >
                        🏰
                      </motion.span>
                    </div>

                    <div className="h-[30%] bg-slate-950/80 rounded-lg border border-slate-800/60 p-1 flex flex-col justify-between items-center">
                      <span className="text-[8px] font-serif font-black text-rose-500/45 block text-center leading-tight">女墙垛口</span>
                      <motion.span 
                        className="text-sm mt-1"
                        animate={{ y: [1, -1, 1] }}
                        transition={{ duration: 1.7, repeat: Infinity }}
                      >
                        🏹
                      </motion.span>
                    </div>
                  </div>
                </div>

                {/* ACTIVE BULLET PROJECTILES TRAJECTORY ANIMATIONS LAYER */}
                <AnimatePresence>
                  {projectiles.map(proj => {
                    const fromX = (proj.fromCol * (100 / GRID_COLS)) + (100 / GRID_COLS / 2);
                    const fromY = (proj.fromRow * (100 / GRID_ROWS)) + (100 / GRID_ROWS / 2);
                    const toX = (proj.toCol * (100 / GRID_COLS)) + (100 / GRID_COLS / 2);
                    const toY = (proj.toRow * (100 / GRID_ROWS)) + (100 / GRID_ROWS / 2);

                    return (
                      <motion.div
                        key={proj.id}
                        className="absolute z-40 w-10 h-10 -ml-5 -mt-5 flex items-center justify-center pointer-events-none"
                        style={{ transformStyle: 'preserve-3d' }}
                        initial={{ left: `${fromX}%`, top: `${fromY}%` }}
                        animate={{ left: `${toX}%`, top: `${toY}%` }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.55, ease: "easeInOut" }}
                      >
                        <div
                          style={{
                            transform: 'rotateZ(45deg) rotateX(-60deg)',
                            transformOrigin: '50% 50%',
                          }}
                          className="w-full h-full flex items-center justify-center"
                        >
                          {proj.type === 'arrow' && (
                            <motion.span 
                              className="text-lg"
                              style={{ rotate: proj.fromCol < proj.toCol ? 45 : -135 }}
                            >
                              🏹
                            </motion.span>
                          )}
                          {proj.type === 'fire' && (
                            <span className="text-xl animate-pulse">🔥</span>
                          )}
                          {proj.type === 'ram' && (
                            <span className="text-xl animate-bounce">🪵</span>
                          )}
                          {proj.type === 'stone' && (
                            <span className="text-lg animate-spin">🪨</span>
                          )}
                          {proj.type === 'slash' && (
                            <motion.span 
                              className="text-3xl text-yellow-405 drop-shadow-md"
                              animate={{ scale: [1, 1.8, 0], rotate: [0, 180] }}
                              transition={{ duration: 0.5 }}
                            >
                              ⚔️
                            </motion.span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* FLOATING TEXT / COMBAT DAMAGE INDICATORS LAYER */}
                <AnimatePresence>
                  {floatingEffects.map(ef => (
                    <motion.div
                      key={ef.id}
                      className={`absolute z-50 -ml-12 -mt-6 pointer-events-none text-center select-none ${ef.color}`}
                      style={{ left: `${ef.x}%`, top: `${ef.y}%`, transformStyle: 'preserve-3d' }}
                      initial={{ opacity: 1, scale: 0.5, y: 0 }}
                      animate={{ opacity: 0, scale: 1.4, y: -50 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.1, ease: "easeOut" }}
                    >
                      <div
                        style={{
                          transform: 'rotateZ(45deg) rotateX(-60deg)',
                          transformOrigin: '50% 50%',
                        }}
                      >
                        {ef.content}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* REAL-TIME SLIDING TROOP FIGURES LAYER (Attackers / Player units) */}
                <div className="absolute inset-0 z-30 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
                  {playerUnits.filter(u => !u.isDead).map(unit => {
                    const isSelected = selectedUnitId === unit.id;
                    const hasShield = unit.activeBuffs.some(b => b.type === 'shield_wall');
                    const isDouble = unit.activeBuffs.some(b => b.type === 'double_atk');

                    return (
                      <motion.div
                        key={unit.id}
                        className="absolute p-0.5 flex items-center justify-center transition-all duration-300"
                        style={{
                          width: `${100 / GRID_COLS}%`,
                          height: `${100 / GRID_ROWS}%`,
                          transformStyle: 'preserve-3d',
                        }}
                        animate={{ 
                          left: `${unit.col * (100 / GRID_COLS)}%`, 
                          top: `${unit.row * (100 / GRID_ROWS)}%`,
                          scale: isSelected ? 1.05 : 1
                        }}
                        transition={{ type: "spring", stiffness: 130, damping: 18 }}
                      >
                        <div 
                          style={{
                            transform: 'rotateZ(45deg) rotateX(-60deg)',
                            transformOrigin: '50% 100%',
                            transformStyle: 'preserve-3d'
                          }}
                          className="w-full h-full flex items-center justify-center origin-bottom"
                        >
                          <motion.div 
                            className={`w-[90%] h-[90%] rounded-xl bg-slate-950/90 border-2 shadow-xl flex flex-col items-center justify-center p-0.5 relative z-30 ${
                              isSelected 
                                ? 'border-teal-400 ring-1 ring-teal-500/30 shadow-teal-500/10' 
                                : 'border-slate-800 shadow-black/80'
                            }`}
                            animate={{ 
                              y: isSelected ? [-1, 1, -1] : [0, 0.5, 0] 
                            }}
                            transition={{ 
                              duration: isSelected ? 1.2 : 2.5, 
                              repeat: Infinity, 
                              ease: "easeInOut" 
                            }}
                          >
                            {/* Selected Indicator Ring */}
                            {isSelected && (
                              <div className="absolute -inset-1 rounded-xl border border-teal-400/40 animate-ping pointer-events-none" />
                            )}

                            {/* Buff indicators rings */}
                            {hasShield && (
                              <div className="absolute -inset-1 rounded-xl border border-teal-500/80 animate-pulse pointer-events-none bg-teal-500/5" />
                            )}
                            {isDouble && (
                              <div className="absolute -inset-1 rounded-xl border border-amber-500/80 animate-pulse pointer-events-none bg-amber-500/5" />
                            )}

                            <span className="text-xl md:text-2xl mt-0.5">{unit.icon}</span>
                            <span className="text-[7.5px] font-serif font-black text-slate-100 block leading-tight truncate text-center w-full px-1 mt-0.5">{unit.name.substring(2)}</span>

                            {/* hp bar overlay */}
                            <div className="w-[85%] bg-slate-900 h-1 rounded mt-0.5 overflow-hidden">
                              <div 
                                className="bg-emerald-500 h-full rounded transition-all duration-300" 
                                style={{ width: `${(unit.hp / unit.maxHp) * 100}%` }}
                              />
                            </div>

                            {/* Buff Badge */}
                            {hasShield && (
                              <span className="absolute -top-1 -right-1 bg-teal-950 border border-teal-500 text-teal-400 font-mono text-[5.5px] px-0.5 rounded leading-none scale-90">🛡️ 结盾</span>
                            )}
                            {isDouble && (
                              <span className="absolute -top-1 -right-1 bg-amber-955 border border-amber-500 text-amber-400 font-mono text-[5.5px] px-0.5 rounded leading-none scale-90">⚔️ 双袭</span>
                            )}
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Defenders (Enemy units) (Rendered upright via billboard transformation) */}
                <div className="absolute inset-0 z-30 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
                  {enemyUnits.filter(e => !e.isDead).map(enemy => {
                    const isBurning = enemy.activeBuffs.some(b => b.type === 'burning');

                    return (
                      <motion.div
                        key={enemy.id}
                        className="absolute p-0.5 flex items-center justify-center transition-all duration-300 pointer-events-auto"
                        style={{
                          width: `${100 / GRID_COLS}%`,
                          height: `${100 / GRID_ROWS}%`,
                          transformStyle: 'preserve-3d',
                        }}
                        animate={{ 
                          left: `${enemy.col * (100 / GRID_COLS)}%`, 
                          top: `${enemy.row * (100 / GRID_ROWS)}%`
                        }}
                        transition={{ type: "spring", stiffness: 130, damping: 18 }}
                      >
                        <div
                          style={{
                            transform: 'rotateZ(45deg) rotateX(-60deg)',
                            transformOrigin: '50% 100%',
                            transformStyle: 'preserve-3d'
                          }}
                          className="w-full h-full flex items-center justify-center origin-bottom"
                        >
                          <motion.div 
                            className={`w-[90%] h-[90%] rounded-xl bg-slate-950/90 border-2 shadow-xl flex flex-col items-center justify-center p-0.5 relative z-35 ${
                              enemy.type === 'gate' 
                                ? 'border-rose-900 shadow-rose-950/20 bg-rose-955/5' 
                                : 'border-red-900 shadow-red-950/20'
                            }`}
                            style={{ outline: isBurning ? '1px solid #f97316' : 'none' }}
                            animate={{ 
                              y: isBurning ? [-0.5, 0.5, -0.5] : [0, 0.6, 0] 
                            }}
                            transition={{ 
                              duration: isBurning ? 0.8 : 3, 
                              repeat: Infinity, 
                              ease: "easeInOut" 
                            }}
                          >
                            {/* Fire aura */}
                            {isBurning && (
                              <div className="absolute -inset-1 rounded-xl border border-orange-500/50 animate-pulse bg-orange-500/5" />
                            )}

                            <span className="text-xl md:text-2xl mt-0.5">{enemy.icon}</span>
                            <span className="text-[7.5px] font-serif font-black text-rose-350 block leading-tight truncate text-center w-full px-1 mt-0.5">
                              {enemy.type === 'gate' ? '城门闸阁' : enemy.name.split(' ').slice(-1)[0]}
                            </span>

                            {/* hp bar */}
                            <div className="w-[85%] bg-slate-900 h-1 rounded mt-0.5 overflow-hidden">
                              <div 
                                className="bg-rose-500 h-full rounded transition-all duration-300" 
                                style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
                              />
                            </div>

                            {/* Health value label */}
                            <span className="text-[6.5px] font-mono text-slate-500 mt-0.5 block leading-none">
                              {enemy.hp}/{enemy.maxHp}
                            </span>

                            {isBurning && (
                              <span className="absolute -top-1 -right-1 bg-orange-950 border border-orange-500 text-orange-400 font-mono text-[6.5px] px-1 rounded scale-90 animate-bounce">🔥 烧</span>
                            )}
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* TACTICAL PLAYER INTERACTIVE SELECTION COVER LAYER */}
                <div className="absolute inset-0 z-40 grid gap-0" style={{ gridTemplateRows: `repeat(${GRID_ROWS}, minmax(0, 1fr))` }}>
                  {[...Array(GRID_ROWS)].map((_, rIdx) => (
                    <div key={rIdx} className="grid h-full gap-0" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))` }}>
                      {[...Array(GRID_COLS)].map((_, cIdx) => {
                        // Retrieve cell values
                        const pUnit = playerUnits.find(u => !u.isDead && u.row === rIdx && u.col === cIdx);
                        const eUnit = enemyUnits.find(u => !u.isDead && u.row === rIdx && u.col === cIdx);
                        const isMoveTarget = showMoveTargets.some(t => t.row === rIdx && t.col === cIdx);
                        const isAttackTarget = showAttackTargets.some(t => t.row === rIdx && t.col === cIdx);

                        return (
                          <div
                            key={cIdx}
                            onClick={() => {
                              if (isMoveTarget) {
                                handleMoveTo(rIdx, cIdx);
                              } else if (isAttackTarget && eUnit) {
                                handleAttack(eUnit);
                              } else if (pUnit) {
                                handleUnitClick(pUnit);
                              }
                            }}
                            className={`w-full h-full relative cursor-pointer flex flex-col justify-between p-1 transition-all border border-slate-800/35 ${
                              isMoveTarget 
                                ? 'bg-teal-500/15 hover:bg-teal-500/30 ring-2 ring-teal-500/30' 
                                : isAttackTarget 
                                  ? 'bg-rose-500/20 hover:bg-rose-500/35 ring-2 ring-rose-500/40' 
                                  : pUnit 
                                    ? 'hover:bg-slate-800/20' 
                                    : 'hover:bg-slate-900/10'
                            }`}
                          >
                            {/* Coordinates */}
                            <div className="flex justify-between pointer-events-none text-[6.5px] font-mono text-slate-700">
                              <span>{String.fromCharCode(65 + rIdx)}{cIdx + 1}</span>
                            </div>

                            {/* Interactive Runic Rings / Visual Overlays */}
                            <div className="flex-1 flex items-center justify-center pointer-events-none">
                              {isMoveTarget && (
                                <motion.div 
                                  className="w-10 h-10 rounded-full border border-dashed border-teal-500/60 flex items-center justify-center bg-teal-500/5"
                                  animate={{ scale: [0.9, 1.1, 0.9], rotate: 360 }}
                                  transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                                >
                                  <div className="w-2.5 h-2.5 rounded-full bg-teal-500/45" />
                                </motion.div>
                              )}

                              {isAttackTarget && (
                                <motion.div 
                                  className="w-12 h-12 rounded-full border border-red-500/60 flex items-center justify-center bg-rose-500/5"
                                  animate={{ scale: [1, 1.15, 1] }}
                                  transition={{ duration: 1.2, repeat: Infinity }}
                                >
                                  <div className="w-3.5 h-3.5 rounded-full bg-rose-500/50" />
                                </motion.div>
                              )}
                            </div>

                            {/* Cell tag text hints */}
                            <div className="text-[6.5px] font-mono text-center select-none pointer-events-none leading-none">
                              {isMoveTarget && <span className="text-teal-400 font-bold bg-teal-950/90 px-0.5 rounded">可移防</span>}
                              {isAttackTarget && <span className="text-rose-450 font-bold bg-rose-950/90 px-0.5 rounded">击之</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
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
