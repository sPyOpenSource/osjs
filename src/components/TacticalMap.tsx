import React, { useState, useEffect } from 'react';
import { Officer, Faction, CampaignScenario } from '../types';
import { FACTIONS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { playDrumSound, playClashSound } from '../utils/audio';
import WarMode from './WarMode';
import { 
  Shield, 
  Swords, 
  Brain, 
  Scroll, 
  Sparkles, 
  Navigation, 
  Compass, 
  Flag, 
  Users, 
  Sword, 
  RefreshCw, 
  Hourglass,
  Sliders,
  HelpCircle,
  Play,
  MapPin,
  Eye,
  Layers,
  Home,
  Coins,
  Dices,
  BookOpen
} from 'lucide-react';

export type AsiaTheater = 'all' | 'central' | 'silkroad' | 'steppe' | 'eastsea' | 'southeast';

export interface City {
  id: string;
  name: string;
  pinyin: string;
  x: number; // SVG coordinate x % (0 - 100)
  y: number; // SVG coordinate y % (0 - 100)
  region: string;
  theater: AsiaTheater;
  description: string;
}

export const ASIA_THEATERS: { id: AsiaTheater; name: string; title: string; desc: string; icon: string }[] = [
  { id: 'all', name: '全域大亚洲', title: '全亚洲大舆图 (Whole Asia Theater)', desc: '西起葱岭贵霜，东至扶桑邪马台，北连漠北草原，南达交趾扶南。', icon: '🌏' },
  { id: 'central', name: '华夏中原', title: '华夏三国中枢 (Central Plains & Three Kingdoms)', desc: '洛阳、长安、成都、建业、许昌等十四州郡核心战区。', icon: '🏯' },
  { id: 'silkroad', name: '西域丝路', title: '西域三十六国与丝绸之路 (Silk Road & Western Regions)', desc: '阳关、玉门关、敦煌、龟兹、疏勒与大月氏贵霜帝国商脉。', icon: '🐪' },
  { id: 'steppe', name: '塞北大漠', title: '塞北大漠与鲜卑乌桓 (Northern Steppes & Nomads)', desc: '鲜卑汗庭、乌桓柳城、白狼山要塞与北方游牧控弦诸部。', icon: '🏹' },
  { id: 'eastsea', name: '东海瀛洲', title: '辽东公孙、高句丽与邪马台 (East Sea & Japan)', desc: '辽东襄平、汉四郡乐浪、高句丽丸都山城与卑弥呼邪马台国。', icon: '🌊' },
  { id: 'southeast', name: '南海百越', title: '南海诸蛮、交趾与扶南 (Southeast Asia & Maritime)', desc: '士燮岭南交州治所、中南半岛扶南古国与滇印身毒商道。', icon: '🌴' }
];

const CITIES: City[] = [
  // 华夏中原核心十四城
  { id: 'beiping', name: '北平', pinyin: 'Beiping', x: 70, y: 32, region: '幽州', theater: 'central', description: '临近幽燕边陲，盛产战马白马义从之精骑，北方游牧守御要门。' },
  { id: 'ye', name: '邺城', pinyin: 'Ye', x: 63, y: 38, region: '河北', theater: 'central', description: '冀州核心，河北之咽喉。背靠太行山，面濒漳水，城郭高峻，物资富庶，亦是王霸之基。' },
  { id: 'changan', name: '长安', pinyin: 'Chang\'an', x: 50, y: 45, region: '关中', theater: 'central', description: '前汉旧都，雄踞关中平原。东有潼关之险，西接丝路。固若金汤，历代帝王龙兴之地。' },
  { id: 'luoyang', name: '洛阳', pinyin: 'Luoyang', x: 57, y: 44, region: '司隶', theater: 'central', description: '东周、东汉、曹魏之大一统帝都。四面环山，雄关拱卫（虎牢关、函谷关），王气巍峨。' },
  { id: 'xuchang', name: '许昌', pinyin: 'Xuchang', x: 62, y: 47, region: '中原', theater: 'central', description: '迎天子都许县，中原腹地。农耕屯田之重镇，城池宽敞，群贤毕至。' },
  { id: 'xiapi', name: '下邳', pinyin: 'Xiapi', x: 69, y: 46, region: '徐州', theater: 'central', description: '徐州军事枢纽，依泗水、沂水之险。吕布殒命白门楼、关羽屯土山约三事之历史舞台。' },
  { id: 'wancheng', name: '宛城', pinyin: 'Wancheng', x: 58, y: 51, region: '荆北', theater: 'central', description: '南阳盆地中枢，曹魏之南方坚固屏障，张绣屯兵伏击曹操之古战场。' },
  { id: 'hanzhong', name: '汉中', pinyin: 'Hanzhong', x: 49, y: 52, region: '秦巴', theater: 'central', description: '汉中盆地，巴蜀之北大门。刘备大败曹操进位汉中王之策源，进可图秦川，退可守蜀川。' },
  { id: 'chengdu', name: '成都', pinyin: 'Chengdu', x: 46, y: 61, region: '巴蜀', theater: 'central', description: '天府之国都城，沃野千里。益州天险，崇山峻岭环抱。物产极其繁盛，蜀汉开国之基石。' },
  { id: 'jianning', name: '建宁', pinyin: 'Jianning', x: 46, y: 73, region: '南中', theater: 'central', description: '蜀汉南中腹地。群山叠嶂，少数武将蛮王聚居。诸葛亮南征平定南蛮、七擒孟获之所。' },
  { id: 'jingzhou', name: '荆州', pinyin: 'Jingzhou', x: 60, y: 57, region: '荆襄', theater: 'central', description: '江陵要塞，天下之枢纽。北连中原，南通岭表，东接江东。刘备借荆州、关羽水淹七军之争地。' },
  { id: 'chaisang', name: '柴桑', pinyin: 'Chaisang', x: 66, y: 59, region: '江东', theater: 'central', description: '江南水陆军事重镇，依庐山，临鄱阳湖。周瑜操练东吴水军十万，迎击曹操百万大军。' },
  { id: 'jianye', name: '建业', pinyin: 'Jianye', x: 73, y: 53, region: '江东', theater: 'central', description: '东吴帝都。虎踞龙盘，依凭长江天堑。江南经济与水军航运中枢，虎视中原。' },
  { id: 'kuaiji', name: '会稽', pinyin: 'Kuaiji', x: 76, y: 62, region: '江东', theater: 'central', description: '越地古邑，盛产米粮、丝织。江东腹地防务后方，钱粮极其充足。' },

  // 西域与中亚丝绸之路
  { id: 'dunhuang', name: '敦煌', pinyin: 'Dunhuang', x: 38, y: 41, region: '河西', theater: 'silkroad', description: '河西四郡之门户，玉门关与阳关扼守东西咽喉。丝绸之路商队与骆驼长旅西出之起点，佛窟禅壁耸立。' },
  { id: 'kucha', name: '龟兹', pinyin: 'Kucha', x: 26, y: 37, region: '西域', theater: 'silkroad', description: '西域三十六国中之富庶大邦，汉魏西域长史府所在。绿洲佛国，盛产良马、冶铁与龟兹乐舞，控扼丝路北道。' },
  { id: 'shule', name: '疏勒', pinyin: 'Shule', x: 17, y: 40, region: '西域', theater: 'silkroad', description: '葱岭脚下绿洲重镇（今喀什），东连塔里木大漠，西出大宛与贵霜。商贾云集，丝绸、香药与玉石贸易通衢。' },
  { id: 'guishuang', name: '贵霜界关', pinyin: 'Kushan', x: 9, y: 51, region: '中亚', theater: 'silkroad', description: '古大月氏所建贵霜帝国（Kushan Empire）东境防隘。横跨中亚与北印度，犍陀罗佛艺与陆路丝绸商脉之交汇门户。' },

  // 塞北大漠与游牧汗庭
  { id: 'xianbei', name: '鲜卑汗庭', pinyin: 'Xianbei', x: 53, y: 19, region: '漠北', theater: 'steppe', description: '北方草原游牧部落联盟核心。檀石槐一统各部后控弦数十万，轲比能雄踞大漠，骑射如风，为汉魏北境心腹之患。' },
  { id: 'liucheng', name: '柳城', pinyin: 'Liucheng', x: 74, y: 25, region: '塞外', theater: 'steppe', description: '三郡乌桓王庭，白狼山咽喉。建安十二年曹操千里北征大破乌桓，张辽前锋阵斩踏顿单于之赫赫古战场。' },

  // 东北、朝鲜半岛与东海瀛洲
  { id: 'xiangping', name: '襄平', pinyin: 'Xiangping', x: 79, y: 28, region: '辽东', theater: 'eastsea', description: '辽东公孙氏三世割据之都城。雄踞辽东半岛，通航高句丽、濊貊与倭国海路，后为司马懿率魏军泛舟北讨平定。' },
  { id: 'wandu', name: '丸都', pinyin: 'Wandu', x: 84, y: 26, region: '高句丽', theater: 'eastsea', description: '高句丽王国山城都邑。依托险要悬崖石壁修筑，数度与辽东公孙氏及曹魏幽州刺史毌丘俭东征大军剧烈交锋。' },
  { id: 'lelang', name: '乐浪', pinyin: 'Lelang', x: 82, y: 35, region: '朝鲜', theater: 'eastsea', description: '汉武帝所置汉四郡之首。中原王朝管辖朝鲜半岛海陆之府治，魏明帝置带方郡抚慰韩半岛与东海倭人。' },
  { id: 'yamatai', name: '邪马台', pinyin: 'Yamatai', x: 93, y: 40, region: '瀛洲', theater: 'eastsea', description: '东海日本列岛古国，由卑弥呼女王统治。景初二年（239年）遣使泛海朝贡，魏明帝特赐金印紫绶封为「亲魏倭王」。' },

  // 岭南、交趾与东南亚扶南
  { id: 'jiaozhi', name: '交趾', pinyin: 'Jiaozhi', x: 58, y: 77, region: '交广', theater: 'southeast', description: '汉末士燮割据岭南交州之治所（今越南红河三角洲龙编）。百越通海第一大港，输出象牙、翡翠与南珠，后归孙吴。' },
  { id: 'funan', name: '扶南', pinyin: 'Funan', x: 58, y: 90, region: '扶南', theater: 'southeast', description: '中南半岛湄公河古王国。吴大帝孙权派遣中郎康泰、宣化从事朱应远航出使扶南诸国，撰成《外国传》，开辟远洋航道。' },
  { id: 'tianzhu_pass', name: '身毒古道', pinyin: 'Tianzhu Pass', x: 34, y: 70, region: '天竺', theater: 'southeast', description: '古蜀身毒道（西南丝绸之路）西出滇池、永昌直通古印度（身毒）之险要古径。商贾翻越雪岭林海，马帮络绎不绝。' }
];

// Helper to get initial ownership according to scenario
const getScenarioDefaultOwnership = (scenarioId: string): Record<string, string> => {
  const baseRonin: Record<string, string> = {
    beiping: 'ronin',
    ye: 'ronin',
    changan: 'ronin',
    luoyang: 'ronin',
    xuchang: 'ronin',
    xiapi: 'ronin',
    wancheng: 'ronin',
    hanzhong: 'ronin',
    chengdu: 'ronin',
    jianning: 'ronin',
    jingzhou: 'ronin',
    chaisang: 'ronin',
    jianye: 'ronin',
    kuaiji: 'ronin',
    dunhuang: 'ronin',
    kucha: 'ronin',
    shule: 'ronin',
    guishuang: 'ronin',
    xianbei: 'ronin',
    liucheng: 'ronin',
    xiangping: 'ronin',
    wandu: 'ronin',
    lelang: 'ronin',
    yamatai: 'ronin',
    jiaozhi: 'ronin',
    funan: 'ronin',
    tianzhu_pass: 'ronin'
  };

  switch (scenarioId) {
    case 'coalition': // 190 AD
      return {
        ...baseRonin,
        ye: 'yuanshao', // Yuan Shao in Hebei
        liucheng: 'yuanshao', // Yuan Shao allied with Wuhuan
        xuchang: 'wei', // Cao Cao starting
        beiping: 'ronin', // Gongsun Zan
        changan: 'ronin', // Dong Zhuo
        luoyang: 'ronin', // Dong Zhuo
        xiapi: 'ronin', // Tao Qian
        wancheng: 'ronin', // Zhang Xiu
        hanzhong: 'ronin', // Zhang Lu
        chengdu: 'ronin', // Liu Yan
        jingzhou: 'ronin', // Liu Biao
        xiangping: 'ronin', // Gongsun Du
        jiaozhi: 'ronin', // Shi Xie
        yamatai: 'ronin' // Queen Himiko
      };
    case 'chibi': // 208 AD
      return {
        ...baseRonin,
        beiping: 'wei',
        ye: 'wei',
        changan: 'wei',
        luoyang: 'wei',
        xuchang: 'wei',
        xiapi: 'wei',
        wancheng: 'wei',
        liucheng: 'wei', // Cao Cao pacified Wuhuan in 207 AD
        dunhuang: 'wei', // Cao Cao secured Hexi
        lelang: 'wei', // Northern outpost
        jingzhou: 'shu', // Liu Bei core
        chaisang: 'wu',
        jianye: 'wu',
        kuaiji: 'wu',
        jiaozhi: 'wu' // Shi Xie pledged allegiance to Sun Quan
      };
    case 'jing': // 219 AD
      return {
        ...baseRonin,
        beiping: 'wei',
        ye: 'wei',
        changan: 'wei',
        luoyang: 'wei',
        xuchang: 'wei',
        xiapi: 'wei',
        wancheng: 'wei',
        liucheng: 'wei',
        dunhuang: 'wei',
        lelang: 'wei',
        hanzhong: 'shu', // Liu Bei captured Hanzhong
        chengdu: 'shu',
        jianning: 'shu',
        jingzhou: 'shu', // Guan Yu defends Jingzhou
        tianzhu_pass: 'shu',
        chaisang: 'wu',
        jianye: 'wu',
        kuaiji: 'wu',
        jiaozhi: 'wu'
      };
    case 'northern': // 227 AD
      return {
        ...baseRonin,
        beiping: 'wei',
        ye: 'wei',
        changan: 'wei',
        luoyang: 'wei',
        xuchang: 'wei',
        xiapi: 'wei',
        wancheng: 'wei',
        liucheng: 'wei',
        dunhuang: 'wei',
        kucha: 'wei', // Cao Wei restored Western Protectorate
        lelang: 'wei',
        hanzhong: 'shu', // Zhuge Liang northern expedition staging
        chengdu: 'shu',
        jianning: 'shu', // Pacified Nanman
        tianzhu_pass: 'shu',
        jingzhou: 'wu', // Wu seized Jingzhou
        chaisang: 'wu',
        jianye: 'wu',
        kuaiji: 'wu',
        jiaozhi: 'wu',
        funan: 'wu' // Sun Wu maritime tribute from Funan
      };
    default:
      return baseRonin;
  }
};

export interface WeatherType {
  id: 'sunny' | 'rainy' | 'windy' | 'foggy';
  name: string;
  nameCn: string;
  icon: string;
  colorClass: string;
  accentColor: string;
  modDesc: string;
}

export const WEATHERS: WeatherType[] = [
  { 
    id: 'sunny', 
    name: 'Sunny', 
    nameCn: '晴朗', 
    icon: '☀️', 
    colorClass: 'text-amber-400 border-amber-500/20 bg-amber-500/10', 
    accentColor: '#fbbf24', 
    modDesc: '烈日晴空：远征战道毫无阻碍，【烽火哨警】及原本的【攻防火箭】等火击全面施展！' 
  },
  { 
    id: 'rainy', 
    name: 'Rainy', 
    nameCn: '暴雨', 
    icon: '🌧️', 
    colorClass: 'text-sky-400 border-sky-500/20 bg-sky-500/10', 
    accentColor: '#38bdf8', 
    modDesc: '暴雨连绵：道路积水极度迟滞军道，出征胜算率直扣10%。【烽火哨警】全面受阻熄灭（禁用火攻）！'
  },
  { 
    id: 'windy', 
    name: 'Windy', 
    nameCn: '狂风', 
    icon: '💨', 
    colorClass: 'text-teal-400 border-teal-500/20 bg-teal-500/10', 
    accentColor: '#2dd4bf', 
    modDesc: '飓风怒卷：偏斜远程飞矢导致胜负变数上升，但顺风火攻将引发焚城烈焰狂暴连击效果！' 
  },
  { 
    id: 'foggy', 
    name: 'Foggy', 
    nameCn: '浓雾', 
    icon: '🌫️', 
    colorClass: 'text-slate-400 border-slate-700/30 bg-slate-700/10', 
    accentColor: '#94a3b8', 
    modDesc: '迷雾遮锁：军道视界严重受阻，敌地防卫度被大雾隐去（遮蔽视界！）。战果极大依赖武将「智力」属性。' 
  }
];

interface TacticalMapProps {
  selectedScenario: CampaignScenario;
  officers: Officer[];
  onSelectOfficer?: (officers: Officer) => void;
  soundEnabled?: boolean;
}

export default function TacticalMap({ 
  selectedScenario, 
  officers, 
  onSelectOfficer,
  soundEnabled = false 
}: TacticalMapProps) {
  const [mapTab, setMapTab] = useState<'svg-map' | 'cities-all' | 'city-view' | 'war-mode'>('svg-map');
  const [weatherId, setWeatherId] = useState<'sunny' | 'rainy' | 'windy' | 'foggy'>('sunny');
  const [selectedTheater, setSelectedTheater] = useState<AsiaTheater>('all');
  const [show190Border, setShow190Border] = useState(true);
  const [showTradeRoutes, setShowTradeRoutes] = useState(true);
  const [showTopography, setShowTopography] = useState(true);
  const [isWideView, setIsWideView] = useState(false);
  const [cityOwnership, setCityOwnership] = useState<Record<string, string>>(() => 
    getScenarioDefaultOwnership(selectedScenario.id)
  );

  const [selectedCityId, setSelectedCityId] = useState<string>('luoyang');

  // City View / Interior Facility states
  const [selectedFacility, setSelectedFacility] = useState<'palace' | 'market' | 'tavern' | 'barracks' | 'gate'>('palace');
  const [hoveredFacility, setHoveredFacility] = useState<'palace' | 'market' | 'tavern' | 'barracks' | 'gate' | null>(null);
  const [cityStats, setCityStats] = useState<Record<string, { prosperity: number; defense: number; grain: number; population: number }>>(() => {
    const stats: Record<string, { prosperity: number; defense: number; grain: number; population: number }> = {};
    CITIES.forEach(c => {
      stats[c.id] = {
        prosperity: 65 + Math.floor(Math.random() * 20),
        defense: 70 + Math.floor(Math.random() * 20),
        grain: 1200 + Math.floor(Math.random() * 2000),
        population: 82000 + Math.floor(Math.random() * 110000)
      };
    });
    return stats;
  });

  const [playerGold, setPlayerGold] = useState<number>(1500);
  const [playerInventory, setPlayerInventory] = useState<string[]>([]);
  const [interiorLogs, setInteriorLogs] = useState<string[]>(['你已勒马顿足，进入华夏古都，巡察九郡风物。']);
  const [diceGameResult, setDiceGameResult] = useState<{
    playerRolls: number[];
    opponentRolls: number[];
    playerSum: number;
    opponentSum: number;
    outcome: 'win' | 'loss' | 'draw' | null;
    message: string;
  } | null>(null);

  const MARKET_ITEMS = [
    { name: '方天画戟 (Legendary Halberd)', type: 'weapon', bonus: '武力 +24', desc: '吕布之神兵，挥舞如风崩裂天地。', cost: 700 },
    { name: '青龙偃月刀 (Grescent Glaive)', type: 'weapon', bonus: '武力 +20', desc: '美髯公关羽之重刃，斩颜良诛文丑。', cost: 550 },
    { name: '孙子兵法 (Art of War Scrolls)', type: 'book', bonus: '智力 +20', desc: '兵圣流传战法宝典，深谋者必读。', cost: 450 },
    { name: '传国玉玺 (Imperial Heirloom Seal)', type: 'seal', bonus: '统帅 +25 | 声望 +100', desc: '受命于天，既寿永昌。得之霸业可成！', cost: 950 },
    { name: '的卢名驹 (Hex Mark Steed)', type: 'steed', bonus: '生存 +15 | 疾驰', desc: '刘备跨江天堑之宝马，能乘风一跃三丈。', cost: 350 },
    { name: '一壶杜康古酒 (Premium Du Kang)', type: 'relic', bonus: '交友率 +30%', desc: '何以解忧？唯有杜康。交友对博绝配。', cost: 120 }
  ];

  // Expedition Form state
  const [expeditionOriginId, setExpeditionOriginId] = useState<string>('chengdu');
  const [expeditionTargetId, setExpeditionTargetId] = useState<string>('hanzhong');
  const [selectedGeneralId, setSelectedGeneralId] = useState<string>('');
  
  // Expedition execution states
  const [isExpeditionRunning, setIsExpeditionRunning] = useState(false);
  const [expeditionLogs, setExpeditionLogs] = useState<string[]>([]);
  const [expeditionStep, setExpeditionStep] = useState<number>(-1); // -1: idle, 0: prep, 1: march, 2: fight/merger, 3: result
  const [expeditionSuccessRate, setExpeditionSuccessRate] = useState<number>(100);

  // Sync ownership when scenario shifts
  useEffect(() => {
    setCityOwnership(getScenarioDefaultOwnership(selectedScenario.id));
    // Default cities reset
    if (selectedScenario.id === 'coalition') {
      setExpeditionOriginId('ye');
      setExpeditionTargetId('beiping');
    } else {
      setExpeditionOriginId('chengdu');
      setExpeditionTargetId('hanzhong');
    }
    // Reset expedition states
    setIsExpeditionRunning(false);
    setExpeditionLogs([]);
    setExpeditionStep(-1);
  }, [selectedScenario]);

  const selectedCity = CITIES.find(c => c.id === selectedCityId) || CITIES[3];
  const selectedCityControllerId = cityOwnership[selectedCity.id] || 'ronin';
  const selectedCityController = FACTIONS.find(f => f.id === selectedCityControllerId) || FACTIONS[5];

  // Stationed generals at currently selected city (based on faction ownership)
  const stationedOfficers = officers.filter(o => o.factionId === selectedCityControllerId);

  // Potential expeditions leaders available at Origin city's owner faction
  const originControllerId = cityOwnership[expeditionOriginId] || 'ronin';
  const leadersAvailable = officers.filter(o => o.factionId === originControllerId);

  // Auto-select first leader when origin changes
  useEffect(() => {
    if (leadersAvailable.length > 0) {
      setSelectedGeneralId(leadersAvailable[0].id);
    } else {
      setSelectedGeneralId('');
    }
  }, [expeditionOriginId, cityOwnership]);

  // Handle faction revision by user
  const handleModifyController = (cityId: string, factionId: string) => {
    setCityOwnership(prev => ({
      ...prev,
      [cityId]: factionId
    }));
  };

  const handleBattleComplete = (winner: 'attacker' | 'defender', goldReward: number, epicRelic?: string, conqueredCityId?: string) => {
    if (winner === 'attacker' && conqueredCityId) {
      const originControllerId = cityOwnership[expeditionOriginId] || 'ronin';
      setCityOwnership(prev => ({
        ...prev,
        [conqueredCityId]: originControllerId
      }));
      setPlayerGold(prev => prev + goldReward);
      if (epicRelic) {
        setPlayerInventory(prev => {
          if (prev.includes(epicRelic)) return prev;
          return [...prev, epicRelic];
        });
      }
      setInteriorLogs(prev => [
        `【关前合战胜利】大军亲自击破攻克敌境 [${CITIES.find(c => c.id === conqueredCityId)?.name || conqueredCityId}] 门阀大捷！缴获犒赏军饷黄金 ${goldReward}，夺取传代宝物 [${epicRelic || '名门铁券'}]！`,
        ...prev
      ]);
    } else {
      const absoluteLoss = Math.abs(goldReward);
      setPlayerGold(prev => Math.max(0, prev - absoluteLoss));
      setInteriorLogs(prev => [
        `【合战攻城折戟】前线突袭受阻引兵撤遁，整军抢修工事折耗抚恤黄金 ${absoluteLoss}。`,
        ...prev
      ]);
    }
    setMapTab('svg-map');
  };

  // Palace Actions
  const handleMobilization = () => {
    if (playerGold < 150) {
      alert("【钱粮不足】官府调配劳役需要 150 黄金！");
      return;
    }
    setPlayerGold(prev => prev - 150);
    setCityStats(prev => {
      const u = { ...prev[selectedCity.id] };
      u.defense = Math.min(100, u.defense + 12);
      return { ...prev, [selectedCity.id]: u };
    });
    setInteriorLogs(prev => [
      `【官府政令】你拨付 150 黄金，重整了 [${selectedCity.name}] 的防备度，提升 12 点。`,
      ...prev
    ]);
  };

  const handleRelievePoverty = () => {
    const currentStats = cityStats[selectedCity.id] || { prosperity: 70, defense: 70, grain: 1000, population: 100000 };
    if (currentStats.grain < 300) {
      alert("【粮仓不足】城中储备粮低于 300 石，无法恩放赈灾！");
      return;
    }
    setCityStats(prev => {
      const u = { ...prev[selectedCity.id] };
      u.grain = Math.max(0, u.grain - 300);
      u.prosperity = Math.min(100, u.prosperity + 8);
      u.population += 6000;
      return { ...prev, [selectedCity.id]: u };
    });
    setInteriorLogs(prev => [
      `【大放军粮】开仓赈济灾民 300 石！[${selectedCity.name}] 繁荣度提升 8%，流民归附使人口增加了 6,000 人。`,
      ...prev
    ]);
  };

  const handleConsultRuler = () => {
    const quotes: Record<string, string> = {
      wei: `【曹操】按剑沉思道：“天下未定，唯才是举。将军巡察此城，务必抚恤将士，操练劲旅，伺机吞并周边郡县！”`,
      shu: `【刘备】执手感叹道：“汉室倾颓，备虽庸碌愿与将军同生共死。此间百姓深受战乱之苦，休养生息方能民心所向。”`,
      wu: `【孙权】倚案睥睨：“孤据江东三世，水师天下第一！将军为我镇防此地，长江之险便多一分屏障！”`,
      yuanshao: `【袁绍】端坐自傲：“孤身世显赫，诸郡莫不响应。将军守城，合该大张旗鼓，树我豪门军威！”`,
      ronin: `【中立隐士】叹曰：“龙潜深渊，虎啸林莽。此地暂无强权相制，将军若有用世之心，当多结英豪以固社稷。”`
    };
    const text = quotes[selectedCityControllerId] || quotes.ronin;
    alert(text);
    setInteriorLogs(prev => [
      `【晋面求计】虚心拜访。老臣告诫：${text.slice(0, 48)}...`,
      ...prev
    ]);
  };

  // Market Actions
  const handleInvestCommerce = () => {
    if (playerGold < 100) {
      alert("【黄金不足】商业投资起步需 100 黄金！");
      return;
    }
    setPlayerGold(prev => prev - 100);
    setCityStats(prev => {
      const u = { ...prev[selectedCity.id] };
      u.prosperity = Math.min(100, u.prosperity + 10);
      u.grain += 500;
      return { ...prev, [selectedCity.id]: u };
    });
    setInteriorLogs(prev => [
      `【招商兴市】拨付 100 黄金开创通商，繁荣度增加 10%，仓备岁入增加 500 石！`,
      ...prev
    ]);
  };

  const handleBuyGrain = () => {
    if (playerGold < 120) {
      alert("【黄金不足】商肆大宗屯粮需要 120 黄金！");
      return;
    }
    setPlayerGold(prev => prev - 120);
    setCityStats(prev => {
      const u = { ...prev[selectedCity.id] };
      u.grain += 800;
      return { ...prev, [selectedCity.id]: u };
    });
    setInteriorLogs(prev => [
      `【市榷平粜】你斥资 120 黄金向市贾购粮 800 石充盈粮库！`,
      ...prev
    ]);
  };

  const handleBuyTreasure = (item: typeof MARKET_ITEMS[0]) => {
    if (playerGold < item.cost) {
      alert(`【黄金不足】购置珍珑 [${item.name}] 尚差 ${item.cost - playerGold} 黄金！`);
      return;
    }
    if (playerInventory.includes(item.name)) {
      alert("【传世瑰宝】你已身怀此传家异宝，不可贪心兼得！");
      return;
    }
    setPlayerGold(prev => prev - item.cost);
    setPlayerInventory(prev => [...prev, item.name]);
    setInteriorLogs(prev => [
      `【购置重宝】你以 ${item.cost} 黄金购得重宝 【${item.name}】！(${item.bonus})`,
      ...prev
    ]);
  };

  // Tavern Actions
  const handleScoutGenerals = () => {
    const pool = [
      { name: '赵云 (子龙)', quote: '“云参拜！愿随将军驱驰乱世，龙胆亮银枪下决不教宵小逞凶！”' },
      { name: '徐庶 (元直)', quote: '“元直虽驽钝，亦愿为将军剖析奇正，运筹帷幄之中。”' },
      { name: '貂蝉 (玉婵)', quote: '“妾身抚筝高歌一曲，且为将军扫却终日戎马之急操疲累。”' },
      { name: '司马懿 (仲达)', quote: '“成大事者当不拘小节。将军若有远虑，需明辨时势，隐忍蓄力。”' },
      { name: '郭嘉 (奉孝)', quote: '“酒中自有名将策。将军巡视至此，此饮痛快！十胜之论定矣！”' }
    ];
    const rolled = pool[Math.floor(Math.random() * pool.length)];
    alert(`【斗酒偶遇】你与客席下的名士【${rolled.name}】把盏畅谈！\n\n${rolled.quote}`);
    setInteriorLogs(prev => [
      `【酒馆探贤】你在喧闹声中，结纳了当世奇才【${rolled.name}】。`,
      ...prev
    ]);
  };

  const handleListenRumors = () => {
    const rumors = [
      "【传闻】关云长在荆州督造艨艟水车，水军声势震天，隐有顺江东下或北伐樊城之迹象！",
      "【客官说】袁绍在邺城重振高坛，广征河北十万丁民屯修高大壁垒，守防固若金汤。",
      "【行商传】曹公为迎天子，将许昌四周大片沃野划归军民屯田，仓廪之富居九州之冠！",
      "【斥候信】汉中张鲁广设汉中五斗米教，民心归化，各部将卒皆受道印，城邦意志高昂。"
    ];
    const r = rumors[Math.floor(Math.random() * rumors.length)];
    alert(r);
    setInteriorLogs(prev => [
      `【酒馆传报】打探得四方秘史：${r}`,
      ...prev
    ]);
  };

  const handleRollDice = (opponentName: string) => {
    const dice1 = [1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)];
    const dice2 = [1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)];
    const sum1 = dice1.reduce((a, b) => a + b, 0);
    const sum2 = dice2.reduce((a, b) => a + b, 0);
    
    let outcome: 'win' | 'loss' | 'draw' = 'draw';
    let msg = '';
    let goldDiff = 0;
    
    if (sum1 > sum2) {
      outcome = 'win';
      goldDiff = 150;
      msg = `🎉 对博大胜！ 你掷得 [${dice1.join(', ')}] 共 ${sum1} 点 ＞ 对手掷得 [${dice2.join(', ')}] 共 ${sum2} 点！\n\n【${opponentName}】叹服举杯：“不愧是将军，豪气干云！这斗酒的金资老夫愿赌服输，双手奉上！” 你赢建立了 150 黄金。`;
    } else if (sum1 < sum2) {
      outcome = 'loss';
      goldDiff = -100;
      msg = `💀 技差一筹！ 你掷得 [${dice1.join(', ')}] 共 ${sum1} 点 ＜ 对手掷得 [${dice2.join(', ')}] 共 ${sum2} 点！\n\n【${opponentName}】长笑拍案：“痛快！美酒千杯，此番老夫可就不客气笑纳了！” 你输掉了 100 黄金。`;
    } else {
      outcome = 'draw';
      msg = `🤝 奇虎相当！ 你们皆掷得 ${sum1} 点。彼此大笑拍肩，约定不分输赢，斗酒再满一巡！`;
    }

    setPlayerGold(prev => Math.max(0, prev + goldDiff));
    setDiceGameResult({
      playerRolls: dice1,
      opponentRolls: dice2,
      playerSum: sum1,
      opponentSum: sum2,
      outcome,
      message: msg
    });

    setInteriorLogs(prev => [
      `【酒友博博】同武侯将官对桌博博。骰点数: ${sum1} vs ${sum2}，成果为 ${outcome === 'win' ? '捷' : outcome === 'loss' ? '负' : '平'}。`,
      ...prev
    ]);
  };

  // Barracks Actions
  const handleTroopDrill = () => {
    setCityStats(prev => {
      const u = { ...prev[selectedCity.id] };
      u.defense = Math.min(100, u.defense + 5);
      return { ...prev, [selectedCity.id]: u };
    });
    setInteriorLogs(prev => [
      `【沙场操演】你亲登帅台指挥校演。 [${selectedCity.name}] 的军马士卒声势合一，城防固守指数上升 5%。`,
      ...prev
    ]);
  };

  const handleRecruitSpecialRegiment = (regName: string, regCost: number) => {
    if (playerGold < regCost) {
      alert(`【黄金不足】招纳 elite [${regName}] 精兵尚差 ${regCost - playerGold} 黄金！`);
      return;
    }
    setPlayerGold(prev => prev - regCost);
    setCityStats(prev => {
      const u = { ...prev[selectedCity.id] };
      u.population += 8000;
      u.defense = Math.min(100, u.defense + 8);
      return { ...prev, [selectedCity.id]: u };
    });
    setInteriorLogs(prev => [
      `【虎将召选】你拔付 ${regCost} 黄金大举募得了精兵王牌 【${regName}】 8,000 精卒归统！城池防务暴增 8点。`,
      ...prev
    ]);
  };

  // Guard Gates Actions
  const handleToggleBeacon = () => {
    setCityStats(prev => {
      const u = { ...prev[selectedCity.id] };
      u.defense = Math.min(100, u.defense + 7);
      return { ...prev, [selectedCity.id]: u };
    });
    setInteriorLogs(prev => [
      `【登台戒备】你燃点长空烽火角台，全城披甲负盾警戒。[${selectedCity.name}] 临界防御上调 7 点。`,
      ...prev
    ]);
  };

  const handleEmbarkConquest = () => {
    setExpeditionOriginId(selectedCity.id);
    setMapTab('svg-map');
    // Scroll smoothly to war table
    setTimeout(() => {
      const consoleView = document.getElementById('battle-simulator-header');
      if (consoleView) {
        consoleView.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  // Launch Battle/Expedition Expedition Playback
  const handleLaunchExpedition = (e: React.FormEvent) => {
    e.preventDefault();
    if (expeditionOriginId === expeditionTargetId) {
      alert('请选择不同的起源地与目的地，大军无法在同地远征调配！');
      return;
    }

    const originCity = CITIES.find(c => c.id === expeditionOriginId)!;
    const targetCity = CITIES.find(c => c.id === expeditionTargetId)!;
    const originFaction = FACTIONS.find(f => f.id === originControllerId)!;
    const targetControllerId = cityOwnership[expeditionTargetId] || 'ronin';
    const targetFaction = FACTIONS.find(f => f.id === targetControllerId)!;
    
    const commandingGeneral = officers.find(o => o.id === selectedGeneralId);
    const genName = commandingGeneral ? commandingGeneral.name : '自立豪杰 (大将)';
    const genLdr = commandingGeneral ? commandingGeneral.stats.leadership : 75;
    const genFor = commandingGeneral ? commandingGeneral.stats.force : 75;
    const genInt = commandingGeneral ? commandingGeneral.stats.intelligence : 70;

    setIsExpeditionRunning(true);
    setExpeditionLogs([]);
    setExpeditionStep(0);
    if (soundEnabled) {
      playDrumSound();
    }

    const isSiege = originControllerId !== targetControllerId;
    let siegeWin = true;
    let rate = 100;

    if (isSiege) {
      // Base Power calculated by attributes
      let power = (genLdr * 0.4 + genInt * 0.3 + genFor * 0.3);
      
      // Integrate Climate modifiers
      if (weatherId === 'rainy') {
        // Rainy reduces defense and fire potency, penalizing siege rate due to mud
        power -= 12;
      } else if (weatherId === 'foggy') {
        // Foggy weather makes intelligence 2x more important, while raw mechanical force is less reliable
        power = (genLdr * 0.3 + genInt * 0.6 + genFor * 0.1);
        if (genInt < 70) {
          power -= 15; // Penalty for low IQ commanders getting ambushed
        } else if (genInt >= 88) {
          power += 15; // Bonus for strategic masters utilizing fog
        }
      } else if (weatherId === 'windy') {
        // windy weather adds chaotic shift
        power += (Math.random() >= 0.5 ? 8 : -8);
      }

      // Independent/Ronin cities are easier to siege (dif = 55), owned factions cities are tougher (dif = 82)
      const defenseDifficulty = targetControllerId === 'ronin' ? 55 : 82;
      rate = Math.min(Math.max(Math.round((power / (power + defenseDifficulty)) * 100), 10), 95);
      
      // Specific adjustments based on weather
      if (weatherId === 'rainy') {
        rate = Math.max(10, rate - 10);
      } else if (weatherId === 'foggy' && genInt < 75) {
        rate = Math.max(8, rate - 12);
      }
      
      setExpeditionSuccessRate(rate);

      const roll = Math.random() * 100;
      siegeWin = roll <= rate;
    } else {
      setExpeditionSuccessRate(100);
    }

    // Step-by-Step Simulated Playback timeouts
    // 1. Stage 0: 安营拔寨 (Departure)
    const weatherSlogans: Record<string, string> = {
      sunny: '☀️ 晴空丽日下旗帜招展',
      rainy: '🌧️ 苦雨凄风拍打着军盔',
      windy: '💨 怒号金风撕扯着烈色军旗',
      foggy: '🌫️ 苍迷白雾深锁着三军大营'
    };
    setExpeditionLogs([`【中军帐点兵】 （${weatherSlogans[weatherId] || '☀️'}） 八万大军浩荡誓师，校阅点兵！`]);
    
    setTimeout(() => {
      setExpeditionStep(1);
      let weatherMarchMod = '';
      if (weatherId === 'rainy') {
        weatherMarchMod = `道路如沼中乱泥，战马及攻城车行进受阻，辎重拉运极度沉重迟缓。`;
      } else if (weatherId === 'foggy') {
        weatherMarchMod = `茫茫大雾吞噬了前哨退路，百步不见深谷，将士点起长明火，沿栈壁小心探路。`;
      } else if (weatherId === 'windy') {
        weatherMarchMod = `狂沙迎面，强风卷树，战马因啸响而受惊狂吟，大军不得不抱紧袍襟破风挺进。`;
      } else {
        weatherMarchMod = `天清气爽，四野视野极佳，粮道畅通无阻，士卒精气神旺盛至极。`;
      }
      const startLog = `⚔️ 【大军启程】: 领军大将 [${genName}] (统帅 ${genLdr}，武力 ${genFor}) 挂帅征伐 [${targetCity.name}]。${weatherMarchMod}大军直奔目标郡隘！`;
      setExpeditionLogs(prev => [...prev, startLog]);
    }, 1000);

    // 2. Stage 1: 险关行军 (Marching)
    setTimeout(() => {
      setExpeditionStep(2);
      let marchLog = '';
      if (weatherId === 'foggy' && genInt >= 82) {
        marchLog = `👁️ 【重雾玄兵计】: 将军 [${genName}] 借着当空大雾屏障，巧布瞒天疑兵阵法，无声无息越过边郡关隘，已如神兵下降，抄到了 [${targetCity.name}] 防线后侧！`;
      } else if (weatherId === 'rainy' && genLdr >= 80) {
        marchLog = `🌧️ 【借水飞渡】: 暴雨使河域骤涨，大将 [${genName}] 果断变通，弃车换乘快舸竹筏顺流直下，反以惊人速度在水势咆哮中逼近敌前！`;
      } else if (genLdr > 85) {
        marchLog = `🏔️ 【兵贵神速】: 领军将领英明强干，深谙地形攻守。大军以不可思议之行军速度，穿林度河，长驱直入。士气如虹 (+15)！`;
      } else if (genInt > 80) {
        marchLog = `👁️ 【暗度陈仓】: 军师布下瞒天妙计。巧设疑兵掩护主力，成功避开了敌方边境哨卡的刺探窥伺。辎重毫无折损！`;
      } else {
        marchLog = `🌲 【翻山越岭】: 关山万重，行军栈道凶险无比。军士冒着 ${weatherId === 'windy' ? '逆风' : weatherId === 'rainy' ? '狂雨' : '烈阳'} 克服险阻，终于成功集结并安下营垒。`;
      }
      setExpeditionLogs(prev => [...prev, marchLog]);
    }, 2800);

    // 3. Stage 2: 激战 / 会师 (Siege Clash or Merger)
    setTimeout(() => {
      setExpeditionStep(3);
      let clashLog = '';
      if (isSiege) {
        if (weatherId === 'rainy') {
          clashLog = `💦 【雨中白刃死斗】: 暴雨如瀑，水势滔天！因暴雨将火药、柴草彻底淋湿，[${genName}] 麾下极擅的【烈焰火箭】等火攻神策遭严格禁绝！敌守将无法施火，双方直接在泥泞中展开野蛮血腥的短兵白刃战！`;
        } else if (weatherId === 'foggy') {
          clashLog = `🌫️ 【重雾盲击战】: 四野白茫茫一片，两军在重雾中短兵交接，弓弩在浓雾中难以瞄准、齐射受阻！三军只闻厮杀声震原野，[${genName}] 率部施展夜袭突击之法直插敌军中军！`;
        } else if (weatherId === 'windy') {
          clashLog = `🔥 【狂风烈焰借势】: 逆风盘行使攻城极为艰难，但 [${genName}] 巧断风向，顺风投掷火油火箭！暴烈的风势瞬间将大火送入 [${targetCity.name}] 城关！火海燎原，敌军防线在一片哀嚎中崩溃！`;
        } else {
          clashLog = `💥 【惨烈搏杀】: 两军相搏于 [${targetCity.name}] 城下！攻守战激烈异常，箭雨蔽日！[${genName}] 麾下施展齐射与冲撞，阵斩对方十数员虎校，城脚血流漂橹！`;
        }
        if (soundEnabled) {
          playClashSound();
        }
      } else {
        clashLog = `🤝 【兵合一处】: 军民同欢！大兵团顺利开进同盟郡 [${targetCity.name}]。守将开城迎客犒赏三军，于${weatherId === 'rainy' ? '暴雨淋漓' : weatherId === 'foggy' ? '漫天大雾' : weatherId === 'windy' ? '呼啸狂风' : '大好晴日'}中完成会师。`;
      }
      setExpeditionLogs(prev => [...prev, clashLog]);
    }, 4600);

    // 4. Stage 3: 凯旋战报 (Conquest Outcome)
    setTimeout(() => {
      setExpeditionStep(4);
      let finalLog = '';
      if (isSiege) {
        if (siegeWin) {
          if (weatherId === 'rainy') {
            finalLog = `🏆 【骤雨破城大捷】: 攻克凯旋！暴雨汇成洪流，彻底冲塌了 [${targetCity.name}] 久疏防范的外围沙堤。大将 [${genName}] 乘势破门，[${targetFaction.name}] 溃败，治权易帜为 【${originFaction.name}】！`;
          } else if (weatherId === 'foggy') {
            finalLog = `🏆 【雾隐收网奇捷】: 雷霆攻克！借助幽灵白雾打乱城上哨防，我军敢死营乘雾缒绳攀上女墙夺下关门，大举克捷，【${originFaction.name}】 旌旗傲然插上 [${targetCity.name}]！`;
          } else if (weatherId === 'windy') {
            finalLog = `🏆 【天风红莲狂捷】: 浴火大捷！狂风掀开了一切掩护，大火烧毁了敌军的大理石箭塔及守备中枢。大举易帜为 【${originFaction.name}】！`;
          } else {
            finalLog = `🏆 【大获全胜】: 破门易帜！城主府陷落，[${targetFaction.name}] 旌旗大倒。[${targetCity.name}] 的城池治权正式收归 【${originFaction.name}】 麾下，名垂战史！`;
          }
          // Dynamically rewrite local state city value
          setCityOwnership(prev => ({
            ...prev,
            [expeditionTargetId]: originControllerId
          }));
        } else {
          if (weatherId === 'rainy') {
            finalLog = `❌ 【退溃泥沼】: 残念！大雨将攻城重锤彻底陷在淤泥，粮秣淋湿霉烂，攻坚受严重气象惩罚，[${genName}] 因伤亡难支被迫在茫茫大雨中无奈撤师退防。`;
          } else if (weatherId === 'foggy') {
            finalLog = `❌ 【雾中中伏受阻】: 抱憾折兵！浓雾使我方失去了探路的眼睛，不幸误中敌军在此布好的石桩地雷奇阵，[${genName}] 前部死伤累累，只得连夜狼狈退师。`;
          } else {
            finalLog = `❌ 【功城功亏一篑】: 折戟沉沙！[${targetCity.name}] 守备固若金汤，[${genName}] 攻势被城头礌石滚木挫裂，死伤惨重，不得不鸣金收拢残骸，抱憾退兵。`;
          }
        }
      } else {
        finalLog = `⭐ 【天师同德】: 战略调派与防线互联完美达成！郡郭城池大胜合流，江山千秋固若金汤。`;
      }
      setExpeditionLogs(prev => [...prev, finalLog]);
    }, 6200);

  };

  const handleResetMap = () => {
    setCityOwnership(getScenarioDefaultOwnership(selectedScenario.id));
    setExpeditionLogs([]);
    setExpeditionStep(-1);
    setIsExpeditionRunning(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top instruction message */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-sm font-serif font-bold text-slate-200 flex items-center gap-1.5">
            <Compass size={14} className="text-amber-500" />
            三国志 8
          </h2>
          <p className="text-[11px] text-slate-400">
            点击地图上的城池标记以查看镇守名将之首领及兵团。您还可以直接手动篡改势力归属，并模拟兵力调配与跨郡攻城决战。
          </p>
        </div>
        <button
          id="btn-reset-map"
          onClick={handleResetMap}
          className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-amber-500 text-[11px] font-mono font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-all flex items-center gap-1"
        >
          <RefreshCw size={11} />
          重置并回归剧本初始疆域
        </button>
      </div>

      {/* Dynamic Tab Switcher for Sandtable Map VS City Inside VS All Cities Overview */}
      <div className="flex flex-wrap border-b border-slate-900 pb-2.5 gap-2">
        <button
          id="tab-map-svg"
          type="button"
          onClick={() => setMapTab('svg-map')}
          className={`px-4 py-2 rounded-xl text-xs font-serif font-black tracking-wider transition-all inline-flex items-center gap-2 cursor-pointer ${
            mapTab === 'svg-map'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10'
              : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-900 hover:border-slate-800'
          }`}
        >
          <Compass size={13.5} />
          沙盘交互式战略地图
        </button>
        <button
          id="tab-map-city-view"
          type="button"
          onClick={() => setMapTab('city-view')}
          className={`px-4 py-2 rounded-xl text-xs font-serif font-black tracking-wider transition-all inline-flex items-center gap-2 cursor-pointer ${
            mapTab === 'city-view'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/10'
              : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-900 hover:border-slate-800'
          }`}
        >
          <Home size={13.5} />
          城防郡县内景 ({selectedCity.name})
        </button>
        <button
          id="tab-map-cities"
          type="button"
          onClick={() => setMapTab('cities-all')}
          className={`px-4 py-2 rounded-xl text-xs font-serif font-black tracking-wider transition-all inline-flex items-center gap-2 cursor-pointer ${
            mapTab === 'cities-all'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10'
              : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-900 hover:border-slate-800'
          }`}
        >
          <Layers size={13.5} />
          全域二十六城邑总览
        </button>
        <button
          id="tab-map-war-mode"
          type="button"
          onClick={() => setMapTab('war-mode')}
          className={`px-4 py-2 rounded-xl text-xs font-serif font-black tracking-wider transition-all inline-flex items-center gap-2 cursor-pointer ${
            mapTab === 'war-mode'
              ? 'bg-rose-550 text-slate-950 font-black shadow-md shadow-rose-550/15 border border-rose-450'
              : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-900 hover:border-slate-800'
          }`}
        >
          <Sword size={13.5} className={mapTab === 'war-mode' ? 'text-slate-950' : 'text-rose-500'} />
          <span>⚔️ 城防会战实演</span>
        </button>
      </div>

      {mapTab === 'svg-map' ? (
        <div className="space-y-4">
          
          {/* Weather Controller Panel */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between z-10 relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center text-xl shadow-inner select-none shrink-0">
                {WEATHERS.find(w => w.id === weatherId)?.icon}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-serif font-bold text-slate-200 flex items-center gap-2">
                  天盘天气气象控制：
                  <span className={`px-2 py-0.5 text-[10px] rounded-md font-bold font-mono border ${WEATHERS.find(w => w.id === weatherId)?.colorClass}`}>
                    {WEATHERS.find(w => w.id === weatherId)?.nameCn}
                  </span>
                </h4>
                <p className="text-[10.5px] text-slate-400 font-sans leading-normal">
                  {WEATHERS.find(w => w.id === weatherId)?.modDesc}
                </p>
              </div>
            </div>

            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 gap-1 self-stretch md:self-auto shrink-0 shadow-lg justify-between">
              {WEATHERS.map(w => {
                const active = weatherId === w.id;
                return (
                  <button
                    key={w.id}
                    id={`btn-weather-${w.id}`}
                    type="button"
                    onClick={() => setWeatherId(w.id)}
                    className={`flex-1 md:flex-initial py-1.5 px-3 rounded-lg font-serif font-black flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer ${
                      active
                        ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold active:scale-95'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 active:scale-98'
                    }`}
                  >
                    <span className="text-sm shrink-0">{w.icon}</span>
                    <span className="text-[11px] uppercase tracking-wide font-black">{w.nameCn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theater View Filter Bar */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 flex flex-wrap items-center justify-between gap-2 z-10 relative">
            <div className="flex items-center gap-2 overflow-x-auto py-0.5 max-w-full">
              <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-wider shrink-0 flex items-center gap-1 pl-1">
                <Compass size={12} /> 亚洲战区聚焦:
              </span>
              {ASIA_THEATERS.map(th => {
                const isActive = selectedTheater === th.id;
                const count = th.id === 'all' ? CITIES.length : CITIES.filter(c => c.theater === th.id).length;
                return (
                  <button
                    key={th.id}
                    id={`btn-theater-${th.id}`}
                    type="button"
                    onClick={() => setSelectedTheater(th.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10.5px] font-serif font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      isActive 
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black shadow-amber-500/10' 
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
                    }`}
                    title={th.desc}
                  >
                    <span>{th.icon}</span>
                    <span>{th.name}</span>
                    <span className={`text-[9px] font-mono px-1 py-0.2 rounded ${isActive ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-950 text-slate-500'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick map options toolbar */}
            <div className="flex items-center gap-1.5 shrink-0 ml-auto">
              <button
                type="button"
                id="toggle-190-border"
                onClick={() => setShow190Border(p => !p)}
                className={`px-2 py-1 rounded text-[9.5px] font-serif font-bold cursor-pointer transition-all border flex items-center gap-1 ${
                  show190Border 
                    ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 shadow-sm shadow-rose-500/5' 
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-350'
                }`}
                title="切换公元190年汉朝与亚洲边陲古国疆域国界"
              >
                <Compass size={9.5} className={show190Border ? 'text-rose-400' : ''} />
                汉境国界
              </button>

              <button
                type="button"
                id="toggle-trade-routes"
                onClick={() => setShowTradeRoutes(p => !p)}
                className={`px-2 py-1 rounded text-[9.5px] font-serif font-bold cursor-pointer transition-all border flex items-center gap-1 ${
                  showTradeRoutes 
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-sm shadow-amber-500/5' 
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-350'
                }`}
                title="切换陆上海上丝绸之路商队贸易航线"
              >
                <span>🐪</span>
                丝路航线
              </button>

              <button
                type="button"
                id="toggle-topography"
                onClick={() => setShowTopography(p => !p)}
                className={`px-2 py-1 rounded text-[9.5px] font-serif font-bold cursor-pointer transition-all border flex items-center gap-1 ${
                  showTopography 
                    ? 'bg-sky-500/15 text-sky-300 border-sky-500/30 shadow-sm shadow-sky-500/5' 
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-350'
                }`}
                title="切换喜马拉雅山脉、天山、大漠瀚海与各大水系地貌"
              >
                <span>🏔️</span>
                山川地貌
              </button>

              <button
                type="button"
                id="toggle-wide-view"
                onClick={() => setIsWideView(p => !p)}
                className={`px-2 py-1 rounded text-[9.5px] font-serif font-bold cursor-pointer transition-all border flex items-center gap-1 ${
                  isWideView 
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-350'
                }`}
                title="切换全屏宽幅亚洲战区推演沙盘"
              >
                <Layers size={9.5} />
                {isWideView ? '收起宽屏' : '全景宽屏'}
              </button>
            </div>
          </div>

          <div className={`grid grid-cols-1 ${isWideView ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-6`}>
          
          {/* SVG Interactive Map */}
          <div className={`${isWideView ? 'w-full' : 'lg:col-span-8'} bg-slate-950 p-4 rounded-2xl border border-slate-900 flex flex-col justify-between relative overflow-hidden min-h-[460px]`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 z-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1">
                  <Flag size={10} className="text-amber-500 animate-pulse" />
                  Tactical Campaign Sandtable Map of Whole Asia (全亚洲大舆图)
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-850">
                  {ASIA_THEATERS.find(t => t.id === selectedTheater)?.title}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {FACTIONS.filter(f => f.id !== 'ronin').map(f => (
                  <div key={f.id} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }} />
                    <span className="text-[9px] text-slate-400 font-sans font-medium">{f.name.slice(0, 2)}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  <span className="text-[9px] text-slate-500 font-sans">异邦/中立</span>
                </div>
              </div>
            </div>

            {/* Interactive SVG Canvas */}
            <div className="relative w-full aspect-[50/31] bg-[#020617] rounded-xl border border-slate-900 overflow-hidden select-none">
              
              {/* Ambient map grid and continental vector geometry */}
              <svg className="absolute inset-0 w-full h-full text-slate-900 pointer-events-none" viewBox="0 0 1000 620" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* Grid */}
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.25" />
                  </pattern>

                  {/* Ocean Gradient */}
                  <radialGradient id="oceanGrad" cx="60%" cy="50%" r="70%">
                    <stop offset="0%" stopColor="#051026" />
                    <stop offset="50%" stopColor="#030717" />
                    <stop offset="100%" stopColor="#01030a" />
                  </radialGradient>

                  {/* Landmass Gradient */}
                  <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0a1527" />
                    <stop offset="45%" stopColor="#0c182c" />
                    <stop offset="80%" stopColor="#0b172a" />
                    <stop offset="100%" stopColor="#070f1e" />
                  </linearGradient>

                  {/* River Gradients */}
                  <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
                  </linearGradient>

                  {/* Desert Stipple Pattern */}
                  <pattern id="desertPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="5" cy="5" r="0.75" fill="#ca8a04" opacity="0.25" />
                    <circle cx="15" cy="15" r="0.75" fill="#eab308" opacity="0.2" />
                    <circle cx="12" cy="6" r="0.6" fill="#a16207" opacity="0.15" />
                  </pattern>

                  {/* Mountain Gradient */}
                  <linearGradient id="snowPeakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.65" />
                    <stop offset="40%" stopColor="#cbd5e1" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#334155" stopOpacity="0.1" />
                  </linearGradient>
                  
                  {/* Glowing Imperial Territory Fill of Han Dynasty */}
                  <radialGradient id="territoryGlow" cx="60%" cy="52%" r="40%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.18" />
                    <stop offset="70%" stopColor="#eab308" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity="0.01" />
                  </radialGradient>
                  
                  {/* Glow filter for boundary lines */}
                  <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Ocean Background */}
                <rect width="100%" height="100%" fill="url(#oceanGrad)" />
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Asian Continental Silhouette Landmass */}
                <path 
                  d="M 40 40 L 960 40 Q 950 80 920 120 L 870 150 L 840 180 Q 820 190 800 210 Q 770 230 740 220 Q 760 250 790 260 L 800 250 Q 825 290 835 360 Q 815 370 795 330 L 780 270 Q 740 290 710 310 Q 735 340 750 350 Q 760 390 740 410 Q 730 460 690 490 Q 640 500 620 515 Q 590 480 560 495 Q 565 530 590 560 Q 610 600 580 615 Q 550 590 540 570 Q 530 590 520 620 Q 480 540 440 480 Q 410 440 370 460 Q 350 520 300 590 Q 250 540 220 470 Q 180 440 140 410 Q 90 390 70 340 Q 50 290 40 220 Z" 
                  fill="url(#landGrad)" 
                  stroke="#1e293b" 
                  strokeWidth="1.2" 
                />

                {/* Japanese Archipelago (Honshu, Hokkaido, Kyushu/Shikoku) */}
                <g id="japan-archipelago" className="opacity-90">
                  {/* Hokkaido */}
                  <path d="M 915 105 Q 945 95 955 125 Q 925 145 915 105 Z" fill="#0c1a2f" stroke="#334155" strokeWidth="1" />
                  {/* Honshu */}
                  <path d="M 875 165 Q 925 180 960 215 Q 935 265 895 245 Q 875 205 875 165 Z" fill="#0c1a2f" stroke="#334155" strokeWidth="1" />
                  {/* Kyushu & Shikoku */}
                  <path d="M 865 255 Q 890 245 880 285 Q 850 280 865 255 Z" fill="#0c1a2f" stroke="#334155" strokeWidth="1" />
                </g>

                {/* Offshore Islands */}
                {/* Taiwan (夷州) */}
                <path d="M 765 445 Q 778 475 770 505 Q 755 475 765 445 Z" fill="#0c1a2f" stroke="#334155" strokeWidth="0.8" />
                <text x="778" y="480" fill="#64748b" className="text-[7.5px] font-mono">夷州</text>

                {/* Hainan (朱崖洲) */}
                <path d="M 615 515 Q 630 530 620 545 Q 605 535 615 515 Z" fill="#0c1a2f" stroke="#334155" strokeWidth="0.8" />
                <text x="632" y="535" fill="#64748b" className="text-[7.5px] font-mono">朱崖洲</text>

                {/* Sri Lanka (天竺狮子国) */}
                <path d="M 315 575 Q 325 585 320 595 Q 310 590 315 575 Z" fill="#0c1a2f" stroke="#334155" strokeWidth="0.8" />

                {/* Topography Layer: Mountains, Deserts, Lakes, Rivers */}
                {showTopography && (
                  <g id="topography-layer" className="transition-opacity duration-300">
                    {/* Lake Baikal (北海 / 贝加尔湖) */}
                    <path 
                      d="M 580 85 Q 610 55 620 85 Q 600 115 580 85 Z" 
                      fill="#0284c7" 
                      opacity="0.5" 
                      stroke="#38bdf8" 
                      strokeWidth="1" 
                    />
                    <text x="590" y="75" fill="#38bdf8" className="text-[8.5px] font-serif font-bold italic opacity-75">北海 (贝加尔湖)</text>

                    {/* Taklamakan Desert / Gobi Sand dune texture */}
                    <ellipse cx="270" cy="235" rx="90" ry="35" fill="url(#desertPattern)" stroke="#a16207" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.7" />
                    <text x="270" y="240" fill="#ca8a04" className="text-[8.5px] font-serif italic opacity-60 text-center" textAnchor="middle">塔克拉玛干瀚海大漠</text>

                    {/* Mongolian Gobi Desert */}
                    <ellipse cx="560" cy="140" rx="95" ry="25" fill="url(#desertPattern)" stroke="#a16207" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.6" />
                    <text x="560" y="145" fill="#ca8a04" className="text-[8.5px] font-serif italic opacity-55 text-center" textAnchor="middle">瀚海大漠 (Gobi)</text>

                    {/* Himalayas & Tibetan Plateau (青藏高原 / 喜马拉雅雪脉) */}
                    <polygon 
                      points="190,320 280,305 385,355 415,425 365,455 265,435 200,375" 
                      fill="#0e1e36" 
                      stroke="#334155" 
                      strokeWidth="1.2" 
                    />
                    {/* Stylized snow-capped ridges */}
                    <path 
                      d="M 210 365 L 240 335 L 270 355 L 310 325 L 350 350 L 380 340 L 405 380 L 370 410 L 330 385 L 290 415 L 250 395 Z" 
                      fill="url(#snowPeakGrad)" 
                      stroke="#cbd5e1" 
                      strokeWidth="0.8" 
                      opacity="0.85" 
                    />
                    <text x="290" y="375" fill="#e2e8f0" className="text-[9px] font-serif font-bold tracking-wider opacity-85 text-center" textAnchor="middle">喜马拉雅雪峰・世界屋脊</text>

                    {/* Tianshan Range (天山山脉 - North of Tarim Basin) */}
                    <path 
                      d="M 140 215 Q 210 205 280 225 T 360 235" 
                      fill="none" 
                      stroke="#475569" 
                      strokeWidth="2" 
                      strokeDasharray="4 3" 
                      opacity="0.65" 
                    />
                    <text x="180" y="210" fill="#94a3b8" className="text-[7.5px] font-mono opacity-65">天山山脉 (Tianshan)</text>

                    {/* Kunlun Range (昆仑山脉 - South of Tarim Basin) */}
                    <path 
                      d="M 160 285 Q 240 280 320 290 T 400 305" 
                      fill="none" 
                      stroke="#475569" 
                      strokeWidth="2" 
                      strokeDasharray="4 3" 
                      opacity="0.65" 
                    />
                    <text x="210" y="280" fill="#94a3b8" className="text-[7.5px] font-mono opacity-65">昆仑山脉 (Kunlun Mts.)</text>

                    {/* Qinling Range (秦岭) */}
                    <path 
                      d="M 440 325 Q 480 340 520 330 T 560 335" 
                      fill="none" 
                      stroke="#475569" 
                      strokeWidth="2" 
                      strokeDasharray="3 3" 
                      opacity="0.6" 
                    />
                    <text x="490" y="325" fill="#94a3b8" className="text-[7.5px] font-mono opacity-60">秦岭天堑 (Qinling)</text>

                    {/* Yinshan Range (阴山 - Steppe Border) */}
                    <path 
                      d="M 480 185 Q 560 175 650 190" 
                      fill="none" 
                      stroke="#475569" 
                      strokeWidth="2" 
                      strokeDasharray="4 3" 
                      opacity="0.55" 
                    />
                    <text x="540" y="175" fill="#94a3b8" className="text-[7.5px] font-mono opacity-60">阴山古道 (Yinshan)</text>

                    {/* Major Asian River Systems */}
                    {/* Yellow River 黄河 (Ordos Loop) */}
                    <path 
                      d="M 430 310 Q 480 240 540 220 T 570 250 T 530 300 T 630 270 T 710 255" 
                      fill="none" 
                      stroke="url(#riverGradient)" 
                      strokeWidth="4" 
                      strokeLinecap="round" 
                      opacity="0.75" 
                    />
                    <text x="590" y="245" fill="#38bdf8" className="text-[9px] font-serif font-black italic opacity-60">黄河 (Yellow River)</text>

                    {/* Yangtze River 长江 */}
                    <path 
                      d="M 420 380 Q 465 390 490 355 T 575 365 T 670 350 T 740 335" 
                      fill="none" 
                      stroke="url(#riverGradient)" 
                      strokeWidth="4.2" 
                      strokeLinecap="round" 
                      opacity="0.75" 
                    />
                    <text x="590" y="380" fill="#38bdf8" className="text-[9px] font-serif font-black italic opacity-60">长江天堑 (Yangtze River)</text>

                    {/* Mekong River (澜沧江 / 湄公河) */}
                    <path 
                      d="M 450 420 Q 470 470 520 520 T 575 580" 
                      fill="none" 
                      stroke="url(#riverGradient)" 
                      strokeWidth="3.2" 
                      strokeLinecap="round" 
                      opacity="0.65" 
                    />
                    <text x="490" y="500" fill="#38bdf8" className="text-[8px] font-serif italic opacity-55">澜沧江/湄公河</text>

                    {/* Ganges River (恒河) */}
                    <path 
                      d="M 280 370 Q 340 400 390 440" 
                      fill="none" 
                      stroke="url(#riverGradient)" 
                      strokeWidth="2.8" 
                      strokeLinecap="round" 
                      opacity="0.5" 
                    />
                    <text x="320" y="415" fill="#38bdf8" className="text-[7.5px] font-serif italic opacity-45">恒河 (Ganges)</text>

                    {/* Indus River (印度河) */}
                    <path 
                      d="M 210 330 Q 190 390 170 430" 
                      fill="none" 
                      stroke="url(#riverGradient)" 
                      strokeWidth="2.8" 
                      strokeLinecap="round" 
                      opacity="0.5" 
                    />
                    <text x="160" y="375" fill="#38bdf8" className="text-[7.5px] font-serif italic opacity-45">印度河 (Indus)</text>

                    {/* Liao River (辽河) */}
                    <path 
                      d="M 760 170 Q 780 210 790 240" 
                      fill="none" 
                      stroke="url(#riverGradient)" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      opacity="0.55" 
                    />
                    <text x="770" y="195" fill="#38bdf8" className="text-[7.5px] font-serif italic opacity-45">辽河</text>
                  </g>
                )}

                {/* 190 AD Historical Han & Asian Dynasties Borders Layer */}
                {show190Border && (
                  <g id="han-empire-190-border" className="transition-opacity duration-500">
                    {/* Glowing Imperial territory tint */}
                    <path
                      d="M 720 180 L 780 200 L 800 230 L 770 250 L 710 270 Q 750 310 770 360 L 740 420 L 700 480 L 630 500 L 560 480 L 480 460 L 440 420 L 430 350 L 370 260 L 450 240 L 550 210 L 640 190 Z"
                      fill="url(#territoryGlow)"
                      opacity="0.9"
                    />

                    {/* Han Great Wall line from Dunhuang along Hexi to Liaodong */}
                    <path
                      d="M 370 255 L 435 245 L 480 220 L 550 210 L 630 205 L 700 200 L 755 195 L 785 205"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                      opacity="0.75"
                    />
                    <text x="570" y="198" fill="#f59e0b" className="text-[8.5px] font-serif font-black tracking-widest opacity-80">🏯 汉长城烽燧线 (Great Wall Defenses)</text>

                    {/* Historical Han Empire Boundary dashed line */}
                    <path
                      d="M 720 180 L 780 200 L 800 230 L 770 250 L 710 270 Q 750 310 770 360 L 740 420 L 700 480 L 630 500 L 560 480 L 480 460 L 440 420 L 430 350 L 370 260 L 450 240 L 550 210 L 640 190 Z"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="1.8"
                      strokeDasharray="6, 5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.8"
                    />

                    {/* Asian Regional Realm Title Callouts */}
                    <g id="asian-realm-labels" className="select-none font-serif">
                      {/* Kushan Empire */}
                      <g transform="translate(90, 290)">
                        <rect x="-4" y="-10" width="115" height="18" rx="3" fill="#0f172a" stroke="#ca8a04" strokeWidth="0.8" opacity="0.8" />
                        <text x="0" y="2" fill="#fef08a" className="text-[8.5px] font-bold tracking-wider">【大月氏・贵霜帝国】</text>
                      </g>

                      {/* Western Regions Protectorate */}
                      <g transform="translate(230, 205)">
                        <rect x="-4" y="-10" width="125" height="18" rx="3" fill="#0f172a" stroke="#0ea5e9" strokeWidth="0.8" opacity="0.8" />
                        <text x="0" y="2" fill="#bae6fd" className="text-[8.5px] font-bold tracking-wider">【西域都护府・三十六国】</text>
                      </g>

                      {/* Xianbei Steppe */}
                      <g transform="translate(500, 95)">
                        <rect x="-4" y="-10" width="115" height="18" rx="3" fill="#0f172a" stroke="#f43f5e" strokeWidth="0.8" opacity="0.8" />
                        <text x="0" y="2" fill="#fecdd3" className="text-[8.5px] font-bold tracking-wider">【漠北草原・鲜卑各部】</text>
                      </g>

                      {/* Goguryeo */}
                      <g transform="translate(820, 145)">
                        <rect x="-4" y="-10" width="105" height="18" rx="3" fill="#0f172a" stroke="#8b5cf6" strokeWidth="0.8" opacity="0.8" />
                        <text x="0" y="2" fill="#ddd6fe" className="text-[8.5px] font-bold tracking-wider">【高句丽山岳王国】</text>
                      </g>

                      {/* Ancient Japan / Yamatai */}
                      <g transform="translate(900, 225)">
                        <rect x="-4" y="-10" width="118" height="18" rx="3" fill="#0f172a" stroke="#ec4899" strokeWidth="0.8" opacity="0.85" />
                        <text x="0" y="2" fill="#fbcfe8" className="text-[8.5px] font-bold tracking-wider">【东海瀛洲・邪马台国】</text>
                      </g>

                      {/* Jiaozhi / Baiyue */}
                      <g transform="translate(560, 455)">
                        <rect x="-4" y="-10" width="105" height="18" rx="3" fill="#0f172a" stroke="#10b981" strokeWidth="0.8" opacity="0.8" />
                        <text x="0" y="2" fill="#a7f3d0" className="text-[8.5px] font-bold tracking-wider">【岭南百越・士燮交州】</text>
                      </g>

                      {/* Funan Kingdom */}
                      <g transform="translate(565, 545)">
                        <rect x="-4" y="-10" width="95" height="18" rx="3" fill="#0f172a" stroke="#14b8a6" strokeWidth="0.8" opacity="0.8" />
                        <text x="0" y="2" fill="#99f6e4" className="text-[8.5px] font-bold tracking-wider">【中南半岛・扶南国】</text>
                      </g>

                      {/* Ancient India / Tianzhu */}
                      <g transform="translate(240, 480)">
                        <rect x="-4" y="-10" width="95" height="18" rx="3" fill="#0f172a" stroke="#6366f1" strokeWidth="0.8" opacity="0.8" />
                        <text x="0" y="2" fill="#c7d2fe" className="text-[8.5px] font-bold tracking-wider">【古印度・身毒天竺】</text>
                      </g>

                      {/* Unified Han Dynasty Centerpiece */}
                      <g transform="translate(585, 330)">
                        <rect x="-105" y="-12" width="210" height="24" rx="4" fill="#1e1b4b" stroke="#f43f5e" strokeWidth="1.2" opacity="0.9" />
                        <text x="0" y="4" fill="#ffe4e6" className="text-[11px] font-serif font-black tracking-[0.25em]" textAnchor="middle">公元190年・大汉大一统舆图</text>
                      </g>
                    </g>
                  </g>
                )}

                {/* Silk Road & Maritime Trade Routes Layer */}
                {showTradeRoutes && (
                  <g id="trade-routes-layer" className="transition-opacity duration-300">
                    {/* Overland Silk Road (丝绸之路: 长安 -> 敦煌 -> 龟兹 -> 疏勒 -> 贵霜) */}
                    <path
                      d="M 500 279 L 440 265 L 380 254 L 260 229 L 170 248 L 90 316"
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="2.2"
                      strokeDasharray="6 4"
                      className="animate-dash"
                      style={{ animation: 'dash 1.6s linear infinite' }}
                      opacity="0.85"
                    />
                    <text x="310" y="260" fill="#fef08a" className="text-[8.5px] font-serif font-bold italic tracking-wide opacity-80">
                      🐪 丝绸之路・天山绿洲商脉 (Silk Road)
                    </text>

                    {/* Maritime Silk Road to Yamatai (东海航线: 会稽 -> 乐浪 -> 邪马台) */}
                    <path
                      d="M 760 384 Q 800 320 820 217 Q 870 230 930 248"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2"
                      strokeDasharray="5 4"
                      className="animate-dash"
                      style={{ animation: 'dash 2s linear infinite' }}
                      opacity="0.75"
                    />
                    <text x="835" y="275" fill="#a5f3fc" className="text-[8px] font-serif font-bold italic opacity-75">
                      ⛵ 魏倭东海海路
                    </text>

                    {/* Maritime Silk Road to South Sea (南海航路: 会稽 -> 交趾 -> 扶南) */}
                    <path
                      d="M 760 384 Q 680 430 580 477 Q 570 515 580 558"
                      fill="none"
                      stroke="#14b8a6"
                      strokeWidth="2"
                      strokeDasharray="5 4"
                      className="animate-dash"
                      style={{ animation: 'dash 2.2s linear infinite' }}
                      opacity="0.75"
                    />
                    <text x="615" y="475" fill="#99f6e4" className="text-[8px] font-serif font-bold italic opacity-75">
                      ⛵ 孙吴南海航道 (Nanhai Maritime Route)
                    </text>

                    {/* Tea-Horse Road / Southwestern Route (蜀身毒道: 成都 -> 建宁 -> 身毒古道) */}
                    <path
                      d="M 460 378 L 460 452 L 340 434 L 280 470"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                      opacity="0.75"
                    />
                    <text x="360" y="445" fill="#86efac" className="text-[8px] font-serif font-bold italic opacity-75">
                      🍵 蜀身毒道 (Tea Horse Route)
                    </text>
                  </g>
                )}

                {/* Draw animated Campaign Expedition Line on SVG if running */}
                {isExpeditionRunning && expeditionStep >= 1 && (
                  <>
                    {/* Glowing Arrow Path connecting any two Asian cities */}
                    <line 
                      x1={CITIES.find(c => c.id === expeditionOriginId)!.x * 10}
                      y1={CITIES.find(c => c.id === expeditionOriginId)!.y * 6.2}
                      x2={CITIES.find(c => c.id === expeditionTargetId)!.x * 10}
                      y2={CITIES.find(c => c.id === expeditionTargetId)!.y * 6.2}
                      stroke={originControllerId !== 'ronin' ? (FACTIONS.find(f => f.id === originControllerId)?.color || '#eab308') : '#fb923c'}
                      strokeWidth="4"
                      strokeDasharray="8 6"
                      className="animate-dash"
                      style={{
                        strokeDashoffset: 100,
                        animation: 'dash 1.2s linear infinite'
                      }}
                    />
                    {/* Arrow Pointing Target */}
                    <circle 
                      cx={CITIES.find(c => c.id === expeditionTargetId)!.x * 10}
                      cy={CITIES.find(c => c.id === expeditionTargetId)!.y * 6.2}
                      r="12"
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="2"
                      className="animate-ping"
                    />
                  </>
                )}
              </svg>

              {/* Render All 26 Asian City / Strategic Nodes */}
              {CITIES.map(city => {
                const controllerId = cityOwnership[city.id] || 'ronin';
                const faction = FACTIONS.find(f => f.id === controllerId) || FACTIONS[5];
                const isSelected = selectedCityId === city.id;
                
                const isOrig = expeditionOriginId === city.id;
                const isTarg = expeditionTargetId === city.id;
                
                const isStationedNum = officers.filter(o => o.factionId === controllerId).length;
                const isFocusedTheater = selectedTheater === 'all' || city.theater === selectedTheater;

                return (
                  <div 
                    id={`city-node-${city.id}`}
                    key={city.id}
                    style={{ left: `${city.x}%`, top: `${city.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20 transition-all duration-300 ${
                      isFocusedTheater ? 'opacity-100 scale-100' : 'opacity-40 hover:opacity-95 scale-90'
                    }`}
                    onClick={() => {
                      setSelectedCityId(city.id);
                      setMapTab('city-view');
                    }}
                  >
                    {/* Anchor Pointing Beacon */}
                    <div className="relative flex items-center justify-center">
                      
                      {/* Ring Pulse */}
                      <span 
                        className={`absolute inline-flex h-6 w-6 rounded-full opacity-60 transition-transform ${
                          isSelected ? 'scale-125' : 'group-hover:scale-110'
                        }`}
                        style={{ 
                          backgroundColor: `${faction.color}25`,
                          border: `1.5px solid ${faction.color}` 
                        }} 
                      />

                      {/* Expedition Markers badges (ORIG/TARG indicators) */}
                      {isOrig && (
                        <span className="absolute -top-7 px-1.5 py-0.5 bg-emerald-500 text-slate-950 font-mono text-[8px] font-black rounded-md border border-emerald-400 z-10 whitespace-nowrap shadow-md">
                          ORIG 起
                        </span>
                      )}
                      {isTarg && (
                        <span className="absolute -top-7 px-1.5 py-0.5 bg-rose-500 text-slate-100 font-mono text-[8px] font-black rounded-md border border-rose-400 z-10 whitespace-nowrap shadow-md">
                          TARG 迄
                        </span>
                      )}

                      {/* Core Point Circle representing City */}
                      <div 
                        className={`h-3 w-3 rounded-full shadow-inner border transition-all duration-300 ${
                          isSelected ? 'ring-2 ring-amber-400 scale-125' : 'group-hover:scale-115'
                        }`}
                        style={{ 
                          backgroundColor: faction.color,
                          borderColor: isSelected ? '#fbbf24' : '#1e293b'
                        }} 
                      />

                      {/* Label Placement */}
                      <span className={`absolute top-3.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-md text-[9.5px] font-serif font-black tracking-wider shadow-md whitespace-nowrap border z-10 transition-colors ${
                        isSelected 
                          ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold' 
                          : 'bg-slate-950/90 text-slate-300 border-slate-800'
                      }`}>
                        {city.name}
                        <span className="text-[7px] font-light font-mono block text-center leading-none opacity-80 uppercase mt-0.5">
                          {isStationedNum > 0 ? `${isStationedNum}将` : city.region}
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* CSS Animation Keyframes Inject for SVG March */}
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes dash {
                  to {
                    stroke-dashoffset: 0;
                  }
                }
                .animate-dash {
                  animation: dash 1.4s linear infinite;
                }
                @keyframes rainEffect {
                  0% { background-position: 0px 0px; }
                  100% { background-position: -120px 240px; }
                }
                @keyframes windEffect {
                  0% { background-position: 0px 0px; }
                  100% { background-position: 300px 0px; }
                }
                @keyframes fogEffect {
                  0% { opacity: 0.15; transform: scale(1) translate(0px, 0px); }
                  50% { opacity: 0.35; transform: scale(1.05) translate(6px, -4px); }
                  100% { opacity: 0.15; transform: scale(1) translate(0px, 0px); }
                }
                .animate-rain {
                  animation: rainEffect 1s linear infinite;
                }
                .animate-wind {
                  animation: windEffect 2.8s linear infinite;
                }
                .animate-fog {
                  animation: fogEffect 7s ease-in-out infinite;
                }
              `}} />

              {/* Dynamic Ambient Weather Canvas Overlays */}
              {weatherId === 'rainy' && (
                <div id="weather-overlay-rain" className="absolute inset-0 pointer-events-none z-10 overflow-hidden bg-blue-950/10 mix-blend-color-burn">
                  <svg className="w-full h-full opacity-65" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="rain-pattern" width="120" height="120" patternUnits="userSpaceOnUse">
                        <line x1="10" y1="0" x2="0" y2="40" stroke="#a5f3fc" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
                        <line x1="50" y1="20" x2="40" y2="60" stroke="#a5f3fc" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
                        <line x1="90" y1="10" x2="80" y2="50" stroke="#a5f3fc" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
                        <line x1="30" y1="70" x2="20" y2="110" stroke="#a5f3fc" strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
                        <line x1="70" y1="60" x2="60" y2="100" stroke="#a5f3fc" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#rain-pattern)" className="animate-rain" />
                  </svg>
                </div>
              )}

              {weatherId === 'windy' && (
                <div id="weather-overlay-wind" className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                  <svg className="w-full h-full opacity-45" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="wind-pattern" width="300" height="150" patternUnits="userSpaceOnUse">
                        <path d="M 0 30 Q 50 15 100 30 T 200 30" fill="none" stroke="#2dd4bf" strokeWidth="1.2" strokeDasharray="30, 200" opacity="0.6" />
                        <path d="M 50 70 Q 100 85 150 70 T 300 70" fill="none" stroke="#2dd4bf" strokeWidth="1.2" strokeDasharray="40, 180" opacity="0.5" />
                        <path d="M 120 110 Q 170 95 220 110 T 350 110" fill="none" stroke="#d9f99d" strokeWidth="1" strokeDasharray="50, 220" opacity="0.7" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#wind-pattern)" className="animate-wind" />
                  </svg>
                </div>
              )}

              {weatherId === 'foggy' && (
                <div id="weather-overlay-fog" className="absolute inset-0 pointer-events-none z-10 overflow-hidden bg-slate-900/15 mix-blend-overlay">
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/10 via-transparent to-slate-200/10 animate-fog" />
                  <div className="absolute inset-0 mix-blend-color-dodge opacity-25">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <filter id="fog-filter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
                        <feColorMatrix type="matrix" values="1 0 0 0 1  0 1 0 0 1  0 0 1 0 1  0 0 0 0.25 0" />
                      </filter>
                      <rect width="100%" height="100%" filter="url(#fog-filter)" />
                    </svg>
                  </div>
                </div>
              )}
              
              {/* Visual Instruction Badge on map bottom */}
              <div className="absolute bottom-2.5 left-2.5 bg-slate-950/85 backdrop-blur-sm border border-slate-900 rounded-lg p-2 max-w-md z-10 flex gap-2 items-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <p className="text-[9.5px] text-slate-400 leading-relaxed font-sans">
                  <strong className="text-amber-400">全域亚洲：</strong>涵盖西域葱岭、贵霜帝国、塞北鲜卑、高句丽、东海邪马台、中原腹地与南海交趾扶南（共 26 邦国郡所）。
                </p>
              </div>
            </div>
          </div>

          {/* Selected City Command details panel */}
          <div className={`${isWideView ? 'w-full' : 'lg:col-span-4'} flex flex-col gap-5`}>
            
            {/* Selected City Command Board */}
            <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-start border-b border-slate-900 pb-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg" style={{ backgroundColor: `${selectedCityController.color}20`, color: selectedCityController.color, border: `1px solid ${selectedCityController.color}40` }}>
                      {selectedCity.region}地区
                    </span>
                    <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {ASIA_THEATERS.find(t => t.id === selectedCity.theater)?.name || selectedCity.theater}
                    </span>
                    <p className="text-[10px] font-mono text-slate-500">{selectedCity.pinyin}</p>
                  </div>
                  <h3 className="text-xl font-serif font-black text-slate-100 mt-1 flex items-center gap-2">
                    🛡️ {selectedCity.name}
                  </h3>
                </div>

                {/* Mini selector to mock/change control manually */}
                <div className="text-right">
                  <label className="text-[9px] font-mono text-slate-500 block mb-1">手动调配势力</label>
                  <select
                    id="select-city-controller"
                    value={selectedCityControllerId}
                    onChange={(e) => handleModifyController(selectedCity.id, e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-[10px] text-slate-300 rounded font-serif px-2 py-1 focus:outline-none focus:border-slate-700"
                  >
                    {FACTIONS.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {selectedCity.description}
              </p>

              <div className="bg-slate-900/45 border border-slate-900 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-xs border-b border-slate-900 pb-1.5">
                  <span className="text-slate-400 font-mono inline-flex items-center gap-1">
                    <Flag size={11} className="text-amber-500" />
                    当前坐镇执政官
                  </span>
                  <span className="font-serif font-bold" style={{ color: selectedCityController.color }}>
                    {selectedCityController.name} (首领: {selectedCityController.ruler})
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-500 font-sans leading-relaxed">
                  {selectedCityController.description}
                </p>
              </div>

              {/* Stationed officers listing */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Users size={12} />
                  郡城驻扎武将名录 ({stationedOfficers.length})
                </span>

                {stationedOfficers.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
                    {stationedOfficers.map(o => (
                      <button
                        id={`btn-map-officer-${o.id}`}
                        key={o.id}
                        onClick={() => onSelectOfficer?.(o)}
                        className="group flex items-center gap-2 bg-slate-900/60 hover:bg-slate-900/90 hover:border-slate-800 p-2 rounded-xl text-left border border-slate-950 transition-all cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-full bg-slate-950 flex items-center justify-center font-serif text-[11px] text-amber-500 font-black border border-slate-800">
                          {o.name.slice(0, 1)}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[11.5px] font-serif text-slate-200 truncate group-hover:text-amber-400 transition-colors">{o.name}</p>
                          <p className="text-[9px] font-mono text-slate-500">武力 {o.stats.force}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-[10.5px] text-slate-500 bg-slate-900/10 border border-dash border-slate-900 rounded-xl">
                    {selectedCityControllerId === 'ronin' 
                      ? '此地为在野或中立郡地，尚无可派遣武将，招募英雄或派遣自立豪杰可一展宏图。' 
                      : '目前名将簿中，尚无可匹配的武将效忠本势力。可前去“自立武将”板块登用新名将，助其入仕！'}
                  </div>
                )}
              </div>

              {/* Map tab quick setting button */}
              <div className="pt-2 border-t border-slate-900 flex gap-2">
                <button
                  id="btn-set-exp-origin"
                  type="button"
                  onClick={() => setExpeditionOriginId(selectedCity.id)}
                  className="flex-1 text-[10px] font-mono py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 rounded font-bold transition duration-200"
                >
                  📍 设为发兵源
                </button>
                <button
                  id="btn-set-exp-target"
                  type="button"
                  onClick={() => setExpeditionTargetId(selectedCity.id)}
                  className="flex-1 text-[10px] font-mono py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-450 border border-rose-900 rounded font-bold transition duration-200"
                >
                  🎯 设为攻伐地
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
      ) : mapTab === 'city-view' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Center Column: Interactive City Blueprint Map (Span 5) */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between min-h-[500px] relative overflow-hidden">
            
            <div>
              <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-4">
                <div className="space-y-0.5">
                  <span className="text-[11.5px] font-mono font-bold uppercase tracking-widest text-slate-350 flex items-center gap-1.5">
                    🏯 {selectedCity.name}・内城军事布防舆图
                  </span>
                  <p className="text-[10px] text-slate-500 font-sans">
                    点击下方城防重地绘块，即可直连右侧行营发布政令和军务调遣。
                  </p>
                </div>
                <span className="text-[10.5px] font-serif px-2.5 py-0.5 bg-slate-900 border border-slate-800 text-amber-500 rounded font-black font-mono">
                  内苑规制
                </span>
              </div>

              {/* Quick tab triggers (maintained for accessibility & automated tests) */}
              <div className="grid grid-cols-5 gap-1.5 mb-4">
                {[
                  { id: 'palace', name: '官府', icon: Flag },
                  { id: 'market', name: '坊市', icon: Coins },
                  { id: 'tavern', name: '酒馆', icon: Dices },
                  { id: 'barracks', name: '军营', icon: Users },
                  { id: 'gate', name: '城防', icon: Shield }
                ].map(item => {
                  const isCur = selectedFacility === item.id;
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      id={`btn-facility-tab-${item.id}`}
                      onClick={() => setSelectedFacility(item.id as any)}
                      className={`flex flex-col items-center justify-center py-1 rounded-lg border transition-all cursor-pointer ${
                        isCur
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800 shadow-md scale-102 font-bold'
                          : 'bg-slate-900/30 text-slate-500 border-slate-900 hover:text-slate-350 hover:bg-slate-900'
                      }`}
                    >
                      <IconComp size={13} className={isCur ? 'animate-bounce' : ''} />
                      <span className="text-[9.5px] font-serif mt-0.5">{item.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Visual Interactive SVG City Layout Blueprint Map */}
              <div className="relative border border-slate-900 bg-slate-950/85 rounded-xl overflow-hidden mb-4 shadow-inner">
                <svg viewBox="0 0 500 380" className="w-full h-[340px] select-none block">
                  {/* Grid Lines to simulate engineering plans */}
                  <defs>
                    <pattern id="city-blueprint-grid" width="25" height="25" patternUnits="userSpaceOnUse">
                      <rect width="25" height="25" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.45" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#city-blueprint-grid)" />

                  <circle cx="250" cy="180" r="170" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 5" className="opacity-45" />
                  <circle cx="250" cy="180" r="100" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 6" className="opacity-55" />

                  {/* Outer crenellated perimeter fortress walls layout */}
                  <rect x="50" y="45" width="400" height="270" rx="20" ry="20" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="8 6" className="opacity-60" />
                  <circle cx="50" cy="45" r="9" fill="#0f172a" stroke="#475569" strokeWidth="1.2" />
                  <circle cx="450" cy="45" r="9" fill="#0f172a" stroke="#475569" strokeWidth="1.2" />
                  <circle cx="50" cy="315" r="9" fill="#0f172a" stroke="#475569" strokeWidth="1.2" />
                  <circle cx="450" cy="315" r="9" fill="#0f172a" stroke="#475569" strokeWidth="1.2" />

                  {/* Connected road tracks */}
                  <path d="M 130 110 L 250 170" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-45" />
                  <path d="M 130 260 L 250 170" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-45" />
                  <path d="M 370 260 L 250 170" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-45" />
                  <path d="M 250 315 L 250 170" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-45" />

                  {/* Ambient Weather Particles inside City Map SVG overlay */}
                  {weatherId === 'rainy' && (
                    <g className="opacity-50">
                      <line x1="50" y1="20" x2="40" y2="50" stroke="#7dd3fc" strokeWidth="1" className="animate-pulse" />
                      <line x1="160" y1="40" x2="150" y2="70" stroke="#7dd3fc" strokeWidth="1" className="animate-pulse" />
                      <line x1="320" y1="10" x2="310" y2="40" stroke="#7dd3fc" strokeWidth="1" className="animate-pulse" />
                      <line x1="420" y1="70" x2="410" y2="100" stroke="#7dd3fc" strokeWidth="1" className="animate-pulse" />
                      <line x1="80" y1="150" x2="70" y2="180" stroke="#7dd3fc" strokeWidth="1" className="animate-pulse" />
                      <line x1="280" y1="160" x2="270" y2="190" stroke="#7dd3fc" strokeWidth="1" className="animate-pulse" />
                      <line x1="390" y1="180" x2="380" y2="210" stroke="#7dd3fc" strokeWidth="1" className="animate-pulse" />
                    </g>
                  )}
                  {weatherId === 'windy' && (
                    <g className="opacity-40">
                      <path d="M 20 60 Q 60 50 100 60" fill="none" stroke="#2dd4bf" strokeWidth="1" className="animate-pulse" />
                      <path d="M 380 80 Q 420 70 460 80" fill="none" stroke="#2dd4bf" strokeWidth="1" className="animate-pulse" />
                      <path d="M 150 290 Q 200 280 250 290" fill="none" stroke="#2dd4bf" strokeWidth="1" className="animate-pulse" />
                    </g>
                  )}
                  {weatherId === 'foggy' && (
                    <g className="opacity-30">
                      <ellipse cx="250" cy="180" rx="140" ry="80" fill="none" stroke="#94a3b8" strokeWidth="12" strokeDasharray="30 15" className="animate-pulse" />
                      <ellipse cx="120" cy="110" rx="60" ry="30" fill="none" stroke="#94a3b8" strokeWidth="6" strokeDasharray="10 20" />
                      <ellipse cx="380" cy="250" rx="70" ry="35" fill="none" stroke="#94a3b8" strokeWidth="8" strokeDasharray="20 10" />
                    </g>
                  )}

                  {/* ==================== DISTRICTS SECTORS ==================== */}

                  {/* 1. PALACE / 官府 (250, 170) */}
                  <g 
                    onClick={() => setSelectedFacility('palace')}
                    onMouseEnter={() => setHoveredFacility('palace')}
                    onMouseLeave={() => setHoveredFacility(null)}
                    className="cursor-pointer group"
                  >
                    {/* Ring highlight if selected */}
                    {selectedFacility === 'palace' && (
                      <g>
                        <circle cx="250" cy="165" r="46" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 3" className="animate-spin" style={{ transformOrigin: '250px 165px', animationDuration: '10s' }} />
                        <circle cx="250" cy="165" r="46" fill="none" stroke="#f59e0b" strokeWidth="1" className="animate-ping opacity-15" style={{ transformOrigin: '250px 165px' }} />
                      </g>
                    )}
                    {/* Building body background */}
                    <circle cx="250" cy="165" r="32" className={`transition-all duration-300 ${selectedFacility === 'palace' ? 'fill-slate-900 stroke-amber-500/80 stroke-2' : 'fill-slate-950 stroke-slate-800 hover:fill-slate-900 group-hover:stroke-slate-600'}`} />
                    
                    {/* Pagoda-styled roof */}
                    <polygon points="230,165 270,165 264,152 236,152" fill={selectedCityController.color || '#ef4444'} className="opacity-90" />
                    <polygon points="236,152 264,152 258,142 242,142" fill="#1e293b" stroke={selectedCityController.color || '#ef4444'} strokeWidth="1" />
                    
                    {/* Banner flagpole flying ruling banner */}
                    <line x1="250" y1="142" x2="250" y2="124" stroke="#94a3b8" strokeWidth="2" />
                    <polygon points="250,124 274,131 250,138" fill={selectedCityController.color || '#ef4444'} />
                    <text x="254" y="132" fill="#ffffff" fontSize="7" fontWeight="black" fontFamily="serif">{selectedCityController.name.slice(0, 1)}</text>

                    {/* Captions */}
                    <text x="250" y="185" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="serif" className="group-hover:fill-amber-400 transition-colors">中军郡衙</text>
                    <text x="250" y="210" textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontFamily="monospace" className="opacity-80">政务中枢</text>
                  </g>

                  {/* 2. BARRACKS / 军营 (130, 110) */}
                  <g 
                    onClick={() => setSelectedFacility('barracks')}
                    onMouseEnter={() => setHoveredFacility('barracks')}
                    onMouseLeave={() => setHoveredFacility(null)}
                    className="cursor-pointer group"
                  >
                    {/* Ring highlight if selected */}
                    {selectedFacility === 'barracks' && (
                      <g>
                        <circle cx="130" cy="110" r="42" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" className="animate-spin" style={{ transformOrigin: '130px 110px', animationDuration: '8s' }} />
                        <circle cx="130" cy="110" r="42" fill="none" stroke="#f59e0b" strokeWidth="1" className="animate-ping opacity-15" style={{ transformOrigin: '130px 110px' }} />
                      </g>
                    )}
                    {/* Background */}
                    <circle cx="130" cy="110" r="30" className={`transition-all duration-300 ${selectedFacility === 'barracks' ? 'fill-slate-900 stroke-amber-500/80 stroke-2' : 'fill-slate-950 stroke-slate-800 hover:fill-slate-900 group-hover:stroke-slate-600'}`} />
                    
                    {/* Camp Tents layout */}
                    <polygon points="110,114 130,114 120,94" fill="#334155" stroke="#64748b" strokeWidth="1" />
                    <polygon points="124,116 144,116 134,98" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                    <line x1="120" y1="94" x2="134" y2="98" stroke="#ef4444" strokeWidth="1.2" className="opacity-75" />

                    {/* Captions */}
                    <text x="130" y="129" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="serif" className="group-hover:fill-amber-400 transition-colors">辕门军营</text>
                    <text x="130" y="152" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="sans-serif" className="font-bold">
                      Garrison: {stationedOfficers.length} 将
                    </text>
                  </g>

                  {/* 3. MARKET / 坊市 (130, 260) */}
                  <g 
                    onClick={() => setSelectedFacility('market')}
                    onMouseEnter={() => setHoveredFacility('market')}
                    onMouseLeave={() => setHoveredFacility(null)}
                    className="cursor-pointer group"
                  >
                    {/* Ring highlight if selected */}
                    {selectedFacility === 'market' && (
                      <g>
                        <circle cx="130" cy="260" r="42" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" className="animate-spin" style={{ transformOrigin: '130px 260px', animationDuration: '8s' }} />
                        <circle cx="130" cy="260" r="42" fill="none" stroke="#f59e0b" strokeWidth="1" className="animate-ping opacity-15" style={{ transformOrigin: '130px 260px' }} />
                      </g>
                    )}
                    {/* Background */}
                    <circle cx="130" cy="260" r="30" className={`transition-all duration-300 ${selectedFacility === 'market' ? 'fill-slate-900 stroke-amber-500/80 stroke-2' : 'fill-slate-950 stroke-slate-800 hover:fill-slate-900 group-hover:stroke-slate-600'}`} />
                    
                    {/* Market stalls representation */}
                    <rect x="114" y="248" width="32" height="10" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" rx="1" />
                    <rect x="112" y="258" width="16" height="8" fill="#d97706" rx="0.5" />
                    <rect x="132" y="258" width="16" height="8" fill="#15803d" rx="0.5" />
                    <circle cx="130" cy="245" r="3" fill="#eab308" className="animate-pulse" />

                    {/* Captions */}
                    <text x="130" y="279" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="serif" className="group-hover:fill-amber-400 transition-colors">九市商坊</text>
                    <text x="130" y="302" textAnchor="middle" fill="#0284c7" fontSize="8" fontFamily="sans-serif" className="font-bold">
                      繁荣: {(cityStats[selectedCity.id] || { prosperity: 75 }).prosperity}%
                    </text>
                  </g>

                  {/* 4. TAVERN / 酒馆 (370, 260) */}
                  <g 
                    onClick={() => setSelectedFacility('tavern')}
                    onMouseEnter={() => setHoveredFacility('tavern')}
                    onMouseLeave={() => setHoveredFacility(null)}
                    className="cursor-pointer group"
                  >
                    {/* Ring highlight if selected */}
                    {selectedFacility === 'tavern' && (
                      <g>
                        <circle cx="370" cy="260" r="42" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" className="animate-spin" style={{ transformOrigin: '370px 260px', animationDuration: '8s' }} />
                        <circle cx="370" cy="260" r="42" fill="none" stroke="#f59e0b" strokeWidth="1" className="animate-ping opacity-15" style={{ transformOrigin: '370px 260px' }} />
                      </g>
                    )}
                    {/* Background */}
                    <circle cx="370" cy="260" r="30" className={`transition-all duration-300 ${selectedFacility === 'tavern' ? 'fill-slate-900 stroke-amber-500/80 stroke-2' : 'fill-slate-950 stroke-slate-800 hover:fill-slate-900 group-hover:stroke-slate-600'}`} />
                    
                    {/* Inn pavilion roof */}
                    <polygon points="350,252 390,252 382,240 358,240" fill="#ea580c" />
                    {/* Wine flag */}
                    <rect x="345" y="254" width="11" height="14" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
                    <text x="350.5" y="264" fill="#000000" fontSize="8" fontWeight="black" fontFamily="serif">酒</text>

                    {/* Captions */}
                    <text x="370" y="279" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="serif" className="group-hover:fill-amber-400 transition-colors">豪杰酒客</text>
                    <text x="370" y="302" textAnchor="middle" fill="#d97706" fontSize="8" fontFamily="sans-serif" className="font-bold">
                      客满寻访
                    </text>
                  </g>

                  {/* 5. GATES / 城防 (250, 315) */}
                  <g 
                    onClick={() => setSelectedFacility('gate')}
                    onMouseEnter={() => setHoveredFacility('gate')}
                    onMouseLeave={() => setHoveredFacility(null)}
                    className="cursor-pointer group"
                  >
                    {/* Ring highlight if selected */}
                    {selectedFacility === 'gate' && (
                      <g>
                        <circle cx="250" cy="315" r="40" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" className="animate-spin" style={{ transformOrigin: '250px 315px', animationDuration: '8s' }} />
                        <circle cx="250" cy="315" r="40" fill="none" stroke="#f59e0b" strokeWidth="1" className="animate-ping opacity-15" style={{ transformOrigin: '250px 315px' }} />
                      </g>
                    )}
                    {/* Background */}
                    <circle cx="250" cy="315" r="28" className={`transition-all duration-300 ${selectedFacility === 'gate' ? 'fill-slate-900 stroke-amber-500/80 stroke-2' : 'fill-slate-950 stroke-slate-800 hover:fill-slate-900 group-hover:stroke-slate-600'}`} />
                    
                    {/* Fortress brick arch gate */}
                    <rect x="236" y="306" width="28" height="18" fill="#1e293b" stroke="#475569" strokeWidth="1" rx="1" />
                    <path d="M 244 324 L 244 316 Q 250 312 256 316 L 256 324" fill="#0f172a" stroke="#475569" strokeWidth="1px" />

                    {/* Captions */}
                    <text x="250" y="333" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontWeight="bold" fontFamily="serif" className="group-hover:fill-amber-400 transition-colors">城防要隘</text>
                    <text x="250" y="352" textAnchor="middle" fill="#10b981" fontSize="8" fontFamily="sans-serif" className="font-bold">
                      垒防: {(cityStats[selectedCity.id] || { defense: 75 }).defense}/100
                    </text>
                  </g>
                </svg>

                {/* Ambient dynamic compass / weather widget floated in blueprint */}
                <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur border border-slate-900 rounded-lg p-1.5 flex gap-1 items-center z-10 select-none shadow">
                  <span className="text-xs">{WEATHERS.find(w => w.id === weatherId)?.icon}</span>
                  <span className="text-[10px] font-serif font-black text-slate-300 pr-1">{WEATHERS.find(w => w.id === weatherId)?.nameCn}气象</span>
                </div>
              </div>

              {/* Dynamic HUD Banner showing details of highlighted / active building */}
              <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-900 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center border border-slate-800 shadow-inner text-base shrink-0 select-none">
                    {hoveredFacility === 'palace' || (hoveredFacility === null && selectedFacility === 'palace') ? '🏯' :
                     hoveredFacility === 'market' || (hoveredFacility === null && selectedFacility === 'market') ? '🪙' :
                     hoveredFacility === 'tavern' || (hoveredFacility === null && selectedFacility === 'tavern') ? '🍺' :
                     hoveredFacility === 'barracks' || (hoveredFacility === null && selectedFacility === 'barracks') ? '⚔️' : '🛡️'}
                  </div>
                  <div className="space-y-0.5 truncate">
                    <h5 className="font-serif font-bold text-slate-100 flex items-center gap-1.5 truncate">
                      {hoveredFacility === 'palace' || (hoveredFacility === null && selectedFacility === 'palace') ? '【行政区・中军郡衙】' :
                       hoveredFacility === 'market' || (hoveredFacility === null && selectedFacility === 'market') ? '【百业区・通商坊市】' :
                       hoveredFacility === 'tavern' || (hoveredFacility === null && selectedFacility === 'tavern') ? '【民务区・豪客酒肆】' :
                       hoveredFacility === 'barracks' || (hoveredFacility === null && selectedFacility === 'barracks') ? '【统军区・辕门军营】' : '【天堑区・瓮城防隘】'}
                      {hoveredFacility && <span className="text-[8.5px] text-amber-500 font-mono animate-pulse uppercase pr-1">[移步探规]</span>}
                    </h5>
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed truncate">
                      {hoveredFacility === 'palace' || (hoveredFacility === null && selectedFacility === 'palace') ? '郡内政治决策中心。处理政务，朝觐主君，签发大阅军令或赈济万民。' :
                       hoveredFacility === 'market' || (hoveredFacility === null && selectedFacility === 'market') ? '经济贸易往来的胡商六坊大街。可招商引资商业，囤米屯粮，或淘购传世重宝。' :
                       hoveredFacility === 'tavern' || (hoveredFacility === null && selectedFacility === 'tavern') ? '酒逢知己，结交在野将领，打探四海群雄军势秘闻，斗酒博戏骰点对局。' :
                       hoveredFacility === 'barracks' || (hoveredFacility === null && selectedFacility === 'barracks') ? '统帅大军大训演兵！增强守御机动，或者花重金募呼各大史实势力王牌精锐王牌兵种。' : '坚护城楼，燃点烽火增加御敌能力；校场高挂帅旗直接派遣起兵，远征进围天盘要塞！'}
                    </p>
                  </div>
                </div>
                <span className="text-[9.5px] font-mono text-slate-500 border border-slate-850 px-2 py-0.5 rounded-md bg-slate-950 shadow-inner select-none uppercase shrink-0">
                  {hoveredFacility || selectedFacility}
                </span>
              </div>

            </div>

            {/* Exit to Sandtable button */}
            <div className="pt-4 border-t border-slate-900 mt-4 flex gap-2">
              <button
                id="btn-interior-return"
                type="button"
                onClick={() => setMapTab('svg-map')}
                className="flex-1 text-xs font-mono font-bold py-2.5 bg-slate-900 hover:bg-slate-850 hover:text-slate-200 text-slate-400 border border-slate-850 hover:border-slate-800 rounded-xl transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Compass size={12} /> ← 退出内城舆图・重归神州大战略沙盘
              </button>
            </div>

          </div>

          {/* Right Column: Combined Administrative Dashboard & Local Chronicles (Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Active Selected Facility Operations Board */}
            <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between min-h-[360px] relative overflow-hidden">
              <div>
                <div className="flex justify-between items-center border-b border-slate-900 pb-2 mb-3">
                  <span className="text-[11px] font-mono font-black uppercase text-amber-500 flex items-center gap-1.5">
                    ⚙️ 行营执政公文
                  </span>
                  <span className="text-[10px] font-sans text-slate-500">
                    当前选定・{selectedFacility === 'palace' ? '官府' : selectedFacility === 'market' ? '坊市' : selectedFacility === 'tavern' ? '酒馆' : selectedFacility === 'barracks' ? '军营' : '城防'}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Palace Panel */}
                  {selectedFacility === 'palace' && (
                    <div className="space-y-3">
                      <div className="bg-slate-900/50 border border-slate-900 p-3 rounded-xl flex items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <h3 className="text-[13px] font-serif font-black text-slate-200">🏯 官府大堂</h3>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            签发征调令组织百业，开仓布粮聚揽流民信望。
                          </p>
                        </div>
                        <Flag size={24} className="text-slate-800 shrink-0" />
                      </div>

                      <div className="space-y-2">
                        <button
                          id="btn-palace-mobilize"
                          type="button"
                          onClick={handleMobilization}
                          className="w-full text-[11px] font-serif font-bold text-slate-200 bg-slate-900 hover:bg-slate-850 border border-slate-800 py-2.5 px-3 rounded-lg flex items-center justify-between transition-all group active:scale-98 cursor-pointer text-left"
                        >
                          <span className="flex items-center gap-1.5">🏰 签发工商业调配令</span>
                          <span className="text-[9.5px] text-amber-500 font-mono group-hover:underline">消耗 150 金</span>
                        </button>

                        <button
                          id="btn-palace-relieve"
                          type="button"
                          onClick={handleRelievePoverty}
                          className="w-full text-[11px] font-serif font-bold text-slate-200 bg-slate-900 hover:bg-slate-850 border border-slate-800 py-2.5 px-3 rounded-lg flex items-center justify-between transition-all group active:scale-98 cursor-pointer text-left"
                        >
                          <span className="flex items-center gap-1.5">🌾 开仓大施平仓抗赈</span>
                          <span className="text-[9.5px] text-emerald-400 font-mono group-hover:underline">消耗 300 军粮</span>
                        </button>

                        <button
                          id="btn-palace-consult"
                          type="button"
                          onClick={handleConsultRuler}
                          className="w-full text-[11px] font-serif font-bold text-slate-200 bg-slate-900 hover:bg-slate-850 border border-slate-800 py-2.5 px-3 rounded-lg flex items-center justify-between transition-all group active:scale-98 cursor-pointer text-left"
                        >
                          <span className="flex items-center gap-1.5">👑 朝礼朝觐势力主君</span>
                          <span className="text-[9.5px] text-sky-400 font-mono">免金资</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Market Panel */}
                  {selectedFacility === 'market' && (
                    <div className="space-y-3">
                      <div className="bg-slate-900/50 border border-slate-900 p-3 rounded-xl flex items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <h3 className="text-[13px] font-serif font-black text-slate-200">🪙 九市六肆大街</h3>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            投资振兴商业经济，或于胡商大阁海淘传世秘刃、烈马等奇物重保。
                          </p>
                        </div>
                        <Coins size={24} className="text-slate-800 shrink-0" />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          id="btn-market-invest"
                          type="button"
                          onClick={handleInvestCommerce}
                          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 p-2 rounded-xl block text-center transition-all cursor-pointer active:scale-95"
                        >
                          <span className="text-[10.5px] font-serif font-bold text-slate-200 block">🚜 招商兴市兴水利</span>
                          <span className="text-[9px] font-mono text-amber-500 block mt-0.5">100 金 (繁荣+10%)</span>
                        </button>

                        <button
                          id="btn-market-provisions"
                          type="button"
                          onClick={handleBuyGrain}
                          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 p-2 rounded-xl block text-center transition-all cursor-pointer active:scale-95"
                        >
                          <span className="text-[10.5px] font-serif font-bold text-slate-200 block">🌾 批购平准屯兵粮</span>
                          <span className="text-[9px] font-mono text-emerald-400 block mt-0.5">120 金 (粮+800石)</span>
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[9.5px] font-mono text-slate-500 block">大朝胡客宝物货架</span>
                        <div className="max-h-[120px] overflow-y-auto space-y-1.5 pr-1 border border-slate-900/80 p-1.5 rounded-lg">
                          {MARKET_ITEMS.map((item, idx) => {
                            const possessed = playerInventory.includes(item.name);
                            return (
                              <div key={idx} className="bg-slate-900 border border-slate-850 p-1.5 rounded-lg flex items-center justify-between text-[11px] transition duration-300">
                                <div className="space-y-0.5">
                                  <h4 className="font-serif font-bold text-slate-300">{item.name.split(' (')[0]}</h4>
                                  <p className="text-[8.5px] text-slate-500">{item.desc} ({item.bonus})</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleBuyTreasure(item)}
                                  disabled={possessed}
                                  className={`px-2 py-0.5 rounded text-[8.5px] font-mono font-bold transition-all active:scale-95 ${
                                    possessed
                                      ? 'bg-slate-900 text-slate-600 border border-slate-850 cursor-not-allowed'
                                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer shadow'
                                  }`}
                                >
                                  {possessed ? '已藏' : `${item.cost}金`}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tavern Panel */}
                  {selectedFacility === 'tavern' && (
                    <div className="space-y-3">
                      <div className="bg-slate-900/50 border border-slate-900 p-3 rounded-xl flex items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <h3 className="text-[13px] font-serif font-black text-slate-200">🍺 豪饮酒肆</h3>
                          <p className="text-[10px] text-slate-550 leading-normal">
                            烛下寻贤探在野之才，探听诸家军势力，斗骰搏乐筹码搏金。
                          </p>
                        </div>
                        <Dices size={24} className="text-slate-800 shrink-0" />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          id="btn-tavern-scout"
                          type="button"
                          onClick={handleScoutGenerals}
                          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 p-2.5 rounded-xl block text-center transition-all cursor-pointer active:scale-95"
                        >
                          <span className="text-[10.5px] font-serif font-bold text-slate-200 block">👥 秉烛寻奇访名宿</span>
                          <span className="text-[8.5px] font-mono text-emerald-500 block mt-0.5">结识招揽在野之将</span>
                        </button>

                        <button
                          id="btn-tavern-rumor"
                          type="button"
                          onClick={handleListenRumors}
                          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 p-2.5 rounded-xl block text-center transition-all cursor-pointer active:scale-95"
                        >
                          <span className="text-[10.5px] font-serif font-bold text-slate-200 block">🗺️ 探听四海战略书</span>
                          <span className="text-[8.5px] font-mono text-sky-400 block mt-0.5">查阅势力密卷斥信</span>
                        </button>
                      </div>

                      <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-xl space-y-2">
                        <div className="flex justify-between items-center pb-1 border-b border-slate-850">
                          <span className="text-[9.5px] font-mono text-slate-400 flex items-center gap-1">
                            🎲 肆馆斗酒博弈堂
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRollDice(stationedOfficers[0]?.name || '老酒友')}
                            className="bg-purple-600 hover:bg-purple-500 text-slate-100 text-[9px] font-mono px-2 py-0.5 rounded cursor-pointer transition-colors active:scale-95"
                          >
                            挑战对赌
                          </button>
                        </div>

                        {diceGameResult ? (
                          <div className="space-y-0.5">
                            <p className="text-[10px] text-slate-350 whitespace-pre-line leading-relaxed">
                              {diceGameResult.message}
                            </p>
                            <div className="flex justify-between items-center text-[8.5px] font-mono text-slate-500 pt-1 border-t border-slate-850">
                              <span>玩家骰: <strong className="text-slate-300">{diceGameResult.playerRolls.join(', ')}</strong></span>
                              <span>将军骰: <strong className="text-slate-300">{diceGameResult.opponentRolls.join(', ')}</strong></span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-[9.5px] text-slate-500 text-center py-1.5 italic">
                            本郡大将候陪。博局投掷胜局可进账 150 黄金筹码。
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Barracks Panel */}
                  {selectedFacility === 'barracks' && (
                    <div className="space-y-3">
                      <div className="bg-slate-900/50 border border-slate-900 p-3 rounded-xl flex items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <h3 className="text-[13px] font-serif font-black text-slate-200">⚔️ 辕门射训营</h3>
                          <p className="text-[10px] text-slate-550 leading-normal">
                            厉兵大操统兵防务，聘选各大名篇势力之王牌王队协守。
                          </p>
                        </div>
                        <Users size={24} className="text-slate-800 shrink-0" />
                      </div>

                      <button
                        id="btn-barracks-drill"
                        type="button"
                        onClick={handleTroopDrill}
                        className="w-full text-[11px] font-serif font-bold text-slate-200 bg-slate-900 hover:bg-slate-850 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between transition-all group active:scale-98 cursor-pointer text-left"
                      >
                        <span className="flex items-center gap-1.5">⚔️ 亲登点将台大演兵 (Drill)</span>
                        <span className="text-[9.5px] text-amber-500 font-mono">免费 (防备+5%)</span>
                      </button>

                      <div className="space-y-1">
                        <span className="text-[9.5px] font-mono text-slate-500 block">大阅王牌精锐禁卫</span>
                        <div className="grid grid-cols-2 gap-1.5 max-h-[125px] overflow-y-auto pr-1">
                          {[
                            { name: '西凉白马义从', cost: 300, desc: '幽燕极速义从轻哨骑。' },
                            { name: '曹魏虎豹重骑', cost: 400, desc: '重恺精锐冲击铁骑。' },
                            { name: '白耳兵侍卫队', cost: 350, desc: '刘先主直辖结死雄兵。' },
                            { name: '江东解烦精兵', cost: 300, desc: '水陆突营翻江猛士。' }
                          ].map((reg, idx) => (
                            <div key={idx} className="bg-slate-900 border border-slate-850 p-2 rounded-lg flex flex-col justify-between text-left">
                              <div>
                                <h4 className="text-[10.5px] font-serif font-black text-slate-200 truncate">{reg.name}</h4>
                                <p className="text-[8.5px] text-slate-500 font-sans mt-0.5 leading-tight">{reg.desc}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRecruitSpecialRegiment(reg.name, reg.cost)}
                                className="w-full mt-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 text-[9px] font-mono font-bold py-0.5 rounded transition-colors cursor-pointer"
                              >
                                募: {reg.cost}金
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gate Panel */}
                  {selectedFacility === 'gate' && (
                    <div className="space-y-3">
                      <div className="bg-slate-900/50 border border-slate-900 p-3 rounded-xl flex items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <h3 className="text-[13px] font-serif font-black text-slate-200">🛡️ 边塞关隘瓮城</h3>
                          <p className="text-[10px] text-slate-550 leading-normal">
                            燃点烽火强化防塞，签令调兵，长驱直入攻打江山敌郡。
                          </p>
                        </div>
                        <Shield size={24} className="text-slate-800 shrink-0" />
                      </div>

                      <div className="space-y-1.5">
                        <button
                          id="btn-gate-toggle"
                          type="button"
                          onClick={handleToggleBeacon}
                          className="w-full text-[11px] font-serif font-bold text-slate-200 bg-slate-900 hover:bg-slate-850 border border-slate-800 py-2.5 px-3 rounded-lg flex items-center justify-between transition-all group active:scale-98 cursor-pointer text-left"
                        >
                          <span className="flex items-center gap-1.5">🚨 燃点长天戍边烽火哨警</span>
                          <span className="text-[9.5px] text-sky-400 font-mono">免费 (防备+7)</span>
                        </button>

                        <button
                          id="btn-gate-expedition"
                          type="button"
                          onClick={handleEmbarkConquest}
                          className="w-full text-[11px] font-serif font-black text-slate-950 bg-amber-500 hover:bg-amber-400 py-2.5 px-3 rounded-lg flex items-center justify-between transition-all group active:scale-98 shadow-md cursor-pointer text-left"
                        >
                          <span className="flex items-center gap-1.5 font-bold">⚔️ 帅旗高悬・大发征师战略兵团</span>
                          <span className="text-[9px] text-slate-900 font-mono font-bold uppercase tracking-wider">远征调配</span>
                        </button>
                      </div>

                      <p className="text-[9.5px] text-slate-500 leading-normal border-l border-slate-800 pl-2">
                        军务提点: 点击 [大发兵团] 按钮后，系统会自动指定所处 <strong>{selectedCity.name}</strong> 辖郡为行营出征地 (ORIG)，并自降降返宏观沙盘以便瞄准敌城。
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Garrison listing and live log stacked columns */}
            <div className="space-y-5">
              
              {/* Local stationed general list */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2.5">
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase block">
                  🚩 镇防驻扎群名校录
                </span>
                
                <div className="bg-slate-900/30 p-2 rounded-lg border border-slate-900 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-500">官署佐将员额:</span>
                  <span className="text-slate-300 font-bold">{stationedOfficers.length} 员大将</span>
                </div>

                {stationedOfficers.length > 0 ? (
                  <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1 border border-slate-900 p-1 rounded">
                    {stationedOfficers.map(o => (
                      <button
                        key={o.id}
                        id={`btn-city-view-officer-spotlight-${o.id}`}
                        type="button"
                        onClick={() => onSelectOfficer?.(o)}
                        className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-700 p-1.5 rounded text-left cursor-pointer active:scale-95 flex justify-between items-center"
                      >
                        <div>
                          <span className="font-serif font-black text-amber-500 block text-[12px]">{o.name}</span>
                          <span className="text-[8.5px] font-mono text-slate-500 leading-none">五维总: {o.stats.leadership + o.stats.force + o.stats.intelligence + o.stats.politics + o.stats.charisma}</span>
                        </div>
                        <span className="text-[9px] font-serif font-bold px-1.5 py-0.5 bg-slate-950 border border-slate-850 rounded" style={{ color: selectedCityController.color }}>
                          {selectedCityController.name}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-500 italic leading-normal">
                    本郡空府。您可以移步“自立英杰”招致在野猛士校佐入驻。
                  </p>
                )}
              </div>

              {/* Simulated Live City Activity Logs */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-teal-400 uppercase block">
                  📜 治安军事与要务治安公告
                </span>
                
                <div className="space-y-2 max-h-[110px] overflow-y-auto text-[9.5px] font-mono leading-relaxed pr-1 text-slate-400 border border-slate-900 p-1.5 rounded">
                  {interiorLogs.map((log, idx) => (
                    <div key={idx} className="border-l border-slate-800 pl-1.5 py-0.5">
                      {log}
                    </div>
                  ))}
                </div>
              </div>

            </div>


          </div>

          {/* Right Column: Garrison list and live local news log (Span 3) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Local stationed general list */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 space-y-3">
              <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase block">
                🚩 本郡镇防在职群雄
              </span>
              
              <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500">在驻武将员数:</span>
                <span className="text-slate-200 font-bold">{stationedOfficers.length}员将领</span>
              </div>

              {stationedOfficers.length > 0 ? (
                <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                  {stationedOfficers.map(o => (
                    <button
                      key={o.id}
                      id={`btn-city-view-officer-spotlight-${o.id}`}
                      type="button"
                      onClick={() => onSelectOfficer?.(o)}
                      className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-700 p-2.5 rounded-xl transition duration-200 text-left cursor-pointer active:scale-95 flex justify-between items-center"
                    >
                      <div>
                        <span className="font-serif font-black text-amber-500 block text-[13px]">{o.name}</span>
                        <span className="text-[9px] font-mono text-slate-500 leading-none">五维总和: {o.stats.leadership + o.stats.force + o.stats.intelligence + o.stats.politics + o.stats.charisma}</span>
                      </div>
                      <span className="text-[10px] font-serif font-bold px-2 py-0.5 bg-slate-950 border border-slate-800/80 rounded" style={{ color: selectedCityController.color }}>
                        {selectedCityController.name}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-650 italic leading-relaxed">目前荒疏无常驻大将。您可以前往“自立武将招贤”大张旗鼓开辟门阀豪强入仕。</p>
              )}
            </div>

            {/* Simulated Live City Activity Logs */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-950 space-y-3.5 flex flex-col justify-between h-[280px]">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-teal-400 uppercase block">
                  📜 郡县要务实时治安公告
                </span>
                
                <div className="mt-3 space-y-2.5 max-h-[195px] overflow-y-auto text-[10.5px] font-mono leading-relaxed pr-1 text-slate-400">
                  {interiorLogs.map((log, idx) => (
                    <div key={idx} className="border-l border-slate-800 pl-2 py-0.5">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-[9.5px] text-slate-600 font-mono text-center">
                ● 明公秉笔批示・实时百业更新
              </div>
            </div>

          </div>

        </div>
      ) : mapTab === 'war-mode' ? (
        <WarMode
          originCity={CITIES.find(c => c.id === expeditionOriginId) || CITIES[0]}
          targetCity={CITIES.find(c => c.id === expeditionTargetId) || CITIES[1]}
          attackerFaction={FACTIONS.find(f => f.id === originControllerId) || FACTIONS[5]}
          defenderFaction={FACTIONS.find(f => f.id === (cityOwnership[expeditionTargetId] || 'ronin')) || FACTIONS[5]}
          attackingOfficer={officers.find(o => o.id === selectedGeneralId) || null}
          defendingOfficer={officers.filter(o => o.factionId === (cityOwnership[expeditionTargetId] || 'ronin'))[0] || null}
          weatherId={weatherId}
          soundEnabled={soundEnabled}
          onBattleComplete={handleBattleComplete}
          onClose={() => setMapTab('svg-map')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {CITIES.map(city => {
            const controllerId = cityOwnership[city.id] || 'ronin';
            const faction = FACTIONS.find(f => f.id === controllerId) || FACTIONS[5];
            const stationed = officers.filter(o => o.factionId === controllerId);
            const isOrig = expeditionOriginId === city.id;
            const isTarg = expeditionTargetId === city.id;
            const isSelected = selectedCityId === city.id;
            
            // Strategic metadata tags & info
            let tag = '';
            let defenseScore = 40;
            let defenseName = '在野荒屯';
            let defenseClass = 'text-slate-500 bg-slate-900/40 border-slate-800/60';
            
            if (city.id === 'beiping') { tag = '幽燕边塞'; }
            else if (city.id === 'ye') { tag = '河北要冲'; }
            else if (city.id === 'changan') { tag = '秦关重堑'; }
            else if (city.id === 'luoyang') { tag = '司隶旧都'; }
            else if (city.id === 'xuchang') { tag = '许昌屯田'; }
            else if (city.id === 'xiapi') { tag = '徐州古镇'; }
            else if (city.id === 'wancheng') { tag = '宛城守备'; }
            else if (city.id === 'hanzhong') { tag = '汉中大门'; }
            else if (city.id === 'chengdu') { tag = '巴蜀天府'; }
            else if (city.id === 'jianning') { tag = '南中荒蛮'; }
            else if (city.id === 'jingzhou') { tag = '荆襄水路'; }
            else if (city.id === 'chaisang') { tag = '柴桑要埠'; }
            else if (city.id === 'jianye') { tag = '虎啸江东'; }
            else if (city.id === 'kuaiji') { tag = '越吴米仓'; }
            else if (city.id === 'dunhuang') { tag = '丝路阳关'; }
            else if (city.id === 'kucha') { tag = '龟兹佛都'; }
            else if (city.id === 'shule') { tag = '葱岭玉门'; }
            else if (city.id === 'guishuang') { tag = '贵霜界关'; }
            else if (city.id === 'xianbei') { tag = '漠北穹庐'; }
            else if (city.id === 'liucheng') { tag = '白狼雄塞'; }
            else if (city.id === 'xiangping') { tag = '辽东公孙'; }
            else if (city.id === 'wandu') { tag = '高句丽岩'; }
            else if (city.id === 'lelang') { tag = '汉四郡治'; }
            else if (city.id === 'yamatai') { tag = '亲魏倭国'; }
            else if (city.id === 'jiaozhi') { tag = '交州百越'; }
            else if (city.id === 'funan') { tag = '湄公热海'; }
            else if (city.id === 'tianzhu_pass') { tag = '身毒商脉'; }

            if (controllerId === 'wei') {
              defenseScore = 90;
              defenseName = '重峦堡壁';
              defenseClass = 'text-amber-400 bg-amber-950/20 border-amber-500/30';
            } else if (controllerId === 'shu') {
              defenseScore = 88;
              defenseName = '天堑雄关';
              defenseClass = 'text-emerald-400 bg-emerald-950/20 border-emerald-500/30';
            } else if (controllerId === 'wu') {
              defenseScore = 85;
              defenseName = '艨艟铁壁';
              defenseClass = 'text-teal-400 bg-teal-950/20 border-teal-500/30';
            } else if (controllerId === 'yuanshao') {
              defenseScore = 80;
              defenseName = '列阵高墙';
              defenseClass = 'text-sky-400 bg-sky-950/20 border-sky-500/30';
            } else if (city.theater === 'silkroad' || city.theater === 'steppe' || city.theater === 'eastsea' || city.theater === 'southeast') {
              defenseScore = 65;
              defenseName = '异邦险隘';
              defenseClass = 'text-indigo-400 bg-indigo-950/20 border-indigo-500/30';
            }

            return (
              <div 
                id={`all-cities-card-${city.id}`}
                key={city.id} 
                className={`bg-slate-950/90 border rounded-2xl p-5 hover:scale-[1.01] transition-all relative flex flex-col justify-between overflow-hidden gap-4 shadow-xl ${
                  isSelected ? 'border-amber-500 ring-1 ring-amber-500/30' : 'border-slate-900/85 hover:border-slate-800'
                }`}
              >
                {/* Visual origin/target beacons */}
                {(isOrig || isTarg) && (
                  <div className="absolute top-0 right-12 flex gap-1 z-10">
                    {isOrig && (
                      <span className="bg-emerald-500 text-slate-950 font-mono text-[8px] font-black px-1.5 py-0.5 rounded-b border-x border-b border-emerald-400">
                        ORIG 起
                      </span>
                    )}
                    {isTarg && (
                      <span className="bg-rose-500 text-slate-100 font-mono text-[8px] font-black px-1.5 py-0.5 rounded-b border-x border-b border-rose-400">
                        TARG 迄
                      </span>
                    )}
                  </div>
                )}

                {/* Top Title Section */}
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9.5px] px-1.5 py-0.5 bg-slate-900 text-slate-400 border border-slate-800 rounded font-bold font-mono">
                          {city.region}
                        </span>
                        <span className={`text-[9.5px] px-1.5 py-0.5 rounded font-mono border ${defenseClass}`}>
                          {tag}
                        </span>
                      </div>
                      <h4 className="text-base font-serif font-black text-slate-200 mt-2 flex items-center gap-1.5">
                        🏯 {city.name}
                        <span className="text-[10px] font-mono text-slate-500 font-light uppercase">
                          {city.pinyin}
                        </span>
                      </h4>
                    </div>

                    {/* Controller Picker */}
                    <div className="text-right">
                      <label htmlFor={`picker-${city.id}`} className="text-[8.5px] font-mono text-slate-500 block mb-0.5">主政势力</label>
                      <select
                        id={`picker-${city.id}`}
                        value={controllerId}
                        onChange={(e) => handleModifyController(city.id, e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-[10px] text-slate-300 rounded font-serif px-1.5 py-0.5 focus:outline-none focus:border-slate-700 cursor-pointer"
                      >
                        {FACTIONS.map(f => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Lore Description */}
                  <p className="text-[11.5px] text-slate-400 leading-relaxed font-sans mt-3 border-l-2 border-slate-900 pl-2.5">
                    {city.description}
                  </p>
                </div>

                {/* Strategic stats & force structure */}
                <div className="space-y-3.5 border-t border-slate-900/60 pt-3.5">
                  {weatherId === 'foggy' && !isOrig && !isSelected && controllerId !== originControllerId ? (
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-dashed border-slate-900 space-y-2 text-center py-5">
                      <p className="text-[14px] leading-none animate-pulse">🌫️</p>
                      <h5 className="text-[10px] font-serif font-bold text-slate-400">重雾漫布・视界受阻</h5>
                      <p className="text-[9px] font-sans text-slate-500 leading-normal">
                        非我军拥兵、起发或点选的城池防务，由于浓雾弥漫，探子已被阻隔，无法搜集细则情报。
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center text-[10.5px] font-mono">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Shield size={11.5} className="text-amber-500" />
                          治权防备度
                        </span>
                        <span className="text-slate-300">
                          <strong>{defenseScore}</strong>/100 ({defenseName})
                        </span>
                      </div>

                      {/* Faction Controller display details */}
                      <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-900/80 flex justify-between items-center text-[10.5px]">
                        <span className="text-slate-500 font-mono flex items-center gap-1">
                          <Flag size={11.5} className="text-amber-500" />
                          势力主君
                        </span>
                        <span className="font-serif font-bold" style={{ color: faction.color }}>
                          {faction.name} ({faction.ruler})
                        </span>
                      </div>

                      {/* Stationed Generals sublist */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                          <Users size={11.5} />
                          镇防武将名录 ({stationed.length})
                        </span>

                        {stationed.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-h-[60px] overflow-y-auto pr-1">
                            {stationed.map(o => (
                              <button
                                id={`btn-city-grid-officer-${o.id}`}
                                key={o.id}
                                type="button"
                                onClick={() => onSelectOfficer?.(o)}
                                className="text-[10px] bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 px-2 py-0.5 rounded text-amber-500 font-serif font-bold cursor-pointer transition-colors active:scale-95"
                              >
                                {o.name}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-650 italic">空虚无驻 (可自立招募或调配)</p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Local Action Triggers */}
                <div className="space-y-2 border-t border-slate-900/60 pt-3">
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      id={`btn-all-cities-set-orig-${city.id}`}
                      type="button"
                      onClick={() => {
                        setExpeditionOriginId(city.id);
                        setSelectedCityId(city.id);
                      }}
                      className={`text-[10px] font-mono py-1 rounded-lg border transition-all cursor-pointer text-center ${
                        isOrig 
                          ? 'bg-emerald-950/45 text-emerald-400 border-emerald-500/30' 
                          : 'bg-slate-900/80 text-slate-400 border-slate-850 hover:text-emerald-400 hover:bg-emerald-950/20'
                      }`}
                    >
                      📍 出发地
                    </button>
                    <button
                      id={`btn-all-cities-set-targ-${city.id}`}
                      type="button"
                      onClick={() => {
                        setExpeditionTargetId(city.id);
                        setSelectedCityId(city.id);
                      }}
                      className={`text-[10px] font-mono py-1 rounded-lg border transition-all cursor-pointer text-center ${
                        isTarg 
                          ? 'bg-rose-950/45 text-rose-400 border-rose-500/30' 
                          : 'bg-slate-900/80 text-slate-400 border-slate-850 hover:text-rose-400 hover:bg-rose-950/20'
                      }`}
                    >
                      🎯 攻伐地
                    </button>
                    <button
                      id={`btn-all-cities-focus-${city.id}`}
                      type="button"
                      onClick={() => {
                        setSelectedCityId(city.id);
                        setMapTab('svg-map');
                      }}
                      className="text-[10px] font-mono py-1 rounded-lg bg-slate-900/80 text-amber-500 border border-slate-850 hover:bg-slate-800 hover:text-amber-400 text-center cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1"
                    >
                      <Eye size={10} /> 聚焦
                    </button>
                  </div>

                  <button
                    id={`btn-all-cities-interior-${city.id}`}
                    type="button"
                    onClick={() => {
                      setSelectedCityId(city.id);
                      setMapTab('city-view');
                    }}
                    className="w-full text-xs font-serif font-bold py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/50 hover:border-emerald-700/80 rounded-lg text-center cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Home size={12} /> 进入城筑
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Underneath: Expedition & Combat March simulator (Classic visual game-like panel) */}
      <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-12 gap-6 relative overflow-hidden">
        
        {/* Expedition Form column (Span 5) */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-1.5 border-b border-slate-900 pb-2">
            <Swords size={16} className="text-amber-500 animate-pulse" />
            <h3 className="text-base font-serif font-black text-amber-500 uppercase tracking-wider">
              大军师中军帐：发兵调度模拟器
            </h3>
          </div>

          <form onSubmit={handleLaunchExpedition} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">🚩 起源郡地</label>
                <select
                  id="select-exp-origin"
                  value={expeditionOriginId}
                  onChange={(e) => setExpeditionOriginId(e.target.value)}
                  disabled={isExpeditionRunning}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3 py-2 text-xs"
                >
                  {ASIA_THEATERS.filter(t => t.id !== 'all').map(th => {
                    const thCities = CITIES.filter(c => c.theater === th.id);
                    if (thCities.length === 0) return null;
                    return (
                      <optgroup key={th.id} label={`${th.icon} ${th.name}`}>
                        {thCities.map(c => {
                          const owner = cityOwnership[c.id] || 'ronin';
                          const fact = FACTIONS.find(f => f.id === owner)?.name || '在野';
                          return (
                            <option key={c.id} value={c.id}>{c.name} - {c.region} ({fact})</option>
                          );
                        })}
                      </optgroup>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">🎯 进攻/调遣郡地</label>
                <select
                  id="select-exp-target"
                  value={expeditionTargetId}
                  onChange={(e) => setExpeditionTargetId(e.target.value)}
                  disabled={isExpeditionRunning}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3 py-2 text-xs"
                >
                  {ASIA_THEATERS.filter(t => t.id !== 'all').map(th => {
                    const thCities = CITIES.filter(c => c.theater === th.id);
                    if (thCities.length === 0) return null;
                    return (
                      <optgroup key={th.id} label={`${th.icon} ${th.name}`}>
                        {thCities.map(c => {
                          const owner = cityOwnership[c.id] || 'ronin';
                          const fact = FACTIONS.find(f => f.id === owner)?.name || '在野';
                          return (
                            <option key={c.id} value={c.id}>{c.name} - {c.region} ({fact})</option>
                          );
                        })}
                      </optgroup>
                    );
                  })}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">⚔️ 位挂主帅大将</label>
              {leadersAvailable.length > 0 ? (
                <select
                  id="select-exp-general"
                  value={selectedGeneralId}
                  onChange={(e) => setSelectedGeneralId(e.target.value)}
                  disabled={isExpeditionRunning}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3 py-2.5 text-xs font-serif font-medium"
                >
                  {leadersAvailable.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.name} (武力 {o.stats.force} | 统帅 {o.stats.leadership})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-[10.5px] p-2 text-rose-400 bg-rose-950/20 border border-rose-950/30 rounded-xl">
                  ⚠️ 此起源城池由于为【在野/中立】或无可用武将驻扎，大军无法召集统帅！请先从下方调拨势力，或去“自立武将”板块登用其入仕此地势力。
                </div>
              )}
            </div>

            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900 text-[11px] text-slate-400 space-y-1">
              <div className="flex justify-between font-mono">
                <span>远征策略形式:</span>
                <span className={originControllerId === cityOwnership[expeditionTargetId] ? 'text-emerald-400' : 'text-rose-400'}>
                  {originControllerId === cityOwnership[expeditionTargetId] ? '🛡️ 内部粮草输配 / 兵力调配' : '⚔️ 主动军势讨伐 / 攻城掠地'}
                </span>
              </div>
              <p className="text-[9.5px] text-slate-500 leading-relaxed">
                内部输送调遣胜率必然为 100%；攻伐敌方领地将对领军大将的五维属性（统帅与武力值）有着极高的硬考量，高属性可显著增加克关斩将几率。
              </p>
            </div>

            <button
              id="btn-launch-exp"
              type="submit"
              disabled={isExpeditionRunning || leadersAvailable.length === 0}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-xs font-black uppercase tracking-widest py-3 px-4 rounded-xl transition duration-300 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Play size={12} fill="currentColor" />
              {isExpeditionRunning ? '大军兵临绝地，推演克敌中...' : '传令三军：发兵演武！'}
            </button>

            {originControllerId !== (cityOwnership[expeditionTargetId] || 'ronin') && (
              <button
                id="btn-launch-war-mode-direct"
                type="button"
                onClick={() => setMapTab('war-mode')}
                disabled={isExpeditionRunning || leadersAvailable.length === 0}
                className="w-full bg-[linear-gradient(135deg,#e11d48,_#be123c)] hover:bg-[linear-gradient(135deg,#f43f5e,_#e11d48)] disabled:opacity-45 text-slate-50 text-xs font-black uppercase tracking-widest py-3 px-4 rounded-xl transition duration-300 shadow-lg flex items-center justify-center gap-1.5 cursor-pointer border border-rose-500/30"
              >
                <Sword size={12} className="text-slate-50" />
                <span>亲自指挥攻城（手动合战役）</span>
              </button>
            )}
          </form>
        </div>

        {/* Scrolling logs visual column (Span 7) */}
        <div className="md:col-span-7 bg-slate-950 border border-slate-900 p-4 rounded-2xl flex flex-col justify-between min-h-[250px]">
          <div className="flex justify-between items-center border-b border-slate-900 pb-2 mb-2">
            <span className="text-xs font-mono font-bold text-teal-400 flex items-center gap-1">
              <Hourglass size={12} className={isExpeditionRunning ? 'animate-spin' : ''} />
              战役军机演武日志滚动屏
            </span>
            {isExpeditionRunning && (
              <span className="text-[10px] font-mono text-amber-500">
                攻关胜算率: <strong className="text-slate-100">{expeditionSuccessRate}%</strong>
              </span>
            )}
          </div>

          <div className="flex-1 bg-slate-950 p-3 rounded-xl border border-slate-900 font-mono text-xs text-slate-300 max-h-[190px] overflow-y-auto space-y-2.5">
            {expeditionLogs.length > 0 ? (
              expeditionLogs.map((log, idx) => (
                <div key={idx} className="border-l-2 border-slate-800 pl-2.5 leading-relaxed py-0.5">
                  <p className="text-slate-200">{log}</p>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-8 text-center text-slate-600 space-y-2">
                <Compass size={28} className="text-slate-800" />
                <div>
                  <p className="text-xs">军机处目前一片沉寂。</p>
                  <p className="text-[10px] text-slate-600 mt-0.5 max-w-sm">
                    在左侧配置兵力起点、目标点以及领受挂帅的名帅，点击【发兵演武】。孔明大军师将统筹汇报实时对阵推演。
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Staggered progress indicator bar */}
          {isExpeditionRunning && (
            <div className="mt-3 grid grid-cols-4 gap-1">
              {[
                { name: '安营誓师', step: 0 },
                { name: '关山急行', step: 1 },
                { name: '城下搏杀', step: 2 },
                { name: '捷报克城', step: 3 }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="h-1.5 rounded bg-slate-900 overflow-hidden">
                    <div 
                      className={`h-full rounded transition-all duration-500 ${
                        expeditionStep >= item.step 
                          ? idx === 3 && expeditionLogs.some(l => l.includes('攻城受阻')) 
                            ? 'bg-rose-500' 
                            : 'bg-emerald-500' 
                          : 'bg-slate-900'
                      }`}
                      style={{ width: expeditionStep >= item.step ? '100%' : '0%' }}
                    />
                  </div>
                  <p className={`text-[9px] font-sans text-center truncate ${
                    expeditionStep >= item.step ? 'text-amber-400 font-bold' : 'text-slate-500'
                  }`}>
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
