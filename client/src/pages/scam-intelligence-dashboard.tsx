"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ScamIntelligenceGlobe } from "@/components/scam-intelligence-globe";
import { GlobalStatsBar, LiveFeedTicker, ScamTypeBreakdown, RegionalPanel, TrendingSection, LocalRiskSummary, ProtectFamilyPanel, ToolConnectionBanner, FamilyConversationStarters } from "@/components/scam-intel-dashboard";
import { Globe, ArrowLeft, AlertCircle, Search, X, MapPin } from "lucide-react";
import { Link } from "@/lib/navigation";

function DataError({ label }: { label: string }) {
  return (
    <div className="bg-card border border-red-500/20 rounded-xl p-6 text-center">
      <AlertCircle className="w-6 h-6 text-red-400/60 mx-auto mb-2" />
      <p className="text-sm text-muted-foreground">{label} data is temporarily unavailable</p>
      <p className="text-xs text-muted-foreground/70 mt-1">Data will refresh automatically. Please check back shortly.</p>
    </div>
  );
}

export default function ScamIntelligenceDashboard() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [visitorCountryCode, setVisitorCountryCode] = useState<string | null>(null);
  const [visitorCountryName, setVisitorCountryName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchFocusCode, setSearchFocusCode] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.country_code) {
          setVisitorCountryCode(data.country_code);
          setVisitorCountryName(data.country_name);
        }
      })
      .catch(() => {});
  }, []);

  const countryList = useMemo(() => {
    return (globeData as any)?.hotspots?.map((h: any) => ({ code: h.countryCode, name: h.country })) || [];
  }, [globeData]);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return countryList.filter((c: any) => c.name.toLowerCase().includes(q)).slice(0, 6);
  }, [searchQuery, countryList]);

  const handleCountrySearch = (code: string, name: string) => {
    setSearchFocusCode(code);
    setSearchQuery("");
    setSearchOpen(false);
  };

  const effectiveFocusCode = searchFocusCode || visitorCountryCode;

  const handleCountrySelect = (hotspot: any) => {
    setSelectedCountry(hotspot);
    if (hotspot) {
      setSelectedRegion(hotspot.region);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#060d1a]">
      <Navigation />
      <main>
        <section className="relative overflow-hidden pt-6 pb-8">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background dark:from-[#0A2A3C] dark:via-[#060d1a] dark:to-[#060d1a]" />
          <div className="absolute inset-0 opacity-20 dark:opacity-20" style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(34,211,238,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(168,85,247,0.06) 0%, transparent 40%)",
          }} />

          <div className="container mx-auto px-4 relative z-10">
            <div className="mb-4">
              <Link href="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors" data-testid="link-back-home">
                <ArrowLeft className="w-3 h-3" />
                Back to Home
              </Link>
            </div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-4">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm text-red-400 font-medium">Live Scam Intelligence</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3" data-testid="dashboard-title">
                Global Scam Intelligence Dashboard
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See where scams are happening right now. This map tracks fraud activity across {globeData?.globalStats?.countriesCovered || "40+"} countries
                using data from law enforcement, government cybersecurity teams, and trusted security organizations worldwide.
              </p>
            </div>

            <GlobalStatsBar stats={(globeData as any)?.globalStats || null} />
          </div>
        </section>

        {!globeLoading && !globeError && (
          <section className="relative pb-6">
            <div className="container mx-auto px-4">
              <LocalRiskSummary
                visitorCountryName={visitorCountryName}
                hotspots={(globeData as any)?.hotspots || []}
                trending={(regionalData as any)?.trending || []}
              />
            </div>
          </section>
        )}

        <section className="relative pb-12">
          <div className="container mx-auto px-4">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 xl:col-span-8">
                <div className="bg-card border border-border dark:bg-slate-900/50 dark:border-slate-700/50 rounded-2xl p-4 mb-6" data-testid="globe-container">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Live Scam Activity Map</span>
                    <div className="ml-auto flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Critical</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> High</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Medium</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Low</span>
                    </div>
                  </div>

                  <div className="relative mb-3" data-testid="country-search">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        ref={searchRef}
                        type="text"
                        placeholder="Search for a country..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                        onFocus={() => setSearchOpen(true)}
                        className="w-full bg-secondary border border-border rounded-lg pl-9 pr-8 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary/50 focus:outline-none transition-colors"
                        data-testid="country-search-input"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => { setSearchQuery(""); setSearchOpen(false); }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          data-testid="clear-search"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {searchOpen && filteredCountries.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-popover border border-border rounded-lg shadow-xl overflow-hidden" data-testid="country-search-results">
                        {filteredCountries.map((c: any) => (
                          <button
                            key={c.code}
                            onClick={() => handleCountrySearch(c.code, c.name)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors text-left"
                            data-testid={`search-result-${c.code}`}
                          >
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            {c.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <ScamIntelligenceGlobe
                    data={globeData as any}
                    onCountrySelect={handleCountrySelect}
                    focusCountryCode={effectiveFocusCode}
                  />
                  <div className="text-center mt-3">
                    <p className="text-[11px] text-muted-foreground">
                      Click any glowing dot to see scam details for that country. The lines show how scams spread between countries.
                      Scroll to zoom in. Data updates every 30 minutes.
                    </p>
                  </div>
                </div>

                {regionalError ? <DataError label="Scam type breakdown" /> : <ScamTypeBreakdown scamTypes={(regionalData as any)?.scamTypes || []} />}
              </div>

              <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                {!regionalError && <TrendingSection trending={(regionalData as any)?.trending || []} />}
                {!regionalError && (
                  <ToolConnectionBanner scamTypes={(regionalData as any)?.scamTypes || []} />
                )}
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

            {!regionalLoading && !regionalError && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <ProtectFamilyPanel
                  visitorCountryName={visitorCountryName}
                  topScamTypes={(regionalData as any)?.scamTypes || []}
                  trending={(regionalData as any)?.trending || []}
                />
                <FamilyConversationStarters
                  trending={(regionalData as any)?.trending || []}
                  scamTypes={(regionalData as any)?.scamTypes || []}
                />
              </div>
            )}
          </div>
        </section>

        <section className="bg-secondary/50 dark:bg-slate-900/30 border-t border-border py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-xl font-bold text-foreground mb-3">Where This Data Comes From</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                This dashboard pulls together scam reports from official government sources, law enforcement agencies,
                and trusted security organizations around the world. We use published data from agencies like
                the FBI's Internet Crime Complaint Center (IC3), the FTC, Action Fraud UK, Australia's Scamwatch, INTERPOL,
                and 20+ national cybersecurity response teams. The lines on the map show how scams move between countries,
                based on international cooperation reports.
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-[11px] text-muted-foreground">
                {[
                  "FBI IC3", "FTC Sentinel", "CISA", "NIST NVD", "Action Fraud UK",
                  "ACCC Scamwatch", "INTERPOL", "CERT-In", "CERT.br", "BSI Germany",
                  "PhishTank", "URLhaus", "Have I Been Pwned",
                ].map((source) => (
                  <span key={source} className="bg-card border border-border px-2.5 py-1 rounded-full">
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
