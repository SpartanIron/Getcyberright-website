"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "@/lib/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Mail, 
  Newspaper, 
  AlertTriangle, 
  BarChart3,
  Crown,
  TrendingUp,
  Shield,
  MessageSquare,
  FileText,
  ShieldAlert,
  Share2,
  CalendarDays,
  UserPlus,
  Cog,
  CheckCircle2,
  XCircle,
  Activity,
  Zap
} from "lucide-react";
import { Link } from "@/lib/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";

interface AdminStats {
  totalUsers: number;
  premiumUsers: number;
  contactMessages: number;
  newsletterSubscribers: number;
  scamReports: number;
  totalFeedback: number;
  newFeedback: number;
  totalGuides: number;
  publishedGuides: number;
  totalAlerts: number;
  publishedAlerts: number;
  totalScamIntel: number;
  totalSocialPosts: number;
  draftSocialPosts: number;
  guidesThisWeek: number;
  newSubscribersThisWeek: number;
  pendingTasks: number;
}

interface TaskStats {
  summary: {
    totalThisMonth: number;
    totalThisWeek: number;
    completed: number;
    failed: number;
    pending: number;
    running: number;
    successRate: number;
  };
  byType: Record<string, { total: number; completed: number; failed: number }>;
  recentActivity: Array<{
    id: string;
    taskType: string;
    taskName: string;
    status: string;
    errorMessage: string | null;
    createdAt: string;
    completedAt: string | null;
  }>;
}

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: adminCheck, isLoading: adminCheckLoading } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/check"],
    enabled: !!user,
  });

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    enabled: adminCheck?.isAdmin === true,
  });

  const { data: taskStats } = useQuery<TaskStats>({
    queryKey: ["/api/admin/growth/task-stats"],
    enabled: adminCheck?.isAdmin === true,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/login");
    }
  }, [authLoading, user, setLocation]);

  useEffect(() => {
    if (!authLoading && user?.mustChangePassword) {
      setLocation("/admin/change-password");
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

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      href: "/admin/users",
      color: "text-blue-500",
    },
    {
      title: "Verified Users",
      value: stats?.premiumUsers ?? 0,
      icon: Crown,
      href: "/admin/users",
      color: "text-amber-500",
    },
    {
      title: "Contact Messages",
      value: stats?.contactMessages ?? 0,
      icon: Mail,
      href: "/admin/messages",
      color: "text-green-500",
    },
    {
      title: "Newsletter Subscribers",
      value: stats?.newsletterSubscribers ?? 0,
      icon: Newspaper,
      href: "/admin/subscribers",
      color: "text-purple-500",
    },
    {
      title: "Scam Reports",
      value: stats?.scamReports ?? 0,
      icon: AlertTriangle,
      href: "/admin/scam-reports",
      color: "text-red-500",
    },
    {
      title: "User Feedback",
      value: stats?.newFeedback ?? 0,
      icon: MessageSquare,
      href: "/admin/feedback",
      color: "text-teal-500",
    },
  ];

  const contentCards = [
    {
      title: "Published Guides",
      value: `${stats?.publishedGuides ?? 0} / ${stats?.totalGuides ?? 0}`,
      subtitle: `${stats?.guidesThisWeek ?? 0} this week`,
      icon: FileText,
      color: "text-teal-500",
    },
    {
      title: "Threat Alerts",
      value: `${stats?.publishedAlerts ?? 0} / ${stats?.totalAlerts ?? 0}`,
      subtitle: "published / total",
      icon: ShieldAlert,
      color: "text-red-500",
    },
    {
      title: "Scam Intelligence",
      value: stats?.totalScamIntel ?? 0,
      subtitle: "entries tracked",
      icon: AlertTriangle,
      color: "text-orange-500",
    },
    {
      title: "Social Posts",
      value: stats?.totalSocialPosts ?? 0,
      subtitle: `${stats?.draftSocialPosts ?? 0} drafts ready`,
      icon: Share2,
      color: "text-blue-500",
    },
    {
      title: "New Subscribers",
      value: stats?.newSubscribersThisWeek ?? 0,
      subtitle: "this week",
      icon: UserPlus,
      color: "text-green-500",
    },
    {
      title: "Pending Tasks",
      value: stats?.pendingTasks ?? 0,
      subtitle: "in automation queue",
      icon: Cog,
      color: "text-purple-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-admin-title">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.firstName || "Admin"}. Here's an overview of your site.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover-elevate cursor-pointer transition-all">
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold" data-testid={`stat-${stat.title.toLowerCase().replace(/\s/g, "-")}`}>
                    {statsLoading ? "..." : typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Content Pipeline
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentCards.map((stat) => (
              <Card key={stat.title} className="transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid={`stat-${stat.title.toLowerCase().replace(/\s/g, "-")}`}>
                    {statsLoading ? "..." : stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.subtitle}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {taskStats && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Content Automation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
                  <Zap className="w-5 h-5 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="stat-success-rate">
                    {taskStats.summary.successRate}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">last 30 days</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600" data-testid="stat-completed-tasks">
                    {taskStats.summary.completed}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{taskStats.summary.totalThisWeek} this week</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
                  <XCircle className="w-5 h-5 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600" data-testid="stat-failed-tasks">
                    {taskStats.summary.failed}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{taskStats.summary.totalThisMonth} total this month</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
                  <Activity className="w-5 h-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="stat-running-tasks">
                    {taskStats.summary.running + taskStats.summary.pending}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{taskStats.summary.running} running, {taskStats.summary.pending} queued</div>
                </CardContent>
              </Card>
            </div>

            {Object.keys(taskStats.byType).length > 0 && (
              <Card className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Task Breakdown by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(taskStats.byType).map(([type, counts]) => (
                      <div key={type} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground capitalize">{type.replace(/_/g, " ")}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-green-600">{counts.completed} done</span>
                          {counts.failed > 0 && <span className="text-red-600">{counts.failed} failed</span>}
                          <span className="text-muted-foreground">{counts.total} total</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {taskStats.recentActivity.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {taskStats.recentActivity.map((task) => (
                      <div key={task.id} className="flex items-center justify-between text-xs border-b border-border/50 pb-1">
                        <div className="flex items-center gap-2">
                          {task.status === "completed" && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                          {task.status === "failed" && <XCircle className="w-3 h-3 text-red-500" />}
                          {task.status === "pending" && <Cog className="w-3 h-3 text-muted-foreground" />}
                          {task.status === "running" && <Activity className="w-3 h-3 text-blue-500 animate-pulse" />}
                          <span className="font-medium truncate max-w-[200px]">{task.taskName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span className="capitalize">{task.status}</span>
                          {task.createdAt && <span>{new Date(task.createdAt).toLocaleDateString()}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Users className="w-4 h-4" />
                  Manage Users
                </Button>
              </Link>
              <Link href="/admin/messages">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Mail className="w-4 h-4" />
                  View Messages
                </Button>
              </Link>
              <Link href="/admin/subscribers">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Newspaper className="w-4 h-4" />
                  Newsletter Subscribers
                </Button>
              </Link>
              <Link href="/admin/scam-reports">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Review Scam Reports
                </Button>
              </Link>
              <Link href="/admin/feedback">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Review Feedback
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Authentication</span>
                  <span className="flex items-center gap-2 text-green-500">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Database</span>
                  <span className="flex items-center gap-2 text-green-500">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Stripe Integration</span>
                  <span className="flex items-center gap-2 text-green-500">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Security Monitoring</span>
                  <span className="flex items-center gap-2 text-green-500">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Enabled
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
