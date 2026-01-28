import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Play, Shield, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import logoImage from "@assets/image_(3)_1769558492356.png";
import familyImage from "@/assets/images/family-laptop.jpg";
import seniorImage from "@/assets/images/senior-tablet.jpg";
import professionalImage from "@/assets/images/professional-laptop.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-8 pb-16 sm:pt-12 sm:pb-24 lg:pt-16 lg:pb-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-6 border border-white/20">
              <img src={logoImage} alt="" className="w-5 h-5 object-contain" />
              <span>Trusted Cybersecurity Education</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              Protecting People From{" "}
              <span className="text-primary">Modern Cyber Scams</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Simple, practical cybersecurity education and tools for families,
              seniors, and organizations. Stay safe online without the technical
              jargon.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link href="/tools">
                <Button size="lg" className="text-base w-full sm:w-auto" data-testid="button-hero-primary-cta">
                  Get Free Protection Resources
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="text-base border-white/30 text-white bg-white/5 backdrop-blur-sm"
                data-testid="button-hero-secondary-cta"
              >
                <Play className="mr-2 w-4 h-4" />
                Learn How Scammers Operate
              </Button>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center lg:justify-start text-sm text-white/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>100% Free Resources</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>No Technical Knowledge Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Trusted by Thousands</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative h-[580px] w-full">
              <motion.div
                initial={{ opacity: 0, y: 30, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: -3 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute bottom-0 left-0 w-[340px] h-[240px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 z-10"
              >
                <img 
                  src={professionalImage} 
                  alt="Professional working securely on computer" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-white">
                    <Lock className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Business Security</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30, rotate: 0 }}
                animate={{ opacity: 1, x: 0, rotate: 4 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute top-8 left-8 w-[280px] h-[200px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 z-20"
              >
                <img 
                  src={seniorImage} 
                  alt="Senior using technology safely with family" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-white">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Senior Safety</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40, rotate: 0 }}
                animate={{ opacity: 1, x: 0, rotate: -2 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute top-16 right-0 w-[380px] h-[320px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 z-30"
              >
                <img 
                  src={familyImage} 
                  alt="Family using devices together safely" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium">Family Protected</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="absolute top-0 right-16 bg-white rounded-xl shadow-xl p-4 z-40"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Phishing Blocked</p>
                    <p className="text-xs text-gray-500">Threat detected & stopped</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="absolute bottom-24 right-8 bg-white rounded-xl shadow-xl p-4 z-40"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">50K+</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Families Protected</p>
                    <p className="text-xs text-gray-500">Across 6 continents</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.9 }}
                className="absolute top-48 left-0 bg-white rounded-xl shadow-xl p-3 z-40"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary border-2 border-white">S</div>
                    <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-xs font-semibold text-accent border-2 border-white">M</div>
                    <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-xs font-semibold text-green-600 border-2 border-white">J</div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">4.9/5 Rating</p>
                    <p className="text-[10px] text-gray-500">2,500+ reviews</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
