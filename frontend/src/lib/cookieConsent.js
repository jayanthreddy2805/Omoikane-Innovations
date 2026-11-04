export const COOKIE_CONSENT_NAME = "omoikane_cookie_consent";
export const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 180;
export const OPEN_COOKIE_PREFERENCES_EVENT = "omoikane:open-cookie-preferences";
export const COOKIE_CONSENT_CHANGE_EVENT = "omoikane:consent-change";

const ESSENTIAL_VALUE = "v1-essential";
const ANALYTICS_VALUE = "v1-analytics";

export function readCookieConsent() {
  if (typeof document === "undefined") return null;

  const entry = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${COOKIE_CONSENT_NAME}=`));

  if (!entry) return null;

  const value = decodeURIComponent(entry.slice(COOKIE_CONSENT_NAME.length + 1));
  if (value === ANALYTICS_VALUE) return { analytics: true };
  if (value === ESSENTIAL_VALUE) return { analytics: false };
  return null;
}

export function writeCookieConsent({ analytics }) {
  if (typeof document === "undefined") return;

  const value = analytics ? ANALYTICS_VALUE : ESSENTIAL_VALUE;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_CONSENT_NAME}=${value}; Path=/; Max-Age=${COOKIE_CONSENT_MAX_AGE}; SameSite=Lax${secure}`;

  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_CHANGE_EVENT, {
    detail: { essential: true, analytics },
  }));
}
