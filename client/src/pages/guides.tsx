import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";
import { StructuredData, type BreadcrumbData } from "@/components/structured-data";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Search, ArrowRight, Loader2, BookMarked } from "lucide-react";
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

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-teal-500/20 rounded-lg">
              <BookOpen className="h-8 w-8 text-teal-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold" data-testid="heading-guides">Cyber Safety Guides</h1>
              <p className="text-slate-300 mt-2">Expert advice on staying safe online, written for real people</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-guides">
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
                      <Badge variant="secondary" className="mb-2">{guide.category}</Badge>
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
