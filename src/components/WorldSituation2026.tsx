import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, Cpu, Flame, Globe, Landmark, Scale, Shield, Ship, TrendingUp, Zap } from 'lucide-react';
import { Faction } from '../types';
import {
  activeEvents,
  EVENTS_2026,
  KEY_AXES_2026,
  pairKey,
  WorldEvent,
  WorldState,
  worldTradePolicy,
} from '../utils/geopolitics';
import Button from './Button';

interface WorldSituation2026Props {
  worldState: WorldState;
  factions: Faction[];
  currentTick: number;
  timestampLabel: string;
  onRespondEvent: (eventId: string, choiceIndex: number) => void;
}

const MAJOR_2026_FACTION_IDS = ['america', 'europe', 'france', 'germany', 'netherlands', 'russia'];

const CATEGORY_META: Record<NonNullable<WorldEvent['category']>, { label: string; badgeClass: string }> = {
  trade: { label: '经贸关税', badgeClass: 'is-trade' },
  tech: { label: '科技算力', badgeClass: 'is-tech' },
  energy: { label: '能源航运', badgeClass: 'is-energy' },
  logistics: { label: '港务基建', badgeClass: 'is-logistics' },
  climate: { label: '气候粮安', badgeClass: 'is-climate' },
  security: { label: '防务安全', badgeClass: 'is-security' },
  finance: { label: '金融债务', badgeClass: 'is-finance' },
  diplomacy: { label: '多边外交', badgeClass: 'is-diplomacy' },
};

function renderCategoryIcon(category?: WorldEvent['category']) {
  switch (category) {
    case 'tech':
      return <Cpu size={13} />;
    case 'energy':
      return <Zap size={13} />;
    case 'logistics':
      return <Ship size={13} />;
    case 'climate':
      return <Flame size={13} />;
    case 'security':
      return <Shield size={13} />;
    case 'finance':
      return <Landmark size={13} />;
    case 'diplomacy':
      return <Scale size={13} />;
    default:
      return <TrendingUp size={13} />;
  }
}

function stabilityStatus(value: number) {
  if (value >= 70) return { label: '稳健', className: 'is-stable' };
  if (value >= 55) return { label: '承压', className: 'is-strained' };
  return { label: '动荡', className: 'is-turbulent' };
}

function relationStatus(score: number) {
  if (score >= 25) return { label: '协同盟友', className: 'is-allied' };
  if (score >= -15) return { label: '竞合观望', className: 'is-neutral' };
  return { label: '高度紧张', className: 'is-tense' };
}

