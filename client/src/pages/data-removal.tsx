import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Shield,
  Search,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Database,
  FileText,
  Eye,
  Lock,
  RefreshCw,
  BarChart3,
  Filter,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  ChevronDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  Calendar,
  Briefcase,
  Users,
  ShieldCheck,
} from "lucide-react";

interface DataBroker {
  id: string;
  name: string;
  domain: string;
  description: string | null;
  category: string;
  dataTypesCollected: string[] | null;
  optOutMethod: string;
  optOutUrl: string | null;
  optOutEmail: string | null;
  optOutInstructions: string | null;
  difficulty: string;
  estimatedProcessingDays: number | null;
  requiresIdVerification: boolean | null;
  requiresAccountCreation: boolean | null;
  legalBasis: string[] | null;
  countriesApplicable: string[] | null;
  riskLevel: string | null;
  monthlyVisitors: string | null;
  parentCompany: string | null;
  isActive: boolean | null;
}

interface VaultProfile {
  id: string;
  fullName: string;
  previousNames: string[] | null;
  emails: string[] | null;
  phoneNumbers: string[] | null;
  currentAddress: string | null;
  previousAddresses: string[] | null;
  dateOfBirth: string | null;
  relativeNames: string[] | null;
  employerNames: string[] | null;
}

interface ScanResult {
  id: string;
  vaultProfileId: string;
  status: string;
  privacyScore: number | null;
  totalExposures: number | null;
  completedAt: string | null;
  createdAt: string;
}

interface ScanFinding {
  id: string;
  scanId: string;
  brokerId: string;
  broker: DataBroker;
  dataTypesFound: string[] | null;
  riskLevel: string | null;
  exposureDetails: string | null;
}

interface RemovalRequest {
  id: string;
  brokerId: string;
  broker?: DataBroker;
  brokerName?: string;
  brokerDomain?: string;
  status: string;
  optOutContent: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  privacyScore: number;
  totalExposures: number;
  removalsInProgress: number;
  confirmedRemoved: number;
  pending: number;
  recentActivity: { date: string; action: string; detail: string }[];
}

