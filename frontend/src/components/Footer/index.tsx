"use client";

import React from "react";
import FooterHero from "./FooterHero/FooterHero";
import FooterContent from "./FooterContent";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <FooterHero />
        <FooterContent />
      </div>
    </footer>
  );
}
