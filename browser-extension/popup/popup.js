document.addEventListener("DOMContentLoaded", () => {
  const scanInput = document.getElementById("scan-input");
  const btnScan = document.getElementById("btn-scan");
  const btnScanPage = document.getElementById("btn-scan-page");
  const btnSettings = document.getElementById("btn-settings");
  const btnBack = document.getElementById("btn-back");
  const btnReport = document.getElementById("btn-report");
  const btnReportPage = document.getElementById("btn-report-page");
  const loadingIndicator = document.getElementById("loading-indicator");
  const scanResult = document.getElementById("scan-result");
  const viewMain = document.getElementById("view-main");
  const viewSettings = document.getElementById("view-settings");
  const viewWelcome = document.getElementById("view-welcome");
  const popupHeader = document.getElementById("popup-header");
  const btnGetStarted = document.getElementById("btn-get-started");

  const btnConnect = document.getElementById("btn-connect");
  const btnSignOut = document.getElementById("btn-sign-out");
  const authTokenInput = document.getElementById("auth-token-input");
  const authSignedOut = document.getElementById("auth-signed-out");
  const authSignedIn = document.getElementById("auth-signed-in");
  const authEmailEl = document.getElementById("auth-email");
  const authTierEl = document.getElementById("auth-tier");
  const authError = document.getElementById("auth-error");

  let lastScanContent = "";
  let lastScanResult = null;

  chrome.storage.local.get(["onboardingComplete"], (result) => {
    if (result.onboardingComplete) {
      viewMain.classList.add("active");
      popupHeader.style.display = "";
    } else {
      viewWelcome.classList.add("active");
    }
  });

  btnGetStarted.addEventListener("click", () => {
    chrome.storage.local.set({ onboardingComplete: true }, () => {
      viewWelcome.classList.remove("active");
      viewMain.classList.add("active");
      popupHeader.style.display = "";
    });
  });

  loadStats();
  loadScamOfWeek();
  loadSettings();
  loadPageStatus();
  loadWeeklyChart();
  loadScanHistory();
  loadAuthStatus();

  btnScan.addEventListener("click", () => {
    const content = scanInput.value.trim();
    if (!content) return;
    performScan(content);
  });

  scanInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      btnScan.click();
    }
  });

  btnScanPage.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0] || !tabs[0].id || !tabs[0].url) return;
      const tab = tabs[0];
      const skipPatterns = [/^chrome/, /^about:/, /^chrome-extension:/, /^moz-extension:/, /^edge:/, /^brave:/, /^file:/, /^data:/, /^blob:/, /^javascript:/];
      if (skipPatterns.some(p => p.test(tab.url))) {
        scanInput.value = "";
        displayError("Cannot scan this type of page. Try scanning a regular website.");
        return;
      }
      scanInput.value = tab.url;
      loadingIndicator.classList.remove("hidden");
      scanResult.classList.add("hidden");
      btnScan.disabled = true;

      chrome.scripting.executeScript({
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
      }).then((results) => {
        if (results && results[0]?.result) {
          const page = results[0].result;
          const scanContent = [
            `URL: ${tab.url}`,
            `Page Title: ${page.title}`,
            `Description: ${page.meta}`,
            `Headings: ${page.headings}`,
            `Forms on page: ${page.forms}`,
            `Password fields: ${page.passwordFields}`,
            `External links (sample): ${page.links.filter(l => { try { return new URL(l).hostname !== new URL(tab.url).hostname; } catch { return false; } }).slice(0, 10).join(", ")}`,
            `Page content excerpt: ${page.bodyText.substring(0, 800)}`
          ].join("\n");
          performScan(scanContent);
        } else {
          performScan(tab.url);
        }
      }).catch(() => {
        performScan(tab.url);
      });
    });
  });

  btnSettings.addEventListener("click", () => {
    viewMain.classList.remove("active");
    viewSettings.classList.add("active");
  });

  btnBack.addEventListener("click", () => {
    viewSettings.classList.remove("active");
    viewMain.classList.add("active");
  });

  btnReport.addEventListener("click", () => {
    if (!lastScanContent) return;
    const risk = lastScanResult?.scamRiskLevel || "Unknown";
    const extractedUrl = extractUrl(lastScanContent);
    const scamType = (risk === "Critical" || risk === "High") ? "phishing" : "suspicious";
    const description = lastScanResult?.summary || `Scanned content flagged as ${risk} risk`;
    chrome.runtime.sendMessage({
      type: "REPORT_SCAM_STRUCTURED",
      data: {
        content: lastScanContent.substring(0, 500),
        reportType: (risk === "Critical" || risk === "High") ? "confirmed_scam" : "suspicious",
        url: extractedUrl,
        scamType,
        description
      }
    }, (response) => {
      if (response?.success) {
        btnReport.textContent = "Reported!";
        btnReport.disabled = true;
        setTimeout(() => {
          btnReport.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg> Report Scam`;
          btnReport.disabled = false;
        }, 2000);
      }
    });
  });

  document.getElementById("btn-share-result").addEventListener("click", () => {
    if (!lastScanResult) return;
    const risk = (lastScanResult.scamRiskLevel || "Unknown");
    const titles = {
      critical: "Confirmed Threat",
      high: "High Risk Detected",
      moderate: "Caution Advised",
      medium: "Caution Advised",
      low: "Low Risk",
      safe: "Verified Safe"
    };
    const title = titles[risk.toLowerCase()] || risk;
    const summary = lastScanResult.summary || "";
    const url = extractUrl(lastScanContent) || "";
    const text = `GCR Scam Guard Scan Result: ${title}\n\n${summary}\n\n${url ? "Link scanned: " + url + "\n\n" : ""}Protect yourself and your family \u2014 getcyberright.com`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById("btn-share-result");
        btn.textContent = "Copied!";
        setTimeout(() => {
          btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> Share`;
        }, 2000);
      });
    }
  });

  btnReportPage.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0] || !tabs[0].id || !tabs[0].url) return;
      const skipPatterns = [/^chrome/, /^about:/, /^chrome-extension:/, /^moz-extension:/, /^edge:/, /^brave:/, /^file:/, /^data:/, /^blob:/, /^javascript:/];
      if (skipPatterns.some(p => p.test(tabs[0].url))) return;
      chrome.tabs.sendMessage(tabs[0].id, { type: "SHOW_REPORT_FORM", url: tabs[0].url });
      window.close();
    });
  });

  document.querySelectorAll(".toggle").forEach((toggle) => {
    toggle.addEventListener("change", saveSettings);
  });

  btnConnect.addEventListener("click", () => {
    const token = authTokenInput.value.trim();
    if (!token) return;
    authError.classList.add("hidden");
    btnConnect.disabled = true;
    btnConnect.textContent = "Connecting...";
    chrome.runtime.sendMessage({ type: "SIGN_IN", token }, (response) => {
      btnConnect.disabled = false;
      btnConnect.textContent = "Connect";
      if (response?.success) {
        authTokenInput.value = "";
        loadAuthStatus();
        applyFeatureGating();
      } else {
        authError.textContent = response?.error || "Connection failed";
        authError.classList.remove("hidden");
      }
    });
  });

  authTokenInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      btnConnect.click();
    }
  });

  btnSignOut.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "SIGN_OUT" }, () => {
      loadAuthStatus();
      applyFeatureGating();
    });
  });

  function loadPageStatus() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0] || !tabs[0].id || typeof tabs[0].id !== "number") return;
      const tab = tabs[0];
      const tabId = tab.id;

      const pageStatus = document.getElementById("page-status");
      const pageStatusIcon = document.getElementById("page-status-icon");
      const pageStatusRisk = document.getElementById("page-status-risk");
      const pageStatusUrl = document.getElementById("page-status-url");
      const pageStatusSources = document.getElementById("page-status-sources");

      chrome.runtime.sendMessage({ type: "GET_TAB_SCAN_RESULT", tabId: tabId }, (cached) => {
        if (chrome.runtime.lastError) { console.warn("[gcr-guard] popup cache query:", chrome.runtime.lastError.message); }

        if (cached && cached.riskLevel) {
          const riskLevel = cached.riskLevel;
          const iconMap = { critical: "\uD83D\uDED1", high: "\uD83D\uDD34", medium: "\uD83D\uDFE1", low: "\uD83D\uDD35", safe: "\u2705" };
          const labelMap = { critical: "Confirmed Threat", high: "High Risk Detected", medium: "Caution Advised", low: "Low Risk", safe: "Verified Safe" };

          pageStatus.classList.remove("hidden");
          pageStatus.className = `page-status page-status-${riskLevel}`;
          pageStatusIcon.textContent = iconMap[riskLevel] || "\u2705";
          pageStatusRisk.textContent = labelMap[riskLevel] || "Safe";
          pageStatusSources.textContent = (cached.sources || []).join(", ") || "Auto-scan";

          try {
            pageStatusUrl.textContent = new URL(tab.url).hostname;
          } catch {
            pageStatusUrl.textContent = tab.url?.substring(0, 40) || "";
          }
          return;
        }

        chrome.action.getBadgeText({ tabId: tabId }, (text) => {
          if (chrome.runtime.lastError) return;

          if (!text || text === "") {
            pageStatus.classList.add("hidden");
            return;
          }

          let riskLevel = "safe";
          let riskLabel = "Safe";
          let iconText = "\u2705";

          if (text === "!!!") { riskLevel = "critical"; riskLabel = "Confirmed Threat"; iconText = "\uD83D\uDED1"; }
          else if (text === "!!") { riskLevel = "high"; riskLabel = "High Risk Detected"; iconText = "\uD83D\uDD34"; }
          else if (text === "!") { riskLevel = "medium"; riskLabel = "Caution Advised"; iconText = "\uD83D\uDFE1"; }
          else if (text === "OK") { riskLevel = "low"; riskLabel = "Low Risk"; iconText = "\uD83D\uDD35"; }
          else if (text === "\u2713") { riskLevel = "safe"; riskLabel = "Verified Safe"; iconText = "\u2705"; }
          else if (text === "...") { riskLevel = "scanning"; riskLabel = "Scanning..."; iconText = "\uD83D\uDD0D"; }

          pageStatus.classList.remove("hidden");
          pageStatus.className = `page-status page-status-${riskLevel}`;
          pageStatusIcon.textContent = iconText;
          pageStatusRisk.textContent = riskLabel;

          try {
            pageStatusUrl.textContent = new URL(tab.url).hostname;
          } catch {
            pageStatusUrl.textContent = tab.url?.substring(0, 40) || "";
          }
          pageStatusSources.textContent = "Auto-scan";
        });
      });
    });
  }

  function performScan(content) {
    lastScanContent = content;
    lastScanResult = null;
    scanResult.classList.add("hidden");
    loadingIndicator.classList.remove("hidden");
    btnScan.disabled = true;

    chrome.runtime.sendMessage({ type: "SCAN_URL", content }, (response) => {
      loadingIndicator.classList.add("hidden");
      btnScan.disabled = false;

      if (response?.success && response.result) {
        lastScanResult = response.result;
        displayResult(response.result);
        loadStats();
      } else {
        displayError(response?.error || "Analysis failed. Please try again.");
      }
    });
  }

  function displayResult(result) {
    const risk = (result.scamRiskLevel || "Unknown").toLowerCase();
    const header = document.getElementById("result-header");
    const icon = document.getElementById("result-icon");
    const riskEl = document.getElementById("result-risk");
    const verdictEl = document.getElementById("result-verdict");
    const explainerEl = document.getElementById("result-explainer");
    const typeEl = document.getElementById("result-type");
    const summaryEl = document.getElementById("result-summary");
    const flagsEl = document.getElementById("result-flags");
    const recsEl = document.getElementById("result-recs");
    const warningsSection = document.getElementById("result-warnings-section");
    const warningsLabel = document.getElementById("warnings-label");
    const safetyTipsSection = document.getElementById("result-safety-tips-section");

    header.className = `result-header risk-${risk}`;

    const friendlyData = {
      critical: {
        icon: "\uD83D\uDED1",
        title: "Confirmed Threat",
        verdict: "Our scan identified this as a known scam. Do not interact with it.",
        explainer: "This matches multiple scam patterns in our database. Close it, don\u2019t click anything, and don\u2019t enter any information.",
        warningsLabel: "\uD83D\uDED1 What Our Scan Found"
      },
      high: {
        icon: "\uD83D\uDD34",
        title: "High Risk Detected",
        verdict: "This shows strong indicators of a scam. We recommend you avoid it entirely.",
        explainer: "Our analysis flagged several red flags commonly used in scams. Here\u2019s exactly what we found.",
        warningsLabel: "\uD83D\uDD34 Red Flags Detected"
      },
      moderate: {
        icon: "\uD83D\uDFE1",
        title: "Caution Advised",
        verdict: "We found some warning signs. Verify this through official channels before you trust it.",
        explainer: "This isn\u2019t clearly a scam, but some elements don\u2019t check out. Here\u2019s what to watch for.",
        warningsLabel: "\uD83D\uDFE1 Warning Signs"
      },
      medium: {
        icon: "\uD83D\uDFE1",
        title: "Caution Advised",
        verdict: "We found some warning signs. Verify this through official channels before you trust it.",
        explainer: "This isn\u2019t clearly a scam, but some elements don\u2019t check out. Here\u2019s what to watch for.",
        warningsLabel: "\uD83D\uDFE1 Warning Signs"
      },
      low: {
        icon: "\uD83D\uDD35",
        title: "Low Risk",
        verdict: "Nothing alarming here, but we noted a few minor items.",
        explainer: "This appears legitimate. We found some small details worth mentioning, but nothing that indicates a threat.",
        warningsLabel: "\uD83D\uDD35 Minor Notes"
      },
      safe: {
        icon: "\u2705",
        title: "Verified Safe",
        verdict: "No threats detected. You\u2019re good to go.",
        explainer: "Our scan checked for scam patterns, malicious links, and known threats \u2014 this came back clean.",
        warningsLabel: ""
      }
    };

    const data = friendlyData[risk] || friendlyData.moderate;
    icon.textContent = data.icon;
    riskEl.textContent = data.title;
    verdictEl.textContent = data.verdict;
    explainerEl.textContent = data.explainer;

    if (result.contentTypeDetected) {
      const friendlyTypes = {
        "URL": "Website Link",
        "email": "Email Message",
        "phone": "Phone Number",
        "sms": "Text Message",
        "message": "Message",
        "text": "Text Content"
      };
      const detected = result.contentTypeDetected.split(" ")[0];
      typeEl.textContent = "Scanned: " + (friendlyTypes[detected] || result.contentTypeDetected);
      typeEl.classList.remove("hidden");
    } else {
      typeEl.classList.add("hidden");
    }

    summaryEl.textContent = result.summary || "";

    flagsEl.innerHTML = "";
    if (result.keyRedFlags && result.keyRedFlags.length > 0) {
      warningsSection.classList.remove("hidden");
      warningsLabel.textContent = data.warningsLabel;
      result.keyRedFlags.forEach((flag) => {
        const div = document.createElement("div");
        div.className = "flag-item";
        const iconSpan = document.createElement("span");
        iconSpan.className = "flag-icon";
        const flagIcons = { critical: "\uD83D\uDED1", high: "\uD83D\uDD34", moderate: "\uD83D\uDFE1", medium: "\uD83D\uDFE1", low: "\uD83D\uDD35", safe: "\u2705" };
        iconSpan.textContent = flagIcons[risk] || "\uD83D\uDFE1";
        const textSpan = document.createElement("span");
        textSpan.textContent = flag;
        div.appendChild(iconSpan);
        div.appendChild(textSpan);
        flagsEl.appendChild(div);
      });
    } else {
      warningsSection.classList.add("hidden");
    }

    recsEl.innerHTML = "";
    if (result.recommendedActions && result.recommendedActions.length > 0) {
      safetyTipsSection.classList.remove("hidden");
      result.recommendedActions.slice(0, 3).forEach((rec) => {
        const div = document.createElement("div");
        div.className = "rec-item";
        div.textContent = rec;
        recsEl.appendChild(div);
      });
    } else {
      safetyTipsSection.classList.add("hidden");
    }

    scanResult.classList.remove("hidden");
  }

  function displayError(message) {
    const header = document.getElementById("result-header");
    const icon = document.getElementById("result-icon");
    const riskEl = document.getElementById("result-risk");
    const verdictEl = document.getElementById("result-verdict");
    const explainerEl = document.getElementById("result-explainer");
    const typeEl = document.getElementById("result-type");
    const summaryEl = document.getElementById("result-summary");
    const flagsEl = document.getElementById("result-flags");
    const recsEl = document.getElementById("result-recs");
    const warningsSection = document.getElementById("result-warnings-section");
    const safetyTipsSection = document.getElementById("result-safety-tips-section");

    header.className = "result-header";
    icon.textContent = "\u274C";
    riskEl.textContent = "Something Went Wrong";
    verdictEl.textContent = "We couldn\u2019t complete the scan. Please try again.";
    explainerEl.textContent = "";
    typeEl.textContent = "";
    typeEl.classList.add("hidden");
    summaryEl.textContent = message;
    flagsEl.innerHTML = "";
    recsEl.innerHTML = "";
    warningsSection.classList.add("hidden");
    safetyTipsSection.classList.add("hidden");
    scanResult.classList.remove("hidden");
  }

  function loadStats() {
    chrome.runtime.sendMessage({ type: "GET_SCAN_STATS" }, (stats) => {
      if (stats) {
        document.getElementById("stat-scans").textContent = stats.totalScans || 0;
        document.getElementById("stat-threats").textContent = stats.threatsBlocked || 0;
        document.getElementById("stat-links").textContent = stats.linksChecked || 0;
      }
    });
    chrome.runtime.sendMessage({ type: "GET_WEEKLY_STATS" }, (weeklyStats) => {
      const scoreEl = document.getElementById("stat-safety-score");
      if (!scoreEl || !weeklyStats) return;
      const scans = (weeklyStats.scansPerDay || []).reduce((a, b) => a + b, 0);
      const threats = (weeklyStats.threatsPerDay || []).reduce((a, b) => a + b, 0);
      if (scans === 0) {
        scoreEl.textContent = "--";
        return;
      }
      const safetyScore = Math.round(((scans - threats) / scans) * 100);
      scoreEl.textContent = safetyScore;
      if (safetyScore >= 90) {
        scoreEl.style.color = "#16a34a";
      } else if (safetyScore >= 70) {
        scoreEl.style.color = "#ca8a04";
      } else {
        scoreEl.style.color = "#dc2626";
      }
    });
  }

  function loadScamOfWeek() {
    chrome.runtime.sendMessage({ type: "GET_SCAM_OF_WEEK" }, (data) => {
      if (data && data.title) {
        document.getElementById("sotw-title").textContent = data.title;
        document.getElementById("sotw-desc").textContent = data.description || "";
        document.getElementById("scam-of-week").classList.remove("hidden");
      }
    });
  }

  function loadWeeklyChart() {
    chrome.runtime.sendMessage({ type: "GET_WEEKLY_STATS" }, (stats) => {
      if (!stats) return;
      renderWeeklyChart(stats);
      renderDigestSummary(stats);
    });
  }

  function renderDigestSummary(stats) {
    const el = document.getElementById("digest-summary");
    if (!el) return;

    chrome.storage.local.get(["lastDigest"], (result) => {
      const digest = result.lastDigest;
      const sitesCount = (stats.sitesVisited || []).length || (digest?.sitesVisitedCount || 0);
      const flaggedCount = (stats.sitesFlagged || []).length || (digest?.sitesFlaggedCount || 0);
      const topThreats = (stats.topThreats || []).slice(-3);
      const digestThreats = digest?.topThreats || [];
      const threatDomains = topThreats.length > 0
        ? topThreats.map(t => t.domain).filter(Boolean)
        : digestThreats;

      if (sitesCount === 0 && flaggedCount === 0) return;

      el.classList.remove("hidden");
      let html = `<span class="digest-stat">${sitesCount} unique site${sitesCount !== 1 ? "s" : ""} visited</span>`;
      if (flaggedCount > 0) {
        html += ` <span class="digest-stat digest-stat-warn">${flaggedCount} flagged</span>`;
      }
      if (threatDomains.length > 0) {
        html += `<span class="digest-threats">Top threats: ${threatDomains.join(", ")}</span>`;
      }
      if (digest?.generatedAt) {
        const ago = timeAgo(digest.generatedAt);
        html += `<span class="digest-threats">Last digest: ${ago}</span>`;
      }
      el.innerHTML = html;
    });
  }

  function renderWeeklyChart(stats) {
    const svg = document.getElementById("weekly-chart");
    if (!svg) return;

    const days = stats.days || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const scans = stats.scansPerDay || [0, 0, 0, 0, 0, 0, 0];
    const threats = stats.threatsPerDay || [0, 0, 0, 0, 0, 0, 0];
    const maxVal = Math.max(...scans, ...threats, 1);

    const chartW = 320;
    const chartH = 80;
    const barW = 16;
    const gap = (chartW - 7 * barW * 2 - 7 * 4) / 8;
    const bottomPad = 14;
    const topPad = 4;
    const availH = chartH - bottomPad - topPad;

    const ns = "http://www.w3.org/2000/svg";

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    for (let i = 0; i < 7; i++) {
      const x = gap + i * (barW * 2 + 4 + gap);
      const scanH = scans[i] > 0 ? Math.max(2, (scans[i] / maxVal) * availH) : 0;
      const threatH = threats[i] > 0 ? Math.max(2, (threats[i] / maxVal) * availH) : 0;

      const scanRect = document.createElementNS(ns, "rect");
      scanRect.setAttribute("x", x);
      scanRect.setAttribute("y", topPad + availH - scanH);
      scanRect.setAttribute("width", barW);
      scanRect.setAttribute("height", scanH);
      scanRect.setAttribute("rx", "3");
      scanRect.setAttribute("fill", "#0A2A3C");
      scanRect.setAttribute("opacity", "0.7");
      svg.appendChild(scanRect);

      const threatRect = document.createElementNS(ns, "rect");
      threatRect.setAttribute("x", x + barW + 2);
      threatRect.setAttribute("y", topPad + availH - threatH);
      threatRect.setAttribute("width", barW);
      threatRect.setAttribute("height", threatH);
      threatRect.setAttribute("rx", "3");
      threatRect.setAttribute("fill", "#dc2626");
      threatRect.setAttribute("opacity", "0.7");
      svg.appendChild(threatRect);

      const label = document.createElementNS(ns, "text");
      label.setAttribute("x", x + barW);
      label.setAttribute("y", chartH - 2);
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("font-size", "9");
      label.setAttribute("fill", "#9ca3af");
      label.setAttribute("font-family", "-apple-system,sans-serif");
      label.textContent = days[i];
      svg.appendChild(label);
    }
  }

  function loadScanHistory() {
    chrome.runtime.sendMessage({ type: "GET_SCAN_HISTORY" }, (history) => {
      if (!history || history.length === 0) return;

      const section = document.getElementById("scan-history-section");
      const list = document.getElementById("scan-history-list");
      section.classList.remove("hidden");
      list.innerHTML = "";

      const recent = history.slice(0, 5);
      const riskIcons = { critical: "\uD83D\uDEA8", high: "\u26A0\uFE0F", medium: "\u26A1", low: "\uD83D\uDD35", safe: "\u2705" };

      recent.forEach((entry) => {
        const item = document.createElement("div");
        item.className = `scan-history-item scan-history-${entry.riskLevel || "safe"}`;

        const icon = document.createElement("span");
        icon.className = "scan-history-icon";
        icon.textContent = riskIcons[entry.riskLevel] || "\u2705";

        const info = document.createElement("div");
        info.className = "scan-history-info";

        const hostEl = document.createElement("div");
        hostEl.className = "scan-history-host";
        hostEl.textContent = entry.hostname || "Unknown";

        const timeEl = document.createElement("div");
        timeEl.className = "scan-history-time";
        timeEl.textContent = formatTimeAgo(entry.timestamp);

        info.appendChild(hostEl);
        info.appendChild(timeEl);

        const riskBadge = document.createElement("span");
        riskBadge.className = `scan-history-badge scan-history-badge-${entry.riskLevel || "safe"}`;
        riskBadge.textContent = capitalize(entry.riskLevel || "safe");

        item.appendChild(icon);
        item.appendChild(info);
        item.appendChild(riskBadge);
        list.appendChild(item);
      });
    });
  }

  function formatTimeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  function loadSettings() {
    chrome.runtime.sendMessage({ type: "GET_SETTINGS" }, (settings) => {
      if (settings) {
        document.getElementById("setting-autoscan").checked = settings.autoScan !== false;
        document.getElementById("setting-hover").checked = settings.hoverCheck !== false;
        document.getElementById("setting-notifications").checked = settings.notifications !== false;
        document.getElementById("setting-block").checked = settings.blockDangerous || false;
        document.getElementById("setting-formwarnings").checked = settings.formWarnings !== false;
        document.getElementById("setting-lookalike").checked = settings.lookalikeDetection !== false;
        document.getElementById("setting-webmail").checked = settings.webmailScan !== false;
        document.getElementById("setting-community").checked = settings.communityTrust !== false;
        document.getElementById("setting-digest").checked = settings.weeklyDigest !== false;
      }
    });
  }

  function saveSettings() {
    const settings = {
      autoScan: document.getElementById("setting-autoscan").checked,
      hoverCheck: document.getElementById("setting-hover").checked,
      notifications: document.getElementById("setting-notifications").checked,
      blockDangerous: document.getElementById("setting-block").checked,
      formWarnings: document.getElementById("setting-formwarnings").checked,
      lookalikeDetection: document.getElementById("setting-lookalike").checked,
      webmailScan: document.getElementById("setting-webmail").checked,
      communityTrust: document.getElementById("setting-community").checked,
      weeklyDigest: document.getElementById("setting-digest").checked
    };
    chrome.runtime.sendMessage({ type: "SAVE_SETTINGS", settings });
  }

  function timeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  function loadAuthStatus() {
    chrome.runtime.sendMessage({ type: "GET_AUTH_STATUS" }, (status) => {
      if (!status) return;
      if (status.signedIn) {
        authSignedOut.classList.add("hidden");
        authSignedIn.classList.remove("hidden");
        authEmailEl.textContent = status.email || "Connected";
        const tierLabels = { free: "Free", essential: "Pro", professional: "Family" };
        const tierLabel = tierLabels[status.tier] || "Free";
        authTierEl.textContent = tierLabel;
        authTierEl.className = `auth-tier tier-${status.tier || "free"}`;
      } else {
        authSignedOut.classList.remove("hidden");
        authSignedIn.classList.add("hidden");
      }
      applyFeatureGating(status);
    });
  }

  function applyFeatureGating(status) {
    if (!status) {
      chrome.runtime.sendMessage({ type: "GET_AUTH_STATUS" }, (s) => {
        if (s) applyFeatureGating(s);
      });
      return;
    }
    const features = status.features || ["manual_scan"];
    const featureMap = {
      "setting-autoscan": "auto_scan",
      "setting-webmail": "webmail_scan",
      "setting-community": "community_trust",
      "setting-digest": "weekly_digest",
      "setting-hover": "hover_check",
      "setting-block": "block_dangerous",
      "setting-lookalike": "lookalike_detection",
      "setting-formwarnings": "form_warnings"
    };
    const familyFeatures = ["weekly_digest"];

    let settingsChanged = false;
    Object.entries(featureMap).forEach(([settingId, feature]) => {
      const el = document.getElementById(settingId);
      if (!el) return;
      const settingItem = el.closest(".setting-item");
      if (!settingItem) return;

      if (features.includes(feature)) {
        settingItem.classList.remove("feature-locked", "family-only");
        el.disabled = false;
      } else {
        settingItem.classList.add("feature-locked");
        if (familyFeatures.includes(feature)) {
          settingItem.classList.add("family-only");
        }
        el.disabled = true;
        if (el.checked) {
          el.checked = false;
          settingsChanged = true;
        }
      }
    });
    if (settingsChanged) {
      saveSettings();
    }
  }

  function extractUrl(text) {
    const match = text.match(/https?:\/\/[^\s<>"{}|\\^`\[\]]+/i);
    return match ? match[0] : null;
  }

  function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
  }
});
