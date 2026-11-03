"use client";

import React from "react";
import Image from "next/image";
import styles from "./TechMarquee.module.css";

interface ToolItem {
  id: string;
  name: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

const tools: ToolItem[] = [
  {
    id: "orcad",
    name: "OrCAD",
    src: "/images/tools/orcad.svg",
    alt: "Cadence OrCAD",
    width: 145,
    height: 36,
  },
  {
    id: "allegro",
    name: "Cadence Allegro",
    src: "/images/tools/allegro.svg",
    alt: "Cadence Allegro",
    width: 135,
    height: 36,
  },
  {
    id: "altium",
    name: "Altium Designer",
    src: "/images/tools/altium.svg",
    alt: "Altium Designer",
    width: 140,
    height: 32,
  },
  {
    id: "pads",
    name: "PADS",
    src: "/images/tools/pads.svg",
    alt: "Siemens Mentor PADS",
    width: 105,
    height: 34,
  },
  {
    id: "ltspice",
    name: "LTspice",
    src: "/images/tools/ltspice.svg",
    alt: "Linear Technology LTspice",
    width: 52,
    height: 38,
  },
  {
    id: "ansys",
    name: "ANSYS",
    src: "/images/tools/ansys.svg",
    alt: "ANSYS Simulation Suite",
    width: 106,
    height: 34,
  },
];

// Replicate list to provide robust track width across large / ultra-wide screens
const toolSequence = [...tools, ...tools];

export function TechMarquee() {
  return (
    <section 
      className={styles.marqueeContainer} 
      aria-label="Industry-standard EDA and simulation software tools"
    >
      <div className={styles.marqueeTrack}>
        {/* Track Group 1 (interactive & accessible) */}
        <div className={styles.marqueeGroup}>
          {toolSequence.map((tool, idx) => (
            <div 
              key={`track-a-${tool.id}-${idx}`} 
              className={styles.logoCard}
              title={tool.name}
              aria-label={tool.name}
            >
              <Image
                src={tool.src}
                alt={tool.alt}
                width={tool.width}
                height={tool.height}
                className={styles.toolLogo}
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* Track Group 2 (seamless continuation, hidden from screen readers) */}
        <div className={styles.marqueeGroup} aria-hidden="true">
          {toolSequence.map((tool, idx) => (
            <div 
              key={`track-b-${tool.id}-${idx}`} 
              className={styles.logoCard}
              title={tool.name}
            >
              <Image
                src={tool.src}
                alt={tool.alt}
                width={tool.width}
                height={tool.height}
                className={styles.toolLogo}
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
