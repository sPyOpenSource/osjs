export function createCountryDebts(countries: { id: string }[]): Record<string, number> {
  return Object.fromEntries(countries.map(country => [country.id, 0]));
}

export function changeCountryDebt(debts: Record<string, number>, countryId: string, gold: number, amount: number, action: 'borrow' | 'repay') {
  const debt = debts[countryId];
  if (debt === undefined) return { ok: false as const, error: '未找到该国债务账簿。' };
  if (!Number.isSafeInteger(amount) || amount <= 0) return { ok: false as const, error: '金额须为正整数。' };
  if (action === 'repay' && amount > debt) return { ok: false as const, error: '还款金额超过未偿债务。' };
  if (action === 'repay' && amount > gold) return { ok: false as const, error: '黄金不足，无法偿还。' };
  const nextDebt = debt + (action === 'borrow' ? amount : -amount);
  const nextGold = gold + (action === 'borrow' ? amount : -amount);
  if (!Number.isSafeInteger(nextDebt) || !Number.isSafeInteger(nextGold)) return { ok: false as const, error: '金额过大。' };
  return { ok: true as const, debts: { ...debts, [countryId]: nextDebt }, gold: nextGold };
}