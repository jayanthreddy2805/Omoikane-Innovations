"use client";

import { useEffect, useRef } from "react";
import styles from "./FormSuccessState.module.css";

export default function FormSuccessState() {
  const containerRef = useRef(null);

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
            src="/videos/success.mp4"
            autoPlay
            loop
            muted
            playsInline
            className={styles.successVideo}
          />
        </div>
        <h3 className={styles.successHeading}>MESSAGE RECEIVED</h3>

        <div className={styles.textGroup}>
          <p className={styles.successText}>Thank you for getting in touch.</p>
          <p className={styles.successText}>
            Our team will review your enquiry and get back to you if a conversation is the right next step.
          </p>
        </div>

        <div className={styles.statusLine}>
          <span>MESSAGE SUBMITTED</span>
          <span className={styles.statusArrow}>→</span>
        </div>
      </div>

      {/* 2. QUIET EDITORIAL COMPANY SIGNATURE */}
      <div className={styles.signatureRow}>
        <div className={styles.signatureCol}>
          <span className={styles.companyName}>OMOIKANE INNOVATIONS</span>
          <span className={styles.companyLocation}>Bangalore, India</span>
        </div>

        <div className={styles.signatureCol}>
          <a href="mailto:info@omoikaneinnovations.com" className={styles.signatureLink}>info@omoikaneinnovations.com</a>
          <a href="mailto:bd@omoikaneinnovations.com" className={styles.signatureLink}>bd@omoikaneinnovations.com</a>
        </div>

        <div className={styles.signatureCol}>
          <a href="tel:+918861035848" className={styles.signatureLink}>+91-8861035848</a>
          <a href="tel:+919353627825" className={styles.signatureLink}>+91-9353627825</a>
        </div>
      </div>
    </div>
  );
}
