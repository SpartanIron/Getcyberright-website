import { useQuery } from "@tanstack/react-query";
import { Shield, Activity, AlertTriangle, BookOpen } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface PlatformStats {
  scansPerformed: number;
  threatsDetected: number;
  guidesPublished: number;
  activeAlerts: number;
  dataBrokersTracked: number;
  last24hThreats: number;
}

function useCountUp(target: number, duration: number = 1600) {
  const [count, setCount] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    if (target === 0 || target === prevTarget.current) return;
    prevTarget.current = target;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setCount(target);
      return;
    }

    const startTime = performance.now();
    let rafId: number;
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration]);

  return count;
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return n.toString();
}

export function LiveActivityBar() {
  const { data } = useQuery<PlatformStats>({
    queryKey: ['/api/platform-stats'],
    staleTime: 60 * 1000,
  });

  const scans = useCountUp(data?.scansPerformed || 0, 2000);
  const threats = useCountUp(data?.threatsDetected || 0, 1200);
  const activeAlerts = useCountUp(data?.activeAlerts || 0, 800);
  const guides = useCountUp(data?.guidesPublished || 0, 800);

  if (!data) return null;

  return (
    <section className="bg-[#0A2A3C] border-y border-white/10" data-testid="section-live-activity">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-12">
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-green-400 opacity-75 animate-ping motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-white/50 uppercase tracking-wider">Live</span>
          </div>

          <div className="flex items-center gap-2" data-testid="stat-live-scans">
            <Shield className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm font-bold text-white tabular-nums">{formatNumber(scans)}+</span>
            <span className="text-xs text-white/50 font-medium">scans run</span>
          </div>

          <div className="flex items-center gap-2" data-testid="stat-live-threats">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-sm font-bold text-white tabular-nums">{threats}</span>
            <span className="text-xs text-white/50 font-medium">threats tracked</span>
          </div>

          <div className="flex items-center gap-2" data-testid="stat-live-alerts">
            <Activity className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="text-sm font-bold text-white tabular-nums">{activeAlerts}</span>
            <span className="text-xs text-white/50 font-medium">active alerts</span>
          </div>

          <div className="flex items-center gap-2" data-testid="stat-live-guides">
            <BookOpen className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <span className="text-sm font-bold text-white tabular-nums">{guides}</span>
            <span className="text-xs text-white/50 font-medium">safety guides</span>
          </div>
        </div>
      </div>
    </section>
  );
}
