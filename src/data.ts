import { Troop, Spell, Hero, ArmyPreset } from "./types";

export const TROOPS_DATA: Troop[] = [
  // Elixir Troops
  { id: "barbarian", name: "Barbarian", type: "elixir", housingSpace: 1, trainingTime: 5, cost: 150, category: "ground", imageUrl: "⚔️" },
  { id: "archer", name: "Archer", type: "elixir", housingSpace: 1, trainingTime: 6, cost: 300, category: "ground", imageUrl: "🏹" },
  { id: "giant", name: "Giant", type: "elixir", housingSpace: 5, trainingTime: 30, cost: 1500, category: "ground", imageUrl: "✊" },
  { id: "wall_breaker", name: "Wall Breaker", type: "elixir", housingSpace: 2, trainingTime: 15, cost: 2000, category: "ground", imageUrl: "💣" },
  { id: "balloon", name: "Balloon", type: "elixir", housingSpace: 5, trainingTime: 30, cost: 2500, category: "air", imageUrl: "🎈" },
  { id: "wizard", name: "Wizard", type: "elixir", housingSpace: 4, trainingTime: 30, cost: 3000, category: "ground", imageUrl: "⚡" },
  { id: "healer", name: "Healer", type: "elixir", housingSpace: 14, trainingTime: 120, cost: 5000, category: "air", imageUrl: "👼" },
  { id: "dragon", name: "Dragon", type: "elixir", housingSpace: 20, trainingTime: 180, cost: 18000, category: "air", imageUrl: "🐉" },
  { id: "pekka", name: "P.E.K.K.A", type: "elixir", housingSpace: 25, trainingTime: 180, cost: 21000, category: "ground", imageUrl: "🤖" },
  { id: "baby_dragon", name: "Baby Dragon", type: "elixir", housingSpace: 10, trainingTime: 90, cost: 10000, category: "air", imageUrl: "🦖" },
  { id: "miner", name: "Miner", type: "elixir", housingSpace: 6, trainingTime: 30, cost: 4000, category: "ground", imageUrl: "⛏️" },
  { id: "electro_dragon", name: "Electro Dragon", type: "elixir", housingSpace: 30, trainingTime: 360, cost: 32000, category: "air", imageUrl: "⚡🐉" },
  { id: "yeti", name: "Yeti", type: "elixir", housingSpace: 18, trainingTime: 180, cost: 20000, category: "ground", imageUrl: "❄️👹" },
  
  // Dark Elixir Troops
  { id: "hog_rider", name: "Hog Rider", type: "dark_elixir", housingSpace: 5, trainingTime: 45, cost: 60, category: "ground", imageUrl: "🐗" },
  { id: "valkyrie", name: "Valkyrie", type: "dark_elixir", housingSpace: 8, trainingTime: 90, cost: 120, category: "ground", imageUrl: "🪓" },
  { id: "golem", name: "Golem", type: "dark_elixir", housingSpace: 30, trainingTime: 300, cost: 450, category: "ground", imageUrl: "🪨" },
  { id: "witch", name: "Witch", type: "dark_elixir", housingSpace: 12, trainingTime: 120, cost: 250, category: "ground", imageUrl: "🔮" },
  { id: "lava_hound", name: "Lava Hound", type: "dark_elixir", housingSpace: 30, trainingTime: 300, cost: 500, category: "air", imageUrl: "🐕‍🦺🌋" },
  { id: "bowler", name: "Bowler", type: "dark_elixir", housingSpace: 6, trainingTime: 60, cost: 180, category: "ground", imageUrl: "🔵" },
  { id: "ice_golem", name: "Ice Golem", type: "dark_elixir", housingSpace: 15, trainingTime: 180, cost: 220, category: "ground", imageUrl: "🥶🪨" },
  { id: "root_rider", name: "Root Rider", type: "dark_elixir", housingSpace: 20, trainingTime: 240, cost: 400, category: "ground", imageUrl: "🪵🏇" }
];

export const SPELLS_DATA: Spell[] = [
  // Elixir Spells
  { id: "lightning", name: "Lightning Spell", type: "elixir", housingSpace: 1, trainingTime: 180, cost: 1500 },
  { id: "healing", name: "Healing Spell", type: "elixir", housingSpace: 2, trainingTime: 360, cost: 8000 },
  { id: "rage", name: "Rage Spell", type: "elixir", housingSpace: 2, trainingTime: 360, cost: 15000 },
  { id: "jump", name: "Jump Spell", type: "elixir", housingSpace: 2, trainingTime: 360, cost: 12000 },
  { id: "freeze", name: "Freeze Spell", type: "elixir", housingSpace: 1, trainingTime: 180, cost: 4000 },
  { id: "clone", name: "Clone Spell", type: "elixir", housingSpace: 3, trainingTime: 540, cost: 25000 },
  { id: "invisibility", name: "Invisibility Spell", type: "elixir", housingSpace: 1, trainingTime: 180, cost: 6000 },

  // Dark Elixir Spells
  { id: "poison", name: "Poison Spell", type: "dark_elixir", housingSpace: 1, trainingTime: 180, cost: 95 },
  { id: "earthquake", name: "Earthquake Spell", type: "dark_elixir", housingSpace: 1, trainingTime: 180, cost: 120 },
  { id: "haste", name: "Haste Spell", type: "dark_elixir", housingSpace: 1, trainingTime: 180, cost: 80 },
  { id: "bat", name: "Bat Spell", type: "dark_elixir", housingSpace: 1, trainingTime: 180, cost: 150 }
];

