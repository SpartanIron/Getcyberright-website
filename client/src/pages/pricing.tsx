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
  ArrowRight,
  Database,
  Sparkles,
  Loader2,
  Package,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { StructuredData } from "@/components/structured-data";

type BillingInterval = "monthly" | "annual";

interface BundleTier {
  id: string;
  planKey: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  separateMonthly: number;
  separateAnnual: number;
  sgLabel: string;
  dsLabel: string;
  features: string[];
  highlighted?: boolean;
}

const BUNDLE_TIERS: BundleTier[] = [
  {
    id: "complete",
    planKey: "bundle_complete",
    name: "Complete Protection",
    tagline: "Scam Guard Pro + Data Shield Essential",
    monthlyPrice: 1199,
    annualPrice: 899,
    separateMonthly: 1398,
    separateAnnual: 1098,
    sgLabel: "Scam Guard Pro",
    dsLabel: "Data Shield Essential",
    features: [
      "Auto-scan every page you visit",
      "Fake domain & phishing detection",
      "Gmail & Outlook email scanning",
      "500+ data broker scan & removal",
      "Removal status tracking dashboard",
      "Monthly removal progress reports",
      "Email alerts for new exposures",
    ],
  },
  {
    id: "total",
    planKey: "bundle_total",
    name: "Total Protection",
    tagline: "Scam Guard Family + Data Shield Professional",
    monthlyPrice: 1899,
    annualPrice: 1399,
    separateMonthly: 2298,
    separateAnnual: 1798,
    sgLabel: "Scam Guard Family",
    dsLabel: "Data Shield Professional",
    highlighted: true,
    features: [
      "Everything in Complete, plus:",
      "Family member profiles (up to 6)",
      "Weekly safety digest reports",
      "Personal safety scores per member",
      "Monthly automatic re-scans",
      "Auto re-submission if data reappears",
      "Priority removal processing",
      "Full scan history",
    ],
  },
];

