import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import { Officer } from '../types';
import { getCandidateOfficers } from './party';

function officer(id: string, factionId: string): Officer {
  return {
    id,
    name: id,
    gender: 'Male',
    factionId,
    avatarStyle: {
      hairColor: '#000',
      hairStyle: 'short',
      armorColor: '#000',
      accessory: 'none',
      expression: 'calm',
      bgGradient: 'none'
    },
    stats: { leadership: 50, force: 50, intelligence: 50, politics: 50, charisma: 50 },
    traits: [],
    skills: [],
    biography: ''
  };
}

const roster = [
  officer('liubei', 'shu'),
  officer('guanyu', 'shu'),
  officer('caocao', 'wei'),
  officer('sunquan', 'wu')
];

describe('protagonist candidates', () => {
  test('returns officers of the selected factions only', () => {
    const result = getCandidateOfficers(roster, ['shu']);
    assert.deepEqual(result.map(o => o.id), ['liubei', 'guanyu']);
  });

  test('merges multiple selected factions in roster order', () => {
    const result = getCandidateOfficers(roster, ['wei', 'shu']);
    assert.deepEqual(result.map(o => o.id), ['liubei', 'guanyu', 'caocao']);
  });

  test('falls back to the scenario factions when the intersection is empty', () => {
    const result = getCandidateOfficers(roster, ['yuanshao'], ['wu']);
    assert.deepEqual(result.map(o => o.id), ['sunquan']);
  });

  test('falls back to the whole roster when no faction matches', () => {
    const result = getCandidateOfficers(roster, ['yuanshao'], ['dongzhuo']);
    assert.equal(result.length, roster.length);
  });

  test('treats an empty faction list as no filter', () => {
    const result = getCandidateOfficers(roster, []);
    assert.equal(result.length, roster.length);
  });
});
