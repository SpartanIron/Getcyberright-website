import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, Zap } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import professionalImage from "@/assets/images/professional-laptop.jpg";

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const fadeSide = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

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
        
        <div className="relative px-5 py-8 bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 hero-glow-bg opacity-40" />

          <motion.div
            className="max-w-md mx-auto text-center relative z-10"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-primary/20 px-3 py-1.5 rounded-full mb-4">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Free Tools. Real Protection.
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeUp}
              className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4 leading-[1.15]" 
              data-testid="text-hero-heading-mobile"
            >
              Don't Get Scammed.<br />
              <span className="hero-gradient-text">Get CyberRight.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-sm sm:text-base text-white/80 font-medium mb-4 leading-relaxed">
              Free tools and plain-language guides that help your whole family stay safe online, from your kids' first device to your parents' inbox.
            </motion.p>

            <motion.ul variants={stagger} className="space-y-2 mb-6 text-xs sm:text-sm font-medium text-left max-w-xs mx-auto">
              <motion.li variants={fadeSide} className="flex items-start gap-3 text-white/80">
                <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Check a suspicious message in 60 seconds.</span>
              </motion.li>
              <motion.li variants={fadeSide} className="flex items-start gap-3 text-white/80">
                <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Real protection, explained in real words.</span>
              </motion.li>
              <motion.li variants={fadeSide} className="flex items-start gap-3 text-white/80">
                <Users className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Trusted by thousands of families.</span>
              </motion.li>
            </motion.ul>

            <motion.div variants={fadeUp}>
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
            </motion.div>
          </motion.div>
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

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-0 w-[680px] h-full hero-glow-bg opacity-30" />
        </div>

        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 h-full flex items-center"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-xl">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full mb-6">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Free Tools. Real Protection.
              </span>
            </motion.div>

            <motion.h1 
              variants={fadeUp}
              className="text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6" 
              data-testid="text-hero-heading"
            >
              Don't Get Scammed.<br />
              <span className="hero-gradient-text">Get CyberRight.</span>
            </motion.h1>

            <motion.p 
              variants={fadeUp}
              className="text-xl text-white/90 font-medium leading-relaxed mb-4" 
              data-testid="text-hero-subtext"
            >
              Free tools and plain-language guides that help your whole family stay safe online.
            </motion.p>

            <motion.ul variants={stagger} className="space-y-3 mb-10 text-sm font-medium">
              <motion.li variants={fadeSide} className="flex items-center gap-3 text-white/85">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary flex-shrink-0" />
                </div>
                <span>Check a suspicious message in 60 seconds.</span>
              </motion.li>
              <motion.li variants={fadeSide} className="flex items-center gap-3 text-white/85">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                </div>
                <span>Real protection, explained in real words.</span>
              </motion.li>
              <motion.li variants={fadeSide} className="flex items-center gap-3 text-white/85">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary flex-shrink-0" />
                </div>
                <span>Trusted by thousands of families.</span>
              </motion.li>
            </motion.ul>

            <motion.div variants={fadeUp}>
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
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
