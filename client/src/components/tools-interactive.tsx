"use client";

import { useState, useEffect } from "react";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InlinePromoVideo } from "@/components/inline-promo-video";
import { PasswordGenerator } from "@/components/password-generator";
import { ScamChecker } from "@/components/scam-checker";
import { VoiceCheckWaitlist } from "@/components/voice-check-waitlist";
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

type ToolCopy = {
  title: string;
  situation: string;
  subline: string;
  whenToUse: string[];
  href?: string;
  icon: typeof Shield;
  badge?: string;
  inline?: "scanner" | "password" | "voice-clone";
};

const scamGuardTools: ToolCopy[] = [
  {
    title: "Browser Extension",
    situation: "When the next sketchy link is one click away",
    subline: "Adds safety badges to search results, blocks pop-ups, and warns you before redirects on Chrome, Edge, Brave, and Opera.",
    whenToUse: [
      "You searched for a help line and the top result looks off",
      "A site keeps trying to copy something to your clipboard",
      "You want a second opinion before you click",
    ],
    href: "/browser-extension",
    icon: Chrome,
    badge: "Free",
  },
  {
    title: "Report a Scam",
    situation: "When you want to make sure no one else falls for it",
    subline: "Send us the message, link, or call you saw so the next family does not get hit by the same one.",
    whenToUse: [
      "You spotted a scam aimed at parents or grandparents",
      "A new fake message is going around your group chat",
      "Your kid was contacted by someone suspicious",
    ],
    href: "/report-scam",
    icon: ShieldAlert,
  },
  {
    title: "Password Generator",
    situation: "When you need a real password right now and your brain is empty",
    subline: "Builds a strong, one-of-a-kind password in your browser. Nothing is sent anywhere.",
    whenToUse: [
      "You are signing up for a new account",
      "A site asks you to reset after a breach",
      "You are setting up a shared family account",
    ],
    icon: Lock,
    badge: "Free",
    inline: "password",
  },
  {
    title: "Voice Verification Helper",
    situation: "When a phone call sounds like family but feels off",
    subline: "Walks you through six things to listen for and ways to verify the caller a scammer cannot fake. No AI verdict, because reliable voice clone detection does not exist yet.",
    whenToUse: [
      "A grandchild calls asking for money in a hurry",
      "A voicemail sounds like your boss but the request is strange",
      "A loved one calls from an unknown number with bad news",
    ],
    icon: Radio,
    badge: "Free",
    inline: "voice-clone",
  },
];

const dataShieldTools: ToolCopy[] = [
  {
    title: "Data Exposure Scan",
    situation: "When you wonder how scammers keep finding you",
    subline: "Searches more than 500 data broker sites and breach databases for your name, email, and phone.",
    whenToUse: [
      "You started getting more spam calls and texts",
      "A scammer knew details only family should know",
      "You want a clear baseline before you clean things up",
    ],
    href: "/shield",
    icon: ShieldCheck,
    badge: "Free",
  },
  {
    title: "Data Removal Center",
    situation: "When you want your name off the people-search sites",
    subline: "Guided removal, automated opt-outs, and ongoing monitoring with Identity Shield and Personal Vault.",
    whenToUse: [
      "Your home address shows up in a Google search",
      "You moved jobs and want a clean digital footprint",
      "An ex or stalker is finding you online",
    ],
    href: "/data-removal",
    icon: Trash2,
  },
  {
    title: "Breach Monitor",
    situation: "When a company you used gets hacked",
    subline: "Alerts you the moment your email or personal info shows up in a new breach.",
    whenToUse: [
      "You used the same password on more than one site",
      "You shop on smaller sites and want a heads-up",
      "You manage accounts for an older parent",
    ],
    href: "/breach-dashboard",
    icon: AlertTriangle,
  },
  {
    title: "Safety Score Assessment",
    situation: "When you want to know what to fix first",
    subline: "A few short questions about your habits, then a clear score and the next three things to do.",
    whenToUse: [
      "You feel overwhelmed by safety advice online",
      "You want a baseline before changing anything",
      "A family member asked for a starting point",
    ],
    href: "/quick-assessment",
    icon: ClipboardCheck,
    badge: "Free",
  },
  {
    title: "Cyber Hygiene Checklist",
    situation: "When you want a routine that actually sticks",
    subline: "A practical daily and weekly checklist you can tick off as you go. Progress is saved for you.",
    whenToUse: [
      "You want to build safer habits without a course",
      "You are setting up a new device the right way",
      "You just helped a parent or grandparent get online",
    ],
    href: "/cyber-hygiene",
    icon: Shield,
    badge: "Free",
  },
  {
    title: "Child Safety Scanner",
    situation: "When your kid asks if they can use a new app or site",
    subline: "Plain-language safety check for websites, apps, and services, written for parents and guardians.",
    whenToUse: [
      "A new app is going around the school chat",
      "Your kid wants to install something you have not heard of",
      "You are reviewing what is already on their phone",
    ],
    href: "/parents/child-safety-scanner",
    icon: Baby,
    badge: "Free",
  },
];

