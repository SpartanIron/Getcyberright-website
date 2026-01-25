import { useState, useEffect } from "react";
import { useSEO } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UnifiedSubscribe } from "@/components/unified-subscribe";
import { Link } from "wouter";
import { Shield, Users, Heart, AlertTriangle, Quote, Baby, UserCircle, Sparkles, Bell, Search, Key, TrendingUp, ArrowRight, Briefcase, GraduationCap, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroCarousel } from "@/components/hero-carousel";
import { DeziHero } from "@/components/dezi-hero";
import { BreachChecker } from "@/components/breach-checker";
import { ScamStatsCounter } from "@/components/scam-stats-counter";
import { WelcomeModal } from "@/components/welcome-modal";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";

const allTestimonials = [
  {
    quote: "My mom almost sent $5,000 to a 'grandchild' who was supposedly in jail. Thanks to what I learned here, I recognized it as a scam and stopped her in time.",
    name: "Sarah M.",
    role: "Protecting her parents",
    icon: Heart,
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600"
  },
  {
    quote: "The Scam Checker saved me. I got a text about a package delivery and was about to click. Checked it here first and found out it was a phishing link.",
    name: "Marcus T.",
    role: "First-time user",
    icon: Shield,
    iconBg: "bg-teal-100 dark:bg-teal-900/30",
    iconColor: "text-teal-600"
  },
  {
    quote: "Finally, safety advice I can actually understand! No confusing tech jargon. I set up parental controls on all my kids' devices in one afternoon.",
    name: "Jennifer L.",
    role: "Mom of 3",
    icon: Users,
    iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
    iconColor: "text-indigo-600"
  },
  {
    quote: "As a small business owner, I was targeted by invoice fraud. The email header analyzer helped me spot the fake before I wired $12,000 to criminals.",
    name: "David R.",
    role: "Small business owner",
    icon: Briefcase,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600"
  },
  {
    quote: "I teach a senior safety class and recommend this site to everyone. The guides are perfect for older adults who aren't tech-savvy.",
    name: "Patricia K.",
    role: "Community educator",
    icon: GraduationCap,
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600"
  },
  {
    quote: "Living abroad, I get targeted by local scams constantly. This tool helped me verify a suspicious QR code that turned out to be a phishing attempt.",
    name: "Michael W.",
    role: "Expat in Asia",
    icon: Globe,
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600"
  }
];

