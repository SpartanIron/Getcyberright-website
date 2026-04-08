import { useEffect } from "react";

const REFERRAL_KEY = "gcr_referral";
const REFERRAL_TIMESTAMP_KEY = "gcr_referral_ts";
const REFERRAL_EXPIRY_DAYS = 30;

export function useReferralTracking() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get("ref") || urlParams.get("referral");
    
    if (refCode) {
      localStorage.setItem(REFERRAL_KEY, refCode);
      localStorage.setItem(REFERRAL_TIMESTAMP_KEY, Date.now().toString());
      
      fetch("/api/referral/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          referralCode: refCode, 
          action: "visit",
          source: document.referrer || "direct"
        })
      }).catch(() => {});
      
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("ref");
      newUrl.searchParams.delete("referral");
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, []);
}

export function getReferralCode(): string | null {
  if (typeof window === 'undefined') return null;
  const code = localStorage.getItem(REFERRAL_KEY);
  const timestamp = localStorage.getItem(REFERRAL_TIMESTAMP_KEY);
  
  if (!code || !timestamp) return null;
  
  const storedTime = parseInt(timestamp);
  const expiryTime = storedTime + (REFERRAL_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  
  if (Date.now() > expiryTime) {
    localStorage.removeItem(REFERRAL_KEY);
    localStorage.removeItem(REFERRAL_TIMESTAMP_KEY);
    return null;
  }
  
  return code;
}

export function trackReferralConversion(action: string, metadata?: Record<string, unknown>) {
  const refCode = getReferralCode();
  
  if (refCode) {
    fetch("/api/referral/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        referralCode: refCode, 
        action,
        metadata
      })
    }).catch(() => {});
  }
}

export function generateReferralLink(baseUrl: string = "https://www.getcyberright.com"): string {
  const userId = typeof window !== 'undefined' ? (localStorage.getItem("user_id") || Math.random().toString(36).substring(2, 10)) : Math.random().toString(36).substring(2, 10);
  if (typeof window !== 'undefined') localStorage.setItem("user_id", userId);
  return `${baseUrl}?ref=${userId}`;
}
