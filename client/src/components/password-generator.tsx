import { useState, useCallback, useEffect } from "react";
import { trackToolUsage } from "@/lib/analytics";
import { SignupEncouragementBanner } from "@/components/signup-encouragement-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  RefreshCw, 
  Check, 
  Lock, 
  Shield, 
  Key,
  Clock,
  Zap,
  Eye,
  EyeOff,
  Info
} from "lucide-react";

const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numberChars = "0123456789";
const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const easySymbols = "!@#$%&*?";

const wordList = [
  "apple", "brave", "cloud", "dance", "eagle", "flame", "grape", "house", "ivory", "joker",
  "knife", "lemon", "maple", "noble", "ocean", "piano", "queen", "river", "stone", "tiger",
  "unity", "vivid", "water", "xenon", "youth", "zebra", "arrow", "beach", "candy", "delta",
  "earth", "frost", "giant", "heart", "input", "jewel", "karma", "light", "magic", "night",
  "olive", "pearl", "quest", "radar", "solar", "train", "urban", "vocal", "world", "yield",
  "amber", "blaze", "crisp", "dream", "ember", "forge", "grain", "haven", "index", "jolly",
  "lunar", "metro", "nexus", "orbit", "prism", "quilt", "roast", "spark", "twist", "ultra"
];

function generatePassword(
  length: number,
  includeUppercase: boolean,
  includeNumbers: boolean,
  includeSymbols: boolean,
  easyToType: boolean
): string {
  let chars = lowercaseChars;
  if (includeUppercase) chars += uppercaseChars;
  if (includeNumbers) chars += numberChars;
  if (includeSymbols) chars += easyToType ? easySymbols : symbolChars;

  const requiredChars: string[] = [];
  
  if (includeUppercase) {
    const idx = crypto.getRandomValues(new Uint32Array(1))[0] % uppercaseChars.length;
    requiredChars.push(uppercaseChars[idx]);
  }
  if (includeNumbers) {
    const idx = crypto.getRandomValues(new Uint32Array(1))[0] % numberChars.length;
    requiredChars.push(numberChars[idx]);
  }
  if (includeSymbols) {
    const symbols = easyToType ? easySymbols : symbolChars;
    const idx = crypto.getRandomValues(new Uint32Array(1))[0] % symbols.length;
    requiredChars.push(symbols[idx]);
  }

  let password = "";
  const remainingLength = length - requiredChars.length;
  const array = new Uint32Array(remainingLength);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < remainingLength; i++) {
    password += chars[array[i] % chars.length];
  }
  
  for (const char of requiredChars) {
    const pos = crypto.getRandomValues(new Uint32Array(1))[0] % (password.length + 1);
    password = password.slice(0, pos) + char + password.slice(pos);
  }
  
  return password;
}

function generatePassphrase(wordCount: number, separator: string, capitalize: boolean, includeNumber: boolean): string {
  const words: string[] = [];
  const array = new Uint32Array(wordCount);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < wordCount; i++) {
    let word = wordList[array[i] % wordList.length];
    if (capitalize) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    words.push(word);
  }
  
  let passphrase = words.join(separator);
  
  if (includeNumber) {
    const num = crypto.getRandomValues(new Uint32Array(1))[0] % 1000;
    passphrase += separator + num;
  }
  
  return passphrase;
}

function calculateEntropy(
  length: number,
  includeUppercase: boolean,
  includeNumbers: boolean,
  includeSymbols: boolean
): number {
  let poolSize = 26; // lowercase
  if (includeUppercase) poolSize += 26;
  if (includeNumbers) poolSize += 10;
  if (includeSymbols) poolSize += 26;
  
  return Math.floor(length * Math.log2(poolSize));
}

function calculatePassphraseEntropy(wordCount: number, includeNumber: boolean): number {
  const wordEntropy = wordCount * Math.log2(wordList.length);
  const numberEntropy = includeNumber ? Math.log2(1000) : 0;
  return Math.floor(wordEntropy + numberEntropy);
}

