import { useState, useEffect, useCallback } from "react";
import { Link, useSearch } from "@/lib/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Lock,
  Eye,
  Trash2,
  CreditCard,
  Key,
  RefreshCw,
  Clock,
  Users,
  Smartphone,
  Globe,
  ChevronRight,
  ExternalLink,
  Zap,
  Bell,
  PartyPopper,
  ArrowRight,
  UserPlus,
  Star,
} from "lucide-react";

type ExposureLevel = "critical" | "high" | "medium" | "low";

type ActionStep = {
  id: string;
  action: string;
  detail: string;
  link?: string;
  linkText?: string;
  externalLinks?: { label: string; url: string }[];
  timeframe: string;
};

const LEVEL_CONFIG: Record<ExposureLevel, {
  label: string;
  color: string;
  badgeColor: string;
  borderColor: string;
  progressColor: string;
  icon: typeof ShieldAlert;
  headline: string;
  subtitle: string;
  timeframe: string;
}> = {
  critical: {
    label: "Critical Exposure",
    color: "bg-red-500/10 dark:bg-red-500/20",
    badgeColor: "bg-red-500 text-white",
    borderColor: "border-red-500/30",
    progressColor: "[&>div]:bg-red-500",
    icon: ShieldAlert,
    headline: "Your data needs immediate attention.",
    subtitle: "Passwords, financial data, or sensitive information was found exposed. Follow these steps now to protect yourself.",
    timeframe: "Complete within 24 hours",
  },
  high: {
    label: "High Exposure",
    color: "bg-orange-500/10 dark:bg-orange-500/20",
    badgeColor: "bg-orange-500 text-white",
    borderColor: "border-orange-500/30",
    progressColor: "[&>div]:bg-orange-500",
    icon: AlertTriangle,
    headline: "Your personal info is widely available online.",
    subtitle: "Multiple data broker sites have your information. Start removing it this week to reduce your risk.",
    timeframe: "Complete within 1 week",
  },
  medium: {
    label: "Moderate Exposure",
    color: "bg-yellow-500/10 dark:bg-yellow-500/20",
    badgeColor: "bg-yellow-600 text-white",
    borderColor: "border-yellow-500/30",
    progressColor: "[&>div]:bg-yellow-500",
    icon: Eye,
    headline: "Some exposure found. Time to clean up.",
    subtitle: "Your email appeared in older breaches or a few broker listings. Address these to stay ahead of threats.",
    timeframe: "Complete within 2 weeks",
  },
  low: {
    label: "Low Exposure",
    color: "bg-green-500/10 dark:bg-green-500/20",
    badgeColor: "bg-green-600 text-white",
    borderColor: "border-green-500/30",
    progressColor: "[&>div]:bg-green-500",
    icon: ShieldCheck,
    headline: "You're in good shape. Stay protected.",
    subtitle: "Minimal exposure found. These quick steps will keep you ahead of future threats.",
    timeframe: "Quick maintenance",
  },
};

