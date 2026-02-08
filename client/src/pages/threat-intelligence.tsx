import { useSEO } from "@/hooks/use-seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  Globe, 
  Shield, 
  AlertTriangle, 
  Users,
  ArrowRight,
  ArrowLeft,
  Activity,
  TrendingUp,
  MapPin,
  Info,
  Calendar,
  Loader2
} from "lucide-react";
import type { ThreatStat, AgeGroupStat, RegionalAttackType } from "@shared/schema";
import { AnimatedThreatMap } from "@/components/animated-threat-map";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface ThreatData {
  stats: ThreatStat[];
  ageGroups: AgeGroupStat[];
  regions: RegionalAttackType[];
}

const colorThemeMap: Record<string, { bg: string; border: string; text: string }> = {
  teal: { bg: "from-teal-500/20 to-teal-600/10", border: "border-teal-500/30", text: "text-teal-400" },
  amber: { bg: "from-amber-500/20 to-amber-600/10", border: "border-amber-500/30", text: "text-amber-400" },
  cyan: { bg: "from-cyan-500/20 to-cyan-600/10", border: "border-cyan-500/30", text: "text-cyan-400" },
  red: { bg: "from-red-500/20 to-red-600/10", border: "border-red-500/30", text: "text-red-400" },
};

export default function ThreatIntelligence() {
  useSEO({
    title: "Live Threat Intelligence | GetCyberRight",
    description: "Real-time global cyber attack statistics and threat intelligence. Track cybercrime trends and regional attack patterns.",
    keywords: "cyber attack map, threat intelligence, live attacks, cybersecurity monitoring, global threats, cybercrime statistics"
  });

  const { data: threatData, isLoading } = useQuery<ThreatData>({
    queryKey: ["/api/threat-stats"],
    staleTime: 1000 * 60 * 60,
  });

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Recently updated";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="bg-slate-900 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6"
              variants={fadeInUp}
            >
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-400">Live Threat Intelligence</span>
            </motion.div>

            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
              variants={fadeInUp}
            >
              Global Cyber Attack Map
            </motion.h1>

            <motion.p 
              className="text-lg text-slate-400 mb-6"
              variants={fadeInUp}
            >
              Watch cyber attacks happening around the world in real-time. This visualization shows live threat data from global monitoring networks, helping you understand the scale and nature of cyber threats.
            </motion.p>

            <motion.div 
              className="flex flex-wrap justify-center gap-4 text-sm text-slate-400"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-400" />
                Live Data
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-400" />
                Global Coverage
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-teal-400" />
                24/7 Monitoring
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Back Navigation */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4 py-3">
          <Link to="/protect" className="inline-flex items-center text-sm text-slate-400 hover:text-teal-400 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Protect
          </Link>
        </div>
      </div>

      {/* Full-Width Kaspersky Cyber Attack Map */}
      <section className="bg-slate-900 pb-8">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <AnimatedThreatMap />
          </motion.div>

        </div>
      </section>

      {/* How to Read This Map */}
      <section className="py-12 bg-slate-800">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Info className="h-5 w-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Understanding the Map</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-slate-700/50 border-slate-600">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-white mb-2">Attack Lines</h3>
                  <p className="text-sm text-slate-400">
                    Lines show cyber attacks traveling from source to target. Brighter lines indicate more active attack routes.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-700/50 border-slate-600">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-white mb-2">Attack Types</h3>
                  <p className="text-sm text-slate-400">
                    Different colors represent attack types: malware, exploits, spam, botnets, and network intrusions.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-700/50 border-slate-600">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-white mb-2">Statistics Panel</h3>
                  <p className="text-sm text-slate-400">
                    Click countries on the map to see detailed attack statistics and rankings by threat type.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Global Cybercrime Statistics */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Global Cybercrime Statistics
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Understanding who is most at risk helps us protect our communities. Data sourced from FBI IC3, INTERPOL, and global cybersecurity reports.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 items-stretch">
            {isLoading ? (
              <div className="col-span-full flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
              </div>
            ) : threatData?.stats?.map((stat, index) => {
              const theme = colorThemeMap[stat.colorTheme || "teal"];
              const CardWrapper = stat.sourceUrl ? 'a' : 'div';
              const wrapperProps = stat.sourceUrl ? {
                href: stat.sourceUrl,
                target: "_blank",
                rel: "noopener noreferrer"
              } : {};
              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * (index + 1) }}
                >
                  <CardWrapper {...wrapperProps} className={stat.sourceUrl ? "block cursor-pointer h-full" : "h-full"}>
                    <Card className={`bg-gradient-to-br ${theme.bg} ${theme.border} text-center transition-all duration-200 h-full flex flex-col overflow-hidden ${stat.sourceUrl ? "hover:scale-[1.02] hover:shadow-lg hover:border-opacity-70" : ""}`}>
                      <CardContent className="p-4 flex flex-col flex-1">
                        <div className={`text-2xl md:text-3xl font-bold ${theme.text} mb-2`}>{stat.value}</div>
                        <div className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3 leading-snug">{stat.label}</div>
                        <div className="mt-auto pt-2 border-t border-slate-600/30">
                          <div className="text-[10px] md:text-xs text-slate-700 dark:text-slate-300 mb-1">{stat.source}</div>
                          <div className="flex items-center justify-center gap-1 text-[10px] md:text-xs text-slate-600 dark:text-slate-400">
                            <Calendar className="h-2.5 w-2.5 md:h-3 md:w-3 flex-shrink-0" />
                            <span>{formatDate(stat.lastUpdated)}</span>
                          </div>
                          {stat.sourceUrl && (
                            <div className="mt-1.5 text-[10px] md:text-xs text-teal-600 dark:text-teal-400 flex items-center justify-center gap-1 font-medium">
                              <span>View Report</span>
                              <ArrowRight className="h-2.5 w-2.5 md:h-3 md:w-3" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </CardWrapper>
                </motion.div>
              );
            })}
          </div>

          {/* Detailed Charts */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <Users className="h-5 w-5 text-amber-400" />
                    Victims by Age Group
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Who gets targeted most? Here's the breakdown of cybercrime victims by age.
                  </p>
                  <div className="space-y-3">
                    {threatData?.ageGroups?.map((group) => (
                      <div key={group.id} className="flex items-center justify-between">
                        <span className="text-slate-300 text-sm">{group.ageGroup}</span>
                        <div className="flex-1 mx-4 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${group.colorClass} rounded-full`} 
                            style={{ width: `${group.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-slate-400 text-sm">{group.percentage}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-xs text-amber-300">
                      <strong>Key insight:</strong> While people aged 30-49 are targeted most often, seniors (60+) lose the most money per incident.
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Source: {threatData?.ageGroups?.[0]?.source || "Global Cybercrime Reports 2024"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-teal-400" />
                    Top Attack Types by Region
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Cyber threats vary by location. Here's what to watch out for in your region.
                  </p>
                  <div className="space-y-4">
                    {threatData?.regions?.map((region) => (
                      <div key={region.id} className="flex items-start gap-3">
                        <div className={`w-3 h-3 rounded-full ${region.colorClass} mt-1`}></div>
                        <div>
                          <div className="text-slate-200 font-medium text-sm">{region.region}</div>
                          <div className="text-slate-400 text-xs">{region.attackTypes}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-teal-500/10 border border-teal-500/20 rounded-lg">
                    <p className="text-xs text-teal-300">
                      <strong>Why this matters:</strong> Africa experiences the highest attack volume globally. Never share M-Pesa PINs or respond to "win" messages on WhatsApp.
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Sources: INTERPOL, FBI, Europol, IBM X-Force 2024-2025
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Mission Callout */}
          <motion.div 
            className="max-w-3xl mx-auto mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="p-5 bg-gradient-to-r from-teal-500/10 to-amber-500/10 border border-teal-500/20 rounded-xl text-center">
              <p className="text-slate-300 text-sm">
                <strong className="text-white">This is why we focus on protecting both youth AND seniors.</strong> No age group is safe from cyber threats, and the impact affects families everywhere.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full mb-6">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Why This Matters</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Knowledge is Your First Line of Defense
            </h2>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Understanding the scale and nature of cyber threats helps you make smarter decisions about protecting yourself and your family. Cybercriminals don't discriminate by age or location. Everyone is a potential target.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <Card className="border-2 hover:border-teal-500/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Stay Informed</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Real-time threat data helps you understand current attack trends
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-amber-500/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Recognize Threats</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Learn which types of attacks target people like you
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-blue-500/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Regional Awareness</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Different regions face different types of cyber threats
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-teal-500 hover:bg-teal-600">
                <Link to="/youth-safety" className="flex items-center gap-2">
                  Youth Safety Guide <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/senior-safety" className="flex items-center gap-2">
                  Senior Safety Guide <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
