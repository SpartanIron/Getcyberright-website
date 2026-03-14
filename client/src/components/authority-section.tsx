import { Link } from "wouter";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const trustPoints = [
  "Safety data sourced from FBI IC3, CISA, INTERPOL, Europol, and FTC",
  "Real-time monitoring from 8 verified security databases",
  "Content aligned with U.S. government cybersecurity standards",
  "Written in plain language by cybersecurity professionals",
  "Free to get started with no account required for core tools",
  "Used by families, educators, and small businesses worldwide",
];

export function AuthoritySection() {
  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-muted/30" data-testid="section-authority" aria-labelledby="authority-heading">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-start">
          <div>
            <h2 id="authority-heading" className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6" data-testid="text-authority-heading">
              Why People Trust GetCyberRight
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-5">
              Online safety should not be complicated or expensive. We turn the same data that large organizations use into simple, everyday guidance anyone can follow.
            </p>
            <p className="text-xl text-muted-foreground leading-relaxed mb-10">
              Our tools and content are backed by the same government and industry sources that professionals rely on. The difference is we make it accessible to everyone.
            </p>

            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl font-semibold text-base px-8"
                data-testid="button-learn-mission"
              >
                About Our Mission <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          <div className="space-y-0">
            {trustPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-4 py-5 border-b border-border last:border-b-0"
                data-testid={`text-trust-point-${index}`}
              >
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-lg text-foreground leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
