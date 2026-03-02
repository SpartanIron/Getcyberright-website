import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Newsletter } from "@/components/newsletter";
import { PageBanner } from "@/components/page-banner";
import { InlinePromoVideo } from "@/components/inline-promo-video";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { StructuredData } from "@/components/structured-data";
import type { ArticleData, BreadcrumbData } from "@/components/structured-data";
import { Link } from "wouter";
import { ArrowRight, Shield, Heart, DollarSign, Eye, Users, BookOpen } from "lucide-react";
import bannerImage from "@/assets/banners/about-banner.png";
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
  { value: "6", label: "Live Threat Feeds", icon: Shield },
  { value: "$0", label: "Free to Get Started", icon: DollarSign },
];

const principles = [
  {
    icon: DollarSign,
    title: "100% Free, Always",
    description: "Every tool, guide, and course on GetCyberRight is free to use. We believe cybersecurity education should be accessible to every family, regardless of their budget.",
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

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.about} />
      <StructuredData data={[aboutArticleSchema, aboutBreadcrumbs]} />
      <Navigation />
      
      <main id="main-content" tabIndex={-1}>
        <PageBanner
          title="Our Story: Why We Built GetCyberRight"
          subtitle="Cybersecurity tools built by a family, for families. Every parent, every grandparent, every child deserves protection they can understand and trust."
          imageSrc={bannerImage}
          imageAlt="Diverse GetCyberRight team with African woman leader in the center, all wearing branded red shirts in a modern office"
          imagePosition="left"
          colorVariant="slate"
        />

        <section className="py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6" data-testid="text-story-heading">
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl"
              >
                <img
                  src={familyTogetherImage}
                  alt="Diverse multiracial family feeling safe and connected at home"
                  className="w-full h-56 sm:h-80 lg:h-96 object-cover"
                  loading="lazy"
                  data-testid="img-about-family-together"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="order-2 lg:order-1 relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl"
              >
                <img
                  src={seniorsLearningImage}
                  alt="Seniors being helped to use technology safely"
                  className="w-full h-56 sm:h-80 lg:h-96 object-cover"
                  loading="lazy"
                  data-testid="img-about-seniors-learning"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="order-1 lg:order-2"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6" data-testid="text-mission-heading">
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
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center mb-6"
            >
              <InlinePromoVideo
                src="/videos/promo-about.mp4"
                poster="/videos/poster-about.png"
                className="my-4"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-3xl mx-auto"
            >
              <div className="space-y-4 text-muted-foreground leading-relaxed text-center">
                <p>
                  Along the way, we discovered that small business owners face the 
                  same challenges. They need enterprise-grade security knowledge but 
                  often lack dedicated IT teams or massive budgets. A single phishing 
                  email can devastate a small business just as easily as it can 
                  empty a family's savings.
                </p>
                <p className="border-l-4 border-accent pl-6 py-3 text-foreground font-medium bg-accent/5 text-left text-lg">
                  My hope is that no family or business has to learn these lessons the hard way.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  data-testid={`stat-${index}`}
                >
                  <Card className="text-center h-full">
                    <CardContent className="p-6 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <stat.icon className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-3xl sm:text-4xl font-bold text-primary mb-1">{stat.value}</p>
                      <p className="text-muted-foreground text-sm">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3" data-testid="text-principles-heading">How We Operate</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Our guiding principles keep us accountable to every family we serve.</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {principles.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full text-center">
                    <CardContent className="p-8">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                        <item.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg text-foreground mb-3" data-testid={`text-principle-${index}`}>{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-20 sm:py-28 overflow-hidden">
          <img
            src={ctaBackgroundImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            aria-hidden="true"
            data-testid="img-cta-background"
          />
          <div className="absolute inset-0 bg-primary/85" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-cta-heading">
                Start Protecting Your Family Today
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
                No account required for most tools. Just pick one and go.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto">
                <Link href="/tools" className="block">
                  <Button size="lg" variant="secondary" className="w-full" data-testid="button-about-cta">
                    Explore Our Tools
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/contact" className="block">
                  <Button size="lg" variant="outline" className="w-full border-white/40 text-white bg-white/10" data-testid="button-about-contact">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <Newsletter />
      </main>
      
      <Footer />
    </div>
  );
}
