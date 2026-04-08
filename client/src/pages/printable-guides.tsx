import { useSEO } from "@/hooks/use-seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Download, Smartphone, MessageCircle, CreditCard, Lock, 
  Users, Heart, Printer, FileText, CheckCircle, Share2, ArrowLeft
} from "lucide-react";
import { Link } from "@/lib/navigation";
import { ShareCallToAction } from "@/components/social-share";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const checklists = [
  {
    id: "mobile-money",
    icon: Smartphone,
    title: "Mobile Money Safety",
    subtitle: "M-Pesa, MTN MoMo, Airtel Money",
    color: "orange",
    audience: "Seniors",
    items: [
      "Never share your PIN with anyone, not even family",
      "Your provider will NEVER ask for your PIN by phone or SMS",
      "If you receive money 'by mistake', call your provider before reversing",
      "Don't click links in SMS messages about your account",
      "If in doubt, hang up and call the official provider number",
      "Set up a daily transaction limit with your provider",
      "Keep your SIM PIN different from your mobile money PIN"
    ]
  },
  {
    id: "whatsapp-scams",
    icon: MessageCircle,
    title: "WhatsApp Safety",
    subtitle: "Avoid impersonation and money scams",
    color: "green",
    audience: "Everyone",
    items: [
      "If family asks for money urgently, CALL them on their real number first",
      "New number + urgent request = likely scam",
      "Don't share 6-digit verification codes with anyone",
      "Enable two-step verification in WhatsApp settings",
      "Be suspicious of 'too good to be true' investment offers",
      "Scammers can copy profile photos. Voice verify important requests",
      "Report and block suspicious contacts immediately"
    ]
  },
  {
    id: "sim-swap",
    icon: CreditCard,
    title: "SIM Swap Protection",
    subtitle: "Prevent phone number theft",
    color: "purple",
    audience: "Everyone",
    items: [
      "Register your SIM card in your name officially",
      "Set a PIN with your mobile provider",
      "Never share personal details with unknown callers",
      "If your phone loses signal unexpectedly, call provider immediately",
      "Don't post your phone number publicly on social media",
      "Use authenticator apps instead of SMS for 2FA when possible",
      "Monitor your bank accounts for unauthorized transactions"
    ]
  },
  {
    id: "social-media",
    icon: Lock,
    title: "Social Media Safety",
    subtitle: "Protect accounts from hackers",
    color: "blue",
    audience: "Youth & Adults",
    items: [
      "Use different passwords for each social media account",
      "Enable two-factor authentication (2FA) on all accounts",
      "Set profiles to private, not public",
      "Don't accept friend requests from people you don't know",
      "Never share your password, even with friends",
      "Be careful what personal info you share in posts",
      "Log out of shared or public devices"
    ]
  },
  {
    id: "online-strangers",
    icon: Users,
    title: "Talking to Strangers Online",
    subtitle: "For children and teens",
    color: "teal",
    audience: "Youth",
    items: [
      "Never share your full name, school, or address online",
      "Don't send photos to people you only know online",
      "If someone makes you uncomfortable, tell a trusted adult",
      "Never agree to meet someone from the internet in person",
      "It's OK to block and report people who bother you",
      "Not everyone online is who they say they are",
      "Keep your location turned off on apps and games"
    ]
  },
  {
    id: "family-agreement",
    icon: Heart,
    title: "Family Internet Agreement",
    subtitle: "Rules everyone can follow",
    color: "indigo",
    audience: "Families",
    items: [
      "We keep devices in common areas, not bedrooms",
      "We ask permission before downloading new apps",
      "We never share passwords or addresses online",
      "We tell a parent if someone online makes us uncomfortable",
      "We don't meet people in person that we only know online",
      "We are kind to others online, just like in real life",
      "We respect agreed screen time limits"
    ]
  }
];

