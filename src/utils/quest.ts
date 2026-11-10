import { Quest, QuestState } from '../types';

/** Whether a single objective has been marked complete in this save state. */
export function objectiveIsCompleted(state: QuestState, objectiveId: string): boolean {
  return state.completedObjectiveIds.includes(objectiveId);
}

/** Whether every objective of the quest has been completed in this save state. */
export function isQuestComplete(quest: Quest, state: QuestState): boolean {
  return quest.objectives.every(objective => objectiveIsCompleted(state, objective.id));
}

/** Mark an objective complete. Idempotent — re-completing is a no-op.
 *  Unknown objective ids (not belonging to the quest) are ignored. */
export function completeObjective(quest: Quest, state: QuestState, objectiveId: string): QuestState {
  if (!quest.objectives.some(objective => objective.id === objectiveId)) return state;
  if (objectiveIsCompleted(state, objectiveId)) return state;
  return {
    ...state,
    completedObjectiveIds: [...state.completedObjectiveIds, objectiveId]
  };
}

/** Mark the whole quest as completed (all objectives implied). */
export function markQuestCompleted(state: QuestState): QuestState {
  return { ...state, status: 'completed' };
}

/** Human-readable status label for a quest in this save state. */
export function questStatusLabel(quest: Quest, state: QuestState): string {
  if (state.status === 'completed') return '已完成';
  if (state.status === 'failed') return '失败';
  if (isQuestComplete(quest, state)) return '可提交';
  if (state.completedObjectiveIds.length > 0) return '进行中';
  return '未开始';
}

/** The first incomplete objective, or null when the quest is fully complete. */
export function nextIncompleteObjective(quest: Quest, state: QuestState): { id: string; description: string } | null {
  for (const objective of quest.objectives) {
    if (!objectiveIsCompleted(state, objective.id)) return objective;
  }
  return null;
}
