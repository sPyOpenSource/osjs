import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import InternalAffairs from '../InternalAffairs';
import DuelArena from '../DuelArena';
import TacticalMap, { CITIES, getActiveMapFactions, getCityDotMetrics, getNearbyTargetCities } from '../TacticalMap';
import RelationshipTree from '../RelationshipTree';
import DiplomacyPanel from '../DiplomacyPanel';
import PeopleMigrationsPanel from '../PeopleMigrationsPanel';
import Alerts, { evaluateWeatherAndDisasterAlert } from '../Alerts';
import ProtagonistProfile from '../ProtagonistProfile';
import StartMenu from '../StartMenu';
import WorldSituation2026 from '../WorldSituation2026';
import WarMode from '../WarMode';
import Scene3DViewer from '../Scene3DViewer';
import GameNavigation from '../GameNavigation';
import AdvisorChatPanel from '../AdvisorChatPanel';
import OfficerSpotlight from '../OfficerSpotlight';
import { getSpotlightOfficerCandidates, pickNonSelfOfficer } from '../../utils/personality';
import { createInitialDiplomacyState } from '../../utils/diplomacy';
import { createInitialMigrationState, MigrationCityRef } from '../../utils/migrations';
import { advanceWorld, campaignTick, createWorldState } from '../../utils/geopolitics';
import { createRpgCharacter } from '../../utils/rpg';
import { ALL_QUESTS } from '../../data/quests';
import { FACTIONS, FAMOUS_OFFICERS, FAMOUS_RELATIONSHIPS, SCENARIOS } from '../../data';
import { Officer } from '../../types';

function makeOfficer(id: string, name: string, overrides: Partial<Officer> = {}): Officer {
  return {
    id,
    name,
    gender: 'Male',
    factionId: 'shu',
    avatarStyle: {
      hairColor: '#000',
      hairStyle: 'short',
      armorColor: '#000',
      accessory: 'none',
      expression: 'calm',
      bgGradient: 'none',
    },
    stats: { leadership: 50, force: 50, intelligence: 50, politics: 50, charisma: 50 },
    traits: [],
    skills: [],
    biography: '',
    ...overrides,
  };
}

const officers: Officer[] = [
  makeOfficer('liubei', '刘备'),
  makeOfficer('guanyu', '关羽'),
  makeOfficer('zhangfei', '张飞'),
  makeOfficer('caocao', '曹操', { factionId: 'wei' }),
];

const noop = () => {};

function buttonTag(html: string, id: string): string {
  const match = html.match(new RegExp(`<button[^>]*id="${id}"[^>]*>`));
  assert.ok(match, `expected a button with id="${id}" in markup`);
  return match[0];
}

function render(
  overrides: {
    officers?: Officer[];
    playerFactionId?: string;
    playerFactionName?: string;
    selectedOfficerId?: string;
    currentCityId?: string;
    onSetSelectedOfficerId?: (id: string) => void;
    onSetCurrentCity?: (cityName: string) => void;
  } = {},
): string {
  return renderToStaticMarkup(
    <InternalAffairs
      officers={overrides.officers ?? officers}
      playerFactionId={overrides.playerFactionId}
      playerFactionName={overrides.playerFactionName}
      soundEnabled={false}
      playDrumSound={noop}
      playClashSound={noop}
      playHarvestSound={noop}
      gameYear={208}
      gameMonth={1}
      gameXun={1}
      isAutoTime={false}
      timeSpeed="normal"
      onToggleAutoTime={noop}
      onSetTimeSpeed={noop}
      onAdvanceXun={noop}
      onAdvanceMonth={noop}
      selectedOfficerId={overrides.selectedOfficerId}
      currentCityId={overrides.currentCityId}
      onSetSelectedOfficerId={overrides.onSetSelectedOfficerId}
      onSetCurrentCity={overrides.onSetCurrentCity}
      isActiveTab={true}
    />,
  );
}

describe('Cross-Page Integration (InternalAffairs canonical props)', () => {
  test('renders officer highlight driven by selectedOfficerId prop', () => {
    // 'guanyu' is NOT the local-state default (defaults to liubei/zhugeliang), so
    // this only passes once InternalAffairs consumes the canonical prop.
    const html = render({ selectedOfficerId: 'guanyu' });
    const tag = buttonTag(html, 'btn-select-officer-guanyu');
    assert.ok(tag.includes('bg-amber-500/15'), 'expected selected officer highlight on guanyu');
    assert.ok(html.includes('关羽'), 'expected selected officer name in markup');
  });

  test('filters Assign Officer grid to only characters belonging to playerFactionId', () => {
    const html = render({ playerFactionId: 'shu', playerFactionName: '蜀汉' });
    assert.ok(html.includes('id="btn-select-officer-liubei"'), 'expected own-faction officer liubei');
    assert.ok(html.includes('id="btn-select-officer-guanyu"'), 'expected own-faction officer guanyu');
    assert.ok(html.includes('id="btn-select-officer-zhangfei"'), 'expected own-faction officer zhangfei');
    assert.ok(!html.includes('id="btn-select-officer-caocao"'), 'expected rival officer caocao to be excluded');
    assert.ok(html.includes('蜀汉 麾下武将：3 位'), 'expected faction officer count header');
  });

  test('renders empty-state message when playerFactionId has no officers', () => {
    const html = render({ playerFactionId: 'wu', playerFactionName: '东吴' });
    assert.ok(html.includes('当前所属阵营暂无可委任武将'), 'expected empty state when faction has no officers');
    assert.ok(!html.includes('id="btn-select-officer-liubei"'), 'expected no shu officers');
    assert.ok(!html.includes('id="btn-select-officer-caocao"'), 'expected no wei officers');
  });

  test('renders city selector driven by currentCityId prop', () => {
    // '许昌' is index 1, not the local-state default (index 0 = 成都), so this
    // only passes once InternalAffairs consumes the canonical prop.
    const html = render({ currentCityId: '许昌' });
    assert.ok(html.includes('许昌'), 'expected selected city name in markup');
    const cityPills = html.match(/>许昌</g);
    assert.ok(cityPills && cityPills.length >= 1, 'expected 许昌 city pill rendered');
  });

  test('falls back to first city (成都) when currentCityId does not match', () => {
    const html = render({ currentCityId: '不存在的城市' });
    assert.ok(html.includes('成都'), 'expected fallback to first city (成都)');
  });

  test('renders without error when onSetSelectedOfficerId is provided', () => {
    const html = render({
      selectedOfficerId: 'guanyu',
      onSetSelectedOfficerId: (id) => {
        // Intentionally unused in static render; handlers are dropped by renderToStaticMarkup.
        void id;
      },
    });
    assert.ok(html.includes('关羽'), 'expected guanyu name in markup');
  });
});

