"use client";

import { Globe, ArrowRight, Radio, Shield, TrendingUp, MapPin } from "lucide-react";
import { Link } from "@/lib/navigation";
import { SITE_STATS } from "../../../app/lib/site-stats";

export function ScamGlobeTeaser() {
  return (
    <section className="relative py-16 overflow-hidden bg-secondary dark:bg-[#060d1a]" data-testid="scam-globe-teaser">
      <div className="absolute inset-0 opacity-30 dark:opacity-100" style={{
        backgroundImage: "radial-gradient(circle at 30% 50%, rgba(34,211,238,0.06) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(168,85,247,0.04) 0%, transparent 40%)",
      }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1 mb-4">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs text-red-600 dark:text-red-400 font-medium">Live Intelligence</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Global Scam Intelligence Dashboard
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              See where scams are happening right now. Our live map tracks fake emails, romance scams,
              investment fraud, and more across {SITE_STATS.countriesTracked} countries, using data from the FBI, INTERPOL,
              and government cybersecurity teams worldwide.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-card border border-border dark:bg-slate-800/40 dark:border-slate-700/30 rounded-lg p-3 text-center" data-testid="stat-countries">
                <div className="text-xl font-bold text-primary">{SITE_STATS.countriesTracked}</div>
                <div className="text-[11px] text-muted-foreground">Countries</div>
              </div>
              <div className="bg-card border border-border dark:bg-slate-800/40 dark:border-slate-700/30 rounded-lg p-3 text-center" data-testid="stat-scam-types">
                <div className="text-xl font-bold text-primary">{SITE_STATS.scamTypes}</div>
                <div className="text-[11px] text-muted-foreground">Scam Types</div>
              </div>
              <div className="bg-card border border-border dark:bg-slate-800/40 dark:border-slate-700/30 rounded-lg p-3 text-center" data-testid="stat-sources">
                <div className="text-xl font-bold text-primary">{SITE_STATS.trustedSources}</div>
                <div className="text-[11px] text-muted-foreground">Sources</div>
              </div>
            </div>

            <Link
              href="/scam-intelligence"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-lg transition-colors"
              data-testid="link-scam-intelligence"
            >
              <Globe className="w-4 h-4" />
              Explore Live Map
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="relative bg-card border border-border dark:bg-slate-900/50 dark:border-slate-700/30 rounded-2xl p-6 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
              <div className="relative">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-red-500" />
                    <span className="text-xs text-red-600 dark:text-red-400 font-medium">Live Data</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">Updates every 30 min</span>
                </div>

                <div className="space-y-3">
                  {[
                    { region: "North America", threat: "Investment Fraud", trend: "+22%", risk: "critical", color: "bg-red-500" },
                    { region: "Europe", threat: "Shopping Fraud", trend: "+16%", risk: "high", color: "bg-orange-500" },
                    { region: "Africa", threat: "Mobile Money Fraud", trend: "+28%", risk: "critical", color: "bg-red-500" },
                    { region: "Asia Pacific", threat: "Tech Support Scams", trend: "+24%", risk: "high", color: "bg-orange-500" },
                    { region: "Latin America", threat: "Banking Trojans", trend: "+20%", risk: "high", color: "bg-orange-500" },
                  ].map((item) => (
                    <div key={item.region} className="flex items-center gap-3 bg-secondary dark:bg-slate-800/40 rounded-lg p-2.5 border border-border dark:border-slate-700/20">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-foreground font-medium">{item.region}</div>
                        <div className="text-[10px] text-muted-foreground">{item.threat}</div>
                      </div>
                      <span className="text-xs text-red-600 dark:text-red-400 font-mono font-medium">{item.trend}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-border dark:border-slate-700/30 flex flex-wrap gap-2">
                  {["FBI IC3", "CISA", "INTERPOL", "PhishTank"].map((s) => (
                    <span key={s} className="text-[10px] text-muted-foreground bg-secondary dark:bg-slate-800/30 px-2 py-0.5 rounded-full border border-border dark:border-slate-700/20">{s}</span>
                  ))}
                  <span className="text-[10px] text-muted-foreground">+20 more</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
