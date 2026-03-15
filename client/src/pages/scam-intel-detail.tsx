import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useSEO } from "@/hooks/use-seo";
import { StructuredData, type BlogPostingData, type FAQData, type BreadcrumbData } from "@/components/structured-data";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShareButtons } from "@/components/share-buttons";
import { AlertTriangle, ArrowLeft, Eye, CheckCircle, Shield, MessageSquareWarning, HelpCircle, Loader2, ArrowRight, Users, DollarSign, MapPin, BookOpen, Flag, Search, Share2, Calendar } from "lucide-react";
import { getAllScamSlugs, getScamBySlug } from "@shared/scam-content";

interface ScamIntelDetail {
  id: string;
  slug: string;
  scamName: string;
  scamCategory: string;
  platformUsed: string[];
  targetAudience: string[];
  exampleMessages: Array<{ text: string; context?: string }>;
  warningSigns: string[];
  preventionTips: string[];
  howItWorks: Array<{ step: string; description: string }>;
  riskLevel: string;
  metaDescription: string;
  faq: Array<{ question: string; answer: string }>;
  regions: string[];
  relatedScamSlugs: string[];
  reportCount: number;
  averageLoss: string;
  dateDetected: string;
  lastUpdated: string;
}

interface RelatedScam {
  slug: string;
  scamName: string;
  riskLevel: string;
  reportCount: number;
}

const riskConfig: Record<string, { bg: string; icon: string; label: string }> = {
  high: { bg: "bg-red-500/20", icon: "text-red-400", label: "High Risk" },
  medium: { bg: "bg-orange-500/20", icon: "text-orange-400", label: "Medium Risk" },
  low: { bg: "bg-green-500/20", icon: "text-green-400", label: "Low Risk" },
};

