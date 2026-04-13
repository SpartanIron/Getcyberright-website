"use client";

import { useState, useEffect, memo } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import {
  Shield, AlertTriangle, TrendingUp, Globe, Activity,
  MapPin, Clock, ExternalLink, ChevronRight, Radio,
  Mail, Heart, Monitor, Lock, Smartphone, ShoppingCart,
  Bug, Briefcase, UserX, Fingerprint, ChevronDown, ChevronUp,
  BarChart3, Eye, Share2, Copy, Check, Flame, Sparkles, ShieldCheck
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
  const hydrated = useHydrated();
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
                  <span>{hydrated ? timeAgo(event.timestamp) : ""}</span>
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
            <h4 className="text-sm font-semibold text-white mb-1">{selected.region}: What You Should Know</h4>
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

  const shareText = `Watch out for "${scam.label}" scams. ${scam.description} Typical loss: ${scam.averageLoss}. Tips: ${scam.protectionTips?.slice(0, 2).join(". ")}. More info at GetCyberRight.`;

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
      "Scammers can now clone anyone's voice with AI. If a family member calls asking for money urgently, hang up and call them back on their real number",
    ],
    parents: [
      "If you get a call from someone claiming to be me and I sound panicked asking for money, hang up and call me directly. Scammers can clone voices now",
      "The government will never call threatening arrest. That's always a scam",
    ],
    partner: ["Let's create a family code word that only we know. If someone calls pretending to be one of us, they won't know the code"],
  },
  romance: {
    kids: ["If an online friend you've never met asks personal questions or asks you to keep secrets from your parents, that's not okay. Tell me"],
    teens: [
      "If someone you're talking to online always has excuses for not video calling, be cautious. They may not be who they say they are",
      "Never send personal photos to someone you haven't met in person. Once sent, you lose control of them",
    ],
    parents: [
      "Be careful with new online friendships that move quickly to deep emotional connection. Scammers build trust before asking for money",
      "If an online partner asks for money, gift cards, or crypto, no matter the reason, it's very likely a scam",
    ],
    partner: ["Let's keep each other informed about new online connections. A second opinion can spot what feelings might miss"],
  },
};

function getDefaultTalkingPoints(scamLabel: string, audience: string): string[] {
  const audienceLabels: Record<string, string> = { kids: "children", teens: "teenagers", parents: "older adults", partner: "your household" };
  return [
    `There's a new scam trend called "${scamLabel}." Here's what ${audienceLabels[audience] || "everyone"} should watch out for`,
    `If something feels too urgent or too good to be true, take a pause and talk to someone you trust before acting`,
  ];
}

