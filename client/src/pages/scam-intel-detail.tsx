import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useSEO } from "@/hooks/use-seo";
import { StructuredData, type BlogPostingData, type FAQData, type BreadcrumbData } from "@/components/structured-data";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertTriangle, ArrowLeft, Eye, CheckCircle, Shield, MessageSquareWarning, HelpCircle, Loader2, ArrowRight, Users, DollarSign } from "lucide-react";

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
  relatedScamSlugs: string[];
  reportCount: number;
  averageLoss: string;
  dateDetected: string;
  lastUpdated: string;
}

const riskConfig: Record<string, { bg: string; icon: string; label: string }> = {
  high: { bg: "bg-red-500/20", icon: "text-red-400", label: "High Risk" },
  medium: { bg: "bg-orange-500/20", icon: "text-orange-400", label: "Medium Risk" },
  low: { bg: "bg-green-500/20", icon: "text-green-400", label: "Low Risk" },
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
      { name: scam.scamName, url: `https://www.getcyberright.com/scam-intel/${scam.slug}` },
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

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <Link href="/scam-intel" className="inline-flex items-center text-slate-300 hover:text-white text-sm mb-6 transition-colors" data-testid="link-back-scam-intel">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Scam Intelligence
          </Link>

          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 ${risk.bg} rounded-lg`}>
              <AlertTriangle className={`h-8 w-8 ${risk.icon}`} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className={`${scam.riskLevel === "high" ? "bg-red-600" : scam.riskLevel === "medium" ? "bg-orange-600" : "bg-green-600"} text-white`}>
                  {risk.label}
                </Badge>
                {scam.scamCategory && <Badge variant="outline" className="border-slate-500 text-slate-300">{scam.scamCategory}</Badge>}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-scam-title">{scam.scamName}</h1>
              <p className="text-slate-300 mt-2">{scam.metaDescription}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-300">
            {scam.platformUsed?.map((p) => (
              <Badge key={p} variant="outline" className="border-slate-500 text-slate-300">{p}</Badge>
            ))}
            {scam.targetAudience?.length > 0 && (
              <span className="flex items-center gap-1"><Users className="h-4 w-4" /> Targets: {scam.targetAudience.join(", ")}</span>
            )}
            {scam.averageLoss && (
              <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> Avg loss: {scam.averageLoss}</span>
            )}
          </div>
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

            {scam.relatedScamSlugs && scam.relatedScamSlugs.length > 0 && (
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
