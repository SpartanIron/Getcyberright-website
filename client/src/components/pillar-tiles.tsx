import { Link } from "wouter";
import { ArrowRight, Search, Trash2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroFamilyImg from "@/assets/images/hero-family-diverse.png";
import seniorImg from "@/assets/images/about-seniors-learning.png";
import businessImg from "@/assets/images/business-security-training.png";

const features = [
  {
    id: "scam-checker",
    label: "Most Popular",
    title: "AI Scam Checker",
    description: "Paste a suspicious URL, email, phone number, or message and get an instant risk analysis. Checked against 8 trusted security databases in real time.",
    href: "/scam-checker",
    cta: "Check a Scam",
    icon: Search,
    image: heroFamilyImg,
    imageAlt: "Family using computer together to check online safety",
    accent: "bg-red-500",
    accentText: "text-red-600 dark:text-red-400",
    borderAccent: "border-red-200 dark:border-red-500/20",
  },
  {
    id: "data-removal",
    label: "Privacy",
    title: "Data Broker Removal",
    description: "Your personal information is for sale on 500+ data broker websites. Our removal tool identifies where you're exposed and walks you through removing it.",
    href: "/data-removal",
    cta: "Protect Your Data",
    icon: Trash2,
    image: seniorImg,
    imageAlt: "Seniors learning to protect their personal data online",
    accent: "bg-teal-500",
    accentText: "text-teal-600 dark:text-teal-400",
    borderAccent: "border-teal-200 dark:border-teal-500/20",
  },
  {
    id: "training",
    label: "Education",
    title: "Training Academy",
    description: "Structured, audience-specific courses for parents, seniors, kids, and small businesses. Earn badges and build real cybersecurity awareness at your own pace.",
    href: "/training",
    cta: "Start Learning",
    icon: GraduationCap,
    image: businessImg,
    imageAlt: "Diverse team participating in cybersecurity training",
    accent: "bg-blue-500",
    accentText: "text-blue-600 dark:text-blue-400",
    borderAccent: "border-blue-200 dark:border-blue-500/20",
  },
];

export function PillarTiles() {
  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-background" data-testid="section-pillar-tiles" aria-labelledby="pillars-heading">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 sm:mb-20">
          <h2 id="pillars-heading" className="text-4xl sm:text-5xl font-extrabold text-foreground mb-5" data-testid="text-pillars-heading">
            What We Do
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Three core tools that give everyday people the same level of protection that large organizations have. All free to get started.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:shadow-xl transition-shadow duration-300"
              data-testid={`card-feature-${feature.id}`}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5`}>
                    {feature.label}
                  </span>
                </div>
              </div>

              <div className="p-7 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <feature.icon className={`w-6 h-6 ${feature.accentText}`} />
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">{feature.title}</h3>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed mb-6">{feature.description}</p>

                <Link href={feature.href}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full font-semibold text-base px-8 w-full sm:w-auto"
                    data-testid={`button-feature-${feature.id}`}
                  >
                    {feature.cta}
                    <ArrowRight className="ml-2 w-5 h-5 cta-arrow-right" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
