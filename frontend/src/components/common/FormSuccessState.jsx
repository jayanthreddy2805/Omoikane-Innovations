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
        <h3 className={styles.successHeading}>APPLICATION RECEIVED</h3>

        <div className={styles.textGroup}>
          <p className={styles.successText}>Thank you for your application.</p>
          <p className={styles.successText}>
            Our team will review your details and get back to you if your experience aligns with a current opportunity.
          </p>
        </div>

        <div className={styles.statusLine}>
          <span>APPLICATION SUBMITTED</span>
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