export const HEROES_DATA: Hero[] = [
  { id: "barbarian_king", name: "Barbarian King", unlockedAtTh: 7 },
  { id: "archer_queen", name: "Archer Queen", unlockedAtTh: 9 },
  { id: "grand_warden", name: "Grand Warden", unlockedAtTh: 11 },
  { id: "royal_champion", name: "Royal Champion", unlockedAtTh: 13 }
];

// Presets by Town Hall 11+ Strategy Standards
export const ARMY_PRESETS: ArmyPreset[] = [
  {
    name: "Queen Charge Hybrid",
    description: "Classic tactical hybrid composed of Miners and Hog Riders. The Archer Queen performs a heavy entry charge to destroy key splash targets.",
    troops: {
      healer: 5,
      miner: 12,
      hog_rider: 10,
      wall_breaker: 3,
      wizard: 2,
      baby_dragon: 1,
      archer: 2,
      balloon: 2
    },
    spells: {
      heal: 2,
      rage: 2,
      freeze: 1,
      poison: 1
    },
    heroes: {
      barbarian_king: true,
      archer_queen: true,
      grand_warden: true,
      royal_champion: true
    }
  },
  {
    name: "Electro Dragon Rush",
    description: "High housing-space destruction power. Electro Dragons use chaining lightning on clustered bases, supported by Rage and Freeze spells.",
    troops: {
      electro_dragon: 7,
      balloon: 8,
      baby_dragon: 1
    },
    spells: {
      rage: 3,
      freeze: 4,
      poison: 1
    },
    heroes: {
      barbarian_king: true,
      archer_queen: true,
      grand_warden: true,
      royal_champion: true
    }
  },
  {
    name: "Zap Witch Golem",
    description: "Devastating on single-target inferno layouts. Golems distract while Witches summon hordes of skeletons. Lightning breaks splash mortars/infernos.",
    troops: {
      golem: 3,
      witch: 12,
      wall_breaker: 2,
      wizard: 2
    },
    spells: {
      lightning: 8,
      earthquake: 2,
      poison: 1
    },
    heroes: {
      barbarian_king: true,
      archer_queen: true,
      grand_warden: true,
      royal_champion: false
    }
  },
  {
    name: "LavaLoon & Queen Charge",
    description: "Highly technical surgical air strategy designed to bypass walls completely. Lavahounds trigger traps and distract, allowing balloons to sweep.",
    troops: {
      lava_hound: 2,
      balloon: 24,
      healer: 5,
      wall_breaker: 2,
      archer: 4
    },
    spells: {
      rage: 2,
      haste: 4,
      freeze: 2,
      poison: 1
    },
    heroes: {
      barbarian_king: true,
      archer_queen: true,
      grand_warden: true,
      royal_champion: true
    }
  },
  {
    name: "Yeti & Bowler Smash",
    description: "Deep compartment ground strategy. Massive Yeti-mites break defense clusters while Bowlers clear out the backlines behind heroes.",
    troops: {
      yeti: 6,
      bowler: 8,
      healer: 5,
      wall_breaker: 2,
      giant: 1,
      wizard: 2
    },
    spells: {
      rage: 2,
      jump: 2,
      freeze: 1,
      poison: 1
    },
    heroes: {
      barbarian_king: true,
      archer_queen: true,
      grand_warden: true,
      royal_champion: true
    }
  }
];

export const TOWN_HALL_LIMITS: { [key: number]: { maxTroopsSpace: number; maxSpellsSpace: number } } = {
  7: { maxTroopsSpace: 200, maxSpellsSpace: 6 },
  8: { maxTroopsSpace: 200, maxSpellsSpace: 7 },
  9: { maxTroopsSpace: 220, maxSpellsSpace: 9 },
  10: { maxTroopsSpace: 240, maxSpellsSpace: 11 },
  11: { maxTroopsSpace: 260, maxSpellsSpace: 11 },
  12: { maxTroopsSpace: 280, maxSpellsSpace: 11 },
  13: { maxTroopsSpace: 280, maxSpellsSpace: 11 },
  14: { maxTroopsSpace: 300, maxSpellsSpace: 11 },
  15: { maxTroopsSpace: 320, maxSpellsSpace: 11 },
  16: { maxTroopsSpace: 340, maxSpellsSpace: 11 }
};

export const BASE_STYLES = [
  { id: "ring", name: "Island & Ring Layout", description: "Empty ring channel separating core; heavy defense concentration inside central islands. Hard to funnel." },
  { id: "compartment", name: "High Segment Multi-Compartment", description: "Symmetric grid containing 12+ separate cells. Slows ground entry, vulnerable to Earthquake/Log Launchers." },
  { id: "diamond", name: "Asymmetric Diamond War Base", description: "Popular war configuration with Town Hall offset to protect 3-star vulnerability. Prone to split-funnel fails." },
  { id: "box", name: "Outer Edge Heavy Box Layout", description: "Bases having bulk defenses pushed to the external parameter. Easy to funnel but has high initial DPS." },
  { id: "unlocked", name: "Symmetric Anti-2 Star Star/Grid Layout", description: "Standard multiplayer grid with high core damage density, single-target infernos." }
];
