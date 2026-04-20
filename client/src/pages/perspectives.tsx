"use client";

import { useQuery } from "@tanstack/react-query";
import { Link } from "@/lib/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Compass, FileText } from "lucide-react";

type CuratedArticle = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  curatedTopic: string | null;
  publishedAt: string | null;
  excerpt?: string | null;
  whatChanged: string | null;
  whyThisMatters: string[] | null;
  actionThisWeek: { label: string; href: string } | null;
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export default function Perspectives() {
  const { data, isLoading } = useQuery<{ articles: CuratedArticle[] }>({
    queryKey: ["/api/news/curated"],
  });

  const articles = (data?.articles || []).slice().sort((a, b) => {
    const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return tb - ta;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main-content" role="main" tabIndex={-1}>
        <section className="bg-hero">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1 mb-5">
              <Compass className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-hero-foreground/80">Perspectives</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-hero-foreground leading-tight mb-5" data-testid="text-perspectives-heading">
              The hard questions families are facing right now.
            </h1>
            <p className="text-lg sm:text-xl text-hero-foreground/80 leading-relaxed max-w-3xl">
              Long-form editorial from the GetCyberRight team on the tradeoffs, shifts, and new realities that the old playbook does not cover.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-background">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
            {isLoading && (
              <div className="text-muted-foreground text-center py-16" data-testid="status-perspectives-loading">
                Loading perspectives...
              </div>
            )}

            {!isLoading && articles.length === 0 && (
              <div className="text-muted-foreground text-center py-16" data-testid="status-perspectives-empty">
                No perspectives published yet. Check back soon.
              </div>
            )}

            {!isLoading && articles.length > 0 && (
              <div className="space-y-6">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className="group block rounded-2xl border border-border bg-card p-6 sm:p-8 hover:border-primary/40 hover:shadow-md transition-all"
                    data-testid={`card-perspective-${article.slug}`}
                  >
                    <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                      <FileText className="w-4 h-4" />
                      <span>{formatDate(article.publishedAt)}</span>
                      {article.curatedTopic && (
                        <Badge variant="secondary" className="text-[10px]">{article.curatedTopic}</Badge>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h2>
                    {article.whatChanged && (
                      <p className="text-base text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {article.whatChanged}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      Read the full piece
                      <ArrowRight className="w-4 h-4 cta-arrow-right" />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
