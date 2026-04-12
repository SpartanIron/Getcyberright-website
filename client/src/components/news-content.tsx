"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewsFilter } from "@/components/news-filter";
import { Search, TrendingUp, ChevronLeft, ChevronRight, Newspaper, ExternalLink, Clock, RefreshCw, MapPin, Calendar, Globe, Users, Shield, AlertTriangle } from "lucide-react";
import { LiveNewsIndicator } from "@/components/live-news-indicator";
import { NewsPageGuidesSidebar } from "@/components/content-preview";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { FadeIn } from "@/components/fade-in";
import newsBannerImage from "@assets/generated_images/realistic_breaking_news_broadcast_background.png";
import { imgSrc } from "@/lib/img-src";

function decodeHtmlEntities(text: string): string {
 if (!text) return text;
 if (typeof DOMParser !== "undefined") {
  const doc = new DOMParser().parseFromString(text, 'text/html');
  return doc.body.textContent || '';
 }
 return text
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
  .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'")
  .replace(/&#8216;/g, "\u2018")
  .replace(/&#8217;/g, "\u2019")
  .replace(/&#8220;/g, "\u201C")
  .replace(/&#8221;/g, "\u201D");
}

interface NewsItem {
 id: string;
 title: string;
 excerpt: string;
 content?: string;
 category: "Cybersecurity" | "AI" | "Tech" | "Conferences" | "Action Needed" | "safety";
 author?: string;
 source: string;
 url: string;
 slug?: string;
 imageUrl?: string | null;
 thumbnailUrl?: string | null;
 publishedAt: string;
 readTime?: number;
 urgencyLevel?: number;
 relatedToolUrl?: string | null;
 relatedToolName?: string | null;
}

export interface NewsResponse {
 articles: NewsItem[];
 lastUpdated: string | null;
 stats: {
 categories: string[];
 totalArticles: number;
 lastFetch: string | null;
 };
}

interface CategoryNewsResponse {
 category: string;
 articles: NewsItem[];
 lastUpdated: string | null;
}

interface SearchNewsResponse {
 query: string;
 results: NewsItem[];
 count: number;
}

interface TechEvent {
 id: number;
 name: string;
 organizer: string;
 description: string;
 startDate: string;
 endDate: string | null;
 location: string;
 city: string | null;
 country: string;
 category: string;
 url: string;
 imageUrl: string | null;
 isVirtual: boolean | null;
 isFree: boolean | null;
 featured: boolean | null;
}

interface EventsResponse {
 events: TechEvent[];
 count: number;
}

function formatTimeAgo(dateString: string): string {
 const date = new Date(dateString);
 const now = new Date();
 const diffMs = now.getTime() - date.getTime();
 const diffMins = Math.floor(diffMs / 60000);
 const diffHours = Math.floor(diffMs / 3600000);
 const diffDays = Math.floor(diffMs / 86400000);

 if (diffMins < 60) return `${diffMins}m ago`;
 if (diffHours < 24) return `${diffHours}h ago`;
 if (diffDays < 7) return `${diffDays}d ago`;
 return date.toLocaleDateString();
}

function getCategoryColor(category: string): string {
 switch (category) {
 case "Cybersecurity": return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
 case "AI": return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
 case "Tech": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
 case "Conferences": return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
 case "Action Needed": return "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20";
 case "Learning": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
 default: return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
 }
}

function detectAudience(title: string, excerpt: string): { label: string; color: string } | null {
 const text = (title + " " + excerpt).toLowerCase();
 
 const seniorKeywords = ["senior", "elderly", "medicare", "social security", "retirement", "grandparent", "romance scam", "phone scam", "tech support scam"];
 const parentKeywords = ["parent", "child", "kid", "minor", "teen", "school", "tiktok", "instagram", "snapchat", "gaming", "parental", "family"];
 const teenKeywords = ["teen", "student", "sextortion", "social media", "dating app", "snapchat", "discord", "gaming"];
 
 if (seniorKeywords.some(kw => text.includes(kw))) {
 return { label: "Seniors", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
 }
 if (teenKeywords.some(kw => text.includes(kw))) {
 return { label: "Teens", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
 }
 if (parentKeywords.some(kw => text.includes(kw))) {
 return { label: "Parents", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" };
 }
 return null;
}

function getActionTip(title: string, excerpt: string): string | null {
 const text = (title + " " + excerpt).toLowerCase();
 
 if (text.includes("breach") || text.includes("leak") || text.includes("exposed")) {
 return "Check if you're affected. Change passwords.";
 }
 if (text.includes("phishing") || text.includes("scam") || text.includes("fraud")) {
 return "Warn family members. Don't click unknown links.";
 }
 if (text.includes("vulnerability") || text.includes("patch") || text.includes("update")) {
 return "Update your devices and apps now.";
 }
 if (text.includes("ransomware") || text.includes("malware")) {
 return "Backup your data. Check device security.";
 }
 return null;
}

function getCategoryGradient(category: string): string {
 switch (category) {
 case "Cybersecurity": return "from-red-900 via-slate-900 to-red-950";
 case "AI": return "from-purple-900 via-slate-900 to-indigo-950";
 case "Tech": return "from-blue-900 via-slate-900 to-cyan-950";
 case "Action Needed": return "from-orange-800 via-slate-900 to-orange-950";
 case "Learning": return "from-emerald-900 via-slate-900 to-emerald-950";
 default: return "from-slate-800 via-slate-900 to-slate-950";
 }
}

function getCategoryIcon(category: string) {
 switch (category) {
 case "Cybersecurity": return Shield;
 case "AI": return Newspaper;
 case "Tech": return Globe;
 case "Action Needed": return AlertTriangle;
 case "Learning": return TrendingUp;
 default: return Shield;
 }
}

function getEstimatedReadTime(content?: string, excerpt?: string): number {
 const text = content || excerpt || "";
 const wordCount = text.split(/\s+/).length;
 return Math.max(2, Math.ceil(wordCount / 200));
}

function NewsCard({ article }: { article: NewsItem }) {
 const imageUrl = article.imageUrl || article.thumbnailUrl;
 const [imgError, setImgError] = useState(false);
 const audience = detectAudience(article.title, article.excerpt);
 const actionTip = getActionTip(article.title, article.excerpt);
 const [, navigate] = useLocation();
 const hasSlug = !!article.slug;
 const readTime = getEstimatedReadTime(article.content, article.excerpt);
 const urgencyBadge = article.urgencyLevel && article.urgencyLevel >= 4
 ? { label: "Action Needed", className: "bg-orange-600 text-white animate-pulse" }
 : article.urgencyLevel && article.urgencyLevel >= 3
 ? { label: "Important", className: "bg-amber-500 text-white" }
 : null;
 const showImage = imageUrl && !imgError;
 const CategoryIcon = getCategoryIcon(article.category);
 
 const handleClick = (e: React.MouseEvent) => {
 if (hasSlug) {
 e.preventDefault();
 navigate(`/news/${article.slug}`);
 }
 };

 return (
 <a
 href={hasSlug ? `/news/${article.slug}` : article.url}
 target={hasSlug ? undefined : "_blank"}
 rel={hasSlug ? undefined : "noopener noreferrer"}
 onClick={handleClick}
 className="block group"
 data-testid={`news-card-${article.id}`}
 >
 <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-0 shadow-md dark:shadow-none dark:border dark:border-slate-800">
 <div className="relative h-48 overflow-hidden">
 {showImage ? (
 <>
 <img 
 src={imageUrl} 
 alt={article.title}
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
 onError={() => setImgError(true)}
 loading="lazy"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
 </>
 ) : (
 <div className={`w-full h-full bg-gradient-to-br ${getCategoryGradient(article.category)} flex items-center justify-center`}>
 <CategoryIcon className="w-16 h-16 text-white/10" />
 <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.06),transparent_60%)]" />
 </div>
 )}
 
 <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
 <Badge className={`text-[10px] font-semibold ${getCategoryColor(article.category)} backdrop-blur-sm bg-white/90 dark:bg-black/70 border`}>
 {article.category}
 </Badge>
 {urgencyBadge && (
 <Badge className={`text-[10px] font-semibold ${urgencyBadge.className} shadow-lg`}>
 <AlertTriangle className="h-3 w-3 mr-0.5" />
 {urgencyBadge.label}
 </Badge>
 )}
 {audience && (
 <Badge className={`text-[10px] font-semibold ${audience.color} backdrop-blur-sm`}>
 <Users className="h-3 w-3 mr-0.5" />
 {audience.label}
 </Badge>
 )}
 </div>
 
 <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
 <span className="text-white/90 text-xs font-medium bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md">
 {article.source}
 </span>
 <span className="text-white/80 text-xs flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md">
 <Clock className="h-3 w-3" />
 {readTime} min
 </span>
 </div>
 </div>

 <CardContent className="p-4 flex flex-col flex-1">
 <h3 className="font-bold text-[15px] leading-snug mb-2 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
 {decodeHtmlEntities(article.title)}
 </h3>
 
 <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
 {decodeHtmlEntities(article.excerpt)}
 </p>
 
 {actionTip && (
 <div className="flex items-start gap-1.5 mb-3 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/40">
 <Shield className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
 <span className="text-xs text-amber-700 dark:text-amber-300 font-medium leading-snug">{actionTip}</span>
 </div>
 )}
 
 <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-muted-foreground">
 <span className="flex items-center gap-1">
 <Clock className="h-3 w-3" />
 {formatTimeAgo(article.publishedAt)}
 </span>
 <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
 Read more
 <ChevronRight className="h-3 w-3" />
 </span>
 </div>
 </CardContent>
 </Card>
 </a>
 );
}

function formatEventDate(startDate: string, endDate: string | null): string {
 const start = new Date(startDate);
 const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
 
 if (!endDate) {
 return start.toLocaleDateString('en-US', options);
 }
 
 const end = new Date(endDate);
 if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
 return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.getDate()}, ${end.getFullYear()}`;
 }
 
 return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
}

function getEventCategoryColor(category: string): string {
 switch (category) {
 case "cybersecurity": return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
 case "ai": return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
 case "tech": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
 case "cloud": return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
 case "data": return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
 default: return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
 }
}

function EventCard({ event }: { event: TechEvent }) {
 return (
 <a
 href={event.url}
 target="_blank"
 rel="noopener noreferrer"
 className="block group"
 data-testid={`event-card-${event.id}`}
 >
 <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-amber-500 overflow-hidden">
 {event.imageUrl && (
 <div className="relative h-40 overflow-hidden bg-muted">
 <img 
 src={event.imageUrl} 
 alt={event.name}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
 onError={(e) => {
 (e.target as HTMLImageElement).style.display = 'none';
 }}
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
 <div className="absolute bottom-3 left-3 right-3">
 <div className="flex items-center gap-2 flex-wrap">
 <Badge variant="outline" className={`text-xs ${getEventCategoryColor(event.category)} bg-white/90 dark:bg-black/70`}>
 {event.category}
 </Badge>
 {event.featured && (
 <Badge className="bg-amber-500 text-white text-xs">Featured</Badge>
 )}
 {event.isVirtual && (
 <Badge variant="outline" className="text-xs bg-white/90 dark:bg-black/70 border-green-500/30 text-green-600">
 <Globe className="h-3 w-3 mr-1" />
 Virtual
 </Badge>
 )}
 {event.isFree && (
 <Badge variant="outline" className="text-xs bg-white/90 dark:bg-black/70 border-teal-500/30 text-teal-600">
 Free
 </Badge>
 )}
 </div>
 </div>
 </div>
 )}
 <CardContent className="p-4">
 <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
 {event.name}
 </h3>
 
 <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
 {event.description}
 </p>
 
 <div className="space-y-2 text-sm">
 <div className="flex items-center gap-2 text-muted-foreground">
 <Calendar className="h-4 w-4 text-amber-500" />
 <span>{formatEventDate(event.startDate, event.endDate)}</span>
 </div>
 
 <div className="flex items-center gap-2 text-muted-foreground">
 <MapPin className="h-4 w-4 text-amber-500" />
 <span className="truncate">{event.city ? `${event.city}, ${event.country}` : event.location}</span>
 </div>
 
 <div className="flex items-center gap-2 text-muted-foreground">
 <Users className="h-4 w-4 text-amber-500" />
 <span className="truncate">{event.organizer}</span>
 </div>
 </div>
 
 <div className="flex items-center justify-end mt-3">
 <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
 </div>
 </CardContent>
 </Card>
 </a>
 );
}

export function NewsContent({ initialNews }: { initialNews?: NewsResponse | null }) {
 const [searchQuery, setSearchQuery] = useState("");
 const [activeFilter, setActiveFilter] = useState("all");
 const [currentPage, setCurrentPage] = useState(1);
 const [location] = useLocation();
 
 const ARTICLES_PER_PAGE = 12;


 const urlParams = new URLSearchParams(location.split("?")[1] || "");
 const urlSearch = urlParams.get("search");

 // Fetch all news or category-specific news (skip if showing events)
 const { data: newsData, isLoading, refetch } = useQuery<NewsResponse | CategoryNewsResponse>({
 queryKey: activeFilter === "all" 
 ? ["/api/news/latest"] 
 : ["/api/news/category", activeFilter],
 queryFn: async () => {
 const url = activeFilter === "all" 
 ? "/api/news/latest?limit=100"
 : `/api/news/category/${activeFilter}?limit=50`;
 const res = await fetch(url);
 if (!res.ok) throw new Error("Failed to fetch news");
 return res.json();
 },
 initialData: activeFilter === "all" && initialNews ? initialNews : undefined,
 enabled: activeFilter !== "conferences",
 refetchInterval: 300000,
 staleTime: 60000,
 });

 // Fetch tech events when filter is "conferences"
 const { data: eventsData, isLoading: eventsLoading } = useQuery<EventsResponse>({
 queryKey: ["/api/events"],
 queryFn: async () => {
 const res = await fetch("/api/events?upcoming=true");
 if (!res.ok) throw new Error("Failed to fetch events");
 return res.json();
 },
 enabled: activeFilter === "conferences",
 staleTime: 300000, // Events don't change as often
 });

 // Search query - disabled in events view
 const { data: searchData, isLoading: searchLoading } = useQuery<SearchNewsResponse>({
 queryKey: ["/api/news/search", urlSearch || searchQuery],
 queryFn: async () => {
 const q = urlSearch || searchQuery;
 const res = await fetch(`/api/news/search?q=${encodeURIComponent(q)}&limit=30`);
 if (!res.ok) throw new Error("Failed to search news");
 return res.json();
 },
 enabled: activeFilter !== "conferences" && !!(urlSearch || searchQuery) && (urlSearch || searchQuery).length >= 2,
 });

 const handleSearch = (e: React.FormEvent) => {
 e.preventDefault();
 setCurrentPage(1);
 };

 const getArticles = (): NewsItem[] => {
 if (urlSearch || searchQuery) {
 return searchData?.results || [];
 }
 
 if (!newsData) return [];
 
 if ('articles' in newsData) {
 return newsData.articles;
 }
 
 return [];
 };

 const allArticles = getArticles();
 const totalPages = Math.ceil(allArticles.length / ARTICLES_PER_PAGE);

 const handleFilterChange = (filter: string) => {
 setActiveFilter(filter);
 setCurrentPage(1);
 setSearchQuery("");
 };

 const getPaginatedArticles = () => {
 const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
 const endIndex = startIndex + ARTICLES_PER_PAGE;
 return allArticles.slice(startIndex, endIndex);
 };

 const displayedArticles = getPaginatedArticles();
 const isEventsView = activeFilter === "conferences";
 const events = eventsData?.events || [];
 
 // Only show loading for the view that's actually rendering
 const showLoading = isEventsView 
 ? eventsLoading 
 : isLoading || (searchQuery && searchLoading);
 
 const lastUpdated = newsData && 'lastUpdated' in newsData ? newsData.lastUpdated : null;

 return (
 <div className="min-h-screen">
 <Navigation />
 {/* Hero Section with Background Image */}
 <section className="relative text-white overflow-hidden">
 <div 
 className="absolute inset-0 bg-cover bg-center bg-no-repeat"
 style={{ backgroundImage: `url(${imgSrc(newsBannerImage)})` }}
 />
 <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
 <div className="relative container mx-auto px-4 py-12 sm:py-16 md:py-24">
 <FadeIn 
 className="max-w-2xl"
 >
 <FadeIn 
 className="inline-flex items-center gap-2 bg-red-600/90 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6"
 >
 <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
 <span className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wide">News & Insights</span>
 <LiveNewsIndicator />
 </FadeIn>
 <h1 
 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-lg"
 >
 News & Insights
 </h1>
 <p 
 className="text-base sm:text-xl md:text-2xl text-white/90 leading-relaxed drop-shadow-md"
 >
 Expert cybersecurity analysis, threat intelligence, AI safety insights, and learning opportunities curated for families.
 </p>
 </FadeIn>
 </div>
 </section>

 <div className="container mx-auto px-4 py-8">
 {/* Search Bar - hidden for events view */}
 {!isEventsView && (
 <form onSubmit={handleSearch} className="relative mb-6">
 <Input
 type="text"
 placeholder="Search scam alerts, breaches, safety news..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="pl-10 pr-24 py-3 text-lg"
 data-testid="input-search"
 />
 <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
 <Button
 type="submit"
 className="absolute right-2 top-1.5"
 size="sm"
 data-testid="button-search"
 >
 Search
 </Button>
 </form>
 )}

 {/* Filters and Stats */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
 <NewsFilter activeFilter={activeFilter} onFilterChange={handleFilterChange} />
 <div className="flex items-center gap-4 text-sm text-muted-foreground">
 {lastUpdated && !isEventsView && (
 <span className="flex items-center gap-1">
 <RefreshCw className="h-3.5 w-3.5" />
 Updated {formatTimeAgo(lastUpdated)}
 </span>
 )}
 <span>
 {isEventsView ? `${events.length} upcoming events` : `${allArticles.length} articles`}
 {!isEventsView && totalPages > 1 && ` • Page ${currentPage}/${totalPages}`}
 </span>
 </div>
 </div>

 {/* Results */}
 {showLoading ? (
 <FadeIn 
 className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
 >
 {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
 <Card key={i} className="animate-pulse">
 <CardContent className="p-5">
 <div className="h-40 bg-muted rounded mb-3"></div>
 <div className="h-5 bg-muted rounded mb-2"></div>
 <div className="h-5 bg-muted rounded w-3/4 mb-3"></div>
 <div className="h-4 bg-muted rounded mb-4"></div>
 <div className="h-3 bg-muted rounded w-1/2"></div>
 </CardContent>
 </Card>
 ))}
 </FadeIn>
 ) : isEventsView ? (
 events.length > 0 ? (
 <FadeIn 
 className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
 >
 {events.map((event) => (
 <EventCard key={event.id} event={event} />
 ))}
 </FadeIn>
 ) : (
 <div className="text-center py-16">
 <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
 <h3 className="text-xl font-semibold mb-2">No Upcoming Events</h3>
 <p className="text-muted-foreground">Check back soon for upcoming tech conferences and events.</p>
 </div>
 )
 ) : displayedArticles.length > 0 ? (
 <>
 <FadeIn 
 className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
 >
 {displayedArticles.map((article) => (
 <NewsCard key={article.id} article={article} />
 ))}
 </FadeIn>

 {/* Pagination */}
 {totalPages > 1 && (
 <div className="flex justify-center items-center space-x-4 mt-10">
 <Button
 variant="outline"
 size="sm"
 onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
 disabled={currentPage === 1}
 className="flex items-center gap-2"
 data-testid="button-prev-page"
 >
 <ChevronLeft className="h-4 w-4" />
 Previous
 </Button>
 
 <div className="flex items-center space-x-2">
 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
 let pageNum;
 if (totalPages <= 5) {
 pageNum = i + 1;
 } else if (currentPage <= 3) {
 pageNum = i + 1;
 } else if (currentPage >= totalPages - 2) {
 pageNum = totalPages - 4 + i;
 } else {
 pageNum = currentPage - 2 + i;
 }
 
 return (
 <Button
 key={pageNum}
 variant={currentPage === pageNum ? "default" : "outline"}
 size="sm"
 onClick={() => setCurrentPage(pageNum)}
 className="w-10 h-10"
 data-testid={`button-page-${pageNum}`}
 >
 {pageNum}
 </Button>
 );
 })}
 </div>

 <Button
 variant="outline"
 size="sm"
 onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
 disabled={currentPage === totalPages}
 className="flex items-center gap-2"
 data-testid="button-next-page"
 >
 Next
 <ChevronRight className="h-4 w-4" />
 </Button>
 </div>
 )}
 </>
 ) : (
 <Card>
 <CardContent className="p-12 text-center">
 <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
 <h3 className="text-xl font-semibold mb-2">No Articles Found</h3>
 <p className="text-muted-foreground mb-4">
 {searchQuery || urlSearch 
 ? `No articles found matching "${searchQuery || urlSearch}". Try different keywords.`
 : "No articles available in this category at the moment. Try refreshing or selecting a different category."
 }
 </p>
 <div className="flex justify-center gap-3">
 {(searchQuery || urlSearch) && (
 <Button
 onClick={() => {
 setSearchQuery("");
 window.history.pushState({}, '', '/news');
 }}
 variant="outline"
 data-testid="button-clear-search"
 >
 Clear Search
 </Button>
 )}
 <Button
 onClick={() => refetch()}
 variant="default"
 className="flex items-center gap-2"
 data-testid="button-refresh"
 >
 <RefreshCw className="h-4 w-4" />
 Refresh
 </Button>
 </div>
 </CardContent>
 </Card>
 )}

 {!isEventsView && (
 <div className="mt-12 pt-8 border-t">
 <NewsPageGuidesSidebar />
 </div>
 )}
 </div>
 <Footer />
 </div>
 );
}
