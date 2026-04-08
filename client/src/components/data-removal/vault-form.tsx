import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { trackToolUsage } from "@/lib/analytics";
import { isVaultUnlocked } from "@/lib/vaultCrypto";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/lib/navigation";
import { motion } from "framer-motion";
import {
  Shield,
  Trash2,
  Lock,
  Loader2,
  User,
  MapPin,
  Calendar,
  Briefcase,
  Users,
  Plus,
  Mail,
  Phone,
  Crown,
  Fingerprint,
  ShieldAlert,
  Target,
  ArrowRight,
  Search,
  CheckCircle2,
  Bell,
  FileText,
  Eye,
} from "lucide-react";
import type { VaultProfile } from "@/components/data-removal/types";

export function VaultForm() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: vaultData, isLoading } = useQuery<VaultProfile | null>({
    queryKey: ["/api/data-removal/vault"],
    enabled: isAuthenticated,
  });

  const [fullName, setFullName] = useState("");
  const [previousNames, setPreviousNames] = useState("");
  const [emails, setEmails] = useState("");
  const [phones, setPhones] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [previousAddresses, setPreviousAddresses] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [relativeNames, setRelativeNames] = useState("");
  const [employerNames, setEmployerNames] = useState("");
  const [initialized, setInitialized] = useState(false);
  if (vaultData && !initialized) {
    setFullName(vaultData.fullName || "");
    setPreviousNames(vaultData.previousNames?.join(", ") || "");
    setEmails(vaultData.emails?.join(", ") || "");
    setPhones(vaultData.phoneNumbers?.join(", ") || "");
    setCurrentAddress(vaultData.currentAddress || "");
    setPreviousAddresses(vaultData.previousAddresses?.join(", ") || "");
    setDateOfBirth(vaultData.dateOfBirth || "");
    setRelativeNames(vaultData.relativeNames?.join(", ") || "");
    setEmployerNames(vaultData.employerNames?.join(", ") || "");
    setInitialized(true);
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        fullName,
        previousNames: previousNames ? previousNames.split(",").map((s) => s.trim()).filter(Boolean) : [],
        emails: emails ? emails.split(",").map((s) => s.trim()).filter(Boolean) : [],
        phoneNumbers: phones ? phones.split(",").map((s) => s.trim()).filter(Boolean) : [],
        currentAddress: currentAddress || null,
        previousAddresses: previousAddresses ? previousAddresses.split(",").map((s) => s.trim()).filter(Boolean) : [],
        dateOfBirth: dateOfBirth || null,
        relativeNames: relativeNames ? relativeNames.split(",").map((s) => s.trim()).filter(Boolean) : [],
        employerNames: employerNames ? employerNames.split(",").map((s) => s.trim()).filter(Boolean) : [],
      };
      const res = await apiRequest("POST", "/api/data-removal/vault", payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/vault"] });
      toast({ title: "Vault Saved", description: "Your personal information has been securely saved." });
      trackToolUsage("data-broker-vault-save", true);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      trackToolUsage("data-broker-vault-save", false, { error: error.message });
    },
  });

  if (!isAuthenticated) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Sign In Required</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Please sign in to access your Personal Vault and manage your protected information.
            </p>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Personal Information Vault
          </CardTitle>
          <CardDescription>
            Enter your personal information below. We use your email to check for confirmed breaches and verify which data broker sites are active.
          </CardDescription>
          <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 mt-2" data-testid="vault-encryption-status">
            <Shield className="h-3.5 w-3.5" />
            {isVaultUnlocked() ? "AES-256 encrypted with vault key protection" : "AES-256 encrypted at rest"}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Full Name
              </label>
              <Input
                data-testid="input-vault-fullname"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Previous Names
              </label>
              <Input
                placeholder="Maiden name, former name (comma-separated)"
                value={previousNames}
                onChange={(e) => setPreviousNames(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email Addresses
              </label>
              <Input
                data-testid="input-vault-email"
                placeholder="email1@example.com, email2@example.com"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Phone Numbers
              </label>
              <Input
                data-testid="input-vault-phone"
                placeholder="+1 555-0100, +1 555-0200"
                value={phones}
                onChange={(e) => setPhones(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Current Address
              </label>
              <Input
                data-testid="input-vault-address"
                placeholder="123 Main St, City, State"
                value={currentAddress}
                onChange={(e) => setCurrentAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Previous Addresses
              </label>
              <Input
                placeholder="Old addresses (comma-separated)"
                value={previousAddresses}
                onChange={(e) => setPreviousAddresses(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Date of Birth
              </label>
              <Input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Relative Names
              </label>
              <Input
                placeholder="Jane Doe, Bob Doe (comma-separated)"
                value={relativeNames}
                onChange={(e) => setRelativeNames(e.target.value)}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                Employer Names
              </label>
              <Input
                placeholder="Current and past employers (comma-separated)"
                value={employerNames}
                onChange={(e) => setEmployerNames(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
            <Shield className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Your information is encrypted and only used to scan data brokers. We never share or sell your data.
            </p>
          </div>

          <Button
            data-testid="button-save-vault"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || !fullName.trim()}
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Lock className="h-4 w-4 mr-2" />
            )}
            Save to Vault
          </Button>
        </CardContent>
      </Card>

      {vaultData && (
        <Card className="border-primary/30 bg-primary/5" data-testid="card-next-steps">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              Your Vault Is Set Up! Here's What to Do Next
            </CardTitle>
            <CardDescription>
              Your personal information is saved and encrypted. Now use it to find and remove your exposed data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  icon: Search,
                  title: "Run a Data Scan",
                  description: "Search 500+ data broker sites for your personal information",
                  href: "/shield",
                  buttonText: "Start Scan",
                  testId: "button-nextstep-scan",
                  primary: true,
                },
                {
                  icon: FileText,
                  title: "View Removal Center",
                  description: "Track removal requests and see your exposure report",
                  href: "/data-removal",
                  buttonText: "Open Center",
                  testId: "button-nextstep-removal",
                  primary: false,
                },
                {
                  icon: Eye,
                  title: "Check Breach Exposure",
                  description: "See if your email appears in known data breaches",
                  href: "/shield",
                  buttonText: "Check Breaches",
                  testId: "button-nextstep-breaches",
                  primary: false,
                },
              ].map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  <div className="flex flex-col h-full p-4 rounded-lg border bg-background">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`h-8 w-8 rounded-md flex items-center justify-center ${step.primary ? "bg-primary/10" : "bg-muted"}`}>
                        <step.icon className={`h-4 w-4 ${step.primary ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <h4 className="font-semibold text-sm">{step.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 flex-1">{step.description}</p>
                    <Button
                      asChild
                      size="sm"
                      variant={step.primary ? "default" : "outline"}
                      className="w-full"
                      data-testid={step.testId}
                    >
                      <Link href={step.href}>
                        {step.buttonText}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {vaultData && <PrivacyModeSection vaultProfileId={vaultData.id} currentMode={vaultData.privacyMode ?? "standard"} />}

      <FamilyProfilesSection />
    </motion.div>
  );
}

function PrivacyModeSection({ vaultProfileId, currentMode }: { vaultProfileId: string; currentMode: string }) {
  const { toast } = useToast();
  const [selectedMode, setSelectedMode] = useState(currentMode);

  const modeMutation = useMutation({
    mutationFn: async (mode: string) => {
      const res = await apiRequest("POST", "/api/data-removal/privacy-mode", { vaultProfileId, mode });
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/vault"] });
      toast({ title: "Privacy Mode Updated", description: `Switched to ${data.mode} mode with ${data.frameworks?.join(", ")} compliance.` });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const privacyModes = [
    { value: "standard", label: "Standard", description: "Basic privacy protection with CCPA compliance", icon: Shield },
    { value: "executive", label: "Executive", description: "Enhanced protection for high-profile individuals", icon: Crown },
    { value: "military", label: "Military/Defense", description: "OPSEC-compliant removal with maximum urgency", icon: ShieldAlert },
    { value: "government", label: "Government", description: "Federal employee protection with Privacy Act compliance", icon: Fingerprint },
    { value: "high-risk", label: "High Risk", description: "Multi-framework protection for at-risk individuals", icon: Target },
  ];

  return (
    <Card data-testid="card-privacy-mode">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Privacy Mode
        </CardTitle>
        <CardDescription>Select the protection level that matches your needs. Higher modes use stronger legal language and priority processing.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {privacyModes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.value;
            return (
              <button
                key={mode.value}
                data-testid={`button-privacy-mode-${mode.value}`}
                onClick={() => {
                  setSelectedMode(mode.value);
                  modeMutation.mutate(mode.value);
                }}
                disabled={modeMutation.isPending}
                className={`p-3 rounded-md text-left transition-colors border ${
                  isSelected
                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                    : "border-border hover-elevate"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`h-4 w-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${isSelected ? "text-primary" : ""}`}>{mode.label}</span>
                  {isSelected && <Badge variant="default">Active</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{mode.description}</p>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function FamilyProfilesSection() {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newEmails, setNewEmails] = useState("");

  const { data: profiles, isLoading } = useQuery<VaultProfile[]>({
    queryKey: ["/api/data-removal/vault/profiles"],
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        profileName: newProfileName,
        fullName: newFullName || undefined,
        emails: newEmails ? newEmails.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
      };
      const res = await apiRequest("POST", "/api/data-removal/vault/family", payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/vault/profiles"] });
      toast({ title: "Family Member Added", description: `${newProfileName} has been added to your protection plan.` });
      setShowAddForm(false);
      setNewProfileName("");
      setNewFullName("");
      setNewEmails("");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (profileId: string) => {
      const res = await apiRequest("DELETE", `/api/data-removal/vault/family/${profileId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/vault/profiles"] });
      toast({ title: "Profile Removed", description: "Family member profile has been removed." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  if (isLoading) return null;

  return (
    <Card data-testid="card-family-profiles">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Family Protection Plan
        </CardTitle>
        <CardDescription>
          Protect your entire family. Add up to 6 profiles to monitor and remove their data from broker sites.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(!profiles || profiles.length === 0) && !showAddForm && (
          <div className="flex flex-col items-center py-6 gap-3 text-center" data-testid="family-empty-state">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">No family members added yet</p>
              <p className="text-xs text-muted-foreground max-w-sm mt-1">
                Add your family members so we can scan for their exposed data too. Each profile gets its own monitoring and removal tracking.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-1">
              {["Spouse/Partner", "Children", "Parents", "Grandparents"].map((example) => (
                <Badge key={example} variant="outline" className="text-xs">{example}</Badge>
              ))}
            </div>
          </div>
        )}

        {profiles && profiles.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">{profiles.length} of 6 profiles used</p>
              <div className="flex gap-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-6 rounded-full ${i < (profiles?.length || 0) ? "bg-primary" : "bg-muted"}`}
                  />
                ))}
              </div>
            </div>
            {profiles.map((profile) => (
              <div key={profile.id} className="flex items-center justify-between gap-3 p-3 rounded-md border" data-testid={`card-family-profile-${profile.id}`}>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{profile.profileName}</p>
                    <p className="text-xs text-muted-foreground">{profile.fullName || "No name set"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{profile.emails?.length || 0} emails</Badge>
                  {profiles.length > 1 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      data-testid={`button-delete-profile-${profile.id}`}
                      onClick={() => deleteMutation.mutate(profile.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {profiles && profiles.length < 6 && !showAddForm && (
          <Button
            variant="outline"
            onClick={() => setShowAddForm(true)}
            data-testid="button-add-family-member"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Family Member
          </Button>
        )}

        {showAddForm && (
          <div className="space-y-3 p-4 rounded-md border">
            <p className="text-sm font-medium">Add Family Member</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Profile Name *</label>
                <Input
                  data-testid="input-family-profile-name"
                  placeholder='e.g. "Mom", "Dad", "Kid"'
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Full Name</label>
                <Input
                  data-testid="input-family-full-name"
                  placeholder="Jane Doe"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Email Addresses</label>
                <Input
                  data-testid="input-family-emails"
                  placeholder="email@example.com"
                  value={newEmails}
                  onChange={(e) => setNewEmails(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                data-testid="button-save-family-member"
                onClick={() => addMutation.mutate()}
                disabled={addMutation.isPending || !newProfileName.trim()}
              >
                {addMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Member
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}