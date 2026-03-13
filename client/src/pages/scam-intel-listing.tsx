import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";
import { StructuredData, type BreadcrumbData } from "@/components/structured-data";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight, Loader2, AlertTriangle, Users, DollarSign, MapPin, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { detectUserRegion, setUserRegion, type Region } from "@/lib/region-detect";

interface ScamIntel {
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

export default function ScamIntelListing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [detectedRegion, setDetectedRegion] = useState<Region>("global");
  const [selectedRegion, setSelectedRegion] = useState<Region>("global");
  const [regionLoading, setRegionLoading] = useState(true);

  useEffect(() => {
    detectUserRegion().then((region) => {
      setDetectedRegion(region);
      setSelectedRegion(region);
      setRegionLoading(false);
    });
  }, []);

  useSEO({
    title: "Scam Intelligence Center | GetCyberRight",
    description: "Comprehensive scam database with detailed analysis, warning signs, and prevention tips. Learn about the latest scams targeting families, seniors, and everyday people.",
    keywords: "scam database, scam intelligence, fraud prevention, scam warnings",
  });

  const breadcrumbs: BreadcrumbData = {
    type: "BreadcrumbList",
    items: [
      { name: "Home", url: "https://www.getcyberright.com/" },
      { name: "Scam Intelligence", url: "https://www.getcyberright.com/scam-intel" },
    ],
  };

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
  });

  const categories = Array.from(new Set(scams.map((s) => s.scamCategory).filter(Boolean)));

  const filtered = scams.filter((s) => {
    const matchesSearch = !searchQuery ||
      s.scamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.metaDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || s.scamCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRegionChange = (value: string) => {
    const region = value as Region;
    setSelectedRegion(region);
    setUserRegion(region);
  };

  const isRegionScam = (scam: ScamIntel) => {
    if (!scam.regions || scam.regions.length === 0) return false;
    return scam.regions.some(
      (r) => r.toLowerCase() === selectedRegion.toLowerCase() || r.toLowerCase() === "global"
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={[breadcrumbs]} />
      <Navigation />

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold" data-testid="heading-scam-intel">Scam Intelligence Center</h1>
              <p className="text-slate-300 mt-2">Detailed analysis of scams targeting real people, with practical tips to stay safe</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <MapPin className="h-4 w-4 text-teal-400" />
            <span className="text-sm text-slate-300">
              {regionLoading ? "Detecting your region..." : `Showing scams relevant to ${regionLabels[selectedRegion] || "your region"}`}
            </span>
            {detectedRegion !== "global" && selectedRegion === detectedRegion && (
              <Badge variant="secondary" className="text-xs bg-teal-500/20 text-teal-300 border-teal-500/30" data-testid="badge-auto-detected">
                Auto-detected
              </Badge>
            )}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-scams"
            />
          </div>
          <div className="flex items-center gap-3">
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

        <div className="flex flex-wrap gap-2 mb-6">
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
        </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-scam-intel">
            {filtered.map((scam) => (
              <Link key={scam.id} href={`/scam-intel/${scam.slug}`}>
                <Card className={`h-full hover:shadow-lg transition-shadow cursor-pointer border-t-4 ${riskBorder[scam.riskLevel] || "border-t-gray-300"}`} data-testid={`card-scam-${scam.slug}`}>
                  <CardContent className="pt-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={riskColors[scam.riskLevel] || ""}>
                        {scam.riskLevel?.toUpperCase()}
                      </Badge>
                      {scam.scamCategory && <Badge variant="outline">{scam.scamCategory}</Badge>}
                      {selectedRegion !== "global" && isRegionScam(scam) && (
                        <Badge variant="secondary" className="text-xs gap-1" data-testid={`badge-region-${scam.slug}`}>
                          <MapPin className="h-3 w-3" />
                          {regionLabels[selectedRegion]?.split(" ")[0] || "Local"}
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-lg font-semibold mb-2 line-clamp-2" data-testid={`text-scam-name-${scam.slug}`}>{scam.scamName}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{scam.metaDescription}</p>

                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                      {scam.platformUsed?.slice(0, 3).map((p) => (
                        <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                      <div className="flex items-center gap-3">
                        {scam.targetAudience?.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {scam.targetAudience[0]}
                          </span>
                        )}
                        {scam.averageLoss && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {scam.averageLoss}
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
      </main>

      <Footer />
    </div>
  );
}
