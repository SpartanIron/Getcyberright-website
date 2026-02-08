import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Download, 
  Mail,
  Lock,
  Smartphone,
  Wifi,
  Database,
  Eye,
  Users,
  FileText,
  ArrowRight
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChecklistItem {
  id: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  weight: number;
  isChecked: boolean;
}

interface CyberHygieneResult {
  score: number;
  level: "critical" | "poor" | "fair" | "good" | "excellent";
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

const hygieneChecklist: ChecklistItem[] = [
  {
    id: "strong-passwords",
    category: "Authentication",
    icon: Lock,
    title: "Strong, unique passwords for all accounts",
    description: "Using complex passwords (12+ characters) with mix of letters, numbers, symbols",
    weight: 15,
    isChecked: false
  },
  {
    id: "password-manager",
    category: "Authentication", 
    icon: Database,
    title: "Password manager in use",
    description: "Using a reputable password manager to generate and store passwords",
    weight: 10,
    isChecked: false
  },
  {
    id: "two-factor-auth",
    category: "Authentication",
    icon: Smartphone,
    title: "Two-factor authentication enabled",
    description: "2FA/MFA enabled on email, banking, and social media accounts",
    weight: 15,
    isChecked: false
  },
  {
    id: "software-updates",
    category: "System Security",
    icon: Shield,
    title: "Automatic software updates enabled",
    description: "Operating system and software automatically update with security patches",
    weight: 12,
    isChecked: false
  },
  {
    id: "antivirus-active",
    category: "System Security",
    icon: Shield,
    title: "Antivirus software active and updated",
    description: "Real-time antivirus protection with current definitions",
    weight: 8,
    isChecked: false
  },
  {
    id: "firewall-enabled",
    category: "System Security",
    icon: Shield,
    title: "Firewall enabled and configured",
    description: "Network firewall active on all devices",
    weight: 7,
    isChecked: false
  },
  {
    id: "secure-wifi",
    category: "Network Security",
    icon: Wifi,
    title: "Secure Wi-Fi practices",
    description: "Using WPA3 encryption, avoiding public Wi-Fi for sensitive activities",
    weight: 8,
    isChecked: false
  },
  {
    id: "email-caution",
    category: "Email Security",
    icon: Mail,
    title: "Cautious with email attachments and links",
    description: "Verifying sender identity before clicking links or opening attachments",
    weight: 10,
    isChecked: false
  },
  {
    id: "privacy-settings",
    category: "Privacy",
    icon: Eye,
    title: "Social media privacy settings configured",
    description: "Limited personal information sharing on social platforms",
    weight: 5,
    isChecked: false
  },
  {
    id: "data-backups",
    category: "Data Protection",
    icon: Database,
    title: "Regular data backups",
    description: "Important files backed up regularly to secure location",
    weight: 10,
    isChecked: false
  }
];

export function CyberHygieneSelfCheck() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(hygieneChecklist);
  const [currentStep, setCurrentStep] = useState<"assessment" | "results" | "email">("assessment");
  const [result, setResult] = useState<CyberHygieneResult | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { toast } = useToast();

