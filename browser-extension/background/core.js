import { logInfo, logWarn, logError } from "../utils/logger.js";
import { shouldSkipUrl, isTrustedDomain, hashDomain, calculateRiskLevel } from "../utils/security.js";
import {
  isValidTab, isScannableTab, getValidTab, safeSendMessage,
  isTabStillOnUrl, getCachedResult, setCachedResult, clearCachedResult,
  initTabLifecycleHandlers, updateBadge, updateBadgeFromResult, getBadgeForRisk
} from "./tabManager.js";
import { setupMessageHandlers } from "./messaging.js";

const API_BASE = "https://www.getcyberright.com";
const SUBSCRIPTION_CACHE_TTL = 10 * 60 * 1000;
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY = 1000;
let cachedSubscription = null;
let subscriptionCacheTime = 0;
const communityTrustCache = new Map();
const TRUST_CACHE_TTL = 5 * 60 * 1000;

async function fetchWithRetry(url, options = {}, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(15000)
      });
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get("Retry-After") || "5", 10);
        if (attempt < retries) {
          logWarn("core", `Rate limited, retrying after ${retryAfter}s (attempt ${attempt + 1}/${retries})`);
          await new Promise(r => setTimeout(r, retryAfter * 1000));
          continue;
        }
        throw new Error("Rate limit exceeded");
      }
      if (response.status >= 500 && attempt < retries) {
        const delay = RETRY_BASE_DELAY * Math.pow(2, attempt);
        logWarn("core", `Server error ${response.status}, retrying in ${delay}ms (attempt ${attempt + 1}/${retries})`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      return response;
    } catch (e) {
      if (e.name === "AbortError" || e.name === "TimeoutError") {
        if (attempt < retries) {
          const delay = RETRY_BASE_DELAY * Math.pow(2, attempt);
          logWarn("core", `Request timeout, retrying in ${delay}ms (attempt ${attempt + 1}/${retries})`);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        throw new Error("Request timed out after retries");
      }
      if (attempt < retries && (e.message.includes("Failed to fetch") || e.message.includes("NetworkError"))) {
        const delay = RETRY_BASE_DELAY * Math.pow(2, attempt);
        logWarn("core", `Network error, retrying in ${delay}ms (attempt ${attempt + 1}/${retries})`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      throw e;
    }
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "gcr-scan-link",
    title: "Scan with GCR Scam Guard",
    contexts: ["link"]
  });

  chrome.contextMenus.create({
    id: "gcr-scan-page",
    title: "Scan this page with GCR Scam Guard",
    contexts: ["page"]
  });

  chrome.contextMenus.create({
    id: "gcr-scan-selection",
    title: "Scan selected text with GCR Scam Guard",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "gcr-report-site",
    title: "Report this site to GCR Scam Guard",
    contexts: ["page"]
  });

  chrome.alarms.create("check-scam-of-week", { periodInMinutes: 360 });
  chrome.alarms.create("refresh-threat-feed", { periodInMinutes: 60 });
  chrome.alarms.create("weekly-safety-digest", { periodInMinutes: 10080 });

  fetchScamOfWeek();
  logInfo("core", "Extension installed and initialized");
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "check-scam-of-week") fetchScamOfWeek();
  if (alarm.name === "refresh-threat-feed") fetchThreatFeed();
  if (alarm.name === "weekly-safety-digest") generateWeeklyDigest();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!isValidTab(tab)) return;
  if (info.menuItemId === "gcr-scan-link") {
    scanContent(info.linkUrl, tab);
  } else if (info.menuItemId === "gcr-scan-page") {
    if (!isScannableTab(tab)) return;
    extractAndScanPage(tab);
  } else if (info.menuItemId === "gcr-scan-selection") {
    scanContent(info.selectionText, tab);
  } else if (info.menuItemId === "gcr-report-site") {
    if (!isScannableTab(tab)) return;
    handleContextMenuReport(tab);
  }
});

initTabLifecycleHandlers();

