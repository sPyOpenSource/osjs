import { Officer } from '../types';

export const PRESET_CITY_REFS: ReadonlyArray<{ id: string; name: string }> = [
  { id: 'london', name: '伦敦' },
  { id: 'paris', name: '巴黎' },
  { id: 'rome', name: '罗马' },
  { id: 'carthage', name: '迦太基' },
  { id: 'pella', name: '佩拉・雅典' },
  { id: 'constantinople', name: '君士坦丁堡' },
  { id: 'alexandria', name: '亚历山大港' },
  { id: 'antioch', name: '安条克' },
  { id: 'ctesiphon', name: '泰西封' },
  { id: 'samarkand', name: '撒马尔罕' },
  { id: 'purushapura', name: '布路沙布逻' },
  { id: 'pataliputra', name: '华氏城' },
  { id: 'shule', name: '疏勒' },
  { id: 'dunhuang', name: '敦煌' },
  { id: 'pontic_steppe', name: '萨尔马提亚' },
  { id: 'moscow', name: '莫斯科' },
  { id: 'longcheng', name: '漠北龙城' },
  { id: 'xianbei', name: '鲜卑汗庭' },
  { id: 'beiping', name: '北平' },
  { id: 'ye', name: '邺城' },
  { id: 'changan', name: '长安' },
  { id: 'luoyang', name: '洛阳' },
  { id: 'xuchang', name: '许昌' },
  { id: 'xiapi', name: '下邳' },
  { id: 'hanzhong', name: '汉中' },
  { id: 'chengdu', name: '成都' },
  { id: 'jingzhou', name: '荆州' },
  { id: 'jianye', name: '建业' },
  { id: 'xiangping', name: '襄平' },
  { id: 'yamatai', name: '邪马台' },
  { id: 'guangzhou', name: '广州' },
  { id: 'jiaozhi', name: '交趾' },
];

export const FACTION_DEFAULT_CITY_NAME: Record<string, string> = {
  shu: '成都',
  wei: '许昌',
  wu: '建业',
  lubu: '洛阳',
  yuanshao: '邺城',
  rome: '罗马',
  macedon: '佩拉・雅典',
  persia: '泰西封',
  kushan: '布路沙布逻',
  yamatai: '邪马台',
  carthage: '迦太基',
  steppe: '漠北龙城',
  france: '巴黎',
  russia: '莫斯科',
  wuzhou: '洛阳',
  qing: '北平',
  qin: '长安',
  tang: '长安',
  ming: '建业',
  germany: '巴黎',
  europe: '罗马',
  netherlands: '伦敦',
  america: '纽约',
};

export const ORIGIN_CITY_ALIASES: ReadonlyArray<readonly [string, string]> = [
  ['咸阳', '长安'],
  ['紫禁城', '北平'],
  ['托勒密埃及', '亚历山大港'],
  ['孔雀帝国', '华氏城'],
  ['天竺', '华氏城'],
  ['贵霜', '布路沙布逻'],
  ['波斯', '泰西封'],
  ['匈奴', '漠北龙城'],
  ['塞外草原', '漠北龙城'],
  ['法兰西', '巴黎'],
  ['德意志', '巴黎'],
  ['欧洲联盟', '罗马'],
  ['葡萄牙', '罗马'],
  ['尼德兰', '伦敦'],
  ['大明', '建业'],
  ['北美合众国', '纽约'],
  ['纽约', '纽约'],
];

export function normalizeCityName(cityInput?: string): string {
  const trimmed = cityInput?.trim() ?? '';
  if (!trimmed) return '';
  const matched = PRESET_CITY_REFS.find(c => c.name === trimmed || c.id === trimmed);
  return matched ? matched.name : trimmed;
}

export function resolveOfficerCityName(officer: Officer): string {
  const rawHome = officer.homeCity?.trim();
  if (rawHome) {
    return normalizeCityName(rawHome);
  }

  const origin = officer.origin ?? '';
  if (origin) {
    for (const city of PRESET_CITY_REFS) {
      if (origin.includes(city.name)) {
        return city.name;
      }
    }
    for (const [keyword, cityName] of ORIGIN_CITY_ALIASES) {
      if (origin.includes(keyword)) {
        return cityName;
      }
    }
  }

  return FACTION_DEFAULT_CITY_NAME[officer.factionId] ?? '';
}
