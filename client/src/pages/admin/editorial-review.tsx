"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "@/lib/navigation";
import { useAuth } from "@/hooks/use-auth";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface ProposedSpine {
  whatChanged: string | null;
  whyThisMatters: string[] | null;
  actionThisWeek: { label: string; href: string } | null;
  curatedTopic: string | null;
  flags: string[];
  needsAuthorInput: boolean;
  generatedAt?: string;
}

interface AdminCuratedArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  curatedTopic: string | null;
  publishedAt: string | null;
  whatChanged: string | null;
  whyThisMatters: string[];
  actionThisWeek: { label: string; href: string } | null;
  editorialSpinePending: boolean;
  spineReviewedByHuman: boolean;
  proposedSpine: ProposedSpine | null;
}

interface ArticleDetail {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string | null;
  source: string;
  sourceUrl: string;
  category: string;
}

interface AllowlistResponse {
  allowlist: string[];
  limits: {
    whatChangedMax: number;
    whyEachMax: number;
    whyCount: number;
    actionLabelMax: number;
  };
  curatedTopics: Record<string, string>;
}

interface SpineProposal {
  whatChanged: string | null;
  whyThisMatters: string[] | null;
  actionThisWeek: { label: string; href: string } | null;
  curatedTopic: string | null;
  flags: string[];
  needsAuthorInput: boolean;
}

const PAGE_SIZE = 5;

function CharCounter({ value, max }: { value: string; max: number }) {
  const over = value.length > max;
  return (
    <span
      className={`text-[11px] ${over ? "text-red-600 dark:text-red-400 font-semibold" : "text-muted-foreground"}`}
      data-testid="char-counter"
    >
      {value.length}/{max}
    </span>
  );
}

