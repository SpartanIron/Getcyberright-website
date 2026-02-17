import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LiveNewsIndicator } from "@/components/live-news-indicator";
import { ArticleCard } from "@/components/article-card";
import { NewsFilter } from "@/components/news-filter";
import { Clock, Search, Filter, Globe, TrendingUp, AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { Article } from "@shared/schema";

// Decode HTML entities in text (e.g., &#8216; -> ')
function decodeHtmlEntities(text: string): string {
  if (!text) return text;
  return text
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

export default function LiveFeed() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const { data: articles = [], isLoading: articlesLoading, refetch: refetchArticles } = useQuery({
    queryKey: ["/api/articles/enhanced"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: breakingNews, isLoading: breakingLoading, refetch: refetchBreaking } = useQuery({
    queryKey: ["/api/breaking-news"],
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  const { data: liveNews = [], isLoading: liveLoading, refetch: refetchLive } = useQuery({
    queryKey: ["/api/news/live"],
    refetchInterval: 20000, // Refresh every 20 seconds
  });

  const handleRefresh = () => {
    refetchArticles();
    refetchBreaking();
    refetchLive();
  };

  const filteredArticles = articles.filter((article: Article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedArticles = [...filteredArticles].sort((a: Article, b: Article) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime();
      case "trending":
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      case "breaking":
        return (b.breaking ? 1 : 0) - (a.breaking ? 1 : 0);
      default:
        return 0;
    }
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "news", label: "News" },
    { value: "analysis", label: "Analysis" },
    { value: "tutorial", label: "Tutorials" },
    { value: "career", label: "Career" },
    { value: "interview", label: "Interviews" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Back Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-3">
          <Link to="/tools" className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Tools
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-red-500/10 rounded-full">
              <Globe className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              Live Cybersecurity Feed
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-time cybersecurity news, breaking alerts, and threat intelligence updates from around the globe
          </p>
          <LiveNewsIndicator showRefresh={true} onRefresh={handleRefresh} />
        </div>

        {/* Breaking News Banner */}
        {breakingNews && (
          <Card className="mb-8 border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-500 rounded-full flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-red-500 text-white animate-pulse">BREAKING</Badge>
                    <span className="text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Just now
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">
                    {decodeHtmlEntities(breakingNews.title)}
                  </h2>
                  <p className="text-muted-foreground">
                    {decodeHtmlEntities(breakingNews.description)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter and Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest First</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="breaking">Breaking News</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Live News Updates */}
        {liveNews.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Live Updates
                <Badge variant="secondary" className="ml-auto">
                  {liveNews.length} updates
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {liveNews.slice(0, 3).map((news: any, index: number) => (
                  <div key={index} className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 animate-pulse"></div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-800 dark:text-green-200">
                          {decodeHtmlEntities(news.title)}
                        </h3>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                          {decodeHtmlEntities(news.description)}
                        </p>
                        <span className="text-xs text-green-600 dark:text-green-400">
                          {new Date(news.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Latest Articles</h2>
            <Badge variant="secondary">
              {sortedArticles.length} articles
            </Badge>
          </div>

          {articlesLoading ? (
            <div className="grid gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-muted rounded w-full mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : sortedArticles.length > 0 ? (
            <div className="grid gap-6">
              {sortedArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  compact={true}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No articles found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or check back later for new updates.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Auto-refresh Notice */}
        <Card className="mt-8 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                This feed automatically refreshes every 15-30 seconds to bring you the latest cybersecurity news and updates.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}