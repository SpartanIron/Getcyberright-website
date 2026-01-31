import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Shield } from "lucide-react";

export function CTAFooter() {
  return (
    <section className="py-10 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" data-testid="section-cta-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Our Commitment
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white" data-testid="text-cta-footer-heading">
              We Protect What Matters Most. You.
            </h2>
            <p className="text-sm text-white/70 mt-1">
              Enter the GetCyberRight platform with confidence, clarity, and protection.
            </p>
          </div>
          <Link href="/tools">
            <Button size="default" className="bg-accent hover:bg-accent/90 text-white" data-testid="button-cta-footer">
              Begin Your Protected Experience
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
