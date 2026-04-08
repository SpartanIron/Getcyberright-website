import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "@/lib/navigation";
import { Shield, ArrowRight, CheckCircle, BookOpen, Target, Trophy, Zap, Award, MessageSquareHeart } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  category: "fundamentals" | "threats" | "defense" | "practices" | "career";
  weights: number[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "How familiar are you with common cybersecurity terms like 'phishing', 'malware', and 'firewall'?",
    options: ["Never heard of them", "Heard of them but not sure what they mean", "Understand the basics", "Can explain them to others"],
    category: "fundamentals",
    weights: [0, 1, 2, 3]
  },
  {
    id: 2,
    question: "What would you do if you received an email from your bank asking you to verify your account by clicking a link?",
    options: ["Click the link and verify", "Forward it to colleagues", "Ignore it or report as spam", "Call the bank directly using official contact info"],
    category: "threats",
    weights: [0, 0, 2, 3]
  },
  {
    id: 3,
    question: "How do you currently manage your passwords?",
    options: ["Same password for everything", "A few variations of the same password", "Different passwords written down", "Password manager with unique passwords"],
    category: "practices",
    weights: [0, 1, 2, 3]
  },
  {
    id: 4,
    question: "Have you enabled two-factor authentication (2FA) on your important accounts?",
    options: ["What's 2FA?", "No, seems too complicated", "On some accounts", "Yes, on all important accounts"],
    category: "defense",
    weights: [0, 1, 2, 3]
  },
  {
    id: 5,
    question: "What is your main goal with online safety?",
    options: ["Keep my family safe online", "Protect myself from scams", "Learn more about threats", "Help others stay safe"],
    category: "practices",
    weights: [1, 2, 3, 4]
  }
];

interface SkillLevel {
  level: "beginner" | "intermediate" | "advanced";
  score: number;
  recommendations: {
    title: string;
    description: string;
    link: string;
    icon: typeof Shield;
  }[];
}

function getSkillLevel(score: number): SkillLevel {
  if (score <= 5) {
    return {
      level: "beginner",
      score,
      recommendations: [
        { title: "Youth Safety Guide", description: "Learn how to stay safe on social media and apps", link: "/kids", icon: BookOpen },
        { title: "Digital Safety Tips", description: "Learn one tip per day to build habits", link: "/resources", icon: Shield },
        { title: "GCR Scam Guard", description: "Check if a message or offer is a scam", link: "/tools", icon: Target }
      ]
    };
  } else if (score <= 10) {
    return {
      level: "intermediate",
      score,
      recommendations: [
        { title: "Latest Threat News", description: "Stay updated on current threats", link: "/news", icon: Zap },
        { title: "Senior Protection", description: "Learn to spot mobile money and phone scams", link: "/seniors", icon: Shield },
        { title: "Emergency Help", description: "Get help if you've been scammed", link: "/emergency-help", icon: Target }
      ]
    };
  } else {
    return {
      level: "advanced",
      score,
      recommendations: [
        { title: "Parent Guide", description: "Help protect your children online", link: "/parent-guide", icon: Award },
        { title: "Threat Trends", description: "Deep dive into threat analysis", link: "/threat-trends", icon: Zap },
        { title: "All Resources", description: "Explore our full resource library", link: "/resources", icon: Trophy }
      ]
    };
  }
}

export function QuickAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [started, setStarted] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    if (completed || currentQuestion >= questions.length) return;
    
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const calculateScore = () => {
    return answers.reduce((total, answer, index) => {
      if (index >= questions.length) return total;
      return total + questions[index].weights[answer];
    }, 0);
  };

  const startAssessment = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setCompleted(false);
    setStarted(true);
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setCompleted(false);
    setStarted(false);
  };

  if (!started) {
    return (
      <Card className="max-w-2xl mx-auto border-2 border-blue-100 dark:border-blue-900" data-testid="card-quick-assessment-start">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Quick Skill Assessment
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Answer 5 quick questions to discover your cybersecurity skill level and get a personalized learning path.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500 mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              5 Questions
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              2 Minutes
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Free
            </div>
          </div>
          <Button
            size="lg"
            onClick={startAssessment}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            data-testid="button-start-quick-assessment"
          >
            Start Assessment
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (completed) {
    const result = getSkillLevel(calculateScore());
    
    return (
      <Card className="max-w-2xl mx-auto" data-testid="card-assessment-results">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              result.level === "beginner" ? "bg-green-100 dark:bg-green-900/30" :
              result.level === "intermediate" ? "bg-blue-100 dark:bg-blue-900/30" :
              "bg-purple-100 dark:bg-purple-900/30"
            }`}>
              <Trophy className={`h-10 w-10 ${
                result.level === "beginner" ? "text-green-600" :
                result.level === "intermediate" ? "text-blue-600" :
                "text-purple-600"
              }`} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Your Skill Level: <span className="capitalize">{result.level}</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {result.level === "beginner" && "You're just getting started with cybersecurity. Great time to build strong foundations!"}
              {result.level === "intermediate" && "You have solid fundamentals. Ready to level up your skills!"}
              {result.level === "advanced" && "You have strong cybersecurity knowledge. Time to specialize and certify!"}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Recommended Next Steps:
            </h3>
            {result.recommendations.map((rec, index) => (
              <Link key={index} to={rec.link}>
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer" data-testid={`link-recommendation-${index}`}>
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <rec.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 dark:text-white">{rec.title}</div>
                    <div className="text-sm text-slate-500">{rec.description}</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </div>
              </Link>
            ))}
          </div>

          <div className="flex gap-4">
            <Button
              asChild
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              data-testid="button-full-assessment"
            >
              <Link to="/resources">
                Take Full Assessment
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={resetAssessment}
              data-testid="button-retake-assessment"
            >
              Retake Quiz
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquareHeart className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Was this helpful?</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Your feedback helps us improve</p>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/40" data-testid="button-share-feedback">
                <Link to="/contact">Share Feedback</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion) / questions.length) * 100;

  return (
    <Card className="max-w-2xl mx-auto" data-testid="card-assessment-question">
      <CardContent className="p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-500">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full text-left justify-start p-4 h-auto hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              onClick={() => handleAnswer(index)}
              data-testid={`button-option-${index}`}
            >
              <span className="font-medium text-blue-600 mr-3">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
