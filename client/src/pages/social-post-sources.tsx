"use client";

import { useParams, Link } from "@/lib/navigation";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Loader2, ShieldCheck, Calendar } from "lucide-react";

interface SourceCitation {
  name: string;
  publisher: string;
  url: string;
  datePublished?: string | null;
  accessedAt?: string | null;
}

interface SourcesPanel {
  id: string;
  title: string;
  platform: string;
  contentType: string;
  publishedAt: string | null;
  citations: SourceCitation[];
}

const PLATFORM_LABEL: Record<string, string> = {
  linkedin: "LinkedIn",
  facebook: "Facebook",
  x: "X (Twitter)",
  instagram: "Instagram",
  alert: "Alert",
};

function formatDate(value?: string | null): string | null {
  if (!value) return null;
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return null;
  return dt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function SocialPostSourcesPage() {
  const params = useParams<{ id: string }>();
  const postId = params?.id;

  const { data, isLoading, isError, error } = useQuery<SourcesPanel>({
    queryKey: ["/api/social/posts", postId, "sources"],
    enabled: !!postId,
    retry: false,
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl" data-testid="page-social-post-sources">
        <Link
          to="/awareness-hub"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          data-testid="link-back"
        >
          <ArrowLeft className="w-4 h-4" /> Back to GetCyberRight
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">
            Sources for this post
          </h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Every claim in this post is backed by an independently verifiable source. Below are the
          publishers, articles, and publication dates we relied on.
        </p>

        {isLoading && (
          <div
            className="flex items-center justify-center py-24 text-muted-foreground"
            data-testid="status-loading"
          >
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading sources…
          </div>
        )}

        {isError && (
          <Card data-testid="status-not-found">
            <CardContent className="py-12 text-center">
              <h2 className="text-xl font-semibold mb-2">Sources not available</h2>
              <p className="text-muted-foreground mb-4">
                {(error as any)?.message?.includes("404") || (error as any)?.status === 404
                  ? "This post may not be published yet, or the link is incorrect."
                  : "We couldn't load the sources for this post. Please try again later."}
              </p>
              <Link
                to="/awareness-hub"
                className="text-primary hover:underline inline-flex items-center gap-1"
                data-testid="link-home"
              >
                Visit GetCyberRight <ExternalLink className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>
        )}

        {data && (
          <>
            <Card className="mb-8" data-testid="card-post-meta">
              <CardContent className="py-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="secondary" data-testid="badge-platform">
                    {PLATFORM_LABEL[data.platform] || data.platform}
                  </Badge>
                  <Badge variant="outline" data-testid="badge-content-type">
                    {data.contentType.replace(/_/g, " ")}
                  </Badge>
                  {formatDate(data.publishedAt) && (
                    <span
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground"
                      data-testid="text-published-at"
                    >
                      <Calendar className="w-4 h-4" /> Published {formatDate(data.publishedAt)}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-semibold" data-testid="text-post-title">
                  {data.title}
                </h2>
              </CardContent>
            </Card>

            {data.citations.length === 0 ? (
              <Card data-testid="status-no-citations">
                <CardContent className="py-10 text-center text-muted-foreground">
                  No external citations were attached to this post.
                </CardContent>
              </Card>
            ) : (
              <ol className="space-y-4" data-testid="list-citations">
                {data.citations.map((c, idx) => {
                  const dateLabel = formatDate(c.datePublished);
                  const accessedLabel = formatDate(c.accessedAt);
                  return (
                    <li key={`${c.url}-${idx}`}>
                      <Card data-testid={`card-citation-${idx}`}>
                        <CardContent className="py-5">
                          <div className="flex items-start gap-3">
                            <span className="text-sm font-mono text-muted-foreground mt-1">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <div className="flex-1 min-w-0">
                              {c.publisher && (
                                <div
                                  className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1"
                                  data-testid={`text-publisher-${idx}`}
                                >
                                  {c.publisher}
                                </div>
                              )}
                              <a
                                href={c.url}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                className="text-base font-semibold text-foreground hover:text-primary inline-flex items-start gap-1 break-words"
                                data-testid={`link-citation-${idx}`}
                              >
                                {c.name || c.url}
                                <ExternalLink className="w-4 h-4 shrink-0 mt-1" />
                              </a>
                              <div className="text-xs text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1">
                                {dateLabel && (
                                  <span data-testid={`text-date-published-${idx}`}>
                                    Published: {dateLabel}
                                  </span>
                                )}
                                {accessedLabel && (
                                  <span data-testid={`text-accessed-at-${idx}`}>
                                    Accessed: {accessedLabel}
                                  </span>
                                )}
                                <span
                                  className="break-all opacity-70"
                                  data-testid={`text-url-${idx}`}
                                >
                                  {c.url}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  );
                })}
              </ol>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
