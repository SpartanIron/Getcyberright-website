import { thumbnailService } from "./thumbnail-service";
import crypto from "crypto";
import { db } from "./db";
import { cachedNews } from "@shared/schema";
import { desc, sql } from "drizzle-orm";
import { sanitizeText, sanitizeUrl, sanitizeNewsContent } from "./security/sanitizer";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Cybersecurity" | "AI" | "Tech" | "Conferences" | "Breaking";
  author: string;
  source: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  readTime: number;
}

interface RSSItem {
  title: string;
  description?: string;
  link: string;
  pubDate?: string;
  creator?: string;
  content?: string;
  source?: string;
}

class NewsAggregator {
  private cache: Map<string, NewsItem[]> = new Map();
  private lastFetch: Date | null = null;
  private isFetching: boolean = false;
  private refreshInterval: NodeJS.Timeout | null = null;

  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
  private readonly REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

  // Comprehensive trusted sources for production
  // Removed broken feeds: BleepingComputer (403), SC Media (403), FBI IC3 (404), Black Hat (403)
  private readonly sources = {
    cybersecurity: [
      { url: 'https://feeds.feedburner.com/TheHackersNews', name: 'The Hacker News' },
      { url: 'https://krebsonsecurity.com/feed/', name: 'Krebs on Security' },
      { url: 'https://www.darkreading.com/rss.xml', name: 'Dark Reading' },
      { url: 'https://www.securityweek.com/feed/', name: 'SecurityWeek' },
      { url: 'https://nakedsecurity.sophos.com/feed/', name: 'Naked Security (Sophos)' },
      { url: 'https://threatpost.com/feed/', name: 'Threatpost' },
    ],
    safety: [
      { url: 'https://feeds.feedburner.com/TheHackersNews', name: 'The Hacker News' },
      { url: 'https://krebsonsecurity.com/feed/', name: 'Krebs on Security' },
      { url: 'https://www.cisa.gov/news.xml', name: 'CISA' },
      { url: 'https://nakedsecurity.sophos.com/feed/', name: 'Naked Security (Sophos)' },
      { url: 'https://www.nist.gov/blogs/cybersecurity-insights/rss.xml', name: 'NIST Cybersecurity' },
    ],
    ai: [
      { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', name: 'TechCrunch AI' },
    ],
    tech: [
      { url: 'https://techcrunch.com/feed/', name: 'TechCrunch' },
      { url: 'https://www.theverge.com/rss/index.xml', name: 'The Verge' },
      { url: 'https://arstechnica.com/feed/', name: 'Ars Technica' },
    ],
    conferences: []
  };

  constructor() {
    this.initializeFromDatabase();
  }

  // Load cached news from database on startup for instant display
  private async initializeFromDatabase(): Promise<void> {
    try {
      console.log('[NewsAggregator] Loading cached news from database...');
      const cached = await db.select().from(cachedNews).orderBy(desc(cachedNews.publishedAt)).limit(200);
      
      if (cached.length > 0) {
        // Sanitize all cached items when loading from database
        const newsItems: NewsItem[] = cached.map(item => {
          const sanitized = sanitizeNewsContent({
            title: item.title,
            excerpt: item.excerpt || '',
            content: item.content || '',
            author: item.author || 'Unknown',
            source: item.source
          });
          
          return {
            id: item.id,
            title: sanitized.title,
            excerpt: sanitized.excerpt,
            content: sanitized.content,
            category: item.category as NewsItem['category'],
            author: sanitized.author,
            source: sanitized.source,
            url: sanitizeUrl(item.url),
            imageUrl: item.imageUrl ? sanitizeUrl(item.imageUrl) || null : null,
            publishedAt: item.publishedAt.toISOString(),
            readTime: 3,
          };
        }).filter(item => item.url); // Filter out items with invalid URLs
        
        // Populate cache from database
        this.cache.set('all', newsItems);
        this.cache.set('cybersecurity', newsItems.filter(n => n.category === 'Cybersecurity'));
        this.cache.set('ai', newsItems.filter(n => n.category === 'AI'));
        this.cache.set('tech', newsItems.filter(n => n.category === 'Tech'));
        
        // Safety news with audience tags from database - also sanitize
        const safetyItems = cached
          .filter(item => item.category === 'Cybersecurity' || item.audienceTag)
          .map(item => {
            const sanitized = sanitizeNewsContent({
              title: item.title,
              excerpt: item.excerpt || '',
              content: item.content || '',
              author: item.author || 'Unknown',
              source: item.source
            });
            const sanitizedUrl = sanitizeUrl(item.url);
            if (!sanitizedUrl) return null;
            
            return {
              id: item.id,
              title: sanitized.title,
              excerpt: sanitized.excerpt,
              content: sanitized.content,
              category: item.category as NewsItem['category'],
              author: sanitized.author,
              source: sanitized.source,
              url: sanitizedUrl,
              imageUrl: item.imageUrl ? sanitizeUrl(item.imageUrl) || null : null,
              publishedAt: item.publishedAt.toISOString(),
              readTime: 3,
              audienceTag: item.audienceTag || 'all',
            };
          }).filter((item): item is NonNullable<typeof item> => item !== null);
        
        this.cache.set('safety', safetyItems.slice(0, 20));
        this.lastFetch = new Date();
        console.log(`[NewsAggregator] Loaded ${cached.length} articles from database cache`);
      }
    } catch (error) {
      console.log('[NewsAggregator] No cached news in database, will fetch fresh');
    }
    
    // Start auto refresh after loading from database
    this.startAutoRefresh();
  }

  // Save news to database for persistence
  private async saveToDatabase(news: NewsItem[]): Promise<void> {
    try {
      // Delete old cached news (older than 7 days)
      await db.delete(cachedNews).where(
        sql`${cachedNews.cachedAt} < NOW() - INTERVAL '7 days'`
      );
      
      // Insert or update news items
      for (const item of news.slice(0, 100)) { // Limit to 100 items
        try {
          await db.insert(cachedNews).values({
            id: item.id,
            title: item.title,
            excerpt: item.excerpt,
            content: item.content,
            category: item.category,
            author: item.author,
            source: item.source,
            url: item.url,
            imageUrl: item.imageUrl,
            publishedAt: new Date(item.publishedAt),
            audienceTag: (item as any).audienceTag || null,
          }).onConflictDoUpdate({
            target: cachedNews.id,
            set: {
              title: item.title,
              excerpt: item.excerpt,
              cachedAt: new Date(),
            }
          });
        } catch (e) {
          // Ignore individual insert errors
        }
      }
      console.log(`[NewsAggregator] Saved ${Math.min(news.length, 100)} articles to database`);
    } catch (error) {
      console.log('[NewsAggregator] Failed to save to database:', error);
    }
  }

  private startAutoRefresh(): void {
    this.refreshInterval = setInterval(() => {
      this.refreshAllNews();
    }, this.REFRESH_INTERVAL);
    
    // Initial fetch after a short delay to let database load first
    setTimeout(() => this.refreshAllNews(), 2000);
  }

  async refreshAllNews(): Promise<void> {
    if (this.isFetching) return;
    
    this.isFetching = true;
    console.log('[NewsAggregator] Starting news refresh (sequential for production)...');
    
    try {
      // Fetch categories sequentially to avoid overwhelming network limits in production
      const cyber = await this.fetchCategory('cybersecurity', 'Cybersecurity').catch(() => []);
      await this.delay(1000);
      
      const safety = await this.fetchCategory('safety', 'Cybersecurity').catch(() => []);
      await this.delay(1000);
      
      const tech = await this.fetchCategory('tech', 'Tech').catch(() => []);
      await this.delay(1000);
      
      const ai = await this.fetchCategory('ai', 'AI').catch(() => []);
      await this.delay(1000);
      
      const conferences = await this.fetchCategory('conferences', 'Conferences').catch(() => []);
      await this.delay(1000);
      
      const hn = await this.fetchHackerNews().catch(() => []);

      const allNews: NewsItem[] = [];
      
      allNews.push(...cyber);
      allNews.push(...safety);
      allNews.push(...tech);
      allNews.push(...ai);
      allNews.push(...conferences);
      allNews.push(...hn);

      // Deduplicate by URL
      const uniqueNews = this.deduplicateNews(allNews);
      
      // Sort by date
      uniqueNews.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      // Fetch thumbnails for top articles (limit to avoid too many requests)
      const topArticles = uniqueNews.slice(0, 50);
      const urls = topArticles.map(n => n.url).filter(Boolean);
      
      console.log(`[NewsAggregator] Fetching thumbnails for ${urls.length} articles...`);
      const thumbnails = await thumbnailService.batchFetchThumbnails(urls);
      
      // Update articles with thumbnails
      for (const article of uniqueNews) {
        const thumbnail = thumbnails.get(article.url);
        if (thumbnail?.imageUrl) {
          article.imageUrl = thumbnail.imageUrl;
        }
      }

      // Cache by category
      this.cache.set('all', uniqueNews);
      this.cache.set('cybersecurity', uniqueNews.filter(n => n.category === 'Cybersecurity'));
      this.cache.set('ai', uniqueNews.filter(n => n.category === 'AI'));
      this.cache.set('tech', uniqueNews.filter(n => n.category === 'Tech'));
      this.cache.set('conferences', uniqueNews.filter(n => n.category === 'Conferences'));
      this.cache.set('breaking', uniqueNews.filter(n => n.category === 'Breaking'));
      
      // Cache safety-focused news with audience tagging - strict filtering
      const safetyKeywords = [
        'scam', 'fraud', 'phishing', 'identity theft', 'data breach', 'cyber attack',
        'malware', 'ransomware', 'security alert', 'security warning', 'vulnerability',
        'hacked', 'hacking', 'stolen data', 'leaked', 'exposed data',
        'online safety', 'cyber safety', 'internet safety', 'digital safety',
        'password stolen', 'account compromised', 'credential', 'two-factor',
        'child safety', 'parental control', 'online predator', 'cyberbullying',
        'elder fraud', 'senior scam', 'romance scam', 'tech support scam',
        'sim swap', 'mobile money', 'm-pesa', 'mtn fraud', 'whatsapp scam',
        'privacy breach', 'spyware', 'stalkerware', 'identity fraud'
      ];
      
      // Audience-specific keywords for tagging
      const youthKeywords = [
        'child', 'children', 'kids', 'teen', 'teenager', 'youth', 'minor', 'student',
        'school', 'gaming', 'tiktok', 'snapchat', 'instagram', 'roblox', 'fortnite',
        'online predator', 'cyberbullying', 'sexting', 'grooming', 'parental control',
        'screen time', 'age verification', 'young people', 'underage'
      ];
      
      const seniorKeywords = [
        'senior', 'elderly', 'older adult', 'retiree', 'pension', 'grandparent',
        'm-pesa', 'mtn', 'airtel', 'mobile money', 'sim swap', 'whatsapp scam',
        'romance scam', 'tech support scam', 'medicare', 'social security',
        'inheritance scam', 'lottery scam', 'grandchild scam', 'impersonation'
      ];
      
      let safetyNews = uniqueNews
        .filter(n => {
          const content = (n.title + ' ' + n.excerpt).toLowerCase();
          return safetyKeywords.some(kw => content.includes(kw));
        })
        .map(n => {
          const content = (n.title + ' ' + n.excerpt).toLowerCase();
          let audienceTag = 'all';
          
          // Check for youth-specific content
          if (youthKeywords.some(kw => content.includes(kw))) {
            audienceTag = 'youth';
          }
          // Check for senior-specific content
          else if (seniorKeywords.some(kw => content.includes(kw))) {
            audienceTag = 'senior';
          }
          
          return { ...n, audienceTag };
        });
      
      // If not enough safety-specific news, include cybersecurity articles as fallback
      if (safetyNews.length < 8) {
        const cyberNews = uniqueNews
          .filter(n => n.category === 'Cybersecurity' && !safetyNews.find(s => s.id === n.id))
          .slice(0, 15 - safetyNews.length)
          .map(n => ({ ...n, audienceTag: 'all' }));
        safetyNews = [...safetyNews, ...cyberNews];
      }
      
      this.cache.set('safety', safetyNews);
      
      this.lastFetch = new Date();
      console.log(`[NewsAggregator] Cached ${uniqueNews.length} articles`);
      
      // Persist to database for production cold starts
      await this.saveToDatabase(uniqueNews);
      
    } catch (error) {
      console.error('[NewsAggregator] Error refreshing news:', error);
    } finally {
      this.isFetching = false;
    }
  }

  // Delay helper for rate limiting
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Fetch with retry and exponential backoff
  private async fetchWithRetry(url: string, retries: number = 3): Promise<Response | null> {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        const response = await fetch(url, {
          headers: { 
            'User-Agent': 'Mozilla/5.0 (compatible; GetCyberRight/1.0; +https://getcyberright.com)',
            'Accept': 'application/rss+xml, application/xml, text/xml, */*'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          return response;
        }
        
        // Rate limited - wait and retry
        if (response.status === 429 || response.status === 503) {
          const waitTime = Math.pow(2, attempt) * 1000;
          console.log(`[NewsAggregator] Rate limited on ${url}, waiting ${waitTime}ms...`);
          await this.delay(waitTime);
          continue;
        }
        
        // Other errors - don't retry
        console.log(`[NewsAggregator] HTTP ${response.status} for ${url}`);
        return null;
        
      } catch (error: any) {
        if (attempt < retries - 1) {
          const waitTime = Math.pow(2, attempt) * 500;
          await this.delay(waitTime);
        }
      }
    }
    return null;
  }

  private async fetchCategory(
    categoryKey: keyof typeof this.sources, 
    categoryName: NewsItem['category']
  ): Promise<NewsItem[]> {
    const sources = this.sources[categoryKey];
    const items: NewsItem[] = [];
    
    // Process sources sequentially with small delays to avoid rate limiting
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      try {
        const rssItems = await this.fetchRSSFeed(source.url, source.name);
        for (const rssItem of rssItems) {
          const newsItem = this.convertToNewsItem(rssItem, categoryName);
          if (newsItem) items.push(newsItem);
        }
        
        // Longer delay between requests to avoid rate limiting in production
        if (i < sources.length - 1) {
          await this.delay(1000);
        }
      } catch (error) {
        console.log(`[NewsAggregator] Failed to fetch ${source.name}`);
      }
    }
    
    return items;
  }

