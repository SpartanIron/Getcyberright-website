"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Shield, AlertTriangle, ShieldCheck, Eye } from "lucide-react";
import { Link, useLocation } from "@/lib/navigation";
import { useQuery } from "@tanstack/react-query";
import type { TrendingThreat } from "@shared/schema";
import heroFamilyImg from "@/assets/images/hero-family-diverse.webp";

const TIMEZONE_REGION_MAP: Record<string, string> = {
  "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US",
  "America/Los_Angeles": "US", "America/Phoenix": "US",
  "America/Toronto": "CA", "America/Vancouver": "CA",
  "Europe/London": "GB", "Europe/Paris": "EU", "Europe/Berlin": "EU",
  "Europe/Madrid": "EU", "Europe/Rome": "EU", "Europe/Amsterdam": "EU",
  "Australia/Sydney": "AU", "Australia/Melbourne": "AU",
  "Pacific/Auckland": "NZ",
  "Africa/Lagos": "AF_WEST", "Africa/Nairobi": "AF_EAST",
  "Africa/Johannesburg": "AF_SOUTH",
  "America/Sao_Paulo": "SA", "America/Mexico_City": "SA",
  "Asia/Kolkata": "AS_SOUTH", "Asia/Manila": "AS_SOUTHEAST",
  "Asia/Singapore": "AS_SOUTHEAST",
};

const REGION_LABELS: Record<string, string> = {
  "US": "United States", "CA": "Canada", "GB": "United Kingdom",
  "EU": "Europe", "AU": "Australia", "NZ": "New Zealand",
  "AF_WEST": "West Africa", "AF_EAST": "East Africa", "AF_SOUTH": "Southern Africa",
  "SA": "Americas", "AS_SOUTH": "South Asia", "AS_SOUTHEAST": "Southeast Asia",
  "GLOBAL": "Worldwide",
};

function detectRegion(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TIMEZONE_REGION_MAP[tz] || "GLOBAL";
  } catch {
    return "GLOBAL";
  }
}

const severityColors: Record<string, string> = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

