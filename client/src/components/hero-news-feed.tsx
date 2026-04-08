"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ExternalLink, Shield, Clock, Users, Baby, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  url: string;
  publishedAt: string;
  category: string;
  audienceTag?: string;
  thumbnailUrl?: string;
}

const audienceConfig: Record<string, { label: string; color: string; icon: string }> = {
  youth: { label: "Youth Alert", color: "bg-amber-500", icon: "🛡️" },
  senior: { label: "Senior Shield", color: "bg-emerald-500", icon: "👴" },
  all: { label: "All Users", color: "bg-cyan-500", icon: "🌐" },
};

const categoryColors: Record<string, string> = {
  cybersecurity: "bg-red-500",
  ai: "bg-purple-500",
  tech: "bg-blue-500",
  conferences: "bg-green-500",
  safety: "bg-orange-500",
};

const defaultThumbnails = [
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
];


export function HeroNewsFeed() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: newsData, isLoading } = useQuery<{ articles: NewsItem[]; status?: string }>({
    queryKey: ["/api/news/safety"],
    refetchInterval: (query) => {
      // Refetch more frequently if no articles yet (cold start)
      const hasArticles = query.state.data?.articles && query.state.data.articles.length > 0;
      return hasArticles ? 60000 : 5000; // 5s when loading, 60s when loaded
    },
  });

  // Use live articles from the API
  const articles = newsData?.articles?.slice(0, 8) || [];
  const isServerLoading = newsData?.status === "loading";

  useEffect(() => {
    if (articles.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [articles.length]);

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Only show loading on initial load - use skeleton for better UX
  if (isLoading && articles.length === 0 && !newsData) {
    return (
      <div className="w-full h-full min-h-[320px] rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 overflow-hidden">
        <div className="relative h-full">
          <Skeleton className="absolute inset-0 bg-slate-700/50" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="space-y-3">
              <Skeleton className="h-4 w-20 bg-slate-600/50" />
              <Skeleton className="h-6 w-3/4 bg-slate-600/50" />
              <Skeleton className="h-6 w-1/2 bg-slate-600/50" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-4 w-24 bg-slate-600/50" />
                <Skeleton className="h-4 w-16 bg-slate-600/50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentArticle = articles[currentIndex];

  // Show loading state if no articles available yet (cold start in production)
  if (!currentArticle) {
    return (
      <div className="w-full h-full min-h-[320px] rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-10 w-10 text-cyan-400 mx-auto mb-3 animate-pulse" />
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-300 text-sm font-medium">Fetching live safety alerts...</p>
          <p className="text-slate-500 text-xs mt-1">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping opacity-75"></div>
        </div>
        <Shield className="h-5 w-5 text-cyan-400" />
        <span className="text-white font-semibold">Live Safety Alerts</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.a
          key={currentArticle.id}
          href={currentArticle.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          data-testid="hero-news-main"
        >
          <div className="relative bg-slate-800/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20">
            <div className="relative h-48 md:h-56 overflow-hidden">
              <motion.img 
                src={currentArticle.thumbnailUrl || defaultThumbnails[currentIndex % defaultThumbnails.length]}
                alt={currentArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultThumbnails[currentIndex % defaultThumbnails.length];
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
              
              <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
                {currentArticle.audienceTag && audienceConfig[currentArticle.audienceTag] && (
                  <Badge className={`${audienceConfig[currentArticle.audienceTag].color} text-white text-xs px-2 py-0.5 font-medium`}>
                    {audienceConfig[currentArticle.audienceTag].icon} {audienceConfig[currentArticle.audienceTag].label}
                  </Badge>
                )}
                <span className="text-xs text-white/80 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full">
                  <Clock className="h-3 w-3" />
                  {getTimeAgo(currentArticle.publishedAt)}
                </span>
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="text-white text-lg md:text-xl font-semibold leading-tight line-clamp-2 group-hover:text-cyan-300 transition-colors mb-2">
                {currentArticle.title}
              </h3>
              
              {currentArticle.excerpt && (
                <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                  {currentArticle.excerpt}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{currentArticle.source}</span>
                <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>
            </div>
          </div>
        </motion.a>
      </AnimatePresence>

      <div className="flex justify-center gap-2 mt-4">
        {articles.map((_: NewsItem, i: number) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentIndex 
                ? 'bg-cyan-400 w-6' 
                : 'bg-slate-600 w-2 hover:bg-slate-500'
            }`}
            data-testid={`hero-news-dot-${i}`}
          />
        ))}
      </div>
    </div>
  );
}
