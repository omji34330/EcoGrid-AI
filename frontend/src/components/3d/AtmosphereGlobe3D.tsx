import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MapPin } from 'lucide-react';

interface AtmosphereGlobe3DProps {
  latitude?: number;
  longitude?: number;
  locationName?: string;
}

export const AtmosphereGlobe3D: React.FC<AtmosphereGlobe3DProps> = ({
  latitude = 26.4499,
  longitude = 80.3319,
  locationName = 'Kanpur, UP',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // Scene, Camera & Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Inner Sphere (Core Planet)
    const sphereGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x071526,
      metalness: 0.8,
      roughness: 0.3,
      transparent: true,
      opacity: 0.9,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphere);

    // 2. Wireframe Atmospheric Grid
    const wireGeo = new THREE.SphereGeometry(1.52, 24, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const wireframeSphere = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireframeSphere);

    // 3. Glowing Atmospheric Halo (Outer Ring)
    const haloGeo = new THREE.RingGeometry(1.65, 1.95, 36);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 3;
    globeGroup.add(halo);

    // 4. Coordinates to 3D Sphere Position (Kanpur Lat/Long)
    const phi = (90 - latitude) * (Math.PI / 180);
    const theta = (longitude + 180) * (Math.PI / 180);

    const pinRadius = 1.54;
    const pinX = -(pinRadius * Math.sin(phi) * Math.cos(theta));
    const pinZ = pinRadius * Math.sin(phi) * Math.sin(theta);
    const pinY = pinRadius * Math.cos(phi);

    // Glowing Node Pin
    const pinGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    pinMesh.position.set(pinX, pinY, pinZ);
    globeGroup.add(pinMesh);

    // Radiating Beacon Ring
    const beaconRingGeo = new THREE.RingGeometry(0.08, 0.18, 16);
    const beaconRingMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
    const beaconRing = new THREE.Mesh(beaconRingGeo, beaconRingMat);
    beaconRing.position.set(pinX * 1.01, pinY * 1.01, pinZ * 1.01);
    beaconRing.lookAt(pinX * 2, pinY * 2, pinZ * 2);
    globeGroup.add(beaconRing);

    // 5. Orbiting Clean Energy Satellites
    const satCount = 18;
    const satGeo = new THREE.BufferGeometry();
    const satPositions = new Float32Array(satCount * 3);
    const satAngles = new Float32Array(satCount);
    const satRadii = new Float32Array(satCount);

    for (let i = 0; i < satCount; i++) {
      satAngles[i] = (i * 2 * Math.PI) / satCount;
      satRadii[i] = 1.85 + Math.random() * 0.3;
      satPositions[i * 3] = satRadii[i] * Math.cos(satAngles[i]);
      satPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
      satPositions[i * 3 + 2] = satRadii[i] * Math.sin(satAngles[i]);
    }
    satGeo.setAttribute('position', new THREE.BufferAttribute(satPositions, 3));
    const satMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
    });
    const satellites = new THREE.Points(satGeo, satMat);
    scene.add(satellites);

    // 6. Lighting
    const pointLight = new THREE.PointLight(0x06b6d4, 2, 10);
    pointLight.position.set(4, 3, 4);
    scene.add(pointLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(-4, 5, 5);
    scene.add(dirLight);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Gentle rotation
      globeGroup.rotation.y += delta * 0.25;

      // Pulse beacon ring
      const scale = 1 + Math.sin(elapsed * 4) * 0.3;
      beaconRing.scale.set(scale, scale, scale);

      // Rotate satellites around planet
      satellites.rotation.y -= delta * 0.35;
      satellites.rotation.x = Math.sin(elapsed * 0.5) * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 300;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [latitude, longitude]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div ref={mountRef} className="w-56 h-56 sm:w-64 sm:h-64 pointer-events-none select-none" />
      <div className="absolute bottom-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-[11px] text-cyan-300 font-semibold shadow-lg">
        <MapPin className="w-3 h-3 text-emerald-400 animate-bounce" />
        <span>{locationName}</span>
        <span className="text-[10px] text-slate-400">({latitude.toFixed(2)}°N, {longitude.toFixed(2)}°E)</span>
      </div>
    </div>
  );
};
