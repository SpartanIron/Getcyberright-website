import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useSEO } from "@/hooks/use-seo";
import { StructuredData, type BlogPostingData, type FAQData, type BreadcrumbData } from "@/components/structured-data";
import { RelatedContent } from "@/components/related-content";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { getScamBySlug } from "@shared/scam-content";
import { AlertTriangle, Shield, Search, ChevronRight, ExternalLink, ArrowLeft, MessageSquareWarning, Eye, CheckCircle, HelpCircle, Database, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ScamIntelMatch {
  slug: string;
  scamName: string;
  riskLevel: string;
  reportCount: number;
}

export default function ScamPage() {
  const params = useParams<{ scamType: string }>();
  const scamType = params.scamType || "";
  const scam = getScamBySlug(scamType);

  const { data: relatedIntel = [] } = useQuery<ScamIntelMatch[]>({
    queryKey: ["/api/scam-intel/cross-link", scamType],
    queryFn: async () => {
      const res = await fetch(`/api/scam-intel/cross-link/${scamType}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!scam,
  });

  useSEO({
    title: scam?.metaTitle || "Scam Guide | GetCyberRight",
    description: scam?.metaDescription || "Learn about common scams and how to protect yourself.",
    keywords: scam?.keywords?.join(", ") || "scam prevention, fraud protection",
  });

  if (!scam) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4" data-testid="text-not-found">Scam Guide Not Found</h1>
          <p className="text-muted-foreground mb-8">The scam guide you are looking for does not exist or has been moved.</p>
          <Link href="/scam-checker" className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium" data-testid="link-scam-checker">
            <Search className="h-4 w-4 mr-2" />
            Try our Scam Checker Tool
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const blogPosting: BlogPostingData = {
    type: "BlogPosting",
    headline: scam.title,
    description: scam.metaDescription,
    datePublished: scam.lastUpdated,
    dateModified: scam.lastUpdated,
    author: { name: "GetCyberRight", url: "https://www.getcyberright.com" },
    publisher: { name: "GetCyberRight", logo: "https://www.getcyberright.com/favicon.svg" },
    articleSection: "Scam Prevention",
    keywords: scam.keywords,
    wordCount: Math.round(JSON.stringify(scam).length / 5),
  };

  const faqSchema: FAQData = {
    type: "FAQPage",
    items: scam.faq,
  };

  const breadcrumbs: BreadcrumbData = {
    type: "BreadcrumbList",
    items: [
      { name: "Home", url: "https://www.getcyberright.com/" },
      { name: "Scam Checker", url: "https://www.getcyberright.com/scam-checker" },
      { name: scam.title, url: `https://www.getcyberright.com/scams/${scam.slug}` },
    ],
  };

  const tocItems = [
    { id: "overview", label: "Overview" },
    { id: "how-it-works", label: "How It Works" },
    { id: "warning-signs", label: "Warning Signs" },
    { id: "examples", label: "Real Examples" },
    { id: "prevention", label: "Prevention Steps" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={[blogPosting, faqSchema, breadcrumbs]} />
      <Navigation />

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <Link href="/scam-checker" className="inline-flex items-center text-slate-300 hover:text-white text-sm mb-6 transition-colors" data-testid="link-back-scam-checker">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Scam Checker
          </Link>

          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-scam-title">{scam.title}</h1>
              <p className="text-slate-300 mt-2">Last updated: {new Date(scam.lastUpdated).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {scam.keywords.slice(0, 4).map((kw) => (
              <Badge key={kw} variant="outline" className="border-slate-500 text-slate-300">{kw}</Badge>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Table of Contents</h3>
              <nav className="space-y-1" data-testid="nav-toc">
                {tocItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-sm text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 py-1 transition-colors"
                    data-testid={`link-toc-${item.id}`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="mt-6 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                <Shield className="h-5 w-5 text-teal-600 mb-2" />
                <h4 className="font-medium text-sm mb-1">Got a suspicious message?</h4>
                <p className="text-xs text-muted-foreground mb-3">Paste it into our AI-powered Scam Checker for instant analysis.</p>
                <Link href="/scam-checker" className="text-sm text-teal-600 hover:text-teal-700 font-medium" data-testid="link-sidebar-scam-checker">
                  Check Now →
                </Link>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-10">
            <section id="overview">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" data-testid="heading-overview">
                <Eye className="h-6 w-6 text-teal-600" />
                Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg" data-testid="text-overview">{scam.overview}</p>
            </section>

            <section id="how-it-works">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" data-testid="heading-how-it-works">
                <Search className="h-6 w-6 text-teal-600" />
                How This Scam Works
              </h2>
              <div className="space-y-3">
                {scam.howItWorks.map((step, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 flex items-center justify-center text-sm font-bold">{i + 1}</span>
                    <p className="text-muted-foreground" data-testid={`text-step-${i}`}>{step}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="warning-signs">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" data-testid="heading-warning-signs">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
                Warning Signs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {scam.warningSigns.map((sign, i) => (
                  <Card key={i} className="border-orange-200 dark:border-orange-800/40">
                    <CardContent className="p-4 flex items-start gap-3">
                      <span className="text-orange-500 mt-0.5">⚠</span>
                      <span className="text-sm text-muted-foreground" data-testid={`text-warning-${i}`}>{sign}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section id="examples">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" data-testid="heading-examples">
                <MessageSquareWarning className="h-6 w-6 text-red-500" />
                Real Scam Examples
              </h2>
              <p className="text-sm text-muted-foreground mb-4">These are examples of messages used in this type of scam. Recognizing the patterns helps you stay safe.</p>
              <div className="space-y-4">
                {scam.exampleMessages.map((example, i) => (
                  <Card key={i} className="border-red-200 dark:border-red-800/40 bg-red-50/50 dark:bg-red-900/10">
                    <CardContent className="p-4">
                      <Badge variant="outline" className="mb-2 border-red-300 text-red-700 dark:text-red-400">{example.type}</Badge>
                      <p className="text-sm italic text-muted-foreground" data-testid={`text-example-${i}`}>"{example.content}"</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section id="prevention">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" data-testid="heading-prevention">
                <CheckCircle className="h-6 w-6 text-green-600" />
                How to Protect Yourself
              </h2>
              <div className="space-y-4">
                {scam.preventionSteps.map((step, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1 flex items-center gap-2" data-testid={`text-prevention-title-${i}`}>
                        <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground ml-8" data-testid={`text-prevention-desc-${i}`}>{step.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" data-testid="heading-faq">
                <HelpCircle className="h-6 w-6 text-teal-600" />
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {scam.faq.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left" data-testid={`btn-faq-${i}`}>{item.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground" data-testid={`text-faq-answer-${i}`}>{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-6 text-center">
              <Shield className="h-10 w-10 text-teal-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold mb-2">Think you have received a scam like this?</h3>
              <p className="text-sm text-muted-foreground mb-4">Paste the suspicious message into our free AI-powered Scam Checker for instant analysis.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/scam-checker" className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium" data-testid="link-cta-scam-checker">
                  <Search className="h-4 w-4 mr-2" />
                  Check a Suspicious Message
                </Link>
                <Link href="/emergency-help" className="inline-flex items-center px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors text-sm font-medium" data-testid="link-cta-emergency">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  I Have Been Scammed
                </Link>
              </div>
            </div>

            {relatedIntel.length > 0 && (
              <section className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="h-5 w-5 text-teal-600" />
                  <h2 className="text-xl font-bold">Live Intelligence Reports</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Our Scam Intelligence Center tracks real-time data on active scams related to this topic.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedIntel.map((intel) => (
                    <Link key={intel.slug} href={`/scam-intel/${intel.slug}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-teal-500" data-testid={`link-intel-${intel.slug}`}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <span className="text-sm font-medium">{intel.scamName}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs capitalize">{intel.riskLevel} risk</Badge>
                              {intel.reportCount > 0 && (
                                <span className="text-xs text-muted-foreground">{intel.reportCount.toLocaleString()} reports</span>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <RelatedContent
              currentCluster={scam.cluster}
              currentPath={`/scams/${scam.slug}`}
              relatedSlugs={scam.relatedScams}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
