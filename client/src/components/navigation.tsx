import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link } from "wouter";
import logoImage from "@assets/image_(3)_1769558492356.png";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const solutions = [
  { title: "For Families", description: "Protect your loved ones from online threats", href: "#solutions" },
  { title: "For Seniors", description: "Simple cybersecurity guidance for everyday safety", href: "#solutions" },
  { title: "For Small Business", description: "Enterprise-grade protection made accessible", href: "#solutions" },
  { title: "For Organizations", description: "Train and protect your entire team", href: "#solutions" },
];

const resources = [
  { title: "Scam Alerts", description: "Latest scam warnings and how to avoid them", href: "#resources" },
  { title: "Security Guides", description: "Step-by-step protection tutorials", href: "#resources" },
  { title: "Webinars", description: "Live training sessions with experts", href: "#resources" },
  { title: "Blog", description: "Latest cybersecurity news and tips", href: "#resources" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          : "bg-transparent"
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
                    {solutions.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <a
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
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#tools"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors focus:outline-none hover-elevate"
                  data-testid="nav-free-tools"
                >
                  Free Tools
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent" data-testid="nav-resources">
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {resources.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <a
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
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#about"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors focus:outline-none hover-elevate"
                  data-testid="nav-about"
                >
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#contact"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors focus:outline-none hover-elevate"
                  data-testid="nav-contact"
                >
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="hidden lg:flex items-center gap-3">
            <Button variant="default" size="default" data-testid="button-get-protection">
              Get Free Protection Tools
            </Button>
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
                  {solutions.map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      className="block py-2 text-foreground transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid={`mobile-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      {item.title}
                    </a>
                  ))}
                </div>

                <div className="h-px bg-border" />

                <a
                  href="#tools"
                  className="py-2 text-foreground transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-free-tools"
                >
                  Free Tools
                </a>

                <div className="h-px bg-border" />

                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">Resources</h4>
                  {resources.map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      className="block py-2 text-foreground transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid={`mobile-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      {item.title}
                    </a>
                  ))}
                </div>

                <div className="h-px bg-border" />

                <a
                  href="#about"
                  className="py-2 text-foreground transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-about"
                >
                  About
                </a>

                <a
                  href="#contact"
                  className="py-2 text-foreground transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-link-contact"
                >
                  Contact
                </a>

                <div className="pt-4">
                  <Button className="w-full" data-testid="mobile-button-get-protection">
                    Get Free Protection Tools
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
