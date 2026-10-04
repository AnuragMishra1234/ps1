import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface SeafloorTerrainProps {
  anomalyLevel: 'normal' | 'candidate' | 'strong';
  podPosition: [number, number, number];
}

export function SeafloorTerrain({ anomalyLevel, podPosition }: SeafloorTerrainProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const anomalyDiscRef = useRef<THREE.Mesh>(null!);

  // Generate textured undulating seabed geometry
  const terrainGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(36, 36, 48, 48);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // Gentle sediment ripples and bathymetric slopes
      const y =
        Math.sin(x * 0.28) * 0.35 +
        Math.cos(z * 0.22) * 0.4 +
        Math.sin(x * 0.9 + z * 0.7) * 0.08 -
        3.2; // Placed ~3.2m below center
      pos.setY(i, y);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Generate nodule-like objects scattered on the seabed
  const nodules = useMemo(() => {
    const items = [];
    const count = 75;
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 24;
      const z = (Math.random() - 0.5) * 24;
      const scale = 0.06 + Math.random() * 0.12;
      // Calculate height on terrain
      const y =
        Math.sin(x * 0.28) * 0.35 +
        Math.cos(z * 0.22) * 0.4 +
        Math.sin(x * 0.9 + z * 0.7) * 0.08 -
        3.18;
      items.push({ pos: [x, y, z] as [number, number, number], scale });
    }
    return items;
  }, []);

  // Dynamic anomaly highlight color
  const anomalyColor =
    anomalyLevel === 'strong'
      ? '#ef4444' // Red
      : anomalyLevel === 'candidate'
      ? '#f59e0b' // Amber
      : '#10b981'; // Green

  useFrame((state) => {
    if (anomalyDiscRef.current) {
      // Gentle pulsing of the detection footprint
      const s = 1.0 + Math.sin(state.clock.elapsedTime * 2.5) * 0.08;
      anomalyDiscRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group>
      {/* Main Sediment Bed */}
      <mesh ref={meshRef} geometry={terrainGeo} receiveShadow>
        <meshStandardMaterial
          color="#162232"
          roughness={0.92}
          metalness={0.08}
          flatShading={false}
        />
      </mesh>

      {/* Grid line overlay on seafloor for technical survey look */}
      <gridHelper
        args={[36, 36, 0x1e3a5f, 0x0f2238]}
        position={[0, -3.12, 0]}
      />

      {/* Scattered Nodule-like seabed objects */}
      {nodules.map((nodule, idx) => (
        <mesh
          key={idx}
          position={nodule.pos}
          scale={[nodule.scale * 1.3, nodule.scale * 0.8, nodule.scale]}
          castShadow
        >
          <sphereGeometry args={[1, 7, 6]} />
          <meshStandardMaterial
            color="#283344"
            roughness={0.85}
            metalness={0.25}
          />
        </mesh>
      ))}

      {/* Footprint Indicator directly below the pod on the seafloor */}
      <group position={[podPosition[0], -3.1, podPosition[2]]}>
        <mesh ref={anomalyDiscRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.85, 1.45, 32]} />
          <meshBasicMaterial
            color={anomalyColor}
            transparent
            opacity={anomalyLevel === 'normal' ? 0.25 : 0.65}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Outer subtle survey cone ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.7, 1.76, 32]} />
          <meshBasicMaterial
            color={anomalyColor}
            transparent
            opacity={anomalyLevel === 'normal' ? 0.15 : 0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}
