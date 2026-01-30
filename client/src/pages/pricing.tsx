import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Shield, 
  Users, 
  Briefcase,
  Building2,
  ArrowRight,
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import bannerImage from "@/assets/banners/resources-banner.png";

interface PricingTier {
  id: string;
  name: string;
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
    description: "Essential tools for personal protection",
    price: "$0",
    period: "forever",
    icon: Shield,
    features: [
      "Scam Checker tool",
      "Password Generator",
      "Breach Checker",
      "Basic security guides",
      "Email newsletter"
    ],
    buttonText: "Get Started"
  },
  {
    id: "essential",
    name: "Essential",
    description: "Enhanced protection for families",
    price: "$9",
    period: "per month",
    icon: Users,
    features: [
      "Everything in Free, plus:",
      "Priority scam analysis",
      "Extended threat reports",
      "Family safety toolkit",
      "Monthly security webinars",
      "Email support"
    ],
    buttonText: "Subscribe Now"
  },
  {
    id: "professional",
    name: "Professional",
    description: "Comprehensive security for small teams",
    price: "$29",
    period: "per month",
    icon: Briefcase,
    features: [
      "Everything in Essential, plus:",
      "Up to 5 team members",
      "Business email protection",
      "Employee training resources",
      "Quarterly security reviews",
      "Priority support"
    ],
    highlighted: true,
    buttonText: "Subscribe Now",
    badge: "Most Popular"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Custom solutions for organizations",
    price: "Custom",
    period: "contact us",
    icon: Building2,
    features: [
      "Everything in Professional, plus:",
      "Unlimited team members",
      "Custom training programs",
      "Dedicated account manager",
      "API access",
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
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const { data: stripeData, isLoading: isLoadingProducts } = useQuery<{ products: StripeProduct[] }>({
    queryKey: ['/api/stripe/products'],
    staleTime: 1000 * 60 * 5,
    retry: 2,
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
      <Navigation />
      
      <main>
        <PageBanner
          title="Pricing Plans"
          subtitle="Choose the protection level that fits your needs. All plans include our core security tools."
          imageSrc={bannerImage}
          imageAlt="Cybersecurity protection plans"
          imagePosition="right"
          colorVariant="blue"
        />

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                No hidden fees. Cancel anytime. All premium plans include a 14-day free trial.
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
                        <Badge className="w-fit mb-2 bg-accent text-white">{tier.badge}</Badge>
                      )}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${tier.highlighted ? 'bg-accent/10' : 'bg-primary/10'}`}>
                        <tier.icon className={`w-5 h-5 ${tier.highlighted ? 'text-accent' : 'text-primary'}`} />
                      </div>
                      <CardTitle className="text-xl">{tier.name}</CardTitle>
                      <CardDescription>{tier.description}</CardDescription>
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
                          <Button className="w-full" variant="outline" disabled>
                            Current Plan
                          </Button>
                        ) : (
                          <Button className="w-full" variant="outline" asChild>
                            <a href="/api/login">
                              {tier.buttonText}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </a>
                          </Button>
                        )
                      ) : tier.id === "enterprise" ? (
                        <Button className="w-full" variant="outline" asChild>
                          <a href="mailto:sales@getcyberright.com">
                            {tier.buttonText}
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
