import { Shield } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

const sources = [
  { name: "CISA", logo: "/logos/cisa.svg" },
  { name: "INTERPOL", logo: "/logos/interpol.svg" },
  { name: "Europol", logo: "/logos/europol.svg" },
  { name: "FTC", logo: "/logos/ftc.svg" },
  { name: "NIST", logo: "/logos/nist.svg" },
  { name: "PhishTank", logo: "/logos/phishtank.svg" },
  { name: "VirusTotal", logo: "/logos/virustotal.svg" },
  { name: "FBI IC3", logo: "/logos/fbi-ic3.svg" },
];

const stats = [
  { value: 500, suffix: "+", label: "Data Brokers Tracked" },
  { value: 406, suffix: "+", label: "AI Safety Prompts" },
  { value: 8, suffix: "", label: "Trusted Safety Sources" },
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
              Trusted Safety Sources
            </span>
          </div>

          <div className="overflow-hidden">
            <div className="flex w-max items-center animate-marquee motion-reduce:animate-none motion-reduce:justify-center motion-reduce:flex-wrap motion-reduce:gap-8 motion-reduce:w-auto">
              {[...sources, ...sources, ...sources].map((source, i) => (
                <img
                  key={`${source.name}-${i}`}
                  src={source.logo}
                  alt={source.name}
                  className="h-8 sm:h-10 w-auto flex-shrink-0 mx-6 sm:mx-10 opacity-40 dark:opacity-30 dark:invert grayscale select-none"
                  loading="lazy"
                  draggable={false}
                  data-testid={i < sources.length ? `logo-trust-source-${source.name.toLowerCase().replace(/\s+/g, "-")}` : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
