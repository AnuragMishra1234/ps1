import { TargetZone } from '../types/sensors';
import { SimulationZone } from '../types/simulation';

export const SIMULATION_ZONES: Record<string, SimulationZone> = {
  zone_a: {
    id: 'zone_a',
    name: 'ZONE A: Baseline Seabed',
    tag: 'Baseline Sediment Basin',
    depthRange: [122.0, 124.5],
    baseValues: {
      piEm: 0.18,
      magneticUT: 44.2,
      orpMv: 18.0,
      turbidityNtu: 1.2,
      tempC: 4.1,
      visualConfidence: 0.12
    },
    expectedScore: 0.21,
    expectedClass: 'Baseline',
    description:
      'Uniform silty-clay pelagic sediment bed without magnetic or conductive anomalies. Ambient oceanic background readings.',
    geologicalFeature: 'Homogeneous Pelagic Silt'
  },
  zone_b: {
    id: 'zone_b',
    name: 'ZONE B: Candidate Anomaly',
    tag: 'Moderate Anomaly Horizon',
    depthRange: [126.0, 128.5],
    baseValues: {
      piEm: 0.67,
      magneticUT: 52.8,
      orpMv: -65.0,
      turbidityNtu: 4.6,
      tempC: 4.8,
      visualConfidence: 0.58
    },
    expectedScore: 0.47,
    expectedClass: 'Candidate Anomaly',
    description:
      'Elevated eddy current response accompanied by localized magnetic dipole deviation and slight turbidity increase. Potential semi-consolidated mineralized crust or nodule field boundary.',
    geologicalFeature: 'Semi-Consolidated Crust & Dispersed Nodules'
  },
  zone_c: {
    id: 'zone_c',
    name: 'ZONE C: Strong Candidate Zone',
    tag: 'High-Priority Prospectivity Anomaly',
    depthRange: [130.0, 133.0],
    baseValues: {
      piEm: 0.82,
      magneticUT: 64.1,
      orpMv: -135.0,
      turbidityNtu: 7.4,
      tempC: 5.4,
      visualConfidence: 0.74
    },
    expectedScore: 0.76,
    expectedClass: 'Strong Candidate',
    description:
      'High conductive decay response combined with significant magnetic susceptibility signature and reducing redox shift. Visual camera indicates high nodule-like object packing density.',
    geologicalFeature: 'Dense Nodule Pavement / Hydrothermal Mineralization Horizon'
  }
};

export interface PipelineStage {
  id: string;
  number: string;
  name: string;
  shortName: string;
  role: string;
  subsystem: 'Underwater Pod' | 'Physical Link' | 'Surface Processing' | 'Analytics & GIS';
  details: string;
  techSpecs: string;
  iconName: string;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'sensors',
    number: '01',
    name: 'Multi-Sensor Array',
    shortName: 'SENSORS',
    role: 'Synchronous multimodal physical parameter acquisition',
    subsystem: 'Underwater Pod',
    details:
      'The sensor head houses nine heterogeneous transducers: inductive coil, fluxgate magnetometer, ORP electrode, nephelometric turbidity optic, RTD probe, piezoresistive pressure cell, 9-DOF IMU, acoustic altimeter, and low-light camera.',
    techSpecs: '9 Modalities • Synchronous 25Hz ADC • Galvanically Isolated Signals',
    iconName: 'Cpu'
  },
  {
    id: 'esp32',
    number: '02',
    name: 'ESP32 Subsea Controller',
    shortName: 'ESP32',
    role: 'Underwater data aggregation & protocol framing',
    subsystem: 'Underwater Pod',
    details:
      'Reads and preprocesses underwater sensor signals before transmission. Executes hardware interrupt routines, sensor calibration lookup tables, hardware timestamping via precision RTC, and serial framing with CRC-32 integrity checking.',
    techSpecs: 'Dual Core 240MHz • 3x Hardware UART • SPI/I2C Masters • DMA Telemetry Buffer',
    iconName: 'Microchip'
  },
  {
    id: 'tether',
    number: '03',
    name: 'RS-485 Tether Link',
    shortName: 'RS-485 TETHER',
    role: 'Noise-immune differential wired data uplink',
    subsystem: 'Physical Link',
    details:
      'Provides wired long-distance serial communication between the underwater pod and surface unit. Differential balanced line pairs cancel subsea electromagnetic motor noise and cable capacitance attenuation across 300+ meters.',
    techSpecs: 'MAX485 Differential Transceiver • 115,200 baud • Shielded Twisted Pair + Kevlar Strain Member',
    iconName: 'Network'
  },
  {
    id: 'raspberry_pi',
    number: '04',
    name: 'Raspberry Pi Surface Unit',
    shortName: 'RASPBERRY PI',
    role: 'Surface host ingestion & vision inference',
    subsystem: 'Surface Processing',
    details:
      'Receives telemetry data from the tether and handles surface processing and optional edge camera inference. Houses local SQLite cache, raw packet decoders, and camera frame grabber.',
    techSpecs: 'Raspberry Pi 4 Model B (4GB) • Linux RT Kernel • USB-RS485 FTDI Interface',
    iconName: 'Server'
  },
  {
    id: 'python_processing',
    number: '05',
    name: 'Python Processing Pipeline',
    shortName: 'PYTHON PROCESSING',
    role: 'Digital signal filtering & baseline detrending',
    subsystem: 'Surface Processing',
    details:
      'Applies NumPy array vectorization and SciPy Butterworth bandpass filters to suppress geomagnetic drift and sensor cable transients. Implements sliding-window moving median detrending on magnetic and EM signals.',
    techSpecs: 'Python 3.11 • NumPy 1.26 • SciPy Signal • Real-Time Async Queue',
    iconName: 'Terminal'
  },
  {
    id: 'sensor_fusion',
    number: '06',
    name: 'Multi-Sensor Fusion Engine',
    shortName: 'SENSOR FUSION',
    role: 'Multi-criteria heuristic correlation & feature extraction',
    subsystem: 'Analytics & GIS',
    details:
      'Fuses normalized electromagnetic, environmental, and indicative visual signals using calibrated domain weightings. Computes cross-correlation metrics between conductivity pulses and magnetic anomalies.',
    techSpecs: 'Weighted Normalization Matrix • Dynamic Thresholding • Noise Rejection Heuristics',
    iconName: 'Workflow'
  },
  {
    id: 'anomaly_score',
    number: '07',
    name: 'Candidate Anomaly Scorer',
    shortName: 'ANOMALY SCORE',
    role: 'Standardized prospectivity index (0.00 – 1.00)',
    subsystem: 'Analytics & GIS',
    details:
      'Computes a real-time candidate prospectivity score. Flags baseline zones (0.0–0.35), moderate candidate anomalies (0.35–0.65), and strong candidate anomalies (>0.65) for operator alerting.',
    techSpecs: 'Range: 0.00 - 1.00 • Green/Amber/Red Tri-State Classification • Audit Log',
    iconName: 'Activity'
  },
  {
    id: 'seafloor_map',
    number: '08',
    name: 'Seafloor Bathymetric GIS Map',
    shortName: 'SEAFLOOR MAP',
    role: 'Spatial waypoint indexing & anomaly grid generation',
    subsystem: 'Analytics & GIS',
    details:
      'Plots survey tracklines, georeferenced anomaly hotspots, and depth profiles. Outputs GeoJSON datasets for integration into marine research GIS packages like QGIS or Caris.',
    techSpecs: 'Leaflet.js Rendering • GeoJSON Export • Real-Time Waypoint Insertion',
    iconName: 'Map'
  }
];

