import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Globe,
  Phone,
  Image as ImageIcon,
  QrCode,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  ExternalLink,
  Loader2,
  Upload,
  Camera,
  Lock,
  Clock,
  Server,
  FileSearch,
  ShieldAlert,
  ShieldCheck,
  Video,
  Mic,
  FileText,
  Eye,
} from "lucide-react";
import { createWorker } from "tesseract.js";
import jsQR from "jsqr";
import { apiRequest } from "@/lib/queryClient";

type TrustScoreFactor = {
  name: string;
  score: number;
  maxScore: number;
  status: "good" | "warning" | "danger";
  details: string;
};

type TrustScore = {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  factors: TrustScoreFactor[];
  summary: string;
};

type ComprehensiveScanResult = {
  url: string;
  overallThreatLevel: "safe" | "low" | "medium" | "high" | "critical";
  trustScore: TrustScore;
  googleSafeBrowsing?: {
    checked: boolean;
    isThreat: boolean;
    threats: string[];
    error?: string;
  };
  virusTotal?: {
    checked: boolean;
    positives: number;
    total: number;
    scanners: { name: string; detected: boolean; result?: string }[];
    permalink?: string;
    error?: string;
  };
  domainAge?: {
    checked: boolean;
    domain: string;
    createdDate?: string;
    ageInDays?: number;
    registrar?: string;
    isNew: boolean;
    riskLevel: "low" | "medium" | "high";
    error?: string;
  };
  sslCertificate?: {
    checked: boolean;
    valid: boolean;
    issuer?: string;
    subject?: string;
    validFrom?: string;
    validTo?: string;
    daysUntilExpiry?: number;
    isExpired: boolean;
    isEV: boolean;
    isSelfSigned: boolean;
    riskLevel: "low" | "medium" | "high" | "critical";
    error?: string;
  };
  phishTank?: { checked: boolean; isPhishing: boolean | null };
  urlhaus?: { checked: boolean; isMalware: boolean | null };
  checkedAt: string;
};

type PhoneCheckResult = {
  checked: boolean;
  number: string;
  formatted?: string;
  countryCode?: string;
  countryName?: string;
  lineType?: string;
  isValid: boolean;
  riskIndicators: string[];
  riskLevel: "low" | "medium" | "high";
};

type QRAnalysisResult = {
  content: string;
  contentType: "url" | "text" | "phone" | "email" | "wifi" | "vcard" | "unknown";
  isSuspicious: boolean;
  riskLevel: "low" | "medium" | "high";
  warnings: string[];
  extractedData?: {
    url?: string;
    phone?: string;
    email?: string;
    ssid?: string;
  };
};

type DeepfakeEducation = {
  contentType: "image" | "video" | "audio" | "text";
  riskIndicators: {
    indicator: string;
    severity: "low" | "medium" | "high";
    explanation: string;
  }[];
  overallRisk: "low" | "medium" | "high";
  educationalTips: string[];
};

