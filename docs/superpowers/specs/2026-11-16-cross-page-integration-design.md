# Cross-Page Officer Selection & City Sync

## Overview

Lift the currently-selected officer and the player's current city into App's shared state so they carry over consistently when switching between pages (roster, map, affairs, bonds, duel). Today `selectedOfficer` is shared at the App level but InternalAffairs and TacticalMap each keep competing local copies (`selectedOfficerId`, `selectedCityIndex`, `selectedCityId`), so selecting an officer on one page doesn't follow you to another, and the current city drifts independently per page.

## Goals

- One canonical `selectedOfficerId` and `currentCityId` in App state, shared by every page.
- Selecting an officer on any page updates the advisor panel and is preserved across tab switches.
- Selecting a city on any page is reflected on the map and affairs pages.
- No new state layer (Redux/context) — pure prop drilling, matching existing conventions.

## Non-Goals

- Merging pages into a single view.
- Adding React Context or any new state-management library.
- Persisting selection/city to server (WS `officer_added`/`officer_deleted` already update `officers`; selection falls back to `officers[0]` if deleted).
- Changing TacticalMap's internal city data structures beyond syncing which city is "current".

## Architecture

### State added to App

| State | Type | Derived from / default |
|---|---|---|
| `selectedOfficerId` | `string` | initialized to `protagonistId` (or `FAMOUS_OFFICERS[0].id` if empty) |
| `currentCityId` | `string` | initialized to protagonist's `homeCity` ?? first PRESET_CITY |

The existing `selectedOfficer: Officer` state is replaced by `selectedOfficerId`. `selectedOfficer` object is derived where needed: `officers.find(o => o.id === selectedOfficerId) ?? officers[0]`.

### City identifier canonical form

Use `cityName` (e.g. `'成都'`) as the canonical `currentCityId`, since InternalAffairs' `PRESET_CITIES` is keyed by `cityName`. TacticalMap's `CITIES` is keyed by `id` (e.g. `'luoyang'`). TacticalMap will resolve `currentCityId` (a name) to its city record by matching `CITIES.find(c => c.name === currentCityId ?? c.cityName === currentCityId)`, falling back to its existing default if not found.

If the two city lists turn out to be disjoint sets with no overlap, the design degrades gracefully: each page keeps its own default when the canonical ID isn't present in its list.

### Components changed

| Component | Change |
|---|---|
| `App.tsx` | Holds `selectedOfficerId` + `currentCityId` + setters; passes both to every tab |
| `TacticalMap.tsx` | Removes local `selectedCityId`; receives `currentCityId` + `onSetCurrentCity`; resolves name → city for highlighting |
| `InternalAffairs.tsx` | Removes local `selectedOfficerId` + `selectedCityIndex`; receives canonical values + setters |
| `OfficerCard.tsx` (roster usage) | `onSelectForStrategy` updates App's `selectedOfficerId` (already does via `setSelectedOfficer`) |
| `GameNavigation.tsx` | No change — tab switching alone must not reset selection |

### Data flow

```
Select officer on Map
  → TacticalMap calls onSelectOfficer(officer)
  → App.setSelectedOfficerId(officer.id)
  → advisor panel re-renders with new officer
  → Switch to Affairs tab
  → InternalAffairs highlights same officer (derives from canonical ID)
  → Switch back to Map
  → same officer still selected

Select city in Affairs
  → InternalAffairs calls onSetCurrentCity(cityName)
  → App.setCurrentCityId(cityName)
  → TacticalMap highlights same city on next visit
```

WS `officer_deleted` already resets selection via `setSelectedOfficer(current => ...)`; with ID-based state, fall back to `officers[0]` when `selectedOfficerId` no longer exists in `officers`.

## Error Handling

- `selectedOfficerId` references a deleted/missing officer → fall back to `officers[0]` (existing WS pattern).
- `currentCityId` not found in TacticalMap's `CITIES` → keep TacticalMap's current default ('luoyang').
- `currentCityId` not found in InternalAffairs' `PRESET_CITIES` → keep protagonist's `homeCity` default.
- All callbacks optional-guarded; no new error boundaries needed (state is primitive IDs).

## Testing

- `App` integration (or page-level): selecting an officer on one page updates the advisor panel highlight; switching tabs preserves selection; switching city propagates to map.
- `TacticalMap`: `currentCityId` prop drives city highlight; `onSetCurrentCity` fires on city selection.
- `InternalAffairs`: canonical `selectedOfficerId`/`currentCityId` drive local UI; no competing local state remains.
- Existing `PartyConsole` / `PartyRoster` / `RecruitPool` tests unaffected (they don't touch selection/city).
- Add `data-testid` assertions on selection highlight where absent.

## UI Changes

- Advisor panel officer follows selection from any page (was stuck/reset when switching from map or affairs).
- Map city highlight and affairs city selector reflect the same current city.
- Tab switching no longer resets selection to a page-local default.

## MVP Scope

- Canonical `selectedOfficerId` + `currentCityId` in App.
- TacticalMap and InternalAffairs consume canonical state instead of local copies.
- Selection/city survive tab switches.
- Deleted-officer fallback.

## Risks

- TacticalMap and InternalAffairs use different city key schemes (`id` vs `cityName`); mitigation: canonical `cityName`, defensive fallbacks.
- Both pages mount lazily (`block`/`hidden`), so city highlight only applies when the page is visible — acceptable; canonical state persists regardless.

## Implementation Direction

1. Add `selectedOfficerId` + `currentCityId` state to `App.tsx`, derive `selectedOfficer` object.
2. Remove local `selectedOfficerId`/`selectedCityIndex` from `InternalAffairs.tsx`; accept canonical props + setters.
3. Remove local `selectedCityId` from `TacticalMap.tsx`; accept canonical props + setters, resolve name → city.
4. Update all tab usages in `App.tsx` to pass the new props and callbacks.
5. Add tests for cross-page selection/city sync and fallback behavior.
6. Run `npm run lint` and `npm run build`; full test suite.
