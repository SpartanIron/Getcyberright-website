import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Check,
  X,
  ArrowRight,
  Zap,
  Users,
  Crown,
  Search,
  Database,
  Trash2,
  Eye,
  RefreshCw,
  Bell,
  FileText,
  Lock,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { StructuredData } from "@/components/structured-data";

type BillingInterval = "monthly" | "annual";

const ANNUAL_PRICES: Record<string, { monthly: number; annual: number; savePerYear: number }> = {
  essential: { monthly: 899, annual: 699, savePerYear: 2400 },
  professional: { monthly: 1499, annual: 1199, savePerYear: 3600 },
};

interface ShieldTier {
  id: string;
  name: string;
  price: number;
  interval: string | null;
  tagline: string;
  icon: typeof Shield;
  color: string;
  features: string[];
  highlighted?: boolean;
}

const SHIELD_TIERS: ShieldTier[] = [
  {
    id: "free",
    name: "Scan",
    price: 0,
    interval: null,
    tagline: "Discover your exposure",
    icon: Search,
    color: "text-slate-600 dark:text-slate-400",
    features: [
      "Scan 500+ data broker sites",
      "Breach database check (HaveIBeenPwned)",
      "Exposure score & risk rating",
      "2 full broker results revealed",
      "Manual removal guides per broker",
      "Direct opt-out links provided",
      "Step-by-step removal instructions",
      "One-time scan (no account needed)",
    ],
  },
  {
    id: "essential",
    name: "Remove",
    price: 899,
    interval: "month",
    tagline: "We remove your data for you",
    icon: Trash2,
    color: "text-teal-600 dark:text-teal-400",
    highlighted: true,
    features: [
      "Everything in Scan, plus:",
      "All broker results fully revealed",
      "Automated opt-out request submission",
      "Removal status tracking dashboard",
      "Verification re-scan after removal",
      "Monthly removal progress reports",
      "Email alerts for new exposures",
      "Identity Shield: 10 masked identities",
    ],
  },
  {
    id: "professional",
    name: "Protect",
    price: 1499,
    interval: "month",
    tagline: "Continuous protection for your family",
    icon: Shield,
    color: "text-purple-600 dark:text-purple-400",
    features: [
      "Everything in Remove, plus:",
      "Monthly automatic re-scans",
      "Auto re-submission if data reappears",
      "Family member profiles (up to 6)",
      "Individual privacy scores per member",
      "Weekly safety digest reports",
      "Priority removal processing",
      "Identity Shield: 50 masked identities",
    ],
  },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Enter your details",
    description: "Provide your name, email, and phone number. No account needed for your first scan.",
    icon: Lock,
  },
  {
    step: 2,
    title: "We scan 500+ data brokers",
    description: "Our system checks people-search sites, public records aggregators, and breach databases.",
    icon: Search,
  },
  {
    step: 3,
    title: "See your exposure report",
    description: "Get your privacy score and see exactly which brokers have your personal information.",
    icon: Eye,
  },
  {
    step: 4,
    title: "Remove & monitor",
    description: "Free users get step-by-step guides. Paid users get automated removals and ongoing protection.",
    icon: Trash2,
  },
];

