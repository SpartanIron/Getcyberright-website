import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  BookOpen, 
  Clock, 
  Award, 
  CheckCircle, 
  PlayCircle, 
  Lock,
  ChevronLeft,
  Target,
  FileText,
  Trophy,
  Loader2
} from "lucide-react";
import type { LearningPath, TrainingModule, TrainingLesson } from "@shared/schema";

interface PathWithModules extends LearningPath {
  modules: (TrainingModule & { lessons?: TrainingLesson[] })[];
}

export default function TrainingPath() {
  const params = useParams();
  const pathId = params.pathId as string;

  const { data: path, isLoading } = useQuery<PathWithModules>({
    queryKey: ["/api/training/paths", pathId],
  });

  const { data: userProgress } = useQuery<{ completedLessons: string[] }>({
    queryKey: ["/api/training/user-progress/path", pathId],
    enabled: !!pathId,
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

  if (!path) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Learning Path Not Found</h1>
            <Link href="/training">
              <Button>Back to Training</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalLessons = path.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
  const completedLessons = userProgress?.completedLessons?.length || 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <div className="bg-muted/30 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link href="/training" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Training
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <Badge variant="secondary" className="mb-3">{path.level}</Badge>
                <h1 className="text-3xl font-bold mb-3" data-testid="text-path-title">{path.title}</h1>
                <p className="text-muted-foreground mb-4">{path.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {path.estimatedHours} hours
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {path.modules?.length || 0} modules
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {totalLessons} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    {path.certificateName}
                  </span>
                </div>
              </div>
              
              <Card className="w-full md:w-80">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-primary mb-1">{progressPercent}%</div>
                    <p className="text-sm text-muted-foreground">Complete</p>
                  </div>
                  <Progress value={progressPercent} className="h-2 mb-4" />
                  <div className="text-sm text-center text-muted-foreground mb-4">
                    {completedLessons} of {totalLessons} lessons completed
                  </div>
                  <Button className="w-full" size="lg" data-testid="button-continue-learning">
                    {progressPercent === 0 ? "Start Learning" : progressPercent === 100 ? "Review Course" : "Continue Learning"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-6">Course Content</h2>
              
              {path.modules && path.modules.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-4">
                  {path.modules.map((module, idx) => (
                    <AccordionItem key={module.id} value={module.id} className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-4 text-left">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {idx + 1}
                          </div>
                          <div>
                            <h3 className="font-medium">{module.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {module.estimatedMinutes} min
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <p className="text-muted-foreground mb-4 ml-12">{module.description}</p>
                        
                        {module.learningObjectives && module.learningObjectives.length > 0 && (
                          <div className="ml-12 mb-4">
                            <h4 className="text-sm font-medium mb-2">Learning Objectives:</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                              {module.learningObjectives.map((obj, i) => (
                                <li key={i}>{obj}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="ml-12 space-y-2">
                          {module.lessons?.map((lesson) => {
                            const isCompleted = userProgress?.completedLessons?.includes(lesson.id);
                            return (
                              <Link key={lesson.id} href={`/training/lesson/${lesson.id}`}>
                                <div className="flex items-center gap-3 p-3 rounded-lg hover-elevate cursor-pointer border" data-testid={`link-lesson-${lesson.id}`}>
                                  {isCompleted ? (
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                  ) : (
                                    <PlayCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                  )}
                                  <div className="flex-1">
                                    <span className="text-sm font-medium">{lesson.title}</span>
                                    <p className="text-xs text-muted-foreground">{lesson.estimatedMinutes} min</p>
                                  </div>
                                  {lesson.contentType === "video" && (
                                    <Badge variant="outline" className="text-xs">Video</Badge>
                                  )}
                                  {lesson.contentType === "interactive" && (
                                    <Badge variant="outline" className="text-xs">Interactive</Badge>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">Content Coming Soon</h3>
                    <p className="text-muted-foreground">
                      We're developing comprehensive lessons for this learning path. Check back soon!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              {path.learningOutcomes && path.learningOutcomes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      What You'll Learn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {path.learningOutcomes.map((outcome, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Certificate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-4 border rounded-lg bg-muted/50">
                    <Award className="w-12 h-12 mx-auto text-primary mb-3" />
                    <h4 className="font-semibold">{path.certificateName}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Complete all modules and pass the final assessment to earn this certificate.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {path.prerequisites && path.prerequisites.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Prerequisites</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {path.prerequisites.map((prereq, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Lock className="w-4 h-4 text-muted-foreground" />
                          <span>{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