function ThreatAlertBar() {
  const region = useMemo(() => detectRegion(), []);
  const regionLabel = REGION_LABELS[region] || "your region";
  const { data } = useQuery<{ threats: TrendingThreat[] }>({
    queryKey: [`/api/trending-threats?region=${region}`],
    staleTime: 5 * 60 * 1000,
  });

  const threat = data?.threats?.[0];
  if (!threat) return null;
  const sevClass = severityColors[threat.severity] || severityColors.medium;

  return (
    <Link href="/alerts">
      <div
        className="inline-flex items-center gap-2 sm:gap-2.5 bg-red-500/[0.08] border border-red-500/20 rounded-full px-3 sm:px-4 py-2 cursor-pointer hover:bg-red-500/[0.12] transition-colors group max-w-full"
        data-testid="badge-live-threat"
      >
        <div className="relative flex-shrink-0">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
        </div>
        <span className="flex items-center gap-1.5 flex-shrink-0">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Active</span>
        </span>
        <span className="text-sm text-white/70 font-medium truncate min-w-0 group-hover:text-white transition-colors">
          {threat.title}
        </span>
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border flex-shrink-0 ${sevClass}`}>
          {threat.severity}
        </span>
      </div>
    </Link>
  );
}

export function HeroSection() {
  return (
    <section className="relative w-full" data-testid="section-hero">
      <div className="bg-[#0A2A3C] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A2A3C] via-[#0A2A3C] to-[#00293C]" />

        <div
          className="absolute pointer-events-none hidden lg:block"
          aria-hidden="true"
          style={{
            top: 0,
            right: 0,
            width: "58%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-40%",
              right: "1%",
              width: "75px",
              height: "220%",
              background: "linear-gradient(180deg, #003A52 0%, #0D4D66 50%, #003A52 100%)",
              transform: "rotate(20deg)",
              transformOrigin: "top center",
              filter: "drop-shadow(0 0 24px rgba(13, 148, 136, 0.2))",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "-40%",
              right: "8%",
              width: "3px",
              height: "220%",
              background: "linear-gradient(180deg, transparent 10%, rgba(45, 212, 191, 0.5) 50%, transparent 90%)",
              transform: "rotate(20deg)",
              transformOrigin: "top center",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "-35%",
              right: "16%",
              width: "55px",
              height: "220%",
              background: "linear-gradient(180deg, #5eead4 0%, #2dd4bf 35%, #14b8a6 100%)",
              transform: "rotate(20deg)",
              transformOrigin: "top center",
              opacity: 0.75,
              filter: "drop-shadow(0 0 32px rgba(45, 212, 191, 0.4))",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "-35%",
              right: "24%",
              width: "3px",
              height: "220%",
              background: "linear-gradient(180deg, transparent 10%, hsla(16, 95%, 58%, 0.45) 50%, transparent 90%)",
              transform: "rotate(20deg)",
              transformOrigin: "top center",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "-30%",
              right: "30%",
              width: "80px",
              height: "220%",
              background: "linear-gradient(180deg, hsl(16, 100%, 62%) 0%, hsl(16, 95%, 52%) 40%, hsl(16, 90%, 42%) 100%)",
              transform: "rotate(20deg)",
              transformOrigin: "top center",
              opacity: 0.7,
              filter: "drop-shadow(0 0 30px hsla(16, 95%, 55%, 0.35))",
            }}
          />
        </div>

        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-primary/[0.05] rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[42%_58%] gap-8 lg:gap-10 items-center py-12 sm:py-16 lg:py-20">
            <div className="max-w-xl min-w-0">
              <div className="mb-6 overflow-hidden">
                <ThreatAlertBar />
              </div>
              <h1
                className="text-[2rem] sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight text-white leading-[1.05] mb-6 sm:mb-8"
                data-testid="text-hero-heading"
              >
                Online Safety
                <br />
                Should Not Require
                <br />
                <span className="hero-gradient-text">a Tech Degree.</span>
              </h1>

              <p
                className="text-base sm:text-xl text-white/80 leading-relaxed mb-8 sm:mb-10"
                data-testid="text-hero-subtext"
              >
                GetCyberRight makes digital protection simple for everyone. Check if that text or email is a scam, discover who has your personal data and remove it, and learn practical safety habits with guides written in plain language. Protection for the whole family, no expertise needed.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 mb-8 sm:mb-10">
                <Button
                  asChild
                  size="lg"
                  className="bg-accent text-accent-foreground border-accent-border font-semibold px-8 text-base shadow-[0_4px_24px_-4px] shadow-accent/40 hover:shadow-[0_6px_32px_-4px] hover:shadow-accent/50 hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto"
                  data-testid="button-hero-primary-cta"
                >
                  <Link href="/scam-checker">
                    Check a Scam Now
                    <ArrowRight className="ml-2 w-5 h-5 cta-arrow-right" />
                  </Link>
                </Button>
                <Link href="/tools" className="inline-flex items-center gap-2 text-base text-white/70 hover:text-white/90 transition-colors group font-medium">
                  See all protection tools
                  <ArrowRight className="w-4 h-4 cta-arrow-right" />
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-white/60">
                <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> No account needed</span>
                <span className="flex items-center gap-2"><Eye className="w-4 h-4 text-primary" /> Nothing stored</span>
                <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Free to get started</span>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative -mr-8 xl:-mr-16">
                <div className="relative overflow-hidden rounded-l-3xl">
                  <img
                    src={heroFamilyImg}
                    alt="GetCyberRight — family digital protection made simple"
                    className="w-full h-[580px] object-cover"
                    data-testid="img-hero-overview"
                  />
                </div>
              </div>
            </div>

            <div className="lg:hidden">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={heroFamilyImg}
                  alt="GetCyberRight — family digital protection made simple"
                  className="w-full h-64 sm:h-80 object-cover"
                  data-testid="img-hero-overview-mobile"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2A3C]/60 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
