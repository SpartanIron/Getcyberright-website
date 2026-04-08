"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle, Circle, RotateCcw, ChevronRight, ChevronDown, ChevronUp,
  Shield, AlertTriangle, Star, Lock, Mail, Users, Server,
  FileText, DollarSign, ArrowRight, XCircle, Building,
  Key, Smartphone, Home, FolderLock, Monitor, Globe
} from "lucide-react";
import type {
  AssessmentItem, PhishingScenario, PolicyTemplate,
  IncidentType, IncidentStep, SecurityTool, RegionCode, DomainName
} from "./assessment-data";
import { assessmentDomains } from "./assessment-data";

const STORAGE_KEY = "small-business-hub-progress";

interface BusinessProgress {
  assessmentScores: Record<string, number>;
  assessmentChecked: Record<string, boolean>;
  phishingScores: Record<string, boolean>;
  policiesCompleted: string[];
  incidentsExplored: string[];
  budgetCalculated: boolean;
  lastActivity: string;
}

function loadProgress(): BusinessProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { assessmentScores: {}, assessmentChecked: {}, phishingScores: {}, policiesCompleted: [], incidentsExplored: [], budgetCalculated: false, lastActivity: "" };
}

function saveProgress(progress: BusinessProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {}
}

const domainColors: Record<string, string> = {
  "Access Control": "bg-blue-500",
  "Email Security": "bg-red-500",
  "Data Protection": "bg-green-500",
  "Network Security": "bg-purple-500",
  "Employee Training": "bg-amber-500",
  "Vendor Management": "bg-teal-500"
};

const domainIcons: Record<string, typeof Shield> = {
  "Access Control": Key,
  "Email Security": Mail,
  "Data Protection": Server,
  "Network Security": Globe,
  "Employee Training": Users,
  "Vendor Management": Building
};

function getLetterGrade(pct: number): { grade: string; color: string; label: string } {
  if (pct >= 90) return { grade: "A", color: "text-green-600", label: "Excellent" };
  if (pct >= 80) return { grade: "B", color: "text-blue-600", label: "Good" };
  if (pct >= 70) return { grade: "C", color: "text-amber-600", label: "Needs Improvement" };
  if (pct >= 50) return { grade: "D", color: "text-orange-600", label: "At Risk" };
  return { grade: "F", color: "text-red-600", label: "Critical Risk" };
}

