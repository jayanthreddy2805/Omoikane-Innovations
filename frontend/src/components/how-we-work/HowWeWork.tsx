"use client";

import React from "react";
import styles from "./HowWeWork.module.css";

interface Principle {
  number: string;
  title: string;
  description: string;
}

const PRINCIPLES: Principle[] = [
  {
    number: "01",
    title: "BUILD FOR THE REAL WORLD",
    description: "Engineering shaped by physical systems, real environments and practical constraints.",
  },
  {
    number: "02",
    title: "WORK ACROSS DISCIPLINES",
    description: "Software, electronics and mechanical engineering brought together as one system.",
  },
  {
    number: "03",
    title: "OWN THE ENTIRE PROCESS",
    description: "From system architecture and prototyping through integration, testing and iteration.",
  },
  {
    number: "04",
    title: "SOLVE DIFFICULT PROBLEMS",
    description: "Approach demanding engineering challenges with precision, rigour and purpose.",
  },
];

export default function HowWeWork() {
  return (
    <section className={styles.section} aria-labelledby="how-we-work-heading">
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>HOW WE WORK</span>
          <h2 id="how-we-work-heading" className={styles.headline}>
            Engineering beyond<br />the expected.
          </h2>
        </header>

        <div className={styles.grid}>
          {PRINCIPLES.map((principle) => (
            <article key={principle.number} className={styles.column}>
              <div className={styles.columnDivider} aria-hidden="true" />
              <span className={styles.sequenceNumber}>{principle.number}</span>
              <h3 className={styles.columnTitle}>{principle.title}</h3>
              <p className={styles.columnDesc}>{principle.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

