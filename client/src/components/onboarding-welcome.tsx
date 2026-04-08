import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Search,
  Bell,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  X,
  Scan,
  Chrome,
  Lock,
} from "lucide-react";
import { Link } from "@/lib/navigation";

interface OnboardingWelcomeProps {
  firstName: string;
  onDismiss: () => void;
}

const steps = [
  {
    id: "scan",
    icon: Search,
    title: "Run your first security scan",
    description: "Check if your personal data has been exposed on data broker sites.",
    action: "/data-removal",
    actionLabel: "Start Scan",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    id: "scam-check",
    icon: Scan,
    title: "Try the AI Scam Scanner",
    description: "Paste any suspicious URL, phone number, or message to check if it's a scam.",
    action: "/scam-checker",
    actionLabel: "Check a Scam",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
  {
    id: "extension",
    icon: Chrome,
    title: "Install browser protection",
    description: "Get real-time protection against phishing sites and scam links.",
    action: "/tools",
    actionLabel: "Get Extension",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "mfa",
    icon: Lock,
    title: "Enable two-factor authentication",
    description: "Add an extra layer of security to your GetCyberRight account.",
    action: "/account",
    actionLabel: "Set Up MFA",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    id: "learn",
    icon: BookOpen,
    title: "Start your training path",
    description: "Learn the essentials of staying safe online with guided lessons.",
    action: "/training",
    actionLabel: "Start Learning",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    id: "alerts",
    icon: Bell,
    title: "Set up breach monitoring",
    description: "Get notified instantly when your email appears in a new data breach.",
    action: "/breach-dashboard",
    actionLabel: "Enable Alerts",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
];

export function OnboardingWelcome({ firstName, onDismiss }: OnboardingWelcomeProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("gcr_onboarding_completed");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const markComplete = (stepId: string) => {
    const updated = new Set(completedSteps);
    updated.add(stepId);
    setCompletedSteps(updated);
    localStorage.setItem("gcr_onboarding_completed", JSON.stringify([...updated]));
  };

  const progress = Math.round((completedSteps.size / steps.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      data-testid="onboarding-welcome"
    >
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  Welcome to GetCyberRight, {firstName}
                </h2>
              </div>
              <p className="text-muted-foreground">
                Let's set up your protection. Complete these steps to secure your digital life.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              data-testid="button-dismiss-onboarding"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Setup Progress</span>
              <span className="text-sm text-muted-foreground">{completedSteps.size}/{steps.length} complete</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {steps.map((step) => {
              const isComplete = completedSteps.has(step.id);
              return (
                <motion.div
                  key={step.id}
                  whileHover={{ scale: 1.01 }}
                  className={`relative rounded-lg border p-4 transition-colors ${
                    isComplete
                      ? "border-green-500/30 bg-green-500/5"
                      : "border-border hover:border-primary/30 bg-card"
                  }`}
                  data-testid={`onboarding-step-${step.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isComplete ? "bg-green-500/10" : step.bgColor
                    }`}>
                      {isComplete ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <step.icon className={`w-5 h-5 ${step.color}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-semibold mb-1 ${
                        isComplete ? "text-muted-foreground line-through" : "text-foreground"
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {step.description}
                      </p>
                      {!isComplete ? (
                        <Link href={step.action}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => markComplete(step.id)}
                            data-testid={`button-onboarding-${step.id}`}
                          >
                            {step.actionLabel}
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      ) : (
                        <span className="text-xs text-green-600 font-medium">Done</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
