"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  Mail, 
  Bell, 
  MessageSquare,
  Plus,
  Pencil,
  Trash2,
  Users,
  TrendingUp,
  Eye,
  Lock,
  LogIn,
  Search,
  BarChart3,
  AlertTriangle,
  Newspaper,
  Send,
  CheckCircle,
  Clock,
  Share2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Shield,
  AlertCircle,
  Loader2,
  Lightbulb,
  Fingerprint,
  Key,
  Settings,
  ChevronDown
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { startRegistration, startAuthentication, browserSupportsWebAuthn } from "@simplewebauthn/browser";
import type { Article, Resource, Newsletter, DailyTipsSubscription, WeeklyDigest, SecurityAlert } from "@shared/schema";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const twoFactorSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[@$!%*?&]/, "Must contain a special character (@$!%*?&)"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[@$!%*?&]/, "Must contain a special character (@$!%*?&)"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  author: z.string().min(1, "Author is required"),
  authorTitle: z.string().optional(),
  imageUrl: z.string().optional(),
  url: z.string().optional(),
  source: z.string().optional(),
  readTime: z.coerce.number().min(1).max(60).optional(),
  featured: z.boolean().optional(),
  breaking: z.boolean().optional(),
});

const resourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  url: z.string().url("Must be a valid URL"),
  imageUrl: z.string().optional(),
  type: z.string().min(1, "Type is required"),
  category: z.string().min(1, "Category is required"),
  provider: z.string().optional(),
  price: z.string().optional(),
  difficulty: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type TwoFactorFormValues = z.infer<typeof twoFactorSchema>;
type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
type ArticleFormValues = z.infer<typeof articleSchema>;
type ResourceFormValues = z.infer<typeof resourceSchema>;

interface UserInfo {
  id: number;
  username: string;
  role: string;
  mustChangePassword: boolean;
}

