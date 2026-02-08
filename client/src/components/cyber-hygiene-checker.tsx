import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2,
  Lock,
  Mail,
  Globe,
  Server,
  Eye
} from "lucide-react";

interface CyberHygieneResult {
  domain: string;
  overallScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  basicChecks: {
    ssl: boolean;
    dnssec: boolean;
    spfRecord: boolean;
    dmarcRecord: boolean;
    securityHeaders: boolean;
  };
  vulnerabilityScore?: number;
  certificateGrade?: string;
  subdomainSecurity?: boolean;
  contentSecurityPolicy?: boolean;
  httpSecurityHeaders?: {
    'Strict-Transport-Security': boolean;
    'X-Frame-Options': boolean;
    'X-Content-Type-Options': boolean;
    'Referrer-Policy': boolean;
  };
  recommendations: string[];
  scanDate: string;
  includeAdvanced: boolean;
}

export function CyberHygieneChecker() {
  const [domain, setDomain] = useState("");
  const [includeAdvanced, setIncludeAdvanced] = useState(false);
  const [result, setResult] = useState<CyberHygieneResult | null>(null);

  const checkMutation = useMutation({
    mutationFn: async (data: { domain: string; includeAdvanced: boolean }) => {
      const response = await fetch("/api/cyber-hygiene-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to perform cyber hygiene check");
      }
      
      return response.json();
    },
    onSuccess: (data: CyberHygieneResult) => {
      setResult(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim()) {
      checkMutation.mutate({ domain: domain.trim(), includeAdvanced });
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low": return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "medium": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "high": return "text-orange-600 bg-orange-100 dark:bg-orange-900/20";
      case "critical": return "text-red-600 bg-red-100 dark:bg-red-900/20";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  if (result) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Security Assessment Results</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setResult(null)}
          >
            New Scan
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {result.domain}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(result.overallScore)}`}>
                  {result.overallScore}/100
                </div>
                <div className="text-sm text-gray-500 mb-2">Overall Score</div>
                <Badge className={getRiskColor(result.riskLevel)}>
                  {result.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>
              
              {result.certificateGrade && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {result.certificateGrade}
                  </div>
                  <div className="text-sm text-gray-500">SSL Rating</div>
                </div>
              )}
              
              {result.vulnerabilityScore !== undefined && (
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(100 - result.vulnerabilityScore)}`}>
                    {100 - result.vulnerabilityScore}/100
                  </div>
                  <div className="text-sm text-gray-500">Security Score</div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Basic Security Checks
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    {result.basicChecks.ssl ? 
                      <CheckCircle className="h-4 w-4 text-green-500" /> : 
                      <XCircle className="h-4 w-4 text-red-500" />
                    }
                    <span className="text-sm">SSL/TLS Encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.basicChecks.dnssec ? 
                      <CheckCircle className="h-4 w-4 text-green-500" /> : 
                      <XCircle className="h-4 w-4 text-red-500" />
                    }
                    <span className="text-sm">DNSSEC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.basicChecks.spfRecord ? 
                      <CheckCircle className="h-4 w-4 text-green-500" /> : 
                      <XCircle className="h-4 w-4 text-red-500" />
                    }
                    <span className="text-sm">SPF Record</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.basicChecks.dmarcRecord ? 
                      <CheckCircle className="h-4 w-4 text-green-500" /> : 
                      <XCircle className="h-4 w-4 text-red-500" />
                    }
                    <span className="text-sm">DMARC Record</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.basicChecks.securityHeaders ? 
                      <CheckCircle className="h-4 w-4 text-green-500" /> : 
                      <XCircle className="h-4 w-4 text-red-500" />
                    }
                    <span className="text-sm">Security Headers</span>
                  </div>
                </div>
              </div>

              {result.includeAdvanced && result.httpSecurityHeaders && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    Advanced Security Headers
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {Object.entries(result.httpSecurityHeaders).map(([header, present]) => (
                      <div key={header} className="flex items-center gap-2">
                        {present ? 
                          <CheckCircle className="h-4 w-4 text-green-500" /> : 
                          <XCircle className="h-4 w-4 text-red-500" />
                        }
                        <span className="text-sm">{header}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Recommendations
                  </h4>
                  <div className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <Alert key={index}>
                        <AlertDescription className="text-sm">
                          • {rec}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Scan completed on {new Date(result.scanDate).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="text"
            placeholder="Enter domain (e.g., example.com)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="flex-1 bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500 h-12 text-base"
            disabled={checkMutation.isPending}
          />
          <Button 
            type="submit" 
            disabled={!domain.trim() || checkMutation.isPending}
            className="bg-orange-600 hover:bg-orange-700 text-white h-12 px-6 whitespace-nowrap touch-target"
          >
            {checkMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Scanning...</span>
                <span className="sm:hidden">Scan</span>
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Check Security</span>
                <span className="sm:hidden">Check</span>
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="advanced"
            checked={includeAdvanced}
            onCheckedChange={(checked) => setIncludeAdvanced(checked as boolean)}
            disabled={checkMutation.isPending}
            className="border-white/40 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          />
          <label htmlFor="advanced" className="text-sm text-white font-medium">
            Include advanced security analysis
          </label>
        </div>
      </form>

      {checkMutation.isError && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to perform security check. Please try again.
          </AlertDescription>
        </Alert>
      )}

      <div className="text-xs text-gray-500">
        This tool performs real-time security assessments including SSL configuration, 
        DNS security, email authentication, and security headers analysis.
      </div>
    </div>
  );
}