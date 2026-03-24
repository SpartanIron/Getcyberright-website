import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Shield, BookOpen, Lock, Eye, Users, Smartphone, ArrowRight, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Guide {
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

const EVERGREEN_GUIDES: Guide[] = [
  {
    id: "breach-response",
    title: "How to Prevent Identity Theft: A Complete Guide",
    subtitle: "Step-by-step protection guide",
    description: "Your email, password, or personal info could be exposed. Here's exactly what to do — in order — to protect yourself and your family before criminals can use your data.",
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
    description: "Forget complicated rules. Here are simple habits that protect your whole family's accounts — plus how to set up a password manager together in 15 minutes.",
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
    description: "Scammers are getting smarter, but they still leave clues. Learn the red flags that reveal a fake email, text, or website — with side-by-side comparisons of real vs. fake.",
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
    description: "How to talk to your parents or grandparents about online safety without being condescending — plus simple tools you can set up for them remotely.",
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
    description: "Deepfake voices, AI-written phishing emails, and fake video calls — criminals are using AI in ways most people don't expect. Learn to recognize the new generation of scams.",
    icon: BookOpen,
    href: "/guides/ai-powered-scams-explained",
    color: "text-teal-500",
    bgGradient: "from-teal-500/10 to-cyan-500/5",
    audience: "Everyone",
    readTime: "8 min",
  },
];

function getWeeklyRotation(): Guide {
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return EVERGREEN_GUIDES[weekNumber % EVERGREEN_GUIDES.length];
}

export function FeaturedGuide() {
  const [featured] = useState(getWeeklyRotation);
  const otherGuides = EVERGREEN_GUIDES.filter(g => g.id !== featured.id).slice(0, 3);
  const FeaturedIcon = featured.icon;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30" data-testid="section-featured-guides">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Badge variant="outline" className="mb-2 text-xs font-medium">
              <BookOpen className="w-3 h-3 mr-1" />
              Featured Guide
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Protect Your Family Today
            </h2>
            <p className="text-muted-foreground mt-1">
              Practical, jargon-free guides you can use right now
            </p>
          </div>
          <Link href="/guides" className="hidden sm:flex items-center gap-1 text-sm text-primary hover:underline" data-testid="link-all-guides">
            All guides <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div
            className={`lg:col-span-2 rounded-2xl bg-gradient-to-br ${featured.bgGradient} border p-6 sm:p-8 flex flex-col justify-between min-h-[280px] transition-all hover:shadow-lg`}
            data-testid={`guide-featured-${featured.id}`}
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-background/80 flex items-center justify-center`}>
                  <FeaturedIcon className={`w-6 h-6 ${featured.color}`} />
                </div>
                <div>
                  <Badge variant="secondary" className="text-[10px]">{featured.audience}</Badge>
                  <span className="text-xs text-muted-foreground ml-2">{featured.readTime} read</span>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                {featured.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-1">{featured.subtitle}</p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                {featured.description}
              </p>
            </div>
            <div className="mt-6">
              <Link href={featured.href}>
                <Button className="gap-2" data-testid="button-read-featured-guide">
                  Read the Guide <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
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
            <Link href="/guides" className="sm:hidden flex items-center justify-center gap-1 text-sm text-primary hover:underline pt-2" data-testid="link-all-guides-mobile">
              View all guides <ChevronRight className="w-4 h-4" />
            </Link>
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
