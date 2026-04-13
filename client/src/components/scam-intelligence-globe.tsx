"use client";

import { useEffect, useRef, useState, useCallback, memo, Component, type ErrorInfo, type ReactNode } from "react";
import Globe from "react-globe.gl";
import { Globe as GlobeIcon, AlertTriangle, MapPin } from "lucide-react";

class GlobeErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("[ScamGlobe] WebGL/render error caught:", error.message);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl") || canvas.getContext("webgl2"));
  } catch {
    return false;
  }
}

function GlobeFallback({ data }: { data: any }) {
  const hotspots = (data?.hotspots || []).slice(0, 8);
  return (
    <div className="w-full aspect-square max-w-[700px] mx-auto bg-slate-800/30 rounded-2xl flex flex-col items-center justify-center p-6" data-testid="globe-fallback">
      <GlobeIcon className="w-16 h-16 text-cyan-400/30 mb-4" />
      <p className="text-sm text-slate-400 mb-1">3D Globe requires WebGL support</p>
      <p className="text-xs text-slate-500 mb-6">Your browser doesn't support WebGL rendering. Here's a summary of the data:</p>
      {hotspots.length > 0 && (
        <div className="w-full max-w-sm space-y-2">
          {hotspots.map((h: any) => (
            <div key={h.id} className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-2 border border-slate-700/30">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: h.riskLevel === "critical" ? "#ef4444" : h.riskLevel === "high" ? "#f97316" : h.riskLevel === "medium" ? "#eab308" : "#22c55e" }} />
              <span className="text-xs text-white font-medium flex-1">{h.country}</span>
              <span className="text-[10px] text-slate-400">{h.topScamTypes?.[0]?.replace(/-/g, " ")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface GlobeHotspot {
  id: string;
  lat: number;
  lng: number;
  country: string;
  countryCode: string;
  region: string;
  intensity: number;
  riskLevel: "critical" | "high" | "medium" | "low";
  topScamTypes: string[];
  recentIncidents: number;
  trendDirection: "up" | "down" | "stable";
  trendPercent: number;
  sources: string[];
  reportContact?: string;
  lastUpdated: string;
}

interface GlobeArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  scamType: string;
  volume: number;
  color: string;
}

interface ScamIntelGlobeData {
  hotspots: GlobeHotspot[];
  arcs: GlobeArc[];
  globalStats: {
    totalIncidentsTracked: number;
    countriesCovered: number;
    sourcesMonitored: number;
    lastRefresh: string;
    totalLossesTracked: string;
    activeScamTypes: number;
  };
  lastUpdated: string;
}

interface ScamIntelligenceGlobeProps {
  data: ScamIntelGlobeData | null;
  onCountrySelect?: (hotspot: GlobeHotspot | null) => void;
  width?: number;
  height?: number;
}

const RISK_COLORS: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#22c55e",
};

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return n.toString();
}

function ScamIntelligenceGlobeInner({ data, onCountrySelect, width, height }: ScamIntelligenceGlobeProps) {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [dimensions, setDimensions] = useState({ w: width || 600, h: height || 600 });
  const [hoveredPoint, setHoveredPoint] = useState<GlobeHotspot | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<GlobeHotspot | null>(null);

  useEffect(() => {
    setIsClient(true);
    setWebglSupported(checkWebGLSupport());
  }, []);

  useEffect(() => {
    if (!containerRef.current || width) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0) setDimensions({ w, h: Math.max(h, w * 0.75) });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [width]);

  useEffect(() => {
    if (!globeRef.current || !isClient) return;
    const globe = globeRef.current;
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = 200;
    controls.maxDistance = 500;
    globe.pointOfView({ lat: 20, lng: 10, altitude: 2.2 });
  }, [isClient]);

  const handlePointClick = useCallback((point: any) => {
    const hotspot = point as GlobeHotspot;
    setSelectedPoint(hotspot);
    onCountrySelect?.(hotspot);
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: hotspot.lat, lng: hotspot.lng, altitude: 1.5 }, 1000);
      const controls = globeRef.current.controls();
      controls.autoRotate = false;
      setTimeout(() => { controls.autoRotate = true; }, 8000);
    }
  }, [onCountrySelect]);

  const handlePointHover = useCallback((point: any) => {
    setHoveredPoint(point as GlobeHotspot | null);
  }, []);

  if (!isClient) {
    return (
      <div
        ref={containerRef}
        className="w-full aspect-square max-w-[700px] mx-auto bg-[#060d1a] rounded-2xl flex items-center justify-center"
      >
        <div className="text-cyan-400/50 text-sm">Loading globe...</div>
      </div>
    );
  }

  if (!webglSupported) {
    return <GlobeFallback data={data} />;
  }

  const hotspots = data?.hotspots || [];
  const arcs = data?.arcs || [];

  return (
    <div ref={containerRef} className="relative w-full max-w-[700px] mx-auto" style={{ height: dimensions.h || 600 }}>
      <GlobeErrorBoundary fallback={<GlobeFallback data={data} />}>
      <Globe
        ref={globeRef}
        width={dimensions.w || 600}
        height={dimensions.h || 600}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl=""
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor="#22d3ee"
        atmosphereAltitude={0.18}
        animateIn={true}
        pointsData={hotspots}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={(d: any) => d.intensity * 0.12}
        pointRadius={(d: any) => Math.max(0.3, d.intensity * 1.2)}
        pointColor={(d: any) => RISK_COLORS[d.riskLevel] || "#22d3ee"}
        pointsMerge={false}
        onPointClick={handlePointClick}
        onPointHover={handlePointHover}
        arcsData={arcs}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color"
        arcAltitude={0.15}
        arcStroke={(d: any) => Math.max(0.3, (d.volume / 100) * 1.5)}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={3000}
        ringsData={selectedPoint ? [selectedPoint] : []}
        ringLat="lat"
        ringLng="lng"
        ringColor={() => "#22d3ee"}
        ringMaxRadius={5}
        ringPropagationSpeed={3}
        ringRepeatPeriod={800}
      />

      <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
        background: "radial-gradient(circle at center, transparent 35%, rgba(6,13,26,0.7) 100%)",
      }} />
      </GlobeErrorBoundary>

      {hoveredPoint && !selectedPoint && (
        <div className="absolute top-4 left-4 bg-slate-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-3 max-w-[260px] pointer-events-none z-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: RISK_COLORS[hoveredPoint.riskLevel] }} />
            <span className="text-white font-semibold text-sm">{hoveredPoint.country}</span>
          </div>
          <div className="text-slate-400 text-xs">
            {formatNumber(hoveredPoint.recentIncidents)} scams reported · {hoveredPoint.riskLevel} risk level
          </div>
          <div className="text-cyan-400 text-xs mt-1">Click to learn more</div>
        </div>
      )}

      {selectedPoint && (
        <div className="absolute top-4 right-4 bg-slate-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4 max-w-[300px] z-10" data-testid="globe-country-detail">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: RISK_COLORS[selectedPoint.riskLevel] }} />
              <span className="text-white font-bold text-base">{selectedPoint.country}</span>
            </div>
            <button
              onClick={() => { setSelectedPoint(null); onCountrySelect?.(null); }}
              className="text-slate-400 hover:text-white text-sm p-1"
              data-testid="close-country-detail"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-slate-800/60 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-white">{formatNumber(selectedPoint.recentIncidents)}</div>
              <div className="text-[10px] text-slate-400">Scams Reported</div>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-2 text-center">
              <div className="text-lg font-bold flex items-center justify-center gap-1" style={{ color: RISK_COLORS[selectedPoint.riskLevel] }}>
                {selectedPoint.trendDirection === "up" ? "↑" : selectedPoint.trendDirection === "down" ? "↓" : "→"}
                {selectedPoint.trendPercent}%
              </div>
              <div className="text-[10px] text-slate-400">Change</div>
            </div>
          </div>
          <div className="mb-2">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Common Scams Here</div>
            <div className="flex flex-wrap gap-1">
              {selectedPoint.topScamTypes.slice(0, 4).map((t) => (
                <span key={t} className="text-[10px] bg-slate-800 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/20">{t.replace(/-/g, " ")}</span>
              ))}
            </div>
          </div>
          {selectedPoint.reportContact && (
            <div className="mt-2 pt-2 border-t border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Where to Report</div>
              <div className="text-[11px] text-cyan-400">{selectedPoint.reportContact}</div>
            </div>
          )}
          <div className="mt-2 pt-2 border-t border-slate-700">
            <div className="text-[10px] text-slate-500">Sources: {selectedPoint.sources.join(", ")}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export const ScamIntelligenceGlobe = memo(ScamIntelligenceGlobeInner);
