export type Faction = 'ALLIES' | 'SOVIETS' | 'YURI';

export type TabType = 'STRUCTURES' | 'DEFENSES' | 'INFANTRY' | 'VEHICLES';

export interface StructureTypeInfo {
  id: string;
  name: string;
  cost: number;
  power: number; // Positive = production, negative = consumption
  buildTime: number; // in seconds
  description: string;
  icon: string; // Tailwind class or symbol
  unlockedBy?: string[];
  hp: number;
}

export interface UnitTypeInfo {
  id: string;
  name: string;
  cost: number;
  buildTime: number;
  description: string;
  icon: string;
  hp: number;
  damage: number;
  range: number; // grid distance
  speed: number; // movement cells per sec
  sound: string; // classic quote
  synthType: 'bullet' | 'laser' | 'tesla' | 'flame' | 'psychic';
}

export interface PlacedStructure {
  id: string;
  type: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  active: boolean;
  angle?: number;
  lastFired?: number;
}

export interface PlacedUnit {
  id: string;
  type: string;
  x: number; // current smooth visual X
  y: number; // current smooth visual Y
  targetX: number; // target grid X
  targetY: number; // target grid Y
  owner: 'PLAYER' | 'ENEMY';
  hp: number;
  maxHp: number;
  angle: number;
  lastFired: number;
  speed: number;
  damage: number;
  range: number;
  synthType: 'bullet' | 'laser' | 'tesla' | 'flame' | 'psychic';
  color: string;
  isKirov?: boolean;
}

export interface BuildQueueItem {
  id: string;
  category: TabType;
  progress: number; // 0 to 100
  paused: boolean;
}

export interface LogMessage {
  id: string;
  text: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  timestamp: string;
}

export interface MapCell {
  x: number;
  y: number;
  type: 'grass' | 'water' | 'ore' | 'gem';
  oreAmount?: number; // for harvesting
}

export interface SoundFX {
  name: string;
  quote: string;
  role: string | null;
  frequency: number;
  type: 'synth' | 'speech';
}
