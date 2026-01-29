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
    <section className="relative overflow-hidden min-h-[600px] lg:min-h-[700px]" data-testid="section-hero">
      {/* Full-width background image carousel */}
      <div className="absolute inset-0">
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
              className="w-full h-full object-cover brightness-110"
              data-testid={`img-hero-${index}`}
            />
          </div>
        ))}
        {/* Dark overlay for text readability - lighter for more visible images */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/75 via-slate-900/40 to-slate-900/20" />
      </div>

      {/* Decorative circles - pointer-events-none so they don't block clicks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute bottom-20 right-1/4 w-48 h-48 rounded-full bg-primary/5 blur-2xl" />
        <div className="absolute top-1/2 right-10 w-32 h-32 rounded-full border border-white/10" />
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 rounded-full border border-primary/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center min-h-[600px] lg:min-h-[700px] py-16 lg:py-0 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-white mb-6 leading-[1.1] transition-opacity duration-500" data-testid="text-hero-heading">
            {currentSlide.headline}
          </h1>

          <p className="text-xl text-white/80 mb-8 leading-relaxed transition-opacity duration-500" data-testid="text-hero-subtext">
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
              <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/30" data-testid="button-hero-primary-cta">
                Check If It's a Scam
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/resources">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full border-white/30 text-white backdrop-blur-sm" data-testid="button-hero-secondary-cta">
                Browse Resources
              </Button>
            </Link>
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
