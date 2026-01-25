import { useSEO } from "@/hooks/use-seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  ShieldCheck, AlertTriangle, Bell, Search, Shield,
  ArrowRight, Phone, Newspaper, BarChart3,
  MessageCircle, Zap
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const primaryTools = [
  {
    title: "Scam Checker",
    description: "Check suspicious URLs, phone numbers, or describe a situation to get instant analysis. Uses AI to detect common scam patterns.",
    icon: Search,
    link: "/scam-checker",
    color: "bg-teal-100 dark:bg-teal-900/50",
    iconColor: "text-teal-600 dark:text-teal-400",
    badge: "AI-Powered"
  },
  {
    title: "Emergency Help",
    description: "Been scammed? Get immediate guidance on what to do next, who to contact, and how to minimize damage.",
    icon: AlertTriangle,
    link: "/emergency-help",
    color: "bg-red-100 dark:bg-red-900/50",
    iconColor: "text-red-600 dark:text-red-400",
    badge: "Urgent Help"
  }
];

const secondaryTools = [
  {
    title: "Ask Dezi",
    description: "Our AI safety assistant can answer your cybersecurity questions in plain language, 24/7.",
    icon: MessageCircle,
    link: "/#dezi",
    color: "bg-indigo-100 dark:bg-indigo-900/50",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    badge: "AI Assistant"
  },
  {
    title: "Threat Intelligence",
    description: "Real-time dashboard showing current cyber threats, attack trends, and regional threat data.",
    icon: BarChart3,
    link: "/threat-intelligence",
    color: "bg-purple-100 dark:bg-purple-900/50",
    iconColor: "text-purple-600 dark:text-purple-400",
    badge: "Live Data"
  }
];

const alertSources = [
  {
    title: "Latest Cyber News",
    description: "Stay updated with curated news from FBI IC3, CISA, INTERPOL, and other Trusted Sources.",
    icon: Newspaper,
    link: "/news"
  },
  {
    title: "Live Threat Feed",
    description: "Real-time feed of emerging threats and security alerts from around the world.",
    icon: Zap,
    link: "/live-feed"
  }
];

export default function Protect() {
  useSEO({
    title: "Protection Tools & Alerts - Stay Safe Online | GetCyberRight",
    description: "Real-time scam checking, threat alerts, and emergency help. Stay one step ahead of online threats with our protection tools.",
    keywords: "scam checker, cyber threat alerts, online protection, emergency scam help"
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Active Protection
            </h1>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Real-time scam checking and alerts to help you stay one step ahead of threats.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="secondary" className="bg-white/20 text-white border-0 px-4 py-2 text-sm">
                <Shield className="h-4 w-4 mr-2" />
                Instant Analysis
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-0 px-4 py-2 text-sm">
                <Bell className="h-4 w-4 mr-2" />
                Real-Time Alerts
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Primary Protection Tools */}
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
              Protection Tools
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Check threats, get help, and stay informed
            </p>
          </motion.div>

          {/* Primary Tools - Large Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {primaryTools.map((tool) => (
              <motion.div key={tool.title} variants={fadeInUp}>
                <Link to={tool.link}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-md bg-white dark:bg-slate-800">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-16 h-16 ${tool.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <tool.icon className={`h-8 w-8 ${tool.iconColor}`} />
                        </div>
                        <Badge variant="outline" className="text-xs font-medium">
                          {tool.badge}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-grow mb-4">
                        {tool.description}
                      </p>
                      <span className="text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1 mt-auto">
                        Use Now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Secondary Tools - Smaller Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {secondaryTools.map((tool) => (
              <motion.div key={tool.title} variants={fadeInUp}>
                <Link to={tool.link}>
                  <Card className="h-full hover:shadow-md transition-all duration-300 cursor-pointer group border border-slate-200 dark:border-slate-700">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          <tool.icon className={`h-6 w-6 ${tool.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                              {tool.title}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {tool.badge}
                            </Badge>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stay Informed Section */}
      <section className="py-12 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Stay Informed
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Keep up with the latest threats and security news
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {alertSources.map((source) => (
              <motion.div key={source.title} variants={fadeInUp}>
                <Link to={source.link}>
                  <Card className="h-full hover:shadow-md transition-all duration-300 cursor-pointer group border border-slate-200 dark:border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-teal-100 dark:group-hover:bg-teal-900/50 transition-colors duration-300">
                          <source.icon className="h-6 w-6 text-slate-600 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors mb-1">
                            {source.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            {source.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Emergency CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl p-8 md:p-12 text-center text-white max-w-4xl mx-auto shadow-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Been Scammed?
            </h2>
            <p className="text-red-100 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
              Don't panic. Get step-by-step guidance on what to do next, who to contact, and how to protect yourself from further harm.
            </p>
            <Button asChild size="lg" className="bg-white text-red-600 hover:bg-red-50 font-semibold px-8">
              <Link to="/emergency-help" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Get Emergency Help Now
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
