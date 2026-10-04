import React from 'react';
import { Cpu, Terminal, Layers, ShieldCheck, Check } from 'lucide-react';

export function TechStackSection() {
  const hardwareItems = [
    { name: 'PI-EM Coil', spec: 'Bifilar search coil with high-speed damping resistor & FET switch' },
    { name: 'MAG3110 Magnetometer', spec: '3-Axis digital fluxgate / magnetic dipole perturbation sensor' },
    { name: 'ORP Sensor', spec: 'Subsea platinum redox electrode with Ag/AgCl electrolyte reference' },
    { name: 'Turbidity Sensor', spec: '850nm IR nephelometric optical 90° backscatter transducer' },
    { name: 'Temperature Sensor', spec: 'PT1000 Class-A 4-wire RTD with titanium sheath probe' },
    { name: 'MS5837-30BA Pressure', spec: 'Gel-filled piezoresistive 24-bit depth sensor (0-30 bar)' },
    { name: 'MPU9250 IMU', spec: '9-DOF gyro & accelerometer with integrated motion processor' },
    { name: 'Digital Compass', spec: 'Tilt-compensated magnetic azimuth heading tracker' },
    { name: 'Underwater Camera', spec: 'Sony IMX327 ultra-low-light sensor behind acrylic optical dome' },
    { name: 'Acoustic Altimeter / Sonar', spec: '675 kHz narrow-beam micro-sonar for seabed clearance' },
    { name: 'ESP32 Subsea Controller', spec: 'Dual-core 240 MHz MCU with synchronous DMA sampling' },
    { name: 'Raspberry Pi 4', spec: 'Surface host for telemetry ingestion & edge visual inference' },
    { name: 'RS-485 Physical Layer', spec: 'Differential balanced transceiver for 300m+ noise immunity' },
    { name: 'MicroSD Card + RTC', spec: 'Redundant subsea raw logging with DS3231 temperature-compensated clock' },
  ];

  const softwareItems = [
    { name: 'Arduino / C++', role: 'Low-latency firmware on ESP32 with freeRTOS scheduling' },
    { name: 'Python 3.11', role: 'Surface data processing host and telemetry orchestrator' },
    { name: 'NumPy', role: 'Vectorized signal math & moving window matrix transformations' },
    { name: 'SciPy Signal', role: 'Butterworth bandpass filtering & baseline detrending' },
    { name: 'YOLOv5 Edge Model', role: 'Quantized INT8 object classifier for indicative nodule-like detection' },
    { name: 'Leaflet.js & GeoJSON', role: 'Bathymetric survey trackline and anomaly spatial mapping' },
    { name: 'React 18 & TypeScript', role: 'Production component hierarchy and strict type validation' },
    { name: 'Three.js & R3F', role: 'Interactive 3D digital twin rendering & physical camera control' },
    { name: 'Tailwind CSS', role: 'Scientific engineering visual layout and responsive styling' },
    { name: 'Recharts', role: 'High-precision depth profiles and live time-series telemetry charts' },
  ];

  return (
    <section id="tech-stack" className="py-16 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-3">
          SYSTEM COMPONENT INVENTORY
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          TECHNOLOGY STACK
        </h2>
        <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
          Carefully selected modular hardware and battle-tested software engineering. Designed to
          maximize sensor correlation capability while minimizing deployment capital cost.
        </p>
      </div>

      {/* Compact Two-Column Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* HARDWARE COLUMN */}
        <div className="bg-[#0b1424] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-800">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white font-mono tracking-wide">
              HARDWARE SUBSYSTEMS
            </h3>
          </div>

          <div className="space-y-2.5">
            {hardwareItems.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-start gap-2.5 hover:border-slate-700 transition"
              >
                <div className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-slate-200">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                    {item.spec}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SOFTWARE COLUMN */}
        <div className="bg-[#0b1424] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-800">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white font-mono tracking-wide">
              SOFTWARE & ALGORITHMS
            </h3>
          </div>

          <div className="space-y-2.5">
            {softwareItems.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-start gap-2.5 hover:border-slate-700 transition"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-slate-200">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                    {item.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
