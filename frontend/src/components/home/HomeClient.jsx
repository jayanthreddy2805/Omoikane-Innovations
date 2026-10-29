"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Navigation,
  Cpu,
  Radio,
  Shield,
  Activity,
  Layers,
  Zap,
} from "lucide-react";
import styles from "@/app/page.module.css";
import CallToAction from "@/components/common/CallToAction";
import SelectedWork from "@/components/home/SelectedWork";
import HomeCareers from "@/components/home/HomeCareers";


// ─── Focused Production Areas & Products ──────────────────────────
const FOCUSED_PRODUCTION_AREAS = [
  {
    index: "01",
    title: "Aerospace",
    category: "Aviation & UAVs",
    description:
      "We design and develop advanced UAV platforms, flight control systems, avionics, and RF communication modules engineered for precision, stability, and real-time performance in high-reliability aerospace environments.",
    specs: ["UAV Platforms", "Flight Control Systems", "Avionics Integration", "RF Telemetry Modules"],
    href: "/services",
  },
  {
    index: "02",
    title: "Defense",
    category: "Defense Technologies",
    description:
      "Our defense-grade products include secure communication systems, surveillance technologies, and autonomous platforms built for high reliability, real-time operations, and electronic resilience.",
    specs: ["Secure Communication", "Tactical Surveillance", "Autonomous Platforms", "Rugged Electronics"],
    href: "/services",
  },
  {
    index: "03",
    title: "Automotive",
    category: "Mobility & Embedded",
    description:
      "We deliver intelligent automotive electronics, ECU solutions, and real-time embedded systems that support next-generation mobility, functional safety, and vehicle automation.",
    specs: ["Automotive ECU Solutions", "Real-Time Embedded Systems", "Vehicle Automation", "Functional Safety"],
    href: "/services",
  },
  {
    index: "04",
    title: "Railways",
    category: "Industrial & Transit",
    description:
      "Our solutions enable predictive maintenance, industrial automation, and intelligent control systems designed for large-scale, high-efficiency operations across industrial and transit networks.",
    specs: ["Predictive Maintenance", "Industrial Automation", "Intelligent Control Systems", "High Reliability at Scale"],
    href: "/services",
  },
];


// ─── Why Our Products Stand Out ───────────────────────────────────
const WHY_US_PILLARS = [
  {
    code: "MCE",
    title: "Mission-Critical Engineering",
    description:
      "Our products are designed for high reliability, precision, and performance in demanding environments such as defense, aerospace, and industrial systems.",
    image: "/images/why-us/mission-critical.jpg",
  },
  {
    code: "IPD",
    title: "Indigenous Product Development",
    description:
      "We build and own our technologies, enabling scalable deployment, customization, and licensing across global markets.",
    image: "/images/why-us/indigenous-tech.jpg",
  },
  {
    code: "AI",
    title: "Advanced Embedded & AI Systems",
    description:
      "From embedded electronics to intelligent automation, our solutions integrate cutting-edge technologies for real-world applications.",
    image: "/images/why-us/embedded-ai.jpg",
  },
];

