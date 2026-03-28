import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Eye,
  Trash2,
  Mail,
  Phone,
  CreditCard,
  Key,
  RefreshCw,
  ArrowRight,
  Clock,
  Users,
  FileWarning,
  Smartphone,
  Globe,
  ChevronRight,
  Zap,
  Bell,
} from "lucide-react";

const URGENCY_LEVELS = [
  {
    level: "Critical",
    color: "bg-red-500/10 border-red-500/30 dark:bg-red-500/20",
    badgeColor: "bg-red-500 text-white",
    icon: ShieldAlert,
    description: "Passwords, SSN, or financial data exposed in breaches",
    timeframe: "Act within 24 hours",
    steps: [
      { action: "Change all exposed passwords immediately", detail: "Start with email, banking, and any accounts using the same password. Use our Password Generator to create strong, unique passwords.", link: "/password-generator", linkText: "Password Generator" },
      { action: "Enable two-factor authentication everywhere", detail: "Prioritize email, banking, social media, and any account tied to your exposed data. Use an authenticator app, not SMS when possible.", link: null, linkText: null },
      { action: "Freeze your credit at all three bureaus", detail: "Contact Equifax, Experian, and TransUnion to place a security freeze. This prevents anyone from opening new accounts in your name. It's free and takes about 10 minutes per bureau.", link: null, linkText: null },
      { action: "Set up fraud alerts", detail: "Place an initial fraud alert with one bureau (it automatically applies to all three). This requires creditors to verify your identity before opening new accounts.", link: null, linkText: null },
      { action: "Monitor your financial accounts daily", detail: "Check bank and credit card statements for unfamiliar transactions. Set up transaction alerts through your bank's app.", link: null, linkText: null },
    ],
  },
  {
    level: "High",
    color: "bg-orange-500/10 border-orange-500/30 dark:bg-orange-500/20",
    badgeColor: "bg-orange-500 text-white",
    icon: AlertTriangle,
    description: "Personal info found on multiple data broker sites",
    timeframe: "Act within the first week",
    steps: [
      { action: "Submit opt-out requests to each data broker", detail: "Your Data Shield results show exactly which brokers have your data. Each broker has a different removal process — some use web forms, others require email requests.", link: "/data-removal", linkText: "Start Removal Process" },
      { action: "Document everything", detail: "Screenshot your Data Shield results and save confirmation emails from opt-out requests. Brokers are required to honor removal requests within 30-45 days.", link: null, linkText: null },
      { action: "Opt out of people-search sites", detail: "Sites like Spokeo, WhitePages, and BeenVerified aggregate your data. Removing yourself from these reduces your exposure to scammers and identity thieves.", link: null, linkText: null },
      { action: "Review your social media privacy settings", detail: "Data brokers scrape public profiles. Set your accounts to private and limit what information is publicly visible.", link: null, linkText: null },
    ],
  },
  {
    level: "Medium",
    color: "bg-yellow-500/10 border-yellow-500/30 dark:bg-yellow-500/20",
    badgeColor: "bg-yellow-600 text-white",
    icon: Eye,
    description: "Email found in older breaches, some broker listings",
    timeframe: "Address within 2 weeks",
    steps: [
      { action: "Update passwords on affected accounts", detail: "Even older breaches are dangerous. Criminals often test stolen credentials months or years after a breach.", link: "/password-generator", linkText: "Password Generator" },
      { action: "Check if you're reusing passwords", detail: "If any exposed password is used on other accounts, change those too. Password reuse is one of the most common ways accounts get compromised.", link: null, linkText: null },
      { action: "Set up ongoing monitoring", detail: "Re-scan with Data Shield monthly to catch new exposures. Data brokers often re-list people within 60-90 days of removal.", link: "/shield", linkText: "Schedule Re-scan" },
      { action: "Review your Breach Dashboard", detail: "Get a comprehensive view of all your breach exposures and track which ones you've addressed.", link: "/breach-dashboard", linkText: "Breach Dashboard" },
    ],
  },
  {
    level: "Low",
    color: "bg-green-500/10 border-green-500/30 dark:bg-green-500/20",
    badgeColor: "bg-green-600 text-white",
    icon: ShieldCheck,
    description: "Minimal exposure found",
    timeframe: "Maintain good habits",
    steps: [
      { action: "Keep your good security posture", detail: "You're in good shape. Continue using strong, unique passwords and two-factor authentication on important accounts.", link: null, linkText: null },
      { action: "Set up proactive monitoring", detail: "Even with low exposure, new breaches happen daily. Schedule monthly re-scans to stay ahead of any new threats.", link: "/shield", linkText: "Data Shield" },
      { action: "Protect your family too", detail: "Run Data Shield scans for your family members, especially seniors and teenagers who may be more vulnerable.", link: "/shield", linkText: "Scan for Family" },
    ],
  },
];

