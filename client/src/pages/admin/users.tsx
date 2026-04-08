import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "@/lib/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users, Trash2, MailCheck, MailX, UserPlus, Crown, ShieldCheck, Pencil, Eye, KeyRound } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

const ROLE_OPTIONS = [
  { value: "user", label: "User", description: "Standard user, no admin access", icon: Users, color: "bg-gray-500" },
  { value: "viewer", label: "Viewer", description: "Read-only admin dashboard access", icon: Eye, color: "bg-slate-500" },
  { value: "editor", label: "Editor", description: "Can manage content and posts", icon: Pencil, color: "bg-blue-500" },
  { value: "admin", label: "Admin", description: "Content, settings, and configuration", icon: ShieldCheck, color: "bg-amber-500" },
  { value: "super_admin", label: "Super Admin", description: "Full access including user management", icon: Crown, color: "bg-purple-500" },
];

function getRoleBadge(role: string | null | undefined) {
  const roleConfig = ROLE_OPTIONS.find(r => r.value === role) || ROLE_OPTIONS[0];
  return (
    <Badge className={`${roleConfig.color} text-white`} data-testid={`badge-role-${role}`}>
      <roleConfig.icon className="w-3 h-3 mr-1" />
      {roleConfig.label}
    </Badge>
  );
}

function getTierBadge(tier: string | null) {
  switch (tier) {
    case "enterprise":
      return <Badge className="bg-purple-500">Enterprise</Badge>;
    case "professional":
      return <Badge className="bg-blue-500">Professional</Badge>;
    case "essential":
      return <Badge className="bg-green-500">Essential</Badge>;
    default:
      return <Badge variant="secondary">Free</Badge>;
  }
}

