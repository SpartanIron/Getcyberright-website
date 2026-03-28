import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScanSearch, Shield, AlertTriangle, Database } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";

interface ShieldScan {
  scanId: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  exposureScore: number | null;
  createdAt: string;
  userId: string | null;
}

interface ExposureScan {
  id: string;
  userId: string | null;
  status: string;
  brokersScanned: number | null;
  exposuresFound: number | null;
  createdAt: string;
}

interface ScamCheck {
  id: string;
  toolName: string;
  userId: string | null;
  sessionId: string | null;
  completed: boolean;
  metadata: string | null;
  createdAt: string;
}

interface ScamReport {
  id: number;
  scamType: string;
  description: string;
  amountLost: string | null;
  createdAt: string;
}

interface DataBrokerData {
  shieldScans: { total: number; completed: number; recent: ShieldScan[] };
  exposureScans: { total: number; recent: ExposureScan[] };
}

interface ScamCheckData {
  scamChecks: { total: number; recent: ScamCheck[] };
  scamReports: { total: number; recent: ScamReport[] };
}

function getExposureBadge(score: number | null) {
  if (score === null) return <Badge variant="secondary">N/A</Badge>;
  if (score >= 80) return <Badge className="bg-red-500 text-white">Critical</Badge>;
  if (score >= 60) return <Badge className="bg-orange-500 text-white">High</Badge>;
  if (score >= 40) return <Badge className="bg-yellow-500 text-white">Medium</Badge>;
  return <Badge className="bg-green-500 text-white">Low</Badge>;
}

export default function ScanManagement() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: adminCheck, isLoading: adminCheckLoading } = useQuery<{ isAdmin: boolean; role: string }>({
    queryKey: ["/api/admin/check"],
    enabled: !!user,
  });

  const { data: brokerData, isLoading: brokerLoading } = useQuery<DataBrokerData>({
    queryKey: ["/api/admin/scans/data-broker"],
    enabled: !!adminCheck?.isAdmin,
  });

  const { data: scamData, isLoading: scamLoading } = useQuery<ScamCheckData>({
    queryKey: ["/api/admin/scans/scam-checks"],
    enabled: !!adminCheck?.isAdmin,
  });

  useEffect(() => {
    if (!authLoading && !user) setLocation("/api/login");
  }, [authLoading, user, setLocation]);

  useEffect(() => {
    if (!adminCheckLoading && adminCheck && !adminCheck.isAdmin) setLocation("/");
  }, [adminCheckLoading, adminCheck, setLocation]);

  if (authLoading || adminCheckLoading || !adminCheck?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2" data-testid="text-scan-management-title">
            <ScanSearch className="w-8 h-8" />
            Scan Activity
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor data broker scans, exposure scans, and scam check activity.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-teal-600" />
                <div>
                  <div className="text-2xl font-bold" data-testid="text-shield-scan-count">
                    {brokerData?.shieldScans.total ?? "-"}
                  </div>
                  <div className="text-xs text-muted-foreground">Data Shield Scans</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold" data-testid="text-completed-scan-count">
                    {brokerData?.shieldScans.completed ?? "-"}
                  </div>
                  <div className="text-xs text-muted-foreground">Completed Scans</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ScanSearch className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold" data-testid="text-exposure-scan-count">
                    {brokerData?.exposureScans.total ?? "-"}
                  </div>
                  <div className="text-xs text-muted-foreground">Exposure Scans</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold" data-testid="text-scam-check-count">
                    {scamData?.scamChecks.total ?? "-"}
                  </div>
                  <div className="text-xs text-muted-foreground">Scam Checks</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="shield" className="space-y-4">
          <TabsList>
            <TabsTrigger value="shield" data-testid="tab-shield-scans">Data Shield Scans</TabsTrigger>
            <TabsTrigger value="exposure" data-testid="tab-exposure-scans">Exposure Scans</TabsTrigger>
            <TabsTrigger value="scam" data-testid="tab-scam-checks">Scam Checks</TabsTrigger>
          </TabsList>

          <TabsContent value="shield">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Data Shield Scans</CardTitle>
              </CardHeader>
              <CardContent>
                {brokerLoading ? (
                  <div className="p-4 text-center text-muted-foreground">Loading...</div>
                ) : !brokerData?.shieldScans.recent.length ? (
                  <div className="p-8 text-center text-muted-foreground">No data shield scans recorded yet.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Exposure Score</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>User</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {brokerData.shieldScans.recent.map((scan) => (
                        <TableRow key={scan.scanId} data-testid={`row-shield-scan-${scan.scanId}`}>
                          <TableCell className="font-medium">{scan.firstName} {scan.lastName}</TableCell>
                          <TableCell className="text-muted-foreground">{scan.email}</TableCell>
                          <TableCell>
                            <Badge variant={scan.status === "complete" ? "default" : "secondary"}>
                              {scan.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{getExposureBadge(scan.exposureScore)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(scan.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {scan.userId ? (
                              <Badge variant="outline" className="text-xs">Registered</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Guest</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exposure">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Exposure Scans (Logged-in Users)</CardTitle>
              </CardHeader>
              <CardContent>
                {brokerLoading ? (
                  <div className="p-4 text-center text-muted-foreground">Loading...</div>
                ) : !brokerData?.exposureScans.recent.length ? (
                  <div className="p-8 text-center text-muted-foreground">No exposure scans recorded yet. These are created when logged-in users run data broker scans.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Scan ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Brokers Scanned</TableHead>
                        <TableHead>Exposures Found</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {brokerData.exposureScans.recent.map((scan) => (
                        <TableRow key={scan.id} data-testid={`row-exposure-scan-${scan.id}`}>
                          <TableCell className="font-mono text-xs">{scan.id.slice(0, 8)}...</TableCell>
                          <TableCell>
                            <Badge variant={scan.status === "completed" ? "default" : "secondary"}>
                              {scan.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{scan.brokersScanned ?? "-"}</TableCell>
                          <TableCell>{scan.exposuresFound ?? "-"}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(scan.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scam">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Scam Checks</CardTitle>
              </CardHeader>
              <CardContent>
                {scamLoading ? (
                  <div className="p-4 text-center text-muted-foreground">Loading...</div>
                ) : !scamData?.scamChecks.recent.length ? (
                  <div className="p-8 text-center text-muted-foreground">No scam checks recorded yet.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Session</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scamData.scamChecks.recent.map((check) => (
                        <TableRow key={check.id} data-testid={`row-scam-check-${check.id}`}>
                          <TableCell className="font-mono text-xs">
                            {(check.sessionId || check.id).slice(0, 12)}...
                          </TableCell>
                          <TableCell>
                            <Badge variant={check.completed ? "default" : "secondary"}>
                              {check.completed ? "Completed" : "Incomplete"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {check.userId ? (
                              <Badge variant="outline" className="text-xs">Registered</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Anonymous</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(check.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
