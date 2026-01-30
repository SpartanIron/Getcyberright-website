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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentSlide = heroSlides[currentIndex];

  return (
    <section className="relative w-full overflow-hidden min-h-[480px] lg:h-[600px]" data-testid="section-hero">
      {/* Mobile: Full background color overlay */}
      <div 
        className="absolute inset-0 lg:hidden transition-colors duration-1000"
        style={{ backgroundColor: currentSlide.bgColor }}
      />
      
      {/* Mobile: Background image with overlay */}
      <div className="absolute inset-0 lg:hidden">
        {heroSlides.map((slide, index) => (
          <img
            key={index}
            src={slide.src}
            alt={slide.alt}
            className={`absolute inset-0 w-full h-full object-cover object-[center_30%] transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-30" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Desktop: Image on right side */}
      <div className="absolute inset-0 overflow-hidden hidden lg:block">
        <div className="absolute right-0 top-0 w-2/3 h-full">
          {heroSlides.map((slide, index) => (
            <img
              key={index}
              src={slide.src}
              alt={slide.alt}
              className={`absolute inset-0 w-full h-full object-cover object-[center_30%] transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
              data-testid={`img-hero-${index}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop: Curved background overlay */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none transition-colors duration-1000 hidden lg:block"
        viewBox="0 0 1440 500"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="curveEdgeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={currentSlide.accentColor} stopOpacity="0" />
            <stop offset="70%" stopColor={currentSlide.accentColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={currentSlide.accentColor} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        
        <path
          d="M0,0 L680,0 Q880,250 680,500 L0,500 Z"
          fill={currentSlide.bgColor}
          className="transition-all duration-1000"
        />
        
        <path
          d="M680,0 Q880,250 680,500"
          fill="none"
          stroke="url(#curveEdgeGlow)"
          strokeWidth="4"
          className="transition-all duration-1000"
        />
        
        <path
          d="M690,10 Q890,250 690,490"
          fill="none"
          stroke={currentSlide.accentColor}
          strokeOpacity="0.3"
          strokeWidth="2"
          className="transition-all duration-1000"
        />
      </svg>

      {/* Desktop: Decorative particle arc - hidden on mobile */}
      <div className="absolute left-0 top-0 bottom-0 w-1/4 overflow-hidden pointer-events-none hidden lg:block" aria-hidden="true">
        <svg className="absolute -left-16 top-1/2 -translate-y-1/2 w-[350px] h-[350px]" viewBox="0 0 350 350">
          {Array.from({ length: 50 }).map((_, i) => {
            const angle = (i / 50) * Math.PI * 0.7 + Math.PI * 0.65;
            const radius = 120 + Math.random() * 35;
            const x = 175 + Math.cos(angle) * radius;
            const y = 175 + Math.sin(angle) * radius;
            const size = 1 + Math.random() * 2;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={size}
                fill={currentSlide.accentColor}
                opacity={0.2 + Math.random() * 0.4}
                className="transition-all duration-1000"
              />
            );
          })}
          <path
            d="M40,310 Q175,175 310,40"
            fill="none"
            stroke={currentSlide.accentColor}
            strokeOpacity="0.3"
            strokeWidth="1"
            className="transition-all duration-1000"
          />
        </svg>
      </div>

      {/* Desktop: Orange accent circles - hidden on mobile */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 overflow-visible pointer-events-none hidden lg:block" aria-hidden="true">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-accent/80" />
        <div className="absolute top-24 right-4 w-20 h-20 rounded-full bg-accent/60" />
        <div className="absolute bottom-16 -right-6 w-24 h-24 rounded-full bg-accent/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 lg:py-16 h-full flex items-center">
        <div className="max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
          {/* Headline */}
          <div className="mb-4 lg:min-h-[180px] lg:flex lg:items-start">
            <h1 
              className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] transition-opacity duration-500" 
              data-testid="text-hero-heading"
            >
              {currentSlide.headline}
            </h1>
          </div>

          {/* Subtext */}
          <div className="mb-5 lg:min-h-[60px]">
            <p 
              className="text-sm sm:text-base lg:text-lg text-white/80 font-medium leading-relaxed transition-opacity duration-500" 
              data-testid="text-hero-subtext"
            >
              {currentSlide.subtext}
            </p>
          </div>

          {/* Bullet points */}
          <ul className="space-y-2 mb-6 text-xs sm:text-sm font-medium">
            <li className="flex items-center justify-center lg:justify-start gap-2 text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span>Scam detection tools</span>
            </li>
            <li className="flex items-center justify-center lg:justify-start gap-2 text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span>Guides for families, seniors, and businesses</span>
            </li>
            <li className="flex items-center justify-center lg:justify-start gap-2 text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span>Plain language security education</span>
            </li>
          </ul>

          {/* CTA Button */}
          <div className="flex justify-center lg:justify-start">
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
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 lg:left-8 lg:translate-x-0 z-20 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 ${
              index === currentIndex 
                ? "bg-white w-5" 
                : "bg-white/40 hover-elevate"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            data-testid={`button-carousel-dot-${index}`}
          />
        ))}
      </div>
    </section>
  );
}
