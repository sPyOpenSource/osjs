import { Quest, QuestState, QuestStatus } from '../types';
import { Equipment } from '../types';

/**
 * Static quest definitions. Progress lives in QuestState (see src/utils/quest.ts).
 * Never put `status` or `completed` here — that is per-save runtime data.
 */

export const MAIN_QUESTS: Quest[] = [
  {
    id: 'quest-coalition',
    title: '讨伐董卓',
    description: '联合诸侯，讨伐暴虐的董卓，夺回京都洛阳，救出天子。',
    objectives: [{ id: 'o1', description: '夺取洛阳' }],
    rewards: { xp: 500, gold: 1000 },
    cityId: 'luoyang'
  },
  {
    id: 'quest-jingzhou',
    title: '争夺荆州',
    description: '荆州地扼要，是进可攻退可守的要地。将其纳入囊中，方可南征北战。',
    objectives: [{ id: 'o1', description: '夺取荆州' }],
    rewards: { xp: 700, gold: 1500 },
    cityId: 'jingzhou'
  },
  {
    id: 'quest-changan',
    title: '攻克长安',
    description: '长安乃古都，控制长安即控制北方诸郡，一统天下指日可待。',
    objectives: [{ id: 'o1', description: '攻克长安' }],
    rewards: { xp: 900, gold: 2000 },
    cityId: 'changan'
  }
];

export const SIDE_QUESTS: Quest[] = [
  {
    id: 'side-recruit-guanyu',
    title: '招募关羽',
    description: '美髯公关羽义薄云天，愿追随明主。前往成都与他会面。',
    objectives: [{ id: 'o1', description: '与关羽会面并招募' }],
    rewards: { officerIds: ['guanyu'] },
    cityId: 'chengdu'
  },
  {
    id: 'side-supply-grain',
    title: '筹集军粮',
    description: '前线缺粮，亟需增储。在许昌筹集 500 石军粮。',
    objectives: [{ id: 'o1', description: '筹集 500 石军粮' }],
    rewards: { grain: 500, xp: 200 },
    cityId: 'xuchang'
  },
  {
    id: 'side-equipment-zhouyu',
    title: '寻访神兵',
    description: '东吴都督周瑜手持一件宝剑，可赐予有缘人。前往建业寻访。',
    objectives: [{ id: 'o1', description: '向周瑜寻访宝剑' }],
    rewards: {
      equipment: {
        id: 'equip-green-dragon-blade',
        name: '青龙偃月刀',
        slot: 'weapon',
        statBonuses: { force: 8, leadership: 5 },
        skillBonuses: ['green-dragon-cleave']
      },
      xp: 300
    },
    cityId: 'jianye'
  }
];

/** All quests, main first then side. */
export const ALL_QUESTS: Quest[] = [...MAIN_QUESTS, ...SIDE_QUESTS];

/** Initial per-save quest state: main quests start active, side quests not started. */
export const INITIAL_QUEST_STATES: QuestState[] = [
  ...MAIN_QUESTS.map(q => ({ questId: q.id, status: 'active' as QuestStatus, completedObjectiveIds: [] })),
  ...SIDE_QUESTS.map(q => ({ questId: q.id, status: 'not_started' as QuestStatus, completedObjectiveIds: [] }))
];
