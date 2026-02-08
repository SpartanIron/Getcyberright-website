import { Switch, Route, useLocation } from "wouter";
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
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    pageview(location);
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
  );
}

function App() {
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
    </QueryClientProvider>
  );
}

export default App;
