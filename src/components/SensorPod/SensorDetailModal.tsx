import React from 'react';
import { X, CheckCircle, Activity, Info, ShieldCheck, Zap } from 'lucide-react';
import { SENSORS_METADATA } from '../../data/sensors';
import { SensorId } from '../../types/sensors';

interface SensorDetailModalProps {
  sensorId: SensorId | null;
  onClose: () => void;
}

export function SensorDetailModal({ sensorId, onClose }: SensorDetailModalProps) {
  if (!sensorId || !SENSORS_METADATA[sensorId]) return null;

  const sensor = SENSORS_METADATA[sensorId];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-lg bg-[#0c1626] border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-cyan-500/20">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#09111e]">
          <div className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: sensor.color }}
            />
            <div>
              <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                {sensor.name.toUpperCase()}
                <span className="text-xs px-2 py-0.5 rounded font-mono font-normal bg-slate-800 text-slate-300 border border-slate-700">
                  {sensor.shortName}
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">{sensor.category} Subsystem</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-sm text-slate-300 max-h-[75vh] overflow-y-auto">
          {/* Key Quick Badges */}
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">STATUS</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {sensor.status}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">SAMPLE RATE</span>
              <span className="text-cyan-300 font-semibold mt-0.5 block">
                {sensor.sampleRateHz} Hz
              </span>
            </div>
          </div>

          {/* Primary Engineering Parameters */}
          <div className="space-y-2.5 bg-slate-900/50 p-4 rounded-lg border border-slate-800/80">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-mono">
                Purpose:
              </span>
              <p className="text-slate-200 mt-0.5 font-medium">{sensor.purpose}</p>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-mono">
                Signal:
              </span>
              <p className="text-cyan-300 mt-0.5 font-mono text-xs">{sensor.signalDescription}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/60 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block font-mono">HARDWARE MODEL:</span>
                <span className="text-slate-200 font-mono text-[11px]">{sensor.hardwareModel}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block font-mono">INTERFACE PROTOCOL:</span>
                <span className="text-slate-200 font-mono text-[11px]">{sensor.interfaceProtocol}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-mono">
              <div>
                <span className="text-slate-400 text-[11px] block">NOMINAL RANGE:</span>
                <span className="text-slate-300">{sensor.nominalRange}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">ACCURACY:</span>
                <span className="text-slate-300">{sensor.accuracy}</span>
              </div>
            </div>

            {sensor.weightInFusion > 0 && (
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">FUSION WEIGHT CONTRIBUTION:</span>
                <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300 font-semibold">
                  {(sensor.weightInFusion * 100).toFixed(0)}%
                </span>
              </div>
            )}
          </div>

          {/* Working Principle */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              Working Principle:
            </span>
            <p className="text-xs leading-relaxed text-slate-300 bg-slate-900/30 p-3 rounded-lg border border-slate-800/50">
              {sensor.workingPrinciple}
            </p>
          </div>

          {/* Technical Note */}
          <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              Preliminary Screening Prototype Specification. Calibrated against synthetic seawater test tank conditions before deep tow deployment.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#09111e] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