setupMessageHandlers({
  SCAN_URL: (message, _sender, sendResponse) => {
    performScan(message.content).then(sendResponse);
    return true;
  },
  CHECK_URL_REPUTATION: (message, _sender, sendResponse) => {
    checkUrlReputation(message.url).then(sendResponse);
    return true;
  },
  REPORT_SCAM: (message, _sender, sendResponse) => {
    reportScam(message.data).then(sendResponse);
    return true;
  },
  REPORT_SCAM_STRUCTURED: (message, _sender, sendResponse) => {
    reportScamStructured(message.data).then(sendResponse);
    return true;
  },
  GET_SCAM_OF_WEEK: (_message, _sender, sendResponse) => {
    chrome.storage.local.get(["scamOfWeek"], (result) => {
      sendResponse(result.scamOfWeek || null);
    });
    return true;
  },
  GET_SCAN_STATS: (_message, _sender, sendResponse) => {
    chrome.storage.local.get(["scanStats"], (result) => {
      sendResponse(result.scanStats || { totalScans: 0, threatsBlocked: 0, linksChecked: 0 });
    });
    return true;
  },
  GET_WEEKLY_STATS: (_message, _sender, sendResponse) => {
    chrome.storage.local.get(["weeklyStats"], (result) => {
      sendResponse(result.weeklyStats || getEmptyWeeklyStats());
    });
    return true;
  },
  GET_SCAN_HISTORY: (_message, _sender, sendResponse) => {
    chrome.storage.local.get(["scanHistory"], (result) => {
      sendResponse(result.scanHistory || []);
    });
    return true;
  },
  SCAN_PAGE_LINKS: (message, sender, sendResponse) => {
    handlePageLinksScan(message.links, sender.tab).then(sendResponse);
    return true;
  },
  GET_SETTINGS: (_message, _sender, sendResponse) => {
    chrome.storage.local.get(["settings"], (result) => {
      sendResponse(result.settings || getDefaultSettings());
    });
    return true;
  },
  SAVE_SETTINGS: (message, _sender, sendResponse) => {
    chrome.storage.local.set({ settings: message.settings }, () => {
      sendResponse({ success: true });
    });
    return true;
  },
  PAGE_LOADED: (message, sender, sendResponse) => {
    handleAutoScan(message, sender).then(sendResponse);
    return true;
  },
  GET_TAB_SCAN_RESULT: (message, sender, sendResponse) => {
    const tabId = message.tabId || sender.tab?.id;
    if (tabId) {
      const cached = getCachedResult(tabId);
      sendResponse(cached);
    } else {
      sendResponse(null);
    }
    return true;
  },
  GET_PAGE_RISK: (message, sender, sendResponse) => {
    const tabId = message.tabId || sender.tab?.id;
    if (tabId) {
      const cached = getCachedResult(tabId);
      if (cached) {
        sendResponse({ riskLevel: cached.riskLevel, riskScore: cached.riskScore });
      } else {
        sendResponse({ riskLevel: "unknown", riskScore: 0 });
      }
    } else {
      sendResponse({ riskLevel: "unknown", riskScore: 0 });
    }
    return true;
  },
  GET_COMMUNITY_TRUST: (message, _sender, sendResponse) => {
    getCommunityTrust(message.domain).then(sendResponse);
    return true;
  },
  FLAG_DOMAIN: (message, _sender, sendResponse) => {
    flagDomain(message.domain).then(sendResponse);
    return true;
  },
  SCAN_WEBMAIL: (message, _sender, sendResponse) => {
    checkFeatureAccess("webmail_scan").then(allowed => {
      if (!allowed) {
        sendResponse({ success: false, error: "Upgrade to Pro to use webmail scanning" });
      } else {
        performScan(message.content).then(sendResponse);
      }
    });
    return true;
  },
  SIGN_IN: (message, _sender, sendResponse) => {
    handleSignIn(message.token).then(sendResponse);
    return true;
  },
  SIGN_OUT: (_message, _sender, sendResponse) => {
    handleSignOut().then(sendResponse);
    return true;
  },
  GET_AUTH_STATUS: (_message, _sender, sendResponse) => {
    getAuthStatus().then(sendResponse);
    return true;
  },
  CHECK_FEATURE: (message, _sender, sendResponse) => {
    checkFeatureAccess(message.feature).then(sendResponse);
    return true;
  }
});

