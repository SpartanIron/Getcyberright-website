import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, ExternalLink, Shield, AlertTriangle, Loader2 } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { renderMarkdown } from "@/lib/markdown";

interface NewsArticleData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string | null;
  category: string;
  source: string;
  sourceUrl: string;
  originalTitle: string | null;
  imageUrl: string | null;
  urgencyLevel: number;
  relatedToolUrl: string | null;
  relatedToolName: string | null;
  publishedAt: string;
  readTime: number;
}

function getCategoryColor(category: string): string {
  switch (category) {
    case "Cybersecurity": return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
    case "AI": return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
    case "Tech": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    default: return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
  }
}

function getUrgencyBadge(level: number) {
  if (level >= 4) return { label: "Breaking", className: "bg-red-600 text-white" };
  if (level >= 3) return { label: "Important", className: "bg-amber-500 text-white" };
  return null;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NewsArticlePage() {
  const [, params] = useRoute("/news/:slug");
  const slug = params?.slug;

  const { data: article, isLoading, error } = useQuery<NewsArticleData>({
    queryKey: ["/api/news/article", slug],
    queryFn: async () => {
      const res = await fetch(`/api/news/article/${slug}`);
      if (!res.ok) throw new Error("Article not found");
      return res.json();
    },
    enabled: !!slug,
  });

  const { data: latestArticles } = useQuery<NewsArticleData[]>({
    queryKey: ["/api/news/latest-fallback"],
    queryFn: async () => {
      const res = await fetch("/api/news/latest?limit=4");
      if (!res.ok) return [];
      const data = await res.json();
      return data.articles || [];
    },
    enabled: !!(error || (!isLoading && !article)),
  });

  useSEO({
    title: article ? `${article.title} | GetCyberRight News` : "News | GetCyberRight",
    description: article?.excerpt || "Cybersecurity news simplified for families",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex items-center justify-center flex-1 py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex flex-col items-center justify-center flex-1 py-16 gap-6 px-4">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h1 className="text-2xl font-bold mb-2" data-testid="text-not-found">Article No Longer Available</h1>
            <p className="text-muted-foreground">This article may have been updated or replaced with newer content. Check out the latest cybersecurity news below.</p>
          </div>
          {latestArticles && latestArticles.length > 0 && (
            <div className="w-full max-w-2xl space-y-3">
              <h2 className="text-lg font-semibold text-center" data-testid="text-latest-heading">Latest News</h2>
              {latestArticles.map((a) => (
                <Link key={a.id} href={`/news/${a.slug}`}>
                  <Card className="hover:border-primary/30 transition-colors cursor-pointer" data-testid={`card-fallback-article-${a.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-2">{a.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{a.excerpt}</p>
                        </div>
                        <Badge variant="outline" className={`${getCategoryColor(a.category)} shrink-0 text-xs`}>{a.category}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          <Link href="/news">
            <Button variant="outline" data-testid="link-back-to-news">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Browse All News
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const urgencyBadge = getUrgencyBadge(article.urgencyLevel);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Link href="/news">
              <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground" data-testid="link-back-to-news">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to News
              </Button>
            </Link>
          </motion.div>

          {article.imageUrl && (
            <motion.div variants={fadeInUp} className="mb-6 -mx-4 sm:mx-0">
              <div className="relative h-56 sm:h-72 md:h-80 overflow-hidden rounded-none sm:rounded-xl">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="outline" className={getCategoryColor(article.category)} data-testid="badge-category">
                {article.category}
              </Badge>
              {urgencyBadge && (
                <Badge className={urgencyBadge.className} data-testid="badge-urgency">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {urgencyBadge.label}
                </Badge>
              )}
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {article.readTime} min read
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" data-testid="text-article-title">
              {article.title}
            </h1>

            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
              <span data-testid="text-article-date">{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span data-testid="text-article-source">Source: {article.source}</span>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-article-excerpt">
              {article.excerpt}
            </p>
          </motion.div>

          {article.content && (
            <motion.div variants={fadeInUp}>
              <Card className="mb-8">
                <CardContent className="p-6 md:p-8">
                  <div
                    className="prose dark:prose-invert max-w-none text-base leading-relaxed"
                    data-testid="text-article-content"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="space-y-4">
            {article.relatedToolUrl && article.relatedToolName && (
              <Card className="border-[var(--cyber-blue)]/30 bg-[var(--cyber-blue)]/5">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-[var(--cyber-blue)] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm mb-1">Protect Yourself</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        Use our {article.relatedToolName} to check if you're affected and take action.
                      </p>
                      <Link href={article.relatedToolUrl.replace("https://www.getcyberright.com", "")}>
                        <Button size="sm" data-testid="link-related-tool">
                          Open {article.relatedToolName}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Curated from trusted cybersecurity sources, simplified by Dezi AI
              </p>
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--cyber-blue)] hover:underline flex items-center gap-1"
                data-testid="link-original-source"
              >
                Read original
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
