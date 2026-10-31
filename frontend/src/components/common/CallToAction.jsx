"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { MeshGradient } from "@paper-design/shaders-react";
import styles from "@/app/about/page.module.css";

export default function CallToAction() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <section className={styles.ctaSection} id="contact" aria-label="Ready to deploy your next mission">
      <div className={styles.ctaCard}>
        {/* Dark base + purple radial glow — our CTA bg colors */}
        <div className={styles.ctaHeroBg} />

        {/* MeshGradient layer 1 — Stealth Titanium & Obsidian (slate/graphite tones over #000812) */}
        <MeshGradient
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
            opacity: 0.85,
            backgroundColor: "#000812",
          }}
          colors={["#000812", "#0F172A", "#1E293B", "#334155"]}
          speed={0.5}
        />

        {/* MeshGradient layer 2 — subtle metallic titanium highlights */}
        <MeshGradient
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.75,
            zIndex: 2,
            backgroundColor: "transparent",
          }}
          colors={["#000812", "#475569", "#000812"]}
          speed={0.35}
        />

        <motion.div
          className={styles.ctaContentCentered}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2 className={styles.ctaTitleCentered} variants={itemVariants}>
            Ready to deploy your next <em>mission?</em>
          </motion.h2>

          <motion.div variants={itemVariants} style={{ marginTop: "1.5rem" }}>
            <Link href="/contact" className={styles.ctaButtonPill}>
              <Sparkles size={16} strokeWidth={2.5} />
              Contact OMOIKANE
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className={styles.ctaBottomSection}>
            <p className={styles.ctaSublabel}>BUILT FOR PERFORMANCE AND RELIABILITY.</p>
            <div className={styles.ctaTagsWrapper}>
              <div className={styles.ctaTags}>
                <span className={styles.ctaTag}>Embedded Systems</span>
                <span className={styles.ctaTag}>Flight Control</span>
                <span className={styles.ctaTag}>AI Integration</span>
                <span className={styles.ctaTag}>Robotic Platforms</span>
                <span className={styles.ctaTag}>Defense Tech</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
