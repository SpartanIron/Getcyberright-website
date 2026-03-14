import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Radio, MapPin, Shield, Search, Trash2, GraduationCap, Zap, Database, AlertTriangle, ShieldCheck, ScanLine, Lock, Eye } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { TrendingThreat } from "@shared/schema";

const TIMEZONE_REGION_MAP: Record<string, string> = {
  "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US",
  "America/Los_Angeles": "US", "America/Phoenix": "US",
  "America/Toronto": "CA", "America/Vancouver": "CA",
  "Europe/London": "GB", "Europe/Paris": "EU", "Europe/Berlin": "EU",
  "Europe/Madrid": "EU", "Europe/Rome": "EU", "Europe/Amsterdam": "EU",
  "Australia/Sydney": "AU", "Australia/Melbourne": "AU",
  "Pacific/Auckland": "NZ",
  "Africa/Lagos": "AF_WEST", "Africa/Nairobi": "AF_EAST",
  "Africa/Johannesburg": "AF_SOUTH",
  "America/Sao_Paulo": "SA", "America/Mexico_City": "SA",
  "Asia/Kolkata": "AS_SOUTH", "Asia/Manila": "AS_SOUTHEAST",
  "Asia/Singapore": "AS_SOUTHEAST",
};

const REGION_LABELS: Record<string, string> = {
  "US": "United States", "CA": "Canada", "GB": "United Kingdom",
  "EU": "Europe", "AU": "Australia", "NZ": "New Zealand",
  "AF_WEST": "West Africa", "AF_EAST": "East Africa", "AF_SOUTH": "Southern Africa",
  "SA": "Americas", "AS_SOUTH": "South Asia", "AS_SOUTHEAST": "Southeast Asia",
  "GLOBAL": "Worldwide",
};

function detectRegion(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TIMEZONE_REGION_MAP[tz] || "GLOBAL";
  } catch {
    return "GLOBAL";
  }
}

function useAnimatedCounter(target: number, duration: number = 1200) {
  const [count, setCount] = useState(0);
  const hasStarted = useRef(false);

  const startAnimation = useCallback(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || target === 0) {
      setCount(target);
      return;
    }

    const startTime = performance.now();
    let rafId: number;
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) { rafId = requestAnimationFrame(step); }
    };
    rafId = requestAnimationFrame(step);
  }, [target, duration]);

  useEffect(() => {
    const timer = setTimeout(startAnimation, 400);
    return () => clearTimeout(timer);
  }, [startAnimation]);

  return count;
}

const severityColors: Record<string, string> = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

