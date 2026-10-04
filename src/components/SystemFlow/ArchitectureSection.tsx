import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Network,
  Server,
  Terminal,
  Workflow,
  MapPin,
  FileText,
  ArrowDown,
  Info,
} from 'lucide-react';

interface ArchBlock {
  id: string;
  name: string;
  sub: string;
  role: string;
  functionText: string;
  icon: React.ElementType;
  badge: string;
}

export function ArchitectureSection() {
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);

  const blocks: ArchBlock[] = [
    {
      id: 'pod_sensors',
      name: 'SEAFLOOR SENSOR POD (ARRAY)',
      sub: 'PI-EM • MAGNETOMETER • ORP • TURBIDITY • TEMPERATURE • PRESSURE • IMU • CAMERA • SONAR',
      role: 'Underwater Multimodal Sensing',
      functionText:
        'Nine integrated physical sensors continuously observe the seabed environment: electromagnetic induction coil, 3-axis fluxgate magnetometer, redox electrode, optical backscatter, platinum RTD, piezoresistive pressure cell, 9-DOF IMU, low-light camera, and sonar.',
      icon: Layers,
      badge: 'BENTHIC POD',
    },
    {
      id: 'esp32_controller',
      name: 'ESP32 UNDERWATER CONTROLLER',
      sub: '240MHz Dual-Core • DMA • Precision RTC • Hardware CRC',
      role: 'Subsea Signal Digitization & Protocol Framing',
      functionText:
        'Samples multi-channel ADC lines at 25Hz, reads I2C/SPI digital sensors, calculates local checksums, and serializes telemetry packets with microsecond hardware timestamps.',
      icon: Cpu,
      badge: 'EMBEDDED MCU',
    },
    {
      id: 'rs485_tether',
      name: 'RS-485 WIRED TETHER',
      sub: 'Differential Balanced Line • Shielded Twisted Pair • Kevlar Core',
      role: 'Long-Distance Noise-Immune Data Uplink',
      functionText:
        'Transmits continuous telemetry over 300+ meters of marine cable without data loss or ground loop noise. Operates at 115,200 baud with high common-mode rejection.',
      icon: Network,
      badge: 'PHYSICAL LINK',
    },
    {
      id: 'raspberry_pi_surface',
      name: 'RASPBERRY PI SURFACE UNIT',
      sub: 'Surface Host • Telemetry Ingestion • Local Edge Database',
      role: 'Surface Ingestion & Video Inference Host',
      functionText:
        'Receives real-time RS-485 frames on the research vessel deck, synchronizes shipboard GPS navigation, and hosts quantized edge YOLOv5 frame analysis.',
      icon: Server,
      badge: 'DECK UNIT',
    },
    {
      id: 'python_processing',
      name: 'PYTHON DATA PROCESSING',
      sub: 'NumPy Vectorization • SciPy Butterworth Filters • Detrending',
      role: 'Signal Conditioning & Transient Suppression',
      functionText:
        'Executes digital bandpass filtering, detrends geomagnetic background shifts, and computes moving-window statistical metrics for each sensing modality.',
      icon: Terminal,
      badge: 'ALGORITHMS',
    },
    {
      id: 'sensor_fusion',
      name: 'SENSOR FUSION & ANOMALY SCORING',
      sub: 'Weighted Multi-Criteria Evaluation Matrix (0.00 – 1.00)',
      role: 'Multi-Modal Correlation Engine',
      functionText:
        'Correlates electromagnetic decay with magnetic susceptibility, geochemical redox shifts, turbidity plumes, and visual detections into a normalized candidate anomaly score.',
      icon: Workflow,
      badge: 'FUSION ENGINE',
    },
    {
      id: 'seafloor_mapping',
      name: 'SEAFLOOR MAPPING & GIS',
      sub: 'Leaflet.js • GeoJSON • Real-Time Bathymetric Trackline',
      role: 'Spatial Visualization & Heatmap Generation',
      functionText:
        'Projects surveyed points onto georeferenced coordinates with color-coded prospectivity alerts, enabling immediate identification of anomalous seabed clusters.',
      icon: MapPin,
      badge: 'GIS MAPPING',
    },
    {
      id: 'decision_output',
      name: 'DECISION & OUTPUT',
      sub: 'Candidate Prioritization • Target Zone Ranking • ROV Survey Plan',
      role: 'Actionable Exploration Deliverable',
      functionText:
        'Generates automated Target Zone dossiers (coordinates, depth, dominant signatures, confidence scores) so costly high-depth ROVs/AUVs only dive on verified hotspots.',
      icon: FileText,
      badge: 'DECISION SUPPORT',
    },
  ];

  return (
    <section id="architecture" className="py-16 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-3">
          END-TO-END DATAFLOW PIPELINE
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          SYSTEM ARCHITECTURE
        </h2>
        <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
          Hover over or tap any tier in the stack to inspect its operational role in the overall
          ocean exploration workflow.
        </p>
      </div>

      {/* Vertical Interactive Flow Diagram */}
      <div className="max-w-4xl mx-auto space-y-3">
        {blocks.map((block, idx) => {
          const isHovered = activeHoverId === block.id;
          const Icon = block.icon;

          return (
            <React.Fragment key={block.id}>
              {/* Architecture Tier Block */}
              <div
                onMouseEnter={() => setActiveHoverId(block.id)}
                onMouseLeave={() => setActiveHoverId(null)}
                onClick={() => setActiveHoverId(isHovered ? null : block.id)}
                className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isHovered
                    ? 'bg-slate-800/95 border-cyan-400 shadow-xl shadow-cyan-950/50 scale-[1.01]'
                    : 'bg-[#0b1424] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-lg ${
                        isHovered ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-cyan-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold font-mono text-white tracking-wider">
                        {block.name}
                      </h4>
                      <p className="text-[11px] font-mono text-cyan-400 mt-0.5">
                        {block.sub}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      isHovered
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {block.badge}
                  </span>
                </div>

                {/* Expanded function description */}
                <div
                  className={`mt-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300 leading-relaxed font-sans transition-all duration-200 ${
                    isHovered ? 'opacity-100 max-h-32' : 'opacity-75 max-h-24'
                  }`}
                >
                  <span className="font-mono text-cyan-300 font-semibold">{block.role}: </span>
                  {block.functionText}
                </div>
              </div>

              {/* Vertical connector arrow */}
              {idx < blocks.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown className="w-4 h-4 text-slate-600 animate-pulse" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}
