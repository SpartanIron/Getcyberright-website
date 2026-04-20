import { db } from "../server/db";
import { sql } from "drizzle-orm";
const r = await db.execute(sql`SELECT COUNT(*) FILTER (WHERE editorial_spine_pending IS TRUE) AS pending, COUNT(*) FILTER (WHERE proposed_spine IS NOT NULL) AS with_proposal, COUNT(*) FILTER (WHERE spine_reviewed_by_human IS TRUE) AS reviewed, COUNT(*) FILTER (WHERE editorial_spine_pending IS TRUE AND proposed_spine IS NULL) AS still_blank FROM news_articles WHERE category IS NOT NULL`);
console.log("RESULT", JSON.stringify(r.rows));
process.exit(0);
