import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "@/lib/navigation";

interface SafetyLevel {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  highlights: string[];
}

const safetyLevels: SafetyLevel[] = [
  {
    id: "beginner",
    title: "Foundation",
    subtitle: "Essential Protection",
    description: "Start with the basics that protect against 80% of common threats.",
    icon: <Shield className="h-8 w-8" />,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    highlights: [
      "Password security for the whole family",
      "Home WiFi protection",
      "Device lock settings",
      "Family communication plan"
    ]
  },
  {
    id: "intermediate",
    title: "Strengthened",
    subtitle: "Enhanced Protection",
    description: "Build on the basics with privacy controls and monitoring.",
    icon: <Lock className="h-8 w-8" />,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    highlights: [
      "Social media privacy settings",
      "Parental controls setup",
      "Credit freeze protection",
      "Scam awareness training"
    ]
  },
  {
    id: "advanced",
    title: "Fortified",
    subtitle: "Maximum Protection",
    description: "Advanced measures for comprehensive family security.",
    icon: <Users className="h-8 w-8" />,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    highlights: [
      "Network-level filtering",
      "Encrypted communications",
      "Incident response planning",
      "Digital legacy setup"
    ]
  }
];

export function LearningPaths() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
          Family Safety Roadmap
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          A step-by-step guide to protect your family online. Start with the essentials 
          and progress at your own pace.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {safetyLevels.map((level) => (
          <Card 
            key={level.id} 
            className={`border-2 hover:shadow-lg transition-shadow ${level.bgColor}`}
          >
            <CardContent className="p-6">
              <div className={`inline-flex p-3 rounded-xl ${level.bgColor} ${level.color} mb-4`}>
                {level.icon}
              </div>
              <div className="mb-4">
                <Badge variant="outline" className="mb-2">
                  {level.subtitle}
                </Badge>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {level.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {level.description}
                </p>
              </div>
              <ul className="space-y-2 mb-6">
                {level.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${level.color}`} />
                    {highlight}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-4">
        <Link to="/training">
          <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
            Start the Family Safety Roadmap
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
