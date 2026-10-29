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
  // Repeat array 4 times (2 sets of 2) for seamless infinite scrolling on all screen widths
  const displayTechs = [
    ...technologies,
    ...technologies,
    ...technologies,
    ...technologies
  ];

  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeTrack}>
        {displayTechs.map((tech, idx) => (
          <React.Fragment key={idx}>
            <span className={styles.techItem}>{tech}</span>
            <span className={styles.dot} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
