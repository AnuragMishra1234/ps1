import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export function ResearchVessel() {
  const vesselGroup = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (vesselGroup.current) {
      // Subtle surface swell pitch & roll
      const t = state.clock.elapsedTime * 0.7;
      vesselGroup.current.position.y = 11.8 + Math.sin(t) * 0.12;
      vesselGroup.current.rotation.z = Math.sin(t * 0.8) * 0.02;
      vesselGroup.current.rotation.x = Math.cos(t * 0.6) * 0.015;
    }
  });

  return (
    <group ref={vesselGroup} position={[0, 11.8, 0]}>
      {/* Surface Water Line / Interface Plane */}
      <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[48, 48]} />
        <meshBasicMaterial
          color="#06284a"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main Research Vessel Hull */}
      <group position={[0, 0.5, 0]}>
        {/* Main hull body */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[4.2, 1.4, 11.5]} />
          <meshStandardMaterial color="#1a2b42" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Bow wedge */}
        <mesh position={[0, 0, 6.2]} rotation={[0, 0, 0]} castShadow>
          <coneGeometry args={[2.1, 2.2, 4]} />
          <meshStandardMaterial color="#142236" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Superstructure bridge */}
        <mesh position={[0, 1.3, -1.5]} castShadow>
          <boxGeometry args={[3.2, 1.4, 4.0]} />
          <meshStandardMaterial color="#2d3f56" roughness={0.5} metalness={0.4} />
        </mesh>

        {/* Bridge windows */}
        <mesh position={[0, 1.5, 0.55]}>
          <boxGeometry args={[2.8, 0.4, 0.2]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} emissive="#0284c7" emissiveIntensity={0.3} />
        </mesh>

        {/* Mast & Radar */}
        <mesh position={[0, 2.6, -1.2]}>
          <cylinderGeometry args={[0.08, 0.08, 1.6, 8]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>

        {/* Stern A-Frame Deployment Gantry */}
        <group position={[0, 1.1, -5.2]}>
          {/* Left upright */}
          <mesh position={[-1.2, 0.8, 0]} rotation={[0.2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 2.2, 8]} />
            <meshStandardMaterial color="#eab308" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Right upright */}
          <mesh position={[1.2, 0.8, 0]} rotation={[0.2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 2.2, 8]} />
            <meshStandardMaterial color="#eab308" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Top crossbar */}
          <mesh position={[0, 1.85, 0.35]}>
            <boxGeometry args={[2.5, 0.14, 0.14]} />
            <meshStandardMaterial color="#eab308" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Winch Sheave */}
          <mesh position={[0, 1.7, 0.35]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.18, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
        </group>
      </group>

      {/* Surface Technical Callout */}
      <Html position={[2.8, 2.5, -3]} distanceFactor={22}>
        <div className="bg-slate-900/90 border border-slate-700/80 px-2 py-1 rounded text-[11px] font-mono whitespace-nowrap shadow-lg backdrop-blur-sm pointer-events-none select-none text-slate-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>R/V SURFACE UNIT • TETHER WINCH</span>
        </div>
      </Html>
    </group>
  );
}
