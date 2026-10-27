import React, { useState, useEffect, useRef } from 'react';
import { Officer, Faction, CampaignScenario, RelationshipRelation, AvatarStyle } from './types';
import { FACTIONS, FAMOUS_OFFICERS, FAMOUS_RELATIONSHIPS, SCENARIOS, AVAILABLE_SKILLS, AVAILABLE_TRAITS } from './data';
import OfficerCard from './components/OfficerCard';
import AvatarRenderer from './components/AvatarRenderer';
import TacticalMap from './components/TacticalMap';
import StartMenu from './components/StartMenu';
import DuelArena from './components/DuelArena';
import InternalAffairs from './components/InternalAffairs';
import { playClashSound, playDrumSound, playHarvestSound } from './utils/audio';
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
  Search, 
  Sliders, 
  Filter, 
  RefreshCw,
  Award,
  BookOpen,
  Sword,
  Target,
  MessageCircle,
  Users,
  Building2
} from 'lucide-react';

export default function App() {
  // Application state
  const [showStartMenu, setShowStartMenu] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [officers, setOfficers] = useState<Officer[]>(FAMOUS_OFFICERS);
  const [relationships, setRelationships] = useState<RelationshipRelation[]>(FAMOUS_RELATIONSHIPS);
  const [selectedScenario, setSelectedScenario] = useState<CampaignScenario>(SCENARIOS[0]);
  const [activeTab, setActiveTab] = useState<'roster' | 'creator' | 'bonds' | 'map' | 'duel' | 'affairs'>('roster');
  
  // Roster Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [factionFilter, setFactionFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'global' | 'threekingdoms' | 'custom'>('all');
  const [selectedOfficer, setSelectedOfficer] = useState<Officer>(FAMOUS_OFFICERS[0]);

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
          setSelectedOfficer(curr => curr && offRes.some((o: any) => o.id === curr.id) ? curr : offRes[0]);
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
                  setSelectedOfficer(current => {
                    if (!current || !initialOfficers.some((o: any) => o.id === current.id)) {
                      return initialOfficers[0];
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
                setSelectedOfficer(current => current && current.id === newOfficer.id ? newOfficer : current);
                break;
              }

              case 'officer_deleted': {
                const { officerId, relationships: updatedRels } = msg.data;
                setOfficers(prev => prev.filter(o => o.id !== officerId));
                setRelationships(updatedRels);
                setSelectedOfficer(current => {
                  if (current && current.id === officerId) {
                    return FAMOUS_OFFICERS[0];
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
  }, [selectedOfficer, selectedScenario]);

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
    setSelectedOfficer(newOfficer);
    
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
      if (selectedOfficer && selectedOfficer.id === id) {
        setSelectedOfficer(FAMOUS_OFFICERS[0]);
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
          setActiveTab(tab);
          setShowStartMenu(false);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Medieval Sovereign Header */}
      <header className="relative border-b border-slate-800 bg-slate-950 px-6 py-6 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-red-500"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xl px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-serif tracking-widest rounded-lg">
                VIII
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-black tracking-widest text-slate-50 uppercase flex items-center gap-2">
                三国志 8
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1.5 font-mono max-w-2xl leading-relaxed">
              招募史实与自立名将，自由配置五维属性与独特特质，缔结合契绊或宿怨机制，更有服务端 Gemini AI 军师亲授天下大势与破敌妙策。
            </p>
          </div>

          <div className="flex gap-2.5 items-center bg-slate-900 border border-slate-800 rounded-xl p-2 md:self-center">
            <button
              id="btn-return-start"
              onClick={() => setShowStartMenu(true)}
              className="px-3 py-1 text-[11px] font-sans font-bold text-amber-500 hover:text-amber-400 border border-amber-500/20 hover:border-amber-500/40 bg-amber-950/20 hover:bg-amber-950/40 rounded-lg active:scale-95 transition-all mr-1 flex items-center gap-1 cursor-pointer"
            >
              🏯 返回开始界面
            </button>
            <span className="text-[11px] font-mono text-slate-400 px-2 border-l border-slate-800 pl-2">军事天盘连线：</span>
            {wsStatus === 'connecting' ? (
              <span className="text-[11px] text-amber-500 flex items-center gap-1 animate-pulse">
                <RefreshCw size={11} className="animate-spin" /> 星曜校准中...
              </span>
            ) : wsStatus === 'connected' ? (
              <span className="text-[11.5px] text-emerald-400 bg-emerald-950/30 px-2.5 py-0.5 rounded-lg border border-emerald-950/80 font-mono flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                实时军政中枢直通
              </span>
            ) : (
              <span className="text-[11.5px] text-rose-400 bg-rose-950/20 px-2.5 py-0.5 rounded-lg border border-rose-950 font-mono inline-flex items-center gap-1.5" title="Attempting reconnection... Make sure the dev server is active.">
                ● 离线沙盘模式
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Grid Router (Roster / Creator / Relationships Simulator) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section (Column span 8): Primary action and selection board */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Navigation Control Toolbar */}
          <div className="bg-slate-950 p-2 rounded-2xl border border-slate-900 flex justify-between items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800/80">
              <button
                id="tab-roster"
                onClick={() => setActiveTab('roster')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-2 cursor-pointer ${
                  activeTab === 'roster' 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users size={12} /> 麾下名将录
              </button>
              <button
                id="tab-creator"
                onClick={() => setActiveTab('creator')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-2 cursor-pointer ${
                  activeTab === 'creator' 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserPlus size={12} /> 自立武将登用
              </button>
              <button
                id="tab-bonds"
                onClick={() => setActiveTab('bonds')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-2 cursor-pointer ${
                  activeTab === 'bonds' 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Heart size={14} /> 人际关系与单挑
              </button>
              <button
                id="tab-affairs"
                onClick={() => setActiveTab('affairs')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-2 cursor-pointer ${
                  activeTab === 'affairs' 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building2 size={12} /> 🏯 内政经略
              </button>
              <button
                id="tab-duel"
                onClick={() => setActiveTab('duel')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-2 cursor-pointer ${
                  activeTab === 'duel' 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Swords size={12} /> ⚔️ 1v1 单挑对决
              </button>
              <button
                id="tab-map"
                onClick={() => setActiveTab('map')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-2 cursor-pointer ${
                  activeTab === 'map' 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Map size={12} /> 沙盘天盘地图
              </button>
            </div>

            <div className="text-xs text-slate-400 font-mono px-3">
              当前剧本年份: <strong className="text-amber-400">公元 {selectedScenario.year} 年</strong>
            </div>
          </div>

          {/* Tab 1: Officer Roster */}
          {activeTab === 'roster' && (
            <div className="flex flex-col gap-5">
              
              {/* Filter controls */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3.5">
                {/* Category selector row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/50">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'all', label: '全部豪杰', count: officers.length, icon: '⚔️' },
                      { id: 'global', label: '世界群雄', count: officers.filter(o => o.isGlobalLeader).length, icon: '🌍' },
                      { id: 'threekingdoms', label: '华夏三国', count: officers.filter(o => !o.isGlobalLeader && !o.custom).length, icon: '🐉' },
                      { id: 'custom', label: '自创武将', count: officers.filter(o => o.custom).length, icon: '✨' }
                    ].map(cat => (
                      <button
                        id={`btn-category-${cat.id}`}
                        key={cat.id}
                        onClick={() => {
                          setCategoryFilter(cat.id as any);
                          if (cat.id === 'global' && factionFilter !== 'all') {
                            const isGlobalFaction = ['rome', 'macedon', 'persia', 'kushan', 'yamatai', 'carthage', 'steppe', 'france', 'russia', 'wuzhou', 'qing', 'qin', 'tang', 'america', 'germany', 'ming', 'ronin'].includes(factionFilter);
                            if (!isGlobalFaction) setFactionFilter('all');
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all inline-flex items-center gap-1.5 border cursor-pointer ${
                          categoryFilter === cat.id
                            ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                            : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${categoryFilter === cat.id ? 'bg-amber-500/30 text-amber-200' : 'bg-slate-800 text-slate-400'}`}>
                          {cat.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="text-xs text-slate-400 font-mono">
                    已入册豪杰: <strong className="text-amber-400">{filteredOfficers.length}</strong> / {officers.length} 位
                  </div>
                </div>

                {/* Search and Faction Filter row */}
                <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
                  <div className="relative w-full md:w-80">
                    <Search size={14} className="absolute left-3 top-3.5 text-slate-500" />
                    <input
                      id="search-officers"
                      type="text"
                      placeholder="搜姓名、号/字、西文名、国家领地、特质或列传..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl pl-9 pr-8 py-2.5 text-xs focus:outline-none focus:border-slate-700 transition-colors"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-3 text-slate-500 hover:text-slate-300 text-xs font-mono"
                        title="清空搜索"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <span className="text-slate-400 text-xs font-mono shrink-0 flex items-center gap-1">
                      <Filter size={12} /> 所属阵营:
                    </span>
                    <div className="flex gap-1">
                      {[
                        { id: 'all', name: '不限阵营' },
                        ...FACTIONS
                      ].map(f => (
                        <button
                          id={`btn-faction-filter-${f.id}`}
                          key={f.id}
                          onClick={() => setFactionFilter(f.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all border shrink-0 flex items-center gap-1 cursor-pointer ${
                            factionFilter === f.id 
                              ? 'bg-slate-800 text-slate-100 border-amber-500/50 shadow-sm' 
                              : 'bg-slate-950/40 text-slate-400 border-transparent hover:border-slate-800 hover:text-slate-300'
                          }`}
                        >
                          {'color' in f && (
                            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: (f as any).color }}></span>
                          )}
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid database Roster */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredOfficers.length > 0 ? (
                  filteredOfficers.map(off => (
                    <OfficerCard
                      key={off.id}
                      officer={off}
                      onEdit={(updated) => {
                        setOfficers(prev => prev.map(o => o.id === updated.id ? updated : o));
                        setSelectedOfficer(updated);
                        if (ws && ws.readyState === WebSocket.OPEN) {
                           ws.send(JSON.stringify({
                            type: 'add_officer',
                            data: updated
                          }));
                        }
                      }}
                      onDelete={handleDeleteOfficer}
                      onSelectForStrategy={(selected) => setSelectedOfficer(selected)}
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
            </div>
          )}

          {/* Tab 2: Custom Officer Creator */}
          {activeTab === 'creator' && (
            <form onSubmit={handleCreateOfficer} className="bg-slate-950 rounded-2xl border border-slate-900 p-6 flex flex-col gap-6">
              
              <div className="flex justify-between items-center border-b border-slate-900 pb-4">
                <div>
                  <h2 className="text-lg font-serif font-bold text-slate-200 uppercase tracking-wider">自立群雄名将幕府</h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">对属性进行完全自定义、一键套用经典模板，并实时预览武将画像。</p>
                </div>

                <div className="flex gap-2">
                  <button
                    id="btn-template-warrior"
                    type="button"
                    onClick={() => applyTemplate('warrior')}
                    className="px-2.5 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-[10px] font-mono text-slate-300 rounded transition-colors"
                  >
                    ⚔️ 悍勇猛将
                  </button>
                  <button
                    id="btn-template-tactician"
                    type="button"
                    onClick={() => applyTemplate('tactician')}
                    className="px-2.5 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-[10px] font-mono text-slate-300 rounded transition-colors"
                  >
                    🎓 治世谋臣
                  </button>
                  <button
                    id="btn-template-monarch"
                    type="button"
                    onClick={() => applyTemplate('monarch')}
                    className="px-2.5 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-[10px] font-mono text-slate-300 rounded transition-colors"
                  >
                    👑 仁德英豪
                  </button>
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
              
              {/* Dynamic oath bonding forge */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6">
                <h3 className="text-base font-serif font-black uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                  <Award size={16} /> 人性情仇纽带锻造工坊
                </h3>
                <p className="text-xs text-slate-400 font-mono mb-4">在此编织与缔结桃园义结金兰、宿敌血仇、联姻爱侣，追踪乱世情仇对大军师出谋决策的作用影响。</p>

                <form onSubmit={handleCreateRelationship} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">第一位名将</label>
                    <select
                      id="select-rel-from"
                      value={relFrom}
                      onChange={(e) => setRelFrom(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="">请选择武将</option>
                      {officers.map(o => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">缔结关系类型</label>
                    <select
                      id="select-rel-type"
                      value={relType}
                      onChange={(e) => setRelType(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3 py-2 text-xs font-mono"
                    >
                      <option value="Sworn Brother">金兰结义 🤝</option>
                      <option value="Rival">生平宿敌 ⚡</option>
                      <option value="Spouse">金玉良缘 💍</option>
                      <option value="Lord">君臣效忠 👑</option>
                      <option value="Confidant">莫逆红颜 🎭</option>
                      <option value="Trust">至信之交 ⭐</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">第二位名将</label>
                    <select
                      id="select-rel-to"
                      value={relTo}
                      onChange={(e) => setRelTo(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="">请选择武将</option>
                      {officers.map(o => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    id="btn-forge-bond"
                    type="submit"
                    className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold py-2 px-4 rounded-xl border border-slate-700 transition cursor-pointer"
                  >
                    锻造连带纽带
                  </button>
                </form>
              </div>

              {/* Active list representation of bounds */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6">
                <span className="text-xs font-mono text-slate-450 block tracking-widest uppercase mb-4 text-slate-400">当前历史天盘演武的名将情仇网络</span>
                
                {relationships.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relationships.map((rel, idx) => {
                      const off1 = officers.find(o => o.id === rel.fromOfficerId);
                      const off2 = officers.find(o => o.id === rel.toOfficerId);
                      
                      if (!off1 || !off2) return null;

                      return (
                        <div key={idx} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between gap-3">
                          <div className="flex justify-between items-center gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-serif text-slate-200 text-sm">{off1.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono">({off1.stats.force} 武力)</span>
                            </div>
                            
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-mono">
                              {rel.type === 'Sworn Brother' ? '金兰结义' : rel.type === 'Rival' ? '生平宿敌' : rel.type === 'Spouse' ? '金玉良缘' : rel.type === 'Lord' ? '主臣效忠' : rel.type === 'Confidant' ? '莫逆红颜' : '至信之交'}
                            </span>

                            <div className="flex items-center gap-2">
                              <span className="font-serif text-slate-200 text-sm">{off2.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono">({off2.stats.force} 武力)</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center bg-slate-950/40 p-1 rounded-lg border border-slate-950">
                            {/* Simulation buttons */}
                            <button
                              id={`btn-duel-sim-${idx}`}
                              onClick={() => runBattleDuelSim(off1, off2)}
                              className="text-[10px] text-sky-400 hover:text-sky-305 text-sky-300 font-semibold px-2 py-1 flex items-center gap-1 active:scale-95 transition cursor-pointer"
                            >
                              ⚔️ 挥军阵前单挑
                            </button>

                            <button
                              id={`btn-sever-bond-${idx}`}
                              onClick={() => handleBreakRelationship(off1.id, off2.id)}
                              className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold px-2 py-1 active:scale-95 transition cursor-pointer"
                            >
                              斩断羁绊情仇
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-slate-500">
                    天盘羁绊中枢目前尚未连结任何人际纽带名录。快在上方熔炉缔结吧！
                  </div>
                )}
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
          {activeTab === 'map' && (
            <TacticalMap 
              selectedScenario={selectedScenario} 
              officers={officers} 
              onSelectOfficer={(off) => {
                setSelectedOfficer(off);
              }} 
              soundEnabled={soundEnabled}
            />
          )}

          {/* Tab 5: 1v1 Duel Arena */}
          {activeTab === 'duel' && (
            <DuelArena 
              officers={officers}
              soundEnabled={soundEnabled}
              playClashSound={playClashSound}
              playDrumSound={playDrumSound}
              onClose={() => setActiveTab('map')}
            />
          )}

          {/* Tab 6: Internal Affairs (内政经略) */}
          {activeTab === 'affairs' && (
            <InternalAffairs 
              officers={officers}
              soundEnabled={soundEnabled}
              playDrumSound={playDrumSound}
              playClashSound={playClashSound}
              playHarvestSound={playHarvestSound}
              onSelectOfficer={(off) => {
                setSelectedOfficer(off);
              }}
            />
          )}

        </section>

        {/* Right Section (Column span 4): Selected Officer Core and Strategy Advisor Council */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Selected Officer Spotlight focus */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 block mb-4">当前聚焦群雄真容</span>
            
            <div className="flex items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-900">
              <AvatarRenderer style={selectedOfficer.avatarStyle} size={84} />
              
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-100 leading-snug">
                  {selectedOfficer.name}
                </h3>
                {selectedOfficer.styleName && (
                  <span className="text-xs text-slate-400 font-mono">&#12298;{selectedOfficer.styleName}&#12299;</span>
                )}
                
                <p className="text-[11px] text-slate-400 mt-1">
                  活跃于 <strong className="text-amber-500 font-mono font-semibold">{selectedScenario.year} 年【{selectedScenario.title}】</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Core Grand Advisory Chamber */}
          <div className="bg-slate-950 rounded-2xl border border-slate-900 overflow-hidden flex flex-col">
            
            {/* Advisor Cover Image header with beautiful deep gradient styling */}
            <div className="p-5 bg-gradient-to-r from-emerald-950 to-indigo-950 border-b border-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full border border-teal-500/30 flex items-center justify-center bg-teal-950 overflow-hidden">
                  <span className="text-base">🪶</span>
                </div>
                <div>
                  <h3 className="text-sm font-serif font-black uppercase text-teal-300 tracking-wider">中军帐军机处</h3>
                  <p className="text-[10px] text-slate-400 font-mono">卧龙孔明大军师专属 AI</p>
                </div>
              </div>

              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block" title="War Council Ready"></span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between gap-5 min-h-[350px]">
              
              {/* Dynamic briefing output */}
              <div className="flex-1 bg-slate-950/80 rounded-xl p-4 border border-slate-900 max-h-[450px] overflow-y-auto">
                {isConsultingAdvisor ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                    <RefreshCw size={24} className="text-amber-400 animate-spin" />
                    <div>
                      <p className="text-xs text-slate-300 font-mono font-medium">诸葛孔明正夜观星象、调兵遣将中...</p>
                      <p className="text-[10px] text-slate-500 mt-1 italic font-sans">&quot;为将者，当知天文，识地理，晓阴阳，明八卦，知兵势。&quot;</p>
                    </div>
                  </div>
                ) : advisorBrief ? (
                  <div className="prose prose-invert prose-xs">
                    {renderAdviceMarkdown(advisorBrief)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                    <MessageCircle size={32} className="text-slate-705 mb-2.5 text-slate-700" />
                    <p className="text-xs font-medium text-slate-400">中军帐军机处目前一片肃静。</p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      请点击下方【请大军师为当前名将亲授锦囊】。军师将针对 {selectedOfficer.name} 及其在 【{selectedScenario.title}】 时期的宿命局势，为您研判推演宏图战略。
                    </p>
                  </div>
                )}
              </div>

              {/* Strategy Invoke Button */}
              <button
                id="btn-evaluate-strategy-brief"
                onClick={handleConsultWarCouncil}
                disabled={isConsultingAdvisor}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Compass size={14} className={isConsultingAdvisor ? 'animate-spin' : ''} />
                {isConsultingAdvisor ? '锦囊研判修纂中...' : `请大军师为 ${selectedOfficer.name} 亲授妙计`}
              </button>

            </div>

          </div>

          {/* Quick FAQ info block */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 text-xs text-slate-400 space-y-1.5 leading-relaxed font-mono">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
              <HelpCircle size={12} className="text-amber-500" />
              <span>三国志8 辅助器军机要策 FAQ</span>
            </div>
            <p className="text-[11px]">✦ 五维属性加权：【统帅】极大地主导兵力规模上限与阵前基础城防抵抗；【智力】能看破大雾陷阱并识破诸葛亮之流的离间诡计；【武力】则对个人白刃伤害与阵前斩首胜率有极其重要的抵抗。</p>
            <p className="text-[11px]">✦ 人脉羁绊：武将间若处于“金兰结义”或“金玉良缘”等至交情谊，两军在沙盘天盘中产生战技合力共鸣的连击概率会飙涨。</p>
          </div>

        </section>

      </main>

      {/* Footer copyright */}
      <footer className="bg-slate-950 py-6 border-t border-slate-900 mt-auto text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-6">
          <p>三国志 8 战术辅助模拟器 — 采用 React、Tailwind CSS V4 精雕细琢，内置服务端 Gemini AI 云脑深度研判。</p>
          <p className="mt-1 text-[10px] text-slate-600">本辅助工具纯属粉丝同人创作，不含任何商业游戏受版权保护的原始资源，生成和定制的名将及演义细节均源于公开的三国古籍传说知识。</p>
        </div>
      </footer>

    </div>
  );
}
