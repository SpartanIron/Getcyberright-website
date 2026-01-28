import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { TrustSignals } from "@/components/trust-signals";
import { ProblemSolution } from "@/components/problem-solution";
import { Features } from "@/components/features";
import { EducationResources } from "@/components/education-resources";
import { AboutSection } from "@/components/about-section";
import { Testimonials } from "@/components/testimonials";
import { ContactForm } from "@/components/contact-form";
import { Newsletter } from "@/components/newsletter";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <TrustSignals />
        <ProblemSolution />
        <Features />
        <EducationResources />
        <AboutSection />
        <Testimonials />
        <ContactForm />
        <Newsletter />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