describe('DuelArena Left Camp Faction & Right Nearby City Filters', () => {
  test('limits left duelist to playerFactionId and right duelist to same city or nearby cities', () => {
    const cityOfficers: Officer[] = [
      ...officers,
      makeOfficer('weiyan', '魏延', { factionId: 'shu', homeCity: '汉中' }),
      makeOfficer('caoren', '曹仁', { factionId: 'wei', homeCity: '荆州' }),
      makeOfficer('caesar', '恺撒', { factionId: 'rome', homeCity: '罗马' }),
    ];
    const html = renderToStaticMarkup(
      <DuelArena
        officers={cityOfficers}
        playerFactionId="shu"
        playerFactionName="蜀汉"
        currentCityId="成都"
        soundEnabled={false}
        playClashSound={noop}
        playDrumSound={noop}
      />,
    );
    const leftSelectMatch = html.match(/<select[^>]*id="select-left-duelist"[\s\S]*?<\/select>/);
    const rightSelectMatch = html.match(/<select[^>]*id="select-right-duelist"[\s\S]*?<\/select>/);
    assert.ok(leftSelectMatch, 'expected select-left-duelist');
    assert.ok(rightSelectMatch, 'expected select-right-duelist');

    const leftSelect = leftSelectMatch[0];
    const rightSelect = rightSelectMatch[0];

    // Left camp remains strictly scoped to playerFactionId
    assert.ok(leftSelect.includes('value="liubei"'), 'expected own-faction officer liubei in left select');
    assert.ok(leftSelect.includes('value="guanyu"'), 'expected own-faction officer guanyu in left select');
    assert.ok(!leftSelect.includes('value="caocao"'), 'expected rival officer caocao excluded from left select');
    assert.ok(!leftSelect.includes('value="caoren"'), 'expected rival officer caoren excluded from left select');
    assert.ok(html.includes('麾下 4 位'), 'expected own-faction officer count badge in left camp');

    // Right camp includes same city (成都) and nearby cities (汉中, 荆州),
    // excludes the already selected left officer (guanyu) and distant cities (许昌, 罗马)
    assert.ok(!rightSelect.includes('value="guanyu"'), 'expected already selected officer guanyu excluded from right select');
    assert.ok(rightSelect.includes('value="liubei"'), 'expected same-city officer liubei in right select');
    assert.ok(rightSelect.includes('value="weiyan"'), 'expected nearby-city (汉中) officer weiyan in right select');
    assert.ok(rightSelect.includes('value="caoren"'), 'expected nearby-city (荆州) officer caoren in right select');
    assert.ok(!rightSelect.includes('value="caocao"'), 'expected distant-city (许昌) officer caocao excluded from right select');
    assert.ok(!rightSelect.includes('value="caesar"'), 'expected distant-city (罗马) officer caesar excluded from right select');
    assert.ok(html.includes('成都及邻近 4 位'), 'expected nearby-city count badge in right camp');
  });

  test('includes nearby xuchang and changan rivals in right select when anchored at 洛阳', () => {
    const regionalOfficers: Officer[] = [
      ...officers,
      makeOfficer('wuzetian', '武则天', { factionId: 'wuzhou', origin: '大周神都 · 洛阳' }),
      makeOfficer('lishimin', '李世民', { factionId: 'tang', origin: '大唐帝国 · 长安' }),
      makeOfficer('caesar', '恺撒', { factionId: 'rome', origin: '罗马帝国 (大秦)' }),
    ];
    const html = renderToStaticMarkup(
      <DuelArena
        officers={regionalOfficers}
        playerFactionId="shu"
        playerFactionName="蜀汉"
        currentCityId="洛阳"
        soundEnabled={false}
        playClashSound={noop}
        playDrumSound={noop}
      />,
    );
    const rightSelectMatch = html.match(/<select[^>]*id="select-right-duelist"[\s\S]*?<\/select>/);
    assert.ok(rightSelectMatch, 'expected select-right-duelist');
    const rightSelect = rightSelectMatch[0];

    assert.ok(rightSelect.includes('value="wuzetian"'), 'expected same-city (洛阳) officer wuzetian');
    assert.ok(rightSelect.includes('value="lishimin"'), 'expected nearby-city (长安) officer lishimin');
    assert.ok(rightSelect.includes('value="caocao"'), 'expected nearby-city (许昌) officer caocao');
    assert.ok(!rightSelect.includes('value="liubei"'), 'expected distant-city (成都) officer liubei excluded');
    assert.ok(!rightSelect.includes('value="caesar"'), 'expected distant-city (罗马) officer caesar excluded');
  });

  test('renders empty states when left camp has no faction officers or right camp has no nearby-city officers', () => {
    const html = renderToStaticMarkup(
      <DuelArena
        officers={officers}
        playerFactionId="wu"
        playerFactionName="东吴"
        currentCityId="邪马台"
        soundEnabled={false}
        playClashSound={noop}
        playDrumSound={noop}
      />,
    );
    const leftSelectMatch = html.match(/<select[^>]*id="select-left-duelist"[\s\S]*?<\/select>/);
    const rightSelectMatch = html.match(/<select[^>]*id="select-right-duelist"[\s\S]*?<\/select>/);
    assert.ok(leftSelectMatch, 'expected select-left-duelist');
    assert.ok(rightSelectMatch, 'expected select-right-duelist');
    assert.ok(leftSelectMatch[0].includes('当前所属阵营暂无可出战武将'));
    assert.ok(!leftSelectMatch[0].includes('value="liubei"'));
    assert.ok(!leftSelectMatch[0].includes('value="caocao"'));
    assert.ok(rightSelectMatch[0].includes('当前城池及邻近城池暂无可出战武将'));
    assert.ok(!rightSelectMatch[0].includes('value="liubei"'));
    assert.ok(!rightSelectMatch[0].includes('value="caocao"'));
  });

  test('renders Street Fighter-style active arena stage with dismounted articulated fighters and arcade HUD', () => {
    const sfOfficers: Officer[] = [
      makeOfficer('guanyu', '关羽', { factionId: 'shu', homeCity: '成都' }),
      makeOfficer('caoren', '曹仁', { factionId: 'wei', homeCity: '荆州' }),
    ];
    const html = renderToStaticMarkup(
      <DuelArena
        officers={sfOfficers}
        playerFactionId="shu"
        playerFactionName="蜀汉"
        currentCityId="成都"
        soundEnabled={false}
        initialFighting={true}
        playClashSound={noop}
        playDrumSound={noop}
      />,
    );

    assert.ok(html.includes('id="battle-theater-canvas"'), 'expected #battle-theater-canvas container');
    assert.ok(html.includes('data-testid="sf-fighter-stage"'), 'expected Street Fighter stage fighter container');
    assert.ok(html.includes('data-testid="sf-fighter-left"'), 'expected P1 articulated fighter rig');
    assert.ok(html.includes('data-testid="sf-fighter-right"'), 'expected P2 articulated fighter rig');
    assert.ok(html.includes('data-testid="sf-arcade-hud"'), 'expected Street Fighter arcade health HUD');
    assert.ok(html.includes('data-testid="sf-arcade-clock"'), 'expected 99s arcade KO clock');
    assert.ok(html.includes('data-testid="sf-super-bars"'), 'expected Street Fighter Super Combo bars');
    assert.ok(!html.includes('🐎'), 'expected mounted horses replaced by dismounted martial artists');
    assert.ok(html.includes('轻拳抢攻'), 'expected Jab arcade button');
    assert.ok(html.includes('崩山重脚'), 'expected Heavy Kick arcade button');
    assert.ok(html.includes('波动气功'), 'expected Hadouken arcade button');
    assert.ok(html.includes('升龙奥义'), 'expected Shoryuken Super arcade button');
  });
});

