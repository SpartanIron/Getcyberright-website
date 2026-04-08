"use client";

import { FadeIn } from "@/components/fade-in";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { SEOHead } from "@/components/seo-head";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Users,
  Heart,
  ArrowRight,
  Lock,
  Eye,
  Handshake,
  Search,
  BookOpen,
  GraduationCap,
  Mic,
  Key,
  FileText,
  Check,
  ShoppingBag
} from "lucide-react";
import { Link } from "@/lib/navigation";
import bannerImage from "@/assets/banners/pricing-banner.webp";

const whatWeOffer = [
  { icon: Search, name: "GCR Scam Guard", description: "Check suspicious emails, texts, URLs, QR codes, and phone numbers" },
  { icon: Shield, name: "GCR Data Shield", description: "Scan for your exposed personal data across broker sites and breach databases" },
  { icon: Mic, name: "Deepfake Voice Detector", description: "Detect AI-generated voice clones in suspicious calls" },
  { icon: Key, name: "Password Generator", description: "Create strong, unique passwords for every account" },
  { icon: Shield, name: "Family Safety Codewords", description: "Secret phrases to verify your family's identity during suspicious calls" },
  { icon: GraduationCap, name: "Training Academy", description: "Full courses with quizzes and certificates for every skill level" },
  { icon: BookOpen, name: "Resource Library", description: "Guides, articles, checklists, and printable materials" },
  { icon: FileText, name: "Safety Score Assessment", description: "Evaluate your personal cybersecurity habits" },
];

const ourValues = [
  { icon: Heart, title: "Family First", description: "We exist to protect the people that corporate cybersecurity leaves behind: parents, kids, seniors, and everyday families." },
  { icon: Lock, title: "Your Data Stays Yours", description: "We never sell your personal information. We use analytics to improve your experience, but your data is never shared with advertisers or data brokers." },
  { icon: Eye, title: "Full Transparency", description: "Core safety tools are free to use. Paid plans unlock advanced protection, and we are always upfront about what is included at every level." },
  { icon: Handshake, title: "Trusted Partnerships", description: "We are sustained through partnerships with credible companies and organizations who share our mission to make families safer." },
];

export default function OurMission() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Our Mission | GetCyberRight"
        description="GetCyberRight protects the people that corporate cybersecurity leaves behind. Learn about our mission and the trusted partnerships that make it possible."
        keywords="cybersecurity mission, family safety, trusted partnerships, cyber safety education"
      />
      <Navigation />

      <main id="main-content" tabIndex={-1}>
        <PageBanner
          title="Our Mission"
          subtitle="Protecting the people that corporate cybersecurity leaves behind. Every parent, every grandparent, every child."
          imageSrc={bannerImage}
          imageAlt="Shield protecting a family online"
          imagePosition="right"
          colorVariant="teal"
        />

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <FadeIn className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-mission-heading">
                Cybersecurity Should Not Be a Luxury
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Most cybersecurity companies build for corporations with big budgets.
                We build for families who just want to stay safe online.
              </p>
            </FadeIn>

            <div className="grid sm:grid-cols-2 gap-4 mb-16">
              {ourValues.map((value, index) => (
                <FadeIn key={value.title}>
                  <Card className="h-full" data-testid={`card-value-${index}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <value.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{value.title}</h3>
                          <p className="text-sm text-muted-foreground">{value.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <FadeIn className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4" data-testid="text-tools-heading">
                What We Offer
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Powerful tools designed to keep your family safe. Core tools are free to use, no account needed.
              </p>
            </FadeIn>

            <div className="space-y-3">
              {whatWeOffer.map((tool, index) => (
                <FadeIn key={tool.name}>
                  <Card data-testid={`card-tool-${index}`}>
                    <CardContent className="py-4 px-5">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                          <tool.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-foreground">{tool.name}</span>
                          <p className="text-sm text-muted-foreground">{tool.description}</p>
                        </div>
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Handshake className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">How We Sustain This</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        GetCyberRight is sustained through trusted partnerships with credible companies
                        and organizations who share our mission. We work with partners who believe that
                        cybersecurity education should reach every family, not just those who can afford it.
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Our partners never influence our content or recommendations. We maintain full editorial
                    independence. We never sell user data. And our core safety tools, including manual scam
                    checking and educational content, will always be free.
                  </p>
                  <p className="text-foreground font-medium">
                    If your organization shares this mission, we would love to hear from you.
                  </p>
                  <div className="mt-4">
                    <Link href="/contact">
                      <Button variant="outline" data-testid="button-partner-contact">
                        Partner With Us
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <FadeIn>
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
                    age-appropriate lessons.
                  </p>
                  <p className="text-foreground font-medium">
                    If you are a parent, a grandparent, a teenager, or just someone trying to
                    stay safe online, this was made for you.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Start Protecting Your Family Today
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">
                No account required for most tools. Just pick a tool and go.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tools">
                  <Button size="lg" variant="secondary" data-testid="button-mission-tools">
                    Explore Our Tools
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/support-the-mission">
                  <Button size="lg" variant="outline" className="border-white/30 text-white bg-transparent" data-testid="button-support-mission">
                    <ShoppingBag className="mr-2 w-4 h-4" />
                    Shop
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
