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
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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

  const handleSelectPlan = (tierId: string) => {
    if (tierId === "free") {
      window.open("/browser-extension", "_self");
      return;
    }
    if (!userData) {
      setLocation("/register");
      return;
    }
    setLocation("/contact");
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
              Choose Your Protection
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Real-time browser protection powered by AI. Start free, upgrade when you are ready.
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
                          disabled={isCurrentPlan}
                          data-testid={`button-select-${tier.id}`}
                        >
                          {isCurrentPlan ? "Current Plan" : tier.price === 0 ? "Get Started" : "Subscribe"}
                          {!isCurrentPlan && <ArrowRight className="w-4 h-4 ml-2" />}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
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
                  a: "Pro unlocks automatic page scanning on every website you visit, lookalike domain detection, form warnings, link hover checks, community trust scores, and webmail scanning for Gmail and Outlook."
                },
                {
                  q: "What is the Family plan?",
                  a: "The Family plan includes everything in Pro, plus weekly safety digest reports, full scan history, personal safety scores, and family member profiles so you can monitor safety for your whole household."
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
                  a: "We are finalizing our payment provider to ensure global availability. Contact us at info@getcyberright.com for early access or to be notified when subscriptions go live."
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
