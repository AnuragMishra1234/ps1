import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CameraViewMode } from '../../types/simulation';

interface CameraRigProps {
  viewMode: CameraViewMode;
  targetPosition: [number, number, number];
}

export function CameraRig({ viewMode, targetPosition }: CameraRigProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null!);
  const desiredCamPos = useRef(new THREE.Vector3(3.6, 1.4, 4.6));
  const desiredLookAt = useRef(new THREE.Vector3(targetPosition[0], targetPosition[1] - 0.15, targetPosition[2]));
  const isTransitioning = useRef(false);

  useEffect(() => {
    isTransitioning.current = true;
    switch (viewMode) {
      case 'orbit':
        // Centered general view
        desiredCamPos.current.set(3.6, 1.4, 4.6);
        desiredLookAt.current.set(targetPosition[0], targetPosition[1] - 0.15, targetPosition[2]);
        break;
      case 'top':
        // Overhead bathymetry view
        desiredCamPos.current.set(0.01, 8.2, 0.01);
        desiredLookAt.current.set(targetPosition[0], targetPosition[1] - 0.1, targetPosition[2]);
        break;
      case 'seafloor':
        // Looking up from seafloor - positioned so pod remains nicely centered in the frame!
        desiredCamPos.current.set(2.8, -1.8, 3.8);
        desiredLookAt.current.set(targetPosition[0], targetPosition[1] - 0.25, targetPosition[2]);
        break;
      case 'follow':
        // Close follow inspection
        desiredCamPos.current.set(2.0, 0.6, 2.6);
        desiredLookAt.current.set(targetPosition[0], targetPosition[1] - 0.1, targetPosition[2]);
        break;
    }
  }, [viewMode, targetPosition]);

  useFrame((_, delta) => {
    // Only animate programmatically if a viewpoint button was clicked
    if (!isTransitioning.current) return;

    camera.position.lerp(desiredCamPos.current, delta * 3.5);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(desiredLookAt.current, delta * 4.0);
      controlsRef.current.update();
    }

    // Stop transitioning as soon as camera is close enough to target
    if (camera.position.distanceTo(desiredCamPos.current) < 0.12) {
      isTransitioning.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.85}
      zoomSpeed={1.0}
      panSpeed={0.8}
      minDistance={0.8}
      maxDistance={32}
      maxPolarAngle={Math.PI / 2 + 0.3} // Allows looking slightly upwards from seafloor
      onStart={() => {
        // Immediately yield 100% control to user mouse interaction!
        isTransitioning.current = false;
      }}
    />
  );
}
