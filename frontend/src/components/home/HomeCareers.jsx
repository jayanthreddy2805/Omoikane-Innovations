"use client";

import Link from "next/link";
import styles from "./HomeCareers.module.css";

const DISCIPLINES = [
  {
    number: "01",
    title: "Software Development",
    description: "Autonomy, AI, flight software, and real-time control platforms.",
    href: "/careers/software",
  },
  {
    number: "02",
    title: "Electronics Engineering",
    description: "Avionics, PCB architecture, RF systems, and product validation.",
    href: "/careers/electronics",
  },
  {
    number: "03",
    title: "Mechanical Engineering",
    description: "Airframes, rugged enclosures, system integration, and structural analysis.",
    href: "/careers/mechanical",
  },
];

export default function HomeCareers() {
  return (
    <section
      className={styles.careersSection}
      id="careers"
      aria-labelledby="home-careers-heading"
    >
      <div className={styles.container}>
        {/* ── 1. INTRODUCTION ── */}
        <div className={styles.introRow}>
          <h2 id="home-careers-heading" className={styles.heading}>
            CAREERS AT OMOIKANE
          </h2>
          <p className={styles.description}>
            We are hiring across software, electronics and mechanical engineering to develop embedded and autonomous systems for aerospace, defense and industrial applications.
          </p>
        </div>

        {/* ── 2. THREE DISCIPLINES (CONTENT ONLY — NO CARDS) ── */}
        <div className={styles.disciplinesGrid}>
          {DISCIPLINES.map((discipline) => (
            <Link
              key={discipline.number}
              href={discipline.href}
              className={styles.disciplineItem}
            >
              <div className={styles.itemHeader}>
                <span className={styles.itemNumber}>{discipline.number}</span>
                <span className={styles.itemArrow} aria-hidden="true">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 11.5L11.5 2.5M11.5 2.5H4M11.5 2.5V10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <h3 className={styles.itemTitle}>{discipline.title}</h3>
              <p className={styles.itemDesc}>{discipline.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
