"use client";

import React from "react";
import dynamic from "next/dynamic";
import styles from "../Footer.module.css";

// Dynamic client-only import to ensure Three.js / WebGL executes strictly in browser
const NetworkVisual = dynamic(
  () => import("../FooterContent/NetworkVisual"),
  { ssr: false }
);

/**
 * FooterVisual
 * Modular wrapper component for the left visual panel in FooterHero.
 *
 * Designed for easy future replacement:
 * To swap this visual out for a different 3D scene, Spline, or animation,
 * simply update the content inside this file without modifying FooterHero.tsx
 * or Footer/index.tsx.
 */
export default function FooterVisual() {
  return (
    <div className={styles.visualWrapper}>
      <NetworkVisual fillContainer />
    </div>
  );
}
