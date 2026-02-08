<<<<<<< HEAD
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Shield, 
  Settings, 
  LogOut, 
  Crown,
  BookOpen,
  Video,
  FileText,
  ArrowRight,
  Lock
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { NotificationSettings } from "@/components/notification-settings";
import { RegionSelector, RegionalThreatsCard } from "@/components/region-selector";
import { ThreatIntelCard } from "@/components/threat-intel-card";

const premiumResources = [
  {
    title: "Advanced Phishing Analysis",
    description: "Deep dive into sophisticated phishing techniques",
    icon: Shield,
    tier: "essential"
  },
  {
    title: "Security Webinar Archive",
    description: "Access to all recorded security webinars",
    icon: Video,
    tier: "essential"
  },
  {
    title: "Employee Training Kit",
    description: "Complete training materials for your team",
    icon: BookOpen,
    tier: "professional"
  },
  {
    title: "Quarterly Security Reports",
    description: "Detailed threat landscape analysis",
    icon: FileText,
    tier: "professional"
  }
];

const tierBadgeColors: Record<string, string> = {
  free: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  essential: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  professional: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  enterprise: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
};

export default function Dashboard() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to access your dashboard.",
        variant: "destructive"
      });
      setTimeout(() => {
        setLocation("/login");
      }, 1000);
    }
  }, [isLoading, isAuthenticated, toast, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
=======
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Shield, 
  History, 
  Bell, 
  Settings, 
  Trash2,
  ExternalLink,
  LogIn,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Link2,
  Phone,
  MessageSquare,
  Mail,
  QrCode,
  Image
} from "lucide-react";
import { useSEO } from "@/hooks/use-seo";

interface SavedScan {
  id: string;
  type: 'url' | 'phone' | 'situation' | 'qr' | 'image' | 'email';
  input: string;
  riskLevel: string;
  timestamp: string;
}

const typeIcons: Record<string, any> = {
  url: Link2,
  phone: Phone,
  situation: MessageSquare,
  email: Mail,
  qr: QrCode,
  image: Image,
};

const riskColors: Record<string, { bg: string; text: string; icon: any }> = {
  safe: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", icon: ShieldCheck },
  low: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", icon: ShieldCheck },
  suspicious: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300", icon: ShieldAlert },
  medium: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300", icon: ShieldAlert },
  dangerous: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", icon: ShieldX },
  high: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", icon: ShieldX },
  unknown: { bg: "bg-slate-100 dark:bg-slate-700", text: "text-slate-700 dark:text-slate-300", icon: Shield },
};

export default function Dashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [savedScans, setSavedScans] = useState<SavedScan[]>([]);

  useSEO({
    title: "My Dashboard - GetCyberRight",
    description: "View your saved scam checks, manage alerts, and track your cyber safety history.",
  });

  useEffect(() => {
    const scans = JSON.parse(localStorage.getItem('savedScans') || '[]');
    setSavedScans(scans);
  }, []);

  const deleteScan = (id: string) => {
    const updated = savedScans.filter(s => s.id !== id);
    localStorage.setItem('savedScans', JSON.stringify(updated));
    setSavedScans(updated);
  };

  const clearAllScans = () => {
    localStorage.removeItem('savedScans');
    setSavedScans([]);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
      </div>
    );
  }

<<<<<<< HEAD
  if (!isAuthenticated || !user) {
    return null;
  }

  const userTier = (user as any).subscriptionTier || "free";
  const displayName = user.firstName 
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`
    : user.email || "Member";
  const initials = user.firstName 
    ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}`
    : (user.email ? user.email[0].toUpperCase() : 'U');

  const canAccess = (requiredTier: string) => {
    const tierHierarchy = ['free', 'essential', 'professional', 'enterprise'];
    return tierHierarchy.indexOf(userTier) >= tierHierarchy.indexOf(requiredTier);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.dashboard} />
      <Navigation />
      
      <main id="main-content" tabIndex={-1} className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
=======
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 py-12">
        <div className="container mx-auto px-4 max-w-md text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-4 bg-teal-100 dark:bg-teal-900/30 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Shield className="h-10 w-10 text-teal-600 dark:text-teal-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Sign In to Access Your Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-8">
              Create a free account to save your scam checks, get personalized alerts, and track your cyber safety history.
            </p>
            <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700">
              <a href="/api/login" className="flex items-center gap-2">
                <LogIn className="h-5 w-5" />
                Sign In with Replit
              </a>
            </Button>
            <p className="text-xs text-slate-500 mt-4">
              Free forever. No credit card required.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
