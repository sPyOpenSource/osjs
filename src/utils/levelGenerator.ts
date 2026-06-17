import { LevelConfig } from "../types";

export const LEVELS: Record<string, LevelConfig> = {
  facility: {
    id: "facility",
    name: "Sector Delta Mainframe",
    description: "Infiltrate the high-tech base cyber-corps facility. Eliminate all rogue guard droids and escape through the lift.",
    difficulty: "EASY",
    ceilingColor: "rgba(13, 27, 42, 0.95)", // dark tech slate blue
    floorColor: "rgba(10, 15, 20, 0.95)", // deep graphite floor
    playerStartX: 1.5,
    playerStartY: 1.5,
    playerStartAngle: 0.1, // starting look direction
    exitX: 10.5,
    exitY: 10.5,
    enemyCount: 5,
    wallGrid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 4], // 4 represents the exit elevator
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
  },
  wasteland: {
    id: "wasteland",
    name: "Outpost Sandstorms",
    description: "Survival in an open cyber-fortress filled with advanced soldier replicants. Mountains block the sandstorms.",
    difficulty: "MEDIUM",
    ceilingColor: "rgba(42, 28, 12, 0.95)", // radioactive dusty orange
    floorColor: "rgba(20, 14, 8, 0.95)", // reddish-brown floor
    playerStartX: 1.5,
    playerStartY: 1.5,
    playerStartAngle: 0.5,
    exitX: 1.5,
    exitY: 10.5,
    enemyCount: 7,
    wallGrid: [
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2],
      [2, 2, 2, 0, 2, 0, 2, 0, 2, 2, 0, 2],
      [2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 2],
      [2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2],
      [2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 2],
      [2, 2, 2, 0, 2, 0, 2, 2, 2, 2, 0, 2],
      [2, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 2],
      [2, 0, 2, 2, 2, 0, 2, 2, 0, 2, 0, 2],
      [2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 2],
      [4, 0, 2, 0, 0, 0, 2, 0, 2, 2, 0, 2],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ],
  },
  hive: {
    id: "hive",
    name: "Rogue Cybernet Hive",
    description: "Enter the central node of the AI cyber-demon core. High density of hostiles. Beware of proximity locks.",
    difficulty: "HEAVY",
    ceilingColor: "rgba(10, 35, 15, 0.95)", // radioactive terminal green
    floorColor: "rgba(5, 12, 8, 0.95)", // dark slate green floor
    playerStartX: 10.5,
    playerStartY: 10.5,
    playerStartAngle: 3.14,
    exitX: 1.5,
    exitY: 1.5,
    enemyCount: 10,
    wallGrid: [
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [3, 4, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3],
      [3, 0, 3, 3, 0, 3, 0, 3, 3, 3, 0, 3],
      [3, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 3],
      [3, 0, 3, 0, 3, 3, 3, 3, 0, 3, 0, 3],
      [3, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 3],
      [3, 3, 3, 0, 3, 0, 0, 3, 3, 3, 3, 3],
      [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
      [3, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3],
      [3, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 3],
      [3, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    ],
  },
};

// Generates enemies at randomized empty spots, guaranteeing minimum safe spawning distance from the player start coordinates
export function initEnemiesForLevel(levelId: string): { x: number; y: number; id: string; type: "DRONE" | "SOLDIER" | "CYBER_DEMON" }[] {
  const level = LEVELS[levelId] || LEVELS.facility;
  const grid = level.wallGrid;
  const list: { x: number; y: number; id: string; type: "DRONE" | "SOLDIER" | "CYBER_DEMON" }[] = [];

  const types: ("DRONE" | "SOLDIER" | "CYBER_DEMON")[] = ["DRONE", "SOLDIER"];
  if (level.difficulty === "HEAVY" || level.difficulty === "CHALLENGE") {
    types.push("CYBER_DEMON");
  }

  let count = 0;
  // Fallback coords if randomization fails
  const attempts = 150;
  for (let a = 0; a < attempts && count < level.enemyCount; a++) {
    const rx = Math.floor(Math.random() * (grid[0].length - 2)) + 1;
    const ry = Math.floor(Math.random() * (grid.length - 2)) + 1;

    if (grid[ry][rx] === 0) {
      // safe zone around player start
      const dx = rx - level.playerStartX;
      const dy = ry - level.playerStartY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Check if coordinates already occupied by another enemy
      const alreadyHas = list.some((e) => Math.floor(e.x) === rx && Math.floor(e.y) === ry);

      if (dist > 2.5 && !alreadyHas) {
        // Decide type based on level
        let type: "DRONE" | "SOLDIER" | "CYBER_DEMON" = "DRONE";
        const roll = Math.random();
        if (levelId === "facility") {
          type = roll < 0.7 ? "DRONE" : "SOLDIER";
        } else if (levelId === "wasteland") {
          type = roll < 0.4 ? "DRONE" : "SOLDIER";
        } else {
          // hive
          type = roll < 0.3 ? "DRONE" : roll < 0.7 ? "SOLDIER" : "CYBER_DEMON";
        }

        list.push({
          id: `enemy-${count}-${Math.random().toString(36).substr(2, 4)}`,
          x: rx + 0.5,
          y: ry + 0.5,
          type,
        });
        count++;
      }
    }
  }

  // Back up spawns in case map is cramped
  if (list.length < level.enemyCount) {
    for (let r = 1; r < grid.length - 1; r++) {
      for (let c = 1; c < grid[0].length - 1; c++) {
        if (grid[r][c] === 0 && list.length < level.enemyCount) {
          const dx = c + 0.5 - level.playerStartX;
          const dy = r + 0.5 - level.playerStartY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const alreadyHas = list.some((e) => Math.floor(e.x) === c && Math.floor(e.y) === r);
          if (dist > 2.0 && !alreadyHas) {
            list.push({
              id: `enemy-${list.length}`,
              x: c + 0.5,
              y: r + 0.5,
              type: Math.random() < 0.6 ? "DRONE" : "SOLDIER",
            });
          }
        }
      }
    }
  }

  return list;
}
