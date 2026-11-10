import { RpgCharacter } from '../types';

const XP_BASE = 100;
const XP_CURVE = 1.6;
export const MAX_LEVEL = 99;

export function xpForLevel(level: number): number {
  return Math.round(XP_BASE * Math.pow(Math.max(1, level), XP_CURVE));
}

export function createRpgCharacter(officerId: string): RpgCharacter {
  return {
    officerId,
    level: 1,
    xp: 0,
    skillPoints: 0,
    learnedSkills: [],
    equipment: {}
  };
}

export function applyXp(character: RpgCharacter, amount: number): RpgCharacter {
  // No-op keeps the same reference so React can bail out of the re-render.
  if (!Number.isSafeInteger(amount) || amount <= 0) return character;
  let xp = character.xp + amount;
  let level = character.level;
  let skillPoints = character.skillPoints;
  while (level < MAX_LEVEL && xp >= xpForLevel(level + 1)) {
    xp -= xpForLevel(level + 1);
    level += 1;
    skillPoints += 1;
  }
  return { ...character, xp, level, skillPoints };
}