const ACTION_STEPS: Record<ExposureLevel, ActionStep[]> = {
  critical: [
    {
      id: "change-passwords",
      action: "Change your exposed passwords right now",
      detail: "Start with email, banking, and any account that uses the same password. Every minute counts when passwords are exposed.",
      link: "/password-generator",
      linkText: "Open Password Generator",
      timeframe: "Do this now",
    },
    {
      id: "enable-2fa",
      action: "Turn on two-factor authentication",
      detail: "Prioritize your email (it's the key to all other accounts), then banking and social media. Use an authenticator app instead of SMS for stronger protection.",
      timeframe: "Do this now",
    },
    {
      id: "freeze-credit",
      action: "Freeze your credit at all three bureaus",
      detail: "This is free and prevents anyone from opening new accounts in your name. Takes about 10 minutes per bureau.",
      externalLinks: [
        { label: "Equifax Freeze", url: "https://www.equifax.com/personal/credit-report-services/credit-freeze/" },
        { label: "Experian Freeze", url: "https://www.experian.com/freeze/center.html" },
        { label: "TransUnion Freeze", url: "https://www.transunion.com/credit-freeze" },
      ],
      timeframe: "Do this now",
    },
    {
      id: "start-removal",
      action: "Start removing your data from broker sites",
      detail: "Your scan found your information on data broker sites. Begin the opt-out process to get it removed.",
      link: "/data-removal",
      linkText: "Start Data Removal",
      timeframe: "Start today",
    },
    {
      id: "monitor-accounts",
      action: "Set up alerts on your financial accounts",
      detail: "Turn on transaction notifications through your bank's app so you're alerted to any unfamiliar activity immediately.",
      timeframe: "Start today",
    },
    {
      id: "rescan-verify",
      action: "Re-scan in 30 days to verify progress",
      detail: "After completing the steps above, run another scan to confirm your data has been removed and no new exposures have appeared.",
      link: "/shield",
      linkText: "Set Reminder to Re-scan",
      timeframe: "In 30 days",
    },
  ],
  high: [
    {
      id: "start-removal",
      action: "Submit opt-out requests to every broker that has your data",
      detail: "Your scan showed which brokers have your information. Each broker's removal process is different. Our Data Removal tool walks you through each one.",
      link: "/data-removal",
      linkText: "Start Data Removal",
      timeframe: "Start this week",
    },
    {
      id: "people-search",
      action: "Opt out of people-search sites",
      detail: "Sites like Spokeo, WhitePages, and BeenVerified are the most common places your data appears. Removing yourself from these cuts off the easiest access scammers have to your info.",
      link: "/data-removal",
      linkText: "View Broker List",
      timeframe: "This week",
    },
    {
      id: "update-passwords",
      action: "Update your passwords on sensitive accounts",
      detail: "Even if passwords weren't directly exposed, your personal data being public makes you a target for phishing. Strengthen your most important accounts.",
      link: "/password-generator",
      linkText: "Open Password Generator",
      timeframe: "This week",
    },
    {
      id: "social-privacy",
      action: "Lock down your social media profiles",
      detail: "Data brokers scrape public profiles. Set your accounts to private and review what information is publicly visible on Facebook, LinkedIn, and Instagram.",
      timeframe: "This week",
    },
    {
      id: "rescan-verify",
      action: "Re-scan in 30 days to confirm removals",
      detail: "Brokers are required to process opt-outs within 30-45 days. Re-scan to confirm your data has been removed and catch any sites that re-listed you.",
      link: "/shield",
      linkText: "Set Reminder to Re-scan",
      timeframe: "In 30 days",
    },
  ],
  medium: [
    {
      id: "change-passwords",
      action: "Update passwords on accounts affected by breaches",
      detail: "Even older breaches are dangerous. Criminals test stolen credentials months or years later. If you reused any exposed password on other sites, change those too.",
      link: "/password-generator",
      linkText: "Open Password Generator",
      timeframe: "This week",
    },
    {
      id: "check-breaches",
      action: "Review your full breach history",
      detail: "See exactly which breaches included your email and what data was exposed. This helps you prioritize which accounts need attention first.",
      link: "/breach-dashboard",
      linkText: "Open Breach Dashboard",
      timeframe: "This week",
    },
    {
      id: "enable-2fa",
      action: "Add two-factor authentication to important accounts",
      detail: "Even moderate exposure means your email is in attacker databases. Adding 2FA makes your accounts much harder to break into.",
      timeframe: "This week",
    },
    {
      id: "monthly-scans",
      action: "Set up monthly monitoring scans",
      detail: "New breaches happen constantly and data brokers re-list people within 60-90 days. Monthly scanning catches new exposures early.",
      link: "/shield",
      linkText: "Schedule Re-scan",
      timeframe: "Ongoing",
    },
  ],
  low: [
    {
      id: "review-passwords",
      action: "Audit your password strength",
      detail: "Great news on low exposure. Now make sure you're using unique, strong passwords on every account. If you reuse any passwords, now is the time to fix that.",
      link: "/password-generator",
      linkText: "Open Password Generator",
      timeframe: "When convenient",
    },
    {
      id: "enable-2fa",
      action: "Confirm 2FA is on for your most important accounts",
      detail: "Email, banking, and social media should all have two-factor authentication enabled. This is your strongest defense against future threats.",
      timeframe: "When convenient",
    },
    {
      id: "family-scan",
      action: "Run scans for your family members",
      detail: "Seniors are frequently targeted by scammers using broker data, and children's clean credit histories make them attractive for identity theft.",
      link: "/shield",
      linkText: "Scan for Family",
      timeframe: "When convenient",
    },
    {
      id: "monthly-scans",
      action: "Re-scan monthly to stay protected",
      detail: "Your low exposure today doesn't guarantee tomorrow. New breaches and data broker listings happen constantly. Stay ahead with regular scans.",
      link: "/shield",
      linkText: "Bookmark Data Shield",
      timeframe: "Ongoing",
    },
  ],
};

const STORAGE_KEY = "gcr-shield-checklist";

function getStoredChecks(level: ExposureLevel): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}-${level}`);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function setStoredChecks(level: ExposureLevel, checks: Record<string, boolean>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_KEY}-${level}`, JSON.stringify(checks));
  } catch {}
}

