import { PageBanner } from "@/components/page-banner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Users, 
  Shield, 
  TrendingUp,
  CheckCircle,
  Mail,
  AlertCircle
} from "lucide-react";
import advertisingImage from "@/assets/banners/solutions-banner.png";

const audienceSegments = [
  {
    title: "Parents & Families",
    description: "Security-conscious parents looking to protect their children online",
    reach: "Primary audience"
  },
  {
    title: "Seniors",
    description: "Adults 60+ seeking protection from scams and fraud",
    reach: "Growing segment"
  },
  {
    title: "Small Business Owners",
    description: "Entrepreneurs looking for affordable security solutions",
    reach: "Business decision-makers"
  },
  {
    title: "Educators",
    description: "Teachers and administrators implementing digital citizenship",
    reach: "Institutional buyers"
  }
];

const adFormats = [
  {
    title: "Sponsored Content",
    description: "Native articles and guides that provide value while showcasing your brand's commitment to cybersecurity."
  },
  {
    title: "Resource Sponsorship",
    description: "Sponsor specific tools, guides, or educational resources with prominent brand visibility."
  },
  {
    title: "Newsletter Placement",
    description: "Reach our engaged subscriber base with targeted placements in our weekly security digest."
  },
  {
    title: "Event Sponsorship",
    description: "Support our community webinars, workshops, and awareness campaigns."
  }
];

const guidelines = [
  "Products must genuinely help protect users from cyber threats",
  "No misleading claims or fear-based marketing",
  "Clear disclosure of sponsored content",
  "No collection of user data without consent",
  "Alignment with our mission of accessible cybersecurity"
];

export default function Advertising() {
  return (
    <div className="min-h-screen bg-background">
      <PageBanner
        title="Advertising Opportunities"
        subtitle="Reach security-conscious families and businesses through ethical, value-driven advertising."
        imageSrc={advertisingImage}
        imageAlt="Advertising opportunities"
        imagePosition="right"
        colorVariant="blue"
      />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Reach the Right Audience</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              GetCyberRight attracts a unique audience of security-aware individuals actively seeking solutions 
              to protect themselves and their families from cyber threats.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {audienceSegments.map((segment) => (
              <Card key={segment.title}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">{segment.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{segment.description}</p>
                  <span className="text-xs font-medium text-primary">{segment.reach}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Advertising Formats</h2>
              <div className="space-y-4">
                {adFormats.map((format) => (
                  <Card key={format.title}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Target className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{format.title}</h3>
                          <p className="text-sm text-muted-foreground">{format.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Our Standards</h2>
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Shield className="w-6 h-6 text-primary shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Ethical Advertising Only</h3>
                      <p className="text-sm text-muted-foreground">
                        We maintain strict guidelines to ensure all advertising aligns with our mission 
                        of protecting families. We only work with brands that genuinely help users stay safe online.
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 mt-4">
                    {guidelines.map((guideline) => (
                      <li key={guideline} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                        <span>{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">What We Don't Accept</h3>
                      <p className="text-sm text-muted-foreground">
                        We do not accept advertising for VPNs with misleading claims, "scareware" products, 
                        cryptocurrency schemes, gambling, or any product that exploits user fears.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Interested in Advertising?</h2>
          <p className="text-muted-foreground mb-8">
            Contact our advertising team to discuss how your brand can reach our engaged audience 
            while supporting our mission to protect families online.
          </p>
          <Button size="lg" asChild>
            <a href="mailto:advertising@getcyberright.com" className="inline-flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Advertising Team
            </a>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">advertising@getcyberright.com</p>
        </div>
      </section>
    </div>
  );
}
