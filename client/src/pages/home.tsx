import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScamChecker } from "@/components/scam-checker";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Navigation } from "@/components/navigation";
import { 
  Shield, 
  ArrowRight, 
  Users, 
  Heart, 
  Briefcase, 
  GraduationCap, 
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
  Zap,
  Brain,
  Lock,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import familyImage from "@/assets/images/hero-family.jpg";
import seniorsImage from "@/assets/images/seniors-learning.png";
import businessImage from "@/assets/images/business-security-training.png";

const audiences = [
  {
    id: "families",
    title: "Parents & Families",
    description: "Protect your kids online with age-appropriate safety guides and conversation starters.",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    image: familyImage,
    href: "/parents",
    trainingHref: "/training/parents",
  },
  {
    id: "kids",
    title: "Kids & Teens",
    description: "Fun, interactive lessons on staying safe online for ages 8-16.",
    icon: Sparkles,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    image: familyImage,
    href: "/kids",
    trainingHref: "/training/kids",
  },
  {
    id: "seniors",
    title: "Seniors",
    description: "Plain-language guides to spot scams, protect identity, and use tech confidently.",
    icon: Heart,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    image: seniorsImage,
    href: "/seniors",
    trainingHref: "/training/seniors",
  },
  {
    id: "educators",
    title: "Educators",
    description: "Classroom resources and lesson plans for teaching digital citizenship.",
    icon: GraduationCap,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    image: businessImage,
    href: "/educators",
    trainingHref: "/training/educators",
  },
  {
    id: "business",
    title: "Small Business",
    description: "Free security awareness training to protect your team from phishing and social engineering.",
    icon: Briefcase,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    image: businessImage,
    href: "/small-business",
    trainingHref: "/training/business",
  },
];

const stats = [
  { value: "6", label: "Analysis Types", icon: Zap },
  { value: "200+", label: "Scam Patterns", icon: Shield },
  { value: "Free", label: "No Signup Needed", icon: CheckCircle2 },
];

const learningFeatures = [
  {
    icon: BookOpen,
    title: "Structured Courses",
    description: "Step-by-step learning paths from beginner to advanced, tailored to your experience level.",
  },
  {
    icon: Award,
    title: "Earn Certificates",
    description: "Complete courses and quizzes to earn shareable certificates proving your cyber safety knowledge.",
  },
  {
    icon: Brain,
    title: "AI-Powered Tips",
    description: "Get personalized safety recommendations based on the threats most relevant to you.",
  },
  {
    icon: MessageSquare,
    title: "Real-World Scenarios",
    description: "Practice identifying scams using actual examples so you know what to look for.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="GetCyberRight - Is This a Scam? Free Scam Checker & Cyber Safety Education"
        description="Check suspicious links, messages, and emails instantly with our free AI-powered scam checker. Learn to protect your family from cyber threats with courses for every age group."
        keywords="scam checker, is this a scam, phishing detector, cybersecurity education, online safety, family cyber safety, free scam check"
      />
      <Navigation />

      <main id="main-content" role="main" aria-label="Main content" tabIndex={-1}>
        {/* ===== HERO: SCAM CHECKER FRONT AND CENTER ===== */}
        <section className="relative bg-slate-900 overflow-hidden" data-testid="section-hero">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left: Value Prop */}
              <div className="text-center lg:text-left pt-4 lg:pt-8">
                <Badge variant="secondary" className="mb-4 bg-primary/20 text-primary border-0">
                  <Shield className="w-3.5 h-3.5 mr-1.5" />
                  Free - No Signup Required
                </Badge>

                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-5"
                  data-testid="text-hero-heading"
                >
                  Is This a Scam?
                  <span className="block text-primary mt-1">Find Out Instantly.</span>
                </h1>

                <p
                  className="text-base sm:text-lg text-white/80 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
                  data-testid="text-hero-subtext"
                >
                  Paste any suspicious message, link, email, or phone number. 
                  Our AI analyzes it in seconds and tells you if it's safe.
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-6">
                  {stats.map((stat) => (
                    <div key={stat.label} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <stat.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-white/60">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Embedded Scam Checker */}
              <div className="w-full" data-testid="hero-scam-checker">
                <ScamChecker />
              </div>
            </div>
          </div>
        </section>

        {/* ===== TRUST STRIP ===== */}
        <section className="border-b bg-muted/30 py-6" data-testid="section-trust-strip">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                <span>No data stored</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>Multi-engine scanning</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>AI-powered analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>Real-time threat data</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== EDUCATION PILLAR ===== */}
        <section className="py-16 sm:py-24 bg-background" data-testid="section-education">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge variant="secondary" className="mb-4 bg-accent/10 text-accent border-0">
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                Training Academy
              </Badge>
              <h2
                className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
                data-testid="text-education-heading"
              >
                Learn to Protect Your Family
              </h2>
              <p className="text-lg text-muted-foreground">
                Free courses designed for real people - not tech experts. 
                Pick your path and start learning in minutes.
              </p>
            </div>

            {/* Learning Features Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {learningFeatures.map((feature) => (
                <Card key={feature.title} className="hover-elevate" data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s/g, "-")}`}>
                  <CardContent className="p-5">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1.5">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Audience Paths */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground text-center mb-8" data-testid="text-audience-heading">
                Choose Your Learning Path
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {audiences.map((audience) => (
                  <Link key={audience.id} href={audience.trainingHref}>
                    <Card className="h-full hover-elevate cursor-pointer" data-testid={`card-audience-${audience.id}`}>
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-lg ${audience.bgColor} flex items-center justify-center flex-shrink-0`}>
                          <audience.icon className={`w-5 h-5 ${audience.color}`} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-foreground mb-1">{audience.title}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{audience.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Link href="/training">
                <Button size="lg" data-testid="button-explore-training">
                  Explore All Courses
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ===== BOTTOM CTA ===== */}
        <section className="py-16 bg-slate-900" data-testid="section-cta">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Got a Suspicious Message Right Now?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Don't click. Don't respond. Check it here first - it takes 10 seconds.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="#main-content">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground border-accent-border"
                  data-testid="button-cta-check-scam"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Check If It's a Scam
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/training">
                <Button size="lg" variant="outline" className="text-white border-white/20 bg-white/5" data-testid="button-cta-learn">
                  Start Learning Free
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
