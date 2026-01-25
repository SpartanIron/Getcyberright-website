import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useSEO } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Baby, Heart, Smartphone, Phone, AlertTriangle,
  ExternalLink, Download, FileText, ArrowRight,
  CheckCircle, Mail, ChevronDown, ChevronUp, Globe, Shield
} from "lucide-react";
import resourcesBannerImage from "@assets/image_1768682606025.png";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const youthResources = [
  {
    title: "UNICEF - Keeping Children Safe Online",
    description: "Comprehensive guide for parents and educators on protecting children in digital spaces. Includes age-appropriate conversation guides and safety checklists.",
    url: "https://www.unicef.org/parenting/child-care/keep-your-child-safe-online",
    source: "UNICEF",
    bandwidth: "Low",
    audience: "Parents & Educators"
  },
  {
    title: "Meta Family Center",
    description: "Official parental controls and supervision tools for Facebook, Instagram, WhatsApp, and Messenger. Set time limits, content filters, and monitor activity.",
    url: "https://familycenter.meta.com/",
    source: "Meta",
    bandwidth: "Medium",
    audience: "Parents"
  },
  {
    title: "Google Family Link",
    description: "Free parental control app for Android devices. Manage apps, set screen time limits, lock devices remotely, and track location.",
    url: "https://families.google.com/familylink/",
    source: "Google",
    bandwidth: "Low",
    audience: "Parents"
  },
  {
    title: "TikTok Safety Center",
    description: "Learn about TikTok's safety features including Restricted Mode, Family Pairing, screen time management, and privacy settings for young users.",
    url: "https://www.tiktok.com/safety",
    source: "TikTok",
    bandwidth: "Medium",
    audience: "Parents & Teens"
  },
  {
    title: "Common Sense Media",
    description: "Age-based ratings and reviews for apps, games, movies, and websites. Helps parents make informed decisions about media for their children.",
    url: "https://www.commonsensemedia.org/",
    source: "Common Sense",
    bandwidth: "Medium",
    audience: "Parents"
  },
  {
    title: "Cyberbullying Research Center",
    description: "Research-based resources on identifying, preventing, and responding to cyberbullying. Includes guides for schools, parents, and young people.",
    url: "https://cyberbullying.org/",
    source: "Academic Research",
    bandwidth: "Low",
    audience: "Everyone"
  }
];

const seniorResources = [
  {
    title: "GSMA Mobile Money Safety Guidelines",
    description: "Official industry guidelines for safe mobile money usage. Learn how M-Pesa, MTN Mobile Money, Airtel Money, and other services protect your funds.",
    url: "https://www.gsma.com/mobilefordevelopment/mobile-money/",
    source: "GSMA",
    bandwidth: "Low",
    audience: "All Mobile Money Users"
  },
  {
    title: "Safaricom M-Pesa Security Tips",
    description: "Official security guidance from Safaricom on protecting your M-Pesa account. Learn about PIN safety, fraud prevention, and how to report suspicious activity.",
    url: "https://www.safaricom.co.ke/personal/m-pesa",
    source: "Safaricom",
    bandwidth: "Low",
    audience: "Kenya"
  },
  {
    title: "MTN Mobile Money Safety",
    description: "Security tips and fraud prevention guidance for MTN Mobile Money users across Africa. Includes SIM swap protection and PIN security.",
    url: "https://www.mtn.com/",
    source: "MTN Group",
    bandwidth: "Low",
    audience: "MTN Countries"
  },
  {
    title: "WhatsApp Security Features",
    description: "Learn about end-to-end encryption, two-step verification, disappearing messages, and how to block and report suspicious contacts.",
    url: "https://www.whatsapp.com/security",
    source: "WhatsApp",
    bandwidth: "Low",
    audience: "All WhatsApp Users"
  },
  {
    title: "AARP Fraud Watch Network",
    description: "Comprehensive scam prevention resources including common scam alerts, victim support, and a free helpline for scam concerns.",
    url: "https://www.aarp.org/money/scams-fraud/",
    source: "AARP",
    bandwidth: "Medium",
    audience: "Seniors Worldwide"
  },
  {
    title: "Action Fraud UK",
    description: "UK's national fraud reporting centre. Report fraud, get alerts about new scams, and access prevention advice that applies globally.",
    url: "https://www.actionfraud.police.uk/",
    source: "UK Government",
    bandwidth: "Low",
    audience: "UK & Commonwealth"
  }
];

