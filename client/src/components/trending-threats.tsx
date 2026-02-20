import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ShieldAlert, Bug, AlertOctagon, Lock, UserX, Users, MapPin, ChevronLeft, ChevronRight, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TrendingThreat } from "@shared/schema";

const categoryIcons: Record<string, typeof AlertTriangle> = {
  scam: AlertTriangle,
  phishing: ShieldAlert,
  malware: Bug,
  fraud: AlertOctagon,
  data_breach: Lock,
  vulnerability: ShieldAlert,
  identity_theft: UserX,
};

const severityColors: Record<string, string> = {
  critical: "bg-red-600 dark:bg-red-700 text-white",
  high: "bg-orange-500 dark:bg-orange-600 text-white",
  medium: "bg-amber-500 dark:bg-amber-600 text-white",
  low: "bg-muted text-muted-foreground",
};

const audienceLabels: Record<string, string> = {
  seniors: "Seniors",
  families: "Families",
  children: "Children",
  general: "Everyone",
};

const TIMEZONE_REGION_MAP: Record<string, string> = {
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Phoenix": "US",
  "America/Anchorage": "US",
  "Pacific/Honolulu": "US",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "America/Edmonton": "CA",
  "America/Winnipeg": "CA",
  "America/Halifax": "CA",
  "Europe/London": "GB",
  "Europe/Paris": "EU",
  "Europe/Berlin": "EU",
  "Europe/Madrid": "EU",
  "Europe/Rome": "EU",
  "Europe/Amsterdam": "EU",
  "Europe/Brussels": "EU",
  "Europe/Vienna": "EU",
  "Europe/Stockholm": "EU",
  "Europe/Warsaw": "EU",
  "Europe/Lisbon": "EU",
  "Europe/Dublin": "GB",
  "Europe/Athens": "EU",
  "Europe/Helsinki": "EU",
  "Europe/Bucharest": "EU",
  "Europe/Prague": "EU",
  "Europe/Budapest": "EU",
  "Europe/Copenhagen": "EU",
  "Australia/Sydney": "AU",
  "Australia/Melbourne": "AU",
  "Australia/Brisbane": "AU",
  "Australia/Perth": "AU",
  "Pacific/Auckland": "NZ",
  "Africa/Lagos": "AF_WEST",
  "Africa/Accra": "AF_WEST",
  "Africa/Dakar": "AF_WEST",
  "Africa/Abidjan": "AF_WEST",
  "Africa/Nairobi": "AF_EAST",
  "Africa/Dar_es_Salaam": "AF_EAST",
  "Africa/Kampala": "AF_EAST",
  "Africa/Addis_Ababa": "AF_EAST",
  "Africa/Johannesburg": "AF_SOUTH",
  "Africa/Harare": "AF_SOUTH",
  "Africa/Maputo": "AF_SOUTH",
  "Africa/Cairo": "AF_EAST",
  "Africa/Casablanca": "AF_WEST",
  "America/Sao_Paulo": "SA",
  "America/Buenos_Aires": "SA",
  "America/Bogota": "SA",
  "America/Lima": "SA",
  "America/Santiago": "SA",
  "America/Mexico_City": "SA",
  "Asia/Kolkata": "AS_SOUTH",
  "Asia/Karachi": "AS_SOUTH",
  "Asia/Dhaka": "AS_SOUTH",
  "Asia/Colombo": "AS_SOUTH",
  "Asia/Manila": "AS_SOUTHEAST",
  "Asia/Jakarta": "AS_SOUTHEAST",
  "Asia/Singapore": "AS_SOUTHEAST",
  "Asia/Kuala_Lumpur": "AS_SOUTHEAST",
  "Asia/Bangkok": "AS_SOUTHEAST",
  "Asia/Ho_Chi_Minh": "AS_SOUTHEAST",
};

