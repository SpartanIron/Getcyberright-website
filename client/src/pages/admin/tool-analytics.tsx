import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "@/lib/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3,
  Wrench,
  Globe,
  Users,
  Activity,
  TrendingUp
} from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ToolStat {
  toolName: string;
  totalUsage: number;
  completedCount: number;
}

interface CountryStat {
  countryCode: string | null;
  totalUsage: number;
}

interface DailyUsage {
  date: string;
  totalUsage: number;
}

interface RecentUsage {
  id: string;
  toolName: string;
  userId: string | null;
  sessionId: string | null;
  countryCode: string | null;
  completed: boolean;
  metadata: string | null;
  createdAt: string;
}

interface ToolAnalytics {
  summary: {
    totalUsage: number;
    uniqueUsers: number;
    uniqueSessions: number;
  };
  toolStats: ToolStat[];
  countryStats: CountryStat[];
  dailyUsage: DailyUsage[];
  recentUsage: RecentUsage[];
}

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  GH: "Ghana",
  NG: "Nigeria",
  ZA: "South Africa",
  KE: "Kenya",
  EG: "Egypt",
  MA: "Morocco",
  TZ: "Tanzania",
  UG: "Uganda",
  IN: "India",
  DE: "Germany",
  FR: "France",
};

const TOOL_COLORS: Record<string, string> = {
  "scam-checker": "bg-blue-500",
  "password-generator": "bg-green-500",
  "family-codeword": "bg-purple-500",
  "url-scanner": "bg-orange-500",
  "phone-lookup": "bg-red-500",
  "qr-scanner": "bg-teal-500",
  "deepfake-education": "bg-pink-500",
  "dezi-ai": "bg-indigo-500",
  "voice-detector": "bg-amber-500",
};

export default function ToolAnalyticsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: adminCheck, isLoading: adminCheckLoading } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/check"],
    enabled: !!user,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery<ToolAnalytics>({
    queryKey: ["/api/admin/tool-analytics"],
    enabled: adminCheck?.isAdmin === true,
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/login");
    }
  }, [authLoading, user, setLocation]);

  useEffect(() => {
    if (!adminCheckLoading && adminCheck && !adminCheck.isAdmin) {
      setLocation("/");
    }
  }, [adminCheckLoading, adminCheck, setLocation]);

  if (authLoading || adminCheckLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!adminCheck?.isAdmin) {
    return null;
  }

  const maxDailyUsage = Math.max(...(analytics?.dailyUsage.map(d => d.totalUsage) || [1]));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-analytics-title">
            Tool Usage Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Track how users interact with security tools across the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tool Uses
              </CardTitle>
              <Activity className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="stat-total-usage">
                {analyticsLoading ? "..." : (analytics?.summary.totalUsage || 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unique Users
              </CardTitle>
              <Users className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="stat-unique-users">
                {analyticsLoading ? "..." : (analytics?.summary.uniqueUsers || 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unique Sessions
              </CardTitle>
              <Globe className="w-5 h-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="stat-unique-sessions">
                {analyticsLoading ? "..." : (analytics?.summary.uniqueSessions || 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary" />
                Tool Popularity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-10 bg-muted rounded" />
                  ))}
                </div>
              ) : analytics?.toolStats.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No tool usage data yet</p>
              ) : (
                <div className="space-y-3">
                  {analytics?.toolStats.map((tool) => {
                    const maxUsage = Math.max(...analytics.toolStats.map(t => t.totalUsage));
                    const percentage = (tool.totalUsage / maxUsage) * 100;
                    const completionRate = tool.totalUsage > 0 
                      ? Math.round((tool.completedCount / tool.totalUsage) * 100) 
                      : 0;
                    const colorClass = TOOL_COLORS[tool.toolName] || "bg-gray-500";
                    
                    return (
                      <div key={tool.toolName} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium capitalize">
                            {tool.toolName.replace(/-/g, " ")}
                          </span>
                          <span className="text-muted-foreground">
                            {tool.totalUsage.toLocaleString()} uses ({completionRate}% completed)
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${colorClass} transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Top Countries
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-8 bg-muted rounded" />
                  ))}
                </div>
              ) : analytics?.countryStats.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No geographic data yet</p>
              ) : (
                <div className="space-y-2">
                  {analytics?.countryStats.map((country, index) => (
                    <div 
                      key={country.countryCode || "unknown"} 
                      className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 flex items-center justify-center bg-primary/10 rounded text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="font-medium">
                          {country.countryCode 
                            ? (COUNTRY_NAMES[country.countryCode] || country.countryCode)
                            : "Unknown"}
                        </span>
                      </div>
                      <Badge variant="secondary">
                        {country.totalUsage.toLocaleString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Daily Usage (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="h-40 flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading chart...</div>
              </div>
            ) : analytics?.dailyUsage.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No daily usage data yet</p>
            ) : (
              <div className="h-40 flex items-end gap-1">
                {analytics?.dailyUsage.map((day) => {
                  const height = (day.totalUsage / maxDailyUsage) * 100;
                  const date = new Date(day.date);
                  return (
                    <div 
                      key={day.date} 
                      className="flex-1 flex flex-col items-center gap-1 group"
                      title={`${date.toLocaleDateString()}: ${day.totalUsage} uses`}
                    >
                      <div 
                        className="w-full bg-primary/80 rounded-t transition-all group-hover:bg-primary"
                        style={{ height: `${Math.max(height, 2)}%` }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="animate-pulse space-y-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-12 bg-muted rounded" />
                ))}
              </div>
            ) : analytics?.recentUsage.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No recent activity</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tool</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics?.recentUsage.map((usage) => (
                    <TableRow key={usage.id}>
                      <TableCell className="font-medium capitalize">
                        {usage.toolName.replace(/-/g, " ")}
                      </TableCell>
                      <TableCell>
                        {usage.userId ? (
                          <span className="text-sm">{usage.userId.substring(0, 8)}...</span>
                        ) : (
                          <span className="text-muted-foreground text-sm">Anonymous</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {usage.countryCode 
                          ? (COUNTRY_NAMES[usage.countryCode] || usage.countryCode)
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={usage.completed ? "default" : "secondary"}>
                          {usage.completed ? "Completed" : "Started"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(usage.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
