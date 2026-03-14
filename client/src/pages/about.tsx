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
  description: "The explosion of AI has made cybersecurity essential for everyone. GetCyberRight gives families, seniors, and small businesses practical tools and plain-language education to protect themselves from modern threats.",
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
  { icon: Mail, label: "Phishing at Scale", description: "AI tools now generate flawless phishing emails with perfect grammar, real branding, and personalized details. The old advice to 'look for typos' no longer works." },
  { icon: UserX, label: "Deepfake Impersonation", description: "Voice cloning and video deepfakes allow criminals to impersonate family members, executives, and government officials with alarming accuracy." },
  { icon: Heart, label: "Romance & Social Engineering", description: "Sophisticated social engineering scams build trust over weeks or months, often using AI chatbots to target thousands of victims at once." },
  { icon: Landmark, label: "Crypto & Investment Fraud", description: "Fake trading platforms with fabricated testimonials and deepfake celebrity endorsements are designed to look indistinguishable from legitimate services." },
  { icon: Phone, label: "Voice Cloning Scams", description: "A family member's voice can now be cloned from just a few seconds of audio, then used to make urgent calls requesting money." },
  { icon: Eye, label: "Data Broker Exposure", description: "Over 501 companies collect and sell your personal information to anyone willing to pay, giving criminals the details they need to make attacks convincing." },
];

