import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Coins,
  Navigation,
  Scroll,
  Shield,
  Sprout,
  Users,
} from 'lucide-react';
import { Faction, Officer } from '../types';
import {
  computeCityLivability,
  MIGRATION_CAUSE_META,
  MigrationCause,
  MigrationCityRef,
  MigrationCityStats,
  MigrationState,
  quoteResettlement,
  RESETTLEMENT_SCALES,
} from '../utils/migrations';
import Button from './Button';

interface PeopleMigrationsPanelProps {
  cities: MigrationCityRef[];
  factions: Faction[];
  officers: Officer[];
  cityOwnership: Record<string, string>;
  cityStats: Record<string, MigrationCityStats>;
  activeDisasterCityIds: Set<string>;
  migrationState: MigrationState;
  playerFactionId?: string;
  gold: number;
  timestampLabel: string;
  onExecuteResettlement: (
    fromCityId: string,
    toCityId: string,
    amount: number,
  ) => string | undefined;
  onFocusCity?: (cityName: string) => void;
}

function renderCauseIcon(cause: MigrationCause) {
  if (cause === 'disaster_exodus') return <AlertTriangle size={13} />;
  if (cause === 'refugee_flee') return <Shield size={13} />;
  if (cause === 'prosperity_pull') return <Sprout size={13} />;
  return <Scroll size={13} />;
}

