import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  Users, 
  Heart, 
  Briefcase, 
  Sparkles,
  Shield,
  Lock,
  AlertTriangle,
  Trophy,
  Clock,
  CheckCircle,
  ChevronRight,
  Award,
  BookOpen,
  Play,
  Star
} from "lucide-react";
import type { LearningPath } from "@shared/schema";

const audienceConfigs: Record<string, {
  key: string;
  title: string;
  headline: string;
  subheadline: string;
  icon: typeof Sparkles;
  gradient: string;
  bgPattern: string;
  features: string[];
  testimonial: { quote: string; author: string; role: string };
}> = {
  kids: {
    key: "kids",
    title: "Training for Kids",
    headline: "Learn to Stay Safe Online",
    subheadline: "Fun games and activities that teach you how to be smart and safe on the internet!",
    icon: Sparkles,
    gradient: "from-purple-500 via-pink-500 to-orange-400",
    bgPattern: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30",
    features: [
      "Easy to understand lessons with pictures",
      "Fun quizzes to test what you learned",
      "Earn cool badges and certificates",
      "Learn at your own pace"
    ],
    testimonial: {
      quote: "I learned how to spot fake messages and keep my passwords safe. It was actually fun!",
      author: "Sarah, age 12",
      role: "Student"
    }
  },
  parents: {
    key: "parents",
    title: "Training for Parents",
    headline: "Protect Your Family Online",
    subheadline: "Simple, practical lessons to help you keep your children safe in the digital world.",
    icon: Users,
    gradient: "from-blue-500 via-cyan-500 to-teal-400",
    bgPattern: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
    features: [
      "Learn to set up parental controls",
      "Understand what apps your kids use",
      "Talk to your children about online safety",
      "Recognize warning signs of online dangers"
    ],
    testimonial: {
      quote: "Finally, clear guidance I can actually use. I feel much more confident monitoring my kids online.",
      author: "Michael T.",
      role: "Father of three"
    }
  },
  seniors: {
    key: "seniors",
    title: "Training for Seniors",
    headline: "Stay Safe from Scams",
    subheadline: "Clear, simple lessons to help you avoid fraud and use technology with confidence.",
    icon: Heart,
    gradient: "from-rose-500 via-orange-500 to-amber-400",
    bgPattern: "bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/30",
    features: [
      "Learn to spot phone and email scams",
      "Protect your bank and personal information",
      "Use the internet safely and confidently",
      "Know who to call if something seems wrong"
    ],
    testimonial: {
      quote: "I almost fell for a phone scam last month. This training taught me exactly what to look for.",
      author: "Margaret R.",
      role: "Retired Teacher"
    }
  },
  educators: {
    key: "educators",
    title: "Training for Educators",
    headline: "Teach Digital Safety",
    subheadline: "Ready to use lessons and resources to bring cybersecurity education to your classroom.",
    icon: GraduationCap,
    gradient: "from-emerald-500 via-teal-500 to-cyan-400",
    bgPattern: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
    features: [
      "Age appropriate lesson plans",
      "Printable worksheets and activities",
      "Assessment tools and quizzes",
      "Continuing education credits"
    ],
    testimonial: {
      quote: "My students love the interactive content. It makes teaching online safety so much easier.",
      author: "Jennifer M.",
      role: "5th Grade Teacher"
    }
  },
  business: {
    key: "small-business",
    title: "Training for Businesses",
    headline: "Protect Your Business",
    subheadline: "Train your team to recognize threats and follow security best practices.",
    icon: Briefcase,
    gradient: "from-amber-500 via-yellow-500 to-orange-400",
    bgPattern: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30",
    features: [
      "Employee security awareness training",
      "Compliance ready documentation",
      "Track team progress and completion",
      "Certificates for completed training"
    ],
    testimonial: {
      quote: "We reduced security incidents by 60% after rolling out this training to our team.",
      author: "David K.",
      role: "IT Director"
    }
  }
};

export default function TrainingAudience() {
  const [, params] = useRoute("/training/:audience");
  const audienceKey = params?.audience || "kids";
  const config = audienceConfigs[audienceKey] || audienceConfigs.kids;
  
  const { data: learningPaths, isLoading } = useQuery<LearningPath[]>({
    queryKey: ["/api/training/paths"],
  });

  const filteredPaths = learningPaths?.filter(
    path => path.audience === config.key
  ) || [];

  const Icon = config.icon;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className={`relative py-16 lg:py-24 ${config.bgPattern}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Free to Start
                  </Badge>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  {config.headline}
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8">
                  {config.subheadline}
                </p>
                
                <div className="space-y-3 mb-8">
                  {config.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-4">
                  {filteredPaths.length > 0 && (
                    <Link href={`/training/${filteredPaths[0].id}`}>
                      <Button size="lg" className="gap-2" data-testid="button-start-training">
                        <Play className="w-4 h-4" />
                        Start Learning Now
                      </Button>
                    </Link>
                  )}
                  <Link href="/training">
                    <Button variant="outline" size="lg" data-testid="button-view-all-courses">
                      View All Courses
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <Card className="border-2">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <Star className="w-6 h-6 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-foreground italic mb-2">
                          "{config.testimonial.quote}"
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {config.testimonial.author}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {config.testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Your Learning Path
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Complete these courses at your own pace. Each one builds on the last to help you become safer online.
              </p>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredPaths.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Courses Coming Soon
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    We are working on creating great content just for you. Check back soon!
                  </p>
                  <Link href="/training">
                    <Button variant="outline">
                      Explore Other Courses
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPaths.map((path, index) => (
                  <Link key={path.id} href={`/training/${path.id}`}>
                    <Card 
                      className="h-full transition-all hover-elevate cursor-pointer group"
                      data-testid={`card-learning-path-${index}`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <Badge 
                              variant="secondary" 
                              className="mb-2 capitalize"
                            >
                              {path.level}
                            </Badge>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {path.title}
                            </CardTitle>
                          </div>
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${path.color || '#6366f1'}20` }}
                          >
                            <Award className="w-5 h-5" style={{ color: path.color || '#6366f1' }} />
                          </div>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {path.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{path.estimatedHours} hours</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4" />
                            <span>Certificate</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              {path.learningOutcomes?.length || 0} learning goals
                            </span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                What You Will Learn
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Spot Scams</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn to recognize fake emails, calls, and websites before they trick you.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Strong Passwords</h3>
                  <p className="text-sm text-muted-foreground">
                    Create passwords that keep hackers out of your accounts.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Protect Privacy</h3>
                  <p className="text-sm text-muted-foreground">
                    Keep your personal information safe from strangers online.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Get Certified</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn a certificate to show you know how to stay safe online.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of people who are learning to stay safe online. It is free to start!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {filteredPaths.length > 0 && (
                <Link href={`/training/${filteredPaths[0].id}`}>
                  <Button size="lg" className="gap-2">
                    <Play className="w-4 h-4" />
                    Start Your First Lesson
                  </Button>
                </Link>
              )}
              <Link href="/signup">
                <Button variant="outline" size="lg">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
