import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import { getRating } from './rating';

describe('getRating', () => {
  test('grades S at 95 and above', () => {
    assert.equal(getRating(95).letter, 'S');
    assert.equal(getRating(99).letter, 'S');
    assert.equal(getRating(94).letter, 'A');
  });

  test('grades A from 85 to 94', () => {
    assert.equal(getRating(85).letter, 'A');
    assert.equal(getRating(84).letter, 'B');
  });

  test('grades B from 75 to 84', () => {
    assert.equal(getRating(75).letter, 'B');
    assert.equal(getRating(74).letter, 'C');
  });

  test('grades C from 60 to 74', () => {
    assert.equal(getRating(60).letter, 'C');
    assert.equal(getRating(59).letter, 'D');
  });

  test('grades D below 60', () => {
    assert.equal(getRating(0).letter, 'D');
  });

  test('returns non-empty colour classes for every grade', () => {
    for (const val of [99, 90, 80, 70, 10]) {
      assert.ok(getRating(val).color.length > 0);
    }
  });
});
