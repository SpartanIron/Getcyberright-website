import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Send, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Link2,
  Phone,
  MessageSquare,
  History,
  Share2,
  RotateCcw,
  ChevronDown,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import deziLogo from "@assets/Logo_A_1768679989734.png";
import { apiRequest } from "@/lib/queryClient";
import { TechPatternBg } from "./tech-pattern-bg";

type InputType = "url" | "phone" | "email" | "description";
type RiskLevel = "safe" | "suspicious" | "dangerous" | "unknown";

interface AnimatedDeziLogoProps {
  size?: "sm" | "md";
  isAnalyzing?: boolean;
  hasResult?: boolean;
  riskLevel?: RiskLevel | null;
}

function AnimatedDeziLogo({ size = "md", isAnalyzing = false, hasResult = false, riskLevel = null }: AnimatedDeziLogoProps) {
  const sizeClasses = size === "sm" ? "w-10 h-10" : "w-12 h-12 md:w-14 md:h-14";
  
  const glowColor = riskLevel === "safe" ? "rgba(34, 197, 94, 0.4)" 
    : riskLevel === "suspicious" ? "rgba(234, 179, 8, 0.4)"
    : riskLevel === "dangerous" ? "rgba(239, 68, 68, 0.4)"
    : "rgba(20, 184, 166, 0.3)";

  return (
    <motion.div
      className="relative"
      animate={
        isAnalyzing 
          ? { rotate: [0, 5, -5, 0] }
          : hasResult 
            ? { scale: [1, 1.15, 1], y: [0, -4, 0] }
            : { scale: [1, 1.02, 1] }
      }
      transition={
        isAnalyzing
          ? { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
          : hasResult
            ? { duration: 0.4, ease: "easeOut" }
            : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <motion.div
        className="absolute inset-0 rounded-full blur-md"
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 2.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{ backgroundColor: glowColor }}
      />
      <img 
        src={deziLogo} 
        alt="Dezi" 
        className={`${sizeClasses} relative z-10`}
      />
    </motion.div>
  );
}

interface AnalysisResult {
  type: InputType;
  input: string;
  riskLevel: RiskLevel;
  summary: string;
  details: string[];
  recommendations: string[];
  timestamp: Date;
  id: string;
}

interface ScanHistoryItem {
  id: string;
  type: InputType;
  input: string;
  riskLevel: RiskLevel;
  summary: string;
  timestamp: string;
}

function detectInputType(input: string): InputType {
  const trimmed = input.trim();
  
  const urlPattern = /^(https?:\/\/|www\.)|(\.[a-z]{2,}\/)/i;
  if (urlPattern.test(trimmed)) {
    return "url";
  }
  
  const phonePattern = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{3,4}[-\s\.]?[0-9]{3,6}$/;
  const cleanedPhone = trimmed.replace(/[\s\-\(\)\.]/g, "");
  if (phonePattern.test(trimmed) || (cleanedPhone.length >= 10 && cleanedPhone.length <= 15 && /^\+?\d+$/.test(cleanedPhone))) {
    return "phone";
  }
  
  const emailHeaderPattern = /^(Received:|From:|To:|Subject:|Date:|Message-ID:|DKIM|SPF|Return-Path)/im;
  if (emailHeaderPattern.test(trimmed)) {
    return "email";
  }
  
  return "description";
}

function getRiskConfig(level: RiskLevel) {
  switch (level) {
    case "safe":
      return {
        color: "text-green-600",
        bg: "bg-green-50 dark:bg-green-900/20",
        border: "border-green-200 dark:border-green-800",
        icon: CheckCircle,
        label: "Looks Safe"
      };
    case "suspicious":
      return {
        color: "text-yellow-600",
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        border: "border-yellow-200 dark:border-yellow-800",
        icon: AlertTriangle,
        label: "Suspicious"
      };
    case "dangerous":
      return {
        color: "text-red-600",
        bg: "bg-red-50 dark:bg-red-900/20",
        border: "border-red-200 dark:border-red-800",
        icon: XCircle,
        label: "Dangerous"
      };
    default:
      return {
        color: "text-slate-600",
        bg: "bg-slate-50 dark:bg-slate-800",
        border: "border-slate-200 dark:border-slate-700",
        icon: Shield,
        label: "Unknown"
      };
  }
}

function getTypeIcon(type: InputType) {
  switch (type) {
    case "url": return Link2;
    case "phone": return Phone;
    case "email": return Mail;
    default: return MessageSquare;
  }
}

function normalizeRiskLevel(result: any, type: InputType): RiskLevel {
  if (type === "url" || type === "phone") {
    const level = result.riskLevel?.toLowerCase();
    if (level === "safe" || level === "low") return "safe";
    if (level === "medium" || level === "suspicious") return "suspicious";
    if (level === "high" || level === "critical" || level === "dangerous") return "dangerous";
    return result.isSuspicious ? "suspicious" : "safe";
  }
  
  if (type === "email") {
    const level = result.riskLevel?.toLowerCase();
    if (level === "safe") return "safe";
    if (level === "suspicious") return "suspicious";
    if (level === "dangerous") return "dangerous";
    return "unknown";
  }
  
  const verdict = result.verdict?.toLowerCase();
  if (verdict === "safe") return "safe";
  if (verdict === "suspicious") return "suspicious";
  if (verdict === "likely_scam" || verdict === "scam") return "dangerous";
  return "unknown";
}

function generateResultId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function getScanHistory(): ScanHistoryItem[] {
  try {
    const stored = localStorage.getItem("scanHistory");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveScanHistory(item: ScanHistoryItem) {
  try {
    const history = getScanHistory();
    const updated = [item, ...history.filter(h => h.id !== item.id)].slice(0, 20);
    localStorage.setItem("scanHistory", JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save scan history:", e);
  }
}

interface DeziHeroProps {
  compact?: boolean;
}

export function DeziHero({ compact = false }: DeziHeroProps) {
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [detectedType, setDetectedType] = useState<InputType | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setHistory(getScanHistory());
  }, []);

  useEffect(() => {
    if (input.trim()) {
      setDetectedType(detectInputType(input));
    } else {
      setDetectedType(null);
    }
  }, [input]);

  const analyzeInput = async () => {
    if (!input.trim() || isAnalyzing) return;

    const inputType = detectInputType(input.trim());
    setIsAnalyzing(true);
    setResult(null);

    try {
      let response;
      let analysisResult: AnalysisResult;

      if (inputType === "url") {
        response = await apiRequest("/api/scam-check/url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: input.trim() })
        });
        
        analysisResult = {
          type: "url",
          input: input.trim(),
          riskLevel: normalizeRiskLevel(response, "url"),
          summary: response.isSuspicious 
            ? "This link shows warning signs" 
            : "This link appears to be safe",
          details: response.warnings || [],
          recommendations: response.recommendations || [],
          timestamp: new Date(),
          id: generateResultId()
        };
      } else if (inputType === "phone") {
        response = await apiRequest("/api/scam-check/phone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: input.trim() })
        });
        
        analysisResult = {
          type: "phone",
          input: input.trim(),
          riskLevel: normalizeRiskLevel(response, "phone"),
          summary: response.isSuspicious 
            ? "This phone number shows suspicious patterns" 
            : "No obvious red flags with this number",
          details: response.warnings || [],
          recommendations: response.recommendations || [],
          timestamp: new Date(),
          id: generateResultId()
        };
      } else if (inputType === "email") {
        response = await apiRequest("/api/scam-check/email-headers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ headers: input.trim() })
        });
        
        analysisResult = {
          type: "email",
          input: input.trim().substring(0, 100) + "...",
          riskLevel: normalizeRiskLevel(response, "email"),
          summary: response.summary || "Email header analysis complete",
          details: response.redFlags || [],
          recommendations: response.recommendations || [],
          timestamp: new Date(),
          id: generateResultId()
        };
      } else {
        response = await apiRequest("/api/scam-check/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            description: input.trim(),
            scamType: "other"
          })
        });
        
        analysisResult = {
          type: "description",
          input: input.trim().substring(0, 100) + (input.trim().length > 100 ? "..." : ""),
          riskLevel: normalizeRiskLevel(response, "description"),
          summary: response.explanation || "Analysis complete",
          details: response.redFlags || [],
          recommendations: response.recommendations || [],
          timestamp: new Date(),
          id: generateResultId()
        };
      }

      setResult(analysisResult);
      
      const historyItem: ScanHistoryItem = {
        id: analysisResult.id,
        type: analysisResult.type,
        input: analysisResult.input,
        riskLevel: analysisResult.riskLevel,
        summary: analysisResult.summary,
        timestamp: analysisResult.timestamp.toISOString()
      };
      saveScanHistory(historyItem);
      setHistory(getScanHistory());

    } catch (error) {
      console.error("Analysis error:", error);
      setResult({
        type: inputType,
        input: input.trim(),
        riskLevel: "unknown",
        summary: "Unable to complete analysis. Please try again.",
        details: [],
        recommendations: ["Try checking the input and submitting again"],
        timestamp: new Date(),
        id: generateResultId()
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      analyzeInput();
    }
  };

  const resetCheck = () => {
    setInput("");
    setResult(null);
    setDetectedType(null);
    inputRef.current?.focus();
  };

  const shareResult = async () => {
    if (!result) return;
    
    const shareText = `I checked "${result.input}" with GetCyberRight - Result: ${getRiskConfig(result.riskLevel).label}. Check suspicious links and messages free at getcyberright.com`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Scam Check Result",
          text: shareText,
          url: window.location.origin
        });
      } catch (e) {
        await navigator.clipboard.writeText(shareText);
      }
    } else {
      await navigator.clipboard.writeText(shareText);
    }
  };

  const loadFromHistory = (item: ScanHistoryItem) => {
    setInput(item.input);
    setShowHistory(false);
  };

  const riskConfig = result ? getRiskConfig(result.riskLevel) : null;
  const TypeIcon = detectedType ? getTypeIcon(detectedType) : MessageSquare;

  const renderInputCard = () => (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl">
      <CardContent className={compact ? "p-4" : "p-4 md:p-6"}>
        {compact && (
          <div className="flex items-center gap-3 mb-4">
            <AnimatedDeziLogo 
              size="sm" 
              isAnalyzing={isAnalyzing} 
              hasResult={!!result}
              riskLevel={result?.riskLevel}
            />
            <div>
              <span className="text-lg font-bold block">
                {history.length > 0 ? "Check something new" : "Ask Dezi"}
              </span>
              <span className="text-sm text-slate-400">
                {history.length > 0 ? `${history.length} previous checks` : "Your AI scam detector"}
              </span>
            </div>
          </div>
        )}
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste a suspicious link, phone number, email headers, or just tell me what happened..."
            className={`w-full ${compact ? "min-h-[80px]" : "min-h-[100px] md:min-h-[120px]"} p-4 pr-12 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg border-0 focus:ring-2 focus:ring-teal-500 resize-none text-base ${compact ? "" : "md:text-lg"} placeholder:text-slate-400`}
            disabled={isAnalyzing}
          />
          
          {detectedType && !isAnalyzing && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 text-xs">
                <TypeIcon className="w-3 h-3 mr-1" />
                {detectedType === "url" ? "Link" : 
                 detectedType === "phone" ? "Phone" : 
                 detectedType === "email" ? "Email" : "Message"}
              </Badge>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="text-slate-300 hover:text-white hover:bg-white/10"
            >
              <History className="w-4 h-4 mr-1" />
              <span className={compact ? "hidden" : "hidden sm:inline"}>History</span>
              {history.length > 0 && (
                <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                  {history.length}
                </span>
              )}
            </Button>
          </div>

          <Button
            onClick={analyzeInput}
            disabled={!input.trim() || isAnalyzing}
            size={compact ? "default" : "lg"}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-6"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 mr-2" />
                Check Now
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (compact) {
    return (
      <div className="text-white">
        {renderInputCard()}
        
        <AnimatePresence>
          {showHistory && history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 bg-white/5 rounded-lg p-4"
            >
              <p className="text-sm text-slate-400 mb-2">Recent checks:</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {history.slice(0, 5).map((item) => {
                  const ItemIcon = getTypeIcon(item.type);
                  const config = getRiskConfig(item.riskLevel);
                  return (
                    <button
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="w-full text-left p-2 rounded bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2"
                    >
                      <ItemIcon className="w-4 h-4 text-slate-400" />
                      <span className="text-sm truncate flex-1">{item.input}</span>
                      <Badge className={`${config.bg} ${config.color} text-xs`}>
                        {config.label}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4"
            >
              <Card className={`${riskConfig?.bg} ${riskConfig?.border} border`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {riskConfig && <riskConfig.icon className={`w-6 h-6 ${riskConfig.color} flex-shrink-0`} />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`${riskConfig?.bg} ${riskConfig?.color}`}>
                          {riskConfig?.label}
                        </Badge>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-sm">{result.summary}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={resetCheck} className="text-xs">
                      <RotateCcw className="w-3 h-3 mr-1" />
                      New Check
                    </Button>
                    <Button size="sm" variant="outline" onClick={shareResult} className="text-xs">
                      <Share2 className="w-3 h-3 mr-1" />
                      Share
                    </Button>
                    <Button size="sm" asChild className="text-xs bg-teal-600 hover:bg-teal-700">
                      <Link to="/scam-checker">Full Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <section className="relative bg-gradient-to-b from-slate-50 via-white to-teal-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
      {/* Circuit board pattern */}
      <TechPatternBg variant="circuit" />
      
      <div className="relative container mx-auto px-4 lg:px-8 py-12 md:py-20">
        <div className="max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <AnimatedDeziLogo 
                size="md" 
                isAnalyzing={isAnalyzing} 
                hasResult={!!result}
                riskLevel={result?.riskLevel}
              />
              <span className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
                {history.length > 0 ? "Welcome back!" : "Hi, I'm Dezi"}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-slate-900 dark:text-white">
              {history.length > 0 ? "Check something new?" : "Is this a scam?"}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl">
              {history.length > 0 
                ? `You've checked ${history.length} item${history.length > 1 ? 's' : ''} - check another below`
                : "Paste a link, phone number, or describe what happened"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <Card className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-2xl">
              <CardContent className="p-4 md:p-6">
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Paste a suspicious link, phone number, email headers, or just tell me what happened..."
                    className="w-full min-h-[100px] md:min-h-[120px] p-4 pr-12 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-base md:text-lg placeholder:text-slate-400"
                    disabled={isAnalyzing}
                  />
                  
                  {detectedType && !isAnalyzing && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 text-xs">
                        <TypeIcon className="w-3 h-3 mr-1" />
                        {detectedType === "url" ? "Link" : 
                         detectedType === "phone" ? "Phone" : 
                         detectedType === "email" ? "Email" : "Message"}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHistory(!showHistory)}
                      className="text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white hover:bg-teal-50 dark:hover:bg-white/10"
                    >
                      <History className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">History</span>
                      {history.length > 0 && (
                        <span className="ml-1 text-xs bg-teal-100 dark:bg-white/20 text-teal-700 dark:text-white px-1.5 py-0.5 rounded-full">
                          {history.length}
                        </span>
                      )}
                    </Button>
                  </div>

                  <Button
                    onClick={analyzeInput}
                    disabled={!input.trim() || isAnalyzing}
                    size="lg"
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold px-6 md:px-8 shadow-lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 mr-2" />
                        Check Now
                      </>
                    )}
                  </Button>
                </div>

                <AnimatePresence>
                  {showHistory && history.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 border-t border-slate-200 dark:border-white/10 pt-4"
                    >
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Recent checks:</p>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {history.slice(0, 5).map((item) => {
                          const itemConfig = getRiskConfig(item.riskLevel);
                          const ItemIcon = getTypeIcon(item.type);
                          return (
                            <button
                              key={item.id}
                              onClick={() => loadFromHistory(item)}
                              className="w-full text-left p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex items-center gap-3"
                            >
                              <ItemIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                              <span className="text-sm text-slate-700 dark:text-white truncate flex-1">
                                {item.input}
                              </span>
                              <Badge className={`${itemConfig.bg} ${itemConfig.color} text-xs flex-shrink-0`}>
                                {itemConfig.label}
                              </Badge>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            <AnimatePresence>
              {result && riskConfig && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6"
                >
                  <Card className={`${riskConfig.bg} ${riskConfig.border} border-2`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${riskConfig.bg}`}>
                          <riskConfig.icon className={`w-8 h-8 ${riskConfig.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className={`text-xl font-bold ${riskConfig.color}`}>
                              {riskConfig.label}
                            </h3>
                          </div>
                          <p className="text-slate-700 dark:text-slate-200 mb-4">
                            {result.summary}
                          </p>

                          {result.details.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                Warning signs:
                              </p>
                              <ul className="space-y-1">
                                {result.details.slice(0, 3).map((detail, i) => (
                                  <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {result.recommendations.length > 0 && (
                            <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg mb-4">
                              <p className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                                What to do:
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-300">
                                {result.recommendations[0]}
                              </p>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={resetCheck}
                              className="border-slate-300 dark:border-slate-600"
                            >
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Check Another
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={shareResult}
                              className="border-slate-300 dark:border-slate-600"
                            >
                              <Share2 className="w-4 h-4 mr-1" />
                              Share Warning
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-500 dark:text-slate-400"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-teal-500" />
              No Sign-up Needed
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-teal-500" />
              Instant Results
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-teal-500" />
              Expert Sources
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6"
          >
            <Link 
              to="/scam-checker" 
              className="inline-flex items-center text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300 text-sm font-medium"
            >
              Need more options? Use advanced Scam Checker
              <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