const mobileTools = [
  {
    title: "Avast One Essential (Free)",
    description: "Lightweight mobile security app with virus scanning, Wi-Fi security checker, and privacy protection. Works well on low-end Android devices.",
    url: "https://play.google.com/store/apps/details?id=com.avast.android.mobilesecurity",
    platform: "Android",
    cost: "Free",
    size: "~50MB"
  },
  {
    title: "Malwarebytes Mobile Security",
    description: "Detects malware, ransomware, and phishing attacks. Includes privacy audit to show which apps access your data.",
    url: "https://play.google.com/store/apps/details?id=org.malwarebytes.antimalware",
    platform: "Android",
    cost: "Free",
    size: "~30MB"
  },
  {
    title: "Google Authenticator",
    description: "Free two-factor authentication app. Add extra security to your email, social media, and banking apps with one-time codes.",
    url: "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2",
    platform: "Android & iOS",
    cost: "Free",
    size: "~15MB"
  },
  {
    title: "Have I Been Pwned",
    description: "Check if your email or phone number has been exposed in a data breach. Simple, free, and private with no account needed.",
    url: "https://haveibeenpwned.com/",
    platform: "Web",
    cost: "Free",
    size: "N/A"
  },
  {
    title: "Signal Private Messenger",
    description: "End-to-end encrypted messaging and calls. More private than WhatsApp with minimal data collection. Works on slow connections.",
    url: "https://signal.org/",
    platform: "Android, iOS, Desktop",
    cost: "Free",
    size: "~30MB"
  },
  {
    title: "Bitwarden Password Manager",
    description: "Free, open-source password manager. Store all your passwords securely and access them on any device.",
    url: "https://bitwarden.com/",
    platform: "All Platforms",
    cost: "Free",
    size: "~20MB"
  }
];


const offlineResources = [
  {
    id: "mobile-money",
    title: "Mobile Money Safety Checklist",
    description: "One-page printable guide covering PIN security, SIM swap prevention, and what to do if you're scammed.",
    format: "PDF - 1 page",
    audience: "Seniors"
  },
  {
    id: "social-media",
    title: "Social Media Safety Guide",
    description: "Visual guide covering privacy settings, safe sharing, and account security.",
    format: "PDF - 1 page",
    audience: "Youth"
  },
  {
    id: "sim-swap",
    title: "SIM Swap Protection Card",
    description: "Wallet-sized card with steps to protect your phone number from theft.",
    format: "PDF - Printable Card",
    audience: "Everyone"
  },
  {
    id: "whatsapp-scams",
    title: "WhatsApp Scam Recognition Guide",
    description: "Examples of common WhatsApp scams with what to watch for and how to respond.",
    format: "PDF - 1 page",
    audience: "Everyone"
  }
];

const INITIAL_ITEMS = 3;

