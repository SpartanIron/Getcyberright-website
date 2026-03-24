import { useSEO } from "@/hooks/use-seo";
import { StructuredData } from "@/components/structured-data";
import type { WebApplicationData, BreadcrumbData } from "@/components/structured-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { TechPatternBg } from "@/components/tech-pattern-bg";
import {
  Shield, Chrome, ArrowLeft, Download, Eye, Bell, MousePointer2,
  Search, Flag, Zap, Lock, CheckCircle2, Monitor
} from "lucide-react";

const extensionApp: WebApplicationData = {
  type: "WebApplication",
  name: "GCR Scam Guard Browser Extension by GetCyberRight",
  description: "Chrome browser extension for real-time scam protection. Free manual scanning included. Scan links, detect phishing sites, and stay safe while browsing. By GetCyberRight.",
  url: "https://www.getcyberright.com/browser-extension",
  applicationCategory: "SecurityApplication",
  provider: "GetCyberRight",
};

const breadcrumbs: BreadcrumbData = {
  type: "BreadcrumbList",
  items: [
    { name: "Home", url: "https://www.getcyberright.com/" },
    { name: "Tools", url: "https://www.getcyberright.com/tools" },
    { name: "Browser Extension", url: "https://www.getcyberright.com/browser-extension" },
  ],
};

const features = [
  {
    icon: MousePointer2,
    title: "Right-Click Scanning",
    description: "Right-click any link, text selection, or page to instantly analyze it for scams, phishing, and fraud using AI-powered detection."
  },
  {
    icon: Eye,
    title: "Link Hover Protection",
    description: "Hover over any link to see an instant safety rating. Suspicious links are visually flagged with warning indicators before you click."
  },
  {
    icon: Search,
    title: "Popup Quick Scanner",
    description: "Open the extension popup to paste and scan any URL, email, phone number, or suspicious message. Full AI analysis in seconds."
  },
  {
    icon: Shield,
    title: "Page-Wide Link Scan",
    description: "One click scans every link on the current page. Dangerous links get outlined in red, suspicious ones in yellow."
  },
  {
    icon: Bell,
    title: "Scam of the Week Alerts",
    description: "Receive weekly alerts about the latest trending scams delivered right to your browser. Stay one step ahead of scammers."
  },
  {
    icon: Flag,
    title: "Community Reporting",
    description: "Report confirmed scams directly from the extension. Your reports help protect the entire GetCyberRight community."
  },
  {
    icon: Zap,
    title: "Instant Risk Badges",
    description: "The extension badge changes color based on the safety of the current page: green for safe, yellow for caution, red for danger."
  },
  {
    icon: Lock,
    title: "Privacy-First Design",
    description: "No browsing history tracked. No personal data collected. Scans only happen when you trigger them or when auto-scan is enabled."
  },
];

const installSteps = [
  { step: 1, title: "Download the Extension", desc: "Click the download button below to get the extension ZIP file." },
  { step: 2, title: "Unzip the File", desc: "Extract the downloaded ZIP to a folder on your computer." },
  { step: 3, title: "Open Chrome Extensions", desc: "Go to chrome://extensions in your Chrome browser and enable \"Developer mode\" in the top right." },
  { step: 4, title: "Load the Extension", desc: "Click \"Load unpacked\" and select the unzipped extension folder. The shield icon will appear in your toolbar." },
];

