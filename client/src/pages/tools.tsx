<<<<<<< HEAD
import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { PasswordGenerator } from "@/components/password-generator";
import { ScamChecker } from "@/components/scam-checker";
import { BreachChecker } from "@/components/breach-checker";
import { AdvancedScan } from "@/components/advanced-scan";
import { FamilyCodeword } from "@/components/family-codeword";
import { AudioDeepfakeDetector } from "@/components/audio-deepfake-detector";
import { GamificationBadges } from "@/components/gamification-badges";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { 
  Shield, 
  Search,
  Lock,
  Database,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ShieldAlert,
  Users,
  Radio,
  Trophy,
  Trash2,
  Wrench,
} from "lucide-react";
import bannerImage from "@/assets/banners/tools-banner.png";

const guides = [
  {
    id: "phishing-guide",
    icon: AlertTriangle,
    title: "Phishing Red Flag Guide",
    description: "Learn the telltale signs of phishing emails, texts, and calls. This visual guide shows you exactly what to look for.",
    category: "Education",
    features: ["Visual examples", "Real-world samples", "Quick reference"]
  },
  {
    id: "safety-assessment",
    icon: Shield,
    title: "Online Safety Assessment",
    description: "Take a quick assessment of your current online safety practices. Get personalized recommendations.",
    category: "Assessment",
    features: ["5-minute assessment", "Personalized tips", "Action plan"]
  },
  {
    id: "privacy-checklist",
    icon: Search,
    title: "Privacy Settings Checklist",
    description: "Step-by-step guides for securing your privacy on Facebook, Instagram, and other major platforms.",
    category: "Guides",
    features: ["Platform-specific", "Screenshot guides", "Regular updates"]
  },
  {
    id: "incident-response",
    icon: ShieldAlert,
    title: "What To Do If You've Been Scammed",
    description: "Step-by-step guide on exactly what to do if you think you've been scammed.",
    category: "Emergency",
    features: ["Step-by-step actions", "Contact list", "Documentation help"],
    href: "/emergency-help"
  }
];

