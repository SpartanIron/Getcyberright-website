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
  Download,
  Loader2,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TierData {
  id: string;
  name: string;
  price: number;
  interval: string | null;
  features: string[];
  description: string;
}

const FEATURE_LABELS: Record<string, string> = {
  manual_scan: "Manual URL & content scanning",
  auto_scan: "Auto-scan every page you visit",
  lookalike_detection: "Fake domain detection",
  form_warnings: "Suspicious form warnings",
  hover_check: "Link hover safety preview",
  community_trust: "Community trust scores",
  webmail_scan: "Gmail & Outlook email scanning",
  block_dangerous: "Block dangerous links",
  weekly_digest: "Weekly safety digest report",
  scan_history: "Full scan history",
  safety_score: "Personal safety score",
  family_profiles: "Family member profiles",
  priority_support: "Priority support",
  api_access: "API access",
};

const ALL_FEATURES = [
  "manual_scan",
  "auto_scan",
  "lookalike_detection",
  "form_warnings",
  "hover_check",
  "community_trust",
  "webmail_scan",
  "block_dangerous",
  "weekly_digest",
  "scan_history",
  "safety_score",
  "family_profiles",
];

const TIER_ICONS: Record<string, typeof Shield> = {
  free: Shield,
  essential: Zap,
  professional: Users,
  enterprise: Crown,
};

const TIER_COLORS: Record<string, string> = {
  free: "border-slate-200 dark:border-slate-700",
  essential: "border-teal-500 dark:border-teal-400 ring-2 ring-teal-500/20",
  professional: "border-orange-500 dark:border-orange-400",
};

