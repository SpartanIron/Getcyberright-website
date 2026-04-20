import { storage } from "../server/storage";
import { generateSpineProposal } from "../server/editorialSpineGenerator";
import { db } from "../server/db";
import { newsArticles } from "../shared/schema";

async function main() {
  const all = await db.select().from(newsArticles);
  const targets = all.filter(
    (a) =>
      a.editorialSpinePending === true &&
      !a.spineReviewedByHuman &&
      !a.proposedSpine,
  );
  console.log(`[batch] total=${all.length} pending=${targets.length}`);

  let success = 0;
  let failed = 0;
  let needsAuthor = 0;
  for (const a of targets) {
    try {
      const proposal = await generateSpineProposal(a, [
        "whatChanged",
        "whyThisMatters",
        "actionThisWeek",
        "curatedTopic",
      ]);
      await storage.updateNewsArticle(a.id, { proposedSpine: proposal });
      success++;
      if (proposal.needsAuthorInput) needsAuthor++;
      console.log(
        `[ok ${success}/${targets.length}] ${a.id.slice(0, 8)} ${a.title.slice(0, 60)} | author_input=${proposal.needsAuthorInput}`,
      );
    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[fail] ${a.id.slice(0, 8)} ${a.title.slice(0, 50)}: ${msg}`);
    }
  }
  console.log(`[batch] done success=${success} failed=${failed} needsAuthor=${needsAuthor}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
