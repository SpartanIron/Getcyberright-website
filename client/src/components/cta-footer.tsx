import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import aboutFamilyImg from "@/assets/images/about-family-together.webp";

export function CTAFooter() {
  return (
    <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-cta-footer">
      <div className="absolute inset-0">
        <img
          src={aboutFamilyImg}
          alt="Diverse family learning online safety together"
          className="w-full h-full object-cover"
          loading="lazy"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[#0A2A3C]/55" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white" data-testid="text-cta-footer-heading">
              Five minutes today could save your family from a scam tomorrow.
            </h2>
            <p className="text-lg text-white/80 mt-3">
              Take a quick safety check and see where you stand. No account needed, nothing stored.
            </p>
          </div>
          <Button asChild size="lg" className="bg-accent text-accent-foreground border-accent-border rounded-full px-8 font-semibold text-base flex-shrink-0" data-testid="button-cta-footer">
            <Link href="/cyber-hygiene">
              Take the Safety Check
              <ArrowRight className="ml-2 w-5 h-5 cta-arrow-right" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
