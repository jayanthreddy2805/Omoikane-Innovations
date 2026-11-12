"use client";

import { useEffect, useRef, useState } from "react";
import {
  OPEN_COOKIE_PREFERENCES_EVENT,
  readCookieConsent,
  writeCookieConsent,
} from "@/lib/cookieConsent";
import styles from "./CookiePreferences.module.css";

const FOCUSABLE = [
  "button:not([disabled])",
  "input:not([disabled])",
  "a[href]",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export default function CookiePreferences() {
  const [consent, setConsent] = useState(undefined);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const returnFocusRef = useRef(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setConsent(readCookieConsent()));

    const openPreferences = () => {
      returnFocusRef.current = document.activeElement;
      const savedConsent = readCookieConsent();
      setAnalyticsEnabled(savedConsent?.analytics ?? false);
      setPreferencesOpen(true);
    };

    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, openPreferences);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, openPreferences);
    };
  }, []);

  useEffect(() => {
    if (!preferencesOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = originalOverflow;
      returnFocusRef.current?.focus?.();
    };
  }, [preferencesOpen]);

  const saveConsent = (analytics) => {
    const nextConsent = { analytics };
    writeCookieConsent(nextConsent);
    setConsent(nextConsent);
    setPreferencesOpen(false);
  };

  const openPreferences = () => {
    returnFocusRef.current = document.activeElement;
    setAnalyticsEnabled(consent?.analytics ?? false);
    setPreferencesOpen(true);
  };

  const handleDialogKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setPreferencesOpen(false);
      return;
    }

    if (event.key !== "Tab" || !dialogRef.current) return;
    const controls = Array.from(dialogRef.current.querySelectorAll(FOCUSABLE))
      .filter((element) => element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  return (
    <>
      {consent === null && !preferencesOpen ? (
        <section className={styles.banner} role="region" aria-label="Cookie choices">
          <div className={styles.bannerCopy}>
            <h2>Cookie choices</h2>
            <p>
              Essential cookies keep the website working. Optional, privacy-friendly analytics
              helps us understand visits and stays off unless you allow it.
            </p>
          </div>
          <div className={styles.bannerActions}>
            <button className={styles.secondaryButton} type="button" onClick={() => saveConsent(false)}>
              Essential only
            </button>
            <button className={styles.primaryButton} type="button" onClick={() => saveConsent(true)}>
              Allow analytics
            </button>
            <button className={styles.textButton} type="button" onClick={openPreferences}>
              Manage preferences
            </button>
          </div>
        </section>
      ) : null}

      {preferencesOpen ? (
        <div
          className={styles.backdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPreferencesOpen(false);
          }}
        >
          <section
            ref={dialogRef}
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-preferences-title"
            aria-describedby="cookie-preferences-description"
            onKeyDown={handleDialogKeyDown}
          >
            <div className={styles.dialogHeader}>
              <div>
                <p className={styles.eyebrow}>Privacy controls</p>
                <h2 id="cookie-preferences-title">Cookie preferences</h2>
              </div>
              <button
                ref={closeButtonRef}
                className={styles.closeButton}
                type="button"
                aria-label="Close cookie preferences"
                onClick={() => setPreferencesOpen(false)}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
                  <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <p id="cookie-preferences-description" className={styles.description}>
              Choose whether optional analytics may be used. Your selection is saved for
              six months and can be changed from the footer at any time.
            </p>

            <div className={styles.preferenceList}>
              <div className={styles.preferenceRow}>
                <div>
                  <h3>Essential cookies</h3>
                  <p>Required to remember your cookie choice and provide core website functions.</p>
                </div>
                <span className={styles.alwaysOn}>Always on</span>
              </div>

              <label className={styles.preferenceRow}>
                <span>
                  <span className={styles.preferenceTitle}>Analytics</span>
                  <span className={styles.preferenceText}>
                    Uses Vercel Web Analytics to measure anonymous, aggregated visits without
                    third-party cookies. Off by default.
                  </span>
                </span>
                <span className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(event) => setAnalyticsEnabled(event.target.checked)}
                  />
                  <span className={styles.switchTrack} aria-hidden="true" />
                  <span className={styles.switchLabel}>{analyticsEnabled ? "On" : "Off"}</span>
                </span>
              </label>
            </div>

            <div className={styles.dialogActions}>
              <button className={styles.primaryButton} type="button" onClick={() => saveConsent(analyticsEnabled)}>
                Save preferences
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
