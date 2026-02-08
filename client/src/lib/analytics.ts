<<<<<<< HEAD
// Google Analytics integration
// Define the gtag function globally
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize Google Analytics
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    return;
  }

  // Add Google Analytics script to the head
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize gtag
  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  `;
  document.head.appendChild(script2);
};

// Track page views - useful for single-page applications
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;
  
  window.gtag('config', measurementId, {
    page_path: url
  });
};

// Track events
export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Generate or retrieve session ID for anonymous tracking
const getSessionId = (): string => {
  const key = 'gcr_session_id';
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
};

// Track tool usage for internal analytics
export const trackToolUsage = async (
  toolName: string, 
  completed: boolean = false, 
  metadata?: Record<string, any>
) => {
  try {
    const sessionId = getSessionId();
    
    await fetch('/api/track/tool', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toolName,
        sessionId,
        completed,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
      }),
    });

    // Also track as GA event
    trackEvent('tool_usage', 'tools', toolName);
  } catch (error) {
    // Silently fail - tracking shouldn't break the app
    console.debug('Tool tracking failed:', error);
  }
=======
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
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
};
