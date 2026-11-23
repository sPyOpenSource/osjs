import React from 'react';
import { Map, Users, Building2, Heart, UserPlus, Swords, Handshake, Pause, Play, SkipForward } from 'lucide-react';
import Button from './Button';
import { SEASONS, SeasonId, SeasonalWeatherId } from '../utils/seasons';

type Tab = 'roster' | 'creator' | 'bonds' | 'map' | 'duel' | 'affairs' | 'diplomacy';
interface Props {
  activeTab: Tab;
  onSelect: (tab: Tab) => void;
  year: number;
  month: number;
  xun: number;
  seasonId?: SeasonId;
  weatherId?: SeasonalWeatherId;
  playing: boolean;
  onToggleTime: () => void;
  speed: 'slow' | 'normal' | 'fast';
  onSpeed: (speed: 'slow' | 'normal' | 'fast') => void;
  onStep: () => void;
  onMonth: () => void;
}

const WEATHER_BADGE: Record<SeasonalWeatherId, string> = {
  sunny: '☀️ 晴朗',
  rainy: '🌧️ 微雨',
  heavy_rain: '⛈️ 暴雨',
  windy: '💨 狂风',
  foggy: '🌫️ 薄雾',
  dense_fog: '🌁 浓雾',
  snow: '❄️ 暴雪',
};

export default function GameNavigation(props: Props) {
  const season = props.seasonId ? SEASONS[props.seasonId] : undefined;
  const weatherLabel = props.weatherId ? WEATHER_BADGE[props.weatherId] : undefined;

  return (
    <div className="game-navigation">
      <nav className="game-tabs" aria-label="游戏导航">
        {([
          { id: 'map', label: '地图', icon: Map },
          { id: 'diplomacy', label: '外交', icon: Handshake },
          { id: 'affairs', label: '内政', icon: Building2 },
          { id: 'bonds', label: '关系', icon: Heart },
          { id: 'roster', label: '武将', icon: Users },
          { id: 'duel', label: '单挑', icon: Swords },
        ] as const).map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            id={`tab-${id}`}
            aria-current={props.activeTab === id ? 'page' : undefined}
            aria-pressed={props.activeTab === id}
            onClick={() => props.onSelect(id)}
          >
            <Icon size={15} />
            <span>{label}</span>
          </Button>
        ))}
      </nav>

      <div className="game-time">
        <span className="game-time-date">
          {props.year}.{props.month}·{['上旬', '中旬', '下旬'][props.xun - 1]}
        </span>
        {season && (
          <span
            className={`season-nav-badge ${season.badgeClass}`}
            title={`武将修正：${season.statSummary} | 战术修正：${season.tacticalSummary}`}
          >
            <span>{season.icon} {season.name}</span>
            {weatherLabel && <span className="season-nav-sep">· {weatherLabel}</span>}
          </span>
        )}
        <div className="game-time-controls">
          <Button
            id="btn-toggle-auto-time"
            aria-label={props.playing ? '暂停时间' : '继续时间'}
            title={props.playing ? '暂停时间' : '继续时间'}
            onClick={props.onToggleTime}
          >
            {props.playing ? <Pause size={14} /> : <Play size={14} />}
          </Button>
          <Button id="btn-step-xun" onClick={props.onStep} title="推进一旬">
            <SkipForward size={14} />
            <span>下一旬</span>
          </Button>
          <Button id="btn-step-month" onClick={props.onMonth} title="推进一月">
            <span>下一月</span>
          </Button>
          <details className="game-disclosure game-disclosure-popover time-settings">
            <summary>速度</summary>
            <div className="game-settings-body">
              <label>
                <span>推演速度</span>
                <select
                  aria-label="时间速度"
                  value={props.speed}
                  onChange={event => props.onSpeed(event.target.value as Props['speed'])}
                >
                  <option value="slow">慢速</option>
                  <option value="normal">常速</option>
                  <option value="fast">快速</option>
                </select>
              </label>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
