import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Download, 
  Share2, 
  CheckCircle,
  Shield,
  Sparkles,
  Users,
  Heart,
  GraduationCap,
  Briefcase
} from "lucide-react";

interface CertificateViewerProps {
  certificateName: string;
  certificateNumber: string;
  recipientName: string;
  issueDate: string;
  finalScore: number;
  audience: string;
  pathTitle: string;
}

const audienceStyles: Record<string, {
  gradient: string;
  icon: any;
  borderColor: string;
  accentColor: string;
  pattern: string;
  tagline: string;
}> = {
  kids: {
    gradient: "from-purple-500 via-pink-500 to-purple-600",
    icon: Sparkles,
    borderColor: "border-purple-400",
    accentColor: "text-purple-600",
    pattern: "radial-gradient(circle at 20% 80%, rgba(168,85,247,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(236,72,153,0.1) 0%, transparent 50%)",
    tagline: "Young Digital Safety Champion"
  },
  parents: {
    gradient: "from-blue-500 via-cyan-500 to-blue-600",
    icon: Users,
    borderColor: "border-blue-400",
    accentColor: "text-blue-600",
    pattern: "radial-gradient(circle at 20% 80%, rgba(59,130,246,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(6,182,212,0.1) 0%, transparent 50%)",
    tagline: "Family Safety Guardian"
  },
  seniors: {
    gradient: "from-rose-500 via-orange-500 to-rose-600",
    icon: Heart,
    borderColor: "border-rose-400",
    accentColor: "text-rose-600",
    pattern: "radial-gradient(circle at 20% 80%, rgba(244,63,94,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(249,115,22,0.1) 0%, transparent 50%)",
    tagline: "Scam Prevention Expert"
  },
  educators: {
    gradient: "from-emerald-500 via-teal-500 to-emerald-600",
    icon: GraduationCap,
    borderColor: "border-emerald-400",
    accentColor: "text-emerald-600",
    pattern: "radial-gradient(circle at 20% 80%, rgba(16,185,129,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(20,184,166,0.1) 0%, transparent 50%)",
    tagline: "Digital Safety Educator"
  },
  "small-business": {
    gradient: "from-amber-500 via-yellow-500 to-amber-600",
    icon: Briefcase,
    borderColor: "border-amber-400",
    accentColor: "text-amber-600",
    pattern: "radial-gradient(circle at 20% 80%, rgba(245,158,11,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(234,179,8,0.1) 0%, transparent 50%)",
    tagline: "Business Security Professional"
  }
};

export function CertificateViewer({
  certificateName,
  certificateNumber,
  recipientName,
  issueDate,
  finalScore,
  audience,
  pathTitle
}: CertificateViewerProps) {
  const style = audienceStyles[audience] || audienceStyles.parents;
  const AudienceIcon = style.icon;
  
  const formattedDate = new Date(issueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="space-y-4">
      <Card 
        className={`relative overflow-hidden border-4 ${style.borderColor}`}
        style={{ background: style.pattern }}
        data-testid="certificate-card"
      >
        <div className={`absolute top-0 left-0 right-0 h-3 bg-gradient-to-r ${style.gradient}`} />
        
        <CardContent className="p-8 md:p-12">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className={`p-4 rounded-full bg-gradient-to-br ${style.gradient} shadow-lg`}>
                <Shield className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <div>
              <Badge variant="secondary" className="mb-2">
                <AudienceIcon className="w-3 h-3 mr-1" />
                {style.tagline}
              </Badge>
              <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-1">
                Certificate of Completion
              </h2>
              <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-certificate-name">
                {certificateName}
              </h1>
            </div>
            
            <div className="py-4">
              <p className="text-muted-foreground mb-2">This certifies that</p>
              <p className={`text-2xl md:text-3xl font-semibold ${style.accentColor}`} data-testid="text-recipient-name">
                {recipientName}
              </p>
              <p className="text-muted-foreground mt-2">
                has successfully completed the
              </p>
              <p className="text-xl font-medium mt-1">{pathTitle}</p>
            </div>
            
            <div className="flex justify-center items-center gap-8 py-4 border-y">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{finalScore}%</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Final Score</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <p className="text-lg font-semibold">{formattedDate}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Issue Date</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Verified Certificate</span>
              <span className="mx-2">|</span>
              <span className="font-mono">{certificateNumber}</span>
            </div>
            
            <div className="pt-4">
              <div className="flex items-center justify-center gap-2">
                <Award className={`w-6 h-6 ${style.accentColor}`} />
                <span className="text-lg font-semibold">GetCyberRight Academy</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Empowering Digital Safety Through Education
              </p>
            </div>
          </div>
        </CardContent>
        
        <div className={`absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r ${style.gradient}`} />
      </Card>
      
      <div className="flex justify-center gap-4">
        <Button variant="outline" data-testid="button-download-certificate">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        <Button variant="outline" data-testid="button-share-certificate">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
}

export function CertificateMini({
  certificateName,
  audience,
  issueDate
}: {
  certificateName: string;
  audience: string;
  issueDate: string;
}) {
  const style = audienceStyles[audience] || audienceStyles.parents;
  const AudienceIcon = style.icon;
  
  const formattedDate = new Date(issueDate).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric"
  });

  return (
    <Card className={`border-l-4 ${style.borderColor} hover-elevate cursor-pointer`}>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`p-2 rounded-full bg-gradient-to-br ${style.gradient}`}>
          <AudienceIcon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">{certificateName}</p>
          <p className="text-xs text-muted-foreground">Earned {formattedDate}</p>
        </div>
        <CheckCircle className="w-5 h-5 text-green-500" />
      </CardContent>
    </Card>
  );
}
