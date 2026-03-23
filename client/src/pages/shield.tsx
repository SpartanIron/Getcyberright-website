import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import {
  Shield,
  Search,
  Lock,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Eye,
  ShieldCheck,
} from "lucide-react";

function ShieldPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [scanId, setScanId] = useState<string | null>(null);
  const [pollStatus, setPollStatus] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      newErrors.email = "Please enter a valid email address";
    if (!consentGiven) newErrors.consent = "You must confirm this is your own personal information";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const scanMutation = useMutation({
    mutationFn: async () => {
      if (!validate()) throw new Error("Please fix the errors above");

      const res = await apiRequest("POST", "/api/scan", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || "",
        zip: zip.trim() || "",
        consentGiven: true,
      });
      return res.json();
    },
    onSuccess: (data: { scanId: string }) => {
      setScanId(data.scanId);
      setPollStatus("processing");
      startPolling(data.scanId);
    },
    onError: (error: Error) => {
      toast({
        title: "Scan could not start",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function startPolling(id: string) {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/scan/${id}/status`);
        const data = await res.json();

        if (data.status === "complete") {
          clearInterval(interval);
          setPollStatus("complete");
          setLocation(`/shield/results/${id}`);
        } else if (data.status === "failed") {
          clearInterval(interval);
          setPollStatus("failed");
          toast({
            title: "Scan could not be completed",
            description: data.error || "Please try again in a few minutes.",
            variant: "destructive",
          });
        }
      } catch {
        clearInterval(interval);
        setPollStatus("failed");
      }
    }, 3000);
  }

  const isSubmitting = scanMutation.isPending || pollStatus === "processing";

  return (
    <>
      <SEOHead
        title="GCR Shield - Check Your Data Exposure | GetCyberRight"
        description="GCR Shield scans data broker sites and breach databases to find your exposed personal information. Free, no account required."
      />
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="bg-gradient-to-br from-primary/5 via-background to-orange-50/30 dark:from-primary/10 dark:via-background dark:to-orange-950/10 py-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-3" data-testid="text-shield-title">
                GCR Shield
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                Find out if your personal information is on data broker sites or in data breaches.
                No account needed. Takes about 30 seconds.
              </p>
            </div>

            {isSubmitting ? (
              <Card>
                <CardContent className="py-12">
                  <div className="flex flex-col items-center gap-6 text-center">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                      <Search className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold mb-2" data-testid="text-scan-progress">
                        Checking data broker sites...
                      </p>
                      <p className="text-muted-foreground">
                        This takes about 30 seconds. We are searching people-search sites
                        and checking breach databases for your information.
                      </p>
                    </div>
                    <div className="w-full max-w-xs bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-1000"
                        style={{
                          width: pollStatus === "processing" ? "80%" : "40%",
                          animation: "pulse 2s ease-in-out infinite",
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Search className="h-5 w-5 text-primary" />
                    Enter Your Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="shield-first-name" className="text-sm font-medium block">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="shield-first-name"
                        placeholder="e.g. Sarah"
                        value={firstName}
                        onChange={(e) => { setFirstName(e.target.value); setErrors((p) => ({ ...p, firstName: "" })); }}
                        className={`min-h-[44px] text-base ${errors.firstName ? "border-red-500" : ""}`}
                        data-testid="input-shield-first-name"
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500 flex items-center gap-1" role="alert">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="shield-last-name" className="text-sm font-medium block">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="shield-last-name"
                        placeholder="e.g. Johnson"
                        value={lastName}
                        onChange={(e) => { setLastName(e.target.value); setErrors((p) => ({ ...p, lastName: "" })); }}
                        className={`min-h-[44px] text-base ${errors.lastName ? "border-red-500" : ""}`}
                        data-testid="input-shield-last-name"
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500 flex items-center gap-1" role="alert">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="shield-email" className="text-sm font-medium block">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="shield-email"
                      type="email"
                      placeholder="e.g. sarah@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                      className={`min-h-[44px] text-base ${errors.email ? "border-red-500" : ""}`}
                      data-testid="input-shield-email"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 flex items-center gap-1" role="alert">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="shield-phone" className="text-sm font-medium block">
                        Phone Number{" "}
                        <span className="text-muted-foreground font-normal">(include country code, e.g. +1 for US, +233 for Ghana)</span>
                      </label>
                      <Input
                        id="shield-phone"
                        type="tel"
                        placeholder="e.g. +1 555 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="min-h-[44px] text-base"
                        data-testid="input-shield-phone"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="shield-zip" className="text-sm font-medium block">
                        Zip or Postal Code{" "}
                        <span className="text-muted-foreground font-normal">(optional)</span>
                      </label>
                      <Input
                        id="shield-zip"
                        placeholder="e.g. 10001"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className="min-h-[44px] text-base"
                        data-testid="input-shield-zip"
                      />
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="shield-consent"
                        checked={consentGiven}
                        onCheckedChange={(checked) => {
                          setConsentGiven(checked === true);
                          setErrors((p) => ({ ...p, consent: "" }));
                        }}
                        className="mt-0.5 min-w-[20px] min-h-[20px]"
                        data-testid="checkbox-shield-consent"
                      />
                      <label
                        htmlFor="shield-consent"
                        className="text-sm leading-relaxed cursor-pointer select-none"
                      >
                        I confirm this is my own personal information or I have authorisation to
                        search on behalf of this person. <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {errors.consent && (
                      <p className="text-sm text-red-500 flex items-center gap-1 ml-7" role="alert">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {errors.consent}
                      </p>
                    )}
                  </div>

                  <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/20 rounded-lg p-3">
                    <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p>
                      We do not sell your data. Your scan results are deleted after 90 days
                      unless you create an account. Read our{" "}
                      <Link href="/privacy" className="underline text-primary hover:text-primary/80">
                        Privacy Policy
                      </Link>{" "}
                      and{" "}
                      <Link href="/terms" className="underline text-primary hover:text-primary/80">
                        Terms of Service
                      </Link>
                      .
                    </p>
                  </div>

                  <Button
                    onClick={() => scanMutation.mutate()}
                    disabled={isSubmitting}
                    className="w-full min-h-[48px] text-base font-medium"
                    size="lg"
                    data-testid="button-shield-scan"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Search className="h-5 w-5 mr-2" />
                    )}
                    {isSubmitting ? "Starting Scan..." : "Check My Exposure"}
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card border">
                <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">No Account Needed</p>
                  <p className="text-sm text-muted-foreground">Scan instantly, for free</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card border">
                <Eye className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">7 Broker Sites Checked</p>
                  <p className="text-sm text-muted-foreground">Plus breach databases</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card border">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Plain Language Results</p>
                  <p className="text-sm text-muted-foreground">Easy to understand</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ShieldPage;
