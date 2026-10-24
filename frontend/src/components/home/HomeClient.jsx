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
import CapabilityStack from "./CapabilityStack";


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

// ─── Core Engineering Capabilities ────────────────────────────────
const CORE_CAPABILITIES = [
  {
    number: "01",
    title: "Embedded & Control Systems",
    description:
      "Advanced embedded electronics, flight control systems, RF communication modules, and real-time processing units engineered for precision and reliability.",
    capabilities: [
      "Flight Control Computers",
      "RF Communication Modules",
      "Real-Time Processing Units",
      "High-Precision Sensors",
    ],
  },
  {
    number: "02",
    title: "Autonomous & Robotic Platforms",
    description:
      "Development of UAV systems, autonomous ground platforms, and intelligent robotic solutions for surveillance, monitoring, and industrial automation.",
    capabilities: [
      "Autonomous UAV Systems",
      "Ground Robotic Platforms",
      "Perimeter Surveillance",
      "Intelligent Automation",
    ],
  },
  {
    number: "03",
    title: "Defense Electronics & AI Systems",
    description:
      "High-performance hardware integrated with AI-driven analytics, enabling intelligent decision-making, tracking, and mission-critical operations.",
    capabilities: [
      "AI-Driven Decision Making",
      "Multi-Object Tracking",
      "Encrypted Telemetry Links",
      "Ruggedized Payloads",
    ],
  },
  {
    number: "04",
    title: "Full-Stack System Integration",
    description:
      "Bringing electronics, firmware, and precision mechanical packaging together into cohesive, deployment-ready mission platforms.",
    capabilities: [
      "Hardware-Software Co-Design",
      "Thermal & Stress Hardening",
      "Custom Airframe Packaging",
      "Hardware-in-the-Loop Validation",
    ],
  },
];

