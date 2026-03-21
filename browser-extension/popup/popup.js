document.addEventListener("DOMContentLoaded", () => {
  const scanInput = document.getElementById("scan-input");
  const btnScan = document.getElementById("btn-scan");
  const btnScanPage = document.getElementById("btn-scan-page");
  const btnSettings = document.getElementById("btn-settings");
  const btnBack = document.getElementById("btn-back");
  const btnReport = document.getElementById("btn-report");
  const loadingIndicator = document.getElementById("loading-indicator");
  const scanResult = document.getElementById("scan-result");
  const viewMain = document.getElementById("view-main");
  const viewSettings = document.getElementById("view-settings");

  let lastScanContent = "";
  let lastScanResult = null;

  loadStats();
  loadScamOfWeek();
  loadSettings();

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
      if (tabs[0]?.url) {
        scanInput.value = tabs[0].url;
        performScan(tabs[0].url);
      }
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
    chrome.runtime.sendMessage({
      type: "REPORT_SCAM",
      data: {
        content: lastScanContent.substring(0, 500),
        reportType: risk === "Critical" || risk === "High" ? "confirmed_scam" : "suspicious",
        url: extractUrl(lastScanContent)
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

  document.querySelectorAll(".toggle").forEach((toggle) => {
    toggle.addEventListener("change", saveSettings);
  });

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
    const typeEl = document.getElementById("result-type");
    const summaryEl = document.getElementById("result-summary");
    const flagsEl = document.getElementById("result-flags");
    const recsEl = document.getElementById("result-recs");

    header.className = `result-header risk-${risk}`;

    const iconMap = {
      critical: "🚨",
      high: "⚠️",
      moderate: "⚡",
      medium: "⚡",
      low: "🔵",
      safe: "✅"
    };
    icon.textContent = iconMap[risk] || "🔍";
    riskEl.textContent = `${capitalize(result.scamRiskLevel || "Unknown")} Risk`;
    typeEl.textContent = result.contentTypeDetected || "";

    summaryEl.textContent = result.summary || "";

    flagsEl.innerHTML = "";
    if (result.keyRedFlags && result.keyRedFlags.length > 0) {
      result.keyRedFlags.forEach((flag) => {
        const div = document.createElement("div");
        div.className = "flag-item";
        const iconSpan = document.createElement("span");
        iconSpan.className = "flag-icon";
        iconSpan.textContent = "\u25CF";
        const textSpan = document.createElement("span");
        textSpan.textContent = flag;
        div.appendChild(iconSpan);
        div.appendChild(textSpan);
        flagsEl.appendChild(div);
      });
    }

    recsEl.innerHTML = "";
    if (result.recommendedActions && result.recommendedActions.length > 0) {
      result.recommendedActions.slice(0, 3).forEach((rec) => {
        const div = document.createElement("div");
        div.className = "rec-item";
        div.textContent = rec;
        recsEl.appendChild(div);
      });
    }

    scanResult.classList.remove("hidden");
  }

  function displayError(message) {
    const header = document.getElementById("result-header");
    const icon = document.getElementById("result-icon");
    const riskEl = document.getElementById("result-risk");
    const typeEl = document.getElementById("result-type");
    const summaryEl = document.getElementById("result-summary");
    const flagsEl = document.getElementById("result-flags");
    const recsEl = document.getElementById("result-recs");

    header.className = "result-header";
    icon.textContent = "❌";
    riskEl.textContent = "Analysis Error";
    typeEl.textContent = "";
    summaryEl.textContent = message;
    flagsEl.innerHTML = "";
    recsEl.innerHTML = "";
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

  function loadSettings() {
    chrome.runtime.sendMessage({ type: "GET_SETTINGS" }, (settings) => {
      if (settings) {
        document.getElementById("setting-autoscan").checked = settings.autoScan;
        document.getElementById("setting-hover").checked = settings.hoverCheck;
        document.getElementById("setting-notifications").checked = settings.notifications;
        document.getElementById("setting-block").checked = settings.blockDangerous;
      }
    });
  }

  function saveSettings() {
    const settings = {
      autoScan: document.getElementById("setting-autoscan").checked,
      hoverCheck: document.getElementById("setting-hover").checked,
      notifications: document.getElementById("setting-notifications").checked,
      blockDangerous: document.getElementById("setting-block").checked
    };
    chrome.runtime.sendMessage({ type: "SAVE_SETTINGS", settings });
  }

  function extractUrl(text) {
    const match = text.match(/https?:\/\/[^\s<>"{}|\\^`\[\]]+/i);
    return match ? match[0] : null;
  }

  function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
});
