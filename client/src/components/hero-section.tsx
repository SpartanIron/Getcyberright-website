import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import familyImage from "@/assets/images/hero-family.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0">
        <img 
          src={familyImage} 
          alt="Family using technology safely together" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]" data-testid="text-hero-heading">
            Protect Your Family From Online Scams
          </h1>

          <p className="text-xl sm:text-2xl text-white/80 mb-10 leading-relaxed max-w-2xl" data-testid="text-hero-subtext">
            Free tools and plain-language guides for families, seniors, and small businesses.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
            <Link href="/tools">
              <Button size="lg" className="text-lg px-8 py-6" data-testid="button-hero-primary-cta">
                Check If It's a Scam
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/resources" className="text-white/70 hover:text-white underline underline-offset-4 mt-3 sm:mt-4 transition-colors" data-testid="link-hero-secondary">
              Or browse free resources
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
