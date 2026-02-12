import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const features = [
  {
    id: "scam-detection",
    category: "Scam Detection",
    headline: "Spot scams before they cost your family.",
    description: "Got a suspicious text or email? Paste it in and we will tell you if it is real or a scam. Free, instant, and no sign-up needed.",
    cta: "Check for Scams",
    href: "/tools",
    variant: "light" as const,
  },
  {
    id: "security-training",
    category: "Security Education",
    headline: "Learn to stay safe, in words you understand.",
    description: "Guides written for real people, not IT departments. Practical steps your whole family can follow, from teens to grandparents.",
    cta: "Browse Guides",
    href: "/resources",
    variant: "dark" as const,
  },
  {
    id: "family-protection",
    category: "Family Safety",
    headline: "Every generation, protected.",
    description: "Fun lessons for kids, scam alerts for seniors, monitoring tips for parents. Your whole family covered under one roof, for free.",
    cta: "Family Resources",
    href: "/training",
    variant: "medium" as const,
  },
  {
    id: "emergency-help",
    category: "Victim Support",
    headline: "Been scammed? We are here to help.",
    description: "Step-by-step guidance on what to do right now. Who to call, what to report, how to recover. You are not alone in this.",
    cta: "Get Help Now",
    href: "/emergency-help",
    variant: "pattern" as const,
  },
];

const variantStyles = {
  light: "bg-gray-100 dark:bg-gray-800 text-foreground",
  dark: "bg-primary dark:bg-primary/90 text-white",
  medium: "bg-accent dark:bg-accent/90 text-white",
  pattern: "bg-slate-800 dark:bg-slate-900 text-white bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]",
};

const buttonVariants = {
  light: "bg-white hover:bg-gray-50 text-foreground border border-border",
  dark: "bg-white/10 hover:bg-white/20 text-white border border-white/20",
  medium: "bg-white hover:bg-gray-50 text-foreground border border-border",
  pattern: "bg-white/10 hover:bg-white/20 text-white border border-white/20",
};

export function FeaturesGrid() {
  return (
    <section className="py-16 sm:py-24 bg-background" data-testid="section-features-grid" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            What We Offer
          </p>
          <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-features-heading">
            Everything You Need to Stay Safe Online
          </h2>
          <p className="text-lg text-muted-foreground">
            Free tools and plain-language guides for parents, kids, seniors, and everyday families.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-primary z-10 hidden lg:flex items-center justify-center shadow-lg">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-white/40" />
            </div>
          </div>

          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary/20 -translate-x-1/2 hidden lg:block" />
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-primary/20 -translate-y-1/2 hidden lg:block" />

          <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl p-8 sm:p-10 ${variantStyles[feature.variant]}`}
                data-testid={`card-feature-${feature.id}`}
              >
                <p className="text-sm font-medium uppercase tracking-wider opacity-70 mb-4">
                  {feature.category}
                </p>
                
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight" data-testid={`text-feature-headline-${feature.id}`}>
                  {feature.headline}
                </h3>
                
                <p className="opacity-80 mb-8 leading-relaxed" data-testid={`text-feature-desc-${feature.id}`}>
                  {feature.description}
                </p>
                
                <Link href={feature.href}>
                  <Button 
                    className={`rounded-full ${buttonVariants[feature.variant]}`}
                    data-testid={`button-feature-${feature.id}`}
                  >
                    {feature.cta}
                    <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
