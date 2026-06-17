import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { Heart, Shield, Maximize2, Minimize2, Award } from "lucide-react";
import { PlayerState, Enemy, Particle, LevelConfig, RemotePlayer } from "../types";
import RadarMap from "./RadarMap";

interface RaycasterScreenProps {
  player: PlayerState;
  enemies: Enemy[];
  particles: Particle[];
  level: LevelConfig;
  scanlines: boolean;
  reticle: string;
  otherPlayers?: RemotePlayer[];
  onFire?: () => void;
  gameState?: "INTRO" | "PLAYING" | "GAMEOVER" | "LEVEL_COMPLETE" | "VICTORY_ALL";
  onAdvanceLevel?: () => void;
  onResetLevel?: () => void;
  onExitToIntro?: () => void;
}

export default function RaycasterScreen({
  player,
  enemies,
  particles,
  level,
  scanlines,
  reticle,
  otherPlayers = [],
  onFire,
  gameState = "PLAYING",
  onAdvanceLevel,
  onResetLevel,
  onExitToIntro,
}: RaycasterScreenProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync fullscreen state based on native browser fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      } else if ((container as any).msRequestFullscreen) {
        (container as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        //document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        //(document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        //(document as any).msExitFullscreen();
      }
    }
  };

  // Sync references to bypass clashing closure scopes in Three.js animation frame render loops
  const stateRef = useRef({ player, enemies, particles, otherPlayers, level });
  useEffect(() => {
    stateRef.current = { player, enemies, particles, otherPlayers, level };
  }, [player, enemies, particles, otherPlayers, level]);

  // Main Three.js setup and rebuild hook
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get current dimensions
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#020617");
    // Deep black-blue fog for amazing cyber hallway atmosphere!
    scene.fog = new THREE.FogExp2("#020617", 0.16);

    // 2. Camera setup (75-degree FOV for true high-octane FPS feel)
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.05, 50);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);

    // Coordinate settings
    const grid = level.wallGrid;
    const mapHeight = grid.length;
    const mapWidth = grid[0].length;

    // 4. FLOOR MESH
    const floorGeo = new THREE.PlaneGeometry(mapWidth * 1.5, mapHeight * 1.5);
    const floorMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(level.floorColor),
      roughness: 0.8,
      metalness: 0.6,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(mapWidth / 2, 0, mapHeight / 2);
    scene.add(floorMesh);

    // 5. CEILING MESH
    const ceilingGeo = new THREE.PlaneGeometry(mapWidth * 1.5, mapHeight * 1.5);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(level.ceilingColor),
      roughness: 0.85,
      metalness: 0.4,
    });
    const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceilingMesh.rotation.x = Math.PI / 2;
    ceilingMesh.position.set(mapWidth / 2, 1.2, mapHeight / 2); // Ceiling height at 1.2
    scene.add(ceilingMesh);

    // 6. LIGHTING
    // Tech ambient dim light
    const ambientLight = new THREE.AmbientLight(0x0a1220, 0.5);
    scene.add(ambientLight);

    // Player shoulder futuristic cyber flash light
    const playerLight = new THREE.PointLight(0x06b6d4, 1.8, 8.5, 1.2);
    scene.add(playerLight);

    // Exit portal area light (if level exit exists)
    let exitLight: THREE.PointLight | null = null;

    // 7. LEVEL WALLS BUILD
    // Cache wall geometries and materials to keep rendering extremely high performance
    const wallGeo = new THREE.BoxGeometry(1, 1.2, 1); // Exact dimension matching floor-to-ceiling

    const matStandard = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.2,
      roughness: 0.5,
    }); // White wall panel
    const matReactor = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      emissive: 0xeab308,
      emissiveIntensity: 0.65,
      metalness: 0.5,
      roughness: 0.4,
    }); // Hazard orange-amber reactor core
    const matToxic = new THREE.MeshStandardMaterial({
      color: 0x7f1d1d,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.25,
      roughness: 0.9,
    }); // Danger toxic crimson structures
    const matExit = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.85,
      metalness: 0.3,
      roughness: 0.15,
    }); // Glowing cyan escape terminal

    const wallsGroup = new THREE.Group();
    scene.add(wallsGroup);

    for (let r = 0; r < mapHeight; r++) {
      for (let c = 0; c < mapWidth; c++) {
        const wallType = grid[r][c];
        if (wallType > 0) {
          let chosenMat = matStandard;
          if (wallType === 2) chosenMat = matReactor;
          if (wallType === 3) chosenMat = matToxic;
          if (wallType === 4) {
            chosenMat = matExit;
            // Spawn localized green-cyan glow lights around level exits
            if (!exitLight) {
              exitLight = new THREE.PointLight(0x22d3ee, 2.5, 5, 1);
              exitLight.position.set(c + 0.5, 0.6, r + 0.5);
              scene.add(exitLight);
            }
          }

          const wallBlock = new THREE.Mesh(wallGeo, chosenMat);
          // Set standard offset: blocks center at (c + 0.5, height/2, r + 0.5)
          wallBlock.position.set(c + 0.5, 0.6, r + 0.5);
          wallsGroup.add(wallBlock);
        }
      }
    }

    // 8. PROCEDURAL CHARACTER AND SPRITES DICTIONARIES
    // Groups holders for dynamic bodies
    const enemiesGroup = new THREE.Group();
    const playersGroup = new THREE.Group();
    const particlesGroup = new THREE.Group();
    scene.add(enemiesGroup);
    scene.add(playersGroup);
    scene.add(particlesGroup);

    // Keep active map references to update coordinates smoothly without redundant mesh creation
    const enemyMeshMap = new Map<string, THREE.Group>();
    const playerMeshMap = new Map<string, THREE.Group>();
    const particleMeshMap = new Map<string, THREE.Mesh>();

    // Shared Geometries for model structures (highly optimized)
    const droneCoreGeo = new THREE.SphereGeometry(0.16, 16, 16);
    const droneEyeGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const dronePropGeo = new THREE.BoxGeometry(0.12, 0.02, 0.04);

    const soldierTorsoGeo = new THREE.CylinderGeometry(0.12, 0.08, 0.35, 12);
    const soldierHeadGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const soldierVisorGeo = new THREE.BoxGeometry(0.1, 0.025, 0.03);
    const soldierGunGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.18, 8);

    const demonScale = 1.6;
    const demonTorsoGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const demonHeadGeo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
    const demonHornGeo = new THREE.ConeGeometry(0.04, 0.12, 8);
    const demonShoulderGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);

    const bulletSparkGeo = new THREE.BoxGeometry(0.04, 0.04, 0.04);

    // Helper functions to compile procedurally gorgeous dynamic meshes on demand!
    const constructDroneMesh = () => {
      const droneGroup = new THREE.Group();

      const chassisMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.9,
        roughness: 0.2,
      });
      const coreMesh = new THREE.Mesh(droneCoreGeo, chassisMat);
      droneGroup.add(coreMesh);

      // Cybernetic blinking eye lens
      const lensMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
      const eyeMesh = new THREE.Mesh(droneEyeGeo, lensMat);
      eyeMesh.position.set(0, 0.02, 0.12);
      eyeMesh.name = "eye";
      droneGroup.add(eyeMesh);

      // Propeller side shield brackets
      const leftRotor = new THREE.Mesh(dronePropGeo, chassisMat);
      leftRotor.position.set(-0.25, 0.04, 0);
      leftRotor.name = "prop_left";
      const rightRotor = new THREE.Mesh(dronePropGeo, chassisMat);
      rightRotor.position.set(0.25, 0.04, 0);
      rightRotor.name = "prop_right";
      droneGroup.add(leftRotor);
      droneGroup.add(rightRotor);

      return droneGroup;
    };

    const constructSoldierMesh = () => {
      const soldierGroup = new THREE.Group();

      const armorMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.8,
        roughness: 0.4,
      });
      const torso = new THREE.Mesh(soldierTorsoGeo, armorMat);
      soldierGroup.add(torso);

      const head = new THREE.Mesh(soldierHeadGeo, armorMat);
      head.position.set(0, 0.26, 0);
      soldierGroup.add(head);

      const visorMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
      const visor = new THREE.Mesh(soldierVisorGeo, visorMat);
      visor.position.set(0, 0.28, 0.065);
      visor.name = "visor";
      soldierGroup.add(visor);

      const barrelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
      const gun = new THREE.Mesh(soldierGunGeo, barrelMat);
      gun.rotation.x = Math.PI / 2;
      gun.position.set(0.08, -0.05, 0.16);
      soldierGroup.add(gun);

      return soldierGroup;
    };

    const constructCyberDemonMesh = () => {
      const demonGroup = new THREE.Group();

      const bruteMat = new THREE.MeshStandardMaterial({
        color: 0x450a0a,
        metalness: 0.4,
        roughness: 0.8,
      });
      const torso = new THREE.Mesh(demonTorsoGeo, bruteMat);
      demonGroup.add(torso);

      const metalMat = new THREE.MeshStandardMaterial({
        color: 0x3b4252,
        metalness: 0.9,
        roughness: 0.35,
      });
      const skull = new THREE.Mesh(demonHeadGeo, metalMat);
      skull.position.set(0, 0.22, 0.12);
      demonGroup.add(skull);

      // Glowing twin eyes
      const redEyeMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const eyeLeft = new THREE.Mesh(droneEyeGeo, redEyeMat);
      eyeLeft.position.set(-0.05, 0.24, 0.18);
      const eyeRight = new THREE.Mesh(droneEyeGeo, redEyeMat);
      eyeRight.position.set(0.05, 0.24, 0.18);
      demonGroup.add(eyeLeft);
      demonGroup.add(eyeRight);

      // Robotic hydraulic armor shoulder plates
      const shoulderLeft = new THREE.Mesh(demonShoulderGeo, metalMat);
      shoulderLeft.position.set(-0.35, 0.12, 0);
      const shoulderRight = new THREE.Mesh(demonShoulderGeo, metalMat);
      shoulderRight.position.set(0.35, 0.12, 0);
      demonGroup.add(shoulderLeft);
      demonGroup.add(shoulderRight);

      // Ominous bio horns
      const boneMat = new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 0.9 });
      const hornLeft = new THREE.Mesh(demonHornGeo, boneMat);
      hornLeft.position.set(-0.1, 0.36, 0.1);
      hornLeft.rotation.z = 0.3;
      const hornRight = new THREE.Mesh(demonHornGeo, boneMat);
      hornRight.position.set(0.1, 0.36, 0.1);
      hornRight.rotation.z = -0.3;
      demonGroup.add(hornLeft);
      demonGroup.add(hornRight);

      // Scale model up overall
      demonGroup.scale.set(demonScale, demonScale, demonScale);

      return demonGroup;
    };

    const constructRemotePlayerMesh = (playerColor: string) => {
      const peerGroup = new THREE.Group();

      const suitColor = new THREE.Color(playerColor || "#06b6d4");
      const armorMat = new THREE.MeshStandardMaterial({
        color: suitColor,
        metalness: 0.75,
        roughness: 0.3,
      });

      // Capsule chest body structure
      const capsuleGeo = new THREE.CapsuleGeometry(0.13, 0.32, 4, 10);
      const compositeBody = new THREE.Mesh(capsuleGeo, armorMat);
      compositeBody.position.set(0, 0, 0);
      peerGroup.add(compositeBody);

      // Helmet sphere
      const helmetMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.95 });
      const helmet = new THREE.Mesh(soldierHeadGeo, helmetMat);
      helmet.position.set(0, 0.22, 0);
      peerGroup.add(helmet);

      // Neon glowing tracking visor
      const visorMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.8,
      });
      const visor = new THREE.Mesh(soldierVisorGeo, visorMat);
      visor.position.set(0, 0.23, 0.07);
      visor.name = "visor";
      peerGroup.add(visor);

      // Plasma Assault Rifle
      const gunMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
      const mainRifle = new THREE.Mesh(soldierGunGeo, gunMat);
      mainRifle.rotation.x = Math.PI / 2;
      mainRifle.position.set(0.1, -0.06, 0.15);
      peerGroup.add(mainRifle);

      // Weapon muzzle flash light source
      const flashGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const flashMat = new THREE.MeshBasicMaterial({ color: 0xeab308 });
      const emitter = new THREE.Mesh(flashGeo, flashMat);
      emitter.position.set(0.1, -0.06, 0.28);
      emitter.visible = false;
      emitter.name = "muzzle_spark";
      peerGroup.add(emitter);

      return peerGroup;
    };

    // 9. ANIMATION LOOP
    let isRequestingFrame = true;
    let animationFrameId: number;
    let damageShake = 0;

    const renderTick = () => {
      if (!isRequestingFrame) return;

      // Pull fresh concurrent state snapshot
      const currentSnapshot = stateRef.current;
      const { player: pState, enemies: eList, particles: pList, otherPlayers: opList } = currentSnapshot;

      // Adjust viewport aspect ratio dynamically if container resized
      const currWidth = canvas.clientWidth;
      const currHeight = canvas.clientHeight;
      if (canvas.width !== currWidth || canvas.height !== currHeight) {
        renderer.setSize(currWidth, currHeight, false);
        camera.aspect = currWidth / currHeight;
        camera.updateProjectionMatrix();
      }

      // Decaying camera shake intensity following damage trigger
      if (pState.isTakingDamage) {
        damageShake = 1.0;
      } else if (damageShake > 0.01) {
        damageShake *= 0.88; // decay
      } else {
        damageShake = 0;
      }

      let shakeX = 0;
      let shakeY = 0;
      let shakeZ = 0;
      if (damageShake > 0) {
        // High intensity shake feedback
        const intensity = damageShake * 0.16; // dynamic range limit
        shakeX = (Math.random() - 0.5) * intensity;
        shakeY = (Math.random() - 0.5) * intensity * 0.7; // slightly lower vertical shake
        shakeZ = (Math.random() - 0.5) * intensity;
      }

      // Sync player standard camera position combined with shake factor
      camera.position.set(pState.x + shakeX, 0.5 + shakeY, pState.y + shakeZ);
      // Coordinate looking direction
      camera.lookAt(pState.x + pState.dirX, 0.5 + shakeY * 0.5, pState.y + pState.dirY);

      // Roll/tilt rotation of the camera to make it feel extremely visceral
      if (damageShake > 0) {
        camera.rotation.z = (Math.random() - 0.5) * damageShake * 0.08; // up to ~4.5 degrees roll tilt
      } else {
        camera.rotation.z = 0;
      }

      // Flashlight follows camera perfectly (including shake!)
      playerLight.position.set(pState.x + shakeX, 0.5 + shakeY, pState.y + shakeZ);

      // Dynamic flashlight colors reacting to danger levels!
      if (pState.health < 30) {
        // Red flashing alert light!
        const pulseCycle = Math.sin(Date.now() * 0.01) * 0.5 + 0.5;
        playerLight.color.setRGB(1.0, 0.1 * pulseCycle, 0.1 * pulseCycle);
        playerLight.intensity = 1.5 + pulseCycle * 1.5;
      } else {
        playerLight.color.setHex(0x06b6d4); // Cyan steady light
        playerLight.intensity = 1.8;
      }

      // Sync enemies meshes to reflect current health, positions, and hit overlays
      const activeEnemiesIds = new Set<string>();

      eList.forEach((enemy) => {
        if (enemy.health <= 0) {
          // If dead, cleanup mesh safely
          const currentMesh = enemyMeshMap.get(enemy.id);
          if (currentMesh) {
            enemiesGroup.remove(currentMesh);
            enemyMeshMap.delete(enemy.id);
          }
          return;
        }

        activeEnemiesIds.add(enemy.id);
        let mesh = enemyMeshMap.get(enemy.id);

        if (!mesh) {
          // Compile appropriate geometry style
          if (enemy.type === "DRONE") {
            mesh = constructDroneMesh();
          } else if (enemy.type === "SOLDIER") {
            mesh = constructSoldierMesh();
          } else {
            mesh = constructCyberDemonMesh();
          }
          enemiesGroup.add(mesh);
          enemyMeshMap.set(enemy.id, mesh);
        }

        // Float hovering drones, rest anchor direct to ground
        const bottomOffset = enemy.type === "DRONE" ? 0.45 + Math.sin(Date.now() * 0.006 + enemy.x) * 0.08 : 0.28;
        mesh.position.set(enemy.x, bottomOffset, enemy.y);

        // Make model face the player with accurate horizontal billboard lock
        mesh.lookAt(pState.x, mesh.position.y, pState.y);

        // Rotate propellers on drones
        if (enemy.type === "DRONE") {
          const lProp = mesh.getObjectByName("prop_left") as THREE.Mesh;
          const rProp = mesh.getObjectByName("prop_right") as THREE.Mesh;
          if (lProp) lProp.rotation.y += 0.25;
          if (rProp) rProp.rotation.y += 0.25;

          // Eye flashes red in chase/firing mode
          const eye = mesh.getObjectByName("eye") as THREE.Mesh;
          if (eye && eye.material instanceof THREE.MeshBasicMaterial) {
            eye.material.color.setHex(enemy.state === "ATTACKING" ? 0xef4444 : 0x22d3ee);
          }
        }

        // Flashing material glow filter on taking hit damage
        mesh.traverse((part) => {
          if (part instanceof THREE.Mesh && part.material instanceof THREE.MeshStandardMaterial) {
            if (enemy.isHitFlash) {
              part.material.emissive.setHex(0xffffff);
              part.material.emissiveIntensity = 0.95;
            } else {
              // Restore typical emissive configurations
              if (enemy.type === "DRONE") {
                part.material.emissive.setHex(0x000000);
              } else if (enemy.type === "SOLDIER") {
                // Glow yellow helmet visor
                const visor = mesh?.getObjectByName("visor");
                if (part === visor) {
                  part.material.color.setHex(enemy.state === "ATTACKING" ? 0xef4444 : 0xfbbf24);
                } else {
                  part.material.emissive.setHex(0x000000);
                }
              } else if (enemy.type === "CYBER_DEMON") {
                part.material.emissive.setHex(0x450a0a);
                part.material.emissiveIntensity = 0.25;
              }
            }
          }
        });
      });

      // Purge orphaned/obsolete combat entities
      enemyMeshMap.forEach((mesh, k) => {
        if (!activeEnemiesIds.has(k)) {
          enemiesGroup.remove(mesh);
          enemyMeshMap.delete(k);
        }
      });

      // Sync other co-op players
      const activePlayersIds = new Set<string>();

      opList.forEach((op) => {
        activePlayersIds.add(op.id);
        let mesh = playerMeshMap.get(op.id);

        if (!mesh) {
          mesh = constructRemotePlayerMesh(op.color);
          playersGroup.add(mesh);
          playerMeshMap.set(op.id, mesh);
        }

        mesh.position.set(op.x, 0.32, op.y);
        
        // Face their exact heading orientation vector
        mesh.lookAt(op.x + Math.sin(op.angle), mesh.position.y, op.y + Math.cos(op.angle));

        // Visibility triggers representing gun muzzle flames
        const muzzleLight = mesh.getObjectByName("muzzle_spark") as THREE.Mesh;
        if (muzzleLight) {
          muzzleLight.visible = !!op.isFiring;
        }

        const visor = mesh.getObjectByName("visor") as THREE.Mesh;
        if (visor && visor.material instanceof THREE.MeshStandardMaterial) {
          visor.material.color.setHex(op.isFiring ? 0xef4444 : 0xffffff);
          visor.material.emissive.setHex(op.isFiring ? 0xef4444 : 0xffffff);
        }
      });

      // Wipe departed clients
      playerMeshMap.forEach((mesh, k) => {
        if (!activePlayersIds.has(k)) {
          playersGroup.remove(mesh);
          playerMeshMap.delete(k);
        }
      });

      // Sync active particles (bullet/plasma tracers)
      const activeParticleIds = new Set<string>();

      pList.forEach((p) => {
        activeParticleIds.add(p.id);
        let mesh = particleMeshMap.get(p.id);

        if (!mesh) {
          const mat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(p.color || "#eab308"),
            transparent: true,
            opacity: p.alpha || 0.9,
          });
          mesh = new THREE.Mesh(bulletSparkGeo, mat);
          particlesGroup.add(mesh);
          particleMeshMap.set(p.id, mesh);
        }

        mesh.position.set(p.x, 0.4, p.y);
        // Decrease physical size representing bullet fading out
        const curScale = Math.max(0.1, p.alpha);
        mesh.scale.set(curScale, curScale, curScale);

        if (mesh.material instanceof THREE.MeshBasicMaterial) {
          mesh.material.opacity = p.alpha;
        }
      });

      // Clean finished sparks
      particleMeshMap.forEach((mesh, k) => {
        if (!activeParticleIds.has(k)) {
          particlesGroup.remove(mesh);
          particleMeshMap.delete(k);
        }
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(renderTick);
    };

    renderTick();

    // Clean up Three.js structures cleanly on unmount or level swaps
    return () => {
      isRequestingFrame = false;
      cancelAnimationFrame(animationFrameId);

      // Dismantle geometry buffers and maps safely to prevent memory leaks
      scene.clear();
      wallsGroup.clear();
      enemiesGroup.clear();
      playersGroup.clear();
      particlesGroup.clear();

      wallGeo.dispose();
      matStandard.dispose();
      matReactor.dispose();
      matToxic.dispose();
      matExit.dispose();

      floorGeo.dispose();
      floorMat.dispose();
      ceilingGeo.dispose();
      ceilingMat.dispose();

      droneCoreGeo.dispose();
      droneEyeGeo.dispose();
      dronePropGeo.dispose();

      soldierTorsoGeo.dispose();
      soldierHeadGeo.dispose();
      soldierVisorGeo.dispose();
      soldierGunGeo.dispose();

      demonTorsoGeo.dispose();
      demonHeadGeo.dispose();
      demonHornGeo.dispose();
      demonShoulderGeo.dispose();

      bulletSparkGeo.dispose();

      enemyMeshMap.clear();
      playerMeshMap.clear();
      particleMeshMap.clear();

      renderer.dispose();
    };
  }, [level]); // Fully rebuild blocks map when shifting arena rooms

  return (
    <div
      id="raycaster-viewport-container"
      ref={containerRef}
      onDoubleClick={(e) => {
        if ((e.target as HTMLElement).id === "raycaster-3d-canvas" || (e.target as HTMLElement).id === "raycaster-viewport-container") {
          toggleFullscreen();
        }
      }}
      className={`relative w-full max-w-full rounded-lg overflow-hidden bg-black border-4 shadow-2xl transition-all duration-300 ${
        isFullscreen ? "h-screen w-screen !max-w-none !aspect-auto" : "aspect-[4/3]"
      } ${player.isTakingDamage ? "animate-vibration border-red-600/85 shadow-[0_0_30px_rgba(220,38,38,0.45)]" : "border-slate-950"}`}
    >
      {/* 3D Canvas WebGL Three.js Element */}
      <canvas
        id="raycaster-3d-canvas"
        ref={canvasRef}
        onMouseDown={(e) => {
          // Trigger fire weapon callback when player clicks inside the viewport
          if (onFire) {
            onFire();
          }
        }}
        className="w-full h-full object-fill block cursor-crosshair"
      />

      {/* Modern HUD Tactical Health/Shield Stat Bars overlayed on Top-Left of Viewport */}
      <div 
        id="viewport-hud-vitals"
        className="absolute top-3 left-3 z-30 select-none bg-slate-950/85 border border-slate-800 p-2.5 rounded-md min-w-[155px] sm:min-w-[185px] space-y-2 font-mono shadow-lg transition-transform duration-150"
      >
        {/* Health / Vitals bar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 w-10 sm:w-14 shrink-0 text-rose-500 font-bold text-[8px] sm:text-[10px]/none tracking-wider uppercase">
            <Heart className="w-3.5 h-3.5 fill-rose-600 animate-pulse" />
            <span className="hidden sm:inline">VITALS</span>
          </div>
          <div className="flex-1 bg-slate-900 border border-slate-800/80 rounded-full h-2.5 overflow-hidden shadow-inner flex items-center p-0.5">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${player.health}%` }}
            />
          </div>
          <span className={`${player.health < 30 ? "text-red-500 animate-pulse font-extrabold" : "text-white"} text-[10px] sm:text-xs font-bold leading-none w-7 text-right`}>
            {player.health}%
          </span>
        </div>

        {/* Shield / Defender bar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 w-10 sm:w-14 shrink-0 text-blue-400 font-bold text-[8px] sm:text-[10px]/none tracking-wider uppercase">
            <Shield className="w-3.5 h-3.5 fill-blue-600" />
            <span className="hidden sm:inline">DEFENDER</span>
          </div>
          <div className="flex-1 bg-slate-900 border border-slate-800/80 rounded-full h-2.5 overflow-hidden shadow-inner flex items-center p-0.5">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${player.shield}%` }}
            />
          </div>
          <span className="text-white text-[10px] sm:text-xs font-bold leading-none w-7 text-right">
            {player.shield}%
          </span>
        </div>
      </div>

      {/* Tactical Radar Minimap Overlay embedded directly inside the 3D Viewport */}
      <div 
        className="absolute top-3 right-3 z-30 select-none scale-75 sm:scale-90 md:scale-100 origin-top-right max-w-[145px] md:max-w-[165px]"
      >
        <RadarMap
          player={player}
          enemies={enemies}
          level={level}
          otherPlayers={otherPlayers}
        />
      </div>

      {/* CRT Scanline Retro Filter Overlay */}
      {scanlines && (
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[size:100%_4px,_6px_100%] z-20" />
      )}

      {/* Dynamic Recoil Weapon shake animation wrapper */}
      <div 
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none z-10 transition-transform ${
          player.isFiring ? "translate-y-2.5 scale-95 duration-75" : "hover:-translate-y-1 duration-200"
        }`}
      >
        {/* Animated Handheld Weapon Weapon Frame overlays */}
        <div className="flex flex-col items-center">
          {/* Muzzle Flash Overlay effect drawing */}
          {player.isFiring && (
            <div className="w-16 h-16 rounded-full bg-radial from-amber-400 via-rose-500 to-transparent opacity-90 animate-ping -mb-10 z-0" />
          )}

          {/* Procedural Rendered Weapon Emojis with large immersive display */}
          <span className={`text-[64px] filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] leading-none select-none transform ${
            player.isFiring ? "rotate-3 translate-x-1" : ""
          }`}>
            {player.weapons[player.currentWeaponIndex]?.emoji}
          </span>
        </div>
      </div>

      {/* Screen Hit Flash Flash Animation */}
      {player.isTakingDamage && (
        <div className="absolute inset-0 pointer-events-none border-[6px] border-red-600/60 z-30 animate-pulse" />
      )}

      {/* LEVEL_COMPLETE Overlay Screen Stage */}
      {gameState === "LEVEL_COMPLETE" && (
        <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center select-none pointer-events-auto">
          <div className="p-4 rounded-full bg-cyan-950 border border-cyan-850 text-cyan-400 mb-4 animate-bounce">
            <Award className="w-9 h-9" />
          </div>
          <h2 className="text-sm font-bold text-white uppercase tracking-widest text-cyan-400 py-0.5 px-3 bg-cyan-950/80 border border-cyan-900 rounded mb-2">
            LEVEL COMPLETED SECURELY
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mt-1 mb-6">
            Lift diagnostics normal. Core systems transferring to next sector. Prepare for enhanced security.
          </p>
          <button
            id="advance-simulation-btn"
            onClick={onAdvanceLevel}
            className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold uppercase text-xs rounded transition-all duration-150 cursor-pointer border border-cyan-850 pointer-events-auto"
          >
            INITIATE TRANSIT ELEVATE
          </button>
        </div>
      )}

      {/* GAMEOVER Overlay Screen Stage */}
      {gameState === "GAMEOVER" && (
        <div className="absolute inset-0 z-40 bg-red-950/20 backdrop-blur-sm bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center select-none pointer-events-auto">
          <div className="p-4 rounded-full bg-red-950 border border-red-750 text-red-500 mb-4 font-bold scale-110">
            💀 DEMISE CORE TERMINATED
          </div>
          <p className="text-xs text-slate-400 max-w-xs mt-1 mb-6">
            Your tactical cyber-frame has been incinerated. Retry the diagnostic level.
          </p>
          <button
            id="reset-simulation-btn"
            onClick={onResetLevel}
            className="px-6 py-2 bg-red-800 hover:bg-red-700 text-white font-bold uppercase text-xs rounded transition-all duration-150 cursor-pointer border border-red-650 pointer-events-auto"
          >
            RESPAWN TACTICAL FRAME
          </button>
        </div>
      )}

      {/* VICTORY_ALL Overlay Screen Stage */}
      {gameState === "VICTORY_ALL" && (
        <div className="absolute inset-0 z-40 bg-emerald-950/15 backdrop-blur-sm bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center select-none pointer-events-auto">
          <div className="p-4 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 mb-4 scale-125 animate-pulse">
            🏆 CAMPAIGN VICTORIOUS
          </div>
          <h1 className="text-lg font-extrabold text-white uppercase tracking-wider">
            MAINFRAME SAVED SECURELY
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mt-3 mb-6 leading-relaxed">
            Rogue droids purged entirely from Sector Delta. Your score was logged in archives. Bravo, Commander!
          </p>
          <div className="flex gap-3">
            <button
              id="restart-main-campaign-btn"
              onClick={onExitToIntro}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold uppercase text-xs rounded transition-all duration-150 cursor-pointer border border-emerald-850 pointer-events-auto"
            >
              DEBRIEF LOGS & EXIT
            </button>
          </div>
        </div>
      )}

      {/* Sci-fi Tactical Fullscreen Trigger Button */}
      <button
        id="viewport-fullscreen-toggle"
        onClick={toggleFullscreen}
        className="absolute bottom-3 right-3 z-30 flex items-center justify-center w-8 h-8 rounded bg-slate-950/80 border border-slate-800 hover:border-cyan-500 hover:bg-slate-900 text-slate-400 hover:text-cyan-400 transition-colors pointer-events-auto cursor-pointer"
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? (
          <Minimize2 className="w-4 h-4" />
        ) : (
          <Maximize2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