async function handleAutoScan(message, sender) {
  const senderTab = sender.tab;
  const tabId = senderTab?.id;
  const url = message.url;

  if (!tabId || tabId === chrome.tabs.TAB_ID_NONE || !url || shouldSkipUrl(url)) {
    return { skipped: true };
  }

  const settings = await getSettings();
  if (!settings.autoScan) {
    return { skipped: true, reason: "disabled" };
  }

  const hasAutoScan = await checkFeatureAccess("auto_scan");
  if (!hasAutoScan) {
    return { skipped: true, reason: "upgrade_required" };
  }

  const cached = getCachedResult(tabId);
  if (cached && cached.url === url && Date.now() - cached.timestamp < 300000) {
    updateBadgeFromResult(cached, tabId);
    await safeSendMessage(tabId, { type: "AUTO_SCAN_RESULT", result: cached });
    return cached;
  }

  updateBadge("...", "#666", tabId);

  const result = {
    url,
    timestamp: Date.now(),
    riskLevel: "safe",
    riskScore: 0,
    reputation: null,
    aiScan: null,
    lookalikeMatch: null,
    sources: []
  };

  if (message.lookalikeMatch) {
    result.lookalikeMatch = message.lookalikeMatch;
    result.riskLevel = "high";
    result.riskScore = Math.max(result.riskScore, 80);
    result.sources.push("lookalike-detection");
  }

  const trusted = isTrustedDomain(url);
  if (trusted) {
    result.sources.push("trusted-domain");
  }

  try {
    const repResult = await checkUrlReputation(url);
    if (!await isTabStillOnUrl(tabId, url)) return { skipped: true, reason: "navigated" };

    result.reputation = repResult;
    result.sources.push("reputation-api");

    if (repResult.success) {
      let repScore = 0;
      if (repResult.phishTank?.isPhishing) repScore += 40;
      if (repResult.urlhaus?.isMalware) repScore += 40;
      if (repResult.googleSafeBrowsing?.isThreat) repScore += 40;
      if (repResult.domainAge?.isNew) repScore += 15;
      if (repResult.domainAge?.ageInDays !== null && repResult.domainAge?.ageInDays !== undefined && repResult.domainAge.ageInDays < 30) repScore += 10;
      result.riskScore = Math.max(result.riskScore, Math.min(repScore, 100));
    }
  } catch (e) { logWarn("core", "Reputation check failed:", e.message); }

  if (result.riskScore > 0 || result.lookalikeMatch) {
    let interimLevel = calculateRiskLevel(result.riskScore);
    result.riskLevel = interimLevel;
    updateBadgeFromResult(result, tabId);
  }

  const hasReputationSignal = result.riskScore > 0 || result.lookalikeMatch;
  if (hasReputationSignal) {
    try {
      const pageContent = message.pageInfo ? buildPageContentString(url, message.pageInfo) : url;
      const aiResult = await performScan(pageContent);
      if (!await isTabStillOnUrl(tabId, url)) return { skipped: true, reason: "navigated" };

      if (aiResult.success && aiResult.result) {
        result.aiScan = aiResult.result;
        result.sources.push("ai-scan");
        const aiRisk = (aiResult.result.scamRiskLevel || "").toLowerCase();
        let aiScore = 0;
        if (aiRisk === "critical") aiScore = 90;
        else if (aiRisk === "high") aiScore = 70;
        else if (aiRisk === "moderate" || aiRisk === "medium") aiScore = 25;
        else if (aiRisk === "low") aiScore = 5;

        const repWeight = 0.4;
        const aiWeight = 0.6;
        const blended = Math.round(result.riskScore * repWeight + aiScore * aiWeight);
        result.riskScore = Math.max(result.riskScore, blended);
      }
    } catch (e) { logWarn("core", "AI scan failed:", e.message); }
  }

  if (!await isTabStillOnUrl(tabId, url)) return { skipped: true, reason: "navigated" };

  result.riskLevel = calculateRiskLevel(result.riskScore);
  setCachedResult(tabId, result);
  updateBadgeFromResult(result, tabId);
  incrementStats(result.riskLevel, undefined, result.url);
  addToScanHistory(result);
  recordVisit(url);

  if (result.riskLevel === "safe" || result.riskLevel === "low") {
    recordSafeVisit(url);
  }

  if (settings.notifications && (result.riskLevel === "critical" || result.riskLevel === "high")) {
    const summary = result.aiScan?.summary || result.lookalikeMatch?.message || "This page has been flagged as potentially dangerous.";
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon-128.png",
      title: `${capitalize(result.riskLevel)} Risk Detected`,
      message: summary,
      priority: 2
    });
  }

  await safeSendMessage(tabId, { type: "AUTO_SCAN_RESULT", result });
  return result;
}

