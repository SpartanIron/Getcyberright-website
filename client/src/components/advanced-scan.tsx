import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Phone,
  Image as ImageIcon,
  QrCode,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Upload,
  ShieldAlert,
  Video,
  Mic,
  FileText,
  Eye,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

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
  const [activeTab, setActiveTab] = useState("phone");
  
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
      const { createWorker } = await import("tesseract.js");
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
      
      const jsQRModule = await import("jsqr");
      const jsQR = jsQRModule.default;
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      URL.revokeObjectURL(imageUrl);
      
      if (code) {
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
          <TabsList className="grid w-full grid-cols-4 mb-4">
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
                  Copy this text to the main GCR Scam Guard tool for detailed analysis.
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
                      <span className="font-mono text-xs break-all">{qrResult.content}</span>
                    </div>
                  )}
                  
                  {qrResult.warnings.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {qrResult.warnings.map((warning, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                          <span>{warning}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* AI/Deepfake Education Tab */}
          <TabsContent value="deepfake" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Learn to spot AI-generated content</label>
              <p className="text-xs text-muted-foreground">
                Select a content type to learn how to identify deepfakes and AI-generated content.
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={deepfakeType === "video" ? "default" : "outline"}
                  onClick={() => loadDeepfakeEducation("video")}
                  disabled={isLoadingDeepfake}
                  data-testid="button-deepfake-video"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Video
                </Button>
                <Button
                  variant={deepfakeType === "audio" ? "default" : "outline"}
                  onClick={() => loadDeepfakeEducation("audio")}
                  disabled={isLoadingDeepfake}
                  data-testid="button-deepfake-audio"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Audio
                </Button>
                <Button
                  variant={deepfakeType === "image" ? "default" : "outline"}
                  onClick={() => loadDeepfakeEducation("image")}
                  disabled={isLoadingDeepfake}
                  data-testid="button-deepfake-image"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Image
                </Button>
                <Button
                  variant={deepfakeType === "text" ? "default" : "outline"}
                  onClick={() => loadDeepfakeEducation("text")}
                  disabled={isLoadingDeepfake}
                  data-testid="button-deepfake-text"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Text
                </Button>
              </div>
            </div>

            {isLoadingDeepfake && (
              <div className="flex items-center gap-2 justify-center py-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading education content...</span>
              </div>
            )}

            {deepfakeEducation && !isLoadingDeepfake && (
              <div className="space-y-4">
                <div className={`p-3 rounded-lg border ${
                  deepfakeEducation.overallRisk === "low" ? "bg-green-50 dark:bg-green-950/30" :
                  deepfakeEducation.overallRisk === "medium" ? "bg-yellow-50 dark:bg-yellow-950/30" :
                  "bg-red-50 dark:bg-red-950/30"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">
                      {deepfakeType.charAt(0).toUpperCase() + deepfakeType.slice(1)} Deepfake Detection
                    </h4>
                    <Badge className={`${
                      deepfakeEducation.overallRisk === "low" ? "bg-green-500" :
                      deepfakeEducation.overallRisk === "medium" ? "bg-yellow-500" :
                      "bg-red-500"
                    } text-white`}>
                      {deepfakeEducation.overallRisk.toUpperCase()} RISK
                    </Badge>
                  </div>
                </div>

                {deepfakeEducation.riskIndicators.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Warning Signs to Look For:</h4>
                    {deepfakeEducation.riskIndicators.map((indicator, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                        {indicator.severity === "high" ? (
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        ) : indicator.severity === "medium" ? (
                          <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-medium text-sm">{indicator.indicator}</span>
                          <p className="text-xs text-muted-foreground">{indicator.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {deepfakeEducation.educationalTips.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Tips:</h4>
                    <ul className="space-y-1">
                      {deepfakeEducation.educationalTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
