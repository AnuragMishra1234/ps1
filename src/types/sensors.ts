export type SensorId =
  | 'pi_em'
  | 'magnetometer'
  | 'orp'
  | 'turbidity'
  | 'temperature'
  | 'pressure'
  | 'imu'
  | 'camera'
  | 'sonar';

export interface SensorMetadata {
  id: SensorId;
  name: string;
  shortName: string;
  category: 'Electromagnetic' | 'Environmental' | 'Navigation & Spatial' | 'Visual & Acoustic';
  purpose: string;
  signalDescription: string;
  hardwareModel: string;
  interfaceProtocol: string;
  status: 'ACTIVE' | 'CALIBRATING' | 'STANDBY';
  sampleRateHz: number;
  unit: string;
  nominalRange: string;
  accuracy: string;
  weightInFusion: number; // 0 to 1
  color: string;
  position3D: [number, number, number]; // relative position on 3D pod
  workingPrinciple: string;
}

export interface LiveSensorReadings {
  timestamp: number;
  depthM: number;
  altitudeM: number;
  temperatureC: number;
  pressureBar: number;
  magneticFieldUT: number;
  orpMv: number;
  turbidityNtu: number;
  piEmResponse: number; // 0.00 to 1.00 normalized coil response
  headingDeg: number;
  pitchDeg: number;
  rollDeg: number;
  visualConfidence: number; // 0.00 to 1.00
  acousticDistanceM: number;
}

export interface NormalizedSensorSignals {
  piEm: number;
  magnetic: number;
  orp: number;
  turbidity: number;
  temperature: number;
  visual: number;
}

export interface AnomalyEvaluation {
  score: number; // 0.00 to 1.00
  classification: 'Baseline' | 'Candidate Anomaly' | 'Strong Candidate';
  level: 'normal' | 'candidate' | 'strong';
  dominantIndicators: string[];
  confidence: number;
  calculatedAt: string;
}

export interface SurveyPoint {
  id: string;
  index: number;
  timestamp: string;
  lat: number;
  lng: number;
  surveyDistanceM: number;
  depthM: number;
  altitudeM: number;
  anomalyScore: number;
  classification: 'Baseline' | 'Candidate Anomaly' | 'Strong Candidate';
  signals: NormalizedSensorSignals;
  rawReadings: Partial<LiveSensorReadings>;
  highlighted?: boolean;
}

export interface TargetZone {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  anomalyScore: number;
  depthM: number;
  surveyDistanceM: number;
  indicators: string[];
  recommendation: string;
  visualConfirmed: boolean;
  priorityLevel: 'High Priority' | 'Secondary Priority' | 'Standard';
  geologicalContext: string;
}
