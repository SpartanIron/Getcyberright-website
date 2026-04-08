"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { useRecaptcha } from "@/hooks/use-recaptcha";

interface UnifiedSubscribeProps {
  variant?: "default" | "compact" | "footer";
  showTitle?: boolean;
}

export function UnifiedSubscribe({ variant = "default", showTitle = true }: UnifiedSubscribeProps) {
  const [email, setEmail] = useState("");
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [dailyTips, setDailyTips] = useState(false);
  const [frequency, setFrequency] = useState("weekly");
  const [audience, setAudience] = useState("all");
  const [formTimestamp, setFormTimestamp] = useState<number>(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();
  const { getRecaptchaToken } = useRecaptcha();

  useEffect(() => {
    setFormTimestamp(Date.now());
  }, []);

  const getCSRFToken = async () => {
    let match = document.cookie.match(/csrf_token=([^;]+)/);
    if (match) return match[1];
    try {
      const response = await fetch('/api/csrf-token', { credentials: 'include' });
      const data = await response.json();
      return data.csrfToken || '';
    } catch {
      return '';
    }
  };

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      const csrfToken = await getCSRFToken();
      const recaptchaToken = await getRecaptchaToken('subscribe');
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken
        },
        body: JSON.stringify({ 
          email, 
          weeklyDigest,
          dailyTips,
          tipsFrequency: dailyTips ? frequency : undefined,
          audience: dailyTips ? audience : undefined,
          _timestamp: formTimestamp.toString(), 
          recaptchaToken 
        }),
        credentials: "include"
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Subscription failed");
      }
      return await response.json();
    },
    onSuccess: () => {
      setIsSubscribed(true);
      toast({
        title: "Successfully subscribed!",
        description: getSuccessMessage(),
      });
      setEmail("");
    },
    onError: (error: Error) => {
      const isAlreadySubscribed = error.message?.includes("already subscribed");
      toast({
        title: isAlreadySubscribed ? "Already subscribed" : "Subscription failed",
        description: isAlreadySubscribed 
          ? "This email is already on our list!"
          : "Please check your email and try again.",
        variant: isAlreadySubscribed ? "default" : "destructive",
      });
    },
  });

  const getSuccessMessage = () => {
    if (weeklyDigest && dailyTips) {
      return "You'll receive our Weekly Digest and Daily Safety Tips.";
    } else if (weeklyDigest) {
      return "You'll receive our Weekly Fraud Alerts.";
    } else if (dailyTips) {
      return "You'll receive Daily Safety Tips.";
    }
    return "You're all set!";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    if (!weeklyDigest && !dailyTips) {
      toast({
        title: "Select at least one",
        description: "Please choose at least one subscription option.",
        variant: "destructive",
      });
      return;
    }
    subscribeMutation.mutate();
  };

  if (isSubscribed) {
    return (
      <div className="text-center py-6">
        <CheckCircle className="w-12 h-12 text-teal-500 mx-auto mb-3" />
        <p className="font-medium text-lg">You're subscribed!</p>
        <p className="text-sm text-muted-foreground mt-1">{getSuccessMessage()}</p>
        <Button variant="link" onClick={() => setIsSubscribed(false)} className="mt-2">
          Subscribe another email
        </Button>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
            disabled={subscribeMutation.isPending}
          />
          <Button 
            type="submit" 
            disabled={subscribeMutation.isPending}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {subscribeMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Subscribe"
            )}
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox 
              checked={weeklyDigest} 
              onCheckedChange={(checked) => setWeeklyDigest(!!checked)}
              className="border-white/40 data-[state=checked]:bg-teal-600"
            />
            <span className="text-slate-300">Weekly Fraud Alerts</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox 
              checked={dailyTips} 
              onCheckedChange={(checked) => setDailyTips(!!checked)}
              className="border-white/40 data-[state=checked]:bg-teal-600"
            />
            <span className="text-slate-300">Daily Safety Tips</span>
          </label>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="text-center mb-6">
          <Mail className="w-10 h-10 text-teal-600 mx-auto mb-3" />
          <h3 className="text-xl font-semibold">Stay Protected</h3>
          <p className="text-muted-foreground">Get cyber safety updates delivered to your inbox</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="subscribe-email">Email Address</Label>
          <Input
            id="subscribe-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={subscribeMutation.isPending}
          />
        </div>

        <div className="space-y-3">
          <Label>What would you like to receive?</Label>
          <div className="space-y-2">
            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <Checkbox 
                checked={weeklyDigest} 
                onCheckedChange={(checked) => setWeeklyDigest(!!checked)}
                className="mt-0.5"
              />
              <div>
                <span className="font-medium">Weekly Fraud Alerts</span>
                <p className="text-sm text-muted-foreground">
                  Curated digest of the week's biggest cyber threats and how to avoid them
                </p>
              </div>
            </label>
            
            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <Checkbox 
                checked={dailyTips} 
                onCheckedChange={(checked) => setDailyTips(!!checked)}
                className="mt-0.5"
              />
              <div>
                <span className="font-medium">Daily Safety Tips</span>
                <p className="text-sm text-muted-foreground">
                  Quick, actionable tips to keep your family safe online
                </p>
              </div>
            </label>
          </div>
        </div>

        {dailyTips && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
            <p className="text-sm font-medium">Customize your tips:</p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>How often?</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Who are you protecting?</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Everyone</SelectItem>
                    <SelectItem value="youth">Kids & Teens</SelectItem>
                    <SelectItem value="seniors">Seniors</SelectItem>
                    <SelectItem value="parents">Parents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800"
          disabled={subscribeMutation.isPending}
        >
          {subscribeMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Subscribing...
            </>
          ) : (
            "Subscribe"
          )}
        </Button>
        
        <p className="text-xs text-center text-muted-foreground">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
}
