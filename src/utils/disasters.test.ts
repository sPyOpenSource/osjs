import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import {
  advanceDisasters,
  applyDisasterEvent,
  createInitialDisasterState,
  DisasterCityStores,
  DisasterCityTarget,
  getDisasterTradePolicy,
  getDisastersForScenario,
  HISTORICAL_DISASTERS,
  respondToDisaster,
} from './disasters';

const SAMPLE_CITIES: DisasterCityTarget[] = [
  { id: 'luoyang', name: '洛阳', theater: 'central' },
  { id: 'chengdu', name: '成都', theater: 'central' },
  { id: 'yamatai', name: '邪马台', theater: 'eastsea' },
  { id: 'rome', name: '罗马', theater: 'europe' },
  { id: 'samarqand', name: '撒马尔罕', theater: 'silkroad' },
];

const makeCityStats = (): Record<string, DisasterCityStores> => ({
  luoyang: { prosperity: 80, defense: 85, grain: 2000, population: 120000 },
  chengdu: { prosperity: 78, defense: 80, grain: 2000, population: 110000 },
  yamatai: { prosperity: 72, defense: 75, grain: 1600, population: 80000 },
  rome: { prosperity: 85, defense: 88, grain: 2400, population: 150000 },
  samarqand: { prosperity: 74, defense: 76, grain: 1800, population: 95000 },
});

describe('historical natural disasters engine', () => {
  test('includes COVID pandemic, tsunamis, earthquakes, floods, and droughts', () => {
    const categories = new Set(HISTORICAL_DISASTERS.map(d => d.category));
    assert.ok(categories.has('pandemic'));
    assert.ok(categories.has('tsunami'));
    assert.ok(categories.has('earthquake'));
    assert.ok(categories.has('flood'));
    assert.ok(categories.has('drought'));

    const modernIds = getDisastersForScenario(2026).map(d => d.id);
    assert.ok(modernIds.includes('covid_19_pandemic'));
    assert.ok(modernIds.includes('pacific_indian_tsunami'));
    assert.ok(modernIds.includes('eurasian_mega_earthquake'));

    const ancientIds = getDisastersForScenario(208).map(d => d.id);
    assert.ok(ancientIds.includes('jianan_great_plague'));
    assert.ok(ancientIds.includes('pacific_indian_tsunami'));
    assert.ok(ancientIds.includes('eurasian_mega_earthquake'));
  });

  test('advanceDisasters triggers dated historical events once across clock skips', () => {
    const initial = createInitialDisasterState();
    const stats = makeCityStats();

    // Jump straight to month 6 xun 1 in 2026 scenario -> triggers COVID (m2x1), Tsunami (m4x2), Earthquake (m6x1)
    const skipped = advanceDisasters({
      state: initial,
      scenarioYear: 2026,
      year: 2026,
      month: 6,
      xun: 1,
      cities: SAMPLE_CITIES,
      cityStats: stats,
    });

    const ids = skipped.newlyTriggered.map(e => e.id);
    assert.ok(ids.includes('covid_19_pandemic'));
    assert.ok(ids.includes('pacific_indian_tsunami'));
    assert.ok(ids.includes('eurasian_mega_earthquake'));
    assert.ok(skipped.cityStats.luoyang.defense < stats.luoyang.defense);
    assert.ok(skipped.cityStats.yamatai.grain < stats.yamatai.grain);

    // Advancing again on same or next xun does not double-apply those events
    const secondPass = advanceDisasters({
      state: skipped.state,
      scenarioYear: 2026,
      year: 2026,
      month: 6,
      xun: 2,
      cities: SAMPLE_CITIES,
      cityStats: skipped.cityStats,
    });
    assert.equal(secondPass.newlyTriggered.length, 0);
    assert.equal(secondPass.state.occurred.length, skipped.state.occurred.length);
  });

  test('manual disaster trigger applies effects once and increases active trade freight multiplier', () => {
    const tsunami = HISTORICAL_DISASTERS.find(d => d.id === 'pacific_indian_tsunami')!;
    const stats = makeCityStats();
    const res = applyDisasterEvent({
      state: createInitialDisasterState(),
      event: tsunami,
      cities: SAMPLE_CITIES,
      cityStats: stats,
      tick: 3,
      timestampLabel: '2026年 2月 上旬',
    });

    assert.equal(res.applied, true);
    assert.equal(res.weatherOverride, 'heavy_rain');
    assert.ok(res.cityStats.yamatai.defense < stats.yamatai.defense);
    assert.ok(res.cityStats.rome.grain < stats.rome.grain);

    const policy = getDisasterTradePolicy(res.state, 4);
    assert.equal(policy.freightMultiplier, tsunami.tradeFreightMultiplier);
    assert.equal(policy.activeLabels.length, 1);

    // Duplicate manual trigger for same event is prevented
    const dup = applyDisasterEvent({
      state: res.state,
      event: tsunami,
      cities: SAMPLE_CITIES,
      cityStats: res.cityStats,
      tick: 4,
      timestampLabel: '2026年 2月 中旬',
    });
    assert.equal(dup.applied, false);
  });

  test('respondToDisaster deducts gold, recovers affected cities, and mitigates trade freight penalty', () => {
    const covid = HISTORICAL_DISASTERS.find(d => d.id === 'covid_19_pandemic')!;
    const stats = makeCityStats();
    const triggered = applyDisasterEvent({
      state: createInitialDisasterState(),
      event: covid,
      cities: SAMPLE_CITIES,
      cityStats: stats,
      tick: 3,
      timestampLabel: '2026年 2月 上旬',
    });

    const lowGold = respondToDisaster({
      state: triggered.state,
      eventId: covid.id,
      choiceId: 'vaccine_relief',
      cityStats: triggered.cityStats,
      gold: 50,
      timestampLabel: '2026年 2月 中旬',
    });
    assert.equal(lowGold.ok, false);
    assert.equal(lowGold.gold, 50);

    const resolved = respondToDisaster({
      state: triggered.state,
      eventId: covid.id,
      choiceId: 'vaccine_relief',
      cityStats: triggered.cityStats,
      gold: 1000,
      timestampLabel: '2026年 2月 中旬',
    });
    assert.equal(resolved.ok, true);
    assert.equal(resolved.gold, 700);
    assert.equal(resolved.diplomacyBoost, 6);
    assert.ok(resolved.cityStats.luoyang.prosperity > triggered.cityStats.luoyang.prosperity);

    const mitigatedPolicy = getDisasterTradePolicy(resolved.state, 4);
    assert.equal(mitigatedPolicy.freightMultiplier, 1.15);
  });
});
