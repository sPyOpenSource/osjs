import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Coins,
  Gift,
  Globe,
  Handshake,
  ScrollText,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react';
import { Faction, Officer } from '../types';
import {
  DiplomacyState,
  DiplomaticLogEntry,
  DiplomaticMissionType,
  getDiplomaticStanding,
  getRelationScore,
  hasAlliance,
  hasTradePact,
  quoteEnvoyMission,
} from '../utils/diplomacy';
import DiplomacyRelationChart from './DiplomacyRelationChart';
import Button from './Button';

interface DiplomacyPanelProps {
  factions: Faction[];
  officers: Officer[];
  playerFactions: string[];
  playerFactionId?: string;
  diplomacyState: DiplomacyState;
  gold: number;
  timestampLabel: string;
  onExecuteMission: (input: {
    playerFaction: string;
    targetFaction: string;
    missionType: DiplomaticMissionType;
    envoy?: Officer | null;
    giftAmount?: number;
  }) => { ok: boolean; error?: string; entry?: DiplomaticLogEntry };
  onCancelPact: (input: {
    playerFaction: string;
    targetFaction: string;
    pactType: 'trade_pact' | 'alliance';
  }) => void;
}

const GIFT_TIERS = [200, 500, 800] as const;

const MISSION_META: Record<
  DiplomaticMissionType,
  { label: string; subtitle: string; icon: React.ComponentType<{ size?: number }> }
> = {
  gift: { label: '赠礼修好', subtitle: '奉上重金厚礼，必可缓和邦交、稳步提升好感', icon: Gift },
  trade_pact: { label: '通商条约', subtitle: '遣使缔结互市商约，全球贸易商路运费减免 25%', icon: ScrollText },
  alliance: { label: '缔结同盟', subtitle: '会盟立约结为攻守同盟，需要较高好感与雄辩使节', icon: Handshake },
};

