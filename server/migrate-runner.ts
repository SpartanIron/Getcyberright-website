import { runMigrations } from "./migrate";

runMigrations()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[migrate-runner] Migration failed:", err);
    process.exit(1);
  });
