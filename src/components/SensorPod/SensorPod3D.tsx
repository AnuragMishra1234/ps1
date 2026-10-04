import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SENSORS_METADATA } from '../../data/sensors';
import { SensorId } from '../../types/sensors';

interface SensorPod3DProps {
  position?: [number, number, number];
  anomalyLevel: 'normal' | 'candidate' | 'strong';
  selectedSensorId: string | null;
  onSelectSensor: (sensorId: SensorId) => void;
  showLabels?: boolean;
}

export function SensorPod3D({
  position = [0, 0, 0],
  anomalyLevel,
  selectedSensorId,
  onSelectSensor,
  showLabels = true,
}: SensorPod3DProps) {
  const podGroup = useRef<THREE.Group>(null!);
  const [hoveredSensor, setHoveredSensor] = useState<string | null>(null);

  // Status indicator ring color
  const statusColor =
    anomalyLevel === 'strong'
      ? '#ef4444' // Red
      : anomalyLevel === 'candidate'
      ? '#f59e0b' // Amber
      : '#10b981'; // Green

  // Subtle natural buoyancy and current sway
  useFrame((state) => {
    if (podGroup.current) {
      const t = state.clock.elapsedTime;
      // Gentle natural hovering oscillation
      podGroup.current.position.y = position[1] + Math.sin(t * 1.2) * 0.04;
      podGroup.current.position.x = position[0] + Math.cos(t * 0.7) * 0.02;
      // Subtle roll and pitch
      podGroup.current.rotation.z = Math.sin(t * 0.9) * 0.015;
      podGroup.current.rotation.x = Math.cos(t * 0.7) * 0.018;
      podGroup.current.rotation.y = Math.sin(t * 0.4) * 0.02;
    }
  });

  return (
    <group ref={podGroup} position={position}>
      {/* ========================================================================= */}
      {/* 1. CHASSIS / ROLL CAGE / BENTHIC SKIDS */}
      {/* ========================================================================= */}
      <group name="chassis">
        {/* Left skid rail */}
        <mesh position={[-0.55, -0.65, 0]}>
          <boxGeometry args={[0.08, 0.06, 1.9]} />
          <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Left skid upturn front */}
        <mesh position={[-0.55, -0.58, 0.98]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.08, 0.06, 0.3]} />
          <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Right skid rail */}
        <mesh position={[0.55, -0.65, 0]}>
          <boxGeometry args={[0.08, 0.06, 1.9]} />
          <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Right skid upturn front */}
        <mesh position={[0.55, -0.58, 0.98]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.08, 0.06, 0.3]} />
          <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Skid cross braces */}
        <mesh position={[0, -0.65, -0.6]}>
          <boxGeometry args={[1.08, 0.05, 0.08]} />
          <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[0, -0.65, 0.6]}>
          <boxGeometry args={[1.08, 0.05, 0.08]} />
          <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.7} />
        </mesh>

        {/* Protective tubular bumper cage frame */}
        <mesh position={[-0.55, -0.1, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 1.1, 8]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.55, -0.1, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 1.1, 8]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-0.55, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 1.6, 8]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.55, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 1.6, 8]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Top Lifting Bail / Winch Bridle */}
        <mesh position={[0, 0.62, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.22, 0.03, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Tether penetration penetrator / cable gland */}
        <mesh position={[0, 0.48, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 0.22, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 2. MAIN SUBSEA PRESSURE HOUSING (Cylindrical Electronics Bay) */}
      {/* ========================================================================= */}
      <group name="pressure_housing" position={[0, 0, 0]}>
        {/* Main cylinder */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 1.45, 32]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.25}
            metalness={0.85}
          />
        </mesh>

        {/* Aluminum endcap forward flange */}
        <mesh position={[0, 0, 0.73]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.08, 32]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Aluminum endcap aft flange */}
        <mesh position={[0, 0, -0.73]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.08, 32]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Central Anomaly Status Indicator Band (Green / Amber / Red) */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.346, 0.346, 0.12, 32]} />
          <meshStandardMaterial
            color={statusColor}
            emissive={statusColor}
            emissiveIntensity={anomalyLevel === 'normal' ? 0.3 : 0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 3. INDIVIDUAL SENSORS WITH CLICK HANDLERS & 3D GEOMETRY */}
      {/* ========================================================================= */}

      {/* SENSOR 1: PI-EM COIL (Pulse Induction Search Coil Ring at bottom) */}
      <group
        name="pi_em_coil"
        position={[0, -0.65, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectSensor('pi_em');
        }}
        onPointerOver={() => setHoveredSensor('pi_em')}
        onPointerOut={() => setHoveredSensor(null)}
      >
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.62, 0.045, 16, 36]} />
          <meshStandardMaterial
            color={selectedSensorId === 'pi_em' ? '#38bdf8' : '#0284c7'}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
        {/* Support spoke struts connecting coil to sled */}
        <mesh position={[0.42, 0.08, 0]} rotation={[0, 0, 0.4]}>
          <cylinderGeometry args={[0.015, 0.015, 0.32, 8]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[-0.42, 0.08, 0]} rotation={[0, 0, -0.4]}>
          <cylinderGeometry args={[0.015, 0.015, 0.32, 8]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      </group>

      {/* SENSOR 2: MAGNETOMETER (Isolated Rear Stinger Boom) */}
      <group
        name="magnetometer"
        position={[0, 0.35, -0.92]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectSensor('magnetometer');
        }}
        onPointerOver={() => setHoveredSensor('magnetometer')}
        onPointerOut={() => setHoveredSensor(null)}
      >
        {/* Extension boom rod */}
        <mesh position={[0, -0.1, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.48, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        {/* Magnetometer sensor head cylinder */}
        <mesh position={[0, -0.1, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.24, 16]} />
          <meshStandardMaterial
            color={selectedSensorId === 'magnetometer' ? '#60a5fa' : '#2563eb'}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* SENSOR 3: ORP SENSOR (Port environmental shroud) */}
      <group
        name="orp_sensor"
        position={[-0.45, -0.22, 0.35]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectSensor('orp');
        }}
        onPointerOver={() => setHoveredSensor('orp')}
        onPointerOut={() => setHoveredSensor(null)}
      >
        <mesh rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.04, 0.04, 0.32, 12]} />
          <meshStandardMaterial
            color={selectedSensorId === 'orp' ? '#34d399' : '#059669'}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
        {/* Platinum sensing tip electrode */}
        <mesh position={[-0.12, -0.12, 0]}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* SENSOR 4: TURBIDITY SENSOR (Starboard optical backscatter port) */}
      <group
        name="turbidity_sensor"
        position={[0.45, -0.22, 0.35]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectSensor('turbidity');
        }}
        onPointerOver={() => setHoveredSensor('turbidity')}
        onPointerOut={() => setHoveredSensor(null)}
      >
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.045, 0.045, 0.3, 12]} />
          <meshStandardMaterial
            color={selectedSensorId === 'turbidity' ? '#fbbf24' : '#d97706'}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
        {/* Optical Sapphire Window */}
        <mesh position={[0.11, -0.11, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.028, 0.028, 0.02, 16]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.8} />
        </mesh>
      </group>

      {/* SENSOR 5: TEMPERATURE PROBE (Lower forward titanium sheath) */}
      <group
        name="temperature_sensor"
        position={[0.38, -0.42, -0.15]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectSensor('temperature');
        }}
        onPointerOver={() => setHoveredSensor('temperature')}
        onPointerOut={() => setHoveredSensor(null)}
      >
        <mesh rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.36, 8]} />
          <meshStandardMaterial
            color={selectedSensorId === 'temperature' ? '#f472b6' : '#db2777'}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* SENSOR 6: PRESSURE SENSOR (MS5837 port) */}
      <group
        name="pressure_sensor"
        position={[-0.36, 0.28, 0.15]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectSensor('pressure');
        }}
        onPointerOver={() => setHoveredSensor('pressure')}
        onPointerOut={() => setHoveredSensor(null)}
      >
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.1, 16]} />
          <meshStandardMaterial
            color={selectedSensorId === 'pressure' ? '#818cf8' : '#4f46e5'}
            metalness={0.7}
          />
        </mesh>
      </group>

      {/* SENSOR 7: IMU / COMPASS (Internal housing core) */}
      <group
        name="imu_sensor"
        position={[0, 0.05, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectSensor('imu');
        }}
        onPointerOver={() => setHoveredSensor('imu')}
        onPointerOut={() => setHoveredSensor(null)}
      >
        <mesh>
          <boxGeometry args={[0.14, 0.08, 0.14]} />
          <meshStandardMaterial
            color={selectedSensorId === 'imu' ? '#a78bfa' : '#7c3aed'}
            wireframe={true}
          />
        </mesh>
      </group>

      {/* SENSOR 8: CAMERA & LED ILLUMINATION (Forward nose dome) */}
      <group
        name="camera_sensor"
        position={[0, -0.05, 0.76]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectSensor('camera');
        }}
        onPointerOver={() => setHoveredSensor('camera')}
        onPointerOut={() => setHoveredSensor(null)}
      >
        {/* Optical Acrylic Dome */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <sphereGeometry args={[0.22, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color={selectedSensorId === 'camera' ? '#7dd3fc' : '#0284c7'}
            roughness={0.1}
            metalness={0.2}
            transparent
            opacity={0.75}
          />
        </mesh>
        {/* Camera Lens Element inside */}
        <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 0.1, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} />
        </mesh>

        {/* Twin LED subsea spotlights */}
        <group position={[-0.28, 0.12, -0.1]} rotation={[0.2, -0.1, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.12, 12]} />
            <meshStandardMaterial color="#f8fafc" emissive="#e0f2fe" emissiveIntensity={0.6} />
          </mesh>
        </group>
        <group position={[0.28, 0.12, -0.1]} rotation={[0.2, 0.1, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.12, 12]} />
            <meshStandardMaterial color="#f8fafc" emissive="#e0f2fe" emissiveIntensity={0.6} />
          </mesh>
        </group>
      </group>

      {/* SENSOR 9: ACOUSTIC ALTIMETER / SONAR (Downward transducer puck) */}
      <group
        name="sonar_sensor"
        position={[0, -0.42, 0.35]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectSensor('sonar');
        }}
        onPointerOver={() => setHoveredSensor('sonar')}
        onPointerOut={() => setHoveredSensor(null)}
      >
        <mesh>
          <cylinderGeometry args={[0.07, 0.07, 0.12, 20]} />
          <meshStandardMaterial
            color={selectedSensorId === 'sonar' ? '#2dd4bf' : '#0d9488'}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* FLOATING TECHNICAL LABELS / CALLOUTS (Clean & Radial Leader Lines) */}
      {/* ========================================================================= */}
      {showLabels && !selectedSensorId && (
        <group name="sensor_callouts">
          {[
            {
              id: 'camera' as const,
              shortName: 'CAMERA',
              sensorPos: [0, -0.05, 0.76] as [number, number, number],
              labelPos: [0, 0.55, 1.35] as [number, number, number],
              color: '#38bdf8',
            },
            {
              id: 'magnetometer' as const,
              shortName: 'MAGNETOMETER',
              sensorPos: [0, 0.35, -0.92] as [number, number, number],
              labelPos: [0, 0.85, -1.45] as [number, number, number],
              color: '#60a5fa',
            },
            {
              id: 'pi_em' as const,
              shortName: 'PI-EM',
              sensorPos: [0, -0.65, 0] as [number, number, number],
              labelPos: [0, -1.35, 0] as [number, number, number],
              color: '#06b6d4',
            },
            {
              id: 'orp' as const,
              shortName: 'ORP',
              sensorPos: [-0.45, -0.22, 0.35] as [number, number, number],
              labelPos: [-1.45, -0.2, 0.55] as [number, number, number],
              color: '#34d399',
            },
            {
              id: 'turbidity' as const,
              shortName: 'TURBIDITY',
              sensorPos: [0.45, -0.22, 0.35] as [number, number, number],
              labelPos: [1.45, -0.2, 0.55] as [number, number, number],
              color: '#fbbf24',
            },
            {
              id: 'temperature' as const,
              shortName: 'TEMPERATURE',
              sensorPos: [0.38, -0.42, -0.15] as [number, number, number],
              labelPos: [1.45, -0.7, -0.3] as [number, number, number],
              color: '#f472b6',
            },
            {
              id: 'pressure' as const,
              shortName: 'PRESSURE',
              sensorPos: [-0.36, 0.28, 0.15] as [number, number, number],
              labelPos: [-1.45, 0.55, 0.25] as [number, number, number],
              color: '#818cf8',
            },
            {
              id: 'imu' as const,
              shortName: 'IMU',
              sensorPos: [0, 0.05, 0] as [number, number, number],
              labelPos: [0, 0.95, 0.1] as [number, number, number],
              color: '#a78bfa',
            },
            {
              id: 'sonar' as const,
              shortName: 'SONAR',
              sensorPos: [0, -0.42, 0.35] as [number, number, number],
              labelPos: [0, -1.05, 0.95] as [number, number, number],
              color: '#2dd4bf',
            },
          ].map((item) => (
            <group key={item.id}>
              {/* Glowing anchor pin directly on sensor */}
              <mesh position={item.sensorPos}>
                <sphereGeometry args={[0.028, 12, 12]} />
                <meshBasicMaterial color={item.color} />
              </mesh>

              {/* Leader Line connecting sensor to label */}
              {/* @ts-ignore */}
              <line>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([...item.sensorPos, ...item.labelPos])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial color={item.color} transparent opacity={0.4} />
              </line>

              {/* Neat compact pill label (no distanceFactor so it stays small and sharp) */}
              <Html position={item.labelPos} center>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSensor(item.id);
                  }}
                  className={`group flex items-center gap-1.5 px-2 py-0.5 rounded-full border shadow-lg backdrop-blur-md text-[9px] font-mono tracking-wider transition-all duration-150 transform hover:scale-105 active:scale-95 whitespace-nowrap ${
                    selectedSensorId === item.id
                      ? 'bg-cyan-500 text-slate-950 font-bold border-white ring-2 ring-cyan-300'
                      : 'bg-slate-950/95 text-slate-200 border-slate-700/80 hover:border-cyan-400 hover:text-white'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-semibold">{item.shortName}</span>
                </button>
              </Html>
            </group>
          ))}
        </group>
      )}
    </group>
  );
}
