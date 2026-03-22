import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle, Circle, RotateCcw, ChevronRight, ChevronDown,
  Shield, AlertTriangle, Heart, Phone, TrendingUp, Users, Mail,
  Smartphone, Wallet, Globe, ArrowRight, HelpCircle, XCircle
} from "lucide-react";
import type {
  ScamScenario, SafetyChecklistCategory, DeepDiveModule,
  EmergencyFlowStep, ScamStat, FamilyConversation
} from "./scenario-data";

const STORAGE_KEY = "seniors-hub-progress";

interface SeniorsProgress {
  scenarioScores: Record<string, boolean>;
  checklistCompleted: Record<string, string[]>;
  deepDiveScores: Record<string, number>;
  lastActivity: string;
}

function loadProgress(): SeniorsProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { scenarioScores: {}, checklistCompleted: {}, deepDiveScores: {}, lastActivity: "" };
}

function saveProgress(progress: SeniorsProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {}
}

const regionLabels: Record<string, string> = {
  US: "United States",
  UK: "United Kingdom",
  Canada: "Canada",
  Australia: "Australia",
  Africa: "Africa"
};

const regionFlags: Record<string, string> = {
  US: "🇺🇸",
  UK: "🇬🇧",
  Canada: "🇨🇦",
  Australia: "🇦🇺",
  Africa: "🌍"
};

const typeIcons: Record<string, typeof Phone> = {
  phone: Phone,
  email: Mail,
  text: Smartphone,
  social: Users,
  "in-person": Globe
};

