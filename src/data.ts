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
  '忠义 (大幅降低战斗中被俘虏、策反成敌方之可能)'
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
  '铁壁 (短时间内进入物理与计谋免疫的无敌状态)'
];

export const FAMOUS_OFFICERS: Officer[] = [
  {
    id: 'liubei',
    name: '刘备',
    gender: 'Male',
    styleName: '玄德',
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
    skills: ['突击 (造成恐怖的近战冲撞伤害)', '混乱 (施展诡诈奇策瘫痪敌军，智力高者成功率更高)', '铁壁 (短时间内进入物理与计谋免疫 of 无敌状态)'],
    biography: '杰出的军事家、诗人和政治家，统一了中国北方。身为大汉丞相，他拥有强大的军事铁腕，“宁我负人，毋人负我”。他唯才是举，不拘一格招纳天下贤士。'
  },
  {
    id: 'sunquan',
    name: '孙权',
    gender: 'Male',
    styleName: '仲谋',
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
  }
];

export const FAMOUS_RELATIONSHIPS: RelationshipRelation[] = [
  { fromOfficerId: 'liubei', toOfficerId: 'guanyu', type: 'Sworn Brother' },
  { fromOfficerId: 'liubei', toOfficerId: 'zhugeliang', type: 'Lord' },
  { fromOfficerId: 'zhugeliang', toOfficerId: 'liubei', type: 'Confidant' },
  { fromOfficerId: 'guanyu', toOfficerId: 'liubei', type: 'Sworn Brother' },
  { fromOfficerId: 'caocao', toOfficerId: 'guanyu', type: 'Trust' },
  { fromOfficerId: 'zhugeliang', toOfficerId: 'caocao', type: 'Rival' },
  { fromOfficerId: 'lubu', toOfficerId: 'caocao', type: 'Rival' }
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
