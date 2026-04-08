"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Target, Star, Zap, Shield, BookOpen, Award } from "lucide-react";

interface UserProgress {
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  assessmentsCompleted: number;
  resourcesViewed: number;
  skillLevel: "beginner" | "intermediate" | "advanced";
  badges: Badge[];
  weeklyGoal: number;
  weeklyProgress: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

const defaultBadges: Badge[] = [
  { id: "first-step", name: "First Step", description: "Complete your first assessment", icon: "trophy", unlocked: false },
  { id: "streak-3", name: "On Fire", description: "Maintain a 3-day streak", icon: "flame", unlocked: false },
  { id: "streak-7", name: "Week Warrior", description: "Maintain a 7-day streak", icon: "zap", unlocked: false },
  { id: "explorer", name: "Explorer", description: "View 10 different resources", icon: "book", unlocked: false },
  { id: "rising-star", name: "Rising Star", description: "Earn 100 points", icon: "star", unlocked: false },
  { id: "defender", name: "Cyber Defender", description: "Complete 10 assessments", icon: "shield", unlocked: false },
];

const getStoredProgress = (): UserProgress => {
  const stored = localStorage.getItem("userProgress");
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    currentStreak: 0,
    longestStreak: 0,
    totalPoints: 0,
    assessmentsCompleted: 0,
    resourcesViewed: 0,
    skillLevel: "beginner",
    badges: defaultBadges,
    weeklyGoal: 5,
    weeklyProgress: 0,
  };
};

const saveProgress = (progress: UserProgress) => {
  localStorage.setItem("userProgress", JSON.stringify(progress));
};

export function UserProgressCard() {
  const [progress, setProgress] = useState<UserProgress>(getStoredProgress);

  useEffect(() => {
    const stored = getStoredProgress();
    setProgress(stored);
  }, []);

  const levelColors = {
    beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    advanced: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  };

  const weeklyPercentage = Math.min((progress.weeklyProgress / progress.weeklyGoal) * 100, 100);

  return (
    <Card className="w-full" data-testid="card-user-progress">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Your Progress</span>
          <Badge className={levelColors[progress.skillLevel]}>
            {progress.skillLevel.charAt(0).toUpperCase() + progress.skillLevel.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Streak & Points Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{progress.currentStreak}</div>
              <div className="text-xs text-slate-500">Day Streak</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/40 rounded-full flex items-center justify-center">
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{progress.totalPoints}</div>
              <div className="text-xs text-slate-500">Points</div>
            </div>
          </div>
        </div>

        {/* Weekly Goal */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Weekly Goal
            </span>
            <span className="text-sm text-slate-500">
              {progress.weeklyProgress}/{progress.weeklyGoal} activities
            </span>
          </div>
          <Progress value={weeklyPercentage} className="h-2" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <Target className="h-4 w-4 text-blue-500 mx-auto mb-1" />
            <div className="text-lg font-semibold">{progress.assessmentsCompleted}</div>
            <div className="text-xs text-slate-500">Assessments</div>
          </div>
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <BookOpen className="h-4 w-4 text-green-500 mx-auto mb-1" />
            <div className="text-lg font-semibold">{progress.resourcesViewed}</div>
            <div className="text-xs text-slate-500">Resources</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BadgesDisplay() {
  const [progress] = useState<UserProgress>(getStoredProgress);
  const unlockedCount = progress.badges.filter(b => b.unlocked).length;

  const getIcon = (iconName: string) => {
    const icons: Record<string, typeof Trophy> = {
      trophy: Trophy,
      flame: Flame,
      zap: Zap,
      book: BookOpen,
      star: Star,
      shield: Shield,
      award: Award,
    };
    return icons[iconName] || Trophy;
  };

  return (
    <Card className="w-full" data-testid="card-badges">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Achievements</span>
          <Badge variant="outline">{unlockedCount}/{progress.badges.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {progress.badges.slice(0, 6).map((badge) => {
            const IconComponent = getIcon(badge.icon);
            return (
              <div
                key={badge.id}
                className={`text-center p-3 rounded-lg transition-all ${
                  badge.unlocked
                    ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                    : "bg-slate-100 dark:bg-slate-800 opacity-50"
                }`}
                title={badge.description}
                data-testid={`badge-${badge.id}`}
              >
                <IconComponent
                  className={`h-6 w-6 mx-auto mb-1 ${
                    badge.unlocked ? "text-yellow-500" : "text-slate-400"
                  }`}
                />
                <div className="text-xs font-medium truncate">{badge.name}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function StreakIndicator() {
  const [progress] = useState<UserProgress>(getStoredProgress);

  if (progress.currentStreak === 0) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Flame className="h-4 w-4" />
        <span className="text-sm">Start your streak today!</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
        <Flame className="h-4 w-4 text-orange-500" />
        <span className="text-sm font-medium text-orange-600">{progress.currentStreak} day streak</span>
      </div>
    </div>
  );
}
