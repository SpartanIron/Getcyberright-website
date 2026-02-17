import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Shield, Globe } from "lucide-react";
import professionalImage from "@/assets/images/professional-focused.jpg";

export function MissionBanner() {
  return (
    <section className="relative overflow-hidden" data-testid="section-mission-banner">
      <div className="relative h-[550px] sm:h-[600px] lg:h-[650px]">
        <img
          src={professionalImage}
          alt="Professional staying safe online"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          data-testid="img-mission-banner"
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />

        <div className="absolute right-8 top-8 w-32 h-32 rounded-full bg-primary opacity-90 hidden lg:block" />
        <div className="absolute right-24 top-32 w-20 h-20 rounded-full bg-accent/80 hidden lg:block" />
        <div className="absolute right-4 bottom-20 w-16 h-16 rounded-full bg-accent/50 hidden lg:block" />

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="w-full max-w-lg lg:max-w-xl">
            <div className="bg-slate-900/95 backdrop-blur-sm rounded-2xl p-8 sm:p-10 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Our Mission
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight" data-testid="text-mission-heading">
                Cybersecurity Belongs to Everyone
              </h2>
              
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-8 h-8 text-accent flex-shrink-0" />
                <p className="text-2xl sm:text-3xl font-bold text-accent">
                  Not just those who can afford it.
                </p>
              </div>
              
              <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-6" data-testid="text-mission-description">
                Most cybersecurity is built for enterprises and IT professionals. That leaves everyday people, your parents, your kids, your neighbors, unprotected. We exist to close that gap with free tools, trusted guidance, and a community that has each other's backs.
              </p>
              
              <Link href="/about">
                <Button className="rounded-full px-6" data-testid="button-mission-cta">
                  Learn Why We Do This
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
