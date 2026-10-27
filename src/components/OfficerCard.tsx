import React, { useState, useEffect } from 'react';
import { Officer, Faction } from '../types';
import AvatarRenderer from './AvatarRenderer';
import { FACTIONS } from '../data';
import { Shield, Swords, Brain, Scroll, Sparkles, User, Sword, Compass, BookOpen, Trash2, Award, Crown } from 'lucide-react';

// Helper to calculate official rank/promotion details based on peak metrics
export function getPromotionInfo(stats: Officer['stats'], level: number = 0, isGlobalLeader: boolean = false) {
  const statMap = [
    { name: '统帅', val: stats.leadership, type: 'leader' },
    { name: '武力', val: stats.force, type: 'force' },
    { name: '智力', val: stats.intelligence, type: 'intel' },
    { name: '政治', val: stats.politics, type: 'politics' },
    { name: '魅力', val: stats.charisma, type: 'charisma' }
  ];
  statMap.sort((a, b) => b.val - a.val);
  const primaryAttribute = statMap[0]; // Highest stat

  // Max support level limit based on high stat
  let maxLevel = 1;
  if (primaryAttribute.val >= 90) maxLevel = 5;
  else if (primaryAttribute.val >= 80) maxLevel = 4;
  else if (primaryAttribute.val >= 70) maxLevel = 3;
  else if (primaryAttribute.val >= 50) maxLevel = 2;

  let title = isGlobalLeader ? '海外豪杰 / 部族首领' : '白丁乡勇';
  let badgeColor = 'bg-slate-950/40 text-slate-400 border-slate-800';
  let starColor = 'text-slate-600';

  if (level === 1) {
    starColor = 'text-emerald-500';
    badgeColor = 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50';
    if (isGlobalLeader) {
      title = primaryAttribute.type === 'force' || primaryAttribute.type === 'leader' ? '军团百夫长' : '行省主簿';
    } else {
      if (primaryAttribute.type === 'force' || primaryAttribute.type === 'leader') {
        title = '牙门小校';
      } else if (primaryAttribute.type === 'intel' || primaryAttribute.type === 'politics') {
        title = '郡府局佐';
      } else {
        title = '州府从事';
      }
    }
  } else if (level === 2) {
    starColor = 'text-blue-500';
    badgeColor = 'bg-blue-950/40 text-blue-400 border-blue-900/50';
    if (isGlobalLeader) {
      title = primaryAttribute.type === 'force' || primaryAttribute.type === 'leader' ? '近卫大统领' : '帝国财务官';
    } else {
      if (primaryAttribute.type === 'force' || primaryAttribute.type === 'leader') {
        title = '偏将军';
      } else if (primaryAttribute.type === 'intel' || primaryAttribute.type === 'politics') {
        title = '行军参军';
      } else {
        title = '持节都尉';
      }
    }
  } else if (level === 3) {
    starColor = 'text-purple-500';
    badgeColor = 'bg-purple-950/40 text-purple-400 border-purple-900/60';
    if (isGlobalLeader) {
      title = primaryAttribute.type === 'force' || primaryAttribute.type === 'leader' ? '行省统御总督' : '元老院大法官';
    } else {
      if (primaryAttribute.type === 'force' || primaryAttribute.type === 'leader') {
        title = '讨逆中郎将';
      } else if (primaryAttribute.type === 'intel' || primaryAttribute.type === 'politics') {
        title = '军师祭酒';
      } else {
        title = '郡守太守';
      }
    }
  } else if (level === 4) {
    starColor = 'text-amber-500';
    badgeColor = 'bg-amber-950/40 text-amber-400 border-amber-900/60';
    if (isGlobalLeader) {
      title = primaryAttribute.type === 'force' || primaryAttribute.type === 'leader' ? '帝国大元帅' : '元老院首席执政官';
    } else {
      if (primaryAttribute.type === 'force' || primaryAttribute.type === 'leader') {
        title = '偏征/卫将军';
      } else if (primaryAttribute.type === 'intel' || primaryAttribute.type === 'politics') {
        title = '尚书侍郎';
      } else {
        title = '刺史都尉';
      }
    }
  } else if (level >= 5) {
    starColor = 'text-rose-500 animate-pulse';
    badgeColor = 'bg-rose-950/50 text-rose-400 border-rose-900/70 shadow-lg';
    if (isGlobalLeader) {
      title = primaryAttribute.type === 'force' ? '无双战神·万夫莫敌' : primaryAttribute.type === 'leader' ? '开国统帅·传世大帝' : primaryAttribute.type === 'politics' ? '奥古斯都·万王之王' : '普天转轮圣王';
    } else {
      if (primaryAttribute.type === 'force') {
        title = '骠骑大将军 / 关内侯';
      } else if (primaryAttribute.type === 'leader') {
        title = '天下大都督';
      } else if (primaryAttribute.type === 'intel') {
        title = '军师中郎将 / 卧龙军师';
      } else if (primaryAttribute.type === 'politics') {
        title = '当朝丞相 / 尚书令';
      } else {
        title = '武乡侯 / 益州牧';
      }
    }
  }

  return {
    title,
    level,
    maxLevel,
    badgeColor,
    starColor,
    primaryAttributeName: primaryAttribute.name,
    primaryAttributeValue: primaryAttribute.val
  };
}