export default function DataShieldPricing() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("monthly");

  const { data: subStatus } = useQuery<{ tier: string; shieldTier: string; isActive: boolean }>({
    queryKey: ["/api/subscription/status"],
    enabled: !!user,
  });

  const currentTier = subStatus?.shieldTier || "free";

  const getDisplayPrice = (tierId: string, basePrice: number) => {
    if (basePrice === 0) return 0;
    const annual = ANNUAL_PRICES[tierId];
    if (!annual) return basePrice;
    return billingInterval === "annual" ? annual.annual : annual.monthly;
  };

  const handleSelectPlan = async (tierId: string) => {
    if (tierId === "free") {
      setLocation("/shield");
      return;
    }

    if (!user) {
      setLocation("/register");
      return;
    }

    const planId = `ds_${tierId}_${billingInterval === "annual" ? "annual" : "monthly"}`;
    setLoadingTier(tierId);

    try {
      const res = await apiRequest("POST", "/api/stripe/create-checkout", { planId, returnPath: "/data-shield-pricing" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      const message = error?.message || "Failed to start checkout";
      toast({ title: message, variant: "destructive" });
    } finally {
      setLoadingTier(null);
    }
  };

  const isCurrentPlan = (tierId: string) => currentTier === tierId;

  const faqItems = [
    {
      q: "Is the free scan really free?",
      a: "Yes. You can scan 500+ data broker sites without creating an account or providing payment information. You'll see your exposure score and get manual removal guides for every broker that has your data."
    },
    {
      q: "How does automated removal work?",
      a: "When you subscribe to the Remove or Protect plan, we submit opt-out requests to data brokers on your behalf. We handle the forms, emails, and follow-ups. You can track the status of every removal request from your dashboard."
    },
    {
      q: "Why do data brokers keep re-adding my information?",
      a: "Data brokers pull from public records, social media, and other sources that update regularly. Most re-add your information every 30 to 90 days. The Protect plan includes monthly re-scans and automatic re-submission so your data stays removed."
    },
    {
      q: "What data do brokers typically have on me?",
      a: "Common findings include your full name, current and past addresses, phone numbers, email addresses, relatives' names, estimated income, and property records. Some brokers also list social media profiles and court records."
    },
    {
      q: "Does this include the browser extension?",
      a: "GCR Data Shield and GCR Scam Guard are separate products with independent subscriptions. Data Shield focuses on finding and removing your personal data from broker sites. If you also want browser-based scam detection and email scanning, you can subscribe to GCR Scam Guard separately at /gcr-guard-pricing."
    },
    {
      q: "How does the 30-day free trial work?",
      a: "When you sign up for any paid Data Shield plan, you get full access for 30 days at no charge. You will not be billed until the trial ends. If you decide it is not for you, cancel before the trial is over and you will not be charged."
    },
    {
      q: "How is this different from competitors?",
      a: "Most data removal services only remove your data. We combine removal with AI-powered scam detection, a protective browser extension, and family cybersecurity education. You get more protection at a lower price."
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="GCR Data Shield Pricing"
        description="Protect your personal data with GCR Data Shield. Free scan of 500+ data broker sites. Automated removal from $8.99/month with a 30-day free trial. Continuous family protection from $14.99/month. Save with annual billing."
        keywords="data broker removal pricing, personal data protection, privacy scan, data removal service"
      />
      <StructuredData
        data={{
          type: "FAQPage",
          items: faqItems.map(f => ({ question: f.q, answer: f.a })),
        }}
      />
      <Navigation />

      <main className="py-16">
        <section className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800">
                <Database className="w-3 h-3 mr-1" />
                GCR Data Shield
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="heading-shield-pricing">
                Your Data Is Being Sold.{" "}
                <span className="text-teal-600 dark:text-teal-400">Take It Back.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
                Over 500 data broker sites trade your name, address, phone number, and more.
                We find them, and remove you, so you don't have to.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-8">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-teal-600" />
                  500+ brokers scanned
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-teal-600" />
                  No account needed to scan
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-teal-600" />
                  Cancel anytime
                </span>
              </div>
              <div className="inline-flex items-center bg-muted rounded-full p-1" data-testid="toggle-shield-billing-interval">
                <button
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    billingInterval === "monthly"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setBillingInterval("monthly")}
                  data-testid="button-shield-billing-monthly"
                >
                  Monthly
                </button>
                <button
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    billingInterval === "annual"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setBillingInterval("annual")}
                  data-testid="button-shield-billing-annual"
                >
                  Annual
                  <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-semibold">Save 17%</span>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {SHIELD_TIERS.map((tier, index) => {
                const Icon = tier.icon;
                const current = isCurrentPlan(tier.id);

                return (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card
                      className={`relative h-full flex flex-col ${
                        tier.highlighted
                          ? "border-2 border-teal-500 dark:border-teal-400 shadow-lg shadow-teal-500/10"
                          : "border"
                      }`}
                      data-testid={`card-shield-tier-${tier.id}`}
                    >
                      {tier.highlighted && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-teal-600 text-white shadow-sm">
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="mb-4">
                          <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3`}>
                            <Icon className={`w-5 h-5 ${tier.color}`} />
                          </div>
                          <h3 className="text-xl font-bold" data-testid={`text-shield-tier-name-${tier.id}`}>{tier.name}</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">{tier.tagline}</p>
                        </div>

                        <div className="mb-6">
                          {tier.price === 0 ? (
                            <div className="text-3xl font-bold" data-testid={`text-shield-price-${tier.id}`}>Free</div>
                          ) : (
                            <div data-testid={`text-shield-price-${tier.id}`}>
                              <span className="text-3xl font-bold">${(getDisplayPrice(tier.id, tier.price) / 100).toFixed(2)}</span>
                              <span className="text-muted-foreground">/month</span>
                              {billingInterval === "annual" && ANNUAL_PRICES[tier.id] && (
                                <div className="mt-1 space-y-0.5">
                                  <span className="text-xs text-muted-foreground line-through block">
                                    ${(ANNUAL_PRICES[tier.id].monthly / 100).toFixed(2)}/mo monthly
                                  </span>
                                  <span className="text-xs font-medium text-green-600 dark:text-green-400 block" data-testid={`text-shield-savings-${tier.id}`}>
                                    Save ${(ANNUAL_PRICES[tier.id].savePerYear / 100).toFixed(2)}/year
                                  </span>
                                  <span className="text-xs text-muted-foreground block">
                                    Billed as ${((getDisplayPrice(tier.id, tier.price) * 12) / 100).toFixed(2)}/year
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <ul className="space-y-2.5 mb-8 flex-1">
                          {tier.features.map((feature, i) => {
                            const isBonus = feature.startsWith("Also includes:");
                            const isHeader = feature.startsWith("Everything in");
                            return (
                              <li
                                key={i}
                                className={`flex items-start gap-2 text-sm ${
                                  isBonus ? "pt-2 border-t mt-2" : ""
                                } ${isHeader ? "font-medium text-muted-foreground" : ""}`}
                              >
                                {isBonus ? (
                                  <Zap className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                ) : isHeader ? (
                                  <ArrowRight className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                ) : (
                                  <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
                                )}
                                <span>{feature}</span>
                              </li>
                            );
                          })}
                        </ul>

                        <Button
                          className={`w-full ${
                            tier.highlighted
                              ? "bg-teal-600 hover:bg-teal-700 text-white"
                              : ""
                          }`}
                          variant={tier.highlighted ? "default" : "outline"}
                          size="lg"
                          disabled={current || loadingTier === tier.id}
                          onClick={() => handleSelectPlan(tier.id)}
                          data-testid={`button-shield-select-${tier.id}`}
                        >
                          {loadingTier === tier.id ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : null}
                          {current
                            ? "Current Plan"
                            : tier.price === 0
                            ? "Scan Free Now"
                            : "Start 30-Day Free Trial"}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 mb-16 bg-muted/30 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold mb-2" data-testid="heading-how-it-works">How GCR Data Shield Works</h2>
              <p className="text-muted-foreground">From discovery to continuous protection, in four steps.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {HOW_IT_WORKS.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.step} className="text-center" data-testid={`step-${step.step}`}>
                    <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/40 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div className="text-xs text-teal-600 dark:text-teal-400 font-semibold mb-1">Step {step.step}</div>
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <Badge className="mb-3 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800">
                Feature Comparison
              </Badge>
              <h2 className="text-2xl font-bold mb-2" data-testid="heading-shield-comparison">What You Get at Each Level</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-shield-comparison">
                <thead>
                  <tr className="border-b-2">
                    <th className="text-left py-3 px-4 font-semibold w-[40%]">Feature</th>
                    <th className="py-3 px-4 text-center font-semibold">Scan<br/><span className="font-normal text-xs text-muted-foreground">Free</span></th>
                    <th className="py-3 px-4 text-center font-semibold text-teal-700 dark:text-teal-400">Remove<br/><span className="font-normal text-xs text-muted-foreground">from $8.99/mo</span></th>
                    <th className="py-3 px-4 text-center font-semibold">Protect<br/><span className="font-normal text-xs text-muted-foreground">from $14.99/mo</span></th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Scan 500+ data brokers", scan: true, remove: true, protect: true },
                    { feature: "Breach database check", scan: true, remove: true, protect: true },
                    { feature: "Exposure score & risk rating", scan: true, remove: true, protect: true },
                    { feature: "Manual removal guides", scan: true, remove: true, protect: true },
                    { feature: "Full broker results (unredacted)", scan: false, remove: true, protect: true, highlight: true },
                    { feature: "Automated opt-out submission", scan: false, remove: true, protect: true, highlight: true },
                    { feature: "Removal status tracking", scan: false, remove: true, protect: true },
                    { feature: "Verification re-scan", scan: false, remove: true, protect: true },
                    { feature: "Monthly removal reports", scan: false, remove: true, protect: true },
                    { feature: "Monthly automatic re-scans", scan: false, remove: false, protect: true, highlight: true },
                    { feature: "Auto re-submission if data reappears", scan: false, remove: false, protect: true, highlight: true },
                    { feature: "Family profiles (up to 6)", scan: false, remove: false, protect: true },
                    { feature: "Weekly safety digest", scan: false, remove: false, protect: true },
                    { feature: "Priority removal processing", scan: false, remove: false, protect: true },
                  ].map((row, i) => (
                    <tr key={i} className={`border-b ${row.highlight ? "bg-teal-50/50 dark:bg-teal-950/20" : ""}`} data-testid={`row-shield-compare-${i}`}>
                      <td className="py-2.5 px-4 font-medium">{row.feature}</td>
                      <td className="py-2.5 px-4 text-center">
                        {row.scan ? <Check className="w-4 h-4 text-green-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        {row.remove ? <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        {row.protect ? <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8" data-testid="heading-shield-faq">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((faq, i) => (
                <details key={i} className="group border rounded-lg" data-testid={`faq-shield-${i}`}>
                  <summary className="flex items-center justify-between p-4 cursor-pointer font-medium hover:bg-muted/50 transition-colors">
                    {faq.q}
                    <ArrowRight className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-90 flex-shrink-0 ml-4" />
                  </summary>
                  <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full mb-4">
                    <Sparkles className="w-4 h-4" />
                    Bundle & Save
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2" data-testid="text-bundle-heading">
                    Want Data Shield + Scam Guard Together?
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                    Get both products in one plan and save up to 23%. Our bundle plans combine personal data monitoring with real-time scam protection.
                  </p>
                  <Link href="/pricing">
                    <Button size="lg" data-testid="button-view-bundles">
                      View Bundle Plans
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-3" data-testid="heading-shield-cta">Start With a Free Scan</h2>
            <p className="text-muted-foreground mb-6">
              No account needed. No credit card. See your exposure in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shield">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white" data-testid="button-start-free-scan">
                  <Search className="w-4 h-4 mr-2" />
                  Scan Free Now
                </Button>
              </Link>
              <Link href="/gcr-guard-pricing">
                <Button size="lg" variant="outline" data-testid="button-see-scam-guard">
                  <Shield className="w-4 h-4 mr-2" />
                  See Scam Guard Plans
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
