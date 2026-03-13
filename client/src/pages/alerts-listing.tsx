import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";
import { StructuredData, type BreadcrumbData } from "@/components/structured-data";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Search, ArrowRight, Loader2, Calendar, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ThreatAlert {
  id: string;
  slug: string;
  threatName: string;
  threatCategory: string;
  description: string;
  riskLevel: string;
  affectedPlatforms: string[];
  regions: string[];
  publishedAt: string;
  dateDetected: string;
  cveIds: string[];
}

const riskColors: Record<string, string> = {
  high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  medium: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
};

const riskBorder: Record<string, string> = {
  high: "border-l-red-500",
  medium: "border-l-orange-500",
  low: "border-l-green-500",
};

export default function AlertsListing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useSEO({
    title: "Cyber Threat Alerts | GetCyberRight",
    description: "Stay informed about the latest cybersecurity threats, vulnerabilities, and security advisories. Real-time alerts to keep you and your family safe.",
    keywords: "cyber threats, security alerts, vulnerability alerts, cybersecurity warnings",
  });

  const breadcrumbs: BreadcrumbData = {
    type: "BreadcrumbList",
    items: [
      { name: "Home", url: "https://www.getcyberright.com/" },
      { name: "Cyber Threat Alerts", url: "https://www.getcyberright.com/alerts" },
    ],
  };

  const { data: alerts = [], isLoading, isError } = useQuery<ThreatAlert[]>({
    queryKey: ["/api/alerts"],
  });

  const categories = Array.from(new Set(alerts.map((a) => a.threatCategory).filter(Boolean)));

  const filtered = alerts.filter((a) => {
    const matchesSearch = !searchQuery ||
      a.threatName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || a.threatCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={[breadcrumbs]} />
      <Navigation />

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <ShieldAlert className="h-8 w-8 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold" data-testid="heading-alerts">Cyber Threat Alerts</h1>
              <p className="text-slate-300 mt-2">Real-time security advisories and vulnerability warnings</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-alerts"
            />
          </div>
          <div className="flex flex-wrap gap-2">
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
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="text-center py-20" data-testid="error-alerts">
            <ShieldAlert className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Unable to load alerts</h2>
            <p className="text-muted-foreground">Something went wrong. Please try refreshing the page.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <ShieldAlert className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2" data-testid="text-no-alerts">No alerts found</h2>
            <p className="text-muted-foreground">
              {searchQuery ? "Try a different search term." : "No active alerts right now. Check back for updates."}
            </p>
          </div>
        ) : (
          <div className="space-y-4" data-testid="list-alerts">
            {filtered.map((alert) => (
              <Link key={alert.id} href={`/alerts/${alert.slug}`}>
                <Card className={`hover:shadow-lg transition-shadow cursor-pointer border-l-4 ${riskBorder[alert.riskLevel] || "border-l-gray-500"}`} data-testid={`card-alert-${alert.slug}`}>
                  <CardContent className="pt-5 pb-5">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge className={riskColors[alert.riskLevel] || ""}>
                            {alert.riskLevel?.toUpperCase()} RISK
                          </Badge>
                          {alert.threatCategory && (
                            <Badge variant="outline">{alert.threatCategory}</Badge>
                          )}
                          {alert.cveIds?.slice(0, 2).map((cve) => (
                            <Badge key={cve} variant="secondary" className="font-mono text-xs">{cve}</Badge>
                          ))}
                        </div>
                        <h2 className="text-lg font-semibold group-hover:text-teal-600 transition-colors">
                          {alert.threatName}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {alert.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(alert.publishedAt || alert.dateDetected).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          {alert.affectedPlatforms?.slice(0, 3).map((p) => (
                            <Badge key={p} variant="outline" className="text-xs py-0">{p}</Badge>
                          ))}
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
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
