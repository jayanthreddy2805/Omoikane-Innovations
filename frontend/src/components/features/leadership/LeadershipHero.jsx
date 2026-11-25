"use client";

import styles from "./LeadershipHero.module.css";
import Image from "@/components/shared/LoadAwareImage";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LeadershipHero() {
  return (
    <div className={styles.page}>
      <section className={styles.canvas}>
        {/* Central visual Stage */}
        <motion.div 
          className={styles.visualStage}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.visualPlaceholder}>
            <div className={styles.placeholderBody} style={{ border: 'none', background: 'transparent' }}>
               <Image 
                  src="/images/leadership/uav-architecture-blueprint.png" 
                  alt="UAV Architecture" 
                  fill 
                  className={styles.desktopBlueprint}
                  style={{ objectFit: 'contain', padding: '10px' }} 
                  priority
                  sizes="(min-width: 761px) 75vw, 100vw"
               />
               <Image 
                  src="/images/leadership/uav-architecture-blueprint-mobile.png" 
                  alt="UAV Architecture" 
                  width={1080}
                  height={1350}
                  className={styles.mobileBlueprint}
                  style={{ objectFit: 'contain' }} 
                  priority
                  sizes="100vw"
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
            <em data-italic>vision</em> & <em data-italic>precision</em>
          </h1>
        </motion.div>

        <motion.div 
          className={styles.descriptionContainer}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className={styles.actualDesc}>
            Senior oversight connects hardware, firmware, autonomy and system integration from early requirements through prototype validation.
          </p>
          <p className={styles.actualDesc}>
            We work with UAV manufacturers, system integrators and industrial teams on products designed around their platform and operating conditions.
          </p>
        </motion.div>



      </section>
    </div>
  );
}
