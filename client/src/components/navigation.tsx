import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Shield, Users, Heart, Briefcase, GraduationCap, Search, Lock, AlertTriangle, FileText, ChevronRight, ExternalLink, Video, ClipboardCheck, Sparkles, Brain, Trash2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import logoImage from "@/assets/logo.png";
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
  { title: "Parents Hub", description: "Protect your kids and manage family devices safely", href: "/parents", icon: Users, featured: true, color: "text-blue-500", trainingHref: "/training/parents" },
  { title: "Kids Safety Hub", description: "Fun, interactive lessons for ages 8 to 16", href: "/kids", icon: Sparkles, featured: true, color: "text-purple-500", trainingHref: "/training/kids" },
  { title: "Seniors Hub", description: "Protect against phone scams, fraud, and tech tricks", href: "/seniors", icon: Heart, featured: true, color: "text-rose-500", trainingHref: "/training/seniors" },
  { title: "Educators Hub", description: "Classroom resources for teaching digital citizenship", href: "/educators", icon: GraduationCap, featured: true, color: "text-emerald-500", trainingHref: "/training/educators" },
  { title: "Small Business", description: "Enterprise-grade protection made accessible", href: "/small-business", icon: Briefcase, featured: true, color: "text-amber-500", trainingHref: "/training/business" },
];

const freeTools = [
  { title: "Scam Checker", description: "Check URLs, emails, phone numbers, and SSL certificates", href: "/tools", icon: Search, badge: "Popular" },
  { title: "AI & Cyber Safety", description: "Protect yourself from AI-powered threats", href: "/ai-safety", icon: Brain, badge: "New" },
  { title: "Breach Checker", description: "Check if your email was exposed in a data breach", href: "/tools", icon: AlertTriangle },
  { title: "Password Generator", description: "Create strong, secure passwords instantly", href: "/tools", icon: Lock },
  { title: "Data Broker Removal", description: "Remove your info from 150+ data brokers", href: "/data-removal", icon: Trash2, badge: "New" },
];

const learnTopics = [
  { title: "Phishing & Email Scams", description: "Recognize and avoid phishing attacks", href: "/resources?category=phishing", icon: AlertTriangle },
  { title: "Online Privacy", description: "Protect your personal information", href: "/resources?category=privacy", icon: Lock },
  { title: "Password Security", description: "Best practices for strong passwords", href: "/resources?category=passwords", icon: Shield },
];

const quickLinks = [
  { title: "All Resources", description: "Browse our complete library", href: "/resources", icon: FileText },
  { title: "Emergency Help", description: "What to do if you've been scammed", href: "/emergency-help", icon: Shield },
  { title: "Checklists", description: "Printable security checklists", href: "/checklists", icon: ClipboardCheck },
];

