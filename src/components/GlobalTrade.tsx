import React, { useState } from 'react';
import { ArrowLeftRight, Coins, Globe, Wheat } from 'lucide-react';
import { Faction } from '../types';
import { TradeCity, TradeStores, quoteTrade } from '../utils/trade';
import Button from './Button';
import CountryDebt from './CountryDebt';

interface Props {
  cities: TradeCity[];
  ownership: Record<string, string>;
  stores: Record<string, TradeStores>;
  factions: Faction[];
  playerFaction: string;
  gold: number;
  logs: string[];
  debts: Record<string, number>;
  onChangeDebt: (amount: number, action: 'borrow' | 'repay') => string | undefined;
  onTrade: (sourceId: string, partnerId: string, quantity: number, side: 'buy' | 'sell') => string | undefined;
}

export default function GlobalTrade({ cities, ownership, stores, factions, playerFaction, gold, logs, onTrade, debts, onChangeDebt }: Props) {
  const homeCities = cities.filter(city => ownership[city.id] === playerFaction);
  const partners = cities.filter(city => ownership[city.id] !== playerFaction);
  const [sourceId, setSourceId] = useState(homeCities[0]?.id || '');
  const [partnerId, setPartnerId] = useState(partners[0]?.id || '');
  const [quantity, setQuantity] = useState(500);
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [error, setError] = useState('');
  const source = homeCities.find(city => city.id === sourceId) || homeCities[0];
  const partner = partners.find(city => city.id === partnerId) || partners[0];
  const sourceStores = source ? stores[source.id] : undefined;
  const partnerStores = partner ? stores[partner.id] : undefined;
  const validQuantity = Number.isSafeInteger(quantity) && quantity > 0 && quantity <= 10000;
  const quote = source && partner && partnerStores && validQuantity ? quoteTrade(source, partner, partnerStores, quantity, side) : undefined;
  const unavailable = !source || !partner || !quote || !sourceStores || !partnerStores
    || (side === 'buy' ? gold < quote.total || partnerStores.grain < quantity : sourceStores.grain < quantity);
  const factionName = (id: string) => factions.find(f => f.id === id)?.name || '在野';

  return <section className="global-trade" aria-label="全球贸易">
    <header className="trade-heading">
      <div><h2><Globe size={22} /> 全球贸易</h2><span className="trade-muted">{factionName(playerFaction)}</span></div>
      <strong className="trade-gold"><Coins size={18} /> <span data-testid="trade-gold">{gold.toLocaleString()}</span> 金</strong>
    </header>
    <CountryDebt factions={factions} debts={debts} playerFaction={playerFaction} gold={gold} onChangeDebt={onChangeDebt} />
    <div className="trade-layout">
      <form className="trade-order" onSubmit={event => {
        event.preventDefault();
        if (!source || !partner) return;
        setError(onTrade(source.id, partner.id, quantity, side) || '');
      }}>
        <h3><Wheat size={18} /> 粮草通商</h3>
        <label>本方城池<select aria-label="本方城池" value={source?.id || ''} onChange={event => { setSourceId(event.target.value); setError(''); }}>
          {homeCities.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
        </select></label>
        <label>海外商埠<select aria-label="海外商埠" value={partner?.id || ''} onChange={event => { setPartnerId(event.target.value); setError(''); }}>
          {partners.map(city => <option key={city.id} value={city.id}>{city.name} · {factionName(ownership[city.id])}</option>)}
        </select></label>
        <div className="trade-segment" aria-label="交易方向">
          <Button aria-pressed={side === 'buy'} onClick={() => { setSide('buy'); setError(''); }}>购入</Button>
          <Button aria-pressed={side === 'sell'} onClick={() => { setSide('sell'); setError(''); }}>出售</Button>
        </div>
        <label>数量（石）<input aria-label="交易数量" type="number" min={1} max={10000} step={1} value={Number.isNaN(quantity) ? '' : quantity} onChange={event => { setQuantity(event.target.valueAsNumber); setError(''); }} /></label>
        <dl className="trade-quote">
          <div><dt>本城余粮</dt><dd data-testid="trade-source-grain">{sourceStores?.grain.toLocaleString() || '0'} 石</dd></div>
          <div><dt>商埠余粮</dt><dd data-testid="trade-partner-grain">{partnerStores?.grain.toLocaleString() || '0'} 石</dd></div>
          <div><dt>每石金价</dt><dd>{quote?.unitPrice || '—'} 金</dd></div>
          <div><dt>商路运费</dt><dd>{quote?.fee ?? '—'} 金</dd></div>
          <div className="trade-total"><dt>{side === 'buy' ? '合计支付' : '净得黄金'}</dt><dd data-testid="trade-total">{quote?.total ?? '—'} 金</dd></div>
        </dl>
        {(!homeCities.length || !partners.length) && <p role="status">{!homeCities.length ? '本方暂无城池，无法通商。' : '天下归一，暂无外国商埠。'}</p>}
        {source && partner && unavailable && <p className="trade-error" role="status">{!validQuantity ? '数量须为 1–10,000 石的整数。' : side === 'buy' && quote && gold < quote.total ? '黄金不足' : '余粮不足'}</p>}
        {error && <p role="alert" className="trade-error">{error}</p>}
        <Button type="submit" className="trade-confirm" disabled={unavailable}><ArrowLeftRight size={16} /> {side === 'buy' ? '确认购入' : '确认出售'}</Button>
      </form>
      <div className="trade-ledger">
        <h3>万邦商埠 <span className="trade-muted">{partners.length}</span></h3>
        <div className="trade-market-list">
          {partners.map(city => <Button key={city.id} className="trade-market" aria-pressed={partner?.id === city.id} onClick={() => { setPartnerId(city.id); setError(''); }}>
            <span><strong>{city.name}</strong><small>{factionName(ownership[city.id])}</small></span>
            <span>{stores[city.id]?.grain.toLocaleString()} 石</span>
          </Button>)}
        </div>
        <h3 className="trade-history-heading">通商账簿</h3>
        <div className="trade-history" aria-live="polite">{logs.length ? logs.map((log, i) => <p key={`${i}-${log}`}>{log}</p>) : <p className="trade-muted">暂无成交</p>}</div>
      </div>
    </div>
  </section>;
}