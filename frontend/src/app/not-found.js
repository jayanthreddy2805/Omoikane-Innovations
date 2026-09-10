"use client";

import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <span className={styles.code}>404</span>
        <div className={styles.divider} />
        <div className={styles.textBlock}>
          <h1 className={styles.heading}>PAGE UNDER CONSTRUCTION</h1>
          <p className={styles.sub}>This experience is being engineered.<br />Check back soon.</p>
        </div>
      </div>
    </div>
  );
}
