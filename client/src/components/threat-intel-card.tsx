import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  Shield, 
  Activity, 
  ExternalLink,
  Clock,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/lib/navigation";

interface ThreatItem {
  id: string;
  title: string;
  summary: string;
  itemType: string;
  severity: string;
  confidence: number;
  sourceUrl: string | null;
  publishedAt: string;
  affectedAudiences: string[] | null;
}

interface ThreatStats {
  totalFeeds: number;
  activeFeeds: number;
  totalItems: number;
  recentItems24h: number;
  healthyFeeds: number;
  staleFeeds: number;
  criticalItems: number;
}

function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case "critical": return "text-red-600 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800";
    case "high": return "text-orange-600 bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800";
    case "medium": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800";
    case "low": return "text-green-600 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800";
    default: return "text-muted-foreground bg-muted";
  }
}

function getItemTypeIcon(itemType: string) {
  switch (itemType.toLowerCase()) {
    case "phishing":
    case "phishing_url":
      return <AlertTriangle className="w-4 h-4" />;
    case "vulnerability":
    case "cve":
      return <Shield className="w-4 h-4" />;
    case "malware":
    case "malware_url":
      return <Activity className="w-4 h-4" />;
    default:
      return <TrendingUp className="w-4 h-4" />;
  }
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

interface ThreatIntelCardProps {
  className?: string;
  limit?: number;
}

export function ThreatIntelCard({ className = "", limit = 5 }: ThreatIntelCardProps) {
  const { data: statsData, isLoading: statsLoading } = useQuery<{ success: boolean; stats: ThreatStats }>({
    queryKey: ["/api/threat-intel/stats"],
    refetchInterval: 300000,
  });

  const { data: itemsData, isLoading: itemsLoading } = useQuery<{ success: boolean; items: ThreatItem[] }>({
    queryKey: ["/api/threat-intel/items", { limit, severity: "critical" }],
    refetchInterval: 300000,
  });

  const stats = statsData?.stats;
  const items = itemsData?.items?.slice(0, limit) || [];
  const isLoading = statsLoading || itemsLoading;

  return (
    <Card className={className} data-testid="card-threat-intel">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-600" />
            <CardTitle className="text-lg" data-testid="text-threat-intel-title">Threat Intelligence</CardTitle>
          </div>
          <Badge variant="outline" className="gap-1">
            <Activity className="w-3 h-3" />
            Live
          </Badge>
        </div>
        <CardDescription>Latest security alerts from trusted sources</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <>
            {stats && (
              <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-muted/50 mb-4" data-testid="threat-intel-stats">
                <div className="text-center">
                  <div className="text-lg font-bold text-teal-600" data-testid="text-active-feeds">{stats.activeFeeds}</div>
                  <div className="text-xs text-muted-foreground">Active Feeds</div>
                </div>
                <div className="text-center border-x">
                  <div className="text-lg font-bold text-blue-600" data-testid="text-recent-items">{stats.recentItems24h}</div>
                  <div className="text-xs text-muted-foreground">New Today</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600" data-testid="text-critical-items">{stats.criticalItems}</div>
                  <div className="text-xs text-muted-foreground">Critical</div>
                </div>
              </div>
            )}

            {items.length > 0 ? (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded-lg border ${getSeverityColor(item.severity)}`}
                    data-testid={`threat-item-${item.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getItemTypeIcon(item.itemType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm truncate" data-testid={`text-threat-title-${item.id}`}>
                            {item.title.length > 60 ? item.title.substring(0, 60) + "..." : item.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className="text-xs capitalize">{item.severity}</Badge>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatTime(item.publishedAt)}
                          </span>
                        </div>
                      </div>
                      {item.sourceUrl && (
                        <a 
                          href={item.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                          data-testid={`link-threat-source-${item.id}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground" data-testid="text-no-threats">
                <Shield className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm">No critical threats detected</p>
                <p className="text-xs">Feeds are actively monitoring for new threats</p>
              </div>
            )}

            <div className="pt-2 border-t">
              <Link href="/tools">
                <Button variant="outline" className="w-full" data-testid="button-scan-threats">
                  Scan URL or Email for Threats
                </Button>
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function ThreatIntelMini({ className = "" }: { className?: string }) {
  const { data: statsData } = useQuery<{ success: boolean; stats: ThreatStats }>({
    queryKey: ["/api/threat-intel/stats"],
    refetchInterval: 300000,
  });

  const stats = statsData?.stats;

  if (!stats) return null;

  return (
    <div className={`flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/30 dark:to-blue-950/30 border ${className}`} data-testid="threat-intel-mini">
      <Shield className="w-5 h-5 text-teal-600" />
      <div className="flex-1">
        <div className="text-sm font-medium">Threat Intelligence Active</div>
        <div className="text-xs text-muted-foreground">
          {stats.activeFeeds} feeds • {stats.recentItems24h} new alerts today
        </div>
      </div>
      {stats.criticalItems > 0 && (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="w-3 h-3" />
          {stats.criticalItems} Critical
        </Badge>
      )}
    </div>
  );
}
