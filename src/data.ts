import { Faction, Officer, CampaignScenario, RelationshipRelation } from './types';
const liubeiPortrait = '/portraits/liubei.jpg';
const caocaoPortrait = '/portraits/caocao.jpg';
const sunquanPortrait = '/portraits/sunquan.jpg';
const guanyuPortrait = '/portraits/guanyu.jpg';
const zhugeliangPortrait = '/portraits/zhugeliang.jpg';
const lubuPortrait = '/portraits/lubu.jpg';
const zhouyuPortrait = '/portraits/zhouyu.jpg';
const caesarPortrait = '/portraits/caesar.jpg';
const trumpPortrait = '/portraits/trump.jpg';
const alexanderPortrait = '/portraits/alexander.jpg';
const marcusAureliusPortrait = '/portraits/marcus_aurelius.jpg';
const hannibalPortrait = '/portraits/hannibal.jpg';
const himikoPortrait = '/portraits/himiko.jpg';
const kanishkaPortrait = '/portraits/kanishka.jpg';
const ardashirPortrait = '/portraits/ardashir.jpg';
const ashokaPortrait = '/portraits/ashoka.jpg';
const cleopatraPortrait = '/portraits/cleopatra.jpg';
const moduPortrait = '/portraits/modu.jpg';
const einsteinPortrait = '/portraits/einstein.jpg';
const napoleonPortrait = '/portraits/napoleon.jpg';
const putinPortrait = '/portraits/putin.jpg';
const catherinePortrait = '/portraits/catherine.jpg';
const wuzetianPortrait = '/portraits/wuzetian.jpg';
const qianlongPortrait = '/portraits/qianlong.jpg';
const libaiPortrait = '/portraits/libai.jpg';
const yingzhengPortrait = '/portraits/yingzheng.jpg';
const lishiminPortrait = '/portraits/lishimin.jpg';
const liujiPortrait = '/portraits/liuji.jpg';
const tangbohuPortrait = '/portraits/tangbohu.jpg';
const daqiaoPortrait = '/portraits/daqiao.jpg';
const xiaoqiaoPortrait = '/portraits/xiaoqiao.jpg';
const xishiPortrait = '/portraits/xishi.jpg';
const diaochanPortrait = '/portraits/diaochan.jpg';
const wangzhaojunPortrait = '/portraits/wangzhaojun.jpg';
const yanghuaiyuPortrait = '/portraits/yanghuaiyu.jpg';
const macronPortrait = '/portraits/macron.jpg';
const vdlPortrait = '/portraits/von_der_leyen.jpg';
const merkelPortrait = '/portraits/merkel.jpg';
const ruttePortrait = '/portraits/rutte.jpg';
const jettenPortrait = '/portraits/jetten.jpg';

export const FACTIONS: Faction[] = [
  {
    id: 'shu',
    name: '蜀汉',
    ruler: '刘备',
    color: '#10b981', // green-500
    description: '以仁、义、信为核心的复汉联盟。拥有卓越的骑兵和杰出的猛将，但在早期领土范围非常受限。',
    crest: '🐉 蜀 (绿)'
  },
  {
    id: 'wei',
    name: '曹魏',
    ruler: '曹操',
    color: '#3b82f6', // blue-500
    description: '统领中国北方的绝对霸主。在政治、行政效率、贤士统御和广阔富庶的主城领土上拥有统治级优势。',
    crest: '🦅 魏 (蓝)'
  },
  {
    id: 'wu',
    name: '孙吴',
    ruler: '孙权',
    color: '#ef4444', // red-500
    description: '长江水道的守护神，拥有几乎无法攻破的地理长堑。海军攻防傲视群雄，部属具有磐石般的协同忠诚。',
    crest: '🐯 吴 (红)'
  },
  {
    id: 'lubu',
    name: '吕布军',
    ruler: '吕布',
    color: '#a855f7', // purple-500
    description: '由乱世战神吕布统领的一群无畏蛮勇战将。拥有无与伦比的瞬间战场杀伤力，但在内政、政略与外交上极为脆弱。',
    crest: '⚡ 吕 (紫)'
  },
  {
    id: 'yuanshao',
    name: '袁绍军',
    ruler: '袁绍',
    color: '#eab308', // yellow-500
    description: '名震四世三公之门阀贵族。物资财富惊人，兵员招募极其庞大，但决策经常陷入多疑犹豫和内部势力斗争。',
    crest: '👑 袁 (金)'
  },
  {
    id: 'rome',
    name: '罗马帝国',
    ruler: '尤利乌斯·恺撒',
    color: '#dc2626', // red-600
    description: '古典地中海文明霸主与法治帝国。重装军团严整如坚不可摧的移动铁壁，拥有高超的工程筑城与大兵团会战统御力。',
    crest: '🏛️ 罗马 (赤金)'
  },
  {
    id: 'macedon',
    name: '马其顿帝国',
    ruler: '亚历山大大帝',
    color: '#0284c7', // sky-600
    description: '横跨欧亚非的马其顿远征铁军。所向披靡的长枪方阵与王家重骑兵雷霆冲锋，行军神速，远征未尝一败。',
    crest: '⚡ 马其顿 (蔚蓝)'
  },
  {
    id: 'persia',
    name: '波斯萨珊',
    ruler: '阿尔达希尔一世',
    color: '#0d9488', // teal-600
    description: '重振古波斯荣光的沙漠高原帝国。尊拜火教为国教，全副铁甲不死重骑兵冲锋与精湛回马复合骑射令西方震颤。',
    crest: '🌙 萨珊 (青碧)'
  },
  {
    id: 'kushan',
    name: '贵霜帝国',
    ruler: '迦腻色迦大帝',
    color: '#d97706', // amber-600
    description: '扼守中亚丝绸之路枢纽的财富天国。佛法宏大，东西文明交汇，兼具丝路铁甲重骑与南亚披甲战象军团。',
    crest: '🪷 贵霜 (宝金)'
  },
  {
    id: 'yamatai',
    name: '邪马台国',
    ruler: '卑弥呼女王',
    color: '#db2777', // pink-600
    description: '东海瀛洲三十余部联合女王国。以神圣鬼道幻术安抚万民，精通东瀛海岛伏击与灵巫阵法，大魏明帝亲赐金印。',
    crest: '🔮 邪马台 (绯樱)'
  },
  {
    id: 'carthage',
    name: '迦太基国',
    ruler: '汉尼拔·巴卡',
    color: '#92400e', // amber-800
    description: '北非地中海航海与陆战战术奇迹。驯养庞大披甲战象践踏撕裂敌军步骑阵线，以精妙绝伦的双翼包夹歼灭强敌。',
    crest: '🐘 迦太基 (古铜)'
  },
  {
    id: 'steppe',
    name: '塞外草原',
    ruler: '冒顿单于',
    color: '#4f46e5', // indigo-600
    description: '纵横欧亚大草原的游牧控弦霸主。来如飞鸟，去如绝弦，以全地形狂飙游击与穿透鸣镝射术称霸塞北。',
    crest: '🏹 匈奴 (苍狼)'
  },
  {
    id: 'france',
    name: '法兰西第一帝国',
    ruler: '拿破仑·波拿巴',
    color: '#1e40af', // blue-800
    description: '横扫欧陆的近代炮兵与军团体系革新帝国。以纵队突击与空前集中的炮火碾压旧式王国联軍，大军团行军神速，战无不胜之名震慑四海。',
    crest: '⚜️ 法兰西 (帝王蓝)'
  },
  {
    id: 'russia',
    name: '俄罗斯帝国',
    ruler: '叶卡捷琳娜二世',
    color: '#15803d', // green-700
    description: '横跨欧亚的极北双头鹰帝国。哥萨克骑兵神出鬼没，冬将军令一切入侵者葬身雪原，宫廷内政开明与文化科学事业空前繁荣。',
    crest: '🦅 俄罗斯 (双头鹰绿)'
  },
  {
    id: 'wuzhou',
    name: '大周王朝',
    ruler: '武则天',
    color: '#be185d', // pink-700
    description: '华夏唯一正统女皇武则天所开创的大周神朝。迁都神都洛阳，革新科举，广开言路，破格擢拔天下寒门良才，国泰民安，威服四夷。',
    crest: '👑 大周 (金凤)'
  },
  {
    id: 'qing',
    name: '大清帝国',
    ruler: '乾隆',
    color: '#d97706', // amber-600
    description: '坐镇紫禁城、统领满蒙汉八旗与十全武功的大清帝国。十次远征开拓巩固疆域近一千三百万平方公里，盛世修典，国力鼎盛。',
    crest: '🐉 大清 (黄龙)'
  },
  {
    id: 'qin',
    name: '大秦帝国',
    ruler: '嬴政',
    color: '#1e293b', // slate-800
    description: '奋六世之余烈、振长策而御宇内的大秦帝国。车同轨书同文，修筑万里长城，大秦铁鹰锐士与百步连弩军纪森严，气吞山河。',
    crest: '⚔️ 大秦 (玄黑)'
  },
  {
    id: 'tang',
    name: '大唐帝国',
    ruler: '李世民',
    color: '#ea580c', // orange-600
    description: '开创“贞观之治”、四海升平的大唐天朝。天策上将亲统黑甲玄甲铁骑横扫诸雄，天下四夷尊为“天可汗”，海纳百川，威仪天下。',
    crest: '☀️ 大唐 (天策赤金)'
  },
  {
    id: 'ming',
    name: '大明帝国',
    ruler: '朱元璋',
    color: '#b91c1c', // red-700
    description: '驱逐胡虏、恢复中华之大明帝国。日月山河永在，封狼居胥，郑和七下西洋扬威四海，神机火器与锦衣卫名震天下。',
    crest: '☀️ 大明 (日月赤朱)'
  },
  {
    id: 'america',
    name: '美利坚合众国',
    ruler: '特朗普',
    color: '#2563eb', // blue-600
    description: '跨越大西洋与太平洋的现代工业与金融巨擘。拥有繁荣的全球商贸航路、尖端科技创新与雄厚资本实力。',
    crest: '🦅 美利坚 (星条蓝)'
  },
  {
    id: 'germany',
    name: '德意志',
    ruler: '爱因斯坦',
    color: '#475569', // slate-600
    description: '崇尚严谨哲学与近代现代科学探索的欧陆重邦。以深刻的思想革命、工业精密制造与划时代物理相对论理论闻名于世。',
    crest: '⚙️ 德意志 (铁鹰墨灰)'
  },
  {
    id: 'europe',
    name: '欧洲联盟',
    ruler: '乌尔苏拉·冯德莱恩',
    color: '#0284c7', // sky-600
    description: '统合二十七国、以规则与共同市场立身的超国家联盟。没有一兵一卒却能动用空前之制裁、关税与援助杠杆，绿色新政与数字法度为其新剑。',
    crest: '🌟 欧盟 (星环蓝)'
  },
  {
    id: 'netherlands',
    name: '尼德兰王国',
    ruler: '马克·吕特',
    color: '#ea580c', // orange-600
    description: '低地之国、围海造田的商人共和国。以运河、港口与转口贸易富甲四方，善以妥协斡旋与务实谈判在强国夹缝中左右逢源。',
    crest: '🦁 尼德兰 (橙狮)'
  },
  {
    id: 'ronin',
    name: '在野 (在野武将)',
    ruler: '无',
    color: '#6b7280', // gray-500
    description: '漂泊在外的游侠或者名士。可于各大郡城游历，结识英雄，或选择结交明君谋求出仕，或自立召集游侠行侠仗义！',
    crest: '🍂 在野 (在野)'
  }
];

