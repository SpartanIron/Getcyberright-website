# GCR Scam Guard — Chrome Web Store Permission Justifications

## Extension Overview

GCR Scam Guard is a family-focused cybersecurity browser extension that scans web pages for phishing, scams, and malicious content. It provides real-time warnings, community-sourced reputation data, and AI-powered scam detection.

---

## Permissions

### `activeTab`

**Why needed:** When the user clicks "Scan This Page" in the popup or triggers a scan via the context menu, the extension needs to read the content of the currently active tab to analyze it for phishing indicators, suspicious forms, and scam patterns. This permission is used only on user-initiated actions — the extension does not read tab content without explicit user interaction (unless Auto-Protect is enabled by the user in settings).

### `contextMenus`

**Why needed:** The extension adds right-click context menu items ("Scan with GCR Scam Guard" on links, "Scan this page with GCR Scam Guard" on pages, "Scan selected text with GCR Scam Guard" on selected text) so users can quickly scan content for scam indicators without opening the popup. This is a core user-facing feature for convenient scanning.

### `storage`

**Why needed:** The extension stores user preferences (auto-protect toggle, notification preferences), scan history, scan statistics (weekly chart data), cached threat data, authentication tokens, and the onboarding completion flag locally in `chrome.storage.local`. No data is synced via `chrome.storage.sync`. All stored data remains on the user's device.

### `notifications`

**Why needed:** The extension sends browser notifications to alert users about:
- Dangerous sites detected during auto-protect scanning
- New "Scam of the Week" alerts from the GCR threat feed
- Scan results when the popup is not open

Notifications are configurable and can be disabled by the user in the extension settings.

### `alarms`

**Why needed:** The extension uses `chrome.alarms` to schedule periodic background tasks:
- `check-scam-of-week`: Fetches the weekly "Scam of the Week" alert (every 360 minutes / 6 hours)
- `refresh-threat-feed`: Fetches updated threat feed data (every 60 minutes / 1 hour)
- `weekly-safety-digest`: Sends a weekly safety summary notification (every 10080 minutes / 7 days)

These alarms replace `setInterval` as required by Manifest V3 service worker lifecycle.

### `scripting`

**Why needed:** The extension uses `chrome.scripting.executeScript` to inject the content scanner into pages when the user initiates a manual scan via the popup or context menu. This is necessary because content scripts declared in the manifest run at `document_idle`, but manual scans may need to re-inject or run analysis on demand. The extension only injects its own scanner code — no third-party scripts.

### `tabs`

**Why needed:** The extension uses `chrome.tabs` to:
- Query the active tab's URL to display page status in the popup
- Detect tab changes via `onActivated` and `onUpdated` to manage badge state and trigger auto-protect scanning
- Update the extension badge icon/text based on scan results for the current tab
- Clean up cached tab data when tabs are closed via `onRemoved`
- Open the GCR website for sign-in and account management

### `webNavigation`

**Why needed:** The extension uses `chrome.webNavigation.onBeforeNavigate` to detect when a new navigation begins in the main frame (frameId === 0). This clears the cached scan state for that tab and resets the badge to a clean state, ensuring stale scan results from the previous page are not displayed. This is more reliable than `tabs.onUpdated` for detecting actual navigations vs. in-page state changes.

---

## Host Permissions

### `https://www.getcyberright.com/*`

**Why needed:** The extension communicates with the GCR API server at `https://www.getcyberright.com` for:
- Submitting content for AI-powered scam analysis (`/api/security/ai-scam-analyze`)
- Checking URL reputation (`/api/security/url-reputation`)
- Checking domain reputation via community trust data (`/api/extension/site-reputation`)
- Recording site visits and safe visits (`/api/extension/site-reputation/visit`, `/api/extension/site-reputation/safe`)
- Flagging suspicious domains (`/api/extension/site-reputation/flag`)
- Submitting user scam reports (`/api/community-reports`)
- Fetching threat feed and scam-of-the-week data (`/api/scam-feed`, `/api/scam-of-week`)
- Verifying user subscription status (`/api/extension/subscription-status`)

### `http://*/*` and `https://*/*`

**Why needed:** The content script (`content/scanner.js`) needs to run on all web pages to:
1. Analyze page content for phishing indicators when auto-protect is enabled or manual scan is triggered
2. Detect suspicious forms (login forms on non-HTTPS pages, forms with suspicious action URLs)
3. Check URLs against known scam patterns (e.g., lookalike domains)
4. Display in-page warning banners when threats are detected

The extension does NOT collect browsing history, read passwords, or access form input values. Content analysis is limited to visible page text, link destinations, and form structure (action URLs, input field types).

---

## Content Scripts

### `content/scanner.js`

**Runs on:** All HTTP and HTTPS pages
**Run timing:** `document_idle` (after page load)
**Purpose:** Analyzes page DOM for phishing indicators including:
- Suspicious URL patterns (e.g., domains mimicking popular brands via `isSuspiciousURL()`)
- Login forms on non-HTTPS pages (via `analyzeForms()`)
- Forms with suspicious action URLs
- Excessive external links typical of phishing pages

The content script communicates only with the extension's background service worker via `chrome.runtime.sendMessage`. It does not make any network requests directly.

---

## Data Handling Summary

| Data Type | Collected? | Sent to Server? | Storage |
|-----------|-----------|-----------------|---------|
| Page text (for scan) | On user action | Yes (HTTPS) | Not stored server-side |
| Domain hashes | Yes | Yes (SHA-256 only) | Cached locally, hashed on server |
| Browsing history | No | No | N/A |
| Passwords/credentials | No | No | N/A |
| Form input values | No | No | N/A |
| Scan statistics | Yes | No | Local only |
| User preferences | Yes | No | Local only |

---

## Privacy Policy

Full privacy policy: https://www.getcyberright.com/privacy

Extension-specific privacy details: https://www.getcyberright.com/privacy#extension

---

## Test Account

Provided separately via the Chrome Web Store reviewer notes field during submission.
