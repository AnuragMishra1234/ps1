import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Hero3DBackground } from './Hero3DBackground';
import { Play, ArrowDown, ChevronRight, ShieldCheck, Cpu, Waves } from 'lucide-react';

interface HeroSectionProps {
  onLaunchSimulation: () => void;
  onViewSystem: () => void;
}

export function HeroSection({ onLaunchSimulation, onViewSystem }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#050b14] via-[#071324] to-[#040812]">
      {/* 3D Underwater Canvas in Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <Hero3DBackground />
          </Suspense>
        </Canvas>
      </div>

      {/* Grid Pattern and Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-radial-vignette opacity-70 pointer-events-none"></div>

      {/* Hero Foreground Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 text-center space-y-8">
        {/* Small Metadata Badges */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 backdrop-blur-md shadow-lg text-[11px] font-mono text-slate-300">
          <span className="text-cyan-400 font-semibold">SIH 2026</span>
          <span className="text-slate-600">•</span>
          <span>Problem Statement 26064</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">MoES / NCPOR</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-medium">Hardware • Robotics & Drones</span>
        </div>

        {/* Large Main Headline */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.08] font-sans">
            SEAFLOOR INTELLIGENCE,
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              BUILT FOR PRELIMINARY EXPLORATION.
            </span>
          </h1>
        </div>

        {/* Supporting Subheading */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
          A low-cost, deployable multi-sensor platform for detecting, correlating and mapping
          candidate seabed anomalies.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onLaunchSimulation}
            className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-sm font-bold flex items-center gap-2.5 shadow-xl shadow-cyan-950 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>LAUNCH LIVE SIMULATION</span>
          </button>

          <button
            onClick={onViewSystem}
            className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-mono text-sm font-semibold flex items-center gap-2 border border-slate-700 backdrop-blur-md shadow-lg transition-all duration-200"
          >
            <span>VIEW SYSTEM</span>
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* Quick Positioning Badges */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto font-mono text-xs text-slate-400 text-left">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <span className="text-cyan-400 block font-bold">PI-EM & FLUXGATE</span>
            <span className="text-[11px] text-slate-400">Conductive & Magnetic Screening</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <span className="text-emerald-400 block font-bold">ORP & TURBIDITY</span>
            <span className="text-[11px] text-slate-400">Benthic Plume & Redox Tracking</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <span className="text-sky-400 block font-bold">RS-485 DIFFERENTIAL</span>
            <span className="text-[11px] text-slate-400">Wired Noise-Immune Telemetry</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <span className="text-amber-400 block font-bold">EDGE FUSION & GIS</span>
            <span className="text-[11px] text-slate-400">Real-Time Anomaly Scoring</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="pt-8 flex justify-center">
          <a
            href="#interactive-simulation"
            className="flex flex-col items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-cyan-400 transition"
          >
            <span>SCROLL TO DIGITAL TWIN</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
