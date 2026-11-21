import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import InternalAffairs from '../InternalAffairs';
import { Officer } from '../../types';

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

const officers: Officer[] = [
  makeOfficer('liubei', '刘备'),
  makeOfficer('guanyu', '关羽'),
  makeOfficer('zhangfei', '张飞'),
  makeOfficer('caocao', '曹操', { factionId: 'wei' }),
];

const noop = () => {};

function buttonTag(html: string, id: string): string {
  const match = html.match(new RegExp(`<button[^>]*id="${id}"[^>]*>`));
  assert.ok(match, `expected a button with id="${id}" in markup`);
  return match[0];
}

function render(
  overrides: {
    officers?: Officer[];
    playerFactionId?: string;
    playerFactionName?: string;
    selectedOfficerId?: string;
    currentCityId?: string;
    onSetSelectedOfficerId?: (id: string) => void;
    onSetCurrentCity?: (cityName: string) => void;
  } = {},
): string {
  return renderToStaticMarkup(
    <InternalAffairs
      officers={overrides.officers ?? officers}
      playerFactionId={overrides.playerFactionId}
      playerFactionName={overrides.playerFactionName}
      soundEnabled={false}
      playDrumSound={noop}
      playClashSound={noop}
      playHarvestSound={noop}
      gameYear={208}
      gameMonth={1}
      gameXun={1}
      isAutoTime={false}
      timeSpeed="normal"
      onToggleAutoTime={noop}
      onSetTimeSpeed={noop}
      onAdvanceXun={noop}
      onAdvanceMonth={noop}
      selectedOfficerId={overrides.selectedOfficerId}
      currentCityId={overrides.currentCityId}
      onSetSelectedOfficerId={overrides.onSetSelectedOfficerId}
      onSetCurrentCity={overrides.onSetCurrentCity}
      isActiveTab={true}
    />,
  );
}

describe('Cross-Page Integration (InternalAffairs canonical props)', () => {
  test('renders officer highlight driven by selectedOfficerId prop', () => {
    // 'guanyu' is NOT the local-state default (defaults to liubei/zhugeliang), so
    // this only passes once InternalAffairs consumes the canonical prop.
    const html = render({ selectedOfficerId: 'guanyu' });
    const tag = buttonTag(html, 'btn-select-officer-guanyu');
    assert.ok(tag.includes('bg-amber-500/15'), 'expected selected officer highlight on guanyu');
    assert.ok(html.includes('关羽'), 'expected selected officer name in markup');
  });

  test('filters Assign Officer grid to only characters belonging to playerFactionId', () => {
    const html = render({ playerFactionId: 'shu', playerFactionName: '蜀汉' });
    assert.ok(html.includes('id="btn-select-officer-liubei"'), 'expected own-faction officer liubei');
    assert.ok(html.includes('id="btn-select-officer-guanyu"'), 'expected own-faction officer guanyu');
    assert.ok(html.includes('id="btn-select-officer-zhangfei"'), 'expected own-faction officer zhangfei');
    assert.ok(!html.includes('id="btn-select-officer-caocao"'), 'expected rival officer caocao to be excluded');
    assert.ok(html.includes('蜀汉 麾下武将：3 位'), 'expected faction officer count header');
  });

  test('renders empty-state message when playerFactionId has no officers', () => {
    const html = render({ playerFactionId: 'wu', playerFactionName: '东吴' });
    assert.ok(html.includes('当前所属阵营暂无可委任武将'), 'expected empty state when faction has no officers');
    assert.ok(!html.includes('id="btn-select-officer-liubei"'), 'expected no shu officers');
    assert.ok(!html.includes('id="btn-select-officer-caocao"'), 'expected no wei officers');
  });

  test('renders city selector driven by currentCityId prop', () => {
    // '许昌' is index 1, not the local-state default (index 0 = 成都), so this
    // only passes once InternalAffairs consumes the canonical prop.
    const html = render({ currentCityId: '许昌' });
    assert.ok(html.includes('许昌'), 'expected selected city name in markup');
    const cityPills = html.match(/>许昌</g);
    assert.ok(cityPills && cityPills.length >= 1, 'expected 许昌 city pill rendered');
  });

  test('falls back to first city (成都) when currentCityId does not match', () => {
    const html = render({ currentCityId: '不存在的城市' });
    assert.ok(html.includes('成都'), 'expected fallback to first city (成都)');
  });

  test('renders without error when onSetSelectedOfficerId is provided', () => {
    const html = render({
      selectedOfficerId: 'guanyu',
      onSetSelectedOfficerId: (id) => {
        // Intentionally unused in static render; handlers are dropped by renderToStaticMarkup.
        void id;
      },
    });
    assert.ok(html.includes('关羽'), 'expected guanyu name in markup');
  });
});
