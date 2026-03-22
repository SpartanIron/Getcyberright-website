import { Switch, Route, useLocation } from "wouter";
import { useEffect, lazy, Suspense } from "react";
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

// Critical pages loaded immediately
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

// Lazy-loaded pages for better initial bundle size
const Tools = lazy(() => import("@/pages/tools"));
const Resources = lazy(() => import("@/pages/resources"));
const About = lazy(() => import("@/pages/about"));
const Contact = lazy(() => import("@/pages/contact"));
const Privacy = lazy(() => import("@/pages/privacy"));
const Terms = lazy(() => import("@/pages/terms"));
const EmergencyHelp = lazy(() => import("@/pages/emergency-help"));
const Kids = lazy(() => import("@/pages/kids"));
const Seniors = lazy(() => import("@/pages/seniors"));
const Parents = lazy(() => import("@/pages/parents"));
const Support = lazy(() => import("@/pages/support"));
const Security = lazy(() => import("@/pages/security"));
const OurMission = lazy(() => import("@/pages/pricing"));
const SupportTheMission = lazy(() => import("@/pages/support-the-mission"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const ThreatTrendsPage = lazy(() => import("@/pages/threat-trends"));
const CyberThreatRadar = lazy(() => import("@/pages/cyber-threat-radar"));
const AwarenessHub = lazy(() => import("@/pages/awareness-hub"));
const ReportScam = lazy(() => import("@/pages/report-scam"));
const Checklists = lazy(() => import("@/pages/checklists"));
const AIPrompts = lazy(() => import("@/pages/ai-prompts"));
const AISafety = lazy(() => import("@/pages/ai-safety"));
const Training = lazy(() => import("@/pages/training"));
const TrainingPath = lazy(() => import("@/pages/training-path"));
const TrainingLesson = lazy(() => import("@/pages/training-lesson"));
const TrainingQuiz = lazy(() => import("@/pages/training-quiz"));
const AdminDashboard = lazy(() => import("@/pages/admin/index"));
const AdminUsers = lazy(() => import("@/pages/admin/users"));
const AdminMessages = lazy(() => import("@/pages/admin/messages"));
const AdminSubscribers = lazy(() => import("@/pages/admin/subscribers"));
const AdminScamReports = lazy(() => import("@/pages/admin/scam-reports"));
const AdminChangePassword = lazy(() => import("@/pages/admin/change-password"));
const AdminToolAnalytics = lazy(() => import("@/pages/admin/tool-analytics"));
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
const DataRemoval = lazy(() => import("@/pages/data-removal"));
const News = lazy(() => import("@/pages/news"));
const CyberHygiene = lazy(() => import("@/pages/cyber-hygiene"));
const PasswordGenerator = lazy(() => import("@/pages/password-generator"));
const BreachDashboard = lazy(() => import("@/pages/breach-dashboard"));
const Search = lazy(() => import("@/pages/search"));
const ParentGuide = lazy(() => import("@/pages/parent-guide"));
const SmallBusiness = lazy(() => import("@/pages/small-business"));
const Educators = lazy(() => import("@/pages/educators"));
const TravelSafety = lazy(() => import("@/pages/travel-safety"));
const Accessibility = lazy(() => import("@/pages/accessibility"));
const Advertise = lazy(() => import("@/pages/advertise"));
const PartnerDeck = lazy(() => import("@/pages/partner-deck"));
const Feedback = lazy(() => import("@/pages/feedback"));
const Experience = lazy(() => import("@/pages/experience"));
const CheckoutSuccess = lazy(() => import("@/pages/checkout-success"));
const GcrGuardPricing = lazy(() => import("@/pages/gcr-guard-pricing"));
const ExtensionAuth = lazy(() => import("@/pages/extension-auth"));
const Preferences = lazy(() => import("@/pages/preferences"));
const PrintableGuides = lazy(() => import("@/pages/printable-guides"));
const QuickAssessment = lazy(() => import("@/pages/quick-assessment"));
const SafetyScore = lazy(() => import("@/pages/safety-score"));
const ScamChecker = lazy(() => import("@/pages/scam-checker"));
const ScanReportPage = lazy(() => import("@/pages/scan-report"));
const BrowserExtensionPage = lazy(() => import("@/pages/browser-extension"));
const ScamPage = lazy(() => import("@/pages/scam-page"));
const TopicHub = lazy(() => import("@/pages/topic-hub"));
const FAQ = lazy(() => import("@/pages/faq"));
const GuidesListing = lazy(() => import("@/pages/guides"));
const GuideDetail = lazy(() => import("@/pages/guide-detail"));
const AlertsListing = lazy(() => import("@/pages/alerts-listing"));
const AlertDetail = lazy(() => import("@/pages/alert-detail"));
const ScamIntelListing = lazy(() => import("@/pages/scam-intel-listing"));
const ScamIntelDetail = lazy(() => import("@/pages/scam-intel-detail"));

// Loading fallback component
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

function Router() {
  // Track page views when routes change
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
        <Route path="/support" component={Support} />
        <Route path="/security" component={Security} />
        <Route path="/our-mission" component={OurMission} />
        <Route path="/pricing" component={GcrGuardPricing} />
        <Route path="/gcr-guard-pricing" component={GcrGuardPricing} />
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
        <Route path="/cyber-hygiene" component={CyberHygiene} />
        <Route path="/password-generator" component={PasswordGenerator} />
        <Route path="/breach-dashboard" component={BreachDashboard} />
        <Route path="/search" component={Search} />
        <Route path="/parent-guide" component={ParentGuide} />
        <Route path="/small-business" component={SmallBusiness} />
        <Route path="/educators" component={Educators} />
        <Route path="/travel-safety" component={TravelSafety} />
        <Route path="/accessibility" component={Accessibility} />
        <Route path="/advertise" component={Advertise} />
        <Route path="/partner-deck" component={PartnerDeck} />
        <Route path="/feedback" component={Feedback} />
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
        <Route path="/training" component={Training} />
        <Route path="/training/:pathId" component={TrainingPath} />
        <Route path="/training/lesson/:lessonId" component={TrainingLesson} />
        <Route path="/training/quiz/:quizId" component={TrainingQuiz} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/users" component={AdminUsers} />
        <Route path="/admin/messages" component={AdminMessages} />
        <Route path="/admin/subscribers" component={AdminSubscribers} />
        <Route path="/admin/scam-reports" component={AdminScamReports} />
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
  useEffect(() => {
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

  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
        <ThemeProvider>
          <TooltipProvider>
            <ScrollToTop />
            <AnnouncementBanner />
            <Toaster />
            <ErrorBoundary>
              <Router />
            </ErrorBoundary>
            <DeziAssistant />
            <FeedbackWidget />
            <CookieConsent />
          </TooltipProvider>
        </ThemeProvider>
      </GoogleReCaptchaProvider>
    </QueryClientProvider>
  );
}

export default App;
