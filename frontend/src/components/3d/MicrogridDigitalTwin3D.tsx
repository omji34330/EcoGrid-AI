import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import {
  Rotate3d,
  Sun,
  Wind,
  BatteryCharging,
  Sparkles,
  Layers,
} from 'lucide-react';
import type { LiveTelemetry } from '../../types';

interface MicrogridDigitalTwin3DProps {
  telemetry: LiveTelemetry | null;
}

type CameraPreset = 'isometric' | 'solar' | 'turbine' | 'battery';

export const MicrogridDigitalTwin3D: React.FC<MicrogridDigitalTwin3DProps> = ({ telemetry }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activePreset, setActivePreset] = useState<CameraPreset>('isometric');
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // References to animated 3D objects
  const rotorRef = useRef<THREE.Group | null>(null);
  const batteryCoreRef = useRef<THREE.Mesh | null>(null);
  const energyParticlesRef = useRef<THREE.Points | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(12, 10, 12));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 1, 0));
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 1, 0));

  // Mouse interaction state
  const isDragging = useRef<boolean>(false);
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const spherical = useRef<{ radius: number; theta: number; phi: number }>({
    radius: 17,
    theta: Math.PI / 4,
    phi: Math.PI / 3,
  });

  // Camera presets coordinates
  const applyCameraPreset = useCallback((preset: CameraPreset) => {
    setActivePreset(preset);
    setAutoRotate(false);
    if (!cameraRef.current) return;

    switch (preset) {
      case 'isometric':
        spherical.current = { radius: 17, theta: Math.PI / 4, phi: Math.PI / 3 };
        targetLookAt.current.set(0, 1.5, 0);
        break;
      case 'solar':
        spherical.current = { radius: 8, theta: Math.PI * 0.85, phi: Math.PI / 3.2 };
        targetLookAt.current.set(-3.5, 1, 0);
        break;
      case 'turbine':
        spherical.current = { radius: 9, theta: Math.PI * 0.15, phi: Math.PI / 2.6 };
        targetLookAt.current.set(3.5, 3.5, 0);
        break;
      case 'battery':
        spherical.current = { radius: 6.5, theta: -Math.PI * 0.4, phi: Math.PI / 2.8 };
        targetLookAt.current.set(0, 1, 2.5);
        break;
    }
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x040914, 0.025);

    // 2. Camera Setup
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;
    camera.position.set(12, 10, 12);
    camera.lookAt(0, 1, 0);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x0f2b3c, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff3d1, 2.2);
    sunLight.position.set(15, 20, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);

    const cyanFillLight = new THREE.PointLight(0x06b6d4, 3, 20);
    cyanFillLight.position.set(-6, 4, -4);
    scene.add(cyanFillLight);

    const emeraldFillLight = new THREE.PointLight(0x10b981, 3, 20);
    emeraldFillLight.position.set(4, 3, 4);
    scene.add(emeraldFillLight);

    // 5. Ground Cyber-Grid
    const gridHelper = new THREE.GridHelper(26, 26, 0x06b6d4, 0x0f2b3c);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Concentric Energy Pulse Rings on ground
    const ringGeo = new THREE.RingGeometry(0.2, 11, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.01;
    scene.add(ringMesh);

    // 6. ASSET 1: Wind Turbine (Rated 3.0 kW)
    const turbineGroup = new THREE.Group();
    turbineGroup.position.set(3.5, 0, -1);

    // Tower
    const towerGeo = new THREE.CylinderGeometry(0.12, 0.28, 5.5, 16);
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.8,
      roughness: 0.25,
      wireframe: wireframeMode,
    });
    const tower = new THREE.Mesh(towerGeo, metalMat);
    tower.position.y = 2.75;
    tower.castShadow = true;
    tower.receiveShadow = true;
    turbineGroup.add(tower);

    // Base collar
    const collarGeo = new THREE.CylinderGeometry(0.4, 0.5, 0.2, 16);
    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.3,
    });
    const collar = new THREE.Mesh(collarGeo, darkMetalMat);
    collar.position.y = 0.1;
    turbineGroup.add(collar);

    // Nacelle
    const nacelleGeo = new THREE.BoxGeometry(0.5, 0.4, 0.8);
    const nacelle = new THREE.Mesh(nacelleGeo, metalMat);
    nacelle.position.set(0, 5.5, 0.1);
    nacelle.castShadow = true;
    turbineGroup.add(nacelle);

    // Rotor Hub & Blades
    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(0, 5.5, 0.55);

    const hubGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const hubMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.9, roughness: 0.1 });
    const hub = new THREE.Mesh(hubGeo, hubMat);
    rotorGroup.add(hub);

    // 3 Aerodynamic Blades
    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI) / 3;
      const bladePivot = new THREE.Group();
      bladePivot.rotation.z = angle;

      const bladeGeo = new THREE.BoxGeometry(0.12, 2.2, 0.04);
      const bladeMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        metalness: 0.5,
        roughness: 0.2,
      });
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.y = 1.1;
      blade.castShadow = true;
      bladePivot.add(blade);

      rotorGroup.add(bladePivot);
    }

    turbineGroup.add(rotorGroup);
    rotorRef.current = rotorGroup;
    scene.add(turbineGroup);

    // 7. ASSET 2: Solar PV Array (5.0 kW Bifacial Array)
    const solarGroup = new THREE.Group();
    solarGroup.position.set(-3.5, 0, 0);

    const panelRows = 3;
    const panelCols = 3;
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x082f49,
      emissive: 0x0284c7,
      emissiveIntensity: 0.25,
      metalness: 0.85,
      roughness: 0.15,
      wireframe: wireframeMode,
    });
    const panelFrameMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.4 });

    for (let r = 0; r < panelRows; r++) {
      for (let c = 0; c < panelCols; c++) {
        const singlePanel = new THREE.Group();
        singlePanel.position.set((c - 1) * 1.5, 0, (r - 1) * 1.4);

        // Frame
        const frameGeo = new THREE.BoxGeometry(1.2, 0.04, 0.9);
        const frame = new THREE.Mesh(frameGeo, panelFrameMat);
        singlePanel.add(frame);

        // Photovoltaic Wafer Cells
        const cellGeo = new THREE.BoxGeometry(1.12, 0.05, 0.82);
        const cell = new THREE.Mesh(cellGeo, panelMat);
        cell.castShadow = true;
        singlePanel.add(cell);

        // Tilted mount (25° tilt facing south)
        singlePanel.rotation.x = -Math.PI * 0.15;
        singlePanel.position.y = 0.55;

        // Support Post
        const postGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8);
        const post = new THREE.Mesh(postGeo, panelFrameMat);
        post.position.set((c - 1) * 1.5, 0.3, (r - 1) * 1.4);
        solarGroup.add(post);

        solarGroup.add(singlePanel);
      }
    }
    scene.add(solarGroup);

    // 8. ASSET 3: Battery Energy Storage System (BESS 10 kWh)
    const bessGroup = new THREE.Group();
    bessGroup.position.set(0, 0, 2.5);

    // Outer Enclosure (Industrial Cabinet)
    const cabinetGeo = new THREE.BoxGeometry(1.8, 1.3, 1.2);
    const cabinetMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.9,
      wireframe: wireframeMode,
    });
    const cabinet = new THREE.Mesh(cabinetGeo, cabinetMat);
    cabinet.position.y = 0.65;
    cabinet.castShadow = true;
    bessGroup.add(cabinet);

    // Glowing Inner Battery Cells (Pulsing Core)
    const coreGeo = new THREE.BoxGeometry(1.5, 1.0, 0.9);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.85,
    });
    const batteryCore = new THREE.Mesh(coreGeo, coreMat);
    batteryCore.position.y = 0.65;
    batteryCoreRef.current = batteryCore;
    bessGroup.add(batteryCore);

    // Cabinet Status Lights
    const ledGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    for (let l = 0; l < 4; l++) {
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(-0.6 + l * 0.4, 1.2, 0.61);
      bessGroup.add(led);
    }
    scene.add(bessGroup);

    // 9. ASSET 4: Smart Bi-Directional Inverter & Campus Building
    const campusGroup = new THREE.Group();
    campusGroup.position.set(0, 0, -3.5);

    // Building 1 (Academic Complex)
    const bldg1Geo = new THREE.BoxGeometry(2.4, 3.2, 1.8);
    const bldgMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.3,
      roughness: 0.7,
      wireframe: wireframeMode,
    });
    const bldg1 = new THREE.Mesh(bldg1Geo, bldgMat);
    bldg1.position.y = 1.6;
    bldg1.castShadow = true;
    bldg1.receiveShadow = true;
    campusGroup.add(bldg1);

    // Glowing Architectural Windows
    const winGeo = new THREE.PlaneGeometry(0.2, 0.35);
    const winMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 });
    for (let floor = 0; floor < 3; floor++) {
      for (let col = 0; col < 4; col++) {
        const windowMesh = new THREE.Mesh(winGeo, winMat);
        windowMesh.position.set(-0.75 + col * 0.5, 0.8 + floor * 0.9, 0.91);
        campusGroup.add(windowMesh);
      }
    }

    // Inverter Cabinet near the building
    const invGeo = new THREE.BoxGeometry(0.8, 1.0, 0.5);
    const invMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.8, roughness: 0.2 });
    const inverter = new THREE.Mesh(invGeo, invMat);
    inverter.position.set(1.6, 0.5, 0);
    campusGroup.add(inverter);

    scene.add(campusGroup);

    // 10. Floating 3D Energy Conduit Curves & Glowing Particle Streams
    const curvePointsSolarToCenter = [
      new THREE.Vector3(-3.5, 0.5, 0),
      new THREE.Vector3(-1.8, 1.2, 0),
      new THREE.Vector3(0, 0.8, 0),
    ];
    const curvePointsWindToCenter = [
      new THREE.Vector3(3.5, 0.5, -1),
      new THREE.Vector3(1.8, 1.2, -0.5),
      new THREE.Vector3(0, 0.8, 0),
    ];
    const curvePointsCenterToBess = [
      new THREE.Vector3(0, 0.8, 0),
      new THREE.Vector3(0, 1.0, 1.2),
      new THREE.Vector3(0, 0.65, 2.5),
    ];
    const curvePointsCenterToCampus = [
      new THREE.Vector3(0, 0.8, 0),
      new THREE.Vector3(0, 1.2, -1.8),
      new THREE.Vector3(0, 0.65, -3.5),
    ];

    const curves = [
      new THREE.CatmullRomCurve3(curvePointsSolarToCenter),
      new THREE.CatmullRomCurve3(curvePointsWindToCenter),
      new THREE.CatmullRomCurve3(curvePointsCenterToBess),
      new THREE.CatmullRomCurve3(curvePointsCenterToCampus),
    ];

    curves.forEach((curve) => {
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.025, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.25 });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tubeMesh);
    });

    // Particle Streams
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleProgress = new Float32Array(particleCount);
    const particleCurves = new Uint8Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particleProgress[i] = Math.random();
      particleCurves[i] = Math.floor(Math.random() * curves.length);
      const pt = curves[particleCurves[i]].getPoint(particleProgress[i]);
      particlePositions[i * 3] = pt.x;
      particlePositions[i * 3 + 1] = pt.y;
      particlePositions[i * 3 + 2] = pt.z;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.12,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    energyParticlesRef.current = particles;

    // 11. Interactive Drag / Orbit Handlers
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
      setAutoRotate(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      spherical.current.theta -= deltaX * 0.008;
      spherical.current.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, spherical.current.phi - deltaY * 0.008));

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.current.radius = Math.max(5, Math.min(30, spherical.current.radius + e.deltaY * 0.015));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElement.addEventListener('wheel', handleWheel, { passive: false });

    // Touch support for mobile devices
    let touchStartDist = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        setAutoRotate(false);
      } else if (e.touches.length === 2) {
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging.current) {
        const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.current.y;
        spherical.current.theta -= deltaX * 0.008;
        spherical.current.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, spherical.current.phi - deltaY * 0.008));
        previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const diff = touchStartDist - currentDist;
        spherical.current.radius = Math.max(5, Math.min(30, spherical.current.radius + diff * 0.05));
        touchStartDist = currentDist;
      }
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    domElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    domElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    domElement.addEventListener('touchend', handleTouchEnd);

    // 12. Main Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Auto-rotation when not interacting
      if (autoRotate && !isDragging.current) {
        spherical.current.theta += delta * 0.12;
      }

      // Convert spherical coordinates to cartesian camera position
      const sinPhi = Math.sin(spherical.current.phi);
      const cosPhi = Math.cos(spherical.current.phi);
      const sinTheta = Math.sin(spherical.current.theta);
      const cosTheta = Math.cos(spherical.current.theta);

      targetCamPos.current.x = spherical.current.radius * sinPhi * sinTheta;
      targetCamPos.current.y = spherical.current.radius * cosPhi;
      targetCamPos.current.z = spherical.current.radius * sinPhi * cosTheta;

      // Smooth camera interpolation
      camera.position.lerp(targetCamPos.current, 0.06);
      currentLookAt.current.lerp(targetLookAt.current, 0.06);
      camera.lookAt(currentLookAt.current);

      // Rotate Wind Turbine based on live wind speed (km/h)
      if (rotorRef.current) {
        const windKmh = telemetry?.windSpeed ?? 14.2;
        const spinVelocity = Math.max(0.2, (windKmh / 15) * 2.8);
        rotorRef.current.rotation.z += spinVelocity * delta;
      }

      // Pulse Battery Storage Core based on battery status and SOC
      if (batteryCoreRef.current) {
        const socPct = telemetry?.batterySocPct ?? 76;
        const pulseSpeed = telemetry?.batteryStatus === 'charging' ? 4 : 2;
        const pulse = Math.sin(elapsedTime * pulseSpeed) * 0.2 + 0.8;
        const coreMaterial = batteryCoreRef.current.material as THREE.MeshStandardMaterial;

        // Dynamic color: emerald if SOC > 50, amber if SOC < 30
        if (socPct > 45) {
          coreMaterial.emissive.setHex(0x10b981);
        } else if (socPct > 20) {
          coreMaterial.emissive.setHex(0xf59e0b);
        } else {
          coreMaterial.emissive.setHex(0xef4444);
        }
        coreMaterial.emissiveIntensity = pulse * (socPct / 100);
      }

      // Animate flowing energy particles through conduits
      if (energyParticlesRef.current) {
        const positions = energyParticlesRef.current.geometry.attributes.position.array as Float32Array;
        const particleSpeed = 0.25;

        for (let i = 0; i < particleCount; i++) {
          particleProgress[i] = (particleProgress[i] + delta * particleSpeed) % 1;
          const curveIdx = particleCurves[i];
          const point = curves[curveIdx].getPoint(particleProgress[i]);
          positions[i * 3] = point.x;
          positions[i * 3 + 1] = point.y;
          positions[i * 3 + 2] = point.z;
        }
        energyParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 13. Responsive Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });

    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('wheel', handleWheel);
      domElement.removeEventListener('touchstart', handleTouchStart);
      domElement.removeEventListener('touchmove', handleTouchMove);
      domElement.removeEventListener('touchend', handleTouchEnd);
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
      renderer.dispose();
    };
  }, [telemetry, wireframeMode, autoRotate]);

  return (
    <div className="relative glass-panel overflow-hidden border-cyan-500/20 bg-gradient-to-b from-[#081220]/90 to-[#030712]/95 shadow-2xl">
      {/* 3D Header Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2.5 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 pointer-events-auto">
          <Rotate3d className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              3D Microgrid Digital Twin
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </span>
            <span className="text-[10px] text-slate-400">Interactive WebGL Physics View</span>
          </div>
        </div>

        {/* View Controls & Presets */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => applyCameraPreset('isometric')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activePreset === 'isometric'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => applyCameraPreset('solar')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activePreset === 'solar'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Solar
            </button>
            <button
              onClick={() => applyCameraPreset('turbine')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activePreset === 'turbine'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Turbine
            </button>
            <button
              onClick={() => applyCameraPreset('battery')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activePreset === 'battery'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              BESS
            </button>
          </div>

          {/* Wireframe Mode Toggle */}
          <button
            onClick={() => setWireframeMode((prev) => !prev)}
            title="Toggle 3D Wireframe Mesh"
            className={`p-2 rounded-xl border transition-all ${
              wireframeMode
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {/* Auto-Rotate Toggle */}
          <button
            onClick={() => setAutoRotate((prev) => !prev)}
            title="Toggle Cinematic Auto-Orbit"
            className={`p-2 rounded-xl border transition-all ${
              autoRotate
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Rotate3d className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-[420px] sm:h-[480px] lg:h-[540px] cursor-grab active:cursor-grabbing touch-none select-none"
      />

      {/* Interactive Telemetry Overlay (Bottom Bar) */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pointer-events-auto">
          {/* Solar Live Badge */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => applyCameraPreset('solar')}
            className="cursor-pointer p-3 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-amber-500/25 hover:border-amber-500/50 shadow-lg"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-amber-300">
                <Sun className="w-3.5 h-3.5" />
                Solar PV Array
              </span>
              <span className="text-[10px] text-slate-500">5 kW</span>
            </div>
            <div className="text-lg font-extrabold text-white mt-1">
              {telemetry?.solarOutputKw ?? 3.45}{' '}
              <span className="text-xs font-semibold text-slate-400">kW</span>
            </div>
            <div className="text-[10px] text-amber-400/90 font-medium">Bifacial tilt 25° South</div>
          </motion.div>

          {/* Wind Turbine Live Badge */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => applyCameraPreset('turbine')}
            className="cursor-pointer p-3 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-sky-500/25 hover:border-sky-500/50 shadow-lg"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-sky-300">
                <Wind className="w-3.5 h-3.5" />
                Wind Turbine
              </span>
              <span className="text-[10px] text-slate-500">3 kW</span>
            </div>
            <div className="text-lg font-extrabold text-white mt-1">
              {telemetry?.windOutputKw ?? 1.2}{' '}
              <span className="text-xs font-semibold text-slate-400">kW</span>
            </div>
            <div className="text-[10px] text-sky-400/90 font-medium">
              Spinning @ {telemetry?.windSpeed ?? 14.2} km/h
            </div>
          </motion.div>

          {/* BESS Battery Live Badge */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => applyCameraPreset('battery')}
            className="cursor-pointer p-3 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-emerald-500/25 hover:border-emerald-500/50 shadow-lg"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-300">
                <BatteryCharging className="w-3.5 h-3.5" />
                BESS Battery
              </span>
              <span className="text-[10px] text-slate-500">10 kWh</span>
            </div>
            <div className="text-lg font-extrabold text-white mt-1">
              {telemetry?.batterySocPct ?? 76.4}%{' '}
              <span className="text-xs font-semibold text-emerald-400">
                ({telemetry?.batteryStatus ?? 'charging'})
              </span>
            </div>
            <div className="text-[10px] text-emerald-400/90 font-medium">LiFePO₄ core active</div>
          </motion.div>

          {/* Interaction Tip */}
          <div className="p-3 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-white/10 flex flex-col justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D Orbit Navigation</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-snug">
              Drag mouse or swipe to rotate 360° • Scroll to zoom in/out • Click badges to focus components
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
