const API_BASE = "https://www.getcyberright.com";

const tabCache = new Map();

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

  chrome.alarms.create("check-scam-of-week", { periodInMinutes: 360 });
  chrome.alarms.create("refresh-threat-feed", { periodInMinutes: 60 });

  fetchScamOfWeek();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "check-scam-of-week") {
    fetchScamOfWeek();
  }
  if (alarm.name === "refresh-threat-feed") {
    fetchThreatFeed();
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "gcr-scan-link") {
    scanContent(info.linkUrl, tab);
  } else if (info.menuItemId === "gcr-scan-page") {
    extractAndScanPage(tab);
  } else if (info.menuItemId === "gcr-scan-selection") {
    scanContent(info.selectionText, tab);
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

  if (tabCache.has(tabId)) {
    const cached = tabCache.get(tabId);
    if (cached.url === url && Date.now() - cached.timestamp < 300000) {
      updateBadgeFromResult(cached, tabId);
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

  if (isTrustedDomain(url)) {
    if (!result.lookalikeMatch) {
      result.riskLevel = "safe";
      result.riskScore = 0;
      result.sources.push("trusted-domain");
      tabCache.set(tabId, result);
      updateBadgeFromResult(result, tabId);
      return result;
    }
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
  } catch (e) {}

  if (result.riskScore > 0 || result.lookalikeMatch) {
    let interimLevel = "safe";
    if (result.riskScore >= 70) interimLevel = "critical";
    else if (result.riskScore >= 50) interimLevel = "high";
    else if (result.riskScore >= 30) interimLevel = "medium";
    else if (result.riskScore >= 10) interimLevel = "low";
    result.riskLevel = interimLevel;
    updateBadgeFromResult(result, tabId);
  }

  if (result.riskScore >= 30 || result.lookalikeMatch) {
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
    } catch (e) {}
  }

  if (!await isTabStillOnUrl(tabId, url)) return { skipped: true, reason: "navigated" };

  if (result.riskScore >= 70) result.riskLevel = "critical";
  else if (result.riskScore >= 50) result.riskLevel = "high";
  else if (result.riskScore >= 30) result.riskLevel = "medium";
  else if (result.riskScore >= 10) result.riskLevel = "low";
  else result.riskLevel = "safe";

  tabCache.set(tabId, result);
  updateBadgeFromResult(result, tabId);
  incrementStats(result.riskLevel);

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
  } catch (e) {}

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
    lookalikeDetection: true
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

async function incrementStats(risk, linkCount) {
  const { scanStats = { totalScans: 0, threatsBlocked: 0, linksChecked: 0 } } =
    await chrome.storage.local.get(["scanStats"]);

  scanStats.totalScans += 1;
  if (linkCount) scanStats.linksChecked += linkCount;
  const r = (risk || "").toLowerCase();
  if (r === "high" || r === "critical") scanStats.threatsBlocked += 1;

  chrome.storage.local.set({ scanStats });
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
