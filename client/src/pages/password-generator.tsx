import { useSEO } from "@/hooks/use-seo";
import { PasswordGenerator } from "@/components/password-generator";
import { ShareCallToAction } from "@/components/social-share";
import { Shield, Key, Lock, ArrowLeft, Zap, Eye, CheckCircle, Lightbulb, BookOpen, Wifi, Database, Server, Globe, Smartphone, FileKey } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TechPatternBg } from "@/components/tech-pattern-bg";

export default function PasswordGeneratorPage() {
  useSEO({
    title: "Security Key Generator (SKG) - Create Secure Keys & Passwords | GetCyberRight",
    description: "Generate secure passwords, passphrases, API keys, encryption keys, UUIDs, and JWT secrets. Runs locally in your browser for maximum privacy.",
    keywords: "security key generator, password generator, API key generator, encryption key, JWT secret, UUID generator, passphrase, secure password"
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      <TechPatternBg variant="matrix" />
      
      <div className="relative container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">SKG</Badge>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white mb-4">
              <Key className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Security Key Generator
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Generate secure passwords, encryption keys, API tokens, and more. 
              Everything runs locally in your browser for complete privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur">
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-3">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="font-semibold mb-1">100% Private</h3>
                <p className="text-sm text-muted-foreground">Generated locally, never transmitted</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur">
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-3">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-semibold mb-1">Cryptographic</h3>
                <p className="text-sm text-muted-foreground">Uses Web Crypto API</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur">
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-3">
                  <Eye className="h-5 w-5" />
                </div>
                <h3 className="font-semibold mb-1">No Tracking</h3>
                <p className="text-sm text-muted-foreground">Zero data collection</p>
              </CardContent>
            </Card>
          </div>

          <PasswordGenerator />

          <div className="mt-10 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-teal-500" />
                  How to Use the Security Key Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="border-l-4 border-teal-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">Step 1: Choose Your Key Type</h3>
                    <p className="text-muted-foreground">
                      Select from three tabs based on what you need:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li><strong>Password</strong> - For website logins, apps, and services</li>
                      <li><strong>Passphrase</strong> - Word-based keys that are easy to remember</li>
                      <li><strong>Keys</strong> - Technical keys for developers (API keys, UUIDs, encryption)</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">Step 2: Customize Your Settings</h3>
                    <p className="text-muted-foreground">
                      Adjust the options to match your requirements:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li><strong>Length</strong> - Longer keys are more secure (16+ characters recommended)</li>
                      <li><strong>Character types</strong> - Include uppercase, numbers, and symbols for stronger keys</li>
                      <li><strong>Word count</strong> - For passphrases, 4+ words provides excellent security</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">Step 3: Generate and Copy</h3>
                    <p className="text-muted-foreground">
                      Click the generate button to create your key. Then:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>Click anywhere on the key to copy it to your clipboard</li>
                      <li>Or use the Copy button for confirmation</li>
                      <li>Generate multiple times until you find one you like</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-amber-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">Step 4: Store Securely</h3>
                    <p className="text-muted-foreground">
                      Save your new key in a safe place:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>Use a password manager (recommended)</li>
                      <li>For technical keys, store in environment variables or secret managers</li>
                      <li>Never share keys via email or messaging apps</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Common Use Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="everyday" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="everyday">Everyday Use</TabsTrigger>
                    <TabsTrigger value="technical">Technical Use</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="everyday" className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <Globe className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Website Accounts</h4>
                          <p className="text-sm text-muted-foreground">
                            Generate unique 16+ character passwords for each website. Use the Password tab with all character types enabled.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <Wifi className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">WiFi Passwords</h4>
                          <p className="text-sm text-muted-foreground">
                            Create a strong WPA password. Use alphanumeric (no symbols) for better device compatibility.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <Smartphone className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Device PINs</h4>
                          <p className="text-sm text-muted-foreground">
                            For numeric PINs, generate a password with only numbers enabled, then use the first 6-8 digits.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <FileKey className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Encrypted Files</h4>
                          <p className="text-sm text-muted-foreground">
                            Use a memorable passphrase (4-6 words) for encrypted ZIP files, documents, or backup drives.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="technical" className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <Server className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">API Keys</h4>
                          <p className="text-sm text-muted-foreground">
                            Use the Keys tab to generate API keys with the sk_live prefix format. Store in environment variables.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <Shield className="h-5 w-5 text-teal-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">JWT Secrets</h4>
                          <p className="text-sm text-muted-foreground">
                            Generate 256-bit Base64 encoded secrets for signing JSON Web Tokens in your authentication system.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <Lock className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Encryption Keys</h4>
                          <p className="text-sm text-muted-foreground">
                            Use 128-bit or 256-bit hex keys for AES encryption, database field encryption, or secure data storage.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <Database className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">UUIDs</h4>
                          <p className="text-sm text-muted-foreground">
                            Generate UUID v4 identifiers for database primary keys, session IDs, or unique resource identifiers.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Security Best Practices
                </h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                    <span>Use a unique key for every account or service. Never reuse keys across systems.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                    <span>Longer is stronger. Aim for at least 16 characters for passwords, 4+ words for passphrases.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                    <span>Store keys in a password manager or secure secret management system.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                    <span>Enable two-factor authentication (2FA) wherever available for extra protection.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                    <span>Consider adopting passkeys (passwordless) when services support them for the future of authentication.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <ShareCallToAction />
          </div>
        </div>
      </div>
    </div>
  );
}
