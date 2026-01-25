import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Shield, 
  Link2, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Loader2,
  Smartphone,
  CreditCard,
  Heart,
  Briefcase,
  TrendingUp,
  HelpCircle,
  Phone,
  ExternalLink,
  Globe,
  QrCode,
  ImageIcon,
  Upload,
  Mail,
  Save,
  Bell,
  History,
  Share2
} from "lucide-react";
import { SiX, SiFacebook, SiWhatsapp } from "react-icons/si";
import { apiRequest } from "@/lib/queryClient";
import { QRScanner } from "./qr-scanner";

interface SavedScan {
  id: string;
  type: 'url' | 'phone' | 'situation' | 'qr' | 'image' | 'email';
  input: string;
  riskLevel: string;
  timestamp: string;
}

function SaveResultPrompt({ 
  scanType, 
  input, 
  riskLevel,
  onSaved 
}: { 
  scanType: 'url' | 'phone' | 'situation' | 'qr' | 'image' | 'email';
  input: string;
  riskLevel: string;
  onSaved?: () => void;
}) {
  const [saved, setSaved] = useState(false);
  const [showEmailSignup, setShowEmailSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribeAlerts, setSubscribeAlerts] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const saveToLocal = () => {
    const savedScans: SavedScan[] = JSON.parse(localStorage.getItem('savedScans') || '[]');
    const newScan: SavedScan = {
      id: Date.now().toString(),
      type: scanType,
      input: input.substring(0, 100),
      riskLevel,
      timestamp: new Date().toISOString()
    };
    savedScans.unshift(newScan);
    localStorage.setItem('savedScans', JSON.stringify(savedScans.slice(0, 20)));
    setSaved(true);
    setShowEmailSignup(true);
    onSaved?.();
  };

  const subscribeToAlerts = async () => {
    if (!email.trim() || isSubscribing) return;
    setIsSubscribing(true);
    try {
      await apiRequest("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.trim(),
          weeklyDigest: subscribeAlerts,
          digitalSafetyTips: true,
          source: 'scam_checker_save'
        })
      });
      setSubscribed(true);
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setIsSubscribing(false);
    }
  };

  if (subscribed) {
    return (
      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            Result saved! You'll receive security alerts at {email}
          </p>
        </div>
      </div>
    );
  }

  if (saved && showEmailSignup) {
    return (
      <div className="mt-4 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
        <div className="flex items-start gap-2 mb-3">
          <Bell className="w-5 h-5 text-teal-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-teal-800 dark:text-teal-200 text-sm">
              Result Saved! Want to stay protected?
            </p>
            <p className="text-xs text-teal-600 dark:text-teal-300">
              Get alerts about new scam trends and security tips
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="h-9 text-sm bg-white dark:bg-slate-800"
            />
            <Button
              onClick={subscribeToAlerts}
              disabled={!email.trim() || isSubscribing}
              size="sm"
              className="bg-teal-600 hover:bg-teal-700 text-white h-9"
            >
              {isSubscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="alerts"
              checked={subscribeAlerts}
              onCheckedChange={(checked) => setSubscribeAlerts(checked as boolean)}
            />
            <label htmlFor="alerts" className="text-xs text-teal-700 dark:text-teal-300">
              Send me weekly fraud alerts and security tips
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 flex items-center gap-3">
      <Button
        onClick={saveToLocal}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        Save This Result
      </Button>
      <span className="text-xs text-slate-500 dark:text-slate-400">
        Save to view later on this device
      </span>
    </div>
  );
}

function ShareResultButton({ 
  riskLevel, 
  checkType 
}: { 
  riskLevel: string;
  checkType: 'url' | 'phone' | 'situation' | 'image' | 'email' | 'qr';
}) {
  const [showOptions, setShowOptions] = useState(false);
  
  const getRiskEmoji = () => {
    if (riskLevel === 'safe' || riskLevel === 'low') return '✅';
    if (riskLevel === 'medium' || riskLevel === 'suspicious') return '⚠️';
    return '🚨';
  };
  
  const getShareText = () => {
    const emoji = getRiskEmoji();
    const typeLabel = checkType === 'url' ? 'link' : checkType === 'situation' ? 'message' : checkType;
    const riskText = riskLevel === 'safe' || riskLevel === 'low' 
      ? 'looks safe' 
      : riskLevel === 'medium' || riskLevel === 'suspicious'
        ? 'is suspicious'
        : 'is likely a scam';
    return `${emoji} I just checked a ${typeLabel} with GetCyberRight - it ${riskText}! Check yours for free:`;
  };
  
  const shareUrl = 'https://getcyberright.com/scam-checker';
  const shareText = getShareText();
  
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
  };
  
  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    setShowOptions(false);
  };
  
  const copyLink = async () => {
    await navigator.clipboard.writeText(shareText + ' ' + shareUrl);
    setShowOptions(false);
  };

  return (
    <div className="relative inline-block">
      <Button
        onClick={() => setShowOptions(!showOptions)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 border-teal-300 text-teal-700 hover:bg-teal-50 dark:border-teal-700 dark:text-teal-400 dark:hover:bg-teal-900/20"
      >
        <Share2 className="w-4 h-4" />
        Share Result
      </Button>
      
      {showOptions && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50 flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 hover:bg-blue-100 dark:hover:bg-blue-900/30"
            onClick={() => handleShare('twitter')}
            title="Share on X"
          >
            <SiX className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 hover:bg-blue-100 dark:hover:bg-blue-900/30"
            onClick={() => handleShare('facebook')}
            title="Share on Facebook"
          >
            <SiFacebook className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 hover:bg-green-100 dark:hover:bg-green-900/30"
            onClick={() => handleShare('whatsapp')}
            title="Share on WhatsApp"
          >
            <SiWhatsapp className="h-4 w-4 text-green-600" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 hover:bg-slate-100 dark:hover:bg-slate-700"
            onClick={copyLink}
            title="Copy to clipboard"
          >
            <Link2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

interface URLAnalysisResult {
  isSuspicious: boolean;
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  warnings: string[];
  recommendations: string[];
  expandedUrl?: string;
  redirectChain?: string[];
}

interface PhoneAnalysisResult {
  isSuspicious: boolean;
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  countryInfo?: string;
  warnings: string[];
  recommendations: string[];
}

interface ScamAnalysisResult {
  verdict: 'safe' | 'suspicious' | 'likely_scam' | 'scam';
  confidence: number;
  explanation: string;
  redFlags: string[];
  recommendations: string[];
  scamType?: string;
  sources?: { name: string; url: string; relevance: string }[];
}

interface ImageAnalysisResult {
  extractedText: string;
  scamAnalysis: ScamAnalysisResult;
  containsLinks: string[];
  containsPhones: string[];
}

interface DomainReputation {
  isBlacklisted: boolean;
  blacklists: string[];
  trustScore: number;
}

interface DomainInfo {
  domain: string;
  registrationDate: string | null;
  expirationDate: string | null;
  ageInDays: number | null;
  registrar: string | null;
  registrantOrg: string | null;
  registrantCountry: string | null;
  isNewDomain: boolean;
}

interface PhishingPattern {
  patternName: string;
  description: string;
  matchedIndicators: string[];
}

interface EmailHeaderAnalysisResult {
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  confidence: number;
  sender: {
    from: string | null;
    replyTo: string | null;
    returnPath: string | null;
    mismatch: boolean;
  };
  authentication: {
    spf: string;
    dkim: string;
    dmarc: string;
  };
  routingAnalysis: {
    hops: number;
    suspiciousHops: string[];
    originCountry: string | null;
  };
  domainReputation: DomainReputation | null;
  domainInfo: DomainInfo | null;
  phishingPatterns: PhishingPattern[];
  aiAnalysis: string | null;
  redFlags: string[];
  recommendations: string[];
  summary: string;
}

const scamTypes = [
  { id: 'mobile_money', label: 'Mobile Money (M-Pesa, MTN, Airtel)', icon: Smartphone },
  { id: 'phishing', label: 'Phishing / Fake Website', icon: Link2 },
  { id: 'romance', label: 'Romance / Dating Scam', icon: Heart },
  { id: 'job', label: 'Fake Job Offer', icon: Briefcase },
  { id: 'investment', label: 'Investment / Crypto Scam', icon: TrendingUp },
  { id: 'other', label: 'Other / Not Sure', icon: HelpCircle },
];

const getRiskColor = (level: string) => {
  switch (level) {
    case 'safe': return 'bg-green-500';
    case 'low': return 'bg-blue-500';
    case 'medium': return 'bg-yellow-500';
    case 'high': return 'bg-orange-500';
    case 'critical': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getVerdictColor = (verdict: string) => {
  switch (verdict) {
    case 'safe': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    case 'suspicious': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    case 'likely_scam': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
    case 'scam': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getVerdictIcon = (verdict: string) => {
  switch (verdict) {
    case 'safe': return <CheckCircle className="h-6 w-6 text-green-600" />;
    case 'suspicious': return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
    case 'likely_scam': return <AlertTriangle className="h-6 w-6 text-orange-600" />;
    case 'scam': return <XCircle className="h-6 w-6 text-red-600" />;
    default: return <HelpCircle className="h-6 w-6 text-gray-600" />;
  }
};

export function ScamChecker() {
  const [activeTab, setActiveTab] = useState("link");
  const [url, setUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [selectedScamType, setSelectedScamType] = useState<string | null>(null);
  const [urlResult, setUrlResult] = useState<URLAnalysisResult | null>(null);
  const [phoneResult, setPhoneResult] = useState<PhoneAnalysisResult | null>(null);
  const [scamResult, setScamResult] = useState<ScamAnalysisResult | null>(null);
  const [qrUrlResult, setQrUrlResult] = useState<URLAnalysisResult | null>(null);
  const [imageResult, setImageResult] = useState<ImageAnalysisResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [emailHeaders, setEmailHeaders] = useState("");
  const [emailResult, setEmailResult] = useState<EmailHeaderAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const urlMutation = useMutation({
    mutationFn: async (urlToCheck: string) => {
      const response = await apiRequest("/api/scam-check/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToCheck })
      });
      return response;
    },
    onSuccess: (data) => {
      setUrlResult(data);
    }
  });

  const phoneMutation = useMutation({
    mutationFn: async (phoneToCheck: string) => {
      const response = await apiRequest("/api/scam-check/phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneToCheck })
      });
      return response;
    },
    onSuccess: (data) => {
      setPhoneResult(data);
    }
  });

  const scamMutation = useMutation({
    mutationFn: async (data: { description: string; scamType?: string }) => {
      const response = await apiRequest("/api/scam-check/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      return response;
    },
    onSuccess: (data) => {
      setScamResult(data);
    }
  });

  const qrUrlMutation = useMutation({
    mutationFn: async (urlToCheck: string) => {
      const response = await apiRequest("/api/scam-check/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToCheck })
      });
      return response;
    },
    onSuccess: (data) => {
      setQrUrlResult(data);
    }
  });

  const imageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('screenshot', file);
      const response = await fetch("/api/scam-check/image", {
        method: "POST",
        body: formData
      });
      if (!response.ok) throw new Error("Failed to analyze image");
      return response.json();
    },
    onSuccess: (data) => {
      setImageResult(data);
    }
  });

  const emailMutation = useMutation({
    mutationFn: async (headers: string) => {
      const response = await apiRequest("/api/scam-check/email-headers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headers })
      });
      return response;
    },
    onSuccess: (data) => {
      setEmailResult(data);
    }
  });

  const handleEmailCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailHeaders.trim()) {
      setEmailResult(null);
      emailMutation.mutate(emailHeaders.trim());
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImageResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          setSelectedFile(file);
          setImageResult(null);
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
        break;
      }
    }
  };

  const handleImageCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      setImageResult(null);
      imageMutation.mutate(selectedFile);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setImageResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleQrScanResult = (scannedCode: string) => {
    const urlPattern = /^(https?:\/\/|www\.)/i;
    if (urlPattern.test(scannedCode)) {
      setQrUrlResult(null);
      let normalizedUrl = scannedCode;
      if (/^www\./i.test(scannedCode)) {
        normalizedUrl = 'https://' + scannedCode;
      }
      qrUrlMutation.mutate(normalizedUrl);
    }
  };

  const handleUrlCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      setUrlResult(null);
      urlMutation.mutate(url.trim());
    }
  };

  const handlePhoneCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) {
      setPhoneResult(null);
      phoneMutation.mutate(phone.trim());
    }
  };

  const handleScamCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length >= 20) {
      setScamResult(null);
      scamMutation.mutate({ 
        description: description.trim(), 
        scamType: selectedScamType || undefined 
      });
    }
  };

  return (
    <Card className="w-full border-2 border-teal-500/20 shadow-xl" data-testid="scam-checker">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="h-8 w-8 text-teal-500" />
          <CardTitle className="text-2xl font-bold">Scam Checker</CardTitle>
        </div>
        <CardDescription className="text-base">
          Check suspicious links, phone numbers, or describe a situation to see if it might be a scam
        </CardDescription>
      </CardHeader>
      
      <CardContent className="px-4 sm:px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-4 sm:mb-6 h-auto p-1 gap-1">
            <TabsTrigger value="link" className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 text-xs sm:text-sm" data-testid="tab-link-check">
              <Link2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Check</span> Link
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 text-xs sm:text-sm" data-testid="tab-qr-scan">
              <QrCode className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Scan</span> QR
            </TabsTrigger>
            <TabsTrigger value="screenshot" className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 text-xs sm:text-sm" data-testid="tab-screenshot">
              <ImageIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Upload</span> Image
            </TabsTrigger>
            <TabsTrigger value="phone" className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 text-xs sm:text-sm" data-testid="tab-phone-check">
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Phone
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 text-xs sm:text-sm" data-testid="tab-email-check">
              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="describe" className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 text-xs sm:text-sm" data-testid="tab-describe-situation">
              <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Describe
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link">
            <form onSubmit={handleUrlCheck} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Paste a suspicious link here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="text-base h-12 px-4"
                  data-testid="input-url"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-teal-500 hover:bg-teal-600 h-12 text-base active:scale-[0.98]"
                disabled={!url.trim() || urlMutation.isPending}
                data-testid="button-check-link"
              >
                {urlMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Check This Link
                  </>
                )}
              </Button>
            </form>

            {urlResult && (
              <div className="mt-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-800" data-testid="url-result">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-4 h-4 rounded-full ${getRiskColor(urlResult.riskLevel)}`}></div>
                  <span className="font-semibold text-lg capitalize">
                    Risk Level: {urlResult.riskLevel}
                  </span>
                </div>

                {urlResult.expandedUrl && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      URL Expanded
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      This shortened link actually leads to:
                    </p>
                    <div className="bg-white dark:bg-slate-900 p-2 rounded border text-sm font-mono break-all">
                      {urlResult.expandedUrl}
                    </div>
                    {urlResult.redirectChain && urlResult.redirectChain.length > 2 && (
                      <details className="mt-2">
                        <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-700">
                          View redirect chain ({urlResult.redirectChain.length} hops)
                        </summary>
                        <ol className="mt-2 space-y-1 text-xs">
                          {urlResult.redirectChain.map((hop, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-500">
                              <span className="font-medium">{i + 1}.</span>
                              <span className="break-all">{hop}</span>
                            </li>
                          ))}
                        </ol>
                      </details>
                    )}
                  </div>
                )}

                {urlResult.warnings.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Warnings
                    </h4>
                    <ul className="space-y-1">
                      {urlResult.warnings.map((warning, i) => (
                        <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-teal-600 dark:text-teal-400 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Recommendations
                  </h4>
                  <ul className="space-y-1">
                    {urlResult.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <ShareResultButton riskLevel={urlResult.riskLevel} checkType="url" />
                  <SaveResultPrompt 
                    scanType="url" 
                    input={url} 
                    riskLevel={urlResult.riskLevel} 
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="qr">
            <QRScanner 
              onScanResult={handleQrScanResult}
              isAnalyzing={qrUrlMutation.isPending}
            />
            
            {qrUrlResult && (
              <div className="mt-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-800" data-testid="qr-url-result">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-4 h-4 rounded-full ${getRiskColor(qrUrlResult.riskLevel)}`}></div>
                  <span className="font-semibold text-lg capitalize">
                    Risk Level: {qrUrlResult.riskLevel}
                  </span>
                </div>

                {qrUrlResult.expandedUrl && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      URL Expanded
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      This QR code link actually leads to:
                    </p>
                    <div className="bg-white dark:bg-slate-900 p-2 rounded border text-sm font-mono break-all">
                      {qrUrlResult.expandedUrl}
                    </div>
                  </div>
                )}

                {qrUrlResult.warnings.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Warnings
                    </h4>
                    <ul className="space-y-1">
                      {qrUrlResult.warnings.map((warning, i) => (
                        <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-teal-600 dark:text-teal-400 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Recommendations
                  </h4>
                  <ul className="space-y-1">
                    {qrUrlResult.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <ShareResultButton riskLevel={qrUrlResult.riskLevel} checkType="qr" />
                  <SaveResultPrompt 
                    scanType="qr" 
                    input={qrUrlResult.expandedUrl || "QR Code scan"} 
                    riskLevel={qrUrlResult.riskLevel} 
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="screenshot">
            <form onSubmit={handleImageCheck} className="space-y-4">
              <div 
                className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-colors"
                onPaste={handleImagePaste}
                tabIndex={0}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  id="screenshot-upload"
                  data-testid="input-screenshot"
                />
                
                {imagePreview ? (
                  <div className="space-y-4">
                    <img 
                      src={imagePreview} 
                      alt="Screenshot preview" 
                      className="max-h-48 mx-auto rounded-lg shadow-md"
                    />
                    <div className="flex gap-2 justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={clearImage}
                      >
                        Remove
                      </Button>
                      <label 
                        htmlFor="screenshot-upload"
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md border border-input bg-background hover:bg-accent cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                        Change
                      </label>
                    </div>
                  </div>
                ) : (
                  <label htmlFor="screenshot-upload" className="cursor-pointer block">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-300">
                          Upload or paste a screenshot
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          JPEG, PNG, GIF, or WebP (max 5MB) - or press Ctrl+V / Cmd+V to paste
                        </p>
                      </div>
                      <Button type="button" variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </span>
                      </Button>
                    </div>
                  </label>
                )}
              </div>
              
              <p className="text-xs text-slate-500 text-center">
                Upload a screenshot of a suspicious message, email, or website. We'll extract the text and analyze it for scam patterns.
              </p>
              
              <Button 
                type="submit" 
                className="w-full bg-teal-500 hover:bg-teal-600 h-12 text-base"
                disabled={!selectedFile || imageMutation.isPending}
                data-testid="button-analyze-screenshot"
              >
                {imageMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Screenshot...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Analyze Screenshot
                  </>
                )}
              </Button>
            </form>

            {imageResult && (
              <div className="mt-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-800" data-testid="image-result">
                <div className="mb-3 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded text-xs text-amber-700 dark:text-amber-300">
                  <strong>AI Analysis Disclaimer:</strong> This analysis is generated by AI and may contain errors. Always verify information independently and consult official sources before taking action.
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  {getVerdictIcon(imageResult.scamAnalysis.verdict)}
                  <div>
                    <Badge className={`${getVerdictColor(imageResult.scamAnalysis.verdict)} capitalize px-3 py-1`}>
                      {imageResult.scamAnalysis.verdict.replace('_', ' ')}
                    </Badge>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {imageResult.scamAnalysis.confidence}% confidence
                    </span>
                  </div>
                </div>

                {imageResult.extractedText && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Extracted Text
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap max-h-32 overflow-y-auto">
                      {imageResult.extractedText}
                    </p>
                  </div>
                )}

                {(imageResult.containsLinks.length > 0 || imageResult.containsPhones.length > 0) && (
                  <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-medium text-yellow-600 dark:text-yellow-400 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Detected in Image
                    </h4>
                    {imageResult.containsLinks.length > 0 && (
                      <div className="mb-2">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Links found:</span>
                        <ul className="mt-1 space-y-1">
                          {imageResult.containsLinks.map((link, i) => (
                            <li key={i} className="text-xs text-slate-500 break-all">{link}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {imageResult.containsPhones.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Phone numbers found:</span>
                        <ul className="mt-1 space-y-1">
                          {imageResult.containsPhones.map((phone, i) => (
                            <li key={i} className="text-xs text-slate-500">{phone}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  {imageResult.scamAnalysis.explanation}
                </p>

                {imageResult.scamAnalysis.redFlags.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Red Flags
                    </h4>
                    <ul className="space-y-1">
                      {imageResult.scamAnalysis.redFlags.map((flag, i) => (
                        <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-teal-600 dark:text-teal-400 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Recommendations
                  </h4>
                  <ul className="space-y-1">
                    {imageResult.scamAnalysis.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {imageResult.scamAnalysis.sources && imageResult.scamAnalysis.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2">
                      <ExternalLink className="h-4 w-4" />
                      Verified Sources
                    </h4>
                    <div className="space-y-2">
                      {imageResult.scamAnalysis.sources.map((source, i) => (
                        <a 
                          key={i}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-2 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm text-teal-700 dark:text-teal-300">{source.name}</span>
                            <ExternalLink className="h-3 w-3 text-teal-500" />
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{source.relevance}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <ShareResultButton riskLevel={imageResult.scamAnalysis.verdict} checkType="image" />
                  <SaveResultPrompt 
                    scanType="image" 
                    input="Screenshot analysis" 
                    riskLevel={imageResult.scamAnalysis.verdict} 
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="phone">
            <form onSubmit={handlePhoneCheck} className="space-y-4">
              <div>
                <Input
                  type="tel"
                  placeholder="Phone with country code (e.g., +234...)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-base h-12 px-4"
                  data-testid="input-phone"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Include the country code for better analysis
                </p>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-teal-500 hover:bg-teal-600 h-12 text-base"
                disabled={!phone.trim() || phoneMutation.isPending}
                data-testid="button-check-phone"
              >
                {phoneMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Check This Number
                  </>
                )}
              </Button>
            </form>

            {phoneResult && (
              <div className="mt-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-800" data-testid="phone-result">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-4 h-4 rounded-full ${getRiskColor(phoneResult.riskLevel)}`}></div>
                  <span className="font-semibold text-lg capitalize">
                    Risk Level: {phoneResult.riskLevel}
                  </span>
                </div>

                {phoneResult.countryInfo && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Origin: {phoneResult.countryInfo}
                      </span>
                    </div>
                  </div>
                )}

                {phoneResult.warnings.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Warnings
                    </h4>
                    <ul className="space-y-1">
                      {phoneResult.warnings.map((warning, i) => (
                        <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-teal-600 dark:text-teal-400 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Recommendations
                  </h4>
                  <ul className="space-y-1">
                    {phoneResult.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <ShareResultButton riskLevel={phoneResult.riskLevel} checkType="phone" />
                  <SaveResultPrompt 
                    scanType="phone" 
                    input={phone} 
                    riskLevel={phoneResult.riskLevel} 
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="describe">
            <form onSubmit={handleScamCheck} className="space-y-4">
              <div className="mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  What type of scam do you suspect? (optional)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {scamTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedScamType(selectedScamType === type.id ? null : type.id)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          selectedScamType === type.id
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-teal-300'
                        }`}
                        data-testid={`scam-type-${type.id}`}
                      >
                        <Icon className={`h-5 w-5 mb-1 ${selectedScamType === type.id ? 'text-teal-500' : 'text-slate-400'}`} />
                        <span className="text-xs font-medium">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Textarea
                  placeholder="Describe what happened... For example: 'I received a WhatsApp message from someone claiming to be from my bank saying my account was blocked and I need to click a link to verify my identity.'"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px] text-base"
                  data-testid="input-description"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {description.length}/5000 characters (minimum 20)
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-teal-500 hover:bg-teal-600"
                disabled={description.trim().length < 20 || scamMutation.isPending}
                data-testid="button-analyze-situation"
              >
                {scamMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Analyze This Situation
                  </>
                )}
              </Button>
            </form>

            {scamResult && (
              <div className="mt-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-800" data-testid="scam-result">
                <div className="mb-3 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded text-xs text-amber-700 dark:text-amber-300">
                  <strong>AI Analysis Disclaimer:</strong> This analysis is generated by AI and may contain errors. Always verify information independently and consult official sources before taking action.
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  {getVerdictIcon(scamResult.verdict)}
                  <Badge className={`text-sm px-3 py-1 ${getVerdictColor(scamResult.verdict)}`}>
                    {scamResult.verdict === 'likely_scam' ? 'Likely a Scam' : 
                     scamResult.verdict.charAt(0).toUpperCase() + scamResult.verdict.slice(1)}
                  </Badge>
                  {scamResult.scamType && (
                    <Badge variant="outline" className="text-sm">
                      {scamResult.scamType}
                    </Badge>
                  )}
                </div>

                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  {scamResult.explanation}
                </p>

                {scamResult.redFlags.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Red Flags Detected
                    </h4>
                    <ul className="space-y-1">
                      {scamResult.redFlags.map((flag, i) => (
                        <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-teal-600 dark:text-teal-400 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    What You Should Do
                  </h4>
                  <ul className="space-y-1">
                    {scamResult.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {scamResult.sources && scamResult.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2">
                      <ExternalLink className="h-4 w-4" />
                      Verified Sources
                    </h4>
                    <div className="space-y-2">
                      {scamResult.sources.map((source, i) => (
                        <a 
                          key={i}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-2 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm text-teal-700 dark:text-teal-300">{source.name}</span>
                            <ExternalLink className="h-3 w-3 text-teal-500" />
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{source.relevance}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <ShareResultButton riskLevel={scamResult.verdict} checkType="situation" />
                  <SaveResultPrompt 
                    scanType="situation" 
                    input={description.substring(0, 50)} 
                    riskLevel={scamResult.verdict} 
                  />
                </div>
              </div>
            )}
          </TabsContent>

<TabsContent value="email">
            <form onSubmit={handleEmailCheck} className="space-y-4">
              <div>
                <Textarea
                  placeholder="Paste the full email headers here (In Gmail: Open email > Three dots menu > Show original > Copy headers)"
                  value={emailHeaders}
                  onChange={(e) => setEmailHeaders(e.target.value)}
                  className="min-h-[150px] font-mono text-xs"
                  data-testid="input-email-headers"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Email headers contain technical details that reveal if an email is spoofed or legitimate
                </p>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-teal-500 hover:bg-teal-600 h-12 text-base active:scale-[0.98]"
                disabled={!emailHeaders.trim() || emailMutation.isPending}
                data-testid="button-check-email"
              >
                {emailMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Analyzing Headers...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5 mr-2" />
                    Analyze Email Headers
                  </>
                )}
              </Button>
            </form>

            {emailResult && (
              <div className="mt-6 p-4 sm:p-6 rounded-lg border bg-white dark:bg-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  {emailResult.riskLevel === 'safe' ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : emailResult.riskLevel === 'suspicious' ? (
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                  <div>
                    <h3 className={`font-semibold text-lg ${
                      emailResult.riskLevel === 'safe' 
                        ? 'text-green-600' 
                        : emailResult.riskLevel === 'suspicious'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}>
                      {emailResult.riskLevel === 'safe' 
                        ? 'Email Appears Legitimate' 
                        : emailResult.riskLevel === 'suspicious'
                        ? 'Suspicious Email'
                        : 'Likely Spoofed Email'}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {emailResult.confidence}% confidence
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {emailResult.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">SENDER INFO</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-slate-500">From:</span> {emailResult.sender.from || 'Not found'}</p>
                      {emailResult.sender.replyTo && (
                        <p><span className="text-slate-500">Reply-To:</span> {emailResult.sender.replyTo}</p>
                      )}
                      {emailResult.sender.mismatch && (
                        <Badge variant="destructive" className="text-xs mt-1">Address Mismatch</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">AUTHENTICATION</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={emailResult.authentication.spf === 'pass' ? 'default' : emailResult.authentication.spf === 'fail' ? 'destructive' : 'secondary'} className="text-xs">
                        SPF: {emailResult.authentication.spf}
                      </Badge>
                      <Badge variant={emailResult.authentication.dkim === 'pass' ? 'default' : emailResult.authentication.dkim === 'fail' ? 'destructive' : 'secondary'} className="text-xs">
                        DKIM: {emailResult.authentication.dkim}
                      </Badge>
                      <Badge variant={emailResult.authentication.dmarc === 'pass' ? 'default' : emailResult.authentication.dmarc === 'fail' ? 'destructive' : 'secondary'} className="text-xs">
                        DMARC: {emailResult.authentication.dmarc}
                      </Badge>
                    </div>
                  </div>
                </div>

                {emailResult.routingAnalysis.hops > 0 && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">ROUTING</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {emailResult.routingAnalysis.hops} server hop(s)
                      {emailResult.routingAnalysis.originCountry && ` from ${emailResult.routingAnalysis.originCountry}`}
                    </p>
                    {emailResult.routingAnalysis.suspiciousHops.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {emailResult.routingAnalysis.suspiciousHops.map((hop, i) => (
                          <p key={i} className="text-xs text-red-600 dark:text-red-400">{hop}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {emailResult.aiAnalysis && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      AI ANALYSIS
                    </h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {emailResult.aiAnalysis}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {emailResult.domainInfo && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">DOMAIN INFO (WHOIS)</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-slate-500">Domain:</span> {emailResult.domainInfo.domain}</p>
                        {emailResult.domainInfo.ageInDays !== null && (
                          <p>
                            <span className="text-slate-500">Age:</span> {emailResult.domainInfo.ageInDays} days
                            {emailResult.domainInfo.isNewDomain && (
                              <Badge variant="destructive" className="text-xs ml-2">NEW DOMAIN</Badge>
                            )}
                          </p>
                        )}
                        {emailResult.domainInfo.registrar && (
                          <p><span className="text-slate-500">Registrar:</span> {emailResult.domainInfo.registrar}</p>
                        )}
                        {emailResult.domainInfo.registrantCountry && (
                          <p><span className="text-slate-500">Country:</span> {emailResult.domainInfo.registrantCountry}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {emailResult.domainReputation && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">DOMAIN REPUTATION</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-500">Trust Score:</span>
                          <div className="flex-1 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                emailResult.domainReputation.trustScore >= 70 
                                  ? 'bg-green-500' 
                                  : emailResult.domainReputation.trustScore >= 40 
                                  ? 'bg-yellow-500' 
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${emailResult.domainReputation.trustScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{emailResult.domainReputation.trustScore}%</span>
                        </div>
                        {emailResult.domainReputation.isBlacklisted && (
                          <div className="mt-2">
                            <Badge variant="destructive" className="text-xs">BLACKLISTED</Badge>
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                              Listed on: {emailResult.domainReputation.blacklists.join(', ')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {emailResult.phishingPatterns.length > 0 && (
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h4 className="text-sm font-medium text-orange-700 dark:text-orange-300 flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      Phishing Patterns Detected ({emailResult.phishingPatterns.length})
                    </h4>
                    <div className="space-y-2">
                      {emailResult.phishingPatterns.map((pattern, i) => (
                        <div key={i} className="text-sm">
                          <p className="font-medium text-orange-700 dark:text-orange-300">{pattern.patternName}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{pattern.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {emailResult.redFlags.length > 0 && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="text-sm font-medium text-red-700 dark:text-red-300 flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      Warning Signs ({emailResult.redFlags.length})
                    </h4>
                    <ul className="space-y-1">
                      {emailResult.redFlags.map((flag, i) => (
                        <li key={i} className="text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
                          <span className="text-red-500 mt-1">-</span>
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                  <h4 className="text-sm font-medium text-teal-700 dark:text-teal-300 flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4" />
                    Recommendations
                  </h4>
                  <ul className="space-y-1">
                    {emailResult.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <ShareResultButton riskLevel={emailResult.riskLevel} checkType="email" />
                  <SaveResultPrompt 
                    scanType="email" 
                    input={emailResult.sender.from || "Email header analysis"} 
                    riskLevel={emailResult.riskLevel} 
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
