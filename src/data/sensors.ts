import { SensorMetadata } from '../types/sensors';

export const SENSORS_METADATA: Record<string, SensorMetadata> = {
  pi_em: {
    id: 'pi_em',
    name: 'Pulse Induction EM Coil',
    shortName: 'PI-EM',
    category: 'Electromagnetic',
    purpose: 'Conductive anomaly detection',
    signalDescription: 'Decay curve eddy current response',
    hardwareModel: 'Custom Bifilar Inductive Coil + Fast FET Preamp',
    interfaceProtocol: 'Differential Analog / High-Speed SPI ADC',
    status: 'ACTIVE',
    sampleRateHz: 25,
    unit: 'Normalized Signal (0-1.0)',
    nominalRange: '0.00 – 1.00',
    accuracy: '±0.02 Relative Conductive Inductance',
    weightInFusion: 0.32,
    color: '#06b6d4', // Cyan
    position3D: [0, -0.65, 0], // Bottom coil array
    workingPrinciple:
      'Emits high-intensity transient magnetic pulses into seabed sediments. Metallic or highly conductive conductors sustain secondary eddy currents, whose exponential decay time-constant is measured during the receive window.'
  },
  magnetometer: {
    id: 'magnetometer',
    name: '3-Axis Magnetometer',
    shortName: 'MAGNETOMETER',
    category: 'Electromagnetic',
    purpose: 'Magnetic anomaly detection',
    signalDescription: 'Total ambient magnetic field vector response',
    hardwareModel: 'MAG3110 / PNI 3-Axis Fluxgate Module',
    interfaceProtocol: 'I2C / 400 kHz Fast-Mode',
    status: 'ACTIVE',
    sampleRateHz: 40,
    unit: 'µT (microTesla)',
    nominalRange: '20.0 – 85.0 µT',
    accuracy: '±0.1 µT',
    weightInFusion: 0.24,
    color: '#3b82f6', // Ocean Blue
    position3D: [0, 0.45, -0.55], // Isolated boom rear
    workingPrinciple:
      'Measures local seabed magnetic remanence and susceptibility anomalies. Crusts or iron-manganese deposits induce detectable dipole perturbations against geomagnetic background.'
  },
  orp: {
    id: 'orp',
    name: 'Oxidation-Reduction Potential (ORP) Sensor',
    shortName: 'ORP',
    category: 'Environmental',
    purpose: 'Environmental / hydrothermal activity indicator',
    signalDescription: 'Redox potential difference vs Ag/AgCl reference',
    hardwareModel: 'Sealed Platinum Electrode Subsea Probe',
    interfaceProtocol: 'Ultra-High-Z Analog Op-Amp + 16-bit ADC',
    status: 'ACTIVE',
    sampleRateHz: 4,
    unit: 'mV',
    nominalRange: '-400 to +400 mV',
    accuracy: '±5 mV',
    weightInFusion: 0.14,
    color: '#10b981', // Emerald
    position3D: [-0.42, -0.2, 0.35], // Port environmental intake
    workingPrinciple:
      'Detects reducing chemical species (H2S, Fe2+, Mn2+) associated with seabed mineralization plumes or hydrothermal venting fluid seepage.'
  },
  turbidity: {
    id: 'turbidity',
    name: 'Optical Turbidity & Backscatter Sensor',
    shortName: 'TURBIDITY',
    category: 'Environmental',
    purpose: 'Suspended-particle / benthic plume indicator',
    signalDescription: '850 nm Near-IR nephelometric 90° backscatter',
    hardwareModel: 'Mini Optical Turbidity Transducer',
    interfaceProtocol: 'Analog 0-3.3V / UART',
    status: 'ACTIVE',
    sampleRateHz: 10,
    unit: 'NTU',
    nominalRange: '0.1 – 100.0 NTU',
    accuracy: '±0.2 NTU',
    weightInFusion: 0.12,
    color: '#f59e0b', // Amber
    position3D: [0.42, -0.2, 0.35], // Starboard environmental flow
    workingPrinciple:
      'Measures optical scattering from suspended particulate matter, active chimney particulate venting, or resuspension caused by benthic boundary layer currents.'
  },
  temperature: {
    id: 'temperature',
    name: 'Fast-Response Seabed Temperature Probe',
    shortName: 'TEMPERATURE',
    category: 'Environmental',
    purpose: 'Environmental / thermal plume indicator',
    signalDescription: 'Seabed ambient temperature profile',
    hardwareModel: 'PT1000 Platinum RTD Class A 4-wire with titanium sheath',
    interfaceProtocol: 'MAX31865 RTD-to-Digital SPI',
    status: 'ACTIVE',
    sampleRateHz: 10,
    unit: '°C',
    nominalRange: '1.0 – 35.0 °C',
    accuracy: '±0.05 °C',
    weightInFusion: 0.08,
    color: '#ec4899', // Pink
    position3D: [0.45, -0.4, -0.2], // Lower thermal nose
    workingPrinciple:
      'Identifies subtle thermal anomalies (+0.1°C to +3°C) that signify diffuse seafloor fluid seepage or thermal dissipation near hydrothermal structures.'
  },
  pressure: {
    id: 'pressure',
    name: 'Piezoresistive Depth Pressure Sensor',
    shortName: 'PRESSURE',
    category: 'Navigation & Spatial',
    purpose: 'Precision subsea depth measurement',
    signalDescription: 'Hydrostatic pressure & calibrated bathymetry',
    hardwareModel: 'MS5837-30BA Gel-Filled Subsea Sensor',
    interfaceProtocol: 'I2C / 24-bit Sigma-Delta ADC',
    status: 'ACTIVE',
    sampleRateHz: 20,
    unit: 'bar / Depth m',
    nominalRange: '0 – 30 bar (0 – 300 m)',
    accuracy: '±0.2 mbar (depth resolution ~2mm)',
    weightInFusion: 0.0,
    color: '#6366f1', // Indigo
    position3D: [-0.35, 0.3, 0.2], // Port mid-hull port
    workingPrinciple:
      'Gel-filled ceramic membrane converts seawater hydrostatic column pressure to absolute depth using standard UNESCO seawater equation of state.'
  },
  imu: {
    id: 'imu',
    name: '9-DOF Inertial Measurement Unit & Compass',
    shortName: 'IMU / COMPASS',
    category: 'Navigation & Spatial',
    purpose: 'Orientation, pitch, roll and magnetic heading tracking',
    signalDescription: 'Euler angles, angular velocity & linear acceleration',
    hardwareModel: 'MPU9250 / ICM-20948 with onboard DMP',
    interfaceProtocol: 'SPI / 1 MHz',
    status: 'ACTIVE',
    sampleRateHz: 100,
    unit: 'Degrees (°)',
    nominalRange: 'Heading: 0-360°, Pitch: ±90°, Roll: ±180°',
    accuracy: 'Heading ±1.5°, Attitude ±0.5°',
    weightInFusion: 0.0,
    color: '#8b5cf6', // Violet
    position3D: [0, 0.1, 0], // Center of gravity inside housing
    workingPrinciple:
      'Tracks underwater pod motion dynamics, tilt, roll stability, and heading vector. Provides spatial compensation for magnetometry and sonar pointing geometry.'
  },
  camera: {
    id: 'camera',
    name: 'Underwater Low-Light Visual Module',
    shortName: 'CAMERA',
    category: 'Visual & Acoustic',
    purpose: 'Visual seabed observation & nodule-like object analysis',
    signalDescription: 'HD video stream & Edge YOLO inference confidence',
    hardwareModel: 'Sony IMX327 Ultra-Low-Light Sensor + Dome Port',
    interfaceProtocol: 'MIPI CSI-2 / Surface H.264 stream via Pi',
    status: 'ACTIVE',
    sampleRateHz: 15,
    unit: 'Inference Confidence (0-1.0)',
    nominalRange: '0.00 – 1.00',
    accuracy: 'Object bounding box & texture segmentation',
    weightInFusion: 0.10,
    color: '#0ea5e9', // Sky blue
    position3D: [0, -0.15, 0.65], // Forward nose glass dome
    workingPrinciple:
      'Performs optical survey illuminated by pulsed LED array. Surface Raspberry Pi runs quantized edge detector for candidate nodule-like surface texture verification.'
  },
  sonar: {
    id: 'sonar',
    name: 'Acoustic Altimeter / Micro-Sonar',
    shortName: 'SONAR',
    category: 'Visual & Acoustic',
    purpose: 'Seabed distance & micro-bathymetric clearance',
    signalDescription: '675 kHz Narrow-beam acoustic time-of-flight',
    hardwareModel: 'Mini-Transducer Sealed PZT Echo Altimeter',
    interfaceProtocol: 'RS-232 / UART TTL 115200 bps',
    status: 'ACTIVE',
    sampleRateHz: 10,
    unit: 'Meters (m)',
    nominalRange: '0.2 – 50.0 m',
    accuracy: '±0.01 m',
    weightInFusion: 0.0,
    color: '#14b8a6', // Teal
    position3D: [0, -0.4, 0.3], // Downward acoustic transceiver
    workingPrinciple:
      'Emits narrow-beam high-frequency ultrasound pulses downward to calculate exact clearance height above seabed terrain, preventing pod grounding.'
  }
};

export const SENSOR_LIST = Object.values(SENSORS_METADATA);
