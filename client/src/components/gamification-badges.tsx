"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@/lib/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Shield,
  Star,
  Lock,
  Award,
  Target,
  Zap,
  BookOpen,
  Eye,
  Search,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Crown,
  Medal,
  Flame,
  LogIn
} from "lucide-react";

interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: typeof Trophy;
  category: "scanner" | "education" | "community" | "streak";
  tier: "bronze" | "silver" | "gold" | "platinum";
  requirement: string;
  points: number;
  earned: boolean;
  progress?: number;
  maxProgress?: number;
}

interface UserStats {
  totalPoints: number;
  level: number;
  scansCompleted: number;
  lessonsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  rank: number;
  nextLevelPoints: number;
}

const mockUserStats: UserStats = {
  totalPoints: 1250,
  level: 5,
  scansCompleted: 23,
  lessonsCompleted: 8,
  currentStreak: 3,
  longestStreak: 7,
  rank: 847,
  nextLevelPoints: 1500
};

const allBadges: AchievementBadge[] = [
  {
    id: "first-scan",
    name: "First Scan",
    description: "Complete your first security scan",
    icon: Search,
    category: "scanner",
    tier: "bronze",
    requirement: "Complete 1 scan",
    points: 10,
    earned: true,
    progress: 1,
    maxProgress: 1
  },
  {
    id: "scan-master",
    name: "Scan Master",
    description: "Complete 25 security scans",
    icon: Shield,
    category: "scanner",
    tier: "silver",
    requirement: "Complete 25 scans",
    points: 50,
    earned: false,
    progress: 23,
    maxProgress: 25
  },
  {
    id: "threat-hunter",
    name: "Threat Hunter",
    description: "Identify 10 malicious URLs",
    icon: Target,
    category: "scanner",
    tier: "gold",
    requirement: "Find 10 threats",
    points: 100,
    earned: false,
    progress: 4,
    maxProgress: 10
  },
  {
    id: "security-expert",
    name: "Security Expert",
    description: "Complete 100 security scans",
    icon: Crown,
    category: "scanner",
    tier: "platinum",
    requirement: "Complete 100 scans",
    points: 250,
    earned: false,
    progress: 23,
    maxProgress: 100
  },
  {
    id: "first-lesson",
    name: "Knowledge Seeker",
    description: "Complete your first security lesson",
    icon: BookOpen,
    category: "education",
    tier: "bronze",
    requirement: "Complete 1 lesson",
    points: 15,
    earned: true,
    progress: 1,
    maxProgress: 1
  },
  {
    id: "phishing-expert",
    name: "Phishing Expert",
    description: "Complete all phishing awareness modules",
    icon: Eye,
    category: "education",
    tier: "silver",
    requirement: "Complete phishing course",
    points: 75,
    earned: true,
    progress: 5,
    maxProgress: 5
  },
  {
    id: "deepfake-detective",
    name: "Deepfake Detective",
    description: "Complete the deepfake detection training",
    icon: Zap,
    category: "education",
    tier: "gold",
    requirement: "Complete deepfake course",
    points: 100,
    earned: false,
    progress: 2,
    maxProgress: 4
  },
  {
    id: "cyber-scholar",
    name: "Cyber Scholar",
    description: "Complete all educational modules",
    icon: Award,
    category: "education",
    tier: "platinum",
    requirement: "Complete all courses",
    points: 300,
    earned: false,
    progress: 8,
    maxProgress: 20
  },
  {
    id: "week-warrior",
    name: "Week Warrior",
    description: "Maintain a 7-day learning streak",
    icon: Flame,
    category: "streak",
    tier: "bronze",
    requirement: "7-day streak",
    points: 25,
    earned: true,
    progress: 7,
    maxProgress: 7
  },
  {
    id: "month-master",
    name: "Month Master",
    description: "Maintain a 30-day learning streak",
    icon: Medal,
    category: "streak",
    tier: "gold",
    requirement: "30-day streak",
    points: 150,
    earned: false,
    progress: 3,
    maxProgress: 30
  },
  {
    id: "community-helper",
    name: "Community Helper",
    description: "Report 5 scams to help protect others",
    icon: Users,
    category: "community",
    tier: "silver",
    requirement: "Report 5 scams",
    points: 50,
    earned: false,
    progress: 2,
    maxProgress: 5
  },
  {
    id: "guardian",
    name: "Guardian",
    description: "Share security tips with 10 family members",
    icon: Shield,
    category: "community",
    tier: "gold",
    requirement: "Share with 10 people",
    points: 100,
    earned: false,
    progress: 3,
    maxProgress: 10
  }
];

const tierColors = {
  bronze: "bg-amber-600",
  silver: "bg-slate-400",
  gold: "bg-yellow-500",
  platinum: "bg-purple-500"
};

const tierBorderColors = {
  bronze: "border-amber-600",
  silver: "border-slate-400",
  gold: "border-yellow-500",
  platinum: "border-purple-500"
};

const tierTextColors = {
  bronze: "text-amber-600",
  silver: "text-slate-500",
  gold: "text-yellow-600",
  platinum: "text-purple-600"
};

