import { hasAnalyticsConsent } from "@/components/cookie-consent";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

let gaInitialized = false;

export const initGA = () => {
  if (gaInitialized) return;

  if (!hasAnalyticsConsent()) {
    return;
  }

  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) {
    console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    return;
  }

  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  `;
  document.head.appendChild(script2);

  gaInitialized = true;
};

export const trackPageView = (url: string) => {
  if (!hasAnalyticsConsent()) return;
  if (typeof window === 'undefined' || !window.gtag) return;

  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;

  window.gtag('config', measurementId, {
    page_path: url
  });
};

export const trackEvent = (
  action: string,
  category?: string,
  label?: string,
  value?: number
) => {
  if (!hasAnalyticsConsent()) return;
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

const getSessionId = (): string => {
  const key = 'gcr_session_id';
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
};

export const trackToolUsage = async (
  toolName: string,
  completed: boolean = false,
  metadata?: Record<string, any>
) => {
  if (!hasAnalyticsConsent()) return;

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

    trackEvent('tool_usage', 'tools', toolName);
  } catch (error) {
    console.debug('Tool tracking failed:', error);
  }
};
