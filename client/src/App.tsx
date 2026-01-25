import { Switch, Route, useLocation } from "wouter";
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
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    pageview(location);
  }, [location]);
  
  return null;
}

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
  );
}

function App() {
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
    </QueryClientProvider>
  );
}

export default App;
