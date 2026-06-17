/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Volume2,
  VolumeX,
  RotateCcw,
  HelpCircle,
  Play,
  Award,
  Gamepad2,
  ArrowBigUp,
  ArrowBigDown,
  ArrowBigLeft,
  ArrowBigRight,
  Target,
  Trophy,
  Shield,
  Activity,
  Heart,
  Zap,
  Info
} from "lucide-react";
import { PlayerState, Enemy, Weapon, LevelConfig, Particle, GameLog, RemotePlayer } from "./types";
import { LEVELS, initEnemiesForLevel } from "./utils/levelGenerator";
import {
  setMuted,
  getMuted,
  playPistol,
  playShotgun,
  playPlasma,
  playSelect,
  playStep,
  playExplosion,
  playOof,
  playPickup,
  playEnemyAlert,
  playVictory,
  playDefeat,
  playHealthPickup,
  playAmmoPickup,
  playShieldPickup,
  playOutOfAmmo,
  playChatNotification,
  playPeerFired,
  playTeleport
} from "./utils/audio";

import RaycasterScreen from "./components/RaycasterScreen";
import RadarMap from "./components/RadarMap";
import WeaponSelector from "./components/WeaponSelector";
import BattleLogs from "./components/BattleLogs";

// Initialize Weapons loadouts
const INITIAL_WEAPONS: Weapon[] = [
  {
    id: "pistol",
    name: "GAUSS-PISTOL C12",
    ammo: 99,
    maxAmmo: 99,
    damage: 15,
    range: 15,
    fireRate: 280,
    recoil: 4,
    burstSize: 1,
    sound: "pistol",
    emoji: "🔫",
    accuracy: 0.08,
  },
  {
    id: "shotgun",
    name: "FLAK-SHOTGUN S8",
    ammo: 15,
    maxAmmo: 15,
    damage: 45,
    range: 6,
    fireRate: 850,
    recoil: 14,
    burstSize: 1,
    sound: "shotgun",
    emoji: "💥",
    accuracy: 0.18,
  },
  {
    id: "plasma",
    name: "PLASMA PULSAR M4",
    ammo: 100,
    maxAmmo: 100,
    damage: 8,
    range: 18,
    fireRate: 110,
    recoil: 2,
    burstSize: 1,
    sound: "plasma",
    emoji: "🔮",
    accuracy: 0.12,
  },
];

interface Powerup {
  id: string;
  x: number;
  y: number;
  type: "HEALTH" | "AMMO" | "SHIELD";
  emoji: string;
  color: string;
}

