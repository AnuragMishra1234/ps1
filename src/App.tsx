import React, { useRef, useState, useCallback } from 'react';
import { useSensorData } from './hooks/useSensorData';
import { useSimulation } from './hooks/useSimulation';
import { Navbar } from './components/Navigation/Navbar';
import { DemoPlaybackBar } from './components/DemoControls/DemoPlaybackBar';
import { EngineeringDashboardHeader } from './components/SensorReadings/EngineeringDashboardHeader';
import { HeroSection } from './components/HeroScene/HeroSection';
import { Interactive3DViewer } from './components/UnderwaterScene/Interactive3DViewer';
import { SensorDetailModal } from './components/SensorPod/SensorDetailModal';
import { LiveSensorDataPanel } from './components/SensorReadings/LiveSensorDataPanel';
import { PipelineDiagram } from './components/SystemFlow/PipelineDiagram';
import { SensorFusionSection } from './components/SensorFusion/SensorFusionSection';
import { SeafloorMapSection } from './components/SeafloorMap/SeafloorMapSection';
import { DepthProfileChart } from './components/DepthChart/DepthProfileChart';
import { CameraPreviewPanel } from './components/CameraModule/CameraPreviewPanel';
import { DecisionOutputSection } from './components/DecisionPanel/DecisionOutputSection';
import { ArchitectureSection } from './components/SystemFlow/ArchitectureSection';
import { TechStackSection } from './components/TechStack/TechStackSection';
import { FinalLandingSection } from './components/Landing/FinalLandingSection';
import { CameraViewMode } from './types/simulation';
import { SensorId } from './types/sensors';

