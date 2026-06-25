---
name: social_posts table is dropped & recreated on every startup
description: Why schema changes to social_posts must be mirrored in newsSeedArticles.ts, not just migrations
---

# social_posts is DROP/CREATEd on every boot

`server/newsSeedArticles.ts` unconditionally runs `DROP TABLE IF EXISTS "social_posts"`
then recreates it from a **hardcoded column list** on every startup, and this runs
*after* `server/migrate.ts`.

**Why this matters:** any migration that adds a column to `social_posts` (e.g. a
Drizzle migration in `migrations/`) is silently undone on the next restart unless the
same column is also added to the hardcoded CREATE in `newsSeedArticles.ts`. The
migration "passing" in the logs is not enough — the seed wins because it runs last.

**How to apply:** when changing the `social_posts` schema, edit BOTH
`shared/schema.ts` + a migration AND the CREATE statement in `newsSeedArticles.ts`.
After restart, verify the column actually exists at runtime (the seed log line
"Recreated social_posts table" appears after migrate).

Note: this DROP also wipes social_posts rows on every boot, which is existing
(questionable) behavior — out of scope to fix unless asked, but be aware data does
not persist across restarts for this table.
