import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign, 
  Users, 
  Globe,
  Shield,
  ChevronRight,
  Info,
  ExternalLink,
  BarChart3,
  Clock,
  Target
} from "lucide-react";

// Data from FTC Consumer Sentinel 2024 Data Book (March 2025), FBI IC3 2024 Report,
// and FTC Data Spotlights (August & December 2025)
const stats: {
  id: string;
  label: string;
  value: string;
  change: string;
  trending: "up" | "down" | "neutral";
  icon: typeof AlertTriangle;
  detail: string;
}[] = [
  {
    id: "reports",
    label: "Fraud Reports (2024)",
    value: "2.6M",
    change: "stable",
    trending: "neutral",
    icon: AlertTriangle,
    detail: "FTC Consumer Sentinel",
  },
  {
    id: "losses",
    label: "Total Money Lost",
    value: "$12.5B",
    change: "+25%",
    trending: "up",
    icon: DollarSign,
    detail: "FTC: Record high in 2024",
  },
  {
    id: "seniors",
    label: "Senior Losses (60+)",
    value: "$4.9B",
    change: "+43%",
    trending: "up",
    icon: Users,
    detail: "FBI IC3 2024 Report",
  },
  {
    id: "median",
    label: "Victims Losing Money",
    value: "38%",
    change: "+11pts",
    trending: "up",
    icon: Target,
    detail: "Up from 27% in 2023",
  },
];

// Data from FBI IC3 2024 Report and FTC Consumer Sentinel 2024
const topScamTypes = [
  { 
    name: "Investment Scams", 
    losses: "$6.57B", 
    percentage: 40, 
    change: "+33%",
    victims: "48,000+",
    description: "Cryptocurrency and fake investment schemes, including 'pig butchering' scams",
    targetAudience: "Adults 30-60",
    prevention: "Never invest based on unsolicited offers. Verify with SEC before investing."
  },
  { 
    name: "Business Email Compromise", 
    losses: "$2.77B", 
    percentage: 17, 
    change: "+10%",
    victims: "21,442",
    description: "Hacked or spoofed emails tricking businesses into wire transfers",
    targetAudience: "Business employees",
    prevention: "Always verify large payment requests via phone call to a known number."
  },
  { 
    name: "Tech Support Scams", 
    losses: "$1.46B", 
    percentage: 9, 
    change: "+18%",
    victims: "35,000+",
    description: "Fake computer virus alerts leading to remote access fraud",
    targetAudience: "Seniors 60+",
    prevention: "Tech companies never call you first. Hang up and call official support."
  },
  { 
    name: "Romance Scams", 
    losses: "$697M", 
    percentage: 4, 
    change: "-39%",
    victims: "58,000+",
    description: "Scammers create fake relationships to extract money over time",
    targetAudience: "Adults 40+, lonely individuals",
    prevention: "Never send money to someone you haven't met in person."
  },
  { 
    name: "Government Impersonation", 
    losses: "$789M", 
    percentage: 5, 
    change: "+28%",
    victims: "28,000+",
    description: "Fake IRS, Social Security, or Medicare agents demanding payment",
    targetAudience: "Seniors, immigrants",
    prevention: "Government never demands immediate payment via gift cards or wire."
  },
];

// Recent alerts based on FTC 2025 Data Spotlights and FBI IC3 warnings
const recentAlerts = [
  {
    id: "ai-voice",
    title: "AI Voice Cloning Scams",
    description: "Scammers use AI to clone family members' voices in fake emergency calls. They may say 'I've been arrested' or 'I'm in trouble.'",
    severity: "critical" as const,
    date: "Active Now",
    howToProtect: "Create a family safe word. Always hang up and call the person directly.",
  },
  {
    id: "rental-scams",
    title: "Rental Scams on Social Media",
    description: "FTC reports $65M lost to rental scams. 50% start on Facebook with fake listings demanding upfront payments.",
    severity: "high" as const,
    date: "Dec 2025",
    howToProtect: "Never pay before seeing a property in person. Verify ownership through public records.",
  },
  {
    id: "imposter-seniors",
    title: "Imposter Scams Targeting Seniors",
    description: "4x increase in seniors losing $10K+ to imposter scams. Losses over $100K jumped to $445M in 2024.",
    severity: "critical" as const,
    date: "Aug 2025",
    howToProtect: "Government and banks never call demanding immediate payment or gift cards.",
  },
  {
    id: "pig-butchering",
    title: "Investment 'Pig Butchering' Scams",
    description: "Romance-based crypto scams caused $5.8B in losses. Scammers build relationships before pushing fake investments.",
    severity: "medium" as const,
    date: "Emerging",
    howToProtect: "Verify investment opportunities through official company channels only.",
  },
  {
    id: "job-scam",
    title: "Remote Job Interview Scams",
    description: "Fake job offers that request personal info or 'equipment fees' before starting work.",
    severity: "medium" as const,
    date: "Trending",
    howToProtect: "Legitimate employers never ask for payment. Research companies before applying.",
  },
];

