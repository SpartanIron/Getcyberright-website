import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Wifi, Lock, Eye, AlertTriangle, Users, Globe, Smartphone, CheckCircle, XCircle, MapPin } from "lucide-react";
import { platformSafetyData } from "./quiz-data";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon: typeof Shield;
  color: string;
  bgColor: string;
}

function AnimatedCounter({ target, suffix, duration = 2000 }: { target: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold">
      {count}{suffix}
    </div>
  );
}

const statsForAge: Record<string, StatItem[]> = {
  "6-10": [
    { value: 91, suffix: "%", label: "of kids aged 8-12 are online every day", icon: Wifi, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
    { value: 1, suffix: " in 3", label: "kids have seen something upsetting online", icon: Eye, color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
    { value: 59, suffix: "%", label: "of kids use the same password for multiple accounts", icon: Lock, color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
    { value: 40, suffix: "%", label: "of kids have talked to a stranger online", icon: Users, color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
  ],
  "11-13": [
    { value: 95, suffix: "%", label: "of teens use social media regularly", icon: Smartphone, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
    { value: 46, suffix: "%", label: "of teens have experienced cyberbullying", icon: AlertTriangle, color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
    { value: 64, suffix: "%", label: "of young gamers have encountered suspicious offers", icon: Shield, color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
    { value: 70, suffix: "%", label: "of teens do not tell parents about negative online experiences", icon: Users, color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
  ],
  "14-16": [
    { value: 97, suffix: "%", label: "of teens own a smartphone with internet access", icon: Smartphone, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
    { value: 36, suffix: "%", label: "of teens have clicked on a phishing link at least once", icon: AlertTriangle, color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
    { value: 82, suffix: "%", label: "of identity theft victims under 18 know the perpetrator", icon: Eye, color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
    { value: 60, suffix: "%", label: "of teens have seen deepfake content but could not identify it", icon: Globe, color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
  ],
};

export function CyberStatsInfographic({ ageGroup }: { ageGroup: string }) {
  const stats = statsForAge[ageGroup] || statsForAge["6-10"];

  return (
    <div data-testid="cyber-stats-infographic">
      <div className="text-center mb-6">
        <Badge className="mb-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">Did You Know?</Badge>
        <h3 className="text-xl font-bold text-foreground">Cybersecurity Facts</h3>
        <p className="text-sm text-muted-foreground mt-1">Real statistics about online safety for your age group</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className={`${stat.bgColor} border-0 shadow-sm`}>
            <CardContent className="p-4 text-center">
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <p className="text-xs text-muted-foreground mt-1 leading-tight">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function SafetyTipCarousel({ ageGroup }: { ageGroup: string }) {
  const [current, setCurrent] = useState(0);

  const tips: Record<string, { tip: string; icon: typeof Shield; color: string }[]> = {
    "6-10": [
      { tip: "Never share your real name, school, or address with anyone online", icon: Shield, color: "from-teal-400 to-blue-500" },
      { tip: "Use a fun nickname instead of your real name for online accounts", icon: Users, color: "from-green-400 to-emerald-500" },
      { tip: "Tell a trusted adult if anything online makes you uncomfortable", icon: Eye, color: "from-orange-400 to-red-500" },
      { tip: "Strong passwords are like secret codes; never share them!", icon: Lock, color: "from-purple-400 to-pink-500" },
      { tip: "If a pop-up says you won something, it is always a trick", icon: AlertTriangle, color: "from-yellow-400 to-orange-500" },
    ],
    "11-13": [
      { tip: "Set all your social media accounts to private by default", icon: Lock, color: "from-purple-400 to-indigo-500" },
      { tip: "Think before you post; screenshots last forever", icon: Eye, color: "from-blue-400 to-cyan-500" },
      { tip: "Report cyberbullying instead of responding to it", icon: Shield, color: "from-teal-400 to-green-500" },
      { tip: "Free in-game currency generators are always scams", icon: AlertTriangle, color: "from-orange-400 to-red-500" },
      { tip: "Your digital footprint follows you to college and job applications", icon: Globe, color: "from-pink-400 to-rose-500" },
    ],
    "14-16": [
      { tip: "Use a password manager to create unique passwords for every account", icon: Lock, color: "from-indigo-400 to-purple-500" },
      { tip: "Enable two-factor authentication on every account that offers it", icon: Shield, color: "from-green-400 to-teal-500" },
      { tip: "Verify news from at least 3 sources before sharing it", icon: Globe, color: "from-blue-400 to-indigo-500" },
      { tip: "No legitimate investment guarantees returns; if they do, it is a scam", icon: AlertTriangle, color: "from-red-400 to-orange-500" },
      { tip: "AI-generated deepfakes exist; always verify shocking content", icon: Eye, color: "from-purple-400 to-pink-500" },
    ],
  };

  const items = tips[ageGroup] || tips["6-10"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  const item = items[current];

  return (
    <Card className="border-2 border-primary/20 overflow-hidden" data-testid="safety-tip-carousel">
      <CardContent className="p-0">
        <div className={`bg-gradient-to-r ${item.color} p-6 text-white transition-all duration-500`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium opacity-80 mb-1">Safety Tip #{current + 1}</p>
              <p className="font-semibold text-lg leading-snug">{item.tip}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-1.5 py-3 bg-muted/30">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === current ? "bg-primary w-6" : "bg-muted-foreground/30"}`}
              data-testid={`button-tip-${idx}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const regionLabels: Record<string, string> = {
  global: "Global Platforms",
  americas: "Americas",
  africa: "Africa",
  asia: "Asia",
};

const platformIcons: Record<string, typeof Shield> = {
  video: Smartphone,
  camera: Eye,
  play: Globe,
  headphones: Users,
  gamepad: Smartphone,
  message: AlertTriangle,
  "message-circle": Globe,
};

export function PlatformSafetyGuide({ ageGroup }: { ageGroup: string }) {
  const regions = Object.keys(platformSafetyData);
  const [activeRegion, setActiveRegion] = useState("global");

  return (
    <div data-testid="platform-safety-guide">
      <div className="text-center mb-6">
        <Badge className="mb-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
          <MapPin className="w-3 h-3 mr-1" /> Region-Aware Safety
        </Badge>
        <h3 className="text-xl font-bold text-foreground">Platform Safety Guide</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Learn how to stay safe on popular apps and platforms used{" "}
          {ageGroup === "6-10" ? "by kids" : ageGroup === "11-13" ? "by teens" : "by young adults"} around the world
        </p>
      </div>

      <Tabs value={activeRegion} onValueChange={setActiveRegion}>
        <TabsList className="flex flex-wrap h-auto gap-1.5 bg-muted/50 p-1.5 rounded-xl mb-4">
          {regions.map((region) => (
            <TabsTrigger
              key={region}
              value={region}
              className="text-sm px-3 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              data-testid={`tab-region-${region}`}
            >
              {regionLabels[region] || region}
            </TabsTrigger>
          ))}
        </TabsList>

        {regions.map((region) => (
          <TabsContent key={region} value={region}>
            <div className="space-y-4">
              {(platformSafetyData[region] || []).map((platform) => {
                const Icon = platformIcons[platform.icon] || Shield;
                return (
                  <Card key={platform.platform} className="overflow-hidden" data-testid={`card-platform-${platform.platform.toLowerCase().replace(/\s/g, "-")}`}>
                    <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-primary/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{platform.platform}</CardTitle>
                          <CardDescription className="text-xs">{platform.region}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div>
                        <h5 className="text-sm font-semibold text-green-700 dark:text-green-300 flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4" /> Safety Tips
                        </h5>
                        <ul className="space-y-1.5">
                          {platform.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                              <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-red-700 dark:text-red-300 flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4" /> Watch Out For
                        </h5>
                        <ul className="space-y-1.5">
                          {platform.dangers.map((danger, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                              <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                              <span>{danger}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
