import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import { Officer, RelationshipRelation } from '../types';
import { buildRelationshipTree, getUniqueRelationships } from './relationshipTree';

const AVATAR = {
  hairColor: '#000',
  hairStyle: 'Topknot Imperial',
  armorColor: '#10b981',
  accessory: 'None',
  expression: 'Warm Smiling',
  bgGradient: 'from-emerald-950 to-teal-900',
};

const makeOfficer = (id: string, name: string, factionId = 'shu'): Officer => ({
  id,
  name,
  gender: 'Male',
  factionId,
  avatarStyle: AVATAR,
  stats: { leadership: 80, force: 80, intelligence: 80, politics: 80, charisma: 80 },
  traits: [],
  skills: [],
  biography: name,
});

const OFFICERS: Officer[] = [
  makeOfficer('liubei', '刘备', 'shu'),
  makeOfficer('guanyu', '关羽', 'shu'),
  makeOfficer('zhugeliang', '诸葛亮', 'shu'),
  makeOfficer('caocao', '曹操', 'wei'),
  makeOfficer('lubu', '吕布', 'lubu'),
  makeOfficer('isolated', '隐士', 'ronin'),
];

const RELS: RelationshipRelation[] = [
  { fromOfficerId: 'liubei', toOfficerId: 'guanyu', type: 'Sworn Brother' },
  { fromOfficerId: 'guanyu', toOfficerId: 'liubei', type: 'Sworn Brother' }, // reciprocal duplicate
  { fromOfficerId: 'liubei', toOfficerId: 'zhugeliang', type: 'Lord' },
  { fromOfficerId: 'guanyu', toOfficerId: 'caocao', type: 'Trust' },
  { fromOfficerId: 'zhugeliang', toOfficerId: 'caocao', type: 'Rival' }, // cycle edge
  { fromOfficerId: 'caocao', toOfficerId: 'lubu', type: 'Rival' },
];

describe('relationship tree builder', () => {
  test('deduplicates reciprocal relationships into unique undirected bonds', () => {
    const unique = getUniqueRelationships(OFFICERS, RELS);
    assert.equal(unique.length, 5);
  });

  test('builds BFS spanning tree without infinite loops on cycles', () => {
    const result = buildRelationshipTree(OFFICERS, RELS, 'liubei', { maxDepth: 3 });
    assert.ok(result.root);
    assert.equal(result.root.officer.id, 'liubei');
    assert.equal(result.root.children.length, 2); // guanyu, zhugeliang
    assert.equal(result.reachableCount, 5);
    assert.equal(result.visibleEdgeCount, 4);

    // caocao placed at depth 2 under guanyu (or zhugeliang), lubu at depth 3 under caocao
    const depth2Ids = result.root.children.flatMap(c => c.children.map(gc => gc.officer.id));
    assert.deepEqual(depth2Ids, ['caocao']);

    const depth3Ids = result.root.children
      .flatMap(c => c.children)
      .flatMap(gc => gc.children.map(ggc => ggc.officer.id));
    assert.deepEqual(depth3Ids, ['lubu']);
  });

  test('respects maxDepth limit and counts truncated neighbors', () => {
    const shallow = buildRelationshipTree(OFFICERS, RELS, 'liubei', { maxDepth: 1 });
    assert.ok(shallow.root);
    assert.equal(shallow.reachableCount, 3);
    assert.equal(shallow.root.children[0].children.length, 0);
    assert.ok(shallow.root.children[0].extraConnectionsCount >= 1);
  });

  test('filters tree edges by relation type', () => {
    const rivalsOnly = buildRelationshipTree(OFFICERS, RELS, 'caocao', {
      maxDepth: 2,
      filterType: 'Rival',
    });
    assert.ok(rivalsOnly.root);
    const childIds = rivalsOnly.root.children.map(c => c.officer.id).sort();
    assert.deepEqual(childIds, ['lubu', 'zhugeliang']);
  });

  test('handles isolated root officer and missing root officer gracefully', () => {
    const isolated = buildRelationshipTree(OFFICERS, RELS, 'isolated');
    assert.ok(isolated.root);
    assert.equal(isolated.root.children.length, 0);
    assert.equal(isolated.reachableCount, 1);

    const missing = buildRelationshipTree(OFFICERS, RELS, 'nonexistent');
    assert.equal(missing.root, null);
    assert.equal(missing.reachableCount, 0);
  });
});
