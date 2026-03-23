import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { SEOHead } from "@/components/seo-head";
import bannerImage from "@/assets/images/tool-data-scan-diverse.png";
import { StructuredData } from "@/components/structured-data";
import type { WebApplicationData, BreadcrumbData } from "@/components/structured-data";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Shield,
  Search,
  Lock,
  Database,
  ClipboardCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Eye,
  BarChart3,
  Trash2,
} from "lucide-react";

import { GuestScanForm } from "@/components/data-removal/guest-scan";
import { VaultForm } from "@/components/data-removal/vault-form";
import { ScanResults } from "@/components/data-removal/scan-results";
import { RemovalTracker } from "@/components/data-removal/tracker";
import { Dashboard } from "@/components/data-removal/dashboard";
import { BrokerDatabase } from "@/components/data-removal/brokers";
import { Reports } from "@/components/data-removal/reports";
import { ProgressCelebration } from "@/components/data-removal/progress-celebration";
import { MonitoringPanel, ComplianceTracker } from "@/components/data-removal/monitoring";
import type { VaultProfile, DashboardStats } from "@/components/data-removal/types";

type JourneyStep = "vault" | "scan" | "remove" | "monitor";

function StepIndicator({ currentStep, hasVault, hasScans, hasRemovals }: {
  currentStep: JourneyStep;
  hasVault: boolean;
  hasScans: boolean;
  hasRemovals: boolean;
}) {
  const steps: { id: JourneyStep; label: string; icon: typeof Shield; complete: boolean }[] = [
    { id: "vault", label: "Set Up Vault", icon: Lock, complete: hasVault },
    { id: "scan", label: "Scan", icon: Search, complete: hasScans },
    { id: "remove", label: "Remove", icon: Trash2, complete: hasRemovals },
    { id: "monitor", label: "Monitor", icon: Eye, complete: false },
  ];

  return (
    <div className="flex items-center gap-1 sm:gap-2 w-full" data-testid="step-indicator">
      {steps.map((step, idx) => {
        const isActive = currentStep === step.id;
        const Icon = step.icon;
        return (
          <div key={step.id} className="flex items-center flex-1 min-w-0">
            <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm transition-colors min-w-0 ${
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : step.complete
                ? "text-green-600 dark:text-green-400"
                : "text-muted-foreground"
            }`}>
              {step.complete && !isActive ? (
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              ) : (
                <Icon className="h-4 w-4 flex-shrink-0" />
              )}
              <span className="hidden sm:inline truncate">{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground/40 flex-shrink-0 mx-0.5" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function AuthenticatedJourney() {
  const { data: vaultData, isLoading: vaultLoading } = useQuery<VaultProfile | null>({
    queryKey: ["/api/data-removal/vault"],
  });

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/data-removal/dashboard"],
  });

  const [activeView, setActiveView] = useState<"journey" | "dashboard" | "vault" | "scan" | "tracker" | "brokers" | "reports" | "monitoring">("journey");

  if (vaultLoading || dashboardLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-10 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const hasVault = !!vaultData;
  const stats = dashboardData;
  const hasScans = (stats?.totalScans ?? 0) > 0;
  const hasRemovals = (stats?.completed ?? 0) > 0 || (stats?.inProgress ?? 0) > 0 || (stats?.pending ?? 0) > 0;
  const completedCount = stats?.completed ?? 0;
  const totalCount = (stats?.totalExposures ?? 0);
  const inProgressCount = (stats?.inProgress ?? 0) + (stats?.pending ?? 0);

  const currentStep: JourneyStep = !hasVault ? "vault" : !hasScans ? "scan" : !hasRemovals ? "remove" : "monitor";

  if (activeView === "dashboard") return <><ViewNav activeView={activeView} setActiveView={setActiveView} /><Dashboard /></>;
  if (activeView === "vault") return <><ViewNav activeView={activeView} setActiveView={setActiveView} /><VaultForm /></>;
  if (activeView === "scan") return <><ViewNav activeView={activeView} setActiveView={setActiveView} /><ScanResults /></>;
  if (activeView === "tracker") return <><ViewNav activeView={activeView} setActiveView={setActiveView} /><RemovalTracker /></>;
  if (activeView === "brokers") return <><ViewNav activeView={activeView} setActiveView={setActiveView} /><BrokerDatabase /></>;
  if (activeView === "reports") return <><ViewNav activeView={activeView} setActiveView={setActiveView} /><Reports /></>;
  if (activeView === "monitoring") return <><ViewNav activeView={activeView} setActiveView={setActiveView} /><div className="space-y-6"><MonitoringPanel /><ComplianceTracker /></div></>;

  return (
    <div className="space-y-6">
      <StepIndicator currentStep={currentStep} hasVault={hasVault} hasScans={hasScans} hasRemovals={hasRemovals} />

      {completedCount > 0 && (
        <ProgressCelebration completedCount={completedCount} totalCount={totalCount} inProgressCount={inProgressCount} />
      )}

      {!hasVault && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold" data-testid="text-vault-setup-heading">Step 1: Set Up Your Privacy Vault</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Add your personal details so we can search people-search sites and data brokers for your public profiles.
              </p>
              <Button onClick={() => setActiveView("vault")} data-testid="button-go-to-vault">
                <Lock className="h-4 w-4 mr-2" />
                Set Up Vault
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {hasVault && !hasScans && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold" data-testid="text-scan-cta-heading">Step 2: Scan for Your Data</h3>
              <p className="text-muted-foreground text-center max-w-md">
                We'll check 500+ data broker sites to find where your personal information is publicly listed.
              </p>
              <Button onClick={() => setActiveView("scan")} data-testid="button-go-to-scan">
                <Search className="h-4 w-4 mr-2" />
                Run Exposure Scan
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {hasVault && hasScans && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-5 pb-4 text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400" data-testid="text-journey-exposures">{stats?.totalExposures ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Findings</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4 text-center">
                <div className="text-2xl font-bold" data-testid="text-journey-in-progress">{inProgressCount}</div>
                <p className="text-xs text-muted-foreground mt-1">In Progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400" data-testid="text-journey-completed">{completedCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Removed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4 text-center">
                <div className="text-2xl font-bold" data-testid="text-journey-success-rate">{stats?.successRate ?? 0}%</div>
                <p className="text-xs text-muted-foreground mt-1">Success Rate</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() => setActiveView("scan")}
              data-testid="button-view-scan"
            >
              <Search className="h-4 w-4" />
              Run New Scan
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() => setActiveView("tracker")}
              data-testid="button-view-tracker"
            >
              <Trash2 className="h-4 w-4" />
              Track Removals
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() => setActiveView("dashboard")}
              data-testid="button-view-dashboard"
            >
              <BarChart3 className="h-4 w-4" />
              Full Dashboard
            </Button>
          </div>
        </motion.div>
      )}

      <div className="space-y-2 pt-4">
        <p className="text-sm font-medium text-muted-foreground">Tools & Resources</p>
        {[
          { id: "vault", label: "Personal Vault", icon: Lock, desc: "Manage your protected information", view: "vault" as const },
          { id: "monitoring", label: "Monitoring & Compliance", icon: Eye, desc: "Continuous monitoring and regulatory compliance tracking", view: "monitoring" as const },
          { id: "brokers", label: "Broker Database", icon: Database, desc: "Browse 500+ known data broker sites", view: "brokers" as const },
          { id: "reports", label: "Reports", icon: ClipboardCheck, desc: "Detailed progress reports and analytics", view: "reports" as const },
        ].map((item) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
            <button
              className="w-full flex items-center gap-3 p-3 rounded-md border text-left hover-elevate"
              onClick={() => setActiveView(item.view)}
              data-testid={`button-section-${item.id}`}
            >
              <item.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const viewLabels: Record<string, string> = {
  dashboard: "Full Dashboard",
  vault: "Personal Vault",
  scan: "Exposure Scan",
  tracker: "Removal Tracker",
  brokers: "Broker Database",
  reports: "Reports",
  monitoring: "Monitoring & Compliance",
};

function ViewNav({ activeView, setActiveView }: { activeView: string; setActiveView: (v: "journey" | "dashboard" | "vault" | "scan" | "tracker" | "brokers" | "reports" | "monitoring") => void }) {
  return (
    <div className="mb-6 flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setActiveView("journey")}
        data-testid="button-back-to-journey"
      >
        <ChevronDown className="h-4 w-4 mr-1 rotate-90" />
        Back to Overview
      </Button>
      <span className="text-sm text-muted-foreground">/</span>
      <span className="text-sm font-medium">{viewLabels[activeView] ?? activeView}</span>
    </div>
  );
}

export default function DataRemoval() {
  const { isAuthenticated } = useAuth();

  const dataRemovalApp: WebApplicationData = {
    type: "WebApplication",
    name: "GCR Shield — Removal Center",
    description: "Track and manage data broker removal requests. Send opt-out requests to 500+ data broker sites, monitor removal progress, and protect your privacy.",
    url: "https://www.getcyberright.com/data-removal",
    applicationCategory: "SecurityApplication",
    provider: "GetCyberRight",
  };

  const dataRemovalBreadcrumbs: BreadcrumbData = {
    type: "BreadcrumbList",
    items: [
      { name: "Home", url: "https://www.getcyberright.com/" },
      { name: "GCR Shield", url: "https://www.getcyberright.com/shield" },
      { name: "Removal Center", url: "https://www.getcyberright.com/data-removal" },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="GCR Shield — Removal Center | GetCyberRight"
        description="Track and manage data broker removal requests. Send opt-out requests to 500+ data broker sites, monitor removal progress, and protect your privacy."
      />
      <StructuredData data={[dataRemovalApp, dataRemovalBreadcrumbs]} />
      <Navigation />

      <main id="main-content" tabIndex={-1}>
        <PageBanner
          title="GCR Shield — Removal Center"
          subtitle="Send opt-out requests, track removal progress, and manage your privacy across 500+ data broker sites."
          imageSrc={bannerImage}
          imageAlt="Person scanning for personal data exposure on data broker sites"
          imagePosition="left"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isAuthenticated ? <AuthenticatedJourney /> : <GuestScanForm />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
