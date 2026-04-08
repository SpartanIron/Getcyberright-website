import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Shield, ShieldCheck, Users, Heart, GraduationCap, Search, Lock, AlertTriangle, FileText, ChevronRight, Sparkles, Trash2, BookOpen, Brain, Zap, Newspaper, CreditCard, Chrome, Radio, Baby, ClipboardCheck, ShieldAlert } from "lucide-react";
import { Link, useLocation } from "@/lib/navigation";
import { isFreeAccessPeriod } from "@shared/models/auth";
import logoImage from "@/assets/logo.webp";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const whoWeHelp = [
  { title: "Parents Hub", description: "Protect your kids and manage family devices safely", href: "/parents", icon: Users, featured: true, color: "text-blue-500" },
  { title: "Kids Safety Hub", description: "Fun, interactive lessons for ages 8 to 16", href: "/kids", icon: Sparkles, featured: true, color: "text-purple-500" },
  { title: "Seniors Hub", description: "Protect against phone scams, fraud, and tech tricks", href: "/seniors", icon: Heart, featured: true, color: "text-rose-500" },
];

const scamGuardNav = [
  { title: "AI Scam Scanner", description: "Check URLs, emails, phone numbers, and more", href: "/tools", icon: Search, badge: "Popular" },
  { title: "Browser Extension", description: "Real-time protection while you browse", href: "/browser-extension", icon: Chrome },
  { title: "Report a Scam", description: "Help protect the community by reporting threats", href: "/report-scam", icon: ShieldAlert },
];

const dataShieldNav = [
  { title: "Data Exposure Scan", description: "Find your personal data across 500+ brokers", href: "/shield", icon: ShieldCheck },
  { title: "Data Removal Center", description: "Identity Shield, Vault & Monitoring tools", href: "/data-removal", icon: Trash2 },
  { title: "Breach Monitor", description: "Get alerted when your data appears in breaches", href: "/breach-dashboard", icon: AlertTriangle },
];

const scamGuardNavFull = [
  ...scamGuardNav,
  { title: "Password Generator", description: "Create strong, unique passwords instantly", href: "/tools?tab=password", icon: Lock },
  { title: "Voice Deepfake Detector", description: "Detect AI-generated voice clones", href: "/tools?tab=voice-clone", icon: Radio },
];

const dataShieldNavFull = [
  ...dataShieldNav,
  { title: "Safety Score Assessment", description: "Check your overall online safety in minutes", href: "/quick-assessment", icon: ClipboardCheck },
  { title: "Cyber Hygiene Checklist", description: "Daily habits to keep your digital life secure", href: "/cyber-hygiene", icon: Shield },
  { title: "Child Safety Scanner", description: "Check if sites and apps are safe for kids", href: "/parents/child-safety-scanner", icon: Baby },
];

const learnItems = [
  { title: "Training Academy", description: "Structured courses with quizzes & certificates", href: "/training", icon: GraduationCap, color: "text-primary", featured: true },
  { title: "Awareness Hub", description: "Visual guides, checklists & safety resources", href: "/awareness-hub", icon: BookOpen, color: "text-teal-500", featured: true },
  { title: "Cyber Threat Radar", description: "Real-time threat monitoring & alerts", href: "/cyber-threat-radar", icon: AlertTriangle, color: "text-red-500", featured: true },
  { title: "AI Safety Guide", description: "Spot deepfakes, AI scams & protect your privacy", href: "/ai-safety", icon: Brain, color: "text-purple-500", featured: true },
  { title: "AI Prompt Library", description: "Ready-to-use AI templates for everyday life", href: "/ai-prompts", icon: Zap, color: "text-amber-500", featured: true },
  { title: "Scam Intelligence", description: "Latest scam trends, tactics & intelligence reports", href: "/scam-intel", icon: Search, color: "text-orange-500", featured: true },
];

