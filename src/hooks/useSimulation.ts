import { useState, useEffect, useRef, useCallback } from 'react';
import { DemoStage, CameraViewMode } from '../types/simulation';
import { generateInitialSurveyTrack } from '../data/surveyData';
import { SurveyPoint } from '../types/sensors';

export const DEMO_STAGES: { stage: DemoStage; label: string; durationMs: number; description: string }[] = [
  { stage: 'DEPLOY', label: 'DEPLOY', durationMs: 4500, description: 'Sensor pod lowered from research vessel winch; pressure telemetry initializing.' },
  { stage: 'SENSE', label: 'SENSE', durationMs: 5000, description: 'All 9 subsea sensor transducers calibrated; synchronous 25Hz acquisition started.' },
  { stage: 'PROCESS', label: 'PROCESS', durationMs: 5500, description: 'RS-485 differential link streaming telemetry to surface unit; Butterworth filtering active.' },
  { stage: 'FUSE', label: 'FUSE', durationMs: 5000, description: 'Multi-sensor feature correlation engine fusing electromagnetic and environmental indicators.' },
  { stage: 'DETECT', label: 'DETECT', durationMs: 5500, description: 'Conductive decay pulse and magnetic anomaly detected; prospectivity score elevates.' },
  { stage: 'MAP', label: 'MAP', durationMs: 5000, description: 'Real-time georeferenced waypoint insertion; candidate anomaly zone plotted on bathymetric grid.' },
  { stage: 'TARGET', label: 'TARGET', durationMs: 6500, description: 'Target Zone Alpha (TZ-01) prioritized with confidence metrics for detailed follow-up ROV inspection.' },
];

export function useSimulation(
  onZoneChange: (zone: 'zone_a' | 'zone_b' | 'zone_c') => void,
  onCameraChange?: (mode: CameraViewMode) => void
) {
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [stageProgress, setStageProgress] = useState(0); // 0 to 100 within stage
  const [totalDemoProgress, setTotalDemoProgress] = useState(0); // 0 to 100 overall
  const [surveyPoints, setSurveyPoints] = useState<SurveyPoint[]>(() => generateInitialSurveyTrack());
  const [activeCameraView, setActiveCameraView] = useState<CameraViewMode>('orbit');

  const timerRef = useRef<any>(null);
  const stageStartTimeRef = useRef<number>(Date.now());
  const elapsedInStageRef = useRef<number>(0);

  const currentStage = DEMO_STAGES[currentStageIndex] || DEMO_STAGES[0];

  const setCameraView = useCallback((mode: CameraViewMode) => {
    setActiveCameraView(mode);
    if (onCameraChange) onCameraChange(mode);
  }, [onCameraChange]);

  const startDemo = useCallback(() => {
    setIsDemoRunning(true);
    setIsPaused(false);
    setCurrentStageIndex(0);
    setStageProgress(0);
    setTotalDemoProgress(0);
    elapsedInStageRef.current = 0;
    stageStartTimeRef.current = Date.now();
    onZoneChange('zone_a');
    setCameraView('orbit');
  }, [onZoneChange, setCameraView]);

  const pauseDemo = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const resetDemo = useCallback(() => {
    setIsDemoRunning(false);
    setIsPaused(false);
    setCurrentStageIndex(0);
    setStageProgress(0);
    setTotalDemoProgress(0);
    elapsedInStageRef.current = 0;
    onZoneChange('zone_a');
    setCameraView('orbit');
  }, [onZoneChange, setCameraView]);

  const skipToStage = useCallback((index: number) => {
    if (index >= 0 && index < DEMO_STAGES.length) {
      setCurrentStageIndex(index);
      setStageProgress(0);
      elapsedInStageRef.current = 0;
      stageStartTimeRef.current = Date.now();

      // Set associated zone and view
      const targetStage = DEMO_STAGES[index].stage;
      if (targetStage === 'DEPLOY') {
        onZoneChange('zone_a');
        setCameraView('orbit');
      } else if (targetStage === 'SENSE' || targetStage === 'PROCESS') {
        onZoneChange('zone_a');
        setCameraView('follow');
      } else if (targetStage === 'FUSE' || targetStage === 'DETECT') {
        onZoneChange('zone_b');
        setCameraView('seafloor');
      } else if (targetStage === 'MAP') {
        onZoneChange('zone_c');
        setCameraView('top');
      } else if (targetStage === 'TARGET') {
        onZoneChange('zone_c');
        setCameraView('seafloor');
      }
    }
  }, [onZoneChange, setCameraView]);

  const skipNext = useCallback(() => {
    if (currentStageIndex < DEMO_STAGES.length - 1) {
      skipToStage(currentStageIndex + 1);
    } else {
      setIsDemoRunning(false);
    }
  }, [currentStageIndex, skipToStage]);

  // Main Demo Sequence Timer
  useEffect(() => {
    if (!isDemoRunning || isPaused) return;

    const interval = 100;
    const stageDuration = DEMO_STAGES[currentStageIndex]?.durationMs || 5000;

    const totalDuration = DEMO_STAGES.reduce((sum, s) => sum + s.durationMs, 0);
    const completedDurationBefore = DEMO_STAGES.slice(0, currentStageIndex).reduce((sum, s) => sum + s.durationMs, 0);

    const intervalId = setInterval(() => {
      elapsedInStageRef.current += interval;
      const progressInStage = Math.min(100, (elapsedInStageRef.current / stageDuration) * 100);
      setStageProgress(progressInStage);

      const overallElapsed = completedDurationBefore + elapsedInStageRef.current;
      setTotalDemoProgress(Math.min(100, (overallElapsed / totalDuration) * 100));

      if (elapsedInStageRef.current >= stageDuration) {
        // Transition to next stage
        if (currentStageIndex < DEMO_STAGES.length - 1) {
          const nextIndex = currentStageIndex + 1;
          setCurrentStageIndex(nextIndex);
          elapsedInStageRef.current = 0;
          setStageProgress(0);

          // Trigger stage action
          const nextStage = DEMO_STAGES[nextIndex].stage;
          if (nextStage === 'SENSE') {
            setCameraView('follow');
          } else if (nextStage === 'DETECT') {
            onZoneChange('zone_b');
            setCameraView('seafloor');
          } else if (nextStage === 'MAP') {
            onZoneChange('zone_c');
          } else if (nextStage === 'TARGET') {
            setCameraView('seafloor');
          }
        } else {
          // Completed
          setIsDemoRunning(false);
          setStageProgress(100);
          setTotalDemoProgress(100);
        }
      }
    }, interval);

    return () => clearInterval(intervalId);
  }, [isDemoRunning, isPaused, currentStageIndex, onZoneChange, setCameraView]);

  return {
    isDemoRunning,
    isPaused,
    currentStageIndex,
    currentStage,
    stageProgress,
    totalDemoProgress,
    surveyPoints,
    activeCameraView,
    setCameraView,
    startDemo,
    pauseDemo,
    resetDemo,
    skipToStage,
    skipNext,
  };
}
