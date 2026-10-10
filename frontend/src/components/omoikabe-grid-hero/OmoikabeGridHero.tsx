"use client";

import Link from "next/link";
import styles from "./OmoikabeGridHero.module.css";
import { FileAnimation } from "./FileAnimation";

/**
 * Drop this section immediately below your existing Omoikabe navigation.
 * Intentionally leaves the site navbar/logo to the application so the existing
 * navigation and brand assets are not duplicated.
 */
export function OmoikabeGridHero() {
  return (
    <section className={styles.hero} aria-labelledby="omoikabe-hero-title">
      <div className={styles.gridTexture} aria-hidden="true" />

      <svg
        className={styles.routeLines}
        viewBox="0 0 1440 760"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path className={styles.route} d="M 430 155 C 505 118, 555 150, 542 190 S 470 250, 560 278 C 640 305, 698 240, 770 260 S 850 330, 922 296" />
        <path className={styles.route} d="M 80 500 C 170 460, 200 548, 286 510 S 363 421, 426 474 C 485 525, 510 592, 625 560 S 760 490, 844 533" />
        <path className={styles.route} d="M 1030 150 C 1090 188, 1040 238, 1118 260 S 1260 250, 1320 315" />
        <circle className={styles.routeDot} r="4">
          <animateMotion dur="7s" repeatCount="indefinite" path="M 430 155 C 505 118, 555 150, 542 190 S 470 250, 560 278 C 640 305, 698 240, 770 260 S 850 330, 922 296" />
        </circle>
        <circle className={styles.routeDot} r="3">
          <animateMotion dur="9s" repeatCount="indefinite" path="M 80 500 C 170 460, 200 548, 286 510 S 363 421, 426 474 C 485 525, 510 592, 625 560 S 760 490, 844 533" />
        </circle>
      </svg>

      <span className={`${styles.plus} ${styles.plusA}`} aria-hidden="true">+</span>
      <span className={`${styles.plus} ${styles.plusB}`} aria-hidden="true">+</span>
      <span className={`${styles.plus} ${styles.plusC}`} aria-hidden="true">+</span>
      <span className={`${styles.plus} ${styles.plusD}`} aria-hidden="true">+</span>

      <div className={`${styles.miniPanel} ${styles.panelTop}`} aria-hidden="true">
        <span className={styles.panelCorner} />
        <span className={styles.panelLine} />
        <span className={`${styles.panelLine} ${styles.panelLineShort}`} />
        <span className={styles.panelWave} />
      </div>

      <div className={`${styles.miniPanel} ${styles.panelRight}`} aria-hidden="true">
        <span className={styles.panelHeading}>SYSTEM / 01</span>
        <span className={styles.panelLine} />
        <span className={`${styles.panelLine} ${styles.panelLineShort}`} />
        <span className={styles.panelStatus}><i /> ONLINE</span>
      </div>

      <FileAnimation className={styles.fileUpper} variant="document" />
      <FileAnimation className={styles.fileLower} variant="pdf" />

      <div className={styles.heroContent}>
        <h1 id="omoikabe-hero-title" className={styles.title}>
          <span className={styles.titleLineOne}>DEEP TECH</span>
          <span className={styles.titleLineTwo}>EXPERTISE<span className={styles.titlePeriod}>.</span></span>
        </h1>

        <div className={styles.supportRow}>
          <div className={styles.supportCopy}>
            <p style={{ marginBottom: "12px" }}>
              We primarily design and build advanced products for Aerospace and Defense applications, where performance, precision, and reliability are mission-critical.
            </p>
            <p>
              Our capabilities also extend to selected industrial domains, supported by scalable embedded technologies and intelligent systems.
            </p>
            <a
              href="#"
              className={styles.cta}
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
              }}
            >
              <span>Get started</span>
              <span className={styles.ctaArrow} aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
