import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Car } from "../types";
import { Volume2, VolumeX } from "lucide-react";

interface Showroom3DProps {
  car: Car;
}

export default function Showroom3D({ car }: Showroom3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const carGroupRef = useRef<THREE.Group | null>(null);
  const wheelsRef = useRef<THREE.Mesh[]>([]);
  const spoilerRef = useRef<THREE.Group | null>(null);

  // Web Audio engine idle sound synthesizer state & refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const mainOscRef = useRef<OscillatorNode | null>(null);
  const subOscRef = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const subHumRef = useRef<OscillatorNode | null>(null);
  const modOscRef = useRef<OscillatorNode | null>(null);
  
  const [isEngineSoundActive, setIsEngineSoundActive] = useState<boolean>(() => {
    const stored = localStorage.getItem("rr3_showroom_audio_active");
    return stored === null ? true : stored === "true";
  });
  const [audioFeedbackOn, setAudioFeedbackOn] = useState<boolean>(false);

  // Toggle synthesized engine sound activity
  const toggleEngineSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextVal = !isEngineSoundActive;
    setIsEngineSoundActive(nextVal);
    localStorage.setItem("rr3_showroom_audio_active", String(nextVal));

    if (!nextVal) {
      try {
        if (mainOscRef.current) mainOscRef.current.stop();
        if (subOscRef.current) subOscRef.current.stop();
        if (subHumRef.current) subHumRef.current.stop();
        if (modOscRef.current) modOscRef.current.stop();
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      } catch (err) {}
      audioContextRef.current = null;
      mainOscRef.current = null;
      subOscRef.current = null;
      subHumRef.current = null;
      modOscRef.current = null;
      setAudioFeedbackOn(false);
    }
  };

  // Synthesizer Audio Cycle Effect
  useEffect(() => {
    const baseFreq = car.class === "S" ? 34 : car.class === "A" ? 40 : 31;
    const harmonicFreq = baseFreq * 2;
    const subBassFreq = Math.round(baseFreq * 0.85);

    const setupAudio = () => {
      if (audioContextRef.current) return;
      if (!isEngineSoundActive) return;

      try {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtxClass) return;

        const ctx = new AudioCtxClass();
        audioContextRef.current = ctx;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(145, ctx.currentTime);
        filterRef.current = filter;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNodeRef.current = gainNode;

        const mainOsc = ctx.createOscillator();
        mainOsc.type = "sawtooth";
        mainOsc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
        mainOscRef.current = mainOsc;

        const subOsc = ctx.createOscillator();
        subOsc.type = "sawtooth";
        subOsc.frequency.setValueAtTime(harmonicFreq, ctx.currentTime);
        subOscRef.current = subOsc;

        const subHum = ctx.createOscillator();
        subHum.type = "sine";
        subHum.frequency.setValueAtTime(subBassFreq, ctx.currentTime);
        subHumRef.current = subHum;

        const pulseModNode = ctx.createOscillator();
        pulseModNode.type = "sawtooth";
        pulseModNode.frequency.setValueAtTime(2.2, ctx.currentTime);
        modOscRef.current = pulseModNode;

        const pulseModGain = ctx.createGain();
        pulseModGain.gain.setValueAtTime(3.8, ctx.currentTime);

        pulseModNode.connect(pulseModGain);
        pulseModGain.connect(mainOsc.frequency);
        pulseModGain.connect(subOsc.frequency);

        mainOsc.connect(filter);
        subOsc.connect(filter);
        subHum.connect(filter);

        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        mainOsc.start();
        subOsc.start();
        subHum.start();
        pulseModNode.start();

        gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.2);
        setAudioFeedbackOn(ctx.state === "running");
      } catch (e) {
        console.warn("Failed to construct Web Audio engine synthesizer context:", e);
      }
    };

    if (isEngineSoundActive) {
      setupAudio();
    }

    const handleUserInteractionStart = () => {
      const ctx = audioContextRef.current;
      if (ctx) {
        if (ctx.state === "suspended") {
          ctx.resume().then(() => {
            setAudioFeedbackOn(true);
          });
        } else if (ctx.state === "running") {
          setAudioFeedbackOn(true);
        }
      } else if (isEngineSoundActive) {
        setupAudio();
      }
    };

    window.addEventListener("click", handleUserInteractionStart);
    window.addEventListener("pointerdown", handleUserInteractionStart);
    
    return () => {
      window.removeEventListener("click", handleUserInteractionStart);
      window.removeEventListener("pointerdown", handleUserInteractionStart);

      try {
        if (mainOscRef.current) mainOscRef.current.stop();
        if (subOscRef.current) subOscRef.current.stop();
        if (subHumRef.current) subHumRef.current.stop();
        if (modOscRef.current) modOscRef.current.stop();
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      } catch (err) {}
      audioContextRef.current = null;
      mainOscRef.current = null;
      subOscRef.current = null;
      subHumRef.current = null;
      modOscRef.current = null;
      setAudioFeedbackOn(false);
    };
  }, [car, isEngineSoundActive]);


  useEffect(() => {
    if (!canvasRef.current || !mountRef.current) return;

    const width = mountRef.current.clientWidth || 500;
    const height = mountRef.current.clientHeight || 300;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0c0c0e");
    scene.fog = new THREE.FogExp2("#0c0c0e", 0.08);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 5.5);
    camera.lookAt(0, 0.3, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. Lights setup
    const ambientLight = new THREE.AmbientLight("#22222b", 0.6);
    scene.add(ambientLight);

    // Spotlight pointing at the car for premium focus reflections
    const spotlight = new THREE.SpotLight("#ffffff", 12);
    spotlight.position.set(2, 5, 4);
    spotlight.target.position.set(0, 0.3, 0);
    spotlight.castShadow = true;
    spotlight.shadow.bias = -0.001;
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;
    scene.add(spotlight);

    // Dynamic colored keylight matching car color or yellow accent
    const coloredLight = new THREE.DirectionalLight(car.color, 2.5);
    coloredLight.position.set(-3, 3, -1);
    scene.add(coloredLight);

    // Underlight from the grid
    const underlight = new THREE.DirectionalLight("#eab308", 0.8);
    underlight.position.set(0, -2, 0);
    scene.add(underlight);

    // 5. Create Exhibition Podium
    const podiumGroup = new THREE.Group();
    
    // Core base disk
    const podiumGeometry = new THREE.CylinderGeometry(2.0, 2.1, 0.15, 32);
    const podiumMaterial = new THREE.MeshStandardMaterial({
      color: "#16161a",
      roughness: 0.5,
      metalness: 0.8,
    });
    const podium = new THREE.Mesh(podiumGeometry, podiumMaterial);
    podium.receiveShadow = true;
    podiumGroup.add(podium);

    // Glowing neon rim border on podium
    const glowRingGeom = new THREE.CylinderGeometry(2.02, 2.02, 0.05, 32, 1, true);
    const glowRingMat = new THREE.MeshBasicMaterial({
      color: "#eab308",
      side: THREE.BackSide,
    });
    const glowRing = new THREE.Mesh(glowRingGeom, glowRingMat);
    glowRing.position.y = 0.04;
    podiumGroup.add(glowRing);

    scene.add(podiumGroup);

    // 6. Build Sports 3D Car Model procedurally
    const carGroup = new THREE.Group();
    carGroup.position.set(0, 0.08, 0); // rest on podium
    carGroupRef.current = carGroup;

    // Body Material (Metallic High Gloss lacquer styling)
    const bodyColorHex = car.color.startsWith("#") ? car.color : `#${car.color}`;
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(bodyColorHex),
      metalness: 0.9,
      roughness: 0.15,
    });

    const accentColorHex = car.accentColor.startsWith("#") ? car.accentColor : `#${car.accentColor}`;
    const trimMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColorHex),
      metalness: 0.8,
      roughness: 0.3,
    });

    const carbonMaterial = new THREE.MeshStandardMaterial({
      color: "#111111",
      metalness: 0.9,
      roughness: 0.6,
    });

    const glassMaterial = new THREE.MeshStandardMaterial({
      color: "#0c1220",
      metalness: 0.9,
      roughness: 0.05,
    });

    // Lower chassis base
    const chassisGeom = new THREE.BoxGeometry(2.2, 0.25, 0.95);
    const chassis = new THREE.Mesh(chassisGeom, bodyMaterial);
    chassis.position.y = 0.2;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    carGroup.add(chassis);

    // Sleek cockpit glass dome cabin
    const cabinGeom = new THREE.BoxGeometry(1.0, 0.32, 0.8);
    const cabin = new THREE.Mesh(cabinGeom, glassMaterial);
    cabin.position.set(-0.15, 0.44, 0);
    cabin.castShadow = true;
    carGroup.add(cabin);

    // Aerodynamic slanted hood wedge (front)
    const hoodGeom = new THREE.BoxGeometry(0.7, 0.18, 0.91);
    const hood = new THREE.Mesh(hoodGeom, bodyMaterial);
    hood.position.set(1.1 - 0.35, 0.23, 0);
    // Rotate to slant slightly forward
    hood.rotation.z = -0.06;
    hood.castShadow = true;
    carGroup.add(hood);

    // Front spoiler splitter lip (accent color)
    const splitterGeom = new THREE.BoxGeometry(0.22, 0.06, 0.98);
    const splitter = new THREE.Mesh(splitterGeom, trimMaterial);
    splitter.position.set(1.15, 0.11, 0);
    splitter.castShadow = true;
    carGroup.add(splitter);

    // Front headlights (twin laser LED slots)
    const headGeom = new THREE.BoxGeometry(0.04, 0.06, 0.2);
    const headLampMat = new THREE.MeshBasicMaterial({ color: "#ffffff" });
    const headL1 = new THREE.Mesh(headGeom, headLampMat);
    headL1.position.set(1.1, 0.22, 0.32);
    const headL2 = new THREE.Mesh(headGeom, headLampMat);
    headL2.position.set(1.1, 0.22, -0.32);
    carGroup.add(headL1);
    carGroup.add(headL2);

    // LED Taillights (glow blocks)
    const tailGeom = new THREE.BoxGeometry(0.04, 0.05, 0.4);
    const brakeLampMat = new THREE.MeshBasicMaterial({ color: "#ff1818" });
    const tailLamp = new THREE.Mesh(tailGeom, brakeLampMat);
    tailLamp.position.set(-1.11, 0.27, 0);
    carGroup.add(tailLamp);

    // Exhaust tailpipes
    const exhaustGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.2, 8);
    exhaustGeom.rotateZ(Math.PI / 2);
    const exhaustMaterial = new THREE.MeshStandardMaterial({ color: "#444", metalness: 1 });
    const ex1 = new THREE.Mesh(exhaustGeom, exhaustMaterial);
    ex1.position.set(-1.12, 0.17, 0.18);
    const ex2 = new THREE.Mesh(exhaustGeom, exhaustMaterial);
    ex2.position.set(-1.12, 0.17, -0.18);
    carGroup.add(ex1);
    carGroup.add(ex2);

    // 4 Sport Wheels with Silver Rim hubcaps
    const wheelGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.2, 16);
    wheelGeom.rotateX(Math.PI / 2); // rotate cylinder to stand vertically
    const tireMaterial = new THREE.MeshStandardMaterial({ color: "#161618", roughness: 0.9 });
    const rimsMaterial = new THREE.MeshStandardMaterial({ color: "#bbbbcc", metalness: 0.9, roughness: 0.1 });

    const wheelHubGeom = new THREE.CylinderGeometry(0.14, 0.14, 0.21, 12);
    wheelHubGeom.rotateX(Math.PI / 2);

    const spawnWheel = (x: number, z: number) => {
      const wheelAssembly = new THREE.Group();
      wheelAssembly.position.set(x, 0.18, z);

      const tire = new THREE.Mesh(wheelGeom, tireMaterial);
      tire.castShadow = true;
      wheelAssembly.add(tire);

      const rim = new THREE.Mesh(wheelHubGeom, rimsMaterial);
      wheelAssembly.add(rim);

      carGroup.add(wheelAssembly);
      wheelsRef.current.push(tire); // track mesh for rotation animation
    };

    // Staggered layout wheels
    spawnWheel(0.68, 0.46);   // Front Left
    spawnWheel(0.68, -0.46);  // Front Right
    spawnWheel(-0.68, 0.46);  // Back Left
    spawnWheel(-0.68, -0.46); // Back Right

    // 7. Dynamic 3D Spoiler based on Aerodynamics level!
    const aeroLevel = car.upgrades.aerodynamics;
    const spoilerGroup = new THREE.Group();
    spoilerGroup.position.set(-0.95, 0.35, 0);

    // Spoiler vertical struts
    const strutGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.26, 8);
    const strutL = new THREE.Mesh(strutGeom, carbonMaterial);
    strutL.position.z = 0.25;
    const strutR = new THREE.Mesh(strutGeom, carbonMaterial);
    strutR.position.z = -0.25;
    spoilerGroup.add(strutL);
    spoilerGroup.add(strutR);

    // Spoiler horizontal wing blade
    // Width and height scales dynamically on aerodynamic upgrade tier levels (0 to 4)!
    const bladeWidth = 0.15;
    const bladeBreadth = 0.82 + (aeroLevel * 0.08); // grows on levels
    const bladeThickness = 0.03 + (aeroLevel * 0.005);
    const bladeGeom = new THREE.BoxGeometry(bladeWidth, bladeThickness, bladeBreadth);
    const blade = new THREE.Mesh(bladeGeom, carbonMaterial);
    blade.position.y = 0.13;
    blade.castShadow = true;
    spoilerGroup.add(blade);

    // Side plates
    const plateGeom = new THREE.BoxGeometry(0.18, 0.1, 0.015);
    const plateL = new THREE.Mesh(plateGeom, trimMaterial);
    plateL.position.set(0, 0.13, bladeBreadth / 2);
    const plateR = new THREE.Mesh(plateGeom, trimMaterial);
    plateR.position.set(0, 0.13, -bladeBreadth / 2);
    spoilerGroup.add(plateL);
    spoilerGroup.add(plateR);

    carGroup.add(spoilerGroup);
    spoilerRef.current = spoilerGroup;

    scene.add(carGroup);

    // 8. Animation Cycle & Interaction Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Automatically revolve car platform slowly if not dragging actively
      if (!isDragging && carGroupRef.current) {
        carGroupRef.current.rotation.y += 0.45 * delta;
      }

      // Rotate tires slightly to simulate scrolling momentum
      wheelsRef.current.forEach((wheel) => {
        wheel.rotation.z -= (isDragging ? 0 : 0.8) * delta;
      });

      // Ambient suspension bounce animation (sporty vibe)
      if (carGroupRef.current) {
        carGroupRef.current.position.y = 0.08 + Math.sin(elapsed * 2.8) * 0.005;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize render
    animate();

    // 9. Resize observer pattern for smooth responsive layouts
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (!canvasRef.current || !mountRef.current) continue;
        const currentW = mountRef.current.clientWidth || width;
        const currentH = mountRef.current.clientHeight || height;
        
        camera.aspect = currentW / currentH;
        camera.updateProjectionMatrix();
        renderer.setSize(currentW, currentH);
      }
    });
    resizeObserver.observe(mountRef.current);

    // 10. Clean up everything on destruction to prevent memory overload leaks
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      
      // Dipose geometries
      podiumGeometry.dispose();
      glowRingGeom.dispose();
      chassisGeom.dispose();
      cabinGeom.dispose();
      hoodGeom.dispose();
      splitterGeom.dispose();
      headGeom.dispose();
      tailGeom.dispose();
      exhaustGeom.dispose();
      wheelGeom.dispose();
      wheelHubGeom.dispose();
      strutGeom.dispose();
      bladeGeom.dispose();
      plateGeom.dispose();

      // Dispose materials
      podiumMaterial.dispose();
      glowRingMat.dispose();
      bodyMaterial.dispose();
      trimMaterial.dispose();
      carbonMaterial.dispose();
      glassMaterial.dispose();
      headLampMat.dispose();
      brakeLampMat.dispose();
      exhaustMaterial.dispose();
      tireMaterial.dispose();
      rimsMaterial.dispose();

      renderer.dispose();
    };
  }, [car, isDragging]);

  // Pointer drag to spin vehicle
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    previousMousePosition.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !carGroupRef.current) return;

    const deltaMove = {
      x: e.clientX - previousMousePosition.current.x,
      y: e.clientY - previousMousePosition.current.y,
    };

    // Spin car group on Y axis based on mouse shift
    carGroupRef.current.rotation.y += deltaMove.x * 0.008;

    previousMousePosition.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={mountRef}
      className="w-full h-full relative cursor-grab active:cursor-grabbing select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      
      {/* Dynamic Showroom Audio Equalizer / Mute Toggle Widget */}
      <button
        type="button"
        onClick={toggleEngineSound}
        className={`absolute top-4 right-4 px-3 py-1.5 flex items-center gap-2 border transition-all z-20 cursor-pointer text-[10px] font-mono tracking-wider select-none ${
          isEngineSoundActive && audioFeedbackOn
            ? "bg-black/80 text-yellow-500 border-yellow-500/50 shadow-[0_0_12px_rgba(234,179,8,0.2)] hover:bg-yellow-500 hover:text-black hover:border-yellow-400"
            : "bg-black/75 text-gray-500 border-white/10 hover:bg-white/5 hover:text-white hover:border-white/20"
        }`}
        title={isEngineSoundActive ? "Mute Exhaust Sound" : "Enable Exhaust Sound"}
      >
        <div className="flex gap-0.5 items-end justify-center h-3.5 w-4 shrink-0 pb-0.5">
          {isEngineSoundActive && audioFeedbackOn ? (
            <>
              <span className="w-0.5 bg-current animate-audio-bar-1"></span>
              <span className="w-0.5 bg-current animate-audio-bar-2"></span>
              <span className="w-0.5 bg-current animate-audio-bar-3"></span>
            </>
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-current" />
          )}
        </div>
        <span>
          {isEngineSoundActive && audioFeedbackOn 
            ? `IDLE RUNNING (${car.class === "S" ? "720" : car.class === "A" ? "840" : "680"} RPM)` 
            : isEngineSoundActive 
            ? "CLICK TO STARTS EXHAUST IDLE" 
            : "IDLE CONTROLS INACTIVE"}
        </span>
      </button>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 border border-white/10 px-2 py-1 flex items-center gap-1.5 pointer-events-none text-[9px] font-mono tracking-widest text-gray-400 uppercase">
        <span>↔</span>
        <span>DRAG TO ROTATE 3D PLATFORM</span>
      </div>
    </div>
  );
}
