import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraRig } from './CameraRig';
import { SeafloorTerrain } from './SeafloorTerrain';
import { SuspendedParticles } from './SuspendedParticles';
import { ResearchVessel } from './ResearchVessel';
import { TetherLine } from './TetherLine';
import { SensorPod3D } from '../SensorPod/SensorPod3D';
import { Fallback2DViewer } from './Fallback2DViewer';
import { CameraViewMode } from '../../types/simulation';
import { SensorId } from '../../types/sensors';
import { SENSORS_METADATA } from '../../data/sensors';
import { Eye, Compass, Layers, Video, ShieldAlert } from 'lucide-react';

interface Interactive3DViewerProps {
  cameraView: CameraViewMode;
  onCameraViewChange: (mode: CameraViewMode) => void;
  anomalyLevel: 'normal' | 'candidate' | 'strong';
  selectedSensorId: SensorId | null;
  onSelectSensor: (id: SensorId) => void;
  depthM: number;
  altitudeM: number;
  headingDeg: number;
}

// Error Boundary for Three.js WebGL compatibility
class WebGLErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn('WebGL Rendering Encountered Error:', error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function Interactive3DViewer({
  cameraView,
  onCameraViewChange,
  anomalyLevel,
  selectedSensorId,
  onSelectSensor,
  depthM,
  altitudeM,
  headingDeg,
}: Interactive3DViewerProps) {
  const [showLabels, setShowLabels] = useState(true);
  const [force2D, setForce2D] = useState(false);

  const podPosition: [number, number, number] = [0, 0, 0];

  if (force2D) {
    return (
      <div className="relative">
        <Fallback2DViewer
          anomalyLevel={anomalyLevel}
          selectedSensorId={selectedSensorId}
          onSelectSensor={onSelectSensor}
          depthM={depthM}
        />
        <button
          onClick={() => setForce2D(false)}
          className="absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-lg bg-cyan-700/80 hover:bg-cyan-600 text-xs font-mono text-white transition"
        >
          SWITCH TO 3D VIEW
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-slate-800 bg-[#040812] shadow-2xl">
      <WebGLErrorBoundary
        fallback={
          <Fallback2DViewer
            anomalyLevel={anomalyLevel}
            selectedSensorId={selectedSensorId}
            onSelectSensor={onSelectSensor}
            depthM={depthM}
          />
        }
      >
        <Canvas
          shadows
          camera={{ position: [3.2, 1.6, 4.0], fov: 48, near: 0.1, far: 80 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Deep Ocean Water Fog & Atmospheric Attenuation */}
          <color attach="background" args={['#05101f']} />
          <fog attach="fog" args={['#05101f', 8, 38]} />

          {/* Physically plausible underwater illumination */}
          {/* Surface sunlight filtering down through water column */}
          <directionalLight
            position={[4, 18, 5]}
            intensity={1.1}
            color="#bae6fd"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          {/* Deep sea ambient ocean fill */}
          <ambientLight intensity={0.45} color="#0c2340" />

          {/* Pod forward searchlight illumination */}
          <spotLight
            position={[0, 0.2, 1.0]}
            target-position={[0, -2.5, 3.5]}
            intensity={2.2}
            distance={10}
            angle={0.65}
            penumbra={0.5}
            color="#f0f9ff"
          />

          {/* Research vessel on the surface reference */}
          <ResearchVessel />

          {/* RS-485 Tether line linking surface winch to pod */}
          <TetherLine podPosition={podPosition} isCommunicating={true} />

          {/* 3D Sensor Pod */}
          <SensorPod3D
            position={podPosition}
            anomalyLevel={anomalyLevel}
            selectedSensorId={selectedSensorId}
            onSelectSensor={onSelectSensor}
            showLabels={showLabels}
          />

          {/* Seabed Bathymetry Terrain */}
          <SeafloorTerrain anomalyLevel={anomalyLevel} podPosition={podPosition} />

          {/* Suspended Marine Snow Particulates */}
          <SuspendedParticles count={260} />

          {/* Interactive Camera Controller */}
          <CameraRig viewMode={cameraView} targetPosition={podPosition} />
        </Canvas>
      </WebGLErrorBoundary>

      {/* TOP OVERLAYS: Real-Time Spatial Telemetry HUD */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-xs font-mono text-slate-200 shadow-lg pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="text-slate-400">DEPTH:</span>
          <span className="font-bold text-cyan-300">{depthM.toFixed(1)} m</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-xs font-mono text-slate-200 shadow-lg pointer-events-auto">
          <span className="text-slate-400">ALTITUDE:</span>
          <span className="font-bold text-emerald-300">{altitudeM.toFixed(1)} m</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-xs font-mono text-slate-200 shadow-lg pointer-events-auto">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">HDG:</span>
          <span className="font-bold text-white">{headingDeg}°</span>
        </div>
      </div>

      {/* TOP RIGHT: Viewpoint Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 p-1 rounded-xl backdrop-blur-md shadow-lg">
        {(
          [
            { id: 'orbit', label: 'ORBIT', icon: Eye },
            { id: 'top', label: 'TOP VIEW', icon: Layers },
            { id: 'seafloor', label: 'SEAFLOOR VIEW', icon: Compass },
            { id: 'follow', label: 'FOLLOW POD', icon: Video },
          ] as const
        ).map((mode) => (
          <button
            key={mode.id}
            onClick={() => onCameraViewChange(mode.id)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all flex items-center gap-1.5 ${
              cameraView === mode.id
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <mode.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        ))}
      </div>

      {/* BOTTOM LEFT: Color Coding Legend */}
      <div className="absolute bottom-4 left-4 z-20 p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 backdrop-blur-md text-xs font-mono text-slate-300 shadow-xl space-y-1.5 max-w-[260px]">
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between border-b border-slate-800 pb-1">
          <span>SYSTEM COLOR CODING</span>
          <span className="text-[9px] text-cyan-400">3D DIGITAL TWIN</span>
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            <span className="text-slate-300">Blue: Comm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300">Green: Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-slate-300">Amber: Candidate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span className="text-slate-300">Red: Strong</span>
          </div>
        </div>
      </div>

      {/* BOTTOM CENTER: Sensor Module Quick-Inspector Dock */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden xl:flex items-center gap-1 bg-slate-950/90 border border-slate-800 p-1.5 rounded-xl backdrop-blur-md shadow-2xl">
        <span className="text-[9px] font-mono text-slate-500 px-2 uppercase font-bold tracking-wider">
          SENSORS:
        </span>
        {Object.values(SENSORS_METADATA).map((s) => (
          <button
            key={s.id}
            onClick={() => onSelectSensor(s.id)}
            className={`px-2 py-1 rounded text-[10px] font-mono transition-all flex items-center gap-1.5 ${
              selectedSensorId === s.id
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span>{s.shortName}</span>
          </button>
        ))}
      </div>

      {/* BOTTOM RIGHT: Labels Toggle and 2D Switch */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={() => setShowLabels((prev) => !prev)}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono border backdrop-blur-md transition shadow-md ${
            showLabels
              ? 'bg-slate-900/90 text-cyan-300 border-cyan-800 hover:bg-slate-800'
              : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          {showLabels ? 'LABELS: ON' : 'LABELS: OFF'}
        </button>

        <button
          onClick={() => setForce2D(true)}
          className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-slate-200 backdrop-blur-md transition shadow-md"
        >
          2D SCHEMATIC
        </button>
      </div>
    </div>
  );
}
