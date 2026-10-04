import React, { useState } from 'react';
import { PIPELINE_STAGES, PipelineStage } from '../../data/simulation';
import {
  Cpu,
  Microchip,
  Network,
  Server,
  Terminal,
  Workflow,
  Activity,
  Map as MapIcon,
  ChevronRight,
  Info,
  CheckCircle2,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Cpu,
  Microchip,
  Network,
  Server,
  Terminal,
  Workflow,
  Activity,
  Map: MapIcon,
};

export function PipelineDiagram() {
  const [selectedStage, setSelectedStage] = useState<PipelineStage>(PIPELINE_STAGES[0]);

  return (
    <section id="system-pipeline" className="py-16 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-3">
          DATA ACQUISITION & PROCESSING ARCHITECTURE
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          SENSOR DATA PIPELINE
        </h2>
        <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
          From microvolt eddy current decay at the seafloor to georeferenced anomaly maps on the
          surface vessel. Click any stage to inspect the technical implementation.
        </p>
      </div>

      {/* Horizontal Interactive Pipeline Flow */}
      <div className="relative mb-10 overflow-x-auto pb-4">
        <div className="min-w-[900px] flex items-center justify-between gap-1">
          {PIPELINE_STAGES.map((stage, idx) => {
            const IconComponent = ICON_MAP[stage.iconName] || Cpu;
            const isSelected = selectedStage.id === stage.id;

            return (
              <React.Fragment key={stage.id}>
                {/* Stage Button Card */}
                <button
                  onClick={() => setSelectedStage(stage)}
                  className={`flex-1 p-3 rounded-xl border text-left transition-all duration-200 relative group ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-400 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {stage.number}
                    </span>
                    <IconComponent
                      className={`w-4 h-4 transition ${
                        isSelected ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />
                  </div>
                  <div className="text-xs font-bold text-white font-mono tracking-wide">
                    {stage.shortName}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                    {stage.subsystem}
                  </div>
                </button>

                {/* Arrow Connector */}
                {idx < PIPELINE_STAGES.length - 1 && (
                  <div className="shrink-0 text-slate-600 px-0.5">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Card on Selected Stage */}
      <div className="bg-[#0b1424] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Stage Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-800">
                STAGE {selectedStage.number} • {selectedStage.subsystem.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-slate-400">STATUS: VERIFIED HARDWARE TESTBENCH</span>
            </div>

            <h3 className="text-2xl font-bold text-white tracking-wide">
              {selectedStage.name}
            </h3>

            <p className="text-base text-cyan-300 font-medium font-mono">
              {selectedStage.role}
            </p>

            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedStage.details}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slate-400">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Demonstration design optimized for low unit-cost, deployability from small research craft, and physical noise immunity.
              </span>
            </div>
          </div>

          {/* Right Column: Technical Implementation Specs */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800">
              TECHNICAL SPECIFICATIONS
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">IMPLEMENTATION:</span>
                <span className="text-slate-200 font-semibold">{selectedStage.techSpecs}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">SYSTEM LEVEL:</span>
                <span className="text-cyan-400 font-semibold">{selectedStage.subsystem}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">FAULT TOLERANCE:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Hardware Watchdog & Frame Checksums
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
