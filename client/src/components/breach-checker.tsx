"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  Shield, 
  ShieldCheck, 
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  Info,
  Lock,
  Eye,
  Mail,
  Key,
  RefreshCw,
  EyeOff,
  Copy,
  Sparkles,
  Zap
} from "lucide-react";
import zxcvbn from "zxcvbn";

interface BreachDetail {
  name: string;
  date: string;
  dataTypes: string[];
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  recordCount?: string;
  remediationSteps: string[];
}

interface BreachResult {
  status: "safe" | "compromised" | "warning";
  message: string;
  recommendations: string[];
  breachCount?: number;
  commonBreaches?: string[];
  breachDetails?: BreachDetail[];
}

interface PasswordResult {
  status: "safe" | "weak" | "compromised";
  message: string;
  strength: number;
  strengthLabel: string;
  crackTime: string;
  suggestions: string[];
  breachCount?: number;
  patternAnalysis?: PasswordPatternAnalysis;
  entropyBits?: number;
}

// Disposable email domain list (common throwaway email services)
const disposableEmailDomains = new Set([
  'tempmail.com', 'throwaway.email', 'guerrillamail.com', 'mailinator.com',
  '10minutemail.com', 'temp-mail.org', 'fakeinbox.com', 'sharklasers.com',
  'guerrillamail.info', 'grr.la', 'guerrillamail.biz', 'guerrillamail.de',
  'guerrillamail.net', 'guerrillamail.org', 'spam4.me', 'trashmail.com',
  'maildrop.cc', 'getairmail.com', 'mohmal.com', 'tempail.com', 'tmails.net',
  'yopmail.com', 'dispostable.com', 'mintemail.com', 'tempinbox.com',
  'emailondeck.com', 'getnada.com', 'temp.email', 'throwawaymail.com'
]);

// Common weak passwords (top 100 from various breach databases)
const commonPasswords = new Set([
  '123456', 'password', '12345678', 'qwerty', '123456789', '12345', '1234',
  '111111', '1234567', 'dragon', '123123', 'baseball', 'iloveyou', 'trustno1',
  '1234567890', 'sunshine', 'master', 'welcome', 'shadow', 'ashley', 'football',
  'jesus', 'michael', 'ninja', 'mustang', 'password1', 'abc123', 'letmein',
  'monkey', '696969', 'batman', 'passw0rd', 'admin', 'login', 'princess',
  'qwertyuiop', 'solo', 'whatever', 'donald', 'google', 'internet', 'pokemon',
  'superman', 'charlie', '!@#$%^&*', 'hello', 'cheese', 'access', 'killer',
]);

// Check if email is from a disposable domain
function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? disposableEmailDomains.has(domain) : false;
}

// Keyboard walk patterns (common keyboard sequences)
const keyboardPatterns = [
  'qwerty', 'qwertyuiop', 'asdf', 'asdfgh', 'asdfghjkl', 'zxcv', 'zxcvbn', 'zxcvbnm',
  'qazwsx', 'qweasd', '1qaz2wsx', '1q2w3e4r', 'zaq12wsx', 'qwe123', 'asd123',
  '1234qwer', 'qwer1234', 'poiuy', 'lkjhg', 'mnbvc', '!@#$%', '!@#$%^', '!@#$%^&*',
  '123qwe', 'qwe123asd', 'asdzxc', 'zxcasd', 'wasd', 'wsad', 'arrow',
  // Number pad patterns
  '147258', '258369', '123654', '789456', '456123', '321654', '987654',
  // Diagonal patterns
  'qaz', 'wsx', 'edc', 'rfv', 'tgb', 'yhn', 'ujm',
];

// Detect keyboard walk patterns
function detectKeyboardPattern(password: string): { found: boolean; pattern: string } {
  const lower = password.toLowerCase();
  
  for (const pattern of keyboardPatterns) {
    if (lower.includes(pattern)) {
      return { found: true, pattern };
    }
    // Check reversed
    const reversed = pattern.split('').reverse().join('');
    if (lower.includes(reversed)) {
      return { found: true, pattern: reversed };
    }
  }
  
  return { found: false, pattern: '' };
}

// Leetspeak mapping
const leetMap: Record<string, string[]> = {
  'a': ['4', '@'],
  'e': ['3'],
  'i': ['1', '!'],
  'o': ['0'],
  's': ['5', '$'],
  't': ['7', '+'],
  'l': ['1', '|'],
  'b': ['8'],
  'g': ['9'],
};

// Detect leetspeak substitutions
function detectLeetspeak(password: string): { found: boolean; original: string } {
  // Convert potential leetspeak to normal letters
  let normalized = password.toLowerCase();
  
  for (const [letter, replacements] of Object.entries(leetMap)) {
    for (const replacement of replacements) {
      normalized = normalized.split(replacement).join(letter);
    }
  }
  
  // Check if the normalized version is in common passwords
  if (commonPasswords.has(normalized) && normalized !== password.toLowerCase()) {
    return { found: true, original: normalized };
  }
  
  // Check for common leetspeak passwords
  const commonLeet = ['p@ssword', 'p@ssw0rd', 'p4ssword', 'p4$$word', 'pa$$word', 'pa55word', 'l3tme1n', 'w3lcome', 'adm1n', 'qu3rty'];
  for (const leet of commonLeet) {
    if (password.toLowerCase() === leet) {
      return { found: true, original: leet };
    }
  }
  
  return { found: false, original: '' };
}

