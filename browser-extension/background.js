const API_BASE = "https://www.getcyberright.com";

const tabCache = new Map();
let cachedSubscription = null;
let subscriptionCacheTime = 0;
const SUBSCRIPTION_CACHE_TTL = 10 * 60 * 1000;

const SKIP_SCAN_PATTERNS = [
  /^chrome/,
  /^about:/,
  /^chrome-extension:/,
  /^moz-extension:/,
  /^edge:/,
  /^brave:/,
  /^opera:/,
  /^vivaldi:/,
  /^file:/,
  /^data:/,
  /^blob:/,
  /^javascript:/
];

const TRUSTED_DOMAINS = new Set([
  "google.com", "www.google.com", "google.co.uk", "google.ca",
  "youtube.com", "www.youtube.com",
  "github.com", "www.github.com",
  "stackoverflow.com", "www.stackoverflow.com",
  "wikipedia.org", "en.wikipedia.org",
  "reddit.com", "www.reddit.com",
  "amazon.com", "www.amazon.com",
  "microsoft.com", "www.microsoft.com",
  "apple.com", "www.apple.com",
  "facebook.com", "www.facebook.com",
  "twitter.com", "www.twitter.com", "x.com",
  "linkedin.com", "www.linkedin.com",
  "instagram.com", "www.instagram.com",
  "netflix.com", "www.netflix.com",
  "getcyberright.com", "www.getcyberright.com",
  "replit.com", "www.replit.com"
]);

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "gcr-scan-link",
    title: "Scan with GCR Guard",
    contexts: ["link"]
  });

  chrome.contextMenus.create({
    id: "gcr-scan-page",
    title: "Scan this page with GCR Guard",
    contexts: ["page"]
  });

  chrome.contextMenus.create({
    id: "gcr-scan-selection",
    title: "Scan selected text with GCR Guard",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "gcr-report-site",
    title: "Report this site to GCR Guard",
    contexts: ["page"]
  });

  chrome.alarms.create("check-scam-of-week", { periodInMinutes: 360 });
  chrome.alarms.create("refresh-threat-feed", { periodInMinutes: 60 });
  chrome.alarms.create("weekly-safety-digest", { periodInMinutes: 10080 });

  fetchScamOfWeek();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "check-scam-of-week") {
    fetchScamOfWeek();
  }
  if (alarm.name === "refresh-threat-feed") {
    fetchThreatFeed();
  }
  if (alarm.name === "weekly-safety-digest") {
    generateWeeklyDigest();
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "gcr-scan-link") {
    scanContent(info.linkUrl, tab);
  } else if (info.menuItemId === "gcr-scan-page") {
    extractAndScanPage(tab);
  } else if (info.menuItemId === "gcr-scan-selection") {
    scanContent(info.selectionText, tab);
  } else if (info.menuItemId === "gcr-report-site") {
    handleContextMenuReport(tab);
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  tabCache.delete(tabId);
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId === 0) {
    tabCache.delete(details.tabId);
    updateBadge("", "#16a34a", details.tabId);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SCAN_URL") {
    performScan(message.content).then(sendResponse);
    return true;
  }
  if (message.type === "CHECK_URL_REPUTATION") {
    checkUrlReputation(message.url).then(sendResponse);
    return true;
  }
  if (message.type === "REPORT_SCAM") {
    reportScam(message.data).then(sendResponse);
    return true;
  }
  if (message.type === "REPORT_SCAM_STRUCTURED") {
    reportScamStructured(message.data).then(sendResponse);
    return true;
  }
  if (message.type === "GET_SCAM_OF_WEEK") {
    chrome.storage.local.get(["scamOfWeek"], (result) => {
      sendResponse(result.scamOfWeek || null);
    });
    return true;
  }
  if (message.type === "GET_SCAN_STATS") {
    chrome.storage.local.get(["scanStats"], (result) => {
      sendResponse(result.scanStats || { totalScans: 0, threatsBlocked: 0, linksChecked: 0 });
    });
    return true;
  }
  if (message.type === "GET_WEEKLY_STATS") {
    chrome.storage.local.get(["weeklyStats"], (result) => {
      sendResponse(result.weeklyStats || getEmptyWeeklyStats());
    });
    return true;
  }
  if (message.type === "GET_SCAN_HISTORY") {
    chrome.storage.local.get(["scanHistory"], (result) => {
      sendResponse(result.scanHistory || []);
    });
    return true;
  }
  if (message.type === "SCAN_PAGE_LINKS") {
    handlePageLinksScan(message.links, sender.tab).then(sendResponse);
    return true;
  }
  if (message.type === "GET_SETTINGS") {
    chrome.storage.local.get(["settings"], (result) => {
      sendResponse(result.settings || getDefaultSettings());
    });
    return true;
  }
  if (message.type === "SAVE_SETTINGS") {
    chrome.storage.local.set({ settings: message.settings }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
  if (message.type === "PAGE_LOADED") {
    handleAutoScan(message, sender).then(sendResponse);
    return true;
  }
  if (message.type === "GET_TAB_SCAN_RESULT") {
    const tabId = message.tabId || sender.tab?.id;
    if (tabId && tabCache.has(tabId)) {
      sendResponse(tabCache.get(tabId));
    } else {
      sendResponse(null);
    }
    return true;
  }
  if (message.type === "GET_PAGE_RISK") {
    const tabId = message.tabId || sender.tab?.id;
    if (tabId && tabCache.has(tabId)) {
      const cached = tabCache.get(tabId);
      sendResponse({ riskLevel: cached.riskLevel, riskScore: cached.riskScore });
    } else {
      sendResponse({ riskLevel: "unknown", riskScore: 0 });
    }
    return true;
  }
  if (message.type === "GET_COMMUNITY_TRUST") {
    getCommunityTrust(message.domain).then(sendResponse);
    return true;
  }
  if (message.type === "FLAG_DOMAIN") {
    flagDomain(message.domain).then(sendResponse);
    return true;
  }
  if (message.type === "SCAN_WEBMAIL") {
    performScan(message.content).then(sendResponse);
    return true;
  }
  if (message.type === "SIGN_IN") {
    handleSignIn(message.token).then(sendResponse);
    return true;
  }
  if (message.type === "SIGN_OUT") {
    handleSignOut().then(sendResponse);
    return true;
  }
  if (message.type === "GET_AUTH_STATUS") {
    getAuthStatus().then(sendResponse);
    return true;
  }
  if (message.type === "CHECK_FEATURE") {
    checkFeatureAccess(message.feature).then(sendResponse);
    return true;
  }
});

