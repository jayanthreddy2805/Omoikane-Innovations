"use client";

import Link from "@/components/shared/IntentLink";
import Image from "next/image";
import { m as motion } from "framer-motion";
import {
  Navigation,
  Cpu,
  Radio,
  Shield,
  Activity,
  Layers,
  Zap,
  ArrowDown,
  ArrowUpRight,
} from "lucide-react";
import styles from "@/app/page.module.css";
import CallToAction from "@/components/shared/CallToAction";
import SelectedWork from "@/components/features/home/SelectedWork";
import HomeCareers from "@/components/features/home/HomeCareers";
import HeroComposition from "@/components/features/home/HeroComposition";


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
      "We combine embedded electronics, control software and intelligent automation around the operating requirements of each platform.",
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
          1. HERO SECTION
      ───────────────────────────────────────────────────────── */}
      <section className={styles.heroSection} id="hero" aria-labelledby="hero-headline">
        <div className={styles.heroGrid}>
          {/* Left Column: Premium Editorial Typography & CTAs */}
          <div className={styles.heroLeftCol}>
            <motion.div
              className={styles.heroEyebrowBadge}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={styles.heroEyebrowText}>INDIGENOUS TECHNOLOGY</span>
              <span className={styles.heroEyebrowDivider} aria-hidden="true">|</span>
              <span className={styles.heroEyebrowText}>GLOBAL STANDARDS</span>
            </motion.div>

            <motion.h1
              id="hero-headline"
              className={styles.heroHeadline}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Flight control,<br />
              embedded electronics<br />
              and autonomous&nbsp;systems
            </motion.h1>

            <motion.p
              className={styles.heroPhilosophy}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              We design and develop products for OEMs, UAV manufacturers, system integrators and engineering teams, tailored to their platform and operating requirements.
            </motion.p>

            <motion.div
              className={styles.heroActions}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href="#selected-work" className={styles.heroBtnPrimary}>
                <span>EXPLORE OUR WORK</span>
                <ArrowDown size={14} aria-hidden="true" />
              </Link>
              <Link href="/contact#contact-form" className={styles.heroBtnSecondary}>
                <span>CONTACT US</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </motion.div>
          </div>

          {/* Right Column: BeGlobe Reference Visual Composition (Without Images) */}
          <motion.div
            className={styles.heroRightCol}
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroComposition />
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          2. PROJECTS & FOCUSED PRODUCTION AREAS (CORE EXPERTISE)
      ───────────────────────────────────────────────────────── */}
      <section className={styles.expertiseSection} id="projects" aria-label="Focused Production Areas and Products">
        <div className={styles.sectionInner}>
          <motion.header
            className={styles.sectionHeader}
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
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
              <Link href="/expertise#aerospace" className={`${styles.bentoCard} ${styles.bentoCardTall}`}>
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
                    sizes="(max-width: 959px) calc(100vw - 124px), (max-width: 1288px) calc(53.5vw - 115px), 574px"
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
                <Link href="/expertise#defense" className={`${styles.bentoCard} ${styles.bentoCardHorizontal}`}>
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
                      sizes="(max-width: 680px) calc(100vw - 124px), 190px"
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
                <Link href="/expertise#automotive" className={`${styles.bentoCard} ${styles.bentoCardHorizontal}`}>
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
                      sizes="(max-width: 680px) calc(100vw - 124px), 190px"
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
              <Link href="/expertise#railways" className={`${styles.bentoCard} ${styles.bentoCardWide}`}>
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
                    sizes="(max-width: 680px) calc(100vw - 124px), 320px"
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
            <Link href="/work" className={styles.outlineButton}>
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
                    alt=""
                    width={180}
                    height={140}
                    sizes="142px"
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
