import { useState, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { SignupEncouragementBanner } from "@/components/signup-encouragement-banner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mic,
  Upload,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle,
  Shield,
  Volume2,
  FileAudio,
  Radio,
  Brain,
  Clock,
  Lightbulb,
  Phone,
  RefreshCw,
  Info,
  LogIn,
  Crown,
  Loader2
} from "lucide-react";

interface AnalysisResult {
  isDeepfake: boolean;
  confidence: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  indicators: {
    name: string;
    detected: boolean;
    description: string;
  }[];
  recommendation: string;
}

const deepfakeIndicators = [
  {
    id: "unnatural-pauses",
    name: "Unnatural Pauses",
    description: "AI-generated speech often has irregular pausing patterns",
    icon: Clock
  },
  {
    id: "breathing-patterns",
    name: "Missing Breathing",
    description: "Real humans breathe naturally; AI often forgets this",
    icon: Volume2
  },
  {
    id: "emotional-consistency",
    name: "Emotion Mismatch",
    description: "Voice emotion doesn't match the words being said",
    icon: Brain
  },
  {
    id: "background-noise",
    name: "Unusual Background",
    description: "Synthetic audio may have unnaturally clean or repeated background noise",
    icon: Radio
  },
  {
    id: "pitch-variations",
    name: "Robotic Pitch",
    description: "Limited pitch variation or unnatural intonation patterns",
    icon: Mic
  },
  {
    id: "clipping-artifacts",
    name: "Audio Artifacts",
    description: "Digital glitches, clicks, or processing artifacts",
    icon: FileAudio
  }
];

const protectionTips = [
  {
    title: "Establish a Family Codeword",
    description: "Create a secret phrase only your family knows. Ask for it when someone claims to be a relative in trouble.",
    priority: "essential"
  },
  {
    title: "Hang Up and Call Back",
    description: "If you receive a suspicious call, hang up and call the person directly using a number you know is correct.",
    priority: "essential"
  },
  {
    title: "Ask Personal Questions",
    description: "Ask questions only the real person would know: 'What did we have for dinner last Sunday?'",
    priority: "important"
  },
  {
    title: "Listen for Urgency",
    description: "Scammers create panic to prevent you from thinking clearly. Real emergencies can wait 2 minutes for verification.",
    priority: "important"
  },
  {
    title: "Limit Social Media Audio",
    description: "Reduce public audio/video of your voice online. Scammers need only 3 seconds to clone a voice.",
    priority: "helpful"
  },
  {
    title: "Trust Your Gut",
    description: "If something feels 'off' about a caller's voice or behavior, it probably is. Always verify.",
    priority: "essential"
  }
];

