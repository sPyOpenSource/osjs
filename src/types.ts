export interface Officer {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  styleName?: string; // e.g. "Xuande" for Liu Bei
  englishName?: string; // e.g. "Julius Caesar", "Alexander the Great"
  origin?: string; // e.g. "罗马帝国 (大秦)", "马其顿帝国", "邪马台国"
  isGlobalLeader?: boolean; // True if world global leader
  factionId: string; // Faction aligning with
  avatarStyle: AvatarStyle;
  stats: OfficerStats;
  traits: string[]; // Personality or special traits
  skills: string[]; // Combat or tactical skills
  biography: string;
  custom?: boolean; // True if custom created
  advice?: string; // Gemini generated dynamic strategic/tactical gameplay advice
  promotionLevel?: number;
  promotionTitle?: string;
}

export interface OfficerStats {
  leadership: number; // LDR
  force: number;      // FOR
  intelligence: number; // INT
  politics: number;   // POL
  charisma: number;   // CHR
}

export interface AvatarStyle {
  hairColor: string;
  hairStyle: string;
  armorColor: string;
  accessory: string;
  expression: string;
  bgGradient: string;
  portrait?: string; // URL of a painted portrait image; when set, replaces the SVG avatar
}

export interface Faction {
  id: string;
  name: string;
  ruler: string;
  color: string; // Tailwind color class or hex
  description: string;
  crest: string; // Emoji symbols or short crest words
}

export interface CampaignScenario {
  id: string;
  title: string;
  year: number;
  description: string;
  featuredFactions: string[];
  victoryCondition: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface RelationshipRelation {
  fromOfficerId: string;
  toOfficerId: string;
  type: 'Sworn Brother' | 'Rival' | 'Spouse' | 'Lord' | 'Confidant' | 'Trust';
}

export type InternalTaskType = 'fortify' | 'agriculture' | 'drill' | 'patrol' | 'commerce';

export interface InternalTaskConfig {
  id: InternalTaskType;
  name: string;
  category: string;
  icon: string;
  tagline: string;
  description: string;
  coreAttributes: string;
  statWeights: {
    politics?: number;
    leadership?: number;
    force?: number;
    intelligence?: number;
    charisma?: number;
  };
  formulaDisplay: string;
  outputDescription: string;
}

export interface TaskAssignment {
  id: string;
  officerId: string;
  taskType: InternalTaskType;
  progress: number; // 0 to 100
  targetDays: number;
  completedCycles: number;
  lastOutputSummary?: string;
}

export interface CityAffairsState {
  cityName: string;
  governorOfficerId?: string;
  defense: number;
  maxDefense: number;
  grain: number;
  gold: number;
  troops: number;
  training: number;
  morale: number;
  order: number;
  agriculture: number;
  commerce: number;
}

export type QuestStatus = 'not_started' | 'active' | 'completed' | 'failed';

export type EquipmentSlot = 'weapon' | 'armor' | 'accessory';

export interface Equipment {
  id: string;
  name: string;
  slot: EquipmentSlot;
  statBonuses: Partial<OfficerStats>;
  skillBonuses: string[]; // Skills granted while this item is equipped
}

export interface RpgCharacter {
  officerId: string;
  level: number; // 1-based RPG level, distinct from Officer.promotionLevel
  xp: number; // XP accumulated within the current level; resets on level-up
  skillPoints: number;
  learnedSkills: string[]; // Skills acquired through leveling, additive to Officer.skills
  equipment: Partial<Record<EquipmentSlot, Equipment>>;
}

export interface Party {
  protagonistId: string;
  companionIds: string[];
}

export interface QuestObjective {
  id: string;
  description: string;
}

export interface QuestRewards {
  xp?: number;
  gold?: number;
  grain?: number;
  equipment?: Equipment;
  officerIds?: string[]; // Officers unlocked or recruited by the quest
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  objectives: QuestObjective[];
  rewards?: QuestRewards;
  /** Optional city this quest is anchored to for map markers. */
  cityId?: string;
}

export interface QuestState {
  questId: string;
  status: QuestStatus; // Per-save runtime state, not part of the static quest definition
  completedObjectiveIds: string[];
}
