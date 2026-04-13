"use client";

import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from "react";
import { useHydrated } from "@/hooks/use-hydrated";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  style?: CSSProperties;
  "data-testid"?: string;
}

export function FadeIn({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  direction = "up",
  style,
  ...rest
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
  const [isVisible, setIsVisible] = useState(false);
  const [animReady, setAnimReady] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setIsVisible(true);
      return;
    }

    setAnimReady(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const offsets: Record<string, string> = {
    up: "translateY(20px)",
    down: "translateY(-20px)",
    left: "translateX(-20px)",
    right: "translateX(20px)",
    none: "none",
  };

  const shouldAnimate = hydrated && animReady && !isVisible;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: shouldAnimate ? 0 : 1,
        transform: shouldAnimate ? offsets[direction] : "none",
        transition: isVisible ? `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s` : undefined,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
