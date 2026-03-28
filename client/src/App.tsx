import { Switch, Route, useLocation } from "wouter";
import { useEffect, useState, lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { DeziAssistant } from "@/components/dezi-assistant";
import { FeedbackWidget } from "@/components/feedback-widget";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { CookieConsent } from "@/components/cookie-consent";
import { ErrorBoundary } from "@/components/error-boundary";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
import { Loader2 } from "lucide-react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const isServer = typeof window === "undefined";

import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import Tools from "@/pages/tools";
import Resources from "@/pages/resources";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import EmergencyHelp from "@/pages/emergency-help";
import Kids from "@/pages/kids";
import Seniors from "@/pages/seniors";
import Parents from "@/pages/parents";
import SupportPage from "@/pages/support";
import Security from "@/pages/security";
import OurMission from "@/pages/pricing";
import SupportTheMission from "@/pages/support-the-mission";
import ThreatTrendsPage from "@/pages/threat-trends";
import CyberThreatRadar from "@/pages/cyber-threat-radar";
import AwarenessHub from "@/pages/awareness-hub";
import ReportScam from "@/pages/report-scam";
import Checklists from "@/pages/checklists";
import AIPrompts from "@/pages/ai-prompts";
import AISafety from "@/pages/ai-safety";
import Training from "@/pages/training";
import TrainingPath from "@/pages/training-path";
import TrainingLesson from "@/pages/training-lesson";
import TrainingQuiz from "@/pages/training-quiz";
import DataRemoval from "@/pages/data-removal";
import News from "@/pages/news";
import NewsArticle from "@/pages/news-article";
import CyberHygiene from "@/pages/cyber-hygiene";
import PasswordGenerator from "@/pages/password-generator";
import BreachDashboard from "@/pages/breach-dashboard";
import SearchPage from "@/pages/search";
import ParentGuide from "@/pages/parent-guide";
import SmallBusiness from "@/pages/small-business";
import Educators from "@/pages/educators";
import TravelSafety from "@/pages/travel-safety";
import Accessibility from "@/pages/accessibility";
import Advertise from "@/pages/advertise";
import PartnerDeck from "@/pages/partner-deck";
import FeedbackPage from "@/pages/feedback";
import Experience from "@/pages/experience";
import GcrGuardPricing from "@/pages/gcr-guard-pricing";
const DataShieldPricing = lazy(() => import("@/pages/data-shield-pricing"));
import PrintableGuides from "@/pages/printable-guides";
import QuickAssessment from "@/pages/quick-assessment";
import SafetyScore from "@/pages/safety-score";
import ScamChecker from "@/pages/scam-checker";
import BrowserExtensionPage from "@/pages/browser-extension";
import ScamPage from "@/pages/scam-page";
import TopicHub from "@/pages/topic-hub";
import FAQ from "@/pages/faq";
import GuidesListing from "@/pages/guides";
import GuideDetail from "@/pages/guide-detail";
import AlertsListing from "@/pages/alerts-listing";
import AlertDetail from "@/pages/alert-detail";
import ScamIntelListing from "@/pages/scam-intel-listing";
import ScamIntelDetail from "@/pages/scam-intel-detail";
import ShieldPage from "@/pages/shield";
import ShieldResultsPage from "@/pages/shield-results";
import ShieldNextSteps from "@/pages/shield-next-steps";

const Dashboard = lazy(() => import("@/pages/dashboard"));
const AdminDashboard = lazy(() => import("@/pages/admin/index"));
const AdminUsers = lazy(() => import("@/pages/admin/users"));
const AdminMessages = lazy(() => import("@/pages/admin/messages"));
const AdminSubscribers = lazy(() => import("@/pages/admin/subscribers"));
const AdminScamReports = lazy(() => import("@/pages/admin/scam-reports"));
const AdminChangePassword = lazy(() => import("@/pages/admin/change-password"));
const AdminToolAnalytics = lazy(() => import("@/pages/admin/tool-analytics"));
const AdminScanManagement = lazy(() => import("@/pages/admin/scan-management"));
const AdminSecurity = lazy(() => import("@/pages/admin-security"));
const AdminThreatIntelligence = lazy(() => import("@/pages/admin-threat-intelligence"));
const AdminContentGovernance = lazy(() => import("@/pages/admin-content-governance"));
const AdminCompliance = lazy(() => import("@/pages/admin-compliance"));
const AdminNewsletter = lazy(() => import("@/pages/admin-newsletter"));
const AdminPromptManagement = lazy(() => import("@/pages/admin-prompt-management"));
const AdminAnnouncements = lazy(() => import("@/pages/admin/announcements"));
const AdminTrendingThreats = lazy(() => import("@/pages/admin/trending-threats"));
const AdminFeedback = lazy(() => import("@/pages/admin/feedback"));
const AdminContentManager = lazy(() => import("@/pages/admin/content-manager"));
const Login = lazy(() => import("@/pages/login"));
const Register = lazy(() => import("@/pages/register"));
const ForgotPassword = lazy(() => import("@/pages/forgot-password"));
const ChildSafetyScanner = lazy(() => import("@/pages/child-safety-scanner"));
const CheckoutSuccess = lazy(() => import("@/pages/checkout-success"));
const ExtensionAuth = lazy(() => import("@/pages/extension-auth"));
const Preferences = lazy(() => import("@/pages/preferences"));
const ScanReportPage = lazy(() => import("@/pages/scan-report"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function AppRouter() {
  useAnalytics();

  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/tools" component={Tools} />
        <Route path="/resources" component={Resources} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/emergency-help" component={EmergencyHelp} />
        <Route path="/kids" component={Kids} />
        <Route path="/seniors" component={Seniors} />
        <Route path="/parents" component={Parents} />
        <Route path="/parents/child-safety-scanner" component={ChildSafetyScanner} />
        <Route path="/support" component={SupportPage} />
        <Route path="/security" component={Security} />
        <Route path="/our-mission" component={OurMission} />
        <Route path="/pricing" component={GcrGuardPricing} />
        <Route path="/gcr-guard-pricing" component={GcrGuardPricing} />
        <Route path="/data-shield-pricing" component={DataShieldPricing} />
        <Route path="/extension-auth" component={ExtensionAuth} />
        <Route path="/support-the-mission" component={SupportTheMission} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/threat-trends" component={ThreatTrendsPage} />
        <Route path="/cyber-threat-radar" component={CyberThreatRadar} />
        <Route path="/awareness-hub" component={AwarenessHub} />
        <Route path="/report-scam" component={ReportScam} />
        <Route path="/checklists" component={Checklists} />
        <Route path="/data-removal" component={DataRemoval} />
        <Route path="/ai-prompts" component={AIPrompts} />
        <Route path="/ai-safety" component={AISafety} />
        <Route path="/news" component={News} />
        <Route path="/news/:slug" component={NewsArticle} />
        <Route path="/cyber-hygiene" component={CyberHygiene} />
        <Route path="/password-generator" component={PasswordGenerator} />
        <Route path="/breach-dashboard" component={BreachDashboard} />
        <Route path="/search" component={SearchPage} />
        <Route path="/parent-guide" component={ParentGuide} />
        <Route path="/small-business" component={SmallBusiness} />
        <Route path="/educators" component={Educators} />
        <Route path="/travel-safety" component={TravelSafety} />
        <Route path="/accessibility" component={Accessibility} />
        <Route path="/advertise" component={Advertise} />
        <Route path="/partner-deck" component={PartnerDeck} />
        <Route path="/feedback" component={FeedbackPage} />
        <Route path="/experience" component={Experience} />
        <Route path="/checkout-success" component={CheckoutSuccess} />
        <Route path="/preferences" component={Preferences} />
        <Route path="/printable-guides" component={PrintableGuides} />
        <Route path="/quick-assessment" component={QuickAssessment} />
        <Route path="/safety-score" component={SafetyScore} />
        <Route path="/scam-checker" component={ScamChecker} />
        <Route path="/browser-extension" component={BrowserExtensionPage} />
        <Route path="/report/:shareId" component={ScanReportPage} />
        <Route path="/scams/:scamType" component={ScamPage} />
        <Route path="/topics/:cluster" component={TopicHub} />
        <Route path="/faq" component={FAQ} />
        <Route path="/guides" component={GuidesListing} />
        <Route path="/guides/:slug" component={GuideDetail} />
        <Route path="/alerts" component={AlertsListing} />
        <Route path="/alerts/:slug" component={AlertDetail} />
        <Route path="/scam-intel" component={ScamIntelListing} />
        <Route path="/scam-intel/:slug" component={ScamIntelDetail} />
        <Route path="/shield" component={ShieldPage} />
        <Route path="/shield/results/:scanId" component={ShieldResultsPage} />
        <Route path="/shield/next-steps" component={ShieldNextSteps} />
        <Route path="/training" component={Training} />
        <Route path="/training/:pathId" component={TrainingPath} />
        <Route path="/training/lesson/:lessonId" component={TrainingLesson} />
        <Route path="/training/quiz/:quizId" component={TrainingQuiz} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/users" component={AdminUsers} />
        <Route path="/admin/messages" component={AdminMessages} />
        <Route path="/admin/subscribers" component={AdminSubscribers} />
        <Route path="/admin/scam-reports" component={AdminScamReports} />
        <Route path="/admin/scan-management" component={AdminScanManagement} />
        <Route path="/admin/tool-analytics" component={AdminToolAnalytics} />
        <Route path="/admin/security" component={AdminSecurity} />
        <Route path="/admin/threat-intelligence" component={AdminThreatIntelligence} />
        <Route path="/admin/content-governance" component={AdminContentGovernance} />
        <Route path="/admin/compliance" component={AdminCompliance} />
        <Route path="/admin/newsletter" component={AdminNewsletter} />
        <Route path="/admin/prompt-management" component={AdminPromptManagement} />
        <Route path="/admin/announcements" component={AdminAnnouncements} />
        <Route path="/admin/trending-threats" component={AdminTrendingThreats} />
        <Route path="/admin/feedback" component={AdminFeedback} />
        <Route path="/admin/content" component={AdminContentManager} />
        <Route path="/admin/change-password" component={AdminChangePassword} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
      initGA();
    }

    const handleConsentUpdate = () => {
      if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
        initGA();
      }
    };
    window.addEventListener("cookie-consent-updated", handleConsentUpdate);
    return () => window.removeEventListener("cookie-consent-updated", handleConsentUpdate);
  }, []);

  const recaptchaSiteKey = (!isServer && import.meta.env.VITE_RECAPTCHA_SITE_KEY) || "";

  const appContent = (
    <ThemeProvider>
      <TooltipProvider>
        {!isServer && <ScrollToTop />}
        <AnnouncementBanner />
        <Toaster />
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
        {isClient && (
          <>
            <DeziAssistant />
            <FeedbackWidget />
            <CookieConsent />
          </>
        )}
      </TooltipProvider>
    </ThemeProvider>
  );

  if (isServer) {
    return (
      <QueryClientProvider client={queryClient}>
        {appContent}
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
        {appContent}
      </GoogleReCaptchaProvider>
    </QueryClientProvider>
  );
}

export default App;
