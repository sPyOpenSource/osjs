import { StructureTypeInfo, UnitTypeInfo, MapCell } from '../types';

export const STRUCTURES_DATA: Record<string, StructureTypeInfo[]> = {
  ALLIES: [
    {
      id: 'allied_const',
      name: 'Allied Construction Yard',
      cost: 3000,
      power: 0,
      buildTime: 0, // Master yard is auto-placed or already exists
      description: 'The heart of your operations. Unlocks Allied buildings.',
      icon: '🏗️',
      hp: 1000
    },
    {
      id: 'allied_power',
      name: 'Allied Power Plant',
      cost: 800,
      power: 150,
      buildTime: 5,
      description: 'Generates power. Power deficit slows down production.',
      icon: '⚡',
      hp: 500
    },
    {
      id: 'allied_ore',
      name: 'Ore Purifier & Refinery',
      cost: 2000,
      power: -50,
      buildTime: 10,
      description: 'Processes raw ore. Earns credits over time automatically.',
      icon: '🏭',
      hp: 800
    },
    {
      id: 'allied_barracks',
      name: 'Allied Barracks',
      cost: 500,
      power: -10,
      buildTime: 6,
      description: 'Trains GIs and elite infantry.',
      icon: '⛺',
      unlockedBy: ['allied_power'],
      hp: 600
    },
    {
      id: 'allied_war',
      name: 'Allied War Factory',
      cost: 2000,
      power: -25,
      buildTime: 12,
      description: 'Builds heavy armor, Prism Tanks, and reconnaissance vehicles.',
      icon: '🚜',
      unlockedBy: ['allied_ore', 'allied_barracks'],
      hp: 1000
    }
  ],
  SOVIETS: [
    {
      id: 'soviet_const',
      name: 'Soviet Construction Palace',
      cost: 3000,
      power: 0,
      buildTime: 0,
      description: 'Command center. Unlocks superior Soviet armor and Tesla systems.',
      icon: '🏰',
      hp: 1000
    },
    {
      id: 'soviet_power',
      name: 'Tesla Reactor',
      cost: 600,
      power: 120, // baseline
      buildTime: 4,
      description: 'High-voltage reactor. Provides fundamental Soviet electrical grids.',
      icon: '⚛️',
      hp: 400
    },
    {
      id: 'soviet_ore',
      name: 'Soviet Ore Ore-Miner Complex',
      cost: 1400,
      power: -40,
      buildTime: 9,
      description: 'Heavy metallurgy processes ore. Restores credits periodically.',
      icon: '🏛️',
      hp: 900
    },
    {
      id: 'soviet_barracks',
      name: 'Soviet Barracks',
      cost: 400,
      power: -10,
      buildTime: 5,
      description: 'Trains Conscripts and chemical Flak Troopers.',
      icon: '🛖',
      unlockedBy: ['soviet_power'],
      hp: 600
    },
    {
      id: 'soviet_war',
      name: 'Soviet War Factory',
      cost: 2000,
      power: -30,
      buildTime: 12,
      description: 'Assembles Apocalypse Tanks and massive Rhino armored batteries.',
      icon: '🏭',
      unlockedBy: ['soviet_ore', 'soviet_barracks'],
      hp: 1000
    }
  ],
  YURI: [
    {
      id: 'yuri_const',
      name: 'Yuri Bio-Construct Master',
      cost: 3000,
      power: 0,
      buildTime: 0,
      description: 'Mind-over-matter facility. Central gateway for Yuri commands.',
      icon: '🔮',
      hp: 1000
    },
    {
      id: 'yuri_power',
      name: 'Yuri Bio-Reactor',
      cost: 1000,
      power: 200,
      buildTime: 6,
      description: 'Extracts energy directly from organic matrixes.',
      icon: '🌀',
      hp: 550
    },
    {
      id: 'yuri_ore',
      name: 'Psychic Ore Grinder',
      cost: 1800,
      power: -60,
      buildTime: 11,
      description: 'Pulverizes ore by telekinetic grinding for high net-worth credits.',
      icon: '☣️',
      hp: 800
    },
    {
      id: 'yuri_barracks',
      name: 'Yuri Initiate Barracks',
      cost: 600,
      power: -15,
      buildTime: 6,
      description: 'Extracts and trains telekinetic Initiates and mental clones.',
      icon: '🧬',
      unlockedBy: ['yuri_power'],
      hp: 650
    },
    {
      id: 'yuri_war',
      name: 'Yuri Bio-War Factory',
      cost: 2200,
      power: -40,
      buildTime: 13,
      description: 'Spawns mind-controlled Lasers, Magnetrons, and Gatling Tanks.',
      icon: '🛸',
      unlockedBy: ['yuri_ore', 'yuri_barracks'],
      hp: 1000
    }
  ]
};

