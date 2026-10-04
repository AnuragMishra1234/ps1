import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface TetherLineProps {
  podPosition: [number, number, number];
  isCommunicating?: boolean;
}

export function TetherLine({ podPosition, isCommunicating = true }: TetherLineProps) {
  const lineRef = useRef<THREE.Line>(null!);
  const pulseBeadRef = useRef<THREE.Mesh>(null!);
  const pulseProgressRef = useRef(0);

  // Winch location at the stern of the research vessel
  const winchPos = useMemo(() => new THREE.Vector3(0, 12.6, -4.8), []);

  // Compute curve points
  const points = useMemo(() => {
    const curvePoints: THREE.Vector3[] = [];
    const segments = 40;
    const target = new THREE.Vector3(...podPosition);

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      // Catena sag formula
      const x = THREE.MathUtils.lerp(winchPos.x, target.x, t) + Math.sin(t * Math.PI) * 0.45;
      const y = THREE.MathUtils.lerp(winchPos.y, target.y, t);
      const z = THREE.MathUtils.lerp(winchPos.z, target.z, t) + Math.sin(t * Math.PI) * 0.35;
      curvePoints.push(new THREE.Vector3(x, y, z));
    }
    return curvePoints;
  }, [podPosition, winchPos]);

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(points);
  }, [points]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  useFrame((_, delta) => {
    if (isCommunicating && pulseBeadRef.current) {
      // Pulse bead travels up and down the tether to simulate telemetry packets
      pulseProgressRef.current = (pulseProgressRef.current + delta * 0.8) % 1;
      const pt = curve.getPointAt(pulseProgressRef.current);
      pulseBeadRef.current.position.copy(pt);
    }
  });

  return (
    <group>
      {/* Structural Tether Line */}
      {/* @ts-ignore */}
      <line ref={lineRef} geometry={geometry}>
        <lineBasicMaterial color="#38bdf8" linewidth={2} transparent opacity={0.65} />
      </line>

      {/* Outer tether protective sheath glow */}
      {/* @ts-ignore */}
      <line geometry={geometry}>
        <lineBasicMaterial color="#0284c7" linewidth={4} transparent opacity={0.25} />
      </line>

      {/* Active RS-485 Data Pulse Bead */}
      {isCommunicating && (
        <mesh ref={pulseBeadRef}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      )}
    </group>
  );
}