export const AVAILABLE_TRAITS = [
  '仁德 (提升声望与信赖程度)',
  '枭雄 (面对优势敌军时力量获得额外成长)',
  '卧龙 (策略消耗大幅降低，且免受计略乾坤)',
  '军神 (以无双霸道震慑周围低统帅敌军并强行开启单挑)',
  '美周郎 (大幅提高我方士气及水军行军移动)',
  '威风 (突击攻击时显著削弱周围敌军之防御)',
  '神算 (奇门陷阱与火计策略之成功率、杀伤力大幅增强)',
  '警惕 (免疫来自后方的伏击和奇袭包夹)',
  '雄心 (提升个人武将统御及兵力募集上限)',
  '忠义 (大幅降低战斗中被俘虏、策反成敌方之可能)',
  '征服者 (远征军行军速度与士气大幅提升，攻击异域要塞有额外斩获)',
  '帝国方阵 (重装步兵防御与抗骑兵冲击能力显著增强)',
  '战象神威 (冲锋时令周围敌军陷入恐慌动摇并削弱其士气)',
  '鬼道神巫 (施展神秘咒术安抚治下万民并诱使敌阵迷乱)',
  '转轮圣王 (仁爱德化四海，所在领地治安稳定且商业税赋极大提升)',
  '万王之王 (波斯铁骑与精锐弓骑协同突击，杀伤力呈破甲倍增)',
  '日月凌空 (女主临朝，独步千古，治下民心安定且百官忠诚激增)',
  '十全武功 (疆域开拓、万国来朝，远征后勤与八旗兵锋消耗大幅降低)',
  '诗仙剑圣 (斗酒百篇，仗剑天涯，策谋奇袭暴击与个人魅力冠绝天下)',
  '千古一帝 (扫灭六国，车同轨书同文，集权统御与攻城拔寨战力极度强大)',
  '天可汗 (天下四夷万国宗仰，玄甲精骑冲锋势不可挡，且广纳贤士忠诚倍增)',
  '江南第一才子 (诗书画三绝，行军与计略暴击令人叹服，风流洒脱倾倒世人)',
  '商业狂澜 (谈判与交易交涉暴击，金钱税赋收益大幅提升)',
  '质能神算 (计谋与物理学推演暴击，算无遗策)',
  '铁腕意志 (全军在严寒雪地与极地逆境中士气不减)',
  '神机妙算 (精通奇门遁甲与天象推演，策谋识破率100%)'
];

export const AVAILABLE_SKILLS = [
  '突击 (造成恐怖的近战冲撞伤害)',
  '火计 (点燃目标区域地格，火焰随风方向蔓延)',
  '齐射 (发动大范围远程箭雨压制)',
  '挑衅 (强迫目标敌军失去冷静，暴露出防守破绽)',
  '混乱 (施展诡诈奇策瘫痪敌军，智力高者成功率更高)',
  '奇袭 (穿越丛林灌木发动奔袭，无视城墙防守防线)',
  '单挑 (开启惊心动魄的1对1武将武艺对决)',
  '治疗 (恢复重伤士兵的编制数并激发高昂士气)',
  '铁壁 (短时间内进入物理与计谋免疫的无敌状态)',
  '罗马龟甲阵 (步兵结成严密封闭盾墙，免疫绝大部分远程箭矢伤害)',
  '雷霆远征 (以雷霆万钧之势奔袭敌军核心指挥所)',
  '迦太基战象 (驱使庞大披甲战象践踏撕裂敌军步骑阵线)',
  '帕提亚回马射 (伪装溃退诱敌深入，突然回身射出致命穿透重箭)',
  '鬼道迷离 (施展东海神巫法术使敌全军陷入迷雾与幻境混乱)',
  '日月当空 (以无上女皇威仪震慑敌军全阵，削弱其士气与策谋成功率)',
  '十全平定 (调动满蒙汉八旗与神机营连环火器轰击，阵地固若金汤)',
  '青莲剑歌 (十步杀一人，千里不留行，以疾风骤雨般的快剑发动无双刺杀)',
  '横扫六合 (调动大秦锐士与万弩齐发，对周围敌阵造成毁灭性重创)',
  '玄甲破阵 (亲率天下无双的大唐玄甲重骑纵横驰骋，强行撕裂敌军防线并震慑诸军)',
  '桃花绝笔 (以书画墨韵化为惑敌迷雾，使大范围敌军陷入恍惚与士气大跌)',
  '金权制裁 (以庞大财力与禁运压制敌军士气)',
  '时空裂解 (引发剧烈质能爆发重创大范围敌军方阵)',
  '极地风暴 (召唤严寒冰雪阵地削弱敌方移速与战力)',
  '斩龙神策 (洞悉天时地理，引发天火与落石击溃敌军阵型)'
];