export const DEFENSES_DATA: Record<string, StructureTypeInfo[]> = {
  ALLIES: [
    {
      id: 'allied_wall',
      name: 'Sandbag Wall Block',
      cost: 100,
      power: 0,
      buildTime: 1,
      description: 'Cheap barricade preventing enemy armor breakthrough.',
      icon: '🧱',
      hp: 400
    },
    {
      id: 'allied_turret',
      name: 'Pillbox Turret',
      cost: 500,
      power: 0,
      buildTime: 4,
      description: 'Heavy bunker with rapid-fire twin machine guns. Effective against infantry.',
      icon: '🛡️',
      unlockedBy: ['allied_barracks'],
      hp: 600
    },
    {
      id: 'prism_tower',
      name: 'Prism Tower Array',
      cost: 1500,
      power: -75,
      buildTime: 8,
      description: 'Fires high-intensity focused light beams. Connects with nearby sibling towers for compounding damage boost!',
      icon: '📐',
      unlockedBy: ['allied_war'],
      hp: 600
    }
  ],
  SOVIETS: [
    {
      id: 'soviet_wall',
      name: 'Concrete Compound Wall',
      cost: 100,
      power: 0,
      buildTime: 1,
      description: 'Sturdy wall block. Heavy protection.',
      icon: '🧱',
      hp: 550
    },
    {
      id: 'flak_turret',
      name: 'Flak Cannon Artillery',
      cost: 800,
      power: -20,
      buildTime: 5,
      description: 'Heavy area protection zapping aircraft and infantry.',
      icon: '🧨',
      unlockedBy: ['soviet_barracks'],
      hp: 700
    },
    {
      id: 'tesla_coil',
      name: 'Tesla Coil Obelisk',
      cost: 1500,
      power: -100,
      buildTime: 8,
      description: 'Arcing blue lightning that incinerates enemy heavy armor instantly.',
      icon: '🔋',
      unlockedBy: ['soviet_war'],
      hp: 600
    }
  ],
  YURI: [
    {
      id: 'yuri_wall',
      name: 'Psychic Barrier Fence',
      cost: 150,
      power: 0,
      buildTime: 2,
      description: 'Electro-magnetic force wall.',
      icon: '🧱',
      hp: 500
    },
    {
      id: 'gatling_tower',
      name: 'Gatling Cannon Array',
      cost: 1000,
      power: -50,
      buildTime: 6,
      description: 'Three-barreled spinning cannon. Rate of fire increases the longer it continues to fire.',
      icon: '🔫',
      unlockedBy: ['yuri_barracks'],
      hp: 650
    },
    {
      id: 'psychic_tower',
      name: 'Psychic Mind-Mutator',
      cost: 1800,
      power: -120,
      buildTime: 10,
      description: 'Emits a powerful psychotropic pulse that scrambles or mind-controls invading tanks!',
      icon: '👁️‍🗨️',
      unlockedBy: ['yuri_war'],
      hp: 700
    }
  ]
};

