# Cross-Page Officer Selection & City Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lift `selectedOfficerId` and `currentCityId` into App's shared state so officer selection and current city carry over consistently when switching between pages (roster, map, affairs, bonds, duel).

**Architecture:** Canonical `selectedOfficerId` + `currentCityId` live in `App.tsx`; `TacticalMap` and `InternalAffairs` remove their competing local state and consume canonical props + setters. Pure prop drilling, no new state layer. City canonical form = `cityName` (matches InternalAffairs' `PRESET_CITIES`); TacticalMap resolves name → city by matching `name`/`cityName`.

**Tech Stack:** React 19, TypeScript 5.8, Tailwind 4, `node:test` + `tsx --test` for tests, `tsc --noEmit` for type check, `vite build` for build.

## Global Constraints

- Test runner: `npx tsx --test <path>`; test style: `node:test` `describe`/`test` + `node:assert/strict`.
- Type check command: `npm run lint` (`tsc --noEmit`).
- Component convention: default-exported React component, props typed via interface.
- No new state-management library (Redux/context).
- All callbacks optional-guarded.
- `tsconfig.json` has no `noUnusedLocals`/`noUnusedParameters`, so unused optional props won't fail type check.
- Companion limit: `MAX_COMPANIONS = 8` (from `src/utils/party.ts`).
- City canonical form = `cityName` (e.g. `'成都'`), matching InternalAffairs' `PRESET_CITIES`.
- Frequent commits after each task.

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/App.tsx` | Modify | Add `selectedOfficerId` + `currentCityId` state + setters; derive `selectedOfficer` object; pass canonical state + callbacks to every tab |
| `src/components/TacticalMap.tsx` | Modify | Remove local `selectedCityId`; accept `currentCityId` + `onSetCurrentCity` props; resolve name → city for highlight |
| `src/components/InternalAffairs.tsx` | Modify | Remove local `selectedOfficerId` + `selectedCityIndex`; accept canonical `selectedOfficerId`/`currentCityId` + setters |
| `src/components/__tests__/CrossPageIntegration.test.tsx` | Create | Tests: officer selection carries across tabs; city selection propagates; deleted officer falls back; missing city falls back |

---
### Task 1: Add canonical `selectedOfficerId` + `currentCityId` to App.tsx

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: existing `officers`, `setOfficers`, `protagonistId`, `FAMOUS_OFFICERS`, `SCENARIOS[0]`, `setSelectedOfficer` call sites.
- Produces: new state `selectedOfficerId: string` and `currentCityId: string` plus setter callbacks `setSelectedOfficerId` and `setCurrentCityId`; derived `selectedOfficer` object.

- [ ] **Step 1: Decide test strategy**
App.tsx is a large default-exported component that mounts the full UI (including StartMenu, WebSocket setup). Direct unit testing of App is impractical. Test the integration at the page-component level instead:
- `TacticalMap` accepts `currentCityId`/`onSetCurrentCity` and highlights the right city.
- `InternalAffairs` accepts `selectedOfficerId`/`currentCityId`/`onSetSelectedOfficerId`/`onSetCurrentCity` and highlights the right officer/city.
- Verify App passes these props down (checked by `tsc --noEmit` + build).

- [ ] **Step 2: Modify App.tsx**
Replace `selectedOfficer: Officer` state with ID-based state:

```tsx
const [selectedOfficerId, setSelectedOfficerId] = useState<string>(defaultProtagonistId);
const [currentCityId, setCurrentCityId] = useState<string>(
  officers.find((o) => o.id === protagonistId)?.homeCity ?? '成都'
);
```

Derive `selectedOfficer` where the object is needed:
```tsx
const selectedOfficer = officers.find((o) => o.id === selectedOfficerId) ?? officers[0];
```

Update all `setSelectedOfficer(...)` call sites to `setSelectedOfficerId(...)`. The WS `officer_deleted` handler falls back to `officers[0]` when `selectedOfficerId` no longer exists:

```tsx
setSelectedOfficerId(current => {
  if (!officers.some(o => o.id === current)) return officers[0]?.id ?? '';
  return current;
});
```

- [ ] **Step 3: Run type check**
Run: `npm run lint` (`tsc --noEmit`)
Expected: PASS — exit 0.

- [ ] **Step 4: Commit**
```bash
git add src/App.tsx
git commit -m "feat: add canonical selectedOfficerId and currentCityId to App state"
```

---

### Task 2: Rewrite InternalAffairs.tsx to consume canonical state

**Files:**
- Modify: `src/components/InternalAffairs.tsx`

**Interfaces:**
- Consumes: new props `selectedOfficerId?: string`, `currentCityId?: string`, `onSetSelectedOfficerId?: (id: string) => void`, `onSetCurrentCity?: (cityName: string) => void`; existing `defaultCityName`, `officers`.
- Produces: InternalAffairs reads canonical state from props; removes local `selectedOfficerId` and `selectedCityIndex` state; selection highlight and city selector driven by canonical props.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/__tests__/CrossPageIntegration.test.tsx
import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import InternalAffairs from '../InternalAffairs';
import { Officer } from '../../types';
```

Expected: FAIL — `Cannot find module '../InternalAffairs'`.

- [ ] **Step 2: Modify InternalAffairs.tsx**
Replace `defaultCityName?: string` with canonical props:

```tsx
interface InternalAffairsProps {
  officers: Officer[];
  soundEnabled: boolean;
  playDrumSound: () => void;
  playClashSound: () => void;
  playHarvestSound: () => void;
  onSelectOfficer?: (officer: Officer) => void;
  gameYear: number;
  gameMonth: number;
  gameXun: number;
  isAutoTime: boolean;
  timeSpeed: 'slow' | 'normal' | 'fast';
  onToggleAutoTime: () => void;
  onSetTimeSpeed: (speed: 'slow' | 'normal' | 'fast') => void;
  onAdvanceXun: () => void;
  onAdvanceMonth: () => void;
  selectedOfficerId?: string;
  currentCityId?: string;
  onSetSelectedOfficerId?: (id: string) => void;
  onSetCurrentCity?: (cityName: string) => void;
  isActiveTab?: boolean;
}
```

Remove local `selectedOfficerId`/`selectedCityIndex` state; use props directly:
- `selectedOfficerId` prop drives officer highlight (line 1002 area)
- `currentCityId` prop drives city selector (line 672 area), resolving via `PRESET_CITIES.findIndex(c => c.cityName === currentCityId)`

- [ ] **Step 3: Run test to verify it passes**
Run: `npx tsx --test src/components/__tests__/CrossPageIntegration.test.tsx`
Expected: PASS.

- [ ] **Step 4: Run type check**
Run: `npm run lint` (`tsc --noEmit`)
Expected: PASS — exit 0.

- [ ] **Step 5: Commit**
```bash
git add src/components/InternalAffairs.tsx src/components/__tests__/CrossPageIntegration.test.tsx
git commit -m "feat: InternalAffairs consumes canonical selectedOfficerId and currentCityId"
```

---

### Task 3: Rewrite TacticalMap.tsx to consume canonical state

**Files:**
- Modify: `src/components/TacticalMap.tsx`

**Interfaces:**
- Consumes: new props `currentCityId?: string`, `onSetCurrentCity?: (cityName: string) => void`; existing `selectedScenario`, `officers`, `onSelectOfficer`.
- Produces: TacticalMap reads `currentCityId` from props; removes local `selectedCityId` state; resolves `cityName` → city record via `CITIES.find(c => c.name === currentCityId ?? c.cityName === currentCityId)`, falling back to existing default if not found.

- [ ] **Step 1: Modify TacticalMap.tsx**
Add `currentCityId?: string` and `onSetCurrentCity?: (cityName: string) => void` to `TacticalMapProps`. Remove `selectedCityId` local state; compute `selectedCity` from `currentCityId` prop:

```tsx
const selectedCity = currentCityId
  ? CITIES.find(c => c.name === currentCityId || c.cityName === currentCityId) || CITIES.find(c => c.id === 'luoyang') || CITIES[0]
  : CITIES.find(c => c.id === 'luoyang') || CITIES[0];
```

When a city is selected on the map, call `onSetCurrentCity?.(selectedCity.cityName)`.

- [ ] **Step 2: Run type check**
Run: `npm run lint` (`tsc --noEmit`)
Expected: PASS — exit 0.

- [ ] **Step 3: Commit**
```bash
git add src/components/TacticalMap.tsx
git commit -m "feat: TacticalMap consumes canonical currentCityId"
```

---

### Task 4: Wire canonical state into App.tsx tab usages

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: existing tab usages at lines ~1152 (PartyConsole), ~1688 (TacticalMap), ~1722 (InternalAffairs).
- Produces: Each tab receives `selectedOfficerId`, `currentCityId`, `setSelectedOfficerId`, `setCurrentCityId` as appropriate.

- [ ] **Step 1: Modify App.tsx tab usages**
TacticalMap usage:
```tsx
<TacticalMap
  ...
  currentCityId={currentCityId}
  onSetCurrentCity={setCurrentCityId}
  onSelectOfficer={(off) => { setSelectedOfficerId(off.id); setSelectedOfficer(off); }}
/>
```

InternalAffairs usage:
```tsx
<InternalAffairs
  ...
  selectedOfficerId={selectedOfficerId}
  currentCityId={currentCityId}
  onSetSelectedOfficerId={setSelectedOfficerId}
  onSetCurrentCity={setCurrentCityId}
/>
```

- [ ] **Step 2: Run type check**
Run: `npm run lint` (`tsc --noEmit`)
Expected: PASS — exit 0.

- [ ] **Step 3: Run full test suite**
Run: `npx tsx --test src/utils/*.test.ts src/components/__tests__/*.test.tsx`
Expected: PASS — all tests pass, 0 fail.

- [ ] **Step 4: Run build**
Run: `npm run build`
Expected: PASS — `vite build && esbuild` completes without errors.

- [ ] **Step 5: Commit**
```bash
git add src/App.tsx
git commit -m "feat: wire canonical selection/city state into all tabs"
```

---

### Task 5: Verify build and final commit

**Files:** None new; verify existing `src/App.tsx`, `src/components/TacticalMap.tsx`, `src/components/InternalAffairs.tsx`, `src/components/__tests__/CrossPageIntegration.test.tsx`.

- [ ] **Step 1: Run production build**
Run: `npm run build`
Expected: PASS — `vite build && esbuild server.ts ...` completes without errors.

- [ ] **Step 2: Final commit**
```bash
git add -A
git commit -m "feat: canonical cross-page officer selection and city sync"
```

---