function PrivacyScoreCircle({ score, size = 160 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const strokeDashoffset = circumference - progress;

  const getColor = (s: number) => {
    if (s > 70) return "hsl(142, 71%, 45%)";
    if (s >= 40) return "hsl(48, 96%, 53%)";
    return "hsl(0, 84%, 60%)";
  };

  const getLabel = (s: number) => {
    if (s > 70) return "Good";
    if (s >= 40) return "Fair";
    return "At Risk";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted/30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-4xl font-bold"
          data-testid="text-privacy-score-value"
          style={{ color: getColor(score) }}
        >
          {score}
        </span>
        <span className="text-xs text-muted-foreground">{getLabel(score)}</span>
      </div>
    </div>
  );
}

function getDifficultyVariant(difficulty: string): "default" | "secondary" | "destructive" | "outline" {
  switch (difficulty.toLowerCase()) {
    case "easy": return "secondary";
    case "medium": return "outline";
    case "hard": return "destructive";
    default: return "outline";
  }
}

function getRiskVariant(risk: string | null): "default" | "secondary" | "destructive" | "outline" {
  switch (risk?.toLowerCase()) {
    case "critical": return "destructive";
    case "high": return "destructive";
    case "medium": return "outline";
    case "low": return "secondary";
    default: return "outline";
  }
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case "completed": return "default";
    case "confirmed": return "default";
    case "in_progress": return "secondary";
    case "pending": return "outline";
    case "failed": return "destructive";
    case "rejected": return "destructive";
    default: return "outline";
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function OverviewTab() {
  const { isAuthenticated } = useAuth();
  const { data: dashboardData, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/data-removal/dashboard"],
    enabled: isAuthenticated,
  });

  const { data: vaultData } = useQuery<VaultProfile | null>({
    queryKey: ["/api/data-removal/vault"],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return <GuestScanForm />;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-10 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="pt-6 flex justify-center">
            <Skeleton className="h-40 w-40 rounded-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!vaultData) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Set Up Your Privacy Vault</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Start by adding your personal information to the secure vault. This helps us scan data broker sites and find where your data is exposed.
            </p>
            <Button asChild>
              <span className="cursor-pointer">Go to Personal Vault</span>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const stats = dashboardData || {
    privacyScore: 0,
    totalExposures: 0,
    removalsInProgress: 0,
    confirmedRemoved: 0,
    pending: 0,
    recentActivity: [],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card data-testid="card-privacy-score" className="lg:row-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Privacy Score
              </CardTitle>
              <CardDescription>Your overall data exposure rating</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <PrivacyScoreCircle score={stats.privacyScore} size={180} />
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                {stats.privacyScore > 70
                  ? "Your personal data is well protected across most data broker sites."
                  : stats.privacyScore >= 40
                    ? "Some of your data is still exposed. Continue submitting removal requests."
                    : "Your data is widely exposed. We recommend running a scan and starting removals immediately."}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Exposures</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid="text-total-exposures">{stats.totalExposures}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.removalsInProgress}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed Removed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid="text-total-removed">{stats.confirmedRemoved}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.pending}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 rounded-full bg-primary/10">
                      <Clock className="h-3 w-3 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(activity.date)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                No recent activity. Run a scan to get started.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function VaultTab() {
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
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
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
            Enter the personal information you want to protect. This data is used to scan data broker sites for your records.
          </CardDescription>
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
    </motion.div>
  );
}

function GuestScanForm() {
  const { toast } = useToast();
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestAddress, setGuestAddress] = useState("");

  const guestScanMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/data-removal/guest-scan", {
        fullName: guestName,
        emails: guestEmail ? guestEmail.split(",").map((s) => s.trim()).filter(Boolean) : [],
        phoneNumbers: guestPhone ? guestPhone.split(",").map((s) => s.trim()).filter(Boolean) : [],
        currentAddress: guestAddress || "",
      });
      return res.json();
    },
    onError: (error: Error) => {
      toast({ title: "Scan Failed", description: error.message, variant: "destructive" });
    },
  });

  const result = guestScanMutation.data as {
    totalBrokersScanned: number;
    totalExposuresFound: number;
    privacyScore: number;
    riskLevel: string;
    findings: Array<{ broker: DataBroker; dataTypesExposed: string[]; exposureLevel: string }>;
  } | undefined;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Quick Privacy Check
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Enter some basic details to see which data brokers may have your information. No account needed.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name *</label>
              <Input
                placeholder="John Smith"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                data-testid="input-guest-name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                placeholder="john@example.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                data-testid="input-guest-email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                placeholder="(555) 123-4567"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                data-testid="input-guest-phone"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">City/State</label>
              <Input
                placeholder="New York, NY"
                value={guestAddress}
                onChange={(e) => setGuestAddress(e.target.value)}
                data-testid="input-guest-address"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            Your information is not stored and is only used for this one-time check.
          </div>
          <Button
            onClick={() => guestScanMutation.mutate()}
            disabled={!guestName || guestScanMutation.isPending}
            data-testid="button-guest-scan"
          >
            {guestScanMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Check My Exposure
          </Button>
        </CardContent>
      </Card>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mx-auto w-24 h-24 relative mb-3">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
                    <circle
                      cx="50" cy="50" r="45" fill="none" strokeWidth="8"
                      strokeDasharray={`${(result.privacyScore / 100) * 283} 283`}
                      strokeLinecap="round"
                      className={result.privacyScore >= 70 ? "text-green-500" : result.privacyScore >= 40 ? "text-yellow-500" : "text-red-500"}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold" data-testid="text-guest-privacy-score">{result.privacyScore}</span>
                  </div>
                </div>
                <p className="text-sm font-medium">Privacy Score</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-destructive" data-testid="text-guest-exposures">{result.totalExposuresFound}</div>
                <p className="text-sm text-muted-foreground mt-1">Exposures Found</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold">{result.totalBrokersScanned}</div>
                <p className="text-sm text-muted-foreground mt-1">Brokers Scanned</p>
              </CardContent>
            </Card>
          </div>

          {result.findings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Data Brokers With Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.findings.map((finding, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{finding.broker.name}</span>
                        <Badge variant={finding.exposureLevel === "high" ? "destructive" : "secondary"}>
                          {finding.exposureLevel} risk
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {finding.broker.domain} &middot; {finding.dataTypesExposed.join(", ")}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={finding.broker.optOutUrl || `https://${finding.broker.domain}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Opt Out
                      </a>
                    </Button>
                  </div>
                ))}
                <div className="pt-4 border-t text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Sign up to see all exposures, track removal requests, and get automated opt-out letters.
                  </p>
                  <Button asChild>
                    <Link href="/register">Create Free Account</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

function ScanTab() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);

  const { data: vaultData } = useQuery<VaultProfile | null>({
    queryKey: ["/api/data-removal/vault"],
    enabled: isAuthenticated,
  });

  const { data: scansData, isLoading: scansLoading } = useQuery<{ scans: ScanResult[] }>({
    queryKey: ["/api/data-removal/scans"],
    enabled: isAuthenticated,
  });

  const { data: findingsData, isLoading: findingsLoading } = useQuery<{ findings: ScanFinding[] }>({
    queryKey: ["/api/data-removal/findings", selectedScanId],
    enabled: !!selectedScanId,
  });

  const scanMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/data-removal/scan", {
        vaultProfileId: vaultData?.id,
      });
      return res.json();
    },
    onSuccess: (data: { scan?: ScanResult }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/scans"] });
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/dashboard"] });
      if (data.scan?.id) setSelectedScanId(data.scan.id);
      toast({ title: "Scan Started", description: "Your privacy scan is now running." });
    },
    onError: (error: Error) => {
      toast({ title: "Scan Failed", description: error.message, variant: "destructive" });
    },
  });

  const removalMutation = useMutation({
    mutationFn: async ({ brokerId, findingId }: { brokerId: string; findingId?: string }) => {
      const res = await apiRequest("POST", "/api/data-removal/requests", {
        brokerId,
        vaultProfileId: vaultData?.id,
        findingId,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/dashboard"] });
      toast({ title: "Removal Requested", description: "A data removal request has been submitted." });
    },
    onError: (error: Error) => {
      toast({ title: "Request Failed", description: error.message, variant: "destructive" });
    },
  });

  if (!isAuthenticated) {
    return <GuestScanForm />;
  }

  if (!vaultData) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Set Up Your Vault First</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Add your personal information to the vault before running a scan. This tells us what to look for.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const scans = scansData?.scans || [];
  const findings = findingsData?.findings || [];
  const latestScan = scans[0];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Exposure Scan
            </CardTitle>
            <CardDescription>
              Scan data broker sites to find where your personal information is being sold or exposed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              data-testid="button-run-scan"
              onClick={() => scanMutation.mutate()}
              disabled={scanMutation.isPending}
            >
              {scanMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Run New Scan
            </Button>

            {latestScan && latestScan.privacyScore !== null && (
              <div className="flex items-center gap-6 p-4 rounded-md bg-muted/30">
                <PrivacyScoreCircle score={latestScan.privacyScore} size={100} />
                <div>
                  <p className="font-medium">Latest Scan Results</p>
                  <p className="text-sm text-muted-foreground">
                    {latestScan.totalExposures} exposure{latestScan.totalExposures !== 1 ? "s" : ""} found
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {latestScan.completedAt ? formatDate(latestScan.completedAt) : formatDate(latestScan.createdAt)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {selectedScanId && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Scan Findings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {findingsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : findings.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500 opacity-70" />
                  <p className="text-muted-foreground">No exposures found in this scan.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {findings.map((finding) => (
                    <div
                      key={finding.id}
                      className="flex items-start justify-between gap-4 p-4 rounded-md border"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium">{finding.broker?.name || "Unknown Broker"}</p>
                          <Badge variant={getRiskVariant(finding.riskLevel)}>
                            {finding.riskLevel || "Unknown"} Risk
                          </Badge>
                          {finding.broker?.category && (
                            <Badge variant="secondary">{finding.broker.category}</Badge>
                          )}
                        </div>
                        {finding.dataTypesFound && finding.dataTypesFound.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Data exposed: {finding.dataTypesFound.join(", ")}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        data-testid={`button-request-removal-${finding.brokerId}`}
                        onClick={() =>
                          removalMutation.mutate({
                            brokerId: finding.brokerId,
                            findingId: finding.id,
                          })
                        }
                        disabled={removalMutation.isPending}
                      >
                        {removalMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-1" />
                        )}
                        Request Removal
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Scan History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scansLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : scans.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No scans yet. Run your first scan above.
              </p>
            ) : (
              <div className="space-y-2">
                {scans.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-md hover-elevate cursor-pointer"
                    onClick={() => setSelectedScanId(scan.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-full bg-primary/10">
                        <Search className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Scan - {formatDate(scan.createdAt)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {scan.totalExposures ?? 0} exposures found
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {scan.privacyScore !== null && (
                        <Badge variant={scan.privacyScore > 70 ? "default" : scan.privacyScore >= 40 ? "outline" : "destructive"}>
                          Score: {scan.privacyScore}
                        </Badge>
                      )}
                      <Badge variant={scan.status === "completed" ? "default" : "secondary"}>
                        {scan.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function TrackerTab() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: requestsData, isLoading } = useQuery<{ requests: RemovalRequest[] }>({
    queryKey: ["/api/data-removal/requests", statusFilter !== "all" ? statusFilter : ""],
    enabled: isAuthenticated,
  });

  const generateMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const res = await apiRequest("POST", `/api/data-removal/requests/${requestId}/generate`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/requests"] });
      toast({ title: "Opt-Out Letter Generated", description: "Your opt-out letter has been prepared." });
    },
    onError: (error: Error) => {
      toast({ title: "Generation Failed", description: error.message, variant: "destructive" });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest("PATCH", `/api/data-removal/requests/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/dashboard"] });
      toast({ title: "Status Updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    },
  });

  if (!isAuthenticated) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Sign In to Track Removals</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Track the progress of your data removal requests across all data broker sites.
            </p>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const requests = requestsData?.requests || [];
  const completed = requests.filter((r) => r.status === "completed").length;
  const progressPercent = requests.length > 0 ? Math.round((completed / requests.length) * 100) : 0;

  const statusOptions = ["all", "pending", "in_progress", "completed", "failed"];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Overall Removal Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{completed} of {requests.length} completed</span>
              <span className="font-medium">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Removal Requests
              </CardTitle>
              <div className="flex gap-1 flex-wrap">
                {statusOptions.map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={statusFilter === s ? "default" : "outline"}
                    onClick={() => setStatusFilter(s)}
                    className="capitalize"
                  >
                    {s === "in_progress" ? "In Progress" : s}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-muted-foreground">No removal requests yet.</p>
                <p className="text-sm text-muted-foreground">Run a scan and request removals from the Exposure Scan tab.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => (
                  <div key={req.id} className="border rounded-md">
                    <div className="flex items-start justify-between gap-4 p-4 flex-wrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium">{req.brokerName || req.broker?.name || "Unknown"}</p>
                          <Badge variant={getStatusVariant(req.status)} className="capitalize">
                            {req.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {req.brokerDomain || req.broker?.domain || "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Requested: {formatDate(req.createdAt)}
                          {req.updatedAt && req.updatedAt !== req.createdAt && (
                            <> &middot; Updated: {formatDate(req.updatedAt)}</>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Instructions
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateMutation.mutate(req.id)}
                          disabled={generateMutation.isPending}
                        >
                          {generateMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <FileText className="h-4 w-4 mr-1" />
                          )}
                          Opt-Out Letter
                        </Button>
                        <Select
                          value={req.status}
                          onValueChange={(value) => statusMutation.mutate({ id: req.id, status: value })}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {expandedId === req.id && (
                      <div className="px-4 pb-4 border-t pt-3">
                        {req.optOutContent ? (
                          <div className="text-sm whitespace-pre-wrap bg-muted/30 rounded-md p-3">
                            {req.optOutContent}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No opt-out instructions available. Click "Opt-Out Letter" to generate one.
                          </p>
                        )}
                        {req.notes && (
                          <p className="text-sm mt-2 text-muted-foreground">
                            Notes: {req.notes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function BrokersTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [page, setPage] = useState(0);
  const [expandedBrokerId, setExpandedBrokerId] = useState<string | null>(null);
  const limit = 20;

  const queryParams = new URLSearchParams();
  if (category && category !== "all") queryParams.set("category", category);
  if (difficulty && difficulty !== "all") queryParams.set("difficulty", difficulty);
  if (searchQuery) queryParams.set("search", searchQuery);
  queryParams.set("limit", String(limit));
  queryParams.set("offset", String(page * limit));

  const { data: brokersData, isLoading } = useQuery<{ brokers: DataBroker[]; total: number }>({
    queryKey: ["/api/data-removal/brokers", `?${queryParams.toString()}`],
  });

  const brokers = brokersData?.brokers || [];
  const total = brokersData?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Broker Database
            </CardTitle>
            <CardDescription>
              Browse and search our catalog of {total > 0 ? `${total}+` : ""} known data broker sites.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 flex-wrap">
              <div className="flex-1 min-w-[200px] space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    data-testid="input-broker-search"
                    placeholder="Search brokers..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(0);
                    }}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="w-[160px] space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <Select
                  value={category}
                  onValueChange={(v) => {
                    setCategory(v);
                    setPage(0);
                  }}
                  data-testid="select-broker-category"
                >
                  <SelectTrigger data-testid="select-broker-category">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="people-search">People Search</SelectItem>
                    <SelectItem value="data-broker">Data Broker</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="background-check">Background Check</SelectItem>
                    <SelectItem value="social-media">Social Media</SelectItem>
                    <SelectItem value="public-records">Public Records</SelectItem>
                    <SelectItem value="advertising">Advertising</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[140px] space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Difficulty</label>
                <Select
                  value={difficulty}
                  onValueChange={(v) => {
                    setDifficulty(v);
                    setPage(0);
                  }}
                  data-testid="select-broker-difficulty"
                >
                  <SelectTrigger data-testid="select-broker-difficulty">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6 space-y-3">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : brokers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Database className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-muted-foreground">No brokers found matching your criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brokers.map((broker, index) => (
              <motion.div
                key={broker.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card data-testid={`card-broker-${broker.id}`}>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{broker.name}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {broker.domain}
                        </p>
                      </div>
                      {broker.riskLevel && (
                        <Badge variant={getRiskVariant(broker.riskLevel)} className="capitalize">
                          {broker.riskLevel}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="capitalize">{broker.category}</Badge>
                      <Badge variant={getDifficultyVariant(broker.difficulty)} className="capitalize">
                        {broker.difficulty}
                      </Badge>
                      <Badge variant="outline" className="capitalize">{broker.optOutMethod}</Badge>
                    </div>

                    {broker.dataTypesCollected && broker.dataTypesCollected.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Collects: {broker.dataTypesCollected.slice(0, 4).join(", ")}
                        {broker.dataTypesCollected.length > 4 && ` +${broker.dataTypesCollected.length - 4} more`}
                      </p>
                    )}

                    {broker.estimatedProcessingDays && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Est. {broker.estimatedProcessingDays} days to process
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setExpandedBrokerId(expandedBrokerId === broker.id ? null : broker.id)
                        }
                      >
                        <ChevronDown
                          className={`h-4 w-4 mr-1 transition-transform ${expandedBrokerId === broker.id ? "rotate-180" : ""}`}
                        />
                        Details
                      </Button>
                      {broker.optOutUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={broker.optOutUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Opt-Out Page
                          </a>
                        </Button>
                      )}
                    </div>

                    {expandedBrokerId === broker.id && (
                      <div className="border-t pt-3 mt-2 space-y-2">
                        {broker.description && (
                          <p className="text-sm text-muted-foreground">{broker.description}</p>
                        )}
                        {broker.optOutInstructions && (
                          <div>
                            <p className="text-xs font-medium mb-1">Opt-Out Instructions:</p>
                            <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                              {broker.optOutInstructions}
                            </p>
                          </div>
                        )}
                        {broker.optOutEmail && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {broker.optOutEmail}
                          </p>
                        )}
                        <div className="flex gap-3 flex-wrap text-xs text-muted-foreground">
                          {broker.requiresIdVerification && (
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Requires ID Verification
                            </span>
                          )}
                          {broker.requiresAccountCreation && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Requires Account
                            </span>
                          )}
                          {broker.parentCompany && (
                            <span>Parent: {broker.parentCompany}</span>
                          )}
                          {broker.monthlyVisitors && (
                            <span>Visitors: {broker.monthlyVisitors}/mo</span>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function DataRemoval() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Data Broker Removal - Protect Your Privacy"
        description="Remove your personal information from 150+ data broker sites. Scan, track, and manage data removal requests with enterprise-grade privacy protection tools."
      />
      <Navigation />

      <main id="main-content" tabIndex={-1}>
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div
              className="absolute rounded-full"
              style={{
                width: "clamp(300px, 40vw, 500px)",
                height: "clamp(300px, 40vw, 500px)",
                bottom: "-40%",
                right: "-10%",
                backgroundColor: "rgba(59, 130, 246, 0.15)",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: "clamp(200px, 25vw, 350px)",
                height: "clamp(200px, 25vw, 350px)",
                top: "-20%",
                left: "-5%",
                backgroundColor: "rgba(139, 92, 246, 0.1)",
              }}
            />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-white/10">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  Data Broker Removal
                </h1>
                <p className="text-white/70 mt-1 max-w-2xl">
                  Scan, track, and remove your personal information from 150+ data broker sites with enterprise-grade privacy protection.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 flex-wrap h-auto gap-1">
              <TabsTrigger value="overview" data-testid="tab-overview">
                <BarChart3 className="h-4 w-4 mr-1.5" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="vault" data-testid="tab-vault">
                <Lock className="h-4 w-4 mr-1.5" />
                Personal Vault
              </TabsTrigger>
              <TabsTrigger value="scan" data-testid="tab-scan">
                <Search className="h-4 w-4 mr-1.5" />
                Exposure Scan
              </TabsTrigger>
              <TabsTrigger value="tracker" data-testid="tab-tracker">
                <Trash2 className="h-4 w-4 mr-1.5" />
                Removal Tracker
              </TabsTrigger>
              <TabsTrigger value="brokers" data-testid="tab-brokers">
                <Database className="h-4 w-4 mr-1.5" />
                Broker Database
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OverviewTab />
            </TabsContent>
            <TabsContent value="vault">
              <VaultTab />
            </TabsContent>
            <TabsContent value="scan">
              <ScanTab />
            </TabsContent>
            <TabsContent value="tracker">
              <TrackerTab />
            </TabsContent>
            <TabsContent value="brokers">
              <BrokersTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
