import { LiveSensorReadings, NormalizedSensorSignals } from '../types/sensors';
import { SIMULATION_ZONES } from '../data/simulation';
import { normalizeRawReadings, computeAnomalyScore } from './anomalyScore';

// Internal state for smooth deterministic interpolation
let internalProgress = 0;
let currentInterpolatedZone: 'zone_a' | 'zone_b' | 'zone_c' = 'zone_a';
let targetZone: 'zone_a' | 'zone_b' | 'zone_c' = 'zone_a';
let transitionFactor = 1.0; // 0 to 1

export function setTargetSimulationZone(zone: 'zone_a' | 'zone_b' | 'zone_c') {
  if (targetZone !== zone) {
    targetZone = zone;
    transitionFactor = 0.0;
  }
}

export function getTargetSimulationZone(): 'zone_a' | 'zone_b' | 'zone_c' {
  return targetZone;
}

/**
 * Step the deterministic sensor simulation smoothly
 * deltaSeconds: time step
 */
export function stepSensorSimulation(
  deltaSeconds: number = 0.1,
  manualZone?: 'zone_a' | 'zone_b' | 'zone_c'
): {
  readings: LiveSensorReadings;
  signals: NormalizedSensorSignals;
  zone: 'zone_a' | 'zone_b' | 'zone_c';
} {
  if (manualZone && manualZone !== targetZone) {
    setTargetSimulationZone(manualZone);
  }

  internalProgress += deltaSeconds;

  // Smoothly blend toward target zone (exponential smoothing)
  if (transitionFactor < 1.0) {
    transitionFactor = Math.min(1.0, transitionFactor + deltaSeconds * 0.7);
    if (transitionFactor >= 0.98) {
      currentInterpolatedZone = targetZone;
      transitionFactor = 1.0;
    }
  }

  const zoneA = SIMULATION_ZONES.zone_a;
  const targetZoneConfig = SIMULATION_ZONES[targetZone];

  // Weight between baseline and target
  const blend = transitionFactor;

  // Gentle physical wave oscillations
  const wave1 = Math.sin(internalProgress * 0.6) * 0.03;
  const wave2 = Math.cos(internalProgress * 1.1) * 0.02;
  const waveMicro = Math.sin(internalProgress * 3.4) * 0.008;

  // Base values blended
  const basePiEm = (1 - blend) * zoneA.baseValues.piEm + blend * targetZoneConfig.baseValues.piEm;
  const baseMag = (1 - blend) * zoneA.baseValues.magneticUT + blend * targetZoneConfig.baseValues.magneticUT;
  const baseOrp = (1 - blend) * zoneA.baseValues.orpMv + blend * targetZoneConfig.baseValues.orpMv;
  const baseTurb = (1 - blend) * zoneA.baseValues.turbidityNtu + blend * targetZoneConfig.baseValues.turbidityNtu;
  const baseTemp = (1 - blend) * zoneA.baseValues.tempC + blend * targetZoneConfig.baseValues.tempC;
  const baseVis = (1 - blend) * zoneA.baseValues.visualConfidence + blend * targetZoneConfig.baseValues.visualConfidence;

  // Add realistic small physical noise without erratic jumps
  const piEmResponse = Math.max(0.02, Math.min(0.99, +(basePiEm + wave1 * 0.6 + waveMicro).toFixed(2)));
  const magneticFieldUT = +(baseMag + Math.sin(internalProgress * 0.8) * 0.35 + waveMicro * 5).toFixed(1);
  const orpMv = Math.round(baseOrp + Math.cos(internalProgress * 0.4) * 2.2);
  const turbidityNtu = +(baseTurb + Math.sin(internalProgress * 1.3) * 0.18).toFixed(1);
  const temperatureC = +(baseTemp + Math.sin(internalProgress * 0.25) * 0.04).toFixed(2);
  const visualConfidence = +(baseVis + Math.cos(internalProgress * 0.9) * 0.03).toFixed(2);

  // Depth and spatial orientation
  const baseDepth = (1 - blend) * 124.2 + blend * (targetZoneConfig.depthRange[0] + 0.8);
  const depthM = +(baseDepth + Math.sin(internalProgress * 0.3) * 0.15).toFixed(1);
  const pressureBar = +(depthM * 0.1013).toFixed(1); // 1 bar per 10m approximately
  const altitudeM = +(3.4 + Math.cos(internalProgress * 0.5) * 0.12).toFixed(1);

  // Motion dynamics (gentle tether pendulum and current swaying)
  const headingDeg = Math.round((184 + Math.sin(internalProgress * 0.2) * 4 + 360) % 360);
  const pitchDeg = +(Math.sin(internalProgress * 0.7) * 1.4).toFixed(1);
  const rollDeg = +(Math.cos(internalProgress * 0.9) * 1.8).toFixed(1);

  const readings: LiveSensorReadings = {
    timestamp: Date.now(),
    depthM,
    altitudeM,
    temperatureC,
    pressureBar,
    magneticFieldUT,
    orpMv,
    turbidityNtu,
    piEmResponse,
    headingDeg,
    pitchDeg,
    rollDeg,
    visualConfidence,
    acousticDistanceM: altitudeM,
  };

  const signals = normalizeRawReadings(
    piEmResponse,
    magneticFieldUT,
    orpMv,
    turbidityNtu,
    temperatureC,
    visualConfidence
  );

  return {
    readings,
    signals,
    zone: targetZone,
  };
}