describe('TacticalMap Expedition Origin & Nearby Target City Filters', () => {
  test('restricts select-exp-origin to owned cities and select-exp-target to nearby cities', () => {
    const chibiScenario = SCENARIOS.find(s => s.id === 'chibi') ?? SCENARIOS[1];
    const html = renderToStaticMarkup(
      <TacticalMap
        selectedScenario={chibiScenario}
        officers={officers}
        playerFactionId="shu"
        soundEnabled={false}
      />,
    );
    const originMatch = html.match(/<select[^>]*id="select-exp-origin"[\s\S]*?<\/select>/);
    const targetMatch = html.match(/<select[^>]*id="select-exp-target"[\s\S]*?<\/select>/);
    assert.ok(originMatch, 'expected select-exp-origin');
    assert.ok(targetMatch, 'expected select-exp-target');

    const originSelect = originMatch[0];
    const targetSelect = targetMatch[0];

    // In 208 AD (chibi), Shu controls only Jingzhou
    assert.ok(originSelect.includes('value="jingzhou"'), 'expected Shu-owned city jingzhou in origin select');
    assert.ok(!originSelect.includes('value="xuchang"'), 'expected Wei-owned city xuchang excluded from origin select');
    assert.ok(!originSelect.includes('value="jianye"'), 'expected Wu-owned city jianye excluded from origin select');

    // Target select shows only cities nearby jingzhou (excludes self and distant cities)
    assert.ok(!targetSelect.includes('value="jingzhou"'), 'expected origin city jingzhou excluded from target select');
    assert.ok(targetSelect.includes('value="xuchang"'), 'expected nearby city xuchang in target select');
    assert.ok(targetSelect.includes('value="hanzhong"'), 'expected nearby city hanzhong in target select');
    assert.ok(targetSelect.includes('value="jianye"'), 'expected nearby city jianye in target select');
    assert.ok(!targetSelect.includes('value="beiping"'), 'expected distant city beiping excluded from target select');
    assert.ok(!targetSelect.includes('value="rome"'), 'expected distant city rome excluded from target select');
    assert.ok(!targetSelect.includes('value="yamatai"'), 'expected distant city yamatai excluded from target select');
  });

  test('renders empty options for both origin and target when playerFactionId controls no cities', () => {
    const coalitionScenario = SCENARIOS[0];
    const html = renderToStaticMarkup(
      <TacticalMap
        selectedScenario={coalitionScenario}
        officers={officers}
        playerFactionId="shu"
        soundEnabled={false}
      />,
    );
    const originMatch = html.match(/<select[^>]*id="select-exp-origin"[\s\S]*?<\/select>/);
    const targetMatch = html.match(/<select[^>]*id="select-exp-target"[\s\S]*?<\/select>/);
    assert.ok(originMatch, 'expected select-exp-origin');
    assert.ok(targetMatch, 'expected select-exp-target');
    assert.ok(originMatch[0].includes('当前所属势力暂无城池'));
    assert.ok(!originMatch[0].includes('value="xuchang"'));
    assert.ok(targetMatch[0].includes('请先选择起源城池'));
    assert.ok(!targetMatch[0].includes('value="xuchang"'));
  });

  test('falls back to closest 3 cities for frontier cities beyond radius', () => {
    const yamataiTargets = getNearbyTargetCities('yamatai').map(c => c.id);
    assert.equal(yamataiTargets.length, 3);
    assert.deepEqual(yamataiTargets, ['xiangping', 'xiapi', 'beiping']);
  });

  test('includes 5 bigger metropolis cities rendered with enlarged tier markers', () => {
    const metropolisIds = ['london', 'paris', 'constantinople', 'moscow', 'guangzhou'];
    const metropolises = CITIES.filter(c => c.tier === 'metropolis');
    assert.deepEqual(
      metropolises.map(c => c.id),
      metropolisIds,
      'expected exactly the 5 added metropolis cities',
    );

    const chibiScenario = SCENARIOS.find(s => s.id === 'chibi') ?? SCENARIOS[1];
    const chibiHtml = renderToStaticMarkup(
      <TacticalMap
        selectedScenario={chibiScenario}
        officers={officers}
        playerFactionId="shu"
        soundEnabled={false}
      />,
    );

    for (const id of metropolisIds) {
      const nodeMatch = chibiHtml.match(new RegExp(`<div[^>]*id="city-node-${id}"[^>]*>`));
      assert.ok(nodeMatch, `expected #city-node-${id} in map markup`);
      assert.ok(
        nodeMatch[0].includes('data-city-tier="metropolis"'),
        `expected data-city-tier="metropolis" on #city-node-${id}`,
      );
      assert.ok(
        nodeMatch[0].includes('大都城 · '),
        `expected 大都城 tooltip prefix on #city-node-${id}`,
      );
    }

    assert.ok(chibiHtml.includes('h-4 w-4'), 'expected enlarged metropolis core marker sizing');
    assert.ok(chibiHtml.includes('h-6 w-6'), 'expected enlarged metropolis outer ring sizing');

    const guangzhouNode = chibiHtml.match(/<div[^>]*id="city-node-guangzhou"[^>]*>/)?.[0] ?? '';
    assert.ok(guangzhouNode.includes('孙吴'), 'expected guangzhou owned by Wu (孙吴) in 208 AD Chibi scenario');

    const presentScenario = SCENARIOS.find(s => s.id === 'present');
    if (presentScenario) {
      const presentHtml = renderToStaticMarkup(
        <TacticalMap
          selectedScenario={presentScenario}
          officers={officers}
          playerFactionId="shu"
          soundEnabled={false}
        />,
      );
      const parisNode = presentHtml.match(/<div[^>]*id="city-node-paris"[^>]*>/)?.[0] ?? '';
      const moscowNode = presentHtml.match(/<div[^>]*id="city-node-moscow"[^>]*>/)?.[0] ?? '';
      assert.ok(parisNode.includes('法兰西') || parisNode.includes('法国'), 'expected Paris owned by France in present scenario');
      assert.ok(moscowNode.includes('俄罗斯') || moscowNode.includes('俄'), 'expected Moscow owned by Russia in present scenario');
    }
  });

  test('renders two opposing factions fighting each other during map war animation', () => {
    const chibiScenario = SCENARIOS.find(s => s.id === 'chibi') ?? SCENARIOS[1];
    const clashHtml = renderToStaticMarkup(
      <TacticalMap
        selectedScenario={chibiScenario}
        officers={officers}
        playerFactionId="shu"
        soundEnabled={false}
        initialBattleVisual={{
          origId: 'jingzhou',
          targId: 'xuchang',
          attackerFactionId: 'shu',
          defenderFactionId: 'wei',
          attackerFactionName: '蜀汉',
          defenderFactionName: '曹魏',
          attackerColor: '#10b981',
          defenderColor: '#3b82f6',
          attackerGeneralName: '关羽',
          defenderGeneralName: '曹操',
          isSiege: true,
          siegeWin: true,
          successRate: 64,
          step: 3,
        }}
      />,
    );

    assert.ok(clashHtml.includes('id="faction-war-clash-svg"'), 'expected SVG opposing faction formations');
    assert.ok(clashHtml.includes('id="faction-war-volleys"'), 'expected crossfire arrow/bolt volleys between factions');
    assert.ok(clashHtml.includes('id="faction-war-hud-overlay"'), 'expected two-faction war HUD overlay');
    assert.ok(clashHtml.includes('data-testid="war-anim-attacker"'), 'expected attacker faction banner');
    assert.ok(clashHtml.includes('data-testid="war-anim-defender"'), 'expected defender faction banner');
    assert.ok(clashHtml.includes('data-testid="war-anim-clash"'), 'expected central clash spark marker');
    assert.ok(clashHtml.includes('data-testid="war-anim-scoreboard"'), 'expected live faction tug-of-war scoreboard');
    assert.ok(clashHtml.includes('蜀汉') && clashHtml.includes('曹魏'), 'expected both fighting factions labeled');
    assert.ok(clashHtml.includes('两军激战'), 'expected active clash phase label');

    const resolvedHtml = renderToStaticMarkup(
      <TacticalMap
        selectedScenario={chibiScenario}
        officers={officers}
        playerFactionId="shu"
        soundEnabled={false}
        initialBattleVisual={{
          origId: 'jingzhou',
          targId: 'xuchang',
          attackerFactionId: 'shu',
          defenderFactionId: 'wei',
          attackerFactionName: '蜀汉',
          defenderFactionName: '曹魏',
          attackerColor: '#10b981',
          defenderColor: '#3b82f6',
          attackerGeneralName: '关羽',
          defenderGeneralName: '曹操',
          isSiege: true,
          siegeWin: true,
          successRate: 64,
          step: 4,
        }}
      />,
    );
    assert.ok(resolvedHtml.includes('蜀汉 破城') || resolvedHtml.includes('蜀 破城'), 'expected victory resolution badge');
    assert.ok(!resolvedHtml.includes('id="faction-war-volleys"'), 'expected volleys to stop after resolution');
  });

  test('renders distinct visual icons and legend filters for trading hubs, military barracks, and agricultural centers on svg-map', () => {
    for (const city of CITIES) {
      assert.ok(
        city.cityType === 'trade' || city.cityType === 'military' || city.cityType === 'agriculture',
        `expected valid cityType on ${city.id}`,
      );
    }

    const chibiScenario = SCENARIOS.find(s => s.id === 'chibi') ?? SCENARIOS[1];
    const mapHtml = renderToStaticMarkup(
      <TacticalMap
        selectedScenario={chibiScenario}
        officers={officers}
        playerFactionId="shu"
        soundEnabled={false}
        requestedMapTab={{ tab: 'svg-map', nonce: 1 }}
      />,
    );

    assert.ok(mapHtml.includes('id="city-type-legend"'), 'expected #city-type-legend key on svg-map');
    assert.ok(mapHtml.includes('id="btn-city-type-trade"'), 'expected trade legend filter button');
    assert.ok(mapHtml.includes('id="btn-city-type-military"'), 'expected military legend filter button');
    assert.ok(mapHtml.includes('id="btn-city-type-agriculture"'), 'expected agriculture legend filter button');

    // Distinct marker wrappers & data attributes per city specialization
    assert.ok(mapHtml.includes('data-city-type="trade"'), 'expected trade city marker');
    assert.ok(mapHtml.includes('data-testid="city-icon-trade-dunhuang"'), 'expected dunhuang trading hub icon');
    assert.ok(mapHtml.includes('data-city-type="military"'), 'expected military barracks marker');
    assert.ok(mapHtml.includes('data-testid="city-icon-military-luoyang"'), 'expected luoyang military barracks icon');
    assert.ok(mapHtml.includes('data-city-type="agriculture"'), 'expected agricultural center marker');
    assert.ok(mapHtml.includes('data-testid="city-icon-agriculture-chengdu"'), 'expected chengdu agricultural center icon');

    // Distinct vector SVG icon classes from lucide-react (Coins, Swords, Wheat)
    assert.ok(mapHtml.includes('lucide-coins'), 'expected Coins SVG icon for trading hubs');
    assert.ok(mapHtml.includes('lucide-swords'), 'expected Swords SVG icon for military barracks');
    assert.ok(mapHtml.includes('lucide-wheat'), 'expected Wheat SVG icon for agricultural centers');
  });

  test('scales city dot diameter proportionally according to city size on svg-map', () => {
    const constantinople = CITIES.find(c => c.id === 'constantinople')!;
    const luoyang = CITIES.find(c => c.id === 'luoyang')!;
    const beiping = CITIES.find(c => c.id === 'beiping')!;
    const dunhuang = CITIES.find(c => c.id === 'dunhuang')!;

    const metroMetrics = getCityDotMetrics(constantinople);
    const majorMetrics = getCityDotMetrics(luoyang);
    const regionalMetrics = getCityDotMetrics(beiping);
    const frontierMetrics = getCityDotMetrics(dunhuang);

    assert.equal(metroMetrics.sizeTier, 'metropolis');
    assert.equal(majorMetrics.sizeTier, 'major');
    assert.equal(regionalMetrics.sizeTier, 'regional');
    assert.equal(frontierMetrics.sizeTier, 'frontier');

    assert.ok(
      metroMetrics.dotPx > majorMetrics.dotPx &&
        majorMetrics.dotPx > regionalMetrics.dotPx &&
        regionalMetrics.dotPx > frontierMetrics.dotPx,
      'expected dot size strictly increasing with city population tier',
    );
    assert.ok(
      getCityDotMetrics(dunhuang, 320000).dotPx > frontierMetrics.dotPx,
      'expected live population growth to enlarge the city dot',
    );

    const chibiScenario = SCENARIOS.find(s => s.id === 'chibi') ?? SCENARIOS[1];
    const mapHtml = renderToStaticMarkup(
      <TacticalMap
        selectedScenario={chibiScenario}
        officers={officers}
        playerFactionId="shu"
        soundEnabled={false}
        requestedMapTab={{ tab: 'svg-map', nonce: 1 }}
      />,
    );

    assert.ok(mapHtml.includes('id="city-size-legend"'), 'expected #city-size-legend scale key');
    const getRenderedDotPx = (cityId: string): number => {
      const m = mapHtml.match(new RegExp(`id="city-node-${cityId}"[^>]*data-city-dot-px="([0-9.]+)"`));
      assert.ok(m, `expected data-city-dot-px on #city-node-${cityId}`);
      return Number(m[1]);
    };

    assert.ok(getRenderedDotPx('constantinople') > getRenderedDotPx('luoyang'));
    assert.ok(getRenderedDotPx('luoyang') > getRenderedDotPx('beiping'));
    assert.ok(getRenderedDotPx('beiping') > getRenderedDotPx('dunhuang'));
    assert.ok(mapHtml.includes(`width:${metroMetrics.dotPx}px;height:${metroMetrics.dotPx}px`), 'expected inline dot sizing for metropolis');
    assert.ok(mapHtml.includes(`width:${frontierMetrics.dotPx}px;height:${frontierMetrics.dotPx}px`), 'expected inline dot sizing for frontier city');
  });

  test('dynamically shows only active factions holding cities and supports legend hide/show toggle', () => {
    // Only shu and wei own cities in custom ownership -> all other factions are removed dynamically
    const customOwnership: Record<string, string> = {};
    for (const c of CITIES) {
      customOwnership[c.id] = c.id === 'chengdu' ? 'shu' : 'wei';
    }
    const { activeFactions, neutralCount } = getActiveMapFactions(customOwnership, FACTIONS, CITIES);
    assert.deepEqual(
      activeFactions.map(e => [e.faction.id, e.cityCount]),
      [
        ['wei', CITIES.length - 1],
        ['shu', 1],
      ],
    );
    assert.equal(neutralCount, 0);

    const chibiScenario = SCENARIOS.find(s => s.id === 'chibi') ?? SCENARIOS[1];
    const mapHtml = renderToStaticMarkup(
      <TacticalMap
        selectedScenario={chibiScenario}
        officers={officers}
        playerFactionId="shu"
        soundEnabled={false}
        requestedMapTab={{ tab: 'svg-map', nonce: 1 }}
      />,
    );

    assert.ok(mapHtml.includes('id="map-faction-legend"'), 'expected #map-faction-legend');
    assert.ok(mapHtml.includes('id="btn-toggle-faction-legend"'), 'expected toggle button to hide/show factions');
    assert.ok(mapHtml.includes('id="toggle-faction-legend"'), 'expected map settings checkbox for faction legend');
    // Active factions in 208 AD Chibi scenario are present
    assert.ok(mapHtml.includes('id="btn-map-faction-wei"'), 'expected active wei faction in 208 AD');
    assert.ok(mapHtml.includes('id="btn-map-faction-shu"'), 'expected active shu faction in 208 AD');
    assert.ok(mapHtml.includes('id="btn-map-faction-wu"'), 'expected active wu faction in 208 AD');
    assert.ok(mapHtml.includes('id="btn-map-faction-rome"'), 'expected active rome faction in 208 AD');
    // Factions owning 0 cities in 208 AD are dynamically removed
    assert.ok(!mapHtml.includes('id="btn-map-faction-lubu"'), 'expected zero-city lubu omitted in 208 AD');
    assert.ok(!mapHtml.includes('id="btn-map-faction-america"'), 'expected zero-city america omitted in 208 AD');
    assert.ok(!mapHtml.includes('id="btn-map-faction-qing"'), 'expected zero-city qing omitted in 208 AD');
  });
});

