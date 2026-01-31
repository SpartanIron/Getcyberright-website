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
      </div>
    );
  }

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
      
      <main tabIndex={-1} className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
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
                        Welcome to Your Protection Hub, {user.firstName || 'Member'}
                      </h1>
                      <p className="text-sm text-muted-foreground mt-1 mb-2">
                        GetCyberRight stands between you and the risks you should not have to face alone.
                      </p>
                      <div className="flex items-center gap-2">
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
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

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
    </div>
  );
}