export default function PeopleMigrationsPanel({
  cities,
  factions,
  officers,
  cityOwnership,
  cityStats,
  activeDisasterCityIds,
  migrationState,
  playerFactionId,
  gold,
  timestampLabel,
  onExecuteResettlement,
  onFocusCity,
}: PeopleMigrationsPanelProps) {
  const factionMap = useMemo(
    () => new Map(factions.map(f => [f.id, f])),
    [factions],
  );

  const defaultOriginId = useMemo(() => {
    const owned = cities.find(c => cityOwnership[c.id] === playerFactionId);
    return owned?.id ?? cities[0]?.id ?? '';
  }, [cities, cityOwnership, playerFactionId]);

  const defaultTargetId = useMemo(() => {
    const other = cities.find(c => c.id !== defaultOriginId);
    return other?.id ?? '';
  }, [cities, defaultOriginId]);

  const [originCityId, setOriginCityId] = useState<string>(defaultOriginId);
  const [targetCityId, setTargetCityId] = useState<string>(defaultTargetId);
  const [resettlementAmount, setResettlementAmount] = useState<number>(5000);
  const [causeFilter, setCauseFilter] = useState<MigrationCause | 'all'>('all');
  const [formError, setFormError] = useState<string>('');
  const [formNotice, setFormNotice] = useState<string>('');

  const resolvedOriginId = cities.some(c => c.id === originCityId)
    ? originCityId
    : defaultOriginId;
  const resolvedTargetId =
    cities.some(c => c.id === targetCityId) && targetCityId !== resolvedOriginId
      ? targetCityId
      : cities.find(c => c.id !== resolvedOriginId)?.id ?? '';

  const cityRows = useMemo(() => {
    return cities
      .map(city => {
        const stats = cityStats[city.id] ?? {
          prosperity: 65,
          defense: 70,
          grain: 1200,
          population: 80000,
        };
        const ownerId = cityOwnership[city.id] || 'ronin';
        const owner = factionMap.get(ownerId);
        const isAffected = activeDisasterCityIds.has(city.id);
        const livability = computeCityLivability({
          cityId: city.id,
          stats,
          isDisasterAffected: isAffected,
          ownerFactionId: ownerId,
          officers,
        });
        return {
          city,
          stats,
          ownerId,
          ownerName: owner?.name ?? ownerId,
          ownerColor: owner?.color ?? '#94a3b8',
          isAffected,
          livability,
        };
      })
      .sort((a, b) => b.stats.population - a.stats.population);
  }, [cities, cityStats, cityOwnership, factionMap, activeDisasterCityIds, officers]);

  const totalPopulation = useMemo(
    () => cityRows.reduce((sum, r) => sum + r.stats.population, 0),
    [cityRows],
  );

  const netFlowByCity = useMemo(() => {
    const net: Record<string, number> = {};
    for (const wave of migrationState.waves) {
      net[wave.fromCityId] = (net[wave.fromCityId] ?? 0) - wave.count;
      net[wave.toCityId] = (net[wave.toCityId] ?? 0) + wave.count;
    }
    return net;
  }, [migrationState.waves]);

  const topInflow = useMemo(() => {
    let best: { name: string; value: number } | null = null;
    for (const row of cityRows) {
      const val = netFlowByCity[row.city.id] ?? 0;
      if (val > 0 && (!best || val > best.value)) {
        best = { name: row.city.name, value: val };
      }
    }
    return best;
  }, [cityRows, netFlowByCity]);

  const topOutflow = useMemo(() => {
    let worst: { name: string; value: number } | null = null;
    for (const row of cityRows) {
      const val = netFlowByCity[row.city.id] ?? 0;
      if (val < 0 && (!worst || val < worst.value)) {
        worst = { name: row.city.name, value: val };
      }
    }
    return worst;
  }, [cityRows, netFlowByCity]);

  const liveQuote = useMemo(
    () =>
      quoteResettlement({
        fromCityId: resolvedOriginId,
        toCityId: resolvedTargetId,
        amount: resettlementAmount,
        cities,
        cityStats,
        cityOwnership,
        playerFactionId,
        gold,
      }),
    [
      resolvedOriginId,
      resolvedTargetId,
      resettlementAmount,
      cities,
      cityStats,
      cityOwnership,
      playerFactionId,
      gold,
    ],
  );

  const visibleWaves = useMemo(
    () =>
      migrationState.waves.filter(w =>
        causeFilter === 'all' ? true : w.cause === causeFilter,
      ),
    [migrationState.waves, causeFilter],
  );

  const originCityObj = cities.find(c => c.id === resolvedOriginId);
  const targetCityObj = cities.find(c => c.id === resolvedTargetId);
  const grainSourceName =
    cities.find(c => c.id === liveQuote.grainSourceCityId)?.name ?? '迁出城';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormNotice('');
    const err = onExecuteResettlement(
      resolvedOriginId,
      resolvedTargetId,
      resettlementAmount,
    );
    if (err) {
      setFormError(err);
      return;
    }
    setFormError('');
    setFormNotice(
      `已颁行徙民诏书：${originCityObj?.name ?? ''} → ${targetCityObj?.name ?? ''} 迁徙 ${resettlementAmount.toLocaleString()} 人。`,
    );
  };

  return (
    <section className="migration-panel" aria-label="人口迁徙与流民调度">
      <header className="trade-heading">
        <div>
          <h2>
            <Users size={22} /> 人口迁徙 · 欧亚流民格局
          </h2>
          <span className="trade-muted">
            {timestampLabel} · 灾荒、战火与兴盛皆会引发流民迁徙，亦可由朝廷敕令屯田实边
          </span>
        </div>
        <strong className="trade-gold">
          <Coins size={18} /> <span>{gold.toLocaleString()}</span> 金
        </strong>
      </header>

      {/* Summary metrics strip — clean hairline cells, zero pills */}
      <div className="migration-summary-strip">
        <div className="migration-metric">
          <span className="migration-metric-label">全图在籍民户</span>
          <strong className="migration-metric-value">
            {totalPopulation.toLocaleString()} 人
          </strong>
        </div>
        <div className="migration-metric">
          <span className="migration-metric-label">累计迁徙人口</span>
          <strong className="migration-metric-value">
            {migrationState.totalMigrated.toLocaleString()} 人 ·{' '}
            {migrationState.waves.length} 潮
          </strong>
        </div>
        <div className="migration-metric">
          <span className="migration-metric-label">聚民乐土</span>
          <strong className="migration-metric-value">
            {topInflow
              ? `${topInflow.name} (+${topInflow.value.toLocaleString()})`
              : '暂未录得净迁入'}
          </strong>
        </div>
        <div className="migration-metric">
          <span className="migration-metric-label">流民策源</span>
          <strong className="migration-metric-value">
            {topOutflow
              ? `${topOutflow.name} (${topOutflow.value.toLocaleString()})`
              : '各地民生安堵'}
          </strong>
        </div>
      </div>

      <div className="migration-layout">
        {/* Left column: Resettlement Decree Form */}
        <form
          className="migration-decree-form"
          onSubmit={handleSubmit}
          aria-label="敕令徙民调度台"
        >
          <div className="diplomacy-section-title">
            <Scroll size={17} />
            <h3>敕令徙民 · 实边政令台</h3>
          </div>

          <label>
            迁出郡城
            <select
              id="select-migration-origin"
              value={resolvedOriginId}
              onChange={e => {
                setOriginCityId(e.target.value);
                setFormError('');
                setFormNotice('');
              }}
            >
              {cityRows.map(row => (
                <option key={row.city.id} value={row.city.id}>
                  {row.city.name} ({row.ownerName}) ·{' '}
                  {row.stats.population.toLocaleString()} 人
                </option>
              ))}
            </select>
          </label>

          <label>
            迁入郡城
            <select
              id="select-migration-target"
              value={resolvedTargetId}
              onChange={e => {
                setTargetCityId(e.target.value);
                setFormError('');
                setFormNotice('');
              }}
            >
              {cityRows
                .filter(row => row.city.id !== resolvedOriginId)
                .map(row => (
                  <option key={row.city.id} value={row.city.id}>
                    {row.city.name} ({row.ownerName}) · 宜居 {row.livability}
                  </option>
                ))}
            </select>
          </label>

          <div className="migration-scale-field">
            <span className="migration-field-label">迁徙规模</span>
            <div className="migration-scale-buttons">
              {RESETTLEMENT_SCALES.map(scale => (
                <Button
                  key={scale}
                  id={`btn-migration-scale-${scale}`}
                  aria-pressed={resettlementAmount === scale}
                  onClick={() => {
                    setResettlementAmount(scale);
                    setFormError('');
                  }}
                >
                  {scale.toLocaleString()} 人
                </Button>
              ))}
            </div>
          </div>

          <dl className="trade-quote diplomacy-quote">
            <div>
              <dt>路途距离</dt>
              <dd className="tabular-nums">{liveQuote.distance} 驿度</dd>
            </div>
            <div>
              <dt>安家经费</dt>
              <dd className="tabular-nums">
                {liveQuote.goldCost.toLocaleString()} 金
              </dd>
            </div>
            <div>
              <dt>途中口粮（由{grainSourceName}拨付）</dt>
              <dd className="tabular-nums">
                {liveQuote.grainCost.toLocaleString()} 石
              </dd>
            </div>
            <div className="trade-total">
              <dt>迁入城繁荣增益</dt>
              <dd className="tabular-nums">+{liveQuote.prosperityBonus}</dd>
            </div>
          </dl>

          {!liveQuote.ok && liveQuote.error && (
            <p className="trade-error" role="alert">
              {liveQuote.error}
            </p>
          )}
          {formError && (
            <p className="trade-error" role="alert">
              {formError}
            </p>
          )}
          {formNotice && (
            <p className="migration-notice" role="status">
              {formNotice}
            </p>
          )}

          <Button
            id="btn-execute-migration"
            type="submit"
            className="trade-confirm"
            disabled={!liveQuote.ok}
          >
            <Navigation size={15} />
            签发徙民诏书
          </Button>
        </form>

        {/* Right column: Recent Migration Waves + City Livability Ledger */}
        <div className="migration-right-col">
          <div className="migration-waves-card">
            <div className="diplomacy-ledger-head">
              <h3>
                <Navigation size={16} /> 近期迁徙流向 ({visibleWaves.length})
              </h3>
              <div className="migration-filter-row">
                <Button
                  aria-pressed={causeFilter === 'all'}
                  onClick={() => setCauseFilter('all')}
                >
                  全部
                </Button>
                {(Object.keys(MIGRATION_CAUSE_META) as MigrationCause[]).map(
                  cause => (
                    <Button
                      key={cause}
                      aria-pressed={causeFilter === cause}
                      onClick={() => setCauseFilter(cause)}
                    >
                      {MIGRATION_CAUSE_META[cause].shortLabel}
                    </Button>
                  ),
                )}
              </div>
            </div>

            {visibleWaves.length > 0 ? (
              <ul className="migration-wave-list">
                {visibleWaves.slice(0, 10).map(wave => {
                  const meta = MIGRATION_CAUSE_META[wave.cause];
                  return (
                    <li key={wave.id} className="migration-wave-item">
                      <div className="migration-wave-top">
                        <span
                          className="migration-cause-tag"
                          style={{
                            color: meta.color,
                            borderColor: `${meta.color}55`,
                          }}
                        >
                          {renderCauseIcon(wave.cause)}
                          {meta.label}
                        </span>
                        <span className="migration-wave-route">
                          <strong>{wave.fromCityName}</strong>
                          <ArrowRight size={13} />
                          <strong>{wave.toCityName}</strong>
                        </span>
                        <span className="migration-wave-count">
                          +{wave.count.toLocaleString()} 人
                        </span>
                      </div>
                      <p className="migration-wave-summary">
                        {wave.timestamp} · {wave.summary}
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="disaster-empty-box">
                <Users size={16} />
                <span>
                  当前尚无人口迁徙记录。推进旬月时序、爆发天灾/攻城或签发上方徙民诏书，即可观测欧亚流民迁徙轨迹。
                </span>
              </div>
            )}
          </div>

          <div className="migration-ledger-card">
            <div className="diplomacy-ledger-head">
              <h3>列城人口与宜居榜</h3>
              <span className="trade-muted">点击“设为迁出/迁入”可快速填入左侧诏书</span>
            </div>
            <div className="migration-table-scroll">
              <table className="migration-table">
                <thead>
                  <tr>
                    <th>郡城</th>
                    <th>归属</th>
                    <th>人口</th>
                    <th>粮草</th>
                    <th>宜居</th>
                    <th>净流向</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {cityRows.map(row => {
                    const net = netFlowByCity[row.city.id] ?? 0;
                    return (
                      <tr key={row.city.id}>
                        <td>
                          <button
                            type="button"
                            className="migration-city-link"
                            onClick={() => onFocusCity?.(row.city.name)}
                            title={`前往巡察${row.city.name}`}
                          >
                            {row.city.name}
                          </button>
                          {row.isAffected && (
                            <span className="migration-disaster-flag">
                              受灾
                            </span>
                          )}
                        </td>
                        <td style={{ color: row.ownerColor }}>{row.ownerName}</td>
                        <td className="tabular-nums">
                          {row.stats.population.toLocaleString()}
                        </td>
                        <td className="tabular-nums">
                          {row.stats.grain.toLocaleString()}
                        </td>
                        <td className="tabular-nums">{row.livability}</td>
                        <td
                          className={`tabular-nums ${
                            net > 0
                              ? 'is-inflow'
                              : net < 0
                                ? 'is-outflow'
                                : ''
                          }`}
                        >
                          {net > 0
                            ? `+${net.toLocaleString()}`
                            : net < 0
                              ? net.toLocaleString()
                              : '0'}
                        </td>
                        <td className="migration-row-actions">
                          <button
                            type="button"
                            className="migration-row-btn"
                            onClick={() => {
                              setOriginCityId(row.city.id);
                              setFormError('');
                            }}
                          >
                            迁出
                          </button>
                          <button
                            type="button"
                            className="migration-row-btn"
                            onClick={() => {
                              setTargetCityId(row.city.id);
                              setFormError('');
                            }}
                          >
                            迁入
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
