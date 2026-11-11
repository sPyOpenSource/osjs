import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import PartyRoster from '../PartyRoster';
import { Equipment, Officer, Party, RpgCharacter } from '../../types';
import { MAX_LEVEL } from '../../utils/rpg';

function makeOfficer(id: string, name: string, overrides: Partial<Officer> = {}): Officer {
  return {
    id,
    name,
    gender: 'Male',
    factionId: 'wei',
    avatarStyle: {
      hairColor: '#000',
      hairStyle: 'short',
      armorColor: '#000',
      accessory: 'none',
      expression: 'calm',
      bgGradient: 'none',
    },
    stats: { leadership: 50, force: 50, intelligence: 50, politics: 50, charisma: 50 },
    traits: [],
    skills: [],
    biography: '',
    ...overrides,
  };
}

function makeChar(officerId: string, level: number, skillPoints: number, xp = 0): RpgCharacter {
  return { officerId, level, xp, skillPoints, learnedSkills: [], equipment: {} };
}

const officers = [makeOfficer('caocao', '曹操'), makeOfficer('sunquan', '孙权')];
const party: Party = { protagonistId: 'caocao', companionIds: ['sunquan'] };
const characters: Record<string, RpgCharacter> = {
  caocao: makeChar('caocao', 3, 2, 50),
  sunquan: makeChar('sunquan', 2, 0, 10),
};

const noop = () => {};

function render(
  overrides: {
    party?: Party;
    characters?: Record<string, RpgCharacter>;
    officers?: Officer[];
    availableEquipment?: Equipment[];
  } = {},
): string {
  return renderToStaticMarkup(
    <PartyRoster
      party={overrides.party ?? party}
      characters={overrides.characters ?? characters}
      officers={overrides.officers ?? officers}
      availableEquipment={overrides.availableEquipment ?? []}
      onDismiss={noop}
      onSpendSkillPoint={noop}
      onEquip={noop}
    />,
  );
}

function buttonTag(html: string, testId: string): string {
  const match = html.match(new RegExp(`<button[^>]*data-testid="${testId}"[^>]*>`));
  assert.ok(match, `expected a button with data-testid="${testId}" in markup`);
  return match[0];
}

function cardFor(html: string, officerId: string): string {
  const match = html.match(
    new RegExp(`<article[^>]*data-testid="party-card-${officerId}"[^>]*>([\\s\\S]*?)</article>`),
  );
  assert.ok(match, `expected a party card for ${officerId} in markup`);
  return match[0];
}

function slotRowFor(html: string, officerId: string, slot: string): string {
  const match = html.match(
    new RegExp(`<div[^>]*data-testid="party-slot-${officerId}-${slot}"[^>]*>([\\s\\S]*?)</div>`),
  );
  assert.ok(match, `expected a ${slot} slot row for ${officerId} in markup`);
  return match[0];
}

function findElement(node: any, testId: string): any {
  if (!node || typeof node !== 'object') return null;
  if (node.props?.['data-testid'] === testId) return node;
  const children = node.props?.children;
  const list = Array.isArray(children) ? children : children ? [children] : [];
  for (const child of list) {
    const found = findElement(child, testId);
    if (found) return found;
  }
  return null;
}

function findByClassName(node: any, className: string): any {
  if (!node || typeof node !== 'object') return null;
  if (node.props?.className === className) return node;
  const children = node.props?.children;
  const list = Array.isArray(children) ? children : children ? [children] : [];
  for (const child of list) {
    const found = findByClassName(child, className);
    if (found) return found;
  }
  return null;
}