  private async fetchRSSFeed(url: string, sourceName: string): Promise<RSSItem[]> {
    try {
      const response = await this.fetchWithRetry(url);
      
      if (!response) return [];
      
      const xmlText = await response.text();
      const items = this.parseRSS(xmlText);
      
      console.log(`[NewsAggregator] Fetched ${items.length} items from ${sourceName}`);
      return items.map(item => ({ ...item, source: sourceName })).slice(0, 15);
      
    } catch (error) {
      console.log(`[NewsAggregator] Error fetching ${sourceName}:`, error);
      return [];
    }
  }

  private parseRSS(xmlText: string): RSSItem[] {
    const items: RSSItem[] = [];
    const cleanXml = xmlText.replace(/\n\s*\n/g, '\n').trim();
    
    const itemMatches = cleanXml.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || 
                        cleanXml.match(/<entry[^>]*>[\s\S]*?<\/entry>/gi) || [];
    
    for (const itemXml of itemMatches) {
      try {
        let title = itemXml.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
        if (title) {
          title = this.cleanText(title);
        }
        
        let description = itemXml.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ||
                         itemXml.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i)?.[1] ||
                         itemXml.match(/<content[^>]*>([\s\S]*?)<\/content>/i)?.[1];
        
        if (description) {
          description = this.cleanText(description).substring(0, 400);
        }
        
        let link = itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1]?.trim() ||
                   itemXml.match(/<link[^>]*href=["'](.*?)["'][^>]*>/i)?.[1] ||
                   itemXml.match(/<guid[^>]*>(https?:\/\/[^<]+)<\/guid>/i)?.[1];
        
        const pubDate = itemXml.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] ||
                        itemXml.match(/<published[^>]*>([\s\S]*?)<\/published>/i)?.[1] ||
                        itemXml.match(/<updated[^>]*>([\s\S]*?)<\/updated>/i)?.[1];
        
        let creator = itemXml.match(/<dc:creator[^>]*>([\s\S]*?)<\/dc:creator>/i)?.[1] ||
                      itemXml.match(/<author[^>]*><name[^>]*>([\s\S]*?)<\/name>/i)?.[1] ||
                      itemXml.match(/<author[^>]*>([\s\S]*?)<\/author>/i)?.[1];
        
        if (creator) {
          creator = this.cleanText(creator);
        }
        
        if (title && link && link.startsWith('http')) {
          items.push({
            title,
            description: description || title,
            link,
            pubDate: pubDate?.trim(),
            creator: creator || undefined
          });
        }
      } catch (error) {
        continue;
      }
    }
    