function buildPageContentString(url, pageInfo) {
  const parts = [`URL: ${url}`];
  if (pageInfo.title) parts.push(`Page Title: ${pageInfo.title}`);
  if (pageInfo.meta) parts.push(`Description: ${pageInfo.meta}`);
  if (pageInfo.headings) parts.push(`Headings: ${pageInfo.headings}`);
  if (pageInfo.forms !== undefined) parts.push(`Forms on page: ${pageInfo.forms}`);
  if (pageInfo.passwordFields !== undefined) parts.push(`Password fields: ${pageInfo.passwordFields}`);
  if (pageInfo.externalLinks) parts.push(`External links (sample): ${pageInfo.externalLinks}`);
  if (pageInfo.bodyText) parts.push(`Page content excerpt: ${pageInfo.bodyText.substring(0, 800)}`);
  return parts.join("\n");
}

async function extractAndScanPage(tab) {
  if (!isScannableTab(tab)) return;
  const freshTab = await getValidTab(tab.id);
  if (!freshTab || !freshTab.url || shouldSkipUrl(freshTab.url)) return;
  updateBadge("...", "#666", freshTab.id);

  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: freshTab.id },
      func: () => {
        const title = document.title || "";
        const meta = document.querySelector('meta[name="description"]')?.content || "";
        const headings = Array.from(document.querySelectorAll("h1, h2")).slice(0, 5).map(h => h.textContent.trim()).join(" | ");
        const links = Array.from(document.querySelectorAll("a[href]")).slice(0, 20).map(a => a.href);
        const forms = document.querySelectorAll("form").length;
        const passwordFields = document.querySelectorAll('input[type="password"]').length;
        const bodyText = document.body?.innerText?.substring(0, 1500) || "";
        return { title, meta, headings, links, forms, passwordFields, bodyText };
      }
    });

    if (results && results[0]?.result) {
      const page = results[0].result;
      let externalLinks = [];
      try {
        const pageHost = new URL(freshTab.url).hostname;
        externalLinks = page.links.filter(l => { try { return new URL(l).hostname !== pageHost; } catch { return false; } }).slice(0, 10);
      } catch {}

      const content = [
        `URL: ${freshTab.url}`,
        `Page Title: ${page.title}`,
        `Description: ${page.meta}`,
        `Headings: ${page.headings}`,
        `Forms on page: ${page.forms}`,
        `Password fields: ${page.passwordFields}`,
        `External links (sample): ${externalLinks.join(", ")}`,
        `Page content excerpt: ${page.bodyText.substring(0, 800)}`
      ].join("\n");
      scanContent(content, freshTab);
    } else {
      scanContent(freshTab.url, freshTab);
    }
  } catch {
    scanContent(freshTab.url, freshTab);
  }
}

