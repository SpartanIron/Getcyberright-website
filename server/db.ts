import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

let db: ReturnType<typeof drizzle<typeof schema>>;

if (process.env.DATABASE_URL) {
  const client = postgres(process.env.DATABASE_URL);
  db = drizzle(client, { schema });
} else {
  console.warn("[db] DATABASE_URL not set — database queries will fail at runtime");
  db = new Proxy({} as any, {
    get(_, prop) {
      if (prop === "select" || prop === "insert" || prop === "update" || prop === "delete" || prop === "query") {
        return () => {
          throw new Error("DATABASE_URL environment variable is not set");
        };
      }
      return undefined;
    },
  });
}

export { db };
