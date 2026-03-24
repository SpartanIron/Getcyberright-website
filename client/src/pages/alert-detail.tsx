import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useSEO } from "@/hooks/use-seo";
import { StructuredData, type BlogPostingData, type BreadcrumbData } from "@/components/structured-data";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ArrowLeft, Calendar, Globe, Shield, AlertTriangle, CheckCircle, ExternalLink, Loader2, ArrowRight } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";

interface AlertDetail {
  id: string;
  slug: string;
  threatName: string;
  threatCategory: string;
  description: string;
  detailedAnalysis: string;
  riskLevel: string;
  affectedPlatforms: string[];
  indicators: Array<{ type: string; value: string; description: string }>;
  mitigationSteps: string[];
  sourceUrls: string[];
  cveIds: string[];
  regions: string[];
  targetAudience: string;
  metaDescription: string;
  publishedAt: string;
  dateDetected: string;
  updatedAt: string;
  relatedAlertIds: string[];
  relatedGuideSlugs: string[];
}

const riskConfig: Record<string, { bg: string; icon: string; border: string }> = {
  high: { bg: "bg-red-500/20", icon: "text-red-400", border: "border-red-500" },
  medium: { bg: "bg-orange-500/20", icon: "text-orange-400", border: "border-orange-500" },
  low: { bg: "bg-green-500/20", icon: "text-green-400", border: "border-green-500" },
};

