import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, CheckCircle, Key, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

import originalFamilyPhoto from "@assets/Gemini_Generated_Image_ctwx3actwx3actwx_1768679610678.png";
import seniorsImage from "@assets/ChatGPT_Image_Jan_22,_2026,_10_52_57_PM_1769141391397.png";
import kidsTabletImage from "@assets/ChatGPT_Image_Jan_22,_2026,_11_13_49_PM_1769141821801.png";
import teenPhoneImage from "@assets/ChatGPT_Image_Jan_22,_2026,_10_56_48_PM_1769140919527.png";
import grandparentsImage from "@assets/ChatGPT_Image_Jan_22,_2026,_11_06_36_PM_1769141264903.png";
import familyTechImage from "@assets/ChatGPT_Image_Jan_22,_2026,_11_26_08_PM_1769142455588.png";

const slideImages = [
  originalFamilyPhoto,
  grandparentsImage,
  teenPhoneImage,
  seniorsImage,
  kidsTabletImage,
  familyTechImage
];

function usePreloadImages(images: string[], currentIndex: number) {
  const loaded = useRef(new Set<number>([0]));
  useEffect(() => {
    const next = (currentIndex + 1) % images.length;
    if (!loaded.current.has(next)) {
      const img = new Image();
      img.src = images[next];
      loaded.current.add(next);
    }
  }, [currentIndex, images]);
}

export function HeroCarousel() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slideCount = slideImages.length;
  usePreloadImages(slideImages, currentSlide);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section 
      className="relative text-white overflow-hidden h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence>
        <motion.div
          key={currentSlide}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <img 
            src={slideImages[currentSlide]} 
            alt={t(`carousel.slide${currentSlide + 1}.headline`)}
            className="w-full h-full object-cover"
            loading={currentSlide === 0 ? "eager" : "lazy"}
            fetchPriority={currentSlide === 0 ? "high" : "auto"}
            style={{ objectPosition: 'center 30%' }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />
      
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all opacity-70 hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all opacity-70 hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      <div className="relative container mx-auto px-4 pt-16 pb-12 sm:pt-16 sm:pb-16 md:pt-20 md:pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative h-[180px] sm:h-[200px] md:h-[220px] mb-8">
            <AnimatePresence>
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <h1 
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight bg-gradient-to-r from-white via-teal-200 to-white bg-clip-text text-transparent drop-shadow-lg"
                  >
                    {t(`carousel.slide${currentSlide + 1}.headline`)}
                  </h1>
                  
                  <p 
                    className="text-lg sm:text-xl md:text-2xl text-white max-w-2xl mx-auto font-medium drop-shadow-lg"
                  >
                    {t(`carousel.slide${currentSlide + 1}.subtext`)}
                  </p>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg font-bold shadow-xl"
            >
              <a href="/tools#scam-checker" className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t('scamChecker.checkButton')}
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-6 py-6 text-lg font-semibold backdrop-blur-sm"
            >
              <Link to="/tools?tab=safety-toolkit" className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                {t('scamChecker.passwordButton')}
              </Link>
            </Button>
          </motion.div>

          <motion.div 
            className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-slate-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-teal-400" />
              {t('scamChecker.alwaysFree')}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-teal-400" />
              {t('scamChecker.noSignup')}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-teal-400" />
              {t('scamChecker.expertSources')}
            </div>
          </motion.div>

          <div className="flex justify-center gap-2 mt-8">
            {slideImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-teal-400 w-8' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
