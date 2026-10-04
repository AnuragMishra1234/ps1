import React from 'react';
import { SensorId } from '../../types/sensors';
import { SENSORS_METADATA } from '../../data/sensors';

interface Fallback2DViewerProps {
  anomalyLevel: 'normal' | 'candidate' | 'strong';
  selectedSensorId: SensorId | null;
  onSelectSensor: (id: SensorId) => void;
  depthM: number;
}

export function Fallback2DViewer({
  anomalyLevel,
  selectedSensorId,
  onSelectSensor,
  depthM,
}: Fallback2DViewerProps) {
  const statusColor =
    anomalyLevel === 'strong'
      ? '#ef4444'
      : anomalyLevel === 'candidate'
      ? '#f59e0b'
      : '#10b981';

  return (
    <div className="relative w-full h-[520px] bg-[#070e1c] rounded-xl overflow-hidden border border-slate-800 flex flex-col items-center justify-between p-6 select-none">
      {/* Fallback Notice */}
      <div className="absolute top-3 left-4 z-10 text-[11px] font-mono px-2 py-1 rounded bg-slate-900/90 border border-slate-700 text-slate-300">
        2D SCHEMATIC MODE (FALLBACK) • WEBGL ACCELERATED RENDERING COMPATIBLE
      </div>

      {/* Surface Vessel Reference */}
      <div className="w-full flex items-center justify-center pt-2">
        <div className="flex flex-col items-center">
          <div className="w-48 h-8 bg-slate-800 border border-slate-600 rounded-b-lg flex items-center justify-center shadow-lg">
            <span className="text-[11px] font-mono font-semibold text-slate-300 tracking-wider">
              R/V RESEARCH VESSEL
            </span>
          </div>
          <div className="w-full h-0.5 bg-cyan-700/40 mt-1"></div>
        </div>
      </div>

      {/* Tether Line */}
      <div className="relative w-1 flex-1 my-2 bg-gradient-to-b from-sky-400 via-sky-600 to-sky-400 flex items-center justify-center">
        <div className="absolute w-2.5 h-2.5 rounded-full bg-cyan-300 animate-ping"></div>
        <div className="absolute -left-32 text-[10px] font-mono text-cyan-400 px-2 py-0.5 bg-slate-900/80 rounded border border-slate-700">
          RS-485 DIFFERENTIAL TETHER
        </div>
      </div>

      {/* Sensor Pod 2D Schematic */}
      <div className="relative z-10 w-80 p-4 rounded-xl bg-slate-900/95 border-2 border-slate-700 shadow-2xl flex flex-col items-center">
        <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: statusColor }}
            />
            <span className="text-xs font-mono font-bold text-white tracking-wider">
              SUBSEA SENSOR POD
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">DEPTH: {depthM} m</span>
        </div>

        {/* Modular Sensor Grid Buttons */}
        <div className="grid grid-cols-3 gap-2 w-full">
          {Object.values(SENSORS_METADATA).map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectSensor(s.id)}
              className={`px-2 py-1.5 rounded text-[11px] font-mono text-center transition border ${
                selectedSensorId === s.id
                  ? 'bg-cyan-500 text-black font-bold border-cyan-300'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-cyan-500 hover:bg-slate-800'
              }`}
            >
              {s.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Seafloor Reference */}
      <div className="w-full mt-4">
        <div className="w-full h-8 rounded-t-lg bg-gradient-to-t from-slate-900 via-slate-800 to-slate-900/40 border-t border-slate-700/60 flex items-center justify-center">
          <span className="text-[10px] font-mono text-slate-400 tracking-wider">
            BENTHIC SEABED INTERFACE • NOMINAL ALTITUDE: 3.4 m
          </span>
        </div>
      </div>
    </div>
  );
}
