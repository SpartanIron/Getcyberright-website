"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, Link } from "@/lib/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft, Clock, ExternalLink, Shield, AlertTriangle, Loader2, User,
  Tag, CheckCircle2, MessageSquare, Send, Trash2, Mail, Facebook, Linkedin, Link2, Check,
  ChevronRight, Home, Sparkles,
} from "lucide-react";
import { SiX, SiReddit, SiWhatsapp, SiFlipboard } from "react-icons/si";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { FadeIn } from "@/components/fade-in";
import AdSlot from "@/components/ad-slot";
import { SEOHead } from "@/components/seo-head";
import { renderMarkdown } from "@/lib/markdown";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { EditorialSpine } from "@/components/editorial-spine";

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  imageUrl: string | null;
  publishedAt: string;
  readTime: number;
}

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
  author: string | null;
  authorRole: string | null;
  authorAvatarUrl: string | null;
  tags: string[];
  keyTakeaways: string[];
  articleType: "curated" | "aggregated";
  curatedTopic: string | null;
  whatChanged?: string | null;
  whyThisMatters?: string[] | null;
  actionThisWeek?: { label: string; href: string } | null;
  editorialSpinePending?: boolean;
  publishedAt: string;
  updatedAt: string | null;
  readTime: number;
  relatedArticles: RelatedArticle[];
}

interface CommentItem {
  id: string;
  userId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  Cybersecurity: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1600&h=900&fit=crop&q=85",
  AI: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&h=900&fit=crop&q=85",
  Tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&h=900&fit=crop&q=85",
  Learning: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&h=900&fit=crop&q=85",
  "Action Needed": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&h=900&fit=crop&q=85",
};
const DEFAULT_HERO = "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1600&h=900&fit=crop&q=85";

function getHeroImage(article: { imageUrl: string | null; category: string; title: string }): string {
  if (article.imageUrl) return article.imageUrl;
  return CATEGORY_FALLBACK_IMAGES[article.category] || DEFAULT_HERO;
}

