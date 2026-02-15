import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { InlinePromoVideo } from "@/components/inline-promo-video";
import { SEOHead } from "@/components/seo-head";
import bannerImage from "@/assets/banners/training-banner.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  Users, 
  Heart, 
  Briefcase, 
  Sparkles,
  Shield,
  Lock,
  Eye,
  Globe,
  Smartphone,
  UserX,
  AlertTriangle,
  Trophy,
  Clock,
  CheckCircle,
  ChevronRight,
  Award,
  BookOpen,
  Target,
  Brain
} from "lucide-react";
import type { LearningPath } from "@shared/schema";

const audienceInfo = {
  kids: {
    title: "Kids Safety Training",
    description: "Fun, interactive lessons designed for ages 8-16",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800"
  },
  parents: {
    title: "Parents & Families",
    description: "Protect your family and guide your children online",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800"
  },
  seniors: {
    title: "Seniors Protection",
    description: "Stay safe from scams, fraud, and online tricks",
    icon: Heart,
    color: "from-rose-500 to-orange-500",
    bgColor: "bg-rose-50 dark:bg-rose-950/20",
    borderColor: "border-rose-200 dark:border-rose-800"
  },
  educators: {
    title: "Educators & Schools",
    description: "Classroom-ready curriculum and resources",
    icon: GraduationCap,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    borderColor: "border-emerald-200 dark:border-emerald-800"
  },
  "small-business": {
    title: "Small Business",
    description: "Employee training and compliance programs",
    icon: Briefcase,
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    borderColor: "border-amber-200 dark:border-amber-800"
  },
  everyone: {
    title: "Everyone",
    description: "Essential safety skills for all ages and backgrounds",
    icon: Brain,
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    borderColor: "border-teal-200 dark:border-teal-800"
  }
};

const competencyDomains = [
  { id: "threat-recognition", name: "Threat Recognition", icon: AlertTriangle, description: "Identify phishing, scams, and malicious content" },
  { id: "password-security", name: "Password Security", icon: Lock, description: "Create and manage strong, unique passwords" },
  { id: "privacy-protection", name: "Privacy Protection", icon: Eye, description: "Control your personal information online" },
  { id: "safe-online-behavior", name: "Safe Online Behavior", icon: Globe, description: "Navigate the internet safely and responsibly" },
  { id: "device-security", name: "Device Security", icon: Smartphone, description: "Keep your devices protected and updated" },
  { id: "social-engineering", name: "Social Engineering Defense", icon: UserX, description: "Recognize manipulation tactics" },
  { id: "incident-response", name: "Incident Response", icon: Shield, description: "Know what to do when things go wrong" }
];

const certificationLevels = [
  { level: "foundation", name: "Digital Safety Aware", hours: "2-3", badge: "Bronze", description: "Core concepts every person should know" },
  { level: "intermediate", name: "Cyber Defender", hours: "4-5", badge: "Silver", description: "Advanced threat recognition and prevention" },
  { level: "advanced", name: "Security Champion", hours: "6-8", badge: "Gold", description: "Expert-level security practices and leadership" }
];

