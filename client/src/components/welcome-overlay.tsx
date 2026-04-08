"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Users, Compass, ArrowRight, X } from "lucide-react";
import { useLocation } from "@/lib/navigation";
import logo from "@/assets/logo.webp";
import { imgSrc } from "@/lib/img-src";

const WELCOME_SEEN_KEY = "getcyberright_welcomed";

interface PathwayOption {
  icon: typeof Shield;
  title: string;
  description: string;
  path: string;
  isPrimary: boolean;
}

const pathways: PathwayOption[] = [
  {
    icon: Shield,
    title: "I think I received a scam",
    description: "Check if something is suspicious",
    path: "/tools",
    isPrimary: true,
  },
  {
    icon: Users,
    title: "I want to protect my family",
    description: "Find resources for your situation",
    path: "/resources",
    isPrimary: false,
  },
  {
    icon: Compass,
    title: "Just exploring",
    description: "Browse all our free tools and guides",
    path: "/",
    isPrimary: false,
  },
];

export function WelcomeOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [, setLocation] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem(WELCOME_SEEN_KEY);
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (isVisible && firstButtonRef.current) {
      firstButtonRef.current.focus();
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handlePathwayClick("/");
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isVisible]);

  const handlePathwayClick = (path: string) => {
    localStorage.setItem(WELCOME_SEEN_KEY, "true");
    setIsVisible(false);
    if (path !== "/") {
      setLocation(path);
    }
  };

  const handleDismiss = () => {
    handlePathwayClick("/");
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-title"
          data-testid="welcome-overlay"
        >
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDismiss}
            className="fixed top-3 right-3 z-[110] text-white/80"
            aria-label="Skip welcome screen"
            data-testid="button-dismiss-welcome"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-10 max-w-lg w-full mx-4 my-6 sm:my-0 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-6 sm:mb-8"
            >
              <img
                src={imgSrc(logo)}
                alt="GetCyberRight"
                className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6"
                loading="lazy"
                data-testid="img-welcome-logo"
              />
              <h2
                id="welcome-title"
                className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4"
                data-testid="text-welcome-title"
              >
                Welcome to GetCyberRight
              </h2>
              <p className="text-base sm:text-lg text-white/80 max-w-md mx-auto leading-relaxed">
                You're safe here. We help everyday people protect themselves online, 
                no technical knowledge required.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="mb-6 sm:mb-8"
            >
              <p className="text-white/80 text-sm mb-3 sm:mb-4 uppercase tracking-wide font-medium">
                What brought you here today?
              </p>
              <div className="space-y-2 sm:space-y-3">
                {pathways.map((pathway, index) => (
                  <motion.div
                    key={pathway.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  >
                    <Button
                      ref={index === 0 ? firstButtonRef : undefined}
                      onClick={() => handlePathwayClick(pathway.path)}
                      variant={pathway.isPrimary ? "default" : "outline"}
                      className={`w-full h-auto p-3 sm:p-4 justify-start gap-3 sm:gap-4 ${
                        !pathway.isPrimary ? "border-white/20 text-white bg-white/5" : ""
                      }`}
                      data-testid={`button-pathway-${index}`}
                    >
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          pathway.isPrimary ? "bg-white/20" : "bg-white/10"
                        }`}
                      >
                        <pathway.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-medium text-sm sm:text-base">{pathway.title}</p>
                        <p
                          className={`text-xs sm:text-sm font-normal ${
                            pathway.isPrimary ? "text-primary-foreground/90" : "text-white/80"
                          }`}
                        >
                          {pathway.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-50 flex-shrink-0" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1 }}
              className="text-white/70 text-sm pb-4"
            >
              <p>Trusted by families in 50+ countries</p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
