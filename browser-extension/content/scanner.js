(function () {
  if (window.__gcrContentLoaded) return;
  window.__gcrContentLoaded = true;

  let tooltipEl = null;
  let currentHoverLink = null;
  let hoverTimeout = null;
  let linkCache = {};
  let pageRiskLevel = "unknown";
  let pageRiskScore = 0;
  let userSafeList = [];
  let settings = {
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

  const LOOKALIKE_BRANDS = {
    "paypal": { domain: "paypal.com", registrable: "paypal.com", variants: ["paypa1", "paypai", "paypaI", "paypall", "paypl", "peypal", "paypol", "paypa-l", "p\u0430ypal", "payp\u0430l"] },
    "amazon": { domain: "amazon.com", registrable: "amazon.com", variants: ["amaz0n", "arnazon", "amaazon", "amazom", "am\u0430zon", "\u0430mazon"] },
    "apple": { domain: "apple.com", registrable: "apple.com", variants: ["app1e", "appie", "appIe", "aple", "applle", "\u0430pple", "appl\u0435"] },
    "microsoft": { domain: "microsoft.com", registrable: "microsoft.com", variants: ["micros0ft", "mircosoft", "microsft", "microsoftt", "micr0soft", "m1crosoft"] },
    "google": { domain: "google.com", registrable: "google.com", variants: ["g00gle", "googIe", "gogle", "googlee", "go0gle", "g\u043Cogle"] },
    "facebook": { domain: "facebook.com", registrable: "facebook.com", variants: ["faceb00k", "facebok", "faceboook", "f\u0430cebook", "faceb\u043Cook"] },
    "instagram": { domain: "instagram.com", registrable: "instagram.com", variants: ["instagr\u0430m", "1nstagram", "instaqram", "lnstagram", "instragram", "instagran"] },
    "netflix": { domain: "netflix.com", registrable: "netflix.com", variants: ["netf1ix", "netfIix", "netfilx", "nettflix", "n\u0435tflix"] },
    "chase": { domain: "chase.com", registrable: "chase.com", variants: ["chas3", "chasse", "ch\u0430se"] },
    "wellsfargo": { domain: "wellsfargo.com", registrable: "wellsfargo.com", variants: ["wellsfarg0", "welIsfargo", "w\u0435llsfargo"] },
    "bankofamerica": { domain: "bankofamerica.com", registrable: "bankofamerica.com", variants: ["bank0famerica", "bankofarnerica", "b\u0430nkofamerica"] },
    "citibank": { domain: "citibank.com", registrable: "citibank.com", variants: ["c1tibank", "citlbank", "cit1bank"] },
    "usbank": { domain: "usbank.com", registrable: "usbank.com", variants: ["u5bank"] },
    "dropbox": { domain: "dropbox.com", registrable: "dropbox.com", variants: ["dr0pbox", "dropb0x", "drropbox", "dr\u043Cpbox"] },
    "linkedin": { domain: "linkedin.com", registrable: "linkedin.com", variants: ["1inkedin", "linkedln", "linkdin", "l1nkedin", "linked1n"] },
    "twitter": { domain: "twitter.com", registrable: "twitter.com", variants: ["tw1tter", "twtter", "twltter", "tw\u0456tter"] },
    "walmart": { domain: "walmart.com", registrable: "walmart.com", variants: ["wa1mart", "walmrat", "walm\u0430rt", "walmort"] },
    "ebay": { domain: "ebay.com", registrable: "ebay.com", variants: ["3bay", "ebav", "eebay", "\u0435bay"] },
    "dhl": { domain: "dhl.com", registrable: "dhl.com", variants: ["dh1", "dhI"] },
    "fedex": { domain: "fedex.com", registrable: "fedex.com", variants: ["f3dex", "fed3x", "f\u0435dex"] },
    "ups": { domain: "ups.com", registrable: "ups.com", variants: ["up5"] },
    "usps": { domain: "usps.com", registrable: "usps.com", variants: ["u5ps"] },
    "steam": { domain: "store.steampowered.com", registrable: "steampowered.com", variants: ["steamcommunlty", "stearnpowered", "st3am", "stearn"] },
    "discord": { domain: "discord.com", registrable: "discord.com", variants: ["disc0rd", "dlscord", "discrod", "d1scord"] },
    "twitch": { domain: "twitch.tv", registrable: "twitch.tv", variants: ["tw1tch", "twitcch", "twltch"] },
    "coinbase": { domain: "coinbase.com", registrable: "coinbase.com", variants: ["c0inbase", "coinbas3", "co1nbase"] },
    "binance": { domain: "binance.com", registrable: "binance.com", variants: ["b1nance", "blnance", "bin\u0430nce"] },
    "metamask": { domain: "metamask.io", registrable: "metamask.io", variants: ["m3tamask", "metarnask", "met\u0430mask"] },
    "stripe": { domain: "stripe.com", registrable: "stripe.com", variants: ["str1pe", "strlpe", "str\u0456pe"] },
    "venmo": { domain: "venmo.com", registrable: "venmo.com", variants: ["v3nmo", "venrno", "v\u0435nmo"] },
    "zelle": { domain: "zellepay.com", registrable: "zellepay.com", variants: ["z3lle", "zele", "z\u0435lle"] },
    "att": { domain: "att.com", registrable: "att.com", variants: [] },
    "verizon": { domain: "verizon.com", registrable: "verizon.com", variants: ["ver1zon", "verlzon", "veriz0n"] },
    "tmobile": { domain: "t-mobile.com", registrable: "t-mobile.com", variants: ["tmob1le", "t-mob1le", "t-mobil\u0435"] },
    "costco": { domain: "costco.com", registrable: "costco.com", variants: ["c0stco", "costc0"] },
    "target": { domain: "target.com", registrable: "target.com", variants: ["t\u0430rget", "targ3t"] },
    "bestbuy": { domain: "bestbuy.com", registrable: "bestbuy.com", variants: ["b3stbuy", "bestbuv"] },
    "homedepot": { domain: "homedepot.com", registrable: "homedepot.com", variants: ["h0medepot", "hom3depot"] },
    "capitalone": { domain: "capitalone.com", registrable: "capitalone.com", variants: ["capita1one", "capitalon3", "capit\u0430lone"] },
    "americanexpress": { domain: "americanexpress.com", registrable: "americanexpress.com", variants: ["american3xpress"] },
    "irs": { domain: "irs.gov", registrable: "irs.gov", variants: ["1rs"] },
    "docusign": { domain: "docusign.com", registrable: "docusign.com", variants: ["d0cusign", "docuslgn"] },
    "adobe": { domain: "adobe.com", registrable: "adobe.com", variants: ["ad0be", "adobee", "\u0430dobe"] },
    "zoom": { domain: "zoom.us", registrable: "zoom.us", variants: ["z00m", "zo0m", "zoorn"] },
    "outlook": { domain: "outlook.com", registrable: "outlook.com", variants: ["0utlook", "outl00k", "out1ook"] },
    "yahoo": { domain: "yahoo.com", registrable: "yahoo.com", variants: ["yah00", "yaho0", "yah\u043Co"] },
    "citi": { domain: "citi.com", registrable: "citi.com", variants: ["c1ti", "citl"] },
    "hsbc": { domain: "hsbc.com", registrable: "hsbc.com", variants: ["h5bc", "hs8c"] },
    "barclays": { domain: "barclays.co.uk", registrable: "barclays.co.uk", variants: ["barcl\u0430ys", "barc1ays", "barclay5"] }
  };

  const WEBMAIL_PATTERNS = [
    { pattern: /mail\.google\.com/, name: "Gmail", emailSelector: ".a3s.aiL, .ii.gt", subjectSelector: "h2.hP", senderSelector: ".gD" },
    { pattern: /outlook\.live\.com|outlook\.office\.com|outlook\.office365\.com/, name: "Outlook", emailSelector: "[role='document'] .XbIp4, .wide-content-host", subjectSelector: "[role='heading']", senderSelector: ".lDdSm" }
  ];

  function getRegistrableDomain(hostname) {
    const parts = hostname.toLowerCase().replace(/^www\./, "").split(".");
    if (parts.length <= 2) return parts.join(".");
    const knownCcTlds = ["co.uk", "com.au", "co.nz", "co.za", "com.br", "co.jp", "co.in"];
    const lastTwo = parts.slice(-2).join(".");
    if (knownCcTlds.includes(lastTwo)) {
      return parts.slice(-3).join(".");
    }
    return parts.slice(-2).join(".");
  }

  function isLegitSubdomainOf(hostname, brandRegistrable) {
    const hostRegistrable = getRegistrableDomain(hostname);
    return hostRegistrable === brandRegistrable;
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "SCAN_RESULT") {
      showPageBanner(message.result, message.url);
    }
    if (message.type === "AUTO_SCAN_RESULT") {
      handleAutoScanResult(message.result);
    }
    if (message.type === "SHOW_REPORT_FORM") {
      showReportForm(message.url);
    }
  });

  let allowedFeatures = ["manual_scan"];

  function loadSettingsAndInit() {
    chrome.storage.local.get(["settings", "userSafeList"], (result) => {
      if (result.settings) {
        settings = { ...settings, ...result.settings };
      }
      if (result.userSafeList && Array.isArray(result.userSafeList)) {
        userSafeList = result.userSafeList;
      }
      chrome.runtime.sendMessage({ type: "GET_AUTH_STATUS" }, (status) => {
        if (status && status.features) {
          allowedFeatures = status.isActive !== false ? status.features : ["manual_scan"];
        }
        init();
      });
    });
  }

  function hasFeature(feature) {
    return allowedFeatures.includes(feature);
  }

  const SUSPICIOUS_KEYWORDS = [
    "login", "verify", "secure", "account", "update", "confirm",
    "signin", "sign-in", "banking", "password", "credential",
    "wallet", "suspend", "unlock", "restore", "validate"
  ];

  function isSuspiciousURL(url) {
    if (!url) return { suspicious: false, score: 0, reasons: [] };
    try {
      const parsed = new URL(url);
      const reasons = [];
      let score = 0;

      if (parsed.protocol !== "https:") {
        reasons.push("Non-HTTPS connection");
        score += 30;
      }

      const fullUrl = parsed.hostname + parsed.pathname;
      for (const keyword of SUSPICIOUS_KEYWORDS) {
        if (fullUrl.toLowerCase().includes(keyword)) {
          const hostname = parsed.hostname.toLowerCase();
          const isWellKnown = isDomainFamiliar(hostname);
          if (!isWellKnown) {
            reasons.push(`Contains suspicious keyword: "${keyword}"`);
            score += 15;
            break;
          }
        }
      }

      if (parsed.hostname.split(".").length > 4) {
        reasons.push("Excessive subdomains");
        score += 20;
      }

      if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(parsed.hostname)) {
        reasons.push("IP address instead of domain");
        score += 25;
      }

      return { suspicious: score > 0, score: Math.min(score, 100), reasons };
    } catch {
      return { suspicious: false, score: 0, reasons: [] };
    }
  }

  function analyzeForms() {
    const forms = document.querySelectorAll("form");
    const results = [];

    forms.forEach((form, index) => {
      const action = form.getAttribute("action") || "";
      const method = (form.getAttribute("method") || "GET").toUpperCase();
      const hasPassword = form.querySelector('input[type="password"]') !== null;
      const hasCreditCard = form.querySelector('input[autocomplete*="cc-"], input[name*="card"], input[name*="credit"], input[name*="cvv"], input[name*="cvc"]') !== null;
      const hasEmail = form.querySelector('input[type="email"], input[name*="email"]') !== null;
      const hasSensitiveData = hasPassword || hasCreditCard || hasEmail;
      const risks = [];
      let riskScore = 0;

      if (action && action.startsWith("http://")) {
        risks.push("Form submits over insecure HTTP");
        riskScore += 40;
      }

      if (action) {
        const urlCheck = isSuspiciousURL(action);
        if (urlCheck.suspicious) {
          risks.push(...urlCheck.reasons.map(r => `Form action: ${r}`));
          riskScore += urlCheck.score;
        }
      }

      if (hasSensitiveData && action && action.startsWith("http://")) {
        risks.push("Sensitive data submitted over insecure connection");
        riskScore += 30;
      }

      if (hasPassword && !window.location.protocol.startsWith("https")) {
        risks.push("Password field on non-HTTPS page");
        riskScore += 35;
      }

      let riskLevel = "safe";
      if (riskScore >= 70) riskLevel = "high";
      else if (riskScore >= 30) riskLevel = "medium";
      else if (riskScore > 0) riskLevel = "low";

      results.push({
        index,
        action: action || "(same page)",
        method,
        hasPassword,
        hasCreditCard,
        hasEmail,
        hasSensitiveData,
        risks,
        riskScore: Math.min(riskScore, 100),
        riskLevel
      });
    });

    return results;
  }

  function init() {
    if (settings.hoverCheck && hasFeature("hover_check")) {
      document.addEventListener("mouseover", handleLinkHover, true);
      document.addEventListener("mouseout", handleLinkLeave, true);
    }

    if (settings.blockDangerous && hasFeature("block_dangerous")) {
      document.addEventListener("click", handleDangerousLinkClick, true);
    }

    if (settings.autoScan && hasFeature("auto_scan")) {
      scanVisibleLinks();
    }

    if (settings.lookalikeDetection && hasFeature("lookalike_detection")) {
      checkLookalikeDomain();
    }

    if (settings.formWarnings && hasFeature("form_warnings")) {
      setupFormInterception();
    }

    if (settings.autoScan && hasFeature("auto_scan")) {
      triggerAutoScan();
    }

    if (settings.communityTrust && hasFeature("community_trust")) {
      showCommunityTrustBadge();
    }

    if (settings.webmailScan && hasFeature("webmail_scan")) {
      initWebmailScanning();
    }
  }

  function triggerAutoScan() {
    const url = window.location.href;
    if (!url || url === "about:blank") return;

    const lookalikeMatch = settings.lookalikeDetection ? detectLookalike(url) : null;

    let pageInfo = null;
    try {
      const title = document.title || "";
      const meta = document.querySelector('meta[name="description"]')?.content || "";
      const headings = Array.from(document.querySelectorAll("h1, h2")).slice(0, 5).map(h => h.textContent.trim()).join(" | ");
      const forms = document.querySelectorAll("form").length;
      const passwordFields = document.querySelectorAll('input[type="password"]').length;
      const bodyText = document.body?.innerText?.substring(0, 1000) || "";
      const links = Array.from(document.querySelectorAll("a[href]")).slice(0, 15).map(a => a.href);
      const pageHost = new URL(url).hostname;
      const externalLinks = links.filter(l => { try { return new URL(l).hostname !== pageHost; } catch { return false; } }).slice(0, 8).join(", ");

      const formAnalysis = analyzeForms();
      const riskyForms = formAnalysis.filter(f => f.riskLevel !== "safe");
      const urlAnalysis = isSuspiciousURL(url);

      pageInfo = {
        title, meta, headings, forms, passwordFields, bodyText, externalLinks,
        riskyForms: riskyForms.length,
        urlSuspicious: urlAnalysis.suspicious,
        urlReasons: urlAnalysis.reasons
      };
    } catch (e) {}

    chrome.runtime.sendMessage({
      type: "PAGE_LOADED",
      url: url,
      pageInfo: pageInfo,
      lookalikeMatch: lookalikeMatch
    });
  }

  function handleAutoScanResult(result) {
    if (!result) return;
    pageRiskLevel = result.riskLevel || "unknown";
    pageRiskScore = result.riskScore || 0;

    if (result.riskLevel === "critical" || result.riskLevel === "high") {
      showAutoScanBanner(result);
    }
  }

  function showAutoScanBanner(result) {
    const existing = document.getElementById("gcr-autoscan-banner");
    if (existing) existing.remove();

    const banner = document.createElement("div");
    banner.id = "gcr-autoscan-banner";
    banner.className = `gcr-banner gcr-banner-${result.riskLevel === "critical" ? "critical" : "high"}`;

    const content = document.createElement("div");
    content.className = "gcr-banner-content";

    const iconSpan = document.createElement("span");
    iconSpan.className = "gcr-banner-icon";
    iconSpan.textContent = result.riskLevel === "critical" ? "\uD83D\uDEA8" : "\u26A0\uFE0F";

    const textDiv = document.createElement("div");
    textDiv.className = "gcr-banner-text";

    const strong1 = document.createElement("strong");
    strong1.textContent = "GCR Guard Auto-Scan:";
    const riskSpan = document.createElement("strong");
    riskSpan.textContent = ` ${capitalize(result.riskLevel)} Risk`;
    textDiv.appendChild(strong1);
    textDiv.appendChild(riskSpan);

    const sources = [];
    if (result.lookalikeMatch) sources.push("Lookalike domain detected");
    if (result.reputation?.phishTank?.isPhishing) sources.push("PhishTank flagged");
    if (result.reputation?.urlhaus?.isMalware) sources.push("Malware database flagged");
    if (result.reputation?.googleSafeBrowsing?.isThreat) sources.push("Google Safe Browsing flagged");
    if (result.aiScan?.summary) sources.push(result.aiScan.summary);

    if (sources.length > 0) {
      const p = document.createElement("p");
      p.textContent = sources.join(" \u2022 ");
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

  function detectLookalike(url) {
    try {
      const hostname = new URL(url).hostname.toLowerCase();
      const hostRegistrable = getRegistrableDomain(hostname);

      for (const [brandName, brandInfo] of Object.entries(LOOKALIKE_BRANDS)) {
        if (isLegitSubdomainOf(hostname, brandInfo.registrable)) continue;

        const hostBase = hostRegistrable.split(".")[0];

        for (const variant of brandInfo.variants) {
          if (variant.length < 4) continue;
          if (hostBase === variant.toLowerCase() || hostRegistrable.startsWith(variant.toLowerCase() + ".")) {
            return {
              brand: brandName,
              realDomain: brandInfo.domain,
              matchedVariant: variant,
              message: `This domain looks like it's impersonating ${capitalize(brandName)} (${brandInfo.domain}). The real site is ${brandInfo.domain}.`
            };
          }
        }

        const brandDomainBase = brandInfo.registrable.split(".")[0];
        if (hostBase.length > 4 && brandDomainBase.length > 4) {
          const similarity = calculateSimilarity(hostBase, brandDomainBase);
          if (similarity >= 0.8 && similarity < 1.0 && hostBase !== brandDomainBase) {
            return {
              brand: brandName,
              realDomain: brandInfo.domain,
              matchedVariant: hostBase,
              similarity: similarity,
              message: `This domain "${hostname}" is suspiciously similar to ${capitalize(brandName)} (${brandInfo.domain}).`
            };
          }
        }
      }
    } catch (e) {}
    return null;
  }

  function calculateSimilarity(a, b) {
    if (a === b) return 1.0;
    const len = Math.max(a.length, b.length);
    if (len === 0) return 1.0;
    const dist = levenshteinDistance(a, b);
    return 1 - dist / len;
  }

  function levenshteinDistance(a, b) {
    const m = a.length;
    const n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    return dp[m][n];
  }

  function checkLookalikeDomain() {
    const match = detectLookalike(window.location.href);
    if (match) {
      showLookalikeBanner(match);
    }
  }

  function showLookalikeBanner(match) {
    const existing = document.getElementById("gcr-lookalike-banner");
    if (existing) existing.remove();

    const banner = document.createElement("div");
    banner.id = "gcr-lookalike-banner";
    banner.className = "gcr-banner gcr-banner-critical";

    const content = document.createElement("div");
    content.className = "gcr-banner-content";

    const iconSpan = document.createElement("span");
    iconSpan.className = "gcr-banner-icon";
    iconSpan.textContent = "\uD83D\uDEA8";

    const textDiv = document.createElement("div");
    textDiv.className = "gcr-banner-text";

    const strong1 = document.createElement("strong");
    strong1.textContent = "Lookalike Domain Detected!";
    textDiv.appendChild(strong1);

    const msgP = document.createElement("p");
    msgP.textContent = match.message;
    textDiv.appendChild(msgP);

    const linkP = document.createElement("p");
    const safeLink = document.createElement("a");
    safeLink.href = `https://${match.realDomain}`;
    safeLink.textContent = `Go to the real ${capitalize(match.brand)} site \u2192`;
    safeLink.style.cssText = "color: #93c5fd; text-decoration: underline; font-weight: 600;";
    linkP.appendChild(safeLink);
    textDiv.appendChild(linkP);

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

  function setupFormInterception() {
    document.addEventListener("submit", handleFormSubmit, true);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) {
            const forms = node.tagName === "FORM" ? [node] : node.querySelectorAll ? Array.from(node.querySelectorAll("form")) : [];
            forms.forEach(form => {
              if (!form.dataset.gcrMonitored) {
                form.dataset.gcrMonitored = "true";
                form.addEventListener("submit", handleFormSubmit, true);
              }
            });
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.querySelectorAll("form").forEach(form => {
      if (!form.dataset.gcrMonitored) {
        form.dataset.gcrMonitored = "true";
        form.addEventListener("submit", handleFormSubmit, true);
      }
    });
  }

  function isDomainFamiliar(hostname) {
    const wellKnown = [
      "google.com", "youtube.com", "facebook.com", "amazon.com", "apple.com",
      "microsoft.com", "github.com", "stackoverflow.com", "wikipedia.org",
      "twitter.com", "x.com", "linkedin.com", "reddit.com", "instagram.com",
      "netflix.com", "paypal.com", "ebay.com", "yahoo.com", "bing.com",
      "outlook.com", "live.com", "office.com", "zoom.us", "slack.com",
      "dropbox.com", "salesforce.com", "adobe.com", "spotify.com"
    ];
    const registrable = getRegistrableDomain(hostname);
    if (wellKnown.includes(registrable)) return true;
    if (userSafeList.some(d => getRegistrableDomain(d) === registrable)) return true;
    return false;
  }

  function handleFormSubmit(e) {
    if (e.target.__gcrAllowed) return;

    const form = e.target;
    const hasPasswordField = form.querySelector('input[type="password"]') !== null;
    const hasCreditCardField = form.querySelector('input[autocomplete*="cc-"], input[name*="card"], input[name*="credit"], input[name*="cvv"], input[name*="cvc"]') !== null;
    const hasEmailField = form.querySelector('input[type="email"], input[name*="email"]') !== null;
    const hasSensitiveData = hasPasswordField || hasCreditCardField || hasEmailField;

    const isHighRisk = pageRiskLevel === "critical" || pageRiskLevel === "high";
    const isMediumRisk = pageRiskLevel === "medium";
    const hostname = window.location.hostname;
    const isUnfamiliar = !isDomainFamiliar(hostname) && (pageRiskLevel === "unknown" || pageRiskLevel === "low");
    const shouldWarn = isHighRisk || isMediumRisk || (isUnfamiliar && hasSensitiveData);

    if (!shouldWarn) return;

    const effectiveRisk = isHighRisk ? pageRiskLevel : isMediumRisk ? "medium" : "low";

    e.preventDefault();
    e.stopPropagation();
    showFormWarning(form, effectiveRisk, pageRiskScore, { hasPasswordField, hasCreditCardField, hasEmailField });
  }

  function showFormWarning(form, riskLevel, riskScore, sensitiveFields) {
    const existing = document.getElementById("gcr-form-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "gcr-form-overlay";
    overlay.className = "gcr-form-overlay";

    const box = document.createElement("div");
    box.className = "gcr-form-warning-box";

    const iconDiv = document.createElement("div");
    iconDiv.className = "gcr-form-warning-icon";
    iconDiv.textContent = riskLevel === "critical" ? "\uD83D\uDEA8" : "\u26A0\uFE0F";

    const title = document.createElement("h2");
    title.className = "gcr-form-warning-title";
    title.textContent = "Hold On \u2014 This Page Is Flagged";

    const riskTag = document.createElement("span");
    riskTag.className = `gcr-form-risk-tag gcr-form-risk-${riskLevel}`;
    riskTag.textContent = `${capitalize(riskLevel)} Risk`;

    const desc = document.createElement("p");
    desc.className = "gcr-form-warning-desc";

    let warningText = "GCR Guard has flagged this page as potentially dangerous. ";
    if (sensitiveFields.hasPasswordField) {
      warningText += "You're about to submit a password on this page. ";
    }
    if (sensitiveFields.hasCreditCardField) {
      warningText += "You're about to submit payment information on this page. ";
    }
    if (sensitiveFields.hasEmailField) {
      warningText += "You're about to submit your email address on this page. ";
    }
    warningText += "Are you sure you want to proceed?";
    desc.textContent = warningText;

    const urlDisplay = document.createElement("div");
    urlDisplay.className = "gcr-form-url-display";
    urlDisplay.textContent = window.location.hostname;

    const btnRow = document.createElement("div");
    btnRow.className = "gcr-form-btn-row";

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "gcr-form-btn gcr-form-btn-safe";
    cancelBtn.textContent = "Don't Submit (Safe)";
    cancelBtn.addEventListener("click", () => overlay.remove());

    const proceedBtn = document.createElement("button");
    proceedBtn.className = "gcr-form-btn gcr-form-btn-proceed";
    proceedBtn.textContent = "Submit Anyway";
    proceedBtn.addEventListener("click", () => {
      overlay.remove();
      form.__gcrAllowed = true;
      if (form.requestSubmit) {
        form.requestSubmit();
      } else {
        form.submit();
      }
    });

    const trustBtn = document.createElement("button");
    trustBtn.className = "gcr-form-btn gcr-form-btn-trust";
    trustBtn.textContent = "Trust This Site";
    trustBtn.addEventListener("click", () => {
      const domain = getRegistrableDomain(window.location.hostname);
      if (domain && !userSafeList.includes(domain)) {
        userSafeList.push(domain);
        chrome.storage.local.set({ userSafeList });
      }
      overlay.remove();
      form.__gcrAllowed = true;
      if (form.requestSubmit) {
        form.requestSubmit();
      } else {
        form.submit();
      }
    });

    const brandFooter = document.createElement("div");
    brandFooter.className = "gcr-form-brand";
    brandFooter.textContent = "Protected by GCR Guard \u2022 GetCyberRight";

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(trustBtn);
    btnRow.appendChild(proceedBtn);
    box.appendChild(iconDiv);
    box.appendChild(title);
    box.appendChild(riskTag);
    box.appendChild(desc);
    box.appendChild(urlDisplay);
    box.appendChild(btnRow);
    box.appendChild(brandFooter);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
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
    overlay.className = "gcr-form-overlay";

    const box = document.createElement("div");
    box.className = "gcr-form-warning-box";

    const icon = document.createElement("div");
    icon.className = "gcr-form-warning-icon";
    icon.textContent = "\u26A0\uFE0F";

    const title = document.createElement("h2");
    title.className = "gcr-form-warning-title";
    title.textContent = "Dangerous Link Blocked";

    const desc = document.createElement("p");
    desc.className = "gcr-form-warning-desc";
    desc.textContent = "GCR Guard has blocked this link because it was flagged as potentially dangerous.";

    const urlDisplay = document.createElement("div");
    urlDisplay.className = "gcr-form-url-display";
    urlDisplay.textContent = url;

    const btnRow = document.createElement("div");
    btnRow.className = "gcr-form-btn-row";

    const goBack = document.createElement("button");
    goBack.className = "gcr-form-btn gcr-form-btn-safe";
    goBack.textContent = "Go Back (Safe)";
    goBack.addEventListener("click", () => overlay.remove());

    const proceed = document.createElement("button");
    proceed.className = "gcr-form-btn gcr-form-btn-proceed";
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
      const lookalike = settings.lookalikeDetection ? detectLookalike(url) : null;

      if (lookalike) {
        suspicious.score += 3;
        suspicious.flags.push(`Impersonates ${capitalize(lookalike.brand)} (${lookalike.realDomain})`);
      }

      if (suspicious.score > 0) {
        const result = {
          risk: suspicious.score >= 3 ? "high" : suspicious.score >= 2 ? "medium" : "low",
          flags: suspicious.flags,
          quick: true,
          lookalike: lookalike
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

      const lookalike = settings.lookalikeDetection ? detectLookalike(href) : null;
      const check = quickSuspicionCheck(href);

      if (lookalike) {
        check.score += 3;
        check.flags.push(`Impersonates ${capitalize(lookalike.brand)}`);
      }

      if (check.score >= 2) {
        markLink(link, check.score >= 3 ? "high" : "medium");
        linkCache[href] = { risk: check.score >= 3 ? "high" : "medium", flags: check.flags, quick: true, lookalike: lookalike };
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

    if (result.lookalike) {
      const lookalikeBadge = document.createElement("span");
      lookalikeBadge.className = "gcr-tooltip-lookalike-badge";
      lookalikeBadge.textContent = "LOOKALIKE";
      header.appendChild(lookalikeBadge);
    }

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

  function showCommunityTrustBadge() {
    const hostname = window.location.hostname;
    if (!hostname) return;

    chrome.runtime.sendMessage({ type: "GET_COMMUNITY_TRUST", domain: hostname }, (data) => {
      if (chrome.runtime.lastError) return;
      if (!data) return;

      const existing = document.getElementById("gcr-trust-badge");
      if (existing) existing.remove();

      const badge = document.createElement("div");
      badge.id = "gcr-trust-badge";
      badge.className = "gcr-trust-badge";

      const visitCount = data.visitCount || 0;
      const flagCount = data.flagCount || 0;
      const safeCount = data.safeCount || 0;
      const score = data.communityScore ?? 50;

      let scoreColor = "#16a34a";
      let scoreLabel = "Trusted";
      if (score < 30) {
        scoreColor = "#dc2626";
        scoreLabel = "Risky";
      } else if (score < 60) {
        scoreColor = "#ca8a04";
        scoreLabel = "Caution";
      } else if (visitCount === 0) {
        scoreColor = "#6b7280";
        scoreLabel = "New Site";
      }

      let communityText = "";
      if (visitCount === 0) {
        communityText = "No community data yet";
      } else {
        const parts = [];
        if (safeCount > 0) parts.push(`${safeCount} visited safely`);
        if (flagCount > 0) parts.push(`${flagCount} flagged`);
        if (parts.length === 0) parts.push(`${visitCount} visit${visitCount !== 1 ? "s" : ""}`);
        communityText = parts.join(" \u2022 ");
      }

      badge.style.cssText = `
        position: fixed;
        bottom: 16px;
        right: 16px;
        z-index: 2147483646;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 8px 14px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
        gap: 2px;
        cursor: pointer;
        transition: opacity 0.3s;
        opacity: 0.85;
        max-width: 220px;
      `;

      badge.addEventListener("mouseenter", () => { badge.style.opacity = "1"; });
      badge.addEventListener("mouseleave", () => { badge.style.opacity = "0.85"; });

      const topRow = document.createElement("div");
      topRow.style.cssText = "display: flex; align-items: center; gap: 8px;";

      const dot = document.createElement("span");
      dot.style.cssText = `width: 8px; height: 8px; border-radius: 50%; background: ${scoreColor}; flex-shrink: 0;`;

      const text = document.createElement("span");
      text.style.cssText = `color: #374151; font-weight: 600;`;
      text.textContent = `${scoreLabel} (${score}/100)`;

      const brandEl = document.createElement("span");
      brandEl.style.cssText = "color: #9ca3af; font-size: 10px; margin-left: auto;";
      brandEl.textContent = "GCR";

      topRow.appendChild(dot);
      topRow.appendChild(text);
      topRow.appendChild(brandEl);

      const bottomRow = document.createElement("div");
      bottomRow.style.cssText = "font-size: 10px; color: #6b7280; padding-left: 16px;";
      bottomRow.textContent = communityText;

      badge.appendChild(topRow);
      badge.appendChild(bottomRow);

      let dismissTimeout;
      badge.addEventListener("click", () => {
        badge.style.opacity = "0";
        setTimeout(() => badge.remove(), 300);
      });

      document.body.appendChild(badge);

      dismissTimeout = setTimeout(() => {
        if (badge.parentNode) {
          badge.style.opacity = "0";
          setTimeout(() => { if (badge.parentNode) badge.remove(); }, 300);
        }
      }, 8000);
    });
  }

  function initWebmailScanning() {
    const url = window.location.href;
    const matchedProvider = WEBMAIL_PATTERNS.find(p => p.pattern.test(url));
    if (!matchedProvider) return;

    const observer = new MutationObserver(() => {
      injectWebmailScanButtons(matchedProvider);
      injectInboxRiskIndicators(matchedProvider);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => {
      injectWebmailScanButtons(matchedProvider);
      injectInboxRiskIndicators(matchedProvider);
    }, 2000);
  }

  function injectInboxRiskIndicators(provider) {
    const providerLower = provider.name.toLowerCase();
    const rowSelector = providerLower === "gmail" ? "tr.zA" : "[role='option'], [data-convid]";
    const rows = document.querySelectorAll(rowSelector);
    rows.forEach(row => {
      if (row.dataset.gcrInboxScanned) return;
      row.dataset.gcrInboxScanned = "true";

      const links = row.querySelectorAll("a[href]");
      const suspiciousLinks = [];
      const domainsToCheck = new Set();
      links.forEach(link => {
        const href = link.getAttribute("href") || "";
        if (!href.startsWith("http")) return;
        try {
          const hostname = new URL(href).hostname;
          domainsToCheck.add(hostname);
          const lookalikeResult = detectLookalikeHostname(hostname);
          if (lookalikeResult) {
            suspiciousLinks.push({ href, match: lookalikeResult, reason: "lookalike" });
          }
        } catch (e) {}
      });

      const senderEl = row.querySelector(provider.senderSelector);
      const senderEmail = senderEl?.getAttribute("email") || senderEl?.textContent || "";
      const senderDomainMatch = senderEmail.match(/@([a-zA-Z0-9.-]+)/);
      if (senderDomainMatch) {
        const senderDomain = senderDomainMatch[1];
        domainsToCheck.add(senderDomain);
        const senderLookalike = detectLookalikeHostname(senderDomain);
        if (senderLookalike) {
          suspiciousLinks.push({ href: senderEmail, match: senderLookalike, reason: "sender-lookalike" });
        }
      }

      const uniqueDomains = [...domainsToCheck];
      let trustChecksComplete = 0;
      const riskyDomains = [];

      if (uniqueDomains.length === 0 && suspiciousLinks.length === 0) return;

      if (suspiciousLinks.length > 0) {
        addInboxIndicator(row, provider, suspiciousLinks.length, "lookalike", suspiciousLinks);
      }

      uniqueDomains.forEach(domain => {
        chrome.runtime.sendMessage({ type: "GET_COMMUNITY_TRUST", domain }, (data) => {
          trustChecksComplete++;
          if (data && data.communityScore < 30 && data.visitCount > 0) {
            riskyDomains.push({ domain, score: data.communityScore, flagCount: data.flagCount });
          }
          if (trustChecksComplete === uniqueDomains.length && riskyDomains.length > 0) {
            addInboxIndicator(row, provider, riskyDomains.length, "community", riskyDomains);
          }
        });
      });
    });
  }

  function addInboxIndicator(row, provider, count, type, details) {
    const existingClass = type === "lookalike" ? ".gcr-inbox-lookalike" : ".gcr-inbox-community";
    if (row.querySelector(existingClass)) return;

    const indicator = document.createElement("span");
    indicator.className = `gcr-inbox-risk-indicator ${type === "lookalike" ? "gcr-inbox-lookalike" : "gcr-inbox-community"}`;

    const tooltipParts = [];
    if (type === "lookalike") {
      tooltipParts.push(`${count} suspicious link(s) with lookalike domains detected`);
    } else {
      details.forEach(d => tooltipParts.push(`${d.domain}: community score ${d.score}/100, flagged ${d.flagCount} times`));
    }
    indicator.title = `GCR Guard: ${tooltipParts.join("; ")}`;

    const bgColor = type === "lookalike" ? "#fef2f2" : "#fffbeb";
    const borderColor = type === "lookalike" ? "#fca5a5" : "#fcd34d";
    const textColor = type === "lookalike" ? "#dc2626" : "#b45309";
    const icon = type === "lookalike" ? "\u26A0\uFE0F" : "\uD83D\uDEE1\uFE0F";

    indicator.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 3px;
      background: ${bgColor};
      border: 1px solid ${borderColor};
      border-radius: 4px;
      padding: 1px 6px;
      font-size: 10px;
      font-weight: 600;
      color: ${textColor};
      margin-left: 6px;
      cursor: help;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;
    indicator.textContent = `${icon} ${count} ${type === "lookalike" ? "risky" : "flagged"}`;

    const providerLower = provider.name.toLowerCase();
    const subjectCell = providerLower === "gmail"
      ? row.querySelector(".bog, .bqe, .y6")
      : row.querySelector("[data-testid='subjectLine'], .hcptT");
    if (subjectCell) {
      subjectCell.appendChild(indicator);
    } else {
      const firstCell = row.querySelector("td:nth-child(3), td:nth-child(4)") || row.firstElementChild;
      if (firstCell) firstCell.appendChild(indicator);
    }
  }

  function detectLookalikeHostname(hostname) {
    const cleanDomain = hostname.toLowerCase().replace(/^www\./, "");
    for (const [brand, info] of Object.entries(LOOKALIKE_BRANDS)) {
      if (cleanDomain === info.domain || cleanDomain === info.registrable) continue;
      if (cleanDomain.endsWith("." + info.registrable)) continue;
      for (const variant of info.variants) {
        if (cleanDomain.includes(variant)) {
          return { brand, variant, legitimateDomain: info.domain };
        }
      }
      if (cleanDomain.includes(brand) && !cleanDomain.endsWith(info.registrable)) {
        return { brand, variant: brand, legitimateDomain: info.domain };
      }
    }
    return null;
  }

  function injectWebmailScanButtons(provider) {
    const emailBodies = document.querySelectorAll(provider.emailSelector);
    emailBodies.forEach(body => {
      if (body.dataset.gcrWebmailScanned) return;
      body.dataset.gcrWebmailScanned = "true";

      const container = body.closest("[role='listitem']") || body.parentElement;
      if (!container) return;

      const existing = container.querySelector(".gcr-webmail-scan-btn");
      if (existing) return;

      const btn = document.createElement("button");
      btn.className = "gcr-webmail-scan-btn";
      btn.textContent = "Scan with GCR";
      btn.style.cssText = `
        background: linear-gradient(135deg, #0A2A3C, #0d3a52);
        color: white;
        border: none;
        border-radius: 6px;
        padding: 4px 10px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        margin: 4px 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        transition: all 0.2s;
      `;

      btn.addEventListener("mouseenter", () => {
        btn.style.background = "linear-gradient(135deg, #0d3a52, #0f4a6a)";
        btn.style.transform = "translateY(-1px)";
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.background = "linear-gradient(135deg, #0A2A3C, #0d3a52)";
        btn.style.transform = "translateY(0)";
      });

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        const emailText = body.innerText?.substring(0, 2000) || "";
        let subject = "";
        let sender = "";
        try {
          const subjectEl = container.querySelector(provider.subjectSelector);
          subject = subjectEl?.textContent?.trim() || "";
          const senderEl = container.querySelector(provider.senderSelector);
          sender = senderEl?.textContent?.trim() || senderEl?.getAttribute("email") || "";
        } catch (err) {}

        const content = [
          subject ? `Subject: ${subject}` : "",
          sender ? `From: ${sender}` : "",
          `Email Body: ${emailText}`
        ].filter(Boolean).join("\n");

        btn.textContent = "Scanning...";
        btn.disabled = true;

        chrome.runtime.sendMessage({ type: "SCAN_WEBMAIL", content }, (response) => {
          btn.disabled = false;
          if (response?.success && response.result) {
            const risk = (response.result.scamRiskLevel || "").toLowerCase();
            showWebmailResult(btn, response.result, risk);
          } else {
            btn.textContent = "Scan Failed";
            setTimeout(() => { btn.textContent = "Scan with GCR"; }, 2000);
          }
        });
      });

      const insertTarget = body.parentElement || body;
      insertTarget.insertBefore(btn, body);
    });
  }

  function showWebmailResult(btn, result, risk) {
    const riskColors = { critical: "#dc2626", high: "#ea580c", moderate: "#ca8a04", medium: "#ca8a04", low: "#2563eb", safe: "#16a34a" };
    const riskIcons = { critical: "\uD83D\uDEA8", high: "\u26A0\uFE0F", moderate: "\u26A1", medium: "\u26A1", low: "\uD83D\uDD35", safe: "\u2705" };

    const color = riskColors[risk] || "#16a34a";
    const icon = riskIcons[risk] || "\u2705";

    btn.textContent = `${icon} ${capitalize(risk)} Risk`;
    btn.style.background = color;

    const existingBadge = btn.parentElement?.querySelector(".gcr-webmail-result-badge");
    if (existingBadge) existingBadge.remove();

    if (result.summary) {
      const badge = document.createElement("div");
      badge.className = "gcr-webmail-result-badge";
      badge.style.cssText = `
        background: ${color}10;
        border: 1px solid ${color}30;
        border-radius: 8px;
        padding: 8px 12px;
        margin: 6px 0;
        font-size: 12px;
        color: #374151;
        line-height: 1.5;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      `;

      const summaryText = document.createElement("div");
      summaryText.textContent = result.summary;
      badge.appendChild(summaryText);

      if (result.keyRedFlags && result.keyRedFlags.length > 0) {
        const flagsList = document.createElement("div");
        flagsList.style.cssText = "margin-top: 4px; font-size: 11px; color: #6b7280;";
        flagsList.textContent = result.keyRedFlags.slice(0, 2).join(" \u2022 ");
        badge.appendChild(flagsList);
      }

      btn.parentElement.insertBefore(badge, btn.nextSibling);
    }
  }

  function showReportForm(url) {
    const existing = document.getElementById("gcr-report-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "gcr-report-overlay";
    overlay.className = "gcr-form-overlay";

    const box = document.createElement("div");
    box.className = "gcr-form-warning-box";
    box.style.textAlign = "left";

    const title = document.createElement("h2");
    title.className = "gcr-form-warning-title";
    title.style.textAlign = "center";
    title.textContent = "Report Suspicious Site";

    const urlDisplay = document.createElement("div");
    urlDisplay.className = "gcr-form-url-display";
    urlDisplay.textContent = url;

    const typeLabel = document.createElement("label");
    typeLabel.textContent = "Scam Type";
    typeLabel.style.cssText = "display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 4px;";

    const typeSelect = document.createElement("select");
    typeSelect.style.cssText = "width: 100%; padding: 8px 10px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; margin-bottom: 12px; background: white; color: #1a1a1a;";
    const scamTypes = [
      { value: "phishing", label: "Phishing / Fake Login" },
      { value: "shopping_scam", label: "Shopping Scam / Fake Store" },
      { value: "tech_support", label: "Tech Support Scam" },
      { value: "malware", label: "Malware / Virus" },
      { value: "investment", label: "Investment / Crypto Scam" },
      { value: "impersonation", label: "Impersonation / Fake Brand" },
      { value: "suspicious", label: "Other / Suspicious" }
    ];
    scamTypes.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.value;
      opt.textContent = t.label;
      typeSelect.appendChild(opt);
    });

    const descLabel = document.createElement("label");
    descLabel.textContent = "Description (optional)";
    descLabel.style.cssText = "display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 4px;";

    const descInput = document.createElement("textarea");
    descInput.placeholder = "Describe what made this site suspicious...";
    descInput.rows = 3;
    descInput.style.cssText = "width: 100%; padding: 8px 10px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; font-family: inherit; resize: none; margin-bottom: 16px; box-sizing: border-box;";

    const btnRow = document.createElement("div");
    btnRow.className = "gcr-form-btn-row";

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "gcr-form-btn gcr-form-btn-proceed";
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", () => overlay.remove());

    const submitBtn = document.createElement("button");
    submitBtn.className = "gcr-form-btn gcr-form-btn-safe";
    submitBtn.textContent = "Submit Report";
    submitBtn.addEventListener("click", () => {
      submitBtn.textContent = "Submitting...";
      submitBtn.disabled = true;
      chrome.runtime.sendMessage({
        type: "REPORT_SCAM_STRUCTURED",
        data: {
          url: url,
          scamType: typeSelect.value,
          description: descInput.value.trim() || `Reported as ${typeSelect.options[typeSelect.selectedIndex].text}`
        }
      }, (response) => {
        if (response?.success) {
          submitBtn.textContent = "Reported!";
          setTimeout(() => overlay.remove(), 1500);
        } else {
          submitBtn.textContent = "Failed - Try Again";
          submitBtn.disabled = false;
          setTimeout(() => { submitBtn.textContent = "Submit Report"; }, 2000);
        }
      });
    });

    const brandFooter = document.createElement("div");
    brandFooter.className = "gcr-form-brand";
    brandFooter.style.marginTop = "8px";
    brandFooter.textContent = "Reports help protect the community \u2022 GCR Guard";

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(submitBtn);
    box.appendChild(title);
    box.appendChild(urlDisplay);
    box.appendChild(typeLabel);
    box.appendChild(typeSelect);
    box.appendChild(descLabel);
    box.appendChild(descInput);
    box.appendChild(btnRow);
    box.appendChild(brandFooter);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadSettingsAndInit);
  } else {
    loadSettingsAndInit();
  }
})();
