import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import { createRpgCharacter, applyXp, xpForLevel, MAX_LEVEL, validateEquipAssignment } from './rpg';
import type { Equipment } from '../types';

describe('rpg progression', () => {
  test('creates level 1 character with zero xp', () => {
    const c = createRpgCharacter('liubei');
    assert.equal(c.level, 1);
    assert.equal(c.xp, 0);
    assert.equal(c.skillPoints, 0);
    assert.deepEqual(c.learnedSkills, []);
    assert.deepEqual(c.equipment, {});
  });

  test('xpForLevel is positive and grows with level', () => {
    assert.ok(xpForLevel(2) > 0);
    assert.ok(xpForLevel(3) > xpForLevel(2));
  });

  test('levels up when xp threshold reached', () => {
    const c = createRpgCharacter('liubei');
    const next = applyXp(c, xpForLevel(2));
    assert.equal(next.level, 2);
    assert.equal(next.skillPoints, 1);
    assert.equal(next.xp, 0);
  });

  test('carries leftover xp into the next level', () => {
    const c = createRpgCharacter('liubei');
    const next = applyXp(c, xpForLevel(2) + 25);
    assert.equal(next.level, 2);
    assert.equal(next.xp, 25);
  });

  test('ignores non-finite and unsafe amounts', () => {
    const c = createRpgCharacter('liubei');
    const rejected = [Infinity, -Infinity, NaN, Number.MAX_SAFE_INTEGER + 1, 1.5];
    for (const amount of rejected) {
      assert.equal(applyXp(c, amount), c, `amount ${amount} should be a no-op`);
    }
    assert.equal(c.level, 1);
    assert.equal(c.xp, 0);
    assert.equal(c.skillPoints, 0);
  });

  test('huge but valid amounts finish fast and cap at MAX_LEVEL', () => {
    const c = createRpgCharacter('liubei');
    const next = applyXp(c, Number.MAX_SAFE_INTEGER);
    assert.equal(next.level, MAX_LEVEL);
    assert.equal(next.skillPoints, MAX_LEVEL - 1);
    assert.ok(Number.isSafeInteger(next.xp));
    assert.equal(next.xp, xpForLevel(MAX_LEVEL), 'xp is clamped to a full bar at max level');
  });

  test('repeated huge amounts cannot push xp out of safe-integer range', () => {
    let c = createRpgCharacter('liubei');
    c = applyXp(c, Number.MAX_SAFE_INTEGER);
    c = applyXp(c, Number.MAX_SAFE_INTEGER);
    assert.equal(c.level, MAX_LEVEL);
    assert.ok(Number.isSafeInteger(c.xp));
    assert.equal(c.xp, xpForLevel(MAX_LEVEL));
  });

  test('xpForLevel floors invalid levels at 1', () => {
    assert.equal(xpForLevel(0), xpForLevel(1));
    assert.equal(xpForLevel(-3), xpForLevel(1));
  });

  test('one xp short of the threshold does not level up', () => {
    const c = createRpgCharacter('liubei');
    const next = applyXp(c, xpForLevel(2) - 1);
    assert.equal(next.level, 1);
    assert.equal(next.xp, xpForLevel(2) - 1);
    assert.equal(next.skillPoints, 0);
  });

  test('preserves non-xp fields', () => {
    const c = { ...createRpgCharacter('liubei'), learnedSkills: ['a'], equipment: {} };
    const next = applyXp(c, xpForLevel(2));
    assert.deepEqual(next.learnedSkills, ['a']);
    assert.deepEqual(next.equipment, {});
    assert.equal(next.officerId, 'liubei');
  });

  test('ignores zero and negative amounts', () => {
    const c = createRpgCharacter('liubei');
    assert.equal(applyXp(c, 0), c);
    assert.equal(applyXp(c, -5), c);
    assert.equal(c.level, 1);
    assert.equal(c.xp, 0);
  });

  test('crossing two levels in one call grants two skill points', () => {
    const c = createRpgCharacter('liubei');
    const next = applyXp(c, xpForLevel(2) + xpForLevel(3));
    assert.equal(next.level, 3);
    assert.equal(next.skillPoints, 2);
    assert.equal(next.xp, 0);
  });

  test('does not mutate the input character', () => {
    const c = createRpgCharacter('liubei');
    const snapshot = structuredClone(c);
    applyXp(c, xpForLevel(2) + 10);
    assert.deepEqual(c, snapshot);
    assert.equal(c.level, 1);
    assert.equal(c.xp, 0);
    assert.equal(c.skillPoints, 0);
  });

  test('validateEquipAssignment accepts matching slot', () => {
    const weapon: Equipment = { id: 'w1', name: '青龙刀', slot: 'weapon', statBonuses: {}, skillBonuses: [] };
    const armor: Equipment = { id: 'a1', name: '铠甲', slot: 'armor', statBonuses: {}, skillBonuses: [] };
    assert.equal(validateEquipAssignment('weapon', weapon), true);
    assert.equal(validateEquipAssignment('armor', armor), true);
  });

  test('validateEquipAssignment rejects mismatched slot', () => {
    const weapon: Equipment = { id: 'w1', name: '青龙刀', slot: 'weapon', statBonuses: {}, skillBonuses: [] };
    assert.equal(validateEquipAssignment('armor', weapon), false);
    assert.equal(validateEquipAssignment('accessory', weapon), false);
    assert.equal(
      validateEquipAssignment('weapon', { id: 'a1', name: '铠甲', slot: 'armor' as const, statBonuses: {}, skillBonuses: [] }),
      false
    );
  });
});
