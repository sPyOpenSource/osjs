import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import InternalAffairs from '../InternalAffairs';
import DuelArena from '../DuelArena';
import TacticalMap, { getNearbyTargetCities } from '../TacticalMap';
import RelationshipTree from '../RelationshipTree';
import DiplomacyPanel from '../DiplomacyPanel';
import PeopleMigrationsPanel from '../PeopleMigrationsPanel';
import Alerts, { evaluateWeatherAndDisasterAlert } from '../Alerts';
import { createInitialDiplomacyState } from '../../utils/diplomacy';
import { createInitialMigrationState, MigrationCityRef } from '../../utils/migrations';
import { FACTIONS, SCENARIOS } from '../../data';
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

describe('DuelArena Left Camp Faction Filter', () => {
  test('limits left duelist select to playerFactionId while keeping right duelist open to all officers', () => {
    const html = renderToStaticMarkup(
      <DuelArena
        officers={officers}
        playerFactionId="shu"
        playerFactionName="蜀汉"
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

    assert.ok(leftSelect.includes('value="liubei"'), 'expected own-faction officer liubei in left select');
    assert.ok(leftSelect.includes('value="guanyu"'), 'expected own-faction officer guanyu in left select');
    assert.ok(!leftSelect.includes('value="caocao"'), 'expected rival officer caocao excluded from left select');
    assert.ok(rightSelect.includes('value="caocao"'), 'expected rival officer caocao still available in right select');
    assert.ok(html.includes('麾下 3 位'), 'expected own-faction officer count badge in left camp');
  });

  test('renders empty state in left duelist camp when playerFactionId has no officers', () => {
    const html = renderToStaticMarkup(
      <DuelArena
        officers={officers}
        playerFactionId="wu"
        playerFactionName="东吴"
        soundEnabled={false}
        playClashSound={noop}
        playDrumSound={noop}
      />,
    );
    const leftSelectMatch = html.match(/<select[^>]*id="select-left-duelist"[\s\S]*?<\/select>/);
    assert.ok(leftSelectMatch, 'expected select-left-duelist');
    assert.ok(leftSelectMatch[0].includes('当前所属阵营暂无可出战武将'));
    assert.ok(!leftSelectMatch[0].includes('value="liubei"'));
    assert.ok(!leftSelectMatch[0].includes('value="caocao"'));
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
    assert.ok(html.includes('id="toggle-migrations"'), 'expected #toggle-migrations layer checkbox');
    assert.ok(html.includes('id="selected-city-stats"'), 'expected #selected-city-stats readout');
    assert.ok(html.includes('户籍人口'), 'expected city population label');
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



