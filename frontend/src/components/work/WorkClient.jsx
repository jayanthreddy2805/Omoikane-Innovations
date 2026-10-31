"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import styles from "./WorkClient.module.css";
import CallToAction from "@/components/common/CallToAction";
import TechnologyEngineering from "@/components/home/TechnologyEngineering";

const WORK_SYSTEMS = [
  {
    id: "ofc-x",
    number: "01",
    title: "OFC-X — Flight Controller",
    description:
      "High-performance, reliable and flexible flight control for autonomous platforms.",
    engineering:
      "Omoikane develops flight controller configurations around MCU options, sensor and I/O interfaces, and the platform's operating conditions.",
    considerationsHeading: "Technical and integration considerations",
    considerationsCol1: [
      "STM32 / AT32 MCU options",
      "Multiple I/O and sensor interfaces",
      "Designed for demanding UAV applications",
    ],
    considerationsCol2: [
      "System integration and interface requirements",
      "Prototype evaluation and validation planning",
    ],
    images: {
      main: "/images/projects/flight-controller.webp",
      top: "/images/careers/electronics/embedded-pcb.jpg",
      bottom: "/images/leadership/uav-architecture-blueprint.png",
      alt: "OFC-X Flight Controller hardware and architecture",
    },
    inquireSubject: "OFC-X Flight Controller",
  },
  {
    id: "oesc",
    number: "02",
    title: "OESC-60 / OESC-100 — 4-in-1 Electronic Speed Controller",
    description:
      "High-efficiency, high-current ESC platform for multirotor propulsion systems.",
    engineering:
      "The 4-in-1 controller is developed with 60A / 100A variants, 6S–12S platform options, and current and thermal protection in scope.",
    considerationsHeading: "Technical and integration considerations",
    considerationsCol1: [
      "60A / 100A variants",
      "6S–12S platform options",
      "Advanced current and thermal protection",
    ],
    considerationsCol2: [
      "System integration and interface requirements",
      "Prototype evaluation and validation planning",
    ],
    images: {
      main: "/images/careers/electronics/embedded-pcb.jpg",
      top: "/images/careers/electronics/systems.jpg",
      bottom: "/images/capabilities/cap-03.jpg",
      alt: "OESC-60 / OESC-100 4-in-1 Electronic Speed Controller platform",
    },
    inquireSubject: "OESC-60 / OESC-100 Electronic Speed Controller",
  },
  {
    id: "ogn-x",
    number: "03",
    title: "OGN-X — GNSS / GPS Module",
    description:
      "Precision positioning architecture for autonomous navigation and mapping.",
    engineering:
      "The module's engineering scope includes multi-constellation GNSS options, an RTK-ready architecture, and compact integration for the host platform.",
    considerationsHeading: "Technical and integration considerations",
    considerationsCol1: [
      "Multi-constellation GNSS options",
      "RTK-ready architecture",
      "Compact, rugged integration",
    ],
    considerationsCol2: [
      "System integration and interface requirements",
      "Prototype evaluation and validation planning",
    ],
    images: {
      main: "/images/projects/ground-platform.webp",
      top: "/images/projects/flight-controller.webp",
      bottom: "/images/about/domain-air.jpg",
      alt: "OGN-X GNSS / GPS Module for autonomous navigation",
    },
    inquireSubject: "OGN-X GNSS / GPS Module",
  },
  {
    id: "ocom-x",
    number: "04",
    title: "OCOM-X — Communication System",
    description:
      "Reliable communication architecture for connected autonomous systems.",
    engineering:
      "The system is developed around RF / LTE integration options, secure link architecture, and low-power design requirements.",
    considerationsHeading: "Technical and integration considerations",
    considerationsCol1: [
      "RF / LTE integration options",
      "Secure link architecture",
      "Low-power design approach",
    ],
    considerationsCol2: [
      "System integration and interface requirements",
      "Prototype evaluation and validation planning",
    ],
    images: {
      main: "/images/projects/tactical-datalink.webp",
      top: "/images/about/domain-ground.jpg",
      bottom: "/images/contact/aeronautical-drawing-sketch.png",
      alt: "OCOM-X Communication System transceiver and datalink",
    },
    inquireSubject: "OCOM-X Communication System",
  },
];

const FOCUS_AREAS = [
  {
    id: "aerospace",
    title: "Aerospace",
    subtitle: "High reliability. Mission critical.",
    href: "/work#ofc-x",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(45 12 12)" />
      </svg>
    ),
  },
  {
    id: "defense",
    title: "Defense",
    subtitle: "Trusted. Secure. Indigenous.",
    href: "/work#ogn-x",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2.5L20.5 12L12 21.5L3.5 12Z" />
      </svg>
    ),
  },
  {
    id: "embedded-systems",
    title: "Embedded Systems",
    subtitle: "Intelligent hardware. Real impact.",
    href: "/work#ocom-x",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <rect x="2.5" y="2.5" width="3.5" height="3.5" rx="0.6" />
        <rect x="8" y="2.5" width="3.5" height="3.5" rx="0.6" />
        <rect x="13.5" y="2.5" width="3.5" height="3.5" rx="0.6" />
        <rect x="19" y="2.5" width="3.5" height="3.5" rx="0.6" />
        <rect x="2.5" y="8" width="3.5" height="3.5" rx="0.6" />
        <rect x="8" y="8" width="3.5" height="3.5" rx="0.6" />
        <rect x="13.5" y="8" width="3.5" height="3.5" rx="0.6" />
        <rect x="19" y="8" width="3.5" height="3.5" rx="0.6" />
        <rect x="2.5" y="13.5" width="3.5" height="3.5" rx="0.6" />
        <rect x="8" y="13.5" width="3.5" height="3.5" rx="0.6" />
        <rect x="13.5" y="13.5" width="3.5" height="3.5" rx="0.6" />
        <rect x="19" y="13.5" width="3.5" height="3.5" rx="0.6" />
        <rect x="2.5" y="19" width="3.5" height="3.5" rx="0.6" />
        <rect x="8" y="19" width="3.5" height="3.5" rx="0.6" />
        <rect x="13.5" y="19" width="3.5" height="3.5" rx="0.6" />
        <rect x="19" y="19" width="3.5" height="3.5" rx="0.6" />
      </svg>
    ),
  },
  {
    id: "uav-solutions",
    title: "UAV Solutions",
    subtitle: "Autonomous. Precise. Future ready.",
    href: "/work#oesc",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
      </svg>
    ),
  },
];

