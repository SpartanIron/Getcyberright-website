import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";
import { StructuredData, type BreadcrumbData } from "@/components/structured-data";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield, BookOpen, CheckSquare, AlertTriangle, Eye, Lock,
  Users, Download, ArrowRight, Smartphone, Wifi, Mail,
  CreditCard, Globe, FileText, GraduationCap, Heart
} from "lucide-react";

const infographicBlocks = [
  {
    icon: Mail,
    title: "Spot a Phishing Email",
    color: "from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/20",
    iconColor: "text-red-500",
    steps: [
      "Check the sender's email address carefully",
      "Look for urgent language demanding immediate action",
      "Hover over links before clicking to see the real URL",
      "Watch for spelling and grammar mistakes",
      "Never open unexpected attachments",
    ],
  },
  {
    icon: Lock,
    title: "Create Strong Passwords",
    color: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20",
    iconColor: "text-blue-500",
    steps: [
      "Use at least 16 characters",
      "Mix uppercase, lowercase, numbers, and symbols",
      "Never reuse passwords across accounts",
      "Use a password manager to store them",
      "Enable two-factor authentication everywhere",
    ],
  },
  {
    icon: CreditCard,
    title: "Prevent Identity Theft",
    color: "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/20",
    iconColor: "text-purple-500",
    steps: [
      "Freeze your credit at all three bureaus",
      "Monitor your bank statements weekly",
      "Shred documents with personal information",
      "Be cautious sharing your Social Security number",
      "Set up fraud alerts on your accounts",
    ],
  },
  {
    icon: Smartphone,
    title: "Secure Your Mobile Device",
    color: "from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/20",
    iconColor: "text-teal-500",
    steps: [
      "Keep your operating system updated",
      "Only download apps from official stores",
      "Review app permissions regularly",
      "Use a screen lock with biometrics",
      "Turn off Bluetooth when not in use",
    ],
  },
  {
    icon: Wifi,
    title: "Stay Safe on Public Wi-Fi",
    color: "from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20",
    iconColor: "text-amber-500",
    steps: [
      "Use a VPN when connecting to public networks",
      "Avoid accessing banking or financial sites",
      "Turn off auto-connect to open networks",
      "Verify the network name with the venue",
      "Use mobile data for sensitive transactions",
    ],
  },
  {
    icon: Globe,
    title: "Protect Your Online Privacy",
    color: "from-green-50 to-lime-50 dark:from-green-950/30 dark:to-lime-950/20",
    iconColor: "text-green-500",
    steps: [
      "Review privacy settings on all social media",
      "Use private browsing for sensitive searches",
      "Opt out of data broker databases",
      "Read privacy policies before signing up",
      "Limit personal information shared online",
    ],
  },
];

const checklists = [
  {
    title: "Family Cyber Safety Checklist",
    description: "10 essential steps every family should take to protect themselves online.",
    icon: Users,
    color: "text-blue-500",
    items: ["Set up parental controls", "Create family password rules", "Discuss online safety regularly", "Review privacy settings together", "Establish screen time boundaries"],
    href: "/checklists",
  },
  {
    title: "Senior Online Safety Checklist",
    description: "Practical steps to help seniors avoid scams and stay safe online.",
    icon: Heart,
    color: "text-rose-500",
    items: ["Learn to recognize phishing emails", "Set up two-factor authentication", "Verify callers before sharing info", "Report suspicious messages", "Keep software updated"],
    href: "/seniors",
  },
  {
    title: "Small Business Security Checklist",
    description: "Essential cybersecurity measures every small business needs.",
    icon: Shield,
    color: "text-teal-500",
    items: ["Train employees on security", "Implement access controls", "Back up data regularly", "Use encryption for sensitive data", "Create an incident response plan"],
    href: "/small-business",
  },
];

const quickLinks = [
  { title: "Scam Checker Tool", description: "Analyze suspicious URLs, emails, and messages", href: "/tools", icon: Eye },
  { title: "GCR Data Shield", description: "Scan for your exposed personal data", href: "/shield", icon: Shield },
  { title: "Training Academy", description: "Structured courses with certificates", href: "/training", icon: GraduationCap },
  { title: "Threat Radar", description: "Real-time cyber threat monitoring", href: "/cyber-threat-radar", icon: AlertTriangle },
  { title: "Printable Guides", description: "Download and share safety guides", href: "/printable-guides", icon: FileText },
  { title: "AI Prompt Library", description: "406+ AI prompts for everyday safety", href: "/ai-prompts", icon: BookOpen },
];

