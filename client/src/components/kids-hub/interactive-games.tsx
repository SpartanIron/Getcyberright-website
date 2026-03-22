import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle, CheckCircle, ThumbsUp, ArrowRight,
  Trophy, Star, Lightbulb, Sparkles, Shield, Lock,
  BookOpen, Zap, XCircle
} from "lucide-react";
import type { QuizQuestion, SpotTheScamItem, StoryScenario } from "./quiz-data";

export function MultiQuiz({
  questions,
  title,
  onComplete,
  ageGroup,
}: {
  questions: QuizQuestion[];
  title: string;
  onComplete: (score: number, total: number) => void;
  ageGroup: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [complete, setComplete] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <Card className="border-2 border-muted" data-testid="quiz-empty">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No quiz questions available for this topic yet.</p>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentIndex];
  const isCorrect = selectedAnswer === question?.correctIndex;

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === question.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setComplete(true);
      onComplete(score + (isCorrect ? 0 : 0), questions.length);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setComplete(false);
  };

  if (complete) {
    const finalScore = score;
    const pct = Math.round((finalScore / questions.length) * 100);
    return (
      <Card className="border-2 border-primary/30" data-testid="quiz-complete-card">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Quiz Complete!</h3>
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(finalScore)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
            ))}
            {[...Array(questions.length - finalScore)].map((_, i) => (
              <Star key={`e-${i}`} className="w-6 h-6 text-gray-300 dark:text-gray-600" />
            ))}
          </div>
          <p className="text-xl text-muted-foreground mb-2">
            {finalScore} out of {questions.length} correct ({pct}%)
          </p>
          <Badge className={pct >= 80 ? "bg-green-500 text-white" : pct >= 60 ? "bg-blue-500 text-white" : "bg-orange-500 text-white"}>
            {pct >= 80 ? "Excellent!" : pct >= 60 ? "Good Job!" : "Keep Practicing!"}
          </Badge>
          <div className="flex justify-center gap-3 mt-6">
            <Button variant="outline" onClick={handleRestart} data-testid="button-quiz-restart">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20" data-testid="quiz-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            {title}
          </CardTitle>
          <Badge variant="secondary" data-testid="quiz-progress-badge">
            {currentIndex + 1} / {questions.length}
          </Badge>
        </div>
        <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {question.scenario && (
          <div className="bg-muted/50 rounded-lg p-4 border border-muted">
            <p className="text-sm text-muted-foreground italic">{question.scenario}</p>
          </div>
        )}
        <h4 className="text-lg font-semibold text-foreground">{question.question}</h4>
        <div className="grid gap-2">
          {question.options.map((option, idx) => {
            let cls = "w-full text-left p-4 rounded-lg border-2 transition-all text-sm ";
            if (showResult) {
              if (idx === question.correctIndex) cls += "border-green-500 bg-green-50 dark:bg-green-900/20";
              else if (idx === selectedAnswer && !isCorrect) cls += "border-red-500 bg-red-50 dark:bg-red-900/20";
              else cls += "border-muted opacity-50";
            } else {
              cls += "border-muted hover:border-primary hover:bg-primary/5 cursor-pointer";
            }
            return (
              <button key={idx} className={cls} onClick={() => handleAnswer(idx)} disabled={showResult} data-testid={`button-quiz-option-${idx}`}>
                <span className="text-foreground">{option}</span>
              </button>
            );
          })}
        </div>
        {showResult && (
          <div className={`p-4 rounded-lg ${isCorrect ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" : "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"}`}>
            <div className="flex items-start gap-3">
              {isCorrect ? <ThumbsUp className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" /> : <Lightbulb className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />}
              <div>
                <p className={`font-semibold text-sm ${isCorrect ? "text-green-800 dark:text-green-200" : "text-orange-800 dark:text-orange-200"}`}>
                  {isCorrect ? "Correct!" : "Not quite!"}
                </p>
                <p className={`text-sm ${isCorrect ? "text-green-700 dark:text-green-300" : "text-orange-700 dark:text-orange-300"}`}>
                  {question.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
        {showResult && (
          <div className="flex justify-end">
            <Button onClick={handleNext} data-testid="button-quiz-next">
              {currentIndex < questions.length - 1 ? "Next Question" : "See Results"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SpotTheScamGame({
  scenarios,
  onComplete,
}: {
  scenarios: SpotTheScamItem[];
  onComplete?: (score: number, total: number) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [gameComplete, setGameComplete] = useState(false);

  const currentItem = scenarios[currentIndex];
  const isCorrect = selectedAnswer === currentItem?.isScam;

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);
    setAnswered(true);
    if (answer === currentItem.isScam) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex((i) => i + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      setGameComplete(true);
      onComplete?.(score + (isCorrect ? 0 : 0), scenarios.length);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setGameComplete(false);
  };

  if (gameComplete) {
    const finalScore = score;
    return (
      <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20 border-2 border-purple-200 dark:border-purple-800 shadow-xl" data-testid="spot-scam-complete">
        <CardContent className="p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400 flex items-center justify-center shadow-lg">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Game Complete!</h3>
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(finalScore)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
            ))}
            {[...Array(scenarios.length - finalScore)].map((_, i) => (
              <Star key={`e-${i}`} className="w-6 h-6 text-gray-300 dark:text-gray-600" />
            ))}
          </div>
          <p className="text-xl text-muted-foreground mb-4">
            You scored {finalScore} out of {scenarios.length}
          </p>
          {finalScore === scenarios.length ? (
            <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white mb-4">Perfect Score! Scam Spotter Expert!</Badge>
          ) : finalScore >= scenarios.length / 2 ? (
            <Badge className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white mb-4">Great Job! Keep Learning!</Badge>
          ) : (
            <Badge className="bg-gradient-to-r from-orange-400 to-amber-500 text-white mb-4">Good Try! Practice Makes Perfect!</Badge>
          )}
          <div className="pt-4">
            <Button onClick={resetGame} className="bg-gradient-to-r from-purple-500 to-pink-500" data-testid="button-play-again">
              <Sparkles className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-orange-200 dark:border-orange-800 shadow-lg" data-testid="spot-scam-game">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center shadow-md">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            Spot the Scam
          </CardTitle>
          <Badge className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white shadow-md">
            {currentIndex + 1} of {scenarios.length}
          </Badge>
        </div>
        <CardDescription>Read the scenario and decide if it is a scam or safe.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 border border-blue-100 dark:border-blue-900">
          <p className="text-lg text-foreground">{currentItem.scenario}</p>
        </div>
        {!answered ? (
          <div className="flex justify-center gap-4">
            <Button variant="outline" className="flex-1 max-w-40 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300" onClick={() => handleAnswer(true)} data-testid="button-scam">
              <AlertCircle className="w-4 h-4 mr-2" />Scam
            </Button>
            <Button variant="outline" className="flex-1 max-w-40 border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300" onClick={() => handleAnswer(false)} data-testid="button-safe">
              <CheckCircle className="w-4 h-4 mr-2" />Safe
            </Button>
          </div>
        ) : (
          <>
            <div className={`p-5 rounded-lg ${isCorrect ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" : "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"}`}>
              <div className="flex items-start gap-3">
                {isCorrect ? <ThumbsUp className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" /> : <Lightbulb className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0" />}
                <div>
                  <h5 className={`font-semibold mb-1 ${isCorrect ? "text-green-800 dark:text-green-200" : "text-orange-800 dark:text-orange-200"}`}>
                    {isCorrect ? "Correct!" : "Not quite!"}
                  </h5>
                  <p className={isCorrect ? "text-green-700 dark:text-green-300" : "text-orange-700 dark:text-orange-300"}>
                    {currentItem.explanation}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Button onClick={handleNext} data-testid="button-next-scenario">
                {currentIndex < scenarios.length - 1 ? "Next Scenario" : "See Results"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </>
        )}
        <div className="flex justify-center">
          <div className="flex gap-1">
            {scenarios.map((_, index) => (
              <div key={index} className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-primary" : index < currentIndex ? "bg-green-500" : "bg-muted"}`} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StoryActivity({
  story,
  onComplete,
}: {
  story: StoryScenario;
  onComplete?: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleChoice = (index: number) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
  };

  const choice = selected !== null ? story.choices[selected] : null;

  return (
    <Card className="border-2 border-indigo-200 dark:border-indigo-800" data-testid="story-activity">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-md">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {story.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 rounded-xl p-5 border">
          <p className="text-foreground leading-relaxed">{story.setup}</p>
        </div>
        <h4 className="font-semibold text-foreground">What would you do?</h4>
        <div className="grid gap-3">
          {story.choices.map((c, idx) => {
            let cls = "w-full text-left p-4 rounded-lg border-2 transition-all text-sm ";
            if (showResult) {
              if (c.isCorrect) cls += "border-green-500 bg-green-50 dark:bg-green-900/20";
              else if (idx === selected && !c.isCorrect) cls += "border-red-500 bg-red-50 dark:bg-red-900/20";
              else cls += "border-muted opacity-50";
            } else {
              cls += "border-muted hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 cursor-pointer";
            }
            return (
              <button key={idx} className={cls} onClick={() => handleChoice(idx)} disabled={showResult} data-testid={`button-story-choice-${idx}`}>
                {c.text}
              </button>
            );
          })}
        </div>
        {showResult && choice && (
          <>
            <div className={`p-4 rounded-lg ${choice.isCorrect ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" : "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"}`}>
              <div className="flex items-start gap-3">
                {choice.isCorrect ? <ThumbsUp className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" /> : <Lightbulb className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />}
                <div>
                  <p className={`font-semibold text-sm mb-1 ${choice.isCorrect ? "text-green-800 dark:text-green-200" : "text-orange-800 dark:text-orange-200"}`}>
                    {choice.isCorrect ? "Great choice!" : "Here is what could happen:"}
                  </p>
                  <p className={`text-sm ${choice.isCorrect ? "text-green-700 dark:text-green-300" : "text-orange-700 dark:text-orange-300"}`}>
                    {choice.consequence}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Lesson Learned
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">{story.lesson}</p>
            </div>
            {onComplete && (
              <div className="flex justify-center">
                <Button onClick={onComplete} data-testid="button-story-continue">
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function PasswordStrengthBuilder() {
  const [password, setPassword] = useState("");
  const [showTips, setShowTips] = useState(false);

  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    noCommon: !["password", "123456", "qwerty", "abc123", "letmein", "admin", "welcome"].some((w) => password.toLowerCase().includes(w)),
  };

  const score = Object.values(checks).filter(Boolean).length;
  const strength = score <= 1 ? "Weak" : score <= 3 ? "Medium" : score <= 4 ? "Strong" : "Super Strong";
  const strengthColor = score <= 1 ? "bg-red-500" : score <= 3 ? "bg-yellow-500" : score <= 4 ? "bg-blue-500" : "bg-green-500";
  const strengthTextColor = score <= 1 ? "text-red-600" : score <= 3 ? "text-yellow-600" : score <= 4 ? "text-blue-600" : "text-green-600";

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800" data-testid="password-builder">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-md">
            <Lock className="w-5 h-5 text-white" />
          </div>
          Password Strength Builder
        </CardTitle>
        <CardDescription>Create a practice password and see how strong it is! (Do not use a real password)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        <div>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type a practice password..."
            className="w-full p-3 rounded-lg border-2 border-muted bg-background text-foreground focus:border-primary focus:outline-none text-lg font-mono"
            data-testid="input-password-builder"
            autoComplete="off"
          />
          <p className="text-xs text-muted-foreground mt-1">This is for practice only. Never type a real password here.</p>
        </div>
        {password.length > 0 && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`font-bold ${strengthTextColor}`}>{strength}</span>
                <span className="text-sm text-muted-foreground">{score}/5 checks passed</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${strengthColor} rounded-full transition-all duration-500`} style={{ width: `${(score / 5) * 100}%` }} />
              </div>
            </div>
            <div className="grid gap-2">
              {[
                { check: checks.length, label: "At least 8 characters" },
                { check: checks.uppercase, label: "Has uppercase letters (A-Z)" },
                { check: checks.lowercase, label: "Has lowercase letters (a-z)" },
                { check: checks.number, label: "Has numbers (0-9)" },
                { check: checks.noCommon, label: "Does not contain common words" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  {item.check ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-400" />}
                  <span className={item.check ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
                </div>
              ))}
            </div>
          </>
        )}
        <Button variant="outline" size="sm" onClick={() => setShowTips(!showTips)} data-testid="button-password-tips">
          <Lightbulb className="w-4 h-4 mr-2" /> {showTips ? "Hide Tips" : "Show Tips"}
        </Button>
        {showTips && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 space-y-2">
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">Password Tips:</p>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>Try the three random words method: <strong>Sun7Flower9Rain</strong></li>
              <li>Longer passwords are harder to crack</li>
              <li>Never use your name, birthday, or pet's name</li>
              <li>Use a different password for every account</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ProgressDashboard({
  ageGroup,
  completedModules,
  totalModules,
  quizScores,
  activitiesCompleted,
  totalStars,
}: {
  ageGroup: string;
  completedModules: string[];
  totalModules: number;
  quizScores: Record<string, number>;
  activitiesCompleted: string[];
  totalStars: number;
}) {
  const completionPct = totalModules > 0 ? Math.round((completedModules.length / totalModules) * 100) : 0;
  const quizCount = Object.keys(quizScores).length;
  const activityCount = activitiesCompleted.length;

  return (
    <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-primary/20" data-testid="progress-dashboard">
      <CardContent className="p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Trophy className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground">Your Progress</h3>
            <p className="text-sm text-muted-foreground">{completedModules.length} of {totalModules} lessons completed</p>
          </div>
          <div className="flex gap-0.5">
            {[...Array(Math.min(totalStars, 10))].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
            ))}
            {totalStars > 10 && <span className="text-xs text-muted-foreground ml-1">+{totalStars - 10}</span>}
          </div>
        </div>
        <Progress value={completionPct} className="h-2.5 mb-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{completionPct}% complete</span>
          <span>{totalStars} stars earned</span>
        </div>
        {(quizCount > 0 || activityCount > 0) && (
          <div className="flex gap-3 mt-3 pt-3 border-t border-primary/10">
            {quizCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                <BookOpen className="w-3 h-3 mr-1" /> {quizCount} quizzes taken
              </Badge>
            )}
            {activityCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" /> {activityCount} activities done
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