export function SecurityPostureAssessment({ items }: { items: AssessmentItem[] }) {
  const [progress, setProgress] = useState<BusinessProgress>(loadProgress);
  const [checked, setChecked] = useState<Record<string, boolean>>(() => loadProgress().assessmentChecked || {});
  const [showResults, setShowResults] = useState(() => {
    const saved = loadProgress();
    return Object.keys(saved.assessmentScores).length > 0;
  });

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      setProgress(p => {
        const updated = { ...p, assessmentChecked: next, lastActivity: new Date().toISOString() };
        saveProgress(updated);
        return updated;
      });
      return next;
    });
  };

  const calculateResults = () => {
    const domainScores: Record<string, { earned: number; total: number }> = {};
    for (const domain of assessmentDomains) {
      domainScores[domain] = { earned: 0, total: 0 };
    }
    items.forEach(item => {
      domainScores[item.domain].total += item.weight;
      if (checked[item.id]) domainScores[item.domain].earned += item.weight;
    });
    setProgress(prev => {
      const scores: Record<string, number> = {};
      for (const [domain, val] of Object.entries(domainScores)) {
        scores[domain] = val.total > 0 ? Math.round((val.earned / val.total) * 100) : 0;
      }
      const next = { ...prev, assessmentScores: scores, lastActivity: new Date().toISOString() };
      saveProgress(next);
      return next;
    });
    setShowResults(true);
  };

  const reset = () => {
    setChecked({});
    setShowResults(false);
    setProgress(prev => {
      const next = { ...prev, assessmentScores: {}, assessmentChecked: {}, lastActivity: new Date().toISOString() };
      saveProgress(next);
      return next;
    });
  };

  const totalWeight = items.reduce((s, i) => s + i.weight, 0);
  const earnedWeight = items.filter(i => checked[i.id]).reduce((s, i) => s + i.weight, 0);
  const overallPct = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
  const overallGrade = getLetterGrade(overallPct);

  if (showResults) {
    const domainResults = assessmentDomains.map(domain => {
      const domainItems = items.filter(i => i.domain === domain);
      const total = domainItems.reduce((s, i) => s + i.weight, 0);
      const earned = domainItems.filter(i => checked[i.id]).reduce((s, i) => s + i.weight, 0);
      const pct = total > 0 ? Math.round((earned / total) * 100) : 0;
      const grade = getLetterGrade(pct);
      const missed = domainItems.filter(i => !checked[i.id]).sort((a, b) => b.weight - a.weight);
      return { domain, pct, grade, missed };
    });

    const priorityActions = domainResults
      .filter(d => d.pct < 80)
      .sort((a, b) => a.pct - b.pct)
      .flatMap(d => d.missed.slice(0, 2).map(m => ({ domain: d.domain, action: m.question, weight: m.weight })));

    return (
      <div className="space-y-6">
        <Card className="text-center">
          <CardContent className="p-8">
            <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center border-4 ${overallPct >= 70 ? "border-green-500 bg-green-50 dark:bg-green-950/20" : overallPct >= 50 ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20" : "border-red-500 bg-red-50 dark:bg-red-950/20"}`}>
              <span className={`text-4xl font-bold ${overallGrade.color}`} data-testid="text-overall-grade">{overallGrade.grade}</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-1">Security Posture: {overallGrade.label}</h3>
            <p className="text-muted-foreground mb-4">Overall Score: {overallPct}%</p>
            <Progress value={overallPct} className="h-3 mb-6 max-w-md mx-auto" />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 text-left">
              {domainResults.map(d => {
                const Icon = domainIcons[d.domain] || Shield;
                return (
                  <div key={d.domain} className="bg-muted/50 rounded-xl p-3 border" data-testid={`domain-result-${d.domain.toLowerCase().replace(/\s+/g, '-')}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground truncate">{d.domain}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xl font-bold ${d.grade.color}`}>{d.grade.grade}</span>
                      <span className="text-sm text-muted-foreground">{d.pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {priorityActions.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Prioritized Action Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {priorityActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm flex-shrink-0">{i + 1}</span>
                    <div>
                      <span className="text-sm font-medium text-foreground">{action.action}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{action.domain}</Badge>
                        <Badge className={`text-xs ${action.weight >= 3 ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300" : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"}`}>
                          {action.weight >= 3 ? "High Impact" : "Medium Impact"}
                        </Badge>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center">
          <Button onClick={reset} data-testid="button-retake-assessment">
            <RotateCcw className="w-4 h-4 mr-2" /> Retake Assessment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-foreground">Security Posture Assessment</span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">Check each item that your business currently has in place. When finished, click "Calculate Score" to see your security grade and prioritized action plan.</p>
        <div className="flex items-center gap-3">
          <Progress value={(Object.values(checked).filter(Boolean).length / items.length) * 100} className="h-2 flex-1" />
          <span className="text-sm font-medium text-muted-foreground">{Object.values(checked).filter(Boolean).length}/{items.length}</span>
        </div>
      </div>

      {assessmentDomains.map(domain => {
        const domainItems = items.filter(i => i.domain === domain);
        const Icon = domainIcons[domain] || Shield;
        const checkedCount = domainItems.filter(i => checked[i.id]).length;
        return (
          <Card key={domain} data-testid={`domain-${domain.toLowerCase().replace(/\s+/g, '-')}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg ${domainColors[domain]} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-base">{domain}</CardTitle>
                </div>
                <span className="text-xs text-muted-foreground">{checkedCount}/{domainItems.length}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {domainItems.map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => toggle(item.id)}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${checked[item.id] ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800" : "bg-muted/30 border border-transparent hover:bg-muted/60"}`}
                      data-testid={`check-${item.id}`}
                    >
                      {checked[item.id]
                        ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        : <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />}
                      <span className={`text-sm leading-relaxed ${checked[item.id] ? "text-green-700 dark:text-green-300" : "text-foreground"}`}>{item.question}</span>
                      {item.weight >= 3 && <Badge className="text-[10px] ml-auto flex-shrink-0 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">Critical</Badge>}
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })}

      <div className="flex justify-center">
        <Button size="lg" onClick={calculateResults} data-testid="button-calculate-score">
          <Shield className="w-5 h-5 mr-2" /> Calculate Security Score
        </Button>
      </div>
    </div>
  );
}

const regionLabels: Record<string, string> = { US: "United States", UK: "United Kingdom", Canada: "Canada", Australia: "Australia", Africa: "Africa" };
const regionFlags: Record<string, string> = { US: "\u{1F1FA}\u{1F1F8}", UK: "\u{1F1EC}\u{1F1E7}", Canada: "\u{1F1E8}\u{1F1E6}", Australia: "\u{1F1E6}\u{1F1FA}", Africa: "\u{1F30D}" };

export function PhishingSimulationTrainer({ scenarios }: { scenarios: PhishingScenario[] }) {
  const [progress, setProgress] = useState<BusinessProgress>(loadProgress);
  const [activeRegion, setActiveRegion] = useState<RegionCode>("US");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const regionScenarios = scenarios.filter(s => s.region === activeRegion);
  const current = regionScenarios[currentIndex];
  const regions: RegionCode[] = ["US", "UK", "Canada", "Australia", "Africa"];

  const regionStats = (region: RegionCode) => {
    const rs = scenarios.filter(s => s.region === region);
    const answered = rs.filter(s => progress.phishingScores[s.id] !== undefined).length;
    const correct = rs.filter(s => progress.phishingScores[s.id] === true).length;
    return { total: rs.length, answered, correct };
  };

  const handleAnswer = (value: string) => {
    if (showResult) return;
    setSelectedAnswer(value);
    setShowResult(true);
    const isCorrect = current.isPhishing ? value === "phishing" : value === "legitimate";
    setProgress(prev => {
      const next = { ...prev, phishingScores: { ...prev.phishingScores, [current.id]: isCorrect }, lastActivity: new Date().toISOString() };
      saveProgress(next);
      return next;
    });
  };

  const handleNext = () => {
    if (currentIndex < regionScenarios.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleRegionChange = (region: RegionCode) => {
    setActiveRegion(region);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const resetRegion = () => {
    setProgress(prev => {
      const rs = scenarios.filter(s => s.region === activeRegion);
      const next = { ...prev, phishingScores: { ...prev.phishingScores } };
      rs.forEach(s => delete next.phishingScores[s.id]);
      saveProgress(next);
      return next;
    });
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (!current) return null;
  const stats = regionStats(activeRegion);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-xl p-5 border border-red-200 dark:border-red-800">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-5 h-5 text-red-600" />
          <span className="font-semibold text-foreground">Phishing Simulation Trainer</span>
        </div>
        <p className="text-sm text-muted-foreground">Review realistic business email scenarios and identify threats. Each scenario includes detailed red-flag explanations.</p>
      </div>

      <div className="flex flex-wrap gap-2" data-testid="phishing-region-tabs">
        {regions.map(r => {
          const s = regionStats(r);
          return (
            <button
              key={r}
              onClick={() => handleRegionChange(r)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${activeRegion === r ? "bg-primary text-primary-foreground shadow-md" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}
              data-testid={`phishing-region-${r.toLowerCase()}`}
            >
              <span>{regionFlags[r]}</span>
              <span>{regionLabels[r]}</span>
              {s.answered > 0 && <Badge variant="secondary" className="text-xs ml-1">{s.correct}/{s.total}</Badge>}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Scenario {currentIndex + 1} of {regionScenarios.length}
          {stats.answered > 0 && ` · ${stats.correct} correct out of ${stats.answered} answered`}
        </div>
        {stats.answered > 0 && (
          <Button variant="ghost" size="sm" onClick={resetRegion} data-testid="button-reset-phishing">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset
          </Button>
        )}
      </div>

      <Progress value={(stats.answered / stats.total) * 100} className="h-2" />

      <Card className="border-2" data-testid={`phishing-card-${current.id}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
              <Mail className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg">{current.title}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">From: {current.sender}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="bg-muted/50 rounded-xl border overflow-hidden">
            <div className="bg-muted/80 px-4 py-2 border-b">
              <p className="text-sm font-medium text-foreground">{current.subject}</p>
            </div>
            <div className="p-4 text-sm leading-relaxed whitespace-pre-line font-mono" data-testid="phishing-body">
              {current.body}
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { value: "phishing", label: "This is a phishing attempt" },
              { value: "legitimate", label: "This is a legitimate email" },
              { value: "unsure", label: "I am not sure" }
            ].map(choice => {
              const isSelected = selectedAnswer === choice.value;
              const isCorrectAnswer = current.isPhishing ? choice.value === "phishing" : choice.value === "legitimate";
              let buttonClass = "w-full justify-start text-left p-4 h-auto rounded-xl border-2 transition-all ";
              if (showResult) {
                if (isCorrectAnswer) buttonClass += "border-green-500 bg-green-50 dark:bg-green-950/30 text-foreground";
                else if (isSelected && !isCorrectAnswer) buttonClass += "border-red-500 bg-red-50 dark:bg-red-950/30 text-foreground";
                else buttonClass += "border-muted bg-muted/30 text-muted-foreground opacity-60";
              } else {
                buttonClass += "border-muted hover:border-primary/50 hover:bg-primary/5";
              }
              return (
                <button
                  key={choice.value}
                  onClick={() => handleAnswer(choice.value)}
                  disabled={showResult}
                  className={buttonClass}
                  data-testid={`phishing-choice-${choice.value}`}
                >
                  <span className="flex items-center gap-3">
                    {showResult ? (
                      isCorrectAnswer ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" /> : isSelected ? <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" /> : <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className="text-[0.95rem]">{choice.label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300" data-testid="phishing-result">
              <div className={`rounded-xl p-5 border-2 ${progress.phishingScores[current.id] ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"}`}>
                <p className="font-semibold mb-2 flex items-center gap-2">
                  {progress.phishingScores[current.id]
                    ? <><CheckCircle className="w-5 h-5 text-green-600" /> Correct!</>
                    : <><AlertTriangle className="w-5 h-5 text-amber-600" /> Not quite</>}
                </p>
                <p className="text-[0.95rem] leading-relaxed">{current.explanation}</p>
              </div>

              {current.redFlags.length > 0 && (
                <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-5 border border-red-200 dark:border-red-800">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Red Flags to Watch For
                  </h4>
                  <ul className="space-y-2">
                    {current.redFlags.map((flag, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                        <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={handleNext} className="rounded-full" data-testid="button-next-phishing">
                  {currentIndex < regionScenarios.length - 1 ? "Next Scenario" : "Start Over"}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const policyIcons: Record<string, typeof Shield> = {
  monitor: Monitor,
  key: Key,
  smartphone: Smartphone,
  "alert-triangle": AlertTriangle,
  "folder-lock": FolderLock,
  home: Home
};

export function PolicyTemplateBuilder({ templates }: { templates: PolicyTemplate[] }) {
  const [progress, setProgress] = useState<BusinessProgress>(loadProgress);
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showPolicy, setShowPolicy] = useState(false);

  const template = templates.find(t => t.id === selectedPolicy);

  const selectPolicy = (id: string) => {
    setSelectedPolicy(id);
    setAnswers({});
    setShowPolicy(false);
  };

  const answerQuestion = (qId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const generatePolicy = () => {
    if (!template) return;
    setShowPolicy(true);
    setProgress(prev => {
      const next = {
        ...prev,
        policiesCompleted: prev.policiesCompleted.includes(template.id) ? prev.policiesCompleted : [...prev.policiesCompleted, template.id],
        lastActivity: new Date().toISOString()
      };
      saveProgress(next);
      return next;
    });
  };

  const allQuestionsAnswered = template ? template.questions.every(q => answers[q.id]) : false;

  if (!selectedPolicy) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-950/30 dark:to-fuchsia-950/30 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-foreground">Policy Template Builder</span>
          </div>
          <p className="text-sm text-muted-foreground">Select a policy type, answer a few questions about your business, and receive a customized policy outline with key sections and sample language.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(t => {
            const Icon = policyIcons[t.icon] || FileText;
            const completed = progress.policiesCompleted.includes(t.id);
            return (
              <Card
                key={t.id}
                className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/30"
                onClick={() => selectPolicy(t.id)}
                data-testid={`policy-card-${t.id}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-purple-600" />
                    </div>
                    {completed && <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 text-xs">Completed</Badge>}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{t.name}</h3>
                  <p className="text-sm text-muted-foreground">{t.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="text-xs">{t.questions.length} questions</Badge>
                    <Badge variant="outline" className="text-xs">{t.sections.length} sections</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  if (!template) return null;

  const Icon = policyIcons[template.icon] || FileText;

  if (showPolicy) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setSelectedPolicy(null)} data-testid="button-back-to-policies">
          <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> All Policies
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
                <Icon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>{template.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">Policy outline based on your answers</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-xl p-4 border">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Your Configuration</h4>
              <div className="space-y-1">
                {template.questions.map(q => (
                  <div key={q.id} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{q.question}</span>
                    <span className="font-medium text-foreground ml-auto">{answers[q.id]}</span>
                  </div>
                ))}
              </div>
            </div>

            {template.sections.map((section, i) => (
              <div key={i} className="border-l-4 border-purple-300 dark:border-purple-700 pl-4">
                <h4 className="font-semibold text-foreground mb-1">Section {i + 1}: {section.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{section.description}</p>
                <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <p className="text-sm text-purple-800 dark:text-purple-200 italic leading-relaxed">{section.sampleLanguage}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => { setShowPolicy(false); setAnswers({}); }} data-testid="button-reconfigure-policy">
            <RotateCcw className="w-4 h-4 mr-2" /> Reconfigure
          </Button>
          <Button variant="outline" onClick={() => setSelectedPolicy(null)} data-testid="button-another-policy">
            Build Another Policy
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => setSelectedPolicy(null)} data-testid="button-back-to-policy-list">
        <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> All Policies
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
              <Icon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle>{template.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">{template.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {template.questions.map((q, i) => (
            <div key={q.id} data-testid={`policy-question-${q.id}`}>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {i + 1}. {q.question}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {q.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => answerQuestion(q.id, opt)}
                    className={`p-3 rounded-lg border-2 text-sm text-left transition-all ${answers[q.id] === opt ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20 text-foreground" : "border-muted hover:border-purple-300 text-muted-foreground"}`}
                    data-testid={`policy-option-${q.id}-${opt.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-2">
            <Button onClick={generatePolicy} disabled={!allQuestionsAnswered} data-testid="button-generate-policy">
              <FileText className="w-4 h-4 mr-2" /> Generate Policy Outline
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const incidentIcons: Record<string, typeof Shield> = {
  lock: Lock,
  database: Server,
  mail: Mail,
  "user-x": Users,
  "user-minus": Users
};

export function IncidentResponseFlowchart({ incidents }: { incidents: IncidentType[] }) {
  const [progress, setProgress] = useState<BusinessProgress>(loadProgress);
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [stepHistory, setStepHistory] = useState<string[]>([]);
  const [showContacts, setShowContacts] = useState(false);
  const [contactRegion, setContactRegion] = useState<RegionCode>("US");

  const incident = incidents.find(i => i.id === selectedIncident);
  const currentStep = incident?.steps.find(s => s.id === currentStepId);

  const startIncident = (id: string) => {
    const inc = incidents.find(i => i.id === id);
    if (!inc) return;
    setSelectedIncident(id);
    setCurrentStepId(inc.steps[0].id);
    setStepHistory([inc.steps[0].id]);
    setShowContacts(false);
    setProgress(prev => {
      const next = {
        ...prev,
        incidentsExplored: prev.incidentsExplored.includes(id) ? prev.incidentsExplored : [...prev.incidentsExplored, id],
        lastActivity: new Date().toISOString()
      };
      saveProgress(next);
      return next;
    });
  };

  const selectOption = (nextId: string | null) => {
    if (nextId) {
      setCurrentStepId(nextId);
      setStepHistory(prev => [...prev, nextId]);
    } else {
      setShowContacts(true);
    }
  };

  const goBack = () => {
    if (stepHistory.length > 1) {
      const newHistory = stepHistory.slice(0, -1);
      setStepHistory(newHistory);
      setCurrentStepId(newHistory[newHistory.length - 1]);
      setShowContacts(false);
    }
  };

  const exitIncident = () => {
    setSelectedIncident(null);
    setCurrentStepId(null);
    setStepHistory([]);
    setShowContacts(false);
  };

  if (!selectedIncident) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-xl p-5 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-foreground">Incident Response Decision Tree</span>
          </div>
          <p className="text-sm text-muted-foreground">Select an incident type to walk through a step-by-step response plan with actionable guidance and region-specific reporting contacts.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {incidents.map(inc => {
            const Icon = incidentIcons[inc.icon] || AlertTriangle;
            const explored = progress.incidentsExplored.includes(inc.id);
            return (
              <Card
                key={inc.id}
                className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/30"
                onClick={() => startIncident(inc.id)}
                data-testid={`incident-card-${inc.id}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${inc.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    {explored && <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 text-xs">Explored</Badge>}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{inc.name}</h3>
                  <p className="text-sm text-muted-foreground">{inc.description}</p>
                  <Badge variant="outline" className="text-xs mt-3">{inc.steps.length} steps</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  if (!incident) return null;
  const Icon = incidentIcons[incident.icon] || AlertTriangle;
  const stepIndex = stepHistory.length;
  const totalSteps = incident.steps.length;

  if (showContacts) {
    const regionContacts = incident.reportingContacts.find(rc => rc.region === contactRegion);
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={exitIncident} data-testid="button-exit-incident">
          <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> All Incidents
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${incident.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>Reporting Contacts</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">Report this {incident.name.toLowerCase()} to the appropriate authorities</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(["US", "UK", "Canada", "Australia", "Africa"] as RegionCode[]).map(r => (
                <button
                  key={r}
                  onClick={() => setContactRegion(r)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${contactRegion === r ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}
                  data-testid={`contact-region-${r.toLowerCase()}`}
                >
                  {regionFlags[r]} {regionLabels[r]}
                </button>
              ))}
            </div>

            {regionContacts && (
              <div className="space-y-3">
                {regionContacts.contacts.map((contact, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border bg-muted/30" data-testid={`contact-${contact.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}>
                    <div>
                      <h4 className="font-semibold text-foreground">{contact.name}</h4>
                      <a href={contact.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">{contact.url}</a>
                      {contact.phone && <p className="text-sm text-muted-foreground mt-0.5">{contact.phone}</p>}
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a href={contact.url} target="_blank" rel="noopener noreferrer">Visit</a>
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={goBack} data-testid="button-incident-go-back">
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Back
              </Button>
              <Button variant="outline" onClick={exitIncident} data-testid="button-incident-done">
                Done
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentStep) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={exitIncident} data-testid="button-exit-incident-flow">
          <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Exit
        </Button>
        <Badge className={`${incident.color} text-white`}>{incident.name}</Badge>
      </div>

      <Progress value={(stepIndex / totalSteps) * 100} className="h-2" />

      <Card className="border-2">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">Step {stepIndex} of {totalSteps}</Badge>
            {stepHistory.length > 1 && (
              <Button variant="ghost" size="sm" onClick={goBack}>
                <ArrowRight className="w-3.5 h-3.5 mr-1 rotate-180" /> Back
              </Button>
            )}
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2">{currentStep.title}</h3>
          <p className="text-muted-foreground mb-6">{currentStep.description}</p>

          <div className="space-y-3">
            {currentStep.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => selectOption(opt.nextId)}
                className="w-full text-left p-4 rounded-xl border-2 border-muted hover:border-primary/50 hover:bg-primary/5 transition-all"
                data-testid={`incident-option-${i}`}
              >
                <div className="flex items-center gap-3">
                  <ChevronRight className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="font-medium text-foreground">{opt.label}</span>
                </div>
                {opt.actions && (
                  <ul className="mt-3 ml-8 space-y-1.5">
                    {opt.actions.map((action, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const industries = [
  "Technology", "Healthcare", "Financial Services", "Retail/E-commerce",
  "Manufacturing", "Professional Services", "Education", "Other"
];

export function SecurityBudgetCalculator({ tools }: { tools: SecurityTool[] }) {
  const [progress, setProgress] = useState<BusinessProgress>(loadProgress);
  const [companySize, setCompanySize] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const sizeLabel = companySize === "small" ? "1-25 employees" : companySize === "medium" ? "26-100 employees" : companySize === "large" ? "101-500 employees" : "";

  const toggleTool = (id: string) => {
    setSelectedTools(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const calculate = () => {
    setShowResults(true);
    setProgress(prev => {
      const next = { ...prev, budgetCalculated: true, lastActivity: new Date().toISOString() };
      saveProgress(next);
      return next;
    });
  };

  const reset = () => {
    setCompanySize("");
    setIndustry("");
    setSelectedTools([]);
    setShowResults(false);
  };

  const getPrice = (tool: SecurityTool): string => {
    if (companySize === "small") return tool.priceSmall;
    if (companySize === "medium") return tool.priceMedium;
    return tool.priceLarge;
  };

  const categories = Array.from(new Set(tools.map(t => t.category)));

  const parseRange = (priceStr: string): { low: number; high: number; unit: string } => {
    const isYearly = priceStr.includes("/yr");
    const cleaned = priceStr.replace(/[^0-9\-.,]/g, "");
    const parts = cleaned.split("-").map(s => parseFloat(s.replace(",", "")) || 0);
    return { low: parts[0] || 0, high: parts[1] || parts[0] || 0, unit: isYearly ? "yr" : "mo" };
  };

  const employeeCount = companySize === "small" ? 10 : companySize === "medium" ? 50 : 200;

  const estimateMonthly = (tool: SecurityTool): { low: number; high: number } => {
    const price = getPrice(tool);
    const { low, high, unit } = parseRange(price);
    const isPerUnit = price.includes("/user") || price.includes("/device");
    const multiplier = isPerUnit ? employeeCount : 1;
    const monthlyLow = unit === "yr" ? (low * multiplier) / 12 : low * multiplier;
    const monthlyHigh = unit === "yr" ? (high * multiplier) / 12 : high * multiplier;
    return { low: Math.round(monthlyLow), high: Math.round(monthlyHigh) };
  };

  if (showResults) {
    const selected = tools.filter(t => selectedTools.includes(t.id));
    const recommended = tools.filter(t => t.priority === "essential" && !selectedTools.includes(t.id));

    const totalMonthly = selected.reduce((acc, t) => {
      const est = estimateMonthly(t);
      return { low: acc.low + est.low, high: acc.high + est.high };
    }, { low: 0, high: 0 });

    const totalAnnual = { low: totalMonthly.low * 12, high: totalMonthly.high * 12 };

    const formatCurrency = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle>Security Budget Summary</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">{sizeLabel} · {industry} · ~{employeeCount} employees estimated</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {selected.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-4 border border-green-200 dark:border-green-800 text-center" data-testid="budget-monthly-estimate">
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Estimated Monthly</p>
                    <p className="text-xl font-bold text-green-700 dark:text-green-300">{formatCurrency(totalMonthly.low)} - {formatCurrency(totalMonthly.high)}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 text-center" data-testid="budget-annual-estimate">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Estimated Annual</p>
                    <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{formatCurrency(totalAnnual.low)} - {formatCurrency(totalAnnual.high)}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">Estimates based on ~{employeeCount} users/devices. Per-unit costs are multiplied accordingly. Flat-rate tools are counted once.</p>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Your Selected Security Stack</h4>
                  <div className="space-y-2">
                    {selected.map(tool => {
                      const est = estimateMonthly(tool);
                      return (
                        <div key={tool.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30" data-testid={`budget-tool-${tool.id}`}>
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-foreground text-sm">{tool.name}</span>
                            <p className="text-xs text-muted-foreground">{tool.category}</p>
                          </div>
                          <div className="text-right ml-2 flex-shrink-0">
                            <Badge variant="outline" className="text-sm font-semibold">{getPrice(tool)}</Badge>
                            <p className="text-[10px] text-muted-foreground mt-0.5">~${est.low}-${est.high}/mo total</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              </>
            )}

            {recommended.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Recommended Additions
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">These essential tools are not in your current selection:</p>
                <ul className="space-y-2">
                  {recommended.map(tool => (
                    <li key={tool.id} className="flex items-center justify-between text-sm">
                      <span className="text-amber-700 dark:text-amber-300">{tool.name}</span>
                      <span className="text-amber-600 dark:text-amber-400 font-medium">{getPrice(tool)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" /> ROI Talking Points for Leadership
              </h4>
              <ul className="space-y-2">
                {selected.slice(0, 5).map(tool => (
                  <li key={tool.id} className="flex items-start gap-2 text-sm text-blue-700 dark:text-blue-300">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />
                    <span><strong>{tool.name}:</strong> {tool.roiPoint}</span>
                  </li>
                ))}
                {selected.length === 0 && (
                  <li className="text-sm text-blue-700 dark:text-blue-300">Select tools above to see ROI justifications.</li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-3">
          <Button onClick={reset} data-testid="button-recalculate-budget">
            <RotateCcw className="w-4 h-4 mr-2" /> Start Over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-5 border border-green-200 dark:border-green-800">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-foreground">Security Budget Calculator</span>
        </div>
        <p className="text-sm text-muted-foreground">Select your company size, industry, and the security tools you need. Get estimated costs and ROI justification for leadership.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Company Size</label>
          <div className="space-y-2">
            {[
              { value: "small", label: "Small (1-25 employees)" },
              { value: "medium", label: "Medium (26-100 employees)" },
              { value: "large", label: "Large (101-500 employees)" }
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setCompanySize(opt.value)}
                className={`w-full p-3 rounded-lg border-2 text-sm text-left transition-all ${companySize === opt.value ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "border-muted hover:border-green-300"}`}
                data-testid={`size-${opt.value}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Industry</label>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {industries.map(ind => (
              <button
                key={ind}
                onClick={() => setIndustry(ind)}
                className={`w-full p-3 rounded-lg border-2 text-sm text-left transition-all ${industry === ind ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "border-muted hover:border-green-300"}`}
                data-testid={`industry-${ind.toLowerCase().replace(/[^a-z0-9]/gi, '-')}`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>
      </div>

      {companySize && industry && (
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Select Security Tools</h3>
          {categories.map(cat => {
            const catTools = tools.filter(t => t.category === cat);
            return (
              <Card key={cat}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{cat}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {catTools.map(tool => {
                      const isSelected = selectedTools.includes(tool.id);
                      return (
                        <li key={tool.id}>
                          <button
                            onClick={() => toggleTool(tool.id)}
                            className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${isSelected ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800" : "bg-muted/30 border border-transparent hover:bg-muted/60"}`}
                            data-testid={`tool-${tool.id}`}
                          >
                            {isSelected ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /> : <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground">{tool.name}</span>
                                <Badge className={`text-[10px] ${tool.priority === "essential" ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300" : tool.priority === "recommended" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}>
                                  {tool.priority === "essential" ? "Essential" : tool.priority === "recommended" ? "Recommended" : "Nice to Have"}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">{tool.description}</p>
                            </div>
                            <span className="text-sm font-medium text-foreground ml-2 flex-shrink-0">{getPrice(tool)}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            );
          })}

          <div className="flex justify-center pt-2">
            <Button size="lg" onClick={calculate} disabled={selectedTools.length === 0} data-testid="button-calculate-budget">
              <DollarSign className="w-5 h-5 mr-2" /> Calculate Budget
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
