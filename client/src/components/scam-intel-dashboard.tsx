"use client";

import { useState, useEffect, memo } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import {
  Shield, AlertTriangle, TrendingUp, Globe, Activity,
  MapPin, Clock, ExternalLink, ChevronRight, Radio,
  Mail, Heart, Monitor, Lock, Smartphone, ShoppingCart,
  Bug, Briefcase, UserX, Fingerprint, ChevronDown, ChevronUp,
  BarChart3, Eye, Share2, Copy, Check, Flame, Sparkles, ShieldCheck,
  ArrowUp, ArrowDown, Minus, Database, CheckCircle2, AlertCircle, Filter
} from "lucide-react";
import { Link } from "@/lib/navigation";

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
  totalLossesAmountUsd?: number;
  activeScamTypes: number;
  wowChange?: {
    incidentsPercent: number;
    incidentsDirection: "up" | "down" | "stable";
    countriesAtCriticalRisk: number;
    countriesTrendingUp: number;
  };
}

export interface SourceMetadata {
  id: string;
  name: string;
  category: "law-enforcement" | "government" | "research" | "industry" | "open-data";
  countryCode?: string;
  url?: string;
  lastFetched: string;
  recordsContributed: number;
  status: "live" | "delayed" | "stale";
}

export type TimeRange = "1h" | "24h" | "7d" | "30d" | "all";

export const TIME_RANGE_LABEL: Record<TimeRange, string> = {
  "1h": "Last hour",
  "24h": "Last 24h",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "all": "All-time",
};

const TIME_RANGE_MS: Record<TimeRange, number> = {
  "1h": 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
  "all": Number.POSITIVE_INFINITY,
};

const CURRENCY_BY_COUNTRY: Record<string, { code: string; symbol: string; rate: number; locale: string }> = {
  US: { code: "USD", symbol: "$", rate: 1, locale: "en-US" },
  CA: { code: "CAD", symbol: "C$", rate: 1.36, locale: "en-CA" },
  GB: { code: "GBP", symbol: "£", rate: 0.79, locale: "en-GB" },
  EU: { code: "EUR", symbol: "€", rate: 0.92, locale: "en-IE" },
  DE: { code: "EUR", symbol: "€", rate: 0.92, locale: "de-DE" },
  FR: { code: "EUR", symbol: "€", rate: 0.92, locale: "fr-FR" },
  ES: { code: "EUR", symbol: "€", rate: 0.92, locale: "es-ES" },
  IT: { code: "EUR", symbol: "€", rate: 0.92, locale: "it-IT" },
  NL: { code: "EUR", symbol: "€", rate: 0.92, locale: "nl-NL" },
  IE: { code: "EUR", symbol: "€", rate: 0.92, locale: "en-IE" },
  AU: { code: "AUD", symbol: "A$", rate: 1.52, locale: "en-AU" },
  NZ: { code: "NZD", symbol: "NZ$", rate: 1.65, locale: "en-NZ" },
  IN: { code: "INR", symbol: "₹", rate: 83.2, locale: "en-IN" },
  JP: { code: "JPY", symbol: "¥", rate: 150, locale: "ja-JP" },
  CN: { code: "CNY", symbol: "¥", rate: 7.2, locale: "zh-CN" },
  KR: { code: "KRW", symbol: "₩", rate: 1340, locale: "ko-KR" },
  SG: { code: "SGD", symbol: "S$", rate: 1.34, locale: "en-SG" },
  HK: { code: "HKD", symbol: "HK$", rate: 7.81, locale: "en-HK" },
  BR: { code: "BRL", symbol: "R$", rate: 5.05, locale: "pt-BR" },
  MX: { code: "MXN", symbol: "Mex$", rate: 17, locale: "es-MX" },
  ZA: { code: "ZAR", symbol: "R", rate: 18.5, locale: "en-ZA" },
  NG: { code: "NGN", symbol: "₦", rate: 1500, locale: "en-NG" },
  AE: { code: "AED", symbol: "AED", rate: 3.67, locale: "ar-AE" },
  SA: { code: "SAR", symbol: "SAR", rate: 3.75, locale: "ar-SA" },
  CH: { code: "CHF", symbol: "CHF", rate: 0.88, locale: "de-CH" },
  SE: { code: "SEK", symbol: "kr", rate: 10.5, locale: "sv-SE" },
};