const trainingOptions = [
  { title: "Training for Kids", description: "Fun games and lessons about staying safe online", href: "/training/kids", icon: Sparkles, color: "text-purple-500" },
  { title: "Training for Parents", description: "Learn how to protect your family online", href: "/training/parents", icon: Users, color: "text-blue-500" },
  { title: "Training for Seniors", description: "Simple steps to avoid scams and stay safe", href: "/training/seniors", icon: Heart, color: "text-rose-500" },
  { title: "Training for Educators", description: "Classroom lessons and teaching materials", href: "/training/educators", icon: GraduationCap, color: "text-emerald-500" },
  { title: "Training for Businesses", description: "Employee security awareness programs", href: "/training/business", icon: Briefcase, color: "text-amber-500" },
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
            ? "bg-background/95 backdrop-blur-md border-b shadow-sm"
            : "bg-background"
        }`}
        data-testid="header-navigation"
        role="banner"
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
            <img src={logoImage} alt="GetCyberRight" className="w-10 h-10 object-contain" />
            <span className="font-semibold text-lg text-foreground">
              GetCyberRight
            </span>
          </Link>

          <NavigationMenu className="hidden lg:flex" aria-label="Main navigation">
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent" data-testid="nav-who-we-help">
                  Who We Help
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[600px] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Find Your Path</h3>
                      <Link href="/solutions" className="text-sm text-primary flex items-center gap-1 hover:underline">
                        View all solutions <ChevronRight className="w-3 h-3" />
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
                <NavigationMenuTrigger className="bg-transparent" data-testid="nav-free-tools">
                  Free Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[500px] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Security Tools</h3>
                      <Link href="/tools" className="text-sm text-primary flex items-center gap-1 hover:underline">
                        View all tools <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {freeTools.map((item) => (
                        <NavigationMenuLink asChild key={item.title}>
                          <Link
                            href={item.href}
                            className="flex items-start gap-3 rounded-lg p-3 transition-colors hover-elevate"
                            data-testid={`nav-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                              <item.icon className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-sm font-medium text-foreground">
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-white font-medium">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground leading-snug">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-muted-foreground">
                        Free tools available. No signup required.
                      </p>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent" data-testid="nav-training">
                  Training
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[500px] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Training Academy</h3>
                      <Link href="/training" className="text-sm text-primary flex items-center gap-1 hover:underline">
                        View all courses <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="space-y-2">
                      {trainingOptions.map((item) => (
                        <NavigationMenuLink asChild key={item.title}>
                          <Link
                            href={item.href}
                            className="flex items-start gap-3 rounded-lg p-3 transition-colors hover-elevate"
                            data-testid={`nav-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                          >
                            <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center`}>
                              <item.icon className={`w-5 h-5 ${item.color}`} />
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
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-muted-foreground">
                        Earn certificates and track your progress. Free to start.
                      </p>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent" data-testid="nav-learn">
                  Learn
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[500px] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Learn & Resources</h3>
                      <Link href="/resources" className="text-sm text-primary flex items-center gap-1 hover:underline">
                        Browse all <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {learnTopics.map((item) => (
                        <NavigationMenuLink asChild key={item.title}>
                          <Link
                            href={item.href}
                            className="flex items-start gap-3 rounded-lg p-3 transition-colors hover-elevate"
                            data-testid={`nav-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                          >
                            <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                              <item.icon className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {item.title}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                    <div className="pt-4 border-t">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Quick Links</h4>
                      <div className="flex flex-wrap gap-2">
                        {quickLinks.map((item) => (
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
                    href="/about"
                    className={`group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors focus:outline-none hover-elevate ${location === '/about' ? 'text-primary' : ''}`}
                    data-testid="nav-about"
                  >
                    About Us
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/events"
                    className={`group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors focus:outline-none hover-elevate ${location === '/events' ? 'text-primary' : ''}`}
                    data-testid="nav-events"
                  >
                    Events
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/contact"
                    className={`group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors focus:outline-none hover-elevate ${location === '/contact' ? 'text-primary' : ''}`}
                    data-testid="nav-contact"
                  >
                    Contact
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <Link href="/tools">
              <Button variant="default" size="default" data-testid="button-get-protection">
                Check If It's a Scam
              </Button>
            </Link>
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Open navigation menu" data-testid="button-mobile-menu">
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
                    <div key={item.title} className="space-y-1">
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 py-2 text-foreground transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid={`mobile-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                      >
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                      <Link
                        href={item.trainingHref}
                        className="flex items-center gap-2 py-1.5 pl-7 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid={`mobile-link-training-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Take the Course</span>
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Free Tools</h4>
                  </div>
                  <p className="text-xs text-muted-foreground -mt-1 ml-6">No signup required</p>
                  {freeTools.map((item) => (
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
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Learn</h4>
                  </div>
                  <p className="text-xs text-muted-foreground -mt-1 ml-6">Articles & resources</p>
                  {learnTopics.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="flex items-center gap-3 py-2 text-foreground transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid={`mobile-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      <item.icon className="w-4 h-4 text-primary" />
                      {item.title}
                    </Link>
                  ))}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {quickLinks.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-muted/50 text-foreground"
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid={`mobile-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                      >
                        <item.icon className="w-3 h-3" />
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-border" />

                <Link
                  href="/training"
                  className="flex items-center gap-3 py-3 px-3 -mx-3 rounded-lg bg-primary/10 text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-training-academy"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="font-semibold">Training Academy</span>
                    <p className="text-xs text-muted-foreground">All courses & certificates</p>
                  </div>
                </Link>

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
                    href="/events"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="mobile-link-events"
                  >
                    Events
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
