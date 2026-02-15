import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Newsletter } from "@/components/newsletter";
import { PageBanner } from "@/components/page-banner";
import { InlinePromoVideo } from "@/components/inline-promo-video";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import bannerImage from "@/assets/banners/about-banner.png";
import familySecurityImage from "@/assets/images/about-family-security.jpg";
import seniorsLearningImage from "@/assets/images/professional-black-woman.png";

const stats = [
  { value: "100%", label: "Free Forever" },
  { value: "Global", label: "Family Reach" },
  { value: "24/7", label: "Access Available" },
  { value: "0", label: "Technical Jargon" }
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.about} />
      <Navigation />
      
      <main id="main-content" tabIndex={-1}>
        <PageBanner
          title="Our Story: Why We Built GetCyberRight"
          subtitle="Free cybersecurity tools built by a family, for families. Every parent, every grandparent, every child deserves protection they can understand and trust."
          imageSrc={bannerImage}
          imageAlt="Diverse GetCyberRight team with African woman leader in the center, all wearing branded red shirts in a modern office"
          imagePosition="left"
          colorVariant="slate"
        />

        <section className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="prose prose-lg max-w-none"
            >
              <div className="space-y-6 text-muted-foreground leading-relaxed">
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
                
                <p>
                  At the same time, my own children were growing up in a world where 
                  screens are everywhere. They're already on tablets, exploring learning 
                  apps, and asking about social media. The thought of what they might 
                  encounter online keeps me up at night.
                </p>

                <div className="my-8 rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={familySecurityImage} 
                    alt="Family learning together about online safety"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                    data-testid="img-about-family-security"
                  />
                </div>
                
                <p>
                  When I searched for resources that could protect everyone in my 
                  family, from my kids to older parents to cousins overseas, I came 
                  up short. Cybersecurity information was written for corporations, 
                  buried in technical jargon that ordinary people couldn't understand.
                </p>
                
                <p className="text-foreground font-semibold text-xl">
                  That's why we built GetCyberRight.
                </p>

                <InlinePromoVideo
                  src="/videos/promo-about.mp4"
                  poster="/videos/poster-about.png"
                  className="my-8"
                />
                
                <p>
                  We set out to create straightforward tools that anyone can 
                  use to determine whether something is a scam, without needing a 
                  technical background or a computer science degree.
                </p>

                <p>
                  Along the way, we discovered that small business owners face the 
                  same challenges. They need enterprise-grade security knowledge but 
                  often lack dedicated IT teams or massive budgets. A single phishing 
                  email can devastate a small business just as easily as it can 
                  empty a family's savings.
                </p>
                
                <p className="border-l-4 border-accent pl-6 py-2 text-foreground font-medium bg-accent/5 rounded-r-lg">
                  My hope is that no family or business has to learn these lessons the hard way.
                </p>

                <div className="my-8 rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={seniorsLearningImage} 
                    alt="Senior learning technology with family support"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                    data-testid="img-about-seniors-learning"
                  />
                </div>
                
                <p className="text-lg font-medium text-foreground">
                  Today, GetCyberRight serves families around the world. From 
                  grandparents targeted by phone scams to parents keeping kids safe 
                  online, we are here to help. Every tool is free because we believe 
                  no family should have to pay to feel safe. Start with our Scam 
                  Checker, or explore resources designed for you.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <p className="text-4xl sm:text-5xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">How We Operate</h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-8">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Every tool, every guide, and every course on GetCyberRight is completely 
                    free. No premium tiers, no hidden fees, no paywalls. We believe 
                    cybersecurity should be accessible to every family, regardless of their 
                    budget.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We are supported by community contributions and carefully selected 
                    partners who share our mission. We never sell your data, we never use 
                    fear-based marketing, and we are fully transparent about how we operate. 
                    Your trust is everything to us.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    If you find our tools helpful, the best way to support us is to share 
                    GetCyberRight with someone who needs it. A parent, a grandparent, a 
                    neighbor. That is how we grow, one family at a time.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Start Protecting Your Family Today
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">
                Every tool is free. No account required for most. Just pick a tool and go.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tools">
                  <Button size="lg" variant="secondary" data-testid="button-about-cta">
                    Explore Our Tools
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white/30 text-white bg-transparent" data-testid="button-about-contact">
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