export default function BrowserExtensionPage() {
  useSEO({
    title: "GCR Scam Guard Browser Extension - Chrome Protection | GetCyberRight",
    description: "Download the GCR Scam Guard browser extension for Chrome by GetCyberRight. Free manual scanning included. Real-time link scanning, AI-powered scam detection, and community threat alerts.",
    keywords: "browser extension, chrome extension, scam protection, phishing detector, link scanner, safe browsing, gcr guard, getcyberright"
  });

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={extensionApp} />
      <StructuredData data={breadcrumbs} />

      <section className="relative bg-[#0A2A3C] text-white overflow-hidden">
        <TechPatternBg />
        <div className="container max-w-6xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <Link href="/scam-checker">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 mb-6 -ml-2 gap-2" data-testid="link-back-scam-checker">
              <ArrowLeft className="w-4 h-4" />
              Back to GCR Scam Guard
            </Button>
          </Link>
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-sm px-3 py-1">
                Free to Get Started
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight" style={{ letterSpacing: "-0.025em" }}>
                GCR Scam Guard
                <span className="block text-orange-400">Browser Extension</span>
              </h1>
              <p className="text-lg text-white/80 max-w-lg leading-relaxed">
                AI-powered protection that lives in your browser. Scan links before you click, get real-time warnings on dangerous pages, and report scams to protect others.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="/api/extension/download" download>
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full gap-2 text-base px-8" data-testid="button-download-extension">
                    <Download className="w-5 h-5" />
                    Download for Chrome
                  </Button>
                </a>
              </div>
              <p className="text-xs text-white/50">
                Works with Chrome, Brave, Edge, and other Chromium-based browsers. Manual installation via Developer Mode.
              </p>
            </div>
            <div className="flex-1 max-w-md">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d3a52] to-[#0A2A3C] flex items-center justify-center border border-white/20">
                    <Shield className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">GCR Scam Guard</p>
                    <p className="text-xs text-white/50">by GetCyberRight</p>
                  </div>
                </div>
                <div className="flex justify-between text-center">
                  <div><p className="text-lg font-bold">247</p><p className="text-[10px] text-white/50 uppercase tracking-wider">Scans</p></div>
                  <div><p className="text-lg font-bold text-orange-400">12</p><p className="text-[10px] text-white/50 uppercase tracking-wider">Threats</p></div>
                  <div><p className="text-lg font-bold">1.4K</p><p className="text-[10px] text-white/50 uppercase tracking-wider">Links</p></div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center gap-2 text-xs text-white/70 mb-2">
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Quick Scan</span>
                  </div>
                  <div className="bg-white/5 rounded px-3 py-2 text-xs text-white/40 font-mono">
                    https://suspicious-site.example.com
                  </div>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">⚠️</span>
                    <div>
                      <p className="text-xs font-semibold text-red-300">High Risk Detected</p>
                      <p className="text-[10px] text-red-400/80">Domain mimics trusted brand</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3" style={{ letterSpacing: "-0.025em" }}>
              Protection That Works While You Browse
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powered by the same AI and multi-source threat intelligence behind the GCR Scam Guard.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <Card key={i} className="border-0 shadow-md hover:shadow-lg transition-shadow" data-testid={`card-feature-${i}`}>
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-3">
                    <f.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-1.5">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-800/50">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3" style={{ letterSpacing: "-0.025em" }}>
              How to Install
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Get up and running in under a minute. No Chrome Web Store required.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {installSteps.map((s) => (
              <div key={s.step} className="flex gap-4 items-start" data-testid={`install-step-${s.step}`}>
                <div className="w-10 h-10 rounded-full bg-[#0A2A3C] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="/api/extension/download" download>
              <Button size="lg" className="bg-[#0A2A3C] hover:bg-[#0d3a52] text-white rounded-full gap-2 text-base px-8" data-testid="button-download-extension-bottom">
                <Download className="w-5 h-5" />
                Download Extension ZIP
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3" style={{ letterSpacing: "-0.025em" }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              { q: "Is the browser extension free?", a: "The extension is free to download and includes manual scanning at no cost. Optional paid plans (Pro and Family) unlock advanced features like automatic page scanning, webmail protection, and family profiles." },
              { q: "Does it track my browsing activity?", a: "No. The extension only scans content when you explicitly trigger a scan or when auto-scan is enabled. No browsing history is stored or transmitted." },
              { q: "What browsers does it work with?", a: "It works with any Chromium-based browser including Google Chrome, Brave, Microsoft Edge, Opera, and Vivaldi." },
              { q: "Why isn't it on the Chrome Web Store?", a: "We're working on Chrome Web Store approval. In the meantime, you can install it manually using Developer Mode, which takes about 30 seconds." },
              { q: "How accurate is the scanning?", a: "GCR Scam Guard uses the same AI-powered analysis and multi-source threat intelligence (VirusTotal, PhishTank, Google Safe Browsing, and more) as our web-based GCR Scam Guard." },
            ].map((faq, i) => (
              <Card key={i} className="border shadow-sm" data-testid={`faq-${i}`}>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {faq.q}
                  </h3>
                  <p className="text-sm text-muted-foreground ml-6">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
