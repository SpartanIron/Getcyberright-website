import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import professionalImage from "@/assets/images/professional-focused.jpg";

export function MissionBanner() {
  return (
    <section className="relative overflow-hidden" data-testid="section-mission-banner">
      <div className="relative h-[500px] sm:h-[550px] lg:h-[600px]">
        <img
          src={professionalImage}
          alt="Professional staying safe online"
          className="absolute inset-0 w-full h-full object-cover"
          data-testid="img-mission-banner"
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20" />

        <div className="absolute right-8 top-8 w-32 h-32 rounded-full bg-primary opacity-90 hidden lg:block" />
        <div className="absolute right-24 top-32 w-20 h-20 rounded-full bg-primary/60 hidden lg:block" />
        <div className="absolute right-4 bottom-20 w-16 h-16 rounded-full bg-primary/40 hidden lg:block" />

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="w-full max-w-md lg:max-w-lg">
            <div className="bg-slate-900/95 backdrop-blur-sm rounded-2xl p-8 sm:p-10 shadow-2xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight" data-testid="text-mission-heading">
                Rise Above the Threats
              </h2>
              
              <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8" data-testid="text-mission-description">
                From everyday browsing to protecting your family — we help you build habits that keep you safe, confident, and in control online.
              </p>
              
              <Link href="/about">
                <Button className="rounded-full px-6" data-testid="button-mission-cta">
                  Why GetCyberRight
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
