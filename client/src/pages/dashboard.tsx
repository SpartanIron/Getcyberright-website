"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Shield,
  Settings,
  LogOut,
  Crown,
  BookOpen,
  ArrowRight,
  Scan,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
  Lock,
  Fingerprint,
  TrendingUp,
  Activity,
  Search,
  Bell,
  Chrome,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "@/lib/navigation";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { OnboardingWelcome } from "@/components/onboarding-welcome";
import { RegionalThreatsCard } from "@/components/region-selector";
import { ThreatIntelCard } from "@/components/threat-intel-card";

interface DashboardStats {
  totalScans: number;
  brokersFound: number;
  removalRequests: number;
  removalsComplete: number;
  breachAlerts: number;
  maskedIdentities: number;
  learningProgress: number;
  safetyScore: number;
  recentScans: { id: string; type: string; result: string; createdAt: string }[];
}

const tierConfig: Record<string, { label: string; color: string; badgeClass: string }> = {
  free: { label: "Free", color: "text-slate-600", badgeClass: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200" },
  essential: { label: "Essential", color: "text-blue-600", badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  professional: { label: "Professional", color: "text-purple-600", badgeClass: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  enterprise: { label: "Enterprise", color: "text-amber-600", badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
};

function getSafetyScoreColor(score: number) {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
}

function getSafetyScoreLabel(score: number) {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Moderate";
  if (score >= 40) return "Needs Work";
  return "At Risk";
}

function getSafetyProgressColor(score: number) {
  if (score >= 80) return "[&>div]:bg-green-500";
  if (score >= 60) return "[&>div]:bg-yellow-500";
  if (score >= 40) return "[&>div]:bg-orange-500";
  return "[&>div]:bg-red-500";
}

export default function Dashboard() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/user/dashboard-stats"],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to access your dashboard.",
        variant: "destructive",
      });
      setTimeout(() => setLocation("/login"), 1000);
    }
  }, [isLoading, isAuthenticated, toast, setLocation]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const dismissed = localStorage.getItem("gcr_onboarding_dismissed");
      if (!dismissed) {
        setShowOnboarding(true);
      }
    }
  }, [isAuthenticated, user]);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("gcr_onboarding_dismissed", "true");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Shield className="w-8 h-8 text-primary animate-pulse" />
          <span className="text-muted-foreground">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const sgTier = (user as any).subscriptionTier || "free";
  const dsTier = (user as any).shieldSubscriptionTier || "free";
  const sgConfig = tierConfig[sgTier] || tierConfig.free;
  const dsConfig = tierConfig[dsTier] || tierConfig.free;
  const displayName = user.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
    : user.email || "Member";
  const initials = user.firstName
    ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ""}`
    : user.email ? user.email[0].toUpperCase() : "U";

  const safetyScore = stats?.safetyScore ?? 20;
  const scoreColor = getSafetyScoreColor(safetyScore);
  const scoreLabel = getSafetyScoreLabel(safetyScore);
  const progressColor = getSafetyProgressColor(safetyScore);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.dashboard} />
      <Navigation />

      <main id="main-content" tabIndex={-1} className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-14 h-14" data-testid="img-avatar">
                      <AvatarImage src={user.profileImageUrl || undefined} alt={displayName} />
                      <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground" data-testid="text-welcome">
                        Welcome back, {user.firstName || "Member"}
                      </h1>
                      <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/account">
                      <Button variant="outline" size="sm" data-testid="link-account-settings">
                        <Settings className="w-4 h-4 mr-2" />
                        Account
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => logout()} data-testid="button-logout">
                      <LogOut className="w-4 h-4 mr-2" />
                      Log Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {showOnboarding && (
            <OnboardingWelcome
              firstName={user.firstName || "there"}
              onDismiss={dismissOnboarding}
            />
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid md:grid-cols-3 gap-4"
          >
            <Card className="md:col-span-1" data-testid="card-safety-score">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Safety Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-3 mb-3">
                  <span className={`text-4xl font-bold ${scoreColor}`} data-testid="text-safety-score">
                    {statsLoading ? "—" : safetyScore}
                  </span>
                  <span className="text-sm text-muted-foreground mb-1">/ 100</span>
                  <Badge variant="secondary" className="mb-1 ml-auto">
                    {scoreLabel}
                  </Badge>
                </div>
                <Progress value={safetyScore} className={`h-2 ${progressColor}`} />
                <p className="text-xs text-muted-foreground mt-3">
                  Improve your score by running scans, enabling MFA, and completing training.
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-quick-stats">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Your Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-foreground" data-testid="text-total-scans">
                      {statsLoading ? "—" : stats?.totalScans || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Scans Run</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-foreground" data-testid="text-brokers-found">
                      {statsLoading ? "—" : stats?.brokersFound || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Brokers Found</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-foreground" data-testid="text-breach-alerts">
                      {statsLoading ? "—" : stats?.breachAlerts || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Breach Alerts</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-foreground" data-testid="text-learning-progress">
                      {statsLoading ? "—" : `${stats?.learningProgress || 0}%`}
                    </div>
                    <div className="text-xs text-muted-foreground">Training</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-quick-actions">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/scam-checker">
                  <Button variant="outline" size="sm" className="w-full justify-start" data-testid="link-scam-scanner">
                    <Scan className="w-4 h-4 mr-2 text-orange-500" />
                    AI Scam Scanner
                  </Button>
                </Link>
                <Link href="/data-removal">
                  <Button variant="outline" size="sm" className="w-full justify-start" data-testid="link-data-scan">
                    <Search className="w-4 h-4 mr-2 text-teal-500" />
                    Data Exposure Scan
                  </Button>
                </Link>
                <Link href="/breach-dashboard">
                  <Button variant="outline" size="sm" className="w-full justify-start" data-testid="link-breach-monitor">
                    <Bell className="w-4 h-4 mr-2 text-red-500" />
                    Breach Monitor
                  </Button>
                </Link>
                <Link href="/training">
                  <Button variant="outline" size="sm" className="w-full justify-start" data-testid="link-training">
                    <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                    Training Academy
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-4"
          >
            <Card data-testid="card-scam-guard">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-500" />
                    GCR Scam Guard
                  </CardTitle>
                  <Badge className={sgConfig.badgeClass}>
                    <Crown className="w-3 h-3 mr-1" />
                    {sgConfig.label}
                  </Badge>
                </div>
                <CardDescription>Browser protection against scams and phishing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Scan className="w-4 h-4" /> AI Scam Scanner
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Eye className="w-4 h-4" /> Fake Domain Detection
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Chrome className="w-4 h-4" /> Auto Page Scan
                    </span>
                    {sgTier !== "free" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <ShieldAlert className="w-4 h-4" /> Real-time Protection
                    </span>
                    {sgTier !== "free" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  {sgTier === "free" && (
                    <Link href="/gcr-guard-pricing">
                      <Button size="sm" className="w-full mt-2" data-testid="button-upgrade-scamguard">
                        Upgrade Scam Guard
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-data-shield">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Fingerprint className="w-5 h-5 text-teal-500" />
                    GCR Data Shield
                  </CardTitle>
                  <Badge className={dsConfig.badgeClass}>
                    <Crown className="w-3 h-3 mr-1" />
                    {dsConfig.label}
                  </Badge>
                </div>
                <CardDescription>Personal data protection and removal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats && stats.brokersFound > 0 ? (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                          {stats.brokersFound} brokers have your data
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{stats.removalsComplete} removed</span>
                        <span>{stats.removalRequests - stats.removalsComplete} in progress</span>
                      </div>
                      {stats.removalRequests > 0 && (
                        <Progress
                          value={(stats.removalsComplete / Math.max(stats.brokersFound, 1)) * 100}
                          className="h-1.5 mt-2 [&>div]:bg-teal-500"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <Search className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                      <p className="text-sm text-muted-foreground">No scan results yet</p>
                      <Link href="/data-removal">
                        <Button variant="link" size="sm" className="text-xs mt-1" data-testid="link-run-first-scan">
                          Run your first data scan
                        </Button>
                      </Link>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Search className="w-4 h-4" /> Data Exposure Scan
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <EyeOff className="w-4 h-4" /> Automated Removal
                    </span>
                    {dsTier === "professional" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Fingerprint className="w-4 h-4" /> Identity Shield ({stats?.maskedIdentities || 0} active)
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                  {dsTier === "free" && (
                    <Link href="/data-shield-pricing">
                      <Button size="sm" className="w-full mt-2" data-testid="button-upgrade-datashield">
                        Upgrade Data Shield
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {stats && stats.recentScans.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card data-testid="card-recent-activity">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.recentScans.map((scan) => (
                      <div
                        key={scan.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border"
                        data-testid={`activity-scan-${scan.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            scan.result === "safe" || scan.result === "low"
                              ? "bg-green-500/10"
                              : scan.result === "high" || scan.result === "dangerous"
                              ? "bg-red-500/10"
                              : "bg-yellow-500/10"
                          }`}>
                            {scan.result === "safe" || scan.result === "low" ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : scan.result === "high" || scan.result === "dangerous" ? (
                              <XCircle className="w-4 h-4 text-red-500" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground capitalize">
                              {scan.type?.replace(/_/g, " ") || "Security Scan"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(scan.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className={
                            scan.result === "safe" || scan.result === "low"
                              ? "bg-green-500/10 text-green-700 dark:text-green-400"
                              : scan.result === "high" || scan.result === "dangerous"
                              ? "bg-red-500/10 text-red-700 dark:text-red-400"
                              : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                          }
                        >
                          {scan.result || "checked"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="grid lg:grid-cols-2 gap-4"
          >
            <RegionalThreatsCard className="h-full" />
            <ThreatIntelCard limit={4} />
          </motion.div>

          {(sgTier === "free" && dsTier === "free") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" data-testid="card-bundle-cta">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg font-bold text-foreground">Get complete protection</h3>
                      <p className="text-sm text-muted-foreground">
                        Bundle Scam Guard + Data Shield and save up to 40%. Protect your entire digital life.
                      </p>
                    </div>
                    <Link href="/pricing">
                      <Button data-testid="button-view-bundles">
                        View Bundle Deals
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
