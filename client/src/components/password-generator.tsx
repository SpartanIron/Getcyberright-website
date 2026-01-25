import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCryptoWorker } from "@/hooks/use-crypto-worker";
import { 
  Copy, 
  RefreshCw, 
  Shield, 
  Key, 
  Lock, 
  Hash,
  Fingerprint,
  CheckCircle,
  AlertTriangle,
  Zap,
  Loader2
} from "lucide-react";

function calculateStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (password.length >= 24) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  
  if (score <= 3) return { score: 25, label: "Weak", color: "bg-red-500" };
  if (score <= 5) return { score: 50, label: "Fair", color: "bg-yellow-500" };
  if (score <= 7) return { score: 75, label: "Strong", color: "bg-blue-500" };
  return { score: 100, label: "Very Strong", color: "bg-green-500" };
}

interface GeneratedKey {
  value: string;
  type: string;
  bits?: number;
}

export function PasswordGenerator() {
  const { toast } = useToast();
  const { isReady, wordListLength, generatePassword, generatePassphrase, generateKeys } = useCryptoWorker();
  const [activeTab, setActiveTab] = useState("password");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [passwordLength, setPasswordLength] = useState(16);
  const [passwordOptions, setPasswordOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });
  const [generatedPassword, setGeneratedPassword] = useState("");
  
  const [passphraseWords, setPassphraseWords] = useState(4);
  const [passphraseSeparator, setPassphraseSeparator] = useState("-");
  const [generatedPassphrase, setGeneratedPassphrase] = useState("");
  
  const [generatedKeyList, setGeneratedKeyList] = useState<GeneratedKey[]>([]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Key copied to clipboard securely.",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Please select and copy manually.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const regeneratePassword = useCallback(async () => {
    if (!isReady) return;
    setIsGenerating(true);
    try {
      const result = await generatePassword({
        length: passwordLength,
        uppercase: passwordOptions.uppercase,
        lowercase: passwordOptions.lowercase,
        numbers: passwordOptions.numbers,
        symbols: passwordOptions.symbols,
      });
      setGeneratedPassword(result);
    } finally {
      setIsGenerating(false);
    }
  }, [isReady, generatePassword, passwordLength, passwordOptions]);

  const regeneratePassphraseHandler = useCallback(async () => {
    if (!isReady) return;
    setIsGenerating(true);
    try {
      const result = await generatePassphrase({
        wordCount: passphraseWords,
        separator: passphraseSeparator,
      });
      setGeneratedPassphrase(result);
    } finally {
      setIsGenerating(false);
    }
  }, [isReady, generatePassphrase, passphraseWords, passphraseSeparator]);

  const regenerateKeysHandler = useCallback(async () => {
    if (!isReady) return;
    setIsGenerating(true);
    try {
      const result = await generateKeys();
      setGeneratedKeyList(result);
    } finally {
      setIsGenerating(false);
    }
  }, [isReady, generateKeys]);

  const passwordStrength = generatedPassword ? calculateStrength(generatedPassword) : null;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Password</span>
          </TabsTrigger>
          <TabsTrigger value="passphrase" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">Passphrase</span>
          </TabsTrigger>
          <TabsTrigger value="keys" className="flex items-center gap-2">
            <Fingerprint className="h-4 w-4" />
            <span className="hidden sm:inline">Keys</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="password" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-teal-500" />
                Secure Password
              </CardTitle>
              <CardDescription>
                Create strong passwords for websites and apps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Password Length: {passwordLength} characters</Label>
                <Slider
                  value={[passwordLength]}
                  onValueChange={([value]) => setPasswordLength(value)}
                  min={8}
                  max={64}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>8</span>
                  <span>32</span>
                  <span>64</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="uppercase"
                    checked={passwordOptions.uppercase}
                    onCheckedChange={(checked) => setPasswordOptions(prev => ({ ...prev, uppercase: checked }))}
                  />
                  <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="lowercase"
                    checked={passwordOptions.lowercase}
                    onCheckedChange={(checked) => setPasswordOptions(prev => ({ ...prev, lowercase: checked }))}
                  />
                  <Label htmlFor="lowercase">Lowercase (a-z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="numbers"
                    checked={passwordOptions.numbers}
                    onCheckedChange={(checked) => setPasswordOptions(prev => ({ ...prev, numbers: checked }))}
                  />
                  <Label htmlFor="numbers">Numbers (0-9)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="symbols"
                    checked={passwordOptions.symbols}
                    onCheckedChange={(checked) => setPasswordOptions(prev => ({ ...prev, symbols: checked }))}
                  />
                  <Label htmlFor="symbols">Symbols (!@#$)</Label>
                </div>
              </div>

              <Button onClick={regeneratePassword} className="w-full" size="lg" disabled={!isReady || isGenerating}>
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Generate Password
              </Button>

              {generatedPassword && (
                <div className="space-y-3">
                  <div 
                    className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-lg break-all cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    onClick={() => copyToClipboard(generatedPassword)}
                  >
                    {generatedPassword}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {passwordStrength && passwordStrength.score === 100 ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : passwordStrength && passwordStrength.score >= 75 ? (
                        <Shield className="h-4 w-4 text-blue-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="text-sm font-medium">{passwordStrength?.label}</span>
                      <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${passwordStrength?.color || ''} transition-all`}
                          style={{ width: `${passwordStrength?.score || 0}%` }}
                        />
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedPassword)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="passphrase" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-teal-500" />
                Memorable Passphrase
              </CardTitle>
              <CardDescription>
                Easy to remember, hard to crack word-based passphrases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Number of Words: {passphraseWords}</Label>
                <Slider
                  value={[passphraseWords]}
                  onValueChange={([value]) => setPassphraseWords(value)}
                  min={3}
                  max={8}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>3 words</span>
                  <span>5 words</span>
                  <span>8 words</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Word Separator</Label>
                <div className="flex gap-2">
                  {["-", "_", ".", " "].map((sep) => (
                    <Button
                      key={sep}
                      variant={passphraseSeparator === sep ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPassphraseSeparator(sep)}
                      className="font-mono"
                    >
                      {sep === " " ? "space" : sep}
                    </Button>
                  ))}
                </div>
              </div>

              <Button onClick={regeneratePassphraseHandler} className="w-full" size="lg" disabled={!isReady || isGenerating}>
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Generate Passphrase
              </Button>

              {generatedPassphrase && (
                <div className="space-y-3">
                  <div 
                    className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-lg break-all cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    onClick={() => copyToClipboard(generatedPassphrase)}
                  >
                    {generatedPassphrase}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Zap className="h-4 w-4" />
                      <span>~{Math.round(passphraseWords * Math.log2(wordListLength))} bits of entropy</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedPassphrase)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keys" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-teal-500" />
                Encryption Keys & Tokens
              </CardTitle>
              <CardDescription>
                Generate UUIDs, hex keys, JWT secrets, and API keys
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={regenerateKeysHandler} className="w-full" size="lg" disabled={!isReady || isGenerating}>
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Generate All Keys
              </Button>

              {generatedKeyList.length > 0 && (
                <div className="space-y-3">
                  {generatedKeyList.map((key, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => copyToClipboard(key.value)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{key.type}</Badge>
                        <span className="text-xs text-muted-foreground">{key.bits}b</span>
                      </div>
                      <code className="text-sm font-mono break-all block">{key.value}</code>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-teal-600 dark:text-teal-400 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-teal-800 dark:text-teal-200">
                Your Privacy is Protected
              </p>
              <p className="text-sm text-teal-700 dark:text-teal-300">
                All keys are generated locally in your browser using the Web Crypto API.
                Generation runs in an isolated thread for added security.
                Nothing is sent to our servers or stored anywhere.
                Copy your key promptly and store it in a password manager.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