async function scanContent(content, tab) {
  if (!content) return;
  const tabId = isValidTab(tab) ? tab.id : null;
  updateBadge("...", "#666", tabId);

  try {
    const result = await performScan(content);
    if (result.success) {
      const risk = result.result.scamRiskLevel || "Unknown";
      const badgeInfo = getBadgeForRisk(risk);
      updateBadge(badgeInfo.text, badgeInfo.color, tabId);
      incrementStats(risk);

      const settings = await getSettings();
      if (settings.notifications && (risk === "High" || risk === "Critical")) {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon-128.png",
          title: `${risk} Risk Detected`,
          message: result.result.summary || `This content has been flagged as ${risk} risk.`,
          priority: 2
        });
      }

      if (tabId) {
        await safeSendMessage(tabId, {
          type: "SCAN_RESULT",
          result: result.result,
          url: content
        });
      }
    }
  } catch (error) {
    logError("core", "Scan content failed:", error.message);
    updateBadge("!", "#999", tabId);
  }
}

async function performScan(content) {
  try {
    const response = await fetchWithRetry(`${API_BASE}/api/security/ai-scam-analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    logError("core", "Perform scan failed:", error.message);
    return { success: false, error: error.message };
  }
}

async function checkUrlReputation(url) {
  try {
    const response = await fetchWithRetry(`${API_BASE}/api/security/check-url-reputation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    logError("core", "URL reputation check failed:", error.message);
    return { success: false, error: error.message };
  }
}

async function reportScam(data) {
  try {
    const response = await fetchWithRetry(`${API_BASE}/api/community-reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return { success: true };
  } catch (error) {
    logError("core", "Report scam failed:", error.message);
    return { success: false, error: error.message };
  }
}

async function reportScamStructured(data) {
  try {
    const reportData = {
      content: data.description || `Reported: ${data.url}`,
      reportType: data.scamType || "suspicious",
      url: data.url
    };
    const response = await fetchWithRetry(`${API_BASE}/api/community-reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reportData)
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);

    if (data.url) {
      try {
        await flagDomain(new URL(data.url).hostname);
      } catch (e) { logWarn("core", "Failed to flag domain after report:", e.message); }
    }

    return { success: true };
  } catch (error) {
    logError("core", "Structured report failed:", error.message);
    return { success: false, error: error.message };
  }
}

async function handleContextMenuReport(tab) {
  if (!isScannableTab(tab)) return;
  const freshTab = await getValidTab(tab.id);
  if (!freshTab || !freshTab.url) return;
  await safeSendMessage(freshTab.id, { type: "SHOW_REPORT_FORM", url: freshTab.url });
}

async function getCommunityTrust(domain) {
  try {
    const hasCommunityTrust = await checkFeatureAccess("community_trust");
    if (!hasCommunityTrust) {
      return { communityScore: 50, visitCount: 0, flagCount: 0, safeCount: 0, locked: true };
    }
    const domainHash = await hashDomain(domain);
    const cached = communityTrustCache.get(domainHash);
    if (cached && (Date.now() - cached.timestamp < TRUST_CACHE_TTL)) {
      return cached.data;
    }
    const response = await fetchWithRetry(`${API_BASE}/api/extension/site-reputation?domainHash=${domainHash}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    communityTrustCache.set(domainHash, { data, timestamp: Date.now() });
    if (communityTrustCache.size > 200) {
      const oldest = [...communityTrustCache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
      if (oldest) communityTrustCache.delete(oldest[0]);
    }
    return data;
  } catch (error) {
    logWarn("core", "Community trust check failed:", error.message);
    return { communityScore: 50, visitCount: 0, flagCount: 0, safeCount: 0 };
  }
}

async function recordVisit(url) {
  try {
    const hostname = new URL(url).hostname;
    const domainHash = await hashDomain(hostname);
    await fetchWithRetry(`${API_BASE}/api/extension/site-reputation/visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domainHash, domain: hostname })
    }, 1);
  } catch (e) { logWarn("core", "Failed to record visit:", e.message); }
}

async function flagDomain(domain) {
  try {
    const domainHash = await hashDomain(domain);
    const response = await fetchWithRetry(`${API_BASE}/api/extension/site-reputation/flag`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domainHash, domain })
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    logError("core", "Flag domain failed:", error.message);
    return { success: false, error: error.message };
  }
}

