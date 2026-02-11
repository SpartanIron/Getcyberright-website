import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Shield, BookOpen, Info, DollarSign, LogIn, UserPlus } from "lucide-react";
import { Link, useLocation } from "wouter";
import logoImage from "@/assets/logo.png";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { title: "Scam Checker", href: "/scam-checker", icon: Shield },
  { title: "Learn", href: "/training", icon: BookOpen },
  { title: "About", href: "/about", icon: Info },
  { title: "Pricing", href: "/pricing", icon: DollarSign },
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

            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {navItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover-elevate ${
                    location === item.href
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground"
                  }`}
                  data-testid={`nav-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost" size="default" data-testid="button-login">
                  <LogIn className="w-4 h-4 mr-1.5" />
                  Log In
                </Button>
              </Link>
              <Link href="/scam-checker">
                <Button variant="default" size="default" data-testid="button-check-scam">
                  Check a Scam
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
              <SheetContent side="right" className="w-[300px] sm:w-[360px] overflow-y-auto" aria-label="Mobile navigation menu">
                <nav className="flex flex-col gap-2 mt-8" aria-label="Mobile navigation">
                  {navItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className={`flex items-center gap-3 py-3 px-3 rounded-lg text-base font-medium transition-colors ${
                        location === item.href
                          ? "text-primary bg-primary/5"
                          : "text-foreground"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid={`mobile-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.title}
                    </Link>
                  ))}

                  <div className="h-px bg-border my-2" />

                  <Link
                    href="/login"
                    className="flex items-center gap-3 py-3 px-3 rounded-lg text-base font-medium text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="mobile-link-login"
                  >
                    <LogIn className="w-5 h-5" />
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-3 py-3 px-3 rounded-lg text-base font-medium text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="mobile-link-register"
                  >
                    <UserPlus className="w-5 h-5" />
                    Create Account
                  </Link>

                  <div className="h-px bg-border my-2" />

                  <div className="flex items-center justify-between px-3 pt-2">
                    <ThemeToggle />
                    <Link href="/scam-checker" onClick={() => setMobileMenuOpen(false)}>
                      <Button data-testid="mobile-button-check-scam">
                        Check a Scam
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
