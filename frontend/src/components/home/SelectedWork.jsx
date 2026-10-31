"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./SelectedWork.module.css";

const PROJECTS = [
  {
    number: "01",
    name: "OFC-X",
    type: "Flight Controller",
    description:
      "High-performance, reliable and flexible flight control for autonomous platforms. Omoikane product configurations are developed around system-level requirements, interfaces, operating conditions and integration constraints.",
    image: "/images/projects/flight-controller.webp",
    alt: "OFC-X Flight Controller for autonomous platforms",
    href: "/projects",
  },
  {
    number: "02",
    name: "OESC-60 / OESC-100",
    type: "4-in-1 Electronic Speed Controller",
    description:
      "High-efficiency, high-current ESC platform for multirotor propulsion systems. Omoikane product configurations are developed around system-level requirements, interfaces, operating conditions and integration constraints.",
    image: "/images/careers/electronics/embedded-pcb.jpg",
    alt: "OESC-60 / OESC-100 4-in-1 Electronic Speed Controller platform",
    href: "/projects",
  },
  {
    number: "03",
    name: "OCOM-X",
    type: "Communication System",
    description:
      "Reliable communication architecture for connected autonomous systems. Omoikane product configurations are developed around system-level requirements, interfaces, operating conditions and integration constraints.",
    image: "/images/projects/tactical-datalink.webp",
    alt: "OCOM-X Communication System for connected autonomous systems",
    href: "/projects",
  },
  {
    number: "04",
    name: "OGN-X",
    type: "GNSS / GPS Module",
    description:
      "Precision positioning architecture for autonomous navigation and mapping. Omoikane product configurations are developed around system-level requirements, interfaces, operating conditions and integration constraints.",
    image: "/images/projects/ground-platform.webp",
    alt: "OGN-X GNSS / GPS Module for autonomous navigation and mapping",
    href: "/projects",
  },
];

export default function SelectedWork() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Preload all project preview images after first render to prevent blank flash
  useEffect(() => {
    const imagesToPreload = [
      "/images/projects/flight-controller.webp",
      "/images/careers/electronics/embedded-pcb.jpg",
      "/images/projects/tactical-datalink.webp",
      "/images/projects/ground-platform.webp",
    ];

    imagesToPreload.forEach((src) => {
      if (typeof window !== "undefined") {
        const img = new window.Image();
        img.src = src;
      }
    });
  }, []);

  const handleRowClick = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      className={styles.section}
      id="selected-work"
      aria-labelledby="selected-work-heading"
    >
      {/* Section Introduction */}
      <div className={styles.introContainer}>
        <header className={styles.header}>
          <h2 id="selected-work-heading" className={styles.heading}>
            Selected Work / Projects
          </h2>
          <p className={styles.subtitle}>
            A selection of mission-focused systems engineered for real-world deployment.
          </p>
        </header>
      </div>

      {/* Accordion Rows — stretch 100% edge-to-edge */}
      <div className={styles.accordionList} role="list">
        {PROJECTS.map((project, index) => {
          const isActive = activeIndex === index;

          return (
            <div
              key={project.number}
              className={`${styles.row} ${isActive ? styles.rowActive : styles.rowCollapsed}`}
              role="listitem"
            >
              {/* Row Header — semantic button */}
              <div className={styles.headerInner}>
                <button
                  type="button"
                  id={`project-header-${project.number}`}
                  className={styles.rowHeader}
                  onClick={() => handleRowClick(index)}
                  aria-expanded={isActive}
                  aria-controls={`project-details-${project.number}`}
                >
                  <div className={styles.headerLeft}>
                    <span className={styles.projectNumber}>{project.number}</span>
                    <div className={styles.titleGroup}>
                      <h3 className={styles.projectTitle}>{project.name}</h3>
                    </div>
                  </div>

                  <div className={styles.headerRight}>
                    <span
                      className={`${styles.toggleIcon} ${isActive ? styles.toggleIconOpen : ""}`}
                      aria-hidden="true"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </div>
                </button>
              </div>

              {/* Expandable Details Container — CSS Grid 0fr / 1fr transition */}
              <div
                id={`project-details-${project.number}`}
                role="region"
                aria-labelledby={`project-header-${project.number}`}
                className={`${styles.detailsWrapper} ${isActive ? styles.detailsWrapperOpen : ""}`}
              >
                <div className={styles.detailsInner}>
                  <div className={`${styles.detailsContent} ${isActive ? styles.detailsContentOpen : ""}`}>
                    {/* Large project image on the left */}
                    <div className={styles.imageCol}>
                      <div className={styles.imageWrapper}>
                        <Image
                          src={project.image}
                          alt={project.alt}
                          fill
                          priority={index === 0}
                          className={`${styles.projectImage} ${isActive ? styles.projectImageActive : ""}`}
                          sizes="(max-width: 860px) 100vw, 45vw"
                        />
                      </div>
                    </div>

                    {/* Project details on the right */}
                    <div className={styles.infoCol}>
                      <div className={styles.infoTop}>
                        {/* Side heading above content showing project type */}
                        <div className={styles.sideHeadingBlock}>
                          <h4 className={styles.sideHeadingTitle}>{project.type}</h4>
                        </div>

                        <p className={styles.projectDesc}>{project.description}</p>
                        <Link
                          href={project.href}
                          className={styles.ctaLink}
                        >
                          <span>Explore</span>
                          <span className={styles.ctaArrow} aria-hidden="true">&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
