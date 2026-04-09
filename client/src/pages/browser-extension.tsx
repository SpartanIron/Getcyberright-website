import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/lib/navigation";
import { TechPatternBg } from "@/components/tech-pattern-bg";
import {
  Shield, Chrome, ArrowLeft, Download, Eye, Bell, MousePointer2,
  Search, Flag, Zap, Lock, CheckCircle2, Monitor, BellOff, Globe,
  ArrowRightLeft, Clipboard, ExternalLink, ShieldCheck, Building2, FileText
} from "lucide-react";


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
  {
    icon: BellOff,
    title: "Notification Spam Blocker",
    description: "Automatically detects when shady websites try to send you browser notifications. Blocks known spam domains before they clutter your screen with fake alerts."
  },
  {
    icon: Globe,
    title: "Search Result Safety Badges",
    description: "See safety ratings right next to search results on Google, Bing, DuckDuckGo, and Yahoo. Know which links are safe before you click."
  },
  {
    icon: ArrowRightLeft,
    title: "Redirect Chain Detection",
    description: "Flags suspicious websites that bounce you through multiple hidden redirects. A common trick scammers use to disguise where they are actually sending you."
  },
  {
    icon: Clipboard,
    title: "Clipboard Hijack Protection",
    description: "Monitors for malicious scripts that secretly swap what you copy, like changing a crypto wallet address. You will be alerted if clipboard content is tampered with."
  },
];

const installSteps = [
  { step: 1, title: "Visit the Chrome Web Store", desc: "Click \"Add to Chrome\" above to open the extension on the official Chrome Web Store." },
  { step: 2, title: "Click \"Add to Chrome\"", desc: "On the Chrome Web Store page, click the blue \"Add to Chrome\" button. Chrome will ask you to confirm." },
  { step: 3, title: "Confirm Permissions", desc: "Review the requested permissions (we explain each one transparently below) and click \"Add extension\" to install." },
  { step: 4, title: "You're Protected", desc: "The shield icon appears in your toolbar. Click it to scan any page, or enable auto-protection for hands-free safety." },
];

