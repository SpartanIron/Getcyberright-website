import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import heroImage from "@/assets/images/hero-family-diverse.png";

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

const rotatingMessages = [
  "Protect your kids' first phone.",
  "Keep your parents safe from scams.",
  "Secure your small business.",
  "Help seniors spot fraud instantly.",
  "Guard your family's privacy online.",
];

export function HeroSection() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || isPaused) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % rotatingMessages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="relative w-full overflow-hidden" data-testid="section-hero">
      {/* ===== MOBILE LAYOUT ===== */}
      <div className="lg:hidden">
        <div className="relative w-full h-[240px] sm:h-[280px] overflow-hidden">
          <img
            src={heroImage}
            alt="Diverse multiracial family using technology safely together"
            className="absolute inset-0 w-full h-full object-cover object-[center_25%] hero-ken-burns"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-transparent to-slate-900/70" />
        </div>

        <div className="relative px-5 py-8 bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden">
          <div className="absolute inset-0 hero-glow-bg opacity-40" />

          <motion.div
            className="max-w-md mx-auto text-center relative z-10"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 px-3 py-1.5 rounded-full mb-4">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Free Cybersecurity Tools
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3 leading-[1.15]"
              data-testid="text-hero-heading-mobile"
            >
              Don't Get Scammed.<br />
              <span className="hero-gradient-text">Get CyberRight.</span>
            </motion.h1>

            <motion.div
              variants={fadeUp}
              className="h-8 mb-4 flex items-center justify-center"
              aria-live="polite"
              aria-atomic="true"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={messageIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm sm:text-base text-accent font-medium"
                  data-testid="text-hero-rotating-mobile"
                >
                  {rotatingMessages[messageIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            <motion.p variants={fadeUp} className="text-sm text-white/70 mb-6 leading-relaxed">
              Plain-language guides and powerful tools that help your whole family stay safe online.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col gap-3 max-w-xs mx-auto w-full">
              <Link href="/tools#scam-checker" className="block w-full">
                <Button
                  size="default"
                  className="rounded-full bg-accent text-accent-foreground border-accent-border shadow-lg w-full"
                  data-testid="button-hero-primary-cta-mobile"
                >
                  Check If It's a Scam
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/tools" className="block w-full">
                <Button
                  size="default"
                  variant="outline"
                  className="rounded-full border-white/30 text-white bg-white/5 w-full"
                  data-testid="button-hero-secondary-cta-mobile"
                >
                  Explore Free Tools
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6 flex items-center justify-center gap-2 text-white/50 text-xs">
              <Shield className="w-3.5 h-3.5 text-primary/60" />
              <span>Protecting families across 13 regions worldwide</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="hidden lg:block min-h-[650px]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute right-0 top-0 w-2/3 h-full">
            <img
              src={heroImage}
              alt="Diverse multiracial family using technology safely together"
              className="absolute inset-0 w-full h-full object-cover object-[center_30%] hero-ken-burns"
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
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 px-4 py-2 rounded-full mb-6">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Free Cybersecurity Tools
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-5"
              data-testid="text-hero-heading"
            >
              Don't Get Scammed.<br />
              <span className="hero-gradient-text">Get CyberRight.</span>
            </motion.h1>

            <motion.div
              variants={fadeUp}
              className="h-10 mb-4 flex items-center"
              aria-live="polite"
              aria-atomic="true"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={messageIndex}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.35 }}
                  className="text-xl text-accent font-semibold"
                  data-testid="text-hero-rotating"
                >
                  {rotatingMessages[messageIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="text-lg text-white/75 leading-relaxed mb-8"
              data-testid="text-hero-subtext"
            >
              Plain-language guides and powerful tools that help your whole family stay safe online.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-8">
              <Link href="/tools#scam-checker">
                <Button
                  size="lg"
                  className="rounded-full px-8 bg-accent text-accent-foreground border-accent-border shadow-lg"
                  data-testid="button-hero-primary-cta"
                >
                  Check If It's a Scam
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/tools">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 border-white/30 text-white bg-white/5"
                  data-testid="button-hero-secondary-cta"
                >
                  Explore Free Tools
                  <ChevronRight className="ml-1 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-3 text-white/50 text-sm">
              <div className="flex -space-x-1">
                <Shield className="w-4 h-4 text-primary/60" />
                <Shield className="w-4 h-4 text-primary/50" />
                <Shield className="w-4 h-4 text-primary/40" />
              </div>
              <span>Protecting families across 13 regions worldwide</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
