import React, { useState } from 'react';
import { CampaignScenario } from '../types';
import { FAMOUS_OFFICERS } from '../data';
import AvatarRenderer from './AvatarRenderer';
import Button from './Button';
import { Play, Volume2, VolumeX, Users, Building2, UserPlus, Heart } from 'lucide-react';

interface StartMenuProps {
  scenarios: CampaignScenario[];
  selectedScenario: CampaignScenario;
  onSelectScenario: (scenario: CampaignScenario) => void;
  onEnterApp: (tab: 'roster' | 'creator' | 'bonds' | 'map' | 'affairs') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function StartMenu({ scenarios, selectedScenario, onSelectScenario, onEnterApp, soundEnabled, onToggleSound }: StartMenuProps) {
  const [showCredits, setShowCredits] = useState(false);
  return <div className="game-start">
    <header className="game-header"><h1>三国志 8</h1><Button id="btn-sound-toggle" aria-label={soundEnabled ? '关闭音效' : '开启音效'} title={soundEnabled ? '关闭音效' : '开启音效'} onClick={onToggleSound}>{soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}</Button></header>
    <main className="start-content">
      <div className="start-title"><span className="trade-muted">战役</span><h2>选择剧本</h2></div>
      <div className="start-scenarios">{scenarios.map(scenario => <Button id={`start-sc-${scenario.id}`} key={scenario.id} className="start-scenario" aria-pressed={scenario.id === selectedScenario.id} onClick={() => onSelectScenario(scenario)}><span className="start-year">{scenario.year}</span><strong>{scenario.title.split('：').pop()}</strong><span className="trade-muted">{scenario.difficulty === 'Easy' ? '简单' : scenario.difficulty === 'Medium' ? '普通' : '困难'}</span></Button>)}</div>
      <div className="start-selected"><h3>{selectedScenario.title}</h3><p>{selectedScenario.description}</p><span className="trade-muted">胜利条件 · {selectedScenario.victoryCondition}</span></div>
      <Button id="start-menu-map" className="start-play" onClick={() => onEnterApp('map')}><Play size={18} />开始战役</Button>
      <nav className="start-secondary" aria-label="其他游戏模式">
        <Button id="start-menu-roster" onClick={() => onEnterApp('roster')}><Users size={16} />武将</Button>
        <Button id="start-menu-affairs" onClick={() => onEnterApp('affairs')}><Building2 size={16} />内政</Button>
        <Button id="start-menu-bonds" onClick={() => onEnterApp('bonds')}><Heart size={16} />关系</Button>
        <Button id="start-menu-creator" onClick={() => onEnterApp('creator')}><UserPlus size={16} />创建武将</Button>
      </nav>
      <div className="start-portraits">{FAMOUS_OFFICERS.filter(officer => ['liubei', 'caocao', 'zhugeliang', 'guanyu', 'lubu'].includes(officer.id)).map(officer => <Button key={officer.id} onClick={() => onEnterApp('roster')}><AvatarRenderer style={officer.avatarStyle} size={56} /><span>{officer.name}</span></Button>)}</div>
    </main>
    <footer className="game-footer"><Button id="btn-help-credits" onClick={() => setShowCredits(!showCredits)} aria-expanded={showCredits}>关于</Button>{showCredits && <p>三国志 8 · 非官方历史策略模拟，人物与剧本取材于历史和演义。</p>}</footer>
  </div>;
}
