import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ExternalLink, TrendingUp, ShieldAlert, Bug, AlertOctagon, Lock, UserX, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

const severityStyles: Record<string, string> = {
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

  const { data, isLoading } = useQuery<{ threats: TrendingThreat[]; detectedRegion: string }>({
    queryKey: [`/api/trending-threats?region=${region}`],
    staleTime: 5 * 60 * 1000,
  });

  const threats = data?.threats || [];
  const regionLabel = REGION_LABELS[region] || "your region";

  if (!isLoading && threats.length === 0) return null;

  return (
    <section
      className="py-8 sm:py-12 bg-muted/30"
      aria-label="Trending threats"
      data-testid="section-trending-threats"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-1 sm:mb-2 flex-wrap">
          <TrendingUp className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <h2 className="text-lg sm:text-xl font-bold" data-testid="text-trending-title">Trending Threats</h2>
          <Badge variant="outline" className="text-xs">Live</Badge>
        </div>
        {region !== "GLOBAL" && (
          <p className="text-xs text-muted-foreground mb-4 sm:mb-6 flex items-center gap-1" data-testid="text-region-label">
            <MapPin className="w-3 h-3" />
            Showing threats relevant to {regionLabel}
          </p>
        )}
        {region === "GLOBAL" && (
          <p className="text-xs text-muted-foreground mb-4 sm:mb-6">
            Showing global threats
          </p>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-5 h-5 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {threats.map((threat) => {
            const Icon = categoryIcons[threat.category] || AlertTriangle;
            const severityClass = severityStyles[threat.severity] || severityStyles.low;
            const Wrapper = threat.linkUrl ? "a" : "div";
            const linkProps = threat.linkUrl
              ? { href: threat.linkUrl, target: "_blank", rel: "noopener noreferrer", "data-testid": `link-threat-${threat.id}` }
              : {};

            return (
              <Card
                key={threat.id}
                className={`hover-elevate ${threat.linkUrl ? "cursor-pointer" : ""}`}
                data-testid={`card-threat-${threat.id}`}
              >
                <Wrapper {...linkProps} className="block">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <Icon className="w-5 h-5 text-orange-500" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-sm leading-tight">{threat.title}</h3>
                          <Badge
                            className={`text-[10px] px-1.5 py-0 no-default-hover-elevate no-default-active-elevate ${severityClass}`}
                          >
                            {threat.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-2 line-clamp-2">
                          {threat.summary}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] text-muted-foreground">
                            Source: {threat.source}
                          </span>
                          {threat.audience && threat.audience !== "general" && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 no-default-hover-elevate no-default-active-elevate">
                              <Users className="w-2.5 h-2.5 mr-0.5" />
                              {audienceLabels[threat.audience] || threat.audience}
                            </Badge>
                          )}
                          {threat.linkUrl && (
                            <ExternalLink className="w-3 h-3 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Wrapper>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
