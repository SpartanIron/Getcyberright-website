import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { PageBanner } from "@/components/page-banner";
import { PrintableChecklist, securityChecklists } from "@/components/printable-checklist";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, User, Users, Briefcase } from "lucide-react";
import { Link } from "wouter";
import bannerImage from "@/assets/banners/resources-banner.png";

const checklistTabs = [
  { id: "home", label: "Home Network", icon: Home, checklist: securityChecklists.homeNetwork },
  { id: "account", label: "Account Security", icon: User, checklist: securityChecklists.accountSecurity },
  { id: "family", label: "Family Safety", icon: Users, checklist: securityChecklists.familySafety },
  { id: "business", label: "Small Business", icon: Briefcase, checklist: securityChecklists.smallBusiness },
];

export default function Checklists() {
  return (
    <div className="min-h-screen bg-background print:bg-white">
      <SEOHead {...pageSEO.checklists} />
      <div className="print:hidden">
        <Navigation />
      </div>

      <main id="main-content" tabIndex={-1}>
        <div className="print:hidden">
          <PageBanner
            title="Security Checklists"
            subtitle="Printable step-by-step checklists to help you secure your digital life. Check off each item as you complete it."
            imageSrc={bannerImage}
            imageAlt="Security checklists and guides"
            colorVariant="slate"
          />
        </div>

        <section className="py-12 sm:py-16 print:py-4">
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
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PrintableChecklist
                      id={tab.id}
                      title={tab.checklist.title}
                      description={tab.checklist.description}
                      items={tab.checklist.items}
                      category={tab.checklist.category}
                    />
                  </motion.div>
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 text-center print:hidden"
            >
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
            </motion.div>
          </div>
        </section>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
