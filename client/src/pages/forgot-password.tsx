import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowLeft,
  KeyRound,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useLocation, Link } from "@/lib/navigation";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Step = "email" | "otp" | "password" | "success";

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send code");
        setIsLoading(false);
        return;
      }

      toast({
        title: "Code sent",
        description: "Check your email for the 6-digit verification code.",
      });
      setStep("otp");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid code");
        setIsLoading(false);
        return;
      }

      setResetToken(data.resetToken);
      setStep("password");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to reset password");
        setIsLoading(false);
        return;
      }

      setStep("success");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast({
          title: "Code resent",
          description: "A new verification code has been sent to your email.",
        });
        setOtpCode("");
      }
    } catch (err) {
      setError("Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <form onSubmit={handleRequestOTP} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
            data-testid="input-reset-email"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          We'll send a 6-digit verification code to this email
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
        data-testid="button-send-code"
      >
        {isLoading ? "Sending..." : "Send Verification Code"}
      </Button>

      <div className="text-center">
        <Link href="/login" className="text-sm text-primary hover:underline">
          Back to login
        </Link>
      </div>
    </form>
  );

  const renderOTPStep = () => (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">
          We sent a code to <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otp">Verification Code</Label>
        <Input
          id="otp"
          type="text"
          placeholder="000000"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="text-center text-2xl tracking-widest"
          maxLength={6}
          required
          autoFocus
          data-testid="input-otp-code"
        />
        <p className="text-sm text-muted-foreground text-center">
          Enter the 6-digit code from your email
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || otpCode.length !== 6}
        data-testid="button-verify-code"
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </Button>

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={() => setStep("email")}
          className="text-primary hover:underline flex items-center gap-1"
          data-testid="button-back-to-email"
        >
          <ArrowLeft className="w-3 h-3" />
          Change email
        </button>
        <button
          type="button"
          onClick={handleResendCode}
          disabled={isLoading}
          className="text-primary hover:underline"
          data-testid="button-resend-code"
        >
          Resend code
        </button>
      </div>
    </form>
  );

  const renderPasswordStep = () => (
    <form onSubmit={handleResetPassword} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10"
            required
            minLength={8}
            data-testid="input-new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            data-testid="button-toggle-password"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10"
            required
            minLength={8}
            data-testid="input-confirm-password"
          />
        </div>
      </div>

      <ul className="text-sm text-muted-foreground space-y-1">
        <li className={password.length >= 8 ? "text-green-600" : ""}>
          {password.length >= 8 ? "✓" : "•"} At least 8 characters
        </li>
        <li className={password === confirmPassword && password.length > 0 ? "text-green-600" : ""}>
          {password === confirmPassword && password.length > 0 ? "✓" : "•"} Passwords match
        </li>
      </ul>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || password.length < 8 || password !== confirmPassword}
        data-testid="button-reset-password"
      >
        {isLoading ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold">Password Reset Complete</h3>
      <p className="text-muted-foreground">
        Your password has been successfully reset. You can now log in with your new password.
      </p>
      <Button 
        onClick={() => setLocation("/login")} 
        className="w-full"
        data-testid="button-go-to-login"
      >
        Go to Login
      </Button>
    </div>
  );

  const getStepInfo = () => {
    switch (step) {
      case "email":
        return {
          title: "Forgot Password",
          description: "Enter your email to receive a verification code"
        };
      case "otp":
        return {
          title: "Enter Verification Code",
          description: "We sent a 6-digit code to your email"
        };
      case "password":
        return {
          title: "Create New Password",
          description: "Choose a strong password for your account"
        };
      case "success":
        return {
          title: "Success!",
          description: "Your password has been reset"
        };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Reset Password | GetCyberRight"
        description="Reset your GetCyberRight account password securely using email verification."
      />
      <Navigation />
      
      <main id="main-content" tabIndex={-1} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{stepInfo.title}</h1>
              <p className="text-muted-foreground">{stepInfo.description}</p>
            </div>

            {step !== "success" && (
              <div className="flex justify-center gap-2 mb-6">
                {["email", "otp", "password"].map((s, i) => (
                  <div
                    key={s}
                    className={`h-2 w-16 rounded-full ${
                      ["email", "otp", "password"].indexOf(step) >= i
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            )}

            <Card>
              <CardContent className="pt-6">
                {step === "email" && renderEmailStep()}
                {step === "otp" && renderOTPStep()}
                {step === "password" && renderPasswordStep()}
                {step === "success" && renderSuccessStep()}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
