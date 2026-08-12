"use client";

import Link from "next/link";
import { useEffect, useState, startTransition } from "react";
import { Button } from "@/components/common/Button";
import {
  applyConsentToGtag,
  initConsentModeDefaults,
  readConsent,
  writeConsent,
  type ConsentStatus,
} from "@/lib/consent";

type BannerMode = "loading" | "hidden" | "prompt";

export function ConsentBanner() {
  const [mode, setMode] = useState<BannerMode>("loading");

  useEffect(() => {
    initConsentModeDefaults();

    const sync = () => {
      const existing = readConsent();
      if (existing) {
        applyConsentToGtag(existing.status);
        startTransition(() => setMode("hidden"));
      } else {
        startTransition(() => setMode("prompt"));
      }
    };

    sync();

    const openSettings = () => setMode("prompt");
    window.addEventListener("open-consent-settings", openSettings);
    return () => {
      window.removeEventListener("open-consent-settings", openSettings);
    };
  }, []);

  const choose = (status: ConsentStatus) => {
    writeConsent(status);
    setMode("hidden");
  };

  if (mode !== "prompt") return null;

  return (
    <div
      className="consent-banner"
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      aria-describedby="consent-desc"
    >
      <div className="consent-banner__inner">
        <div className="consent-banner__copy">
          <h2 id="consent-title">Cookies &amp; ads consent</h2>
          <p id="consent-desc">
            We use cookies and similar technologies for essential site features
            and, if you allow it, for advertising (such as Google AdSense) and
            related measurement. You can accept or reject non-essential cookies.
            Read our{" "}
            <Link href="/privacy">Privacy Policy</Link> for details. You can
            change this anytime via Cookie settings in the footer.
          </p>
        </div>
        <div className="consent-banner__actions">
          <Button type="button" onClick={() => choose("rejected")}>
            Reject non-essential
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => choose("accepted")}
          >
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
}

export function openConsentSettings(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("open-consent-settings"));
  }
}
