import { useSEO } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ShareButtons } from "@/components/share-buttons";
import { 
  Shield, ArrowRight, Lock, Eye,
  TrendingUp, Lightbulb, HandHeart, Quote, AlertTriangle, ShieldCheck
} from "lucide-react";
import aboutBannerImage from "@assets/ChatGPT_Image_Jan_10,_2026,_01_32_47_AM_1768026812566.png";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const values = [
  {
    icon: Lock,
    title: "Your Safety Comes First",
    description: "Everything we create is meant to help you stay safe. Our resources are free because protection should be accessible to everyone."
  },
  {
    icon: Eye,
    title: "Easy to Understand",
    description: "We explain threats in plain language. If your grandmother can understand it, we've done our job."
  },
  {
    icon: HandHeart,
    title: "Built by the Community",
    description: "Our guides come from real questions asked by families, teachers, and community leaders like you."
  },
  {
    icon: Lightbulb,
    title: "Always Up to Date",
    description: "Scammers change their tricks every day. We update our content so you always know what to watch for."
  },
  {
    icon: ShieldCheck,
    title: "Your Data Stays Yours",
    description: "We never sell your personal information to third parties. Our resources are free because we believe every family deserves protection."
  }
];

export default function About() {
  useSEO({
    title: "About GetCyberRight - Our Mission",
    description: "GetCyberRight helps families stay safe online. Free resources for all ages, from kids to seniors, worldwide.",
    keywords: "about getcyberright, cybersecurity education, family online protection, free cybersecurity resources"
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative text-white py-20 overflow-hidden min-h-[500px]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-top bg-no-repeat"
          style={{ backgroundImage: `url(${aboutBannerImage})` }}
        />
        {/* Dark Overlay for Text Visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/75 to-slate-900/85" />
        <div className="relative container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6"
              variants={fadeInUp}
            >
              <Shield className="h-4 w-4" />
              <span className="text-sm">Our Mission</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              variants={fadeInUp}
            >
              Protecting Families{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-amber-400">
                Across Generations
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              GetCyberRight is a US-based family cyber safety service platform built from personal experience with cyber fraud. We provide resources to help every family stay safe online: from kids on social media to seniors targeted by scammers. Our mission is simple: make cyber safety accessible to everyone, everywhere.
            </motion.p>

            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              variants={fadeInUp}
            >
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50" data-testid="button-explore-resources">
                <Link to="/resources">
                  Explore Resources <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-green-500 text-white hover:bg-green-600" data-testid="button-check-safety">
                <Link to="/quick-assessment">
                  Check Your Safety
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why We Started - Founder's Story */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="text-center mb-12" variants={fadeInUp}>
              <Badge className="mb-4 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Why We Started</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                This Is Personal
              </h2>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20 rounded-2xl p-8 md:p-12 relative overflow-hidden"
              variants={fadeInUp}
            >
              <Quote className="absolute top-6 left-6 h-12 w-12 text-blue-200 dark:text-blue-800 opacity-50" />
              
              <div className="relative space-y-6 text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-prose mx-auto">
                <p>
                  <span className="font-semibold text-slate-900 dark:text-white">I started GetCyberRight because I watched my own family get hurt online, and I have growing children who are already immersed in this digital world.</span>
                </p>
                
                <p>
                  It started when someone I love dearly was scammed through mobile money. Not once, but three times. Each time, they kept it to themselves out of shame. By the time they finally told us, it was too late to recover anything.
                </p>
                
                <div className="flex items-start gap-4 bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border-l-4 border-red-500">
                  <AlertTriangle className="h-6 w-6 text-red-500 shrink-0 mt-1" />
                  <p className="text-base text-slate-600 dark:text-slate-400">
                    When someone you love gets scammed and you realize you could have helped them avoid it, something inside you changes.
                  </p>
                </div>

                <p>
                  At the same time, my own kids are growing up in a world where screens are everywhere. They're already on tablets, learning apps, and asking about social media. The question of what they might encounter online, and whether we're doing enough to prepare them, keeps me up at night.
                </p>

                <p>
                  The threats come from every direction. Other relatives have lost social media accounts to hackers. Years of memories and connections, gone in minutes. Aging parents get suspicious calls and texts constantly.
                </p>

                <p>
                  When I searched for resources that could help everyone in my family, from my own kids to aging parents to cousins overseas, I came up short. Cybersecurity sites were written for corporations, full of tech jargon nobody could understand, or didn't speak to the realities of everyday families using mobile money and navigating online threats on their phones.
                </p>

                <p className="font-semibold text-slate-900 dark:text-white">
                  That frustration became a mission. Together with my team, we built what we wished existed: a place where any family member, no matter their age, tech skills, or location, can learn to protect themselves in plain language.
                </p>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-base text-slate-600 dark:text-slate-400 italic">
                    Today, GetCyberRight serves families like mine across six continents. From grandparents targeted by phone scams to kids navigating their first devices. My hope is that no family has to learn these lessons the hard way.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">Our Values</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              What We Stand For
            </h2>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                className="flex gap-4 items-start"
                variants={fadeInUp}
                data-testid={`value-${index}`}
              >
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center shrink-0">
                  <value.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{value.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Logo Story Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="text-center mb-12" variants={fadeInUp}>
              <Badge className="mb-4 bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">Our Identity</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Why Our Logo Looks the Way It Does
              </h2>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-12 shadow-lg"
              variants={fadeInUp}
            >
              <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>
                  At GetCyberRight, we believe cybersecurity should feel clear, supportive, and practical. It should not feel scary or overwhelming. Our logo reflects how we want families to experience online safety: <span className="font-semibold text-teal-600 dark:text-teal-400">protected, informed, and confident</span>.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 my-8">
                  <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <Lock className="h-6 w-6 text-teal-500 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">The Padlock</h4>
                      <p className="text-sm">Familiar and friendly. It represents privacy and protection. We chose rounded edges because security should not feel cold or intimidating.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <Eye className="h-6 w-6 text-blue-500 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">The Smile</h4>
                      <p className="text-sm">Intentional reassurance. It sends a simple message: you are not doing this alone. Safety should feel human.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <Lightbulb className="h-6 w-6 text-amber-500 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">The Open Design</h4>
                      <p className="text-sm">The internet should not be closed off. It is a place for learning, creativity, and connection. We help families stay safe while allowing space to explore.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">The Colors</h4>
                      <p className="text-sm">Teal feels calm and steady. Warm yellow adds guidance and optimism. Together, they reflect balance, trust, and care.</p>
                    </div>
                  </div>
                </div>

                <p className="text-center text-lg font-medium text-slate-900 dark:text-white">
                  GetCyberRight exists to make cybersecurity feel human, manageable, and right for real families.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-2xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Protect Your Family?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Start with a quick safety check to see where you stand.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-green-500 text-white hover:bg-green-600">
                  <Link to="/quick-assessment">
                    Check Your Safety <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Link to="/">
                    Explore Resources
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div 
              className="mt-12 pt-8 border-t border-white/20"
              variants={fadeInUp}
            >
              <p className="text-sm text-blue-100 mb-3">Help us reach more families</p>
              <ShareButtons 
                title="About GetCyberRight - Our Mission to Protect Families" 
                description="Learn why we created GetCyberRight: a platform protecting children, youth, and seniors from online threats."
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
