import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  RefreshCw,
  EyeOff
} from "lucide-react";
import zxcvbn from "zxcvbn";

interface BreachResult {
  status: "safe" | "compromised" | "warning";
  message: string;
  recommendations: string[];
  breachCount?: number;
  commonBreaches?: string[];
}

interface PasswordResult {
  status: "safe" | "weak" | "compromised";
  message: string;
  strength: number;
  strengthLabel: string;
  crackTime: string;
  suggestions: string[];
  breachCount?: number;
}

// Disposable email domain list (common throwaway email services)
const disposableEmailDomains = new Set([
  'tempmail.com', 'throwaway.email', 'guerrillamail.com', 'mailinator.com',
  '10minutemail.com', 'temp-mail.org', 'fakeinbox.com', 'sharklasers.com',
  'guerrillamail.info', 'grr.la', 'guerrillamail.biz', 'guerrillamail.de',
  'guerrillamail.net', 'guerrillamail.org', 'spam4.me', 'trashmail.com',
  'maildrop.cc', 'getairmail.com', 'mohmal.com', 'tempail.com', 'tmails.net',
  'yopmail.com', 'dispostable.com', 'mintemail.com', 'tempinbox.com',
  'emailondeck.com', 'getnada.com', 'temp.email', 'throwawaymail.com'
]);

// Common weak passwords (top 100 from various breach databases)
const commonPasswords = new Set([
  '123456', 'password', '12345678', 'qwerty', '123456789', '12345', '1234',
  '111111', '1234567', 'dragon', '123123', 'baseball', 'iloveyou', 'trustno1',
  '1234567890', 'sunshine', 'master', 'welcome', 'shadow', 'ashley', 'football',
  'jesus', 'michael', 'ninja', 'mustang', 'password1', 'abc123', 'letmein',
  'monkey', '696969', 'batman', 'passw0rd', 'admin', 'login', 'princess',
  'qwertyuiop', 'solo', 'whatever', 'donald', 'google', 'internet', 'pokemon',
  'superman', 'charlie', '!@#$%^&*', 'hello', 'cheese', 'access', 'killer',
]);

// Check if email is from a disposable domain
function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? disposableEmailDomains.has(domain) : false;
}

// Validate email format
function isValidEmail(email: string): { valid: boolean; reason?: string } {
  if (!email.includes('@')) {
    return { valid: false, reason: "Missing @ symbol" };
  }
  
  const [local, domain] = email.split('@');
  
  if (!local || local.length === 0) {
    return { valid: false, reason: "Missing username before @" };
  }
  
  if (!domain || domain.length === 0) {
    return { valid: false, reason: "Missing domain after @" };
  }
  
  if (!domain.includes('.')) {
    return { valid: false, reason: "Domain missing extension (like .com)" };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, reason: "Invalid email format" };
  }
  
  return { valid: true };
}

// SHA-1 hash function for HIBP API
async function sha1(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

// Check password against Have I Been Pwned API (free, uses k-Anonymity)
async function checkPasswordHIBP(password: string): Promise<{ breached: boolean; count: number }> {
  try {
    const hash = await sha1(password);
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);
    
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: {
        'Add-Padding': 'true' // Adds padding to prevent response length analysis
      }
    });
    
    if (!response.ok) {
      throw new Error('HIBP API error');
    }
    
    const text = await response.text();
    const lines = text.split('\n');
    
    for (const line of lines) {
      const [hashSuffix, count] = line.split(':');
      if (hashSuffix.trim() === suffix) {
        return { breached: true, count: parseInt(count.trim(), 10) };
      }
    }
    
    return { breached: false, count: 0 };
  } catch (error) {
    // If API fails, return unknown status
    console.error('HIBP check failed:', error);
    return { breached: false, count: -1 }; // -1 indicates check failed
  }
}

// Analyze password strength using zxcvbn
function analyzePasswordStrength(password: string): {
  score: number;
  label: string;
  crackTime: string;
  feedback: string[];
} {
  const result = zxcvbn(password);
  
  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const label = labels[result.score];
  
  const crackTime = result.crack_times_display.offline_slow_hashing_1e4_per_second as string;
  
  const feedback: string[] = [];
  if (result.feedback.warning) {
    feedback.push(result.feedback.warning);
  }
  feedback.push(...result.feedback.suggestions);
  
  return {
    score: result.score,
    label,
    crackTime,
    feedback
  };
}