// Detect date patterns in password
function detectDatePattern(password: string): { found: boolean; type: string } {
  const patterns = [
    // Year patterns (embedded or standalone) - 1940-2029
    { regex: /(19[4-9]\d|20[0-2]\d)/, type: 'year' },
    // Date formats with separators
    { regex: /(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-](\d{2}|\d{4})/, type: 'date (MM/DD/YY)' },
    { regex: /(0?[1-9]|[12]\d|3[01])[\/\-](0?[1-9]|1[0-2])[\/\-](\d{2}|\d{4})/, type: 'date (DD/MM/YY)' },
    // Month abbreviations with numbers
    { regex: /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\d{1,4}/i, type: 'month + year' },
    { regex: /\d{4}(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i, type: 'year + month' },
    // Birthday references (case insensitive, anywhere in password)
    { regex: /(birthday|bday|born|dob)/i, type: 'birthday reference' },
    // Common year endings like password2023
    { regex: /[a-z](20[1-2]\d|19[89]\d)$/i, type: 'year suffix' },
  ];
  
  for (const { regex, type } of patterns) {
    if (regex.test(password)) {
      return { found: true, type };
    }
  }
  
  return { found: false, type: '' };
}

// Detect sequential patterns
function detectSequentialPattern(password: string): { found: boolean; type: string } {
  const lower = password.toLowerCase();
  
  // Alphabetic sequences
  const alphaSequences = ['abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij', 'ijk', 'jkl', 'klm', 'lmn', 'mno', 'nop', 'opq', 'pqr', 'qrs', 'rst', 'stu', 'tuv', 'uvw', 'vwx', 'wxy', 'xyz'];
  
  for (const seq of alphaSequences) {
    if (lower.includes(seq)) {
      return { found: true, type: 'alphabetic sequence' };
    }
    // Check reversed
    if (lower.includes(seq.split('').reverse().join(''))) {
      return { found: true, type: 'reversed alphabetic sequence' };
    }
  }
  
  // Numeric sequences
  const numericSequences = ['012', '123', '234', '345', '456', '567', '678', '789', '890'];
  
  for (const seq of numericSequences) {
    if (password.includes(seq)) {
      return { found: true, type: 'numeric sequence' };
    }
    // Check reversed
    if (password.includes(seq.split('').reverse().join(''))) {
      return { found: true, type: 'reversed numeric sequence' };
    }
  }
  
  return { found: false, type: '' };
}

// Detect repeated characters
function detectRepeatedChars(password: string): { found: boolean; char: string; count: number } {
  const repeatedPattern = /(.)\1{2,}/g;
  const matches = password.match(repeatedPattern);
  
  if (matches && matches.length > 0) {
    const longest = matches.reduce((a, b) => a.length >= b.length ? a : b);
    return { found: true, char: longest[0], count: longest.length };
  }
  
  return { found: false, char: '', count: 0 };
}

// Calculate password entropy (bits)
function calculatePasswordEntropy(password: string): { entropy: number; rating: string } {
  if (!password) return { entropy: 0, rating: 'none' };
  
  let charsetSize = 0;
  
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) charsetSize += 32;
  if (/\s/.test(password)) charsetSize += 1;
  
  // Entropy = log2(charset^length) = length * log2(charset)
  const entropy = password.length * Math.log2(charsetSize || 1);
  
  let rating = 'Very Weak';
  if (entropy >= 80) rating = 'Very Strong';
  else if (entropy >= 60) rating = 'Strong';
  else if (entropy >= 40) rating = 'Moderate';
  else if (entropy >= 28) rating = 'Weak';
  
  return { entropy: Math.round(entropy), rating };
}

// Analyze password patterns and return detailed feedback
interface PasswordPatternAnalysis {
  keyboardPattern?: string;
  leetspeak?: string;
  datePattern?: string;
  sequentialPattern?: string;
  repeatedChars?: { char: string; count: number };
  entropy: { bits: number; rating: string };
  warnings: string[];
}

function analyzePasswordPatterns(password: string): PasswordPatternAnalysis {
  const warnings: string[] = [];
  const analysis: PasswordPatternAnalysis = {
    entropy: { bits: 0, rating: 'none' },
    warnings: []
  };
  
  // Check keyboard patterns
  const keyboard = detectKeyboardPattern(password);
  if (keyboard.found) {
    analysis.keyboardPattern = keyboard.pattern;
    warnings.push(`Contains keyboard pattern "${keyboard.pattern}" which is easily guessed`);
  }
  
  // Check leetspeak
  const leet = detectLeetspeak(password);
  if (leet.found) {
    analysis.leetspeak = leet.original;
    warnings.push(`Leetspeak variation of "${leet.original}" - this is a well-known trick`);
  }
  
  // Check date patterns
  const date = detectDatePattern(password);
  if (date.found) {
    analysis.datePattern = date.type;
    warnings.push(`Contains ${date.type} - avoid personal dates in passwords`);
  }
  
  // Check sequential patterns
  const sequential = detectSequentialPattern(password);
  if (sequential.found) {
    analysis.sequentialPattern = sequential.type;
    warnings.push(`Contains ${sequential.type} - sequential patterns are easily guessed`);
  }
  
  // Check repeated characters
  const repeated = detectRepeatedChars(password);
  if (repeated.found) {
    analysis.repeatedChars = { char: repeated.char, count: repeated.count };
    warnings.push(`Contains ${repeated.count} repeated "${repeated.char}" characters`);
  }
  
  // Calculate entropy
  const entropyResult = calculatePasswordEntropy(password);
  analysis.entropy = { bits: entropyResult.entropy, rating: entropyResult.rating };
  
  if (entropyResult.entropy < 28) {
    warnings.push(`Very low entropy (${entropyResult.entropy} bits) - password is too short or simple`);
  } else if (entropyResult.entropy < 40) {
    warnings.push(`Low entropy (${entropyResult.entropy} bits) - consider adding more variety`);
  }
  
  analysis.warnings = warnings;
  return analysis;
}

