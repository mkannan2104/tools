export type ConsentStatus = "accepted" | "rejected";

export interface ConsentRecord {
  status: ConsentStatus;
  updatedAt: string;
  version: number;
}

export const CONSENT_STORAGE_KEY = "site-consent-v1";
export const CONSENT_VERSION = 1;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Google Consent Mode v2 defaults — deny until the user chooses. */
export function initConsentModeDefaults(): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });
}

export function applyConsentToGtag(status: ConsentStatus): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  const value = status === "accepted" ? "granted" : "denied";
  window.gtag("consent", "update", {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });

  window.dispatchEvent(
    new CustomEvent("site-consent-changed", { detail: { status } }),
  );
}

export function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (
      parsed?.version !== CONSENT_VERSION ||
      (parsed.status !== "accepted" && parsed.status !== "rejected")
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(status: ConsentStatus): ConsentRecord {
  const record: ConsentRecord = {
    status,
    updatedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  applyConsentToGtag(status);
  return record;
}
