import React from 'react';
import { Play, Pause, RotateCcw, FastForward, CheckCircle2, Radio, Sparkles } from 'lucide-react';
import { DEMO_STAGES } from '../../hooks/useSimulation';
import { DemoStage } from '../../types/simulation';

interface DemoPlaybackBarProps {
  isDemoRunning: boolean;
  isPaused: boolean;
  currentStageIndex: number;
  stageProgress: number;
  totalDemoProgress: number;
  onStartDemo: () => void;
  onPauseDemo: () => void;
  onResetDemo: () => void;
  onSkipNext: () => void;
  onSkipToStage: (index: number) => void;
  onSimulateAnomaly: () => void;
  currentZone: 'zone_a' | 'zone_b' | 'zone_c';
}

export function DemoPlaybackBar({
  isDemoRunning,
  isPaused,
  currentStageIndex,
  stageProgress,
  totalDemoProgress,
  onStartDemo,
  onPauseDemo,
  onResetDemo,
  onSkipNext,
  onSkipToStage,
  onSimulateAnomaly,
  currentZone,
}: DemoPlaybackBarProps) {
  const currentStage = DEMO_STAGES[currentStageIndex];

  return (
    <div className="bg-[#08101e] border-b border-slate-800 sticky top-16 z-30 shadow-2xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3 space-y-2.5">
        {/* Top Control Line */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Main Demo Action Buttons */}
          <div className="flex items-center gap-2">
            {!isDemoRunning ? (
              <button
                onClick={onStartDemo}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-950/60 transition active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>START DEMO (35s)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onPauseDemo}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
                  <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
                </button>

                <button
                  onClick={onResetDemo}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-xs flex items-center gap-1.5 border border-slate-700 transition"
                  title="Reset Demo"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESET</span>
                </button>

                <button
                  onClick={onSkipNext}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-xs flex items-center gap-1.5 border border-slate-700 transition"
                  title="Skip to next step"
                >
                  <FastForward className="w-3.5 h-3.5" />
                  <span>SKIP</span>
                </button>
              </div>
            )}

            {/* Manual Anomaly Trigger Button */}
            <button
              onClick={onSimulateAnomaly}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition border ${
                currentZone === 'zone_c'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-lg shadow-rose-950/40'
                  : currentZone === 'zone_b'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-lg shadow-amber-950/40'
                  : 'bg-slate-900 text-cyan-300 border-cyan-800 hover:border-cyan-500 hover:bg-slate-800'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-current animate-pulse" />
              <span>SIMULATE ANOMALY</span>
            </button>
          </div>

          {/* Current Stage Status Summary */}
          <div className="flex items-center gap-3 text-xs font-mono">
            {isDemoRunning && (
              <div className="hidden md:flex items-center gap-2 text-slate-300 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="text-cyan-400 font-bold">{currentStage.label}:</span>
                <span className="text-slate-400 text-[11px] max-w-[280px] truncate">
                  {currentStage.description}
                </span>
              </div>
            )}

            <div className="text-slate-400 text-[11px]">
              TOTAL: <span className="text-white font-bold">{totalDemoProgress.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* 7-Step Sequence Breadcrumbs: DEPLOY → SENSE → PROCESS → FUSE → DETECT → MAP → TARGET */}
        <div className="overflow-x-auto pb-1">
          <div className="min-w-[680px] flex items-center justify-between gap-1">
            {DEMO_STAGES.map((s, idx) => {
              const isPast = idx < currentStageIndex && isDemoRunning;
              const isCurrent = idx === currentStageIndex && isDemoRunning;

              return (
                <button
                  key={s.stage}
                  onClick={() => onSkipToStage(idx)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-center font-mono text-[10px] tracking-wider transition relative ${
                    isCurrent
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-900/60'
                      : isPast
                      ? 'bg-slate-900/80 text-cyan-400 border border-cyan-900/80'
                      : 'bg-slate-950/60 text-slate-500 border border-slate-900 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    {isPast && <CheckCircle2 className="w-2.5 h-2.5" />}
                    <span>{s.label}</span>
                  </div>

                  {/* Intra-stage progress bar */}
                  {isCurrent && (
                    <div
                      className="absolute bottom-0 left-0 h-0.5 bg-slate-950 rounded-b transition-all duration-100"
                      style={{ width: `${stageProgress}%` }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
