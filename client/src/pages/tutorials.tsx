import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LearningPaths } from "@/components/learning-paths";
import { 
  Shield, 
  Users, 
  Smartphone, 
  CreditCard, 
  Eye, 
  MessageSquare,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";

interface FamilyGuide {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  link: string;
  audience: string[];
  topics: string[];
}

const familyGuides: FamilyGuide[] = [
  {
    title: "Youth Safety Center",
    description: "Age-appropriate online safety education for children and teens",
    icon: <Users className="h-6 w-6" />,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    link: "/kids",
    audience: ["Children", "Teens", "Parents"],
    topics: ["Social media safety", "Gaming security", "Cyberbullying prevention", "Privacy basics"]
  },
  {
    title: "Parent Guide",
    description: "Help your children navigate the digital world safely",
    icon: <Shield className="h-6 w-6" />,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    link: "/parent-guide",
    audience: ["Parents", "Guardians"],
    topics: ["Parental controls", "Screen time", "Talking to kids about safety", "Age-appropriate settings"]
  },
  {
    title: "Senior Safety Center",
    description: "Protect yourself from scams targeting older adults",
    icon: <AlertTriangle className="h-6 w-6" />,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    link: "/seniors",
    audience: ["Seniors", "Caregivers"],
    topics: ["Phone scam detection", "Romance scam awareness", "Tech support fraud", "Safe online shopping"]
  },
  {
    title: "Device Security",
    description: "Keep your phones, tablets, and computers protected",
    icon: <Smartphone className="h-6 w-6" />,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    link: "/training",
    audience: ["Everyone"],
    topics: ["Password managers", "Two-factor authentication", "Device updates", "Secure WiFi setup"]
  },
  {
    title: "Financial Protection",
    description: "Guard your money and identity from fraud",
    icon: <CreditCard className="h-6 w-6" />,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    link: "/training",
    audience: ["Adults", "Seniors"],
    topics: ["Credit freeze", "Transaction alerts", "Identity theft prevention", "Safe online banking"]
  },
  {
    title: "Privacy Controls",
    description: "Manage your digital footprint and personal data",
    icon: <Eye className="h-6 w-6" />,
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
    link: "/training",
    audience: ["Teens", "Adults"],
    topics: ["Social media settings", "App permissions", "Data broker removal", "Browser privacy"]
  }
];

const quickTips = [
  {
    title: "Create a Family Code Word",
    description: "Agree on a secret word only family members know to verify identity over phone or text.",
    time: "5 minutes"
  },
  {
    title: "Enable Two-Factor Authentication",
    description: "Add an extra layer of security to email, banking, and social media accounts.",
    time: "15 minutes"
  },
  {
    title: "Review Privacy Settings",
    description: "Check who can see your posts and contact you on social media.",
    time: "20 minutes"
  },
  {
    title: "Set Up Transaction Alerts",
    description: "Get instant notifications for all credit card and bank transactions.",
    time: "10 minutes"
  }
];

export default function Tutorials() {
  useSEO({
    title: "Family Safety Learning Center | GetCyberRight",
    description: "Learn how to protect your family online with our comprehensive guides for parents, children, teens, and seniors. Step-by-step tutorials for every skill level.",
    keywords: "family safety, online protection, parental guides, senior safety, cybersecurity education"
  });

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full mb-4">
            <BookOpen className="h-5 w-5" />
            <span className="font-medium">Learning Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Family Safety Guides
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Practical, plain-language guides to help every member of your family stay safe online.
            No technical jargon, just actionable steps you can take today.
          </p>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Shield className="h-6 w-6 text-teal-600" />
            Guides by Audience
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {familyGuides.map((guide) => (
              <Link key={guide.title} to={guide.link}>
                <Card className={`h-full border-2 hover:shadow-lg transition-all cursor-pointer ${guide.bgColor} hover:scale-[1.02]`}>
                  <CardContent className="p-6">
                    <div className={`inline-flex p-3 rounded-xl ${guide.bgColor} ${guide.color} mb-4`}>
                      {guide.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {guide.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {guide.audience.map((aud) => (
                        <Badge key={aud} variant="secondary" className="text-xs">
                          {aud}
                        </Badge>
                      ))}
                    </div>
                    <ul className="space-y-1">
                      {guide.topics.slice(0, 3).map((topic, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <CheckCircle2 className={`h-3 w-3 ${guide.color}`} />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-16 bg-white dark:bg-slate-800 rounded-2xl p-8 border">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-amber-600" />
            Quick Wins: Do These Today
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickTips.map((tip, i) => (
              <div 
                key={i}
                className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-5 border border-slate-200 dark:border-slate-600"
              >
                <Badge variant="outline" className="mb-3 text-xs">
                  ⏱️ {tip.time}
                </Badge>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
                  {tip.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <LearningPaths />
        </section>

        <section>
          <Card className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-3">Think You've Been Scammed?</h3>
              <p className="text-teal-100 mb-6 max-w-lg mx-auto">
                Don't panic. We have step-by-step guides to help you respond quickly 
                and minimize damage.
              </p>
              <Link to="/emergency-help">
                <Button size="lg" variant="secondary" className="bg-white text-teal-700 hover:bg-teal-50">
                  Get Emergency Help
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