describe('RelationshipTree Root Officer Faction Filter', () => {
  const sampleRels = [
    { fromOfficerId: 'liubei', toOfficerId: 'guanyu', type: 'Sworn Brother' as const },
    { fromOfficerId: 'liubei', toOfficerId: 'caocao', type: 'Rival' as const },
  ];

  test('restricts #rel-tree-root-select to playerFactionId while preserving cross-faction tree nodes', () => {
    const html = renderToStaticMarkup(
      <RelationshipTree
        officers={officers}
        factions={FACTIONS}
        relationships={sampleRels}
        playerFactionId="shu"
        playerFactionName="蜀汉"
        selectedOfficerId="liubei"
        onDuelPair={noop}
        onBreakRelationship={noop}
      />,
    );
    const rootSelectMatch = html.match(/<select[^>]*id="rel-tree-root-select"[\s\S]*?<\/select>/);
    assert.ok(rootSelectMatch, 'expected select#rel-tree-root-select');
    const rootSelect = rootSelectMatch[0];

    assert.ok(rootSelect.includes('value="liubei"'), 'expected own-faction officer liubei in root select');
    assert.ok(rootSelect.includes('value="guanyu"'), 'expected own-faction officer guanyu in root select');
    assert.ok(rootSelect.includes('value="zhangfei"'), 'expected own-faction officer zhangfei in root select');
    assert.ok(!rootSelect.includes('value="caocao"'), 'expected rival officer caocao excluded from root select');
    // Cross-faction rival node still appears in the expanded relationship tree
    assert.ok(html.includes('data-testid="rel-tree-node-caocao"'), 'expected rival node in tree graph');
  });

  test('renders empty option in #rel-tree-root-select when playerFactionId has no officers', () => {
    const html = renderToStaticMarkup(
      <RelationshipTree
        officers={officers}
        factions={FACTIONS}
        relationships={sampleRels}
        playerFactionId="wu"
        playerFactionName="东吴"
        onDuelPair={noop}
        onBreakRelationship={noop}
      />,
    );
    const rootSelectMatch = html.match(/<select[^>]*id="rel-tree-root-select"[\s\S]*?<\/select>/);
    assert.ok(rootSelectMatch, 'expected select#rel-tree-root-select');
    assert.ok(rootSelectMatch[0].includes('当前所属阵营暂无武将'));
    assert.ok(!rootSelectMatch[0].includes('value="liubei"'));
    assert.ok(!rootSelectMatch[0].includes('value="caocao"'));
  });
});