interface OfficerCardProps {
  key?: React.Key;
  officer: Officer;
  onEdit?: (officer: Officer) => void;
  onDelete?: (id: string) => void;
  onSelectForStrategy?: (officer: Officer) => void;
  isSelectableForStrategy?: boolean;
  onGenerateBio?: (officer: Officer) => Promise<string>;
}

export default function OfficerCard({
  officer,
  onEdit,
  onDelete,
  onSelectForStrategy,
  isSelectableForStrategy = true,
  onGenerateBio
}: OfficerCardProps) {
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [localBio, setLocalBio] = useState(officer.biography);
  const [promoSuccessMessage, setPromoSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setLocalBio(officer.biography);
  }, [officer.biography]);
  
  const promoInfo = getPromotionInfo(officer.stats, officer.promotionLevel || 0, officer.isGlobalLeader);

  const handlePromote = () => {
    const currentLvl = officer.promotionLevel || 0;
    const nextLvl = currentLvl + 1;
    const nextInfo = getPromotionInfo(officer.stats, nextLvl, officer.isGlobalLeader);

    if (currentLvl >= nextInfo.maxLevel) {
      alert(`晋升失败：${officer.name} 当前能力的晋升上限为 ${nextInfo.maxLevel} 阶。\n其封爵受限于其最高武将五维属性「${nextInfo.primaryAttributeName}」（数值 ${nextInfo.primaryAttributeValue}）。\n如欲晋升极位大都督、元老院首席执政官或普天转轮圣王，其某项功绩属性需要通过沙场历练突破对应值（70/80/90+）！`);
      return;
    }

    const updatedOfficer: Officer = {
      ...officer,
      promotionLevel: nextLvl,
      promotionTitle: nextInfo.title
    };

    if (onEdit) {
      onEdit(updatedOfficer);
    }

    setPromoSuccessMessage(`✨ 敕封诏书下达：${officer.name} 功勋卓著，晋升为【${nextInfo.title}】！`);
    setTimeout(() => {
      setPromoSuccessMessage(null);
    }, 5000);
  };

  const matchedFaction = FACTIONS.find(f => f.id === officer.factionId) || FACTIONS[FACTIONS.length - 1];

  // Helper to retrieve rating letters like ROTK of old
  const getRating = (val: number): { letter: string; color: string } => {
    if (val >= 95) return { letter: 'S', color: 'text-amber-400 font-bold border-amber-400 bg-amber-950/40' };
    if (val >= 85) return { letter: 'A', color: 'text-red-400 font-bold border-red-500/50 bg-red-950/20' };
    if (val >= 75) return { letter: 'B', color: 'text-blue-400 font-medium border-blue-500/30' };
    if (val >= 60) return { letter: 'C', color: 'text-emerald-400 border-emerald-500/20' };
    return { letter: 'D', color: 'text-slate-400 border-slate-500/10' };
  };

  const handleGenerateBioAI = async () => {
    if (!onGenerateBio) {
      alert('AI 史官正在连接军事天盘，请稍候。');
      return;
    }
    setIsGeneratingBio(true);
    try {
      const biography = await onGenerateBio(officer);
      setLocalBio(biography);
      if (onEdit) {
        onEdit({ ...officer, biography });
      }
    } catch (err: any) {
      console.warn('[OfficerCard] Generate bio notice:', err?.message || err);
      alert(err.message || '生成列传失败。请检查秘钥或重试。');
    } finally {
      setIsGeneratingBio(false);
    }
  };

  return (
    <div 
      id={`officer-card-${officer.id}`}
      className={`bg-slate-900/90 border rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 shadow-xl flex flex-col h-full ${
        officer.isGlobalLeader 
          ? 'border-amber-500/30 ring-1 ring-amber-500/20 shadow-amber-950/20' 
          : 'border-slate-800'
      }`}
    >
      {/* Card Header Background Block */}
      <div className={`h-2.5 w-full flex items-center justify-end px-3`} style={{ backgroundColor: matchedFaction.color }}>
        {officer.isGlobalLeader && (
          <span className="text-[9px] font-mono font-bold text-white/90 drop-shadow uppercase tracking-widest">
            WORLD LEADER
          </span>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Officer Hero Segment */}
        <div className="flex gap-4 items-start pb-5 border-b border-slate-800/60">
          <AvatarRenderer style={officer.avatarStyle} size={100} />
          <div className="flex-1">
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="text-xl font-serif text-slate-100 flex items-center gap-1.5 flex-wrap">
                  {officer.name}
                  {officer.styleName && (
                    <span className="text-xs font-sans tracking-wide text-slate-400 font-normal">
                      （{officer.isGlobalLeader ? '号' : '字'} {officer.styleName}）
                    </span>
                  )}
                </h3>
                {officer.englishName && (
                  <p className="text-xs font-mono text-amber-300/80 font-medium tracking-wide mt-0.5">
                    {officer.englishName}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-slate-400 font-mono">{officer.gender === 'Female' ? '女' : '男'}</span>
                  {officer.origin && (
                    <span className="text-[10px] text-slate-400 font-mono bg-slate-950/60 px-1.5 py-0.5 rounded border border-slate-800/60">
                      {officer.origin}
                    </span>
                  )}
                </div>
              </div>

              {officer.custom && onDelete && (
                <button
                  id={`btn-delete-${officer.id}`}
                  onClick={() => onDelete(officer.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition-colors"
                  title="删除此原创武将"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {/* Faction and Global Badges */}
            <div className="mt-3 flex items-center flex-wrap gap-2 justify-between">
              <span 
                className="px-2.5 py-1 rounded-full text-xs font-medium text-white shadow-sm inline-flex items-center gap-1.5"
                style={{ backgroundColor: `${matchedFaction.color}33`, border: `1px solid ${matchedFaction.color}88` }}
              >
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: matchedFaction.color }}></span>
                {matchedFaction.name}
              </span>

              <div className="flex items-center gap-1.5">
                {officer.isGlobalLeader && (
                  <span className="bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-400/40 text-amber-300 text-[10px] tracking-wider px-2 py-0.5 rounded-md font-mono font-bold flex items-center gap-1 shadow-sm">
                    <span>🌍</span> 全球领袖
                  </span>
                )}

                {officer.custom && (
                  <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] tracking-wider px-2 py-0.5 rounded font-mono">
                    原创
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ROTK Classic Stats Panel */}
        <div className="mt-5 space-y-3">
          <h4 className="text-xs font-mono tracking-widest text-slate-400 uppercase">属性五维</h4>
          <div className="grid grid-cols-1 gap-2.5">
            {[
              { label: '统帅', key: 'leadership', icon: Shield, color: 'from-emerald-500 to-teal-400', val: officer.stats.leadership },
              { label: '武力', key: 'force', icon: Swords, color: 'from-rose-500 to-red-400', val: officer.stats.force },
              { label: '智力', key: 'intelligence', icon: Brain, color: 'from-blue-500 to-sky-400', val: officer.stats.intelligence },
              { label: '政治', key: 'politics', icon: Scroll, color: 'from-amber-600 to-yellow-500', val: officer.stats.politics },
              { label: '魅力', key: 'charisma', icon: Sparkles, color: 'from-purple-500 to-pink-500', val: officer.stats.charisma }
            ].map(stat => {
              const rating = getRating(stat.val);
              return (
                <div key={stat.key} className="bg-slate-950/50 rounded-lg p-2 border border-slate-800/40 flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-2 w-28">
                    <stat.icon size={14} className="text-slate-500" />
                    <span className="text-slate-300 text-xs font-mono">{stat.label}</span>
                  </div>

                  <div className="flex-1">
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${stat.color} transition-all duration-500`} 
                        style={{ width: `${stat.val}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-14 justify-end">
                    <span className="font-mono text-slate-200 font-bold">{stat.val}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${rating.color} font-mono w-5 h-5 flex items-center justify-center`}>
                      {rating.letter}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Traits & Skills */}
        <div className="mt-5 pt-4 border-t border-slate-800/40 space-y-3">
          {officer.traits.length > 0 && (
            <div>
              <span className="text-xs font-mono text-slate-400 block mb-1">个性特质</span>
              <div className="flex flex-wrap gap-1.5">
                {officer.traits.map((t, idx) => (
                  <span key={idx} className="text-[11px] bg-slate-950 px-2 py-0.5 rounded text-slate-300 border border-slate-800">
                    {t.split('(')[0].trim().split('（')[0].trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {officer.skills.length > 0 && (
            <div>
              <span className="text-xs font-mono text-slate-400 block mb-1">战术技能</span>
              <div className="flex flex-wrap gap-1.5">
                {officer.skills.map((s, idx) => (
                  <span key={idx} className="text-[11px] bg-blue-950/30 px-2 py-0.5 rounded text-sky-300 border border-sky-950/60 inline-flex items-center gap-1">
                    <Sword size={10} className="text-sky-400 inline" />
                    {s.split('(')[0].trim().split('（')[0].trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Promotion System Info & Trigger Button */}
        <div className="mt-5 pt-4 border-t border-slate-800/40 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Award size={12} className="text-amber-500 animate-pulse" /> 功勋爵位晋升
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              封号上限: {promoInfo.maxLevel}阶 (依其最高五维)
            </span>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-900 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">当前职位头衔</span>
                <span className="text-xs font-serif font-bold text-slate-200">
                  {officer.promotionTitle || '白丁乡勇 / 在野草民'}
                </span>
              </div>
              <div className="flex items-center gap-0.5 bg-slate-900/60 py-1 px-1.5 rounded-lg border border-slate-800/40">
                {[1, 2, 3, 4, 5].map((s) => {
                  const isActive = (officer.promotionLevel || 0) >= s;
                  return (
                    <Award
                      key={s}
                      size={12}
                      className={isActive ? promoInfo.starColor : 'text-slate-850'}
                    />
                  );
                })}
              </div>
            </div>

            {promoSuccessMessage && (
              <div className="text-[11px] text-amber-400 bg-amber-950/40 border border-amber-900/40 py-2 px-3 rounded-lg text-center font-serif leading-relaxed animate-pulse">
                {promoSuccessMessage}
              </div>
            )}

            <button
              id={`btn-promote-${officer.id}`}
              onClick={handlePromote}
              className={`w-full py-2 px-3 rounded-lg border transition-all duration-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                (officer.promotionLevel || 0) >= promoInfo.maxLevel
                  ? 'bg-slate-950 text-slate-600 border-slate-900/40 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 active:scale-[0.98] text-slate-950 border-amber-500 hover:border-amber-400 font-semibold shadow-md shadow-amber-950/20'
              }`}
              disabled={(officer.promotionLevel || 0) >= promoInfo.maxLevel}
            >
              <Crown size={12} />
              {(officer.promotionLevel || 0) >= promoInfo.maxLevel ? '功勋至极 封无可封' : '上表朝廷 功勋晋升'}
            </button>
          </div>
        </div>

        {/* Biography Block */}
        <div className="mt-5 pt-4 border-t border-slate-800/40 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <BookOpen size={12} /> 武将列传
              </span>
              <button
                id={`btn-bio-ai-${officer.id}`}
                onClick={handleGenerateBioAI}
                disabled={isGeneratingBio}
                className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 disabled:opacity-50 transition-colors bg-amber-950/20 hover:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-900/30"
              >
                <Sparkles size={10} className={isGeneratingBio ? "animate-spin" : ""} />
                {isGeneratingBio ? '史官编篡中...' : 'AI 撰写列传'}
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/35 p-3 rounded-lg border border-slate-900 line-clamp-4 hover:line-clamp-none transition-all duration-200">
              {localBio || "尚未为此武将编篡列传。点击上方 [AI 撰写列传] 由史官为您书写生平！"}
            </p>
          </div>

          {/* Load Strategy Center Dynamic Button */}
          {isSelectableForStrategy && onSelectForStrategy && (
            <button
              id={`btn-strategy-brief-${officer.id}`}
              onClick={() => onSelectForStrategy(officer)}
              className="mt-4 w-full bg-slate-800 hover:bg-slate-700 active:bg-slate-700/80 text-xs font-semibold py-2 px-3 rounded-xl border border-slate-700 hover:border-slate-500 transition-all text-slate-200 inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Compass size={13} className="text-amber-400" />
              提供军事对策分析
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
