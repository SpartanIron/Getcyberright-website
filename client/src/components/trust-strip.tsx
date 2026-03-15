import { Shield } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

const sources = [
  { name: "CISA", type: "gov" },
  { name: "INTERPOL", type: "intl" },
  { name: "Europol", type: "intl" },
  { name: "FTC", type: "gov" },
  { name: "NIST", type: "gov" },
  { name: "PhishTank", type: "private" },
  { name: "VirusTotal", type: "private" },
  { name: "FBI IC3", type: "gov" },
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
      <div className="text-2xl sm:text-3xl font-extrabold text-primary tabular-nums leading-none">
        {count}{suffix}
      </div>
      <div className="text-xs sm:text-sm text-foreground/70 font-semibold mt-1.5 leading-tight">{label}</div>
    </div>
  );
}

function SourceLogo({ name, type }: { name: string; type: string }) {
  const isGov = type === "gov";
  const isIntl = type === "intl";

  return (
    <div className="flex items-center gap-2 flex-shrink-0 mx-6 sm:mx-10 select-none">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        isGov ? "bg-slate-200 dark:bg-slate-700" :
        isIntl ? "bg-slate-200 dark:bg-slate-700" :
        "bg-slate-200 dark:bg-slate-700"
      }`}>
        {isGov && (
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
          </svg>
        )}
        {isIntl && (
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        )}
        {!isGov && !isIntl && (
          <Shield className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        )}
      </div>
      <span className="text-base sm:text-lg font-bold text-foreground/40 dark:text-foreground/30 whitespace-nowrap tracking-wide uppercase">
        {name}
      </span>
    </div>
  );
}

export function TrustStrip() {
  return (
    <section className="bg-slate-50 dark:bg-slate-800/50 border-y border-border" data-testid="section-trust-strip">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-6" data-testid="hero-stat-bar">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="py-5 sm:py-6 overflow-hidden">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-[0.15em]">
              Trusted Data Sources
            </span>
          </div>

          <div className="overflow-hidden">
            <div className="flex w-max items-center animate-marquee motion-reduce:animate-none motion-reduce:justify-center motion-reduce:flex-wrap motion-reduce:gap-8 motion-reduce:w-auto">
              {[...sources, ...sources, ...sources, ...sources].map((source, i) => (
                <SourceLogo
                  key={`${source.name}-${i}`}
                  name={source.name}
                  type={source.type}
                  />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
