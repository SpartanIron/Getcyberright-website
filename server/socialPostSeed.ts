import { storage } from "./storage";
import {
  distributeGuideContent,
  distributeThreatAlertContent,
  distributeScamIntelContent,
} from "./socialDistributionService";
import { ensureGcrLink } from "./utmTracking";

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

export async function backfillSocialPostLinks() {
  try {
    const allPosts = await storage.getSocialPosts(undefined, 2000);
    const linkPattern = /https?:\/\/(?:www\.)?getcyberright\.com/i;
    const postsWithoutLinks = allPosts.filter(
      p => p.platform !== "instagram" && p.platform !== "alert" && !linkPattern.test(p.postContent)
    );

    if (postsWithoutLinks.length === 0) {
      console.log(`[social-seed] All non-Instagram/alert posts have links`);
      return;
    }

    console.log(`[social-seed] Backfilling links for ${postsWithoutLinks.length} posts...`);

    const guides = await storage.getPublishedGuides();
    const alerts = await storage.getPublishedThreatAlerts();
    const scamIntel = await storage.getPublishedScamIntel();

    const guideMap = new Map(guides.map(g => [g.id, g]));
    const alertMap = new Map(alerts.map(a => [a.id, a]));
    const scamMap = new Map(scamIntel.map(s => [s.id, s]));

    let fixed = 0;
    for (const post of postsWithoutLinks) {
      let canonicalUrl: string;

      if (post.contentType === "guide") {
        const guide = guideMap.get(post.contentId);
        canonicalUrl = guide ? `https://www.getcyberright.com/guides/${guide.slug}` : "https://www.getcyberright.com/guides";
      } else if (post.contentType === "threat_alert") {
        const alert = alertMap.get(post.contentId);
        canonicalUrl = alert ? `https://www.getcyberright.com/alerts/${alert.slug}` : "https://www.getcyberright.com/alerts";
      } else if (post.contentType === "scam_intel") {
        const scam = scamMap.get(post.contentId);
        canonicalUrl = scam ? `https://www.getcyberright.com/scam-intel/${scam.slug}` : "https://www.getcyberright.com/scam-intel";
      } else {
        canonicalUrl = "https://www.getcyberright.com/awareness-hub";
      }

      const slug = post.contentType === "guide" ? guideMap.get(post.contentId)?.slug
        : post.contentType === "threat_alert" ? alertMap.get(post.contentId)?.slug
        : post.contentType === "scam_intel" ? scamMap.get(post.contentId)?.slug
        : undefined;

      const updatedContent = ensureGcrLink(
        post.postContent,
        canonicalUrl,
        post.platform,
        post.contentType,
        slug,
        post.postStyle || undefined
      );

      if (updatedContent !== post.postContent) {
        await storage.updateSocialPost(post.id, { postContent: updatedContent });
        fixed++;
      }
    }

    console.log(`[social-seed] Backfilled links for ${fixed} posts`);
  } catch (error: any) {
    console.error("[social-seed] Failed to backfill social post links:", error.message);
  }
}
