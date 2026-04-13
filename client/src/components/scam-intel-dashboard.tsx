"use client";

import { useState, useEffect, memo } from "react";
import {
  Shield, AlertTriangle, TrendingUp, Globe, Activity,
  MapPin, Clock, ExternalLink, ChevronRight, Radio,
  Mail, Heart, Monitor, Lock, Smartphone, ShoppingCart,
  Bug, Briefcase, UserX, Fingerprint, ChevronDown, ChevronUp,
  BarChart3, Eye, Share2, Copy, Check, Flame, Sparkles, ShieldCheck
} from "lucide-react";

interface LiveFeedEvent {
  id: string;
  timestamp: string;
  type: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  region: string;
  country?: string;
  source: string;
  sourceUrl?: string;
  scamCategory?: string;
}

interface ScamTypeSummary {
  type: string;
  label: string;
  count: number;
  trend: "up" | "down" | "stable";
  trendPercent: number;
  color: string;
  icon: string;
  topRegions: string[];
  averageLoss: string;
  description: string;
  protectionTips: string[];
}

interface TrendingScam {
  type: string;
  label: string;
  description: string;
  trendPercent: number;
  isNew: boolean;
  affectedRegions: string[];
  weekStarted: string;
}

interface RegionalSummary {
  region: string;
  totalIncidents: number;
  topScamTypes: { type: string; count: number; trend: string }[];
  riskLevel: string;
  countries: { name: string; incidents: number; riskLevel: string }[];
  sources: string[];
  keyInsight: string;
}

interface GlobalStats {
  totalIncidentsTracked: number;
  countriesCovered: number;
  sourcesMonitored: number;
  lastRefresh: string;
  totalLossesTracked: string;
  activeScamTypes: number;
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
  info: "bg-blue-500",
};

const SEVERITY_TEXT: Record<string, string> = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-yellow-400",
  low: "text-green-400",
  info: "text-blue-400",
};

const RISK_BADGE: Record<string, { bg: string; text: string }> = {
  critical: { bg: "bg-red-500/15 border-red-500/30", text: "text-red-400" },
  high: { bg: "bg-orange-500/15 border-orange-500/30", text: "text-orange-400" },
  medium: { bg: "bg-yellow-500/15 border-yellow-500/30", text: "text-yellow-400" },
  low: { bg: "bg-green-500/15 border-green-500/30", text: "text-green-400" },
};

