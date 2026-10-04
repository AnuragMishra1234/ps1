import React, { useState } from 'react';
import { Camera, Eye, Scan, CheckCircle, Crosshair, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface CameraPreviewPanelProps {
  depthM: number;
  altitudeM: number;
  anomalyLevel: 'normal' | 'candidate' | 'strong';
}

export function CameraPreviewPanel({ depthM, altitudeM, anomalyLevel }: CameraPreviewPanelProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedFrame, setCapturedFrame] = useState<{
    timestamp: string;
    analysisResult: string;
    confidence: number;
    detectedObjectsCount: number;
  } | null>(null);

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      const conf =
        anomalyLevel === 'strong' ? 0.78 : anomalyLevel === 'candidate' ? 0.71 : 0.28;
      const count = anomalyLevel === 'strong' ? 8 : anomalyLevel === 'candidate' ? 5 : 1;

      setCapturedFrame({
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' UTC',
        analysisResult:
          anomalyLevel === 'normal'
            ? 'Uniform pelagic sediment / No morphological anomalies'
            : 'Nodule-like object detected',
        confidence: conf,
        detectedObjectsCount: count,
      });
    }, 700);
  };

  return (
    <section id="camera-module" className="py-16 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-3">
          EDGE VISION & OPTICAL VERIFICATION
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          UNDERWATER CAMERA MODULE
        </h2>
        <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
          Forward low-light optical module illuminated by twin high-CRI subsea LEDs. Provides visual
          ground truth for surface edge YOLO inference to complement electromagnetic measurements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Stylized Simulated Camera Feed (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-[#050b14] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
          {/* Top Camera Status Header */}
          <div className="flex items-center justify-between p-3.5 border-b border-slate-800 bg-[#09111e] font-mono text-xs">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-slate-200">
                UNDERWATER CAMERA — SIMULATED FEED
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="text-[11px] text-slate-400">REC • 1080p @ 15fps</span>
            </div>
          </div>

          {/* Camera Viewport Canvas/HUD */}
          <div className="relative aspect-[16/10] bg-gradient-to-b from-[#061224] via-[#091830] to-[#040914] overflow-hidden flex items-center justify-center select-none">
            {/* Ambient Water Column Lighting Vignette */}
            <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none"></div>

            {/* Stylized Seabed Terrain with Nodule-like Silhouettes */}
            <svg viewBox="0 0 600 375" className="w-full h-full">
              <defs>
                {/* Water beam cone from twin LED lights */}
                <radialGradient id="torchCone" cx="50%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.35" />
                  <stop offset="60%" stopColor="#0369a1" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#030712" stopOpacity="0.8" />
                </radialGradient>
              </defs>

              {/* Torch illumination footprint */}
              <ellipse cx="300" cy="200" rx="260" ry="160" fill="url(#torchCone)" />

              {/* Seabed contour sediment horizon */}
              <path
                d="M 0 240 Q 150 210 300 245 T 600 230 L 600 375 L 0 375 Z"
                fill="#131e2d"
              />
              <path
                d="M 0 280 Q 200 260 400 290 T 600 270 L 600 375 L 0 375 Z"
                fill="#0e1724"
              />

              {/* Stylized nodule-like pebble silhouettes on sediment */}
              <g fill="#1f2937" stroke="#374151" strokeWidth="1">
                {/* Nodule 1 */}
                <ellipse cx="220" cy="285" rx="22" ry="14" />
                {/* Nodule 2 */}
                <ellipse cx="270" cy="310" rx="30" ry="18" />
                {/* Nodule 3 */}
                <ellipse cx="340" cy="295" rx="26" ry="16" />
                {/* Nodule 4 */}
                <ellipse cx="400" cy="325" rx="20" ry="12" />
                {/* Nodule 5 */}
                <ellipse cx="170" cy="330" rx="16" ry="10" />
              </g>

              {/* YOLO Bounding Box Overlay if captured */}
              {capturedFrame && capturedFrame.confidence > 0.4 && (
                <g>
                  {/* Bounding Box 1 */}
                  <rect
                    x="235"
                    y="288"
                    width="70"
                    height="45"
                    fill="none"
                    stroke="#00ffff"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  <rect x="235" y="274" width="130" height="14" fill="#0891b2" />
                  <text
                    x="238"
                    y="284"
                    fill="#ffffff"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    nodule-like: {capturedFrame.confidence.toFixed(2)}
                  </text>

                  {/* Bounding Box 2 */}
                  <rect
                    x="310"
                    y="275"
                    width="62"
                    height="40"
                    fill="none"
                    stroke="#00ffff"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  <rect x="310" y="261" width="125" height="14" fill="#0891b2" />
                  <text
                    x="313"
                    y="271"
                    fill="#ffffff"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    nodule-like: {(capturedFrame.confidence - 0.05).toFixed(2)}
                  </text>
                </g>
              )}

              {/* Optical HUD Crosshair */}
              <g stroke="#38bdf8" strokeWidth="1" opacity="0.6">
                <line x1="280" y1="187.5" x2="295" y2="187.5" />
                <line x1="305" y1="187.5" x2="320" y2="187.5" />
                <line x1="300" y1="167.5" x2="300" y2="182.5" />
                <line x1="300" y1="192.5" x2="300" y2="207.5" />
                <circle cx="300" cy="187.5" r="28" fill="none" strokeDasharray="3 3" />
              </g>
            </svg>

            {/* In-View HUD Telemetry Watermarks */}
            <div className="absolute top-3 left-4 text-[10px] font-mono text-cyan-300 space-y-0.5 bg-slate-950/60 p-2 rounded border border-slate-800/80">
              <div>CAM: 01 (FWD_WIDE)</div>
              <div>ALT: {altitudeM.toFixed(1)} m</div>
              <div>DEP: {depthM.toFixed(1)} m</div>
            </div>

            <div className="absolute bottom-3 left-4 text-[9px] font-mono text-slate-400 bg-slate-950/70 px-2 py-1 rounded border border-slate-800">
              ILLUMINATION: DUAL 1500-LUMEN 5700K CREE LED ARRAY (ACTIVE)
            </div>

            {/* Shutter flash animation */}
            {isCapturing && (
              <div className="absolute inset-0 bg-white/60 animate-ping pointer-events-none"></div>
            )}
          </div>

          {/* Action Bar */}
          <div className="p-4 border-t border-slate-800 bg-[#09111e] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-mono text-slate-400">
              Edge Model: YOLOv5-Nano (Quantized INT8 running on Surface Pi 4)
            </span>

            <button
              onClick={handleCapture}
              disabled={isCapturing}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 transition text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-950"
            >
              {isCapturing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>ANALYZING FRAME...</span>
                </>
              ) : (
                <>
                  <Scan className="w-3.5 h-3.5" />
                  <span>CAPTURE FRAME</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Edge Vision Inference Card (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-[#0b1424] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              EDGE INFERENCE TELEMETRY
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
              REAL-TIME
            </span>
          </div>

          {capturedFrame ? (
            <div className="space-y-4 font-mono">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="text-[11px] text-slate-400">FRAME CAPTURED:</div>
                <div className="text-xs text-white font-semibold">{capturedFrame.timestamp}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="text-[11px] text-slate-400">VISUAL ANALYSIS:</div>
                <div className="text-sm text-cyan-300 font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  “{capturedFrame.analysisResult}”
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">CONFIDENCE</span>
                  <span className="text-2xl font-bold text-white">
                    {capturedFrame.confidence.toFixed(2)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">DETECTED MORPHOLOGIES</span>
                  <span className="text-2xl font-bold text-emerald-400">
                    {capturedFrame.detectedObjectsCount}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl space-y-2 text-slate-400 font-mono text-xs">
              <Crosshair className="w-8 h-8 text-slate-600 mx-auto" />
              <p>Click “CAPTURE FRAME” to run optical feature classification on the seabed feed.</p>
            </div>
          )}

          {/* Mandatory Accurate Positioning Wording */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-[11px]">
              <AlertCircle className="w-3.5 h-3.5" />
              IMPORTANT TECHNICAL NOTE:
            </div>
            <p className="leading-relaxed">
              Detection label is strictly <strong className="text-slate-300 font-mono">“Nodule-like object”</strong> (NOT “Polymetallic nodule confirmed”). Visual classification is indicative and requires field validation and physical core sampling.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
