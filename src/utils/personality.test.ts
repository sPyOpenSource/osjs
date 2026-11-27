import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCharacterChatSystemInstruction,
  deriveOfficerPersonality,
  formatOfficerRelationshipsSummary,
  getSpotlightOfficerCandidates,
  pickNonSelfOfficer,
} from './personality';
import { FAMOUS_OFFICERS, FAMOUS_RELATIONSHIPS, SCENARIOS } from '../data';
import { Officer } from '../types';

describe('officer personality & AI chat prompt builder', () => {
  test('derives distinct signature personalities for contrasting historical figures', () => {
    const lubu = FAMOUS_OFFICERS.find(o => o.id === 'lubu')!;
    const zhuge = FAMOUS_OFFICERS.find(o => o.id === 'zhugeliang')!;
    const caocao = FAMOUS_OFFICERS.find(o => o.id === 'caocao')!;
    const einstein = FAMOUS_OFFICERS.find(o => o.id === 'einstein')!;

    const lubuProfile = deriveOfficerPersonality(lubu);
    const zhugeProfile = deriveOfficerPersonality(zhuge);
    const caocaoProfile = deriveOfficerPersonality(caocao);
    const einsteinProfile = deriveOfficerPersonality(einstein);

    assert.notEqual(lubuProfile.archetypeLabel, zhugeProfile.archetypeLabel);
    assert.equal(lubuProfile.selfPronoun, '本将');
    assert.equal(zhugeProfile.selfPronoun, '亮');
    assert.equal(caocaoProfile.selfPronoun, '孤');
    assert.ok(einsteinProfile.archetypeLabel.includes('智者'));
    assert.ok(lubuProfile.starterPrompts.some(p => p.includes('方天画戟')));
  });

  test('dynamically derives appropriate personalities for custom officers from stats and traits', () => {
    const fierceCustom: Officer = {
      id: 'custom_warrior',
      name: '高宠',
      gender: 'Male',
      factionId: 'shu',
      avatarStyle: {
        hairColor: '#000',
        hairStyle: 'Topknot',
        armorColor: '#f00',
        accessory: 'Spear',
        expression: 'Fierce Roaring',
        bgGradient: '',
      },
      stats: { leadership: 82, force: 97, intelligence: 48, politics: 35, charisma: 65 },
      traits: [],
      skills: ['突击'],
      biography: '勇冠三军',
    };

    const scholarCustom: Officer = {
      ...fierceCustom,
      id: 'custom_scholar',
      name: '陈宫',
      stats: { leadership: 78, force: 52, intelligence: 94, politics: 86, charisma: 74 },
      avatarStyle: { ...fierceCustom.avatarStyle, expression: 'Serene Wisdom' },
      biography: '智谋之士',
    };

    const fierceProfile = deriveOfficerPersonality(fierceCustom);
    const scholarProfile = deriveOfficerPersonality(scholarCustom);

    assert.ok(fierceProfile.archetypeLabel.includes('虎将'));
    assert.equal(fierceProfile.selfPronoun, '俺');
    assert.ok(scholarProfile.archetypeLabel.includes('智士'));
    assert.equal(scholarProfile.selfPronoun, '在下');
  });

  test('includes relationships and campaign context inside character system instruction', () => {
    const guanyu = FAMOUS_OFFICERS.find(o => o.id === 'guanyu')!;
    const rels = formatOfficerRelationshipsSummary(guanyu.id, FAMOUS_OFFICERS, FAMOUS_RELATIONSHIPS);
    assert.ok(rels.some(r => r.includes('刘备')));

    const instruction = buildCharacterChatSystemInstruction({
      officer: guanyu,
      factionName: '蜀汉',
      scenario: SCENARIOS[0],
      currentCityName: '荆州',
      timestampLabel: '公元 190 年 · 5 月 · 上旬',
      seasonName: '夏',
      playerGold: 2200,
      protagonistName: '刘备',
      relationshipsSummary: rels,
    });

    assert.ok(instruction.includes('【关羽】'));
    assert.ok(instruction.includes('关某'));
    assert.ok(instruction.includes('荆州'));
    assert.ok(instruction.includes('刘备'));
    assert.ok(instruction.includes('严禁跳出角色'));
  });

  test('excludes protagonist from spotlight candidates and avoids selecting self', () => {
    const candidates = getSpotlightOfficerCandidates(FAMOUS_OFFICERS, 'liubei');
    assert.ok(!candidates.some(o => o.id === 'liubei'), 'expected protagonist liubei excluded');
    assert.ok(candidates.some(o => o.id === 'guanyu'), 'expected other officers retained');

    const pickedWhenSelfPreferred = pickNonSelfOfficer(FAMOUS_OFFICERS, 'liubei', 'liubei');
    assert.ok(pickedWhenSelfPreferred && pickedWhenSelfPreferred.id !== 'liubei');
    assert.equal(pickedWhenSelfPreferred?.factionId, 'shu');

    const pickedSpecific = pickNonSelfOfficer(FAMOUS_OFFICERS, 'liubei', 'lubu');
    assert.equal(pickedSpecific?.id, 'lubu');
  });
});