export default function WorldSituation2026({
  worldState,
  factions,
  currentTick,
  timestampLabel,
  onRespondEvent,
}: WorldSituation2026Props) {
  const majorFactions = MAJOR_2026_FACTION_IDS.map(id => factions.find(f => f.id === id)).filter(
    (f): f is Faction => Boolean(f)
  );
  const currentActiveEvents = activeEvents(worldState, currentTick);
  const pendingEvents = EVENTS_2026.filter(
    e => worldState.occurred.includes(e.id) && !(e.id in worldState.responses)
  );

  return (
    <section className="world2026-panel" aria-label="全球局势">
      <header className="trade-heading">
        <div>
          <h2>
            <Globe size={22} /> 2026 多极世界局势沙盘
          </h2>
          <span className="trade-muted">当前时令：{timestampLabel}</span>
        </div>
        <div className="diplomacy-header-meta">
          <span className="diplomacy-summary-pill">
            已触发事件 <strong>{worldState.occurred.length}</strong> / {EVENTS_2026.length}
          </span>
          <span className="diplomacy-summary-pill">
            待决策危机 <strong className={pendingEvents.length > 0 ? 'trade-accent' : ''}>{pendingEvents.length}</strong>
          </span>
          <span className="diplomacy-summary-pill">
            当前生效冲击 <strong>{currentActiveEvents.length}</strong>
          </span>
        </div>
      </header>

      {/* Major Powers Stability Grid */}
      <div className="world2026-section">
        <div className="world2026-section-head">
          <h3>
            <Shield size={16} /> 主要大国政经稳定度
          </h3>
          <span className="trade-muted">稳定度低于 70 将逐步推高双边跨境贸易运费溢价</span>
        </div>
        <div className="world2026-stability-grid">
          {majorFactions.map(faction => {
            const stability = worldState.stability[faction.id] ?? 70;
            const status = stabilityStatus(stability);
            return (
              <div key={faction.id} className="world2026-stability-card">
                <div className="world2026-card-top">
                  <span className="diplomacy-faction-name">
                    <span className="diplomacy-color-dot" style={{ backgroundColor: faction.color }} />
                    <strong>{faction.name}</strong>
                    <span className="trade-muted">· {faction.ruler}</span>
                  </span>
                  <span className={`world2026-pill ${status.className}`}>{status.label}</span>
                </div>
                <div className="diplomacy-meter-row">
                  <div className="diplomacy-meter-track" aria-label={`${faction.name}稳定度`}>
                    <span
                      className="diplomacy-meter-fill"
                      style={{
                        width: `${Math.max(4, Math.min(100, stability))}%`,
                        backgroundColor: faction.color,
                      }}
                    />
                  </div>
                  <span className="diplomacy-score-num">{stability}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Bilateral Axes */}
      <div className="world2026-section">
        <div className="world2026-section-head">
          <h3>
            <Scale size={16} /> 2026 核心双边关系轴心与通商政策
          </h3>
          <span className="trade-muted">实时联动「全球贸易」运费倍率与双边制裁禁运</span>
        </div>
        <div className="world2026-axes-grid">
          {KEY_AXES_2026.map(axis => {
            const score = worldState.relations[pairKey(axis.a, axis.b)] ?? 0;
            const standing = relationStatus(score);
            const policy = worldTradePolicy(worldState, axis.a, axis.b, currentTick);
            return (
              <div key={`${axis.a}-${axis.b}`} className="world2026-axis-card">
                <div className="world2026-card-top">
                  <strong>{axis.label}</strong>
                  <span className={`world2026-pill ${standing.className}`}>
                    {standing.label} ({score > 0 ? `+${score}` : score})
                  </span>
                </div>
                <div className="world2026-axis-meta">
                  <span>贸易运费倍率：×{policy.multiplier.toFixed(2)}</span>
                  {policy.blocked ? (
                    <span className="world2026-embargo-tag">⛔ 制裁禁运中</span>
                  ) : (
                    <span className="trade-muted">最低双边稳定 {policy.stability}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2026 Geopolitical Events & Policy Choices */}
      <div className="world2026-section">
        <div className="world2026-section-head">
          <h3>
            <AlertTriangle size={16} /> 2026 地缘危机推演与外交抉择
          </h3>
          <span className="trade-muted">随顶部历史时钟推进逐月触发，每次响应将永久改写大国稳定与关系</span>
        </div>

        <div className="world2026-events-grid">
          {EVENTS_2026.map(event => {
            const hasOccurred = worldState.occurred.includes(event.id);
            const chosenIndex = worldState.responses[event.id];
            const hasResponded = chosenIndex !== undefined;
            const isActiveNow = currentActiveEvents.some(e => e.id === event.id);
            const category = CATEGORY_META[event.category ?? 'trade'];

            return (
              <article
                key={event.id}
                className={`world2026-event-card ${hasOccurred && !hasResponded ? 'is-pending' : ''} ${
                  !hasOccurred ? 'is-upcoming' : ''
                }`}
              >
                <div className="disaster-card-head">
                  <span className={`world2026-category ${category.badgeClass}`}>
                    {renderCategoryIcon(event.category)} {category.label}
                  </span>
                  <span className="trade-muted">
                    <Clock size={12} className="inline align-[-2px] mr-1" />
                    2026年 {event.month}月 ·{' '}
                    {!hasOccurred ? '待触发' : isActiveNow ? '生效中' : '历史节点'}
                  </span>
                </div>

                <h4>{event.title}</h4>
                <p className="disaster-desc">{event.description}</p>

                {event.trade && (
                  <div className="disaster-impact-meta">
                    <span>
                      贸易影响：
                      {event.trade.embargo
                        ? '双边贸易禁运阻断'
                        : `运费倍率 ×${event.trade.multiplier.toFixed(2)}`}
                    </span>
                    <span>
                      {event.trade.pair
                        ? `特定双边 (${event.trade.pair.join(' ↔ ')})`
                        : event.trade.factions
                        ? `波及 ${event.trade.factions.length} 方`
                        : '全球航运联动'}
                    </span>
                  </div>
                )}

                {!hasOccurred ? (
                  <p className="trade-muted">推进游戏时间至 2026年 {event.month}月 上旬即可触发此事件。</p>
                ) : hasResponded ? (
                  <div className="disaster-resolved-box">
                    <CheckCircle2 size={14} />
                    <span>
                      已执行：{event.choices[chosenIndex]?.label}（{event.choices[chosenIndex]?.summary}）
                    </span>
                  </div>
                ) : (
                  <div className="disaster-choices">
                    {event.choices.map((choice, idx) => (
                      <div key={choice.label} className="disaster-choice-item">
                        <div className="disaster-choice-text">
                          <strong>{choice.label}</strong>
                          <span className="trade-muted">{choice.summary}</span>
                        </div>
                        <Button
                          id={`btn-world2026-${event.id}-${idx}`}
                          onClick={() => onRespondEvent(event.id, idx)}
                        >
                          采纳方案
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
