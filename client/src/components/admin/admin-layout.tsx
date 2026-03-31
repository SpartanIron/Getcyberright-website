import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Mail, 
  Newspaper, 
  AlertTriangle,
  ArrowLeft,
  Shield,
  BarChart3,
  Megaphone,
  TrendingUp,
  MessageSquare,
  FileText,
  ScanSearch,
  Search
} from "lucide-react";
import logoImage from "@/assets/logo.webp";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/content", label: "Content Manager", icon: FileText },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/subscribers", label: "Subscribers", icon: Newspaper },
  { href: "/admin/scam-reports", label: "Scam Reports", icon: AlertTriangle },
  { href: "/admin/scan-management", label: "Scan Activity", icon: ScanSearch },
  { href: "/admin/tool-analytics", label: "Tool Analytics", icon: BarChart3 },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/trending-threats", label: "Trending Threats", icon: TrendingUp },
  { href: "/admin/feedback", label: "Feedback", icon: MessageSquare },
  { href: "/admin/engagement", label: "Engagement", icon: Search },
  { href: "/admin/security", label: "Security", icon: Shield },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-slate-900 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <img src={logoImage} alt="GetCyberRight" className="w-8 h-8" />
                <span className="font-semibold">GetCyberRight</span>
              </Link>
              <div className="h-6 w-px bg-slate-700" />
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Admin Portal</span>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="border-slate-600 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Site
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        <nav aria-label="Admin navigation" className="w-64 min-h-[calc(100vh-4rem)] bg-background border-r border-border p-4 hidden md:block">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.href || 
                (item.href !== "/admin" && location.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </nav>

        <main id="main-content" tabIndex={-1} className="flex-1 p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