function LocalRiskSummary({ visitorCountryName, hotspots, trending }: {
  visitorCountryName: string | null;
  hotspots: any[];
  trending: TrendingScam[];
}) {
  const countryData = visitorCountryName
    ? hotspots.find((h: any) => h.country === visitorCountryName)
    : null;

  const newThreats = trending.filter(t => t.isNew).length;
  const topThreats = countryData?.topThreats?.slice(0, 3) || [];
  const riskLevel = countryData?.riskLevel || "medium";
  const badge = RISK_BADGE[riskLevel] || RISK_BADGE.medium;
  const locationLabel = visitorCountryName || "your area";

  return (
    <div className="bg-gradient-to-r from-orange-500/10 via-red-500/5 to-purple-500/10 border border-orange-500/20 rounded-2xl p-5 md:p-6" data-testid="local-risk-summary">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-orange-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <h2 className="text-lg md:text-xl font-bold text-white">This week near {locationLabel}</h2>
            <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${badge.bg} ${badge.text}`}>
              {riskLevel} risk
            </span>
          </div>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-3">
            {newThreats > 0 ? (
              <><span className="text-orange-400 font-semibold">{newThreats} new scam {newThreats === 1 ? "type is" : "types are"}</span> targeting families in {locationLabel} this week. </>
            ) : (
              <>Scam activity continues in {locationLabel}. </>
            )}
            {topThreats.length > 0 ? (
              <>Watch out for <span className="text-white font-medium">{topThreats.map((t: string) => t.replace(/-/g, " ")).join(", ")}</span>.</>
            ) : (
              <>Stay alert for phishing, impersonation, and investment scams.</>
            )}
          </p>
          {countryData && (
            <div className="flex flex-wrap gap-3 text-xs text-slate-400">
              <span><span className="text-white font-medium">{formatNumber(countryData.recentIncidents)}</span> reports this period</span>
              <span className="text-slate-600">|</span>
              <span>Trend: <span className={countryData.trend === "up" ? "text-red-400" : countryData.trend === "down" ? "text-green-400" : "text-slate-400"}>{countryData.trend === "up" ? "Rising" : countryData.trend === "down" ? "Declining" : "Stable"}</span></span>
              {countryData.avgLossPerVictim && (
                <><span className="text-slate-600">|</span><span>Avg loss: <span className="text-orange-400 font-medium">{countryData.avgLossPerVictim}</span></span></>
              )}
            </div>
          )}
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
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const topThreatTypes = topScamTypes.slice(0, 3).map(s => s.type);
  const trendingTypes = trending.filter(t => t.isNew).map(t => t.type);
  const relevantTypes = [...new Set([...trendingTypes, ...topThreatTypes])].slice(0, 5);

  const actionSteps = relevantTypes.map((type, i) => {
    const scam = topScamTypes.find(s => s.type === type);
    const trend = trending.find(t => t.type === type);
    const tool = SCAM_TO_TOOL[type];
    const tips = scam?.protectionTips || [];
    const label = trend?.label || scam?.label || type.replace(/-/g, " ");
    const description = trend?.description || scam?.description || "";

    return { id: i, type, label, description, tool, tips, isNew: trend?.isNew || false };
  });

  if (actionSteps.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-500/20 rounded-2xl overflow-hidden" data-testid="protect-family-panel">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-emerald-500/15 bg-emerald-500/5">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-base md:text-lg font-bold text-white">Protect Your Family Today</h2>
          <p className="text-xs text-slate-400">{actionSteps.length} steps based on threats near {visitorCountryName || "you"}</p>
        </div>
      </div>

      <div className="divide-y divide-slate-700/20">
        {actionSteps.map((step, idx) => {
          const isExpanded = expandedStep === idx;
          return (
            <div key={step.type} data-testid={`action-step-${step.type}`}>
              <button
                onClick={() => setExpandedStep(isExpanded ? null : idx)}
                className="w-full px-5 py-3.5 flex items-start gap-3 hover:bg-slate-700/10 transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-emerald-400">{idx + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-white">{step.label}</span>
                    {step.isNew && (
                      <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full border border-red-500/30 font-medium">NEW</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{step.description}</p>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 mt-1" /> : <ChevronDown className="w-4 h-4 text-slate-400 mt-1" />}
              </button>

              {isExpanded && (
                <div className="px-5 pb-4 pl-[60px]">
                  {step.tips.length > 0 && (
                    <div className="mb-3">
                      <div className="text-[11px] text-emerald-400 font-semibold mb-1.5 uppercase tracking-wider">Do this today:</div>
                      <ul className="space-y-1.5">
                        {step.tips.map((tip, i) => (
                          <li key={i} className="flex gap-2 text-xs text-slate-300">
                            <span className="text-emerald-400 flex-shrink-0 mt-0.5">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {step.tool && (
                    <Link
                      href={step.tool.href}
                      className="inline-flex items-center gap-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-lg px-3 py-2 transition-colors group"
                      data-testid={`tool-link-${step.type}`}
                    >
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <div>
                        <span className="text-xs font-medium text-emerald-400 group-hover:text-emerald-300">{step.tool.name}</span>
                        <span className="text-[10px] text-slate-400 ml-1.5">{step.tool.description}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-400/60 ml-1" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ToolConnectionBanner({ scamTypes }: { scamTypes: ScamTypeSummary[] }) {
  const topTypes = scamTypes.slice(0, 4);
  const toolsNeeded = topTypes.map(s => SCAM_TO_TOOL[s.type]).filter(Boolean);
  const uniqueTools = toolsNeeded.reduce((acc: typeof toolsNeeded, t) => {
    if (!acc.find(a => a.href === t.href)) acc.push(t);
    return acc;
  }, []);

  if (uniqueTools.length === 0) return null;

  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden" data-testid="tool-connection-banner">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50 bg-slate-800/50">
        <ShieldCheck className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-semibold text-white">Take Action Against These Threats</span>
      </div>
      <div className="p-3 space-y-2">
        {uniqueTools.map((tool) => {
          const relatedScams = topTypes.filter(s => SCAM_TO_TOOL[s.type]?.href === tool.href);
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/30 hover:border-cyan-500/30 rounded-lg transition-all group"
              data-testid={`tool-banner-${tool.href.replace(/\//g, "-")}`}
            >
              <div className="w-9 h-9 rounded-lg bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{tool.name}</span>
                <p className="text-[11px] text-slate-400">{tool.description}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {relatedScams.map(s => (
                    <span key={s.type} className="text-[9px] bg-slate-700/50 text-cyan-300 px-1.5 py-0.5 rounded-full">
                      fights {s.label.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function FamilyConversationStarters({ trending, scamTypes }: {
  trending: TrendingScam[];
  scamTypes: ScamTypeSummary[];
}) {
  const [selectedAudience, setSelectedAudience] = useState("kids");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const topThreatTypes = trending.filter(t => t.isNew).map(t => t.type);
  if (topThreatTypes.length === 0) {
    topThreatTypes.push(...scamTypes.slice(0, 2).map(s => s.type));
  }
  const relevantTypes = [...new Set(topThreatTypes)].slice(0, 3);

  const conversations = relevantTypes.map(type => {
    const trend = trending.find(t => t.type === type);
    const scam = scamTypes.find(s => s.type === type);
    const label = trend?.label || scam?.label || type.replace(/-/g, " ");
    const points = FAMILY_TALKING_POINTS[type]?.[selectedAudience] || getDefaultTalkingPoints(label, selectedAudience);
    return { type, label, points };
  });

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const audienceIcons: Record<string, any> = { kids: "child", teens: "teen", parents: "parent", partner: "partner" };
  const audienceEmoji: Record<string, string> = { kids: "\u{1F9D2}", teens: "\u{1F9D1}", parents: "\u{1F474}", partner: "\u{1F46B}" };

  return (
    <div className="bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-blue-500/10 border border-purple-500/20 rounded-2xl overflow-hidden" data-testid="family-conversation-starters">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-purple-500/15 bg-purple-500/5">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <Heart className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-base md:text-lg font-bold text-white">Family Conversation Starters</h2>
          <p className="text-xs text-slate-400">Simple ways to talk about today's top threats with your family</p>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-slate-700/20">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FAMILY_AUDIENCES.map((aud) => (
            <button
              key={aud.id}
              onClick={() => setSelectedAudience(aud.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedAudience === aud.id
                  ? "bg-purple-500/20 border-purple-500/40 text-purple-300 border"
                  : "bg-slate-800/50 border-slate-700/30 text-slate-400 border hover:border-slate-600"
              }`}
              data-testid={`audience-${aud.id}`}
            >
              <span>{audienceEmoji[aud.id]}</span>
              {aud.label}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-slate-700/20">
        {conversations.map((convo) => (
          <div key={convo.type} className="px-5 py-3.5" data-testid={`convo-${convo.type}-${selectedAudience}`}>
            <div className="text-xs font-semibold text-purple-400 mb-2">About: {convo.label}</div>
            <div className="space-y-2">
              {convo.points.map((point, i) => {
                const pointId = `${convo.type}-${selectedAudience}-${i}`;
                return (
                  <div key={i} className="flex items-start gap-2 group">
                    <div className="flex-1 bg-slate-800/40 rounded-lg p-2.5">
                      <p className="text-xs text-slate-300 leading-relaxed">"{point}"</p>
                    </div>
                    <button
                      onClick={() => handleCopy(point, pointId)}
                      className="mt-1 p-1.5 rounded-md bg-slate-800/60 hover:bg-purple-500/20 border border-slate-700/30 hover:border-purple-500/30 transition-all opacity-60 group-hover:opacity-100"
                      data-testid={`copy-point-${pointId}`}
                    >
                      {copiedId === pointId ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 border-t border-slate-700/20 bg-slate-800/20">
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Having regular, calm conversations about online safety is one of the most effective ways to protect your family. You don't need to be a tech expert. Just start the conversation.
        </p>
      </div>
    </div>
  );
}

export { GlobalStatsBar, LiveFeedTicker, ScamTypeBreakdown, RegionalPanel, TrendingSection, LocalRiskSummary, ProtectFamilyPanel, ToolConnectionBanner, FamilyConversationStarters };
export type { LiveFeedEvent, ScamTypeSummary, RegionalSummary, GlobalStats, TrendingScam };
