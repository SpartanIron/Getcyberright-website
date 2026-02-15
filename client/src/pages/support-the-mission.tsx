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
  ArrowRight,
  Shirt,
  Coffee,
  Sticker,
  Sparkles,
  Mail
} from "lucide-react";
import { Link } from "wouter";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const merchItems = [
  { 
    icon: Shirt, 
    name: "Apparel", 
    description: "T-shirts, hoodies, and hats with clean, modern designs that start real conversations about staying safe online.",
  },
  { 
    icon: Sticker, 
    name: "Stickers & Decals", 
    description: "Laptop stickers, vinyl decals, and sticker packs. Subtle enough for the office, bold enough to stand out.",
  },
  { 
    icon: Coffee, 
    name: "Drinkware", 
    description: "Mugs and tumblers designed for people who take their security as seriously as their morning coffee.",
  },
];

export default function SupportTheMission() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Shop | GetCyberRight"
        description="GetCyberRight gear for people who take digital safety seriously. Apparel, stickers, and drinkware designed with purpose."
      />
      <Navigation />
      
      <main>
        <section className="relative py-16 sm:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.15),transparent_50%)]" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-4 bg-teal-500/20 text-teal-300 border-teal-500/50" data-testid="badge-shop">
              <ShoppingBag className="h-3 w-3 mr-1" />
              Shop
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" data-testid="heading-shop">
              Rep the Movement
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Gear for people who believe cybersecurity should protect everyone, not just corporations. 
              Every purchase helps us build more tools and reach more families.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4" data-testid="badge-coming-soon">
                <Sparkles className="h-3 w-3 mr-1" />
                Launching Soon
              </Badge>
              <h2 className="text-3xl font-bold mb-4" data-testid="heading-collection">The Collection</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Designed with intent. No generic clip art. No cheesy slogans. 
                Just well-made gear that represents what we stand for.
              </p>
            </div>

            <motion.div 
              className="grid sm:grid-cols-3 gap-6 mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {merchItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div key={index} variants={fadeInUp}>
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <div className="w-14 h-14 mb-5 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                          <Icon className="h-7 w-7 text-teal-600 dark:text-teal-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2" data-testid={`heading-merch-${index}`}>{item.name}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>

            <Card className="border-slate-200 dark:border-slate-700">
              <CardContent className="p-8 sm:p-10">
                <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3" data-testid="heading-notify">Get Early Access</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We're putting the finishing touches on the store. 
                      Drop your email and we'll let you know the moment it goes live. Early supporters get first pick.
                    </p>
                  </div>
                  <Link href="/contact">
                    <Button size="lg" data-testid="button-notify-me">
                      <Mail className="w-4 h-4 mr-2" />
                      Notify Me
                    </Button>
                  </Link>
                </div>
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
                Built for Families. Backed by You.
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">
                Every purchase goes directly toward building better tools and reaching more families with the education they need.
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
                    Our Mission
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
