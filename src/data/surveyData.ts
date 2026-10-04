import { SurveyPoint } from '../types/sensors';

// Generates a realistic 142-point seafloor trackline with 2 clear candidate anomaly clusters
export function generateInitialSurveyTrack(): SurveyPoint[] {
  const points: SurveyPoint[] = [];
  const baseLat = 12.839;
  const baseLng = 74.905;
  const totalPoints = 142;

  for (let i = 0; i < totalPoints; i++) {
    const progress = i / totalPoints;
    const distanceM = Math.round(i * 5.2); // ~740 meters total
    // Lawn-mower or winding ocean survey trackline
    const latOffset = progress * 0.008 + Math.sin(progress * Math.PI * 4) * 0.0012;
    const lngOffset = progress * 0.016 + Math.cos(progress * Math.PI * 4) * 0.001;

    // Depth gradually increases with gentle bathymetric undulations
    const baseDepth = 122.0 + progress * 9.5 + Math.sin(progress * 12) * 1.8;
    const altitude = 3.2 + Math.cos(progress * 15) * 0.4;

    // Cluster 1 around index 55-68 (Target Zone A)
    const distToZoneA = Math.abs(i - 62);
    // Cluster 2 around index 108-120 (Target Zone B)
    const distToZoneB = Math.abs(i - 114);

    let piEm = 0.16 + (Math.sin(i * 0.4) * 0.04);
    let mag = 0.20 + (Math.cos(i * 0.3) * 0.05);
    let orp = 0.22 + (Math.sin(i * 0.5) * 0.03);
    let turb = 0.18 + (Math.cos(i * 0.2) * 0.03);
    let temp = 0.25 + (Math.sin(i * 0.2) * 0.02);
    let visual = 0.15 + (Math.cos(i * 0.6) * 0.04);

    if (distToZoneA < 10) {
      const weightA = 1 - distToZoneA / 10;
      piEm = Math.min(1.0, piEm + 0.68 * weightA);
      mag = Math.min(1.0, mag + 0.48 * weightA);
      orp = Math.min(1.0, orp + 0.42 * weightA);
      turb = Math.min(1.0, turb + 0.45 * weightA);
      temp = Math.min(1.0, temp + 0.22 * weightA);
      visual = Math.min(1.0, visual + 0.52 * weightA);
    } else if (distToZoneB < 9) {
      const weightB = 1 - distToZoneB / 9;
      piEm = Math.min(1.0, piEm + 0.56 * weightB);
      mag = Math.min(1.0, mag + 0.38 * weightB);
      orp = Math.min(1.0, orp + 0.32 * weightB);
      turb = Math.min(1.0, turb + 0.54 * weightB);
      temp = Math.min(1.0, temp + 0.18 * weightB);
      visual = Math.min(1.0, visual + 0.60 * weightB);
    }

    // Weighted fusion formula
    const anomalyScore = Math.min(
      0.99,
      piEm * 0.32 +
      mag * 0.24 +
      orp * 0.14 +
      turb * 0.12 +
      temp * 0.08 +
      visual * 0.10
    );

    let classification: 'Baseline' | 'Candidate Anomaly' | 'Strong Candidate' = 'Baseline';
    if (anomalyScore >= 0.65) {
      classification = 'Strong Candidate';
    } else if (anomalyScore >= 0.40) {
      classification = 'Candidate Anomaly';
    }

    // Fake timestamp (e.g. 10:00:00 + i*2 seconds)
    const minutes = Math.floor((i * 4) / 60);
    const seconds = (i * 4) % 60;
    const timeStr = `10:${String(minutes + 12).padStart(2, '0')}:${String(seconds).padStart(2, '0')} UTC`;

    points.push({
      id: `P${String(i + 1).padStart(2, '0')}`,
      index: i + 1,
      timestamp: timeStr,
      lat: +(baseLat + latOffset).toFixed(6),
      lng: +(baseLng + lngOffset).toFixed(6),
      surveyDistanceM: distanceM,
      depthM: +baseDepth.toFixed(1),
      altitudeM: +altitude.toFixed(1),
      anomalyScore: +anomalyScore.toFixed(2),
      classification,
      signals: {
        piEm: +piEm.toFixed(2),
        magnetic: +mag.toFixed(2),
        orp: +orp.toFixed(2),
        turbidity: +turb.toFixed(2),
        temperature: +temp.toFixed(2),
        visual: +visual.toFixed(2),
      },
      rawReadings: {
        depthM: +baseDepth.toFixed(1),
        pressureBar: +(baseDepth * 0.1013).toFixed(1),
        temperatureC: +(4.2 + temp * 1.5).toFixed(1),
        magneticFieldUT: +(44.0 + mag * 22.0).toFixed(1),
        orpMv: Math.round(20 - orp * 180),
        turbidityNtu: +(1.0 + turb * 8.0).toFixed(1),
        piEmResponse: +piEm.toFixed(2),
        headingDeg: Math.round(180 + Math.sin(i * 0.2) * 15),
      }
    });
  }

  return points;
}
