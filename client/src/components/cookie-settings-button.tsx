"use client";

export function CookieSettingsButton() {
  return (
    <button
      onClick={() => {
        localStorage.removeItem("gcr_cookie_consent");
        window.dispatchEvent(new CustomEvent("cookie-consent-reopen", { detail: null }));
      }}
      className="hover:text-slate-300 transition-colors cursor-pointer"
      data-testid="link-cookie-settings"
    >
      Cookie Settings
    </button>
  );
}
