import { Switch, Route, useLocation } from "wouter";
<<<<<<< HEAD
import { useEffect, lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { DeziAssistant } from "@/components/dezi-assistant";
import { WelcomeOverlay } from "@/components/welcome-overlay";
import { ErrorBoundary } from "@/components/error-boundary";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
import { Loader2 } from "lucide-react";

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
const Educators = lazy(() => import("@/pages/educators"));
const SmallBusiness = lazy(() => import("@/pages/small-business"));
const Support = lazy(() => import("@/pages/support"));
const Partnerships = lazy(() => import("@/pages/partnerships"));
const Advertising = lazy(() => import("@/pages/advertising"));
const Security = lazy(() => import("@/pages/security"));
const Events = lazy(() => import("@/pages/events"));
const Pricing = lazy(() => import("@/pages/pricing"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const CheckoutSuccess = lazy(() => import("@/pages/checkout-success"));
const ThreatTrendsPage = lazy(() => import("@/pages/threat-trends"));
const ReportScam = lazy(() => import("@/pages/report-scam"));
const Checklists = lazy(() => import("@/pages/checklists"));
const AISafety = lazy(() => import("@/pages/ai-safety"));
const Training = lazy(() => import("@/pages/training"));
const TrainingAudience = lazy(() => import("@/pages/training-audience"));
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
const Login = lazy(() => import("@/pages/login"));
const Register = lazy(() => import("@/pages/register"));
const ForgotPassword = lazy(() => import("@/pages/forgot-password"));
const ChildSafetyScanner = lazy(() => import("@/pages/child-safety-scanner"));
const DataRemoval = lazy(() => import("@/pages/data-removal"));

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
=======
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { pageview } from "@/lib/analytics";
import { useReferralTracking } from "@/hooks/use-referral";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';
import Home from "@/pages/home";
import News from "@/pages/news";
import LiveFeed from "@/pages/live-feed";
import Resources from "@/pages/resources";
import Educate from "@/pages/educate";
import Equip from "@/pages/equip";
import Protect from "@/pages/protect";

import CyberAwareness from "@/pages/cyber-awareness";
import CyberHygiene from "@/pages/cyber-hygiene";
import ThreatIntelligence from "@/pages/threat-intelligence";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import Contact from "@/pages/contact";
import CheatSheets from "@/pages/resources/cheat-sheets";
import Glossary from "@/pages/resources/glossary";
import QuickAssessmentPage from "@/pages/quick-assessment";
import About from "@/pages/about";
import YouthSafety from "@/pages/youth-safety";
import SeniorSafety from "@/pages/senior-safety";
import ParentGuide from "@/pages/parent-guide";
import ScamCheckerPage from "@/pages/scam-checker";
import PasswordGeneratorPage from "@/pages/password-generator";
import BreachDashboard from "@/pages/breach-dashboard";

import ArticleDetail from "@/pages/article";
import Feedback from "@/pages/feedback";
import Admin from "@/pages/admin";
import EmergencyHelp from "@/pages/emergency-help";
import TravelSafety from "@/pages/travel-safety";
import PrintableGuides from "@/pages/printable-guides";
import Advertise from "@/pages/advertise";
import Impact from "@/pages/impact";
import Preferences from "@/pages/preferences";
import SafetyScore from "@/pages/safety-score";
import LearningPath from "@/pages/learning-path";
import FAQ from "@/pages/faq";
import AccessibilityPage from "@/pages/accessibility";
import SearchPage from "@/pages/search";
import Dashboard from "@/pages/dashboard";
import ReportScam from "@/pages/report-scam";
import StartHere from "@/pages/start-here";
import ThreatTrends from "@/pages/threat-trends";
import PartnerDeck from "@/pages/partner-deck";
import Tools from "@/pages/tools";
import NotFound from "@/pages/not-found";
import EmbedWidget from "@/pages/embed-widget";
import SuccessStories from "@/pages/success-stories";
import { SafetyChat } from "@/components/safety-chat";

function PageViewTracker() {
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
<<<<<<< HEAD
=======
    pageview(location);
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
  }, [location]);
  
  return null;
}

<<<<<<< HEAD
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
        <Route path="/educators" component={Educators} />
        <Route path="/small-business" component={SmallBusiness} />
        <Route path="/support" component={Support} />
        <Route path="/partnerships" component={Partnerships} />
        <Route path="/advertising" component={Advertising} />
        <Route path="/security" component={Security} />
        <Route path="/events" component={Events} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/checkout/success" component={CheckoutSuccess} />
        <Route path="/threat-trends" component={ThreatTrendsPage} />
        <Route path="/report-scam" component={ReportScam} />
        <Route path="/checklists" component={Checklists} />
        <Route path="/ai-safety" component={AISafety} />
        <Route path="/data-removal" component={DataRemoval} />
        <Route path="/training" component={Training} />
        <Route path="/training/kids" component={TrainingAudience} />
        <Route path="/training/parents" component={TrainingAudience} />
        <Route path="/training/seniors" component={TrainingAudience} />
        <Route path="/training/educators" component={TrainingAudience} />
        <Route path="/training/business" component={TrainingAudience} />
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
        <Route path="/admin/change-password" component={AdminChangePassword} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
=======
function SkipToContent() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a 
      href="#main-content" 
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-teal-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/news" component={News} />
      <Route path="/live-feed" component={LiveFeed} />
      <Route path="/resources" component={Resources} />
      <Route path="/educate" component={Educate} />
      <Route path="/equip" component={Equip} />
      <Route path="/protect" component={Protect} />

      <Route path="/cyber-awareness" component={CyberAwareness} />
      <Route path="/cyber-hygiene" component={CyberHygiene} />
      <Route path="/threat-intelligence" component={ThreatIntelligence} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/contact" component={Contact} />
      <Route path="/resources/cheat-sheets" component={CheatSheets} />
      <Route path="/resources/glossary" component={Glossary} />
      <Route path="/quick-assessment" component={QuickAssessmentPage} />
      <Route path="/about" component={About} />
      <Route path="/youth-safety" component={YouthSafety} />
      <Route path="/senior-safety" component={SeniorSafety} />
      <Route path="/parent-guide" component={ParentGuide} />
      <Route path="/scam-checker" component={ScamCheckerPage} />
      <Route path="/password-generator" component={PasswordGeneratorPage} />
      <Route path="/tools/password-generator" component={PasswordGeneratorPage} />
      <Route path="/breach-dashboard" component={BreachDashboard} />
      <Route path="/emergency-help" component={EmergencyHelp} />
      <Route path="/travel-safety" component={TravelSafety} />
      <Route path="/printable-guides" component={PrintableGuides} />
      <Route path="/advertise" component={Advertise} />
      <Route path="/impact" component={Impact} />
      <Route path="/preferences" component={Preferences} />
      <Route path="/safety-score" component={SafetyScore} />
      <Route path="/learning-path" component={LearningPath} />
      <Route path="/faq" component={FAQ} />
      <Route path="/accessibility" component={AccessibilityPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/report-scam" component={ReportScam} />
      <Route path="/start-here" component={StartHere} />
      <Route path="/threat-trends" component={ThreatTrends} />
      <Route path="/partner-deck" component={PartnerDeck} />
      <Route path="/tools" component={Tools} />
      <Route path="/embed/url-checker" component={EmbedWidget} />
      <Route path="/success-stories" component={SuccessStories} />

      <Route path="/article/:id" component={ArticleDetail} />
      <Route path="/feedback" component={Feedback} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isEmbedRoute = location.startsWith('/embed/');
  
  useReferralTracking();

  if (isEmbedRoute) {
    return (
      <Switch>
        <Route path="/embed/url-checker" component={EmbedWidget} />
      </Switch>
    );
  }

  return (
    <>
      <SkipToContent />
      <PageViewTracker />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
      <SafetyChat />
    </>
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
  );
}

function App() {
<<<<<<< HEAD
  // Initialize Google Analytics when app loads
  useEffect(() => {
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing Google Analytics Measurement ID');
    } else {
      initGA();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <ScrollToTop />
          <Toaster />
          <WelcomeOverlay />
          <ErrorBoundary>
            <Router />
          </ErrorBoundary>
          <DeziAssistant />
        </TooltipProvider>
      </ThemeProvider>
=======
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleReCaptchaProvider
        reCaptchaKey={RECAPTCHA_SITE_KEY}
        scriptProps={{
          async: true,
          defer: true,
          appendTo: 'head',
        }}
      >
        <ThemeProvider defaultTheme="light" storageKey="getcyberright-theme">
          <TooltipProvider>
            <AppContent />
          </TooltipProvider>
        </ThemeProvider>
      </GoogleReCaptchaProvider>
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
    </QueryClientProvider>
  );
}

export default App;
