import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  RefreshCw,
  Copy,
  Check,
  Share2,
  Lock,
  Users,
  AlertTriangle,
  Lightbulb,
  Heart,
  Star,
  Sparkles,
  Phone
} from "lucide-react";

const adjectives = [
  "Purple", "Golden", "Silver", "Crystal", "Velvet", "Cosmic", "Mystic", "Peaceful",
  "Dancing", "Shining", "Glowing", "Sparkling", "Frozen", "Blazing", "Gentle", "Mighty",
  "Swift", "Brave", "Clever", "Noble", "Ancient", "Sacred", "Secret", "Hidden",
  "Radiant", "Eternal", "Bright", "Silent", "Vivid", "Cheerful", "Calm", "Bold"
];

const nouns = [
  "Butterfly", "Mountain", "Rainbow", "Thunder", "Willow", "Phoenix", "Dragon", "Meadow",
  "Ocean", "Forest", "Sunset", "Moonbeam", "Starlight", "Waterfall", "Garden", "Castle",
  "Eagle", "Tiger", "Dolphin", "Falcon", "Panther", "Unicorn", "Griffin", "Wolf",
  "River", "Valley", "Island", "Canyon", "Glacier", "Volcano", "Prairie", "Jungle"
];

const verbs = [
  "Jumps", "Dances", "Sings", "Flies", "Swims", "Runs", "Sleeps", "Dreams",
  "Laughs", "Whispers", "Shines", "Sparkles", "Glows", "Flows", "Grows", "Blooms"
];

const numbers = ["7", "13", "21", "42", "77", "99", "88", "33", "55", "66"];

const memoryTips = [
  "Create a mental image of {codeword} - visualize it in detail",
  "Associate {codeword} with a favorite family memory",
  "Practice saying {codeword} together as a family once a week",
  "Write {codeword} on a card and keep it in a safe place at home",
  "Create a silly song or rhyme using {codeword}"
];

const emergencyScenarios = [
  {
    title: "Grandparent Scam Call",
    description: "Someone calls claiming to be a grandchild in trouble",
    response: "Ask for the family codeword before sending any money or information"
  },
  {
    title: "Fake Authority Figure",
    description: "Someone claims to be from a school, hospital, or police",
    response: "Hang up and call the institution directly using a known number"
  },
  {
    title: "AI Voice Clone",
    description: "A caller sounds exactly like a family member asking for money",
    response: "Always verify with the codeword - AI cannot know your secret phrase"
  },
  {
    title: "Urgent Emergency Request",
    description: "Someone pressures you to act immediately without verification",
    response: "Real emergencies can wait 2 minutes for codeword verification"
  }
];

type CodewordStyle = "simple" | "phrase" | "memorable";

interface GeneratedCodeword {
  codeword: string;
  style: CodewordStyle;
  memoryTip: string;
}