export const DEMONSTRATION_TARGET_ZONES: TargetZone[] = [
  {
    id: 'zone_target_a',
    name: 'Target Zone Alpha (TZ-01)',
    code: 'TZ-01',
    lat: 12.8421,
    lng: 74.9124,
    anomalyScore: 0.76,
    depthM: 126.2,
    surveyDistanceM: 320,
    indicators: ['PI-EM (0.82)', 'Magnetic Dipole (0.64)', 'Environmental ORP (-135 mV)'],
    recommendation: 'Prioritize for detailed investigation via scientific ROV core sampling.',
    visualConfirmed: true,
    priorityLevel: 'High Priority',
    geologicalContext:
      'Subsurface conductive anomaly correlated with distinct magnetic gradient and localized redox reduction.'
  },
  {
    id: 'zone_target_b',
    name: 'Target Zone Beta (TZ-02)',
    code: 'TZ-02',
    lat: 12.8458,
    lng: 74.9189,
    anomalyScore: 0.69,
    depthM: 131.4,
    surveyDistanceM: 580,
    indicators: ['PI-EM (0.71)', 'Visual Object Detection (0.68)', 'Turbidity Plume (5.8 NTU)'],
    recommendation: 'Prioritize for detailed investigation with high-resolution photographic survey.',
    visualConfirmed: true,
    priorityLevel: 'High Priority',
    geologicalContext:
      'Optical seabed observation reveals high spatial density of nodule-like morphologies alongside moderate conductivity response.'
  }
];

export const REAL_WORLD_WORKFLOW_STEPS = [
  {
    title: 'Low-Cost Preliminary Survey',
    subtitle: 'Deployable Sensor Pod',
    description: 'Rapid wide-area seabed screening using inexpensive tethered pod from small research vessel.',
    step: '1'
  },
  {
    title: 'Multi-Sensor Data Acquisition',
    subtitle: 'Synchronous Telemetry',
    description: 'Continuous logging of electromagnetic, geochemical, optical, and bathymetric indicators.',
    step: '2'
  },
  {
    title: 'Real-Time Anomaly Mapping',
    subtitle: 'Fusion & GIS Correlation',
    description: 'Automated candidate prospectivity scoring and spatial heatmapping along tracklines.',
    step: '3'
  },
  {
    title: 'Target Prioritization',
    subtitle: 'Candidate Hotspot Ranking',
    description: 'Filtering highest-confidence anomalies to generate optimized coordinates for follow-up.',
    step: '4'
  },
  {
    title: 'Detailed ROV / AUV Survey',
    subtitle: 'High-Cost Asset Deployment',
    description: 'Targeted core drilling, high-resolution sonars, and physical grab sampling at prioritized sites.',
    step: '5'
  }
];
