"use client";

import { useState, useEffect, useRef } from "react";

interface UseAnimatedCounterOptions {
  duration?: number;
  startOnView?: boolean;
}

export function useAnimatedCounter(
  targetValue: number,
  options: UseAnimatedCounterOptions = {}
) {
  const { duration = 2000, startOnView = true } = options;
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasAnimated || targetValue === 0) return;

    const startAnimation = () => {
      if (hasAnimated) return;
      setHasAnimated(true);

      const startTime = performance.now();
      const startValue = 0;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
        
        setCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(targetValue);
        }
      };

      requestAnimationFrame(animate);
    };

    if (startOnView && elementRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startAnimation();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(elementRef.current);
      return () => observer.disconnect();
    } else if (!startOnView) {
      startAnimation();
    }
  }, [targetValue, duration, hasAnimated, startOnView]);

  return { count, ref: elementRef };
}
