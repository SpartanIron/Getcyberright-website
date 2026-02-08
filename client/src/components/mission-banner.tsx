import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Shield, Heart } from "lucide-react";
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
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Our Commitment
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight" data-testid="text-mission-heading">
                We Protect What Matters Most
              </h2>
              
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-8 h-8 text-accent flex-shrink-0" />
                <p className="text-2xl sm:text-3xl font-bold text-accent">
                  You.
                </p>
              </div>
              
              <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-6" data-testid="text-mission-description">
                Our commitment is simple and unwavering. Whether you are navigating everyday digital activity or responding to a serious cyber incident, GetCyberRight stands between you and the risks you should not have to face alone.
              </p>
              
              <Link href="/about">
                <Button className="rounded-full px-6" data-testid="button-mission-cta">
                  Learn About Our Mission
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
