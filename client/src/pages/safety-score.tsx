"use client";

import { useState } from "react";
import { useSEO } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Link } from "@/lib/navigation";
import { Shield, CheckCircle, XCircle, ArrowRight, RotateCcw, Mail, Lock, Smartphone, Users, Eye, MessageCircle, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DailyTipsSubscription } from "@/components/daily-tips-subscription";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Question {
  id: string;
  question: string;
  icon: typeof Shield;
  category: string;
  options: {
    text: string;
    score: number;
    feedback: string;
  }[];
}

const questions: Question[] = [
  {
    id: "passwords",
    question: "How do you manage your passwords?",
    icon: Lock,
    category: "Account Security",
    options: [
      { text: "I use a password manager with unique passwords for each account", score: 3, feedback: "Excellent! This is the gold standard for password security." },
      { text: "I have a few strong passwords I rotate between accounts", score: 2, feedback: "Good effort, but reusing passwords puts multiple accounts at risk if one is breached." },
      { text: "I use similar or the same password everywhere", score: 1, feedback: "This is risky. If one account is hacked, all your accounts are vulnerable." },
      { text: "I don't really think about it", score: 0, feedback: "Time to start! Weak passwords are the #1 way hackers get into accounts." }
    ]
  },
  {
    id: "2fa",
    question: "Do you use two-factor authentication (2FA)?",
    icon: Smartphone,
    category: "Account Security",
    options: [
      { text: "Yes, on all important accounts (email, banking, social media)", score: 3, feedback: "Great! 2FA blocks 99% of automated attacks." },
      { text: "Yes, but only on some accounts", score: 2, feedback: "Good start! Consider adding it to email and financial accounts first." },
      { text: "I've heard of it but haven't set it up", score: 1, feedback: "It's easier than you think and makes a huge difference." },
      { text: "I don't know what that is", score: 0, feedback: "2FA adds an extra step (like a text code) when logging in. It's very effective against hackers." }
    ]
  },
  {
    id: "links",
    question: "When you receive a link via text or email, what do you do?",
    icon: Eye,
    category: "Scam Awareness",
    options: [
      { text: "I check the sender carefully and hover/preview links before clicking", score: 3, feedback: "Smart approach! This catches most phishing attempts." },
      { text: "I'm careful with unknown senders but trust familiar ones", score: 2, feedback: "Be aware that scammers can spoof familiar contacts or hack their accounts." },
      { text: "I usually click if the message looks legitimate", score: 1, feedback: "Scammers are very good at making messages look real. Always verify." },
      { text: "I just click and see what happens", score: 0, feedback: "This is how most people get phished. One click can compromise everything." }
    ]
  },
  {
    id: "calls",
    question: "You get a call from 'your bank' saying your account is compromised. What do you do?",
    icon: MessageCircle,
    category: "Scam Awareness",
    options: [
      { text: "Hang up and call the bank directly using the number on my card", score: 3, feedback: "Perfect! This is exactly what banks recommend." },
      { text: "Ask questions to verify it's really them before sharing info", score: 2, feedback: "Scammers are trained to answer questions convincingly. Calling back is safer." },
      { text: "Follow their instructions if they seem legitimate", score: 1, feedback: "Banks never ask for passwords or PINs over the phone. This could be a scam." },
      { text: "Provide the information they ask for to protect my account", score: 0, feedback: "Stop! Real banks never call and ask for sensitive information." }
    ]
  },
  {
    id: "family",
    question: "Do you talk to family members about online safety?",
    icon: Users,
    category: "Family Protection",
    options: [
      { text: "Yes, we discuss scams and safety regularly", score: 3, feedback: "Wonderful! Open communication is the best defense for families." },
      { text: "Sometimes, when something comes up in the news", score: 2, feedback: "Great instinct. Making it a regular conversation helps even more." },
      { text: "Not really, everyone figures it out on their own", score: 1, feedback: "Many scams target specific age groups. Sharing knowledge protects everyone." },
      { text: "I don't think about it", score: 0, feedback: "Family members are often each other's first line of defense against scams." }
    ]
  },
  {
    id: "updates",
    question: "How do you handle software updates?",
    icon: Shield,
    category: "Device Security",
    options: [
      { text: "I install updates as soon as they're available", score: 3, feedback: "Excellent! Updates often patch security vulnerabilities." },
      { text: "I update when I have time, usually within a week", score: 2, feedback: "Good, but critical security updates should be installed quickly." },
      { text: "I delay updates because they're annoying", score: 1, feedback: "Delaying updates leaves known security holes open for hackers." },
      { text: "I ignore updates or turned them off", score: 0, feedback: "This leaves your devices extremely vulnerable to attacks." }
    ]
  }
];

