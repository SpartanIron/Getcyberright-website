import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead, pageSEO } from "@/components/seo-head";
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
  UserPlus,
  ArrowRight,
  AlertCircle,
  Check,
  X,
  User
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { queryClient } from "@/lib/queryClient";

const passwordRequirements = [
  { label: "At least 12 characters", test: (p: string) => p.length >= 12 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
  { label: "One special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;
  const allRequirementsMet = passwordRequirements.every(req => req.test(formData.password));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!allRequirementsMet) {
      setError("Please meet all password requirements");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      toast({
        title: "Account created",
        description: "Please check your email to verify your account.",
      });

      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      setTimeout(() => {
        setLocation("/login");
      }, 2000);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main tabIndex={-1} className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">Account Created</h1>
              <p className="text-muted-foreground mb-6">
                Please check your email to verify your account. You will be redirected to the login page shortly.
              </p>
              <Link href="/login">
                <Button data-testid="button-go-to-login">
                  Go to Login
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.register} />
      <Navigation />
      
      <main tabIndex={-1} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
              <p className="text-muted-foreground">
                Join GetCyberRight to protect yourself online
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Sign Up</CardTitle>
                <CardDescription>
                  Fill in your details to create an account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="pl-10"
                          required
                          data-testid="input-first-name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10"
                        required
                        data-testid="input-email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10 pr-10"
                        required
                        data-testid="input-password"
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
                    
                    <div className="space-y-1 mt-2">
                      {passwordRequirements.map((req, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center gap-2 text-sm ${
                            req.test(formData.password) 
                              ? "text-green-600 dark:text-green-400" 
                              : "text-muted-foreground"
                          }`}
                        >
                          {req.test(formData.password) ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                          <span>{req.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="pl-10"
                        required
                        data-testid="input-confirm-password"
                      />
                    </div>
                    {formData.confirmPassword && (
                      <p className={`text-sm flex items-center gap-1 ${
                        passwordsMatch 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-destructive"
                      }`}>
                        {passwordsMatch ? (
                          <>
                            <Check className="w-3 h-3" />
                            Passwords match
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" />
                            Passwords do not match
                          </>
                        )}
                      </p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || !allRequirementsMet || !passwordsMatch}
                    data-testid="button-register"
                  >
                    {isLoading ? (
                      "Creating account..."
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Create Account
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By creating an account, you agree to our{" "}
                    <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  </p>
                </form>

                <div className="mt-6 pt-6 border-t">
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                      Sign in
                      <ArrowRight className="inline w-3 h-3 ml-1" />
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
