import { readdir, readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Runs all pending SQL migration files from the migrations/ directory in
 * lexicographic order. Uses a simple tracking table to ensure each migration
 * is only applied once, making it safe to call on every startup.
 */
export async function runMigrations(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const sql = postgres(process.env.DATABASE_URL, { max: 1 });

  try {
    // Create the migrations tracking table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS "_migrations" (
        "id" serial PRIMARY KEY,
        "filename" varchar(255) UNIQUE NOT NULL,
        "applied_at" timestamp DEFAULT now() NOT NULL
      )
    `;

    // Resolve the migrations directory relative to the project root
    const migrationsDir = join(__dirname, "..", "migrations");

    let files: string[];
    try {
      const entries = await readdir(migrationsDir);
      files = entries
        .filter((f) => f.endsWith(".sql"))
        .sort(); // lexicographic order ensures 0000_, 0001_, etc. run in sequence
    } catch {
      console.log("[migrate] No migrations directory found, skipping.");
      return;
    }

    if (files.length === 0) {
      console.log("[migrate] No migration files found.");
      return;
    }

    // Fetch already-applied migrations
    const applied = await sql<{ filename: string }[]>`
      SELECT filename FROM "_migrations"
    `;
    const appliedSet = new Set(applied.map((r) => r.filename));

    const pending = files.filter((f) => !appliedSet.has(f));

    if (pending.length === 0) {
      console.log("[migrate] All migrations already applied.");
      return;
    }

    console.log(`[migrate] Running ${pending.length} pending migration(s)...`);

    for (const filename of pending) {
      const filePath = join(migrationsDir, filename);
      const sqlContent = await readFile(filePath, "utf-8");

      console.log(`[migrate] Applying: ${filename}`);

      // Execute the migration SQL, then record it — both in the same transaction
      await sql.begin(async (tx) => {
        await tx.unsafe(sqlContent);
        await tx`
          INSERT INTO "_migrations" (filename) VALUES (${filename})
        `;
      });

      console.log(`[migrate] Applied:  ${filename}`);
    }

    console.log("[migrate] All migrations applied successfully.");
  } finally {
    await sql.end();
  }
}
