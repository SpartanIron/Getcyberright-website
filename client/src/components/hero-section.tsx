import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, CheckCircle, Users, Heart, Briefcase } from "lucide-react";
import { Link } from "wouter";
import { EmailCaptureModal } from "@/components/email-capture-modal";
import professionalImage from "@/assets/images/professional-laptop.jpg";

const trustBadges = [
  "Trusted by families across America",
  "NIST-aligned best practices",
  "Recommended by cybersecurity experts",
];

const quickBenefits = [
  "Plain-language guides anyone can follow",
  "Free tools to check for scams instantly",
  "No tech background required",
];

export function HeroSection() {
  const [showEmailModal, setShowEmailModal] = useState(false);

  return (
    <>
      <section className="relative w-full overflow-hidden" data-testid="section-hero">
        {/* ===== MOBILE LAYOUT ===== */}
        <div className="lg:hidden">
          <div className="relative w-full h-[180px] sm:h-[220px] overflow-hidden">
            <img
              src={professionalImage}
              alt="Family staying safe online together"
              className="absolute inset-0 w-full h-full object-cover object-[center_25%]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/60" />
          </div>
          
          <div className="relative px-5 py-8 bg-slate-900">
            <div className="max-w-md mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/20 px-3 py-1.5 rounded-full mb-4">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Free Cyber Safety Resources
                </span>
              </div>
              
              <h1 
                className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4 leading-[1.15]" 
                data-testid="text-hero-heading-mobile"
              >
                Protect Your Family From Scams — Simple Steps You Can Use Today
              </h1>

              <p className="text-sm sm:text-base text-white/85 font-medium mb-6 leading-relaxed">
                Plain-language cyber safety guides, checklists, and free tools for parents and seniors. No tech background required.
              </p>

              <div className="space-y-2 mb-6 text-left max-w-xs mx-auto">
                {quickBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2 text-white/80 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <Button 
                  size="default" 
                  onClick={() => setShowEmailModal(true)}
                  className="w-full rounded-full bg-accent text-accent-foreground border-accent-border shadow-lg text-base py-6" 
                  data-testid="button-hero-primary-cta-mobile"
                >
                  Get the Free Family Safety Checklist
                </Button>
                
                <Link href="/training/business">
                  <Button 
                    variant="outline" 
                    size="default"
                    className="w-full rounded-full text-white border-white/30 hover:bg-white/10"
                    data-testid="button-hero-secondary-cta-mobile"
                  >
                    See Business Solutions
                  </Button>
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-white/60 mb-2">Trusted by families, seniors, and small organizations</p>
                <div className="flex flex-wrap justify-center gap-4 text-xs text-white/50">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> Families
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> Seniors
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> Small Business
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== DESKTOP LAYOUT ===== */}
        <div className="hidden lg:block min-h-[600px]">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute right-0 top-0 w-2/3 h-full">
              <img
                src={professionalImage}
                alt="Family staying safe online together"
                className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
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
          </svg>

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 h-full flex items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full mb-6">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Free Cyber Safety Resources
                </span>
              </div>

              <h1 
                className="text-4xl xl:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-6" 
                data-testid="text-hero-heading"
              >
                Protect Your Family From Scams — Simple Steps You Can Use Today
              </h1>

              <p 
                className="text-xl text-white/90 font-medium leading-relaxed mb-6" 
                data-testid="text-hero-subtext"
              >
                Plain-language cyber safety guides, checklists, and free tools for parents and seniors. No tech background required.
              </p>

              <div className="space-y-3 mb-8">
                {quickBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 text-white/85 text-base">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <Button 
                  size="lg" 
                  onClick={() => setShowEmailModal(true)}
                  className="rounded-full px-8 py-6 text-base bg-accent text-accent-foreground border-accent-border shadow-lg" 
                  data-testid="button-hero-primary-cta"
                >
                  Get the Free Family Safety Checklist
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <Link href="/training/business">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="rounded-full px-6 py-6 text-base text-white border-white/30 hover:bg-white/10"
                    data-testid="button-hero-secondary-cta"
                  >
                    See Business Solutions
                  </Button>
                </Link>
              </div>

              <div className="pt-6 border-t border-white/10">
                <p className="text-sm text-white/60 mb-3">Trusted by families, seniors, and small organizations</p>
                <div className="flex flex-wrap gap-6 text-sm text-white/70">
                  {trustBadges.map((badge, index) => (
                    <span key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EmailCaptureModal
        open={showEmailModal}
        onOpenChange={setShowEmailModal}
        title="Get Your Free Family Cyber Safety Checklist"
        description="A practical, step-by-step guide covering password security, scam recognition, safe browsing, and protecting your family's digital identity."
        resourceName="Family Cyber Safety Checklist"
      />
    </>
  );
}
