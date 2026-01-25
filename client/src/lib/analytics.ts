declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const GA_MEASUREMENT_ID = 'G-Y7NETFXHF1';
const GT_CONTAINER_ID = 'GT-TXZ6TRQC';

let lastTrackedPath = '';

export const pageview = (url: string) => {
  if (typeof window === 'undefined') return;
  if (!window.gtag) return;
  
  // Avoid duplicate tracking for same path
  if (url === lastTrackedPath) return;
  lastTrackedPath = url;
  
  // Use config call for SPA navigation - GA4 recommended approach
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
    page_location: window.location.origin + url,
    page_title: document.title,
  });
};

export const event = (action: string, params?: Record<string, unknown>) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    ...params,
    send_to: GA_MEASUREMENT_ID,
  });
};

// Track custom events for user engagement
export const trackSubscription = (type: 'newsletter' | 'daily_tips', audience?: string) => {
  event('sign_up', {
    method: type,
    audience: audience || 'all',
  });
};

export const trackScamCheck = (type: 'url' | 'phone' | 'situation') => {
  event('scam_check', {
    check_type: type,
  });
};

export const trackDownload = (resource: string) => {
  event('file_download', {
    file_name: resource,
  });
};
