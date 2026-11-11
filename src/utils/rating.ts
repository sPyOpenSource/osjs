export interface StatRating {
  letter: 'S' | 'A' | 'B' | 'C' | 'D';
  color: string;
}

/**
 * ROTK-style letter grade for an officer stat value.
 * Shared by OfficerCard (full stat grid) and RecruitPool (top-stat chip) so both
 * views grade the same number the same way.
 */
export function getRating(val: number): StatRating {
  if (val >= 95) return { letter: 'S', color: 'text-amber-400 font-bold border-amber-400 bg-amber-950/40' };
  if (val >= 85) return { letter: 'A', color: 'text-red-400 font-bold border-red-500/50 bg-red-950/20' };
  if (val >= 75) return { letter: 'B', color: 'text-blue-400 font-medium border-blue-500/30' };
  if (val >= 60) return { letter: 'C', color: 'text-emerald-400 border-emerald-500/20' };
  return { letter: 'D', color: 'text-slate-400 border-slate-500/10' };
}
