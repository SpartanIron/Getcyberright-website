"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Bell, Mail, Shield, Baby, Heart, CheckCircle2, Calendar, Globe, AlertTriangle, MapPin } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useRecaptcha } from "@/hooks/use-recaptcha";

const subscriptionFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  audience: z.enum(["youth", "senior", "all"] as const, {
    message: "Please select an audience",
  }),
  frequency: z.enum(["daily", "thrice_weekly", "weekly"]).optional(),
  region: z.enum(["global", "north_america", "europe", "asia_pacific", "africa", "latin_america", "middle_east"]).optional(),
  country: z.string().optional(),
  alertPriority: z.enum(["all", "essentials_only"]).optional(),
});

type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;

const countriesByRegion: Record<string, { code: string; name: string }[]> = {
  north_america: [
    { code: "us", name: "United States" },
    { code: "ca", name: "Canada" },
    { code: "mx", name: "Mexico" },
  ],
  europe: [
    { code: "uk", name: "United Kingdom" },
    { code: "de", name: "Germany" },
    { code: "fr", name: "France" },
    { code: "es", name: "Spain" },
    { code: "it", name: "Italy" },
    { code: "nl", name: "Netherlands" },
    { code: "be", name: "Belgium" },
    { code: "ch", name: "Switzerland" },
    { code: "at", name: "Austria" },
    { code: "se", name: "Sweden" },
    { code: "no", name: "Norway" },
    { code: "dk", name: "Denmark" },
    { code: "fi", name: "Finland" },
    { code: "ie", name: "Ireland" },
    { code: "pl", name: "Poland" },
    { code: "pt", name: "Portugal" },
  ],
  asia_pacific: [
    { code: "au", name: "Australia" },
    { code: "nz", name: "New Zealand" },
    { code: "jp", name: "Japan" },
    { code: "kr", name: "South Korea" },
    { code: "sg", name: "Singapore" },
    { code: "hk", name: "Hong Kong" },
    { code: "in", name: "India" },
    { code: "ph", name: "Philippines" },
    { code: "my", name: "Malaysia" },
    { code: "th", name: "Thailand" },
    { code: "id", name: "Indonesia" },
    { code: "vn", name: "Vietnam" },
  ],
  africa: [
    { code: "za", name: "South Africa" },
    { code: "ng", name: "Nigeria" },
    { code: "ke", name: "Kenya" },
    { code: "gh", name: "Ghana" },
    { code: "eg", name: "Egypt" },
    { code: "ma", name: "Morocco" },
    { code: "tz", name: "Tanzania" },
    { code: "ug", name: "Uganda" },
    { code: "et", name: "Ethiopia" },
    { code: "rw", name: "Rwanda" },
  ],
  latin_america: [
    { code: "br", name: "Brazil" },
    { code: "ar", name: "Argentina" },
    { code: "co", name: "Colombia" },
    { code: "cl", name: "Chile" },
    { code: "pe", name: "Peru" },
    { code: "ve", name: "Venezuela" },
    { code: "ec", name: "Ecuador" },
    { code: "gt", name: "Guatemala" },
    { code: "cu", name: "Cuba" },
    { code: "do", name: "Dominican Republic" },
    { code: "pr", name: "Puerto Rico" },
  ],
  middle_east: [
    { code: "ae", name: "United Arab Emirates" },
    { code: "sa", name: "Saudi Arabia" },
    { code: "il", name: "Israel" },
    { code: "tr", name: "Turkey" },
    { code: "qa", name: "Qatar" },
    { code: "kw", name: "Kuwait" },
    { code: "bh", name: "Bahrain" },
    { code: "om", name: "Oman" },
    { code: "jo", name: "Jordan" },
    { code: "lb", name: "Lebanon" },
  ],
};