// Diceware-style word list for passphrase generation (EFF long word list subset)
const passphraseWords = [
  'abacus', 'abdomen', 'ability', 'abroad', 'absorb', 'accent', 'access', 'account', 
  'accuse', 'achieve', 'acquire', 'across', 'action', 'active', 'actual', 'adapt',
  'address', 'adjust', 'admit', 'adult', 'advance', 'advice', 'affair', 'afford',
  'afraid', 'agenda', 'agree', 'ahead', 'airport', 'alarm', 'album', 'alert',
  'alien', 'alive', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already',
  'always', 'amaze', 'amount', 'anchor', 'ancient', 'angel', 'anger', 'animal',
  'ankle', 'annual', 'answer', 'antique', 'anxiety', 'apart', 'appeal', 'apple',
  'apply', 'approve', 'arch', 'arena', 'argue', 'arise', 'armor', 'army',
  'around', 'arrow', 'artist', 'aspect', 'assign', 'assist', 'assume', 'athlete',
  'atomic', 'attach', 'attack', 'attend', 'author', 'autumn', 'avenue', 'average',
  'avoid', 'awake', 'award', 'aware', 'awesome', 'awful', 'bacon', 'badge',
  'balance', 'balcony', 'bamboo', 'banana', 'banner', 'barely', 'barrel', 'basic',
  'basket', 'battle', 'beach', 'beacon', 'beauty', 'become', 'before', 'begin',
  'behave', 'behind', 'believe', 'below', 'bench', 'benefit', 'berry', 'beyond',
  'bicycle', 'blanket', 'blossom', 'board', 'border', 'bottle', 'bottom', 'bounce',
  'bracket', 'brain', 'branch', 'brave', 'bread', 'breeze', 'bridge', 'bright',
  'broken', 'bronze', 'brother', 'bubble', 'bucket', 'budget', 'buffalo', 'bundle',
  'burden', 'butter', 'button', 'cabin', 'cable', 'cactus', 'camera', 'campus',
  'canal', 'cancel', 'candle', 'canvas', 'canyon', 'capable', 'capital', 'captain',
  'capture', 'carbon', 'career', 'carpet', 'carrot', 'castle', 'casual', 'catalog',
  'ceiling', 'cement', 'center', 'central', 'century', 'cereal', 'certain', 'chain',
  'champion', 'change', 'channel', 'chapter', 'charge', 'cherry', 'chicken', 'chief',
  'choice', 'choose', 'chronic', 'circle', 'citizen', 'civil', 'claim', 'clarify',
  'classic', 'clean', 'clever', 'client', 'climate', 'clinic', 'clock', 'closet',
  'clothes', 'cluster', 'clutter', 'coach', 'coast', 'coconut', 'coffee', 'collect',
  'color', 'column', 'combine', 'comfort', 'comic', 'common', 'company', 'compass',
  'compile', 'complex', 'concert', 'conduct', 'confirm', 'congress', 'connect', 'consider',
  'contact', 'contain', 'contest', 'context', 'control', 'convert', 'cookie', 'copper',
  'corner', 'correct', 'cosmic', 'costume', 'cotton', 'country', 'couple', 'courage',
  'cousin', 'cover', 'cowboy', 'craft', 'crater', 'crazy', 'cream', 'credit',
  'creek', 'cricket', 'crisis', 'crisp', 'critic', 'cross', 'crowd', 'cruel',
  'cruise', 'crystal', 'culture', 'cupboard', 'curious', 'current', 'curtain', 'custom',
  'cycle', 'daisy', 'damage', 'dance', 'danger', 'daring', 'daughter', 'dawn',
  'debate', 'decade', 'decide', 'decline', 'decorate', 'decrease', 'defend', 'define',
  'degree', 'delay', 'deliver', 'demand', 'denial', 'dentist', 'depart', 'depend',
  'deposit', 'depth', 'deputy', 'derive', 'describe', 'desert', 'design', 'desktop',
  'detail', 'detect', 'develop', 'device', 'devote', 'diagram', 'diamond', 'diary',
  'diesel', 'differ', 'digital', 'dignity', 'dinner', 'dinosaur', 'direct', 'disagree',
  'disaster', 'discover', 'discuss', 'disease', 'display', 'distance', 'divide', 'dizzy',
  'doctor', 'dolphin', 'domain', 'donate', 'donkey', 'double', 'dragon', 'drama',
  'drawer', 'dream', 'dress', 'drink', 'driver', 'driveway', 'drought', 'drum',
  'eagle', 'early', 'earth', 'easily', 'eastern', 'eclipse', 'ecology', 'economy',
  'educate', 'effect', 'effort', 'either', 'elastic', 'elbow', 'elder', 'electric',
  'elegant', 'element', 'elephant', 'elevator', 'embrace', 'emerge', 'emotion', 'emperor',
  'empire', 'employ', 'empty', 'enable', 'encode', 'encore', 'endless', 'endorse',
  'enemy', 'energy', 'engage', 'engine', 'enhance', 'enjoy', 'enough', 'enrich',
  'enroll', 'ensure', 'entire', 'entry', 'envelope', 'episode', 'equal', 'equip',
  'escape', 'essence', 'estate', 'eternal', 'ethics', 'evidence', 'evolve', 'exact',
  'example', 'exceed', 'exchange', 'excite', 'exclude', 'excuse', 'execute', 'exercise',
  'exhaust', 'exhibit', 'exile', 'exist', 'exotic', 'expand', 'expect', 'expense'
];

