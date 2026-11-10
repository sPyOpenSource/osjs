# RPG Layer Design

## Overview

Add a medium-depth RPG layer on top of the existing strategy game. Keep the current map, factions, cities, trade, internal affairs, battles, and duels as the world simulation, while adding a protagonist-led party, progression, equipment, skills, and quests.

## Goals

- Let the player choose one protagonist officer and recruit companions.
- Add experience, levels, skill points, and RPG attributes.
- Add basic equipment slots and quest rewards.
- Keep existing strategy systems intact and useful.

## Non-Goals

- Full removal of strategy systems.
- Action/real-time combat.
- Open-world map rewrite.

## Architecture

Existing layers remain:

- Tactical map, city ownership, factions, trade, debts, internal affairs
- Battle and duel systems

New RPG layer:

- Party and protagonist state
- Experience and leveling
- Skill trees and equipment
- Quest log and quest rewards

## Data Model

### RpgCharacter

Extends the existing Officer concept with:

- `level`
- `xp`
- `skillPoints`
- `learnedSkills`
- `equipment`

### Party

- `protagonistId`
- `companionIds` (max 4)
- shared quest state

### Quest

- `id`
- `title`
- `description`
- `objectives`
- `rewards`
- `status`: not_started, active, completed, failed

### Equipment

- `id`
- `name`
- `slot`: weapon, armor, accessory
- `statBonuses`
- `skillBonuses`

## Integration With Existing Systems

### Combat

- Existing duel and battle results grant experience.
- Party RPG stats and equipment modify combat outcomes.
- Leveling grants skill points.

### Map and Factions

- Quest objectives target cities, factions, or officers.
- Quest completion can change city ownership or grant rewards.

### Economy

- Quest rewards can include gold, grain, equipment, or officers.

## UI Changes

- StartMenu: protagonist selection step.
- TacticalMap: quest markers and party summary.
- New panels: Party/Character and Quest Log.

## MVP Scope

- Protagonist selection and companion recruitment
- Levels, XP, and skill points
- Basic equipment slots
- Main quest chain (3-5 quests)
- 2-3 side quests
- Combat XP rewards

## Risks

- UI complexity from combining strategy and RPG systems
- State synchronization in multiplayer mode
- Balancing XP and rewards

## Implementation Direction

Implement incrementally:

1. RPG state and party selection
2. XP and leveling
3. Equipment and skill points
4. Quest data and quest log
5. Combat XP integration
6. Quest markers and rewards
