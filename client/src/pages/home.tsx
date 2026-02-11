import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { LogoCarousel } from "@/components/logo-carousel";
import { AudienceShowcase } from "@/components/audience-showcase";
import { MissionBanner } from "@/components/mission-banner";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { ScamChecker } from "@/components/scam-checker";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Shield, 
  ArrowRight, 
  BookOpen,
  Award,
  Brain,
  MessageSquare,
  Zap,
} from "lucide-react";

const learningFeatures = [
  {
    icon: BookOpen,
    title: "Structured Courses",
    description: "Step-by-step learning paths from beginner to advanced, tailored to your experience level.",
  },
  {
    icon: Award,
    title: "Earn Certificates",
    description: "Complete courses and quizzes to earn shareable certificates proving your cyber safety knowledge.",
  },
  {
    icon: Brain,
    title: "AI-Powered Tips",
    description: "Get personalized safety recommendations based on the threats most relevant to you.",
  },
  {
    icon: MessageSquare,
    title: "Real-World Scenarios",
    description: "Practice identifying scams using actual examples so you know what to look for.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="GetCyberRight - Is This a Scam? Free Scam Checker & Cyber Safety Education"
        description="Check suspicious links, messages, and emails instantly with our free AI-powered scam checker. Learn to protect your family from cyber threats with courses for every age group."
        keywords="scam checker, is this a scam, phishing detector, cybersecurity education, online safety, family cyber safety, free scam check"
      />
      <Navigation />

      <main id="main-content" role="main" aria-label="Main content" tabIndex={-1}>
        <HeroSection />

        {/* ===== SCAM CHECKER TOOL ===== */}
        <section className="py-16 sm:py-20 bg-muted/30" data-testid="section-scam-checker-tool">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-wider">Free Scam Detection</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3" data-testid="text-scam-tool-heading">
                Check Something Suspicious
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Paste any link, message, email, or phone number. No account needed.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              data-testid="hero-scam-checker"
            >
              <ScamChecker />
            </motion.div>
          </div>
        </section>

        <LogoCarousel />

        {/* ===== EDUCATION PILLAR ===== */}
        <section className="py-16 sm:py-24 bg-background" data-testid="section-education">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <Badge variant="secondary" className="mb-4 bg-accent/10 text-accent border-0">
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                Training Academy
              </Badge>
              <h2
                className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
                data-testid="text-education-heading"
              >
                Learn to Protect Your Family
              </h2>
              <p className="text-lg text-muted-foreground">
                Free courses designed for real people - not tech experts. 
                Pick your path and start learning in minutes.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {learningFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="hover-elevate h-full" data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s/g, "-")}`}>
                    <CardContent className="p-5">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1.5">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/training">
                <Button size="lg" data-testid="button-explore-training">
                  Explore All Courses
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <AudienceShowcase />
        <MissionBanner />

        {/* ===== BOTTOM CTA ===== */}
        <section className="py-10 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" data-testid="section-cta">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-white" data-testid="text-cta-footer-heading">
                  Got a Suspicious Message Right Now?
                </h2>
                <p className="text-sm text-white/70 mt-1">
                  Don't click. Don't respond. Check it here first - it takes 10 seconds.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/scam-checker">
                  <Button size="default" className="bg-accent text-accent-foreground border-accent-border" data-testid="button-cta-check-scam">
                    Check If It's a Scam
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/training">
                  <Button size="default" variant="outline" className="text-white border-white/20 bg-white/5" data-testid="button-cta-learn">
                    Start Learning Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