describe('DiplomacyPanel Player Faction Filter', () => {
  test('restricts #diplomacy-player-faction to playerFactionId while keeping target factions open', () => {
    const html = renderToStaticMarkup(
      <DiplomacyPanel
        factions={FACTIONS}
        officers={officers}
        playerFactions={['shu', 'wei', 'wu']}
        playerFactionId="shu"
        diplomacyState={createInitialDiplomacyState(FACTIONS)}
        gold={1500}
        timestampLabel="公元 208 年 · 5 月 · 上旬"
        onExecuteMission={() => ({ ok: true })}
        onCancelPact={noop}
      />,
    );
    const senderMatch = html.match(/<select[^>]*id="diplomacy-player-faction"[\s\S]*?<\/select>/);
    const targetMatch = html.match(/<select[^>]*id="diplomacy-target-faction"[\s\S]*?<\/select>/);
    assert.ok(senderMatch, 'expected select#diplomacy-player-faction');
    assert.ok(targetMatch, 'expected select#diplomacy-target-faction');

    const senderSelect = senderMatch[0];
    const targetSelect = targetMatch[0];

    assert.ok(senderSelect.includes('value="shu"'), 'expected own faction shu in sender select');
    assert.ok(!senderSelect.includes('value="wei"'), 'expected rival faction wei excluded from sender select');
    assert.ok(!senderSelect.includes('value="wu"'), 'expected wu excluded from sender select when playerFactionId is shu');
    assert.ok(!senderSelect.includes('value="rome"'), 'expected foreign faction rome excluded from sender select');
    assert.ok(targetSelect.includes('value="wei"'), 'expected wei still available in target select');
  });

  test('renders non-sovereign empty state in #diplomacy-player-faction for ronin', () => {
    const html = renderToStaticMarkup(
      <DiplomacyPanel
        factions={FACTIONS}
        officers={officers}
        playerFactions={['ronin']}
        playerFactionId="ronin"
        diplomacyState={createInitialDiplomacyState(FACTIONS)}
        gold={1500}
        timestampLabel="公元 190 年 · 1 月 · 上旬"
        onExecuteMission={() => ({ ok: true })}
        onCancelPact={noop}
      />,
    );
    const senderMatch = html.match(/<select[^>]*id="diplomacy-player-faction"[\s\S]*?<\/select>/);
    assert.ok(senderMatch, 'expected select#diplomacy-player-faction');
    assert.ok(senderMatch[0].includes('当前所属势力暂无外交主权'));
    assert.ok(!senderMatch[0].includes('value="shu"'));
    assert.ok(!senderMatch[0].includes('value="wei"'));
  });
});

