import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Newsletter } from "@/components/newsletter";
import { PageBanner } from "@/components/page-banner";
import { Link } from "wouter";
import { Shield, Heart, Users, Globe, ArrowRight } from "lucide-react";
import bannerImage from "@/assets/banners/about-banner.png";

const values = [
  {
    icon: Shield,
    title: "Protection First",
    description: "Everyone deserves to feel safe online, regardless of technical ability."
  },
  {
    icon: Heart,
    title: "Family Centered",
    description: "Built for real families, from grandparents to kids on their first devices."
  },
  {
    icon: Users,
    title: "No Jargon",
    description: "Plain language that anyone can understand, no computer science degree required."
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Serving families across six continents who face the same threats we do."
  }
];

const stats = [
  { value: "6", label: "Continents Served" },
  { value: "100%", label: "Free Resources" },
  { value: "24/7", label: "Access Available" },
  { value: "0", label: "Technical Jargon" }
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <PageBanner
          title="A Mission Born from Personal Experience"
          subtitle="We watched our own family members fall victim to scams. That's why we built something different—clear guidance from people who understand what's at stake."
          imageSrc={bannerImage}
          imageAlt="Diverse GetCyberRight team with African woman leader in the center, all wearing branded red shirts in a modern office"
          imagePosition="left"
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
                  Six years ago, I watched members of my own family lose 
                  access to their social media accounts because of hacking and 
                  identity theft. Hackers took control of those accounts and used 
                  them to impersonate my relatives, sending messages asking for money.
                </p>
                
                <p>
                  My father was targeted multiple times by fake telecom "anti-fraud" 
                  calls that claimed to help secure his bank account, but instead 
                  led to his accounts being wiped out again and again.
                </p>
                
                <p>
                  What became clear was that this wasn't just happening to us. 
                  <span className="text-foreground font-medium"> Millions of families 
                  are dealing with the same attacks</span>, often on their own, without 
                  knowing who to trust or where to turn for help.
                </p>
                
                <p>
                  At the same time, my own kids are growing up in a world where 
                  screens are everywhere. They're already on tablets, learning apps, 
                  and asking about social media. The question of what they might 
                  encounter online keeps me up at night.
                </p>
                
                <p>
                  When I searched for resources that could help everyone in my 
                  family, from my kids to aging parents to cousins overseas, I 
                  came up short. Cybersecurity sites were written for corporations, 
                  full of tech jargon nobody could understand.
                </p>
                
                <p className="text-foreground font-semibold text-xl">
                  That's why we built GetCyberRight.
                </p>
                
                <p>
                  We wanted to create free, straightforward tools that anyone can 
                  use to check whether something is a scam, without needing a 
                  technical background or a computer science degree.
                </p>
                
                <blockquote className="border-l-4 border-accent pl-6 py-2 italic text-foreground not-italic font-medium bg-accent/5 rounded-r-lg">
                  "My hope is that no family has to learn these lessons the hard way."
                </blockquote>
                
                <p className="text-lg font-medium text-foreground">
                  Today, GetCyberRight serves families across six continents. From 
                  grandparents targeted by phone scams to kids navigating their 
                  first devices, we are here to help.
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
                Ready to Protect Your Family?
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">
                Start with our free tools and resources. No signup required, 
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
