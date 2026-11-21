import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import { Faction, Officer } from '../types';
import {
  buildRelationChartData,
  cancelDiplomaticPact,
  createInitialDiplomacyState,
  executeEnvoyMission,
  getDiplomaticStanding,
  getRelationScore,
  hasAlliance,
  hasTradePact,
  quoteEnvoyMission,
} from './diplomacy';

const TEST_FACTIONS: Faction[] = [
  { id: 'shu', name: '蜀汉', ruler: '刘备', color: '#10b981', description: '仁德之师', crest: '🐉' },
  { id: 'wei', name: '曹魏', ruler: '曹操', color: '#3b82f6', description: '挟天子以令诸侯', crest: '🦅' },
  { id: 'wu', name: '孙吴', ruler: '孙权', color: '#ef4444', description: '江东世族', crest: '🐅' },
  { id: 'france', name: '法兰西', ruler: '马克龙', color: '#2563eb', description: '欧洲强邦', crest: '⚜️' },
  { id: 'germany', name: '德意志', ruler: '朔尔茨', color: '#64748b', description: '中欧工业国', crest: '🦅' },
  { id: 'ronin', name: '在野', ruler: '群雄', color: '#94a3b8', description: '在野游侠', crest: '🏳️' },
];

const BASE_AVATAR = {
  hairColor: '#000',
  hairStyle: 'Topknot Imperial',
  armorColor: '#10b981',
  accessory: 'None',
  expression: 'Warm Smiling',
  bgGradient: 'from-emerald-950 to-teal-900',
};

const ENVOY_SHU: Officer = {
  id: 'zhugeliang',
  name: '诸葛亮',
  gender: 'Male',
  factionId: 'shu',
  avatarStyle: BASE_AVATAR,
  stats: { leadership: 96, force: 38, intelligence: 100, politics: 98, charisma: 95 },
  traits: ['仁德', '外交辩才'],
  skills: ['火计'],
  biography: '卧龙军师',
};

