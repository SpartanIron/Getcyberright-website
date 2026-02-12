import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Shield, History, GraduationCap, Trash2, X } from "lucide-react";

interface SignupEncouragementBannerProps {
  toolName: string;
  show: boolean;
  contextMessage?: string;
}

const DISMISS_PREFIX = "signupBannerDismissed:";

const benefits = [
  { icon: History, text: "Save your scan history" },
  { icon: Trash2, text: "Track data broker removals" },
  { icon: GraduationCap, text: "Earn training certificates" },
  { icon: Shield, text: "Get personalized safety tips" },
];

export function SignupEncouragementBanner({ toolName, show, contextMessage }: SignupEncouragementBannerProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const storageKey = `${DISMISS_PREFIX}${toolName}`;
  const [dismissed, setDismissed] = useState(() => {
    try {
      const val = localStorage.getItem(storageKey);
      if (!val) return false;
      const expiry = parseInt(val, 10);
      if (Date.now() > expiry) {
        localStorage.removeItem(storageKey);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  });

  if (!show || isLoading || isAuthenticated || dismissed) return null;

  const handleDismiss = () => {
    try {
      localStorage.setItem(storageKey, String(Date.now() + 7 * 24 * 60 * 60 * 1000));
    } catch {}
    setDismissed(true);
  };

  return (
    <Card className="mt-6 border-teal-200 dark:border-teal-800 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30" data-testid="banner-signup-encouragement">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1" data-testid="text-signup-heading">
              {contextMessage || "Want to save your results?"}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Create an account to save your results and track your progress. No cost, no catch, ever.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {benefits.map((b) => (
                <div key={b.text} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <b.icon className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/register">
                <Button size="sm" data-testid="button-signup-from-banner">
                  Create Account
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="sm" data-testid="button-login-from-banner">
                  Already have one? Sign in
                </Button>
              </Link>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            aria-label="Dismiss sign-up suggestion"
            className="flex-shrink-0"
            data-testid="button-dismiss-signup-banner"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
