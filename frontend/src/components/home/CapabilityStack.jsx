"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./CapabilityStack.module.css";

/** Each card translates from 100% (below slot) → 0% (visible) */
function RisingCard({ cap, containerRef, start, end }) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // "100%" = card's own height below its slot (fully hidden)
  // "0%"   = natural position (fully visible)
  const y = useTransform(scrollYProgress, [start, end], ["100%", "0%"]);

  return (
    <div className={styles.cardSlot}>
      <motion.div className={styles.card} style={{ y }}>
        <span className={styles.cardNumber}>{cap.number}</span>
        <h3 className={styles.cardTitle}>{cap.title}</h3>
        <p className={styles.cardDesc}>{cap.description}</p>
        <ul className={styles.cardList}>
          {cap.capabilities.map((item) => (
            <li key={item} className={styles.cardItem}>
              <span className={styles.cardDot} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

export default function CapabilityStack({ capabilities, tag, title, subtitle }) {
  const containerRef = useRef(null);
  const n = capabilities.length; // 4
  const step = 0.8 / n;         // each card gets 20% of scroll

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{ height: `${(n + 1) * 100}vh` }}
    >
      <div className={styles.sticky}>

        {/* Header at TOP of sticky frame */}
        <div className={styles.stickyHeader}>
          <span className={styles.tag}>{tag}</span>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        {/*
          cardsZone: a NON-sticky child with overflow:hidden.
          This reliably clips cards that are below its bottom edge.
          Cards start at y:100% (below their slot) → invisible.
          As scroll progresses each card rises to y:0% → visible.
        */}
        <div className={styles.cardsZone}>
          <div className={styles.row}>
            {capabilities.map((cap, i) => (
              <RisingCard
                key={cap.title}
                cap={cap}
                containerRef={containerRef}
                start={i * step}
                end={(i + 1) * step}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