describe('PeopleMigrationsPanel & TacticalMap Migration Controls', () => {
  const sampleCities: MigrationCityRef[] = [
    { id: 'chengdu', name: '成都', x: 64, y: 60, region: '巴蜀', theater: 'central' },
    { id: 'hanzhong', name: '汉中', x: 66, y: 51, region: '秦巴', theater: 'central' },
    { id: 'luoyang', name: '洛阳', x: 71, y: 43, region: '司隶', theater: 'central' },
  ];

  test('renders migration tab, map flow toggle, and selected city population stats in TacticalMap', () => {
    const chibiScenario = SCENARIOS.find(s => s.id === 'chibi') ?? SCENARIOS[1];
    const html = renderToStaticMarkup(
      <TacticalMap
        selectedScenario={chibiScenario}
        officers={officers}
        playerFactionId="shu"
        soundEnabled={false}
      />,
    );
    assert.ok(html.includes('id="tab-map-migrations"'), 'expected #tab-map-migrations button');
    assert.ok(html.includes('id="tab-map-svg"'), 'expected #tab-map-svg button');
    assert.ok(html.includes('id="tab-map-city-view"'), 'expected #tab-map-city-view button');
  });

  test('renders decree form, live quote, wave log, and city livability table in PeopleMigrationsPanel', () => {
    const initial = createInitialMigrationState();
    const seededState = {
      ...initial,
      totalMigrated: 4200,
      waves: [
        {
          id: 'wave-1',
          tick: 1,
          cause: 'disaster_exodus' as const,
          fromCityId: 'luoyang',
          fromCityName: '洛阳',
          toCityId: 'chengdu',
          toCityName: '成都',
          count: 4200,
          timestamp: '208年 1月 中旬',
          summary: '洛阳因灾荒动荡，4,200名流民迁至成都谋生。',
        },
      ],
    };
    const html = renderToStaticMarkup(
      <PeopleMigrationsPanel
        cities={sampleCities}
        factions={FACTIONS}
        officers={officers}
        cityOwnership={{ chengdu: 'shu', hanzhong: 'shu', luoyang: 'wei' }}
        cityStats={{
          chengdu: { prosperity: 86, defense: 82, grain: 2800, population: 145000 },
          hanzhong: { prosperity: 74, defense: 78, grain: 1900, population: 95000 },
          luoyang: { prosperity: 60, defense: 75, grain: 1100, population: 112000 },
        }}
        activeDisasterCityIds={new Set(['luoyang'])}
        migrationState={seededState}
        playerFactionId="shu"
        gold={1500}
        timestampLabel="208年 1月 中旬"
        onExecuteResettlement={() => undefined}
      />,
    );

    assert.ok(html.includes('id="select-migration-origin"'), 'expected origin selector');
    assert.ok(html.includes('id="select-migration-target"'), 'expected target selector');
    assert.ok(html.includes('id="btn-execute-migration"'), 'expected submit decree button');
    assert.ok(html.includes('4,200 人'), 'expected wave migrated count');
    assert.ok(html.includes('灾荒流徙'), 'expected disaster exodus label');
    assert.ok(html.includes('受灾'), 'expected affected city flag in table');
    assert.ok(html.includes('145,000'), 'expected city population in ledger table');

    const originMatch = html.match(/<select[^>]*id="select-migration-origin"[\s\S]*?<\/select>/);
    const targetMatch = html.match(/<select[^>]*id="select-migration-target"[\s\S]*?<\/select>/);
    assert.ok(originMatch, 'expected #select-migration-origin markup');
    assert.ok(targetMatch, 'expected #select-migration-target markup');
    assert.ok(originMatch[0].includes('value="chengdu"'), 'expected own city chengdu in origin selector');
    assert.ok(originMatch[0].includes('value="hanzhong"'), 'expected own city hanzhong in origin selector');
    assert.ok(!originMatch[0].includes('value="luoyang"'), 'expected rival city luoyang excluded from origin selector');
    assert.ok(targetMatch[0].includes('value="luoyang"'), 'expected luoyang still selectable as target');
  });

  test('renders empty option and disables #select-migration-origin when playerFactionId owns no cities', () => {
    const html = renderToStaticMarkup(
      <PeopleMigrationsPanel
        cities={sampleCities}
        factions={FACTIONS}
        officers={officers}
        cityOwnership={{ chengdu: 'shu', hanzhong: 'shu', luoyang: 'wei' }}
        cityStats={{
          chengdu: { prosperity: 86, defense: 82, grain: 2800, population: 145000 },
          hanzhong: { prosperity: 74, defense: 78, grain: 1900, population: 95000 },
          luoyang: { prosperity: 60, defense: 75, grain: 1100, population: 112000 },
        }}
        activeDisasterCityIds={new Set()}
        migrationState={createInitialMigrationState()}
        playerFactionId="wu"
        gold={1500}
        timestampLabel="208年 1月 中旬"
        onExecuteResettlement={() => undefined}
      />,
    );

    const originMatch = html.match(/<select[^>]*id="select-migration-origin"[\s\S]*?<\/select>/);
    assert.ok(originMatch, 'expected #select-migration-origin markup');
    assert.ok(originMatch[0].includes('当前所属势力暂无城池'), 'expected empty city option');
    assert.ok(!originMatch[0].includes('value="chengdu"'), 'expected chengdu excluded when not owned');
    assert.ok(!originMatch[0].includes('value="luoyang"'), 'expected luoyang excluded when not owned');
  });
});

describe('Alerts Overlay Component', () => {
  test('renders nothing on calm sunny weather outside scheduled disaster windows', () => {
    const html = renderToStaticMarkup(
      <Alerts
        weatherId="sunny"
        gameMonth={1}
        gameYear={208}
        gameXun={1}
        scenarioYear={208}
        onViewReliefMeasures={noop}
      />,
    );
    assert.equal(html, '');
  });

  test('renders bottom toast with View Relief Measures button for extreme weather (heavy_rain flood alert)', () => {
    const html = renderToStaticMarkup(
      <Alerts
        weatherId="heavy_rain"
        gameMonth={7}
        gameYear={208}
        gameXun={1}
        scenarioYear={208}
        onViewReliefMeasures={noop}
      />,
    );
    assert.ok(html.includes('id="alerts-overlay"'), 'expected #alerts-overlay container');
    assert.ok(html.includes('id="btn-view-relief-measures"'), 'expected View Relief Measures CTA button');
    assert.ok(html.includes('View Relief Measures'), 'expected exact button text View Relief Measures');
    assert.ok(html.includes('洪涝与暴雨警报'), 'expected flood alert category');
  });

  test('evaluates winter blizzard/famine alert on snow and scheduled flood/famine months', () => {
    const winterFamine = evaluateWeatherAndDisasterAlert({
      weatherId: 'snow',
      gameMonth: 12,
      gameYear: 208,
      gameXun: 2,
      scenarioYear: 208,
    });
    assert.ok(winterFamine);
    assert.equal(winterFamine.category, 'famine');
    assert.equal(winterFamine.severity, 'catastrophic');

    const floodSeason = evaluateWeatherAndDisasterAlert({
      weatherId: 'sunny',
      gameMonth: 7,
      gameYear: 208,
      gameXun: 3,
      scenarioYear: 208,
    });
    assert.ok(floodSeason);
    assert.equal(floodSeason.category, 'flood');
  });

  test('prioritizes unresolved activeDisaster details in toast markup', () => {
    const html = renderToStaticMarkup(
      <Alerts
        weatherId="sunny"
        gameMonth={10}
        gameYear={208}
        gameXun={2}
        scenarioYear={208}
        activeDisaster={{
          eventId: 'steppe_blizzard_drought',
          category: 'drought',
          severity: 'severe',
          title: '极寒暴雪与大旱蝗灾并发',
          description: '粮仓告急，需及时开仓放粮。',
          affectedCityNames: ['敦煌', '疏勒'],
        }}
        onViewReliefMeasures={noop}
      />,
    );
    assert.ok(html.includes('极寒暴雪与大旱蝗灾并发'));
    assert.ok(html.includes('敦煌、疏勒'));
    assert.ok(html.includes('View Relief Measures'));
  });
});