export const FAMOUS_OFFICERS: Officer[] = [
  {
    id: 'liubei',
    name: '刘备',
    gender: 'Male',
    styleName: '玄德',
    englishName: 'Liu Bei',
    origin: '华夏三国 · 蜀汉',
    isGlobalLeader: false,
    factionId: 'shu',
    avatarStyle: {
      portrait: liubeiPortrait,
      hairColor: '#1e293b',
      hairStyle: 'Topknot Imperial',
      armorColor: '#10b981',
      accessory: 'Golden Sovereign Crown',
      expression: 'Warm Smiling',
      bgGradient: 'from-emerald-950 to-teal-900'
    },
    stats: {
      leadership: 80,
      force: 75,
      intelligence: 78,
      politics: 80,
      charisma: 99
    },
    traits: ['仁德 (提升声望与信赖程度)', '忠义 (大幅降低战斗中被俘虏、策反成敌方之可能)'],
    skills: ['挑衅 (强迫目标敌军失去冷静，暴露出防守破绽)', '治疗 (恢复重伤士兵的编制数并激发高昂士气)'],
    biography: '汉朝皇室后裔，从一织席贩履之辈崛起为蜀汉昭烈皇帝。他赢得了关羽、张飞和传奇军师诸葛亮的绝对忠诚与毕生追随。他以仁义治天下，深受百姓拥戴，一生致力于匡扶汉室。'
  },
  {
    id: 'caocao',
    name: '曹操',
    gender: 'Male',
    styleName: '孟德',
    englishName: 'Cao Cao',
    origin: '华夏三国 · 曹魏',
    isGlobalLeader: false,
    factionId: 'wei',
    avatarStyle: {
      portrait: caocaoPortrait,      hairColor: '#0f172a',
      hairStyle: 'Noble Court Crown',
      armorColor: '#3b82f6',
      accessory: 'Engraved Commander Sword',
      expression: 'Cold Sovereign',
      bgGradient: 'from-blue-950 to-indigo-950'
    },
    stats: {
      leadership: 98,
      force: 72,
      intelligence: 92,
      politics: 94,
      charisma: 95
    },
    traits: ['枭雄 (面对优势敌军时力量获得额外成长)', '雄心 (提升个人武将统御及兵力募集上限)'],
    skills: ['突击 (造成恐怖的近战冲撞伤害)', '混乱 (施展诡诈奇策瘫痪敌军，智力高者成功率更高)', '铁壁 (短时间内进入物理与计谋免疫的无敌状态)'],
    biography: '杰出的军事家、诗人和政治家，统一了中国北方。身为大汉丞相，他拥有强大的军事铁腕，“宁我负人，毋人负我”。他唯才是举，不拘一格招纳天下贤士。'
  },
  {
    id: 'sunquan',
    name: '孙权',
    gender: 'Male',
    styleName: '仲谋',
    englishName: 'Sun Quan',
    origin: '华夏三国 · 孙吴',
    isGlobalLeader: false,
    factionId: 'wu',
    avatarStyle: {
      portrait: sunquanPortrait,      hairColor: '#c2410c',
      hairStyle: 'Red-Bearded Sovereign',
      armorColor: '#ef4444',
      accessory: 'Ancient Tiger Seal',
      expression: 'Stately Guarded',
      bgGradient: 'from-orange-950 to-red-950'
    },
    stats: {
      leadership: 79,
      force: 68,
      intelligence: 80,
      politics: 89,
      charisma: 92
    },
    traits: ['警惕 (免疫来自后方的伏击和奇袭包夹)', '忠义 (大幅降低战斗中被俘虏、策反成敌方之可能)'],
    skills: ['齐射 (发动大范围远程箭雨压制)', '治疗 (恢复重伤士兵的编制数并激发高昂士气)'],
    biography: '继承父兄孙坚、孙策基业，坚守江南江东。在水战策略配合下，他联合刘备在赤壁之战大破曹军，后开创孙吴，成为东吴开国皇帝。'
  },
  {
    id: 'guanyu',
    name: '关羽',
    gender: 'Male',
    styleName: '云长',
    englishName: 'Guan Yu',
    origin: '华夏三国 · 蜀汉',
    isGlobalLeader: false,
    factionId: 'shu',
    avatarStyle: {
      portrait: guanyuPortrait,      hairColor: '#0f172a',
      hairStyle: 'Long Bound Mane',
      armorColor: '#059669',
      accessory: 'Green Dragon Crescent Blade',
      expression: 'Stern Loyal Face',
      bgGradient: 'from-green-950 to-emerald-950'
    },
    stats: {
      leadership: 95,
      force: 97,
      intelligence: 75,
      politics: 62,
      charisma: 94
    },
    traits: ['军神 (以无双霸道震慑周围低统帅敌军并强行开启单挑)', '忠义 (大幅降低战斗中被俘虏、策反成敌方之可能)'],
    skills: ['突击 (造成恐怖的近战冲撞伤害)', '单挑 (开启惊心动魄的1对1武将武艺对决)', '铁壁 (短时间内进入物理与计谋免疫的无敌状态)'],
    biography: '刘备的义弟，因其绝伦武艺、赤胆忠心和浩然正气被世人尊封为“武圣”。他曾过五关斩六将，千里走单骑寻兄，镇守荆州，威震华夏。'
  },
  {
    id: 'zhugeliang',
    name: '诸葛亮',
    gender: 'Male',
    styleName: '孔明',
    englishName: 'Zhuge Liang',
    origin: '华夏三国 · 蜀汉',
    isGlobalLeader: false,
    factionId: 'shu',
    avatarStyle: {
      portrait: zhugeliangPortrait,      hairColor: '#1e293b',
      hairStyle: 'Scholar Jade Headdress',
      armorColor: '#f8fafc',
      accessory: 'Feather Daoist Fan',
      expression: 'Brilliant Calm',
      bgGradient: 'from-emerald-950 to-sky-950'
    },
    stats: {
      leadership: 93,
      force: 38,
      intelligence: 100,
      politics: 98,
      charisma: 96
    },
    traits: ['卧龙 (策略消耗大幅降低，且免受计略乾坤)', '神算 (奇门陷阱与火计策略之成功率、杀伤力大幅增强)'],
    skills: ['火计 (点燃目标区域地格，火焰随风方向蔓延)', '混乱 (施展诡诈奇策瘫痪敌军，智力高者成功率更高)'],
    biography: '外交大师与传奇发明家、军师。被刘备三顾茅庐隆中对出山，擘画三分天下。他鞠躬尽瘁，死而后已，北伐曹魏建立万代英名。'
  },
  {
    id: 'lubu',
    name: '吕布',
    gender: 'Male',
    styleName: '奉先',
    englishName: 'Lu Bu',
    origin: '华夏三国 · 群雄',
    isGlobalLeader: false,
    factionId: 'lubu',
    avatarStyle: {
      portrait: lubuPortrait,
      hairColor: '#171717',
      hairStyle: 'Pheasant-Tail Ribbon',
      armorColor: '#7e22ce',
      accessory: 'Sky Piercer Halberd',
      expression: 'Fierce Roaring',
      bgGradient: 'from-purple-950 to-pink-950'
    },
    stats: {
      leadership: 87,
      force: 100,
      intelligence: 26,
      politics: 13,
      charisma: 40
    },
    traits: ['军神 (以无双霸道震慑周围低统帅敌军并强行开启单挑)', '威风 (突击攻击时显著削弱周围敌军之防御)'],
    skills: ['突击 (造成恐怖的近战冲撞伤害)', '单挑 (开启惊心动魄的1对1武将武艺对决)', '奇袭 (穿越丛林灌木发动奔袭，无视城墙防守防线)'],
    biography: '被誉为“人中吕布，马中赤兔”的天下第一猛将。然而他因见利忘义、数度反叛义父和盟友而饱受诟病，最终在下邳被曹操曹军和刘备围剿擒杀。'
  },
  {
    id: 'zhouyu',
    name: '周瑜',
    gender: 'Male',
    styleName: '公瑾',
    englishName: 'Zhou Yu',
    origin: '华夏三国 · 孙吴',
    isGlobalLeader: false,
    factionId: 'wu',
    avatarStyle: {
      portrait: zhouyuPortrait,      hairColor: '#1e293b',
      hairStyle: 'Sleek Admiral Knot',
      armorColor: '#fb923c',
      accessory: 'Commander Baton and Lute',
      expression: 'Elegant Confident',
      bgGradient: 'from-rose-950 to-amber-950'
    },
    stats: {
      leadership: 96,
      force: 71,
      intelligence: 96,
      politics: 86,
      charisma: 94
    },
    traits: ['美周郎 (大幅提高我方士气及水军行军移动)', '神算 (奇门陷阱与火计策略之成功率、杀伤力大幅增强)'],
    skills: ['火计 (点燃目标区域地格，火焰随风方向蔓延)', '混乱 (施展诡诈奇策瘫痪敌军，智力高者成功率更高)', '齐射 (发动大范围远程箭雨压制)'],
    biography: `东吴大都督。精通音律，足智多谋，在赤壁之战中运用精妙的连环火计，将曹操庞大的连锁水师战船烧成灰烬。`
  },
  // ====== 世界群雄领袖 (Great Global Leaders) ======
  {
    id: 'caesar',
    name: '尤利乌斯·恺撒',
    gender: 'Male',
    styleName: '盖乌斯',
    englishName: 'Julius Caesar',
    origin: '罗马帝国 (大秦)',
    isGlobalLeader: true,
    factionId: 'rome',
    avatarStyle: {
      portrait: caesarPortrait,      hairColor: '#4b5563',
      hairStyle: 'Noble Court Crown',
      armorColor: '#dc2626',
      accessory: 'Golden Sovereign Crown',
      expression: 'Cold Sovereign',
      bgGradient: 'from-red-950 via-rose-950 to-slate-950'
    },
    stats: {
      leadership: 98,
      force: 86,
      intelligence: 95,
      politics: 98,
      charisma: 97
    },
    traits: ['征服者 (远征军行军速度与士气大幅提升，攻击异域要塞有额外斩获)', '帝国方阵 (重装步兵防御与抗骑兵冲击能力显著增强)', '雄心 (提升个人武将统御及兵力募集上限)'],
    skills: ['罗马龟甲阵 (步兵结成严密封闭盾墙，免疫绝大部分远程箭矢伤害)', '突击 (造成恐怖的近战冲撞伤害)', '铁壁 (短时间内进入物理与计谋免疫的无敌状态)', '混乱 (施展诡诈奇策瘫痪敌军，智力高者成功率更高)'],
    biography: '罗马共和国终身独裁官、法治奠基人与卓越军事统帅。他征服高卢，渡过卢比孔河，以“我来，我见，我征服”（Veni, vidi, vici）传檄千古。他改革儒略历，其威名成为西方历代皇帝之代名词。'
  },
  {
    id: 'trump',
    name: '特朗普',
    gender: 'Male',
    styleName: '商业大亨 · 地产之王',
    englishName: 'Donald J. Trump',
    origin: '北美合众国 · 纽约',
    isGlobalLeader: true,
    factionId: 'america',
    avatarStyle: {
      portrait: trumpPortrait,      hairColor: '#b45309',
      hairStyle: 'Long Bound Mane',
      armorColor: '#2563eb',
      accessory: 'Golden Sovereign Crown',
      expression: 'Fierce Roaring',
      bgGradient: 'from-blue-950 via-red-950 to-slate-950'
    },
    stats: {
      leadership: 92,
      force: 72,
      intelligence: 85,
      politics: 95,
      charisma: 98
    },
    traits: [
      '商业狂澜 (谈判与交易交涉暴击，金钱税赋收益大幅提升)',
      '雄心 (提升个人武将统御及兵力募集上限)',
      '威风 (突击攻击时显著削弱周围敌军之防御)'
    ],
    skills: [
      '金权制裁 (以庞大财力与禁运压制敌军士气)',
      '挑衅 (强迫目标敌军失去冷静，暴露出防守破绽)',
      '铁壁 (短时间内进入物理与计谋免疫的无敌状态)',
      '混乱 (施展诡诈奇策瘫痪敌军，智力高者成功率更高)'
    ],
    biography: '美国著名企业家与第45及47任总统。早年叱咤华尔街与曼哈顿房地产界，著有商业畅销书《交易的艺术》，以极具个人特色的谈判风格与大众号召力闻名全球。在国际舞台上推行“美国优先”、强硬关税贸易交涉与商业减税，重塑当代全球地缘政治与经济竞争格局。'
  },
  {
    id: 'alexander',
    name: '亚历山大大帝',
    gender: 'Male',
    styleName: '无双霸主',
    englishName: 'Alexander the Great',
    origin: '马其顿帝国',
    isGlobalLeader: true,
    factionId: 'macedon',
    avatarStyle: {
      portrait: alexanderPortrait,      hairColor: '#b45309',
      hairStyle: 'Long Bound Mane',
      armorColor: '#0284c7',
      accessory: 'Engraved Commander Sword',
      expression: 'Brilliant Calm',
      bgGradient: 'from-sky-950 via-indigo-950 to-slate-950'
    },
    stats: {
      leadership: 100,
      force: 95,
      intelligence: 93,
      politics: 86,
      charisma: 99
    },
    traits: ['征服者 (远征军行军速度与士气大幅提升，攻击异域要塞有额外斩获)', '军神 (以无双霸道震慑周围低统帅敌军并强行开启单挑)', '雄心 (提升个人武将统御及兵力募集上限)'],
    skills: ['雷霆远征 (以雷霆万钧之势奔袭敌军核心指挥所)', '突击 (造成恐怖的近战冲撞伤害)', '单挑 (开启惊心动魄的1对1武将武艺对决)', '奇袭 (穿越丛林灌木发动奔袭，无视城墙防守防线)'],
    biography: '古希腊马其顿国王、人类战史上最富传奇色彩的征服者之一。二十岁受命于危难，率马其顿方阵与伙伴重骑兵横跨欧亚非，十年征战荡平波斯帝国，兵锋直抵印度河流域，一生未尝一败。'
  },
  {
    id: 'marcus_aurelius',
    name: '马可·奥勒留',
    gender: 'Male',
    styleName: '哲人皇帝',
    englishName: 'Marcus Aurelius',
    origin: '罗马帝国 (安敦尼王朝)',
    isGlobalLeader: true,
    factionId: 'rome',
    avatarStyle: {
      portrait: marcusAureliusPortrait,      hairColor: '#4b5563',
      hairStyle: 'Red-Bearded Sovereign',
      armorColor: '#dc2626',
      accessory: 'Golden Sovereign Crown',
      expression: 'Stately Guarded',
      bgGradient: 'from-amber-950 via-red-950 to-slate-950'
    },
    stats: {
      leadership: 88,
      force: 62,
      intelligence: 96,
      politics: 97,
      charisma: 98
    },
    traits: ['仁德 (提升声望与信赖程度)', '神算 (奇门陷阱与火计策略之成功率、杀伤力大幅增强)', '忠义 (大幅降低战斗中被俘虏、策反成敌方之可能)'],
    skills: ['罗马龟甲阵 (步兵结成严密封闭盾墙，免疫绝大部分远程箭矢伤害)', '治疗 (恢复重伤士兵的编制数并激发高昂士气)', '铁壁 (短时间内进入物理与计谋免疫的无敌状态)', '挑衅 (强迫目标敌军失去冷静，暴露出防守破绽)'],
    biography: '罗马帝国“五贤帝”最后一位，古罗马斯多葛派哲学家皇帝。其在位时期恰值中国东汉桓、灵之世，《后汉书》记载大秦王安敦遣使通好即指其人。他一边在多瑙河前线抵御蛮族，一边写就千古传世名篇《沉思录》。'
  },
  {
    id: 'hannibal',
    name: '汉尼拔·巴卡',
    gender: 'Male',
    styleName: '战术之父',
    englishName: 'Hannibal Barca',
    origin: '迦太基共和国',
    isGlobalLeader: true,
    factionId: 'carthage',
    avatarStyle: {
      portrait: hannibalPortrait,      hairColor: '#1e293b',
      hairStyle: 'Noble Court Crown',
      armorColor: '#92400e',
      accessory: 'Engraved Commander Sword',
      expression: 'Cold Sovereign',
      bgGradient: 'from-amber-950 via-yellow-950 to-slate-950'
    },
    stats: {
      leadership: 99,
      force: 91,
      intelligence: 99,
      politics: 76,
      charisma: 94
    },
    traits: ['神算 (奇门陷阱与火计策略之成功率、杀伤力大幅增强)', '战象神威 (冲锋时令周围敌军陷入恐慌动摇并削弱其士气)', '警惕 (免疫来自后方的伏击和奇袭包夹)'],
    skills: ['迦太基战象 (驱使庞大披甲战象践踏撕裂敌军步骑阵线)', '奇袭 (穿越丛林灌木发动奔袭，无视城墙防守防线)', '混乱 (施展诡诈奇策瘫痪敌军，智力高者成功率更高)', '挑衅 (强迫目标敌军失去冷静，暴露出防守破绽)'],
    biography: '北非迦太基传奇统帅，公认的西方战略之父。曾亲率包含披甲战象的雇佣军跨越险峻严寒的阿尔卑斯山，在坎尼会战中以完美的双翼包夹歼灭七万罗马大军，令罗马元老院闻其名而色变二十载。'
  },
  {
    id: 'himiko',
    name: '卑弥呼女王',
    gender: 'Female',
    styleName: '亲魏倭王',
    englishName: 'Queen Himiko',
    origin: '邪马台国 (扶桑瀛洲)',
    isGlobalLeader: true,
    factionId: 'yamatai',
    avatarStyle: {
      portrait: himikoPortrait,      hairColor: '#0f172a',
      hairStyle: 'Scholar Jade Headdress',
      armorColor: '#db2777',
      accessory: 'Feather Daoist Fan',
      expression: 'Warm Smiling',
      bgGradient: 'from-pink-950 via-purple-950 to-slate-950'
    },
    stats: {
      leadership: 84,
      force: 42,
      intelligence: 94,
      politics: 93,
      charisma: 99
    },
    traits: ['鬼道神巫 (施展神秘咒术安抚治下万民并诱使敌阵迷乱)', '仁德 (提升声望与信赖程度)', '卧龙 (策略消耗大幅降低，且免受计略乾坤)'],
    skills: ['鬼道迷离 (施展东海神巫法术使敌全军陷入迷雾与幻境混乱)', '治疗 (恢复重伤士兵的编制数并激发高昂士气)', '混乱 (施展诡诈奇策瘫痪敌军，智力高者成功率更高)', '齐射 (发动大范围远程箭雨压制)'],
    biography: '东瀛邪马台国传奇女王，《三国志·魏志·倭人传》详尽载录其生平。善事鬼道，能惑聚万民，平定倭国百年内乱并统御三十余部。景初二年遣使抵洛阳朝贡，大魏明帝曹叡特赐金印紫绶，册封其为“亲魏倭王”。'
  },
  {
    id: 'kanishka',
    name: '迦腻色迦一世',
    gender: 'Male',
    styleName: '贵霜大帝',
    englishName: 'Kanishka I the Great',
    origin: '贵霜帝国 (大月氏)',
    isGlobalLeader: true,
    factionId: 'kushan',
    avatarStyle: {
      portrait: kanishkaPortrait,      hairColor: '#171717',
      hairStyle: 'Topknot Imperial',
      armorColor: '#d97706',
      accessory: 'Golden Sovereign Crown',
      expression: 'Stately Guarded',
      bgGradient: 'from-amber-950 via-yellow-950 to-stone-950'
    },
    stats: {
      leadership: 94,
      force: 84,
      intelligence: 92,
      politics: 96,
      charisma: 96
    },
    traits: ['转轮圣王 (仁爱德化四海，所在领地治安稳定且商业税赋极大提升)', '雄心 (提升个人武将统御及兵力募集上限)', '仁德 (提升声望与信赖程度)'],
    skills: ['突击 (造成恐怖的近战冲撞伤害)', '铁壁 (短时间内进入物理与计谋免疫的无敌状态)', '治疗 (恢复重伤士兵的编制数并激发高昂士气)', '齐射 (发动大范围远程箭雨压制)'],
    biography: '贵霜帝国极盛时期的大帝，大月氏贵霜翎侯之后裔。帝国版图跨越兴都库什山、帕米尔高原与北印度恒河流域，扼守丝绸之路欧亚贸易十字路口。他召集第四次佛教结集，极力庇护犍陀罗佛像艺术与东西文明交融。'
  },
  {
    id: 'ardashir',
    name: '阿尔达希尔一世',
    gender: 'Male',
    styleName: '万王之王',
    englishName: 'Ardashir I',
    origin: '波斯萨珊帝国',
    isGlobalLeader: true,
    factionId: 'persia',
    avatarStyle: {
      portrait: ardashirPortrait,      hairColor: '#0f172a',
      hairStyle: 'Red-Bearded Sovereign',
      armorColor: '#0d9488',
      accessory: 'Engraved Commander Sword',
      expression: 'Cold Sovereign',
      bgGradient: 'from-teal-950 via-emerald-950 to-slate-950'
    },
    stats: {
      leadership: 95,
      force: 89,
      intelligence: 90,
      politics: 94,
      charisma: 93
    },
    traits: ['万王之王 (波斯铁骑与精锐弓骑协同突击，杀伤力呈破甲倍增)', '枭雄 (面对优势敌军时力量获得额外成长)', '征服者 (远征军行军速度与士气大幅提升，攻击异域要塞有额外斩获)'],
    skills: ['帕提亚回马射 (伪装溃退诱敌深入，突然回身射出致命穿透重箭)', '突击 (造成恐怖的近战冲撞伤害)', '单挑 (开启惊心动魄的1对1武将武艺对决)', '铁壁 (短时间内进入物理与计谋免疫的无敌状态)'],
    biography: '波斯第二帝国（萨珊王朝）开国神王（公元224年登基，正值华夏三国鼎立之年）。他以铁血手腕推翻统治波斯四百余年的安息帝国，重铸阿契美尼德波斯雄风，确立拜火教国教地位并整肃近卫铁骑军团。'
  },
  {
    id: 'ashoka',
    name: '阿育王',
    gender: 'Male',
    styleName: '天爱喜见王',
    englishName: 'Ashoka the Great',
    origin: '孔雀帝国 (身毒天竺)',
    isGlobalLeader: true,
    factionId: 'kushan',
    avatarStyle: {
      portrait: ashokaPortrait,      hairColor: '#1e293b',
      hairStyle: 'Noble Court Crown',
      armorColor: '#d97706',
      accessory: 'Golden Sovereign Crown',
      expression: 'Warm Smiling',
      bgGradient: 'from-yellow-950 via-amber-950 to-stone-950'
    },
    stats: {
      leadership: 94,
      force: 83,
      intelligence: 93,
      politics: 99,
      charisma: 100
    },
    traits: ['转轮圣王 (仁爱德化四海，所在领地治安稳定且商业税赋极大提升)', '仁德 (提升声望与信赖程度)', '雄心 (提升个人武将统御及兵力募集上限)'],
    skills: ['迦太基战象 (驱使庞大披甲战象践踏撕裂敌军步骑阵线)', '治疗 (恢复重伤士兵的编制数并激发高昂士气)', '铁壁 (短时间内进入物理与计谋免疫的无敌状态)', '齐射 (发动大范围远程箭雨压制)'],
    biography: '古印度孔雀帝国第三代君主，南亚次大陆最伟大的千古一帝。在武力平定羯陵伽国后深感杀戮之孽，遂皈依佛门弘扬正法，立阿育王石柱训谕万民，广开医院与驿站，其四头雄狮柱头今为印度国徽。'
  },
  {
    id: 'cleopatra',
    name: '克利奥帕特拉七世',
    gender: 'Female',
    styleName: '尼罗河女王',
    englishName: 'Cleopatra VII',
    origin: '托勒密埃及',
    isGlobalLeader: true,
    factionId: 'carthage',
    avatarStyle: {
      portrait: cleopatraPortrait,      hairColor: '#0f172a',
      hairStyle: 'Scholar Jade Headdress',
      armorColor: '#92400e',
      accessory: 'Golden Sovereign Crown',
      expression: 'Elegant Confident',
      bgGradient: 'from-amber-950 via-rose-950 to-purple-950'
    },
    stats: {
      leadership: 78,
      force: 38,
      intelligence: 96,
      politics: 96,
      charisma: 100
    },
    traits: ['美周郎 (大幅提高我方士气及水军行军移动)', '枭雄 (面对优势敌军时力量获得额外成长)', '神算 (奇门陷阱与火计策略之成功率、杀伤力大幅增强)'],
    skills: ['挑衅 (强迫目标敌军失去冷静，暴露出防守破绽)', '混乱 (施展诡诈奇策瘫痪敌军，智力高者成功率更高)', '齐射 (发动大范围远程箭雨压制)', '治疗 (恢复重伤士兵的编制数并激发高昂士气)'],
    biography: '托勒密埃及王朝最后的统治女王。才华横溢，通晓九国语言，擅长利用卓越的外交手腕、倾国倾城的魅力与超凡的政治智慧周旋于罗马巨头恺撒与安东尼之间，维系埃及数十年富庶繁荣。'
  },
  {
    id: 'modu',
    name: '冒顿单于',
    gender: 'Male',
    styleName: '撑犁孤涂单于',
    englishName: 'Modu Chanyu',
    origin: '塞外草原 (匈奴帝国)',
    isGlobalLeader: true,
    factionId: 'steppe',
    avatarStyle: {
      portrait: moduPortrait,      hairColor: '#171717',
      hairStyle: 'Long Bound Mane',
      armorColor: '#4f46e5',
      accessory: 'Sky Piercer Halberd',
      expression: 'Fierce Roaring',
      bgGradient: 'from-indigo-950 via-blue-950 to-slate-950'
    },
    stats: {
      leadership: 97,
      force: 95,
      intelligence: 92,
      politics: 88,
      charisma: 91
    },
    traits: ['征服者 (远征军行军速度与士气大幅提升，攻击异域要塞有额外斩获)', '军神 (以无双霸道震慑周围低统帅敌军并强行开启单挑)', '威风 (突击攻击时显著削弱周围敌军之防御)'],
    skills: ['帕提亚回马射 (伪装溃退诱敌深入，突然回身射出致命穿透重箭)', '突击 (造成恐怖的近战冲撞伤害)', '奇袭 (穿越丛林灌木发动奔袭，无视城墙防守防线)', '单挑 (开启惊心动魄的1对1武将武艺对决)'],
    biography: '匈奴帝国开国大单于，北方游牧草原文明最杰出的统帅。他发明鸣镝射术统一军纪，东灭东胡，西逐月氏，降服楼烦白羊，开创控弦三十万的北方大帝国，曾于白登山以精骑四十万将汉高祖刘邦层层围困。'
  },
  {
    id: 'einstein',
    name: '爱因斯坦',
    gender: 'Male',
    styleName: '相对论宗师 · 现代物理之父',
    englishName: 'Albert Einstein',
    origin: '德意志 · 乌尔姆',
    isGlobalLeader: true,
    factionId: 'germany',
    avatarStyle: {
      portrait: einsteinPortrait,      hairColor: '#4b5563',
      hairStyle: 'Scholar Jade Headdress',
      armorColor: '#6b7280',
      accessory: 'Feather Daoist Fan',
      expression: 'Brilliant Calm',
      bgGradient: 'from-slate-950 via-indigo-950 to-zinc-950'
    },
    stats: {
      leadership: 82,
      force: 55,
      intelligence: 100,
      politics: 80,
      charisma: 96
    },
    traits: [
      '质能神算 (计谋与物理学推演暴击，算无遗策)',
      '神算 (奇门陷阱与火计策略之成功率、杀伤力大幅增强)',
      '仁德 (提升声望与信赖程度)'
    ],
    skills: [
      '时空裂解 (引发剧烈质能爆发重创大范围敌军方阵)',
      '混乱 (施展诡诈奇策瘫痪敌军，智力高者成功率更高)',
      '火计 (点燃目标区域地格，火焰随风方向蔓延)',
      '治疗 (恢复重伤士兵的编制数并激发高昂士气)'
    ],
    biography: '二十世纪最伟大的物理学家、现代物理学奠基人，相对论创立者。1905年“奇迹年”提出狭义相对论与光量子假说，后创立广义相对论，揭示质能等价方程E=mc²，彻底革新人类对时空、能量与宇宙引力的认知，1921年荣获诺贝尔物理学奖。毕生致力于和平主义与人类理性的真理探索。'
  },
  {
    id: 'napoleon',
    name: '拿破仑·波拿巴',
    gender: 'Male',
    styleName: '科西嘉战神',
    englishName: 'Napoleon Bonaparte',
    origin: '法兰西第一帝国',
    isGlobalLeader: true,
    factionId: 'france',
    avatarStyle: {
      portrait: napoleonPortrait,      hairColor: '#1e293b',
      hairStyle: 'Noble Court Crown',
      armorColor: '#1e40af',
      accessory: 'Engraved Commander Sword',
      expression: 'Brilliant Calm',
      bgGradient: 'from-blue-950 via-indigo-950 to-slate-950'
    },
    stats: {
      leadership: 99,
      force: 82,
      intelligence: 97,
      politics: 93,
      charisma: 95
    },
    traits: ['征服者 (远征军行军速度与士气大幅提升，攻击异域要塞有额外斩获)', '雄心 (提升个人武将统御及兵力募集上限)', '神算 (奇门陷阱与火计策略之成功率、杀伤力大幅增强)'],
    skills: ['雷霆远征 (以雷霆万钧之势奔袭敌军核心指挥所)', '齐射 (发动大范围远程箭雨压制)', '突击 (造成恐怖的近战冲撞伤害)', '铁壁 (短时间内进入物理与计谋免疫的无敌状态)'],
    biography: '法兰西第一帝国皇帝、近代军事科学之奠基者，号“科西嘉战神”。出身炮兵少尉，在奥斯特里茨会战中以集中炮火与纵队突击一日击溃俄奥联军，横扫欧陆诸王。其《拿破仑法典》至今仍为欧陆民法之基石，一生六十余役仅尝数败。'
  },
  {
    id: 'putin',
    name: '普丁',
    gender: 'Male',
    styleName: '克里姆林铁腕',
    englishName: 'Vladimir Putin',
    origin: '俄罗斯 · 莫斯科',
    isGlobalLeader: true,
    factionId: 'russia',
    avatarStyle: {
      portrait: putinPortrait,      hairColor: '#1e293b',
      hairStyle: 'Noble Court Crown',
      armorColor: '#15803d',
      accessory: 'Engraved Commander Sword',
      expression: 'Cold Sovereign',
      bgGradient: 'from-emerald-950 via-slate-950 to-cyan-950'
    },
    stats: {
      leadership: 98,
      force: 85,
      intelligence: 94,
      politics: 96,
      charisma: 93
    },
    traits: [
      '铁腕意志 (全军在严寒雪地与极地逆境中士气不减)',
      '警惕 (免疫来自后方的伏击和奇袭包夹)',
      '雄心 (提升个人武将统御及兵力募集上限)'
    ],
    skills: [
      '极地风暴 (召唤严寒冰雪阵地削弱敌方移速与战力)',
      '奇袭 (穿越丛林灌木发动奔袭，无视城墙防守防线)',
      '突击 (造成恐怖的近战冲撞伤害)',
      '铁壁 (短时间内进入物理与计谋免疫的无敌状态)'
    ],
    biography: '俄罗斯联邦卓越政治家与长期最高领导人。早年任职于情报部门，后入主克里姆林宫，以铁腕手段稳定国内动荡局势、整肃寡头、重振能源与军工国防体系。在国际大国地缘博弈中行事极其沉着果断，捍卫欧亚大陆战略纵深，对21世纪全球地缘政治格局产生极其深远之影响。'
  },
  {
    id: 'catherine',
    name: '叶卡捷琳娜二世',
    gender: 'Female',
    styleName: '女皇大帝',
    englishName: 'Catharina II Aleksejevna',
    origin: '俄罗斯帝国 (双头鹰)',
    isGlobalLeader: true,
    factionId: 'russia',
    avatarStyle: {
      portrait: catherinePortrait,      hairColor: '#b45309',
      hairStyle: 'Scholar Jade Headdress',
      armorColor: '#15803d',
      accessory: 'Golden Sovereign Crown',
      expression: 'Elegant Confident',
      bgGradient: 'from-green-950 via-emerald-950 to-slate-950'
    },
    stats: {
      leadership: 91,
      force: 46,
      intelligence: 94,
      politics: 98,
      charisma: 99
    },
    traits: ['雄心 (提升个人武将统御及兵力募集上限)', '枭雄 (面对优势敌军时力量获得额外成长)', '仁德 (提升声望与信赖程度)'],
    skills: ['齐射 (发动大范围远程箭雨压制)', '挑衅 (强迫目标敌军失去冷静，暴露出防守破绽)', '治疗 (恢复重伤士兵的编制数并激发高昂士气)', '铁壁 (短时间内进入物理与计谋免疫的无敌状态)'],
    biography: '俄罗斯帝国罗曼诺夫王朝女皇，德意志公主嫁入俄廷，以雄才大略登基称帝，史称“叶卡捷琳娜大帝”。她开明施政、广兴文教，与伏尔泰狄德罗鸿雁论政；南疆吞并克里米亚、西境瓜分波兰，将双头鹰版图推向极盛，堪称与彼得大帝齐名之一代雄主。'
  },
  {
    id: 'wuzetian',
    name: '武则天',
    gender: 'Female',
    styleName: '圣神皇帝 · 武曌',
    englishName: 'Wu Zetian (Empress Regnant)',
    origin: '大周神都 · 洛阳',
    isGlobalLeader: true,
    factionId: 'wuzhou',
    avatarStyle: {
      portrait: wuzetianPortrait,      hairColor: '#0f172a',
      hairStyle: 'Scholar Jade Headdress',
      armorColor: '#be185d',
      accessory: 'Golden Sovereign Crown',
      expression: 'Cold Sovereign',
      bgGradient: 'from-rose-950 via-purple-950 to-amber-950'
    },
    stats: {
      leadership: 93,
      force: 42,
      intelligence: 98,
      politics: 100,
      charisma: 99
    },
    traits: [
      '日月凌空 (女主临朝，独步千古，治下民心安定且百官忠诚激增)',
      '雄心 (提升个人武将统御及兵力募集上限)',
      '枭雄 (面对优势敌军时力量获得额外成长)'
    ],
    skills: [
      '日月当空 (以无上女皇威仪震慑敌军全阵，削弱其士气与策谋成功率)',
      '混乱 (施展诡诈奇策瘫痪敌军，智力高者成功率更高)',
      '治疗 (恢复重伤士兵的编制数并激发高昂士气)',
      '铁壁 (短时间内进入物理与计谋免疫的无敌状态)'
    ],
    biography: '华夏历史上唯一的正统大一统女皇帝，改国号为周，定都神都洛阳。从才人登临九五之尊，明察善断，革新科举创立殿试武举，不拘一格拔擢狄仁杰、张柬之、娄师德等治国名相；上承贞观之治，下启开元盛世。其一生波澜壮阔，立无字碑留待后人评说。'
  },
  {
    id: 'qianlong',
    name: '乾隆',
    gender: 'Male',
    styleName: '十全老人 · 弘历',
    englishName: 'Emperor Qianlong (Hongli)',
    origin: '大清帝国 · 紫禁城',
    isGlobalLeader: true,
    factionId: 'qing',
    avatarStyle: {
      portrait: qianlongPortrait,      hairColor: '#171717',
      hairStyle: 'Topknot Imperial',
      armorColor: '#eab308',
      accessory: 'Golden Sovereign Crown',
      expression: 'Stately Guarded',
      bgGradient: 'from-amber-950 via-yellow-950 to-slate-950'
    },
    stats: {
      leadership: 89,
      force: 75,
      intelligence: 92,
      politics: 95,
      charisma: 94
    },
    traits: [
      '十全武功 (疆域开拓、万国来朝，远征后勤与八旗兵锋消耗大幅降低)',
      '雄心 (提升个人武将统御及兵力募集上限)',
      '转轮圣王 (仁爱德化四海，所在领地治安稳定且商业税赋极大提升)'
    ],
    skills: [
      '十全平定 (调动满蒙汉八旗与神机营连环火器轰击，阵地固若金汤)',
      '齐射 (发动大范围远程箭雨压制)',
      '挑衅 (强迫目标敌军失去冷静，暴露出防守破绽)',
      '铁壁 (短时间内进入物理与计谋免疫的无敌状态)'
    ],
    biography: '清高宗爱新觉罗·弘历，在位六十年，训政三年，享年八十九岁，开创“乾隆盛世”。他自诩“十全老人”，两平准噶尔、定回部、两征金川，巩固近一千三百万平方公里版图；编纂《四库全书》，六下江南，巡幸海内，万国来朝，将大清文治武功推至鼎盛。'
  },
  {
    id: 'libai',
    name: '李白',
    gender: 'Male',
    styleName: '青莲居士 · 诗仙',
    englishName: 'Li Bai (Poet Immortal)',
    origin: '盛唐长安 · 青莲剑仙',
    isGlobalLeader: true,
    factionId: 'ronin',
    avatarStyle: {
      portrait: libaiPortrait,      hairColor: '#0f172a',
      hairStyle: 'Long Bound Mane',
      armorColor: '#f8fafc',
      accessory: 'Engraved Commander Sword',
      expression: 'Brilliant Calm',
      bgGradient: 'from-sky-950 via-indigo-950 to-slate-950'
    },
    stats: {
      leadership: 78,
      force: 88,
      intelligence: 98,
      politics: 72,
      charisma: 100
    },
    traits: [
      '诗仙剑圣 (斗酒百篇，仗剑天涯，策谋奇袭暴击与个人魅力冠绝天下)',
      '美周郎 (大幅提高我方士气及水军行军移动)',
      '神算 (奇门陷阱与火计策略之成功率、杀伤力大幅增强)'
    ],
    skills: [
      '青莲剑歌 (十步杀一人，千里不留行，以疾风骤雨般的快剑发动无双刺杀)',
      '单挑 (开启惊心动魄的1对1武将武艺对决)',
      '奇袭 (穿越丛林灌木发动奔袭，无视城墙防守防线)',
      '挑衅 (强迫目标敌军失去冷静，暴露出防守破绽)'
    ],
    biography: '唐代伟大的浪漫主义诗人，字太白，号青莲居士，世称“诗仙”、“酒中仙”。十五好剑术、遍干诸侯，三十成文章、历抵卿相。天宝初供奉翰林，因醉草吓蛮书名动长安，后仗剑漫游神州大川。“十步杀一人，千里不留行”，兼备惊世才情与盖世剑侠豪气。'
  },
  {
    id: 'yingzheng',
    name: '嬴政',
    gender: 'Male',
    styleName: '始皇帝 · 祖龙',
    englishName: 'Qin Shi Huang (Ying Zheng)',
    origin: '大秦帝国 · 咸阳',
    isGlobalLeader: true,
    factionId: 'qin',
    avatarStyle: {
      portrait: yingzhengPortrait,      hairColor: '#0f172a',
      hairStyle: 'Topknot Imperial',
      armorColor: '#1e293b',
      accessory: 'Golden Sovereign Crown',
      expression: 'Cold Sovereign',
      bgGradient: 'from-slate-950 via-zinc-900 to-black'
    },
    stats: {
      leadership: 99,
      force: 75,
      intelligence: 96,
      politics: 100,
      charisma: 97
    },
    traits: [
      '千古一帝 (扫灭六国，车同轨书同文，集权统御与攻城拔寨战力极度强大)',
      '雄心 (提升个人武将统御及兵力募集上限)',
      '威风 (突击攻击时显著削弱周围敌军之防御)'
    ],
    skills: [
      '横扫六合 (调动大秦锐士与万弩齐发，对周围敌阵造成毁灭性重创)',
      '齐射 (发动大范围远程箭雨压制)',
      '铁壁 (短时间内进入物理与计谋免疫的无敌状态)',
      '挑衅 (强迫目标敌军失去冷静，暴露出防守破绽)'
    ],
    biography: '秦庄襄王之子，十三岁继承秦王位，先后荡平韩、赵、魏、楚、燕、齐六国，结束春秋战国数百年割据，建立华夏历史上第一个大一统中央集权王朝，首创“皇帝”尊号。废分封立郡县，车同轨、书同文、统一度量衡，北击匈奴修筑万里长城，南征百越。被明代思想家李贽赞为“千古一帝”。'
  },
  {
    id: 'lishimin',
    name: '李世民',
    gender: 'Male',
    styleName: '唐太宗 · 天策上将',
    englishName: 'Emperor Taizong of Tang (Li Shimin)',
    origin: '大唐帝国 · 长安',
    isGlobalLeader: true,
    factionId: 'tang',
    avatarStyle: {
      portrait: lishiminPortrait,      hairColor: '#171717',
      hairStyle: 'Topknot Imperial',
      armorColor: '#ea580c',
      accessory: 'Engraved Commander Sword',
      expression: 'Inspiring General',
      bgGradient: 'from-amber-950 via-red-950 to-slate-950'
    },
    stats: {
      leadership: 100,
      force: 90,
      intelligence: 97,
      politics: 99,
      charisma: 99
    },
    traits: [
      '天可汗 (天下四夷万国宗仰，玄甲精骑冲锋势不可挡，且广纳贤士忠诚倍增)',
      '军神 (以无双霸道震慑周围低统帅敌军并强行开启单挑)',
      '仁德 (提升声望与信赖程度)'
    ],
    skills: [
      '玄甲破阵 (亲率天下无双的大唐玄甲重骑纵横驰骋，强行撕裂敌军防线并震慑诸军)',
      '突击 (造成恐怖的近战冲撞伤害)',
      '单挑 (开启惊心动魄的1对1武将武艺对决)',
      '混乱 (施展诡诈奇策瘫痪敌军，智力高者成功率更高)'
    ],
    biography: '唐高祖李渊次子，早年随父起兵晋阳，封秦王、拜天策上将。率天下精锐“玄甲军”先后平薛仁杲、刘武周、王世充、窦建德，一战擒双王，扫定中原。登基后励精图治，开创“贞观之治”，兼听纳谏重用魏征、房玄龄、杜如晦，北破突厥，西平高昌，被北方及西域诸国各民族万民共尊为“天可汗”。'
  },
  {
    id: 'liuji',
    name: '刘伯温',
    gender: 'Male',
    styleName: '诚意伯 · 神机军师',
    englishName: 'Liu Ji (Liu Bowen)',
    origin: '大明帝国 · 青田',
    isGlobalLeader: true,
    factionId: 'ming',
    avatarStyle: {
      portrait: liujiPortrait,      hairColor: '#171717',
      hairStyle: 'Scholar Jade Headdress',
      armorColor: '#b91c1c',
      accessory: 'Feather Daoist Fan',
      expression: 'Brilliant Calm',
      bgGradient: 'from-red-950 via-amber-950 to-slate-950'
    },
    stats: {
      leadership: 88,
      force: 58,
      intelligence: 100,
      politics: 98,
      charisma: 95
    },
    traits: [
      '神机妙算 (精通奇门遁甲与天象推演，策谋识破率100%)',
      '卧龙 (策略消耗大幅降低，且免受计略乾坤)',
      '神算 (奇门陷阱与火计策略之成功率、杀伤力大幅增强)'
    ],
    skills: [
      '斩龙神策 (洞悉天时地理，引发天火与落石击溃敌军阵型)',
      '火计 (点燃目标区域地格，火焰随风方向蔓延)',
      '混乱 (施展诡诈奇策瘫痪敌军，智力高者成功率更高)',
      '奇袭 (穿越丛林灌木发动奔袭，无视城墙防守防线)'
    ],
    biography: '明朝开国元勋、杰出政治家、文学家与军事谋略家，字伯温，谥号文成。通晓经史、天文律历与奇门遁甲。辅佐明太祖朱元璋统筹大计，平定陈友谅、张士诚，提出先灭陈后取张之策，并北伐驱逐蒙元，建立大明王朝，封诚意伯。民间广为流传“三分天下诸葛亮，一统江山刘伯温”，被世人尊为与诸葛孔明并驾齐驱之神机军师。'
  },
  {
    id: 'tangbohu',
    name: '唐伯虎',
    gender: 'Male',
    styleName: '唐寅 · 桃花庵主',
    englishName: 'Tang Bohu (Tang Yin)',
    origin: '大明帝国 · 苏州桃花庵',
    isGlobalLeader: true,
    factionId: 'ming',
    avatarStyle: {
      portrait: tangbohuPortrait,      hairColor: '#1e293b',
      hairStyle: 'Topknot Imperial',
      armorColor: '#fb923c',
      accessory: 'Engraved Commander Sword',
      expression: 'Warm Smiling',
      bgGradient: 'from-rose-950 via-amber-950 to-slate-950'
    },
    stats: {
      leadership: 66,
      force: 72,
      intelligence: 96,
      politics: 65,
      charisma: 98
    },
    traits: [
      '江南第一才子 (诗书画三绝，行军与计略暴击令人叹服，风流洒脱倾倒世人)',
      '美周郎 (大幅提高我方士气及水军行军移动)',
      '神算 (奇门陷阱与火计策略之成功率、杀伤力大幅增强)'
    ],
    skills: [
      '桃花绝笔 (以书画墨韵化为惑敌迷雾，使大范围敌军陷入恍惚与士气大跌)',
      '混乱 (施展诡诈奇策瘫痪敌军，智力高者成功率更高)',
      '挑衅 (强迫目标敌军失去冷静，暴露出防守破绽)',
      '奇袭 (穿越丛林灌木发动奔袭，无视城墙防守防线)'
    ],
    biography: '明代著名书画家、文学家，字伯虎，后改字子畏，号六如居士、桃花庵主，南直隶苏州府吴县人，位列“吴门四家”与“江南四大才子”之首。乡试夺得解元第一，名动天下；其诗书画三绝，行文俊朗洒脱，狂放不羁。“别人笑我忒疯癫，我笑他人看不穿；不见五陵豪杰墓，无花无酒锄作田”，名句传颂四海千古。'
  },
  {
    id: 'daqiao',
    name: '大乔',
    gender: 'Female',
    styleName: '江东二乔 · 国色',
    englishName: 'Da Qiao',
    origin: '华夏三国 · 江东庐江皖县',
    isGlobalLeader: false,
    factionId: 'wu',
    avatarStyle: {
      portrait: daqiaoPortrait,      hairColor: '#0f172a',
      hairStyle: 'Long Ribbon Hair',
      armorColor: '#db2777',
      accessory: 'Golden Phoenix Headdress',
      expression: 'Warm Serene',
      bgGradient: 'from-rose-950 via-pink-950 to-purple-950'
    },
    stats: {
      leadership: 62,
      force: 30,
      intelligence: 88,
      politics: 92,
      charisma: 97
    },
    traits: [
      '国色 (绝世姿容名动江东，大幅提升所在城池民心、治安与招募效率)',
      '贤淑 (内政建设与抚民成效大幅提升，安定后方)',
      '姐妹同心 (与妹小乔同阵时，全军士气大振)'
    ],
    skills: [
      '治疗 (恢复重伤士兵的编制数并激发高昂士气)',
      '安抚 (以温婉贤德安定城内民心，提升治安与士气)',
      '混乱 (施展诡诈奇策瘫痪敌军，智力高者成功率更高)'
    ],
    biography: '东汉末年江东庐江皖县乔公长女，与妹妹小乔并称“江东二乔”，皆为绝世美人。嫁与江东小霸王孙策为妻，端庄贤淑，深明大义。孙策早逝之后，其悉心扶持幼弟孙权稳定江东局势，于内室之中默默守护东吴基业，为吴国之稳固贡献良多。'
  },
  {
    id: 'xiaoqiao',
    name: '小乔',
    gender: 'Female',
    styleName: '江东二乔 · 倾城',
    englishName: 'Xiao Qiao',
    origin: '华夏三国 · 江东庐江皖县',
    isGlobalLeader: false,
    factionId: 'wu',
    avatarStyle: {
      portrait: xiaoqiaoPortrait,      hairColor: '#1e293b',
      hairStyle: 'Long Ribbon Hair',
      armorColor: '#a855f7',
      accessory: 'Silk Folding Fan',
      expression: 'Warm Smiling',
      bgGradient: 'from-purple-950 via-fuchsia-950 to-indigo-950'
    },
    stats: {
      leadership: 58,
      force: 32,
      intelligence: 90,
      politics: 82,
      charisma: 98
    },
    traits: [
      '国色 (绝世姿容倾城倾国，大幅提升所在城池民心与招募效率)',
      '美周郎 (与夫周瑜同心协力，大幅提高我方士气及水军行军移动)',
      '姐妹同心 (与姊大乔同阵时，全军士气大振)'
    ],
    skills: [
      '鼓舞 (以琴音与笑靥大幅提升我方全军士气与行军速度)',
      '治疗 (恢复重伤士兵的编制数并激发高昂士气)',
      '混乱 (施展诡诈奇策瘫痪敌军，智力高者成功率更高)'
    ],
    biography: '东汉末年乔公次女、大乔之妹，与姊并称“江东二乔”。嫁与东吴大都督周瑜为妻，夫妻恩爱，琴瑟和鸣。周瑜赤壁鏖兵、运筹帷幄之际，小乔于内室操持后方、抚慰军心，其温婉聪慧传为佳话。苏轼《念奴娇》中“小乔初嫁了，雄姿英发”之名句千古流传。'
  },
  {
    id: 'xishi',
    name: '西施',
    gender: 'Female',
    styleName: '西子 · 浣纱女',
    englishName: 'Xi Shi (Xizi)',
    origin: '春秋越国 · 苎萝村浣纱溪',
    isGlobalLeader: false,
    factionId: 'wu',
    avatarStyle: {
      portrait: xishiPortrait,      hairColor: '#0f172a',
      hairStyle: 'Long Flowing Hair',
      armorColor: '#f8fafc',
      accessory: 'Pearl Moon Headdress',
      expression: 'Elegant Confident',
      bgGradient: 'from-slate-800 via-cyan-950 to-blue-950'
    },
    stats: {
      leadership: 55,
      force: 25,
      intelligence: 95,
      politics: 88,
      charisma: 100
    },
    traits: [
      '沉鱼 (四大美女之首，鱼见之沉入水底；魅力无远弗届，大幅瓦解敌军斗志)',
      '美人计 (以绝世姿容迷惑敌军主将，使其沉溺享乐、荒废军政，敌城内政与防御大幅衰退)',
      '忍辱负重 (身处敌营而初心不改，混乱与挑衅类计策成功率极高)'
    ],
    skills: [
      '倾国 (以绝世姿容迷惑敌军主将，使其部队陷入混乱与士气崩溃)',
      '挑衅 (强迫目标敌军失去冷静，暴露出防守破绽)',
      '混乱 (施展诡诈奇策瘫痪敌军，智力高者成功率更高)',
      '治疗 (恢复重伤士兵的编制数并激发高昂士气)'
    ],
    biography: '春秋末期越国苎萝村浣纱女，位列中国古代“四大美女”之首，有“沉鱼”之貌。越国败于吴国后，西施受越王勾践与范蠡所托，以绝世姿容入吴宫惑吴王夫差，使其沉溺享乐、荒废朝政，终助越国“三千越甲可吞吴”完成复国大业。功成之后相传随范蠡泛舟五湖，杳然遁世。'
  },
  {
    id: 'diaochan',
    name: '貂蝉',
    gender: 'Female',
    styleName: '闭月 · 貂蝉舞姬',
    englishName: 'Diaochan',
    origin: '华夏三国 · 东汉司徒府歌伎',
    isGlobalLeader: false,
    factionId: 'lubu',
    avatarStyle: {
      portrait: diaochanPortrait,      hairColor: '#0f172a',
      hairStyle: 'Long Ribbon Hair',
      armorColor: '#be185d',
      accessory: 'Golden Phoenix Headdress',
      expression: 'Warm Serene',
      bgGradient: 'from-rose-950 via-red-950 to-slate-950'
    },
    stats: {
      leadership: 60,
      force: 28,
      intelligence: 92,
      politics: 80,
      charisma: 99
    },
    traits: [
      '闭月 (四大美女之“闭月”，明月见之亦自惭隐没；魅力深不可测，大幅瓦解敌军斗志)',
      '连环计 (巧施连环之计离间强敌父子，使其反目相残，敌军内乱、城防大幅衰退)',
      '舞姬 (歌舞惑敌，敌将斗志与行军速度大幅下降，我方士气提升)'
    ],
    skills: [
      '离间 (以绝世姿容离间敌军主将与其麾下部将，使其互相猜忌、部队哗变)',
      '倾国 (以绝世姿容迷惑敌军主将，使其部队陷入混乱与士气崩溃)',
      '挑衅 (强迫目标敌军失去冷静，暴露出防守破绽)',
      '混乱 (施展诡诈奇策瘫痪敌军，智力高者成功率更高)'
    ],
    biography: '东汉末年传说人物，《三国演义》中位列中国古代“四大美女”，有“闭月”之貌。本为司徒王允府中歌伎，为报答养育之恩，自愿献身连环之计，周旋于权臣董卓与猛将吕布之间，使其父子反目。吕布终怒而诛杀董卓，掀动天下大势。其以柔弱之躯搅动乾坤，功成之后不知所踪，成为千古佳话。'
  },
  {
    id: 'wangzhaojun',
    name: '王昭君',
    gender: 'Female',
    styleName: '落雁 · 明妃',
    englishName: 'Wang Zhaojun (Ming Fei)',
    origin: '西汉南郡秭归 · 出塞和亲匈奴',
    isGlobalLeader: false,
    factionId: 'steppe',
    avatarStyle: {
      portrait: wangzhaojunPortrait,      hairColor: '#171717',
      hairStyle: 'Long Flowing Hair',
      armorColor: '#0284c7',
      accessory: 'Jade Pipa Headdress',
      expression: 'Elegant Confident',
      bgGradient: 'from-cyan-950 via-blue-950 to-slate-950'
    },
    stats: {
      leadership: 65,
      force: 25,
      intelligence: 88,
      politics: 96,
      charisma: 98
    },
    traits: [
      '落雁 (四大美女之“落雁”，南飞大雁见之竟忘拍翅而坠落；魅力动天地，大幅提升外交与安抚成效)',
      '出塞和亲 (远嫁塞外而使汉匈数十年无战事，大幅提升相邻势力友好度与边境安定)',
      '琵琶定边 (一曲琵琶安抚大漠，所在城池治安、民心与外交通商大幅提升)'
    ],
    skills: [
      '安抚 (以温婉贤德安定城内民心，提升治安与士气)',
      '怀柔 (以亲和之策招抚塞外部落，大幅降低敌军士气并提高招降成功率)',
      '治疗 (恢复重伤士兵的编制数并激发高昂士气)',
      '鼓舞 (以琵琶之音大幅提升我方全军士气与行军速度)'
    ],
    biography: '西汉南郡秭归人，名嫱，字昭君，与西施、貂蝉、杨玉环并称“四大美女”，有“落雁”之貌。汉元帝时以宫女身份自请出塞和亲，远嫁匈奴呼韩邪单于为“宁胡阏氏”。此后汉匈数十年烽烟不起，边城晏闭、牛马布野。青冢留香，一曲《昭君出塞》千古传唱，以一己之身换得两国太平。'
  },
  {
    id: 'yanghuaiyu',
    name: '杨怀玉',
    gender: 'Female',
    styleName: '杨门女将 · 银枪玉女',
    englishName: 'Yang Huaiyu',
    origin: '华夏演义 · 杨家将之后',
    isGlobalLeader: false,
    factionId: 'tang',
    avatarStyle: {
      portrait: yanghuaiyuPortrait,      hairColor: '#0f172a',
      hairStyle: 'Ribbon Topknot',
      armorColor: '#f8fafc',
      accessory: 'Green Dragon Blade',
      expression: 'Fierce Roaring',
      bgGradient: 'from-slate-900 via-sky-950 to-indigo-950'
    },
    stats: {
      leadership: 84,
      force: 93,
      intelligence: 62,
      politics: 55,
      charisma: 78
    },
    traits: [
      '杨门虎将 (出身满门忠烈的杨家将，率军冲锋时全军攻击力与士气大幅提升)',
      '银枪无敌 (枪法出神入化，单挑与突击战法之杀伤力大幅增强)',
      '巾帼不让须眉 (身为女子而武艺冠绝三军，濒死时激发全队死战反击)'
    ],
    skills: [
      '突击 (对敌军发起雷霆冲锋，大幅削减敌方部队与士气)',
      '单挑 (邀请敌方主将阵前单挑，武艺高强者胜率极高)',
      '强袭 (无视地形劣势强行突袭敌军，奇袭成功率高)',
      '坚守 (大幅提升本城与部队之防御，抵御强敌围攻)'
    ],
    biography: '民间演义中的杨家将后人、杨门女将，将门虎女，自幼习武，一杆银枪使得出神入化。传说其秉承“杨家将”满门忠烈之风，随军出征屡立战功，于阵前冲杀不让须眉，敌军闻名丧胆。虽为传说人物，其忠勇双全之姿与杨门女将的传奇一同流传后世。'
  },
  {
    id: 'macron',
    name: '埃马纽埃尔·马克龙',
    gender: 'Male',
    styleName: '爱丽舍雄狮',
    englishName: 'Emmanuel Jean-Michel Frédéric Macron',
    origin: '法兰西共和国 (第五共和)',
    isGlobalLeader: true,
    factionId: 'france',
    avatarStyle: {
      portrait: macronPortrait,
      hairColor: '#1e293b',
      hairStyle: 'Noble Court Crown',
      armorColor: '#1e40af',
      accessory: 'Engraved Commander Sword',
      expression: 'Brilliant Calm',
      bgGradient: 'from-blue-950 via-indigo-950 to-slate-950'
    },
    stats: {
      leadership: 76,
      force: 45,
      intelligence: 90,
      politics: 93,
      charisma: 85
    },
    traits: [
      '欧洲自主 (倡建独立防务体系，友军士气与外交谈判成功率大幅提升)',
      '改革锐锋 (内政革新加速，治下商业与治安提升但初期民心略损)',
      '雄辩 (议会论战与跨国交涉之成功率大幅增强)'
    ],
    skills: [
      '金权制裁 (以庞大财力与禁运压制敌军士气)',
      '挑衅 (强迫目标敌军失去冷静，暴露出防守破绽)',
      '齐射 (发动大范围远程箭雨压制)',
      '治疗 (恢复重伤士兵的编制数并激发高昂士气)'
    ],
    biography: '法兰西第五共和国总统，1977年生于亚眠，修习哲学后转入投行界，30岁即执掌爱丽舍宫，为法兰西史上最年轻之国家元首。2016年白手创立“前进”运动，以超越左右之姿态横扫大选；任内推动劳动与税制改革，力主欧洲战略自主与共同防务，并于2022年成功连任。其行事果决而锋芒毕露，欧陆政坛之争议与声望并峙。'
  },
  {
    id: 'von_der_leyen',
    name: '乌尔苏拉·冯德莱恩',
    gender: 'Female',
    styleName: '布鲁塞尔星环执政',
    englishName: 'Ursula von der Leyen',
    origin: '欧洲联盟 · 布鲁塞尔',
    isGlobalLeader: true,
    factionId: 'europe',
    avatarStyle: {
      portrait: vdlPortrait,
      hairColor: '#b45309',
      hairStyle: 'Scholar Jade Headdress',
      armorColor: '#0284c7',
      accessory: 'Golden Sovereign Crown',
      expression: 'Elegant Confident',
      bgGradient: 'from-sky-950 via-blue-950 to-slate-950'
    },
    stats: {
      leadership: 78,
      force: 35,
      intelligence: 86,
      politics: 91,
      charisma: 80
    },
    traits: [
      '联盟统合 (跨邦结盟与共同表决之成功率大幅提升)',
      '绿色新政 (治下商业与农业长期收益提升，短期投入成本增加)',
      '铁腕禁运 (对敌国施以经济封锁，敌军士气与后勤持续衰减)'
    ],
    skills: [
      '金权制裁 (以庞大财力与禁运压制敌军士气)',
      '齐射 (发动大范围远程箭雨压制)',
      '治疗 (恢复重伤士兵的编制数并激发高昂士气)',
      '铁壁 (短时间内进入物理与计谋免疫的无敌状态)'
    ],
    biography: '欧洲联盟委员会主席，1958年生于布鲁塞尔，医学科班出身，随父居于欧盟摇篮之地。归国后入德国政坛，2013年成为联邦德国首位女性国防部长；2019年执掌欧委会，主导绿色新政与疫后共同举债复苏基金，并于俄乌战起后统合二十七国步调，对俄施以空前制裁、援乌不遗余力，2024年获连任。其以技术官僚之严谨与坚定之立场，重塑欧盟之权柄。'
  },
  {
    id: 'merkel',
    name: '安格拉·默克尔',
    gender: 'Female',
    styleName: '铁娘子 · 量子化学家',
    englishName: 'Angela Merkel',
    origin: '德意志联邦共和国 · 柏林',
    isGlobalLeader: true,
    factionId: 'germany',
    avatarStyle: {
      portrait: merkelPortrait,
      hairColor: '#4b5563',
      hairStyle: 'Scholar Jade Headdress',
      armorColor: '#6b7280',
      accessory: 'Golden Sovereign Crown',
      expression: 'Calm Stately',
      bgGradient: 'from-slate-900 via-zinc-950 to-neutral-950'
    },
    stats: {
      leadership: 84,
      force: 30,
      intelligence: 92,
      politics: 96,
      charisma: 78
    },
    traits: [
      '长期执政 (每回合稳定累积国力，士气与治安不致崩散)',
      '稳健 (免疫急进奇谋之伤害，守城时防御力大幅增强)',
      '量子推演 (以科学理性推演战局，策谋识破率大幅提升)'
    ],
    skills: [
      '铁壁 (短时间内进入物理与计谋免疫的无敌状态)',
      '坚守 (大幅提升本城与部队之防御，抵御强敌围攻)',
      '治疗 (恢复重伤士兵的编制数并激发高昂士气)',
      '齐射 (发动大范围远程箭雨压制)'
    ],
    biography: '德意志联邦共和国前联邦总理，1954年生于汉堡，长于东德，物理学博士出身，专研量子化学。柏林墙倾颓后踏入政坛，师承科尔，2005年成为德国首位女性总理，连任四届、主政十六载，为欧洲金融危机、欧债危机、难民潮与疫情之定盘星。其行事冷静克制、不尚空谈，以“我们能办到”之姿主导欧洲秩序，世人号之曰“铁娘子”。'
  },
  {
    id: 'rutte',
    name: '马克·吕特',
    gender: 'Male',
    styleName: '海牙妥协大师',
    englishName: 'Mark Rutte',
    origin: '尼德兰王国 · 海牙 (北约)',
    isGlobalLeader: true,
    factionId: 'netherlands',
    avatarStyle: {
      portrait: ruttePortrait,
      hairColor: '#171717',
      hairStyle: 'Noble Court Crown',
      armorColor: '#ea580c',
      accessory: 'Engraved Commander Sword',
      expression: 'Warm Smiling',
      bgGradient: 'from-orange-950 via-amber-950 to-slate-950'
    },
    stats: {
      leadership: 72,
      force: 38,
      intelligence: 85,
      politics: 92,
      charisma: 82
    },
    traits: [
      '联合组阁 (可缔结多方同盟，盟军协同作战之增益大幅提升)',
      '紧缩理财 (金钱税赋收益提升，但兵员募集上限略降)',
      '北约枢纽 (同盟军援与远程支援之调度效率大幅提升)'
    ],
    skills: [
      '金权制裁 (以庞大财力与禁运压制敌军士气)',
      '挑衅 (强迫目标敌军失去冷静，暴露出防守破绽)',
      '齐射 (发动大范围远程箭雨压制)',
      '治疗 (恢复重伤士兵的编制数并激发高昂士气)'
    ],
    biography: '尼德兰王国前首相、北大西洋公约组织秘书长，1967年生于海牙，早年任联合利华公关与《人民报》专栏作家。2006年执掌自由民主党，2010年至2024年四度组阁、连任首相十四年，为荷兰宪政史上任期最长之内阁首脑。以务实谈判、妥协斡旋与冷幽默著称，善于在碎片化多党格局中撮合共识。2024年10月入主布鲁塞尔北约总部，统合跨大西洋防务同盟。'
  },
  {
    id: 'jetten',
    name: '罗布·耶滕',
    gender: 'Male',
    styleName: '绿色新雄',
    englishName: 'Rob Jetten',
    origin: '尼德兰王国 · 海牙',
    isGlobalLeader: true,
    factionId: 'netherlands',
    avatarStyle: {
      portrait: jettenPortrait,
      hairColor: '#0f172a',
      hairStyle: 'Noble Court Crown',
      armorColor: '#059669',
      accessory: 'Engraved Commander Sword',
      expression: 'Warm Smiling',
      bgGradient: 'from-emerald-950 via-teal-950 to-slate-950'
    },
    stats: {
      leadership: 62,
      force: 34,
      intelligence: 82,
      politics: 86,
      charisma: 88
    },
    traits: [
      '青年号召 (新兵募集速度大幅提升，全军士气高昂不衰)',
      '气候立法 (农业与商业之长期收益提升，短期投入增加)',
      '联盟新锐 (与盟军协同作战之增益显著提升)'
    ],
    skills: [
      '鼓舞 (以理想与热忱号召全军，大幅提升士气与行军速度)',
      '治疗 (恢复重伤士兵的编制数并激发高昂士气)',
      '齐射 (发动大范围远程箭雨压制)',
      '坚守 (大幅提升本城与部队之防御，抵御强敌围攻)'
    ],
    biography: '尼德兰王国首相、民主66党领袖，1987年生于奥斯，19岁即当选国会议员，为荷兰史上最年轻之议员之一。2017年出任气候与能源大臣，主导通过欧洲首部成文《气候法》，将减排目标写入国法，并推动风电、光伏与天然气退出之能源转型。2025年率民主66党赢得大选，2026年组阁执政，成为尼德兰史上最年轻之内阁首脑，以绿色新政与青年理想重新点燃低地之国政坛。'
  }
];

