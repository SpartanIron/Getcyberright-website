import { storage } from "./storage";
import {
  distributeGuideContent,
  distributeThreatAlertContent,
  distributeScamIntelContent,
} from "./socialDistributionService";

export async function seedSocialPosts() {
  try {
    const existingPosts = await storage.getSocialPosts(undefined, 1000);
    const existingContentIds = new Set(existingPosts.map(p => p.contentId));

    const guides = await storage.getPublishedGuides();
    const alerts = await storage.getPublishedThreatAlerts();
    const scamIntel = await storage.getPublishedScamIntel();

    const missingGuides = guides.filter(g => !existingContentIds.has(g.id));
    const missingAlerts = alerts.filter(a => !existingContentIds.has(a.id));
    const missingScams = scamIntel.filter(s => !existingContentIds.has(s.id));

    const totalMissing = missingGuides.length + missingAlerts.length + missingScams.length;
    if (totalMissing === 0) {
      console.log(`[social-seed] All published content has social posts (${existingPosts.length} posts exist)`);
      return;
    }

    console.log(`[social-seed] Generating social posts for ${totalMissing} published items without posts...`);

    let totalCreated = 0;

    for (const guide of missingGuides) {
      try {
        const ids = await distributeGuideContent(guide);
        totalCreated += ids.length;
      } catch (err: any) {
        console.error(`[social-seed] Failed for guide "${guide.title}":`, err.message);
      }
    }

    for (const alert of missingAlerts) {
      try {
        const ids = await distributeThreatAlertContent(alert);
        totalCreated += ids.length;
      } catch (err: any) {
        console.error(`[social-seed] Failed for alert "${alert.threatName}":`, err.message);
      }
    }

    for (const scam of missingScams) {
      try {
        const ids = await distributeScamIntelContent(scam);
        totalCreated += ids.length;
      } catch (err: any) {
        console.error(`[social-seed] Failed for scam "${scam.scamName}":`, err.message);
      }
    }

    console.log(`[social-seed] Generated ${totalCreated} social posts for ${missingGuides.length} guides, ${missingAlerts.length} alerts, ${missingScams.length} scam intel entries`);
  } catch (error: any) {
    console.error("[social-seed] Failed to seed social posts:", error.message);
  }
}
