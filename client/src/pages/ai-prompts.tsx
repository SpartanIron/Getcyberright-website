import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { Link } from "@/lib/navigation";
import {
  Search,
  Copy,
  Check,
  Users,
  Heart,
  GraduationCap,
  Briefcase,
  Home,
  Shield,
  Mail,
  FileText,
  DollarSign,
  Stethoscope,
  MessageSquare,
  Wrench,
  Brain,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Target,
  Lightbulb,
  Lock,
  ShoppingCart,
  Scale,
  Clock,
  Zap
} from "lucide-react";
import bannerImage from "@/assets/banners/ai-prompts-banner.webp";

type Audience = "all" | "everyday" | "families" | "seniors" | "students" | "business";
type Category = "all" | "productivity" | "communication" | "safety" | "health" | "finance" | "learning" | "work" | "tech";

interface DbPrompt {
  id: string;
  slug: string;
  title: string;
  promptText: string;
  audience: string[];
  category: string;
  tags: string[];
  useCase: string;
  safetyNote: string | null;
  iconName: string;
  isActive: boolean;
  version: number;
}

interface Prompt {
  id: string;
  title: string;
  prompt: string;
  audience: Audience[];
  category: Category;
  tags: string[];
  useCase: string;
  safetyNote?: string;
  icon: typeof Search;
}

const iconMap: Record<string, typeof Search> = {
  Search, Copy, Check, Users, Heart, GraduationCap, Briefcase, Home, Shield,
  Mail, FileText, DollarSign, Stethoscope, MessageSquare, Wrench, Brain,
  AlertTriangle, ArrowRight, Sparkles, BookOpen, Target, Lightbulb, Lock,
  ShoppingCart, Scale, Clock, Zap,
};

function mapDbPromptToPrompt(dbPrompt: DbPrompt): Prompt {
  return {
    id: dbPrompt.slug || dbPrompt.id,
    title: dbPrompt.title,
    prompt: dbPrompt.promptText,
    audience: dbPrompt.audience as Audience[],
    category: dbPrompt.category as Category,
    tags: dbPrompt.tags || [],
    useCase: dbPrompt.useCase,
    safetyNote: dbPrompt.safetyNote || undefined,
    icon: iconMap[dbPrompt.iconName] || Shield,
  };
}

const audiences: { id: Audience; label: string; icon: typeof Search; description: string }[] = [
  { id: "all", label: "All Prompts", icon: Sparkles, description: "Browse the full collection" },
  { id: "everyday", label: "Everyday", icon: Home, description: "Daily life and productivity" },
  { id: "families", label: "Families", icon: Users, description: "Parents and family safety" },
  { id: "seniors", label: "Seniors", icon: Heart, description: "Health, safety, and daily tasks" },
  { id: "students", label: "Students", icon: GraduationCap, description: "Learning and school work" },
  { id: "business", label: "Small Business", icon: Briefcase, description: "Operations and growth" },
];

const categories: { id: Category; label: string; icon: typeof Search }[] = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "productivity", label: "Productivity", icon: Target },
  { id: "communication", label: "Communication", icon: Mail },
  { id: "safety", label: "Safety & Privacy", icon: Shield },
  { id: "health", label: "Health & Wellness", icon: Stethoscope },
  { id: "finance", label: "Finance", icon: DollarSign },
  { id: "learning", label: "Learning", icon: BookOpen },
  { id: "work", label: "Work & Career", icon: Briefcase },
  { id: "tech", label: "Tech Help", icon: Wrench },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleCopy}
      data-testid="button-copy-prompt"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 mr-1.5" />
          Copied
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 mr-1.5" />
          Copy Prompt
        </>
      )}
    </Button>
  );
}

