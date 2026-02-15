import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export function CTAFooter() {
  return (
    <section className="py-10 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" data-testid="section-cta-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-white" data-testid="text-cta-footer-heading">
              Protect your family today.
            </h2>
            <p className="text-sm text-white/70 mt-1">
              Check a suspicious message, remove your data from brokers, or learn how to stay safe online. No sign-up needed.
            </p>
          </div>
          <Link href="/tools">
            <Button size="default" className="bg-accent text-accent-foreground border-accent-border" data-testid="button-cta-footer">
              Check If It's a Scam
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