const ICON_MAP: Record<string, any> = {
  Mail, Heart, Monitor, Lock, Smartphone, ShoppingCart,
  Bug, Briefcase, UserX, Fingerprint, TrendingUp, AlertTriangle,
};

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return n.toLocaleString();
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function GlobalStatsBar({ stats }: { stats: GlobalStats | null }) {
  if (!stats) return null;
  const items = [
    { label: "Scams Reported", value: formatNumber(stats.totalIncidentsTracked), icon: Activity },
    { label: "Countries Tracked", value: stats.countriesCovered.toString(), icon: Globe },
    { label: "Trusted Sources", value: stats.sourcesMonitored.toString(), icon: Eye },
    { label: "Money Lost to Scams", value: stats.totalLossesTracked, icon: TrendingUp },
    { label: "Types of Scams", value: stats.activeScamTypes.toString(), icon: AlertTriangle },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" data-testid="global-stats-bar">
      {items.map((item) => (
        <div key={item.label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-center hover:border-cyan-500/30 transition-colors">
          <item.icon className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-white">{item.value}</div>
          <div className="text-[11px] text-slate-400">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function LiveFeedTicker({ events }: { events: LiveFeedEvent[] }) {
  const [visibleCount, setVisibleCount] = useState(8);

  if (events.length === 0) {
    return (
      <div className="bg-slate-800/30 rounded-xl p-6 text-center">
        <Radio className="w-6 h-6 text-slate-500 mx-auto mb-2" />
        <p className="text-slate-400 text-sm">Loading latest scam reports...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden" data-testid="live-feed-ticker">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50 bg-slate-800/50">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-sm font-semibold text-white">Latest Scam Reports</span>
        <span className="text-xs text-slate-400 ml-auto">{events.length} events</span>
      </div>
      <div className="divide-y divide-slate-700/30 max-h-[480px] overflow-y-auto">
        {events.slice(0, visibleCount).map((event) => (
          <div key={event.id} className="px-4 py-2.5 hover:bg-slate-700/20 transition-colors group">
            <div className="flex items-start gap-2">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${SEVERITY_COLORS[event.severity] || "bg-slate-500"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white leading-tight line-clamp-2">{event.title}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                  <span className={`font-medium ${SEVERITY_TEXT[event.severity] || "text-slate-400"}`}>{event.severity}</span>
                  <span>·</span>
                  <span>{event.source}</span>
                  <span>·</span>
                  <Clock className="w-3 h-3" />
                  <span>{timeAgo(event.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {visibleCount < events.length && (
        <button
          onClick={() => setVisibleCount((c) => c + 10)}
          className="w-full py-2 text-xs text-cyan-400 hover:text-cyan-300 border-t border-slate-700/50 transition-colors"
          data-testid="load-more-events"
        >
          Show more events
        </button>
      )}
    </div>
  );
}

function ScamTypeBreakdown({ scamTypes }: { scamTypes: ScamTypeSummary[] }) {
  const [expandedType, setExpandedType] = useState<string | null>(null);

  if (scamTypes.length === 0) return null;

  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden" data-testid="scam-type-breakdown">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50 bg-slate-800/50">
        <BarChart3 className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-semibold text-white">Most Common Scams Right Now</span>
      </div>
      <div className="divide-y divide-slate-700/30">
        {scamTypes.slice(0, 8).map((scam) => {
          const IconComp = ICON_MAP[scam.icon] || AlertTriangle;
          const isExpanded = expandedType === scam.type;
          const maxCount = scamTypes[0]?.count || 1;
          const barWidth = (scam.count / maxCount) * 100;

          return (
            <div key={scam.type}>
              <button
                onClick={() => setExpandedType(isExpanded ? null : scam.type)}
                className="w-full px-4 py-3 hover:bg-slate-700/20 transition-colors text-left"
                data-testid={`scam-type-${scam.type}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: scam.color + "20" }}>
                    <IconComp className="w-4 h-4" style={{ color: scam.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white font-medium">{scam.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white font-semibold">{formatNumber(scam.count)}</span>
                        <span className={`text-[10px] font-medium ${scam.trend === "up" ? "text-red-400" : scam.trend === "down" ? "text-green-400" : "text-slate-400"}`}>
                          {scam.trend === "up" ? "↑" : scam.trend === "down" ? "↓" : "→"}{scam.trendPercent}%
                        </span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                      </div>
                    </div>
                    <div className="w-full bg-slate-700/40 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${barWidth}%`, backgroundColor: scam.color }} />
                    </div>
                  </div>
                </div>
              </button>
              {isExpanded && (
                <div className="px-4 pb-3 pl-[60px]">
                  <p className="text-xs text-slate-400 mb-2">{scam.description}</p>
                  <div className="flex flex-wrap gap-2 text-[11px] mb-3">
                    <span className="text-slate-500">Typical loss per victim: <span className="text-orange-400 font-medium">{scam.averageLoss}</span></span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-500">Most affected: <span className="text-cyan-400">{scam.topRegions.join(", ")}</span></span>
                  </div>
                  {scam.protectionTips && scam.protectionTips.length > 0 && (
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-2.5" data-testid={`protection-tips-${scam.type}`}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-[11px] font-semibold text-green-400">How to protect yourself</span>
                      </div>
                      <ul className="space-y-1">
                        {scam.protectionTips.map((tip, i) => (
                          <li key={i} className="flex gap-2 text-[11px]">
                            <span className="text-green-400 flex-shrink-0">✓</span>
                            <span className="text-slate-300">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <ShareScamType scam={scam} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RegionalPanel({ regions, selectedRegion, onSelectRegion }: {
  regions: RegionalSummary[];
  selectedRegion: string | null;
  onSelectRegion: (region: string | null) => void;
}) {
  const selected = regions.find((r) => r.region === selectedRegion);

  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden" data-testid="regional-panel">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50 bg-slate-800/50">
        <MapPin className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-semibold text-white">Scams by Region</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3">
        {regions.map((region) => {
          const badge = RISK_BADGE[region.riskLevel] || RISK_BADGE.medium;
          const isSelected = selectedRegion === region.region;
          return (
            <button
              key={region.region}
              onClick={() => onSelectRegion(isSelected ? null : region.region)}
              className={`rounded-lg p-2.5 text-left border transition-all ${isSelected ? "border-cyan-500/50 bg-cyan-500/10" : "border-slate-700/30 bg-slate-800/30 hover:border-slate-600"}`}
              data-testid={`region-${region.region.toLowerCase().replace(/\s/g, "-")}`}
            >
              <div className="text-xs font-medium text-white mb-1">{region.region}</div>
              <div className="text-lg font-bold text-white">{formatNumber(region.totalIncidents)}</div>
              <div className={`inline-flex text-[10px] px-1.5 py-0.5 rounded border ${badge.bg} ${badge.text}`}>
                {region.riskLevel}
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="px-4 pb-4 border-t border-slate-700/30 pt-3">
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-white mb-1">{selected.region} — What You Should Know</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{selected.keyInsight}</p>
          </div>
          <div className="mb-3">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1.5">Biggest Scams Here</div>
            <div className="flex flex-wrap gap-1.5">
              {selected.topScamTypes.slice(0, 4).map((s) => (
                <span key={s.type} className="text-[10px] bg-slate-700/50 text-cyan-300 px-2 py-0.5 rounded-full">
                  {s.type.replace(/-/g, " ")} ({formatNumber(s.count)})
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1.5">Most Affected Countries</div>
            <div className="space-y-1">
              {selected.countries.slice(0, 5).map((c) => {
                const cBadge = RISK_BADGE[c.riskLevel] || RISK_BADGE.medium;
                return (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{c.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{formatNumber(c.incidents)}</span>
                      <span className={`text-[10px] px-1.5 rounded ${cBadge.bg} ${cBadge.text}`}>{c.riskLevel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-700/30">
            <div className="text-[10px] text-slate-500">Sources: {selected.sources.slice(0, 4).join(" · ")}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShareScamType({ scam }: { scam: ScamTypeSummary }) {
  const [copied, setCopied] = useState(false);

  const shareText = `Watch out for "${scam.label}" scams — ${scam.description} Typical loss: ${scam.averageLoss}. Tips: ${scam.protectionTips?.slice(0, 2).join(". ")}. More info at GetCyberRight.`;

  return (
    <div className="mt-2 flex items-center gap-1.5" data-testid={`share-scam-${scam.type}`}>
      <span className="text-[10px] text-slate-500 mr-1">Warn your family:</span>
      <button
        onClick={async () => {
          try { await navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
        }}
        className="flex items-center gap-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700/50 transition-colors"
        data-testid={`share-copy-${scam.type}`}
      >
        {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
        {copied ? "Copied" : "Copy"}
      </button>
      <button
        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer")}
        className="flex items-center gap-1 text-[10px] bg-green-600/20 hover:bg-green-600/30 text-green-400 px-2 py-1 rounded border border-green-500/20 transition-colors"
        data-testid={`share-whatsapp-${scam.type}`}
      >
        <Share2 className="w-3 h-3" />
        WhatsApp
      </button>
      <button
        onClick={() => window.open(`mailto:?subject=${encodeURIComponent(`Scam alert: ${scam.label}`)}&body=${encodeURIComponent(shareText)}`)}
        className="flex items-center gap-1 text-[10px] bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-2 py-1 rounded border border-blue-500/20 transition-colors"
        data-testid={`share-email-${scam.type}`}
      >
        <Share2 className="w-3 h-3" />
        Email
      </button>
    </div>
  );
}

function TrendingSection({ trending }: { trending: TrendingScam[] }) {
  if (!trending || trending.length === 0) return null;

  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden" data-testid="trending-section">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50 bg-slate-800/50">
        <Flame className="w-4 h-4 text-orange-400" />
        <span className="text-sm font-semibold text-white">New This Week</span>
        <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30 ml-auto">
          {trending.filter(t => t.isNew).length} new
        </span>
      </div>
      <div className="divide-y divide-slate-700/30">
        {trending.map((item) => (
          <div key={item.type} className="px-4 py-3 hover:bg-slate-700/20 transition-colors" data-testid={`trending-${item.type}`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {item.isNew ? (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full border border-red-500/30">
                    <Sparkles className="w-2.5 h-2.5" /> NEW
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-full border border-orange-500/30">
                    <TrendingUp className="w-2.5 h-2.5" /> HOT
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-white font-medium">{item.label}</span>
                  <span className="text-[10px] text-red-400 font-bold">↑{item.trendPercent}%</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-1.5">{item.description}</p>
                <div className="flex flex-wrap gap-1">
                  {item.affectedRegions.map(r => (
                    <span key={r} className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full border border-slate-700/30">{r}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { GlobalStatsBar, LiveFeedTicker, ScamTypeBreakdown, RegionalPanel, TrendingSection };
export type { LiveFeedEvent, ScamTypeSummary, RegionalSummary, GlobalStats, TrendingScam };