// ─── Subtle Animation Variants ────────────────────────────────────
const headerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function HomeClient() {
  return (
    <div className={styles.pageContainer}>
      {/* ─────────────────────────────────────────────────────────
          1. HERO SECTION (RESERVED GAP)
      ───────────────────────────────────────────────────────── */}
      <section className={styles.heroSection} id="hero" aria-label="Hero Section" />

      {/* ─────────────────────────────────────────────────────────
          2. PROJECTS & FOCUSED PRODUCTION AREAS
      ───────────────────────────────────────────────────────── */}
      <section className={styles.section} id="projects" aria-label="Focused Production Areas and Products">
        <div className={styles.sectionInner}>
          <motion.header
            className={styles.sectionHeader}
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <span className={styles.sectionTag}>[ 01 / FOCUSED PRODUCTION AREAS ]</span>
            <h2 className={styles.sectionTitle}>CORE EXPERTISE</h2>
            <p className={styles.sectionSubtitle}>
              We primarily design and build advanced products for Aerospace and Defense applications, where performance, precision, and reliability are mission-critical. Our capabilities also extend to selected industrial domains.
            </p>
          </motion.header>

          <div className={styles.bentoGrid}>
            {/* ── Left Column: Tall Card (Aerospace) ── */}
            <motion.div
              variants={cardVariants}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              <Link href="/services" className={`${styles.bentoCard} ${styles.bentoCardTall}`}>
                <div className={styles.bentoTextCol}>
                  <h3 className={styles.bentoTitle}>Aerospace</h3>
                  <div className={styles.bentoMetaList}>
                    <div className={styles.bentoMetaItem}>
                      <span className={styles.bentoMetaIcon}><Navigation size={16} /></span>
                      <span>Autonomous UAV Platforms</span>
                    </div>
                    <div className={styles.bentoMetaItem}>
                      <span className={styles.bentoMetaIcon}><Cpu size={16} /></span>
                      <span>Flight Control Systems</span>
                    </div>
                    <div className={styles.bentoMetaItem}>
                      <span className={styles.bentoMetaIcon}><Radio size={16} /></span>
                      <span>RF Telemetry &amp; Avionics</span>
                    </div>
                  </div>
                </div>

                <div className={styles.bentoImgWrapper}>
                  <Image
                    src="/images/about/domain-air.jpg"
                    alt="Aerospace and autonomous flight platform"
                    fill
                    className={styles.bentoCardImg}
                    sizes="(max-width: 960px) 100vw, 50vw"
                  />
                </div>
              </Link>
            </motion.div>

            {/* ── Right Column: Stack of 2 Horizontal Cards ── */}
            <div className={styles.bentoRightStack}>
              {/* Defense Card */}
              <motion.div
                variants={cardVariants}
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                style={{ flex: 1 }}
              >
                <Link href="/services" className={`${styles.bentoCard} ${styles.bentoCardHorizontal}`}>
                  <div className={styles.bentoTextCol}>
                    <h3 className={styles.bentoTitle}>Defense</h3>
                    <div className={styles.bentoMetaList}>
                      <div className={styles.bentoMetaItem}>
                        <span className={styles.bentoMetaIcon}><Shield size={16} /></span>
                        <span>Secure Tactical Datalinks</span>
                      </div>
                      <div className={styles.bentoMetaItem}>
                        <span className={styles.bentoMetaIcon}><Activity size={16} /></span>
                        <span>Real-Time Surveillance</span>
                      </div>
                      <div className={styles.bentoMetaItem}>
                        <span className={styles.bentoMetaIcon}><Radio size={16} /></span>
                        <span>Rugged Defense Electronics</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.bentoImgWrapper}>
                    <Image
                      src="/images/about/domain-ground.jpg"
                      alt="Defense technologies and tactical platforms"
                      fill
                      className={styles.bentoCardImg}
                      sizes="(max-width: 960px) 100vw, 25vw"
                    />
                  </div>
                </Link>
              </motion.div>

              {/* Automotive Card */}
              <motion.div
                variants={cardVariants}
                custom={2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                style={{ flex: 1 }}
              >
                <Link href="/services" className={`${styles.bentoCard} ${styles.bentoCardHorizontal}`}>
                  <div className={styles.bentoTextCol}>
                    <h3 className={styles.bentoTitle}>Automotive</h3>
                    <div className={styles.bentoMetaList}>
                      <div className={styles.bentoMetaItem}>
                        <span className={styles.bentoMetaIcon}><Cpu size={16} /></span>
                        <span>Intelligent ECU Solutions</span>
                      </div>
                      <div className={styles.bentoMetaItem}>
                        <span className={styles.bentoMetaIcon}><Zap size={16} /></span>
                        <span>Real-Time Embedded Systems</span>
                      </div>
                      <div className={styles.bentoMetaItem}>
                        <span className={styles.bentoMetaIcon}><Layers size={16} /></span>
                        <span>Vehicle Automation</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.bentoImgWrapper}>
                    <Image
                      src="/images/careers/electronics/embedded-pcb.jpg"
                      alt="Intelligent automotive electronics and ECUs"
                      fill
                      className={styles.bentoCardImg}
                      sizes="(max-width: 960px) 100vw, 25vw"
                    />
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* ── Wide Card: Railways & Industry (Full Width) ── */}
            <motion.div
              variants={cardVariants}
              custom={3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className={styles.bentoCardWideWrap}
            >
              <Link href="/services" className={`${styles.bentoCard} ${styles.bentoCardWide}`}>
                <div className={styles.bentoTextCol}>
                  <h3 className={styles.bentoTitle}>Railways</h3>
                  <div className={styles.bentoMetaList}>
                    <div className={styles.bentoMetaItem}>
                      <span className={styles.bentoMetaIcon}><Activity size={16} /></span>
                      <span>Predictive Maintenance Systems</span>
                    </div>
                    <div className={styles.bentoMetaItem}>
                      <span className={styles.bentoMetaIcon}><Layers size={16} /></span>
                      <span>Industrial Process Automation</span>
                    </div>
                    <div className={styles.bentoMetaItem}>
                      <span className={styles.bentoMetaIcon}><Shield size={16} /></span>
                      <span>Intelligent Control at Scale</span>
                    </div>
                  </div>
                </div>

                <div className={styles.bentoImgWrapper}>
                  <Image
                    src="/images/about/domain-industrial.jpg"
                    alt="Railway automation and industrial systems"
                    fill
                    className={styles.bentoCardImg}
                    sizes="(max-width: 960px) 100vw, 35vw"
                  />
                </div>
              </Link>
            </motion.div>
          </div>

          <motion.div
            className={styles.sectionFooterLink}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/services" className={styles.outlineButton}>
              <span>View All Products &amp; Solutions</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          2.5. SELECTED WORK (EDITORIAL PROJECT INDEX)
      ───────────────────────────────────────────────────────── */}
      <SelectedWork />

      {/* ─────────────────────────────────────────────────────────
          3. WHY OUR PRODUCTS STAND OUT
      ───────────────────────────────────────────────────────── */}
      <section className={styles.whySection} id="why-us" aria-label="Why Our Products Stand Out">
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.whyHeader}
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <h2 className={styles.whyHeadline}>Why Our Products Stand Out</h2>
            <p className={styles.whySubtitle}>
              Engineered for absolute reliability, indigenous ownership, and high performance across Aerospace, Defense, and Industrial applications.
            </p>
          </motion.div>

          <div className={styles.whyGrid}>
            {WHY_US_PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                className={styles.whyCard}
                variants={cardVariants}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
              >
                <div className={styles.whyCardVisual}>
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    width={180}
                    height={140}
                    className={styles.whyCardImg}
                  />
                </div>
                <h3 className={styles.whyCardTitle}>{pillar.title}</h3>
                <p className={styles.whyCardDesc}>{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* ─────────────────────────────────────────────────────────
          4. CAREERS (HOMEPAGE CAREERS SECTION)
      ───────────────────────────────────────────────────────── */}
      <HomeCareers />

      {/* ─────────────────────────────────────────────────────────
          5. CALL TO ACTION (REGULAR CTA)
      ───────────────────────────────────────────────────────── */}
      <CallToAction />
    </div>
  );
}
