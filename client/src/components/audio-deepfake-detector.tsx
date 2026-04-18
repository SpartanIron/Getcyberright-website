"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mic,
  Upload,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Shield,
  Volume2,
  FileAudio,
  Radio,
  Brain,
  Clock,
  Lightbulb,
  Phone,
  RefreshCw,
} from "lucide-react";

type Answer = "unsure" | "yes" | "no";

interface ChecklistItem {
  id: string;
  prompt: string;
  helper: string;
  yesMeansSuspicious: boolean;
  icon: typeof Clock;
}

const CHECKLIST: ChecklistItem[] = [
  {
    id: "breathing",
    prompt: "Could you hear the speaker breathing?",
    helper: "Real people breathe between sentences. AI voice clones often skip this entirely.",
    yesMeansSuspicious: false,
    icon: Volume2,
  },
  {
    id: "pauses",
    prompt: "Did pauses between words and sentences sound natural?",
    helper: "Cloned voices often have rhythm that is too even or pauses in odd places.",
    yesMeansSuspicious: false,
    icon: Clock,
  },
  {
    id: "emotion",
    prompt: "Did the emotion in the voice match the words being said?",
    helper: "AI clones can read words correctly but the feeling underneath often does not fit.",
    yesMeansSuspicious: false,
    icon: Brain,
  },
  {
    id: "background",
    prompt: "Does the background sound real (room noise, hum, traffic)?",
    helper: "Synthetic clips often have a background that is too clean, looped, or completely silent.",
    yesMeansSuspicious: false,
    icon: Radio,
  },
  {
    id: "pitch",
    prompt: "Did the pitch and tone vary the way a real person's voice does?",
    helper: "Cloned voices can sound flat, robotic, or stuck on the same melody line.",
    yesMeansSuspicious: false,
    icon: Mic,
  },
  {
    id: "artifacts",
    prompt: "Did you hear digital glitches, clicks, or warbles in the audio?",
    helper: "Processing artifacts can leak through cloned audio, especially on longer clips.",
    yesMeansSuspicious: true,
    icon: FileAudio,
  },
];

