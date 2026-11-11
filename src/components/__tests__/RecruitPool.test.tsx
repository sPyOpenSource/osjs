import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import RecruitPool from '../RecruitPool';
import { Officer } from '../../types';

function makeOfficer(id: string, name: string, factionId: string, force = 90): Officer {
  return {
    id,
    name,
    gender: 'Male',
    factionId,
    avatarStyle: {
      hairColor: '#000',
      hairStyle: 'short',
      armorColor: '#000',
      accessory: 'none',
      expression: 'calm',
      bgGradient: 'none',
    },
    stats: { leadership: 50, force, intelligence: 50, politics: 50, charisma: 50 },
    traits: [],
    skills: [],
    biography: '',
  };
}

function buttonTag(html: string, officerId: string): string {
  const match = html.match(new RegExp(`<button[^>]*data-testid="btn-recruit-${officerId}"[^>]*>`));
  assert.ok(match, `expected a recruit button for ${officerId} in markup`);
  return match[0];
}

function cardFor(html: string, officerId: string): string {
  const match = html.match(
    new RegExp(`<li[^>]*data-testid="recruit-card-${officerId}"[^>]*>([\\s\\S]*?)</li>`),
  );
  assert.ok(match, `expected a recruit card for ${officerId} in markup`);
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

const officers = [makeOfficer('caocao', '曹操', 'wei'), makeOfficer('sunquan', '孙权', 'wu')];

describe('RecruitPool', () => {
  test('renders one recruit card and button per officer', () => {
    const html = renderToStaticMarkup(<RecruitPool officers={officers} atLimit={false} onRecruit={() => {}} />);
    assert.ok(html.includes('data-testid="recruit-card-caocao"'));
    assert.ok(html.includes('data-testid="recruit-card-sunquan"'));
    assert.equal((html.match(/data-testid="btn-recruit-/g) ?? []).length, 2);
    assert.ok(html.includes('招募'));
  });

  test('shows faction name, top stat value and grade on each card', () => {
    const html = renderToStaticMarkup(<RecruitPool officers={officers} atLimit={false} onRecruit={() => {}} />);
    const caocao = cardFor(html, 'caocao');
    assert.ok(caocao.includes('曹魏'));
    assert.ok(caocao.includes('武力'));
    assert.ok(caocao.includes('>90<'));
    assert.ok(caocao.includes('>A<'));

    const lowForce = renderToStaticMarkup(
      <RecruitPool officers={[makeOfficer('nobody', '无名', 'wu', 40)]} atLimit={false} onRecruit={() => {}} />,
    );
    assert.ok(cardFor(lowForce, 'nobody').includes('>D<'));
  });

  test('falls back to the raw faction id for unknown factions', () => {
    const html = renderToStaticMarkup(
      <RecruitPool officers={[makeOfficer('x', '某人', 'atlantis')]} atLimit={false} onRecruit={() => {}} />,
    );
    assert.ok(cardFor(html, 'x').includes('atlantis'));
  });

  test('disables every recruit button when atLimit is true and explains why', () => {
    const html = renderToStaticMarkup(<RecruitPool officers={officers} atLimit={true} onRecruit={() => {}} />);
    for (const id of ['caocao', 'sunquan']) {
      assert.match(buttonTag(html, id), / disabled=""/);
    }
    assert.ok(html.includes('同伴已满（8/8）'));
  });

  test('leaves recruit buttons enabled when under the limit', () => {
    const html = renderToStaticMarkup(<RecruitPool officers={officers} atLimit={false} onRecruit={() => {}} />);
    for (const id of ['caocao', 'sunquan']) {
      assert.doesNotMatch(buttonTag(html, id), / disabled=""/);
    }
    assert.ok(!html.includes('同伴已满（8/8）'));
  });

  test('recruit button invokes onRecruit with the officer id', () => {
    // renderToStaticMarkup drops event handlers, so drive the component tree directly.
    const calls: string[] = [];
    const tree = RecruitPool({ officers, atLimit: false, onRecruit: (id) => calls.push(id) });
    const button = findElement(tree, 'btn-recruit-sunquan');
    assert.ok(button, 'recruit button element should exist');
    button.props.onClick();
    assert.deepEqual(calls, ['sunquan']);
  });

  test('shows empty state when no officers', () => {
    const html = renderToStaticMarkup(<RecruitPool officers={[]} atLimit={false} onRecruit={() => {}} />);
    assert.ok(html.includes('无可招募武将'));
  });
});
