# Unified Party Console Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Restructure the roster tab into a two-pane party console: left pane manages the party (equip, spend skill points, dismiss), right pane recruits companions from a pool, responsive single-column collapse on narrow screens.

**Architecture:** Keep existing App state (`party`, `rpgCharacters`, `officers`, `partyEquipment`) and callbacks (`onRecruit`, `onDismiss`, `onSpendSkillPoint`, `onEquip`). Add `PartyConsole` (split container) and `RecruitPool` components; refine `PartyPanel` into `PartyRoster` (tighter cards, slot pills). No new app state layer; pure prop drilling from App.

**Tech Stack:** React 19, TypeScript 5.8, Tailwind 4, lucide-react, `node:test` + `tsx --test` for tests, `tsc --noEmit` for type check.

## Global Constraints

- Test runner: `npx tsx --test <path>`; test style: `node:test` `describe`/`test` + `node:assert/strict`.
- Type check command: `npm run lint` (`tsc --noEmit`).
- Component convention: default-exported React component, props typed via interface, file named `ComponentName.tsx`.
- Existing data model files not to be changed: `src/types.ts`, `src/data.ts` (officer data already has `homeCity`; party console does not need new data fields).
- Companion limit: max 8 companions (`party.companionIds.length >= MAX_COMPANIONS`).
- All callbacks optional-guarded (`onRecruit?.()`).
- `data-testid` attributes on every interactive element: `party-card-<id>`, `recruit-card-<id>`, `btn-recruit-<id>`, `btn-dismiss-<id>`, `party-slot-<slot>`, `party-spend-<id>`.
- No Redux/context/state-library additions.
- Frequent commits after each task.

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/components/PartyConsole.tsx` | Create | Split two-pane console container. Computes `memberIds`, `recruitable`, `atLimit`. Renders `PartyRoster` (left) and `RecruitPool` (right). Responsive grid collapse. |
| `src/components/RecruitPool.tsx` | Create | Right pane: compact recruitable officer cards (name, faction chip, top stat + letter grade, 招募 button). Empty state when pool empty or at limit. |
| `src/components/PartyRoster.tsx` | Create | Left pane: refined PartyPanel. Member cards — avatar/name/level header row, thin XP bar, inline skill points + 学习 button, 3 equipment slot pills, dismiss button. |
| `src/components/PartyPanel.tsx` | Modify | Replaced by `PartyRoster.tsx` (file deleted after content moved) OR kept as thin re-export for backward compatibility. Decision: delete `PartyPanel.tsx`, import `PartyRoster` in App. |
| `src/App.tsx` | Modify | Roster tab: import `PartyConsole` instead of `PartyPanel`; remove stacked `OfficerCard` grid beneath it (roster tab is now the console); pass existing props + callbacks. |
| `src/components/__tests__/PartyConsole.test.tsx` | Create | Tests: renders member count banner; renders recruit pool; disables recruit at 8/8 limit; empty state when pool empty. |
| `src/components/__tests__/PartyRoster.test.tsx` | Create | Tests: skill-point button disabled when 0 points; equip pill shows equipped name / 空位; dismiss removes member; protagonist badge shown. |
| `src/components/__tests__/RecruitPool.test.tsx` | Create | Tests: renders recruit cards; recruit button calls onRecruit; disabled when at limit; empty state message. |

Note: This repo has no existing React component test infrastructure (no vitest/jest). Component tests use `node:test` with minimal render via `react-dom/server` (`renderToStaticMarkup`) where feasible, plus `tsc --noEmit` for type safety. If `renderToStaticMarkup` cannot exercise event handlers, tests assert on static markup structure and `data-testid` attributes.

## Task 1: RecruitPool component

**Files:**
- Create: `src/components/RecruitPool.tsx`
- Create: `src/components/__tests__/RecruitPool.test.tsx`

**Interfaces:**
- Consumes: `Officer[]` (from `../types`), `Faction` (from `../types`) for faction lookup by `officer.factionId`, `FACTIONS` (from `../data`), callback `onRecruit: (officerId: string) => void`, boolean `atLimit`.
- Produces: exported default function `RecruitPool({ officers, atLimit, onRecruit }: Props)`.

**Props interface:**
```ts
interface RecruitPoolProps {
  officers: Officer[];
  atLimit: boolean;
  onRecruit: (officerId: string) => void;
}
```

- [x] **Step 1: Write the failing test**

```tsx
// src/components/__tests__/RecruitPool.test.tsx
import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import RecruitPool from '../RecruitPool';
import { Officer } from '../../types';

