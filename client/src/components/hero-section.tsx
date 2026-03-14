import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, ChevronRight, Radio, Database, Sparkles, DollarSign, MapPin } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { TrendingThreat } from "@shared/schema";

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const rotatingMessages = [
  "Protect your kids' first phone.",
  "Keep your parents safe from scams.",
  "Secure your small business.",
  "Help seniors spot fraud instantly.",
  "Guard your family's privacy online.",
];

const stats = [
  { icon: Database, value: "500+", label: "Data Brokers Tracked" },
  { icon: Sparkles, value: "406+", label: "AI Safety Prompts" },
  { icon: Shield, value: "6", label: "Live Threat Feeds" },
  { icon: DollarSign, value: "$0", label: "Free to Get Started" },
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.8 }}
      className="mt-6 lg:mt-8"
    >
      <Link href="/alerts">
        <div
          className="inline-flex items-start sm:items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:bg-white/8 transition-colors max-w-xl group"
          data-testid="badge-live-threat"
        >
          <div className="relative flex-shrink-0 mt-0.5 sm:mt-0">
            <Radio className="w-4 h-4 text-red-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-ping motion-reduce:animate-none" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Live Threat</span>
              {region !== "GLOBAL" && (
                <span className="text-[10px] text-white/30 flex items-center gap-0.5">
                  <MapPin className="w-2.5 h-2.5" />
                  {regionLabel}
                </span>
              )}
            </div>
            <p className="text-sm text-white/80 font-medium leading-snug mt-0.5 line-clamp-1 group-hover:text-white transition-colors">
              {threat.title}
            </p>
          </div>
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border flex-shrink-0 ${sevClass}`}>
            {threat.severity}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function HeroSection() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || isPaused) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % rotatingMessages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="relative w-full overflow-hidden" data-testid="section-hero">
      <div className="relative bg-slate-900">
        <div className="absolute inset-0 hero-mesh-bg" />
        <div className="absolute inset-0 hero-grid-overlay" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            className="pt-16 sm:pt-20 lg:pt-24 pb-10 sm:pb-12 lg:pb-14 max-w-3xl mx-auto lg:mx-0"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-primary/15 border border-primary/25 px-3.5 py-1.5 rounded-full mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Free Cybersecurity Platform
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-4"
              data-testid="text-hero-heading"
            >
              Don't Get Scammed.{" "}
              <span className="hero-gradient-text">Get&nbsp;CyberRight.</span>
            </motion.h1>

            <motion.div
              variants={fadeUp}
              className="h-8 sm:h-10 mb-4 flex items-center lg:items-start"
              aria-hidden="true"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={messageIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="text-base sm:text-lg lg:text-xl text-accent font-semibold"
                  data-testid="text-hero-rotating"
                >
                  {rotatingMessages[messageIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-white/65 leading-relaxed mb-8 max-w-2xl"
              data-testid="text-hero-subtext"
            >
              Recognize scams, protect your personal data, and keep your family safe online. Free tools and guides trusted by families worldwide.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/scam-checker">
                <Button
                  size="lg"
                  className="rounded-full px-7 bg-accent text-accent-foreground border-accent-border shadow-lg shadow-accent/20 w-full sm:w-auto"
                  data-testid="button-hero-primary-cta"
                >
                  Check If It's a Scam
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/tools">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-7 border-white/20 text-white bg-white/5 hover:bg-white/10 w-full sm:w-auto"
                  data-testid="button-hero-secondary-cta"
                >
                  Explore Free Tools
                  <ChevronRight className="ml-1 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

            <LiveThreatBadge />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="pb-12 sm:pb-16 lg:pb-20"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl lg:max-w-4xl mx-auto lg:mx-0">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + i * 0.08 }}
                  className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-3"
                  data-testid={`stat-hero-${stat.label.toLowerCase().replace(/[,\s]+/g, "-")}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <stat.icon className="w-[18px] h-[18px] text-primary" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-white tabular-nums leading-none">{stat.value}</div>
                    <div className="text-[11px] text-white/45 font-medium mt-0.5 leading-tight">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
