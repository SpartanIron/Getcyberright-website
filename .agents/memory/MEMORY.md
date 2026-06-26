# Memory Index

- [Social publish-time formatting](social-publish-formatting.md) — per-platform rules live at the Buffer chokepoint; X char-cap must survive a URL longer than the budget; empty-body gate must strip the citation receipt first.
- [Shield-security test flakiness](shield-security-test-flakiness.md) — its 3-request rate-limit budget makes repeated runs report 429 instead of 400; restart the server to reset. A separate pre-existing `/api/shield/start-trial` 404 fails the suite regardless.
- [social_posts table recreated on boot](social-posts-table-recreate.md) — newsSeedArticles.ts DROP/CREATEs social_posts after migrate; mirror any column change there or it gets wiped.
- [Two admin authz models](admin-authz-two-models.md) — role-based (`hasMinimumRole`) vs flag-based (`isAdmin`); admin-portal actions must use `/api/admin/*` routes, not public endpoints, or role-based admins get 403.
- [Human approve overrides the fact-check](social-review-human-override.md) — a person clicking Approve publishes even if the claim re-audit fails; only the unattended sweeper still requires a clean re-audit.
- [zod 4 renamed .errors to .issues](zod4-errors-renamed-issues.md) — ZodError.errors is undefined at runtime here; use .issues or 400 responses silently lose their validation detail. tsc is not a deploy gate (tsx + ignoreBuildErrors).
