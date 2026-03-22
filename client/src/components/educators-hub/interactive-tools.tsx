import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle, Circle, RotateCcw, ChevronRight, ChevronDown, ChevronUp,
  Shield, AlertTriangle, Star, BookOpen, Clock, Users,
  GraduationCap, ClipboardList, FileText, Search, Key,
  Footprints, Mail, Lightbulb, ArrowRight, XCircle, Filter
} from "lucide-react";
import type {
  LessonPlanTemplate, ClassroomActivity, AssessmentQuestion,
  CurriculumStandard, ClassroomMaterial, TopicName
} from "./activity-data";
import { topicsList, gradeBands, durations } from "./activity-data";

const STORAGE_KEY = "educators-hub-progress";

interface EducatorProgress {
  lessonsViewed: string[];
  activitiesStarted: string[];
  quizScores: Record<string, number>;
  materialsViewed: string[];
  lastActivity: string;
}

function loadProgress(): EducatorProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { lessonsViewed: [], activitiesStarted: [], quizScores: {}, materialsViewed: [], lastActivity: "" };
}

function saveProgress(progress: EducatorProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {}
}

const topicColors: Record<string, string> = {
  "Digital Citizenship": "bg-blue-500",
  "Cyberbullying Prevention": "bg-red-500",
  "Privacy & Security": "bg-green-500",
  "Media Literacy": "bg-purple-500",
  "Responsible Gaming": "bg-orange-500",
  "School Technology Safety": "bg-teal-500"
};

const durationLabels: Record<string, string> = {
  "15-min": "15 Minutes",
  "30-min": "30 Minutes",
  "45-min": "45 Minutes",
  "full-period": "Full Period"
};

