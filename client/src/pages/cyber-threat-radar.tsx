import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";
import { StructuredData, type BreadcrumbData } from "@/components/structured-data";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Radar, ShieldAlert, AlertTriangle, Activity, TrendingUp,
  ArrowRight, Loader2, Globe, Clock, Shield, Zap, Eye, BookOpen
} from "lucide-react";

interface ThreatAlert {
  id: string;
  slug: string;
  threatName: string;
  threatCategory: string;
  description: string;
  riskLevel: string;
  affectedPlatforms: string[];
  regions: string[];
  publishedAt: string;
  dateDetected: string;
}

interface TrendingThreat {
  id: number;
  title: string;
  category: string;
  severity: string;
  description: string;
  source: string;
  publishedAt: string;
}

const riskConfig: Record<string, { color: string; bg: string; border: string; glow: string }> = {
  critical: { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500", glow: "shadow-red-500/20" },
  high: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500", glow: "shadow-red-500/20" },
  medium: { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500", glow: "shadow-orange-500/20" },
  low: { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500", glow: "shadow-green-500/20" },
};

function ThreatLevelIndicator({ level, count }: { level: string; count: number }) {
  const config = riskConfig[level] || riskConfig.low;
  return (
    <div className={`relative p-4 rounded-xl border ${config.border} ${config.bg} shadow-lg ${config.glow}`} data-testid={`indicator-${level}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-semibold uppercase tracking-wider ${config.color}`}>{level}</span>
        <div className={`w-3 h-3 rounded-full ${level === "critical" || level === "high" ? "bg-red-500 animate-pulse" : level === "medium" ? "bg-orange-500" : "bg-green-500"}`} />
      </div>
      <div className={`text-3xl font-bold ${config.color}`}>{count}</div>
      <div className="text-xs text-muted-foreground mt-1">active threats</div>
    </div>
  );
}

export default function CyberThreatRadar() {
  useSEO({
    title: "Cyber Threat Radar | Real-Time Threat Monitoring | GetCyberRight",
    description: "Monitor emerging cyber threats in real time. Track active alerts, trending attacks, and security advisories that affect you and your family.",
    keywords: "cyber threat radar, real-time threats, security monitoring, threat intelligence, cybersecurity alerts",
  });

  const breadcrumbs: BreadcrumbData = {
    type: "BreadcrumbList",
    items: [
      { name: "Home", url: "https://www.getcyberright.com/" },
      { name: "Cyber Threat Radar", url: "https://www.getcyberright.com/cyber-threat-radar" },
    ],
  };

  const { data: alerts = [], isLoading: alertsLoading } = useQuery<ThreatAlert[]>({
    queryKey: ["/api/alerts"],
  });

  const { data: trending = [], isLoading: trendingLoading } = useQuery<TrendingThreat[]>({
    queryKey: ["/api/trending-threats"],
  });

  const isLoading = alertsLoading || trendingLoading;

  const riskCounts = alerts.reduce((acc, a) => {
    const level = a.riskLevel?.toLowerCase() || "low";
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentAlerts = [...alerts]
    .sort((a, b) => new Date(b.publishedAt || b.dateDetected).getTime() - new Date(a.publishedAt || a.dateDetected).getTime())
    .slice(0, 6);

  const overallThreatLevel = riskCounts.critical > 0 ? "CRITICAL" : riskCounts.high > 0 ? "HIGH" : riskCounts.medium > 0 ? "ELEVATED" : "LOW";
  const overallColor = overallThreatLevel === "CRITICAL" ? "text-red-500" : overallThreatLevel === "HIGH" ? "text-red-400" : overallThreatLevel === "ELEVATED" ? "text-orange-400" : "text-green-400";

  const categories = alerts.reduce((acc, a) => {
    if (a.threatCategory) acc[a.threatCategory] = (acc[a.threatCategory] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={[breadcrumbs]} />
      <Navigation />

      <div className="bg-[#0A2A3C] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A2A3C] via-[#0A2A3C] to-[#00293C]" />

        <div className="absolute pointer-events-none hidden md:block" aria-hidden="true" style={{ top: 0, right: 0, width: "55%", height: "100%", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-40%", right: "2%", width: "50px", height: "220%", background: "linear-gradient(180deg, #003A52 0%, #0D4D66 50%, #003A52 100%)", transform: "rotate(20deg)", transformOrigin: "top center", filter: "drop-shadow(0 0 18px rgba(13, 148, 136, 0.15))" }} />
          <div style={{ position: "absolute", top: "-40%", right: "10%", width: "2px", height: "220%", background: "linear-gradient(180deg, transparent 10%, rgba(45, 212, 191, 0.4) 50%, transparent 90%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
          <div style={{ position: "absolute", top: "-35%", right: "18%", width: "35px", height: "220%", background: "linear-gradient(180deg, #5eead4 0%, #2dd4bf 35%, #14b8a6 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.55, filter: "drop-shadow(0 0 24px rgba(45, 212, 191, 0.3))" }} />
          <div style={{ position: "absolute", top: "-35%", right: "26%", width: "2px", height: "220%", background: "linear-gradient(180deg, transparent 15%, hsla(16, 95%, 58%, 0.35) 50%, transparent 85%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
          <div style={{ position: "absolute", top: "-30%", right: "32%", width: "50px", height: "220%", background: "linear-gradient(180deg, hsl(16, 100%, 62%) 0%, hsl(16, 95%, 52%) 40%, hsl(16, 90%, 42%) 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.5, filter: "drop-shadow(0 0 22px hsla(16, 95%, 55%, 0.25))" }} />
        </div>

        <div className="absolute -bottom-24 -left-16 w-[400px] h-[400px] bg-primary/[0.04] rounded-full blur-[100px]" />

        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Radar className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-[1.75rem] sm:text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold tracking-[-0.025em] leading-[1.08]" data-testid="heading-threat-radar">Cyber Threat Radar</h1>
              <p className="text-white/60 mt-1">Real-time monitoring of active cyber threats</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <ThreatLevelIndicator level="critical" count={riskCounts.critical || 0} />
            <ThreatLevelIndicator level="high" count={riskCounts.high || 0} />
            <ThreatLevelIndicator level="medium" count={riskCounts.medium || 0} />
            <ThreatLevelIndicator level="low" count={riskCounts.low || 0} />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 p-4 rounded-xl bg-white/[0.05] border border-white/10">
            <Activity className={`h-6 w-6 ${overallColor}`} />
            <div>
              <span className="text-sm text-white/50">Overall Threat Level: </span>
              <span className={`font-bold text-lg ${overallColor}`} data-testid="text-overall-threat-level">{overallThreatLevel}</span>
            </div>
            <div className="ml-auto text-xs text-white/40 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Updated {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </div>
        </div>
      </div>

      <main id="main-content" tabIndex={-1} className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-12">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2" data-testid="heading-latest-alerts">
                  <ShieldAlert className="h-6 w-6 text-red-500" />
                  Latest Threat Alerts
                </h2>
                <Link href="/alerts">
                  <Button variant="outline" size="sm" data-testid="link-view-all-alerts">
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentAlerts.map((alert) => {
                  const config = riskConfig[alert.riskLevel] || riskConfig.low;
                  return (
                    <Link key={alert.id} href={`/alerts/${alert.slug}`}>
                      <Card className={`h-full hover:shadow-lg transition-all cursor-pointer border-t-4 ${config.border}`} data-testid={`card-alert-${alert.slug}`}>
                        <CardContent className="pt-5">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className={`${config.bg} ${config.color} border-0`}>
                              {alert.riskLevel?.toUpperCase()}
                            </Badge>
                            {alert.threatCategory && (
                              <Badge variant="outline" className="text-xs">{alert.threatCategory}</Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-sm mb-2 line-clamp-2">{alert.threatName}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{alert.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(alert.publishedAt || alert.dateDetected).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            {alert.affectedPlatforms?.length > 0 && (
                              <>
                                <span className="mx-1">|</span>
                                <Globe className="h-3 w-3" />
                                {alert.affectedPlatforms.slice(0, 2).join(", ")}
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-6" data-testid="heading-threat-categories">
                <Shield className="h-6 w-6 text-teal-500" />
                Threat Categories
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(categories).sort((a, b) => b[1] - a[1]).map(([cat, cnt]) => (
                  <Card key={cat} className="hover:shadow-md transition-all">
                    <CardContent className="pt-5 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{cat}</div>
                        <div className="text-2xl font-bold text-primary mt-1">{cnt}</div>
                        <div className="text-xs text-muted-foreground">alerts</div>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-muted-foreground/20" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {trending.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2" data-testid="heading-trending-threats">
                    <TrendingUp className="h-6 w-6 text-orange-500" />
                    Trending Threats
                  </h2>
                  <Link href="/threat-trends">
                    <Button variant="outline" size="sm" data-testid="link-view-trends">
                      Full Dashboard <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {trending.slice(0, 8).map((threat) => (
                    <Card key={threat.id} className="hover:shadow-md transition-all">
                      <CardContent className="py-4 flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          threat.severity === "critical" || threat.severity === "high" ? "bg-red-500/10" : 
                          threat.severity === "medium" ? "bg-orange-500/10" : "bg-green-500/10"
                        }`}>
                          <Zap className={`h-5 w-5 ${
                            threat.severity === "critical" || threat.severity === "high" ? "text-red-500" : 
                            threat.severity === "medium" ? "text-orange-500" : "text-green-500"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{threat.title}</h3>
                          <p className="text-xs text-muted-foreground truncate">{threat.description}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" className="text-xs">{threat.category}</Badge>
                          <Badge className={`text-xs border-0 ${
                            threat.severity === "critical" || threat.severity === "high" ? "bg-red-500/10 text-red-500" : 
                            threat.severity === "medium" ? "bg-orange-500/10 text-orange-500" : "bg-green-500/10 text-green-500"
                          }`}>{threat.severity}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-6" data-testid="heading-protect-yourself">
                <Eye className="h-6 w-6 text-teal-500" />
                Protect Yourself
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-teal-50 to-white dark:from-teal-950/30 dark:to-background">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5 text-teal-500" />
                      Check for Scams
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Paste any suspicious URL, email, or message to check if it is a scam.</p>
                    <Link href="/tools">
                      <Button className="w-full" data-testid="link-scam-checker">Use Scam Checker</Button>
                    </Link>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-background">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      Read Safety Guides
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Expert guides to keep you, your family, and your data safe online.</p>
                    <Link href="/guides">
                      <Button variant="outline" className="w-full" data-testid="link-guides">Browse Guides</Button>
                    </Link>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-background">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-purple-500" />
                      Report a Scam
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Help protect others by reporting scams you have encountered.</p>
                    <Link href="/report-scam">
                      <Button variant="outline" className="w-full" data-testid="link-report-scam">Report Now</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