export function AdvancedScan() {
  const [activeTab, setActiveTab] = useState("url");
  
  // URL scan state
  const [urlInput, setUrlInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ComprehensiveScanResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  
  // Phone check state
  const [phoneInput, setPhoneInput] = useState("");
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [phoneResult, setPhoneResult] = useState<PhoneCheckResult | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  
  // Image/OCR state
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [extractedText, setExtractedText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // QR Code state
  const [isProcessingQR, setIsProcessingQR] = useState(false);
  const [qrResult, setQRResult] = useState<QRAnalysisResult | null>(null);
  const qrFileInputRef = useRef<HTMLInputElement>(null);
  
  // Deepfake education state
  const [deepfakeType, setDeepfakeType] = useState<"video" | "audio" | "image" | "text">("video");
  const [deepfakeEducation, setDeepfakeEducation] = useState<DeepfakeEducation | null>(null);
  const [isLoadingDeepfake, setIsLoadingDeepfake] = useState(false);

  // Comprehensive URL scan
  const handleUrlScan = async () => {
    if (!urlInput.trim()) return;
    
    setIsScanning(true);
    setScanResult(null);
    setScanError(null);
    
    try {
      let url = urlInput.trim();
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      
      const response = await apiRequest("POST", "/api/security/comprehensive-scan", { url });
      const data = await response.json();
      
      if (data.success) {
        setScanResult(data);
      } else {
        setScanError(data.error || "Failed to scan URL. Please try again.");
      }
    } catch (error) {
      console.error("Scan error:", error);
      setScanError("Unable to complete scan. Please check your connection and try again.");
    } finally {
      setIsScanning(false);
    }
  };

  // Phone number check
  const handlePhoneCheck = async () => {
    if (!phoneInput.trim()) return;
    
    setIsCheckingPhone(true);
    setPhoneResult(null);
    setPhoneError(null);
    
    try {
      const response = await apiRequest("POST", "/api/security/check-phone", { phone: phoneInput.trim() });
      const data = await response.json();
      
      if (data.success) {
        setPhoneResult(data);
      } else {
        setPhoneError(data.error || "Failed to analyze phone number. Please try again.");
      }
    } catch (error) {
      console.error("Phone check error:", error);
      setPhoneError("Unable to check phone number. Please try again.");
    } finally {
      setIsCheckingPhone(false);
    }
  };

  // Image OCR processing
  const handleImageUpload = useCallback(async (file: File) => {
    setIsProcessingImage(true);
    setOcrProgress(0);
    setExtractedText("");
    
    try {
      const worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setOcrProgress(Math.round(m.progress * 100));
          }
        },
      });
      
      const imageUrl = URL.createObjectURL(file);
      const { data: { text } } = await worker.recognize(imageUrl);
      
      setExtractedText(text);
      URL.revokeObjectURL(imageUrl);
      await worker.terminate();
    } catch (error) {
      console.error("OCR error:", error);
      setExtractedText("Failed to extract text from image. Please try again.");
    } finally {
      setIsProcessingImage(false);
    }
  }, []);

  // QR Code processing
  const handleQRUpload = useCallback(async (file: File) => {
    setIsProcessingQR(true);
    setQRResult(null);
    
    try {
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = imageUrl;
      });
      
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }
      
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      URL.revokeObjectURL(imageUrl);
      
      if (code) {
        // Send to backend for analysis
        const response = await apiRequest("POST", "/api/security/analyze-qr", { content: code.data });
        const data = await response.json();
        
        if (data.success) {
          setQRResult(data);
        }
      } else {
        setQRResult({
          content: "",
          contentType: "unknown",
          isSuspicious: false,
          riskLevel: "low",
          warnings: ["No QR code found in the image. Please upload a clear image of a QR code."]
        });
      }
    } catch (error) {
      console.error("QR processing error:", error);
    } finally {
      setIsProcessingQR(false);
    }
  }, []);

  // Load deepfake education
  const loadDeepfakeEducation = async (type: "video" | "audio" | "image" | "text") => {
    setDeepfakeType(type);
    setIsLoadingDeepfake(true);
    
    try {
      const response = await fetch(`/api/security/deepfake-education/${type}`);
      const data = await response.json();
      
      if (data.success) {
        setDeepfakeEducation(data);
      }
    } catch (error) {
      console.error("Deepfake education error:", error);
    } finally {
      setIsLoadingDeepfake(false);
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case "safe": return "bg-green-500";
      case "low": return "bg-blue-500";
      case "medium": return "bg-yellow-500";
      case "high": return "bg-orange-500";
      case "critical": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "text-green-500";
      case "B": return "text-blue-500";
      case "C": return "text-yellow-500";
      case "D": return "text-orange-500";
      case "F": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  return (
    <Card className="w-full" data-testid="card-advanced-scan">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-primary" />
          Advanced Security Scanner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="url" className="flex items-center gap-1" data-testid="tab-url-scan">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">URL Scan</span>
            </TabsTrigger>
            <TabsTrigger value="phone" className="flex items-center gap-1" data-testid="tab-phone-check">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Phone</span>
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-1" data-testid="tab-image-ocr">
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Image</span>
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center gap-1" data-testid="tab-qr-scan">
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">QR Code</span>
            </TabsTrigger>
            <TabsTrigger value="deepfake" className="flex items-center gap-1" data-testid="tab-deepfake">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">AI/Deepfake</span>
            </TabsTrigger>
          </TabsList>

          {/* URL Comprehensive Scan Tab */}
          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter URL to scan</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="https://example.com"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUrlScan()}
                  disabled={isScanning}
                  data-testid="input-url-scan"
                />
                <Button onClick={handleUrlScan} disabled={isScanning || !urlInput.trim()} data-testid="button-url-scan">
                  {isScanning ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <FileSearch className="w-4 h-4 mr-2" />
                      Scan
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Comprehensive scan includes: Google Safe Browsing, VirusTotal, domain age, SSL certificate, PhishTank, and URLhaus checks.
              </p>
            </div>

            {scanError && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm" data-testid="text-scan-error">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                <span className="text-destructive">{scanError}</span>
              </div>
            )}

            {scanResult && (
              <div className="space-y-4 border rounded-lg p-4">
                {/* Trust Score Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Trust Score</h3>
                    <p className="text-sm text-muted-foreground">{scanResult.trustScore.summary}</p>
                  </div>
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getGradeColor(scanResult.trustScore.grade)}`}>
                      {scanResult.trustScore.grade}
                    </div>
                    <div className="text-2xl font-semibold">{scanResult.trustScore.score}/100</div>
                  </div>
                </div>

                {/* Overall Threat Level */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Overall Threat Level:</span>
                  <Badge className={`${getThreatLevelColor(scanResult.overallThreatLevel)} text-white`}>
                    {scanResult.overallThreatLevel.toUpperCase()}
                  </Badge>
                </div>

                {/* Score Factors */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Security Factors</h4>
                  <div className="space-y-2">
                    {scanResult.trustScore.factors.map((factor, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            {factor.status === "good" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                            {factor.status === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                            {factor.status === "danger" && <XCircle className="w-4 h-4 text-red-500" />}
                            <span>{factor.name}</span>
                          </div>
                          <span className="text-muted-foreground">{factor.score}/{factor.maxScore}</span>
                        </div>
                        <Progress value={(factor.score / factor.maxScore) * 100} className="h-1.5" />
                        <p className="text-xs text-muted-foreground">{factor.details}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* SSL Certificate */}
                  {scanResult.sslCertificate?.checked && (
                    <div className={`p-3 rounded-lg border ${
                      scanResult.sslCertificate.valid ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30"
                    }`}>
                      <div className="flex items-center gap-2 font-medium mb-1">
                        <Lock className="w-4 h-4" />
                        SSL Certificate
                      </div>
                      <div className="text-sm space-y-1">
                        {scanResult.sslCertificate.valid ? (
                          <>
                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                              <CheckCircle2 className="w-3 h-3" /> Valid
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Issuer: {scanResult.sslCertificate.issuer}
                            </div>
                            {scanResult.sslCertificate.daysUntilExpiry !== undefined && (
                              <div className="text-xs text-muted-foreground">
                                Expires in {scanResult.sslCertificate.daysUntilExpiry} days
                              </div>
                            )}
                            {scanResult.sslCertificate.isEV && (
                              <Badge variant="secondary" className="text-xs">Extended Validation</Badge>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                            <XCircle className="w-3 h-3" /> 
                            {scanResult.sslCertificate.error || "Invalid certificate"}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Domain Age */}
                  {scanResult.domainAge?.checked && (
                    <div className={`p-3 rounded-lg border ${
                      scanResult.domainAge.riskLevel === "low" ? "bg-green-50 dark:bg-green-950/30" :
                      scanResult.domainAge.riskLevel === "medium" ? "bg-yellow-50 dark:bg-yellow-950/30" :
                      "bg-red-50 dark:bg-red-950/30"
                    }`}>
                      <div className="flex items-center gap-2 font-medium mb-1">
                        <Clock className="w-4 h-4" />
                        Domain Age
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="font-medium">{scanResult.domainAge.domain}</div>
                        {scanResult.domainAge.ageInDays !== undefined ? (
                          <>
                            <div className={`text-sm ${scanResult.domainAge.isNew ? "text-orange-600 dark:text-orange-400" : ""}`}>
                              {scanResult.domainAge.ageInDays < 365 
                                ? `${scanResult.domainAge.ageInDays} days old`
                                : `${Math.floor(scanResult.domainAge.ageInDays / 365)} year(s) old`}
                              {scanResult.domainAge.isNew && " (NEW)"}
                            </div>
                            {scanResult.domainAge.registrar && (
                              <div className="text-xs text-muted-foreground">
                                Registrar: {scanResult.domainAge.registrar}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-xs text-muted-foreground">{scanResult.domainAge.error || "Age unavailable"}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Google Safe Browsing */}
                  {scanResult.googleSafeBrowsing && (
                    <div className={`p-3 rounded-lg border ${
                      scanResult.googleSafeBrowsing.isThreat ? "bg-red-50 dark:bg-red-950/30" : 
                      scanResult.googleSafeBrowsing.checked ? "bg-green-50 dark:bg-green-950/30" : "bg-gray-50 dark:bg-gray-800"
                    }`}>
                      <div className="flex items-center gap-2 font-medium mb-1">
                        <Shield className="w-4 h-4" />
                        Google Safe Browsing
                      </div>
                      <div className="text-sm">
                        {scanResult.googleSafeBrowsing.error ? (
                          <span className="text-muted-foreground">{scanResult.googleSafeBrowsing.error}</span>
                        ) : scanResult.googleSafeBrowsing.isThreat ? (
                          <div className="text-red-600 dark:text-red-400">
                            <XCircle className="w-3 h-3 inline mr-1" />
                            Threats: {scanResult.googleSafeBrowsing.threats.join(", ")}
                          </div>
                        ) : (
                          <div className="text-green-600 dark:text-green-400">
                            <CheckCircle2 className="w-3 h-3 inline mr-1" />
                            No threats detected
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* VirusTotal */}
                  {scanResult.virusTotal && (
                    <div className={`p-3 rounded-lg border ${
                      (scanResult.virusTotal.positives ?? 0) > 0 ? "bg-red-50 dark:bg-red-950/30" : 
                      scanResult.virusTotal.checked ? "bg-green-50 dark:bg-green-950/30" : "bg-gray-50 dark:bg-gray-800"
                    }`}>
                      <div className="flex items-center gap-2 font-medium mb-1">
                        <Server className="w-4 h-4" />
                        VirusTotal
                      </div>
                      <div className="text-sm">
                        {scanResult.virusTotal.error ? (
                          <span className="text-muted-foreground">{scanResult.virusTotal.error}</span>
                        ) : scanResult.virusTotal.total > 0 ? (
                          <>
                            <div className={scanResult.virusTotal.positives > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}>
                              {scanResult.virusTotal.positives}/{scanResult.virusTotal.total} engines detected threats
                            </div>
                            {scanResult.virusTotal.permalink && (
                              <a 
                                href={scanResult.virusTotal.permalink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-primary flex items-center gap-1 mt-1"
                              >
                                View full report <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </>
                        ) : (
                          <span className="text-muted-foreground">Scan pending</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Phone Check Tab */}
          <TabsContent value="phone" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter phone number to check</label>
              <div className="flex gap-2">
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePhoneCheck()}
                  disabled={isCheckingPhone}
                  data-testid="input-phone-check"
                />
                <Button onClick={handlePhoneCheck} disabled={isCheckingPhone || !phoneInput.trim()} data-testid="button-phone-check">
                  {isCheckingPhone ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Phone className="w-4 h-4 mr-2" />
                      Check
                    </>
                  )}
                </Button>
              </div>
            </div>

            {phoneError && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm" data-testid="text-phone-error">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                <span className="text-destructive">{phoneError}</span>
              </div>
            )}

            {phoneResult && (
              <div className={`p-4 rounded-lg border ${
                phoneResult.riskLevel === "low" ? "bg-green-50 dark:bg-green-950/30" :
                phoneResult.riskLevel === "medium" ? "bg-yellow-50 dark:bg-yellow-950/30" :
                "bg-red-50 dark:bg-red-950/30"
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Phone Analysis</h4>
                  <Badge className={`${
                    phoneResult.riskLevel === "low" ? "bg-green-500" :
                    phoneResult.riskLevel === "medium" ? "bg-yellow-500" :
                    "bg-red-500"
                  } text-white`}>
                    {phoneResult.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Number: </span>
                    {phoneResult.formatted || phoneResult.number}
                  </div>
                  {phoneResult.countryName && (
                    <div>
                      <span className="font-medium">Location: </span>
                      {phoneResult.countryName} ({phoneResult.countryCode})
                    </div>
                  )}
                  {phoneResult.lineType && (
                    <div>
                      <span className="font-medium">Type: </span>
                      {phoneResult.lineType}
                    </div>
                  )}
                  
                  {phoneResult.riskIndicators.length > 0 && (
                    <div className="mt-3">
                      <span className="font-medium">Risk Indicators:</span>
                      <ul className="mt-1 space-y-1">
                        {phoneResult.riskIndicators.map((indicator, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                            <span>{indicator}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Image OCR Tab */}
          <TabsContent value="image" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload screenshot or image</label>
              <p className="text-xs text-muted-foreground">
                Upload a screenshot of a suspicious message, email, or text. We'll extract the text and analyze it.
              </p>
              
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingImage}
                  data-testid="button-upload-image"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              </div>
            </div>

            {isProcessingImage && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Extracting text from image...</span>
                </div>
                <Progress value={ocrProgress} />
              </div>
            )}

            {extractedText && !isProcessingImage && (
              <div className="space-y-3">
                <h4 className="font-medium">Extracted Text</h4>
                <div className="p-3 bg-muted rounded-lg max-h-48 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap">{extractedText}</pre>
                </div>
                <p className="text-xs text-muted-foreground">
                  Copy this text to the main Scam Checker tool for detailed analysis.
                </p>
              </div>
            )}
          </TabsContent>

          {/* QR Code Tab */}
          <TabsContent value="qr" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload QR code image</label>
              <p className="text-xs text-muted-foreground">
                Upload an image of a QR code to see what it contains before scanning it with your phone.
              </p>
              
              <input
                type="file"
                ref={qrFileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleQRUpload(file);
                }}
              />
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => qrFileInputRef.current?.click()}
                disabled={isProcessingQR}
                data-testid="button-upload-qr"
              >
                {isProcessingQR ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <QrCode className="w-4 h-4 mr-2" />
                )}
                Upload QR Code Image
              </Button>
            </div>

            {qrResult && (
              <div className={`p-4 rounded-lg border ${
                qrResult.riskLevel === "low" ? "bg-green-50 dark:bg-green-950/30" :
                qrResult.riskLevel === "medium" ? "bg-yellow-50 dark:bg-yellow-950/30" :
                "bg-red-50 dark:bg-red-950/30"
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">QR Code Analysis</h4>
                  <Badge className={`${
                    qrResult.riskLevel === "low" ? "bg-green-500" :
                    qrResult.riskLevel === "medium" ? "bg-yellow-500" :
                    "bg-red-500"
                  } text-white`}>
                    {qrResult.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Content Type: </span>
                    <Badge variant="secondary">{qrResult.contentType.toUpperCase()}</Badge>
                  </div>
                  
                  {qrResult.content && (
                    <div>
                      <span className="font-medium">Content: </span>
                      <code className="text-xs bg-muted px-1 py-0.5 rounded break-all">
                        {qrResult.content.length > 100 ? qrResult.content.slice(0, 100) + "..." : qrResult.content}
                      </code>
                    </div>
                  )}
                  
                  {qrResult.warnings.length > 0 && (
                    <div className="mt-3">
                      <span className="font-medium">Warnings:</span>
                      <ul className="mt-1 space-y-1">
                        {qrResult.warnings.map((warning, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {qrResult.extractedData?.url && (
                    <div className="mt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setUrlInput(qrResult.extractedData!.url!);
                          setActiveTab("url");
                        }}
                      >
                        Scan this URL for threats
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Deepfake Education Tab */}
          <TabsContent value="deepfake" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Learn about AI-powered threats</label>
              <p className="text-xs text-muted-foreground">
                Select a content type to learn how to identify deepfakes and AI-generated scams.
              </p>
              
              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant={deepfakeType === "video" ? "default" : "outline"}
                  onClick={() => loadDeepfakeEducation("video")}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  data-testid="button-deepfake-video"
                >
                  <Video className="w-5 h-5" />
                  <span className="text-xs">Video</span>
                </Button>
                <Button
                  variant={deepfakeType === "audio" ? "default" : "outline"}
                  onClick={() => loadDeepfakeEducation("audio")}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  data-testid="button-deepfake-audio"
                >
                  <Mic className="w-5 h-5" />
                  <span className="text-xs">Audio</span>
                </Button>
                <Button
                  variant={deepfakeType === "image" ? "default" : "outline"}
                  onClick={() => loadDeepfakeEducation("image")}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  data-testid="button-deepfake-image"
                >
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-xs">Image</span>
                </Button>
                <Button
                  variant={deepfakeType === "text" ? "default" : "outline"}
                  onClick={() => loadDeepfakeEducation("text")}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  data-testid="button-deepfake-text"
                >
                  <FileText className="w-5 h-5" />
                  <span className="text-xs">Text</span>
                </Button>
              </div>
            </div>

            {isLoadingDeepfake && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            )}

            {deepfakeEducation && !isLoadingDeepfake && (
              <div className="space-y-4">
                {/* Risk Indicators */}
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    Common Scam Patterns
                  </h4>
                  <div className="space-y-2">
                    {deepfakeEducation.riskIndicators.map((indicator, idx) => (
                      <div key={idx} className={`p-3 rounded-lg border ${
                        indicator.severity === "high" ? "bg-red-50 dark:bg-red-950/30 border-red-200" :
                        indicator.severity === "medium" ? "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200" :
                        "bg-blue-50 dark:bg-blue-950/30 border-blue-200"
                      }`}>
                        <div className="font-medium text-sm">{indicator.indicator}</div>
                        <div className="text-xs text-muted-foreground mt-1">{indicator.explanation}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Educational Tips */}
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    How to Identify {deepfakeType.charAt(0).toUpperCase() + deepfakeType.slice(1)} Deepfakes
                  </h4>
                  <ul className="space-y-2">
                    {deepfakeEducation.educationalTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
          <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p>
              These advanced scanning tools use multiple threat intelligence sources to provide comprehensive security analysis. 
              Some features require API keys to be configured for full functionality.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
