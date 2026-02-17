import { Card, CardContent } from "@/components/ui/card";
import { useSEO } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { AnimatedCyberBackground } from "@/components/animated-cyber-background";
import { ShareButtons } from "@/components/share-buttons";
import { 
  Shield, Heart, Users, Globe, Award, TrendingUp,
  Quote, CheckCircle, Building2, GraduationCap, 
  Handshake, Star, MessageSquare, MapPin, Mail
} from "lucide-react";
import impactBannerImage from "@assets/ChatGPT_Image_Jan_10,_2026,_01_51_52_AM_1768027941982.png";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";

const colorClasses = {
  green: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-600 dark:text-green-400"
  },
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-600 dark:text-blue-400"
  },
  teal: {
    bg: "bg-teal-100 dark:bg-teal-900/30",
    text: "text-teal-600 dark:text-teal-400"
  },
  purple: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-600 dark:text-purple-400"
  },
  red: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-600 dark:text-red-400"
  },
  amber: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-600 dark:text-amber-400"
  }
};

export default function Impact() {
  const { t } = useTranslation();

  useSEO({
    title: t("impact.seo.title"),
    description: t("impact.seo.description"),
    keywords: t("impact.seo.keywords")
  });

  const impactStats = [
    { value: "1,000+", labelKey: "impact.stats.familiesReached", icon: Users },
    { value: "25+", labelKey: "impact.stats.countriesWithContacts", icon: Globe },
    { value: "500+", labelKey: "impact.stats.tipsDelivered", icon: Shield },
    { value: "5", labelKey: "impact.stats.regionsGlobal", icon: MapPin },
    { value: "100%", labelKey: "impact.stats.freeResources", icon: Heart },
    { value: "24/7", labelKey: "impact.stats.updatedIntel", icon: TrendingUp }
  ];

  const successStories = [
    {
      quoteKey: "impact.stories.grace.quote",
      name: "Grace M.",
      roleKey: "impact.stories.grace.role",
      location: "Kenya",
      categoryKey: "impact.stories.grace.category",
      color: "green" as const
    },
    {
      quoteKey: "impact.stories.david.quote",
      name: "David K.",
      roleKey: "impact.stories.david.role",
      location: "United States",
      categoryKey: "impact.stories.david.category",
      color: "blue" as const
    },
    {
      quoteKey: "impact.stories.margaret.quote",
      name: "Margaret O.",
      roleKey: "impact.stories.margaret.role",
      location: "United Kingdom",
      categoryKey: "impact.stories.margaret.category",
      color: "teal" as const
    },
    {
      quoteKey: "impact.stories.samuel.quote",
      name: "Samuel T.",
      roleKey: "impact.stories.samuel.role",
      location: "India",
      categoryKey: "impact.stories.samuel.category",
      color: "purple" as const
    },
    {
      quoteKey: "impact.stories.faith.quote",
      name: "Faith N.",
      roleKey: "impact.stories.faith.role",
      location: "Nigeria",
      categoryKey: "impact.stories.faith.category",
      color: "red" as const
    },
    {
      quoteKey: "impact.stories.james.quote",
      name: "James A.",
      roleKey: "impact.stories.james.role",
      location: "Canada",
      categoryKey: "impact.stories.james.category",
      color: "amber" as const
    }
  ];

  const partners = [
    {
      nameKey: "impact.partners.schools.name",
      descriptionKey: "impact.partners.schools.description",
      icon: GraduationCap,
      partnerType: "schools"
    },
    {
      nameKey: "impact.partners.community.name",
      descriptionKey: "impact.partners.community.description",
      icon: Users,
      partnerType: "community"
    },
    {
      nameKey: "impact.partners.business.name",
      descriptionKey: "impact.partners.business.description",
      icon: Building2,
      partnerType: "business"
    },
    {
      nameKey: "impact.partners.government.name",
      descriptionKey: "impact.partners.government.description",
      icon: Shield,
      partnerType: "government"
    }
  ];

  const partnerBenefitKeys = [
    "impact.benefits.brandedMaterials",
    "impact.benefits.recognition",
    "impact.benefits.workshops",
    "impact.benefits.priorityAccess",
    "impact.benefits.quarterlyReports",
    "impact.benefits.directSupport"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <AnimatedCyberBackground />
      
      {/* Hero Section with Banner Image */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${impactBannerImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/75 to-slate-900/85" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-0 px-4 py-1.5 text-sm">
                {t("impact.hero.badge")}
              </Badge>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-lg"
            >
              {t("impact.hero.title")}
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto drop-shadow-md"
            >
              {t("impact.hero.description")}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex justify-center">
              <ShareButtons 
                title={t("impact.hero.shareTitle")}
                description={t("impact.hero.shareDescription")}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-cyan-600 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              {t("impact.stats.title")}
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-teal-100 text-lg max-w-2xl mx-auto"
            >
              {t("impact.stats.description")}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="text-center"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-colors">
                  <stat.icon className="w-8 h-8 text-white mx-auto mb-3" />
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-teal-100 text-sm">
                    {t(stat.labelKey)}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-4 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0">
                {t("impact.stories.badge")}
              </Badge>
            </motion.div>
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              {t("impact.stories.title")}
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              {t("impact.stories.description")}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {successStories.map((story, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-shadow border-0 bg-white dark:bg-slate-800/50 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`p-2 rounded-full ${colorClasses[story.color].bg}`}>
                        <Quote className={`w-5 h-5 ${colorClasses[story.color].text}`} />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {t(story.categoryKey)}
                      </Badge>
                    </div>
                    
                    <blockquote className="text-muted-foreground mb-6 italic leading-relaxed">
                      "{t(story.quoteKey)}"
                    </blockquote>
                    
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-semibold">
                        {story.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{story.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {t(story.roleKey)} • {story.location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Share Your Story CTA */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mt-12 text-center"
          >
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-teal-200 dark:border-teal-800">
              <CardContent className="p-8">
                <MessageSquare className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{t("impact.stories.shareCta.title")}</h3>
                <p className="text-muted-foreground mb-6">
                  {t("impact.stories.shareCta.description")}
                </p>
                <Button asChild className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600">
                  <Link to="/contact">
                    <Mail className="w-4 h-4 mr-2" />
                    {t("impact.stories.shareCta.button")}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Partner Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-0">
                {t("impact.partners.badge")}
              </Badge>
            </motion.div>
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              {t("impact.partners.title")}
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              {t("impact.partners.description")}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {partners.map((partner, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Link to={`/contact?partnerType=${partner.partnerType}`}>
                  <Card className="h-full text-center hover:shadow-lg transition-all border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/30 hover:border-purple-400 dark:hover:border-purple-500 cursor-pointer group">
                    <CardContent className="p-6 flex flex-col items-center h-full">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center mx-auto mb-4 flex-shrink-0 group-hover:scale-110 transition-transform">
                        <partner.icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="font-bold mb-2 text-base leading-tight">{t(partner.nameKey)}</h3>
                      <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">
                        {t(partner.descriptionKey)}
                      </p>
                      <Badge className="text-xs flex-shrink-0 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        Request Info
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Become a Partner CTA */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="max-w-4xl mx-auto overflow-hidden">
              <div className="grid md:grid-cols-2">
                <CardContent className="p-8 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                  <Handshake className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-4">{t("impact.partners.cta.title")}</h3>
                  <p className="text-purple-100 mb-6">
                    {t("impact.partners.cta.description")}
                  </p>
                  <Button asChild variant="secondary" className="bg-white text-purple-600 hover:bg-purple-50">
                    <Link to="/contact">
                      {t("impact.partners.cta.button")}
                    </Link>
                  </Button>
                </CardContent>
                <CardContent className="p-8 bg-white dark:bg-slate-800">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" />
                    {t("impact.partners.benefits.title")}
                  </h4>
                  <ul className="space-y-3">
                    {partnerBenefitKeys.map((benefitKey, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{t(benefitKey)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto"
          >
            <Award className="w-16 h-16 text-teal-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("impact.cta.title")}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t("impact.cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600">
                <Link to="/resources">
                  <Shield className="w-5 h-5 mr-2" />
                  {t("impact.cta.primaryButton")}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/about">
                  {t("impact.cta.secondaryButton")}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
