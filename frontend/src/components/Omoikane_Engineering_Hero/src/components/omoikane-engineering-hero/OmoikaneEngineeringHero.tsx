"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./OmoikaneEngineeringHero.module.css";

const capabilities = [
  { n: "01", title: "Aerospace systems", detail: "UAV platforms, flight electronics and integrated sensing." },
  { n: "02", title: "Defense engineering", detail: "Autonomous ground platforms, embedded systems and resilient communications." },
  { n: "03", title: "Embedded & RF", detail: "Control electronics, firmware, telemetry and connected hardware." },
];

export function OmoikaneEngineeringHero() {
  const [active, setActive] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  useEffect(() => {
    if (panelOpen) return;
    const timer = window.setInterval(() => setActive(v => (v + 1) % capabilities.length), 5200);
    return () => window.clearInterval(timer);
  }, [panelOpen]);
  const selected = capabilities[active];

  return (
    <section className={styles.hero} aria-labelledby="omk-hero-title">
      <div className={styles.imageLayer} aria-hidden="true" />
      <div className={styles.leftWash} aria-hidden="true" />
      <div className={styles.blueprintGrid} aria-hidden="true" />
      <svg className={styles.routeOverlay} viewBox="0 0 1440 760" preserveAspectRatio="none" aria-hidden="true">
        <path className={styles.route} pathLength="1" d="M -20 590 C 190 535 250 635 420 545 S 620 440 760 470 S 1000 430 1120 310 S 1280 235 1460 170" />
        <path className={styles.routeFine} d="M 510 0 C 620 120 580 205 700 265 S 920 320 980 435" />
        <circle r="4" className={styles.routeDot}><animateMotion dur="9s" repeatCount="indefinite" path="M -20 590 C 190 535 250 635 420 545 S 620 440 760 470 S 1000 430 1120 310 S 1280 235 1460 170" /></circle>
      </svg>
      <div className={styles.topline}><span className={styles.status} /><span>OMOIKANE INNOVATIONS</span><i /><span>ENGINEERING SYSTEMS</span><span className={styles.toplineRight}>BUILT FOR REAL-WORLD SYSTEMS</span></div>
      <div className={styles.content}>
        <p className={styles.eyebrow}>AEROSPACE · DEFENSE · INTELLIGENT SYSTEMS</p>
        <h1 id="omk-hero-title" className={styles.heading}><span>ENGINEERED</span><span className={styles.headingSecond}>FOR REAL-WORLD</span><span className={styles.headingThird}>SYSTEMS<span className={styles.accentDot}>.</span></span></h1>
        <p className={styles.description}>We design and build advanced products for aerospace and defense, combining embedded electronics, autonomous platforms and integrated engineering for mission-critical applications.</p>
        <div className={styles.actions}>
          <Link className={styles.primaryCta} href="#expertise"><span>EXPLORE OUR EXPERTISE</span><span className={styles.arrow} aria-hidden="true">↗</span></Link>
          <button className={styles.secondaryCta} type="button" onClick={() => setPanelOpen(v => !v)} aria-expanded={panelOpen}>{panelOpen ? "CLOSE CAPABILITIES" : "VIEW CAPABILITIES"}<span>{panelOpen ? "−" : "+"}</span></button>
        </div>
      </div>
      <div className={styles.visualLabel} aria-hidden="true"><span>FIELD SYSTEMS / 01</span><span className={styles.visualLabelRule} /><span>ENGINEERING VISUALIZATION</span></div>
      <div className={styles.bottomLeft} aria-hidden="true"><span>BENGALURU, INDIA</span><i /><span>ADVANCED SYSTEMS</span></div>
      <div className={styles.capabilityRail}>
        <div className={styles.railHeader}><span>CAPABILITY INDEX</span><span>0{active + 1} / 03</span></div>
        {capabilities.map((item, index) => <button key={item.n} type="button" className={`${styles.capabilityItem} ${index === active ? styles.capabilityActive : ""}`} onClick={() => { setActive(index); setPanelOpen(true); }} aria-pressed={index === active}><span className={styles.capNumber}>{item.n}</span><span className={styles.capTitle}>{item.title}</span><span className={styles.capArrow} aria-hidden="true">↗</span></button>)}
      </div>
      {panelOpen && <aside className={styles.detailPanel} aria-live="polite"><button type="button" className={styles.panelClose} onClick={() => setPanelOpen(false)} aria-label="Close capability details">×</button><span className={styles.panelKicker}>ENGINEERING CAPABILITY / {selected.n}</span><h2>{selected.title}</h2><p>{selected.detail}</p><div className={styles.panelFooter}><span>OMK / SYSTEMS</span><span>DETAIL VIEW ↗</span></div></aside>}
      <div className={styles.bottomRule} aria-hidden="true"><span>INTEGRATED BY DESIGN</span><i /><span>PRECISION IN EVERY LAYER</span><b>01 — 03</b></div>
    </section>
  );
}