function getTimeToCrack(entropy: number): string {
  // Assuming 10 billion guesses per second (modern hardware)
  const guessesPerSecond = 10_000_000_000;
  const totalCombinations = Math.pow(2, entropy);
  const secondsToCrack = totalCombinations / (2 * guessesPerSecond); // Average is half
  
  if (secondsToCrack < 1) return "Instant";
  if (secondsToCrack < 60) return `${Math.floor(secondsToCrack)} seconds`;
  if (secondsToCrack < 3600) return `${Math.floor(secondsToCrack / 60)} minutes`;
  if (secondsToCrack < 86400) return `${Math.floor(secondsToCrack / 3600)} hours`;
  if (secondsToCrack < 31536000) return `${Math.floor(secondsToCrack / 86400)} days`;
  if (secondsToCrack < 31536000 * 100) return `${Math.floor(secondsToCrack / 31536000)} years`;
  if (secondsToCrack < 31536000 * 1000000) return `${Math.floor(secondsToCrack / (31536000 * 1000)).toLocaleString()}K years`;
  if (secondsToCrack < 31536000 * 1000000000) return `${Math.floor(secondsToCrack / (31536000 * 1000000)).toLocaleString()}M years`;
  return "Billions of years";
}

function getStrengthInfo(entropy: number): { label: string; color: string; percentage: number; description: string } {
  if (entropy < 28) return { label: "Very Weak", color: "bg-red-500", percentage: 10, description: "Can be cracked instantly" };
  if (entropy < 36) return { label: "Weak", color: "bg-red-400", percentage: 25, description: "Vulnerable to attacks" };
  if (entropy < 60) return { label: "Fair", color: "bg-yellow-500", percentage: 50, description: "Provides moderate protection" };
  if (entropy < 80) return { label: "Strong", color: "bg-green-500", percentage: 75, description: "Resistant to most attacks" };
  if (entropy < 100) return { label: "Very Strong", color: "bg-green-600", percentage: 90, description: "Highly secure" };
  return { label: "Excellent", color: "bg-emerald-600", percentage: 100, description: "Virtually uncrackable" };
}