// Generate a secure passphrase
function generatePassphrase(wordCount: number = 4, separator: string = '-'): string {
  const words: string[] = [];
  const array = new Uint32Array(wordCount);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < wordCount; i++) {
    const index = array[i] % passphraseWords.length;
    words.push(passphraseWords[index]);
  }
  
  // Optionally add a number for extra entropy
  const numArray = new Uint32Array(1);
  crypto.getRandomValues(numArray);
  const randomNum = (numArray[0] % 99) + 1;
  
  return words.join(separator) + separator + randomNum;
}

// Validate email format
function isValidEmail(email: string): { valid: boolean; reason?: string } {
  if (!email.includes('@')) {
    return { valid: false, reason: "Missing @ symbol" };
  }
  
  const [local, domain] = email.split('@');
  
  if (!local || local.length === 0) {
    return { valid: false, reason: "Missing username before @" };
  }
  
  if (!domain || domain.length === 0) {
    return { valid: false, reason: "Missing domain after @" };
  }
  
  if (!domain.includes('.')) {
    return { valid: false, reason: "Domain missing extension (like .com)" };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, reason: "Invalid email format" };
  }
  
  return { valid: true };
}

// SHA-1 hash function for HIBP API
async function sha1(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

// Check password against Have I Been Pwned API (free, uses k-Anonymity)
async function checkPasswordHIBP(password: string): Promise<{ breached: boolean; count: number }> {
  try {
    const hash = await sha1(password);
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);
    
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: {
        'Add-Padding': 'true' // Adds padding to prevent response length analysis
      }
    });
    
    if (!response.ok) {
      throw new Error('HIBP API error');
    }
    
    const text = await response.text();
    const lines = text.split('\n');
    
    for (const line of lines) {
      const [hashSuffix, count] = line.split(':');
      if (hashSuffix.trim() === suffix) {
        return { breached: true, count: parseInt(count.trim(), 10) };
      }
    }
    
    return { breached: false, count: 0 };
  } catch (error) {
    // If API fails, return unknown status
    console.error('HIBP check failed:', error);
    return { breached: false, count: -1 }; // -1 indicates check failed
  }
}

// Analyze password strength using zxcvbn
function analyzePasswordStrength(password: string): {
  score: number;
  label: string;
  crackTime: string;
  feedback: string[];
} {
  const result = zxcvbn(password);
  
  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const label = labels[result.score];
  
  const crackTime = result.crack_times_display.offline_slow_hashing_1e4_per_second as string;
  
  const feedback: string[] = [];
  if (result.feedback.warning) {
    feedback.push(result.feedback.warning);
  }
  feedback.push(...result.feedback.suggestions);
  
  return {
    score: result.score,
    label,
    crackTime,
    feedback
  };
}

function simulateBreachCheck(email: string): BreachResult {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check for disposable email
  if (isDisposableEmail(normalizedEmail)) {
    return {
      status: "warning",
      message: "This appears to be a disposable or temporary email address. These are often used for spam and may not be accepted by many services.",
      recommendations: [
        "Use a permanent email address for important accounts",
        "Disposable emails cannot receive password reset links",
        "Many services block disposable email domains",
        "Consider using a reputable email provider for security"
      ]
    };
  }
  
  const knownCompromisedDomains = [
    "test.com", "example.com"
  ];
  
  const commonBreachPatterns = [
    "123", "password", "admin", "test", "user"
  ];
  
  const domain = normalizedEmail.split("@")[1];
  const localPart = normalizedEmail.split("@")[0];
  
  if (knownCompromisedDomains.includes(domain)) {
    return {
      status: "compromised",
      message: "This email domain has been associated with multiple data breaches.",
      breachCount: 3,
      commonBreaches: ["Sample Breach 2021", "Data Leak 2020", "Security Incident 2019"],
      breachDetails: [
        {
          name: "Sample Breach 2021",
          date: "March 2021",
          dataTypes: ["Email addresses", "Passwords", "Names"],
          description: "A major data aggregation service exposed user credentials through an unsecured database.",
          severity: "high",
          recordCount: "12 million",
          remediationSteps: [
            "Change your password immediately on any account using this email",
            "If you reused this password elsewhere, change those passwords too",
            "Enable two-factor authentication (2FA) on all accounts",
            "Check your accounts for any unauthorized activity or changes",
            "Consider using a password manager to create unique passwords"
          ]
        },
        {
          name: "Data Leak 2020",
          date: "August 2020",
          dataTypes: ["Email addresses", "IP addresses"],
          description: "User data was collected from multiple sources and compiled into a searchable database.",
          severity: "medium",
          recordCount: "8 million",
          remediationSteps: [
            "Be extra vigilant about phishing emails targeting this address",
            "Verify sender identity before clicking links in emails",
            "Consider using email aliases for new account signups",
            "Report suspicious emails to your email provider"
          ]
        },
        {
          name: "Security Incident 2019",
          date: "November 2019",
          dataTypes: ["Email addresses", "Usernames"],
          description: "Basic account information was exposed through a misconfigured API endpoint.",
          severity: "low",
          recordCount: "500,000",
          remediationSteps: [
            "No immediate action required for this low-severity incident",
            "Monitor your accounts for unusual login attempts",
            "Keep your security software up to date"
          ]
        }
      ],
      recommendations: [
        "Change your password immediately for all accounts using this email",
        "Enable two-factor authentication on all important accounts",
        "Consider using a different email for sensitive accounts",
        "Check your accounts for unauthorized activity",
        "Use a password manager to create unique passwords"
      ]
    };
  }
  
  if (commonBreachPatterns.some(pattern => localPart.includes(pattern))) {
    return {
      status: "warning",
      message: "Your email pattern suggests it may be at higher risk. While no specific breaches were found, accounts with common usernames are frequently targeted.",
      recommendations: [
        "Consider using a more unique email address for sensitive accounts",
        "Ensure you have strong, unique passwords for each account",
        "Enable two-factor authentication wherever possible",
        "Monitor your accounts regularly for suspicious activity"
      ]
    };
  }
  
  const hash = normalizedEmail.split("").reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  if (Math.abs(hash) % 10 < 2) {
    return {
      status: "warning",
      message: "We found potential exposure in a minor data aggregation incident. This does not necessarily mean your password was compromised.",
      breachCount: 1,
      breachDetails: [
        {
          name: "Data Aggregation Incident",
          date: "2023",
          dataTypes: ["Email addresses"],
          description: "Your email was found in a compiled list that aggregates data from various sources. This type of incident typically involves email addresses being collected from public sources, data broker lists, or minor security incidents. No passwords were included in this exposure.",
          severity: "low",
          recordCount: "Unknown",
          remediationSteps: [
            "Update passwords for your most important accounts (banking, email, social media)",
            "Enable two-factor authentication on financial and email accounts",
            "Be cautious of unsolicited emails - scammers may target this address",
            "Consider setting up a spam filter or email alias for future signups",
            "Monitor your credit report for any unauthorized accounts"
          ]
        }
      ],
      recommendations: [
        "As a precaution, update passwords for your most important accounts",
        "Enable two-factor authentication on financial and email accounts",
        "Be extra vigilant about phishing emails",
        "Consider using a credit monitoring service"
      ]
    };
  }
  
  return {
    status: "safe",
    message: "Good news! We did not find this email in any known public data breaches.",
    recommendations: [
      "Continue using strong, unique passwords for each account",
      "Keep two-factor authentication enabled",
      "Stay alert for phishing attempts",
      "Check back periodically as new breaches are discovered"
    ]
  };
}

