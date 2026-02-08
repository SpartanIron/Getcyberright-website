import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Shield, Zap, Award, Clock, Target, Star, Crown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { CyberAssessment, UserAssessmentResult, CyberAchievement, UserAchievement } from "@shared/schema";

// Generate or get session ID
const getSessionId = () => {
  let sessionId = localStorage.getItem('cyberAwarenessSessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('cyberAwarenessSessionId', sessionId);
  }
  return sessionId;
};

interface AssessmentResult {
  result: UserAssessmentResult;
  newAchievements?: UserAchievement[];
}

export default function CyberAwareness() {
  const [sessionId] = useState(getSessionId);
  const [currentAssessment, setCurrentAssessment] = useState<CyberAssessment | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [newAchievements, setNewAchievements] = useState<UserAchievement[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [currentStreak, setCurrentStreak] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [showHints, setShowHints] = useState(true);
  const [dailyGoal, setDailyGoal] = useState(5);
  const [completedToday, setCompletedToday] = useState(0);

  const queryClient = useQueryClient();

  // Fetch assessments
  const { data: assessments = [], isLoading: assessmentsLoading } = useQuery<CyberAssessment[]>({
    queryKey: ["/api/cyber-assessments"],
  });

  // Fetch user score
  const { data: userScore } = useQuery<{
    totalScore: number;
    correctAnswers: number;
    totalQuestions: number;
    categoryBreakdown: Record<string, { correct: number; total: number; score: number }>;
  }>({
    queryKey: [`/api/cyber-score/${sessionId}`],
  });

  // Fetch achievements
  const { data: allAchievements = [] } = useQuery<CyberAchievement[]>({
    queryKey: ["/api/cyber-achievements"],
  });

  const { data: userAchievements = [] } = useQuery<UserAchievement[]>({
    queryKey: [`/api/cyber-achievements/${sessionId}`],
  });

  // Submit assessment mutation
  const submitAssessment = useMutation({
    mutationFn: async (data: { sessionId: string; assessmentId: number; selectedAnswer: number; isCorrect: boolean; timeSpent: number }) => {
      const response = await fetch("/api/cyber-assessments/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: (response: any) => {
      if (response.newAchievements) {
        setNewAchievements(response.newAchievements);
      }
      queryClient.invalidateQueries({ queryKey: [`/api/cyber-score/${sessionId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/cyber-achievements/${sessionId}`] });
    },
  });

  // Timer effect
  useEffect(() => {
    if (startTime && !showResult) {
      const interval = setInterval(() => {
        setTimeSpent(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [startTime, showResult]);

  const startAssessment = (assessment: CyberAssessment) => {
    setCurrentAssessment(assessment);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeSpent(0);
    setStartTime(new Date());
    setNewAchievements([]);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || !currentAssessment) return;

    const correct = selectedAnswer === currentAssessment.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    submitAssessment.mutate({
      sessionId,
      assessmentId: currentAssessment.id,
      selectedAnswer,
      isCorrect: correct,
      timeSpent,
    });
  };

  const nextAssessment = () => {
    const availableAssessments = assessments.filter(a => a.id !== currentAssessment?.id);
    if (availableAssessments.length > 0) {
      const randomAssessment = availableAssessments[Math.floor(Math.random() * availableAssessments.length)];
      startAssessment(randomAssessment);
    } else {
      setCurrentAssessment(null);
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Trophy, Shield, Zap, Award, Clock, Target, Star, Crown
    };
    return icons[iconName] || Trophy;
  };

  const categories = ["all", "phishing", "passwords", "social-engineering", "physical-security", "network-security", "system-security", "data-protection", "incident-response"];
  const filteredAssessments = activeCategory === "all" 
    ? assessments 
    : assessments.filter(a => a.category === activeCategory);

  if (assessmentsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Family Safety Skills Check
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          Test your ability to spot scams and protect your family online
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" />
            Learn by Doing
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-green-500" />
            Real-World Scenarios
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-purple-500" />
            Earn Achievements
          </div>
        </div>
      </div>

      {/* New Achievements Alert */}
      {newAchievements.length > 0 && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20">
          <Trophy className="h-4 w-4" />
          <AlertDescription>
            🎉 Congratulations! You've unlocked {newAchievements.length} new achievement{newAchievements.length > 1 ? 's' : ''}:
            {newAchievements.map((achievement, index) => {
              const achievementDetails = allAchievements.find(a => a.id === achievement.achievementId);
              return achievementDetails ? ` ${achievementDetails.title}` : '';
            }).join(', ')}
          </AlertDescription>
        </Alert>
      )}

      {/* Daily Progress Dashboard */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="border-2 border-yellow-200 dark:border-yellow-800">
          <CardHeader className="text-center pb-2">
            <Zap className="h-6 w-6 mx-auto text-yellow-500 mb-1" />
            <CardTitle className="text-lg">Daily Streak</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-yellow-600">{currentStreak}</div>
            <p className="text-sm text-gray-500">days in a row</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardHeader className="text-center pb-2">
            <Target className="h-6 w-6 mx-auto text-blue-500 mb-1" />
            <CardTitle className="text-lg">Daily Goal</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-blue-600">{completedToday}/{dailyGoal}</div>
            <Progress value={(completedToday / dailyGoal) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 dark:border-green-800">
          <CardHeader className="text-center pb-2">
            <Crown className="h-6 w-6 mx-auto text-green-500 mb-1" />
            <CardTitle className="text-lg">Level</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-green-600 capitalize">{difficultyLevel}</div>
            <p className="text-sm text-gray-500">difficulty</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 dark:border-purple-800">
          <CardHeader className="text-center pb-2">
            <Trophy className="h-6 w-6 mx-auto text-purple-500 mb-1" />
            <CardTitle className="text-lg">Total Score</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-purple-600">{userScore?.totalScore || 0}</div>
            <p className="text-sm text-gray-500">points earned</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="challenge" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="challenge">Take Challenge</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="challenge" className="space-y-6">
          {!currentAssessment ? (
            <div className="space-y-6">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(category)}
                    className="capitalize"
                  >
                    {category.replace('-', ' ')}
                  </Button>
                ))}
              </div>

              {/* Assessment Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssessments.map((assessment) => (
                  <Card key={assessment.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{assessment.title}</CardTitle>
                        <Badge variant={assessment.difficulty === 'beginner' ? 'secondary' : assessment.difficulty === 'intermediate' ? 'default' : 'destructive'}>
                          {assessment.difficulty}
                        </Badge>
                      </div>
                      <CardDescription>{assessment.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 capitalize">{assessment.category.replace('-', ' ')}</span>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{assessment.points} pts</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-4" 
                        onClick={() => startAssessment(assessment)}
                      >
                        Start Challenge
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            /* Assessment Interface */
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl">{currentAssessment.title}</CardTitle>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {timeSpent}s
                    </Badge>
                    <Badge>{currentAssessment.points} pts</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Scenario */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Scenario</h3>
                  <p className="text-blue-800 dark:text-blue-200">{currentAssessment.scenario}</p>
                </div>

                {/* Question */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">{currentAssessment.question}</h3>
                  <div className="space-y-3">
                    {currentAssessment.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={selectedAnswer === index ? "default" : "outline"}
                        className="w-full text-left p-4 h-auto justify-start"
                        onClick={() => !showResult && setSelectedAnswer(index)}
                        disabled={showResult}
                      >
                        <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Result */}
                {showResult && (
                  <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? (
                        <Trophy className="h-5 w-5 text-green-600" />
                      ) : (
                        <Target className="h-5 w-5 text-red-600" />
                      )}
                      <span className={`font-semibold ${isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                        {isCorrect ? 'Correct!' : 'Incorrect'}
                      </span>
                    </div>
                    <p className={`${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                      {currentAssessment.explanation}
                    </p>
                    {!isCorrect && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Correct answer: {String.fromCharCode(65 + currentAssessment.correctAnswer)}. {currentAssessment.options[currentAssessment.correctAnswer]}
                      </p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                  {!showResult ? (
                    <Button 
                      onClick={submitAnswer} 
                      disabled={selectedAnswer === null}
                      className="flex-1"
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <>
                      <Button onClick={nextAssessment} className="flex-1">
                        Next Challenge
                      </Button>
                      <Button variant="outline" onClick={() => setCurrentAssessment(null)}>
                        Back to Challenges
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {userScore && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="text-center">
                  <Trophy className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
                  <CardTitle>Total Score</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">{userScore.totalScore}</div>
                  <p className="text-sm text-gray-500">points earned</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Target className="h-8 w-8 mx-auto text-green-500 mb-2" />
                  <CardTitle>Accuracy</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {userScore.totalQuestions > 0 ? Math.round((userScore.correctAnswers / userScore.totalQuestions) * 100) : 0}%
                  </div>
                  <p className="text-sm text-gray-500">{userScore.correctAnswers}/{userScore.totalQuestions} correct</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Clock className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                  <CardTitle>Challenges</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{userScore.totalQuestions}</div>
                  <p className="text-sm text-gray-500">completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Award className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{userAchievements.length}</div>
                  <p className="text-sm text-gray-500">unlocked</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Category Breakdown */}
          {userScore && Object.keys(userScore.categoryBreakdown).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(userScore.categoryBreakdown).map(([category, stats]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize">{category.replace('-', ' ')}</span>
                      <span className="text-sm text-gray-500">
                        {stats.correct}/{stats.total} ({Math.round((stats.correct / stats.total) * 100)}%)
                      </span>
                    </div>
                    <Progress value={(stats.correct / stats.total) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allAchievements.map((achievement) => {
              const isUnlocked = userAchievements.some(ua => ua.achievementId === achievement.id);
              const IconComponent = getIconComponent(achievement.badgeIcon);
              
              return (
                <Card key={achievement.id} className={`transition-all ${isUnlocked ? 'ring-2 ring-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : 'opacity-60'}`}>
                  <CardHeader className="text-center">
                    <IconComponent className={`h-12 w-12 mx-auto mb-2 ${isUnlocked ? 'text-yellow-500' : 'text-gray-400'}`} />
                    <CardTitle className={isUnlocked ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-500'}>
                      {achievement.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm mb-3">{achievement.description}</p>
                    <Badge variant={isUnlocked ? "default" : "outline"}>
                      {achievement.points} points
                    </Badge>
                    {isUnlocked && (
                      <p className="text-xs text-green-600 mt-2 font-medium">✓ UNLOCKED</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-yellow-500" />
                Global Leaderboard
              </CardTitle>
              <CardDescription>
                See how you rank against other cybersecurity learners worldwide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Top 3 Podium */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2">
                      <Crown className="h-8 w-8 text-gray-500" />
                    </div>
                    <div className="text-sm font-medium">CyberGuard_Pro</div>
                    <div className="text-xs text-gray-500">8,420 pts</div>
                    <Badge variant="outline" className="mt-1">2nd</Badge>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-2 border-4 border-yellow-500">
                      <Crown className="h-10 w-10 text-yellow-600" />
                    </div>
                    <div className="text-lg font-bold">SecMaster_2024</div>
                    <div className="text-sm text-yellow-600 font-semibold">12,850 pts</div>
                    <Badge className="mt-1 bg-yellow-500">1st</Badge>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-2">
                      <Crown className="h-8 w-8 text-orange-500" />
                    </div>
                    <div className="text-sm font-medium">InfoSecNinja</div>
                    <div className="text-xs text-gray-500">7,290 pts</div>
                    <Badge variant="outline" className="mt-1">3rd</Badge>
                  </div>
                </div>

                {/* Leaderboard List */}
                <div className="space-y-2">
                  {[
                    { rank: 4, name: "CyberDefender_X", score: 6850, streak: 12 },
                    { rank: 5, name: "SecuritySage", score: 6420, streak: 8 },
                    { rank: 6, name: "PhishBuster", score: 5980, streak: 15 },
                    { rank: 7, name: "ThreatHunter_99", score: 5640, streak: 6 },
                    { rank: 8, name: "You", score: userScore?.totalScore || 0, streak: currentStreak, isCurrentUser: true },
                    { rank: 9, name: "CryptoGuardian", score: 4920, streak: 4 },
                    { rank: 10, name: "NetworkShield", score: 4580, streak: 11 },
                  ].map((user) => (
                    <div 
                      key={user.rank} 
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        user.isCurrentUser ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          user.rank <= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {user.rank}
                        </div>
                        <div>
                          <div className={`font-medium ${user.isCurrentUser ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                            {user.name}
                            {user.isCurrentUser && <span className="ml-2 text-xs text-blue-500">(You)</span>}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <Zap className="h-3 w-3" />
                            {user.streak} day streak
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{user.score.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Weekly Challenge */}
                <Card className="mt-6 border-2 border-purple-200 dark:border-purple-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Star className="h-5 w-5 text-purple-500" />
                      Weekly Challenge
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Complete 25 assessments</span>
                        <Badge variant="outline">500 bonus points</Badge>
                      </div>
                      <Progress value={((completedToday * 7) / 25) * 100} className="h-2" />
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {completedToday * 7}/25 completed • {Math.max(0, 25 - (completedToday * 7))} remaining
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}