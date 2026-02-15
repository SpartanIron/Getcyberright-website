import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Shield, 
  Users, 
  Heart,
  ArrowRight,
  Lock,
  Eye,
  Ban,
  Search,
  BookOpen,
  GraduationCap,
  Trash2,
  Mic,
  Key,
  FileText
} from "lucide-react";
import { Link } from "wouter";
import bannerImage from "@/assets/banners/pricing-banner.png";

const allFreeTools = [
  { icon: Search, name: "Scam Checker", description: "Check suspicious emails, texts, URLs, QR codes, and phone numbers" },
  { icon: Trash2, name: "Data Broker Removal", description: "Scan and remove your info from 500+ data broker sites" },
  { icon: Mic, name: "Deepfake Voice Detector", description: "Detect AI-generated voice clones in suspicious calls" },
  { icon: Key, name: "Password Generator", description: "Create strong, unique passwords for every account" },
  { icon: Shield, name: "Family Safety Codewords", description: "Secret phrases to verify your family's identity during suspicious calls" },
  { icon: GraduationCap, name: "Training Academy", description: "Full courses with quizzes and certificates for every skill level" },
  { icon: BookOpen, name: "Resource Library", description: "Guides, articles, checklists, and printable materials" },
  { icon: FileText, name: "Safety Score Assessment", description: "Evaluate your personal cybersecurity habits" },
];

const trustPromises = [
  { icon: Ban, title: "No Hidden Fees", description: "Every tool, every guide, every course. No trial periods, no premium tiers, no upsells." },
  { icon: Lock, title: "No Data Selling", description: "We never sell your personal information. Your data stays yours." },
  { icon: Eye, title: "No Tracking", description: "We do not use behavioral tracking or sell your browsing habits to advertisers." },
  { icon: Heart, title: "Family First", description: "We exist to protect families. Kids, parents, grandparents. Real people, not corporations." },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Our Promise - Everything Free | GetCyberRight"
        description="Every tool, guide, and course on GetCyberRight is free. No hidden fees, no premium tiers. Your family's safety should never have a price tag."
        keywords="free cybersecurity tools, free scam checker, family safety free"
      />
      <Navigation />
      
      <main id="main-content" tabIndex={-1}>
        <PageBanner
          title="Our Promise to You"
          subtitle="Every tool. Every guide. Every course. Because your family's safety should never have a price tag."
          imageSrc={bannerImage}
          imageAlt="Shield protecting a family online"
          imagePosition="right"
          colorVariant="teal"
        />

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 no-default-hover-elevate no-default-active-elevate">
                No Cost, No Catch
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-promise-heading">
                Cybersecurity Should Not Be a Luxury
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Other services charge $129/year or more for the same tools we give you for free. 
                We believe every family deserves protection, regardless of their budget.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4 mb-16">
              {trustPromises.map((promise, index) => (
                <motion.div
                  key={promise.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full" data-testid={`card-promise-${index}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <promise.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{promise.title}</h3>
                          <p className="text-sm text-muted-foreground">{promise.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4" data-testid="text-tools-heading">
                All of This Is Yours, Free
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                No sign-up walls, no credit cards, no catch. Just tools built to keep your family safe.
              </p>
            </motion.div>

            <div className="space-y-3">
              {allFreeTools.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card data-testid={`card-tool-${index}`}>
                    <CardContent className="py-4 px-5">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                          <tool.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-foreground">{tool.name}</span>
                            <Badge variant="outline" className="text-[10px] text-green-700 dark:text-green-400 border-green-300 dark:border-green-700 no-default-hover-elevate no-default-active-elevate">
                              Free
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{tool.description}</p>
                        </div>
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Who We Built This For</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        GetCyberRight was born from a family's real experience with cybercrime. 
                        We watched our parents get targeted by scammers, worried about our kids 
                        online, and realized that most cybersecurity help was designed for 
                        corporations with big budgets, not for the families who need it most.
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    So we built something different. A platform where parents can check a 
                    suspicious text in seconds. Where grandparents can learn to spot phone scams 
                    in plain language. Where kids can learn digital safety through fun, 
                    age-appropriate lessons. And where none of it costs a dime.
                  </p>
                  <p className="text-foreground font-medium">
                    If you are a parent, a grandparent, a teenager, or just someone trying to 
                    stay safe online, this was made for you.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-primary">
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
                No account required for most tools. Just pick a tool and go.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tools">
                  <Button size="lg" variant="secondary" data-testid="button-promise-tools">
                    Use Our Free Tools
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="border-white/30 text-white bg-transparent" data-testid="button-promise-about">
                    Read Our Story
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
