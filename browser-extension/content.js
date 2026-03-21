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

    if (settings.blockDangerous) {
      document.addEventListener("click", handleDangerousLinkClick, true);
    }

    if (settings.autoScan) {
      scanVisibleLinks();
    }
  }

  function handleDangerousLinkClick(e) {
    const link = e.target.closest("a[href]");
    if (!link) return;

    const cached = linkCache[link.href];
    if (cached && (cached.risk === "high" || cached.risk === "critical")) {
      e.preventDefault();
      e.stopPropagation();
      showBlockWarning(link.href, cached);
    }
  }

  function showBlockWarning(url, result) {
    const existing = document.getElementById("gcr-block-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "gcr-block-overlay";
    overlay.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;";

    const box = document.createElement("div");
    box.style.cssText = "background:#fff;border-radius:16px;padding:32px;max-width:420px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);";

    const icon = document.createElement("div");
    icon.style.cssText = "font-size:48px;margin-bottom:16px;";
    icon.textContent = "\u26A0\uFE0F";

    const title = document.createElement("h2");
    title.style.cssText = "font-size:20px;font-weight:700;color:#dc2626;margin:0 0 8px;";
    title.textContent = "Dangerous Link Blocked";

    const desc = document.createElement("p");
    desc.style.cssText = "font-size:14px;color:#4b5563;margin:0 0 8px;line-height:1.5;";
    desc.textContent = "GCR Guard has blocked this link because it was flagged as potentially dangerous.";

    const urlDisplay = document.createElement("p");
    urlDisplay.style.cssText = "font-size:12px;color:#9ca3af;word-break:break-all;margin:0 0 20px;padding:8px;background:#f3f4f6;border-radius:8px;";
    urlDisplay.textContent = url;

    const btnRow = document.createElement("div");
    btnRow.style.cssText = "display:flex;gap:12px;justify-content:center;";

    const goBack = document.createElement("button");
    goBack.style.cssText = "padding:10px 24px;background:#0A2A3C;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;";
    goBack.textContent = "Go Back (Safe)";
    goBack.addEventListener("click", () => overlay.remove());

    const proceed = document.createElement("button");
    proceed.style.cssText = "padding:10px 24px;background:#fff;color:#6b7280;border:1px solid #d1d5db;border-radius:8px;font-size:14px;cursor:pointer;";
    proceed.textContent = "Proceed Anyway";
    proceed.addEventListener("click", () => {
      overlay.remove();
      window.open(url, "_blank");
    });

    btnRow.appendChild(goBack);
    btnRow.appendChild(proceed);
    box.appendChild(icon);
    box.appendChild(title);
    box.appendChild(desc);
    box.appendChild(urlDisplay);
    box.appendChild(btnRow);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
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
    const riskIcon = result.risk === "high" || result.risk === "critical" ? "\u26A0\uFE0F" : result.risk === "medium" ? "\u26A1" : "\u2705";

    const header = document.createElement("div");
    header.className = `gcr-tooltip-header ${riskClass}`;
    const iconSpan = document.createElement("span");
    iconSpan.className = "gcr-tooltip-icon";
    iconSpan.textContent = riskIcon;
    const riskSpan = document.createElement("span");
    riskSpan.className = "gcr-tooltip-risk";
    riskSpan.textContent = `${capitalize(result.risk)} Risk`;
    header.appendChild(iconSpan);
    header.appendChild(riskSpan);
    tooltipEl.appendChild(header);

    if (result.flags && result.flags.length > 0) {
      const flagsDiv = document.createElement("div");
      flagsDiv.className = "gcr-tooltip-flags";
      result.flags.slice(0, 3).forEach(f => {
        const flagItem = document.createElement("div");
        flagItem.className = "gcr-tooltip-flag";
        flagItem.textContent = `\u2022 ${f}`;
        flagsDiv.appendChild(flagItem);
      });
      tooltipEl.appendChild(flagsDiv);
    }

    const footer = document.createElement("div");
    footer.className = "gcr-tooltip-footer";
    const brand = document.createElement("span");
    brand.className = "gcr-tooltip-brand";
    brand.textContent = "GetCyberRight";
    footer.appendChild(brand);
    if (result.quick) {
      const note = document.createElement("span");
      note.className = "gcr-tooltip-note";
      note.textContent = "Quick check";
      footer.appendChild(note);
    }
    tooltipEl.appendChild(footer);

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

  function sanitizeText(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function showPageBanner(result, url) {
    const existing = document.getElementById("gcr-page-banner");
    if (existing) existing.remove();

    const risk = (result.scamRiskLevel || "").toLowerCase();
    if (risk !== "high" && risk !== "critical") return;

    const banner = document.createElement("div");
    banner.id = "gcr-page-banner";
    banner.className = `gcr-banner gcr-banner-${risk === "critical" ? "critical" : "high"}`;

    const content = document.createElement("div");
    content.className = "gcr-banner-content";

    const iconSpan = document.createElement("span");
    iconSpan.className = "gcr-banner-icon";
    iconSpan.textContent = "\u26A0\uFE0F";

    const textDiv = document.createElement("div");
    textDiv.className = "gcr-banner-text";
    const strong1 = document.createElement("strong");
    strong1.textContent = "GCR Guard Warning:";
    const riskSpan = document.createElement("strong");
    riskSpan.textContent = `${capitalize(risk)} Risk`;
    textDiv.appendChild(strong1);
    textDiv.appendChild(document.createTextNode(" This content has been flagged as "));
    textDiv.appendChild(riskSpan);
    textDiv.appendChild(document.createTextNode("."));

    if (result.summary) {
      const p = document.createElement("p");
      p.textContent = result.summary;
      textDiv.appendChild(p);
    }

    const closeBtn = document.createElement("button");
    closeBtn.className = "gcr-banner-close";
    closeBtn.textContent = "\u2715";
    closeBtn.addEventListener("click", () => banner.remove());

    content.appendChild(iconSpan);
    content.appendChild(textDiv);
    content.appendChild(closeBtn);
    banner.appendChild(content);
    document.body.prepend(banner);
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
