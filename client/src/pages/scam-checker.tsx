"use client";

import { ScamChecker } from "@/components/scam-checker";
import { InlinePromoVideo } from "@/components/inline-promo-video";
import { ShareCallToAction } from "@/components/social-share";
import { AlertTriangle, Shield, Phone, Link2, MessageSquare, CheckCircle, TrendingUp, TrendingDown, Minus, ArrowLeft, Megaphone, Globe, Bell, Chrome, ThumbsUp, Rss } from "lucide-react";
import { Link } from "@/lib/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { detectUserRegion, getRegionInfo, type Region } from "@/lib/region-detect";
import { TechPatternBg } from "@/components/tech-pattern-bg";
import { RelatedResources, RESOURCE_LINKS } from "@/components/related-resources";
import { useToast } from "@/hooks/use-toast";
import { useRecaptcha } from "@/hooks/use-recaptcha";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

interface ScamTrend {
  scamType: string;
  count: number;
  trend: string;
}

export default function ScamCheckerPage() {
  const { toast } = useToast();
  const [extensionEmail, setExtensionEmail] = useState("");
  const [formTimestamp, setFormTimestamp] = useState<number>(0);
  const { getRecaptchaToken } = useRecaptcha();

  const [userRegion, setUserRegion] = useState<Region | null>(null);
  
  useEffect(() => {
    setFormTimestamp(Date.now());
    const cached = localStorage.getItem('user_region');
    if (cached) {
      setUserRegion(cached as Region);
    }
    detectUserRegion().then(setUserRegion);
  }, []);

  const regionInfo = getRegionInfo(userRegion || 'global');

  const { data: scamOfWeekData } = useQuery({
    queryKey: ["/api/scam-of-week"],
  });

  const { data: scamFeed } = useQuery({
    queryKey: ["/api/scam-feed"],
    queryFn: () => fetch("/api/scam-feed?limit=5").then(r => r.json()),
  });

  const extensionSignup = useMutation({
    mutationFn: async (email: string) => {
      const recaptchaToken = await getRecaptchaToken('newsletter_subscribe');
      return apiRequest("POST", "/api/newsletter/subscribe", { email, recaptchaToken, _timestamp: formTimestamp.toString() });
    },
    onSuccess: () => {
      toast({ title: "You're on the list!", description: "We'll notify you when the browser extension launches." });
      setExtensionEmail("");
    },
    onError: () => {
      toast({ title: "Already subscribed", description: "This email is already on our notification list." });
    },
  });

  const { data: trends, isLoading: trendsLoading } = useQuery<ScamTrend[]>({
    queryKey: [`/api/scam-trends?region=${userRegion}`],
    enabled: !!userRegion,
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'falling': return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <Minus className="h-4 w-4 text-slate-400" />;
    }
  };

  const formatScamType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <main id="main-content" tabIndex={-1} className="relative min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      <Navigation />
      <TechPatternBg variant="radar" />
      
      {/* Back Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-3">
          <Link to="/tools" className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Tools
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          {/* Intro Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full mb-4">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">AI-Powered Scam Detection</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Is It a Scam? Check Before You Click
            </h1>
            <div className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto space-y-3 text-sm md:text-base">
              <p>
                Ever clicked a shortened link and hesitated because you weren't sure where it would lead? <strong className="text-slate-700 dark:text-slate-300">GCR Scam Guard reveals the link's true destination</strong> before you open it, helping you avoid malicious sites that can steal your information or infect your device with malware.
              </p>
              <p>
                You can also <strong className="text-slate-700 dark:text-slate-300">check suspicious phone numbers</strong>. Paste the number to see whether it's associated with known scam patterns.
              </p>
              <p>
                Not sure if a message, link, or call is a scam? <strong className="text-slate-700 dark:text-slate-300">Describe the situation</strong>, and we'll help you assess whether you're being targeted.
              </p>
            </div>
          </div>

          <div className="mb-12">
            <InlinePromoVideo
              src="/videos/guides/scam_checker_explainer.mp4"
              heading="See How GCR Scam Guard Works"
              description="Watch how our AI instantly detects suspicious links, phone numbers, and scam messages before they can harm you."
              className="max-w-3xl mx-auto"
            />
          </div>

          <ScamChecker />

          {/* What Our Tool Checks Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-8">
              What Our GCR Scam Guard Analyzes
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Link2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">Suspicious Links</h3>
                  <p className="text-sm text-muted-foreground">
                    We expand shortened URLs (bit.ly, tinyurl) to reveal their true destination. We also check for typosquatting domains like "paypa1.com" that mimic legitimate sites, suspicious file extensions, and known malicious patterns.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">Phone Numbers</h3>
                  <p className="text-sm text-muted-foreground">
                    We identify the country of origin, detect premium-rate numbers that charge excessive fees, and flag patterns commonly used by scam call centers such as repeated digits or suspicious sequences.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">Suspicious Messages</h3>
                  <p className="text-sm text-muted-foreground">
                    Describe any suspicious situation and our AI analyzes it for known scam patterns. We detect romance scams, tech support fraud, investment schemes, mobile money fraud (M-Pesa, MTN), and more.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Common Scam Types Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-8">
              Common Scams We Help You Avoid
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  Phishing & Impersonation
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Bank impersonation:</strong> Fake messages claiming your account is locked</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Government scams:</strong> IRS, immigration, or law enforcement threats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Delivery scams:</strong> Fake package tracking links from "FedEx" or "UPS"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Tech support:</strong> Pop-ups claiming your computer is infected</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-500" />
                  Financial & Social Fraud
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Romance scams:</strong> Online relationships that suddenly need money</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Investment fraud:</strong> "Guaranteed returns" on crypto or stocks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Mobile money fraud:</strong> M-Pesa, MTN, Airtel Money transfer scams</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Job scams:</strong> Fake remote work opportunities requiring upfront payment</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-8">
              How Our GCR Scam Guard Works
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">1</div>
                  <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">Paste or Describe</h3>
                  <p className="text-sm text-muted-foreground">Enter a suspicious link, phone number, or describe the situation you're uncertain about.</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">2</div>
                  <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">Instant Analysis</h3>
                  <p className="text-sm text-muted-foreground">Our system checks against known scam patterns, expands shortened URLs, and analyzes for red flags.</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">3</div>
                  <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">Get Your Result</h3>
                  <p className="text-sm text-muted-foreground">Receive a clear risk assessment with specific reasons and recommended actions to stay safe.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Trending Scams Section */}
          {(trendsLoading || !userRegion || (trends && trends.length > 0)) && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-4">
                {userRegion ? `Trending Scams in ${regionInfo.adjective} Region` : 'Trending Scams This Week'}
              </h2>
              <p className="text-center text-muted-foreground mb-8 text-sm">
                Based on reports from {!userRegion || userRegion === 'global' ? 'users worldwide' : `users in your area`}. Stay alert to these common threats.
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {(trendsLoading || !userRegion) ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i} className="bg-white dark:bg-slate-800">
                      <CardContent className="p-4">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-6 w-12" />
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  trends?.map((trend, i) => (
                    <Card key={i} className="bg-white dark:bg-slate-800 border-0 shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {formatScamType(trend.scamType)}
                          </span>
                          {getTrendIcon(trend.trend)}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-slate-900 dark:text-white">
                            {trend.count}
                          </span>
                          <Badge variant={trend.trend === 'rising' ? 'destructive' : trend.trend === 'falling' ? 'secondary' : 'outline'} className="text-xs">
                            {trend.trend === 'rising' ? 'Rising' : trend.trend === 'falling' ? 'Falling' : 'Stable'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </section>
          )}

          {scamOfWeekData && (
            <section className="mt-16" data-testid="section-scam-of-week">
              <Card className="border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center flex-shrink-0">
                      <Megaphone className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-orange-900 dark:text-orange-100">Scam of the Week</h3>
                        <Badge className="bg-orange-500 text-white">{(scamOfWeekData as any).scamType}</Badge>
                      </div>
                      <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">{(scamOfWeekData as any).title}</h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">{(scamOfWeekData as any).description}</p>
                      {(scamOfWeekData as any).exampleMessage && (
                        <div className="p-3 bg-white/60 dark:bg-black/20 rounded-lg border border-orange-200 dark:border-orange-700 mb-3">
                          <p className="text-xs text-muted-foreground mb-1">Example message:</p>
                          <p className="text-sm italic">"{(scamOfWeekData as any).exampleMessage}"</p>
                        </div>
                      )}
                      <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-xs font-semibold text-green-800 dark:text-green-200 mb-1">Tips to stay safe:</p>
                        <p className="text-sm text-green-700 dark:text-green-300">{(scamOfWeekData as any).tips}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {scamFeed && (scamFeed as any).communityReports?.length > 0 && (
            <section className="mt-16" data-testid="section-live-scam-feed">
              <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-4">
                <Rss className="w-6 h-6 inline-block mr-2 text-orange-500" />
                Live Scam Feed
              </h2>
              <p className="text-center text-muted-foreground mb-8 text-sm">
                Recent scams reported by the community. Stay informed about the latest threats.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(scamFeed as any).communityReports.slice(0, 6).map((report: any) => (
                  <Card key={report.id} className="bg-white dark:bg-slate-800 border-0 shadow-md" data-testid={`feed-report-${report.id}`}>
                    <CardContent className="p-4">
                      <p className="text-sm line-clamp-2 mb-2">{report.content}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">{report.reportType}</Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <ThumbsUp className="w-3 h-3" />
                          {report.votes} confirms
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          <section className="mt-16" data-testid="section-browser-extension">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mx-auto mb-4">
                  <Chrome className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">GCR Scam Guard Browser Extension</h3>
                <p className="text-blue-700 dark:text-blue-300 mb-4 max-w-lg mx-auto">
                  Protect yourself while you browse. Right-click any link to scan it instantly, get real-time warnings on suspicious pages, and receive Scam of the Week alerts right in your browser.
                </p>
                <div className="grid sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-6 text-left">
                  <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">Real-time Scanning</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Hover over links to see instant safety ratings</p>
                  </div>
                  <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">AI-Powered Analysis</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Right-click to deep scan any URL, text, or page</p>
                  </div>
                  <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">Threat Alerts</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Weekly scam alerts and community reports</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
                  <Link href="/browser-extension">
                    <Button className="gap-2 rounded-full" data-testid="button-extension-download">
                      <Chrome className="w-4 h-4" />
                      Get the Extension
                    </Button>
                  </Link>
                </div>
                <div className="border-t border-blue-200 dark:border-blue-700 pt-4 mt-4">
                  <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">Get notified about extension updates:</p>
                  <form
                    className="flex gap-2 max-w-sm mx-auto"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (extensionEmail) extensionSignup.mutate(extensionEmail);
                    }}
                  >
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={extensionEmail}
                      onChange={(e) => setExtensionEmail(e.target.value)}
                      className="bg-white dark:bg-slate-800"
                      data-testid="input-extension-email"
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={!extensionEmail || extensionSignup.isPending}
                      data-testid="button-extension-notify"
                    >
                      <Bell className="w-4 h-4 mr-1" />
                      Notify Me
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Share CTA */}
          <div className="mt-12">
            <ShareCallToAction />
          </div>
        </div>
      </div>

      <RelatedResources
        title="More Protection Tools"
        subtitle="Keep your digital life secure with these additional resources."
        resources={[
          RESOURCE_LINKS.phishingGuide,
          RESOURCE_LINKS.dataRemoval,
          RESOURCE_LINKS.breachDashboard,
          RESOURCE_LINKS.passwordGenerator,
          RESOURCE_LINKS.emergencyHelp,
          RESOURCE_LINKS.allGuides,
        ]}
      />
      <Footer />
    </main>
  );
}
