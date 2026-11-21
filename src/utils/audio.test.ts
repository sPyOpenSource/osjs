import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  clampVolume,
  getBgmTrackForContext,
  playArrowSound,
  playClashSound,
  playClickSound,
  playDefeatSound,
  playDrumSound,
  playFireSound,
  playHarvestSound,
  playVictorySound,
  setBgmEnabled,
  setBgmVolume,
  setSfxEnabled,
  setSfxVolume,
  stopBgm,
  syncBgm,
  unlockAudio,
} from './audio';

describe('audio & BGM engine helpers', () => {
  it('routes StartMenu to tranquil menu theme', () => {
    assert.equal(
      getBgmTrackForContext({ showStartMenu: true, activeTab: 'map', inSiegeBattle: false }),
      'menu'
    );
    assert.equal(
      getBgmTrackForContext({ showStartMenu: true, activeTab: 'duel', inSiegeBattle: true }),
      'menu'
    );
  });

  it('routes Duel tab and Siege combat to intense battle theme', () => {
    assert.equal(
      getBgmTrackForContext({ showStartMenu: false, activeTab: 'duel', inSiegeBattle: false }),
      'battle'
    );
    assert.equal(
      getBgmTrackForContext({ showStartMenu: false, activeTab: 'map', inSiegeBattle: true }),
      'battle'
    );
  });

  it('routes strategic campaign tabs to campaign theme', () => {
    for (const tab of ['map', 'roster', 'affairs', 'diplomacy', 'bonds', 'creator'] as const) {
      assert.equal(
        getBgmTrackForContext({ showStartMenu: false, activeTab: tab, inSiegeBattle: false }),
        'campaign'
      );
    }
  });

  it('clamps audio volume values safely to [0, 1]', () => {
    assert.equal(clampVolume(-0.4), 0);
    assert.equal(clampVolume(0.65), 0.65);
    assert.equal(clampVolume(1.8), 1);
    assert.equal(clampVolume(Number.NaN), 0);
  });

  it('safely no-ops SFX and BGM functions in headless Node environment', () => {
    assert.equal(unlockAudio(), false);
    setSfxEnabled(true);
    setBgmEnabled(true);
    setSfxVolume(0.8);
    setBgmVolume(0.4);
    syncBgm(true, 'campaign');
    playClickSound();
    playDrumSound();
    playClashSound();
    playHarvestSound();
    playArrowSound();
    playFireSound();
    playVictorySound();
    playDefeatSound();
    stopBgm();
  });
});
