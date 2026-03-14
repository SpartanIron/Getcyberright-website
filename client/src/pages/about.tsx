import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Newsletter } from "@/components/newsletter";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { StructuredData } from "@/components/structured-data";
import type { ArticleData, BreadcrumbData } from "@/components/structured-data";
import { Link } from "wouter";
import { ArrowRight, Shield, Heart, DollarSign, Eye, Users, BookOpen, CheckCircle, Globe, Zap } from "lucide-react";
import familyTogetherImage from "@/assets/images/about-family-together.png";
import seniorsLearningImage from "@/assets/images/about-seniors-learning.png";
import ctaBackgroundImage from "@/assets/images/about-cta-background.png";

const aboutArticleSchema: ArticleData = {
  type: "Article",
  headline: "Our Story: Why We Built GetCyberRight",
  description: "Cybersecurity tools built by a family, for families. Every parent, every grandparent, every child deserves protection they can understand and trust.",
  datePublished: "2024-01-15",
  dateModified: "2026-02-01",
  author: { name: "GetCyberRight", url: "https://getcyberright.com" },
  publisher: { name: "GetCyberRight", logo: "https://getcyberright.com/og-image.png" },
};

const aboutBreadcrumbs: BreadcrumbData = {
  type: "BreadcrumbList",
  items: [
    { name: "Home", url: "https://getcyberright.com/" },
    { name: "About Us", url: "https://getcyberright.com/about" },
  ],
};

const stats = [
  { value: "406+", label: "AI Safety Prompts", icon: BookOpen },
  { value: "501+", label: "Data Brokers Tracked", icon: Eye },
  { value: "8", label: "Live Threat Feeds", icon: Shield },
  { value: "$0", label: "Free to Get Started", icon: DollarSign },
];

const principles = [
  {
    icon: DollarSign,
    title: "Free to Get Started",
    description: "Every core tool, guide, and course on GetCyberRight is free. We believe cybersecurity education should be accessible to every family, regardless of their budget.",
  },
  {
    icon: Eye,
    title: "Full Transparency",
    description: "We are sustained through trusted partnerships with organizations who share our mission. We never sell your data, never use fear-based marketing, and are fully transparent about how we operate.",
  },
  {
    icon: Heart,
    title: "Community Powered",
    description: "If you find our tools helpful, the best way to support us is to share GetCyberRight with someone who needs it. A parent, a grandparent, a neighbor. That is how we grow, one family at a time.",
  },
];

