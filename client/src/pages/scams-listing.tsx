"use client";

import { useState, useMemo } from "react";
import { Link } from "@/lib/navigation";
import { StructuredData, type BreadcrumbData } from "@/components/structured-data";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ShieldAlert, ArrowRight, ChevronRight } from "lucide-react";

export interface ScamGuideMeta {
  slug: string;
  title: string;
  description: string;
  cluster: string;
  lastUpdated: string;
}

interface ScamsListingProps {
  initialGuides: ScamGuideMeta[];
}

const clusterLabels: Record<string, string> = {
  "online-scams": "Online Scams",
  "financial-scams": "Financial Scams",
  "phone-scams": "Phone & Text Scams",
  "identity-fraud": "Identity Fraud",
  "tech-scams": "Tech Support Scams",
  "romance-scams": "Romance Scams",
  "investment-scams": "Investment Scams",
  "shopping-scams": "Shopping Scams",
  "delivery-scams": "Delivery Scams",
  "tax-scams": "Tax & Government Scams",
  "senior-scams": "Senior-Targeted Scams",
  "social-media": "Social Media Scams",
};

function clusterLabel(c: string): string {
  return clusterLabels[c] || c.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function ScamsListing({ initialGuides }: ScamsListingProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

  const breadcrumbs: BreadcrumbData = {
    type: "BreadcrumbList",
    items: [
      { name: "Home", url: "https://www.getcyberright.com/" },
      { name: "Scam Guides", url: "https://www.getcyberright.com/scams" },
    ],
  };

  const clusters = useMemo(
    () => Array.from(new Set(initialGuides.map((g) => g.cluster).filter(Boolean))),
    [initialGuides],
  );

  const filtered = useMemo(() => {
    return initialGuides.filter((g) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.slug.toLowerCase().includes(q);
      const matchesCluster = !selectedCluster || g.cluster === selectedCluster;
      return matchesSearch && matchesCluster;
    });
  }, [initialGuides, searchQuery, selectedCluster]);

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={[breadcrumbs]} />
      <Navigation />

      <header className="bg-gradient-to-br from-slate-50 via-white to-teal-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/20 border-b border-border">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <nav className="flex items-center text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground" data-testid="link-breadcrumb-home">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 mx-1" />
            <span className="text-foreground">Scam Guides</span>
          </nav>
          <div className="flex items-center gap-3 mb-3">
            <ShieldAlert className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl md:text-5xl font-bold" data-testid="text-page-title">
              Common Scam Guides
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl" data-testid="text-page-description">
            Plain-language guides to today's most common scams. Each guide explains how the scam
            works, the warning signs to watch for, and the steps you can take to protect yourself
            and your family.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 md:py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search scam guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-scams"
            />
          </div>
        </div>

        {clusters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8" data-testid="filter-clusters">
            <Badge
              variant={!selectedCluster ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCluster(null)}
              data-testid="filter-all"
            >
              All
            </Badge>
            {clusters.map((c) => (
              <Badge
                key={c}
                variant={selectedCluster === c ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCluster(c)}
                data-testid={`filter-cluster-${c}`}
              >
                {clusterLabel(c)}
              </Badge>
            ))}
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-4" data-testid="text-result-count">
          Showing {filtered.length} of {initialGuides.length} scam guides
        </p>

        <ul
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          data-testid="list-scam-guides"
        >
          {filtered.map((g) => (
            <li key={g.slug}>
              <a
                href={`/scams/${g.slug}`}
                data-testid={`link-scam-${g.slug}`}
                className="group block h-full"
              >
                <Card className="h-full transition-all hover:border-teal-500 hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <ShieldAlert className="h-6 w-6 text-orange-500 shrink-0" />
                      <Badge variant="outline" className="text-xs">
                        {clusterLabel(g.cluster)}
                      </Badge>
                    </div>
                    <h2
                      className="text-lg font-semibold mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 line-clamp-2"
                      data-testid={`text-scam-title-${g.slug}`}
                    >
                      {g.title}
                    </h2>
                    <p
                      className="text-sm text-muted-foreground line-clamp-3 mb-4"
                      data-testid={`text-scam-desc-${g.slug}`}
                    >
                      {g.description}
                    </p>
                    <span className="inline-flex items-center text-sm font-medium text-teal-600 dark:text-teal-400 group-hover:text-teal-700 dark:group-hover:text-teal-300">
                      Read guide <ArrowRight className="h-4 w-4 ml-1" />
                    </span>
                  </CardContent>
                </Card>
              </a>
            </li>
          ))}
        </ul>

        {filtered.length === 0 && (
          <div className="text-center py-16" data-testid="text-no-results">
            <ShieldAlert className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              No scam guides found matching your search.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
