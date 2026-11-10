import React from 'react';
import { Map, Users, Building2, Heart, UserPlus, Swords, Pause, Play, SkipForward } from 'lucide-react';
import Button from './Button';

type Tab = 'roster' | 'creator' | 'bonds' | 'map' | 'duel' | 'affairs';
interface Props {
  activeTab: Tab;
  onSelect: (tab: Tab) => void;
  year: number;
  month: number;
  xun: number;
  playing: boolean;
  onToggleTime: () => void;
  speed: 'slow' | 'normal' | 'fast';
  onSpeed: (speed: 'slow' | 'normal' | 'fast') => void;
  onStep: () => void;
  onMonth: () => void;
}

export default function GameNavigation(props: Props) {
  return <div className="game-navigation">
    <nav className="game-tabs" aria-label="游戏导航">
      {([{ id: 'map', label: '地图', icon: Map }, { id: 'roster', label: '武将', icon: Users }, { id: 'affairs', label: '内政', icon: Building2 }, { id: 'bonds', label: '关系', icon: Heart }, { id: 'duel', label: '单挑', icon: Swords }] as const).map(({ id, label, icon: Icon }) =>
        <Button key={id} id={`tab-${id}`} aria-current={props.activeTab === id ? 'page' : undefined} aria-pressed={props.activeTab === id} onClick={() => props.onSelect(id)}><Icon size={16} /><span>{label}</span></Button>
      )}
    </nav>
    <div className="game-time">
      <span>{props.year} 年 · {props.month} 月 · {['上旬', '中旬', '下旬'][props.xun - 1]}</span>
      <Button id="btn-toggle-auto-time" aria-label={props.playing ? '暂停时间' : '继续时间'} title={props.playing ? '暂停时间' : '继续时间'} onClick={props.onToggleTime}>{props.playing ? <Pause size={16} /> : <Play size={16} />}</Button>
      <details className="game-disclosure time-settings"><summary>时间设置</summary><div className="game-settings-body">
        <label>速度<select aria-label="时间速度" value={props.speed} onChange={event => props.onSpeed(event.target.value as Props['speed'])}><option value="slow">慢速</option><option value="normal">常速</option><option value="fast">快速</option></select></label>
        <Button id="btn-step-xun" onClick={props.onStep}><SkipForward size={15} />下一旬</Button>
        <Button id="btn-step-month" onClick={props.onMonth}>下一月</Button>
      </div></details>
    </div>
  </div>;
}