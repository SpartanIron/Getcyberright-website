import { useState } from "react";
import { Link, useLocation } from "@/lib/navigation";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Moon, Sun, Menu, ChevronDown, ShieldCheck, AlertTriangle, Globe, Shield, Search, Key, TrendingUp, Newspaper } from "lucide-react";
import logoImage from "@assets/image_1767834716649.png";
import { languages } from "@/lib/i18n";
import { SiteSearch } from "./site-search";

function scrollToHash(hash: string) {
  const element = document.getElementById(hash.replace('#', ''));
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

function NavLink({ href, children, className, onClick }: NavLinkProps) {
  const [, navigate] = useLocation();
  
  const handleClick = (e: React.MouseEvent) => {
    if (href.includes('#')) {
      e.preventDefault();
      const [path, hash] = href.split('#');
      const targetPath = path || '/';
      
      if (window.location.pathname === targetPath || (targetPath === '/' && window.location.pathname === '/')) {
        scrollToHash(hash);
      } else {
        navigate(targetPath);
        setTimeout(() => scrollToHash(hash), 100);
      }
      onClick?.();
    } else {
      onClick?.();
    }
  };

  if (href.includes('#')) {
    return (
      <a href={href} onClick={handleClick} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

export function Header() {
  const [location, navigate] = useLocation();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation: Array<{ nameKey: string; href: string; icon?: React.ReactNode; dropdown?: Array<{ nameKey: string; href: string; icon?: React.ReactNode }> }> = [
    { nameKey: "nav.tools", href: "/tools", dropdown: [
      { nameKey: "nav.scamChecker", href: "/tools", icon: <ShieldCheck className="h-4 w-4" /> },
      { nameKey: "nav.passwordGenerator", href: "/tools?tab=safety-toolkit", icon: <Key className="h-4 w-4" /> },
      { nameKey: "nav.threatTrends", href: "/threat-trends", icon: <TrendingUp className="h-4 w-4" /> },
    ]},
    { nameKey: "nav.learn", href: "/resources", dropdown: [
      { nameKey: "nav.youthSafety", href: "/kids" },
      { nameKey: "nav.seniorProtection", href: "/seniors" },
      { nameKey: "nav.parentGuide", href: "/parent-guide" },
      { nameKey: "nav.resources", href: "/resources" },
    ]},
    { nameKey: "nav.news", href: "/news", icon: <Newspaper className="h-4 w-4" /> },
    { nameKey: "nav.about", href: "/about" },
  ];

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
      role="banner"
    >
      <nav className="container mx-auto flex h-[72px] lg:h-[80px] 2xl:h-[88px] items-center px-6 lg:px-8 2xl:px-10" aria-label="Main navigation">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0" data-testid="link-home">
          <img 
            src={logoImage} 
            alt="GetCyberRight Logo" 
            className="h-10 w-auto"
            data-testid="img-logo"
          />
          <span 
            className="text-base sm:text-lg font-extrabold text-teal-600 dark:text-teal-400"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '-0.02em'
            }}
          >
            GetCyberRight
          </span>
        </Link>

        {/* Desktop Navigation - Centered */}
        <div className="hidden lg:flex items-center justify-center flex-1 mx-8 2xl:mx-12">
          <div className="flex items-center gap-1 lg:gap-2 2xl:gap-4">
            {navigation.map((item) => (
              item.dropdown ? (
                <DropdownMenu key={item.nameKey}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`text-base 2xl:text-lg font-medium transition-all duration-200 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg whitespace-nowrap ${
                        location === item.href || item.dropdown.some(subItem => location === subItem.href)
                          ? "text-foreground bg-slate-100 dark:bg-slate-800"
                          : "text-muted-foreground"
                      } px-4 py-2.5 h-10 2xl:px-5 2xl:h-11`}
                      data-testid={`nav-${item.nameKey}`}
                    >
                      {t(item.nameKey)}
                      <ChevronDown className="ml-1.5 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-52">
                    {item.dropdown.map((subItem) => (
                      <DropdownMenuItem 
                        key={subItem.nameKey} 
                        className="cursor-pointer text-[14px] flex items-center gap-2"
                        onSelect={(e) => {
                          e.preventDefault();
                          if (subItem.href.includes('#')) {
                            const [path, hash] = subItem.href.split('#');
                            const targetPath = path || '/';
                            if (window.location.pathname === targetPath || (targetPath === '/' && window.location.pathname === '/')) {
                              const element = document.getElementById(hash);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                              }
                            } else {
                              navigate(targetPath);
                              setTimeout(() => {
                                const element = document.getElementById(hash);
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth' });
                                }
                              }, 100);
                            }
                          } else {
                            navigate(subItem.href);
                          }
                        }}
                      >
                        {subItem.icon && subItem.icon}
                        {t(subItem.nameKey)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.nameKey}
                  to={item.href}
                  className={`text-base 2xl:text-lg font-medium transition-all duration-200 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg px-4 py-2.5 h-10 2xl:px-5 2xl:h-11 flex items-center gap-1.5 whitespace-nowrap ${
                    location === item.href
                      ? "text-foreground bg-slate-100 dark:bg-slate-800"
                      : "text-muted-foreground"
                  }`}
                  data-testid={`nav-${item.nameKey}`}
                >
                  {item.icon && item.icon}
                  {t(item.nameKey)}
                </Link>
              )
            ))}
          </div>
        </div>

        {/* Right side: Emergency Help, Scam Checker, Language, Theme Toggle */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Emergency Help - most prominent */}
          <Button
            asChild
            size="sm"
            className="hidden md:inline-flex bg-red-600 hover:bg-red-700 text-white shadow-md"
            data-testid="nav-emergency-help"
          >
            <Link to="/emergency-help" className="flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              Help
            </Link>
          </Button>

          {/* Scam Checker */}
          <Button
            asChild
            size="sm"
            className="hidden md:inline-flex bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-md"
            data-testid="nav-scam-checker"
          >
            <a href="/tools#scam-checker" className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              {t("nav.scamChecker")}
            </a>
          </Button>

          {/* Site Search */}
          <SiteSearch />

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 px-2 gap-1.5"
                data-testid="button-language"
              >
                <img 
                  src={languages.find(l => l.code === i18n.language)?.flagUrl || 'https://flagcdn.com/w20/us.png'} 
                  alt="" 
                  className="w-5 h-auto rounded-sm"
                />
                <span className="hidden sm:inline text-xs font-medium uppercase">{i18n.language}</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className={`cursor-pointer gap-3 ${i18n.language === lang.code ? "bg-teal-50 dark:bg-teal-900/20 text-teal-600" : ""}`}
                >
                  <img src={lang.flagUrl} alt="" className="w-5 h-auto rounded-sm" />
                  <span className="flex-1">{lang.nativeName}</span>
                  {i18n.language === lang.code && <span className="text-teal-600">✓</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
            data-testid="button-theme-toggle"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9"
                data-testid="button-mobile-menu"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] flex flex-col h-full">
              <VisuallyHidden>
                <SheetTitle>Navigation Menu</SheetTitle>
              </VisuallyHidden>
              <div className="flex flex-col space-y-2 mt-6 overflow-y-auto flex-1 pb-6">
                {navigation.map((item) => (
                  item.dropdown ? (
                    <div key={item.nameKey} className="space-y-1">
                      <div className="font-semibold text-foreground px-3 py-2 text-base">{t(item.nameKey)}</div>
                      <div className="pl-3 space-y-1">
                        {item.dropdown.map((subItem) => (
                          <NavLink
                            key={subItem.nameKey}
                            href={subItem.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-2 min-h-[48px] py-3 px-3 rounded-lg text-base transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 ${
                              location === subItem.href
                                ? "text-teal-600 font-medium bg-teal-50 dark:bg-teal-900/20"
                                : "text-muted-foreground"
                            }`}
                          >
                            {subItem.icon && subItem.icon}
                            {t(subItem.nameKey)}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.nameKey}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 font-medium min-h-[48px] py-3 px-3 rounded-lg text-base transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 ${
                        location === item.href
                          ? "text-foreground bg-slate-100 dark:bg-slate-800"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.icon && item.icon}
                      {t(item.nameKey)}
                    </Link>
                  )
                ))}

                {/* Divider */}
                <div className="border-t border-slate-200 dark:border-slate-700 my-2" />

                {/* Emergency Help for mobile */}
                <Link
                  to="/emergency-help"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 font-semibold min-h-[52px] py-3 px-4 rounded-lg bg-red-600 text-white shadow-md active:bg-red-700"
                >
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  <span>Been Scammed? Get Help</span>
                </Link>

                {/* Scam Checker for mobile */}
                <a
                  href="/tools#scam-checker"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 font-semibold min-h-[52px] py-3 px-4 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md active:from-teal-600 active:to-cyan-600"
                >
                  <ShieldCheck className="h-5 w-5 flex-shrink-0" />
                  <span>{t("nav.scamChecker")}</span>
                </a>

              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