    return items;
  }

  private cleanText(text: string): string {
    return text
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/<[^>]*>/g, '')
      .trim();
  }

  private async fetchHackerNews(): Promise<NewsItem[]> {
    const items: NewsItem[] = [];
    
    // Helper to create sanitized news item from HN hit using DOMPurify
    const createHNItem = (hit: any, category: NewsItem['category']): NewsItem | null => {
      const url = sanitizeUrl(hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`);
      if (!url) return null;
      
      // Use DOMPurify-based sanitizer for full HTML protection
      const sanitized = sanitizeNewsContent({
        title: hit.title || '',
        excerpt: hit.story_text || hit.title || '',
        content: hit.story_text || hit.title || '',
        author: hit.author || 'Hacker News',
        source: 'Hacker News'
      });
      
      if (!sanitized.title) return null;
      
      return {
        id: `hn-${category.toLowerCase()}-${hit.objectID}`,
        title: sanitized.title,
        excerpt: sanitized.excerpt,
        content: sanitized.content,
        category,
        author: sanitized.author,
        source: sanitized.source,
        url,
        imageUrl: null,
        publishedAt: hit.created_at || new Date().toISOString(),
        readTime: 3
      };
    };
    
    try {
      // Cybersecurity stories
      const cyberResponse = await fetch(
        'https://hn.algolia.com/api/v1/search?query=cybersecurity%20OR%20security%20OR%20breach%20OR%20hacking&tags=story&hitsPerPage=20'
      );
      const cyberData = await cyberResponse.json();
      
      for (const hit of cyberData.hits || []) {
        if (hit.url && hit.title) {
          const item = createHNItem(hit, 'Cybersecurity');
          if (item) items.push(item);
        }
      }

      // AI stories
      const aiResponse = await fetch(
        'https://hn.algolia.com/api/v1/search?query=artificial%20intelligence%20OR%20machine%20learning%20OR%20AI%20OR%20GPT%20OR%20LLM&tags=story&hitsPerPage=20'
      );
      const aiData = await aiResponse.json();
      
      for (const hit of aiData.hits || []) {
        if (hit.url && hit.title) {
          const item = createHNItem(hit, 'AI');
          if (item) items.push(item);
        }
      }

      // Tech stories
      const techResponse = await fetch(
        'https://hn.algolia.com/api/v1/search?query=startup%20OR%20technology%20OR%20programming&tags=story&hitsPerPage=15'
      );
      const techData = await techResponse.json();
      
      for (const hit of techData.hits || []) {
        if (hit.url && hit.title) {
          const item = createHNItem(hit, 'Tech');
          if (item) items.push(item);
        }
      }
      
    } catch (error) {
      console.error('[NewsAggregator] Error fetching Hacker News:', error);
    }
    
    return items;
  }

  private convertToNewsItem(rssItem: RSSItem, category: NewsItem['category']): NewsItem | null {
    if (!rssItem.title || !rssItem.link) return null;
    
    // Sanitize URL first
    const sanitizedUrl = sanitizeUrl(rssItem.link);
    if (!sanitizedUrl) return null;
    
    // Use DOMPurify-based sanitizer for full HTML protection
    const sanitized = sanitizeNewsContent({
      title: rssItem.title,
      excerpt: rssItem.description || rssItem.title,
      content: rssItem.content || rssItem.description || rssItem.title,
      author: rssItem.creator || rssItem.source || 'Unknown',
      source: rssItem.source || 'Unknown'
    });
    
    if (!sanitized.title) return null;
    
    // Filter inappropriate content
    const content = (sanitized.title + ' ' + sanitized.excerpt).toLowerCase();
    const blockedTerms = ['nsfw', 'explicit', 'porn'];
    if (blockedTerms.some(term => content.includes(term))) return null;
    
    const id = crypto.createHash('md5').update(sanitizedUrl).digest('hex').substring(0, 16);
    
    return {
      id,
      title: sanitized.title,
      excerpt: sanitized.excerpt,
      content: sanitized.content,
      category,
      author: sanitized.author,
      source: sanitized.source,
      url: sanitizedUrl,
      imageUrl: null,
      publishedAt: rssItem.pubDate ? new Date(rssItem.pubDate).toISOString() : new Date().toISOString(),
      readTime: Math.max(2, Math.ceil((sanitized.excerpt.length || 100) / 200))
    };
  }

  private deduplicateNews(items: NewsItem[]): NewsItem[] {
    const seen = new Set<string>();
    return items.filter(item => {
      const key = item.url.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Check if cache is stale
  private isCacheStale(): boolean {
    if (!this.lastFetch) return true;
    const now = new Date().getTime();
    const lastFetchTime = this.lastFetch.getTime();
    return (now - lastFetchTime) > this.CACHE_DURATION;
  }

  // Ensure cache is fresh before returning data
  private async ensureFreshCache(): Promise<void> {
    if (!this.cache.has('all') || this.isCacheStale()) {
      await this.refreshAllNews();
    }
  }

  // Check if cache is available (non-blocking)
  isCacheAvailable(): boolean {
    return this.cache.has('all') && (this.cache.get('all')?.length || 0) > 0;
  }

  // Check if currently fetching
  isCurrentlyFetching(): boolean {
    return this.isFetching;
  }

  // Public API methods
  async getLatestNews(limit: number = 50): Promise<NewsItem[]> {
    // If cache is empty and not fetching, trigger a refresh (non-blocking for first request)
    if (!this.cache.has('all') && !this.isFetching) {
      this.refreshAllNews(); // Don't await - start in background
    }
    
    // If cache has data, check freshness
    if (this.cache.has('all') && this.isCacheStale() && !this.isFetching) {
      this.refreshAllNews(); // Background refresh
    }
    
    return (this.cache.get('all') || []).slice(0, limit);
  }

  async getNewsByCategory(category: string, limit: number = 30): Promise<NewsItem[]> {
    // Trigger background refresh if needed
    if (!this.cache.has('all') && !this.isFetching) {
      this.refreshAllNews();
    }
    
    const key = category.toLowerCase();
    return (this.cache.get(key) || []).slice(0, limit);
  }

  async searchNews(query: string, limit: number = 20): Promise<NewsItem[]> {
    await this.ensureFreshCache();
    
    const allNews = this.cache.get('all') || [];
    const queryLower = query.toLowerCase();
    
    return allNews
      .filter(item => 
        item.title.toLowerCase().includes(queryLower) ||
        item.excerpt.toLowerCase().includes(queryLower) ||
        item.source.toLowerCase().includes(queryLower)
      )
      .slice(0, limit);
  }

  getLastFetchTime(): Date | null {
    return this.lastFetch;
  }

  getCacheStats(): { categories: string[]; totalArticles: number; lastFetch: string | null } {
    return {
      categories: Array.from(this.cache.keys()),
      totalArticles: this.cache.get('all')?.length || 0,
      lastFetch: this.lastFetch?.toISOString() || null
    };
  }
}

export const newsAggregator = new NewsAggregator();
