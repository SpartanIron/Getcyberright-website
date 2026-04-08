import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "@/lib/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  XCircle,
  Clock,
  Award,
  Loader2,
  AlertCircle,
  Trophy,
  RefreshCw
} from "lucide-react";

interface QuizQuestion {
  id: string;
  questionType: string;
  questionText: string;
  options: string[] | null;
  scenarioContext?: string;
  difficulty: string;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  passingScore: number;
  maxAttempts: number;
  timeLimit?: number;
  questions: QuizQuestion[];
}

interface QuizResult {
  score: number;
  maxScore: number;
  percentScore: number;
  passed: boolean;
  results: Record<string, { correct: boolean; correctAnswer?: string; explanation?: string }>;
  attemptNumber: number;
  pointsEarned: number;
}

export default function TrainingQuiz() {
  const params = useParams();
  const quizId = params.quizId as string;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startTime] = useState(Date.now());
  const [result, setResult] = useState<QuizResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const { data: quiz, isLoading } = useQuery<Quiz>({
    queryKey: ["/api/training/quizzes", quizId],
  });

  const submitMutation = useMutation({
    mutationFn: async (): Promise<QuizResult> => {
      const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);
      const response = await apiRequest("POST", `/api/training/quizzes/${quizId}/submit`, {
        answers,
        timeSpentSeconds
      });
      return response.json();
    },
    onSuccess: (data: QuizResult) => {
      setResult(data);
      setShowResults(true);
      queryClient.invalidateQueries({ queryKey: ["/api/training"] });
      
      if (data.passed) {
        toast({
          title: "Quiz Passed!",
          description: `You scored ${data.percentScore}% and earned ${data.pointsEarned} points.`,
        });
      } else {
        toast({
          title: "Quiz Not Passed",
          description: `You scored ${data.percentScore}%. You need ${quiz?.passingScore}% to pass.`,
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Quiz Not Found</h1>
            <Link href="/training">
              <Button>Back to Training</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const allAnswered = quiz.questions.every(q => answers[q.id]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    submitMutation.mutate();
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setResult(null);
    setShowResults(false);
  };

  if (showResults && result) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        
        <main id="main-content" className="flex-1" tabIndex={-1}>
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Card className="text-center">
              <CardHeader>
                <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  result.passed ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                }`}>
                  {result.passed ? (
                    <Trophy className="w-10 h-10 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <CardTitle className="text-2xl">
                  {result.passed ? "Congratulations!" : "Keep Practicing"}
                </CardTitle>
                <CardDescription>
                  {result.passed 
                    ? "You've successfully passed this quiz."
                    : `You need ${quiz.passingScore}% to pass. Try again!`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-primary">{result.percentScore}%</div>
                    <div className="text-sm text-muted-foreground">Your Score</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold">{result.score}/{result.maxScore}</div>
                    <div className="text-sm text-muted-foreground">Points</div>
                  </div>
                </div>

                {result.passed && result.pointsEarned > 0 && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Award className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-green-700 dark:text-green-400 font-medium">
                      +{result.pointsEarned} points earned!
                    </p>
                  </div>
                )}

                <div className="space-y-4 text-left mb-6">
                  <h4 className="font-semibold">Question Review</h4>
                  {quiz.questions.map((q, idx) => {
                    const questionResult = result.results[q.id];
                    return (
                      <div key={q.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        {questionResult?.correct ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">Q{idx + 1}: {q.questionText}</p>
                          {!questionResult?.correct && questionResult?.correctAnswer && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Correct answer: {questionResult.correctAnswer}
                            </p>
                          )}
                          {questionResult?.explanation && (
                            <p className="text-sm text-muted-foreground mt-1 italic">
                              {questionResult.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-4 justify-center">
                  {!result.passed && (
                    <Button onClick={handleRetry} variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  )}
                  <Link href="/training">
                    <Button>
                      Continue Learning
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead title="Training Quiz" description="Test your cybersecurity knowledge with interactive quizzes." />
      <Navigation />
      
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <div className="bg-muted/30 border-b">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <Link href="/training" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Exit Quiz
              </Link>
              <Badge variant="secondary">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </Badge>
            </div>
            
            <h1 className="text-xl font-bold mb-2" data-testid="text-quiz-title">{quiz.title}</h1>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant={
                  question.difficulty === "easy" ? "secondary" :
                  question.difficulty === "hard" ? "destructive" : "outline"
                }>
                  {question.difficulty}
                </Badge>
                <span className="text-sm text-muted-foreground">{question.points} points</span>
              </div>
            </CardHeader>
            <CardContent>
              {question.scenarioContext && (
                <div className="mb-6 p-4 bg-muted rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <p className="text-sm">{question.scenarioContext}</p>
                  </div>
                </div>
              )}

              <h2 className="text-lg font-medium mb-6" data-testid="text-question">
                {question.questionText}
              </h2>

              {question.questionType === "multiple-choice" && question.options && (
                <RadioGroup
                  value={answers[question.id] || ""}
                  onValueChange={(value) => handleAnswer(question.id, value)}
                  className="space-y-3"
                >
                  {question.options.map((option, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-4 border rounded-lg hover-elevate cursor-pointer">
                      <RadioGroupItem value={option} id={`option-${idx}`} data-testid={`radio-option-${idx}`} />
                      <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.questionType === "true-false" && (
                <RadioGroup
                  value={answers[question.id] || ""}
                  onValueChange={(value) => handleAnswer(question.id, value)}
                  className="space-y-3"
                >
                  {["True", "False"].map((option) => (
                    <div key={option} className="flex items-center space-x-3 p-4 border rounded-lg hover-elevate cursor-pointer">
                      <RadioGroupItem value={option} id={`option-${option}`} data-testid={`radio-${option.toLowerCase()}`} />
                      <Label htmlFor={`option-${option}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              <div className="mt-8 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  data-testid="button-previous"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                {currentQuestion === quiz.questions.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!allAnswered || submitMutation.isPending}
                    data-testid="button-submit-quiz"
                  >
                    {submitMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Submit Quiz
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!answers[question.id]}
                    data-testid="button-next"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {quiz.questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    idx === currentQuestion
                      ? "bg-primary text-primary-foreground"
                      : answers[q.id]
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-muted text-muted-foreground"
                  }`}
                  data-testid={`button-question-${idx + 1}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
