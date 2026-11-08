import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import { executeTrade, quoteTrade } from './trade';

const input = {
  source: { id: 'chengdu', name: '成都', x: 64, y: 60 },
  partner: { id: 'rome', name: '罗马', x: 14, y: 44 },
  sourceOwner: 'shu', partnerOwner: 'rome', playerFaction: 'shu',
  sourceStores: { grain: 1200, prosperity: 70 },
  partnerStores: { grain: 2000, prosperity: 80 },
  gold: 1500, quantity: 500, side: 'buy' as const,
};

describe('global grain trade', () => {
  test('purchase transfers grain and charges goods plus freight', () => {
    const result = executeTrade(input);
    assert.ok(result.ok);
    assert.equal(result.gold, 1388);
    assert.equal(result.sourceGrain, 1700);
    assert.equal(result.partnerGrain, 1500);
    assert.equal(result.quote.fee, 27);
    assert.equal(result.quote.total, 112);
  });
  test('sale transfers grain back and deducts freight from proceeds', () => {
    const result = executeTrade({ ...input, side: 'sell' });
    assert.ok(result.ok);
    assert.equal(result.gold, 1558);
    assert.equal(result.sourceGrain, 700);
    assert.equal(result.partnerGrain, 2500);
  });
  test('insufficient gold rejects purchase', () => {
    assert.equal(executeTrade({ ...input, gold: 111 }).ok, false);
  });
  test('neither city can sell grain it does not have', () => {
    assert.equal(executeTrade({ ...input, quantity: 2001 }).ok, false);
    assert.equal(executeTrade({ ...input, quantity: 1201, side: 'sell' }).ok, false);
  });
  test('only player-owned sources and foreign partners can trade', () => {
    assert.equal(executeTrade({ ...input, sourceOwner: 'wei' }).ok, false);
    assert.equal(executeTrade({ ...input, partnerOwner: 'shu' }).ok, false);
    assert.equal(executeTrade({ ...input, partner: input.source }).ok, false);
  });
  test('rejects invalid quantities without changing resources', () => {
    for (const quantity of [0, -1, 0.5, NaN, 10001]) assert.equal(executeTrade({ ...input, quantity }).ok, false);
  });
  test('distant partners have higher freight costs', () => {
    const near = { ...input.partner, x: 65, y: 60 };
    assert.ok(quoteTrade(input.source, near, input.partnerStores, 500, 'buy').fee < quoteTrade(input.source, input.partner, input.partnerStores, 500, 'buy').fee);
  });
});