export default function BrowserExtensionPage() {

  return (
    <div className="min-h-screen bg-background">

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
                <a href="https://chromewebstore.google.com/detail/gcr-scam-guard-by-getcybe/naopegeklahanndbpanhienlkaachjhk" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full gap-2 text-base px-8" data-testid="button-install-chrome-store">
                    <Chrome className="w-5 h-5" />
                    Add to Chrome
                  </Button>
                </a>
                <a href="/api/extension/download" download>
                  <Button size="lg" variant="outline" className="border-white/20 text-white bg-white/5 hover:bg-white/10 rounded-full gap-2 text-base px-8" data-testid="button-download-extension">
                    <Download className="w-5 h-5" />
                    Download ZIP
                  </Button>
                </a>
              </div>
              <p className="text-xs text-white/50">
                Available on the Chrome Web Store. Also works with Brave, Edge, and other Chromium-based browsers.
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
              Get up and running in under a minute from the official Chrome Web Store.
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
            <a href="https://chromewebstore.google.com/detail/gcr-scam-guard-by-getcybe/naopegeklahanndbpanhienlkaachjhk" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-[#0A2A3C] hover:bg-[#0d3a52] text-white rounded-full gap-2 text-base px-8" data-testid="button-install-chrome-store-bottom">
                <Chrome className="w-5 h-5" />
                Add to Chrome - It's Free
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3" style={{ letterSpacing: "-0.025em" }}>
              Getting the Most Out of Scam Guard
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Practical tips for families, parents, seniors, and anyone who wants to stay safe online.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "For Parents",
                tips: [
                  "Install it on your children's devices so every page they visit is automatically scanned for scams and inappropriate content.",
                  "Turn on notification spam blocking to prevent pop-up traps that trick kids into clicking fake alerts.",
                  "Use the search result safety badges so your child can see green, yellow, or red ratings before clicking any link on Google or Bing.",
                  "Check the weekly safety digest to see what threats were detected across your family's browsing."
                ],
                color: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
              },
              {
                title: "For Seniors",
                tips: [
                  "Use the right-click scanner on any link in an email or social media post before clicking it. If you are unsure, scan it first.",
                  "The link hover feature shows a safety preview when you hold your mouse over a link, so you never have to guess.",
                  "Redirect chain detection will warn you if a website tries to bounce you through hidden pages, a common trick in phone and tech support scams.",
                  "If you see a red shield icon in your toolbar, leave the page immediately. Green means safe."
                ],
                color: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
              },
              {
                title: "For Online Shoppers",
                tips: [
                  "Before entering payment details on any website, check the extension badge. A yellow or red badge means you should not proceed.",
                  "Use the page-wide link scan on unfamiliar shopping sites. It checks every link on the page and highlights dangerous ones in red.",
                  "Clipboard protection ensures that no script on a shopping page can secretly change a wallet address or payment link you copied.",
                  "Pair with Identity Shield (in GCR Data Shield) to create a masked email for each shopping account so breaches do not expose your real address."
                ],
                color: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800"
              },
              {
                title: "For Everyone",
                tips: [
                  "Keep the extension enabled at all times. Most scam sites look identical to real ones, and the extension catches what your eyes cannot.",
                  "Report any confirmed scam using the community reporting feature. Your report protects thousands of other families.",
                  "Review the Scam of the Week alerts to stay ahead of trending scams. Knowledge is your strongest defense.",
                  "Enable auto-scan to silently check every page you visit without any extra effort — it's free with your account."
                ],
                color: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800"
              },
            ].map((group, i) => (
              <Card key={i} className={`border ${group.color}`} data-testid={`tips-${group.title.toLowerCase().replace(/\s/g, '-')}`}>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">{group.title}</h3>
                  <ul className="space-y-3">
                    {group.tips.map((tip, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#0A2A3C]">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3" style={{ letterSpacing: "-0.025em" }}>
              Transparency & Trust
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              We believe you should know exactly what an extension does before you install it. Here is everything about our permissions, data handling, and who we are.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-6" data-testid="trust-who-we-are">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-white">Who Makes This</h3>
              </div>
              <p className="text-sm text-white/50 leading-relaxed mb-3">
                GCR Scam Guard is owned and operated by <strong className="text-white/70">GetCyberRight LLC</strong>, a registered cybersecurity education company. The platform and extension were built and are maintained by <a href="https://colorcodesolutions.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline">ColorCode Solutions</a>, contracted by GetCyberRight LLC. We are a registered LLC with a public website, active social media, and a transparent mission.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/about">
                  <span className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 bg-primary/5 px-2.5 py-1 rounded-full">About Us <ExternalLink className="w-3 h-3" /></span>
                </Link>
                <Link href="/our-mission">
                  <span className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 bg-primary/5 px-2.5 py-1 rounded-full">Our Mission <ExternalLink className="w-3 h-3" /></span>
                </Link>
                <Link href="/privacy">
                  <span className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 bg-primary/5 px-2.5 py-1 rounded-full">Privacy Policy <ExternalLink className="w-3 h-3" /></span>
                </Link>
                <Link href="/contact">
                  <span className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 bg-primary/5 px-2.5 py-1 rounded-full">Contact Us <ExternalLink className="w-3 h-3" /></span>
                </Link>
              </div>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-6" data-testid="trust-data-handling">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-semibold text-white">What We Collect (and Don't)</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-white/50">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white/70">No browsing history</strong> is tracked or stored</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-white/50">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white/70">No passwords or form data</strong> is ever read</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-white/50">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white/70">No data is sold</strong> to advertisers or data brokers</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-white/50">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Scans only run when <strong className="text-white/70">you trigger them</strong> or enable auto-scan</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-white/50">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>All scan data is sent over <strong className="text-white/70">encrypted HTTPS</strong> only</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white/[0.04] border border-white/10 rounded-xl p-6" data-testid="trust-permissions-explained">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Permissions Explained</h3>
                <p className="text-xs text-white/40">Every permission we request and exactly why</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 mb-5">
              {[
                { perm: "activeTab", why: "Read the current page when you click \"Scan This Page\" or right-click to scan" },
                { perm: "contextMenus", why: "Add right-click options to scan links, text, or entire pages" },
                { perm: "storage", why: "Save your preferences and scan history locally on your device" },
                { perm: "notifications", why: "Alert you about dangerous sites and weekly scam warnings" },
                { perm: "alarms", why: "Schedule periodic threat feed updates in the background" },
                { perm: "scripting", why: "Inject the scanner into pages for manual scans on demand" },
                { perm: "tabs", why: "Show the safety badge for the current tab and manage badge state" },
                { perm: "webNavigation", why: "Reset scan state when you navigate to a new page" },
              ].map((p) => (
                <div key={p.perm} className="flex items-start gap-2 py-1.5 border-b border-white/5 last:border-0">
                  <code className="text-xs text-primary bg-primary/5 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">{p.perm}</code>
                  <p className="text-xs text-white/50">{p.why}</p>
                </div>
              ))}
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white/80 mb-2">Why does it need access to all websites?</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                To protect you on any page you visit, the extension's content scanner needs to run across all sites. <strong className="text-white/60">By default, it does nothing</strong> until you trigger a scan or enable auto-protection in settings. When active, it only analyzes visible page text, link destinations, and form structures. It never reads passwords, form inputs, or browsing history. All analysis is sent over encrypted HTTPS to getcyberright.com only.
              </p>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 text-center">
              <ShieldCheck className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">OWASP Aligned</p>
              <p className="text-xs text-white/40">Follows secure coding practices</p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 text-center">
              <Lock className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">Manifest V3</p>
              <p className="text-xs text-white/40">Latest Chrome extension security standard</p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 text-center">
              <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">8 Trusted Sources</p>
              <p className="text-xs text-white/40">VirusTotal, PhishTank, Google Safe Browsing, and more</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50 dark:bg-slate-800/50">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3" style={{ letterSpacing: "-0.025em" }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              { q: "Is the browser extension free?", a: "Yes! The extension is completely free to download and use. All features are included at no cost — automatic page scanning, notification blocking, search safety badges, redirect detection, clipboard protection, webmail scanning, and family profiles. Just create a free account to get started." },
              { q: "Does it track my browsing activity?", a: "No. The extension only scans content when you explicitly trigger a scan or when auto-scan is enabled. No browsing history is stored or transmitted." },
              { q: "What browsers does it work with?", a: "It works with any Chromium-based browser including Google Chrome, Brave, Microsoft Edge, Opera, and Vivaldi." },
              { q: "Is it on the Chrome Web Store?", a: "Yes! GCR Scam Guard is available on the official Chrome Web Store. Click \"Add to Chrome\" at the top of this page to install it directly. You can also download the ZIP for manual installation if you prefer." },
              { q: "How accurate is the scanning?", a: "GCR Scam Guard uses the same AI-powered analysis and multi-source threat intelligence (VirusTotal, PhishTank, Google Safe Browsing, and more) as our web-based GCR Scam Guard." },
              { q: "What are search result safety badges?", a: "When you search on Google, Bing, DuckDuckGo, or Yahoo, the extension adds colored badges next to each result showing whether the link is safe, suspicious, or dangerous. This helps you avoid risky sites before you even click." },
              { q: "How does notification spam blocking work?", a: "Many scam sites trick you into allowing browser notifications, then flood you with fake virus warnings and misleading ads. The extension detects these permission requests and blocks known spam domains automatically." },
              { q: "What is clipboard hijack protection?", a: "Some malicious websites run hidden scripts that change what you have copied to your clipboard. For example, swapping a crypto wallet address so funds go to a scammer. The extension detects these changes and alerts you immediately." },
              { q: "Can I install it on my family's devices?", a: "Yes! You can manage profiles for up to 6 family members for free. Install the extension on each device, sign in with the same account, and everyone gets protected. You can review safety activity across all devices from your dashboard." },
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
