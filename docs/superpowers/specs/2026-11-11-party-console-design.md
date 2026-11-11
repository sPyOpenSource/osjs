# Unified Party Console Design

## Overview

Restructure the roster tab into a two-pane party console so the player can manage their party and recruit companions in one view without switching tabs. Left pane = party management (equip, spend skill points, dismiss). Right pane = recruit pool (scan, compare, recruit). Collapses to a single column on narrow screens.

## Goals

- Combine party management and recruiting into a single console so the player sees party slots and recruitables side by side.
- Reduce vertical density and clicks per party-management action (recruit / equip / spend skill point / dismiss).
- Keep the existing tab model intact — no new top-level tab, no state-layer changes.
- Gracefully degrade on narrow viewports (single column).

## Non-Goals

- Merging roster with map, affairs, bonds, or duel tabs.
- Adding new app state (Redux/context) — pure prop drilling from existing App state.
- Changing OfficerCard (still used elsewhere for deep-dives).

## Architecture

The roster tab currently stacks `PartyPanel` above a full `OfficerCard` grid vertically. It becomes:

```
+----------------------------------------------------------+
| [Party Roster]        [Recruit Pool]                     |
|                                                         |
|  Protagonist              |  Cao Cao  [招募]             |
|  Lv.3  [■■■■□] XP         |  魏 · 智力 S · [招募]        |
|  技能点 2 · [学习]         |  Sun Quan [招募]             |
|  [武器] 长枪  [防具] 空位  |  吴 · 统帅 A · [招募]        |
|  [饰符] 空位               |  ...                       |
|  [解雇]                    |                            |
|                                                         |
|  Guan Yu                  |                            |
|  Lv.2  [■■□□□] XP         |                            |
|  技能点 0 · [学习]         |                            |
|  [武器] 青龙刀 ...         |                            |
|  [解雇]                    |                            |
|                                                         |
|  同伴 2/4 · 已入队          |  同伴已满 (4/4)            |
+----------------------------------------------------------+
```

### Components

| Component | Role |
|---|---|
| `PartyConsole` (new) | Split container inside roster tab. Computes `memberIds`, `recruitable`, `atLimit`. Passes props to panes. |
| `PartyRoster` (refined PartyPanel) | Left pane: member cards — avatar/name/level header row, thin XP bar, inline skill-points + 学习 button, 3 equipment slot pills, dismiss. |
| `RecruitPool` (new) | Right pane: recruitable officers as compact cards — name, faction chip, top stat + letter grade, 招募 button. Empty state when none left or at limit. |
| `OfficerCard` | Unchanged — remains for deep-dive detail (creator/bonds), not used in this console. |

## Data Flow

- `App` already holds `party`, `rpgCharacters`, `officers`, `partyEquipment` and the callbacks `onRecruit`, `onDismiss`, `onSpendSkillPoint`, `onEquip`. No new state added.
- `PartyConsole` receives these as props from `App` and forwards to `PartyRoster` / `RecruitPool`.
- `PartyRoster` actions: 学习 → `onSpendSkillPoint(officerId, skillId)`, equip pill → `onEquip(officerId, slot, item)`, 解雇 → `onDismiss(officerId)`.
- `RecruitPool` actions: 招募 → `onRecruit(officerId)`.
- `atLimit (4/4)` disables recruit buttons and shows a "同伴已满（4/4）" banner in the right pane.
- All callbacks are optional-guarded (`onRecruit?.()`).

## Error Handling

- Officer missing from `officers` list → fallback avatar + `officerId` label (already handled).
- No recruitables available → empty state message ("无可招募武将").
- At companion limit → recruit disabled + clear banner; no spurious recruit attempts.
- Equipment slot with no equippable items → show "空位" pill instead of an empty `<select>`.

## Testing

- `PartyConsole`: renders member count banner; renders recruit pool; disables recruit at 4/4 limit; empty state when pool empty.
- `PartyRoster`: skill-point button disabled when 0 points; equip pill shows equipped name / "空位"; dismiss removes member.
- Add `data-testid` attributes: `party-card-<id>`, `recruit-card-<id>`, `btn-recruit-<id>`, `btn-dismiss-<id>`, `party-slot-<slot>`.
- Reuse existing `xpForLevel` util; no new logic to test.

## UI Changes

- Roster tab layout: vertical stack → two-pane split console (`grid-cols-1 md:grid-cols-2`), responsive collapse.
- `PartyRoster` cards tighter than current `PartyPanel` cards: header row + thin XP bar + inline skill points + slot pills.
- `RecruitPool` cards compact: one line per officer with faction chip, top stat letter grade, recruit button.
- Protagonist visually distinguished (main badge) in the party pane.
- Existing `OfficerCard` unaffected; still used in creator/bonds flows.

## MVP Scope

- Unified two-pane party console inside the roster tab.
- Recruit companions up to the 4-companion limit.
- Equip weapon/armor/accessory per member.
- Spend skill points per member.
- Dismiss companions.
- Responsive single-column fallback.

## Risks

- Left/right pane widths may crowd content on small md breakpoints — mitigate with collapse at `md`.
- Recruit pool can be long; may need scrolling container within right pane — mitigate with `overflow-y-auto` on the pool list.

## Implementation Direction

1. Create `PartyConsole` component (split container) + `RecruitPool` component.
2. Refine `PartyPanel` into `PartyRoster` (tighter cards, slot pills).
3. Wire into `App.tsx` roster tab, replacing the stacked `PartyPanel` + grid with the split console.
4. Add `data-testid` attributes and unit tests.
5. Verify responsive collapse on narrow screens.
