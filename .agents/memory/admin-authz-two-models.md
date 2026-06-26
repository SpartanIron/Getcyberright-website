---
name: Two admin authorization models
description: Admin gating is inconsistent across endpoints; reusing a public endpoint for an admin action can 403 role-based admins.
---

# Two admin authorization models coexist

There are two different ways an endpoint decides "is this user an admin":

1. **Role-based** (the admin portal / `server/admin.ts`): `isAdminMiddleware` +
   `/api/admin/check` use `hasMinimumRole(role, "viewer")`. A user can be a valid
   admin via their `role` column while `users.isAdmin` is `false`.
2. **Flag-based** (older/public endpoints, e.g. comment delete in
   `server/routes.ts`): authorize with `user?.isAdmin === true` only.

**Why:** these were added at different times and never unified.

**How to apply:** When an admin-portal screen needs an action, do NOT reuse a
public endpoint that checks `isAdmin` only — a role-based admin (role set,
`isAdmin=false`) can load the portal but get 403 on the action. Add an
admin-scoped route under `/api/admin/*` guarded by `isAdminMiddleware` instead.
Example: the unified inbox uses `DELETE /api/admin/comments/:id` rather than the
public `DELETE /api/news/comments/:id`.

Also: for admin write actions, derive the actor id from `req.session.userId` and
fail closed (401) if absent. Never fall back to a record's existing `userId`
(e.g. the original commenter) for authorship/audit fields.
