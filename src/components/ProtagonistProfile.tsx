import React, { useMemo } from 'react';
import {
  Brain,
  Coins,
  Compass,
  Crown,
  Flame,
  Gem,
  Handshake,
  Heart,
  MapPin,
  Scale,
  Scroll,
  Shield,
  Sparkles,
  Swords,
  Users,
  Zap,
} from 'lucide-react';
import {
  CampaignScenario,
  Faction,
  Officer,
  OfficerStats,
  Party,
  Quest,
  QuestState,
  RelationshipRelation,
  RpgCharacter,
} from '../types';
import { DiplomacyState } from '../utils/diplomacy';
import { getRating } from '../utils/rating';
import { MAX_LEVEL, xpForLevel } from '../utils/rpg';
import { applySeasonalOfficerModifiers, SEASONS, SeasonId } from '../utils/seasons';
import { getPromotionInfo } from './OfficerCard';
import AvatarRenderer from './AvatarRenderer';
import Button from './Button';

export interface ProtagonistProfileProps {
  protagonist: Officer;
  officers: Officer[];
  factions: Faction[];
  rpgCharacter: RpgCharacter;
  party: Party;
  relationships: RelationshipRelation[];
  diplomacyState: DiplomacyState;
  scenario: CampaignScenario;
  seasonId: SeasonId;
  currentCityName: string;
  gold: number;
  quests?: Quest[];
  questStates?: QuestState[];
  onUpdateSelf?: (updated: Officer) => void;
  onSelectProtagonist?: (officerId: string) => void;
  onFocusAdvisor?: (officer: Officer) => void;
  onOpenCreator?: () => void;
}

const RELATION_SHORT: Record<RelationshipRelation['type'], { tag: string; full: string }> = {
  'Sworn Brother': { tag: '义', full: '义结金兰' },
  Spouse: { tag: '缘', full: '结发良缘' },
  Lord: { tag: '君', full: '君臣效忠' },
  Confidant: { tag: '知', full: '莫逆知己' },
  Trust: { tag: '信', full: '至信之交' },
  Rival: { tag: '敌', full: '宿敌对手' },
};

const STAT_META: Array<{
  key: keyof OfficerStats;
  label: string;
  short: string;
  icon: typeof Shield;
}> = [
  { key: 'leadership', label: '统帅', short: '统', icon: Shield },
  { key: 'force', label: '武力', short: '武', icon: Swords },
  { key: 'intelligence', label: '智力', short: '智', icon: Brain },
  { key: 'politics', label: '政治', short: '政', icon: Scroll },
  { key: 'charisma', label: '魅力', short: '魅', icon: Sparkles },
];

export interface StatRadarSvgProps {
  stats: OfficerStats;
  baseStats?: OfficerStats;
  accentColor?: string;
  size?: number;
  compact?: boolean;
}

export function StatRadarSvg({
  stats,
  baseStats,
  accentColor = '#f59e0b',
  size = 196,
  compact = false,
}: StatRadarSvgProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = compact ? size * 0.38 : size * 0.31;
  const scaleMax = 105;

  const vertexPoint = (index: number, ratio: number) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 5;
    return {
      x: Number((cx + Math.cos(angle) * maxR * ratio).toFixed(1)),
      y: Number((cy + Math.sin(angle) * maxR * ratio).toFixed(1)),
    };
  };

  const ringPoints = (ratio: number) =>
    STAT_META.map((_, i) => {
      const p = vertexPoint(i, ratio);
      return `${p.x},${p.y}`;
    }).join(' ');

  const polygonPoints = (source: OfficerStats) =>
    STAT_META.map(({ key }, i) => {
      const ratio = Math.min(1.06, Math.max(0.14, source[key] / scaleMax));
      const p = vertexPoint(i, ratio);
      return `${p.x},${p.y}`;
    }).join(' ');

  const activeVertices = STAT_META.map(({ key }, i) => {
    const ratio = Math.min(1.06, Math.max(0.14, stats[key] / scaleMax));
    return { ...vertexPoint(i, ratio), value: stats[key] };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="self-radar-svg"
      role="img"
      aria-label="五维属性雷达图"
    >
      {[0.34, 0.67, 1].map((r) => (
        <polygon
          key={r}
          points={ringPoints(r)}
          fill="none"
          stroke="currentColor"
          strokeOpacity={r === 1 ? 0.24 : 0.12}
          strokeWidth={1}
        />
      ))}

      {STAT_META.map((_, i) => {
        const outer = vertexPoint(i, 1);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={outer.x}
            y2={outer.y}
            stroke="currentColor"
            strokeOpacity={0.14}
            strokeWidth={1}
          />
        );
      })}

      {baseStats && (
        <polygon
          points={polygonPoints(baseStats)}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeDasharray="3 3"
          strokeWidth={1.25}
        />
      )}

      <polygon
        points={polygonPoints(stats)}
        fill={accentColor}
        fillOpacity={0.24}
        stroke={accentColor}
        strokeWidth={2}
      />

      {activeVertices.map((pt, idx) => (
        <circle
          key={idx}
          cx={pt.x}
          cy={pt.y}
          r={compact ? 2.4 : 3.4}
          fill={accentColor}
        />
      ))}

      {!compact &&
        STAT_META.map(({ short }, i) => {
          const lp = vertexPoint(i, 1.32);
          const val = stats[STAT_META[i].key];
          return (
            <g key={short}>
              <text
                x={lp.x}
                y={lp.y - 4}
                textAnchor="middle"
                dominantBaseline="central"
                className="self-radar-label"
              >
                {short}
              </text>
              <text
                x={lp.x}
                y={lp.y + 9}
                textAnchor="middle"
                dominantBaseline="central"
                className="self-radar-num"
              >
                {val}
              </text>
            </g>
          );
        })}
    </svg>
  );
}

