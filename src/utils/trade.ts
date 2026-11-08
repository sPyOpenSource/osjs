export interface TradeCity {
  id: string;
  name: string;
  x: number;
  y: number;
}

export interface TradeStores {
  grain: number;
  prosperity: number;
}

export function quoteTrade(source: TradeCity, partner: TradeCity, market: TradeStores, quantity: number, side: 'buy' | 'sell') {
  const unitPrice = Math.max(0.12, Math.round((0.25 - market.prosperity / 1000) * 100) / 100);
  const fee = Math.ceil(Math.hypot(source.x - partner.x, source.y - partner.y) * quantity / 1000);
  const goodsValue = Math.ceil(quantity * unitPrice);
  return { unitPrice, fee, total: side === 'buy' ? goodsValue + fee : Math.max(0, goodsValue - fee) };
}

export function executeTrade(input: {
  source: TradeCity; partner: TradeCity; sourceOwner: string; partnerOwner: string;
  playerFaction: string; sourceStores: TradeStores; partnerStores: TradeStores;
  gold: number; quantity: number; side: 'buy' | 'sell';
}) {
  const { source, partner, sourceStores, partnerStores, quantity, side, gold } = input;
  if (source.id === partner.id || input.sourceOwner !== input.playerFaction || input.partnerOwner === input.playerFaction) {
    return { ok: false as const, error: '通商城池归属已变，请重新选择。' };
  }
  if (!Number.isSafeInteger(quantity) || quantity <= 0 || quantity > 10000) {
    return { ok: false as const, error: '交易数量须为 1–10,000 石的整数。' };
  }
  const quote = quoteTrade(source, partner, partnerStores, quantity, side);
  if (side === 'buy' && gold < quote.total) return { ok: false as const, error: '黄金不足，无法购入。' };
  if ((side === 'buy' ? partnerStores.grain : sourceStores.grain) < quantity) {
    return { ok: false as const, error: side === 'buy' ? '商埠余粮不足。' : '本城余粮不足。' };
  }
  const delta = side === 'buy' ? quantity : -quantity;
  return {
    ok: true as const,
    gold: gold + (side === 'buy' ? -quote.total : quote.total),
    sourceGrain: sourceStores.grain + delta,
    partnerGrain: partnerStores.grain - delta,
    quote,
  };
}