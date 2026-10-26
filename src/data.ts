import { Faction, Officer, CampaignScenario, RelationshipRelation } from './types';

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
  '万王之王 (波斯铁骑与精锐弓骑协同突击，杀伤力呈破甲倍增)'
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
  '鬼道迷离 (施展东海神巫法术使敌全军陷入迷雾与幻境混乱)'
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
      hairColor: '#0f172a',
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
      hairColor: '#c2410c',
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
      hairColor: '#0f172a',
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
      hairColor: '#1e293b',
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
      hairColor: '#1e293b',
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
      hairColor: '#4b5563',
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
    id: 'alexander',
    name: '亚历山大大帝',
    gender: 'Male',
    styleName: '无双霸主',
    englishName: 'Alexander the Great',
    origin: '马其顿帝国',
    isGlobalLeader: true,
    factionId: 'macedon',
    avatarStyle: {
      hairColor: '#b45309',
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
      hairColor: '#4b5563',
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
      hairColor: '#1e293b',
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
      hairColor: '#0f172a',
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
      hairColor: '#171717',
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
      hairColor: '#0f172a',
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
      hairColor: '#1e293b',
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
      hairColor: '#0f172a',
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
      hairColor: '#171717',
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
    id: 'napoleon',
    name: '拿破仑·波拿巴',
    gender: 'Male',
    styleName: '科西嘉战神',
    englishName: 'Napoleon Bonaparte',
    origin: '法兰西第一帝国',
    isGlobalLeader: true,
    factionId: 'france',
    avatarStyle: {
      hairColor: '#1e293b',
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
    id: 'catherine',
    name: '叶卡捷琳娜二世',
    gender: 'Female',
    styleName: '女皇大帝',
    englishName: 'Catharina II Aleksejevna',
    origin: '俄罗斯帝国 (双头鹰)',
    isGlobalLeader: true,
    factionId: 'russia',
    avatarStyle: {
      hairColor: '#b45309',
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
  { fromOfficerId: 'ardashir', toOfficerId: 'alexander', type: 'Rival' }
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
  }
];
