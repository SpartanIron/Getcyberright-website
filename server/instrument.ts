// Sentry instrumentation stub - @sentry/node removed to fix deployment
// Re-add @sentry/node to package.json and package-lock.json to restore error tracking

const Sentry = {
  init: () => {},
  captureException: (err: unknown) => { console.error("[Sentry stub]", err); },
  captureMessage: (msg: string) => { console.log("[Sentry stub]", msg); },
  setUser: () => {},
  setTag: () => {},
  setExtra: () => {},
  withScope: (fn: (scope: any) => void) => { fn({ setTag: () => {}, setExtra: () => {}, setLevel: () => {} }); },
  startTransaction: () => ({ finish: () => {} }),
  getCurrentHub: () => ({ getScope: () => null }),
};

export { Sentry };
