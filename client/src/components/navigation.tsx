import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link, useLocation } from "wouter";
import logoImage from "@assets/image_(3)_1769558492356.png";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const solutionItems = [
  { title: "For Families", description: "Protect your loved ones from online threats", href: "/solutions#families" },
  { title: "For Seniors", description: "Simple cybersecurity guidance for everyday safety", href: "/solutions#seniors" },
  { title: "For Small Business", description: "Enterprise-grade protection made accessible", href: "/solutions#business" },
  { title: "For Educators", description: "Train and protect your entire community", href: "/solutions#educators" },
];

const resourceItems = [
  { title: "All Resources", description: "Browse our full library of guides and articles", href: "/resources" },
  { title: "Security Guides", description: "Step-by-step protection tutorials", href: "/resources" },
  { title: "Scam Alerts", description: "Latest scam warnings and how to avoid them", href: "/resources" },
  { title: "Video Training", description: "Watch and learn at your own pace", href: "/resources" },
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
                <NavigationMenuTrigger className="bg-transparent" data-testid="nav-solutions">
                  Solutions
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {solutionItems.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover-elevate"
                            data-testid={`nav-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                          >
                            <div className="text-sm font-medium leading-none">
                              {item.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/tools"
                    className={`group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors focus:outline-none hover-elevate ${location === '/tools' ? 'text-primary' : ''}`}
                    data-testid="nav-free-tools"
                  >
                    Free Tools
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent" data-testid="nav-resources">
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {resourceItems.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover-elevate"
                            data-testid={`nav-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                          >
                            <div className="text-sm font-medium leading-none">
                              {item.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/about"
                    className={`group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors focus:outline-none hover-elevate ${location === '/about' ? 'text-primary' : ''}`}
                    data-testid="nav-about"
                  >
                    About
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
            <Link href="/tools">
              <Button variant="default" size="default" data-testid="button-get-protection">
                Get Free Protection Tools
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
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">Solutions</h4>
                  {solutionItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="block py-2 text-foreground transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid={`mobile-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-border" />

                <Link
                  href="/tools"
                  className="py-2 text-foreground transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-free-tools"
                >
                  Free Tools
                </Link>

                <div className="h-px bg-border" />

                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">Resources</h4>
                  <Link
                    href="/resources"
                    className="block py-2 text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="mobile-link-resources"
                  >
                    All Resources
                  </Link>
                </div>

                <div className="h-px bg-border" />

                <Link
                  href="/about"
                  className="py-2 text-foreground transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-about"
                >
                  About
                </Link>

                <Link
                  href="/contact"
                  className="py-2 text-foreground transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-contact"
                >
                  Contact
                </Link>

                <div className="pt-4">
                  <Link href="/tools" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full" data-testid="mobile-button-get-protection">
                      Get Free Protection Tools
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
