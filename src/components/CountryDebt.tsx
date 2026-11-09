import React, { useState } from 'react';
import { Landmark, Plus, ArrowDownLeft } from 'lucide-react';
import { Faction } from '../types';
import Button from './Button';

interface Props {
  factions: Faction[];
  debts: Record<string, number>;
  playerFaction: string;
  gold: number;
  onChangeDebt: (amount: number, action: 'borrow' | 'repay') => string | undefined;
}

export default function CountryDebt({ factions, debts, playerFaction, gold, onChangeDebt }: Props) {
  const [amount, setAmount] = useState(500);
  const [message, setMessage] = useState('');
  const debt = debts[playerFaction] || 0;
  const valid = Number.isSafeInteger(amount) && amount > 0;
  const submit = (action: 'borrow' | 'repay') => {
    const error = onChangeDebt(amount, action);
    setMessage(error || `${action === 'borrow' ? '借入' : '偿还'} ${amount.toLocaleString()} 金。`);
  };
  return <section className="country-debt" aria-label="各国债务">
    <div className="debt-heading"><h3><Landmark size={18} /> 各国债务</h3><span className="trade-muted">无息国债 · 初始债务 0 金</span></div>
    <div className="debt-controls">
      <div><span className="trade-muted">本方未偿债务</span><strong className="debt-balance" data-testid="player-debt">{debt.toLocaleString()} 金</strong></div>
      <label>金额（金）<input type="number" aria-label="债务金额" min={1} step={1} value={Number.isNaN(amount) ? '' : amount} onChange={event => { setAmount(event.target.valueAsNumber); setMessage(''); }} /></label>
      <Button disabled={!valid} onClick={() => submit('borrow')}><Plus size={15} /> 借款</Button>
      <Button disabled={!valid || amount > debt || amount > gold} onClick={() => submit('repay')}><ArrowDownLeft size={15} /> 还款</Button>
    </div>
    <p className="debt-message" role="status">{message}</p>
    <details className="game-disclosure"><summary>各国债务 · {factions.length} 个国家 / 势力</summary><div className="debt-table-scroll"><table className="debt-table"><thead><tr><th scope="col">国家 / 势力</th><th scope="col">未偿债务（金）</th></tr></thead><tbody>
      {factions.map(faction => <tr key={faction.id} data-testid={`debt-row-${faction.id}`} className={faction.id === playerFaction ? 'debt-current' : ''}>
        <th scope="row">{faction.name}{faction.id === playerFaction && <small> · 本方</small>}</th><td>{(debts[faction.id] || 0).toLocaleString()}</td>
      </tr>)}
    </tbody></table></div></details>
  </section>;
}