export interface Troop {
  id: string;
  name: string;
  type: "elixir" | "dark_elixir";
  housingSpace: number;
  trainingTime: number; // in seconds
  cost: number; // in resources
  imageUrl: string; // fallback style info
  category: "ground" | "air";
}

export interface Spell {
  id: string;
  name: string;
  type: "elixir" | "dark_elixir";
  housingSpace: number;
  trainingTime: number; // in seconds
  cost: number;
}

export interface Hero {
  id: string;
  name: string;
  unlockedAtTh: number;
}

export interface ArmyPreset {
  name: string;
  troops: { [troopId: string]: number };
  spells: { [spellId: string]: number };
  heroes: { [heroId: string]: boolean };
  description: string;
}

export interface PlaybookResponse {
  strategyName: string;
  overview: string;
  phase1Funnel: {
    objective: string;
    stepByStep: string[];
    troopAllocation: string;
  };
  phase2Entry: {
    entryAngle: string;
    siegeUsage: string;
    stepByStep: string[];
  };
  phase3SpellsHeroes: {
    spellTiming: string;
    heroAbilities: string;
    cleanupAction: string;
  };
  threatsAndCounters: {
    clanCastle: string;
    highThreatBuildings: string[];
    backupPlan: string;
  };
}
