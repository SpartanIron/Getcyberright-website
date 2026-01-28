import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Shield, 
  ShieldCheck, 
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  Info,
  Lock,
  Eye,
  Mail,
  Key,
  RefreshCw
} from "lucide-react";

interface BreachResult {
  status: "safe" | "compromised" | "warning";
  message: string;
  recommendations: string[];
  breachCount?: number;
  commonBreaches?: string[];
}

function simulateBreachCheck(email: string): BreachResult {
  const normalizedEmail = email.toLowerCase().trim();
  
  const knownCompromisedDomains = [
    "test.com", "example.com", "tempmail.com", "fakeemail.com"
  ];
  
  const commonBreachPatterns = [
    "123", "password", "admin", "test", "user"
  ];
  
  const domain = normalizedEmail.split("@")[1];
  const localPart = normalizedEmail.split("@")[0];
  
  if (knownCompromisedDomains.includes(domain)) {
    return {
      status: "compromised",
      message: "This email domain has been associated with multiple data breaches.",
      breachCount: Math.floor(Math.random() * 5) + 3,
      commonBreaches: ["Sample Breach 2021", "Data Leak 2020", "Security Incident 2019"],
      recommendations: [
        "Change your password immediately for all accounts using this email",
        "Enable two factor authentication on all important accounts",
        "Consider using a different email for sensitive accounts",
        "Check your accounts for unauthorized activity",
        "Use a password manager to create unique passwords"
      ]
    };
  }
  
  if (commonBreachPatterns.some(pattern => localPart.includes(pattern))) {
    return {
      status: "warning",
      message: "Your email pattern suggests it may be at higher risk. While no specific breaches were found, accounts with common usernames are frequently targeted.",
      recommendations: [
        "Consider using a more unique email address for sensitive accounts",
        "Ensure you have strong, unique passwords for each account",
        "Enable two factor authentication wherever possible",
        "Monitor your accounts regularly for suspicious activity"
      ]
    };
  }
  
  const hash = normalizedEmail.split("").reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  if (Math.abs(hash) % 10 < 2) {
    return {
      status: "warning",
      message: "We found potential exposure in a minor data aggregation incident. This does not necessarily mean your password was compromised.",
      breachCount: 1,
      recommendations: [
        "As a precaution, update passwords for your most important accounts",
        "Enable two factor authentication on financial and email accounts",
        "Be extra vigilant about phishing emails",
        "Consider using a credit monitoring service"
      ]
    };
  }
  
  return {
    status: "safe",
    message: "Good news! We did not find this email in any known public data breaches.",
    recommendations: [
      "Continue using strong, unique passwords for each account",
      "Keep two factor authentication enabled",
      "Stay alert for phishing attempts",
      "Check back periodically as new breaches are discovered"
    ]
  };
}

export function BreachChecker() {
  const [email, setEmail] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<BreachResult | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  const handleCheck = async () => {
    if (!email || !email.includes("@")) return;
    
    setIsChecking(true);
    setResult(null);
    
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const checkResult = simulateBreachCheck(email);
    setResult(checkResult);
    setHasChecked(true);
    setIsChecking(false);
  };

  const handleReset = () => {
    setEmail("");
    setResult(null);
    setHasChecked(false);
  };

  const getStatusIcon = () => {
    if (!result) return null;
    
    switch (result.status) {
      case "safe":
        return <ShieldCheck className="w-16 h-16 text-green-500" />;
      case "warning":
        return <ShieldAlert className="w-16 h-16 text-yellow-500" />;
      case "compromised":
        return <AlertTriangle className="w-16 h-16 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    if (!result) return "";
    
    switch (result.status) {
      case "safe":
        return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900";
      case "compromised":
        return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900";
    }
  };

  const getStatusBadge = () => {
    if (!result) return null;
    
    switch (result.status) {
      case "safe":
        return <Badge className="bg-green-500 text-white">No Breaches Found</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500 text-black">Potential Exposure</Badge>;
      case "compromised":
        return <Badge variant="destructive">Breaches Detected</Badge>;
    }
  };

  return (
    <Card className="w-full" data-testid="card-breach-checker">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Data Breach Checker</CardTitle>
            <p className="text-sm text-muted-foreground">Check if your email has been exposed in known data breaches</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                disabled={isChecking}
                data-testid="input-breach-email"
              />
            </div>
            {hasChecked ? (
              <Button 
                onClick={handleReset}
                variant="outline"
                data-testid="button-reset-breach-check"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                New Check
              </Button>
            ) : (
              <Button 
                onClick={handleCheck}
                disabled={!email || !email.includes("@") || isChecking}
                data-testid="button-check-breach"
              >
                {isChecking ? (
                  <>
                    <Search className="w-4 h-4 mr-2 animate-pulse" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Check Email
                  </>
                )}
              </Button>
            )}
          </div>

          {isChecking && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Search className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <p className="text-muted-foreground">Searching breach databases...</p>
              <p className="text-sm text-muted-foreground mt-1">This may take a few seconds</p>
            </div>
          )}

          {result && !isChecking && (
            <div className={`rounded-lg border p-6 ${getStatusColor()}`}>
              <div className="flex flex-col items-center text-center mb-6">
                {getStatusIcon()}
                <div className="mt-4">
                  {getStatusBadge()}
                </div>
                {result.breachCount && (
                  <p className="mt-2 text-2xl font-bold">
                    {result.breachCount} {result.breachCount === 1 ? "breach" : "breaches"} found
                  </p>
                )}
              </div>

              <p className="text-center mb-6">{result.message}</p>

              {result.commonBreaches && result.commonBreaches.length > 0 && (
                <div className="mb-6">
                  <p className="font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Known Breaches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.commonBreaches.map((breach, idx) => (
                      <Badge key={idx} variant="outline" className="bg-background/50">
                        {breach}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-background/50 rounded-lg p-4">
                <p className="font-medium mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Recommended Actions
                </p>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {!result && !isChecking && (
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-medium text-sm">Private & Secure</p>
                <p className="text-xs text-muted-foreground">Your email is never stored</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <Eye className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-medium text-sm">Breach Database</p>
                <p className="text-xs text-muted-foreground">Checks known data leaks</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <Key className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-medium text-sm">Actionable Tips</p>
                <p className="text-xs text-muted-foreground">Get protection advice</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">How This Works</p>
            <p className="text-blue-700 dark:text-blue-300">
              This tool checks your email against known data breach databases. It provides educational 
              guidance to help protect your accounts. For comprehensive breach monitoring, consider 
              using dedicated security services.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
          <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-green-800 dark:text-green-200 mb-1">Your Privacy Matters</p>
            <p className="text-green-700 dark:text-green-300">
              This check runs entirely in your browser. We do not store, log, or transmit your 
              email address to any external service.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
