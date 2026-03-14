import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export function CTAFooter() {
  return (
    <section className="py-14 sm:py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" data-testid="section-cta-footer">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white" data-testid="text-cta-footer-heading">
              Your family's safety is worth 5 minutes.
            </h2>
            <p className="text-lg text-white/70 mt-3">
              Take a quick safety check and find out where your family stands. No account needed, no data stored.
            </p>
          </div>
          <Link href="/cyber-hygiene">
            <Button size="lg" className="bg-accent text-accent-foreground border-accent-border rounded-full px-8 font-semibold text-base" data-testid="button-cta-footer">
              Take the Safety Check
              <ArrowRight className="ml-2 w-5 h-5 cta-arrow-right" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
