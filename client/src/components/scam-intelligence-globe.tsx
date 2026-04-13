"use client";

import { useEffect, useRef, useState, useCallback, memo, Component, type ErrorInfo, type ReactNode } from "react";
import { Globe as GlobeIcon, AlertTriangle, MapPin, Share2, Copy, Check, Phone, ExternalLink, ShieldAlert } from "lucide-react";

class GlobeErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean; errorMessage: string }
> {
  state = { hasError: false, errorMessage: "" };
  static getDerivedStateFromError(error: Error) { return { hasError: true, errorMessage: error.message }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("[ScamGlobe] Render error caught:", error.message, info.componentStack?.slice(0, 200));
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      if (gl instanceof WebGLRenderingContext || gl instanceof WebGL2RenderingContext) {
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function GlobeFallback({ data, onRetry }: { data: any; onRetry?: () => void }) {
  const hotspots = (data?.hotspots || []).slice(0, 12);
  return (
    <div className="w-full aspect-square max-w-[700px] mx-auto bg-slate-800/30 rounded-2xl flex flex-col items-center justify-center p-6" data-testid="globe-fallback">
      <GlobeIcon className="w-16 h-16 text-cyan-400/30 mb-4" />
      <p className="text-sm text-slate-400 mb-1">3D Globe could not load</p>
      <p className="text-xs text-slate-500 mb-4">Your browser may not support WebGL, or the 3D engine had a problem loading. Here's the data instead:</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mb-4 text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 px-4 py-1.5 rounded-lg border border-cyan-500/30 transition-colors"
          data-testid="globe-retry"
        >
          Try loading the 3D globe again
        </button>
      )}
      {hotspots.length > 0 && (
        <div className="w-full max-w-md space-y-1.5">
          {hotspots.map((h: any) => (
            <div key={h.id} className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-2 border border-slate-700/30">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: h.riskLevel === "critical" ? "#ef4444" : h.riskLevel === "high" ? "#f97316" : h.riskLevel === "medium" ? "#eab308" : "#22c55e" }} />
              <span className="text-xs text-white font-medium flex-1">{h.country}</span>
              <span className="text-[10px] text-slate-400">{formatNumber(h.recentIncidents)} scams</span>
              <span className="text-[10px] text-slate-500">{h.topScamTypes?.[0]?.replace(/-/g, " ")}</span>
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
  emergencySteps?: string[];
  emergencyHotline?: string;
  emergencyReportUrl?: string;
  emergencyFreezeCredit?: string;
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
  focusCountryCode?: string | null;
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

async function shareCountryAlert(country: string, riskLevel: string, incidents: number, method: "copy" | "whatsapp" | "email"): Promise<boolean> {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = `Scam alert for ${country}: ${incidents.toLocaleString()} scams reported (${riskLevel} risk). Stay safe — check the live scam map: ${url}`;
  if (method === "copy") {
    try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
  } else if (method === "whatsapp") {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  } else if (method === "email") {
    window.open(`mailto:?subject=${encodeURIComponent(`Scam alert: ${country}`)}&body=${encodeURIComponent(text)}`);
  }
  return true;
}

function ScamIntelligenceGlobeInner({ data, onCountrySelect, width, height, focusCountryCode }: ScamIntelligenceGlobeProps) {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [GlobeComponent, setGlobeComponent] = useState<any>(null);
  const [loadError, setLoadError] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [dimensions, setDimensions] = useState({ w: width || 600, h: height || 600 });
  const [hoveredPoint, setHoveredPoint] = useState<GlobeHotspot | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<GlobeHotspot | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const lastFocusedCodeRef = useRef<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const supported = checkWebGLSupport();
    setWebglSupported(supported);
    if (!supported) return;

    setLoadError(false);
    setGlobeComponent(null);
    let cancelled = false;

    const timer = setTimeout(() => {
      if (!cancelled && !GlobeComponent) {
        console.warn("[ScamGlobe] Globe library timed out after 20s");
        setLoadError(true);
      }
    }, 20000);

    import("react-globe.gl")
      .then((mod) => {
        if (!cancelled) {
          clearTimeout(timer);
          setGlobeComponent(() => mod.default);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          clearTimeout(timer);
          console.error("[ScamGlobe] Failed to load react-globe.gl:", err);
          setLoadError(true);
        }
      });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [retryCount]);

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
    if (!globeRef.current || !GlobeComponent) return;
    const globe = globeRef.current;
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = 200;
    controls.maxDistance = 500;
    globe.pointOfView({ lat: 20, lng: 10, altitude: 2.2 });
  }, [GlobeComponent]);

  useEffect(() => {
    if (!focusCountryCode || !data?.hotspots || !globeRef.current || focusCountryCode === lastFocusedCodeRef.current) return;
    const match = data.hotspots.find(h => h.countryCode === focusCountryCode);
    if (match) {
      const isFirstFocus = lastFocusedCodeRef.current === null;
      lastFocusedCodeRef.current = focusCountryCode;
      const delay = isFirstFocus ? 2000 : 300;
      setTimeout(() => {
        globeRef.current?.pointOfView({ lat: match.lat, lng: match.lng, altitude: 1.8 }, 1500);
        setSelectedPoint(match);
        setShowEmergency(false);
        onCountrySelect?.(match);
        const controls = globeRef.current?.controls();
        if (controls) { controls.autoRotate = false; setTimeout(() => { controls.autoRotate = true; }, 10000); }
      }, delay);
    }
  }, [focusCountryCode, data, onCountrySelect]);

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

  const handleRetry = useCallback(() => {
    setWebglSupported(checkWebGLSupport());
    setRetryCount(c => c + 1);
  }, []);

  if (!webglSupported || loadError) {
    return <GlobeFallback data={data} onRetry={handleRetry} />;
  }

  if (!GlobeComponent) {
    return (
      <div
        ref={containerRef}
        className="w-full aspect-square max-w-[700px] mx-auto bg-[#060d1a] rounded-2xl flex items-center justify-center"
      >
        <div className="text-center">
          <GlobeIcon className="w-10 h-10 text-cyan-400/30 mx-auto mb-2 animate-pulse" />
          <div className="text-cyan-400/50 text-sm">Loading 3D Globe...</div>
        </div>
      </div>
    );
  }

  const hotspots = data?.hotspots || [];
  const arcs = data?.arcs || [];

  return (
    <div ref={containerRef} className="relative w-full max-w-[700px] mx-auto" style={{ height: dimensions.h || 600 }}>
      <GlobeErrorBoundary fallback={<GlobeFallback data={data} onRetry={() => window.location.reload()} />}>
      <GlobeComponent
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
        <div className="absolute top-4 right-4 bg-slate-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4 max-w-[320px] z-10 max-h-[90%] overflow-y-auto" data-testid="globe-country-detail">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: RISK_COLORS[selectedPoint.riskLevel] }} />
              <span className="text-white font-bold text-base">{selectedPoint.country}</span>
            </div>
            <button
              onClick={() => { setSelectedPoint(null); onCountrySelect?.(null); setShowEmergency(false); }}
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
            <button
              onClick={() => setShowEmergency(!showEmergency)}
              className="w-full flex items-center gap-2 text-left"
              data-testid="toggle-emergency-steps"
            >
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span className="text-xs font-semibold text-red-400 flex-1">Been scammed? Here's what to do</span>
              <span className="text-slate-400 text-xs">{showEmergency ? "▲" : "▼"}</span>
            </button>
            {showEmergency && (
              <div className="mt-2 space-y-2" data-testid="emergency-steps-panel">
                {selectedPoint.emergencySteps && selectedPoint.emergencySteps.length > 0 ? (
                  <ol className="space-y-1.5">
                    {selectedPoint.emergencySteps.map((step, i) => (
                      <li key={i} className="flex gap-2 text-xs">
                        <span className="text-cyan-400 font-bold flex-shrink-0">{i + 1}.</span>
                        <span className="text-slate-300">{step}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <ol className="space-y-1.5">
                    <li className="flex gap-2 text-xs"><span className="text-cyan-400 font-bold flex-shrink-0">1.</span><span className="text-slate-300">Stop all contact with the scammer immediately</span></li>
                    <li className="flex gap-2 text-xs"><span className="text-cyan-400 font-bold flex-shrink-0">2.</span><span className="text-slate-300">Contact your bank to freeze accounts and dispute charges</span></li>
                    <li className="flex gap-2 text-xs"><span className="text-cyan-400 font-bold flex-shrink-0">3.</span><span className="text-slate-300">Change passwords for any accounts that may be compromised</span></li>
                    <li className="flex gap-2 text-xs"><span className="text-cyan-400 font-bold flex-shrink-0">4.</span><span className="text-slate-300">Report the scam to your local police and national fraud center</span></li>
                    <li className="flex gap-2 text-xs"><span className="text-cyan-400 font-bold flex-shrink-0">5.</span><span className="text-slate-300">Save all evidence (messages, emails, transaction records)</span></li>
                  </ol>
                )}
                {selectedPoint.emergencyHotline && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                    <Phone className="w-3.5 h-3.5 text-red-400" />
                    <div>
                      <div className="text-[10px] text-slate-400">Emergency Hotline</div>
                      <div className="text-xs text-red-400 font-semibold">{selectedPoint.emergencyHotline}</div>
                    </div>
                  </div>
                )}
                {selectedPoint.emergencyReportUrl && (
                  <a
                    href={selectedPoint.emergencyReportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                    data-testid="emergency-report-link"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Report online
                  </a>
                )}
                {selectedPoint.emergencyFreezeCredit && (
                  <div className="text-[10px] text-slate-400">
                    <span className="text-slate-500">Freeze credit:</span> {selectedPoint.emergencyFreezeCredit}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-700">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Warn Your Family</div>
            <div className="flex gap-1.5">
              <button
                onClick={async () => {
                  const ok = await shareCountryAlert(selectedPoint.country, selectedPoint.riskLevel, selectedPoint.recentIncidents, "copy");
                  if (ok) { setCopiedShare(true); setTimeout(() => setCopiedShare(false), 2000); }
                }}
                className="flex items-center gap-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700/50 transition-colors"
                data-testid="share-copy"
              >
                {copiedShare ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                {copiedShare ? "Copied" : "Copy"}
              </button>
              <button
                onClick={() => shareCountryAlert(selectedPoint.country, selectedPoint.riskLevel, selectedPoint.recentIncidents, "whatsapp")}
                className="flex items-center gap-1 text-[10px] bg-green-600/20 hover:bg-green-600/30 text-green-400 px-2.5 py-1.5 rounded-lg border border-green-500/20 transition-colors"
                data-testid="share-whatsapp"
              >
                <Share2 className="w-3 h-3" />
                WhatsApp
              </button>
              <button
                onClick={() => shareCountryAlert(selectedPoint.country, selectedPoint.riskLevel, selectedPoint.recentIncidents, "email")}
                className="flex items-center gap-1 text-[10px] bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-2.5 py-1.5 rounded-lg border border-blue-500/20 transition-colors"
                data-testid="share-email"
              >
                <MapPin className="w-3 h-3" />
                Email
              </button>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-700">
            <div className="text-[10px] text-slate-500">Sources: {selectedPoint.sources.join(", ")}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export const ScamIntelligenceGlobe = memo(ScamIntelligenceGlobeInner);
