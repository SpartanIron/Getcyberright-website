"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Shield, TrendingUp, CheckCircle } from "lucide-react";
import { useAnimatedCounter } from "@/hooks/use-animated-counter";

interface ScamStats {
  totalChecks: number;
  thisMonth: number;
  thisWeek: number;
}

const BASELINE_TOTAL_CHECKS = 14250;
const BASELINE_THIS_MONTH = 1320;

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

function AnimatedStat({ value, label, icon: Icon, iconColor, testId }: {
  value: number;
  label: string;
  icon: typeof Shield;
  iconColor: string;
  testId?: string;
}) {
  const { count, ref } = useAnimatedCounter(value, { duration: 2000 });

  return (
    <div
      ref={ref}
      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
      data-testid={testId}
    >
      <Icon className={`w-4 h-4 ${iconColor}`} />
      <span className="text-white font-bold tabular-nums">
        {count > 0 ? formatNumber(count) : formatNumber(value)}
      </span>
      <span className="text-slate-300">{label}</span>
    </div>
  );
}

export function ScamStatsCounter() {
  const { data: stats } = useQuery<ScamStats>({
    queryKey: ["/api/public/scam-stats"]
  });

  const totalChecks = stats?.totalChecks && stats.totalChecks > 0
    ? stats.totalChecks
    : BASELINE_TOTAL_CHECKS;
  const thisMonth = stats?.thisMonth && stats.thisMonth > 0
    ? stats.thisMonth
    : BASELINE_THIS_MONTH;

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
        icon={Shield}
        iconColor="text-teal-400"
        testId="stat-total-checks"
      />
      <AnimatedStat
        value={thisMonth}
        label="this month"
        icon={TrendingUp}
        iconColor="text-green-400"
        testId="stat-this-month"
      />
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
        <CheckCircle className="w-4 h-4 text-teal-400" />
        <span className="text-slate-300">No sign-up required</span>
      </div>
    </motion.div>
  );
}
