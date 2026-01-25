import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSEO } from "@/hooks/use-seo";
import { motion } from "framer-motion";
import { AnimatedCyberBackground } from "@/components/animated-cyber-background";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { 
  Shield, TrendingUp, Globe, AlertTriangle, BarChart3, 
  PieChart, MapPin, Calendar, Activity, CheckCircle, 
  XCircle, HelpCircle, Link as LinkIcon, Phone, Mail,
  Image, MessageSquare, RefreshCw, ExternalLink, DollarSign,
  Users, Smartphone, Heart, Briefcase, ShoppingCart, Lock, Clock
} from "lucide-react";

const LAST_UPDATED = "January 2026";

interface ThreatStats {
  total: number;
  byType: Record<string, number>;
  byRisk: Record<string, number>;
  byRegion?: Record<string, number>;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

const industryStats = [
  {
    value: "$16.6B",
    label: "Lost to cybercrime in 2024",
    source: "FBI IC3 2024 Report (April 2025)",
    sourceUrl: "https://www.ic3.gov/AnnualReport/Reports/2024_IC3Report.pdf",
    icon: DollarSign,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/30"
  },
  {
    value: "1.8B",
    label: "Credentials stolen in 2025",
    source: "Europol IOCTA 2025 (June 2025)",
    sourceUrl: "https://www.europol.europa.eu/cms/sites/default/files/documents/Steal-deal-repeat-IOCTA_2025.pdf",
    icon: Lock,
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900/30"
  },
  {
    value: "+84%",
    label: "Phishing-delivered malware increase",
    source: "Europol IOCTA 2025 (June 2025)",
    sourceUrl: "https://www.europol.europa.eu/cms/sites/default/files/documents/Steal-deal-repeat-IOCTA_2025.pdf",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30"
  },
  {
    value: "3,000%",
    label: "Rise in scam reports in Africa",
    source: "INTERPOL Africa Report (May 2025)",
    sourceUrl: "https://www.interpol.int/content/download/23094/file/INTERPOL_Africa_Cyberthreat_Assessment_Report_2025.pdf",
    icon: Globe,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30"
  }
];

const topScamTypes = [
  { name: "Investment Fraud (Crypto)", losses: "$6.5B", percentage: 39, trend: "up", icon: Briefcase },
  { name: "Business Email Compromise", losses: "$2.77B", percentage: 17, trend: "up", icon: Mail },
  { name: "Elder Fraud (60+)", losses: "$4.9B", percentage: 29, trend: "up", icon: Users },
  { name: "Tech Support Scams", losses: "$1.46B", percentage: 9, trend: "up", icon: Smartphone },
  { name: "Romance Scams", losses: "$1.14B", percentage: 7, trend: "stable", icon: Heart }
];

const regionalThreatData = [
  { region: "North America", flag: "🇺🇸", topThreat: "Investment Fraud", lossesPerCapita: "$45.20", riskLevel: "high", source: "FBI IC3 2024" },
  { region: "Europe", flag: "🇪🇺", topThreat: "Phishing/BEC", lossesPerCapita: "$32.10", riskLevel: "high", source: "Europol 2025" },
  { region: "Africa", flag: "🌍", topThreat: "Mobile Money/Phishing", lossesPerCapita: "$3B+ total losses", riskLevel: "rising", source: "INTERPOL May 2025" },
  { region: "Asia Pacific", flag: "🌏", topThreat: "Romance Scams", lossesPerCapita: "$21.80", riskLevel: "high", source: "INTERPOL 2024" },
  { region: "Latin America", flag: "🌎", topThreat: "Banking Trojans", lossesPerCapita: "$18.40", riskLevel: "rising", source: "INTERPOL 2024" },
  { region: "Middle East", flag: "🇸🇦", topThreat: "Business Email Compromise", lossesPerCapita: "$26.50", riskLevel: "high", source: "INTERPOL 2024" }
];

const regionLabels: Record<string, { name: string; flag: string }> = {
  na: { name: "North America", flag: "🇺🇸" },
  eu: { name: "Europe", flag: "🇪🇺" },
  africa: { name: "Africa", flag: "🌍" },
  asia: { name: "Asia Pacific", flag: "🌏" },
  latam: { name: "Latin America", flag: "🌎" },
  me: { name: "Middle East", flag: "🇸🇦" },
  oceania: { name: "Oceania", flag: "🇦🇺" },
  unknown: { name: "Other", flag: "🌐" }
};

const typeLabels: Record<string, { name: string; icon: typeof Shield; color: string }> = {
  url: { name: "URL Analysis", icon: LinkIcon, color: "text-blue-500" },
  phone: { name: "Phone Number", icon: Phone, color: "text-green-500" },
  email: { name: "Email Header", icon: Mail, color: "text-purple-500" },
  image: { name: "Image/Screenshot", icon: Image, color: "text-amber-500" },
  situation: { name: "Situation Analysis", icon: MessageSquare, color: "text-teal-500" },
  qr: { name: "QR Code", icon: Activity, color: "text-pink-500" }
};

const riskLabels: Record<string, { name: string; icon: typeof Shield; color: string; bgColor: string }> = {
  safe: { name: "Safe", icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30" },
  suspicious: { name: "Suspicious", icon: HelpCircle, color: "text-amber-600", bgColor: "bg-amber-100 dark:bg-amber-900/30" },
  dangerous: { name: "Dangerous", icon: XCircle, color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
  unknown: { name: "Unknown", icon: HelpCircle, color: "text-slate-600", bgColor: "bg-slate-100 dark:bg-slate-900/30" }
};

export default function ThreatTrends() {
  useSEO({
    title: "Threat Trends Dashboard | GetCyberRight",
    description: "Real-time scam and threat detection trends backed by FBI, INTERPOL, and CISA data. See what types of scams are being detected globally.",
    keywords: "threat trends, scam statistics, cybersecurity data, fraud detection, global scam trends, FBI IC3, INTERPOL"
  });

  const { data: stats, isLoading, refetch } = useQuery<ThreatStats>({
    queryKey: ["/api/public/threat-trends"]
  });

  const totalChecks = stats?.total || 0;
  const byType = stats?.byType || {};
  const byRisk = stats?.byRisk || {};
  const byRegion = stats?.byRegion || {};

  const typeEntries = Object.entries(byType).sort((a, b) => b[1] - a[1]);
  const riskEntries = Object.entries(byRisk).sort((a, b) => b[1] - a[1]);
  const regionEntries = Object.entries(byRegion).sort((a, b) => b[1] - a[1]);

  const getPercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-16 overflow-hidden">
        <AnimatedCyberBackground />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/50">
                <Activity className="h-3 w-3 mr-1" />
                Industry Data + Live Insights
              </Badge>
              <Badge className="bg-white/10 text-slate-300 border-white/20">
                <Clock className="h-3 w-3 mr-1" />
                Updated {LAST_UPDATED}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Threat Trends Dashboard</h1>
            <p className="text-xl text-slate-300 mb-8">
              Authoritative cybercrime statistics from FBI IC3, Europol, and INTERPOL, combined with real-time insights from our Scam Checker.
            </p>
            {totalChecks > 0 && (
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Shield className="w-4 h-4 text-teal-400" />
                  <span className="text-white font-bold">{totalChecks.toLocaleString()}</span>
                  <span className="text-slate-300">checks on our platform</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Calendar className="w-4 h-4 text-green-400" />
                  <span className="text-white font-bold">{(stats?.thisMonth || 0).toLocaleString()}</span>
                  <span className="text-slate-300">this month</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Global Cybercrime at a Glance</h2>
            <p className="text-muted-foreground">Data from leading cybersecurity authorities worldwide</p>
          </div>
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {industryStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 mb-4 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground mb-3">{stat.label}</div>
                      <a 
                        href={stat.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 dark:text-teal-400"
                      >
                        {stat.source}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Top Scam Types by Financial Loss
                </CardTitle>
                <p className="text-sm text-muted-foreground">Source: FBI IC3 2024 Report (Released April 2025)</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topScamTypes.map((scam, index) => {
                    const Icon = scam.icon;
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                              <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{scam.name}</div>
                              <div className="text-xs text-muted-foreground">{scam.losses} in losses</div>
                            </div>
                          </div>
                          <Badge variant={scam.trend === "up" ? "destructive" : "secondary"} className="text-xs">
                            {scam.trend === "up" ? "↑ Rising" : "→ Stable"}
                          </Badge>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full transition-all duration-500"
                            style={{ width: `${scam.percentage * 2.5}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Regional Threat Landscape
                </CardTitle>
                <p className="text-sm text-muted-foreground">Source: INTERPOL Africa Cyberthreat Assessment 2025 + Regional Reports</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {regionalThreatData.map((region, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{region.flag}</span>
                        <div>
                          <div className="font-medium text-sm">{region.region}</div>
                          <div className="text-xs text-muted-foreground">Top: {region.topThreat}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">{region.lossesPerCapita}</div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            region.riskLevel === "high" ? "border-red-500 text-red-600" :
                            region.riskLevel === "rising" ? "border-amber-500 text-amber-600" :
                            "border-green-500 text-green-600"
                          }`}
                        >
                          {region.riskLevel}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {totalChecks > 0 && (
        <section className="py-12 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-950/20 dark:to-blue-950/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-teal-500/20 text-teal-600 border-teal-500/50">
                <Activity className="h-3 w-3 mr-1" />
                Live Platform Data
              </Badge>
              <h2 className="text-2xl font-bold mb-2">GetCyberRight Scam Checker Insights</h2>
              <p className="text-muted-foreground">Real-time data from our free scam detection tool</p>
            </div>

            <div className="flex justify-end mb-6">
              <button 
                onClick={() => refetch()}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Data
              </button>
            </div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="lg:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-teal-600" />
                      Analysis Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-3">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                        ))}
                      </div>
                    ) : typeEntries.length > 0 ? (
                      <div className="space-y-3">
                        {typeEntries.map(([type, count]) => {
                          const typeInfo = typeLabels[type] || { name: type, icon: Shield, color: "text-slate-500" };
                          const Icon = typeInfo.icon;
                          const percentage = getPercentage(count, totalChecks);
                          return (
                            <div key={type} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <Icon className={`w-4 h-4 ${typeInfo.color}`} />
                                  <span>{typeInfo.name}</span>
                                </div>
                                <span className="font-medium">{count.toLocaleString()}</span>
                              </div>
                              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-teal-500 rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">No data yet.</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp} className="lg:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-amber-600" />
                      Risk Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-3">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                        ))}
                      </div>
                    ) : riskEntries.length > 0 ? (
                      <div className="space-y-3">
                        {riskEntries.map(([risk, count]) => {
                          const riskInfo = riskLabels[risk] || riskLabels.unknown;
                          const Icon = riskInfo.icon;
                          const percentage = getPercentage(count, totalChecks);
                          return (
                            <div key={risk} className={`flex items-center justify-between p-3 rounded-lg ${riskInfo.bgColor}`}>
                              <div className="flex items-center gap-3">
                                <Icon className={`w-5 h-5 ${riskInfo.color}`} />
                                <div>
                                  <div className="font-medium">{riskInfo.name}</div>
                                  <div className="text-xs text-muted-foreground">{percentage}% of checks</div>
                                </div>
                              </div>
                              <span className={`text-lg font-bold ${riskInfo.color}`}>{count.toLocaleString()}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">No risk data available yet.</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp} className="lg:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      Platform Regional Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-3">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                        ))}
                      </div>
                    ) : regionEntries.length > 0 ? (
                      <div className="space-y-3">
                        {regionEntries.map(([region, count]) => {
                          const regionInfo = regionLabels[region] || { name: region, flag: "🌐" };
                          const percentage = getPercentage(count, totalChecks);
                          return (
                            <div key={region} className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                              <div className="flex items-center gap-3">
                                <span className="text-xl">{regionInfo.flag}</span>
                                <div>
                                  <div className="font-medium text-sm">{regionInfo.name}</div>
                                  <div className="text-xs text-muted-foreground">{percentage}% of checks</div>
                                </div>
                              </div>
                              <span className="font-bold">{count.toLocaleString()}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground text-sm">Regional data building</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="max-w-2xl mx-auto bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-950/30 dark:to-blue-950/30 border-teal-200 dark:border-teal-800">
              <CardContent className="p-8">
                <Shield className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Check if Something is a Scam</h3>
                <p className="text-muted-foreground mb-6">
                  Use our free Scam Checker to analyze suspicious URLs, phone numbers, emails, and more. 
                  Every check helps us understand global threat patterns and protect more families.
                </p>
                <a 
                  href="/scam-checker"
                  className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Try the Scam Checker
                </a>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">About This Data</h2>
            <p className="text-muted-foreground mb-6">
              Industry statistics are sourced from official reports by the FBI Internet Crime Complaint Center (IC3), 
              Europol European Cybercrime Centre (EC3), and INTERPOL. Platform data represents 
              aggregated, anonymized statistics from our Scam Checker tool. We do not store personal information 
              or the content being analyzed. Last updated: {LAST_UPDATED}.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm mb-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Authoritative sources cited</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No personal data stored</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Updated {LAST_UPDATED}</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
              <a href="https://www.ic3.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 flex items-center gap-1">
                FBI IC3 <ExternalLink className="w-3 h-3" />
              </a>
              <a href="https://www.europol.europa.eu/publications-events/main-reports/iocta-report" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 flex items-center gap-1">
                Europol EC3 <ExternalLink className="w-3 h-3" />
              </a>
              <a href="https://www.interpol.int/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 flex items-center gap-1">
                INTERPOL <ExternalLink className="w-3 h-3" />
              </a>
              <a href="https://www.cisa.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 flex items-center gap-1">
                CISA <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
