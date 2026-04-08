"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Bell, Shield, Check, Loader2, Globe, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { apiRequest } from "@/lib/queryClient";

export default function PreferencesPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<"daily" | "thrice_weekly" | "weekly">("daily");
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [region, setRegion] = useState<string>("global");
  const [alertPriority, setAlertPriority] = useState<string>("all");
  const [lookupComplete, setLookupComplete] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const { toast } = useToast();

  const updateMutation = useMutation({
    mutationFn: async (data: { token: string; frequency?: string; weeklyDigest?: boolean; region?: string; alertPriority?: string }) => {
      return await apiRequest("/api/preferences/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Preferences Updated",
        description: "Your subscription settings have been saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Could not update your preferences. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleLookup = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to manage preferences.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLookingUp(true);
    try {
      // First get a token
      const lookupResponse = await apiRequest("/api/preferences/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      
      if (!lookupResponse.token) {
        toast({
          title: "Not Found",
          description: "No subscription found for this email address.",
          variant: "destructive"
        });
        return;
      }
      
      // Then fetch preferences with the token
      const prefsResponse = await apiRequest(`/api/preferences/${lookupResponse.token}`);
      
      setToken(lookupResponse.token);
      if (prefsResponse.dailyTips) {
        setFrequency(prefsResponse.dailyTips.frequency || 'daily');
        setRegion(prefsResponse.dailyTips.region || 'global');
        setAlertPriority(prefsResponse.dailyTips.alertPriority || 'all');
      }
      if (prefsResponse.newsletter) {
        setWeeklyDigest(prefsResponse.newsletter.weeklyDigest ?? true);
        // Use newsletter region/alertPriority if dailyTips doesn't have them
        if (!prefsResponse.dailyTips?.region && prefsResponse.newsletter.region) {
          setRegion(prefsResponse.newsletter.region);
        }
        if (!prefsResponse.dailyTips?.alertPriority && prefsResponse.newsletter.alertPriority) {
          setAlertPriority(prefsResponse.newsletter.alertPriority);
        }
      }
      setLookupComplete(true);
    } catch (error: any) {
      toast({
        title: "Lookup Failed",
        description: error.message || "Could not find your subscription. Please check your email.",
        variant: "destructive"
      });
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleSave = () => {
    if (!token) return;
    updateMutation.mutate({
      token,
      frequency,
      weeklyDigest,
      region,
      alertPriority
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 mb-4">
            <Mail className="w-8 h-8 text-teal-600 dark:text-teal-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Email Preferences
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Control how often you hear from us
          </p>
        </div>

        {!lookupComplete ? (
          <Card>
            <CardHeader>
              <CardTitle>Find Your Subscription</CardTitle>
              <CardDescription>
                Enter your email address to manage your preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleLookup} disabled={isLookingUp} className="w-full">
                  {isLookingUp ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Looking up...
                    </>
                  ) : (
                    "Manage My Preferences"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-teal-600" />
                  Digital Safety Tips
                </CardTitle>
                <CardDescription>
                  How often would you like to receive cyber safety tips?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={frequency} onValueChange={(v: "daily" | "thrice_weekly" | "weekly") => setFrequency(v)}>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily" className="flex-1 cursor-pointer">
                      <div className="font-medium">Daily</div>
                      <div className="text-sm text-slate-500">One tip every day</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                    <RadioGroupItem value="thrice_weekly" id="thrice_weekly" />
                    <Label htmlFor="thrice_weekly" className="flex-1 cursor-pointer">
                      <div className="font-medium">3 Times a Week</div>
                      <div className="text-sm text-slate-500">Monday, Wednesday, Friday</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly" className="flex-1 cursor-pointer">
                      <div className="font-medium">Weekly</div>
                      <div className="text-sm text-slate-500">Once a week summary</div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Your Region
                </CardTitle>
                <CardDescription>
                  Get cyber safety tips relevant to your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global (all regions)</SelectItem>
                    <SelectItem value="north_america">North America</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="asia_pacific">Asia-Pacific</SelectItem>
                    <SelectItem value="africa">Africa</SelectItem>
                    <SelectItem value="latin_america">Latin America</SelectItem>
                    <SelectItem value="middle_east">Middle East</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Alert Level
                </CardTitle>
                <CardDescription>
                  Control how many alerts you receive
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={alertPriority} onValueChange={setAlertPriority}>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                    <RadioGroupItem value="all" id="alert_all" />
                    <Label htmlFor="alert_all" className="flex-1 cursor-pointer">
                      <div className="font-medium">All Alerts</div>
                      <div className="text-sm text-slate-500">Stay fully informed about all cyber threats</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                    <RadioGroupItem value="essentials_only" id="alert_essentials" />
                    <Label htmlFor="alert_essentials" className="flex-1 cursor-pointer">
                      <div className="font-medium">Essentials Only</div>
                      <div className="text-sm text-slate-500">Only critical, high-impact threats (fewer emails)</div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-600" />
                  Weekly Fraud Alerts
                </CardTitle>
                <CardDescription>
                  Get a curated digest of the week's top cyber threats from trusted sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div>
                    <div className="font-medium">Receive Weekly Digest</div>
                    <div className="text-sm text-slate-500">
                      Real threats from FBI IC3, CISA, and INTERPOL
                    </div>
                  </div>
                  <Switch
                    checked={weeklyDigest}
                    onCheckedChange={setWeeklyDigest}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setLookupComplete(false)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="flex-1 bg-teal-600 hover:bg-teal-700"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Save Preferences
                  </>
                )}
              </Button>
            </div>

            <p className="text-center text-sm text-slate-500">
              Managing preferences for: <strong>{email}</strong>
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
