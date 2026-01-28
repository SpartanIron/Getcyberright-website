import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Shield, Users, Heart, Briefcase, GraduationCap, Search, Lock, AlertTriangle, FileText, ChevronRight, ExternalLink, Video, ClipboardCheck, Sparkles } from "lucide-react";
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
  { title: "Parents Hub", description: "Protect your kids and manage family devices safely", href: "/solutions#families", icon: Users },
  { title: "Kids Safety Hub", description: "Fun, interactive lessons for ages 8 to 16", href: "/kids", icon: Sparkles, featured: true },
  { title: "Seniors Hub", description: "Protect against phone scams, fraud, and tech tricks", href: "/solutions#seniors", icon: Heart },
  { title: "Educators Hub", description: "Classroom resources for teaching digital citizenship", href: "/solutions#educators", icon: GraduationCap },
  { title: "Small Business", description: "Enterprise-grade protection made accessible", href: "/solutions#business", icon: Briefcase },
];

const freeTools = [
  { title: "Scam Checker", description: "Check URLs, emails, phone numbers for scams", href: "/tools", icon: Search, badge: "Popular" },
  { title: "Breach Checker", description: "Check if your email was exposed in a data breach", href: "/tools", icon: AlertTriangle },
  { title: "Password Generator", description: "Create strong, secure passwords instantly", href: "/tools", icon: Lock },
  { title: "Threat Trends", description: "Global scam statistics and trends", href: "/tools", icon: Shield },
];

const learnTopics = [
  { title: "Phishing & Email Scams", description: "Recognize and avoid phishing attacks", href: "/resources?category=phishing" },
  { title: "Online Privacy", description: "Protect your personal information", href: "/resources?category=privacy" },
  { title: "Password & Account Security", description: "Best practices for strong passwords", href: "/resources?category=passwords" },
  { title: "Senior Safety", description: "Protection for older adults", href: "/resources?category=seniors" },
  { title: "Family Online Safety", description: "Keep your whole family protected", href: "/resources?category=family" },
  { title: "Small Business Security", description: "Protect your business from threats", href: "/resources?category=business" },
];

const resourceTypes = [
  { title: "Security Guides", description: "Step-by-step protection tutorials", href: "/resources?type=guide", icon: FileText },
  { title: "Video Training", description: "Watch and learn at your own pace", href: "/resources?type=video", icon: Video },
  { title: "Checklists", description: "Printable security checklists", href: "/resources?type=checklist", icon: ClipboardCheck },
  { title: "Emergency Help", description: "What to do if you've been scammed", href: "/emergency-help", icon: Shield },
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
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b shadow-sm"
          : "bg-background"
      }`}
      data-testid="header-navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
            <img src={logoImage} alt="GetCyberRight" className="w-10 h-10 object-contain" />
            <span className="font-semibold text-lg text-foreground">
              GetCyberRight
            </span>
          </Link>

          <NavigationMenu className="hidden lg:flex">
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
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
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
                        All tools are 100% free. No signup required.
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
                  <div className="w-[700px] p-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-2">
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">Core Safety Topics</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {learnTopics.map((item) => (
                            <NavigationMenuLink asChild key={item.title}>
                              <Link
                                href={item.href}
                                className="block rounded-md p-2 transition-colors hover-elevate"
                                data-testid={`nav-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                              >
                                <div className="text-sm font-medium text-foreground">
                                  {item.title}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </div>
                      <div className="border-l pl-6">
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">Resource Types</h3>
                        <div className="space-y-2">
                          {resourceTypes.map((item) => (
                            <NavigationMenuLink asChild key={item.title}>
                              <Link
                                href={item.href}
                                className="flex items-center gap-2 rounded-md p-2 transition-colors hover-elevate"
                                data-testid={`nav-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                              >
                                <item.icon className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-foreground">
                                  {item.title}
                                </span>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <Link href="/resources" className="text-sm text-primary flex items-center gap-1 hover:underline">
                            View All Resources <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
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
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
              <nav className="flex flex-col gap-4 mt-8">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Who We Help</h4>
                  {whoWeHelp.map((item) => (
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
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Free Tools</h4>
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
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Learn</h4>
                  <Link
                    href="/resources"
                    className="block py-2 text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="mobile-link-resources"
                  >
                    All Resources
                  </Link>
                  {learnTopics.slice(0, 4).map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="block py-2 text-foreground/70 transition-colors text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-border" />

                <Link
                  href="/about"
                  className="py-2 text-foreground transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-about"
                >
                  About Us
                </Link>

                <Link
                  href="/contact"
                  className="py-2 text-foreground transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-contact"
                >
                  Contact
                </Link>

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
  );
}