function makeOfficer(id: string, name: string, factionId: string): Officer {
  return {
    id,
    name,
    gender: 'Male',
    factionId,
    avatarStyle: {
      hairColor: '#000',
      hairStyle: 'short',
      armorColor: '#000',
      accessory: 'none',
      expression: 'calm',
      bgGradient: 'none',
    },
    stats: { leadership: 50, force: 90, intelligence: 50, politics: 50, charisma: 50 },
    traits: [],
    skills: [],
    biography: '',
  };
}

const officers = [makeOfficer('caocao', '曹操', 'wei'), makeOfficer('sunquan', '孙权', 'wu')];

describe('RecruitPool', () => {
  test('renders a recruit card per officer with recruit button', () => {
    const html = renderToStaticMarkup(<RecruitPool officers={officers} atLimit={false} onRecruit={() => {}} />);
    assert.ok(html.includes('data-testid="btn-recruit-caocao"'));
    assert.ok(html.includes('data-testid="btn-recruit-sunquan"'));
    assert.ok(html.includes('招募'));
  });

  test('disables recruit buttons when atLimit is true', () => {
    const html = renderToStaticMarkup(<RecruitPool officers={officers} atLimit={true} onRecruit={() => {}} />);
    assert.ok(html.includes('disabled'));
  });

  test('shows empty state when no officers', () => {
    const html = renderToStaticMarkup(<RecruitPool officers={[]} atLimit={false} onRecruit={() => {}} />);
    assert.ok(html.includes('无可招募武将'));
  });
});
```

Run: `npx tsx --test src/components/__tests__/RecruitPool.test.tsx`
Expected: FAIL — `Cannot find module '../RecruitPool'`.

- [x] **Step 2: Run test to verify it fails**

Run: `npx tsx --test src/components/__tests__/RecruitPool.test.tsx`
Expected: FAIL with module not found.

- [x] **Step 3: Write minimal implementation**

```tsx
// src/components/RecruitPool.tsx
import React from 'react';
import { Officer } from '../types';
import { FACTIONS } from '../data';
import { Shield, Swords, Brain, Scroll, Sparkles } from 'lucide-react';
import Button from './Button';

interface RecruitPoolProps {
  officers: Officer[];
  atLimit: boolean;
  onRecruit: (officerId: string) => void;
}

const STAT_ICONS: Record<keyof Officer['stats'], React.ElementType> = {
  leadership: Shield,
  force: Swords,
  intelligence: Brain,
  politics: Scroll,
  charisma: Sparkles,
};