const vulnerableGroups = [
  { group: "Seniors (60+)", risk: "Very High", topThreats: ["Tech Support", "Romance", "Government Impersonation"], tips: "Slow down, verify with family before acting" },
  { group: "Young Adults (18-29)", risk: "High", topThreats: ["Employment", "Investment", "Shopping"], tips: "If it sounds too good to be true, it is" },
  { group: "Small Businesses", risk: "High", topThreats: ["BEC", "Invoice Fraud", "Phishing"], tips: "Verify all payment requests via phone" },
  { group: "New Tech Users", risk: "Medium", topThreats: ["Tech Support", "Phishing", "Account Compromise"], tips: "Ask trusted contacts before clicking links" },
];

export function ThreatTrends() {
  const [selectedScam, setSelectedScam] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-800";
      case "high": return "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 border-orange-200 dark:border-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-500";
      case "high": return "text-orange-500";
      case "medium": return "text-yellow-500";
      default: return "text-gray-500";
    }
  };

  return (
    <Card className="w-full" data-testid="card-threat-trends">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Threat Intelligence Dashboard</CardTitle>
            <p className="text-sm text-muted-foreground">
              Latest data from FTC Consumer Sentinel, FBI IC3, and 2025 FTC Data Spotlights
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="protect" className="gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Protection</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((stat) => (
                <div 
                  key={stat.id} 
                  className="p-4 bg-muted/50 rounded-lg hover-elevate cursor-default"
                  data-testid={`stat-${stat.id}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground truncate">{stat.label}</span>
                  </div>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</span>
                    {stat.trending === "up" && (
                      <span className="text-xs text-red-500 flex items-center mb-0.5">
                        <TrendingUp className="w-3 h-3 mr-0.5" />
                        {stat.change}
                      </span>
                    )}
                    {stat.trending === "down" && (
                      <span className="text-xs text-green-500 flex items-center mb-0.5">
                        <TrendingDown className="w-3 h-3 mr-0.5" />
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.detail}</p>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  Top Scam Types by Financial Loss
                </h4>
              </div>
              <div className="space-y-2">
                {topScamTypes.map((scam) => (
                  <div 
                    key={scam.name} 
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedScam === scam.name 
                        ? 'bg-primary/5 border-primary/30' 
                        : 'bg-muted/30 border-transparent hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedScam(selectedScam === scam.name ? null : scam.name)}
                    data-testid={`scam-type-${scam.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{scam.name}</span>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${selectedScam === scam.name ? 'rotate-90' : ''}`} />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold">{scam.losses}</span>
                        <span className={`text-xs ${scam.change.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>
                          {scam.change}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${scam.percentage}%` }}
                      />
                    </div>
                    
                    {selectedScam === scam.name && (
                      <div className="mt-3 pt-3 border-t space-y-2 text-sm">
                        <p className="text-muted-foreground">{scam.description}</p>
                        <div className="flex flex-wrap gap-4">
                          <div>
                            <span className="text-muted-foreground">Victims: </span>
                            <span className="font-medium">{scam.victims}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Target: </span>
                            <span className="font-medium">{scam.targetAudience}</span>
                          </div>
                        </div>
                        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded text-green-800 dark:text-green-200">
                          <strong>Protection:</strong> {scam.prevention}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h4 className="font-semibold">Active Threat Alerts</h4>
              <Badge variant="destructive" className="ml-auto">
                {recentAlerts.filter(a => a.severity === "critical").length} Critical
              </Badge>
            </div>
            
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
                  data-testid={`alert-${alert.id}`}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${getSeverityIcon(alert.severity)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold">{alert.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.date}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{alert.description}</p>
                      <div className="p-2 bg-white/50 dark:bg-black/20 rounded text-sm">
                        <strong className="text-green-700 dark:text-green-300">How to protect yourself:</strong>{" "}
                        {alert.howToProtect}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="protect" className="space-y-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <h4 className="font-semibold">Risk by Group</h4>
            </div>
            
            <div className="space-y-3">
              {vulnerableGroups.map((group, idx) => (
                <div 
                  key={idx}
                  className="p-4 bg-muted/50 rounded-lg"
                  data-testid={`group-${group.group.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{group.group}</span>
                    <Badge 
                      variant="secondary"
                      className={
                        group.risk === "Very High" ? "bg-red-100 text-red-700" :
                        group.risk === "High" ? "bg-orange-100 text-orange-700" :
                        "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {group.risk} Risk
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {group.topThreats.map((threat, tidx) => (
                      <Badge key={tidx} variant="outline" className="text-xs">
                        {threat}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Tip:</strong> {group.tips}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Universal Protection Tips</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Slow down because scammers create urgency to prevent clear thinking</li>
                  <li>• Verify independently by contacting organizations through official channels</li>
                  <li>• Never pay with gift cards, wire transfers, or cryptocurrency</li>
                  <li>• Trust your instincts because if something feels wrong, it probably is</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="w-3 h-3" />
            Data: FBI IC3, FTC Consumer Sentinel (2024)
          </div>
          <div className="flex gap-2">
            <a 
              href="https://www.ic3.gov/Home/AnnualReports" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary flex items-center gap-1 hover:underline"
            >
              FBI Report <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://www.ftc.gov/reports" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary flex items-center gap-1 hover:underline"
            >
              FTC Data <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