export default function App() {
  // Game Screen Phase Control: "INTRO" | "PLAYING" | "GAMEOVER" | "LEVEL_COMPLETE" | "VICTORY_ALL"
  const [gameState, setGameState] = useState<"INTRO" | "PLAYING" | "GAMEOVER" | "LEVEL_COMPLETE" | "VICTORY_ALL">("INTRO");
  const [currentLevelId, setCurrentLevelId] = useState<string>("facility");
  const [showTutorial, setShowTutorial] = useState<boolean>(true);
  const [scanlines, setScanlines] = useState<boolean>(true);
  const [reticle, setReticle] = useState<string>("scope");
  const [mutedState, setMutedState] = useState<boolean>(true);
  const [isReloading, setIsReloading] = useState<boolean>(false);
  const isReloadingRef = useRef<boolean>(false);

  // Player State
  const [player, setPlayer] = useState<PlayerState>(() => {
    const lvl = LEVELS.facility;
    return {
      x: lvl.playerStartX,
      y: lvl.playerStartY,
      dirX: Math.cos(lvl.playerStartAngle),
      dirY: Math.sin(lvl.playerStartAngle),
      planeX: -Math.sin(lvl.playerStartAngle) * 0.66,
      planeY: Math.cos(lvl.playerStartAngle) * 0.66,
      angle: lvl.playerStartAngle,
      health: 100,
      maxHealth: 100,
      shield: 50,
      maxShield: 100,
      score: 0,
      kills: 0,
      currentWeaponIndex: 0,
      weapons: JSON.parse(JSON.stringify(INITIAL_WEAPONS)),
      isFiring: false,
      fireTimer: 0,
      isTakingDamage: false,
      damageTimer: 0,
      currentLevelId: "facility",
    };
  });

  // Dynamic Elements State
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [powerups, setPowerups] = useState<Powerup[]>([]);
  const [logs, setLogs] = useState<GameLog[]>([]);

  // Keyboard references tracking for high responsiveness
  const keysPressed = useRef<Set<string>>(new Set());
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const playerRef = useRef<PlayerState | null>(null);

  // WebSocket and Co-op variables
  const [otherPlayers, setOtherPlayers] = useState<RemotePlayer[]>([]);
  const [wsStatus, setWsStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected");
  const [customName, setCustomName] = useState<string>(() => {
    return localStorage.getItem("coop_player_name") || `Marine-${Math.floor(Math.random() * 899) + 100}`;
  });
  const [customColor, setCustomColor] = useState<string>(() => {
    return localStorage.getItem("coop_player_color") || "#06b6d4";
  });

  const wsRef = useRef<WebSocket | null>(null);
  const playerIdRef = useRef<string>(() => "p-" + Math.random().toString(36).substring(2, 9));
  const lastWsUpdateRef = useRef<number>(0);

  // Sync references to bypass closures in animation loop
  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  // Weapon tracer sparks factory for remote peer weapons firing
  const spawnLaserTracerParticles = (px: number, py: number, angle: number) => {
    createMuzzleGasParticles(px, py, angle);

    const list: Particle[] = [];
    const cosVal = Math.cos(angle);
    const sinVal = Math.sin(angle);
    
    // Spawn digital projectile sparks along the visual bullet tracer line
    for (let d = 0.5; d < 6.0; d += 0.8) {
      const tx = px + cosVal * d;
      const ty = py + sinVal * d;
      
      list.push({
        id: `trc-${Date.now()}-${Math.random()}-${d}`,
        x: tx,
        y: ty,
        vx: (Math.random() - 0.5) * 0.005,
        vy: (Math.random() - 0.5) * 0.005,
        color: "#22d3ee",
        size: 1.8,
        alpha: 0.85,
        life: 12,
      });
    }
    setParticles((prev) => [...prev, ...list]);
  };

  // Setup Live WebSocket Network synchronization loop
  useEffect(() => {
    let active = true;
    let reconnectTimeout: number | any = null;

    const connectWS = () => {
      if (!active) return;
      if (wsRef.current) return;

      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws`;

      setWsStatus("connecting");
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!active) {
          ws.close();
          return;
        }
        setWsStatus("connected");
        
        // Initial handshake to register player in specific arena quadrant
        const currentP = playerRef.current || player;
        const initialPayload = {
          id: playerIdRef.current,
          name: customName,
          color: customColor,
          x: currentP.x,
          y: currentP.y,
          dirX: currentP.dirX,
          dirY: currentP.dirY,
          angle: currentP.angle,
          health: currentP.health,
          score: currentP.score,
          kills: currentP.kills,
          currentWeaponIndex: currentP.currentWeaponIndex,
          levelId: currentP.currentLevelId,
        };
        ws.send(JSON.stringify({ type: "join", payload: initialPayload }));
      };

      ws.onmessage = (event) => {
        if (!active) return;
        try {
          const data = JSON.parse(event.data);
          const { type, payload } = data;

          switch (type) {
            case "welcome": {
              // Synchronize the current online squad list
              const peersList = payload.players.filter((p: any) => p.id !== playerIdRef.current);
              setOtherPlayers(peersList);
              break;
            }
            case "player:joined": {
              setOtherPlayers((prev) => {
                if (prev.some((p) => p.id === payload.id)) {
                  return prev.map((p) => (p.id === payload.id ? payload : p));
                }
                return [...prev, payload];
              });
              addLog(`🛰️ CO-OP LINK: ${payload.name.toUpperCase()} SECURED Quadrant`, "system");
              break;
            }
            case "player:updated": {
              setOtherPlayers((prev) => {
                const exists = prev.some((p) => p.id === payload.id);
                if (exists) {
                  return prev.map((p) => (p.id === payload.id ? payload : p));
                }
                return [...prev, payload];
              });
              break;
            }
            case "player:left": {
              const leavingId = payload.id;
              setOtherPlayers((prev) => {
                const leavingPeer = prev.find((p) => p.id === leavingId);
                if (leavingPeer) {
                  addLog(`🛰️ CO-OP LINK LOST: ${leavingPeer.name.toUpperCase()} departed quadrant`, "system");
                }
                return prev.filter((p) => p.id !== leavingId);
              });
              break;
            }
            case "player:fired": {
              const { originX, originY, angle } = payload;
              spawnLaserTracerParticles(originX, originY, angle);
              playPeerFired();
              
              setOtherPlayers((prev) =>
                prev.map((p) => (p.id === payload.id ? { ...p, isFiring: true } : p))
              );
              setTimeout(() => {
                setOtherPlayers((prev) =>
                  prev.map((p) => (p.id === payload.id ? { ...p, isFiring: false } : p))
                );
              }, 110);
              break;
            }
            case "chat:message": {
              const { sender, message, isSystem } = payload;
              addLog(`${sender}: ${message}`, isSystem ? "system" : "chat");
              if (!isSystem) {
                playChatNotification();
              }
              break;
            }
            case "pickup:consumed": {
              const { pickupId, collectedBy } = payload;
              setPowerups((prev) => prev.filter((pu) => pu.id !== pickupId));
              addLog(`🔋 ALLY SECURED SOURCE: ${collectedBy.toUpperCase()} retrieved powerup`, "system");
              break;
            }
          }
        } catch (err) {
          console.error("WS Parse Packet Error:", err);
        }
      };

      ws.onclose = () => {
        setWsStatus("disconnected");
        wsRef.current = null;
        setOtherPlayers([]);
        // Exponential backoff auto-reconnect trigger
        reconnectTimeout = setTimeout(connectWS, 4000);
      };

      ws.onerror = () => {
        setWsStatus("disconnected");
        if (wsRef.current) {
          wsRef.current.close();
        }
      };
    };

    connectWS();

    return () => {
      active = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [customName, customColor]);

  const activeLevel = LEVELS[currentLevelId] || LEVELS.facility;

  // Add Terminal combat telemetry details
  const addLog = (message: string, type: GameLog["type"] = "combat") => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const logId = `log-${Math.random().toString(36).substring(2, 6)}`;
    const newLog: GameLog = {
      id: logId,
      timestamp,
      message,
      type,
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 40));
  };

  // Trigger synthesized audio mute preference
  const toggleMute = () => {
    const newVal = !mutedState;
    setMutedState(newVal);
    setMuted(newVal);
    playSelect();
  };

  // Setup Key and Window listeners
  const fireRef = useRef<() => void>(() => {});
  const reloadRef = useRef<() => void>(() => {});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current.add(key);
      
      // Prevent browser scroll behaviors for navigation arrows or spacebar
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key)) {
        e.preventDefault();
      }

      // SPACE or ENTER fires weapons
      if (e.key === " " || e.key === "Enter") {
        fireRef.current();
      }

      // KEY R triggered manual ammunition reload cycle
      if (key === "r") {
        reloadRef.current();
      }

      // 1, 2, 3 selection keys for active weaponry swaps
      if (["1", "2", "3"].includes(key)) {
        const weaponIdx = parseInt(key) - 1;
        if (playerRef.current && weaponIdx < playerRef.current.weapons.length) {
          selectWeapon(weaponIdx);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Initialize Level structures
  const loadLevel = (levelId: string, resetStats: boolean = false) => {
    const level = LEVELS[levelId] || LEVELS.facility;
    
    // Spawn randomized safe-distance positions
    const spawns = initEnemiesForLevel(levelId);
    const mappedEnemies: Enemy[] = spawns.map((s) => {
      let hp = 35;
      let speed = 0.025;
      let scoreValue = 150;
      let avatar = "🤖";
      let color = "#22d3ee";
      let damage = 4;

      if (s.type === "SOLDIER") {
        hp = 65;
        speed = 0.038;
        scoreValue = 300;
        avatar = "🤖";
        color = "#eab308";
        damage = 8;
      } else if (s.type === "CYBER_DEMON") {
        hp = 220;
        speed = 0.018;
        scoreValue = 1000;
        avatar = "👹";
        color = "#ef4444";
        damage = 18;
      }

      return {
        id: s.id,
        type: s.type,
        x: s.x,
        y: s.y,
        health: hp,
        maxHealth: hp,
        speed,
        state: "IDLE",
        stateTimer: 0,
        damage,
        scoreValue,
        radius: 0.35,
        avatar,
        color,
        isHitFlash: false,
      };
    });

    // Spawn randomized localized powerups on level empty areas
    const powerupSpecs: { type: "HEALTH" | "AMMO" | "SHIELD"; emoji: string; color: string }[] = [
      { type: "HEALTH", emoji: "➕", color: "#10b981" },
      { type: "AMMO", emoji: "⚡", color: "#eab308" },
      { type: "SHIELD", emoji: "🛡️", color: "#3b82f6" },
    ];

    const powerupList: Powerup[] = [];
    const grid = level.wallGrid;
    let attempts = 0;
    while (powerupList.length < 4 && attempts < 100) {
      attempts++;
      const rx = Math.floor(Math.random() * (grid[0].length - 2)) + 1;
      const ry = Math.floor(Math.random() * (grid.length - 2)) + 1;
      if (grid[ry][rx] === 0) {
        // Safe check so they don't block the player or exit gates
        const isNearPlayer = Math.abs(rx - level.playerStartX) < 1.5 && Math.abs(ry - level.playerStartY) < 1.5;
        const alreadyHas = powerupList.some((p) => Math.floor(p.x) === rx && Math.floor(p.y) === ry);
        if (!isNearPlayer && !alreadyHas) {
          const spec = powerupSpecs[Math.floor(Math.random() * powerupSpecs.length)];
          powerupList.push({
            id: `pwr-${powerupList.length}-${Math.random().toString(36).substring(2, 4)}`,
            x: rx + 0.5,
            y: ry + 0.5,
            ...spec,
          });
        }
      }
    }

    // Set Level configuration states
    setCurrentLevelId(levelId);
    setEnemies(mappedEnemies);
    setPowerups(powerupList);
    setParticles([]);
    setPlayer((prev) => ({
      ...prev,
      x: level.playerStartX,
      y: level.playerStartY,
      dirX: Math.cos(level.playerStartAngle),
      dirY: Math.sin(level.playerStartAngle),
      planeX: -Math.sin(level.playerStartAngle) * 0.66,
      planeY: Math.cos(level.playerStartAngle) * 0.66,
      angle: level.playerStartAngle,
      currentLevelId: levelId,
      weapons: resetStats ? JSON.parse(JSON.stringify(INITIAL_WEAPONS)) : prev.weapons,
      health: resetStats ? 100 : Math.max(prev.health, 50),
      shield: resetStats ? 50 : Math.max(prev.shield, 30),
      score: resetStats ? 0 : prev.score,
      kills: resetStats ? 0 : prev.kills,
    }));

    // Notify peer clients about level shift
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "room:change",
        payload: {
          levelId,
          x: level.playerStartX,
          y: level.playerStartY,
          angle: level.playerStartAngle,
        }
      }));
    }

    setLogs([]);
    addLog(`LOADED ARENA: "${level.name}" [Difficulty: ${level.difficulty}]`, "level");
    addLog(level.description, "system");
    addLog("Tactical HUD Operational. Use W/A/S/D to slide and steer.", "system");
    
    // Play alert & music chimes
    playEnemyAlert();
  };

  // Launch fresh game from splash menu screen
  const handleStartGame = () => {
    setGameState("PLAYING");
    loadLevel("facility", true);
  };

  // Reload current level trigger
  const handleResetLevel = () => {
    loadLevel(currentLevelId, true);
    setGameState("PLAYING");
  };

  // Player shoot action handling
  const handleFireWeapon = () => {
    // Rely on fresh reference states
    const curPlayer = playerRef.current;
    if (!curPlayer || gameState !== "PLAYING" || curPlayer.isFiring) return;

    if (isReloadingRef.current) {
      addLog(`⚙️ WEAPON SYSTEM RELOADING! PLEASE STAND BY...`, "system");
      return;
    }

    const curWeapon = curPlayer.weapons[curPlayer.currentWeaponIndex];
    if (curWeapon.ammo <= 0) {
      addLog(`⚠️ MUNITIONS DEPLETED! NEED TO SELECT DIFFERENT WEAPON PACKS`, "ammo");
      playOutOfAmmo();
      return;
    }

    // Spend ammunition clip
    setPlayer((prev) => {
      const copyWeapons = [...prev.weapons];
      copyWeapons[prev.currentWeaponIndex].ammo = Math.max(0, copyWeapons[prev.currentWeaponIndex].ammo - 1);
      return {
        ...prev,
        weapons: copyWeapons,
        isFiring: true,
      };
    });

    // Play procedural synthesized blast tone
    if (curWeapon.sound === "pistol") playPistol();
    else if (curWeapon.sound === "shotgun") playShotgun();
    else if (curWeapon.sound === "plasma") playPlasma();

    // Spawn animated visual bullet eject debris particles!
    createMuzzleGasParticles(curPlayer.x, curPlayer.y, curPlayer.angle);

    // Broadcast firing to co-op squad peers
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "fire",
        payload: {
          weaponId: curWeapon.id,
          originX: curPlayer.x,
          originY: curPlayer.y,
          angle: curPlayer.angle,
        }
      }));
    }

    // Solve damage hit calculations straight down looking projection inside FOV
    // Bullet tracing down Center column of view projection (0 screen offset)
    setEnemies((prevEnemies) => {
      let targetEnemy: Enemy | null = null;
      let minDepth = Infinity;
      let targetIndex = -1;

      prevEnemies.forEach((enemy, idx) => {
        if (enemy.health <= 0) return;

        // Relative coordinate transform matrix calculation
        const dx = enemy.x - curPlayer.x;
        const dy = enemy.y - curPlayer.y;

        const invDet = 1.0 / (curPlayer.planeX * curPlayer.dirY - curPlayer.dirX * curPlayer.planeY);
        const transformX = invDet * (curPlayer.dirY * dx - curPlayer.dirX * dy);
        const transformY = invDet * (-curPlayer.planeY * dx + curPlayer.planeX * dy); // depth

        // If in front of player
        if (transformY > 0.1) {
          // Check screen horizontal alignment constraint
          const alignment = Math.abs(transformX / transformY);
          
          // Verify alignment with weapon fire spread/accuracy margins and screen visibility
          if (alignment < curWeapon.accuracy && transformY < curWeapon.range) {
            if (transformY < minDepth) {
              minDepth = transformY;
              targetEnemy = enemy;
              targetIndex = idx;
            }
          }
        }
      });

      // Issue hit registered impacts
      if (targetEnemy && targetIndex !== -1) {
        const hitted: Enemy = targetEnemy;
        const nextHp = Math.max(0, hitted.health - curWeapon.damage);
        const isDead = nextHp <= 0;

        // Create spark impacts at target coords
        createSparks(hitted.x, hitted.y, hitted.type === "DRONE" ? "#e11d48" : "#fbbf24");

        // Flash log details
        if (isDead) {
          // Killed notification
          setTimeout(() => {
            addLog(`⚡ DESTROYED: Rogue Hostile Units [${hitted.type}]! +${hitted.scoreValue} PTS`, "kill");
            playExplosion();
            
            // Accrue score logs
            setPlayer((prev) => ({
              ...prev,
              score: prev.score + hitted.scoreValue,
              kills: prev.kills + 1,
            }));
          }, 40);
        } else {
          // Regular damage impact log details
          addLog(`💥 Shot registered on ${hitted.type}. Damage: -${curWeapon.damage} HP`, "combat");
        }

        // Return updated list of enemies
        return prevEnemies.map((e, idx) =>
          idx === targetIndex
            ? {
                ...e,
                health: nextHp,
                state: nextHp <= 0 ? "DEAD" : "HURT",
                isHitFlash: true,
              }
            : e
        );
      } else {
        // Bullet hit blank boundaries
        addLog(`💨 Bullet struck structural walls (Missed Hostiles).`, "system");
        return prevEnemies;
      };
    });

    // Muzzle firing recoil duration
    setTimeout(() => {
      setPlayer((prev) => ({ ...prev, isFiring: false }));
    }, curWeapon.fireRate - 40);
  };

  // Manual reload event refilling weapon ammunition clips with temporary speed/charge delay
  const handleReloadWeapon = () => {
    const curPlayer = playerRef.current || player;
    if (!curPlayer || gameState !== "PLAYING") return;
    if (isReloadingRef.current || curPlayer.isFiring) return;

    const curWeapon = curPlayer.weapons[curPlayer.currentWeaponIndex];
    if (curWeapon.ammo === curWeapon.maxAmmo) {
      addLog(`🛡️ MUNITIONS CORES AT MAXIMUM CHARGE. NO RELOAD REQUIRED.`, "system");
      return;
    }

    setIsReloading(true);
    isReloadingRef.current = true;
    
    addLog(`🔄 RECONNECTING MUNITIONS PACK: Reloading ${curWeapon.name}...`, "ammo");
    playAmmoPickup();

    setTimeout(() => {
      setPlayer((prev) => {
        const copyWeapons = [...prev.weapons];
        copyWeapons[prev.currentWeaponIndex].ammo = copyWeapons[prev.currentWeaponIndex].maxAmmo;
        return {
          ...prev,
          weapons: copyWeapons,
        };
      });
      setIsReloading(false);
      isReloadingRef.current = false;
      addLog(`✅ ${curWeapon.name.toUpperCase()} MOUNTED & FULLY CHARGED!`, "system");
    }, 1500); // 1.5 seconds reload penalty delay
  };

  // Weapon swap selection methods
  const selectWeapon = (idx: number) => {
    if (idx < 0 || idx >= player.weapons.length) return;
    setPlayer((prev) => ({ ...prev, currentWeaponIndex: idx }));
    playSelect();
    addLog(`🔫 EQUIPPED ARSENAL MODULE: ${player.weapons[idx].name}`, "system");
  };

  // Keep references updated on every render
  fireRef.current = handleFireWeapon;
  reloadRef.current = handleReloadWeapon;

  // Muzzle spark graphics factory
  const createMuzzleGasParticles = (px: number, py: number, angle: number) => {
    const list: Particle[] = [];
    const cosVal = Math.cos(angle);
    const sinVal = Math.sin(angle);

    for (let i = 0; i < 5; i++) {
      const spreadAngle = angle + (Math.random() - 0.5) * 0.45;
      const speed = 0.04 + Math.random() * 0.05;
      list.push({
        id: `mzl-${Date.now()}-${Math.random()}-${i}`,
        x: px + cosVal * 0.4,
        y: py + sinVal * 0.4,
        vx: Math.cos(spreadAngle) * speed,
        vy: Math.sin(spreadAngle) * speed,
        color: Math.random() < 0.5 ? "#fbbf24" : "#f97316",
        size: 3 + Math.random() * 3,
        alpha: 0.95,
        life: 12 + Math.floor(Math.random() * 7),
      });
    }
    setParticles((prev) => [...prev, ...list]);
  };

  // Shock particles factory on target damage registering
  const createSparks = (ex: number, ey: number, color: string) => {
    const list: Particle[] = [];
    for (let i = 0; i < 7; i++) {
      const rot = Math.random() * Math.PI * 2;
      const spd = 0.02 + Math.random() * 0.03;
      list.push({
        id: `spk-${Date.now()}-${Math.random()}-${i}`,
        x: ex,
        y: ey,
        vx: Math.cos(rot) * spd,
        vy: Math.sin(rot) * spd,
        color,
        size: 2.5 + Math.random() * 3,
        alpha: 1.0,
        life: 8 + Math.floor(Math.random() * 10),
      });
    }
    setParticles((prev) => [...prev, ...list]);
  };

  // Wall collisions utilities
  const checkCollision = (targetX: number, targetY: number): boolean => {
    const sizeOffset = 0.28; // safe wall gap buffer distance
    const grid = activeLevel.wallGrid;
    const maxRow = grid.length;
    const maxCol = grid[0].length;

    for (const sx of [-sizeOffset, sizeOffset]) {
      for (const sy of [-sizeOffset, sizeOffset]) {
        const cx = Math.floor(targetX + sx);
        const cy = Math.floor(targetY + sy);
        if (cx < 0 || cx >= maxCol || cy < 0 || cy >= maxRow) return true;
        // Level completion gates (4) do not block movement
        if (grid[cy][cx] > 0 && grid[cy][cx] !== 4) return true;
      }
    }
    return false;
  };

  // Game Engine physics loop ticking (Ticks W/A/S/D coordinate changes, particle life cycles, AI states)
  useEffect(() => {
    if (gameState !== "PLAYING") {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    const tick = (time: number) => {
      // Setup delta rate
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const _dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      const pState = playerRef.current;
      if (!pState) {
        gameLoopRef.current = requestAnimationFrame(tick);
        return;
      }

      // 1. UPDATE PLAYER MOVEMENT (Keyboard responsive fluid gliding)
      const walkSpeed = 0.075; // tiles traversal units per frame tick
      const rotSpeed = 0.042; // radians steering per frame tick

      let moveX = 0;
      let moveY = 0;
      let rotDelta = 0;

      // Handle translation inputs
      if (keysPressed.current.has("w") || keysPressed.current.has("arrowup")) {
        moveX += pState.dirX * walkSpeed;
        moveY += pState.dirY * walkSpeed;
      }
      if (keysPressed.current.has("s") || keysPressed.current.has("arrowdown")) {
        moveX -= pState.dirX * walkSpeed;
        moveY -= pState.dirY * walkSpeed;
      }
      if (keysPressed.current.has("a") || keysPressed.current.has("arrowleft")) {
        rotDelta -= rotSpeed;
      }
      if (keysPressed.current.has("d") || keysPressed.current.has("arrowright")) {
        rotDelta += rotSpeed;
      }

      // Process looking rotation change values
      let nextPlayer = { ...pState };
      if (rotDelta !== 0) {
        const nextAngle = (pState.angle + rotDelta + Math.PI * 2) % (Math.PI * 2);
        nextPlayer.angle = nextAngle;
        nextPlayer.dirX = Math.cos(nextAngle);
        nextPlayer.dirY = Math.sin(nextAngle);
        nextPlayer.planeX = -Math.sin(nextAngle) * 0.66;
        nextPlayer.planeY = Math.cos(nextAngle) * 0.66;
        
        if (Math.random() < 0.06) playStep();
      }

      // Process collision checks and sliding coordinates step-by-step
      if (moveX !== 0 || moveY !== 0) {
        const projX = pState.x + moveX;
        const projY = pState.y + moveY;
        
        let slideX = pState.x;
        let slideY = pState.y;

        if (!checkCollision(projX, pState.y)) {
          slideX = projX;
        }
        if (!checkCollision(pState.x, projY)) {
          slideY = projY;
        }

        nextPlayer.x = slideX;
        nextPlayer.y = slideY;

        if (slideX !== pState.x || slideY !== pState.y) {
          if (Math.random() < 0.1) playStep();
        }
      }

      // 2. DETECT EXIT REVEAL PROTOCOL
      const currentCellX = Math.floor(nextPlayer.x);
      const currentCellY = Math.floor(nextPlayer.y);
      const cellValue = activeLevel.wallGrid[currentCellY]?.[currentCellX];

      if (cellValue === 4) {
        // Trigger exit protocols
        cancelAnimationFrame(gameLoopRef.current!);
        handleLevelEscape();
        return;
      }

      // 3. RETRIEVE REGEN POWERUPS COLLISION
      setPowerups((pwrList) => {
        const collected: string[] = [];
        pwrList.forEach((pwr) => {
          const dx = pwr.x - nextPlayer.x;
          const dy = pwr.y - nextPlayer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Overlap radius
          if (dist < 0.45) {
            collected.push(pwr.id);
            
            if (pwr.type === "HEALTH") {
              playHealthPickup();
            } else if (pwr.type === "AMMO") {
              playAmmoPickup();
            } else if (pwr.type === "SHIELD") {
              playShieldPickup();
            } else {
              playPickup();
            }

            // Notify other peer clients that this item is consumed
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({
                type: "pickup",
                payload: { pickupId: pwr.id }
              }));
            }

            // Apply benefits to state
            if (pwr.type === "HEALTH") {
              nextPlayer.health = Math.min(nextPlayer.maxHealth, nextPlayer.health + 30);
              addLog(`➕ RECONSTRUCTED ARMOR PLATING: Collected Medic Kit (+30 HP)`, "health");
            } else if (pwr.type === "AMMO") {
              const updatedWeapons = nextPlayer.weapons.map((w) => {
                const reloadVal = Math.min(w.maxAmmo, w.ammo + Math.floor(w.maxAmmo * 0.5));
                return { ...w, ammo: reloadVal };
              });
              nextPlayer.weapons = updatedWeapons;
              addLog(`⚡ RECHARGED MUNITIONS DRIVE: Refilled all ammo (+50%)`, "ammo");
            } else if (pwr.type === "SHIELD") {
              nextPlayer.shield = Math.min(nextPlayer.maxShield, nextPlayer.shield + 40);
              addLog(`🛡️ SYNCED BARRIER: Powered up Deflector Shield (+40 Shield)`, "health");
            }
          }
        });

        if (collected.length > 0) {
          return pwrList.filter((p) => !collected.includes(p.id));
        }
        return pwrList;
      });

      // Update Damage flash timer ticks
      if (nextPlayer.isTakingDamage && nextPlayer.damageTimer > 0) {
        nextPlayer.damageTimer--;
        if (nextPlayer.damageTimer <= 0) {
          nextPlayer.isTakingDamage = false;
        }
      }

      // Sync player coordinates
      setPlayer(nextPlayer);

      // Sync coordinates to WebSocket server in real-time (Throttled update rate)
      const now = Date.now();
      if (now - lastWsUpdateRef.current > 45) { // ~22 updates/sec
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: "update",
            payload: {
              x: nextPlayer.x,
              y: nextPlayer.y,
              dirX: nextPlayer.dirX,
              dirY: nextPlayer.dirY,
              angle: nextPlayer.angle,
              health: nextPlayer.health,
              score: nextPlayer.score,
              kills: nextPlayer.kills,
              currentWeaponIndex: nextPlayer.currentWeaponIndex,
              isFiring: nextPlayer.isFiring,
            }
          }));
        }
        lastWsUpdateRef.current = now;
      }

      // 4. ANIMATE HOSTILE ENEMY CHASE AI STATE ENGINE
      setEnemies((currentEnemies) => {
        return currentEnemies.map((enemy) => {
          if (enemy.health <= 0) return enemy;

          // Enemy hit flash cooldown tick
          let freshEnemy = { ...enemy };
          if (freshEnemy.isHitFlash) {
            freshEnemy.isHitFlash = false;
          }

          const dx = nextPlayer.x - freshEnemy.x;
          const dy = nextPlayer.y - freshEnemy.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Proximity Close combat combat actions
          if (dist < 0.6) {
            freshEnemy.state = "ATTACKING";
            freshEnemy.stateTimer++;

            // Strike rate interval (strikes player periodically every ~1 second)
            if (freshEnemy.stateTimer % 35 === 0) {
              setPlayer((p) => {
                if (p.health <= 0) return p;
                
                // Reduce health factoring barrier shield absorption (60% shield mitigation)
                const shieldAbsorb = Math.min(p.shield, Math.floor(freshEnemy.damage * 0.6));
                const finalDamage = freshEnemy.damage - shieldAbsorb;
                const nextHealth = Math.max(0, p.health - finalDamage);
                const nextShield = Math.max(0, p.shield - shieldAbsorb);

                playOof();
                addLog(`🚨 HULL CRISIS: Blocked hit by hostile droid. -${finalDamage} HP (Shielded -${shieldAbsorb})`, "combat");

                // Evaluate player demise bounds
                if (nextHealth <= 0) {
                  setTimeout(() => {
                    handlePlayerDemise();
                  }, 50);
                }

                return {
                  ...p,
                  health: nextHealth,
                  shield: nextShield,
                  isTakingDamage: true,
                  damageTimer: 10,
                };
              });
            }
          }
          // Distance medium alert parameters - chase player
          else if (dist > 0.6 && dist < 8.0) {
            freshEnemy.state = "CHASING";
            const dirX = dx / dist;
            const dirY = dy / dist;

            const nextEx = freshEnemy.x + dirX * freshEnemy.speed;
            const nextEy = freshEnemy.y + dirY * freshEnemy.speed;

            // Glide smoothly around walls check
            let resolvedX = freshEnemy.x;
            let resolvedY = freshEnemy.y;

            if (activeLevel.wallGrid[Math.floor(freshEnemy.y)]?.[Math.floor(nextEx)] === 0) {
              resolvedX = nextEx;
            }
            if (activeLevel.wallGrid[Math.floor(nextEy)]?.[Math.floor(freshEnemy.x)] === 0) {
              resolvedY = nextEy;
            }

            freshEnemy.x = resolvedX;
            freshEnemy.y = resolvedY;
          } else {
            freshEnemy.state = "IDLE";
          }

          return freshEnemy;
        });
      });

      // 5. UPDATE GRAPHICS PARTICLES DUST
      setParticles((prevParticles) => {
        return prevParticles
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            alpha: Math.max(0, p.alpha - 0.04),
            life: p.life - 1,
          }))
          .filter((p) => p.life > 0 && p.alpha > 0);
      });

      gameLoopRef.current = requestAnimationFrame(tick);
    };

    gameLoopRef.current = requestAnimationFrame(tick);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, currentLevelId]);

  // Handle successful elevator level exit escape
  const handleLevelEscape = () => {
    playVictory();
    
    // Evaluate if facility is completed, move to Wasteland next, or finish all
    if (currentLevelId === "facility") {
      setGameState("LEVEL_COMPLETE");
      addLog(`🏆 LEVEL COMPLETED! DELTA SECTOR CLEARED. ESCAPING LIFT ACTIVE`, "level");
    } else if (currentLevelId === "wasteland") {
      setGameState("LEVEL_COMPLETE");
      addLog(`🏆 OUTPOST WASTELAND SURVIVED! ESCAPED STORM FRONTS ESCORT ACTIVE`, "level");
    } else {
      setGameState("VICTORY_ALL");
      addLog(`✨ ALL ROGUE NODES PURGED SUCCESSFULLY! TOTAL CYBER DEMON CORE SAVED.`, "system");
    }
  };

  // Skip completion, move onto following area
  const advanceToNextLevel = () => {
    playTeleport();
    if (currentLevelId === "facility") {
      setGameState("PLAYING");
      loadLevel("wasteland");
    } else if (currentLevelId === "wasteland") {
      setGameState("PLAYING");
      loadLevel("hive");
    } else {
      setGameState("INTRO");
    }
  };

  // Demise protocol handler
  const handlePlayerDemise = () => {
    setGameState("GAMEOVER");
    addLog(`💀 CRITICAL ANNIHILATION DETECTED. CORE DOWN.`, "combat");
    playDefeat();
  };

  return (
    <div id="first-person-arena-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-mono selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* 🚀 Top Cyber Banner Header */}
      <header className="bg-slate-950 border-b border-slate-900 px-5 py-3.5 shadow-md flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-cyan-950/40 border border-cyan-800/40 rounded flex items-center justify-center text-cyan-400 relative">
            <Gamepad2 className="w-5 h-5 text-cyan-400" />
            <span className="absolute -bottom-1 -right-1 bg-red-650 text-white font-mono text-[8px] px-1 rounded-full font-bold scale-90 border border-slate-900 animate-pulse">
              3D
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono tracking-widest text-cyan-400 font-bold uppercase py-0.5 px-2 rounded bg-cyan-950 border border-cyan-900/40">
                TAC-3D VIRTUAL ENGINE
              </span>
              <span className="block w-2 h-2 rounded-full bg-cyan-451 animate-ping" />
            </div>
            <h1 className="text-sm font-extrabold tracking-tight text-white uppercase mt-0.5">
              Battlefield Tactics <span className="text-xs text-slate-500 font-normal">Raycaster FPS</span>
            </h1>
          </div>
        </div>

        {/* Tactical status HUD */}
        <div className="hidden md:flex items-center gap-6 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>ACCUMULATED SCORE:</span>
            <span className="text-white font-bold">{player.score} PTS</span>
          </div>
          <div className="flex items-center gap-1.5 border-l border-slate-900 pl-6">
            <Target className="w-4 h-4 text-emerald-500" />
            <span>DROIDS SLAYED:</span>
            <span className="text-white font-bold">{player.kills} KIA</span>
          </div>
        </div>
      </header>

      {/* Main Deployment Matrix frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left column: Immersive Raycast Arena */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-slate-900/30 border border-slate-900 rounded-xl p-4 md:p-5 shadow-inner">
          
          <div className="flex justify-between items-center mb-3 select-none">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-350">
                ACTIVE COGNITIVE SPECTRUM VIEWPORT
              </span>
            </div>
            <div className="text-[10px] text-slate-500">
              {activeLevel.name} • [DIFF: {activeLevel.difficulty}]
            </div>
          </div>

          {/* Core Interactive Visual Raycast canvas */}
          {gameState === "INTRO" ? (
            <div className="w-full aspect-[4/3] rounded-lg bg-slate-950 border-2 border-slate-900 flex flex-col items-center justify-center p-6 text-center shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center bg-[radial-gradient(ellipse_at_center,_var(--alpha-color-900),_transparent)]" />
              <div className="z-10 bg-slate-950/90 p-6 md:p-8 rounded-xl border border-cyan-900/40 max-w-md">
                <div className="inline-flex p-3 rounded-full bg-cyan-950/80 border border-cyan-800/40 mb-4 text-cyan-450 animate-bounce">
                  <Gamepad2 className="w-8 h-8" />
                </div>
                <h2 className="text-base font-extrabold text-white uppercase tracking-wider">
                  Delta Hack: The Cyber Arena
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed mt-2 mb-5">
                  Hostile rogue drones and heavy mechanical steel demons have taken control of the Delta facilities. Maneuver through local corridors, pick up battery cells, and escape through the lift shafts!
                </p>
                <button
                  id="load-virtual-sim-btn"
                  onClick={handleStartGame}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold uppercase py-2 text-xs tracking-wider rounded transition-all duration-150 cursor-pointer border border-cyan-800"
                >
                  DEACTIVATE SAFE-LOCKS & BATTLE
                </button>
              </div>
            </div>
          ) : (
            /* Live core 3D Raycaster Canvas Screen element */
            <RaycasterScreen
              player={player}
              enemies={enemies}
              particles={particles}
              level={activeLevel}
              scanlines={scanlines}
              reticle={reticle}
              otherPlayers={otherPlayers}
              onFire={handleFireWeapon}
              gameState={gameState}
              onAdvanceLevel={advanceToNextLevel}
              onResetLevel={handleResetLevel}
              onExitToIntro={() => setGameState("INTRO")}
            />
          )}

          {/* Vital controls bar overlay dashboard */}
          {gameState === "PLAYING" && (
            <div className="mt-4 p-4 rounded-lg bg-slate-950/90 border border-slate-900 select-none">
              {/* Onscreen Steering/Firing controllers for tablet and touch preview devices */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="text-[10px] text-slate-500 max-w-[150px] font-sans leading-relaxed hidden sm:block">
                  <span className="text-cyan-400 font-mono">W / S:</span> Move Forward/Backward • <span className="text-cyan-400 font-mono">A / D:</span> Steer • <span className="text-cyan-400 font-mono">Space:</span> Shoot
                </div>
 
                {/* Micro on-screen D-pad */}
                <div className="flex items-center gap-2">
                  <button
                    onMouseDown={() => keysPressed.current.add("a")}
                    onMouseUp={() => keysPressed.current.delete("a")}
                    onTouchStart={() => keysPressed.current.add("a")}
                    onTouchEnd={() => keysPressed.current.delete("a")}
                    className="h-8 w-8 bg-slate-900 hover:bg-slate-850 active:bg-cyan-950 border border-slate-800 rounded flex items-center justify-center cursor-pointer text-slate-350 active:text-cyan-400 transition-colors"
                    title="Turn Left"
                  >
                    <ArrowBigLeft className="w-5 h-5" />
                  </button>
 
                  <div className="flex flex-col gap-1.5">
                    <button
                      onMouseDown={() => keysPressed.current.add("w")}
                      onMouseUp={() => keysPressed.current.delete("w")}
                      onTouchStart={() => keysPressed.current.add("w")}
                      onTouchEnd={() => keysPressed.current.delete("w")}
                      className="h-8 w-8 bg-slate-900 hover:bg-slate-850 active:bg-cyan-950 border border-slate-800 rounded flex items-center justify-center cursor-pointer text-slate-350 active:text-cyan-400 transition-colors"
                      title="Move Forward"
                    >
                      <ArrowBigUp className="w-5 h-5" />
                    </button>
                    <button
                      onMouseDown={() => keysPressed.current.add("s")}
                      onMouseUp={() => keysPressed.current.delete("s")}
                      onTouchStart={() => keysPressed.current.add("s")}
                      onTouchEnd={() => keysPressed.current.delete("s")}
                      className="h-8 w-8 bg-slate-900 hover:bg-slate-850 active:bg-cyan-950 border border-slate-800 rounded flex items-center justify-center cursor-pointer text-slate-350 active:text-cyan-400 transition-colors"
                      title="Move Backward"
                    >
                      <ArrowBigDown className="w-5 h-5" />
                    </button>
                  </div>
 
                  <button
                    onMouseDown={() => keysPressed.current.add("d")}
                    onMouseUp={() => keysPressed.current.delete("d")}
                    onTouchStart={() => keysPressed.current.add("d")}
                    onTouchEnd={() => keysPressed.current.delete("d")}
                    className="h-8 w-8 bg-slate-900 hover:bg-slate-850 active:bg-cyan-950 border border-slate-800 rounded flex items-center justify-center cursor-pointer text-slate-350 active:text-cyan-400 transition-colors"
                    title="Turn Right"
                  >
                    <ArrowBigRight className="w-5 h-5" />
                  </button>
                </div>
 
                {/* Massive tactile red gun trigger shoot button */}
                <button
                  id="tactile-shoot-trigger"
                  onClick={handleFireWeapon}
                  className="px-4 py-3 bg-rose-650 hover:bg-rose-550 border border-rose-800/80 rounded font-black text-[11px] text-white tracking-widest uppercase cursor-pointer flex items-center gap-1 shadow-md hover:shadow-rose-950 animate-pulse"
                >
                  <Target className="w-4 h-4" />
                  <span>ENGAGE</span>
                </button>
              </div>
 
            </div>
          )}

        </div>

        {/* Right column: HUD control consoles */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Weapons selector */}
          <div className="shrink-0">
            <WeaponSelector
              weapons={player.weapons}
              currentIndex={player.currentWeaponIndex}
              onSelect={selectWeapon}
              isFiring={player.isFiring}
              isReloading={isReloading}
              onReload={handleReloadWeapon}
            />
          </div>

          {/* Cyber Co-op Link Hub */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 flex flex-col gap-2.5 font-mono select-none">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.55">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                <Gamepad2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>CO-OP BROADCAST LINK</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${wsStatus === "connected" ? "bg-emerald-500 animate-pulse" : wsStatus === "connecting" ? "bg-amber-500 animate-spin" : "bg-rose-500"}`} />
                <span className="text-[8px] uppercase font-bold text-slate-500">
                  {wsStatus}
                </span>
              </div>
            </div>

            {/* Identity Settings */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-[8px] uppercase font-bold">Call Sign</span>
                <input
                  type="text"
                  value={customName}
                  maxLength={12}
                  onChange={(e) => {
                    const val = e.target.value.substring(0, 12);
                    setCustomName(val);
                    localStorage.setItem("coop_player_name", val);
                  }}
                  className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                  placeholder="Name..."
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-[8px] uppercase font-bold">HUD Color</span>
                <select
                  value={customColor}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomColor(val);
                    localStorage.setItem("coop_player_color", val);
                  }}
                  className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-white focus:outline-none focus:border-cyan-500/50 text-[10px]"
                >
                  <option value="#06b6d4">Cyan Accent</option>
                  <option value="#10b981">Green Vitals</option>
                  <option value="#f59e0b">Amber Radar</option>
                  <option value="#ec4899">Pink Spectrum</option>
                  <option value="#a855f7">Purple Neon</option>
                </select>
              </div>
            </div>

            {/* Active co-op squad list */}
            <div className="bg-slate-900/40 rounded border border-slate-900 p-1.5 max-h-[85px] overflow-y-auto space-y-1">
              {otherPlayers.length === 0 ? (
                <div className="text-[9px] text-slate-600 italic text-center py-1">
                  No remote squad mates in current quadrant.
                </div>
              ) : (
                otherPlayers.map((peer) => (
                  <div key={peer.id} className="flex items-center justify-between text-[10px] bg-slate-950/50 border border-slate-900 p-1 rounded">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: peer.color }} />
                      <span className="text-white font-medium">{peer.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] text-slate-400">
                      <span>🛡️ HP: {peer.health}%</span>
                      <span>🏆 K: {peer.kills}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Tactical Squad Chat Transceiver */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const input = form.elements.namedItem("chatMessage") as HTMLInputElement;
                const msg = input.value.trim();
                if (msg && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                  wsRef.current.send(JSON.stringify({
                    type: "chat:message",
                    payload: { message: msg }
                  }));
                  input.value = "";
                }
              }}
              className="flex gap-1.5"
            >
              <input
                name="chatMessage"
                type="text"
                placeholder="SEND TACTICAL CHANNEL CHAT..."
                maxLength={60}
                autoComplete="off"
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-white placeholder-slate-600 flex-1 focus:outline-none focus:border-cyan-500/50"
              />
              <button
                type="submit"
                className="bg-cyan-950/80 border border-cyan-800/40 hover:bg-cyan-900 text-cyan-400 px-2.5 py-1 text-[9px] font-bold rounded uppercase whitespace-nowrap cursor-pointer hover:border-cyan-500 transition-colors"
              >
                SEND
              </button>
            </form>
          </div>

          {/* Combat telemetry feeds logs */}
          <div className="flex-1 flex flex-col min-h-[160px] md:min-h-[200px]">
            <BattleLogs
              logs={logs}
              onClear={() => setLogs([])}
            />
          </div>

          {/* Quick diagnostic Settings bar */}
          <div className="p-3 bg-slate-950/80 border border-slate-805 rounded-lg flex items-center justify-between text-xs font-mono select-none shrink-0 text-slate-500">
            <div className="flex items-center gap-3">
              <button
                id="toggle-sound-mute"
                onClick={toggleMute}
                className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1 p-1 rounded hover:bg-slate-900"
                title={mutedState ? "Unmute Tactical SFX" : "Mute Sound"}
              >
                {mutedState ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                <span className={!mutedState ? "text-cyan-400" : ""}>{mutedState ? "MUTED" : "SOUND: ON"}</span>
              </button>
              
              <button
                id="toggle-help-manual"
                onClick={() => setShowTutorial(true)}
                className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1 p-1 rounded hover:bg-slate-900"
              >
                <HelpCircle className="w-4 h-4" />
                <span>MANUAL</span>
              </button>
            </div>

            {/* CRT filters toggler */}
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                id="crt-scanlines-opt"
                type="checkbox"
                checked={scanlines}
                onChange={() => setScanlines(!scanlines)}
                className="form-checkbox h-3.5 w-3.5 rounded text-cyan-500 bg-slate-900 border-slate-800"
              />
              <span className={scanlines ? "text-cyan-455" : ""}>CRT HUD</span>
            </label>
          </div>

        </div>

      </main>

      {/* 📚 Help & Operations Guidelines Briefing modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in select-none">
          <div className="bg-slate-900 border-2 border-cyan-800/80 rounded-xl max-w-md w-full p-5 shadow-2xl relative">
            <div className="text-center">
              <div className="inline-flex p-3 rounded-full bg-cyan-950/80 border border-cyan-800/40 mb-3 animate-bounce">
                <Info className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                COMM-BRIEF: OPERATION DELTA PURGE
              </h3>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5 mb-4">
                BLUE ALLIANCE INTELLIGENCE INTERFACE
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              
              <div className="p-3 bg-slate-950/80 rounded border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-405 flex items-center gap-1 border-b border-slate-800 pb-1 uppercase text-[10px]">
                  <span>1. Combat Maneuver Deck</span>
                </div>
                <div className="space-y-1 text-[10.5px] leading-relaxed text-slate-400">
                  <p>• <strong>Steer & Slide:</strong> Use W/S keys to step forward/backward, and A/D keys to rotate screen camera. Alternatively, use navigation arrow-pads on mobile/tablet viewports.</p>
                  <p>• <strong>Fire Weaponry:</strong> Tap Spacebar, Enter, or the onscreen <strong>ENGAGE</strong> button to shoot down centers lines of sight.</p>
                  <p>• <strong>Inventory Swap [1, 2, 3]:</strong> Click weapon names layout cards on HUD to equip Gauss pistols, shotguns, or automatic Gauss pulse blasters.</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-405 flex items-center gap-1 border-b border-slate-800 pb-1 uppercase text-[10px]">
                  <span>2. Exploration Power-ups</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center text-slate-405">
                  <div className="bg-slate-900/50 p-1.5 rounded border border-rose-950/40">
                    <span className="block text-sm">➕</span>
                    <strong className="text-rose-455">Medic Kit</strong>
                    <span className="block text-[8px] text-slate-500 mt-0.5">+30 HP</span>
                  </div>
                  <div className="bg-slate-900/50 p-1.5 rounded border border-blue-950/40">
                    <span className="block text-sm">🛡️</span>
                    <strong className="text-blue-400">Shield</strong>
                    <span className="block text-[8px] text-slate-500 mt-0.5">+40 Barrier</span>
                  </div>
                  <div className="bg-slate-900/50 p-1.5 rounded border border-amber-950/40">
                    <span className="block text-sm">⚡</span>
                    <strong className="text-amber-500">Amunition</strong>
                    <span className="block text-[8px] text-slate-500 mt-0.5">+50% Ammo</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-505 italic text-center leading-relaxed">
                Ensure computer audio volume is level to play synthesized procedurally-generated retro battle effects!
              </div>

            </div>

            <div className="mt-4">
              <button
                id="close-manual-brief-btn"
                onClick={() => {
                  setShowTutorial(false);
                  playSelect();
                }}
                className="w-full cursor-pointer bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold uppercase py-2.5 rounded text-[11px] tracking-wider transition-all duration-150 shadow-md font-mono"
              >
                DISMISS BRIEF & DEPLOY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Retro Slate Footnote */}
      <footer className="bg-slate-950 border-t border-slate-900 px-4 py-2 flex items-center justify-between text-[10px] text-slate-500 select-none">
        <span>COGNITIVE MATRIX LINK ACTIVE [v1.5]</span>
        <span>DEPLOYMENT STATUS: ONLINE</span>
      </footer>

    </div>
  );
}