function getScoreLevel(score: number, maxScore: number) {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 80) return { level: "Excellent", color: "text-green-600", bgColor: "bg-green-100", borderColor: "border-green-200", progressColor: "bg-green-500" };
  if (percentage >= 60) return { level: "Good", color: "text-blue-600", bgColor: "bg-blue-100", borderColor: "border-blue-200", progressColor: "bg-blue-500" };
  if (percentage >= 40) return { level: "Fair", color: "text-amber-600", bgColor: "bg-amber-100", borderColor: "border-amber-200", progressColor: "bg-amber-500" };
  return { level: "Needs Work", color: "text-red-600", bgColor: "bg-red-100", borderColor: "border-red-200", progressColor: "bg-red-500" };
}

function getRecommendations(answers: Record<string, number>) {
  const recs: { title: string; link: string; priority: "high" | "medium" | "low" }[] = [];
  
  if ((answers["passwords"] || 0) < 2) {
    recs.push({ title: "Start using a password manager", link: "/resources", priority: "high" });
  }
  if ((answers["2fa"] || 0) < 2) {
    recs.push({ title: "Set up two-factor authentication", link: "/resources", priority: "high" });
  }
  if ((answers["links"] || 0) < 2 || (answers["calls"] || 0) < 2) {
    recs.push({ title: "Learn to spot scams and phishing", link: "/seniors", priority: "high" });
  }
  if ((answers["family"] || 0) < 2) {
    recs.push({ title: "Talk to your family about online safety", link: "/parent-guide", priority: "medium" });
  }
  if ((answers["updates"] || 0) < 2) {
    recs.push({ title: "Enable automatic updates on your devices", link: "/resources", priority: "medium" });
  }
  
  return recs;
}