export default function AlertDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";

  const { data: alert, isLoading, error } = useQuery<AlertDetail>({
    queryKey: ["/api/alerts", slug],
    queryFn: async () => {
      const res = await fetch(`/api/alerts/${slug}`);
      if (!res.ok) throw new Error("Alert not found");
      return res.json();
    },
    enabled: !!slug,
  });

  useSEO({
    title: alert?.threatName ? `${alert.threatName} | Cyber Threat Alert | GetCyberRight` : "Cyber Threat Alert | GetCyberRight",
    description: alert?.metaDescription || alert?.description || "Cybersecurity threat alert from GetCyberRight.",
    keywords: alert?.cveIds?.join(", "),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !alert) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <ShieldAlert className="h-10 w-10 text-amber-500 mx-auto mb-3" />
          <h1 className="text-2xl font-bold mb-2" data-testid="text-not-found">Alert No Longer Available</h1>
          <p className="text-muted-foreground mb-6">This alert may have been updated or replaced with newer threat information.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/alerts">
              <span className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium" data-testid="link-back-alerts">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Browse All Alerts
              </span>
            </Link>
            <Link href="/news">
              <span className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium" data-testid="link-latest-news">
                Latest News
                <ArrowRight className="h-4 w-4 ml-2" />
              </span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const risk = riskConfig[alert.riskLevel] || riskConfig.medium;

  const blogPosting: BlogPostingData = {
    type: "BlogPosting",
    headline: alert.threatName,
    description: alert.metaDescription || alert.description,
    datePublished: alert.publishedAt || alert.dateDetected,
    dateModified: alert.updatedAt,
    author: { name: "GetCyberRight Security Team", url: "https://www.getcyberright.com" },
    publisher: { name: "GetCyberRight", logo: "https://www.getcyberright.com/favicon.svg" },
    articleSection: "Security Alerts",
    keywords: [...(alert.cveIds || []), alert.threatCategory].filter(Boolean),
  };

  const breadcrumbs: BreadcrumbData = {
    type: "BreadcrumbList",
    items: [
      { name: "Home", url: "https://www.getcyberright.com/" },
      { name: "Alerts", url: "https://www.getcyberright.com/alerts" },
      { name: alert.threatName, url: `https://www.getcyberright.com/alerts/${alert.slug}` },
    ],
  };

  const tocItems = [
    { id: "overview", label: "Overview" },
    ...(alert.detailedAnalysis ? [{ id: "analysis", label: "Detailed Analysis" }] : []),
    ...(alert.indicators?.length ? [{ id: "indicators", label: "Indicators" }] : []),
    ...(alert.mitigationSteps?.length ? [{ id: "mitigation", label: "What to Do" }] : []),
    ...(alert.sourceUrls?.length ? [{ id: "sources", label: "Sources" }] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={[blogPosting, breadcrumbs]} />
      <Navigation />

      <div className="bg-[#0A2A3C] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A2A3C] via-[#0A2A3C] to-[#00293C]" />
        <div className="absolute pointer-events-none hidden md:block" aria-hidden="true" style={{ top: 0, right: 0, width: "55%", height: "100%", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-40%", right: "2%", width: "50px", height: "220%", background: "linear-gradient(180deg, #003A52 0%, #0D4D66 50%, #003A52 100%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
          <div style={{ position: "absolute", top: "-40%", right: "10%", width: "2px", height: "220%", background: "linear-gradient(180deg, transparent 10%, rgba(45, 212, 191, 0.4) 50%, transparent 90%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
          <div style={{ position: "absolute", top: "-35%", right: "18%", width: "35px", height: "220%", background: "linear-gradient(180deg, #5eead4 0%, #2dd4bf 35%, #14b8a6 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.55 }} />
          <div style={{ position: "absolute", top: "-35%", right: "26%", width: "2px", height: "220%", background: "linear-gradient(180deg, transparent 15%, hsla(16, 95%, 58%, 0.35) 50%, transparent 85%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
          <div style={{ position: "absolute", top: "-30%", right: "32%", width: "50px", height: "220%", background: "linear-gradient(180deg, hsl(16, 100%, 62%) 0%, hsl(16, 95%, 52%) 40%, hsl(16, 90%, 42%) 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.5 }} />
        </div>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <Link href="/alerts" className="inline-flex items-center text-white/60 hover:text-white text-sm mb-6 transition-colors" data-testid="link-back-alerts">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Alerts
          </Link>

          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 ${risk.bg} rounded-lg`}>
              <ShieldAlert className={`h-8 w-8 ${risk.icon}`} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className={`${alert.riskLevel === "high" ? "bg-red-600" : alert.riskLevel === "medium" ? "bg-orange-600" : "bg-green-600"} text-white`}>
                  {alert.riskLevel?.toUpperCase()} RISK
                </Badge>
                {alert.threatCategory && <Badge variant="outline" className="border-white/20 text-white/70">{alert.threatCategory}</Badge>}
              </div>
              <h1 className="text-[1.75rem] sm:text-3xl md:text-4xl font-extrabold tracking-[-0.025em]" data-testid="text-alert-title">{alert.threatName}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-white/60 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(alert.publishedAt || alert.dateDetected).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
                {alert.regions?.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    {alert.regions.join(", ")}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {alert.cveIds?.map((cve) => (
              <Badge key={cve} variant="outline" className="border-white/20 text-white/70 font-mono">{cve}</Badge>
            ))}
            {alert.affectedPlatforms?.map((p) => (
              <Badge key={p} variant="outline" className="border-white/20 text-white/70">{p}</Badge>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Sections</h3>
              <nav className="space-y-1" data-testid="nav-toc">
                {tocItems.map((item) => (
                  <a key={item.id} href={`#${item.id}`} className="block text-sm text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 py-1 transition-colors">
                    {item.label}
                  </a>
                ))}
              </nav>

              <Card className="mt-6 bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800">
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm font-medium mb-2">Suspect a scam?</p>
                  <Link href="/scam-checker" className="text-sm text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1">
                    Use GCR Scam Guard
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-8">
            <section id="overview" className="scroll-mt-20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
                Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed">{alert.description}</p>
            </section>

            {alert.detailedAnalysis && (
              <section id="analysis" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  Detailed Analysis
                </h2>
                <div className="prose prose-slate dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(alert.detailedAnalysis || "") }} />
              </section>
            )}

            {alert.indicators && alert.indicators.length > 0 && (
              <section id="indicators" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <ShieldAlert className="h-6 w-6 text-red-500" />
                  Indicators of Compromise
                </h2>
                <div className="space-y-3">
                  {alert.indicators.map((ind, i) => (
                    <Card key={i} className="border-l-4 border-l-red-500">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="shrink-0 font-mono text-xs">{ind.type}</Badge>
                          <div>
                            <code className="text-sm font-mono break-all">{ind.value}</code>
                            {ind.description && <p className="text-sm text-muted-foreground mt-1">{ind.description}</p>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {alert.mitigationSteps && alert.mitigationSteps.length > 0 && (
              <section id="mitigation" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  What You Should Do
                </h2>
                <div className="space-y-3">
                  {alert.mitigationSteps.map((step, i) => (
                    <Card key={i} className="border-l-4 border-l-green-500">
                      <CardContent className="pt-4 pb-4 flex items-start gap-3">
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold shrink-0">
                          {i + 1}
                        </span>
                        <p className="text-sm">{step}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {alert.sourceUrls && alert.sourceUrls.length > 0 && (
              <section id="sources" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <ExternalLink className="h-6 w-6 text-blue-500" />
                  Sources
                </h2>
                <div className="space-y-2">
                  {alert.sourceUrls.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:underline" data-testid={`link-source-${i}`}>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                      {url.length > 80 ? url.substring(0, 80) + "..." : url}
                    </a>
                  ))}
                </div>
              </section>
            )}

            {alert.relatedGuideSlugs && alert.relatedGuideSlugs.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-bold mb-4">Related Guides</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {alert.relatedGuideSlugs.map((guideSlug) => (
                    <Link key={guideSlug} href={`/guides/${guideSlug}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="pt-4 pb-4 flex items-center justify-between">
                          <span className="text-sm font-medium">{guideSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