const platformTools = [
  {
    icon: ScanLine,
    title: "Scam Checker",
    description: "Paste any suspicious message, email, link, or phone number. It cross-references 8 live threat intelligence feeds and analyzes the content for social engineering patterns to give you a clear risk breakdown.",
    href: "/scam-checker",
    color: "text-red-400",
    bg: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  {
    icon: Trash2,
    title: "Data Broker Removal",
    description: "We track 501+ companies that buy and sell your personal data. Step-by-step instructions to remove yourself from each one.",
    href: "/data-removal",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    borderColor: "border-teal-500/20",
  },
  {
    icon: GraduationCap,
    title: "Training Academy",
    description: "Structured courses that teach you how modern scams work and how to recognize them, designed for all skill levels.",
    href: "/training",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    icon: Zap,
    title: "AI Safety Prompt Library",
    description: "406+ ready-to-use prompts that help you use AI tools like ChatGPT safely, without accidentally exposing sensitive information.",
    href: "/ai-prompts",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    icon: FileText,
    title: "Cybersecurity Guides",
    description: "125+ plain-language guides covering password security, two-factor authentication, safe browsing, and protecting your devices.",
    href: "/guides",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
  },
];

const credibilityStats = [
  { value: "501+", label: "Data Brokers Tracked", detail: "Companies monitored for selling personal data" },
  { value: "406+", label: "AI Safety Prompts", detail: "Ready-to-use prompts for secure AI usage" },
  { value: "125+", label: "Safety Guides", detail: "Plain-language cybersecurity resources" },
  { value: "8", label: "Threat Intelligence Feeds", detail: "Real-time data from PhishTank, URLhaus, VirusTotal, and more" },
  { value: "13", label: "Regions Covered", detail: "Scam alerts localized for regions worldwide" },
  { value: "52+", label: "Scam Categories", detail: "Detailed guides on specific scam types" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.about} />
      <StructuredData data={[aboutArticleSchema, aboutBreadcrumbs]} />
      <Navigation />

      <main id="main-content" tabIndex={-1}>

        <section className="bg-slate-900 relative overflow-hidden" aria-labelledby="about-hero-heading">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/[0.03] to-transparent" />
          <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="max-w-xl">
                <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4" data-testid="text-about-label">About GetCyberRight</p>
                <h1 id="about-hero-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] mb-6" data-testid="text-about-heading">
                  Digital Safety Has Never
                  <br />Mattered More.
                </h1>
                <p className="text-lg text-white/55 leading-relaxed mb-6">
                  The explosion of AI is transforming everything, including how criminals operate. Scams are more sophisticated, identity theft is easier, and personal data is more exposed than ever. GetCyberRight gives families, seniors, and small businesses the practical tools and knowledge they need to stay safe in this new reality.
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
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
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
              <h2 id="problem-heading" className="text-2xl sm:text-3xl font-bold text-foreground mb-4" data-testid="text-problem-heading">
                The Threat Landscape Has Fundamentally Changed
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The rise of AI has supercharged the tools available to cybercriminals. Scams that once required skilled hackers can now be generated at scale by anyone with access to freely available AI tools. Phishing emails are flawless. Deepfake voices sound real. And personal data is more exposed than ever.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {threatTypes.map((threat) => (
                <div
                  key={threat.label}
                  className="bg-card border border-border rounded-xl p-5 hover:border-border/80 transition-colors"
                  data-testid={`threat-${threat.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <threat.icon className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm mb-1">{threat.label}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{threat.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-red-500/[0.06] border border-red-500/15 rounded-xl p-5 sm:p-6 flex items-start gap-3.5" data-testid="text-problem-callout">
              <BadgeAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground/80 leading-relaxed">
                <span className="font-semibold text-foreground">The reality:</span> The explosion of AI has lowered the barrier for cybercrime dramatically. What once required technical skill now takes minutes with freely available tools. Cybersecurity education and accessible protection tools are no longer optional. They are essential for everyone.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24 bg-slate-900" aria-labelledby="solution-heading">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10 sm:mb-14">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">The Solution</span>
              </div>
              <h2 id="solution-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4" data-testid="text-solution-heading">
                Practical Tools. Plain-Language Education.
              </h2>
              <p className="text-white/50 leading-relaxed">
                GetCyberRight was built because the people who need cybersecurity the most have the fewest resources. We combine scam detection, data broker removal, and safety education into one platform designed for non-technical users. No jargon, no enterprise pricing, no technical expertise required to get started.
              </p>
            </div>

            <div className="space-y-4">
              {platformTools.map((tool) => (
                <Link key={tool.title} href={tool.href}>
                  <div
                    className={`group bg-white/[0.03] border ${tool.borderColor} rounded-xl p-5 sm:p-6 hover:bg-white/[0.05] transition-all cursor-pointer`}
                    data-testid={`solution-${tool.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-lg ${tool.bg} flex items-center justify-center flex-shrink-0`}>
                        <tool.icon className={`w-5 h-5 ${tool.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-semibold text-white group-hover:text-primary transition-colors">{tool.title}</h3>
                          <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
                        </div>
                        <p className="text-sm text-white/40 leading-relaxed mt-1">{tool.description}</p>
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
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-accent" />
                  <span className="text-sm font-semibold text-accent uppercase tracking-wider">Why This Matters</span>
                </div>
                <h2 id="impact-heading" className="text-2xl sm:text-3xl font-bold text-foreground mb-6" data-testid="text-impact-heading">
                  Why This Matters Now More Than Ever
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    A grandmother who received a phone call in her grandson's cloned voice begging for bail money. A small business owner who wired $47,000 after a deepfake video call with someone who looked exactly like their CEO. A college student whose identity was stolen through a job offer so polished it passed every red-flag check.
                  </p>
                  <p>
                    These are not hypothetical scenarios. They are happening right now. The explosion of AI has removed the telltale signs that people used to rely on to spot scams: bad grammar, obvious fakes, generic messages. Today's attacks are personalized, polished, and nearly indistinguishable from legitimate communication. Digital safety education is no longer a nice-to-have. It is a necessity.
                  </p>
                  <p>
                    GetCyberRight was started by a family that experienced these threats firsthand. Hacked social media accounts, impersonation scams targeting relatives, and repeated phone fraud that drained a family member's savings. That experience made one thing clear: the people who need cybersecurity the most have the fewest resources to protect themselves.
                  </p>
                  <blockquote className="border-l-4 border-accent pl-5 py-2 text-foreground font-medium bg-accent/5 text-lg rounded-r-lg">
                    No family should have to learn cybersecurity the hard way.
                  </blockquote>
                  <p>
                    That is the mission: make digital safety simple, practical, and accessible so that a teenager, a grandparent, and a small business owner can all protect themselves without technical expertise.
                  </p>
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={seniorsLearningImage}
                  alt="Seniors being helped to use technology safely with family support"
                  className="w-full h-64 sm:h-80 lg:h-[440px] object-cover"
                  loading="lazy"
                  data-testid="img-about-seniors-learning"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
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
              <h2 id="credibility-heading" className="text-2xl sm:text-3xl font-bold text-foreground mb-3" data-testid="text-credibility-heading">
                Built on Verified Sources. Measured in Results.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Every tool on GetCyberRight is powered by the same threat intelligence that enterprise security teams rely on, including data from FBI IC3, CISA, INTERPOL, Europol, NIST, PhishTank, and VirusTotal.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {credibilityStats.map((stat) => (
                <div key={stat.label} className="bg-card border border-border rounded-xl p-5" data-testid={`credibility-${stat.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                  <p className="text-3xl font-bold text-primary mb-1 tabular-nums">{stat.value}</p>
                  <p className="font-semibold text-foreground text-sm mb-1">{stat.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{stat.detail}</p>
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
              <h2 id="philosophy-heading" className="text-2xl sm:text-3xl font-bold text-foreground mb-4" data-testid="text-philosophy-heading">
                Cybersecurity Should Not Require a Degree
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The biggest gap in cybersecurity is not technology. It is accessibility. The knowledge exists to prevent most scams, but it is locked behind corporate firewalls and technical jargon. We are changing that.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-xl p-6 text-center" data-testid="philosophy-accessible">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Accessible to Everyone</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every core tool and guide is free to use. No login walls for scam checking. No credit card required. We believe access to safety should not depend on your budget.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center" data-testid="philosophy-transparent">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Transparent and Trustworthy</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We never sell your data. We never use fear-based marketing. Our tools are powered by verified, public threat intelligence sources that anyone can audit.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center" data-testid="philosophy-community">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Community Driven</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
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
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" data-testid="text-cta-heading">
              Start Protecting Yourself Today
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
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