export default function GcrGuardPricing() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const { data: userData } = useQuery<any>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const { data: tierData } = useQuery<{ tiers: TierData[] }>({
    queryKey: ["/api/subscription/tiers"],
  });

  const tiers = tierData?.tiers || [
    { id: "free", name: "Free", price: 0, interval: null, features: ["manual_scan"], description: "Basic protection with manual scanning" },
    { id: "essential", name: "Pro", price: 399, interval: "month", features: [], description: "Full auto-protection for individuals" },
    { id: "professional", name: "Family", price: 799, interval: "month", features: [], description: "Complete protection for the whole family" },
  ];

  const handleSelectPlan = async (tierId: string) => {
    if (tierId === "free") {
      window.open("/browser-extension", "_self");
      return;
    }
    if (!userData) {
      setLocation("/register");
      return;
    }

    const planId = `${tierId}_monthly`;
    setLoadingPlan(tierId);

    try {
      const res = await apiRequest("POST", "/api/stripe/create-checkout", { planId });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: "Something went wrong",
          description: data.error || "Could not start checkout. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Checkout error",
        description: error.message || "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="GCR Scam Guard Pricing | GetCyberRight"
        description="Choose your GCR Scam Guard protection plan. Free manual scanning, Pro auto-protection for $3.99/month, or Family coverage for $7.99/month."
        keywords="GCR Scam Guard pricing, browser extension subscription, cybersecurity protection plans"
      />
      <Navigation />

      <main id="main-content" tabIndex={-1}>
        <section className="relative py-16 sm:py-20 bg-[#0A2A3C] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A2A3C] via-[#0A2A3C] to-[#00293C]" />
          <div className="absolute pointer-events-none hidden md:block" aria-hidden="true" style={{ top: 0, right: 0, width: "55%", height: "100%", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-40%", right: "2%", width: "50px", height: "220%", background: "linear-gradient(180deg, #003A52 0%, #0D4D66 50%, #003A52 100%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
            <div style={{ position: "absolute", top: "-40%", right: "10%", width: "2px", height: "220%", background: "linear-gradient(180deg, transparent 10%, rgba(45, 212, 191, 0.4) 50%, transparent 90%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
            <div style={{ position: "absolute", top: "-35%", right: "18%", width: "35px", height: "220%", background: "linear-gradient(180deg, #5eead4 0%, #2dd4bf 35%, #14b8a6 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.55 }} />
            <div style={{ position: "absolute", top: "-35%", right: "26%", width: "2px", height: "220%", background: "linear-gradient(180deg, transparent 15%, hsla(16, 95%, 58%, 0.35) 50%, transparent 85%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
            <div style={{ position: "absolute", top: "-30%", right: "32%", width: "50px", height: "220%", background: "linear-gradient(180deg, hsl(16, 100%, 62%) 0%, hsl(16, 95%, 52%) 40%, hsl(16, 90%, 42%) 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.5 }} />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/50" data-testid="badge-pricing">
              <Shield className="h-3 w-3 mr-1" />
              GCR Scam Guard
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-[-0.025em]" data-testid="heading-pricing">
              Protection + Education Others Can't Match
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              AI scam detection, 500+ data broker removals, a browser extension, and family cybersecurity education — all in one platform, for a fraction of what others charge.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {tiers.map((tier, index) => {
                const Icon = TIER_ICONS[tier.id] || Shield;
                const isPopular = tier.id === "essential";
                const isCurrentPlan = userData?.subscriptionTier === tier.id;

                return (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="relative"
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                        <Badge className="bg-teal-500 text-white border-0 shadow-lg" data-testid="badge-popular">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <Card
                      className={`h-full ${TIER_COLORS[tier.id] || ""} ${isPopular ? "shadow-xl" : ""}`}
                      data-testid={`card-tier-${tier.id}`}
                    >
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isPopular ? "bg-teal-100 dark:bg-teal-900" : "bg-slate-100 dark:bg-slate-800"
                          }`}>
                            <Icon className={`w-5 h-5 ${isPopular ? "text-teal-600 dark:text-teal-400" : "text-slate-600 dark:text-slate-400"}`} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold" data-testid={`text-tier-name-${tier.id}`}>{tier.name}</h3>
                          </div>
                        </div>

                        <div className="mb-4">
                          {tier.price === 0 ? (
                            <div className="text-3xl font-bold" data-testid={`text-price-${tier.id}`}>Free</div>
                          ) : (
                            <div data-testid={`text-price-${tier.id}`}>
                              <span className="text-3xl font-bold">${(tier.price / 100).toFixed(2)}</span>
                              <span className="text-muted-foreground">/month</span>
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
                        </div>

                        <div className="flex-1 mb-6">
                          <div className="space-y-2">
                            {ALL_FEATURES.map((feature) => {
                              const hasFeature = tier.features.includes(feature);
                              return (
                                <div key={feature} className="flex items-center gap-2 text-sm">
                                  {hasFeature ? (
                                    <Check className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                                  ) : (
                                    <X className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                                  )}
                                  <span className={hasFeature ? "text-foreground" : "text-muted-foreground/50"}>
                                    {FEATURE_LABELS[feature] || feature}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <Button
                          className="w-full"
                          variant={isPopular ? "default" : "outline"}
                          onClick={() => handleSelectPlan(tier.id)}
                          disabled={isCurrentPlan || loadingPlan === tier.id}
                          data-testid={`button-select-${tier.id}`}
                        >
                          {loadingPlan === tier.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Loading...
                            </>
                          ) : isCurrentPlan ? "Current Plan" : tier.price === 0 ? "Get Started" : "Subscribe"}
                          {!isCurrentPlan && loadingPlan !== tier.id && <ArrowRight className="w-4 h-4 ml-2" />}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30" data-testid="section-comparison">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <Badge className="mb-3 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800">
                Honest Comparison
              </Badge>
              <h2 className="text-3xl font-bold mb-3" data-testid="heading-comparison">GCR vs Competitors</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Most services do one thing. We combine data removal, scam detection, and family education in one platform — at a fraction of the industry price.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-comparison">
                <thead>
                  <tr className="border-b-2">
                    <th className="text-left py-4 px-4 font-semibold text-base w-[40%]">Feature</th>
                    <th className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Shield className="w-5 h-5 text-teal-600" />
                        <span className="font-bold text-teal-700 dark:text-teal-400">GetCyberRight</span>
                        <span className="text-xs text-muted-foreground">from $3.99/mo</span>
                      </div>
                    </th>
                    <th className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-bold text-slate-600 dark:text-slate-400">Data Removal Services</span>
                        <span className="text-xs text-muted-foreground">typically $10+/mo</span>
                      </div>
                    </th>
                    <th className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-bold text-slate-600 dark:text-slate-400">All-in-One Security Suites</span>
                        <span className="text-xs text-muted-foreground">typically $12+/mo</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Data Broker Removals", gcr: true, removal: true, suite: true, gcrNote: "500+ brokers" },
                    { feature: "Monthly Removal Reports", gcr: true, removal: true, suite: true },
                    { feature: "AI Scam Detection & Analysis", gcr: true, removal: false, suite: false, highlight: true },
                    { feature: "Browser Extension Protection", gcr: true, removal: false, suite: false, highlight: true },
                    { feature: "Family Cybersecurity Education", gcr: true, removal: false, suite: false, highlight: true },
                    { feature: "Real-Time Phishing Alerts", gcr: true, removal: false, suite: true },
                    { feature: "Breach Monitoring", gcr: true, removal: false, suite: true },
                    { feature: "Community Scam Reporting", gcr: true, removal: false, suite: false, highlight: true },
                    { feature: "Interactive Safety Training", gcr: true, removal: false, suite: false, highlight: true },
                    { feature: "Identity Theft Insurance", gcr: false, removal: false, suite: true },
                    { feature: "VPN / Antivirus Bundled", gcr: false, removal: false, suite: true },
                    { feature: "Credit Monitoring", gcr: false, removal: false, suite: true },
                  ].map((row, i) => (
                    <tr key={i} className={`border-b ${row.highlight ? "bg-teal-50/50 dark:bg-teal-950/20" : ""}`} data-testid={`row-compare-${i}`}>
                      <td className="py-3 px-4 font-medium">
                        {row.feature}
                        {row.gcrNote && <span className="block text-xs text-teal-600 dark:text-teal-400 font-normal">{row.gcrNote}</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.gcr ? (
                          <Check className="w-5 h-5 text-teal-600 dark:text-teal-400 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-slate-300 dark:text-slate-600 mx-auto" />
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.removal ? (
                          <Check className="w-5 h-5 text-slate-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-slate-300 dark:text-slate-600 mx-auto" />
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.suite ? (
                          <Check className="w-5 h-5 text-slate-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-slate-300 dark:text-slate-600 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              <Card className="border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/20">
                <CardContent className="p-5 text-center">
                  <div className="text-3xl font-bold text-teal-700 dark:text-teal-400" data-testid="text-broker-count">500+</div>
                  <p className="text-sm text-muted-foreground mt-1">Data brokers scanned</p>
                </CardContent>
              </Card>
              <Card className="border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/20">
                <CardContent className="p-5 text-center">
                  <div className="text-3xl font-bold text-teal-700 dark:text-teal-400">Up to 3x</div>
                  <p className="text-sm text-muted-foreground mt-1">Less than competitors</p>
                </CardContent>
              </Card>
              <Card className="border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/20">
                <CardContent className="p-5 text-center">
                  <div className="text-3xl font-bold text-teal-700 dark:text-teal-400">5</div>
                  <p className="text-sm text-muted-foreground mt-1">Features unique to GCR</p>
                </CardContent>
              </Card>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-6">
              Based on publicly available pricing and feature sets of leading data removal services and all-in-one security suites as of 2026.
            </p>
          </div>
        </section>

        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4" data-testid="heading-get-extension">Get the Extension</h2>
            <p className="text-muted-foreground mb-6">
              GCR Scam Guard works as a Chrome browser extension. Install it free and upgrade your plan anytime from within the extension or your account dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/browser-extension">
                <Button size="lg" data-testid="button-download-extension">
                  <Download className="w-4 h-4 mr-2" />
                  Get GCR Scam Guard
                </Button>
              </Link>
              <Link href="/our-mission">
                <Button size="lg" variant="outline" data-testid="button-our-mission">
                  Our Mission
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8" data-testid="heading-faq">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Can I use GCR Scam Guard for free?",
                  a: "Yes. The free plan includes manual scanning of URLs, emails, phone numbers, and suspicious messages. You can scan anything anytime without an account."
                },
                {
                  q: "What does the Pro plan add?",
                  a: "Pro unlocks automatic page scanning on every website you visit, lookalike domain detection, form warnings, link hover checks, community trust scores, webmail scanning, and monthly data removal reports."
                },
                {
                  q: "What is the Family plan?",
                  a: "The Family plan includes everything in Pro, plus weekly safety digest reports, full scan history, personal safety scores, family member profiles, and monthly removal reports."
                },
                {
                  q: "Why choose GetCyberRight over other services?",
                  a: "Most data removal services only remove your data. All-in-one security suites bundle everything but charge 3x more. GetCyberRight is the only platform that combines data broker removal with AI scam detection, a browser extension, and family cybersecurity education. You get protection and the knowledge to stay safe, at a fraction of the industry price."
                },
                {
                  q: "What are Monthly Removal Reports?",
                  a: "Paying subscribers receive a monthly email summary of their data removal progress: how many brokers were scanned, removals completed, any new exposures detected, and your updated privacy score. It is like a credit report, but for your personal data online."
                },
                {
                  q: "How do I connect my account to the extension?",
                  a: "After subscribing, sign in through the extension popup using the 'Sign In' button. Your subscription features will activate automatically."
                },
                {
                  q: "Can I cancel anytime?",
                  a: "Yes. You can downgrade to the free plan at any time from your account dashboard. Your premium features will remain active until the end of your current billing period."
                },
                {
                  q: "Which payment methods are accepted?",
                  a: "We accept all major credit and debit cards through our secure payment processor, Stripe. Your payment information is never stored on our servers."
                },
              ].map((faq, i) => (
                <Card key={i} data-testid={`card-faq-${i}`}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Stay Safe Online. Start Today.
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">
                Join thousands of families who trust GCR Scam Guard to protect them while browsing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/browser-extension">
                  <Button size="lg" variant="secondary" data-testid="button-cta-install">
                    Install GCR Scam Guard
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
