import { useState, useEffect, useCallback, useRef } from 'react';
import {
  LiveSensorReadings,
  NormalizedSensorSignals,
  AnomalyEvaluation,
  SensorId,
} from '../types/sensors';
import {
  stepSensorSimulation,
  setTargetSimulationZone,
  getTargetSimulationZone,
} from '../utils/sensorSimulation';
import {
  computeAnomalyScore,
  DEFAULT_FUSION_WEIGHTS,
  FusionWeights,
} from '../utils/anomalyScore';

export interface SensorTelemetryHistoryPoint {
  timeStr: string;
  depthM: number;
  piEm: number;
  magnetic: number;
  orpMv: number;
  turbidityNtu: number;
  anomalyScore: number;
}

export function useSensorData(updateIntervalMs: number = 300) {
  const [currentZone, setCurrentZoneState] = useState<'zone_a' | 'zone_b' | 'zone_c'>('zone_a');
  const [fusionWeights, setFusionWeights] = useState<FusionWeights>(DEFAULT_FUSION_WEIGHTS);
  const [selectedSensorId, setSelectedSensorId] = useState<SensorId | null>(null);

  // Initialize initial state
  const initialStep = stepSensorSimulation(0.1, 'zone_a');
  const [readings, setReadings] = useState<LiveSensorReadings>(initialStep.readings);
  const [signals, setSignals] = useState<NormalizedSensorSignals>(initialStep.signals);
  const [evaluation, setEvaluation] = useState<AnomalyEvaluation>(() =>
    computeAnomalyScore(initialStep.signals, DEFAULT_FUSION_WEIGHTS)
  );

  const [history, setHistory] = useState<SensorTelemetryHistoryPoint[]>([]);
  const isPausedRef = useRef(false);

  const setSimulationZone = useCallback((zone: 'zone_a' | 'zone_b' | 'zone_c') => {
    setTargetSimulationZone(zone);
    setCurrentZoneState(zone);
  }, []);

  const updateWeights = useCallback((newWeights: Partial<FusionWeights>) => {
    setFusionWeights((prev) => {
      const merged = { ...prev, ...newWeights };
      return merged;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isPausedRef.current) return;

      const step = stepSensorSimulation(updateIntervalMs / 1000);
      setReadings(step.readings);
      setSignals(step.signals);

      const evalResult = computeAnomalyScore(step.signals, fusionWeights);
      setEvaluation(evalResult);

      const now = new Date();
      const timeStr = `${now.getMinutes()}:${String(now.getSeconds()).padStart(2, '0')}`;

      setHistory((prev) => {
        const next = [
          ...prev.slice(-30),
          {
            timeStr,
            depthM: step.readings.depthM,
            piEm: step.readings.piEmResponse,
            magnetic: +(step.readings.magneticFieldUT - 40).toFixed(1), // relative
            orpMv: step.readings.orpMv,
            turbidityNtu: step.readings.turbidityNtu,
            anomalyScore: evalResult.score,
          },
        ];
        return next;
      });
    }, updateIntervalMs);

    return () => clearInterval(timer);
  }, [updateIntervalMs, fusionWeights]);

  return {
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
    isPausedRef,
  };
}