export function App() {
  const simulationSectionRef = useRef<HTMLDivElement>(null!);

  // Sensor telemetry hook
  const {
    readings,
    signals,
    evaluation,
    history,
    currentZone,
    fusionWeights,
    selectedSensorId,
    setSelectedSensorId,
    setSimulationZone,
    updateWeights,
  } = useSensorData(300);

  // Camera view state for 3D digital twin
  const [cameraView, setCameraView] = useState<CameraViewMode>('orbit');

  // Automated 35s demo runner hook
  const {
    isDemoRunning,
    isPaused,
    currentStageIndex,
    stageProgress,
    totalDemoProgress,
    surveyPoints,
    startDemo,
    pauseDemo,
    resetDemo,
    skipNext,
    skipToStage,
  } = useSimulation(setSimulationZone, setCameraView);

  // Cycle anomaly simulation zones on click
  const handleSimulateAnomaly = useCallback(() => {
    if (currentZone === 'zone_a') {
      setSimulationZone('zone_b');
      setCameraView('seafloor');
    } else if (currentZone === 'zone_b') {
      setSimulationZone('zone_c');
      setCameraView('seafloor');
    } else {
      setSimulationZone('zone_a');
      setCameraView('orbit');
    }
  }, [currentZone, setSimulationZone]);

  const handleLaunchDemoFromHero = useCallback(() => {
    startDemo();
    const el = document.getElementById('interactive-simulation');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [startDemo]);

  const handleScrollToSystem = useCallback(() => {
    const el = document.getElementById('interactive-simulation');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleScrollToArchitecture = useCallback(() => {
    const el = document.getElementById('architecture');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* 1. TOP STICKY NAVIGATION */}
      <Navbar onLaunchDemo={handleLaunchDemoFromHero} />

      {/* 2. DEMO PLAYBACK CONTROLLER (Sticky right below navbar) */}
      <DemoPlaybackBar
        isDemoRunning={isDemoRunning}
        isPaused={isPaused}
        currentStageIndex={currentStageIndex}
        stageProgress={stageProgress}
        totalDemoProgress={totalDemoProgress}
        onStartDemo={startDemo}
        onPauseDemo={pauseDemo}
        onResetDemo={resetDemo}
        onSkipNext={skipNext}
        onSkipToStage={skipToStage}
        onSimulateAnomaly={handleSimulateAnomaly}
        currentZone={currentZone}
      />

      {/* 3. REAL-TIME ENGINEERING TELEMETRY STATUS BAR */}
      <EngineeringDashboardHeader
        depthM={readings.depthM}
        evaluation={evaluation}
        surveyPointsCount={surveyPoints.length}
      />

      <main className="flex-1 space-y-12">
        {/* 4. PAGE 1 — HERO SECTION */}
        <section id="system-overview">
          <HeroSection
            onLaunchSimulation={handleLaunchDemoFromHero}
            onViewSystem={handleScrollToSystem}
          />
        </section>

        {/* 5. PAGE 2 — MAIN INTERACTIVE 3D SYSTEM & LIVE TELEMETRY */}
        <section
          id="interactive-simulation"
          ref={simulationSectionRef}
          className="max-w-7xl mx-auto px-4 pt-8"
        >
          {/* Section Header */}
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-2">
                CORE PROTOTYPE DIGITAL TWIN
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                INTERACTIVE 3D UNDERWATER SYSTEM
              </h2>
              <p className="mt-1 text-slate-400 text-sm max-w-2xl">
                Real-time 3D simulation of research vessel, descending differential tether, and
                modular seafloor sensor pod. Click any sensor tag to inspect its working principle.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">CAMERA MODE:</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-bold uppercase">
                {cameraView}
              </span>
            </div>
          </div>

          {/* 3D Canvas Viewer */}
          <Interactive3DViewer
            cameraView={cameraView}
            onCameraViewChange={setCameraView}
            anomalyLevel={evaluation.level}
            selectedSensorId={selectedSensorId}
            onSelectSensor={(id) => setSelectedSensorId(id as SensorId)}
            depthM={readings.depthM}
            altitudeM={readings.altitudeM}
            headingDeg={readings.headingDeg}
          />

          {/* LIVE SENSOR DATA PANEL directly underneath 3D simulation */}
          <div id="sensor-inspection" className="mt-6">
            <LiveSensorDataPanel
              readings={readings}
              evaluation={evaluation}
              currentZone={currentZone}
              onSelectZone={setSimulationZone}
            />
          </div>
        </section>

        {/* 6. SENSOR DATA PIPELINE */}
        <PipelineDiagram />

        {/* 7. MULTI-SENSOR FUSION & ANOMALY SCORING */}
        <SensorFusionSection
          signals={signals}
          evaluation={evaluation}
          weights={fusionWeights}
          onUpdateWeights={updateWeights}
        />

        {/* 8. SEAFLOOR BATHYMETRIC SURVEY MAPPING */}
        <SeafloorMapSection
          points={surveyPoints}
          currentPodPoint={surveyPoints[surveyPoints.length - 1]}
          anomalyLevel={evaluation.level}
        />

        {/* 9. DEPTH PROFILE & REAL-TIME SENSOR CHARTS */}
        <DepthProfileChart
          surveyPoints={surveyPoints}
          currentDepth={readings.depthM}
          currentAltitude={readings.altitudeM}
          history={history}
        />

        {/* 10. UNDERWATER CAMERA / VISUAL MODULE */}
        <CameraPreviewPanel
          depthM={readings.depthM}
          altitudeM={readings.altitudeM}
          anomalyLevel={evaluation.level}
        />

        {/* 11. DECISION & SURVEY OUTPUT (TARGET ZONES & REAL-WORLD WORKFLOW) */}
        <DecisionOutputSection />

        {/* 12. SYSTEM ARCHITECTURE SECTION */}
        <ArchitectureSection />

        {/* 13. TECHNOLOGY STACK SECTION */}
        <TechStackSection />
      </main>

      {/* 14. FINAL LANDING STATEMENT & SCIENTIFIC FOOTER */}
      <FinalLandingSection
        onRunSimulationAgain={handleLaunchDemoFromHero}
        onViewArchitecture={handleScrollToArchitecture}
      />

      {/* MODAL: SENSOR DETAILED INSPECTOR (When user clicks any sensor) */}
      <SensorDetailModal
        sensorId={selectedSensorId}
        onClose={() => setSelectedSensorId(null)}
      />
    </div>
  );
}
export default App;
