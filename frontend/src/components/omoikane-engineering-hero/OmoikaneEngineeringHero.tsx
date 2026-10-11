"use client";

import Link from "next/link";
import styles from "./OmoikaneEngineeringHero.module.css";
import { motion } from "framer-motion";

export function OmoikaneEngineeringHero() {
  return (
    <section className={styles.hero} aria-labelledby="omk-hero-title">
      <motion.div 
        className={styles.imageLayer} 
        aria-hidden="true" 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      
      <div className={styles.content}>
        <motion.h1 
          id="omk-hero-title" 
          className={styles.heading}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span>BUILT FOR <span style={{ color: '#1e3d3a' }}>REAL</span></span>
          <span><span style={{ color: '#1e3d3a' }}>WORLD</span> SYSTEMS</span>
        </motion.h1>
        <motion.p 
          className={styles.description}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          We design and build advanced products for aerospace and defense, where performance, precision and reliability are mission-critical.
        </motion.p>
      </div>
    </section>
  );
}
