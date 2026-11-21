import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import {
  activeEvents,
  advanceWorld,
  campaignTick,
  createWorldState,
  EVENTS_2026,
  pairKey,
  respondToEvent,
  worldTradePolicy,
} from './geopolitics';

const MODERN_FACTIONS = [
  { id: 'america' },
  { id: 'europe' },
  { id: 'france' },
  { id: 'germany' },
  { id: 'netherlands' },
  { id: 'russia' },
  { id: 'shu' },
];

describe('2026 geopolitical world situation engine', () => {
  test('initializes realistic 2026 baseline stability and bilateral relations', () => {
    const state = createWorldState(MODERN_FACTIONS);
    assert.equal(state.stability.america, 68);
    assert.equal(state.stability.europe, 64);
    assert.equal(state.stability.netherlands, 73);
    assert.equal(state.stability.russia, 59);
    assert.equal(state.relations[pairKey('france', 'germany')], 45);
    assert.equal(state.relations[pairKey('russia', 'europe')], -45);
    assert.equal(state.relations[pairKey('america', 'russia')], -40);
  });

  test('applies dated 2026 events once across clock skips and blocks re-application', () => {
    const initial = createWorldState(MODERN_FACTIONS);
    // Skip straight to Month 3 Xun 1 (tick 6) -> triggers tariffs (m1), ai_chips (m2), energy (m3)
    const tick = campaignTick(2026, 3, 1);
    const advanced = advanceWorld(initial, 2026, tick);
    assert.deepEqual(advanced.occurred, ['tariffs', 'ai_chips', 'energy']);

    const sameTickAgain = advanceWorld(advanced, 2026, tick);
    assert.deepEqual(sameTickAgain.occurred, ['tariffs', 'ai_chips', 'energy']);
    assert.deepEqual(sameTickAgain.stability, advanced.stability);
    assert.deepEqual(sameTickAgain.relations, advanced.relations);

    // Non-2026 scenarios do not fire 2026 events
    const ancient = advanceWorld(initial, 208, tick);
    assert.equal(ancient.occurred.length, 0);
  });

  test('enforces Russia-Europe embargo during active energy crisis and reflects response choices once', () => {
    const initial = createWorldState(MODERN_FACTIONS);
    const tick = campaignTick(2026, 3, 1);
    const afterEnergy = advanceWorld(initial, 2026, tick);

    const ruEuPolicy = worldTradePolicy(afterEnergy, 'russia', 'europe', tick);
    assert.equal(ruEuPolicy.blocked, true);

    const active = activeEvents(afterEnergy, tick);
    assert.ok(active.some(e => e.id === 'energy'));

    const beforeRel = afterEnergy.relations[pairKey('russia', 'europe')];
    const responded = respondToEvent(afterEnergy, 'energy', 0);
    assert.equal(responded.responses.energy, 0);
    assert.equal(responded.relations[pairKey('russia', 'europe')], beforeRel + 18);

    // Second response to same event is ignored
    const duplicate = respondToEvent(responded, 'energy', 1);
    assert.equal(duplicate.responses.energy, 0);
    assert.equal(duplicate.relations[pairKey('russia', 'europe')], beforeRel + 18);
  });

  test('includes comprehensive 2026 trade, tech, energy, port, climate, security, finance, and summit events', () => {
    const ids = EVENTS_2026.map(e => e.id);
    assert.ok(ids.includes('tariffs'));
    assert.ok(ids.includes('ai_chips'));
    assert.ok(ids.includes('energy'));
    assert.ok(ids.includes('ports'));
    assert.ok(ids.includes('food'));
    assert.ok(ids.includes('security'));
    assert.ok(ids.includes('debt_crisis'));
    assert.ok(ids.includes('summit'));
  });
});
