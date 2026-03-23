const PREFIX = "[gcr-guard]";

export function logInfo(module, ...args) {
  console.info(`${PREFIX}[${module}]`, ...args);
}

export function logWarn(module, ...args) {
  console.warn(`${PREFIX}[${module}]`, ...args);
}

export function logError(module, ...args) {
  console.error(`${PREFIX}[${module}]`, ...args);
}
