import { JSDOM } from 'jsdom';

interface ThumbnailResult {
  imageUrl: string | null;
  title?: string | null;
  description?: string | null;
}

export class ThumbnailService {
  private static instance: ThumbnailService;
  private cache = new Map<string, ThumbnailResult>();

  static getInstance(): ThumbnailService {
    if (!ThumbnailService.instance) {
      ThumbnailService.instance = new ThumbnailService();
    }
    return ThumbnailService.instance;
  }

  private isInternalUrl(urlString: string): boolean {
    try {
      const parsed = new URL(urlString);
      const hostname = parsed.hostname.toLowerCase();
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname === '0.0.0.0') return true;
      if (hostname.endsWith('.local') || hostname.endsWith('.internal')) return true;
      if (/^10\./.test(hostname)) return true;
      if (/^172\.(1[6-9]|2\d|3[01])\./.test(hostname)) return true;
      if (/^192\.168\./.test(hostname)) return true;
      if (/^169\.254\./.test(hostname)) return true;
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return true;
      if (parsed.port && !['80', '443', ''].includes(parsed.port)) return true;
      return false;
    } catch {
      return true;
    }
  }

  async fetchThumbnail(url: string): Promise<ThumbnailResult> {
    if (this.isInternalUrl(url)) {
      return { imageUrl: null, title: null, description: null };
    }

    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; GetCyberRight/1.0; +https://www.getcyberright.com)',
        },
        signal: AbortSignal.timeout(10000),
        redirect: 'manual'
      });

      if (response.status >= 300 && response.status < 400) {
        const redirectUrl = response.headers.get('location');
        if (redirectUrl && this.isInternalUrl(redirectUrl)) {
          return { imageUrl: null, title: null, description: null };
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;

      const result = this.extractThumbnail(document, url);
      
      // Cache the result
      this.cache.set(url, result);
      
      return result;
    } catch (error) {
      console.error(`Failed to fetch thumbnail for ${url}:`, error);
      
      // Return fallback based on domain
      const fallback = this.getDomainFallback(url);
      this.cache.set(url, fallback);
      return fallback;
    }
  }

  private extractThumbnail(document: Document, url: string): ThumbnailResult {
    // Try Open Graph image first
    let imageUrl = this.getMetaContent(document, 'property', 'og:image');
    
    // Try Twitter card image
    if (!imageUrl) {
      imageUrl = this.getMetaContent(document, 'name', 'twitter:image');
    }
    
    // Try standard meta image
    if (!imageUrl) {
      imageUrl = this.getMetaContent(document, 'name', 'image');
    }
    
    // Try to find logo or main image
    if (!imageUrl) {
      const logoSelectors = [
        'img[src*="logo"]',
        '.logo img',
        '#logo img',
        'header img',
        '.header img',
        '.navbar img',
        '.brand img'
      ];
      
      for (const selector of logoSelectors) {
        const img = document.querySelector(selector) as HTMLImageElement;
        if (img?.src) {
          imageUrl = img.src;
          break;
        }
      }
    }

    // Try favicon as last resort
    if (!imageUrl) {
      const favicon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]') as HTMLLinkElement;
      if (favicon?.href) {
        imageUrl = favicon.href;
      }
    }

    // Make relative URLs absolute
    if (imageUrl && !imageUrl.startsWith('http')) {
      try {
        const baseUrl = new URL(url);
        imageUrl = new URL(imageUrl, baseUrl.origin).href;
      } catch (e) {
        imageUrl = null;
      }
    }

    const title = this.getMetaContent(document, 'property', 'og:title') || 
                  document.title || 
                  this.getMetaContent(document, 'name', 'title');

    const description = this.getMetaContent(document, 'property', 'og:description') || 
                       this.getMetaContent(document, 'name', 'description');

    return {
      imageUrl,
      title,
      description
    };
  }

  private getMetaContent(document: Document, attribute: string, value: string): string | null {
    const meta = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement;
    return meta?.content || null;
  }

  private getDomainFallback(url: string): ThumbnailResult {
    try {
      const domain = new URL(url).hostname.toLowerCase();
      
      // Known cybersecurity service logos
      const domainLogos: Record<string, string> = {
        'cyberaces.org': 'https://cyberaces.org/static/images/logo.png',
        'cybrary.it': 'https://cybrary.it/wp-content/themes/cybrary-2021/assets/img/cybrary-logo.svg',
        'isc2.org': 'https://www.isc2.org/-/media/Project/ISC2/Main/Media/images/ISC2-logo.png',
        'hackerone.com': 'https://www.hackerone.com/sites/default/files/2022-02/h1-logo-black.svg',
        'wireshark.org': 'https://www.wireshark.org/assets/icons/wireshark-logo.png',
        'metasploit.com': 'https://www.metasploit.com/themes/custom/metasploit/images/rapid7-logo.svg',
        'sans.org': 'https://www.sans.org/images/logos/sans-logo.svg',
        'nist.gov': 'https://www.nist.gov/sites/default/files/nist-logo.svg',
        'owasp.org': 'https://owasp.org/assets/images/logo.png',
        'mitre.org': 'https://www.mitre.org/sites/default/files/2022-03/mitre-logo.svg',
        'cisa.gov': 'https://www.cisa.gov/sites/default/files/images/CISA_Logo.png',
        'first.org': 'https://www.first.org/global/sigs/curriculum/images/first-logo.png',
        'isaca.org': 'https://www.isaca.org/-/media/info/isaca-logo/isaca-logo-reverse.svg',
        'comptia.org': 'https://www.comptia.org/content/images/comptia-logo.svg',
        'ec-council.org': 'https://www.eccouncil.org/wp-content/uploads/2021/03/EC-Council-Logo.svg',
        'offensive-security.com': 'https://www.offensive-security.com/wp-content/themes/offsec/images/logo.svg',
        'cisco.com': 'https://www.cisco.com/c/dam/en_us/about/ac79/docs/innov/IoE_Logo.jpg',
        'microsoft.com': 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b',
        'google.com': 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
        'amazon.com': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        'cloudflare.com': 'https://www.cloudflare.com/img/logo-web-badges/cf-logo-on-white-bg.svg'
      };

      return {
        imageUrl: domainLogos[domain] || null,
        title: null,
        description: null
      };
    } catch (e) {
      return {
        imageUrl: null,
        title: null,
        description: null
      };
    }
  }

  async batchFetchThumbnails(urls: string[]): Promise<Map<string, ThumbnailResult>> {
    const results = new Map<string, ThumbnailResult>();
    
    // Process URLs in batches to avoid overwhelming servers
    const batchSize = 5;
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const promises = batch.map(async url => {
        const result = await this.fetchThumbnail(url);
        return { url, result };
      });
      
      const batchResults = await Promise.allSettled(promises);
      
      batchResults.forEach((promiseResult, index) => {
        if (promiseResult.status === 'fulfilled') {
          results.set(promiseResult.value.url, promiseResult.value.result);
        } else {
          // Use fallback for failed requests
          const url = batch[index];
          results.set(url, this.getDomainFallback(url));
        }
      });
      
      // Small delay between batches
      if (i + batchSize < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }
}

export const thumbnailService = ThumbnailService.getInstance();