function getCategoryColor(category: string): string {
  switch (category) {
    case "Cybersecurity": return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
    case "AI": return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
    case "Tech": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    case "Learning": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
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
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

function formatRelative(dateString: string): string {
  const d = new Date(dateString);
  const diff = Date.now() - d.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString();
}

function getInitials(name: string): string {
  return name.split(" ").filter(Boolean).slice(0, 2).map(n => n[0]?.toUpperCase()).join("");
}

function getShareButtons(title: string, url: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  return [
    { name: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, color: "hover:bg-blue-600 hover:text-white" },
    { name: "X", icon: SiX, href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, color: "hover:bg-black hover:text-white" },
    { name: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, color: "hover:bg-blue-700 hover:text-white" },
    { name: "Reddit", icon: SiReddit, href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`, color: "hover:bg-orange-600 hover:text-white" },
    { name: "Flipboard", icon: SiFlipboard, href: `https://share.flipboard.com/bookmarklet/popout?v=2&title=${encodedTitle}&url=${encodedUrl}`, color: "hover:bg-red-600 hover:text-white" },
    { name: "WhatsApp", icon: SiWhatsapp, href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, color: "hover:bg-green-600 hover:text-white" },
    { name: "Email", icon: Mail, href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`, color: "hover:bg-slate-700 hover:text-white" },
  ];
}

function ShareBar({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  const buttons = getShareButtons(title, url);

  return (
    <div className="flex items-center gap-2 flex-wrap" data-testid="share-bar">
      <span className="text-xs font-medium text-muted-foreground mr-1">Share:</span>
      {buttons.map(b => (
        <a
          key={b.name}
          href={b.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${b.name}`}
          className={`w-8 h-8 inline-flex items-center justify-center rounded-full border border-border text-muted-foreground transition-colors ${b.color}`}
          data-testid={`share-${b.name.toLowerCase()}`}
        >
          <b.icon className="h-3.5 w-3.5" />
        </a>
      ))}
      <button
        onClick={handleCopy}
        aria-label="Copy link"
        className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-primary hover:text-white transition-colors"
        data-testid="share-copy-link"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

function StickyShareSidebar({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  const buttons = getShareButtons(title, url);

  return (
    <aside
      className="hidden 2xl:flex fixed left-[max(1rem,calc((100vw-72rem)/2-5rem))] top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-2 p-2 rounded-full border border-border bg-background/80 backdrop-blur-sm shadow-sm"
      aria-label="Share this article"
      data-testid="sticky-share-sidebar"
    >
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1 pt-1">Share</span>
      {buttons.map(b => (
        <a
          key={b.name}
          href={b.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${b.name}`}
          className={`w-9 h-9 inline-flex items-center justify-center rounded-full border border-border text-muted-foreground transition-colors ${b.color}`}
          data-testid={`sticky-share-${b.name.toLowerCase()}`}
        >
          <b.icon className="h-4 w-4" />
        </a>
      ))}
      <button
        onClick={handleCopy}
        aria-label="Copy link"
        className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-primary hover:text-white transition-colors"
        data-testid="sticky-share-copy-link"
      >
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </button>
    </aside>
  );
}

function NewsletterInline({
  title = "Stay one step ahead of scammers",
  description = "Weekly cybersecurity briefings for families. No spam, just the threats that matter and what to do about them.",
  testIdSuffix = "inline",
}: { title?: string; description?: string; testIdSuffix?: string } = {}) {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: async (e: string) => apiRequest("POST", "/api/newsletter/subscribe", { email: e }),
    onSuccess: () => {
      toast({ title: "Subscribed", description: "You're on the list. Watch your inbox for the next briefing." });
      setEmail("");
    },
    onError: (err: any) => {
      toast({ title: "Subscription failed", description: err?.message || "Please try again.", variant: "destructive" });
    },
  });
  return (
    <Card className="my-8 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent" data-testid={`newsletter-${testIdSuffix}`}>
      <CardContent className="p-6 sm:p-7">
        <div className="flex items-start gap-3 mb-3">
          <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-base mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); if (email && /\S+@\S+\.\S+/.test(email)) mutation.mutate(email); }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
            data-testid={`input-newsletter-${testIdSuffix}`}
          />
          <Button type="submit" disabled={mutation.isPending} data-testid={`button-newsletter-${testIdSuffix}`}>
            {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function CommentsSection({ slug }: { slug: string }) {
  const [content, setContent] = useState("");
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: meData } = useQuery<any>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });
  const me = meData?.user || meData || null;
  const myUserId = me?.id || null;
  const isAdmin = !!me?.isAdmin;

  const { data, isLoading } = useQuery<{ comments: CommentItem[] }>({
    queryKey: ["/api/news/article", slug, "comments"],
    queryFn: async () => {
      const res = await fetch(`/api/news/article/${slug}/comments`);
      if (!res.ok) throw new Error("Failed to load comments");
      return res.json();
    },
  });

  const postMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await apiRequest("POST", `/api/news/article/${slug}/comments`, { content: text });
      return res.json();
    },
    onSuccess: () => {
      setContent("");
      qc.invalidateQueries({ queryKey: ["/api/news/article", slug, "comments"] });
      toast({ title: "Comment posted" });
    },
    onError: (err: any) => {
      toast({ title: "Couldn't post", description: err?.message || "Please try again.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/news/comments/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/news/article", slug, "comments"] });
    },
  });

  const comments = data?.comments || [];

  return (
    <Card className="mt-8" data-testid="comments-section">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="font-bold text-lg">Discussion</h2>
          <Badge variant="outline" className="ml-1">{comments.length}</Badge>
        </div>

        {me ? (
          <form
            onSubmit={(e) => { e.preventDefault(); if (content.trim().length >= 2) postMutation.mutate(content.trim()); }}
            className="mb-6"
          >
            <Textarea
              placeholder="Share your thoughts. Be respectful and on-topic."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={2000}
              rows={3}
              className="mb-2"
              data-testid="textarea-comment"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{content.length}/2000</span>
              <Button
                type="submit"
                size="sm"
                disabled={postMutation.isPending || content.trim().length < 2}
                data-testid="button-post-comment"
              >
                {postMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-3.5 w-3.5 mr-1.5" />Post</>}
              </Button>
            </div>
          </form>
        ) : (
          <div className="bg-muted/40 border border-border rounded-lg p-4 mb-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Sign in to join the discussion.</p>
            <Link href="/login">
              <Button size="sm" variant="outline" data-testid="link-comment-login">Sign in to comment</Button>
            </Link>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No comments yet. Be the first to share your perspective.</p>
        ) : (
          <div className="space-y-4">
            {comments.map(c => (
              <div key={c.id} className="flex gap-3" data-testid={`comment-${c.id}`}>
                <Avatar className="w-9 h-9 flex-shrink-0">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                    {getInitials(c.authorName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold">{c.authorName}</span>
                    <span className="text-xs text-muted-foreground">{formatRelative(c.createdAt)}</span>
                    {(isAdmin || (myUserId && c.userId === myUserId)) && (
                      <button
                        onClick={() => deleteMutation.mutate(c.id)}
                        className="ml-auto text-muted-foreground hover:text-red-600 transition-colors"
                        aria-label="Delete comment"
                        data-testid={`delete-comment-${c.id}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function NewsArticlePage({ initialArticle }: { initialArticle?: NewsArticleData } = {}) {
  const [, params] = useRoute("/news/:slug");
  const slug = params?.slug || initialArticle?.slug;

  const { data: article, isLoading, error } = useQuery<NewsArticleData>({
    queryKey: ["/api/news/article", slug],
    queryFn: async () => {
      const res = await fetch(`/api/news/article/${slug}`);
      if (!res.ok) throw new Error("Article not found");
      return res.json();
    },
    enabled: !!slug,
    initialData: initialArticle && initialArticle.slug === slug ? initialArticle : undefined,
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

  const articleUrl = useMemo(() => {
    if (typeof window === "undefined" || !article) return "";
    return `${window.location.origin}/news/${article.slug}`;
  }, [article]);

  const contentParts = useMemo(() => {
    if (!article?.content) return { first: "", second: "" };
    const html = renderMarkdown(article.content);
    const split = html.split("</p>");
    if (split.length < 4) return { first: html, second: "" };
    const mid = Math.floor(split.length / 2);
    return { first: split.slice(0, mid).join("</p>") + "</p>", second: split.slice(mid).join("</p>") };
  }, [article?.content]);

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
              <h2 className="text-lg font-semibold text-center" data-testid="text-latest-heading">Latest News & Insights</h2>
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
              Browse All News & Insights
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const urgencyBadge = getUrgencyBadge(article.urgencyLevel);
  const heroImage = getHeroImage(article);
  const authorInitials = getInitials(article.author || "GCR");

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={article.title}
        description={article.excerpt || article.title}
        ogImage={`https://www.getcyberright.com/og/article/${article.slug}`}
        ogType="article"
        canonical={`https://www.getcyberright.com/news/${article.slug}`}
      />
      <Navigation />
      <StickyShareSidebar title={article.title} url={articleUrl} />
      <article className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        <FadeIn>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center text-xs sm:text-sm text-muted-foreground mb-4 flex-wrap"
            data-testid="breadcrumbs"
          >
            <Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors" data-testid="breadcrumb-home">
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-3.5 w-3.5 mx-1.5 flex-shrink-0" aria-hidden />
            <Link href="/news" className="hover:text-foreground transition-colors" data-testid="breadcrumb-news">
              News &amp; Insights
            </Link>
            <ChevronRight className="h-3.5 w-3.5 mx-1.5 flex-shrink-0" aria-hidden />
            <span className="text-foreground font-medium truncate max-w-[16rem] sm:max-w-md" data-testid="breadcrumb-current">
              {article.title}
            </span>
          </nav>
          <Link href="/news">
            <Button variant="ghost" className="mb-4 text-muted-foreground hover:text-foreground -ml-2" data-testid="link-back-to-news">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News &amp; Insights
            </Button>
          </Link>
        </FadeIn>

        <FadeIn className="mb-6 -mx-4 sm:mx-0">
          <div className="relative h-56 sm:h-80 md:h-96 overflow-hidden rounded-none sm:rounded-2xl bg-muted">
            <img
              src={heroImage}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = DEFAULT_HERO; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2">
              <Badge className={`${getCategoryColor(article.category)} backdrop-blur-sm bg-white/90 dark:bg-black/70 border`}>
                {article.category}
              </Badge>
              {urgencyBadge && (
                <Badge className={`${urgencyBadge.className} shadow-lg`}>
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {urgencyBadge.label}
                </Badge>
              )}
              <Badge
                className="backdrop-blur-sm bg-white/90 dark:bg-black/70 border text-foreground font-semibold uppercase tracking-wide text-[11px]"
                data-testid="badge-readtime-hero"
              >
                <Clock className="h-3 w-3 mr-1" />
                {article.readTime} min read
              </Badge>
            </div>
          </div>
        </FadeIn>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8" data-testid="article-layout">
          <div className="lg:col-span-2 min-w-0">

        <FadeIn className="mb-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight tracking-tight" data-testid="text-article-title">
            {article.title}
          </h1>

          <p
            className="text-xl md:text-2xl font-semibold italic leading-relaxed mb-5 text-foreground/90 border-l-4 border-primary pl-4 py-1"
            data-testid="text-article-excerpt"
          >
            {article.excerpt}
          </p>

          {article.articleType === "aggregated" && (() => {
            let domain: string | null = null;
            try { domain = new URL(article.sourceUrl).hostname.replace(/^www\./, ""); } catch { domain = null; }
            return (
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 mb-4 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-teal-500 dark:hover:border-teal-400 transition-colors group"
                data-testid="aggregated-source-block"
              >
                {domain && (
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                    alt=""
                    width={32}
                    height={32}
                    className="rounded-md flex-shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Source</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 truncate" data-testid="text-aggregated-source">
                    {article.source}
                  </p>
                  {article.originalTitle && article.originalTitle !== article.title && (
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      Original headline: {article.originalTitle}
                    </p>
                  )}
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 flex-shrink-0" />
              </a>
            );
          })()}

          <div className="flex items-start gap-3 mb-4" data-testid="byline">
            {article.articleType === "curated" ? (
              <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                <AvatarImage src={article.authorAvatarUrl ?? undefined} alt={article.author || ""} />
                <AvatarFallback className="text-sm bg-gradient-to-br from-primary to-primary/60 text-white font-bold">{authorInitials}</AvatarFallback>
              </Avatar>
            ) : null}
            <div className="min-w-0 flex-1">
              {article.articleType === "curated" ? (
                <>
                  <p className="text-sm font-bold leading-tight" data-testid="text-article-author">
                    By {article.author}
                  </p>
                  {article.authorRole && (
                    <p className="text-xs text-muted-foreground mt-0.5" data-testid="text-article-author-role">
                      {article.authorRole}
                    </p>
                  )}
                  <p className="text-[11px] text-teal-700 dark:text-teal-400 mt-0.5 font-semibold" data-testid="text-article-attribution">
                    GetCyberRight Original &middot; Plain-English guidance for families
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1 italic" data-testid="text-author-bio">
                    Cybersecurity practitioner translating real-world threats into steps families can act on today.
                  </p>
                </>
              ) : (
                <p className="text-[11px] text-muted-foreground" data-testid="text-article-attribution">
                  Plain-English summary by GetCyberRight. Read the full report at the source above.
                </p>
              )}
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                <span data-testid="text-article-date">
                  Published {formatDate(article.publishedAt)}
                </span>
                {article.updatedAt &&
                  new Date(article.updatedAt).getTime() - new Date(article.publishedAt).getTime() > 60_000 && (
                    <>
                      <span aria-hidden>·</span>
                      <span className="italic" data-testid="text-article-updated">
                        Updated {formatDate(article.updatedAt)}
                      </span>
                    </>
                  )}
                <span aria-hidden>·</span>
                <span className="flex items-center gap-1" data-testid="text-article-readtime">
                  <Clock className="h-3 w-3" />
                  {article.readTime} min read
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-b border-border py-3">
            <ShareBar title={article.title} url={articleUrl} />
          </div>
        </FadeIn>

        {article.articleType === "curated" && (
          <FadeIn>
            <EditorialSpine
              whatChanged={article.whatChanged}
              whyThisMatters={article.whyThisMatters || undefined}
              actionThisWeek={article.actionThisWeek || undefined}
              pending={article.editorialSpinePending}
            />
          </FadeIn>
        )}

        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <FadeIn>
            <Card className="mb-8 border-primary/30 bg-primary/5" data-testid="card-key-takeaways">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <h2 className="font-bold text-base">Key Takeaways</h2>
                </div>
                <ul className="space-y-2">
                  {article.keyTakeaways.map((takeaway, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" data-testid={`takeaway-${i}`}>
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </FadeIn>
        )}

        {article.content && (
          <FadeIn>
            <Card className="mb-6">
              <CardContent className="p-6 md:p-8">
                <div
                  className="prose dark:prose-invert max-w-none text-base leading-relaxed prose-headings:text-foreground prose-headings:font-bold prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border prose-h2:pb-2 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-p:mb-4 prose-p:text-muted-foreground prose-li:text-muted-foreground prose-ol:my-4 prose-ol:pl-6 prose-ul:my-4 prose-ul:pl-6 prose-li:my-1 prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-primary/50 prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
                  data-testid="text-article-content"
                  dangerouslySetInnerHTML={{ __html: contentParts.first }}
                />
                {contentParts.second && <NewsletterInline />}
                {contentParts.second && (
                  <div
                    className="prose dark:prose-invert max-w-none text-base leading-relaxed prose-headings:text-foreground prose-headings:font-bold prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border prose-h2:pb-2 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-p:mb-4 prose-p:text-muted-foreground prose-li:text-muted-foreground prose-ol:my-4 prose-ol:pl-6 prose-ul:my-4 prose-ul:pl-6 prose-li:my-1 prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-primary/50 prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
                    dangerouslySetInnerHTML={{ __html: contentParts.second }}
                  />
                )}
              </CardContent>
            </Card>
          </FadeIn>
        )}

        {process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_MULTIPLEX && (
          <FadeIn>
            <AdSlot
              slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_MULTIPLEX}
              format="multiplex"
              className="mb-6"
              testId="ad-article-multiplex"
            />
          </FadeIn>
        )}

        {article.tags && article.tags.length > 0 && (
          <FadeIn className="mb-6">
            <div className="flex items-center gap-2 flex-wrap" data-testid="tags-section">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground mr-1">Topics:</span>
              {article.tags.map(tag => (
                <Link key={tag} href={`/news?tag=${encodeURIComponent(tag)}`}>
                  <Badge variant="outline" className="hover:bg-primary/10 hover:border-primary/40 cursor-pointer text-xs" data-testid={`tag-${tag}`}>
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </FadeIn>
        )}

        <FadeIn className="space-y-4">
          {(article.category === "Action Needed" || article.urgencyLevel >= 3) &&
            article.keyTakeaways && article.keyTakeaways.length > 0 && (
              <Card
                className="border-2 border-red-500/40 bg-gradient-to-br from-red-50 to-amber-50 dark:from-red-950/30 dark:to-amber-950/20"
                data-testid="card-action-required"
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400 mb-1">
                        Action Required
                      </p>
                      <h3 className="font-bold text-lg mb-3">What You Should Do</h3>
                      <ol className="space-y-2.5 mb-4">
                        {article.keyTakeaways.slice(0, 5).map((step, i) => (
                          <li
                            key={i}
                            className="flex gap-3 text-sm"
                            data-testid={`action-step-${i}`}
                          >
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                              {i + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                      <div className="flex flex-wrap gap-2">
                        {article.relatedToolUrl && article.relatedToolName ? (
                          <Link href={article.relatedToolUrl.replace("https://www.getcyberright.com", "")}>
                            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" data-testid="link-action-tool">
                              {article.relatedToolName}
                            </Button>
                          </Link>
                        ) : (
                          <Link href="/scam-checker">
                            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" data-testid="link-action-checker">
                              Check if you're affected
                            </Button>
                          </Link>
                        )}
                        <Link href="/protection-hub">
                          <Button size="sm" variant="outline" data-testid="link-action-hub">
                            Protection Hub
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-base mb-1">Protect Yourself</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {article.relatedToolUrl && article.relatedToolName
                      ? `Use our ${article.relatedToolName} to check if you're affected and take action.`
                      : "Stay one step ahead with our free family cybersecurity tools. Check links, scan for breached accounts, and get personalized risk assessments."}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {article.relatedToolUrl && article.relatedToolName ? (
                      <Link href={article.relatedToolUrl.replace("https://www.getcyberright.com", "")}>
                        <Button size="sm" data-testid="link-related-tool">Open {article.relatedToolName}</Button>
                      </Link>
                    ) : (
                      <Link href="/scam-checker">
                        <Button size="sm" data-testid="link-scam-checker">Check if it's a scam</Button>
                      </Link>
                    )}
                    <Link href="/protection-hub">
                      <Button size="sm" variant="outline" data-testid="link-protection-hub">Protection Hub</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-border bg-muted/30" data-testid="bottom-share-card">
            <CardContent className="p-5 sm:p-6 text-center">
              <h3 className="font-bold text-base mb-1">Found this useful?</h3>
              <p className="text-sm text-muted-foreground mb-4">Share it with someone who could use a heads-up.</p>
              <div className="flex justify-center">
                <ShareBar title={article.title} url={articleUrl} />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between pt-4 border-t flex-wrap gap-3">
            <p className="text-xs text-muted-foreground">
              Curated from trusted cybersecurity sources by GetCyberRight
            </p>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
              data-testid="link-original-source"
            >
              Source: {article.source}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </FadeIn>

        <CommentsSection slug={article.slug} />

          </div>

          <aside className="lg:col-span-1 mt-10 lg:mt-0" aria-label="Article sidebar" data-testid="article-sidebar">
            <div className="lg:sticky lg:top-24 space-y-5">
              {article.relatedArticles && article.relatedArticles.length > 0 && (
                <Card data-testid="sidebar-editors-choice">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Editor's Choice</h3>
                    </div>
                    <ul className="space-y-3">
                      {article.relatedArticles.slice(0, 4).map(r => (
                        <li key={r.id}>
                          <Link href={`/news/${r.slug}`} className="group flex gap-3" data-testid={`sidebar-article-${r.id}`}>
                            <div className="relative flex-shrink-0 w-16 h-16 overflow-hidden rounded-md bg-muted">
                              <img
                                src={r.imageUrl || CATEGORY_FALLBACK_IMAGES[r.category] || DEFAULT_HERO}
                                alt={r.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                loading="lazy"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).src = DEFAULT_HERO; }}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <Badge className={`${getCategoryColor(r.category)} text-[9px] mb-1 px-1.5 py-0`}>
                                {r.category}
                              </Badge>
                              <p className="text-xs font-semibold leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                                {r.title}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <NewsletterInline
                title="Free weekly digest"
                description="Cybersecurity threats explained in plain language. No spam."
                testIdSuffix="sidebar"
              />

              <Card className="border-primary/30 bg-gradient-to-br from-primary/15 to-primary/5" data-testid="sidebar-shield-cta">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-sm">GCR Shield</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    Free family cybersecurity tools. Check links, scan for breached accounts, and run a personalized risk assessment.
                  </p>
                  <Link href="/protection-hub">
                    <Button size="sm" className="w-full" data-testid="sidebar-cta-button">
                      Open Protection Hub
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>

        <FadeIn className="mt-8">
          <NewsletterInline
            title="Stay ahead of cyber threats"
            description="Get our free weekly digest. Real threats, plain language, what to do about them. No spam, ever."
            testIdSuffix="bottom"
          />
        </FadeIn>

        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <FadeIn className="mt-10">
            <h2 className="text-2xl font-bold mb-4">More articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="related-articles">
              {article.relatedArticles.map(r => (
                <Link key={r.id} href={`/news/${r.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer h-full" data-testid={`related-article-${r.id}`}>
                    <div className="relative h-36 overflow-hidden bg-muted">
                      <img
                        src={r.imageUrl || CATEGORY_FALLBACK_IMAGES[r.category] || DEFAULT_HERO}
                        alt={r.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = DEFAULT_HERO; }}
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className={`${getCategoryColor(r.category)} text-[10px] backdrop-blur-sm bg-white/90 dark:bg-black/70 border`}>
                          {r.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm leading-snug line-clamp-2 mb-1.5">{r.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{r.excerpt}</p>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {r.readTime} min read
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </FadeIn>
        )}
      </article>
      <Footer />
    </div>
  );
}
