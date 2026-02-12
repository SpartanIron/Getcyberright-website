import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, Heart, Globe } from "lucide-react";
import { Link } from "wouter";
import professionalImage from "@/assets/images/professional-laptop.jpg";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden" data-testid="section-hero">
      {/* ===== MOBILE LAYOUT ===== */}
      <div className="lg:hidden">
        <div className="relative w-full h-[200px] sm:h-[260px] overflow-hidden">
          <img
            src={professionalImage}
            alt="Professional cybersecurity protection"
            className="absolute inset-0 w-full h-full object-cover object-[center_25%]"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/40" />
        </div>
        
        <div className="relative px-5 py-8 bg-slate-900">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/20 px-3 py-1.5 rounded-full mb-4">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Free for Every Family
              </span>
            </div>
            
            <h1 
              className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4 leading-[1.15]" 
              data-testid="text-hero-heading-mobile"
            >
              Your Family's Safety Starts Here
            </h1>

            <p className="text-sm sm:text-base text-white/80 font-medium mb-4 leading-relaxed">
              Free tools that protect your kids, your parents, and you from scams, identity theft, and online threats. Built by a family, for families.
            </p>

            <ul className="space-y-2 mb-6 text-xs sm:text-sm font-medium text-left max-w-xs mx-auto">
              <li className="flex items-start gap-3 text-white/80">
                <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>100% free. No hidden fees. No premium tiers.</span>
              </li>
              <li className="flex items-start gap-3 text-white/80">
                <Heart className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Made for parents, kids, seniors, and everyday people</span>
              </li>
              <li className="flex items-start gap-3 text-white/80">
                <Users className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Plain language. No jargon. Just safety you can trust.</span>
              </li>
            </ul>

            <Link href="/tools">
              <Button 
                size="default" 
                className="rounded-full px-6 bg-accent text-accent-foreground border-accent-border shadow-lg" 
                data-testid="button-hero-primary-cta-mobile"
              >
                Check If It's a Scam
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="hidden lg:block min-h-[650px]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute right-0 top-0 w-2/3 h-full">
            <img
              src={professionalImage}
              alt="Professional cybersecurity protection"
              className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
              loading="eager"
              decoding="async"
              data-testid="img-hero-main"
            />
          </div>
        </div>

        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1440 500"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="curveEdgeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(174 65% 42%)" stopOpacity="0" />
              <stop offset="70%" stopColor="hsl(174 65% 42%)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="hsl(174 65% 42%)" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          
          <path
            d="M0,0 L680,0 Q880,250 680,500 L0,500 Z"
            fill="rgb(15 23 42)"
          />
          
          <path
            d="M680,0 Q880,250 680,500"
            fill="none"
            stroke="url(#curveEdgeGlow)"
            strokeWidth="4"
          />
          
          <path
            d="M690,10 Q890,250 690,490"
            fill="none"
            stroke="hsl(174 65% 42%)"
            strokeOpacity="0.3"
            strokeWidth="2"
          />
        </svg>

        <div className="absolute left-0 top-0 bottom-0 w-1/4 overflow-hidden pointer-events-none" aria-hidden="true">
          <svg className="absolute -left-16 top-1/2 -translate-y-1/2 w-[350px] h-[350px]" viewBox="0 0 350 350">
            {Array.from({ length: 50 }).map((_, i) => {
              const angle = (i / 50) * Math.PI * 0.7 + Math.PI * 0.65;
              const radius = 120 + Math.random() * 35;
              const x = 175 + Math.cos(angle) * radius;
              const y = 175 + Math.sin(angle) * radius;
              const size = 1 + Math.random() * 2;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={size}
                  fill="hsl(174 65% 42%)"
                  opacity={0.2 + Math.random() * 0.4}
                />
              );
            })}
            <path
              d="M40,310 Q175,175 310,40"
              fill="none"
              stroke="hsl(174 65% 42%)"
              strokeOpacity="0.3"
              strokeWidth="1"
            />
          </svg>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 overflow-visible pointer-events-none" aria-hidden="true">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-accent/80" />
          <div className="absolute top-24 right-4 w-20 h-20 rounded-full bg-accent/60" />
          <div className="absolute bottom-16 -right-6 w-24 h-24 rounded-full bg-accent/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 h-full flex items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full mb-6">
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Free for Every Family
              </span>
            </div>

            <h1 
              className="text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6" 
              data-testid="text-hero-heading"
            >
              Your Family's Safety Starts Here
            </h1>

            <p 
              className="text-xl text-white/90 font-medium leading-relaxed mb-4" 
              data-testid="text-hero-subtext"
            >
              Free tools that protect your kids, your parents, and you from scams, identity theft, and online threats. Built by a family, for families.
            </p>

            <ul className="space-y-3 mb-10 text-sm font-medium">
              <li className="flex items-center gap-3 text-white/85">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                </div>
                <span>100% free. No hidden fees. No premium tiers.</span>
              </li>
              <li className="flex items-center gap-3 text-white/85">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-primary flex-shrink-0" />
                </div>
                <span>Made for parents, kids, seniors, and everyday people</span>
              </li>
              <li className="flex items-center gap-3 text-white/85">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary flex-shrink-0" />
                </div>
                <span>Plain language. No jargon. Just safety you can trust.</span>
              </li>
            </ul>

            <Link href="/tools">
              <Button 
                size="lg" 
                className="rounded-full px-8 py-6 text-base bg-accent text-accent-foreground border-accent-border shadow-lg" 
                data-testid="button-hero-primary-cta"
              >
                Check If It's a Scam
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
