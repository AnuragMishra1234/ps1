import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function SuspendedParticles({ count = 280 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Scatter in a cylinder around the pod and water column
      const r = 2.0 + Math.random() * 12.0;
      const theta = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16.0;
      pos[i * 3 + 2] = Math.sin(theta) * r;

      spd[i] = 0.05 + Math.random() * 0.12;
    }
    return [pos, spd];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Gentle downward and drift motion (marine snow)
      pos[i * 3 + 1] -= speeds[i] * delta * 0.8;
      pos[i * 3] += Math.sin(pos[i * 3 + 1] * 0.5) * 0.005;

      // Wrap around vertically
      if (pos[i * 3 + 1] < -6) {
        pos[i * 3 + 1] = 8;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color="#88b5d3"
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
