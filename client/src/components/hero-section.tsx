import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, BookOpen } from "lucide-react";
import { Link } from "wouter";
import professionalImage from "@/assets/images/professional-laptop.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-900 min-h-[600px] lg:min-h-[700px]" data-testid="section-hero">
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center min-h-[600px] lg:min-h-[700px] gap-8 lg:gap-12 py-16 lg:py-0">
          
          <div className="w-full lg:w-1/2 z-10 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-white mb-6 leading-[1.1]" data-testid="text-hero-heading">
              #1 Free Cybersecurity Education Platform
            </h1>

            <p className="text-xl text-white/80 mb-8 leading-relaxed" data-testid="text-hero-subtext">
              Everything you need to protect yourself and your family from online threats, all in one place.
            </p>

            <ul className="space-y-3 mb-10 text-left mx-auto lg:mx-0 max-w-md">
              <li className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>Free scam detection tools</span>
              </li>
              <li className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>Guides for families, seniors, and businesses</span>
              </li>
              <li className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>Plain language security education</span>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
              <Link href="/tools">
                <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/30" data-testid="button-hero-primary-cta">
                  Check If It's a Scam
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/resources">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full border-white/30 text-white hover:bg-white/10 backdrop-blur-sm" data-testid="button-hero-secondary-cta">
                  Browse Resources
                </Button>
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0">
            <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border-[40px] border-cyan-500/30 hidden lg:block" />
            
            <div className="absolute -right-10 top-10 w-24 h-24 rounded-full bg-primary opacity-80 hidden lg:block" />
            <div className="absolute right-20 -bottom-10 w-16 h-16 rounded-full bg-primary/60 hidden lg:block" />
            
            <div className="absolute -right-20 top-20 w-40 h-80 bg-gradient-to-b from-primary/40 to-transparent skew-x-12 hidden lg:block" />

            <div className="relative z-10 max-w-lg mx-auto lg:ml-auto">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/50 to-primary/50 rounded-2xl blur-lg opacity-60" />
                
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src={professionalImage}
                    alt="Professional using laptop securely"
                    className="w-full h-[350px] sm:h-[400px] lg:h-[450px] object-cover"
                    data-testid="img-hero"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
