import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, CheckCircle2, XCircle, Eye, Copy, Check, ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSEO } from "@/hooks/use-seo";

function getRiskIcon(risk: string) {
  switch (risk) {
    case "safe": return <CheckCircle2 className="w-10 h-10 text-green-500" />;
    case "low": return <Shield className="w-10 h-10 text-blue-500" />;
    case "medium": return <Eye className="w-10 h-10 text-yellow-500" />;
    case "high": return <AlertTriangle className="w-10 h-10 text-orange-500" />;
    case "critical": return <XCircle className="w-10 h-10 text-red-500" />;
    default: return <Shield className="w-10 h-10 text-muted-foreground" />;
  }
}

function getRiskColor(risk: string) {
  switch (risk) {
    case "safe": return "text-green-600 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800";
    case "low": return "text-blue-600 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800";
    case "medium": return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800";
    case "high": return "text-orange-600 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800";
    case "critical": return "text-red-600 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
    default: return "";
  }
}

export default function ScanReportPage() {
  const params = useParams<{ shareId: string }>();
  const [copied, setCopied] = useState(false);

  useSEO({
    title: "Scam Scan Report | GetCyberRight",
    description: "View the results of a scam analysis scan shared by a GetCyberRight user.",
  });

  const { data: report, isLoading, error } = useQuery({
    queryKey: ["/api/scan-reports", params.shareId],
    queryFn: () => fetch(`/api/scan-reports/${params.shareId}`).then(r => {
      if (!r.ok) throw new Error("Report not found");
      return r.json();
    }),
    enabled: !!params.shareId,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold">Report Not Found</h2>
            <p className="text-muted-foreground">This scan report may have expired or the link may be incorrect.</p>
            <Button asChild>
              <a href="/scam-checker">Run Your Own Scan</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  let flags: string[] = [];
  let ai: any = null;
  try { if (report.flagDetails) flags = JSON.parse(report.flagDetails); } catch {}
  try { if (report.aiAnalysis) ai = JSON.parse(report.aiAnalysis); } catch {}

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto py-12 px-4 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold" data-testid="text-report-title">Scam Scan Report</h1>
          <p className="text-sm text-muted-foreground">
            Scanned on {new Date(report.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className={`p-6 rounded-xl border-2 ${getRiskColor(report.riskLevel)}`} data-testid="section-risk-summary">
              <div className="flex items-center gap-4">
                {getRiskIcon(report.riskLevel)}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold capitalize">{report.riskLevel} Risk</h2>
                    <Badge variant="secondary" className="font-mono">{report.riskScore}% confidence</Badge>
                  </div>
                  <p className="text-sm opacity-90">{report.resultSummary}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Analyzed Content</p>
              <p className="text-sm" data-testid="text-content-snippet">{report.contentSnippet}</p>
            </div>

            {report.flagsFound > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  {report.flagsFound} Flag(s) Detected
                </h3>
                {flags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {flags.map((f: string, i: number) => (
                      <Badge key={i} variant="outline">{f}</Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {ai && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <h3 className="font-semibold flex items-center gap-2 text-sm">
                  AI Analysis Summary
                </h3>
                <Badge className={
                  ai.riskLevel === "critical" || ai.riskLevel === "high" ? "bg-red-500 text-white" :
                  ai.riskLevel === "medium" ? "bg-yellow-500 text-black" :
                  "bg-green-500 text-white"
                }>
                  {ai.riskLevel} risk
                </Badge>
                {ai.keyFindings?.length > 0 && (
                  <ul className="space-y-1">
                    {ai.keyFindings.map((f: string, i: number) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="mt-1">&bull;</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" className="gap-2" onClick={handleCopy} data-testid="button-copy-report-link">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Link Copied!" : "Copy Report Link"}
          </Button>
          <Button asChild className="gap-2">
            <a href="/scam-checker">
              <Shield className="w-4 h-4" />
              Run Your Own Scan
            </a>
          </Button>
        </div>

        <div className="text-center">
          <a href="/" className="text-sm text-primary hover:underline flex items-center justify-center gap-1">
            Powered by GetCyberRight <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
