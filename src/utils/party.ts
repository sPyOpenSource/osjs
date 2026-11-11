import { Officer } from '../types';

/** Maximum number of companions a party may hold (protagonist excluded). */
export const MAX_COMPANIONS = 8;

/**
 * Officers the player may pick as protagonist.
 *
 * Prefers officers belonging to the selected player factions. When that
 * intersection is empty (a scenario can feature a faction with no famous
 * officers), it falls back to the scenario's featured factions, and only then
 * to the full roster.
 */
export function getCandidateOfficers(
  officers: Officer[],
  factions: string[],
  fallbackFactions: string[] = []
): Officer[] {
  const inFactions = officers.filter(officer => factions.includes(officer.factionId));
  if (inFactions.length) return inFactions;

  if (fallbackFactions.length) {
    const inFallback = officers.filter(officer => fallbackFactions.includes(officer.factionId));
    if (inFallback.length) return inFallback;
  }

  return officers;
}
