import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Play, Shield, Lock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import logoImage from "@assets/image_(3)_1769558492356.png";
import familyImage from "@/assets/images/family-devices.jpg";
import seniorImage from "@/assets/images/senior-safety.jpg";
import businessImage from "@/assets/images/small-business.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-8 pb-16 sm:pt-12 sm:pb-24 lg:pt-16 lg:pb-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
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
            className="relative hidden lg:block h-[500px]"
          >
            <motion.div
              initial={{ opacity: 0, x: 40, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute top-0 right-0 w-72 h-48 rounded-xl overflow-hidden shadow-2xl border-4 border-white/10 z-30"
              style={{ transform: "rotate(3deg)" }}
            >
              <img 
                src={familyImage} 
                alt="Family staying safe online" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center gap-2 text-white text-xs font-medium">
                  <Shield className="w-3 h-3 text-primary" />
                  <span>Family Protection</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30, y: -10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute top-24 left-0 w-64 h-44 rounded-xl overflow-hidden shadow-2xl border-4 border-white/10 z-20"
              style={{ transform: "rotate(-4deg)" }}
            >
              <img 
                src={seniorImage} 
                alt="Senior using technology safely" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center gap-2 text-white text-xs font-medium">
                  <Lock className="w-3 h-3 text-primary" />
                  <span>Senior Safety</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute bottom-12 right-8 w-80 h-52 rounded-xl overflow-hidden shadow-2xl border-4 border-white/10 z-10"
              style={{ transform: "rotate(-2deg)" }}
            >
              <img 
                src={businessImage} 
                alt="Small business cybersecurity" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center gap-2 text-white text-xs font-medium">
                  <AlertTriangle className="w-3 h-3 text-primary" />
                  <span>Business Security</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="absolute top-8 left-16 bg-white rounded-xl shadow-xl p-4 z-40"
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
              className="absolute bottom-32 left-8 bg-white rounded-xl shadow-xl p-4 z-40"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">50K+</span>
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
              className="absolute top-40 right-4 bg-white rounded-xl shadow-xl p-3 z-40"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary border-2 border-white">S</div>
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-medium text-accent border-2 border-white">M</div>
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs font-medium text-green-600 border-2 border-white">J</div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">4.9/5 Rating</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
