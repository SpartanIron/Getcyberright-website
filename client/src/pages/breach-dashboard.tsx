"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "@/lib/navigation";
import { 
  Shield, 
  Mail, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  X, 
  Loader2,
  Bell,
  BellOff,
  Calendar,
  Lock,
  Users,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/use-seo";

interface MonitoringStatus {
  subscribed: boolean;
  email?: string;
  isActive?: boolean;
  monitoredEmails?: string[];
  totalBreachesFound?: number;
}

interface BreachResult {
  id: number;
  name: string;
  breachName?: string;
  domain: string | null;
  date: string | null;
  exposedDataTypes: string[] | null;
  severity: string | null;
  isPasswordExposed: boolean;
}

function getSeverityColor(severity: string | null) {
  switch (severity) {
    case 'critical': return 'bg-red-500 text-white';
    case 'high': return 'bg-orange-500 text-white';
    case 'medium': return 'bg-yellow-500 text-black';
    default: return 'bg-slate-500 text-white';
  }
}

export default function BreachDashboard() {
  useSEO({
    title: "Family Breach Dashboard - GetCyberRight",
    description: "Monitor your family's email addresses for data breaches and get alerted when your data is exposed."
  });

  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const token = urlParams.get('token') || '';
  
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<MonitoringStatus | null>(null);
  const [breachResults, setBreachResults] = useState<Map<string, BreachResult[]>>(new Map());
  const [newEmail, setNewEmail] = useState("");
  const [showAddEmail, setShowAddEmail] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (token) {
      loadDashboard();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/breach-monitor/status?token=${encodeURIComponent(token)}`);
      const data = await response.json();
      setStatus(data);
      
      if (data.subscribed && data.monitoredEmails) {
        const results = new Map<string, BreachResult[]>();
        for (const monitoredEmail of data.monitoredEmails) {
          try {
            const breachResponse = await apiRequest(`/api/breach-check/detailed`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: monitoredEmail })
            });
            if (breachResponse.breaches) {
              results.set(monitoredEmail, breachResponse.breaches);
            }
          } catch (error) {
            console.error(`Failed to check ${monitoredEmail}:`, error);
          }
        }
        setBreachResults(results);
      }
    } catch (error) {
      console.error("Dashboard load error:", error);
      toast({ title: "Failed to load dashboard", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmails = async (updatedEmails: string[]) => {
    setIsUpdating(true);
    try {
      const response = await apiRequest("/api/breach-monitor/update-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          monitoredEmails: updatedEmails
        })
      });
      
      if (status && response.monitoredEmails) {
        setStatus({
          ...status,
          monitoredEmails: response.monitoredEmails
        });
      }
      
      toast({ title: "Emails updated successfully" });
    } catch (error) {
      console.error("Update emails error:", error);
      toast({ title: "Failed to update emails", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  const addEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmail || !emailRegex.test(newEmail)) {
      toast({ title: "Invalid email format", variant: "destructive" });
      return;
    }
    
    if (status?.monitoredEmails && status.monitoredEmails.length >= 5) {
      toast({ title: "Maximum 5 emails allowed", variant: "destructive" });
      return;
    }
    
    const currentEmails = status?.monitoredEmails || [];
    if (currentEmails.includes(newEmail)) {
      toast({ title: "Email already monitored", variant: "destructive" });
      return;
    }
    
    updateEmails([...currentEmails, newEmail]);
    setNewEmail("");
    setShowAddEmail(false);
  };

  const removeEmail = (emailToRemove: string) => {
    if (emailToRemove === status?.email) {
      toast({ title: "Cannot remove your primary email", variant: "destructive" });
      return;
    }
    
    const updatedEmails = (status?.monitoredEmails || []).filter(e => e !== emailToRemove);
    updateEmails(updatedEmails);
    breachResults.delete(emailToRemove);
    setBreachResults(new Map(breachResults));
  };

  const toggleMonitoring = async () => {
    setIsUpdating(true);
    try {
      if (status?.isActive) {
        await fetch(`/api/breach-monitor/unsubscribe?token=${encodeURIComponent(token)}`);
      } else {
        await apiRequest("/api/breach-monitor/resubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        });
      }
      
      if (status) {
        setStatus({ ...status, isActive: !status.isActive });
      }
      
      toast({ 
        title: status?.isActive 
          ? "Monitoring paused" 
          : "Monitoring resumed"
      });
    } catch (error) {
      console.error("Toggle monitoring error:", error);
      toast({ title: "Failed to update monitoring status", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  const totalBreaches = Array.from(breachResults.values()).reduce((sum, breaches) => sum + breaches.length, 0);
  const hasPasswordExposure = Array.from(breachResults.values()).some(breaches => 
    breaches.some(b => b.isPasswordExposed)
  );

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0A2A3C] text-white">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full mb-6">
              <AlertTriangle className="w-5 h-5" />
              Access Required
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-[-0.025em]">
              Family Breach Dashboard
            </h2>
            <p className="text-white/60 mb-8">
              To access your breach monitoring dashboard, you need a secure access link. 
              This link is sent to you when you sign up for breach monitoring.
            </p>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">How to Access Your Dashboard</h3>
                <ol className="text-left text-slate-300 space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">1</span>
                    <span>Go to our homepage and use the Breach Checker to check your email</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">2</span>
                    <span>Sign up for breach monitoring alerts when prompted</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">3</span>
                    <span>Check your email for your secure dashboard link</span>
                  </li>
                </ol>
                
                <Button asChild className="mt-6 bg-blue-500 hover:bg-blue-600">
                  <a href="/#breach-checker">
                    Get Started with Breach Monitoring
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A2A3C] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A2A3C] text-white">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full mb-4">
              <Users className="w-5 h-5" />
              Family Breach Dashboard
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Monitor Your Family's Digital Footprint
            </h1>
            {status?.email && (
              <p className="text-slate-400">
                Monitoring account: <span className="text-white font-medium">{status.email}</span>
              </p>
            )}
          </div>

          {status && !status.subscribed ? (
            <Card className="bg-yellow-500/10 border-yellow-500/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-yellow-300 mb-2">Invalid or Expired Link</h3>
                    <p className="text-slate-300 mb-4">
                      This dashboard link is no longer valid. Please sign up for breach monitoring again to get a new access link.
                    </p>
                    <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
                      <a href="/#breach-checker">Sign Up Again</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : status && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-blue-400">
                      {status.monitoredEmails?.length || 1}
                    </div>
                    <div className="text-sm text-slate-400">Emails Monitored</div>
                  </CardContent>
                </Card>
                <Card className={`border ${totalBreaches > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
                  <CardContent className="p-4 text-center">
                    <div className={`text-3xl font-bold ${totalBreaches > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {totalBreaches}
                    </div>
                    <div className="text-sm text-slate-400">Breaches Found</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4 text-center">
                    <div className={`text-3xl font-bold ${status.isActive ? 'text-green-400' : 'text-slate-400'}`}>
                      {status.isActive ? <Bell className="w-8 h-8 mx-auto" /> : <BellOff className="w-8 h-8 mx-auto" />}
                    </div>
                    <div className="text-sm text-slate-400">
                      {status.isActive ? 'Alerts Active' : 'Alerts Paused'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Monitored Emails ({status.monitoredEmails?.length || 1}/5)
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleMonitoring}
                        disabled={isUpdating}
                        className={status.isActive ? "border-red-400 text-red-400 hover:bg-red-500/10" : "border-green-400 text-green-400 hover:bg-green-500/10"}
                      >
                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : (
                          status.isActive ? <BellOff className="w-4 h-4 mr-1" /> : <Bell className="w-4 h-4 mr-1" />
                        )}
                        {status.isActive ? 'Pause Alerts' : 'Resume Alerts'}
                      </Button>
                      {(status.monitoredEmails?.length || 1) < 5 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAddEmail(!showAddEmail)}
                          className="border-blue-400 text-blue-400 hover:bg-blue-500/10"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Email
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {showAddEmail && (
                    <div className="flex gap-2 mb-4">
                      <Input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="Family member's email"
                        className="bg-white/10 border-white/20"
                      />
                      <Button onClick={addEmail} disabled={isUpdating} className="bg-blue-500 hover:bg-blue-600">
                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
                      </Button>
                      <Button variant="ghost" onClick={() => setShowAddEmail(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {status.monitoredEmails?.map((monitoredEmail) => {
                      const emailBreaches = breachResults.get(monitoredEmail) || [];
                      const hasIssues = emailBreaches.length > 0;
                      
                      return (
                        <div key={monitoredEmail} className="border border-white/10 rounded-lg overflow-hidden">
                          <div className={`p-4 flex items-center justify-between ${hasIssues ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasIssues ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                                {hasIssues ? (
                                  <AlertTriangle className="w-5 h-5 text-red-400" />
                                ) : (
                                  <CheckCircle className="w-5 h-5 text-green-400" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  {monitoredEmail}
                                  {monitoredEmail === status.email && (
                                    <Badge variant="secondary" className="text-xs">Primary</Badge>
                                  )}
                                </div>
                                <div className="text-sm text-slate-400">
                                  {hasIssues 
                                    ? `${emailBreaches.length} breach${emailBreaches.length > 1 ? 'es' : ''} found`
                                    : 'No breaches found'
                                  }
                                </div>
                              </div>
                            </div>
                            {monitoredEmail !== status.email && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeEmail(monitoredEmail)}
                                disabled={isUpdating}
                                className="text-slate-400 hover:text-red-400"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          
                          {hasIssues && (
                            <div className="p-4 space-y-2 bg-black/20">
                              {emailBreaches.map((breach, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded">
                                  <div className="flex items-center gap-3">
                                    <Lock className="w-4 h-4 text-slate-400" />
                                    <div>
                                      <div className="font-medium text-sm">{breach.name || breach.breachName}</div>
                                      {breach.date && (
                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                          <Calendar className="w-3 h-3" />
                                          {breach.date}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {breach.isPasswordExposed && (
                                      <Badge className="bg-red-600 text-white text-xs">Password</Badge>
                                    )}
                                    <Badge className={`${getSeverityColor(breach.severity)} text-xs`}>
                                      {breach.severity || 'medium'}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {hasPasswordExposure && (
                <Card className="bg-red-500/10 border-red-500/30">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-bold text-red-300 mb-2">Password Exposure Detected</h3>
                        <p className="text-slate-300 mb-4">
                          One or more monitored emails has a password exposed in a data breach. Take action immediately:
                        </p>
                        <ul className="text-sm text-slate-400 space-y-1">
                          <li>1. Change the exposed password immediately</li>
                          <li>2. Update any other accounts using the same password</li>
                          <li>3. Enable two-factor authentication</li>
                          <li>4. Consider using a password manager</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <div className="mt-12 text-center text-sm text-slate-500">
            <p>
              Breach data is checked every 24 hours. You'll receive an email alert when new breaches are detected.
            </p>
            <p className="mt-2">
              <a href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</a>
              {' · '}
              <a href="/" className="text-blue-400 hover:underline">Back to Home</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