export const FAMOUS_RELATIONSHIPS: RelationshipRelation[] = [
  { fromOfficerId: 'liubei', toOfficerId: 'guanyu', type: 'Sworn Brother' },
  { fromOfficerId: 'liubei', toOfficerId: 'zhugeliang', type: 'Lord' },
  { fromOfficerId: 'zhugeliang', toOfficerId: 'liubei', type: 'Confidant' },
  { fromOfficerId: 'guanyu', toOfficerId: 'liubei', type: 'Sworn Brother' },
  { fromOfficerId: 'caocao', toOfficerId: 'guanyu', type: 'Trust' },
  { fromOfficerId: 'zhugeliang', toOfficerId: 'caocao', type: 'Rival' },
  { fromOfficerId: 'lubu', toOfficerId: 'caocao', type: 'Rival' },
  // 世界群雄间之跨时空与同代羁绊
  { fromOfficerId: 'caesar', toOfficerId: 'cleopatra', type: 'Confidant' },
  { fromOfficerId: 'cleopatra', toOfficerId: 'caesar', type: 'Confidant' },
  { fromOfficerId: 'caesar', toOfficerId: 'hannibal', type: 'Rival' },
  { fromOfficerId: 'alexander', toOfficerId: 'hannibal', type: 'Rival' },
  { fromOfficerId: 'himiko', toOfficerId: 'caocao', type: 'Trust' },
  { fromOfficerId: 'marcus_aurelius', toOfficerId: 'caesar', type: 'Trust' },
  { fromOfficerId: 'ashoka', toOfficerId: 'kanishka', type: 'Trust' },
  { fromOfficerId: 'modu', toOfficerId: 'liubei', type: 'Rival' },
  { fromOfficerId: 'ardashir', toOfficerId: 'alexander', type: 'Rival' },
  { fromOfficerId: 'napoleon', toOfficerId: 'caesar', type: 'Trust' },
  { fromOfficerId: 'napoleon', toOfficerId: 'alexander', type: 'Trust' },
  { fromOfficerId: 'catherine', toOfficerId: 'cleopatra', type: 'Trust' },
  { fromOfficerId: 'wuzetian', toOfficerId: 'catherine', type: 'Confidant' },
  { fromOfficerId: 'catherine', toOfficerId: 'wuzetian', type: 'Confidant' },
  { fromOfficerId: 'wuzetian', toOfficerId: 'cleopatra', type: 'Trust' },
  { fromOfficerId: 'wuzetian', toOfficerId: 'libai', type: 'Trust' },
  { fromOfficerId: 'libai', toOfficerId: 'wuzetian', type: 'Confidant' },
  { fromOfficerId: 'libai', toOfficerId: 'caocao', type: 'Confidant' },
  { fromOfficerId: 'libai', toOfficerId: 'zhugeliang', type: 'Confidant' },
  { fromOfficerId: 'qianlong', toOfficerId: 'wuzetian', type: 'Trust' },
  { fromOfficerId: 'qianlong', toOfficerId: 'napoleon', type: 'Rival' },
  { fromOfficerId: 'yingzheng', toOfficerId: 'caesar', type: 'Rival' },
  { fromOfficerId: 'yingzheng', toOfficerId: 'lishimin', type: 'Trust' },
  { fromOfficerId: 'lishimin', toOfficerId: 'yingzheng', type: 'Trust' },
  { fromOfficerId: 'lishimin', toOfficerId: 'caocao', type: 'Trust' },
  { fromOfficerId: 'lishimin', toOfficerId: 'zhugeliang', type: 'Trust' },
  { fromOfficerId: 'lishimin', toOfficerId: 'wuzetian', type: 'Confidant' },
  { fromOfficerId: 'wuzetian', toOfficerId: 'lishimin', type: 'Confidant' },
  { fromOfficerId: 'trump', toOfficerId: 'putin', type: 'Rival' },
  { fromOfficerId: 'putin', toOfficerId: 'catherine', type: 'Trust' },
  { fromOfficerId: 'liuji', toOfficerId: 'zhugeliang', type: 'Confidant' },
  { fromOfficerId: 'tangbohu', toOfficerId: 'liuji', type: 'Trust' },
  { fromOfficerId: 'einstein', toOfficerId: 'zhugeliang', type: 'Confidant' },
  { fromOfficerId: 'tangbohu', toOfficerId: 'libai', type: 'Confidant' },
  { fromOfficerId: 'libai', toOfficerId: 'tangbohu', type: 'Confidant' },
  { fromOfficerId: 'tangbohu', toOfficerId: 'zhouyu', type: 'Confidant' },
  { fromOfficerId: 'tangbohu', toOfficerId: 'qianlong', type: 'Rival' },
  { fromOfficerId: 'daqiao', toOfficerId: 'xiaoqiao', type: 'Confidant' },
  { fromOfficerId: 'xiaoqiao', toOfficerId: 'daqiao', type: 'Confidant' },
  { fromOfficerId: 'xiaoqiao', toOfficerId: 'zhouyu', type: 'Spouse' },
  { fromOfficerId: 'zhouyu', toOfficerId: 'xiaoqiao', type: 'Spouse' },
  { fromOfficerId: 'daqiao', toOfficerId: 'zhouyu', type: 'Trust' },
  { fromOfficerId: 'daqiao', toOfficerId: 'sunquan', type: 'Trust' },
  { fromOfficerId: 'sunquan', toOfficerId: 'daqiao', type: 'Trust' },
  { fromOfficerId: 'xishi', toOfficerId: 'wuzetian', type: 'Confidant' },
  { fromOfficerId: 'wuzetian', toOfficerId: 'xishi', type: 'Trust' },
  { fromOfficerId: 'xishi', toOfficerId: 'cleopatra', type: 'Trust' },
  { fromOfficerId: 'cleopatra', toOfficerId: 'xishi', type: 'Trust' },
  { fromOfficerId: 'diaochan', toOfficerId: 'lubu', type: 'Spouse' },
  { fromOfficerId: 'lubu', toOfficerId: 'diaochan', type: 'Spouse' },
  { fromOfficerId: 'diaochan', toOfficerId: 'xishi', type: 'Confidant' },
  { fromOfficerId: 'xishi', toOfficerId: 'diaochan', type: 'Confidant' },
  { fromOfficerId: 'diaochan', toOfficerId: 'daqiao', type: 'Trust' },
  { fromOfficerId: 'wangzhaojun', toOfficerId: 'modu', type: 'Spouse' },
  { fromOfficerId: 'modu', toOfficerId: 'wangzhaojun', type: 'Spouse' },
  { fromOfficerId: 'wangzhaojun', toOfficerId: 'cleopatra', type: 'Trust' },
  { fromOfficerId: 'wangzhaojun', toOfficerId: 'catherine', type: 'Trust' },
  { fromOfficerId: 'catherine', toOfficerId: 'wangzhaojun', type: 'Trust' },
  { fromOfficerId: 'yanghuaiyu', toOfficerId: 'guanyu', type: 'Rival' },
  { fromOfficerId: 'guanyu', toOfficerId: 'yanghuaiyu', type: 'Rival' },
  { fromOfficerId: 'yanghuaiyu', toOfficerId: 'lishimin', type: 'Trust' },
  { fromOfficerId: 'lishimin', toOfficerId: 'yanghuaiyu', type: 'Trust' },
  { fromOfficerId: 'yanghuaiyu', toOfficerId: 'modu', type: 'Rival' },
  // 现代欧陆政坛之羁绊
  { fromOfficerId: 'macron', toOfficerId: 'napoleon', type: 'Trust' },
  { fromOfficerId: 'macron', toOfficerId: 'merkel', type: 'Trust' },
  { fromOfficerId: 'merkel', toOfficerId: 'macron', type: 'Trust' },
  { fromOfficerId: 'macron', toOfficerId: 'trump', type: 'Rival' },
  { fromOfficerId: 'macron', toOfficerId: 'von_der_leyen', type: 'Confidant' },
  { fromOfficerId: 'von_der_leyen', toOfficerId: 'merkel', type: 'Trust' },
  { fromOfficerId: 'merkel', toOfficerId: 'von_der_leyen', type: 'Trust' },
  { fromOfficerId: 'merkel', toOfficerId: 'einstein', type: 'Trust' },
  { fromOfficerId: 'merkel', toOfficerId: 'catherine', type: 'Trust' },
  { fromOfficerId: 'von_der_leyen', toOfficerId: 'putin', type: 'Rival' },
  { fromOfficerId: 'rutte', toOfficerId: 'putin', type: 'Rival' },
  { fromOfficerId: 'rutte', toOfficerId: 'napoleon', type: 'Rival' },
  { fromOfficerId: 'rutte', toOfficerId: 'jetten', type: 'Rival' },
  { fromOfficerId: 'jetten', toOfficerId: 'rutte', type: 'Rival' },
  { fromOfficerId: 'jetten', toOfficerId: 'von_der_leyen', type: 'Trust' },
  { fromOfficerId: 'jetten', toOfficerId: 'macron', type: 'Trust' }
];

