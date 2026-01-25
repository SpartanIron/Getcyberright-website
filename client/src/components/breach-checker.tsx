import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Mail,
  Lock,
  Eye,
  Calendar,
  Bell,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";

interface BreachDetail {
  id: number;
  name: string;
  domain: string;
  date: string | null;
  exposedDataTypes: string[];
  severity: string;
  isPasswordExposed: boolean;
  description: string;
  actionRecommendations: string[];
}

interface TimelineEvent {
  date: string;
  breachName: string;
  severity: string;
}

interface DetailedBreachResult {
  success: boolean;
  email: string;
  found: number;
  exposedDataSummary?: string[];
  breaches: BreachDetail[];
  timeline: TimelineEvent[];
  riskLevel: string;
  overallRecommendations: string[];
  message?: string;
}


function getRiskConfig(level: string, found: number) {
  if (level === 'safe' || found === 0) {
    return {
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
      icon: CheckCircle,
      label: "No Breaches Found",
      description: "Great news! Your email wasn't found in known data breaches."
    };
  }
  if (level === 'critical') {
    return {
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
      icon: XCircle,
      label: "Critical Exposure",
      description: `Your email was found in ${found} data breaches with password exposure. Take action immediately!`
    };
  }
  if (level === 'high' || found >= 5) {
    return {
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
      icon: XCircle,
      label: "High Exposure",
      description: `Your email was found in ${found} data breaches. Take action immediately.`
    };
  }
  if (found >= 2) {
    return {
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-900/20",
      border: "border-orange-200 dark:border-orange-800",
      icon: AlertTriangle,
      label: "Multiple Breaches",
      description: `Your email was found in ${found} data breaches. You should update your passwords.`
    };
  }
  return {
    color: "text-yellow-600",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-200 dark:border-yellow-800",
    icon: AlertTriangle,
    label: "Breach Detected",
    description: `Your email was found in ${found} data breach. Consider updating affected passwords.`
  };
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'critical': return 'bg-red-500 text-white';
    case 'high': return 'bg-orange-500 text-white';
    case 'medium': return 'bg-yellow-500 text-black';
    default: return 'bg-slate-500 text-white';
  }
}


