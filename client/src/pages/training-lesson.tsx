"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "@/lib/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Clock,
  BookOpen,
  Award,
  Loader2,
  Lightbulb,
  PlayCircle,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Sparkles,
  Target,
  Brain
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { TrainingLesson } from "@shared/schema";

interface KnowledgeCheck {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

function InteractiveKnowledgeCheck({ check, onComplete }: { check: KnowledgeCheck; onComplete: () => void }) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === check.correctAnswer) {
      setTimeout(onComplete, 1500);
    }
  };
  
  const isCorrect = selectedAnswer === check.correctAnswer;
  
  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Knowledge Check
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-medium mb-4">{check.question}</p>
        <div className="space-y-2">
          {check.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showResult && handleAnswer(index)}
              disabled={showResult}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                showResult && index === check.correctAnswer
                  ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                  : showResult && index === selectedAnswer && index !== check.correctAnswer
                  ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                  : "border-border hover:border-primary/50 hover-elevate"
              }`}
              data-testid={`button-answer-${index}`}
            >
              <span className="flex items-center gap-2">
                {showResult && index === check.correctAnswer && (
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                )}
                {showResult && index === selectedAnswer && index !== check.correctAnswer && (
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                )}
                {option}
              </span>
            </button>
          ))}
        </div>
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-lg ${
                isCorrect 
                  ? "bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-200" 
                  : "bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200"
              }`}
            >
              <p className="font-medium mb-1">
                {isCorrect ? "Correct!" : "Not quite right"}
              </p>
              <p className="text-sm">{check.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

function InteractiveTip({ tip, audience }: { tip: string; audience?: string }) {
  const [dismissed, setDismissed] = useState(false);
  
  if (dismissed) return null;
  
  const getAudienceStyle = () => {
    switch (audience) {
      case "kids":
        return "border-purple-300 bg-purple-50 dark:bg-purple-950/30";
      case "seniors":
        return "border-rose-300 bg-rose-50 dark:bg-rose-950/30";
      case "parents":
        return "border-blue-300 bg-blue-50 dark:bg-blue-950/30";
      case "educators":
        return "border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30";
      case "small-business":
        return "border-amber-300 bg-amber-50 dark:bg-amber-950/30";
      default:
        return "border-primary/30 bg-primary/5";
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-lg border-l-4 ${getAudienceStyle()}`}
    >
      <div className="flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium mb-1">Pro Tip</p>
          <p className="text-sm text-muted-foreground">{tip}</p>
        </div>
        <button 
          onClick={() => setDismissed(true)}
          className="text-muted-foreground hover:text-foreground"
          data-testid="button-dismiss-tip"
        >
          <CheckCircle className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function ActivityCard({ title, description, onComplete }: { title: string; description: string; onComplete: () => void }) {
  const [completed, setCompleted] = useState(false);
  
  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };
  
  return (
    <Card className={`transition-all ${completed ? "border-green-500 bg-green-50/50 dark:bg-green-950/20" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${completed ? "bg-green-100 dark:bg-green-900" : "bg-primary/10"}`}>
            <Target className={`w-5 h-5 ${completed ? "text-green-600" : "text-primary"}`} />
          </div>
          <div className="flex-1">
            <h4 className="font-medium mb-1">{title}</h4>
            <p className="text-sm text-muted-foreground mb-3">{description}</p>
            {!completed ? (
              <Button size="sm" onClick={handleComplete} data-testid="button-complete-activity">
                Mark as Done
              </Button>
            ) : (
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                <CheckCircle className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TrainingLesson() {
  const params = useParams();
  const lessonId = params.lessonId as string;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [startTime] = useState(Date.now());

  const { data: lesson, isLoading } = useQuery<TrainingLesson>({
    queryKey: ["/api/training/lessons", lessonId],
  });

  const completeMutation = useMutation({
    mutationFn: async () => {
      const timeSpent = Math.round((Date.now() - startTime) / 60000);
      return apiRequest("POST", `/api/training/lessons/${lessonId}/complete`, {
        timeSpent
      });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/training"] });
      toast({
        title: "Lesson Complete!",
        description: `You earned ${data.pointsEarned} points.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark lesson as complete. Please try again.",
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

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
            <Link href="/training">
              <Button>Back to Training</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleComplete = () => {
    completeMutation.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead title="Training Lesson" description="Interactive cybersecurity lesson with practical knowledge and real-world examples." />
      <Navigation />
      
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <div className="bg-muted/30 border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link href="/training" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Training
            </Link>
            
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="secondary">{lesson.contentType}</Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {lesson.estimatedMinutes} min
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold" data-testid="text-lesson-title">
              {lesson.title}
            </h1>
            <p className="text-muted-foreground mt-2">{lesson.description}</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {lesson.contentType === "video" && lesson.videoUrl && (
                <div className="aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center">
                  <div className="text-center">
                    <PlayCircle className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Video content</p>
                  </div>
                </div>
              )}

              {lesson.contentHtml ? (
                <div 
                  className="prose prose-slate dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: lesson.contentHtml }}
                />
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">Content Coming Soon</h3>
                    <p className="text-muted-foreground">
                      We're developing the content for this lesson. Check back soon!
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="mt-8 space-y-6">
                <InteractiveTip 
                  tip="Take notes as you learn! Writing things down helps you remember important security concepts better."
                  audience={undefined}
                />
                
                <InteractiveKnowledgeCheck
                  check={{
                    question: "What is the most important thing to remember from this lesson?",
                    options: [
                      "Security is only for experts",
                      "Small steps can make a big difference in staying safe",
                      "You need expensive software to be secure",
                      "Only businesses need to worry about cybersecurity"
                    ],
                    correctAnswer: 1,
                    explanation: "Security is for everyone! Taking small, consistent steps like using strong passwords and being cautious with links can significantly improve your safety online."
                  }}
                  onComplete={() => {
                    toast({
                      title: "Great job!",
                      description: "You answered correctly!",
                    });
                  }}
                />
                
                <ActivityCard
                  title="Apply What You Learned"
                  description="Think about how you can apply this lesson in your daily life. What is one change you can make today?"
                  onComplete={() => {
                    toast({
                      title: "Activity completed!",
                      description: "Great work on applying your learning!",
                    });
                  }}
                />
              </div>

              <div className="mt-8 flex items-center justify-between">
                <Button variant="outline" disabled>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                
                <Button 
                  onClick={handleComplete} 
                  disabled={completeMutation.isPending}
                  data-testid="button-complete-lesson"
                >
                  {completeMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Mark Complete
                </Button>

                <Button variant="outline" disabled>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Key Takeaways
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {lesson.keyTakeaways.map((takeaway, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete this lesson to earn points and progress toward your certificate.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-primary" />
                    <span>+25 points for completion</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
