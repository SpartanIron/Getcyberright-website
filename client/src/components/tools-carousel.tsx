import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Search,
  AlertTriangle,
  Lock,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

const tools = [
  {
    id: "scam-checker",
    icon: Search,
    title: "Scam Checker",
    subtitle: "Most Popular Tool",
    description:
      "Check URLs, emails, phone numbers, and text messages instantly. Find out if something is a scam before you click, call, or respond.",
    features: ["URL scanning", "Email verification", "Phone number lookup", "SMS analysis"],
    href: "/tools",
    badge: "Popular",
  },
  {
    id: "breach-checker",
    icon: AlertTriangle,
    title: "Breach Checker",
    subtitle: "Protect Your Identity",
    description:
      "Check if your email was exposed in a data breach. We never store your email - checked against the Have I Been Pwned database.",
    features: ["Email breach check", "Password exposure alerts", "Privacy first", "Instant results"],
    href: "/tools",
    badge: "Privacy First",
  },
  {
    id: "password-generator",
    icon: Lock,
    title: "Password Generator",
    subtitle: "Create Unbreakable Passwords",
    description:
      "Create strong, secure passwords instantly. Never use weak passwords again with our random password generator.",
    features: ["Customizable length", "Special characters", "Copy to clipboard", "No storage"],
    href: "/tools",
    badge: "Instant",
  },
  {
    id: "threat-trends",
    icon: TrendingUp,
    title: "Threat Trends",
    subtitle: "Stay Informed",
    description:
      "Stay informed with global scam statistics and trending cyber threats. Know what to watch out for in real-time.",
    features: ["Live statistics", "Trending scams", "Regional data", "Weekly updates"],
    href: "/tools",
    badge: "Real-time",
  },
];

export function ToolsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % tools.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + tools.length) % tools.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const currentTool = tools[currentIndex];

  return (
    <section className="py-16 sm:py-24 bg-muted/30" data-testid="section-tools-carousel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            Free Security Tools
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Protect Yourself With Our Free Tools
          </h2>
          <p className="text-lg text-muted-foreground">
            No signup required. Check if something is a scam, generate secure passwords, 
            and stay informed about the latest threats.
          </p>
        </motion.div>

        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="outline"
              onClick={prevSlide}
              className="hidden sm:flex shrink-0"
              data-testid="button-carousel-prev"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTool.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="bg-card rounded-2xl border shadow-lg overflow-hidden"
                >
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className="p-8 sm:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                          <currentTool.icon className="w-7 h-7 text-primary" />
                        </div>
                        <span className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full">
                          {currentTool.badge}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{currentTool.subtitle}</p>
                      <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4" data-testid={`text-carousel-title-${currentTool.id}`}>
                        {currentTool.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {currentTool.description}
                      </p>
                      <ul className="grid grid-cols-2 gap-2 mb-8">
                        {currentTool.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link href={currentTool.href}>
                        <Button size="lg" data-testid={`button-carousel-try-${currentTool.id}`}>
                          Try {currentTool.title}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                    <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-12">
                      <div className="relative">
                        <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center">
                          <currentTool.icon className="w-24 h-24 text-primary/40" />
                        </div>
                        <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                          <span className="text-2xl font-bold text-accent">{currentIndex + 1}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <Button
              size="icon"
              variant="outline"
              onClick={nextSlide}
              className="hidden sm:flex shrink-0"
              data-testid="button-carousel-next"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {tools.map((tool, index) => (
              <button
                key={tool.id}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex 
                    ? "bg-primary w-8" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                data-testid={`button-carousel-dot-${index}`}
              />
            ))}
          </div>

          <div className="flex sm:hidden justify-center gap-4 mt-4">
            <Button
              size="icon"
              variant="outline"
              onClick={prevSlide}
              data-testid="button-carousel-prev-mobile"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={nextSlide}
              data-testid="button-carousel-next-mobile"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-12"
        >
          <Link href="/tools">
            <Button variant="outline" size="lg" data-testid="button-view-all-tools">
              View All Tools
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
