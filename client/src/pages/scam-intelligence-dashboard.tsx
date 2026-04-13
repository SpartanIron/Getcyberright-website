"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { GlobalStatsBar, LiveFeedTicker, ScamTypeBreakdown, RegionalPanel } from "@/components/scam-intel-dashboard";
import { Globe, ArrowLeft, AlertCircle } from "lucide-react";
import { Link } from "@/lib/navigation";

function DataError({ label }: { label: string }) {
  return (
    <div className="bg-slate-800/30 border border-red-500/20 rounded-xl p-6 text-center">
      <AlertCircle className="w-6 h-6 text-red-400/60 mx-auto mb-2" />
      <p className="text-sm text-slate-400">{label} data is temporarily unavailable</p>
      <p className="text-xs text-slate-500 mt-1">Data will refresh automatically. Please check back shortly.</p>
    </div>
  );
}

const ScamIntelligenceGlobe = dynamic(
  () => import("@/components/scam-intelligence-globe").then((m) => ({ default: m.ScamIntelligenceGlobe })),
  { ssr: false, loading: () => (
    <div className="w-full aspect-square max-w-[700px] mx-auto bg-slate-800/30 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <Globe className="w-10 h-10 text-cyan-400/30 mx-auto mb-2 animate-pulse" />
        <p className="text-sm text-slate-500">Loading 3D Globe...</p>
      </div>
    </div>
  )}
);

export default function ScamIntelligenceDashboard() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);

  const { data: globeData, isLoading: globeLoading, isError: globeError } = useQuery({
    queryKey: ["/api/scam-intelligence/globe-data"],
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  const { data: liveFeed, isLoading: feedLoading, isError: feedError } = useQuery({
    queryKey: ["/api/scam-intelligence/live-feed"],
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });

  const { data: regionalData, isLoading: regionalLoading, isError: regionalError } = useQuery({
    queryKey: ["/api/scam-intelligence/regional-summary"],
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  const handleCountrySelect = (hotspot: any) => {
    setSelectedCountry(hotspot);
    if (hotspot) {
      setSelectedRegion(hotspot.region);
    }
  };

  return (
    <div className="min-h-screen bg-[#060d1a]">
      <Navigation />
      <main>
        <section className="relative overflow-hidden pt-6 pb-8">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A2A3C] via-[#060d1a] to-[#060d1a]" />
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(34,211,238,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(168,85,247,0.06) 0%, transparent 40%)",
          }} />

          <div className="container mx-auto px-4 relative z-10">
            <div className="mb-4">
              <Link href="/" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors" data-testid="link-back-home">
                <ArrowLeft className="w-3 h-3" />
                Back to Home
              </Link>
            </div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-4">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm text-red-400 font-medium">Live Scam Intelligence</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3" data-testid="dashboard-title">
                Global Scam Intelligence Dashboard
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Real-time visualization of scam and cyber fraud activity worldwide. Data sourced from
                government agencies, CERTs, and trusted security organizations across {globeData?.globalStats?.countriesCovered || "40+"} countries.
              </p>
            </div>

            <GlobalStatsBar stats={(globeData as any)?.globalStats || null} />
          </div>
        </section>

        <section className="relative pb-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 xl:col-span-8">
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-4 mb-6" data-testid="globe-container">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-semibold text-white">Threat Activity Map</span>
                    <div className="ml-auto flex items-center gap-3 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Critical</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> High</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Medium</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Low</span>
                    </div>
                  </div>
                  <ScamIntelligenceGlobe
                    data={globeData as any}
                    onCountrySelect={handleCountrySelect}
                  />
                  <div className="text-center mt-3">
                    <p className="text-[11px] text-slate-500">
                      Click any hotspot to view country details. Arcs show cross-border scam flows.
                      Scroll to zoom. Data refreshes every 30 minutes.
                    </p>
                  </div>
                </div>

                {regionalError ? <DataError label="Scam type breakdown" /> : <ScamTypeBreakdown scamTypes={(regionalData as any)?.scamTypes || []} />}
              </div>

              <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                {feedError ? <DataError label="Live threat feed" /> : <LiveFeedTicker events={(liveFeed as any)?.events || []} />}
                {regionalError ? <DataError label="Regional summary" /> : (
                  <RegionalPanel
                    regions={(regionalData as any)?.regions || []}
                    selectedRegion={selectedRegion}
                    onSelectRegion={setSelectedRegion}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-900/30 border-t border-slate-700/30 py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-xl font-bold text-white mb-3">Data Sources & Methodology</h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                This dashboard aggregates data from government cybersecurity agencies, national CERTs, law enforcement reports,
                and trusted security research organizations worldwide. Incident data is sourced from official published reports
                including FBI IC3, FTC Consumer Sentinel, Action Fraud UK, ACCC Scamwatch (Australia), INTERPOL, and 20+ national
                CERT teams. Cross-border flow data is derived from international cooperation reports and threat intelligence sharing.
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-[11px] text-slate-500">
                {[
                  "FBI IC3", "FTC Sentinel", "CISA", "NIST NVD", "Action Fraud UK",
                  "ACCC Scamwatch", "INTERPOL", "CERT-In", "CERT.br", "BSI Germany",
                  "PhishTank", "URLhaus", "Have I Been Pwned",
                ].map((source) => (
                  <span key={source} className="bg-slate-800/50 border border-slate-700/30 px-2.5 py-1 rounded-full">
                    {source}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