export function BreachChecker() {
  const [email, setEmail] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<DetailedBreachResult | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [expandedBreach, setExpandedBreach] = useState<number | null>(null);
  
  const [showMonitorSignup, setShowMonitorSignup] = useState(false);
  const [additionalEmails, setAdditionalEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  const checkBreach = async () => {
    if (!email.trim() || isChecking) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return;

    setIsChecking(true);
    setResult(null);
    setShowMonitorSignup(false);
    setSubscriptionSuccess(false);

    try {
      const response = await apiRequest("/api/breach-check/detailed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() })
      });
      
      setResult(response);
      setShowMonitorSignup(true);
    } catch (error) {
      console.error("Breach check error:", error);
      setResult({
        success: false,
        email: email.trim(),
        found: 0,
        breaches: [],
        timeline: [],
        riskLevel: "unknown",
        overallRecommendations: [],
        message: "Unable to check at this time. Please try again later."
      });
    } finally {
      setIsChecking(false);
    }
  };


  const addEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (newEmail && emailRegex.test(newEmail) && additionalEmails.length < 4) {
      if (!additionalEmails.includes(newEmail) && newEmail !== email) {
        setAdditionalEmails([...additionalEmails, newEmail]);
      }
      setNewEmail("");
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setAdditionalEmails(additionalEmails.filter(e => e !== emailToRemove));
  };

  const subscribeToMonitoring = async () => {
    if (isSubscribing) return;
    setIsSubscribing(true);

    try {
      await apiRequest("/api/breach-monitor/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          monitoredEmails: additionalEmails,
          subscribeNewsletter
        })
      });
      setSubscriptionSuccess(true);
      setShowMonitorSignup(false);
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkBreach();
    }
  };

  const resetCheck = () => {
    setEmail("");
    setResult(null);
    setShowMonitorSignup(false);
    setSubscriptionSuccess(false);
    setAdditionalEmails([]);
  };

  const riskConfig = result ? getRiskConfig(result.riskLevel, result.found) : null;

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl lg:max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 lg:mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm mb-4">
              <Eye className="w-4 h-4" />
              Data Breach Check
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
              Was Your Data Exposed?
            </h2>
            <p className="text-slate-400 lg:text-lg">
              Check if your email was exposed in a data breach
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 md:p-6">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter your email address"
                      className="pl-10 h-12 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-0"
                      disabled={isChecking}
                    />
                  </div>
                  <Button
                    onClick={checkBreach}
                    disabled={!email.trim() || isChecking}
                    className="h-12 px-6 bg-red-500 hover:bg-red-600 text-white font-bold"
                  >
                    {isChecking ? <Loader2 className="w-5 h-5 animate-spin" /> : "Check"}
                  </Button>
                </div>

                <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  We never store your email. Checked against Have I Been Pwned database.
                </p>

                <AnimatePresence>
                  {result && riskConfig && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6"
                    >
                      <div className={`p-4 rounded-lg ${riskConfig.bg} ${riskConfig.border} border text-left`}>
                        <div className="flex items-start gap-3">
                          <riskConfig.icon className={`w-6 h-6 ${riskConfig.color} flex-shrink-0 mt-0.5`} />
                          <div className="flex-1">
                            <h4 className={`font-bold ${riskConfig.color}`}>
                              {riskConfig.label}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                              {riskConfig.description}
                            </p>

                            {result.exposedDataSummary && result.exposedDataSummary.length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                                  Data types exposed:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {result.exposedDataSummary.map((field, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {field}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {result.breaches.length > 0 && (
                              <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    Breaches ({result.breaches.length}):
                                  </p>
                                  {result.timeline.length > 0 && (
                                    <button
                                      onClick={() => setShowTimeline(!showTimeline)}
                                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                    >
                                      <Clock className="w-3 h-3" />
                                      {showTimeline ? 'Hide Timeline' : 'Show Timeline'}
                                    </button>
                                  )}
                                </div>
                                
                                {showTimeline && result.timeline.length > 0 && (
                                  <div className="mb-4 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                                    <p className="text-xs font-bold text-slate-700 dark:text-white mb-2">Breach Timeline</p>
                                    <div className="space-y-2">
                                      {result.timeline.map((event, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs">
                                          <div className="w-2 h-2 rounded-full bg-red-500" />
                                          <span className="text-slate-500">{event.date}</span>
                                          <span className="text-slate-700 dark:text-slate-300">{event.breachName}</span>
                                          <Badge className={`${getSeverityColor(event.severity)} text-[10px] px-1.5 py-0`}>
                                            {event.severity}
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div className="space-y-2">
                                  {result.breaches.map((breach) => (
                                    <div
                                      key={breach.id}
                                      className="bg-white/50 dark:bg-slate-800/50 rounded-lg overflow-hidden"
                                    >
                                      <button
                                        onClick={() => setExpandedBreach(expandedBreach === breach.id ? null : breach.id)}
                                        className="w-full p-3 flex items-center justify-between text-left hover:bg-white/30 dark:hover:bg-slate-700/30 transition-colors"
                                      >
                                        <div className="flex items-center gap-2">
                                          <Lock className="w-4 h-4 text-slate-500" />
                                          <span className="font-medium text-slate-700 dark:text-white text-sm">
                                            {breach.name}
                                          </span>
                                          <Badge className={`${getSeverityColor(breach.severity)} text-xs`}>
                                            {breach.severity}
                                          </Badge>
                                          {breach.isPasswordExposed && (
                                            <Badge className="bg-red-600 text-white text-xs">
                                              Password Exposed
                                            </Badge>
                                          )}
                                        </div>
                                        {expandedBreach === breach.id ? (
                                          <ChevronUp className="w-4 h-4 text-slate-400" />
                                        ) : (
                                          <ChevronDown className="w-4 h-4 text-slate-400" />
                                        )}
                                      </button>
                                      
                                      {expandedBreach === breach.id && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: "auto", opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          className="px-3 pb-3"
                                        >
                                          {breach.date && (
                                            <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                                              <Calendar className="w-3 h-3" />
                                              Breach date: {breach.date}
                                            </p>
                                          )}
                                          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                                            {breach.description}
                                          </p>
                                          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded p-2">
                                            <p className="text-xs font-bold text-yellow-800 dark:text-yellow-200 mb-1">
                                              Recommended Actions:
                                            </p>
                                            <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                                              {breach.actionRecommendations.map((action, i) => (
                                                <li key={i} className="flex items-start gap-1">
                                                  <span className="text-yellow-600">•</span>
                                                  {action}
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        </motion.div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {result.overallRecommendations.length > 0 && (
                              <div className="mt-4 p-3 bg-white/50 dark:bg-slate-800/50 rounded">
                                <p className="text-xs font-bold text-slate-700 dark:text-white mb-1">
                                  What to do next:
                                </p>
                                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                                  {result.overallRecommendations.slice(0, 3).map((rec, i) => (
                                    <li key={i}>• {rec}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {showMonitorSignup && !subscriptionSuccess && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mt-4 p-4 rounded-lg border ${result.found === 0 ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'}`}
                              >
                                <div className="flex items-start gap-2 mb-3">
                                  <Bell className={`w-5 h-5 flex-shrink-0 ${result.found === 0 ? 'text-teal-600' : 'text-blue-600'}`} />
                                  <div>
                                    <p className={`font-bold text-sm ${result.found === 0 ? 'text-teal-800 dark:text-teal-200' : 'text-blue-800 dark:text-blue-200'}`}>
                                      {result.found === 0 ? 'Stay Protected' : 'Get Alerted to Future Breaches'}
                                    </p>
                                    <p className={`text-xs ${result.found === 0 ? 'text-teal-600 dark:text-teal-300' : 'text-blue-600 dark:text-blue-300'}`}>
                                      {result.found === 0 
                                        ? "Get notified immediately if your email ever appears in a new breach"
                                        : "We'll notify you if your email appears in new breaches"}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="space-y-3">
                                  <div>
                                    <p className={`text-xs mb-2 ${result.found === 0 ? 'text-teal-700 dark:text-teal-300' : 'text-blue-700 dark:text-blue-300'}`}>
                                      Monitor additional emails (up to 5 total):
                                    </p>
                                    <div className="flex gap-2 mb-2">
                                      <Input
                                        type="email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        placeholder="Add family member's email"
                                        className="h-9 text-sm bg-white dark:bg-slate-800"
                                        disabled={additionalEmails.length >= 4}
                                      />
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={addEmail}
                                        disabled={additionalEmails.length >= 4}
                                        className="h-9"
                                      >
                                        <Plus className="w-4 h-4" />
                                      </Button>
                                    </div>
                                    {additionalEmails.length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        {additionalEmails.map((e) => (
                                          <Badge key={e} variant="secondary" className="text-xs flex items-center gap-1">
                                            {e}
                                            <button onClick={() => removeEmail(e)}>
                                              <X className="w-3 h-3" />
                                            </button>
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Checkbox
                                      id="newsletter"
                                      checked={subscribeNewsletter}
                                      onCheckedChange={(checked) => setSubscribeNewsletter(checked as boolean)}
                                    />
                                    <label htmlFor="newsletter" className={`text-xs ${result.found === 0 ? 'text-teal-700 dark:text-teal-300' : 'text-blue-700 dark:text-blue-300'}`}>
                                      Also send me weekly security tips
                                    </label>
                                  </div>
                                  
                                  <Button
                                    onClick={subscribeToMonitoring}
                                    disabled={isSubscribing}
                                    className={`w-full text-white ${result.found === 0 ? 'bg-teal-600 hover:bg-teal-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                                  >
                                    {isSubscribing ? (
                                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                      <Bell className="w-4 h-4 mr-2" />
                                    )}
                                    Start Monitoring
                                  </Button>
                                </div>
                              </motion.div>
                            )}

                            {subscriptionSuccess && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                              >
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                    You're now protected! We'll alert you to new breaches.
                                  </p>
                                </div>
                              </motion.div>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={resetCheck}
                              className="mt-4 border-slate-300 dark:border-slate-600"
                            >
                              Check Another
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
