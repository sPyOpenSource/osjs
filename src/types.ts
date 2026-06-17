export interface CarSpecs {
  topSpeed: number; // in km/h
  acceleration: number; // 0-100 km/h in seconds
  braking: number; // 100-0 km/h stopping distance in meters
  grip: number; // lateral G force (e.g. 1.15 to 2.85)
}

export interface CarUpgrades {
  engine: number;      // Level 0 to 4
  drivetrain: number;  // Level 0 to 4
  aerodynamics: number;// Level 0 to 4
  tyres: number;       // Level 0 to 4
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  class: "R" | "S" | "GT";
  price: number;
  unlockedAtStreak: number;
  baseSpecs: CarSpecs;
  currentSpecs: CarSpecs;
  maxSpecs: CarSpecs;
  upgrades: CarUpgrades;
  owned: boolean;
  color: string; // Hex color for race rendering
  shadowColor: string;
  emoji: string;
  accentColor: string;
  description: string;
}

export interface Track {
  id: string;
  name: string;
  location: string;
  length: string; // e.g., "7.004 km"
  corners: number;
  difficulty: "Rookie" | "Amateur" | "Pro" | "Legend";
  lapRecord: string;
  recordHolder: string;
  bgGradStart: string;
  bgGradEnd: string;
  segmentCount: number; // total steps of the pseudo-3D road
  turnComplexity: number; // complexity of curve generations
  description: string;
  curbColorPrimary: string;
  curbColorSecondary: string;
}

export interface AIDriver {
  name: string;
  difficulty: number; // 0.5 to 1.2 skill scale
  carId: string;
  carName: string;
  color: string;
  position: number; // z position on track
  lane: number; // offset from -1 to 1 representing horizontal position
  speed: number;
  lap: number;
  finished: boolean;
  finishTime?: string;
  timeGap?: number;
}

export interface SectorTime {
  sector1: number | null;
  sector2: number | null;
  sector3: number | null;
}

export interface RaceTelemetry {
  speed: number;
  rpm: number;
  gear: number;
  throttle: boolean;
  brakes: boolean;
  gForceX: number;
  gForceY: number;
  lap: number;
  completedLaps: number;
  currentLapTime: number;
  lastLapTime: number | null;
  bestLapTime: number | null;
  currentSector: 1 | 2 | 3;
  sectorTimes: {
    1: number | null;
    2: number | null;
    3: number | null;
  };
}

export type UpgradeCategory = "engine" | "drivetrain" | "aerodynamics" | "tyres";
