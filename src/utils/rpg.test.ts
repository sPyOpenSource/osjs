import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import { createRpgCharacter, applyXp, xpForLevel, MAX_LEVEL } from './rpg';

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
    const startedAt = Date.now();
    const next = applyXp(c, Number.MAX_SAFE_INTEGER);
    assert.ok(Date.now() - startedAt < 100, 'level up loop must not hang');
    assert.equal(next.level, MAX_LEVEL);
    assert.equal(next.skillPoints, MAX_LEVEL - 1);
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
});
