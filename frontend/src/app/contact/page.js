import React from 'react';
import styles from './page.module.css';

export default function ContactPage() {
  return (
    <div className={styles.contactContainer}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.heading}>Get In Touch</h1>
        
        <p className={styles.subtext}>
          We collaborate with organizations building the next generation of autonomous and embedded technologies.
        </p>

        <div className={styles.contactDetails}>
          <div className={styles.detailGroup}>
            <span className={styles.groupLabel}>Headquarters</span>
            <p className={styles.detailText}>OMOIKANE INNOVATIONS</p>
            <p className={styles.detailText}>Bangalore, India</p>
          </div>

          <div className={styles.detailGroup}>
            <span className={styles.groupLabel}>General Inquiries</span>
            <p className={styles.detailText}>
              <a href="mailto:info@omoikaneinnovations.com" className={styles.link}>
                info@omoikaneinnovations.com
              </a>
            </p>
          </div>

          <div className={styles.detailGroup}>
            <span className={styles.groupLabel}>Business Development</span>
            <p className={styles.detailText}>
              <a href="mailto:bd@omoikaneinnovations.com" className={styles.link}>
                bd@omoikaneinnovations.com
              </a>
            </p>
          </div>

          <div className={styles.detailGroup}>
            <span className={styles.groupLabel}>Direct Lines</span>
            <p className={styles.detailText}>
              <a href="tel:+918861035848" className={styles.link}>+91-8861035848</a>
            </p>
            <p className={styles.detailText}>
              <a href="tel:+919353627825" className={styles.link}>+91-9353627825</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
