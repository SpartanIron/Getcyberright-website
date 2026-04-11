import { db } from "../../server/db";
import { cyberSafetyGuides, scamIntelligence, newsArticles, learningPaths } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

function serialize<T>(rows: T[]): T[] {
  return JSON.parse(JSON.stringify(rows));
}

export async function getPublishedGuides() {
  try {
    const rows = await db
      .select()
      .from(cyberSafetyGuides)
      .where(eq(cyberSafetyGuides.status, "published"))
      .orderBy(desc(cyberSafetyGuides.publishedAt));
    return serialize(rows);
  } catch {
    return [];
  }
}

export async function getPublishedScamIntel() {
  try {
    const rows = await db
      .select()
      .from(scamIntelligence)
      .where(eq(scamIntelligence.status, "published"))
      .orderBy(desc(scamIntelligence.createdAt));
    return serialize(rows);
  } catch {
    return [];
  }
}

export async function getLatestNews(limit = 100) {
  try {
    const articles = await db
      .select()
      .from(newsArticles)
      .orderBy(desc(newsArticles.publishedAt))
      .limit(limit);

    return {
      articles: articles.map(a => ({
        id: a.id,
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        category: a.category,
        source: a.source,
        url: a.sourceUrl,
        imageUrl: a.imageUrl,
        thumbnailUrl: a.thumbnailUrl,
        publishedAt: a.publishedAt?.toISOString() || new Date().toISOString(),
        readTime: a.content ? Math.ceil(a.content.split(/\s+/).length / 200) : 2,
        slug: a.slug,
        urgencyLevel: a.urgencyLevel,
        relatedToolUrl: a.relatedToolUrl,
        relatedToolName: a.relatedToolName,
      })),
      lastUpdated: articles[0]?.createdAt?.toISOString() || null,
      stats: {
        categories: [...new Set(articles.map(a => a.category))],
        totalArticles: articles.length,
        lastFetch: articles[0]?.createdAt?.toISOString() || null,
      },
    };
  } catch {
    return { articles: [], lastUpdated: null, stats: { categories: [], totalArticles: 0, lastFetch: null } };
  }
}

export async function getAllLearningPaths() {
  try {
    const rows = await db
      .select()
      .from(learningPaths)
      .orderBy(desc(learningPaths.createdAt));
    return serialize(rows);
  } catch {
    return [];
  }
}
