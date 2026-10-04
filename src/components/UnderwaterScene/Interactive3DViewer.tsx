import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraRig } from './CameraRig';
import { SeafloorTerrain } from './SeafloorTerrain';
import { SuspendedParticles } from './SuspendedParticles';
import { ResearchVessel } from './ResearchVessel';
import { TetherLine } from './TetherLine';
import { SensorPod3D } from '../SensorPod/SensorPod3D';
import { Fallback2DViewer } from './Fallback2DViewer';
import { CameraViewMode } from '../../types/simulation';
import { SensorId, LiveSensorReadings, AnomalyEvaluation } from '../../types/sensors';
import { SENSORS_METADATA } from '../../data/sensors';
import {
  Eye,
  Compass,
  Layers,
  Video,
  Maximize2,
  Minimize2,
  X,
  Activity,
  ArrowLeft,
  Radio,
  Play,
  RotateCcw,
} from 'lucide-react';

interface Interactive3DViewerProps {
  cameraView: CameraViewMode;
  onCameraViewChange: (mode: CameraViewMode) => void;
  anomalyLevel: 'normal' | 'candidate' | 'strong';
  selectedSensorId: SensorId | null;
  onSelectSensor: (id: SensorId) => void;
  depthM: number;
  altitudeM: number;
  headingDeg: number;
  isFullPage?: boolean;
  onToggleFullPage?: () => void;
  readings?: LiveSensorReadings;
  evaluation?: AnomalyEvaluation;
  currentZone?: 'zone_a' | 'zone_b' | 'zone_c';
  onSelectZone?: (zone: 'zone_a' | 'zone_b' | 'zone_c') => void;
  onStartDemo?: () => void;
  onSimulateAnomaly?: () => void;
  isDemoRunning?: boolean;
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
  isFullPage = false,
  onToggleFullPage,
  readings,
  evaluation,
  currentZone = 'zone_a',
  onSelectZone,
  onStartDemo,
  onSimulateAnomaly,
  isDemoRunning = false,
}: Interactive3DViewerProps) {
  const [showLabels, setShowLabels] = useState(true);
  const [force2D, setForce2D] = useState(false);
  const [showTelemetryDrawer, setShowTelemetryDrawer] = useState(false);

  const podPosition: [number, number, number] = [0, 0, 0];

  // Keyboard shortcut: ESC to exit full-page mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullPage && onToggleFullPage) {
        onToggleFullPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullPage, onToggleFullPage]);

  if (force2D) {
    return (
      <div className="relative w-full h-full">
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
    <div
      className={`relative w-full bg-[#040812] select-none transition-all duration-300 ${
        isFullPage
          ? 'w-screen h-screen overflow-hidden'
          : 'h-[calc(100vh-210px)] min-h-[480px] max-h-[720px] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden'
      }`}
    >
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
          camera={{ position: [3.6, 1.4, 4.6], fov: 46, near: 0.1, far: 80 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Deep Ocean Water Fog & Atmospheric Attenuation */}
          <color attach="background" args={['#05101f']} />
          <fog attach="fog" args={['#05101f', 8, 42]} />

          {/* Physically plausible underwater illumination */}
          <directionalLight
            position={[4, 18, 5]}
            intensity={1.15}
            color="#bae6fd"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

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

      {/* ========================================================================= */}
      {/* 1. TOP OVERLAYS */}
      {/* ========================================================================= */}
      {isFullPage ? (
        /* FULL-PAGE COMMAND CONSOLE TOP HEADER (Pure 3D, No website navigation) */
        <div className="absolute top-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          {/* Top Left: Exit & Telemetry Badges */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {onToggleFullPage && (
              <button
                onClick={onToggleFullPage}
                className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 hover:text-white border border-slate-700/90 backdrop-blur-md font-mono text-xs font-bold flex items-center gap-2 shadow-2xl transition active:scale-95"
                title="Return to standard website view (Escape)"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-400" />
                <span>BACK TO SITE (ESC)</span>
              </button>
            )}

            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md text-xs font-mono text-slate-300 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-white font-bold">DIGITAL TWIN</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-semibold">DEPTH {depthM.toFixed(1)}m</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-semibold">ALT {altitudeM.toFixed(1)}m</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-200">HDG {headingDeg}°</span>
            </div>
          </div>

          {/* Top Center: Simulation Quick-Actions */}
          <div className="hidden md:flex items-center gap-2 pointer-events-auto">
            {onStartDemo && (
              <button
                onClick={onStartDemo}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 shadow-xl transition active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isDemoRunning ? 'DEMO RUNNING' : 'START DEMO'}</span>
              </button>
            )}

            {onSimulateAnomaly && (
              <button
                onClick={onSimulateAnomaly}
                className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-700/80 font-mono text-xs font-semibold flex items-center gap-1.5 shadow-xl transition"
              >
                <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>SIMULATE ANOMALY</span>
              </button>
            )}

            {readings && (
              <button
                onClick={() => setShowTelemetryDrawer((prev) => !prev)}
                className={`px-3.5 py-2 rounded-xl font-mono text-xs font-semibold flex items-center gap-1.5 shadow-xl transition border backdrop-blur-md ${
                  showTelemetryDrawer
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-200 ring-2 ring-cyan-500/30'
                    : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>{showTelemetryDrawer ? 'HIDE DETAILS' : 'LIVE DETAILS'}</span>
              </button>
            )}
          </div>

          {/* Top Right: Viewpoint Controls & Exit */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 p-1 rounded-xl backdrop-blur-md shadow-2xl pointer-events-auto">
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

            {onToggleFullPage && (
              <button
                onClick={onToggleFullPage}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all flex items-center gap-1 bg-rose-950/80 border border-rose-700 text-rose-300 hover:bg-rose-900 ml-1 font-bold"
                title="Exit Fullscreen (Escape)"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">EXIT</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* STANDARD EMBEDDED MODE OVERLAYS */
        <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
          {/* Top Left: Depth, Altitude, Heading */}
          <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-xs font-mono text-slate-200 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-slate-400">DEPTH:</span>
              <span className="font-bold text-cyan-300">{depthM.toFixed(1)} m</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-xs font-mono text-slate-200 shadow-lg">
              <span className="text-slate-400">ALTITUDE:</span>
              <span className="font-bold text-emerald-300">{altitudeM.toFixed(1)} m</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-xs font-mono text-slate-200 shadow-lg">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">HDG:</span>
              <span className="font-bold text-white">{headingDeg}°</span>
            </div>
          </div>

          {/* Top Right: Viewpoint Controls & Fullscreen Trigger */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 p-1 rounded-xl backdrop-blur-md shadow-lg pointer-events-auto">
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

            {onToggleFullPage && (
              <button
                onClick={onToggleFullPage}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all flex items-center gap-1.5 border ml-1 bg-cyan-950/80 border-cyan-700 text-cyan-300 hover:bg-cyan-900 font-bold"
                title="Open Complete Full-Screen 3D View with Details"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">FULL 3D</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FLOATING LIVE SENSOR DETAILS DRAWER (In Full-Page Mode) */}
      {/* ========================================================================= */}
      {isFullPage && showTelemetryDrawer && readings && evaluation && (
        <div className="absolute top-20 left-4 z-30 w-80 bg-slate-950/95 border border-slate-700/90 rounded-2xl p-4 shadow-2xl backdrop-blur-md space-y-3 animate-fadeIn select-text">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              LIVE SENSOR READINGS
            </span>
            <button
              onClick={() => setShowTelemetryDrawer(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">DEPTH</span>
              <span className="font-bold text-white">{readings.depthM.toFixed(1)} m</span>
            </div>
            <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">PRESSURE</span>
              <span className="font-bold text-white">{readings.pressureBar.toFixed(1)} bar</span>
            </div>
            <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">TEMP</span>
              <span className="font-bold text-pink-300">{readings.temperatureC.toFixed(1)} °C</span>
            </div>
            <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">MAGNETIC</span>
              <span className="font-bold text-blue-300">{readings.magneticFieldUT.toFixed(1)} µT</span>
            </div>
            <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">ORP</span>
              <span className="font-bold text-emerald-300">{readings.orpMv} mV</span>
            </div>
            <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">TURBIDITY</span>
              <span className="font-bold text-amber-300">{readings.turbidityNtu.toFixed(1)} NTU</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/80 font-mono text-xs flex justify-between items-center">
            <span className="text-cyan-400 font-semibold">PI-EM COIL:</span>
            <span className="text-white font-bold text-sm">{readings.piEmResponse.toFixed(2)}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs flex justify-between items-center">
            <span className="text-slate-400">ANOMALY SCORE:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded text-xs ${
                evaluation.level === 'strong'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : evaluation.level === 'candidate'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}
            >
              {evaluation.score.toFixed(2)} ({evaluation.classification})
            </span>
          </div>

          {onSelectZone && (
            <div className="pt-1 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">SECTOR:</span>
              <div className="flex gap-1">
                {(['zone_a', 'zone_b', 'zone_c'] as const).map((z) => (
                  <button
                    key={z}
                    onClick={() => onSelectZone(z)}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                      currentZone === z
                        ? 'bg-cyan-500 text-slate-950 border-white'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {z === 'zone_a' ? 'Base' : z === 'zone_b' ? 'Cand' : 'Strong'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. BOTTOM OVERLAYS: SENSOR DOCK & STATUS CONTROLS */}
      {/* ========================================================================= */}
      {/* Bottom Left: Color Legend */}
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

      {/* Bottom Center: Sensor Module Quick-Inspector Dock */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden lg:flex items-center gap-1 bg-slate-950/90 border border-slate-800 p-1.5 rounded-xl backdrop-blur-md shadow-2xl">
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

      {/* Bottom Right: Labels Toggle and 2D Switch */}
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