export function localizeLoss(usdAmount: number | undefined, countryCode: string | null | undefined): string {
  if (!usdAmount || usdAmount <= 0) return "$0";
  const cfg = (countryCode && CURRENCY_BY_COUNTRY[countryCode]) || CURRENCY_BY_COUNTRY.US;
  const local = usdAmount * cfg.rate;
  if (local >= 1e12) return `${cfg.symbol}${(local / 1e12).toFixed(2)}T+`;
  if (local >= 1e9) return `${cfg.symbol}${(local / 1e9).toFixed(1)}B+`;
  if (local >= 1e6) return `${cfg.symbol}${(local / 1e6).toFixed(1)}M+`;
  return `${cfg.symbol}${Math.round(local).toLocaleString(cfg.locale)}`;
}

export function filterEventsByRange<T extends { timestamp: string }>(events: T[], range: TimeRange): T[] {
  if (range === "all") return events;
  const cutoff = Date.now() - TIME_RANGE_MS[range];
  return events.filter(e => {
    const t = new Date(e.timestamp).getTime();
    return Number.isFinite(t) && t >= cutoff;
  });
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
  info: "bg-blue-500",
};

const SEVERITY_TEXT: Record<string, string> = {
  critical: "text-red-600 dark:text-red-400",
  high: "text-orange-600 dark:text-orange-400",
  medium: "text-yellow-600 dark:text-yellow-400",
  low: "text-green-600 dark:text-green-400",
  info: "text-blue-600 dark:text-blue-400",
};

const RISK_BADGE: Record<string, { bg: string; text: string }> = {
  critical: { bg: "bg-red-500/15 border-red-500/30", text: "text-red-600 dark:text-red-400" },
  high: { bg: "bg-orange-500/15 border-orange-500/30", text: "text-orange-600 dark:text-orange-400" },
  medium: { bg: "bg-yellow-500/15 border-yellow-500/30", text: "text-yellow-600 dark:text-yellow-400" },
  low: { bg: "bg-green-500/15 border-green-500/30", text: "text-green-600 dark:text-green-400" },
};

const ICON_MAP: Record<string, any> = {
  Mail, Heart, Monitor, Lock, Smartphone, ShoppingCart,
  Bug, Briefcase, UserX, Fingerprint, TrendingUp, AlertTriangle,
};