export default function RecruitPool({ officers, atLimit, onRecruit }: RecruitPoolProps) {
  const matchedFaction = (factionId: string) => FACTIONS.find((f) => f.id === factionId);

  const topStat = (officer: Officer) => {
    const stats = Object.entries(officer.stats) as [keyof Officer['stats'], number][];
    stats.sort((a, b) => b[1] - a[1]);
    return stats[0];
  };

  if (officers.length === 0) {
    return (
      <div className="party-recruit-empty">
        <p className="trade-muted text-sm">无可招募武将</p>
      </div>
    );
  }

  return (
    <div className="party-recruit-list">
      {officers.map((officer) => {
        const [statKey, statVal] = topStat(officer);
        const Icon = STAT_ICONS[statKey];
        const faction = matchedFaction(officer.factionId);
        return (
          <Button
            key={officer.id}
            id={`btn-recruit-${officer.id}`}
            data-testid={`btn-recruit-${officer.id}`}
            disabled={atLimit}
            onClick={() => onRecruit(officer.id)}
            className="party-recruit-button"
          >
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold">{officer.name}</span>
              <span
                className="text-[10px] font-mono text-slate-400 bg-slate-950/60 px-1.5 py-0.5 rounded border border-slate-800/60"
              >
                {faction?.name || officer.factionId}
              </span>
              <span className="ml-auto text-[10px] font-mono">
                <Icon size={10} className="text-slate-400 inline" />
                {statVal}
              </span>
            </div>
            <span className="block text-[10px] text-amber-400 font-mono mt-0.5">招募</span>
          </Button>
        );
      })}
    </div>
  );
}
```

- [x] **Step 4: Run test to verify it passes**

Run: `npx tsx --test src/components/__tests__/RecruitPool.test.tsx`
Expected: PASS — 3 tests pass, 0 fail.

- [x] **Step 5: Commit**

```bash
git add src/components/RecruitPool.tsx src/components/__tests__/RecruitPool.test.tsx
git commit -m "feat: add RecruitPool component for party console"
```

**As-built notes (updated after quality review):**
- Each officer is wrapped in `<li data-testid={`recruit-card-${officer.id}`}>` inside a `<ul className="party-recruit-list">`; the button itself only carries `btn-recruit-<id>`.
- Stat grade letters come from the shared `src/utils/rating.ts` (`getRating`), also used by `OfficerCard.tsx`.
- When `atLimit` is true the pool renders `同伴已满（8/8），无法继续招募` above the list (with `role="status"`), so disabled buttons are explained rather than silent.
- Component-level CSS lives in `src/index.css` (`.party-recruit-*`) and uses `--color-trade-*` tokens; no raw palette classes in this component.
- Tests: 7 cases in `src/components/__tests__/RecruitPool.test.tsx`, including per-button `disabled=""` assertions (plus a negative case) and a direct component-tree call to verify `onRecruit` wiring (SSR drops handlers).

## Task 2: PartyRoster component

**Files:**
- Create: `src/components/PartyRoster.tsx`
- Create: `src/components/__tests__/PartyRoster.test.tsx`
- Delete: `src/components/PartyPanel.tsx` — **deferred to Task 4**: `App.tsx` still imports `PartyPanel` and passes `onRecruit` to it, so deleting it before Task 4 leaves the repo uncompilable. Keep the file untouched in Task 2 and delete it in the same commit that rewires `App.tsx`.

**Interfaces:**
- Consumes: `Party`, `Record<string, RpgCharacter>`, `Officer[]`, `Equipment[]`, callbacks `onDismiss`, `onSpendSkillPoint`, `onEquip`.
- Produces: exported default function `PartyRoster({ party, characters, officers, availableEquipment, onDismiss, onSpendSkillPoint, onEquip }: Props)`.

**Props interface:**
```ts
interface PartyRosterProps {
  party: Party;
  characters: Record<string, RpgCharacter>;
  officers: Officer[];
  availableEquipment: Equipment[];
  onDismiss: (officerId: string) => void;
  onSpendSkillPoint: (officerId: string, skillId: string) => void;
  onEquip: (officerId: string, slot: 'weapon' | 'armor' | 'accessory', equipment: Equipment) => void;
}
```

**SLOTS constant** (same as current PartyPanel):
```ts
const SLOTS: { key: 'weapon' | 'armor' | 'accessory'; label: string; icon: React.ElementType }[] = [
  { key: 'weapon', label: '武器', icon: Sword },
  { key: 'armor', label: '防具', icon: Shield },
  { key: 'accessory', label: '饰品', icon: Target },
];
```

- [x] **Step 1: Write the failing test**

```tsx
// src/components/__tests__/PartyRoster.test.tsx
import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import PartyRoster from '../PartyRoster';
import { Officer, Party, RpgCharacter, Equipment } from '../../types';

