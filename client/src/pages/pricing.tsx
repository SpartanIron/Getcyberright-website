import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Shield, 
  Users, 
  Crown,
  Building2,
  ArrowRight,
  Loader2,
  HelpCircle,
  Zap,
  Clock,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import bannerImage from "@/assets/banners/pricing-banner.png";

interface PricingTier {
  id: string;
  name: string;
  audience: string;
  description: string;
  price: string;
  period: string;
  icon: typeof Shield;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
  badge?: string;
  stripePriceId?: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    audience: "For everyone",
    description: "Get started with essential security tools at no cost.",
    price: "$0",
    period: "forever",
    icon: Shield,
    features: [
      "Scam Checker (check suspicious messages)",
      "Password Strength Tester",
      "Data Breach Lookup",
      "Security guides and articles",
      "Weekly safety newsletter"
    ],
    buttonText: "Get Started"
  },
  {
    id: "essential",
    name: "Essential",
    audience: "For individuals and families",
    description: "Full protection with automated data removal and AI-powered analysis.",
    price: "$9",
    period: "mo",
    icon: Users,
    features: [
      "Everything in Free, plus:",
      "AI Scam Analyzer (detailed threat reports)",
      "Data broker exposure scan (501+ brokers)",
      "One-click automated data removal",
      "Full Training Academy access",
      "Family safety toolkit",
      "Email support"
    ],
    highlighted: true,
    buttonText: "Start 14-Day Free Trial",
    badge: "Most Popular"
  },
  {
    id: "professional",
    name: "Professional",
    audience: "For power users and small businesses",
    description: "Full protection suite with automated data removal and monitoring.",
    price: "$29",
    period: "mo",
    icon: Crown,
    features: [
      "Everything in Essential, plus:",
      "Automated data broker removal requests",
      "Continuous monitoring and re-scanning",
      "Up to 6 family member profiles",
      "Advanced URL and domain scanner",
      "Priority support",
      "Quarterly security review"
    ],
    buttonText: "Start 14-Day Free Trial"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    audience: "For organizations and teams",
    description: "Custom training programs with dedicated support for your team.",
    price: "Custom",
    period: "plan",
    icon: Building2,
    features: [
      "Everything in Professional, plus:",
      "Unlimited team member accounts",
      "Custom employee training programs",
      "Dedicated account manager",
      "NIST compliance dashboard",
      "API access and integrations",
      "SLA guarantee"
    ],
    buttonText: "Contact Sales"
  }
];

interface StripeProduct {
  id: string;
  name: string;
  metadata?: { tier?: string };
  prices: Array<{
    id: string;
    unitAmount: number;
    currency: string;
    recurring?: { interval: string };
  }>;
}

