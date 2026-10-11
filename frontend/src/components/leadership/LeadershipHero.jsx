"use client";

import styles from "./LeadershipHero.module.css";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LeadershipHero() {
  return (
    <main className={styles.page}>
      <section className={styles.canvas}>
        {/* Engineering canvas controls */}
        <span className={`${styles.cross} ${styles.crossTopLeft}`} />
        <span className={`${styles.cross} ${styles.crossTopRight}`} />
        <span className={`${styles.cross} ${styles.crossBottomLeft}`} />
        <span className={`${styles.cross} ${styles.crossBottomRight}`} />

        <span className={styles.topTicks} />
        <span className={styles.bottomTicks} />

        <span className={styles.leftTicks} />
        <span className={styles.rightTicks} />

        {/* Technical red guide */}
        <span className={styles.redHorizontal} />
        <span className={styles.redVertical} />

        {/* Tiny technical coordinate placeholder removed */}

        {/* Central visual Stage */}
        <motion.div 
          className={styles.visualStage}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.visualPlaceholder}>
            <span className={`${styles.placeholderCorner} ${styles.topLeft}`} />
            <span className={`${styles.placeholderCorner} ${styles.topRight}`} />
            <span className={`${styles.placeholderCorner} ${styles.bottomLeft}`} />
            <span className={`${styles.placeholderCorner} ${styles.bottomRight}`} />

            <div className={styles.placeholderBody} style={{ border: 'none', background: 'transparent' }}>
               <Image 
                  src="/images/leadership/123-transparent.png" 
                  alt="UAV Architecture" 
                  fill 
                  style={{ objectFit: 'contain', padding: '10px' }} 
                  priority
                  unoptimized={true}
               />
            </div>
          </div>
        </motion.div>

        {/* Interaction/issue tooltip removed */}
      </section>

      {/* Bottom editorial band */}
      <section className={styles.infoBand}>
        <motion.div 
          className={styles.headlineContainer}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className={styles.actualTitle}>
            LEADERSHIP BUILT ON <br/>
            <span style={{ fontStyle: 'italic', textTransform: 'lowercase', fontWeight: 400 }}>vision</span> & <span style={{ fontStyle: 'italic', textTransform: 'lowercase', fontWeight: 400 }}>precision</span>
          </h1>
        </motion.div>

        <motion.div 
          className={styles.descriptionContainer}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className={styles.actualDesc}>
            Omoikane drives technological leaps by aligning deep-tech engineering with autonomous systems from day one.
          </p>
          <p className={styles.actualDesc}>
            Our senior-led team partners with defense and enterprise sectors to build robust, bleeding-edge platforms that guarantee operational superiority.
          </p>
        </motion.div>



      </section>
    </main>
  );
}
