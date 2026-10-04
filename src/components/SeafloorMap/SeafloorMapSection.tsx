import React, { useState, useMemo } from 'react';
import { SurveyPoint, TargetZone } from '../../types/sensors';
import { DEMONSTRATION_TARGET_ZONES } from '../../data/simulation';
import { MapPin, Navigation2, Layers, Filter, Eye, Compass, Anchor, AlertTriangle } from 'lucide-react';

interface SeafloorMapSectionProps {
  points: SurveyPoint[];
  currentPodPoint?: SurveyPoint;
  anomalyLevel: 'normal' | 'candidate' | 'strong';
}

export function SeafloorMapSection({
  points,
  currentPodPoint,
  anomalyLevel,
}: SeafloorMapSectionProps) {
  const [selectedPoint, setSelectedPoint] = useState<SurveyPoint | null>(points[61] || null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [filterLevel, setFilterLevel] = useState<'all' | 'candidates'>('all');

  const filteredPoints = useMemo(() => {
    if (filterLevel === 'candidates') {
      return points.filter((p) => p.anomalyScore >= 0.4);
    }
    return points;
  }, [points, filterLevel]);

  // Compute SVG viewBox bounding box based on points lat/lng
  const bounds = useMemo(() => {
    if (!points.length) return { minX: 0, maxX: 100, minY: 0, maxY: 100 };
    const lats = points.map((p) => p.lat);
    const lngs = points.map((p) => p.lng);
    return {
      minLat: Math.min(...lats) - 0.001,
      maxLat: Math.max(...lats) + 0.001,
      minLng: Math.min(...lngs) - 0.001,
      maxLng: Math.max(...lngs) + 0.001,
    };
  }, [points]);

  // Project lat/lng to SVG pixel space (width: 800, height: 450)
  const project = (lat: number, lng: number) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 740 + 30;
    const y = 420 - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 390;
    return { x, y };
  };

  // SVG path string for survey trackline
  const tracklinePath = useMemo(() => {
    if (points.length < 2) return '';
    return points
      .map((p, idx) => {
        const pt = project(p.lat, p.lng);
        return `${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
      })
      .join(' ');
  }, [points, bounds]);

  return (
    <section id="seafloor-mapping" className="py-16 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-3">
          SPATIAL ANOMALY LOGGING & BATHYMETRY
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          SEAFLOOR SURVEY MAP
        </h2>
        <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
          Georeferenced acoustic and electromagnetic survey trackline. Every waypoint captures
          synchronized depth, attitude, and multi-sensor fusion score for target zone delineation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Bathymetric Grid Canvas (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-[#09111e] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
          {/* Map Header Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-800 bg-[#060c16]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Navigation2 className="w-3.5 h-3.5 text-cyan-400" />
                SEABED SURVEY GRID • SECTOR 26-N
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                WGS84 / UTM 43N
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHeatmap((prev) => !prev)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition flex items-center gap-1.5 ${
                  showHeatmap
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Heatmap: {showHeatmap ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => setFilterLevel((prev) => (prev === 'all' ? 'candidates' : 'all'))}
                className={`px-2.5 py-1 rounded text-xs font-mono transition flex items-center gap-1.5 ${
                  filterLevel === 'candidates'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>{filterLevel === 'all' ? 'All Points' : 'Candidates Only'}</span>
              </button>
            </div>
          </div>

          {/* SVG Bathymetric Grid & Waypoints */}
          <div className="relative w-full aspect-[16/9] max-h-[500px] bg-[#070e1b] overflow-hidden select-none">
            <svg
              viewBox="0 0 800 450"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Bathymetric Depth Contour Background Waves */}
              <defs>
                <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                  <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.9" />
                  <stop offset="85%" stopColor="#ef4444" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
                </linearGradient>

                {/* Heatmap blur filter */}
                <filter id="heatBlur" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="16" />
                </filter>
              </defs>

              {/* Grid Lines */}
              {Array.from({ length: 9 }).map((_, i) => (
                <line
                  key={`gx-${i}`}
                  x1={i * 100}
                  y1={0}
                  x2={i * 100}
                  y2={450}
                  stroke="#17263c"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}
              {Array.from({ length: 6 }).map((_, i) => (
                <line
                  key={`gy-${i}`}
                  x1={0}
                  y1={i * 90}
                  x2={800}
                  y2={i * 90}
                  stroke="#17263c"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Bathymetry Isoline contours */}
              <path
                d="M 20 180 Q 220 140 400 190 T 780 170"
                fill="none"
                stroke="#162942"
                strokeWidth="1.5"
              />
              <path
                d="M 20 280 Q 240 250 440 310 T 780 270"
                fill="none"
                stroke="#162942"
                strokeWidth="1.5"
              />
              <text x="35" y="174" fill="#334d6e" fontSize="10" fontFamily="monospace">
                -124m
              </text>
              <text x="35" y="274" fill="#334d6e" fontSize="10" fontFamily="monospace">
                -130m
              </text>

              {/* Heatmap Overlay for Anomaly Concentrations */}
              {showHeatmap && (
                <g filter="url(#heatBlur)" opacity="0.75">
                  {/* Zone A Hotspot */}
                  <circle cx="360" cy="225" r="55" fill="#f59e0b" opacity="0.45" />
                  <circle cx="360" cy="225" r="28" fill="#ef4444" opacity="0.7" />

                  {/* Zone B Hotspot */}
                  <circle cx="620" cy="310" r="50" fill="#f59e0b" opacity="0.5" />
                  <circle cx="620" cy="310" r="24" fill="#ef4444" opacity="0.65" />
                </g>
              )}

              {/* Target Zone Highlight Boundaries */}
              <g>
                {/* Target Zone A Box */}
                <rect
                  x="310"
                  y="180"
                  width="100"
                  height="90"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <text
                  x="314"
                  y="195"
                  fill="#f59e0b"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  TARGET ZONE A (TZ-01)
                </text>

                {/* Target Zone B Box */}
                <rect
                  x="570"
                  y="265"
                  width="105"
                  height="90"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <text
                  x="574"
                  y="280"
                  fill="#ef4444"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  TARGET ZONE B (TZ-02)
                </text>
              </g>

              {/* Trackline Path */}
              <path
                d={tracklinePath}
                fill="none"
                stroke="url(#trackGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Waypoint Dots */}
              {filteredPoints.map((pt) => {
                const coord = project(pt.lat, pt.lng);
                const isSelected = selectedPoint?.id === pt.id;
                const dotColor =
                  pt.classification === 'Strong Candidate'
                    ? '#ef4444'
                    : pt.classification === 'Candidate Anomaly'
                    ? '#f59e0b'
                    : '#10b981';

                return (
                  <g
                    key={pt.id}
                    onClick={() => setSelectedPoint(pt)}
                    className="cursor-pointer"
                  >
                    {isSelected && (
                      <circle
                        cx={coord.x}
                        cy={coord.y}
                        r={8}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                    )}
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={pt.anomalyScore >= 0.65 ? 4.5 : pt.anomalyScore >= 0.4 ? 3.5 : 2.5}
                      fill={dotColor}
                      stroke="#070e1b"
                      strokeWidth="1"
                    />
                  </g>
                );
              })}

              {/* Current Sensor Pod Location Indicator */}
              {points.length > 0 && (
                (() => {
                  const lastPoint = currentPodPoint || points[points.length - 1];
                  const currentCoord = project(lastPoint.lat, lastPoint.lng);
                  return (
                    <g transform={`translate(${currentCoord.x}, ${currentCoord.y})`}>
                      <circle
                        r="12"
                        fill="none"
                        stroke="#0ea5e9"
                        strokeWidth="1.5"
                        opacity="0.8"
                        className="animate-ping"
                      />
                      <circle r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                      <text
                        x="10"
                        y="-8"
                        fill="#38bdf8"
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        POD ({lastPoint.depthM}m)
                      </text>
                    </g>
                  );
                })()
              )}
            </svg>

            {/* Bottom Floating Map Scale & Coordinates */}
            <div className="absolute bottom-3 left-4 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-1 rounded border border-slate-800 flex items-center gap-3">
              <span>LAT: {bounds.minLat.toFixed(4)}°N – {bounds.maxLat.toFixed(4)}°N</span>
              <span>•</span>
              <span>LNG: {bounds.minLng.toFixed(4)}°E – {bounds.maxLng.toFixed(4)}°E</span>
              <span>•</span>
              <span>SCALE: ~1:5,000</span>
            </div>
          </div>
        </div>

        {/* Selected Waypoint Telemetry Drawer (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-[#09111e] border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                WAYPOINT INSPECTION
              </span>
              {selectedPoint && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold border border-slate-700">
                  {selectedPoint.id}
                </span>
              )}
            </div>

            {selectedPoint ? (
              <div className="py-4 space-y-4">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">CLASSIFICATION:</span>
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                      selectedPoint.classification === 'Strong Candidate'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                        : selectedPoint.classification === 'Candidate Anomaly'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                    }`}
                  >
                    {selectedPoint.classification.toUpperCase()}
                  </span>
                </div>

                {/* Score & Depth metrics */}
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">ANOMALY SCORE</span>
                    <span className="text-2xl font-bold text-white">
                      {selectedPoint.anomalyScore.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">SEABED DEPTH</span>
                    <span className="text-2xl font-bold text-cyan-300">
                      {selectedPoint.depthM.toFixed(1)} <span className="text-xs">m</span>
                    </span>
                  </div>
                </div>

                {/* Coordinates & Metadata */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">COORDINATES:</span>
                    <span className="text-slate-200">
                      {selectedPoint.lat.toFixed(5)}°N, {selectedPoint.lng.toFixed(5)}°E
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">SURVEY DISTANCE:</span>
                    <span className="text-slate-200">{selectedPoint.surveyDistanceM} m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">TIMESTAMP:</span>
                    <span className="text-slate-200">{selectedPoint.timestamp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">POD ALTITUDE:</span>
                    <span className="text-slate-200">{selectedPoint.altitudeM} m</span>
                  </div>
                </div>

                {/* Signals breakdown at this waypoint */}
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    MODALITY SIGNALS AT WAYPOINT:
                  </span>
                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-cyan-400">PI-EM Conductivity:</span>
                      <span className="font-semibold text-white">
                        {selectedPoint.signals.piEm.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-400">Magnetic Deviation:</span>
                      <span className="font-semibold text-white">
                        {selectedPoint.signals.magnetic.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-400">ORP Redox Shift:</span>
                      <span className="font-semibold text-white">
                        {selectedPoint.signals.orp.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-amber-400">Turbidity Plume:</span>
                      <span className="font-semibold text-white">
                        {selectedPoint.signals.turbidity.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 font-mono text-xs">
                Select any waypoint dot on the survey grid to inspect physical measurements.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400">
            Click points P01–P142 to review localized anomaly signatures.
          </div>
        </div>
      </div>
    </section>
  );
}