function getLevelTitle(level: number): string {
  if (level >= 20) return "Cyber Guardian";
  if (level >= 15) return "Security Expert";
  if (level >= 10) return "Threat Hunter";
  if (level >= 5) return "Digital Defender";
  if (level >= 2) return "Security Apprentice";
  return "Cyber Rookie";
}

export function GamificationBadges() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Check if user is authenticated
  const { data: authData, isLoading: authLoading } = useQuery<{ user: any }>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });
  
  const isAuthenticated = !!authData?.user;
  
  // Fetch real progress data when authenticated
  const { data: progressData, isLoading: progressLoading } = useQuery<{ success: boolean; progress: any }>({
    queryKey: ["/api/gamification/progress"],
    enabled: isAuthenticated,
    retry: false,
  });
  
  // Fetch real badge data when authenticated
  const { data: badgesData, isLoading: badgesLoading } = useQuery<{ 
    success: boolean; 
    earnedBadges: any[]; 
    allBadges: any[] 
  }>({
    queryKey: ["/api/gamification/badges"],
    enabled: isAuthenticated,
    retry: false,
  });
  
  // Use real stats if authenticated, otherwise demo stats
  const stats = progressData?.progress ? {
    totalPoints: progressData.progress.totalPoints || 0,
    level: progressData.progress.level || 1,
    scansCompleted: progressData.progress.scansCompleted || 0,
    lessonsCompleted: progressData.progress.lessonsCompleted || 0,
    currentStreak: progressData.progress.currentStreak || 0,
    longestStreak: progressData.progress.longestStreak || 0,
    rank: 1000, // Would come from leaderboard API
    nextLevelPoints: ((progressData.progress.level || 1) + 1) * 300
  } : mockUserStats;
  
  // Map earned badges from API to display format
  const earnedBadgeIds = new Set((badgesData?.earnedBadges || []).map(b => b.badgeId));
  
  // Update allBadges with real earned status when authenticated
  const displayBadges = isAuthenticated && badgesData 
    ? allBadges.map(badge => ({
        ...badge,
        earned: earnedBadgeIds.has(badge.id)
      }))
    : allBadges;
  
  const earnedBadges = displayBadges.filter(b => b.earned);
  const inProgressBadges = displayBadges.filter(b => !b.earned);
  
  const progressToNextLevel = ((stats.totalPoints % 300) / 300) * 100;
  
  const filteredBadges = selectedCategory 
    ? displayBadges.filter(b => b.category === selectedCategory)
    : displayBadges;
    
  const isLoading = authLoading || (isAuthenticated && (progressLoading || badgesLoading));

  return (
    <Card className="w-full" data-testid="card-gamification">
      <CardHeader className="text-center pb-2">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>
        <CardTitle className="text-2xl">Your Security Achievements</CardTitle>
        <CardDescription className="text-base max-w-lg mx-auto">
          Earn points and badges as you learn to protect yourself online. 
          Track your progress and compete on the leaderboard.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-muted-foreground">Loading your achievements...</span>
          </div>
        )}
        
        {/* Demo mode notice for non-authenticated users */}
        {!isAuthenticated && !authLoading && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <LogIn className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium text-sm">Demo Mode</div>
                  <p className="text-xs text-muted-foreground">
                    Sign in to track your real progress and earn badges
                  </p>
                </div>
              </div>
              <Link href="/login">
                <Button size="sm" data-testid="button-login-achievements">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        )}

        {!isLoading && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview" className="gap-2" data-testid="tab-overview">
              <Star className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="badges" className="gap-2" data-testid="tab-badges">
              <Award className="w-4 h-4" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="gap-2" data-testid="tab-leaderboard">
              <TrendingUp className="w-4 h-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 p-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{stats.level}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    Level
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold text-foreground mb-1">
                    {getLevelTitle(stats.level)}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {stats.totalPoints.toLocaleString()} total points
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress to Level {stats.level + 1}</span>
                      <span>{stats.nextLevelPoints - stats.totalPoints} pts needed</span>
                    </div>
                    <Progress value={progressToNextLevel} className="h-2" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <Search className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stats.scansCompleted}</div>
                <div className="text-xs text-muted-foreground">Scans Completed</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <BookOpen className="w-6 h-6 mx-auto mb-2 text-accent" />
                <div className="text-2xl font-bold">{stats.lessonsCompleted}</div>
                <div className="text-xs text-muted-foreground">Lessons Done</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <Flame className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                <div className="text-2xl font-bold">{stats.currentStreak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">{earnedBadges.length}</div>
                <div className="text-xs text-muted-foreground">Badges Earned</div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Recent Badges</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setActiveTab("badges")}
                  data-testid="button-view-all-badges"
                >
                  View All
                </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                {earnedBadges.slice(0, 4).map((badge) => (
                  <div
                    key={badge.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 ${tierBorderColors[badge.tier]} bg-card`}
                    data-testid={`badge-${badge.id}`}
                  >
                    <div className={`w-8 h-8 rounded-full ${tierColors[badge.tier]} flex items-center justify-center`}>
                      <badge.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{badge.name}</div>
                      <div className="text-xs text-muted-foreground">+{badge.points} pts</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Almost There!</h3>
              <div className="space-y-3">
                {inProgressBadges
                  .filter(b => b.progress && b.maxProgress && (b.progress / b.maxProgress) >= 0.5)
                  .slice(0, 3)
                  .map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-4 p-3 rounded-lg border bg-card"
                      data-testid={`progress-badge-${badge.id}`}
                    >
                      <div className={`w-10 h-10 rounded-full ${tierColors[badge.tier]} opacity-50 flex items-center justify-center`}>
                        <badge.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{badge.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {badge.progress}/{badge.maxProgress}
                          </span>
                        </div>
                        <Progress 
                          value={(badge.progress! / badge.maxProgress!) * 100} 
                          className="h-1.5" 
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                data-testid="filter-all"
              >
                All
              </Button>
              <Button
                variant={selectedCategory === "scanner" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("scanner")}
                data-testid="filter-scanner"
              >
                <Search className="w-3 h-3 mr-1" />
                Scanner
              </Button>
              <Button
                variant={selectedCategory === "education" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("education")}
                data-testid="filter-education"
              >
                <BookOpen className="w-3 h-3 mr-1" />
                Education
              </Button>
              <Button
                variant={selectedCategory === "streak" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("streak")}
                data-testid="filter-streak"
              >
                <Flame className="w-3 h-3 mr-1" />
                Streaks
              </Button>
              <Button
                variant={selectedCategory === "community" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("community")}
                data-testid="filter-community"
              >
                <Users className="w-3 h-3 mr-1" />
                Community
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {filteredBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`relative p-4 rounded-xl border-2 ${
                    badge.earned 
                      ? tierBorderColors[badge.tier] 
                      : "border-muted opacity-60"
                  } bg-card`}
                  data-testid={`badge-card-${badge.id}`}
                >
                  {badge.earned && (
                    <div className="absolute -top-2 -right-2">
                      <CheckCircle className="w-5 h-5 text-green-500 fill-green-100" />
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-full ${
                      badge.earned ? tierColors[badge.tier] : "bg-muted"
                    } flex items-center justify-center flex-shrink-0`}>
                      {badge.earned ? (
                        <badge.icon className="w-6 h-6 text-white" />
                      ) : (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{badge.name}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-[10px] ${tierTextColors[badge.tier]}`}
                        >
                          {badge.tier}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {badge.description}
                      </p>
                      {!badge.earned && badge.progress !== undefined && badge.maxProgress && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{badge.requirement}</span>
                            <span>{badge.progress}/{badge.maxProgress}</span>
                          </div>
                          <Progress 
                            value={(badge.progress / badge.maxProgress) * 100} 
                            className="h-1.5" 
                          />
                        </div>
                      )}
                      {badge.earned && (
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <Star className="w-3 h-3 fill-current" />
                          +{badge.points} points earned
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-transparent rounded-xl p-4 border border-yellow-500/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-lg font-bold text-white">#{stats.rank}</span>
                </div>
                <div>
                  <div className="font-semibold">Your Current Rank</div>
                  <div className="text-sm text-muted-foreground">
                    {stats.totalPoints.toLocaleString()} points this month
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { rank: 1, name: "CyberGuardian_Pro", points: 4520, level: 12 },
                { rank: 2, name: "SecureFamily2024", points: 3890, level: 10 },
                { rank: 3, name: "PhishingFighter", points: 3654, level: 9 },
                { rank: 4, name: "DigitalDefender", points: 3210, level: 8 },
                { rank: 5, name: "SafetyFirst_Mom", points: 2980, level: 8 },
                { rank: "...", name: "", points: 0, level: 0 },
                { rank: stats.rank - 1, name: "TechSavvyDad", points: 1280, level: 5 },
                { rank: stats.rank, name: "You", points: stats.totalPoints, level: stats.level, isUser: true },
                { rank: stats.rank + 1, name: "NewLearner42", points: 1190, level: 5 },
              ].map((entry, idx) => (
                entry.rank === "..." ? (
                  <div key={idx} className="text-center py-2 text-muted-foreground">
                    ...
                  </div>
                ) : (
                  <div
                    key={idx}
                    className={`flex items-center gap-4 p-3 rounded-lg ${
                      (entry as any).isUser 
                        ? "bg-primary/10 border-2 border-primary" 
                        : "bg-muted/30"
                    }`}
                    data-testid={`leaderboard-row-${entry.rank}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      entry.rank === 1 ? "bg-yellow-500 text-white" :
                      entry.rank === 2 ? "bg-slate-400 text-white" :
                      entry.rank === 3 ? "bg-amber-600 text-white" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {entry.rank === 1 ? <Crown className="w-4 h-4" /> : entry.rank}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{entry.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Level {entry.level} {getLevelTitle(entry.level)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{entry.points.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                )
              ))}
            </div>

            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Leaderboard resets monthly. Keep learning to climb the ranks!
              </p>
            </div>
          </TabsContent>
        </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
