import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, Shield } from "lucide-react";

interface TrendingScam {
  scamType: string;
  count: number;
  trend: string;
}

const scamTypeLabels: Record<string, string> = {
  "phishing": "Phishing Emails",
  "tech_support": "Tech Support Scams",
  "romance": "Romance Scams",
  "investment": "Investment Fraud",
  "package_delivery": "Package Delivery Scams",
  "irs_tax": "IRS/Tax Scams",
  "lottery": "Lottery Scams",
  "job_offer": "Fake Job Offers",
  "crypto": "Cryptocurrency Scams",
  "grandparent": "Grandparent Scams",
  "unknown": "Suspicious Activity"
};

function getScamLabel(scamType: string): string {
  return scamTypeLabels[scamType.toLowerCase()] || scamType.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

export function TrendingAlert() {
  const { data: trends } = useQuery<TrendingScam[]>({
    queryKey: ["/api/public/trending-scams"]
  });

  const topTrend = trends && trends.length > 0 ? trends[0] : null;

  if (!topTrend) {
    return (
      <section className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
        <div className="max-w-3xl mx-auto px-4 py-1.5">
          <div className="flex items-center justify-center gap-2 text-amber-800 dark:text-amber-200 text-lg">
            <Shield className="w-4 h-4" />
            <span className="font-medium">Stay alert:</span>
            <span>Always verify before clicking links or sharing personal information</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section 
      className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-3xl mx-auto px-4 py-1.5">
        <div className="flex items-center justify-center gap-3 text-amber-800 dark:text-amber-200 text-lg flex-wrap">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span className="font-bold">Trending Now:</span>
          </div>
          <span>{getScamLabel(topTrend.scamType)} reports are up</span>
          <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-medium">
            <TrendingUp className="w-5 h-5" />
            <span>{topTrend.count}+ detected this week</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
