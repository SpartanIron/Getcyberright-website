import { useSEO } from "@/hooks/use-seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  BookOpen, Baby, Heart, Users, GraduationCap,
  ArrowRight, Lightbulb, Target, Shield, Globe
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const guides = [
  {
    title: "Youth Safety Hub",
    description: "Age-appropriate guides for protecting children and teens online. Social media safety, gaming, and digital citizenship.",
    icon: Baby,
    link: "/kids",
    color: "bg-blue-100 dark:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    audience: "Parents & Kids"
  },
  {
    title: "Senior Safety Center",
    description: "Plain-language guides designed for older adults. Scam recognition, safe banking, and staying connected with family.",
    icon: Heart,
    link: "/seniors",
    color: "bg-rose-100 dark:bg-rose-900/50",
    iconColor: "text-rose-600 dark:text-rose-400",
    audience: "Seniors & Caregivers"
  },
  {
    title: "Parent's Complete Guide",
    description: "Everything parents need to know about keeping their family safe. Device controls, conversation starters, and monitoring tips.",
    icon: Users,
    link: "/parent-guide",
    color: "bg-purple-100 dark:bg-purple-900/50",
    iconColor: "text-purple-600 dark:text-purple-400",
    audience: "Parents"
  },
  {
    title: "Cyber Awareness Basics",
    description: "Foundation knowledge everyone needs. Common threats, safe practices, and how to spot suspicious activity.",
    icon: Lightbulb,
    link: "/resources",
    color: "bg-amber-100 dark:bg-amber-900/50",
    iconColor: "text-amber-600 dark:text-amber-400",
    audience: "Everyone"
  },
  {
    title: "Cyber Hygiene",
    description: "Daily habits that keep you safe. Password management, software updates, secure browsing, and privacy settings.",
    icon: Shield,
    link: "/cyber-hygiene",
    color: "bg-teal-100 dark:bg-teal-900/50",
    iconColor: "text-teal-600 dark:text-teal-400",
    audience: "Everyone"
  },
  {
    title: "Travel Safety Guide",
    description: "Stay secure while traveling. Public WiFi risks, device protection abroad, and keeping your data safe on the go.",
    icon: Globe,
    link: "/travel-safety",
    color: "bg-green-100 dark:bg-green-900/50",
    iconColor: "text-green-600 dark:text-green-400",
    audience: "Travelers"
  }
];

const quickReads = [
  {
    title: "Cybersecurity Glossary",
    description: "Plain-language definitions of common terms",
    link: "/resources/glossary",
    badge: "Reference"
  },
  {
    title: "Latest Cyber News",
    description: "Stay updated on threats and trends",
    link: "/news",
    badge: "Daily Updates"
  },
  {
    title: "Our Impact",
    description: "See how we're making families safer",
    link: "/impact",
    badge: "5 min read"
  }
];

export default function Educate() {
  useSEO({
    title: "Learn Cyber Safety - Educational Guides | GetCyberRight",
    description: "Free, jargon-free guides that explain digital risks in plain language. Learn to protect yourself and your family online.",
    keywords: "cyber safety education, online safety guides, digital literacy, cybersecurity learning"
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-10 w-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Learn to Protect Yourself
            </h1>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Clear, jargon-free guides that explain digital risks in plain language anyone can understand.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="secondary" className="bg-white/20 text-white border-0 px-4 py-2 text-sm">
                <GraduationCap className="h-4 w-4 mr-2" />
                No Tech Background Needed
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-0 px-4 py-2 text-sm">
                <Target className="h-4 w-4 mr-2" />
                Practical & Actionable
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Guides Section */}
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
              Guides for Every Family Member
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Choose your learning path based on who you want to protect
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 max-w-6xl 2xl:max-w-7xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {guides.map((guide) => (
              <motion.div key={guide.title} variants={fadeInUp}>
                <Link to={guide.link}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-md bg-white dark:bg-slate-800">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 ${guide.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <guide.icon className={`h-7 w-7 ${guide.iconColor}`} />
                        </div>
                        <Badge variant="outline" className="text-xs font-medium">
                          {guide.audience}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-grow mb-4">
                        {guide.description}
                      </p>
                      <span className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold flex items-center gap-1 mt-auto">
                        Start Learning <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Reads Section */}
      <section className="py-12 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Quick Reads & References
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Bite-sized resources for busy families
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {quickReads.map((item) => (
              <motion.div key={item.title} variants={fadeInUp}>
                <Link to={item.link}>
                  <Card className="h-full hover:shadow-md transition-all duration-300 cursor-pointer group border border-slate-200 dark:border-slate-700">
                    <CardContent className="p-5">
                      <Badge variant="secondary" className="text-xs mb-3">
                        {item.badge}
                      </Badge>
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white max-w-4xl mx-auto shadow-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Not Sure Where to Start?
            </h2>
            <p className="text-indigo-100 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
              Take our quick Safety Score quiz to get personalized recommendations based on your situation.
            </p>
            <Button asChild size="lg" className="bg-green-500 text-white hover:bg-green-600 font-semibold px-8">
              <Link to="/cyber-hygiene" className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Check Your Safety Score
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