export function ScamScenarioExercise({ scenarios }: { scenarios: ScamScenario[] }) {
  const [progress, setProgress] = useState<SeniorsProgress>(loadProgress);
  const [activeRegion, setActiveRegion] = useState("US");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const regionScenarios = scenarios.filter(s => s.region === activeRegion);
  const current = regionScenarios[currentIndex];
  const regions = [...new Set(scenarios.map(s => s.region))];

  const regionStats = (region: string) => {
    const rs = scenarios.filter(s => s.region === region);
    const answered = rs.filter(s => progress.scenarioScores[s.id] !== undefined).length;
    const correct = rs.filter(s => progress.scenarioScores[s.id] === true).length;
    return { total: rs.length, answered, correct };
  };

  const handleAnswer = (value: string) => {
    if (showResult) return;
    setSelectedAnswer(value);
    setShowResult(true);

    const isCorrect = current.isScam ? value === "scam" : value === "legitimate";
    setProgress(prev => {
      const next = { ...prev, scenarioScores: { ...prev.scenarioScores, [current.id]: isCorrect }, lastActivity: new Date().toISOString() };
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

  const handleRegionChange = (region: string) => {
    setActiveRegion(region);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const resetRegion = () => {
    setProgress(prev => {
      const rs = scenarios.filter(s => s.region === activeRegion);
      const next = { ...prev, scenarioScores: { ...prev.scenarioScores } };
      rs.forEach(s => delete next.scenarioScores[s.id]);
      saveProgress(next);
      return next;
    });
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (!current) return null;

  const stats = regionStats(activeRegion);
  const TypeIcon = typeIcons[current.type] || Mail;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" data-testid="region-tabs">
        {regions.map(r => {
          const s = regionStats(r);
          return (
            <button
              key={r}
              onClick={() => handleRegionChange(r)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeRegion === r
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              }`}
              data-testid={`region-tab-${r.toLowerCase()}`}
            >
              <span>{regionFlags[r]}</span>
              <span>{regionLabels[r]}</span>
              {s.answered > 0 && (
                <Badge variant="secondary" className="text-xs ml-1">
                  {s.correct}/{s.total}
                </Badge>
              )}
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
          <Button variant="ghost" size="sm" onClick={resetRegion} data-testid="button-reset-scenarios">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset
          </Button>
        )}
      </div>

      <Progress value={(stats.answered / stats.total) * 100} className="h-2" />

      <Card className="border-2" data-testid={`scenario-card-${current.id}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TypeIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{current.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">{current.description}</p>
            </div>
            <Badge variant="outline" className="text-xs capitalize">{current.type}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="bg-muted/50 rounded-xl p-5 border text-[0.95rem] leading-relaxed whitespace-pre-line font-mono" data-testid="scenario-content">
            {current.content}
          </div>

          <div className="space-y-2.5">
            {current.choices.map((choice) => {
              const isSelected = selectedAnswer === choice.value;
              const isCorrectAnswer = current.isScam ? choice.value === "scam" : choice.value === "legitimate";
              let buttonClass = "w-full justify-start text-left p-4 h-auto rounded-xl border-2 transition-all ";
              if (showResult) {
                if (isCorrectAnswer) {
                  buttonClass += "border-green-500 bg-green-50 dark:bg-green-950/30 text-foreground";
                } else if (isSelected && !isCorrectAnswer) {
                  buttonClass += "border-red-500 bg-red-50 dark:bg-red-950/30 text-foreground";
                } else {
                  buttonClass += "border-muted bg-muted/30 text-muted-foreground opacity-60";
                }
              } else {
                buttonClass += "border-muted hover:border-primary/50 hover:bg-primary/5";
              }
              return (
                <button
                  key={choice.value}
                  onClick={() => handleAnswer(choice.value)}
                  disabled={showResult}
                  className={buttonClass}
                  data-testid={`choice-${choice.value}`}
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
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300" data-testid="scenario-result">
              <div className={`rounded-xl p-5 border-2 ${
                progress.scenarioScores[current.id]
                  ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                  : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
              }`}>
                <p className="font-semibold mb-2 flex items-center gap-2">
                  {progress.scenarioScores[current.id]
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
                <Button onClick={handleNext} className="rounded-full" data-testid="button-next-scenario">
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

export function SafetyChecklist({ checklists }: { checklists: SafetyChecklistCategory[] }) {
  const [progress, setProgress] = useState<SeniorsProgress>(loadProgress);
  const [activeCategory, setActiveCategory] = useState(checklists[0]?.id || "");

  const toggleStep = (categoryId: string, stepId: string) => {
    setProgress(prev => {
      const steps = prev.checklistCompleted[categoryId] || [];
      const updated = steps.includes(stepId)
        ? steps.filter(s => s !== stepId)
        : [...steps, stepId];
      const next = { ...prev, checklistCompleted: { ...prev.checklistCompleted, [categoryId]: updated }, lastActivity: new Date().toISOString() };
      saveProgress(next);
      return next;
    });
  };

  const resetCategory = (categoryId: string) => {
    setProgress(prev => {
      const next = { ...prev, checklistCompleted: { ...prev.checklistCompleted, [categoryId]: [] } };
      saveProgress(next);
      return next;
    });
  };

  const totalSteps = checklists.reduce((sum, c) => sum + c.steps.length, 0);
  const totalCompleted = checklists.reduce((sum, c) => sum + (progress.checklistCompleted[c.id] || []).length, 0);
  const overallPct = totalSteps > 0 ? Math.round((totalCompleted / totalSteps) * 100) : 0;

  const active = checklists.find(c => c.id === activeCategory);
  const activeCompleted = progress.checklistCompleted[activeCategory] || [];
  const activePct = active ? Math.round((activeCompleted.length / active.steps.length) * 100) : 0;

  const categoryIcons: Record<string, typeof Shield> = {
    smartphone: Smartphone,
    wallet: Wallet,
    users: Users,
    mail: Mail
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-foreground">Overall Safety Progress</span>
          </div>
          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{overallPct}%</span>
        </div>
        <Progress value={overallPct} className="h-3" />
        <p className="text-xs text-muted-foreground mt-2">{totalCompleted} of {totalSteps} steps completed</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {checklists.map(c => {
          const completed = (progress.checklistCompleted[c.id] || []).length;
          const pct = Math.round((completed / c.steps.length) * 100);
          const Icon = categoryIcons[c.icon] || Shield;
          return (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                activeCategory === c.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-muted hover:border-primary/30"
              }`}
              data-testid={`checklist-tab-${c.id}`}
            >
              <Icon className={`w-5 h-5 mb-2 ${activeCategory === c.id ? "text-primary" : "text-muted-foreground"}`} />
              <div className="text-sm font-medium truncate">{c.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{completed}/{c.steps.length} · {pct}%</div>
            </button>
          );
        })}
      </div>

      {active && (
        <Card data-testid={`checklist-${active.id}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{active.title}</CardTitle>
              {activeCompleted.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => resetCategory(active.id)} data-testid="button-reset-checklist">
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset
                </Button>
              )}
            </div>
            <Progress value={activePct} className="h-2 mt-2" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {active.steps.map(step => {
                const checked = activeCompleted.includes(step.id);
                return (
                  <li key={step.id}>
                    <button
                      onClick={() => toggleStep(active.id, step.id)}
                      className={`w-full text-left flex items-start gap-3 p-3 rounded-lg border transition-all ${
                        checked
                          ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                          : "hover:bg-muted/50 border-transparent"
                      }`}
                      data-testid={`step-${step.id}`}
                    >
                      {checked ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <span className={`text-[0.95rem] font-medium ${checked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {step.label}
                        </span>
                        <p className="text-sm text-muted-foreground mt-1">{step.detail}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function ScamDeepDive({ modules }: { modules: DeepDiveModule[] }) {
  const [progress, setProgress] = useState<SeniorsProgress>(loadProgress);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);

  const moduleIcons: Record<string, typeof Heart> = {
    heart: Heart,
    phone: Phone,
    "trending-up": TrendingUp,
    shield: Shield,
    users: Users
  };

  const active = modules.find(m => m.id === activeModule);

  const handleAnswer = (index: number) => {
    if (showResult || !active) return;
    setSelectedAnswer(index);
    setShowResult(true);
    const isCorrect = index === active.scenarios[currentQ].correctIndex;
    if (isCorrect) setSessionScore(s => s + 1);
    setSessionTotal(t => t + 1);
  };

  const handleNext = () => {
    if (!active) return;
    if (currentQ < active.scenarios.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setProgress(prev => {
        const next = { ...prev, deepDiveScores: { ...prev.deepDiveScores, [active.id]: sessionScore }, lastActivity: new Date().toISOString() };
        saveProgress(next);
        return next;
      });
    }
  };

  const startModule = (id: string) => {
    setActiveModule(id);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setSessionScore(0);
    setSessionTotal(0);
  };

  const exitModule = () => {
    setActiveModule(null);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (!active) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map(m => {
          const Icon = moduleIcons[m.icon] || Shield;
          const prevScore = progress.deepDiveScores[m.id];
          return (
            <Card
              key={m.id}
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/30"
              onClick={() => startModule(m.id)}
              data-testid={`deepdive-card-${m.id}`}
            >
              <CardContent className="p-5">
                <div className={`w-12 h-12 rounded-xl ${m.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{m.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{m.intro.slice(0, 80)}...</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{m.scenarios.length} questions</Badge>
                  {prevScore !== undefined && (
                    <Badge variant="secondary" className="text-xs">
                      Best: {prevScore}/{m.scenarios.length}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  const scenario = active.scenarios[currentQ];
  const Icon = moduleIcons[active.icon] || Shield;
  const isComplete = currentQ === active.scenarios.length - 1 && showResult;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={exitModule} data-testid="button-exit-deepdive">
          <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> All Modules
        </Button>
        <div className="flex-1" />
        <span className="text-sm text-muted-foreground">
          Question {currentQ + 1} of {active.scenarios.length}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 rounded-xl ${active.color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-bold text-lg">{active.title}</h3>
      </div>

      <Progress value={((currentQ + (showResult ? 1 : 0)) / active.scenarios.length) * 100} className="h-2" />

      {!isComplete ? (
        <Card className="border-2" data-testid="deepdive-question">
          <CardContent className="p-6 space-y-5">
            <p className="text-[0.95rem] leading-relaxed">{scenario.prompt}</p>

            <div className="space-y-2.5">
              {scenario.options.map((option, i) => {
                let cls = "w-full justify-start text-left p-4 h-auto rounded-xl border-2 transition-all ";
                if (showResult) {
                  if (i === scenario.correctIndex) {
                    cls += "border-green-500 bg-green-50 dark:bg-green-950/30";
                  } else if (i === selectedAnswer) {
                    cls += "border-red-500 bg-red-50 dark:bg-red-950/30";
                  } else {
                    cls += "border-muted opacity-50";
                  }
                } else {
                  cls += "border-muted hover:border-primary/50 hover:bg-primary/5";
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={showResult}
                    className={cls}
                    data-testid={`deepdive-option-${i}`}
                  >
                    <span className="flex items-center gap-3">
                      {showResult ? (
                        i === scenario.correctIndex ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" /> : i === selectedAnswer ? <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" /> : <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="text-[0.95rem]">{option}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className={`rounded-xl p-5 border ${
                  selectedAnswer === scenario.correctIndex
                    ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                    : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                }`}>
                  <p className="text-[0.95rem] leading-relaxed">{scenario.explanation}</p>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleNext} className="rounded-full" data-testid="button-next-deepdive">
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-primary/30" data-testid="deepdive-complete">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Module Complete!</h3>
            <p className="text-lg">
              You scored <span className="font-bold text-primary">{sessionScore}</span> out of{" "}
              <span className="font-bold">{active.scenarios.length}</span>
            </p>
            <p className="text-muted-foreground">
              {sessionScore === active.scenarios.length
                ? "Perfect score! You can spot these scams like a pro."
                : sessionScore >= active.scenarios.length * 0.6
                ? "Good work! Review the explanations for the ones you missed."
                : "Keep practicing! Understanding these patterns takes time."}
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <Button variant="outline" onClick={() => startModule(active.id)} className="rounded-full" data-testid="button-retry-deepdive">
                <RotateCcw className="w-4 h-4 mr-1.5" /> Try Again
              </Button>
              <Button onClick={exitModule} className="rounded-full" data-testid="button-all-modules">
                All Modules
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function EmergencyFlowchart({ steps }: { steps: EmergencyFlowStep[] }) {
  const [path, setPath] = useState<string[]>(["start"]);
  const [finalActions, setFinalActions] = useState<string[] | null>(null);

  const currentId = path[path.length - 1];
  const current = steps.find(s => s.id === currentId);

  const handleChoice = (option: { label: string; nextId: string | null; actions?: string[] }) => {
    if (option.nextId) {
      setPath([...path, option.nextId]);
      setFinalActions(null);
    } else if (option.actions) {
      setFinalActions(option.actions);
    }
  };

  const reset = () => {
    setPath(["start"]);
    setFinalActions(null);
  };

  const goBack = () => {
    if (path.length > 1) {
      setPath(path.slice(0, -1));
      setFinalActions(null);
    }
  };

  if (!current) return null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-xl p-5 border border-red-200 dark:border-red-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Emergency Action Guide</h3>
            <p className="text-sm text-muted-foreground">Answer the questions below to get specific steps for your situation.</p>
          </div>
        </div>
      </div>

      {path.length > 1 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          {path.map((stepId, i) => {
            const s = steps.find(st => st.id === stepId);
            return (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
                <span className={i === path.length - 1 ? "font-medium text-foreground" : ""}>
                  {s?.question.slice(0, 30)}{(s?.question.length || 0) > 30 ? "..." : ""}
                </span>
              </span>
            );
          })}
        </div>
      )}

      {!finalActions ? (
        <Card className="border-2" data-testid="emergency-question">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-xl font-bold text-foreground">{current.question}</h3>
            <div className="space-y-2.5">
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(opt)}
                  className="w-full text-left p-4 rounded-xl border-2 border-muted hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center gap-3"
                  data-testid={`emergency-option-${i}`}
                >
                  <ChevronRight className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-[0.95rem]">{opt.label}</span>
                </button>
              ))}
            </div>
            {path.length > 1 && (
              <Button variant="ghost" size="sm" onClick={goBack} data-testid="button-emergency-back">
                <ArrowRight className="w-4 h-4 mr-1.5 rotate-180" /> Go Back
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-green-300 dark:border-green-700" data-testid="emergency-actions">
          <CardContent className="p-6 space-y-5">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Steps to Take Right Now
            </h3>
            <ol className="space-y-4">
              {finalActions.map((action, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-[0.95rem] leading-relaxed">{action}</span>
                </li>
              ))}
            </ol>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={goBack} className="rounded-full" data-testid="button-actions-back">
                <ArrowRight className="w-4 h-4 mr-1.5 rotate-180" /> Go Back
              </Button>
              <Button variant="outline" onClick={reset} className="rounded-full" data-testid="button-actions-restart">
                <RotateCcw className="w-4 h-4 mr-1.5" /> Start Over
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function ScamStatsInfographic({ stats }: { stats: ScamStat[] }) {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(index)) {
              setVisibleCards(prev => new Set([...prev, index]));
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = containerRef.current?.querySelectorAll("[data-index]");
    cards?.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">The Scale of the Problem</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Understanding the scope of scam losses helps us stay vigilant. These numbers represent real people and real losses.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            data-index={i}
            className={`rounded-xl p-6 border-2 bg-card transition-all duration-700 ${
              visibleCards.has(i)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: `${i * 100}ms` }}
            data-testid={`stat-card-${i}`}
          >
            <div className={`w-3 h-3 rounded-full ${stat.color} mb-3`} />
            <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-foreground mb-2">{stat.label}</div>
            <p className="text-xs text-muted-foreground leading-relaxed">{stat.detail}</p>
            <p className="text-xs text-primary mt-2">{stat.source}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FamilyCommunicationToolkit({ conversations }: { conversations: FamilyConversation[] }) {
  const [activeTopic, setActiveTopic] = useState(conversations[0]?.id || "");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["opener"]));

  const active = conversations.find(c => c.id === activeTopic);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  if (!active) return null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-purple-600" />
          <div>
            <h3 className="font-bold text-foreground">Family Communication Toolkit</h3>
            <p className="text-sm text-muted-foreground">Guides for adult children helping aging parents discuss scam risks respectfully.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {conversations.map(c => (
          <button
            key={c.id}
            onClick={() => { setActiveTopic(c.id); setExpandedSections(new Set(["opener"])); }}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              activeTopic === c.id
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 font-medium"
                : "bg-muted/60 text-muted-foreground hover:bg-muted"
            }`}
            data-testid={`family-topic-${c.id}`}
          >
            {c.topic.length > 30 ? c.topic.slice(0, 30) + "..." : c.topic}
          </button>
        ))}
      </div>

      <Card data-testid={`family-guide-${active.id}`}>
        <CardHeader>
          <CardTitle className="text-lg">{active.topic}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <button
            onClick={() => toggleSection("opener")}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800"
            data-testid="toggle-opener"
          >
            <span className="font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" /> Conversation Opener
            </span>
            <ChevronDown className={`w-4 h-4 text-purple-600 transition-transform ${expandedSections.has("opener") ? "rotate-180" : ""}`} />
          </button>
          {expandedSections.has("opener") && (
            <div className="bg-purple-50/50 dark:bg-purple-950/10 rounded-lg p-4 border border-purple-100 dark:border-purple-900 ml-2">
              <p className="text-foreground italic text-[0.95rem] leading-relaxed">"{active.opener}"</p>
            </div>
          )}

          <button
            onClick={() => toggleSection("dos")}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
            data-testid="toggle-dos"
          >
            <span className="font-semibold text-green-800 dark:text-green-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Do's
            </span>
            <ChevronDown className={`w-4 h-4 text-green-600 transition-transform ${expandedSections.has("dos") ? "rotate-180" : ""}`} />
          </button>
          {expandedSections.has("dos") && (
            <ul className="space-y-2 ml-2">
              {active.dos.map((d, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{d}</span>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={() => toggleSection("donts")}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
            data-testid="toggle-donts"
          >
            <span className="font-semibold text-red-800 dark:text-red-200 flex items-center gap-2">
              <XCircle className="w-4 h-4" /> Don'ts
            </span>
            <ChevronDown className={`w-4 h-4 text-red-600 transition-transform ${expandedSections.has("donts") ? "rotate-180" : ""}`} />
          </button>
          {expandedSections.has("donts") && (
            <ul className="space-y-2 ml-2">
              {active.donts.map((d, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{d}</span>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={() => toggleSection("followups")}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800"
            data-testid="toggle-followups"
          >
            <span className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
              <ArrowRight className="w-4 h-4" /> Follow-Up Suggestions
            </span>
            <ChevronDown className={`w-4 h-4 text-blue-600 transition-transform ${expandedSections.has("followups") ? "rotate-180" : ""}`} />
          </button>
          {expandedSections.has("followups") && (
            <ul className="space-y-2 ml-2">
              {active.followUps.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground italic">"{f}"</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
