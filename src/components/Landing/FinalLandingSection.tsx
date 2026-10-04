import React from 'react';
import { RotateCcw, Workflow, ShieldCheck, Anchor, Heart } from 'lucide-react';

interface FinalLandingSectionProps {
  onRunSimulationAgain: () => void;
  onViewArchitecture: () => void;
}

export function FinalLandingSection({
  onRunSimulationAgain,
  onViewArchitecture,
}: FinalLandingSectionProps) {
  return (
    <footer className="relative bg-[#040812] border-t border-slate-800 pt-20 pb-12 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 text-center space-y-8 relative z-10">
        {/* Core Final Headline */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-2">
            PRELIMINARY SEABED SCREENING PROTOTYPE
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            FROM SEAFLOOR SIGNALS
            <br />
            <span className="text-cyan-400">TO TARGETED EXPLORATION.</span>
          </h2>
          <p className="text-lg sm:text-xl font-mono text-cyan-300 font-semibold tracking-wide">
            “Sense. Fuse. Map. Prioritize.”
          </p>
        </div>

        {/* Supporting Text */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
          A low-cost prototype designed to demonstrate multi-sensor seabed anomaly detection and
          real-time mapping, with a clear pathway toward deeper, ruggedized deployments.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onRunSimulationAgain}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-2 shadow-xl shadow-cyan-950 transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RUN SIMULATION AGAIN</span>
          </button>

          <button
            onClick={onViewArchitecture}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold flex items-center gap-2 border border-slate-700 transition"
          >
            <Workflow className="w-4 h-4 text-cyan-400" />
            <span>VIEW ARCHITECTURE</span>
          </button>
        </div>

        {/* Technical Positioning Guardrail */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-400 max-w-3xl mx-auto text-center space-y-1">
          <div className="text-slate-300 font-bold">
            SIH 2026 • Problem Statement 26064 • MoES / NCPOR
          </div>
          <p className="text-[11px] text-slate-400">
            System positioning: Candidate seabed anomaly identification & prospectivity target ranking. Not a direct assay or ROV/AUV replacement.
          </p>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-900 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
          <div>Smart India Hackathon 2026 • PS 26064</div>
          <div className="flex items-center gap-1">
            Built for MoES / NCPOR Preliminary Ocean Resource Exploration
          </div>
        </div>
      </div>
    </footer>
  );
}
