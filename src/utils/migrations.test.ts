import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import {
  advanceMigrations,
  computeCityLivability,
  createInitialMigrationState,
  executeResettlement,
  MigrationCityRef,
  MigrationCityStats,
  quoteResettlement,
  triggerWarRefugeeWave,
} from './migrations';
import { Officer } from '../types';

const TEST_CITIES: MigrationCityRef[] = [
  { id: 'luoyang', name: '洛阳', x: 71, y: 43, region: '司隶', theater: 'central' },
  { id: 'xuchang', name: '许昌', x: 74, y: 47, region: '中原', theater: 'central' },
  { id: 'chengdu', name: '成都', x: 64, y: 60, region: '巴蜀', theater: 'central' },
  { id: 'jianye', name: '建业', x: 80, y: 52, region: '江东', theater: 'central' },
];

const TEST_OWNERSHIP: Record<string, string> = {
  luoyang: 'wei',
  xuchang: 'wei',
  chengdu: 'shu',
  jianye: 'wu',
};

function makeOfficer(id: string, factionId: string, traits: string[] = []): Officer {
  return {
    id,
    name: id,
    gender: 'Male',
    factionId,
    avatarStyle: {
      hairColor: '#000',
      hairStyle: 'short',
      armorColor: '#000',
      accessory: 'none',
      expression: 'calm',
      bgGradient: 'none',
    },
    stats: { leadership: 80, force: 75, intelligence: 80, politics: 80, charisma: 85 },
    traits,
    skills: [],
    biography: '',
  };
}

function makeStats(): Record<string, MigrationCityStats> {
  return {
    luoyang: { prosperity: 55, defense: 60, grain: 900, population: 120000 },
    xuchang: { prosperity: 75, defense: 75, grain: 2400, population: 100000 },
    chengdu: { prosperity: 88, defense: 85, grain: 3000, population: 130000 },
    jianye: { prosperity: 80, defense: 82, grain: 2600, population: 110000 },
  };
}