export const SCENARIOS: CampaignScenario[] = [
  {
    id: 'coalition',
    title: '公元190年：反董卓联合军',
    year: 190,
    description: '暴虐董卓火烧洛阳劫持幼主、祸乱朝堂。曹操和袁绍振臂高呼，组织起天下十八路诸侯讨董。这是一场大义凛然与个怀鬼胎之私欲野心的终极交织！',
    featuredFactions: ['wei', 'yuanshao', 'shu', 'ronin'],
    victoryCondition: '斩杀董卓，救出天子并克复京都',
    difficulty: 'Easy'
  },
  {
    id: 'chibi',
    title: '公元208年：赤壁之战',
    year: 208,
    description: '魏武帝曹操席卷荆、襄，陈兵百万于长江，欲鲸吞江南。刘备与孙权临危结盟，依靠绝世奇策，在长江赤壁上演传奇般的火攻御敌战略！',
    featuredFactions: ['wei', 'shu', 'wu'],
    victoryCondition: '火烧曹操百万水军战船，逼退其主力至华容道',
    difficulty: 'Hard'
  },
  {
    id: 'jing',
    title: '公元219年：荆州争夺战与樊城激战',
    year: 219,
    description: '美髯公关羽率军北伐樊城，水淹七军擒于禁斩庞德，威震华夏。然而，盟友东吴在吕蒙、陆逊谋划下正白衣渡江悄然袭取荆州后方。关圣人能否化险为夷？',
    featuredFactions: ['shu', 'wei', 'wu'],
    victoryCondition: '守卫住荆州核心主城的战略地格，抵御两路夹击',
    difficulty: 'Hard'
  },
  {
    id: 'northern',
    title: '公元227年：出师表与诸葛亮北伐',
    year: 227,
    description: '先帝创业未半而中道崩殂。丞相诸葛亮挥泪修《出师表》，率祁山雄兵五出秦川北伐魏国。而在他的面前，是曹魏数代智将及防守宗师司马懿的严密联防！',
    featuredFactions: ['shu', 'wei', 'ronin'],
    victoryCondition: '夺取长安及洛阳，光复汉室克复中原',
    difficulty: 'Medium'
  },
  {
    id: 'millennium',
    title: '公元2000年：新千年全球格局',
    year: 2000,
    description: '千禧年钟声敲响，世界迈入新纪元。美利坚独步全球，俄罗斯在普京治下重整旗鼓，欧洲诸国走向联合，东方巨龙蓄势腾飞。新旧势力纵横捭阖，谁能主宰二十一世纪的天下大势？',
    featuredFactions: ['america', 'russia', 'europe', 'france'],
    victoryCondition: '领导你的国家在新千年称雄世界，成为无可争议的头号强国',
    difficulty: 'Medium'
  }
];
