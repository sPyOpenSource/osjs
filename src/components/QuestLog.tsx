import React, { useCallback } from 'react';
import { List, Check, Target, Award, Clock } from 'lucide-react';
import { Quest, QuestState } from '../types';
import { isQuestComplete, objectiveIsCompleted, questStatusLabel } from '../utils/quest';
import Button from './Button';

interface Props {
  quests: Quest[];
  states: QuestState[];
  onCompleteObjective?: (questId: string, objectiveId: string) => void;
}

function stateFor(questId: string, states: QuestState[]): QuestState {
  return states.find(s => s.questId === questId) ?? {
    questId,
    status: 'not_started',
    completedObjectiveIds: []
  };
}

function rewardLine(rewards: Quest['rewards']): string | null {
  const parts: string[] = [];
  if (rewards?.xp) parts.push(`经验 ${rewards.xp}`);
  if (rewards?.gold) parts.push(`黄金 ${rewards.gold.toLocaleString()}`);
  if (rewards?.grain) parts.push(`粮草 ${rewards.grain.toLocaleString()} 石`);
  if (rewards?.equipment) parts.push(`装备 ${rewards.equipment.name}`);
  if (rewards?.officerIds?.length) parts.push(`武将 ${rewards.officerIds.join('、')}`);
  return parts.length ? parts.join(' · ') : null;
}

export default function QuestLog({ quests, states, onCompleteObjective }: Props) {
  const handleCompleteObjective = useCallback(
    (questId: string, objectiveId: string) => {
      onCompleteObjective?.(questId, objectiveId);
    },
    [onCompleteObjective]
  );

  return (
    <section className="quest-log" aria-label="任务日志">
      <div className="quest-heading">
        <List size={18} />
        <h2>任务日志</h2>
        <span className="trade-muted">{quests.length} 个任务</span>
      </div>

      <div className="quest-list">
        {quests.map(quest => {
          const state = stateFor(quest.id, states);
          const completed = isQuestComplete(quest, state);
          const label = questStatusLabel(quest, state);
          const done = completed || state.status === 'completed';

          return (
            <article
              key={quest.id}
              className={`quest-card ${done ? 'quest-card-done' : ''}`}
              data-testid={`quest-card-${quest.id}`}
            >
              <header className="quest-card-header">
                <div className="quest-card-title">
                  <h3>{quest.title}</h3>
                  <span className={`quest-status ${state.status}`}>{label}</span>
                </div>
                {quest.cityId && (
                  <span className="trade-muted" title={`锚定城市：${quest.cityId}`}>
                    {quest.cityId}
                  </span>
                )}
              </header>
              <p className="quest-card-desc">{quest.description}</p>

              <div className="quest-objectives">
                <span className="trade-muted">目标</span>
                <ul className="quest-objective-list">
                  {quest.objectives.map(objective => {
                    const done = objectiveIsCompleted(state, objective.id);
                    return (
                      <li key={objective.id} className={`quest-objective ${done ? 'done' : ''}`}>
                        <Button
                          id={`quest-${quest.id}-obj-${objective.id}`}
                          data-testid={`quest-${quest.id}-obj-${objective.id}`}
                          aria-pressed={done}
                          onClick={() => handleCompleteObjective(quest.id, objective.id)}
                          className="quest-objective-button"
                        >
                          {done ? <Check size={14} /> : <Target size={14} />}
                          {objective.description}{done && ' （已完成）'}
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {quest.rewards && (
                <div className="quest-rewards">
                  <Award size={14} />
                  <span className="trade-muted">奖励</span>
                  <span className="trade-accent">{rewardLine(quest.rewards)}</span>
                </div>
              )}

              {!done && quest.rewards && !quest.objectives.some(o => !objectiveIsCompleted(state, o.id)) && (
                <Button id={`quest-submit-${quest.id}`} className="quest-submit-button">
                  <Clock size={14} /> 提交任务
                </Button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