function shouldSkipUrl(url) {
  if (!url) return true;
  return SKIP_SCAN_PATTERNS.some(p => p.test(url));
}

function isTrustedDomain(url) {
  try {
    const hostname = new URL(url).hostname;
    if (TRUSTED_DOMAINS.has(hostname)) return true;
    const parts = hostname.split(".");
    if (parts.length > 2) {
      const rootDomain = parts.slice(-2).join(".");
      if (TRUSTED_DOMAINS.has(rootDomain)) return true;
    }
    return false;
  } catch {
    return false;
  }
}

async function isTabStillOnUrl(tabId, url) {
  try {
    const tab = await chrome.tabs.get(tabId);
    return tab && tab.url === url;
  } catch {
    return false;
  }
}

async function handleAutoScan(message, sender) {
  const tabId = sender.tab?.id;
  const url = message.url;

  if (!tabId || !url || shouldSkipUrl(url)) {
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

  if (tabCache.has(tabId)) {
    const cached = tabCache.get(tabId);
    if (cached.url === url && Date.now() - cached.timestamp < 300000) {
      updateBadgeFromResult(cached, tabId);
      try {
        chrome.tabs.sendMessage(tabId, { type: "AUTO_SCAN_RESULT", result: cached });
      } catch (e) { console.warn("[gcr-guard] Failed to send cached result to tab:", e.message); }
      return cached;
    }
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
      const rep = repResult;
      let repScore = 0;

      if (rep.phishTank?.isPhishing) repScore += 40;
      if (rep.urlhaus?.isMalware) repScore += 40;
      if (rep.googleSafeBrowsing?.isThreat) repScore += 40;
      if (rep.domainAge?.isNew) repScore += 15;
      if (rep.domainAge?.ageInDays !== null && rep.domainAge?.ageInDays !== undefined && rep.domainAge.ageInDays < 30) repScore += 10;

      result.riskScore = Math.max(result.riskScore, Math.min(repScore, 100));
    }
  } catch (e) { console.warn("[gcr-guard] Reputation check failed:", e.message); }

  if (result.riskScore > 0 || result.lookalikeMatch) {
    let interimLevel = "safe";
    if (result.riskScore >= 70) interimLevel = "critical";
    else if (result.riskScore >= 50) interimLevel = "high";
    else if (result.riskScore >= 30) interimLevel = "medium";
    else if (result.riskScore >= 10) interimLevel = "low";
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
        if (aiRisk === "critical") aiScore = 95;
        else if (aiRisk === "high") aiScore = 75;
        else if (aiRisk === "moderate" || aiRisk === "medium") aiScore = 50;
        else if (aiRisk === "low") aiScore = 20;

        result.riskScore = Math.max(result.riskScore, aiScore);
      }
    } catch (e) { console.warn("[gcr-guard] AI scan failed:", e.message); }
  }

  if (!await isTabStillOnUrl(tabId, url)) return { skipped: true, reason: "navigated" };

  if (result.riskScore >= 70) result.riskLevel = "critical";
  else if (result.riskScore >= 50) result.riskLevel = "high";
  else if (result.riskScore >= 30) result.riskLevel = "medium";
  else if (result.riskScore >= 10) result.riskLevel = "low";
  else result.riskLevel = "safe";

  tabCache.set(tabId, result);
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

  try {
    chrome.tabs.sendMessage(tabId, {
      type: "AUTO_SCAN_RESULT",
      result: result
    });
  } catch (e) { console.warn("[gcr-guard] Failed to send scan result to tab:", e.message); }

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