function ArticleReviewCard({
  article,
  allowlist,
  topics,
  limits,
}: {
  article: AdminCuratedArticle;
  allowlist: string[];
  topics: Record<string, string>;
  limits: AllowlistResponse["limits"];
}) {
  const { toast } = useToast();
  const [whatChanged, setWhatChanged] = useState(article.whatChanged || "");
  const [whyBullets, setWhyBullets] = useState<string[]>(
    article.whyThisMatters && article.whyThisMatters.length > 0
      ? [...article.whyThisMatters, "", "", ""].slice(0, limits.whyCount)
      : Array(limits.whyCount).fill(""),
  );
  const [actionLabel, setActionLabel] = useState(article.actionThisWeek?.label || "");
  const [actionHref, setActionHref] = useState(article.actionThisWeek?.href || allowlist[0] || "/news");
  const [topic, setTopic] = useState<string>(article.curatedTopic || "");
  const [flags, setFlags] = useState<string[]>(article.proposedSpine?.flags || []);
  const [needsAuthorInput, setNeedsAuthorInput] = useState(
    article.proposedSpine?.needsAuthorInput === true,
  );

  // If a stored proposal exists and the human has not reviewed yet, prefill any
  // empty fields from the proposal so the reviewer sees the AI suggestion.
  useEffect(() => {
    const p = article.proposedSpine;
    if (!p || article.spineReviewedByHuman) return;
    if (!whatChanged && p.whatChanged) setWhatChanged(p.whatChanged);
    if (whyBullets.every((b) => !b.trim()) && p.whyThisMatters && p.whyThisMatters.length > 0) {
      setWhyBullets([...p.whyThisMatters, "", "", ""].slice(0, limits.whyCount));
    }
    if (!actionLabel && p.actionThisWeek) {
      setActionLabel(p.actionThisWeek.label);
      setActionHref(p.actionThisWeek.href);
    }
    if (!topic && p.curatedTopic) setTopic(p.curatedTopic);
    // We intentionally only run on mount-equivalent (article id change).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article.id]);

  // Fetch the source article so reviewer sees full excerpt + body alongside the form.
  const { data: detail } = useQuery<ArticleDetail>({
    queryKey: ["/api/news/article", article.slug],
    queryFn: async () => {
      const res = await fetch(`/api/news/article/${article.slug}`);
      if (!res.ok) throw new Error("Failed to load article");
      return res.json();
    },
    enabled: !!article.slug,
  });

  const generateMutation = useMutation({
    mutationFn: async (fields?: string[]) => {
      const res = await apiRequest("POST", `/api/admin/news/${article.id}/generate-spine`, {
        fields: fields || ["whatChanged", "whyThisMatters", "actionThisWeek", "curatedTopic"],
      });
      return (await res.json()) as { proposal: SpineProposal };
    },
    onSuccess: (data, variables) => {
      const p = data.proposal;
      const all = !variables || variables.length >= 4;
      if (all || variables?.includes("whatChanged")) {
        if (p.whatChanged !== null) setWhatChanged(p.whatChanged);
      }
      if (all || variables?.includes("whyThisMatters")) {
        if (p.whyThisMatters !== null) {
          setWhyBullets([...p.whyThisMatters, "", "", ""].slice(0, limits.whyCount));
        }
      }
      if (all || variables?.includes("actionThisWeek")) {
        if (p.actionThisWeek) {
          setActionLabel(p.actionThisWeek.label);
          setActionHref(p.actionThisWeek.href);
        }
      }
      if (all || variables?.includes("curatedTopic")) {
        if (p.curatedTopic) setTopic(p.curatedTopic);
      }
      setFlags(p.flags);
      setNeedsAuthorInput(p.needsAuthorInput);
      toast({ title: "Proposal generated", description: "Review and edit before approving." });
    },
    onError: (err: any) => {
      toast({
        title: "Generation failed",
        description: err?.message || "Try again.",
        variant: "destructive",
      });
    },
  });

  const approveMutation = useMutation({
    mutationFn: async () => {
      // Filter out empty bullets before submit.
      const cleanBullets = whyBullets.map((b) => b.trim()).filter((b) => b.length >= 2);
      const payload = {
        whatChanged: whatChanged.trim() || null,
        whyThisMatters: cleanBullets,
        actionThisWeek:
          actionLabel.trim() && actionHref
            ? { label: actionLabel.trim(), href: actionHref }
            : null,
      };
      const res = await apiRequest("PATCH", `/api/admin/news/${article.id}`, payload);
      const out = await res.json();
      // If topic changed, push it through the dedicated endpoint.
      if (topic && topic !== article.curatedTopic) {
        await apiRequest("PATCH", `/api/admin/news/${article.id}/topic`, { curatedTopic: topic });
      }
      return out;
    },
    onSuccess: () => {
      toast({ title: "Approved", description: `Spine published for "${article.title.slice(0, 40)}..."` });
      // Refresh queue + public news feeds so /news and /news/[slug] reflect change.
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news/tracks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news/article", article.slug] });
    },
    onError: (err: any) => {
      toast({
        title: "Approval failed",
        description: err?.message || "Check field validation.",
        variant: "destructive",
      });
    },
  });

  const isGenerating = generateMutation.isPending;
  const isApproving = approveMutation.isPending;

  return (
    <Card
      className="border border-slate-200 dark:border-slate-800"
      data-testid={`card-review-article-${article.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Badge variant="outline" className="text-[10px]">
                {article.category}
              </Badge>
              {article.editorialSpinePending && (
                <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px]">
                  Pending review
                </Badge>
              )}
              {!article.curatedTopic && (
                <Badge variant="destructive" className="text-[10px]">
                  No topic
                </Badge>
              )}
              {article.publishedAt && (
                <span className="text-[11px] text-muted-foreground">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <CardTitle className="text-base leading-snug" data-testid={`text-article-title-${article.id}`}>
              {article.title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/news/${article.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
              data-testid={`link-preview-${article.id}`}
            >
              <Eye className="h-3.5 w-3.5" />
              Open
            </a>
            <Button
              size="sm"
              variant="outline"
              onClick={() => generateMutation.mutate(undefined)}
              disabled={isGenerating}
              data-testid={`button-generate-${article.id}`}
            >
              {isGenerating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 mr-1" />
              )}
              Generate
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Source pane + form */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="border-r border-slate-200 dark:border-slate-800 lg:pr-4">
            <h4 className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">
              Source article
            </h4>
            <p className="text-sm text-foreground/90 mb-2">{detail?.excerpt || "Loading excerpt..."}</p>
            {detail?.content && (
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer hover:text-primary">Show full body</summary>
                <div className="mt-2 max-h-64 overflow-y-auto whitespace-pre-wrap border border-slate-200 dark:border-slate-800 rounded p-2 bg-muted/30">
                  {detail.content}
                </div>
              </details>
            )}
            {detail?.sourceUrl && (
              <a
                href={detail.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary"
              >
                <ExternalLink className="h-3 w-3" />
                {detail.source}
              </a>
            )}
          </div>

          <div className="space-y-4">
            {needsAuthorInput && (
              <div
                className="rounded-md border border-amber-500/40 bg-amber-50 dark:bg-amber-950/30 p-2.5 text-xs text-amber-900 dark:text-amber-300 flex gap-2"
                data-testid={`banner-needs-author-${article.id}`}
              >
                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>The model declined to fill at least one field. Needs author input.</span>
              </div>
            )}
            {flags.length > 0 && (
              <ul
                className="rounded-md border border-slate-200 dark:border-slate-800 bg-muted/30 p-2.5 text-[11px] space-y-1"
                data-testid={`list-flags-${article.id}`}
              >
                {flags.map((f, i) => (
                  <li key={i} className="text-muted-foreground">
                    {f}
                  </li>
                ))}
              </ul>
            )}

            {/* Curated topic */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-foreground">Curated topic</label>
              </div>
              <Select value={topic || undefined} onValueChange={setTopic}>
                <SelectTrigger data-testid={`select-topic-${article.id}`} className="h-9">
                  <SelectValue placeholder="Choose a topic" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(topics).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* What changed */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-foreground">What Changed</label>
                <div className="flex items-center gap-2">
                  <CharCounter value={whatChanged} max={limits.whatChangedMax} />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2"
                    onClick={() => generateMutation.mutate(["whatChanged"])}
                    disabled={isGenerating}
                    data-testid={`button-regen-what-changed-${article.id}`}
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={whatChanged}
                onChange={(e) => setWhatChanged(e.target.value)}
                rows={2}
                placeholder="One plain-English sentence about what is new."
                data-testid={`input-what-changed-${article.id}`}
              />
            </div>

            {/* Why this matters bullets */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Why This Matters to Your Family ({limits.whyCount} bullets)
                </label>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2"
                  onClick={() => generateMutation.mutate(["whyThisMatters"])}
                  disabled={isGenerating}
                  data-testid={`button-regen-why-${article.id}`}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-1.5">
                {whyBullets.map((b, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Input
                      value={b}
                      onChange={(e) => {
                        const next = [...whyBullets];
                        next[i] = e.target.value;
                        setWhyBullets(next);
                      }}
                      placeholder={`Bullet ${i + 1}`}
                      data-testid={`input-why-bullet-${article.id}-${i}`}
                    />
                    <CharCounter value={b} max={limits.whyEachMax} />
                  </div>
                ))}
              </div>
            </div>

            {/* Action this week */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-foreground">One Action This Week</label>
                <div className="flex items-center gap-2">
                  <CharCounter value={actionLabel} max={limits.actionLabelMax} />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2"
                    onClick={() => generateMutation.mutate(["actionThisWeek"])}
                    disabled={isGenerating}
                    data-testid={`button-regen-action-${article.id}`}
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Input
                value={actionLabel}
                onChange={(e) => setActionLabel(e.target.value)}
                placeholder="Action button label, e.g. Run a free scam check"
                className="mb-1.5"
                data-testid={`input-action-label-${article.id}`}
              />
              <Select value={actionHref} onValueChange={setActionHref}>
                <SelectTrigger className="h-9" data-testid={`select-action-href-${article.id}`}>
                  <SelectValue placeholder="Pick an approved route" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {allowlist.map((href) => (
                    <SelectItem key={href} value={href}>
                      {href}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Approve */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <Button
                onClick={() => approveMutation.mutate()}
                disabled={isApproving}
                data-testid={`button-approve-${article.id}`}
              >
                {isApproving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-1.5" />
                )}
                Approve and publish
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function EditorialReviewPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<"pending" | "awaiting-review" | "all">("pending");
  const { toast } = useToast();
  const batchMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/admin/news/generate-spine-batch`, { limit: 50 });
      return await res.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Batch generation complete",
        description: `${data.succeeded}/${data.attempted} proposals stored. ${data.needsAuthorInput} need author input.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] });
    },
    onError: (err: any) => {
      toast({ title: "Batch failed", description: err?.message || "Try again.", variant: "destructive" });
    },
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  const { data: adminCheck, isLoading: adminCheckLoading } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/auth/admin-check"],
    enabled: !!user,
  });

  useEffect(() => {
    if (adminCheck && !adminCheck.isAdmin) navigate("/");
  }, [adminCheck, navigate]);

  const { data: allowlistData, isLoading: allowlistLoading } = useQuery<AllowlistResponse>({
    queryKey: ["/api/admin/news/allowlist"],
    enabled: !!adminCheck?.isAdmin,
  });

  const { data: articlesData, isLoading: listLoading } = useQuery<{
    articles: AdminCuratedArticle[];
  }>({
    queryKey: ["/api/admin/news"],
    enabled: !!adminCheck?.isAdmin,
  });

  const sortedFiltered = useMemo(() => {
    const all = articlesData?.articles || [];
    let filtered = all;
    if (filter === "pending") {
      filtered = all.filter((a) => a.editorialSpinePending && !a.spineReviewedByHuman);
    } else if (filter === "awaiting-review") {
      filtered = all.filter((a) => !a.spineReviewedByHuman && !!a.proposedSpine);
    }
    // Oldest first per task brief: sort ascending by publishedAt.
    return filtered.slice().sort((a, b) => {
      const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return ta - tb;
    });
  }, [articlesData, filter]);

  const pendingCount = (articlesData?.articles || []).filter((a) => a.editorialSpinePending).length;
  const awaitingReviewCount = (articlesData?.articles || []).filter(
    (a) => !a.spineReviewedByHuman && !!a.proposedSpine,
  ).length;
  const totalCount = (articlesData?.articles || []).length;
  const noTopicCount = (articlesData?.articles || []).filter((a) => !a.curatedTopic).length;

  const totalPages = Math.max(1, Math.ceil(sortedFiltered.length / PAGE_SIZE));
  const pageItems = sortedFiltered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (authLoading || adminCheckLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-5" data-testid="page-editorial-review">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold mb-1">Editorial Spine Review</h1>
            <p className="text-sm text-muted-foreground">
              Approve What Changed, Why This Matters, One Action, and topic for each curated article.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" data-testid="badge-pending-count">
              {pendingCount} pending
            </Badge>
            <Badge variant="outline" data-testid="badge-awaiting-count">
              {awaitingReviewCount} awaiting review
            </Badge>
            <Badge variant="outline" data-testid="badge-no-topic-count">
              {noTopicCount} missing topic
            </Badge>
            <Badge variant="outline" data-testid="badge-total-count">
              {totalCount} total curated
            </Badge>
            <Button
              size="sm"
              variant="default"
              onClick={() => batchMutation.mutate()}
              disabled={batchMutation.isPending || pendingCount === 0}
              data-testid="button-generate-all"
            >
              {batchMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 mr-1" />
              )}
              Generate all pending
            </Button>
            <div className="flex items-center gap-1 ml-2">
              <Button
                size="sm"
                variant={filter === "pending" ? "default" : "outline"}
                onClick={() => {
                  setFilter("pending");
                  setPage(0);
                }}
                data-testid="filter-pending"
              >
                Pending
              </Button>
              <Button
                size="sm"
                variant={filter === "awaiting-review" ? "default" : "outline"}
                onClick={() => {
                  setFilter("awaiting-review");
                  setPage(0);
                }}
                data-testid="filter-awaiting-review"
              >
                Awaiting review
              </Button>
              <Button
                size="sm"
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => {
                  setFilter("all");
                  setPage(0);
                }}
                data-testid="filter-all"
              >
                All
              </Button>
            </div>
          </div>
        </div>

        {listLoading || allowlistLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : pageItems.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground" data-testid="empty-queue">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-3 text-emerald-500" />
              {filter === "pending" ? "Nothing pending. Queue is clear." : "No curated articles yet."}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {pageItems.map((a) => (
                <ArticleReviewCard
                  key={a.id}
                  article={a}
                  allowlist={allowlistData?.allowlist || []}
                  topics={allowlistData?.curatedTopics || {}}
                  limits={
                    allowlistData?.limits || {
                      whatChangedMax: 140,
                      whyEachMax: 90,
                      whyCount: 3,
                      actionLabelMax: 60,
                    }
                  }
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  data-testid="button-prev-page"
                >
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground" data-testid="text-page-status">
                  Page {page + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  data-testid="button-next-page"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
