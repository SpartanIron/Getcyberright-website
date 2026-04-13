"use client";

import { Globe, ArrowRight, Radio, Shield, TrendingUp, MapPin } from "lucide-react";
import { Link } from "@/lib/navigation";

export function ScamGlobeTeaser() {
  return (
    <section className="relative py-16 overflow-hidden bg-[#060d1a]" data-testid="scam-globe-teaser">
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(circle at 30% 50%, rgba(34,211,238,0.06) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(168,85,247,0.04) 0%, transparent 40%)",
      }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1 mb-4">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs text-red-400 font-medium">Live Intelligence</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Global Scam Intelligence Dashboard
            </h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              See where scams are happening right now. Our live map tracks fake emails, romance scams,
              investment fraud, and more across 40+ countries — using data from the FBI, INTERPOL,
              and government cybersecurity teams worldwide.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-slate-800/40 border border-slate-700/30 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-cyan-400">40+</div>
                <div className="text-[11px] text-slate-400">Countries</div>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/30 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-cyan-400">12</div>
                <div className="text-[11px] text-slate-400">Scam Types</div>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/30 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-cyan-400">28+</div>
                <div className="text-[11px] text-slate-400">Sources</div>
              </div>
            </div>

            <Link
              href="/scam-intelligence"
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-colors"
              data-testid="link-scam-intelligence"
            >
              <Globe className="w-4 h-4" />
              Explore Live Map
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="relative bg-slate-900/50 border border-slate-700/30 rounded-2xl p-6 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
              <div className="relative">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-red-400 font-medium">Live Data</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Updates every 30 min</span>
                </div>

                <div className="space-y-3">
                  {[
                    { region: "North America", threat: "Investment Fraud", trend: "+22%", risk: "critical", color: "bg-red-500" },
                    { region: "Europe", threat: "Shopping Fraud", trend: "+16%", risk: "high", color: "bg-orange-500" },
                    { region: "Africa", threat: "Mobile Money Fraud", trend: "+28%", risk: "critical", color: "bg-red-500" },
                    { region: "Asia Pacific", threat: "Tech Support Scams", trend: "+24%", risk: "high", color: "bg-orange-500" },
                    { region: "Latin America", threat: "Banking Trojans", trend: "+20%", risk: "high", color: "bg-orange-500" },
                  ].map((item) => (
                    <div key={item.region} className="flex items-center gap-3 bg-slate-800/40 rounded-lg p-2.5 border border-slate-700/20">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-white font-medium">{item.region}</div>
                        <div className="text-[10px] text-slate-400">{item.threat}</div>
                      </div>
                      <span className="text-xs text-red-400 font-mono font-medium">{item.trend}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/30 flex flex-wrap gap-2">
                  {["FBI IC3", "CISA", "INTERPOL", "PhishTank"].map((s) => (
                    <span key={s} className="text-[10px] text-slate-500 bg-slate-800/30 px-2 py-0.5 rounded-full border border-slate-700/20">{s}</span>
                  ))}
                  <span className="text-[10px] text-slate-500">+20 more</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