export default function Resources() {
  const [showAllYouth, setShowAllYouth] = useState(false);
  const [showAllSenior, setShowAllSenior] = useState(false);
  const [showAllTools, setShowAllTools] = useState(false);
  
  useSEO({
    title: "Cyber Safety Resources & Guides | GetCyberRight",
    description: "Free cybersecurity resources for families. Parental controls, printable checklists, and curated safety tools for every age group.",
    keywords: "cybersecurity resources, parental controls, online safety guides, family safety tools, printable safety checklist"
  });

  const visibleYouthResources = showAllYouth ? youthResources : youthResources.slice(0, INITIAL_ITEMS);
  const visibleSeniorResources = showAllSenior ? seniorResources : seniorResources.slice(0, INITIAL_ITEMS);
  const visibleMobileTools = showAllTools ? mobileTools : mobileTools.slice(0, INITIAL_ITEMS);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative text-white py-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${resourcesBannerImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/35 to-slate-900/50" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 
              className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg"
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              Cyber Safety Resources
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-white font-medium mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              Free tools and guides you can actually use. Everything here works on mobile, is easy to understand, and was designed with families in mind.
            </motion.p>
          </motion.div>

          {/* Emergency SOS Card */}
          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-red-600 border-red-500 text-white">
              <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Been Scammed? Act Now!</h3>
                    <p className="text-red-100 text-sm">Report within 24 hours for best chance of recovery</p>
                  </div>
                </div>
                <Button 
                  asChild
                  className="bg-white text-red-600 hover:bg-red-50 shrink-0"
                  data-testid="button-emergency-help"
                >
                  <Link to="/emergency-help">Get Emergency Help</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 py-4">
            <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => document.getElementById('youth')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="nav-youth"
              >
                <Baby className="h-4 w-4" />
                Youth Safety
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => document.getElementById('seniors')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="nav-seniors"
              >
                <Heart className="h-4 w-4" />
                Senior Protection
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="nav-tools"
              >
                <Smartphone className="h-4 w-4" />
                Security Tools
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="gap-2"
                data-testid="nav-printable"
              >
                <Link to="/printable-guides">
                  <Download className="h-4 w-4" />
                  Printable Guides
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => document.getElementById('trusted-sources')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="nav-trusted"
              >
                <Globe className="h-4 w-4" />
                Trusted Sources
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="gap-2 text-red-600 dark:text-red-400"
                data-testid="nav-emergency"
              >
                <Link to="/emergency-help">
                  <Phone className="h-4 w-4" />
                  Emergency Help
                </Link>
              </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Youth Safety Toolkit */}
        <section id="youth" className="mb-16 scroll-mt-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Baby className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Youth Safety Toolkit</h2>
                <p className="text-slate-600 dark:text-slate-400">Help keep your kids safe online</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {visibleYouthResources.map((resource, index) => (
              <motion.div key={index} variants={fadeInUp} transition={{ duration: 0.5 }}>
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                  <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer" data-testid={`resource-youth-${index}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-slate-900 dark:text-white pr-2">{resource.title}</h3>
                        <ExternalLink className="h-4 w-4 text-slate-400 shrink-0" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{resource.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">{resource.source}</Badge>
                        <Badge variant="outline" className="text-xs">{resource.bandwidth} Data</Badge>
                        <Badge variant="outline" className="text-xs">{resource.audience}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            {youthResources.length > INITIAL_ITEMS && (
              <Button 
                variant="ghost" 
                onClick={() => setShowAllYouth(!showAllYouth)}
                className="gap-2"
              >
                {showAllYouth ? (
                  <>Show Less <ChevronUp className="h-4 w-4" /></>
                ) : (
                  <>Show {youthResources.length - INITIAL_ITEMS} More <ChevronDown className="h-4 w-4" /></>
                )}
              </Button>
            )}
            <Button asChild variant="outline" data-testid="button-youth-guide">
              <Link to="/youth-safety" className="flex items-center gap-2">
                View Complete Youth Safety Guide <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Senior Protection Center */}
        <section id="seniors" className="mb-16 scroll-mt-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Senior Protection Center</h2>
                <p className="text-slate-600 dark:text-slate-400">Avoid scams and protect your money</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {visibleSeniorResources.map((resource, index) => (
              <motion.div key={index} variants={fadeInUp} transition={{ duration: 0.5 }}>
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                  <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer" data-testid={`resource-senior-${index}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-slate-900 dark:text-white pr-2">{resource.title}</h3>
                        <ExternalLink className="h-4 w-4 text-slate-400 shrink-0" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{resource.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">{resource.source}</Badge>
                        <Badge variant="outline" className="text-xs">{resource.bandwidth} Data</Badge>
                        <Badge variant="outline" className="text-xs">{resource.audience}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            {seniorResources.length > INITIAL_ITEMS && (
              <Button 
                variant="ghost" 
                onClick={() => setShowAllSenior(!showAllSenior)}
                className="gap-2"
              >
                {showAllSenior ? (
                  <>Show Less <ChevronUp className="h-4 w-4" /></>
                ) : (
                  <>Show {seniorResources.length - INITIAL_ITEMS} More <ChevronDown className="h-4 w-4" /></>
                )}
              </Button>
            )}
            <Button asChild variant="outline" data-testid="button-senior-guide">
              <Link to="/senior-safety" className="flex items-center gap-2">
                View Complete Senior Safety Guide <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Mobile-First Security Tools */}
        <section id="tools" className="mb-16 scroll-mt-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Free Security Tools</h2>
                <p className="text-slate-600 dark:text-slate-400">Apps that work even on basic phones</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {visibleMobileTools.map((tool, index) => (
              <motion.div key={index} variants={fadeInUp} transition={{ duration: 0.5 }}>
                <a href={tool.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                  <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer" data-testid={`tool-${index}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-slate-900 dark:text-white pr-2">{tool.title}</h3>
                        <ExternalLink className="h-4 w-4 text-slate-400 shrink-0" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{tool.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs">{tool.cost}</Badge>
                        <Badge variant="outline" className="text-xs">{tool.platform}</Badge>
                        <Badge variant="outline" className="text-xs">{tool.size}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            ))}
          </motion.div>

          {mobileTools.length > INITIAL_ITEMS && (
            <div className="mt-6 text-center">
              <Button 
                variant="ghost" 
                onClick={() => setShowAllTools(!showAllTools)}
                className="gap-2"
              >
                {showAllTools ? (
                  <>Show Less <ChevronUp className="h-4 w-4" /></>
                ) : (
                  <>Show {mobileTools.length - INITIAL_ITEMS} More <ChevronDown className="h-4 w-4" /></>
                )}
              </Button>
            </div>
          )}
        </section>

        {/* Offline Resources */}
        <section className="mb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Offline Resources</h2>
                <p className="text-slate-600 dark:text-slate-400">Print these out, no internet needed</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {offlineResources.map((resource, index) => (
              <motion.div key={index} variants={fadeInUp} transition={{ duration: 0.5 }}>
                <Link to={`/printable-guides#${resource.id}`}>
                  <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer" data-testid={`offline-${index}`}>
                    <CardContent className="p-5">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-3">
                        <Download className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">{resource.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{resource.description}</p>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">{resource.format}</Badge>
                        <Badge variant="secondary" className="text-xs">{resource.audience}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Emergency Help CTA */}
        <section className="mb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <Link to="/emergency-help">
              <Card className="bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                      <Phone className="h-8 w-8" />
                    </div>
                    <div className="text-center md:text-left flex-1">
                      <h2 className="text-2xl font-bold mb-2">Need Emergency Help?</h2>
                      <p className="text-red-100 mb-4">
                        Find emergency contacts for 30+ countries, step-by-step recovery guides, and immediate action checklists.
                      </p>
                      <span className="inline-flex items-center gap-2 text-white font-semibold">
                        Go to Emergency Help <ArrowRight className="h-5 w-5" />
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-3">Can't Find What You Need?</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Our team is constantly adding new resources. If you need help finding specific information for your country or situation, let us know.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50" data-testid="button-contact">
                  <Link to="/about" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Contact Us
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10" data-testid="button-skill-check">
                  <Link to="/quick-assessment" className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Check Your Cyber Safety
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
