"use client";

import React from "react";
import Image from "next/image";
import styles from "./HeroComposition.module.css";

/**
 * HeroComposition
 * Exact recreation of the target hero reference collage:
 * - Central rocket illustration (rocket.png) as dominant element.
 * - Surrounding vintage black-and-white sticker illustrations:
 *     mech.png (gears, upper-left)
 *     bulb.png (lightbulb, top-center)
 *     book.png (open book, top-right)
 *     globe.png (desk globe, lower-left)
 *     robo.png (retro robot, bottom-center)
 *     computer.png (retro terminal, lower-right)
 * - Layered orbital rings, dashed orbital sweeps, and 4 starburst decorations in SVG behind.
 */
export default function HeroComposition() {
  return (
    <div className={styles.compositionRoot} aria-label="Hero illustrations composition">
      {/* ─────────────────────────────────────────────────────────────
          1. ORBITAL DECORATIVE GRAPHICS (Behind illustrations)
      ───────────────────────────────────────────────────────────── */}
      <svg
        className={styles.svgLayer}
        viewBox="0 0 440 430"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Main Central Orbital Circle */}
        <circle
          cx="188"
          cy="215"
          r="130"
          stroke="rgba(255, 255, 255, 0.42)"
          strokeWidth="1.2"
          fill="none"
        />

        {/* Dashed Inner Orbital Path */}
        <circle
          cx="188"
          cy="215"
          r="100"
          stroke="rgba(255, 255, 255, 0.35)"
          strokeWidth="1.2"
          strokeDasharray="6 6"
          fill="none"
        />

        {/* Upper-Right Secondary Orbital Circle */}
        <circle
          cx="325"
          cy="110"
          r="75"
          stroke="rgba(255, 255, 255, 0.42)"
          strokeWidth="1.2"
          fill="none"
        />

        {/* Lower-Left Secondary Orbital Circle */}
        <circle
          cx="105"
          cy="315"
          r="65"
          stroke="rgba(255, 255, 255, 0.42)"
          strokeWidth="1.2"
          fill="none"
        />

        {/* Starburst 1 — Upper-Left (near mech) */}
        <polygon
          points="53.0,49.0 55.5,55.8 61.0,51.1 59.7,58.3 66.9,57.0 62.2,62.5 69.0,65.0 62.2,67.5 66.9,73.0 59.7,71.7 61.0,78.9 55.5,74.2 53.0,81.0 50.5,74.2 45.0,78.9 46.3,71.7 39.1,73.0 43.8,67.5 37.0,65.0 43.8,62.5 39.1,57.0 46.3,58.3 45.0,51.1 50.5,55.8"
          stroke="rgba(255, 255, 255, 0.55)"
          strokeWidth="1.2"
          fill="none"
        />

        {/* Starburst 2 — Top-Center (near bulb) */}
        <polygon
          points="194.0,65.0 195.7,69.7 199.5,66.5 198.6,71.4 203.5,70.5 200.3,74.3 205.0,76.0 200.3,77.7 203.5,81.5 198.6,80.6 199.5,85.5 195.7,82.3 194.0,87.0 192.3,82.3 188.5,85.5 189.4,80.6 184.5,81.5 187.7,77.7 183.0,76.0 187.7,74.3 184.5,70.5 189.4,71.4 188.5,66.5 192.3,69.7"
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth="1"
          fill="none"
        />

        {/* Starburst 3 — Lower-Left (near globe) */}
        <polygon
          points="32.0,348.0 34.5,354.8 40.0,350.1 38.7,357.3 45.9,356.0 41.2,361.5 48.0,364.0 41.2,366.5 45.9,372.0 38.7,370.7 40.0,377.9 34.5,373.2 32.0,380.0 29.5,373.2 24.0,377.9 25.3,370.7 18.1,372.0 22.8,366.5 16.0,364.0 22.8,361.5 18.1,356.0 25.3,357.3 24.0,350.1 29.5,354.8"
          stroke="rgba(255, 255, 255, 0.55)"
          strokeWidth="1.25"
          fill="none"
        />

        {/* Starburst 4 — Bottom-Right (near computer) */}
        <polygon
          points="298.0,349.0 300.1,354.3 304.5,350.7 303.7,356.3 309.3,355.5 305.7,359.9 311.0,362.0 305.7,364.1 309.3,368.5 303.7,367.7 304.5,373.3 300.1,369.7 298.0,375.0 295.9,369.7 291.5,373.3 292.3,367.7 286.7,368.5 290.3,364.1 285.0,362.0 290.3,359.9 286.7,355.5 292.3,356.3 291.5,350.7 295.9,354.3"
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth="1.1"
          fill="none"
        />
      </svg>

      {/* ─────────────────────────────────────────────────────────────
          2. ILLUSTRATION ASSETS (Layered over the orbital graphics)
      ───────────────────────────────────────────────────────────── */}

      {/* Gears (Mech) — Upper-Left */}
      <div className={`${styles.illustrationItem} ${styles.itemMech}`}>
        <Image
          src="/images/hero/mech.png"
          alt="Precision mechanical engineering"
          fill
          sizes="(max-width: 768px) 140px, 180px"
          className={styles.imgContain}
          priority
        />
      </div>

      {/* Light Bulb — Top Center */}
      <div className={`${styles.illustrationItem} ${styles.itemBulb}`}>
        <Image
          src="/images/hero/bulb.png"
          alt="Innovation and electronics"
          fill
          sizes="(max-width: 768px) 90px, 120px"
          className={styles.imgContain}
          priority
        />
      </div>

      {/* Open Book — Top Right */}
      <div className={`${styles.illustrationItem} ${styles.itemBook}`}>
        <Image
          src="/images/hero/book.png"
          alt="Aerospace knowledge and documentation"
          fill
          sizes="(max-width: 768px) 120px, 160px"
          className={styles.imgContain}
          priority
        />
      </div>

      {/* Central Rocket — Dominant center element */}
      <div className={`${styles.illustrationItem} ${styles.itemRocket}`}>
        <Image
          src="/images/hero/rocket.png"
          alt="Flight control and aerospace rocket vehicle"
          fill
          sizes="(max-width: 768px) 300px, 420px"
          className={styles.imgContain}
          priority
        />
      </div>

      {/* Desk Globe — Lower Left */}
      <div className={`${styles.illustrationItem} ${styles.itemGlobe}`}>
        <Image
          src="/images/hero/globe.png"
          alt="Global navigation and telemetry"
          fill
          sizes="(max-width: 768px) 130px, 170px"
          className={styles.imgContain}
          priority
        />
      </div>

      {/* Robot — Bottom Center */}
      <div className={`${styles.illustrationItem} ${styles.itemRobo}`}>
        <Image
          src="/images/hero/robo.png"
          alt="Autonomous robotic systems"
          fill
          sizes="(max-width: 768px) 80px, 110px"
          className={styles.imgContain}
          priority
        />
      </div>

      {/* Retro Computer — Lower Right */}
      <div className={`${styles.illustrationItem} ${styles.itemComputer}`}>
        <Image
          src="/images/hero/computer.png"
          alt="Embedded computation and flight control computers"
          fill
          sizes="(max-width: 768px) 150px, 200px"
          className={styles.imgContain}
          priority
        />
      </div>
    </div>
  );
}
