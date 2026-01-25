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
      </div>
    );
  }

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
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
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
