"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  TrendingUp,
  Newspaper,
  ExternalLink,
  Clock,
  RefreshCw,
  Globe,
  Users,
  Shield,
  AlertTriangle,
  Flame,
  PenLine,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { LiveNewsIndicator } from "@/components/live-news-indicator";
import { EditorialSpineMini } from "@/components/editorial-spine";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { FadeIn } from "@/components/fade-in";
import AdSlot from "@/components/ad-slot";
import newsBannerImage from "@assets/generated_images/realistic_breaking_news_broadcast_background.png";
import { imgSrc } from "@/lib/img-src";

function decodeHtmlEntities(text: string): string {
  if (!text) return text;
  if (typeof DOMParser !== "undefined") {
    const doc = new DOMParser().parseFromString(text, "text/html");
    return doc.body.textContent || "";
  }
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

const PUBLISHER_DOMAINS: Record<string, string> = {
  "BleepingComputer": "bleepingcomputer.com",
  "SC Media / Cyber Daily": "scmagazine.com",
  "SC Media": "scmagazine.com",
  "The Hacker News": "thehackernews.com",
  "Krebs on Security": "krebsonsecurity.com",
  "Dark Reading": "darkreading.com",
  "CISA Advisories": "cisa.gov",
  "CISA News": "cisa.gov",
  "US-CERT Alerts": "cisa.gov",
  "ACCC Scamwatch": "scamwatch.gov.au",
  "UK Finance": "ukfinance.org.uk",
  "Federal Trade Commission": "ftc.gov",
};

function publisherDomain(source: string, sourceUrl?: string): string | null {
  if (PUBLISHER_DOMAINS[source]) return PUBLISHER_DOMAINS[source];
  if (sourceUrl) {
    try {
      return new URL(sourceUrl).hostname.replace(/^www\./, "");
    } catch {
      return null;
    }
  }
  return null;
}

function PublisherBadge({ source, sourceUrl, size = "sm" }: { source: string; sourceUrl?: string; size?: "sm" | "md" }) {
  const domain = publisherDomain(source, sourceUrl);
  const px = size === "md" ? 24 : 16;
  return (
    <span
      className="inline-flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 border border-slate-200/50 dark:border-slate-700/50 rounded-md px-2 py-1 text-[11px] font-semibold shadow-md"
      data-testid="publisher-badge"
    >
      {domain && (
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
          alt=""
          width={px}
          height={px}
          className="rounded-sm"
          loading="lazy"
        />
      )}
      <span>{source}</span>
    </span>
  );
}

function getCategoryGradient(category: string): string {
  switch (category) {
    case "Cybersecurity":
      return "from-red-900 via-slate-900 to-red-950";
    case "AI":
      return "from-purple-900 via-slate-900 to-indigo-950";
    case "Tech":
      return "from-blue-900 via-slate-900 to-cyan-950";
    case "Action Needed":
      return "from-orange-800 via-slate-900 to-orange-950";
    case "Learning":
      return "from-emerald-900 via-slate-900 to-emerald-950";
    default:
      return "from-slate-800 via-slate-900 to-slate-950";
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "Cybersecurity":
      return Shield;
    case "AI":
      return Sparkles;
    case "Tech":
      return Globe;
    case "Action Needed":
      return AlertTriangle;
    case "Learning":
      return TrendingUp;
    default:
      return Newspaper;
  }
}

interface NewsItem {
  id: string;
  title: string;
  slug?: string;
  excerpt: string;
  category: string;
  source: string;
  url: string;
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
  publishedAt: string;
  urgencyLevel?: number;
  author?: string;
  authorRole?: string;
  articleType?: "curated" | "aggregated";
  curatedTopic?: string | null;
  plainEnglishSummary?: string | null;
  whatChanged?: string | null;
  actionThisWeek?: { label: string; href: string } | null;
  editorialSpinePending?: boolean;
}

interface TrendingCluster {
  clusterId: string;
  keywords: string[];
  sources: string[];
  sourceCount: number;
  size: number;
  articles: NewsItem[];
}

interface TopicGroup {
  key: string;
  label: string;
  articles: NewsItem[];
}

interface TracksResponse {
  whatsHappening: {
    breaking: NewsItem[];
    trending: TrendingCluster[];
    latest: NewsItem[];
  };
  fromGetCyberRight: {
    topics: TopicGroup[];
    author: { name: string; role: string };
  };
  lastUpdated: string | null;
}

interface SearchNewsResponse {
  query: string;
  results: NewsItem[];
  count: number;
}

function ArticleCard({
  article,
  variant = "aggregated",
  size = "md",
}: {
  article: NewsItem;
  variant?: "aggregated" | "curated";
  size?: "sm" | "md" | "lg";
}) {
  const [imgError, setImgError] = useState(false);
  const [, navigate] = useLocation();
  const hasSlug = !!article.slug;
  const effectiveImage = article.imageUrl || article.thumbnailUrl || null;
  const showImage = !!effectiveImage && !imgError;
  const CategoryIcon = getCategoryIcon(article.category);
  const isUrgent = (article.urgencyLevel || 0) >= 4;

  const handleClick = (e: React.MouseEvent) => {
    if (hasSlug) {
      e.preventDefault();
      navigate(`/news/${article.slug}`);
    }
  };

  const heightClass = size === "lg" ? "h-64" : size === "sm" ? "h-36" : "h-44";

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (hasSlug && article.slug) {
            navigate(`/news/${article.slug}`);
          } else {
            window.open(article.url, "_blank", "noopener,noreferrer");
          }
        }
      }}
      className="block group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg"
      data-testid={`news-card-${article.id}`}
    >
      <Card className="h-full overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
        <div className={`relative ${heightClass} overflow-hidden`}>
          {showImage ? (
            <>
              <img
                src={effectiveImage as string}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => setImgError(true)}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            </>
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${getCategoryGradient(article.category)} flex items-center justify-center relative`}
            >
              <CategoryIcon className="w-14 h-14 text-white/15" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_60%)]" />
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {variant === "curated" ? (
              <Badge className="bg-teal-600 text-white border-0 text-[10px] font-semibold shadow-md">
                <PenLine className="h-3 w-3 mr-1" />
                GetCyberRight Original
              </Badge>
            ) : (
              <PublisherBadge source={article.source} sourceUrl={article.url} />
            )}
            {isUrgent && (
              <Badge className="bg-orange-600 text-white border-0 text-[10px] font-semibold shadow-md animate-pulse">
                <AlertTriangle className="h-3 w-3 mr-0.5" />
                Action Needed
              </Badge>
            )}
          </div>

          <div className="absolute bottom-3 right-3">
            <span className="text-white/90 text-[11px] flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md">
              <Clock className="h-3 w-3" />
              {formatTimeAgo(article.publishedAt)}
            </span>
          </div>
        </div>

        <CardContent className="p-4">
          <h3
            className={`font-bold leading-snug mb-2 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors ${
              size === "lg" ? "text-lg" : "text-[15px]"
            }`}
          >
            {decodeHtmlEntities(article.title)}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {decodeHtmlEntities(article.excerpt)}
          </p>
          {variant === "aggregated" && article.plainEnglishSummary && (
            <p
              className="mt-2 text-[12px] leading-snug text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 border-l-2 border-teal-500 pl-2 py-1 rounded-sm line-clamp-3"
              data-testid="text-plain-english-summary"
            >
              {article.plainEnglishSummary}
            </p>
          )}
          {variant === "curated" && (article.whatChanged || article.actionThisWeek) && (
            <EditorialSpineMini
              whatChanged={article.whatChanged}
              actionThisWeek={article.actionThisWeek || undefined}
            />
          )}
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-muted-foreground">
            {variant === "curated" ? (
              <span className="flex items-center gap-2">
                <Avatar className="h-7 w-7 ring-1 ring-teal-500/30">
                  <AvatarImage src="/jude-annan.jpg" alt="Jude Annan" />
                  <AvatarFallback className="text-[10px] bg-teal-600 text-white font-bold">JA</AvatarFallback>
                </Avatar>
                <span className="leading-tight">
                  <span className="block font-semibold text-slate-800 dark:text-slate-200">
                    {article.author || "Jude Annan, CISM"}
                  </span>
                  <span className="block text-[10px] text-muted-foreground">
                    {article.authorRole || "Managing Partner, GetCyberRight"}
                  </span>
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Globe className="h-3 w-3" />
                Aggregated from <span className="font-medium text-slate-700 dark:text-slate-300">{article.source}</span>
              </span>
            )}
            <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Read
              <ChevronRight className="h-3 w-3" />
            </span>
          </div>
          {variant === "aggregated" && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-2 inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 underline-offset-2 hover:underline"
              data-testid={`link-source-${article.id}`}
            >
              <ExternalLink className="h-3 w-3" />
              Read original at {article.source}
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function TrendingClusterCard({ cluster }: { cluster: TrendingCluster }) {
  const [, navigate] = useLocation();
  const lead = cluster.articles[0];
  if (!lead) return null;
  return (
    <Card
      className="overflow-hidden border border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/30 dark:to-slate-900 hover:shadow-md transition-shadow"
      data-testid={`trending-cluster-${cluster.clusterId}`}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="rounded-full bg-amber-500/15 p-2 flex-shrink-0">
            <Flame className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
              Trending: covered by {cluster.sourceCount} sources
            </div>
            <button
              onClick={() => lead.slug && navigate(`/news/${lead.slug}`)}
              className="text-left font-bold text-base leading-snug hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              data-testid={`trending-lead-${cluster.clusterId}`}
            >
              {decodeHtmlEntities(lead.title)}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {cluster.sources.slice(0, 4).map((s) => (
            <Badge key={s} variant="outline" className="text-[10px]">
              {s}
            </Badge>
          ))}
        </div>
        {cluster.articles.length > 1 && (
          <ul className="space-y-1.5 text-sm border-t border-amber-200/50 dark:border-amber-900/30 pt-3">
            {cluster.articles.slice(1, 4).map((a) => (
              <li key={a.id} className="flex items-start gap-2 text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400">
                <ChevronRight className="h-3 w-3 mt-1 flex-shrink-0" />
                <a
                  href={a.slug ? `/news/${a.slug}` : a.url}
                  target={a.slug ? undefined : "_blank"}
                  rel={a.slug ? undefined : "noopener noreferrer"}
                  className="line-clamp-1"
                  onClick={(e) => {
                    if (a.slug) {
                      e.preventDefault();
                      navigate(`/news/${a.slug}`);
                    }
                  }}
                  data-testid={`trending-related-${a.id}`}
                >
                  <span className="font-medium text-slate-600 dark:text-slate-400">{a.source}:</span>{" "}
                  {decodeHtmlEntities(a.title)}
                </a>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

type IconType = React.ComponentType<{ className?: string }>;

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  badge,
}: {
  icon: IconType;
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-teal-500/10 p-2">
          <Icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {badge && (
        <Badge variant="outline" className="text-[10px]">
          {badge}
        </Badge>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-10 text-muted-foreground text-sm" data-testid="empty-state">
      {message}
    </div>
  );
}

function CardSkeleton() {
  return (
    <Card className="animate-pulse overflow-hidden">
      <div className="h-44 bg-slate-200 dark:bg-slate-800" />
      <CardContent className="p-4 space-y-2">
        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
      </CardContent>
    </Card>
  );
}

export interface NewsResponse {
  articles: NewsItem[];
  lastUpdated: string | null;
  stats: { categories: string[]; totalArticles: number; lastFetch: string | null };
}

export function NewsContent({ initialNews }: { initialNews?: NewsResponse | null }) {
  const [activeTrack, setActiveTrack] = useState<"happening" | "gcr">("happening");
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [, navigate] = useLocation();

  const { data: tracks, isLoading, isError, refetch, isFetching } = useQuery<TracksResponse>({
    queryKey: ["/api/news/tracks"],
    queryFn: async () => {
      const res = await fetch("/api/news/tracks");
      if (!res.ok) throw new Error("Failed to load news");
      return res.json();
    },
    refetchInterval: 300000,
    staleTime: 60000,
  });

  const { data: searchData, isLoading: searchLoading } = useQuery<SearchNewsResponse>({
    queryKey: ["/api/news/search", submittedQuery],
    queryFn: async () => {
      const res = await fetch(`/api/news/search?q=${encodeURIComponent(submittedQuery)}&limit=30`);
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: submittedQuery.length >= 2,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery.trim());
  };

  const inSearchMode = submittedQuery.length >= 2;

  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="relative text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imgSrc(newsBannerImage)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        <div className="relative container mx-auto px-4 py-12 sm:py-16">
          <FadeIn className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-red-600/90 rounded-full px-3 py-1.5 mb-4">
              <AlertTriangle className="h-4 w-4 text-white" />
              <span className="text-xs font-semibold text-white uppercase tracking-wide">News & Insights</span>
              <LiveNewsIndicator />
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold mb-3 drop-shadow-lg">News & Insights</h1>
            <p className="text-base sm:text-xl text-white/90 leading-relaxed max-w-2xl">
              Two tracks: what the security world is reporting right now, and what GetCyberRight thinks your family should do about it.
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSearch} className="relative mb-6 max-w-2xl mx-auto">
          <Input
            type="text"
            placeholder="Search scams, breaches, safety topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-24 py-3 text-base"
            data-testid="input-search"
          />
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
          <Button type="submit" className="absolute right-2 top-1.5" size="sm" data-testid="button-search">
            Search
          </Button>
          {inSearchMode && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute -bottom-8 left-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                setSearchQuery("");
                setSubmittedQuery("");
              }}
              data-testid="button-clear-search"
            >
              Clear search
            </Button>
          )}
        </form>

        {!inSearchMode && (
          <div className="flex items-center justify-between mb-6 mt-2 gap-4 flex-wrap">
            <div
              className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-1"
              role="tablist"
              data-testid="track-tabs"
            >
              <button
                onClick={() => setActiveTrack("happening")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                  activeTrack === "happening"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
                data-testid="tab-whats-happening"
                role="tab"
                aria-selected={activeTrack === "happening"}
              >
                <Globe className="h-4 w-4" />
                What's Happening
              </button>
              <button
                onClick={() => setActiveTrack("gcr")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                  activeTrack === "gcr"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
                data-testid="tab-from-getcyberright"
                role="tab"
                aria-selected={activeTrack === "gcr"}
              >
                <PenLine className="h-4 w-4" />
                From GetCyberRight
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {tracks?.lastUpdated && (
                <span className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" />
                  Updated {formatTimeAgo(tracks.lastUpdated)}
                </span>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => refetch()}
                disabled={isFetching}
                className="h-7"
                data-testid="button-refresh-news"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        )}

        {inSearchMode ? (
          <div data-testid="search-results">
            <SectionHeader
              icon={Search}
              title={`Search results for "${submittedQuery}"`}
              subtitle={`${searchData?.count ?? 0} matches`}
            />
            {searchLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : (searchData?.results.length || 0) === 0 ? (
              <EmptyState message="No matching articles found." />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {searchData!.results.map((a) => (
                  <ArticleCard key={a.id} article={a} variant={a.articleType === "curated" ? "curated" : "aggregated"} />
                ))}
              </div>
            )}
          </div>
        ) : isError ? (
          <Card className="p-8 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto text-red-500 mb-3" />
            <p className="text-sm font-medium mb-3">We couldn't load the news right now.</p>
            <Button onClick={() => refetch()} size="sm" variant="outline" data-testid="button-retry-news">
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Try again
            </Button>
          </Card>
        ) : isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : activeTrack === "happening" ? (
          <div className="space-y-12" data-testid="track-happening">
            {tracks?.whatsHappening.breaking.length ? (
              <section>
                <SectionHeader
                  icon={AlertTriangle}
                  title="Breaking"
                  subtitle="High-urgency stories from the last 72 hours"
                  badge={`${tracks.whatsHappening.breaking.length} stories`}
                />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {tracks.whatsHappening.breaking.map((a) => (
                    <ArticleCard key={a.id} article={a} variant="aggregated" />
                  ))}
                </div>
              </section>
            ) : null}

            {tracks?.whatsHappening.trending.length ? (
              <section>
                <SectionHeader
                  icon={Flame}
                  title="Trending across publishers"
                  subtitle="Stories covered by 2 or more independent sources in the last 48 hours"
                  badge={`${tracks.whatsHappening.trending.length} clusters`}
                />
                <div className="grid md:grid-cols-2 gap-5">
                  {tracks.whatsHappening.trending.map((c) => (
                    <TrendingClusterCard key={c.clusterId} cluster={c} />
                  ))}
                </div>
              </section>
            ) : null}

            <section>
              <SectionHeader
                icon={Globe}
                title="Latest"
                subtitle="Aggregated from trusted cybersecurity publishers"
                badge={`${tracks?.whatsHappening.latest.length || 0} articles`}
              />
              {(tracks?.whatsHappening.latest.length || 0) === 0 ? (
                <EmptyState message="No recent stories yet. Check back soon." />
              ) : (() => {
                const newsInlineSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_NEWS_INLINE;
                const items = tracks!.whatsHappening.latest;
                const firstRow = items.slice(0, 3);
                const restRows = items.slice(3);
                return (
                  <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {firstRow.map((a) => (
                        <ArticleCard key={a.id} article={a} variant="aggregated" />
                      ))}
                    </div>
                    {newsInlineSlot && restRows.length > 0 && (
                      <AdSlot
                        slot={newsInlineSlot}
                        format="in-article"
                        className="my-6"
                        testId="ad-news-inline"
                      />
                    )}
                    {restRows.length > 0 && (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                        {restRows.map((a) => (
                          <ArticleCard key={a.id} article={a} variant="aggregated" />
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </section>
          </div>
        ) : (
          <div className="space-y-12" data-testid="track-gcr">
            <Card className="bg-gradient-to-r from-teal-500/10 via-teal-500/5 to-transparent border-teal-500/20">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="rounded-full bg-teal-500/15 p-3">
                  <PenLine className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Curated by {tracks?.fromGetCyberRight.author.name || "Jude Annan, CISM"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tracks?.fromGetCyberRight.author.role || "Managing Partner, GetCyberRight"}. Plain-English explanations and what to do this week.
                  </p>
                </div>
              </CardContent>
            </Card>

            {tracks?.fromGetCyberRight.topics.every((t) => t.articles.length === 0) ? (
              <EmptyState message="No curated pieces published yet. Check back soon." />
            ) : (
              tracks?.fromGetCyberRight.topics.map((topic) =>
                topic.articles.length === 0 ? null : (
                  <section key={topic.key} data-testid={`gcr-topic-${topic.key}`}>
                    <SectionHeader
                      icon={
                        topic.key === "keep-kids-safe"
                          ? Users
                          : topic.key === "protect-parents"
                          ? Shield
                          : topic.key === "spot-the-scam"
                          ? AlertTriangle
                          : Sparkles
                      }
                      title={topic.label}
                      badge={`${topic.articles.length} pieces`}
                    />
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {topic.articles.map((a) => (
                        <ArticleCard key={a.id} article={a} variant="curated" />
                      ))}
                    </div>
                  </section>
                ),
              )
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
