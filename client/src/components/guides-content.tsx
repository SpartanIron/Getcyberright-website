"use client";

import { useQuery } from "@tanstack/react-query";
import { Link } from "@/lib/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Search, ArrowRight, Loader2, BookMarked, Shield, Lock, Smartphone, Users, Globe, Brain, CalendarCheck, UserCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export interface Guide {
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
    "identity-theft": { icon: Shield, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/30", label: "Identity Theft" },
    "Phishing": { icon: Lock, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30" },
    "phishing": { icon: Lock, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30", label: "Phishing" },
    "phishing-attacks": { icon: Lock, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30", label: "Phishing Attacks" },
    "Privacy": { icon: Globe, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
    "privacy": { icon: Globe, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30", label: "Privacy" },
    "Device Security": { icon: Smartphone, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
    "device-security": { icon: Smartphone, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30", label: "Device Security" },
    "Family Safety": { icon: Users, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-950/30" },
    "family-safety": { icon: Users, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-950/30", label: "Family Safety" },
    "AI Threats": { icon: Brain, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-950/30" },
    "ai-threats": { icon: Brain, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-950/30", label: "AI Threats" },
    "ai-cybersecurity": { icon: Brain, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-950/30", label: "AI Cybersecurity" },
    "social-media-security": { icon: Smartphone, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/30", label: "Social Media" },
    "Social Media": { icon: Smartphone, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
    "password-security": { icon: Lock, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30", label: "Password Security" },
    "online-scams": { icon: Shield, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/30", label: "Online Scams" },
    "senior-safety": { icon: Users, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-950/30", label: "Senior Safety" },
                        "seniors": { icon: Users, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-950/30", label: "Seniors" },
    "data-breaches": { icon: Shield, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/30", label: "Data Breaches" },
};

function formatCategoryLabel(slug: string): string {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
}

function formatReviewedDate(iso?: string): string {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function deriveAudience(category: string, tags: string[] = []): "Everyone" | "Parents" | "Seniors" | "Small Business" | "Kids" {
    const haystack = [category, ...(tags || [])].map((s) => (s || "").toLowerCase());
    if (haystack.some((t) => t.includes("senior"))) return "Seniors";
    if (haystack.some((t) => t.includes("kid") || t.includes("teen") || t.includes("child"))) return "Kids";
    if (haystack.some((t) => t.includes("parent") || t.includes("family"))) return "Parents";
    if (haystack.some((t) => t.includes("business") || t.includes("smb") || t.includes("work"))) return "Small Business";
    return "Everyone";
}

function deriveKeyTakeaways(meta: string, title: string): string[] {
    const text = (meta || "").trim();
    if (!text) return [];
    const sentences = text
      .replace(/\s+/g, " ")
      .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
      .map((s) => s.trim())
      .filter((s) => s.length > 12 && s.length < 200);
    if (sentences.length >= 2) return sentences.slice(0, 3);
    return [];
}

export function GuidesContent({ initialGuides }: { initialGuides?: Guide[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: guides = [], isLoading, isError } = useQuery<Guide[]>({
        queryKey: ["/api/guides"],
        initialData: initialGuides,
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
                                                                <span className="text-xs font-medium text-center leading-tight">{catConfig.label || formatCategoryLabel(cat)}</span>
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
                      {categoryIcons[selectedCategory]?.label || formatCategoryLabel(selectedCategory)} x
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
                                                      <Badge variant="secondary" className="mb-2">{categoryIcons[guide.category]?.label || formatCategoryLabel(guide.category)}</Badge>
                                                                                )}
                                    <h2 className="text-lg font-semibold mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
                                      {guide.title}
                                    </h2>
                                                                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                                                                  {guide.metaDescription}
                                                                                </p>
                                                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground mb-3" data-testid={`meta-guide-${guide.slug}`}>
                                                                                                    <span className="flex items-center gap-1">
                                                                                                                          <Clock className="h-3 w-3" />
                                                                                                                          <span>{guide.readingTimeMinutes || Math.ceil((guide.wordCount || 0) / 200)} min read</span>
                                                                                                    </span>
                                                                                                    {guide.publishedAt && (
                                                                                                      <span className="flex items-center gap-1" data-testid={`meta-reviewed-${guide.slug}`}>
                                                                                                                          <CalendarCheck className="h-3 w-3" />
                                                                                                                          <span>Reviewed {formatReviewedDate(guide.publishedAt)}</span>
                                                                                                      </span>
                                                                                                    )}
                                                                                                    <span className="flex items-center gap-1" data-testid={`meta-audience-${guide.slug}`}>
                                                                                                                          <UserCircle2 className="h-3 w-3" />
                                                                                                                          <span>For {deriveAudience(guide.category, guide.tags)}</span>
                                                                                                    </span>
                                                                                </div>
                                                                                {(() => {
                                                                                  const takeaways = deriveKeyTakeaways(guide.metaDescription, guide.title);
                                                                                  if (takeaways.length === 0) return null;
                                                                                  return (
                                                                                    <div className="mb-3" data-testid={`takeaways-guide-${guide.slug}`}>
                                                                                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">Key takeaways</p>
                                                                                      <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                                                                                        {takeaways.map((t, idx) => (
                                                                                          <li key={idx} className="line-clamp-2">{t}</li>
                                                                                        ))}
                                                                                      </ul>
                                                                                    </div>
                                                                                  );
                                                                                })()}
                                                                                <div className="flex items-center justify-end text-xs">
                                                                                  <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium">
                                                                                    <span>Read guide</span>
                                                                                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                                                                  </span>
                                                                                </div>
                                                              </CardContent>
                                  </Card>
                                </Link>
                              ))}
                  </div>
              )}
        </main>
      );
}