export default function SafetyScore() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useSEO({
    title: "Family Safety Score - GetCyberRight",
    description: "Take our free 2-minute quiz to discover your family's cyber safety strengths and get personalized recommendations.",
    keywords: "cyber safety quiz, security assessment, online safety score, family protection"
  });

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxScore = questions.length * 3;
  const scoreInfo = getScoreLevel(totalScore, maxScore);
  const recommendations = getRecommendations(answers);

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    
    const question = questions[currentQuestion];
    const score = question.options[selectedAnswer].score;
    
    setAnswers(prev => ({ ...prev, [question.id]: score }));
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setShowResult(true);
    }
  };

  const { toast } = useToast();

  const restart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setEmailSent(false);
    setEmailInput("");
  };

  const handleEmailResults = async () => {
    if (!emailInput || emailSending) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address", variant: "destructive" });
      return;
    }
    
    setEmailSending(true);
    try {
      await apiRequest("/api/quiz-results/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput,
          score: totalScore,
          maxScore,
          level: scoreInfo.level,
          recommendations
        })
      });
      setEmailSent(true);
      toast({ title: "Results sent!", description: "Check your inbox for your personalized recommendations" });
    } catch {
      toast({ title: "Failed to send", description: "Please try again later", variant: "destructive" });
    } finally {
      setEmailSending(false);
    }
  };

  const progress = ((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {!showResult ? (
            <>
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Family Safety Score
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Quick 2-minute quiz to check your online safety habits
                </p>
              </motion.div>

              <div className="mb-6">
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                  <span>Question {currentQuestion + 1} of {questions.length}</span>
                  <span>{questions[currentQuestion].category}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-2">
                    <CardContent className="p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-6">
                        {(() => {
                          const IconComponent = questions[currentQuestion].icon;
                          return (
                            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
                              <IconComponent className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                            </div>
                          );
                        })()}
                        <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                          {questions[currentQuestion].question}
                        </h2>
                      </div>

                      <div className="space-y-3">
                        {questions[currentQuestion].options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                              selectedAnswer === index
                                ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                            }`}
                          >
                            <span className="text-slate-900 dark:text-white">{option.text}</span>
                          </button>
                        ))}
                      </div>

                      {showFeedback && selectedAnswer !== null && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg"
                        >
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            {questions[currentQuestion].options[selectedAnswer].feedback}
                          </p>
                        </motion.div>
                      )}

                      <div className="mt-6 flex justify-end">
                        <Button
                          onClick={handleNext}
                          disabled={selectedAnswer === null}
                          className="bg-teal-600 hover:bg-teal-700"
                        >
                          {currentQuestion < questions.length - 1 ? "Next Question" : "See My Score"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className={`border-2 ${scoreInfo.borderColor} overflow-hidden`}>
                <div className={`${scoreInfo.bgColor} p-8 text-center`}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-lg mb-4"
                  >
                    <span className={`text-3xl font-bold ${scoreInfo.color}`}>
                      {Math.round((totalScore / maxScore) * 100)}%
                    </span>
                  </motion.div>
                  <h2 className={`text-2xl md:text-3xl font-bold ${scoreInfo.color} mb-2`}>
                    {scoreInfo.level}
                  </h2>
                  <p className="text-slate-700">
                    You scored {totalScore} out of {maxScore} points
                  </p>
                </div>

                <CardContent className="p-6 md:p-8">
                  {recommendations.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                        Your Personalized Recommendations
                      </h3>
                      <div className="space-y-3">
                        {recommendations.map((rec, index) => (
                          <Link key={index} to={rec.link}>
                            <div className={`flex items-center justify-between p-4 rounded-lg border-2 hover:shadow-md transition-all cursor-pointer ${
                              rec.priority === "high" 
                                ? "border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800" 
                                : "border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800"
                            }`}>
                              <div className="flex items-center gap-3">
                                {rec.priority === "high" ? (
                                  <XCircle className="h-5 w-5 text-red-500" />
                                ) : (
                                  <CheckCircle className="h-5 w-5 text-amber-500" />
                                )}
                                <span className="font-medium text-slate-900 dark:text-white">{rec.title}</span>
                              </div>
                              <ArrowRight className="h-4 w-4 text-slate-400" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {recommendations.length === 0 && (
                    <div className="mb-8 text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                      <p className="text-green-700 dark:text-green-300 font-medium">
                        Great job! You have strong cyber safety habits.
                      </p>
                    </div>
                  )}

                  <div className="border-t pt-6 mb-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <Send className="h-5 w-5 text-teal-600" />
                      Email My Results
                    </h3>
                    {emailSent ? (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        <span>Results sent to {emailInput}</span>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          placeholder="Your email address"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleEmailResults}
                          disabled={emailSending || !emailInput}
                          className="bg-teal-600 hover:bg-teal-700"
                        >
                          {emailSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <Mail className="h-5 w-5 text-teal-600" />
                      Stay Protected
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Get weekly safety tips delivered to your inbox to keep improving your score.
                    </p>
                    <DailyTipsSubscription />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <Button
                      onClick={restart}
                      variant="outline"
                      className="flex-1"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Retake Quiz
                    </Button>
                    <Button asChild className="flex-1 bg-teal-600 hover:bg-teal-700">
                      <Link to="/resources">
                        Explore Resources
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