const PROTECTION_TIPS = [
  {
    title: "Establish a Family Codeword",
    description: "Pick a phrase only your family knows. If a relative calls in distress, ask for the codeword before doing anything.",
    priority: "essential" as const,
  },
  {
    title: "Hang Up and Call Back",
    description: "End the call and dial the person directly using a number you already have saved. Do not use any number the caller gives you.",
    priority: "essential" as const,
  },
  {
    title: "Trust Your Gut",
    description: "If something feels off about the voice or the situation, treat it as a scam until you can verify the person another way.",
    priority: "essential" as const,
  },
  {
    title: "Ask a Personal Question",
    description: "Ask something only the real person could answer, like a shared memory or a small detail from a recent conversation.",
    priority: "important" as const,
  },
  {
    title: "Slow the Conversation Down",
    description: "Scammers create panic so you cannot think. A real emergency can wait the two minutes it takes to verify the caller.",
    priority: "important" as const,
  },
  {
    title: "Limit Public Audio of Your Voice",
    description: "Reduce public videos and voicemails of your voice online. A few seconds of audio is enough for a cloning tool.",
    priority: "helpful" as const,
  },
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function formatDuration(seconds: number | null) {
  if (seconds === null || !isFinite(seconds)) return "Unknown";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds - m * 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioDeepfakeDetector() {
  const [activeTab, setActiveTab] = useState("analyze");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [completedAt, setCompletedAt] = useState<Date | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    const isAudio =
      file.type.startsWith("audio/") ||
      /\.(mp3|wav|m4a|ogg|aac)$/i.test(file.name);
    if (!isAudio) return;
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setSelectedFile(file);
    setAudioUrl(URL.createObjectURL(file));
    setAudioDuration(null);
    setAnswers({});
    setCompletedAt(null);
  }, [audioUrl]);

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

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const resetAll = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setSelectedFile(null);
    setAudioUrl(null);
    setAudioDuration(null);
    setIsPlaying(false);
    setAnswers({});
    setCompletedAt(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const setAnswer = (id: string, value: Answer) => {
    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      const allAnswered = CHECKLIST.every((q) => next[q.id]);
      if (allAnswered && !completedAt) setCompletedAt(new Date());
      return next;
    });
  };

  const { suspiciousCount, answeredCount } = useMemo(() => {
    let s = 0;
    let a = 0;
    for (const item of CHECKLIST) {
      const v = answers[item.id];
      if (!v) continue;
      a += 1;
      if (v === "unsure") continue;
      if (item.yesMeansSuspicious && v === "yes") s += 1;
      if (!item.yesMeansSuspicious && v === "no") s += 1;
    }
    return { suspiciousCount: s, answeredCount: a };
  }, [answers]);

  const allAnswered = answeredCount === CHECKLIST.length;

  const verdict = useMemo(() => {
    if (!allAnswered) return null;
    if (suspiciousCount >= 4) {
      return {
        level: "high" as const,
        title: "Multiple warning signs noted",
        body:
          "You marked four or more signs that match AI voice cloning. Treat this clip as suspicious. Do not act on what it asks for until you have spoken to the real person on a number you already trust.",
        color: "text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900",
        icon: <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0" />,
      };
    }
    if (suspiciousCount >= 2) {
      return {
        level: "medium" as const,
        title: "Some warning signs noted",
        body:
          "You noted a couple of signs that can show up in cloned voices. This is not proof either way. Verify the caller through a separate channel before doing anything they ask for.",
        color: "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900",
        icon: <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400 flex-shrink-0" />,
      };
    }
    return {
      level: "low" as const,
      title: "No obvious warning signs in your assessment",
      body:
        "You did not note many of the common signs of voice cloning. That is reassuring, but it is not proof. Modern clones can pass a listening test, so verify the caller through a separate channel before acting on anything urgent.",
      color: "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900",
      icon: <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />,
    };
  }, [allAnswered, suspiciousCount]);

  return (
    <Card className="w-full" data-testid="card-audio-deepfake">
      <CardHeader className="text-center pb-2">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-4">
          <Radio className="w-8 h-8 text-red-500" />
        </div>
        <CardTitle className="text-2xl">Voice Verification Helper</CardTitle>
        <CardDescription className="text-base max-w-xl mx-auto">
          AI voice cloning has gotten good enough that even experts cannot reliably tell a clone from the real person just by listening. This tool will not give you a yes-or-no verdict. It walks you through what to listen for, then helps you verify the caller the only way that actually works.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="analyze" className="gap-2" data-testid="tab-analyze">
              <Mic className="w-4 h-4" />
              Check a Clip
            </TabsTrigger>
            <TabsTrigger value="indicators" className="gap-2" data-testid="tab-indicators">
              <Brain className="w-4 h-4" />
              What to Listen For
            </TabsTrigger>
            <TabsTrigger value="protect" className="gap-2" data-testid="tab-protect">
              <Shield className="w-4 h-4" />
              Protect Yourself
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            <div
              className="rounded-xl p-5 border-2 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900"
              data-testid="banner-honesty"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                  <p className="font-semibold">This tool does not run AI deepfake detection.</p>
                  <p>
                    Reliable voice clone detection is an unsolved problem. Anyone who promises a yes-or-no answer is overstating what is possible today. We instead help you listen carefully, then verify the caller through a channel a scammer cannot fake.
                  </p>
                </div>
              </div>
            </div>

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
                <h3 className="font-semibold mb-2">Upload the audio clip</h3>
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
                  MP3, WAV, M4A, OGG, or AAC. Stays on your device, nothing is uploaded.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileAudio className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate" data-testid="text-filename">{selectedFile.name}</div>
                      <div className="text-sm text-muted-foreground" data-testid="text-filemeta">
                        {formatBytes(selectedFile.size)} · {formatDuration(audioDuration)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={togglePlayback}
                        data-testid="button-play-audio"
                        aria-label={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={resetAll}
                        data-testid="button-reset-audio"
                        aria-label="Start over"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {audioUrl && (
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      onEnded={() => setIsPlaying(false)}
                      onLoadedMetadata={(e) => setAudioDuration((e.currentTarget as HTMLAudioElement).duration)}
                      className="hidden"
                    />
                  )}
                </div>

                <div className="space-y-3" data-testid="section-checklist">
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <h3 className="text-lg font-semibold">Play the clip and answer six quick questions</h3>
                    <span className="text-xs text-muted-foreground" data-testid="text-progress">
                      {answeredCount} of {CHECKLIST.length} answered
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    These are the same things a trained ear listens for. Your answers stay on your device.
                  </p>
                  <div className="space-y-3">
                    {CHECKLIST.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg border bg-card p-4"
                        data-testid={`question-${item.id}`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <item.icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm mb-1">{item.prompt}</div>
                            <p className="text-xs text-muted-foreground">{item.helper}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 ml-11">
                          {(["yes", "no", "unsure"] as Answer[]).map((opt) => {
                            const selected = answers[item.id] === opt;
                            return (
                              <Button
                                key={opt}
                                size="sm"
                                variant={selected ? "default" : "outline"}
                                className="capitalize"
                                onClick={() => setAnswer(item.id, opt)}
                                data-testid={`answer-${item.id}-${opt}`}
                              >
                                {opt === "unsure" ? "Not sure" : opt}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {verdict && (
                  <div
                    className={`rounded-xl p-6 border-2 ${verdict.color}`}
                    role="alert"
                    aria-live="polite"
                    data-testid="result-verdict"
                  >
                    <div className="flex items-start gap-4">
                      {verdict.icon}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold mb-2" data-testid="text-verdict-title">
                          {verdict.title}
                        </h3>
                        <p className="text-sm mb-4" data-testid="text-verdict-body">
                          {verdict.body}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Button
                            variant={verdict.level === "low" ? "outline" : "destructive"}
                            size="sm"
                            onClick={() => setActiveTab("protect")}
                            data-testid="button-verify-caller"
                          >
                            <Phone className="w-4 h-4 mr-1.5" />
                            Show me how to verify the caller
                          </Button>
                          <Button variant="outline" size="sm" onClick={resetAll} data-testid="button-check-another">
                            <RefreshCw className="w-4 h-4 mr-1.5" />
                            Check another clip
                          </Button>
                        </div>
                        <div className="border-t border-foreground/10 pt-3">
                          <p className="text-xs font-medium opacity-80 mb-2">
                            This assessment is based on:
                          </p>
                          <ul className="space-y-1 text-xs opacity-80">
                            <li data-testid="check-file">
                              <span className="font-medium">File:</span> {selectedFile.name} · {formatBytes(selectedFile.size)} · {formatDuration(audioDuration)}
                            </li>
                            <li data-testid="check-listener">
                              <span className="font-medium">Listener:</span> your own answers to {CHECKLIST.length} questions ({suspiciousCount} marked as a warning sign)
                            </li>
                            <li data-testid="check-time">
                              <span className="font-medium">Completed:</span> {completedAt ? completedAt.toLocaleString() : ""}
                            </li>
                            <li>
                              <span className="font-medium">No AI verdict was generated</span>, because no detector available today is reliable enough to trust as proof.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="indicators" className="space-y-4">
            <p className="text-muted-foreground">
              These are the small tells that often appear in AI-cloned voices. None of them on their own proves a clip is fake. Several of them together is a strong reason to verify the caller before doing anything they ask for.
            </p>

            <div className="grid gap-4">
              {CHECKLIST.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card"
                  data-testid={`indicator-info-${item.id}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">{item.prompt}</div>
                    <p className="text-sm text-muted-foreground">{item.helper}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="protect" className="space-y-4">
            <div className="flex items-start gap-3 mb-4 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900">
              <Phone className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-red-800 dark:text-red-200 mb-1">
                  Voice cloning scams target families directly
                </div>
                <div className="text-sm text-red-700 dark:text-red-300">
                  A scammer only needs a few seconds of audio to clone a voice. The defence is not better listening. It is verifying the caller in a way the scammer cannot fake.
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {PROTECTION_TIPS.map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card"
                  data-testid={`protection-tip-${idx}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      tip.priority === "essential"
                        ? "bg-red-100 dark:bg-red-900/30"
                        : tip.priority === "important"
                        ? "bg-orange-100 dark:bg-orange-900/30"
                        : "bg-blue-100 dark:bg-blue-900/30"
                    }`}
                  >
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
                        className={`text-[10px] capitalize ${
                          tip.priority === "essential" ? "text-red-600 border-red-300" :
                          tip.priority === "important" ? "text-orange-600 border-orange-300" :
                          "text-blue-600 border-blue-300"
                        }`}
                      >
                        {tip.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
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
                <strong>Never send money, gift cards, or sensitive information based on a phone call alone.</strong>
                {" "}Always verify through a separate channel, even if the voice sounds exactly like someone you know.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