const PROTECTION_CHECKLIST = [
  { icon: Key, label: "Change all exposed passwords", category: "Immediate" },
  { icon: Lock, label: "Enable 2FA on critical accounts", category: "Immediate" },
  { icon: CreditCard, label: "Freeze credit at all 3 bureaus", category: "Immediate" },
  { icon: Trash2, label: "Submit data broker opt-outs", category: "This Week" },
  { icon: Mail, label: "Set up breach monitoring alerts", category: "This Week" },
  { icon: Smartphone, label: "Review social media privacy", category: "This Week" },
  { icon: RefreshCw, label: "Schedule monthly re-scans", category: "Ongoing" },
  { icon: Eye, label: "Monitor financial statements", category: "Ongoing" },
  { icon: Users, label: "Scan family members' data", category: "Ongoing" },
  { icon: Globe, label: "Review app permissions", category: "Ongoing" },
];

export default function ShieldNextSteps() {
  return (
    <>
      <SEOHead
        title="What to Do After Your Data Shield Scan | GetCyberRight"
        description="Your data was found exposed online. Here's exactly what to do next — step by step, based on your risk level. Protect yourself and your family from identity theft and scams."
        canonicalUrl="https://www.getcyberright.com/shield/next-steps"
      />
      <Navigation />

      <main className="min-h-screen bg-background">
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-background to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="bg-red-500/10 text-red-500 border-red-500/30 mb-4" data-testid="badge-alert">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Your Data Was Found Exposed
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4" data-testid="heading-main">
                Your Data Is Out There.{" "}
                <span className="text-primary">Here's What to Do.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8" data-testid="text-subtitle">
                Don't panic — but don't wait either. Follow these steps based on your
                exposure level to take back control of your personal information.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/shield">
                  <Button size="lg" variant="outline" data-testid="button-rescan">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Run a New Scan
                  </Button>
                </Link>
                <Link href="/data-removal">
                  <Button size="lg" className="bg-primary hover:bg-primary/90" data-testid="button-start-removal">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Start Data Removal
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3" data-testid="heading-urgency">
                  Steps Based on Your Risk Level
                </h2>
                <p className="text-muted-foreground">
                  Find your exposure level from your Data Shield results and follow the matching action plan.
                </p>
              </div>

              <div className="space-y-8">
                {URGENCY_LEVELS.map((level) => {
                  const Icon = level.icon;
                  return (
                    <Card
                      key={level.level}
                      className={`border ${level.color}`}
                      data-testid={`card-level-${level.level.toLowerCase()}`}
                    >
                      <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-background border">
                              <Icon className="w-6 h-6 text-foreground" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <Badge className={level.badgeColor}>
                                  {level.level} Exposure
                                </Badge>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {level.timeframe}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {level.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {level.steps.map((step, idx) => (
                            <div
                              key={idx}
                              className="flex gap-3 p-4 rounded-lg bg-background/50 border border-border/50"
                              data-testid={`step-${level.level.toLowerCase()}-${idx}`}
                            >
                              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground mb-1">
                                  {step.action}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {step.detail}
                                </p>
                                {step.link && (
                                  <Link href={step.link}>
                                    <Button
                                      variant="link"
                                      className="p-0 h-auto mt-2 text-primary"
                                      data-testid={`link-${level.level.toLowerCase()}-${idx}`}
                                    >
                                      {step.linkText}
                                      <ChevronRight className="w-3 h-3 ml-1" />
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3" data-testid="heading-checklist">
                  Your Protection Checklist
                </h2>
                <p className="text-muted-foreground">
                  Track your progress as you secure your digital life.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {["Immediate", "This Week", "Ongoing"].map((category) => (
                  <div key={category} className={category === "Ongoing" ? "md:col-span-2" : ""}>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      {category}
                    </h3>
                    <div className={`space-y-2 ${category === "Ongoing" ? "grid md:grid-cols-2 gap-2 space-y-0" : ""}`}>
                      {PROTECTION_CHECKLIST.filter((item) => item.category === category).map(
                        (item, idx) => {
                          const Icon = item.icon;
                          return (
                            <Card
                              key={idx}
                              className="border border-border/50"
                              data-testid={`checklist-item-${idx}`}
                            >
                              <CardContent className="p-3 flex items-center gap-3">
                                <div className="p-1.5 rounded-md bg-primary/10">
                                  <Icon className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-sm font-medium text-foreground">
                                  {item.label}
                                </span>
                              </CardContent>
                            </Card>
                          );
                        },
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3" data-testid="heading-faq">
                  Common Questions After a Scan
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: "How did my data end up on broker sites?",
                    a: "Data brokers legally collect information from public records, social media, purchase history, and other sources. They compile and sell profiles that include your name, address, phone number, email, and more. It's a multi-billion dollar industry — and completely legal in most states.",
                  },
                  {
                    q: "Will removing my data actually work?",
                    a: "Yes, but it requires persistence. Most data brokers are legally required to honor opt-out requests within 30-45 days. However, they often re-list your information over time. That's why regular re-scanning is important — we recommend monthly checks with Data Shield.",
                  },
                  {
                    q: "Is my identity at risk?",
                    a: "If your personal details like name, address, and date of birth are exposed, the risk is real but manageable. Criminals use this information for phishing, account takeover, and identity theft. Taking the steps in this guide significantly reduces your risk.",
                  },
                  {
                    q: "Should I be worried about old breaches?",
                    a: "Yes. Stolen credentials are traded on dark web forums for years after a breach. If you used the same password on multiple sites (which most people do), an old breach can still lead to new compromises. Always change passwords that appeared in any breach, no matter how old.",
                  },
                  {
                    q: "How often should I re-scan?",
                    a: "We recommend scanning monthly. Data brokers often re-list people within 60-90 days of removal, and new data breaches happen constantly. Regular scanning helps you catch new exposures early.",
                  },
                  {
                    q: "Should I scan my family members too?",
                    a: "Absolutely. Seniors are frequently targeted by scammers using data from broker sites, and children's clean credit histories make them attractive targets for identity theft. Run Data Shield for every family member.",
                  },
                ].map((faq, idx) => (
                  <Card key={idx} className="border" data-testid={`faq-${idx}`}>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4" data-testid="heading-cta">
                Ready to Take Back Control?
              </h2>
              <p className="text-muted-foreground mb-8">
                Start removing your data from broker sites and strengthen your digital defenses today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/data-removal">
                  <Button size="lg" className="bg-primary hover:bg-primary/90" data-testid="button-cta-removal">
                    <Zap className="w-4 h-4 mr-2" />
                    Start Data Removal
                  </Button>
                </Link>
                <Link href="/shield">
                  <Button size="lg" variant="outline" data-testid="button-cta-scan">
                    <Shield className="w-4 h-4 mr-2" />
                    Run Another Scan
                  </Button>
                </Link>
                <Link href="/breach-dashboard">
                  <Button size="lg" variant="outline" data-testid="button-cta-breach">
                    <Bell className="w-4 h-4 mr-2" />
                    Breach Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
