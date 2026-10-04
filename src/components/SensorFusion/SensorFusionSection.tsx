import React, { useState } from 'react';
import { NormalizedSensorSignals, AnomalyEvaluation } from '../../types/sensors';
import { FusionWeights } from '../../utils/anomalyScore';
import { Sliders, HelpCircle, ChevronDown, ChevronUp, AlertCircle, ShieldAlert, Cpu } from 'lucide-react';

interface SensorFusionSectionProps {
  signals: NormalizedSensorSignals;
  evaluation: AnomalyEvaluation;
  weights: FusionWeights;
  onUpdateWeights: (newWeights: Partial<FusionWeights>) => void;
}

export function SensorFusionSection({
  signals,
  evaluation,
  weights,
  onUpdateWeights,
}: SensorFusionSectionProps) {
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);
  const [showWeightSliders, setShowWeightSliders] = useState(false);

  // Helper to render ASCII-like bar or stylized segmented bar
  const renderProgressBar = (val: number, colorClass: string) => {
    const percentage = Math.round(val * 100);
    return (
      <div className="w-full bg-slate-800/80 rounded-full h-3 p-0.5 border border-slate-700/60 overflow-hidden flex items-center">
        <div
          className={`h-full rounded-full transition-all duration-300 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  const signalItems = [
    {
      id: 'piEm',
      name: 'PI-EM',
      fullName: 'Pulse Induction Eddy Current Decay',
      value: signals.piEm,
      weight: weights.piEm,
      color: 'bg-cyan-500',
      textColor: 'text-cyan-400',
      description: 'Conductive anomaly decay signature',
    },
    {
      id: 'magnetic',
      name: 'MAGNETIC',
      fullName: 'Magnetic Field Vector Perturbation',
      value: signals.magnetic,
      weight: weights.magnetic,
      color: 'bg-blue-500',
      textColor: 'text-blue-400',
      description: 'Remanence / susceptibility deviation',
    },
    {
      id: 'orp',
      name: 'ORP',
      fullName: 'Oxidation-Reduction Potential Shift',
      value: signals.orp,
      weight: weights.orp,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      description: 'Reducing geochemical species indicator',
    },
    {
      id: 'turbidity',
      name: 'TURBIDITY',
      fullName: 'Optical Nephelometric Backscatter',
      value: signals.turbidity,
      weight: weights.turbidity,
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      description: 'Benthic boundary layer suspended plume',
    },
    {
      id: 'temperature',
      name: 'TEMPERATURE',
      fullName: 'Thermal Plume Dissipation',
      value: signals.temperature,
      weight: weights.temperature,
      color: 'bg-pink-500',
      textColor: 'text-pink-400',
      description: 'Hydrothermal / seafloor seep indicator',
    },
    {
      id: 'visual',
      name: 'VISUAL',
      fullName: 'Indicative Edge Morphology',
      value: signals.visual,
      weight: weights.visual,
      color: 'bg-sky-400',
      textColor: 'text-sky-300',
      description: 'Nodule-like object texture confidence',
    },
  ];

  // Anomaly status styling
  const scoreBadgeBg =
    evaluation.level === 'strong'
      ? 'bg-rose-500/20 border-rose-500/80 text-rose-300'
      : evaluation.level === 'candidate'
      ? 'bg-amber-500/20 border-amber-500/80 text-amber-300'
      : 'bg-emerald-500/20 border-emerald-500/80 text-emerald-300';

  const scoreGaugeColor =
    evaluation.level === 'strong'
      ? 'from-amber-500 via-rose-500 to-rose-600'
      : evaluation.level === 'candidate'
      ? 'from-cyan-500 via-amber-400 to-amber-500'
      : 'from-cyan-600 to-emerald-500';

  return (
    <section id="sensor-fusion" className="py-16 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-3">
          PROPRIETARY PROSPECTIVITY ALGORITHM
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          MULTI-SENSOR FUSION
        </h2>
        <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
          Single-sensor exploration suffers from false positives (e.g. salinity gradients, basaltic
          volcanics, or biological flocs). Our fusion engine correlates electromagnetic,
          geochemical, and optical indicators into a unified candidate anomaly score.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Six Horizontal Signal Cards (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              NORMALIZED INPUT SIGNALS (0.00 – 1.00)
            </span>
            <button
              onClick={() => setShowWeightSliders((prev) => !prev)}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showWeightSliders ? 'Hide Weight Controls' : 'Adjust Weights'}</span>
            </button>
          </div>

          {signalItems.map((sig) => (
            <div
              key={sig.id}
              className="p-4 rounded-xl bg-[#0b1424] border border-slate-800 hover:border-slate-700 transition space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className={`font-bold tracking-wider ${sig.textColor}`}>
                    {sig.name}
                  </span>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    • {sig.description}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">
                    wt: {(sig.weight * 100).toFixed(0)}%
                  </span>
                  <span className="font-bold text-sm text-white">
                    {sig.value.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Graphical Segmented / Continuous Bar */}
              {renderProgressBar(sig.value, sig.color)}

              {/* Optional Weight Slider */}
              {showWeightSliders && (
                <div className="pt-2 flex items-center gap-3 text-xs font-mono text-slate-400">
                  <span>Weight:</span>
                  <input
                    type="range"
                    min="0.05"
                    max="0.6"
                    step="0.01"
                    value={sig.weight}
                    onChange={(e) =>
                      onUpdateWeights({ [sig.id]: parseFloat(e.target.value) } as any)
                    }
                    className="flex-1 accent-cyan-400 h-1 bg-slate-800 rounded"
                  />
                  <span className="w-10 text-right text-cyan-300">
                    {(sig.weight * 100).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: Candidate Anomaly Score Output Card (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-[#0b1424] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-400 tracking-wider">
                SYNTHESIZED OUTPUT
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                REAL-TIME FUSION
              </span>
            </div>

            <div className="py-6 text-center">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1">
                MULTI-SENSOR ANOMALY SCORE
              </span>

              {/* Large Score Value */}
              <div className="text-6xl font-black font-mono tracking-tight text-white my-2 flex items-center justify-center gap-1">
                {evaluation.score.toFixed(2)}
                <span className="text-xl font-normal text-slate-500 font-sans">/ 1.00</span>
              </div>

              {/* Status Classification Badge */}
              <div className="inline-block mt-2">
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold border tracking-wider uppercase inline-flex items-center gap-2 ${scoreBadgeBg}`}
                >
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                  {evaluation.classification}
                </span>
              </div>

              {/* Dominant Drivers */}
              <div className="mt-6 text-left p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block mb-2 uppercase">
                  Dominant Contributing Indicators:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {evaluation.dominantIndicators.map((ind, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-mono"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scientific Disclaimer Note */}
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-slate-300 font-mono">Prototype Fusion Score:</strong> This
                metric prioritizes candidate prospective zones for follow-up ROV/AUV deployment.
                It does not constitute direct assay or guaranteed mineral grades.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Section: "How is the score calculated?" */}
      <div className="mt-8 bg-[#0b1424] border border-slate-800 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowFormulaDetails((prev) => !prev)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-900/60 transition"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-white font-mono">
              How is the candidate anomaly score calculated?
            </span>
          </div>
          {showFormulaDetails ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showFormulaDetails && (
          <div className="px-6 pb-6 pt-2 text-sm text-slate-300 space-y-4 border-t border-slate-800/80 bg-slate-950/40 font-mono text-xs">
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 leading-relaxed overflow-x-auto">
              <code>
                Score = w_pi * PI_EM + w_mag * MAG + w_orp * ORP + w_turb * TURB + w_temp * TEMP + w_vis * VIS
              </code>
            </div>

            <p className="text-slate-300 leading-relaxed font-sans text-xs">
              <strong className="text-white">Prototype demonstration only:</strong> The fusion score
              combines normalized sensor responses to prioritize candidate anomaly zones. Field
              calibration and validation are required before operational interpretation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded bg-slate-900/70 border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">0.00 – 0.39: Baseline</span>
                <span className="text-slate-400 text-[11px]">
                  Pelagic ambient background. No significant conductive, magnetic, or redox shift.
                </span>
              </div>
              <div className="p-3 rounded bg-slate-900/70 border border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">0.40 – 0.64: Candidate</span>
                <span className="text-slate-400 text-[11px]">
                  Moderate correlation between 2+ modalities (e.g. coil decay + slight redox shift).
                </span>
              </div>
              <div className="p-3 rounded bg-slate-900/70 border border-slate-800">
                <span className="text-rose-400 font-bold block mb-1">0.65 – 1.00: Strong Candidate</span>
                <span className="text-slate-400 text-[11px]">
                  Multi-modal convergence: high eddy current response + magnetic dipole + turbidity plume.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
