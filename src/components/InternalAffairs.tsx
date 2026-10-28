import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Officer, InternalTaskType, InternalTaskConfig, TaskAssignment, CityAffairsState } from '../types';
import AvatarRenderer from './AvatarRenderer';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Wheat, 
  Swords, 
  ShieldAlert, 
  Coins, 
  Calculator, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Award, 
  TrendingUp, 
  Flame, 
  ShieldCheck, 
  RefreshCw, 
  UserCheck, 
  Layers,
  ChevronRight,
  BookOpen,
  Calendar,
  Zap,
  Play,
  RotateCcw,
  Pause
} from 'lucide-react';

interface InternalAffairsProps {
  officers: Officer[];
  soundEnabled: boolean;
  playDrumSound: () => void;
  playClashSound: () => void;
  playHarvestSound: () => void;
  onSelectOfficer?: (officer: Officer) => void;
  gameYear: number;
  gameMonth: number;
  gameXun: number;
  isAutoTime: boolean;
  timeSpeed: 'slow' | 'normal' | 'fast';
  onToggleAutoTime: () => void;
  onSetTimeSpeed: (speed: 'slow' | 'normal' | 'fast') => void;
  onAdvanceXun: () => void;
  onAdvanceMonth: () => void;
  isActiveTab?: boolean;
}

// Configuration for tasks with detailed mathematical formulas and descriptions
export const INTERNAL_TASKS: InternalTaskConfig[] = [
  {
    id: 'fortify',
    name: '筑城',
    category: '城防工程',
    icon: 'Building2',
    tagline: '深沟高垒 · 固若金汤',
    description: '征发工役修缮城碟、加固城基、安设箭楼与重型拒马，极大增强城池抵御围城与投石强攻的能力。',
    coreAttributes: '政治 (POL 60%) + 统率 (LDR 40%)',
    statWeights: { politics: 0.60, leadership: 0.40 },
    formulaDisplay: '进度 = ⌊POL × 0.60 + LDR × 0.40⌋；城防增益 = ⌊POL × 0.70 + LDR × 0.50⌋',
    outputDescription: '大幅提升城池防御坚固度与城门耐久，降低被敌军破城的风险。'
  },
  {
    id: 'agriculture',
    name: '屯田',
    category: '农桑民生',
    icon: 'Wheat',
    tagline: '仓廪丰实 · 足食足兵',
    description: '开辟军屯荒田、修浚水利灌溉沟渠、推广先进农具，为三军远征征伐储备浩瀚粮草与提升农业开垦度。',
    coreAttributes: '政治 (POL 70%) + 魅力 (CHR 20%) + 统率 (LDR 10%)',
    statWeights: { politics: 0.70, charisma: 0.20, leadership: 0.10 },
    formulaDisplay: '进度 = ⌊POL × 0.70 + CHR × 0.20 + LDR × 0.10⌋；军粮产出 = ⌊POL × 16 + CHR × 6⌋ 石',
    outputDescription: '大幅增加府库军粮储备，提升农田肥沃度与防灾抗旱能力。'
  },
  {
    id: 'drill',
    name: '练兵',
    category: '军事训练',
    icon: 'Swords',
    tagline: '厉兵秣马 · 气吞万里',
    description: '校场整饬三军战阵、演练方圆八卦阵型、锤炼长枪刀弓技艺，全面提升部队士气与白刃战熟练度。',
    coreAttributes: '统率 (LDR 60%) + 武力 (FOR 40%)',
    statWeights: { leadership: 0.60, force: 0.40 },
    formulaDisplay: '进度 = ⌊LDR × 0.60 + FOR × 0.40⌋；训练度 = ⌊LDR × 0.40 + FOR × 0.20⌋，士气 = ⌊LDR × 0.25 + FOR × 0.25⌋',
    outputDescription: '提高全军训练熟练度与士气，大幅增加野战战法连击率与阵型稳定性。'
  },
  {
    id: 'patrol',
    name: '巡查',
    category: '治安靖难',
    icon: 'ShieldAlert',
    tagline: '申明法纪 · 绥抚黎庶',
    description: '带队巡视坊市关隘、剿平绿林盗贼匪患、平息争讼，赢得万民真心拥戴，稳固地方秩序。',
    coreAttributes: '武力 (FOR 50%) + 统率 (LDR 30%) + 魅力 (CHR 20%)',
    statWeights: { force: 0.50, leadership: 0.30, charisma: 0.20 },
    formulaDisplay: '进度 = ⌊FOR × 0.50 + LDR × 0.30 + CHR × 0.20⌋；治安 = ⌊FOR × 0.30 + LDR × 0.20⌋，民心 = ⌊CHR × 0.40⌋',
    outputDescription: '提升治下治安与民众拥戴度，杜绝城中民变，提高征兵与税收效率。'
  },
  {
    id: 'commerce',
    name: '商业',
    category: '商贸财税',
    icon: 'Coins',
    tagline: '平抑百货 · 充盈帑藏',
    description: '设立榷场通商、鼓励盐铁织造贸易、优化钱粮兑纳，为军饷赏赐与名将赏赐提供丰沛资金。',
    coreAttributes: '政治 (POL 50%) + 智力 (INT 50%)',
    statWeights: { politics: 0.50, intelligence: 0.50 },
    formulaDisplay: '进度 = ⌊POL × 0.50 + INT × 0.50⌋；赋税金库 = ⌊POL × 12 + INT × 8⌋ 两',
    outputDescription: '增加府库金银库入，带动集市商业繁荣，提供募兵与造械资金。'
  }
];

