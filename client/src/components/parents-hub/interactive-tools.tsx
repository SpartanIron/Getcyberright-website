"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle, Circle, RotateCcw, ChevronRight, ChevronDown, ChevronUp,
  Shield, AlertTriangle, Star, MessageCircle, Scale, BarChart3,
  Smartphone, Monitor, Gamepad2, Globe, Users, DollarSign, Sparkles
} from "lucide-react";
import type {
  QuizQuestion, AppSafetyCard, LegalInfo, ConversationScript,
  FamilyStat, DeviceAudit, ISPGuide
} from "./quiz-data";

const STORAGE_KEY = "parents-hub-progress";

interface ParentProgress {
  auditCompleted: Record<string, string[]>;
  quizScores: Record<string, number>;
  conversationsGenerated: number;
  lastActivity: string;
}

function loadProgress(): ParentProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { auditCompleted: {}, quizScores: {}, conversationsGenerated: 0, lastActivity: "" };
}

function saveProgress(progress: ParentProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {}
}

export function DeviceAuditChecklist({ audits }: { audits: DeviceAudit[] }) {
  const [progress, setProgress] = useState<ParentProgress>(loadProgress);
  const [activePlatform, setActivePlatform] = useState(audits[0]?.platform || "");

  const toggleStep = (platform: string, stepId: string) => {
    setProgress(prev => {
      const platformSteps = prev.auditCompleted[platform] || [];
      const updated = platformSteps.includes(stepId)
        ? platformSteps.filter(s => s !== stepId)
        : [...platformSteps, stepId];
      const next = { ...prev, auditCompleted: { ...prev.auditCompleted, [platform]: updated }, lastActivity: new Date().toISOString() };
      saveProgress(next);
      return next;
    });
  };

  const resetPlatform = (platform: string) => {
    setProgress(prev => {
      const next = { ...prev, auditCompleted: { ...prev.auditCompleted, [platform]: [] } };
      saveProgress(next);
      return next;
    });
  };

  const activeAudit = audits.find(a => a.platform === activePlatform);
  const completedSteps = progress.auditCompleted[activePlatform] || [];
  const totalSteps = activeAudit?.steps.length || 0;
  const pct = totalSteps > 0 ? Math.round((completedSteps.length / totalSteps) * 100) : 0;

  const totalAllSteps = audits.reduce((sum, a) => sum + a.steps.length, 0);
  const totalAllCompleted = audits.reduce((sum, a) => sum + (progress.auditCompleted[a.platform] || []).length, 0);
  const overallPct = totalAllSteps > 0 ? Math.round((totalAllCompleted / totalAllSteps) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-foreground">Overall Audit Progress</span>
          </div>
          <span className="text-sm font-medium text-blue-600">{totalAllCompleted}/{totalAllSteps} steps</span>
        </div>
        <Progress value={overallPct} className="h-2.5" />
        <p className="text-xs text-muted-foreground mt-2">{overallPct}% complete across all devices</p>
      </div>

      <Tabs value={activePlatform} onValueChange={setActivePlatform}>
        <TabsList className="flex flex-wrap h-auto gap-1.5 bg-muted/50 p-1.5 rounded-xl mb-4">
          {audits.map(audit => {
            const done = (progress.auditCompleted[audit.platform] || []).length;
            const total = audit.steps.length;
            return (
              <TabsTrigger
                key={audit.platform}
                value={audit.platform}
                className="text-sm px-3 py-2 rounded-lg gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                data-testid={`tab-audit-${audit.platform.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
              >
                <span>{audit.icon}</span>
                <span>{audit.platform}</span>
                {done === total && total > 0 && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {audits.map(audit => (
          <TabsContent key={audit.platform} value={audit.platform}>
            <Card>
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{audit.icon} {audit.platform} Audit</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{completedSteps.length} of {totalSteps} steps completed</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {pct === 100 && <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">Complete</Badge>}
                    <Button variant="ghost" size="sm" onClick={() => resetPlatform(audit.platform)} data-testid={`button-reset-${audit.platform.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Progress value={pct} className="h-2 mb-5" />
                <ul className="space-y-2">
                  {audit.steps.map(step => {
                    const checked = completedSteps.includes(step.id);
                    return (
                      <li key={step.id}>
                        <button
                          onClick={() => toggleStep(audit.platform, step.id)}
                          className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${checked ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800" : "bg-muted/30 border border-transparent hover:bg-muted/60"}`}
                          data-testid={`check-${step.id}`}
                        >
                          {checked
                            ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            : <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />}
                          <span className={`text-sm leading-relaxed ${checked ? "text-green-700 dark:text-green-300 line-through" : "text-foreground"}`}>{step.text}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export function ParentingQuiz({ questions }: { questions: QuizQuestion[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const categories = Array.from(new Set(questions.map(q => q.category)));
  const filtered = categoryFilter ? questions.filter(q => q.category === categoryFilter) : questions;
  const question = filtered[currentIndex];

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    if (question.options[index].isCorrect) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= filtered.length) {
      setFinished(true);
      const progress = loadProgress();
      const key = categoryFilter || "all";
      const finalScore = score + (selectedAnswer !== null && question.options[selectedAnswer].isCorrect ? 0 : 0);
      progress.quizScores[key] = Math.max(progress.quizScores[key] || 0, score);
      progress.lastActivity = new Date().toISOString();
      saveProgress(progress);
    } else {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setFinished(false);
  };

  const switchCategory = (cat: string | null) => {
    setCategoryFilter(cat);
    restart();
  };

  if (finished) {
    const pct = Math.round((score / filtered.length) * 100);
    return (
      <Card>
        <CardContent className="p-6 sm:p-8 text-center">
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${pct >= 80 ? "bg-green-100 dark:bg-green-900/30" : pct >= 50 ? "bg-amber-100 dark:bg-amber-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
            <Star className={`w-10 h-10 ${pct >= 80 ? "text-green-500" : pct >= 50 ? "text-amber-500" : "text-red-500"}`} />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Quiz Complete!</h3>
          <p className="text-lg text-muted-foreground mb-1">You scored {score} out of {filtered.length}</p>
          <p className="text-sm text-muted-foreground mb-6">
            {pct >= 80 ? "Excellent! You have a strong grasp of online safety parenting." : pct >= 50 ? "Good effort! Review the topics where you missed questions." : "Keep learning! Review the guides to strengthen your knowledge."}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={restart} data-testid="button-retry-quiz">
              <RotateCcw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!question) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5 mb-2">
        <Button
          variant={categoryFilter === null ? "default" : "outline"}
          size="sm"
          onClick={() => switchCategory(null)}
          data-testid="button-quiz-all"
        >
          All ({questions.length})
        </Button>
        {categories.map(cat => (
          <Button
            key={cat}
            variant={categoryFilter === cat ? "default" : "outline"}
            size="sm"
            onClick={() => switchCategory(cat)}
            data-testid={`button-quiz-${cat.replace(/\s+/g, '-').toLowerCase()}`}
          >
            {cat} ({questions.filter(q => q.category === cat).length})
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">{question.category}</Badge>
            <span className="text-sm text-muted-foreground">Question {currentIndex + 1} of {filtered.length}</span>
          </div>
          <Progress value={((currentIndex + 1) / filtered.length) * 100} className="h-1.5 mb-5" />

          <h3 className="text-lg font-semibold text-foreground mb-5 leading-relaxed" data-testid="text-quiz-question">{question.scenario}</h3>

          <div className="space-y-3">
            {question.options.map((opt, idx) => {
              let classes = "w-full text-left p-4 rounded-xl border-2 transition-all ";
              if (showFeedback) {
                if (opt.isCorrect) classes += "border-green-500 bg-green-50 dark:bg-green-950/20";
                else if (idx === selectedAnswer) classes += "border-red-500 bg-red-50 dark:bg-red-950/20";
                else classes += "border-muted opacity-50";
              } else if (idx === selectedAnswer) {
                classes += "border-primary bg-primary/5";
              } else {
                classes += "border-muted hover:border-primary/50 hover:bg-muted/30";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={classes}
                  disabled={showFeedback}
                  data-testid={`option-${idx}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-sm font-medium">{String.fromCharCode(65 + idx)}</span>
                    <span className="text-sm leading-relaxed">{opt.text}</span>
                  </div>
                  {showFeedback && idx === selectedAnswer && (
                    <p className={`mt-3 text-sm leading-relaxed ml-10 ${opt.isCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>{opt.feedback}</p>
                  )}
                  {showFeedback && opt.isCorrect && idx !== selectedAnswer && (
                    <p className="mt-3 text-sm leading-relaxed ml-10 text-green-700 dark:text-green-300">{opt.feedback}</p>
                  )}
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div className="flex justify-end mt-5">
              <Button onClick={handleNext} data-testid="button-next-question">
                {currentIndex + 1 >= filtered.length ? "See Results" : "Next Question"}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function AppSafetyReview({ apps }: { apps: AppSafetyCard[] }) {
  const [regionFilter, setRegionFilter] = useState<string>("Global");
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

  const regions = Array.from(new Set(apps.flatMap(a => a.region)));
  const filtered = apps.filter(a => a.region.includes(regionFilter));

  const ratingColors = {
    low: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    high: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
  };

  const ratingLabels = { low: "Lower Risk", medium: "Medium Risk", high: "Higher Risk" };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5 mb-2">
        {regions.map(r => (
          <Button
            key={r}
            variant={regionFilter === r ? "default" : "outline"}
            size="sm"
            onClick={() => setRegionFilter(r)}
            data-testid={`button-region-${r.toLowerCase()}`}
          >
            {r}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map(app => {
          const expanded = expandedApp === app.name;
          return (
            <Card key={app.name} className="overflow-hidden">
              <CardContent className="p-0">
                <button
                  onClick={() => setExpandedApp(expanded ? null : app.name)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                  data-testid={`card-app-${app.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{app.icon}</span>
                    <div>
                      <h4 className="font-semibold text-foreground">{app.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">Min age: {app.minAge}+</span>
                        <Badge className={`text-xs ${ratingColors[app.rating]}`}>{ratingLabels[app.rating]}</Badge>
                      </div>
                    </div>
                  </div>
                  {expanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                </button>

                {expanded && (
                  <div className="px-4 pb-4 space-y-4 border-t">
                    <div className="pt-4">
                      <h5 className="font-semibold text-sm text-red-600 dark:text-red-400 mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" /> Key Risks
                      </h5>
                      <ul className="space-y-1.5">
                        {app.risks.map((risk, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                            <span className="text-red-400 mt-1">•</span>{risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm text-green-600 dark:text-green-400 mb-2 flex items-center gap-1.5">
                        <Shield className="w-4 h-4" /> Safety Settings
                      </h5>
                      <ul className="space-y-1.5">
                        {app.safetyTips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />{tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-1.5">
                        <Users className="w-4 h-4" /> What Parents Should Do
                      </h5>
                      <ul className="space-y-1.5">
                        {app.parentActions.map((action, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                            <ChevronRight className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />{action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function LegalAwarenessModule({ laws }: { laws: LegalInfo[] }) {
  const [activeRegion, setActiveRegion] = useState("Americas");
  const [expandedLaw, setExpandedLaw] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, boolean>>({});

  const regions = Array.from(new Set(laws.map(l => l.region)));
  const filtered = laws.filter(l => l.region === activeRegion);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5 mb-2">
        {regions.map(r => (
          <Button
            key={r}
            variant={activeRegion === r ? "default" : "outline"}
            size="sm"
            onClick={() => { setActiveRegion(r); setExpandedLaw(null); }}
            data-testid={`button-legal-${r.toLowerCase()}`}
          >
            <Globe className="w-3.5 h-3.5 mr-1.5" />{r}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(law => {
          const expanded = expandedLaw === law.law;
          return (
            <Card key={law.law} className="overflow-hidden">
              <button
                onClick={() => setExpandedLaw(expanded ? null : law.law)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-muted/20 transition-colors"
                data-testid={`card-law-${law.law.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Scale className="w-5 h-5 text-primary" />
                    <h4 className="font-bold text-foreground">{law.law}</h4>
                    <Badge variant="outline" className="text-xs">{law.country}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Age threshold: <strong>{law.ageThreshold}+</strong></p>
                </div>
                {expanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </button>

              {expanded && (
                <CardContent className="pt-0 pb-5 px-5 space-y-5 border-t">
                  <p className="text-foreground leading-relaxed pt-4">{law.summary}</p>

                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                    <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">What This Means for Your Family</h5>
                    <ul className="space-y-2">
                      {law.whatItMeans.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-blue-700 dark:text-blue-300">
                          <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                    <h5 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> Penalties
                    </h5>
                    <p className="text-sm text-amber-700 dark:text-amber-300">{law.penalties}</p>
                  </div>

                  <div>
                    <h5 className="font-semibold text-foreground mb-3">Actions You Can Take</h5>
                    <ul className="space-y-2">
                      {law.parentActions.map((action, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                          <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />{action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-muted/50 rounded-xl p-4 border">
                    <h5 className="font-semibold text-foreground mb-3">Quick Knowledge Check</h5>
                    <p className="text-sm text-foreground mb-3">Under {law.law}, can a company collect your child's personal data without your consent if your child is under {law.ageThreshold}?</p>
                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        variant={quizAnswers[law.law] === false ? "default" : "outline"}
                        onClick={() => setQuizAnswers(prev => ({ ...prev, [law.law]: false }))}
                        className={quizAnswers[law.law] === false ? "bg-green-600 hover:bg-green-700" : ""}
                        data-testid={`button-legal-quiz-no-${law.law.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      >
                        No, they cannot
                      </Button>
                      <Button
                        size="sm"
                        variant={quizAnswers[law.law] === true ? "default" : "outline"}
                        onClick={() => setQuizAnswers(prev => ({ ...prev, [law.law]: true }))}
                        className={quizAnswers[law.law] === true ? "bg-red-600 hover:bg-red-700" : ""}
                        data-testid={`button-legal-quiz-yes-${law.law.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      >
                        Yes, they can
                      </Button>
                    </div>
                    {quizAnswers[law.law] !== undefined && (
                      <p className={`mt-3 text-sm ${quizAnswers[law.law] === false ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                        {quizAnswers[law.law] === false
                          ? `Correct! Under ${law.law}, companies must get verifiable parental consent before collecting data from children under ${law.ageThreshold}.`
                          : `Not quite. ${law.law} requires verifiable parental consent before a company can collect data from children under ${law.ageThreshold}.`}
                      </p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function ConversationGenerator({ scripts }: { scripts: ConversationScript[] }) {
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);

  const topics = Array.from(new Set(scripts.map(s => s.topic)));
  const ages = Array.from(new Set(scripts.map(s => s.ageRange)));

  const matchingScript = scripts.find(s => s.ageRange === selectedAge && s.topic === selectedTopic);

  const handleGenerate = () => {
    if (matchingScript) {
      setGenerated(true);
      const progress = loadProgress();
      progress.conversationsGenerated += 1;
      progress.lastActivity = new Date().toISOString();
      saveProgress(progress);
    }
  };

  const reset = () => {
    setSelectedAge(null);
    setSelectedTopic(null);
    setGenerated(false);
  };

  if (generated && matchingScript) {
    return (
      <Card>
        <CardContent className="p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 mb-2">{matchingScript.topic} · Ages {matchingScript.ageRange}</Badge>
              <h3 className="text-lg font-bold text-foreground">Your Conversation Script</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={reset} data-testid="button-new-conversation">
              <RotateCcw className="w-4 h-4 mr-1" /> New
            </Button>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
            <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4" /> Opening Line
            </h4>
            <p className="text-purple-700 dark:text-purple-300 italic leading-relaxed">"{matchingScript.opening}"</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Do
              </h4>
              <ul className="space-y-2">
                {matchingScript.dos.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-green-700 dark:text-green-300">
                    <span className="text-green-500 mt-0.5">✓</span>{d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Don't
              </h4>
              <ul className="space-y-2">
                {matchingScript.donts.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                    <span className="text-red-500 mt-0.5">✗</span>{d}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 border">
            <h4 className="font-semibold text-foreground mb-3">Follow-Up Questions</h4>
            <ul className="space-y-2">
              {matchingScript.followUp.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <MessageCircle className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="italic">"{q}"</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-5 sm:p-6">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-7 h-7 text-purple-500" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">Conversation Starter Generator</h3>
          <p className="text-sm text-muted-foreground">Select your child's age and a topic to get a tailored conversation script with dos, don'ts, and follow-up questions.</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Child's Age Group</label>
            <div className="flex flex-wrap gap-2">
              {ages.map(age => (
                <Button
                  key={age}
                  variant={selectedAge === age ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setSelectedAge(age); setSelectedTopic(null); }}
                  data-testid={`button-age-${age}`}
                >
                  Ages {age}
                </Button>
              ))}
            </div>
          </div>

          {selectedAge && (
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Conversation Topic</label>
              <div className="flex flex-wrap gap-2">
                {topics.filter(t => scripts.some(s => s.ageRange === selectedAge && s.topic === t)).map(topic => (
                  <Button
                    key={topic}
                    variant={selectedTopic === topic ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTopic(topic)}
                    data-testid={`button-topic-${topic.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selectedAge && selectedTopic && matchingScript && (
            <Button onClick={handleGenerate} className="w-full" data-testid="button-generate-script">
              <Sparkles className="w-4 h-4 mr-2" /> Generate Conversation Script
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ISPControlGuides({ guides }: { guides: ISPGuide[] }) {
  const [activeRegion, setActiveRegion] = useState("US");
  const [expandedISP, setExpandedISP] = useState<string | null>(null);

  const regions = Array.from(new Set(guides.map(g => g.region)));
  const filtered = guides.filter(g => g.region === activeRegion);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5 mb-2">
        {regions.map(r => (
          <Button
            key={r}
            variant={activeRegion === r ? "default" : "outline"}
            size="sm"
            onClick={() => { setActiveRegion(r); setExpandedISP(null); }}
            data-testid={`button-isp-region-${r.toLowerCase()}`}
          >
            {r}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(guide => {
          const expanded = expandedISP === guide.isp;
          return (
            <Card key={guide.isp}>
              <button
                onClick={() => setExpandedISP(expanded ? null : guide.isp)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/20 transition-colors"
                data-testid={`card-isp-${guide.isp.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-foreground">{guide.isp}</h4>
                </div>
                {expanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </button>
              {expanded && (
                <CardContent className="pt-0 pb-4 px-4 border-t">
                  <ol className="space-y-2 pt-3">
                    {guide.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                        <span className="text-sm text-foreground leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function FamilyStatsInfographic({ stats }: { stats: FamilyStat[] }) {
  const [visibleStats, setVisibleStats] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(index)) {
              setVisibleStats(prev => new Set(prev).add(index));
            }
          }
        });
      },
      { threshold: 0.3 }
    );
    const cards = containerRef.current?.querySelectorAll("[data-index]");
    cards?.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          data-index={index}
          className={`relative overflow-hidden rounded-xl p-5 transition-all duration-700 ${visibleStats.has(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          data-testid={`stat-card-${index}`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`} />
          <div className="relative">
            <div className={`text-3xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>{stat.value}</div>
            <div className="font-semibold text-foreground text-sm mb-1.5">{stat.label}</div>
            <p className="text-xs text-muted-foreground leading-relaxed">{stat.description}</p>
            <p className="text-xs text-muted-foreground/60 mt-2">{stat.source}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MicroTransactionAwareness({ stats }: { stats: { label: string; value: string; detail: string; icon: string }[] }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-amber-500" />
          Gaming & Micro-Transaction Awareness
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {stats.map((stat, i) => (
            <div key={i} className="bg-muted/40 rounded-xl p-4 border" data-testid={`microtx-stat-${i}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{stat.icon}</span>
                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              </div>
              <div className="font-medium text-sm text-foreground mb-1">{stat.label}</div>
              <p className="text-xs text-muted-foreground">{stat.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
          <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 text-sm">What You Can Do</h4>
          <ul className="space-y-1.5 text-sm text-amber-700 dark:text-amber-300">
            <li className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-500" />Set up purchase approval on all gaming platforms</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-500" />Use prepaid gift cards instead of linking credit cards</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-500" />Discuss the real cost of in-game currency with your child</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-500" />Create a monthly gaming budget your child manages</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
