import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import PartyConsole from '../PartyConsole';
import PartyRoster from '../PartyRoster';
import RecruitPool from '../RecruitPool';
import { Equipment, Officer, Party, RpgCharacter } from '../../types';

function makeOfficer(id: string, name: string, overrides: Partial<Officer> = {}): Officer {
  return {
    id,
    name,
    gender: 'Male',
    factionId: 'shu',
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

function makeChar(officerId: string, skillPoints = 0): RpgCharacter {
  return { officerId, level: 1, xp: 0, skillPoints, learnedSkills: [], equipment: {} };
}

const COMPANIONS = ['guanyu', 'zhangfei', 'zhaoyun', 'machao'];

const officers: Officer[] = [
  makeOfficer('liubei', '刘备'),
  ...COMPANIONS.map(id => makeOfficer(id, id)),
  makeOfficer('caocao', '曹操', { factionId: 'wei' }),
];

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
    <PartyConsole
      party={overrides.party ?? { protagonistId: 'liubei', companionIds: ['guanyu'] }}
      characters={overrides.characters ?? { liubei: makeChar('liubei', 2) }}
      officers={overrides.officers ?? officers}
      availableEquipment={overrides.availableEquipment ?? []}
      onRecruit={noop}
      onDismiss={noop}
      onSpendSkillPoint={noop}
      onEquip={noop}
    />,
  );
}

/**
 * Split the console markup into its two panes. The roster pane precedes the
 * recruit pane, so a prefix slice keeps nested elements out of the extraction.
 */
function panes(html: string): { roster: string; recruit: string } {
  const rosterIdx = html.indexOf('data-testid="party-console-roster"');
  const recruitIdx = html.indexOf('data-testid="party-console-recruit"');
  assert.ok(rosterIdx >= 0, 'expected a roster pane');
  assert.ok(recruitIdx >= 0, 'expected a recruit pane');
  assert.ok(rosterIdx < recruitIdx, 'roster pane should precede recruit pane');
  return { roster: html.slice(rosterIdx, recruitIdx), recruit: html.slice(recruitIdx) };
}

function buttonTag(html: string, testId: string): string {
  const match = html.match(new RegExp(`<button[^>]*data-testid="${testId}"[^>]*>`));
  assert.ok(match, `expected a button with data-testid="${testId}" in markup`);
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

function findByType(node: any, type: unknown): any {
  if (!node || typeof node !== 'object') return null;
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findByType(child, type);
      if (found) return found;
    }
    return null;
  }
  if (node.type === type) return node;
  const children = node.props?.children;
  const list = Array.isArray(children) ? children : children ? [children] : [];
  for (const child of list) {
    const found = findByType(child, type);
    if (found) return found;
  }
  return null;
}

