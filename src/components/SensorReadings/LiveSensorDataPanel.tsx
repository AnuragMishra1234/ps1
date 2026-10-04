import React from 'react';
import { LiveSensorReadings, AnomalyEvaluation } from '../../types/sensors';
import { Activity, Gauge, Compass, Waves, Thermometer, Radio, Eye, Anchor } from 'lucide-react';

interface LiveSensorDataPanelProps {
  readings: LiveSensorReadings;
  evaluation: AnomalyEvaluation;
  currentZone: 'zone_a' | 'zone_b' | 'zone_c';
  onSelectZone: (zone: 'zone_a' | 'zone_b' | 'zone_c') => void;
}

export function LiveSensorDataPanel({
  readings,
  evaluation,
  currentZone,
  onSelectZone,
}: LiveSensorDataPanelProps) {
  // Anomaly status color
  const statusColor =
    evaluation.level === 'strong'
      ? 'border-rose-500/50 bg-rose-950/20 text-rose-400'
      : evaluation.level === 'candidate'
      ? 'border-amber-500/50 bg-amber-950/20 text-amber-400'
      : 'border-emerald-500/50 bg-emerald-950/20 text-emerald-400';

  return (
    <div className="bg-[#0b1322] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
      {/* Header with Mandatory Prototype Disclaimers */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <div>
              <h2 className="text-sm font-bold tracking-wider text-white font-mono uppercase">
                LIVE SENSOR DATA
              </h2>
              <p className="text-[11px] font-mono text-cyan-400">
                SYNCHRONOUS SUBSEA TELEMETRY STREAM
              </p>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700/80 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            SIMULATED SENSOR DATA
          </div>
        </div>

        {/* Core Live Sensor Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          {/* Depth */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-mono">Depth</span>
              <Anchor className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {readings.depthM.toFixed(1)} <span className="text-xs font-normal text-slate-400">m</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">MS5837 Barometric</span>
          </div>

          {/* Temperature */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-mono">Temperature</span>
              <Thermometer className="w-3.5 h-3.5 text-pink-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {readings.temperatureC.toFixed(1)} <span className="text-xs font-normal text-slate-400">°C</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">PT1000 Sheath RTD</span>
          </div>

          {/* Pressure */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-mono">Pressure</span>
              <Gauge className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {readings.pressureBar.toFixed(1)} <span className="text-xs font-normal text-slate-400">bar</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Hydrostatic Column</span>
          </div>

          {/* Magnetic Field */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-mono">Magnetic Field</span>
              <Compass className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {readings.magneticFieldUT.toFixed(1)} <span className="text-xs font-normal text-slate-400">µT</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">3-Axis MAG3110</span>
          </div>

          {/* ORP */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-mono">ORP</span>
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {readings.orpMv} <span className="text-xs font-normal text-slate-400">mV</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Redox Electrode</span>
          </div>

          {/* Turbidity */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-mono">Turbidity</span>
              <Waves className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {readings.turbidityNtu.toFixed(1)} <span className="text-xs font-normal text-slate-400">NTU</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Optical 90° Backscatter</span>
          </div>

          {/* PI-EM Response */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-mono font-semibold text-cyan-400">PI-EM Response</span>
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            </div>
            <div className="text-xl font-bold font-mono text-cyan-300">
              {readings.piEmResponse.toFixed(2)}
            </div>
            <span className="text-[10px] font-mono text-slate-400">Conductivity Decay</span>
          </div>

          {/* Heading */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-mono">Heading</span>
              <Compass className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {readings.headingDeg}°
            </div>
            <span className="text-[10px] font-mono text-slate-400">MPU9250 Compass</span>
          </div>
        </div>
      </div>

      {/* Manual Zone Simulation Selector */}
      <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">SEABED SECTOR:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelectZone('zone_a')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition ${
                currentZone === 'zone_a'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500 font-semibold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Baseline
            </button>
            <button
              onClick={() => onSelectZone('zone_b')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition ${
                currentZone === 'zone_b'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500 font-semibold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Candidate Zone
            </button>
            <button
              onClick={() => onSelectZone('zone_c')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition ${
                currentZone === 'zone_c'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500 font-semibold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Strong Candidate
            </button>
          </div>
        </div>

        {/* Real-time Candidate Anomaly Tag */}
        <div className={`px-3 py-1 rounded-lg border text-xs font-mono font-semibold flex items-center gap-2 ${statusColor}`}>
          <span className="w-2 h-2 rounded-full bg-current"></span>
          <span>CURRENT: {evaluation.classification.toUpperCase()} ({evaluation.score.toFixed(2)})</span>
        </div>
      </div>
    </div>
  );
}
