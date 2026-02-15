import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Baby, 
  Users, 
  Plane,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { useSEO } from "@/hooks/use-seo";

interface Pathway {
  id: string;
  icon: any;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  bgColor: string;
  links: { label: string; href: string }[];
}

const pathways: Pathway[] = [
  {
    id: "parent",
    icon: Baby,
    title: "I'm a Parent",
    subtitle: "Protecting my children online",
    description: "Learn how to keep your kids safe on social media, gaming platforms, and the internet.",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    links: [
      { label: "Parent's Guide to Online Safety", href: "/parent-guide" },
      { label: "Youth Safety Hub", href: "/youth-safety" },
      { label: "Parental Control Tools", href: "/resources" },
    ],
  },
  {
    id: "senior",
    icon: Users,
    title: "I'm a Senior",
    subtitle: "Or helping an elderly family member",
    description: "Protect yourself or loved ones from phone scams, tech support fraud, and online threats.",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    links: [
      { label: "Senior Protection Center", href: "/senior-safety" },
      { label: "Common Scams Targeting Seniors", href: "/senior-safety#scams" },
      { label: "Emergency Help", href: "/emergency-help" },
    ],
  },
  {
    id: "personal",
    icon: Shield,
    title: "Protecting Myself",
    subtitle: "Improving my own cyber safety",
    description: "Build better security habits, check for data breaches, and learn to spot scams.",
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-100 dark:bg-teal-900/30",
    links: [
      { label: "Check for Data Breaches", href: "/#breach-checker" },
      { label: "Cyber Hygiene Guide", href: "/cyber-hygiene" },
      { label: "Take the Safety Quiz", href: "/safety-score" },
    ],
  },
  {
    id: "traveler",
    icon: Plane,
    title: "I'm Traveling",
    subtitle: "Staying safe abroad",
    description: "Protect your devices and data while traveling, avoid WiFi risks and travel scams.",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    links: [
      { label: "Travel Safety Guide", href: "/travel-safety" },
      { label: "Public WiFi Safety", href: "/cyber-hygiene" },
      { label: "Emergency Contacts by Country", href: "/emergency-help" },
    ],
  },
];

const quickActions = [
  {
    icon: ShieldCheck,
    title: "Check Something Suspicious",
    description: "Paste a URL, phone number, or message to check if it's a scam",
    href: "/scam-checker",
    color: "bg-teal-500",
  },
  {
    icon: AlertTriangle,
    title: "I've Been Scammed",
    description: "Get immediate help and steps to protect yourself",
    href: "/emergency-help",
    color: "bg-red-500",
  },
  {
    icon: BookOpen,
    title: "Learn the Basics",
    description: "Start with our beginner-friendly cyber safety resources",
    href: "/resources",
    color: "bg-blue-500",
  },
];

export default function StartHere() {
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);

  useSEO({
    title: "Start Here | GetCyberRight",
    description: "New to GetCyberRight? Find the right resources for you based on who you're protecting.",
  });

  const selectedData = pathways.find(p => p.id === selectedPathway);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Welcome to GetCyberRight
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Let's Get You Protected
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Tell us who you're protecting, and we'll point you to the most relevant resources.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 text-center">
              Who are you protecting?
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {pathways.map((pathway) => (
                <button
                  key={pathway.id}
                  onClick={() => setSelectedPathway(pathway.id === selectedPathway ? null : pathway.id)}
                  className={`text-left p-6 rounded-xl border-2 transition-all ${
                    selectedPathway === pathway.id
                      ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-teal-300 dark:hover:border-teal-600"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${pathway.bgColor}`}>
                      <pathway.icon className={`h-6 w-6 ${pathway.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                        {pathway.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {pathway.subtitle}
                      </p>
                    </div>
                    {selectedPathway === pathway.id && (
                      <CheckCircle className="h-5 w-5 text-teal-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {selectedData && (
            <motion.div
              key={selectedData.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-12"
            >
              <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className={`h-2 ${selectedData.bgColor.replace('bg-', 'bg-gradient-to-r from-').replace('/30', '')} to-transparent`} />
                <CardContent className="p-6">
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    {selectedData.description}
                  </p>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-4">
                    Recommended for you:
                  </h4>
                  <div className="space-y-3">
                    {selectedData.links.map((link, index) => (
                      <Link
                        key={index}
                        to={link.href}
                        className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                      >
                        <span className="font-medium text-slate-900 dark:text-white">
                          {link.label}
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-teal-500 transition-colors" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 text-center">
              Quick Actions
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.href}>
                  <Card className="h-full bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-600 transition-colors cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {action.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Not sure where to start?
            </p>
            <Button asChild variant="outline" size="lg">
              <Link to="/safety-score" className="flex items-center gap-2">
                Take our Safety Quiz
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
