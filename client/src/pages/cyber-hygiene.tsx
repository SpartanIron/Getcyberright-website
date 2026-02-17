import { CyberHygieneSelfCheck } from "@/components/cyber-hygiene-self-check";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, TrendingUp, Users, Lock, Eye, Wifi, Smartphone, AlertTriangle, FileCheck, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";
import { AnimatedCyberBackground } from "@/components/animated-cyber-background";
import { ShareCallToAction } from "@/components/social-share";

export default function CyberHygiene() {
  useSEO({
    title: "Cyber Hygiene Self-Check | GetCyberRight",
    description: "Free security assessment to evaluate your digital safety. Get personalized recommendations in just 5 minutes.",
    keywords: "cyber hygiene, security assessment, online safety check, digital safety score, password strength test, security quiz"
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Back Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-3">
          <Link to="/tools" className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Tools
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <AnimatedCyberBackground />
        <div className="relative container mx-auto px-4">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Cyber Hygiene Self-Check
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Evaluate your current cybersecurity practices and receive personalized recommendations 
              to strengthen your digital security posture.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Feature Benefits */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Comprehensive Assessment</h3>
              <p className="text-sm text-muted-foreground">
                10 essential security areas covering authentication, system security, and privacy
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Personalized Report</h3>
              <p className="text-sm text-muted-foreground">
                Get your security score with detailed strengths and improvement areas
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Expert Guidance</h3>
              <p className="text-sm text-muted-foreground">
                Actionable recommendations from cybersecurity professionals
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-4 py-2">
            ✓ Free Assessment
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-4 py-2">
            ✓ Instant Results
          </Badge>
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-4 py-2">
            ✓ Downloadable Guide
          </Badge>
        </div>

        <div className="flex justify-center">
          <CyberHygieneSelfCheck />
        </div>

        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-0 shadow-lg max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Why Cyber Hygiene Matters
              </h2>
              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                    Personal Protection
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>• Protect your personal and financial information</li>
                    <li>• Prevent identity theft and fraud</li>
                    <li>• Secure your digital communications</li>
                    <li>• Maintain privacy on social platforms</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                    Professional Security
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>• Protect company data and systems</li>
                    <li>• Comply with security regulations</li>
                    <li>• Reduce risk of cyber attacks</li>
                    <li>• Build security-conscious culture</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Security Areas Section */}
        <section className="mt-16 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-8">
            10 Essential Areas of Cyber Hygiene
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white dark:bg-slate-800 border-0 shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Password Security</h3>
                </div>
                <p className="text-sm text-muted-foreground">Use unique, complex passwords for each account. Consider a password manager to generate and store passwords securely.</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-0 shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Two-Factor Authentication</h3>
                </div>
                <p className="text-sm text-muted-foreground">Enable 2FA on all important accounts. Use authenticator apps instead of SMS for stronger protection.</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-0 shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Software Updates</h3>
                </div>
                <p className="text-sm text-muted-foreground">Keep your operating system, apps, and browsers updated. Updates often fix security vulnerabilities.</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-0 shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Antivirus Protection</h3>
                </div>
                <p className="text-sm text-muted-foreground">Install reputable antivirus software and keep it updated. Run regular scans to detect malware and threats.</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-0 shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <FileCheck className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Data Backups</h3>
                </div>
                <p className="text-sm text-muted-foreground">Regularly back up important files to an external drive or cloud storage. Follow the 3-2-1 backup rule.</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-0 shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                    <Wifi className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Secure WiFi</h3>
                </div>
                <p className="text-sm text-muted-foreground">Use strong WiFi passwords, avoid public networks for sensitive tasks, and consider a VPN when traveling.</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-0 shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                    <Eye className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Privacy Settings</h3>
                </div>
                <p className="text-sm text-muted-foreground">Review privacy settings on social media and apps. Limit what personal information you share publicly.</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-0 shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Device Security</h3>
                </div>
                <p className="text-sm text-muted-foreground">Lock your devices with PINs, fingerprints, or face recognition. Enable remote wipe capabilities.</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-0 shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Phishing Awareness</h3>
                </div>
                <p className="text-sm text-muted-foreground">Learn to recognize phishing emails and texts. Never click suspicious links or download unexpected attachments.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tips Section */}
        <section className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Quick Security Wins You Can Do Today
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">In 5 Minutes</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Enable two-factor authentication on your email account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Update your phone's operating system</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Check if your email appears in data breaches (haveibeenpwned.com)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">In 30 Minutes</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Set up a password manager and migrate your top 10 passwords</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Review and tighten privacy settings on Facebook/Instagram</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Back up your phone photos to cloud storage</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Share CTA */}
        <div className="mt-12 max-w-4xl mx-auto">
          <ShareCallToAction />
        </div>
      </div>
    </div>
  );
}