import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
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

  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"journey" | "dashboard" | "vault" | "scan" | "tracker" | "brokers" | "reports">("journey");

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
          { id: "brokers", label: "Broker Database", icon: Database, desc: "Browse 500+ known data broker sites", view: "brokers" as const },
          { id: "reports", label: "Reports & Compliance", icon: ClipboardCheck, desc: "Progress reports and regulatory compliance tracking", view: "reports" as const },
        ].map((item) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
            <button
              className="w-full flex items-center gap-3 p-3 rounded-md border text-left hover-elevate"
              onClick={() => {
                if (item.view) {
                  setActiveView(item.view);
                } else {
                  setExpandedSection(expandedSection === item.id ? null : item.id);
                }
              }}
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

function ViewNav({ activeView, setActiveView }: { activeView: string; setActiveView: (v: any) => void }) {
  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setActiveView("journey")}
        data-testid="button-back-to-journey"
      >
        <ChevronDown className="h-4 w-4 mr-1 rotate-90" />
        Back to Overview
      </Button>
    </div>
  );
}

export default function DataRemoval() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Data Broker Removal - Protect Your Privacy"
        description="Check for confirmed data breaches and send opt-out requests to 500+ data broker sites. Honest, fact-based privacy protection tools."
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
                  Find your public profiles on people-search sites, send opt-out requests, and track removal progress across 500+ data brokers.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isAuthenticated ? <AuthenticatedJourney /> : <GuestScanForm />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
