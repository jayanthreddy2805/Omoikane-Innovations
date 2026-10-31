"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { MeshGradient } from "@paper-design/shaders-react";
import styles from "@/app/about/page.module.css";

const PARTNERS = [
  {
    title: "UAV Manufacturers",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(45 12 12)" />
      </svg>
    ),
  },
  {
    title: "Defense & Aerospace",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2.5L20.5 12L12 21.5L3.5 12Z" />
      </svg>
    ),
  },
  {
    title: "Government Agencies",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="7" y1="8" x2="17" y2="8" />
        <line x1="7" y1="12" x2="17" y2="12" />
        <line x1="7" y1="16" x2="17" y2="16" />
      </svg>
    ),
  },
  {
    title: "Industrial Automation",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="8" y1="7" x2="8" y2="17" />
        <line x1="12" y1="7" x2="12" y2="17" />
        <line x1="16" y1="7" x2="16" y2="17" />
      </svg>
    ),
  },
  {
    title: "Agriculture & Survey",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 3a3 3 0 0 0-3 3c0 .54.14 1.04.4 1.48A3 3 0 0 0 6 11a3 3 0 0 0 3.48 2.95c-.26.44-.4.94-.4 1.48a3 3 0 0 0 4 2.83V21h2v-2.74a3 3 0 0 0 4-2.83c0-.54-.14-1.04-.4-1.48A3 3 0 0 0 18 11a3 3 0 0 0-3.4-3.52c.26-.44.4-.94.4-1.48a3 3 0 0 0-3-3z"/>
      </svg>
    ),
  },
  {
    title: "System Integrators",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
      </svg>
    ),
  },
];

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

          <motion.p className={styles.ctaTagline} variants={itemVariants}>
            From Sky to Soil, We Power Possibilities
          </motion.p>

          <motion.div variants={itemVariants} style={{ marginTop: "1.25rem" }}>
            <Link href="/contact" className={styles.ctaButtonPill}>
              <Sparkles size={16} strokeWidth={2.5} />
              Contact OMOIKANE
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className={styles.ctaBottomSection}>
            <div className={styles.ctaPartnersStrip}>
              <div className={styles.ctaPartnersList}>
                {PARTNERS.map((partner) => (
                  <div key={partner.title} className={styles.ctaPartnerItem}>
                    <div className={styles.ctaPartnerIcon}>
                      {partner.icon}
                    </div>
                    <span className={styles.ctaPartnerLabel}>{partner.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