export default function AwarenessHub() {
  useSEO({
    title: "Cyber Awareness Hub | Digital Safety Resources | GetCyberRight",
    description: "Your central resource for cybersecurity education. Visual guides, safety checklists, infographics, and downloadable resources to protect your family online.",
    keywords: "cyber awareness, digital safety, cybersecurity education, online safety resources, phishing guide, identity theft prevention",
  });

  const breadcrumbs: BreadcrumbData = {
    type: "BreadcrumbList",
    items: [
      { name: "Home", url: "https://www.getcyberright.com/" },
      { name: "Cyber Awareness Hub", url: "https://www.getcyberright.com/awareness-hub" },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={[breadcrumbs]} />
      <Navigation />

      <div className="bg-[#0A2A3C] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A2A3C] via-[#0A2A3C] to-[#00293C]" />

        <div className="absolute pointer-events-none hidden md:block" aria-hidden="true" style={{ top: 0, right: 0, width: "55%", height: "100%", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-40%", right: "2%", width: "50px", height: "220%", background: "linear-gradient(180deg, #003A52 0%, #0D4D66 50%, #003A52 100%)", transform: "rotate(20deg)", transformOrigin: "top center", filter: "drop-shadow(0 0 18px rgba(13, 148, 136, 0.15))" }} />
          <div style={{ position: "absolute", top: "-40%", right: "10%", width: "2px", height: "220%", background: "linear-gradient(180deg, transparent 10%, rgba(45, 212, 191, 0.4) 50%, transparent 90%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
          <div style={{ position: "absolute", top: "-35%", right: "18%", width: "35px", height: "220%", background: "linear-gradient(180deg, #5eead4 0%, #2dd4bf 35%, #14b8a6 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.55, filter: "drop-shadow(0 0 24px rgba(45, 212, 191, 0.3))" }} />
          <div style={{ position: "absolute", top: "-35%", right: "26%", width: "2px", height: "220%", background: "linear-gradient(180deg, transparent 15%, hsla(16, 95%, 58%, 0.35) 50%, transparent 85%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
          <div style={{ position: "absolute", top: "-30%", right: "32%", width: "50px", height: "220%", background: "linear-gradient(180deg, hsl(16, 100%, 62%) 0%, hsl(16, 95%, 52%) 40%, hsl(16, 90%, 42%) 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.5, filter: "drop-shadow(0 0 22px hsla(16, 95%, 55%, 0.25))" }} />
        </div>

        <div className="absolute -bottom-24 -left-16 w-[400px] h-[400px] bg-primary/[0.04] rounded-full blur-[100px]" />

        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-[1.75rem] sm:text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold tracking-[-0.025em] leading-[1.08]" data-testid="heading-awareness-hub">Cyber Awareness Hub</h1>
            </div>
            <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
              Your central resource for cybersecurity education. Visual guides, safety checklists, and practical tools to protect yourself and your family online.
            </p>
          </div>
        </div>
      </div>

      <main id="main-content" tabIndex={-1} className="container mx-auto px-4 py-12 space-y-16">
        <section className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 mb-4">
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium">Free Download</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4" data-testid="heading-lead-magnet">
            Free Digital Safety Guide for Families
          </h2>
          <p className="text-muted-foreground mb-6">
            A comprehensive, easy-to-follow guide covering online safety basics, device security, social media privacy, and how to talk to your kids about cyber threats. Perfect for printing and sharing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/printable-guides">
              <Button size="lg" className="gap-2" data-testid="button-download-guide">
                <Download className="h-5 w-5" />
                Download Free Guide
              </Button>
            </Link>
            <Link href="/guides">
              <Button size="lg" variant="outline" className="gap-2" data-testid="button-browse-guides">
                <BookOpen className="h-5 w-5" />
                Browse All Guides
              </Button>
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-center mb-2" data-testid="heading-infographics">Visual Safety Guides</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">
            Step-by-step visual guides to protect yourself from the most common cyber threats
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-6">
            {infographicBlocks.map((block) => (
              <Card key={block.title} className={`bg-gradient-to-br ${block.color} border-0 shadow-md hover:shadow-lg transition-shadow`} data-testid={`card-infographic-${block.title.toLowerCase().replace(/\s/g, "-")}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className={`p-2 rounded-lg bg-white/80 dark:bg-slate-800/80`}>
                      <block.icon className={`h-5 w-5 ${block.iconColor}`} />
                    </div>
                    {block.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {block.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold shrink-0 mt-0.5 bg-white/80 dark:bg-slate-800/80 ${block.iconColor}`}>
                          {i + 1}
                        </span>
                        <span className="text-foreground/80">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-center mb-2" data-testid="heading-checklists">Safety Checklists</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">
            Practical, actionable checklists tailored for different groups
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {checklists.map((checklist) => (
              <Card key={checklist.title} className="hover:shadow-lg transition-shadow" data-testid={`card-checklist-${checklist.title.toLowerCase().replace(/\s/g, "-")}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <checklist.icon className={`h-5 w-5 ${checklist.color}`} />
                    {checklist.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{checklist.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {checklist.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckSquare className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={checklist.href}>
                    <Button variant="outline" size="sm" className="w-full gap-1">
                      View Full Checklist <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-center mb-2" data-testid="heading-quick-tools">Explore Our Tools</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">
            Free cybersecurity tools to help you stay safe online
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickLinks.map((link) => (
              <Link key={link.title} href={link.href}>
                <Card className="h-full hover:shadow-md transition-all cursor-pointer group" data-testid={`card-tool-${link.title.toLowerCase().replace(/\s/g, "-")}`}>
                  <CardContent className="pt-5 text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                      <link.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{link.title}</h3>
                    <p className="text-xs text-muted-foreground">{link.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-slate-900 to-teal-900 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" data-testid="heading-stay-informed">Stay Informed</h2>
          <p className="text-slate-300 mb-6 max-w-lg mx-auto">
            Get weekly cybersecurity tips, threat alerts, and safety guides delivered straight to your inbox. Free to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/cyber-threat-radar">
              <Button variant="secondary" size="lg" className="gap-2">
                <AlertTriangle className="h-5 w-5" />
                View Threat Radar
              </Button>
            </Link>
            <Link href="/scam-intel">
              <Button variant="outline" size="lg" className="gap-2 text-white border-white/30 hover:bg-white/10">
                <Eye className="h-5 w-5" />
                Scam Intelligence
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
