import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { InlinePromoVideo } from "@/components/inline-promo-video";
import { PasswordGenerator } from "@/components/password-generator";
import { ScamChecker } from "@/components/scam-checker";
import { AudioDeepfakeDetector } from "@/components/audio-deepfake-detector";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { StructuredData } from "@/components/structured-data";
import type { WebApplicationData, BreadcrumbData } from "@/components/structured-data";
import {
  Shield,
  ShieldCheck,
  Search,
  Lock,
  AlertTriangle,
  ArrowRight,
  Chrome,
  Radio,
  Trash2,
  ShieldAlert,
  ClipboardCheck,
  Baby,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import bannerImage from "@/assets/banners/tools-banner.png";

const scamGuardTools = [
  { title: "Browser Extension", description: "12 protection features including notification blocking, search safety badges, redirect detection, and clipboard protection. Install on Chrome, Edge, Brave, or Opera.", href: "/browser-extension", icon: Chrome, badge: "Free + Pro" },
  { title: "Report a Scam", description: "Spotted a scam? Report it to help protect the entire GetCyberRight community. Your report feeds our threat intelligence.", href: "/report-scam", icon: ShieldAlert },
  { title: "Password Generator", description: "Create strong, unique passwords with customizable length and complexity. Runs entirely in your browser.", icon: Lock, badge: "Free", inline: "password" as const },
  { title: "Voice Deepfake Detector", description: "Upload an audio clip to detect signs of AI-generated voice cloning. Useful for verifying suspicious voicemails or calls.", icon: Radio, badge: "Free", inline: "voice-clone" as const },
];

const dataShieldTools = [
  { title: "Data Exposure Scan", description: "Find your personal information across 500+ data broker sites and breach databases. See exactly who has your data.", href: "/shield", icon: ShieldCheck, badge: "Free" },
  { title: "Data Removal Center", description: "Remove your data from brokers with guided self-removal, automated opt-outs, and continuous monitoring. Includes Identity Shield and Personal Vault.", href: "/data-removal", icon: Trash2 },
  { title: "Breach Monitor", description: "Get alerted immediately when your email or personal data appears in a new data breach.", href: "/breach-dashboard", icon: AlertTriangle },
  { title: "Safety Score Assessment", description: "Answer a few quick questions about your digital habits and get a personalized safety score with actionable recommendations.", href: "/quick-assessment", icon: ClipboardCheck, badge: "Free" },
  { title: "Cyber Hygiene Checklist", description: "A practical daily checklist of security habits. Track your progress and build a safer routine over time.", href: "/cyber-hygiene", icon: Shield, badge: "Free" },
  { title: "Child Safety Scanner", description: "Check if websites, apps, and online services are safe for your children. Designed for parents and guardians.", href: "/parents/child-safety-scanner", icon: Baby, badge: "Free" },
];

export default function Tools() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tabParam = params.get("tab");

  const [activeProduct, setActiveProduct] = useState<"scam-guard" | "data-shield">("scam-guard");
  const [inlineTool, setInlineTool] = useState<"scanner" | "password" | "voice-clone">("scanner");
  const [showAllScamGuard, setShowAllScamGuard] = useState(false);
  const [showAllDataShield, setShowAllDataShield] = useState(false);

  useEffect(() => {
    if (tabParam === "voice-clone") {
      setActiveProduct("scam-guard");
      setInlineTool("voice-clone");
    } else if (tabParam === "password" || tabParam === "safety-toolkit") {
      setActiveProduct("scam-guard");
      setInlineTool("password");
    }
  }, [tabParam]);

  useEffect(() => {
    if (window.location.hash === "#scam-checker") {
      setActiveProduct("scam-guard");
      setInlineTool("scanner");
      requestAnimationFrame(() => {
        const el = document.getElementById("inline-tool-area");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  const toolsSchemas: WebApplicationData[] = [
    {
      type: "WebApplication",
      name: "GCR Scam Guard",
      description: "AI-powered tool to check if URLs, emails, phone numbers, and QR codes are scams. Analyzes threats using multiple security engines.",
      url: "https://www.getcyberright.com/tools",
      applicationCategory: "SecurityApplication",
      provider: "GetCyberRight",
    },
    {
      type: "WebApplication",
      name: "GCR Data Shield - Personal Data Exposure Scanner",
      description: "Scan for your exposed personal information across data broker sites and breach databases. No account needed to get started.",
      url: "https://www.getcyberright.com/shield",
      applicationCategory: "SecurityApplication",
      provider: "GetCyberRight",
    },
  ];

  const toolsBreadcrumbs: BreadcrumbData = {
    type: "BreadcrumbList",
    items: [
      { name: "Home", url: "https://www.getcyberright.com/" },
      { name: "Protection Hub", url: "https://www.getcyberright.com/tools" },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.tools} />
      <StructuredData data={[...toolsSchemas, toolsBreadcrumbs]} />
      <Navigation />

      <main id="main-content" tabIndex={-1}>
        <PageBanner
          title="Protection Hub"
          subtitle="Two products, one mission: keeping your family safe online. Use our free tools to get started, or upgrade for full protection."
          imageSrc={bannerImage}
          imageAlt="Modern workspace with laptop displaying security checkmarks and password generator in bright natural light"
          imagePosition="left"
          colorVariant="teal"
        />

        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              <button
                onClick={() => { setActiveProduct("scam-guard"); setInlineTool("scanner"); }}
                className={`flex items-center gap-4 p-5 rounded-lg border-2 text-left transition-all ${
                  activeProduct === "scam-guard"
                    ? "border-accent bg-accent/5 shadow-sm"
                    : "border-border hover-elevate"
                }`}
                data-testid="product-scam-guard"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-base">GCR Scam Guard</p>
                    <Badge variant="outline" className="text-[10px] border-accent/30 text-accent no-default-hover-elevate no-default-active-elevate">Free + Pro</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">AI scam detection, browser extension, and community protection tools</p>
                </div>
              </button>

              <button
                onClick={() => setActiveProduct("data-shield")}
                className={`flex items-center gap-4 p-5 rounded-lg border-2 text-left transition-all ${
                  activeProduct === "data-shield"
                    ? "border-teal-500 bg-teal-500/5 shadow-sm"
                    : "border-border hover-elevate"
                }`}
                data-testid="product-data-shield"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-teal-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-base">GCR Data Shield</p>
                    <Badge variant="outline" className="text-[10px] border-teal-500/30 text-teal-500 no-default-hover-elevate no-default-active-elevate">Free + Premium</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Personal data removal, breach monitoring, and privacy protection tools</p>
                </div>
              </button>
            </div>

            {activeProduct === "scam-guard" && (
              <div className="space-y-8">
                <div id="inline-tool-area" className="scroll-mt-24">
                  <Tabs value={inlineTool} onValueChange={(v) => setInlineTool(v as any)}>
                    <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-6" data-testid="tabs-scam-guard-tools">
                      <TabsTrigger value="scanner" className="gap-1.5 text-xs sm:text-sm" data-testid="tab-scanner">
                        <Search className="w-4 h-4" />
                        <span>Scam Scanner</span>
                      </TabsTrigger>
                      <TabsTrigger value="password" className="gap-1.5 text-xs sm:text-sm" data-testid="tab-password">
                        <Lock className="w-4 h-4" />
                        <span>Passwords</span>
                      </TabsTrigger>
                      <TabsTrigger value="voice-clone" className="gap-1.5 text-xs sm:text-sm" data-testid="tab-voice-clone">
                        <Radio className="w-4 h-4" />
                        <span>Voice Check</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="scanner">
                      <div className="max-w-4xl mx-auto">
                        <ScamChecker />
                      </div>
                    </TabsContent>
                    <TabsContent value="password">
                      <div className="max-w-4xl mx-auto">
                        <PasswordGenerator />
                      </div>
                    </TabsContent>
                    <TabsContent value="voice-clone">
                      <div className="max-w-4xl mx-auto">
                        <AudioDeepfakeDetector />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">More Scam Guard Tools</h3>
                    <Link href="/gcr-guard-pricing">
                      <Button variant="outline" size="sm" data-testid="link-scam-guard-pricing">
                        View Plans <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(showAllScamGuard ? scamGuardTools : scamGuardTools.slice(0, 2)).map((tool) => (
                      <Card key={tool.title} className="hover-elevate" data-testid={`card-tool-${tool.title.toLowerCase().replace(/\s/g, "-")}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <tool.icon className="w-4.5 h-4.5 text-accent" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm">{tool.title}</h4>
                                {tool.badge && (
                                  <Badge variant="secondary" className="text-[10px] no-default-hover-elevate no-default-active-elevate">{tool.badge}</Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed mb-2.5">{tool.description}</p>
                              {tool.href ? (
                                <Link href={tool.href}>
                                  <Button variant="outline" size="sm" className="h-7 text-xs" data-testid={`button-tool-${tool.title.toLowerCase().replace(/\s/g, "-")}`}>
                                    Open <ArrowRight className="w-3 h-3 ml-1" />
                                  </Button>
                                </Link>
                              ) : tool.inline ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => {
                                    setInlineTool(tool.inline!);
                                    document.getElementById("inline-tool-area")?.scrollIntoView({ behavior: "smooth", block: "start" });
                                  }}
                                  data-testid={`button-tool-${tool.title.toLowerCase().replace(/\s/g, "-")}`}
                                >
                                  Try It Above <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                              ) : null}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {scamGuardTools.length > 2 && (
                    <button
                      onClick={() => setShowAllScamGuard(!showAllScamGuard)}
                      className="flex items-center gap-1.5 mx-auto mt-4 text-sm text-primary hover:underline"
                      data-testid="button-show-more-scam-guard"
                    >
                      {showAllScamGuard ? "Show less" : `Show ${scamGuardTools.length - 2} more tools`}
                      {showAllScamGuard ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeProduct === "data-shield" && (
              <div className="space-y-8">
                <div className="text-center max-w-2xl mx-auto mb-2">
                  <p className="text-muted-foreground">
                    Start with a free scan to see where your personal data is exposed, then use our tools to remove it and stay protected.
                  </p>
                </div>

                <div className="flex justify-center mb-2">
                  <Link href="/shield">
                    <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white" data-testid="button-start-scan">
                      <ShieldCheck className="w-5 h-5 mr-2" />
                      Start Free Data Scan
                    </Button>
                  </Link>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">All Data Shield Tools</h3>
                    <Link href="/data-shield-pricing">
                      <Button variant="outline" size="sm" data-testid="link-data-shield-pricing">
                        View Plans <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(showAllDataShield ? dataShieldTools : dataShieldTools.slice(0, 3)).map((tool) => (
                      <Card key={tool.title} className="hover-elevate" data-testid={`card-tool-${tool.title.toLowerCase().replace(/\s/g, "-")}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <tool.icon className="w-4.5 h-4.5 text-teal-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm">{tool.title}</h4>
                                {tool.badge && (
                                  <Badge variant="secondary" className="text-[10px] no-default-hover-elevate no-default-active-elevate">{tool.badge}</Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed mb-2.5">{tool.description}</p>
                              <Link href={tool.href}>
                                <Button variant="outline" size="sm" className="h-7 text-xs" data-testid={`button-tool-${tool.title.toLowerCase().replace(/\s/g, "-")}`}>
                                  Open <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {dataShieldTools.length > 3 && (
                    <button
                      onClick={() => setShowAllDataShield(!showAllDataShield)}
                      className="flex items-center gap-1.5 mx-auto mt-4 text-sm text-primary hover:underline"
                      data-testid="button-show-more-data-shield"
                    >
                      {showAllDataShield ? "Show less" : `Show ${dataShieldTools.length - 3} more tools`}
                      {showAllDataShield ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <InlinePromoVideo
            src="/videos/promo-tools.mp4"
            poster="/videos/poster-tools.png"
            heading="See Our Tools in Action"
            description="Watch how GetCyberRight helps families stay safe from scams, phishing, and online threats."
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          />
        </section>

        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Better Together
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                GCR Scam Guard stops threats before they reach you. GCR Data Shield removes the personal data that makes you a target. Use both for complete protection.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-accent/20 bg-accent/5" data-testid="card-combo-scam-guard">
                <CardContent className="p-5 text-center">
                  <Shield className="w-8 h-8 text-accent mx-auto mb-3" />
                  <h3 className="font-semibold mb-1.5">Scam Guard</h3>
                  <p className="text-xs text-muted-foreground mb-3">Detects and blocks scams, phishing, and fraud in real time</p>
                  <Link href="/gcr-guard-pricing">
                    <Button variant="outline" size="sm" className="text-xs" data-testid="button-combo-scam-guard">
                      From Free
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card className="border-primary/30 bg-primary/5 shadow-md" data-testid="card-combo-bundle">
                <CardContent className="p-5 text-center">
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <Shield className="w-6 h-6 text-accent" />
                    <span className="text-lg font-bold text-primary">+</span>
                    <ShieldCheck className="w-6 h-6 text-teal-500" />
                  </div>
                  <h3 className="font-semibold mb-1.5">Bundle & Save</h3>
                  <p className="text-xs text-muted-foreground mb-3">Both products together at up to 23% off</p>
                  <Link href="/pricing">
                    <Button size="sm" className="text-xs" data-testid="button-combo-bundle">
                      View Bundles
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card className="border-teal-500/20 bg-teal-500/5" data-testid="card-combo-data-shield">
                <CardContent className="p-5 text-center">
                  <ShieldCheck className="w-8 h-8 text-teal-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-1.5">Data Shield</h3>
                  <p className="text-xs text-muted-foreground mb-3">Finds and removes your exposed personal data</p>
                  <Link href="/data-shield-pricing">
                    <Button variant="outline" size="sm" className="text-xs" data-testid="button-combo-data-shield">
                      From Free
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-red-50 dark:bg-red-950/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Been Scammed? Get Help Now
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              If you think you've been scammed, don't panic. We have step-by-step guidance
              on what to do next to minimize damage and report the scam.
            </p>
            <Link href="/emergency-help">
              <Button size="lg" variant="destructive" data-testid="button-emergency-help">
                Get Emergency Help
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