export default function Training() {
  const [selectedAudience, setSelectedAudience] = useState<string>("all");

  const { data: learningPaths, isLoading } = useQuery<LearningPath[]>({
    queryKey: ["/api/training/paths"],
  });

  const { data: userProgress } = useQuery<{ completedPaths: number; totalPoints: number; certificates: number }>({
    queryKey: ["/api/training/user-progress"],
  });

  const filteredPaths = selectedAudience === "all" 
    ? learningPaths 
    : learningPaths?.filter(p => p.audience === selectedAudience);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead title="Training Academy" description="Learn cybersecurity through structured courses with quizzes and certificates. Training paths for kids, parents, seniors, educators, and businesses." />
      <Navigation />
      
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={bannerImage} 
              alt="Cybersecurity Training Academy - diverse people learning together" 
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-2xl">
              <Badge variant="secondary" className="mb-4" data-testid="badge-training-header">
                <GraduationCap className="w-3 h-3 mr-1" />
                AI-Powered Curriculum
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-training-title">
                Cybersecurity Training Academy
              </h1>
              <p className="text-xl text-muted-foreground mb-8" data-testid="text-training-subtitle">
                Master digital safety with structured learning paths, interactive lessons, 
                and industry-recognized certifications tailored to your needs.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" data-testid="button-start-learning">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Start Learning
                </Button>
                <Button size="lg" variant="outline" data-testid="button-view-paths">
                  <Target className="w-4 h-4 mr-2" />
                  Explore Paths
                </Button>
              </div>
            </div>
          </div>
        </section>

        {userProgress && (
          <section className="py-8 border-b bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-none bg-transparent">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{userProgress.completedPaths}</p>
                      <p className="text-sm text-muted-foreground">Paths Completed</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-none bg-transparent">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="p-3 rounded-full bg-accent/10">
                      <Trophy className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{userProgress.totalPoints}</p>
                      <p className="text-sm text-muted-foreground">Points Earned</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-none bg-transparent">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="p-3 rounded-full bg-green-500/10">
                      <Award className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{userProgress.certificates}</p>
                      <p className="text-sm text-muted-foreground">Certificates Earned</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        <section className="py-12 sm:py-16">
          <InlinePromoVideo
            src="/videos/promo-training.mp4"
            poster="/videos/poster-training.png"
            heading="Learn at Your Own Pace"
            description="Structured courses, interactive quizzes, and certificates for every family."
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          />
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Choose Your Learning Path</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Select your audience for personalized training content designed specifically for your needs and experience level.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
              {Object.entries(audienceInfo).map(([key, info]) => {
                const Icon = info.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedAudience(key === selectedAudience ? "all" : key)}
                    className={`p-4 rounded-lg border-2 transition-all hover-elevate ${
                      selectedAudience === key 
                        ? `${info.borderColor} ${info.bgColor}` 
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                    data-testid={`button-audience-${key}`}
                  >
                    <Icon className="w-8 h-8 mx-auto mb-2 text-foreground" />
                    <p className="font-medium text-sm">{info.title.split(" ")[0]}</p>
                  </button>
                );
              })}
            </div>

            <Tabs defaultValue="paths" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="paths" data-testid="tab-learning-paths">Learning Paths</TabsTrigger>
                <TabsTrigger value="certifications" data-testid="tab-certifications">Certifications</TabsTrigger>
              </TabsList>

              <TabsContent value="paths">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                      <Card key={i} className="animate-pulse">
                        <CardHeader>
                          <div className="h-6 bg-muted rounded w-3/4" />
                          <div className="h-4 bg-muted rounded w-1/2 mt-2" />
                        </CardHeader>
                        <CardContent>
                          <div className="h-20 bg-muted rounded" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredPaths && filteredPaths.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPaths.map(path => {
                      const info = audienceInfo[path.audience as keyof typeof audienceInfo];
                      const Icon = info?.icon || BookOpen;
                      return (
                        <Card key={path.id} className="hover-elevate overflow-hidden" data-testid={`card-path-${path.id}`}>
                          <div className={`h-2 bg-gradient-to-r ${info?.color || "from-primary to-accent"}`} />
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className={`p-2 rounded-lg ${info?.bgColor || "bg-muted"}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <Badge variant="outline">{path.level}</Badge>
                            </div>
                            <CardTitle className="mt-3">{path.title}</CardTitle>
                            <CardDescription>{path.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {path.estimatedHours} hours
                              </span>
                              <span className="flex items-center gap-1">
                                <Award className="w-4 h-4" />
                                {path.certificateName}
                              </span>
                            </div>
                            <Link href={`/training/${path.id}`}>
                              <Button className="w-full" data-testid={`button-start-path-${path.id}`}>
                                Start Path
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Learning Paths Coming Soon</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      We're developing comprehensive training content for each audience. 
                      Sign up to be notified when new courses are available.
                    </p>
                    <Button variant="outline" data-testid="button-notify-me">
                      Notify Me
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="certifications">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {certificationLevels.map(cert => (
                    <Card key={cert.level} className="relative overflow-hidden" data-testid={`card-cert-${cert.level}`}>
                      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 ${
                        cert.badge === "Bronze" ? "bg-amber-600/10" :
                        cert.badge === "Silver" ? "bg-slate-400/10" :
                        "bg-yellow-500/10"
                      }`} />
                      <CardHeader>
                        <Badge variant="secondary" className="w-fit mb-2">{cert.badge}</Badge>
                        <CardTitle>{cert.name}</CardTitle>
                        <CardDescription>{cert.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{cert.hours} hours to complete</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Seven Core Competency Domains</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our curriculum is aligned with the NIST NICE Framework, covering all essential cybersecurity competencies.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {competencyDomains.map(domain => {
                const Icon = domain.icon;
                return (
                  <Card key={domain.id} className="hover-elevate" data-testid={`card-domain-${domain.id}`}>
                    <CardContent className="p-6">
                      <Icon className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-semibold mb-1">{domain.name}</h3>
                      <p className="text-sm text-muted-foreground">{domain.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-gradient-to-r from-primary/10 via-background to-accent/10 border-primary/20">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Security Journey?</h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-6">
                  Join thousands of learners who have improved their digital safety skills through our structured training programs.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" data-testid="button-get-started">
                    Get Started Free
                  </Button>
                  <Button size="lg" variant="outline" data-testid="button-view-resources">
                    Browse Resources
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
