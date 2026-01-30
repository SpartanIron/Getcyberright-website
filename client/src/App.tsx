import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { DeziAssistant } from "@/components/dezi-assistant";
import { WelcomeOverlay } from "@/components/welcome-overlay";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Solutions from "@/pages/solutions";
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
import Educators from "@/pages/educators";
import SmallBusiness from "@/pages/small-business";
import Support from "@/pages/support";
import Partnerships from "@/pages/partnerships";
import Advertising from "@/pages/advertising";
import Security from "@/pages/security";
import Events from "@/pages/events";
import Pricing from "@/pages/pricing";
import Dashboard from "@/pages/dashboard";
import CheckoutSuccess from "@/pages/checkout-success";
import ThreatTrendsPage from "@/pages/threat-trends";
import ReportScam from "@/pages/report-scam";
import Checklists from "@/pages/checklists";
import AdminDashboard from "@/pages/admin/index";
import AdminUsers from "@/pages/admin/users";
import AdminMessages from "@/pages/admin/messages";
import AdminSubscribers from "@/pages/admin/subscribers";
import AdminScamReports from "@/pages/admin/scam-reports";
import Login from "@/pages/login";
import Register from "@/pages/register";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/solutions" component={Solutions} />
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
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/messages" component={AdminMessages} />
      <Route path="/admin/subscribers" component={AdminSubscribers} />
      <Route path="/admin/scam-reports" component={AdminScamReports} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <ScrollToTop />
          <Toaster />
          <WelcomeOverlay />
          <Router />
          <DeziAssistant />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