export const INFANTRY_DATA: Record<string, UnitTypeInfo[]> = {
  ALLIES: [
    {
      id: 'gi',
      name: 'Allied G.I. Soldier',
      cost: 200,
      buildTime: 2,
      description: 'Flexible soldier. Deployable to place defensive sandbags and double firing rate.',
      icon: '🪖',
      hp: 120,
      damage: 15,
      range: 2,
      speed: 1.5,
      sound: '"Ready for deployment, commander!"',
      synthType: 'bullet'
    },
    {
      id: 'rocketeer',
      name: 'Rocket Trooper',
      cost: 600,
      buildTime: 4,
      description: 'Airborne infantry with anti-tank capabilities. Hovers past barriers.',
      icon: '🚀',
      hp: 150,
      damage: 25,
      range: 3,
      speed: 2.2,
      sound: '"Check the fuel tank, igniting engines!"',
      synthType: 'laser'
    },
    {
      id: 'chrono_legionnaire',
      name: 'Chrono Legionnaire',
      cost: 1500,
      buildTime: 9,
      description: 'Phase-ports instantly. Eraser weapon deletes enemies from time, leaving no debris.',
      icon: '⏳',
      hp: 100,
      damage: 60,
      range: 4,
      speed: 3.5, // chronoport
      sound: '"I am already there."',
      synthType: 'laser'
    }
  ],
  SOVIETS: [
    {
      id: 'conscript',
      name: 'Soviet Conscript',
      cost: 100,
      buildTime: 1.5,
      description: 'Cheap, mass-producible infantry armed with reliable submachine guns.',
      icon: '🇷🇺',
      hp: 100,
      damage: 10,
      range: 1.8,
      speed: 1.4,
      sound: '"Conscript reporting for mother Russia!"',
      synthType: 'bullet'
    },
    {
      id: 'tesla_trooper',
      name: 'Tesla Shock Trooper',
      cost: 500,
      buildTime: 4,
      description: 'Fires high voltage bolts. Immune to crushing, can charge allied Tesla Coils manually.',
      icon: '⚡',
      hp: 200,
      damage: 35,
      range: 2.2,
      speed: 1.1,
      sound: '"Let the high voltage flow!"',
      synthType: 'tesla'
    },
    {
      id: 'yuri_clone_classic',
      name: 'Soviet Psychic Shock Troop',
      cost: 1000,
      buildTime: 7,
      description: 'Unleashes devastating magnetic and psychic waves.',
      icon: '🧠',
      hp: 130,
      damage: 45,
      range: 2.8,
      speed: 1.3,
      sound: '"I see into their fearful minds."',
      synthType: 'psychic'
    }
  ],
  YURI: [
    {
      id: 'initiate',
      name: 'Yuri Initiate',
      cost: 150,
      buildTime: 2,
      description: 'Yuri fundamental shocktroop. Projects burning telekinetic fireballs.',
      icon: '🔥',
      hp: 110,
      damage: 18,
      range: 2,
      speed: 1.5,
      sound: '"My mind is Yuri\'s weapon!"',
      synthType: 'flame'
    },
    {
      id: 'yuri_clone',
      name: 'Mind-Control Agent',
      cost: 800,
      buildTime: 5,
      description: 'Enslaves enemy tank crews instantly or triggers deadly waves of brain rot.',
      icon: '👽',
      hp: 100,
      damage: 30,
      range: 3,
      speed: 1.2,
      sound: '"Your thoughts belong to us."',
      synthType: 'psychic'
    },
    {
      id: 'virus',
      name: 'The Virus Sniper',
      cost: 1200,
      buildTime: 8,
      description: 'Fires biological darts. Deceased enemies explode into toxic chemical clouds.',
      icon: '🧪',
      hp: 120,
      damage: 50,
      range: 4,
      speed: 1.6,
      sound: '"Sample retrieved, toxin ready."',
      synthType: 'flame'
    }
  ]
};

