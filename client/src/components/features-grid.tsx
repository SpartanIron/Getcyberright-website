import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { ArrowRight } from "lucide-react";
import featureScamImg from "@/assets/images/feature-scam-detection-diverse.webp";
import featureLearningImg from "@/assets/images/feature-family-learning-diverse.webp";
import featureGenerationImg from "@/assets/images/feature-every-generation-diverse.webp";
import featureEmergencyImg from "@/assets/images/feature-emergency-help-diverse.webp";

const features = [
  {
    id: "scam-detection",
    category: "Scam Detection",
    headline: "Not sure if it's a scam? Find out in seconds.",
    description: "Paste that suspicious text, email, or link and get a plain-English answer. We built this because our own family kept asking us to check things for them.",
    cta: "Check for Scams",
    href: "/tools",
    image: featureScamImg,
  },
  {
    id: "security-training",
    category: "Family Learning",
    headline: "Learn to stay safe, the way we'd teach our own family.",
    description: "Short, practical guides written for real people. No IT background needed. Just clear steps your whole family can follow together.",
    cta: "Start Learning",
    href: "/resources",
    image: featureLearningImg,
  },
  {
    id: "family-protection",
    category: "Every Generation",
    headline: "Your kids, your parents, and you. All covered.",
    description: "Interactive safety lessons for kids. Scam protection for seniors. Monitoring tips for parents. Pick the path that fits your family.",
    cta: "Find Your Path",
    href: "/training",
    image: featureGenerationImg,
  },
  {
    id: "emergency-help",
    category: "We've Got Your Back",
    headline: "Been scammed? We will walk you through it.",
    description: "It happens to the best of us. Here is exactly what to do right now: who to call, what to report, and how to recover. You are not alone.",
    cta: "Get Help Now",
    href: "/emergency-help",
    image: featureEmergencyImg,
  },
];

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
            What We Can Help You With
          </h2>
          <p className="text-lg text-muted-foreground">
            The same things we help our own family with, now available to yours.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative rounded-2xl overflow-hidden group min-h-[320px] sm:min-h-[360px]"
              data-testid={`card-feature-${feature.id}`}
            >
              <img
                src={feature.image}
                alt={feature.headline}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />
              <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                  {feature.category}
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight" data-testid={`text-feature-headline-${feature.id}`}>
                  {feature.headline}
                </h3>
                <p className="text-sm text-white/80 mb-5 leading-relaxed line-clamp-3" data-testid={`text-feature-desc-${feature.id}`}>
                  {feature.description}
                </p>
                <Link href={feature.href}>
                  <Button
                    className="rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-sm w-fit"
                    data-testid={`button-feature-${feature.id}`}
                  >
                    {feature.cta}
                    <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
