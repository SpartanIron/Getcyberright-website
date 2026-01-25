const INDEXNOW_API_KEY = process.env.INDEXNOW_API_KEY;
const SITE_URL = 'https://www.getcyberright.com';

interface IndexNowResult {
  success: boolean;
  status?: number;
  message?: string;
  submittedUrls?: string[];
}

export async function submitToIndexNow(urls: string[]): Promise<IndexNowResult> {
  if (!INDEXNOW_API_KEY) {
    return { success: false, message: 'IndexNow API key not configured' };
  }

  if (urls.length === 0) {
    return { success: false, message: 'No URLs provided' };
  }

  const fullUrls = urls.map(url => 
    url.startsWith('http') ? url : `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`
  );

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        host: 'www.getcyberright.com',
        key: INDEXNOW_API_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_API_KEY}.txt`,
        urlList: fullUrls
      })
    });

    if (response.ok || response.status === 200 || response.status === 202) {
      console.log(`IndexNow: Successfully submitted ${fullUrls.length} URL(s)`);
      return { 
        success: true, 
        status: response.status,
        message: 'URLs submitted successfully',
        submittedUrls: fullUrls
      };
    } else {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`IndexNow error: ${response.status} - ${errorText}`);
      return { 
        success: false, 
        status: response.status,
        message: `IndexNow API error: ${response.status}`
      };
    }
  } catch (error) {
    console.error('IndexNow submission failed:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Network error'
    };
  }
}

export async function submitSitemapToIndexNow(): Promise<IndexNowResult> {
  const staticPages = [
    '/',
    '/news',
    '/youth-safety',
    '/senior-safety',
    '/resources',
    '/cyber-assessment',
    '/cyber-hygiene',
    '/safety-tips',
    '/scam-checker',
    '/about',
    '/contact',
    '/terms-of-service',
    '/privacy-policy'
  ];

  return submitToIndexNow(staticPages);
}

export function getApiKey(): string | undefined {
  return INDEXNOW_API_KEY;
}
