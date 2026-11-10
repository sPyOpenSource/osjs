import { RpgCharacter } from '../types';

export function xpForLevel(level: number): number {
  return Math.round(100 * Math.pow(level, 1.6));
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
  if (amount <= 0) return character;
  let xp = character.xp + amount;
  let level = character.level;
  let skillPoints = character.skillPoints;
  while (xp >= xpForLevel(level + 1)) {
    xp -= xpForLevel(level + 1);
    level += 1;
    skillPoints += 1;
  }
  return { ...character, xp, level, skillPoints };
}
