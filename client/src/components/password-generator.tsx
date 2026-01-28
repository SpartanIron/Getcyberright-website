import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Copy, RefreshCw, Check, Lock, Shield } from "lucide-react";

const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numberChars = "0123456789";
const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function generatePassword(
  length: number,
  includeUppercase: boolean,
  includeNumbers: boolean,
  includeSymbols: boolean
): string {
  let chars = lowercaseChars;
  if (includeUppercase) chars += uppercaseChars;
  if (includeNumbers) chars += numberChars;
  if (includeSymbols) chars += symbolChars;

  let password = "";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }
  
  return password;
}

function getPasswordStrength(
  length: number,
  includeUppercase: boolean,
  includeNumbers: boolean,
  includeSymbols: boolean
): { label: string; color: string; percentage: number } {
  let score = 0;
  
  if (length >= 8) score += 1;
  if (length >= 12) score += 1;
  if (length >= 16) score += 1;
  if (length >= 20) score += 1;
  if (includeUppercase) score += 1;
  if (includeNumbers) score += 1;
  if (includeSymbols) score += 2;

  if (score <= 2) return { label: "Weak", color: "bg-red-500", percentage: 25 };
  if (score <= 4) return { label: "Fair", color: "bg-yellow-500", percentage: 50 };
  if (score <= 6) return { label: "Strong", color: "bg-green-500", percentage: 75 };
  return { label: "Very Strong", color: "bg-green-600", percentage: 100 };
}

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState(() => 
    generatePassword(16, true, true, true)
  );
  const [copied, setCopied] = useState(false);

  const regenerate = useCallback(() => {
    setPassword(generatePassword(length, includeUppercase, includeNumbers, includeSymbols));
    setCopied(false);
  }, [length, includeUppercase, includeNumbers, includeSymbols]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy password");
    }
  };

  const strength = getPasswordStrength(length, includeUppercase, includeNumbers, includeSymbols);

  return (
    <Card className="w-full" data-testid="card-password-generator">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Password Generator</CardTitle>
            <p className="text-sm text-muted-foreground">Create strong, unique passwords instantly</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <div 
            className="w-full p-4 bg-muted rounded-lg font-mono text-lg break-all select-all"
            data-testid="text-generated-password"
          >
            {password}
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <Button 
              size="icon" 
              variant="ghost"
              onClick={regenerate}
              data-testid="button-regenerate-password"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost"
              onClick={copyToClipboard}
              data-testid="button-copy-password"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Strength</span>
            <span className="font-medium">{strength.label}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full ${strength.color} transition-all duration-300`}
              style={{ width: `${strength.percentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Password Length</Label>
              <span className="text-sm font-medium">{length} characters</span>
            </div>
            <Slider
              value={[length]}
              onValueChange={(value) => {
                setLength(value[0]);
                setPassword(generatePassword(value[0], includeUppercase, includeNumbers, includeSymbols));
              }}
              min={8}
              max={32}
              step={1}
              data-testid="slider-password-length"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center justify-between gap-2 p-3 bg-muted/50 rounded-lg">
              <Label htmlFor="uppercase" className="text-sm cursor-pointer">Uppercase (A-Z)</Label>
              <Switch
                id="uppercase"
                checked={includeUppercase}
                onCheckedChange={(checked) => {
                  setIncludeUppercase(checked);
                  setPassword(generatePassword(length, checked, includeNumbers, includeSymbols));
                }}
                data-testid="switch-uppercase"
              />
            </div>
            <div className="flex items-center justify-between gap-2 p-3 bg-muted/50 rounded-lg">
              <Label htmlFor="numbers" className="text-sm cursor-pointer">Numbers (0-9)</Label>
              <Switch
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={(checked) => {
                  setIncludeNumbers(checked);
                  setPassword(generatePassword(length, includeUppercase, checked, includeSymbols));
                }}
                data-testid="switch-numbers"
              />
            </div>
            <div className="flex items-center justify-between gap-2 p-3 bg-muted/50 rounded-lg">
              <Label htmlFor="symbols" className="text-sm cursor-pointer">Symbols (!@#$)</Label>
              <Switch
                id="symbols"
                checked={includeSymbols}
                onCheckedChange={(checked) => {
                  setIncludeSymbols(checked);
                  setPassword(generatePassword(length, includeUppercase, includeNumbers, checked));
                }}
                data-testid="switch-symbols"
              />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
          <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-green-800 dark:text-green-200 mb-1">Your password is secure</p>
            <p className="text-green-700 dark:text-green-300">
              This password is generated entirely in your browser. We never see, store, or transmit it.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
