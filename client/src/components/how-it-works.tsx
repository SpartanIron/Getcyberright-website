import { Link } from "wouter";
import { ArrowRight, Search, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "1",
    icon: Search,
    title: "Paste anything that looks suspicious",
    description: "Got a weird text, email, or link? Copy it and drop it into GCR Scam Guard. No account, no download, no hassle.",
    color: "bg-primary/10 text-primary",
  },
  {
    number: "2",
    icon: Shield,
    title: "We run it through 8 safety sources",
    description: "In seconds, your submission is checked against VirusTotal, PhishTank, Google Safe Browsing, and five other trusted databases.",
    color: "bg-accent/10 text-accent",
  },
  {
    number: "3",
    icon: CheckCircle,
    title: "Get a clear answer, not a tech report",
    description: "Safe, suspicious, or dangerous, explained in plain language with a breakdown anyone can understand.",
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-20 bg-background" data-testid="section-how-it-works">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3" data-testid="text-how-it-works-heading">
            Protection in Three Simple Steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            If you can copy and paste, you can protect your family.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {steps.map((step) => (
            <div key={step.number} className="relative text-center" data-testid={`how-it-works-step-${step.number}`}>
              <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-5`}>
                <step.icon className="w-7 h-7" />
              </div>

              <div className="absolute -top-2 left-1/2 -translate-x-[52px] w-8 h-8 rounded-full bg-foreground text-background text-sm font-bold flex items-center justify-center">
                {step.number}
              </div>

              <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>

              {step.number !== "3" && (
                <div className="hidden md:block absolute top-8 -right-6 lg:-right-8">
                  <ArrowRight className="w-5 h-5 text-muted-foreground/30" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-accent text-accent-foreground border-accent-border font-semibold px-8 text-base shadow-[0_4px_24px_-4px] shadow-accent/40 hover:shadow-[0_6px_32px_-4px] hover:shadow-accent/50 hover:scale-[1.02] transition-all duration-300"
            data-testid="button-how-it-works-cta"
          >
            <Link href="/scam-checker">
              Try It Now
              <ArrowRight className="ml-2 w-5 h-5 cta-arrow-right" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
