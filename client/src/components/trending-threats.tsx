import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ExternalLink, TrendingUp, ShieldAlert, Bug, AlertOctagon, Lock, UserX } from "lucide-react";
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

export function TrendingThreats() {
  const { data, isLoading } = useQuery<{ threats: TrendingThreat[] }>({
    queryKey: ["/api/trending-threats"],
    staleTime: 5 * 60 * 1000,
  });

  const threats = data?.threats || [];

  if (!isLoading && threats.length === 0) return null;

  return (
    <section
      className="py-8 sm:py-12 bg-muted/30"
      aria-label="Trending threats"
      data-testid="section-trending-threats"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <TrendingUp className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <h2 className="text-lg sm:text-xl font-bold">Trending Threats</h2>
          <Badge variant="outline" className="text-xs">Live</Badge>
        </div>

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
