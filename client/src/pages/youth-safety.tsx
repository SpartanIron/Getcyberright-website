import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSEO } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ShareButtons } from "@/components/share-buttons";
import { 
  Shield, Smartphone, MessageCircle, Users, Eye, Lock, 
  AlertTriangle, Heart, GamepadIcon, Camera, ThumbsUp, 
  ArrowRight, ArrowLeft, CheckCircle, XCircle, Lightbulb
} from "lucide-react";
import youthHeroImage from "@assets/stock_images/teenager_youth_smart_139c44f9.jpg";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const safetyTopics = [
  {
    icon: MessageCircle,
    title: "Social Media & WhatsApp Safety",
    description: "What to share, what to keep private, and how to spot fake accounts",
    color: "blue",
    tips: [
      "Never share your location, school, or home address on WhatsApp status or social media",
      "Think before you post. Would you show this to your parents?",
      "Report and block anyone who makes you uncomfortable",
      "Not everyone online is who they say they are, even if they have a nice profile photo"
    ]
  },
  {
    icon: Users,
    title: "Online Strangers & Fake Friends",
    description: "How to recognize and avoid dangerous online contacts",
    color: "red",
    tips: [
      "Never meet up with someone you only know from WhatsApp or social media",
      "If an adult asks you to keep a secret, tell a trusted adult immediately",
      "Real friends don't ask for your passwords or mobile money PIN",
      "It's okay to block or ignore anyone who makes you uncomfortable"
    ]
  },
  {
    icon: GamepadIcon,
    title: "Gaming & App Safety",
    description: "Stay safe while playing games and using apps on your phone",
    color: "purple",
    tips: [
      "Use a nickname, not your real name in games and apps",
      "Don't share personal information through game chats or forums",
      "Be careful with 'free' offers because they often lead to scams or malware",
      "Only download apps from official stores like Play Store"
    ]
  },
  {
    icon: Camera,
    title: "Sharing Photos & Videos",
    description: "What you should know before sharing images online",
    color: "orange",
    tips: [
      "Once shared on WhatsApp or social media, images can spread forever",
      "Never send photos you wouldn't want everyone to see",
      "Be careful of people asking for photos, especially adults",
      "Ask permission before sharing photos of friends or family"
    ]
  },
  {
    icon: Heart,
    title: "Cyberbullying & Online Harassment",
    description: "What to do if you or someone you know is being bullied online",
    color: "pink",
    tips: [
      "Don't respond to bullies because that's what they want",
      "Save evidence (screenshots) of bullying",
      "Block the bully and report to the platform",
      "Tell a trusted adult. You don't have to handle this alone"
    ]
  },
  {
    icon: Lock,
    title: "Passwords, PINs & Data Safety",
    description: "Protecting your accounts and airtime from hackers",
    color: "green",
    tips: [
      "Use different passwords for different accounts",
      "Never share passwords or PINs, even with close friends",
      "Be careful on public WiFi. Don't access banking apps or enter passwords",
      "Log out of accounts on shared phones or cyber cafes"
    ]
  }
];

const dosAndDonts = {
  dos: [
    "Tell a parent or trusted adult if something online makes you scared or uncomfortable",
    "Use privacy settings to control who can see your posts and WhatsApp status",
    "Think before you click on links sent via SMS or WhatsApp",
    "Be kind to others online. Real people have real feelings",
    "Use mobile data instead of public WiFi for important things"
  ],
  donts: [
    "Share personal information like your full name, school, or home area",
    "Meet someone in person that you only know from WhatsApp or social media",
    "Respond to mean messages or engage with cyberbullies",
    "Click on links promising free airtime, data bundles, or prizes",
    "Download apps from unknown sources. Use official app stores only"
  ]
};

