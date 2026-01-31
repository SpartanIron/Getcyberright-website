import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Newsletter } from "@/components/newsletter";
import { PageBanner } from "@/components/page-banner";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { Link } from "wouter";
import { Shield, Heart, Users, Globe, ArrowRight } from "lucide-react";
import bannerImage from "@/assets/banners/about-banner.png";
import familySecurityImage from "@/assets/images/about-family-security.jpg";
import seniorsLearningImage from "@/assets/images/seniors-learning-tech.jpg";

const values = [
  {
    icon: Shield,
    title: "People First Protection",
    description: "We protect what matters most: you. Security that follows you beyond the devices you use."
  },
  {
    icon: Heart,
    title: "Family Safety for Every Generation",
    description: "Cyber threats affect everyone. We prioritize protecting your entire family from digital risks."
  },
  {
    icon: Users,
    title: "Clarity Over Confusion",
    description: "Trusted guidance through plain language education. No technical jargon, just clear knowledge you can act on."
  },
  {
    icon: Globe,
    title: "Real World Protection",
    description: "Practical security for real lives. Not theoretical concepts, but actionable protection you can use today."
  }
];

const stats = [
  { value: "Global", label: "Reach" },
  { value: "Free", label: "Core Tools" },
  { value: "24/7", label: "Access Available" },
  { value: "0", label: "Technical Jargon" }
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.about} />
      <Navigation />
      
      <main tabIndex={-1}>
        <PageBanner
          title="A Cyber Protection Powerhouse Built to Protect People"
          subtitle="We go beyond securing devices, accounts, and data. We focus on protecting individuals, families, and digital identities in a world where cyber risk is personal and constantly evolving."
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
                  For the past six years, my family has been on the front lines of 
                  a growing crisis. It started during the pandemic, when the world 
                  moved online almost overnight, and cyber scams and digital fraud 
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

                {/* Visual break - family security image */}
                <div className="my-8 rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={familySecurityImage} 
                    alt="Family learning together about online safety"
                    className="w-full h-auto object-cover"
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

                {/* Visual break - seniors learning image */}
                <div className="my-8 rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={seniorsLearningImage} 
                    alt="Senior learning technology with family support"
                    className="w-full h-auto object-cover"
                    data-testid="img-about-seniors-learning"
                  />
                </div>
                
                <p className="text-lg font-medium text-foreground">
                  Today, GetCyberRight serves families and small businesses around 
                  the world. From grandparents targeted by phone scams to 
                  entrepreneurs protecting customer data, we are here to help. Start 
                  with our Scam Checker tool, or explore resources designed for you.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-card border-y">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These principles guide everything we create at GetCyberRight.
              </p>
            </motion.div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover-elevate" data-testid={`value-${index}`}>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <value.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24">
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

        <section className="py-16 sm:py-24 bg-muted/30">
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
                    GetCyberRight is supported by carefully selected advertising partners, 
                    corporate partnerships, and premium subscriptions. This sustainable 
                    business model allows us to keep our core tools and educational 
                    resources accessible to everyone who needs them.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We only work with advertisers whose products genuinely help protect 
                    users. We never use fear-based marketing, and we are transparent 
                    about sponsored content. Your trust is more important than any 
                    advertising revenue.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    If you are interested in partnering with us or advertising on our 
                    platform, please visit our{" "}
                    <Link href="/partnerships" className="text-primary hover:underline">
                      Partnerships
                    </Link>{" "}
                    or{" "}
                    <Link href="/advertising" className="text-primary hover:underline">
                      Advertising
                    </Link>{" "}
                    pages.
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
                Ready to Get Started?
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">
                Explore our tools and resources. No signup required, 
                no technical knowledge needed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tools">
                  <Button size="lg" variant="secondary" data-testid="button-about-cta">
                    Get Free Protection Tools
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