export default function Tools() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tabParam = params.get("tab");

  const [activeCategory, setActiveCategory] = useState(() => {
    if (tabParam === "safety-toolkit") return "safety-toolkit";
    if (tabParam === "achievements") return "achievements";
    return "security-scanner";
  });

  const [scannerTab, setScannerTab] = useState("scam-checker");
  const [toolkitTab, setToolkitTab] = useState("password");

  useEffect(() => {
    if (tabParam === "safety-toolkit") setActiveCategory("safety-toolkit");
    else if (tabParam === "achievements") setActiveCategory("achievements");
  }, [tabParam]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.tools} />
      <Navigation />
      
      <main id="main-content" tabIndex={-1}>
        <PageBanner
          title="Your Cyber Protection Arsenal"
          subtitle="Powerful security tools and utilities designed to protect you and your family. No account required."
          imageSrc={bannerImage}
          imageAlt="Modern workspace with laptop displaying security checkmarks and password generator in bright natural light"
          imagePosition="left"
          colorVariant="teal"
        />

        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
              <button
                onClick={() => setActiveCategory("security-scanner")}
                className={`flex items-center gap-3 p-4 rounded-md border text-left transition-colors ${
                  activeCategory === "security-scanner" ? "border-primary bg-primary/5" : "hover-elevate"
                }`}
                data-testid="category-security-scanner"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Search className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Security Scanner</p>
                  <p className="text-xs text-muted-foreground">Scan URLs, emails, phones & more</p>
                </div>
              </button>

              <Link href="/data-removal">
                <div
                  className="flex items-center gap-3 p-4 rounded-md border text-left transition-colors hover-elevate cursor-pointer h-full"
                  data-testid="category-data-removal"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">Data Broker Removal</p>
                      <Badge variant="secondary" className="text-[10px]">Premium</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Remove data from 500+ brokers</p>
                  </div>
                </div>
              </Link>

              <button
                onClick={() => setActiveCategory("safety-toolkit")}
                className={`flex items-center gap-3 p-4 rounded-md border text-left transition-colors ${
                  activeCategory === "safety-toolkit" ? "border-primary bg-primary/5" : "hover-elevate"
                }`}
                data-testid="category-safety-toolkit"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm">Safety Toolkit</p>
                  <p className="text-xs text-muted-foreground">Passwords, codewords & detectors</p>
                </div>
              </button>

              <button
                onClick={() => setActiveCategory("achievements")}
                className={`flex items-center gap-3 p-4 rounded-md border text-left transition-colors ${
                  activeCategory === "achievements" ? "border-primary bg-primary/5" : "hover-elevate"
                }`}
                data-testid="category-achievements"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Rewards</p>
                  <p className="text-xs text-muted-foreground">Badges & achievements</p>
                </div>
              </button>
            </div>

            {activeCategory === "security-scanner" && (
              <div className="max-w-4xl mx-auto">
                <Tabs value={scannerTab} onValueChange={setScannerTab}>
                  <TabsList className="grid w-full grid-cols-3 mb-6" data-testid="tabs-security-scanner">
                    <TabsTrigger value="scam-checker" className="gap-1.5" data-testid="tab-scam-checker">
                      <Search className="w-4 h-4" />
                      <span className="text-sm">Scam Checker</span>
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="gap-1.5" data-testid="tab-advanced">
                      <ShieldAlert className="w-4 h-4" />
                      <span className="text-sm">Advanced Scan</span>
                    </TabsTrigger>
                    <TabsTrigger value="breach" className="gap-1.5" data-testid="tab-breach">
                      <Database className="w-4 h-4" />
                      <span className="text-sm">Breach Check</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="scam-checker">
                    <ScamChecker />
                  </TabsContent>
                  <TabsContent value="advanced">
                    <AdvancedScan />
                  </TabsContent>
                  <TabsContent value="breach">
                    <BreachChecker />
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {activeCategory === "safety-toolkit" && (
              <div className="max-w-4xl mx-auto">
                <Tabs value={toolkitTab} onValueChange={setToolkitTab}>
                  <TabsList className="grid w-full grid-cols-3 mb-6" data-testid="tabs-safety-toolkit">
                    <TabsTrigger value="password" className="gap-1.5" data-testid="tab-password">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm">Password Generator</span>
                    </TabsTrigger>
                    <TabsTrigger value="codeword" className="gap-1.5" data-testid="tab-codeword">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Family Codeword</span>
                    </TabsTrigger>
                    <TabsTrigger value="voice-clone" className="gap-1.5" data-testid="tab-voice-clone">
                      <Radio className="w-4 h-4" />
                      <span className="text-sm">Voice Detector</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="password">
                    <PasswordGenerator />
                  </TabsContent>
                  <TabsContent value="codeword">
                    <FamilyCodeword />
                  </TabsContent>
                  <TabsContent value="voice-clone">
                    <AudioDeepfakeDetector />
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {activeCategory === "achievements" && (
              <div className="max-w-4xl mx-auto">
                <GamificationBadges />
              </div>
            )}
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Security Guides & Resources
                </h2>
                <p className="text-muted-foreground">
                  Educational materials to help you stay protected
                </p>
              </div>
              <Link href="/resources">
                <Button variant="outline" data-testid="button-view-all-resources">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {guides.map((guide) => (
                <Card key={guide.id} className="hover-elevate" data-testid={`card-guide-${guide.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <guide.icon className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant="outline">{guide.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-lg mb-2">{guide.title}</CardTitle>
                    <p className="text-muted-foreground text-sm mb-4">
                      {guide.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {guide.features.map((feature, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-muted px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <Link href={guide.href || "/resources"}>
                      <Button variant="outline" className="w-full" data-testid={`button-guide-${guide.id}`}>
                        <BookOpen className="w-4 h-4 mr-2" />
                        Read Guide
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-red-50 dark:bg-red-950/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Been Scammed? Get Help Now
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              If you think you've been scammed, don't panic. We have step-by-step guidance 
              on what to do next to minimize damage and report the scam.
            </p>
            <Link href="/emergency-help">
              <Button size="lg" variant="destructive" data-testid="button-emergency-help">
                Get Emergency Help
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
=======
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/use-seo";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { AnimatedCyberBackground } from "@/components/animated-cyber-background";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { 
  Shield, Search, Key, TrendingUp, ArrowRight, 
  CheckCircle, Zap, Globe, Lock
} from "lucide-react";

const tools = [
  {
    id: "scam-checker",
    name: "Scam Checker",
    description: "Analyze suspicious URLs, phone numbers, emails, QR codes, and situations using AI-powered detection.",
    icon: Shield,
    href: "/scam-checker",
    color: "text-teal-600",
    bgColor: "bg-teal-100 dark:bg-teal-900/30",
    borderColor: "border-teal-200 dark:border-teal-800",
    hoverBorder: "hover:border-teal-400 dark:hover:border-teal-600",
    features: ["URL analysis", "Phone number lookup", "Email header analysis", "AI situation analysis", "QR code scanning"],
    badge: "Most Popular",
    badgeColor: "bg-teal-500"
  },
  {
    id: "breach-checker",
    name: "Breach Checker",
    description: "Check if your email has been exposed in known data breaches. Get alerts when new breaches affect you.",
    icon: Search,
    href: "/#breach-checker",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    hoverBorder: "hover:border-blue-400 dark:hover:border-blue-600",
    features: ["Email breach lookup", "Breach details", "Affected data types", "Breach timeline", "Alert notifications"],
    badge: null,
    badgeColor: ""
  },
  {
    id: "password-generator",
    name: "Security Key Generator",
    description: "Generate strong, unique passwords and passphrases that are nearly impossible to crack.",
    icon: Key,
    href: "/password-generator",
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    borderColor: "border-purple-200 dark:border-purple-800",
    hoverBorder: "hover:border-purple-400 dark:hover:border-purple-600",
    features: ["Random passwords", "Memorable passphrases", "Strength meter", "Copy to clipboard", "Customizable length"],
    badge: null,
    badgeColor: ""
  },
  {
    id: "threat-trends",
    name: "Threat Trends",
    description: "Real-time cybercrime statistics from FBI IC3, Europol, and INTERPOL. See what threats are trending globally.",
    icon: TrendingUp,
    href: "/threat-trends",
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    hoverBorder: "hover:border-amber-400 dark:hover:border-amber-600",
    features: ["Global statistics", "Regional breakdown", "Scam type analysis", "Risk distribution", "Live platform data"],
    badge: "New",
    badgeColor: "bg-amber-500"
  }
];

const benefits = [
  { icon: Zap, text: "100% free to use" },
  { icon: Lock, text: "No data stored" },
  { icon: Globe, text: "Works worldwide" },
  { icon: CheckCircle, text: "No signup required" }
];

export default function Tools() {
  useSEO({
    title: "Free Cybersecurity Tools | GetCyberRight",
    description: "Free scam checker, breach lookup, password generator, and threat trends dashboard. Protect yourself and your family with our suite of cybersecurity tools.",
    keywords: "scam checker, breach checker, password generator, cybersecurity tools, free security tools, phishing detection"
  });

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-16 overflow-hidden">
        <AnimatedCyberBackground />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge className="mb-4 bg-teal-500/20 text-teal-300 border-teal-500/50">
              <Shield className="h-3 w-3 mr-1" />
              Free Security Tools
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Protect Yourself Online</h1>
            <p className="text-xl text-slate-300 mb-8">
              Free, easy-to-use tools to check for scams, breaches, and generate secure passwords. 
              No signup required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                    <Icon className="w-4 h-4 text-teal-400" />
                    <span>{benefit.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <motion.div key={tool.id} variants={fadeInUp}>
                  <Card className={`h-full border-2 ${tool.borderColor} ${tool.hoverBorder} transition-all duration-300 hover:shadow-lg`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 ${tool.bgColor} rounded-xl flex items-center justify-center`}>
                          <Icon className={`h-7 w-7 ${tool.color}`} />
                        </div>
                        {tool.badge && (
                          <Badge className={`${tool.badgeColor} text-white text-xs`}>
                            {tool.badge}
                          </Badge>
                        )}
                      </div>
                      <h2 className="text-xl font-bold mb-2">{tool.name}</h2>
                      <p className="text-muted-foreground mb-4">{tool.description}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {tool.features.map((feature, i) => (
                          <span 
                            key={i} 
                            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                      <Link href={tool.href}>
                        <Button className="w-full group">
                          Use {tool.name}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-950/20 dark:to-blue-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Why Our Tools Are Free</h2>
            <p className="text-muted-foreground mb-8">
              GetCyberRight was founded after our founder's family fell victim to cyber fraud. 
              We believe everyone deserves access to basic cybersecurity tools, regardless of their 
              ability to pay. Our mission is to protect families worldwide from online threats.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/about">
                <Button variant="outline">Learn Our Story</Button>
              </Link>
              <Link href="/advertise">
                <Button variant="outline">Partner With Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
            <p className="text-muted-foreground mb-6">
              If you've been scammed or need guidance on staying safe online, we have resources for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/emergency-help">
                <Button variant="destructive">I've Been Scammed</Button>
              </Link>
              <Link href="/resources">
                <Button variant="outline">Browse Resources</Button>
              </Link>
              <Link href="/faq">
                <Button variant="outline">FAQs</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
    </div>
  );
}