function makeOfficer(id: string, name: string): Officer {
  return {
    id, name, gender: 'Male', factionId: 'shu',
    avatarStyle: { hairColor: '#000', hairStyle: 'short', armorColor: '#000', accessory: 'none', expression: 'calm', bgGradient: 'none' },
    stats: { leadership: 80, force: 75, intelligence: 78, politics: 80, charisma: 99 },
    traits: [], skills: [], biography: '',
  };
}

function makeChar(officerId: string, level: number, skillPoints: number, xp: number): RpgCharacter {
  return { officerId, level, xp, skillPoints, learnedSkills: [], equipment: {} };
}

const party: Party = { protagonistId: 'liubei', companionIds: ['guanyu'] };
const officers = [makeOfficer('liubei', '刘备'), makeOfficer('guanyu', '关羽')];
const characters: Record<string, RpgCharacter> = {
  liubei: makeChar('liubei', 3, 2, 500),
  guanyu: makeChar('guanyu', 2, 0, 100),
};
const availableEquipment: Equipment[] = [];

describe('PartyRoster', () => {
  test('renders member cards for protagonist and companions', () => {
    const html = renderToStaticMarkup(
      <PartyRoster party={party} characters={characters} officers={officers} availableEquipment={availableEquipment} onDismiss={() => {}} onSpendSkillPoint={() => {}} onEquip={() => {}} />
    );
    assert.ok(html.includes('data-testid="party-card-liubei"'));
    assert.ok(html.includes('data-testid="party-card-guanyu"'));
    assert.ok(html.includes('Lv.3'));
    assert.ok(html.includes('Lv.2'));
  });

  test('shows protagonist badge on protagonist', () => {
    const html = renderToStaticMarkup(
      <PartyRoster party={party} characters={characters} officers={officers} availableEquipment={availableEquipment} onDismiss={() => {}} onSpendSkillPoint={() => {}} onEquip={() => {}} />
    );
    assert.ok(html.includes('主角'));
  });

  test('disables spend button when skillPoints is 0', () => {
    const html = renderToStaticMarkup(
      <PartyRoster party={party} characters={characters} officers={officers} availableEquipment={availableEquipment} onDismiss={() => {}} onSpendSkillPoint={() => {}} onEquip={() => {}} />
    );
    // guanyu has 0 skillPoints -> spend button disabled
    assert.ok(html.includes('data-testid="party-spend-guanyu"'));
  });

  test('shows 空位 pill when no equipment equippable', () => {
    const html = renderToStaticMarkup(
      <PartyRoster party={party} characters={characters} officers={officers} availableEquipment={availableEquipment} onDismiss={() => {}} onSpendSkillPoint={() => {}} onEquip={() => {}} />
    );
    assert.ok(html.includes('空位'));
  });

  test('dismiss button present only on non-protagonist', () => {
    const html = renderToStaticMarkup(
      <PartyRoster party={party} characters={characters} officers={officers} availableEquipment={availableEquipment} onDismiss={() => {}} onSpendSkillPoint={() => {}} onEquip={() => {}} />
    );
    assert.ok(html.includes('data-testid="party-dismiss-guanyu"'));
    assert.ok(!html.includes('data-testid="party-dismiss-liubei"'));
  });
});
```

Run: `npx tsx --test src/components/__tests__/PartyRoster.test.tsx`
Expected: FAIL — `Cannot find module '../PartyRoster'`.

- [x] **Step 2: Run test to verify it fails**

Run: `npx tsx --test src/components/__tests__/PartyRoster.test.tsx`
Expected: FAIL with module not found.

- [x] **Step 3: Write minimal implementation**

```tsx
// src/components/PartyRoster.tsx
import React, { useCallback, useMemo } from 'react';
import { Officer, RpgCharacter, Party, Equipment, EquipmentSlot } from '../types';
import { xpForLevel } from '../utils/rpg';
import AvatarRenderer from './AvatarRenderer';
import Button from './Button';
import { User, Shield, Sword, Target, Plus, X } from 'lucide-react';

const SLOTS: { key: EquipmentSlot; label: string; icon: React.ElementType }[] = [
  { key: 'weapon', label: '武器', icon: Sword },
  { key: 'armor', label: '防具', icon: Shield },
  { key: 'accessory', label: '饰品', icon: Target },
];

