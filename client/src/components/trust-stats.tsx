import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Database, Sparkles, DollarSign } from "lucide-react";

const stats = [
  {
    icon: Database,
    value: 500,
    suffix: "+",
    label: "Data Brokers Tracked",
  },
  {
    icon: Sparkles,
    value: 406,
    suffix: "+",
    label: "AI Safety Prompts",
  },
  {
    icon: Shield,
    value: 6,
    suffix: "",
    label: "Live Threat Feeds",
  },
  {
    icon: DollarSign,
    value: 0,
    suffix: "",
    label: "Free to Get Started",
    displayValue: "$0",
  },
];

function useCountUp(target: number, duration: number, shouldStart: boolean) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!shouldStart) return;

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, shouldStart]);

  return count;
}

function StatItem({ icon: Icon, value, suffix, label, delay, displayValue }: {
  icon: typeof Shield;
  value: number;
  suffix: string;
  label: string;
  delay: number;
  displayValue?: string;
}) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1, rootMargin: "50px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const count = useCountUp(value, 1800, inView);
  const rendered = displayValue ? displayValue : `${count}${suffix}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center text-center px-2"
      data-testid={`stat-${label.toLowerCase().replace(/[,\s]+/g, "-")}`}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="text-3xl sm:text-4xl font-bold text-foreground tabular-nums" aria-label={displayValue || `${value}${suffix}`}>
        {rendered}
      </div>
      <div className="text-sm text-muted-foreground mt-1 font-medium">
        {label}
      </div>
    </motion.div>
  );
}

export function TrustStats() {
  return (
    <section
      className="py-12 sm:py-16 bg-background border-b border-border"
      data-testid="section-trust-stats"
      aria-label="Platform statistics"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-6">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} {...stat} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