async function recordSafeVisit(url) {
  try {
    const hostname = new URL(url).hostname;
    const domainHash = await hashDomain(hostname);
    await fetchWithRetry(`${API_BASE}/api/extension/site-reputation/safe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domainHash, domain: hostname })
    }, 1);
  } catch (e) { logWarn("core", "Failed to record safe visit:", e.message); }
}

async function addToScanHistory(result) {
  try {
    const { scanHistory = [] } = await chrome.storage.local.get(["scanHistory"]);
    let hostname = "";
    try { hostname = new URL(result.url).hostname; } catch {}

    const entry = {
      url: result.url,
      hostname,
      riskLevel: result.riskLevel,
      riskScore: result.riskScore,
      timestamp: result.timestamp || Date.now(),
      sources: result.sources || []
    };

    scanHistory.unshift(entry);
    const trimmed = scanHistory.slice(0, 20);
    await chrome.storage.local.set({ scanHistory: trimmed });
  } catch (e) { logWarn("core", "Failed to add to scan history:", e.message); }
}

function getEmptyWeeklyStats() {
  return {
    scansPerDay: [0, 0, 0, 0, 0, 0, 0],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    threatsPerDay: [0, 0, 0, 0, 0, 0, 0],
    sitesVisited: [],
    sitesFlagged: [],
    topThreats: [],
    weekStart: Date.now()
  };
}

let statsWriteQueue = Promise.resolve();
async function incrementStats(risk, linkCount, url) {
  statsWriteQueue = statsWriteQueue.then(async () => {
    const { scanStats = { totalScans: 0, threatsBlocked: 0, linksChecked: 0 } } =
      await chrome.storage.local.get(["scanStats"]);

    scanStats.totalScans += 1;
    if (linkCount) scanStats.linksChecked += linkCount;
    const r = (risk || "").toLowerCase();
    if (r === "high" || r === "critical") scanStats.threatsBlocked += 1;

    const { weeklyStats = getEmptyWeeklyStats() } = await chrome.storage.local.get(["weeklyStats"]);
    const dayIndex = new Date().getDay();
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    weeklyStats.scansPerDay[adjustedIndex] = (weeklyStats.scansPerDay[adjustedIndex] || 0) + 1;
    if (r === "high" || r === "critical") {
      weeklyStats.threatsPerDay[adjustedIndex] = (weeklyStats.threatsPerDay[adjustedIndex] || 0) + 1;
    }

    if (url) {
      try {
        const hostname = new URL(url).hostname;
        if (!weeklyStats.sitesVisited.includes(hostname)) {
          weeklyStats.sitesVisited.push(hostname);
          if (weeklyStats.sitesVisited.length > 100) weeklyStats.sitesVisited = weeklyStats.sitesVisited.slice(-100);
        }
        if (r === "high" || r === "critical") {
          if (!weeklyStats.sitesFlagged.includes(hostname)) {
            weeklyStats.sitesFlagged.push(hostname);
          }
          weeklyStats.topThreats.push({ domain: hostname, risk: r, time: Date.now() });
          if (weeklyStats.topThreats.length > 20) weeklyStats.topThreats = weeklyStats.topThreats.slice(-20);
        }
      } catch {}
    }

    await chrome.storage.local.set({ scanStats, weeklyStats });
  }).catch(e => logWarn("core", "Stats write error:", e.message));
}

async function generateWeeklyDigest() {
  try {
    const settings = await getSettings();
    if (!settings.weeklyDigest) return;

    const hasDigest = await checkFeatureAccess("weekly_digest");
    if (!hasDigest) return;

    const { scanStats = { totalScans: 0, threatsBlocked: 0, linksChecked: 0 } } =
      await chrome.storage.local.get(["scanStats"]);
    const { weeklyStats = getEmptyWeeklyStats() } = await chrome.storage.local.get(["weeklyStats"]);

    const weekScans = weeklyStats.scansPerDay.reduce((a, b) => a + b, 0);
    const weekThreats = weeklyStats.threatsPerDay.reduce((a, b) => a + b, 0);
    const sitesVisitedCount = (weeklyStats.sitesVisited || []).length;
    const sitesFlaggedCount = (weeklyStats.sitesFlagged || []).length;
    const topThreats = (weeklyStats.topThreats || []).slice(-3).map(t => t.domain).filter(Boolean);

    const digestData = {
      weekScans,
      weekThreats,
      sitesVisitedCount,
      sitesFlaggedCount,
      topThreats,
      generatedAt: Date.now()
    };
    await chrome.storage.local.set({ lastDigest: digestData });

    let message = `This week: ${weekScans} pages scanned across ${sitesVisitedCount} sites, ${weekThreats} threats blocked.`;
    if (sitesFlaggedCount > 0) {
      message += ` ${sitesFlaggedCount} site(s) flagged as dangerous.`;
    }
    if (topThreats.length > 0) {
      message += ` Top threats: ${topThreats.join(", ")}.`;
    }
    message += " Stay safe online!";

    chrome.notifications.create("weekly-digest", {
      type: "basic",
      iconUrl: "icons/icon-128.png",
      title: "GCR Scam Guard Weekly Safety Digest",
      message,
      priority: 1
    });

    chrome.storage.local.set({ weeklyStats: getEmptyWeeklyStats() });
  } catch (e) { logError("core", "Weekly digest error:", e.message); }
}

async function fetchScamOfWeek() {
  try {
    const response = await fetchWithRetry(`${API_BASE}/api/scam-of-week`, {}, 1);
    if (response.ok) {
      const data = await response.json();
      if (data && data.title) {
        const stored = await chrome.storage.local.get(["lastScamOfWeekId"]);
        if (stored.lastScamOfWeekId !== data.id) {
          chrome.storage.local.set({
            scamOfWeek: data,
            lastScamOfWeekId: data.id
          });
          const settings = await getSettings();
          if (settings.notifications) {
            chrome.notifications.create("scam-of-week", {
              type: "basic",
              iconUrl: "icons/icon-128.png",
              title: "Scam of the Week Alert",
              message: data.title,
              priority: 1
            });
          }
        }
      }
    }
  } catch (e) { logWarn("core", "Scam of week fetch failed:", e.message); }
}

async function fetchThreatFeed() {
  try {
    const response = await fetchWithRetry(`${API_BASE}/api/scam-feed?limit=10`, {}, 1);
    if (response.ok) {
      const data = await response.json();
      chrome.storage.local.set({ threatFeed: data });
    }
  } catch (e) { logWarn("core", "Threat feed fetch failed:", e.message); }
}

async function handlePageLinksScan(links, tab) {
  const results = {};
  const batch = links.slice(0, 10);

  for (const link of batch) {
    try {
      const rep = await checkUrlReputation(link);
      results[link] = rep;
    } catch (e) {
      results[link] = { error: true };
    }
  }

  incrementStats("check", batch.length);
  return results;
}

function getDefaultSettings() {
  return {
    autoScan: false,
    notifications: true,
    hoverCheck: false,
    blockDangerous: false,
    formWarnings: false,
    lookalikeDetection: false,
    communityTrust: false,
    webmailScan: false,
    weeklyDigest: false
  };
}

function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["settings"], (result) => {
      resolve(result.settings || getDefaultSettings());
    });
  });
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

async function handleSignIn(token) {
  try {
    if (!token || typeof token !== "string" || token.length < 10) {
      return { success: false, error: "Invalid token" };
    }
    const response = await fetchWithRetry(`${API_BASE}/api/extension/subscription-status`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) {
      return { success: false, error: "Invalid or expired token" };
    }
    const data = await response.json();
    await chrome.storage.local.set({
      authToken: token,
      authUser: {
        email: data.email,
        firstName: data.firstName,
        tier: data.tier,
        features: data.features,
        isActive: data.isActive,
        expiresAt: data.expiresAt,
        lastChecked: Date.now()
      }
    });
    cachedSubscription = data;
    subscriptionCacheTime = Date.now();
    await syncSettingsWithFeatures(data.features || ["manual_scan"]);
    logInfo("core", "User signed in:", data.email, "tier:", data.tier);
    return { success: true, tier: data.tier, email: data.email };
  } catch (error) {
    logError("core", "Sign-in failed:", error.message);
    return { success: false, error: error.message };
  }
}

async function syncSettingsWithFeatures(features) {
  const currentSettings = await getSettings();
  const featureSettingsMap = {
    auto_scan: "autoScan",
    hover_check: "hoverCheck",
    block_dangerous: "blockDangerous",
    form_warnings: "formWarnings",
    lookalike_detection: "lookalikeDetection",
    community_trust: "communityTrust",
    webmail_scan: "webmailScan",
    weekly_digest: "weeklyDigest"
  };
  let changed = false;
  for (const [feature, settingKey] of Object.entries(featureSettingsMap)) {
    if (features.includes(feature) && !currentSettings[settingKey]) {
      currentSettings[settingKey] = true;
      changed = true;
    } else if (!features.includes(feature) && currentSettings[settingKey]) {
      currentSettings[settingKey] = false;
      changed = true;
    }
  }
  if (changed) {
    await chrome.storage.local.set({ settings: currentSettings });
  }
}

async function handleSignOut() {
  await chrome.storage.local.remove(["authToken", "authUser"]);
  cachedSubscription = null;
  subscriptionCacheTime = 0;
  await syncSettingsWithFeatures(["manual_scan"]);
  logInfo("core", "User signed out");
  return { success: true };
}

async function getAuthStatus() {
  const { authToken, authUser } = await chrome.storage.local.get(["authToken", "authUser"]);
  if (!authToken) {
    return { signedIn: false, tier: "free", features: ["manual_scan"] };
  }

  if (authUser && authUser.lastChecked && (Date.now() - authUser.lastChecked < SUBSCRIPTION_CACHE_TTL)) {
    return {
      signedIn: true,
      email: authUser.email,
      firstName: authUser.firstName,
      tier: authUser.tier,
      features: authUser.features || ["manual_scan"],
      isActive: authUser.isActive,
      expiresAt: authUser.expiresAt
    };
  }

  try {
    const response = await fetchWithRetry(`${API_BASE}/api/extension/subscription-status`, {
      headers: { "Authorization": `Bearer ${authToken}` }
    });
    if (!response.ok) {
      await chrome.storage.local.remove(["authToken", "authUser"]);
      cachedSubscription = null;
      return { signedIn: false, tier: "free", features: ["manual_scan"], error: "Token expired" };
    }
    const data = await response.json();
    const authUserData = {
      email: data.email,
      firstName: data.firstName,
      tier: data.tier,
      features: data.features,
      isActive: data.isActive,
      expiresAt: data.expiresAt,
      lastChecked: Date.now()
    };
    await chrome.storage.local.set({ authUser: authUserData });
    cachedSubscription = data;
    subscriptionCacheTime = Date.now();
    return {
      signedIn: true,
      email: data.email,
      firstName: data.firstName,
      tier: data.tier,
      features: data.features || ["manual_scan"],
      isActive: data.isActive,
      expiresAt: data.expiresAt
    };
  } catch (error) {
    logWarn("core", "Auth status check failed (offline?):", error.message);
    if (authUser) {
      if (authUser.expiresAt && new Date(authUser.expiresAt) < new Date()) {
        return {
          signedIn: true,
          email: authUser.email,
          firstName: authUser.firstName,
          tier: "free",
          features: ["manual_scan"],
          isActive: false,
          expiresAt: authUser.expiresAt
        };
      }
      return {
        signedIn: true,
        email: authUser.email,
        firstName: authUser.firstName,
        tier: authUser.tier,
        features: authUser.features || ["manual_scan"],
        isActive: authUser.isActive,
        expiresAt: authUser.expiresAt
      };
    }
    return { signedIn: false, tier: "free", features: ["manual_scan"] };
  }
}

async function checkFeatureAccess(feature) {
  if (feature === "manual_scan") return true;
  const auth = await getAuthStatus();
  if (!auth.signedIn || !auth.isActive) return false;
  if (auth.expiresAt && new Date(auth.expiresAt) < new Date()) return false;
  const features = auth.features || ["manual_scan"];
  return features.includes(feature);
}

logInfo("core", "GCR Scam Guard background service worker loaded");
