import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Newsletter } from "@/components/newsletter";
import { PasswordGenerator } from "@/components/password-generator";
import { ScamChecker } from "@/components/scam-checker";
import { BreachChecker } from "@/components/breach-checker";
import { ThreatTrends } from "@/components/threat-trends";
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
  BookOpen
} from "lucide-react";
import logoImage from "@assets/image_(3)_1769558492356.png";

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
      <Navigation />
      
      <main>
        <section className="py-16 sm:py-20 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <img src={logoImage} alt="" className="w-5 h-5 object-contain" />
                <span>100% Free Tools</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Free Security Tools
              </h1>
              
              <p className="text-lg text-muted-foreground">
                Check for scams, generate strong passwords, and stay informed about current threats. 
                No signup required.
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
                <TabsTrigger value="scam-checker" className="gap-2" data-testid="tab-scam-checker">
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Scam Checker</span>
                  <span className="sm:hidden">Scam</span>
                </TabsTrigger>
                <TabsTrigger value="breach" className="gap-2" data-testid="tab-breach">
                  <Database className="w-4 h-4" />
                  <span className="hidden sm:inline">Breach Check</span>
                  <span className="sm:hidden">Breach</span>
                </TabsTrigger>
                <TabsTrigger value="password" className="gap-2" data-testid="tab-password">
                  <Lock className="w-4 h-4" />
                  <span className="hidden sm:inline">Passwords</span>
                  <span className="sm:hidden">Pass</span>
                </TabsTrigger>
                <TabsTrigger value="trends" className="gap-2" data-testid="tab-trends">
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Trends</span>
                  <span className="sm:hidden">Trends</span>
                </TabsTrigger>
              </TabsList>

              <div className="max-w-3xl mx-auto">
                <TabsContent value="scam-checker">
                  <ScamChecker />
                </TabsContent>
                
                <TabsContent value="breach">
                  <BreachChecker />
                </TabsContent>
                
                <TabsContent value="password">
                  <PasswordGenerator />
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
