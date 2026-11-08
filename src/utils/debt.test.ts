import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createCountryDebts, changeCountryDebt } from './debt';
import { FACTIONS } from '../data';

describe('country debt', () => {
  it('gives every country its own zero opening debt', () => {
    const debts = createCountryDebts(FACTIONS);
    assert.equal(Object.keys(debts).length, FACTIONS.length);
    for (const country of FACTIONS) assert.equal(debts[country.id], 0);
  });
  it('borrowing adds equal gold and debt only to the selected country', () => {
    const result = changeCountryDebt({ shu: 0, rome: 200 }, 'shu', 1500, 500, 'borrow');
    assert.ok(result.ok);
    assert.equal(result.gold, 2000);
    assert.deepEqual(result.debts, { shu: 500, rome: 200 });
  });
  it('repayment deducts equal gold and debt without changing other countries', () => {
    const result = changeCountryDebt({ shu: 500, rome: 200 }, 'shu', 2000, 300, 'repay');
    assert.ok(result.ok);
    assert.equal(result.gold, 1700);
    assert.deepEqual(result.debts, { shu: 200, rome: 200 });
  });
  it('cannot repay more than owed or more than available gold', () => {
    assert.equal(changeCountryDebt({ shu: 500 }, 'shu', 1500, 501, 'repay').ok, false);
    assert.equal(changeCountryDebt({ shu: 500 }, 'shu', 200, 300, 'repay').ok, false);
  });
  it('rejects unknown countries and invalid amounts', () => {
    assert.equal(changeCountryDebt({ shu: 0 }, 'rome', 1500, 500, 'borrow').ok, false);
    for (const amount of [0, -1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER]) {
      assert.equal(changeCountryDebt({ shu: 0 }, 'shu', 1500, amount, 'borrow').ok, false);
    }
  });
});