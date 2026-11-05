"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import {
  COOKIE_CONSENT_CHANGE_EVENT,
  readCookieConsent,
} from "@/lib/cookieConsent";

function removeSensitiveUrlData(event) {
  if (!readCookieConsent()?.analytics) return null;

  try {
    const url = new URL(event.url, window.location.origin);
    url.search = "";
    url.hash = "";
    return { ...event, url: url.toString() };
  } catch {
    return null;
  }
}

export default function ConsentAwareAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const syncConsent = () => setEnabled(readCookieConsent()?.analytics === true);
    const frame = window.requestAnimationFrame(syncConsent);

    window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT, syncConsent);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(COOKIE_CONSENT_CHANGE_EVENT, syncConsent);
    };
  }, []);

  if (!enabled) return null;

  return <Analytics beforeSend={removeSensitiveUrlData} />;
}