export default function PricingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("monthly");

  const { data: userData } = useQuery<any>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const getDisplayPrice = (tier: BundleTier) => {
    return billingInterval === "annual" ? tier.annualPrice : tier.monthlyPrice;
  };

  const getSeparatePrice = (tier: BundleTier) => {
    return billingInterval === "annual" ? tier.separateAnnual : tier.separateMonthly;
  };

  const getSavings = (tier: BundleTier) => {
    const separate = getSeparatePrice(tier);
    const bundle = getDisplayPrice(tier);
    return separate - bundle;
  };

  const handleSelectBundle = async (tier: BundleTier) => {
    if (!userData) {
      setLocation("/register");
      return;
    }

    const planId = `${tier.planKey}_${billingInterval === "annual" ? "annual" : "monthly"}`;
    setLoadingPlan(tier.id);

    try {
      const res = await apiRequest("POST", "/api/stripe/create-checkout", { planId, returnPath: "/pricing" });
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

  const faqItems = [
    {
      question: "What do I get with a bundle?",
      answer: "Bundles combine both GCR Scam Guard and GCR Data Shield into a single subscription at a discounted price. You get all features from both products; browser-based scam detection AND automated data broker removal; for less than buying them separately."
    },
    {
      question: "Can I buy Scam Guard or Data Shield individually?",
      answer: "Yes. If you only need one product, visit the GCR Scam Guard pricing page or the GCR Data Shield pricing page. Bundles are simply a way to save when you want both."
    },
    {
      question: "How much do I save with bundles?",
      answer: "Complete Protection saves you $1.99/month compared to buying Scam Guard Pro and Data Shield Essential separately. Total Protection saves you $3.99/month. Annual billing adds further savings on top."
    },
    {
      question: "Can I switch between bundle and individual plans?",
      answer: "Yes. You can upgrade to a bundle or switch to individual plans at any time from your dashboard. Changes take effect at the start of your next billing cycle."
    },
    {
      question: "What happens if I cancel my bundle?",
      answer: "Both products deactivate at the end of your current billing period. You can re-subscribe to individual products or a different bundle at any time."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes. Every paid plan includes a 30-day free trial. You get full access to all features with no charge for a full month. Cancel anytime before the trial ends and you will not be billed."
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="GetCyberRight Pricing: Bundle & Save"
        description="Get both GCR Scam Guard and GCR Data Shield together and save. Complete Protection from $8.99/month. Total Protection from $13.99/month. Annual billing saves even more."
        keywords="GetCyberRight pricing, bundle deal, scam protection, data removal, cybersecurity bundle"
      />
      <StructuredData
        data={{
          type: "FAQPage",
          items: faqItems,
        }}
      />
      <Navigation />

      <main id="main-content" tabIndex={-1}>
        <section className="relative py-16 sm:py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #0A2A3C 0%, #003A52 40%, #0D4D66 70%, #0A2A3C 100%)" }}>
          <div className="absolute pointer-events-none hidden md:block" aria-hidden="true" style={{ top: 0, right: 0, width: "55%", height: "100%", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-40%", right: "5%", width: "60px", height: "220%", background: "linear-gradient(180deg, #003A52 0%, #0D4D66 50%, #003A52 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.6 }} />
            <div style={{ position: "absolute", top: "-35%", right: "15%", width: "40px", height: "220%", background: "linear-gradient(180deg, #5eead4 0%, #2dd4bf 35%, #14b8a6 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.45 }} />
            <div style={{ position: "absolute", top: "-30%", right: "28%", width: "50px", height: "220%", background: "linear-gradient(180deg, hsl(280, 70%, 55%) 0%, hsl(280, 60%, 45%) 50%, hsl(280, 50%, 35%) 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.35 }} />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/50" data-testid="badge-bundle">
              <Package className="h-3 w-3 mr-1" />
              Bundle & Save
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-[-0.025em]" data-testid="heading-pricing">
              Two Products. One Price.{" "}
              <span className="bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                Maximum Savings.
              </span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
              Get scam detection AND data broker removal together for less than buying them separately. Protect your whole digital life.
            </p>

            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full p-1" data-testid="toggle-billing-interval">
              <button
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  billingInterval === "monthly"
                    ? "bg-white text-[#0A2A3C] shadow-sm"
                    : "text-white/70 hover:text-white"
                }`}
                onClick={() => setBillingInterval("monthly")}
                data-testid="button-billing-monthly"
              >
                Monthly
              </button>
              <button
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  billingInterval === "annual"
                    ? "bg-white text-[#0A2A3C] shadow-sm"
                    : "text-white/70 hover:text-white"
                }`}
                onClick={() => setBillingInterval("annual")}
                data-testid="button-billing-annual"
              >
                Annual
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-semibold">Save More</span>
              </button>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {BUNDLE_TIERS.map((tier, index) => {
                const savings = getSavings(tier);
                const annualSavings = savings * 12;
                const displayPrice = getDisplayPrice(tier);
                const separatePrice = getSeparatePrice(tier);

                return (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                  >
                    <Card
                      className={`relative h-full flex flex-col ${
                        tier.highlighted
                          ? "border-2 border-purple-500 dark:border-purple-400 shadow-xl shadow-purple-500/10"
                          : "border-2 border-teal-500/50 dark:border-teal-400/50 shadow-lg"
                      }`}
                      data-testid={`card-bundle-${tier.id}`}
                    >
                      {tier.highlighted && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-purple-600 text-white shadow-sm px-3">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Best Value
                          </Badge>
                        </div>
                      )}

                      <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                        <div className="mb-5">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              tier.highlighted ? "bg-purple-100 dark:bg-purple-900/30" : "bg-teal-100 dark:bg-teal-900/30"
                            }`}>
                              <Package className={`w-5 h-5 ${tier.highlighted ? "text-purple-600 dark:text-purple-400" : "text-teal-600 dark:text-teal-400"}`} />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold" data-testid={`text-bundle-name-${tier.id}`}>{tier.name}</h3>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{tier.tagline}</p>
                        </div>

                        <div className="mb-5">
                          <div className="flex items-baseline gap-2" data-testid={`text-bundle-price-${tier.id}`}>
                            <span className="text-4xl font-bold">${(displayPrice / 100).toFixed(2)}</span>
                            <span className="text-muted-foreground">/month</span>
                          </div>
                          {billingInterval === "annual" && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Billed as ${((displayPrice * 12) / 100).toFixed(2)}/year
                            </p>
                          )}

                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800" data-testid={`badge-bundle-savings-${tier.id}`}>
                              Save ${(savings / 100).toFixed(2)}/mo vs. separate
                            </Badge>
                            {billingInterval === "annual" && (
                              <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                                ${(annualSavings / 100).toFixed(2)}/year saved
                              </Badge>
                            )}
                          </div>

                          <p className="text-xs text-muted-foreground mt-2 line-through">
                            ${(separatePrice / 100).toFixed(2)}/mo if purchased separately
                          </p>
                        </div>

                        <div className="flex gap-2 mb-5 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            {tier.sgLabel}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Database className="w-3 h-3 mr-1" />
                            {tier.dsLabel}
                          </Badge>
                        </div>

                        <ul className="space-y-2.5 mb-6 flex-1">
                          {tier.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm">
                              <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                tier.highlighted ? "text-purple-500" : "text-teal-500"
                              }`} />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <Button
                          size="lg"
                          className={`w-full min-h-[48px] ${
                            tier.highlighted
                              ? "bg-purple-600 hover:bg-purple-700 text-white"
                              : "bg-teal-600 hover:bg-teal-700 text-white"
                          }`}
                          onClick={() => handleSelectBundle(tier)}
                          disabled={loadingPlan === tier.id}
                          data-testid={`button-bundle-${tier.id}`}
                        >
                          {loadingPlan === tier.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              Start 30-Day Free Trial
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-3" data-testid="heading-how-bundles-work">How Bundles Work</h2>
            <p className="text-muted-foreground mb-8">One subscription, two powerful products, one lower price.</p>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="font-semibold mb-1">Scam Guard</h3>
                <p className="text-sm text-muted-foreground">AI-powered browser extension that detects scams, phishing, and fake domains in real time.</p>
              </div>
              <div className="text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-1">Better Together</h3>
                <p className="text-sm text-muted-foreground">Both products activate under a single subscription at a discounted price.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Database className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="font-semibold mb-1">Data Shield</h3>
                <p className="text-sm text-muted-foreground">Finds and removes your personal data from 500+ data broker sites automatically.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-3xl mx-auto">
            <div className="bg-muted/50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold mb-2 text-center" data-testid="heading-individual-plans">Prefer just one product?</h2>
              <p className="text-muted-foreground text-center mb-6">
                You can subscribe to Scam Guard or Data Shield individually - no bundle required.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/gcr-guard-pricing">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">GCR Scam Guard</h3>
                        <p className="text-sm text-muted-foreground">From $4.99/mo</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/data-shield-pricing">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Database className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">GCR Data Shield</h3>
                        <p className="text-sm text-muted-foreground">From $8.99/mo</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8" data-testid="heading-faq">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <details key={i} className="group border rounded-lg" data-testid={`faq-item-${i}`}>
                  <summary className="flex items-center justify-between cursor-pointer p-4 font-medium hover:bg-muted/50 transition-colors list-none">
                    {item.question}
                    <ArrowRight className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-90 flex-shrink-0 ml-2" />
                  </summary>
                  <div className="px-4 pb-4 text-sm text-muted-foreground">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
