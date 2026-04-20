"use client";

import { useState } from "react";
import { Link } from "@/lib/navigation";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, ArrowRight, AlertTriangle, Shield, FileText, Lock, Eye, Users, Smartphone, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const severityColors: Record<string, string> = {
  critical: "bg-red-700 text-white",
  high: "bg-orange-700 text-white",
  medium: "bg-amber-700 text-white",
  low: "bg-green-700 text-white",
};

const severityBg: Record<string, string> = {
  critical: "border-l-red-500",
  high: "border-l-orange-500",
  medium: "border-l-amber-500",
  low: "border-l-green-500",
};

const staticGuides = [
  { title: "How to Prevent Identity Theft", description: "Learn the essential steps to protect your personal information from identity thieves and data brokers.", href: "/scams/identity-theft", icon: Shield },
  { title: "How to Spot Fake Emails and Texts", description: "Spot fake emails before they trick you. Real examples and red flags to watch for.", href: "/scams/phishing", icon: FileText },
  { title: "Protecting Seniors from Scams", description: "A practical guide to helping older adults recognize and avoid common scam tactics.", href: "/seniors", icon: BookOpen },
];

const staticAlerts = [
  { title: "PayPal Fake Email Scam", description: "Fraudulent emails impersonating PayPal asking users to verify their accounts.", risk: "high", href: "/scams/paypal-scam" },
  { title: "Crypto Investment Scam", description: "Fake cryptocurrency platforms promising guaranteed returns.", risk: "critical", href: "/scams/crypto-scam" },
  { title: "Amazon Delivery Scam", description: "Text messages about fake Amazon deliveries designed to steal personal data.", risk: "medium", href: "/scams/amazon-scam" },
];

interface FeaturedGuide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Shield;
  href: string;
  color: string;
  bgGradient: string;
  audience: string;
  readTime: string;
}

const EVERGREEN_GUIDES: FeaturedGuide[] = [
  {
    id: "breach-response",
    title: "How to Prevent Identity Theft: A Complete Guide",
    subtitle: "Step-by-step protection guide",
    description: "Your email, password, or personal info could be exposed. Here's exactly what to do, in order, to protect yourself and your family before criminals can use your data.",
    icon: Shield,
    href: "/guides/how-to-prevent-identity-theft",
    color: "text-red-500",
    bgGradient: "from-red-500/10 to-orange-500/5",
    audience: "Everyone",
    readTime: "5 min",
  },
  {
    id: "family-passwords",
    title: "Password Security Best Practices: Create and Manage Strong Passwords",
    subtitle: "No tech skills needed",
    description: "Forget complicated rules. Here are simple habits that protect your whole family's accounts, plus how to set up a password manager together in 15 minutes.",
    icon: Lock,
    href: "/guides/password-security-best-practices",
    color: "text-blue-500",
    bgGradient: "from-blue-500/10 to-cyan-500/5",
    audience: "Families",
    readTime: "7 min",
  },
  {
    id: "phone-privacy",
    title: "Online Privacy Protection: How to Keep Your Data Safe",
    subtitle: "Protect your data",
    description: "Your phone and browser are sharing more than you think. Learn the key settings and habits that stop apps from tracking your location, contacts, and browsing.",
    icon: Smartphone,
    href: "/guides/online-privacy-protection-guide",
    color: "text-green-500",
    bgGradient: "from-green-500/10 to-emerald-500/5",
    audience: "Everyone",
    readTime: "6 min",
  },
  {
    id: "spot-scams",
    title: "How to Detect Phishing Emails: Red Flags and Real Examples",
    subtitle: "With real examples",
    description: "Scammers are getting smarter, but they still leave clues. Learn the red flags that reveal a fake email, text, or website, with side-by-side comparisons of real vs. fake.",
    icon: Eye,
    href: "/guides/how-to-detect-phishing-emails",
    color: "text-purple-500",
    bgGradient: "from-purple-500/10 to-violet-500/5",
    audience: "Everyone",
    readTime: "6 min",
  },
  {
    id: "senior-safety",
    title: "Protecting Seniors from Online Scams: A Family Guide",
    subtitle: "Have the conversation",
    description: "How to talk to your parents or grandparents about online safety without being condescending, plus simple tools you can set up for them remotely.",
    icon: Users,
    href: "/guides/protecting-seniors-from-online-scams",
    color: "text-amber-500",
    bgGradient: "from-amber-500/10 to-yellow-500/5",
    audience: "Adult Children",
    readTime: "8 min",
  },
  {
    id: "ai-scams",
    title: "AI-Powered Scams: How Criminals Use Artificial Intelligence to Trick You",
    subtitle: "Updated for 2026",
    description: "Deepfake voices, AI-written phishing emails, and fake video calls. Criminals are using AI in ways most people don't expect. Learn to recognize the new generation of scams.",
    icon: BookOpen,
    href: "/guides/ai-powered-scams-explained",
    color: "text-teal-500",
    bgGradient: "from-teal-500/10 to-cyan-500/5",
    audience: "Everyone",
    readTime: "8 min",
  },
];

