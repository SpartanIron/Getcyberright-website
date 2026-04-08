"use client";

import { useEffect } from "react";
import { FadeIn } from "@/components/fade-in";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Shield, Download, Loader2, Database } from "lucide-react";
import { Link, useSearch } from "@/lib/navigation";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export default function CheckoutSuccess() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const sessionId = params.get("session_id");

  const { data: checkoutData, isLoading, isError } = useQuery<{
    status: string;
    tier: string;
    product: string;
    subscriptionId: string;
  }>({
    queryKey: ["/api/stripe/checkout-status", sessionId],
    queryFn: async () => {
      const res = await fetch(`/api/stripe/checkout-status?session_id=${sessionId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to verify checkout");
      return res.json();
    },
    enabled: !!sessionId,
    retry: 1,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (checkoutData?.status === "paid") {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription/status"] });
    }
  }, [checkoutData]);

  const isShield = checkoutData?.product === "shield";
  const isBundle = checkoutData?.product === "bundle";
  const tierName = isBundle
    ? (checkoutData?.tier === "total" ? "Total Protection" : "Complete Protection")
    : isShield
      ? (checkoutData?.tier === "professional" ? "Professional" : "Essential")
      : (checkoutData?.tier === "professional" ? "Family" : "Pro");
  const productName = isBundle ? "GetCyberRight" : isShield ? "GCR Data Shield" : "GCR Scam Guard";
  const isPaid = checkoutData?.status === "paid";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.checkoutSuccess} />
      <Navigation />

      <main id="main-content" tabIndex={-1} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <Card>
              <CardContent className="p-8 text-center">
                {isLoading ? (
                  <div className="py-8" data-testid="checkout-loading">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-foreground mb-2">Confirming your subscription...</h2>
                    <p className="text-muted-foreground">This will only take a moment.</p>
                  </div>
                ) : isError || (!sessionId && !checkoutData) ? (
                  <div className="py-8" data-testid="checkout-error">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">Could not verify your checkout</h1>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      If you just completed a payment, your subscription may still be processing. Check your dashboard or email for confirmation.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href="/dashboard">
                        <Button size="lg" data-testid="button-error-dashboard">
                          Go to Dashboard
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <Link href="/gcr-guard-pricing">
                        <Button size="lg" variant="outline" data-testid="button-error-pricing">
                          View Plans
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>

                    <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="heading-success">
                      {isPaid ? `Welcome to ${productName} ${tierName}!` : "Welcome to GetCyberRight!"}
                    </h1>

                    <p className="text-muted-foreground mb-6 max-w-md mx-auto" data-testid="text-description">
                      {isPaid
                        ? `Your ${productName} ${tierName} subscription is now active. You have full access to all ${tierName} features.`
                        : "Your subscription is now active. You have full access to premium security tools, training materials, and exclusive content."
                      }
                    </p>

                    <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left max-w-sm mx-auto" data-testid="next-steps-box">
                      <h3 className="font-semibold text-sm text-foreground mb-3">What to do next:</h3>
                      {isBundle ? (
                        <ol className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-primary">1.</span>
                            Install the GCR Scam Guard browser extension
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-primary">2.</span>
                            Run a Data Shield scan to find your exposed data
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-primary">3.</span>
                            Sign in to the extension and track removals from your dashboard
                          </li>
                        </ol>
                      ) : isShield ? (
                        <ol className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-primary">1.</span>
                            Run a Data Shield scan to find your exposed data
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-primary">2.</span>
                            Review your results and start automated removals
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-primary">3.</span>
                            Track removal progress from your dashboard
                          </li>
                        </ol>
                      ) : (
                        <ol className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-primary">1.</span>
                            Install the GCR Scam Guard browser extension
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-primary">2.</span>
                            Sign in through the extension to activate your features
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-primary">3.</span>
                            Browse with confidence knowing you're protected
                          </li>
                        </ol>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {isBundle ? (
                        <>
                          <Link href="/browser-extension">
                            <Button size="lg" data-testid="button-get-extension">
                              <Download className="w-4 h-4 mr-2" />
                              Get the Extension
                            </Button>
                          </Link>
                          <Link href="/shield">
                            <Button size="lg" variant="outline" data-testid="button-start-scan">
                              <Database className="w-4 h-4 mr-2" />
                              Run a Scan
                            </Button>
                          </Link>
                        </>
                      ) : isShield ? (
                        <>
                          <Link href="/shield">
                            <Button size="lg" data-testid="button-start-scan">
                              <Database className="w-4 h-4 mr-2" />
                              Start a Scan
                            </Button>
                          </Link>
                          <Link href="/dashboard">
                            <Button size="lg" variant="outline" data-testid="button-dashboard">
                              Go to Dashboard
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link href="/browser-extension">
                            <Button size="lg" data-testid="button-get-extension">
                              <Download className="w-4 h-4 mr-2" />
                              Get the Extension
                            </Button>
                          </Link>
                          <Link href="/dashboard">
                            <Button size="lg" variant="outline" data-testid="button-dashboard">
                              Go to Dashboard
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="mt-6 text-sm text-muted-foreground">
                      <p>A confirmation email has been sent to your inbox.</p>
                      <p className="mt-1">
                        Need help?{" "}
                        <a
                          href="mailto:info@getcyberright.com"
                          className="text-primary hover:underline"
                        >
                          Contact Support
                        </a>
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </main>

      <Footer />
    </div>
  );
}
