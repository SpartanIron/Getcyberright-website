import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, ChevronRight, Radio, Database, Sparkles, DollarSign, MapPin } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence, useInView } from "framer-motion";
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
  { icon: Database, numericValue: 500, suffix: "+", label: "Data Brokers Tracked" },
  { icon: Sparkles, numericValue: 406, suffix: "+", label: "AI Safety Prompts" },
  { icon: Shield, numericValue: 6, suffix: "", label: "Live Threat Feeds" },
  { icon: DollarSign, prefix: "$", numericValue: 0, suffix: "", label: "Free to Get Started" },
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

function useAnimatedCounter(target: number, duration: number = 1200, startDelay: number = 0) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView || hasStarted) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setCount(target);
      setHasStarted(true);
      return;
    }

    const timeout = setTimeout(() => {
      setHasStarted(true);
      const startTime = performance.now();
      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [isInView, target, duration, startDelay, hasStarted]);

  return { count, ref };
}

function TypewriterText({ text, className }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplayText(text);
      setShowCursor(false);
      return;
    }

    setDisplayText("");
    setShowCursor(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowCursor(false), 800);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <span className="inline-block w-[2px] h-[1em] bg-accent ml-0.5 align-text-bottom animate-blink" />
      )}
    </span>
  );
}

const particles = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2.5 + 1,
  duration: Math.random() * 15 + 15,
  delay: Math.random() * 8,
  opacity: Math.random() * 0.3 + 0.05,
}));

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none motion-reduce:hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/30"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{
            y: [0, -30, 10, -20, 0],
            x: [0, 15, -10, 5, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
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
          className="inline-flex items-start sm:items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:bg-white/8 transition-colors max-w-xl group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
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

function AnimatedStat({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const { count, ref } = useAnimatedCounter(stat.numericValue, stat.numericValue > 100 ? 1500 : 800, 700 + index * 100);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.7 + index * 0.08 }}
      className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-3 hover:bg-white/[0.07] transition-colors"
      data-testid={`stat-hero-${stat.label.toLowerCase().replace(/[,\s]+/g, "-")}`}
    >
      <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
        <stat.icon className="w-[18px] h-[18px] text-primary" />
      </div>
      <div>
        <div className="text-lg sm:text-xl font-bold text-white tabular-nums leading-none">
          {stat.prefix || ""}{count}{stat.suffix}
        </div>
        <div className="text-[11px] text-white/45 font-medium mt-0.5 leading-tight">{stat.label}</div>
      </div>
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
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="relative w-full overflow-hidden" data-testid="section-hero">
      <div className="relative bg-slate-900">
        <div className="absolute inset-0 hero-mesh-bg" />
        <div className="absolute inset-0 hero-grid-overlay" />
        <FloatingParticles />

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
                <motion.div
                  key={messageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  data-testid="text-hero-rotating"
                >
                  <TypewriterText
                    text={rotatingMessages[messageIndex]}
                    className="text-base sm:text-lg lg:text-xl text-accent font-semibold"
                  />
                </motion.div>
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
                  className="hero-cta-glow rounded-full px-7 bg-accent text-accent-foreground border-accent-border shadow-lg shadow-accent/20 w-full sm:w-auto"
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
                <AnimatedStat key={stat.label} stat={stat} index={i} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
