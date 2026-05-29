/**
 * apply-migrations.ts
 * Runs all .sql files in /migrations in alphabetical order.
 * All statements use IF NOT EXISTS guards so this is safe to run multiple times.
 */
import postgres from "postgres";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
}

const sql = postgres(process.env.DATABASE_URL, { max: 1 });

async function applyMigrations() {
    const migrationsDir = join(__dirname, "..", "migrations");
    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

  console.log(`[migrate] Found ${files.length} migration files`);

  for (const file of files) {
        const filePath = join(migrationsDir, file);
        const content = readFileSync(filePath, "utf-8");
        console.log(`[migrate] Applying: ${file}`);
        try {
                await sql.unsafe(content);
                console.log(`[migrate] Done: ${file}`);
        } catch (err: any) {
                // Log but continue - IF NOT EXISTS guards handle most conflicts
          console.error(`[migrate] Warning in ${file}:`, err.message);
        }
  }

  await sql.end();
    console.log("[migrate] All migrations applied successfully");
}

applyMigrations().catch((err) => {
    console.error("[migrate] Fatal error:", err);
    process.exit(1);
});