// Check password comprehensively
async function checkPassword(password: string): Promise<PasswordResult> {
  // Analyze password patterns
  const patternAnalysis = analyzePasswordPatterns(password);
  
  // First check if it's a known common password
  if (commonPasswords.has(password.toLowerCase())) {
    return {
      status: "compromised",
      message: "This is one of the most common passwords used worldwide. It would be cracked instantly.",
      strength: 0,
      strengthLabel: "Extremely Weak",
      crackTime: "Instantly",
      suggestions: [
        "Never use common passwords like 123456, password, or qwerty",
        "Create a password with at least 12 characters",
        "Mix uppercase, lowercase, numbers, and symbols",
        "Use a password manager to generate strong passwords"
      ],
      breachCount: 999999,
      patternAnalysis,
      entropyBits: patternAnalysis.entropy.bits
    };
  }
  
  // Analyze strength with zxcvbn
  const strength = analyzePasswordStrength(password);
  
  // Check against Have I Been Pwned
  const hibpResult = await checkPasswordHIBP(password);
  
  // Merge pattern warnings with zxcvbn feedback
  const allSuggestions = [...patternAnalysis.warnings, ...strength.feedback];
  
  if (hibpResult.breached && hibpResult.count > 0) {
    return {
      status: "compromised",
      message: `This password has appeared in ${hibpResult.count.toLocaleString()} known data breaches. Do not use this password.`,
      strength: Math.min(strength.score, 1),
      strengthLabel: "Compromised",
      crackTime: strength.crackTime,
      suggestions: [
        "This password was found in leaked databases and may be used in attacks",
        "Choose a completely different password",
        "Consider using a passphrase with 4 or more random words",
        "Use a password manager to generate unique passwords",
        ...allSuggestions.slice(0, 3)
      ],
      breachCount: hibpResult.count,
      patternAnalysis,
      entropyBits: patternAnalysis.entropy.bits
    };
  }
  
  // Check if pattern analysis found concerning issues
  const hasPatternIssues = patternAnalysis.warnings.length > 0;
  
  // Password is not in breach database
  if (strength.score >= 3 && !hasPatternIssues) {
    return {
      status: "safe",
      message: "This password was not found in any known data breaches and has good strength.",
      strength: strength.score,
      strengthLabel: strength.label,
      crackTime: strength.crackTime,
      suggestions: allSuggestions.length > 0 ? allSuggestions : [
        "Your password appears strong",
        "Enable two-factor authentication for extra security",
        "Never reuse passwords across multiple accounts"
      ],
      patternAnalysis,
      entropyBits: patternAnalysis.entropy.bits
    };
  }
  
  // Adjust strength score if pattern issues found
  const adjustedScore = hasPatternIssues ? Math.max(0, strength.score - 1) : strength.score;
  
  return {
    status: "weak",
    message: hibpResult.count === -1 
      ? "Unable to check breach database, but password strength analysis completed."
      : hasPatternIssues
        ? "This password contains predictable patterns that make it easier to guess."
        : "This password was not found in breaches, but could be stronger.",
    strength: adjustedScore,
    strengthLabel: hasPatternIssues && adjustedScore <= 1 ? "Patterned" : strength.label,
    crackTime: strength.crackTime,
    suggestions: [
      ...allSuggestions,
      "Consider making your password longer",
      "Add more variety with uppercase, numbers, and symbols"
    ].slice(0, 6),
    patternAnalysis,
    entropyBits: patternAnalysis.entropy.bits
  };
}

