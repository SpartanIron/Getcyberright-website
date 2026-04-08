"use client";

import { useQuery } from "@tanstack/react-query";
import { Link } from "@/lib/navigation";
import { useSEO } from "@/hooks/use-seo";
import { StructuredData, type BreadcrumbData } from "@/components/structured-data";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Search, ArrowRight, Loader2, BookMarked, Shield, Lock, Smartphone, Users, Globe, Brain } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Guide {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  category: string;
  tags: string[];
  wordCount: number;
  readingTimeMinutes: number;
  publishedAt: string;
  featuredImage: string | null;
  authorName: string;
}

const categoryIcons: Record<string, { icon: typeof BookOpen; color: string; bg: string; label?: string }> = {
  "Identity Theft": { icon: Shield, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/30" },
  "Phishing": { icon: Lock, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30" },
  "Privacy": { icon: Globe, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
  "Device Security": { icon: Smartphone, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
  "Family Safety": { icon: Users, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-950/30" },
  "AI Threats": { icon: Brain, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-950/30" },
  "social-media-security": { icon: Smartphone, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/30", label: "Social Media" },
};

export default function GuidesListing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useSEO({
    title: "Cyber Safety Guides | GetCyberRight",
    description: "Expert guides on cybersecurity, online safety, and digital privacy. Practical advice for families, seniors, kids, and everyday internet users.",
    keywords: "cybersecurity guides, online safety tips, digital privacy, internet security",
  });

  const breadcrumbs: BreadcrumbData = {
    type: "BreadcrumbList",
    items: [
      { name: "Home", url: "https://www.getcyberright.com/" },
      { name: "Cyber Safety Guides", url: "https://www.getcyberright.com/guides" },
    ],
  };

  const { data: guides = [], isLoading, isError } = useQuery<Guide[]>({
    queryKey: ["/api/guides"],
  });

  const categories = Array.from(new Set(guides.map((g) => g.category).filter(Boolean)));

  const filtered = guides.filter((g) => {
    const matchesSearch = !searchQuery || 
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.metaDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || g.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={[breadcrumbs]} />
      <Navigation />

      <div className="bg-[#0A2A3C] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A2A3C] via-[#0A2A3C] to-[#00293C]" />
        <div className="absolute pointer-events-none hidden md:block" aria-hidden="true" style={{ top: 0, right: 0, width: "55%", height: "100%", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-40%", right: "2%", width: "50px", height: "220%", background: "linear-gradient(180deg, #003A52 0%, #0D4D66 50%, #003A52 100%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
          <div style={{ position: "absolute", top: "-40%", right: "10%", width: "2px", height: "220%", background: "linear-gradient(180deg, transparent 10%, rgba(45, 212, 191, 0.4) 50%, transparent 90%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
          <div style={{ position: "absolute", top: "-35%", right: "18%", width: "35px", height: "220%", background: "linear-gradient(180deg, #5eead4 0%, #2dd4bf 35%, #14b8a6 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.55 }} />
          <div style={{ position: "absolute", top: "-35%", right: "26%", width: "2px", height: "220%", background: "linear-gradient(180deg, transparent 15%, hsla(16, 95%, 58%, 0.35) 50%, transparent 85%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
          <div style={{ position: "absolute", top: "-30%", right: "32%", width: "50px", height: "220%", background: "linear-gradient(180deg, hsl(16, 100%, 62%) 0%, hsl(16, 95%, 52%) 40%, hsl(16, 90%, 42%) 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.5 }} />
        </div>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-[1.75rem] sm:text-3xl md:text-4xl font-extrabold tracking-[-0.025em]" data-testid="heading-guides">Cyber Safety Guides</h1>
              <p className="text-white/60 mt-2">Expert advice on staying safe online, written for real people</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {categories.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8" data-testid="category-tiles">
            {categories.map((cat) => {
              const catConfig = categoryIcons[cat] || { icon: BookOpen, color: "text-primary", bg: "bg-primary/10" };
              const Icon = catConfig.icon;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(isSelected ? null : cat)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/50 hover:shadow-sm"
                  } ${catConfig.bg}`}
                  data-testid={`tile-${cat}`}
                >
                  <Icon className={`h-6 w-6 ${catConfig.color}`} />
                  <span className="text-xs font-medium text-center leading-tight">{catConfig.label || cat}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-guides"
            />
          </div>
          {selectedCategory && (
            <Badge
              variant="default"
              className="cursor-pointer self-start"
              onClick={() => setSelectedCategory(null)}
              data-testid="filter-clear"
            >
              {categoryIcons[selectedCategory]?.label || selectedCategory} x
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="text-center py-20" data-testid="error-guides">
            <BookMarked className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Unable to load guides</h2>
            <p className="text-muted-foreground">Something went wrong. Please try refreshing the page.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookMarked className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2" data-testid="text-no-guides">No guides found</h2>
            <p className="text-muted-foreground">
              {searchQuery ? "Try a different search term." : "New guides are published regularly. Check back soon!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-6" data-testid="grid-guides">
            {filtered.map((guide) => (
              <Link key={guide.id} href={`/guides/${guide.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group" data-testid={`card-guide-${guide.slug}`}>
                  {guide.featuredImage && (
                    <div className="h-48 overflow-hidden rounded-t-lg">
                      <img src={guide.featuredImage} alt={guide.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <CardContent className={guide.featuredImage ? "pt-4" : "pt-6"}>
                    {guide.category && (
                      <Badge variant="secondary" className="mb-2">{categoryIcons[guide.category]?.label || guide.category}</Badge>
                    )}
                    <h2 className="text-lg font-semibold mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
                      {guide.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {guide.metaDescription}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{guide.readingTimeMinutes || Math.ceil((guide.wordCount || 0) / 200)} min read</span>
                      </div>
                      <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
                        <span>Read more</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </div>
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