const PRESET_CITIES = [
  { cityName: '成都', title: '天府之国 · 蜀汉霸业之基', defense: 1800, maxDefense: 3000, grain: 42000, gold: 21000, troops: 35000, training: 70, morale: 82, order: 88, agriculture: 160, commerce: 140 },
  { cityName: '许昌', title: '中原咽喉 · 挟天子以令诸侯', defense: 2200, maxDefense: 3500, grain: 56000, gold: 34000, troops: 50000, training: 78, morale: 86, order: 92, agriculture: 210, commerce: 230 },
  { cityName: '建业', title: '龙盘虎踞 · 扼守长江天堑', defense: 1950, maxDefense: 3200, grain: 38000, gold: 26000, troops: 38000, training: 74, morale: 84, order: 86, agriculture: 180, commerce: 190 },
  { cityName: '襄阳', title: '南服从道 · 兵家必争重镇', defense: 1700, maxDefense: 2800, grain: 29000, gold: 17000, troops: 26000, training: 66, morale: 76, order: 80, agriculture: 130, commerce: 120 },
  { cityName: '洛阳', title: '十三朝古都 · 巍巍帝室王气', defense: 1500, maxDefense: 4000, grain: 31000, gold: 22000, troops: 30000, training: 68, morale: 75, order: 72, agriculture: 140, commerce: 170 }
];

