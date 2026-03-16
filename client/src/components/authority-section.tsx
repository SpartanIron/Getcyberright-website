import { Link } from "wouter";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import authorityImg from "@/assets/images/feature-family-learning-diverse.png";

const trustPoints = [
  "Backed by the same data that law enforcement and security agencies worldwide rely on",
  "Every scan checks 8 trusted sources to tell you if something is safe",
  "Built to internationally recognized safety standards",
  "Designed for families, not IT departments",
  "Free to get started, no account required",
  "Trusted by families, educators, and small businesses",
];

export function AuthoritySection() {
  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-muted/30" data-testid="section-authority" aria-labelledby="authority-heading">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={authorityImg}
                  alt="Diverse family learning about online safety together"
                  className="w-full h-64 sm:h-80 lg:h-auto object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-2xl -z-10 hidden sm:block" />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/10 rounded-2xl -z-10 hidden sm:block" />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 id="authority-heading" className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6" data-testid="text-authority-heading">
              Built on the Same Data the Experts Use
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-10">
              GetCyberRight uses the same safety tools that protect banks and government agencies worldwide, now available to your family.
            </p>

            <div className="space-y-0 mb-10">
              {trustPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 py-4 border-b border-border last:border-b-0"
                  data-testid={`text-trust-point-${index}`}
                >
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-base text-foreground leading-relaxed">{point}</span>
                </div>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full font-semibold text-base px-8"
              data-testid="button-learn-mission"
            >
              <Link href="/about">
                About Our Mission <ArrowRight className="ml-2 w-5 h-5 cta-arrow-right" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
