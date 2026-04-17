"use client";

import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, AlertTriangle, TrendingUp, Globe as GlobeIcon, ExternalLink } from "lucide-react";

function formatNumber(n: number | undefined | null): string {
  if (n == null) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return n.toString();
}

interface EmbedProps {
  countryCode?: string;
}

export default function ScamIntelligenceEmbed({ countryCode }: EmbedProps) {
  const [code, setCode] = useState<string | null>(countryCode || null);

  useEffect(() => {
    if (countryCode) return;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const c = params.get("country");
    if (c) setCode(c.toUpperCase());
  }, [countryCode]);

  const { data: globeData } = useQuery({
    queryKey: ["/api/scam-intelligence/globe-data"],
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  const { data: liveFeed } = useQuery({
    queryKey: ["/api/scam-intelligence/live-feed"],
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });

  const stats = (globeData as any)?.globalStats;
  const hotspots = (globeData as any)?.hotspots || [];
  const events = (liveFeed as any)?.events || [];

  const localHotspot = useMemo(() => {
    if (!code) return null;
    return hotspots.find((h: any) => h.countryCode === code) || null;
  }, [code, hotspots]);

  const recentEvents = events.slice(0, 3);

  return (
    <div className="dark">
      <div className="bg-[#060d1a] text-white p-4 rounded-xl border border-cyan-500/20" data-testid="embed-widget" style={{ minHeight: 320 }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-semibold text-cyan-400">Live Scam Intelligence</span>
          <a
            href="https://www.getcyberright.com/scam-intelligence"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-[10px] text-slate-400 hover:text-cyan-400 inline-flex items-center gap-1"
            data-testid="embed-link"
          >
            getcyberright.com <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-2 text-center">
            <Activity className="w-3.5 h-3.5 text-cyan-400 mx-auto mb-0.5" />
            <div className="text-base font-bold text-white">{formatNumber(stats?.totalIncidentsTracked)}</div>
            <div className="text-[9px] text-slate-400">scams tracked</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-2 text-center">
            <GlobeIcon className="w-3.5 h-3.5 text-cyan-400 mx-auto mb-0.5" />
            <div className="text-base font-bold text-white">{stats?.countriesCovered ?? 0}</div>
            <div className="text-[9px] text-slate-400">countries</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-2 text-center">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400 mx-auto mb-0.5" />
            <div className="text-base font-bold text-white">{stats?.totalLossesTracked || "$0"}</div>
            <div className="text-[9px] text-slate-400">lost to fraud</div>
          </div>
        </div>

        {localHotspot && (
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-2.5 mb-3" data-testid="embed-local-hotspot">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: localHotspot.riskLevel === "critical" ? "#ef4444" : localHotspot.riskLevel === "high" ? "#f97316" : localHotspot.riskLevel === "medium" ? "#eab308" : "#22c55e" }}
              />
              <span className="text-xs font-semibold text-white">{localHotspot.country}</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 ml-auto">{localHotspot.riskLevel}</span>
            </div>
            <div className="text-[10px] text-slate-400">{formatNumber(localHotspot.recentIncidents)} reported · top: {localHotspot.topScamTypes?.[0]?.replace(/-/g, " ")}</div>
          </div>
        )}

        <div>
          <div className="flex items-center gap-1 mb-1.5">
            <AlertTriangle className="w-3 h-3 text-orange-400" />
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Latest alerts</span>
          </div>
          <div className="space-y-1.5">
            {recentEvents.length === 0 ? (
              <div className="text-[10px] text-slate-500">Loading...</div>
            ) : recentEvents.map((e: any) => (
              <div key={e.id} className="text-[10px] text-slate-300 leading-snug line-clamp-2" data-testid={`embed-event-${e.id}`}>
                <span className="text-slate-500">·</span> {e.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
