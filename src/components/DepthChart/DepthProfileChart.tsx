import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { SurveyPoint } from '../../types/sensors';
import { SensorTelemetryHistoryPoint } from '../../hooks/useSensorData';
import { Anchor, ArrowDown, Activity, Radio, Compass } from 'lucide-react';

interface DepthProfileChartProps {
  surveyPoints: SurveyPoint[];
  currentDepth: number;
  currentAltitude: number;
  history: SensorTelemetryHistoryPoint[];
}

export function DepthProfileChart({
  surveyPoints,
  currentDepth,
  currentAltitude,
  history,
}: DepthProfileChartProps) {
  // Format data for depth bathymetry profile
  const depthData = surveyPoints.map((pt) => ({
    distance: pt.surveyDistanceM,
    depth: pt.depthM,
    score: pt.anomalyScore,
    id: pt.id,
  }));

  // Min and max depths for Y-Axis domain
  const minDepth = 120;
  const maxDepth = 136;

  return (
    <section id="depth-profile" className="py-12 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT: Depth Profile Chart (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-[#0b1322] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Anchor className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-mono tracking-wider">
                  DEPTH PROFILE (BATHYMETRY TRANSECT)
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                PRESSURE SENSOR DERIVED
              </span>
            </div>

            {/* Depth Profile Recharts Area */}
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={depthData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="depthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="distance"
                    stroke="#64748b"
                    fontSize={10}
                    tickFormatter={(val) => `${val}m`}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[minDepth, maxDepth]}
                    reversed={true} // Seafloor depth increases downward!
                    stroke="#64748b"
                    fontSize={10}
                    tickFormatter={(val) => `${val}m`}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900/95 border border-slate-700 p-2.5 rounded-lg shadow-xl font-mono text-xs">
                            <div className="text-cyan-400 font-bold">{data.id}</div>
                            <div className="text-white">Distance: {data.distance} m</div>
                            <div className="text-white">Depth: {data.depth} m</div>
                            <div className="text-amber-400">Anomaly Score: {data.score}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="depth"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#depthGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Current Depth & Altitude callout */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 font-mono">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block uppercase">CURRENT DEPTH</span>
              <div className="text-2xl font-bold text-white mt-0.5">
                {currentDepth.toFixed(1)} <span className="text-xs text-slate-400 font-normal">m</span>
              </div>
              <span className="text-[10px] text-slate-500">Hydrostatic pressure: {(currentDepth * 0.1013).toFixed(1)} bar</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block uppercase">ALTITUDE FROM SEABED</span>
              <div className="text-2xl font-bold text-emerald-400 mt-0.5">
                {currentAltitude.toFixed(1)} <span className="text-xs text-slate-400 font-normal">m</span>
              </div>
              <span className="text-[10px] text-slate-500">Acoustic altimeter clearance</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Live Modality Time Traces (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-[#0b1322] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-mono tracking-wider">
                  REAL-TIME TELEMETRY TRACES
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 animate-pulse">● LIVE 30s</span>
            </div>

            {/* Time-series Line Chart */}
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="timeStr" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis domain={[0, 1.0]} stroke="#64748b" fontSize={9} tickLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900/95 border border-slate-700 p-2 rounded-lg font-mono text-[11px] space-y-1">
                            {payload.map((entry, idx) => (
                              <div key={idx} style={{ color: entry.color }}>
                                {entry.name}: {Number(entry.value).toFixed(2)}
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="piEm"
                    name="PI-EM Response"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="anomalyScore"
                    name="Fusion Score"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="4 2"
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Trace Legend */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <span className="text-slate-300">PI-EM Decay Response</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-slate-300">Anomaly Fusion Score</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
