export interface Officer {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  styleName?: string; // e.g. "Xuande" for Liu Bei
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