function ThreatAlertBar() {
  const region = useMemo(() => detectRegion(), []);
  const regionLabel = REGION_LABELS[region] || "your region";
  const { data } = useQuery<{ threats: TrendingThreat[] }>({
    queryKey: [`/api/trending-threats?region=${region}`],
    staleTime: 5 * 60 * 1000,
  });

  const threat = data?.threats?.[0];
  if (!threat) return null;
  const sevClass = severityColors[threat.severity] || severityColors.medium;

  return (
    <Link href="/alerts">
      <div
        className="inline-flex items-center gap-2.5 bg-red-500/[0.08] border border-red-500/20 rounded-full px-4 py-2 cursor-pointer hover:bg-red-500/[0.12] transition-colors group"
        data-testid="badge-live-threat"
      >
        <div className="relative flex-shrink-0">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
        </div>
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Active</span>
        </span>
        <span className="text-sm text-white/70 font-medium truncate max-w-[220px] sm:max-w-xs group-hover:text-white transition-colors">
          {threat.title}
        </span>
        {region !== "GLOBAL" && (
          <span className="text-[10px] text-white/30 flex items-center gap-0.5 flex-shrink-0">
            <MapPin className="w-2.5 h-2.5" />{regionLabel}
          </span>
        )}
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border flex-shrink-0 ${sevClass}`}>
          {threat.severity}
        </span>
      </div>
    </Link>
  );
}

function HeroScamChecker() {
  const [input, setInput] = useState("");
  const [, navigate] = useLocation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    try { sessionStorage.setItem("gcr_scam_input", input.trim()); } catch {}
    navigate("/scam-checker");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleAnalyze();
    }
  };

  return (
    <div className="relative" data-testid="hero-scam-checker">
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <ScanLine className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="text-sm font-semibold text-white">AI Scam Checker</span>
            <span className="text-[10px] text-primary/80 font-semibold uppercase tracking-widest ml-2">Free</span>
          </div>
        </div>

        <div className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={'Paste a suspicious message, email, URL, or phone number...\n\nExample: "URGENT: Your account has been locked. Click here to verify: bit.ly/acct-verify"'}
            className="w-full min-h-[120px] sm:min-h-[140px] bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/25 resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30 transition-all"
            aria-label="Paste suspicious content to analyze"
            data-testid="input-hero-scam-checker"
          />
        </div>

        <div className="flex items-center justify-between mt-4 gap-3">
          <div className="hidden sm:flex items-center gap-3 text-[11px] text-white/30">
            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Private</span>
            <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> AI-Powered</span>
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> 8 Threat Feeds</span>
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={!input.trim()}
            className="bg-accent text-accent-foreground border-accent-border font-semibold px-6 py-2.5 rounded-lg shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all disabled:opacity-40 disabled:shadow-none"
            data-testid="button-hero-analyze"
          >
            <Search className="w-4 h-4 mr-2" />
            Analyze Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-3">
        <Link href="/data-removal">
          <div className="group bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-3 cursor-pointer hover:bg-white/[0.06] hover:border-white/[0.10] transition-all" data-testid="hero-tool-data-removal">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-4 h-4 text-teal-400" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white group-hover:text-teal-400 transition-colors truncate">Data Broker Removal</div>
                <div className="text-[10px] text-white/30 mt-0.5 truncate">501+ brokers</div>
              </div>
            </div>
          </div>
        </Link>
        <Link href="/training">
          <div className="group bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-3 cursor-pointer hover:bg-white/[0.06] hover:border-white/[0.10] transition-all" data-testid="hero-tool-training">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-4 h-4 text-blue-400" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors truncate">Training Academy</div>
                <div className="text-[10px] text-white/30 mt-0.5 truncate">All skill levels</div>
              </div>
            </div>
          </div>
        </Link>
        <Link href="/ai-prompts">
          <div className="group bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-3 cursor-pointer hover:bg-white/[0.06] hover:border-white/[0.10] transition-all" data-testid="hero-tool-ai-prompts">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white group-hover:text-amber-400 transition-colors truncate">AI Prompt Library</div>
                <div className="text-[10px] text-white/30 mt-0.5 truncate">406+ prompts</div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

const trustPoints = [
  { icon: Zap, text: "AI-powered analysis detects phishing, social engineering, and deepfake patterns" },
  { icon: ShieldCheck, text: "Cross-references PhishTank, URLhaus, VirusTotal, and 5 more live feeds" },
  { icon: Eye, text: "No account required. Your data is never stored or sold." },
];

const stats = [
  { value: 500, suffix: "+", label: "Data Brokers Tracked", duration: 1400 },
  { value: 406, suffix: "+", label: "AI Safety Prompts", duration: 1200 },
  { value: 8, suffix: "", label: "Live Threat Feeds", duration: 600 },
  { value: 125, suffix: "+", label: "Safety Guides", duration: 1000 },
];

function StatBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8" data-testid="hero-stat-bar">
      {stats.map((stat) => {
        const count = useAnimatedCounter(stat.value, stat.duration);
        return (
          <div key={stat.label} className="text-center" data-testid={`stat-hero-${stat.label.toLowerCase().replace(/[,\s]+/g, "-")}`}>
            <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums leading-none">
              {count}{stat.suffix}
            </div>
            <div className="text-[11px] text-white/35 font-medium mt-1.5 leading-tight">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative w-full" data-testid="section-hero">
      <div className="bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/[0.04] to-transparent" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/[0.02] rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="pt-8 sm:pt-10 lg:pt-12 pb-4">
            <ThreatAlertBar />
          </div>

          <div className="grid lg:grid-cols-[1fr_minmax(0,480px)] gap-10 lg:gap-14 items-start pb-10 sm:pb-12 lg:pb-14">
            <div className="max-w-xl pt-2 lg:pt-6">
              <h1
                className="text-3xl sm:text-4xl lg:text-[2.85rem] font-extrabold tracking-tight text-white leading-[1.12] mb-5"
                data-testid="text-hero-heading"
              >
                Got a Suspicious Message?
                <br />
                <span className="hero-gradient-text">AI Checks It in Seconds.</span>
              </h1>

              <p
                className="text-base sm:text-[1.05rem] text-white/50 leading-relaxed mb-8 max-w-lg"
                data-testid="text-hero-subtext"
              >
                Paste any text, email, link, or phone number. Our AI analyzes it against 8 live threat intelligence feeds, detects social engineering patterns, and tells you exactly what to watch for.
              </p>

              <div className="space-y-3.5 mb-8">
                {trustPoints.map((point) => (
                  <div key={point.text} className="flex items-start gap-2.5">
                    <point.icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white/45 leading-snug">{point.text}</span>
                  </div>
                ))}
              </div>

              <div className="lg:hidden mt-2 mb-2">
                <HeroScamChecker />
              </div>

              <div className="hidden lg:block">
                <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors group">
                  Explore all free tools
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <HeroScamChecker />
            </div>
          </div>

          <div className="border-t border-white/[0.06] py-8 sm:py-10">
            <StatBar />
          </div>
        </div>
      </div>
    </section>
  );
}
