import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Shield, Copy, Check, LogIn, ExternalLink } from "lucide-react";
import { Link } from "@/lib/navigation";

export default function ExtensionAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: user, isLoading: userLoading } = useQuery<any>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const generateToken = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/extension/auth/token");
      return await res.json();
    },
    onSuccess: (data) => {
      setToken(data.token);
    },
  });

  const handleCopy = async () => {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      const el = document.createElement("textarea");
      el.value = token;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Connect Extension | GetCyberRight"
        description="Connect your GCR Scam Guard browser extension to your GetCyberRight account."
      />
      <Navigation />

      <main id="main-content" tabIndex={-1} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold" data-testid="heading-extension-auth">Connect GCR Scam Guard</h1>
            <p className="text-muted-foreground mt-2">
              Link your browser extension to your GetCyberRight account to unlock premium features.
            </p>
          </div>

          {userLoading ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Loading...</p>
              </CardContent>
            </Card>
          ) : !user ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground mb-4">
                  Sign in to your GetCyberRight account to connect your extension.
                </p>
                <div className="flex flex-col gap-3">
                  <Link href="/login">
                    <Button className="w-full" data-testid="button-login">
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" className="w-full" data-testid="button-register">
                      Create Account
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : !token ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-1">Signed in as</p>
                <p className="font-medium mb-4" data-testid="text-user-email">{user.email}</p>
                <p className="text-sm text-muted-foreground mb-1">Subscription</p>
                <p className="font-medium mb-6 capitalize" data-testid="text-user-tier">
                  {user.subscriptionTier === "essential" ? "Pro" : user.subscriptionTier === "professional" ? "Family" : user.subscriptionTier || "Free"}
                </p>
                <Button
                  className="w-full"
                  onClick={() => generateToken.mutate()}
                  disabled={generateToken.isPending}
                  data-testid="button-generate-token"
                >
                  {generateToken.isPending ? "Generating..." : "Generate Extension Token"}
                </Button>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  This generates a secure token that connects your extension to your account.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-700 dark:text-green-400">Token Generated</span>
                </div>

                <div className="bg-muted rounded-lg p-3 mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Your extension token:</p>
                  <code className="text-xs break-all block font-mono" data-testid="text-token">{token}</code>
                </div>

                <Button
                  className="w-full mb-4"
                  onClick={handleCopy}
                  variant={copied ? "default" : "outline"}
                  data-testid="button-copy-token"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" /> Copy Token
                    </>
                  )}
                </Button>

                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-semibold text-sm mb-2">How to connect:</h3>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Copy the token above</li>
                    <li>Open the GCR Scam Guard extension popup</li>
                    <li>Click the settings gear icon</li>
                    <li>Scroll to "Account" and click "Sign In"</li>
                    <li>Paste your token and click Connect</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-6 text-center">
            <Link href="/gcr-guard-pricing">
              <Button variant="link" className="text-sm" data-testid="link-view-plans">
                View subscription plans
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
