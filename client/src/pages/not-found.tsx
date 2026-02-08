<<<<<<< HEAD
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Home, Search, BookOpen, Shield, ArrowLeft, HelpCircle } from "lucide-react";
import logoImage from "@/assets/logo.png";

const helpfulLinks = [
  {
    icon: Home,
    title: "Go Home",
    description: "Return to our homepage",
    href: "/",
  },
  {
    icon: Search,
    title: "Scam Checker",
    description: "Check if something is a scam",
    href: "/tools",
  },
  {
    icon: BookOpen,
    title: "Resources",
    description: "Browse security guides",
    href: "/resources",
  },
  {
    icon: Shield,
    title: "Emergency Help",
    description: "Get help if you've been scammed",
    href: "/emergency-help",
  },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="Page Not Found" description="The page you're looking for doesn't exist." />
      <Navigation />
      
      <main id="main-content" tabIndex={-1} className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8">
            <img 
              src={logoImage} 
              alt="GetCyberRight" 
              className="w-24 h-24 mx-auto mb-6 opacity-50"
              loading="lazy"
              data-testid="img-404-logo"
            />
            <h1 className="text-6xl font-bold text-primary mb-4" data-testid="text-404-heading">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              The page you're looking for doesn't exist or has been moved. 
              But don't worry, we can help you find what you need.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {helpfulLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Card 
                  className="h-full hover-elevate cursor-pointer text-left"
                  data-testid={`card-404-${link.title.toLowerCase().replace(/\s/g, "-")}`}
                >
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <link.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{link.title}</h3>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/">
              <Button data-testid="button-404-go-home">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" data-testid="button-404-contact">
                <HelpCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
=======
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
    </div>
  );
}
