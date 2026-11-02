"use client";

import React from "react";
import styles from "./TechMarquee.module.css";

const technologies = [
  "OrCAD",
  "Cadence Allegro",
  "Altium Designer",
  "PADS",
  "LTspice",
  "ANSYS",
  "Design Reviews",
  "DFM / DFT"
];

export function TechMarquee() {
  // The repeated set keeps the marquee continuous on wide screens.
  const displayTechs = [
    ...technologies,
    ...technologies,
    ...technologies,
    ...technologies
  ];

  return (
    <div className={styles.marqueeContainer} aria-label="Engineering tools and methods">
      <div className={styles.marqueeTrack}>
        {displayTechs.map((tech, idx) => (
          <span key={idx} className={styles.techItem} aria-hidden={idx >= technologies.length}>{tech}</span>
        ))}
      </div>
    </div>
  );
}