function formatNumber(n: number | undefined | null): string {
  if (n == null) return "0";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return n.toString();
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

function DeltaBadge({ percent, direction, suffix = "vs last week" }: { percent: number; direction: "up" | "down" | "stable"; suffix?: string }) {
  if (direction === "stable" || Math.abs(percent) < 0.5) {
    return (
      <div className="inline-flex items-center gap-1 text-[10px] text-muted-foreground" data-testid="stat-delta-stable">
        <Minus className="w-2.5 h-2.5" />
        <span>flat {suffix}</span>
      </div>
    );
  }
  const up = direction === "up";
  return (
    <div className={`inline-flex items-center gap-1 text-[10px] font-semibold ${up ? "text-red-500" : "text-emerald-500"}`} data-testid={`stat-delta-${direction}`}>
      {up ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
      <span>{up ? "+" : ""}{percent.toFixed(1)}% {suffix}</span>
    </div>
  );
}

function GlobalStatsBar({ stats, visitorCountryCode }: { stats: GlobalStats | null; visitorCountryCode?: string | null }) {
  if (!stats) return null;
  const wow = stats.wowChange;
  const localizedLoss = stats.totalLossesAmountUsd
    ? localizeLoss(stats.totalLossesAmountUsd, visitorCountryCode)
    : (stats.totalLossesTracked || "$0");

  const items: Array<{ label: string; value: string; icon: any; delta?: { percent: number; direction: "up" | "down" | "stable"; suffix?: string }; testid: string }> = [
    {
      label: "Scams Reported", value: formatNumber(stats.totalIncidentsTracked), icon: Activity, testid: "stat-incidents",
      delta: wow ? { percent: wow.incidentsPercent, direction: wow.incidentsDirection } : undefined,
    },
    { label: "Countries Tracked", value: String(stats.countriesCovered ?? 0), icon: Globe, testid: "stat-countries" },
    { label: "Trusted Sources", value: String(stats.sourcesMonitored ?? 0), icon: Eye, testid: "stat-sources" },
    { label: "Money Lost to Scams", value: localizedLoss, icon: TrendingUp, testid: "stat-losses" },
    {
      label: "Countries Trending Up", value: String(wow?.countriesTrendingUp ?? stats.activeScamTypes ?? 0), icon: AlertTriangle, testid: "stat-trending",
      delta: wow ? { percent: wow.countriesAtCriticalRisk, direction: wow.countriesAtCriticalRisk > 0 ? "up" : "stable", suffix: "at critical risk" } : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" data-testid="global-stats-bar">
      {items.map((item) => (
        <div key={item.label} className="bg-card border border-border rounded-xl p-3 text-center hover:border-primary/30 transition-colors" data-testid={item.testid}>
          <item.icon className="w-4 h-4 text-primary mx-auto mb-1" />
          <div className="text-xl font-bold text-foreground">{item.value}</div>
          <div className="text-[11px] text-muted-foreground mb-1">{item.label}</div>
          {item.delta && <DeltaBadge percent={item.delta.percent} direction={item.delta.direction} suffix={item.delta.suffix} />}
        </div>
      ))}
    </div>
  );
}

function TimeRangeSelector({ value, onChange }: { value: TimeRange; onChange: (v: TimeRange) => void }) {
  const ranges: TimeRange[] = ["1h", "24h", "7d", "30d", "all"];
  return (
    <div className="inline-flex items-center gap-1 bg-card border border-border rounded-lg p-1" role="tablist" aria-label="Time range" data-testid="time-range-selector">
      <Clock className="w-3.5 h-3.5 text-muted-foreground ml-1.5 mr-0.5" aria-hidden="true" />
      {ranges.map(r => (
        <button
          key={r}
          role="tab"
          aria-selected={value === r}
          onClick={() => onChange(r)}
          className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-colors ${
            value === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
          data-testid={`time-range-${r}`}
        >
          {r === "all" ? "All-time" : r.replace("h", "h").replace("d", "d")}
        </button>
      ))}
    </div>
  );
}

const SOURCE_CATEGORY_LABEL: Record<string, string> = {
  "law-enforcement": "Law enforcement",
  government: "Government / CERT",
  research: "Research / NGO",
  industry: "Industry partner",
  "open-data": "Open data feed",
};

function SourceTransparencyDrawer({ sources }: { sources: SourceMetadata[] }) {
  const [open, setOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const hydrated = useHydrated();

  const filtered = filterCategory === "all" ? sources : sources.filter(s => s.category === filterCategory);
  const categories = Array.from(new Set(sources.map(s => s.category)));
  const liveCount = sources.filter(s => s.status === "live").length;
  const totalRecords = sources.reduce((s, src) => s + src.recordsContributed, 0);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden" data-testid="source-transparency-drawer">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
        aria-expanded={open}
        aria-controls="source-list"
        data-testid="toggle-source-drawer"
      >
        <Database className="w-4 h-4 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground">Where this data comes from</div>
          <div className="text-[11px] text-muted-foreground">
            {sources.length} sources tracked · {liveCount} updating live · {formatNumber(totalRecords)} records ingested
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {open && (
        <div id="source-list" className="border-t border-border">
          <div className="flex flex-wrap items-center gap-1.5 px-4 py-2 border-b border-border bg-secondary/30">
            <Filter className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
            <button
              onClick={() => setFilterCategory("all")}
              className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                filterCategory === "all" ? "bg-primary/15 border-primary/40 text-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"
              }`}
              data-testid="source-filter-all"
            >
              All ({sources.length})
            </button>
            {categories.map(c => {
              const count = sources.filter(s => s.category === c).length;
              return (
                <button
                  key={c}
                  onClick={() => setFilterCategory(c)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                    filterCategory === c ? "bg-primary/15 border-primary/40 text-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`source-filter-${c}`}
                >
                  {SOURCE_CATEGORY_LABEL[c] || c} ({count})
                </button>
              );
            })}
          </div>
          <div className="max-h-[420px] overflow-y-auto divide-y divide-border">
            {filtered.map(s => (
              <div key={s.id} className="px-4 py-2.5 hover:bg-secondary/40 transition-colors" data-testid={`source-row-${s.id}`}>
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex-shrink-0">
                    {s.status === "live" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" aria-label="live" />
                    ) : s.status === "delayed" ? (
                      <Clock className="w-3.5 h-3.5 text-amber-500" aria-label="delayed" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" aria-label="stale" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {s.url ? (
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground hover:text-primary inline-flex items-center gap-1">
                          {s.name}
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                      ) : (
                        <span className="text-sm font-medium text-foreground">{s.name}</span>
                      )}
                      {s.countryCode && (
                        <span className="text-[10px] uppercase tracking-wider bg-secondary text-muted-foreground px-1.5 py-0.5 rounded border border-border">
                          {s.countryCode}
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground">{SOURCE_CATEGORY_LABEL[s.category] || s.category}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-[11px] text-muted-foreground">
                      <span>Last fetched {hydrated ? timeAgo(s.lastFetched) : "..."}</span>
                      <span>·</span>
                      <span>{formatNumber(s.recordsContributed)} records</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-6 text-center text-xs text-muted-foreground">No sources match this filter.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function LiveFeedTicker({ events, timeRange = "7d" }: { events: LiveFeedEvent[]; timeRange?: TimeRange }) {
  const hydrated = useHydrated();
  const [visibleCount, setVisibleCount] = useState(8);
  const filtered = filterEventsByRange(events, timeRange);
  const [announcement, setAnnouncement] = useState("");
  const lastTopIdRef = (typeof window !== "undefined" ? (window as any).__lastFeedRef : undefined) || { current: null as string | null };

  useEffect(() => {
    if (!hydrated || filtered.length === 0) return;
    const topId = filtered[0]?.id;
    if (topId && lastTopIdRef.current && topId !== lastTopIdRef.current) {
      const recentCount = filterEventsByRange(events, "1h").length;
      setAnnouncement(`${recentCount} new scam alerts in the last hour. ${filtered[0]?.title?.slice(0, 100) || ""}`);
    }
    lastTopIdRef.current = topId;
  }, [filtered.length > 0 ? filtered[0]?.id : null, hydrated]);

  if (filtered.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 text-center" data-testid="live-feed-ticker-empty">
        <Radio className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground text-sm">
          {events.length === 0 ? "Loading latest scam reports..." : `No scam reports in ${TIME_RANGE_LABEL[timeRange].toLowerCase()}.`}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden" data-testid="live-feed-ticker">
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only" data-testid="live-feed-aria">{announcement}</div>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-sm font-semibold text-foreground">Latest Scam Reports</span>
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} in {TIME_RANGE_LABEL[timeRange].toLowerCase()}</span>
      </div>
      <div className="divide-y divide-border max-h-[480px] overflow-y-auto">
        {filtered.slice(0, visibleCount).map((event) => (
          <div key={event.id} className="px-4 py-2.5 hover:bg-secondary/50 transition-colors group">
            <div className="flex items-start gap-2">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${SEVERITY_COLORS[event.severity] || "bg-muted-foreground"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-tight line-clamp-2">{event.title}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                  <span className={`font-medium ${SEVERITY_TEXT[event.severity] || "text-muted-foreground"}`}>{event.severity}</span>
                  <span>·</span>
                  <span>{event.source}</span>
                  <span>·</span>
                  <Clock className="w-3 h-3" />
                  <span>{hydrated ? timeAgo(event.timestamp) : ""}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {visibleCount < filtered.length && (
        <button
          onClick={() => setVisibleCount((c) => c + 10)}
          className="w-full py-2 text-xs text-primary hover:text-primary/80 border-t border-border transition-colors"
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
    <div className="bg-card border border-border rounded-xl overflow-hidden" data-testid="scam-type-breakdown">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
        <BarChart3 className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Most Common Scams Right Now</span>
      </div>
      <div className="divide-y divide-border">
        {scamTypes.slice(0, 8).map((scam) => {
          const IconComp = ICON_MAP[scam.icon] || AlertTriangle;
          const isExpanded = expandedType === scam.type;
          const maxCount = scamTypes[0]?.count || 1;
          const barWidth = (scam.count / maxCount) * 100;

          return (
            <div key={scam.type}>
              <button
                onClick={() => setExpandedType(isExpanded ? null : scam.type)}
                className="w-full px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
                data-testid={`scam-type-${scam.type}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: scam.color + "20" }}>
                    <IconComp className="w-4 h-4" style={{ color: scam.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground font-medium">{scam.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-foreground font-semibold">{formatNumber(scam.count)}</span>
                        <span className={`text-[10px] font-medium ${scam.trend === "up" ? "text-red-600 dark:text-red-400" : scam.trend === "down" ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                          {scam.trend === "up" ? "↑" : scam.trend === "down" ? "↓" : "→"}{scam.trendPercent}%
                        </span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${barWidth}%`, backgroundColor: scam.color }} />
                    </div>
                  </div>
                </div>
              </button>
              {isExpanded && (
                <div className="px-4 pb-3 pl-[60px]">
                  <p className="text-xs text-muted-foreground mb-2">{scam.description}</p>
                  <div className="flex flex-wrap gap-2 text-[11px] mb-3">
                    <span className="text-muted-foreground">Typical loss per victim: <span className="text-orange-600 dark:text-orange-400 font-medium">{scam.averageLoss}</span></span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">Most affected: <span className="text-primary">{scam.topRegions.join(", ")}</span></span>
                  </div>
                  {scam.protectionTips && scam.protectionTips.length > 0 && (
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-2.5" data-testid={`protection-tips-${scam.type}`}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                        <span className="text-[11px] font-semibold text-green-600 dark:text-green-400">How to protect yourself</span>
                      </div>
                      <ul className="space-y-1">
                        {scam.protectionTips.map((tip, i) => (
                          <li key={i} className="flex gap-2 text-[11px]">
                            <span className="text-green-600 dark:text-green-400 flex-shrink-0">✓</span>
                            <span className="text-muted-foreground">{tip}</span>
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
    <div className="bg-card border border-border rounded-xl overflow-hidden" data-testid="regional-panel">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
        <MapPin className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Scams by Region</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3">
        {regions.map((region) => {
          const badge = RISK_BADGE[region.riskLevel] || RISK_BADGE.medium;
          const isSelected = selectedRegion === region.region;
          return (
            <button
              key={region.region}
              onClick={() => onSelectRegion(isSelected ? null : region.region)}
              className={`rounded-lg p-2.5 text-left border transition-all ${isSelected ? "border-primary/50 bg-primary/10" : "border-border bg-secondary/50 hover:border-primary/30"}`}
              data-testid={`region-${region.region.toLowerCase().replace(/\s/g, "-")}`}
            >
              <div className="text-xs font-medium text-foreground mb-1">{region.region}</div>
              <div className="text-lg font-bold text-foreground">{formatNumber(region.totalIncidents)}</div>
              <div className={`inline-flex text-[10px] px-1.5 py-0.5 rounded border ${badge.bg} ${badge.text}`}>
                {region.riskLevel}
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="px-4 pb-4 border-t border-border pt-3">
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-foreground mb-1">{selected.region}: What You Should Know</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{selected.keyInsight}</p>
          </div>
          <div className="mb-3">
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1.5">Biggest Scams Here</div>
            <div className="flex flex-wrap gap-1.5">
              {selected.topScamTypes.slice(0, 4).map((s) => (
                <span key={s.type} className="text-[10px] bg-secondary text-primary px-2 py-0.5 rounded-full">
                  {s.type.replace(/-/g, " ")} ({formatNumber(s.count)})
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1.5">Most Affected Countries</div>
            <div className="space-y-1">
              {selected.countries.slice(0, 5).map((c) => {
                const cBadge = RISK_BADGE[c.riskLevel] || RISK_BADGE.medium;
                return (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <span className="text-foreground">{c.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{formatNumber(c.incidents)}</span>
                      <span className={`text-[10px] px-1.5 rounded ${cBadge.bg} ${cBadge.text}`}>{c.riskLevel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-border">
            <div className="text-[10px] text-muted-foreground">Sources: {selected.sources.slice(0, 4).join(" · ")}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShareScamType({ scam }: { scam: ScamTypeSummary }) {
  const [copied, setCopied] = useState(false);

  const shareText = `Watch out for "${scam.label}" scams. ${scam.description} Typical loss: ${scam.averageLoss}. Tips: ${scam.protectionTips?.slice(0, 2).join(". ")}. More info at GetCyberRight.`;

  return (
    <div className="mt-2 flex items-center gap-1.5" data-testid={`share-scam-${scam.type}`}>
      <span className="text-[10px] text-muted-foreground mr-1">Warn your family:</span>
      <button
        onClick={async () => {
          try { await navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
        }}
        className="flex items-center gap-1 text-[10px] bg-secondary hover:bg-secondary/80 text-foreground px-2 py-1 rounded border border-border transition-colors"
        data-testid={`share-copy-${scam.type}`}
      >
        {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
        {copied ? "Copied" : "Copy"}
      </button>
      <button
        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer")}
        className="flex items-center gap-1 text-[10px] bg-green-600/20 hover:bg-green-600/30 text-green-700 dark:text-green-400 px-2 py-1 rounded border border-green-500/20 transition-colors"
        data-testid={`share-whatsapp-${scam.type}`}
      >
        <Share2 className="w-3 h-3" />
        WhatsApp
      </button>
      <button
        onClick={() => window.open(`mailto:?subject=${encodeURIComponent(`Scam alert: ${scam.label}`)}&body=${encodeURIComponent(shareText)}`)}
        className="flex items-center gap-1 text-[10px] bg-blue-600/20 hover:bg-blue-600/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded border border-blue-500/20 transition-colors"
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
    <div className="bg-card border border-border rounded-xl overflow-hidden" data-testid="trending-section">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
        <Flame className="w-4 h-4 text-orange-500" />
        <span className="text-sm font-semibold text-foreground">New This Week</span>
        <span className="text-[10px] bg-red-500/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full border border-red-500/30 ml-auto">
          {trending.filter(t => t.isNew).length} new
        </span>
      </div>
      <div className="divide-y divide-border">
        {trending.map((item) => (
          <div key={item.type} className="px-4 py-3 hover:bg-secondary/50 transition-colors" data-testid={`trending-${item.type}`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {item.isNew ? (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-red-500/20 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full border border-red-500/30">
                    <Sparkles className="w-2.5 h-2.5" /> NEW
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-orange-500/20 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded-full border border-orange-500/30">
                    <TrendingUp className="w-2.5 h-2.5" /> HOT
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-foreground font-medium">{item.label}</span>
                  <span className="text-[10px] text-red-600 dark:text-red-400 font-bold">↑{item.trendPercent}%</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-1.5">{item.description}</p>
                <div className="flex flex-wrap gap-1">
                  {item.affectedRegions.map(r => (
                    <span key={r} className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-full border border-border">{r}</span>
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

const SCAM_TO_TOOL: Record<string, { name: string; href: string; description: string }> = {
  phishing: { name: "AI Scam Analyzer", href: "/scam-checker", description: "Paste any suspicious email, text, or link to get an instant AI analysis" },
  "crypto-scam": { name: "AI Scam Analyzer", href: "/scam-checker", description: "Upload screenshots of crypto offers for instant fraud detection" },
  "identity-theft": { name: "Data Shield Scanner", href: "/shield", description: "Scan 500+ data brokers to find where your personal info is exposed" },
  ransomware: { name: "Security Guides", href: "/guides", description: "Step-by-step backup and recovery guides to protect your files" },
  malware: { name: "Browser Extension", href: "/browser-extension", description: "Real-time protection that blocks dangerous sites before you visit them" },
  "shopping-fraud": { name: "AI Scam Analyzer", href: "/scam-checker", description: "Check any online store or deal before you buy" },
  romance: { name: "AI Scam Analyzer", href: "/scam-checker", description: "Analyze suspicious messages or profiles for common scam patterns" },
  impersonation: { name: "Security Training", href: "/training", description: "Learn to spot impersonation tactics used by scammers" },
  "tech-support": { name: "AI Scam Analyzer", href: "/scam-checker", description: "Screenshot the pop-up or paste the message to check if it's real" },
  "mobile-money": { name: "Security Guides", href: "/guides", description: "Protect your mobile payment accounts with these security steps" },
  investment: { name: "AI Scam Analyzer", href: "/scam-checker", description: "Check investment offers and platforms for known fraud signals" },
  "job-scam": { name: "AI Scam Analyzer", href: "/scam-checker", description: "Paste the job listing or recruiter message to verify if it's legitimate" },
};

const FAMILY_AUDIENCES = [
  { id: "kids", label: "Talk to Your Kids", icon: "child", ageHint: "Ages 8-14" },
  { id: "teens", label: "Talk to Your Teens", icon: "teen", ageHint: "Ages 14-18" },
  { id: "parents", label: "Show Your Parents", icon: "parent", ageHint: "Older adults" },
  { id: "partner", label: "Discuss with Partner", icon: "partner", ageHint: "Household safety" },
];

const FAMILY_TALKING_POINTS: Record<string, Record<string, string[]>> = {
  phishing: {
    kids: [
      "If you get a message saying you won something or need to click a link, show it to me first",
      "Real companies won't ask for your password in a message. That's always a trick",
    ],
    teens: [
      "Before you click any link in a DM or text, check who really sent it. Scammers copy accounts of people you follow",
      "If a website asks for your login after you clicked a link, close it and go directly to the real site",
    ],
    parents: [
      "If you get an email from your bank asking you to verify something, don't click the link. Call the bank directly",
      "Look at the sender's email address carefully. Scammers use addresses that look almost right but have small differences",
    ],
    partner: [
      "Let's agree: neither of us clicks links in unexpected emails without checking with each other first",
      "We should set up two-factor authentication on all our shared accounts this week",
    ],
  },
  "crypto-scam": {
    kids: ["If someone online tells you about an easy way to make money, it's almost always a trick. Real money takes real work"],
    teens: [
      "Those celebrity crypto ads on social media are deepfakes. The celebrities never actually said those things",
      "Never send crypto to someone who promises to send back more. Once it's sent, it's gone forever",
    ],
    parents: [
      "If someone contacts you about a cryptocurrency investment, even if they seem knowledgeable, be very cautious. Many are scams",
      "Never let anyone you met online guide you through installing apps or sending money to 'invest'",
    ],
    partner: ["Let's agree that any investment over $100 gets discussed together first. Scammers create urgency to prevent this"],
  },
  impersonation: {
    kids: ["If someone calls saying they're a police officer or teacher and asks for information, hang up and tell me right away"],
    teens: [
      "If a friend texts from a different number asking for money or gift cards, call them on their real number first",
      "No real company or government agency will ever ask for gift cards as payment",
    ],
    parents: [
      "If someone calls saying a grandchild is in trouble and needs money, hang up and call the grandchild directly",
      "Government agencies like the IRS never call demanding immediate payment",
    ],
    partner: ["Let's create a family code word that only we know, so we can verify identity in an emergency call"],
  },
  "tech-support": {
    kids: ["If a pop-up says your computer has a virus and gives a phone number, never call it. Close the window and tell me"],
    teens: ["Microsoft, Apple, and Google will never call you about a problem with your computer. Those calls are always scams"],
    parents: [
      "If you see a scary pop-up about viruses, don't call the number shown. Just close your browser",
      "No real tech company will ever ask you to buy gift cards to fix a computer problem",
    ],
    partner: ["If either of us gets a tech support call we didn't request, we should hang up and discuss it together"],
  },
  romance: {
    kids: [],
    teens: [
      "If someone you've only talked to online suddenly asks for money or says they're in an emergency, be very careful",
      "Real friends and partners don't ask for money through apps or gift cards",
    ],
    parents: [
      "Be cautious of anyone you meet online who quickly professes strong feelings but can never video chat or meet in person",
      "Never send money to someone you haven't met face-to-face, no matter how convincing their story is",
    ],
    partner: ["Let's talk openly about online relationships in our family. Scammers specifically target lonely or isolated people"],
  },
};

function ToolConnectionBanner({ scamTypes }: { scamTypes: ScamTypeSummary[] }) {
  const topTypes = scamTypes.slice(0, 3).map(s => s.type);
  const tools = topTypes.map(t => SCAM_TO_TOOL[t]).filter(Boolean);

  if (tools.length === 0) return null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4" data-testid="tool-connection-banner">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Protect Your Family Now</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">Based on the scams trending right now, these tools can help protect you:</p>
      <div className="space-y-2">
        {tools.map((tool, i) => (
          <Link
            key={i}
            href={tool.href}
            className="flex items-center gap-3 bg-card border border-border rounded-lg p-3 hover:border-primary/30 transition-colors group"
            data-testid={`tool-link-${i}`}
          >
            <Shield className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{tool.name}</div>
              <div className="text-[11px] text-muted-foreground line-clamp-1">{tool.description}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function LocalRiskSummary({ visitorCountryName, hotspots, trending }: {
  visitorCountryName: string | null;
  hotspots: any[];
  trending: TrendingScam[];
}) {
  const countryName = visitorCountryName || "your area";
  const localHotspot = hotspots.find((h: any) =>
    h.country?.toLowerCase() === visitorCountryName?.toLowerCase()
  );

  const topTrending = trending.slice(0, 3);
  const riskLevel = localHotspot?.riskLevel || "medium";
  const badge = RISK_BADGE[riskLevel] || RISK_BADGE.medium;

  return (
    <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-5" data-testid="local-risk-summary">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-orange-500/15 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-base font-bold text-foreground">This week near {countryName}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text} font-medium`}>
              {riskLevel} risk
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            <span className="text-orange-600 dark:text-orange-400 font-semibold">
              {topTrending.length} new scam types are
            </span>{" "}
            targeting families in {countryName} this week. Stay alert for{" "}
            {topTrending.map(t => t.label.toLowerCase()).join(", ") || "emerging"} scams.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{localHotspot ? `${formatNumber(localHotspot.recentIncidents ?? localHotspot.totalIncidents)} reports this period` : "Reports being collected"}</span>
            <span>|</span>
            <span>Trend: {(localHotspot?.trendDirection ?? localHotspot?.trend) === "up" ? "Rising" : (localHotspot?.trendDirection ?? localHotspot?.trend) === "down" ? "Declining" : "Stable"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProtectFamilyPanel({ visitorCountryName, topScamTypes, trending }: {
  visitorCountryName: string | null;
  topScamTypes: ScamTypeSummary[];
  trending: TrendingScam[];
}) {
  const topScamType = topScamTypes[0]?.type || "phishing";
  const tool = SCAM_TO_TOOL[topScamType] || SCAM_TO_TOOL.phishing;

  return (
    <div className="bg-card border border-border rounded-xl p-5" data-testid="protect-family-panel">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-primary" />
        <h3 className="text-base font-bold text-foreground">What You Can Do Right Now</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-foreground mb-2">
            The biggest threat near {visitorCountryName || "you"} right now
          </h4>
          <p className="text-xs text-muted-foreground mb-3">
            {topScamTypes[0]?.label || "Phishing"} scams are the most reported type in your area.
            {topScamTypes[0]?.description ? ` ${topScamTypes[0].description}` : ""}
          </p>
          <Link
            href={tool.href}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            data-testid="link-protect-tool"
          >
            <Shield className="w-4 h-4" />
            {tool.name}
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Quick safety checklist</h4>
          <div className="space-y-2">
            {[
              "Check if your email has been in a data breach",
              "Turn on two-factor authentication for bank and email",
              "Talk to your family about the scams trending now",
              "Run a scan to see if data brokers have your info",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] text-primary font-bold">{i + 1}</span>
                </div>
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FamilyConversationStarters({ trending, scamTypes }: {
  trending: TrendingScam[];
  scamTypes: ScamTypeSummary[];
}) {
  const [selectedAudience, setSelectedAudience] = useState("kids");

  const relevantTypes = scamTypes.slice(0, 4).map(s => s.type);
  const talkingPoints: { type: string; label: string; points: string[] }[] = [];

  for (const type of relevantTypes) {
    const points = FAMILY_TALKING_POINTS[type]?.[selectedAudience];
    if (points && points.length > 0) {
      const label = scamTypes.find(s => s.type === type)?.label || type;
      talkingPoints.push({ type, label, points });
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5" data-testid="family-conversation-starters">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-pink-500" />
        <h3 className="text-base font-bold text-foreground">Family Conversation Starters</h3>
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        Based on what's trending now, here are things to talk about with your family:
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {FAMILY_AUDIENCES.map((aud) => (
          <button
            key={aud.id}
            onClick={() => setSelectedAudience(aud.id)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              selectedAudience === aud.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary text-foreground border-border hover:border-primary/30"
            }`}
            data-testid={`audience-${aud.id}`}
          >
            {aud.label}
            <span className="text-[10px] ml-1 opacity-60">({aud.ageHint})</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {talkingPoints.length > 0 ? talkingPoints.map(({ type, label, points }) => (
          <div key={type}>
            <div className="text-xs font-semibold text-foreground mb-2">About {label}:</div>
            <div className="space-y-2">
              {points.map((point, i) => (
                <div key={i} className="flex gap-2 bg-secondary/50 rounded-lg p-3 border border-border">
                  <span className="text-primary text-sm mt-0.5">💬</span>
                  <p className="text-xs text-muted-foreground leading-relaxed italic">"{point}"</p>
                </div>
              ))}
            </div>
          </div>
        )) : (
          <div className="text-center py-4">
            <p className="text-xs text-muted-foreground">No specific talking points for this audience yet. Check other age groups above.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export {
  GlobalStatsBar,
  LiveFeedTicker,
  ScamTypeBreakdown,
  RegionalPanel,
  TrendingSection,
  ToolConnectionBanner,
  LocalRiskSummary,
  ProtectFamilyPanel,
  FamilyConversationStarters,
  TimeRangeSelector,
  SourceTransparencyDrawer,
};
