import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import professionalImage from "@/assets/images/professional-laptop.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[700px] lg:min-h-[800px]" data-testid="section-hero">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-[10%] w-[400px] h-[400px] rounded-full border border-white/[0.03]" />
        <div className="absolute top-32 left-[15%] w-[300px] h-[300px] rounded-full border border-white/[0.05]" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full border border-white/[0.02]" />
        
        <div className="absolute top-1/4 right-1/3 w-2 h-2 rounded-full bg-white/10" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-white/10" />
        <div className="absolute top-2/3 left-1/4 w-1 h-1 rounded-full bg-white/10" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-white/10" />
        
        <svg className="absolute top-40 right-[45%] w-32 h-32 text-white/[0.03]" viewBox="0 0 100 100">
          <path d="M 10 50 Q 50 10 90 50" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
        <svg className="absolute bottom-32 left-[20%] w-24 h-24 text-white/[0.04]" viewBox="0 0 100 100">
          <path d="M 20 80 Q 50 20 80 80" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[700px] lg:min-h-[800px] py-20 lg:py-0">
          
          <div className="lg:col-span-6 z-10">
            <div className="max-w-xl">
              <p className="text-sm font-medium tracking-widest text-white/50 uppercase mb-6" data-testid="text-hero-eyebrow">
                Trusted Cybersecurity Education
              </p>
              
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-semibold tracking-tight text-white mb-8 leading-[1.1]" data-testid="text-hero-heading">
                Protect What Matters Most
              </h1>

              <p className="text-lg sm:text-xl text-white/60 mb-12 leading-relaxed max-w-lg" data-testid="text-hero-subtext">
                Expert guidance to safeguard your family, your identity, and your peace of mind in an increasingly connected world.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link href="/tools">
                  <Button 
                    size="lg" 
                    className="text-base px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" 
                    data-testid="button-hero-primary-cta"
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button 
                    variant="ghost" 
                    size="lg" 
                    className="text-base px-6 py-6 text-white/70 hover:text-white hover:bg-white/5" 
                    data-testid="button-hero-secondary-cta"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
              
              <div className="mt-16 pt-8 border-t border-white/10">
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-2xl font-semibold text-white">50K+</p>
                    <p className="text-sm text-white/40">Families Protected</p>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div>
                    <p className="text-2xl font-semibold text-white">100%</p>
                    <p className="text-sm text-white/40">Free Resources</p>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div>
                    <p className="text-2xl font-semibold text-white">6</p>
                    <p className="text-sm text-white/40">Continents Served</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="absolute -top-8 -right-8 w-72 h-72 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-gradient-to-tr from-blue-500/10 to-transparent blur-2xl" />
            
            <div className="relative">
              <div className="absolute -inset-px bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl" />
              
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={professionalImage}
                  alt="Professional working securely"
                  className="w-full h-[400px] sm:h-[480px] lg:h-[560px] object-cover"
                  data-testid="img-hero"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/60 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/40 via-transparent to-transparent" />
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-5 max-w-[240px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Verified Safe</p>
                    <p className="text-xs text-muted-foreground">No threats detected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