export function LessonPlanGenerator({ lessons }: { lessons: LessonPlanTemplate[] }) {
  const [progress, setProgress] = useState<EducatorProgress>(loadProgress);
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedDuration, setSelectedDuration] = useState<string>("all");
  const [activePlan, setActivePlan] = useState<string | null>(null);

  const filtered = lessons.filter(l => {
    if (selectedTopic !== "all" && l.topic !== selectedTopic) return false;
    if (selectedGrade !== "all" && l.gradeBand !== selectedGrade) return false;
    if (selectedDuration !== "all" && l.duration !== selectedDuration) return false;
    return true;
  });

  const viewPlan = (id: string) => {
    setActivePlan(id);
    setProgress(prev => {
      if (prev.lessonsViewed.includes(id)) return prev;
      const next = { ...prev, lessonsViewed: [...prev.lessonsViewed, id], lastActivity: new Date().toISOString() };
      saveProgress(next);
      return next;
    });
  };

  const plan = filtered.find(l => l.id === activePlan);

  if (plan) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setActivePlan(null)} data-testid="button-back-to-lessons">
          <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Back to Lesson Plans
        </Button>

        <Card className="border-2">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-xl" data-testid="text-lesson-title">{plan.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge className={`${topicColors[plan.topic]} text-white`}>{plan.topic}</Badge>
                  <Badge variant="outline">{plan.gradeBand}</Badge>
                  <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />{durationLabels[plan.duration]}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" /> Learning Objectives
              </h4>
              <ul className="space-y-2">
                {plan.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-blue-700 dark:text-blue-300">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-5 border border-amber-200 dark:border-amber-800">
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
                <ClipboardList className="w-4 h-4" /> Materials Needed
              </h4>
              <ul className="space-y-1.5">
                {plan.materials.map((mat, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-300">
                    <span className="text-amber-500">•</span>{mat}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Procedure
              </h4>
              <ol className="space-y-3">
                {plan.procedure.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-sm text-green-700 dark:text-green-300 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-purple-50 dark:bg-purple-950/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> Assessment
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">{plan.assessment}</p>
            </div>

            <div className="bg-muted/50 rounded-xl p-5 border">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" /> Extensions
              </h4>
              <p className="text-sm text-muted-foreground">{plan.extensions}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-5 border border-indigo-200 dark:border-indigo-800">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-foreground">Filter Lesson Plans</span>
          <Badge variant="secondary" className="ml-auto">{filtered.length} results</Badge>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Topic</label>
            <select
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              data-testid="select-topic"
            >
              <option value="all">All Topics</option>
              {topicsList.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Grade Band</label>
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              data-testid="select-grade"
            >
              <option value="all">All Grades</option>
              {gradeBands.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Duration</label>
            <select
              value={selectedDuration}
              onChange={e => setSelectedDuration(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              data-testid="select-duration"
            >
              <option value="all">All Durations</option>
              {durations.map(d => <option key={d} value={d}>{durationLabels[d]}</option>)}
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No lesson plans match your filters. Try adjusting your selection.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(lesson => {
            const viewed = progress.lessonsViewed.includes(lesson.id);
            return (
              <Card
                key={lesson.id}
                className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/30 overflow-hidden"
                onClick={() => viewPlan(lesson.id)}
                data-testid={`lesson-card-${lesson.id}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <Badge className={`${topicColors[lesson.topic]} text-white text-xs`}>{lesson.topic}</Badge>
                    {viewed && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{lesson.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">{lesson.gradeBand}</Badge>
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />{durationLabels[lesson.duration]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">{lesson.objectives[0]}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground">
        {progress.lessonsViewed.length} of {lessons.length} lesson plans viewed
      </div>
    </div>
  );
}

export function ClassroomActivitySimulator({ activities }: { activities: ClassroomActivity[] }) {
  const [progress, setProgress] = useState<EducatorProgress>(loadProgress);
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTeacherNote, setShowTeacherNote] = useState(false);

  const activityIcons: Record<string, typeof Shield> = {
    mail: Mail,
    key: Key,
    footprints: Footprints,
    users: Users,
    shield: Shield
  };

  const active = activities.find(a => a.id === activeActivity);

  const startActivity = (id: string) => {
    setActiveActivity(id);
    setCurrentStep(0);
    setShowTeacherNote(false);
    setProgress(prev => {
      if (prev.activitiesStarted.includes(id)) return prev;
      const next = { ...prev, activitiesStarted: [...prev.activitiesStarted, id], lastActivity: new Date().toISOString() };
      saveProgress(next);
      return next;
    });
  };

  if (!active) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map(a => {
          const Icon = activityIcons[a.icon] || Shield;
          const started = progress.activitiesStarted.includes(a.id);
          return (
            <Card
              key={a.id}
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/30"
              onClick={() => startActivity(a.id)}
              data-testid={`activity-card-${a.id}`}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${a.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {started && <Badge variant="secondary" className="text-xs">Started</Badge>}
                </div>
                <h3 className="font-semibold text-foreground mb-1">{a.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{a.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">{a.gradeBand}</Badge>
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />{a.timeNeeded}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  const step = active.steps[currentStep];
  const Icon = activityIcons[active.icon] || Shield;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => setActiveActivity(null)} data-testid="button-exit-activity">
          <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> All Activities
        </Button>
        <div className="flex items-center gap-2 ml-auto">
          <div className={`w-8 h-8 rounded-lg ${active.color} flex items-center justify-center`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-foreground text-sm">{active.title}</span>
        </div>
      </div>

      <Progress value={((currentStep + 1) / active.steps.length) * 100} className="h-2" />
      <p className="text-sm text-muted-foreground text-center">Step {currentStep + 1} of {active.steps.length}</p>

      <Card className="border-2">
        <CardContent className="p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">{step.stepNumber}</span>
            <h3 className="font-semibold text-foreground text-lg leading-relaxed">{step.instruction}</h3>
          </div>

          <button
            onClick={() => setShowTeacherNote(!showTeacherNote)}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-left"
            data-testid="button-teacher-note"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-amber-800 dark:text-amber-200">
              <Lightbulb className="w-4 h-4" /> Teacher Note
            </span>
            {showTeacherNote ? <ChevronUp className="w-4 h-4 text-amber-600" /> : <ChevronDown className="w-4 h-4 text-amber-600" />}
          </button>
          {showTeacherNote && (
            <div className="bg-amber-50/50 dark:bg-amber-950/10 rounded-xl p-4 border border-amber-100 dark:border-amber-900 animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">{step.teacherNote}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentStep === 0}
              onClick={() => { setCurrentStep(currentStep - 1); setShowTeacherNote(false); }}
              data-testid="button-prev-step"
            >
              <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Previous
            </Button>
            {currentStep < active.steps.length - 1 ? (
              <Button
                size="sm"
                onClick={() => { setCurrentStep(currentStep + 1); setShowTeacherNote(false); }}
                data-testid="button-next-step"
              >
                Next Step <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 text-sm py-1.5 px-3">Activity Complete</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {currentStep === active.steps.length - 1 && (
        <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800" data-testid="debrief-section">
          <CardContent className="p-5">
            <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" /> Debrief Questions
            </h4>
            <ul className="space-y-2">
              {active.debrief.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-purple-700 dark:text-purple-300">
                  <span className="text-purple-500 font-bold">?</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function AssessmentQuizBuilder({ questions }: { questions: AssessmentQuestion[] }) {
  const [progress, setProgress] = useState<EducatorProgress>(loadProgress);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const topics = Array.from(new Set(questions.map(q => q.topic)));
  const filtered = selectedTopic ? questions.filter(q => q.topic === selectedTopic) : [];
  const question = filtered[currentIndex];

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    const isCorrect = question.options[index].isCorrect;
    if (isCorrect) setScore(s => s + 1);
    setAnswers(prev => [...prev, isCorrect]);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= filtered.length) {
      setFinished(true);
      if (selectedTopic) {
        setProgress(prev => {
          const next = { ...prev, quizScores: { ...prev.quizScores, [selectedTopic]: Math.max(prev.quizScores[selectedTopic] || 0, score) }, lastActivity: new Date().toISOString() };
          saveProgress(next);
          return next;
        });
      }
    } else {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const startQuiz = (topic: string) => {
    setSelectedTopic(topic);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setFinished(false);
    setAnswers([]);
  };

  const exitQuiz = () => {
    setSelectedTopic(null);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setFinished(false);
    setAnswers([]);
  };

  if (!selectedTopic) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-5 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-foreground">Assessment Quizzes</span>
          </div>
          <p className="text-sm text-muted-foreground">Select a topic to run a pre-built quiz. Each quiz has 8 questions with detailed explanations for every answer.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map(topic => {
            const count = questions.filter(q => q.topic === topic).length;
            const prevScore = progress.quizScores[topic];
            return (
              <Card
                key={topic}
                className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/30"
                onClick={() => startQuiz(topic)}
                data-testid={`quiz-topic-${topic.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
              >
                <CardContent className="p-5">
                  <div className={`w-10 h-10 rounded-xl ${topicColors[topic] || "bg-gray-500"} flex items-center justify-center mb-3`}>
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{topic}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{count} questions</Badge>
                    {prevScore !== undefined && (
                      <Badge variant="secondary" className="text-xs">Best: {prevScore}/{count}</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / filtered.length) * 100);
    const topicQuestions = questions.filter(q => q.topic === selectedTopic);
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={exitQuiz} data-testid="button-back-to-quizzes">
          <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> All Quizzes
        </Button>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${pct >= 80 ? "bg-green-100 dark:bg-green-900/30" : pct >= 50 ? "bg-amber-100 dark:bg-amber-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
              <Star className={`w-10 h-10 ${pct >= 80 ? "text-green-500" : pct >= 50 ? "text-amber-500" : "text-red-500"}`} />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2" data-testid="text-quiz-result">Quiz Complete!</h3>
            <p className="text-lg text-muted-foreground mb-1">Score: {score} out of {filtered.length} ({pct}%)</p>
            <p className="text-sm text-muted-foreground mb-6">
              {pct >= 80 ? "Excellent! Students who achieve this level have strong understanding." : pct >= 50 ? "Good effort. Review the missed topics for improvement areas." : "Consider reviewing the material before assigning this quiz."}
            </p>

            <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left">
              <h4 className="font-semibold text-foreground mb-3">Question Breakdown</h4>
              <div className="space-y-2">
                {topicQuestions.map((q, i) => (
                  <div key={q.id} className="flex items-center gap-2 text-sm">
                    {answers[i] ? (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    )}
                    <span className={answers[i] ? "text-foreground" : "text-muted-foreground"}>{q.question}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <Button onClick={() => startQuiz(selectedTopic)} data-testid="button-retry-quiz">
                <RotateCcw className="w-4 h-4 mr-2" /> Retry Quiz
              </Button>
              <Button variant="outline" onClick={exitQuiz} data-testid="button-choose-topic">
                Choose Another Topic
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={exitQuiz} data-testid="button-exit-quiz">
          <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Exit Quiz
        </Button>
        <Badge className={`${topicColors[selectedTopic] || "bg-gray-500"} text-white`}>{selectedTopic}</Badge>
      </div>

      <Progress value={((currentIndex + 1) / filtered.length) * 100} className="h-2" />

      <Card className="border-2">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">Question {currentIndex + 1} of {filtered.length}</Badge>
            <span className="text-sm text-muted-foreground">Score: {score}</span>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-5 leading-relaxed" data-testid="text-assessment-question">{question.question}</h3>

          <div className="space-y-3">
            {question.options.map((opt, idx) => {
              let classes = "w-full text-left p-4 rounded-xl border-2 transition-all ";
              if (showFeedback) {
                if (opt.isCorrect) classes += "border-green-500 bg-green-50 dark:bg-green-950/20";
                else if (idx === selectedAnswer) classes += "border-red-500 bg-red-50 dark:bg-red-950/20";
                else classes += "border-muted opacity-50";
              } else {
                classes += "border-muted hover:border-primary/50 hover:bg-muted/30";
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={classes}
                  disabled={showFeedback}
                  data-testid={`quiz-option-${idx}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-sm font-medium">{String.fromCharCode(65 + idx)}</span>
                    <span className="text-sm leading-relaxed">{opt.text}</span>
                  </div>
                  {showFeedback && (idx === selectedAnswer || opt.isCorrect) && (
                    <p className={`mt-3 text-sm leading-relaxed ml-10 ${opt.isCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>{opt.explanation}</p>
                  )}
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div className="flex justify-end mt-5">
              <Button onClick={handleNext} data-testid="button-next-quiz-question">
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

export function CurriculumAlignmentGuide({ standards }: { standards: CurriculumStandard[] }) {
  const [activeFramework, setActiveFramework] = useState<string>("all");
  const [activeTopic, setActiveTopic] = useState<string>("all");
  const [expandedStandard, setExpandedStandard] = useState<string | null>(null);

  const frameworks = Array.from(new Set(standards.map(s => s.framework)));

  const filtered = standards.filter(s => {
    if (activeFramework !== "all" && s.framework !== activeFramework) return false;
    if (activeTopic !== "all" && !s.topics.includes(activeTopic)) return false;
    return true;
  });

  const frameworkColors: Record<string, string> = {
    "ISTE": "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
    "CSTA": "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200",
    "Common Core": "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 rounded-xl p-5 border border-teal-200 dark:border-teal-800">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-teal-600" />
          <span className="font-semibold text-foreground">Curriculum Standards Alignment</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Map cybersecurity topics to education standards. Filter by framework and topic to find relevant alignments.</p>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Framework</label>
            <select
              value={activeFramework}
              onChange={e => setActiveFramework(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              data-testid="select-framework"
            >
              <option value="all">All Frameworks</option>
              {frameworks.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Topic</label>
            <select
              value={activeTopic}
              onChange={e => setActiveTopic(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              data-testid="select-curriculum-topic"
            >
              <option value="all">All Topics</option>
              {topicsList.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">{filtered.length} standard{filtered.length !== 1 ? "s" : ""} found</div>

      <div className="space-y-3">
        {filtered.map(standard => {
          const expanded = expandedStandard === standard.standardId;
          return (
            <Card key={standard.standardId} className="overflow-hidden">
              <button
                onClick={() => setExpandedStandard(expanded ? null : standard.standardId)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/20 transition-colors"
                data-testid={`standard-${standard.standardId.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Badge className={`text-xs flex-shrink-0 ${frameworkColors[standard.framework] || ""}`}>{standard.framework}</Badge>
                  <span className="font-medium text-foreground text-sm">{standard.standardId}</span>
                </div>
                {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
              </button>
              {expanded && (
                <div className="px-4 pb-4 border-t pt-4 space-y-3">
                  <p className="text-sm text-foreground leading-relaxed">{standard.description}</p>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Aligned Topics:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {standard.topics.map(t => (
                        <Badge key={t} className={`text-xs ${topicColors[t] || "bg-gray-500"} text-white`}>{t}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function ClassroomMaterialsGallery({ materials }: { materials: ClassroomMaterial[] }) {
  const [progress, setProgress] = useState<EducatorProgress>(loadProgress);
  const [expandedMaterial, setExpandedMaterial] = useState<string | null>(null);

  const materialIcons: Record<string, typeof Shield> = {
    shield: Shield,
    mail: Mail,
    key: Key,
    users: Users,
    footprints: Footprints,
    search: Search
  };

  const typeLabels: Record<string, string> = {
    handout: "Handout",
    poster: "Poster",
    "activity-sheet": "Activity Sheet",
    "discussion-cards": "Discussion Cards",
    checklist: "Checklist"
  };

  const viewMaterial = (id: string) => {
    setExpandedMaterial(expandedMaterial === id ? null : id);
    setProgress(prev => {
      if (prev.materialsViewed.includes(id)) return prev;
      const next = { ...prev, materialsViewed: [...prev.materialsViewed, id], lastActivity: new Date().toISOString() };
      saveProgress(next);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 rounded-xl p-5 border border-rose-200 dark:border-rose-800">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-rose-600" />
          <span className="font-semibold text-foreground">Classroom Materials</span>
        </div>
        <p className="text-sm text-muted-foreground">Ready-to-use handouts, posters, activity sheets, and discussion cards. Click any material to view its content.</p>
        <p className="text-xs text-muted-foreground mt-2">{progress.materialsViewed.length} of {materials.length} materials viewed</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map(material => {
          const Icon = materialIcons[material.icon] || FileText;
          const expanded = expandedMaterial === material.id;
          const viewed = progress.materialsViewed.includes(material.id);
          return (
            <Card
              key={material.id}
              className={`overflow-hidden transition-all ${expanded ? "sm:col-span-2 lg:col-span-3 border-2 border-primary/30" : "cursor-pointer hover:shadow-lg border-2 hover:border-primary/30"}`}
              data-testid={`material-card-${material.id}`}
            >
              <button
                onClick={() => viewMaterial(material.id)}
                className="w-full p-5 text-left"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${material.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    {viewed && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{material.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{material.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">{typeLabels[material.type]}</Badge>
                  <Badge variant="secondary" className="text-xs">{material.gradeLevel}</Badge>
                </div>
              </button>

              {expanded && (
                <div className="px-5 pb-5 border-t pt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  {material.sections.map((section, i) => (
                    <div key={i} className="bg-muted/30 rounded-xl p-4 border">
                      <h4 className="font-semibold text-foreground mb-2 text-sm">{section.heading}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
