import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Newsletter } from "@/components/newsletter";
import { PageBanner } from "@/components/page-banner";
import { PasswordGenerator } from "@/components/password-generator";
import { ScamChecker } from "@/components/scam-checker";
import { BreachChecker } from "@/components/breach-checker";
import { ThreatTrends } from "@/components/threat-trends";
import { AdvancedScan } from "@/components/advanced-scan";
import { FamilyCodeword } from "@/components/family-codeword";
import { AudioDeepfakeDetector } from "@/components/audio-deepfake-detector";
import { GamificationBadges } from "@/components/gamification-badges";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { 
  Shield, 
  Search,
  Lock,
  TrendingUp,
  Database,
  AlertTriangle,
  FileText,
  Eye,
  ArrowRight,
  BookOpen,
  ShieldAlert,
  Users,
  Radio,
  Trophy
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
    icon: Eye,
    title: "Privacy Settings Checklist",
    description: "Step-by-step guides for securing your privacy on Facebook, Instagram, and other major platforms.",
    category: "Guides",
    features: ["Platform-specific", "Screenshot guides", "Regular updates"]
  },
  {
    id: "incident-response",
    icon: FileText,
    title: "What To Do If You've Been Scammed",
    description: "Step-by-step guide on exactly what to do if you think you've been scammed.",
    category: "Emergency",
    features: ["Step-by-step actions", "Contact list", "Documentation help"],
    href: "/emergency-help"
  }
];

export default function Tools() {
  const [activeTab, setActiveTab] = useState("scam-checker");

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.tools} />
      <Navigation />
      
      <main tabIndex={-1}>
        <PageBanner
          title="Your Cyber Protection Arsenal"
          subtitle="This is not a collection of tools. It is a human centered cyber protection ecosystem designed to guide, defend, and empower you throughout your digital life. No account required."
          imageSrc={bannerImage}
          imageAlt="Modern workspace with laptop displaying security checkmarks and password generator in bright natural light"
          imagePosition="left"
          colorVariant="teal"
        />

        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-5xl mx-auto grid-cols-4 sm:grid-cols-8 mb-8 h-auto gap-1">
                <TabsTrigger value="scam-checker" className="gap-1 flex-col sm:flex-row py-2" data-testid="tab-scam-checker">
                  <Search className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Scam</span>
                </TabsTrigger>
                <TabsTrigger value="advanced" className="gap-1 flex-col sm:flex-row py-2" data-testid="tab-advanced">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Advanced</span>
                </TabsTrigger>
                <TabsTrigger value="voice-clone" className="gap-1 flex-col sm:flex-row py-2" data-testid="tab-voice-clone">
                  <Radio className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Voice AI</span>
                </TabsTrigger>
                <TabsTrigger value="codeword" className="gap-1 flex-col sm:flex-row py-2" data-testid="tab-codeword">
                  <Users className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Codeword</span>
                </TabsTrigger>
                <TabsTrigger value="breach" className="gap-1 flex-col sm:flex-row py-2" data-testid="tab-breach">
                  <Database className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Breach</span>
                </TabsTrigger>
                <TabsTrigger value="password" className="gap-1 flex-col sm:flex-row py-2" data-testid="tab-password">
                  <Lock className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Password</span>
                </TabsTrigger>
                <TabsTrigger value="achievements" className="gap-1 flex-col sm:flex-row py-2" data-testid="tab-achievements">
                  <Trophy className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Rewards</span>
                </TabsTrigger>
                <TabsTrigger value="trends" className="gap-1 flex-col sm:flex-row py-2" data-testid="tab-trends">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Trends</span>
                </TabsTrigger>
              </TabsList>

              <div className="max-w-4xl mx-auto">
                <TabsContent value="scam-checker">
                  <ScamChecker />
                </TabsContent>
                
                <TabsContent value="advanced">
                  <AdvancedScan />
                </TabsContent>
                
                <TabsContent value="voice-clone">
                  <AudioDeepfakeDetector />
                </TabsContent>
                
                <TabsContent value="codeword">
                  <FamilyCodeword />
                </TabsContent>
                
                <TabsContent value="breach">
                  <BreachChecker />
                </TabsContent>
                
                <TabsContent value="password">
                  <PasswordGenerator />
                </TabsContent>
                
                <TabsContent value="achievements">
                  <GamificationBadges />
                </TabsContent>
                
                <TabsContent value="trends">
                  <ThreatTrends />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
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

        <Newsletter />
      </main>
      
      <Footer />
    </div>
  );
}
