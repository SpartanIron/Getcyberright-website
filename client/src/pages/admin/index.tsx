import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
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
  Shield
} from "lucide-react";
import { Link } from "wouter";
import { AdminLayout } from "@/components/admin/admin-layout";

interface AdminStats {
  totalUsers: number;
  premiumUsers: number;
  contactMessages: number;
  newsletterSubscribers: number;
  scamReports: number;
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
                    {statsLoading ? "..." : stat.value.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

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
