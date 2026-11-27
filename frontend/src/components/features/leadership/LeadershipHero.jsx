"use client";

import styles from "./LeadershipHero.module.css";
import Image from "@/components/shared/LoadAwareImage";
import { getImageProps } from "next/image";
import Link from "next/link";
import { m as motion } from "framer-motion";

export default function LeadershipHero() {
  const mobile = getImageProps({src:'/images/leadership/uav-architecture-blueprint-mobile.png',alt:'',width:1080,height:1350,sizes:'100vw'}).props;
  return (
    <div className={styles.page} data-type-role="LeadershipHero">
      <section className={styles.canvas} data-type-role="LeadershipHero">
        {/* Central visual Stage */}
        <motion.div 
          className={styles.visualStage} data-type-role="LeadershipHero tag"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.visualPlaceholder} data-type-role="LeadershipHero">
            <div className={styles.placeholderBody} data-type-role="LeadershipHero" style={{ border: 'none', background: 'transparent' }}>
               <picture>
                 <source media="(max-width: 768px)" srcSet={mobile.srcSet} sizes="(min-width: 601px) 480px, 100vw" />
                 <Image src="/images/leadership/uav-architecture-blueprint.png" alt="UAV Architecture" fill className={styles.blueprintImage} loading="eager" fetchPriority="high" sizes="(min-width:761px) 75vw,100vw" />
               </picture>
            </div>
          </div>
        </motion.div>

        {/* Interaction/issue tooltip removed */}
      </section>

      {/* Bottom editorial band */}
      <section className={styles.infoBand} data-type-role="LeadershipHero">
        <motion.div 
          className={styles.headlineContainer} data-type-role="LeadershipHero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className={styles.actualTitle} data-type-role="LeadershipHero actualTitle">
            LEADERSHIP BUILT ON <br/>
            <em data-italic>vision</em> & <em data-italic>precision</em>
          </h1>
        </motion.div>

        <motion.div 
          className={styles.descriptionContainer} data-type-role="LeadershipHero desc"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className={styles.actualDesc} data-type-role="LeadershipHero actualDesc">
            Senior oversight connects hardware, firmware, autonomy and system integration from early requirements through prototype validation.
          </p>
          <p className={styles.actualDesc} data-type-role="LeadershipHero actualDesc">
            We work with UAV manufacturers, system integrators and industrial teams on products designed around their platform and operating conditions.
          </p>
        </motion.div>



      </section>
    </div>
  );
}
