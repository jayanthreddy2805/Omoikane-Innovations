"use client";

import styles from "./not-found.module.css";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <span className={styles.code}>404</span>
        <div className={styles.divider} />
        <div className={styles.textBlock}>
          <h1 className={styles.heading}>PAGE NOT FOUND</h1>
          <p className={styles.sub}>The requested page does not exist or has moved.</p>
          <div className={styles.actions}>
            <Link href="/" className={styles.action}>Home</Link>
            <Link href="/work" className={styles.action}>View our work</Link>
            <Link href="/contact" className={styles.action}>Contact us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
