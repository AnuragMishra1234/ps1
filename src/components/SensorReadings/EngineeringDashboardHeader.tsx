import React from 'react';
import { Activity, Radio, Cpu, Network, Database, ShieldCheck, Clock } from 'lucide-react';
import { AnomalyEvaluation } from '../../types/sensors';

interface EngineeringDashboardHeaderProps {
  depthM: number;
  evaluation: AnomalyEvaluation;
  surveyPointsCount: number;
  isOnline?: boolean;
}

export function EngineeringDashboardHeader({
  depthM,
  evaluation,
  surveyPointsCount,
  isOnline = true,
}: EngineeringDashboardHeaderProps) {
  return (
    <div className="w-full bg-[#070e1c] border-y border-slate-800 py-3 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        {/* Left: System Status Telemetry Badges */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* SYSTEM STATUS */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">SYSTEM STATUS:</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              ONLINE
            </span>
          </div>

          {/* SENSOR POD */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">SENSOR POD:</span>
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              CONNECTED
            </span>
          </div>

          {/* RS-485 LINK */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">RS-485 LINK:</span>
            <span className="flex items-center gap-1.5 text-sky-400 font-bold">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              ACTIVE (115.2 kbps)
            </span>
          </div>

          {/* DATA STREAM */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">DATA STREAM:</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              LIVE (25 Hz)
            </span>
          </div>
        </div>

        {/* Right: Key Survey Metrics */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* DEPTH */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">DEPTH:</span>
            <span className="text-white font-bold text-sm">
              {depthM.toFixed(1)} <span className="text-slate-400 font-normal text-xs">m</span>
            </span>
          </div>

          {/* ANOMALY SCORE */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">ANOMALY SCORE:</span>
            <span
              className={`font-bold text-sm px-2 py-0.5 rounded border ${
                evaluation.level === 'strong'
                  ? 'text-rose-400 bg-rose-950/40 border-rose-800'
                  : evaluation.level === 'candidate'
                  ? 'text-amber-400 bg-amber-950/40 border-amber-800'
                  : 'text-emerald-400 bg-emerald-950/40 border-emerald-800'
              }`}
            >
              {evaluation.score.toFixed(2)}
            </span>
          </div>

          {/* SURVEY POINTS */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">SURVEY POINTS:</span>
            <span className="text-cyan-300 font-bold">{surveyPointsCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
