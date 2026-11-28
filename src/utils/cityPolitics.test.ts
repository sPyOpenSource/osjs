import test from 'node:test';
import assert from 'node:assert/strict';
import { FACTIONS, FAMOUS_OFFICERS } from '../data';
import {
  applyClaimCity,
  applyCoupCity,
  applyDissolveFaction,
  evaluateWarSiegeOutcome,
  getCityControllerActionState,
  isOfficerFactionLeader,
  isPlayerFactionInBattle,
  planAiCounterAttack,
  resolveCoupOutcome,
  resolveWarBattleOwnership,
  selectCoupDuelists,
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

test('coup duelists selection and outcome assign city to whoever wins the duel', () => {
  const { attackerOfficer, defenderOfficer } = selectCoupDuelists({
    officers: FAMOUS_OFFICERS,
    cityName: '洛阳',
    attackerFactionId: 'shu',
    defenderFactionId: 'wei',
    protagonistId: 'guanyu',
  });
  assert.equal(attackerOfficer?.id, 'guanyu');
  assert.equal(defenderOfficer?.factionId, 'wei');

  const challenge = {
    nonce: 1,
    cityId: 'luoyang',
    cityName: '洛阳',
    attackerFactionId: 'shu',
    attackerFactionName: '蜀汉',
    defenderFactionId: 'wei',
    defenderFactionName: '曹魏',
    attackerOfficerId: attackerOfficer!.id,
    defenderOfficerId: defenderOfficer!.id,
  };

  const attackerWin = resolveCoupOutcome(
    challenge,
    'left',
    attackerOfficer!.name,
    defenderOfficer!.name,
  );
  assert.equal(attackerWin.winnerFactionId, 'shu');

  const defenderWin = resolveCoupOutcome(
    challenge,
    'right',
    defenderOfficer!.name,
    attackerOfficer!.name,
  );
  assert.equal(defenderWin.winnerFactionId, 'wei');
});

test('resolveWarBattleOwnership assigns city to whichever faction wins WarMode', () => {
  const ownership = {
    luoyang: 'wei',
    chengdu: 'shu',
    jianye: 'wu',
    rome: 'rome',
  };

  const attackerWon = resolveWarBattleOwnership(ownership, 'luoyang', 'attacker', 'shu', 'wei');
  assert.equal(attackerWon.winnerFactionId, 'shu');
  assert.equal(attackerWon.nextOwnership.luoyang, 'shu');
  assert.equal(attackerWon.nextOwnership.jianye, 'wu');

  const defenderWon = resolveWarBattleOwnership(ownership, 'luoyang', 'defender', 'shu', 'wei');
  assert.equal(defenderWon.winnerFactionId, 'wei');
  assert.equal(defenderWon.nextOwnership.luoyang, 'wei');

  // AI rival vs rival clash: attacker Wu takes Luoyang from Wei, or Wei keeps it
  const aiRivalAttackWin = resolveWarBattleOwnership(ownership, 'luoyang', 'attacker', 'wu', 'wei');
  assert.equal(aiRivalAttackWin.winnerFactionId, 'wu');
  assert.equal(aiRivalAttackWin.nextOwnership.luoyang, 'wu');
});

test('evaluateWarSiegeOutcome requires Town Hall fall or 100% destruction for attacker victory', () => {
  // 50% outer building destruction WITHOUT destroying Town Hall -> army wiped -> defender wins!
  const outerRaidOnly = evaluateWarSiegeOutcome({
    destructionPct: 50,
    townHallDestroyed: false,
    remainingTroopCards: 0,
    activeTroopsCount: 0,
    inFlightAttackerProjectiles: 0,
    timeRemaining: 120,
  });
  assert.equal(outerRaidOnly.finished, true);
  assert.equal(outerRaidOnly.winner, 'defender');
  assert.equal(outerRaidOnly.reason, 'army_wiped');

  // Manual retreat with 50% outer huts but Town Hall still standing -> defender wins!
  const earlyRetreat = evaluateWarSiegeOutcome({
    destructionPct: 63,
    townHallDestroyed: false,
    remainingTroopCards: 4,
    activeTroopsCount: 2,
    inFlightAttackerProjectiles: 0,
    timeRemaining: 90,
    manualSettle: true,
  });
  assert.equal(earlyRetreat.finished, true);
  assert.equal(earlyRetreat.winner, 'defender');

  // Town Hall destroyed + manual settle or army wiped -> attacker wins!
  const thCaptured = evaluateWarSiegeOutcome({
    destructionPct: 38,
    townHallDestroyed: true,
    remainingTroopCards: 0,
    activeTroopsCount: 0,
    inFlightAttackerProjectiles: 0,
    timeRemaining: 80,
  });
  assert.equal(thCaptured.finished, true);
  assert.equal(thCaptured.winner, 'attacker');
  assert.equal(thCaptured.reason, 'town_hall_captured');

  // In-flight arrow still flying when last archer dies -> wait before declaring defeat
  const arrowInFlight = evaluateWarSiegeOutcome({
    destructionPct: 38,
    townHallDestroyed: false,
    remainingTroopCards: 0,
    activeTroopsCount: 0,
    inFlightAttackerProjectiles: 1,
    timeRemaining: 80,
  });
  assert.equal(arrowInFlight.finished, false);
  assert.equal(arrowInFlight.winner, null);

  // 100% destruction -> immediate attacker victory even while troops remain
  const totalSweep = evaluateWarSiegeOutcome({
    destructionPct: 100,
    townHallDestroyed: true,
    remainingTroopCards: 2,
    activeTroopsCount: 5,
    inFlightAttackerProjectiles: 0,
    timeRemaining: 110,
  });
  assert.equal(totalSweep.finished, true);
  assert.equal(totalSweep.winner, 'attacker');
  assert.equal(totalSweep.reason, 'total_destruction');
});

test('planAiCounterAttack retaliates from nearest AI base against preferred or closest aggressor city', () => {
  const cities = [
    { id: 'xuchang', x: 52, y: 40 },
    { id: 'luoyang', x: 46, y: 38 },
    { id: 'ye', x: 54, y: 28 },
    { id: 'jingzhou', x: 48, y: 55 },
    { id: 'chengdu', x: 34, y: 54 },
  ];
  const ownership = {
    xuchang: 'shu', // player just captured Xuchang from Wei!
    luoyang: 'wei',
    ye: 'wei',
    jingzhou: 'shu',
    chengdu: 'shu',
  };

  const plan = planAiCounterAttack({
    cityOwnership: ownership,
    cities,
    officers: FAMOUS_OFFICERS,
    aggrievedFactionId: 'wei',
    targetFactionId: 'shu',
    preferredTargetCityId: 'xuchang',
  });

  assert.ok(plan, 'expected Wei counter-attack plan');
  assert.equal(plan?.aggrievedFactionId, 'wei');
  assert.equal(plan?.targetFactionId, 'shu');
  assert.equal(plan?.originCityId, 'luoyang'); // closer to Xuchang than Ye
  assert.equal(plan?.targetCityId, 'xuchang'); // aims to retake contested Xuchang
  assert.ok(plan?.attackingOfficerId, 'expected AI commander chosen');
  assert.ok(plan?.defendingOfficerId, 'expected defending commander chosen');

  // If aggrieved faction is neutral ronin or wiped out (0 remaining cities), returns null
  assert.equal(
    planAiCounterAttack({
      cityOwnership: ownership,
      cities,
      officers: FAMOUS_OFFICERS,
      aggrievedFactionId: 'ronin',
      targetFactionId: 'shu',
    }),
    null,
  );
  assert.equal(
    planAiCounterAttack({
      cityOwnership: { xuchang: 'shu', jingzhou: 'shu' },
      cities,
      officers: FAMOUS_OFFICERS,
      aggrievedFactionId: 'wei',
      targetFactionId: 'shu',
    }),
    null,
  );
});

test('isPlayerFactionInBattle returns true only when player controls attacker or defender faction', () => {
  // Player attacks AI
  assert.equal(
    isPlayerFactionInBattle({
      attackerFactionId: 'shu',
      defenderFactionId: 'wei',
      playerFactionId: 'shu',
    }),
    true,
  );
  // AI attacks Player
  assert.equal(
    isPlayerFactionInBattle({
      attackerFactionId: 'wei',
      defenderFactionId: 'shu',
      playerFactionId: 'shu',
    }),
    true,
  );
  // AI vs AI (player is shu, clash is wei vs wu) -> false!
  assert.equal(
    isPlayerFactionInBattle({
      attackerFactionId: 'wei',
      defenderFactionId: 'wu',
      playerFactionId: 'shu',
    }),
    false,
  );
  // Ronin / dissolved player cannot enter player WarMode
  assert.equal(
    isPlayerFactionInBattle({
      attackerFactionId: 'wei',
      defenderFactionId: 'ronin',
      playerFactionId: 'ronin',
    }),
    false,
  );
  // Multiplayer allows any controlled player faction
  assert.equal(
    isPlayerFactionInBattle({
      attackerFactionId: 'wu',
      defenderFactionId: 'wei',
      playerFactionId: 'shu',
      playerFactions: ['shu', 'wu'],
    }),
    true,
  );
});