function ChangePasswordDialog({ 
  open, 
  onOpenChange, 
  token, 
  onSuccess,
  required = false
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  token: string;
  onSuccess: () => void;
  required?: boolean;
}) {
  const { toast } = useToast();
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordFormValues) => {
      const csrfResponse = await fetch("/api/csrf-token", { credentials: "include" });
      const { csrfToken } = await csrfResponse.json();
      
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "x-csrf-token": csrfToken
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to change password");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Password Changed", description: "Your password has been updated successfully." });
      form.reset();
      onSuccess();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Change Password",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (required && !newOpen) {
      return;
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent onPointerDownOutside={required ? (e) => e.preventDefault() : undefined} onEscapeKeyDown={required ? (e) => e.preventDefault() : undefined}>
        <DialogHeader>
          <DialogTitle>Change Your Password</DialogTitle>
          <CardDescription>
            For security, please change your password now.
          </CardDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => changePasswordMutation.mutate(data))} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" data-testid="input-current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" data-testid="input-new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" data-testid="input-confirm-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Password must:</p>
              <ul className="list-disc list-inside">
                <li>Be at least 8 characters</li>
                <li>Include uppercase and lowercase letters</li>
                <li>Include a number</li>
                <li>Include a special character (@$!%*?&)</li>
              </ul>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={changePasswordMutation.isPending} data-testid="button-change-password">
                {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface PasskeyCredential {
  id: number;
  deviceName: string;
  createdAt: string;
  lastUsed: string | null;
  credentialBackedUp: boolean;
}

function PasskeyManagementDialog({
  open,
  onOpenChange,
  token,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string;
}) {
  const { toast } = useToast();
  const [newDeviceName, setNewDeviceName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const passkeysQuery = useQuery<PasskeyCredential[]>({
    queryKey: ['/api/auth/passkey/credentials'],
    enabled: open,
  });

  const supportsPasskeys = browserSupportsWebAuthn();

  const registerPasskey = async () => {
    if (!supportsPasskeys) {
      toast({
        title: "Passkeys Not Supported",
        description: "Your browser does not support passkeys. Please use a modern browser like Chrome, Safari, or Edge.",
        variant: "destructive",
      });
      return;
    }

    setIsRegistering(true);
    try {
      const optionsRes = await fetch("/api/auth/passkey/register/options", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!optionsRes.ok) {
        throw new Error("Failed to get registration options");
      }

      const options = await optionsRes.json();
      const attestation = await startRegistration({ optionsJSON: options });

      const verifyRes = await fetch("/api/auth/passkey/register/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          response: attestation,
          deviceName: newDeviceName || "Security Key",
        }),
      });

      if (!verifyRes.ok) {
        const error = await verifyRes.json();
        throw new Error(error.message || "Verification failed");
      }

      toast({
        title: "Passkey Added",
        description: "Your new passkey has been registered successfully.",
      });

      setNewDeviceName("");
      queryClient.invalidateQueries({ queryKey: ['/api/auth/passkey/credentials'] });
    } catch (error: any) {
      console.error("Passkey registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "Could not register passkey. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const deletePasskey = async (id: number) => {
    try {
      const res = await fetch(`/api/auth/passkey/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Delete failed");
      }

      toast({
        title: "Passkey Removed",
        description: "The passkey has been removed from your account.",
      });

      queryClient.invalidateQueries({ queryKey: ['/api/auth/passkey/credentials'] });
    } catch (error: any) {
      toast({
        title: "Deletion Failed",
        description: error.message || "Could not remove passkey.",
        variant: "destructive",
      });
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Fingerprint className="w-5 h-5" />
              Manage Passkeys
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Passkeys are a secure, passwordless way to sign in. They use your device's fingerprint, face recognition, or security key instead of a password.
              </p>
            </div>

            {!supportsPasskeys && (
              <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <p className="text-sm text-amber-800 dark:text-amber-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Your browser does not support passkeys. Please use Chrome, Safari, or Edge.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="font-medium">Your Passkeys</h4>
              {passkeysQuery.isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              ) : passkeysQuery.data?.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No passkeys registered yet. Add one below.
                </p>
              ) : (
                <div className="space-y-2">
                  {passkeysQuery.data?.map((passkey) => (
                    <div
                      key={passkey.id}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Key className="w-5 h-5 text-teal-600" />
                        <div>
                          <p className="font-medium">{passkey.deviceName}</p>
                          <p className="text-xs text-muted-foreground">
                            Added {new Date(passkey.createdAt).toLocaleDateString()}
                            {passkey.lastUsed && ` • Last used ${new Date(passkey.lastUsed).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(passkey.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {supportsPasskeys && (
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-medium">Add New Passkey</h4>
                <div className="flex gap-2">
                  <Input
                    placeholder="Device name (e.g., MacBook, iPhone)"
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    disabled={isRegistering}
                  />
                  <Button onClick={registerPasskey} disabled={isRegistering}>
                    {isRegistering ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Passkey?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the passkey from your account. You will no longer be able to use this device for passwordless sign in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && deletePasskey(deleteConfirm)}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordFormValues) => {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to process request");
      }
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>
              If an account exists with that email address, we've sent password reset instructions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={onBack} data-testid="button-back-to-login">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>Enter your email to receive reset instructions</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => forgotPasswordMutation.mutate(data))} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@example.com" data-testid="input-reset-email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={forgotPasswordMutation.isPending} data-testid="button-send-reset">
                {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Instructions"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={onBack}>
                Back to Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

function LoginForm({ onLogin }: { onLogin: (token: string, user: UserInfo) => void }) {
  const { toast } = useToast();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [twoFactorState, setTwoFactorState] = useState<{ pendingToken: string } | null>(null);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const twoFactorForm = useForm<TwoFactorFormValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: { code: "" },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data.requiresTwoFactor && data.pendingToken) {
        setTwoFactorState({ pendingToken: data.pendingToken });
        toast({ title: "Verification Required", description: "Please enter your authenticator code." });
        return;
      }
      if (data.user?.role !== "admin") {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        return;
      }
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      onLogin(data.token, data.user);
      toast({ title: "Welcome!", description: "Successfully logged in as admin." });
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const twoFactorMutation = useMutation({
    mutationFn: async (data: TwoFactorFormValues) => {
      const response = await fetch("/api/auth/2fa/login-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pendingToken: twoFactorState?.pendingToken, code: data.code }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Verification failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data.user?.role !== "admin") {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        return;
      }
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      onLogin(data.token, data.user);
      toast({ title: "Welcome!", description: "Successfully logged in as admin." });
    },
    onError: (error: Error) => {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
  }

  if (twoFactorState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
            <CardDescription>Enter the 6-digit code from your authenticator app</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...twoFactorForm}>
              <form onSubmit={twoFactorForm.handleSubmit((data) => twoFactorMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={twoFactorForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Authentication Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="000000" 
                          maxLength={6}
                          className="text-center text-2xl tracking-widest"
                          data-testid="input-2fa-code" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={twoFactorMutation.isPending} data-testid="button-2fa-verify">
                  {twoFactorMutation.isPending ? "Verifying..." : "Verify"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setTwoFactorState(null)}
                  data-testid="button-back-to-login"
                >
                  Back to Login
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Sign in to access content management</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => loginMutation.mutate(data))} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="admin" data-testid="input-admin-username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" data-testid="input-admin-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loginMutation.isPending} data-testid="button-admin-login">
                <LogIn className="w-4 h-4 mr-2" />
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
              <Button 
                type="button" 
                variant="link" 
                className="w-full text-sm" 
                onClick={() => setShowForgotPassword(true)}
                data-testid="link-forgot-password"
              >
                Forgot your password?
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend }: { title: string; value: string | number; icon: any; trend?: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && <p className="text-xs text-green-600">{trend}</p>}
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ArticlesTab({ token }: { token: string }) {
  const { toast } = useToast();
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      category: "News",
      author: "",
      authorTitle: "",
      imageUrl: "",
      url: "",
      source: "",
      readTime: 5,
      featured: false,
      breaking: false,
    },
  });

  useEffect(() => {
    if (editingArticle) {
      form.reset({
        title: editingArticle.title,
        excerpt: editingArticle.excerpt,
        content: editingArticle.content,
        category: editingArticle.category,
        author: editingArticle.author,
        authorTitle: editingArticle.authorTitle || "",
        imageUrl: editingArticle.imageUrl || "",
        url: editingArticle.url || "",
        source: editingArticle.source || "",
        readTime: editingArticle.readTime || 5,
        featured: editingArticle.featured || false,
        breaking: editingArticle.breaking || false,
      });
    } else {
      form.reset({
        title: "",
        excerpt: "",
        content: "",
        category: "News",
        author: "",
        authorTitle: "",
        imageUrl: "",
        url: "",
        source: "",
        readTime: 5,
        featured: false,
        breaking: false,
      });
    }
  }, [editingArticle, form]);

  const createMutation = useMutation({
    mutationFn: async (data: ArticleFormValues) => {
      return apiRequest("/api/articles", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      setIsDialogOpen(false);
      setEditingArticle(null);
      toast({ title: "Success", description: "Article created successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create article.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/articles/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({ title: "Deleted", description: "Article removed successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete article.", variant: "destructive" });
    },
  });

  if (isLoading) {
    return <div className="p-4">Loading articles...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Articles ({articles.length})</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingArticle(null)} data-testid="button-add-article">
              <Plus className="w-4 h-4 mr-2" /> Add Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingArticle ? "Edit Article" : "Add New Article"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-article-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-article-category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="News">News</SelectItem>
                            <SelectItem value="Tutorial">Tutorial</SelectItem>
                            <SelectItem value="Analysis">Analysis</SelectItem>
                            <SelectItem value="Guide">Guide</SelectItem>
                            <SelectItem value="Alert">Alert</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-article-author" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea rows={2} {...field} data-testid="input-article-excerpt" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea rows={6} {...field} data-testid="input-article-content" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-article-image" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-article-source" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-6">
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="!mt-0">Featured</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="breaking"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="!mt-0">Breaking News</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={createMutation.isPending} data-testid="button-save-article">
                    {createMutation.isPending ? "Saving..." : "Save Article"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium max-w-xs truncate">{article.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{article.category}</Badge>
                </TableCell>
                <TableCell>{article.author}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {article.featured && <Badge className="bg-amber-500">Featured</Badge>}
                    {article.breaking && <Badge className="bg-red-500">Breaking</Badge>}
                    {!article.featured && !article.breaking && <Badge variant="outline">Normal</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(article.id)}
                    data-testid={`button-delete-article-${article.id}`}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function ResourcesTab({ token }: { token: string }) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: resources = [], isLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: "",
      description: "",
      url: "",
      imageUrl: "",
      type: "free",
      category: "",
      provider: "",
      price: "",
      difficulty: "beginner",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ResourceFormValues) => {
      return apiRequest("/api/resources", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
      setIsDialogOpen(false);
      form.reset();
      toast({ title: "Success", description: "Resource created successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create resource.", variant: "destructive" });
    },
  });

  if (isLoading) {
    return <div className="p-4">Loading resources...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Resources ({resources.length})</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-resource">
              <Plus className="w-4 h-4 mr-2" /> Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Resource</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-resource-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} data-testid="input-resource-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-resource-url" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-resource-type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="certification">Certification</SelectItem>
                            <SelectItem value="tools">Tools</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-resource-category" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-resource-difficulty">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={createMutation.isPending} data-testid="button-save-resource">
                    {createMutation.isPending ? "Saving..." : "Save Resource"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Difficulty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell className="font-medium">{resource.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{resource.type}</Badge>
                </TableCell>
                <TableCell>{resource.category}</TableCell>
                <TableCell>
                  <Badge variant="outline">{resource.difficulty || "N/A"}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function SubscribersTab({ token }: { token: string }) {
  const { toast } = useToast();
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const { data: subscribers = [], isLoading: subscribersLoading, isError: subscribersError, error: subscribersErrorDetails } = useQuery<Newsletter[]>({
    queryKey: ["/api/newsletter/subscriptions"],
    enabled: !!token,
    queryFn: async () => {
      console.log("[Admin] Fetching subscribers with token");
      const res = await fetch("/api/newsletter/subscriptions", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("[Admin] Failed to fetch subscribers:", res.status, errorText);
        throw new Error(`Failed to fetch subscribers: ${res.status}`);
      }
      const data = await res.json();
      console.log("[Admin] Fetched", data.length, "subscribers");
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/newsletter/subscriptions/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Subscriber Removed", description: "The subscriber has been deleted." });
      queryClient.invalidateQueries({ queryKey: ["/api/newsletter/subscriptions"] });
      setDeleteConfirmId(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete subscriber.", variant: "destructive" });
    },
  });

  const weeklyDigestCount = subscribers.filter(s => s.weeklyDigest).length;
  const digitalTipsCount = subscribers.filter(s => s.digitalSafetyTips).length;

  if (subscribersLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-teal-600 mr-2" />
        <span>Loading subscribers...</span>
      </div>
    );
  }

  if (subscribersError) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-600 mb-2">Failed to Load Subscribers</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {subscribersErrorDetails?.message || "Unable to fetch subscriber data. Please check your connection and try again."}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{subscribers.length}</p>
              <p className="text-sm text-muted-foreground">Total Subscribers</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{weeklyDigestCount}</p>
              <p className="text-sm text-muted-foreground">Weekly Digest</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{digitalTipsCount}</p>
              <p className="text-sm text-muted-foreground">Digital Safety Tips</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">All Subscribers</h2>
          <p className="text-sm text-muted-foreground">Unified subscription management</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Subscriptions</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Audience</TableHead>
              <TableHead>Tips Frequency</TableHead>
              <TableHead>Subscribed</TableHead>
              <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {sub.weeklyDigest && (
                        <Badge variant="outline" className="bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
                          Weekly Digest
                        </Badge>
                      )}
                      {sub.digitalSafetyTips && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          Safety Tips
                        </Badge>
                      )}
                      {!sub.weeklyDigest && !sub.digitalSafetyTips && (
                        <Badge variant="outline" className="text-muted-foreground">None</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{sub.region || "global"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{sub.audience || "all"}</Badge>
                  </TableCell>
                  <TableCell>
                    {sub.digitalSafetyTips ? (
                      <span className="text-sm text-muted-foreground">{sub.tipsFrequency || "weekly"}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString() : "N/A"}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setDeleteConfirmId(sub.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {subscribers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No subscribers yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscriber?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this subscriber from your list. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteConfirmId && deleteMutation.mutate(deleteConfirmId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function DigestsTab({ token }: { token: string }) {
  const { toast } = useToast();
  const [previewDigest, setPreviewDigest] = useState<WeeklyDigest | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const { data: digests = [], isLoading } = useQuery<WeeklyDigest[]>({
    queryKey: ["/api/weekly-digest"],
    queryFn: async () => {
      return await apiRequest("/api/weekly-digest", {
        headers: { "Authorization": `Bearer ${token}` }
      });
    }
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/weekly-digest/generate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
    },
    onSuccess: () => {
      toast({ title: "Digest Generated", description: "A new digest has been created for review." });
      queryClient.invalidateQueries({ queryKey: ["/api/weekly-digest"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to generate digest.", variant: "destructive" });
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/weekly-digest/${id}/approve`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
    },
    onSuccess: () => {
      toast({ title: "Digest Approved", description: "Ready to send to subscribers." });
      queryClient.invalidateQueries({ queryKey: ["/api/weekly-digest"] });
      setPreviewDigest(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to approve digest.", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/weekly-digest/${id}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}`
        }
      });
    },
    onSuccess: () => {
      toast({ title: "Digest Deleted", description: "The digest has been removed." });
      queryClient.invalidateQueries({ queryKey: ["/api/weekly-digest"] });
      setDeleteConfirmId(null);
      setPreviewDigest(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete digest.", variant: "destructive" });
    }
  });

  const sendMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/weekly-digest/${id}/send`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
    },
    onSuccess: (data: any) => {
      toast({ 
        title: "Digest Sent", 
        description: `Successfully sent to ${data.stats?.sent || 0} subscribers.` 
      });
      queryClient.invalidateQueries({ queryKey: ["/api/weekly-digest"] });
      setPreviewDigest(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send digest.", variant: "destructive" });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Draft</Badge>;
      case 'pending_review':
        return <Badge className="bg-yellow-500"><Eye className="w-3 h-3 mr-1" /> Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
      case 'sent':
        return <Badge className="bg-blue-500"><Send className="w-3 h-3 mr-1" /> Sent</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const parseDigestContent = (newsItemsJson: string | null) => {
    const empty = { 
      globalStories: [], 
      regionalSpotlights: {}, 
      safetyTips: [], 
      travelerAlert: null, 
      weeklyLesson: null 
    };
    if (!newsItemsJson) return empty;
    try {
      const parsed = JSON.parse(newsItemsJson);
      // Handle new geo-aware format
      if (parsed.globalStories) {
        return {
          globalStories: parsed.globalStories || [],
          regionalSpotlights: parsed.regionalSpotlights || {},
          safetyTips: parsed.safetyTips || [],
          travelerAlert: parsed.travelerAlert || null,
          weeklyLesson: parsed.weeklyLesson || null
        };
      }
      // Handle previous format
      if (parsed.stories) {
        return {
          globalStories: parsed.stories || [],
          regionalSpotlights: {},
          safetyTips: parsed.safetyTips || [],
          travelerAlert: null,
          weeklyLesson: parsed.weeklyLesson || null
        };
      }
      // Handle legacy format (array of news items)
      return { ...empty, globalStories: Array.isArray(parsed) ? parsed : [] };
    } catch {
      return empty;
    }
  };

  const regionLabels: Record<string, string> = {
    north_america: "North America",
    europe: "Europe & UK",
    asia_pacific: "Asia-Pacific",
    africa: "Africa",
    latin_america: "Latin America",
    middle_east: "Middle East"
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Weekly Fraud Alerts</h2>
          <p className="text-sm text-muted-foreground">
            Generate, review, and send weekly digests to subscribers
          </p>
        </div>
        <Button 
          onClick={() => generateMutation.mutate()}
          disabled={generateMutation.isPending}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Generate New Digest
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {digests.map((digest) => (
              <TableRow key={digest.id}>
                <TableCell className="font-medium">{digest.title}</TableCell>
                <TableCell>{getStatusBadge(digest.status || 'draft')}</TableCell>
                <TableCell>
                  {digest.createdAt ? new Date(digest.createdAt).toLocaleDateString() : "N/A"}
                </TableCell>
                <TableCell>{digest.recipientCount || "-"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setPreviewDigest(digest)}
                    >
                      <Eye className="w-3 h-3 mr-1" /> Preview
                    </Button>
                    {digest.status === 'pending_review' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-green-50 hover:bg-green-100 border-green-300"
                        onClick={() => approveMutation.mutate(digest.id)}
                        disabled={approveMutation.isPending}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" /> Approve
                      </Button>
                    )}
                    {digest.status === 'approved' && (
                      <Button 
                        size="sm"
                        onClick={() => sendMutation.mutate(digest.id)}
                        disabled={sendMutation.isPending}
                      >
                        <Send className="w-3 h-3 mr-1" /> Send
                      </Button>
                    )}
                    {digest.status !== 'sent' && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => setDeleteConfirmId(digest.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {digests.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No digests created yet. Click "Generate New Digest" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 dark:text-blue-100">
              How Weekly Digests Work
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              1. <strong>Generate</strong> - Creates a digest from the latest news articles<br/>
              2. <strong>Preview</strong> - Review the content before it goes out<br/>
              3. <strong>Approve or Deny</strong> - Accept good content, delete bad ones<br/>
              4. <strong>Send</strong> - Delivers to all subscribers who opted in
            </p>
          </div>
        </div>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!previewDigest} onOpenChange={(open) => !open && setPreviewDigest(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 flex-wrap">
              {previewDigest?.title}
              {previewDigest && getStatusBadge(previewDigest.status || 'draft')}
            </DialogTitle>
          </DialogHeader>
          
          {previewDigest && (() => {
            const content = parseDigestContent(previewDigest.newsItems);
            return (
              <div className="space-y-5">
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
                  <p className="text-sm">{previewDigest.summary}</p>
                </div>

                {/* Global Threats */}
                {content.globalStories.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Newspaper className="w-4 h-4" /> Global Threats ({content.globalStories.length})
                    </h4>
                    <div className="space-y-3">
                      {content.globalStories.map((item: any, index: number) => (
                        <div 
                          key={index} 
                          className={`p-4 border rounded-lg ${item.priority === 'critical' ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}
                        >
                          {item.priority === 'critical' && (
                            <Badge className="bg-red-500 mb-2">HIGH PRIORITY</Badge>
                          )}
                          <h5 className="font-medium">{item.title}</h5>
                          <p className="text-sm text-muted-foreground mt-2">{item.excerpt}</p>
                          {item.actionItem && (
                            <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded border-l-2 border-green-500">
                              <p className="text-xs font-medium text-green-700 dark:text-green-300">Action: {item.actionItem}</p>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">Source: {item.source}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Regional Spotlights */}
                {Object.keys(content.regionalSpotlights).length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-500" /> Regional Spotlights
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {Object.entries(content.regionalSpotlights).map(([region, data]: [string, any]) => (
                        <div key={region} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">{regionLabels[region] || region}</Badge>
                          </div>
                          <h5 className="font-medium text-sm">{data.headline}</h5>
                          <p className="text-xs text-muted-foreground mt-1">{data.details}</p>
                          {data.reportTo && (
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Report: {data.reportTo}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Traveler Alert */}
                {content.travelerAlert && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-teal-500" /> {content.travelerAlert.title || "Traveler Safety"}
                    </h4>
                    <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                      {content.travelerAlert.tips && content.travelerAlert.tips.length > 0 && (
                        <ul className="text-sm space-y-1 mb-3">
                          {content.travelerAlert.tips.map((tip: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-teal-600">•</span> {tip}
                            </li>
                          ))}
                        </ul>
                      )}
                      {content.travelerAlert.scamToWatch && (
                        <div className="mt-2 p-2 bg-teal-100 dark:bg-teal-800/30 rounded">
                          <p className="text-xs font-medium text-teal-700 dark:text-teal-300">
                            Scam to Watch: {content.travelerAlert.scamToWatch}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Safety Tips */}
                {content.safetyTips.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> Safety Tips
                    </h4>
                    <div className="grid gap-2">
                      {content.safetyTips.map((tip: any, index: number) => (
                        <div key={index} className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                          <div className="flex items-start gap-2">
                            <span className="text-amber-600 font-bold">{index + 1}.</span>
                            <div>
                              <span className="font-medium">{tip.title}</span>
                              <p className="text-sm text-muted-foreground">{tip.tip}</p>
                              {tip.audience && tip.audience !== 'everyone' && (
                                <Badge variant="outline" className="mt-1 text-xs">{tip.audience}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weekly Lesson */}
                {content.weeklyLesson && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-purple-500" /> Learn: {content.weeklyLesson.title}
                    </h4>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <p className="text-sm">{content.weeklyLesson.content}</p>
                    </div>
                  </div>
                )}

                <DialogFooter className="flex gap-2 sm:gap-2 pt-4 border-t">
                  {previewDigest.status !== 'sent' && (
                    <Button 
                      variant="destructive" 
                      onClick={() => setDeleteConfirmId(previewDigest.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Deny & Delete
                    </Button>
                  )}
                  {previewDigest.status === 'pending_review' && (
                    <Button 
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => approveMutation.mutate(previewDigest.id)}
                      disabled={approveMutation.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve
                    </Button>
                  )}
                  {previewDigest.status === 'approved' && (
                    <Button 
                      onClick={() => sendMutation.mutate(previewDigest.id)}
                      disabled={sendMutation.isPending}
                    >
                      <Send className="w-4 h-4 mr-1" /> Send Now
                    </Button>
                  )}
                </DialogFooter>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Digest?</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete this digest? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => deleteConfirmId && deleteMutation.mutate(deleteConfirmId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ScamCheckerStats {
  total: number;
  byType: Record<string, number>;
  byRisk: Record<string, number>;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

function ScamCheckerStatsTab({ token }: { token: string }) {
  const { data: stats, isLoading } = useQuery<ScamCheckerStats>({
    queryKey: ["/api/admin/scam-checker-stats"],
    enabled: !!token,
  });

  const typeLabels: Record<string, string> = {
    url: "Link Check",
    qr: "QR Code Scan",
    image: "Image Analysis",
    phone: "Phone Lookup",
    email: "Email Headers",
    situation: "Describe Situation",
  };

  const riskColors: Record<string, string> = {
    safe: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    suspicious: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    dangerous: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    unknown: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">GCR Scam Guard Usage</h2>
        <p className="text-sm text-muted-foreground">Track how visitors use the scam checking tools</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.today || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.thisWeek || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.thisMonth || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              By Analysis Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.byType && Object.keys(stats.byType).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(stats.byType)
                  .sort(([,a], [,b]) => b - a)
                  .map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm">{typeLabels[type] || type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-teal-500" 
                            style={{ width: `${(count / stats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No data yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              By Risk Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.byRisk && Object.keys(stats.byRisk).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(stats.byRisk)
                  .sort(([,a], [,b]) => b - a)
                  .map(([risk, count]) => (
                    <div key={risk} className="flex items-center justify-between">
                      <Badge className={riskColors[risk] || riskColors.unknown}>
                        {risk.charAt(0).toUpperCase() + risk.slice(1)}
                      </Badge>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No data yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface BreachCheckerStats {
  total: number;
  byType: Record<string, number>;
  totalBreachesFound: number;
  passwordExposures: number;
  monitoringSignups: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

function BreachCheckerStatsTab({ token }: { token: string }) {
  const { data: stats, isLoading } = useQuery<BreachCheckerStats>({
    queryKey: ["/api/admin/breach-checker-stats"],
    enabled: !!token,
  });

  const typeLabels: Record<string, string> = {
    email: "Email Checks",
    password: "Password Checks",
    monitoring_signup: "Monitoring Signups",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Breach Checker Usage</h2>
        <p className="text-sm text-muted-foreground">Track how visitors use the breach checking tools</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.today || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.thisWeek || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.thisMonth || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Key Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span>Total Breaches Found</span>
                </div>
                <span className="text-2xl font-bold text-red-500">{stats?.totalBreachesFound || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-orange-500" />
                  <span>Password Exposures</span>
                </div>
                <span className="text-2xl font-bold text-orange-500">{stats?.passwordExposures || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-green-500" />
                  <span>Monitoring Signups</span>
                </div>
                <span className="text-2xl font-bold text-green-500">{stats?.monitoringSignups || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              By Check Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.byType && Object.keys(stats.byType).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(stats.byType)
                  .sort(([,a], [,b]) => b - a)
                  .map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm">{typeLabels[type] || type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500" 
                            style={{ width: `${(count / stats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No data yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FeedbackTab() {
  const { data: feedback = [] } = useQuery<any[]>({
    queryKey: ["/api/feedback"],
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">User Feedback ({feedback.length})</h2>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedback.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Badge variant="secondary">{item.type}</Badge>
                </TableCell>
                <TableCell>{item.rating}/5</TableCell>
                <TableCell className="max-w-md truncate">{item.message}</TableCell>
                <TableCell>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}</TableCell>
              </TableRow>
            ))}
            {feedback.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No feedback received yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

interface PartnershipInquiry {
  id: number;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string | null;
  interest: string;
  budget?: string | null;
  website?: string | null;
  message: string;
  status: string;
  notes?: string | null;
  createdAt: string | Date | null;
}

function InquiriesTab({ token }: { token: string }) {
  const { toast } = useToast();
  const [selectedInquiry, setSelectedInquiry] = useState<PartnershipInquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [notes, setNotes] = useState("");

  const { data: inquiries = [], isLoading, refetch } = useQuery<PartnershipInquiry[]>({
    queryKey: ["/api/partnership/inquiries", statusFilter],
    queryFn: async () => {
      const params = statusFilter !== "all" ? `?status=${statusFilter}` : "";
      const response = await fetch(`/api/partnership/inquiries${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch inquiries");
      return response.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes?: string }) => {
      const response = await fetch(`/api/partnership/inquiries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, notes }),
      });
      if (!response.ok) throw new Error("Failed to update inquiry");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Inquiry updated successfully" });
      refetch();
      setSelectedInquiry(null);
      setNotes("");
    },
    onError: () => {
      toast({ title: "Failed to update inquiry", variant: "destructive" });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500">New</Badge>;
      case "contacted":
        return <Badge className="bg-yellow-500">Contacted</Badge>;
      case "in_progress":
        return <Badge className="bg-purple-500">In Progress</Badge>;
      case "closed":
        return <Badge className="bg-gray-500">Closed</Badge>;
      case "converted":
        return <Badge className="bg-green-500">Converted</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Contact Inquiries ({inquiries.length})</h2>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Inquiries</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Interest</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : inquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No inquiries found
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>
                    {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell className="font-medium">{inquiry.companyName}</TableCell>
                  <TableCell>
                    <div>{inquiry.contactName}</div>
                    <div className="text-sm text-muted-foreground">{inquiry.email}</div>
                  </TableCell>
                  <TableCell>{inquiry.interest}</TableCell>
                  <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedInquiry(inquiry);
                            setNotes(inquiry.notes || "");
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Inquiry from {inquiry.companyName}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Contact</p>
                              <p>{inquiry.contactName}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Email</p>
                              <a href={`mailto:${inquiry.email}`} className="text-blue-600 hover:underline">
                                {inquiry.email}
                              </a>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Phone</p>
                              <p>{inquiry.phone || "Not provided"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Website</p>
                              {inquiry.website ? (
                                <a href={inquiry.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                  {inquiry.website}
                                </a>
                              ) : (
                                <p>Not provided</p>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Interest</p>
                              <p>{inquiry.interest}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Budget</p>
                              <p>{inquiry.budget || "Not specified"}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Message</p>
                            <p className="bg-muted p-3 rounded-md whitespace-pre-wrap">{inquiry.message}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
                            <Textarea
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Add internal notes..."
                              rows={3}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-muted-foreground">Update Status:</p>
                            <Select
                              value={inquiry.status}
                              onValueChange={(newStatus) => {
                                updateStatusMutation.mutate({ id: inquiry.id, status: newStatus, notes });
                              }}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                                <SelectItem value="converted">Converted</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                          </DialogClose>
                          <Button
                            onClick={() => updateStatusMutation.mutate({ id: inquiry.id, status: inquiry.status, notes })}
                            disabled={updateStatusMutation.isPending}
                          >
                            {updateStatusMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : null}
                            Save Notes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function SecurityAlertsTab({ token }: { token: string }) {
  const { toast } = useToast();
  const [publishingId, setPublishingId] = useState<number | null>(null);
  const [acknowledgingId, setAcknowledgingId] = useState<number | null>(null);
  
  const { data: alerts = [], isLoading: alertsLoading, refetch } = useQuery<SecurityAlert[]>({
    queryKey: ["/api/admin/security-alerts"],
    queryFn: async () => {
      const response = await fetch("/api/admin/security-alerts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch alerts");
      return response.json();
    },
    enabled: !!token,
  });

  const { data: unreadCount, isLoading: countLoading } = useQuery<{ count: number }>({
    queryKey: ["/api/admin/security-alerts/count"],
    queryFn: async () => {
      const response = await fetch("/api/admin/security-alerts/count", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch count");
      return response.json();
    },
    enabled: !!token,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/security-alerts/${id}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to mark as read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/security-alerts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/security-alerts/count"] });
    },
  });

  const acknowledgeMutation = useMutation({
    mutationFn: async (id: number) => {
      setAcknowledgingId(id);
      const csrfResponse = await fetch("/api/csrf-token", { credentials: "include" });
      const { csrfToken } = await csrfResponse.json();
      
      const response = await fetch(`/api/admin/security-alerts/${id}/acknowledge`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "x-csrf-token": csrfToken
        },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to acknowledge alert");
    },
    onSuccess: () => {
      setAcknowledgingId(null);
      toast({ title: "Alert Acknowledged", description: "The security alert has been acknowledged." });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/security-alerts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/security-alerts/count"] });
    },
    onError: () => {
      setAcknowledgingId(null);
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (id: number) => {
      setPublishingId(id);
      const csrfResponse = await fetch("/api/csrf-token", { credentials: "include" });
      const { csrfToken } = await csrfResponse.json();
      
      const response = await fetch(`/api/admin/security-alerts/${id}/publish`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "x-csrf-token": csrfToken
        },
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Failed to publish alert");
      }
      return response.json();
    },
    onSuccess: () => {
      setPublishingId(null);
      toast({ title: "Article Published", description: "The security alert has been converted to a news article for visitors." });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/security-alerts"] });
    },
    onError: (error: Error) => {
      setPublishingId(null);
      toast({ title: "Publish Failed", description: error.message || "Could not convert alert to article.", variant: "destructive" });
    },
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      case 'high': return <Badge className="bg-orange-500">High</Badge>;
      case 'medium': return <Badge className="bg-yellow-500">Medium</Badge>;
      case 'low': return <Badge variant="secondary">Low</Badge>;
      default: return <Badge variant="outline">Info</Badge>;
    }
  };

  if (alertsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3">Loading security alerts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5" /> Security Alerts
          {!countLoading && unreadCount && unreadCount.count > 0 && (
            <Badge variant="destructive">{unreadCount.count} unread</Badge>
          )}
        </h2>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Severity</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id} className={!alert.isRead ? "bg-muted/50" : ""}>
                <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                <TableCell className="max-w-xs">
                  <div className="font-medium">{alert.title}</div>
                  <div className="text-sm text-muted-foreground truncate">{alert.description}</div>
                </TableCell>
                <TableCell><Badge variant="outline">{alert.category}</Badge></TableCell>
                <TableCell>{alert.source || "Internal"}</TableCell>
                <TableCell>{alert.createdAt ? new Date(alert.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                <TableCell>
                  {alert.isAcknowledged ? (
                    <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Acknowledged</Badge>
                  ) : alert.isRead ? (
                    <Badge variant="secondary">Read</Badge>
                  ) : (
                    <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Unread</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 flex-wrap">
                    {!alert.isRead && (
                      <Button size="sm" variant="outline" onClick={() => markAsReadMutation.mutate(alert.id)}>
                        <Eye className="w-3 h-3 mr-1" /> Mark Read
                      </Button>
                    )}
                    {!alert.isAcknowledged && (
                      <Button 
                        size="sm" 
                        variant="default" 
                        onClick={() => acknowledgeMutation.mutate(alert.id)}
                        disabled={acknowledgingId === alert.id}
                      >
                        <Check className="w-3 h-3 mr-1" /> 
                        {acknowledgingId === alert.id ? "Acknowledging..." : "Acknowledge"}
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      onClick={() => publishMutation.mutate(alert.id)}
                      disabled={publishingId === alert.id}
                    >
                      <FileText className="w-3 h-3 mr-1" /> 
                      {publishingId === alert.id ? "Publishing..." : "Publish Article"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {alerts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No security alerts. Your platform is secure.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

interface DailyTip {
  id: number;
  title: string;
  tipContent: string;
  audience: string;
  region: string | null;
  category: string | null;
  actionItems: string | null;
  funFact: string | null;
  sourceReference: string | null;
  regionalNote: string | null;
  status: string | null;
  approvedBy: string | null;
  approvedAt: Date | null;
  sentAt: Date | null;
  recipientCount: number | null;
  createdAt: Date | null;
}

function DailyTipsTab({ token }: { token: string }) {
  const { toast } = useToast();
  const [selectedAudience, setSelectedAudience] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("global");
  const [previewTip, setPreviewTip] = useState<DailyTip | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const { data: tips = [], isLoading } = useQuery<DailyTip[]>({
    queryKey: ["/api/daily-tip"],
    queryFn: async () => {
      return await apiRequest("/api/daily-tip", {
        headers: { "Authorization": `Bearer ${token}` }
      });
    }
  });

  const generateMutation = useMutation({
    mutationFn: async ({ audience, region }: { audience: string; region: string }) => {
      return await apiRequest("/api/daily-tip/generate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ audience, region })
      });
    },
    onSuccess: () => {
      toast({ title: "Tip Generated", description: "A new digital safety tip has been created for review." });
      queryClient.invalidateQueries({ queryKey: ["/api/daily-tip"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to generate tip.", variant: "destructive" });
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/daily-tip/${id}/approve`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
    },
    onSuccess: (data: any) => {
      toast({ title: "Tip Approved & Sent", description: `Successfully sent to ${data.sent || 0} subscribers.` });
      queryClient.invalidateQueries({ queryKey: ["/api/daily-tip"] });
      setPreviewTip(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to approve tip.", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/daily-tip/${id}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}`
        }
      });
    },
    onSuccess: () => {
      toast({ title: "Tip Deleted", description: "The tip has been removed." });
      queryClient.invalidateQueries({ queryKey: ["/api/daily-tip"] });
      setDeleteConfirmId(null);
      setPreviewTip(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete tip.", variant: "destructive" });
    }
  });

  const sendMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/daily-tip/${id}/send`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
    },
    onSuccess: (data: any) => {
      toast({ 
        title: "Tip Sent", 
        description: `Successfully sent to ${data.sent || 0} subscribers.` 
      });
      queryClient.invalidateQueries({ queryKey: ["/api/daily-tip"] });
      setPreviewTip(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send tip.", variant: "destructive" });
    }
  });

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Draft</Badge>;
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
      case 'sent':
        return <Badge className="bg-blue-500"><Send className="w-3 h-3 mr-1" /> Sent</Badge>;
      default:
        return <Badge variant="outline">{status || 'unknown'}</Badge>;
    }
  };

  const getAudienceLabel = (audience: string) => {
    const labels: Record<string, string> = {
      all: "All Audiences",
      youth: "Youth",
      senior: "Seniors",
      parent: "Parents",
      traveler: "Travelers"
    };
    return labels[audience] || audience;
  };

  const getRegionLabel = (region: string | null) => {
    const labels: Record<string, string> = {
      global: "Global",
      north_america: "North America",
      europe: "Europe & UK",
      asia_pacific: "Asia-Pacific",
      africa: "Africa",
      latin_america: "Latin America",
      middle_east: "Middle East"
    };
    return labels[region || 'global'] || region || 'Global';
  };

  const parseActionItems = (actionItemsJson: string | null): string[] => {
    if (!actionItemsJson) return [];
    try {
      return JSON.parse(actionItemsJson);
    } catch {
      return [];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold">Daily Safety Tips</h2>
          <p className="text-sm text-muted-foreground">
            Generate AI-powered daily tips and send to subscribers
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={selectedAudience} onValueChange={setSelectedAudience}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Audiences</SelectItem>
              <SelectItem value="youth">Youth</SelectItem>
              <SelectItem value="senior">Seniors</SelectItem>
              <SelectItem value="parent">Parents</SelectItem>
              <SelectItem value="traveler">Travelers</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global</SelectItem>
              <SelectItem value="north_america">North America</SelectItem>
              <SelectItem value="europe">Europe & UK</SelectItem>
              <SelectItem value="asia_pacific">Asia-Pacific</SelectItem>
              <SelectItem value="africa">Africa</SelectItem>
              <SelectItem value="latin_america">Latin America</SelectItem>
              <SelectItem value="middle_east">Middle East</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={() => generateMutation.mutate({ audience: selectedAudience, region: selectedRegion })}
            disabled={generateMutation.isPending}
            className="gap-2"
          >
            {generateMutation.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
            ) : (
              <><Plus className="w-4 h-4" /> Generate Tip</>
            )}
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Audience</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tips.map((tip) => (
              <TableRow key={tip.id}>
                <TableCell className="font-medium max-w-[200px] truncate">{tip.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{getAudienceLabel(tip.audience)}</Badge>
                </TableCell>
                <TableCell>{getStatusBadge(tip.status)}</TableCell>
                <TableCell>
                  {tip.createdAt ? new Date(tip.createdAt).toLocaleDateString() : "N/A"}
                </TableCell>
                <TableCell>{tip.recipientCount || "-"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setPreviewTip(tip)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {tip.status === 'draft' && (
                      <Button 
                        size="sm"
                        onClick={() => approveMutation.mutate(tip.id)}
                        disabled={approveMutation.isPending}
                      >
                        <Send className="w-4 h-4 mr-1" /> Approve & Send
                      </Button>
                    )}
                    {tip.status !== 'sent' && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setDeleteConfirmId(tip.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {tips.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No digital safety tips yet. Generate your first tip!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Preview Dialog */}
      {previewTip && (
        <Dialog open={!!previewTip} onOpenChange={() => setPreviewTip(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                {previewTip.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {getStatusBadge(previewTip.status)}
                <Badge variant="outline">{getAudienceLabel(previewTip.audience)}</Badge>
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20">{getRegionLabel(previewTip.region)}</Badge>
                {previewTip.category && (
                  <Badge variant="secondary">{previewTip.category}</Badge>
                )}
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-base leading-relaxed">{previewTip.tipContent}</p>
              </div>

              {previewTip.sourceReference && (
                <p className="text-sm text-muted-foreground italic">
                  Source: {previewTip.sourceReference}
                </p>
              )}

              {previewTip.regionalNote && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Regional Note:</strong> {previewTip.regionalNote}
                  </p>
                </div>
              )}
              
              {parseActionItems(previewTip.actionItems).length > 0 && (
                <div className="border-l-4 border-primary p-4 bg-primary/5 rounded-r-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> What You Can Do Today
                  </h4>
                  <ul className="space-y-2">
                    {parseActionItems(previewTip.actionItems).map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {previewTip.funFact && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>💡 Did you know?</strong> {previewTip.funFact}
                  </p>
                </div>
              )}
              
              <div className="flex gap-2 justify-end pt-4 border-t">
                {previewTip.status === 'draft' && (
                  <Button 
                    onClick={() => approveMutation.mutate(previewTip.id)}
                    disabled={approveMutation.isPending}
                    className="gap-2"
                  >
                    <Send className="w-4 h-4" /> Approve & Send
                  </Button>
                )}
                <Button variant="outline" onClick={() => setPreviewTip(null)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmId !== null} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Daily Tip?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The tip will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteConfirmId && deleteMutation.mutate(deleteConfirmId)}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* How It Works Info */}
      <Card className="bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-teal-800 dark:text-teal-300 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            How Daily Tips Work
          </h3>
          <p className="text-sm text-teal-700 dark:text-teal-300 mt-1">
            1. <strong>Generate</strong> - AI creates engaging safety tips based on current threats<br/>
            2. <strong>Review</strong> - Preview the content and make sure it's appropriate<br/>
            3. <strong>Approve & Send</strong> - Sends the tip to all subscribers immediately
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function SocialPostGeneratorTab({ token }: { token: string }) {
  const { toast } = useToast();
  const [selectedContent, setSelectedContent] = useState<string>("news");
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [platform, setPlatform] = useState<string>("linkedin");
  const [generatedPost, setGeneratedPost] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: articles = [] } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
    enabled: !!token,
  });

  const { data: dailyTips = [] } = useQuery<any[]>({
    queryKey: ["/api/daily-tips/templates"],
    enabled: !!token,
  });

  const { data: latestNews = [] } = useQuery<any>({
    queryKey: ["/api/news/latest"],
    enabled: !!token && selectedContent === "news",
    select: (data) => data?.articles || [],
  });

  const cleanText = (text: string): string => {
    if (!text) return "";
    let cleaned = text
      .replace(/\s*[-–-]\s*/g, ", ")
      .replace(/\s+/g, " ")
      .replace(/,\s*,/g, ",")
      .replace(/\s*,\s*/g, ", ")
      .trim();
    if (cleaned && !/[.!?]$/.test(cleaned)) {
      cleaned += ".";
    }
    cleaned = cleaned.replace(/\.\s*\./g, ".");
    return cleaned;
  };

  const generatePost = () => {
    if (!selectedItem) {
      toast({ title: "Select content", description: "Please select an item to generate a post from.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    
    let content: { title: string; excerpt?: string; category?: string } | undefined;
    
    if (selectedContent === "article") {
      const article = articles.find(a => a.id.toString() === selectedItem);
      if (article) {
        content = { 
          title: cleanText(article.title), 
          excerpt: cleanText(article.excerpt || ""), 
          category: article.category 
        };
      }
    } else if (selectedContent === "tip") {
      const tip = dailyTips.find((t: any) => t.id?.toString() === selectedItem);
      if (tip) {
        content = { 
          title: cleanText(tip.title || tip.subject), 
          excerpt: cleanText(tip.content || tip.body), 
          category: tip.audience 
        };
      }
    } else if (selectedContent === "news") {
      const newsItem = latestNews.find((n: any) => n.id?.toString() === selectedItem);
      if (newsItem) {
        content = { 
          title: cleanText(newsItem.title), 
          excerpt: cleanText(newsItem.excerpt || newsItem.description || ""), 
          category: newsItem.category 
        };
      }
    }

    if (!content) {
      setIsGenerating(false);
      toast({ title: "Error", description: "Could not find selected content.", variant: "destructive" });
      return;
    }

    const baseUrl = "https://www.getcyberright.com";
    
    let post = "";
    
    let link = baseUrl;
    if (selectedContent === "article") {
      link = `${baseUrl}/article/${selectedItem}`;
    } else if (selectedContent === "news") {
      const newsItem = latestNews.find((n: any) => n.id?.toString() === selectedItem);
      link = newsItem?.url || `${baseUrl}/news`;
    }
    
    if (platform === "linkedin") {
      const maxLength = 3000;
      const hashtags = "#CyberSecurity #OnlineSafety #FamilySafety #DigitalSafety #GetCyberRight";
      const linkText = selectedContent === "article" ? `Read more: ${link}` : `Learn more at ${link}`;
      const excerptMaxLen = Math.min(200, maxLength - content.title.length - linkText.length - hashtags.length - 10);
      const excerptText = content.excerpt 
        ? content.excerpt.substring(0, Math.max(0, excerptMaxLen)) + (content.excerpt.length > excerptMaxLen ? "..." : "")
        : "";
      post = `${content.title}\n\n${excerptText}\n\n${linkText}\n\n${hashtags}`;
      if (post.length > maxLength) {
        post = post.substring(0, maxLength - 3) + "...";
      }
    } else if (platform === "twitter") {
      const maxLength = 280;
      const hashtags = " #CyberSecurity #OnlineSafety";
      const newlineCount = 2;
      const fixedLen = link.length + hashtags.length + newlineCount;
      const availableChars = Math.max(20, maxLength - fixedLen);
      const title = content.title.length > availableChars 
        ? content.title.substring(0, availableChars - 3) + "..." 
        : content.title;
      post = `${title}\n\n${link}${hashtags}`;
      if (post.length > maxLength) {
        post = post.substring(0, maxLength);
      }
    } else if (platform === "facebook") {
      const maxLength = 63206;
      post = `${content.title}\n\n${content.excerpt || ""}\n\n${link}`;
      if (post.length > maxLength) {
        post = post.substring(0, maxLength - 3) + "...";
      }
    } else if (platform === "instagram") {
      const maxLength = 2200;
      const hashtags = "#CyberSecurity #OnlineSafety #FamilySafety #DigitalSafety #ScamAlert #StaySafeOnline #CyberAwareness #GetCyberRight";
      const cta = "Link in bio for more information.";
      const excerptMaxLen = Math.min(300, maxLength - content.title.length - hashtags.length - cta.length - 15);
      const excerptText = content.excerpt 
        ? content.excerpt.substring(0, Math.max(0, excerptMaxLen)) + (content.excerpt.length > excerptMaxLen ? "..." : "")
        : "";
      post = `${content.title}\n\n${excerptText}\n\n${cta}\n\n${hashtags}`;
      if (post.length > maxLength) {
        post = post.substring(0, maxLength - 3) + "...";
      }
    } else if (platform === "whatsapp") {
      const maxLength = 65536;
      post = `*${content.title}*\n\n${content.excerpt || ""}\n\nRead more: ${link}`;
      if (post.length > maxLength) {
        post = post.substring(0, maxLength - 3) + "...";
      }
    }

    setGeneratedPost(post);
    setIsGenerating(false);
    toast({ title: "Post Generated", description: "Your social media post is ready to copy." });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPost);
      setCopied(true);
      toast({ title: "Copied!", description: "Post copied to clipboard." });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: "Failed to copy", description: "Please copy manually.", variant: "destructive" });
    }
  };

  const openInBuffer = () => {
    if (!generatedPost) return;
    let link = "https://www.getcyberright.com";
    if (selectedContent === "article") {
      link = `https://www.getcyberright.com/article/${selectedItem}`;
    } else if (selectedContent === "news") {
      const newsItem = latestNews.find((n: any) => n.id?.toString() === selectedItem);
      link = newsItem?.url || "https://www.getcyberright.com/news";
    }
    const bufferUrl = `https://buffer.com/add?text=${encodeURIComponent(generatedPost)}&url=${encodeURIComponent(link)}`;
    window.open(bufferUrl, "_blank", "width=800,height=600");
  };

  const platformCharLimits: Record<string, number> = {
    linkedin: 3000,
    twitter: 280,
    facebook: 63206,
    instagram: 2200,
    whatsapp: 65536
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Social Post Generator</h2>
        <p className="text-sm text-muted-foreground">
          Generate social media posts from your content for LinkedIn, X, Facebook, Instagram, and WhatsApp
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Content</CardTitle>
            <CardDescription>Choose content to turn into a social post</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Content Type</label>
              <Select value={selectedContent} onValueChange={(v) => { setSelectedContent(v); setSelectedItem(""); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="news">Breaking News (External Sources)</SelectItem>
                  <SelectItem value="article">Your Articles</SelectItem>
                  <SelectItem value="tip">Daily Tip</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Item</label>
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content" />
                </SelectTrigger>
                <SelectContent>
                  {selectedContent === "news" && latestNews.slice(0, 30).map((news: any) => (
                    <SelectItem key={news.id} value={news.id.toString()}>
                      {news.title.substring(0, 50)}{news.title.length > 50 ? "..." : ""}
                    </SelectItem>
                  ))}
                  {selectedContent === "article" && articles.slice(0, 20).map((article) => (
                    <SelectItem key={article.id} value={article.id.toString()}>
                      {article.title.substring(0, 50)}{article.title.length > 50 ? "..." : ""}
                    </SelectItem>
                  ))}
                  {selectedContent === "tip" && dailyTips
                    .filter((tip: any) => tip.id != null)
                    .map((tip: any) => (
                    <SelectItem key={tip.id} value={tip.id.toString()}>
                      {(tip.title || tip.subject || "Untitled Tip").substring(0, 50)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Platform</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">X (Twitter)</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={generatePost} disabled={isGenerating || !selectedItem} className="w-full gap-2">
              <Sparkles className="w-4 h-4" />
              {isGenerating ? "Generating..." : "Generate Post"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Generated Post
              {generatedPost && (
                <Badge variant="outline">
                  {generatedPost.length} / {platformCharLimits[platform]} chars
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Copy and paste this into your social media scheduler</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={generatedPost}
              onChange={(e) => setGeneratedPost(e.target.value)}
              placeholder="Your generated post will appear here..."
              className="min-h-[200px] font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button 
                onClick={copyToClipboard} 
                disabled={!generatedPost}
                variant="outline"
                className="flex-1 gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button 
                onClick={openInBuffer} 
                disabled={!generatedPost}
                className="flex-1 gap-2 bg-[#231F20] hover:bg-[#3a3637] text-white"
              >
                <ExternalLink className="w-4 h-4" />
                Open in Buffer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <div className="flex gap-3">
          <Share2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-900 dark:text-amber-100">
              Scheduling Tips
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              Use tools like Buffer, Hootsuite, or Later to schedule your posts in advance. 
              Post 2-3 times per week on LinkedIn for best engagement. Best times: Tuesday-Thursday, 8-10am or 5-6pm.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPasskeyManagement, setShowPasskeyManagement] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    const savedUser = localStorage.getItem("adminUser");
    if (savedToken) {
      setToken(savedToken);
    }
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        if (parsedUser.mustChangePassword) {
          setShowChangePassword(true);
        }
      } catch (e) {
        console.error("Failed to parse user info");
      }
    }
  }, []);

  const handleLogin = (newToken: string, newUser: UserInfo) => {
    setToken(newToken);
    setUser(newUser);
    if (newUser.mustChangePassword) {
      setShowChangePassword(true);
    }
  };

  const handlePasswordChanged = () => {
    if (user) {
      const updatedUser = { ...user, mustChangePassword: false };
      setUser(updatedUser);
      localStorage.setItem("adminUser", JSON.stringify(updatedUser));
    }
    setShowChangePassword(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setToken(null);
    setUser(null);
  };

  const { data: articles = [] } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
    enabled: !!token,
  });

  const { data: resources = [] } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
    enabled: !!token,
  });

  const { data: newsletters = [] } = useQuery<Newsletter[]>({
    queryKey: ["/api/newsletter/subscriptions"],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch("/api/newsletter/subscriptions", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const totalSubscribers = newsletters.length;

  if (!token) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Content Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Account
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setShowChangePassword(true)}>
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowPasskeyManagement(true)}>
                  <Fingerprint className="w-4 h-4 mr-2" />
                  Manage Passkeys
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogIn className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Articles" value={articles.length} icon={FileText} />
          <StatCard title="Resources" value={resources.length} icon={BookOpen} />
          <StatCard title="Subscribers" value={totalSubscribers} icon={Mail} />
          <StatCard title="Active Users" value="--" icon={Users} />
        </div>

        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-5 lg:grid-cols-10 lg:w-auto lg:inline-grid">
            <TabsTrigger value="articles" className="gap-2" data-testid="tab-articles">
              <FileText className="w-4 h-4" /> Articles
            </TabsTrigger>
            <TabsTrigger value="resources" className="gap-2" data-testid="tab-resources">
              <BookOpen className="w-4 h-4" /> Resources
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="gap-2" data-testid="tab-subscribers">
              <Bell className="w-4 h-4" /> Subscribers
            </TabsTrigger>
            <TabsTrigger value="digests" className="gap-2" data-testid="tab-digests">
              <Newspaper className="w-4 h-4" /> Digests
            </TabsTrigger>
            <TabsTrigger value="daily-tips" className="gap-2" data-testid="tab-daily-tips">
              <Lightbulb className="w-4 h-4" /> Daily Tips
            </TabsTrigger>
            <TabsTrigger value="scam-checker" className="gap-2" data-testid="tab-scam-checker">
              <Search className="w-4 h-4" /> Scam Guard
            </TabsTrigger>
            <TabsTrigger value="breach-checker" className="gap-2" data-testid="tab-breach-checker">
              <Lock className="w-4 h-4" /> Breach Checker
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2" data-testid="tab-social">
              <Share2 className="w-4 h-4" /> Social
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2" data-testid="tab-security">
              <Shield className="w-4 h-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="feedback" className="gap-2" data-testid="tab-feedback">
              <MessageSquare className="w-4 h-4" /> Feedback
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="gap-2" data-testid="tab-inquiries">
              <Mail className="w-4 h-4" /> Inquiries
            </TabsTrigger>
          </TabsList>

          <TabsContent value="articles">
            <ArticlesTab token={token} />
          </TabsContent>
          <TabsContent value="resources">
            <ResourcesTab token={token} />
          </TabsContent>
          <TabsContent value="subscribers">
            <SubscribersTab token={token} />
          </TabsContent>
          <TabsContent value="digests">
            <DigestsTab token={token} />
          </TabsContent>
          <TabsContent value="daily-tips">
            <DailyTipsTab token={token} />
          </TabsContent>
          <TabsContent value="social">
            <SocialPostGeneratorTab token={token} />
          </TabsContent>
          <TabsContent value="security">
            <SecurityAlertsTab token={token} />
          </TabsContent>
          <TabsContent value="feedback">
            <FeedbackTab />
          </TabsContent>
          <TabsContent value="inquiries">
            <InquiriesTab token={token} />
          </TabsContent>

          <TabsContent value="scam-checker">
            <ScamCheckerStatsTab token={token} />
          </TabsContent>
          <TabsContent value="breach-checker">
            <BreachCheckerStatsTab token={token} />
          </TabsContent>
        </Tabs>
      </div>

      <ChangePasswordDialog
        open={showChangePassword}
        onOpenChange={setShowChangePassword}
        token={token}
        onSuccess={handlePasswordChanged}
        required={user?.mustChangePassword ?? false}
      />

      <PasskeyManagementDialog
        open={showPasskeyManagement}
        onOpenChange={setShowPasskeyManagement}
        token={token}
      />
    </div>
  );
}
