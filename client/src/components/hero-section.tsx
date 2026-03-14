import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Radio, MapPin, Shield, Search, Trash2, GraduationCap, Zap, Database, AlertTriangle, ShieldCheck, ScanLine, Lock, Eye } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { TrendingThreat } from "@shared/schema";
import heroFamilyImg from "@/assets/images/hero-family-diverse.png";

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
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 sm:p-7 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
            <ScanLine className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-base font-semibold text-white">AI Scam Checker</span>
            <span className="text-[11px] text-primary/80 font-semibold uppercase tracking-widest ml-2">Free</span>
          </div>
        </div>

        <div className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={'Paste a suspicious message, email, URL, or phone number...\n\nExample: "URGENT: Your account has been locked. Click here to verify: bit.ly/acct-verify"'}
            className="w-full min-h-[130px] sm:min-h-[150px] bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-4 text-[15px] text-white placeholder:text-white/25 resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30 transition-all"
            aria-label="Paste suspicious content to analyze"
            data-testid="input-hero-scam-checker"
          />
        </div>

        <div className="flex items-center justify-between mt-5 gap-3">
          <div className="hidden sm:flex items-center gap-4 text-xs text-white/30">
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Private</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> 8 Security Databases</span>
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={!input.trim()}
            className="bg-accent text-accent-foreground border-accent-border font-semibold px-8 py-3 text-base rounded-full shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all disabled:opacity-40 disabled:shadow-none"
            data-testid="button-hero-analyze"
          >
            <Search className="w-4 h-4 mr-2" />
            Analyze Now
          </Button>
        </div>
      </div>
    </div>
  );
}

const stats = [
  { value: 500, suffix: "+", label: "Data Brokers Tracked", duration: 1400 },
  { value: 406, suffix: "+", label: "AI Safety Prompts", duration: 1200 },
  { value: 8, suffix: "", label: "Security Databases", duration: 600 },
  { value: 125, suffix: "+", label: "Safety Guides", duration: 1000 },
];

function StatBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 lg:gap-16" data-testid="hero-stat-bar">
      {stats.map((stat) => {
        const count = useAnimatedCounter(stat.value, stat.duration);
        return (
          <div key={stat.label} className="text-center" data-testid={`stat-hero-${stat.label.toLowerCase().replace(/[,\s]+/g, "-")}`}>
            <div className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white tabular-nums leading-none">
              {count}{stat.suffix}
            </div>
            <div className="text-sm sm:text-base text-white/55 font-medium mt-3 leading-tight">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative w-full" data-testid="section-hero">
      <div className="bg-[#001C48] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#001C48] via-[#001C48] to-[#00293C]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/[0.04] to-transparent" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/[0.02] rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="pt-8 sm:pt-10 lg:pt-14 pb-4">
            <ThreatAlertBar />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center pb-12 sm:pb-16 lg:pb-20">
            <div className="max-w-xl pt-2 lg:pt-4">
              <h1
                className="text-[2.75rem] sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05] mb-8"
                data-testid="text-hero-heading"
              >
                Your Family Is
                <br />
                the Target.
                <br />
                <span className="hero-gradient-text">We Are the Shield.</span>
              </h1>

              <p
                className="text-xl sm:text-[1.35rem] text-white/50 leading-relaxed mb-10 max-w-lg"
                data-testid="text-hero-subtext"
              >
                Scams cost families $12.5 billion last year. Paste any suspicious message, link, or phone number and our AI checks it against 8 trusted security databases in seconds.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link href="/scam-checker">
                  <Button
                    size="lg"
                    className="bg-accent text-accent-foreground border-accent-border font-semibold px-8 text-base shadow-lg shadow-accent/20 hover:shadow-accent/30"
                    data-testid="button-hero-primary-cta"
                  >
                    Check a Scam Now
                    <ArrowRight className="ml-2 w-5 h-5 cta-arrow-right" />
                  </Button>
                </Link>
                <Link href="/tools" className="inline-flex items-center gap-2 text-base text-white/55 hover:text-white/70 transition-colors group font-medium">
                  Explore all free tools
                  <ArrowRight className="w-4 h-4 cta-arrow-right" />
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-white/50">
                <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary/60" /> No account needed</span>
                <span className="flex items-center gap-2"><Eye className="w-4 h-4 text-primary/60" /> Nothing stored</span>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
                  <img
                    src={heroFamilyImg}
                    alt="Diverse family learning together on a laptop"
                    className="w-full h-auto object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001C48]/60 via-transparent to-transparent rounded-2xl" />
                </div>

                <div className="absolute -bottom-6 -left-6 bg-white/[0.06] backdrop-blur-md border border-white/[0.1] rounded-xl px-5 py-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Trusted by families worldwide</div>
                      <div className="text-xs text-white/55">Backed by FBI, CISA, INTERPOL data</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:hidden mb-8">
            <HeroScamChecker />
          </div>

          <div className="hidden lg:block max-w-2xl mb-8">
            <HeroScamChecker />
          </div>

          <div className="border-t border-white/[0.06] py-12 sm:py-14 lg:py-16">
            <StatBar />
          </div>
        </div>
      </div>
    </section>
  );
}
