import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
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
    subtext: "Everything you need to protect yourself, your family, and your business from online threats."
  },
  { 
    src: seniorTabletImage, 
    alt: "Senior person using tablet safely",
    headline: "Stay Safe Online at Any Age",
    subtext: "Simple, easy-to-follow guides designed specifically for seniors to navigate the digital world with confidence."
  },
  { 
    src: familyComputerImage, 
    alt: "Family learning online safety together",
    headline: "Protect Your Family Online",
    subtext: "Learn how to keep your children safe from online predators, cyberbullying, and inappropriate content."
  },
  { 
    src: businessTeamImage, 
    alt: "Business team discussing cybersecurity",
    headline: "Security Training for Your Business",
    subtext: "Equip your team with the knowledge to recognize threats and protect your organization from cyber attacks."
  },
  { 
    src: smartphoneUserImage, 
    alt: "Person using smartphone securely",
    headline: "Secure Your Digital Life",
    subtext: "From mobile banking to social media, learn how to protect your personal information on every device."
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

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const currentSlide = heroSlides[currentIndex];

  return (
    <section className="relative overflow-hidden min-h-[85vh]" data-testid="section-hero">
      {/* Deep Navy Background - Full Section */}
      <div className="absolute inset-0 bg-slate-900" />
      
      {/* SVG Curved Background Overlay
          This creates the signature curved arc that wraps around the image.
          The path uses Bézier curves (Q command) to create a smooth organic arc
          that starts from top-right and sweeps down to bottom-right.
          The curve "hugs" the image container creating a layered visual effect.
      */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          {/* Gradient for subtle depth on the curved edge */}
          <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
          </linearGradient>
          
          {/* Dotted arc pattern for decorative overlay */}
          <pattern id="dottedArc" patternUnits="userSpaceOnUse" width="20" height="20">
            <circle cx="2" cy="2" r="1" fill="hsl(var(--primary))" opacity="0.3" />
          </pattern>
        </defs>
        
        {/* Main curved shape - dark navy that wraps around the image area
            Path breakdown:
            M0,0 - Start at top-left
            L850,0 - Draw line to x=850 at top
            Q920,450 850,900 - Quadratic curve: control point at (920,450), end at (850,900)
            L0,900 - Line to bottom-left
            Z - Close path
        */}
        <path
          d="M0,0 L850,0 Q920,450 850,900 L0,900 Z"
          fill="rgb(15 23 42)"
          className="drop-shadow-2xl"
        />
        
        {/* Decorative teal curved accent line following the main curve */}
        <path
          d="M850,0 Q920,450 850,900"
          fill="none"
          stroke="url(#curveGradient)"
          strokeWidth="3"
        />
        
        {/* Outer dotted decorative arc */}
        <path
          d="M880,-50 Q980,450 880,950"
          fill="none"
          stroke="url(#dottedArc)"
          strokeWidth="80"
          strokeDasharray="4 12"
          opacity="0.4"
        />
      </svg>

      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Teal glow accents */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-10 w-48 h-48 rounded-full bg-primary/5 blur-2xl" />
        
        {/* Orange accent shapes on the right side */}
        <div className="absolute top-20 right-20 w-24 h-24 rounded-full bg-accent/30 blur-sm hidden lg:block" />
        <div className="absolute top-40 right-8 w-16 h-16 rounded-full bg-accent/40 hidden lg:block" />
        <div className="absolute bottom-32 right-32 w-20 h-20 rounded-full bg-accent/25 blur-sm hidden lg:block" />
      </div>

      {/* Content Grid - Left text, Right image */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[85vh] py-16">
          
          {/* Left Content */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <h1 
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold tracking-tight text-white mb-6 leading-[1.15] transition-opacity duration-500" 
              data-testid="text-hero-heading"
            >
              {currentSlide.headline}
            </h1>

            <p 
              className="text-lg lg:text-xl text-white/80 mb-8 leading-relaxed transition-opacity duration-500 max-w-lg" 
              data-testid="text-hero-subtext"
            >
              {currentSlide.subtext}
            </p>

            <ul className="space-y-3 mb-10 text-left max-w-md">
              <li className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>Scam detection tools</span>
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

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link href="/tools">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 rounded-full shadow-lg shadow-accent/30 bg-accent text-accent-foreground border-accent-border" 
                  data-testid="button-hero-primary-cta"
                >
                  Check If It's a Scam
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/resources">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 rounded-full border-white/30 text-white backdrop-blur-sm" 
                  data-testid="button-hero-secondary-cta"
                >
                  Browse Resources
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Image Container - Positioned within the curve */}
          <div className="relative order-1 lg:order-2 flex items-center justify-center lg:justify-end">
            {/* Image wrapper with curved frame effect */}
            <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
              {/* Teal circular frame around image */}
              <div className="absolute -inset-4 lg:-inset-6 rounded-full border-2 border-primary/30 opacity-60" />
              <div className="absolute -inset-8 lg:-inset-12 rounded-full border border-primary/20 opacity-40" />
              
              {/* Image carousel container - sharp rectangular, unmasked */}
              <div className="relative aspect-[4/3] lg:aspect-square shadow-2xl">
                {heroSlides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      className="w-full h-full object-cover"
                      data-testid={`img-hero-${index}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevious}
          className="text-white backdrop-blur-sm"
          aria-label="Previous image"
          data-testid="button-carousel-prev"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 ${
                index === currentIndex 
                  ? "bg-white w-6" 
                  : "bg-white/50 hover-elevate"
              }`}
              aria-label={`Go to image ${index + 1}`}
              data-testid={`button-carousel-dot-${index}`}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToNext}
          className="text-white backdrop-blur-sm"
          aria-label="Next image"
          data-testid="button-carousel-next"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </section>
  );
}
