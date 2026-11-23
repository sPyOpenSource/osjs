import React, { useState, useEffect } from 'react';
import { CampaignScenario } from '../types';
import { FAMOUS_OFFICERS, FACTIONS } from '../data';
import { getCandidateOfficers } from '../utils/party';
import AvatarRenderer from './AvatarRenderer';
import { StatRadarSvg } from './ProtagonistProfile';
import Button from './Button';
import { Play, Volume2, VolumeX, Music, Users, Building2, UserPlus, Heart } from 'lucide-react';

interface StartMenuProps {
  scenarios: CampaignScenario[];
  selectedScenario: CampaignScenario;
  onSelectScenario: (scenario: CampaignScenario) => void;
  onEnterApp: (tab: 'roster' | 'creator' | 'bonds' | 'map' | 'affairs') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  bgmEnabled?: boolean;
  onToggleBgm?: () => void;
  multiplayerEnabled?: boolean;
  onMultiplayerChange?: (enabled: boolean) => void;
  playerFactions?: string[];
  onPlayerFactionsChange?: (factions: string[]) => void;
  protagonistId?: string;
  onProtagonistChange?: (id: string) => void;
}

export default function StartMenu({ scenarios, selectedScenario, onSelectScenario, onEnterApp, soundEnabled, onToggleSound, bgmEnabled = true, onToggleBgm, multiplayerEnabled = false, onMultiplayerChange, playerFactions, onPlayerFactionsChange, protagonistId, onProtagonistChange }: StartMenuProps) {
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
  const setProtagonist = (id: string) => {
    if (onProtagonistChange) onProtagonistChange(id);
    else setLocalProtagonistId(id);
  };

  const candidateOfficers = getCandidateOfficers(
    FAMOUS_OFFICERS,
    selectedPlayerFactions,
    selectedScenario.featuredFactions
  );
  const requestedProtagonistId = onProtagonistChange ? (protagonistId ?? '') : localProtagonistId;
  const effectiveProtagonistId = candidateOfficers.some(officer => officer.id === requestedProtagonistId)
    ? requestedProtagonistId
    : (candidateOfficers[0]?.id ?? '');

  // Propagate the corrected selection so the parent never holds an id that is
  // not in the candidate roster. Converges immediately, so no render loop.
  useEffect(() => {
    if (effectiveProtagonistId && effectiveProtagonistId !== requestedProtagonistId) {
      setProtagonist(effectiveProtagonistId);
    }
  }, [effectiveProtagonistId, requestedProtagonistId]);

  // Keep defaults in sync when scenario changes
  useEffect(() => {
    if (!onPlayerFactionsChange) {
      setLocalPlayerFactions(selectedScenario.featuredFactions);
    }
  }, [selectedScenario]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div className="game-start">
    <header className="game-header">
      <div className="game-header-actions">
        {onToggleBgm && (
          <Button
            id="btn-bgm-toggle"
            aria-label={bgmEnabled ? '关闭背景音乐' : '开启背景音乐'}
            aria-pressed={bgmEnabled}
            title={bgmEnabled ? '关闭背景音乐' : '开启背景音乐'}
            onClick={onToggleBgm}
            className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Music size={16} />
            <span>{bgmEnabled ? '配乐开' : '配乐关'}</span>
          </Button>
        )}
        <Button
          id="btn-sound-toggle"
          aria-label={soundEnabled ? '关闭音效' : '开启音效'}
          aria-pressed={soundEnabled}
          title={soundEnabled ? '关闭音效' : '开启音效'}
          onClick={onToggleSound}
          className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span>{soundEnabled ? '音效开' : '音效关'}</span>
        </Button>
      </div>
    </header>
    <main className="start-content">
      <div className="start-title"><span className="trade-muted">战役</span><h2>选择剧本</h2></div>
      <div className="start-scenarios">{scenarios.map(scenario => <Button id={`start-sc-${scenario.id}`} key={scenario.id} className="start-scenario" aria-pressed={scenario.id === selectedScenario.id} onClick={() => onSelectScenario(scenario)}><span className="start-year">{scenario.year}</span><strong>{scenario.title.split('：').pop()}</strong><span className="trade-muted">{scenario.difficulty === 'Easy' ? '简单' : scenario.difficulty === 'Medium' ? '普通' : '困难'}</span></Button>)}</div>
      <div className="start-selected">
        <h3 title={selectedScenario.description}>{selectedScenario.title}</h3>
        <span className="trade-muted">胜利 · {selectedScenario.victoryCondition}</span>
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
            value={effectiveProtagonistId}
            onChange={(e) => setProtagonist(e.target.value)}
          >
            {candidateOfficers.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </label>
        {(() => {
          const chosen = candidateOfficers.find(o => o.id === effectiveProtagonistId);
          if (!chosen) return null;
          const chosenFaction = FACTIONS.find(f => f.id === chosen.factionId);
          const accent = chosenFaction?.color || '#f59e0b';
          return (
            <div className="start-protagonist-preview" data-testid="start-protagonist-preview">
              <AvatarRenderer style={chosen.avatarStyle} size={68} />
              <div className="start-protagonist-preview-body">
                <div className="start-protagonist-preview-head">
                  <strong>{chosen.name}</strong>
                  {chosen.styleName && (
                    <span className="trade-muted">
                      {chosen.isGlobalLeader ? '号' : '字'} {chosen.styleName}
                    </span>
                  )}
                  {chosenFaction && (
                    <span style={{ color: accent }}>{chosenFaction.name}</span>
                  )}
                  {chosen.homeCity && <span className="trade-muted">· {chosen.homeCity}</span>}
                </div>
                {chosen.traits.length > 0 && (
                  <div className="start-protagonist-traits">
                    {chosen.traits.slice(0, 3).join(' · ')}
                  </div>
                )}
              </div>
              <div className="start-protagonist-radar" aria-hidden="true">
                <StatRadarSvg
                  stats={chosen.stats}
                  accentColor={accent}
                  size={74}
                  compact
                />
              </div>
            </div>
          );
        })()}
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