const learnTopics = [
  { title: "Cyber Safety Guides", href: "/guides", icon: BookOpen },
  { title: "Phishing & Email Scams", href: "/resources?category=phishing", icon: AlertTriangle },
  { title: "Online Privacy", href: "/resources?category=privacy", icon: Lock },
  { title: "Resource Library", href: "/resources", icon: FileText },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        data-testid="link-skip-navigation"
        onClick={(e) => {
          e.preventDefault();
          const mainContent = document.getElementById('main-content');
          if (mainContent) {
            mainContent.focus();
            mainContent.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        Skip to main content
      </a>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#071A24]/98 backdrop-blur-md border-b border-white/10 shadow-lg"
            : "bg-[#071A24]"
        }`}
        data-testid="header-navigation"
        role="banner"
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5" data-testid="link-logo">
            <img src={logoImage} alt="GetCyberRight" className="w-11 h-11 object-contain" width={44} height={44} loading="lazy" />
            <span className="font-bold text-xl text-white tracking-tight">
              GetCyberRight
            </span>
          </Link>

          <NavigationMenu className="hidden lg:flex" aria-label="Main navigation">
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white/90 hover:text-white data-[state=open]:text-white text-[15px]" data-testid="nav-who-we-help">
                  Who We Help
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[600px] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Find Your Path</h3>
                      <Link href="/training" className="text-sm text-primary flex items-center gap-1 hover:underline">
                        View all training paths <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {whoWeHelp.map((item) => (
                        <NavigationMenuLink asChild key={item.title}>
                          <Link
                            href={item.href}
                            className="flex items-start gap-3 rounded-lg p-3 transition-colors hover-elevate"
                            data-testid={`nav-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <item.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-foreground mb-0.5">
                                {item.title}
                              </div>
                              <p className="text-xs text-muted-foreground leading-snug">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white/90 hover:text-white data-[state=open]:text-white text-[15px]" data-testid="nav-tools">
                  Protection Hub
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[680px] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Protection Hub</h3>
                      <Link href="/tools" className="text-sm text-primary flex items-center gap-1 hover:underline">
                        View all tools <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Shield className="w-4 h-4 text-accent" />
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">GCR Scam Guard</h4>
                        </div>
                        <div className="space-y-1">
                          {scamGuardNav.map((item) => (
                            <NavigationMenuLink asChild key={item.title}>
                              <Link
                                href={item.href}
                                className="flex items-start gap-2.5 rounded-lg p-2.5 transition-colors hover-elevate"
                                data-testid={`nav-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                              >
                                <div className="flex-shrink-0 w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center mt-0.5">
                                  <item.icon className="w-4 h-4 text-accent" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-sm font-medium text-foreground">{item.title}</span>
                                    {item.badge && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-white font-medium">{item.badge}</span>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground leading-snug">{item.description}</p>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <ShieldCheck className="w-4 h-4 text-teal-500" />
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">GCR Data Shield</h4>
                        </div>
                        <div className="space-y-1">
                          {dataShieldNav.map((item) => (
                            <NavigationMenuLink asChild key={item.title}>
                              <Link
                                href={item.href}
                                className="flex items-start gap-2.5 rounded-lg p-2.5 transition-colors hover-elevate"
                                data-testid={`nav-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                              >
                                <div className="flex-shrink-0 w-8 h-8 rounded-md bg-teal-500/10 flex items-center justify-center mt-0.5">
                                  <item.icon className="w-4 h-4 text-teal-500" />
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-foreground">{item.title}</span>
                                  <p className="text-xs text-muted-foreground leading-snug">{item.description}</p>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-muted-foreground">
                        Core tools are free. No signup required to get started.
                      </p>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white/90 hover:text-white data-[state=open]:text-white text-[15px]" data-testid="nav-learn">
                  Learning Hub
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[550px] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Learning Hub</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {learnItems.map((item) => (
                        <NavigationMenuLink asChild key={item.title}>
                          <Link
                            href={item.href}
                            className="flex flex-col items-center gap-2 rounded-lg p-4 text-center transition-colors hover-elevate"
                            data-testid={`nav-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                          >
                            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                              <item.icon className={`w-6 h-6 ${item.color}`} />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {item.title}
                              </div>
                              <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                    <div className="pt-4 border-t">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Browse by Topic</h4>
                      <div className="flex flex-wrap gap-2">
                        {learnTopics.map((item) => (
                          <NavigationMenuLink asChild key={item.title}>
                            <Link
                              href={item.href}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm bg-muted/50 text-foreground transition-colors hover-elevate"
                              data-testid={`nav-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                            >
                              <item.icon className="w-3.5 h-3.5" />
                              {item.title}
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/news"
                    className={`group inline-flex h-9 w-max items-center justify-center gap-1.5 rounded-md bg-transparent px-4 py-2 text-[15px] font-medium transition-colors focus:outline-none hover-elevate text-white/90 hover:text-white ${location === '/news' || location.startsWith('/news/') ? 'text-primary' : ''}`}
                    data-testid="nav-news"
                  >
                    <Newspaper className="w-4 h-4" />
                    News
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {!isFreeAccessPeriod() && (
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white/90 hover:text-white data-[state=open]:text-white text-[15px]" data-testid="nav-pricing">
                  Pricing
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] p-6">
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">Plans & Pricing</h3>
                    <div className="space-y-2">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/pricing"
                          className="flex items-start gap-3 rounded-lg p-3 transition-colors hover-elevate"
                          data-testid="nav-link-bundle-pricing"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-sm font-medium text-foreground">Bundle Plans</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-white font-medium">Best Value</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-snug">
                              Scam Guard + Data Shield together. Save up to 23%.
                            </p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/gcr-guard-pricing"
                          className="flex items-start gap-3 rounded-lg p-3 transition-colors hover-elevate"
                          data-testid="nav-link-guard-pricing"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground mb-0.5">GCR Scam Guard</div>
                            <p className="text-xs text-muted-foreground leading-snug">
                              Real-time scam detection & browser protection.
                            </p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/data-shield-pricing"
                          className="flex items-start gap-3 rounded-lg p-3 transition-colors hover-elevate"
                          data-testid="nav-link-shield-pricing"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground mb-0.5">GCR Data Shield</div>
                            <p className="text-xs text-muted-foreground leading-snug">
                              Personal data removal from 500+ broker sites.
                            </p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              )}

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/about"
                    className={`group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-[15px] font-medium transition-colors focus:outline-none hover-elevate text-white/90 hover:text-white ${location === '/about' ? 'text-primary' : ''}`}
                    data-testid="nav-about"
                  >
                    About Us
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="hidden lg:flex items-center gap-3 text-white">
            <ThemeToggle />
            <Link href="/tools">
              <Button variant="default" size="default" data-testid="button-get-protection">
                Check If It's a Scam
              </Button>
            </Link>
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation menu" data-testid="button-mobile-menu" className="lg:hidden text-white hover:bg-white/10">
                <Menu className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto" aria-label="Mobile navigation menu">
              <nav className="flex flex-col gap-4 mt-8" aria-label="Mobile navigation">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Who We Help</h4>
                  </div>
                  <p className="text-xs text-muted-foreground -mt-1 ml-6">Guides, resources & training</p>
                  {whoWeHelp.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="flex items-center gap-3 py-2 text-foreground transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid={`mobile-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Protection Hub</h4>
                  </div>
                  <p className="text-xs text-muted-foreground -mt-1 ml-6">Core tools are free</p>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-3 ml-6">GCR Scam Guard</p>
                  {scamGuardNavFull.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="flex items-center gap-3 py-2 text-foreground transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid={`mobile-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      <item.icon className="w-4 h-4 text-accent" />
                      {item.title}
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-white font-medium">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-3 ml-6">GCR Data Shield</p>
                  {dataShieldNavFull.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="flex items-center gap-3 py-2 text-foreground transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid={`mobile-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      <item.icon className="w-4 h-4 text-teal-500" />
                      {item.title}
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Learning Hub</h4>
                  </div>
                  {learnItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="flex items-center gap-3 py-2 text-foreground transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid={`mobile-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-border" />

                <Link
                  href="/news"
                  className="flex items-center gap-3 py-2 text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-news"
                >
                  <Newspaper className="w-4 h-4 text-teal-500" />
                  <span className="font-medium">News</span>
                </Link>

                {!isFreeAccessPeriod() && (
                <>
                <div className="h-px bg-border" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Pricing</h4>
                  </div>
                  <Link
                    href="/pricing"
                    className="flex items-center gap-3 py-2 text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="mobile-link-bundle-pricing"
                  >
                    <CreditCard className="w-4 h-4 text-primary" />
                    <span className="font-medium">Bundle Plans</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-white font-medium">Best Value</span>
                  </Link>
                  <Link
                    href="/gcr-guard-pricing"
                    className="flex items-center gap-3 py-2 text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="mobile-link-guard-pricing"
                  >
                    <Shield className="w-4 h-4 text-accent" />
                    <span className="font-medium">GCR Scam Guard</span>
                  </Link>
                  <Link
                    href="/data-shield-pricing"
                    className="flex items-center gap-3 py-2 text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="mobile-link-shield-pricing"
                  >
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    <span className="font-medium">GCR Data Shield</span>
                  </Link>
                </div>
                </>
                )}

                <div className="h-px bg-border" />

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="mobile-link-about"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="mobile-link-contact"
                  >
                    Contact
                  </Link>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-center justify-between pt-4">
                  <ThemeToggle />
                  <Link href="/tools" onClick={() => setMobileMenuOpen(false)}>
                    <Button data-testid="mobile-button-get-protection">
                      Check If It's a Scam
                    </Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    </>
  );
}