export function DailyTipsSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [formTimestamp, setFormTimestamp] = useState<number>(0);
  const { toast } = useToast();
  const { getRecaptchaToken } = useRecaptcha();

  useEffect(() => {
    setFormTimestamp(Date.now());
  }, []);

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      email: "",
      audience: "all",
      frequency: "daily",
      region: "global",
      country: "all_region",
      alertPriority: "all",
    },
  });

  const selectedRegion = form.watch("region");
  const availableCountries = selectedRegion && selectedRegion !== "global" 
    ? countriesByRegion[selectedRegion] || [] 
    : [];
  
  // Reset country when region changes
  const handleRegionChange = (value: string, fieldOnChange: (value: string) => void) => {
    fieldOnChange(value);
    form.setValue("country", "all_region");
  };

  // Helper to get CSRF token - fetch from server if not in cookie
  const getCSRFToken = async () => {
    let match = document.cookie.match(/csrf_token=([^;]+)/);
    if (match) return match[1];
    
    // Fetch token from server if not in cookie
    try {
      const response = await fetch('/api/csrf-token', { credentials: 'include' });
      const data = await response.json();
      return data.csrfToken || '';
    } catch {
      return '';
    }
  };

  const subscribeMutation = useMutation({
    mutationFn: async (data: SubscriptionFormValues) => {
      const csrfToken = await getCSRFToken();
      const recaptchaToken = await getRecaptchaToken('daily_tips_subscribe');
      const response = await fetch("/api/daily-tips/subscribe", {
        method: "POST",
        body: JSON.stringify({ ...data, _timestamp: formTimestamp.toString(), recaptchaToken }),
        headers: { 
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken
        },
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Subscription failed");
      }
      return await response.json();
    },
    onSuccess: () => {
      setIsSubscribed(true);
      toast({
        title: "Subscribed!",
        description: "You'll receive daily safety tips in your inbox.",
      });
    },
    onError: (error: Error) => {
      const isAlreadySubscribed = error.message?.includes("already subscribed");
      if (isAlreadySubscribed) {
        setIsSubscribed(true);
        toast({
          title: "Already subscribed",
          description: "This email is already receiving our daily tips!",
        });
      } else {
        toast({
          title: "Subscription failed",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    },
  });

  const onSubmit = (data: SubscriptionFormValues) => {
    subscribeMutation.mutate(data);
  };

  if (isSubscribed) {
    return (
      <Card className="bg-gradient-to-br from-teal-50 to-amber-50 dark:from-teal-950/30 dark:to-amber-950/30 border-teal-200 dark:border-teal-800">
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-teal-600 dark:text-teal-400" />
          </div>
          <h3 className="text-xl font-bold text-teal-800 dark:text-teal-200 mb-2">
            You're All Set!
          </h3>
          <p className="text-teal-700 dark:text-teal-300 mb-4">
            Safety tips are on their way to your inbox.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsSubscribed(false);
              form.reset();
            }}
            className="text-teal-600 dark:text-teal-400 border-teal-300 dark:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/30"
          >
            Subscribe another email
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border-slate-200 dark:border-slate-700">
      <CardHeader className="text-center pb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bell className="w-7 h-7 text-white" />
        </div>
        <CardTitle className="text-xl md:text-2xl">Digital Safety Tips</CardTitle>
        <CardDescription className="text-base">
          Get cybersecurity tips delivered to your inbox
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        data-testid="input-daily-tips-email"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose your focus</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                    >
                      <div>
                        <RadioGroupItem value="youth" id="youth" className="peer sr-only" />
                        <Label
                          htmlFor="youth"
                          className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-teal-500 peer-data-[state=checked]:bg-teal-50 dark:peer-data-[state=checked]:bg-teal-950/30 cursor-pointer transition-all"
                          data-testid="radio-audience-youth"
                        >
                          <Baby className="w-6 h-6 mb-2 text-teal-600" />
                          <span className="text-sm font-medium">Youth Safety</span>
                          <span className="text-xs text-muted-foreground">Kids & teens</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem value="senior" id="senior" className="peer sr-only" />
                        <Label
                          htmlFor="senior"
                          className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-amber-500 peer-data-[state=checked]:bg-amber-50 dark:peer-data-[state=checked]:bg-amber-950/30 cursor-pointer transition-all"
                          data-testid="radio-audience-senior"
                        >
                          <Heart className="w-6 h-6 mb-2 text-amber-600" />
                          <span className="text-sm font-medium">Senior Safety</span>
                          <span className="text-xs text-muted-foreground">Scam protection</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem value="all" id="all" className="peer sr-only" />
                        <Label
                          htmlFor="all"
                          className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-950/30 cursor-pointer transition-all"
                          data-testid="radio-audience-all"
                        >
                          <Shield className="w-6 h-6 mb-2 text-blue-600" />
                          <span className="text-sm font-medium">All Tips</span>
                          <span className="text-xs text-muted-foreground">Everything</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    How often?
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || "daily"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Daily (every weekday)</SelectItem>
                      <SelectItem value="thrice_weekly">3x per week (Mon, Wed, Fri)</SelectItem>
                      <SelectItem value="weekly">Weekly (Mondays only)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Your region
                  </FormLabel>
                  <Select 
                    onValueChange={(value) => handleRegionChange(value, field.onChange)} 
                    defaultValue={field.value || "global"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your region" />
                      </SelectTrigger>
                    </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {availableCountries.length > 0 && (
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Your country <span className="text-muted-foreground font-normal">(optional)</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "all_region"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country for localized tips" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all_region">All countries in this region</SelectItem>
                        {availableCountries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="alertPriority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Alert level
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || "all"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose alert level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All alerts (stay fully informed)</SelectItem>
                      <SelectItem value="essentials_only">Essentials only (critical threats)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-teal-600 to-amber-600 hover:from-teal-700 hover:to-amber-700"
              disabled={subscribeMutation.isPending}
              data-testid="button-subscribe-daily-tips"
            >
              {subscribeMutation.isPending ? "Subscribing..." : "Subscribe to Daily Tips"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Unsubscribe anytime. We respect your privacy.
            </p>
            <p className="text-xs text-center text-muted-foreground/70 mt-2">
              This site is protected by reCAPTCHA and the Google{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Privacy Policy</a> and{' '}
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Terms of Service</a> apply.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