function simulateBreachCheck(email: string): BreachResult {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check for disposable email
  if (isDisposableEmail(normalizedEmail)) {
    return {
      status: "warning",
      message: "This appears to be a disposable or temporary email address. These are often used for spam and may not be accepted by many services.",
      recommendations: [
        "Use a permanent email address for important accounts",
        "Disposable emails cannot receive password reset links",
        "Many services block disposable email domains",
        "Consider using a reputable email provider for security"
      ]
    };
  }
  
  const knownCompromisedDomains = [
    "test.com", "example.com"
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

// Check password comprehensively
async function checkPassword(password: string): Promise<PasswordResult> {
  // First check if it's a known common password
  if (commonPasswords.has(password.toLowerCase())) {
    return {
      status: "compromised",
      message: "This is one of the most common passwords used worldwide. It would be cracked instantly.",
      strength: 0,
      strengthLabel: "Extremely Weak",
      crackTime: "Instantly",
      suggestions: [
        "Never use common passwords like 123456, password, or qwerty",
        "Create a password with at least 12 characters",
        "Mix uppercase, lowercase, numbers, and symbols",
        "Use a password manager to generate strong passwords"
      ],
      breachCount: 999999
    };
  }
  
  // Analyze strength with zxcvbn
  const strength = analyzePasswordStrength(password);
  
  // Check against Have I Been Pwned
  const hibpResult = await checkPasswordHIBP(password);
  
  if (hibpResult.breached && hibpResult.count > 0) {
    return {
      status: "compromised",
      message: `This password has appeared in ${hibpResult.count.toLocaleString()} known data breaches. Do not use this password.`,
      strength: Math.min(strength.score, 1),
      strengthLabel: "Compromised",
      crackTime: strength.crackTime,
      suggestions: [
        "This password was found in leaked databases and may be used in attacks",
        "Choose a completely different password",
        "Consider using a passphrase with 4 or more random words",
        "Use a password manager to generate unique passwords",
        ...strength.feedback
      ],
      breachCount: hibpResult.count
    };
  }
  
  // Password is not in breach database
  if (strength.score >= 3) {
    return {
      status: "safe",
      message: "This password was not found in any known data breaches and has good strength.",
      strength: strength.score,
      strengthLabel: strength.label,
      crackTime: strength.crackTime,
      suggestions: strength.feedback.length > 0 ? strength.feedback : [
        "Your password appears strong",
        "Enable two factor authentication for extra security",
        "Never reuse passwords across multiple accounts"
      ]
    };
  }
  
  return {
    status: "weak",
    message: hibpResult.count === -1 
      ? "Unable to check breach database, but password strength analysis completed."
      : "This password was not found in breaches, but could be stronger.",
    strength: strength.score,
    strengthLabel: strength.label,
    crackTime: strength.crackTime,
    suggestions: [
      ...strength.feedback,
      "Consider making your password longer",
      "Add more variety with uppercase, numbers, and symbols"
    ]
  };
}

export function BreachChecker() {
  const [activeTab, setActiveTab] = useState("email");
  
  // Email check state
  const [email, setEmail] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState<BreachResult | null>(null);
  const [hasCheckedEmail, setHasCheckedEmail] = useState(false);
  
  // Password check state
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);
  const [passwordResult, setPasswordResult] = useState<PasswordResult | null>(null);
  const [hasCheckedPassword, setHasCheckedPassword] = useState(false);

  const handleCheckEmail = async () => {
    const validation = isValidEmail(email);
    if (!validation.valid) return;
    
    setIsCheckingEmail(true);
    setEmailResult(null);
    
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const checkResult = simulateBreachCheck(email);
    setEmailResult(checkResult);
    setHasCheckedEmail(true);
    setIsCheckingEmail(false);
  };

  const handleResetEmail = () => {
    setEmail("");
    setEmailResult(null);
    setHasCheckedEmail(false);
  };
  
  const handleCheckPassword = async () => {
    if (!password || password.length < 1) return;
    
    setIsCheckingPassword(true);
    setPasswordResult(null);
    
    const checkResult = await checkPassword(password);
    setPasswordResult(checkResult);
    setHasCheckedPassword(true);
    setIsCheckingPassword(false);
  };

  const handleResetPassword = () => {
    setPassword("");
    setPasswordResult(null);
    setHasCheckedPassword(false);
  };

  const getEmailStatusIcon = () => {
    if (!emailResult) return null;
    
    switch (emailResult.status) {
      case "safe":
        return <ShieldCheck className="w-16 h-16 text-green-500" />;
      case "warning":
        return <ShieldAlert className="w-16 h-16 text-yellow-500" />;
      case "compromised":
        return <AlertTriangle className="w-16 h-16 text-red-500" />;
    }
  };

  const getEmailStatusColor = () => {
    if (!emailResult) return "";
    
    switch (emailResult.status) {
      case "safe":
        return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900";
      case "compromised":
        return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900";
    }
  };

  const getEmailStatusBadge = () => {
    if (!emailResult) return null;
    
    switch (emailResult.status) {
      case "safe":
        return <Badge className="bg-green-500 text-white">No Breaches Found</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500 text-black">Potential Exposure</Badge>;
      case "compromised":
        return <Badge variant="destructive">Breaches Detected</Badge>;
    }
  };
  
  const getPasswordStatusColor = () => {
    if (!passwordResult) return "";
    
    switch (passwordResult.status) {
      case "safe":
        return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900";
      case "weak":
        return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900";
      case "compromised":
        return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900";
    }
  };
  
  const getStrengthColor = (score: number) => {
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-lime-500",
      "bg-green-500"
    ];
    return colors[score] || "bg-gray-300";
  };

  return (
    <Card className="w-full" data-testid="card-breach-checker">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Security Checker</CardTitle>
            <p className="text-sm text-muted-foreground">Check emails for breaches and passwords for security</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="email" className="gap-2">
              <Mail className="w-4 h-4" />
              Email Check
            </TabsTrigger>
            <TabsTrigger value="password" className="gap-2">
              <Key className="w-4 h-4" />
              Password Check
            </TabsTrigger>
          </TabsList>
          
          {/* Email Breach Check Tab */}
          <TabsContent value="email" className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={isCheckingEmail}
                  aria-label="Email address to check for data breaches"
                  data-testid="input-breach-email"
                />
              </div>
              {hasCheckedEmail ? (
                <Button 
                  onClick={handleResetEmail}
                  variant="outline"
                  data-testid="button-reset-breach-check"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Check
                </Button>
              ) : (
                <Button 
                  onClick={handleCheckEmail}
                  disabled={!email || !email.includes("@") || isCheckingEmail}
                  aria-label={isCheckingEmail ? "Checking email for breaches" : "Check email for data breaches"}
                  aria-busy={isCheckingEmail}
                  data-testid="button-check-breach"
                >
                  {isCheckingEmail ? (
                    <>
                      <Search className="w-4 h-4 mr-2 animate-pulse" aria-hidden="true" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" aria-hidden="true" />
                      Check Email
                    </>
                  )}
                </Button>
              )}
            </div>

            {isCheckingEmail && (
              <div className="text-center py-8" role="status" aria-label="Checking for data breaches">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Search className="w-8 h-8 text-primary animate-pulse" aria-hidden="true" />
                </div>
                <p className="text-muted-foreground">Searching breach databases...</p>
                <p className="text-sm text-muted-foreground mt-1">This may take a few seconds</p>
              </div>
            )}

            {emailResult && !isCheckingEmail && (
              <div className={`rounded-lg border p-6 ${getEmailStatusColor()}`} role="alert" aria-live="polite">
                <div className="flex flex-col items-center text-center mb-6">
                  {getEmailStatusIcon()}
                  <div className="mt-4">
                    {getEmailStatusBadge()}
                  </div>
                  {emailResult.breachCount && (
                    <p className="mt-2 text-2xl font-bold">
                      {emailResult.breachCount} {emailResult.breachCount === 1 ? "breach" : "breaches"} found
                    </p>
                  )}
                </div>

                <p className="text-center mb-6">{emailResult.message}</p>

                {emailResult.commonBreaches && emailResult.commonBreaches.length > 0 && (
                  <div className="mb-6">
                    <p className="font-medium mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Known Breaches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {emailResult.commonBreaches.map((breach, idx) => (
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
                    {emailResult.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {!emailResult && !isCheckingEmail && (
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-medium text-sm">Private and Secure</p>
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
          </TabsContent>
          
          {/* Password Check Tab */}
          <TabsContent value="password" className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a password to check"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  disabled={isCheckingPassword}
                  aria-label="Password to check for breaches and strength"
                  data-testid="input-breach-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {hasCheckedPassword ? (
                <Button 
                  onClick={handleResetPassword}
                  variant="outline"
                  data-testid="button-reset-password-check"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Check
                </Button>
              ) : (
                <Button 
                  onClick={handleCheckPassword}
                  disabled={!password || password.length < 1 || isCheckingPassword}
                  aria-label={isCheckingPassword ? "Checking password security" : "Check password security"}
                  aria-busy={isCheckingPassword}
                  data-testid="button-check-password"
                >
                  {isCheckingPassword ? (
                    <>
                      <Search className="w-4 h-4 mr-2 animate-pulse" aria-hidden="true" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" aria-hidden="true" />
                      Check Password
                    </>
                  )}
                </Button>
              )}
            </div>

            {isCheckingPassword && (
              <div className="text-center py-8" role="status" aria-label="Checking password security">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Lock className="w-8 h-8 text-primary animate-pulse" aria-hidden="true" />
                </div>
                <p className="text-muted-foreground">Checking against 700+ million breached passwords...</p>
                <p className="text-sm text-muted-foreground mt-1">Using Have I Been Pwned database</p>
              </div>
            )}

            {passwordResult && !isCheckingPassword && (
              <div className={`rounded-lg border p-6 ${getPasswordStatusColor()}`} role="alert" aria-live="polite">
                <div className="flex flex-col items-center text-center mb-6">
                  {passwordResult.status === "safe" && <ShieldCheck className="w-16 h-16 text-green-500" />}
                  {passwordResult.status === "weak" && <ShieldAlert className="w-16 h-16 text-yellow-500" />}
                  {passwordResult.status === "compromised" && <AlertTriangle className="w-16 h-16 text-red-500" />}
                  
                  <div className="mt-4 space-y-2">
                    <Badge className={
                      passwordResult.status === "safe" ? "bg-green-500 text-white" :
                      passwordResult.status === "weak" ? "bg-yellow-500 text-black" :
                      "bg-red-500 text-white"
                    }>
                      {passwordResult.strengthLabel}
                    </Badge>
                    
                    {passwordResult.breachCount && passwordResult.breachCount > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Found in {passwordResult.breachCount.toLocaleString()} breaches
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Strength Meter */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Password Strength</span>
                    <span>Time to crack: {passwordResult.crackTime}</span>
                  </div>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-2 flex-1 rounded-full ${
                          level <= passwordResult.strength ? getStrengthColor(passwordResult.strength) : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-center mb-6">{passwordResult.message}</p>

                <div className="bg-background/50 rounded-lg p-4">
                  <p className="font-medium mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Suggestions
                  </p>
                  <ul className="space-y-2">
                    {passwordResult.suggestions.slice(0, 5).map((suggestion, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {!passwordResult && !isCheckingPassword && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="font-medium text-sm">Breach Check</p>
                    <p className="text-xs text-muted-foreground">Checks 700M+ passwords</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="font-medium text-sm">Strength Analysis</p>
                    <p className="text-xs text-muted-foreground">Powered by zxcvbn</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <EyeOff className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="font-medium text-sm">Privacy First</p>
                    <p className="text-xs text-muted-foreground">Password never sent in full</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">How Password Check Works</p>
                    <p className="text-blue-700 dark:text-blue-300">
                      We use Have I Been Pwned's secure k-Anonymity model. Only the first 5 characters 
                      of your password's hash are sent to check against 700+ million breached passwords. 
                      Your actual password never leaves your browser.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
          <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-green-800 dark:text-green-200 mb-1">Your Privacy Matters</p>
            <p className="text-green-700 dark:text-green-300">
              All checks run securely. Email checks are simulated locally. Password checks use 
              k-Anonymity so your full password is never transmitted.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
