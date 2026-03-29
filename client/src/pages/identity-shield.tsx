import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { SEOHead } from "@/components/seo-head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Mail,
  Phone,
  User,
  Copy,
  Trash2,
  Plus,
  ToggleLeft,
  ToggleRight,
  ArrowUpRight,
  Activity,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Link } from "wouter";

const SERVICE_CATEGORIES = [
  { value: "shopping", label: "Shopping" },
  { value: "social_media", label: "Social Media" },
  { value: "gaming", label: "Gaming" },
  { value: "education", label: "Education" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "entertainment", label: "Entertainment" },
  { value: "travel", label: "Travel" },
  { value: "food_delivery", label: "Food Delivery" },
  { value: "news", label: "News" },
  { value: "fitness", label: "Fitness" },
  { value: "productivity", label: "Productivity" },
  { value: "kids_apps", label: "Kids Apps" },
  { value: "school", label: "School" },
  { value: "other", label: "Other" },
];

type AliasType = "email" | "phone" | "username";

interface MaskedIdentity {
  id: string;
  alias: string;
  aliasType: AliasType;
  realValue: string;
  label: string | null;
  serviceName: string | null;
  serviceCategory: string | null;
  isActive: boolean;
  forwardingEnabled: boolean;
  totalForwarded: number;
  totalBlocked: number;
  lastActivityAt: string | null;
  createdAt: string;
}

interface IdentityStats {
  totalAliases: number;
  activeAliases: number;
  totalForwarded: number;
  totalBlocked: number;
  limit: number;
  currentCount: number;
  tier: string;
  byType: Record<string, number>;
  byCategory: Record<string, number>;
}

function CreateAliasDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [aliasType, setAliasType] = useState<AliasType>("email");
  const [realValue, setRealValue] = useState("");
  const [label, setLabel] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/masked-identities", {
        aliasType,
        realValue,
        label: label || undefined,
        serviceName: serviceName || undefined,
        serviceCategory: serviceCategory || undefined,
      });
      return res.json();
    },
    onSuccess: (data: MaskedIdentity) => {
      toast({
        title: "Identity created",
        description: `Your masked ${aliasType} has been generated: ${data.alias}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/masked-identities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/masked-identities/stats"] });
      setOpen(false);
      setRealValue("");
      setLabel("");
      setServiceName("");
      setServiceCategory("");
      onCreated();
    },
    onError: (error: any) => {
      const msg = error?.message || "Failed to create identity";
      if (msg.includes("Alias limit")) {
        toast({
          title: "Limit reached",
          description: "Upgrade your plan to create more masked identities.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Error", description: msg, variant: "destructive" });
      }
    },
  });

  const typeConfig = {
    email: { icon: Mail, placeholder: "your.real@email.com", label: "Real Email Address" },
    phone: { icon: Phone, placeholder: "+1 (555) 123-4567", label: "Real Phone Number" },
    username: { icon: User, placeholder: "your_real_username", label: "Real Username" },
  };

  const config = typeConfig[aliasType];
  const TypeIcon = config.icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" data-testid="button-create-alias">
          <Plus className="w-4 h-4" /> Create Masked Identity
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> New Masked Identity
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <Label>Identity Type</Label>
            <div className="grid grid-cols-3 gap-2 mt-1.5">
              {(["email", "phone", "username"] as AliasType[]).map((type) => {
                const Icon = typeConfig[type].icon;
                return (
                  <button
                    key={type}
                    onClick={() => setAliasType(type)}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all text-sm ${
                      aliasType === type
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border hover:border-primary/50"
                    }`}
                    data-testid={`button-type-${type}`}
                  >
                    <Icon className="w-4 h-4" />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label htmlFor="realValue">
              <TypeIcon className="w-3.5 h-3.5 inline mr-1" />
              {config.label}
            </Label>
            <Input
              id="realValue"
              placeholder={config.placeholder}
              value={realValue}
              onChange={(e) => setRealValue(e.target.value)}
              className="mt-1.5"
              data-testid="input-real-value"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This is encrypted and never shared. It is only used to forward messages to you.
            </p>
          </div>

          <div>
            <Label htmlFor="label">Label (optional)</Label>
            <Input
              id="label"
              placeholder="e.g., Online Shopping, Kids Game Account"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="mt-1.5"
              data-testid="input-alias-label"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="serviceName">Service Name (optional)</Label>
              <Input
                id="serviceName"
                placeholder="e.g., Amazon, Roblox"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="mt-1.5"
                data-testid="input-service-name"
              />
            </div>
            <div>
              <Label>Category (optional)</Label>
              <Select value={serviceCategory} onValueChange={setServiceCategory}>
                <SelectTrigger className="mt-1.5" data-testid="select-category">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={() => createMutation.mutate()}
            disabled={!realValue || createMutation.isPending}
            className="w-full"
            data-testid="button-submit-alias"
          >
            {createMutation.isPending ? "Generating..." : "Generate Masked Identity"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AliasCard({ identity, onRefresh }: { identity: MaskedIdentity; onRefresh: () => void }) {
  const [showReal, setShowReal] = useState(false);
  const { toast } = useToast();

  const toggleMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", `/api/masked-identities/${identity.id}/toggle`, {
        isActive: !identity.isActive,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/masked-identities"] });
      onRefresh();
    },
  });

  const forwardingMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", `/api/masked-identities/${identity.id}/forwarding`, {
        enabled: !identity.forwardingEnabled,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/masked-identities"] });
      onRefresh();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/masked-identities/${identity.id}`);
    },
    onSuccess: () => {
      toast({ title: "Identity deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/masked-identities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/masked-identities/stats"] });
      onRefresh();
    },
  });

  const copyAlias = () => {
    navigator.clipboard.writeText(identity.alias);
    toast({ title: "Copied to clipboard", description: identity.alias });
  };

  const typeIcons: Record<string, typeof Mail> = { email: Mail, phone: Phone, username: User };
  const TypeIcon = typeIcons[identity.aliasType] || Shield;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
    >
      <Card className={`transition-all ${!identity.isActive ? "opacity-60" : ""}`} data-testid={`card-alias-${identity.id}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                identity.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}>
                <TypeIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyAlias}
                    className="font-mono text-sm font-medium truncate hover:text-primary transition-colors cursor-pointer"
                    title="Click to copy"
                    data-testid={`button-copy-alias-${identity.id}`}
                  >
                    {identity.alias}
                  </button>
                  <Copy className="w-3.5 h-3.5 text-muted-foreground shrink-0 cursor-pointer hover:text-primary" onClick={copyAlias} />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {identity.label && (
                    <span className="text-xs text-muted-foreground">{identity.label}</span>
                  )}
                  {identity.serviceName && (
                    <Badge variant="secondary" className="text-xs h-5">
                      {identity.serviceName}
                    </Badge>
                  )}
                  {identity.serviceCategory && (
                    <Badge variant="outline" className="text-xs h-5">
                      {SERVICE_CATEGORIES.find(c => c.value === identity.serviceCategory)?.label || identity.serviceCategory}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowReal(!showReal)}
                title={showReal ? "Hide real value" : "Show real value"}
                data-testid={`button-toggle-reveal-${identity.id}`}
              >
                {showReal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => toggleMutation.mutate()}
                title={identity.isActive ? "Deactivate" : "Activate"}
                data-testid={`button-toggle-active-${identity.id}`}
              >
                {identity.isActive ? (
                  <ToggleRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ToggleLeft className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => {
                  if (confirm("Delete this masked identity? This cannot be undone.")) {
                    deleteMutation.mutate();
                  }
                }}
                data-testid={`button-delete-alias-${identity.id}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {showReal && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 pt-3 border-t"
            >
              <div className="flex items-center gap-2 text-sm">
                <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Forwards to:</span>
                <code className="bg-muted px-2 py-0.5 rounded text-xs">{identity.realValue}</code>
              </div>
            </motion.div>
          )}

          <div className="flex items-center gap-4 mt-3 pt-3 border-t text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 text-green-500" />
              {identity.totalForwarded} forwarded
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-red-500" />
              {identity.totalBlocked} blocked
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={() => forwardingMutation.mutate()}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors ${
                  identity.forwardingEnabled
                    ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                    : "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                }`}
                data-testid={`button-toggle-forwarding-${identity.id}`}
              >
                {identity.forwardingEnabled ? "Forwarding On" : "Forwarding Off"}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function IdentityShield() {
  const { user, isLoading: authLoading } = useAuth();
  const [filter, setFilter] = useState<AliasType | "all">("all");

  const { data: identities, isLoading: identitiesLoading, refetch: refetchIdentities } = useQuery<MaskedIdentity[]>({
    queryKey: ["/api/masked-identities"],
    enabled: !!user,
  });

  const { data: stats, isLoading: statsLoading } = useQuery<IdentityStats>({
    queryKey: ["/api/masked-identities/stats"],
    enabled: !!user,
  });

  const filteredIdentities = identities?.filter(
    (i) => filter === "all" || i.aliasType === filter
  ) || [];

  const handleRefresh = () => {
    refetchIdentities();
    queryClient.invalidateQueries({ queryKey: ["/api/masked-identities/stats"] });
  };

  return (
    <>
      <SEOHead
        title="Identity Shield - Masked Identities | GetCyberRight"
        description="Generate masked emails, phone numbers, and usernames to protect your real identity when signing up for services. Stop giving out your real data."
        path="/identity-shield"
      />
      <Navigation />

      <PageBanner
        title="Identity Shield"
        subtitle="Stop giving out your real email, phone number, and username. Generate masked identities for every signup."
      />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {!user && !authLoading ? (
          <Card>
            <CardContent className="py-16 text-center space-y-4">
              <Shield className="w-16 h-16 mx-auto text-primary opacity-80" />
              <h2 className="text-2xl font-bold">Protect Your Real Identity</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Every time you sign up for a service with your real email or phone, you create another point of exposure.
                Identity Shield generates masked identities that forward to you, so your real information stays hidden.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link href="/auth">
                  <Button size="lg" className="gap-2" data-testid="button-sign-in">
                    <Lock className="w-4 h-4" /> Sign In to Get Started
                  </Button>
                </Link>
                <Link href="/data-shield-pricing">
                  <Button variant="outline" size="lg" data-testid="button-view-plans">
                    View Plans
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-left max-w-2xl mx-auto">
                <div className="p-4 rounded-lg border bg-card">
                  <Mail className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-semibold text-sm">Masked Emails</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Generate unique email addresses that forward to your real inbox. Disable anytime.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <Phone className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-semibold text-sm">Masked Phone Numbers</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get disposable phone numbers for verifications and signups.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <User className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-semibold text-sm">Masked Usernames</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Create unique usernames for every service so breaches cannot link your accounts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {statsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <ShieldCheck className="w-6 h-6 mx-auto text-primary mb-1" />
                    <div className="text-2xl font-bold" data-testid="text-total-aliases">
                      {stats.activeAliases}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Active Identities ({stats.currentCount}/{stats.limit})
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-6 h-6 mx-auto text-green-500 mb-1" />
                    <div className="text-2xl font-bold" data-testid="text-forwarded">
                      {stats.totalForwarded}
                    </div>
                    <div className="text-xs text-muted-foreground">Messages Forwarded</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Shield className="w-6 h-6 mx-auto text-red-500 mb-1" />
                    <div className="text-2xl font-bold" data-testid="text-blocked">
                      {stats.totalBlocked}
                    </div>
                    <div className="text-xs text-muted-foreground">Threats Blocked</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Activity className="w-6 h-6 mx-auto text-blue-500 mb-1" />
                    <div className="text-2xl font-bold" data-testid="text-alias-types">
                      {Object.keys(stats.byType).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Identity Types</div>
                  </CardContent>
                </Card>
              </div>
            ) : null}

            {stats && stats.currentCount >= stats.limit && (
              <Card className="border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      You have reached your {stats.tier} plan limit of {stats.limit} identities.
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Upgrade your Data Shield plan to create more masked identities.
                    </p>
                  </div>
                  <Link href="/data-shield-pricing">
                    <Button size="sm" variant="outline" data-testid="button-upgrade">
                      Upgrade
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                {(["all", "email", "phone", "username"] as const).map((type) => (
                  <Button
                    key={type}
                    variant={filter === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(type)}
                    data-testid={`button-filter-${type}`}
                  >
                    {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
              <CreateAliasDialog onCreated={handleRefresh} />
            </div>

            {identitiesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
            ) : filteredIdentities.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Shield className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">
                    {filter !== "all"
                      ? `No ${filter} identities yet. Create one to get started.`
                      : "No masked identities yet. Create your first one to stop exposing your real information."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="space-y-3">
                  {filteredIdentities.map((identity) => (
                    <AliasCard
                      key={identity.id}
                      identity={identity}
                      onRefresh={handleRefresh}
                    />
                  ))}
                </div>
              </AnimatePresence>
            )}

            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  How Identity Shield Works
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                  <div>
                    <div className="font-medium mb-1">1. Generate</div>
                    <p className="text-muted-foreground text-xs">
                      Create a masked email, phone, or username. Each is unique and encrypted.
                    </p>
                  </div>
                  <div>
                    <div className="font-medium mb-1">2. Use It Everywhere</div>
                    <p className="text-muted-foreground text-xs">
                      Sign up for services with your masked identity instead of your real one. Copy and paste from here.
                    </p>
                  </div>
                  <div>
                    <div className="font-medium mb-1">3. Stay Protected</div>
                    <p className="text-muted-foreground text-xs">
                      Messages forward to your real address. If a service gets breached, only the alias is exposed. Disable it in one click.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}