export default function Pricing() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const { data: stripeData, isLoading: isLoadingProducts } = useQuery<{ products: StripeProduct[] }>({
    queryKey: ['/api/stripe/products'],
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const userTrial = (user as any)?.trial;
  const userTier = (user as any)?.subscriptionTier || "free";
  const trialActive = userTrial?.active;
  const trialDaysRemaining = userTrial?.daysRemaining || 0;
  const trialUsed = !!(userTrial?.endsAt);

  const startTrialMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/subscription/start-trial');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/subscription/status'] });
      toast({
        title: "Trial Activated",
        description: "Your 14-day free trial of Essential is now active. Enjoy full access to all features!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Could not start trial",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    }
  });

  const hasStripeProducts = stripeData?.products && stripeData.products.length > 0;

  const getMonthlyPriceId = (tierId: string): string | null => {
    if (!stripeData?.products || stripeData.products.length === 0) return null;
    
    const tierNameMap: Record<string, string> = {
      essential: 'GetCyberRight Essential',
      professional: 'GetCyberRight Professional',
      enterprise: 'GetCyberRight Enterprise'
    };
    
    const product = stripeData.products.find(p => 
      p.name === tierNameMap[tierId] || 
      p.metadata?.tier === tierId
    );
    
    if (!product) return null;
    
    const monthlyPrice = product.prices.find(p => 
      p.recurring?.interval === 'month'
    );
    
    return monthlyPrice?.id || null;
  };

  const handleSubscribe = async (tierId: string) => {
    if (!isAuthenticated) {
      window.location.href = '/api/login';
      return;
    }

    const priceId = getMonthlyPriceId(tierId);
    if (!priceId) {
      if (isLoadingProducts) {
        toast({
          title: "Loading",
          description: "Please wait while we load subscription options.",
        });
      } else {
        toast({
          title: "Subscription Unavailable",
          description: "Our payment system is being configured. Please try again in a few minutes or contact support.",
          variant: "destructive"
        });
      }
      return;
    }

    setLoadingTier(tierId);
    
    try {
      const response = await apiRequest('POST', '/api/stripe/create-checkout-session', {
        priceId
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.pricing} />
      <Navigation />
      
      <main id="main-content" tabIndex={-1}>
        <PageBanner
          title="Pricing Plans"
          subtitle="Choose the protection level that fits your needs. All plans include our core security tools."
          imageSrc={bannerImage}
          imageAlt="Cybersecurity shield with layered protection tiers"
          imagePosition="right"
          colorVariant="teal"
        />

        {isAuthenticated && !trialUsed && userTier === "free" && (
          <section className="px-4 sm:px-6 lg:px-8 pt-8" data-testid="section-trial-banner">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Zap className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-lg font-semibold text-foreground mb-1" data-testid="text-trial-banner-title">Try Everything Free for 14 Days</h3>
                        <p className="text-sm text-muted-foreground">
                          Get full access to data removal, AI analysis, and training. No credit card required. No commitment.
                        </p>
                      </div>
                      <Button 
                        onClick={() => startTrialMutation.mutate()}
                        disabled={startTrialMutation.isPending}
                        data-testid="button-start-trial-banner"
                      >
                        {startTrialMutation.isPending ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        Start Free Trial
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>
        )}

        {isAuthenticated && trialActive && (
          <section className="px-4 sm:px-6 lg:px-8 pt-8" data-testid="section-trial-active-banner">
            <div className="max-w-4xl mx-auto">
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-sm font-semibold text-foreground" data-testid="text-trial-active">
                        Your free trial is active — {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''} remaining
                      </p>
                      <p className="text-xs text-muted-foreground">You have full Essential access. Subscribe before your trial ends to keep all features.</p>
                    </div>
                    <Button variant="outline" onClick={() => handleSubscribe("essential")} data-testid="button-subscribe-during-trial">
                      Subscribe Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-pricing-heading">Simple, Transparent Pricing</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                No hidden fees. Cancel anytime. Every paid plan comes with a 14-day free trial — no credit card needed.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricingTiers.map((tier, index) => (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    className={`h-full flex flex-col ${tier.highlighted ? 'border-primary ring-2 ring-primary/20' : ''}`}
                    data-testid={`pricing-card-${tier.id}`}
                  >
                    <CardHeader>
                      {tier.badge && (
                        <Badge className="w-fit mb-2 bg-primary text-primary-foreground">{tier.badge}</Badge>
                      )}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${tier.highlighted ? 'bg-primary/10' : 'bg-muted'}`}>
                        <tier.icon className={`w-5 h-5 ${tier.highlighted ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <CardTitle className="text-xl">{tier.name}</CardTitle>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{tier.audience}</p>
                      <CardDescription className="mt-1">{tier.description}</CardDescription>
                      <div className="pt-4">
                        <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                        <span className="text-muted-foreground ml-1">/{tier.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-3">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      {tier.id === "free" ? (
                        isAuthenticated ? (
                          <Button className="w-full" variant="outline" disabled data-testid="button-current-plan">
                            {userTier === "free" && !trialActive ? "Current Plan" : "Free Tier"}
                          </Button>
                        ) : (
                          <Button className="w-full" variant="outline" asChild data-testid="button-get-started-free">
                            <a href="/api/login">
                              {tier.buttonText}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </a>
                          </Button>
                        )
                      ) : tier.id === "enterprise" ? (
                        <Button className="w-full" variant="outline" asChild data-testid="button-contact-sales">
                          <a href="mailto:sales@getcyberright.com">
                            {tier.buttonText}
                          </a>
                        </Button>
                      ) : isAuthenticated && trialActive && tier.id === "essential" ? (
                        <Button 
                          className="w-full" 
                          variant="default"
                          onClick={() => handleSubscribe(tier.id)}
                          disabled={loadingTier === tier.id || isLoadingProducts}
                          data-testid={`button-subscribe-${tier.id}`}
                        >
                          {loadingTier === tier.id && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          <ShieldCheck className="w-4 h-4 mr-2" />
                          Subscribe — Trial Active
                        </Button>
                      ) : isAuthenticated && !trialUsed && userTier === "free" && tier.id !== "enterprise" ? (
                        <Button 
                          className="w-full" 
                          variant={tier.highlighted ? "default" : "outline"}
                          onClick={() => startTrialMutation.mutate()}
                          disabled={startTrialMutation.isPending}
                          data-testid={`button-start-trial-${tier.id}`}
                        >
                          {startTrialMutation.isPending ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : null}
                          Start 14-Day Free Trial
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : !isAuthenticated ? (
                        <Button 
                          className="w-full" 
                          variant={tier.highlighted ? "default" : "outline"}
                          asChild
                          data-testid={`button-login-${tier.id}`}
                        >
                          <a href="/api/login">
                            Start 14-Day Free Trial
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                      ) : (
                        <Button 
                          className="w-full" 
                          variant={tier.highlighted ? "default" : "outline"}
                          onClick={() => handleSubscribe(tier.id)}
                          disabled={loadingTier === tier.id || isLoadingProducts}
                          data-testid={`button-subscribe-${tier.id}`}
                        >
                          {loadingTier === tier.id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : isLoadingProducts ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : null}
                          {tier.buttonText}
                          {loadingTier !== tier.id && !isLoadingProducts && <ArrowRight className="w-4 h-4 ml-2" />}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12"
            >
              <Card className="bg-muted/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-foreground text-sm mb-1">What happens after the free trial?</h3>
                      <p className="text-muted-foreground text-sm">
                        You will not be charged during the 14-day trial. If you decide the plan is not for you, 
                        cancel anytime before the trial ends. Your free tools will always remain available.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Not sure which plan is right for you?
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                    Our team can help you find the perfect solution for your family or business. 
                    Schedule a free consultation to discuss your needs.
                  </p>
                  <Button size="lg" asChild>
                    <a href="mailto:info@getcyberright.com">
                      Schedule a Consultation
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
