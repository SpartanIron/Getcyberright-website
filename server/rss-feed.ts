import type { Request, Response } from "express";
import { storage } from "./storage";

const SITE_URL = "https://www.getcyberright.com";
const FEED_TITLE = "GetCyberRight News & Insights";
const FEED_DESCRIPTION =
  "Cybersecurity news, scam alerts, and family safety guidance from GetCyberRight. Plain-language threat coverage for parents, seniors, and small businesses.";
const FEED_LANGUAGE = "en-us";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cdata(value: string): string {
  const safe = (value || "").replace(/]]>/g, "]]]]><![CDATA[>");
  return `<![CDATA[${safe}]]>`;
}

function toRfc822(date: Date | string | null | undefined): string {
  const d = date ? new Date(date) : new Date();
  if (isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
}

export async function handleNewsRss(_req: Request, res: Response) {
  try {
    const articles = await storage.getNewsArticles(undefined, 50);
    const lastBuild = articles[0]?.publishedAt
      ? toRfc822(articles[0].publishedAt as any)
      : new Date().toUTCString();

    const items = articles
      .map((a: any) => {
        const link = `${SITE_URL}/news/${a.slug}`;
        const ogImage = `${SITE_URL}/og/article/${a.slug}`;
        const articleImage = a.imageUrl || ogImage;
        const author = a.authorName || a.author || "GetCyberRight Team";
        const pubDate = toRfc822(a.publishedAt);
        const category = a.category || "Cybersecurity";
        const description = a.excerpt || a.title;

        return [
          "    <item>",
          `      <title>${cdata(a.title)}</title>`,
          `      <link>${escapeXml(link)}</link>`,
          `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
          `      <pubDate>${pubDate}</pubDate>`,
          `      <dc:creator>${cdata(author)}</dc:creator>`,
          `      <category>${cdata(category)}</category>`,
          `      <description>${cdata(description)}</description>`,
          `      <content:encoded>${cdata(
            `<p>${(a.excerpt || a.title).replace(/</g, "&lt;")}</p>` +
              `<p><a href="${link}">Read the full article on GetCyberRight</a></p>`,
          )}</content:encoded>`,
          `      <enclosure url="${escapeXml(articleImage)}" type="image/png" />`,
          `      <media:content url="${escapeXml(articleImage)}" medium="image" />`,
          `      <media:thumbnail url="${escapeXml(ogImage)}" />`,
          "    </item>",
        ].join("\n");
      })
      .join("\n");

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<rss version="2.0"\n` +
      `  xmlns:content="http://purl.org/rss/1.0/modules/content/"\n` +
      `  xmlns:dc="http://purl.org/dc/elements/1.1/"\n` +
      `  xmlns:atom="http://www.w3.org/2005/Atom"\n` +
      `  xmlns:media="http://search.yahoo.com/mrss/">\n` +
      `  <channel>\n` +
      `    <title>${cdata(FEED_TITLE)}</title>\n` +
      `    <link>${SITE_URL}/news</link>\n` +
      `    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />\n` +
      `    <description>${cdata(FEED_DESCRIPTION)}</description>\n` +
      `    <language>${FEED_LANGUAGE}</language>\n` +
      `    <copyright>© ${new Date().getFullYear()} GetCyberRight. All rights reserved.</copyright>\n` +
      `    <lastBuildDate>${lastBuild}</lastBuildDate>\n` +
      `    <ttl>60</ttl>\n` +
      `    <image>\n` +
      `      <url>${SITE_URL}/og-image.png</url>\n` +
      `      <title>${cdata(FEED_TITLE)}</title>\n` +
      `      <link>${SITE_URL}/news</link>\n` +
      `    </image>\n` +
      items +
      `\n  </channel>\n</rss>\n`;

    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=900, s-maxage=900");
    res.send(xml);
  } catch (err) {
    console.error("[rss] feed generation failed", err);
    res.status(500).send("Failed to generate RSS feed");
  }
}