  const downloadGuideMutation = useMutation({
    mutationFn: async ({ email, name }: { email: string; name: string }) => {
      return apiRequest("/api/download-cyber-hygiene-guide", "POST", { 
        email, 
        name, 
        score: result?.score || 0, 
        level: result?.level || "fair" 
      });
    },
    onSuccess: () => {
      toast({
        title: "Guide sent successfully!",
        description: "Check your email for the Cyber Hygiene Self-Check Guide with your personalized improvement plan.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to send guide",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const handleItemCheck = (itemId: string, checked: boolean) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, isChecked: checked } : item
      )
    );
  };

  const calculateResults = (): CyberHygieneResult => {
    const totalWeight = checklist.reduce((sum, item) => sum + item.weight, 0);
    const checkedWeight = checklist
      .filter(item => item.isChecked)
      .reduce((sum, item) => sum + item.weight, 0);
    
    const score = Math.round((checkedWeight / totalWeight) * 100);
    
    let level: CyberHygieneResult["level"];
    if (score >= 90) level = "excellent";
    else if (score >= 75) level = "good";
    else if (score >= 60) level = "fair";
    else if (score >= 40) level = "poor";
    else level = "critical";

    const checkedItems = checklist.filter(item => item.isChecked);
    const uncheckedItems = checklist.filter(item => !item.isChecked);

    const strengths = checkedItems.map(item => item.title);
    const improvements = uncheckedItems.map(item => item.title);

    const recommendations = [
      ...(score < 60 ? ["Consider using a password manager to secure all your accounts"] : []),
      ...(score < 75 ? ["Enable two-factor authentication on all important accounts"] : []),
      ...(score < 90 ? ["Review and update your privacy settings on social media"] : []),
      "Regularly review and update your security practices",
      "Stay informed about current cybersecurity threats",
      "Consider cybersecurity training for yourself and your team"
    ];

    return { score, level, strengths, improvements, recommendations };
  };

  const handleGenerateResults = () => {
    const results = calculateResults();
    setResult(results);
    setCurrentStep("results");
  };

  const handleDownloadGuide = () => {
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email to receive the guide.",
        variant: "destructive",
      });
      return;
    }
    downloadGuideMutation.mutate({ email: email.trim(), name: name.trim() });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "excellent": return "text-green-600 dark:text-green-400";
      case "good": return "text-blue-600 dark:text-blue-400";
      case "fair": return "text-yellow-600 dark:text-yellow-400";
      case "poor": return "text-orange-600 dark:text-orange-400";
      case "critical": return "text-red-600 dark:text-red-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "excellent": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "good": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "fair": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "poor": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "critical": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (currentStep === "results" && result) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Shield className="h-6 w-6" />
            Your Cyber Hygiene Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className={`text-6xl font-bold ${getLevelColor(result.level)} mb-2`}>
              {result.score}%
            </div>
            <Badge className={getLevelBadge(result.level)}>
              {result.level.toUpperCase()} SECURITY LEVEL
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Strengths ({result.strengths.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.strengths.slice(0, 3).map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      {strength}
                    </li>
                  ))}
                  {result.strengths.length > 3 && (
                    <li className="text-sm text-muted-foreground">
                      +{result.strengths.length - 3} more strengths
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Improvements ({result.improvements.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.improvements.slice(0, 3).map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      {improvement}
                    </li>
                  ))}
                  {result.improvements.length > 3 && (
                    <li className="text-sm text-muted-foreground">
                      +{result.improvements.length - 3} more areas to improve
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Download className="h-4 w-4" />
            <AlertDescription>
              Get your personalized <strong>Cyber Hygiene Improvement Plan</strong> with detailed recommendations, 
              printable checklist, and action steps tailored to your results.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="name">Name (Optional)</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleDownloadGuide}
              disabled={downloadGuideMutation.isPending}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {downloadGuideMutation.isPending ? (
                "Sending..."
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Get My Improvement Guide
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep("assessment");
                setResult(null);
              }}
            >
              Retake Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const checkedCount = checklist.filter(item => item.isChecked).length;
  const progress = (checkedCount / checklist.length) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Cyber Hygiene Self-Check
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Assess your current security practices and get personalized recommendations
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Progress value={progress} className="flex-1" />
          <span className="text-sm font-medium">{checkedCount}/{checklist.length}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(
          checklist.reduce((acc, item) => {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push(item);
            return acc;
          }, {} as Record<string, ChecklistItem[]>)
        ).map(([category, items]) => (
          <div key={category} className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              {category}
            </h3>
            {items.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={item.id}
                  checked={item.isChecked}
                  onCheckedChange={(checked) => handleItemCheck(item.id, !!checked)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <item.icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <Label htmlFor={item.id} className="text-sm font-medium cursor-pointer">
                        {item.title}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="pt-4 border-t">
          <Button
            onClick={handleGenerateResults}
            disabled={checkedCount === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Generate My Cyber Hygiene Report
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          {checkedCount === 0 && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Check at least one item to generate your report
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}