function updateBadgeFromResult(result, tabId) {
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

async function extractAndScanPage(tab) {
  if (!tab?.id || !tab?.url) return;
  updateBadge("...", "#666", tab.id);

  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
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
        const pageHost = new URL(tab.url).hostname;
        externalLinks = page.links.filter(l => { try { return new URL(l).hostname !== pageHost; } catch { return false; } }).slice(0, 10);
      } catch {}

      const content = [
        `URL: ${tab.url}`,
        `Page Title: ${page.title}`,
        `Description: ${page.meta}`,
        `Headings: ${page.headings}`,
        `Forms on page: ${page.forms}`,
        `Password fields: ${page.passwordFields}`,
        `External links (sample): ${externalLinks.join(", ")}`,
        `Page content excerpt: ${page.bodyText.substring(0, 800)}`
      ].join("\n");
      scanContent(content, tab);
    } else {
      scanContent(tab.url, tab);
    }
  } catch {
    scanContent(tab.url, tab);
  }
}

function getDefaultSettings() {
  return {
    autoScan: true,
    notifications: true,
    hoverCheck: true,
    blockDangerous: false,
    formWarnings: true,
    lookalikeDetection: true,
    communityTrust: true,
    webmailScan: true,
    weeklyDigest: true
  };
}

async function scanContent(content, tab) {
  if (!content) return;

  updateBadge("...", "#666", tab?.id);

  try {
    const result = await performScan(content);
    if (result.success) {
      const risk = result.result.scamRiskLevel || "Unknown";
      const badgeInfo = getBadgeForRisk(risk);
      updateBadge(badgeInfo.text, badgeInfo.color, tab?.id);
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

      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: "SCAN_RESULT",
          result: result.result,
          url: content
        });
      }
    }
  } catch (error) {
    updateBadge("!", "#999", tab?.id);
  }
}

