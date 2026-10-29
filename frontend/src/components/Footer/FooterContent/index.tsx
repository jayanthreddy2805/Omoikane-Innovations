"use client";

import React from "react";
import Link from "next/link";
import styles from "../Footer.module.css";

export default function FooterContent() {
  return (
    <>
      {/* Main Grid */}
      <div className={styles.grid}>
        {/* Column 1 */}
        <div className={styles.col}>
          <h4 className={styles.colHeader}>NAVIGATE</h4>
          <ul className={styles.linkList}>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/expertise">Expertise</Link></li>
            <li><Link href="/work">Our Work</Link></li>
            <li><Link href="/leadership">Leadership</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div className={styles.col}>
          <h4 className={styles.colHeader}>QUICK LINKS</h4>
          <ul className={styles.linkList}>
            <li><Link href="/expertise">Software Development</Link></li>
            <li><Link href="/expertise">Electronics</Link></li>
            <li><Link href="/expertise">Mechanical</Link></li>
            <li><Link href="/about#faq">FAQ</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div className={styles.col}>
          <h4 className={`${styles.colHeader} ${styles.contactHeader}`}>CONTACT</h4>
          <ul className={styles.iconList}>
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <a href="mailto:info@omoikaneinnovations.com">info@omoikaneinnovations.com</a>
            </li>
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <a href="mailto:bd@omoikaneinnovations.com">bd@omoikaneinnovations.com</a>
            </li>
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.85 3.4 2 2 0 0 1 3.85 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.93 5.93l1.01-1.01a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <a href="tel:+918861035848">+91-8861035848</a>
            </li>
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.85 3.4 2 2 0 0 1 3.85 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.93 5.93l1.01-1.01a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <a href="tel:+919353627825">+91-9353627825</a>
            </li>
          </ul>
        </div>

        {/* Column 4: Social */}
        <div className={`${styles.col} ${styles.socialCol}`}>
          <h4 className={`${styles.colHeader} ${styles.socialHeader}`}>SOCIAL</h4>
          <div className={styles.socialList}>
            <a href="https://in.linkedin.com/company/omoikane-innovations" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Omoikane Innovations on LinkedIn">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
          </div>
        </div>

        {/* Column 5: Newsletter subscriber — anchored to bottom */}
        <div className={styles.colSubscribe}>
          <h4 className={styles.colHeader}>STAY INFORMED</h4>
          <p className={styles.subscribeDesc}>For company updates, product enquiries, and partnership information, contact our team.</p>
          <Link href="/contact" className={styles.subscribeLink}>Contact us for updates →</Link>
        </div>
      </div>

      {/* Bottom Section */}
      <div className={styles.footerBottom}>
        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} OMOIKANE INNOVATIONS. All rights reserved.
        </div>
      </div>
    </>
  );
}
