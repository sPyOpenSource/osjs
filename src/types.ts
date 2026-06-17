export type EnemyType = "DRONE" | "SOLDIER" | "CYBER_DEMON";

export interface Enemy {
  id: string;
  type: EnemyType;
  x: number; // grid float coordinates
  y: number;
  health: number;
  maxHealth: number;
  speed: number;
  state: "IDLE" | "CHASING" | "ATTACKING" | "HURT" | "DYING" | "DEAD";
  stateTimer: number; // for animations/timing
  damage: number;
  scoreValue: number;
  radius: number; // size for collision
  avatar: string; // Emoji character / Canvas shape code
  color: string;
  isHitFlash: boolean; // visual flash on damage
}

export interface Weapon {
  id: string;
  name: string;
  ammo: number;
  maxAmmo: number;
  damage: number;
  range: number;
  fireRate: number; // ms delay
  recoil: number; // visual offset
  burstSize: number; // bullets dispatched per click
  sound: "pistol" | "shotgun" | "plasma";
  emoji: string;
  accuracy: number; // float spread
}

export interface PlayerState {
  x: number;
  y: number;
  dirX: number; // direction vector coords
  dirY: number;
  planeX: number; // 2D camera projection plane values
  planeY: number;
  angle: number; // looking rotation angle (radians)
  health: number;
  maxHealth: number;
  shield: number;
  maxShield: number;
  score: number;
  kills: number;
  currentWeaponIndex: number;
  weapons: Weapon[];
  isFiring: boolean;
  fireTimer: number;
  isTakingDamage: boolean;
  damageTimer: number;
  currentLevelId: string;
}

export interface LevelConfig {
  id: string;
  name: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HEAVY" | "CHALLENGE";
  wallGrid: number[][]; // 2D layout where grid values 1,2,3 define wall textures
  ceilingColor: string;
  floorColor: string;
  exitX: number;
  exitY: number;
  playerStartX: number;
  playerStartY: number;
  playerStartAngle: number;
  enemyCount: number;
}

export interface LaserTracer {
  id: string;
  screenX: number; // position on screen
  color: string;
  opacity: number;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
}

export interface BloodSplat {
  id: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export interface ScoreEntry {
  playerName: string;
  score: number;
  kills: number;
  level: string;
  date: string;
}

export interface GameLog {
  id: string;
  timestamp: string;
  message: string;
  type: "combat" | "system" | "health" | "ammo" | "level" | "kill" | "chat";
}

export interface RemotePlayer {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  dirX: number;
  dirY: number;
  angle: number;
  health: number;
  score: number;
  kills: number;
  currentWeaponIndex: number;
  isFiring: boolean;
  levelId: string;
  lastSeen?: number;
}

