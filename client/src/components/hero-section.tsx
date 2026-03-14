import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Radio, MapPin, Shield, Search, Trash2, GraduationCap, Zap, Database } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { TrendingThreat } from "@shared/schema";

const rotatingMessages = [
  "Protect your kids' first phone.",
  "Keep your parents safe from scams.",
  "Secure your small business today.",
  "Help seniors spot fraud instantly.",
  "Guard your family's privacy online.",
];

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

function LiveThreatBadge() {
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
        className="inline-flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 cursor-pointer hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-colors group"
        data-testid="badge-live-threat"
      >
        <div className="relative flex-shrink-0">
          <Radio className="w-3.5 h-3.5 text-red-400" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping motion-reduce:animate-none" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-medium text-white/50 uppercase tracking-wider whitespace-nowrap">Live</span>
          {region !== "GLOBAL" && (
            <span className="text-[10px] text-white/30 flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5" />{regionLabel}
            </span>
          )}
          <span className="text-sm text-white/75 font-medium truncate max-w-[200px] sm:max-w-xs group-hover:text-white transition-colors">
            {threat.title}
          </span>
        </div>
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border flex-shrink-0 ${sevClass}`}>
          {threat.severity}
        </span>
      </div>
    </Link>
  );
}

const quickTools = [
  { icon: Search, label: "Scam Checker", desc: "Paste a URL, email, or message to check", href: "/scam-checker", color: "text-red-400", bg: "bg-red-500/10" },
  { icon: Trash2, label: "Data Broker Removal", desc: "Remove your info from 500+ brokers", href: "/data-removal", color: "text-teal-400", bg: "bg-teal-500/10" },
  { icon: GraduationCap, label: "Training Academy", desc: "Structured courses for all skill levels", href: "/training", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: Zap, label: "AI Prompt Library", desc: "406+ ready-to-use safety prompts", href: "/ai-prompts", color: "text-amber-400", bg: "bg-amber-500/10" },
];

function HeroToolCards() {
  return (
    <div className="grid grid-cols-1 gap-3" data-testid="hero-tool-cards">
      {quickTools.map((tool) => (
        <Link key={tool.label} href={tool.href}>
          <div className="group flex items-center gap-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3.5 cursor-pointer hover:bg-white/[0.06] hover:border-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all" data-testid={`hero-tool-${tool.label.toLowerCase().replace(/\s+/g, "-")}`}>
            <div className={`w-10 h-10 rounded-lg ${tool.bg} flex items-center justify-center flex-shrink-0`}>
              <tool.icon className={`w-5 h-5 ${tool.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{tool.label}</div>
              <div className="text-xs text-white/40 mt-0.5 truncate">{tool.desc}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
          </div>
        </Link>
      ))}
    </div>
  );
}

const stats = [
  { value: 500, suffix: "+", label: "Data Brokers Tracked", icon: Database, duration: 1400 },
  { value: 406, suffix: "+", label: "AI Safety Prompts", icon: Zap, duration: 1200 },
  { value: 8, suffix: "", label: "Live Threat Feeds", icon: Radio, duration: 600 },
  { value: 125, suffix: "+", label: "Safety Guides", icon: Shield, duration: 1000 },
];

function StatBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8" data-testid="hero-stat-bar">
      {stats.map((stat) => {
        const count = useAnimatedCounter(stat.value, stat.duration);
        return (
          <div key={stat.label} className="flex items-center gap-3" data-testid={`stat-hero-${stat.label.toLowerCase().replace(/[,\s]+/g, "-")}`}>
            <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
              <stat.icon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white tabular-nums leading-none">
                {count}{stat.suffix}
              </div>
              <div className="text-[11px] text-white/35 font-medium mt-0.5 leading-tight">{stat.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function HeroSection() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplayText(rotatingMessages[messageIndex]);
      setIsTyping(false);
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % rotatingMessages.length);
      }, 4000);
      return () => clearInterval(interval);
    }

    const text = rotatingMessages[messageIndex];
    let charIndex = 0;
    setIsTyping(true);
    setDisplayText("");

    const typeInterval = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayText(text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 45);

    let nextTimeout: ReturnType<typeof setTimeout>;
    const checkDone = setInterval(() => {
      if (charIndex >= text.length) {
        clearInterval(checkDone);
        nextTimeout = setTimeout(() => {
          setMessageIndex((prev) => (prev + 1) % rotatingMessages.length);
        }, 2200);
      }
    }, 50);

    return () => {
      clearInterval(typeInterval);
      clearInterval(checkDone);
      clearTimeout(nextTimeout);
    };
  }, [messageIndex]);

  return (
    <section className="relative w-full" data-testid="section-hero">
      <div className="bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/[0.03] to-transparent" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center pt-12 sm:pt-16 lg:pt-20 pb-10 sm:pb-12 lg:pb-14">

            <div className="max-w-xl">
              <div className="mb-6">
                <LiveThreatBadge />
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-white leading-[1.08] mb-5"
                data-testid="text-hero-heading"
              >
                Don't Get Scammed.
                <br />
                <span className="hero-gradient-text">Get CyberRight.</span>
              </h1>

              <p
                className="text-base sm:text-lg text-white/55 leading-relaxed mb-3"
                data-testid="text-hero-subtext"
              >
                Free tools and plain-language guides that help families, seniors, and small businesses stay safe from online scams, data brokers, and identity theft.
              </p>

              <div className="h-7 mb-7 flex items-center" aria-hidden="true">
                <span className="text-base sm:text-lg text-accent font-semibold" data-testid="text-hero-rotating">
                  {displayText}
                  {isTyping && <span className="inline-block w-[2px] h-[1em] bg-accent ml-0.5 align-text-bottom animate-blink" />}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/scam-checker">
                  <Button
                    size="lg"
                    className="rounded-lg px-7 py-3 bg-accent text-accent-foreground border-accent-border shadow-lg shadow-accent/15 font-semibold text-base w-full sm:w-auto"
                    data-testid="button-hero-primary-cta"
                  >
                    Check a Scam Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/tools">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-lg px-7 py-3 border-white/15 text-white bg-white/[0.04] hover:bg-white/[0.08] font-medium text-base w-full sm:w-auto"
                    data-testid="button-hero-secondary-cta"
                  >
                    Explore Free Tools
                    <ChevronRight className="ml-1 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <HeroToolCards />
            </div>
          </div>

          <div className="border-t border-white/[0.06] py-8 sm:py-10">
            <StatBar />
          </div>
        </div>
      </div>

      <div className="lg:hidden bg-slate-900 border-t border-white/[0.04] px-5 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <HeroToolCards />
        </div>
      </div>
    </section>
  );
}