describe('PartyRoster', () => {
  test('renders one card per member', () => {
    const html = render();
    assert.equal((html.match(/data-testid="party-card-/g) ?? []).length, 2);
    assert.ok(html.includes('data-testid="party-card-caocao"'));
    assert.ok(html.includes('data-testid="party-card-sunquan"'));
    assert.ok(html.includes('队伍'));
    assert.ok(html.includes('成员 2 · 同伴 1/4'));
  });

  test('shows each member level and marks the protagonist exactly once', () => {
    const html = render();
    assert.ok(cardFor(html, 'caocao').includes('Lv.3'));
    assert.ok(cardFor(html, 'sunquan').includes('Lv.2'));
    assert.equal((html.match(/主角/g) ?? []).length, 1);
    assert.ok(cardFor(html, 'caocao').includes('party-card-protagonist'));
    assert.ok(!cardFor(html, 'sunquan').includes('party-card-protagonist'));
  });

  test('renders the real skill point count, not the learned skill count', () => {
    const html = render({
      characters: {
        caocao: { ...makeChar('caocao', 3, 2), learnedSkills: ['a', 'b', 'c', 'd'] },
      },
    });
    const card = cardFor(html, 'caocao');
    assert.ok(card.includes('技能点 2'), 'skill point line must use char.skillPoints');
    assert.ok(!card.includes('技能点 4'));
  });

  test('disables the learn button only when no skill points are available', () => {
    const html = render();
    assert.doesNotMatch(buttonTag(html, 'party-spend-caocao'), / disabled=""/);
    assert.match(buttonTag(html, 'party-spend-sunquan'), / disabled=""/);
    assert.ok(html.includes('学习'));
  });

  test('shows the dismiss button for companions only', () => {
    const html = render();
    assert.ok(html.includes('data-testid="party-dismiss-sunquan"'));
    assert.ok(!html.includes('data-testid="party-dismiss-caocao"'));
    assert.match(buttonTag(html, 'party-dismiss-sunquan'), /aria-label="解散 孙权"/);
  });

  test('renders three empty equipment slots per member when no equipment is available', () => {
    const html = render();
    for (const id of ['caocao', 'sunquan']) {
      const card = cardFor(html, id);
      assert.equal((card.match(new RegExp(`data-testid="party-slot-${id}-`, 'g')) ?? []).length, 3);
      assert.equal((card.match(/空位/g) ?? []).length, 3);
      assert.ok(card.includes('武器') && card.includes('防具') && card.includes('饰品'));
    }
  });

  test('renders a select with a placeholder for a slot with compatible equipment', () => {
    const sword: Equipment = { id: 'sword1', name: '青龙偃月刀', slot: 'weapon', statBonuses: {}, skillBonuses: [] };
    const html = render({ availableEquipment: [sword] });
    const weaponRow = slotRowFor(html, 'caocao', 'weapon');
    assert.ok(weaponRow.includes('<select'));
    assert.ok(weaponRow.includes('aria-label="曹操 武器"'));
    assert.ok(weaponRow.includes('装备 …'));
    assert.ok(weaponRow.includes('青龙偃月刀'));
    // Slots without compatible items keep the empty placeholder.
    assert.ok(slotRowFor(html, 'caocao', 'armor').includes('空位'));
    assert.ok(slotRowFor(html, 'caocao', 'accessory').includes('空位'));
  });

  test('renders the equipped item name instead of a select', () => {
    const sword: Equipment = { id: 'sword1', name: '青龙偃月刀', slot: 'weapon', statBonuses: {}, skillBonuses: [] };
    const html = render({
      characters: {
        caocao: { ...makeChar('caocao', 3, 2), equipment: { weapon: sword } },
        sunquan: makeChar('sunquan', 2, 0),
      },
      availableEquipment: [sword],
    });
    const weaponRow = slotRowFor(html, 'caocao', 'weapon');
    assert.ok(weaponRow.includes('party-equipped'));
    assert.ok(weaponRow.includes('青龙偃月刀'));
    assert.ok(!weaponRow.includes('<select'));
  });

  test('falls back to the raw officer id and a default character for missing data', () => {
    const html = render({
      party: { protagonistId: 'ghost', companionIds: [] },
      characters: {},
      officers: [],
      availableEquipment: [],
    });
    const card = cardFor(html, 'ghost');
    assert.ok(card.includes('ghost'));
    assert.ok(card.includes('Lv.1'));
    assert.ok(card.includes('技能点 0'));
  });

  test('dismiss button invokes onDismiss with the officer id', () => {
    // renderToStaticMarkup drops event handlers, so drive the component tree directly.
    // NOTE: direct invocation only works while PartyRoster stays hook-free; if hooks are
    // added, switch these wiring tests to a DOM renderer.
    const calls: string[] = [];
    const tree = PartyRoster({
      party,
      characters,
      officers,
      availableEquipment: [],
      onDismiss: (id) => calls.push(id),
      onSpendSkillPoint: noop,
      onEquip: noop,
    });
    const button = findElement(tree, 'party-dismiss-sunquan');
    assert.ok(button, 'dismiss button element should exist');
    button.props.onClick();
    assert.deepEqual(calls, ['sunquan']);
  });

  test('learn button invokes onSpendSkillPoint with the level-derived skill id', () => {
    const calls: [string, string][] = [];
    const tree = PartyRoster({
      party,
      characters,
      officers,
      availableEquipment: [],
      onDismiss: noop,
      onSpendSkillPoint: (officerId, skillId) => calls.push([officerId, skillId]),
      onEquip: noop,
    });
    const button = findElement(tree, 'party-spend-caocao');
    assert.ok(button, 'learn button element should exist');
    button.props.onClick();
    assert.deepEqual(calls, [['caocao', 'skill-lv3']]);
  });

  test('equip select invokes onEquip with the chosen item and ignores the placeholder', () => {
    const sword: Equipment = { id: 'sword1', name: '青龙偃月刀', slot: 'weapon', statBonuses: {}, skillBonuses: [] };
    const calls: [string, string, Equipment][] = [];
    const tree = PartyRoster({
      party,
      characters,
      officers,
      availableEquipment: [sword],
      onDismiss: noop,
      onSpendSkillPoint: noop,
      onEquip: (officerId, slot, equipment) => calls.push([officerId, slot, equipment]),
    });
    // Target the companion's own weapon slot to prove the handler is bound per member.
    const companionRow = findElement(tree, 'party-slot-sunquan-weapon');
    const select = findByClassName(companionRow, 'party-slot-select');
    assert.ok(select, 'equip select element should exist');
    select.props.onChange({ target: { value: '' } });
    assert.deepEqual(calls, []);
    select.props.onChange({ target: { value: 'sword1' } });
    assert.deepEqual(calls, [['sunquan', 'weapon', sword]]);
  });

  test('caps the xp bar and label at MAX_LEVEL', () => {
    const html = render({
      characters: {
        caocao: { ...makeChar('caocao', MAX_LEVEL, 2, 1000) },
        sunquan: makeChar('sunquan', 2, 0),
      },
    });
    const card = cardFor(html, 'caocao');
    assert.ok(card.includes(`Lv.${MAX_LEVEL}`));
    assert.ok(card.includes('满级'), 'max-level members should not show a next-level threshold');
    assert.ok(card.includes('width:100%'), 'max-level xp bar should render full');
  });
});