export default function ShieldNextSteps() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const levelParam = params.get("level") as ExposureLevel | null;
  const level: ExposureLevel = levelParam && levelParam in LEVEL_CONFIG ? levelParam : "high";

  const config = LEVEL_CONFIG[level];
  const steps = ACTION_STEPS[level];
  const Icon = config.icon;

  const { isAuthenticated } = useAuth();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setChecked(getStoredChecks(level));
  }, [level]);

  const toggleCheck = useCallback((stepId: string) => {
    setChecked((prev) => {
      const next = { ...prev, [stepId]: !prev[stepId] };
      setStoredChecks(level, next);
      return next;
    });
  }, [level]);

  const completedCount = steps.filter((s) => checked[s.id]).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);
  const allDone = completedCount === steps.length;

  return (
    <>
      <SEOHead
        title="Your Action Plan | Data Shield | GetCyberRight"
        description="Your personalized action plan based on your Data Shield scan results. Step-by-step guidance to remove your exposed data and protect against identity theft."
        canonicalUrl="https://www.getcyberright.com/shield/next-steps"
      />
      <Navigation />

      <main className="min-h-screen bg-background">
        <section className="relative py-12 md:py-20 overflow-hidden">
          <div className={`absolute inset-0 ${config.color} opacity-30`} />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl ${config.color} ${config.borderColor} border`}>
                  <Icon className="w-7 h-7 text-foreground" />
                </div>
                <div>
                  <Badge className={config.badgeColor} data-testid="badge-level">
                    {config.label}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {config.timeframe}
                  </p>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3" data-testid="heading-main">
                {config.headline}
              </h1>
              <p className="text-lg text-muted-foreground mb-8" data-testid="text-subtitle">
                {config.subtitle}
              </p>

              <div className={`flex items-center gap-4 p-4 rounded-xl ${config.color} ${config.borderColor} border`} data-testid="progress-bar">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-foreground">
                      {completedCount} of {steps.length} steps completed
                    </span>
                    <span className="text-muted-foreground">{progressPercent}%</span>
                  </div>
                  <Progress value={progressPercent} className={`h-3 ${config.progressColor}`} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-4">
              {steps.map((step, idx) => {
                const isDone = checked[step.id];
                return (
                  <Card
                    key={step.id}
                    className={`border transition-all duration-200 ${isDone ? "border-green-500/30 bg-green-500/5" : "border-border"}`}
                    data-testid={`step-${step.id}`}
                  >
                    <CardContent className="p-5">
                      <div className="flex gap-4">
                        <button
                          onClick={() => toggleCheck(step.id)}
                          className="flex-shrink-0 mt-0.5 focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
                          aria-label={isDone ? `Unmark "${step.action}" as done` : `Mark "${step.action}" as done`}
                          data-testid={`check-${step.id}`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-7 h-7 text-green-500" />
                          ) : (
                            <Circle className="w-7 h-7 text-muted-foreground/40 hover:text-primary transition-colors" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className={`font-semibold text-foreground ${isDone ? "line-through opacity-60" : ""}`}>
                              <span className="text-primary mr-2">{idx + 1}.</span>
                              {step.action}
                            </h3>
                            <Badge variant="outline" className="text-xs flex-shrink-0 whitespace-nowrap">
                              {step.timeframe}
                            </Badge>
                          </div>
                          <p className={`text-sm text-muted-foreground mb-3 ${isDone ? "opacity-60" : ""}`}>
                            {step.detail}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {step.link && (
                              <Link href={step.link}>
                                <Button
                                  size="sm"
                                  variant={isDone ? "outline" : "default"}
                                  className="min-h-[36px]"
                                  data-testid={`action-${step.id}`}
                                >
                                  {step.linkText}
                                  <ArrowRight className="w-3 h-3 ml-1.5" />
                                </Button>
                              </Link>
                            )}
                            {step.externalLinks?.map((ext) => (
                              <a
                                key={ext.label}
                                href={ext.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="min-h-[36px]"
                                  data-testid={`ext-${step.id}-${ext.label.toLowerCase().replace(/\s+/g, "-")}`}
                                >
                                  {ext.label}
                                  <ExternalLink className="w-3 h-3 ml-1.5" />
                                </Button>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {!isAuthenticated && completedCount >= Math.floor(steps.length / 2) && !allDone && (
                <Card className="border-primary/30 bg-primary/5" data-testid="card-create-account">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      <div className="flex-shrink-0 p-3 rounded-xl bg-primary/10 border border-primary/20">
                        <UserPlus className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-semibold text-foreground mb-1">
                          You're making great progress. Create a free account to keep it going.
                        </h3>
                        <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                          <li className="flex items-center gap-2"><Star className="w-3.5 h-3.5 text-primary flex-shrink-0" /> Save your checklist progress across devices</li>
                          <li className="flex items-center gap-2"><Bell className="w-3.5 h-3.5 text-primary flex-shrink-0" /> Get notified when new breaches affect you</li>
                          <li className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-primary flex-shrink-0" /> Track your data removal requests</li>
                          <li className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-primary flex-shrink-0" /> Monitor your whole family from one dashboard</li>
                        </ul>
                      </div>
                      <div className="flex-shrink-0">
                        <Link href="/auth">
                          <Button size="lg" className="bg-primary hover:bg-primary/90 min-h-[44px]" data-testid="button-create-account">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Create Free Account
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!isAuthenticated && allDone && (
                <Card className="border-primary/40 bg-primary/5" data-testid="card-create-account-final">
                  <CardContent className="p-6 text-center">
                    <UserPlus className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      You did it. Now lock in your protection.
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      Create a free account to save your progress, get breach alerts, and track future scans. Your action plan will be waiting for you when you log in.
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 mb-5 inline-block text-left">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> Your checklist progress, saved</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> New breach alerts, delivered to you</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> Data removal tracking dashboard</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> Family member monitoring</li>
                    </ul>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href="/auth">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 min-h-[44px]" data-testid="button-signup-final">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Create Free Account
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              {allDone && (
                <Card className="border-green-500/30 bg-green-500/5" data-testid="card-all-done">
                  <CardContent className="p-6 text-center">
                    <PartyPopper className="w-10 h-10 text-green-500 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      All steps completed!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      You've taken the right steps to protect yourself. Re-scan in 30 days to make sure your data stays removed and no new exposures appear.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href="/shield">
                        <Button size="lg" className="bg-green-600 hover:bg-green-700 min-h-[44px]" data-testid="button-verify-scan">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Run Verification Scan
                        </Button>
                      </Link>
                      <Link href="/breach-dashboard">
                        <Button size="lg" variant="outline" className="min-h-[44px]" data-testid="button-breach-dashboard">
                          <Bell className="w-4 h-4 mr-2" />
                          Set Up Breach Alerts
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {!allDone && (
          <section className="py-10 md:py-14">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <Card className="border border-border/50 overflow-hidden" data-testid="card-removal-cta">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-1 p-6 md:p-8">
                        <div className="flex items-center gap-2 mb-3">
                          <Trash2 className="w-5 h-5 text-primary" />
                          <h2 className="text-xl font-bold text-foreground" data-testid="heading-cta">
                            Ready to start removing your data?
                          </h2>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          Our Data Removal tool shows you exactly which sites have your information and walks you through each opt-out request step by step. Most sites process removals within 30 days.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link href="/data-removal">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 min-h-[44px]" data-testid="button-cta-removal">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Start Removing Your Data
                            </Button>
                          </Link>
                          {!isAuthenticated && (
                            <Link href="/auth">
                              <Button size="lg" variant="outline" className="min-h-[44px]" data-testid="button-cta-signup">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Create Free Account
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="hidden md:flex flex-col justify-center gap-2 bg-muted/30 p-6 min-w-[220px] border-l border-border/50">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>Step-by-step opt-out guides</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>Track removal progress</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>Re-scan to verify removals</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>Free to get started</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        <section className="py-10 md:py-14 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-lg font-semibold text-foreground mb-6" data-testid="heading-faq">
                Quick Answers
              </h2>
              <div className="space-y-3">
                {[
                  { q: "Will removing my data actually work?", a: "Yes. Most data brokers are legally required to honor opt-out requests within 30-45 days. However, they often re-list people over time, which is why monthly re-scanning is important." },
                  { q: "Should I be worried about old breaches?", a: "Yes. Stolen credentials are traded for years after a breach. If you reused any exposed password, change it on every site where you used it." },
                  { q: "How often should I re-scan?", a: "Monthly. Data brokers re-list people within 60-90 days and new breaches happen constantly." },
                  { q: "Should I scan my family members?", a: "Absolutely. Seniors are frequently targeted using broker data, and children's clean credit histories make them attractive targets for identity theft." },
                ].map((faq, idx) => (
                  <Card key={idx} className="border border-border/50" data-testid={`faq-${idx}`}>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-foreground text-sm mb-1">{faq.q}</h3>
                      <p className="text-sm text-muted-foreground">{faq.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
