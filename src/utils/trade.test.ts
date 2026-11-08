import { describe, expect, test } from 'bun:test';
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
    expect(executeTrade(input)).toMatchObject({ ok: true, gold: 1388, sourceGrain: 1700, partnerGrain: 1500, quote: { fee: 27, total: 112 } });
  });
  test('sale transfers grain back and deducts freight from proceeds', () => {
    expect(executeTrade({ ...input, side: 'sell' })).toMatchObject({ ok: true, gold: 1558, sourceGrain: 700, partnerGrain: 2500 });
  });
  test('insufficient gold rejects purchase', () => {
    expect(executeTrade({ ...input, gold: 111 }).ok).toBe(false);
  });
  test('neither city can sell grain it does not have', () => {
    expect(executeTrade({ ...input, quantity: 2001 }).ok).toBe(false);
    expect(executeTrade({ ...input, quantity: 1201, side: 'sell' }).ok).toBe(false);
  });
  test('only player-owned sources and foreign partners can trade', () => {
    expect(executeTrade({ ...input, sourceOwner: 'wei' }).ok).toBe(false);
    expect(executeTrade({ ...input, partnerOwner: 'shu' }).ok).toBe(false);
    expect(executeTrade({ ...input, partner: input.source }).ok).toBe(false);
  });
  test('rejects invalid quantities without changing resources', () => {
    for (const quantity of [0, -1, 0.5, NaN, 10001]) expect(executeTrade({ ...input, quantity }).ok).toBe(false);
  });
  test('distant partners have higher freight costs', () => {
    const near = { ...input.partner, x: 65, y: 60 };
    expect(quoteTrade(input.source, near, input.partnerStores, 500, 'buy').fee).toBeLessThan(quoteTrade(input.source, input.partner, input.partnerStores, 500, 'buy').fee);
  });
});