"use client";

import React from "react";
import Link from "next/link";
import FooterVisual from "./FooterVisual";
import styles from "../Footer.module.css";

/**
 * FooterHero
 * Premium engineering top footer section inspired by the APSLOCK reference design.
 * Features a 30% visual panel on the left and a 70% content + CTA area on the right.
 */
export default function FooterHero() {
  return (
    <section className={styles.heroSection} aria-label="Footer Hero">
      {/* Left Column: Visual Panel (~30%) */}
      <div className={styles.heroVisualCol}>
        <FooterVisual />
      </div>

      {/* Right Column: Text & CTA (~70%) */}
      <div className={styles.heroContentCol}>
        {/* Main Heading */}
        <h2 className={styles.heroHeading}>
          Ready to engineer what&apos;s next?
        </h2>

        {/* Supporting Text */}
        <p className={styles.heroText}>
          Autonomous systems. Avionics. Defense-grade embedded tech. Built for
          the missions that matter.
        </p>

        {/* CTA Button & Company Brand Watermark */}
        <div className={styles.heroActionRow}>
          <Link href="/contact" className={styles.heroCta}>
            <span>Start a Conversation</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.heroCtaArrow}
              aria-hidden="true"
            >
              <path
                d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <div className={styles.heroBrandWatermark} aria-hidden="true">
            <span className={styles.heroBrandName}>OMOIKANE</span>
            <span className={styles.heroBrandSub}>INNOVATIONS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
