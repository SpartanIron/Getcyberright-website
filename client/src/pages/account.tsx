"use client";

import { useState, useEffect } from "react";
import { FadeIn } from "@/components/fade-in";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
 User,
 Lock,
 Shield,
 Fingerprint,
 Crown,
 ArrowRight,
 CheckCircle2,
 AlertTriangle,
 Eye,
 EyeOff,
 CreditCard,
 Mail,
 KeyRound,
 ShieldCheck,
 Bell,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "@/lib/navigation";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

const tierLabels: Record<string, string> = {
 free: "Free",
 essential: "Essential",
 professional: "Professional",
 enterprise: "Enterprise",
};

const tierBadgeStyles: Record<string, string> = {
 free: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
 essential: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
 professional: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
 enterprise: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
};

export default function Account() {
 const { user, isLoading, isAuthenticated } = useAuth();
 const [, setLocation] = useLocation();
 const { toast } = useToast();

 const [firstName, setFirstName] = useState("");
 const [lastName, setLastName] = useState("");

 const [notifyReviewQueueEmail, setNotifyReviewQueueEmail] = useState(true);

 const [currentPassword, setCurrentPassword] = useState("");
 const [newPassword, setNewPassword] = useState("");
 const [confirmPassword, setConfirmPassword] = useState("");
 const [showPasswords, setShowPasswords] = useState(false);

 useEffect(() => {
 if (user) {
 setFirstName(user.firstName || "");
 setLastName(user.lastName || "");
 setNotifyReviewQueueEmail(user.notifyReviewQueueEmail !== false);
 }
 }, [user]);

 const notifyPrefMutation = useMutation({
 mutationFn: async (data: { notifyReviewQueueEmail: boolean }) => {
 const res = await apiRequest("PATCH", "/api/auth/notification-prefs", data);
 return res.json();
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
 toast({ title: "Notification preferences updated" });
 },
 onError: (err: Error) => {
 toast({ title: "Update failed", description: err.message, variant: "destructive" });
 },
 });

 const handleNotifyToggle = (value: boolean) => {
 setNotifyReviewQueueEmail(value);
 notifyPrefMutation.mutate({ notifyReviewQueueEmail: value });
 };

 const profileMutation = useMutation({
 mutationFn: async (data: { firstName: string; lastName: string }) => {
 const res = await apiRequest("PATCH", "/api/auth/profile", data);
 return res.json();
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
 toast({ title: "Profile updated", description: "Your name has been updated." });
 },
 onError: (err: Error) => {
 toast({ title: "Update failed", description: err.message, variant: "destructive" });
 },
 });

 const passwordMutation = useMutation({
 mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
 const res = await apiRequest("POST", "/api/auth/change-password", data);
 return res.json();
 },
 onSuccess: () => {
 setCurrentPassword("");
 setNewPassword("");
 setConfirmPassword("");
 toast({ title: "Password changed", description: "Your password has been updated successfully." });
 },
 onError: (err: Error) => {
 toast({ title: "Password change failed", description: err.message, variant: "destructive" });
 },
 });

 if (isLoading) {
 return (
 <div className="min-h-screen bg-background flex items-center justify-center">
 <div className="animate-pulse text-muted-foreground">Loading...</div>
 </div>
 );
 }

 if (!isAuthenticated || !user) {
 setLocation("/login");
 return null;
 }

 const sgTier = (user as any).subscriptionTier || "free";
 const dsTier = (user as any).shieldSubscriptionTier || "free";
 const sgExpires = (user as any).subscriptionExpiresAt;
 const dsExpires = (user as any).shieldSubscriptionExpiresAt;

 const handleProfileSave = () => {
 if (!firstName.trim()) {
 toast({ title: "First name required", variant: "destructive" });
 return;
 }
 profileMutation.mutate({ firstName: firstName.trim(), lastName: lastName.trim() });
 };

 const handlePasswordChange = () => {
 if (!currentPassword || !newPassword || !confirmPassword) {
 toast({ title: "All fields required", variant: "destructive" });
 return;
 }
 if (newPassword !== confirmPassword) {
 toast({ title: "Passwords don't match", variant: "destructive" });
 return;
 }
 if (newPassword.length < 12) {
 toast({ title: "Password must be at least 12 characters", variant: "destructive" });
 return;
 }
 passwordMutation.mutate({ currentPassword, newPassword });
 };

 return (
 <div className="min-h-screen bg-background">
 <Navigation />

 <main id="main-content" tabIndex={-1} className="py-8 px-4 sm:px-6 lg:px-8">
 <div className="max-w-3xl mx-auto space-y-6">
 <FadeIn
 >
 <div className="flex items-center gap-3 mb-6">
 <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
 <User className="w-5 h-5 text-primary" />
 </div>
 <div>
 <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
 <p className="text-sm text-muted-foreground">Manage your profile, security, and subscriptions</p>
 </div>
 </div>
 </FadeIn>

 <FadeIn>
 <Card data-testid="card-profile">
 <CardHeader>
 <CardTitle className="text-lg flex items-center gap-2">
 <User className="w-5 h-5" />
 Profile
 </CardTitle>
 <CardDescription>Your personal information</CardDescription>
 </CardHeader>
 <CardContent className="space-y-4">
 <div className="grid sm:grid-cols-2 gap-4">
 <div>
 <Label htmlFor="firstName">First Name</Label>
 <Input
 id="firstName"
 value={firstName}
 onChange={(e) => setFirstName(e.target.value)}
 data-testid="input-first-name"
 />
 </div>
 <div>
 <Label htmlFor="lastName">Last Name</Label>
 <Input
 id="lastName"
 value={lastName}
 onChange={(e) => setLastName(e.target.value)}
 data-testid="input-last-name"
 />
 </div>
 </div>
 <div>
 <Label>Email</Label>
 <div className="flex items-center gap-2 mt-1">
 <Mail className="w-4 h-4 text-muted-foreground" />
 <span className="text-sm text-muted-foreground" data-testid="text-email">{user.email}</span>
 {user.emailVerified && (
 <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-700 dark:text-green-400">
 <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
 </Badge>
 )}
 </div>
 </div>
 <Button
 onClick={handleProfileSave}
 disabled={profileMutation.isPending}
 data-testid="button-save-profile"
 >
 {profileMutation.isPending ? "Saving..." : "Save Changes"}
 </Button>
 </CardContent>
 </Card>
 </FadeIn>

 <FadeIn>
 <Card data-testid="card-security">
 <CardHeader>
 <CardTitle className="text-lg flex items-center gap-2">
 <Lock className="w-5 h-5" />
 Security
 </CardTitle>
 <CardDescription>Password and two-factor authentication</CardDescription>
 </CardHeader>
 <CardContent className="space-y-6">
 <div className="space-y-3">
 <h3 className="text-sm font-semibold text-foreground">Change Password</h3>
 <div className="space-y-3">
 <div className="relative">
 <Label htmlFor="currentPassword">Current Password</Label>
 <Input
 id="currentPassword"
 type={showPasswords ? "text" : "password"}
 value={currentPassword}
 onChange={(e) => setCurrentPassword(e.target.value)}
 data-testid="input-current-password"
 />
 </div>
 <div>
 <Label htmlFor="newPassword">New Password</Label>
 <Input
 id="newPassword"
 type={showPasswords ? "text" : "password"}
 value={newPassword}
 onChange={(e) => setNewPassword(e.target.value)}
 placeholder="At least 12 characters"
 data-testid="input-new-password"
 />
 </div>
 <div>
 <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
 <Input
 id="confirmNewPassword"
 type={showPasswords ? "text" : "password"}
 value={confirmPassword}
 onChange={(e) => setConfirmPassword(e.target.value)}
 data-testid="input-confirm-password"
 />
 </div>
 <div className="flex items-center gap-4">
 <Button
 onClick={handlePasswordChange}
 disabled={passwordMutation.isPending}
 variant="outline"
 data-testid="button-change-password"
 >
 {passwordMutation.isPending ? "Changing..." : "Change Password"}
 </Button>
 <button
 type="button"
 onClick={() => setShowPasswords(!showPasswords)}
 className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
 >
 {showPasswords ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
 {showPasswords ? "Hide" : "Show"}
 </button>
 </div>
 </div>
 </div>

 <Separator />

 <div className="flex items-center justify-between">
 <div>
 <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
 <KeyRound className="w-4 h-4" />
 Two-Factor Authentication (MFA)
 </h3>
 <p className="text-xs text-muted-foreground mt-1">
 Add an extra layer of security with a time-based one-time password.
 </p>
 </div>
 {user.mfaEnabled ? (
 <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
 <ShieldCheck className="w-3 h-3 mr-1" /> Enabled
 </Badge>
 ) : (
 <Badge variant="outline" className="text-yellow-600 dark:text-yellow-400 border-yellow-500/30">
 <AlertTriangle className="w-3 h-3 mr-1" /> Not Enabled
 </Badge>
 )}
 </div>
 </CardContent>
 </Card>
 </FadeIn>

 {user.isAdmin && (
 <FadeIn>
 <Card data-testid="card-admin-notifications">
 <CardHeader>
 <CardTitle className="text-lg flex items-center gap-2">
 <Bell className="w-5 h-5" />
 Admin Notifications
 </CardTitle>
 <CardDescription>Choose which admin alerts land in your inbox</CardDescription>
 </CardHeader>
 <CardContent>
 <div className="flex items-start justify-between gap-4 p-4 rounded-lg border">
 <div className="flex-1">
 <h3 className="text-sm font-semibold text-foreground">Reactive post review queue</h3>
 <p className="text-xs text-muted-foreground mt-1">
 Get the digest email when reactive social posts enter the 60-minute review window.
 </p>
 <p className="text-xs text-muted-foreground mt-1">
 Site-wide Slack and webhook destinations can be configured under{" "}
 <Link href="/admin/notifications" className="underline">
 Admin → Notifications
 </Link>.
 </p>
 </div>
 <Switch
 checked={notifyReviewQueueEmail}
 onCheckedChange={handleNotifyToggle}
 disabled={notifyPrefMutation.isPending}
 data-testid="switch-notify-review-queue"
 />
 </div>
 </CardContent>
 </Card>
 </FadeIn>
 )}

 <FadeIn>
 <Card data-testid="card-subscriptions">
 <CardHeader>
 <CardTitle className="text-lg flex items-center gap-2">
 <CreditCard className="w-5 h-5" />
 Subscriptions
 </CardTitle>
 <CardDescription>Your active plans and billing</CardDescription>
 </CardHeader>
 <CardContent className="space-y-4">
 <div className="flex items-center justify-between p-4 rounded-lg border">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
 <Shield className="w-5 h-5 text-orange-500" />
 </div>
 <div>
 <h3 className="text-sm font-semibold text-foreground">GCR Scam Guard</h3>
 <p className="text-xs text-muted-foreground">
 {sgExpires ? `Renews ${new Date(sgExpires).toLocaleDateString()}` : "Browser protection"}
 </p>
 </div>
 </div>
 <div className="flex items-center gap-2">
 <Badge className={tierBadgeStyles[sgTier]}>
 <Crown className="w-3 h-3 mr-1" /> {tierLabels[sgTier]}
 </Badge>
 </div>
 </div>

 <div className="flex items-center justify-between p-4 rounded-lg border">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
 <Fingerprint className="w-5 h-5 text-teal-500" />
 </div>
 <div>
 <h3 className="text-sm font-semibold text-foreground">GCR Data Shield</h3>
 <p className="text-xs text-muted-foreground">
 {dsExpires ? `Renews ${new Date(dsExpires).toLocaleDateString()}` : "Data removal service"}
 </p>
 </div>
 </div>
 <div className="flex items-center gap-2">
 <Badge className={tierBadgeStyles[dsTier]}>
 <Crown className="w-3 h-3 mr-1" /> {tierLabels[dsTier]}
 </Badge>
 </div>
 </div>

 </CardContent>
 </Card>
 </FadeIn>

 <FadeIn>
 <div className="text-center">
 <Link href="/dashboard">
 <Button variant="ghost" size="sm" data-testid="link-back-dashboard">
 Back to Dashboard
 </Button>
 </Link>
 </div>
 </FadeIn>
 </div>
 </main>

 <Footer />
 </div>
 );
}