<<<<<<< HEAD
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={user.profileImageUrl || undefined} alt={displayName} />
                      <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">
                        Welcome back, {user.firstName || 'Member'}
                      </h1>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={tierBadgeColors[userTier]}>
                          <Crown className="w-3 h-3 mr-1" />
                          {userTier.charAt(0).toUpperCase() + userTier.slice(1)} Plan
                        </Badge>
                        {user.email && (
                          <span className="text-sm text-muted-foreground">{user.email}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {userTier === "free" && (
                      <Link href="/pricing">
                        <Button>
                          Upgrade Plan
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    )}
                    <Button variant="outline" onClick={() => logout()}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Log Out
=======
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome back{user?.firstName ? `, ${user.firstName}` : ""}!
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Your personal cyber safety dashboard
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-1">
                    {savedScans.length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Saved Scans
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                    {savedScans.filter(s => ["dangerous", "high"].includes(s.riskLevel)).length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Threats Detected
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {savedScans.filter(s => ["safe", "low"].includes(s.riskLevel)).length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Safe Items
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5 text-teal-600" />
                      Saved Scam Checks
                    </CardTitle>
                    <CardDescription>
                      Your recent scam analysis history
                    </CardDescription>
                  </div>
                  {savedScans.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearAllScans}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {savedScans.length === 0 ? (
                  <div className="text-center py-12">
                    <Shield className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      No saved scans yet
                    </p>
                    <Button asChild variant="outline">
                      <Link to="/scam-checker">
                        Start Checking
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedScans.map((scan) => {
                      const TypeIcon = typeIcons[scan.type] || Shield;
                      const risk = riskColors[scan.riskLevel] || riskColors.unknown;
                      const RiskIcon = risk.icon;
                      return (
                        <div 
                          key={scan.id}
                          className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                        >
                          <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <TypeIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 dark:text-white truncate">
                              {scan.input}
                            </p>
                            <p className="text-xs text-slate-500">
                              {scan.type.charAt(0).toUpperCase() + scan.type.slice(1)} • {new Date(scan.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={`${risk.bg} ${risk.text} flex items-center gap-1`}>
                            <RiskIcon className="h-3 w-3" />
                            {scan.riskLevel}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteScan(scan.id)}
                            className="h-8 w-8 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 grid md:grid-cols-2 gap-4"
          >
            <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-teal-200 dark:border-teal-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-teal-100 dark:bg-teal-900/50 rounded-lg">
                    <Bell className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      Scam Alerts
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                      Get notified about new scams targeting your region.
                    </p>
                    <Button asChild size="sm" variant="outline">
                      <Link to="/preferences">
                        Manage Alerts
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                    <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      Preferences
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                      Customize your experience and notification settings.
                    </p>
                    <Button asChild size="sm" variant="outline">
                      <Link to="/preferences">
                        Edit Settings
                      </Link>
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
<<<<<<< HEAD

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full hover-elevate">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Security Tools</CardTitle>
                  <CardDescription>Access your protection tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/tools">
                    <Button variant="outline" className="w-full">
                      Open Tools
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full hover-elevate">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Learning Resources</CardTitle>
                  <CardDescription>Guides and tutorials</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/resources">
                    <Button variant="outline" className="w-full">
                      Browse Resources
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full hover-elevate">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Account Settings</CardTitle>
                  <CardDescription>Manage your profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/pricing">
                    <Button variant="outline" className="w-full">
                      Manage Plan
                      <Settings className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <RegionSelector className="h-full" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <RegionalThreatsCard className="h-full" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mb-6"
          >
            <ThreatIntelCard limit={4} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Premium Resources</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {premiumResources.map((resource) => {
                const hasAccess = canAccess(resource.tier);
                return (
                  <Card 
                    key={resource.title} 
                    className={`${!hasAccess ? 'opacity-75' : 'hover-elevate'}`}
                  >
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${hasAccess ? 'bg-primary/10' : 'bg-muted'}`}>
                        {hasAccess ? (
                          <resource.icon className="w-5 h-5 text-primary" />
                        ) : (
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground">{resource.title}</h3>
                          {!hasAccess && (
                            <Badge variant="outline" className="text-xs">
                              {resource.tier.charAt(0).toUpperCase() + resource.tier.slice(1)}+
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                        {!hasAccess && (
                          <Link href="/pricing" className="text-sm text-primary hover:underline mt-2 inline-block">
                            Upgrade to access
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-8"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Notification Preferences</h2>
            <NotificationSettings />
          </motion.div>
        </div>
      </main>
      
      <Footer />
=======
        </div>
      </section>
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
    </div>
  );
}
