"use client";

import { expertise } from "@/components/features/expertise/expertiseData";
import { useState } from "react";
import Link from "@/components/shared/IntentLink";
import Image from "@/components/shared/LoadAwareImage";
import { m as motion } from "framer-motion";
import {
  Navigation,
  Cpu,
  Radio,
  Shield,
  Activity,
  Layers,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import styles from "@/app/page.module.css";
import CallToAction from "@/components/shared/CallToAction";
import SelectedWork from "@/components/features/home/SelectedWork";
import HomeCareers from "@/components/features/home/HomeCareers";
import { ClientHomeHero } from "@/components/shared/ClientReferenceHero";


// ─── Mobile Expertise Carousel Slides ─────────────────────────────
const EXPERTISE_VISUALS = {
  aerospace: {image: '/images/about/domain-air.jpg', alt: 'Aerospace engineering illustration', icons: [Navigation, Cpu, Radio]},
  defense: {image: '/images/about/domain-ground.jpg', alt: 'Defense engineering illustration', icons: [Shield, Activity, Radio]},
  automotive: {image: '/images/careers/electronics/embedded-pcb.jpg', alt: 'Automotive electronics illustration', icons: [Cpu, Zap, Layers]},
  railways: {image: '/images/about/domain-industrial.jpg', alt: 'Industrial engineering illustration', icons: [Activity, Layers, Shield]},
};
const EXPERTISE_SLIDES = expertise.map(item => ({
  title: item.title, href: `/expertise#${item.id}`, ...EXPERTISE_VISUALS[item.id],
  items: item.systems.map((label, index) => { const Icon = EXPERTISE_VISUALS[item.id].icons[index]; return {icon: <Icon size={16} />, label}; }),
}));

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

function expertiseCard(id, variant, index) {
  const item = EXPERTISE_SLIDES.find(slide => slide.href.endsWith(`#${id}`));
  if (!item) return null;
  return (<motion.div key={item.href} variants={cardVariants} custom={index} initial="hidden" whileInView="visible" viewport={{once: true, margin: '-40px'}} className={variant === 'wide' ? styles.bentoCardWideWrap : undefined} style={variant === 'horizontal' ? {flex: 1} : undefined}>
                <Link href={item.href} className={`${styles.bentoCard} ${variant === 'wide' ? styles.bentoCardWide : variant === 'horizontal' ? styles.bentoCardHorizontal : styles.bentoCardTall}`}>
                  <div className={styles.bentoTextCol}>
                    <h3 className={styles.bentoTitle}>{item.title}</h3>
                    <div className={styles.bentoMetaList}>{item.items.map(system => <div key={system.label} className={styles.bentoMetaItem}><span className={styles.bentoMetaIcon}>{system.icon}</span><span>{system.label}</span></div>)}</div>
                  </div>
                  <div className={styles.bentoImgWrapper}><Image src={item.image} alt={item.alt} fill className={styles.bentoCardImg} sizes={variant === 'horizontal' ? '(max-width: 680px) calc(100vw - 124px), 190px' : '(max-width: 959px) calc(100vw - 124px), 45vw'} /></div>
                </Link>
              </motion.div>);
}

export default function HomeClient() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? EXPERTISE_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === EXPERTISE_SLIDES.length - 1 ? 0 : prev + 1));
  };

  const activeExpertise = EXPERTISE_SLIDES[currentSlide];

  return (
    <div className={styles.pageContainer}>
      {/* ─────────────────────────────────────────────────────────
          1. HERO SECTION
      ───────────────────────────────────────────────────────── */}
      <ClientHomeHero />

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
              We build advanced products for mission-critical Aerospace and Defense systems, extending to selected industrial domains.
            </p>
          </motion.header>

          <div className={styles.bentoGrid}>
            {expertiseCard('aerospace', 'tall', 0)}
            <div className={styles.bentoRightStack}>{expertiseCard('defense', 'horizontal', 1)}{expertiseCard('automotive', 'horizontal', 2)}</div>
            {expertiseCard('railways', 'wide', 3)}
          </div>

          {/* ── Mobile Expertise Carousel (<= 768px) ── */}
          <div className={styles.expertiseCarousel}>
            <div className={styles.carouselHeader}>
              <h3 className={styles.carouselTitle}>{activeExpertise.title}</h3>
              <div className={styles.bentoMetaList}>
                {activeExpertise.items.map((item) => (
                  <div key={item.label} className={styles.bentoMetaItem}>
                    <span className={styles.bentoMetaIcon}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.carouselVisualWrapper}>
              <Image
                src={activeExpertise.image}
                alt={activeExpertise.alt}
                fill
                className={styles.bentoCardImg}
                sizes="calc(100vw - 3rem)"
              />
              <button
                type="button"
                className={`${styles.carouselArrowBtn} ${styles.carouselArrowLeft}`}
                onClick={prevSlide}
                aria-label="Previous slide"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className={`${styles.carouselArrowBtn} ${styles.carouselArrowRight}`}
                onClick={nextSlide}
                aria-label="Next slide"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className={styles.carouselFooter}>
              <Link href={activeExpertise.href} className={styles.carouselExploreLink}>
                Explore possibilities &rarr;
              </Link>
              <div className={styles.carouselCounter}>
                <strong>{currentSlide + 1}</strong> / {EXPERTISE_SLIDES.length}
              </div>
            </div>
          </div>


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
                <h3 className={`${styles.whyCardTitle} ${pillar.code === "IPD" ? styles.whyCardTitleSingleLine : ""}`}>
                  {pillar.title}
                </h3>
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
