import { LiveSensorReadings, AnomalyEvaluation } from './sensors';

export type DemoStage =
  | 'IDLE'
  | 'DEPLOY'
  | 'SENSE'
  | 'PROCESS'
  | 'FUSE'
  | 'DETECT'
  | 'MAP'
  | 'TARGET'
  | 'COMPLETED';

export type SimulationZoneId = 'zone_a' | 'zone_b' | 'zone_c';

export interface SimulationZone {
  id: SimulationZoneId;
  name: string;
  tag: string;
  depthRange: [number, number];
  baseValues: {
    piEm: number;
    magneticUT: number;
    orpMv: number;
    turbidityNtu: number;
    tempC: number;
    visualConfidence: number;
  };
  expectedScore: number;
  expectedClass: 'Baseline' | 'Candidate Anomaly' | 'Strong Candidate';
  description: string;
  geologicalFeature: string;
}

export type CameraViewMode = 'orbit' | 'top' | 'seafloor' | 'follow';

export interface SimulationState {
  isPlaying: boolean;
  isPaused: boolean;
  speedMultiplier: number;
  currentZone: SimulationZoneId;
  activeDemoStage: DemoStage;
  demoProgressPercent: number;
  isAutomatedDemoRunning: boolean;
  cameraView: CameraViewMode;
  selectedSensorId: string | null;
  surfaceVesselLinked: boolean;
  rs485Status: 'ACTIVE' | 'SYNCING' | 'INTERRUPTED';
  packetLossRatePercent: number;
  totalSurveyPointsCollected: number;
  currentReadings: LiveSensorReadings;
  currentEvaluation: AnomalyEvaluation;
}