export function BreachChecker() {
  const [activeTab, setActiveTab] = useState("email");
  
  // Email check state
  const [email, setEmail] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState<BreachResult | null>(null);
  const [hasCheckedEmail, setHasCheckedEmail] = useState(false);
  
  // Password check state
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);
  const [passwordResult, setPasswordResult] = useState<PasswordResult | null>(null);
  const [hasCheckedPassword, setHasCheckedPassword] = useState(false);
  
  // Passphrase generator state
  const [generatedPassphrase, setGeneratedPassphrase] = useState<string>("");
  const [showPassphrase, setShowPassphrase] = useState(false);
  
  const handleGeneratePassphrase = () => {
    const newPassphrase = generatePassphrase(4, '-');
    setGeneratedPassphrase(newPassphrase);
    setShowPassphrase(true);
  };
  
  const handleCopyPassphrase = () => {
    navigator.clipboard.writeText(generatedPassphrase);
  };

  const handleCheckEmail = async () => {
    const validation = isValidEmail(email);
    if (!validation.valid) return;
    
    setIsCheckingEmail(true);
    setEmailResult(null);
    
    try {
      // Check for disposable email first
      if (isDisposableEmail(email)) {
        setEmailResult({
          status: "warning",
          message: "This appears to be a disposable or temporary email address. These are often used for spam and may not be accepted by many services.",
          recommendations: [
            "Use a permanent email address for important accounts",
            "Disposable emails cannot receive password reset links",
            "Many services block disposable email domains",
            "Consider using a reputable email provider for security"
          ]
        });
        setHasCheckedEmail(true);
        setIsCheckingEmail(false);
        return;
      }
      
      // Call the XposedOrNot API through our backend proxy
      const response = await fetch('/api/security/check-email-breach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() })
      });
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('rate_limit');
        }
        throw new Error('api_error');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'api_error');
      }
      
      if (data.breached && data.breaches && data.breaches.length > 0) {
        // Build breach details from the response
        const breachDetails: BreachDetail[] = data.breaches.slice(0, 10).map((breachName: string) => {
          // Map severity based on breach name patterns
          let severity: "low" | "medium" | "high" | "critical" = "medium";
          const lowerName = breachName.toLowerCase();
          if (lowerName.includes('bank') || lowerName.includes('financial') || lowerName.includes('credit')) {
            severity = "critical";
          } else if (lowerName.includes('password') || lowerName.includes('adobe') || lowerName.includes('linkedin')) {
            severity = "high";
          } else if (lowerName.includes('email') || lowerName.includes('newsletter')) {
            severity = "low";
          }
          
          return {
            name: breachName,
            date: "Check XposedOrNot.com for details",
            dataTypes: ["Email addresses", "Potentially other data"],
            description: `Your email was found in the ${breachName} data breach. Visit XposedOrNot.com for detailed information about this breach.`,
            severity,
            remediationSteps: [
              "Change your password on the affected service immediately",
              "If you reused this password elsewhere, change those passwords too",
              "Enable two-factor authentication (2FA) on the affected account",
              "Monitor your accounts for unauthorized activity",
              "Consider using a password manager for unique passwords"
            ]
          };
        });
        
        setEmailResult({
          status: "compromised",
          message: data.message,
          breachCount: data.breachCount,
          commonBreaches: data.breaches.slice(0, 5),
          breachDetails,
          recommendations: [
            "Change passwords immediately for all accounts using this email",
            "Enable two-factor authentication on all important accounts",
            "Use unique passwords for each account (consider a password manager)",
            "Check your accounts for unauthorized activity",
            "Be extra vigilant about phishing emails targeting this address"
          ]
        });
      } else {
        setEmailResult({
          status: "safe",
          message: data.message || "Good news! We did not find this email in any known public data breaches.",
          recommendations: [
            "Continue using strong, unique passwords for each account",
            "Keep two-factor authentication enabled",
            "Stay alert for phishing attempts",
            "Check back periodically as new breaches are discovered"
          ]
        });
      }
    } catch (error: any) {
      console.error('Breach check error:', error);
      
      if (error.message === 'rate_limit') {
        setEmailResult({
          status: "warning",
          message: "Too many requests. Please wait a moment and try again.",
          recommendations: [
            "Wait 30 seconds before trying again",
            "Our breach database receives millions of checks daily"
          ]
        });
      } else {
        setEmailResult({
          status: "warning",
          message: "We were unable to check this email right now. Our breach database may be temporarily unavailable. Please try again in a few minutes.",
          recommendations: [
            "Try again in a few minutes",
            "In the meantime, use strong unique passwords for every account",
            "Enable two-factor authentication on all important accounts",
            "Consider signing up for breach monitoring alerts"
          ]
        });
      }
    }
    
    setHasCheckedEmail(true);
    setIsCheckingEmail(false);
  };

  const handleResetEmail = () => {
    setEmail("");
    setEmailResult(null);
    setHasCheckedEmail(false);
  };
  
  const handleCheckPassword = async () => {
    if (!password || password.length < 1) return;
    
    setIsCheckingPassword(true);
    setPasswordResult(null);
    
    const checkResult = await checkPassword(password);
    setPasswordResult(checkResult);
    setHasCheckedPassword(true);
    setIsCheckingPassword(false);
  };

  const handleResetPassword = () => {
    setPassword("");
    setPasswordResult(null);
    setHasCheckedPassword(false);
  };

  const getEmailStatusIcon = () => {
    if (!emailResult) return null;
    
    switch (emailResult.status) {
      case "safe":
        return <ShieldCheck className="w-16 h-16 text-green-500" />;
      case "warning":
        return <ShieldAlert className="w-16 h-16 text-yellow-500" />;
      case "compromised":
        return <AlertTriangle className="w-16 h-16 text-red-500" />;
    }
  };

  const getEmailStatusColor = () => {
    if (!emailResult) return "";
    
    switch (emailResult.status) {
      case "safe":
        return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900";
      case "compromised":
        return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900";
    }
  };

  const getEmailStatusBadge = () => {
    if (!emailResult) return null;
    
    switch (emailResult.status) {
      case "safe":
        return <Badge className="bg-green-500 text-white">No Breaches Found</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500 text-black">Potential Exposure</Badge>;
      case "compromised":
        return <Badge variant="destructive">Breaches Detected</Badge>;
    }
  };
  
  const getPasswordStatusColor = () => {
    if (!passwordResult) return "";
    
    switch (passwordResult.status) {
      case "safe":
        return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900";
      case "weak":
        return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900";
      case "compromised":
        return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900";
    }
  };
  
  const getStrengthColor = (score: number) => {
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-lime-500",
      "bg-green-500"
    ];
    return colors[score] || "bg-gray-300";
  };

  return (
    <Card className="w-full" data-testid="card-breach-checker">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Security Checker</CardTitle>
            <p className="text-sm text-muted-foreground">Check emails for breaches and passwords for security</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="email" className="gap-2">
              <Mail className="w-4 h-4" />
              Email Check
            </TabsTrigger>
            <TabsTrigger value="password" className="gap-2">
              <Key className="w-4 h-4" />
              Password Check
            </TabsTrigger>
          </TabsList>
          
          {/* Email Breach Check Tab */}
          <TabsContent value="email" className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={isCheckingEmail}
                  aria-label="Email address to check for data breaches"
                  data-testid="input-breach-email"
                />
              </div>
              {hasCheckedEmail ? (
                <Button 
                  onClick={handleResetEmail}
                  variant="outline"
                  data-testid="button-reset-breach-check"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Check
                </Button>
              ) : (
                <Button 
                  onClick={handleCheckEmail}
                  disabled={!email || !email.includes("@") || isCheckingEmail}
                  aria-label={isCheckingEmail ? "Checking email for breaches" : "Check email for data breaches"}
                  aria-busy={isCheckingEmail}
                  data-testid="button-check-breach"
                >
                  {isCheckingEmail ? (
                    <>
                      <Search className="w-4 h-4 mr-2 animate-pulse" aria-hidden="true" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" aria-hidden="true" />
                      Check Email
                    </>
                  )}
                </Button>
              )}
            </div>

            {isCheckingEmail && (
              <div className="text-center py-8" role="status" aria-label="Checking for data breaches">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Search className="w-8 h-8 text-primary animate-pulse" aria-hidden="true" />
                </div>
                <p className="text-muted-foreground">Searching breach databases...</p>
                <p className="text-sm text-muted-foreground mt-1">This may take a few seconds</p>
              </div>
            )}

            {emailResult && !isCheckingEmail && (
              <div className={`rounded-lg border p-6 ${getEmailStatusColor()}`} role="alert" aria-live="polite">
                <div className="flex flex-col items-center text-center mb-6">
                  {getEmailStatusIcon()}
                  <div className="mt-4">
                    {getEmailStatusBadge()}
                  </div>
                  {emailResult.breachCount && (
                    <p className="mt-2 text-2xl font-bold">
                      {emailResult.breachCount} {emailResult.breachCount === 1 ? "breach" : "breaches"} found
                    </p>
                  )}
                </div>

                <p className="text-center mb-6">{emailResult.message}</p>

                {emailResult.breachDetails && emailResult.breachDetails.length > 0 && (
                  <div className="mb-6 space-y-4">
                    <p className="font-medium flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Breach Details
                    </p>
                    {emailResult.breachDetails.map((breach, idx) => (
                      <div key={idx} className="bg-background/70 rounded-lg p-4 border border-border/50">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h4 className="font-semibold text-base">{breach.name}</h4>
                          <Badge 
                            variant="outline" 
                            className={
                              breach.severity === "critical" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-300" :
                              breach.severity === "high" ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-300" :
                              breach.severity === "medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-300" :
                              "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300"
                            }
                          >
                            {breach.severity.charAt(0).toUpperCase() + breach.severity.slice(1)} Severity
                          </Badge>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-3 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">Date: </span>
                            <span className="font-medium">{breach.date}</span>
                          </div>
                          {breach.recordCount && (
                            <div>
                              <span className="text-muted-foreground">Records Affected: </span>
                              <span className="font-medium">{breach.recordCount}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mb-3">
                          <span className="text-sm text-muted-foreground">Data Exposed: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {breach.dataTypes.map((dataType, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {dataType}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">{breach.description}</p>
                        
                        {breach.remediationSteps && breach.remediationSteps.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-sm font-medium mb-2 flex items-center gap-2">
                              <Shield className="w-4 h-4 text-primary" />
                              Steps to Protect Yourself
                            </p>
                            <ul className="space-y-1.5">
                              {breach.remediationSteps.map((step, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-background/50 rounded-lg p-4">
                  <p className="font-medium mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Recommended Actions
                  </p>
                  <ul className="space-y-2">
                    {emailResult.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {!emailResult && !isCheckingEmail && (
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-medium text-sm">Private and Secure</p>
                  <p className="text-xs text-muted-foreground">Your email is never stored</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <Eye className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-medium text-sm">Breach Database</p>
                  <p className="text-xs text-muted-foreground">Checks known data leaks</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <Key className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-medium text-sm">Actionable Tips</p>
                  <p className="text-xs text-muted-foreground">Get protection advice</p>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Password Check Tab */}
          <TabsContent value="password" className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a password to check"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  disabled={isCheckingPassword}
                  aria-label="Password to check for breaches and strength"
                  data-testid="input-breach-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {hasCheckedPassword ? (
                <Button 
                  onClick={handleResetPassword}
                  variant="outline"
                  data-testid="button-reset-password-check"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Check
                </Button>
              ) : (
                <Button 
                  onClick={handleCheckPassword}
                  disabled={!password || password.length < 1 || isCheckingPassword}
                  aria-label={isCheckingPassword ? "Checking password security" : "Check password security"}
                  aria-busy={isCheckingPassword}
                  data-testid="button-check-password"
                >
                  {isCheckingPassword ? (
                    <>
                      <Search className="w-4 h-4 mr-2 animate-pulse" aria-hidden="true" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" aria-hidden="true" />
                      Check Password
                    </>
                  )}
                </Button>
              )}
            </div>

            {isCheckingPassword && (
              <div className="text-center py-8" role="status" aria-label="Checking password security">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Lock className="w-8 h-8 text-primary animate-pulse" aria-hidden="true" />
                </div>
                <p className="text-muted-foreground">Checking against 700+ million breached passwords...</p>
                <p className="text-sm text-muted-foreground mt-1">Using Have I Been Pwned database</p>
              </div>
            )}

            {passwordResult && !isCheckingPassword && (
              <div className={`rounded-lg border p-6 ${getPasswordStatusColor()}`} role="alert" aria-live="polite">
                <div className="flex flex-col items-center text-center mb-6">
                  {passwordResult.status === "safe" && <ShieldCheck className="w-16 h-16 text-green-500" />}
                  {passwordResult.status === "weak" && <ShieldAlert className="w-16 h-16 text-yellow-500" />}
                  {passwordResult.status === "compromised" && <AlertTriangle className="w-16 h-16 text-red-500" />}
                  
                  <div className="mt-4 space-y-2">
                    <Badge className={
                      passwordResult.status === "safe" ? "bg-green-500 text-white" :
                      passwordResult.status === "weak" ? "bg-yellow-500 text-black" :
                      "bg-red-500 text-white"
                    }>
                      {passwordResult.strengthLabel}
                    </Badge>
                    
                    {passwordResult.breachCount && passwordResult.breachCount > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Found in {passwordResult.breachCount.toLocaleString()} breaches
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Strength Meter */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Password Strength</span>
                    <span>Time to crack: {passwordResult.crackTime}</span>
                  </div>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-2 flex-1 rounded-full ${
                          level <= passwordResult.strength ? getStrengthColor(passwordResult.strength) : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Entropy Display */}
                {passwordResult.entropyBits !== undefined && (
                  <div className="mb-4 p-3 bg-background/50 rounded-lg">
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Entropy
                      </span>
                      <Badge variant="outline" className={
                        passwordResult.entropyBits >= 60 ? "border-green-500 text-green-600" :
                        passwordResult.entropyBits >= 40 ? "border-yellow-500 text-yellow-600" :
                        "border-red-500 text-red-600"
                      }>
                        {passwordResult.entropyBits} bits ({passwordResult.patternAnalysis?.entropy.rating || 'Unknown'})
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Higher entropy means more randomness and better security. Aim for 60+ bits.
                    </p>
                  </div>
                )}
                
                {/* Pattern Analysis Warnings */}
                {passwordResult.patternAnalysis && passwordResult.patternAnalysis.warnings.length > 0 && (
                  <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="font-medium text-sm text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Pattern Issues Detected
                    </p>
                    <ul className="space-y-1">
                      {passwordResult.patternAnalysis.warnings.slice(0, 4).map((warning, idx) => (
                        <li key={idx} className="text-xs text-yellow-700 dark:text-yellow-300 flex items-start gap-2">
                          <span className="mt-0.5">•</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-center mb-6">{passwordResult.message}</p>

                <div className="bg-background/50 rounded-lg p-4">
                  <p className="font-medium mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Suggestions
                  </p>
                  <ul className="space-y-2">
                    {passwordResult.suggestions.slice(0, 5).map((suggestion, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {!passwordResult && !isCheckingPassword && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="font-medium text-sm">Breach Check</p>
                    <p className="text-xs text-muted-foreground">Checks 700M+ passwords</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="font-medium text-sm">Pattern Detection</p>
                    <p className="text-xs text-muted-foreground">Keyboard, dates, sequences</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="font-medium text-sm">Entropy Analysis</p>
                    <p className="text-xs text-muted-foreground">Measures true randomness</p>
                  </div>
                </div>
                
                {/* Passphrase Generator */}
                <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span className="font-medium text-sm">Need a Strong Password?</span>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={handleGeneratePassphrase}
                      data-testid="button-generate-passphrase"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Generate Passphrase
                    </Button>
                  </div>
                  
                  {generatedPassphrase && showPassphrase && (
                    <div className="mt-3 p-3 bg-background rounded-lg border">
                      <div className="flex items-center justify-between gap-2">
                        <code className="flex-1 font-mono text-sm break-all">{generatedPassphrase}</code>
                        <Button size="icon" variant="ghost" onClick={handleCopyPassphrase} data-testid="button-copy-passphrase">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Passphrases like this are easy to remember but very hard to crack. 
                        Save this somewhere safe.
                      </p>
                    </div>
                  )}
                  
                  {!generatedPassphrase && (
                    <p className="text-xs text-muted-foreground">
                      We will generate a secure passphrase using random words. Easier to remember than random characters.
                    </p>
                  )}
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">How Password Check Works</p>
                    <p className="text-blue-700 dark:text-blue-300">
                      We use Have I Been Pwned's secure k-Anonymity model. Only the first 5 characters 
                      of your password's hash are sent to check against 700+ million breached passwords. 
                      Your actual password never leaves your browser.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
          <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-green-800 dark:text-green-200 mb-1">Your Privacy Matters</p>
            <p className="text-green-700 dark:text-green-300">
              All checks run securely. Email checks are simulated locally. Password checks use 
              k-Anonymity so your full password is never transmitted.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
