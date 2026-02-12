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
                      <Badge variant="outline" className="text-[10px] text-green-700 dark:text-green-400 border-green-300 dark:border-green-700 no-default-hover-elevate no-default-active-elevate">Free</Badge>
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
    </div>
  );
}
