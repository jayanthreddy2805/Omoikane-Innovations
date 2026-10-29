"use client";

import React, { useState } from "react";
import styles from "./TechnologyEngineering.module.css";

const DISCIPLINES = [
  {
    number: "01",
    name: "Hardware Design",
    description: "Architecture, schematic capture, PCB layout and design reviews.",
  },
  {
    number: "02",
    name: "Embedded Platforms",
    description: "MCU / SoC selection, board bring-up and hardware-software integration support.",
  },
  {
    number: "03",
    name: "RF & GNSS",
    description: "Wireless, positioning and communication subsystem design.",
  },
  {
    number: "04",
    name: "System Integration",
    description: "Interfaces, power distribution, subsystem integration and test planning.",
  },
  {
    number: "05",
    name: "Power Electronics",
    description: "Power management, ESC architecture, protection and thermal considerations.",
  },
  {
    number: "06",
    name: "Prototyping & Validation",
    description: "Prototype iteration, functional checks and engineering validation support.",
  },
];

export default function TechnologyEngineering() {
  const [activeMobileIndex, setActiveMobileIndex] = useState(null);

  const handleCellClick = (index) => {
    setActiveMobileIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      className={styles.section}
      id="technology-engineering"
      aria-labelledby="tech-matrix-heading"
    >
      <div className={styles.container}>
        {/* ── 1. UPPER-LEFT EDITORIAL INTRODUCTION ── */}
        <header className={styles.header}>
          <h2 id="tech-matrix-heading" className={styles.headline}>
            TECHNOLOGY & ENGINEERING
          </h2>
          <div className={styles.subheadline}>
            Concept to validated hardware.
          </div>
          <p className={styles.supportingCopy}>
            We combine deep domain expertise with structured engineering processes to develop robust, high-performance solutions for demanding environments.
          </p>
        </header>

        {/* ── 2. PRECISE 3-COLUMN × 2-ROW CAPABILITY MATRIX ── */}
        <div className={styles.matrixGrid}>
          {DISCIPLINES.map((discipline, index) => {
            const isActive = activeMobileIndex === index;

            return (
              <div
                key={discipline.number}
                className={`${styles.cell} ${isActive ? styles.cellActive : ""}`}
                onClick={() => handleCellClick(index)}
                tabIndex={0}
                role="button"
                aria-expanded={isActive}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCellClick(index);
                  }
                }}
              >
                <span className={styles.number}>{discipline.number}</span>

                <div className={styles.textContainer}>
                  <h3 className={styles.name}>{discipline.name}</h3>
                  <p className={styles.description}>{discipline.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