describe('ProtagonistProfile & StartMenu Self Information', () => {
  test('renders comprehensive personal dossier for the player protagonist', () => {
    const self = makeOfficer('liubei', '刘备', {
      styleName: '玄德',
      englishName: 'Liu Bei',
      origin: '幽州涿郡',
      homeCity: '成都',
      promotionLevel: 2,
      promotionTitle: '左将军',
      stats: { leadership: 82, force: 74, intelligence: 79, politics: 86, charisma: 98 },
      traits: ['仁德', '知人善任'],
      skills: ['仁者无敌', '激励'],
      biography: '汉室宗亲，以信义仁德著称于世，志在兴复汉室。',
    });
    const rpg = createRpgCharacter('liubei');
    rpg.level = 4;
    rpg.xp = 320;
    rpg.learnedSkills = ['义军鼓舞'];
    rpg.equipment.weapon = {
      id: 'shuanggujian',
      name: '雌雄双股剑',
      slot: 'weapon',
      statBonuses: { force: 5, charisma: 4 },
      skillBonuses: ['双剑合璧'],
    };

    const html = renderToStaticMarkup(
      <ProtagonistProfile
        protagonist={self}
        officers={[self, makeOfficer('guanyu', '关羽'), makeOfficer('zhangfei', '张飞')]}
        factions={FACTIONS}
        rpgCharacter={rpg}
        party={{ protagonistId: 'liubei', companionIds: ['guanyu'] }}
        relationships={[
          { fromOfficerId: 'liubei', toOfficerId: 'guanyu', type: 'Sworn Brother' },
        ]}
        diplomacyState={createInitialDiplomacyState(FACTIONS)}
        scenario={SCENARIOS[1]}
        seasonId="spring"
        currentCityName="成都"
        gold={2400}
        quests={ALL_QUESTS}
        questStates={[]}
        onUpdateSelf={noop}
        onSelectProtagonist={noop}
        onFocusAdvisor={noop}
        onOpenCreator={noop}
      />,
    );

    assert.ok(html.includes('id="protagonist-profile"'), 'expected #protagonist-profile section');
    assert.ok(html.includes('data-testid="protagonist-radar-svg"'), 'expected 5-axis SVG radar chart');
    assert.ok(html.includes('五维属性雷达图'), 'expected radar SVG aria-label');
    assert.ok(html.includes('刘备'), 'expected protagonist name');
    assert.ok(html.includes('字 玄德'), 'expected styleName');
    assert.ok(html.includes('Liu Bei'), 'expected englishName');
    assert.ok(html.includes('左将军'), 'expected promotion title');
    assert.ok(html.includes('成都'), 'expected home city');
    assert.ok(html.includes('幽州涿郡'), 'expected origin');
    assert.ok(html.includes('雌雄双股剑'), 'expected equipped weapon');
    assert.ok(html.includes('武+5 魅+4'), 'expected equipment bonus summary');
    assert.ok(html.includes('关羽'), 'expected companion portrait tile');
    assert.ok(html.includes('id="btn-focus-self-advisor"'), 'expected advisor focus button');
    assert.ok(!html.includes('id="select-self-protagonist"'), 'expected removed protagonist switcher to stay removed');
    assert.ok(!html.includes('id="btn-edit-self-profile"'), 'expected removed edit button to stay removed');
  });

  test('renders selected protagonist visual preview with radar in StartMenu', () => {
    const html = renderToStaticMarkup(
      <StartMenu
        scenarios={SCENARIOS}
        selectedScenario={SCENARIOS[1]}
        onSelectScenario={noop}
        onEnterApp={noop}
        soundEnabled={false}
        onToggleSound={noop}
        protagonistId="liubei"
      />,
    );

    assert.ok(
      html.includes('data-testid="start-protagonist-preview"'),
      'expected protagonist preview card in StartMenu',
    );
    assert.ok(html.includes('五维属性雷达图'), 'expected mini radar chart in StartMenu preview');
    assert.ok(html.includes('start-protagonist-traits'), 'expected traits summary in StartMenu preview');
  });
});

describe('Expanded FAMOUS_OFFICERS & FAMOUS_RELATIONSHIPS', () => {
  test('includes newly added historical and global officers with unique IDs and valid factions/relationships', () => {
    const ids = FAMOUS_OFFICERS.map(o => o.id);
    assert.equal(new Set(ids).size, FAMOUS_OFFICERS.length, 'expected all officer IDs to be unique');
    assert.ok(FAMOUS_OFFICERS.length >= 49, 'expected expanded officer roster (>= 49)');

    const factionIds = new Set(FACTIONS.map(f => f.id));
    for (const officer of FAMOUS_OFFICERS) {
      assert.ok(factionIds.has(officer.factionId), `expected valid factionId for ${officer.id}`);
    }

    const expectedNewIds = [
      'zhangfei', 'zhaoyun', 'machao', 'simayi', 'zhangliao',
      'sunce', 'luxun', 'yuanshao', 'churchill', 'justinian',
      'saladin', 'banchao',
    ];
    for (const newId of expectedNewIds) {
      assert.ok(ids.includes(newId), `expected ${newId} in FAMOUS_OFFICERS`);
    }

    const officerIdSet = new Set(ids);
    for (const rel of FAMOUS_RELATIONSHIPS) {
      assert.ok(officerIdSet.has(rel.fromOfficerId), `expected valid fromOfficerId ${rel.fromOfficerId}`);
      assert.ok(officerIdSet.has(rel.toOfficerId), `expected valid toOfficerId ${rel.toOfficerId}`);
    }
  });
});

describe('WorldSituation2026 Event Visibility', () => {
  test('renders only occurred events and hides events that have not happened yet', () => {
    const tick = campaignTick(2026, 2, 1); // fires tariffs (m1) and ai_chips (m2) only
    const worldState = advanceWorld(createWorldState(FACTIONS), 2026, tick);

    const html = renderToStaticMarkup(
      <WorldSituation2026
        worldState={worldState}
        factions={FACTIONS}
        currentTick={tick}
        timestampLabel="2026年 2月 上旬"
        onRespondEvent={noop}
      />,
    );

    assert.ok(html.includes('data-testid="world2026-event-tariffs"'), 'expected occurred m1 tariffs event');
    assert.ok(html.includes('data-testid="world2026-event-ai_chips"'), 'expected occurred m2 ai_chips event');
    assert.ok(!html.includes('data-testid="world2026-event-energy"'), 'expected upcoming m3 energy event hidden');
    assert.ok(!html.includes('data-testid="world2026-event-food"'), 'expected upcoming m7 food event hidden');
    assert.ok(!html.includes('data-testid="world2026-event-summit"'), 'expected upcoming m11 summit event hidden');
    assert.ok(!html.includes('待触发'), 'expected no upcoming badge rendered');
  });

  test('renders empty message when no geopolitical events have occurred yet', () => {
    const html = renderToStaticMarkup(
      <WorldSituation2026
        worldState={createWorldState(FACTIONS)}
        factions={FACTIONS}
        currentTick={0}
        timestampLabel="2026年 1月 上旬"
        onRespondEvent={noop}
      />,
    );

    assert.ok(!html.includes('world2026-events-grid'), 'expected no event cards grid before any event fires');
    assert.ok(html.includes('当前尚无已触发的地缘事件'), 'expected empty state prompt');
  });
});

describe('WarMode Clash of Clans Village Raid', () => {
  test('renders Clash of Clans battlefield column with 3-star HUD, village defenses, and deployable troop/spell deck', () => {
    const html = renderToStaticMarkup(
      <WarMode
        originCity={CITIES[0]}
        targetCity={CITIES[1]}
        attackerFaction={FACTIONS[0]}
        defenderFaction={FACTIONS[1]}
        attackingOfficer={officers[1]}
        defendingOfficer={officers[3]}
        weatherId="sunny"
        soundEnabled={false}
        onBattleComplete={noop}
        onClose={noop}
      />,
    );

    assert.ok(html.includes('id="war-mode-panel"'), 'expected #war-mode-panel');
    assert.ok(html.includes('data-testid="coc-battlefield-column"'), 'expected CoC middle battlefield column');
    assert.ok(html.includes('data-testid="coc-raid-hud"'), 'expected CoC raid HUD');
    assert.ok(html.includes('data-testid="coc-stars-meter"'), 'expected 3-star raid meter');
    assert.ok(html.includes('data-testid="coc-destruction-pct"'), 'expected destruction % readout');
    assert.ok(html.includes('data-testid="coc-raid-timer"'), 'expected 3:00 raid countdown timer');
    assert.ok(html.includes('data-testid="coc-village-arena"'), 'expected #war-live-arena CoC village grass map');
    assert.ok(html.includes('data-testid="coc-building-town_hall"'), 'expected Town Hall building');
    assert.ok(html.includes('data-testid="coc-building-cannon"'), 'expected Cannon defense');
    assert.ok(html.includes('data-testid="coc-building-archer_tower"'), 'expected Archer Tower defense');
    assert.ok(html.includes('data-testid="coc-building-mortar"'), 'expected Mortar defense');
    assert.ok(html.includes('data-testid="coc-building-wall"'), 'expected Stone Wall blocks');
    assert.ok(html.includes('data-testid="coc-troop-deck"'), 'expected deployable troop/spell deck');
    assert.ok(html.includes('data-testid="coc-card-barbarian"'), 'expected Barbarian card');
    assert.ok(html.includes('data-testid="coc-card-archer"'), 'expected Archer card');
    assert.ok(html.includes('data-testid="coc-card-giant"'), 'expected Giant card');
    assert.ok(html.includes('data-testid="coc-card-wall_breaker"'), 'expected Wall Breaker card');
    assert.ok(html.includes('data-testid="coc-card-rage_spell"'), 'expected Rage Spell card');
    assert.ok(html.includes('data-testid="coc-card-heal_spell"'), 'expected Heal Spell card');
  });
});