export function PasswordGenerator() {
  const [mode, setMode] = useState<"password" | "passphrase">("password");
  const [showPassword, setShowPassword] = useState(true);
  
  // Password options
  const [length, setLength] = useState(20);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [easyToType, setEasyToType] = useState(false);
  
  // Passphrase options
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState("-");
  const [capitalizeWords, setCapitalizeWords] = useState(true);
  const [includePassphraseNumber, setIncludePassphraseNumber] = useState(true);
  
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const regenerate = useCallback(() => {
    if (mode === "password") {
      setOutput(generatePassword(length, includeUppercase, includeNumbers, includeSymbols, easyToType));
    } else {
      setOutput(generatePassphrase(wordCount, separator, capitalizeWords, includePassphraseNumber));
    }
    setCopied(false);
    
    // Track tool usage per regeneration
    trackToolUsage('password-generator', true, { mode });
  }, [mode, length, includeUppercase, includeNumbers, includeSymbols, easyToType, wordCount, separator, capitalizeWords, includePassphraseNumber]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy");
    }
  };

  const entropy = mode === "password" 
    ? calculateEntropy(length, includeUppercase, includeNumbers, includeSymbols)
    : calculatePassphraseEntropy(wordCount, includePassphraseNumber);
  
  const strength = getStrengthInfo(entropy);
  const timeToCrack = getTimeToCrack(entropy);

  return (
    <Card className="w-full" data-testid="card-password-generator">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Key className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Advanced Password Generator</CardTitle>
            <p className="text-sm text-muted-foreground">Create unbreakable passwords and passphrases</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={mode} onValueChange={(v) => setMode(v as "password" | "passphrase")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="password" className="gap-2">
              <Lock className="w-4 h-4" />
              Random Password
            </TabsTrigger>
            <TabsTrigger value="passphrase" className="gap-2">
              <Key className="w-4 h-4" />
              Passphrase
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative" role="region" aria-label="Generated password display">
          <div 
            className="w-full p-4 pr-24 bg-muted rounded-lg font-mono text-lg break-all min-h-[60px] flex items-center"
            aria-live="polite"
            aria-label={showPassword ? "Generated password" : "Generated password hidden"}
            data-testid="text-generated-password"
          >
            {showPassword ? output : "•".repeat(output.length)}
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <Button 
              size="icon" 
              variant="ghost"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              data-testid="button-toggle-visibility"
            >
              {showPassword ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
            </Button>
            <Button 
              size="icon" 
              variant="ghost"
              onClick={regenerate}
              aria-label="Generate new password"
              data-testid="button-regenerate-password"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost"
              onClick={copyToClipboard}
              aria-label={copied ? "Password copied" : "Copy password to clipboard"}
              data-testid="button-copy-password"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Entropy</span>
            </div>
            <span className="text-2xl font-bold">{entropy} bits</span>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Time to Crack</span>
            </div>
            <span className="text-2xl font-bold">{timeToCrack}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Strength</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{strength.label}</Badge>
              <span className="text-xs text-muted-foreground">{strength.description}</span>
            </div>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full ${strength.color} transition-all duration-500`}
              style={{ width: `${strength.percentage}%` }}
            />
          </div>
        </div>

        {mode === "password" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Password Length</Label>
                <span className="text-sm font-medium tabular-nums">{length} characters</span>
              </div>
              <Slider
                value={[length]}
                onValueChange={(value) => setLength(value[0])}
                min={8}
                max={64}
                step={1}
                data-testid="slider-password-length"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>8 (min)</span>
                <span>64 (max)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between gap-2 p-3 bg-muted/50 rounded-lg">
                <Label htmlFor="uppercase" className="text-sm cursor-pointer">Uppercase (A-Z)</Label>
                <Switch
                  id="uppercase"
                  checked={includeUppercase}
                  onCheckedChange={setIncludeUppercase}
                  data-testid="switch-uppercase"
                />
              </div>
              <div className="flex items-center justify-between gap-2 p-3 bg-muted/50 rounded-lg">
                <Label htmlFor="numbers" className="text-sm cursor-pointer">Numbers (0-9)</Label>
                <Switch
                  id="numbers"
                  checked={includeNumbers}
                  onCheckedChange={setIncludeNumbers}
                  data-testid="switch-numbers"
                />
              </div>
              <div className="flex items-center justify-between gap-2 p-3 bg-muted/50 rounded-lg">
                <Label htmlFor="symbols" className="text-sm cursor-pointer">Symbols (!@#$)</Label>
                <Switch
                  id="symbols"
                  checked={includeSymbols}
                  onCheckedChange={setIncludeSymbols}
                  data-testid="switch-symbols"
                />
              </div>
              <div className="flex items-center justify-between gap-2 p-3 bg-muted/50 rounded-lg">
                <Label htmlFor="easyToType" className="text-sm cursor-pointer">Easy to Type</Label>
                <Switch
                  id="easyToType"
                  checked={easyToType}
                  onCheckedChange={setEasyToType}
                  data-testid="switch-easy-type"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Number of Words</Label>
                <span className="text-sm font-medium tabular-nums">{wordCount} words</span>
              </div>
              <Slider
                value={[wordCount]}
                onValueChange={(value) => setWordCount(value[0])}
                min={3}
                max={8}
                step={1}
                data-testid="slider-word-count"
              />
            </div>

            <div className="space-y-2">
              <Label>Word Separator</Label>
              <div className="flex gap-2">
                {["-", "_", ".", " ", ""].map((sep) => (
                  <Button
                    key={sep || "none"}
                    variant={separator === sep ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSeparator(sep)}
                    className="min-w-[48px]"
                    data-testid={`button-separator-${sep || "none"}`}
                  >
                    {sep === "" ? "none" : sep === " " ? "space" : sep}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between gap-2 p-3 bg-muted/50 rounded-lg">
                <Label htmlFor="capitalize" className="text-sm cursor-pointer">Capitalize Words</Label>
                <Switch
                  id="capitalize"
                  checked={capitalizeWords}
                  onCheckedChange={setCapitalizeWords}
                  data-testid="switch-capitalize"
                />
              </div>
              <div className="flex items-center justify-between gap-2 p-3 bg-muted/50 rounded-lg">
                <Label htmlFor="addNumber" className="text-sm cursor-pointer">Add Number</Label>
                <Switch
                  id="addNumber"
                  checked={includePassphraseNumber}
                  onCheckedChange={setIncludePassphraseNumber}
                  data-testid="switch-add-number"
                />
              </div>
            </div>
          </div>
        )}

        <SignupEncouragementBanner
          toolName="password-generator"
          show={copied}
          contextMessage="Like this tool? There's more for free."
        />

        <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
          <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-green-800 dark:text-green-200 mb-1">100% Private & Secure</p>
            <p className="text-green-700 dark:text-green-300">
              Generated entirely in your browser using cryptographic randomness. 
              We never see, store, or transmit your passwords.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
          <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Password Tips</p>
            <ul className="space-y-1">
              <li>• Use a unique password for every account</li>
              <li>• Store passwords in a password manager, not your browser</li>
              <li>• Enable two-factor authentication (2FA) whenever possible</li>
              <li>• Passphrases are often easier to remember and just as secure</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
