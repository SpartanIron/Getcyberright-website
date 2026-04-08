"use client";

import { useState, useEffect } from "react";
import { useLocation, Link } from "@/lib/navigation";
import { useQuery } from "@tanstack/react-query";
import { FadeIn } from "@/components/fade-in";
import { SignupEncouragementBanner } from "@/components/signup-encouragement-banner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
 Search, 
 FileText, 
 Newspaper, 
 ArrowRight,
 ExternalLink,
 Calendar
} from "lucide-react";
import { useSEO } from "@/hooks/use-seo";

interface SearchResult {
 title: string;
 description: string;
 url: string;
 category: string;
 type: "page" | "article";
 publishedAt?: string;
 source?: string;
}

interface SearchResponse {
 query: string;
 results: SearchResult[];
 count: number;
 breakdown: {
 pages: number;
 articles: number;
 };
}

export default function SearchPage() {
 const [location, navigate] = useLocation();
 const searchParams = new URLSearchParams(location.split("?")[1] || "");
 const initialQuery = searchParams.get("q") || "";
 const [searchQuery, setSearchQuery] = useState(initialQuery);
 const [submittedQuery, setSubmittedQuery] = useState(initialQuery);

 useSEO({
 title: submittedQuery ? `Search: ${submittedQuery} - GetCyberRight` : "Search - GetCyberRight",
 description: "Search GetCyberRight for cybersecurity resources, safety guides, news, and tools.",
 });

 const { data, isLoading, error } = useQuery<SearchResponse>({
 queryKey: ["/api/search", submittedQuery],
 enabled: submittedQuery.length >= 2,
 });

 useEffect(() => {
 if (initialQuery && initialQuery !== submittedQuery) {
 setSearchQuery(initialQuery);
 setSubmittedQuery(initialQuery);
 }
 }, [initialQuery]);

 const handleSearch = (e: React.FormEvent) => {
 e.preventDefault();
 if (searchQuery.trim().length >= 2) {
 setSubmittedQuery(searchQuery.trim());
 navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
 }
 };

 const getCategoryColor = (category: string) => {
 const colors: Record<string, string> = {
 Learn: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
 Tools: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
 Help: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
 News: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
 Company: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
 Legal: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
 Resources: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
 };
 return colors[category] || "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
 };

 return (
 <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
 <section className="py-12 md:py-16">
 <div className="container mx-auto px-4 max-w-4xl">
 <FadeIn
 className="text-center mb-8"
 >
 <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
 Search GetCyberRight
 </h1>
 <p className="text-slate-600 dark:text-slate-300">
 Find safety guides, tools, news, and resources
 </p>
 </FadeIn>

 <form
 onSubmit={handleSearch}
 className="mb-8"
 >
 <div className="flex gap-3">
 <div className="relative flex-1">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
 <Input
 type="search"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Search for scam tips, safety guides, tools..."
 className="pl-12 h-14 text-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
 aria-label="Search query"
 />
 </div>
 <Button 
 type="submit" 
 className="h-14 px-8 bg-teal-600 hover:bg-teal-700 text-white font-semibold"
 disabled={searchQuery.trim().length < 2}
 >
 Search
 </Button>
 </div>
 </form>

 {submittedQuery && (
 <FadeIn
 >
 {isLoading ? (
 <div className="space-y-4">
 {[1, 2, 3, 4].map((i) => (
 <Card key={i} className="bg-white dark:bg-slate-800/50">
 <CardContent className="p-6">
 <Skeleton className="h-6 w-3/4 mb-2" />
 <Skeleton className="h-4 w-full mb-2" />
 <Skeleton className="h-4 w-1/2" />
 </CardContent>
 </Card>
 ))}
 </div>
 ) : error ? (
 <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
 <CardContent className="p-6 text-center">
 <p className="text-red-600 dark:text-red-400">
 Something went wrong. Please try again.
 </p>
 </CardContent>
 </Card>
 ) : data && data.results.length > 0 ? (
 <>
 <div className="flex items-center justify-between mb-4">
 <p className="text-sm text-slate-600 dark:text-slate-400">
 Found {data.count} results for "{data.query}"
 </p>
 {data.breakdown && (
 <div className="flex gap-2 text-xs">
 <span className="text-slate-500">
 {data.breakdown.pages} pages
 </span>
 <span className="text-slate-400">|</span>
 <span className="text-slate-500">
 {data.breakdown.articles} articles
 </span>
 </div>
 )}
 </div>

 <div className="space-y-4" role="list" aria-label="Search results">
 {data.results.map((result, index) => (
 <FadeIn
 key={`${result.url}-${index}`}
 role="listitem"
 >
 {result.type === "page" ? (
 <Link to={result.url}>
 <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-600 transition-colors cursor-pointer group">
 <CardContent className="p-6">
 <div className="flex items-start gap-4">
 <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
 <FileText className="h-5 w-5 text-teal-600 dark:text-teal-400" />
 </div>
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-1">
 <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
 {result.title}
 </h3>
 <Badge className={getCategoryColor(result.category)}>
 {result.category}
 </Badge>
 </div>
 <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
 {result.description}
 </p>
 </div>
 <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-teal-600 transition-colors flex-shrink-0" />
 </div>
 </CardContent>
 </Card>
 </Link>
 ) : (
 <a href={result.url} target="_blank" rel="noopener noreferrer">
 <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors cursor-pointer group">
 <CardContent className="p-6">
 <div className="flex items-start gap-4">
 <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
 <Newspaper className="h-5 w-5 text-purple-600 dark:text-purple-400" />
 </div>
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-1 flex-wrap">
 <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
 {result.title}
 </h3>
 <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
 Article
 </Badge>
 </div>
 <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-2">
 {result.description}
 </p>
 <div className="flex items-center gap-3 text-xs text-slate-500">
 {result.source && (
 <span>{result.source}</span>
 )}
 {result.publishedAt && (
 <span className="flex items-center gap-1">
 <Calendar className="h-3 w-3" />
 {new Date(result.publishedAt).toLocaleDateString()}
 </span>
 )}
 </div>
 </div>
 <ExternalLink className="h-5 w-5 text-slate-400 group-hover:text-purple-600 transition-colors flex-shrink-0" />
 </div>
 </CardContent>
 </Card>
 </a>
 )}
 </FadeIn>
 ))}
 </div>
 </>
 ) : data && data.results.length === 0 ? (
 <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
 <CardContent className="p-8 text-center">
 <Search className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
 <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
 No results found
 </h3>
 <p className="text-slate-600 dark:text-slate-400 mb-4">
 We couldn't find anything matching "{data.query}"
 </p>
 <div className="text-sm text-slate-500">
 <p>Try:</p>
 <ul className="mt-2 space-y-1">
 <li>Using different keywords</li>
 <li>Checking your spelling</li>
 <li>Using more general terms</li>
 </ul>
 </div>
 </CardContent>
 </Card>
 ) : null}
 </FadeIn>
 )}

 {!submittedQuery && (
 <FadeIn
 className="text-center"
 >
 <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
 <CardContent className="p-8">
 <Search className="h-12 w-12 text-teal-500 mx-auto mb-4" />
 <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
 Start searching
 </h3>
 <p className="text-slate-600 dark:text-slate-400">
 Enter a search term to find safety guides, tools, and resources
 </p>
 </CardContent>
 </Card>
 </FadeIn>
 )}
 </div>
 </section>
 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
   <SignupEncouragementBanner toolName="search" show={true} contextMessage="Create a free account for full access to all tools" />
 </div>
 </div>
 );
}
