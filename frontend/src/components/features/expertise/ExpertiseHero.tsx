"use client";

import Image, { getImageProps } from "next/image";
import styles from "./ExpertiseHero.module.css";
import { m as motion } from "framer-motion";

export function ExpertiseHero() {
  const mobile = getImageProps({src: '/images/expertise/herom.png', alt: '', fill: true, sizes: '100vw'}).props;
  return (
    <section className={styles.hero} aria-labelledby="omk-hero-title">
      <motion.div
        className={styles.imageLayer}
        aria-hidden="true"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <picture>
          <source media="(max-width: 768px)" srcSet={mobile.srcSet} sizes="100vw" />
          <Image src="/images/expertise/hero.png" alt="" fill sizes="100vw" loading="eager" fetchPriority="high" className={styles.heroImage} />
        </picture>
      </motion.div>

      <div className={styles.content}>
        <motion.h1
          id="omk-hero-title"
          className={styles.heading}
          data-client-hero-heading
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span>BUILT FOR <span style={{ color: '#0757C8' }}>REAL</span></span>{" "}
          <span><span style={{ color: '#0757C8' }}>WORLD</span> SYSTEMS</span>
        </motion.h1>
        <motion.p
          className={styles.description} data-type-role="desc"
          data-client-hero-copy
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <span>We design and build advanced products for aerospace and defense,</span>{" "}
          <span>where performance, precision and reliability are mission-critical.</span>
        </motion.p>
      </div>
    </section>
  );
}