const whatWeDo = [
  { icon: Zap, title: "AI-Powered Scam Detection", description: "Our scam checker analyzes URLs, emails, phone numbers, and messages against 8 verified threat intelligence feeds in real time." },
  { icon: Shield, title: "Data Broker Removal", description: "We track 501+ data brokers that sell your personal information and walk you through removing your data from each one." },
  { icon: BookOpen, title: "Plain-Language Education", description: "Guides, courses, and resources written for real people. No jargon, no assumptions about technical knowledge." },
  { icon: Globe, title: "Global Threat Intelligence", description: "Region-aware scam alerts and threat data covering 13 regions worldwide, sourced from FBI IC3, CISA, INTERPOL, Europol, and more." },
  { icon: Users, title: "Audience-Specific Content", description: "Dedicated hubs for parents, seniors, kids, educators, and small businesses with content tailored to each group's needs." },
  { icon: CheckCircle, title: "Trusted Sources", description: "Every tool and guide is backed by the same intelligence sources that large enterprises rely on: NIST, CISA, FTC, and leading cybersecurity research." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.about} />
      <StructuredData data={[aboutArticleSchema, aboutBreadcrumbs]} />
      <Navigation />

      <main id="main-content" tabIndex={-1}>
        <section className="bg-slate-900 py-16 sm:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">About GetCyberRight</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] mb-6" data-testid="text-about-heading">
                Built by a Family,
                <br />for Families.
              </h1>
              <p className="text-lg sm:text-xl text-white/60 leading-relaxed max-w-2xl">
                Every parent, every grandparent, every child deserves cybersecurity protection they can understand and trust. That conviction is why GetCyberRight exists.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20" aria-labelledby="story-heading-1">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <h2 id="story-heading-1" className="text-2xl sm:text-3xl font-bold text-foreground mb-6" data-testid="text-story-heading">
                  It Started With Our Own Family
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p className="text-lg">
                    Since 2020, my family has been on the front lines of a growing
                    crisis. It started during the pandemic, when the world moved
                    online almost overnight, and cyber scams and digital fraud
                    skyrocketed along with it.
                  </p>
                  <p>
                    Hackers took over my relatives' social media accounts and used them
                    to impersonate people we trusted, sending messages to friends and
                    family asking for money. My father was targeted repeatedly by fake
                    telecom "anti-fraud" calls that claimed to secure his bank account,
                    but instead drained his savings more than once.
                  </p>
                  <p>
                    As COVID-19 kept people isolated at home, criminals seized the
                    opportunity. <span className="text-foreground font-medium">Millions
                    of families found themselves under attack</span>, often alone, unsure
                    who to trust, and with nowhere to turn for help.
                  </p>
                </div>
              </div>

              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={familyTogetherImage}
                  alt="Diverse multiracial family feeling safe and connected at home"
                  className="w-full h-64 sm:h-80 lg:h-[400px] object-cover"
                  loading="lazy"
                  data-testid="img-about-family-together"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-muted/30" aria-labelledby="story-heading-2">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="order-2 lg:order-1 relative rounded-xl overflow-hidden">
                <img
                  src={seniorsLearningImage}
                  alt="Seniors being helped to use technology safely"
                  className="w-full h-64 sm:h-80 lg:h-[400px] object-cover"
                  loading="lazy"
                  data-testid="img-about-seniors-learning"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <div className="order-1 lg:order-2">
                <h2 id="story-heading-2" className="text-2xl sm:text-3xl font-bold text-foreground mb-6" data-testid="text-mission-heading">
                  Why GetCyberRight Exists
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    At the same time, my own children were growing up in a world where
                    screens are everywhere. They're already on tablets, exploring learning
                    apps, and asking about social media. The thought of what they might
                    encounter online keeps me up at night.
                  </p>
                  <p>
                    When I searched for resources that could protect everyone in my
                    family, from my kids to older parents to cousins overseas, I came
                    up short. Cybersecurity information was written for corporations,
                    buried in technical jargon that ordinary people couldn't understand.
                  </p>
                  <p className="text-foreground font-semibold text-xl">
                    That's why we built GetCyberRight.
                  </p>
                  <p>
                    We set out to create straightforward tools that anyone can
                    use to determine whether something is a scam, without needing a
                    technical background or a computer science degree.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="space-y-4 text-muted-foreground leading-relaxed text-center">
              <p className="text-lg">
                Along the way, we discovered that small business owners face the
                same challenges. They need enterprise-grade security knowledge but
                often lack dedicated IT teams or massive budgets. A single phishing
                email can devastate a small business just as easily as it can
                empty a family's savings.
              </p>
              <blockquote className="border-l-4 border-accent pl-6 py-3 text-foreground font-medium bg-accent/5 text-left text-lg my-8 rounded-r-lg">
                My hope is that no family or business has to learn these lessons the hard way.
              </blockquote>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-16 bg-slate-900">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center" data-testid={`stat-${index}`}>
                  <div className="w-11 h-11 rounded-lg bg-white/[0.06] flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold text-white mb-1 tabular-nums">{stat.value}</p>
                  <p className="text-white/45 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20" aria-labelledby="what-we-do-heading">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10 sm:mb-14">
              <h2 id="what-we-do-heading" className="text-2xl sm:text-3xl font-bold text-foreground mb-3" data-testid="text-what-we-do-heading">
                What We Do
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                GetCyberRight combines real-time threat intelligence with plain-language education to protect people who are often overlooked by traditional cybersecurity solutions.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
              {whatWeDo.map((item) => (
                <div key={item.title} className="flex items-start gap-3.5" data-testid={`about-capability-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-muted/30" aria-labelledby="principles-heading">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10 sm:mb-14">
              <h2 id="principles-heading" className="text-2xl sm:text-3xl font-bold text-foreground mb-3" data-testid="text-principles-heading">
                How We Operate
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Three guiding principles keep us accountable to every family we serve.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {principles.map((item, index) => (
                <div key={item.title} className="bg-card border border-border rounded-xl p-7" data-testid={`text-principle-${index}`}>
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
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
              Start Protecting Your Family Today
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              No account required for most tools. Just pick one and go.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tools">
                <Button size="lg" variant="secondary" className="rounded-lg font-semibold w-full sm:w-auto" data-testid="button-about-cta">
                  Explore Our Tools
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="rounded-lg border-white/40 text-white bg-white/10 hover:bg-white/20 w-full sm:w-auto" data-testid="button-about-contact">
                  Contact Us
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