export default function WorkClient() {
  return (
    <div className={styles.pageContainer}>
      {/* ── 1. OUR WORK EDITORIAL INTRO SECTION ── */}
      <section className={styles.heroSection} aria-labelledby="work-page-heading">
        <div className={styles.heroContentWrapper}>
          {/* Main Headline: Sans uppercase line 1 + Italic serif line 2 */}
          <h1 id="work-page-heading" className={styles.mainHeadline}>
            <span className={styles.headlineSans}>FROM SYSTEM DESIGN</span>
            <span className={styles.headlineSerif}>TO TESTED HARDWARE.</span>
          </h1>

          {/* Supporting Copy */}
          <div className={styles.supportingCopy}>
            <p className={styles.copyParagraph}>
              We work with OEMs, UAV manufacturers, system integrators and engineering teams to align hardware design with platform requirements.
            </p>
            <p className={styles.copyParagraph}>
              We design and develop high-performance electronics and autonomous systems for a safer, smarter and more self-reliant future.
            </p>
          </div>
        </div>

        {/* Focus Areas Horizontal Strip */}
        <div className={styles.focusStripContainer}>
          <div className={styles.focusStripTrack} role="list" aria-label="Work focus areas">
            {FOCUS_AREAS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={styles.focusStripItem}
                role="listitem"
              >
                <div className={styles.focusIconBox}>
                  {item.icon}
                </div>
                <div className={styles.focusTextBox}>
                  <h3 className={styles.focusTitle}>{item.title}</h3>
                  <p className={styles.focusSubtitle}>{item.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. TECHNOLOGY & ENGINEERING MATRIX ── */}
      <TechnologyEngineering />

      {/* ── 3. PRODUCT PROFILES ── */}
      <section className={styles.showcaseSection} aria-label="Our Work Product Configurations">
        <div className={styles.showcaseContainer}>
          {WORK_SYSTEMS.map((system, index) => (
            <article
              key={system.id}
              id={system.id}
              className={`${styles.productRow} ${index % 2 === 1 ? styles.rowReversed : ""}`}
            >
              {/* Left Column: Overlapping 3-Card Collage */}
              <div className={styles.collageCol}>
                <div className={styles.collageCanvas}>
                  {/* Base Primary Card */}
                  <div className={styles.baseCard}>
                    <Image
                      src={system.images.main}
                      alt={system.images.alt}
                      fill
                      className={styles.cardImage}
                      sizes="(max-width: 960px) 100vw, 35vw"
                    />
                  </div>

                  {/* Top-Right Overlapping Card */}
                  <div className={styles.topCard}>
                    <Image
                      src={system.images.top}
                      alt={`${system.title} hardware view`}
                      fill
                      className={styles.cardImage}
                      sizes="(max-width: 960px) 50vw, 20vw"
                    />
                  </div>

                  {/* Bottom-Left Overlapping Card */}
                  <div className={styles.bottomCard}>
                    <Image
                      src={system.images.bottom}
                      alt={`${system.title} engineering view`}
                      fill
                      className={styles.cardImage}
                      sizes="(max-width: 960px) 50vw, 20vw"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Typography & Checkmark Table */}
              <div className={styles.editorialCol}>
                {/* Enormous ghost watermark number behind text */}
                <span className={styles.ghostWatermark} aria-hidden="true">
                  {system.number}
                </span>

                <div className={styles.editorialBody}>
                  <h2 className={styles.productTitle}>{system.title}</h2>
                  <h3 className={styles.profileLabel}>Product purpose</h3>
                  <p className={styles.productDescription}>{system.description}</p>
                  <h3 className={styles.profileLabel}>Engineering scope</h3>
                  <p className={styles.productDescription}>{system.engineering}</p>

                  <h3 className={styles.considerationsHeading}>
                    {system.considerationsHeading}
                  </h3>

                  {/* 2-Column Key Design Considerations List with Hairline Rules */}
                  <div className={styles.featuresGrid}>
                    <div className={styles.featureCol}>
                      {system.considerationsCol1.map((item) => (
                        <div key={item} className={styles.featureItem}>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className={styles.featureCol}>
                      {system.considerationsCol2.map((item) => (
                        <div key={item} className={styles.featureItem}>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>


                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── 4. CALL TO ACTION ── */}
      <CallToAction />
    </div>
  );
}
