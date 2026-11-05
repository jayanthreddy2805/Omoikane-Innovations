"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import styles from "./FormSuccessState.module.css";

export default function FormSuccessState({ variant = "contact" }) {
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Focus management for screen readers
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.successContainer}
      tabIndex={-1}
      aria-live="polite"
    >
      {/* 1. MAIN EDITORIAL CONFIRMATION CLUSTER */}
      <div className={styles.confirmationCluster}>
        <div className={styles.videoWrapper}>
          <video 
            src="/videos/shared/success.mp4"
            autoPlay={!reducedMotion}
            loop={!reducedMotion}
            muted
            playsInline
            className={styles.successVideo}
          />
        </div>
        <h3 className={styles.successHeading}>{variant === "application" ? "APPLICATION RECEIVED" : "MESSAGE RECEIVED"}</h3>

        <div className={styles.textGroup}>
          <p className={styles.successText}>{variant === "application" ? "Thank you for applying." : "Thank you for getting in touch."}</p>
          <p className={styles.successText}>
            {variant === "application"
              ? "Our team will review your application and contact you if your experience matches a current requirement."
              : "Our team will review your enquiry and get back to you if a conversation is the right next step."}
          </p>
        </div>

        <div className={styles.statusLine}>
          <span>{variant === "application" ? "APPLICATION SUBMITTED" : "MESSAGE SUBMITTED"}</span>
          <span className={styles.statusArrow}>→</span>
        </div>
      </div>

    </div>
  );
}
