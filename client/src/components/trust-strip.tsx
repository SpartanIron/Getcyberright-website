import { Shield, Lock, FileCheck, HeartHandshake } from "lucide-react";

const trustIndicators = [
  { 
    icon: FileCheck,
    label: "100% Free", 
    sublabel: "No hidden costs ever" 
  },
  { 
    icon: Lock,
    label: "No Account Needed", 
    sublabel: "Use tools instantly" 
  },
  { 
    icon: Shield,
    label: "Expert Sources", 
    sublabel: "FBI, CISA, FTC guidance" 
  },
  { 
    icon: HeartHandshake,
    label: "Privacy First", 
    sublabel: "We never sell your data" 
  },
];

export function TrustStrip() {
  return (
    <section className="bg-muted/50 border-y" data-testid="section-trust-strip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {trustIndicators.map((item) => (
            <div 
              key={item.label} 
              className="flex items-center gap-3 text-center sm:text-left" 
              data-testid={`trust-${item.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sublabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
