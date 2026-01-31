import { useState } from "react";
import { trackToolUsage } from "@/lib/analytics";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { PageBanner } from "@/components/page-banner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX,
  Lock, 
  Unlock,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Clock,
  Calendar,
  Building2,
  Globe,
  Key,
  FileCheck,
  Loader2,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import bannerImage from "@/assets/banners/security-banner.png";

type SSLResult = {
  success: boolean;
  url: string;
  checked: boolean;
  valid: boolean;
  isExpired: boolean;
  isEV: boolean;
  isSelfSigned: boolean;
  riskLevel: "low" | "medium" | "high" | "critical";
  issuer?: string;
  subject?: string;
  validFrom?: string;
  validTo?: string;
  daysUntilExpiry?: number;
  protocol?: string;
  cipher?: string;
  keyExchange?: string;
  serialNumber?: string;
  fingerprint?: string;
  error?: string;
};

function getRiskColor(risk: string) {
  switch (risk) {
    case "low": return "text-green-600 dark:text-green-400";
    case "medium": return "text-yellow-600 dark:text-yellow-400";
    case "high": return "text-orange-600 dark:text-orange-400";
    case "critical": return "text-red-600 dark:text-red-400";
    default: return "text-muted-foreground";
  }
}

function getRiskBadge(risk: string) {
  switch (risk) {
    case "low": return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Low Risk</Badge>;
    case "medium": return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Medium Risk</Badge>;
    case "high": return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">High Risk</Badge>;
    case "critical": return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Critical Risk</Badge>;
    default: return <Badge variant="secondary">Unknown</Badge>;
  }
}

function getGradeFromRisk(risk: string, valid: boolean, isExpired: boolean) {
  if (isExpired) return { grade: "F", color: "text-red-600" };
  if (!valid) return { grade: "F", color: "text-red-600" };
  switch (risk) {
    case "low": return { grade: "A", color: "text-green-600" };
    case "medium": return { grade: "B", color: "text-yellow-600" };
    case "high": return { grade: "C", color: "text-orange-600" };
    case "critical": return { grade: "F", color: "text-red-600" };
    default: return { grade: "?", color: "text-muted-foreground" };
  }
}

