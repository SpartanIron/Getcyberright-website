"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const recaptchaSiteKey = typeof window !== "undefined"
  ? (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "")
  : "";

export default function Providers({ children }: { children: React.ReactNode }) {
  const inner = (
    <ThemeProvider>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );

  if (typeof window === "undefined" || !recaptchaSiteKey) {
    return (
      <QueryClientProvider client={queryClient}>
        {inner}
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
        {inner}
      </GoogleReCaptchaProvider>
    </QueryClientProvider>
  );
}
