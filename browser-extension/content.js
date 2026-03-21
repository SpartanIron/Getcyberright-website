(function () {
  if (window.__gcrContentLoaded) return;
  window.__gcrContentLoaded = true;

  let tooltipEl = null;
  let currentHoverLink = null;
  let hoverTimeout = null;
  let linkCache = {};
  let settings = { autoScan: true, notifications: true, hoverCheck: true, blockDangerous: false };

  chrome.storage.local.get(["settings"], (result) => {
    if (result.settings) settings = result.settings;
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "SCAN_RESULT") {
      showPageBanner(message.result, message.url);
    }
  });

  function init() {
    if (settings.hoverCheck) {
      document.addEventListener("mouseover", handleLinkHover, true);
      document.addEventListener("mouseout", handleLinkLeave, true);
    }

    if (settings.autoScan) {
      scanVisibleLinks();
    }
  }

  function handleLinkHover(e) {
    const link = e.target.closest("a[href]");
    if (!link || link === currentHoverLink) return;

    currentHoverLink = link;
    const href = link.href;

    if (!href || href.startsWith("javascript:") || href.startsWith("#") || href.startsWith("mailto:")) return;

    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      if (linkCache[href]) {
        showTooltip(link, linkCache[href]);
      } else {
        quickLinkCheck(href, link);
      }
    }, 800);
  }

  function handleLinkLeave() {
    clearTimeout(hoverTimeout);
    currentHoverLink = null;
    hideTooltip();
  }

  async function quickLinkCheck(url, linkEl) {
    try {
      const suspicious = quickSuspicionCheck(url);
      if (suspicious.score > 0) {
        const result = {
          risk: suspicious.score >= 3 ? "high" : suspicious.score >= 2 ? "medium" : "low",
          flags: suspicious.flags,
          quick: true
        };
        linkCache[url] = result;
        showTooltip(linkEl, result);
        markLink(linkEl, result.risk);
      }
    } catch (e) {}
  }

  function quickSuspicionCheck(url) {
    const flags = [];
    let score = 0;

    try {
      const parsed = new URL(url);
      const domain = parsed.hostname.toLowerCase();

      if (domain.length > 40) { flags.push("Unusually long domain"); score += 1; }
      if (/\d{4,}/.test(domain)) { flags.push("Suspicious numeric pattern in domain"); score += 1; }
      if ((domain.match(/\./g) || []).length > 4) { flags.push("Excessive subdomains"); score += 1; }
      if (/-(secure|login|verify|account|update|bank|paypal|amazon|apple|microsoft|google)/.test(domain)) {
        flags.push("Domain mimics trusted brand"); score += 2;
      }
      if (/\.(tk|ml|ga|cf|gq|buzz|top|xyz|click|link|work|date|download|stream|racing|win|bid|trade|webcam|party|review|accountant|science|cricket|faith)\b/.test(domain)) {
        flags.push("High-risk domain extension"); score += 1;
      }
      if (parsed.pathname.length > 100) { flags.push("Unusually long URL path"); score += 1; }
      if (/(%[0-9a-f]{2}){3,}/i.test(url)) { flags.push("Heavy URL encoding detected"); score += 1; }
      if (parsed.searchParams.has("redirect") || parsed.searchParams.has("url") || parsed.searchParams.has("next") || parsed.searchParams.has("goto")) {
        flags.push("Contains redirect parameter"); score += 1;
      }
      if (parsed.protocol === "http:" && /(login|signin|account|password|secure|bank)/i.test(url)) {
        flags.push("Sensitive page without HTTPS"); score += 2;
      }
      if (/(@|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/.test(parsed.hostname)) {
        flags.push("IP address or @ symbol in URL"); score += 2;
      }
    } catch (e) {
      flags.push("Malformed URL");
      score += 2;
    }

    return { score, flags };
  }

  function scanVisibleLinks() {
    const links = document.querySelectorAll("a[href]");
    let flagged = 0;

    links.forEach((link) => {
      const href = link.href;
      if (!href || href.startsWith("javascript:") || href.startsWith("#") || href.startsWith("mailto:")) return;

      const check = quickSuspicionCheck(href);
      if (check.score >= 2) {
        markLink(link, check.score >= 3 ? "high" : "medium");
        linkCache[href] = { risk: check.score >= 3 ? "high" : "medium", flags: check.flags, quick: true };
        flagged++;
      }
    });

    if (flagged > 0) {
      chrome.runtime.sendMessage({
        type: "SCAN_PAGE_LINKS",
        links: Object.keys(linkCache).slice(0, 5)
      });
    }
  }

  function markLink(linkEl, risk) {
    if (linkEl.dataset.gcrChecked) return;
    linkEl.dataset.gcrChecked = "true";

    if (risk === "high" || risk === "critical") {
      linkEl.classList.add("gcr-link-danger");
    } else if (risk === "medium") {
      linkEl.classList.add("gcr-link-warning");
    }
  }

  function showTooltip(linkEl, result) {
    hideTooltip();

    tooltipEl = document.createElement("div");
    tooltipEl.className = "gcr-tooltip";

    const riskClass = result.risk === "high" || result.risk === "critical" ? "gcr-risk-high" :
                      result.risk === "medium" ? "gcr-risk-medium" : "gcr-risk-low";

    tooltipEl.innerHTML = `
      <div class="gcr-tooltip-header ${riskClass}">
        <span class="gcr-tooltip-icon">${result.risk === "high" || result.risk === "critical" ? "⚠️" : result.risk === "medium" ? "⚡" : "✅"}</span>
        <span class="gcr-tooltip-risk">${capitalize(result.risk)} Risk</span>
      </div>
      ${result.flags && result.flags.length > 0 ? `
        <div class="gcr-tooltip-flags">
          ${result.flags.slice(0, 3).map(f => `<div class="gcr-tooltip-flag">• ${f}</div>`).join("")}
        </div>
      ` : ""}
      <div class="gcr-tooltip-footer">
        <span class="gcr-tooltip-brand">GetCyberRight</span>
        ${result.quick ? '<span class="gcr-tooltip-note">Quick check</span>' : ""}
      </div>
    `;

    document.body.appendChild(tooltipEl);

    const rect = linkEl.getBoundingClientRect();
    tooltipEl.style.top = `${window.scrollY + rect.bottom + 8}px`;
    tooltipEl.style.left = `${window.scrollX + rect.left}px`;

    const tooltipRect = tooltipEl.getBoundingClientRect();
    if (tooltipRect.right > window.innerWidth) {
      tooltipEl.style.left = `${window.innerWidth - tooltipRect.width - 16}px`;
    }
  }

  function hideTooltip() {
    if (tooltipEl) {
      tooltipEl.remove();
      tooltipEl = null;
    }
  }

  function showPageBanner(result, url) {
    const existing = document.getElementById("gcr-page-banner");
    if (existing) existing.remove();

    const risk = (result.scamRiskLevel || "").toLowerCase();
    if (risk !== "high" && risk !== "critical") return;

    const banner = document.createElement("div");
    banner.id = "gcr-page-banner";
    banner.className = `gcr-banner gcr-banner-${risk}`;
    banner.innerHTML = `
      <div class="gcr-banner-content">
        <span class="gcr-banner-icon">⚠️</span>
        <div class="gcr-banner-text">
          <strong>GetCyberRight Warning:</strong> This content has been flagged as <strong>${capitalize(risk)} Risk</strong>.
          ${result.summary ? `<p>${result.summary}</p>` : ""}
        </div>
        <button class="gcr-banner-close" id="gcr-banner-close">✕</button>
      </div>
    `;

    document.body.prepend(banner);
    document.getElementById("gcr-banner-close").addEventListener("click", () => banner.remove());
  }

  function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
