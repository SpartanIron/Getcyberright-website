"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "@/lib/navigation";
import { useQuery } from "@tanstack/react-query";
import { StructuredData, type BlogPostingData, type FAQData, type BreadcrumbData } from "@/components/structured-data";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Clock, Calendar, ArrowLeft, User, HelpCircle, Loader2, ArrowRight, PlayCircle } from "lucide-react";
import { renderMarkdown } from "@/lib/markdown";
import { GuideVideoPlayer, getGuideVideoUrl } from "@/components/guide-video-player";
import { RelatedResources, RESOURCE_LINKS } from "@/components/related-resources";

interface GuideDetail {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  content: string;
  headings: Array<{ level: number; text: string; id: string }>;
  tableOfContents: Array<{ id: string; text: string; level: number }>;
  faq: Array<{ question: string; answer: string }>;
  category: string;
  tags: string[];
  targetKeywords: string[];
  wordCount: number;
  readingTimeMinutes: number;
  publishedAt: string;
  updatedAt: string;
  authorName: string;
  featuredImage: string | null;
  relatedGuideIds: string[];
  relatedScamSlugs: string[];
  relatedToolPaths: string[];
}

export default function GuideDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";

  const { data: guide, isLoading, error } = useQuery<GuideDetail>({
    queryKey: ["/api/guides", slug],
    queryFn: async () => {
      const res = await fetch(`/api/guides/${slug}`);
      if (!res.ok) throw new Error("Guide not found");
      return res.json();
    },
    enabled: !!slug,
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

  if (error || !guide) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <BookOpen className="h-10 w-10 text-amber-500 mx-auto mb-3" />
          <h1 className="text-2xl font-bold mb-2" data-testid="text-not-found">Guide No Longer Available</h1>
          <p className="text-muted-foreground mb-6">This guide may have been updated or replaced with newer content.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/guides">
              <span className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium" data-testid="link-back-guides">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Browse All Guides
              </span>
            </Link>
            <Link href="/news">
              <span className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium" data-testid="link-latest-news">
                Latest News
              </span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const blogPosting: BlogPostingData = {
    type: "BlogPosting",
    headline: guide.title,
    description: guide.metaDescription,
    datePublished: guide.publishedAt || guide.updatedAt,
    dateModified: guide.updatedAt,
    author: { name: guide.authorName || "GetCyberRight Team", url: "https://www.getcyberright.com" },
    publisher: { name: "GetCyberRight", logo: "https://www.getcyberright.com/favicon.svg" },
    image: guide.featuredImage || undefined,
    articleSection: guide.category || "Cybersecurity",
    keywords: guide.targetKeywords || guide.tags,
    wordCount: guide.wordCount,
  };

  const breadcrumbs: BreadcrumbData = {
    type: "BreadcrumbList",
    items: [
      { name: "Home", url: "https://www.getcyberright.com/" },
      { name: "Guides", url: "https://www.getcyberright.com/guides" },
      { name: guide.title, url: `https://www.getcyberright.com/guides/${guide.slug}` },
    ],
  };

  const structuredDataItems: Array<BlogPostingData | FAQData | BreadcrumbData> = [blogPosting, breadcrumbs];
  if (guide.faq && guide.faq.length > 0) {
    structuredDataItems.push({ type: "FAQPage", items: guide.faq });
  }

  const toc = guide.tableOfContents || guide.headings || [];
  const readTime = guide.readingTimeMinutes || Math.ceil((guide.wordCount || 0) / 200);
  const publishDate = guide.publishedAt || guide.updatedAt;

    const [activeSection, setActiveSection] = useState<string>("");

    useEffect(() => {
          if (toc.length === 0) return;
          const headingIds = toc.map((item, i) => item.id || `section-${i}`);
          const observer = new IntersectionObserver(
                  (entries) => {
                            entries.forEach((entry) => {
                                        if (entry.isIntersecting) {
                                                      setActiveSection(entry.target.id);
                                        }
                            });
                  },
            { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
                );
          headingIds.forEach((id) => {
                  const el = document.getElementById(id);
                  if (el) observer.observe(el);
          });
          return () => observer.disconnect();
    }, [toc]);
  

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={structuredDataItems} />
      <Navigation />

      <div className="bg-hero text-hero-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-hero via-hero to-hero dark:from-[#0A2A3C] dark:via-[#0A2A3C] dark:to-[#00293C]" />
        <div className="absolute pointer-events-none hidden md:block" aria-hidden="true" style={{ top: 0, right: 0, width: "55%", height: "100%", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-40%", right: "2%", width: "50px", height: "220%", background: "linear-gradient(180deg, #003A52 0%, #0D4D66 50%, #003A52 100%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
          <div style={{ position: "absolute", top: "-40%", right: "10%", width: "2px", height: "220%", background: "linear-gradient(180deg, transparent 10%, rgba(45, 212, 191, 0.4) 50%, transparent 90%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
          <div style={{ position: "absolute", top: "-35%", right: "18%", width: "35px", height: "220%", background: "linear-gradient(180deg, #5eead4 0%, #2dd4bf 35%, #14b8a6 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.55 }} />
          <div style={{ position: "absolute", top: "-35%", right: "26%", width: "2px", height: "220%", background: "linear-gradient(180deg, transparent 15%, hsla(16, 95%, 58%, 0.35) 50%, transparent 85%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
          <div style={{ position: "absolute", top: "-30%", right: "32%", width: "50px", height: "220%", background: "linear-gradient(180deg, hsl(16, 100%, 62%) 0%, hsl(16, 95%, 52%) 40%, hsl(16, 90%, 42%) 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.5 }} />
        </div>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <Link href="/guides" className="inline-flex items-center text-white/60 hover:text-white text-sm mb-6 transition-colors" data-testid="link-back-guides">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Guides
          </Link>

          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-[1.75rem] sm:text-3xl md:text-4xl font-extrabold tracking-[-0.025em]" data-testid="text-guide-title">{guide.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-white/60 text-sm">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {guide.authorName || "GetCyberRight Team"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(publishDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {readTime} min read
                </span>
              </div>
            </div>
          </div>

          {guide.tags && guide.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {guide.tags.slice(0, 5).map((tag) => (
                <Badge key={tag} variant="outline" className="border-white/20 text-white/70">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Table of Contents</h3>
                <nav className="space-y-1" data-testid="nav-toc">
                  {toc.map((item, i) => (
                    <a
                className={`block text-sm py-1 transition-colors ${activeSection === (item.id || `section-${i}`) ? "text-teal-600 dark:text-teal-400 font-semibold border-l-2 border-teal-600 dark:border-teal-400 pl-2" : "text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400"}`}
                      href={`#${item.id || `section-${i}`}`}
                      className="block text-sm text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 py-1 transition-colors"
                      style={{ paddingLeft: ((item.level || 2) - 2) * 12 }}
                      data-testid={`link-toc-${i}`}
                    >
                      {item.text}
                    </a>
                  ))}
                  {guide.faq && guide.faq.length > 0 && (
                    <a href="#faq" className="block text-sm text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 py-1 transition-colors">
                      FAQ
                    </a>
                  )}
                </nav>

                <Card className="mt-6 bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-sm font-medium mb-2">Need help?</p>
                    <Link href="/scam-checker" className="text-sm text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1">
                      Try GCR Scam Guard
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </aside>
          )}

          <div className={toc.length > 0 ? "lg:col-span-3" : "lg:col-span-4 max-w-3xl mx-auto"}>
            {(() => {
              const videoUrl = getGuideVideoUrl(slug);
              return videoUrl ? (
                <GuideVideoPlayer src={videoUrl} title={guide.title} poster={guide.featuredImage || undefined} />
              ) : guide.featuredImage ? (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img src={guide.featuredImage} alt={guide.title} className="w-full h-64 md:h-80 object-cover" />
                </div>
              ) : null;
            })()}

            <article 
              className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-teal-600 dark:prose-a:text-teal-400"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(guide.content || "") }}
              data-testid="article-content"
            />

            {guide.faq && guide.faq.length > 0 && (
              <section id="faq" className="mt-12 scroll-mt-20">
                <div className="flex items-center gap-2 mb-6">
                  <HelpCircle className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                </div>
                <Accordion type="multiple" className="space-y-2" data-testid="accordion-faq">
                  {guide.faq.map((item, i) => (
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

            {guide.relatedScamSlugs && guide.relatedScamSlugs.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-bold mb-4">Related Content</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {guide.relatedScamSlugs.map((slug) => (
                    <Link key={slug} href={`/scams/${slug}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="pt-4 pb-4 flex items-center justify-between">
                          <span className="text-sm font-medium">{slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Internal Linking: Recommended Tools & Related Guides */}
                        <RelatedResources
                                        title="Explore Related Tools & Guides"
                                        subtitle={`More resources related to ${guide.category} topics`}
                                        resources={[
                                                          ...(guide.category?.toLowerCase().includes('phishing') || guide.category?.toLowerCase().includes('scam')
                                                                                ? [RESOURCE_LINKS.scamChecker, RESOURCE_LINKS.phishingGuide, RESOURCE_LINKS.emergencyHelp]
                                                                                : []),
                                                          ...(guide.category?.toLowerCase().includes('password') || guide.category?.toLowerCase().includes('security')
                                                                                ? [RESOURCE_LINKS.passwordGenerator, RESOURCE_LINKS.passwordGuide, RESOURCE_LINKS.breachDashboard]
                                                                                : []),
                                                          ...(guide.category?.toLowerCase().includes('privacy') || guide.category?.toLowerCase().includes('identity')
                                                                                ? [RESOURCE_LINKS.dataRemoval, RESOURCE_LINKS.privacyGuide, RESOURCE_LINKS.identityTheftGuide]
                                                                                : []),
                                                          ...(guide.category?.toLowerCase().includes('family') || guide.category?.toLowerCase().includes('senior') || guide.category?.toLowerCase().includes('kid')
                                                                                ? [RESOURCE_LINKS.kidsHub, RESOURCE_LINKS.seniorsHub, RESOURCE_LINKS.parentsHub]
                                                                                : []),
                                                          ...(guide.category?.toLowerCase().includes('social')
                                                                                ? [RESOURCE_LINKS.dataRemoval, RESOURCE_LINKS.privacyGuide, RESOURCE_LINKS.scamChecker]
                                                                                : []),
                                                          RESOURCE_LINKS.allTools,
                                                          RESOURCE_LINKS.allGuides,
                                                        ].filter((v, i, a) => a.findIndex(t => t.href === v.href) === i).slice(0, 6)}
                                      />
          </div>
        </div>
      </main>

      <section className="max-w-3xl mx-auto px-4 pb-10">
        <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5 flex flex-col sm:flex-row items-center gap-4 justify-between" data-testid="cta-guide-tools">
          <div>
            <h3 className="font-semibold mb-1">Got a suspicious link, email, or text?</h3>
            <p className="text-sm text-muted-foreground">Run it through our free Scam Guard before you click or reply.</p>
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 font-semibold whitespace-nowrap"
            data-testid="link-guide-tools"
          >
            Check a suspicious link now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
