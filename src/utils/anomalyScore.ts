import { AnomalyEvaluation, NormalizedSensorSignals } from '../types/sensors';

export interface FusionWeights {
  piEm: number;
  magnetic: number;
  orp: number;
  turbidity: number;
  temperature: number;
  visual: number;
}

export const DEFAULT_FUSION_WEIGHTS: FusionWeights = {
  piEm: 0.32,
  magnetic: 0.24,
  orp: 0.14,
  turbidity: 0.12,
  temperature: 0.08,
  visual: 0.10,
};

/**
 * Calculates candidate anomaly score based on weighted multi-sensor indicators.
 * Normalized to 0.00 - 1.00.
 *
 * NOTE: This is a prototype candidate prospectivity score for preliminary seabed screening,
 * NOT a validated mineral probability or direct REE assay.
 */
export function computeAnomalyScore(
  signals: NormalizedSensorSignals,
  weights: FusionWeights = DEFAULT_FUSION_WEIGHTS
): AnomalyEvaluation {
  // Normalize weights sum to 1.0 to ensure mathematical validity
  const weightSum =
    weights.piEm +
    weights.magnetic +
    weights.orp +
    weights.turbidity +
    weights.temperature +
    weights.visual;

  const wPiEm = weights.piEm / weightSum;
  const wMag = weights.magnetic / weightSum;
  const wOrp = weights.orp / weightSum;
  const wTurb = weights.turbidity / weightSum;
  const wTemp = weights.temperature / weightSum;
  const wVis = weights.visual / weightSum;

  const rawScore =
    signals.piEm * wPiEm +
    signals.magnetic * wMag +
    signals.orp * wOrp +
    signals.turbidity * wTurb +
    signals.temperature * wTemp +
    signals.visual * wVis;

  const score = Math.max(0, Math.min(1, +rawScore.toFixed(2)));

  let classification: 'Baseline' | 'Candidate Anomaly' | 'Strong Candidate' = 'Baseline';
  let level: 'normal' | 'candidate' | 'strong' = 'normal';

  if (score >= 0.65) {
    classification = 'Strong Candidate';
    level = 'strong';
  } else if (score >= 0.40) {
    classification = 'Candidate Anomaly';
    level = 'candidate';
  } else {
    classification = 'Baseline';
    level = 'normal';
  }

  // Find dominant contributing signals
  const indicatorContributions = [
    { name: 'PI-EM Conductivity', value: signals.piEm * wPiEm },
    { name: 'Magnetic Field Vector', value: signals.magnetic * wMag },
    { name: 'ORP Redox Shift', value: signals.orp * wOrp },
    { name: 'Optical Turbidity Plume', value: signals.turbidity * wTurb },
    { name: 'Thermal Anomaly', value: signals.temperature * wTemp },
    { name: 'Visual Nodule Morphology', value: signals.visual * wVis },
  ];

  indicatorContributions.sort((a, b) => b.value - a.value);
  const dominantIndicators = indicatorContributions
    .filter((c) => c.value > 0.06)
    .slice(0, 3)
    .map((c) => c.name);

  return {
    score,
    classification,
    level,
    dominantIndicators: dominantIndicators.length > 0 ? dominantIndicators : ['Baseline Ambient Background'],
    confidence: +(0.68 + (score > 0.6 ? 0.18 : 0.08)).toFixed(2),
    calculatedAt: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' UTC',
  };
}

/**
 * Normalizes raw physical measurements into standard 0.0 - 1.0 unitless signals
 */
export function normalizeRawReadings(
  piEmRaw: number, // 0 - 1
  magneticUT: number, // 40 - 75 uT
  orpMv: number, // +50 to -250 mV
  turbidityNtu: number, // 0.5 to 12 NTU
  tempC: number, // 3.5 to 7.0 C
  visualConf: number // 0 - 1
): NormalizedSensorSignals {
  // PI-EM is already 0.0 - 1.0
  const piEm = Math.max(0, Math.min(1, piEmRaw));

  // Magnetic: baseline is ~44 uT. Anomaly pushes to 65+ uT
  const magNorm = Math.max(0, Math.min(1, (magneticUT - 42.0) / 25.0));

  // ORP: baseline is positive (+20 mV). Reducing mineralization plume is negative (-150 mV)
  const orpNorm = Math.max(0, Math.min(1, (25.0 - orpMv) / 180.0));

  // Turbidity: baseline ~1.0 NTU. Plume is 5-10 NTU
  const turbNorm = Math.max(0, Math.min(1, (turbidityNtu - 1.0) / 7.5));

  // Temperature: baseline ~4.1 C. Thermal anomaly is up to +2.5 C
  const tempNorm = Math.max(0, Math.min(1, (tempC - 4.0) / 2.5));

  // Visual
  const visual = Math.max(0, Math.min(1, visualConf));

  return {
    piEm: +piEm.toFixed(2),
    magnetic: +magNorm.toFixed(2),
    orp: +orpNorm.toFixed(2),
    turbidity: +turbNorm.toFixed(2),
    temperature: +tempNorm.toFixed(2),
    visual: +visual.toFixed(2),
  };
}
