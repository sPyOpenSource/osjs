import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import { Quest, QuestState, QuestStatus } from '../types';
import {
  objectiveIsCompleted,
  isQuestComplete,
  completeObjective,
  markQuestCompleted,
  questStatusLabel,
  nextIncompleteObjective
} from './quest';

const quest: Quest = {
  id: 'q-demo',
  title: '示例任务',
  description: '用于单元测试的任务',
  objectives: [
    { id: 'obj-a', description: '目标 A' },
    { id: 'obj-b', description: '目标 B' },
    { id: 'obj-c', description: '目标 C' }
  ]
};

const emptyState: QuestState = { questId: 'q-demo', status: 'not_started', completedObjectiveIds: [] };

describe('quest progress', () => {
  test('objectiveIsCompleted is false before completion', () => {
    assert.equal(objectiveIsCompleted(emptyState, 'obj-a'), false);
  });

  test('completeObjective adds the objective id', () => {
    const next = completeObjective(quest, emptyState, 'obj-a');
    assert.ok(objectiveIsCompleted(next, 'obj-a'));
    assert.equal(next.completedObjectiveIds.length, 1);
    assert.deepEqual(next.completedObjectiveIds, ['obj-a']);
    assert.equal(next.status, 'not_started');
  });

  test('completeObjective is idempotent', () => {
    const once = completeObjective(quest, emptyState, 'obj-a');
    const twice = completeObjective(quest, once, 'obj-a');
    assert.strictEqual(twice, once, 're-completing returns the same reference');
    assert.deepEqual(twice.completedObjectiveIds, ['obj-a']);
  });

  test('completing an unknown objective is ignored', () => {
    const next = completeObjective(quest, emptyState, 'no-such-objective');
    assert.strictEqual(next, emptyState);
  });

  test('isQuestComplete is false when partial', () => {
    const partial = completeObjective(quest, emptyState, 'obj-a');
    assert.equal(isQuestComplete(quest, partial), false);
  });

  test('isQuestComplete is true when all objectives done', () => {
    let state = emptyState;
    state = completeObjective(quest, state, 'obj-a');
    state = completeObjective(quest, state, 'obj-b');
    state = completeObjective(quest, state, 'obj-c');
    assert.equal(isQuestComplete(quest, state), true);
  });

  test('markQuestCompleted flips status to completed', () => {
    const next = markQuestCompleted(emptyState);
    assert.equal(next.status, 'completed');
    assert.equal(next.completedObjectiveIds.length, 0);
  });

  test('questStatusLabel reflects progress', () => {
    assert.equal(questStatusLabel(quest, emptyState), '未开始');

    let state = completeObjective(quest, emptyState, 'obj-a');
    assert.equal(questStatusLabel(quest, state), '进行中');

    state = completeObjective(quest, state, 'obj-b');
    assert.equal(questStatusLabel(quest, state), '进行中');

    state = completeObjective(quest, state, 'obj-c');
    assert.equal(questStatusLabel(quest, state), '可提交');

    const failed: QuestState = { questId: 'q-demo', status: 'failed', completedObjectiveIds: [] };
    assert.equal(questStatusLabel(quest, failed), '失败');

    const done: QuestState = { questId: 'q-demo', status: 'completed', completedObjectiveIds: ['obj-a'] };
    assert.equal(questStatusLabel(quest, done), '已完成');
  });

  test('nextIncompleteObjective returns the first pending objective', () => {
    assert.deepEqual(nextIncompleteObjective(quest, emptyState), { id: 'obj-a', description: '目标 A' });

    const state = completeObjective(quest, emptyState, 'obj-a');
    assert.deepEqual(nextIncompleteObjective(quest, state), { id: 'obj-b', description: '目标 B' });

    const full = markQuestCompleted(completeObjective(quest, completeObjective(quest, completeObjective(quest, emptyState, 'obj-a'), 'obj-b'), 'obj-c'));
    assert.equal(nextIncompleteObjective(quest, full), null);
  });
});
