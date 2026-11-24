import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Box,
  Camera,
  ChevronDown,
  ChevronUp,
  Compass,
  Layers,
  RotateCw,
  Shield,
  Sparkles,
  Sun,
} from 'lucide-react';
import Button from './Button';
import { Faction, Officer } from '../types';
import { SeasonId, SEASONS } from '../utils/seasons';

export type ViewerSubject = 'citadel' | 'sandtable' | 'siege';
export type CameraPreset = 'overview' | 'lowAngle' | 'closeup' | 'flank';
export type AtmosphereMood = 'season' | 'dawn' | 'noon' | 'dusk' | 'frost';

export interface Scene3DCityRef {
  id: string;
  name: string;
  pinyin: string;
  x: number;
  y: number;
  region: string;
  theater: string;
  description: string;
  tier?: 'city' | 'metropolis';
}

export interface Scene3DCityStat {
  prosperity: number;
  defense: number;
  grain: number;
  population?: number;
}

export interface Scene3DViewerProps {
  cities: Scene3DCityRef[];
  factions: Faction[];
  officers: Officer[];
  selectedCityId: string;
  onSelectCity?: (cityId: string) => void;
  onInspectCityDetail?: (cityId: string) => void;
  cityOwnership?: Record<string, string>;
  cityStats?: Record<string, Scene3DCityStat>;
  seasonId?: SeasonId;
  weatherId?: string;
  initialSubject?: ViewerSubject;
}

interface ExplodablePart {
  object: THREE.Object3D;
  basePos: THREE.Vector3;
  explodeOffset: THREE.Vector3;
}

interface CityMarkerMeta {
  city: Scene3DCityRef;
  group: THREE.Group;
  hitMesh: THREE.Mesh;
  factionName: string;
  factionColor: string;
  defense: number;
  population: number;
}

const ATMOSPHERE_PRESETS: Record<
  Exclude<AtmosphereMood, 'season'>,
  {
    label: string;
    bg: number;
    fog: number;
    fogDensity: number;
    keyColor: number;
    keyIntensity: number;
    keyPos: [number, number, number];
    hemiSky: number;
    hemiGround: number;
    hemiIntensity: number;
    exposure: number;
  }
> = {
  dawn: {
    label: '晨曦微光',
    bg: 0x162235,
    fog: 0x1a273d,
    fogDensity: 0.016,
    keyColor: 0xffcfa0,
    keyIntensity: 2.35,
    keyPos: [10, 8.5, 9],
    hemiSky: 0x8fb8ff,
    hemiGround: 0x3b2c25,
    hemiIntensity: 0.8,
    exposure: 1.12,
  },
  noon: {
    label: '烈日晴空',
    bg: 0x14263b,
    fog: 0x172b42,
    fogDensity: 0.011,
    keyColor: 0xfff3de,
    keyIntensity: 2.7,
    keyPos: [7, 14, 7],
    hemiSky: 0xb7dcff,
    hemiGround: 0x423a30,
    hemiIntensity: 0.9,
    exposure: 1.14,
  },
  dusk: {
    label: '暮秋烽火',
    bg: 0x1b1724,
    fog: 0x221a2a,
    fogDensity: 0.017,
    keyColor: 0xff9b54,
    keyIntensity: 2.5,
    keyPos: [-11, 6.5, 8],
    hemiSky: 0x7a88c4,
    hemiGround: 0x3f2419,
    hemiIntensity: 0.72,
    exposure: 1.1,
  },
  frost: {
    label: '凛冬霜夜',
    bg: 0x0d1524,
    fog: 0x111c2e,
    fogDensity: 0.019,
    keyColor: 0xd9ecff,
    keyIntensity: 2.15,
    keyPos: [8, 12, -9],
    hemiSky: 0x87b3e6,
    hemiGround: 0x222c3b,
    hemiIntensity: 0.85,
    exposure: 1.08,
  },
};

function resolveMoodFromSeason(seasonId?: SeasonId, weatherId?: string): Exclude<AtmosphereMood, 'season'> {
  if (weatherId === 'snow' || seasonId === 'winter') return 'frost';
  if (weatherId === 'heavy_rain' || weatherId === 'dense_fog') return 'dusk';
  if (seasonId === 'autumn') return 'dusk';
  if (seasonId === 'summer') return 'noon';
  return 'dawn';
}

function detectSoftwareGl(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return false;
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererName = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe/i.test(rendererName);
  } catch {
    return false;
  }
}

function afterDraw(renderer: THREE.WebGLRenderer, isSoftwareGl: boolean, done: () => void): number | null {
  if (!isSoftwareGl) {
    return window.requestAnimationFrame(done);
  }
  const gl = renderer.getContext() as WebGL2RenderingContext;
  if (typeof gl.fenceSync === 'function') {
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    if (sync) {
      gl.flush();
      const poll = (): void => {
        const res = gl.clientWaitSync(sync, 0, 0);
        if (res === gl.TIMEOUT_EXPIRED) {
          window.setTimeout(poll, 16);
          return;
        }
        gl.deleteSync(sync);
        done();
      };
      return window.setTimeout(poll, 16);
    }
  }
  return window.setTimeout(done, 80);
}

function createStoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#6c7482';
  ctx.fillRect(0, 0, 256, 256);
  const rows = 8;
  const rowH = 256 / rows;
  for (let r = 0; r < rows; r++) {
    const cols = 4;
    const colW = 256 / cols;
    const offset = (r % 2) * (colW * 0.5);
    for (let c = -1; c <= cols; c++) {
      const shade = 92 + ((r * 17 + c * 31) % 34);
      ctx.fillStyle = `rgb(${shade}, ${shade + 4}, ${shade + 10})`;
      ctx.fillRect(c * colW + offset + 2, r * rowH + 2, colW - 4, rowH - 4);
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fillRect(c * colW + offset + 2, r * rowH + 2, colW - 4, 3);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#5c3b22';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 64; i++) {
    const y = i * 4;
    const tone = 72 + ((i * 19) % 28);
    ctx.fillStyle = `rgb(${tone + 18}, ${tone}, ${Math.max(24, tone - 24)})`;
    ctx.fillRect(0, y, 256, 3);
  }
  ctx.strokeStyle = 'rgba(25, 12, 4, 0.42)';
  ctx.lineWidth = 2;
  for (let x = 0; x <= 256; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createRoofTileTexture(baseHex = '#2f3d52'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 24) {
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.fillRect(0, y, 256, 3);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(0, y + 3, 256, 2);
  }
  for (let x = 0; x < 256; x += 16) {
    ctx.fillStyle = 'rgba(0,0,0,0.16)';
    ctx.fillRect(x, 0, 2, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 126);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.58)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.24)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function sampleEurasiaHeight(nx: number, ny: number): { elevation: number; isSea: boolean } {
  // nx in [0, 1] west -> east, ny in [0, 1] north -> south
  // Analytical Eurasian terrain relief aligned with CITIES (x: 7..94, y: 18..75)
  const gaussian = (cx: number, cy: number, sx: number, sy: number, amp: number) => {
    const dx = (nx - cx) / sx;
    const dy = (ny - cy) / sy;
    return amp * Math.exp(-(dx * dx + dy * dy));
  };

  // Atlantic/Mediterranean/East-China Sea depressions
  const medSea =
    gaussian(0.18, 0.50, 0.09, 0.06, -0.55) +
    gaussian(0.04, 0.35, 0.06, 0.25, -0.6) +
    gaussian(0.89, 0.55, 0.10, 0.22, -0.52) +
    gaussian(0.84, 0.72, 0.14, 0.14, -0.45) +
    gaussian(0.52, 0.78, 0.20, 0.14, -0.55);

  const ridges =
    // Alps & Pyrenees
    gaussian(0.14, 0.39, 0.045, 0.035, 0.55) +
    // Caucasus & Anatolian plateau
    gaussian(0.30, 0.40, 0.06, 0.04, 0.50) +
    // Ural ridge
    gaussian(0.41, 0.22, 0.025, 0.14, 0.45) +
    // Pamir / Tian Shan / Kunlun
    gaussian(0.49, 0.43, 0.075, 0.05, 0.95) +
    // Tibetan Plateau & Himalayas
    gaussian(0.57, 0.51, 0.09, 0.065, 1.15) +
    // Altai / Steppe highlands
    gaussian(0.62, 0.24, 0.10, 0.05, 0.42) +
    // Qinling / Bashu mountains
    gaussian(0.65, 0.54, 0.06, 0.05, 0.58) +
    // Continental shelf base lift
    gaussian(0.48, 0.42, 0.38, 0.28, 0.28);

  const microRipple =
    0.045 * Math.sin(nx * 29.0) * Math.cos(ny * 23.0) +
    0.025 * Math.sin((nx + ny) * 43.0);

  const raw = ridges + medSea + microRipple;
  const isSea = raw < 0.06;
  const elevation = isSea ? -0.05 : Math.max(0.04, raw);
  return { elevation, isSea };
}

function getCameraPresetVectors(
  subject: ViewerSubject,
  preset: CameraPreset,
  focusPoint?: THREE.Vector3,
): { pos: [number, number, number]; target: [number, number, number] } {
  const tx = focusPoint ? focusPoint.x : 0;
  const ty = focusPoint ? focusPoint.y : subject === 'citadel' ? 1.15 : subject === 'siege' ? 1.0 : 0.4;
  const tz = focusPoint ? focusPoint.z : 0;

  if (subject === 'sandtable') {
    switch (preset) {
      case 'lowAngle':
        return { pos: [tx, 3.4, tz + 10.2], target: [tx, ty, tz] };
      case 'closeup':
        return { pos: [tx + 2.8, 3.2, tz + 3.8], target: [tx, ty + 0.15, tz] };
      case 'flank':
        return { pos: [tx - 10.5, 6.2, tz + 6.5], target: [tx, ty, tz] };
      case 'overview':
      default:
        return { pos: [0, 9.6, 10.8], target: [0, 0.2, 0.2] };
    }
  }

  if (subject === 'siege') {
    switch (preset) {
      case 'lowAngle':
        return { pos: [4.6, 1.35, 5.2], target: [0, 1.2, 0] };
      case 'closeup':
        return { pos: [2.8, 2.0, 2.9], target: [0.4, 1.1, 0] };
      case 'flank':
        return { pos: [-5.6, 2.6, 4.4], target: [0, 1.0, 0] };
      case 'overview':
      default:
        return { pos: [5.2, 3.9, 5.8], target: [0, 1.05, 0] };
    }
  }

  // citadel
  switch (preset) {
    case 'lowAngle':
      return { pos: [0.6, 1.85, 7.9], target: [0, 1.5, 0] };
    case 'closeup':
      return { pos: [3.2, 2.9, 3.5], target: [0, 1.6, 0] };
    case 'flank':
      return { pos: [-7.2, 4.2, 5.6], target: [0, 1.2, 0] };
    case 'overview':
    default:
      return { pos: [6.8, 5.4, 7.2], target: [0, 1.1, 0] };
  }
}

export default function Scene3DViewer({
  cities,
  factions,
  officers,
  selectedCityId,
  onSelectCity,
  onInspectCityDetail,
  cityOwnership = {},
  cityStats = {},
  seasonId = 'spring',
  weatherId = 'sunny',
  initialSubject = 'citadel',
}: Scene3DViewerProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [subject, setSubject] = useState<ViewerSubject>(initialSubject);
  const [preset, setPreset] = useState<CameraPreset>('overview');
  const [presetNonce, setPresetNonce] = useState(0);
  const [explodePercent, setExplodePercent] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [mood, setMood] = useState<AtmosphereMood>('season');
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [webGlError, setWebGlError] = useState<string | null>(null);
  const [hoveredCityInfo, setHoveredCityInfo] = useState<{
    name: string;
    factionName: string;
    factionColor: string;
    defense: number;
    population: number;
    x: number;
    y: number;
  } | null>(null);

  const selectedCity = useMemo(
    () => cities.find(c => c.id === selectedCityId) || cities[0],
    [cities, selectedCityId],
  );
  const controllerId = (selectedCity && cityOwnership[selectedCity.id]) || 'ronin';
  const controllerFaction = useMemo(
    () => factions.find(f => f.id === controllerId) || factions[factions.length - 1] || factions[0],
    [factions, controllerId],
  );
  const stationedCount = useMemo(
    () =>
      officers.filter(
        o =>
          o.homeCity === selectedCity?.name ||
          (o.factionId === controllerId && controllerId !== 'ronin'),
      ).length,
    [officers, selectedCity?.name, controllerId],
  );

  // Refs for syncing React control changes into active Three.js loop without full context rebuild
  const explodeTargetRef = useRef(0);
  const autoRotateRef = useRef(true);
  const isSoftwareGlRef = useRef(false);
  const cameraTargetGoalRef = useRef<{
    active: boolean;
    pos: THREE.Vector3;
    target: THREE.Vector3;
  }>({
    active: false,
    pos: new THREE.Vector3(6.8, 5.4, 7.2),
    target: new THREE.Vector3(0, 1.1, 0),
  });
  const onSelectCityRef = useRef(onSelectCity);
  onSelectCityRef.current = onSelectCity;

  const moodKey: Exclude<AtmosphereMood, 'season'> = useMemo(
    () => (mood === 'season' ? resolveMoodFromSeason(seasonId, weatherId) : mood),
    [mood, seasonId, weatherId],
  );

  useEffect(() => {
    explodeTargetRef.current = explodePercent / 100;
  }, [explodePercent]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  // Trigger smooth camera transition when preset or selectedCity on sandtable changes
  const cityFocusVec = useMemo(() => {
    if (subject !== 'sandtable' || !selectedCity) return undefined;
    const x = ((selectedCity.x - 50) / 50) * 7.6;
    const z = ((selectedCity.y - 50) / 50) * 4.55;
    const h = sampleEurasiaHeight(selectedCity.x / 100, selectedCity.y / 100).elevation;
    return new THREE.Vector3(x, h + 0.35, z);
  }, [subject, selectedCity]);

  useEffect(() => {
    const vectors = getCameraPresetVectors(subject, preset, preset === 'closeup' ? cityFocusVec : undefined);
    cameraTargetGoalRef.current.pos.set(...vectors.pos);
    cameraTargetGoalRef.current.target.set(...vectors.target);
    cameraTargetGoalRef.current.active = true;
  }, [subject, preset, presetNonce, cityFocusVec]);

  // Build & manage WebGL Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container || typeof window === 'undefined') return;

    const isSoftwareGl = detectSoftwareGl();
    isSoftwareGlRef.current = isSoftwareGl;
    if (isSoftwareGl) {
      setAutoRotate(false);
      autoRotateRef.current = false;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebGlError('当前浏览器环境暂不支持 WebGL 3D 渲染，请启用硬件加速或更换现代浏览器。');
      return;
    }

    setWebGlError(null);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = ATMOSPHERE_PRESETS[moodKey].exposure;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const initW = Math.max(container.clientWidth, 320);
    const initH = Math.max(container.clientHeight, 320);
    renderer.setSize(initW, initH, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const atm = ATMOSPHERE_PRESETS[moodKey];
    scene.background = new THREE.Color(atm.bg);
    scene.fog = new THREE.FogExp2(atm.fog, atm.fogDensity);

    // IBL Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(44, initW / initH, 0.1, 120);
    const initialCam = getCameraPresetVectors(subject, preset);
    camera.position.set(...initialCam.pos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...initialCam.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI * 0.485;
    controls.minDistance = 2.6;
    controls.maxDistance = 26;
    controls.update();

    const cancelAutoGlide = () => {
      cameraTargetGoalRef.current.active = false;
    };
    controls.addEventListener('start', cancelAutoGlide);

    // 3-Point Studio Lighting
    const hemiLight = new THREE.HemisphereLight(atm.hemiSky, atm.hemiGround, atm.hemiIntensity);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(atm.keyColor, atm.keyIntensity);
    keyLight.position.set(...atm.keyPos);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 36;
    keyLight.shadow.camera.left = -10;
    keyLight.shadow.camera.right = 10;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -10;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x60a5fa, 0.75);
    rimLight.position.set(-9, 6, -8);
    scene.add(rimLight);

    // Procedural PBR Textures
    const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy() || 1);
    const stoneTex = createStoneTexture();
    const woodTex = createWoodTexture();
    const roofTex = createRoofTileTexture('#243044');
    const shadowTex = createContactShadowTexture();
    [stoneTex, woodTex, roofTex, shadowTex].forEach(t => {
      t.anisotropy = maxAniso;
    });

    const factionColorHex = controllerFaction?.color || '#d97706';
    const factionThreeColor = new THREE.Color(factionColorHex);
    const isMetropolis =
      selectedCity?.tier === 'metropolis' ||
      ['luoyang', 'changan', 'rome', 'constantinople', 'london', 'paris', 'moscow', 'guangzhou'].includes(
        selectedCity?.id || '',
      );

    const explodableParts: ExplodablePart[] = [];
    const registerExplode = (object: THREE.Object3D, ox: number, oy: number, oz: number) => {
      explodableParts.push({
        object,
        basePos: object.position.clone(),
        explodeOffset: new THREE.Vector3(ox, oy, oz),
      });
    };

    const subjectGroup = new THREE.Group();
    scene.add(subjectGroup);

    // Contact shadow plane on floor
    const floorShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(15.5, 15.5),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.75,
      }),
    );
    floorShadow.rotation.x = -Math.PI / 2;
    floorShadow.position.y = -0.01;
    subjectGroup.add(floorShadow);

    // Reusable references for animation & raycasting
    let wavingBanner: THREE.Mesh | null = null;
    let bannerBasePositions: Float32Array | null = null;
    const sandtableCityMarkers: CityMarkerMeta[] = [];
    const hitMeshes: THREE.Mesh[] = [];
    let selectionHalo: THREE.Mesh | null = null;

    if (subject === 'citadel') {
      const stoneMat = new THREE.MeshStandardMaterial({
        map: stoneTex,
        color: 0xb6beca,
        roughness: 0.84,
        metalness: 0.08,
      });
      const darkStoneMat = new THREE.MeshStandardMaterial({
        map: stoneTex,
        color: 0x677282,
        roughness: 0.88,
        metalness: 0.06,
      });
      const woodMat = new THREE.MeshStandardMaterial({
        map: woodTex,
        color: 0x8f5d38,
        roughness: 0.72,
        metalness: 0.05,
      });
      const crimsonMat = new THREE.MeshStandardMaterial({
        color: 0x9b2226,
        roughness: 0.56,
        metalness: 0.12,
      });
      const roofMat = new THREE.MeshStandardMaterial({
        map: roofTex,
        color: isMetropolis ? 0x3b4d6b : 0x2e3b4e,
        roughness: 0.45,
        metalness: 0.25,
      });
      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xf5c451,
        roughness: 0.26,
        metalness: 0.88,
      });
      const waterMat = new THREE.MeshStandardMaterial({
        color: 0x164e63,
        roughness: 0.14,
        metalness: 0.35,
      });
      const bannerMat = new THREE.MeshStandardMaterial({
        color: factionThreeColor,
        roughness: 0.68,
        metalness: 0.05,
        side: THREE.DoubleSide,
      });

      // 1. Base Island Plinth + Moat
      const plinth = new THREE.Mesh(new THREE.CylinderGeometry(5.6, 6.1, 0.48, 8), darkStoneMat);
      plinth.position.y = 0.24;
      plinth.receiveShadow = true;
      plinth.castShadow = true;
      subjectGroup.add(plinth);

      const moat = new THREE.Mesh(new THREE.CylinderGeometry(5.25, 5.25, 0.08, 32), waterMat);
      moat.position.y = 0.49;
      moat.receiveShadow = true;
      subjectGroup.add(moat);

      const innerCourtyard = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.32, 6.8), stoneMat);
      innerCourtyard.position.y = 0.64;
      innerCourtyard.receiveShadow = true;
      innerCourtyard.castShadow = true;
      subjectGroup.add(innerCourtyard);

      // 2. Arched Timber Drawbridge (front +Z)
      const bridgeGroup = new THREE.Group();
      bridgeGroup.position.set(0, 0.68, 4.35);
      const bridgeDeck = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.14, 2.2), woodMat);
      bridgeDeck.castShadow = true;
      bridgeDeck.receiveShadow = true;
      bridgeGroup.add(bridgeDeck);
      [-0.68, 0.68].forEach(rx => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.28, 2.1), woodMat);
        rail.position.set(rx, 0.16, 0);
        rail.castShadow = true;
        bridgeGroup.add(rail);
      });
      subjectGroup.add(bridgeGroup);
      registerExplode(bridgeGroup, 0, 0.25, 1.3);

      // 3. Curtain Walls + Crenelations (InstancedMesh)
      const wallsGroup = new THREE.Group();
      wallsGroup.position.y = 0.8;
      const wallPositions: Array<[number, number, number, number, number]> = [
        [0, 3.05, 5.6, 0.42, 0],     // Back
        [-3.05, 0, 0.42, 5.6, 0],    // Left
        [3.05, 0, 0.42, 5.6, 0],     // Right
      ];
      wallPositions.forEach(([wx, wz, ww, wd]) => {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(ww, 1.05, wd), stoneMat);
        wall.position.set(wx, 0.525, wz);
        wall.castShadow = true;
        wall.receiveShadow = true;
        wallsGroup.add(wall);
      });
      // Front wall split around gatehouse
      [-1.95, 1.95].forEach(wx => {
        const halfWall = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.05, 0.42), stoneMat);
        halfWall.position.set(wx, 0.525, -3.05);
        halfWall.position.z = 3.05;
        halfWall.castShadow = true;
        halfWall.receiveShadow = true;
        wallsGroup.add(halfWall);
      });

      // Instanced merlons along perimeter walls
      const merlonGeo = new THREE.BoxGeometry(0.28, 0.24, 0.24);
      const merlonOffsets: Array<[number, number]> = [];
      for (let i = -2.4; i <= 2.41; i += 0.6) {
        merlonOffsets.push([i, -3.05]);
        merlonOffsets.push([-3.05, i]);
        merlonOffsets.push([3.05, i]);
        if (Math.abs(i) > 0.9) merlonOffsets.push([i, 3.05]);
      }
      const merlons = new THREE.InstancedMesh(merlonGeo, darkStoneMat, merlonOffsets.length);
      merlons.castShadow = true;
      const dummy = new THREE.Object3D();
      merlonOffsets.forEach(([mx, mz], idx) => {
        dummy.position.set(mx, 1.17, mz);
        dummy.updateMatrix();
        merlons.setMatrixAt(idx, dummy.matrix);
      });
      merlons.instanceMatrix.needsUpdate = true;
      wallsGroup.add(merlons);

      // Gatehouse arch & crimson doors
      const gateArch = new THREE.Mesh(new THREE.BoxGeometry(1.75, 1.45, 0.72), darkStoneMat);
      gateArch.position.set(0, 0.72, 3.08);
      gateArch.castShadow = true;
      wallsGroup.add(gateArch);
      const gateRoof = new THREE.Mesh(new THREE.ConeGeometry(1.45, 0.72, 4), roofMat);
      gateRoof.rotation.y = Math.PI / 4;
      gateRoof.position.set(0, 1.78, 3.08);
      gateRoof.castShadow = true;
      wallsGroup.add(gateRoof);

      subjectGroup.add(wallsGroup);
      registerExplode(wallsGroup, 0, 0.9, 0);

      // 4. Four Corner Watchtowers
      const corners: Array<[number, number]> = [
        [-3.05, -3.05],
        [3.05, -3.05],
        [-3.05, 3.05],
        [3.05, 3.05],
      ];
      corners.forEach(([cx, cz]) => {
        const tower = new THREE.Group();
        tower.position.set(cx, 0.8, cz);
        const base = new THREE.Mesh(new THREE.BoxGeometry(0.98, 1.75, 0.98), darkStoneMat);
        base.position.y = 0.875;
        base.castShadow = true;
        base.receiveShadow = true;
        tower.add(base);

        const gallery = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.34, 1.16), crimsonMat);
        gallery.position.y = 1.9;
        gallery.castShadow = true;
        tower.add(gallery);

        const cap = new THREE.Mesh(new THREE.ConeGeometry(0.98, 0.65, 4), roofMat);
        cap.rotation.y = Math.PI / 4;
        cap.position.y = 2.38;
        cap.castShadow = true;
        tower.add(cap);

        const finial = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), goldMat);
        finial.position.y = 2.75;
        tower.add(finial);

        subjectGroup.add(tower);
        registerExplode(tower, Math.sign(cx) * 0.85, 1.25, Math.sign(cz) * 0.85);
      });

      // 5. Central Imperial Keep / Governor Hall (2 or 3 tiers)
      const keepBase = new THREE.Group();
      keepBase.position.set(0, 0.8, -0.2);
      const podium = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.45, 2.7), darkStoneMat);
      podium.position.y = 0.225;
      podium.castShadow = true;
      podium.receiveShadow = true;
      keepBase.add(podium);

      const hallBody = new THREE.Mesh(new THREE.BoxGeometry(2.55, 1.15, 2.05), crimsonMat);
      hallBody.position.y = 1.02;
      hallBody.castShadow = true;
      hallBody.receiveShadow = true;
      keepBase.add(hallBody);

      // Decorative gilded columns along front facade
      [-0.95, -0.35, 0.35, 0.95].forEach(px => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 1.12, 10), goldMat);
        col.position.set(px, 1.02, 1.04);
        keepBase.add(col);
      });
      subjectGroup.add(keepBase);
      registerExplode(keepBase, 0, 1.45, 0);

      // Lower Roof Tier
      const lowerRoof = new THREE.Group();
      lowerRoof.position.set(0, 2.52, -0.2);
      const roof1 = new THREE.Mesh(new THREE.ConeGeometry(2.38, 0.85, 4), roofMat);
      roof1.rotation.y = Math.PI / 4;
      roof1.scale.set(1.12, 1, 0.92);
      roof1.castShadow = true;
      lowerRoof.add(roof1);
      subjectGroup.add(lowerRoof);
      registerExplode(lowerRoof, 0, 2.2, 0);

      // Upper Imperial Pavilion Tier (taller for metropolis)
      const upperPavilion = new THREE.Group();
      upperPavilion.position.set(0, isMetropolis ? 3.25 : 2.95, -0.2);
      const upperCore = new THREE.Mesh(
        new THREE.BoxGeometry(isMetropolis ? 1.55 : 1.25, isMetropolis ? 0.92 : 0.7, isMetropolis ? 1.3 : 1.05),
        crimsonMat,
      );
      upperCore.castShadow = true;
      upperPavilion.add(upperCore);

      const topRoof = new THREE.Mesh(new THREE.ConeGeometry(isMetropolis ? 1.55 : 1.25, 0.85, 4), roofMat);
      topRoof.rotation.y = Math.PI / 4;
      topRoof.position.y = isMetropolis ? 0.86 : 0.74;
      topRoof.castShadow = true;
      upperPavilion.add(topRoof);

      const ridgeSpire = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.5, 8), goldMat);
      ridgeSpire.position.y = (isMetropolis ? 0.86 : 0.74) + 0.55;
      upperPavilion.add(ridgeSpire);
      subjectGroup.add(upperPavilion);
      registerExplode(upperPavilion, 0, 3.1, 0);

      // 6. Waving Faction Banner beside the Gate
      const bannerGroup = new THREE.Group();
      bannerGroup.position.set(1.75, 0.8, 2.25);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.055, 2.75, 10), goldMat);
      pole.position.y = 1.375;
      pole.castShadow = true;
      bannerGroup.add(pole);
      const poleTip = new THREE.Mesh(new THREE.OctahedronGeometry(0.09, 0), goldMat);
      poleTip.position.y = 2.8;
      bannerGroup.add(poleTip);

      const flagGeo = new THREE.PlaneGeometry(1.15, 0.68, 12, 4);
      flagGeo.translate(0.575, 0, 0);
      wavingBanner = new THREE.Mesh(flagGeo, bannerMat);
      wavingBanner.position.set(0.03, 2.32, 0);
      wavingBanner.castShadow = true;
      bannerBasePositions = new Float32Array(flagGeo.attributes.position.array);
      bannerGroup.add(wavingBanner);
      subjectGroup.add(bannerGroup);
      registerExplode(bannerGroup, 1.1, 1.9, 0.7);

      // 7. Perimeter Stylized Pine Grove (InstancedMesh) & Gate Braziers
      const pineSpots: Array<[number, number, number]> = [
        [-4.15, -2.8, 1.0],
        [-4.35, -0.7, 0.82],
        [-4.1, 1.8, 0.95],
        [4.2, -2.5, 0.92],
        [4.35, 0.4, 1.05],
        [4.05, 2.4, 0.85],
        [-2.2, -4.15, 0.96],
        [2.3, -4.1, 0.88],
      ];
      const trunkGeo = new THREE.CylinderGeometry(0.06, 0.09, 0.45, 7);
      const foliageGeo = new THREE.ConeGeometry(0.36, 0.88, 7);
      const trunks = new THREE.InstancedMesh(trunkGeo, woodMat, pineSpots.length);
      const foliage = new THREE.InstancedMesh(
        foliageGeo,
        new THREE.MeshStandardMaterial({ color: seasonId === 'autumn' ? 0xb45309 : seasonId === 'winter' ? 0x3b6e6c : 0x2d6a4f, roughness: 0.82 }),
        pineSpots.length,
      );
      trunks.castShadow = true;
      foliage.castShadow = true;
      pineSpots.forEach(([px, pz, sc], i) => {
        dummy.position.set(px, 0.48 + 0.22 * sc, pz);
        dummy.scale.setScalar(sc);
        dummy.updateMatrix();
        trunks.setMatrixAt(i, dummy.matrix);

        dummy.position.set(px, 0.48 + 0.68 * sc, pz);
        dummy.scale.setScalar(sc);
        dummy.updateMatrix();
        foliage.setMatrixAt(i, dummy.matrix);
      });
      trunks.instanceMatrix.needsUpdate = true;
      foliage.instanceMatrix.needsUpdate = true;
      subjectGroup.add(trunks, foliage);

      // Glowing amber gate braziers
      const emberMat = new THREE.MeshStandardMaterial({
        color: 0xffb703,
        emissive: 0xf97316,
        emissiveIntensity: 1.8,
        roughness: 0.4,
      });
      [-1.02, 1.02].forEach(bx => {
        const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.1, 0.24, 8), darkStoneMat);
        bowl.position.set(bx, 0.92, 3.55);
        const flame = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), emberMat);
        flame.position.set(bx, 1.1, 3.55);
        subjectGroup.add(bowl, flame);
      });
    } else if (subject === 'siege') {
      const stoneMat = new THREE.MeshStandardMaterial({ map: stoneTex, color: 0x6f7a8a, roughness: 0.85, metalness: 0.08 });
      const oakMat = new THREE.MeshStandardMaterial({ map: woodTex, color: 0x7c4d2b, roughness: 0.72, metalness: 0.06 });
      const rawhideMat = new THREE.MeshStandardMaterial({ map: roofTex, color: 0x4b382a, roughness: 0.65, metalness: 0.1 });
      const ironMat = new THREE.MeshStandardMaterial({ color: 0x3f4756, roughness: 0.34, metalness: 0.86 });
      const bronzeMat = new THREE.MeshStandardMaterial({ color: 0xd49b38, roughness: 0.28, metalness: 0.88 });
      const crimsonSilkMat = new THREE.MeshStandardMaterial({ color: factionThreeColor, roughness: 0.6, metalness: 0.08 });

      // 1. Courtyard plinth
      const plinth = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.7, 0.36, 12), stoneMat);
      plinth.position.y = 0.18;
      plinth.receiveShadow = true;
      plinth.castShadow = true;
      subjectGroup.add(plinth);

      // 2. Oak Siege Chassis
      const chassis = new THREE.Group();
      chassis.position.set(-0.35, 0.78, 0);
      [-0.85, 0.85].forEach(zSide => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.22, 0.24), oakMat);
        rail.position.set(0, 0, zSide);
        rail.castShadow = true;
        chassis.add(rail);
      });
      [-1.35, 0, 1.35].forEach(xCross => {
        const beam = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.2, 1.95), oakMat);
        beam.position.set(xCross, 0.02, 0);
        beam.castShadow = true;
        chassis.add(beam);
      });
      subjectGroup.add(chassis);
      registerExplode(chassis, 0, 0.25, 0);

      // 3. Four Iron-Rimmed Siege Wheels
      const wheelCoords: Array<[number, number]> = [
        [-1.3, 1.06],
        [1.3, 1.06],
        [-1.3, -1.06],
        [1.3, -1.06],
      ];
      wheelCoords.forEach(([wx, wz]) => {
        const wheel = new THREE.Group();
        wheel.position.set(wx - 0.35, 0.76, wz);
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.08, 10, 20), ironMat);
        rim.castShadow = true;
        wheel.add(rim);
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.2, 10), bronzeMat);
        hub.rotation.x = Math.PI / 2;
        wheel.add(hub);
        for (let s = 0; s < 4; s++) {
          const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.72, 0.07), oakMat);
          spoke.rotation.z = (s * Math.PI) / 4;
          wheel.add(spoke);
        }
        subjectGroup.add(wheel);
        registerExplode(wheel, Math.sign(wx) * 0.4, 0.18, Math.sign(wz) * 0.95);
      });

      // 4. Suspended Ironclad Battering Ram Beam
      const ramGroup = new THREE.Group();
      ramGroup.position.set(-0.25, 1.35, 0);
      const ramShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 3.6, 12), oakMat);
      ramShaft.rotation.z = Math.PI / 2;
      ramShaft.castShadow = true;
      ramGroup.add(ramShaft);

      [-0.85, 0, 0.85].forEach(bx => {
        const band = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.14, 12), ironMat);
        band.rotation.z = Math.PI / 2;
        band.position.x = bx;
        ramGroup.add(band);
      });

      const ramHead = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.85, 8), bronzeMat);
      ramHead.rotation.z = -Math.PI / 2;
      ramHead.position.x = 2.15;
      ramHead.castShadow = true;
      ramGroup.add(ramHead);
      subjectGroup.add(ramGroup);
      registerExplode(ramGroup, 0.85, 0.85, 0);

      // 5. Sloped Timber & Rawhide Shield Canopy
      const canopy = new THREE.Group();
      canopy.position.set(-0.35, 2.05, 0);
      [
        [-1.3, 0.85],
        [1.3, 0.85],
        [-1.3, -0.85],
        [1.3, -0.85],
      ].forEach(([px, pz]) => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.15, 0.15), oakMat);
        post.position.set(px, -0.62, pz);
        post.castShadow = true;
        canopy.add(post);
      });
      const leftSlope = new THREE.Mesh(new THREE.BoxGeometry(3.75, 0.12, 1.35), rawhideMat);
      leftSlope.position.set(0, 0.18, -0.52);
      leftSlope.rotation.x = Math.PI / 6;
      leftSlope.castShadow = true;
      const rightSlope = new THREE.Mesh(new THREE.BoxGeometry(3.75, 0.12, 1.35), rawhideMat);
      rightSlope.position.set(0, 0.18, 0.52);
      rightSlope.rotation.x = -Math.PI / 6;
      rightSlope.castShadow = true;
      const ridgeBeam = new THREE.Mesh(new THREE.BoxGeometry(3.85, 0.16, 0.18), bronzeMat);
      ridgeBeam.position.set(0, 0.52, 0);
      canopy.add(leftSlope, rightSlope, ridgeBeam);
      subjectGroup.add(canopy);
      registerExplode(canopy, 0, 1.75, 0);

      // 6. Companion Heroic Weapons Pedestal (Halberd & Bronze Ding Cauldron)
      const relicGroup = new THREE.Group();
      relicGroup.position.set(2.55, 0.36, 0.4);
      const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.88, 0.36, 8), stoneMat);
      pedestal.position.y = 0.18;
      pedestal.castShadow = true;
      relicGroup.add(pedestal);

      // Bronze Cauldron (九鼎)
      const cauldron = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 12, 0, Math.PI * 2, 0.35, Math.PI * 0.72), bronzeMat);
      cauldron.position.set(-0.22, 0.74, 0.2);
      cauldron.castShadow = true;
      relicGroup.add(cauldron);

      // Crescent Halberd (方天画戟)
      const halberdShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 2.75, 8), ironMat);
      halberdShaft.position.set(0.28, 1.55, -0.15);
      halberdShaft.rotation.z = -0.1;
      halberdShaft.castShadow = true;
      relicGroup.add(halberdShaft);
      const spearTip = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.45, 4), bronzeMat);
      spearTip.position.set(0.43, 3.02, -0.15);
      spearTip.rotation.z = -0.1;
      relicGroup.add(spearTip);
      const crescentBlade = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 6, 14, Math.PI), bronzeMat);
      crescentBlade.position.set(0.5, 2.65, -0.15);
      crescentBlade.rotation.z = -Math.PI / 2 - 0.1;
      relicGroup.add(crescentBlade);
      const tassel = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.32, 8), crimsonSilkMat);
      tassel.position.set(0.36, 2.45, -0.15);
      relicGroup.add(tassel);

      subjectGroup.add(relicGroup);
      registerExplode(relicGroup, 1.15, 0.65, 0.4);
    } else {
      // Subject 3: 3D Eurasian Campaign Sandtable
      const frameWoodMat = new THREE.MeshStandardMaterial({ map: woodTex, color: 0x472d1b, roughness: 0.68, metalness: 0.12 });
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xd99b38, roughness: 0.3, metalness: 0.86 });

      // 1. Carved Sandtable Border & Base
      const tableBase = new THREE.Mesh(new THREE.BoxGeometry(16.8, 0.5, 10.4), frameWoodMat);
      tableBase.position.y = 0.25;
      tableBase.receiveShadow = true;
      tableBase.castShadow = true;
      subjectGroup.add(tableBase);

      [
        [-8.3, -5.1],
        [8.3, -5.1],
        [-8.3, 5.1],
        [8.3, 5.1],
      ].forEach(([bx, bz]) => {
        const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.56, 0.45), brassMat);
        bracket.position.set(bx, 0.28, bz);
        subjectGroup.add(bracket);
      });

      // 2. Terrain Relief Heightmap Plane
      const mapW = 16.0;
      const mapD = 9.6;
      const terrainGeo = new THREE.PlaneGeometry(mapW, mapD, 112, 68);
      terrainGeo.rotateX(-Math.PI / 2);

      const posAttr = terrainGeo.attributes.position;
      const colors = new Float32Array(posAttr.count * 3);
      const cTmp = new THREE.Color();

      for (let i = 0; i < posAttr.count; i++) {
        const vx = posAttr.getX(i);
        const vz = posAttr.getZ(i);
        const nx = vx / mapW + 0.5;
        const ny = vz / mapD + 0.5;
        const { elevation, isSea } = sampleEurasiaHeight(nx, ny);
        posAttr.setY(i, 0.52 + elevation);

        if (isSea) {
          cTmp.setHex(0x164e63);
        } else if (elevation > 0.95) {
          cTmp.setHex(0xdbeafe); // Snow peaks
        } else if (elevation > 0.55) {
          cTmp.setHex(0x8d7b68); // Mountain granite/ochre
        } else if (nx > 0.36 && nx < 0.62 && ny > 0.30 && ny < 0.46) {
          cTmp.setHex(0x9a7b4f); // Silk road desert/steppe
        } else {
          cTmp.setHex(seasonId === 'autumn' ? 0x5c6b3c : seasonId === 'winter' ? 0x4b6358 : 0x3b6948);
        }
        colors[i * 3] = cTmp.r;
        colors[i * 3 + 1] = cTmp.g;
        colors[i * 3 + 2] = cTmp.b;
      }
      terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      terrainGeo.computeVertexNormals();

      const terrainMat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.78,
        metalness: 0.06,
      });
      const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
      terrainMesh.receiveShadow = true;
      terrainMesh.castShadow = true;
      subjectGroup.add(terrainMesh);

      // 3. Silk Road Route Beads
      const silkRoadIds = ['rome', 'antioch', 'ctesiphon', 'samarkand', 'shule', 'dunhuang', 'changan', 'luoyang'];
      const silkCities = silkRoadIds
        .map(id => cities.find(c => c.id === id))
        .filter((c): c is Scene3DCityRef => Boolean(c));
      if (silkCities.length >= 2) {
        const pts = silkCities.map(c => {
          const mx = ((c.x - 50) / 50) * (mapW * 0.475);
          const mz = ((c.y - 50) / 50) * (mapD * 0.475);
          const { elevation } = sampleEurasiaHeight(c.x / 100, c.y / 100);
          return new THREE.Vector3(mx, 0.56 + elevation, mz);
        });
        const curve = new THREE.CatmullRomCurve3(pts);
        const tube = new THREE.Mesh(
          new THREE.TubeGeometry(curve, 64, 0.032, 6, false),
          new THREE.MeshStandardMaterial({
            color: 0xfbbf24,
            emissive: 0xb45309,
            emissiveIntensity: 0.45,
            roughness: 0.35,
            metalness: 0.65,
          }),
        );
        subjectGroup.add(tube);
      }

      // 4. Interactive 3D City Keeps
      const keepStoneMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.65, metalness: 0.15 });
      const markerGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.22, 6);
      const metroGeo = new THREE.CylinderGeometry(0.24, 0.29, 0.32, 8);
      const roofGeo = new THREE.ConeGeometry(0.24, 0.2, 6);
      const metroRoofGeo = new THREE.ConeGeometry(0.31, 0.28, 8);

      cities.forEach(city => {
        const mx = ((city.x - 50) / 50) * (mapW * 0.475);
        const mz = ((city.y - 50) / 50) * (mapD * 0.475);
        const { elevation } = sampleEurasiaHeight(city.x / 100, city.y / 100);
        const ownerId = cityOwnership[city.id] || 'ronin';
        const ownerFaction = factions.find(f => f.id === ownerId) || factions[factions.length - 1] || factions[0];
        const fColor = ownerFaction?.color || '#94a3b8';
        const isMetro = city.tier === 'metropolis' || ['luoyang', 'changan', 'rome'].includes(city.id);

        const cityGroup = new THREE.Group();
        cityGroup.position.set(mx, 0.52 + elevation, mz);

        const roofMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(fColor),
          roughness: 0.4,
          metalness: 0.25,
          emissive: city.id === selectedCityId ? new THREE.Color(fColor) : new THREE.Color(0x000000),
          emissiveIntensity: city.id === selectedCityId ? 0.55 : 0,
        });

        const baseMesh = new THREE.Mesh(isMetro ? metroGeo : markerGeo, keepStoneMat);
        baseMesh.position.y = isMetro ? 0.16 : 0.11;
        baseMesh.castShadow = true;
        cityGroup.add(baseMesh);

        const spireMesh = new THREE.Mesh(isMetro ? metroRoofGeo : roofGeo, roofMat);
        spireMesh.position.y = isMetro ? 0.42 : 0.3;
        spireMesh.castShadow = true;
        cityGroup.add(spireMesh);

        // Invisible larger hit cylinder for smooth clicking
        const hitMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.36, 0.36, 0.72, 8),
          new THREE.MeshBasicMaterial({ visible: false }),
        );
        hitMesh.position.y = 0.34;
        cityGroup.add(hitMesh);

        const stats = cityStats[city.id];
        const meta: CityMarkerMeta = {
          city,
          group: cityGroup,
          hitMesh,
          factionName: ownerFaction?.name || '在野',
          factionColor: fColor,
          defense: stats?.defense ?? 60,
          population: stats?.population ?? 85000,
        };
        hitMesh.userData.cityMeta = meta;
        sandtableCityMarkers.push(meta);
        hitMeshes.push(hitMesh);

        if (city.id === selectedCityId) {
          selectionHalo = new THREE.Mesh(
            new THREE.RingGeometry(0.32, 0.42, 24),
            new THREE.MeshBasicMaterial({
              color: 0xfbbf24,
              side: THREE.DoubleSide,
            }),
          );
          selectionHalo.rotation.x = -Math.PI / 2;
          selectionHalo.position.y = 0.04;
          cityGroup.add(selectionHalo);
        }

        subjectGroup.add(cityGroup);
      });
    }

    // Raycaster & pre-allocated vectors (zero GC allocations in loop)
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    let pointerDownX = 0;
    let pointerDownY = 0;

    const handlePointerMove = (ev: PointerEvent) => {
      if (subject !== 'sandtable' || hitMeshes.length === 0) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(hitMeshes, false);
      if (hits.length > 0) {
        const meta = hits[0].object.userData.cityMeta as CityMarkerMeta | undefined;
        if (meta) {
          renderer.domElement.style.cursor = 'pointer';
          setHoveredCityInfo({
            name: meta.city.name,
            factionName: meta.factionName,
            factionColor: meta.factionColor,
            defense: meta.defense,
            population: meta.population,
            x: ev.clientX - rect.left,
            y: ev.clientY - rect.top,
          });
          return;
        }
      }
      renderer.domElement.style.cursor = 'grab';
      setHoveredCityInfo(null);
    };

    const handlePointerDown = (ev: PointerEvent) => {
      pointerDownX = ev.clientX;
      pointerDownY = ev.clientY;
    };

    const handlePointerUp = (ev: PointerEvent) => {
      if (subject !== 'sandtable' || hitMeshes.length === 0) return;
      const moved = Math.hypot(ev.clientX - pointerDownX, ev.clientY - pointerDownY);
      if (moved > 6) return; // Ignore orbit drag
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(hitMeshes, false);
      if (hits.length > 0) {
        const meta = hits[0].object.userData.cityMeta as CityMarkerMeta | undefined;
        if (meta) {
          onSelectCityRef.current?.(meta.city.id);
        }
      }
    };

    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

    // ResizeObserver for crisp responsive sizing
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = Math.floor(entry.contentRect.width);
        const h = Math.floor(entry.contentRect.height);
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, false);
        }
      }
    });
    resizeObserver.observe(container);

    // Pre-allocated animation state
    let explodeCurrent = explodeTargetRef.current;
    let lastTime = performance.now();
    let elapsed = 0;
    let scheduledHandle: number | null = null;
    let disposed = false;

    const tick = () => {
      if (disposed) return;

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Skip draw when tab is display:none
      if (container.clientWidth > 0 && container.clientHeight > 0) {
        elapsed += dt;

        // Smoothly damp exploded view positions
        explodeCurrent = THREE.MathUtils.damp(explodeCurrent, explodeTargetRef.current, 7, dt);
        for (let i = 0; i < explodableParts.length; i++) {
          const part = explodableParts[i];
          part.object.position.set(
            part.basePos.x + part.explodeOffset.x * explodeCurrent,
            part.basePos.y + part.explodeOffset.y * explodeCurrent,
            part.basePos.z + part.explodeOffset.z * explodeCurrent,
          );
        }

        // Gentle waving banner on citadel
        if (wavingBanner && bannerBasePositions) {
          const posAttr = wavingBanner.geometry.attributes.position as THREE.BufferAttribute;
          const arr = posAttr.array as Float32Array;
          for (let i = 0; i < posAttr.count; i++) {
            const bx = bannerBasePositions[i * 3];
            const by = bannerBasePositions[i * 3 + 1];
            const ratio = Math.min(1, Math.max(0, bx / 1.15));
            arr[i * 3 + 2] = Math.sin(elapsed * 4.5 - bx * 4.8 + by * 1.4) * 0.11 * ratio;
          }
          posAttr.needsUpdate = true;
        }

        // Subtle pulse scale on sandtable selection ring
        if (selectionHalo) {
          const s = 1 + 0.12 * Math.sin(elapsed * 3.2);
          selectionHalo.scale.set(s, s, 1);
        }

        // Smooth camera preset glide
        if (cameraTargetGoalRef.current.active) {
          const goal = cameraTargetGoalRef.current;
          camera.position.x = THREE.MathUtils.damp(camera.position.x, goal.pos.x, 6, dt);
          camera.position.y = THREE.MathUtils.damp(camera.position.y, goal.pos.y, 6, dt);
          camera.position.z = THREE.MathUtils.damp(camera.position.z, goal.pos.z, 6, dt);
          controls.target.x = THREE.MathUtils.damp(controls.target.x, goal.target.x, 6, dt);
          controls.target.y = THREE.MathUtils.damp(controls.target.y, goal.target.y, 6, dt);
          controls.target.z = THREE.MathUtils.damp(controls.target.z, goal.target.z, 6, dt);
          if (camera.position.distanceTo(goal.pos) < 0.03 && controls.target.distanceTo(goal.target) < 0.03) {
            goal.active = false;
          }
        }

        controls.autoRotate = autoRotateRef.current && !cameraTargetGoalRef.current.active;
        controls.autoRotateSpeed = 0.85;
        controls.update();

        renderer.render(scene, camera);
      }

      scheduledHandle = afterDraw(renderer, isSoftwareGl, tick);
    };

    scheduledHandle = afterDraw(renderer, isSoftwareGl, tick);

    return () => {
      disposed = true;
      if (scheduledHandle !== null) {
        if (isSoftwareGl) {
          window.clearTimeout(scheduledHandle);
        } else {
          window.cancelAnimationFrame(scheduledHandle);
        }
      }
      resizeObserver.disconnect();
      controls.removeEventListener('start', cancelAutoGlide);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      controls.dispose();

      scene.traverse(obj => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.InstancedMesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => {
              disposeMaterialTextures(m);
              m.dispose();
            });
          } else if (obj.material) {
            disposeMaterialTextures(obj.material);
            obj.material.dispose();
          }
        }
      });

      envRT.dispose();
      [stoneTex, woodTex, roofTex, shadowTex].forEach(t => t.dispose());
      renderer.dispose();
    };
  }, [
    subject,
    selectedCityId,
    controllerFaction?.color,
    cities,
    factions,
    cityOwnership,
    cityStats,
    moodKey,
    seasonId,
  ]);

  const seasonInfo = SEASONS[seasonId];

  return (
    <section
      id="scene-3d-viewer"
      aria-label="3D 全境立体沙盘与名城视界"
      className="relative w-full h-[640px] sm:h-[680px] rounded-2xl overflow-hidden border border-slate-700/80 bg-[#0b1322] select-none"
    >
      {/* Dedicated WebGL Mount Container (Empty for Three.js Canvas Ownership) */}
      <div ref={mountRef} className="w-full h-full" />

      {webGlError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-200">
          <Box size={40} className="text-amber-400 mb-3" />
          <p className="text-base font-bold mb-1">3D 引擎初始化受限</p>
          <p className="text-sm text-slate-400 max-w-md">{webGlError}</p>
        </div>
      )}

      {/* Top-Left Minimal Spec Header */}
      <div className="pointer-events-none absolute top-3 left-3 right-3 flex items-start justify-between gap-3">
        <div className="pointer-events-auto bg-[#0f172a]/95 border border-slate-700 rounded-xl px-3.5 py-2.5 shadow-lg max-w-md">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide text-amber-300">
              <Box size={14} />
              {subject === 'citadel'
                ? '3D 名城堡垒实景'
                : subject === 'sandtable'
                  ? '3D 欧亚立体沙盘'
                  : '3D 攻城重器武库'}
            </span>
            {selectedCity && (
              <span className="text-xs font-semibold text-slate-100 px-2 py-0.5 rounded bg-slate-800 border border-slate-600">
                {selectedCity.name} · {selectedCity.region}
              </span>
            )}
            {controllerFaction && (
              <span
                className="text-[11px] font-medium px-2 py-0.5 rounded border"
                style={{
                  borderColor: controllerFaction.color,
                  color: '#f8fafc',
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                }}
              >
                {controllerFaction.name}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {subject === 'sandtable'
              ? '左键拖拽旋转 · 滚轮缩放 · 点击沙盘城池可切换焦点'
              : `左键拖拽环绕 · 滚轮缩放 · 右键平移 · 驻守武将 ${stationedCount} 名`}
          </p>
        </div>

        {onInspectCityDetail && selectedCity && (
          <div className="pointer-events-auto hidden sm:block">
            <Button
              id="btn-3d-enter-city"
              onClick={() => onInspectCityDetail(selectedCity.id)}
              className="bg-[#0f172a] border-slate-600 text-xs"
            >
              <Shield size={13} />
              <span>进入{selectedCity.name}城内政</span>
            </Button>
          </div>
        )}
      </div>

      {/* Sandtable Hover Tooltip (Zero Backdrop Blur) */}
      {subject === 'sandtable' && hoveredCityInfo && (
        <div
          className="pointer-events-none absolute z-20 bg-[#0f172a] border border-amber-400/70 rounded-lg px-2.5 py-1.5 shadow-xl text-xs"
          style={{
            left: Math.min(Math.max(12, hoveredCityInfo.x + 14), 520),
            top: Math.max(12, hoveredCityInfo.y - 44),
          }}
        >
          <div className="flex items-center gap-2 font-bold text-slate-100">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: hoveredCityInfo.factionColor }}
            />
            <span>{hoveredCityInfo.name}</span>
            <span className="text-[11px] font-normal text-amber-300">{hoveredCityInfo.factionName}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            城防 {hoveredCityInfo.defense} · 人口 {hoveredCityInfo.population.toLocaleString()}
          </div>
        </div>
      )}

      {/* Collapsible Bottom Control Dock */}
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex flex-col items-center">
        <div className="pointer-events-auto w-full max-w-4xl bg-[#0f172a]/95 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Button
                id="btn-3d-subject-citadel"
                aria-pressed={subject === 'citadel'}
                onClick={() => {
                  setSubject('citadel');
                  setPreset('overview');
                  setPresetNonce(n => n + 1);
                }}
                className="px-2.5 py-1 text-xs flex items-center gap-1.5"
              >
                <Shield size={13} />
                <span>名城堡垒</span>
              </Button>
              <Button
                id="btn-3d-subject-sandtable"
                aria-pressed={subject === 'sandtable'}
                onClick={() => {
                  setSubject('sandtable');
                  setPreset('overview');
                  setPresetNonce(n => n + 1);
                }}
                className="px-2.5 py-1 text-xs flex items-center gap-1.5"
              >
                <Compass size={13} />
                <span>欧亚沙盘</span>
              </Button>
              <Button
                id="btn-3d-subject-siege"
                aria-pressed={subject === 'siege'}
                onClick={() => {
                  setSubject('siege');
                  setPreset('overview');
                  setPresetNonce(n => n + 1);
                }}
                className="px-2.5 py-1 text-xs flex items-center gap-1.5"
              >
                <Sparkles size={13} />
                <span>攻城神兵</span>
              </Button>
            </div>

            <button
              id="btn-3d-toggle-dock"
              type="button"
              onClick={() => setDockCollapsed(prev => !prev)}
              aria-expanded={!dockCollapsed}
              className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-amber-300 px-2 py-1 rounded border border-slate-700 bg-slate-900 cursor-pointer"
            >
              {dockCollapsed ? (
                <>
                  <ChevronUp size={13} />
                  <span>展开控制</span>
                </>
              ) : (
                <>
                  <ChevronDown size={13} />
                  <span>收起面板</span>
                </>
              )}
            </button>
          </div>

          {!dockCollapsed && (
            <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs items-center">
              {/* City Selector */}
              <label className="flex flex-col gap-1 text-slate-400">
                <span className="text-[11px] font-medium">视角城池 ({cities.length}座)</span>
                <select
                  id="select-3d-city"
                  value={selectedCity?.id || ''}
                  onChange={e => onSelectCity?.(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-md px-2 py-1.5 text-slate-100 text-xs"
                >
                  {cities.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.region})
                    </option>
                  ))}
                </select>
              </label>

              {/* Camera Presets */}
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <Camera size={12} /> 机位视角
                </span>
                <div className="grid grid-cols-4 gap-1">
                  {(
                    [
                      { id: 'overview', label: '俯瞰' },
                      { id: 'lowAngle', label: '仰视' },
                      { id: 'closeup', label: '特写' },
                      { id: 'flank', label: '侧翼' },
                    ] as const
                  ).map(item => (
                    <button
                      key={item.id}
                      id={`btn-3d-cam-${item.id}`}
                      type="button"
                      onClick={() => {
                        setPreset(item.id);
                        setPresetNonce(n => n + 1);
                      }}
                      className={`px-1.5 py-1.5 rounded border text-[11px] cursor-pointer ${
                        preset === item.id
                          ? 'border-amber-400 bg-amber-400/15 text-amber-300 font-semibold'
                          : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exploded Assembly Slider */}
              <label className="flex flex-col gap-1 text-slate-400">
                <span className="text-[11px] font-medium flex items-center justify-between">
                  <span className="inline-flex items-center gap-1">
                    <Layers size={12} /> 结构拆解视图
                  </span>
                  <span className="font-mono text-amber-300">
                    {subject === 'sandtable' ? '沙盘模式' : `${explodePercent}%`}
                  </span>
                </span>
                <input
                  id="range-3d-explode"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  disabled={subject === 'sandtable'}
                  value={subject === 'sandtable' ? 0 : explodePercent}
                  onChange={e => setExplodePercent(Number(e.target.value))}
                  className="accent-amber-400 cursor-pointer disabled:opacity-40"
                />
              </label>

              {/* Atmosphere & Auto-Spin */}
              <div className="flex items-end gap-2">
                <label className="flex-1 flex flex-col gap-1 text-slate-400">
                  <span className="text-[11px] font-medium flex items-center gap-1">
                    <Sun size={12} /> 光影天时
                  </span>
                  <select
                    id="select-3d-atmosphere"
                    value={mood}
                    onChange={e => setMood(e.target.value as AtmosphereMood)}
                    className="bg-slate-950 border border-slate-700 rounded-md px-2 py-1.5 text-slate-100 text-xs"
                  >
                    <option value="season">节气联动 ({seasonInfo?.name || '春'})</option>
                    <option value="dawn">晨曦微光</option>
                    <option value="noon">烈日晴空</option>
                    <option value="dusk">暮秋烽火</option>
                    <option value="frost">凛冬霜夜</option>
                  </select>
                </label>

                <button
                  id="btn-3d-autorotate"
                  type="button"
                  aria-pressed={autoRotate}
                  onClick={() => setAutoRotate(v => !v)}
                  title="切换自动环绕展示"
                  className={`px-2.5 py-1.5 rounded-md border text-xs inline-flex items-center gap-1 cursor-pointer ${
                    autoRotate
                      ? 'border-amber-400 bg-amber-400/15 text-amber-300'
                      : 'border-slate-700 bg-slate-900 text-slate-300'
                  }`}
                >
                  <RotateCw size={12} />
                  <span>自转</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function disposeMaterialTextures(material: THREE.Material): void {
  const matRecord = material as unknown as Record<string, unknown>;
  const texKeys = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap'];
  for (const key of texKeys) {
    const val = matRecord[key];
    if (val instanceof THREE.Texture) {
      val.dispose();
    }
  }
}
