import { logInfo, logWarn, logError } from "../utils/logger.js";
import { shouldSkipUrl } from "../utils/security.js";

const MODULE = "tabManager";
const tabCache = new Map();

export function isValidTab(tab) {
  return tab && typeof tab.id === "number" && tab.id !== chrome.tabs.TAB_ID_NONE;
}

export function isScannableTab(tab) {
  return isValidTab(tab) && tab.url && !shouldSkipUrl(tab.url);
}

export async function getValidTab(tabId) {
  if (!tabId || typeof tabId !== "number" || tabId === chrome.tabs.TAB_ID_NONE) return null;
  try {
    const tab = await chrome.tabs.get(tabId);
    return isValidTab(tab) ? tab : null;
  } catch {
    return null;
  }
}

export async function getSafeActiveTab() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs || tabs.length === 0) return null;
    const tab = tabs[0];
    return isValidTab(tab) ? tab : null;
  } catch (e) {
    logError(MODULE, "Failed to get active tab:", e.message);
    return null;
  }
}

export async function safeSendMessage(tabId, message) {
  const tab = await getValidTab(tabId);
  if (!tab) {
    logWarn(MODULE, "Cannot send message - tab invalid:", tabId);
    return false;
  }
  if (tab.url && shouldSkipUrl(tab.url)) {
    return false;
  }
  try {
    chrome.tabs.sendMessage(tabId, message);
    return true;
  } catch (e) {
    logWarn(MODULE, "Message send failed for tab", tabId, e.message);
    return false;
  }
}

export async function isTabStillOnUrl(tabId, url) {
  if (!tabId || tabId === chrome.tabs.TAB_ID_NONE) return false;
  const tab = await getValidTab(tabId);
  return tab !== null && tab.url === url;
}

export function getCachedResult(tabId) {
  return tabCache.get(tabId) || null;
}

export function setCachedResult(tabId, result) {
  tabCache.set(tabId, result);
}

export function clearCachedResult(tabId) {
  tabCache.delete(tabId);
}

export function initTabLifecycleHandlers() {
  chrome.tabs.onRemoved.addListener((tabId) => {
    tabCache.delete(tabId);
  });

  chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    if (details.frameId === 0 && details.tabId && details.tabId !== chrome.tabs.TAB_ID_NONE) {
      tabCache.delete(details.tabId);
      updateBadge("", "#16a34a", details.tabId);
    }
  });

  logInfo(MODULE, "Tab lifecycle handlers initialized");
}

export function updateBadge(text, color, tabId) {
  if (tabId && tabId === chrome.tabs.TAB_ID_NONE) return;
  try {
    const opts = { text };
    if (tabId && typeof tabId === "number") opts.tabId = tabId;
    chrome.action.setBadgeText(opts);
    chrome.action.setBadgeBackgroundColor({ color, ...(tabId && typeof tabId === "number" ? { tabId } : {}) });
  } catch (e) {
    logWarn(MODULE, "Badge update failed:", e.message);
  }
}

export function updateBadgeFromResult(result, tabId) {
  const badges = {
    critical: { text: "!!!", color: "#dc2626" },
    high: { text: "!!", color: "#ea580c" },
    medium: { text: "!", color: "#ca8a04" },
    low: { text: "OK", color: "#2563eb" },
    safe: { text: "\u2713", color: "#16a34a" }
  };
  const badge = badges[result.riskLevel] || badges.safe;
  updateBadge(badge.text, badge.color, tabId);
}

export function getBadgeForRisk(risk) {
  const normalized = risk.toLowerCase();
  if (normalized === "critical") return { text: "!!!", color: "#dc2626" };
  if (normalized === "high") return { text: "!!", color: "#ea580c" };
  if (normalized === "moderate" || normalized === "medium") return { text: "!", color: "#ca8a04" };
  if (normalized === "low") return { text: "OK", color: "#2563eb" };
  return { text: "\u2713", color: "#16a34a" };
}