export default function ProtagonistProfile({
  protagonist,
  officers,
  factions,
  rpgCharacter,
  party,
  relationships,
  diplomacyState,
  scenario,
  seasonId,
  currentCityName,
  gold,
  quests = [],
  questStates = [],
  onFocusAdvisor,
}: ProtagonistProfileProps) {
  const faction = useMemo(
    () => factions.find(f => f.id === protagonist.factionId) ?? factions[factions.length - 1],
    [factions, protagonist.factionId],
  );

  const promotion = useMemo(
    () =>
      getPromotionInfo(
        protagonist.stats,
        protagonist.promotionLevel ?? 0,
        protagonist.isGlobalLeader,
      ),
    [protagonist.stats, protagonist.promotionLevel, protagonist.isGlobalLeader],
  );

  const season = SEASONS[seasonId];
  const seasonal = useMemo(
    () => applySeasonalOfficerModifiers(protagonist, seasonId),
    [protagonist, seasonId],
  );

  const equipmentBonuses = useMemo(() => {
    const totals: OfficerStats = {
      leadership: 0,
      force: 0,
      intelligence: 0,
      politics: 0,
      charisma: 0,
    };
    const items = [
      rpgCharacter.equipment.weapon,
      rpgCharacter.equipment.armor,
      rpgCharacter.equipment.accessory,
    ];
    for (const item of items) {
      if (!item) continue;
      for (const { key } of STAT_META) {
        totals[key] += item.statBonuses[key] ?? 0;
      }
    }
    return totals;
  }, [rpgCharacter.equipment]);

  const effectiveStats: OfficerStats = useMemo(
    () => ({
      leadership: Math.min(120, seasonal.stats.leadership + equipmentBonuses.leadership),
      force: Math.min(120, seasonal.stats.force + equipmentBonuses.force),
      intelligence: Math.min(120, seasonal.stats.intelligence + equipmentBonuses.intelligence),
      politics: Math.min(120, seasonal.stats.politics + equipmentBonuses.politics),
      charisma: Math.min(120, seasonal.stats.charisma + equipmentBonuses.charisma),
    }),
    [seasonal.stats, equipmentBonuses],
  );

  const officerMap = useMemo(() => new Map(officers.map(o => [o.id, o])), [officers]);

  const visualPeers = useMemo(() => {
    const seen = new Set<string>();
    const list: Array<{
      id: string;
      name: string;
      officer?: Officer;
      tag: string;
      full: string;
      isCompanion: boolean;
    }> = [];

    for (const cid of party.companionIds) {
      if (cid === protagonist.id || seen.has(cid)) continue;
      seen.add(cid);
      const off = officerMap.get(cid);
      list.push({
        id: cid,
        name: off?.name ?? cid,
        officer: off,
        tag: '随',
        full: '随行副将',
        isCompanion: true,
      });
    }

    for (const r of relationships) {
      if (r.fromOfficerId !== protagonist.id && r.toOfficerId !== protagonist.id) continue;
      const peerId = r.fromOfficerId === protagonist.id ? r.toOfficerId : r.fromOfficerId;
      if (seen.has(peerId)) continue;
      seen.add(peerId);
      const off = officerMap.get(peerId);
      const meta = RELATION_SHORT[r.type] ?? { tag: '交', full: r.type };
      list.push({
        id: peerId,
        name: off?.name ?? peerId,
        officer: off,
        tag: meta.tag,
        full: meta.full,
        isCompanion: false,
      });
      if (list.length >= 6) break;
    }

    return list;
  }, [party.companionIds, relationships, protagonist.id, officerMap]);

  const diplomaticSummary = useMemo(() => {
    const playerF = protagonist.factionId;
    if (!playerF || playerF === 'ronin') {
      return { alliances: 0, tradePacts: 0 };
    }
    let alliances = 0;
    let tradePacts = 0;
    for (const other of factions) {
      if (other.id === playerF || other.id === 'ronin') continue;
      const key = playerF < other.id ? `${playerF}:${other.id}` : `${other.id}:${playerF}`;
      if (diplomacyState.alliances[key]) alliances += 1;
      if (diplomacyState.tradePacts[key]) tradePacts += 1;
    }
    return { alliances, tradePacts };
  }, [diplomacyState, factions, protagonist.factionId]);

  const activeQuest = useMemo(() => {
    const activeState = questStates.find(qs => qs.status === 'active');
    if (!activeState) return null;
    const quest = quests.find(q => q.id === activeState.questId);
    if (!quest) return null;
    const done = activeState.completedObjectiveIds.length;
    return { title: quest.title, done, total: quest.objectives.length };
  }, [quests, questStates]);

  const nextLevelXp = rpgCharacter.level >= MAX_LEVEL ? 0 : xpForLevel(rpgCharacter.level + 1);
  const xpPct = nextLevelXp > 0 ? Math.min(100, Math.round((rpgCharacter.xp / nextLevelXp) * 100)) : 100;
  const accentColor = faction?.color || '#f59e0b';

  const equippedList = [
    { label: '兵器', icon: Swords, item: rpgCharacter.equipment.weapon },
    { label: '甲胄', icon: Shield, item: rpgCharacter.equipment.armor },
    { label: '宝物', icon: Gem, item: rpgCharacter.equipment.accessory },
  ];

  const allSkills = [...protagonist.skills, ...rpgCharacter.learnedSkills];

  return (
    <section
      id="protagonist-profile"
      data-testid="protagonist-profile"
      className="self-profile"
      aria-label="主公个人档案"
    >
      <header className="self-profile-header">
        <div className="self-profile-identity">
          <div className="self-avatar-frame" style={{ borderColor: accentColor }}>
            <AvatarRenderer style={protagonist.avatarStyle} size={84} />
            <span className="self-avatar-lv" style={{ background: accentColor }}>
              Lv.{rpgCharacter.level}
            </span>
          </div>

          <div className="self-profile-title-block">
            <div className="self-profile-name-row">
              <h2 title={protagonist.biography || undefined}>{protagonist.name}</h2>
              {protagonist.styleName && (
                <span className="self-profile-style">
                  {protagonist.isGlobalLeader ? '号' : '字'} {protagonist.styleName}
                </span>
              )}
              {protagonist.englishName && (
                <span className="self-profile-en">{protagonist.englishName}</span>
              )}
            </div>

            <div className="self-profile-meta">
              <span className="self-faction-mark" style={{ color: accentColor }}>
                {faction?.name ?? protagonist.factionId}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                <Crown size={12} aria-hidden="true" />{' '}
                {protagonist.promotionTitle || promotion.title}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                <MapPin size={12} aria-hidden="true" /> {protagonist.homeCity || currentCityName}
              </span>
              {protagonist.origin && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{protagonist.origin}</span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span>{scenario.year}年</span>
            </div>
          </div>
        </div>

        <div className="self-profile-actions">
          {onFocusAdvisor && (
            <Button
              id="btn-focus-self-advisor"
              onClick={() => onFocusAdvisor(protagonist)}
            >
              <Compass size={14} />
              <span>军机</span>
            </Button>
          )}
        </div>
      </header>

      {/* Visual Telemetry Gauges */}
      <div className="self-profile-kpis">
        <div className="self-profile-kpi">
          <div className="self-kpi-top">
            <span className="self-profile-kpi-label">
              <Zap size={12} aria-hidden="true" /> 境界
            </span>
            <strong className="self-profile-kpi-value">
              {nextLevelXp > 0 ? `${rpgCharacter.xp}/${nextLevelXp}` : '满'}
            </strong>
          </div>
          <div className="self-kpi-bar" aria-hidden="true">
            <span style={{ width: `${xpPct}%`, background: accentColor }} />
          </div>
        </div>

        <div className="self-profile-kpi">
          <div className="self-kpi-top">
            <span className="self-profile-kpi-label">
              <Coins size={12} aria-hidden="true" /> 库银
            </span>
            <strong className="self-profile-kpi-value">{gold.toLocaleString()}</strong>
          </div>
          <div className="self-kpi-sub">
            <span>{season.icon} {season.name}</span>
          </div>
        </div>

        <div className="self-profile-kpi">
          <div className="self-kpi-top">
            <span className="self-profile-kpi-label">
              <Users size={12} aria-hidden="true" /> 随行
            </span>
            <strong className="self-profile-kpi-value">{party.companionIds.length}/3</strong>
          </div>
          <div className="self-mini-slots" aria-hidden="true">
            {[0, 1, 2].map(slot => (
              <span
                key={slot}
                className={slot < party.companionIds.length ? 'is-filled' : ''}
                style={slot < party.companionIds.length ? { background: accentColor } : undefined}
              />
            ))}
          </div>
        </div>

        <div className="self-profile-kpi">
          <div className="self-kpi-top">
            <span className="self-profile-kpi-label">
              <Handshake size={12} aria-hidden="true" /> 外交
            </span>
            <strong className="self-profile-kpi-value">
              {diplomaticSummary.alliances}盟 · {diplomaticSummary.tradePacts}商
            </strong>
          </div>
          <div className="self-kpi-sub">
            {activeQuest ? (
              <span>
                {activeQuest.title} ({activeQuest.done}/{activeQuest.total})
              </span>
            ) : (
              <span>
                <Scale size={11} aria-hidden="true" /> {protagonist.promotionLevel ?? 0}/{promotion.maxLevel}阶
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main 2-Column Visual Showcase */}
      <div className="self-profile-grid">
        {/* Left: Pentagon Radar + Stat Bars */}
        <div className="self-visual-panel">
          <div className="self-radar-wrap" data-testid="protagonist-radar-svg">
            <StatRadarSvg
              stats={effectiveStats}
              baseStats={protagonist.stats}
              accentColor={accentColor}
              size={196}
            />
          </div>

          <div className="self-profile-stats">
            {STAT_META.map(({ key, label, icon: Icon }) => {
              const base = protagonist.stats[key];
              const total = effectiveStats[key];
              const rating = getRating(total);
              const delta = total - base;

              return (
                <div key={key} className="self-profile-stat-row">
                  <span className="self-profile-stat-name">
                    <Icon size={13} aria-hidden="true" />
                    {label}
                  </span>
                  <div className="self-profile-stat-track" aria-hidden="true">
                    <span
                      className="self-profile-stat-fill"
                      style={{ width: `${Math.min(100, total)}%`, background: accentColor }}
                    />
                  </div>
                  <span className="self-profile-stat-nums">
                    <strong>{total}</strong>
                    {delta !== 0 && (
                      <small className={delta > 0 ? 'is-pos' : 'is-neg'}>
                        {delta > 0 ? `+${delta}` : delta}
                      </small>
                    )}
                    <span className={`self-profile-grade ${rating.color}`}>
                      {rating.letter}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Visual Armory, Peer Portraits, Icon Traits/Skills */}
        <div className="self-profile-section">
          {/* 3 Visual Equipment Slots */}
          <div className="self-profile-gear-grid">
            {equippedList.map(slot => {
              const Icon = slot.icon;
              const bonusEntries = slot.item
                ? STAT_META.filter(m => (slot.item?.statBonuses[m.key] ?? 0) !== 0)
                : [];
              return (
                <div
                  key={slot.label}
                  className={`self-profile-gear-cell ${slot.item ? 'is-equipped' : ''}`}
                >
                  <div className="self-gear-head">
                    <Icon size={14} aria-hidden="true" />
                    <span>{slot.label}</span>
                  </div>
                  <strong>{slot.item ? slot.item.name : '空置'}</strong>
                  {bonusEntries.length > 0 && (
                    <span className="self-gear-bonus">
                      {bonusEntries
                        .map(m => `${m.short}+${slot.item?.statBonuses[m.key]}`)
                        .join(' ')}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Visual Peer / Companion Avatar Roster */}
          <div className="self-peers-block">
            <div className="self-block-title">
              <Heart size={12} aria-hidden="true" /> 同袍
            </div>
            {visualPeers.length > 0 ? (
              <div className="self-peers-grid">
                {visualPeers.map(peer => (
                  <div
                    key={peer.id}
                    className="self-peer-tile"
                    title={`${peer.name} · ${peer.full}`}
                  >
                    {peer.officer ? (
                      <AvatarRenderer style={peer.officer.avatarStyle} size={34} />
                    ) : (
                      <div className="self-peer-fallback">{peer.name.slice(0, 1)}</div>
                    )}
                    <div className="self-peer-info">
                      <strong>{peer.name}</strong>
                      <span>{peer.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="self-empty-visual">—</div>
            )}
          </div>

          {/* Visual Trait / Skill Strip */}
          <div className="self-abilities-strip">
            <div className="self-ability-cell">
              <span className="self-block-title">
                <Sparkles size={12} aria-hidden="true" /> 特质
              </span>
              <strong>
                {protagonist.traits.length > 0
                  ? protagonist.traits.slice(0, 4).join(' · ')
                  : '—'}
              </strong>
            </div>
            <div className="self-ability-cell">
              <span className="self-block-title">
                <Flame size={12} aria-hidden="true" /> 战法
              </span>
              <strong>
                {allSkills.length > 0 ? allSkills.slice(0, 4).join(' · ') : '—'}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
