import { logInfo, logWarn, logError } from "../utils/logger.js";

const MODULE = "messaging";

const VALID_ACTIONS = new Set([
  "SCAN_URL",
  "CHECK_URL_REPUTATION",
  "REPORT_SCAM",
  "REPORT_SCAM_STRUCTURED",
  "GET_SCAM_OF_WEEK",
  "GET_SCAN_STATS",
  "GET_WEEKLY_STATS",
  "GET_SCAN_HISTORY",
  "SCAN_PAGE_LINKS",
  "GET_SETTINGS",
  "SAVE_SETTINGS",
  "PAGE_LOADED",
  "GET_TAB_SCAN_RESULT",
  "GET_PAGE_RISK",
  "GET_COMMUNITY_TRUST",
  "FLAG_DOMAIN",
  "SCAN_WEBMAIL",
  "SIGN_IN",
  "SIGN_OUT",
  "GET_AUTH_STATUS",
  "CHECK_FEATURE"
]);

const ALLOWED_ORIGINS = new Set([
  "chrome-extension://",
  "https://www.getcyberright.com"
]);

function validateMessage(message) {
  if (!message || typeof message !== "object") {
    logWarn(MODULE, "Rejected: message is not an object");
    return false;
  }
  if (!message.type || typeof message.type !== "string") {
    logWarn(MODULE, "Rejected: missing or invalid message type");
    return false;
  }
  if (!VALID_ACTIONS.has(message.type)) {
    logWarn(MODULE, "Rejected: unknown action type:", message.type);
    return false;
  }
  return true;
}

function validateSender(sender) {
  if (!sender) {
    logWarn(MODULE, "Rejected: no sender information");
    return false;
  }
  if (sender.id === chrome.runtime.id) {
    return true;
  }
  if (sender.origin) {
    for (const allowed of ALLOWED_ORIGINS) {
      if (sender.origin.startsWith(allowed)) return true;
    }
  }
  if (sender.url) {
    for (const allowed of ALLOWED_ORIGINS) {
      if (sender.url.startsWith(allowed)) return true;
    }
  }
  if (sender.tab && sender.tab.url) {
    if (sender.tab.url.startsWith("http://") || sender.tab.url.startsWith("https://")) {
      return true;
    }
  }
  logWarn(MODULE, "Rejected: unauthorized sender", sender.origin || sender.url || "unknown");
  return false;
}

export function setupMessageHandlers(handlers) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!validateMessage(message)) {
      sendResponse({ error: "Invalid message format" });
      return false;
    }

    if (!validateSender(sender)) {
      sendResponse({ error: "Unauthorized sender" });
      return false;
    }

    const handler = handlers[message.type];
    if (!handler) {
      logWarn(MODULE, "No handler registered for:", message.type);
      sendResponse({ error: "Unknown action" });
      return false;
    }

    try {
      const result = handler(message, sender, sendResponse);
      if (result instanceof Promise) {
        result.catch(e => {
          logError(MODULE, `Handler error for ${message.type}:`, e.message);
          sendResponse({ error: "Internal error" });
        });
        return true;
      }
      return result;
    } catch (e) {
      logError(MODULE, `Sync handler error for ${message.type}:`, e.message);
      sendResponse({ error: "Internal error" });
      return false;
    }
  });

  logInfo(MODULE, "Message handlers initialized with", Object.keys(handlers).length, "handlers");
}
