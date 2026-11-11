import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import RecruitPool from '../RecruitPool';
import { Officer } from '../../types';

function makeOfficer(id: string, name: string, factionId: string): Officer {
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
    stats: { leadership: 50, force: 90, intelligence: 50, politics: 50, charisma: 50 },
    traits: [],
    skills: [],
    biography: '',
  };
}

const officers = [makeOfficer('caocao', '曹操', 'wei'), makeOfficer('sunquan', '孙权', 'wu')];

describe('RecruitPool', () => {
  test('renders a recruit card per officer with recruit button', () => {
    const html = renderToStaticMarkup(<RecruitPool officers={officers} atLimit={false} onRecruit={() => {}} />);
    assert.ok(html.includes('data-testid="btn-recruit-caocao"'));
    assert.ok(html.includes('data-testid="btn-recruit-sunquan"'));
    assert.ok(html.includes('招募'));
  });

  test('disables recruit buttons when atLimit is true', () => {
    const html = renderToStaticMarkup(<RecruitPool officers={officers} atLimit={true} onRecruit={() => {}} />);
    assert.ok(html.includes('disabled'));
  });

  test('shows empty state when no officers', () => {
    const html = renderToStaticMarkup(<RecruitPool officers={[]} atLimit={false} onRecruit={() => {}} />);
    assert.ok(html.includes('无可招募武将'));
  });
});
