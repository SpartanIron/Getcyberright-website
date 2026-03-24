import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { InlinePromoVideo } from "@/components/inline-promo-video";
import { PasswordGenerator } from "@/components/password-generator";
import { ScamChecker } from "@/components/scam-checker";
import { AudioDeepfakeDetector } from "@/components/audio-deepfake-detector";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { StructuredData } from "@/components/structured-data";
import type { WebApplicationData, BreadcrumbData } from "@/components/structured-data";
import { 
  Shield, 
  Search,
  Lock,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ShieldAlert,
  Radio,
  Trash2,
  Wrench,
} from "lucide-react";
import bannerImage from "@/assets/banners/tools-banner.png";
import phishingGuideImg from "@/assets/images/card-phishing-guide.png";
import safetyAssessmentImg from "@/assets/images/card-safety-assessment.png";
import privacyChecklistImg from "@/assets/images/card-privacy-checklist.png";
import incidentResponseImg from "@/assets/images/card-incident-response.png";

const guides = [
  {
    id: "phishing-guide",
    icon: AlertTriangle,
    title: "Phishing Red Flag Guide",
    description: "Learn the telltale signs of phishing emails, texts, and calls. This visual guide shows you exactly what to look for.",
    category: "Education",
    features: ["Visual examples", "Real-world samples", "Quick reference"],
    image: phishingGuideImg,
    imageAlt: "Diverse team examining a phishing warning on a laptop screen"
  },
  {
    id: "safety-assessment",
    icon: Shield,
    title: "Online Safety Assessment",
    description: "Take a quick assessment of your current online safety practices. Get personalized recommendations.",
    category: "Assessment",
    features: ["5-minute assessment", "Personalized tips", "Action plan"],
    image: safetyAssessmentImg,
    imageAlt: "Couple reviewing online safety assessment on a tablet"
  },
  {
    id: "privacy-checklist",
    icon: Search,
    title: "Privacy Settings Checklist",
    description: "Step-by-step guides for securing your privacy on Facebook, Instagram, and other major platforms.",
    category: "Guides",
    features: ["Platform-specific", "Screenshot guides", "Regular updates"],
    image: privacyChecklistImg,
    imageAlt: "Person adjusting privacy settings on a smartphone"
  },
  {
    id: "incident-response",
    icon: ShieldAlert,
    title: "What To Do If You've Been Scammed",
    description: "Step-by-step guide on exactly what to do if you think you've been scammed.",
    category: "Emergency",
    features: ["Step-by-step actions", "Contact list", "Documentation help"],
    href: "/emergency-help",
    image: incidentResponseImg,
    imageAlt: "Person looking at fraud alert on computer screen"
  }
];

export default function Tools() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tabParam = params.get("tab");

  const [activeCategory, setActiveCategory] = useState(() => {
    if (tabParam === "safety-toolkit") return "safety-toolkit";
    return "security-scanner";
  });

  const [toolkitTab, setToolkitTab] = useState("password");

  useEffect(() => {
    if (tabParam === "safety-toolkit") setActiveCategory("safety-toolkit");
  }, [tabParam]);

  useEffect(() => {
    if (window.location.hash === "#scam-checker") {
      setActiveCategory("security-scanner");
      requestAnimationFrame(() => {
        const el = document.getElementById("scam-checker");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  const toolsSchemas: WebApplicationData[] = [
    {
      type: "WebApplication",
      name: "GCR Scam Guard",
      description: "AI-powered tool to check if URLs, emails, phone numbers, and QR codes are scams. Analyzes threats using multiple security engines.",
      url: "https://www.getcyberright.com/scam-checker",
      applicationCategory: "SecurityApplication",
      provider: "GetCyberRight",
    },
    {
      type: "WebApplication",
      name: "Password Generator",
      description: "Generate strong, secure passwords with customizable length, complexity, and character types. Free online password generator tool.",
      url: "https://www.getcyberright.com/password-generator",
      applicationCategory: "SecurityApplication",
      provider: "GetCyberRight",
    },
    {
      type: "WebApplication",
      name: "GCR Data Shield - Personal Data Exposure Scanner",
      description: "Scan for your exposed personal information across data broker sites and breach databases. Free exposure scan with actionable results.",
      url: "https://www.getcyberright.com/shield",
      applicationCategory: "SecurityApplication",
      provider: "GetCyberRight",
    },
  ];

  const toolsBreadcrumbs: BreadcrumbData = {
    type: "BreadcrumbList",
    items: [
      { name: "Home", url: "https://www.getcyberright.com/" },
      { name: "Security Tools", url: "https://www.getcyberright.com/tools" },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.tools} />
      <StructuredData data={[...toolsSchemas, toolsBreadcrumbs]} />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
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
                  <p className="font-medium text-sm">GCR Scam Guard</p>
                  <p className="text-xs text-muted-foreground">Scan URLs, emails, phones & more</p>
                </div>
              </button>

              <Link href="/shield">
                <div
                  className="flex items-center gap-3 p-4 rounded-md border text-left transition-colors hover-elevate cursor-pointer h-full"
                  data-testid="category-gcr-shield"
                >
                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-teal-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">GCR Data Shield</p>
                      <Badge variant="outline" className="text-[10px] text-green-700 dark:text-green-400 border-green-300 dark:border-green-700 no-default-hover-elevate no-default-active-elevate">Free</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Scan for your exposed personal data</p>
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
                  <p className="text-xs text-muted-foreground">Passwords & voice detector</p>
                </div>
              </button>
            </div>

            {activeCategory === "security-scanner" && (
              <div id="scam-checker" className="max-w-4xl mx-auto scroll-mt-24">
                <ScamChecker />
              </div>
            )}

            {activeCategory === "safety-toolkit" && (
              <div className="max-w-4xl mx-auto">
                <Tabs value={toolkitTab} onValueChange={setToolkitTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-6" data-testid="tabs-safety-toolkit">
                    <TabsTrigger value="password" className="gap-1.5" data-testid="tab-password">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm">Password Generator</span>
                    </TabsTrigger>
                    <TabsTrigger value="voice-clone" className="gap-1.5" data-testid="tab-voice-clone">
                      <Radio className="w-4 h-4" />
                      <span className="text-sm">Voice Detector</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="password">
                    <PasswordGenerator />
                  </TabsContent>
                  <TabsContent value="voice-clone">
                    <AudioDeepfakeDetector />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <InlinePromoVideo
            src="/videos/promo-tools.mp4"
            poster="/videos/poster-tools.png"
            heading="See Our Tools in Action"
            description="Watch how GetCyberRight helps families stay safe from scams, phishing, and online threats."
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          />
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
                <Card key={guide.id} className="overflow-visible hover-elevate" data-testid={`card-guide-${guide.id}`}>
                  <div className="relative h-48 sm:h-56 overflow-hidden rounded-t-md">
                    <img
                      src={guide.image}
                      alt={guide.imageAlt}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      data-testid={`img-guide-${guide.id}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="text-xs">{guide.category}</Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-2 mb-1">
                        <guide.icon className="w-5 h-5 text-white/90 flex-shrink-0" />
                        <h3 className="text-white font-semibold text-lg leading-tight">{guide.title}</h3>
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-4">
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
