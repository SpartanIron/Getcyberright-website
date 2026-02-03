import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  ArrowLeft, 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  ChevronRight,
  RefreshCw,
  FileText,
  Target,
  TrendingUp,
  Clock,
  Lightbulb,
  CheckCheck,
  AlertCircle
} from "lucide-react";

interface ComplianceStats {
  totalControls: number;
  implementedControls: number;
  partialControls: number;
  notImplementedControls: number;
  notApplicableControls: number;
  applicableControls: number;
  overallScore: number;
  criticalScore: number;
  gapsCount: number;
  familyCount: number;
}

interface ControlFamily {
  id: string;
  name: string;
  description: string;
  totalControls: number;
  implementedControls: number;
  partialControls: number;
  notApplicableControls: number;
  complianceScore: number;
  priority: string;
  lastAssessment: string | null;
}

interface Control {
  id: string;
  familyId: string;
  name: string;
  description: string;
  implementationStatus: string;
  priority: string;
  evidence: string[];
  platformFeatures: string[];
  gaps: string[];
  recommendations: string | null;
  lastAssessment: string | null;
  notes: string | null;
}

interface Assessment {
  id: string;
  assessmentType: string;
  overallScore: number;
  implementedCount: number;
  partialCount: number;
  gapsCount: number;
  summary: string;
  createdAt: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
}

function getScoreGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function getPriorityBadge(priority: string) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    critical: "destructive",
    high: "destructive",
    medium: "default",
    moderate: "default",
    low: "secondary",
  };
  return <Badge variant={variants[priority] || "secondary"}>{priority}</Badge>;
}

function getStatusBadge(status: string) {
  const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof CheckCircle2 }> = {
    implemented: { variant: "default", icon: CheckCircle2 },
    partial: { variant: "secondary", icon: AlertTriangle },
    planned: { variant: "outline", icon: Clock },
    not_implemented: { variant: "destructive", icon: XCircle },
    not_applicable: { variant: "outline", icon: CheckCheck },
  };
  const { variant, icon: Icon } = config[status] || { variant: "secondary", icon: AlertCircle };
  const label = status.replace(/_/g, " ");
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}

