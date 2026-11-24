import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Officer, Faction, CampaignScenario, RelationshipRelation, AvatarStyle, RpgCharacter, Party, Quest, QuestState, EquipmentSlot, Equipment } from './types';
import { FACTIONS, FAMOUS_OFFICERS, FAMOUS_RELATIONSHIPS, SCENARIOS, AVAILABLE_SKILLS, AVAILABLE_TRAITS } from './data';
import { ALL_QUESTS, INITIAL_QUEST_STATES } from './data/quests';
import { createRpgCharacter, applyXp, validateEquipAssignment } from './utils/rpg';
import { getCandidateOfficers, getRecruitRefusal, MAX_COMPANIONS } from './utils/party';
import { completeObjective, isQuestComplete, markQuestCompleted } from './utils/quest';
import OfficerCard from './components/OfficerCard';
import AvatarRenderer from './components/AvatarRenderer';
import TacticalMap, { CITIES } from './components/TacticalMap';
import Scene3DViewer from './components/Scene3DViewer';
import StartMenu from './components/StartMenu';
import GameNavigation from './components/GameNavigation';
import Button from './components/Button';
import DuelArena from './components/DuelArena';
import InternalAffairs from './components/InternalAffairs';
import PartyConsole, { RecruitNotice } from './components/PartyConsole';
import DiplomacyPanel from './components/DiplomacyPanel';
import RelationshipTree from './components/RelationshipTree';
import ProtagonistProfile from './components/ProtagonistProfile';
import Alerts, { AlertActiveDisaster } from './components/Alerts';
import {
  createInitialDiplomacyState,
  executeEnvoyMission,
  cancelDiplomaticPact,
  DiplomacyState,
  DiplomaticMissionType,
} from './utils/diplomacy';
import {
  getSeasonFromMonth,
  getSeasonalWeatherForTick,
  applySeasonalOfficerModifiers,
  SeasonalWeatherId,
} from './utils/seasons';
import {
  playClashSound,
  playDrumSound,
  playHarvestSound,
  playClickSound,
  unlockAudio,
  syncBgm,
  stopBgm,
  setSfxEnabled as syncSfxEnabled,
  setBgmEnabled as syncBgmEnabled,
  setSfxVolume as syncSfxVolume,
  setBgmVolume as syncBgmVolume,
  getBgmTrackForContext,
} from './utils/audio';
import { 
  Shield, 
  Swords, 
  Brain, 
  Scroll, 
  Sparkles, 
  User, 
  Compass, 
  Heart, 
  Map, 
  UserPlus, 
  HelpCircle, 
  Sliders, 
  RefreshCw,
  Award,
  BookOpen,
  Sword,
  Target,
  MessageCircle,
  Users,
  Building2,
  Clock,
  Play,
  Pause,
  Calendar,
  Volume2,
  VolumeX,
  Music
} from 'lucide-react';

