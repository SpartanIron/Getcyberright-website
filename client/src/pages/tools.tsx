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
    </div>
  );
}
