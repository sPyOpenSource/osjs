import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Car, Track, AIDriver, SectorTime, RaceTelemetry } from "../types";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Eye, Radio, Award, Compass, Sparkles } from "lucide-react";

interface RaceCanvasProps {
  currentCar: Car;
  currentTrack: Track;
  difficulty: "Rookie" | "Amateur" | "Pro" | "Legend";
  onRaceFinished: (data: { position: number; lapTimes: number[]; prizeEarned: number; speedRecord: number }) => void;
  onExit: () => void;
}

// Key code mapping
const KEYS = {
  UP: ["ArrowUp", "w", "KeyW"],
  DOWN: ["ArrowDown", "s", "KeyS"],
  LEFT: ["ArrowLeft", "a", "KeyA"],
  RIGHT: ["ArrowRight", "d", "KeyD"],
  HANDBRAKE: ["Space", " "],
  SHIFT_UP: ["ShiftLeft", "ShiftRight", "Shift"],
  SHIFT_DOWN: ["ControlLeft", "ControlRight", "Control", "KeyX"],
  CAMERA: ["KeyC", "c"]
};

// Simple pseudo-3D segment structure
interface RoadSegment {
  index: number;
  p1: { x: number; y: number; z: number; screenX: number; screenY: number; screenW: number };
  p2: { x: number; y: number; z: number; screenX: number; screenY: number; screenW: number };
  curve: number;
  pitch: number;
  sprite?: {
    type: "billboard" | "grandstand" | "tree" | "bridge";
    name: string;
    offsetX: number;
    color?: string;
  };
}