function CreateUserDialog({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "user",
    subscriptionTier: "free",
    mustChangePassword: true,
  });
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/admin/users", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "User created successfully" });
      setOpen(false);
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "user",
        subscriptionTier: "free",
        mustChangePassword: true,
      });
    },
    onError: async (error: any) => {
      let message = "Failed to create user";
      try {
        const response = error;
        if (response?.error) message = response.error;
      } catch {}
      toast({ title: message, variant: "destructive" });
    },
  });

  if (!isSuperAdmin) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="btn-create-user">
          <UserPlus className="w-4 h-4 mr-2" />
          Create User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Create a new user account with a specific access level. The user will be required to change their password on first login by default.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate(formData);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                data-testid="input-first-name"
                value={formData.firstName}
                onChange={(e) => setFormData(p => ({ ...p, firstName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                data-testid="input-last-name"
                value={formData.lastName}
                onChange={(e) => setFormData(p => ({ ...p, lastName: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              data-testid="input-email"
              value={formData.email}
              onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              data-testid="input-password"
              value={formData.password}
              onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
              placeholder="Minimum 12 characters"
              required
              minLength={12}
            />
          </div>
          <div className="space-y-2">
            <Label>Access Level</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData(p => ({ ...p, role: value }))}
            >
              <SelectTrigger data-testid="select-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex items-center gap-2">
                      <role.icon className="w-4 h-4" />
                      <span>{role.label}</span>
                      <span className="text-xs text-muted-foreground ml-1">- {role.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Subscription Tier</Label>
            <Select
              value={formData.subscriptionTier}
              onValueChange={(value) => setFormData(p => ({ ...p, subscriptionTier: value }))}
            >
              <SelectTrigger data-testid="select-tier">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="essential">Essential</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="mustChangePassword"
              data-testid="checkbox-must-change-password"
              checked={formData.mustChangePassword}
              onCheckedChange={(checked) =>
                setFormData(p => ({ ...p, mustChangePassword: checked === true }))
              }
            />
            <Label htmlFor="mustChangePassword" className="text-sm">
              Require password change on first login
            </Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending} data-testid="btn-submit-create-user">
              {createMutation.isPending ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ResetPasswordDialog({ userId, userEmail }: { userId: string; userEmail: string }) {
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const { toast } = useToast();

  const resetMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/admin/users/${userId}/reset-password`, { newPassword });
    },
    onSuccess: () => {
      toast({ title: "Password reset successfully" });
      setOpen(false);
      setNewPassword("");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: () => {
      toast({ title: "Failed to reset password", variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" data-testid={`btn-reset-password-${userId}`}>
          <KeyRound className="w-4 h-4 text-amber-500" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Set a new password for {userEmail}. The user will be required to change it on their next login.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 12 characters"
              data-testid="input-new-password"
            />
            {newPassword.length > 0 && newPassword.length < 12 && (
              <p className="text-xs text-destructive mt-1">Password must be at least 12 characters</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => resetMutation.mutate()}
            disabled={newPassword.length < 12 || resetMutation.isPending}
            data-testid="btn-confirm-reset-password"
          >
            {resetMutation.isPending ? "Resetting..." : "Reset Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminUsers() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: adminCheck, isLoading: adminCheckLoading } = useQuery<{ isAdmin: boolean; role: string | null }>({
    queryKey: ["/api/admin/check"],
    enabled: !!user,
  });

  const { data, isLoading } = useQuery<{ users: User[] }>({
    queryKey: ["/api/admin/users"],
    enabled: adminCheck?.isAdmin === true,
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      return apiRequest("PATCH", `/api/admin/users/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "User updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update user", variant: "destructive" });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "User deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete user", variant: "destructive" });
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/api/login");
    }
  }, [authLoading, user, setLocation]);

  useEffect(() => {
    if (!adminCheckLoading && adminCheck && !adminCheck.isAdmin) {
      setLocation("/");
    }
  }, [adminCheckLoading, adminCheck, setLocation]);

  if (authLoading || adminCheckLoading || !adminCheck?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const users = data?.users || [];
  const currentRole = adminCheck?.role || "user";
  const isSuperAdmin = currentRole === "super_admin";

  const roleCounts = users.reduce((acc, u) => {
    const role = u.role || "user";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2" data-testid="text-user-management-title">
              <Users className="w-8 h-8" />
              User Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage user accounts, roles, and access levels.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-lg px-3 py-1" data-testid="text-user-count">
              {users.length} Users
            </Badge>
            <CreateUserDialog isSuperAdmin={isSuperAdmin} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {ROLE_OPTIONS.map((role) => (
            <Card key={role.value} className="border">
              <CardContent className="p-3 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${role.color} bg-opacity-10`}>
                  <role.icon className={`w-4 h-4 text-${role.color.replace("bg-", "")}`} />
                </div>
                <div>
                  <div className="text-lg font-semibold" data-testid={`text-count-${role.value}`}>
                    {roleCounts[role.value] || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">{role.label}s</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No users found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Access Level</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} data-testid={`row-user-${u.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {u.profileImageUrl ? (
                            <img
                              src={u.profileImageUrl}
                              alt=""
                              className="w-8 h-8 rounded-full"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <Users className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <span className="font-medium">
                              {u.firstName || u.lastName
                                ? `${u.firstName || ""} ${u.lastName || ""}`.trim()
                                : "Unknown"}
                            </span>
                            {u.mustChangePassword && (
                              <div className="text-xs text-amber-500">Password change required</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {u.email || "No email"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={u.emailVerified ? "default" : "outline"}
                          size="sm"
                          data-testid={`btn-verify-${u.id}`}
                          disabled={!isSuperAdmin && currentRole !== "admin"}
                          onClick={() =>
                            updateUserMutation.mutate({
                              id: u.id,
                              updates: { emailVerified: !u.emailVerified },
                            })
                          }
                        >
                          {u.emailVerified ? (
                            <>
                              <MailCheck className="w-4 h-4 mr-1" />
                              Yes
                            </>
                          ) : (
                            <>
                              <MailX className="w-4 h-4 mr-1" />
                              No
                            </>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {isSuperAdmin ? (
                          <Select
                            value={u.role || "user"}
                            onValueChange={(value) =>
                              updateUserMutation.mutate({
                                id: u.id,
                                updates: { role: value },
                              })
                            }
                            disabled={u.id === user?.id}
                          >
                            <SelectTrigger className="w-40" data-testid={`select-role-${u.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ROLE_OPTIONS.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                  <div className="flex items-center gap-2">
                                    <role.icon className="w-3 h-3" />
                                    {role.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          getRoleBadge(u.role)
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={u.subscriptionTier || "free"}
                          onValueChange={(value) =>
                            updateUserMutation.mutate({
                              id: u.id,
                              updates: { subscriptionTier: value },
                            })
                          }
                          disabled={!isSuperAdmin && currentRole !== "admin"}
                        >
                          <SelectTrigger className="w-32" data-testid={`select-tier-${u.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="essential">Essential</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="enterprise">Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "Unknown"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {u.id !== user?.id && (isSuperAdmin || currentRole === "admin") && (
                            <ResetPasswordDialog userId={u.id} userEmail={u.email || "user"} />
                          )}
                          {isSuperAdmin && u.id !== user?.id ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  data-testid={`btn-delete-${u.id}`}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this user? This action
                                    cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteUserMutation.mutate(u.id)}
                                    className="bg-destructive text-destructive-foreground"
                                    data-testid={`btn-confirm-delete-${u.id}`}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              {u.id === user?.id ? "You" : ""}
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