const REGION_LABELS: Record<string, string> = {
  "US": "United States",
  "CA": "Canada",
  "GB": "United Kingdom",
  "EU": "Europe",
  "AU": "Australia",
  "NZ": "New Zealand",
  "AF_WEST": "West Africa",
  "AF_EAST": "East Africa",
  "AF_SOUTH": "Southern Africa",
  "SA": "Americas",
  "AS_SOUTH": "South Asia",
  "AS_SOUTHEAST": "Southeast Asia",
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

export function TrendingThreats() {
  const region = useMemo(() => detectRegion(), []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { data, isLoading } = useQuery<{ threats: TrendingThreat[]; detectedRegion: string }>({
    queryKey: [`/api/trending-threats?region=${region}`],
    staleTime: 5 * 60 * 1000,
  });

  const threats = data?.threats || [];
  const regionLabel = REGION_LABELS[region] || "your region";

  const next = useCallback(() => {
    if (threats.length > 0) {
      setActiveIndex((prev) => (prev + 1) % threats.length);
    }
  }, [threats.length]);

  const prev = useCallback(() => {
    if (threats.length > 0) {
      setActiveIndex((prev) => (prev - 1 + threats.length) % threats.length);
    }
  }, [threats.length]);

  useEffect(() => {
    if (threats.length <= 1 || isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [threats.length, isPaused, next]);

  useEffect(() => {
    if (activeIndex >= threats.length && threats.length > 0) {
      setActiveIndex(0);
    }
  }, [threats.length, activeIndex]);

  if (!isLoading && threats.length === 0) return null;

  const activeThreat = threats[activeIndex];

  return (
    <section
      className="py-6 sm:py-8"
      aria-label="Trending threats"
      data-testid="section-trending-threats"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <Radio className="w-4 h-4 text-red-500" />
              <span className="absolute w-2 h-2 bg-red-500 rounded-full animate-ping" />
            </div>
            <h2 className="text-base sm:text-lg font-bold" data-testid="text-trending-title">
              Live Threat Feed
            </h2>
            {region !== "GLOBAL" && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {regionLabel}
              </span>
            )}
          </div>
          {threats.length > 1 && (
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={prev}
                aria-label="Previous threat"
                data-testid="button-threat-prev"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs text-muted-foreground tabular-nums min-w-[3ch] text-center">
                {activeIndex + 1}/{threats.length}
              </span>
              <Button
                size="icon"
                variant="ghost"
                onClick={next}
                aria-label="Next threat"
                data-testid="button-threat-next"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="rounded-md border bg-card p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 bg-muted rounded" />
                <div className="h-3 w-full bg-muted rounded" />
                <div className="h-3 w-1/3 bg-muted rounded" />
              </div>
            </div>
          </div>
        )}

        {activeThreat && (
          <div
            className="relative overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <ThreatCard threat={activeThreat} key={activeThreat.id} />

            {threats.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-3">
                {threats.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      idx === activeIndex
                        ? "w-6 bg-primary"
                        : "w-1.5 bg-muted-foreground/30"
                    }`}
                    aria-label={`Go to threat ${idx + 1}`}
                    data-testid={`button-threat-dot-${idx}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function ThreatCard({ threat }: { threat: TrendingThreat }) {
  const Icon = categoryIcons[threat.category] || AlertTriangle;
  const severityClass = severityColors[threat.severity] || severityColors.low;
  const isClickable = !!threat.linkUrl;

  const content = (
    <div
      className={`rounded-md border bg-card p-4 sm:p-5 transition-opacity duration-300 animate-in fade-in slide-in-from-right-2 ${isClickable ? "hover-elevate" : ""}`}
      data-testid={`card-threat-${threat.id}`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex-shrink-0 mt-0.5 w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap mb-1.5">
            <h3 className="font-semibold text-sm sm:text-base leading-snug">{threat.title}</h3>
            <Badge
              className={`text-[10px] px-1.5 py-0 no-default-hover-elevate no-default-active-elevate flex-shrink-0 ${severityClass}`}
            >
              {threat.severity}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-2.5">
            {threat.summary}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-muted-foreground/70">
              {threat.source}
            </span>
            {threat.audience && threat.audience !== "general" && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 no-default-hover-elevate no-default-active-elevate">
                <Users className="w-2.5 h-2.5 mr-0.5" />
                {audienceLabels[threat.audience] || threat.audience}
              </Badge>
            )}
            <span className="text-[11px] text-muted-foreground/50 capitalize">
              {threat.category?.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isClickable) {
    return (
      <a
        href={threat.linkUrl!}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        data-testid={`link-threat-${threat.id}`}
      >
        {content}
      </a>
    );
  }

  return content;
}
