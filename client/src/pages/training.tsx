import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { InlinePromoVideo } from "@/components/inline-promo-video";
import { SEOHead } from "@/components/seo-head";
import { StructuredData } from "@/components/structured-data";
import type { CourseData, BreadcrumbData } from "@/components/structured-data";
import bannerImage from "@/assets/banners/training-banner.png";
import trainingKidsImg from "@/assets/images/card-training-kids.png";
import trainingParentsImg from "@/assets/images/card-training-parents.png";
import trainingSeniorsImg from "@/assets/images/card-training-seniors.png";
import trainingEducatorsImg from "@/assets/images/card-training-educators.png";
import trainingBusinessImg from "@/assets/images/card-training-business.png";
import trainingEveryoneImg from "@/assets/images/card-training-everyone.png";
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
    borderColor: "border-purple-200 dark:border-purple-800",
    image: trainingKidsImg
  },
  parents: {
    title: "Parents & Families",
    description: "Protect your family and guide your children online",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    image: trainingParentsImg
  },
  seniors: {
    title: "Seniors Protection",
    description: "Stay safe from scams, fraud, and online tricks",
    icon: Heart,
    color: "from-rose-500 to-orange-500",
    bgColor: "bg-rose-50 dark:bg-rose-950/20",
    borderColor: "border-rose-200 dark:border-rose-800",
    image: trainingSeniorsImg
  },
  educators: {
    title: "Educators & Schools",
    description: "Classroom-ready curriculum and resources",
    icon: GraduationCap,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    image: trainingEducatorsImg
  },
  "small-business": {
    title: "Small Business",
    description: "Employee training and compliance programs",
    icon: Briefcase,
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    borderColor: "border-amber-200 dark:border-amber-800",
    image: trainingBusinessImg
  },
  everyone: {
    title: "Everyone",
    description: "Essential safety skills for all ages and backgrounds",
    icon: Brain,
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    borderColor: "border-teal-200 dark:border-teal-800",
    image: trainingEveryoneImg
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

  const trainingCourseSchema: CourseData = {
    type: "Course",
    name: "GetCyberRight Cybersecurity and AI Training Academy",
    description: "Cybersecurity training courses with quizzes and certificates. Structured learning paths for kids, parents, seniors, educators, and small businesses.",
    provider: "GetCyberRight",
    url: "https://getcyberright.com/training",
    isAccessibleForFree: true,
  };

  const trainingBreadcrumbs: BreadcrumbData = {
    type: "BreadcrumbList",
    items: [
      { name: "Home", url: "https://getcyberright.com/" },
      { name: "Training Academy", url: "https://getcyberright.com/training" },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead title="Cybersecurity and AI Training Academy" description="Learn cybersecurity through structured courses with quizzes and certificates. Training paths for kids, parents, seniors, educators, and businesses." />
      <StructuredData data={[trainingCourseSchema, trainingBreadcrumbs]} />
      <Navigation />
      
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <section className="relative overflow-hidden bg-[#0A2A3C] h-[320px] sm:h-[360px] md:h-[400px] lg:h-[420px]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A2A3C] via-[#0A2A3C] to-[#00293C]" />

          <div className="absolute inset-0 hidden lg:block" aria-hidden="true">
            <img
              src={bannerImage}
              alt=""
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-[#0A2A3C]/75" />
          </div>

          <div className="absolute pointer-events-none hidden md:block" aria-hidden="true" style={{ top: 0, right: 0, width: "55%", height: "100%", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-40%", right: "2%", width: "50px", height: "220%", background: "linear-gradient(180deg, #003A52 0%, #0D4D66 50%, #003A52 100%)", transform: "rotate(20deg)", transformOrigin: "top center", filter: "drop-shadow(0 0 18px rgba(13, 148, 136, 0.15))" }} />
            <div style={{ position: "absolute", top: "-40%", right: "10%", width: "2px", height: "220%", background: "linear-gradient(180deg, transparent 10%, rgba(45, 212, 191, 0.4) 50%, transparent 90%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
            <div style={{ position: "absolute", top: "-35%", right: "18%", width: "35px", height: "220%", background: "linear-gradient(180deg, #5eead4 0%, #2dd4bf 35%, #14b8a6 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.55, filter: "drop-shadow(0 0 24px rgba(45, 212, 191, 0.3))" }} />
            <div style={{ position: "absolute", top: "-35%", right: "26%", width: "2px", height: "220%", background: "linear-gradient(180deg, transparent 15%, hsla(16, 95%, 58%, 0.35) 50%, transparent 85%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
            <div style={{ position: "absolute", top: "-30%", right: "32%", width: "50px", height: "220%", background: "linear-gradient(180deg, hsl(16, 100%, 62%) 0%, hsl(16, 95%, 52%) 40%, hsl(16, 90%, 42%) 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.5, filter: "drop-shadow(0 0 22px hsla(16, 95%, 55%, 0.25))" }} />
          </div>

          <div className="max-w-7xl mx-auto relative z-10 h-full">
            <div className="flex flex-col h-full">
              <div className="lg:hidden">
                <div className="relative h-[130px] sm:h-[150px] overflow-hidden">
                  <img src={bannerImage} alt="Diverse people learning cybersecurity together" className="w-full h-full object-cover" loading="eager" />
                  <div className="absolute inset-0 bg-[#0A2A3C]/60" />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0A2A3C] to-transparent" />
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center px-5 sm:px-6 lg:px-8 py-6 lg:py-0 lg:max-w-[55%]">
                <Badge variant="secondary" className="mb-4 w-fit" data-testid="badge-training-header">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  AI-Powered Curriculum
                </Badge>
                <h1 className="text-[1.75rem] sm:text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-white mb-5 leading-[1.08] tracking-[-0.025em]" data-testid="text-training-title">
                  Cybersecurity and AI Training Academy
                </h1>
                <p className="text-[0.95rem] sm:text-lg text-white/70 mb-7 leading-relaxed max-w-lg" data-testid="text-training-subtitle">
                  Master digital safety with structured learning paths, interactive lessons, 
                  and industry-recognized certifications tailored to your needs.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-accent text-accent-foreground border-accent-border rounded-full px-8 font-semibold" data-testid="button-start-learning" onClick={() => {
                    document.getElementById("learning-paths")?.scrollIntoView({ behavior: "smooth" });
                  }}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Start Learning
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full border-white/20 text-white bg-white/[0.05] hover:bg-white/[0.10]" data-testid="button-view-paths" onClick={() => {
                    document.getElementById("learning-paths")?.scrollIntoView({ behavior: "smooth" });
                  }}>
                    <Target className="w-4 h-4 mr-2" />
                    Explore Paths
                  </Button>
                </div>
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

        <section className="py-16" id="learning-paths">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Choose Your Learning Path</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Select your audience for personalized training content designed specifically for your needs and experience level.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
              {Object.entries(audienceInfo).map(([key, info]) => {
                const Icon = info.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedAudience(key === selectedAudience ? "all" : key)}
                    className={`relative rounded-lg border-2 transition-all overflow-hidden ${
                      selectedAudience === key 
                        ? `${info.borderColor} ${info.bgColor}` 
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                    data-testid={`button-audience-${key}`}
                  >
                    <div className="aspect-[16/10] relative">
                      <img
                        src={info.image}
                        alt={info.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        data-testid={`img-training-${key}`}
                      />
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <Icon className="w-7 h-7 mb-1" />
                        <p className="font-semibold text-sm">{info.title.split(" ")[0]}</p>
                      </div>
                    </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-6">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-6">
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
                    <Link href="/register">
                      <Button variant="outline" data-testid="button-notify-me">
                        Sign Up for Updates
                      </Button>
                    </Link>
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
                  <Button size="lg" data-testid="button-get-started" onClick={() => {
                    document.getElementById("learning-paths")?.scrollIntoView({ behavior: "smooth" });
                  }}>
                    Get Started
                  </Button>
                  <Link href="/resources">
                    <Button size="lg" variant="outline" data-testid="button-view-resources">
                      Browse Resources
                    </Button>
                  </Link>
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
