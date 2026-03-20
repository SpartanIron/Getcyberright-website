import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Newsletter } from "@/components/newsletter";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { StructuredData } from "@/components/structured-data";
import type { ArticleData, BreadcrumbData } from "@/components/structured-data";
import { Link } from "wouter";
import {
  ArrowRight, Shield, Heart, DollarSign, Eye, Users, BookOpen,
  CheckCircle, Globe, Zap, AlertTriangle, Search, Trash2,
  GraduationCap, Lock, ShieldCheck, UserX, Mail, Phone,
  Landmark, TrendingUp, BadgeAlert, ScanLine, FileText
} from "lucide-react";
import familyTogetherImage from "@/assets/images/about-family-together.png";
import seniorsLearningImage from "@/assets/images/about-seniors-learning.png";
import ctaBackgroundImage from "@/assets/images/about-cta-background.png";

const aboutArticleSchema: ArticleData = {
  type: "Article",
  headline: "About GetCyberRight: Digital Safety Has Never Mattered More",
  description: "Online scams have changed. GetCyberRight gives families, seniors, and small businesses the simple tools and clear guidance they need to stay safe online.",
  datePublished: "2024-01-15",
  dateModified: "2026-03-01",
  author: { name: "GetCyberRight", url: "https://getcyberright.com" },
  publisher: { name: "GetCyberRight", logo: "https://getcyberright.com/og-image.png" },
};

const aboutBreadcrumbs: BreadcrumbData = {
  type: "BreadcrumbList",
  items: [
    { name: "Home", url: "https://getcyberright.com/" },
    { name: "About", url: "https://getcyberright.com/about" },
  ],
};

const threatTypes = [
  { icon: Mail, label: "Fake Emails & Texts", description: "Scam messages now look identical to real ones from your bank, employer, or favorite stores. Perfect grammar, real logos, and details pulled from your social media make them nearly impossible to spot." },
  { icon: UserX, label: "Fake Voices & Video Calls", description: "Criminals can now copy someone's voice or face to make calls and video chats that look and sound like a real person you know and trust." },
  { icon: Heart, label: "Romance & Trust Scams", description: "Scammers build fake relationships over weeks or months to gain your trust before asking for money. Some use chatbots to target thousands of people at once." },
  { icon: Landmark, label: "Fake Investment Platforms", description: "Fake trading platforms with made-up success stories and celebrity endorsements are designed to look exactly like the real thing." },
  { icon: Phone, label: "Cloned Voice Calls", description: "A family member's voice can now be copied from just a few seconds of audio, then used to call you pretending to be in an emergency." },
  { icon: Eye, label: "Your Data Being Sold", description: "Over 501 companies collect and sell your personal information to anyone willing to pay, giving scammers the details they need to trick you." },
];

