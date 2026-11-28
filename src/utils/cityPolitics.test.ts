import test from 'node:test';
import assert from 'node:assert/strict';
import { FACTIONS, FAMOUS_OFFICERS } from '../data';
import {
  applyClaimCity,
  applyCoupCity,
  applyDissolveFaction,
  getCityControllerActionState,
  isOfficerFactionLeader,
} from './cityPolitics';

const TEST_CITIES = [
  { id: 'luoyang' },
  { id: 'chengdu' },
  { id: 'hanzhong' },
  { id: 'guangzong' },
];

test('isOfficerFactionLeader distinguishes faction rulers from subordinates and ronin', () => {
  const shu = FACTIONS.find(f => f.id === 'shu');
  const kushan = FACTIONS.find(f => f.id === 'kushan');
  const ronin = FACTIONS.find(f => f.id === 'ronin');

  const liubei = FAMOUS_OFFICERS.find(o => o.id === 'liubei');
  const guanyu = FAMOUS_OFFICERS.find(o => o.id === 'guanyu');
  const kanishka = FAMOUS_OFFICERS.find(o => o.id === 'kanishka');
  const libai = FAMOUS_OFFICERS.find(o => o.id === 'libai');

  assert.equal(isOfficerFactionLeader(liubei, shu), true);
  assert.equal(isOfficerFactionLeader(guanyu, shu), false);
  assert.equal(isOfficerFactionLeader(kanishka, kushan), true);
  assert.equal(isOfficerFactionLeader(libai, ronin), false);
});

test('city belonging to another faction allows coup and transfers control', () => {
  const ownership = {
    luoyang: 'wei',
    chengdu: 'shu',
    hanzhong: 'shu',
    guangzong: 'ronin',
  };

  const state = getCityControllerActionState({
    cityId: 'luoyang',
    cityOwnership: ownership,
    cities: TEST_CITIES,
    factions: FACTIONS,
    officers: FAMOUS_OFFICERS,
    protagonistId: 'guanyu',
    playerFactionId: 'shu',
  });

  assert.equal(state.isEnemyCity, true);
  assert.equal(state.canCoup, true);
  assert.equal(state.canClaim, false);
  assert.equal(state.canDissolve, false);

  const coup = applyCoupCity(ownership, 'luoyang', state.activePlayerFactionId, state.bannerFactionId);
  assert.equal(coup.ok, true);
  assert.equal(coup.previousControllerId, 'wei');
  assert.equal(coup.nextOwnership.luoyang, 'shu');
});

test('unowned city allows claim and adopts player banner faction', () => {
  const ownership = {
    luoyang: 'wei',
    chengdu: 'shu',
    hanzhong: 'shu',
    guangzong: 'ronin',
  };

  const state = getCityControllerActionState({
    cityId: 'guangzong',
    cityOwnership: ownership,
    cities: TEST_CITIES,
    factions: FACTIONS,
    officers: FAMOUS_OFFICERS,
    protagonistId: 'guanyu',
    playerFactionId: 'shu',
  });

  assert.equal(state.isUnowned, true);
  assert.equal(state.canClaim, true);
  assert.equal(state.canCoup, false);

  const claim = applyClaimCity(ownership, 'guangzong', state.bannerFactionId);
  assert.equal(claim.ok, true);
  assert.equal(claim.nextOwnership.guangzong, 'shu');
});

test('only the faction leader can dissolve their faction, releasing all held cities to ronin', () => {
  const ownership = {
    luoyang: 'wei',
    chengdu: 'shu',
    hanzhong: 'shu',
    guangzong: 'ronin',
  };

  const subordinateState = getCityControllerActionState({
    cityId: 'chengdu',
    cityOwnership: ownership,
    cities: TEST_CITIES,
    factions: FACTIONS,
    officers: FAMOUS_OFFICERS,
    protagonistId: 'guanyu',
    playerFactionId: 'shu',
  });
  assert.equal(subordinateState.isLeader, false);
  assert.equal(subordinateState.canDissolve, false);

  const leaderState = getCityControllerActionState({
    cityId: 'chengdu',
    cityOwnership: ownership,
    cities: TEST_CITIES,
    factions: FACTIONS,
    officers: FAMOUS_OFFICERS,
    protagonistId: 'liubei',
    playerFactionId: 'shu',
  });
  assert.equal(leaderState.isLeader, true);
  assert.equal(leaderState.canDissolve, true);

  const dissolved = applyDissolveFaction(ownership, TEST_CITIES, leaderState.activePlayerFactionId);
  assert.equal(dissolved.ok, true);
  assert.deepEqual(dissolved.releasedCityIds, ['chengdu', 'hanzhong']);
  assert.equal(dissolved.nextOwnership.chengdu, 'ronin');
  assert.equal(dissolved.nextOwnership.hanzhong, 'ronin');
  assert.equal(dissolved.nextOwnership.luoyang, 'wei');

  const afterDissolve = getCityControllerActionState({
    cityId: 'chengdu',
    cityOwnership: dissolved.nextOwnership,
    cities: TEST_CITIES,
    factions: FACTIONS,
    officers: FAMOUS_OFFICERS,
    protagonistId: 'liubei',
    playerFactionId: 'shu',
    dissolvedFactionIds: ['shu'],
  });
  assert.equal(afterDissolve.canDissolve, false);
  assert.equal(afterDissolve.canClaim, true);
});