// ─── Core Value Pillars ───────────────────────────────────────────
const CORE_PILLARS = [
  {
    code: "MCE",
    title: "Mission-Critical Engineering",
    description:
      "Our products are designed for high reliability, precision, and performance in demanding environments such as defense, aerospace, and industrial systems.",
  },
  {
    code: "IPD",
    title: "Indigenous Product Development",
    description:
      "We build and own our technologies, enabling scalable deployment, customization, and licensing across global markets.",
  },
  {
    code: "AI",
    title: "Advanced Embedded & AI Systems",
    description:
      "From embedded electronics to intelligent automation, our solutions integrate cutting-edge technologies for real-world applications.",
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
          1. HERO SECTION (EMPTY FOR NOW)
      ───────────────────────────────────────────────────────── */}
      <section className={styles.heroSection} id="hero" aria-label="Hero Section">
        <motion.div
          className={styles.heroPlaceholder}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.heroTag}>
            <span className={styles.heroTagPulse} />
            <span>HERO SECTION &bull; RESERVED</span>
          </div>
          <h1 className={styles.heroTitle}>Engineering the Future, One Idea at a Time</h1>
          <p className={styles.heroSubtitle}>
            Designing and developing mission-critical products, autonomous systems, and advanced embedded solutions for aerospace, defense, and industrial applications.
          </p>
        </motion.div>
      </section>

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
            <h2 className={styles.sectionTitle}>AEROSPACE &amp; DEFENSE AT THE CORE</h2>
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
          3. CORE CAPABILITIES / EXPERTISE
      ───────────────────────────────────────────────────────── */}
      <section id="expertise" aria-label="Core Engineering Capabilities" className={styles.capSection}>

        {/* Header text is rendered INSIDE the sticky frame at top, cards rise from bottom */}
        <CapabilityStack
          capabilities={CORE_CAPABILITIES}
          tag="[ 02 / CORE CAPABILITIES ]"
          title="CAPABILITIES THAT POWER OUR PRODUCTS"
          subtitle="We design and build advanced embedded systems, autonomous platforms, and high-performance electronics tailored for mission-critical applications across Aerospace, Defense, and Industrial domains."
        />

        {/* CTA link after the scroll stack */}
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.sectionFooterLink}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/expertise" className={styles.outlineButton}>
              <span>Explore Engineering Expertise</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </motion.div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────
          4. ABOUT US
      ───────────────────────────────────────────────────────── */}
      <section className={styles.section} id="about" aria-label="About Omoikane Innovations">
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.aboutCompact}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* LEFT */}
            <div className={styles.aboutLeft}>
              <span className={styles.sectionTag}>[ 03 / ABOUT US ]</span>
              <h2 className={styles.aboutHeadline}>
                Product-focused engineering for Aerospace, Defense &amp; Industrial domains.
              </h2>

              {/* Badge row */}
              <div className={styles.aboutBadgeRow}>
                {["100% Indigenous IP", "ISO 9001", "MSME Registered"].map((b) => (
                  <span key={b} className={styles.aboutBadge}>{b}</span>
                ))}
              </div>

              {/* Vision / Mission one-liners */}
              <div className={styles.aboutOneLiners}>
                <div className={styles.aboutOneLiner}>
                  <span className={styles.aboutOneLinerLabel}>Vision</span>
                  <span className={styles.aboutOneLinerText}>Global leader in indigenous defense &amp; embedded tech.</span>
                </div>
                <div className={styles.aboutOneLiner}>
                  <span className={styles.aboutOneLinerLabel}>Mission</span>
                  <span className={styles.aboutOneLinerText}>Design, build &amp; deliver platforms across Aerospace, Defense &amp; Industrial.</span>
                </div>
              </div>

              <Link href="/about" className={styles.aboutLink}>
                Know More <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* RIGHT — compact pillar rows */}
            <div className={styles.aboutRight}>
              {CORE_PILLARS.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  className={styles.aboutPillarRow}
                  variants={cardVariants}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                >
                  <span className={styles.pillarIcon}>{pillar.code}</span>
                  <span className={styles.aboutPillarTitle}>{pillar.title}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          5. CALL TO ACTION (CTA) SECTION
      ───────────────────────────────────────────────────────── */}
      <section className={styles.ctaSection} id="contact" aria-label="Contact and Partnership">
        <motion.div
          className={styles.ctaBox}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.ctaInner}>
            <span className={styles.ctaTag}>[ 04 / PARTNER &amp; COLLABORATE ]</span>
            <h2 className={styles.ctaHeading}>HAVE A REQUIREMENT OR COLLABORATION IN MIND?</h2>
            <p className={styles.ctaText}>
              Discover advanced embedded systems and autonomous solutions engineered for real-world deployment. Partner with us to integrate, customize, or license high-performance technologies across Aerospace, Defense, and Industrial applications.
            </p>

            <div className={styles.ctaEmailRow}>
              <a href="mailto:info@omoikaneinnovations.com" className={styles.ctaEmailLink}>
                <span>✉ info@omoikaneinnovations.com</span>
              </a>
              <a href="mailto:bd@omoikaneinnovations.com" className={styles.ctaEmailLink}>
                <span>✉ bd@omoikaneinnovations.com</span>
              </a>
            </div>

            <div className={styles.ctaActions}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href="/contact" className={styles.btnPrimary}>
                  <span>Contact Our Team</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href="/services" className={styles.btnSecondary}>
                  <span>View Products</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </motion.div>
            </div>

            <div className={styles.ctaSpecStrip}>
              <div className={styles.ctaSpecItem}>
                <span className={styles.ctaSpecDot} />
                <span>READY-TO-DEPLOY PRODUCTS</span>
              </div>
              <div className={styles.ctaSpecItem}>
                <span className={styles.ctaSpecDot} />
                <span>CUSTOMIZATION &amp; INTEGRATION</span>
              </div>
              <div className={styles.ctaSpecItem}>
                <span className={styles.ctaSpecDot} />
                <span>TECHNOLOGY LICENSING</span>
              </div>
              <div className={styles.ctaSpecItem}>
                <span className={styles.ctaSpecDot} />
                <span>GLOBAL SCALE &amp; RELIABILITY</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
