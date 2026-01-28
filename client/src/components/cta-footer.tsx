import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export function CTAFooter() {
  return (
    <section className="py-20 sm:py-28 bg-gray-900" data-testid="section-cta-footer">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6" data-testid="text-cta-footer-heading">
          Start Protecting Your Family Today
        </h2>
        <p className="text-xl text-white/70 mb-10">
          It's free, instant, and requires no sign-up.
        </p>
        <Link href="/tools">
          <Button size="lg" className="text-lg px-10 py-6" data-testid="button-cta-footer">
            Check If It's a Scam
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