describe('People Migrations Engine', () => {
  test('computeCityLivability rewards prosperity, benevolent traits, and penalizes disasters', () => {
    const officers = [makeOfficer('liubei', 'shu', ['仁德', '宽仁'])];
    const stats = makeStats();
    const calmScore = computeCityLivability({
      cityId: 'chengdu',
      stats: stats.chengdu,
      isDisasterAffected: false,
      ownerFactionId: 'shu',
      officers,
    });
    const disasterScore = computeCityLivability({
      cityId: 'chengdu',
      stats: stats.chengdu,
      isDisasterAffected: true,
      ownerFactionId: 'shu',
      officers,
    });
    assert.ok(calmScore > disasterScore + 20);
  });

  test('advanceMigrations triggers disaster exodus and guarantees tick idempotency', () => {
    const initial = createInitialMigrationState();
    const stats = makeStats();
    const first = advanceMigrations({
      state: initial,
      cities: TEST_CITIES,
      cityStats: stats,
      cityOwnership: TEST_OWNERSHIP,
      activeDisasterCityIds: new Set(['luoyang']),
      officers: [],
      currentTick: 1,
      timestampLabel: '208年 1月 中旬',
    });

    assert.equal(first.newWaves.length, 1);
    assert.equal(first.newWaves[0].cause, 'disaster_exodus');
    assert.equal(first.newWaves[0].fromCityId, 'luoyang');
    assert.ok(first.newWaves[0].toCityId !== 'luoyang');
    assert.ok(first.cityStats.luoyang.population < stats.luoyang.population);
    const destId = first.newWaves[0].toCityId;
    assert.equal(
      first.cityStats[destId].population - stats[destId].population,
      first.newWaves[0].count,
    );

    // Repeating same tick produces zero duplicate transfers
    const second = advanceMigrations({
      state: first.state,
      cities: TEST_CITIES,
      cityStats: first.cityStats,
      cityOwnership: TEST_OWNERSHIP,
      activeDisasterCityIds: new Set(['luoyang']),
      officers: [],
      currentTick: 1,
      timestampLabel: '208年 1月 中旬',
    });
    assert.equal(second.newWaves.length, 0);
    assert.equal(second.cityStats.luoyang.population, first.cityStats.luoyang.population);
  });

  test('advanceMigrations drives prosperity pull on even ticks when livability gap is large', () => {
    const stats = makeStats();
    stats.luoyang = { prosperity: 35, defense: 45, grain: 500, population: 110000 };
    stats.chengdu = { prosperity: 95, defense: 90, grain: 3200, population: 120000 };

    const res = advanceMigrations({
      state: createInitialMigrationState(),
      cities: TEST_CITIES,
      cityStats: stats,
      cityOwnership: TEST_OWNERSHIP,
      activeDisasterCityIds: new Set(),
      officers: [makeOfficer('liubei', 'shu', ['仁德'])],
      currentTick: 2,
      timestampLabel: '208年 1月 下旬',
    });

    assert.equal(res.newWaves.length, 1);
    assert.equal(res.newWaves[0].cause, 'prosperity_pull');
    assert.equal(res.newWaves[0].fromCityId, 'luoyang');
    assert.equal(res.newWaves[0].toCityId, 'chengdu');
  });

  test('triggerWarRefugeeWave evacuates civilians from besieged city to safest neighbor', () => {
    const stats = makeStats();
    const res = triggerWarRefugeeWave({
      state: createInitialMigrationState(),
      fromCityId: 'luoyang',
      cities: TEST_CITIES,
      cityStats: stats,
      cityOwnership: TEST_OWNERSHIP,
      activeDisasterCityIds: new Set(),
      officers: [],
      currentTick: 3,
      timestampLabel: '208年 2月 上旬',
    });

    assert.ok(res.wave);
    assert.equal(res.wave.cause, 'refugee_flee');
    assert.equal(res.wave.fromCityId, 'luoyang');
    assert.ok(res.cityStats.luoyang.population < stats.luoyang.population);
    assert.equal(res.state.totalMigrated, res.wave.count);
  });

  test('quoteResettlement & executeResettlement enforce costs, sovereignty, and match exact deltas', () => {
    const stats = makeStats();
    const quote = quoteResettlement({
      fromCityId: 'chengdu',
      toCityId: 'xuchang',
      amount: 5000,
      cities: TEST_CITIES,
      cityStats: stats,
      cityOwnership: TEST_OWNERSHIP,
      playerFactionId: 'shu',
      gold: 1500,
    });
    assert.equal(quote.ok, true);
    assert.equal(quote.grainSourceCityId, 'chengdu');

    const exec = executeResettlement({
      state: createInitialMigrationState(),
      fromCityId: 'chengdu',
      toCityId: 'xuchang',
      amount: 5000,
      cities: TEST_CITIES,
      cityStats: stats,
      cityOwnership: TEST_OWNERSHIP,
      playerFactionId: 'shu',
      gold: 1500,
      currentTick: 4,
      timestampLabel: '208年 2月 中旬',
    });

    assert.equal(exec.ok, true);
    assert.equal(exec.gold, 1500 - quote.goldCost);
    assert.equal(exec.cityStats.chengdu.population, stats.chengdu.population - 5000);
    assert.equal(exec.cityStats.xuchang.population, stats.xuchang.population + 5000);
    assert.equal(exec.cityStats.chengdu.grain, stats.chengdu.grain - quote.grainCost);
    assert.equal(exec.state.waves[0].cause, 'imperial_resettlement');

    // Reject resettlement when player faction controls neither origin nor destination
    const unauthorized = quoteResettlement({
      fromCityId: 'luoyang',
      toCityId: 'jianye',
      amount: 2000,
      cities: TEST_CITIES,
      cityStats: stats,
      cityOwnership: TEST_OWNERSHIP,
      playerFactionId: 'shu',
      gold: 1500,
    });
    assert.equal(unauthorized.ok, false);
    assert.ok(unauthorized.error?.includes('须至少掌握'));

    // Reject resettlement when gold is insufficient
    const poor = quoteResettlement({
      fromCityId: 'chengdu',
      toCityId: 'xuchang',
      amount: 10000,
      cities: TEST_CITIES,
      cityStats: stats,
      cityOwnership: TEST_OWNERSHIP,
      playerFactionId: 'shu',
      gold: 5,
    });
    assert.equal(poor.ok, false);
    assert.ok(poor.error?.includes('库银不足'));
  });
});
