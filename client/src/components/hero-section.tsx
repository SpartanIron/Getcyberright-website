import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import professionalImage from "@/assets/images/professional-laptop.jpg";
import seniorTabletImage from "@/assets/images/hero-senior-tablet.jpg";
import familyComputerImage from "@/assets/images/hero-family-computer.jpg";
import businessTeamImage from "@/assets/images/hero-business-team.jpg";
import smartphoneUserImage from "@/assets/images/hero-smartphone-user.jpg";

const heroSlides = [
  { 
    src: professionalImage, 
    alt: "Professional using laptop securely",
    headline: "Cybersecurity Education for Everyone",
    subtext: "Everything you need to protect yourself, your family, and your business from online threats.",
    bgColor: "rgb(15 23 42)", // Navy
    accentColor: "hsl(174 65% 42%)", // Teal
  },
  { 
    src: seniorTabletImage, 
    alt: "Senior person using tablet safely",
    headline: "Stay Safe Online at Any Age",
    subtext: "Simple, easy-to-follow guides designed specifically for seniors to navigate the digital world with confidence.",
    bgColor: "hsl(174 65% 25%)", // Dark Teal
    accentColor: "hsl(174 65% 50%)", // Lighter Teal
  },
  { 
    src: familyComputerImage, 
    alt: "Family learning online safety together",
    headline: "Protect Your Family Online",
    subtext: "Learn how to keep your children safe from online predators, cyberbullying, and inappropriate content.",
    bgColor: "hsl(200 60% 20%)", // Deep Blue
    accentColor: "hsl(174 65% 42%)", // Teal
  },
  { 
    src: businessTeamImage, 
    alt: "Business team discussing cybersecurity",
    headline: "Security Training for Your Business",
    subtext: "Equip your team with the knowledge to recognize threats and protect your organization from cyber attacks.",
    bgColor: "hsl(220 50% 18%)", // Slate Blue
    accentColor: "hsl(32 95% 52%)", // Orange
  },
  { 
    src: smartphoneUserImage, 
    alt: "Person using smartphone securely",
    headline: "Secure Your Digital Life",
    subtext: "From mobile banking to social media, learn how to protect your personal information on every device.",
    bgColor: "hsl(180 50% 20%)", // Teal-Cyan
    accentColor: "hsl(174 65% 50%)", // Bright Teal
  },
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
        setTimeout(() => setIsTransitioning(false), 100);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSlideChange = (index: number) => {
    if (index === currentIndex || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 100);
    }, 300);
  };

  const currentSlide = heroSlides[currentIndex];

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "500px" }} data-testid="section-hero">
      {/* Solid background that matches current slide - prevents any gaps */}
      <div 
        className="absolute inset-0 transition-colors duration-700 ease-in-out"
        style={{ backgroundColor: currentSlide.bgColor }}
      />

      {/* Image container - fixed dimensions, overflow hidden for consistency */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-2/3 overflow-hidden">
        {/* Single image display with crossfade */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0"
            style={{
              opacity: index === currentIndex ? 1 : 0,
              transform: index === currentIndex ? 'scale(1)' : 'scale(1.05)',
              transition: 'opacity 700ms ease-in-out, transform 700ms ease-in-out',
              zIndex: index === currentIndex ? 1 : 0,
            }}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'center center' }}
              data-testid={`img-hero-${index}`}
            />
          </div>
        ))}
      </div>

      {/* Curved background overlay - synced color transitions */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 500"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ transition: 'all 700ms ease-in-out' }}
      >
        <defs>
          <linearGradient id="curveEdgeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={currentSlide.accentColor} stopOpacity="0">
              <animate attributeName="stop-color" dur="700ms" fill="freeze" />
            </stop>
            <stop offset="70%" stopColor={currentSlide.accentColor} stopOpacity="0.4">
              <animate attributeName="stop-color" dur="700ms" fill="freeze" />
            </stop>
            <stop offset="100%" stopColor={currentSlide.accentColor} stopOpacity="0.7">
              <animate attributeName="stop-color" dur="700ms" fill="freeze" />
            </stop>
          </linearGradient>
        </defs>
        
        {/* Main curved shape */}
        <path
          d="M0,0 L680,0 Q880,250 680,500 L0,500 Z"
          style={{ 
            fill: currentSlide.bgColor,
            transition: 'fill 700ms ease-in-out'
          }}
        />
        
        {/* Accent glow along the curve edge */}
        <path
          d="M680,0 Q880,250 680,500"
          fill="none"
          stroke="url(#curveEdgeGlow)"
          strokeWidth="4"
        />
        
        {/* Secondary thinner accent line */}
        <path
          d="M690,10 Q890,250 690,490"
          fill="none"
          style={{
            stroke: currentSlide.accentColor,
            transition: 'stroke 700ms ease-in-out'
          }}
          strokeOpacity="0.3"
          strokeWidth="2"
        />
      </svg>

      {/* Decorative particle arc on left side */}
      <div className="absolute left-0 top-0 bottom-0 w-1/4 overflow-hidden pointer-events-none" aria-hidden="true">
        <svg 
          className="absolute -left-16 top-1/2 -translate-y-1/2 w-[350px] h-[350px]"
          viewBox="0 0 350 350"
          style={{ transition: 'all 700ms ease-in-out' }}
        >
          {Array.from({ length: 50 }).map((_, i) => {
            const angle = (i / 50) * Math.PI * 0.7 + Math.PI * 0.65;
            const radius = 120 + (i * 0.7);
            const x = 175 + Math.cos(angle) * radius;
            const y = 175 + Math.sin(angle) * radius;
            const size = 1 + (i % 3) * 0.5;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={size}
                style={{
                  fill: currentSlide.accentColor,
                  transition: 'fill 700ms ease-in-out'
                }}
                opacity={0.2 + (i % 5) * 0.1}
              />
            );
          })}
          <path
            d="M40,310 Q175,175 310,40"
            fill="none"
            style={{
              stroke: currentSlide.accentColor,
              transition: 'stroke 700ms ease-in-out'
            }}
            strokeOpacity="0.3"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Orange accent circles on right side */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 overflow-visible pointer-events-none hidden lg:block" aria-hidden="true">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-accent/80" />
        <div className="absolute top-24 right-4 w-20 h-20 rounded-full bg-accent/60" />
        <div className="absolute bottom-16 -right-6 w-24 h-24 rounded-full bg-accent/50" />
      </div>

      {/* Content with smooth text transitions */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-lg">
          <h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 leading-[1.1]" 
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
              transition: 'opacity 300ms ease-out, transform 300ms ease-out'
            }}
            data-testid="text-hero-heading"
          >
            {currentSlide.headline}
          </h1>

          <p 
            className="text-base lg:text-lg text-white/80 mb-6 leading-relaxed" 
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
              transition: 'opacity 300ms ease-out 50ms, transform 300ms ease-out 50ms'
            }}
            data-testid="text-hero-subtext"
          >
            {currentSlide.subtext}
          </p>

          <ul 
            className="space-y-2 mb-8 text-sm lg:text-base"
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
              transition: 'opacity 300ms ease-out 100ms, transform 300ms ease-out 100ms'
            }}
          >
            <li className="flex items-center gap-2 text-white/90">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span>Scam detection tools</span>
            </li>
            <li className="flex items-center gap-2 text-white/90">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span>Guides for families, seniors, and businesses</span>
            </li>
            <li className="flex items-center gap-2 text-white/90">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span>Plain language security education</span>
            </li>
          </ul>

          <div
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
              transition: 'opacity 300ms ease-out 150ms, transform 300ms ease-out 150ms'
            }}
          >
            <Link href="/tools">
              <Button 
                size="lg" 
                className="rounded-full px-6 py-5 bg-accent text-accent-foreground border-accent-border shadow-lg" 
                data-testid="button-hero-primary-cta"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Carousel indicators */}
      <div className="absolute bottom-4 left-6 lg:left-8 z-20 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 ${
              index === currentIndex 
                ? "bg-white w-6" 
                : "bg-white/40 w-2 hover-elevate"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            data-testid={`button-carousel-dot-${index}`}
          />
        ))}
      </div>
    </section>
  );
}
