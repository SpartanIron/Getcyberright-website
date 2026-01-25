import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Shield, TrendingUp, CheckCircle } from "lucide-react";
import { useAnimatedCounter } from "@/hooks/use-animated-counter";

interface ScamStats {
  totalChecks: number;
  thisMonth: number;
  thisWeek: number;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

function AnimatedStat({ value, label, fallbackLabel, icon: Icon, iconColor }: { 
  value: number; 
  label: string; 
  fallbackLabel: string;
  icon: typeof Shield;
  iconColor: string;
}) {
  const { count, ref } = useAnimatedCounter(value, { duration: 2000 });
  
  return (
    <div 
      ref={ref}
      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
    >
      <Icon className={`w-4 h-4 ${iconColor}`} />
      <span className="text-white font-bold tabular-nums">
        {value > 0 ? formatNumber(count) : "Live"}
      </span>
      <span className="text-slate-300">{value > 0 ? label : fallbackLabel}</span>
    </div>
  );
}

export function ScamStatsCounter() {
  const { data: stats } = useQuery<ScamStats>({
    queryKey: ["/api/public/scam-stats"]
  });

  const totalChecks = stats?.totalChecks || 0;
  const thisMonth = stats?.thisMonth || 0;

  return (
    <motion.div 
      className="flex flex-wrap justify-center gap-6 text-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <AnimatedStat 
        value={totalChecks} 
        label="checks performed" 
        fallbackLabel="scam detection"
        icon={Shield} 
        iconColor="text-teal-400" 
      />
      <AnimatedStat 
        value={thisMonth} 
        label="this month" 
        fallbackLabel="threat monitoring"
        icon={TrendingUp} 
        iconColor="text-green-400" 
      />
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
        <CheckCircle className="w-4 h-4 text-teal-400" />
        <span className="text-slate-300">Always free, no sign-up</span>
      </div>
    </motion.div>
  );
}
