"use client";

import { useQuery } from "@tanstack/react-query";
import { Link } from "@/lib/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, Loader2, AlertTriangle, Users, DollarSign, MapPin, Globe, ArrowUpDown, TrendingUp, Clock, Flag, Calendar, BarChart3 } from "lucide-react";
import { useHydrated } from "@/hooks/use-hydrated";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, useMemo } from "react";
import { detectUserRegion, setUserRegion, type Region } from "@/lib/region-detect";

export interface ScamIntel {
  id: string;
  slug: string;
  scamName: string;
  scamCategory: string;
  platformUsed: string[];
  targetAudience: string[];
  riskLevel: string;
  metaDescription: string;
  regions: string[];
  reportCount: number;
  averageLoss: string;
  dateDetected: string;
}

const riskColors: Record<string, string> = {
  high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  medium: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

const riskBorder: Record<string, string> = {
  high: "border-t-red-500",
  medium: "border-t-orange-500",
  low: "border-t-green-500",
};

const regionLabels: Record<string, string> = {
  global: "All Regions",
  us: "United States",
  americas: "Americas",
  europe: "Europe",
  africa: "Africa",
  asia: "Asia",
  "middle-east": "Middle East",
  australia: "Australia & Oceania",
};

type SortOption = "newest" | "most-reported" | "highest-risk" | "highest-loss";

const riskWeight: Record<string, number> = { high: 3, medium: 2, low: 1 };

function isNewScam(dateDetected: string): boolean {
  if (!dateDetected) return false;
  const detected = new Date(dateDetected);
  const now = new Date();
  const diffDays = (now.getTime() - detected.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 30;
}

function isTrending(scam: ScamIntel): boolean {
  return (scam.reportCount || 0) >= 500 && scam.riskLevel === "high";
}

function parseLoss(loss: string): number {
  if (!loss) return 0;
  const cleaned = loss.replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

export function ScamIntelContent({ initialScams }: { initialScams?: ScamIntel[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("highest-risk");
  const [detectedRegion, setDetectedRegion] = useState<Region>("global");
  const [selectedRegion, setSelectedRegion] = useState<Region>("global");
  const [regionLoading, setRegionLoading] = useState(true);
  const hydrated = useHydrated();

  useEffect(() => {
    detectUserRegion().then((region) => {
      setDetectedRegion(region);
      setSelectedRegion(region);
      setRegionLoading(false);
    });
  }, []);



  const { data: scams = [], isLoading, isError } = useQuery<ScamIntel[]>({
    queryKey: ["/api/scam-intel", { region: selectedRegion }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedRegion && selectedRegion !== "global") {
        params.set("region", selectedRegion.toUpperCase());
      }
      const res = await fetch(`/api/scam-intel?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    initialData: selectedRegion === "global" ? initialScams : undefined,
  });

  const categories = Array.from(new Set(scams.map((s) => s.scamCategory).filter(Boolean)));

  const filtered = useMemo(() => {
    let result = scams.filter((s) => {
      const matchesSearch = !searchQuery ||
        s.scamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.metaDescription?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || s.scamCategory === selectedCategory;
      const matchesRisk = !selectedRisk || s.riskLevel === selectedRisk;
      return matchesSearch && matchesCategory && matchesRisk;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.dateDetected || 0).getTime() - new Date(a.dateDetected || 0).getTime();
        case "most-reported":
          return (b.reportCount || 0) - (a.reportCount || 0);
        case "highest-risk":
          return (riskWeight[b.riskLevel] || 0) - (riskWeight[a.riskLevel] || 0) || (b.reportCount || 0) - (a.reportCount || 0);
        case "highest-loss":
          return parseLoss(b.averageLoss) - parseLoss(a.averageLoss);
        default:
          return 0;
      }
    });

    return result;
  }, [scams, searchQuery, selectedCategory, selectedRisk, sortBy]);

  const handleRegionChange = (value: string) => {
    const region = value as Region;
    setSelectedRegion(region);
    setUserRegion(region);
  };

  const handleRiskClick = (level: string) => {
    setSelectedRisk(selectedRisk === level ? null : level);
    setSelectedCategory(null);
  };

  const isRegionScam = (scam: ScamIntel) => {
    if (!scam.regions || scam.regions.length === 0) return false;
    return scam.regions.some(
      (r) => r.toLowerCase() === selectedRegion.toLowerCase() || r.toLowerCase() === "global"
    );
  };

  const totalReports = scams.reduce((sum, s) => sum + (s.reportCount || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="bg-hero text-hero-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-hero via-hero to-hero dark:from-[#0A2A3C] dark:via-[#0A2A3C] dark:to-[#00293C]" />
        <div className="absolute pointer-events-none hidden md:block" aria-hidden="true" style={{ top: 0, right: 0, width: "55%", height: "100%", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-40%", right: "2%", width: "50px", height: "220%", background: "linear-gradient(180deg, #003A52 0%, #0D4D66 50%, #003A52 100%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
          <div style={{ position: "absolute", top: "-40%", right: "10%", width: "2px", height: "220%", background: "linear-gradient(180deg, transparent 10%, rgba(45, 212, 191, 0.4) 50%, transparent 90%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
          <div style={{ position: "absolute", top: "-35%", right: "18%", width: "35px", height: "220%", background: "linear-gradient(180deg, #5eead4 0%, #2dd4bf 35%, #14b8a6 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.55 }} />
          <div style={{ position: "absolute", top: "-35%", right: "26%", width: "2px", height: "220%", background: "linear-gradient(180deg, transparent 15%, hsla(16, 95%, 58%, 0.35) 50%, transparent 85%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
          <div style={{ position: "absolute", top: "-30%", right: "32%", width: "50px", height: "220%", background: "linear-gradient(180deg, hsl(16, 100%, 62%) 0%, hsl(16, 95%, 52%) 40%, hsl(16, 90%, 42%) 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.5 }} />
        </div>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-[1.75rem] sm:text-3xl md:text-4xl font-extrabold tracking-[-0.025em]" data-testid="heading-scam-intel">Scam Intelligence Center</h1>
              <p className="text-white/60 mt-2">Detailed analysis of scams targeting real people, with practical tips to stay safe</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm text-white/60">
                {regionLoading ? "Detecting your region..." : `Showing scams relevant to ${regionLabels[selectedRegion] || "your region"}`}
              </span>
              {detectedRegion !== "global" && selectedRegion === detectedRegion && (
                <Badge variant="secondary" className="text-xs bg-teal-500/20 text-teal-300 border-teal-500/30" data-testid="badge-auto-detected">
                  Auto-detected
                </Badge>
              )}
            </div>
            {scams.length > 0 && (
              <div className="flex items-center gap-4 text-sm text-white/50">
                <span className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  {scams.length} scams tracked
                </span>
                <span className="flex items-center gap-1">
                  <Flag className="h-4 w-4" />
                  {totalReports.toLocaleString()} reports
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {scams.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8" data-testid="risk-summary">
            {["high", "medium", "low"].map((level) => {
              const cnt = scams.filter(s => s.riskLevel === level).length;
              const isActive = selectedRisk === level;
              const config = { high: { color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800", activeBorder: "ring-2 ring-red-500" }, medium: { color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800", activeBorder: "ring-2 ring-orange-500" }, low: { color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/30", border: "border-green-200 dark:border-green-800", activeBorder: "ring-2 ring-green-500" } }[level]!;
              return (
                <button
                  key={level}
                  onClick={() => handleRiskClick(level)}
                  className={`p-4 rounded-xl border ${config.border} ${config.bg} text-center transition-all hover:shadow-md ${isActive ? config.activeBorder : ""}`}
                  data-testid={`risk-tile-${level}`}
                >
                  <div className={`text-2xl font-bold ${config.color}`}>{cnt}</div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{level} risk</div>
                  {isActive && <div className="text-[10px] text-muted-foreground mt-1">Click to clear</div>}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scams by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-scams"
            />
          </div>
          <div className="flex items-center gap-3">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-48" data-testid="select-sort">
                <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="highest-risk" data-testid="sort-highest-risk">Highest Risk</SelectItem>
                <SelectItem value="newest" data-testid="sort-newest">Newest First</SelectItem>
                <SelectItem value="most-reported" data-testid="sort-most-reported">Most Reported</SelectItem>
                <SelectItem value="highest-loss" data-testid="sort-highest-loss">Highest Loss</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedRegion} onValueChange={handleRegionChange}>
              <SelectTrigger className="w-52" data-testid="select-region">
                <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(regionLabels).map(([code, label]) => (
                  <SelectItem key={code} value={code} data-testid={`option-region-${code}`}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Badge
            variant={!selectedCategory ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(null)}
            data-testid="filter-all"
          >
            All
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(cat)}
              data-testid={`filter-${cat}`}
            >
              {cat}
            </Badge>
          ))}
          {(selectedRisk || selectedCategory || searchQuery) && (
            <button
              onClick={() => { setSelectedRisk(null); setSelectedCategory(null); setSearchQuery(""); }}
              className="text-xs text-muted-foreground hover:text-foreground ml-2 underline"
              data-testid="button-clear-filters"
            >
              Clear all filters
            </button>
          )}
        </div>

        {filtered.length > 0 && filtered.length !== scams.length && (
          <p className="text-sm text-muted-foreground mb-4" data-testid="text-filter-count">
            Showing {filtered.length} of {scams.length} scams
          </p>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="text-center py-20" data-testid="error-scams">
            <AlertTriangle className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Unable to load scam reports</h2>
            <p className="text-muted-foreground">Something went wrong. Please try refreshing the page.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <AlertTriangle className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2" data-testid="text-no-scams">No scam reports found</h2>
            <p className="text-muted-foreground">
              {searchQuery ? "Try a different search term." : "Our intelligence database is growing. Check back soon!"}
            </p>
            <Link href="/scam-checker" className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium mt-4" data-testid="link-scam-checker">
              Check something suspicious
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-6" data-testid="grid-scam-intel">
            {filtered.map((scam) => (
              <Link key={scam.id} href={`/scam-intel/${scam.slug}`}>
                <Card className={`h-full hover:shadow-lg transition-shadow cursor-pointer border-t-4 ${riskBorder[scam.riskLevel] || "border-t-gray-300"}`} data-testid={`card-scam-${scam.slug}`}>
                  <CardContent className="pt-5">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <Badge className={riskColors[scam.riskLevel] || ""}>
                        {scam.riskLevel?.toUpperCase()}
                      </Badge>
                      {scam.scamCategory && <Badge variant="outline">{scam.scamCategory}</Badge>}
                      {isTrending(scam) && (
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 gap-1" data-testid={`badge-trending-${scam.slug}`}>
                          <TrendingUp className="h-3 w-3" />
                          Trending
                        </Badge>
                      )}
                      {hydrated && isNewScam(scam.dateDetected) && (
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 gap-1" data-testid={`badge-new-${scam.slug}`}>
                          <Clock className="h-3 w-3" />
                          New
                        </Badge>
                      )}
                      {selectedRegion !== "global" && isRegionScam(scam) && (
                        <Badge variant="secondary" className="text-xs gap-1" data-testid={`badge-region-${scam.slug}`}>
                          <MapPin className="h-3 w-3" />
                          {regionLabels[selectedRegion]?.split(" ")[0] || "Local"}
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-lg font-semibold mb-2 line-clamp-2" data-testid={`text-scam-name-${scam.slug}`}>{scam.scamName}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{scam.metaDescription}</p>

                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                      {scam.platformUsed?.slice(0, 3).map((p) => (
                        <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                      <div className="flex items-center gap-3">
                        {scam.reportCount > 0 && (
                          <span className="flex items-center gap-1" data-testid={`text-reports-${scam.slug}`}>
                            <Flag className="h-3 w-3" />
                            {scam.reportCount.toLocaleString()} reports
                          </span>
                        )}
                        {scam.averageLoss && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {scam.averageLoss}
                          </span>
                        )}
                        {scam.dateDetected && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {hydrated ? formatDate(scam.dateDetected) : ""}
                          </span>
                        )}
                      </div>
                      <ArrowRight className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-8 text-center" data-testid="cta-report-scam">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <Flag className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-2">Encountered a Scam?</h2>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Help protect others by reporting suspicious activity. You can also use our AI-powered checker to analyze links, messages, and more.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/report-scam">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2" data-testid="button-report-scam">
                <Flag className="h-4 w-4" />
                Report a Scam
              </Button>
            </Link>
            <Link href="/scam-checker">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2" data-testid="button-check-scam">
                <Search className="h-4 w-4" />
                Check Something Suspicious
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
