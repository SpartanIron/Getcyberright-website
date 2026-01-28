import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Newsletter } from "@/components/newsletter";
import { PageBanner } from "@/components/page-banner";
import { Link } from "wouter";
import { 
  Users, 
  Heart, 
  Briefcase, 
  GraduationCap, 
  ArrowRight,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Lock
} from "lucide-react";
import bannerImage from "@/assets/banners/solutions-banner.png";
import familyImage from "@/assets/images/family-devices.jpg";
import seniorImage from "@/assets/images/senior-safety.jpg";
import businessImage from "@/assets/images/small-business.jpg";
import educatorImage from "@/assets/images/educator-training.jpg";

const solutions = [
  {
    id: "families",
    icon: Users,
    title: "For Families",
    subtitle: "Protect Your Loved Ones Online",
    image: familyImage,
    problem: "Your family shares devices, clicks links, and trusts messages from people they know. But hackers exploit exactly that trust by impersonating relatives, sending fake alerts, and targeting the most vulnerable members of your household.",
    solution: "GetCyberRight gives every family member the knowledge to spot scams before they cause harm. Our guides are written in plain language that grandparents and teenagers alike can understand and apply.",
    features: [
      "Family-friendly security checklists",
      "Device safety guides for all ages",
      "Social media protection tips",
      "How to talk to kids about online safety"
    ],
    cta: "Get Family Protection Guide",
    stats: { value: "Free", label: "Family Resources" }
  },
  {
    id: "seniors",
    icon: Heart,
    title: "For Seniors",
    subtitle: "Stay Safe Without the Tech Jargon",
    image: seniorImage,
    problem: "Scammers specifically target seniors with fake tech support calls, romance scams, and impersonation schemes. These attacks often succeed because the 'help' sounds legitimate and the technology feels overwhelming.",
    solution: "We have created resources specifically for seniors with no confusing tech terms and no complicated steps. Just clear, simple guidance on recognizing when something is not right and what to do about it.",
    features: [
      "Phone scam recognition guide",
      "Email safety made simple",
      "What to do if you've been scammed",
      "Family communication templates"
    ],
    cta: "Get Senior Safety Guide",
    stats: { value: "Free", label: "Senior Guides" }
  },
  {
    id: "business",
    icon: Briefcase,
    title: "For Small Businesses",
    subtitle: "Enterprise Security, Made Accessible",
    image: businessImage,
    problem: "Small businesses face the same cyber threats as large corporations but without dedicated IT teams or security budgets. One successful attack can mean lost customers, stolen data, and devastating financial damage.",
    solution: "GetCyberRight provides small business owners with practical security measures that don't require a technical background. Protect your business, your employees, and your customers with actionable steps you can implement today.",
    features: [
      "Employee security awareness training",
      "Business email protection guide",
      "Customer data security basics",
      "Incident response planning"
    ],
    cta: "Get Business Security Kit",
    stats: { value: "Free", label: "Business Training" }
  },
  {
    id: "educators",
    icon: GraduationCap,
    title: "For Educators & Communities",
    subtitle: "Teach Digital Safety Effectively",
    image: educatorImage,
    problem: "Schools, libraries, and community organizations want to help their members stay safe online, but cybersecurity training materials are often too technical, too boring, or too focused on corporate environments.",
    solution: "Our educational resources are designed for community settings. Use our materials to run workshops, distribute guides, and empower your community with practical cybersecurity knowledge.",
    features: [
      "Ready-to-use workshop materials",
      "Age-appropriate lesson plans",
      "Community presentation slides",
      "Printable safety guides"
    ],
    cta: "Get Educator Resources",
    stats: { value: "Free", label: "Workshop Materials" }
  }
];

export default function Solutions() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <PageBanner
          title="Protection Designed for Your World"
          subtitle="Whether you're securing your family, supporting an elderly relative, protecting your business, or educating your community, we built solutions for the way you actually live."
          imageSrc={bannerImage}
          imageAlt="Multi-generational family gathered in living room learning about internet safety together on a tablet"
          imagePosition="right"
        />

        {solutions.map((solution, index) => (
          <section 
            key={solution.id}
            id={solution.id}
            className={`py-16 sm:py-24 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center`}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={index % 2 === 1 ? 'lg:order-2' : ''}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <solution.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                        {solution.title}
                      </h2>
                      <p className="text-primary font-medium">{solution.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-foreground mb-1">The Problem</p>
                        <p className="text-muted-foreground">{solution.problem}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-foreground mb-1">How We Help</p>
                        <p className="text-muted-foreground">{solution.solution}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {solution.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link href="/tools">
                    <Button size="lg" data-testid={`button-${solution.id}-cta`}>
                      {solution.cta}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}
                >
                  <div className="relative h-80 sm:h-96">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="absolute inset-4 rounded-2xl overflow-hidden shadow-2xl"
                      style={{ transform: index % 2 === 0 ? "rotate(2deg)" : "rotate(-2deg)" }}
                    >
                      <img 
                        src={solution.image} 
                        alt={solution.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                      className={`absolute ${index % 2 === 0 ? '-bottom-4 -left-4' : '-bottom-4 -right-4'} bg-white dark:bg-card rounded-xl shadow-xl p-4 z-10`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-bold text-sm">{solution.stats.value}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{solution.stats.label}</p>
                          <p className="text-xs text-muted-foreground">and counting</p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                      className={`absolute ${index % 2 === 0 ? '-top-2 -right-2' : '-top-2 -left-2'} bg-white dark:bg-card rounded-xl shadow-xl p-3 z-10`}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-foreground">100% Free</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        ))}

        <Newsletter />
      </main>
      
      <Footer />
    </div>
  );
}