describe('diplomacy engine', () => {
  test('initializes symmetrical relation scores and baseline pacts', () => {
    const state = createInitialDiplomacyState(TEST_FACTIONS);
    assert.equal(getRelationScore(state, 'shu', 'wu'), 35);
    assert.equal(getRelationScore(state, 'wu', 'shu'), 35);
    assert.equal(getRelationScore(state, 'shu', 'wei'), -55);
    assert.equal(hasAlliance(state, 'shu', 'wu'), true);
    assert.equal(hasTradePact(state, 'france', 'germany'), true);
    assert.equal(hasTradePact(state, 'shu', 'wei'), false);
    assert.equal(getDiplomaticStanding(state, 'shu', 'wu').standing, 'allied');
    assert.equal(getDiplomaticStanding(state, 'shu', 'wei').standing, 'cold');
  });

  test('gift mission deducts gold, always succeeds, and raises relation score', () => {
    const state = createInitialDiplomacyState(TEST_FACTIONS);
    const before = getRelationScore(state, 'shu', 'wei');
    const quote = quoteEnvoyMission({
      state,
      playerFaction: 'shu',
      targetFaction: 'wei',
      missionType: 'gift',
      envoy: ENVOY_SHU,
      gold: 1500,
      giftAmount: 500,
    });
    assert.equal(quote.valid, true);
    assert.equal(quote.cost, 500);
    assert.equal(quote.successChance, 100);

    const res = executeEnvoyMission({
      state,
      factions: TEST_FACTIONS,
      playerFaction: 'shu',
      targetFaction: 'wei',
      missionType: 'gift',
      envoy: ENVOY_SHU,
      gold: 1500,
      giftAmount: 500,
      timestampLabel: '190年 1月 上旬',
      roll: 0.5,
    });

    assert.equal(res.ok, true);
    assert.equal(res.gold, 1000);
    assert.ok(getRelationScore(res.state, 'shu', 'wei') > before);
    assert.equal(res.entry?.accepted, true);
    assert.equal(res.entry?.cost, 500);
    assert.equal(res.state.logs.length, 1);
  });

  test('trade pact mission records pact and boosts relation on acceptance, penalizes on rejection', () => {
    const state = createInitialDiplomacyState(TEST_FACTIONS);
    const accepted = executeEnvoyMission({
      state,
      factions: TEST_FACTIONS,
      playerFaction: 'shu',
      targetFaction: 'france',
      missionType: 'trade_pact',
      envoy: ENVOY_SHU,
      gold: 1000,
      roll: 0.05,
    });
    assert.equal(accepted.ok, true);
    assert.equal(accepted.gold, 850);
    assert.equal(accepted.entry?.accepted, true);
    assert.equal(hasTradePact(accepted.state, 'shu', 'france'), true);
    assert.ok(getRelationScore(accepted.state, 'shu', 'france') >= 12);

    // Duplicate trade pact quote is rejected cleanly
    const dupQuote = quoteEnvoyMission({
      state: accepted.state,
      playerFaction: 'shu',
      targetFaction: 'france',
      missionType: 'trade_pact',
      envoy: ENVOY_SHU,
      gold: 850,
    });
    assert.equal(dupQuote.valid, false);

    // Rejected mission with high roll decreases relation slightly without creating pact
    const rejected = executeEnvoyMission({
      state,
      factions: TEST_FACTIONS,
      playerFaction: 'shu',
      targetFaction: 'wei',
      missionType: 'trade_pact',
      envoy: ENVOY_SHU,
      gold: 1000,
      roll: 0.99,
    });
    assert.equal(rejected.ok, true);
    assert.equal(rejected.gold, 850);
    assert.equal(rejected.entry?.accepted, false);
    assert.equal(hasTradePact(rejected.state, 'shu', 'wei'), false);
    assert.equal(getRelationScore(rejected.state, 'shu', 'wei'), -60);
  });

  test('alliance mission gains synergy bonus from existing trade pact and forms alliance on acceptance', () => {
    const state = createInitialDiplomacyState(TEST_FACTIONS);
    const baseQuote = quoteEnvoyMission({
      state,
      playerFaction: 'shu',
      targetFaction: 'france',
      missionType: 'alliance',
      envoy: ENVOY_SHU,
      gold: 1500,
    });

    const withPact = executeEnvoyMission({
      state,
      factions: TEST_FACTIONS,
      playerFaction: 'shu',
      targetFaction: 'france',
      missionType: 'trade_pact',
      envoy: ENVOY_SHU,
      gold: 1500,
      roll: 0.05,
    });

    const boostedQuote = quoteEnvoyMission({
      state: withPact.state,
      playerFaction: 'shu',
      targetFaction: 'france',
      missionType: 'alliance',
      envoy: ENVOY_SHU,
      gold: 1350,
    });
    assert.ok(boostedQuote.successChance > baseQuote.successChance);

    const allied = executeEnvoyMission({
      state: withPact.state,
      factions: TEST_FACTIONS,
      playerFaction: 'shu',
      targetFaction: 'france',
      missionType: 'alliance',
      envoy: ENVOY_SHU,
      gold: 1350,
      roll: 0.01,
    });
    assert.equal(allied.ok, true);
    assert.equal(allied.gold, 1050);
    assert.equal(allied.entry?.accepted, true);
    assert.equal(hasAlliance(allied.state, 'shu', 'france'), true);
    assert.equal(getDiplomaticStanding(allied.state, 'shu', 'france').standing, 'allied');
  });

  test('rejects invalid factions, ronin, and insufficient gold without mutating state', () => {
    const state = createInitialDiplomacyState(TEST_FACTIONS);
    const sameFaction = executeEnvoyMission({
      state,
      factions: TEST_FACTIONS,
      playerFaction: 'shu',
      targetFaction: 'shu',
      missionType: 'gift',
      gold: 1000,
    });
    assert.equal(sameFaction.ok, false);
    assert.equal(sameFaction.gold, 1000);

    const roninTarget = executeEnvoyMission({
      state,
      factions: TEST_FACTIONS,
      playerFaction: 'shu',
      targetFaction: 'ronin',
      missionType: 'trade_pact',
      gold: 1000,
    });
    assert.equal(roninTarget.ok, false);

    const lowGold = executeEnvoyMission({
      state,
      factions: TEST_FACTIONS,
      playerFaction: 'shu',
      targetFaction: 'wei',
      missionType: 'alliance',
      gold: 100,
    });
    assert.equal(lowGold.ok, false);
    assert.equal(lowGold.gold, 100);
    assert.equal(lowGold.state.logs.length, 0);
  });

  test('cancelDiplomaticPact removes pact and applies relation penalty', () => {
    const state = createInitialDiplomacyState(TEST_FACTIONS);
    const before = getRelationScore(state, 'shu', 'wu');
    const next = cancelDiplomaticPact({
      state,
      factions: TEST_FACTIONS,
      playerFaction: 'shu',
      targetFaction: 'wu',
      pactType: 'alliance',
    });
    assert.equal(hasAlliance(next, 'shu', 'wu'), false);
    assert.equal(getRelationScore(next, 'shu', 'wu'), before - 25);
    assert.equal(next.logs.length, 1);
  });

  test('buildRelationChartData excludes player and ronin and sorts highest/allied factions first', () => {
    const state = createInitialDiplomacyState(TEST_FACTIONS);
    const data = buildRelationChartData(state, TEST_FACTIONS, 'shu');
    assert.equal(data.some(d => d.factionId === 'shu' || d.factionId === 'ronin'), false);
    assert.equal(data.length, 4);
    assert.equal(data[0].factionId, 'wu');
    assert.equal(data[0].hasAlliance, true);
    assert.equal(data[0].potentialAlly, true);
    assert.equal(data[data.length - 1].factionId, 'wei');
    assert.equal(data[data.length - 1].score, -55);
    assert.equal(data[data.length - 1].potentialAlly, false);
  });
});