export function ToolsInteractive({ tab: tabParam }: { tab?: string }) {
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

  return (
    <>
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
                  <Badge variant="outline" className="text-[10px] border-accent/30 text-accent no-default-hover-elevate no-default-active-elevate">Free</Badge>
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
                  <Badge variant="outline" className="text-[10px] border-teal-500/30 text-teal-500 no-default-hover-elevate no-default-active-elevate">Free</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Personal data removal, breach monitoring, and privacy protection tools</p>
              </div>
            </button>
          </div>

          {activeProduct === "scam-guard" && (
            <div className="space-y-8">
              <div id="inline-tool-area" className="scroll-mt-24">
                <Tabs value={inlineTool} onValueChange={(v) => setInlineTool(v as any)}>
                  <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-3 h-auto" data-testid="tabs-scam-guard-tools">
                    <TabsTrigger value="scanner" className="flex flex-col gap-0.5 py-2 text-xs sm:text-sm h-auto" data-testid="tab-scanner">
                      <span className="flex items-center gap-1.5"><Search className="w-4 h-4" /><span className="font-semibold">Is this a scam?</span></span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/80">Scam Scanner</span>
                    </TabsTrigger>
                    <TabsTrigger value="password" className="flex flex-col gap-0.5 py-2 text-xs sm:text-sm h-auto" data-testid="tab-password">
                      <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" /><span className="font-semibold">I need a password</span></span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/80">Password Generator</span>
                    </TabsTrigger>
                    <TabsTrigger value="voice-clone" className="flex flex-col gap-0.5 py-2 text-xs sm:text-sm h-auto" data-testid="tab-voice-clone">
                      <span className="flex items-center gap-1.5"><Radio className="w-4 h-4" /><span className="font-semibold">Was that really them?</span></span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/80">Voice Check</span>
                    </TabsTrigger>
                  </TabsList>
                  <p className="text-center text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
                    Pick the situation you are in. Each tool below tells you what it can and cannot do.
                  </p>

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
                      <VoiceCheckWaitlist />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">More Scam Guard Tools</h3>
                  <Link href="/register">
                    <Button variant="outline" size="sm" data-testid="link-scam-guard-signup">
                      Get Started Free <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
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
                              <h4 className="font-semibold text-sm leading-snug">{tool.situation}</h4>
                              {tool.badge && (
                                <Badge variant="secondary" className="text-[10px] no-default-hover-elevate no-default-active-elevate">{tool.badge}</Badge>
                              )}
                            </div>
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground/80 mb-1">{tool.title}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed mb-2">{tool.subline}</p>
                            <div className="mb-2.5">
                              <p className="text-[11px] font-semibold text-foreground mb-1">When to use this</p>
                              <ul className="space-y-0.5">
                                {tool.whenToUse.map((s) => (
                                  <li key={s} className="text-xs text-muted-foreground leading-snug flex gap-1.5">
                                    <span className="text-accent mt-0.5">&bull;</span>
                                    <span>{s}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
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
                  <Link href="/register">
                    <Button variant="outline" size="sm" data-testid="link-data-shield-signup">
                      Get Started Free <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
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
                              <h4 className="font-semibold text-sm leading-snug">{tool.situation}</h4>
                              {tool.badge && (
                                <Badge variant="secondary" className="text-[10px] no-default-hover-elevate no-default-active-elevate">{tool.badge}</Badge>
                              )}
                            </div>
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground/80 mb-1">{tool.title}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed mb-2">{tool.subline}</p>
                            <div className="mb-2.5">
                              <p className="text-[11px] font-semibold text-foreground mb-1">When to use this</p>
                              <ul className="space-y-0.5">
                                {tool.whenToUse.map((s) => (
                                  <li key={s} className="text-xs text-muted-foreground leading-snug flex gap-1.5">
                                    <span className="text-teal-500 mt-0.5">&bull;</span>
                                    <span>{s}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <Link href={tool.href!}>
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
          src="/videos/guides/vault_identity_explainer.mp4"
          poster="/videos/poster-tools.png"
          heading="See Our Protection Tools in Action"
          description="Watch how GetCyberRight's Privacy Vault and Identity Shield work together to keep your family safe from scams, data exposure, and online threats."
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
                <Link href="/register">
                  <Button variant="outline" size="sm" className="text-xs" data-testid="button-combo-scam-guard">
                    Free Access
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
                <h3 className="font-semibold mb-1.5">All Tools Included</h3>
                <p className="text-xs text-muted-foreground mb-3">Get full access to both products, completely free</p>
                <Link href="/register">
                  <Button size="sm" className="text-xs" data-testid="button-combo-bundle">
                    Sign Up Free
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-teal-500/20 bg-teal-500/5" data-testid="card-combo-data-shield">
              <CardContent className="p-5 text-center">
                <ShieldCheck className="w-8 h-8 text-teal-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-1.5">Data Shield</h3>
                <p className="text-xs text-muted-foreground mb-3">Finds and removes your exposed personal data</p>
                <Link href="/register">
                  <Button variant="outline" size="sm" className="text-xs" data-testid="button-combo-data-shield">
                    Free Access
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-red-600 dark:bg-red-700 border-y-4 border-red-700 dark:border-red-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/15 mb-5">
            <AlertTriangle className="w-9 h-9 text-white" />
          </div>
          <p className="text-xs font-bold tracking-widest uppercase text-white/80 mb-3">Right Now</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            I Think Something Is Wrong
          </h2>
          <p className="text-white/90 mb-7 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Money just left your account. A stranger has photos of your kid. A loved one was just on a call that did not feel right. Start here and we will walk you through the next ten minutes.
          </p>
          <Link href="/emergency-help">
            <Button size="lg" variant="secondary" className="bg-white text-red-700 hover:bg-white/90 font-semibold" data-testid="button-emergency-help">
              Get Help Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
