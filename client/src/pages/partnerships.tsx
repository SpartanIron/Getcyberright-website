import { PageBanner } from "@/components/page-banner";
import { Footer } from "@/components/footer";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  GraduationCap, 
  Heart, 
  Megaphone, 
  Users, 
  Globe,
  CheckCircle,
  Mail
} from "lucide-react";
import partnershipImage from "@/assets/banners/about-banner.png";

const partnershipTypes = [
  {
    icon: Building2,
    title: "Corporate Partners",
    description: "Partner with us to protect your employees and their families. We offer co-branded resources, employee training materials, and enterprise security awareness programs.",
    benefits: [
      "Custom security guides for your workforce",
      "Co-branded educational materials",
      "Employee family protection resources",
      "Quarterly threat briefings"
    ]
  },
  {
    icon: GraduationCap,
    title: "Educational Institutions",
    description: "Schools, universities, and libraries can partner with us to bring digital safety education to students of all ages.",
    benefits: [
      "Classroom-ready curriculum materials",
      "Student and parent workshops",
      "Faculty training resources",
      "Campus security awareness programs"
    ]
  },
  {
    icon: Heart,
    title: "Nonprofit Organizations",
    description: "We work with community organizations, senior centers, and nonprofits to extend our reach to vulnerable populations.",
    benefits: [
      "Free resources for your community",
      "Joint awareness campaigns",
      "Volunteer training materials",
      "Grant collaboration opportunities"
    ]
  },
  {
    icon: Users,
    title: "Community Groups",
    description: "Local community centers, faith-based organizations, and neighborhood groups can partner with us to host cyber safety events.",
    benefits: [
      "Event planning support",
      "Printed educational materials",
      "Speaker availability",
      "Custom community guides"
    ]
  },
  {
    icon: Globe,
    title: "International Partners",
    description: "We partner with organizations worldwide to localize our resources and extend protection to families across the globe.",
    benefits: [
      "Content localization support",
      "Regional threat intelligence",
      "Cultural adaptation guidance",
      "Global awareness campaigns"
    ]
  },
  {
    icon: Megaphone,
    title: "Media Partners",
    description: "Journalists, content creators, and media outlets can partner with us for expert commentary and educational content.",
    benefits: [
      "Expert interviews and quotes",
      "Data and research access",
      "Content collaboration",
      "Breaking scam alerts"
    ]
  }
];

export default function Partnerships() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.partnerships} />
      <main id="main-content" tabIndex={-1}>
      <PageBanner
        title="Partner With Us"
        subtitle="Join our mission to protect families from cyber threats. Together, we can make the internet safer for everyone."
        imageSrc={partnershipImage}
        imageAlt="Partnership collaboration"
        imagePosition="right"
        colorVariant="indigo"
      />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Partner With GetCyberRight?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We believe cybersecurity is a community effort. By partnering with organizations that share our values, 
              we can reach more families and create a safer digital world for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="text-center p-6">
              <CardContent className="pt-4">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <p className="text-muted-foreground">Countries Reached</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="pt-4">
                <div className="text-3xl font-bold text-primary mb-2">Free</div>
                <p className="text-muted-foreground">Core Tools</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="pt-4">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <p className="text-muted-foreground">Always Available</p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Partnership Opportunities</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnershipTypes.map((type) => (
              <Card key={type.title} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <type.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{type.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                  <ul className="space-y-2">
                    {type.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Partner?</h2>
          <p className="text-muted-foreground mb-8">
            We'd love to hear from you. Tell us about your organization and how we can work together to protect families online.
          </p>
          <Button size="lg" asChild>
            <a href="mailto:partnerships@getcyberright.com" className="inline-flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Partnerships Team
            </a>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">partnerships@getcyberright.com</p>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
