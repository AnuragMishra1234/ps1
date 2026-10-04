import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { SuspendedParticles } from '../UnderwaterScene/SuspendedParticles';
import * as THREE from 'three';

export function Hero3DBackground() {
  const podRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (podRef.current) {
      const t = state.clock.elapsedTime * 0.5;
      // Gentle natural hovering
      podRef.current.position.y = -1.2 + Math.sin(t) * 0.08;
      podRef.current.rotation.z = Math.sin(t * 0.8) * 0.015;
      podRef.current.rotation.y = -0.4 + Math.sin(t * 0.4) * 0.03;
    }
  });

  return (
    <group>
      {/* Background underwater ocean gradient & lighting */}
      <ambientLight intensity={0.4} color="#0c2340" />
      <directionalLight position={[2, 10, 3]} intensity={0.9} color="#bae6fd" />
      <fog attach="fog" args={['#05101f', 4, 18]} />

      {/* Seabed Plane */}
      <mesh position={[0, -2.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial color="#111c2a" roughness={0.95} />
      </mesh>

      {/* Seabed Grid Helper */}
      <gridHelper args={[24, 24, 0x162c45, 0x091524]} position={[0, -2.38, 0]} />

      {/* Simplified Sensor Pod in Hero Background */}
      <group ref={podRef} position={[2.2, -1.2, -1.5]} rotation={[0.05, -0.4, 0]}>
        {/* Main Body Housing */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 1.4, 24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Flanges */}
        <mesh position={[0, 0, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.06, 24]} />
          <meshStandardMaterial color="#475569" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.06, 24]} />
          <meshStandardMaterial color="#475569" metalness={0.9} />
        </mesh>

        {/* Bottom Search Coil */}
        <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.04, 12, 32]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Skids */}
        <mesh position={[-0.48, -0.58, 0]}>
          <boxGeometry args={[0.06, 0.05, 1.6]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        <mesh position={[0.48, -0.58, 0]}>
          <boxGeometry args={[0.06, 0.05, 1.6]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>

        {/* Tether upward line */}
        <mesh position={[0, 4.0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 7.5, 6]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
        </mesh>

        {/* Pod Status Beacon */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.325, 0.325, 0.1, 24]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.6} />
        </mesh>

        {/* Forward Camera Dome */}
        <mesh position={[0, -0.05, 0.72]}>
          <sphereGeometry args={[0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.7} />
        </mesh>
      </group>

      {/* Floating Marine Snow Particles */}
      <SuspendedParticles count={180} />
    </group>
  );
}