export default function DiplomacyPanel({
  factions,
  officers,
  playerFactions,
  playerFactionId,
  diplomacyState,
  gold,
  timestampLabel,
  onExecuteMission,
  onCancelPact,
}: DiplomacyPanelProps) {
  const diplomaticFactions = useMemo(
    () => factions.filter(f => f.id !== 'ronin'),
    [factions]
  );

  const ownDiplomaticFactions = useMemo(() => {
    if (playerFactionId) {
      return diplomaticFactions.filter(f => f.id === playerFactionId);
    }
    return diplomaticFactions.filter(f => playerFactions.includes(f.id));
  }, [diplomaticFactions, playerFactionId, playerFactions]);

  const defaultPlayerFaction = useMemo(
    () => ownDiplomaticFactions[0]?.id || '',
    [ownDiplomaticFactions]
  );

  const [playerFaction, setPlayerFaction] = useState<string>(defaultPlayerFaction);

  useEffect(() => {
    if (!ownDiplomaticFactions.some(f => f.id === playerFaction)) {
      setPlayerFaction(defaultPlayerFaction);
    }
  }, [ownDiplomaticFactions, playerFaction, defaultPlayerFaction]);

  const targetOptions = useMemo(
    () => diplomaticFactions.filter(f => f.id !== playerFaction),
    [diplomaticFactions, playerFaction]
  );

  const [targetFaction, setTargetFaction] = useState<string>(() => targetOptions[0]?.id || '');

  useEffect(() => {
    if (!targetOptions.some(f => f.id === targetFaction)) {
      setTargetFaction(targetOptions[0]?.id || '');
    }
  }, [targetOptions, targetFaction]);

  const envoyCandidates = useMemo(() => {
    const own = officers.filter(o => o.factionId === playerFaction);
    const pool = own.length > 0 ? own : officers;
    return [...pool].sort(
      (a, b) =>
        b.stats.politics + b.stats.charisma - (a.stats.politics + a.stats.charisma)
    );
  }, [officers, playerFaction]);

  const [envoyId, setEnvoyId] = useState<string>(() => envoyCandidates[0]?.id || '');

  useEffect(() => {
    if (!envoyCandidates.some(o => o.id === envoyId)) {
      setEnvoyId(envoyCandidates[0]?.id || '');
    }
  }, [envoyCandidates, envoyId]);

  const [missionType, setMissionType] = useState<DiplomaticMissionType>('gift');
  const [giftAmount, setGiftAmount] = useState<number>(500);
  const [formError, setFormError] = useState<string>('');
  const [latestOutcome, setLatestOutcome] = useState<DiplomaticLogEntry | null>(null);

  const selectedEnvoy = useMemo(
    () => envoyCandidates.find(o => o.id === envoyId) || envoyCandidates[0] || null,
    [envoyCandidates, envoyId]
  );

  const quote = useMemo(
    () =>
      quoteEnvoyMission({
        state: diplomacyState,
        playerFaction,
        targetFaction,
        missionType,
        envoy: selectedEnvoy,
        gold,
        giftAmount,
      }),
    [diplomacyState, playerFaction, targetFaction, missionType, selectedEnvoy, gold, giftAmount]
  );

  const currentPlayerInfo = diplomaticFactions.find(f => f.id === playerFaction);
  const currentTargetInfo = targetOptions.find(f => f.id === targetFaction);
  const currentScore = getRelationScore(diplomacyState, playerFaction, targetFaction);
  const currentStanding = getDiplomaticStanding(diplomacyState, playerFaction, targetFaction);

  const activeAllianceCount = useMemo(
    () => targetOptions.filter(f => hasAlliance(diplomacyState, playerFaction, f.id)).length,
    [targetOptions, diplomacyState, playerFaction]
  );
  const activeTradeCount = useMemo(
    () => targetOptions.filter(f => hasTradePact(diplomacyState, playerFaction, f.id)).length,
    [targetOptions, diplomacyState, playerFaction]
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');
    const result = onExecuteMission({
      playerFaction,
      targetFaction,
      missionType,
      envoy: selectedEnvoy,
      giftAmount: missionType === 'gift' ? giftAmount : undefined,
    });
    if (!result.ok) {
      setFormError(result.error || '外交使团未能成行。');
      return;
    }
    if (result.entry) {
      setLatestOutcome(result.entry);
    }
  };

  return (
    <section className="diplomacy-panel" aria-label="外交使节面板">
      <header className="trade-heading">
        <div>
          <h2>
            <Handshake size={22} /> 外交国书 · 遣使邦交
          </h2>
          <span className="trade-muted">{timestampLabel}</span>
        </div>

        <div className="diplomacy-header-meta">
          <span className="diplomacy-summary-pill">
            <Shield size={14} /> 同盟 {activeAllianceCount}
          </span>
          <span className="diplomacy-summary-pill">
            <ScrollText size={14} /> 商约 {activeTradeCount}
          </span>
          <strong className="trade-gold">
            <Coins size={18} /> <span data-testid="diplomacy-gold">{gold.toLocaleString()}</span> 金
          </strong>
        </div>
      </header>

      <div className="diplomacy-layout">
        {/* Left pane: Envoy Mission Form */}
        <form className="diplomacy-mission-form" onSubmit={handleSubmit}>
          <div className="diplomacy-section-title">
            <Sparkles size={17} />
            <h3>使节派遣台</h3>
          </div>

          <label>
            <span>遣使势力（主权国）</span>
            <select
              id="diplomacy-player-faction"
              aria-label="遣使势力"
              value={playerFaction}
              onChange={e => {
                setPlayerFaction(e.target.value);
                setFormError('');
              }}
            >
              {ownDiplomaticFactions.length > 0 ? (
                ownDiplomaticFactions.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.crest} {f.name} · {f.ruler} [我方]
                  </option>
                ))
              ) : (
                <option value="">当前所属势力暂无外交主权</option>
              )}
            </select>
          </label>

          <label>
            <span>出使对象</span>
            <select
              id="diplomacy-target-faction"
              aria-label="出使对象"
              value={targetFaction}
              onChange={e => {
                setTargetFaction(e.target.value);
                setFormError('');
              }}
            >
              {targetOptions.map(f => {
                const score = getRelationScore(diplomacyState, playerFaction, f.id);
                return (
                  <option key={f.id} value={f.id}>
                    {f.crest} {f.name}（{f.ruler}）· 关系 {score > 0 ? `+${score}` : score}
                  </option>
                );
              })}
            </select>
          </label>

          <label>
            <span>任命使节（依据政治与魅力加权）</span>
            <select
              id="diplomacy-envoy-select"
              aria-label="任命使节"
              value={selectedEnvoy?.id || ''}
              onChange={e => {
                setEnvoyId(e.target.value);
                setFormError('');
              }}
            >
              {envoyCandidates.map(o => (
                <option key={o.id} value={o.id}>
                  {o.name} · 政 {o.stats.politics} / 魅 {o.stats.charisma}
                </option>
              ))}
            </select>
          </label>

          <div className="diplomacy-mission-types" role="group" aria-label="外交使命类型">
            {(['gift', 'trade_pact', 'alliance'] as DiplomaticMissionType[]).map(type => {
              const meta = MISSION_META[type];
              const Icon = meta.icon;
              return (
                <Button
                  key={type}
                  id={`btn-mission-${type}`}
                  aria-pressed={missionType === type}
                  onClick={() => {
                    setMissionType(type);
                    setFormError('');
                  }}
                >
                  <Icon size={15} />
                  <span>{meta.label}</span>
                </Button>
              );
            })}
          </div>

          <p className="trade-muted">{MISSION_META[missionType].subtitle}</p>

          {missionType === 'gift' && (
            <div className="diplomacy-gift-tiers" role="group" aria-label="赠礼金额档位">
              {GIFT_TIERS.map(tier => (
                <Button
                  key={tier}
                  id={`btn-gift-${tier}`}
                  aria-pressed={giftAmount === tier}
                  onClick={() => {
                    setGiftAmount(tier);
                    setFormError('');
                  }}
                >
                  {tier} 金
                </Button>
              ))}
            </div>
          )}

          <dl className="trade-quote diplomacy-quote">
            <div>
              <dt>当前邦交 ({currentTargetInfo?.name || '目标'})</dt>
              <dd data-testid="diplomacy-current-score">
                {currentScore > 0 ? `+${currentScore}` : currentScore} · {currentStanding.label}
              </dd>
            </div>
            <div>
              <dt>使节加成</dt>
              <dd>{quote.envoyBonus >= 0 ? `+${quote.envoyBonus}%` : `${quote.envoyBonus}%`}</dd>
            </div>
            <div>
              <dt>预估成功率</dt>
              <dd data-testid="diplomacy-success-chance">{quote.successChance}%</dd>
            </div>
            <div>
              <dt>预期关系变动</dt>
              <dd>
                {quote.valid
                  ? missionType === 'gift'
                    ? `+${quote.projectedGainMin} ~ +${quote.projectedGainMax}`
                    : `成 +${quote.projectedGainMin}~+${quote.projectedGainMax} / 拒 ${quote.projectedRejectDelta}`
                  : '—'}
              </dd>
            </div>
            <div className="trade-total">
              <dt>国库礼费支出</dt>
              <dd data-testid="diplomacy-mission-cost">{quote.cost.toLocaleString()} 金</dd>
            </div>
          </dl>

          {(!quote.valid || formError) && (
            <p className="trade-error" role="alert">
              {formError || quote.error}
            </p>
          )}

          <Button
            id="btn-dispatch-envoy"
            type="submit"
            className="trade-confirm"
            disabled={!quote.valid}
          >
            <Handshake size={16} /> 派遣 {selectedEnvoy?.name || '使节'} 出使{currentTargetInfo?.name || ''}
          </Button>

          {latestOutcome && (
            <div
              className={`diplomacy-outcome ${latestOutcome.accepted ? 'is-accepted' : 'is-rejected'}`}
              data-testid="diplomacy-latest-outcome"
              role="status"
            >
              <div className="diplomacy-outcome-head">
                {latestOutcome.accepted ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                <strong>
                  {latestOutcome.accepted ? '国书见纳' : '斡旋受阻'} · 好感{' '}
                  {latestOutcome.delta >= 0 ? `+${latestOutcome.delta}` : latestOutcome.delta}（
                  {latestOutcome.previousScore} → {latestOutcome.newScore}）
                </strong>
              </div>
              <p>{latestOutcome.message}</p>
            </div>
          )}
        </form>

        {/* Right pane: Faction Relationship Ledger & Log */}
        <div className="diplomacy-ledger">
          <div className="diplomacy-ledger-head">
            <h3>
              <Globe size={17} /> 列国邦交账簿（{currentPlayerInfo?.name || playerFaction}视角）
            </h3>
            <span className="trade-muted">{targetOptions.length} 个主权势力</span>
          </div>

          <div className="diplomacy-faction-list">
            {targetOptions.map(faction => {
              const score = getRelationScore(diplomacyState, playerFaction, faction.id);
              const standing = getDiplomaticStanding(diplomacyState, playerFaction, faction.id);
              const pact = hasTradePact(diplomacyState, playerFaction, faction.id);
              const allied = hasAlliance(diplomacyState, playerFaction, faction.id);
              const meterPct = Math.round(((score + 100) / 200) * 100);
              const isSelected = targetFaction === faction.id;

              return (
                <div
                  key={faction.id}
                  className={`diplomacy-card ${isSelected ? 'is-selected' : ''}`}
                  data-testid={`diplomacy-card-${faction.id}`}
                >
                  <button
                    type="button"
                    className="diplomacy-card-select"
                    onClick={() => {
                      setTargetFaction(faction.id);
                      setFormError('');
                    }}
                  >
                    <div className="diplomacy-card-top">
                      <span className="diplomacy-faction-name">
                        <span
                          className="diplomacy-color-dot"
                          style={{ backgroundColor: faction.color }}
                        />
                        <span>{faction.crest}</span>
                        <strong>{faction.name}</strong>
                        <small className="trade-muted">{faction.ruler}</small>
                      </span>
                      <span className={`diplomacy-standing-badge ${standing.badgeClass}`}>
                        {standing.label}
                      </span>
                    </div>

                    <div className="diplomacy-meter-row">
                      <div className="diplomacy-meter-track" aria-hidden="true">
                        <span
                          className="diplomacy-meter-fill"
                          style={{
                            width: `${meterPct}%`,
                            backgroundColor:
                              score >= 30
                                ? '#34d399'
                                : score > -30
                                  ? '#fbbf24'
                                  : '#fb7185',
                          }}
                        />
                      </div>
                      <span className="diplomacy-score-num">
                        {score > 0 ? `+${score}` : score}
                      </span>
                    </div>
                  </button>

                  {(pact || allied) && (
                    <div className="diplomacy-pacts-row">
                      {allied && (
                        <span className="diplomacy-pact-tag is-alliance">
                          <Handshake size={12} /> 攻守同盟
                          <button
                            type="button"
                            className="diplomacy-pact-cancel"
                            title="废止军事同盟"
                            onClick={() =>
                              onCancelPact({
                                playerFaction,
                                targetFaction: faction.id,
                                pactType: 'alliance',
                              })
                            }
                          >
                            废约
                          </button>
                        </span>
                      )}
                      {pact && (
                        <span className="diplomacy-pact-tag is-trade">
                          <TrendingUp size={12} /> 通商条约 (-25% 运费)
                          <button
                            type="button"
                            className="diplomacy-pact-cancel"
                            title="废止通商条约"
                            onClick={() =>
                              onCancelPact({
                                playerFaction,
                                targetFaction: faction.id,
                                pactType: 'trade_pact',
                              })
                            }
                          >
                            废约
                          </button>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <h3 className="trade-history-heading diplomacy-history-heading">
            <Users size={15} />
            <span>外交国书档案</span>
          </h3>
          <div className="trade-history diplomacy-history" aria-live="polite">
            {diplomacyState.logs.length > 0 ? (
              diplomacyState.logs.map(entry => (
                <p key={entry.id}>
                  <span className="trade-muted">[{entry.timestampLabel}]</span> {entry.message}
                </p>
              ))
            ) : (
              <p className="trade-muted">尚未派遣过外交使节，请选择左方使命并遣使出访。</p>
            )}
          </div>
        </div>
      </div>

      <DiplomacyRelationChart
        factions={factions}
        diplomacyState={diplomacyState}
        playerFaction={playerFaction}
        selectedTargetFaction={targetFaction}
        onSelectTargetFaction={factionId => {
          setTargetFaction(factionId);
          setFormError('');
        }}
      />
    </section>
  );
}
