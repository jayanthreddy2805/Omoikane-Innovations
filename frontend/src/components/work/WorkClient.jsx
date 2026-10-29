"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./WorkClient.module.css";
import CallToAction from "@/components/common/CallToAction";
import TechnologyEngineering from "@/components/home/TechnologyEngineering";

const WORK_SYSTEMS = [
  {
    id: "ofc-x",
    number: "01",
    title: "OFC-X — Flight Controller",
    description:
      "High-performance, reliable and flexible flight control for autonomous platforms. Omoikane product configurations are developed around system-level requirements, interfaces, operating conditions and integration constraints.",
    considerationsHeading: "Key design considerations",
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
      "High-efficiency, high-current ESC platform for multirotor propulsion systems. Omoikane product configurations are developed around system-level requirements, interfaces, operating conditions and integration constraints.",
    considerationsHeading: "Key design considerations",
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
      "Precision positioning architecture for autonomous navigation and mapping. Omoikane product configurations are developed around system-level requirements, interfaces, operating conditions and integration constraints.",
    considerationsHeading: "Key design considerations",
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
      "Reliable communication architecture for connected autonomous systems. Omoikane product configurations are developed around system-level requirements, interfaces, operating conditions and integration constraints.",
    considerationsHeading: "Key design considerations",
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

export default function WorkClient() {
  return (
    <div className={styles.pageContainer}>
      {/* ── 1. OUR WORK EDITORIAL INTRO SECTION ── */}
      <section className={styles.heroSection} aria-labelledby="work-page-heading">
        <div className={styles.heroContentWrapper}>
          {/* Top-left eyebrow */}
          <div className={styles.eyebrow}>
            [ 02 / OUR WORK ]
          </div>

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

        {/* Focus Areas Horizontal Engineering Index */}
        <div className={styles.focusIndexContainer}>
          <div className={styles.focusIndexInner}>
            <span className={styles.focusIndexLabel}>FOCUS AREAS</span>
            <nav className={styles.focusIndexNav} aria-label="Work focus areas">
              <Link href="/work#ofc-x" className={styles.focusIndexLink}>
                <span className={styles.focusIndexNumber}>01</span>
                <span className={styles.focusIndexText}>FLIGHT CONTROLLERS</span>
              </Link>
              <Link href="/work#oesc" className={styles.focusIndexLink}>
                <span className={styles.focusIndexNumber}>02</span>
                <span className={styles.focusIndexText}>ELECTRONIC SPEED CONTROLLERS</span>
              </Link>
              <Link href="/work#ogn-x" className={styles.focusIndexLink}>
                <span className={styles.focusIndexNumber}>03</span>
                <span className={styles.focusIndexText}>GNSS / GPS</span>
              </Link>
              <Link href="/work#ocom-x" className={styles.focusIndexLink}>
                <span className={styles.focusIndexNumber}>04</span>
                <span className={styles.focusIndexText}>COMMUNICATION SYSTEMS</span>
              </Link>
            </nav>
          </div>
        </div>
      </section>

      {/* ── 2. TECHNOLOGY & ENGINEERING MATRIX ── */}
      <TechnologyEngineering />

      {/* ── 3. SHOWCASE ROWS (MATCHING REFERENCE DESIGN) ── */}
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
                  <p className={styles.productDescription}>{system.description}</p>

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

                  {/* Action Link */}
                  <div className={styles.actionsRow}>
                    <Link
                      href={`/contact?subject=${encodeURIComponent(system.inquireSubject)}`}
                      className={styles.learnMoreLink}
                    >
                      <span>Learn more</span>
                      <ArrowUpRight size={15} />
                    </Link>
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