export function AudioDeepfakeDetector() {
  const [activeTab, setActiveTab] = useState("analyze");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const handleFileSelect = useCallback((file: File) => {
    if (file.type.startsWith("audio/") || file.name.endsWith(".mp3") || file.name.endsWith(".wav") || file.name.endsWith(".m4a")) {
      setSelectedFile(file);
      setAnalysisResult(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  // Helper function to generate demo results
  const generateDemoResults = () => {
    const isDeepfake = Math.random() > 0.6;
    const confidence = isDeepfake 
      ? 60 + Math.random() * 35 
      : 15 + Math.random() * 30;
    
    const indicators = [
      {
        name: "Unnatural Pauses",
        detected: isDeepfake && Math.random() > 0.4,
        description: "Irregular timing between words detected"
      },
      {
        name: "Breathing Patterns",
        detected: isDeepfake && Math.random() > 0.3,
        description: isDeepfake ? "Natural breathing sounds absent" : "Normal breathing detected"
      },
      {
        name: "Emotional Consistency",
        detected: isDeepfake && Math.random() > 0.5,
        description: isDeepfake ? "Emotional tone inconsistent with content" : "Emotions match speech content"
      },
      {
        name: "Background Noise",
        detected: isDeepfake && Math.random() > 0.6,
        description: isDeepfake ? "Unnaturally clean or synthetic background" : "Natural ambient noise present"
      },
      {
        name: "Pitch Variations",
        detected: isDeepfake && Math.random() > 0.4,
        description: isDeepfake ? "Limited natural pitch variation" : "Normal pitch dynamics"
      },
      {
        name: "Audio Artifacts",
        detected: isDeepfake && Math.random() > 0.7,
        description: isDeepfake ? "Digital processing artifacts detected" : "No synthetic artifacts found"
      }
    ];
    
    let riskLevel: "low" | "medium" | "high" | "critical";
    if (confidence >= 85) riskLevel = "critical";
    else if (confidence >= 65) riskLevel = "high";
    else if (confidence >= 40) riskLevel = "medium";
    else riskLevel = "low";
    
    const recommendation = isDeepfake
      ? "This audio shows signs of AI generation. Do NOT send money or share sensitive information based on this recording. Verify the caller's identity using a known phone number."
      : "This audio appears authentic, but always verify important requests through a separate communication channel.";
    
    return { isDeepfake, confidence, riskLevel, indicators, recommendation };
  };

  const analyzeAudio = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    setIsDemoMode(false);
    
    // If not authenticated, run in demo mode
    if (!isAuthenticated) {
      await new Promise(resolve => setTimeout(resolve, 2500));
      setIsDemoMode(true);
      const demoResult = generateDemoResults();
      setAnalysisResult(demoResult);
      setIsAnalyzing(false);
      return;
    }
    
    // Try to call the backend API
    try {
      const response = await fetch("/api/security/analyze-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type
        })
      });
      
      if (!response.ok) {
        throw new Error("Analysis failed");
      }
      
      const data = await response.json();
      // Backend returns { success, isSimulation, simulationNote, result: {...} }
      if (data.result) {
        setAnalysisResult({
          isDeepfake: data.result.isDeepfake,
          confidence: data.result.confidence,
          riskLevel: data.result.riskLevel,
          indicators: data.result.indicators.map((ind: any) => ({
            ...ind,
            description: ind.detected 
              ? "Marker detected in audio"
              : "No issues detected"
          })),
          recommendation: data.result.recommendation
        });
        // Mark as demo if backend says it's a simulation
        setIsDemoMode(!!data.isSimulation);
      }
    } catch (error: any) {
      // Fall back to demo on error
      setIsDemoMode(true);
      const demoResult = generateDemoResults();
      setAnalysisResult(demoResult);
    }
    
    setIsAnalyzing(false);
  };
  
  // Inline demo mode helper (for showing demo results inline)
  const runDemoAnalysis = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsDemoMode(true);
    const demoResult = generateDemoResults();
    setAnalysisResult(demoResult);
    setIsAnalyzing(false);
  };
  
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setIsPlaying(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical": return "text-red-600 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900";
      case "high": return "text-orange-600 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900";
      case "medium": return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900";
      default: return "text-green-600 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900";
    }
  };

  return (
    <Card className="w-full" data-testid="card-audio-deepfake">
      <CardHeader className="text-center pb-2">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-4">
          <Radio className="w-8 h-8 text-red-500" />
        </div>
        <CardTitle className="text-2xl">Voice Clone Detector</CardTitle>
        <CardDescription className="text-base max-w-lg mx-auto">
          Learn what AI-generated voice clones sound like and the warning signs to watch for.
          This educational demo shows what professional detection tools analyze.
        </CardDescription>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <Badge variant="secondary">
            <Shield className="w-3 h-3 mr-1" />
            Professional Plan
          </Badge>
          <Badge variant="outline" className="text-amber-600 border-amber-300">
            Educational Demo
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="analyze" className="gap-2" data-testid="tab-analyze">
              <Mic className="w-4 h-4" />
              Analyze
            </TabsTrigger>
            <TabsTrigger value="indicators" className="gap-2" data-testid="tab-indicators">
              <Brain className="w-4 h-4" />
              What We Check
            </TabsTrigger>
            <TabsTrigger value="protect" className="gap-2" data-testid="tab-protect">
              <Shield className="w-4 h-4" />
              Protect Yourself
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            {!selectedFile ? (
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragOver 
                    ? "border-primary bg-primary/5" 
                    : "border-muted-foreground/25 hover:border-primary/50"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                data-testid="dropzone-audio"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Upload Audio File</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop a voicemail, call recording, or audio message here
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,.mp3,.wav,.m4a,.ogg,.aac"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  data-testid="input-audio-file"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="button-select-file"
                >
                  <FileAudio className="w-4 h-4 mr-2" />
                  Select File
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Supports MP3, WAV, M4A, OGG, AAC (max 10MB)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileAudio className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{selectedFile.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={togglePlayback}
                        disabled={!selectedFile}
                        data-testid="button-play-audio"
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={resetAnalysis}
                        data-testid="button-reset-audio"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {selectedFile && (
                    <audio
                      ref={audioRef}
                      src={URL.createObjectURL(selectedFile)}
                      onEnded={() => setIsPlaying(false)}
                      className="hidden"
                    />
                  )}
                </div>

                {/* Non-authenticated users see login prompt */}
                {!isAuthenticated && !authLoading && !analysisResult && !isAnalyzing && selectedFile && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-3">
                        <LogIn className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium text-sm">Demo Mode Available</div>
                          <p className="text-xs text-muted-foreground">
                            Sign in for full analysis or try our demo
                          </p>
                        </div>
                      </div>
                      <Link href="/login">
                        <Button size="sm" variant="outline" data-testid="button-login-voice">
                          Sign In
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {!analysisResult && (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={analyzeAudio}
                    disabled={isAnalyzing}
                    data-testid="button-analyze-audio"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing Audio...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        {isAuthenticated ? "Analyze for AI Generation" : "Try Demo Analysis"}
                      </>
                    )}
                  </Button>
                )}

                {isAnalyzing && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Analyzing audio patterns...</span>
                      <span className="text-muted-foreground">Please wait</span>
                    </div>
                    <Progress value={65} className="h-2" />
                    <div className="text-xs text-muted-foreground text-center">
                      Checking for synthetic voice markers, breathing patterns, and artifacts
                    </div>
                  </div>
                )}

                {analysisResult && (
                  <div className="space-y-4">
                    {isDemoMode && (
                      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span className="text-sm text-amber-700 dark:text-amber-300">
                          Demo Mode: Results are simulated for educational purposes
                        </span>
                      </div>
                    )}
                    
                    <div className={`rounded-xl p-6 border ${getRiskColor(analysisResult.riskLevel)}`}>
                      <div className="flex items-start gap-4">
                        {analysisResult.isDeepfake ? (
                          <XCircle className="w-8 h-8 flex-shrink-0" />
                        ) : (
                          <CheckCircle className="w-8 h-8 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-bold text-lg">
                              {analysisResult.isDeepfake 
                                ? "Potential AI-Generated Audio Detected" 
                                : "Audio Appears Authentic"}
                            </h3>
                            <Badge variant={analysisResult.isDeepfake ? "destructive" : "secondary"}>
                              {analysisResult.riskLevel.toUpperCase()} RISK
                            </Badge>
                            {isDemoMode && (
                              <Badge variant="outline" className="text-amber-600 border-amber-300">
                                Demo
                              </Badge>
                            )}
                          </div>
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>AI Detection Confidence</span>
                              <span className="font-medium">{analysisResult.confidence.toFixed(1)}%</span>
                            </div>
                            <Progress value={analysisResult.confidence} className="h-2" />
                          </div>
                          <p className="text-sm">
                            {analysisResult.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <h4 className="font-semibold text-sm">Analysis Details</h4>
                      {analysisResult.indicators.map((indicator, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                          data-testid={`indicator-result-${idx}`}
                        >
                          {indicator.detected ? (
                            <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{indicator.name}</div>
                            <div className="text-xs text-muted-foreground">{indicator.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={resetAnalysis}
                      data-testid="button-analyze-another"
                    >
                      Analyze Another File
                    </Button>

                    <SignupEncouragementBanner
                      toolName="deepfake-detector"
                      show={!!analysisResult}
                      contextMessage="Track your voice analysis history?"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm text-amber-800 dark:text-amber-200 mb-1">
                    Educational Demonstration
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    This is a simulation showing how AI-based voice detection works. 
                    Results are generated for educational purposes. For production-grade 
                    detection, specialized APIs like Resemble AI Detect would be integrated.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm text-blue-800 dark:text-blue-200 mb-1">
                    How Real Detection Works
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Production AI detection analyzes audio for patterns common in synthetic speech: 
                    unnatural pauses, missing breathing sounds, robotic intonation, 
                    and digital artifacts.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="indicators" className="space-y-4">
            <p className="text-muted-foreground mb-4">
              AI-generated voice clones often have subtle markers that our system can detect:
            </p>

            <div className="grid gap-4">
              {deepfakeIndicators.map((indicator) => (
                <div
                  key={indicator.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card"
                  data-testid={`indicator-info-${indicator.id}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <indicator.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">{indicator.name}</div>
                    <p className="text-sm text-muted-foreground">
                      {indicator.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-4 mt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm text-amber-800 dark:text-amber-200 mb-1">
                    Important Limitation
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    AI detection is not 100% accurate. The most sophisticated deepfakes can 
                    fool detection systems. Always verify important requests through a 
                    separate communication channel, regardless of analysis results.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="protect" className="space-y-4">
            <div className="flex items-center gap-3 mb-4 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900">
              <Phone className="w-6 h-6 text-red-600" />
              <div>
                <div className="font-semibold text-red-800 dark:text-red-200">$200M+ Lost in Q1 2025</div>
                <div className="text-sm text-red-700 dark:text-red-300">
                  Voice cloning scams are exploding. Learn to protect yourself.
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {protectionTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card"
                  data-testid={`protection-tip-${idx}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    tip.priority === "essential" 
                      ? "bg-red-100 dark:bg-red-900/30" 
                      : tip.priority === "important"
                      ? "bg-orange-100 dark:bg-orange-900/30"
                      : "bg-blue-100 dark:bg-blue-900/30"
                  }`}>
                    {tip.priority === "essential" ? (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    ) : tip.priority === "important" ? (
                      <Shield className="w-4 h-4 text-orange-600" />
                    ) : (
                      <Lightbulb className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{tip.title}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] ${
                          tip.priority === "essential" ? "text-red-600 border-red-300" :
                          tip.priority === "important" ? "text-orange-600 border-orange-300" :
                          "text-blue-600 border-blue-300"
                        }`}
                      >
                        {tip.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tip.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-6">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-primary" />
                <div className="font-medium">The Golden Rule</div>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>Never send money, gift cards, or sensitive information based solely on a phone call.</strong>
                {" "}Always verify through a separate channel - even if the voice sounds exactly like 
                someone you know.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
