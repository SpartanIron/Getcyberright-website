import { FadeIn } from "@/components/fade-in";
import { SignupEncouragementBanner } from "@/components/signup-encouragement-banner";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { PrintableChecklist } from "@/components/printable-checklist";
import { securityChecklists } from "@/data/security-checklists";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, User, Users, Briefcase, Shield, CalendarDays } from "lucide-react";
import { Link } from "@/lib/navigation";
import { StructuredData } from "@/components/structured-data";
import type { BreadcrumbData } from "@/components/structured-data";
import bannerImage from "@/assets/banners/resources-banner.webp";
import { imgSrc } from "@/lib/img-src";

const checklistTabs = [
  { id: "home", label: "Home Network", icon: Home, checklist: securityChecklists.homeNetwork },
  { id: "account", label: "Account Security", icon: User, checklist: securityChecklists.accountSecurity },
  { id: "family", label: "Family Safety", icon: Users, checklist: securityChecklists.familySafety },
  { id: "business", label: "Small Business", icon: Briefcase, checklist: securityChecklists.smallBusiness },
];

export default function Checklists() {
  return (
    <div className="min-h-screen bg-background print:bg-white">
      <StructuredData data={{
        type: "BreadcrumbList",
        items: [
          { name: "Home", url: "https://www.getcyberright.com/" },
          { name: "Security Checklists", url: "https://www.getcyberright.com/checklists" },
        ],
      } as BreadcrumbData} />
      <div className="print:hidden">
        <Navigation />
      </div>

      <main id="main-content" tabIndex={-1}>
        <div className="print:hidden">
          <PageBanner
            title="Security Checklists"
            subtitle="Printable step-by-step checklists to help you secure your digital life. Check off each item as you complete it."
            imageSrc={imgSrc(bannerImage)}
            imageAlt="Security checklists and guides"
            colorVariant="slate"
          />
        </div>

        <section className="py-6 print:hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-4 p-5 bg-muted/30 rounded-lg border border-border">
              <Shield className="w-8 h-8 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foreground leading-relaxed">
                  These checklists are based on guidance from <strong>CISA</strong>, <strong>NIST</strong>, and <strong>the FTC</strong>. 
                  Print them, check off each step as you complete it, and revisit quarterly to stay protected. 
                  Most items take just a few minutes and make a significant difference in your security posture.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-6 sm:py-10 print:py-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 print:px-0">
            <Tabs defaultValue="home" className="print:hidden">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-8">
                {checklistTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-2"
                    data-testid={`tab-${tab.id}`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {checklistTabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id}>
                  <FadeIn>
                    <PrintableChecklist
                      id={tab.id}
                      title={tab.checklist.title}
                      description={tab.checklist.description}
                      items={tab.checklist.items}
                      category={tab.checklist.category}
                    />
                  </FadeIn>
                </TabsContent>
              ))}
            </Tabs>

            <div className="hidden print:block">
              {checklistTabs.map((tab) => (
                <div key={tab.id} className="mb-8 page-break-after">
                  <PrintableChecklist
                    id={`print-${tab.id}`}
                    title={tab.checklist.title}
                    description={tab.checklist.description}
                    items={tab.checklist.items}
                    category={tab.checklist.category}
                  />
                </div>
              ))}
            </div>

            <FadeIn className="mt-12 text-center print:hidden" delay={0.2}>
              <p className="text-muted-foreground mb-4">
                Need more detailed guidance? Check out our comprehensive resources.
              </p>
              <Link
                href="/resources"
                className="text-primary hover:underline font-medium"
                data-testid="link-view-resources"
              >
                View All Resources
              </Link>
            </FadeIn>

            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-6 print:hidden">
              <CalendarDays className="w-3 h-3" />
              <span>Content last reviewed: February 2026</span>
            </div>
          </div>
        </section>
      </main>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 print:hidden">
        <SignupEncouragementBanner toolName="checklists" show={true} contextMessage="Create a free account for full access to all checklists" />
      </div>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