export default function YouthSafety() {
  useSEO({
    title: "Youth Safety - Online Protection for Kids & Teens | GetCyberRight",
    description: "Keep children and teens safe online. Social media safety, cyberbullying prevention, and protection from online threats.",
    keywords: "youth online safety, teen internet safety, child protection online, social media safety, cyberbullying prevention, parental controls"
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section with Image */}
      <section className="bg-gradient-to-br from-teal-600 via-cyan-600 to-teal-700 text-white py-12 md:py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div 
              className="text-center lg:text-left"
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
                <span className="text-sm">Digital Safety for Young People</span>
              </motion.div>
              <motion.h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
              >
                Stay Safe Online
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-teal-100 leading-relaxed"
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
              >
                The internet is amazing for learning, connecting, and having fun. But it's important to know how to protect yourself. Here's everything you need to know to stay safe.
              </motion.p>
            </motion.div>
            
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={youthHeroImage} 
                  alt="Young person using smartphone safely" 
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/40 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Back Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-3">
          <Link to="/educate" className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Educate
          </Link>
        </div>
      </div>

      {/* Quick Tips Banner */}
      <section className="bg-yellow-50 dark:bg-yellow-900/20 py-6 border-b border-yellow-200 dark:border-yellow-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 text-center">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <p className="text-yellow-800 dark:text-yellow-200 font-medium">
              Remember: If something online makes you feel scared, confused, or uncomfortable, talk to a trusted adult!
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section id="quick-actions" className="py-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="#topics" className="flex flex-col items-center p-4 rounded-xl bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors text-center group">
                <Shield className="h-8 w-8 text-teal-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-slate-900 dark:text-white text-sm">Safety Topics</span>
              </a>
              <a href="#dos-donts" className="flex flex-col items-center p-4 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors text-center group">
                <CheckCircle className="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-slate-900 dark:text-white text-sm">Do's & Don'ts</span>
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

      {/* Safety Topics Grid */}
      <section id="topics" className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Online Safety Topics
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Click on any topic to learn more about staying safe
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {safetyTopics.map((topic, index) => {
              const IconComponent = topic.icon;
              const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
                blue: { bg: "bg-blue-50 dark:bg-blue-900/20", icon: "text-blue-600", border: "border-blue-200 dark:border-blue-800" },
                red: { bg: "bg-red-50 dark:bg-red-900/20", icon: "text-red-600", border: "border-red-200 dark:border-red-800" },
                purple: { bg: "bg-purple-50 dark:bg-purple-900/20", icon: "text-purple-600", border: "border-purple-200 dark:border-purple-800" },
                orange: { bg: "bg-orange-50 dark:bg-orange-900/20", icon: "text-orange-600", border: "border-orange-200 dark:border-orange-800" },
                pink: { bg: "bg-pink-50 dark:bg-pink-900/20", icon: "text-pink-600", border: "border-pink-200 dark:border-pink-800" },
                green: { bg: "bg-green-50 dark:bg-green-900/20", icon: "text-green-600", border: "border-green-200 dark:border-green-800" }
              };
              const colors = colorClasses[topic.color];
              
              return (
                <motion.div key={index} variants={fadeInUp} transition={{ duration: 0.5 }}>
                  <Card className={`border-2 ${colors.border} ${colors.bg} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full`} data-testid={`topic-${index}`}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.bg}`}>
                          <IconComponent className={`h-6 w-6 ${colors.icon}`} />
                        </div>
                        <CardTitle className="text-lg">{topic.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">{topic.description}</p>
                      <ul className="space-y-2">
                        {topic.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700 dark:text-slate-300">{tip}</span>
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

      {/* Do's and Don'ts */}
      <section id="dos-donts" className="py-16 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Online Safety Do's and Don'ts
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Do's */}
            <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <ThumbsUp className="h-5 w-5" />
                  Do's
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {dosAndDonts.dos.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Don'ts */}
            <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <AlertTriangle className="h-5 w-5" />
                  Don'ts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {dosAndDonts.donts.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
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
              Short videos to help you stay safe online
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="overflow-hidden border-2">
              <div className="aspect-video bg-slate-100 dark:bg-slate-800">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/yrln8nyVBLU"
                  title="Online Safety for Kids"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">Be Internet Awesome</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Learn the basics of staying safe online</p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-2">
              <div className="aspect-video bg-slate-100 dark:bg-slate-800">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/yiKeLOKc1tw"
                  title="Cyberbullying Prevention"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">Stop Cyberbullying</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">What to do if you or someone you know is being bullied online</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Need Help Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <Heart className="h-12 w-12 mx-auto mb-6 text-pink-300" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Need Help? Talk to Someone
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              If something online made you scared or uncomfortable, please talk to a parent, teacher, or trusted adult. You are not in trouble. Adults want to help you stay safe.
            </p>
            <div className="bg-white/10 border border-white/20 rounded-lg p-6 text-left">
              <h4 className="font-semibold mb-3 text-center">Who Can You Talk To?</h4>
              <ul className="space-y-2 text-blue-100">
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 flex-shrink-0" />
                  A parent, grandparent, or older sibling
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 flex-shrink-0" />
                  A teacher or school counselor
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 flex-shrink-0" />
                  A religious leader or community elder
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 flex-shrink-0" />
                  Any adult you trust
                </li>
              </ul>
              <p className="text-center mt-4 text-sm text-blue-200">
                Remember: It's never your fault if an adult behaves badly towards you online.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Test Your Knowledge
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Take our quick quiz to see how much you know about staying safe online
            </p>
            <Button asChild size="lg" data-testid="button-take-quiz">
              <Link to="/quick-assessment" className="flex items-center gap-2">
                Take the Safety Quiz <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            
            {/* Share Buttons */}
            <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Share this guide with friends</p>
              <div className="flex justify-center">
                <ShareButtons 
                  title="Youth Safety Guide - GetCyberRight" 
                  description="Essential online safety tips for children and teens. Learn to stay safe on social media, games, and apps."
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
