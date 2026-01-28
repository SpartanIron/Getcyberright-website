import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Newsletter } from "@/components/newsletter";
import { 
  Users, 
  Heart, 
  Briefcase, 
  GraduationCap, 
  ArrowRight,
  Shield,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import logoImage from "@assets/image_(3)_1769558492356.png";

const solutions = [
  {
    id: "families",
    icon: Users,
    title: "For Families",
    subtitle: "Protect Your Loved Ones Online",
    problem: "Your family shares devices, clicks links, and trusts messages from people they know. But hackers exploit exactly that trust - impersonating relatives, sending fake alerts, and targeting the most vulnerable members of your household.",
    solution: "GetCyberRight gives every family member the knowledge to spot scams before they cause harm. Our guides are written in plain language that grandparents and teenagers alike can understand and apply.",
    features: [
      "Family-friendly security checklists",
      "Device safety guides for all ages",
      "Social media protection tips",
      "How to talk to kids about online safety"
    ],
    cta: "Get Family Protection Guide"
  },
  {
    id: "seniors",
    icon: Heart,
    title: "For Seniors",
    subtitle: "Stay Safe Without the Tech Jargon",
    problem: "Scammers specifically target seniors with fake tech support calls, romance scams, and impersonation schemes. These attacks often succeed because the 'help' sounds legitimate and the technology feels overwhelming.",
    solution: "We've created resources specifically for seniors - no confusing tech terms, no complicated steps. Just clear, simple guidance on recognizing when something isn't right and what to do about it.",
    features: [
      "Phone scam recognition guide",
      "Email safety made simple",
      "What to do if you've been scammed",
      "Family communication templates"
    ],
    cta: "Get Senior Safety Guide"
  },
  {
    id: "business",
    icon: Briefcase,
    title: "For Small Businesses",
    subtitle: "Enterprise Security, Made Accessible",
    problem: "Small businesses face the same cyber threats as large corporations but without dedicated IT teams or security budgets. One successful attack can mean lost customers, stolen data, and devastating financial damage.",
    solution: "GetCyberRight provides small business owners with practical security measures that don't require a technical background. Protect your business, your employees, and your customers with actionable steps you can implement today.",
    features: [
      "Employee security awareness training",
      "Business email protection guide",
      "Customer data security basics",
      "Incident response planning"
    ],
    cta: "Get Business Security Kit"
  },
  {
    id: "educators",
    icon: GraduationCap,
    title: "For Educators & Communities",
    subtitle: "Teach Digital Safety Effectively",
    problem: "Schools, libraries, and community organizations want to help their members stay safe online, but cybersecurity training materials are often too technical, too boring, or too focused on corporate environments.",
    solution: "Our educational resources are designed for community settings. Use our materials to run workshops, distribute guides, and empower your community with practical cybersecurity knowledge.",
    features: [
      "Ready-to-use workshop materials",
      "Age-appropriate lesson plans",
      "Community presentation slides",
      "Printable safety guides"
    ],
    cta: "Get Educator Resources"
  }
];

export default function Solutions() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <section className="py-16 sm:py-24 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <img src={logoImage} alt="" className="w-5 h-5 object-contain" />
                <span>Solutions for Everyone</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Cybersecurity Protection{" "}
                <span className="text-primary">For Real People</span>
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you're protecting your family, helping a senior relative, 
                securing your small business, or educating your community - we have 
                resources designed specifically for you.
              </p>
            </motion.div>
          </div>
        </section>

        {solutions.map((solution, index) => (
          <section 
            key={solution.id}
            id={solution.id}
            className={`py-16 sm:py-24 ${index % 2 === 0 ? 'bg-background' : 'bg-card border-y'}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
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
                  
                  <Button size="lg" data-testid={`button-${solution.id}-cta`}>
                    {solution.cta}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={index % 2 === 1 ? 'lg:order-1' : ''}
                >
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-foreground mb-4">What You'll Get</h3>
                      <ul className="space-y-3">
                        {solution.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
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