function PromptCard({ prompt: p }: { prompt: Prompt }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover-elevate" data-testid={`card-prompt-${p.id}`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <p.icon className="w-4.5 h-4.5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm leading-tight">{p.title}</h3>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {categories.find(c => c.id === p.category) && (
                <Badge variant="secondary" className="text-xs">
                  {categories.find(c => c.id === p.category)?.label}
                </Badge>
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-3">{p.useCase}</p>

          <div
            className={`relative bg-muted/50 rounded-md p-3.5 mb-3 text-sm text-foreground leading-relaxed ${
              !expanded && p.prompt.length > 200 ? "max-h-28 overflow-hidden" : ""
            }`}
            data-testid={`text-prompt-${p.id}`}
          >
            <code className="text-sm whitespace-pre-wrap break-words font-mono">{p.prompt}</code>
            {!expanded && p.prompt.length > 200 && (
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-muted/80 to-transparent" />
            )}
          </div>

          {p.prompt.length > 200 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-primary mb-3 cursor-pointer"
              data-testid={`button-expand-${p.id}`}
            >
              {expanded ? "Show less" : "Show full prompt"}
            </button>
          )}

          {p.safetyNote && (
            <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/20 rounded-md p-2.5 mb-3 text-xs">
              <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span className="text-amber-700 dark:text-amber-300">{p.safetyNote}</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1 flex-wrap">
              {p.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <CopyButton text={p.prompt} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AIPrompts() {
  const [selectedAudience, setSelectedAudience] = useState<Audience>("all");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: dbPrompts, isLoading } = useQuery<DbPrompt[]>({
    queryKey: ["/api/prompts"],
  });

  const prompts: Prompt[] = useMemo(() => {
    if (!dbPrompts || dbPrompts.length === 0) return [];
    return dbPrompts.map(mapDbPromptToPrompt);
  }, [dbPrompts]);

  const filteredPrompts = useMemo(() => {
    return prompts.filter(p => {
      const matchesAudience = selectedAudience === "all" || p.audience.includes(selectedAudience);
      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
      const matchesSearch = searchQuery === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.useCase.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesAudience && matchesCategory && matchesSearch;
    });
  }, [prompts, selectedAudience, selectedCategory, searchQuery]);

  const audienceCounts = useMemo(() => {
    const counts: Record<string, number> = { all: prompts.length };
    audiences.forEach(a => {
      if (a.id !== "all") {
        counts[a.id] = prompts.filter(p => p.audience.includes(a.id as Audience)).length;
      }
    });
    return counts;
  }, [prompts]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.tools} title="AI Prompt Library: Ready-to-Use Templates for Everyday Life | GetCyberRight" description="A free, comprehensive collection of AI prompts for families, seniors, students, and small businesses. Copy, paste, and use with no AI experience required." />
      <Navigation />

      <PageBanner
        title="AI Prompt Library"
        subtitle="Ready-to-use AI templates for everyday life. Copy, paste, and get things done. No experience needed."
        imageSrc={bannerImage}
        imageAlt="AI Prompt Library banner with neural network patterns"
        colorVariant="teal"
      />

      <main id="main-content" className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge variant="outline" className="mb-4" data-testid="badge-prompt-count">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              {prompts.length} Prompts
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4" data-testid="heading-prompt-library">
              AI Made Simple
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You don't need to be a tech expert to use AI well. These templates are written for real people with real tasks, from planning meals to spotting scams. Just copy a prompt, paste it into any AI tool (ChatGPT, Google Gemini, Claude, Copilot), fill in the brackets, and go.
            </p>
          </div>

          <Card className="mb-10 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20" data-testid="card-safety-reminder">
            <CardContent className="py-5 px-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-md bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">Before You Start</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Never share passwords, Social Security numbers, credit card details, or medical IDs with AI tools.
                    AI responses can be wrong, so always verify important information.
                    These prompts work with any major AI tool.{" "}
                    <Link href="/ai-safety" className="text-primary underline" data-testid="link-ai-safety-tips">
                      Learn more about AI safety
                    </Link>.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={selectedAudience} onValueChange={(v) => { setSelectedAudience(v as Audience); setSelectedCategory("all"); }} className="mb-8">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0" data-testid="tabs-audience">
              {audiences.map(a => (
                <TabsTrigger
                  key={a.id}
                  value={a.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-2 text-sm"
                  data-testid={`tab-audience-${a.id}`}
                >
                  <a.icon className="w-4 h-4 mr-1.5" />
                  {a.label}
                  <span className="ml-1.5 text-xs opacity-70">({audienceCounts[a.id] || 0})</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-prompts"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {categories.map(c => (
                <Button
                  key={c.id}
                  size="sm"
                  variant={selectedCategory === c.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(c.id)}
                  data-testid={`button-category-${c.id}`}
                >
                  {c.label}
                </Button>
              ))}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6" data-testid="text-results-count">
            Showing {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? "s" : ""}
            {selectedAudience !== "all" && ` for ${audiences.find(a => a.id === selectedAudience)?.label}`}
            {selectedCategory !== "all" && ` in ${categories.find(c => c.id === selectedCategory)?.label}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredPrompts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-5" data-testid="grid-prompts">
              {filteredPrompts.map(p => (
                <PromptCard key={p.id} prompt={p} />
              ))}
            </div>
          ) : (
            <Card className="py-16 text-center">
              <CardContent>
                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No prompts found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your filters or search terms.
                </p>
                <Button
                  variant="outline"
                  onClick={() => { setSearchQuery(""); setSelectedAudience("all"); setSelectedCategory("all"); }}
                  data-testid="button-clear-filters"
                >
                  Clear all filters
                </Button>
              </CardContent>
            </Card>
          )}

          <section className="mt-16 mb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground text-center mb-8" data-testid="heading-how-to-use">
                How to Use These Prompts
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  {
                    step: "1",
                    title: "Copy",
                    description: "Find a prompt that fits your situation and click \"Copy Prompt\" to copy it to your clipboard.",
                    icon: Copy,
                  },
                  {
                    step: "2",
                    title: "Customize",
                    description: "Paste it into any AI tool and replace the [BRACKETS] with your specific details. The more detail you add, the better the result.",
                    icon: Zap,
                  },
                  {
                    step: "3",
                    title: "Verify",
                    description: "Always double-check important information the AI gives you. AI can be wrong, especially about facts, numbers, and medical or legal advice.",
                    icon: Shield,
                  },
                ].map(item => (
                  <Card key={item.step} data-testid={`card-step-${item.step}`}>
                    <CardContent className="p-5 text-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-xs font-medium text-primary mb-1">Step {item.step}</div>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-0" data-testid="card-cta">
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Want to Learn How to Stay Safe with AI?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                AI is powerful, but it also creates new risks. Learn how to spot deepfakes, detect AI-generated scams, and protect your privacy when using AI tools.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Button size="lg" asChild data-testid="button-ai-safety">
                  <Link href="/ai-safety">
                    AI Safety Guide
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild data-testid="button-training">
                  <Link href="/training">
                    Training Academy
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