export default function SSLChecker() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SSLResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkSSL = async () => {
    if (!url.trim()) {
      setError("Please enter a URL or domain to check");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      trackToolUsage("ssl_checker", false);
      
      const response = await fetch("/api/security/check-ssl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data);
        trackToolUsage("ssl_checker", true);
      } else {
        setError(data.error || "Failed to check SSL certificate");
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkSSL();
    }
  };

  const grade = result ? getGradeFromRisk(result.riskLevel, result.valid, result.isExpired) : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead 
        title="SSL Certificate Checker" 
        description="Check any website's SSL/TLS certificate security. Verify certificate validity, expiration, issuer, and encryption strength for free." 
      />
      <Navigation />
      
      <PageBanner
        title="SSL Certificate Checker"
        subtitle="Verify the security and validity of any website's SSL/TLS certificate"
        imageSrc={bannerImage}
        imageAlt="SSL security monitoring"
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Check SSL Certificate
                </CardTitle>
                <CardDescription>
                  Enter a website URL or domain name to analyze its SSL/TLS certificate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="example.com or https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                    data-testid="input-ssl-url"
                  />
                  <Button 
                    onClick={checkSSL} 
                    disabled={loading}
                    data-testid="button-check-ssl"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Check
                      </>
                    )}
                  </Button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {result && (
              <Card data-testid="card-ssl-result">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {result.valid && !result.isExpired ? (
                        <ShieldCheck className="w-6 h-6 text-green-600" />
                      ) : result.isExpired ? (
                        <ShieldX className="w-6 h-6 text-red-600" />
                      ) : (
                        <ShieldAlert className="w-6 h-6 text-orange-600" />
                      )}
                      Certificate Analysis
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      {getRiskBadge(result.riskLevel)}
                      {grade && (
                        <div className={`text-4xl font-bold ${grade.color}`} data-testid="text-ssl-grade">
                          {grade.grade}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Domain</p>
                        <p className="font-medium">{result.url}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      {result.valid && !result.isExpired ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className={`font-medium ${result.valid && !result.isExpired ? "text-green-600" : "text-red-600"}`}>
                          {result.isExpired ? "Expired" : result.valid ? "Valid" : "Invalid"}
                        </p>
                      </div>
                    </div>

                    {result.daysUntilExpiry !== undefined && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Days Until Expiry</p>
                          <p className={`font-medium ${
                            result.daysUntilExpiry < 0 ? "text-red-600" :
                            result.daysUntilExpiry < 30 ? "text-orange-600" :
                            "text-green-600"
                          }`}>
                            {result.daysUntilExpiry < 0 
                              ? `Expired ${Math.abs(result.daysUntilExpiry)} days ago` 
                              : `${result.daysUntilExpiry} days`}
                          </p>
                        </div>
                      </div>
                    )}

                    {result.issuer && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Building2 className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Issuer</p>
                          <p className="font-medium truncate" title={result.issuer}>{result.issuer}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <FileCheck className="w-5 h-5" />
                      Certificate Details
                    </h4>
                    
                    <div className="grid gap-3">
                      {result.validFrom && (
                        <div className="flex items-center justify-between p-2 border-b border-border/50">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Valid From
                          </span>
                          <span className="font-medium">{new Date(result.validFrom).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {result.validTo && (
                        <div className="flex items-center justify-between p-2 border-b border-border/50">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Valid Until
                          </span>
                          <span className={`font-medium ${result.isExpired ? "text-red-600" : ""}`}>
                            {new Date(result.validTo).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {result.protocol && (
                        <div className="flex items-center justify-between p-2 border-b border-border/50">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <Key className="w-4 h-4" />
                            Protocol
                          </span>
                          <span className="font-medium">{result.protocol}</span>
                        </div>
                      )}

                      {result.cipher && (
                        <div className="flex items-center justify-between p-2 border-b border-border/50">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Cipher
                          </span>
                          <span className="font-medium text-sm">{result.cipher}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between p-2 border-b border-border/50">
                        <span className="text-muted-foreground">Extended Validation (EV)</span>
                        <span className={`font-medium ${result.isEV ? "text-green-600" : "text-muted-foreground"}`}>
                          {result.isEV ? "Yes" : "No"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2">
                        <span className="text-muted-foreground">Self-Signed</span>
                        <span className={`font-medium ${result.isSelfSigned ? "text-orange-600" : "text-green-600"}`}>
                          {result.isSelfSigned ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {(result.isExpired || result.isSelfSigned || !result.valid) && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2 text-orange-600">
                          <AlertTriangle className="w-5 h-5" />
                          Security Warnings
                        </h4>
                        <ul className="space-y-2">
                          {result.isExpired && (
                            <li className="flex items-start gap-2 text-red-600 dark:text-red-400">
                              <XCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                              <span>Certificate has expired. This website should not be trusted until a new certificate is installed.</span>
                            </li>
                          )}
                          {result.isSelfSigned && (
                            <li className="flex items-start gap-2 text-orange-600 dark:text-orange-400">
                              <AlertTriangle className="w-4 h-4 mt-1 flex-shrink-0" />
                              <span>Certificate is self-signed. This may be acceptable for internal sites but indicates a security risk for public websites.</span>
                            </li>
                          )}
                          {!result.valid && !result.isExpired && (
                            <li className="flex items-start gap-2 text-red-600 dark:text-red-400">
                              <XCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                              <span>Certificate validation failed. Do not enter sensitive information on this website.</span>
                            </li>
                          )}
                          {result.daysUntilExpiry !== undefined && result.daysUntilExpiry > 0 && result.daysUntilExpiry < 30 && (
                            <li className="flex items-start gap-2 text-yellow-600 dark:text-yellow-400">
                              <Clock className="w-4 h-4 mt-1 flex-shrink-0" />
                              <span>Certificate expires soon. Site administrators should renew it promptly.</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </>
                  )}

                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => { setUrl(""); setResult(null); }}
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Check Another
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="w-5 h-5 text-primary" />
                  What is SSL?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  SSL (Secure Sockets Layer) and its successor TLS (Transport Layer Security) 
                  encrypt the connection between your browser and a website, protecting your data 
                  from eavesdroppers.
                </p>
                <div className="space-y-2">
                  <p className="font-medium text-foreground">Look for these signs of a secure site:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Padlock icon in the address bar</li>
                    <li>URL starts with "https://"</li>
                    <li>Valid, non-expired certificate</li>
                    <li>Certificate issued by a trusted authority</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5 text-primary" />
                  Certificate Grades
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-green-600 w-8">A</span>
                  <span className="text-muted-foreground">Valid certificate with no issues</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-yellow-600 w-8">B</span>
                  <span className="text-muted-foreground">Valid but expiring soon (under 30 days)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-orange-600 w-8">C</span>
                  <span className="text-muted-foreground">Expiring very soon (under 7 days) or warnings</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-red-600 w-8">F</span>
                  <span className="text-muted-foreground">Expired, invalid, or serious issues</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Common SSL Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">Expired Certificate</p>
                  <p>The certificate's validity period has ended. Do not trust the site until renewed.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Self-Signed Certificate</p>
                  <p>Not issued by a trusted authority. Common on internal sites but risky for public use.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Name Mismatch</p>
                  <p>The certificate was issued for a different domain name.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Mixed Content</p>
                  <p>The page loads some resources over insecure HTTP connections.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