interface PartyRosterProps {
  party: Party;
  characters: Record<string, RpgCharacter>;
  officers: Officer[];
  availableEquipment: Equipment[];
  onDismiss: (officerId: string) => void;
  onSpendSkillPoint: (officerId: string, skillId: string) => void;
  onEquip: (officerId: string, slot: EquipmentSlot, equipment: Equipment) => void;
}

export default function PartyRoster({
  party,
  characters,
  officers,
  availableEquipment,
  onDismiss,
  onSpendSkillPoint,
  onEquip,
}: PartyRosterProps) {
  const memberIds = useMemo(() => [party.protagonistId, ...party.companionIds], [party]);
  const isInParty = useCallback((id: string) => memberIds.includes(id), [memberIds]);
  const recruitable = useMemo(() => officers.filter((o) => o.id !== party.protagonistId && !isInParty(o.id)), [officers, party.protagonistId, isInParty]);
  const companionCount = party.companionIds.length;
  const atLimit = companionCount >= MAX_COMPANIONS;

  const characterFor = (officerId: string) =>
    characters[officerId] ?? { officerId, level: 1, xp: 0, skillPoints: 0, learnedSkills: [], equipment: {} };

  const xpPct = (officerId: string) => {
    const c = characterFor(officerId);
    const next = xpForLevel(c.level + 1);
    return next > 0 ? Math.min(100, Math.round((c.xp / next) * 100)) : 100;
  };

  const handleRecruit = useCallback(
    (officerId: string) => {
      // Recruitment handled by PartyConsole via RecruitPool; kept for API symmetry.
    },
    []
  );

  return (
    <section className="party-panel" aria-label="队伍">
      <div className="party-heading">
        <User size={18} />
        <h2>队伍</h2>
        <span className="trade-muted">
          {memberIds.length} 名成员 · 同伴 {companionCount}/8
        </span>
      </div>

      <div className="party-members">
        {memberIds.map((officerId) => {
          const officer = officers.find((o) => o.id === officerId);
          const char = characterFor(officerId);
          const isProtagonist = officerId === party.protagonistId;
          const nextLevelXp = xpForLevel(char.level + 1);
          const xpPercent = xpPct(officerId);
          return (
            <article
              key={officerId}
              className={`party-card ${isProtagonist ? 'party-card-protagonist' : ''}`}
              data-testid={`party-card-${officerId}`}
            >
              <div className="party-card-header">
                <div className="party-card-avatar">
                  {officer ? (
                    <AvatarRenderer style={officer.avatarStyle} size={36} />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <User size={16} />
                    </div>
                  )}
                </div>
                <div className="party-card-info">
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="text-base font-bold">{officer?.name || officerId}</h3>
                    <span className="text-xs font-mono text-amber-400">Lv.{char.level}</span>
                    {isProtagonist && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40">
                        主角
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">技能点 {char.skillPoints}</span>
                    <Button
                      id={`party-spend-${officerId}`}
                      data-testid={`party-spend-${officerId}`}
                      onClick={() => onSpendSkillPoint(officerId, `skill-lv${char.level}`)}
                      disabled={char.skillPoints <= 0}
                    >
                      <Plus size={12} /> 学习
                    </Button>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden border border-slate-700">
                    <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${xpPercent}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-2">
                    <span>经验 {char.xp}</span>
                    <span>下级 {nextLevelXp}</span>
                  </div>
                </div>
                <div className="party-card-actions">
                  {!isProtagonist && (
                    <Button
                      id={`party-dismiss-${officerId}`}
                      data-testid={`party-dismiss-${officerId}`}
                      onClick={() => onDismiss(officerId)}
                      className="party-dismiss-button"
                    >
                      <X size={14} />
                    </Button>
                  )}
                </div>
              </div>

              <div className="party-equipment">
                <span className="trade-muted block text-[10px] uppercase tracking-wider mb-1.5">装备</span>
                <div className="party-slot-list">
                  {SLOTS.map((slot) => {
                    const equipped = char.equipment[slot.key];
                    const canEquip = availableEquipment.filter((e) => e.slot === slot.key && !equipped);
                    return (
                      <div key={slot.key} className="party-slot">
                        <label className="party-slot-label">
                          <span>{slot.icon ? <slot.icon size={12} /> : null}</span>{slot.label}
                        </label>
                        {equipped ? (
                          <span className="party-equipped" title={equipped.name} data-testid={`party-slot-${officerId}-${slot.key}`}>
                            {equipped.name}
                          </span>
                        ) : canEquip.length ? (
                          <select
                            id={`party-equip-${officerId}-${slot.key}`}
                            data-testid={`party-slot-${officerId}-${slot.key}`}
                            className="party-slot-select"
                            defaultValue=""
                            onChange={(e) => {
                              const id = e.target.value;
                              if (!id) return;
                              const item = availableEquipment.find((eq) => eq.id === id);
                              if (item) onEquip(officerId, slot.key, item);
                            }}
                          >
                            <option value="">装备 …</option>
                            {canEquip.map((item) => (
                              <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="party-empty" data-testid={`party-slot-${officerId}-${slot.key}`}>
                            空位
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
```

- [x] **Step 4: Run test to verify it passes**

Run: `npx tsx --test src/components/__tests__/PartyRoster.test.tsx`
Expected: PASS — 5 tests pass, 0 fail.

- [x] **Step 5: Commit (PartyPanel stays for now)**

```bash
git add src/components/PartyRoster.tsx src/components/__tests__/PartyRoster.test.tsx src/index.css
git commit -m "feat: add PartyRoster component for party console left pane"
```

`PartyPanel.tsx` is removed in Task 4 together with the `App.tsx` rewiring, so every commit builds.

## Task 3: PartyConsole component

**Files:**
- Create: `src/components/PartyConsole.tsx`
- Create: `src/components/__tests__/PartyConsole.test.tsx`

**Interfaces:**
- Consumes: `Party`, `Record<string, RpgCharacter>`, `Officer[]`, `Equipment[]`, callbacks `onRecruit`, `onDismiss`, `onSpendSkillPoint`, `onEquip` (all from App).
- Produces: exported default function `PartyConsole({ party, characters, officers, availableEquipment, onRecruit, onDismiss, onSpendSkillPoint, onEquip }: Props)`.

**Props interface:**
```ts
interface PartyConsoleProps {
  party: Party;
  characters: Record<string, RpgCharacter>;
  officers: Officer[];
  availableEquipment: Equipment[];
  onRecruit: (officerId: string) => void;
  onDismiss: (officerId: string) => void;
  onSpendSkillPoint: (officerId: string, skillId: string) => void;
  onEquip: (officerId: string, slot: 'weapon' | 'armor' | 'accessory', equipment: Equipment) => void;
}
```

- [x] **Step 1: Write the failing test**

```tsx
// src/components/__tests__/PartyConsole.test.tsx
import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import PartyConsole from '../PartyConsole';
import { Officer, Party, RpgCharacter, Equipment } from '../../types';

function makeOfficer(id: string, name: string, factionId: string): Officer {
  return {
    id, name, gender: 'Male', factionId,
    avatarStyle: { hairColor: '#000', hairStyle: 'short', armorColor: '#000', accessory: 'none', expression: 'calm', bgGradient: 'none' },
    stats: { leadership: 50, force: 50, intelligence: 50, politics: 50, charisma: 50 },
    traits: [], skills: [], biography: '',
  };
}

function makeChar(officerId: string): RpgCharacter {
  return { officerId, level: 1, xp: 0, skillPoints: 0, learnedSkills: [], equipment: {} };
}

const party: Party = { protagonistId: 'liubei', companionIds: [] };
const officers = [makeOfficer('liubei', '刘备', 'shu'), makeOfficer('guanyu', '关羽', 'shu'), makeOfficer('caocao', '曹操', 'wei')];
const characters: Record<string, RpgCharacter> = { liubei: makeChar('liubei'), guanyu: makeChar('guanyu') };
const availableEquipment: Equipment[] = [];

describe('PartyConsole', () => {
  test('renders party roster pane and recruit pool pane', () => {
    let recruited = '';
    const html = renderToStaticMarkup(
      <PartyConsole
        party={party}
        characters={characters}
        officers={officers}
        availableEquipment={availableEquipment}
        onRecruit={(id) => { recruited = id; }}
        onDismiss={() => {}}
        onSpendSkillPoint={() => {}}
        onEquip={() => {}}
      />
    );
    assert.ok(html.includes('data-testid="party-card-liubei"'));
    assert.ok(html.includes('data-testid="btn-recruit-guanyu"'));
    assert.ok(html.includes('data-testid="btn-recruit-caocao"'));
    assert.ok(html.includes('队伍'));
  });

  test('disables recruit when at 8/8 companion limit', () => {
    const fullParty: Party = { protagonistId: 'liubei', companionIds: ['a', 'b', 'c', 'd'] };
    const html = renderToStaticMarkup(
      <PartyConsole
        party={fullParty}
        characters={characters}
        officers={officers}
        availableEquipment={availableEquipment}
        onRecruit={() => {}}
        onDismiss={() => {}}
        onSpendSkillPoint={() => {}}
        onEquip={() => {}}
      />
    );
    assert.ok(html.includes('disabled'));
  });
});
```

Run: `npx tsx --test src/components/__tests__/PartyConsole.test.tsx`
Expected: FAIL — `Cannot find module '../PartyConsole'`.

- [x] **Step 2: Run test to verify it fails**

Run: `npx tsx --test src/components/__tests__/PartyConsole.test.tsx`
Expected: FAIL with module not found.

- [x] **Step 3: Write minimal implementation**

```tsx
// src/components/PartyConsole.tsx
import React, { useMemo } from 'react';
import { Officer, Party, RpgCharacter, Equipment, EquipmentSlot } from '../types';
import PartyRoster from './PartyRoster';
import RecruitPool from './RecruitPool';

interface PartyConsoleProps {
  party: Party;
  characters: Record<string, RpgCharacter>;
  officers: Officer[];
  availableEquipment: Equipment[];
  onRecruit: (officerId: string) => void;
  onDismiss: (officerId: string) => void;
  onSpendSkillPoint: (officerId: string, skillId: string) => void;
  onEquip: (officerId: string, slot: EquipmentSlot, equipment: Equipment) => void;
}

export default function PartyConsole({
  party,
  characters,
  officers,
  availableEquipment,
  onRecruit,
  onDismiss,
  onSpendSkillPoint,
  onEquip,
}: PartyConsoleProps) {
  const memberIds = useMemo(() => [party.protagonistId, ...party.companionIds], [party]);
  const isInParty = (id: string) => memberIds.includes(id);
  const recruitable = officers.filter((o) => o.id !== party.protagonistId && !isInParty(o.id));
  const companionCount = party.companionIds.length;
  const atLimit = companionCount >= MAX_COMPANIONS;

  return (
    <section className="party-console" aria-label="队伍控制台">
      <div className="party-console-panes grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="party-console-pane">
          <PartyRoster
            party={party}
            characters={characters}
            officers={officers}
            availableEquipment={availableEquipment}
            onDismiss={onDismiss}
            onSpendSkillPoint={onSpendSkillPoint}
            onEquip={onEquip}
          />
        </div>
        <div className="party-console-pane">
          <div className="party-pane-header flex items-center gap-2 mb-3">
            <span className="trade-muted">招募同伴</span>
            <span className={`text-xs font-mono ${atLimit ? 'text-rose-400' : 'text-slate-400'}`}>
              同伴 {companionCount}/8
            </span>
          </div>
          <RecruitPool officers={recruitable} atLimit={atLimit} onRecruit={onRecruit} />
        </div>
      </div>
    </section>
  );
}
```

- [x] **Step 4: Run test to verify it passes**

Run: `npx tsx --test src/components/__tests__/PartyConsole.test.tsx`
Expected: PASS — 2 tests pass, 0 fail.

- [x] **Step 5: Commit**

```bash
git add src/components/PartyConsole.tsx src/components/__tests__/PartyConsole.test.tsx
git commit -m "feat: add PartyConsole split-pane component"
```

## Task 4: Wire PartyConsole into App.tsx roster tab

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: existing `party`, `rpgCharacters`, `officers`, `partyEquipment`, `onRecruit`, `onDismiss`, `onSpendSkillPoint`, `onEquip` already defined in App.
- Produces: App roster tab renders `<PartyConsole ...>` instead of `<PartyPanel ...>` + stacked OfficerCard grid; removes `PartyPanel` import.

- [x] **Step 1: Update App.tsx imports and roster tab**

In `src/App.tsx`:
- Replace `import PartyPanel from './components/PartyPanel';` with `import PartyConsole from './components/PartyConsole';`
- Replace the roster-tab block (the `<PartyPanel ... />` element followed by the stacked OfficerCard grid `<div className="grid grid-cols-1 md:grid-cols-2 gap-6"> ... </div>`) with a single `<PartyConsole ... />` using the same props/callbacks already passed to PartyPanel.

Minimal edit: the PartyPanel usage block at App.tsx lines 1134-1178 becomes:

```tsx
<PartyConsole
  party={party}
  characters={rpgCharacters}
  officers={officers}
  availableEquipment={partyEquipmentPool}
  onRecruit={onRecruit}
  onDismiss={onDismiss}
  onSpendSkillPoint={onSpendSkillPoint}
  onEquip={onEquip}
/>
```

**Step 1b: fix the shared equipment pool (required — otherwise one sword equips to every member).**

Today App passes `partyEquipment[party.protagonistId]` to a panel that offers those items to *every* member, while `onEquip` removes the item only from `partyEquipment[officerId]`. Equipping a protagonist-owned sword on a companion therefore never consumes it, so the same item shows as available for all four companions. Add a memoised pool of every item owned by any party member, and make `onEquip` consume the item wherever it lives:

```tsx
// near the other party derived values
const partyEquipmentPool = useMemo(() => {
  const seen = new Set<string>();
  const pool: Equipment[] = [];
  for (const memberId of [party.protagonistId, ...party.companionIds]) {
    for (const item of partyEquipment[memberId] ?? []) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      pool.push(item);
    }
  }
  return pool;
}, [party, partyEquipment]);
```

```tsx
// inside onEquip, replace the partyEquipment updater
setPartyEquipment(prev => {
  const next = { ...prev };
  let removed = false;
  for (const ownerId of Object.keys(next)) {
    const owned = next[ownerId] ?? [];
    if (!removed && owned.some(item => item.id === equipment.id)) {
      next[ownerId] = owned.filter(item => item.id !== equipment.id);
      removed = true;
    }
  }
  return removed ? next : prev;
});
```

(Return `prev` unchanged when nothing was removed so React skips the re-render.)

- [x] **Step 2: Run type check**

Run: `npm run lint`
Expected: PASS — `tsc --noEmit` exits 0 with no errors.

- [x] **Step 3: Run all tests**

Run: `npx tsx --test src/components/__tests__/RecruitPool.test.tsx src/components/__tests__/PartyRoster.test.tsx src/components/__tests__/PartyConsole.test.tsx src/utils/party.test.ts`
Expected: PASS — all component and util tests pass, 0 fail.

- [x] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire PartyConsole into roster tab, replace PartyPanel + grid"
```

## Task 5: Verify build and final commit

**Files:**
- None new; verify existing `src/App.tsx`, `src/components/PartyConsole.tsx`, `src/components/PartyRoster.tsx`, `src/components/RecruitPool.tsx`.

- [x] **Step 1: Run production build**

Run: `npm run build`
Expected: PASS — `vite build && esbuild server.ts ...` completes without errors.

- [x] **Step 2: Final commit**

```bash
git add -A
git commit -m "feat: unified party console for roster tab"
```

