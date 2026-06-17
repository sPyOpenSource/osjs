import React, { useState } from 'react';
import { CampaignScenario, Officer } from '../types';
import { FAMOUS_OFFICERS, FACTIONS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import AvatarRenderer from './AvatarRenderer';
import { 
  Users, 
  Map, 
  UserPlus, 
  Heart, 
  Play, 
  HelpCircle, 
  BookOpen, 
  Compass, 
  Sparkles, 
  Shield, 
  Award, 
  Volume2, 
  VolumeX,
  MapPin,
  Flame,
  Globe,
  Star
} from 'lucide-react';

interface StartMenuProps {
  scenarios: CampaignScenario[];
  selectedScenario: CampaignScenario;
  onSelectScenario: (scenario: CampaignScenario) => void;
  onEnterApp: (tab: 'roster' | 'creator' | 'bonds' | 'map') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function StartMenu({ 
  scenarios, 
  selectedScenario, 
  onSelectScenario, 
  onEnterApp,
  soundEnabled,
  onToggleSound
}: StartMenuProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [showCredits, setShowCredits] = useState(false);

  // Showcase three prominent generals in an interactive display
  const spotlightGenerals = FAMOUS_OFFICERS.filter(o => 
    ['liubei', 'caocao', 'zhugeliang', 'guanyu', 'lubu'].includes(o.id)
  );
  
  const [generalSpotlightIdx, setGeneralSpotlightIdx] = useState(0);
  const currentShowcaseGeneral = spotlightGenerals[generalSpotlightIdx];

  const menuOptions = [
    {
      id: 'roster',
      title: '兵甲集结 · 登入名册',
      english: 'ENTER OFFICER ROSTER',
      desc: '预览与检索剧本中的群雄人物，查看其五维基础能力、技能及传记。',
      color: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      hoverBg: 'hover:bg-amber-500/10',
      icon: <Users size={18} className="text-amber-400" />
    },
    {
      id: 'map',
      title: '沙盘天盘 · 兵家对决',
      english: 'CAMPAIGN TACTICAL MAP',
      desc: '进入中国古代军事沙盘，手动干预势力划分，多方面模拟行军、出征与夺主治理。',
      color: 'text-teal-400',
      borderColor: 'border-teal-500/30',
      hoverBg: 'hover:bg-teal-500/10',
      icon: <Map size={18} className="text-teal-400" />
    },
    {
      id: 'creator',
      title: '校场点将 · 自由创角',
      english: 'CUSTOM GENERAL GENERATOR',
      desc: '登记或投生您自己创设的新豪杰，精心设置容貌、数值与神谋，登庸其入仕。',
      color: 'text-sky-400',
      borderColor: 'border-sky-500/30',
      hoverBg: 'hover:bg-sky-500/10',
      icon: <UserPlus size={18} className="text-sky-400" />
    },
    {
      id: 'bonds',
      title: '情照生死 · 两军对局',
      english: 'HERO SHACKLES & DUELS',
      desc: '缔结将军之义结金兰、宿命仇冤，在修罗场进行 1 投 1 阵前白刃战演练。',
      color: 'text-rose-400',
      borderColor: 'border-rose-500/30',
      hoverBg: 'hover:bg-rose-500/10',
      icon: <Heart size={18} className="text-rose-400" />
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#060810] text-slate-100 flex flex-col justify-between overflow-hidden font-sans select-none selection:bg-amber-500/30 selection:text-amber-100">
      
      {/* Decorative Traditional Border Grid Lines */}
      <div className="absolute inset-0 pointer-events-none border-[12px] border-slate-950/90 z-40" />
      <div className="absolute inset-4 pointer-events-none border border-slate-900/40 z-40" />
      <div className="absolute inset-0 pointer-events-none z-30 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="startGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#startGrid)" />
        </svg>
      </div>

      {/* Atmospheric Glowing Lanterns/Backdrops lights */}
      <div className="absolute top-[10%] left-[10%] w-[350px] h-[350px] rounded-full bg-emerald-950/15 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-red-950/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-amber-950/5 blur-[150px] pointer-events-none" />

      {/* Start Page Top Utility Navigation */}
      <header className="px-10 py-6 flex justify-between items-center z-40">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono tracking-widest text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded-md bg-amber-950/10">
            COMPANION UNIT
          </span>
          <span className="text-[10px] text-slate-500 font-mono">v4.0.0 CLOUD LAB</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            id="btn-sound-toggle"
            onClick={onToggleSound}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors py-1 px-2.5 rounded-lg border border-slate-900 bg-slate-950/60"
          >
            {soundEnabled ? <Volume2 size={13} className="text-amber-500" /> : <VolumeX size={13} />}
            <span className="font-mono text-[10px] uppercase tracking-wider">{soundEnabled ? '音效开启' : '音效关闭'}</span>
          </button>
          
          <button 
            id="btn-help-credits"
            onClick={() => setShowCredits(!showCredits)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors py-1 px-2.5 rounded-lg border border-slate-900 bg-slate-950/60"
          >
            <HelpCircle size={13} className="text-teal-400" />
            <span className="font-mono text-[10px] uppercase tracking-wider">关于/名著考据</span>
          </button>
        </div>
      </header>

      {/* Center Layout Container */}
      <main className="max-w-7xl w-full mx-auto px-8 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center z-30">
        
        {/* Left Side: Title Branding & Core Menu (Span 5) */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-8">
          
          {/* Main Title Banner */}
          <div className="space-y-3 relative">
            <div className="flex items-baseline gap-2.5">
              <span className="font-serif font-bold text-4xl md:text-5xl text-amber-500 drop-shadow-md relative mt-1 select-none">
                三國志
                <span className="absolute -top-6 -right-5 text-[11px] font-sans font-black tracking-widest text-[#060810] px-1.5 py-0.5 bg-amber-500 rounded border border-amber-400">
                  VIII
                </span>
              </span>
              <span className="text-2xl md:text-3xl font-serif font-black tracking-widest text-slate-100 uppercase">
                战术辅助模拟器
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-lg border-l-2 border-slate-800 pl-3.5">
              重回汉末乱世战骨，秉烛秉钧推演割据政图。为玩家特选构建的战略决策军机处，融合高阶五维属性配置与诸葛孔明 AI 星象战略。
            </p>
          </div>

          {/* Interactive Start Options List */}
          <div className="space-y-3 max-w-md">
            {menuOptions.map((opt) => (
              <button
                id={`start-menu-${opt.id}`}
                key={opt.id}
                onClick={() => onEnterApp(opt.id as any)}
                onMouseEnter={() => setHoveredOption(opt.id)}
                onMouseLeave={() => setHoveredOption(null)}
                className={`w-full text-left p-3.5 rounded-2xl border ${opt.borderColor} bg-slate-950/70 backdrop-blur-sm transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] flex items-center justify-between shadow-lg cursor-pointer`}
              >
                {/* Visual Accent Hover bar */}
                <span className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${
                  hoveredOption === opt.id ? 'bg-amber-500 scale-y-100' : 'bg-transparent scale-y-0'
                }`} />

                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 group-hover:border-amber-500/20 transition-colors">
                    {opt.icon}
                  </div>
                  <div>
                    <h4 className={`text-sm font-serif font-black tracking-wider transition-colors ${
                      hoveredOption === opt.id ? opt.color : 'text-slate-200'
                    }`}>
                      {opt.title}
                    </h4>
                    <span className="text-[8px] font-mono tracking-widest text-slate-500 group-hover:text-slate-400 block mt-0.5">
                      {opt.english}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-600 group-hover:text-amber-500 transition-colors pr-1.5">
                  <Play size={10} fill="currentColor" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[10px] font-mono font-bold">进入</span>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Stats overview of general count */}
          <div className="flex items-center gap-6 text-[11px] font-mono text-slate-500 border-t border-slate-900/60 pt-4 max-w-md">
            <div>
              武将基库: <span className="text-amber-500 font-bold">120+ 史实将</span>
            </div>
            <div>|</div>
            <div>
              战役军域: <span className="text-teal-400 font-bold">14 大名关九郡</span>
            </div>
            <div>|</div>
            <div>
              剧本星海: <span className="text-sky-400 font-bold">4 大历史时期</span>
            </div>
          </div>

        </div>

        {/* Right Side: Scenario Select & Hero Showcase Carousel (Span 7) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Scenario Selection Grid inside Start Menu */}
          <div className="bg-slate-950/80 border border-slate-900 rounded-3xl p-5 shadow-2xl space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-slate-600 flex items-center gap-1">
              <Globe size={11} /> 战略剧本点兵
            </div>
            
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <Flame size={12} className="text-amber-500" />
              当前参演：历史史实剧本设定
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {scenarios.map((sc) => {
                const isSelected = selectedScenario.id === sc.id;
                return (
                  <button
                    id={`start-sc-${sc.id}`}
                    key={sc.id}
                    onClick={() => onSelectScenario(sc)}
                    className={`text-left p-3 rounded-xl border transition-all relative overflow-hidden group cursor-pointer ${
                      isSelected 
                        ? 'bg-slate-900/80 border-amber-500/80 shadow-md' 
                        : 'bg-slate-950/40 border-slate-900 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className={`text-[11.5px] font-serif font-bold ${
                        isSelected ? 'text-amber-400' : 'text-slate-300'
                      }`}>
                        {sc.year}年·{sc.title.split('：')[1] || sc.title}
                      </h4>
                      <span className={`text-[7px] px-1 rounded uppercase font-mono ${
                        sc.difficulty === 'Easy' ? 'bg-emerald-950/40 text-emerald-400' :
                        sc.difficulty === 'Medium' ? 'bg-yellow-950/40 text-yellow-500' :
                        'bg-rose-950/40 text-rose-400'
                      }`}>
                        {sc.difficulty === 'Easy' ? '简' : sc.difficulty === 'Medium' ? '普' : '难'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-1 leading-normal font-sans group-hover:text-slate-400 transition-colors">
                      {sc.description}
                    </p>
                    {isSelected && (
                      <div className="absolute top-0 right-0 w-5 h-5 bg-gradient-to-tr from-transparent to-amber-500/20" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Expanded details of chosen scenario */}
            <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-900/80 text-[11px] space-y-1">
              <div className="flex justify-between font-mono text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin size={10} className="text-amber-500" />
                  胜负手决胜条件:
                </span>
                <span className="text-amber-400 font-bold">{selectedScenario.victoryCondition}</span>
              </div>
              <p className="text-[10px] text-slate-500 italic font-sans pl-3.5">
                &quot;{selectedScenario.description}&quot;
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Legend General Showcase Panel (Animated) */}
            <div className="md:col-span-7 bg-slate-950/80 border border-slate-900 rounded-3xl p-5 shadow-2xl flex flex-col justify-between min-h-[170px] relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-slate-900/60 blur-xl pointer-events-none" />
              
              <div className="flex justify-between items-center z-10">
                <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase inline-flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800/80">
                  <Star size={10} className="text-amber-400 fill-current" />
                  剧本核心将领列照
                </span>
                
                <div className="flex gap-1">
                  {spotlightGenerals.map((g, idx) => (
                    <button
                      id={`btn-spot-dot-${idx}`}
                      key={g.id}
                      onClick={() => setGeneralSpotlightIdx(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        generalSpotlightIdx === idx ? 'bg-amber-500 w-4' : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3.5 my-3.5 z-10">
                <AvatarRenderer style={currentShowcaseGeneral.avatarStyle} size={56} />
                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <h4 className="text-lg font-serif font-black text-amber-500">{currentShowcaseGeneral.name}</h4>
                    <span className="text-[10px] font-mono text-slate-400">{currentShowcaseGeneral.styleName ? `字 ${currentShowcaseGeneral.styleName}` : ''}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans line-clamp-2 leading-relaxed max-w-[200px]">
                    {currentShowcaseGeneral.biography}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono border-t border-slate-900/80 pt-2 z-10 text-slate-500">
                <span className="text-slate-400 font-sans">
                  效忠阵营: <strong style={{ color: FACTIONS.find(f => f.id === currentShowcaseGeneral.factionId)?.color }}>{FACTIONS.find(f => f.id === currentShowcaseGeneral.factionId)?.name}</strong>
                </span>
                <span className="text-slate-400">
                  统率 <strong className="text-amber-500">{currentShowcaseGeneral.stats.leadership}</strong> | 武力 <strong className="text-amber-500">{currentShowcaseGeneral.stats.force}</strong> | 智力 <strong className="text-amber-500">{currentShowcaseGeneral.stats.intelligence}</strong>
                </span>
              </div>
            </div>

            {/* Ambient System Status / Connection Beacon */}
            <div className="md:col-span-5 bg-slate-950/80 border border-slate-900 rounded-3xl p-5 shadow-2xl flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase block">天道玄数连线</span>
                <h4 className="text-xs font-serif font-bold text-slate-300">军政AI脑网状态</h4>
                <p className="text-[10px] text-slate-500 leading-normal font-sans py-1">
                  星盘系统内置诸葛孔明 AI。连上 Gemini 节点后即可以八卦乾坤盘解构任意武将的史诗军略。
                </p>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-900 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] text-slate-300 font-mono">
                  云脑星曜机枢就绪
                </span>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Embedded FAQ or Lore Modal overlay */}
      <AnimatePresence>
        {showCredits && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#020308]/90 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#0b0e1a] border border-slate-800 rounded-3xl p-6 max-w-2xl w-full text-left space-y-4 shadow-2xl relative"
            >
              <h3 className="text-xl font-serif font-black text-amber-500 flex items-center gap-2 pb-2 border-b border-slate-800">
                📖 三国志 8 辅助器考据说明
              </h3>
              
              <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed max-h-[380px] overflow-y-auto pr-2">
                <div>
                  <h4 className="font-bold text-slate-200">一、设计宗旨：</h4>
                  <p className="text-slate-400 text-[11px] mt-1">
                    本工具专为 <strong>《Romance of the Three Kingdoms VIII》</strong> 策略爱好者深度定做。界面风格全面还原古代锦囊、阵前军机议论氛围，摒弃喧嚣冗余的AI垃圾元素，将核心聚焦于武将战绩五维调优、金兰结义的情网羁绊以及天下沙盘城郭的割据。
                  </p>
                </div>
                
                <div>
                  <h4 className="font-bold text-slate-200">二、诸葛孔明 AI 说明：</h4>
                  <p className="text-slate-400 text-[11px] mt-1">
                    利用 Gemini AI 模拟智绝天下的军神武安侯诸葛孔明。在大军师的营帐中，诸葛先生能全面检索所选在朝或在野武将当前执导的剧本环境，给出惊艳而极其合理的锦囊妙计。
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-200">三、沙盘攻伐：</h4>
                  <p className="text-slate-400 text-[11px] mt-1">
                    玩家可以于【沙盘天盘地图】挑选并更改城池治理势力，指派统帅统领 8 万王牌兵马攻坚跨郡远征。如果目的地属于中立，则大军可瞬间征辟收容建立防备；如果是敌对势力，则领军将军的 <strong>统帅(LDR)与武力(FOR)</strong> 将会严重判定是否成功登城斩首捷报。
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-200">四、同人创作者申明：</h4>
                  <p className="text-[#64748b] text-[10px] mt-1">
                    本辅助器数据与插图样式均来源于公共纸面读物及三国历史流传演义，并不附带任何官方受保护的声音包、音频、美术立绘原资产。版权归属KOEI TECMO对应开发商所有，纯自制粉丝同人艺术产品。
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  id="btn-close-credits"
                  onClick={() => setShowCredits(false)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold text-xs py-2 px-6 rounded-xl active:scale-95 transition-all"
                >
                  回大帐军府
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start Page Footer Information Line */}
      <footer className="px-10 py-6 text-center text-[10px] text-slate-600 font-mono border-t border-slate-950 bg-slate-950/40">
        <p>Romance of the Three Kingdoms 8 Interactive Cabin — Under License of GNU Community Fan Contribution</p>
        <p className="mt-0.5">本应用完全运行于本地沙箱隔离网络中，采用 React 18 与 Tailwind CSS 内置组件，点击各选项立刻进入割据行军模拟。</p>
      </footer>

    </div>
  );
}