describe('PartyConsole', () => {
  test('renders both panes and keeps member cards in the roster pane only', () => {
    const html = render();
    const { roster, recruit } = panes(html);

    assert.ok(html.includes('class="party-console"'));
    assert.ok(html.includes('aria-label="队伍控制台"'));
    assert.ok(roster.includes('data-testid="party-card-liubei"'));
    assert.ok(roster.includes('data-testid="party-card-guanyu"'));
    assert.ok(!recruit.includes('data-testid="party-card-liubei"'));
    assert.ok(!recruit.includes('data-testid="party-card-guanyu"'));
    assert.ok(recruit.includes('招募同伴'));
  });

  test('lists only non-members in the recruitable pool', () => {
    const html = render();
    const { recruit } = panes(html);

    assert.ok(recruit.includes('data-testid="btn-recruit-caocao"'));
    assert.ok(!recruit.includes('data-testid="btn-recruit-guanyu"'));
    assert.ok(!recruit.includes('data-testid="btn-recruit-liubei"'));
    assert.ok(!html.includes('data-testid="btn-recruit-liubei"'));
    assert.ok(!html.includes('data-testid="btn-recruit-guanyu"'));
  });

  test('shows the companion counter and updates it for a full party', () => {
    assert.ok(panes(render()).recruit.includes('同伴 1/4'));

    const full = render({ party: { protagonistId: 'liubei', companionIds: [...COMPANIONS] } });
    assert.ok(panes(full).recruit.includes('同伴 4/4'));
  });

  test('disables every recruit button at the limit and keeps members out of the pool', () => {
    const html = render({ party: { protagonistId: 'liubei', companionIds: [...COMPANIONS] } });
    const { recruit } = panes(html);

    assert.match(buttonTag(recruit, 'btn-recruit-caocao'), / disabled=""/);
    for (const id of ['liubei', ...COMPANIONS]) {
      assert.ok(!html.includes(`data-testid="btn-recruit-${id}"`), `${id} should not be recruitable`);
    }
    // The limit message belongs to RecruitPool only; the console must not duplicate it.
    assert.equal((html.match(/同伴已满/g) ?? []).length, 1);
  });

  test('shows the pool empty message when every officer is a member', () => {
    const html = render({
      party: { protagonistId: 'liubei', companionIds: ['guanyu', 'caocao'] },
      officers: [officers[0], officers[1], officers[officers.length - 1]],
    });
    assert.ok(panes(html).recruit.includes('无可招募武将'));
    assert.ok(!html.includes('btn-recruit-'));
  });

  test('recruit click passes through to onRecruit with the officer id', () => {
    // renderToStaticMarkup drops event handlers, so drive the component tree directly.
    // NOTE: direct invocation only works while PartyConsole stays hook-free; if hooks are
    // added, switch these wiring tests to a DOM renderer.
    const calls: string[] = [];
    const tree = PartyConsole({
      party: { protagonistId: 'liubei', companionIds: ['guanyu'] },
      characters: { liubei: makeChar('liubei', 2) },
      officers,
      availableEquipment: [],
      onRecruit: id => calls.push(id),
      onDismiss: noop,
      onSpendSkillPoint: noop,
      onEquip: noop,
    });

    const pool = findByType(tree, RecruitPool);
    assert.ok(pool, 'recruit pool element should exist');
    assert.deepEqual(pool.props.officers.map((officer: Officer) => officer.id), ['zhangfei', 'zhaoyun', 'machao', 'caocao']);
    assert.equal(pool.props.atLimit, false);

    const button = findElement(RecruitPool(pool.props), 'btn-recruit-caocao');
    assert.ok(button, 'recruit button element should exist');
    button.props.onClick();
    assert.deepEqual(calls, ['caocao']);
  });

  test('roster learn click still reaches onSpendSkillPoint', () => {
    const calls: [string, string][] = [];
    const tree = PartyConsole({
      party: { protagonistId: 'liubei', companionIds: ['guanyu'] },
      characters: { liubei: makeChar('liubei', 2) },
      officers,
      availableEquipment: [],
      onRecruit: noop,
      onDismiss: noop,
      onSpendSkillPoint: (officerId, skillId) => calls.push([officerId, skillId]),
      onEquip: noop,
    });

    const roster = findByType(tree, PartyRoster);
    assert.ok(roster, 'roster element should exist');

    const button = findElement(PartyRoster(roster.props), 'party-spend-liubei');
    assert.ok(button, 'learn button element should exist');
    button.props.onClick();
    assert.deepEqual(calls, [['liubei', 'skill-lv1']]);
  });

  test('marks the pool as at the limit when all companion slots are used', () => {
    const tree = PartyConsole({
      party: { protagonistId: 'liubei', companionIds: [...COMPANIONS] },
      characters: {},
      officers,
      availableEquipment: [],
      onRecruit: noop,
      onDismiss: noop,
      onSpendSkillPoint: noop,
      onEquip: noop,
    });
    const pool = findByType(tree, RecruitPool);
    assert.ok(pool);
    assert.equal(pool.props.atLimit, true);
  });
});