export default function AdminCompliance() {
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: statsData, isLoading: statsLoading } = useQuery<{ success: boolean; stats: ComplianceStats }>({
    queryKey: ["/api/compliance/stats"],
  });

  const { data: familiesData, isLoading: familiesLoading } = useQuery<{ success: boolean; families: ControlFamily[] }>({
    queryKey: ["/api/compliance/families"],
  });

  const { data: controlsData } = useQuery<{ success: boolean; controls: Control[] }>({
    queryKey: ["/api/compliance/controls", { familyId: selectedFamily }],
    queryFn: () => fetch(`/api/compliance/controls${selectedFamily ? `?familyId=${selectedFamily}` : ""}`).then(r => r.json()),
  });

  const { data: gapsData } = useQuery<{ success: boolean; gaps: Control[] }>({
    queryKey: ["/api/compliance/gaps"],
  });

  const { data: assessmentsData } = useQuery<{ success: boolean; assessments: Assessment[] }>({
    queryKey: ["/api/compliance/assessments"],
  });

  const invalidateAllQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/compliance/stats"] });
    queryClient.invalidateQueries({ queryKey: ["/api/compliance/families"] });
    queryClient.invalidateQueries({ queryKey: ["/api/compliance/controls"] });
    queryClient.invalidateQueries({ queryKey: ["/api/compliance/gaps"] });
    queryClient.invalidateQueries({ queryKey: ["/api/compliance/assessments"] });
  };

  const runAssessmentMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/compliance/assess"),
    onSuccess: () => {
      toast({ title: "Assessment Complete", description: "NIST 800-53 compliance assessment has been run." });
      invalidateAllQueries();
    },
    onError: (error: any) => {
      const isUnauthorized = error?.message?.includes("401") || error?.status === 401;
      toast({ 
        title: isUnauthorized ? "Admin Access Required" : "Assessment Failed", 
        description: isUnauthorized ? "You must be logged in as an admin." : "Failed to run assessment.", 
        variant: "destructive" 
      });
    },
  });

  const stats = statsData?.stats;
  const families = familiesData?.families || [];
  const controls = controlsData?.controls || [];
  const gaps = gapsData?.gaps || [];
  const assessments = assessmentsData?.assessments || [];

  const sortedFamilies = [...families].sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) - (priorityOrder[b.priority as keyof typeof priorityOrder] || 3);
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Link href="/admin/security">
          <Button variant="ghost" className="mb-4" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Security
          </Button>
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3" data-testid="text-page-title">
              <Shield className="h-8 w-8 text-primary" />
              NIST 800-53 Compliance
            </h1>
            <p className="text-muted-foreground mt-1">
              Security and Privacy Controls Assessment
            </p>
          </div>
          <Button 
            onClick={() => runAssessmentMutation.mutate()} 
            disabled={runAssessmentMutation.isPending}
            data-testid="button-run-assessment"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${runAssessmentMutation.isPending ? "animate-spin" : ""}`} />
            Run Assessment
          </Button>
        </div>

        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6 h-24 bg-muted/20" />
              </Card>
            ))}
          </div>
        ) : stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card data-testid="card-stat-score">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Score</p>
                    <p className={`text-3xl font-bold ${getScoreColor(stats.overallScore)}`}>
                      {stats.overallScore}%
                    </p>
                    <p className="text-xs text-muted-foreground">Grade: {getScoreGrade(stats.overallScore)}</p>
                  </div>
                  <Target className={`h-10 w-10 ${getScoreColor(stats.overallScore)}`} />
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-stat-implemented">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Implemented</p>
                    <p className="text-3xl font-bold text-green-600">{stats.implementedControls}</p>
                    <p className="text-xs text-muted-foreground">of {stats.applicableControls} applicable</p>
                  </div>
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-stat-partial">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Partial</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.partialControls}</p>
                    <p className="text-xs text-muted-foreground">need completion</p>
                  </div>
                  <AlertTriangle className="h-10 w-10 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-stat-gaps">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Gaps Identified</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.gapsCount}</p>
                    <p className="text-xs text-muted-foreground">require attention</p>
                  </div>
                  <Lightbulb className="h-10 w-10 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-6" data-testid="tabs-navigation">
          <TabsList data-testid="tabs-list">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="families" data-testid="tab-families">Control Families</TabsTrigger>
            <TabsTrigger value="gaps" data-testid="tab-gaps">Gaps & Recommendations</TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-history">Assessment History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card data-testid="card-critical-families">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    Critical Control Families
                  </CardTitle>
                  <CardDescription>Highest priority security controls</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sortedFamilies.filter(f => f.priority === "critical").map(family => (
                    <div key={family.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm bg-muted px-2 py-0.5 rounded">{family.id}</span>
                          <span className="font-medium">{family.name}</span>
                        </div>
                        <Progress value={family.complianceScore} className="mt-2 h-2" />
                      </div>
                      <span className={`ml-4 font-bold ${getScoreColor(family.complianceScore)}`}>
                        {family.complianceScore}%
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card data-testid="card-compliance-summary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Compliance Summary
                  </CardTitle>
                  <CardDescription>Control implementation breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                        <span>Fully Implemented</span>
                      </div>
                      <span className="font-bold">{stats?.implementedControls || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                        <span>Partially Implemented</span>
                      </div>
                      <span className="font-bold">{stats?.partialControls || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <span>Not Implemented</span>
                      </div>
                      <span className="font-bold">{stats?.notImplementedControls || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-gray-400" />
                        <span>Not Applicable</span>
                      </div>
                      <span className="font-bold">{stats?.notApplicableControls || 0}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between font-medium">
                      <span>Total Controls</span>
                      <span>{stats?.totalControls || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card data-testid="card-all-families">
              <CardHeader>
                <CardTitle>All Control Families</CardTitle>
                <CardDescription>NIST 800-53 security and privacy control families</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedFamilies.map(family => (
                    <div 
                      key={family.id} 
                      className="border rounded-lg p-4 hover-elevate cursor-pointer"
                      onClick={() => {
                        setSelectedFamily(family.id);
                        const tab = document.querySelector('[data-testid="tab-families"]') as HTMLElement;
                        tab?.click();
                      }}
                      data-testid={`family-card-${family.id}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-lg font-bold">{family.id}</span>
                        {getPriorityBadge(family.priority)}
                      </div>
                      <p className="font-medium text-sm mb-2">{family.name}</p>
                      <Progress value={family.complianceScore} className="h-2 mb-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{family.implementedControls}/{family.totalControls - family.notApplicableControls} controls</span>
                        <span className={getScoreColor(family.complianceScore)}>{family.complianceScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="families" className="space-y-6">
            <Card data-testid="card-family-controls">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Control Family Details</CardTitle>
                    <CardDescription>Select a family to view controls</CardDescription>
                  </div>
                  <select 
                    className="border rounded-md px-3 py-2"
                    value={selectedFamily || ""}
                    onChange={(e) => setSelectedFamily(e.target.value || null)}
                    data-testid="select-family"
                  >
                    <option value="">All Families</option>
                    {families.map(f => (
                      <option key={f.id} value={f.id}>{f.id} - {f.name}</option>
                    ))}
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {controls.map(control => (
                    <div key={control.id} className="border rounded-lg p-4" data-testid={`control-${control.id}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold">{control.id}</span>
                            {getPriorityBadge(control.priority)}
                            {getStatusBadge(control.implementationStatus)}
                          </div>
                          <h4 className="font-medium">{control.name}</h4>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{control.description}</p>
                      
                      {control.platformFeatures.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Platform Features:</p>
                          <div className="flex flex-wrap gap-1">
                            {control.platformFeatures.map((feature, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{feature}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {control.evidence.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Evidence:</p>
                          <ul className="text-xs text-muted-foreground list-disc list-inside">
                            {control.evidence.map((e, i) => (
                              <li key={i}>{e}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {control.gaps.length > 0 && (
                        <div className="mb-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                          <p className="text-xs font-medium text-orange-700 dark:text-orange-400 mb-1">Gaps:</p>
                          <ul className="text-xs text-orange-600 dark:text-orange-300 list-disc list-inside">
                            {control.gaps.map((g, i) => (
                              <li key={i}>{g}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {control.recommendations && (
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">Recommendation:</p>
                          <p className="text-xs text-blue-600 dark:text-blue-300">{control.recommendations}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gaps" className="space-y-6">
            <Card data-testid="card-gaps-list">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Gaps & Recommendations
                </CardTitle>
                <CardDescription>
                  Controls with identified gaps or incomplete implementation ({gaps.length} items)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {gaps.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-600" />
                    <p>No significant gaps identified. Great work!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {gaps.map(control => (
                      <div key={control.id} className="border rounded-lg p-4 border-l-4 border-l-orange-500" data-testid={`gap-${control.id}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono font-bold">{control.id}</span>
                          {getPriorityBadge(control.priority)}
                          {getStatusBadge(control.implementationStatus)}
                        </div>
                        <h4 className="font-medium mb-1">{control.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{control.description}</p>
                        
                        {control.gaps.length > 0 && (
                          <div className="mb-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                            <p className="text-sm font-medium text-orange-700 dark:text-orange-400 mb-2">Identified Gaps:</p>
                            <ul className="text-sm text-orange-600 dark:text-orange-300 list-disc list-inside space-y-1">
                              {control.gaps.map((g, i) => (
                                <li key={i}>{g}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {control.recommendations && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                              <Lightbulb className="h-4 w-4 inline mr-1" />
                              Recommendation
                            </p>
                            <p className="text-sm text-blue-600 dark:text-blue-300">{control.recommendations}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card data-testid="card-assessment-history">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Assessment History
                </CardTitle>
                <CardDescription>Previous compliance assessments</CardDescription>
              </CardHeader>
              <CardContent>
                {assessments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4" />
                    <p>No assessments recorded yet. Run your first assessment above.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[...assessments].reverse().map(assessment => (
                      <div key={assessment.id} className="border rounded-lg p-4" data-testid={`assessment-${assessment.id}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{assessment.assessmentType}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(assessment.createdAt).toLocaleDateString()} {new Date(assessment.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <span className={`text-xl font-bold ${getScoreColor(assessment.overallScore)}`}>
                            {assessment.overallScore}%
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{assessment.summary}</p>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="text-green-600">{assessment.implementedCount} implemented</span>
                          <span className="text-yellow-600">{assessment.partialCount} partial</span>
                          <span className="text-orange-600">{assessment.gapsCount} gaps</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
