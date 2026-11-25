"use client";

import React from "react";
import Link from "@/components/shared/IntentLink";
import { OPEN_COOKIE_PREFERENCES_EVENT } from "@/lib/cookieConsent";
import NewsletterSubscriptionForm from "../NewsletterSubscription/NewsletterSubscriptionForm";
import styles from "../Footer.module.css";

export default function FooterContent() {
  return (
    <>
      {/* Main Grid */}
      <div className={styles.grid}>
        {/* Column 1 */}
        <div className={styles.col}>
          <h3 className={styles.colHeader}>NAVIGATE</h3>
          <ul className={styles.linkList}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/expertise">Technology</Link></li>
            <li><Link href="/work">Products</Link></li>
            <li><Link href="/careers">Careers</Link></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div className={styles.col}>
          <h3 className={styles.colHeader}>QUICK LINKS</h3>
          <ul className={styles.linkList}>
            <li><Link href="/services/software">Software Development</Link></li>
            <li><Link href="/services/electronics">Electrical Engineering</Link></li>
            <li><Link href="/services/mechanical">Mechanical</Link></li>
            <li><Link href="/about#faq">FAQ</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div className={styles.col}>
          <h3 className={`${styles.colHeader} ${styles.contactHeader}`}>CONTACT</h3>
          <ul className={styles.iconList}>
            <li>
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <a href="mailto:info@omoikaneinnovations.com">info@omoikaneinnovations.com</a>
            </li>
            <li>
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <a href="mailto:bd@omoikaneinnovations.com">bd@omoikaneinnovations.com</a>
            </li>
            <li>
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.85 3.4 2 2 0 0 1 3.85 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.93 5.93l1.01-1.01a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <a href="tel:+918861035848">+91-8861035848</a>
            </li>
            <li>
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.85 3.4 2 2 0 0 1 3.85 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.93 5.93l1.01-1.01a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <a href="tel:+919353627825">+91-9353627825</a>
            </li>
          </ul>
        </div>

        {/* Column 4: Social */}
        <div className={`${styles.col} ${styles.socialCol}`}>
          <h3 className={`${styles.colHeader} ${styles.socialHeader}`}>SOCIAL</h3>
          <div className={styles.socialList}>
            <a href="https://in.linkedin.com/company/omoikane-innovations" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            </a>
            <a href="https://wa.me/918861035848" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="WhatsApp">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.11-.23-.17-.48-.29" /></svg>
            </a>
          </div>
        </div>

        {/* Column 5: Company updates subscription */}
        <div className={styles.colSubscribe}>
          <h3 className={styles.colHeader}>COMPANY UPDATES</h3>
          <p className={styles.subscribeDesc}>Receive occasional product and company news from Omoikane.</p>
          <NewsletterSubscriptionForm />
        </div>
      </div>

      {/* Bottom Section */}
      <div className={styles.footerBottom}>
        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} OMOIKANE INNOVATIONS. All rights reserved.
        </div>
        <div className={styles.legalLinks}>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <button
            className={styles.legalButton}
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES_EVENT))}
          >
            Cookie settings
          </button>
        </div>
      </div>
    </>
  );
}