export default function RaceCanvas({ currentCar, currentTrack, difficulty, onRaceFinished, onExit }: RaceCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game states
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isCountdown, setIsCountdown] = useState<boolean>(false);
  const [countdownText, setCountdownText] = useState<string>("GO GO GO!");
  const [cameraView, setCameraView] = useState<"chase" | "cockpit" | "hood">("chase");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [transmissionMode, setTransmissionMode] = useState<"Auto" | "Manual">("Auto");
  
  // Race statistics
  const [racePosition, setRacePosition] = useState<number>(5);
  const [currentSector, setCurrentSector] = useState<1 | 2 | 3>(1);
  const [sectorTimes, setSectorTimes] = useState<SectorTime>({ sector1: null, sector2: null, sector3: null });
  const [liveLeaderboard, setLiveLeaderboard] = useState<Array<{ name: string; carName: string; progress: number; distanceLeft: number; finished: boolean }>>([]);
  const [speedRecord, setSpeedRecord] = useState<number>(0);
  
  // Audio state
  const audioContextRef = useRef<AudioContext | null>(null);
  const engineOscillatorRef = useRef<OscillatorNode | null>(null);
  const engineGainNodeRef = useRef<GainNode | null>(null);
  const screamerOscillatorRef = useRef<OscillatorNode | null>(null);
  const screamerGainNodeRef = useRef<GainNode | null>(null);
  const tireScreechNodeRef = useRef<OscillatorNode | null>(null);
  const tireScreechGainNodeRef = useRef<GainNode | null>(null);

  // Engineer Radio
  const [radioActive, setRadioActive] = useState<boolean>(false);
  const [engineerCommentary, setEngineerCommentary] = useState<string>(
    `Race Engineer: "Radio check. Clear down the pit wall. Your Porsche ${currentCar.name} looks primed. Good luck out there!"`
  );
  const [engineerAdvice, setEngineerAdvice] = useState<string>("Focus on clean exits out of Sector 1.");

  // Car clash collision feedback and screen shake HUD hooks
  const [activeClashInfo, setActiveClashInfo] = useState<{ opponentName: string; severity: number; time: number } | null>(null);
  const [screenShakeAmount, setScreenShakeAmount] = useState<number>(0);

  // Keyboard references for instant access in loop
  const keysPressedRef = useRef<{ [key: string]: boolean }>({});
  
  // Simulation variables (ref-based for high performance RAF loop)
  const trackPositionRef = useRef<number>(0); // how far player has driven along Z coordinate
  const playerXRef = useRef<number>(0); // -1 (left) to 1 (right)
  const speedRef = useRef<number>(0); // speed in km/h
  const rmpRef = useRef<number>(1000); // virtual engine RPM
  const gearRef = useRef<number>(1); // current gear 1-7
  const accelerationTimeRef = useRef<number>(0);
  const lapCountRef = useRef<number>(1);
  const lapTimesRef = useRef<number[]>([]);
  const currentLapStartTimeRef = useRef<number>(0);
  const currentSectorStartTimeRef = useRef<number>(0);
  const countdownTimerRef = useRef<number>(4); // count down triggers
  const completedLapsRef = useRef<number>(0);
  const totalLaps = 2; // Real Racing style quick Cup duel
  
  // Track geometry and dynamic scrolling values
  const segmentsRef = useRef<RoadSegment[]>([]);
  const roadWidth = 2000;
  const segmentLength = 200; // spacing between nodes
  const cameraHeight = 850;
  const drawDistance = 250; // visible segments ahead
  const centrifugalForce = 0.35; // corner slide multiplier
  
  // AI drivers configuration
  const aiDriversRef = useRef<AIDriver[]>([]);
  const totalTrackLengthZ = currentTrack.segmentCount * segmentLength;

  // Track the crew chief requests to throttle/avoid overload
  const lastRadioTriggerTimeRef = useRef<number>(0);

  // Three.js visual simulation refs
  const threeRendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const threeSceneRef = useRef<THREE.Scene | null>(null);
  const threeCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const threePointsRef = useRef<THREE.Vector3[] | null>(null);
  const threePlayerCarRef = useRef<THREE.Group | null>(null);
  const threeAICarsRef = useRef<THREE.Group[]>([]);
  const threeBrakeRefs = useRef<THREE.Mesh[]>([]);
  const threePlayerWheelsRef = useRef<THREE.Group[]>([]);
  const threeAIWheelsRef = useRef<THREE.Group[][]>([]);
  const threeSunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const threeSkyGroupRef = useRef<THREE.Group | null>(null);
  const threeSparkGroupsRef = useRef<{
    pointsMesh: THREE.Points;
    velocities: { x: number; y: number; z: number }[];
    age: number;
    maxAge: number;
  }[]>([]);
  const lastClashTimeRef = useRef<number>(0);

  // Setup decoupled WebGL three.js context independently of frequent timing updates
  useEffect(() => {
    if (!isPlaying) {
      if (threeRendererRef.current) {
        threeRendererRef.current.dispose();
        threeRendererRef.current = null;
      }
      threeSceneRef.current = null;
      threeCameraRef.current = null;
      threePointsRef.current = null;
      threePlayerCarRef.current = null;
      threeAICarsRef.current = [];
      threeBrakeRefs.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = containerRef.current?.clientWidth || 1200;
    const h = containerRef.current?.clientHeight || 800;
    
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Stunning smooth shadows
    threeRendererRef.current = renderer;

    const handleResize = () => {
      const pCanvas = canvasRef.current;
      const pContainer = containerRef.current;
      const pCamera = threeCameraRef.current;
      const pRenderer = threeRendererRef.current;
      if (!pCanvas || !pContainer || !pCamera || !pRenderer) return;

      const newW = pContainer.clientWidth;
      const newH = pContainer.clientHeight;

      pCamera.aspect = newW / newH;
      pCamera.updateProjectionMatrix();

      pRenderer.setSize(newW, newH, false);
    };

    window.addEventListener("resize", handleResize);
    setTimeout(handleResize, 50);
    
    // Define stunning, bright daytime color gradients tailored to each track
    let daySkyStart = "#38bdf8"; // Default electric sky blue
    let daySkyEnd = "#bae6fd";   // Default light horizon blue
    let daySunColor = "#fef08a";  // Bright radiant sun yellow
    
    if (currentTrack.id === "spa") {
      daySkyStart = "#0ea5e9"; // Spa forest day blue
      daySkyEnd = "#f0fdf4";   // forest mist light green-white
    } else if (currentTrack.id === "monza") {
      daySkyStart = "#1d4ed8"; // Monza bright azure
      daySkyEnd = "#e0f2fe";   // warm white-blue
      daySunColor = "#fef9c3"; // brilliant hot sun
    } else if (currentTrack.id === "silverstone") {
      daySkyStart = "#4ea7fc"; // Silverstone wind-swept blue
      daySkyEnd = "#e2e8f0";   // silver grey misty horizon
    } else if (currentTrack.id === "bathurst") {
      daySkyStart = "#0284c7"; // Blue outback sky
      daySkyEnd = "#fff7ed";   // dusty warm orange-white horizon
      daySunColor = "#ffe082";
    } else if (currentTrack.id === "suzuka") {
      daySkyStart = "#4338ca"; // Japanese afternoon indigo elements
      daySkyEnd = "#fae8ff";   // lavender cyber haze
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(daySkyEnd);
    scene.fog = new THREE.FogExp2(daySkyEnd, 0.00015);
    threeSceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(52, w / h, 5, 45000);
    threeCameraRef.current = camera;

    // Create 3D Sky Dome system
    const skyGroup = new THREE.Group();
    
    // 1. Day Sky Dome sphere with canvas vertical gradient texture
    const skyCanvas = document.createElement("canvas");
    skyCanvas.width = 128;
    skyCanvas.height = 128;
    const skyCtx = skyCanvas.getContext("2d");
    if (skyCtx) {
      const grad = skyCtx.createLinearGradient(0, 0, 0, 128);
      grad.addColorStop(0, daySkyStart);
      grad.addColorStop(1, daySkyEnd);
      skyCtx.fillStyle = grad;
      skyCtx.fillRect(0, 0, 128, 128);
    }
    const skyTexture = new THREE.CanvasTexture(skyCanvas);
    skyTexture.colorSpace = THREE.SRGBColorSpace;

    const skyGeom = new THREE.SphereGeometry(38000, 32, 24);
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTexture,
      side: THREE.BackSide,
      fog: false,
      depthWrite: false
    });
    const skyMesh = new THREE.Mesh(skyGeom, skyMat);
    skyGroup.add(skyMesh);

    // 2. High-performance beautiful fluffy white day clouds
    const cloudCount = 120;
    const cloudGeom = new THREE.BufferGeometry();
    const cloudPositions = new Float32Array(cloudCount * 3);
    for (let i = 0; i < cloudCount; i++) {
      const r = 24000 + Math.random() * 10000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.7); // keep cloud particles in upper hemisphere
      cloudPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      cloudPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      cloudPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    cloudGeom.setAttribute("position", new THREE.BufferAttribute(cloudPositions, 3));
    const cloudMat = new THREE.PointsMaterial({
      color: "#ffffff",
      size: 3200, // Large fluffy overlapping cloud-puffs
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.35,
      fog: false
    });
    const clouds = new THREE.Points(cloudGeom, cloudMat);
    skyGroup.add(clouds);

    // 3. Bright golden daylight sun orb and glow rings
    const celestialGeom = new THREE.SphereGeometry(2200, 24, 24);
    const celestialMat = new THREE.MeshBasicMaterial({
      color: daySunColor,
      fog: false
    });
    const celestialMesh = new THREE.Mesh(celestialGeom, celestialMat);
    celestialMesh.position.set(-8000, 15000, -25000);
    skyGroup.add(celestialMesh);

    const glowGeom = new THREE.RingGeometry(2200, 6800, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: "#ffffff",
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.32,
      fog: false
    });
    const glowMesh = new THREE.Mesh(glowGeom, glowMat);
    glowMesh.position.copy(celestialMesh.position);
    glowMesh.lookAt(0, 0, 0);
    skyGroup.add(glowMesh);

    scene.add(skyGroup);
    threeSkyGroupRef.current = skyGroup;
    
    // Ambient and directional race sunlamps
    const ambientLight = new THREE.AmbientLight("#f1f5f9", 0.85); // Bright natural ambient
    scene.add(ambientLight);
    
    const sunLight = new THREE.DirectionalLight("#fffbeb", 2.6); // Intense warm golden sunlight
    sunLight.position.set(2000, 4500, 1000);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 100;
    sunLight.shadow.camera.far = 16000;
    const shadowFrustum = 5000;
    sunLight.shadow.camera.left = -shadowFrustum;
    sunLight.shadow.camera.right = shadowFrustum;
    sunLight.shadow.camera.top = shadowFrustum;
    sunLight.shadow.camera.bottom = -shadowFrustum;
    sunLight.shadow.bias = -0.0003;
    scene.add(sunLight);
    threeSunLightRef.current = sunLight;

    const traceColor = currentTrack.curbColorPrimary.startsWith("#") ? currentTrack.curbColorPrimary : `#${currentTrack.curbColorPrimary}`;
    const spotLight = new THREE.DirectionalLight(traceColor, 0.45);
    spotLight.position.set(-1500, 2000, -500);
    scene.add(spotLight);
    
    // Construct 3D spline centerline representation from currentTrack geometry math!
    const segments = segmentsRef.current;
    const points: THREE.Vector3[] = [];
    let cx = 0;
    let cy = 0;
    for (let i = 0; i < segments.length; i++) {
      cx += segments[i].curve * 17;
      cy += (segments[i].pitch || 0) * 0.15;
      points.push(new THREE.Vector3(cx, cy, i * segmentLength));
    }
    threePointsRef.current = points;
    
    // Form the road and grass lawn ground meshes procedurally
    const roadGroup = new THREE.Group();
    const roadGeom = new THREE.PlaneGeometry(roadWidth * 2.3, segmentLength + 4);
    roadGeom.rotateX(-Math.PI / 2); // Horizontal alignment
    
    const tarmacMat = new THREE.MeshStandardMaterial({
      color: "#1d232e",
      roughness: 0.8,
      metalness: 0.15
    });

    // Mowed lawn grass ground geometries and alternating bi-color lawn materials
    const fieldGeom = new THREE.PlaneGeometry(42000, segmentLength + 6);
    fieldGeom.rotateX(-Math.PI / 2);

    const grassLawnMatA = new THREE.MeshStandardMaterial({
      color: "#166534", // Dark forest green turf stripe
      roughness: 0.95,
      metalness: 0.05
    });
    const grassLawnMatB = new THREE.MeshStandardMaterial({
      color: "#15803d", // Soft bright emerald green turf stripe
      roughness: 0.95,
      metalness: 0.05
    });

    const barrierMat = new THREE.MeshStandardMaterial({
      color: "#94a3b8", // Galvanized steel grey
      roughness: 0.28,
      metalness: 0.85
    });

    // High fidelity 3D grass blade/tuft shape
    const grassTuftGeom = new THREE.ConeGeometry(10, 90, 3);
    grassTuftGeom.translate(0, 45, 0); // align bottom base with layout plane
    const grassTuftMat = new THREE.MeshStandardMaterial({
      color: "#22c55e", // Light-vibrant grass green highlights
      roughness: 0.9,
      metalness: 0.02
    });
    
    const curbPGeom = new THREE.PlaneGeometry(roadWidth * 0.15, segmentLength + 4);
    curbPGeom.rotateX(-Math.PI / 2);
    
    const curbSGeom = new THREE.PlaneGeometry(roadWidth * 0.15, segmentLength + 4);
    curbSGeom.rotateX(-Math.PI / 2);
    
    const curbPMat = new THREE.MeshStandardMaterial({ color: currentTrack.curbColorPrimary, roughness: 0.95 });
    const curbSMat = new THREE.MeshStandardMaterial({ color: currentTrack.curbColorSecondary, roughness: 0.95 });
    
    for (let i = 0; i < segments.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % segments.length];
      if (!p1 || !p2) continue;
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      
      const plate = new THREE.Mesh(roadGeom, tarmacMat);
      plate.position.copy(mid);
      plate.lookAt(p2);
      plate.receiveShadow = true;
      roadGroup.add(plate);

      // 1. Procedural high-performance mowing strip lawn ground plate
      const isMowedDark = Math.floor(i / 5) % 2 === 0;
      const lawnMat = isMowedDark ? grassLawnMatA : grassLawnMatB;
      const lawnPlate = new THREE.Mesh(fieldGeom, lawnMat);
      lawnPlate.position.copy(mid).y -= 1.8; // Set slightly below tarmac to prevent screen flickering
      lawnPlate.lookAt(p2);
      lawnPlate.receiveShadow = true;
      roadGroup.add(lawnPlate);
      
      const isDark = Math.floor(i / 3) % 2 === 0;
      const curbMat = isDark ? curbPMat : curbSMat;
      
      const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
      const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
      
      const lC = new THREE.Mesh(curbPGeom, curbMat);
      lC.position.copy(mid).addScaledVector(right, -roadWidth * 1.15);
      lC.lookAt(p2);
      lC.receiveShadow = true;
      roadGroup.add(lC);
      
      const rC = new THREE.Mesh(curbSGeom, curbMat);
      rC.position.copy(mid).addScaledVector(right, roadWidth * 1.15);
      rC.lookAt(p2);
      rC.receiveShadow = true;
      roadGroup.add(rC);

      // 2. Spawn 3D structural grass tufts beside the curbs for realism
      if (i % 3 === 0) {
        // Left grass tuft
        const grassL = new THREE.Mesh(grassTuftGeom, grassTuftMat);
        const lOffset = -(roadWidth * (1.24 + Math.random() * 0.44));
        grassL.position.copy(mid).addScaledVector(right, lOffset).y -= 1.0;
        const scaleL = 0.5 + Math.random() * 0.85;
        grassL.scale.set(scaleL, scaleL * 1.25, scaleL);
        grassL.rotateY(Math.random() * Math.PI);
        grassL.castShadow = true;
        grassL.receiveShadow = true;
        roadGroup.add(grassL);
        
        // Right grass tuft
        const grassR = new THREE.Mesh(grassTuftGeom, grassTuftMat);
        const rOffset = roadWidth * (1.24 + Math.random() * 0.44);
        grassR.position.copy(mid).addScaledVector(right, rOffset).y -= 1.0;
        const scaleR = 0.5 + Math.random() * 0.85;
        grassR.scale.set(scaleR, scaleR * 1.25, scaleR);
        grassR.rotateY(Math.random() * Math.PI);
        grassR.castShadow = true;
        grassR.receiveShadow = true;
        roadGroup.add(grassR);
      }

      // 3. FIA Safety Barriers (Steel guard rails and colorful TechPro blocks on sharp turns)
      if (i % 2 === 0) {
        // Left safety railing
        const lRailing = new THREE.Mesh(new THREE.BoxGeometry(12, 36, segmentLength * 2 + 8), barrierMat);
        lRailing.position.copy(mid).addScaledVector(right, -roadWidth * 1.35).y += 18;
        lRailing.lookAt(p2);
        lRailing.castShadow = true;
        lRailing.receiveShadow = true;
        roadGroup.add(lRailing);

        // Right safety railing
        const rRailing = new THREE.Mesh(new THREE.BoxGeometry(12, 36, segmentLength * 2 + 8), barrierMat);
        rRailing.position.copy(mid).addScaledVector(right, roadWidth * 1.35).y += 18;
        rRailing.lookAt(p2);
        rRailing.castShadow = true;
        rRailing.receiveShadow = true;
        roadGroup.add(rRailing);

        // TechPro blocks lining the outer crash zones of sharp turns
        const turnComplexityScale = Math.abs(segments[i].curve);
        if (turnComplexityScale > 0.8) {
          const isOuterLeft = segments[i].curve > 0; // turn curves right -> outer is left
          const colorBanding = (i % 4 === 0) ? "#ef4444" : "#ffffff";
          const techProMat = new THREE.MeshStandardMaterial({
            color: colorBanding,
            roughness: 0.8,
            metalness: 0.05
          });
          const techPro = new THREE.Mesh(new THREE.BoxGeometry(22, 54, segmentLength * 2 + 10), techProMat);
          const blockOffset = isOuterLeft ? -roadWidth * 1.45 : roadWidth * 1.45;
          techPro.position.copy(mid).addScaledVector(right, blockOffset).y += 24;
          techPro.lookAt(p2);
          techPro.castShadow = true;
          techPro.receiveShadow = true;
          roadGroup.add(techPro);
        }
      }
      
      if (isDark) {
        const dividerGeom = new THREE.PlaneGeometry(roadWidth * 0.03, segmentLength * 0.5);
        dividerGeom.rotateX(-Math.PI / 2);
        const dividerMesh = new THREE.Mesh(dividerGeom, new THREE.MeshBasicMaterial({ color: "#ffffff" }));
        dividerMesh.position.copy(mid).y += 2;
        dividerMesh.lookAt(p2);
        roadGroup.add(dividerMesh);
      }
    }
    scene.add(roadGroup);
    
    // Distant background low-poly mountains for supreme atmospheric depth
    const mountainCount = 14;
    const mountainGroup = new THREE.Group();
    const mountainGeom = new THREE.ConeGeometry(5000, 6000, 4); // 4-sided low-poly peaks
    const mountainMat = new THREE.MeshStandardMaterial({
      color: currentTrack.id === "bathurst" ? "#9a3412" : "#14532d", // Warm terracotta outback vs lush evergreen forest
      roughness: 0.95,
      metalness: 0.05,
      flatShading: true
    });
    for (let i = 0; i < mountainCount; i++) {
      const cone = new THREE.Mesh(mountainGeom, mountainMat);
      const angle = (i / mountainCount) * Math.PI * 2;
      const distance = 26000 + Math.random() * 5000;
      const mx = Math.sin(angle) * distance;
      const mz = Math.cos(angle) * distance;
      const my = -1000 + Math.random() * 800;
      cone.position.set(mx, my, mz);
      const scaleY = 0.8 + Math.random() * 1.5;
      const scaleXZ = 1.2 + Math.random() * 1.5;
      cone.scale.set(scaleXZ, scaleY, scaleXZ);
      cone.receiveShadow = true;
      mountainGroup.add(cone);
    }
    scene.add(mountainGroup);

    // Spectator grandstand builder
    const createGrandstand = (pos: THREE.Vector3, lookAtTarget: THREE.Vector3) => {
      const gs = new THREE.Group();
      gs.position.copy(pos);
      
      const baseMat = new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.8, metalness: 0.4 });
      const seatMat = new THREE.MeshStandardMaterial({ color: "#ef4444", roughness: 0.7 }); // grandstand seats red
      const canopyMat = new THREE.MeshStandardMaterial({ color: "#f8fafc", roughness: 0.4, metalness: 0.3 }); // white canopy roof
      
      // Main scaffold structure
      const mainBase = new THREE.Mesh(new THREE.BoxGeometry(600, 160, 400), baseMat);
      mainBase.position.y = 80;
      mainBase.castShadow = true;
      mainBase.receiveShadow = true;
      gs.add(mainBase);

      // Canopy roof
      const canopy = new THREE.Mesh(new THREE.BoxGeometry(620, 20, 420), canopyMat);
      canopy.position.set(0, 240, -40);
      canopy.castShadow = true;
      gs.add(canopy);

      // Support pillars
      const pillarGeom = new THREE.CylinderGeometry(8, 8, 240, 6);
      const pillarMat = new THREE.MeshStandardMaterial({ color: "#64748b", metalness: 0.9, roughness: 0.2 });
      
      const p1 = new THREE.Mesh(pillarGeom, pillarMat); p1.position.set(-290, 120, 190);
      const p2 = new THREE.Mesh(pillarGeom, pillarMat); p2.position.set(290, 120, 190);
      const p3 = new THREE.Mesh(pillarGeom, pillarMat); p3.position.set(-290, 120, -190);
      const p4 = new THREE.Mesh(pillarGeom, pillarMat); p4.position.set(290, 120, -190);
      p1.castShadow = true; p2.castShadow = true; p3.castShadow = true; p4.castShadow = true;
      gs.add(p1, p2, p3, p4);

      // Billboard signs on top of grandstands
      const board = new THREE.Mesh(new THREE.BoxGeometry(400, 60, 10), new THREE.MeshStandardMaterial({ color: "#111111", roughness: 0.5 }));
      board.position.set(0, 280, -200);
      const lightSign = new THREE.Mesh(new THREE.BoxGeometry(380, 45, 12), new THREE.MeshBasicMaterial({ color: "#eab308" })); // glowing yellow sponsor sign
      lightSign.position.set(0, 280, -195);
      gs.add(board, lightSign);

      gs.lookAt(lookAtTarget);
      return gs;
    };

    // Spawn grandstands along the start-finish straight zone
    for (const gi of [15, 45, 75]) {
      const pStart = points[gi];
      const pNext = points[(gi + 1) % segments.length];
      if (pStart && pNext) {
        const dir = new THREE.Vector3().subVectors(pNext, pStart).normalize();
        const rightVec = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
        const gsPos = new THREE.Vector3().copy(pStart).addScaledVector(rightVec, -roadWidth * 3.0);
        const lookTarget = new THREE.Vector3().copy(pStart).addScaledVector(rightVec, roadWidth);
        const grandstand = createGrandstand(gsPos, lookTarget);
        scene.add(grandstand);
      }
    }

    // Trees, poles, billboards
    const trees = new THREE.Group();
    const billboards = new THREE.Group();
    
    const trunkGeom = new THREE.CylinderGeometry(15, 18, 120, 6);
    trunkGeom.translate(0, 60, 0);
    const trunkMat = new THREE.MeshStandardMaterial({ color: "#451a03", roughness: 0.95 });
    
    const foliageGeom = new THREE.ConeGeometry(95, 260, 5);
    foliageGeom.translate(0, 200, 0);
    
    // Variegated organic green shades to replace flat sterile green forest!
    const foliageMats = [
      new THREE.MeshStandardMaterial({ color: "#064e2e", roughness: 0.92 }), // Deep pine green
      new THREE.MeshStandardMaterial({ color: "#14532d", roughness: 0.9 }),  // Forest moss
      new THREE.MeshStandardMaterial({ color: "#166534", roughness: 0.95 }), // Lush emerald
      new THREE.MeshStandardMaterial({ color: "#0f5132", roughness: 0.88 })  // Deep juniper
    ];
    
    for (let i = 0; i < segments.length; i += 2) {
      const seg = segments[i];
      if (seg.sprite) {
        const p1 = points[i];
        const p2 = points[(i + 1) % segments.length];
        if (!p1 || !p2) continue;
        const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
        const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
        
        const sideOffset = seg.sprite.offsetX * roadWidth * 1.62;
        const spawnPos = new THREE.Vector3().copy(p1).addScaledVector(right, sideOffset);
        
        if (seg.sprite.type === "tree") {
          const tree = new THREE.Group();
          tree.position.copy(spawnPos);
          
          const trunk = new THREE.Mesh(trunkGeom, trunkMat);
          trunk.castShadow = true;
          trunk.receiveShadow = true;
          
          const leafMatInstance = foliageMats[i % foliageMats.length];
          const foliage = new THREE.Mesh(foliageGeom, leafMatInstance);
          foliage.castShadow = true;
          foliage.receiveShadow = true;
          
          tree.add(trunk, foliage);
          tree.scale.set(1.4, 1.4, 1.4);
          trees.add(tree);
        } else if (seg.sprite.type === "billboard") {
          const bbNode = new THREE.Group();
          bbNode.position.copy(spawnPos);
          
          const poleGeom = new THREE.CylinderGeometry(10, 10, 240, 6);
          const pole = new THREE.Mesh(poleGeom, trunkMat);
          pole.position.y = 120;
          pole.castShadow = true;
          pole.receiveShadow = true;
          bbNode.add(pole);
          
          const boardGeom = new THREE.BoxGeometry(450, 150, 24);
          const boardMat = new THREE.MeshStandardMaterial({
            color: seg.sprite.color === "#111" ? "#ef4444" : "#1e40af",
            roughness: 0.2,
            metalness: 0.8
          });
          const board = new THREE.Mesh(boardGeom, boardMat);
          board.position.y = 220;
          board.lookAt(new THREE.Vector3().addVectors(spawnPos, right));
          board.castShadow = true;
          board.receiveShadow = true;
          bbNode.add(board);
          
          billboards.add(bbNode);
        }
      }
    }
    scene.add(trees, billboards);
    
    // Player Car Mesh geometry
    const pGroup = new THREE.Group();
    const pColorHex = currentCar.color.startsWith("#") ? currentCar.color : `#${currentCar.color}`;
    const chassisGeom = new THREE.BoxGeometry(190, 62, 380);
    const chassisMesh = new THREE.Mesh(chassisGeom, new THREE.MeshStandardMaterial({
      color: new THREE.Color(pColorHex),
      metalness: 0.9,
      roughness: 0.15
    }));
    chassisMesh.position.y = 48;
    chassisMesh.castShadow = true;
    chassisMesh.receiveShadow = true;
    pGroup.add(chassisMesh);
    
    const glassMat = new THREE.MeshStandardMaterial({ color: "#0b1329", metalness: 0.95, roughness: 0.05 });
    const pCabin = new THREE.Mesh(new THREE.BoxGeometry(110, 48, 160), glassMat);
    pCabin.position.set(0, 90, -40);
    pCabin.castShadow = true;
    pCabin.receiveShadow = true;
    pGroup.add(pCabin);
    
    const aeroLevel = currentCar.upgrades.aerodynamics;
    const spoilerGroup = new THREE.Group();
    spoilerGroup.position.set(0, 80, -160);
    const strutGeom = new THREE.CylinderGeometry(4, 4, 40, 6);
    const carbonMat = new THREE.MeshStandardMaterial({ color: "#111111", roughness: 0.6, metalness: 0.9 });
    const strutL = new THREE.Mesh(strutGeom, carbonMat);
    strutL.position.x = 65;
    strutL.castShadow = true;
    const strutR = new THREE.Mesh(strutGeom, carbonMat);
    strutR.position.x = -65;
    strutR.castShadow = true;
    spoilerGroup.add(strutL, strutR);
    
    const bladeW = 210 + (aeroLevel * 15);
    const spBlade = new THREE.Mesh(new THREE.BoxGeometry(bladeW, 8, 35), carbonMat);
    spBlade.position.y = 20;
    spBlade.castShadow = true;
    spoilerGroup.add(spBlade);
    pGroup.add(spoilerGroup);
    
    const headG = new THREE.BoxGeometry(16, 20, 8);
    const lampMat = new THREE.MeshBasicMaterial({ color: "#ffffff" });
    const lH1 = new THREE.Mesh(headG, lampMat);
    lH1.position.set(70, 48, 186);
    const lH2 = new THREE.Mesh(headG, lampMat);
    lH2.position.set(-70, 48, 186);
    pGroup.add(lH1, lH2);
    
    const bGlow1 = new THREE.Mesh(new THREE.BoxGeometry(28, 14, 8), new THREE.MeshBasicMaterial({ color: "#770000" }));
    bGlow1.position.set(75, 48, -186);
    const bGlow2 = new THREE.Mesh(new THREE.BoxGeometry(28, 14, 8), new THREE.MeshBasicMaterial({ color: "#770000" }));
    bGlow2.position.set(-75, 48, -186);
    pGroup.add(bGlow1, bGlow2);
    threeBrakeRefs.current = [bGlow1, bGlow2];

    // Ambient Occlusion shadow plate underneath player car to ground it on asphalt beautifully
    const playerShadowPlate = new THREE.Mesh(
      new THREE.PlaneGeometry(160, 360),
      new THREE.MeshBasicMaterial({ color: "#000000", transparent: true, opacity: 0.45 })
    );
    playerShadowPlate.rotation.x = -Math.PI / 2;
    playerShadowPlate.position.y = 1;
    pGroup.add(playerShadowPlate);

    // Build gorgeous rotating 3D racing wheel structures!
    const wheelPositions = [
      { x: 86, y: 35, z: 120, name: "fl" },  // Front Left
      { x: -86, y: 35, z: 120, name: "fr" }, // Front Right
      { x: 86, y: 35, z: -120, name: "rl" }, // Rear Left
      { x: -86, y: 35, z: -120, name: "rr" } // Rear Right
    ];

    const playerWheels: THREE.Group[] = [];
    const tyreGeom = new THREE.CylinderGeometry(35, 35, 45, 12);
    tyreGeom.rotateZ(Math.PI / 2);
    const tyreMat = new THREE.MeshStandardMaterial({ color: "#111111", roughness: 0.85, metalness: 0.1 });
    
    const rimGeom = new THREE.CylinderGeometry(20, 20, 47, 12);
    rimGeom.rotateZ(Math.PI / 2);
    const rimMat = new THREE.MeshStandardMaterial({ color: "#cbd5e1", roughness: 0.15, metalness: 0.95 });
    
    wheelPositions.forEach((pos) => {
      const wGroup = new THREE.Group();
      wGroup.position.set(pos.x, pos.y, pos.z);
      wGroup.name = pos.name;
      
      const spinGroup = new THREE.Group();
      spinGroup.name = "spin";
      
      const tyre = new THREE.Mesh(tyreGeom, tyreMat);
      tyre.castShadow = true;
      tyre.receiveShadow = true;
      spinGroup.add(tyre);
      
      const rim = new THREE.Mesh(rimGeom, rimMat);
      rim.castShadow = true;
      rim.receiveShadow = true;
      spinGroup.add(rim);
      
      // Structural spokes matching racing rims
      const spoke1 = new THREE.Mesh(new THREE.BoxGeometry(8, 38, 48), carbonMat);
      const spoke2 = new THREE.Mesh(new THREE.BoxGeometry(38, 8, 48), carbonMat);
      spoke1.castShadow = true;
      spoke2.castShadow = true;
      spinGroup.add(spoke1, spoke2);
      
      wGroup.add(spinGroup);
      pGroup.add(wGroup);
      playerWheels.push(wGroup);
    });
    threePlayerWheelsRef.current = playerWheels;
    
    scene.add(pGroup);
    threePlayerCarRef.current = pGroup;
    
    // AI Opponent Cars
    const aiGroups: THREE.Group[] = [];
    const aiWheelsList: THREE.Group[][] = [];

    aiDriversRef.current.forEach((ai) => {
      const aiCGroup = new THREE.Group();
      const aiChassis = new THREE.Mesh(chassisGeom, new THREE.MeshStandardMaterial({
        color: new THREE.Color(ai.color),
        metalness: 0.82,
        roughness: 0.2
      }));
      aiChassis.position.y = 48;
      aiChassis.castShadow = true;
      aiChassis.receiveShadow = true;
      aiCGroup.add(aiChassis);
      
      const aiCabin = new THREE.Mesh(new THREE.BoxGeometry(110, 48, 160), glassMat);
      aiCabin.position.set(0, 90, -40);
      aiCabin.castShadow = true;
      aiCabin.receiveShadow = true;
      aiCGroup.add(aiCabin);
      
      const aiSp = new THREE.Mesh(new THREE.BoxGeometry(210, 8, 35), carbonMat);
      aiSp.position.set(0, 100, -160);
      aiSp.castShadow = true;
      aiSp.receiveShadow = true;
      aiCGroup.add(aiSp);

      const aiShadowPlate = new THREE.Mesh(
        new THREE.PlaneGeometry(160, 360),
        new THREE.MeshBasicMaterial({ color: "#000000", transparent: true, opacity: 0.45 })
      );
      aiShadowPlate.rotation.x = -Math.PI / 2;
      aiShadowPlate.position.y = 1;
      aiCGroup.add(aiShadowPlate);

      // AI Wheels list
      const aiWheels: THREE.Group[] = [];
      wheelPositions.forEach((pos) => {
        const wGroup = new THREE.Group();
        wGroup.position.set(pos.x, pos.y, pos.z);
        wGroup.name = pos.name;
        
        const spinGroup = new THREE.Group();
        spinGroup.name = "spin";
        
        const tyre = new THREE.Mesh(tyreGeom, tyreMat);
        tyre.castShadow = true;
        tyre.receiveShadow = true;
        spinGroup.add(tyre);
        
        const rim = new THREE.Mesh(rimGeom, rimMat);
        rim.castShadow = true;
        rim.receiveShadow = true;
        spinGroup.add(rim);
        
        const spoke1 = new THREE.Mesh(new THREE.BoxGeometry(8, 38, 48), carbonMat);
        const spoke2 = new THREE.Mesh(new THREE.BoxGeometry(38, 8, 48), carbonMat);
        spoke1.castShadow = true;
        spoke2.castShadow = true;
        spinGroup.add(spoke1, spoke2);
        
        wGroup.add(spinGroup);
        aiCGroup.add(wGroup);
        aiWheels.push(wGroup);
      });
      
      scene.add(aiCGroup);
      aiGroups.push(aiCGroup);
      aiWheelsList.push(aiWheels);
    });
    threeAICarsRef.current = aiGroups;
    threeAIWheelsRef.current = aiWheelsList;
    
    const grid = new THREE.GridHelper(100000, 200, "#1a1f2e", "#0a0c12");
    grid.position.y = -1;
    scene.add(grid);

    renderer.render(scene, camera);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (threeRendererRef.current) {
        threeRendererRef.current.dispose();
        threeRendererRef.current = null;
      }
      threeSceneRef.current = null;
      threeCameraRef.current = null;
      threePointsRef.current = null;
      threePlayerCarRef.current = null;
      threeAICarsRef.current = [];
      threeBrakeRefs.current = [];
      threePlayerWheelsRef.current = [];
      threeAIWheelsRef.current = [];
      threeSunLightRef.current = null;
      threeSkyGroupRef.current = null;
      threeSparkGroupsRef.current = [];
    };
  }, [isPlaying, currentTrack, currentCar]);

  // Initialize Track Data
  useEffect(() => {
    // Generate the custom pseudo-3D road segments
    const segments: RoadSegment[] = [];
    const complexity = currentTrack.turnComplexity;
    
    for (let i = 0; i < currentTrack.segmentCount; i++) {
      let curve = 0;
      let pitch = 0;
      
      // Lay down strategic curves for authentic licensed tracks
      if (currentTrack.id === "spa") {
        // Eau Rouge climb segment (approx index 300 to 500)
        if (i > 250 && i < 350) { curve = -1.2 * complexity; pitch = 85; } // steep up-left
        else if (i >= 350 && i < 450) { curve = 1.4 * complexity; pitch = -35; } // crest right
        else if (i > 600 && i < 800) curve = 0.4 * complexity; // Kemmel Straight slight curve
        else if (i > 1200 && i < 1400) curve = -1.8 * complexity; // Brussels loop
        else if (i > 2000 && i < 2200) curve = -2.2 * complexity; // Pouhon double left-hander
        else if (i > 3200 && i < 3400) curve = 1.6 * complexity; // Blanchimont fast corner
        else if (i > 3800 && i < 4100) curve = -0.5 * complexity; // Bus stop chicane
      } else if (currentTrack.id === "monza") {
        // Straight 1 to chicane
        if (i > 400 && i < 460) curve = 3.5 * complexity; // Retifilo chicane right
        else if (i >= 460 && i < 520) curve = -3.5 * complexity; // Retifilo chicane left
        else if (i > 800 && i < 1100) curve = 0.5 * complexity; // Curva Grande sweeping right
        else if (i > 1500 && i < 1620) curve = -2.5 * complexity; // Roggia chicane
        else if (i > 2100 && i < 2400) curve = 1.2 * complexity; // Lesmo corners
        else if (i > 2700 && i < 3000) curve = 2.4 * complexity; // Parabolica long sweeping curve
      } else if (currentTrack.id === "silverstone") {
        if (i > 200 && i < 400) curve = 1.8 * complexity; // Copse
        else if (i > 600 && i < 750) curve = -2.2 * complexity; // Maggots
        else if (i >= 750 && i < 900) curve = 2.4 * complexity; // Becketts
        else if (i >= 900 && i < 1050) curve = -1.5 * complexity; // Chapel exit
        else if (i > 1600 && i < 1920) curve = 1.2 * complexity; // Stow corner
        else if (i > 2500 && i < 2800) curve = 2.0 * complexity; // Club corner
      } else if (currentTrack.id === "bathurst") {
        // Mountain ascent
        if (i > 300 && i < 1000) { pitch = 140; curve = 0.8 * complexity; } // Mountain climb
        if (i > 1000 && i < 1300) { curve = -3.0 * complexity; pitch = -20; } // The Cutting
        if (i > 1300 && i < 2000) { curve = 3.5 * complexity; pitch = -80; } // Skyline and Dipper drop steep downhill walls
        if (i > 2400 && i < 3300) { curve = 0.2; pitch = 0; } // Conrod Straight flat speed
        if (i > 3500 && i < 3700) curve = 2.2 * complexity; // Chase chicane
      } else {
        // Default Suzuka figure 8 and S-curves
        if (i > 150 && i < 450) curve = (i % 80 > 40 ? 1.5 : -1.5) * complexity; // S Curves
        else if (i > 800 && i < 1100) curve = -2.0 * complexity; // Degner
        else if (i > 1700 && i < 1900) curve = 2.3 * complexity; // Hairpin
        else if (i > 2500 && i < 2800) curve = -1.6 * complexity; // Spoon curve
        else if (i > 3200 && i < 3400) curve = 3.0 * complexity; // 130R high speed
      }

      // Add billboards and decorations on sides of specific segments
      let sprite: RoadSegment["sprite"] = undefined;
      if (i % 70 === 0 && i > 30) {
        const side = i % 140 === 0 ? -1.8 : 1.8;
        const sponsors = ["Rolex", "Pirelli", "Tag Heuer", "Ferrari", "Porsche", "Mobil1", "Michelin", "RedBull"];
        sprite = {
          type: "billboard",
          name: sponsors[Math.floor((i / 70) % sponsors.length)],
          offsetX: side,
          color: (i / 70) % 2 === 0 ? "#111" : "#fff"
        };
      } else if (i % 150 === 20) {
        sprite = {
          type: "tree",
          name: i % 2 === 0 ? "Pine Tree" : "Oak Tree",
          offsetX: i % 300 === 0 ? -2.2 : 2.2
        };
      } else if (i % 300 === 180) {
        sprite = {
          type: "grandstand",
          name: "Main Grandstand",
          offsetX: -2.8,
          color: "#0f172a"
        };
      }

      segments.push({
        index: i,
        p1: { x: 0, y: 0, z: i * segmentLength, screenX: 0, screenY: 0, screenW: 0 },
        p2: { x: 0, y: 0, z: (i + 1) * segmentLength, screenX: 0, screenY: 0, screenW: 0 },
        curve,
        pitch,
        sprite
      });
    }
    
    segmentsRef.current = segments;

    // staggered grid AI racers: starting staggered back to front
    // Name, skill, carName, offset lane, baseline starting position
    const racers = [
      { name: "M. Verstappen", skill: 1.15, carId: "aston_valkyrie", carName: "AMR Valkyrie", color: "#1e3a8a", startZ: 2500 },
      { name: "L. Hamilton", skill: 1.10, carId: "mclaren_p1", carName: "P1 GTR", color: "#f97316", startZ: 2000 },
      { name: "C. Leclerc", skill: 1.05, carId: "ferrari_laferrari", carName: "LaFerrari", color: "#ef4444", startZ: 1500 },
      { name: "S. Vettel", skill: 0.98, carId: "porsche_911", carName: "911 GT3 RS", color: "#22c55e", startZ: 1000 },
      { name: "L. Norris", skill: 0.95, carId: "porsche_911", carName: "911 GT3 RS", color: "#eab308", startZ: 500 }
    ];

    aiDriversRef.current = racers.map(r => ({
      name: r.name,
      difficulty: r.skill,
      carId: r.carId,
      carName: r.carName,
      color: r.color,
      position: r.startZ,
      lane: Math.random() * 1.4 - 0.7, // staggered starting lanes
      speed: 0,
      lap: 1,
      finished: false
    }));

    trackPositionRef.current = 0;
    playerXRef.current = 0;
    speedRef.current = 0;
    rmpRef.current = 1000;
    gearRef.current = 1;
    lapCountRef.current = 1;
    completedLapsRef.current = 0;
    lapTimesRef.current = [];
    currentLapStartTimeRef.current = Date.now();
    currentSectorStartTimeRef.current = Date.now();
  }, [currentTrack]);

  // Audio Synthesizer Controls
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      if (engineGainNodeRef.current) engineGainNodeRef.current.gain.value = 0;
      if (tireScreechGainNodeRef.current) tireScreechGainNodeRef.current.gain.value = 0;
    } else {
      if (engineGainNodeRef.current) engineGainNodeRef.current.gain.value = 0.15;
    }
  };

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressedRef.current[e.code] = true;
      keysPressedRef.current[e.key.toLowerCase()] = true;

      // Handle manual gear shifts and views directly on keypress
      if (KEYS.SHIFT_UP.includes(e.code) || KEYS.SHIFT_UP.includes(e.key)) {
        if (transmissionMode === "Manual" && gearRef.current < 7) {
          gearRef.current += 1;
          rmpRef.current = Math.max(2500, rmpRef.current - 3500); // realistic drop in rpm on higher gear ratio
        }
      }
      if (KEYS.SHIFT_DOWN.includes(e.code) || KEYS.SHIFT_DOWN.includes(e.key)) {
        if (transmissionMode === "Manual" && gearRef.current > 1) {
          gearRef.current -= 1;
          rmpRef.current = Math.min(8400, rmpRef.current + 3200); // realistic rise in rpm on downshift
        }
      }
      if (KEYS.CAMERA.includes(e.key)) {
        setCameraView(prev => {
          if (prev === "chase") return "cockpit";
          if (prev === "cockpit") return "hood";
          return "chase";
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.code] = false;
      keysPressedRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [transmissionMode]);

  // Launch HTML5 Web Audio Synthesizer
  const initSynth = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      // 1. Core Engine Oscillator Setup (Lower register mechanical roar)
      const engineOsc = ctx.createOscillator();
      engineOsc.type = "sawtooth"; // Gives that rich throaty GT3 / V12 growl
      
      const engineGain = ctx.createGain();
      engineGain.gain.value = isMuted ? 0 : 0.10;

      // Low pass filter to make the base engine sound heavier and muscular
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 850;

      engineOsc.connect(filter);
      filter.connect(engineGain);
      engineGain.connect(ctx.destination);
      
      engineOsc.start();
      engineOscillatorRef.current = engineOsc;
      engineGainNodeRef.current = engineGain;

      // 1b. HIGH-PITCHED SCREAMER HARMONIC (F1/Hypercar high-frequency transmission whine and valve scream)
      const screamerOsc = ctx.createOscillator();
      screamerOsc.type = "triangle"; // clean high frequency scream
      
      const screamerGain = ctx.createGain();
      screamerGain.gain.value = 0; // Ramps up on throttle / RPM

      const screamerFilter = ctx.createBiquadFilter();
      screamerFilter.type = "highpass";
      screamerFilter.frequency.value = 350; // Filter out low registers

      screamerOsc.connect(screamerFilter);
      screamerFilter.connect(screamerGain);
      screamerGain.connect(ctx.destination);

      screamerOsc.start();
      screamerOscillatorRef.current = screamerOsc;
      screamerGainNodeRef.current = screamerGain;

      // 2. Tire Screech setup
      const screechOsc = ctx.createOscillator();
      screechOsc.type = "triangle";
      screechOsc.frequency.value = 580;

      const screechGain = ctx.createGain();
      screechGain.gain.value = 0; // standard off
      
      screechOsc.connect(screechGain);
      screechGain.connect(ctx.destination);
      screechOsc.start();
      
      tireScreechNodeRef.current = screechOsc;
      tireScreechGainNodeRef.current = screechGain;
    } catch (e) {
      console.warn("Failed to host web audio context", e);
    }
  };

  // Close Synth when exited
  const cleanupSynth = () => {
    try {
      if (engineOscillatorRef.current) engineOscillatorRef.current.stop();
      if (screamerOscillatorRef.current) screamerOscillatorRef.current.stop();
      if (tireScreechNodeRef.current) tireScreechNodeRef.current.stop();
      if (audioContextRef.current) audioContextRef.current.close();
    } catch (e) {}
  };

  // Synthesize harsh grinding impact collision crash sound purely from Web Audio context
  const playClashSynthAudio = () => {
    if (!audioContextRef.current || isMuted) return;
    const ctx = audioContextRef.current;
    try {
      const crashOsc = ctx.createOscillator();
      crashOsc.type = "sawtooth";
      crashOsc.frequency.setValueAtTime(140, ctx.currentTime);
      crashOsc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.35);

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(260, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.35);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.32, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      crashOsc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      crashOsc.start();
      crashOsc.stop(ctx.currentTime + 0.38);
    } catch (err) {
      console.warn("Impact audio synth error:", err);
    }
  };

  // Dynamically emit interactive collision spark particles in our running Three.js engine
  const spawn3DClashSparks = (targetZ: number, targetLane: number) => {
    const scene = threeSceneRef.current;
    const points = threePointsRef.current;
    if (!scene || !points) return;

    try {
      const count = 35;
      const geom = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const velocities: { x: number; y: number; z: number }[] = [];

      const segments = segmentsRef.current;
      const pIdx = Math.floor(targetZ / segmentLength) % segments.length;
      const pRatio = (targetZ % segmentLength) / segmentLength;
      const pCurrent = points[pIdx];
      const pNext = points[(pIdx + 1) % segments.length];
      if (!pCurrent || !pNext) return;

      const forwardDir = new THREE.Vector3().subVectors(pNext, pCurrent).normalize();
      const rightDir = new THREE.Vector3().crossVectors(forwardDir, new THREE.Vector3(0, 1, 0)).normalize();
      const basePos = new THREE.Vector3().lerpVectors(pCurrent, pNext, pRatio);
      basePos.addScaledVector(rightDir, targetLane * roadWidth * 1.05);
      basePos.y += 25; // Rise slightly above surface level

      for (let i = 0; i < count; i++) {
        positions[i * 3] = basePos.x;
        positions[i * 3 + 1] = basePos.y;
        positions[i * 3 + 2] = basePos.z;

        // Spread spark velocity sprays outwards
        const vx = (Math.random() - 0.5) * 620 - (rightDir.x * 200);
        const vy = Math.random() * 520 + 220; 
        const vz = (Math.random() - 0.5) * 620 - (forwardDir.z * 400); 
        velocities.push({ x: vx, y: vy, z: vz });
      }

      geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      
      const mat = new THREE.PointsMaterial({
        color: "#f97316", // Bright radiant orange
        size: 320,
        transparent: true,
        opacity: 0.95,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const sparkPoints = new THREE.Points(geom, mat);
      scene.add(sparkPoints);

      threeSparkGroupsRef.current.push({
        pointsMesh: sparkPoints,
        velocities,
        age: 0,
        maxAge: 40
      });
    } catch (err) {
      console.warn("Failed to spawn sparks:", err);
    }
  };

  // Call Team Crew Chief server endpoint to generate personalized live commentary
  const requestCrewChiefRadio = async (eventType: string) => {
    // Avoid double-firing frequently (min 15 seconds cool down unless crash or victory)
    const now = Date.now();
    const coolDown = eventType === "won race" || eventType === "crashed" ? 5000 : 15000;
    if (now - lastRadioTriggerTimeRef.current < coolDown) return;
    lastRadioTriggerTimeRef.current = now;

    setRadioActive(true);

    try {
      // Collect parameters of current simulation telemetry
      const payload = {
        trackName: currentTrack.name,
        carName: currentCar.brand + " " + currentCar.name,
        speed: Math.round(speedRef.current),
        sector: currentSector,
        lap: lapCountRef.current,
        trackPosition: `${racePosition} / 6`,
        eventType,
        lapTimes: lapTimesRef.current,
        upgrades: currentCar.upgrades
      };

      const res = await fetch("/api/race-engineer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      setEngineerCommentary(data.feedback);
      setEngineerAdvice(data.advice);
      
      // Keep static active light flashing for 5 seconds to simulate radio comms
      setTimeout(() => setRadioActive(false), 5500);
    } catch (e) {
      console.error(e);
      setRadioActive(false);
    }
  };

  // Pre-trigger countdown timers and race startup
  useEffect(() => {
    if (!isPlaying) return;

    initSynth();

    // Start racing immediately with no countdown blocking
    setIsCountdown(false);
    setCountdownText("GO GO GO!");
    currentLapStartTimeRef.current = Date.now();
    currentSectorStartTimeRef.current = Date.now();

    // Warm up crew chief
    requestCrewChiefRadio("setup advice");

    const timer = setTimeout(() => {
      setCountdownText("");
    }, 1500);

    return () => {
      clearTimeout(timer);
      cleanupSynth();
    };
  }, [isPlaying]);

  // Main high-performance simulation and rendering game loop
  useEffect(() => {
    if (!isPlaying || isCountdown) return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(0.1, (time - lastTime) / 1000); // delta time capped to bypass slow frames
      lastTime = time;

      // 1. UPDATE PHYSICS & KEY INPUTS
      const speed = speedRef.current;
      const baseStats = currentCar.currentSpecs;
      const topSpeedCap = baseStats.topSpeed; 
      
      // Determine controllers active
      const throttle = KEYS.UP.some(k => keysPressedRef.current[k]);
      const brake = KEYS.DOWN.some(k => keysPressedRef.current[k]);
      const steeringLeft = KEYS.LEFT.some(k => keysPressedRef.current[k]);
      const steeringRight = KEYS.RIGHT.some(k => keysPressedRef.current[k]);
      const offroad = Math.abs(playerXRef.current) > 1.05;

      // High Performance Friction & Acceleration coefficient curves
      let accelPower = 0;
      if (throttle) {
        // Base Acceleration 0-100 time in seconds maps to power multiplier
        // More upgrades (represented inside baseStats.acceleration) increases acceleration power
        const accelerationFactor = 5.5 / baseStats.acceleration; 
        accelPower = 110 * accelerationFactor; 
      }

      let deceleration = 18; // passive air resistance friction
      if (brake) {
        // Upgraded brakes reduce stopping distance (baseStats.braking maps values like 22.0 to braking force)
        const brakeFactor = 35 / baseStats.braking;
        deceleration = 320 * brakeFactor;
      }

      if (offroad) {
        deceleration += 90; // severe gravel trapping penalty
        if (speedRef.current > 40 && Math.random() < 0.03) {
          requestCrewChiefRadio("running wide");
        }
      }

      // Compute Speed updates
      let newSpeed = speed + (accelPower - deceleration) * dt;
      if (newSpeed < 0) newSpeed = 0;
      if (newSpeed > topSpeedCap) newSpeed = topSpeedCap;
      speedRef.current = newSpeed;

      if (newSpeed > speedRecord) {
        setSpeedRecord(Math.round(newSpeed));
      }

      // Compute Horizontal Steering & Lateral Gs
      // Lateral grip determines peak steering maneuverability before slipping takes over
      const gripFactor = baseStats.grip / 1.7;
      const steeringForce = 2.4 * gripFactor * (newSpeed > 30 ? Math.max(0.3, 150 / newSpeed) : (newSpeed / 30));
      
      if (steeringLeft) playerXRef.current -= steeringForce * dt;
      if (steeringRight) playerXRef.current += steeringForce * dt;

      // Check current segment to enforce steering centrifugal forces
      const playerSegmentIndex = Math.floor(trackPositionRef.current / segmentLength) % segmentsRef.current.length;
      const activeSegment = segmentsRef.current[playerSegmentIndex];
      
      // Add centrifugal lateral drag pushing the car to the opposite wall of track curve
      if (newSpeed > 0 && activeSegment) {
        const lateralPull = (newSpeed / topSpeedCap) * activeSegment.curve * centrifugalForce;
        playerXRef.current -= lateralPull * dt;
      }

      // Enforce physical barriers on track edges to prevent floating indefinitely
      if (playerXRef.current < -2.2) playerXRef.current = -2.2;
      if (playerXRef.current > 2.2) playerXRef.current = 2.2;

      // Drive longitudinal coordinates forward
      trackPositionRef.current += (newSpeed / 3.6) * 100 * dt; // Convert speed in km/h to meters per second

      // Real Racing 3: Synthesized realistic RPM & Engine pitch controls
      let gear = gearRef.current;
      if (transmissionMode === "Auto") {
        // Seamless automatic shift gear ratios
        if (newSpeed < 65) gear = 1;
        else if (newSpeed < 120) gear = 2;
        else if (newSpeed < 185) gear = 3;
        else if (newSpeed < 250) gear = 4;
        else if (newSpeed < 310) gear = 5;
        else if (newSpeed < 370) gear = 6;
        else gear = 7;
        gearRef.current = gear;
      }

      // Map RPM curves based on how close speed is to upper bound of gear ratio
      const gearMinSpeed = gear === 1 ? 0 : [0, 60, 115, 180, 245, 305, 365][gear - 1];
      const gearMaxSpeed = [0, 75, 130, 195, 260, 320, 380, 550][gear];
      const speedSpan = gearMaxSpeed - gearMinSpeed;
      const speedFraction = (newSpeed - gearMinSpeed) / speedSpan;
      
      let rpm = 1200 + speedFraction * 7800;
      if (throttle) rpm += Math.random() * 200; // raw micro-vibration under acceleration
      if (rpm > 9000) rpm = 9000;
      if (rpm < 1100) rpm = 1100;
      rmpRef.current = Math.round(rpm);

      // Synthesize Live Oscillators
      if (audioContextRef.current && engineOscillatorRef.current && !isMuted) {
        // Core hum frequency strictly mapped to RPM (realistic muscular whine)
        const baseFrequency = (rpm / 9000) * 190 + 35;
        engineOscillatorRef.current.frequency.setValueAtTime(baseFrequency, audioContextRef.current.currentTime);
        
        // Secondary high-pitched screaming harmonic that multiplies with peak RPM intensity
        const screamerFrequency = baseFrequency * 2.85;
        if (screamerOscillatorRef.current) {
          screamerOscillatorRef.current.frequency.setValueAtTime(screamerFrequency, audioContextRef.current.currentTime);
        }

        // Boost volumes subtly under acceleration and screaming redline thresholds
        if (engineGainNodeRef.current) {
          engineGainNodeRef.current.gain.setValueAtTime(throttle ? 0.14 : 0.07, audioContextRef.current.currentTime);
        }
        if (screamerGainNodeRef.current) {
          // Volumetric projection of high-pitched exhaust notes peaks at redline!
          const screamerVol = (throttle ? 0.11 : 0.03) * (rpm / 9000);
          screamerGainNodeRef.current.gain.setValueAtTime(screamerVol, audioContextRef.current.currentTime);
        }
      }

      // Corner screech simulator when tires slide sliding
      const isScreeching = (steeringLeft || steeringRight) && newSpeed > 100 && (Math.abs(playerXRef.current) > 0.85 || Math.random() < 0.2);
      if (tireScreechGainNodeRef.current && !isMuted) {
        tireScreechGainNodeRef.current.gain.setValueAtTime(isScreeching ? 0.06 : 0, audioContextRef.current.currentTime);
      }

      // Track boundaries checks (Wall Crashing)
      const hitWallsLeft = playerXRef.current < -1.75;
      const hitWallsRight = playerXRef.current > 1.75;
      
      if ((hitWallsLeft || hitWallsRight) && newSpeed > 120) {
        // Dramatic speed retardation and shake
        speedRef.current = Math.max(30, newSpeed - 120);
        playerXRef.current = hitWallsLeft ? -1.6 : 1.6;
        requestCrewChiefRadio("crashed");
      }

      // 2. SECTORS AND LAP TRIGGERS
      const progressRatio = trackPositionRef.current / totalTrackLengthZ;
      const currentLapIndex = Math.floor(progressRatio) + 1;
      
      if (currentLapIndex !== lapCountRef.current) {
        // Crossed key start/finish line!
        const lapDoneTime = (Date.now() - currentLapStartTimeRef.current) / 1000;
        lapTimesRef.current.push(lapDoneTime);
        completedLapsRef.current += 1;
        
        currentLapStartTimeRef.current = Date.now();
        currentSectorStartTimeRef.current = Date.now();
        lapCountRef.current = Math.min(totalLaps, currentLapIndex);

        if (completedLapsRef.current >= totalLaps) {
          // Finished cup duel!
          setIsPlaying(false);
          cleanupSynth();
          requestCrewChiefRadio("won race");

          // Determine final place
          const earnedCoins = Math.max(15000, 100000 - (racePosition - 1) * 15000);
          onRaceFinished({
            position: racePosition,
            lapTimes: lapTimesRef.current,
            prizeEarned: earnedCoins,
            speedRecord: Math.round(speedRecord)
          });
          return;
        } else {
          requestCrewChiefRadio("perfect apex cornering");
        }
      }

      // Split intermediate racetrack sectors
      const relativeProgress = progressRatio % 1.0;
      let sector: 1 | 2 | 3 = 1;
      if (relativeProgress > 0.66) sector = 3;
      else if (relativeProgress > 0.33) sector = 2;

      if (sector !== currentSector) {
        const sectorValue = (Date.now() - currentSectorStartTimeRef.current) / 1000;
        if (currentSector === 1) setSectorTimes(prev => ({ ...prev, sector1: sectorValue }));
        else if (currentSector === 2) setSectorTimes(prev => ({ ...prev, sector2: sectorValue }));
        else setSectorTimes(prev => ({ ...prev, sector3: sectorValue }));
        
        setCurrentSector(sector);
        currentSectorStartTimeRef.current = Date.now();
      }

      // 3. AI DRIVERS POSITION PROCESSING
      const aiDrivers = aiDriversRef.current;
      aiDrivers.forEach(ai => {
        if (ai.finished) return;

        // Base speed matching track difficulty curve complexity
        let curveFactor = activeSegment ? Math.abs(activeSegment.curve) : 0;
        let aiMaxSpeed = (1 - curveFactor * 0.12) * currentCar.maxSpecs.topSpeed * ai.difficulty * 0.82;
        
        // accelerate towards limits
        ai.speed += (aiMaxSpeed - ai.speed) * 0.15 * dt * 50;
        ai.position += (ai.speed / 3.6) * 100 * dt;
        
        // AI steering racing line shift of lanes on curves
        if (activeSegment) {
          ai.lane = -activeSegment.curve * 0.4; // lean to inside of curve
        }

        // Loop laps or check if AI finished
        if (ai.position > totalTrackLengthZ && !ai.finished) {
          ai.lap += 1;
          if (ai.lap > totalLaps) {
            ai.finished = true;
          }
        }
      });

      // 3b. CAR-ON-CAR CLASH DYNAMICS SIMULATOR
      if (isPlaying && !isCountdown) {
        const pProgress = trackPositionRef.current;
        aiDrivers.forEach((ai) => {
          if (ai.finished) return;
          
          const dPos = pProgress - ai.position;
          const dLane = playerXRef.current - ai.lane;
          
          // Collision bounded container box: Z impact depth < 160 units, horizontal width < 0.38 units
          if (Math.abs(dPos) < 160 && Math.abs(dLane) < 0.38) {
            const now = Date.now();
            // cooldown to limit collision physics stuttering
            if (now - lastClashTimeRef.current > 180) {
              lastClashTimeRef.current = now;
              
              const laneOverlap = 0.38 - Math.abs(dLane);
              const pushSign = Math.sign(dLane) || (Math.random() < 0.5 ? -1 : 1);
              
              // Elastic rebound pushing vehicles laterally away
              playerXRef.current += pushSign * laneOverlap * 0.72;
              ai.lane -= pushSign * laneOverlap * 0.72;
              
              // Ensure physical track lanes constraints
              playerXRef.current = Math.max(-2.2, Math.min(2.2, playerXRef.current));
              ai.lane = Math.max(-1.8, Math.min(1.8, ai.lane));
              
              // Kinetic momentum deceleration drop
              const preSpeed = speedRef.current;
              const collisionPenalty = Math.max(12, Math.min(55, preSpeed * 0.16));
              speedRef.current = Math.max(20, preSpeed - collisionPenalty);
              
              // Transfer speed to the rammed vehicle
              ai.speed = Math.max(45, ai.speed + (dPos < 0 ? 15 : -10));
              
              // Play immersive grinding impact crunch sound
              playClashSynthAudio();
              
              // Spawn orange sparkling fire sparks right onto the tarmac
              spawn3DClashSparks(ai.position, ai.lane);
              
              // HUD notification & screen shake triggers
              setActiveClashInfo({
                opponentName: ai.name,
                severity: Math.round(collisionPenalty),
                time: now
              });
              setScreenShakeAmount(15);
              
              // Trigger pit wall audio telemetry criticism
              requestCrewChiefRadio("crashed");
            }
          }
        });
      }

      // Decay screen shake intensity slowly over frames
      setScreenShakeAmount((prev) => Math.max(0, prev - dt * 24));

      // Fade out clash feedback info after 1.2s has elapsed
      if (activeClashInfo && Date.now() - activeClashInfo.time > 1200) {
        setActiveClashInfo(null);
      }

      // Recalculate race ladder leaderboard sequence
      const playerProgress = trackPositionRef.current;
      const liveLadder = aiDrivers.map(ai => ({
        name: ai.name,
        carName: ai.carName,
        progress: ai.position,
        distanceLeft: Math.max(0, totalTrackLengthZ - ai.position),
        finished: ai.finished
      }));

      // Add player to the list
      liveLadder.push({
        name: "YOU",
        carName: currentCar.name,
        progress: playerProgress,
        distanceLeft: Math.max(0, totalTrackLengthZ - playerProgress),
        finished: false
      });

      // Sort by progress desc
      liveLadder.sort((a, b) => b.progress - a.progress);
      setLiveLeaderboard(liveLadder);

      const computedPos = liveLadder.findIndex(x => x.name === "YOU") + 1;
      setRacePosition(computedPos);

      // 4. CHASE SCENIC 3D CAMERA PIPELINE WITH THREE.JS
      const points = threePointsRef.current;
      const renderer = threeRendererRef.current;
      const scene = threeSceneRef.current;
      const camera = threeCameraRef.current;
      const playerCar = threePlayerCarRef.current;
      
      if (points && renderer && scene && camera && playerCar) {
        const segments = segmentsRef.current;
        
        // 4a. Update Player Car 3D position
        const pIdx = Math.floor(trackPositionRef.current / segmentLength) % segments.length;
        const pRatio = (trackPositionRef.current % segmentLength) / segmentLength;
        const pCurrent = points[pIdx];
        const pNext = points[(pIdx + 1) % segments.length];
        if (pCurrent && pNext) {
          const forwardDir = new THREE.Vector3().subVectors(pNext, pCurrent).normalize();
          const rightDir = new THREE.Vector3().crossVectors(forwardDir, new THREE.Vector3(0, 1, 0)).normalize();
          
          const player3DPos = new THREE.Vector3().lerpVectors(pCurrent, pNext, pRatio);
          const carLateralOffset = playerXRef.current * roadWidth * 1.05;
          player3DPos.addScaledVector(rightDir, carLateralOffset);
          
          playerCar.position.copy(player3DPos);
          playerCar.lookAt(new THREE.Vector3().addVectors(player3DPos, forwardDir));
          
          // Steering lean/roll visual effect
          let steerRotation = 0;
          if (steeringLeft) steerRotation = 0.045;
          if (steeringRight) steerRotation = -0.045;
          playerCar.rotation.z = steerRotation;

          // Update sun light position relative to tracking player coordinates for crisp soft shadow projection
          const sunLight = threeSunLightRef.current;
          if (sunLight) {
            sunLight.position.set(player3DPos.x + 2000, player3DPos.y + 4500, player3DPos.z + 1000);
            sunLight.target = playerCar;
          }

          // Spin player wheels based on speed, and smoothly turn front wheels!
          const playerWheels = threePlayerWheelsRef.current;
          if (playerWheels && playerWheels.length > 0) {
            const spinDelta = speedRef.current * 0.0018;
            playerWheels.forEach((wGroup) => {
              const spinGroup = wGroup.getObjectByName("spin");
              if (spinGroup) {
                spinGroup.rotateX(spinDelta);
              }
              
              // Front wheels steer beautifully depending on keys pressed!
              if (wGroup.name === "fl" || wGroup.name === "fr") {
                let targetSteerY = 0;
                if (steeringLeft) targetSteerY = 0.35;
                else if (steeringRight) targetSteerY = -0.35;
                wGroup.rotation.y += (targetSteerY - wGroup.rotation.y) * 0.22;
              }
            });
          }
          
          // LED brake lamps glow toggle
          if (threeBrakeRefs.current.length > 0) {
            const glowColor = brake ? "#ff1111" : "#770000";
            threeBrakeRefs.current.forEach(mesh => {
              if (mesh && mesh.material) {
                (mesh.material as THREE.MeshBasicMaterial).color.set(glowColor);
              }
            });
          }
          
          // 4b. Update 4 AI opponent car positions & wheels spin
          aiDriversRef.current.forEach((ai, idx) => {
            const aiCGroup = threeAICarsRef.current[idx];
            if (aiCGroup) {
              const aiIdx = Math.floor(ai.position / segmentLength) % segments.length;
              const aiRatio = (ai.position % segmentLength) / segmentLength;
              const aiCurrent = points[aiIdx];
              const aiNext = points[(aiIdx + 1) % segments.length];
              if (aiCurrent && aiNext) {
                const aiForward = new THREE.Vector3().subVectors(aiNext, aiCurrent).normalize();
                const aiRight = new THREE.Vector3().crossVectors(aiForward, new THREE.Vector3(0, 1, 0)).normalize();
                
                const ai3DPos = new THREE.Vector3().lerpVectors(aiCurrent, aiNext, aiRatio);
                const aiLateralOffset = ai.lane * roadWidth * 1.05;
                ai3DPos.addScaledVector(aiRight, aiLateralOffset);
                
                aiCGroup.position.copy(ai3DPos);
                aiCGroup.lookAt(new THREE.Vector3().addVectors(ai3DPos, aiForward));

                // AI opponent wheels spin & realistic dynamic turning steering angles!
                const aiWheelsList = threeAIWheelsRef.current;
                const aiWheels = aiWheelsList ? aiWheelsList[idx] : null;
                if (aiWheels && aiWheels.length > 0) {
                  const aiSpinDelta = ai.speed * 0.0018;
                  const aiSeg = segments[aiIdx];
                  const aiCurveSteer = aiSeg ? -aiSeg.curve * 0.12 : 0; // steer direction of road curves
                  
                  aiWheels.forEach((wGroup) => {
                    const spinGroup = wGroup.getObjectByName("spin");
                    if (spinGroup) {
                      spinGroup.rotateX(aiSpinDelta);
                    }
                    
                    // Steer AI front wheels along road curvatures
                    if (wGroup.name === "fl" || wGroup.name === "fr") {
                      wGroup.rotation.y += (aiCurveSteer - wGroup.rotation.y) * 0.18;
                    }
                  });
                }
              }
            }
          });
          
          // 4c. Interactive chase / cabin / bumper camera rigger positions
          if (cameraView === "chase") {
            const cameraOffset = new THREE.Vector3()
              .copy(forwardDir)
              .multiplyScalar(-580)
              .add(new THREE.Vector3(0, 230, 0));
            const targetCamPos = new THREE.Vector3().addVectors(player3DPos, cameraOffset);
            camera.position.lerp(targetCamPos, 0.45);
            camera.lookAt(new THREE.Vector3().addVectors(player3DPos, forwardDir.clone().multiplyScalar(1500)));
          } else if (cameraView === "cockpit") {
            const cameraOffset = new THREE.Vector3()
              .copy(forwardDir)
              .multiplyScalar(12)
              .add(new THREE.Vector3(0, 95, 0));
            const targetCamPos = new THREE.Vector3().addVectors(player3DPos, cameraOffset);
            camera.position.copy(targetCamPos);
            camera.lookAt(new THREE.Vector3().addVectors(player3DPos, forwardDir.clone().multiplyScalar(1500)).add(new THREE.Vector3(0, -50, 0)));
          } else {
            // Hood POV Look straight down the track
            const cameraOffset = new THREE.Vector3()
              .copy(forwardDir)
              .multiplyScalar(170)
              .add(new THREE.Vector3(0, 58, 0));
            const targetCamPos = new THREE.Vector3().addVectors(player3DPos, cameraOffset);
            camera.position.copy(targetCamPos);
            camera.lookAt(new THREE.Vector3().addVectors(player3DPos, forwardDir.clone().multiplyScalar(1500)));
          }
          
          // Align 3D sky group cleanly with moving camera coordinate for infinite parallax sky mapping!
          const skyGroup = threeSkyGroupRef.current;
          if (skyGroup) {
            skyGroup.position.copy(camera.position);
          }

          // Update active 3D car clash spark groups!
          const activeSparks = threeSparkGroupsRef.current;
          for (let sIdx = activeSparks.length - 1; sIdx >= 0; sIdx--) {
            const spark = activeSparks[sIdx];
            spark.age += 1;
            
            if (spark.age >= spark.maxAge) {
              scene.remove(spark.pointsMesh);
              spark.pointsMesh.geometry.dispose();
              if (Array.isArray(spark.pointsMesh.material)) {
                spark.pointsMesh.material.forEach((m: any) => m.dispose());
              } else {
                spark.pointsMesh.material.dispose();
              }
              activeSparks.splice(sIdx, 1);
            } else {
              const geom = spark.pointsMesh.geometry;
              const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
              const velocities = spark.velocities;
              
              if (posAttr && velocities) {
                const array = posAttr.array as Float32Array;
                for (let i = 0; i < velocities.length; i++) {
                  const vel = velocities[i];
                  vel.y -= 14; // apply gravity subtly
                  
                  array[i * 3] += vel.x * dt;
                  array[i * 3 + 1] += vel.y * dt;
                  array[i * 3 + 2] += vel.z * dt;
                  
                  if (array[i * 3 + 1] < 2) {
                    array[i * 3 + 1] = 2;
                    vel.y = -vel.y * 0.4;
                  }
                }
                posAttr.needsUpdate = true;
              }
              
              const mat = spark.pointsMesh.material as THREE.PointsMaterial;
              if (mat) {
                mat.opacity = 0.95 * (1 - spark.age / spark.maxAge);
                if (spark.age / spark.maxAge > 0.4) {
                  mat.color.set(new THREE.Color("#ef4444"));
                } else if (spark.age / spark.maxAge > 0.15) {
                  mat.color.set(new THREE.Color("#eab308"));
                }
              }
            }
          }
          
          // Render the high fidelity 3D viewport
          renderer.render(scene, camera);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isCountdown, cameraView, currentCar, currentTrack, transmissionMode, speedRecord, isMuted, currentSector]);

  return (
    <div className="relative w-full h-screen bg-[#070b10] text-white select-none overflow-hidden">
      
      {/* Simulation Master Header Panel (Floating Dynamic Island HUD) */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-[calc(100%-48px)] lg:w-[calc(100%-720px)] max-w-xl z-25 flex items-center justify-between px-5 py-2.5 bg-[#070a0f]/85 backdrop-blur-md rounded-xl border border-slate-800/80 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-600/10 text-red-500 border border-red-500/20 shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold tracking-tight text-white uppercase truncate">{currentTrack.name}</h1>
            <p className="text-[10px] font-mono text-slate-400 truncate">{currentTrack.location} • {currentTrack.corners} Corners</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setTransmissionMode(m => m === "Auto" ? "Manual" : "Auto")}
            className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold border transition bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-200 cursor-pointer"
          >
            GBX: <span className="text-red-500">{transmissionMode === "Auto" ? "AT" : "MT"}</span>
          </button>

          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300 transition cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-500" />}
          </button>

          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase border border-red-500/30 text-red-400 bg-red-950/10 hover:bg-red-500 hover:text-white transition cursor-pointer shrink-0"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Main Track, Leaderboard and Telemetry Layout split */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        
        {/* Left Hand: Sector Times, Competitors list (Floating Overlay) */}
        <div className="absolute left-6 top-6 bottom-6 w-80 z-10 bg-[#070a0f]/85 backdrop-blur-md border border-slate-800/80 p-5 rounded-xl flex flex-col gap-5 overflow-y-auto hidden lg:flex pointer-events-auto shadow-2xl">
          
          {/* Race Leaderboard */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2">
              <Compass className="w-4 h-4 text-red-500" /> TRACK GAP & POSITION
            </h2>
            <div className="flex flex-col gap-1.5">
              {liveLeaderboard.map((pos, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center justify-between p-2.5 rounded border transition-all ${
                    pos.name === "YOU" 
                    ? "bg-red-600/10 border-red-500/40 text-white shadow-md shadow-red-950/10" 
                    : "bg-slate-900/60 border-slate-800/80 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-mono font-bold text-xs bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                      P{idx + 1}
                    </span>
                    <span className="font-semibold">{pos.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono font-medium">{pos.carName}</p>
                    <p className="text-[10px] font-mono text-slate-400">
                      {pos.finished ? "FINISHED" : `+${Math.round(pos.distanceLeft)}m`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sector Times Split Panel */}
          <div className="bg-slate-900/50 rounded-xl border border-slate-800/80 p-4 mt-auto">
            <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> TIMING CHAINS (LAP {lapCountRef.current}/{totalLaps})
            </h3>
            <div className="flex flex-col gap-2 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">SECTOR 1</span>
                <span className={sectorTimes.sector1 ? "text-emerald-400 font-bold" : "text-slate-500"}>
                  {sectorTimes.sector1 ? `${sectorTimes.sector1.toFixed(3)}s` : "--.---"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">SECTOR 2</span>
                <span className={sectorTimes.sector2 ? "text-emerald-400 font-bold" : "text-slate-500"}>
                  {sectorTimes.sector2 ? `${sectorTimes.sector2.toFixed(3)}s` : "--.---"}
                </span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-400">SECTOR 3</span>
                <span className={sectorTimes.sector3 ? "text-emerald-400 font-bold" : "text-slate-500"}>
                  {sectorTimes.sector3 ? `${sectorTimes.sector3.toFixed(3)}s` : "--.---"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 1. 3D Canvas Viewport - Truly Fullscreen Background */}
        <div className="absolute inset-0 w-full h-full bg-slate-950 group z-0" ref={containerRef}>
            {!isPlaying ? (
              // Landing lobby overlay to ignite engine
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/90 carbon-grid p-6 text-center">
                <div className="p-4 rounded-xl bg-red-600/10 text-red-500 border border-red-500/20 mb-4 animate-pulse">
                  <span className="text-4xl">🏎️</span>
                </div>
                <h3 className="text-2xl font-bold tracking-wide text-white uppercase mb-2">GRID POSITION SET • P6</h3>
                <p className="max-w-md text-sm text-slate-400 mb-6 font-mono leading-relaxed">
                  Real-world licensed track <span className="text-slate-200">{currentTrack.name}</span> is ready for competition. Your custom <span className="text-slate-200 font-bold">{currentCar.brand || "GT"} {currentCar.name}</span> hypercar telemetry is pre-loaded on the circuit telemetry board.
                </p>
                <button
                  id="btn-race-ignition"
                  onClick={() => setIsPlaying(true)}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold tracking-widest text-sm uppercase hover:from-red-500 hover:to-red-400 cursor-pointer shadow-red-950/20 transition-all font-sans"
                >
                  IGNITE POWERPLANT (START)
                </button>
              </div>
            ) : null}

            {/* Canvas Target Element */}
            <canvas
              ref={canvasRef}
              width={750}
              height={500}
              className="w-full h-full object-cover block"
              style={{
                transform: screenShakeAmount > 0 
                  ? `translate(${(Math.random() - 0.5) * screenShakeAmount}px, ${(Math.random() - 0.5) * screenShakeAmount}px)`
                  : 'none'
              }}
            />

            {/* Dynamic Clash Warning Tag */}
            {activeClashInfo && (
              <div id="clash-hud-banner" className="absolute top-[28%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1.5 animate-bounce">
                <div className="px-5 py-2 rounded-lg bg-red-600/90 border border-red-500 text-white font-black text-sm tracking-widest uppercase shadow-lg shadow-red-950/40 flex items-center gap-2">
                  <span className="animate-ping w-2 h-2 rounded-full bg-yellow-300" />
                  ⚠️ CONTACT ! CLASHED WITH {activeClashInfo.opponentName}
                </div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-yellow-400 bg-black/80 px-2 py-0.5 rounded">
                  IMPEDING COLLISION PENALTY: -{activeClashInfo.severity} KM/H
                </span>
              </div>
            )}

            {/* Dynamic Countdown Text Indicator */}
            {isPlaying && isCountdown && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 z-10 transition-all">
                <div className="p-8 rounded-full border-4 border-red-500/30 text-white text-center flex flex-col gap-2">
                  <h1 className="text-5xl font-extrabold tracking-widest text-red-500 animate-pulse glow-red font-sans">
                    {countdownText}
                  </h1>
                  <span className="text-xs font-mono tracking-widest text-slate-300">ENGINES SPINNING</span>
                </div>
              </div>
            )}

            {/* Crew Chief Radio Alerts Overlay */}
            {isPlaying && (
              <div className="absolute top-24 left-4 right-4 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:w-[calc(100%-720px)] max-w-xl bg-slate-950/85 border border-slate-800/80 backdrop-blur-md rounded-xl p-3.5 shadow-xl flex items-start gap-3 z-10">
                <div className={`p-2 rounded-lg ${radioActive ? "bg-red-500/20 text-red-500 animate-pulse border border-red-400/30" : "bg-slate-800/50 text-slate-400"} transition`}>
                  <Radio className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-mono tracking-widest font-bold uppercase text-red-500">
                      {radioActive ? "CREW CHIEF radio • LIVE TRANSMITTING" : "CREW CHIEF radio • PIT WALL LOG"}
                    </span>
                    {radioActive && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />}
                  </div>
                  <p className="text-xs font-mono font-medium text-slate-200 leading-normal">
                    {engineerCommentary}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase">
                    STRATEGY: <span className="text-slate-300">{engineerAdvice}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Viewport Camera Changer Overlay */}
            {isPlaying && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10 opacity-75 hover:opacity-100 transition duration-150">
                <button
                  onClick={() => setCameraView("chase")}
                  className={`p-2 rounded-lg border text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                    cameraView === "chase" ? "bg-red-600 border-red-500 text-white" : "bg-slate-950/90 border-slate-800 text-slate-300"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> CHASE VIEW
                </button>
                <button
                  onClick={() => setCameraView("cockpit")}
                  className={`p-2 rounded-lg border text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                    cameraView === "cockpit" ? "bg-red-600 border-red-500 text-white" : "bg-slate-950/90 border-slate-800 text-slate-300"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> COCKPIT
                </button>
                <button
                  onClick={() => setCameraView("hood")}
                  className={`p-2 rounded-lg border text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                    cameraView === "hood" ? "bg-red-600 border-red-500 text-white" : "bg-slate-950/90 border-slate-800 text-slate-300"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> HOOD VIEW
                </button>
              </div>
            )}
          </div>

        {/* Right Hand Side: Digital Dashboard Instrument console (Floating Overlay) */}
        <div className="absolute right-6 top-6 bottom-6 w-80 z-10 bg-[#070a0f]/85 backdrop-blur-md border border-slate-800/80 p-5 rounded-xl flex flex-col justify-between hidden lg:flex pointer-events-auto shadow-2xl">
          
          {/* Driver guide instructions */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3 flex items-center gap-1.5">
              🎮 DRIVER TELEMETRY GUIDELINES
            </h3>
            <div className="flex flex-col gap-2.5 text-xs text-slate-400 leading-relaxed font-mono">
              <p><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white border border-slate-700">W</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white border border-slate-700">↑</kbd> is throttle accelerator.</p>
              <p><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white border border-slate-700">S</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white border border-slate-700">↓</kbd> is brake decelerator.</p>
              <p><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white border border-slate-700">A</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white border border-slate-700">D</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white border border-slate-700">←</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white border border-slate-700">→</kbd> turns.</p>
              <p><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white border border-slate-700">C</kbd> toggles cameras view.</p>
              
              {transmissionMode === "Manual" && (
                <div className="pt-2 border-t border-slate-800 mt-1 text-slate-300">
                  <p className="font-bold text-red-400 mb-1 flex items-center gap-1">⚠️ MANUAL GEARBOX ACTIVE</p>
                  <p><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white border border-slate-700">Shift</kbd> to change Gear UP.</p>
                  <p><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white border border-slate-700">Ctrl</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white border border-slate-700">X</kbd> to change Gear DOWN.</p>
                </div>
              )}
            </div>
          </div>

          {/* Core Telemetry Gauge Box */}
          <div className="flex flex-col gap-4 mt-auto">
            <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
              ⚡ LIVE F1 INSTRUMENTS
            </h2>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-4 text-center">
              {/* Massive digital velocity meter */}
              <div className="flex flex-col">
                <span className="text-4xl font-extrabold font-mono text-red-500 glow-red">
                  {isPlaying ? Math.round(speedRef.current) : 0}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mt-0.5">VELOCITY KM/H</span>
              </div>

              {/* Dynamic RPM gauge */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[11px] font-mono text-slate-400 font-semibold px-1">
                  <span>RPM GAUGE</span>
                  <span className={rmpRef.current > 7800 ? "text-red-500 font-bold" : "text-slate-300"}>
                    {isPlaying ? rmpRef.current : 0}
                  </span>
                </div>
                {/* Visual bar gradient */}
                <div className="h-4 w-full bg-slate-850 rounded border border-slate-800 overflow-hidden flex">
                  {Array.from({ length: 40 }).map((_, idx) => {
                    const activeRatio = (isPlaying ? rmpRef.current : 0) / 9000;
                    const segmentRatio = idx / 40;
                    const isActive = segmentRatio <= activeRatio;
                    return (
                      <div
                        key={idx}
                        className={`h-full flex-1 border-r border-slate-900/40 transition-all ${
                          isActive
                            ? idx < 20
                              ? "bg-emerald-500"
                              : idx < 32
                              ? "bg-yellow-500"
                              : "bg-red-500 animate-pulse"
                            : "bg-slate-800/40"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Grid with Gear ratio and Lateral Gs */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">ACTIVE GEAR</p>
                  <p className="text-2xl font-bold font-mono text-slate-100 glow-blue">
                    {isPlaying ? gearRef.current : 1}
                  </p>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">LATERAL G-FORCE</p>
                  <p className="text-base font-bold font-mono text-slate-100 mt-1">
                    {isPlaying ? (1.0 + (speedRef.current / currentCar.currentSpecs.topSpeed) * (currentCar.currentSpecs.grip - 1.0)).toFixed(2) : "0.00"} G
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
