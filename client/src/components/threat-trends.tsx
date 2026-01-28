import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Users, Globe } from "lucide-react";

const stats = [
  {
    label: "Total Scam Reports (2024)",
    value: "2.9M",
    change: "+12%",
    trending: "up",
    icon: AlertTriangle,
  },
  {
    label: "Money Lost to Scams",
    value: "$10.3B",
    change: "+14%",
    trending: "up",
    icon: DollarSign,
  },
  {
    label: "Victims Aged 60+",
    value: "101K",
    change: "+25%",
    trending: "up",
    icon: Users,
  },
  {
    label: "Countries Affected",
    value: "150+",
    change: "Global",
    trending: "neutral",
    icon: Globe,
  },
];

const topScamTypes = [
  { name: "Investment Scams", losses: "$4.57B", percentage: 44, change: "+21%" },
  { name: "Romance Scams", losses: "$1.14B", percentage: 11, change: "+8%" },
  { name: "Tech Support Scams", losses: "$924M", percentage: 9, change: "+15%" },
  { name: "Government Impersonation", losses: "$789M", percentage: 8, change: "+32%" },
  { name: "Business Email Compromise", losses: "$675M", percentage: 7, change: "-3%" },
];

const recentAlerts = [
  {
    title: "AI Voice Cloning Scams",
    description: "Scammers use AI to clone family members' voices in emergency calls",
    severity: "high",
  },
  {
    title: "Fake Package Delivery Texts",
    description: "Phishing texts claiming failed delivery, asking for 'redelivery fee'",
    severity: "medium",
  },
  {
    title: "Crypto Recovery Scams",
    description: "Fake services claiming to recover lost cryptocurrency",
    severity: "high",
  },
];

export function ThreatTrends() {
  return (
    <Card className="w-full" data-testid="card-threat-trends">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Threat Trends</CardTitle>
            <p className="text-sm text-muted-foreground">Current scam statistics and alerts</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                {stat.trending === "up" && (
                  <span className="text-xs text-red-500 flex items-center mb-1">
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                    {stat.change}
                  </span>
                )}
                {stat.trending === "down" && (
                  <span className="text-xs text-green-500 flex items-center mb-1">
                    <TrendingDown className="w-3 h-3 mr-0.5" />
                    {stat.change}
                  </span>
                )}
                {stat.trending === "neutral" && (
                  <span className="text-xs text-muted-foreground mb-1">{stat.change}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h4 className="font-semibold mb-3">Top Scam Types by Financial Loss</h4>
          <div className="space-y-3">
            {topScamTypes.map((scam) => (
              <div key={scam.name} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{scam.name}</span>
                  <span className="text-muted-foreground">{scam.losses}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${scam.percentage}%` }}
                    />
                  </div>
                  <span className={`text-xs ${scam.change.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>
                    {scam.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Current Alerts</h4>
          <div className="space-y-3">
            {recentAlerts.map((alert, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  alert.severity === "high" ? "text-red-500" : "text-yellow-500"
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-sm">{alert.title}</span>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        alert.severity === "high" 
                          ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" 
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                      }`}
                    >
                      {alert.severity === "high" ? "High Risk" : "Medium Risk"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Data sources: FBI IC3 Annual Report, FTC Consumer Sentinel Network
        </div>
      </CardContent>
    </Card>
  );
}