export function FamilyCodeword() {
  const [generatedCodeword, setGeneratedCodeword] = useState<GeneratedCodeword | null>(null);
  const [copied, setCopied] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [activeTab, setActiveTab] = useState("generate");

  const generateCodeword = useCallback((style: CodewordStyle): GeneratedCodeword => {
    let codeword = "";
    
    switch (style) {
      case "simple":
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const num = numbers[Math.floor(Math.random() * numbers.length)];
        codeword = `${adj}${noun}${num}`;
        break;
      case "phrase":
        const adj2 = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun2 = nouns[Math.floor(Math.random() * nouns.length)];
        const verb = verbs[Math.floor(Math.random() * verbs.length)];
        codeword = `${adj2} ${noun2} ${verb}`;
        break;
      case "memorable":
        const words = [
          adjectives[Math.floor(Math.random() * adjectives.length)],
          nouns[Math.floor(Math.random() * nouns.length)],
          adjectives[Math.floor(Math.random() * adjectives.length)],
          nouns[Math.floor(Math.random() * nouns.length)]
        ];
        codeword = words.join("-");
        break;
    }
    
    const tipTemplate = memoryTips[Math.floor(Math.random() * memoryTips.length)];
    const memoryTip = tipTemplate.replace("{codeword}", `"${codeword}"`);
    
    return { codeword, style, memoryTip };
  }, []);

  const handleGenerate = (style: CodewordStyle) => {
    setGeneratedCodeword(generateCodeword(style));
    setCopied(false);
  };

  const copyToClipboard = async () => {
    if (generatedCodeword) {
      await navigator.clipboard.writeText(generatedCodeword.codeword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareCodeword = async () => {
    if (generatedCodeword && navigator.share) {
      try {
        await navigator.share({
          title: "Family Safety Codeword",
          text: `Our family codeword is: ${generatedCodeword.codeword}\n\nUse this to verify it's really a family member calling in an emergency. Never share this with anyone outside the family.`,
        });
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <Card className="w-full" data-testid="card-family-codeword">
      <CardHeader className="text-center pb-2">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Family Safety Codeword</CardTitle>
        <CardDescription className="text-base max-w-lg mx-auto">
          Create a secret phrase only your family knows. Use it to verify someone's identity 
          when they call claiming to be a family member in trouble.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="generate" className="gap-2" data-testid="tab-generate">
              <Sparkles className="w-4 h-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="how-to-use" className="gap-2" data-testid="tab-how-to-use">
              <Lightbulb className="w-4 h-4" />
              How to Use
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="gap-2" data-testid="tab-scenarios">
              <AlertTriangle className="w-4 h-4" />
              Scenarios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="family-name">Family Name (Optional)</Label>
              <Input
                id="family-name"
                placeholder="e.g., The Johnsons"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                data-testid="input-family-name"
              />
              <p className="text-xs text-muted-foreground">
                This helps personalize your codeword experience
              </p>
            </div>

            <div className="space-y-3">
              <Label>Choose a Codeword Style</Label>
              <div className="grid gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-4 justify-start"
                  onClick={() => handleGenerate("simple")}
                  data-testid="button-generate-simple"
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Star className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Simple Word</div>
                      <div className="text-sm text-muted-foreground">
                        Easy to remember, like "PurpleButterfly77"
                      </div>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 justify-start"
                  onClick={() => handleGenerate("phrase")}
                  data-testid="button-generate-phrase"
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-accent" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Memorable Phrase</div>
                      <div className="text-sm text-muted-foreground">
                        A short phrase like "Golden Eagle Dances"
                      </div>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 justify-start"
                  onClick={() => handleGenerate("memorable")}
                  data-testid="button-generate-memorable"
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Extra Secure</div>
                      <div className="text-sm text-muted-foreground">
                        Multiple words like "Purple-Mountain-Golden-Eagle"
                      </div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>

            {generatedCodeword && (
              <div className="space-y-4 pt-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-xl blur-xl" />
                  <div className="relative bg-card border-2 border-primary/30 rounded-xl p-6 text-center">
                    <Badge className="mb-3" variant="secondary">
                      {generatedCodeword.style === "simple" ? "Simple" : 
                       generatedCodeword.style === "phrase" ? "Phrase" : "Extra Secure"}
                    </Badge>
                    <div className="text-2xl sm:text-3xl font-bold text-foreground mb-4 font-mono tracking-wide">
                      {generatedCodeword.codeword}
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerate(generatedCodeword.style)}
                        data-testid="button-regenerate"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        New Word
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        data-testid="button-copy-codeword"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 mr-2 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 mr-2" />
                        )}
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={shareCodeword}
                        data-testid="button-share-codeword"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm mb-1">Memory Tip</div>
                      <p className="text-sm text-muted-foreground">
                        {generatedCodeword.memoryTip}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm text-red-800 dark:text-red-200 mb-1">
                        Keep This Secret
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        Never share your family codeword with anyone outside your family. 
                        Real authorities, banks, or schools will never ask for it.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="how-to-use" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <div className="font-medium mb-1">Generate a Unique Codeword</div>
                  <p className="text-sm text-muted-foreground">
                    Use the generator above to create a memorable phrase that only your family knows.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <div className="font-medium mb-1">Share with Family Only</div>
                  <p className="text-sm text-muted-foreground">
                    Tell each family member the codeword in person. Never send it in a way 
                    that could be intercepted (like unencrypted email or social media).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <div className="font-medium mb-1">Practice Using It</div>
                  <p className="text-sm text-muted-foreground">
                    Occasionally practice with family members so everyone remembers. 
                    Consider changing it once a year for extra security.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                  4
                </div>
                <div>
                  <div className="font-medium mb-1">Verify Before Acting</div>
                  <p className="text-sm text-muted-foreground">
                    If someone claims to be a family member in trouble, ask for the codeword 
                    before sending money or taking any action.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5 text-primary" />
                <div className="font-medium">Who Should Know the Codeword?</div>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" /> Immediate family members
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" /> Grandparents and elderly relatives
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" /> Trusted caregivers (if necessary)
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-4">
            <p className="text-muted-foreground mb-4">
              Here are common scam scenarios where your family codeword can protect you:
            </p>

            {emergencyScenarios.map((scenario, index) => (
              <div 
                key={index}
                className="border rounded-lg overflow-hidden"
                data-testid={`scenario-${index}`}
              >
                <div className="bg-muted/50 px-4 py-3 border-b">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div className="font-medium">{scenario.title}</div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase mb-1">
                      The Scenario
                    </div>
                    <p className="text-sm">{scenario.description}</p>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-green-600 uppercase mb-1">
                      Your Response
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      {scenario.response}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-4 mt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm text-amber-800 dark:text-amber-200 mb-1">
                    AI Can Clone Voices
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Scammers can now create convincing copies of a family member's voice using 
                    just a few seconds of audio from social media. A codeword is your best 
                    defense because AI cannot know your secret phrase.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
