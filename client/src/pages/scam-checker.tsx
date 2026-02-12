import { useSEO } from "@/hooks/use-seo";
import { ScamChecker } from "@/components/scam-checker";
import { ShareCallToAction } from "@/components/social-share";
import { AlertTriangle, Shield, Phone, Link2, MessageSquare, CheckCircle, TrendingUp, TrendingDown, Minus, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { detectUserRegion, getRegionInfo, type Region } from "@/lib/region-detect";
import { TechPatternBg } from "@/components/tech-pattern-bg";

interface ScamTrend {
  scamType: string;
  count: number;
  trend: string;
}

export default function ScamCheckerPage() {
  useSEO({
    title: "Scam Checker - Verify Links & Messages | GetCyberRight",
    description: "Free scam detection tool. Check suspicious links, phone numbers, and messages instantly. Protect your family from fraud.",
    keywords: "scam checker, fraud detection, phishing detector, link checker, URL scanner, is it a scam, verify message, free scam checker"
  });

  const [userRegion, setUserRegion] = useState<Region | null>(null);
  
  useEffect(() => {
    const cached = localStorage.getItem('user_region');
    if (cached) {
      setUserRegion(cached as Region);
    }
    detectUserRegion().then(setUserRegion);
  }, []);

  const regionInfo = getRegionInfo(userRegion || 'global');

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
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      <TechPatternBg variant="radar" />
      
      {/* Back Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-3">
          <Link to="/protect" className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Protect
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Intro Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full mb-4">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Free Scam Detection Tool</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Is It a Scam? Check Before You Click
            </h1>
            <div className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto space-y-3 text-sm md:text-base">
              <p>
                Ever clicked a shortened link and hesitated because you weren't sure where it would lead? <strong className="text-slate-700 dark:text-slate-300">Scam Checker reveals the link's true destination</strong> before you open it, helping you avoid malicious sites that can steal your information or infect your device with malware.
              </p>
              <p>
                You can also <strong className="text-slate-700 dark:text-slate-300">check suspicious phone numbers</strong>. Paste the number to see whether it's associated with known scam patterns.
              </p>
              <p>
                Not sure if a message, link, or call is a scam? <strong className="text-slate-700 dark:text-slate-300">Describe the situation</strong>, and we'll help you assess whether you're being targeted.
              </p>
            </div>
          </div>

          <ScamChecker />

          {/* What Our Tool Checks Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-8">
              What Our Scam Checker Analyzes
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
              How Our Scam Checker Works
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

          {/* Share CTA */}
          <div className="mt-12">
            <ShareCallToAction />
          </div>
        </div>
      </div>
    </div>
  );
}
