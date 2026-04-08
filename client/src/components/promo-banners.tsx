import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/lib/navigation";
import {
  Shield,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Lock,
  GraduationCap,
  AlertTriangle,
  Gift,
  Pause,
  Play,
} from "lucide-react";
import { isFreeAccessPeriod } from "@shared/models/auth";

import promoShieldImg from "@/assets/images/promo-shield-protection.webp";
import promoPrivacyImg from "@/assets/images/promo-data-privacy.webp";
import promoFamilyImg from "@/assets/images/promo-family-learning.webp";
import promoAlertImg from "@/assets/images/promo-scam-alert.webp";

interface PromoBanner {
  id: string;
  badge: string;
  badgeIcon: typeof Shield;
  badgeColor: string;
  headline: string;
  subheadline: string;
  cta: string;
  ctaHref: string;
  secondaryCta?: string;
  secondaryHref?: string;
  image: string;
  overlayGradient: string;
  accentColor: string;
}

const freeAccess = isFreeAccessPeriod();

const promos: PromoBanner[] = [
  {
    id: "pro-trial",
    badge: freeAccess ? "All Features Free" : "Limited Time Offer",
    badgeIcon: Gift,
    badgeColor: "bg-orange-500/90 text-white",
    headline: freeAccess ? "Every Tool Is Free Right Now" : "Try Pro Free for 30 Days",
    subheadline: freeAccess
      ? "All GCR Scam Guard and Data Shield tools are completely free. No credit card, no catches. Use everything."
      : "Get auto-scanning, email protection, and real-time alerts with no charge for a full month. See what full protection feels like.",
    cta: freeAccess ? "Start Using Tools" : "Start Free Trial",
    ctaHref: freeAccess ? "/tools" : "/gcr-guard-pricing",
    secondaryCta: freeAccess ? undefined : "See All Plans",
    secondaryHref: freeAccess ? undefined : "/pricing",
    image: promoShieldImg,
    overlayGradient: "from-[#0A2A3C]/95 via-[#0A2A3C]/75 to-transparent",
    accentColor: "bg-teal-500 hover:bg-teal-600",
  },
  {
    id: "data-shield",
    badge: "Privacy Protection",
    badgeIcon: Lock,
    badgeColor: "bg-blue-500/90 text-white",
    headline: "Your Data Is Already Out There",
    subheadline: "Your name, email, and phone number are listed on hundreds of data broker websites. GCR Data Shield finds and removes them automatically.",
    cta: "Scan Your Exposure",
    ctaHref: "/shield",
    secondaryCta: freeAccess ? "Learn More" : "How It Works",
    secondaryHref: freeAccess ? "/data-removal" : "/data-shield-pricing",
    image: promoPrivacyImg,
    overlayGradient: "from-[#0A2A3C]/95 via-[#0A2A3C]/80 to-transparent",
    accentColor: "bg-blue-500 hover:bg-blue-600",
  },
  {
    id: "family-training",
    badge: "Family Education",
    badgeIcon: GraduationCap,
    badgeColor: "bg-emerald-500/90 text-white",
    headline: "Safety Skills for Every Generation",
    subheadline: "Short, practical courses for parents, seniors, kids, and small businesses. Earn badges and build real safety habits the whole family can use.",
    cta: "Start Learning Free",
    ctaHref: "/training",
    secondaryCta: "Browse Courses",
    secondaryHref: "/training",
    image: promoFamilyImg,
    overlayGradient: "from-[#0A2A3C]/95 via-[#0A2A3C]/70 to-transparent",
    accentColor: "bg-emerald-500 hover:bg-emerald-600",
  },
  {
    id: "scam-guard",
    badge: "Scam Protection",
    badgeIcon: AlertTriangle,
    badgeColor: "bg-red-500/90 text-white",
    headline: "Is That Message Really From Your Bank?",
    subheadline: "Paste any suspicious text, link, or email and get an instant safety verdict. Checked against 8 trusted databases in seconds.",
    cta: "Check a Scam Now",
    ctaHref: "/scam-checker",
    secondaryCta: "Get the Extension",
    secondaryHref: "/browser-extension",
    image: promoAlertImg,
    overlayGradient: "from-[#0A2A3C]/95 via-[#0A2A3C]/75 to-transparent",
    accentColor: "bg-orange-500 hover:bg-orange-600",
  },
];