export default function Home() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 3) % allTestimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const currentTestimonials = [
    allTestimonials[testimonialIndex % allTestimonials.length],
    allTestimonials[(testimonialIndex + 1) % allTestimonials.length],
    allTestimonials[(testimonialIndex + 2) % allTestimonials.length]
  ];

  useSEO({
    title: "GetCyberRight - Free Scam Checker & Family Cyber Safety",
    description: "Check suspicious links, phone numbers, and messages instantly. Free cyber safety resources for every family, from kids on social media to seniors targeted by scammers.",
    keywords: "scam checker, is this a scam, cyber safety, family cybersecurity, online protection, phishing check, scam detector"
  });

  return (
    <div className="min-h-screen">
      <WelcomeModal />

      {/* Hero Carousel + Scam Checker */}
      <div id="scam-checker">
        <HeroCarousel />
        <DeziHero />
      </div>

      <div className="bg-slate-800 py-6">
        <div className="container mx-auto px-4">
          <ScamStatsCounter />
        </div>
      </div>

      <div id="breach-checker">
        <BreachChecker />
      </div>

      {/* Trust Bar */}
      <section className="py-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-xs md:text-sm text-slate-600 dark:text-slate-400">
            <Link to="/emergency-help" className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-medium hover:underline">
              <AlertTriangle className="h-4 w-4" />
              <span>Been scammed? Get help</span>
            </Link>
            <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">|</span>
            <span className="font-medium">Trusted sources:</span>
            <span>FBI IC3</span>
            <span>INTERPOL</span>
            <span>CISA</span>
            <span>FTC</span>
          </div>
        </div>
      </section>

      {/* Who We Help */}
      <section className="py-12 md:py-16 lg:py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 lg:px-8 xl:px-12">
          <motion.div 
            className="text-center mb-8 lg:mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Protecting Every Generation
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-3xl mx-auto">
              Safety resources tailored for your family, from young children to grandparents
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={scaleIn}>
              <Link to="/youth-safety">
                <Card className="h-full border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 transition-all cursor-pointer group desktop-card-interactive hover:shadow-lg">
                  <CardContent className="p-6 lg:p-8 text-center">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Baby className="h-8 w-8 lg:h-10 lg:w-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white mb-2">Youth Safety</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">
                      Protect kids from online predators, cyberbullying, and harmful content
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Link to="/parent-guide">
                <Card className="h-full border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 transition-all cursor-pointer group desktop-card-interactive hover:shadow-lg">
                  <CardContent className="p-6 lg:p-8 text-center">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Users className="h-8 w-8 lg:h-10 lg:w-10 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white mb-2">Parent Guide</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">
                      Practical tools and conversations to keep your whole family safe
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Link to="/senior-safety">
                <Card className="h-full border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 transition-all cursor-pointer group desktop-card-interactive hover:shadow-lg">
                  <CardContent className="p-6 lg:p-8 text-center">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <UserCircle className="h-8 w-8 lg:h-10 lg:w-10 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white mb-2">Senior Protection</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">
                      Defend against phone scams, romance fraud, and tech support schemes
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Free Tools Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-950/20 dark:to-blue-950/20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div 
            className="text-center mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Free Security Tools
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Protect yourself with our suite of free tools. No signup required.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={scaleIn}>
              <Link to="/scam-checker">
                <Card className="h-full border-2 border-teal-200 dark:border-teal-800 hover:border-teal-400 dark:hover:border-teal-600 transition-all cursor-pointer group hover:shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Shield className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <h3 className="font-bold text-sm mb-1">Scam Checker</h3>
                    <p className="text-xs text-muted-foreground">Check URLs, emails, phones</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Link to="/#breach-checker">
                <Card className="h-full border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group hover:shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-bold text-sm mb-1">Breach Checker</h3>
                    <p className="text-xs text-muted-foreground">Check email breaches</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Link to="/password-generator">
                <Card className="h-full border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all cursor-pointer group hover:shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Key className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-bold text-sm mb-1">Password Generator</h3>
                    <p className="text-xs text-muted-foreground">Create strong passwords</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Link to="/threat-trends">
                <Card className="h-full border-2 border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600 transition-all cursor-pointer group hover:shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="font-bold text-sm mb-1">Threat Trends</h3>
                    <p className="text-xs text-muted-foreground">Global scam statistics</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </motion.div>

          <div className="text-center">
            <Link to="/tools">
              <Button variant="outline" className="group">
                View All Tools
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16 lg:py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 lg:px-8 xl:px-12">
          <motion.div 
            className="text-center mb-8 lg:mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Families Trust GetCyberRight
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Our impact is measured by the stories you share with us</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {currentTestimonials.map((testimonial, index) => {
                const IconComponent = testimonial.icon;
                return (
                  <motion.div 
                    key={`${testimonialIndex}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full border border-slate-200 dark:border-slate-700 desktop-card-interactive hover:shadow-lg">
                      <CardContent className="p-6 lg:p-8">
                        <Quote className="h-8 w-8 lg:h-10 lg:w-10 text-teal-500 mb-4" />
                        <p className="text-slate-700 dark:text-slate-300 mb-4 lg:text-lg lg:leading-relaxed">
                          "{testimonial.quote}"
                        </p>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 lg:w-12 lg:h-12 ${testimonial.iconBg} rounded-full flex items-center justify-center`}>
                            <IconComponent className={`h-5 w-5 lg:h-6 lg:w-6 ${testimonial.iconColor}`} />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white lg:text-lg">{testimonial.name}</p>
                            <p className="text-sm text-slate-500">{testimonial.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {[0, 3].map((startIndex) => (
              <button
                key={startIndex}
                onClick={() => setTestimonialIndex(startIndex)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  testimonialIndex === startIndex 
                    ? 'bg-teal-500' 
                    : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                }`}
                aria-label={`Show testimonials ${startIndex + 1}-${startIndex + 3}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup - More Prominent */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-teal-600 to-cyan-600 dark:from-teal-800 dark:to-cyan-800 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
                <Bell className="h-5 w-5" />
                <span className="font-semibold">Free Weekly Alerts</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Stay One Step Ahead of Scammers
              </h2>
              <p className="text-teal-100 text-base md:text-lg">
                Join thousands of families who get our free weekly digest
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                <AlertTriangle className="h-5 w-5 text-yellow-300 flex-shrink-0" />
                <span className="text-sm">Latest scam warnings</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                <Shield className="h-5 w-5 text-green-300 flex-shrink-0" />
                <span className="text-sm">Protection tips</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                <Users className="h-5 w-5 text-blue-300 flex-shrink-0" />
                <span className="text-sm">Family-friendly content</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl">
              <UnifiedSubscribe />
            </div>

            <p className="text-center text-teal-100 text-xs mt-4">
              Unsubscribe anytime. No spam, ever.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Help Footer */}
      <section className="py-6 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 max-w-4xl mx-auto">
            <p className="text-slate-400 text-sm">Need help right now?</p>
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
              <Link to="/emergency-help" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Emergency Help
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
