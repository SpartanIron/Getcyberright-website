import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  ShoppingBag, 
  Users, 
  Globe, 
  ArrowRight,
  ExternalLink,
  Shirt,
  Coffee,
  Sticker,
  GraduationCap,
  Shield,
  Megaphone
} from "lucide-react";
import { Link } from "wouter";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const howItHelps = [
  { 
    icon: GraduationCap, 
    title: "Fund Educational Programs", 
    description: "Every purchase helps us create courses, guides, and resources that teach families to stay safe online." 
  },
  { 
    icon: Globe, 
    title: "Expand Our Reach", 
    description: "Your support helps us translate content, reach underserved communities, and serve families across more countries." 
  },
  { 
    icon: Megaphone, 
    title: "Spread Awareness", 
    description: "Wearing GetCyberRight gear starts conversations about cybersecurity in your community, workplace, and school." 
  },
  { 
    icon: Shield, 
    title: "Keep Tools Running", 
    description: "Our scam checker, threat intelligence, and safety tools cost money to operate. Your support keeps them available for everyone." 
  },
];

const comingSoonItems = [
  { icon: Shirt, name: "T-Shirts & Hoodies", description: "Clean, mission-driven designs you'll actually want to wear" },
  { icon: Sticker, name: "Sticker Packs", description: "Laptop stickers, bumper stickers, and decals for the whole family" },
  { icon: Coffee, name: "Mugs & Drinkware", description: "Start your morning with a reminder to stay cyber safe" },
];

export default function SupportTheMission() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Support the Mission | GetCyberRight"
        description="Support GetCyberRight's mission to protect families from online threats. Browse our merch store and help fund cybersecurity education for everyone."
      />
      <Navigation />
      
      <main>
        <section className="relative py-16 sm:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.15),transparent_50%)]" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-4 bg-amber-500/20 text-amber-300 border-amber-500/50" data-testid="badge-support">
              <Heart className="h-3 w-3 mr-1" />
              Support the Mission
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" data-testid="heading-support">
              Wear the Mission. Fund the Mission.
            </h1>
            <p className="text-xl text-slate-300 mb-4 max-w-2xl mx-auto">
              GetCyberRight is built on the belief that every family deserves protection 
              from online threats. Your support helps us keep it that way.
            </p>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              100% of merch proceeds go directly toward educational programs, 
              tool development, and reaching more families worldwide.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4" data-testid="heading-how-it-helps">How Your Support Helps</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                When you buy GetCyberRight merch, you're directly funding the tools and education that protect families.
              </p>
            </div>

            <motion.div 
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {howItHelps.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div key={index} variants={fadeInUp}>
                    <Card className="h-full text-center">
                      <CardContent className="p-6">
                        <div className="w-12 h-12 mx-auto mb-4 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
                          <Icon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                        </div>
                        <h3 className="font-semibold mb-2" data-testid={`heading-help-${index}`}>{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4" data-testid="badge-coming-soon">
                <ShoppingBag className="h-3 w-3 mr-1" />
                Coming Soon
              </Badge>
              <h2 className="text-3xl font-bold mb-4" data-testid="heading-merch">GetCyberRight Merch</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Clean, well-designed gear that lets you represent the mission. Our store is launching soon.
              </p>
            </div>

            <motion.div 
              className="grid sm:grid-cols-3 gap-6 mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {comingSoonItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div key={index} variants={fadeInUp}>
                    <Card className="h-full">
                      <CardContent className="p-6 text-center">
                        <div className="w-14 h-14 mx-auto mb-4 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                          <Icon className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="font-semibold mb-2" data-testid={`heading-merch-${index}`}>{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>

            <Card className="border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/20">
              <CardContent className="p-8 text-center">
                <Users className="w-10 h-10 text-teal-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3" data-testid="heading-notify">Be the First to Know</h3>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                  Sign up for our newsletter and we'll let you know as soon as the store launches. 
                  Early supporters may get exclusive items.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/contact">
                    <Button size="lg" data-testid="button-notify-me">
                      Get Notified
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2" data-testid="heading-other-ways">Other Ways to Support</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Not ready for merch? There are other meaningful ways to help:
                    </p>
                  </div>
                </div>
                <ul className="space-y-3 ml-14">
                  <li className="flex items-start gap-2">
                    <Megaphone className="w-4 h-4 text-teal-500 mt-1 flex-shrink-0" />
                    <span className="text-sm"><strong>Share our tools</strong> with friends, family, and your community</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-teal-500 mt-1 flex-shrink-0" />
                    <span className="text-sm"><strong>Follow us</strong> on social media and help spread the word</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Globe className="w-4 h-4 text-teal-500 mt-1 flex-shrink-0" />
                    <span className="text-sm"><strong>Suggest a partnership</strong> if your company or organization shares our mission</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Every Action Makes a Difference
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">
                Whether you wear the gear, share the tools, or tell a friend, you're helping protect families who need it most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tools">
                  <Button size="lg" variant="secondary" data-testid="button-explore-tools">
                    Explore Our Tools
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/our-mission">
                  <Button size="lg" variant="outline" className="border-white/30 text-white bg-transparent" data-testid="button-our-mission">
                    Read Our Mission
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
