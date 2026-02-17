import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSEO } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ShareButtons } from "@/components/share-buttons";
import { 
  Shield, Phone, Mail, CreditCard, Heart, AlertTriangle, 
  CheckCircle, XCircle, Lock, Eye, MessageCircle, 
  ArrowRight, ArrowLeft, Lightbulb, Users, Gift, Smartphone, Wifi, MapPin
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { detectUserLocation } from "@/lib/region-detect";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const countryCodeToName: Record<string, string> = {
  'US': 'United States',
  'CA': 'Canada',
  'BR': 'Brazil',
  'GH': 'Ghana',
  'KE': 'Kenya',
  'NG': 'Nigeria',
  'ZA': 'South Africa',
  'GB': 'United Kingdom',
  'IN': 'India',
  'AU': 'Australia'
};

const commonScams = [
  {
    icon: Smartphone,
    title: "Mobile Money Scams (M-Pesa, MTN, Airtel)",
    description: "Fake SMS or calls claiming you received money, won a promotion, or need to 'reverse' a transaction",
    warning: "Your mobile money provider will NEVER ask for your PIN. Never share it with anyone!",
    regionTag: { label: "Common in Africa", color: "amber" },
    protection: [
      "Never share your mobile money PIN with anyone, not even agents",
      "Ignore SMS links claiming you won money or prizes",
      "If someone sends you money 'by mistake', visit the official agent instead of sending it back via phone",
      "Call your provider's official number to verify any claims"
    ]
  },
  {
    icon: CreditCard,
    title: "SIM Swap Fraud",
    description: "Criminals trick your phone provider into giving them your SIM, then steal your mobile money",
    warning: "If your phone suddenly loses network signal, call your provider immediately!",
    regionTag: { label: "Common in Africa", color: "amber" },
    protection: [
      "Set a SIM replacement PIN with your mobile provider",
      "Register your SIM card with your real ID documents",
      "Never share personal details over the phone",
      "Link mobile money alerts to a backup phone if possible"
    ]
  },
  {
    icon: MessageCircle,
    title: "WhatsApp & Social Media Scams",
    description: "Messages from 'friends' or strangers asking for money, offering jobs, or sharing fake investment opportunities",
    warning: "If a friend suddenly asks for money via WhatsApp, call them directly to verify",
    regionTag: { label: "Global threat", color: "blue" },
    protection: [
      "Call the person directly before sending any money",
      "Don't click links promising jobs, loans, or prizes",
      "Be suspicious of investment schemes with 'guaranteed' high returns",
      "Report and block suspicious accounts"
    ]
  },
  {
    icon: Phone,
    title: "Phone Scams",
    description: "Callers pretending to be from banks, government, mobile providers, or claiming a relative is in trouble",
    warning: "Government agencies and banks will NEVER call demanding immediate payment",
    regionTag: { label: "Global threat", color: "blue" },
    protection: [
      "Never give personal information to unexpected callers",
      "Hang up and call the official number if unsure",
      "Don't trust caller ID because it can be faked",
      "Verify by visiting the office in person if needed"
    ]
  },
  {
    icon: Mail,
    title: "Email & SMS Phishing",
    description: "Fake messages that look like they're from banks, mobile providers, or popular services",
    warning: "Real companies will never ask you to click a link to verify your password or PIN",
    regionTag: { label: "Global threat", color: "blue" },
    protection: [
      "Check the sender's phone number or email carefully",
      "Don't click links. Visit the official website or app instead",
      "Look for spelling errors and unusual requests",
      "When in doubt, call the company directly"
    ]
  },
  {
    icon: Heart,
    title: "Romance & Dating Scams",
    description: "Someone you meet online who develops feelings quickly then asks for money",
    warning: "If someone you've never met in person asks for money, it's almost always a scam",
    regionTag: { label: "Rising globally", color: "red" },
    protection: [
      "Never send money to someone you haven't met in person",
      "Be suspicious of quick declarations of love",
      "Scammers often claim to be abroad and need 'help'",
      "Ask family members for their opinion before sending money"
    ]
  },
  {
    icon: Gift,
    title: "Lottery, Job & Visa Scams",
    description: "Messages saying you've won money, offering overseas jobs, or promising visas for a fee",
    warning: "You cannot win a lottery you never entered. Real jobs don't ask for payment upfront.",
    regionTag: { label: "Common in Africa & Asia", color: "amber" },
    protection: [
      "Real lotteries and employers never ask for fees upfront",
      "Be very suspicious of overseas job or visa offers via social media",
      "Verify with official embassy websites for visa information",
      "Delete and don't respond to prize or job messages you didn't apply for"
    ]
  },
  {
    icon: Users,
    title: "Family Emergency Scams",
    description: "Caller or message claims a family member is in trouble and needs money urgently",
    warning: "Scammers create panic so you don't think clearly. Slow down and verify!",
    regionTag: { label: "Common in Americas", color: "teal" },
    protection: [
      "Hang up and call your family member's real number",
      "Create a family code word for real emergencies",
      "Ask questions only your real family would know",
      "Never send money based on a call or message alone"
    ]
  }
];

const quickTips = [
  {
    icon: Lock,
    title: "Protect Your PINs",
    tip: "Never share your mobile money PIN, bank PIN, or ATM PIN with anyone. Not even family members, agents, or people claiming to be from the bank."
  },
  {
    icon: Eye,
    title: "Guard Your Personal Info",
    tip: "Never share your ID number, bank account details, or mobile money account with someone who contacts you unexpectedly."
  },
  {
    icon: Phone,
    title: "Verify Before You Trust",
    tip: "If someone claims to be from a company, bank, or government, hang up and call their official number. Or visit their office in person."
  },
  {
    icon: MessageCircle,
    title: "Talk to Family First",
    tip: "Before sending money or making any major financial decision based on a call, SMS, or WhatsApp message, talk to a family member first."
  }
];

const warningSignsToWatch = [
  "Pressure to act immediately or something bad will happen",
  "Requests to share your mobile money PIN or bank PIN",
  "Someone asking you to send money to receive money (advance fee scams)",
  "Promises of jobs, visas, or prizes that seem too good to be true",
  "Being told to keep the transaction secret from family",
  "Requests for personal documents like ID copies via WhatsApp",
  "Caller becomes angry or threatening when questioned",
  "A 'friend' asking for money via social media without calling you first",
  "'Wrong number' mobile money transfers asking you to reverse payment"
];

export default function SeniorSafety() {
  const [userCountry, setUserCountry] = useState<string>("");

  useEffect(() => {
    detectUserLocation().then(location => {
      const countryName = countryCodeToName[location.countryCode] || "";
      setUserCountry(countryName);
    });
  }, []);

  const isHighlighted = (country: string) => userCountry === country;

  useSEO({
    title: "Senior Safety - Scam Protection for Seniors | GetCyberRight",
    description: "Protect seniors from online scams, phone fraud, and mobile money scams. Simple safety tips for older adults and families.",
    keywords: "senior online safety, elderly scam protection, phone scam protection, grandparent scam, tech support scam, romance scam elderly"
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-600 via-orange-500 to-amber-600 text-white py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <Shield className="h-4 w-4" />
              <span className="text-sm">Online Safety for Seniors</span>
            </motion.div>
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              Protecting Yourself Online
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-amber-100 leading-relaxed max-w-2xl mx-auto"
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              Simple, practical tips to help you stay safe from online scams and fraud. You don't need to be a technology expert. Just learn the warning signs.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Back Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-3">
          <Link to="/resources" className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Resources
          </Link>
        </div>
      </div>

      {/* Golden Rule Banner */}
      <section className="bg-yellow-50 dark:bg-yellow-900/20 py-6 border-b border-yellow-200 dark:border-yellow-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-3 text-center max-w-2xl mx-auto">
            <AlertTriangle className="h-8 w-8 text-yellow-600 flex-shrink-0" />
            <div>
              <p className="text-yellow-800 dark:text-yellow-200 font-bold text-lg">
                The Golden Rule: If you didn't expect it, don't trust it!
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                Unexpected calls, emails, or messages asking for money or personal information are almost always scams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section id="quick-actions" className="py-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="#safety-rules" className="flex flex-col items-center p-4 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors text-center group">
                <Lock className="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-slate-900 dark:text-white text-sm">Safety Rules</span>
              </a>
              <a href="#common-scams" className="flex flex-col items-center p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors text-center group">
                <AlertTriangle className="h-8 w-8 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-slate-900 dark:text-white text-sm">Scam Types</span>
              </a>
              <a href="#videos" className="flex flex-col items-center p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors text-center group">
                <Eye className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-slate-900 dark:text-white text-sm">Watch Videos</span>
              </a>
              <Link to="/emergency-help" className="flex flex-col items-center p-4 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-center group">
                <Shield className="h-8 w-8 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-slate-900 dark:text-white text-sm">Get Help Now</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Tips */}
      <section id="safety-rules" className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              4 Essential Safety Rules
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Remember these simple rules to protect yourself
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {quickTips.map((tip, index) => {
              const IconComponent = tip.icon;
              return (
                <Card key={index} className="text-center border-2 hover:border-green-500/50 transition-all" data-testid={`quick-tip-${index}`}>
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-7 w-7 text-green-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3">{tip.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{tip.tip}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Warning Signs */}
      <section className="py-16 bg-red-50 dark:bg-red-900/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Warning Signs of a Scam
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                If you notice ANY of these signs, stop and verify before proceeding
              </p>
            </div>

            <Card className="border-2 border-red-200 dark:border-red-800">
              <CardContent className="p-6">
                <ul className="space-y-4">
                  {warningSignsToWatch.map((sign, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300 text-lg">{sign}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Common Scams */}
      <section id="common-scams" className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Common Scams to Watch For
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Learn about the most common scams that target seniors and their families
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {commonScams.map((scam, index) => {
              const IconComponent = scam.icon;
              const badgeColors: Record<string, string> = {
                amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
                blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
                teal: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
              };
              return (
                <Card key={index} className="border-2" data-testid={`scam-${index}`}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-lg">{scam.title}</CardTitle>
                          <Badge className={`text-xs font-normal ${badgeColors[scam.regionTag.color]}`}>
                            <MapPin className="h-3 w-3 mr-1" />
                            {scam.regionTag.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{scam.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        <Lightbulb className="h-4 w-4 inline mr-2" />
                        {scam.warning}
                      </p>
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">How to Protect Yourself:</h4>
                    <ul className="space-y-2">
                      {scam.protection.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-600 dark:text-slate-400">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Videos Section */}
      <section id="videos" className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Eye className="h-10 w-10 text-purple-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Watch & Learn
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Simple videos to help you recognize and avoid scams
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="overflow-hidden border-2">
              <div className="aspect-video bg-slate-100 dark:bg-slate-800">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/2UT0z_0YQTY"
                  title="How to Spot a Scam"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">How to Spot a Scam</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Learn the warning signs that help you identify scams</p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-2">
              <div className="aspect-video bg-slate-100 dark:bg-slate-800">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/t5x3PXOqYuU"
                  title="Protecting Yourself from Phone Scams"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">Phone Scam Protection</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">How to handle suspicious phone calls safely</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What To Do If Scammed - Link to Emergency Help */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              If You Think You've Been Scammed
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
              Don't be embarrassed. Scammers are professionals who trick thousands of people. 
              We have step-by-step recovery guides and emotional support resources to help you.
            </p>
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <Link to="/emergency-help" className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Get Immediate Help
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Helpful Resources - Global Coverage */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-teal-700">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center text-white">
            <Shield className="h-12 w-12 mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Emergency Contacts Worldwide
            </h2>
            <p className="text-green-100 text-lg mb-8">
              Save these numbers for when you or your family need help
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white/90 mb-3">Americas</h3>
                <div className="grid md:grid-cols-3 gap-4 text-left">
                  <Card className={`${isHighlighted("United States") ? "bg-amber-500/30 border-amber-400 ring-2 ring-amber-400" : "bg-white/10 border-white/20"}`}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        United States
                        {isHighlighted("United States") && <Badge className="bg-amber-500 text-white text-xs">Your Location</Badge>}
                      </h4>
                      <p className="text-green-100 text-sm">FBI IC3: ic3.gov</p>
                      <p className="text-green-100 text-sm">FTC: 1-877-382-4357</p>
                    </CardContent>
                  </Card>
                  <Card className={`${isHighlighted("Canada") ? "bg-amber-500/30 border-amber-400 ring-2 ring-amber-400" : "bg-white/10 border-white/20"}`}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        Canada
                        {isHighlighted("Canada") && <Badge className="bg-amber-500 text-white text-xs">Your Location</Badge>}
                      </h4>
                      <p className="text-green-100 text-sm">CAFC: 1-888-495-8501</p>
                      <p className="text-green-100 text-sm">antifraudcentre.ca</p>
                    </CardContent>
                  </Card>
                  <Card className={`${isHighlighted("Brazil") ? "bg-amber-500/30 border-amber-400 ring-2 ring-amber-400" : "bg-white/10 border-white/20"}`}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        Brazil
                        {isHighlighted("Brazil") && <Badge className="bg-amber-500 text-white text-xs">Your Location</Badge>}
                      </h4>
                      <p className="text-green-100 text-sm">Police: 190</p>
                      <p className="text-green-100 text-sm">Consumer Protection: 151</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white/90 mb-3">Africa</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                  <Card className={`${isHighlighted("Ghana") ? "bg-amber-500/30 border-amber-400 ring-2 ring-amber-400" : "bg-white/10 border-white/20"}`}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        Ghana
                        {isHighlighted("Ghana") && <Badge className="bg-amber-500 text-white text-xs">Your Location</Badge>}
                      </h4>
                      <p className="text-green-100 text-sm">Police CID: 18555</p>
                      <p className="text-green-100 text-sm">Cyber Authority: +233 302 500 500</p>
                    </CardContent>
                  </Card>
                  <Card className={`${isHighlighted("Kenya") ? "bg-amber-500/30 border-amber-400 ring-2 ring-amber-400" : "bg-white/10 border-white/20"}`}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        Kenya
                        {isHighlighted("Kenya") && <Badge className="bg-amber-500 text-white text-xs">Your Location</Badge>}
                      </h4>
                      <p className="text-green-100 text-sm">Safaricom: 0722 002 222</p>
                      <p className="text-green-100 text-sm">Police Cybercrime: 0800 723 253</p>
                    </CardContent>
                  </Card>
                  <Card className={`${isHighlighted("Nigeria") ? "bg-amber-500/30 border-amber-400 ring-2 ring-amber-400" : "bg-white/10 border-white/20"}`}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        Nigeria
                        {isHighlighted("Nigeria") && <Badge className="bg-amber-500 text-white text-xs">Your Location</Badge>}
                      </h4>
                      <p className="text-green-100 text-sm">EFCC: +234 9 9044751</p>
                      <p className="text-green-100 text-sm">NPF Cyber: cybercrime@npf.gov.ng</p>
                    </CardContent>
                  </Card>
                  <Card className={`${isHighlighted("South Africa") ? "bg-amber-500/30 border-amber-400 ring-2 ring-amber-400" : "bg-white/10 border-white/20"}`}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        South Africa
                        {isHighlighted("South Africa") && <Badge className="bg-amber-500 text-white text-xs">Your Location</Badge>}
                      </h4>
                      <p className="text-green-100 text-sm">SAPS: 08600 10111</p>
                      <p className="text-green-100 text-sm">FIC: 0800 223 322</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white/90 mb-3">Europe & Asia</h3>
                <div className="grid md:grid-cols-3 gap-4 text-left">
                  <Card className={`${isHighlighted("United Kingdom") ? "bg-amber-500/30 border-amber-400 ring-2 ring-amber-400" : "bg-white/10 border-white/20"}`}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        United Kingdom
                        {isHighlighted("United Kingdom") && <Badge className="bg-amber-500 text-white text-xs">Your Location</Badge>}
                      </h4>
                      <p className="text-green-100 text-sm">Action Fraud: 0300 123 2040</p>
                      <p className="text-green-100 text-sm">actionfraud.police.uk</p>
                    </CardContent>
                  </Card>
                  <Card className={`${isHighlighted("India") ? "bg-amber-500/30 border-amber-400 ring-2 ring-amber-400" : "bg-white/10 border-white/20"}`}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        India
                        {isHighlighted("India") && <Badge className="bg-amber-500 text-white text-xs">Your Location</Badge>}
                      </h4>
                      <p className="text-green-100 text-sm">Cyber Crime: 1930</p>
                      <p className="text-green-100 text-sm">cybercrime.gov.in</p>
                    </CardContent>
                  </Card>
                  <Card className={`${isHighlighted("Australia") ? "bg-amber-500/30 border-amber-400 ring-2 ring-amber-400" : "bg-white/10 border-white/20"}`}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        Australia
                        {isHighlighted("Australia") && <Badge className="bg-amber-500 text-white text-xs">Your Location</Badge>}
                      </h4>
                      <p className="text-green-100 text-sm">Scamwatch: 1300 795 995</p>
                      <p className="text-green-100 text-sm">scamwatch.gov.au</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            
            <p className="text-green-200 text-sm mt-8">
              For a complete list of emergency contacts in 25+ countries, visit our <Link to="/emergency-help" className="underline font-medium">Emergency Help page</Link>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Test Your Scam-Spotting Skills
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Take our quick quiz to see if you can identify common scam tactics
            </p>
            <Button asChild size="lg" data-testid="button-take-quiz">
              <Link to="/cyber-hygiene" className="flex items-center gap-2">
                Take the Quiz <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            
            {/* Share Buttons */}
            <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Share with parents and grandparents</p>
              <div className="flex justify-center">
                <ShareButtons 
                  title="Senior Safety Guide - GetCyberRight" 
                  description="Protect your loved ones from mobile money scams, SIM swap fraud, and WhatsApp scams. Essential safety tips for seniors."
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
