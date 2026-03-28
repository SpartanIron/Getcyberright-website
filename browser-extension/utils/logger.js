const PREFIX = "[gcr-guard]";

const IS_DEV = typeof chrome !== "undefined" && chrome.runtime && !("update_url" in (chrome.runtime.getManifest?.() || {}));

export function logInfo(module, ...args) {
  if (IS_DEV) console.info(`${PREFIX}[${module}]`, ...args);
}

export function logWarn(module, ...args) {
  console.warn(`${PREFIX}[${module}]`, ...args);
}

export function logError(module, ...args) {
  console.error(`${PREFIX}[${module}]`, ...args);
}
