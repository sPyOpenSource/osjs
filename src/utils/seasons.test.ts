import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import {
  applySeasonalOfficerModifiers,
  getOfficerSeasonalStatDeltas,
  getSeasonFromMonth,
  getSeasonalTacticalPreview,
  getSeasonalWeatherForTick,
  SEASONS,
} from './seasons';
import { Officer } from '../types';

const sampleOfficer: Officer = {
  id: 'guanyu',
  name: '关羽',
  gender: 'Male',
  factionId: 'shu',
  avatarStyle: {
    hairColor: '#000',
    hairStyle: 'short',
    armorColor: '#10b981',
    accessory: 'none',
    expression: 'calm',
    bgGradient: 'none',
  },
  stats: {
    leadership: 94,
    force: 98,
    intelligence: 78,
    politics: 64,
    charisma: 92,
  },
  traits: [],
  skills: [],
  biography: '',
};

describe('seasonal weather system', () => {
  test('maps calendar months 1..12 to Spring, Summer, Autumn, Winter', () => {
    for (const m of [3, 4, 5]) assert.equal(getSeasonFromMonth(m).id, 'spring');
    for (const m of [6, 7, 8]) assert.equal(getSeasonFromMonth(m).id, 'summer');
    for (const m of [9, 10, 11]) assert.equal(getSeasonFromMonth(m).id, 'autumn');
    for (const m of [12, 1, 2]) assert.equal(getSeasonFromMonth(m).id, 'winter');
  });

  test('selects weather from each season climate pool as ticks advance', () => {
    const winterSeen = new Set<string>();
    const summerSeen = new Set<string>();
    for (let xun = 1; xun <= 3; xun++) {
      for (let month of [12, 1, 2]) {
        const w = getSeasonalWeatherForTick('winter', 208, month, xun);
        winterSeen.add(w);
        assert.ok(SEASONS.winter.weatherWeights.includes(w));
      }
      for (let month of [6, 7, 8]) {
        const w = getSeasonalWeatherForTick('summer', 208, month, xun);
        summerSeen.add(w);
        assert.ok(SEASONS.summer.weatherWeights.includes(w));
      }
    }
    assert.ok(winterSeen.has('snow'));
    assert.ok(winterSeen.size > 1, 'winter weather should vary across ticks');
    assert.ok(summerSeen.size > 1, 'summer weather should vary across ticks');
  });

  test('applies seasonal stat modifiers to officers without mutating base stats and clamps to [1, 100]', () => {
    const summerOff = applySeasonalOfficerModifiers(sampleOfficer, 'summer');
    // base force 98 + 5 clamps cleanly to 100; leadership 94 - 2 = 92; intelligence 78 + 3 = 81
    assert.equal(summerOff.stats.force, 100);
    assert.equal(summerOff.statDeltas.force, 2);
    assert.equal(summerOff.stats.leadership, 92);
    assert.equal(summerOff.stats.intelligence, 81);
    assert.equal(sampleOfficer.stats.force, 98, 'original officer must remain untouched');

    const winterOff = applySeasonalOfficerModifiers(sampleOfficer, 'winter');
    assert.equal(winterOff.stats.force, 94);
    assert.equal(winterOff.stats.leadership, 98);
    assert.equal(winterOff.stats.politics, 61);
  });

  test('returns distinct tactical modifiers per season', () => {
    const springTac = getSeasonalTacticalPreview('spring', 1.0);
    const autumnTac = getSeasonalTacticalPreview('autumn', 1.0);
    const winterTac = getSeasonalTacticalPreview('winter', 0.4);

    assert.ok(autumnTac.cavalryMultiplier > 1);
    assert.ok(autumnTac.combinedMovementRatio > 1);
    assert.ok(springTac.agricultureYieldMultiplier > 1);
    assert.ok(winterTac.defenseBonus > 0 && winterTac.siegeBonus < 0);
    assert.ok(winterTac.combinedMovementRatio < 0.4);
    assert.equal(getOfficerSeasonalStatDeltas('autumn').leadership, 5);
  });
});
