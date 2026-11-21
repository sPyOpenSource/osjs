import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Coins,
  Flame,
  History,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import {
  DISASTER_CATEGORY_META,
  DisasterCategory,
  DisasterState,
  getActiveDisasterRecords,
  HISTORICAL_DISASTERS,
  HistoricalDisasterEvent,
} from '../utils/disasters';
import Button from './Button';

interface HistoricalDisastersPanelProps {
  disasterState: DisasterState;
  currentTick: number;
  scenarioYear: number;
  gold: number;
  timestampLabel: string;
  onTriggerDisaster: (event: HistoricalDisasterEvent) => void;
  onRespondDisaster: (eventId: string, choiceId: string) => string | undefined;
}

export default function HistoricalDisastersPanel({
  disasterState,
  currentTick,
  scenarioYear,
  gold,
  timestampLabel,
  onTriggerDisaster,
  onRespondDisaster,
}: HistoricalDisastersPanelProps) {
  const [categoryFilter, setCategoryFilter] = useState<DisasterCategory | 'all'>('all');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const activeRecords = useMemo(
    () => getActiveDisasterRecords(disasterState, currentTick),
    [disasterState, currentTick]
  );

  const occurredMap = useMemo(
    () => new Map(disasterState.occurred.map(r => [r.eventId, r])),
    [disasterState.occurred]
  );

  const filteredCatalog = useMemo(() => {
    return HISTORICAL_DISASTERS.filter(e =>
      categoryFilter === 'all' ? true : e.category === categoryFilter
    );
  }, [categoryFilter]);

  return (
    <section className="disaster-panel" aria-label="历史自然灾害与突发危机">
      <header className="trade-heading">
        <div>
          <h2>
            <AlertTriangle size={22} /> 天灾史变 · 历史灾害应急台
          </h2>
          <span className="trade-muted">
            {timestampLabel} · 当前剧本公元 {scenarioYear} 年（随时间推进自动触发，或手动演练历史重大灾疫）
          </span>
        </div>
        <strong className="trade-gold">
          <Coins size={18} /> <span>{gold.toLocaleString()}</span> 金
        </strong>
      </header>

      {errorMessage && (
        <p className="trade-error disaster-error" role="alert">
          {errorMessage}
        </p>
      )}

      {/* Active Disasters & Response Choices */}
      <div className="disaster-section">
        <div className="disaster-section-head">
          <h3>
            <ShieldAlert size={17} /> 当前持续灾情 ({activeRecords.length})
          </h3>
          <span className="trade-muted">及时拨款救灾可恢复城池民生并压低商路附加运费</span>
        </div>

        {activeRecords.length > 0 ? (
          <div className="disaster-active-grid">
            {activeRecords.map(({ record, event, remainingTicks }) => {
              const meta = DISASTER_CATEGORY_META[event.category];
              const currentMult =
                record.freightMultiplierOverride ?? event.tradeFreightMultiplier;

              return (
                <article
                  key={event.id}
                  className="disaster-card is-active"
                  data-testid={`active-disaster-${event.id}`}
                >
                  <div className="disaster-card-head">
                    <span className={`disaster-badge ${meta.badgeClass}`}>
                      {meta.icon} {meta.label}
                    </span>
                    <span className="trade-muted">剩余 {remainingTicks} 旬</span>
                  </div>

                  <h4>{event.title}</h4>
                  <p className="trade-muted">{event.historicalReference}</p>
                  <p className="disaster-desc">{event.description}</p>

                  <div className="disaster-impact-meta">
                    <span>波及城池：{record.affectedCityNames.join('、')}</span>
                    <span>当前商路运费倍率：{Math.round(currentMult * 100)}%</span>
                  </div>

                  {record.resolvedChoiceId ? (
                    <div className="disaster-resolved-box" role="status">
                      <CheckCircle2 size={15} />
                      <span>已执行处置：{record.resolvedChoiceLabel}</span>
                    </div>
                  ) : (
                    <div className="disaster-choices">
                      {event.choices.map(choice => (
                        <div key={choice.id} className="disaster-choice-item">
                          <div className="disaster-choice-text">
                            <strong>{choice.label}</strong>
                            <small className="trade-muted">{choice.summary}</small>
                          </div>
                          <Button
                            id={`btn-disaster-choice-${event.id}-${choice.id}`}
                            disabled={gold < choice.goldCost}
                            onClick={() => {
                              const err = onRespondDisaster(event.id, choice.id);
                              setErrorMessage(err || '');
                            }}
                          >
                            拨款 {choice.goldCost} 金
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="disaster-empty-box">
            <Sparkles size={16} />
            <span>四海暂告安澜，当前无持续中的重大天灾。您可在下方史料目录中演练 COVID-19、海啸或强震应对，或推进时间静候天时变化。</span>
          </div>
        )}
      </div>

      {/* Historical Disaster Catalog & Manual Trigger */}
      <div className="disaster-section">
        <div className="disaster-section-head">
          <h3>
            <Flame size={17} /> 历史重大灾害名录（含 流感 · 海啸 · 大地震）
          </h3>
          <div className="disaster-filter-pills" role="group" aria-label="灾害类型筛选">
            <Button
              aria-pressed={categoryFilter === 'all'}
              onClick={() => setCategoryFilter('all')}
            >
              全部 ({HISTORICAL_DISASTERS.length})
            </Button>
            {(['pandemic', 'tsunami', 'earthquake', 'flood', 'drought'] as DisasterCategory[]).map(
              cat => (
                <Button
                  key={cat}
                  aria-pressed={categoryFilter === cat}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {DISASTER_CATEGORY_META[cat].icon} {DISASTER_CATEGORY_META[cat].label}
                </Button>
              )
            )}
          </div>
        </div>

        <div className="disaster-catalog-grid">
          {filteredCatalog.map(event => {
            const meta = DISASTER_CATEGORY_META[event.category];
            const occurred = occurredMap.get(event.id);

            return (
              <div
                key={event.id}
                className="disaster-card"
                data-testid={`catalog-disaster-${event.id}`}
              >
                <div className="disaster-card-head">
                  <span className={`disaster-badge ${meta.badgeClass}`}>
                    {meta.icon} {meta.label}
                  </span>
                  <span className="trade-muted">
                    定时：{event.triggerMonth}月{['上', '中', '下'][event.triggerXun - 1]}旬 ·{' '}
                    {event.era === 'modern' ? '近现代' : event.era === 'ancient' ? '古代' : '全时代'}
                  </span>
                </div>

                <h4>{event.title}</h4>
                <p className="trade-muted">{event.historicalReference}</p>
                <p className="disaster-desc">{event.description}</p>

                <div className="disaster-catalog-footer">
                  <span className="trade-muted">
                    商路运费 {Math.round(event.tradeFreightMultiplier * 100)}% · 持续 {event.durationTicks} 旬
                  </span>
                  <Button
                    id={`btn-trigger-disaster-${event.id}`}
                    disabled={Boolean(occurred)}
                    onClick={() => {
                      setErrorMessage('');
                      onTriggerDisaster(event);
                    }}
                  >
                    {occurred ? '已发生' : '触发此史变'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chronicle Logs */}
      <div className="disaster-section">
        <h3 className="trade-history-heading disaster-history-heading">
          <History size={16} /> 天灾应急档案
        </h3>
        <div className="trade-history disaster-history" aria-live="polite">
          {disasterState.logs.length > 0 ? (
            disasterState.logs.map((log, idx) => <p key={`${idx}-${log}`}>{log}</p>)
          ) : (
            <p className="trade-muted">暂无历史灾害记录。</p>
          )}
        </div>
      </div>
    </section>
  );
}
