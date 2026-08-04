import React, { useState, useEffect, useRef } from 'react';
import { PlacedStructure, PlacedUnit, Faction, MapCell, LogMessage } from '../types';
import { GRID_SIZE, INITIAL_MAP_DECORATION, STRUCTURES_DATA, DEFENSES_DATA, INFANTRY_DATA, VEHICLES_DATA, RETRO_QUOTES } from '../constants/gameData';
import { playSynthSound } from '../utils/audioSynth';
import { Play, ShieldAlert, Crosshair, Target, Hammer, Zap, Plus, Flame, Sparkles, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface BattleGridProps {
  faction: Faction;
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  structures: PlacedStructure[];
  setStructures: React.Dispatch<React.SetStateAction<PlacedStructure[]>>;
  units: PlacedUnit[];
  setUnits: React.Dispatch<React.SetStateAction<PlacedUnit[]>>;
  placementItem: { id: string; name: string; cost: number; category: 'STRUCTURES' | 'DEFENSES'; icon: string } | null;
  setPlacementItem: (item: null) => void;
  onAddLogMessage: (text: string, type: 'info' | 'warning' | 'danger' | 'success') => void;
  powerStatus: { prod: number; cons: number };
  webSocketSend?: (type: string, payload: any) => void;
  otherCommanders?: any[];
}

interface ActionEffect {
  id: string;
  type: 'laser' | 'tesla' | 'bullet' | 'explosion' | 'psychic' | 'ore_collect' | 'flame';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  timer: number;
}

interface DamageIndicator {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  createdAt: number;
}

interface FlashingCell {
  id: string;
  x: number;
  y: number;
  color: 'red' | 'orange' | 'green';
  createdAt: number;
}

export default function BattleGrid({
  faction,
  credits,
  setCredits,
  structures,
  setStructures,
  units,
  setUnits,
  placementItem,
  setPlacementItem,
  onAddLogMessage,
  powerStatus,
  webSocketSend,
  otherCommanders,
}: BattleGridProps) {
  const [hoverCell, setHoverCell] = useState<{ x: number; y: number } | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [waveLevel, setWaveLevel] = useState<number>(1);
  const [waveTimer, setWaveTimer] = useState<number>(25); // auto wave countdown
  const [effects, setEffects] = useState<ActionEffect[]>([]);
  const [damageIndicators, setDamageIndicators] = useState<DamageIndicator[]>([]);
  const [flashingCells, setFlashingCells] = useState<FlashingCell[]>([]);
  const [isSpawnMenuOpen, setIsSpawnMenuOpen] = useState(false);
  const [isIsometric, setIsIsometric] = useState(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1.2);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);

  const isDraggingRef = useRef(false);
  const startMousePosRef = useRef({ x: 0, y: 0 });
  const startPanRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 || e.button === 2) {
      isDraggingRef.current = false;
      startMousePosRef.current = { x: e.clientX, y: e.clientY };
      startPanRef.current = { x: panX, y: panY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (startMousePosRef.current.x === 0 && startMousePosRef.current.y === 0) return;
    const dx = e.clientX - startMousePosRef.current.x;
    const dy = e.clientY - startMousePosRef.current.y;
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      isDraggingRef.current = true;
      setPanX(startPanRef.current.x + dx);
      setPanY(startPanRef.current.y + dy);
    }
  };

  const handleMouseUp = () => {
    startMousePosRef.current = { x: 0, y: 0 };
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 60);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = 30;
    if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
      e.preventDefault();
      setPanY(prev => prev + step);
    } else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
      e.preventDefault();
      setPanY(prev => prev - step);
    } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
      e.preventDefault();
      setPanX(prev => prev + step);
    } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
      e.preventDefault();
      setPanX(prev => prev - step);
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      setZoomLevel(prev => Math.min(3.0, Number((prev + 0.2).toFixed(1))));
    } else if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      setZoomLevel(prev => Math.max(0.6, Number((prev - 0.2).toFixed(1))));
    }
  };

  const audioIntervalRef = useRef<Record<string, number>>({});

  // Lazy initialize map
  const [mapCells, setMapCells] = useState<MapCell[]>(INITIAL_MAP_DECORATION);

  // Helper to check if a coordinate is within 2 cells of an ore/gem deposit
  const checkNearOreDeposit = (x: number, y: number) => {
    return mapCells.some(c => 
      (c.type === 'ore' || c.type === 'gem') && 
      Math.max(Math.abs(c.x - x), Math.abs(c.y - y)) <= 2
    );
  };

  // Auto-regeneration of credits from Ore Purifiers and Ore Refinery (Runs every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      // Find placed Ore Refinery / Purifiers that are active AND near an ore/gem deposit
      const functioningRefineries = structures.filter(s => {
        if (!s.active || !s.type.includes('ore')) return false;
        return mapCells.some(c => 
          (c.type === 'ore' || c.type === 'gem') && 
          Math.max(Math.abs(c.x - s.x), Math.abs(c.y - s.y)) <= 2
        );
      });

      if (functioningRefineries.length > 0) {
        // Increment credits per active near-ore refinery every 5 seconds (+$150 credits per refinery)
        const bonus = functioningRefineries.length * 150;
        setCredits(prev => Math.min(prev + bonus, 99999));
        
        // Spawn floating indicators and visual effects for each active harvester
        functioningRefineries.forEach(s => {
          // Add floating indicator +$150 over the refinery
          setDamageIndicators(prev => [
            ...prev,
            {
              id: `ore_inc_${Date.now()}_${Math.random()}`,
              x: s.x,
              y: s.y,
              text: '+$150',
              color: 'text-yellow-400 font-extrabold bg-neutral-900/90 border border-yellow-500/50 px-1.5 py-0.5 rounded shadow-lg animate-bounce',
              createdAt: Date.now()
            }
          ]);

          // Trigger ore_collect animation effect
          setEffects(prev => [
            ...prev,
            {
              id: Math.random().toString(),
              type: 'ore_collect',
              startX: s.x,
              startY: s.y,
              endX: s.x,
              endY: s.y - 0.8,
              timer: 0.6,
            }
          ]);
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [structures, mapCells, setCredits]);

  // Wave Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setWaveTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync wave timer and trigger enemy wave when it hits 0
  useEffect(() => {
    if (waveTimer <= 0) {
      triggerEnemyWave();
      setWaveTimer(25); // reset to default 25
    }
  }, [waveTimer]);

  // Main real-time simulation interval (move units, trigger attacks, clean effects)
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Progress Unit Movements
      setUnits(prevUnits => {
        return prevUnits.map(unit => {
          const dx = unit.targetX - unit.x;
          const dy = unit.targetY - unit.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 0.05) {
            // Speed adjusted to tick-rate (0.1s tick)
            const step = (unit.speed * 0.1);
            const moveX = unit.x + (dx / dist) * Math.min(step, dist);
            const moveY = unit.y + (dy / dist) * Math.min(step, dist);
            
            // Calculate angle
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            return {
              ...unit,
              x: moveX,
              y: moveY,
              angle: Math.round(angle),
            };
          }
          return {
            ...unit,
            x: unit.targetX,
            y: unit.targetY,
          };
        });
      });

      // 2. Clear out brief visual effects
      setEffects(prev => prev.map(eff => ({ ...eff, timer: eff.timer - 0.1 })).filter(eff => eff.timer > 0));

      // Move damage indicators upwards and fade them out
      setDamageIndicators(prev => prev
        .map(ind => ({ ...ind, y: ind.y - 0.05 }))
        .filter(ind => Date.now() - ind.createdAt < 1200)
      );

      // Expire flashing cells
      setFlashingCells(prev => prev.filter(fc => Date.now() - fc.createdAt < 300));

      // 3. Combat Logic: Defenses & Units Firing at Enemies
      performCombatSimulation();

    }, 100);

    return () => clearInterval(interval);
  }, [structures, units]);

  // Handle combat scans and action triggers
  const performCombatSimulation = () => {
    const now = Date.now();
    const soundThrottle = (key: string, limit: number) => {
      const last = audioIntervalRef.current[key] || 0;
      if (now - last > limit) {
        audioIntervalRef.current[key] = now;
        return true;
      }
      return false;
    };

    // Make local mutable copies or triggers
    let spawnedEffects: ActionEffect[] = [];
    let updatedStructures = [...structures];
    let updatedUnits = [...units];
    let logs: { text: string; type: 'info' | 'warning' | 'danger' | 'success' }[] = [];
    let newDamageIndicators: DamageIndicator[] = [];
    let newFlashingCells: FlashingCell[] = [];

    // Filter actors
    const playerUnits = updatedUnits.filter(u => u.owner === 'PLAYER' && u.hp > 0);
    const enemyUnits = updatedUnits.filter(u => u.owner === 'ENEMY' && u.hp > 0);
    const defenses = updatedStructures.filter(s => s.active && s.hp > 0);

    // Allied/Soviet/Yuri Defenses Target Finder
    defenses.forEach(def => {
      // Prism Tower, Tesla Coil, Gatling or Turret
      const isDefensiveWeapon = ['prism', 'tesla', 'gatling', 'turret', 'psychic'].some(term => def.type.toLowerCase().includes(term));
      if (!isDefensiveWeapon) return;

      // Rate limit fire rate (around 1.5 seconds)
      if (def.lastFired && now - def.lastFired < 1500) return;

      // Find closest enemy unit inside range (range ~ 4.5 cells)
      let bestTarget: PlacedUnit | null = null;
      let minDistance = 5.0; // defense targeting distance limit

      enemyUnits.forEach(enemy => {
        const dist = Math.sqrt(Math.pow(enemy.x - def.x, 2) + Math.pow(enemy.y - def.y, 2));
        if (dist < minDistance) {
          minDistance = dist;
          bestTarget = enemy;
        }
      });

      if (bestTarget) {
        const target = bestTarget as PlacedUnit;
        const targetIndex = updatedUnits.findIndex(u => u.id === target.id);
        if (targetIndex !== -1) {
          // Calculate weapon damage based on structure type
          let dmg = 45;
          let effectType: 'laser' | 'tesla' | 'bullet' | 'psychic' = 'bullet';

          if (def.type.includes('tesla')) {
            dmg = 120; // Soviet extreme damage
            effectType = 'tesla';
            if (soundThrottle('tesla', 900)) playSynthSound('tesla_zap');
          } else if (def.type.includes('prism')) {
            // Allies prism amplification
            // Boost dmg based on other adjacent allied structures
            const adjacentCount = defenses.filter(o => o.id !== def.id && o.type.includes('prism') && 
              Math.sqrt(Math.pow(o.x - def.x, 2) + Math.pow(o.y - def.y, 2)) < 3.5).length;
            dmg = 80 + (adjacentCount * 40); 
            effectType = 'laser';
            if (soundThrottle('prism', 900)) playSynthSound('prism_fire');
          } else if (def.type.includes('psychic')) {
            dmg = 60;
            effectType = 'psychic';
            if (soundThrottle('psychic', 1200)) playSynthSound('psychic_blast');
          } else {
            // standard rapid bullet turret
            dmg = 30;
            effectType = 'bullet';
            if (soundThrottle('bullet', 300)) playSynthSound('bullet');
          }

          // Apply damage
          updatedUnits[targetIndex].hp = Math.max(0, updatedUnits[targetIndex].hp - dmg);
          def.lastFired = now;

          newDamageIndicators.push({
            id: `dmg_${Date.now()}_${Math.random()}`,
            x: target.x,
            y: target.y,
            text: `-${dmg}`,
            color: 'text-red-500 font-extrabold bg-red-950/70 border border-red-500/35 px-1 rounded shadow-md h-fit text-[9px]',
            createdAt: now
          });
          newFlashingCells.push({
            id: `flash_${Date.now()}_${Math.random()}`,
            x: Math.round(target.x),
            y: Math.round(target.y),
            color: 'red',
            createdAt: now
          });

          // Track weapon beam
          spawnedEffects.push({
            id: Math.random().toString(),
            type: effectType,
            startX: def.x + 0.5,
            startY: def.y + 0.5,
            endX: target.x + 0.5,
            endY: target.y + 0.5,
            timer: 0.35
          });

          // If target killed
          if (updatedUnits[targetIndex].hp <= 0) {
            logs.push({ text: `Target eliminated at cell ${Math.round(target.x)}, ${Math.round(target.y)}`, type: 'info' });
            newDamageIndicators.push({
              id: `dmg_ko_${Date.now()}_${Math.random()}`,
              x: target.x,
              y: target.y,
              text: 'K.O.',
              color: 'text-orange-400 font-black bg-neutral-900 border border-orange-500/50 px-1 rounded shadow-lg text-[10px] uppercase',
              createdAt: now
            });
            newFlashingCells.push({
              id: `flash_die_${Date.now()}_${Math.random()}`,
              x: Math.round(target.x),
              y: Math.round(target.y),
              color: 'orange',
              createdAt: now
            });
            spawnedEffects.push({
              id: Math.random().toString(),
              type: 'explosion',
              startX: target.x + 0.5,
              startY: target.y + 0.5,
              endX: target.x + 0.5,
              endY: target.y + 0.5,
              timer: 0.5
            });
            if (soundThrottle('explosion', 500)) playSynthSound('explosion');
          }
        }
      }
    });

    // Player units shooting back at nearest enemies
    playerUnits.forEach(u => {
      if (now - u.lastFired < 1200) return;

      let closestEnemy: PlacedUnit | null = null;
      let minDistance = u.range;

      enemyUnits.forEach(enemy => {
        const dist = Math.sqrt(Math.pow(enemy.x - u.x, 2) + Math.pow(enemy.y - u.y, 2));
        if (dist < minDistance) {
          minDistance = dist;
          closestEnemy = enemy;
        }
      });

      if (closestEnemy) {
        const enemy = closestEnemy as PlacedUnit;
        const enemyIdx = updatedUnits.findIndex(eu => eu.id === enemy.id);
        if (enemyIdx !== -1) {
          // Shoot
          updatedUnits[enemyIdx].hp = Math.max(0, updatedUnits[enemyIdx].hp - u.damage);
          u.lastFired = now;

          newDamageIndicators.push({
            id: `dmg_enemy_${Date.now()}_${Math.random()}`,
            x: enemy.x,
            y: enemy.y,
            text: `-${u.damage}`,
            color: 'text-red-400 font-extrabold bg-red-950/70 border border-red-500/35 px-1 rounded shadow-md h-fit text-[9px]',
            createdAt: now
          });
          newFlashingCells.push({
            id: `flash_enemy_${Date.now()}_${Math.random()}`,
            x: Math.round(enemy.x),
            y: Math.round(enemy.y),
            color: 'red',
            createdAt: now
          });

          spawnedEffects.push({
            id: Math.random().toString(),
            type: u.synthType === 'laser' ? 'laser' : u.synthType === 'tesla' ? 'tesla' : 'bullet',
            startX: u.x + 0.5,
            startY: u.y + 0.5,
            endX: enemy.x + 0.5,
            endY: enemy.y + 0.5,
            timer: 0.25
          });

          if (soundThrottle(u.id, 900)) {
            if (u.synthType === 'laser') playSynthSound('prism_fire');
            else if (u.synthType === 'tesla') playSynthSound('tesla_zap');
            else playSynthSound('bullet');
          }

          if (updatedUnits[enemyIdx].hp <= 0) {
            newDamageIndicators.push({
              id: `dmg_enemy_ko_${Date.now()}_${Math.random()}`,
              x: enemy.x,
              y: enemy.y,
              text: 'K.O.',
              color: 'text-orange-400 font-black bg-neutral-900 border border-orange-500/50 px-1 rounded shadow-lg text-[10px] uppercase',
              createdAt: now
            });
            newFlashingCells.push({
              id: `flash_enemy_die_${Date.now()}_${Math.random()}`,
              x: Math.round(enemy.x),
              y: Math.round(enemy.y),
              color: 'orange',
              createdAt: now
            });

            newDamageIndicators.push({
              id: `dmg_promo_${Date.now()}_${Math.random()}`,
              x: u.x,
              y: u.y - 0.4,
              text: '★ PROMOTED ★',
              color: 'text-green-400 font-black bg-green-950/80 border border-green-500 px-1.5 rounded shadow-lg text-[10px] animate-pulse whitespace-nowrap',
              createdAt: now
            });
            newFlashingCells.push({
              id: `flash_promo_${Date.now()}_${Math.random()}`,
              x: Math.round(u.x),
              y: Math.round(u.y),
              color: 'green',
              createdAt: now
            });

            spawnedEffects.push({
              id: Math.random().toString(),
              type: 'explosion',
              startX: enemy.x + 0.5,
              startY: enemy.y + 0.5,
              endX: enemy.x + 0.5,
              endY: enemy.y + 0.5,
              timer: 0.5
            });
            playSynthSound('unit_promoted');
            logs.push({ text: `Your ${u.type.toUpperCase()} promoted! Unit gained veteran experience.`, type: 'success' });
          }
        }
      }
    });

    // Enemies shooting at closest structure or Player unit
    enemyUnits.forEach(enemy => {
      // Kirov or Heavy armor speed tick/bombing
      if (enemy.isKirov) {
        // Slow move downward towards construction yard
        enemy.targetY = GRID_SIZE - 2;
        enemy.targetX = GRID_SIZE / 2;
      }

      if (now - enemy.lastFired < 1600) return;

      // Find closest player target (either PlacedUnit or PlacedStructure)
      let bestPUnit: PlacedUnit | null = null;
      let pDist = enemy.range;
      playerUnits.forEach(pu => {
        const dist = Math.sqrt(Math.pow(pu.x - enemy.x, 2) + Math.pow(pu.y - enemy.y, 2));
        if (dist < pDist) {
          pDist = dist;
          bestPUnit = pu;
        }
      });

      if (bestPUnit) {
        const target = bestPUnit as PlacedUnit;
        const targetIdx = updatedUnits.findIndex(pu => pu.id === target.id);
        if (targetIdx !== -1) {
          updatedUnits[targetIdx].hp = Math.max(0, updatedUnits[targetIdx].hp - enemy.damage);
          enemy.lastFired = now;

          newDamageIndicators.push({
            id: `dmg_friendly_${Date.now()}_${Math.random()}`,
            x: target.x,
            y: target.y,
            text: `-${enemy.damage}`,
            color: 'text-red-600 font-extrabold bg-red-950/70 border border-red-500/40 px-1 rounded shadow-md h-fit text-[9px]',
            createdAt: now
          });
          newFlashingCells.push({
            id: `flash_friendly_${Date.now()}_${Math.random()}`,
            x: Math.round(target.x),
            y: Math.round(target.y),
            color: 'red',
            createdAt: now
          });

          spawnedEffects.push({
            id: Math.random().toString(),
            type: enemy.isKirov ? 'flame' : 'bullet',
            startX: enemy.x + 0.5,
            startY: enemy.y + 0.5,
            endX: target.x + 0.5,
            endY: target.y + 0.5,
            timer: 0.25
          });

          if (enemy.isKirov) {
            if (soundThrottle('kirov_atk', 1000)) playSynthSound('explosion');
          } else {
            if (soundThrottle('bullet_env', 500)) playSynthSound('bullet');
          }

          if (updatedUnits[targetIdx].hp <= 0) {
            newDamageIndicators.push({
              id: `dmg_friendly_lost_${Date.now()}_${Math.random()}`,
              x: target.x,
              y: target.y,
              text: 'LOST',
              color: 'text-red-500 font-black bg-red-950 border border-red-600 px-1 rounded shadow-lg text-[10px] uppercase',
              createdAt: now
            });
            newFlashingCells.push({
              id: `flash_friendly_die_${Date.now()}_${Math.random()}`,
              x: Math.round(target.x),
              y: Math.round(target.y),
              color: 'red',
              createdAt: now
            });
            spawnedEffects.push({
              id: Math.random().toString(),
              type: 'explosion',
              startX: target.x + 0.5,
              startY: target.y + 0.5,
              endX: target.x + 0.5,
              endY: target.y + 0.5,
              timer: 0.5
            });
            logs.push({ text: `Warning: A Friendly unit was lost in skirmish!`, type: 'danger' });
          }
          return; // finish action
        }
      }

      // If no units in range, look for closest structure
      let bestStruct: PlacedStructure | null = null;
      let sDist = enemy.range + 1.0; // slightly wider search for target building
      updatedStructures.forEach(str => {
        if (str.hp <= 0) return;
        const dist = Math.sqrt(Math.pow(str.x - enemy.x, 2) + Math.pow(str.y - enemy.y, 2));
        if (dist < sDist) {
          sDist = dist;
          bestStruct = str;
        }
      });

      const target = bestStruct as PlacedStructure | null;
      if (target) {
        const wallIdx = updatedStructures.findIndex(s => s.id === (target).id);
        if (wallIdx !== -1) {
          updatedStructures[wallIdx].hp = Math.max(0, updatedStructures[wallIdx].hp - enemy.damage);
          enemy.lastFired = now;

          newDamageIndicators.push({
            id: `dmg_struct_${Date.now()}_${Math.random()}`,
            x: target.x,
            y: target.y,
            text: `-${enemy.damage}`,
            color: 'text-red-500 font-black bg-red-950/70 border border-red-500/40 px-1.5 rounded shadow-lg text-[9px]',
            createdAt: now
          });
          newFlashingCells.push({
            id: `flash_struct_${Date.now()}_${Math.random()}`,
            x: Math.round(target.x),
            y: Math.round(target.y),
            color: 'red',
            createdAt: now
          });

          spawnedEffects.push({
            id: Math.random().toString(),
            type: enemy.isKirov ? 'explosion' : 'bullet',
            startX: enemy.x + 0.5,
            startY: enemy.y + 0.5,
            endX: target.x + 0.5,
            endY: target.y + 0.5,
            timer: 0.3
          });

          if (enemy.isKirov) {
            playSynthSound('explosion');
          } else {
            playSynthSound('bullet');
          }

          if (updatedStructures[wallIdx].hp <= 0) {
            newDamageIndicators.push({
              id: `dmg_struct_destroyed_${Date.now()}_${Math.random()}`,
              x: target.x,
              y: target.y,
              text: 'DESTROYED',
              color: 'text-red-600 font-extrabold text-[12px] bg-neutral-900 border-2 border-red-600 px-1.5 rounded shadow-[0_0_15px_rgba(220,38,38,0.6)] uppercase animate-bounce',
              createdAt: now
            });
            newFlashingCells.push({
              id: `flash_struct_die_${Date.now()}_${Math.random()}`,
              x: Math.round(target.x),
              y: Math.round(target.y),
              color: 'orange',
              createdAt: now
            });
            logs.push({ text: `Warning: ${updatedStructures[wallIdx].type.replace('_', ' ').toUpperCase()} has been destroyed!`, type: 'danger' });
            spawnedEffects.push({
              id: Math.random().toString(),
              type: 'explosion',
              startX: target.x + 0.5,
              startY: target.y + 0.5,
              endX: target.x + 0.5,
              endY: target.y + 0.5,
              timer: 0.6
            });
            playSynthSound('explosion');
          }
        }
      }
    });

    // Apply clean ups and batch updates
    // Clear dead units and structures
    const survivedUnits = updatedUnits.filter(u => u.hp > 0);
    const survivedStructures = updatedStructures.filter(s => s.hp > 0);

    if (survivedUnits.length !== units.length) {
      setUnits(survivedUnits);
    }
    if (survivedStructures.length !== structures.length) {
      setStructures(survivedStructures);
    }
    if (spawnedEffects.length > 0) {
      setEffects(prev => [...prev, ...spawnedEffects]);
    }
    if (newDamageIndicators.length > 0) {
      setDamageIndicators(prev => [...prev, ...newDamageIndicators]);
    }
    if (newFlashingCells.length > 0) {
      setFlashingCells(prev => [...prev, ...newFlashingCells]);
    }
    // Feed logs
    logs.forEach(log => onAddLogMessage(log.text, log.type));
  };

  // Trigger an invasion wave of Yuri's mind-controlled units or rebel tanks
  const triggerEnemyWave = () => {
    onAddLogMessage(`Warning: Incoming Yuri Assault Wave #${waveLevel} detected! Counterstrike immediately!`, 'danger');
    playSynthSound('siren');

    const spawns: PlacedUnit[] = [];
    const count = 2 + waveLevel;

    for (let i = 0; i < count; i++) {
      const isKirovChance = waveLevel >= 3 && i === 1;
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = 0; // enter from upper edge

      spawns.push({
        id: `enemy_${Date.now()}_${i}`,
        type: isKirovChance ? 'Kirov Airship' : waveLevel % 2 === 0 ? 'Lasertank' : 'Conscript Invader',
        x,
        y: -1,
        targetX: Math.floor(Math.random() * GRID_SIZE),
        targetY: Math.floor(GRID_SIZE / 3 + Math.random() * (GRID_SIZE / 2)),
        owner: 'ENEMY',
        hp: isKirovChance ? 1500 : 180 + waveLevel * 30,
        maxHp: isKirovChance ? 1500 : 180 + waveLevel * 30,
        angle: 180,
        lastFired: 0,
        speed: isKirovChance ? 0.4 : 1.3,
        damage: isKirovChance ? 160 : 35 + waveLevel * 5,
        range: isKirovChance ? 1.5 : 2.5,
        synthType: isKirovChance ? 'flame' : 'bullet',
        color: '#ef4444', // Red Yuri Alert faction color
        isKirov: isKirovChance,
      });
    }

    setUnits(prev => [...prev, ...spawns]);
    setWaveLevel(prev => prev + 1);
  };

  // Grid Cell Click Actions: Building structures or ordering Units to walk
  const handleCellClick = (x: number, y: number) => {
    if (isDraggingRef.current) return;

    // 1. Placement Mode (place built building on the grid)
    if (placementItem) {
      // Check boundaries
      if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return;

      // Verify slot is clear
      const hasStructure = structures.some(s => s.x === x && s.y === y);
      const cell = mapCells.find(c => c.x === x && c.y === y);
      const isWater = cell?.type === 'water';

      if (hasStructure || isWater) {
        onAddLogMessage('Invalid coordinate! Slot occupied or water obstacle.', 'warning');
        playSynthSound('alert_low_power');
        return;
      }

      // Check if power deficit
      if (powerStatus.cons + Math.abs(placementItem.cost / 20) > powerStatus.prod && placementItem.category === 'DEFENSES') {
        onAddLogMessage('Warning: Place defense structure, but low power grid may disable its weapon!', 'warning');
      }

      // Add building structure
      const newStruct: PlacedStructure = {
        id: `placed_${Date.now()}`,
        type: placementItem.id,
        x,
        y,
        hp: 600,
        maxHp: 600,
        active: true,
        lastFired: 0
      };

      setStructures(prev => [...prev, newStruct]);
      if (webSocketSend) {
        webSocketSend("place_structure", newStruct);
      }
      playSynthSound('construction_complete');
      
      if (placementItem.id.includes('ore')) {
        const near = checkNearOreDeposit(x, y);
        if (near) {
          onAddLogMessage(`Excellent! ${placementItem.name} deployed near Ore Deposits. Ready for harvesting.`, 'success');
        } else {
          onAddLogMessage(`Warning: ${placementItem.name} placed too far from Ore Deposits! It will NOT generate credits automatically.`, 'warning');
          playSynthSound('alert_low_power');
        }
      } else {
        onAddLogMessage(`Construction completed: Built ${placementItem.name} at coordinates (${x}, ${y})`, 'success');
      }
      setPlacementItem(null); // release queue item
      return;
    }

    // 2. Select/Move Command Mode for Infantry & Armor
    // Check if user clicked on companion friendly unit
    const clickedFriendly = units.find(u => Math.abs(u.x - x) < 0.8 && Math.abs(u.y - y) < 0.8 && u.owner === 'PLAYER');
    if (clickedFriendly) {
      setSelectedUnitId(clickedFriendly.id);
      playSynthSound('click');
      onAddLogMessage(`Unit command selected: ${clickedFriendly.type}. Order destination coordinates on grid.`, 'info');
      
      // Play speech block classic sound
      const quotes = RETRO_QUOTES.filter(q => q.source.toLowerCase().includes(clickedFriendly.type.toLowerCase()) || q.source.toLowerCase().includes('tank'));
      if (quotes.length > 0) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)].text;
        onAddLogMessage(`${clickedFriendly.type}: ${randomQuote}`, 'info');
      }
      return;
    }

    // If unit is active and map cell clicked, dispatch unit to coordinate
    if (selectedUnitId) {
      setUnits(prev => prev.map(u => {
        if (u.id === selectedUnitId) {
          playSynthSound('click');
          if (webSocketSend) {
            webSocketSend("move_unit", { id: u.id, targetX: x, targetY: y });
          }
          return {
            ...u,
            targetX: x,
            targetY: y
          };
        }
        return u;
      }));
      onAddLogMessage(`Moving unit to battle coordinate (${x}, ${y})`, 'info');
      setSelectedUnitId(null); // dispatch
    }
  };

  // Quick Action: Spawn trained friendly unit on a field corner
  const handleTrainSpawn = (unitDef: any) => {
    // Deduct cost
    if (credits < unitDef.cost) {
      onAddLogMessage('Insufficient funds! Harvest more ore first.', 'warning');
      playSynthSound('alert_low_power');
      return;
    }

    setCredits(prev => prev - unitDef.cost);
    playSynthSound('construction_complete');

    // Spawn near Allied construction base (find first ally building coords)
    const constYard = structures.find(s => s.type.includes('const')) || { x: GRID_SIZE - 2, y: GRID_SIZE - 2 };
    
    // Add jitter
    const sx = Math.min(GRID_SIZE - 1, Math.max(0, constYard.x + (Math.random() > 0.5 ? 1 : -1)));
    const sy = Math.min(GRID_SIZE - 1, Math.max(0, constYard.y + (Math.random() > 0.5 ? 1 : -1)));

    const newUnit: PlacedUnit = {
      id: `friendly_${Date.now()}`,
      type: unitDef.name,
      x: sx,
      y: sy,
      targetX: sx,
      targetY: sy,
      owner: 'PLAYER',
      hp: unitDef.hp,
      maxHp: unitDef.hp,
      angle: 0,
      lastFired: 0,
      speed: unitDef.speed,
      damage: unitDef.damage,
      range: unitDef.range,
      synthType: unitDef.synthType,
      color: faction === 'ALLIES' ? '#3b82f6' : faction === 'SOVIETS' ? '#dc2626' : '#a855f7'
    };

    setUnits(prev => [...prev, newUnit]);
    if (webSocketSend) {
      webSocketSend("spawn_unit", newUnit);
    }
    onAddLogMessage(`Trooper deployed: Trained ${unitDef.name} initialized on battlefield! ${unitDef.sound}`, 'success');
  };

  const renderMuzzleFlash = (lastFired: number | undefined, synthType: string) => {
    if (!lastFired || Date.now() - lastFired > 350) return null;

    let glowColor = 'bg-amber-400 shadow-[0_0_15px_#f59e0b]';
    let sparkSymbol = '💥';
    let ringColor = 'border-amber-400';

    if (synthType === 'laser') {
      glowColor = 'bg-cyan-400 shadow-[0_0_15px_#22d3ee]';
      sparkSymbol = '⚡';
      ringColor = 'border-cyan-400';
    } else if (synthType === 'tesla') {
      glowColor = 'bg-fuchsia-400 shadow-[0_0_15px_#e879f9]';
      sparkSymbol = '⚡';
      ringColor = 'border-fuchsia-400';
    } else if (synthType === 'flame') {
      glowColor = 'bg-red-500 shadow-[0_0_15px_#ef4444]';
      sparkSymbol = '🔥';
      ringColor = 'border-red-500';
    } else if (synthType === 'psychic') {
      glowColor = 'bg-purple-500 shadow-[0_0_15px_#a855f7]';
      sparkSymbol = '🌀';
      ringColor = 'border-purple-500';
    }

    return (
      <div className="absolute inset-x-0 inset-y-0 -inset-1.5 z-30 pointer-events-none flex items-center justify-center">
        {/* Expanding Ring shockwave */}
        <div className={`absolute w-full h-full rounded-full border-2 ${ringColor} animate-ping opacity-75`} />
        
        {/* Inner energy flash */}
        <div className={`absolute w-8 h-8 rounded-full ${glowColor} opacity-70 animate-pulse scale-125 blur-[1px]`} />
        
        {/* Pop Emoji / Sprite */}
        <span className="absolute -top-4 font-black text-xs animate-bounce scale-125 select-none text-shadow filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]">
          {sparkSymbol}
        </span>
      </div>
    );
  };

  const renderMovementEffect = (unit: PlacedUnit) => {
    const isMoving = Math.abs(unit.targetX - unit.x) > 0.05 || Math.abs(unit.targetY - unit.y) > 0.05;
    if (!isMoving) return null;

    const isVehicle = unit.type.toLowerCase().includes('tank') || 
                      unit.type.toLowerCase().includes('kirov') || 
                      unit.type.toLowerCase().includes('airship') || 
                      (unit.owner === 'ENEMY' && !!unit.isKirov);

    if (isVehicle) {
      return (
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center">
          <div className="w-4 h-1.5 bg-cyan-400 rounded-full blur-[2px] opacity-90 animate-pulse shadow-[0_0_8px_#22d3ee]" />
          <span className="text-[7px] text-cyan-200 mt-[-2px] animate-bounce select-none">✨</span>
        </div>
      );
    } else {
      return (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex justify-center gap-1">
          <div className="w-1.5 h-1.5 bg-zinc-500/50 rounded-full animate-ping delay-75" />
          <div className="w-1 h-1 bg-zinc-600/40 rounded-full animate-ping" />
        </div>
      );
    }
  };

  const getCellClassName = (cell: MapCell) => {
    let classes = 'relative border-[0.5px] transition-all duration-150 ';

    // Damage flash animations
    const activeFlash = flashingCells.find(f => f.x === cell.x && f.y === cell.y);
    if (activeFlash) {
      if (activeFlash.color === 'red') {
        classes += 'bg-red-600/65 border-red-400 shadow-[inset_0_0_8px_rgba(239,68,68,0.85)] scale-102 z-10 animate-pulse ';
      } else if (activeFlash.color === 'orange') {
        classes += 'bg-orange-600/70 border-orange-400 shadow-[inset_0_0_12px_rgba(249,115,22,0.9)] scale-105 z-10 animate-pulse ';
      } else if (activeFlash.color === 'green') {
        classes += 'bg-green-600/50 border-green-400 shadow-[inset_0_0_8px_rgba(34,197,94,0.8)] scale-103 z-10 animate-pulse ';
      }
    } else {
      // Is player holding a structure to place?
      const isPlacing = !!placementItem;
      const isPlacingOreRefinery = placementItem && placementItem.id.includes('ore');

      if (isPlacing) {
        if (isPlacingOreRefinery) {
          // Highlight Ore Deposits when placing Refinery to guide selection
          const isOreDeposit = cell.type === 'ore' || cell.type === 'gem';

          if (hoverCell?.x === cell.x && hoverCell?.y === cell.y) {
            const isNear = checkNearOreDeposit(cell.x, cell.y);
            // Also verify the slot is actually clear and not water
            const hasStructure = structures.some(s => s.x === cell.x && s.y === cell.y);
            const isWater = cell.type === 'water';
            if (isNear && !hasStructure && !isWater) {
              classes += 'border-green-400 bg-green-500/25 shadow-[inset_0_0_12px_rgba(34,197,94,0.8)] ring-2 ring-green-400 z-10 ';
            } else {
              classes += 'border-red-500 bg-red-950/40 shadow-[inset_0_0_10px_rgba(239,68,68,0.7)] ring-2 ring-red-500 z-10 ';
            }
          } else {
            // Highlight connection lines/shadows if the deposit is within radius of the hovered cell
            const isDepositInRangeOfHover = hoverCell && isOreDeposit && Math.max(Math.abs(cell.x - hoverCell.x), Math.abs(cell.y - hoverCell.y)) <= 2;
            
            if (isDepositInRangeOfHover) {
              classes += 'border-emerald-400 bg-emerald-500/15 shadow-[0_0_8px_rgba(52,211,153,0.5)] z-10 animate-pulse ';
            } else if (isOreDeposit) {
              classes += 'border-yellow-500/65 bg-yellow-905/20 animate-pulse ';
            } else {
              classes += 'border-neutral-900/40 ';
            }
          }
        } else {
          // Generic building placement
          if (hoverCell?.x === cell.x && hoverCell?.y === cell.y) {
            const hasStructure = structures.some(s => s.x === cell.x && s.y === cell.y);
            const isWater = cell.type === 'water';
            if (!hasStructure && !isWater) {
              classes += 'border-green-400 bg-green-500/25 shadow-[inset_0_0_12px_rgba(34,197,94,0.8)] ring-2 ring-green-400 z-10 ';
            } else {
              classes += 'border-red-500 bg-red-950/40 shadow-[inset_0_0_10px_rgba(239,68,68,0.7)] ring-2 ring-red-500 z-10 ';
            }
          } else {
            classes += 'border-neutral-900/40 ';
          }
        }
      } else {
        // Selection/hover style
        if (hoverCell?.x === cell.x && hoverCell?.y === cell.y) {
          classes += 'border-amber-400 bg-amber-500/20 z-10 ';
        } else {
          classes += 'border-neutral-900/40 ';
        }
      }

      if (cell.type === 'water') {
        classes += 'bg-blue-950/80 hover:bg-blue-900/90 ';
      } else if (cell.type === 'ore') {
        if (!classes.includes('bg-yellow') && !classes.includes('bg-green') && !classes.includes('bg-emerald')) {
          classes += 'bg-yellow-950/70 hover:bg-yellow-900/60 text-yellow-500 font-bold ';
        }
      } else if (cell.type === 'gem') {
        if (!classes.includes('bg-purple') && !classes.includes('bg-green') && !classes.includes('bg-emerald')) {
          classes += 'bg-purple-950/70 hover:bg-purple-900/60 text-purple-500 font-bold ';
        }
      } else {
        if (!classes.includes('bg-green') && !classes.includes('bg-red') && !classes.includes('bg-emerald')) {
          classes += 'bg-slate-900/65 hover:bg-slate-800/60 ';
        }
      }
    }

    return classes;
  };

  return (
    <div id="battle_grid_panel" className="bg-neutral-950 rounded border border-neutral-800 p-4 relative flex flex-col h-full shadow-2xl">
      {/* HUD Header Bar */}
      <div className="flex flex-wrap justify-between items-center mb-3 pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></div>
          <h2 className="text-sm font-mono tracking-widest text-amber-500 uppercase flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            Tactical Defense Grid Simulation
          </h2>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-neutral-900/80 px-2.5 py-1 rounded border border-neutral-800 text-red-400 flex items-center gap-1">
            <span className="text-neutral-500">WAVE:</span> #{waveLevel - 1} ACTIVE
          </div>

          <div className="bg-neutral-900/80 px-2.5 py-1 rounded border border-neutral-800 text-amber-500 flex items-center gap-1.5">
            <span className="text-neutral-500">SPAWN IN:</span>
            <span className="text-red-500 px-1 font-bold animate-pulse">{waveTimer}s</span>
          </div>

          {/* Isometric Perspective Toggle */}
          <button
            id="toggle_perspective_btn"
            onClick={() => {
              playSynthSound('click');
              setIsIsometric(!isIsometric);
              onAddLogMessage(`View style altered to ${!isIsometric ? 'ISOMETRIC 3D' : 'TOP-DOWN 2D'} perspective mode.`, 'success');
            }}
            className={`font-mono text-xs px-3 py-1.5 rounded transition-all flex items-center gap-1.5 border transition-all cursor-pointer ${
              isIsometric 
                ? 'bg-amber-600 border-amber-400 text-black font-extrabold shadow-sm' 
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            🗺️ {isIsometric ? 'ISOMETRIC 3D' : 'TOP-DOWN 2D'}
          </button>

          {/* Tactical Viewport Zoom and Reset controls */}
          <div className="flex items-center gap-1 bg-neutral-900/95 border border-neutral-800 rounded px-1.5 py-1 select-none">
            <button
              id="zoom_out_btn"
              onClick={() => {
                playSynthSound('click');
                setZoomLevel(prev => Math.max(0.6, Number((prev - 0.2).toFixed(1))));
              }}
              className="text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 p-1 rounded transition-all cursor-pointer"
              title="Zoom Out (Keyboard: -)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-amber-500 font-mono text-xs px-1 font-bold min-w-[36px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              id="zoom_in_btn"
              onClick={() => {
                playSynthSound('click');
                setZoomLevel(prev => Math.min(3.0, Number((prev + 0.2).toFixed(1))));
              }}
              className="text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 p-1 rounded transition-all cursor-pointer"
              title="Zoom In (Keyboard: +)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-4 bg-neutral-800 mx-1"></div>
            <button
              id="reset_view_btn"
              onClick={() => {
                playSynthSound('click');
                setZoomLevel(1.2);
                setPanX(0);
                setPanY(0);
                onAddLogMessage("Tactical viewport reset to default level and center.", 'info');
              }}
              className="text-neutral-400 hover:text-red-400 hover:bg-neutral-800 p-1 rounded transition-all cursor-pointer"
              title="Reset Viewport"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            id="trigger_wave_btn"
            onClick={triggerEnemyWave}
            className="bg-red-700/80 hover:bg-red-600 text-white font-mono text-xs px-3 py-1.5 rounded transition-all flex items-center gap-1 border border-red-500 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" /> TRIGGER INVASION
          </button>
        </div>
      </div>

      {/* Grid Canvas Wrapper with optionally active standard perspective */}
      <div 
        id="battle_viewport_container"
        style={{ perspective: isIsometric ? '1200px' : 'none' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="relative flex-1 w-full bg-black rounded overflow-hidden border border-neutral-900 flex justify-center items-center cursor-grab active:cursor-grabbing outline-none focus:ring-1 focus:ring-amber-500/30"
        title="Left Click or Right Click and Drag to Pan. Scroll to click cells. Use Arrow keys/WASD to pan map."
      >
        {/* Absolute Scanlines screen effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90.1deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] z-20 opacity-40"></div>

        {/* Battle Grid with hardware accelerated perspective tilt and zoom zoomLevel */}
        <div 
          className="grid aspect-square max-w-full max-h-full w-full h-full text-center relative selection:bg-none select-none"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            transform: isIsometric 
              ? `translate3d(${panX}px, ${panY}px, 0) rotateX(55deg) rotateY(0deg) rotateZ(-45deg) scale(${1.05 * zoomLevel}) translateY(-3%)` 
              : `translate3d(${panX}px, ${panY}px, 0) scale(${zoomLevel})`,
            transformStyle: isIsometric ? 'preserve-3d' : 'flat',
            transition: isDraggingRef.current ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {mapCells.map((cell, idx) => {
            // Find structures at coordination
            const struct = structures.find(s => s.x === cell.x && s.y === cell.y);
            const friendlyAtLoc = units.find(u => Math.round(u.x) === cell.x && Math.round(u.y) === cell.y && u.owner === 'PLAYER');
            const enemyAtLoc = units.find(u => Math.round(u.x) === cell.x && Math.round(u.y) === cell.y && u.owner === 'ENEMY');

            return (
              <div
                key={`cell_${cell.x}_${cell.y}`}
                className={getCellClassName(cell)}
                onMouseEnter={() => {
                  setHoverCell({ x: cell.x, y: cell.y });
                  if (webSocketSend) {
                    webSocketSend("cursor_move", { x: cell.x, y: cell.y });
                  }
                }}
                onMouseLeave={() => {
                  setHoverCell(null);
                  if (webSocketSend) {
                    webSocketSend("cursor_move", { x: -1, y: -1 });
                  }
                }}
                onClick={() => handleCellClick(cell.x, cell.y)}
              >
                {/* Ore symbols */}
                {cell.type === 'ore' && !struct && (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] text-yellow-600 font-semibold opacity-75">
                    🪙
                  </span>
                )}
                {cell.type === 'gem' && !struct && (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] text-indigo-400 font-semibold opacity-85">
                    💎
                  </span>
                )}

                {/* Draw placed structures upright in 3D */}
                {struct && (() => {
                  const isOreRefinery = struct.type.includes('ore');
                  const isFunctioning = isOreRefinery && checkNearOreDeposit(struct.x, struct.y);

                  return (
                    <div 
                      style={{
                        transform: isIsometric ? 'translateZ(12px) rotateZ(45deg) rotateX(-55deg)' : 'none',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      className={`absolute inset-0.5 flex flex-col items-center justify-center bg-zinc-900 border rounded text-center justify-between p-1 z-10 shadow-lg animate-fade-in ${
                        isOreRefinery 
                          ? isFunctioning 
                            ? 'border-yellow-400 shadow-[0_0_8px_#f59e0b] bg-amber-950/70' 
                            : 'border-red-500/70 opacity-80 bg-zinc-900/90'
                          : 'border-amber-600/60'
                      }`}
                    >
                      <div className="relative flex flex-col items-center leading-none">
                        <span className="text-sm font-semibold leading-none">
                          {struct.type.includes('power') ? '⚡' : struct.type.includes('ore') ? '🏭' : struct.type.includes('barracks') ? '⛺' : struct.type.includes('war') ? '🚜' : struct.type.includes('const') ? '🏗️' : '🛡️'}
                        </span>
                        
                        {/* Interactive refinery mining dot/warning indicator */}
                        {isOreRefinery && (
                          <div className="absolute -top-1 -right-3 flex items-center justify-center">
                            {isFunctioning ? (
                              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping absolute" />
                            ) : null}
                            <span className={`w-1.5 h-1.5 rounded-full ${isFunctioning ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                          </div>
                        )}
                      </div>

                      {/* Small Ore label */}
                      {isOreRefinery && (
                        <span className={`text-[7px] leading-none font-bold font-mono tracking-tight uppercase ${isFunctioning ? 'text-yellow-400' : 'text-red-400'}`}>
                          {isFunctioning ? 'MINING' : 'NO ORE'}
                        </span>
                      )}

                      {/* Structure health bar */}
                      <div className="w-full h-1 bg-red-950/85 rounded-full overflow-hidden mt-0.5">
                        <div 
                          className="h-full bg-green-500 transition-all duration-300"
                          style={{ width: `${(struct.hp / struct.maxHp) * 100}%` }}
                        ></div>
                      </div>
                      {/* Muzzle Flash Overlay for defensive firing */}
                      {struct.lastFired && renderMuzzleFlash(
                        struct.lastFired,
                        struct.type.includes('prism') ? 'laser' :
                        struct.type.includes('tesla') ? 'tesla' :
                        struct.type.includes('psychic') ? 'psychic' : 'bullet'
                      )}
                    </div>
                  );
                })()}

                {/* Draw Placed units standing upright in 3D */}
                {friendlyAtLoc && !struct && (
                  <div 
                    style={{
                      transform: isIsometric ? 'translateZ(10px) rotateZ(45deg) rotateX(-55deg)' : 'none',
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    className={`absolute inset-1 flex flex-col items-center justify-center bg-blue-900/90 hover:bg-blue-800/90 border border-blue-400 rounded-lg z-10 p-0.5 transition-all text-center justify-between cursor-pointer ${selectedUnitId === friendlyAtLoc.id ? 'ring-2 ring-amber-400 scale-105' : ''}`}
                    title={friendlyAtLoc.type}
                  >
                    <span className="text-[11px] font-bold leading-none select-none text-white">{friendlyAtLoc.type.includes('Tank') ? '🚜' : '🪖'}</span>
                    <div className="w-full h-1 bg-red-950 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400" style={{ width: `${(friendlyAtLoc.hp / friendlyAtLoc.maxHp) * 100}%` }}></div>
                    </div>
                    {/* Firing muzzle flash animation */}
                    {renderMuzzleFlash(friendlyAtLoc.lastFired, friendlyAtLoc.synthType)}
                    {/* Movement dust trails or exhaust fumes */}
                    {renderMovementEffect(friendlyAtLoc)}
                  </div>
                )}

                {/* Enemy Unit icons standing upright in 3D */}
                {enemyAtLoc && !struct && (
                  <div 
                    style={{
                      transform: isIsometric ? 'translateZ(10px) rotateZ(45deg) rotateX(-55deg)' : 'none',
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    className="absolute inset-1.5 flex flex-col items-center justify-center bg-red-950/90 border border-red-500 rounded-md z-10 p-0.5 animate-bounce"
                  >
                    <span className="text-[10px] leading-none text-red-100 font-black">{enemyAtLoc.isKirov ? '🎈' : '🛸'}</span>
                    <div className="w-full h-1 bg-red-950 rounded-full overflow-hidden mt-0.5">
                      <div className="h-full bg-red-500" style={{ width: `${(enemyAtLoc.hp / enemyAtLoc.maxHp) * 100}%` }}></div>
                    </div>
                    {/* Enemy muzzle flash simulation */}
                    {renderMuzzleFlash(enemyAtLoc.lastFired, enemyAtLoc.synthType)}
                    {/* Enemy engine fire plume or landing dust tracks */}
                    {renderMovementEffect(enemyAtLoc)}
                  </div>
                )}
              </div>
            );
          })}

          {/* SVG Overlays for shooting animations, laser discharge, or electric lightning */}
          <div className="absolute inset-0 pointer-events-none w-full h-full z-15">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {effects.map(eff => {
                // Convert grid coordinates to SVG percentage (GRID_SIZE=15)
                const stepPercent = 100 / GRID_SIZE;
                const sx = (eff.startX) * stepPercent;
                const sy = (eff.startY) * stepPercent;
                const ex = (eff.endX) * stepPercent;
                const ey = (eff.endY) * stepPercent;

                if (eff.type === 'laser') {
                  return (
                    <line
                      key={eff.id}
                      x1={`${sx}%`}
                      y1={`${sy}%`}
                      x2={`${ex}%`}
                      y2={`${ey}%`}
                      stroke="#60a5fa"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="animate-pulse"
                      opacity={eff.timer * 3}
                    />
                  );
                }

                if (eff.type === 'flame') {
                  return (
                    <line
                      key={eff.id}
                      x1={`${sx}%`}
                      y1={`${sy}%`}
                      x2={`${ex}%`}
                      y2={`${ey}%`}
                      stroke="#f97316"
                      strokeWidth="4"
                      strokeLinecap="round"
                      opacity={eff.timer * 3.5}
                    />
                  );
                }

                if (eff.type === 'bullet') {
                  return (
                    <line
                      key={eff.id}
                      x1={`${sx}%`}
                      y1={`${sy}%`}
                      x2={`${ex}%`}
                      y2={`${ey}%`}
                      stroke="#fbbf24"
                      strokeWidth="1.2"
                      strokeDasharray="4 2"
                      strokeLinecap="butt"
                      opacity={eff.timer * 2.5}
                    />
                  );
                }

                if (eff.type === 'tesla') {
                  const mx = (sx + ex) / 2;
                  const my = (sy + ey) / 2;
                  // Tesla jagged path logic
                  return (
                    <path
                      key={eff.id}
                      d={`M ${sx}% ${sy}% Q ${mx - 4}% ${my - 4}% ${ex}% ${ey}%`}
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="3.5"
                      strokeDasharray="2"
                      opacity={eff.timer * 3}
                    />
                  );
                }

                if (eff.type === 'psychic') {
                  return (
                    <circle
                      key={eff.id}
                      cx={`${sx}%`}
                      cy={`${sy}%`}
                      r="12"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="2"
                      opacity={eff.timer * 2}
                    />
                  );
                }

                if (eff.type === 'explosion') {
                  return (
                    <g key={eff.id}>
                      <circle
                        cx={`${sx}%`}
                        cy={`${sy}%`}
                        r="18"
                        fill="rgba(239, 68, 68, 0.45)"
                        className="animate-ping"
                      />
                      <circle
                        cx={`${sx}%`}
                        cy={`${sy}%`}
                        r="8"
                        fill="#f97316"
                        opacity={eff.timer * 2}
                      />
                    </g>
                  );
                }

                if (eff.type === 'ore_collect') {
                  return (
                    <text
                      key={eff.id}
                      x={`${sx}%`}
                      y={`${sy}%`}
                      fill="#eab308"
                      fontSize="9"
                      fontFamily="monospace"
                      opacity={eff.timer * 1.5}
                      className="transition-all duration-300"
                    >
                      +$200
                    </text>
                  );
                }

                return null;
              })}
            </svg>
          </div>

          {/* Other connected Commanders' Cursor overlays */}
          {otherCommanders?.map(comm => {
            if (comm.cursorX === undefined || comm.cursorX < 0 || comm.cursorY < 0) return null;
            const stepPercent = 100 / GRID_SIZE;
            const px = (comm.cursorX + 0.5) * stepPercent;
            const py = (comm.cursorY + 0.5) * stepPercent;
            
            return (
              <div
                key={comm.id}
                style={{
                  left: `${px}%`,
                  top: `${py}%`,
                  transform: isIsometric ? 'translateZ(15px) rotateZ(45deg) rotateX(-55deg) translate(-50%, -50%)' : 'translate(-50%, -50%)',
                  transformStyle: 'preserve-3d',
                }}
                className="absolute pointer-events-none z-30 transition-all duration-150 ease-out flex flex-col items-center"
              >
                {/* Visual mouse crosshair / cursor flag */}
                <span className="text-[14px] animate-pulse select-none leading-none">🎯</span>
                <span className={`text-[8px] font-mono px-1 py-0.5 rounded shadow-lg border -mt-1 font-bold select-none whitespace-nowrap bg-neutral-950 uppercase ${
                  comm.faction === 'ALLIES' ? 'border-blue-500 text-blue-400' :
                  comm.faction === 'SOVIETS' ? 'border-red-500 text-red-400' :
                  'border-purple-500 text-purple-400'
                }`}>
                  {comm.name}
                </span>
              </div>
            );
          })}

          {/* Floating Damage and Combat Indicators Overlay */}
          {damageIndicators.map(ind => {
            const stepPercent = 100 / GRID_SIZE;
            const px = (ind.x + 0.5) * stepPercent;
            const py = (ind.y + 0.5) * stepPercent;
            const ageMs = Date.now() - ind.createdAt;
            const agePercent = ageMs / 1200;
            const opacity = Math.max(0, 1 - agePercent);

            // Slightly scale on start
            const isFresh = ageMs < 200;
            const scaleClass = isFresh ? 'scale-110' : 'scale-100';

            return (
              <div
                key={ind.id}
                style={{
                  left: `${px}%`,
                  top: `${py}%`,
                  transform: isIsometric 
                    ? 'translateZ(30px) rotateZ(45deg) rotateX(-55deg) translate(-50%, -100%)' 
                    : 'translate(-50%, -100%)',
                  transformStyle: 'preserve-3d',
                  opacity,
                  transition: 'opacity 0.1s linear, transform 0.1s linear',
                }}
                className={`absolute pointer-events-none z-50 transition-all duration-300 select-none flex flex-col items-center ${scaleClass} ${ind.color}`}
              >
                <span className="font-mono text-[9px] font-black uppercase tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                  {ind.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deploy Unit Trigger Pad */}
      <div className="mt-3 bg-neutral-900 border border-neutral-800 p-2.5 rounded">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Trained Combatant Deployment Deck
          </p>
          <button 
            id="spawn_menu_toggle_btn"
            onClick={() => setIsSpawnMenuOpen(!isSpawnMenuOpen)}
            className="text-[10px] font-mono text-amber-500 hover:underline flex items-center gap-1 bg-none border-none p-0 cursor-pointer"
          >
            {isSpawnMenuOpen ? '[- CLOSE PANEL]' : '[+ OPEN PANEL]'}
          </button>
        </div>

        {isSpawnMenuOpen ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              ...INFANTRY_DATA[faction] || [],
              ...VEHICLES_DATA[faction] || []
            ].map(unit => (
              <button
                id={`spawn_btn_${unit.id}`}
                key={unit.id}
                onClick={() => handleTrainSpawn(unit)}
                className="bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-600 rounded p-1.5 transition-all text-left flex items-start gap-1.5 focus:outline-none"
              >
                <span className="text-lg bg-neutral-900/85 p-1 rounded border border-neutral-800 leading-none">
                  {unit.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-mono text-white leading-tight truncate">{unit.name}</p>
                  <p className="text-[9px] font-mono text-yellow-500 flex items-center justify-between">
                    <span>${unit.cost}</span>
                    <span className="text-neutral-500 text-[8px]">{unit.buildTime}s</span>
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-[11px] text-neutral-500 font-mono">
              Deploy GIs and Combat Tanks onto the field instantly to hold the line.
            </p>
          </div>
        )}
      </div>

      {/* Non-blocking Floating Instruction Banner for Placement Mode */}
      {placementItem && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/95 border-2 border-amber-500/80 rounded-lg py-2 px-4 shadow-[0_0_15px_rgba(245,158,11,0.25)] flex items-center gap-3 z-30 font-mono text-xs max-w-[90%] pointer-events-auto">
          <Hammer className="w-4 h-4 text-amber-500 animate-bounce flex-shrink-0" />
          <div className="flex-1 min-w-0 text-left">
            <span className="text-amber-500 font-bold uppercase tracking-wider block leading-none">Placement Mode Active</span>
            <span className="text-neutral-300 text-[10px]">
              Click cell to deploy <span className="text-yellow-450 font-bold">{placementItem.name}</span>
            </span>
          </div>
          <button
            id="cancel_placement_btn"
            onClick={() => setPlacementItem(null)}
            className="bg-transparent hover:bg-red-950 text-red-400 hover:text-red-300 border border-red-800/60 hover:border-red-600 text-[10px] py-1 px-2 rounded transition-all focus:outline-none flex-shrink-0 font-bold uppercase"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
