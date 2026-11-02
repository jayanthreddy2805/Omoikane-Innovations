"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import useDecorativeEffect from "@/hooks/useDecorativeEffect";
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
  const ref = useRef<HTMLDivElement>(null);
  const active = useDecorativeEffect(ref);
  return (
    <div className={styles.visualWrapper} ref={ref} aria-hidden="true">
      {active && <NetworkVisual fillContainer />}
    </div>
  );
}