async function performScan(content) {
  try {
    const response = await fetch(`${API_BASE}/api/security/ai-scam-analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function checkUrlReputation(url) {
  try {
    const response = await fetch(`${API_BASE}/api/security/check-url-reputation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function reportScam(data) {
  try {
    const response = await fetch(`${API_BASE}/api/community-reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return { success: true };
  } catch (error) {
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
    const response = await fetch(`${API_BASE}/api/community-reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reportData)
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);

    if (data.url) {
      try {
        const domainHash = await hashDomain(new URL(data.url).hostname);
        await flagDomain(new URL(data.url).hostname);
      } catch (e) { console.warn("[gcr-guard] Failed to flag domain after report:", e.message); }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function handleContextMenuReport(tab) {
  if (!tab?.id || !tab?.url) return;
  try {
    chrome.tabs.sendMessage(tab.id, { type: "SHOW_REPORT_FORM", url: tab.url });
  } catch (e) { console.warn("[gcr-guard] Failed to show report form:", e.message); }
}

async function hashDomain(domain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(domain.toLowerCase().replace(/^www\./, ""));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

const communityTrustCache = new Map();
const TRUST_CACHE_TTL = 5 * 60 * 1000;

async function getCommunityTrust(domain) {
  try {
    const domainHash = await hashDomain(domain);
    const cached = communityTrustCache.get(domainHash);
    if (cached && (Date.now() - cached.timestamp < TRUST_CACHE_TTL)) {
      return cached.data;
    }
    const response = await fetch(`${API_BASE}/api/extension/site-reputation?domainHash=${domainHash}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    communityTrustCache.set(domainHash, { data, timestamp: Date.now() });
    if (communityTrustCache.size > 200) {
      const oldest = [...communityTrustCache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
      if (oldest) communityTrustCache.delete(oldest[0]);
    }
    return data;
  } catch (error) {
    return { communityScore: 50, visitCount: 0, flagCount: 0, safeCount: 0 };
  }
}

async function recordVisit(url) {
  try {
    const hostname = new URL(url).hostname;
    const domainHash = await hashDomain(hostname);
    await fetch(`${API_BASE}/api/extension/site-reputation/visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domainHash, domain: hostname })
    });
  } catch (e) { console.warn("[gcr-guard] Failed to record visit:", e.message); }
}

async function flagDomain(domain) {
  try {
    const domainHash = await hashDomain(domain);
    const response = await fetch(`${API_BASE}/api/extension/site-reputation/flag`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domainHash, domain })
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function recordSafeVisit(url) {
  try {
    const hostname = new URL(url).hostname;
    const domainHash = await hashDomain(hostname);
    await fetch(`${API_BASE}/api/extension/site-reputation/safe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domainHash, domain: hostname })
    });
  } catch (e) { console.warn("[gcr-guard] Failed to record safe visit:", e.message); }
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
  } catch (e) { console.warn("[gcr-guard] Failed to add to scan history:", e.message); }
}

function getEmptyWeeklyStats() {
  return {
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    scansPerDay: [0, 0, 0, 0, 0, 0, 0],
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
      } catch (e) {}
    }

    await chrome.storage.local.set({ scanStats, weeklyStats });
  }).catch(e => console.warn("[gcr-guard] Stats write error:", e.message));
}

async function generateWeeklyDigest() {
  try {
    const settings = await getSettings();
    if (!settings.weeklyDigest) return;

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
      title: "GCR Guard Weekly Safety Digest",
      message,
      priority: 1
    });

    chrome.storage.local.set({ weeklyStats: getEmptyWeeklyStats() });
  } catch (e) { console.warn("[gcr-guard] Weekly digest error:", e.message); }
}

async function fetchScamOfWeek() {
  try {
    const response = await fetch(`${API_BASE}/api/scam-of-week`);
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
  } catch (error) {}
}

async function fetchThreatFeed() {
  try {
    const response = await fetch(`${API_BASE}/api/scam-feed?limit=10`);
    if (response.ok) {
      const data = await response.json();
      chrome.storage.local.set({ threatFeed: data });
    }
  } catch (error) {}
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

function getBadgeForRisk(risk) {
  const normalized = risk.toLowerCase();
  if (normalized === "critical") return { text: "!!!", color: "#dc2626" };
  if (normalized === "high") return { text: "!!", color: "#ea580c" };
  if (normalized === "moderate" || normalized === "medium") return { text: "!", color: "#ca8a04" };
  if (normalized === "low") return { text: "OK", color: "#2563eb" };
  return { text: "\u2713", color: "#16a34a" };
}

function updateBadge(text, color, tabId) {
  const opts = { text };
  if (tabId) opts.tabId = tabId;
  chrome.action.setBadgeText(opts);
  chrome.action.setBadgeBackgroundColor({ color, ...(tabId ? { tabId } : {}) });
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
    if (!token || token.length < 10) {
      return { success: false, error: "Invalid token" };
    }
    const response = await fetch(`${API_BASE}/api/extension/subscription-status`, {
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
    return { success: true, tier: data.tier, email: data.email };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function handleSignOut() {
  await chrome.storage.local.remove(["authToken", "authUser"]);
  cachedSubscription = null;
  subscriptionCacheTime = 0;
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
    const response = await fetch(`${API_BASE}/api/extension/subscription-status`, {
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
