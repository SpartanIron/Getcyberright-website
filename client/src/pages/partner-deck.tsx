import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/use-seo";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { AnimatedCyberBackground } from "@/components/animated-cyber-background";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useQuery } from "@tanstack/react-query";
import { 
  Shield, Globe, Users, TrendingUp, Heart, Building2,
  CheckCircle, Download, Mail, Handshake, Award,
  Target, Zap, BarChart3, Languages, Lock, Eye,
  BookOpen, ArrowRight
} from "lucide-react";
import logoImage from "@assets/image_1767834716649.png";

interface PublicStats {
  totalChecks: number;
  thisMonth: number;
  thisWeek: number;
}

export default function PartnerDeck() {
  useSEO({
    title: "Partnership Deck | GetCyberRight",
    description: "Explore how partnering with GetCyberRight connects your brand with safety-conscious families worldwide. Mission-aligned sponsorship with full editorial independence.",
    keywords: "partnership deck, cybersecurity partnership, family safety partner, trusted sponsorship"
  });

  const { data: stats } = useQuery<PublicStats>({
    queryKey: ["/api/public/scam-stats"]
  });

  const totalChecks = stats?.totalChecks || 0;

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-16 overflow-hidden print:py-8">
        <AnimatedCyberBackground />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="flex justify-center mb-6 print:mb-4">
              <img src={logoImage} alt="GetCyberRight" className="h-16 print:h-12" data-testid="img-logo" />
            </div>
            <Badge className="mb-4 bg-teal-500/20 text-teal-300 border-teal-500/50 print:hidden">
              <Handshake className="h-3 w-3 mr-1" />
              Partnership Deck
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 print:text-3xl" data-testid="heading-deck-title">GetCyberRight</h1>
            <p className="text-2xl text-teal-300 mb-4 print:text-xl">Cyber Safety for Every Family</p>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto print:text-base">
              We protect the people that corporate cybersecurity leaves behind. 
              Our partners help us reach more families while building brand trust with a high-intent audience.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 print:py-6">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 print:gap-4 print:mb-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card className="text-center border-2 hover:border-teal-200 dark:hover:border-teal-800 transition-colors">
                <CardContent className="p-6 print:p-4">
                  <div className="w-12 h-12 mx-auto mb-3 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center print:w-10 print:h-10">
                    <Shield className="h-6 w-6 text-teal-600 dark:text-teal-400 print:h-5 print:w-5" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1 print:text-2xl" data-testid="stat-checks">{totalChecks > 0 ? totalChecks.toLocaleString() + "+" : "Growing"}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Scam Checks Performed</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="text-center border-2 hover:border-teal-200 dark:hover:border-teal-800 transition-colors">
                <CardContent className="p-6 print:p-4">
                  <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center print:w-10 print:h-10">
                    <Languages className="h-6 w-6 text-blue-600 dark:text-blue-400 print:h-5 print:w-5" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1 print:text-2xl" data-testid="stat-languages">4</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Languages Supported</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="text-center border-2 hover:border-teal-200 dark:hover:border-teal-800 transition-colors">
                <CardContent className="p-6 print:p-4">
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center print:w-10 print:h-10">
                    <Globe className="h-6 w-6 text-green-600 dark:text-green-400 print:h-5 print:w-5" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1 print:text-2xl" data-testid="stat-continents">6+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Continents Reached</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="text-center border-2 hover:border-teal-200 dark:hover:border-teal-800 transition-colors">
                <CardContent className="p-6 print:p-4">
                  <div className="w-12 h-12 mx-auto mb-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center print:w-10 print:h-10">
                    <Target className="h-6 w-6 text-amber-600 dark:text-amber-400 print:h-5 print:w-5" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1 print:text-2xl" data-testid="stat-audiences">5</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Dedicated Audience Hubs</div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12 print:gap-6 print:mb-8">
            <Card>
              <CardContent className="p-6 print:p-4">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 print:text-xl" data-testid="heading-mission">
                  <Target className="w-6 h-6 text-teal-600 print:w-5 print:h-5" />
                  Our Mission
                </h2>
                <p className="text-muted-foreground mb-4">
                  GetCyberRight was born from personal experience with cyber fraud. We bridge the gap between 
                  complex cybersecurity information and accessible, plain-language guidance that families can actually use.
                </p>
                <ul className="space-y-2">
                  {[
                    "Protect children navigating social media",
                    "Shield seniors from targeted scams",
                    "Empower parents with practical tools",
                    "Serve families across all income levels"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 print:p-4">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 print:text-xl" data-testid="heading-capabilities">
                  <Zap className="w-6 h-6 text-amber-600 print:w-5 print:h-5" />
                  Platform Capabilities
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Shield, label: "AI Scam Checker", desc: "URL, phone, email, QR analysis" },
                    { icon: BarChart3, label: "Threat Dashboard", desc: "Real-time global trends" },
                    { icon: Users, label: "Age-Specific Hubs", desc: "Kids, seniors, parents, educators" },
                    { icon: BookOpen, label: "Training Academy", desc: "Courses, quizzes, certificates" },
                    { icon: Languages, label: "Multi-Language", desc: "EN, ES, FR, PT" },
                    { icon: Mail, label: "Safety Newsletters", desc: "Weekly tips and alerts" }
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <Icon className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium">{item.label}</div>
                          <div className="text-xs text-muted-foreground">{item.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-12 bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-900 dark:to-teal-950/30 print:mb-8">
            <CardContent className="p-6 print:p-4">
              <h2 className="text-2xl font-bold mb-4 text-center print:text-xl" data-testid="heading-why-partner">Why Companies Partner With Us</h2>
              <p className="text-sm text-muted-foreground text-center mb-6 max-w-2xl mx-auto">
                Our audience arrives with intent. They're not browsing — they're actively seeking ways to protect their families. That makes every partnership placement meaningful.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "High-Intent Audience", desc: "Visitors actively seeking security solutions for their families", icon: Target },
                  { title: "Trust Transfer", desc: "Your brand benefits from our credibility with families worldwide", icon: Heart },
                  { title: "Contextual Fit", desc: "Your product appears alongside the content it naturally complements", icon: BookOpen },
                  { title: "Growing Platform", desc: "Expanding reach with continuous development and new capabilities", icon: TrendingUp }
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="text-center p-4">
                      <Icon className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                      <h3 className="font-bold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-12 print:mb-8">
            <CardContent className="p-6 print:p-4">
              <h2 className="text-2xl font-bold mb-6 text-center print:text-xl" data-testid="heading-opportunities">Partnership Opportunities</h2>
              <div className="grid md:grid-cols-3 gap-6 print:gap-4">
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold">Sponsorship</h3>
                  </div>
                  <ul className="space-y-1">
                    {["Featured partner placement", "Newsletter sponsorship", "Sponsored educational content", "Safety campaign partnerships"].map((item, j) => (
                      <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-teal-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold">Integration</h3>
                  </div>
                  <ul className="space-y-1">
                    {["White-label solutions", "API access", "Co-branded tools", "Enterprise licensing"].map((item, j) => (
                      <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-teal-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Handshake className="w-5 h-5 text-green-600" />
                    <h3 className="font-bold">Community</h3>
                  </div>
                  <ul className="space-y-1">
                    {["Educational partnerships", "Regional expansion", "Content collaboration", "Research initiatives"].map((item, j) => (
                      <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-teal-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-12 border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/20 print:mb-8">
            <CardContent className="p-6 print:p-4">
              <h2 className="text-2xl font-bold mb-4 text-center print:text-xl" data-testid="heading-editorial">Our Commitment to Partners and Users</h2>
              <p className="text-sm text-muted-foreground text-center mb-6 max-w-2xl mx-auto">
                Trust is the foundation of everything we do. These commitments protect our users, our partners, and the integrity of this platform.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {[
                  { icon: Shield, text: "Partners never influence our recommendations or editorial content" },
                  { icon: Eye, text: "All sponsored content is clearly labeled and transparent" },
                  { icon: Lock, text: "We never share user data with partners or third parties" },
                  { icon: CheckCircle, text: "We only partner with companies we'd recommend to our own families" },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="text-center print:hidden">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={handleDownloadPDF}
                size="lg"
                data-testid="button-download-pdf"
              >
                <Download className="w-4 h-4 mr-2" />
                Download as PDF
              </Button>
              <Link href="/contact">
                <Button size="lg" variant="outline" data-testid="button-contact-us">
                  <Mail className="w-4 h-4 mr-2" />
                  Start a Conversation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Questions? Email us at <a href="mailto:partner@getcyberright.com" className="text-teal-600 hover:underline" data-testid="link-partner-email">partner@getcyberright.com</a>
            </p>
          </div>

          <div className="hidden print:block text-center mt-8 pt-8 border-t">
            <p className="text-lg font-bold mb-2">Ready to Partner?</p>
            <p className="text-muted-foreground">
              Contact us at partner@getcyberright.com or visit getcyberright.com/advertise
            </p>
          </div>
        </div>
      </section>

      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}
