import { useSEO } from "@/hooks/use-seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Wrench, Download, FileText, CheckSquare, Printer,
  BookOpen, ExternalLink, Globe, ArrowRight
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const tools = [
  {
    title: "Printable Safety Guides",
    description: "Download and print checklists, quick reference cards, and conversation starters for your family.",
    icon: Printer,
    link: "/printable-guides",
    color: "bg-amber-100 dark:bg-amber-900/50",
    iconColor: "text-amber-600 dark:text-amber-400",
    badge: "Free Downloads"
  },
  {
    title: "Cheat Sheets",
    description: "Quick reference cards for security settings on popular apps and devices.",
    icon: FileText,
    link: "/resources/cheat-sheets",
    color: "bg-blue-100 dark:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    badge: "Quick Reference"
  },
  {
    title: "All Resources Library",
    description: "Browse our complete collection of curated resources from Trusted Sources worldwide.",
    icon: BookOpen,
    link: "/resources",
    color: "bg-purple-100 dark:bg-purple-900/50",
    iconColor: "text-purple-600 dark:text-purple-400",
    badge: "Full Library"
  },
  {
    title: "Cybersecurity Glossary",
    description: "Plain-language definitions for technical terms. Understand what experts are saying.",
    icon: Globe,
    link: "/resources/glossary",
    color: "bg-teal-100 dark:bg-teal-900/50",
    iconColor: "text-teal-600 dark:text-teal-400",
    badge: "Reference"
  }
];

const externalTools = [
  {
    title: "Google Family Link",
    description: "Free parental controls for Android devices",
    url: "https://families.google.com/familylink/",
    source: "Google"
  },
  {
    title: "Meta Family Center",
    description: "Controls for Facebook, Instagram & WhatsApp",
    url: "https://familycenter.meta.com/",
    source: "Meta"
  },
  {
    title: "Apple Screen Time",
    description: "Built-in parental controls for iPhone & iPad",
    url: "https://support.apple.com/en-us/HT208982",
    source: "Apple"
  },
  {
    title: "Microsoft Family Safety",
    description: "Controls for Windows, Xbox & Edge browser",
    url: "https://www.microsoft.com/en-us/microsoft-365/family-safety",
    source: "Microsoft"
  },
  {
    title: "Have I Been Pwned",
    description: "Check if your email was in a data breach",
    url: "https://haveibeenpwned.com/",
    source: "Security Tool"
  },
  {
    title: "Password Strength Checker",
    description: "Test how strong your passwords are",
    url: "https://www.security.org/how-secure-is-my-password/",
    source: "Security.org"
  }
];

export default function Equip() {
  useSEO({
    title: "Tools & Resources - Practical Cyber Safety Tools | GetCyberRight",
    description: "Practical tools and resources for every family member. Checklists, guides, parental controls, and security tools.",
    keywords: "cyber safety tools, parental controls, security checklists, family safety resources"
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wrench className="h-10 w-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Tools to Keep You Safe
            </h1>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Practical tools and resources for every family member, from kids to grandparents.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="secondary" className="bg-white/20 text-white border-0 px-4 py-2 text-sm">
                <Download className="h-4 w-4 mr-2" />
                Free Downloads
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-0 px-4 py-2 text-sm">
                <CheckSquare className="h-4 w-4 mr-2" />
                Ready-to-Use
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Tools Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Our Tools & Resources
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Curated resources to help you take action today
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {tools.map((tool) => (
              <motion.div key={tool.title} variants={fadeInUp}>
                <Link to={tool.link}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-md bg-white dark:bg-slate-800">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 ${tool.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <tool.icon className={`h-7 w-7 ${tool.iconColor}`} />
                        </div>
                        <Badge variant="outline" className="text-xs font-medium">
                          {tool.badge}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-grow mb-4">
                        {tool.description}
                      </p>
                      <span className="text-amber-600 dark:text-amber-400 text-sm font-semibold flex items-center gap-1 mt-auto">
                        Explore <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* External Tools Section */}
      <section className="py-12 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Recommended External Tools
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Trusted tools from major platforms to help protect your family
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 max-w-5xl 2xl:max-w-7xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {externalTools.map((tool) => (
              <motion.div key={tool.title} variants={fadeInUp}>
                <a 
                  href={tool.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <Card className="h-full hover:shadow-md transition-all duration-300 cursor-pointer group border border-slate-200 dark:border-slate-700">
                    <CardContent className="p-5 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-center gap-2">
                          {tool.title}
                          <ExternalLink className="h-3.5 w-3.5 opacity-50" />
                        </h3>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-grow mb-3">
                        {tool.description}
                      </p>
                      <Badge variant="secondary" className="text-xs w-fit">
                        {tool.source}
                      </Badge>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 md:p-12 text-center text-white max-w-4xl mx-auto shadow-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Need Help Getting Started?
            </h2>
            <p className="text-amber-100 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
              Our printable quick-start guides walk you through setting up protection step by step.
            </p>
            <Button asChild size="lg" className="bg-green-500 text-white hover:bg-green-600 font-semibold px-8">
              <Link to="/printable-guides" className="flex items-center gap-2">
                <Printer className="h-5 w-5" />
                Get Printable Guides
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
