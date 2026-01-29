import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { hasTierAccess, SUBSCRIPTION_TIERS } from "@shared/schema";
import { 
  Bell, 
  BellOff, 
  Shield, 
  AlertTriangle, 
  TrendingUp,
  Crown,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Link } from "wouter";

interface NotificationPreferences {
  threatAlerts: boolean;
  weeklyDigest: boolean;
  scamWarnings: boolean;
  securityTips: boolean;
}

const NOTIFICATION_PREFS_KEY = "getcyberright_notification_prefs";

export function NotificationSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    threatAlerts: true,
    weeklyDigest: true,
    scamWarnings: true,
    securityTips: false,
  });

  const isPremiumUser = user && hasTierAccess(user.subscriptionTier || "free", SUBSCRIPTION_TIERS.ESSENTIAL);

  useEffect(() => {
    setIsSupported("Notification" in window);
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }

    const savedPrefs = localStorage.getItem(NOTIFICATION_PREFS_KEY);
    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs));
      } catch (e) {
        console.error("Failed to parse notification preferences");
      }
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Your browser does not support push notifications.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        toast({
          title: "Notifications Enabled",
          description: "You will now receive security alerts.",
        });
        
        new Notification("GetCyberRight", {
          body: "Notifications are now enabled. Stay safe online!",
          icon: "/favicon.ico",
        });
      } else if (result === "denied") {
        toast({
          title: "Notifications Blocked",
          description: "Please enable notifications in your browser settings.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enable notifications.",
        variant: "destructive",
      });
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(newPrefs));
    
    toast({
      title: "Preferences Updated",
      description: `${key.replace(/([A-Z])/g, " $1").trim()} ${value ? "enabled" : "disabled"}.`,
    });
  };

  if (!isPremiumUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Push Notifications
            <Badge variant="secondary" className="ml-2">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </CardTitle>
          <CardDescription>
            Get real-time alerts about new threats and security tips
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <BellOff className="w-8 h-8 text-primary" />
            </div>
            <h4 className="font-semibold mb-2">Upgrade to Premium</h4>
            <p className="text-muted-foreground text-sm mb-4 max-w-sm mx-auto">
              Get instant alerts when new scams are detected and receive weekly security digests.
            </p>
            <Link href="/pricing">
              <Button data-testid="button-upgrade-notifications">
                <Crown className="w-4 h-4 mr-2" />
                View Premium Plans
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Manage your notification preferences for security alerts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            {permission === "granted" ? (
              <CheckCircle2 className="w-5 h-5 text-accent" />
            ) : permission === "denied" ? (
              <XCircle className="w-5 h-5 text-destructive" />
            ) : (
              <Bell className="w-5 h-5 text-muted-foreground" />
            )}
            <div>
              <p className="font-medium">Browser Notifications</p>
              <p className="text-sm text-muted-foreground">
                {permission === "granted"
                  ? "Enabled - you will receive alerts"
                  : permission === "denied"
                  ? "Blocked - enable in browser settings"
                  : "Not enabled - click to enable"}
              </p>
            </div>
          </div>
          {permission !== "granted" && (
            <Button
              onClick={requestPermission}
              variant={permission === "denied" ? "outline" : "default"}
              data-testid="button-enable-notifications"
            >
              {permission === "denied" ? "Retry" : "Enable"}
            </Button>
          )}
        </div>

        {permission === "granted" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <div>
                  <Label htmlFor="threat-alerts" className="font-medium">
                    Threat Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Immediate alerts for critical security threats
                  </p>
                </div>
              </div>
              <Switch
                id="threat-alerts"
                checked={preferences.threatAlerts}
                onCheckedChange={(checked) => updatePreference("threatAlerts", checked)}
                data-testid="switch-threat-alerts"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <Label htmlFor="scam-warnings" className="font-medium">
                    Scam Warnings
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Alerts about new scam patterns and tactics
                  </p>
                </div>
              </div>
              <Switch
                id="scam-warnings"
                checked={preferences.scamWarnings}
                onCheckedChange={(checked) => updatePreference("scamWarnings", checked)}
                data-testid="switch-scam-warnings"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-accent" />
                <div>
                  <Label htmlFor="weekly-digest" className="font-medium">
                    Weekly Digest
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Weekly summary of threats and security tips
                  </p>
                </div>
              </div>
              <Switch
                id="weekly-digest"
                checked={preferences.weeklyDigest}
                onCheckedChange={(checked) => updatePreference("weeklyDigest", checked)}
                data-testid="switch-weekly-digest"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="security-tips" className="font-medium">
                    Daily Security Tips
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Quick tips to improve your online safety
                  </p>
                </div>
              </div>
              <Switch
                id="security-tips"
                checked={preferences.securityTips}
                onCheckedChange={(checked) => updatePreference("securityTips", checked)}
                data-testid="switch-security-tips"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
