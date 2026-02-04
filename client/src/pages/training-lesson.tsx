import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
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
  PlayCircle
} from "lucide-react";
import type { TrainingLesson } from "@shared/schema";

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
