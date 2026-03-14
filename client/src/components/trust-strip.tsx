import { Shield } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

const sources = [
  "FBI IC3",
  "CISA",
  "INTERPOL",
  "Europol",
  "FTC",
  "NIST",
  "PhishTank",
  "VirusTotal",
];

const stats = [
  { value: 500, suffix: "+", label: "Data Brokers Tracked" },
  { value: 406, suffix: "+", label: "AI Safety Prompts" },
  { value: 8, suffix: "", label: "Security Databases" },
  { value: 125, suffix: "+", label: "Safety Guides" },
];

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

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const count = useAnimatedCounter(value, value > 100 ? 1400 : 600);
  return (
    <div className="text-center" data-testid={`stat-hero-${label.toLowerCase().replace(/[,\s]+/g, "-")}`}>
      <div className="text-2xl sm:text-3xl font-extrabold text-foreground tabular-nums leading-none">
        {count}{suffix}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-1.5 leading-tight">{label}</div>
    </div>
  );
}

export function TrustStrip() {
  return (
    <section className="py-10 sm:py-12 bg-slate-50 dark:bg-slate-800/50 border-y border-border" data-testid="section-trust-strip">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-6 mb-10" data-testid="hero-stat-bar">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>

        <div className="border-t border-border pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8">
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                Data from
              </span>
            </div>
            <div className="w-px h-6 bg-border hidden sm:block" />
            <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2">
              {sources.map((source) => (
                <span
                  key={source}
                  className="text-[15px] font-semibold text-foreground/70 hover:text-foreground transition-colors"
                  data-testid={`text-trust-source-${source.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {source}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
