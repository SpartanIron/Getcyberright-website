import { Link } from "wouter";
import { ArrowRight, Search, Trash2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    id: "scam-checker",
    label: "Most Popular",
    title: "AI Scam Checker",
    description: "Paste a suspicious URL, email, phone number, or message and get an instant risk analysis. Checked against 8 trusted security databases in real time.",
    href: "/scam-checker",
    cta: "Check a Scam",
    icon: Search,
    accent: "bg-red-500",
    accentLight: "bg-red-50 dark:bg-red-500/10",
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
    accent: "bg-teal-500",
    accentLight: "bg-teal-50 dark:bg-teal-500/10",
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
    accent: "bg-blue-500",
    accentLight: "bg-blue-50 dark:bg-blue-500/10",
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

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`relative border ${feature.borderAccent} rounded-2xl overflow-hidden bg-card`}
              data-testid={`card-feature-${feature.id}`}
            >
              <div className={`h-1.5 ${feature.accent}`} />
              <div className="p-8 sm:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-xl ${feature.accentLight} flex items-center justify-center`}>
                    <feature.icon className={`w-7 h-7 ${feature.accentText}`} />
                  </div>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${feature.accentText}`}>
                    {feature.label}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">{feature.title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">{feature.description}</p>

                <Link href={feature.href}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-xl font-semibold text-base px-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    data-testid={`button-feature-${feature.id}`}
                  >
                    {feature.cta}
                    <ArrowRight className="ml-2 w-5 h-5" />
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
