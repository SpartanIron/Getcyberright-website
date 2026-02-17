import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSEO } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ShareButtons } from "@/components/share-buttons";
import { 
  Shield, Smartphone, Settings, MessageCircle, Eye, Lock, 
  AlertTriangle, Heart, CheckCircle, XCircle, Lightbulb,
  ArrowRight, ArrowLeft, Users, Clock, Bell, Monitor, Wifi
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const parentalControlGuides = [
  {
    icon: Smartphone,
    title: "Phone & Tablet Controls",
    description: "Set up built-in parental controls on Android and iPhone devices",
    color: "blue",
    steps: [
      "Android: Go to Settings → Digital Wellbeing → Parental Controls",
      "iPhone: Go to Settings → Screen Time → Content & Privacy Restrictions",
      "Set app download restrictions to require your approval",
      "Enable SafeSearch in Google and YouTube apps"
    ]
  },
  {
    icon: Wifi,
    title: "Home WiFi Safety",
    description: "Protect all devices connected to your home network",
    color: "green",
    steps: [
      "Change your router's default password to something strong",
      "Enable content filtering in your router settings if available",
      "Set up a guest network for visitors to keep your main network secure",
      "Consider family-friendly DNS services like CleanBrowsing or OpenDNS"
    ]
  },
  {
    icon: Monitor,
    title: "Social Media Settings",
    description: "Help your children use social media safely",
    color: "purple",
    steps: [
      "Set all accounts to private, not public",
      "Disable location sharing on all posts",
      "Turn off 'suggested friends' and 'people you may know' features",
      "Review friend lists regularly and remove unknown contacts"
    ]
  },
  {
    icon: Clock,
    title: "Screen Time Limits",
    description: "Balance technology use with healthy habits",
    color: "orange",
    steps: [
      "Set daily time limits for apps and games",
      "Schedule 'downtime' during homework and sleep hours",
      "Create phone-free zones like the dinner table and bedrooms",
      "Model healthy screen habits yourself"
    ]
  }
];

const conversationStarters = [
  {
    age: "Ages 5-8",
    topics: [
      "What games do you like to play on the tablet?",
      "Has anyone you don't know ever tried to talk to you online?",
      "What would you do if you saw something scary on the screen?",
      "Let's look at the apps on your tablet together."
    ]
  },
  {
    age: "Ages 9-12",
    topics: [
      "What apps are your friends using? Can you show me how they work?",
      "Have you ever felt uncomfortable about something online?",
      "Do you know what to do if a stranger tries to contact you?",
      "What information is okay to share online, and what should stay private?"
    ]
  },
  {
    age: "Ages 13-17",
    topics: [
      "What are your thoughts on how much time you spend on your phone?",
      "Have you or your friends experienced cyberbullying?",
      "What do you know about online privacy and your digital footprint?",
      "How do you decide who to trust online?"
    ]
  }
];

const warningSignsChild = [
  "Quickly switching screens or hiding devices when you approach",
  "Becoming withdrawn, anxious, or upset after being online",
  "Receiving gifts, money, or packages from unknown sources",
  "Using devices late at night or being secretive about online activities",
  "New contacts in their phone that they can't explain",
  "Sudden changes in behavior or mood after internet use",
  "Reluctance to discuss what they do online",
  "Using multiple accounts or fake names"
];

const familyAgreementItems = [
  "We will keep devices in common areas, not bedrooms",
  "We will ask permission before downloading new apps",
  "We will never share passwords, addresses, or school names online",
  "We will tell a parent if someone online makes us uncomfortable",
  "We will not meet anyone in person that we only know from online",
  "We will be kind to others online, just like in real life",
  "We agree on screen time limits and will respect them",
  "Parents will respect privacy while keeping everyone safe"
];

const elderlyConversationScripts = [
  {
    situation: "Starting the conversation",
    opening: "Mom/Dad, I've been reading about some scams targeting people and I want to make sure we're both protected. Can we talk about it?",
    tips: [
      "Choose a calm, private moment, not during a family gathering",
      "Frame it as 'us protecting each other' not 'me protecting you'",
      "Share a news story about scams to make it less personal"
    ]
  },
  {
    situation: "If they've already been scammed",
    opening: "I know this is hard to talk about. What happened wasn't your fault. These scammers are professionals who trick thousands of people. Let's focus on what we can do now.",
    tips: [
      "Never say 'I told you so' or express frustration",
      "Validate their feelings. They may feel ashamed or embarrassed",
      "Focus on solutions and prevention, not blame"
    ]
  },
  {
    situation: "If they're resistant to help",
    opening: "I understand you've been managing your own affairs for decades. I'm not trying to take control. I just want to be someone you can call before making big decisions.",
    tips: [
      "Acknowledge their independence and life experience",
      "Offer to be a 'second opinion' rather than a gatekeeper",
      "Share that even experts get fooled by modern scams"
    ]
  },
  {
    situation: "Setting up a safety system",
    opening: "What if we create a simple rule: before sending money to anyone new or clicking unfamiliar links, you call me first? I'll do the same with you.",
    tips: [
      "Make it reciprocal. You both check with each other",
      "Create a family code word only you both know",
      "Offer to help set up their phone's security settings together"
    ]
  }
];

export default function ParentGuide() {
  useSEO({
    title: "Parent Guide - Keep Your Children Safe Online | GetCyberRight",
    description: "Complete guide for parents on parental controls, warning signs, and family safety agreements. Protect your kids online.",
    keywords: "parental controls, child online safety, internet safety for kids, digital parenting guide, family safety agreement"
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white py-12 md:py-20 overflow-hidden">
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
              <Users className="h-4 w-4" />
              <span className="text-sm">Guide for Parents & Guardians</span>
            </motion.div>
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              Keeping Your Children Safe Online
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-indigo-100 leading-relaxed"
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              You don't need to be a technology expert to protect your family. This guide gives you practical tools, conversation starters, and warning signs to watch for.
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

      {/* Key Message Banner */}
      <section className="bg-yellow-50 dark:bg-yellow-900/20 py-6 border-b border-yellow-200 dark:border-yellow-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 text-center">
            <Heart className="h-5 w-5 text-yellow-600" />
            <p className="text-yellow-800 dark:text-yellow-200 font-medium">
              The goal is not to spy on your children, but to guide them toward safe online habits they'll carry for life.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section id="quick-actions" className="py-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="#parental-controls" className="flex flex-col items-center p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors text-center group">
                <Settings className="h-8 w-8 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-slate-900 dark:text-white text-sm">Setup Controls</span>
              </a>
              <a href="#conversation-starters" className="flex flex-col items-center p-4 rounded-xl bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors text-center group">
                <MessageCircle className="h-8 w-8 text-teal-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-slate-900 dark:text-white text-sm">Start Talking</span>
              </a>
              <a href="#videos" className="flex flex-col items-center p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors text-center group">
                <Eye className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-slate-900 dark:text-white text-sm">Watch Videos</span>
              </a>
              <Link to="/emergency-help" className="flex flex-col items-center p-4 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-center group">
                <AlertTriangle className="h-8 w-8 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-slate-900 dark:text-white text-sm">Get Help Now</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Parental Controls Section */}
      <section id="parental-controls" className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <Settings className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Setting Up Parental Controls
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Step-by-step guides to protect your children on their devices
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {parentalControlGuides.map((guide, index) => {
              const IconComponent = guide.icon;
              const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
                blue: { bg: "bg-blue-50 dark:bg-blue-900/20", icon: "text-blue-600", border: "border-blue-200 dark:border-blue-800" },
                green: { bg: "bg-green-50 dark:bg-green-900/20", icon: "text-green-600", border: "border-green-200 dark:border-green-800" },
                purple: { bg: "bg-purple-50 dark:bg-purple-900/20", icon: "text-purple-600", border: "border-purple-200 dark:border-purple-800" },
                orange: { bg: "bg-orange-50 dark:bg-orange-900/20", icon: "text-orange-600", border: "border-orange-200 dark:border-orange-800" }
              };
              const colors = colorClasses[guide.color];
              
              return (
                <motion.div key={index} variants={fadeInUp} transition={{ duration: 0.5 }}>
                  <Card className={`border-2 ${colors.border} h-full`}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.bg}`}>
                          <IconComponent className={`h-6 w-6 ${colors.icon}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{guide.title}</CardTitle>
                          <p className="text-sm text-slate-500">{guide.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {guide.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700 dark:text-slate-300">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Conversation Starters */}
      <section id="conversation-starters" className="py-16 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <MessageCircle className="h-10 w-10 text-teal-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              How to Talk to Your Children About Online Safety
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Age-appropriate conversation starters to open dialogue about internet safety
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {conversationStarters.map((ageGroup, index) => (
              <Card key={index} className="border-2">
                <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-t-lg">
                  <CardTitle className="text-center">{ageGroup.age}</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <ul className="space-y-3">
                    {ageGroup.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-start gap-2 text-sm">
                        <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 italic">"{topic}"</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-2xl mx-auto mt-8">
            <Card className="bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Heart className="h-6 w-6 text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-teal-800 dark:text-teal-200 mb-2">Tips for These Conversations</h4>
                    <ul className="text-sm text-teal-700 dark:text-teal-300 space-y-1">
                      <li>• Listen more than you lecture</li>
                      <li>• Stay calm, even if you hear something concerning</li>
                      <li>• Ask open-ended questions, not yes/no questions</li>
                      <li>• Make it a regular conversation, not a one-time talk</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                Warning Signs to Watch For
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                These behaviors may indicate your child is in an unsafe online situation
              </p>
            </div>

            <Card className="border-2 border-red-200 dark:border-red-800">
              <CardContent className="p-6">
                <ul className="space-y-4">
                  {warningSignsChild.map((sign, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{sign}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Bell className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">If You Notice These Signs</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Stay calm and approach with curiosity, not accusation. Create a safe space for your child to talk. 
                      If you suspect exploitation or grooming, contact local authorities or the CyberTipline (CyberTipline.org).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The Conversation Toolkit - Talking to Aging Parents */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <Heart className="h-10 w-10 text-amber-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Having "The Conversation" with Aging Parents
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Talking to elderly parents about scam vulnerability is uncomfortable but necessary. 
                These scripts help you approach the conversation with love and respect.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {elderlyConversationScripts.map((script, index) => (
                <Card key={index} className="border-2 border-amber-200 dark:border-amber-800 h-full">
                  <CardHeader className="bg-amber-100 dark:bg-amber-900/30">
                    <CardTitle className="text-lg text-amber-800 dark:text-amber-200">
                      {script.situation}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="mb-4">
                      <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">What to say:</p>
                      <p className="text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-800 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                        "{script.opening}"
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Tips:</p>
                      <ul className="space-y-2">
                        {script.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-2 text-sm">
                            <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-600 dark:text-slate-400">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8 bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Users className="h-8 w-8 text-amber-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                      Remember: This Is About Love, Not Control
                    </h4>
                    <p className="text-amber-700 dark:text-amber-300 text-sm">
                      Your parent has managed their own life for decades. The goal isn't to take over their 
                      independence. It's to be a trusted partner they can consult. Many scams succeed because 
                      victims are too embarrassed to ask for help. Make it easy and safe for them to call you 
                      before making decisions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
              Helpful videos for parents on keeping children safe online
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="overflow-hidden border-2">
              <div className="aspect-video bg-slate-100 dark:bg-slate-800">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/U5qIhx0Sk60"
                  title="Digital Parenting Tips"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">Digital Parenting Basics</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Essential tips for keeping your kids safe in the digital age</p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-2">
              <div className="aspect-video bg-slate-100 dark:bg-slate-800">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/aUy_rZGw8dU"
                  title="Talking to Kids About Online Safety"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">Having The Conversation</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">How to talk to your children about internet safety</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Family Safety Agreement */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <Shield className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Create a Family Safety Agreement
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                A simple agreement that everyone in the family can follow
              </p>
            </div>

            <Card className="border-2 border-indigo-200 dark:border-indigo-800">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="text-center">Our Family Internet Agreement</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  {familyAgreementItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-center text-sm text-slate-500 dark:text-slate-400 italic">
                    Print this agreement and have everyone in the family sign it. Review it together every few months.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Related Pages */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <Users className="h-12 w-12 mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              More Family Safety Resources
            </h2>
            <p className="text-indigo-100 text-lg mb-8">
              Age-specific guides for different family members
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/kids">
                <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                  <CardContent className="p-5 text-left">
                    <h4 className="font-semibold mb-1 flex items-center gap-2">
                      Youth Safety Guide <ArrowRight className="h-4 w-4" />
                    </h4>
                    <p className="text-indigo-100 text-sm">Safety tips written for children and teens</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/seniors">
                <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                  <CardContent className="p-5 text-left">
                    <h4 className="font-semibold mb-1 flex items-center gap-2">
                      Senior Safety Guide <ArrowRight className="h-4 w-4" />
                    </h4>
                    <p className="text-indigo-100 text-sm">Protecting seniors from scams and fraud</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Test Your Family's Cyber Safety Knowledge
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Take our quick assessment to see how prepared your family is
            </p>
            <Button asChild size="lg">
              <Link to="/cyber-hygiene" className="flex items-center gap-2">
                Take the Quiz <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            
            {/* Share Buttons */}
            <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Share with other parents</p>
              <div className="flex justify-center">
                <ShareButtons 
                  title="Parent Guide to Online Safety - GetCyberRight" 
                  description="Practical tools and conversation starters to protect your children online. Parental controls, warning signs, and more."
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
