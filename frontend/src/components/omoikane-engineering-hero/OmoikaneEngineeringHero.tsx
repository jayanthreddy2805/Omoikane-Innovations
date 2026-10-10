"use client";

import Link from "next/link";
import styles from "./OmoikaneEngineeringHero.module.css";

export function OmoikaneEngineeringHero() {

  return (
    <section className={styles.hero} aria-labelledby="omk-hero-title">
      <div className={styles.imageLayer} aria-hidden="true" />



      
      <div className={styles.content}>
        <h1 id="omk-hero-title" className={styles.heading}><span>BUILT FOR REAL</span><span>WORLD SYSTEMS</span></h1>
        <p className={styles.description}>We design and build advanced products for aerospace and defense, where performance, precision and reliability are mission-critical.</p>
      </div>

    </section>
  );
}
