import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ExternalLink, Newspaper, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  category: string;
  thumbnailUrl?: string;
}

// Decode HTML entities in text (e.g., &#8216; -> ')
function decodeHtmlEntities(text: string): string {
  if (!text) return text;
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
  };
  
  return text
    .replace(/&(amp|lt|gt|quot|apos|nbsp|#39);/g, (match) => entities[match] || match)
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

const categoryColors: Record<string, string> = {
  cybersecurity: "bg-red-500",
  ai: "bg-purple-500",
  tech: "bg-blue-500",
  conferences: "bg-green-500",
};

const defaultThumbnails = [
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop",
];

export function LiveNewsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { data: newsData, isLoading } = useQuery<{ articles: NewsItem[] }>({
    queryKey: ["/api/news/latest"],
    refetchInterval: 60000,
  });

  const articles = newsData?.articles?.slice(0, 12) || [];

  useEffect(() => {
    if (isPaused || articles.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, articles.length - 3));
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, articles.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(articles.length - 4, prev + 1));
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

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

  if (isLoading) {
    return (
      <section className="py-12 bg-slate-900 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white font-semibold">Loading Live News Feed...</span>
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[280px] bg-slate-800 rounded-xl overflow-hidden">
                <Skeleton className="h-40 w-full bg-slate-700" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-full bg-slate-700" />
                  <Skeleton className="h-3 w-2/3 bg-slate-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="py-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></div>
            </div>
            <Newspaper className="h-5 w-5 text-cyan-400" />
            <span className="text-white font-bold text-lg">Live Cyber News Feed</span>
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
              {articles.length} Stories
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="text-white hover:bg-white/10 disabled:opacity-30"
              data-testid="button-news-prev"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex >= articles.length - 4}
              className="text-white hover:bg-white/10 disabled:opacity-30"
              data-testid="button-news-next"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <motion.div 
            className="flex gap-4"
            animate={{ x: -currentIndex * 296 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <AnimatePresence mode="popLayout">
              {articles.map((article, index) => (
                <motion.a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[280px] group cursor-pointer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  data-testid={`news-card-${index}`}
                >
                  <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1">
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={article.thumbnailUrl || defaultThumbnails[index % defaultThumbnails.length]}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = defaultThumbnails[index % defaultThumbnails.length];
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
                      
                      <div className="absolute top-3 left-3">
                        <Badge className={`${categoryColors[article.category] || 'bg-slate-500'} text-white text-xs`}>
                          {article.category}
                        </Badge>
                      </div>
                      
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-3 group-hover:text-cyan-300 transition-colors">
                        {decodeHtmlEntities(article.title)}
                      </h3>
                      
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="truncate max-w-[120px]">{article.source}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{getTimeAgo(article.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </AnimatePresence>
          </motion.div>
          
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-900 to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none"></div>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(articles.length / 4) }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(i * 4);
                setIsPaused(true);
                setTimeout(() => setIsPaused(false), 8000);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                Math.floor(currentIndex / 4) === i 
                  ? 'bg-cyan-400 w-6' 
                  : 'bg-slate-600 hover:bg-slate-500'
              }`}
              data-testid={`news-dot-${i}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