const riskColors: Record<string, string> = {
  high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  medium: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

export default function ScamIntelDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";

  const { data: scam, isLoading, error } = useQuery<ScamIntelDetail>({
    queryKey: ["/api/scam-intel", slug],
    queryFn: async () => {
      const res = await fetch(`/api/scam-intel/${slug}`);
      if (!res.ok) throw new Error("Scam not found");
      return res.json();
    },
    enabled: !!slug,
  });

  const { data: relatedScams = [] } = useQuery<RelatedScam[]>({
    queryKey: ["/api/scam-intel/related", slug],
    queryFn: async () => {
      if (!scam?.relatedScamSlugs?.length) return [];
      const promises = scam.relatedScamSlugs.map(async (relSlug) => {
        try {
          const res = await fetch(`/api/scam-intel/${relSlug}`);
          if (!res.ok) return null;
          const data = await res.json();
          return { slug: data.slug, scamName: data.scamName, riskLevel: data.riskLevel, reportCount: data.reportCount || 0 };
        } catch {
          return null;
        }
      });
      const results = await Promise.all(promises);
      return results.filter(Boolean) as RelatedScam[];
    },
    enabled: !!scam?.relatedScamSlugs?.length,
  });

  useSEO({
    title: scam?.scamName ? `${scam.scamName} | Scam Intelligence | GetCyberRight` : "Scam Intelligence | GetCyberRight",
    description: scam?.metaDescription || "Detailed scam analysis and prevention tips from GetCyberRight.",
    keywords: scam ? `${scam.scamName}, ${scam.scamCategory}, scam prevention` : "scam intelligence",
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

  if (error || !scam) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertTriangle className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4" data-testid="text-not-found">Scam Report Not Found</h1>
          <p className="text-muted-foreground mb-8">This scam report does not exist or has been removed.</p>
          <Link href="/scam-intel" className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium" data-testid="link-back-scam-intel">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Browse Scam Intelligence
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const risk = riskConfig[scam.riskLevel] || riskConfig.medium;
  const shareUrl = `https://www.getcyberright.com/scam-intel/${scam.slug}`;

  const blogPosting: BlogPostingData = {
    type: "BlogPosting",
    headline: scam.scamName,
    description: scam.metaDescription,
    datePublished: scam.dateDetected || scam.lastUpdated,
    dateModified: scam.lastUpdated,
    author: { name: "GetCyberRight Team", url: "https://www.getcyberright.com" },
    publisher: { name: "GetCyberRight", logo: "https://www.getcyberright.com/favicon.svg" },
    articleSection: "Scam Intelligence",
    keywords: [scam.scamName, scam.scamCategory, ...(scam.platformUsed || [])],
  };

  const breadcrumbs: BreadcrumbData = {
    type: "BreadcrumbList",
    items: [
      { name: "Home", url: "https://www.getcyberright.com/" },
      { name: "Scam Intelligence", url: "https://www.getcyberright.com/scam-intel" },
      { name: scam.scamName, url: shareUrl },
    ],
  };

  const structuredData: Array<BlogPostingData | FAQData | BreadcrumbData> = [blogPosting, breadcrumbs];
  if (scam.faq && scam.faq.length > 0) {
    structuredData.push({ type: "FAQPage", items: scam.faq });
  }

  const tocItems = [
    ...(scam.howItWorks?.length ? [{ id: "how-it-works", label: "How It Works" }] : []),
    ...(scam.warningSigns?.length ? [{ id: "warning-signs", label: "Warning Signs" }] : []),
    ...(scam.exampleMessages?.length ? [{ id: "examples", label: "Real Examples" }] : []),
    ...(scam.preventionTips?.length ? [{ id: "prevention", label: "Prevention Tips" }] : []),
    ...(scam.faq?.length ? [{ id: "faq", label: "FAQ" }] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={structuredData} />
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
          <Link href="/scam-intel" className="inline-flex items-center text-white/60 hover:text-white text-sm mb-6 transition-colors" data-testid="link-back-scam-intel">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Scam Intelligence
          </Link>

          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 ${risk.bg} rounded-lg`}>
              <AlertTriangle className={`h-8 w-8 ${risk.icon}`} />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className={`${scam.riskLevel === "high" ? "bg-red-600" : scam.riskLevel === "medium" ? "bg-orange-600" : "bg-green-600"} text-white`}>
                  {risk.label}
                </Badge>
                {scam.scamCategory && <Badge variant="outline" className="border-white/20 text-white/70">{scam.scamCategory}</Badge>}
              </div>
              <h1 className="text-[1.75rem] sm:text-3xl md:text-4xl font-extrabold tracking-[-0.025em]" data-testid="text-scam-title">{scam.scamName}</h1>
              <p className="text-white/60 mt-2">{scam.metaDescription}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-white/60">
            {scam.platformUsed?.map((p) => (
              <Badge key={p} variant="outline" className="border-white/20 text-white/70">{p}</Badge>
            ))}
            {scam.targetAudience?.length > 0 && (
              <span className="flex items-center gap-1"><Users className="h-4 w-4" /> Targets: {scam.targetAudience.join(", ")}</span>
            )}
            {scam.averageLoss && (
              <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> Avg loss: {scam.averageLoss}</span>
            )}
            {scam.reportCount > 0 && (
              <span className="flex items-center gap-1"><Flag className="h-4 w-4" /> {scam.reportCount.toLocaleString()} reports</span>
            )}
            {scam.regions?.length > 0 && (
              <span className="flex items-center gap-1" data-testid="text-regions">
                <MapPin className="h-4 w-4" /> Regions: {scam.regions.map((r) => r.charAt(0).toUpperCase() + r.slice(1).toLowerCase()).join(", ")}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-slate-700">
            <div className="[&_span]:text-white/60 [&_button]:border-white/20 [&_button]:text-white/60" data-testid="share-buttons-header">
              <ShareButtons
                url={shareUrl}
                title={`${scam.scamName} - Scam Alert`}
                description={scam.metaDescription}
                variant="compact"
              />
            </div>
            {(scam.dateDetected || scam.lastUpdated) && (
              <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
                <Calendar className="h-3 w-3" />
                {scam.lastUpdated ? `Updated ${new Date(scam.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` :
                  `Detected ${new Date(scam.dateDetected).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile quick-scan CTA (hidden on desktop where sidebar has this) */}
      <div className="lg:hidden bg-orange-50 dark:bg-orange-950/20 border-b border-orange-200 dark:border-orange-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <p className="text-sm font-medium">Think you've been targeted?</p>
          <Link href="/scam-checker">
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white gap-1" data-testid="button-mobile-scan">
              <Search className="h-3 w-3" />
              Scan It
            </Button>
          </Link>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {tocItems.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Table of Contents</h3>
                <nav className="space-y-1" data-testid="nav-toc">
                  {tocItems.map((item) => (
                    <a key={item.id} href={`#${item.id}`} className="block text-sm text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 py-1 transition-colors">
                      {item.label}
                    </a>
                  ))}
                </nav>

                <Card className="mt-6 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-sm font-medium mb-2">Think you've been targeted?</p>
                    <Link href="/scam-checker" className="text-sm text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1">
                      Scan it with our AI Checker
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>

                <Card className="mt-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Share2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <p className="text-sm font-medium">Warn Others</p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">Share this scam report to help protect friends and family.</p>
                    <ShareButtons url={shareUrl} title={`${scam.scamName} - Scam Alert`} description={scam.metaDescription} variant="compact" />
                  </CardContent>
                </Card>
              </div>
            </aside>
          )}

          <div className={tocItems.length > 0 ? "lg:col-span-3 space-y-10" : "lg:col-span-4 max-w-3xl mx-auto space-y-10"}>
            {scam.howItWorks && scam.howItWorks.length > 0 && (
              <section id="how-it-works" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Eye className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  How This Scam Works
                </h2>
                <div className="space-y-3">
                  {scam.howItWorks.map((item, i) => (
                    <Card key={i}>
                      <CardContent className="pt-4 pb-4 flex items-start gap-3">
                        <span className="flex items-center justify-center h-7 w-7 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-sm font-bold shrink-0">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-medium">{item.step}</p>
                          {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {scam.warningSigns && scam.warningSigns.length > 0 && (
              <section id="warning-signs" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-orange-500" />
                  Warning Signs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {scam.warningSigns.map((sign, i) => (
                    <Card key={i} className="border-orange-200 dark:border-orange-800">
                      <CardContent className="pt-4 pb-4 flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                        <p className="text-sm">{sign}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {scam.exampleMessages && scam.exampleMessages.length > 0 && (
              <section id="examples" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <MessageSquareWarning className="h-6 w-6 text-red-500" />
                  Real Examples
                </h2>
                <div className="space-y-3">
                  {scam.exampleMessages.map((msg, i) => (
                    <Card key={i} className="bg-red-50/50 dark:bg-red-950/10 border-red-200 dark:border-red-800">
                      <CardContent className="pt-4 pb-4">
                        {msg.context && <Badge variant="outline" className="mb-2 text-xs">{msg.context}</Badge>}
                        <p className="text-sm italic text-muted-foreground">"{msg.text}"</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {scam.preventionTips && scam.preventionTips.length > 0 && (
              <section id="prevention" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  How to Protect Yourself
                </h2>
                <div className="space-y-3">
                  {scam.preventionTips.map((tip, i) => (
                    <Card key={i} className="border-l-4 border-l-green-500">
                      <CardContent className="pt-4 pb-4 flex items-start gap-3">
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold shrink-0">
                          {i + 1}
                        </span>
                        <p className="text-sm">{tip}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {scam.faq && scam.faq.length > 0 && (
              <section id="faq" className="scroll-mt-20">
                <div className="flex items-center gap-2 mb-6">
                  <HelpCircle className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                </div>
                <Accordion type="multiple" className="space-y-2" data-testid="accordion-faq">
                  {scam.faq.map((item, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-left font-medium" data-testid={`faq-question-${i}`}>
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground" data-testid={`faq-answer-${i}`}>
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-6 md:p-8" data-testid="cta-been-targeted">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full shrink-0">
                  <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">Have you been targeted by this scam?</h3>
                  <p className="text-sm text-muted-foreground">
                    If you think you've received a suspicious message, email, or link related to this scam, use our free AI-powered scam checker to analyze it instantly.
                  </p>
                </div>
                <Link href="/scam-checker">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2 whitespace-nowrap" data-testid="button-check-targeted">
                    <Search className="h-4 w-4" />
                    Check Now
                  </Button>
                </Link>
              </div>
            </div>

            {(() => {
              const allSlugs = getAllScamSlugs();
              const scamNameWords = (scam.scamName || "").toLowerCase().replace(/-/g, " ").split(" ").filter((w: string) => w.length > 3);
              const scamCatWords = (scam.scamCategory || "").toLowerCase().replace(/-/g, " ").split(" ").filter((w: string) => w.length > 3);
              const searchWords = [...new Set([...scamNameWords, ...scamCatWords])];
              const matchedSlugs = allSlugs.filter(s => {
                const slugWords = s.replace(/-/g, " ");
                return searchWords.some(w => slugWords.includes(w));
              });
              const matchedPages = matchedSlugs.map(s => getScamBySlug(s)).filter(Boolean).slice(0, 3);
              if (matchedPages.length === 0) return null;
              return (
                <section className="mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    <h2 className="text-xl font-bold">In-depth Scam Guides</h2>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Read our comprehensive prevention guides for detailed protection strategies.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {matchedPages.map((page: any) => (
                      <Link key={page.slug} href={`/scams/${page.slug}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-orange-500" data-testid={`link-guide-${page.slug}`}>
                          <CardContent className="p-4 flex items-center justify-between">
                            <div>
                              <span className="text-sm font-medium">{page.title}</span>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{page.metaDescription}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })()}

            {relatedScams.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-bold mb-4">Related Scams</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedScams.map((rel) => (
                    <Link key={rel.slug} href={`/scam-intel/${rel.slug}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer" data-testid={`card-related-${rel.slug}`}>
                        <CardContent className="pt-4 pb-4 flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <Badge className={`${riskColors[rel.riskLevel] || ""} shrink-0 text-xs`}>
                              {rel.riskLevel?.toUpperCase()}
                            </Badge>
                            <span className="text-sm font-medium truncate">{rel.scamName}</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {relatedScams.length === 0 && scam.relatedScamSlugs && scam.relatedScamSlugs.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-bold mb-4">Related Scams</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {scam.relatedScamSlugs.map((relSlug) => (
                    <Link key={relSlug} href={`/scam-intel/${relSlug}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="pt-4 pb-4 flex items-center justify-between">
                          <span className="text-sm font-medium">{relSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl" data-testid="cta-share-bottom">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-base font-bold mb-1 flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Help Protect Others
                  </h3>
                  <p className="text-sm text-muted-foreground">Share this scam report to warn friends and family.</p>
                </div>
                <div className="shrink-0">
                  <ShareButtons url={shareUrl} title={`${scam.scamName} - Scam Alert`} description={scam.metaDescription} variant="compact" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