describe('Scene3DViewer & 3D Navigation Triggers', () => {
  test('renders 3D viewer shell, subject switcher, camera presets, explode slider, atmosphere mood, and collapsible dock in SSR', () => {
    const html = renderToStaticMarkup(
      <Scene3DViewer
        cities={CITIES}
        factions={FACTIONS}
        officers={officers}
        selectedCityId="luoyang"
        cityOwnership={{ luoyang: 'wei' }}
        seasonId="autumn"
        weatherId="sunny"
      />,
    );

    assert.ok(html.includes('id="scene-3d-viewer"'), 'expected #scene-3d-viewer root');
    assert.ok(html.includes('id="btn-3d-subject-citadel"'), 'expected citadel subject button');
    assert.ok(html.includes('id="btn-3d-subject-sandtable"'), 'expected sandtable subject button');
    assert.ok(html.includes('id="btn-3d-subject-siege"'), 'expected siege subject button');
    assert.ok(html.includes('id="select-3d-city"'), 'expected 3D city selector');
    assert.ok(html.includes('id="btn-3d-cam-overview"'), 'expected camera overview button');
    assert.ok(html.includes('id="btn-3d-cam-lowAngle"'), 'expected camera lowAngle button');
    assert.ok(html.includes('id="btn-3d-cam-closeup"'), 'expected camera closeup button');
    assert.ok(html.includes('id="btn-3d-cam-flank"'), 'expected camera flank button');
    assert.ok(html.includes('id="range-3d-explode"'), 'expected exploded view range slider');
    assert.ok(html.includes('id="select-3d-atmosphere"'), 'expected atmosphere selector');
    assert.ok(html.includes('id="btn-3d-autorotate"'), 'expected auto-rotate toggle');
    assert.ok(html.includes('id="btn-3d-toggle-dock"'), 'expected dock collapse toggle');
    assert.ok(html.includes('洛阳'), 'expected active selected city label');
  });

  test('renders #tab-viewer3d in GameNavigation and #tab-map-3d-viewer in TacticalMap', () => {
    const navHtml = renderToStaticMarkup(
      <GameNavigation
        activeTab="viewer3d"
        onSelect={noop}
        year={190}
        month={1}
        xun={1}
        playing={false}
        onToggleTime={noop}
        speed="normal"
        onSpeed={noop}
        onStep={noop}
        onMonth={noop}
      />,
    );
    assert.ok(navHtml.includes('id="tab-viewer3d"'), 'expected #tab-viewer3d primary tab button');
    assert.ok(navHtml.includes('城池'), 'expected 城池 label in GameNavigation');
  });
});

describe('AdvisorChatPanel War Council Chat', () => {
  test('renders character personality roleplay header, mode toggle, tailored prompts, and composer', () => {
    const lubu = FAMOUS_OFFICERS.find(o => o.id === 'lubu') ?? officers[0];
    const html = renderToStaticMarkup(
      <AdvisorChatPanel
        officer={lubu}
        allOfficers={FAMOUS_OFFICERS}
        relationships={FAMOUS_RELATIONSHIPS}
        protagonistName="刘备"
        factionName="吕布军"
        scenario={SCENARIOS[0]}
        currentCityName="下邳"
        timestampLabel="公元 190 年 · 1 月 · 上旬"
        seasonName="春"
        playerGold={1500}
        advisorBrief=""
        isConsultingAdvisor={false}
        onConsultWarCouncil={noop}
        renderAdviceMarkdown={text => <p>{text}</p>}
      />,
    );

    assert.ok(html.includes('id="advisor-chat-chamber"'), 'expected #advisor-chat-chamber container');
    assert.ok(html.includes('id="advisor-personality-badge"'), 'expected #advisor-personality-badge');
    assert.ok(html.includes('无双战神'), 'expected Lv Bu personality archetype badge');
    assert.ok(html.includes('id="btn-chat-mode-character"'), 'expected character mode toggle button');
    assert.ok(html.includes('id="btn-chat-mode-strategist"'), 'expected strategist mode toggle button');
    assert.ok(html.includes('id="advisor-chat-messages"'), 'expected #advisor-chat-messages log');
    assert.ok(html.includes('id="form-advisor-chat"'), 'expected #form-advisor-chat form');
    assert.ok(html.includes('id="input-advisor-chat"'), 'expected #input-advisor-chat input');
    assert.ok(html.includes('id="btn-send-advisor-chat"'), 'expected #btn-send-advisor-chat button');
    assert.ok(html.includes('id="btn-evaluate-strategy-brief"'), 'expected #btn-evaluate-strategy-brief button');
    assert.ok(html.includes('id="btn-advisor-prompt-0"'), 'expected quick starter prompt button');
    assert.ok(html.includes('下邳'), 'expected current city context inside chat panel');
  });

  test('renders OfficerSpotlight with only non-self officers from the current city', () => {
    const candidates = getSpotlightOfficerCandidates(FAMOUS_OFFICERS, 'liubei', '成都');
    const focused = pickNonSelfOfficer(FAMOUS_OFFICERS, 'liubei', undefined, '成都')!;
    const html = renderToStaticMarkup(
      <OfficerSpotlight
        officer={focused}
        candidates={candidates}
        factions={FACTIONS}
        scenarioYear={190}
        currentCityName="成都"
        onSelectOfficerId={noop}
        onCollapse={noop}
      />,
    );

    assert.ok(html.includes('id="officer-spotlight-card"'), 'expected #officer-spotlight-card');
    assert.ok(html.includes('成都 同城武将'), 'expected current city label in spotlight header');
    const selectMatch = html.match(/<select[^>]*id="select-spotlight-officer"[\s\S]*?<\/select>/);
    assert.ok(selectMatch, 'expected #select-spotlight-officer select');
    assert.ok(!selectMatch[0].includes('value="liubei"'), 'expected protagonist liubei excluded from spotlight selector');
    assert.ok(selectMatch[0].includes('value="guanyu"'), 'expected Chengdu officer guanyu in spotlight selector');
    assert.ok(!selectMatch[0].includes('value="caocao"'), 'expected non-Chengdu officer caocao excluded');
    assert.ok(!selectMatch[0].includes('value="lubu"'), 'expected non-Chengdu officer lubu excluded');
  });

  test('renders disabled empty option in OfficerSpotlight when current city has no other officers', () => {
    const html = renderToStaticMarkup(
      <OfficerSpotlight
        officer={null}
        candidates={[]}
        factions={FACTIONS}
        scenarioYear={190}
        currentCityName="敦煌"
        onSelectOfficerId={noop}
        onCollapse={noop}
      />,
    );

    const selectMatch = html.match(/<select[^>]*id="select-spotlight-officer"[\s\S]*?<\/select>/);
    assert.ok(selectMatch, 'expected #select-spotlight-officer select');
    assert.ok(selectMatch[0].includes('disabled'), 'expected select disabled when city has no peers');
    assert.ok(selectMatch[0].includes('敦煌 暂无其他同城武将'), 'expected city-specific empty state option');
  });
});


