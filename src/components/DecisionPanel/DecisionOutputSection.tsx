import React from 'react';
import { DEMONSTRATION_TARGET_ZONES, REAL_WORLD_WORKFLOW_STEPS } from '../../data/simulation';
import { TargetZone } from '../../types/sensors';
import {
  CheckCircle2,
  AlertTriangle,
  Compass,
  ArrowRight,
  ShieldCheck,
  Target,
  FileCheck,
  ChevronRight,
  Layers,
} from 'lucide-react';

export function DecisionOutputSection() {
  return (
    <section id="decision-output" className="py-16 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-3">
          SYNTHESIZED MISSION REPORT
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          DECISION & SURVEY OUTPUT
        </h2>
        <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
          Aggregated candidate prospectivity deliverables to optimize expensive subsequent deep-sea
          interventions.
        </p>
      </div>

      {/* Main Survey Summary Banner */}
      <div className="bg-[#0b1424] border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white font-mono tracking-wide">
                SEAFLOOR SURVEY RESULT
              </h3>
            </div>
            <p className="text-xs font-mono text-emerald-400 mt-1">
              SURVEY COMPLETED • ALL TELEMETRY FRAMES PROCESSED
            </p>
          </div>

          <div className="px-3 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-slate-400">
            DEMONSTRATION DATASET
          </div>
        </div>

        {/* 3 Key Overall Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-mono text-slate-400 block uppercase">
              SURVEY POINTS COLLECTED
            </span>
            <div className="text-3xl font-bold font-mono text-white mt-1">142</div>
            <span className="text-[11px] font-mono text-slate-500">
              Synchronous 9-channel waypoints
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-mono text-slate-400 block uppercase">
              CANDIDATE ANOMALY ZONES
            </span>
            <div className="text-3xl font-bold font-mono text-amber-400 mt-1">6</div>
            <span className="text-[11px] font-mono text-slate-500">
              Score threshold ≥ 0.40
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-mono text-slate-400 block uppercase">
              PRIORITY TARGET ZONES
            </span>
            <div className="text-3xl font-bold font-mono text-rose-400 mt-1">2</div>
            <span className="text-[11px] font-mono text-slate-500">
              Multi-modal convergence ≥ 0.65
            </span>
          </div>
        </div>

        {/* Priority Target Zone Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {DEMONSTRATION_TARGET_ZONES.map((zone) => (
            <div
              key={zone.id}
              className="p-5 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-xl space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-rose-400" />
                  <span className="text-sm font-bold font-mono text-white">{zone.name}</span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-800">
                  {zone.priorityLevel}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">ANOMALY SCORE:</span>
                  <span className="text-xl font-bold text-rose-400">{zone.anomalyScore.toFixed(2)}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">SEABED DEPTH:</span>
                  <span className="text-xl font-bold text-cyan-300">{zone.depthM} m</span>
                </div>
              </div>

              <div className="text-xs font-mono space-y-1">
                <span className="text-slate-400 text-[11px] block">CORRELATED INDICATORS:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {zone.indicators.map((ind, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 text-[11px]"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-[11px] font-mono text-slate-400 block font-semibold">
                  RECOMMENDATION:
                </span>
                <p className="text-xs text-cyan-200 font-mono font-medium">
                  “{zone.recommendation}”
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IMPORTANT REAL-WORLD WORKFLOW */}
      <div className="bg-[#070e1c] border-2 border-cyan-900/60 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
            OPERATIONAL EXPLORATION PIPELINE
          </span>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            HOW OUR SYSTEM FITS INTO OCEAN RESOURCE EXPLORATION
          </h3>
        </div>

        {/* 5-Step Process Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-8">
          {REAL_WORLD_WORKFLOW_STEPS.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center relative group hover:border-cyan-500/50 transition flex flex-col justify-between"
            >
              <div>
                <div className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold flex items-center justify-center mx-auto mb-2">
                  {step.step}
                </div>
                <h4 className="text-xs font-bold text-white font-mono">{step.title}</h4>
                <div className="text-[10px] text-cyan-300 font-mono mt-0.5">{step.subtitle}</div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Prominent Mandatory Positioning Callout */}
        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800 text-center max-w-3xl mx-auto">
          <p className="text-sm sm:text-base font-semibold text-cyan-200 leading-relaxed font-sans">
            “Our system is designed for preliminary screening and target prioritization, not as a replacement for deep-sea ROV/AUV exploration systems.”
          </p>
        </div>
      </div>
    </section>
  );
}
