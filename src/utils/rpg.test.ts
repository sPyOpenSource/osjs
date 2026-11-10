import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import { createRpgCharacter, applyXp, xpForLevel } from './rpg';

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
});
