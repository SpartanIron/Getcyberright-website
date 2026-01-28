import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Phone, 
  CreditCard, 
  Lock, 
  FileText, 
  Shield,
  ExternalLink,
  CheckCircle2,
  Clock
} from "lucide-react";

const immediateSteps = [
  {
    title: "Stay Calm and Act Quickly",
    description: "The first few hours are critical. Stay calm and work through these steps methodically.",
    icon: Clock,
  },
  {
    title: "Stop All Communication",
    description: "Immediately stop responding to the scammer. Don't click any more links or provide additional information.",
    icon: AlertTriangle,
  },
  {
    title: "Secure Your Accounts",
    description: "Change passwords for any accounts that may be compromised. Start with your email and banking.",
    icon: Lock,
  },
  {
    title: "Contact Your Bank",
    description: "If you shared financial information or sent money, call your bank immediately to report fraud and potentially reverse transactions.",
    icon: CreditCard,
  },
];

const reportingAgencies = [
  {
    name: "FBI Internet Crime Complaint Center (IC3)",
    description: "Report internet crimes including scams, fraud, and identity theft",
    url: "https://www.ic3.gov/",
    phone: null,
  },
  {
    name: "Federal Trade Commission (FTC)",
    description: "Report fraud, scams, and bad business practices",
    url: "https://reportfraud.ftc.gov/",
    phone: "1-877-382-4357",
  },
  {
    name: "CISA (Cybersecurity & Infrastructure Security Agency)",
    description: "Report cybersecurity incidents and vulnerabilities",
    url: "https://www.cisa.gov/report",
    phone: null,
  },
  {
    name: "Local Police Department",
    description: "File a police report for documentation purposes",
    url: null,
    phone: "Non-emergency line",
  },
];

const scamSpecificActions = [
  {
    type: "Gave Out Personal Information",
    actions: [
      "Place a fraud alert on your credit reports (Equifax, Experian, TransUnion)",
      "Consider freezing your credit to prevent new accounts being opened",
      "Monitor your credit reports for unauthorized accounts",
      "Watch for unexpected bills or collection notices"
    ]
  },
  {
    type: "Sent Money via Wire, Gift Cards, or Crypto",
    actions: [
      "Contact your bank or the wire transfer service immediately",
      "Report gift card fraud to the retailer as they may be able to recover funds",
      "For crypto, report to the exchange used for the transaction",
      "Unfortunately, these payments are often unrecoverable so focus on preventing further loss"
    ]
  },
  {
    type: "Clicked a Suspicious Link",
    actions: [
      "Run antivirus software immediately and do a full system scan",
      "Change passwords for important accounts from a different device",
      "Watch for unusual activity on your accounts",
      "If you entered credentials, assume that account is compromised"
    ]
  },
  {
    type: "Downloaded Suspicious Software",
    actions: [
      "Disconnect from the internet immediately",
      "Run antivirus software in safe mode",
      "Consider professional help to clean your device",
      "Change all passwords from a clean device after cleanup"
    ]
  },
];

export default function EmergencyHelp() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <section className="py-16 sm:py-20 bg-red-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
              <AlertTriangle className="w-4 h-4" />
              <span>Emergency Response</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Been Scammed? Here's What To Do
            </h1>
            
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Take a deep breath. We'll guide you through the steps to minimize damage, 
              report the scam, and protect yourself from further harm.
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-red-50 dark:bg-red-950/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-red-600" />
              Immediate Steps to Take First
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {immediateSteps.map((step, index) => (
                <Card key={index} data-testid={`card-immediate-step-${index}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              What Happened? (Find Your Situation)
            </h2>
            
            <div className="space-y-6">
              {scamSpecificActions.map((scenario, index) => (
                <Card key={index} data-testid={`card-scenario-${index}`}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg text-foreground mb-4">{scenario.type}</h3>
                    <ul className="space-y-3">
                      {scenario.actions.map((action, actionIndex) => (
                        <li key={actionIndex} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Report the Scam
            </h2>
            
            <p className="text-muted-foreground mb-6">
              Reporting helps authorities track scammers and may help others avoid the same scam.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {reportingAgencies.map((agency, index) => (
                <Card key={index} data-testid={`card-agency-${index}`}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">{agency.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{agency.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {agency.url && (
                        <a href={agency.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            Visit Website
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </a>
                      )}
                      {agency.phone && (
                        <Button variant="secondary" size="sm">
                          <Phone className="w-3 h-3 mr-1" />
                          {agency.phone}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">You're Not Alone</h3>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                  Scams happen to millions of smart, careful people every year. 
                  Taking action now is the best thing you can do. Learn from this experience 
                  and help protect others by sharing what you've learned.
                </p>
                <Button data-testid="button-learn-prevention">
                  Learn How to Prevent Future Scams
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
