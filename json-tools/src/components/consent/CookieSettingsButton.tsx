"use client";

import { openConsentSettings } from "@/components/consent/ConsentBanner";

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      className="cookie-settings-link"
      onClick={() => openConsentSettings()}
    >
      Cookie settings
    </button>
  );
}
