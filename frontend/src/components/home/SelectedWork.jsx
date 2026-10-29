"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./SelectedWork.module.css";

const PROJECTS = [
  {
    number: "01",
    title: "OFC-X — Flight Controller",
    category: "Flight Control",
    description:
      "High-performance, reliable and flexible flight control for autonomous platforms. Omoikane product configurations are developed around system-level requirements, interfaces, operating conditions and integration constraints.",
    image: "/images/projects/flight-controller.webp",
    alt: "OFC-X Flight Controller for autonomous platforms",
    capabilities: [
      "Real-Time Control",
      "Sensor Fusion",
      "Autonomous Guidance",
    ],
    href: "/projects",
  },
  {
    number: "02",
    title: "OESC-60 / OESC-100 — 4-in-1 Electronic Speed Controller",
    category: "Propulsion & ESC",
    description:
      "High-efficiency, high-current ESC platform for multirotor propulsion systems. Omoikane product configurations are developed around system-level requirements, interfaces, operating conditions and integration constraints.",
    image: "/images/careers/electronics/embedded-pcb.jpg",
    alt: "OESC-60 / OESC-100 4-in-1 Electronic Speed Controller platform",
    capabilities: [
      "High-Current ESC",
      "Multirotor Propulsion",
      "High Efficiency",
    ],
    href: "/projects",
  },
  {
    number: "03",
    title: "OCOM-X — Communication System",
    category: "Communications",
    description:
      "Reliable communication architecture for connected autonomous systems. Omoikane product configurations are developed around system-level requirements, interfaces, operating conditions and integration constraints.",
    image: "/images/projects/tactical-datalink.webp",
    alt: "OCOM-X Communication System for connected autonomous systems",
    capabilities: [
      "Connected Autonomy",
      "Secure Telemetry",
      "Low Latency",
    ],
    href: "/projects",
  },
  {
    number: "04",
    title: "OGN-X — GNSS / GPS Module",
    category: "Navigation & Positioning",
    description:
      "Precision positioning architecture for autonomous navigation and mapping. Omoikane product configurations are developed around system-level requirements, interfaces, operating conditions and integration constraints.",
    image: "/images/projects/ground-platform.webp",
    alt: "OGN-X GNSS / GPS Module for autonomous navigation and mapping",
    capabilities: [
      "Precision Positioning",
      "Autonomous Navigation",
      "Mapping Architecture",
    ],
    href: "/projects",
  },
];

export default function SelectedWork() {
  const [activeIndex, setActiveIndex] = useState(0);
  const hoverTimerRef = useRef(null);

  // Preload all project preview images after first render to prevent blank flash
  useEffect(() => {
    const imagesToPreload = [
      "/images/projects/flight-controller.webp",
      "/images/careers/electronics/embedded-pcb.jpg",
      "/images/projects/tactical-datalink.webp",
      "/images/projects/ground-platform.webp",
      "/images/projects/uav-platform.webp",
      "/images/projects/ai-vision.webp",
    ];

    imagesToPreload.forEach((src) => {
      if (typeof window !== "undefined") {
        const img = new window.Image();
        img.src = src;
      }
    });
  }, []);

  // Cleanup hover timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (index) => {
    // Clear any existing hover timer
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }

    // Only on hover-capable devices
    if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
      if (index === activeIndex) return;

      // 100ms hover-intent delay before activating the new row
      hoverTimerRef.current = setTimeout(() => {
        setActiveIndex(index);
        hoverTimerRef.current = null;
      }, 100);
    }
  };

  const handleMouseLeave = () => {
    // If the pointer leaves before the 100ms delay finishes, cancel pending activation
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    // Do not set active project to null on mouse leave!
  };

  const handleFocus = (index) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setActiveIndex(index);
  };

  const handleRowClick = (index) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    // Mobile tap or click: opens selected row, keeping active row open if tapped again
    setActiveIndex(index);
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
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              role="listitem"
            >
              {/* Row Header — semantic button */}
              <div className={styles.headerInner}>
                <button
                  type="button"
                  id={`project-header-${project.number}`}
                  className={styles.rowHeader}
                  onClick={() => handleRowClick(index)}
                  onFocus={() => handleFocus(index)}
                  aria-expanded={isActive}
                  aria-controls={`project-details-${project.number}`}
                >
                  <div className={styles.headerLeft}>
                    <span className={styles.projectNumber}>{project.number}</span>
                    <div className={styles.titleGroup}>
                      <span className={styles.projectCategory}>{project.category}</span>
                      <h3 className={styles.projectTitle}>{project.title}</h3>
                    </div>
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
                        <p className={styles.projectDesc}>{project.description}</p>
                        <Link
                          href={project.href}
                          className={styles.ctaLink}
                        >
                          <span>Explore</span>
                          <span className={styles.ctaArrow} aria-hidden="true">&rarr;</span>
                        </Link>
                      </div>

                      {/* Three capability blocks along bottom */}
                      <div className={styles.capabilitiesRow}>
                        {project.capabilities.map((cap) => (
                          <span key={cap} className={styles.capabilityBlock}>
                            {cap}
                          </span>
                        ))}
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
