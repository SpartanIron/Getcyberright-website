import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Newsletter } from "@/components/newsletter";
import { 
  Shield, 
  FileCheck, 
  AlertTriangle, 
  Search,
  Lock,
  Eye,
  Download,
  ArrowRight
} from "lucide-react";
import logoImage from "@assets/image_(3)_1769558492356.png";

const tools = [
  {
    id: "scam-checker",
    icon: Search,
    title: "Scam Awareness Checklist",
    description: "A simple questionnaire to help you determine if something you've received might be a scam. Answer a few questions and get instant guidance.",
    category: "Assessment",
    popular: true,
    features: ["Instant results", "No signup required", "Printable version"]
  },
  {
    id: "phishing-guide",
    icon: AlertTriangle,
    title: "Phishing Red Flag Guide",
    description: "Learn the telltale signs of phishing emails, texts, and calls. This visual guide shows you exactly what to look for before clicking or responding.",
    category: "Education",
    popular: true,
    features: ["Visual examples", "Real-world samples", "Quick reference card"]
  },
  {
    id: "safety-assessment",
    icon: Shield,
    title: "Online Safety Assessment",
    description: "Take a quick assessment of your current online safety practices. Get personalized recommendations based on your answers.",
    category: "Assessment",
    popular: false,
    features: ["5-minute assessment", "Personalized tips", "Action plan"]
  },
  {
    id: "password-guide",
    icon: Lock,
    title: "Password Security Guide",
    description: "Everything you need to know about creating and managing strong passwords - explained simply for non-technical users.",
    category: "Education",
    popular: false,
    features: ["Password tips", "Manager recommendations", "Recovery planning"]
  },
  {
    id: "privacy-checklist",
    icon: Eye,
    title: "Privacy Settings Checklist",
    description: "Step-by-step guides for securing your privacy on Facebook, Instagram, and other major platforms. Keep your information safe.",
    category: "Guides",
    popular: false,
    features: ["Platform-specific", "Screenshot guides", "Regular updates"]
  },
  {
    id: "incident-response",
    icon: FileCheck,
    title: "What To Do If You've Been Scammed",
    description: "If you think you've fallen victim to a scam, this guide walks you through exactly what to do next - step by step.",
    category: "Emergency",
    popular: true,
    features: ["Step-by-step actions", "Contact list", "Documentation help"]
  }
];

export default function Tools() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <section className="py-16 sm:py-24 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <img src={logoImage} alt="" className="w-5 h-5 object-contain" />
                <span>100% Free Tools</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Free Protection Tools{" "}
                <span className="text-primary">For Everyone</span>
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                No signup required. No hidden fees. Just practical tools and guides 
                to help you stay safe online. Download, print, and share with your 
                family and friends.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col hover-elevate" data-testid={`tool-card-${tool.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <tool.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex gap-2">
                          {tool.popular && (
                            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                              Popular
                            </Badge>
                          )}
                          <Badge variant="outline">{tool.category}</Badge>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-muted-foreground mb-4 flex-1">
                        {tool.description}
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {tool.features.map((feature, featureIndex) => (
                            <span 
                              key={featureIndex}
                              className="text-xs bg-muted px-2 py-1 rounded"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                        
                        <Button className="w-full" data-testid={`button-${tool.id}`}>
                          <Download className="mr-2 w-4 h-4" />
                          Get This Tool
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-card border-y">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Need Something Specific?
              </h2>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? We're always creating new resources 
                based on what our community needs. Let us know what would help you stay safe.
              </p>
              <Link href="/contact">
                <Button variant="outline" size="lg" data-testid="button-request-tool">
                  Request a Tool
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <Newsletter />
      </main>
      
      <Footer />
    </div>
  );
}