function getWeeklyRotation(): FeaturedGuide {
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return EVERGREEN_GUIDES[weekNumber % EVERGREEN_GUIDES.length];
}

type CuratedLead = {
  slug: string;
  title: string;
  publishedAt: string | null;
  whatChanged: string | null;
  curatedTopic: string | null;
};

export function ContentPreview() {
  const { data: alertsData } = useQuery<any[]>({ queryKey: ["/api/alerts"], staleTime: 10 * 60 * 1000 });
  const { data: curatedData } = useQuery<{ articles: CuratedLead[] }>({
    queryKey: ["/api/news/curated"],
    staleTime: 10 * 60 * 1000,
  });

  const hasLiveAlerts = alertsData && alertsData.length > 0;
  const curatedLead = curatedData?.articles?.[0] || null;

  const [featured] = useState(getWeeklyRotation);
  const otherGuides = EVERGREEN_GUIDES.filter(g => g.id !== featured.id).slice(0, 2);
  const FeaturedIcon = featured.icon;

  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-muted/30" data-testid="section-content-preview" aria-labelledby="content-heading">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 sm:mb-16">
          <h2 id="content-heading" className="text-4xl sm:text-5xl font-extrabold text-foreground mb-5" data-testid="text-content-heading">
            Latest from the Lab
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Original editorial from the GetCyberRight team, plus the safety guides and active alerts your family needs this week.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-14 items-start">
          <div>
            {curatedLead && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">From the Lab</h3>
                  </div>
                  <Link href="/perspectives">
                    <span className="text-sm font-semibold text-primary hover:underline flex items-center gap-1.5" data-testid="link-all-perspectives">
                      All perspectives <ArrowRight className="w-3.5 h-3.5 cta-arrow-right" />
                    </span>
                  </Link>
                </div>
                <Link href={`/news/${curatedLead.slug}`} className="block">
                  <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/0 border border-primary/20 p-6 sm:p-8 hover:border-primary/40 transition-colors" data-testid="curated-lead-card">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-[10px]">Editorial</Badge>
                      {curatedLead.curatedTopic && (
                        <Badge variant="outline" className="text-[10px]">{curatedLead.curatedTopic}</Badge>
                      )}
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold text-foreground mb-3">{curatedLead.title}</h4>
                    {curatedLead.whatChanged && (
                      <p className="text-base text-muted-foreground leading-relaxed line-clamp-3 mb-4">{curatedLead.whatChanged}</p>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      Read the piece <ArrowRight className="w-4 h-4 cta-arrow-right" />
                    </span>
                  </div>
                </Link>
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">This Week's Essential Guide</h3>
              </div>
              <Link href="/guides">
                <span className="text-sm font-semibold text-primary hover:underline flex items-center gap-1.5" data-testid="link-all-guides">
                  All guides <ArrowRight className="w-3.5 h-3.5 cta-arrow-right" />
                </span>
              </Link>
            </div>

            <div
              className={`rounded-2xl bg-gradient-to-br ${featured.bgGradient} border p-6 sm:p-8 mb-6`}
              data-testid={`guide-featured-${featured.id}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-background/80 flex items-center justify-center">
                  <FeaturedIcon className={`w-6 h-6 ${featured.color}`} />
                </div>
                <div>
                  <Badge variant="secondary" className="text-[10px]">{featured.audience}</Badge>
                  <span className="text-xs text-muted-foreground ml-2">{featured.readTime} read</span>
                </div>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{featured.title}</h4>
              <p className="text-sm text-muted-foreground mb-1">{featured.subtitle}</p>
              <p className="text-muted-foreground leading-relaxed mt-3">{featured.description}</p>
              <div className="mt-5">
                <Link href={featured.href}>
                  <Button className="gap-2" data-testid="button-read-featured-guide">
                    Read the Guide <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {otherGuides.map((guide) => {
                const GuideIcon = guide.icon;
                return (
                  <Link
                    key={guide.id}
                    href={guide.href}
                    className="block rounded-xl border p-4 transition-all hover:shadow-md hover:border-primary/20 bg-card"
                    data-testid={`guide-card-${guide.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${guide.bgGradient} flex items-center justify-center flex-shrink-0`}>
                        <GuideIcon className={`w-5 h-5 ${guide.color}`} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
                          {guide.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge variant="outline" className="text-[10px] py-0">{guide.audience}</Badge>
                          <span className="text-xs text-muted-foreground">{guide.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Active Scam Alerts</h3>
              </div>
              <Link href="/alerts">
                <span className="text-sm font-semibold text-primary hover:underline flex items-center gap-1.5" data-testid="link-all-alerts">
                  View all <ArrowRight className="w-3.5 h-3.5 cta-arrow-right" />
                </span>
              </Link>
            </div>

            <div className="space-y-3">
              {(hasLiveAlerts ? alertsData!.slice(0, 4) : staticAlerts).map((alert: any, index: number) => {
                const risk = alert.riskLevel || alert.risk || alert.severity || "medium";
                const alertTitle = alert.threatName || alert.title || "Unknown Threat";
                const alertDesc = alert.description || alert.summary || "";
                const alertHref = hasLiveAlerts ? `/alerts/${alert.slug}` : alert.href;
                return (
                  <Link key={index} href={alertHref}>
                    <div
                      className={`group bg-card rounded-xl border border-border border-l-4 ${severityBg[risk] || severityBg.medium} p-4 cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-300`}
                      data-testid={`card-alert-preview-${index}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                            {alertTitle}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {alertDesc}
                          </p>
                        </div>
                        <Badge className={`text-[10px] flex-shrink-0 ${severityColors[risk] || severityColors.medium}`}>
                          {risk}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function NewsPageGuidesSidebar() {
  const guides = EVERGREEN_GUIDES.slice(0, 4);

  return (
    <div className="rounded-xl border bg-card p-5" data-testid="sidebar-guides">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm text-foreground">Safety Guides</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Step-by-step guides to protect your family
      </p>
      <div className="space-y-3">
        {guides.map((guide) => {
          const GuideIcon = guide.icon;
          return (
            <Link
              key={guide.id}
              href={guide.href}
              className="flex items-center gap-2.5 py-1.5 text-sm text-foreground hover:text-primary transition-colors"
              data-testid={`sidebar-guide-${guide.id}`}
            >
              <GuideIcon className={`w-4 h-4 ${guide.color} flex-shrink-0`} />
              <span className="line-clamp-1">{guide.title}</span>
            </Link>
          );
        })}
      </div>
      <Link href="/guides" className="flex items-center gap-1 text-xs text-primary hover:underline mt-4 pt-3 border-t" data-testid="link-sidebar-all-guides">
        View all guides <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

export { EVERGREEN_GUIDES };
