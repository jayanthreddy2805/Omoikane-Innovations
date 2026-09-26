"use client";

import React from 'react';
import styles from './page.module.css';
import { GradientBackground } from '@/components/ui/almoayyed';
import LeadershipGallery from '@/components/leadership/LeadershipGallery';

export default function LeadershipPage() {
  return (
    <div className={styles.pageContainer}>
      {/* Full Page Gradient Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -10, pointerEvents: 'none' }}>
        <GradientBackground style={{ width: '100%', height: '100%' }} />
      </div>

      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>
              <span style={{ whiteSpace: 'nowrap' }}>LEADERSHIP BUILT ON</span> <br/>
              <span className={styles.heroItalic}>vision</span> & <span className={styles.heroItalic}>precision</span>
            </h1>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroText}>
              <p>Omoikane drives technological leaps by aligning deep-tech engineering with autonomous systems from day one.</p>
              <p>Our senior-led team partners with defense and enterprise sectors to build robust, bleeding-edge platforms that guarantee operational superiority.</p>
            </div>
            <div className={styles.buttonGroup}>
              <button className={styles.btnPrimary}>EXPLORE</button>
              <button className={styles.btnSecondary}>CONTACT US</button>
            </div>
          </div>
        </div>
      </section>
      
      <LeadershipGallery />
    </div>
  );
}