export default function InternalAffairs({
  officers,
  soundEnabled,
  playDrumSound,
  playClashSound,
  playHarvestSound,
  onSelectOfficer,
  gameYear,
  gameMonth,
  gameXun,
  isAutoTime,
  timeSpeed,
  onToggleAutoTime,
  onSetTimeSpeed,
  onAdvanceXun,
  onAdvanceMonth,
  isActiveTab = false
}: InternalAffairsProps) {
  // City Affairs Status
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);
  const [cityState, setCityState] = useState<CityAffairsState>(PRESET_CITIES[0]);

  // Calendar Timeline Aliases
  const currentYear = gameYear;
  const currentMonth = gameMonth;
  const currentTurnXun = gameXun;

  // Task Selection & Officer Assignment
  const [activeTaskType, setActiveTaskType] = useState<InternalTaskType>('agriculture');
  const [selectedOfficerId, setSelectedOfficerId] = useState<string>(
    officers.find(o => o.id === 'zhugeliang')?.id || officers[0]?.id || ''
  );

  // Active Ongoing Task Slots (max 4 concurrent officers)
  const [assignments, setAssignments] = useState<TaskAssignment[]>([
    {
      id: 'task-1',
      officerId: officers.find(o => o.id === 'zhugeliang')?.id || officers[0]?.id,
      taskType: 'agriculture',
      progress: 65,
      targetDays: 30,
      completedCycles: 1,
      lastOutputSummary: '上期引灌都江清渠，增产军粮 +1,980 石'
    },
    {
      id: 'task-2',
      officerId: officers.find(o => o.id === 'guanyu')?.id || officers[1]?.id,
      taskType: 'drill',
      progress: 40,
      targetDays: 30,
      completedCycles: 2,
      lastOutputSummary: '校场斩木列阵，三军训练度 +18，士气提升至高昂'
    },
    {
      id: 'task-3',
      officerId: officers.find(o => o.id === 'caocao')?.id || officers[2]?.id,
      taskType: 'fortify',
      progress: 80,
      targetDays: 30,
      completedCycles: 1,
      lastOutputSummary: '修筑外郭拒马壕沟，城防坚固度 +110'
    }
  ]);

  // Chronicle Log (奏折大事记)
  const [chronicleLogs, setChronicleLogs] = useState<Array<{
    id: string;
    date: string;
    text: string;
    type: 'grain' | 'defense' | 'drill' | 'gold' | 'order' | 'critical';
  }>>([
    {
      id: 'log-1',
      date: '建安十三年春三月',
      text: '诸葛亮 巡按南阳沃野，劝课农桑，推行连环水车灌田，全郡仓廪军粮入库 +2,120 石！',
      type: 'grain'
    },
    {
      id: 'log-2',
      date: '建安十三年春二月',
      text: '关羽 督帅三军于校场演练大刀战阵，将士呐喊震野，三军训练度大幅提升，士气威凌四海！',
      type: 'drill'
    },
    {
      id: 'log-3',
      date: '建安十三年春正月',
      text: '曹操 督造重门与护城坚壕，严设弩台与箭眼，守城耐久增加 +180。',
      type: 'defense'
    }
  ]);

  // Notification Banner
  const [lastEventNotice, setLastEventNotice] = useState<string | null>(null);

  // Selected officer object
  const currentOfficer = useMemo(() => {
    return officers.find(o => o.id === selectedOfficerId) || officers[0];
  }, [officers, selectedOfficerId]);

  // Current task config
  const currentTaskConfig = useMemo(() => {
    return INTERNAL_TASKS.find(t => t.id === activeTaskType) || INTERNAL_TASKS[0];
  }, [activeTaskType]);

  // Mathematical Formula Calculations for current officer and task
  const formulaCalculation = useMemo(() => {
    if (!currentOfficer) {
      return {
        progressPerXun: 0,
        outputYield: 0,
        outputLabel: '',
        formulaStep1: '',
        formulaStep2: '',
        rating: '平庸',
        ratingBadge: 'text-slate-400 bg-slate-900'
      };
    }

    const { politics: pol, leadership: ldr, force: frc, intelligence: itl, charisma: chr } = currentOfficer.stats;

    let progressPerXun = 0;
    let outputYield = 0;
    let outputLabel = '';
    let formulaStep1 = '';
    let formulaStep2 = '';

    switch (activeTaskType) {
      case 'fortify': {
        // POL 60% + LDR 40%
        progressPerXun = Math.floor(pol * 0.60 + ldr * 0.40);
        outputYield = Math.floor(pol * 0.70 + ldr * 0.50);
        outputLabel = `城防耐久 +${outputYield}`;
        formulaStep1 = `⌊${pol}(POL) × 0.60 + ${ldr}(LDR) × 0.40⌋ = ${progressPerXun} 进度/旬`;
        formulaStep2 = `⌊${pol}(POL) × 0.70 + ${ldr}(LDR) × 0.50⌋ = +${outputYield} 城防坚城增益`;
        break;
      }
      case 'agriculture': {
        // POL 70% + CHR 20% + LDR 10%
        progressPerXun = Math.floor(pol * 0.70 + chr * 0.20 + ldr * 0.10);
        outputYield = Math.floor(pol * 16 + chr * 6);
        outputLabel = `军粮储备 +${outputYield.toLocaleString()} 石`;
        formulaStep1 = `⌊${pol}(POL) × 0.70 + ${chr}(CHR) × 0.20 + ${ldr}(LDR) × 0.10⌋ = ${progressPerXun} 进度/旬`;
        formulaStep2 = `⌊${pol}(POL) × 16 + ${chr}(CHR) × 6⌋ = +${outputYield} 石军粮收成`;
        break;
      }
      case 'drill': {
        // LDR 60% + FOR 40%
        progressPerXun = Math.floor(ldr * 0.60 + frc * 0.40);
        const trainingGain = Math.floor(ldr * 0.40 + frc * 0.20);
        const moraleGain = Math.floor(ldr * 0.25 + frc * 0.25);
        outputYield = trainingGain;
        outputLabel = `训练度 +${trainingGain}，士气 +${moraleGain}`;
        formulaStep1 = `⌊${ldr}(LDR) × 0.60 + ${frc}(FOR) × 0.40⌋ = ${progressPerXun} 进度/旬`;
        formulaStep2 = `训练度: ⌊${ldr}×0.4 + ${frc}×0.2⌋=+${trainingGain} | 士气: ⌊${ldr}×0.25 + ${frc}×0.25⌋=+${moraleGain}`;
        break;
      }
      case 'patrol': {
        // FOR 50% + LDR 30% + CHR 20%
        progressPerXun = Math.floor(frc * 0.50 + ldr * 0.30 + chr * 0.20);
        const orderGain = Math.floor(frc * 0.30 + ldr * 0.20);
        const sentimentGain = Math.floor(chr * 0.40);
        outputYield = orderGain;
        outputLabel = `治安 +${orderGain}，民心爱戴 +${sentimentGain}`;
        formulaStep1 = `⌊${frc}(FOR) × 0.50 + ${ldr}(LDR) × 0.30 + ${chr}(CHR) × 0.20⌋ = ${progressPerXun} 进度/旬`;
        formulaStep2 = `治安: ⌊${frc}×0.3 + ${ldr}×0.2⌋=+${orderGain} | 民心: ⌊${chr}×0.4⌋=+${sentimentGain}`;
        break;
      }
      case 'commerce': {
        // POL 50% + INT 50%
        progressPerXun = Math.floor(pol * 0.50 + itl * 0.50);
        outputYield = Math.floor(pol * 12 + itl * 8);
        outputLabel = `府库赋税 +${outputYield.toLocaleString()} 两`;
        formulaStep1 = `⌊${pol}(POL) × 0.50 + ${itl}(INT) × 0.50⌋ = ${progressPerXun} 进度/旬`;
        formulaStep2 = `⌊${pol}(POL) × 12 + ${itl}(INT) × 8⌋ = +${outputYield} 两白银商税`;
        break;
      }
    }

    let rating = '平庸 (C)';
    let ratingBadge = 'text-slate-400 bg-slate-900 border-slate-800';
    if (progressPerXun >= 88) {
      rating = '神谋国士 · S+';
      ratingBadge = 'text-amber-400 bg-amber-950/40 border-amber-500/40 shadow-sm';
    } else if (progressPerXun >= 78) {
      rating = '栋梁名将 · A';
      ratingBadge = 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';
    } else if (progressPerXun >= 68) {
      rating = '能吏宿将 · B';
      ratingBadge = 'text-sky-400 bg-sky-950/40 border-sky-500/40';
    }

    return {
      progressPerXun,
      outputYield,
      outputLabel,
      formulaStep1,
      formulaStep2,
      rating,
      ratingBadge
    };
  }, [currentOfficer, activeTaskType]);

  // Ranking of all officers for the selected task
  const topRecommendedOfficers = useMemo(() => {
    return [...officers].map(off => {
      const { politics: pol, leadership: ldr, force: frc, intelligence: itl, charisma: chr } = off.stats;
      let score = 0;
      if (activeTaskType === 'fortify') score = pol * 0.60 + ldr * 0.40;
      else if (activeTaskType === 'agriculture') score = pol * 0.70 + chr * 0.20 + ldr * 0.10;
      else if (activeTaskType === 'drill') score = ldr * 0.60 + frc * 0.40;
      else if (activeTaskType === 'patrol') score = frc * 0.50 + ldr * 0.30 + chr * 0.20;
      else if (activeTaskType === 'commerce') score = pol * 0.50 + itl * 0.50;
      return { officer: off, score: Math.round(score) };
    }).sort((a, b) => b.score - a.score);
  }, [officers, activeTaskType]);

  // Assign current officer to current task
  const handleAssignTask = () => {
    if (!currentOfficer) return;

    // Check if officer is already on a task
    const existingIndex = assignments.findIndex(a => a.officerId === currentOfficer.id);
    
    if (soundEnabled) {
      playDrumSound();
    }

    if (existingIndex !== -1) {
      // Update existing assignment
      const updated = [...assignments];
      updated[existingIndex] = {
        ...updated[existingIndex],
        taskType: activeTaskType,
        progress: 0,
        lastOutputSummary: `调派新差役：【${currentTaskConfig.name}】`
      };
      setAssignments(updated);
      setLastEventNotice(`已将【${currentOfficer.name}】调整至主理【${currentTaskConfig.name}】！`);
    } else {
      if (assignments.length >= 4) {
        // Replace oldest or alert
        const updated = assignments.slice(1);
        updated.push({
          id: `task-${Date.now()}`,
          officerId: currentOfficer.id,
          taskType: activeTaskType,
          progress: 0,
          targetDays: 30,
          completedCycles: 0,
          lastOutputSummary: `初次受命主持【${currentTaskConfig.name}】`
        });
        setAssignments(updated);
        setLastEventNotice(`内政差役名额已满，将【${currentOfficer.name}】编入主持【${currentTaskConfig.name}】！`);
      } else {
        setAssignments([
          ...assignments,
          {
            id: `task-${Date.now()}`,
            officerId: currentOfficer.id,
            taskType: activeTaskType,
            progress: 0,
            targetDays: 30,
            completedCycles: 0,
            lastOutputSummary: `正式受命主持【${currentTaskConfig.name}】`
          }
        ]);
        setLastEventNotice(`已成功命【${currentOfficer.name}】挂帅主理【${currentTaskConfig.name}】！`);
      }
    }
  };

  // Remove assignment
  const handleRemoveAssignment = (assignmentId: string) => {
    setAssignments(prev => prev.filter(a => a.id !== assignmentId));
  };

  // Advance single task
  const handleAdvanceSingleTask = (assignment: TaskAssignment) => {
    const officer = officers.find(o => o.id === assignment.officerId);
    if (!officer) return;

    const { politics: pol, leadership: ldr, force: frc, intelligence: itl, charisma: chr } = officer.stats;
    let progressDelta = 0;
    if (assignment.taskType === 'fortify') progressDelta = Math.floor(pol * 0.60 + ldr * 0.40);
    else if (assignment.taskType === 'agriculture') progressDelta = Math.floor(pol * 0.70 + chr * 0.20 + ldr * 0.10);
    else if (assignment.taskType === 'drill') progressDelta = Math.floor(ldr * 0.60 + frc * 0.40);
    else if (assignment.taskType === 'patrol') progressDelta = Math.floor(frc * 0.50 + ldr * 0.30 + chr * 0.20);
    else if (assignment.taskType === 'commerce') progressDelta = Math.floor(pol * 0.50 + itl * 0.50);

    // Add some random variation (90% - 110%)
    const variance = 0.9 + Math.random() * 0.2;
    const finalDelta = Math.max(10, Math.floor(progressDelta * variance));

    const newProgress = assignment.progress + finalDelta;

    if (newProgress >= 100) {
      // Completed cycle!
      applyTaskOutcome(officer, assignment.taskType, true);
      setAssignments(prev => prev.map(a => {
        if (a.id === assignment.id) {
          return {
            ...a,
            progress: newProgress % 100,
            completedCycles: a.completedCycles + 1,
            lastOutputSummary: `🎉 达成旬期大成，成果结算入库！`
          };
        }
        return a;
      }));
    } else {
      if (soundEnabled) playDrumSound();
      setAssignments(prev => prev.map(a => {
        if (a.id === assignment.id) {
          return {
            ...a,
            progress: newProgress,
            lastOutputSummary: `本期督办进度 +${finalDelta}%`
          };
        }
        return a;
      }));
    }
  };

  // Apply task completion outcome to City State
  const applyTaskOutcome = (officer: Officer, taskType: InternalTaskType, isHarvest: boolean) => {
    const { politics: pol, leadership: ldr, force: frc, intelligence: itl, charisma: chr } = officer.stats;
    
    // Check for critical success (暴击神工)
    const isCritical = Math.random() < 0.25;
    const multiplier = isCritical ? 1.5 : 1.0;

    let logText = '';
    let logType: 'grain' | 'defense' | 'drill' | 'gold' | 'order' | 'critical' = 'grain';

    setCityState(prev => {
      const next = { ...prev };
      
      switch (taskType) {
        case 'fortify': {
          const gain = Math.floor((pol * 0.70 + ldr * 0.50) * multiplier);
          next.defense = Math.min(next.maxDefense, next.defense + gain);
          logType = 'defense';
          logText = `${officer.name} 督筑城池${isCritical ? '【巧夺天工】' : ''}，夯土立寨并设铁蒺藜拒马，城防耐久 +${gain}！`;
          break;
        }
        case 'agriculture': {
          const grainGain = Math.floor((pol * 16 + chr * 6) * multiplier);
          const agriGain = Math.floor((pol * 0.40) * multiplier);
          next.grain += grainGain;
          next.agriculture = Math.min(300, next.agriculture + agriGain);
          logType = 'grain';
          logText = `${officer.name} 亲临阡陌${isCritical ? '【甘霖大丰收】' : ''}，屯田丰沛，仓廪军粮 +${grainGain.toLocaleString()} 石，农耕开发度 +${agriGain}！`;
          break;
        }
        case 'drill': {
          const trainingGain = Math.floor((ldr * 0.40 + frc * 0.20) * multiplier);
          const moraleGain = Math.floor((ldr * 0.25 + frc * 0.25) * multiplier);
          next.training = Math.min(100, next.training + trainingGain);
          next.morale = Math.min(100, next.morale + moraleGain);
          logType = 'drill';
          logText = `${officer.name} 拔剑点兵${isCritical ? '【士气如虹】' : ''}，三军阵势如臂使指，部队训练度 +${trainingGain}，士气 +${moraleGain}！`;
          break;
        }
        case 'patrol': {
          const orderGain = Math.floor((frc * 0.30 + ldr * 0.20) * multiplier);
          next.order = Math.min(100, next.order + orderGain);
          logType = 'order';
          logText = `${officer.name} 铁腕纠察，缉拿流寇匪首，治下治安稳如泰山 +${orderGain}，市井安居乐业！`;
          break;
        }
        case 'commerce': {
          const goldGain = Math.floor((pol * 12 + itl * 8) * multiplier);
          next.gold += goldGain;
          next.commerce = Math.min(300, next.commerce + Math.floor(pol * 0.35));
          logType = 'gold';
          logText = `${officer.name} 互市通商${isCritical ? '【巨贾云集】' : ''}，榷税大丰，府库库银 +${goldGain.toLocaleString()} 两白银！`;
          break;
        }
      }
      return next;
    });

    if (soundEnabled && isActiveTab) {
      if (isCritical) {
        playHarvestSound();
      } else {
        playDrumSound();
      }
    }

    // Prepend chronicle log
    const xunLabel = currentTurnXun === 1 ? '上旬' : currentTurnXun === 2 ? '中旬' : '下旬';
    const dateLabel = `公元${currentYear}年 ${currentMonth}月·${xunLabel}`;
    setChronicleLogs(prev => [
      {
        id: `log-${Date.now()}-${Math.random()}`,
        date: dateLabel,
        text: logText,
        type: isCritical ? 'critical' : logType
      },
      ...prev.slice(0, 15)
    ]);

    setLastEventNotice(logText);
  };

  // Auto-advance internal tasks when background time ticks forward
  const lastTickRef = useRef({ year: gameYear, month: gameMonth, xun: gameXun });

  useEffect(() => {
    if (
      lastTickRef.current.year === gameYear &&
      lastTickRef.current.month === gameMonth &&
      lastTickRef.current.xun === gameXun
    ) {
      return;
    }
    const isMonthAdvance = lastTickRef.current.month !== gameMonth || lastTickRef.current.year !== gameYear;
    lastTickRef.current = { year: gameYear, month: gameMonth, xun: gameXun };

    setAssignments(prev => {
      return prev.map(assignment => {
        const officer = officers.find(o => o.id === assignment.officerId);
        if (!officer) return assignment;

        const { politics: pol, leadership: ldr, force: frc, intelligence: itl, charisma: chr } = officer.stats;
        let baseYield = 0;
        if (assignment.taskType === 'fortify') baseYield = Math.floor(pol * 0.60 + ldr * 0.40);
        else if (assignment.taskType === 'agriculture') baseYield = Math.floor(pol * 0.70 + chr * 0.20 + ldr * 0.10);
        else if (assignment.taskType === 'drill') baseYield = Math.floor(ldr * 0.60 + frc * 0.40);
        else if (assignment.taskType === 'patrol') baseYield = Math.floor(frc * 0.50 + ldr * 0.30 + chr * 0.20);
        else if (assignment.taskType === 'commerce') baseYield = Math.floor(pol * 0.50 + itl * 0.50);

        const delta = isMonthAdvance 
          ? Math.floor(baseYield * 1.5)
          : Math.max(12, Math.floor(baseYield * (0.9 + Math.random() * 0.2)));

        const newProgress = assignment.progress + delta;
        if (newProgress >= 100) {
          applyTaskOutcome(officer, assignment.taskType, true);
          return {
            ...assignment,
            progress: newProgress % 100,
            completedCycles: assignment.completedCycles + 1,
            lastOutputSummary: `🎉 岁时自转达成，功绩成果入库！`
          };
        } else {
          return {
            ...assignment,
            progress: newProgress,
            lastOutputSummary: `本旬督办进度 +${delta}%`
          };
        }
      });
    });

    // Seasonal bonuses
    if (isMonthAdvance) {
      if (gameMonth === 3) {
        setCityState(prev => ({ ...prev, gold: prev.gold + 1800 }));
        setChronicleLogs(prev => [
          {
            id: `season-gold-${Date.now()}`,
            date: `公元${gameYear}年 春三月`,
            text: '🌸 春阳抚照，全郡行户榷税归库，府库增加税银 +1,800 两！',
            type: 'gold'
          },
          ...prev.slice(0, 15)
        ]);
      } else if (gameMonth === 9) {
        setCityState(prev => ({ ...prev, grain: prev.grain + 6500 }));
        setChronicleLogs(prev => [
          {
            id: `season-grain-${Date.now()}`,
            date: `公元${gameYear}年 秋九月`,
            text: '🍂 金秋大熟，阡陌万亩连云，仓廪充盈，军粮入库 +6,500 石！',
            type: 'grain'
          },
          ...prev.slice(0, 15)
        ]);
      }
    }
  }, [gameYear, gameMonth, gameXun, officers]);

  // Advance Month (全国内政大推进)
  const handleAdvanceMonth = () => {
    onAdvanceMonth();
  };

  // Reset city defaults
  const handleSwitchCity = (idx: number) => {
    setSelectedCityIndex(idx);
    setCityState(PRESET_CITIES[idx]);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12 font-sans select-none">
      
      {/* ================= HEADER: CITY OVERVIEW & CALENDAR CONTROLS ================= */}
      <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950 to-black">
        
        {/* Subtle decorative background watermarks */}
        <div className="absolute right-6 -bottom-8 pointer-events-none opacity-5 flex items-center select-none font-serif text-8xl font-black text-amber-500">
          政道
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          
          {/* City & Timeline Details */}
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Building2 size={24} />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-serif font-black text-slate-100 tracking-wide">
                    {cityState.cityName} · 治所内政经略
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                    政通人和
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {PRESET_CITIES[selectedCityIndex].title}
                </p>
              </div>
            </div>

            {/* City Preset Switcher Pills */}
            <div className="flex flex-wrap gap-1.5 mt-3.5">
              <span className="text-[10px] font-mono text-slate-500 self-center mr-1">调阅治所：</span>
              {PRESET_CITIES.map((c, idx) => (
                <button
                  key={c.cityName}
                  onClick={() => handleSwitchCity(idx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-serif transition-all cursor-pointer ${
                    selectedCityIndex === idx
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {c.cityName}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Date & Background Auto-Time Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
            <div className="bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-2xl flex items-center justify-between sm:justify-start gap-3 shadow-inner">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-amber-400" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-serif font-black text-amber-300">
                      公元 {currentYear} 年 · {currentMonth} 月
                    </span>
                    <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-amber-950/40 border border-amber-900/50 text-amber-400 font-serif">
                      {currentMonth >= 1 && currentMonth <= 3 ? '🌸 春季' : currentMonth >= 4 && currentMonth <= 6 ? '☀️ 夏季' : currentMonth >= 7 && currentMonth <= 9 ? '🍂 秋季' : '❄️ 冬季'}
                    </span>
                  </div>
                  <div className="text-[9.5px] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isAutoTime ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                    <span>{isAutoTime ? '天运后台自转中' : '岁时已停步'}</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-amber-400/90">{timeSpeed === 'fast' ? '急速 (1.2s)' : timeSpeed === 'normal' ? '常速 (2.5s)' : '慢速 (5.0s)'}</span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-400 font-bold">
                {currentTurnXun === 1 ? '上旬' : currentTurnXun === 2 ? '中旬' : '下旬'}
              </span>
            </div>

            {/* Auto-Time Pause / Play Toggle */}
            <button
              id="btn-toggle-auto-time-affairs"
              onClick={onToggleAutoTime}
              className={`px-3 py-2.5 rounded-2xl text-xs font-serif font-black border transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                isAutoTime
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/40'
                  : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
              }`}
            >
              {isAutoTime ? <Pause size={13} /> : <Play size={13} fill="currentColor" />}
              <span>{isAutoTime ? '暂停自转' : '岁时自转'}</span>
            </button>

            {/* Speed Selector */}
            <div className="flex items-center rounded-2xl bg-slate-900 border border-slate-800 p-1 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => onSetTimeSpeed('slow')}
                className={`px-2 py-1 rounded-xl cursor-pointer transition-colors ${timeSpeed === 'slow' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                title="慢速"
              >
                1×
              </button>
              <button
                type="button"
                onClick={() => onSetTimeSpeed('normal')}
                className={`px-2 py-1 rounded-xl cursor-pointer transition-colors ${timeSpeed === 'normal' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                title="常速"
              >
                2×
              </button>
              <button
                type="button"
                onClick={() => onSetTimeSpeed('fast')}
                className={`px-2 py-1 rounded-xl cursor-pointer transition-colors ${timeSpeed === 'fast' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                title="快速"
              >
                3×
              </button>
            </div>

            {/* Manual Advance Single Xun */}
            <button
              id="btn-advance-xun"
              onClick={onAdvanceXun}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-serif px-3 py-2.5 rounded-2xl transition-all cursor-pointer"
              title="手动推进一旬"
            >
              +1旬
            </button>

            {/* Execute Month Advance */}
            <button
              id="btn-advance-month"
              onClick={handleAdvanceMonth}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-serif font-black text-xs px-4 py-2.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Play size={12} fill="currentColor" />
              <span>推进一月</span>
            </button>
          </div>

        </div>

        {/* City Resource Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-900/80">
          
          {/* Defense */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl flex flex-col justify-between">
            <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1 font-serif text-slate-300">
                <ShieldCheck size={13} className="text-sky-400" /> 城防耐久
              </span>
              <span className="text-[10px] text-sky-400 font-bold">{Math.round((cityState.defense / cityState.maxDefense) * 100)}%</span>
            </div>
            <div className="mt-2">
              <span className="text-base font-serif font-black text-slate-100">{cityState.defense}</span>
              <span className="text-[10px] text-slate-500 font-mono"> / {cityState.maxDefense}</span>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-sky-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${(cityState.defense / cityState.maxDefense) * 100}%` }}
              />
            </div>
          </div>

          {/* Grain */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl flex flex-col justify-between">
            <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1 font-serif text-slate-300">
                <Wheat size={13} className="text-emerald-400" /> 仓廪军粮
              </span>
              <span className="text-[10px] text-emerald-400">丰足</span>
            </div>
            <div className="mt-2">
              <span className="text-base font-serif font-black text-emerald-400">{cityState.grain.toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 font-mono"> 石</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-2">可供三军征战 18 个月</span>
          </div>

          {/* Gold */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl flex flex-col justify-between">
            <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1 font-serif text-slate-300">
                <Coins size={13} className="text-amber-400" /> 府库金库
              </span>
              <span className="text-[10px] text-amber-400">盈裕</span>
            </div>
            <div className="mt-2">
              <span className="text-base font-serif font-black text-amber-400">{cityState.gold.toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 font-mono"> 两</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-2">商贸通达财源广进</span>
          </div>

          {/* Drill / Training */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl flex flex-col justify-between">
            <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1 font-serif text-slate-300">
                <Swords size={13} className="text-rose-400" /> 训练与兵员
              </span>
              <span className="text-[10px] text-rose-400">{cityState.training}/100</span>
            </div>
            <div className="mt-2">
              <span className="text-base font-serif font-black text-rose-400">{cityState.training}</span>
              <span className="text-[10px] text-slate-400 font-mono"> 熟练 | {cityState.troops.toLocaleString()}兵</span>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-rose-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${cityState.training}%` }}
              />
            </div>
          </div>

          {/* Morale */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl flex flex-col justify-between">
            <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1 font-serif text-slate-300">
                <Flame size={13} className="text-orange-400" /> 三军士气
              </span>
              <span className="text-[10px] text-orange-400">{cityState.morale}/100</span>
            </div>
            <div className="mt-2">
              <span className="text-base font-serif font-black text-orange-400">{cityState.morale}</span>
              <span className="text-[10px] text-slate-500 font-mono"> 斗志昂扬</span>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-orange-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${cityState.morale}%` }}
              />
            </div>
          </div>

          {/* Public Order */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl flex flex-col justify-between">
            <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1 font-serif text-slate-300">
                <ShieldAlert size={13} className="text-teal-400" /> 治安民心
              </span>
              <span className="text-[10px] text-teal-400">{cityState.order}/100</span>
            </div>
            <div className="mt-2">
              <span className="text-base font-serif font-black text-teal-400">{cityState.order}</span>
              <span className="text-[10px] text-slate-500 font-mono"> 郡县安宁</span>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-teal-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${cityState.order}%` }}
              />
            </div>
          </div>

        </div>

      </div>

      {/* ================= NOTICE TOAST BANNER ================= */}
      <AnimatePresence>
        {lastEventNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-amber-950/40 border border-amber-500/40 text-amber-300 px-4 py-2.5 rounded-2xl text-xs font-serif flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-amber-400 animate-pulse" />
              <span>{lastEventNotice}</span>
            </div>
            <button 
              onClick={() => setLastEventNotice(null)}
              className="text-amber-400 hover:text-amber-200 text-xs px-2 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MAIN ASSIGNMENT & FORMULA WORKBENCH ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Span 7): Task Selection & Officer Formula Calculator */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* 1. Task Category Navigation Pills */}
          <div className="bg-slate-950 p-4 rounded-3xl border border-slate-900">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block mb-3">
              一、选择内政差役类型 (Task Category)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {INTERNAL_TASKS.map(task => {
                const isSelected = activeTaskType === task.id;
                return (
                  <button
                    key={task.id}
                    id={`btn-task-${task.id}`}
                    onClick={() => setActiveTaskType(task.id)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-serif font-black text-slate-100 flex items-center gap-1.5">
                        {task.name}
                      </span>
                      {isSelected && <CheckCircle2 size={13} className="text-amber-400" />}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                      {task.category}
                    </span>
                    <span className={`text-[9.5px] font-mono mt-2 px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-950 text-slate-500'
                    }`}>
                      {task.id === 'fortify' ? 'POL + LDR' : 
                       task.id === 'agriculture' ? 'POL 核心' : 
                       task.id === 'drill' ? 'LDR + FOR' : 
                       task.id === 'patrol' ? 'FOR + LDR' : 'POL + INT'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Task Tagline Description */}
            <div className="mt-4 p-3.5 bg-slate-900/50 rounded-2xl border border-slate-850 flex items-start gap-3">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                <BookOpen size={16} />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-black text-xs text-amber-300">
                    【{currentTaskConfig.name}】· {currentTaskConfig.tagline}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">主考五维：{currentTaskConfig.coreAttributes}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans mt-1 leading-relaxed">
                  {currentTaskConfig.description}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Select Officer for this task */}
          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-900 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                二、遴选任命主理武将 (Assign Officer)
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                当前军中名将库：{officers.length} 位
              </span>
            </div>

            {/* Officer Selection Quick Grid (Showing Top Recommendations First) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
              {topRecommendedOfficers.map(({ officer, score }, idx) => {
                const isSelected = selectedOfficerId === officer.id;
                return (
                  <button
                    key={officer.id}
                    id={`btn-select-officer-${officer.id}`}
                    onClick={() => {
                      setSelectedOfficerId(officer.id);
                      if (onSelectOfficer) onSelectOfficer(officer);
                    }}
                    className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500/40 shadow-sm'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-800 shrink-0 relative bg-slate-900">
                      <AvatarRenderer style={officer.avatarStyle} size={40} />
                      {idx === 0 && (
                        <div className="absolute top-0 left-0 bg-amber-500 text-slate-950 text-[8px] font-bold px-1 rounded-br">
                          首选
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-black text-xs text-slate-200 truncate block">
                          {officer.name}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-amber-400 ml-1 shrink-0">
                          {score}分
                        </span>
                      </div>
                      <div className="flex gap-1 text-[9px] font-mono text-slate-400 mt-0.5">
                        <span>政:{officer.stats.politics}</span>
                        <span>统:{officer.stats.leadership}</span>
                        <span>武:{officer.stats.force}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 3. Mathematical Formula HUD Calculation Card */}
            {currentOfficer && (
              <div className="bg-slate-900 border border-slate-850 p-4.5 rounded-2xl flex flex-col gap-3 mt-1">
                <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
                      <Calculator size={15} />
                    </span>
                    <div>
                      <h4 className="font-serif font-black text-xs text-slate-100">
                        【{currentOfficer.name}】主理【{currentTaskConfig.name}】精准数理测算
                      </h4>
                      <span className="text-[10px] font-mono text-slate-500">五维属性动态加权公式</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-serif font-black px-2.5 py-1 rounded-xl border ${formulaCalculation.ratingBadge}`}>
                    {formulaCalculation.rating}
                  </span>
                </div>

                {/* Mathematical Formula Walkthrough */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 font-mono text-xs space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-400 text-[11px]">任务进度推演：</span>
                    <span className="text-amber-400 font-bold text-right text-[11.5px]">
                      {formulaCalculation.formulaStep1}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2 border-t border-slate-900 pt-2">
                    <span className="text-slate-400 text-[11px]">成果收益折算：</span>
                    <span className="text-emerald-400 font-bold text-right text-[11.5px]">
                      {formulaCalculation.formulaStep2}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2 border-t border-slate-900 pt-2 text-[10.5px]">
                    <span className="text-slate-500">理论公式：</span>
                    <span className="text-slate-400 text-right">
                      {currentTaskConfig.formulaDisplay}
                    </span>
                  </div>
                </div>

                {/* Assign Button */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="text-[11px] text-slate-400 font-serif">
                    预期成果：<strong className="text-amber-400">{formulaCalculation.outputLabel}</strong>
                  </div>

                  <button
                    id="btn-confirm-assign-task"
                    onClick={handleAssignTask}
                    className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-serif font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck size={14} />
                    <span>颁布将令 · 委派此将</span>
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>

        {/* Right Column (Span 5): Active Ongoing Task Slots & Chronicle Log */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Ongoing Task Assignments (在督内政差役) */}
          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-900 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Layers size={13} className="text-amber-500" /> 当前督理差役 ({assignments.length} / 4)
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                可多位名将同步督办
              </span>
            </div>

            {assignments.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs font-serif">
                暂未分配内政任务，请在左侧选拔名将并指派！
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {assignments.map(assignment => {
                  const officer = officers.find(o => o.id === assignment.officerId);
                  const taskConfig = INTERNAL_TASKS.find(t => t.id === assignment.taskType) || INTERNAL_TASKS[0];
                  if (!officer) return null;

                  return (
                    <div 
                      key={assignment.id}
                      className="bg-slate-900/90 border border-slate-800/90 p-3.5 rounded-2xl flex flex-col gap-2.5 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-800 relative bg-slate-950 shrink-0">
                            <AvatarRenderer style={officer.avatarStyle} size={40} />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-serif font-black text-xs text-slate-100">
                                {officer.name}
                              </span>
                              <span className="text-[10px] font-serif font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                {taskConfig.name}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                              已历 {assignment.completedCycles} 轮经略
                            </span>
                          </div>
                        </div>

                        {/* Quick Action buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            id={`btn-advance-task-${assignment.id}`}
                            onClick={() => handleAdvanceSingleTask(assignment)}
                            className="p-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-[10px] font-serif flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                            title="单独督促加速推进 1 旬"
                          >
                            <Zap size={11} /> 督策
                          </button>
                          <button
                            onClick={() => handleRemoveAssignment(assignment.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 text-[10px] transition cursor-pointer"
                            title="解任或召回"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                          <span>督办进度</span>
                          <span className="text-amber-400 font-bold">{assignment.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${assignment.progress}%` }}
                            transition={{ duration: 0.4 }}
                            className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                          />
                        </div>
                      </div>

                      {/* Last output message */}
                      {assignment.lastOutputSummary && (
                        <div className="text-[10px] font-sans text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-900 flex items-center justify-between">
                          <span className="truncate">{assignment.lastOutputSummary}</span>
                          <span className="text-[9px] font-mono text-emerald-400 ml-1 shrink-0">结算效验</span>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chronicle History Log (内政奏折实录) */}
          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-900 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <BookOpen size={13} className="text-amber-400" /> 内政经略实录奏折
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                最新奏疏
              </span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {chronicleLogs.map(log => {
                const badgeColor = 
                  log.type === 'grain' ? 'text-emerald-400 border-emerald-900/50 bg-emerald-950/20' :
                  log.type === 'defense' ? 'text-sky-400 border-sky-900/50 bg-sky-950/20' :
                  log.type === 'drill' ? 'text-rose-400 border-rose-900/50 bg-rose-950/20' :
                  log.type === 'gold' ? 'text-amber-400 border-amber-900/50 bg-amber-950/20' :
                  log.type === 'critical' ? 'text-purple-400 border-purple-900/50 bg-purple-950/30' :
                  'text-slate-400 border-slate-800 bg-slate-900';

                return (
                  <div 
                    key={log.id} 
                    className="p-2.5 bg-slate-900/50 border border-slate-850 rounded-xl flex flex-col gap-1 text-[11px] leading-relaxed font-sans"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] text-slate-500">{log.date}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${badgeColor}`}>
                        {log.type === 'grain' ? '屯田入库' :
                         log.type === 'defense' ? '坚城竣工' :
                         log.type === 'drill' ? '誓师大捷' :
                         log.type === 'gold' ? '商税大征' :
                         log.type === 'critical' ? '天降神工' : '治下平定'}
                      </span>
                    </div>
                    <p className="text-slate-300 font-serif">
                      {log.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