export default function App() {
  // Application state
  const [showStartMenu, setShowStartMenu] = useState(true);
  const [multiplayerEnabled, setMultiplayerEnabled] = useState(false);
  const [playerFactions, setPlayerFactions] = useState<string[]>(() => SCENARIOS[0].featuredFactions);
  const defaultProtagonistId = getCandidateOfficers(FAMOUS_OFFICERS, SCENARIOS[0].featuredFactions, SCENARIOS[0].featuredFactions)[0]?.id ?? FAMOUS_OFFICERS[0].id;
  const [protagonistId, setProtagonistId] = useState<string>(defaultProtagonistId);
  const [party, setParty] = useState<Party>(() => ({ protagonistId: defaultProtagonistId, companionIds: [] }));
  const [rpgCharacters, setRpgCharacters] = useState<Record<string, RpgCharacter>>(() => ({ [defaultProtagonistId]: createRpgCharacter(defaultProtagonistId) }));
  const [rpgLog, setRpgLog] = useState<string[]>([]);
  const [recruitNotice, setRecruitNotice] = useState<RecruitNotice | null>(null);
  const [questStates, setQuestStates] = useState<QuestState[]>(INITIAL_QUEST_STATES);
  const [partyEquipment, setPartyEquipment] = useState<Record<string, Equipment[]>>({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bgmEnabled, setBgmEnabled] = useState(true);
  const [sfxVolume, setSfxVolume] = useState(0.75);
  const [bgmVolume, setBgmVolume] = useState(0.42);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [inSiegeBattle, setInSiegeBattle] = useState(false);
  const [officers, setOfficers] = useState<Officer[]>(FAMOUS_OFFICERS);
  const [relationships, setRelationships] = useState<RelationshipRelation[]>(FAMOUS_RELATIONSHIPS);
  const [selectedScenario, setSelectedScenario] = useState<CampaignScenario>(SCENARIOS[0]);
  const [activeTab, setActiveTab] = useState<'roster' | 'creator' | 'bonds' | 'map' | 'duel' | 'affairs' | 'diplomacy' | 'viewer3d'>('roster');
  const [advisorOpen, setAdvisorOpen] = useState(true);
  const [playerGold, setPlayerGold] = useState<number>(1500);
  const [diplomacyState, setDiplomacyState] = useState<DiplomacyState>(() => createInitialDiplomacyState(FACTIONS));
  const [activeAlertDisaster, setActiveAlertDisaster] = useState<AlertActiveDisaster | null>(null);
  const [requestedMapTab, setRequestedMapTab] = useState<{
    tab: 'svg-map' | 'cities-all' | 'city-view' | 'war-mode' | 'global-trade' | 'disasters' | 'migrations' | 'world-2026' | '3d-viewer';
    nonce: number;
  } | undefined>(undefined);

  const handleViewReliefMeasures = useCallback(() => {
    setActiveTab('map');
    setRequestedMapTab(prev => ({
      tab: 'disasters',
      nonce: (prev?.nonce ?? 0) + 1,
    }));
  }, []);

  // Unlock browser Web Audio on first user interaction
  useEffect(() => {
    if (audioUnlocked) return;
    const handleFirstGesture = () => {
      if (unlockAudio()) {
        setAudioUnlocked(true);
      }
    };
    window.addEventListener('pointerdown', handleFirstGesture, { passive: true });
    window.addEventListener('keydown', handleFirstGesture, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, [audioUnlocked]);

  // Synchronize SFX & BGM gain buses and active BGM theme
  useEffect(() => {
    syncSfxEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    syncSfxVolume(sfxVolume);
  }, [sfxVolume]);

  useEffect(() => {
    syncBgmEnabled(bgmEnabled);
  }, [bgmEnabled]);

  useEffect(() => {
    syncBgmVolume(bgmVolume);
  }, [bgmVolume]);

  useEffect(() => {
    const track = getBgmTrackForContext({
      showStartMenu,
      activeTab,
      inSiegeBattle: activeTab === 'map' && inSiegeBattle,
    });
    syncBgm(bgmEnabled && audioUnlocked, track);
  }, [bgmEnabled, audioUnlocked, showStartMenu, activeTab, inSiegeBattle]);

  useEffect(() => {
    return () => {
      stopBgm();
    };
  }, []);

  const handleToggleSound = useCallback(() => {
    if (unlockAudio()) setAudioUnlocked(true);
    setSoundEnabled(prev => {
      const next = !prev;
      syncSfxEnabled(next);
      if (next) playClickSound();
      return next;
    });
  }, []);

  const handleToggleBgm = useCallback(() => {
    if (unlockAudio()) setAudioUnlocked(true);
    setBgmEnabled(prev => !prev);
  }, []);

  // Global Background Time State
  const [gameYear, setGameYear] = useState<number>(() => SCENARIOS[0].year);
  const [gameMonth, setGameMonth] = useState<number>(1);
  const [gameXun, setGameXun] = useState<number>(1); // 1 = 上旬, 2 = 中旬, 3 = 下旬
  const [isAutoTime, setIsAutoTime] = useState<boolean>(true); // auto increase the time in the background
  const [timeSpeed, setTimeSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');

  const currentSeason = getSeasonFromMonth(gameMonth);
  const [weatherId, setWeatherId] = useState<SeasonalWeatherId>(() =>
    getSeasonalWeatherForTick(getSeasonFromMonth(1).id, SCENARIOS[0].year, 1, 1)
  );
  const lastWeatherTickRef = useRef<string>(`${SCENARIOS[0].year}:1:1`);

  useEffect(() => {
    const startMonth = selectedScenario.id === 'chibi' ? 5 : 1;
    setGameYear(selectedScenario.year);
    setGameMonth(startMonth);
    setGameXun(1);
    setWeatherId(getSeasonalWeatherForTick(getSeasonFromMonth(startMonth).id, selectedScenario.year, startMonth, 1));
    lastWeatherTickRef.current = `${selectedScenario.year}:${startMonth}:1`;
    setPlayerFactions(selectedScenario.featuredFactions);
    const candidates = getCandidateOfficers(FAMOUS_OFFICERS, selectedScenario.featuredFactions, selectedScenario.featuredFactions);
    const next = candidates.find(candidate => candidate.id === protagonistId)?.id ?? candidates[0]?.id;
    if (next !== protagonistId) setProtagonistId(next);
  }, [selectedScenario, protagonistId]);

  // Periodically update weather based on the current season as the game loop advances
  useEffect(() => {
    const tickKey = `${gameYear}:${gameMonth}:${gameXun}`;
    if (lastWeatherTickRef.current === tickKey) return;
    lastWeatherTickRef.current = tickKey;
    setWeatherId(getSeasonalWeatherForTick(getSeasonFromMonth(gameMonth).id, gameYear, gameMonth, gameXun));
  }, [gameYear, gameMonth, gameXun]);

  // Keep the party and per-character RPG state in sync with the protagonist.
  // Return the same reference when nothing changed so React can bail out.
  useEffect(() => {
    setRecruitNotice(null);
    setParty(prev => (prev.protagonistId === protagonistId ? prev : { ...prev, protagonistId }));
    setRpgCharacters(prev =>
      prev[protagonistId] ? prev : { ...prev, [protagonistId]: createRpgCharacter(protagonistId) }
    );
  }, [protagonistId, selectedScenario]);

  // Apply combat XP to every party member and surface level-ups in the RPG log.
  const grantBattleXp = useCallback((amount: number) => {
    const memberIds = [party.protagonistId, ...party.companionIds];
    const nextCharacters: Record<string, RpgCharacter> = {};
    const levelUps: string[] = [];
    for (const id of memberIds) {
      const current = rpgCharacters[id] ?? createRpgCharacter(id);
      const updated = applyXp(current, amount);
      nextCharacters[id] = updated;
      if (updated.level > current.level) {
        levelUps.push(`【升级】${current.officerId ? current.officerId : id} 升级到 Lv.${updated.level}，获得 1 点技能点！`);
      }
    }
    setRpgCharacters(prev => ({ ...prev, ...nextCharacters }));
    if (levelUps.length) {
      setRpgLog(prev => [...levelUps, ...prev].slice(0, 50));
    }
  }, [party, rpgCharacters]);

  // Complete a quest objective. Rewards are paid when the whole quest completes:
  // XP/officer/equipment are applied here (App owns party & RPG state); gold and
  // grain are applied by TacticalMap (it owns the economy state) via its own
  // quest-states effect.
  const completeQuestObjective = useCallback((questId: string, objectiveId: string) => {
    const quest = ALL_QUESTS.find(q => q.id === questId);
    if (!quest) return;
    const state = questStates.find(s => s.questId === questId);
    if (!state || state.status === 'completed') return;

    const updated = completeObjective(quest, state, objectiveId);
    setQuestStates(prev => prev.map(s => (s.questId === questId ? updated : s)));

    if (!isQuestComplete(quest, updated)) return;

    // Mark the quest completed so rewards pay out exactly once.
    setQuestStates(prev => prev.map(s => (s.questId === questId ? markQuestCompleted(s) : s)));
    const r = quest.rewards;
    if (!r) return;

    if (r.xp) grantBattleXp(r.xp);

    if (r.officerIds?.length) {
      setParty(prev => {
        const ids = [...prev.companionIds];
        for (const oid of r.officerIds) {
          if (oid !== prev.protagonistId && !ids.includes(oid) && ids.length < 4) ids.push(oid);
        }
        return { ...prev, companionIds: ids };
      });
      setRpgLog(prev => [`【任务奖励】新武将加入：${r.officerIds.join('、')}`, ...prev].slice(0, 50));
    }

    if (r.equipment) {
      setPartyEquipment(prev => {
        const owned = [...(prev[party.protagonistId] ?? [])];
        if (owned.some(e => e.id === r.equipment.id)) return prev;
        return { ...prev, [party.protagonistId]: [...owned, r.equipment] };
      });
      setRpgLog(prev => [`【任务奖励】装备获得：${r.equipment.name}（已加入背包）`, ...prev].slice(0, 50));
    }
  }, [ALL_QUESTS, questStates, party, rpgCharacters, grantBattleXp]);

  const activePlayerFactionId = useMemo(
    () => officers.find(o => o.id === party.protagonistId)?.factionId ?? playerFactions[0],
    [officers, party.protagonistId, playerFactions]
  );

  // Recruit a companion: max MAX_COMPANIONS companions, never the protagonist,
  // and blocked when personal rivalry or hostile diplomacy causes a refusal.
  const onRecruit = useCallback((officerId: string) => {
    if (officerId === party.protagonistId) return;
    if (party.companionIds.length >= MAX_COMPANIONS) return;
    if (party.companionIds.includes(officerId)) return;
    const officer = officers.find(o => o.id === officerId);
    if (!officer) return;

    const refusal = getRecruitRefusal({
      candidate: officer,
      party,
      officers,
      relationships,
      diplomacyState,
      playerFactionId: activePlayerFactionId,
      factions: FACTIONS,
    });
    if (refusal.refused && refusal.reason) {
      setRecruitNotice({
        officerId: officer.id,
        officerName: officer.name,
        reason: refusal.reason,
      });
      setRpgLog(prev => [`【婉拒招募】${refusal.reason}`, ...prev].slice(0, 50));
      return;
    }

    setRecruitNotice(null);
    setParty(prev => ({ ...prev, companionIds: [...prev.companionIds, officerId] }));
    setRpgCharacters(prev => (prev[officerId] ? prev : { ...prev, [officerId]: createRpgCharacter(officerId) }));
    setRpgLog(prev => [`【招募】${officer.name} 加入队伍`, ...prev].slice(0, 50));
  }, [party, officers, relationships, diplomacyState, activePlayerFactionId]);

  // Dismiss a companion.
  const onDismiss = useCallback((officerId: string) => {
    setParty(prev => ({ ...prev, companionIds: prev.companionIds.filter(id => id !== officerId) }));
    setRpgLog(prev => [`【解散】${officerId} 离开队伍`, ...prev].slice(0, 50));
  }, []);

  // Spend one skill point on a placeholder skill tied to the new level.
  const onSpendSkillPoint = useCallback((officerId: string, skillId: string) => {
    setRpgCharacters(prev => {
      const char = prev[officerId];
      if (!char || char.skillPoints <= 0 || char.learnedSkills.includes(skillId)) return prev;
      return {
        ...prev,
        [officerId]: { ...char, skillPoints: char.skillPoints - 1, learnedSkills: [...char.learnedSkills, skillId] }
      };
    });
    setRpgLog(prev => [`【技能】${officerId} 学习了 ${skillId}`, ...prev].slice(0, 50));
  }, []);

  // Equip an item: reject unless the item's slot matches the target slot.
  const onEquip = useCallback((officerId: string, slot: EquipmentSlot, equipment: Equipment) => {
    if (!validateEquipAssignment(slot, equipment)) return;
    setRpgCharacters(prev => {
      const char = prev[officerId];
      if (!char || char.equipment[slot]) return prev;
      return {
        ...prev,
        [officerId]: { ...char, equipment: { ...char.equipment, [slot]: equipment } }
      };
    });
    setPartyEquipment(prev => {
      const next = { ...prev };
      for (const ownerId of Object.keys(next)) {
        const owned = next[ownerId] ?? [];
        if (owned.some(item => item.id === equipment.id)) {
          next[ownerId] = owned.filter(item => item.id !== equipment.id);
          return next;
        }
      }
      return prev;
    });
  }, []);

  // Every item owned by any party member: the roster may equip from this shared pool.
  const partyEquipmentPool = useMemo(() => {
    const seen = new Set<string>();
    const pool: Equipment[] = [];
    for (const memberId of [party.protagonistId, ...party.companionIds]) {
      for (const item of partyEquipment[memberId] ?? []) {
        if (seen.has(item.id)) continue;
        seen.add(item.id);
        pool.push(item);
      }
    }
    return pool;
  }, [party, partyEquipment]);

  const handleAdvanceXun = () => {
    setGameXun(prevXun => {
      if (prevXun === 1) return 2;
      if (prevXun === 2) return 3;
      setGameMonth(prevMonth => {
        if (prevMonth >= 12) {
          setGameYear(prevYear => prevYear + 1);
          return 1;
        }
        return prevMonth + 1;
      });
      return 1;
    });
  };

  const handleAdvanceMonth = () => {
    setGameXun(1);
    setGameMonth(prevMonth => {
      if (prevMonth >= 12) {
        setGameYear(prevYear => prevYear + 1);
        return 1;
      }
      return prevMonth + 1;
    });
  };

  // Background auto-time increment timer
  useEffect(() => {
    if (!isAutoTime) return;
    const intervalMs = timeSpeed === 'fast' ? 1200 : timeSpeed === 'normal' ? 2500 : 5000;
    const timer = setInterval(() => {
      handleAdvanceXun();
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isAutoTime, timeSpeed]);

  const timestampLabel = `${gameYear}年 ${gameMonth}月 ${['上旬', '中旬', '下旬'][gameXun - 1]}`;

  const handleExecuteDiplomacyMission = useCallback((input: {
    playerFaction: string;
    targetFaction: string;
    missionType: DiplomaticMissionType;
    envoy?: Officer | null;
    giftAmount?: number;
  }) => {
    const seasonalEnvoy = input.envoy ? applySeasonalOfficerModifiers(input.envoy, currentSeason.id) : input.envoy;
    const result = executeEnvoyMission({
      state: diplomacyState,
      factions: FACTIONS,
      playerFaction: input.playerFaction,
      targetFaction: input.targetFaction,
      missionType: input.missionType,
      envoy: seasonalEnvoy,
      gold: playerGold,
      giftAmount: input.giftAmount,
      timestampLabel,
    });
    if (!result.ok) {
      return { ok: false, error: result.error };
    }
    setDiplomacyState(result.state);
    setPlayerGold(result.gold);
    if (soundEnabled) {
      if (result.entry?.accepted) playHarvestSound();
      else playDrumSound();
    }
    return { ok: true, entry: result.entry };
  }, [diplomacyState, playerGold, timestampLabel, soundEnabled, currentSeason.id]);

  const handleCancelDiplomaticPact = useCallback((input: {
    playerFaction: string;
    targetFaction: string;
    pactType: 'trade_pact' | 'alliance';
  }) => {
    setDiplomacyState(prev => cancelDiplomaticPact({
      state: prev,
      factions: FACTIONS,
      playerFaction: input.playerFaction,
      targetFaction: input.targetFaction,
      pactType: input.pactType,
      timestampLabel,
    }));
  }, [timestampLabel]);
  
  // Roster Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [factionFilter, setFactionFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'global' | 'threekingdoms' | 'custom'>('all');
  const [selectedOfficerId, setSelectedOfficerId] = useState<string>(defaultProtagonistId);
  const [currentCityId, setCurrentCityId] = useState<string>(
    officers.find((o) => o.id === protagonistId)?.homeCity ?? '成都'
  );

  const selectedOfficer = officers.find((o) => o.id === selectedOfficerId) ?? officers[0] ?? FAMOUS_OFFICERS[0];

  // Strategy Advisor panel states
  const [isConsultingAdvisor, setIsConsultingAdvisor] = useState(false);
  const [advisorBrief, setAdvisorBrief] = useState<string>('');
  const [hasServerConnection, setHasServerConnection] = useState<boolean | null>(null);

  // Custom Officer Creator form state
  const [createdCount, setCreatedCount] = useState(1);
  const [customName, setCustomName] = useState('');
  const [customStyleName, setCustomStyleName] = useState('');
  const [customGender, setCustomGender] = useState<'Male' | 'Female'>('Male');
  const [customFactionId, setCustomFactionId] = useState('shu');
  
  // Color hexes and strings for avatar dropdown selections
  const HAIR_STYLES = [
    { name: '帝王发簪', value: 'Topknot Imperial' },
    { name: '朝堂进贤冠', value: 'Noble Court Crown' },
    { name: '英武束发长髯', value: 'Long Bound Mane' },
    { name: '儒雅名士纶巾', value: 'Scholar Jade Headdress' },
    { name: '碧眼紫髯豪杰', value: 'Red-Bearded Sovereign' },
    { name: '战神雉尾冠', value: 'Pheasant-Tail Ribbon' }
  ];

  const HAIR_COLORS = [
    { name: '乌黑墨炭', value: '#171717' },
    { name: '深蓝墨黛', value: '#0f172a' },
    { name: '军政苍青', value: '#1e293b' },
    { name: '烈火赤红', value: '#c2410c' },
    { name: '雪落苍鬓', value: '#4b5563' }
  ];

  const ARMOR_COLORS = [
    { name: '翡翠绿 (蜀汉)', value: '#10b981' },
    { name: '皇家蓝 (曹魏)', value: '#3b82f6' },
    { name: '赤血红 (孙吴)', value: '#ef4444' },
    { name: '无双紫 (吕布军)', value: '#a855f7' },
    { name: '华贵金 (袁绍军)', value: '#eab308' },
    { name: '名士白 (在野)', value: '#f8fafc' },
    { name: '猛虎橙 (东吴)', value: '#fb923c' }
  ];

  const ACCESSORIES = [
    { name: '金镶玉帝王冠', value: 'Golden Sovereign Crown' },
    { name: '青龙偃月刀', value: 'Green Dragon Crescent Blade' },
    { name: '诸葛白羽扇', value: 'Feather Daoist Fan' },
    { name: '倚天佩剑', value: 'Engraved Commander Sword' },
    { name: '空手 (无配饰)', value: 'None' }
  ];

  const EXPRESSIONS = [
    { name: '温和儒雅', value: 'Warm Smiling' },
    { name: '冷峻威仪', value: 'Cold Sovereign' },
    { name: '洞悉天下', value: 'Brilliant Calm' },
    { name: '狂怒咆哮', value: 'Fierce Roaring' },
    { name: '沉着持重', value: 'Stately Guarded' }
  ];

  const GRADIENTS = [
    { name: '碧玉竹林', value: 'from-emerald-950 to-teal-900' },
    { name: '幽燕玄石', value: 'from-blue-950 to-indigo-950' },
    { name: '赤壁烈焰', value: 'from-orange-950 to-red-950' },
    { name: '九霄紫雷', value: 'from-purple-950 to-pink-950' }
  ];

  const [avatarHairStyle, setAvatarHairStyle] = useState(HAIR_STYLES[0].value);
  const [avatarHairColor, setAvatarHairColor] = useState(HAIR_COLORS[0].value);
  const [avatarArmorColor, setAvatarArmorColor] = useState(ARMOR_COLORS[0].value);
  const [avatarAccessory, setAvatarAccessory] = useState(ACCESSORIES[0].value);
  const [avatarExpression, setAvatarExpression] = useState(EXPRESSIONS[0].value);
  const [avatarGradient, setAvatarGradient] = useState(GRADIENTS[0].value);

  // Custom Stats State
  const [statLeadership, setStatLeadership] = useState(70);
  const [statForce, setStatForce] = useState(70);
  const [statIntelligence, setStatIntelligence] = useState(70);
  const [statPolitics, setStatPolitics] = useState(70);
  const [statCharisma, setStatCharisma] = useState(70);

  // Traits & Skills Selectors
  const [selectedTraits, setSelectedTraits] = useState<string[]>([AVAILABLE_TRAITS[0]]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([AVAILABLE_SKILLS[0], AVAILABLE_SKILLS[1]]);

  // Relationships tab creation helper
  const [relFrom, setRelFrom] = useState('');
  const [relTo, setRelTo] = useState('');
  const [relType, setRelType] = useState<'Sworn Brother' | 'Rival' | 'Spouse' | 'Lord' | 'Confidant' | 'Trust'>('Sworn Brother');
  const [combatOutcome, setCombatOutcome] = useState<string | null>(null);

  // Real-time WebSockets synchronization & resilient HTTP fallback
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const pendingRequestsRef = useRef<Record<string, {
    resolve: (val: any) => void;
    reject: (err: any) => void;
  }>>({});

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimeout: any = null;
    let reconnectAttempts = 0;
    let isDisposed = false;

    // Immediately fetch initial state via HTTP in parallel so app is instantly populated
    const fetchInitialHttpState = async () => {
      try {
        const [offRes, relRes] = await Promise.all([
          fetch('/api/officers').then(r => r.ok ? r.json() : null),
          fetch('/api/relationships').then(r => r.ok ? r.json() : null)
        ]);
        if (isDisposed) return;
        if (offRes && Array.isArray(offRes) && offRes.length > 0) {
          setOfficers(offRes);
          setSelectedOfficerId(curr => offRes.some(o => o.id === curr) ? curr : offRes[0]?.id ?? '');
        }
        if (relRes && Array.isArray(relRes)) {
          setRelationships(relRes);
        }
        setHasServerConnection(true);
      } catch (err) {
        console.info('[Init] Offline/standalone mode active.');
      }
    };
    fetchInitialHttpState();

    function connect() {
      if (isDisposed) return;
      setWsStatus('connecting');
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      try {
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          if (isDisposed) return;
          console.log('[WS] Connected to live Three Kingdoms tactical server!');
          reconnectAttempts = 0;
          setWsStatus('connected');
          setHasServerConnection(true);
        };

        socket.onmessage = (event) => {
          if (isDisposed) return;
          try {
            const msg = JSON.parse(event.data);

            switch (msg.type) {
              case 'init': {
                const { officers: initialOfficers, relationships: initialRelationships } = msg.data;
                setOfficers(initialOfficers);
                setRelationships(initialRelationships);
                if (initialOfficers.length > 0) {
                  setSelectedOfficerId(current => {
                    if (!initialOfficers.some(o => o.id === current)) {
                      return initialOfficers[0]?.id ?? '';
                    }
                    return current;
                  });
                }
                break;
              }

              case 'officer_added': {
                const newOfficer = msg.data;
                setOfficers(prev => {
                  const existingIdx = prev.findIndex(o => o.id === newOfficer.id);
                  if (existingIdx !== -1) {
                    const updated = [...prev];
                    updated[existingIdx] = newOfficer;
                    return updated;
                  }
                  return [newOfficer, ...prev];
                });
                setSelectedOfficerId(current => current === newOfficer.id ? newOfficer.id : current);
                break;
              }

              case 'officer_deleted': {
                const { officerId, relationships: updatedRels } = msg.data;
                setOfficers(prev => prev.filter(o => o.id !== officerId));
                setRelationships(updatedRels);
                setSelectedOfficerId(current => {
                  if (current === officerId) {
                    const remaining = officers.filter(o => o.id !== officerId);
                    return remaining[0]?.id ?? '';
                  }
                  return current;
                });
                break;
              }

              case 'relationship_added': {
                const newRel = msg.data;
                setRelationships(prev => {
                  const exists = prev.some(r => 
                    (r.fromOfficerId === newRel.fromOfficerId && r.toOfficerId === newRel.toOfficerId) ||
                    (r.fromOfficerId === newRel.toOfficerId && r.toOfficerId === newRel.fromOfficerId)
                  );
                  if (exists) return prev;
                  return [...prev, newRel];
                });
                break;
              }

              case 'relationship_deleted': {
                const { fromOfficerId, toOfficerId } = msg.data;
                setRelationships(prev => prev.filter(r => 
                  !(r.fromOfficerId === fromOfficerId && r.toOfficerId === toOfficerId) &&
                  !(r.fromOfficerId === toOfficerId && r.toOfficerId === fromOfficerId)
                ));
                break;
              }

              case 'bio_generated': {
                const { requestId, biography } = msg.data;
                const pending = pendingRequestsRef.current[requestId];
                if (pending) {
                  pending.resolve(biography);
                  delete pendingRequestsRef.current[requestId];
                }
                break;
              }

              case 'strategy_evaluated': {
                const { requestId, advice } = msg.data;
                const pending = pendingRequestsRef.current[requestId];
                if (pending) {
                  pending.resolve(advice);
                  delete pendingRequestsRef.current[requestId];
                }
                break;
              }

              case 'duel_notification': {
                const result = msg.data;
                setCombatOutcome(`⚔️ 武将单挑战报：【${result.winnerName}】(武力值 ${result.winnerForce}) 击败了 【${result.loserName}】(武力值 ${result.loserForce})！\n\n战场细节描写：${result.dialogue}`);
                if (soundEnabled) {
                  playClashSound();
                }
                break;
              }

              case 'error': {
                const { requestId, message } = msg.data;
                const pending = pendingRequestsRef.current[requestId];
                if (pending) {
                  pending.reject(new Error(message));
                  delete pendingRequestsRef.current[requestId];
                }
                break;
              }
            }
          } catch (err) {
            console.warn('[WS] Failed to parse message payload');
          }
        };

        socket.onclose = () => {
          if (isDisposed) return;
          setWsStatus('disconnected');
          // Bound reconnection attempts with backoff to prevent continuous connection errors
          if (reconnectAttempts < 3) {
            reconnectAttempts++;
            const backoffMs = reconnectAttempts * 3000;
            reconnectTimeout = setTimeout(connect, backoffMs);
          }
        };

        socket.onerror = () => {
          if (isDisposed) return;
          // Gracefully transition to HTTP fallback without firing noisy console.error
          console.info('[WS] Switched to resilient HTTP mode.');
          setWsStatus('disconnected');
        };

        setWs(socket);
      } catch (e) {
        console.info('[WS] Socket init skipped, HTTP mode active.');
        setWsStatus('disconnected');
      }
    }

    connect();

    return () => {
      isDisposed = true;
      if (socket) {
        socket.onopen = null;
        socket.onmessage = null;
        socket.onclose = null;
        socket.onerror = null;
        try {
          socket.close();
        } catch (_) {}
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, []);

  // Resilient HTTP fallback helpers
  const fetchBioHttp = async (officer: Officer, matchedFaction: Faction): Promise<string> => {
    const res = await fetch('/api/generate_bio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: officer.name,
        styleName: officer.styleName,
        englishName: officer.englishName,
        origin: officer.origin,
        gender: officer.gender,
        factionName: matchedFaction.name,
        stats: officer.stats,
        traits: officer.traits,
        skills: officer.skills
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || '生成列传请求未响应');
    }
    const data = await res.json();
    return data.biography;
  };

  const fetchStrategyHttp = async (officer: Officer, scenario: CampaignScenario): Promise<string> => {
    const res = await fetch('/api/evaluate_strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ officer, scenario })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || '军师殿决策咨询未响应');
    }
    const data = await res.json();
    return data.advice;
  };

  // Promise-based dispatch helpers with WebSocket + HTTP fallback
  const requestBioAI = (officer: Officer, matchedFaction: Faction): Promise<string> => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      return new Promise((resolve, reject) => {
        const requestId = `bio-${Date.now()}-${Math.random()}`;
        pendingRequestsRef.current[requestId] = { resolve, reject };

        // Fallback timer if WS response stalls
        const timer = setTimeout(() => {
          if (pendingRequestsRef.current[requestId]) {
            delete pendingRequestsRef.current[requestId];
            fetchBioHttp(officer, matchedFaction).then(resolve).catch(reject);
          }
        }, 8000);

        try {
          ws.send(JSON.stringify({
            type: 'generate_bio',
            data: {
              requestId,
              name: officer.name,
              styleName: officer.styleName,
              englishName: officer.englishName,
              origin: officer.origin,
              gender: officer.gender,
              factionName: matchedFaction.name,
              stats: officer.stats,
              traits: officer.traits,
              skills: officer.skills
            }
          }));
        } catch (_) {
          clearTimeout(timer);
          delete pendingRequestsRef.current[requestId];
          fetchBioHttp(officer, matchedFaction).then(resolve).catch(reject);
        }
      });
    }

    return fetchBioHttp(officer, matchedFaction);
  };

  const requestStrategyAdvisor = (officer: Officer, scenario: CampaignScenario): Promise<string> => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      return new Promise((resolve, reject) => {
        const requestId = `strat-${Date.now()}-${Math.random()}`;
        pendingRequestsRef.current[requestId] = { resolve, reject };

        const timer = setTimeout(() => {
          if (pendingRequestsRef.current[requestId]) {
            delete pendingRequestsRef.current[requestId];
            fetchStrategyHttp(officer, scenario).then(resolve).catch(reject);
          }
        }, 8000);

        try {
          ws.send(JSON.stringify({
            type: 'evaluate_strategy',
            data: {
              requestId,
              officer,
              scenario
            }
          }));
        } catch (_) {
          clearTimeout(timer);
          delete pendingRequestsRef.current[requestId];
          fetchStrategyHttp(officer, scenario).then(resolve).catch(reject);
        }
      });
    }

    return fetchStrategyHttp(officer, scenario);
  };

  // Sync selected advisor details when officer selection changes
  useEffect(() => {
    setAdvisorBrief('');
  }, [selectedOfficerId, selectedScenario]);

  // Handle generating AI strategic feedback
  const handleConsultWarCouncil = async () => {
    setIsConsultingAdvisor(true);
    try {
      const advice = await requestStrategyAdvisor(selectedOfficer, selectedScenario);
      setAdvisorBrief(advice);
    } catch (err: any) {
      console.warn('[Advisor] Strategy consult notice:', err?.message || err);
      alert(err.message || '大军师处连接遇阻，请检查您是否已在 Secrets Panel 中设置了 GEMINI_API_KEY，且开发服务器正常就绪。');
    } finally {
      setIsConsultingAdvisor(false);
    }
  };

  // Preset randomizer for stats
  const randomizeStats = () => {
    setStatLeadership(Math.floor(Math.random() * 65) + 35);
    setStatForce(Math.floor(Math.random() * 65) + 35);
    setStatIntelligence(Math.floor(Math.random() * 65) + 35);
    setStatPolitics(Math.floor(Math.random() * 65) + 35);
    setStatCharisma(Math.floor(Math.random() * 65) + 35);
  };

  // Randomized creator templates
  const applyTemplate = (type: 'warrior' | 'tactician' | 'monarch') => {
    if (type === 'warrior') {
      setCustomGender('Male');
      setStatLeadership(88);
      setStatForce(98);
      setStatIntelligence(45);
      setStatPolitics(30);
      setStatCharisma(75);
      setAvatarHairStyle('Long Bound Mane');
      setAvatarHairColor('#171717');
      setAvatarArmorColor('#fb923c');
      setAvatarAccessory('Green Dragon Crescent Blade');
      setAvatarExpression('Fierce Roaring');
      setSelectedTraits(['军神 (以无双霸道震慑周围低统帅敌军并强行开启单挑)']);
      setSelectedSkills(['突击 (造成恐怖的近战冲撞伤害)', '单挑 (开启惊心动魄的1对1武将武艺对决)', '奇袭 (穿越丛林灌木发动奔袭，无视城墙防守防线)']);
    } else if (type === 'tactician') {
      setCustomGender('Female');
      setStatLeadership(72);
      setStatForce(35);
      setStatIntelligence(99);
      setStatPolitics(92);
      setStatCharisma(88);
      setAvatarHairStyle('Scholar Jade Headdress');
      setAvatarHairColor('#1e293b');
      setAvatarArmorColor('#f8fafc');
      setAvatarAccessory('Feather Daoist Fan');
      setAvatarExpression('Brilliant Calm');
      setSelectedTraits(['卧龙 (策略消耗大幅降低，且免受计略乾坤)', '神算 (奇门陷阱与火计策略之成功率、杀伤力大幅增强)']);
      setSelectedSkills(['火计 (点燃目标区域地格，火焰随风方向蔓延)', '混乱 (施展诡诈奇策瘫痪敌军，智力高者成功率更高)', '治疗 (恢复重伤士兵的编制数并激发高昂士气)']);
    } else { // Monarch
      setCustomGender('Male');
      setStatLeadership(90);
      setStatForce(71);
      setStatIntelligence(84);
      setStatPolitics(89);
      setStatCharisma(96);
      setAvatarHairStyle('Noble Court Crown');
      setAvatarHairColor('#0f172a');
      setAvatarArmorColor('#3b82f6');
      setAvatarAccessory('Engraved Commander Sword');
      setAvatarExpression('Cold Sovereign');
      setSelectedTraits(['仁德 (提升声望与信赖程度)', '雄心 (提升个人武将统御及兵力募集上限)']);
      setSelectedSkills(['挑衅 (强迫目标敌军失去冷静，暴露出防守破绽)', '铁壁 (短时间内进入物理与计谋免疫的无敌状态)']);
    }
  };

  const handleCreateOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) {
      alert('请输入起立武将名字！');
      return;
    }

    const newOfficer: Officer = {
      id: `custom-${createdCount}-${Date.now()}`,
      name: customName,
      gender: customGender,
      styleName: customStyleName.trim() || undefined,
      factionId: customFactionId,
      avatarStyle: {
        hairColor: avatarHairColor,
        hairStyle: avatarHairStyle,
        armorColor: avatarArmorColor,
        accessory: avatarAccessory,
        expression: avatarExpression,
        bgGradient: avatarGradient
      },
      stats: {
        leadership: statLeadership,
        force: statForce,
        intelligence: statIntelligence,
        politics: statPolitics,
        charisma: statCharisma
      },
      traits: selectedTraits,
      skills: selectedSkills,
      biography: `在公元 ${selectedScenario.title} 的乱世大潮中，高举义旗、挺身而出的杰出原创群雄首领。其卓越的统御与兵法修为堪称一时之俊杰。`,
      custom: true
    };

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'add_officer',
        data: newOfficer
      }));
    } else {
      setOfficers(prev => [newOfficer, ...prev]);
    }

    // Also persist via HTTP REST
    fetch('/api/officers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOfficer)
    }).catch(() => {});
    
    setCreatedCount(prev => prev + 1);
    setSelectedOfficerId(newOfficer.id);
    
    // Reset Form Input
    setCustomName('');
    setCustomStyleName('');
    setActiveTab('roster');
  };

  const handleDeleteOfficer = (id: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'delete_officer',
        data: id
      }));
    } else {
      setOfficers(prev => prev.filter(o => o.id !== id));
      setRelationships(prev => prev.filter(r => r.fromOfficerId !== id && r.toOfficerId !== id));
      if (selectedOfficerId === id) {
        setSelectedOfficerId(FAMOUS_OFFICERS[0]?.id ?? '');
      }
    }
    fetch(`/api/officers/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const handleCreateRelationship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!relFrom || !relTo || relFrom === relTo) {
      alert('Select two unique officers to link!');
      return;
    }

    // Check duplicate
    const exists = relationships.some(r => 
      (r.fromOfficerId === relFrom && r.toOfficerId === relTo) ||
      (r.fromOfficerId === relTo && r.toOfficerId === relFrom)
    );

    if (exists) {
      alert('这两位名将之间已经存在现成的战术连带或情感羁绊网络！');
      return;
    }

    const newRel: RelationshipRelation = {
      fromOfficerId: relFrom,
      toOfficerId: relTo,
      type: relType
    };

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'add_relationship',
        data: newRel
      }));
    } else {
      setRelationships(prev => [...prev, newRel]);
    }
    fetch('/api/relationships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRel)
    }).catch(() => {});
  };

  const handleBreakRelationship = (fromId: string, toId: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'delete_relationship',
        data: { fromOfficerId: fromId, toOfficerId: toId }
      }));
    } else {
      setRelationships(prev => prev.filter(r => 
        !(r.fromOfficerId === fromId && r.toOfficerId === toId) &&
        !(r.fromOfficerId === toId && r.toOfficerId === fromId)
      ));
    }
    fetch(`/api/relationships/${fromId}/${toId}`, { method: 'DELETE' }).catch(() => {});
  };

  // Duel Simulator trigger (via WS broadcast or server REST endpoint)
  const runBattleDuelSim = async (off1: Officer, off2: Officer) => {
    if (!off1 || !off2) return;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'run_duel',
        data: { off1, off2 }
      }));
      return;
    }

    // Try server HTTP endpoint first
    try {
      const res = await fetch('/api/run_duel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ off1, off2 })
      });
      if (res.ok) {
        const { outcome } = await res.json();
        setCombatOutcome(`⚔️ 武将单挑战报：【${outcome.winnerName}】(武力值 ${outcome.winnerForce}) 击败了 【${outcome.loserName}】(武力值 ${outcome.loserForce})！\n\n战场细节描写：${outcome.dialogue}`);
        if (soundEnabled) {
          playClashSound();
        }
        return;
      }
    } catch (_) {}

    // Fallback to local computation
    const force1 = off1.stats.force + Math.floor(Math.random() * 15);
    const force2 = off2.stats.force + Math.floor(Math.random() * 15);
    
    const winner = force1 >= force2 ? off1 : off2;
    const loser = force1 >= force2 ? off2 : off1;

    const dialogue = `${winner.name} 挥舞神兵，避开防线，破空一击直捣 ${loser.name} 空门。“${winner.name}” 在战场单挑坐标格中夺得压倒性大胜！`;
    setCombatOutcome(`⚔️ 【战役单挑战报】: 赢家：${winner.name} (单挑后武力 ${winner.stats.force}) 击败了 输家：${loser.name} (单挑后武力 ${loser.stats.force})！\n\n战场细节描写：${dialogue}`);
    if (soundEnabled) {
      playClashSound();
    }
  };

  // Helper toggle traits
  const toggleTrait = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(prev => prev.filter(t => t !== trait));
    } else {
      if (selectedTraits.length >= 3) {
        alert('一个武将最多只能掌握3个特质个性。');
        return;
      }
      setSelectedTraits(prev => [...prev, trait]);
    }
  };

  // Helper toggle skills
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(prev => prev.filter(s => s !== skill));
    } else {
      if (selectedSkills.length >= 4) {
        alert('一个武将最多只能掌握4个战技技能。');
        return;
      }
      setSelectedSkills(prev => [...prev, skill]);
    }
  };

  // Filter & Search roster
  const filteredOfficers = officers.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      item.name.toLowerCase().includes(q) || 
      (item.styleName && item.styleName.toLowerCase().includes(q)) ||
      (item.englishName && item.englishName.toLowerCase().includes(q)) ||
      (item.origin && item.origin.toLowerCase().includes(q)) ||
      item.biography.toLowerCase().includes(q) ||
      item.traits.some(t => t.toLowerCase().includes(q)) ||
      item.skills.some(s => s.toLowerCase().includes(q));

    const matchesCategory = 
      categoryFilter === 'all' ? true :
      categoryFilter === 'global' ? !!item.isGlobalLeader :
      categoryFilter === 'threekingdoms' ? (!item.isGlobalLeader && !item.custom) :
      categoryFilter === 'custom' ? !!item.custom : true;

    const matchesFaction = factionFilter === 'all' || item.factionId === factionFilter;
    return matchesSearch && matchesCategory && matchesFaction;
  });

  // Render markdown with high visual fidelity custom parser
  const renderAdviceMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Heading level 2 or 3
      if (line.trim().startsWith('###')) {
        return <h4 key={idx} className="text-sm font-bold text-amber-200 mt-4 mb-2 uppercase font-serif tracking-wide">{line.replace('###', '').trim()}</h4>;
      }
      if (line.trim().startsWith('##') || line.trim().startsWith('**')) {
        const cleanText = line.replace(/##|\*\*/g, '').trim();
        return <h3 key={idx} className="text-base font-bold text-amber-400 mt-5 mb-2.5 font-serif border-b border-amber-950/40 pb-1 flex items-center gap-1.5">{cleanText}</h3>;
      }
      // List item
      if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
        const itemText = line.replace(/^[-*]\s*/, '').trim();
        // Look for internal bolding like - **Sima Yi**: Text...
        const boldMatch = itemText.match(/^\*\*(.*?)\*\*:(.*)/);
        if (boldMatch) {
          return (
            <li key={idx} className="ml-4 list-none text-xs text-slate-300 mb-1.5 flex items-start gap-1.5">
              <span className="text-amber-500 mt-1">✦</span>
              <span>
                <strong className="text-amber-200">{boldMatch[1]}</strong>: {boldMatch[2]}
              </span>
            </li>
          );
        }
        return (
          <li key={idx} className="ml-4 list-none text-xs text-slate-300 mb-1.5 flex items-start gap-1.5">
            <span className="text-amber-500 mt-1">✦</span>
            <span>{itemText}</span>
          </li>
        );
      }
      if (line.trim() === '') return <div key={idx} className="h-2"></div>;
      // Normal paragraph
      return <p key={idx} className="text-xs text-slate-300 leading-relaxed mb-2.5">{line}</p>;
    });
  };

  if (showStartMenu) {
    return (
      <StartMenu
        scenarios={SCENARIOS}
        selectedScenario={selectedScenario}
        onSelectScenario={(sc) => setSelectedScenario(sc)}
        onEnterApp={(tab) => {
          if (unlockAudio()) setAudioUnlocked(true);
          if (soundEnabled) playClickSound();
          setActiveTab(tab);
          setShowStartMenu(false);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        bgmEnabled={bgmEnabled}
        onToggleBgm={handleToggleBgm}
        multiplayerEnabled={multiplayerEnabled}
        onMultiplayerChange={setMultiplayerEnabled}
        playerFactions={playerFactions}
        onPlayerFactionsChange={setPlayerFactions}
        protagonistId={protagonistId}
        onProtagonistChange={setProtagonistId}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      <header className="game-header">
        <div className="game-header-inner">
          <div className="game-header-brand">
            <span className="game-header-meta">
              <button
                id="btn-header-self-profile"
                type="button"
                onClick={() => {
                  const self = officers.find(o => o.id === protagonistId) ?? selectedOfficer;
                  setSelectedOfficerId(self.id);
                  setActiveTab('roster');
                }}
                className="underline decoration-amber-500/40 hover:text-amber-300 cursor-pointer transition-colors"
                title={selectedScenario.title}
              >
                主公 {officers.find(o => o.id === protagonistId)?.name ?? selectedOfficer.name}
              </button>
              <span aria-hidden="true">·</span>
              <span>库银 {playerGold.toLocaleString()}</span>
              {multiplayerEnabled && (
                <>
                  <span aria-hidden="true">·</span>
                  <span role="status">{wsStatus === 'connected' ? '联机' : wsStatus === 'connecting' ? '连接中' : '离线'}</span>
                </>
              )}
            </span>
          </div>
          <div className="game-header-actions">
            <Button
              id="btn-toggle-advisor-rail"
              aria-pressed={advisorOpen}
              title={advisorOpen ? '收起军师参谋栏' : '展开军师参谋栏'}
              onClick={() => {
                if (soundEnabled) playClickSound();
                setAdvisorOpen(prev => !prev);
              }}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                advisorOpen ? 'border-amber-500/50 text-amber-300' : ''
              }`}
            >
              <Compass size={15} />
              <span className="header-btn-label">军师</span>
            </Button>
            <details className="game-disclosure game-disclosure-popover">
              <summary className="whitespace-nowrap shrink-0 inline-flex items-center gap-1.5">
                {soundEnabled || bgmEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                <span>声音</span>
              </summary>
              <div className="game-settings-body">
                <div className="flex items-center gap-2">
                  <Button
                    id="btn-header-bgm"
                    aria-label={bgmEnabled ? '关闭背景音乐' : '开启背景音乐'}
                    aria-pressed={bgmEnabled}
                    onClick={handleToggleBgm}
                    className="inline-flex items-center gap-1 whitespace-nowrap shrink-0"
                  >
                    <Music size={13} />
                    <span>{bgmEnabled ? '配乐开' : '配乐关'}</span>
                  </Button>
                  <Button
                    id="btn-header-sfx"
                    aria-label={soundEnabled ? '关闭音效' : '开启音效'}
                    aria-pressed={soundEnabled}
                    onClick={handleToggleSound}
                    className="inline-flex items-center gap-1 whitespace-nowrap shrink-0"
                  >
                    {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                    <span>{soundEnabled ? '音效开' : '音效关'}</span>
                  </Button>
                </div>
                <label className="text-xs font-mono text-slate-300">
                  <span>配乐</span>
                  <input
                    id="slider-bgm-volume"
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(bgmVolume * 100)}
                    onChange={(e) => {
                      if (unlockAudio()) setAudioUnlocked(true);
                      setBgmVolume(Number(e.target.value) / 100);
                    }}
                    className="w-24 accent-amber-500 cursor-pointer"
                  />
                </label>
                <label className="text-xs font-mono text-slate-300">
                  <span>音效</span>
                  <input
                    id="slider-sfx-volume"
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(sfxVolume * 100)}
                    onChange={(e) => {
                      if (unlockAudio()) setAudioUnlocked(true);
                      setSfxVolume(Number(e.target.value) / 100);
                    }}
                    className="w-24 accent-amber-500 cursor-pointer"
                  />
                </label>
              </div>
            </details>
            <Button id="btn-return-start" className="whitespace-nowrap shrink-0" onClick={() => setShowStartMenu(true)}>首页</Button>
          </div>
        </div>
      </header>

      {/* Main Workspace Router */}
      <main className="game-workspace">
        <GameNavigation
          activeTab={activeTab}
          onSelect={(tab) => { if (soundEnabled) playClickSound(); setActiveTab(tab); }}
          year={gameYear}
          month={gameMonth}
          xun={gameXun}
          seasonId={currentSeason.id}
          weatherId={weatherId}
          playing={isAutoTime}
          onToggleTime={() => setIsAutoTime(!isAutoTime)}
          speed={timeSpeed}
          onSpeed={setTimeSpeed}
          onStep={handleAdvanceXun}
          onMonth={handleAdvanceMonth}
        />

        <div className={`game-workspace-body ${advisorOpen ? 'has-advisor' : ''}`}>
        {/* Primary Canvas */}
        <section className="game-primary">

          {/* Tab 1: Officer Roster */}
          {activeTab === 'roster' && (() => {
            const selfOfficer =
              officers.find(o => o.id === protagonistId) ?? officers[0] ?? selectedOfficer;
            const selfRpg = rpgCharacters[selfOfficer.id] ?? createRpgCharacter(selfOfficer.id);
            return (
              <div className="flex flex-col gap-5">
                <ProtagonistProfile
                  protagonist={selfOfficer}
                  officers={officers}
                  factions={FACTIONS}
                  rpgCharacter={selfRpg}
                  party={party}
                  relationships={relationships}
                  diplomacyState={diplomacyState}
                  scenario={selectedScenario}
                  seasonId={currentSeason.id}
                  currentCityName={currentCityId}
                  gold={playerGold}
                  quests={ALL_QUESTS}
                  questStates={questStates}
                  onUpdateSelf={(updated) => {
                    setOfficers(prev => prev.map(o => (o.id === updated.id ? updated : o)));
                    if (ws && ws.readyState === WebSocket.OPEN) {
                      ws.send(JSON.stringify({ type: 'add_officer', data: updated }));
                    }
                  }}
                  onSelectProtagonist={(id) => {
                    setProtagonistId(id);
                    setSelectedOfficerId(id);
                  }}
                  onFocusAdvisor={(off) => {
                    setSelectedOfficerId(off.id);
                    setAdvisorOpen(true);
                  }}
                  onOpenCreator={() => setActiveTab('creator')}
                />

                {/* Unified party console: manage the party (left) and recruit from the pool (right) */}
                <PartyConsole
                  party={party}
                  characters={rpgCharacters}
                  officers={officers}
                  recruitCandidates={filteredOfficers}
                  availableEquipment={partyEquipmentPool}
                  onRecruit={onRecruit}
                  onDismiss={onDismiss}
                  onSpendSkillPoint={onSpendSkillPoint}
                  onEquip={onEquip}
                  relationships={relationships}
                  diplomacyState={diplomacyState}
                  playerFactionId={activePlayerFactionId}
                  recruitNotice={recruitNotice}
                />

              {/* Officer database: edit, delete, promote, or request an AI biography */}
              <details className="game-disclosure">
                <summary>
                  <User size={16} />
                  <span>名将档案 · {filteredOfficers.length} 位</span>
                </summary>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {filteredOfficers.length > 0 ? (
                    filteredOfficers.map(off => (
                      <OfficerCard
                        key={off.id}
                        officer={off}
                        seasonId={currentSeason.id}
                        onEdit={(updated) => {
                          setOfficers(prev => prev.map(o => o.id === updated.id ? updated : o));
                          setSelectedOfficerId(updated.id);
                          if (ws && ws.readyState === WebSocket.OPEN) {
                             ws.send(JSON.stringify({
                              type: 'add_officer',
                              data: updated
                            }));
                          }
                        }}
                        onDelete={handleDeleteOfficer}
                        onSelectForStrategy={(selected) => setSelectedOfficerId(selected.id)}
                        isSelectableForStrategy={true}
                        onGenerateBio={(tgt) => {
                          const matchedFaction = FACTIONS.find(f => f.id === tgt.factionId) || FACTIONS[FACTIONS.length - 1];
                          return requestBioAI(tgt, matchedFaction);
                        }}
                      />
                    ))
                  ) : (
                    <div className="col-span-1 md:col-span-2 text-center py-12 bg-slate-900/10 border border-slate-900 border-dashed rounded-2xl">
                      <User size={24} className="text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-400 font-medium">在这片乱世天盘的坐标格段，未能寻到任何出仕武将。</p>
                      <p className="text-xs text-slate-500 mt-1">请尝试清除搜索字或变更所属势力分类。</p>
                    </div>
                  )}
                </div>
              </details>
            </div>
            );
          })()}

          {/* Tab 2: Custom Officer Creator */}
          {activeTab === 'creator' && (
            <form onSubmit={handleCreateOfficer} className="bg-slate-950 rounded-2xl border border-slate-900 p-6 flex flex-col gap-6">
              
              <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-900 pb-4">
                <div>
                  <h2 className="text-lg font-serif font-bold text-slate-200 uppercase tracking-wider">自立群雄名将幕府</h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">对属性进行完全自定义、一键套用经典模板，并实时预览武将画像。</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    id="btn-template-warrior"
                    type="button"
                    onClick={() => applyTemplate('warrior')}
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 rounded cursor-pointer whitespace-nowrap"
                  >
                    ⚔️ 悍勇猛将
                  </button>
                  <button
                    id="btn-template-tactician"
                    type="button"
                    onClick={() => applyTemplate('tactician')}
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 rounded cursor-pointer whitespace-nowrap"
                  >
                    🎓 治世谋臣
                  </button>
                  <button
                    id="btn-template-monarch"
                    type="button"
                    onClick={() => applyTemplate('monarch')}
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 rounded cursor-pointer whitespace-nowrap"
                  >
                    👑 仁德英豪
                  </button>
                  <Button
                    id="btn-back-to-roster"
                    onClick={() => setActiveTab('roster')}
                    className="text-xs whitespace-nowrap shrink-0"
                  >
                    返回武将
                  </Button>
                </div>
              </div>

              {/* Creator Main content grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Visual live Avatar Generator panel */}
                <div className="md:col-span-4 flex flex-col items-center gap-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-900 min-h-[300px]">
                  <span className="text-xs font-mono text-slate-400 block tracking-widest uppercase">丹青画像</span>
                  
                  <AvatarRenderer 
                    style={{
                      hairColor: avatarHairColor,
                      hairStyle: avatarHairStyle,
                      armorColor: avatarArmorColor,
                      accessory: avatarAccessory,
                      expression: avatarExpression,
                      bgGradient: avatarGradient
                    }} 
                    size={160} 
                  />

                  <div className="w-full space-y-3 mt-2">
                    {/* Background Selector */}
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">画卷背景</label>
                      <select
                        id="select-gradient"
                        value={avatarGradient}
                        onChange={(e) => setAvatarGradient(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg p-2 focus:outline-none"
                      >
                        {GRADIENTS.map(g => (
                          <option key={g.value} value={g.value}>{g.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Expression Selector */}
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">神态之姿</label>
                      <select
                        id="select-expression"
                        value={avatarExpression}
                        onChange={(e) => setAvatarExpression(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg p-2 focus:outline-none"
                      >
                        {EXPRESSIONS.map(e => (
                          <option key={e.value} value={e.value}>{e.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Form fields & Sliders panel */}
                <div className="md:col-span-8 flex flex-col gap-5">
                  
                  {/* Biography Identifiers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono text-slate-400 block mb-1">武将姓名</label>
                      <input
                        id="input-custom-name"
                        type="text"
                        placeholder="例如：马超"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        required
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-slate-400 block mb-1">字号 / 表字</label>
                      <input
                        id="input-style-name"
                        type="text"
                        placeholder="例如：孟起"
                        value={customStyleName}
                        onChange={(e) => setCustomStyleName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono text-slate-400 block mb-1">性别</label>
                      <div className="flex gap-2">
                        {['Male', 'Female'].map(g => (
                          <button
                            id={`btn-gender-${g}`}
                            key={g}
                            type="button"
                            onClick={() => setCustomGender(g as any)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              customGender === g 
                                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' 
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            {g === 'Female' ? '女' : '男'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-slate-400 block mb-1">出仕效忠势力</label>
                      <select
                        id="select-custom-faction"
                        value={customFactionId}
                        onChange={(e) => setCustomFactionId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-slate-700"
                      >
                        {FACTIONS.map(f => (
                          <option key={f.id} value={f.id}>{f.crest} - {f.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Appearance customizations */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/20 p-4 rounded-xl border border-slate-900">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">画卷冠发</label>
                      <select
                        id="select-hair-style"
                        value={avatarHairStyle}
                        onChange={(e) => setAvatarHairStyle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg p-1.5 focus:outline-none"
                      >
                        {HAIR_STYLES.map(h => (
                          <option key={h.value} value={h.value}>{h.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">须发色泽</label>
                      <select
                        id="select-hair-color"
                        value={avatarHairColor}
                        onChange={(e) => setAvatarHairColor(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg p-1.5 focus:outline-none"
                      >
                        {HAIR_COLORS.map(c => (
                          <option key={c.value} value={c.value}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">甲胄战袍色</label>
                      <select
                        id="select-armor-color"
                        value={avatarArmorColor}
                        onChange={(e) => setAvatarArmorColor(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg p-1.5 focus:outline-none"
                      >
                        {ARMOR_COLORS.map(c => (
                          <option key={c.value} value={c.value}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">手持专属神兵武器</label>
                      <select
                        id="select-accessory"
                        value={avatarAccessory}
                        onChange={(e) => setAvatarAccessory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg p-1.5 focus:outline-none"
                      >
                        {ACCESSORIES.map(a => (
                          <option key={a.value} value={a.value}>{a.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Attributes Panel Creator Sliders */}
                  <div className="space-y-3.5 pt-2">
                    <div className="flex justify-between items-center bg-slate-900/10 border-b border-slate-900 pb-1.5">
                      <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                        <Sliders size={12} /> 武将五维属性值自配
                      </span>
                      <button
                        id="btn-randomize-stats"
                        type="button"
                        onClick={randomizeStats}
                        className="text-[10px] text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 font-mono transition-all"
                      >
                        <RefreshCw size={10} /> 骰点随机生成属性
                      </button>
                    </div>

                    {[
                      { label: '统帅率 (LDR)', state: statLeadership, setter: setStatLeadership, icon: Shield, desc: '兵力上限、行军速度、防御坚韧与战术抗性' },
                      { label: '武艺力 (FOR)', state: statForce, setter: setStatForce, icon: Swords, desc: '白刃物理杀伤伤害、战技爆发与个人单挑胜率' },
                      { label: '智略率 (INT)', state: statIntelligence, setter: setStatIntelligence, icon: Brain, desc: '奇袭秘计概率、陷阱与火计杀伤力、智谋抵挡' },
                      { label: '政治度 (POL)', state: statPolitics, setter: setStatPolitics, icon: Scroll, desc: '屯田金米产量、内政筑城科研速度与同盟外交说服' },
                      { label: '魅力值 (CHR)', state: statCharisma, setter: setStatCharisma, icon: Sparkles, desc: '人才召纳速度、名将好感上升与战阵士气维持' }
                    ].map((st, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-300 inline-flex items-center gap-1.5">
                            <st.icon size={12} className="text-amber-500/80" /> {st.label}
                          </span>
                          <span className="text-amber-400 font-bold">{st.state}</span>
                        </div>
                        <input
                          id={`slider-stat-${idx}`}
                          type="range"
                          min="10"
                          max="100"
                          value={st.state}
                          onChange={(e) => st.setter(parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                        <span className="text-[10px] text-slate-500 block leading-none font-mono">{st.desc}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* Traits & Skills check board */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-900">
                <div>
                  <span className="text-xs font-mono font-semibold text-slate-300 block mb-2">个性特质选择 (最多选取 3 项)</span>
                  <div className="grid grid-cols-1 gap-1.5 max-h-[170px] overflow-y-auto pr-1 bg-slate-950 p-3 rounded-xl border border-slate-900">
                    {AVAILABLE_TRAITS.map(tr => {
                      const isSelected = selectedTraits.includes(tr);
                      return (
                        <button
                          id={`btn-trait-${tr.split('(')[0].trim().split('（')[0].trim()}`}
                          key={tr}
                          type="button"
                          onClick={() => toggleTrait(tr)}
                          className={`text-left p-1.5 rounded text-[11px] font-mono transition-all flex items-center justify-between ${
                            isSelected 
                              ? 'bg-amber-950/40 text-amber-300 border border-amber-900/60' 
                              : 'bg-slate-900/30 text-slate-400 border border-transparent hover:border-slate-800'
                          }`}
                        >
                          <span>{tr}</span>
                          {isSelected && <span className="text-amber-400 font-bold">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono font-semibold text-slate-300 block mb-2">战术战法技能选择 (最多选取 4 项)</span>
                  <div className="grid grid-cols-1 gap-1.5 max-h-[170px] overflow-y-auto pr-1 bg-slate-950 p-3 rounded-xl border border-slate-900">
                    {AVAILABLE_SKILLS.map(sk => {
                      const isSelected = selectedSkills.includes(sk);
                      return (
                        <button
                          id={`btn-skill-${sk.split('(')[0].trim().split('（')[0].trim()}`}
                          key={sk}
                          type="button"
                          onClick={() => toggleSkill(sk)}
                          className={`text-left p-1.5 rounded text-[11px] font-mono transition-all flex items-center justify-between ${
                            isSelected 
                              ? 'bg-sky-950/40 text-sky-400 border border-sky-900/50' 
                              : 'bg-slate-900/30 text-slate-400 border border-transparent hover:border-slate-800'
                          }`}
                        >
                          <span>{sk}</span>
                          {isSelected && <span className="text-sky-450 font-bold">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="btn-submit-officer"
                type="submit"
                className="mt-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 text-xs font-black uppercase tracking-widest py-3.5 px-6 rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserPlus size={14} /> 登用此武将，令其入仕参战！
              </button>

            </form>
          )}

          {/* Tab 3: Interactive Relationship Simulator & Duels */}
          {activeTab === 'bonds' && (
            <div className="flex flex-col gap-6">

              {/* Interactive Relationship Tree & Network */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6">
                {(() => {
                  const myFactionId =
                    officers.find(o => o.id === protagonistId)?.factionId ??
                    playerFactions[0];
                  const myFactionName = FACTIONS.find(f => f.id === myFactionId)?.name;
                  return (
                    <RelationshipTree
                      officers={officers}
                      factions={FACTIONS}
                      relationships={relationships}
                      playerFactionId={myFactionId}
                      playerFactionName={myFactionName}
                      selectedOfficerId={selectedOfficerId}
                      onSelectOfficer={(off) => setSelectedOfficerId(off.id)}
                      onDuelPair={runBattleDuelSim}
                      onBreakRelationship={handleBreakRelationship}
                    />
                  );
                })()}
              </div>

              {/* Battle result box if active */}
              {combatOutcome && (
                <div className="bg-amber-950/20 border border-amber-500/30 text-slate-300 p-5 rounded-2xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono font-bold text-amber-400">沙盘两军武将阵前对局单挑演义日志</span>
                    <button
                      id="btn-clear-outcome"
                      onClick={() => setCombatOutcome(null)}
                      className="text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      清空日志
                    </button>
                  </div>
                  <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed text-slate-200 bg-slate-950 p-4 rounded-xl border border-slate-900">
                    {combatOutcome}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Tactical Map Simulation */}
          <div className={activeTab === 'map' ? 'block' : 'hidden'}>
            {(() => {
              const myFactionId =
                officers.find(o => o.id === protagonistId)?.factionId ??
                playerFactions[0];
              return (
                <TacticalMap 
                  selectedScenario={selectedScenario} 
                  officers={officers} 
                  onSelectOfficer={(off) => {
                    setSelectedOfficerId(off.id);
                  }}
                  currentCityId={currentCityId}
                  onSetCurrentCity={setCurrentCityId}
                  soundEnabled={soundEnabled}
                  gameYear={gameYear}
                  gameMonth={gameMonth}
                  gameXun={gameXun}
                  isAutoTime={isAutoTime}
                  playerFactions={playerFactions}
                  playerFactionId={myFactionId}
                  rpgCharacters={rpgCharacters}
                  onRpgCharactersChange={setRpgCharacters}
                  onBattleXp={grantBattleXp}
                  quests={ALL_QUESTS}
                  questStates={questStates}
                  onCompleteQuestObjective={completeQuestObjective}
                  playerGold={playerGold}
                  onGoldChange={setPlayerGold}
                  diplomacyState={diplomacyState}
                  seasonId={currentSeason.id}
                  weatherId={weatherId}
                  onWeatherChange={setWeatherId}
                  onBattleActiveChange={setInSiegeBattle}
                  requestedMapTab={requestedMapTab}
                  onActiveDisasterChange={setActiveAlertDisaster}
                />
              );
            })()}
          </div>

          {/* Tab 4B: Diplomacy & Envoy Missions */}
          {activeTab === 'diplomacy' && (
            <DiplomacyPanel
              factions={FACTIONS}
              officers={officers}
              playerFactions={playerFactions}
              playerFactionId={activePlayerFactionId}
              diplomacyState={diplomacyState}
              gold={playerGold}
              timestampLabel={timestampLabel}
              onExecuteMission={handleExecuteDiplomacyMission}
              onCancelPact={handleCancelDiplomaticPact}
            />
          )}

          {/* Tab 5: 1v1 Duel Arena */}
          {activeTab === 'duel' && (() => {
            const myFactionId =
              officers.find(o => o.id === protagonistId)?.factionId ??
              playerFactions[0];
            const myFactionName = FACTIONS.find(f => f.id === myFactionId)?.name;
            return (
              <DuelArena 
                officers={officers}
                playerFactionId={myFactionId}
                playerFactionName={myFactionName}
                currentCityId={currentCityId}
                soundEnabled={soundEnabled}
                seasonId={currentSeason.id}
                playClashSound={playClashSound}
                playDrumSound={playDrumSound}
                onClose={() => setActiveTab('map')}
              />
            );
          })()}

          {/* Tab 5B: Interactive 3D Viewer */}
          {activeTab === 'viewer3d' && (() => {
            const matchedCity =
              CITIES.find(c => c.name === currentCityId) ||
              CITIES.find(c => c.id === 'luoyang') ||
              CITIES[0];
            return (
              <Scene3DViewer
                cities={CITIES}
                factions={FACTIONS}
                officers={officers}
                selectedCityId={matchedCity.id}
                onSelectCity={cityId => {
                  const next = CITIES.find(c => c.id === cityId);
                  if (next) setCurrentCityId(next.name);
                }}
                onInspectCityDetail={cityId => {
                  const next = CITIES.find(c => c.id === cityId);
                  if (next) setCurrentCityId(next.name);
                  setActiveTab('map');
                  setRequestedMapTab(prev => ({
                    tab: 'city-view',
                    nonce: (prev?.nonce ?? 0) + 1,
                  }));
                }}
                seasonId={currentSeason.id}
                weatherId={weatherId}
              />
            );
          })()}

          {/* Tab 6: Internal Affairs (内政经略) */}
          <div className={activeTab === 'affairs' ? 'block' : 'hidden'}>
            {(() => {
              const myFactionId =
                officers.find(o => o.id === protagonistId)?.factionId ??
                playerFactions[0];
              const myFactionName = FACTIONS.find(f => f.id === myFactionId)?.name;
              return (
                <InternalAffairs 
                  officers={officers}
                  soundEnabled={soundEnabled}
                  playDrumSound={playDrumSound}
                  playClashSound={playClashSound}
                  playHarvestSound={playHarvestSound}
                  onSelectOfficer={(off) => {
                    setSelectedOfficerId(off.id);
                  }}
                  gameYear={gameYear}
                  gameMonth={gameMonth}
                  gameXun={gameXun}
                  isAutoTime={isAutoTime}
                  timeSpeed={timeSpeed}
                  onToggleAutoTime={() => setIsAutoTime(!isAutoTime)}
                  onSetTimeSpeed={(s) => setTimeSpeed(s)}
                  onAdvanceXun={handleAdvanceXun}
                  onAdvanceMonth={handleAdvanceMonth}
                  selectedOfficerId={selectedOfficerId}
                  currentCityId={currentCityId}
                  onSetSelectedOfficerId={setSelectedOfficerId}
                  onSetCurrentCity={setCurrentCityId}
                  isActiveTab={activeTab === 'affairs'}
                  playerFactionId={myFactionId}
                  playerFactionName={myFactionName}
                />
              );
            })()}
          </div>
        </section>

        {/* Right Strategic Advisor Rail (Sticky on desktop, collapsible via header toggle) */}
        {advisorOpen && (
          <aside className="game-advisor-rail" aria-label="军师参谋栏">
            {/* Section 1: Selected Officer Spotlight */}
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-semibold text-slate-400">当前聚焦武将</span>
                <button
                  type="button"
                  onClick={() => setAdvisorOpen(false)}
                  className="text-xs font-mono text-slate-400 hover:text-slate-200 cursor-pointer"
                  aria-label="收起军师栏"
                >
                  收起
                </button>
              </div>
              <div className="flex items-center gap-3.5">
                <AvatarRenderer style={selectedOfficer.avatarStyle} size={64} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <h3 className="font-serif text-base font-bold text-slate-100 leading-snug">
                      {selectedOfficer.name}
                    </h3>
                    {selectedOfficer.styleName && (
                      <span className="text-xs text-slate-400 font-mono">字{selectedOfficer.styleName}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    {FACTIONS.find(f => f.id === selectedOfficer.factionId)?.name ?? selectedOfficer.factionId} · {selectedScenario.year} 年
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-slate-800/70 text-center font-mono text-[11px] tabular-nums">
                <div><span className="text-slate-500 block">统</span><strong className="text-teal-400">{selectedOfficer.stats.leadership}</strong></div>
                <div><span className="text-slate-500 block">武</span><strong className="text-amber-400">{selectedOfficer.stats.force}</strong></div>
                <div><span className="text-slate-500 block">智</span><strong className="text-sky-400">{selectedOfficer.stats.intelligence}</strong></div>
                <div><span className="text-slate-500 block">政</span><strong className="text-emerald-400">{selectedOfficer.stats.politics}</strong></div>
                <div><span className="text-slate-500 block">魅</span><strong className="text-rose-300">{selectedOfficer.stats.charisma}</strong></div>
              </div>
            </div>

            {/* Section 2: Grand Advisory Chamber */}
            <div className="p-4 border-t border-slate-800/80 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full border border-teal-500/30 flex items-center justify-center bg-teal-950/60 text-sm shrink-0">🪶</span>
                  <div>
                    <h3 className="text-sm font-serif font-bold text-teal-300 leading-tight">中军帐军机处</h3>
                    <p className="text-[11px] text-slate-400 font-mono">卧龙孔明参谋简报</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800/80 min-h-[170px] max-h-[340px] overflow-y-auto">
                {isConsultingAdvisor ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center gap-2.5">
                    <RefreshCw size={20} className="text-amber-400 animate-spin" />
                    <p className="text-xs text-slate-300 font-mono">诸葛孔明正夜观星象、研判军机...</p>
                  </div>
                ) : advisorBrief ? (
                  <div className="prose prose-invert prose-xs">
                    {renderAdviceMarkdown(advisorBrief)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-slate-500 gap-2">
                    <MessageCircle size={24} className="text-slate-700" />
                    <p className="text-xs font-medium text-slate-400">中军帐军机处待命中</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      点击下方按钮，军师将针对 {selectedOfficer.name} 与【{selectedScenario.title}】局势推演战略锦囊。
                    </p>
                  </div>
                )}
              </div>

              <button
                id="btn-evaluate-strategy-brief"
                onClick={handleConsultWarCouncil}
                disabled={isConsultingAdvisor}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs tracking-wider transition duration-200 shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Compass size={14} className={isConsultingAdvisor ? 'animate-spin' : ''} />
                {isConsultingAdvisor ? '锦囊研判修纂中...' : `请大军师为 ${selectedOfficer.name} 授计`}
              </button>
            </div>

            {/* Section 3: Collapsible Strategy Notes */}
            <details className="game-disclosure game-advisor">
              <summary>
                <span className="inline-flex items-center gap-1.5 text-slate-300 font-mono">
                  <HelpCircle size={13} className="text-amber-500" />
                  <span>五维属性与羁绊说明</span>
                </span>
              </summary>
              <div className="px-4 pb-4 text-[11px] text-slate-400 space-y-1.5 leading-relaxed font-mono">
                <p>✦ 统帅主导兵力规模上限与城防抵抗；智力决定火计/奇谋命中与反制；武力主导白刃杀伤与单挑胜率。</p>
                <p>✦ 武将若处于结义或良缘等至交羁绊，同阵作战时战技合力连击率将明显提升。</p>
              </div>
            </details>
          </aside>
        )}
        </div>

      </main>

      <Alerts
        weatherId={weatherId}
        gameMonth={gameMonth}
        gameYear={gameYear}
        gameXun={gameXun}
        scenarioYear={selectedScenario.year}
        activeDisaster={activeAlertDisaster}
        onViewReliefMeasures={handleViewReliefMeasures}
        visible={!showStartMenu}
      />
      
    </div>
  );
}
