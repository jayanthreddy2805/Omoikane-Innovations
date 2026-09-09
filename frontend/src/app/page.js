import styles from './page.module.css';
import Link from 'next/link';
import KeyCapabilities from '@/components/sections/KeyCapabilities';

export default function Home() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.headline}>
            ENGINEERING THE NEXT GENERATION OF <span className={styles.highlight}>MISSION-CRITICAL SYSTEMS</span>
          </h1>
          <p className={styles.subheadline}>
            Advanced UAVs, embedded electronics, autonomous platforms and defense technologies engineered for real-world deployment.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/technologies" className={styles.ctaPrimary}>
              Explore Our Technologies
            </Link>
            <Link href="/contact" className={styles.ctaSecondary}>
              Talk to Our Engineering Team
            </Link>
          </div>
        </div>
        <div className={styles.heroBackground}>
          {/* Subtle grid pattern will be applied here via CSS */}
          <div className={styles.gridOverlay}></div>
        </div>
      </section>
      
      <KeyCapabilities />
    </div>
  );
}
