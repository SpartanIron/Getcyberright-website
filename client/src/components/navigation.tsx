import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Shield, Users, Heart, Briefcase, GraduationCap, Search, Lock, AlertTriangle, FileText, ChevronRight, Sparkles, Brain, Trash2, BookOpen, ClipboardCheck, Radio } from "lucide-react";
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

const toolsNav = [
  { title: "Security Scanner", description: "Check URLs, emails, phone numbers, and more", href: "/tools", icon: Search, badge: "Popular" },
  { title: "Data Broker Removal", description: "Remove your info from 500+ data brokers", href: "/data-removal", icon: Trash2, badge: "Premium" },
  { title: "Safety Toolkit", description: "Password generator, family codewords & voice detector", href: "/tools?tab=safety-toolkit", icon: Shield },
];

const learnItems = [
  { title: "Training Academy", description: "Structured courses with quizzes & certificates", href: "/training", icon: GraduationCap, color: "text-primary", featured: true },
  { title: "Resource Library", description: "Guides, articles, checklists & videos", href: "/resources", icon: BookOpen, color: "text-accent", featured: true },
  { title: "Emergency Help", description: "What to do if you've been scammed", href: "/emergency-help", icon: AlertTriangle, color: "text-red-500", featured: true },
];

const learnTopics = [
  { title: "Phishing & Email Scams", href: "/resources?category=phishing", icon: AlertTriangle },
  { title: "Online Privacy", href: "/resources?category=privacy", icon: Lock },
  { title: "Password Security", href: "/resources?category=passwords", icon: Shield },
  { title: "AI & Cyber Safety", href: "/ai-safety", icon: Brain },
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
                <NavigationMenuTrigger className="bg-transparent" data-testid="nav-tools">
                  Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[500px] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Security Tools</h3>
                      <Link href="/tools" className="text-sm text-primary flex items-center gap-1 hover:underline">
                        View all tools <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="space-y-2">
                      {toolsNav.map((item) => (
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
                <NavigationMenuTrigger className="bg-transparent" data-testid="nav-learn">
                  Learn
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[550px] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Learn & Train</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-5">
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
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Tools</h4>
                  </div>
                  <p className="text-xs text-muted-foreground -mt-1 ml-6">No signup required</p>
                  {toolsNav.map((item) => (
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
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Learn</h4>
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
                  <div className="flex flex-wrap gap-2 pt-2">
                    {learnTopics.map((item) => (
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