export function PromoBanners() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const goTo = useCallback((index: number) => {
    if (index === current) return;
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % promos.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + promos.length) % promos.length);
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isPaused, prefersReducedMotion, next]);

  const promo = promos[current];
  const BadgeIcon = promo.badgeIcon;

  const animationDuration = prefersReducedMotion ? 0 : 0.5;

  const variants = {
    enter: (d: number) => ({
      x: prefersReducedMotion ? 0 : (d > 0 ? 300 : -300),
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (d: number) => ({
      x: prefersReducedMotion ? 0 : (d > 0 ? -300 : 300),
      opacity: 0,
    }),
  };

  const handleFocus = () => setIsPaused(true);
  const handleBlur = (e: React.FocusEvent) => {
    if (sectionRef.current && !sectionRef.current.contains(e.relatedTarget as Node)) {
      setIsPaused(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 lg:py-20 bg-background"
      data-testid="section-promo-banners"
      aria-label="Promotional offers"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl min-h-[340px] sm:min-h-[380px] lg:min-h-[420px]">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={promo.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: animationDuration, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0">
                <img
                  src={promo.image}
                  alt=""
                  className="w-full h-full object-cover"
                  loading={current === 0 ? "eager" : "lazy"}
                  fetchPriority={current === 0 ? "high" : "auto"}
                />
              </div>

              <div className={`absolute inset-0 bg-gradient-to-r ${promo.overlayGradient}`} />

              <div className="relative h-full flex items-center p-8 sm:p-12 lg:p-16">
                <div className="max-w-xl">
                  <Badge className={`${promo.badgeColor} border-0 mb-4 text-xs font-semibold px-3 py-1`} data-testid={`badge-promo-${promo.id}`}>
                    <BadgeIcon className="w-3.5 h-3.5 mr-1.5" />
                    {promo.badge}
                  </Badge>

                  <h3
                    className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3 leading-tight"
                    data-testid={`text-promo-headline-${promo.id}`}
                  >
                    {promo.headline}
                  </h3>

                  <p className="text-base sm:text-lg text-white/80 mb-6 leading-relaxed max-w-md">
                    {promo.subheadline}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      asChild
                      size="lg"
                      className={`${promo.accentColor} text-white rounded-full px-6 sm:px-8 font-semibold text-sm sm:text-base shadow-lg`}
                      data-testid={`button-promo-cta-${promo.id}`}
                    >
                      <Link href={promo.ctaHref}>
                        {promo.cta}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>

                    {promo.secondaryCta && (
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10 rounded-full px-6 sm:px-8 font-semibold text-sm sm:text-base backdrop-blur-sm"
                        data-testid={`button-promo-secondary-${promo.id}`}
                      >
                        <Link href={promo.secondaryHref!}>
                          {promo.secondaryCta}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={prev}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/80 hover:bg-black/50 hover:text-white transition-all"
            aria-label="Previous promotion"
            data-testid="button-promo-prev"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/80 hover:bg-black/50 hover:text-white transition-all"
            aria-label="Next promotion"
            data-testid="button-promo-next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:bg-black/50 hover:text-white transition-all"
            aria-label={isPaused ? "Resume auto-play" : "Pause auto-play"}
            data-testid="button-promo-pause"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {promos.map((p, i) => (
              <button
                key={p.id}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-8 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to promotion ${i + 1}: ${p.badge}`}
                aria-current={i === current ? "true" : undefined}
                data-testid={`button-promo-dot-${i}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          {promos.map((p, i) => {
            const Icon = p.badgeIcon;
            return (
              <button
                key={p.id}
                onClick={() => goTo(i)}
                className={`flex items-center gap-2.5 p-3 sm:p-4 rounded-xl border transition-all text-left ${
                  i === current
                    ? "bg-primary/10 border-primary/30 shadow-sm"
                    : "bg-card border-border hover:border-primary/20 hover:bg-muted/50"
                }`}
                aria-current={i === current ? "true" : undefined}
                data-testid={`button-promo-thumb-${p.id}`}
              >
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  i === current ? "bg-primary/20" : "bg-muted"
                }`}>
                  <Icon className={`w-4 h-4 ${i === current ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="min-w-0">
                  <p className={`text-xs sm:text-sm font-semibold truncate ${
                    i === current ? "text-primary" : "text-foreground"
                  }`}>
                    {p.badge}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    {p.headline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