export default function PrintableGuides() {
  useSEO({
    title: "Printable Safety Checklists | GetCyberRight",
    description: "Download free cybersecurity checklists for families. Mobile money safety, scam prevention, and family internet agreements.",
    keywords: "printable safety checklist, cybersecurity PDF, family internet safety, download safety guide, senior safety checklist"
  });

  const handlePrint = (checklistId: string) => {
    const printContent = document.getElementById(`checklist-${checklistId}`);
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>GetCyberRight - Safety Checklist</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
                h1 { color: #1e293b; border-bottom: 2px solid #0d9488; padding-bottom: 10px; }
                h2 { color: #475569; font-size: 14px; margin-bottom: 20px; }
                ul { list-style: none; padding: 0; }
                li { padding: 12px 0; border-bottom: 1px solid #e2e8f0; display: flex; align-items: flex-start; gap: 10px; }
                li:before { content: "☐"; font-size: 18px; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #0d9488; font-size: 12px; color: #64748b; }
                .website { color: #0d9488; font-weight: bold; }
                @media print { body { padding: 20px; } }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
              <div class="footer">
                <p>More safety resources at <span class="website">GetCyberRight.com</span></p>
                <p>Share this checklist with family and friends to keep everyone safe online.</p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const colorClasses: Record<string, { bg: string; icon: string; border: string; badge: string }> = {
    orange: { bg: "bg-orange-50 dark:bg-orange-900/20", icon: "text-orange-600", border: "border-orange-200 dark:border-orange-800", badge: "bg-orange-100 text-orange-700" },
    green: { bg: "bg-green-50 dark:bg-green-900/20", icon: "text-green-600", border: "border-green-200 dark:border-green-800", badge: "bg-green-100 text-green-700" },
    purple: { bg: "bg-purple-50 dark:bg-purple-900/20", icon: "text-purple-600", border: "border-purple-200 dark:border-purple-800", badge: "bg-purple-100 text-purple-700" },
    blue: { bg: "bg-blue-50 dark:bg-blue-900/20", icon: "text-blue-600", border: "border-blue-200 dark:border-blue-800", badge: "bg-blue-100 text-blue-700" },
    teal: { bg: "bg-teal-50 dark:bg-teal-900/20", icon: "text-teal-600", border: "border-teal-200 dark:border-teal-800", badge: "bg-teal-100 text-teal-700" },
    indigo: { bg: "bg-indigo-50 dark:bg-indigo-900/20", icon: "text-indigo-600", border: "border-indigo-200 dark:border-indigo-800", badge: "bg-indigo-100 text-indigo-700" }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#0A2A3C] text-white py-12 md:py-16 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A2A3C] via-[#0A2A3C] to-[#00293C]" />
        <div className="absolute pointer-events-none hidden md:block" aria-hidden="true" style={{ top: 0, right: 0, width: "55%", height: "100%", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-40%", right: "2%", width: "50px", height: "220%", background: "linear-gradient(180deg, #003A52 0%, #0D4D66 50%, #003A52 100%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
          <div style={{ position: "absolute", top: "-40%", right: "10%", width: "2px", height: "220%", background: "linear-gradient(180deg, transparent 10%, rgba(45, 212, 191, 0.4) 50%, transparent 90%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
          <div style={{ position: "absolute", top: "-35%", right: "18%", width: "35px", height: "220%", background: "linear-gradient(180deg, #5eead4 0%, #2dd4bf 35%, #14b8a6 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.55 }} />
          <div style={{ position: "absolute", top: "-35%", right: "26%", width: "2px", height: "220%", background: "linear-gradient(180deg, transparent 15%, hsla(16, 95%, 58%, 0.35) 50%, transparent 85%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
          <div style={{ position: "absolute", top: "-30%", right: "32%", width: "50px", height: "220%", background: "linear-gradient(180deg, hsl(16, 100%, 62%) 0%, hsl(16, 95%, 52%) 40%, hsl(16, 90%, 42%) 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.5 }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6"
              variants={fadeInUp}
            >
              <Download className="h-4 w-4" />
              <span className="text-sm">Free Downloads</span>
            </motion.div>
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 tracking-[-0.025em]"
              variants={fadeInUp}
            >
              Printable Safety Checklists
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-white/70 leading-relaxed"
              variants={fadeInUp}
            >
              Print these checklists and share them with family members. Perfect for seniors who prefer paper guides, or to post on the fridge for everyone to see.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Back Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-3">
          <Link to="/tools" className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Tools
          </Link>
        </div>
      </div>

      {/* How to Use */}
      <section className="py-8 bg-teal-50 dark:bg-teal-900/20 border-b border-teal-200 dark:border-teal-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Printer className="h-5 w-5 text-teal-600" />
              <span className="text-slate-700 dark:text-slate-300">Click "Print" to print any checklist</span>
            </div>
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-teal-600" />
              <span className="text-slate-700 dark:text-slate-300">Share via WhatsApp with the share button</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-600" />
              <span className="text-slate-700 dark:text-slate-300">Post on the fridge or near devices</span>
            </div>
          </div>
        </div>
      </section>

      {/* Checklists Grid */}
      <section className="py-12 md:py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {checklists.map((checklist) => {
              const Icon = checklist.icon;
              const colors = colorClasses[checklist.color];
              
              return (
                <motion.div key={checklist.id} id={checklist.id} variants={fadeInUp} className="scroll-mt-24">
                  <Card className={`border-2 ${colors.border} h-full`}>
                    <CardHeader className={colors.bg}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.bg}`}>
                            <Icon className={`h-6 w-6 ${colors.icon}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{checklist.title}</CardTitle>
                            <p className="text-sm text-slate-500">{checklist.subtitle}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${colors.badge}`}>
                          {checklist.audience}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-5">
                      {/* Hidden printable content */}
                      <div id={`checklist-${checklist.id}`} className="hidden">
                        <h1>{checklist.title}</h1>
                        <h2>{checklist.subtitle} - For {checklist.audience}</h2>
                        <ul>
                          {checklist.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Visible checklist */}
                      <ul className="space-y-3 mb-6">
                        {checklist.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700 dark:text-slate-300">{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex gap-3">
                        <Button 
                          onClick={() => handlePrint(checklist.id)}
                          className="flex-1 gap-2"
                          variant="outline"
                        >
                          <Printer className="h-4 w-4" />
                          Print
                        </Button>
                        <Button 
                          onClick={() => {
                            const text = `${checklist.title}\n\n${checklist.items.map((item, i) => `${i+1}. ${item}`).join('\n')}\n\nMore tips at GetCyberRight.com`;
                            const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                            window.open(url, '_blank');
                          }}
                          className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Share on WhatsApp
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-slate-100 dark:bg-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Help Protect Your Community
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-6">
            Print these checklists for elderly neighbors, church groups, or community centers. 
            Together we can reduce scam victims in our communities.
          </p>
          <Button 
            size="lg" 
            onClick={() => {
              checklists.forEach(c => handlePrint(c.id));
            }}
            className="gap-2 mb-8"
          >
            <Printer className="h-5 w-5" />
            Print All Checklists
          </Button>
          <div className="max-w-2xl mx-auto">
            <ShareCallToAction />
          </div>
        </div>
      </section>
    </div>
  );
}
