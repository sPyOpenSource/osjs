import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Brain,
  Check,
  Compass,
  Crown,
  Edit3,
  Heart,
  MapPin,
  Scroll,
  Shield,
  Sparkles,
  Swords,
  User,
  UserPlus,
  X,
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
  onUpdateSelf: (updated: Officer) => void;
  onSelectProtagonist?: (officerId: string) => void;
  onFocusAdvisor?: (officer: Officer) => void;
  onOpenCreator?: () => void;
}

const RELATION_LABEL: Record<RelationshipRelation['type'], string> = {
  'Sworn Brother': '义结金兰',
  Spouse: '结发良缘',
  Lord: '君臣效忠',
  Confidant: '莫逆知己',
  Trust: '至信之交',
  Rival: '宿敌对手',
};

const STAT_META: Array<{
  key: keyof OfficerStats;
  label: string;
  icon: typeof Shield;
}> = [
  { key: 'leadership', label: '统帅', icon: Shield },
  { key: 'force', label: '武力', icon: Swords },
  { key: 'intelligence', label: '智力', icon: Brain },
  { key: 'politics', label: '政治', icon: Scroll },
  { key: 'charisma', label: '魅力', icon: Sparkles },
];

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
  onUpdateSelf,
  onSelectProtagonist,
  onFocusAdvisor,
  onOpenCreator,
}: ProtagonistProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftStyleName, setDraftStyleName] = useState(protagonist.styleName ?? '');
  const [draftOrigin, setDraftOrigin] = useState(protagonist.origin ?? '');
  const [draftHomeCity, setDraftHomeCity] = useState(protagonist.homeCity ?? currentCityName);
  const [draftBiography, setDraftBiography] = useState(protagonist.biography ?? '');

  useEffect(() => {
    setIsEditing(false);
    setDraftStyleName(protagonist.styleName ?? '');
    setDraftOrigin(protagonist.origin ?? '');
    setDraftHomeCity(protagonist.homeCity ?? currentCityName);
    setDraftBiography(protagonist.biography ?? '');
  }, [protagonist.id]);

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

  const personalBonds = useMemo(() => {
    const officerMap = new Map(officers.map(o => [o.id, o]));
    return relationships
      .filter(r => r.fromOfficerId === protagonist.id || r.toOfficerId === protagonist.id)
      .map(r => {
        const peerId = r.fromOfficerId === protagonist.id ? r.toOfficerId : r.fromOfficerId;
        const peer = officerMap.get(peerId);
        return {
          peerId,
          peerName: peer?.name ?? peerId,
          type: r.type,
          typeLabel: RELATION_LABEL[r.type] ?? r.type,
        };
      });
  }, [relationships, officers, protagonist.id]);

  const diplomaticSummary = useMemo(() => {
    const playerF = protagonist.factionId;
    if (!playerF || playerF === 'ronin') {
      return { alliances: 0, tradePacts: 0, hostile: 0 };
    }
    let alliances = 0;
    let tradePacts = 0;
    let hostile = 0;
    for (const other of factions) {
      if (other.id === playerF || other.id === 'ronin') continue;
      const key = playerF < other.id ? `${playerF}:${other.id}` : `${other.id}:${playerF}`;
      if (diplomacyState.alliances[key]) alliances += 1;
      if (diplomacyState.tradePacts[key]) tradePacts += 1;
      const rel = diplomacyState.relations[playerF]?.[other.id] ?? 0;
      if (rel <= -30) hostile += 1;
    }
    return { alliances, tradePacts, hostile };
  }, [diplomacyState, factions, protagonist.factionId]);

  const companionNames = useMemo(() => {
    const map = new Map(officers.map(o => [o.id, o.name]));
    return party.companionIds.map(id => map.get(id) ?? id);
  }, [officers, party.companionIds]);

  const activeQuest = useMemo(() => {
    const activeState = questStates.find(qs => qs.status === 'active');
    if (!activeState) return null;
    const quest = quests.find(q => q.id === activeState.questId);
    if (!quest) return null;
    const done = activeState.completedObjectiveIds.length;
    return { title: quest.title, done, total: quest.objectives.length };
  }, [quests, questStates]);

  const nextLevelXp = rpgCharacter.level >= MAX_LEVEL ? 0 : xpForLevel(rpgCharacter.level + 1);

  const openEditor = () => {
    setDraftStyleName(protagonist.styleName ?? '');
    setDraftOrigin(protagonist.origin ?? '');
    setDraftHomeCity(protagonist.homeCity ?? currentCityName);
    setDraftBiography(protagonist.biography ?? '');
    setIsEditing(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSelf({
      ...protagonist,
      styleName: draftStyleName.trim() || undefined,
      origin: draftOrigin.trim() || undefined,
      homeCity: draftHomeCity.trim() || undefined,
      biography: draftBiography.trim(),
    });
    setIsEditing(false);
  };

  const equippedList = [
    { label: '武器', item: rpgCharacter.equipment.weapon },
    { label: '防具', item: rpgCharacter.equipment.armor },
    { label: '饰品', item: rpgCharacter.equipment.accessory },
  ];

  return (
    <section
      id="protagonist-profile"
      data-testid="protagonist-profile"
      className="self-profile"
      aria-label="主公个人档案"
    >
      <header className="self-profile-header">
        <div className="self-profile-identity">
          <AvatarRenderer style={protagonist.avatarStyle} size={76} />
          <div className="self-profile-title-block">
            <div className="self-profile-kicker">
              <span>主公本人履历</span>
              <span aria-hidden="true">·</span>
              <span style={{ color: faction?.color }}>{faction?.name ?? protagonist.factionId}</span>
              <span aria-hidden="true">·</span>
              <span>{scenario.title}</span>
            </div>
            <div className="self-profile-name-row">
              <h2>{protagonist.name}</h2>
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
              <span>{protagonist.gender === 'Female' ? '女' : '男'}</span>
              <span aria-hidden="true">·</span>
              <span>
                <Crown size={12} aria-hidden="true" />{' '}
                {protagonist.promotionTitle || promotion.title}（{protagonist.promotionLevel ?? 0}/{promotion.maxLevel} 阶）
              </span>
              <span aria-hidden="true">·</span>
              <span>
                <MapPin size={12} aria-hidden="true" /> 驻地 {protagonist.homeCity || currentCityName}
              </span>
              {protagonist.origin && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>出身 {protagonist.origin}</span>
                </>
              )}
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
              <span>聚焦军机栏</span>
            </Button>
          )}

        </div>
      </header>

      {/* Top quantitative status strip */}
      <div className="self-profile-kpis">
        <div className="self-profile-kpi">
          <span className="self-profile-kpi-label">个人境界</span>
          <strong className="self-profile-kpi-value">
            Lv.{rpgCharacter.level} ·{' '}
            {nextLevelXp > 0
              ? `经验 ${rpgCharacter.xp}/${nextLevelXp}`
              : '已臻化境'}
          </strong>
        </div>
        <div className="self-profile-kpi">
          <span className="self-profile-kpi-label">麾下同行 / 库银</span>
          <strong className="self-profile-kpi-value">
            同伴 {companionNames.length} 位 · {gold.toLocaleString()} 金
          </strong>
        </div>
        <div className="self-profile-kpi">
          <span className="self-profile-kpi-label">人脉羁绊 / 外交</span>
          <strong className="self-profile-kpi-value">
            {personalBonds.length} 处故旧 · {diplomaticSummary.alliances} 同盟 /{' '}
            {diplomaticSummary.tradePacts} 商约
          </strong>
        </div>
        <div className="self-profile-kpi">
          <span className="self-profile-kpi-label">当前使命与时令</span>
          <strong className="self-profile-kpi-value">
            {activeQuest
              ? `${activeQuest.title} (${activeQuest.done}/${activeQuest.total})`
              : `${season.name} · 随时待命`}
          </strong>
        </div>
      </div>

      {/* Main 2-column detail dossier */}
      <div className="self-profile-grid">
        {/* Left: 5-Dim Attributes + Seasonal + Equipment bonuses */}
        <div className="self-profile-section">
          <div className="self-profile-section-head">
            <h3>
              <Award size={15} /> 本尊五维与即时战力
            </h3>
            <span className="trade-muted">
              {season.name} · {season.statSummary}
            </span>
          </div>
          <div className="self-profile-stats">
            {STAT_META.map(({ key, label, icon: Icon }) => {
              const base = protagonist.stats[key];
              const seasonVal = seasonal.stats[key];
              const eqBonus = equipmentBonuses[key];
              const total = Math.min(120, seasonVal + eqBonus);
              const rating = getRating(total);
              const delta = seasonVal - base + eqBonus;

              return (
                <div key={key} className="self-profile-stat-row">
                  <span className="self-profile-stat-name">
                    <Icon size={13} aria-hidden="true" />
                    {label}
                  </span>
                  <div className="self-profile-stat-track" aria-hidden="true">
                    <span
                      className="self-profile-stat-fill"
                      style={{ width: `${Math.min(100, total)}%` }}
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

          <div className="self-profile-gear">
            <h4>随身兵甲器物</h4>
            <div className="self-profile-gear-grid">
              {equippedList.map(slot => (
                <div key={slot.label} className="self-profile-gear-cell">
                  <span className="trade-muted">{slot.label}</span>
                  <strong>{slot.item ? slot.item.name : '未佩备'}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Biography, Traits, Skills, Bonds */}
        <div className="self-profile-section">
          <div className="self-profile-section-head">
            <h3>
              <BookOpen size={15} /> 生平传记与人物关系
            </h3>
            <span className="trade-muted">
              特质 {protagonist.traits.length} 项 · 战法 {protagonist.skills.length} 项
            </span>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="self-profile-edit-form">
              <div className="self-profile-edit-row">
                <label>
                  表字 / 尊号
                  <input
                    id="input-self-style-name"
                    type="text"
                    value={draftStyleName}
                    onChange={e => setDraftStyleName(e.target.value)}
                    placeholder="如：玄德 / 孟德"
                  />
                </label>
                <label>
                  出身籍贯
                  <input
                    id="input-self-origin"
                    type="text"
                    value={draftOrigin}
                    onChange={e => setDraftOrigin(e.target.value)}
                    placeholder="如：幽州涿郡 / 沛国谯县"
                  />
                </label>
                <label>
                  常驻城邑
                  <input
                    id="input-self-home-city"
                    type="text"
                    value={draftHomeCity}
                    onChange={e => setDraftHomeCity(e.target.value)}
                    placeholder="如：成都 / 许昌"
                  />
                </label>
              </div>
              <label>
                本人列传自述
                <textarea
                  id="input-self-biography"
                  rows={3}
                  value={draftBiography}
                  onChange={e => setDraftBiography(e.target.value)}
                  placeholder="书写您的身世抱负、平生志业与乱世经历..."
                />
              </label>
              <div className="self-profile-edit-actions">
                <Button id="btn-save-self-profile" type="submit" className="trade-confirm">
                  <Check size={14} />
                  保存本人履历
                </Button>
              </div>
            </form>
          ) : (
            <p className="self-profile-bio">
              {protagonist.biography ||
                '尚无本人列传记载。可点击右上角「完善履历」，补充您的表字、籍贯与生平抱负。'}
            </p>
          )}

          <div className="self-profile-lists">
            <div>
              <h4>个性特质</h4>
              <p className="self-profile-inline-list">
                {protagonist.traits.length > 0
                  ? protagonist.traits.join(' · ')
                  : '暂无特殊特质'}
              </p>
            </div>
            <div>
              <h4>战法技艺</h4>
              <p className="self-profile-inline-list">
                {protagonist.skills.length > 0 || rpgCharacter.learnedSkills.length > 0
                  ? [...protagonist.skills, ...rpgCharacter.learnedSkills].join(' · ')
                  : '暂无已习战法'}
              </p>
            </div>
            <div>
              <h4>
                <Heart size={12} aria-hidden="true" /> 亲友与宿敌
              </h4>
              <p className="self-profile-inline-list">
                {personalBonds.length > 0
                  ? personalBonds
                      .slice(0, 6)
                      .map(b => `${b.peerName} (${b.typeLabel})`)
                      .join(' · ')
                  : '尚未缔结人物羁绊'}
              </p>
            </div>
            <div>
              <h4>
                <User size={12} aria-hidden="true" /> 随行副将
              </h4>
              <p className="self-profile-inline-list">
                {companionNames.length > 0
                  ? companionNames.join(' · ')
                  : '当前独行天下（可在下方招募同伴）'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
