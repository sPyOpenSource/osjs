import React, { useState, useEffect, useMemo } from 'react';
import { CampaignScenario } from '../types';
import { FAMOUS_OFFICERS, FACTIONS } from '../data';
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
  multiplayerEnabled?: boolean;
  onMultiplayerChange?: (enabled: boolean) => void;
  playerFactions?: string[];
  onPlayerFactionsChange?: (factions: string[]) => void;
  protagonistId?: string;
  onProtagonistChange?: (id: string) => void;
}

export default function StartMenu({ scenarios, selectedScenario, onSelectScenario, onEnterApp, soundEnabled, onToggleSound, multiplayerEnabled = false, onMultiplayerChange, playerFactions, onPlayerFactionsChange, protagonistId, onProtagonistChange }: StartMenuProps) {
  const [showCredits, setShowCredits] = useState(false);
  const [localMultiplayer, setLocalMultiplayer] = useState(multiplayerEnabled);
  const isMultiplayer = onMultiplayerChange ? multiplayerEnabled : localMultiplayer;
  const setMultiplayer = (enabled: boolean) => {
    if (onMultiplayerChange) onMultiplayerChange(enabled);
    else setLocalMultiplayer(enabled);
  };

  const [localPlayerFactions, setLocalPlayerFactions] = useState<string[]>(playerFactions ?? selectedScenario.featuredFactions);
  const selectedPlayerFactions = onPlayerFactionsChange ? (playerFactions ?? selectedScenario.featuredFactions) : localPlayerFactions;
  const setPlayerFactions = (next: string[]) => {
    if (onPlayerFactionsChange) onPlayerFactionsChange(next);
    else setLocalPlayerFactions(next);
  };

  const [localProtagonistId, setLocalProtagonistId] = useState<string>(protagonistId ?? FAMOUS_OFFICERS[0].id);
  const selectedProtagonistId = onProtagonistChange ? (protagonistId ?? FAMOUS_OFFICERS[0].id) : localProtagonistId;
  const setProtagonist = (id: string) => {
    if (onProtagonistChange) onProtagonistChange(id);
    else setLocalProtagonistId(id);
  };

  const candidateOfficers = useMemo(() => {
    const inFactions = FAMOUS_OFFICERS.filter(o => selectedPlayerFactions.includes(o.factionId));
    return inFactions.length ? inFactions : FAMOUS_OFFICERS;
  }, [selectedPlayerFactions]);
  const candidateIdsKey = candidateOfficers.map(o => o.id).join(',');

  // Keep the protagonist selection valid when the candidate roster changes
  useEffect(() => {
    if (!candidateOfficers.length) return;
    if (!candidateOfficers.some(o => o.id === selectedProtagonistId)) {
      setProtagonist(candidateOfficers[0].id);
    }
  }, [candidateIdsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep defaults in sync when scenario changes
  useEffect(() => {
    if (!onPlayerFactionsChange) {
      setLocalPlayerFactions(selectedScenario.featuredFactions);
    }
  }, [selectedScenario]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div className="game-start">
    <header className="game-header"><h1>三国志</h1><Button id="btn-sound-toggle" aria-label={soundEnabled ? '关闭音效' : '开启音效'} title={soundEnabled ? '关闭音效' : '开启音效'} onClick={onToggleSound}>{soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}</Button></header>
    <main className="start-content">
      <div className="start-title"><span className="trade-muted">战役</span><h2>选择剧本</h2></div>
      <div className="start-scenarios">{scenarios.map(scenario => <Button id={`start-sc-${scenario.id}`} key={scenario.id} className="start-scenario" aria-pressed={scenario.id === selectedScenario.id} onClick={() => onSelectScenario(scenario)}><span className="start-year">{scenario.year}</span><strong>{scenario.title.split('：').pop()}</strong><span className="trade-muted">{scenario.difficulty === 'Easy' ? '简单' : scenario.difficulty === 'Medium' ? '普通' : '困难'}</span></Button>)}</div>
      <div className="start-selected"><h3>{selectedScenario.title}</h3><p>{selectedScenario.description}</p><span className="trade-muted">胜利条件 · {selectedScenario.victoryCondition}</span>
        <label className="start-multiplay-option" style={{ display: 'block', marginTop: '0.75rem' }}>
          <input
            id="toggle-multiplay"
            data-testid="multiplay-option"
            type="checkbox"
            checked={isMultiplayer}
            onChange={(e) => setMultiplayer(e.target.checked)}
          />
          {' '}多人联机模式
        </label>
        <div className="start-player-factions" style={{ marginTop: '0.75rem' }}>
          <span className="trade-muted" style={{ display: 'block', marginBottom: '0.25rem' }}>可操控势力</span>
          {selectedScenario.featuredFactions.map(fid => {
            const faction = FACTIONS.find(f => f.id === fid);
            return (
              <label key={fid} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginRight: '0.75rem' }}>
                <input
                  type="checkbox"
                  data-testid={`player-faction-${fid}`}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...selectedPlayerFactions, fid]
                      : selectedPlayerFactions.filter(id => id !== fid);
                    setPlayerFactions(next.length ? next : [fid]);
                  }}
                />
                {faction?.name || fid}
              </label>
            );
          })}
        </div>
        <label className="start-protagonist" style={{ display: 'block', marginTop: '0.75rem' }}>
          <span className="trade-muted" style={{ display: 'block', marginBottom: '0.25rem' }}>主角武将</span>
          <select
            id="start-protagonist"
            data-testid="protagonist-select"
            value={selectedProtagonistId}
            onChange={(e) => setProtagonist(e.target.value)}
          >
            {candidateOfficers.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </label>
        <br></br>
        <div className="start-portrait">{FAMOUS_OFFICERS.filter(officer => ['liubei', 'caocao', 'zhugeliang', 'guanyu', 'lubu'].includes(officer.id)).map(officer => <Button key={officer.id} onClick={() => onEnterApp('roster')}><AvatarRenderer style={officer.avatarStyle} size={56} /><span>{officer.name}</span></Button>)}</div>
      </div>
      <Button id="start-menu-map" className="start-play" onClick={() => onEnterApp('map')}><Play size={18} />{isMultiplayer ? '开始多人战役' : '开始战役'}</Button>
      <nav className="start-secondary" aria-label="其他游戏模式">
        <Button id="start-menu-roster" onClick={() => onEnterApp('roster')}><Users size={16} />武将</Button>
        <Button id="start-menu-affairs" onClick={() => onEnterApp('affairs')}><Building2 size={16} />内政</Button>
        <Button id="start-menu-bonds" onClick={() => onEnterApp('bonds')}><Heart size={16} />关系</Button>
        <Button id="start-menu-creator" onClick={() => onEnterApp('creator')}><UserPlus size={16} />创建武将</Button>
        <Button id="start-menu-multiplayer" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }} onClick={() => { setMultiplayer(true); onEnterApp('map'); }}>多人联机</Button>
      </nav>
    </main>
  </div>;
}