export const VEHICLES_DATA: Record<string, UnitTypeInfo[]> = {
  ALLIES: [
    {
      id: 'grizzly',
      name: 'Grizzly Battle Tank',
      cost: 700,
      buildTime: 5,
      description: 'Versatile armor vehicle, nimble and fast reload speeds.',
      icon: '🚐',
      hp: 400,
      damage: 40,
      range: 2.5,
      speed: 2.0,
      sound: '"Grizzly locked and rolling!"',
      synthType: 'bullet'
    },
    {
      id: 'prism_tank',
      name: 'Prism Tank Array',
      cost: 1200,
      buildTime: 8,
      description: 'Distant beam amplifier. Beam splits on contact to shred surrounding columns.',
      icon: '🚎',
      hp: 300,
      damage: 75,
      range: 4.5,
      speed: 1.4,
      sound: '"Calculating refractive prisms!"',
      synthType: 'laser'
    },
    {
      id: 'mirage_tank',
      name: 'Mirage Mirage Tank',
      cost: 1000,
      buildTime: 7,
      description: 'Camouflages as a harmless green tree when stationary. Sneak flame attack!',
      icon: '🌳',
      hp: 350,
      damage: 65,
      range: 3.2,
      speed: 2.3,
      sound: '"Mean green and completely unseen!"',
      synthType: 'flame'
    }
  ],
  SOVIETS: [
    {
      id: 'rhino',
      name: 'Rhino Tank Heavy-Grade',
      cost: 900,
      buildTime: 6,
      description: 'Durable frontline combat armor. Excellent breakthrough force.',
      icon: '🚛',
      hp: 550,
      damage: 50,
      range: 2.6,
      speed: 1.7,
      sound: '"Heavy armor ready, move out!"',
      synthType: 'bullet'
    },
    {
      id: 'apocalypse',
      name: 'Apocalypse Juggernaut Tank',
      cost: 1750,
      buildTime: 12,
      description: 'Unstoppable behemoth. Twin cannons, automatic healing, fires heat-seeking anti-air rockets.',
      icon: '🚚',
      hp: 850,
      damage: 100,
      range: 3.5,
      speed: 1.0,
      sound: '"It is the Day of Judgment."',
      synthType: 'bullet'
    },
    {
      id: 'kirov',
      name: 'Kirov Airship Zeppelin',
      cost: 2000,
      buildTime: 14,
      description: 'Leviathan dirigible. Slow speed but practically invulnerable. Drops building-collapsing high explosive bombs.',
      icon: '🎈',
      hp: 1500,
      damage: 250,
      range: 1.5,
      speed: 0.6,
      sound: '"Kirov reporting!"',
      synthType: 'flame'
    }
  ],
  YURI: [
    {
      id: 'lasertank',
      name: 'Lash Tank Weaponry',
      cost: 800,
      buildTime: 5,
      description: 'Nimble hover unit that projects high energy piercing lasers.',
      icon: '🛸',
      hp: 380,
      damage: 42,
      range: 2.8,
      speed: 2.2,
      sound: '"Charge the lash capacitors!"',
      synthType: 'laser'
    },
    {
      id: 'magnetron',
      name: 'Magnetron Levitator',
      cost: 1000,
      buildTime: 7,
      description: 'Manipulates localized gravity. Lifts enemy tanks in the air, disabling them in combat.',
      icon: '🧲',
      hp: 300,
      damage: 55,
      range: 4,
      speed: 1.8,
      sound: '"Gravity is an illusion."',
      synthType: 'psychic'
    },
    {
      id: 'floating_disc',
      name: 'Floating Disc UFO',
      cost: 1750,
      buildTime: 11,
      description: 'Alien weapon that drains energy directly from power stations, cutting off operational grids.',
      icon: '🛸',
      hp: 600,
      damage: 80,
      range: 3.5,
      speed: 2.5,
      sound: '"Spinning disc arrays charged."',
      synthType: 'laser'
    }
  ]
};

// Map configuration
export const GRID_SIZE = 21; // 21x21 cell tactical battlefield grid

export const INITIAL_MAP_DECORATION: MapCell[] = (() => {
  const cells: MapCell[] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      let type: 'grass' | 'water' | 'ore' | 'gem' = 'grass';
      
      // Central stream
      if (y === Math.floor(GRID_SIZE / 2) && x !== 4 && x !== GRID_SIZE - 5) {
        type = 'water';
      }
      // Top left gold ore vein
      else if ((x === 2 || x === 3) && (y === 2 || y === 3)) {
        type = 'ore';
      }
      // Bottom right gem vein (blue/purple)
      else if ((x === GRID_SIZE - 3 || x === GRID_SIZE - 4) && (y === GRID_SIZE - 3 || y === GRID_SIZE - 4)) {
        type = 'gem';
      }
      cells.push({ x, y, type, oreAmount: (type === 'ore' || type === 'gem') ? 10 : undefined });
    }
  }
  return cells;
})();

export const RETRO_QUOTES = [
  { text: 'Establishing battlefield control, stand by.', source: 'EVA' },
  { text: 'Warning: Military intrusion detected.', source: 'EVA' },
  { text: 'Conscripts reporting for Mother Russia!', source: 'Soviet Conscript' },
  { text: 'Is it the Day of Judgment? Excellent choice!', source: 'Apocalypse Tank' },
  { text: 'Mean, green, and completely unseen!', source: 'Mirage Tank' },
  { text: 'Kirov reporting!', source: 'Kirov Airship' },
  { text: 'Analyzing refractive prisms... Focus light cells!', source: 'Prism Tank' },
  { text: 'Yuri is master of all minds. We obey.', source: 'Yuri Initiate' },
  { text: 'Rubber boots in motion. Keep electrical flows stable!', source: 'Tesla Trooper' },
  { text: 'Ready for Chronosphere warp! Watch the space distortion.', source: 'Chrono Legionnaire' },
];

export const MAP_LEGENDS = [
  { type: 'grass', label: 'Combat Field', color: 'bg-emerald-950/40 border border-emerald-900/30' },
  { type: 'water', label: 'River Stream', color: 'bg-blue-950/60 border border-blue-900/40 animate-pulse' },
  { type: 'ore', label: 'Golden Ore ($)', color: 'bg-yellow-600/30 border border-yellow-500/50' },
  { type: 'gem', label: 'Prism Gem ($$$)', color: 'bg-purple-600/30 border border-purple-500/50' },
];