const platformTools = [
  {
    icon: ScanLine,
    title: "Scam Checker",
    description: "Paste any suspicious message, email, link, or phone number. We check it against 8 trusted safety sources and tell you whether it is safe or a scam.",
    href: "/scam-checker",
    color: "text-red-400",
    bg: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  {
    icon: Trash2,
    title: "Data Broker Removal",
    description: "We track 501+ companies that collect and sell your personal information. Get step-by-step instructions to remove yourself from each one.",
    href: "/data-removal",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    borderColor: "border-teal-500/20",
  },
  {
    icon: GraduationCap,
    title: "Training Academy",
    description: "Easy-to-follow courses that teach you how modern scams work and how to spot them, no technical background needed.",
    href: "/training",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    icon: Zap,
    title: "AI Safety Prompt Library",
    description: "406+ ready-to-use prompts that help you use AI tools like ChatGPT safely, without accidentally sharing private information.",
    href: "/ai-prompts",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    icon: FileText,
    title: "Safety Guides",
    description: "125+ easy-to-read guides covering passwords, account security, safe browsing, and keeping your devices protected.",
    href: "/guides",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
  },
];

const credibilityStats = [
  { value: "501+", label: "Data Brokers Tracked", detail: "Companies we monitor that sell your personal information" },
  { value: "406+", label: "AI Safety Prompts", detail: "Ready-to-use prompts for using AI tools safely" },
  { value: "125+", label: "Safety Guides", detail: "Easy-to-read guides on staying safe online" },
  { value: "8", label: "Trusted Safety Sources", detail: "Where we check to verify if something is a scam" },
  { value: "13", label: "Regions Covered", detail: "Scam alerts tailored for regions around the world" },
  { value: "52+", label: "Scam Types Covered", detail: "Detailed guides on specific kinds of scams" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.about} />
      <StructuredData data={[aboutArticleSchema, aboutBreadcrumbs]} />
      <Navigation />

      <main id="main-content" tabIndex={-1}>

        <section className="bg-[#0A2A3C] relative overflow-hidden" aria-labelledby="about-hero-heading">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A2A3C] via-[#0A2A3C] to-[#00293C]" />

          <div
            className="absolute pointer-events-none hidden lg:block"
            aria-hidden="true"
            style={{
              top: 0,
              right: 0,
              width: "58%",
              height: "100%",
              overflow: "hidden",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
            }}
          >
            <div style={{ position: "absolute", top: "-40%", right: "1%", width: "75px", height: "220%", background: "linear-gradient(180deg, #003A52 0%, #0D4D66 50%, #003A52 100%)", transform: "rotate(20deg)", transformOrigin: "top center", filter: "drop-shadow(0 0 24px rgba(13,148,136,0.2))" }} />
            <div style={{ position: "absolute", top: "-40%", right: "8%", width: "3px", height: "220%", background: "linear-gradient(180deg, transparent 10%, rgba(45,212,191,0.5) 50%, transparent 90%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
            <div style={{ position: "absolute", top: "-35%", right: "16%", width: "55px", height: "220%", background: "linear-gradient(180deg, #5eead4 0%, #2dd4bf 35%, #14b8a6 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.75, filter: "drop-shadow(0 0 32px rgba(45,212,191,0.4))" }} />
            <div style={{ position: "absolute", top: "-35%", right: "24%", width: "3px", height: "220%", background: "linear-gradient(180deg, transparent 10%, hsla(16,95%,58%,0.45) 50%, transparent 90%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
            <div style={{ position: "absolute", top: "-30%", right: "30%", width: "80px", height: "220%", background: "linear-gradient(180deg, hsl(16,100%,62%) 0%, hsl(16,95%,52%) 40%, hsl(16,90%,42%) 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.7, filter: "drop-shadow(0 0 30px hsla(16,95%,55%,0.35))" }} />
          </div>
          <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="max-w-xl">
                <p className="text-sm sm:text-base font-semibold text-primary uppercase tracking-wider mb-4" data-testid="text-about-label">About GetCyberRight</p>
                <h1 id="about-hero-heading" className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.08] mb-6" data-testid="text-about-heading">
                  Digital Safety Has Never
                  <br />Mattered More.
                </h1>
                <p className="text-lg sm:text-xl text-white/55 leading-relaxed mb-6">
                  The world is changing fast. New technology is making scams harder to spot, identity theft easier to pull off, and personal data easier to steal. GetCyberRight gives families, seniors, and small businesses the simple tools and knowledge they need to stay safe online.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/scam-checker">
                    <Button
                      size="lg"
                      className="rounded-lg bg-accent text-accent-foreground border-accent-border shadow-lg shadow-accent/15 font-semibold w-full sm:w-auto"
                      data-testid="button-about-hero-cta"
                    >
                      Try the Scam Checker
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/tools">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-lg border-white/15 text-white bg-white/[0.04] hover:bg-white/[0.08] font-medium w-full sm:w-auto"
                      data-testid="button-about-hero-tools"
                    >
                      Explore All Tools
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden hidden lg:block">
                <img
                  src={familyTogetherImage}
                  alt="Diverse multiracial family using technology safely at home"
                  className="w-full h-[420px] object-cover"
                  loading="eager"
                  data-testid="img-about-family-together"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2A3C]/40 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24" aria-labelledby="problem-heading">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10 sm:mb-14">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-sm font-semibold text-red-500 uppercase tracking-wider">The Problem</span>
              </div>
              <h2 id="problem-heading" className="text-3xl sm:text-4xl font-bold text-foreground mb-5" data-testid="text-problem-heading">
                Online Scams Have Changed. Most People Have Not Caught Up.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The rise of AI has given criminals powerful new tools. Scams that used to be easy to spot are now nearly perfect. Fake emails look real. Cloned voices sound like your family. And your personal data is being sold to anyone willing to pay for it.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-5">
              {threatTypes.map((threat) => (
                <div
                  key={threat.label}
                  className="bg-card border border-border rounded-xl p-6 hover:border-border/80 transition-colors"
                  data-testid={`threat-${threat.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <threat.icon className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-base mb-1.5">{threat.label}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{threat.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-red-500/[0.06] border border-red-500/15 rounded-xl p-6 sm:p-7 flex items-start gap-4" data-testid="text-problem-callout">
              <BadgeAlert className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-base text-foreground/80 leading-relaxed">
                <span className="font-semibold text-foreground">The reality:</span> Anyone can now create convincing scams using free online tools. What used to take a skilled criminal now takes minutes. Learning how to protect yourself online is no longer optional. It is essential for everyone.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24 bg-[#0A2A3C]" aria-labelledby="solution-heading">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10 sm:mb-14">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">The Solution</span>
              </div>
              <h2 id="solution-heading" className="text-3xl sm:text-4xl font-bold text-white mb-5" data-testid="text-solution-heading">
                Simple Tools. Clear Guidance. Real Protection.
              </h2>
              <p className="text-lg text-white/50 leading-relaxed">
                GetCyberRight was built because the people who need online safety the most have the fewest resources. We put scam checking, data removal, and safety training all in one place, designed for everyday people. No confusing language, no expensive subscriptions, and no technical knowledge needed to get started.
              </p>
            </div>

            <div className="space-y-4">
              {platformTools.map((tool) => (
                <Link key={tool.title} href={tool.href}>
                  <div
                    className={`group bg-white/[0.03] border ${tool.borderColor} rounded-xl p-6 sm:p-7 hover:bg-white/[0.05] transition-all cursor-pointer`}
                    data-testid={`solution-${tool.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg ${tool.bg} flex items-center justify-center flex-shrink-0`}>
                        <tool.icon className={`w-6 h-6 ${tool.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-semibold text-lg text-white group-hover:text-primary transition-colors">{tool.title}</h3>
                          <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
                        </div>
                        <p className="text-base text-white/40 leading-relaxed mt-1.5">{tool.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24" aria-labelledby="impact-heading">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-accent" />
                  <span className="text-sm font-semibold text-accent uppercase tracking-wider">Why This Matters</span>
                </div>
                <h2 id="impact-heading" className="text-3xl sm:text-4xl font-bold text-foreground mb-8" data-testid="text-impact-heading">
                  Why This Matters Now More Than Ever
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4 bg-muted/40 rounded-xl p-5 border border-border/60">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone className="w-5 h-5 text-red-400" />
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed">A grandmother who got a phone call that sounded exactly like her grandson, begging for bail money.</p>
                  </div>
                  <div className="flex items-start gap-4 bg-muted/40 rounded-xl p-5 border border-border/60">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <DollarSign className="w-5 h-5 text-amber-400" />
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed">A small business owner who sent $47,000 after a video call with someone who looked just like their boss.</p>
                  </div>
                  <div className="flex items-start gap-4 bg-muted/40 rounded-xl p-5 border border-border/60">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <UserX className="w-5 h-5 text-violet-400" />
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed">A college student whose identity was stolen through a job offer that looked completely legitimate.</p>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed mb-5">
                  These are not made-up stories. They are happening right now. The warning signs people used to rely on are gone. Today's scams are personal, polished, and almost impossible to tell apart from the real thing.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  GetCyberRight was started by a family that went through this firsthand. Hacked accounts, scammers pretending to be relatives, and phone scams that drained a family member's savings. That experience made one thing clear: the people who need protection the most have the fewest resources.
                </p>

                <blockquote className="border-l-4 border-accent pl-6 py-4 text-xl text-foreground font-semibold bg-accent/5 rounded-r-xl mb-6">
                  No family should have to learn online safety the hard way.
                </blockquote>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  That is the mission: make online safety simple, practical, and available to everyone so that a teenager, a grandparent, and a small business owner can all protect themselves without needing a technical background.
                </p>
              </div>
              <div className="relative rounded-xl overflow-hidden lg:sticky lg:top-24">
                <img
                  src={seniorsLearningImage}
                  alt="Seniors being helped to use technology safely with family support"
                  className="w-full h-64 sm:h-80 lg:h-[520px] object-cover"
                  loading="lazy"
                  data-testid="img-about-seniors-learning"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-muted/30" aria-labelledby="credibility-heading">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10 sm:mb-14">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">Platform Coverage</span>
              </div>
              <h2 id="credibility-heading" className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-credibility-heading">
                Built on Trusted Sources. Measured in Results.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every tool on GetCyberRight uses the same trusted safety sources that professionals and law enforcement agencies worldwide rely on.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-5">
              {credibilityStats.map((stat) => (
                <div key={stat.label} className="bg-card border border-border rounded-xl p-6" data-testid={`credibility-${stat.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                  <p className="text-4xl font-bold text-primary mb-1.5 tabular-nums">{stat.value}</p>
                  <p className="font-semibold text-foreground text-base mb-1">{stat.label}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24" aria-labelledby="philosophy-heading">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
              <div className="flex items-center gap-2 justify-center mb-4">
                <Lock className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Philosophy</span>
              </div>
              <h2 id="philosophy-heading" className="text-3xl sm:text-4xl font-bold text-foreground mb-5" data-testid="text-philosophy-heading">
                Staying Safe Online Should Not Be Complicated
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The knowledge to prevent most scams already exists, but it has been locked away in technical language and expensive tools built for large companies. We believe everyone deserves access to it, in words they can understand.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-xl p-7 text-center" data-testid="philosophy-accessible">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Globe className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Accessible to Everyone</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Every core tool and guide is free to use. No login walls for scam checking. No credit card required. We believe access to safety should not depend on your budget.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-7 text-center" data-testid="philosophy-transparent">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Eye className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Transparent and Trustworthy</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  We never sell your data. We never use scare tactics to pressure you. Our tools use trusted, public security sources and we are upfront about how everything works.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-7 text-center" data-testid="philosophy-community">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Community Driven</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  The best way to support GetCyberRight is to share it with someone who needs it. A parent, a grandparent, a friend, a small business. That is how we grow, one person at a time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-20 sm:py-24 overflow-hidden">
          <img
            src={ctaBackgroundImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            aria-hidden="true"
            data-testid="img-cta-background"
          />
          <div className="absolute inset-0 bg-primary/85" />
          <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5" data-testid="text-cta-heading">
              Start Protecting Yourself Today
            </h2>
            <p className="text-white/80 text-xl max-w-2xl mx-auto mb-8">
              No account required. Paste a suspicious message into our Scam Checker, browse our guides, or start a training course. Pick a tool and go.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/scam-checker">
                <Button size="lg" variant="secondary" className="rounded-lg font-semibold w-full sm:w-auto" data-testid="button-about-cta">
                  Check a Scam Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/tools">
                <Button size="lg" variant="outline" className="rounded-lg border-white/40 text-white bg-white/10 hover:bg-white/20 w-full sm:w-auto" data-testid="button-about-tools">
                  Explore All Tools
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}
