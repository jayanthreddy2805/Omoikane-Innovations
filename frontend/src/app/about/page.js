"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { MeshGradient } from '@paper-design/shaders-react';
import styles from './page.module.css';
import { AnimatedNumberBg } from "@/components/ui/AnimatedNumberBg";
/* ─────────────────────────────────────────────────────────
   DESIGN TOKENS (page-level, extend global)
───────────────────────────────────────────────────────── */
// bg: #030914 | surface: #07111F | signal: #A7A8A5 | text: #F2F5F8

/* ─────────────────────────────────────────────────────────
   MICRO-COMPONENTS
───────────────────────────────────────────────────────── */

function ScrambleText({ text, delay = 0 }) {
  const [displayText, setDisplayText] = useState('');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const chars = '!<>-_\\\\/[]{}—=+*^?#_';
  
  useEffect(() => {
    if (!inView) return;
    
    let frame = 0;
    const totalFrames = 40;
    const queue = [];
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === ' ') {
        queue.push({ char, start: 0, end: 0 });
      } else {
        const start = Math.floor(Math.random() * 20);
        const end = start + Math.floor(Math.random() * 20) + 10;
        queue.push({ char, start, end });
      }
    }
    
    const timeout = setTimeout(() => {
      const update = () => {
        let output = '';
        let complete = 0;
        
        for (let i = 0; i < queue.length; i++) {
          let { char, start, end } = queue[i];
          if (frame >= end) {
            output += char;
            complete++;
          } else if (frame >= start) {
            output += chars[Math.floor(Math.random() * chars.length)];
          } else {
            output += '';
          }
        }
        
        setDisplayText(output);
        if (complete === queue.length) return;
        frame++;
        requestAnimationFrame(update);
      };
      update();
    }, delay * 1000);
    
    return () => clearTimeout(timeout);
  }, [inView, text, delay]);
  
  return <span ref={ref}>{displayText || <span style={{ opacity: 0 }}>{text}</span>}</span>;
}

function RevealText({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <div ref={ref} className={`${styles.revealWrap} ${className}`}>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function FadeUp({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function TechnicalDivider() {
  return <div className={styles.technicalDivider} aria-hidden="true" />;
}

function SignalLine({ vertical = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div
      ref={ref}
      className={vertical ? styles.signalLineV : styles.signalLineH}
      aria-hidden="true"
    >
      <motion.div
        className={styles.signalLineFill}
        initial={{ scaleX: vertical ? 1 : 0, scaleY: vertical ? 0 : 1 }}
        animate={inView ? { scaleX: 1, scaleY: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        style={{ transformOrigin: vertical ? 'top' : 'left' }}
      />
    </div>
  );
}

function Counter({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const target = parseInt(value, 10);
    let frame = 0;
    const total = 60;
    const run = () => {
      frame++;
      const progress = frame / total;
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (frame < total) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }, [inView, value]);
  return <span ref={ref}>{display}{suffix}</span>;
}

/* ─────────────────────────────────────────────────────────
   SECTION 01 — HERO
───────────────────────────────────────────────────────── */
function AboutHero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const textY = useTransform(scrollYProgress, [0, 0.6], ['0%', '-12%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 0.4]);

  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [hovered, setHovered] = useState(null);

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  const annotations = [
    { id: 'sensor', label: 'SENSOR', x: '62%', y: '22%' },
    { id: 'compute', label: 'COMPUTE', x: '78%', y: '48%' },
    { id: 'control', label: 'CONTROL', x: '58%', y: '68%' },
    { id: 'link', label: 'LINK', x: '85%', y: '30%' },
  ];

  const springX = useSpring(mouse.x, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouse.y, { stiffness: 60, damping: 20 });

  return (
    <section
      className={styles.hero}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      aria-label="About Omoikane Innovations"
    >
      {/* Background video with parallax */}
      <motion.div className={styles.heroImageWrap} style={{ y: imageY }}>
        <video
          src="/videos/omoikane.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{ width: '110%', height: '110%', objectFit: 'cover', objectPosition: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(1.10)' }}
        />
      </motion.div>

      {/* Progressive overlay on scroll */}
      <motion.div className={styles.heroScrollOverlay} style={{ opacity: overlayOpacity }} />







    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   SECTION 01.5 — VISION
───────────────────────────────────────────────────────── */
function AboutVision() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className={styles.vision} ref={ref}>
      <div className={styles.visionNoise}></div>
      <div className={styles.visionInner}>
        <FadeUp delay={0.1}>
          <h2 className={styles.visionHeading}>OUR VISION</h2>
        </FadeUp>
        <div className={styles.visionWatermark}>VISION</div>
        <div className={styles.visionDivider}></div>
        <FadeUp delay={0.2}>
          <p className={styles.visionText}>
            To become a global leader in indigenous defense and embedded technologies, building high-performance systems that are reliable, scalable, and ready for real-world deployment.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   SECTION 02 — THE OMOIKANE SYSTEM
───────────────────────────────────────────────────────── */
const SYSTEM_NODES = [
  { id: 'embedded', label: 'EMBEDDED &\nCONTROL SYSTEMS', desc: 'Advanced embedded electronics, flight control, RF communications, and real-time processing engineered for precision and reliability.' },
  { id: 'autonomous', label: 'AUTONOMOUS &\nROBOTIC PLATFORMS', desc: 'UAVs, autonomous ground platforms, and intelligent robotic systems for surveillance, monitoring, and industrial operations.' },
  { id: 'defense', label: 'DEFENSE ELECTRONICS\n& AI', desc: 'High-performance electronics integrated with AI for decision support, tracking, sensing, and mission-critical operations.' },
];

function OmoikaneSystemArchitecture() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className={styles.system} ref={ref}>
      <div className={styles.systemInner}>
        


        {/* Editorial Hero */}
        <div className={styles.editorialHero}>
          <FadeUp delay={0.1}>
            <h2 className={styles.editorialHeading}>
              Capabilities built for complex missions.
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className={styles.editorialSub}>
              We combine embedded systems, autonomy, robotics, and AI to develop reliable technology for demanding operational environments.
            </p>
          </FadeUp>
        </div>

        {/* The 6-Node Editorial Grid */}
        <div className={styles.editorialGrid}>
          {SYSTEM_NODES.map((node, i) => (
            <motion.div 
              key={node.id}
              className={styles.editorialCard}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + (i * 0.1), duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className={styles.editorialCardTitle}>{node.label.replace('\n', ' ')}</h3>
              <p className={styles.editorialCardDesc}>{node.desc}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Strong Section Ending */}
        <FadeUp delay={0.5}>
          <div className={styles.editorialFooter}>
            <div className={styles.editorialFooterRule} />
            <div className={styles.editorialFooterContent}>
              <span className={styles.editorialFooterStatement}>
                From embedded hardware to autonomous intelligence — engineered as one system.
              </span>
              <Link href="/services/electronics" className={styles.editorialFooterLink}>
                Explore our expertise <span className={styles.editorialArrow}>→</span>
              </Link>
            </div>
          </div>
        </FadeUp>
        
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   SECTION 03 — MISSION DOMAINS
───────────────────────────────────────────────────────── */
const DOMAINS = [
  {
    id: 'air',
    index: '01',
    label: 'AEROSPACE',
    focus: 'Autonomous aerial systems — navigation, control, sensing, real-time decisions.',
    detail: 'Fixed-wing, rotary, and multi-rotor aerial platforms designed for persistent surveillance, payload delivery, and intelligence gathering across complex airspace.',
    accent: '#A7A8A5',
    image: '/images/about/domain-air.jpg',
    imageAlt: 'Autonomous aerial platform representing Omoikane air systems capabilities.',
    imagePosition: 'center 30%',
    gradient: 'linear-gradient(90deg, rgba(10,12,16,0.9) 0%, rgba(10,12,16,0.6) 30%, rgba(10,12,16,0.1) 60%, transparent 80%)',
    tags: ['UAV SYSTEMS', 'FLIGHT CONTROL', 'AERIAL SENSING', 'NAVIGATION'],
    align: 'left',
  },
  {
    id: 'industrial',
    index: '02',
    label: 'INDUSTRIAL',
    focus: 'Automation, embedded control, and machine intelligence for demanding environments.',
    detail: 'High-performance embedded control systems, process automation platforms, and precision robotics for manufacturing, energy, and logistics.',
    accent: '#A7A8A5',
    image: '/images/about/domain-industrial.jpg',
    imageAlt: 'Precision robotic actuator machinery representing Omoikane industrial automation capabilities.',
    imagePosition: 'center center',
    gradient: 'linear-gradient(90deg, rgba(10,12,16,0.98) 0%, rgba(10,12,16,0.85) 25%, rgba(10,12,16,0.4) 55%, transparent 80%)',
    tags: ['PROCESS AUTOMATION', 'PRECISION ROBOTICS', 'EMBEDDED CONTROL', 'INDUSTRIAL IoT'],
    align: 'left',
  },
  {
    id: 'defense',
    index: '03',
    label: 'DEFENSE',
    focus: 'Mission-critical electronics, situational awareness, AI-assisted capabilities.',
    detail: 'Advanced electronics and intelligent systems supporting C4ISR, signal processing, secure communications, and autonomous decision support in operational environments.',
    accent: '#E6E5E1',
    image: '/images/about/domain-ground.jpg',
    imageAlt: 'Rugged mission electronics representing Omoikane defense technology capabilities.',
    imagePosition: 'center 40%',
    gradient: 'linear-gradient(90deg, rgba(10,12,16,0.95) 0%, rgba(10,12,16,0.75) 30%, rgba(10,12,16,0.2) 60%, transparent 80%)',
    tags: [],
    align: 'left',
  },
];

function MissionDomainExplorer() {
  const [active, setActive] = useState('defense');
  const [hovered, setHovered] = useState(false);
  const activeDomain = DOMAINS.find((d) => d.id === active);

  return (
    <section className={styles.domains}>
      <div className={styles.domainsInner}>
        {/* Header — left-aligned, above the image block */}
        <div className={styles.domainsHeader}>

          <FadeUp delay={0.08}>
            <h2 className={styles.domainsHeading}>MISSION DOMAINS</h2>
          </FadeUp>
          <FadeUp delay={0.14}>
            <p className={styles.domainsSub}>
              Technology for environments where reliability, awareness, and performance matter.
            </p>
          </FadeUp>
        </div>

        {/* Full-bleed cinematic image + overlay panel */}
        <FadeUp delay={0.1}>
          <div className={styles.domainStage}>
            {/* Image layer — all four stacked, crossfade between them */}
            <div className={styles.domainImageStack}>
              {DOMAINS.map((d) => (
                <div
                  key={d.id}
                  className={`${styles.domainImageLayer} ${active === d.id ? styles.domainImageLayerActive : ''}`}
                >
                  <Image
                    src={d.image}
                    alt={d.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 70vw"
                    style={{
                      objectFit: 'cover',
                      objectPosition: d.imagePosition,
                      transform: active === d.id && hovered ? 'scale(1.02)' : 'scale(1)',
                      transition: 'transform 1.4s cubic-bezier(0.16,1,0.3,1)',
                    }}
                  />
                  <div 
                    className={styles.domainImageGrad} 
                    style={{ background: d.gradient }} 
                  />
                </div>
              ))}
            </div>

            {/* Glass Pill Tab Selector */}
            <div className={styles.domainTabs}>
              {DOMAINS.map((d) => (
                <button
                  key={d.id}
                  className={`${styles.domainTab} ${active === d.id ? styles.domainTabActive : ''}`}
                  onClick={() => setActive(d.id)}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  {active === d.id && (
                    <motion.span
                      layoutId="domainActivePill"
                      className={styles.domainTabBar}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className={styles.domainTabIndex}>{d.index}</span>
                  <span className={styles.domainTabLabel}>{d.label}</span>
                </button>
              ))}
            </div>

            {/* Text panel — position depends on domain align */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className={styles.domainPanel}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                
                <div className={styles.domainPanelIndex}>
                  {activeDomain.index} / {activeDomain.label}
                </div>
                <h3 className={styles.domainPanelLabel}>{activeDomain.label}</h3>
                <p className={styles.domainPanelFocus}>{activeDomain.focus}</p>
                <div className={styles.domainPanelDivider} />
                <p className={styles.domainPanelDetail}>{activeDomain.detail}</p>
                <div className={styles.domainPanelTags}>
                  {activeDomain.tags.map((t) => (
                    <span key={t} className={styles.domainPanelTag}>{t}</span>
                  ))}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}



/* ─────────────────────────────────────────────────────────


/* ─────────────────────────────────────────────────────────
   SECTION 06 — IMPACT
   ALL METRICS ARE PLACEHOLDER
───────────────────────────────────────────────────────── */
const METRICS = [
  { value: '10', suffix: '+', label: 'Years of Experience', detail: 'Over a decade of creating memorable digital experiences.' },
  { value: '98', suffix: '%', label: 'Client Retention', detail: 'Building strong relationships through consistent quality and trust.' },
  { value: '50', suffix: '+', label: 'Global Clients', detail: 'Trusted by brands across different industries and markets.' },
  { value: '80', suffix: '+', label: 'Delivered Projects', detail: 'Transforming ideas into impactful digital and visual solutions.' },
];



/* ─────────────────────────────────────────────────────────
   SECTION 06 — FAQS
───────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'What is the core mission of Omoikane Innovations?',
    a: 'We engineer mission-critical systems and autonomous platforms that operate flawlessly in the most demanding aerospace, defense, and industrial environments. Our focus is on absolute reliability when failure is not an option.'
  },
  {
    q: 'How do your autonomous systems integrate with existing infrastructure?',
    a: 'Our platforms are designed with modular, open-architecture frameworks. This ensures seamless interoperability with legacy C4ISR networks, tactical clouds, and proprietary industrial control systems without requiring complete overhauls.'
  },
  {
    q: 'What makes your robotic platforms suitable for extreme environments?',
    a: 'We utilize aerospace-grade composites, redundant sensor arrays, and hardened electronics. Every system undergoes rigorous environmental stress screening (ESS) to guarantee continuous operation across extreme temperatures, shock, and vibration profiles.'
  },
  {
    q: 'Do you offer custom engineering for specialized mission requirements?',
    a: 'Yes. Our agile engineering teams collaborate directly with defense and industrial partners to develop bespoke hardware and software solutions tailored to highly specific operational parameters and classified mission profiles.'
  },
  {
    q: 'How does Omoikane ensure the security and resilience of communications?',
    a: 'All our tactical systems employ advanced cryptographic protocols, low-probability-of-intercept (LPI) waveforms, and autonomous anti-jamming technologies to guarantee secure, uninterrupted data links in contested electronic warfare environments.'
  }
];

function FaqSection() {
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <section className={styles.faqSection}>
      <div className={styles.faqContainer}>
        <div className={styles.faqHeader}>
          <FadeUp>
            <h2 className={styles.faqHeading}>FREQUENTLY ASKED QUESTIONS</h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className={styles.faqSub}>Clarity on our capabilities, methodologies, and engineering standards.</p>
          </FadeUp>
        </div>

        <div className={`${styles.faqList} ${activeFaq !== null ? styles.faqListHasActive : ''}`}>
          {FAQS.map((faq, idx) => {
            const isActive = activeFaq === idx;
            return (
              <FadeUp key={idx} delay={0.1 + idx * 0.05}>
                <div 
                  className={`${styles.faqItem} ${isActive ? styles.faqItemActive : ''}`}
                  onClick={() => setActiveFaq(isActive ? null : idx)}
                >
                  <div className={styles.faqQuestionRow}>
                    <h3 className={styles.faqQuestion}>{faq.q}</h3>
                    <div className={styles.faqIcon}>
                      <motion.div
                        animate={{ rotate: isActive ? 45 : 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className={styles.faqAnswerWrapper}
                      >
                        <div className={styles.faqAnswer}>
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   SECTION 07 — FINAL BRAND STATEMENT
───────────────────────────────────────────────────────── */
function FinalBrandStatement() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className={styles.finale} ref={ref}>
      {/* Vertical grid lines */}
      <div className={styles.finaleGrid} aria-hidden="true">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={styles.finaleGridLine}
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
            style={{ transformOrigin: 'top' }}
          />
        ))}
      </div>

      <div className={styles.finaleInner}>


        <div className={styles.finalHeadlineWrap}>
          <RevealText delay={0.05}>
            <h2 className={styles.finaleH2}>FROM POSSIBILITY</h2>
          </RevealText>
          <RevealText delay={0.12}>
            <h2 className={`${styles.finaleH2} ${styles.finaleH2Stroke}`}>TO DEPLOYMENT.</h2>
          </RevealText>
        </div>

        <FadeUp delay={0.3}>
          <p className={styles.finaleSub}>
            Omoikane Innovations builds advanced technologies for environments where
            systems must perform beyond the laboratory and deliver where it matters.
          </p>
        </FadeUp>



        <div className={styles.finaleBottomMeta} aria-hidden="true">
          <span>OMK / ABOUT</span>
          <span className={styles.finaleMetaSep} />
          <span>SYSTEM / 007</span>
          <span className={styles.finaleMetaSep} />
          <span>STATUS / COMPLETE</span>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   PAGE ROOT
───────────────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <div className={styles.page}>
      <AboutHero />
      <AboutVision />
      <OmoikaneSystemArchitecture />
      <Testimonials />
      <AwardsAndCertifications />
      <MissionDomainExplorer />
      <FaqSection />
      <CallToAction />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   AWARDS & CERTIFICATIONS
───────────────────────────────────────────────────────── */
function AwardsAndCertifications() {
  const items = [
    {
      year: "2025",
      title: "ISO 9001 & AS9100D",
      desc: "Certified for design, development, and manufacturing of advanced aerospace and defense systems.",
      tags: ["Quality Management", "Aerospace Standard", "Compliance"]
    },
    {
      year: "2024",
      title: "DIU Vanguard Award",
      desc: "Recognized by the Defense Innovation Unit for accelerating the deployment of autonomous systems in demanding environments.",
      tags: ["Innovation", "Tactical Autonomy", "Rapid Deployment"]
    },
    {
      year: "2023",
      title: "NIST 800-171 Compliance",
      desc: "Fully compliant with rigorous cybersecurity requirements for protecting Controlled Unclassified Information (CUI).",
      tags: ["Cybersecurity", "CMMC Readiness", "Data Protection"]
    },
    {
      year: "2022",
      title: "AIAA Excellence in Robotics",
      desc: "Awarded for breakthrough flight control algorithms stabilizing multi-rotor systems under adversarial conditions.",
      tags: ["Flight Control", "Robotics", "Adversarial Resilience"]
    }
  ];

  return (
    <section className={styles.acSection}>
      <div className={styles.acContainer}>
        <motion.div 
          className={styles.acHeader}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.acHeading}>
            AWARDS<br />&<br />CERTIFICATIONS
          </h2>
          <p className={styles.acSubtext}>
            Standards, certifications, and recognition across engineering, quality, and autonomous systems.
          </p>
        </motion.div>
        
        <div className={styles.acList}>
          {items.map((item, idx) => (
            <motion.div 
              key={idx} 
              className={styles.acRow}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className={styles.acCol1}>
                <span className={styles.acYear}>{item.year}</span>
              </div>
              <div className={styles.acCol2}>
                <h3 className={styles.acTitle}>{item.title}</h3>
                <p className={styles.acDesc}>{item.desc}</p>
              </div>
              <div className={styles.acCol3}>
                <span className={styles.acIndex}>0{idx + 1}</span>
                <div className={styles.acMetaList}>
                  {item.tags.map(tag => (
                    <span key={tag} className={styles.acMetaLabel}>{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────────────────── */
const testimonials = [
  {
    text: "This ERP revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.",
    image: "https://cdn.21st.dev/assets/mirror/7c/7c408d5bb79392ba04b0b8a6294b4eee47a16ec377d3dae0c3108e918864bfad.jpg",
    name: "Briana Patton",
    role: "Operations Manager",
  },
  {
    text: "Implementing this ERP was smooth and quick. The customizable, user-friendly interface made team training effortless.",
    image: "https://cdn.21st.dev/assets/mirror/71/716cfb40836039a4e9e34d89320b6398ba7871ea7882e32b7397029586f6dda7.jpg",
    name: "Bilal Ahmed",
    role: "IT Manager",
  },
  {
    text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.",
    image: "https://cdn.21st.dev/assets/mirror/7a/7ae9db9990bb424cc1cf68b6af248e7b88e7add27109a6d951eb5b4f881eda98.jpg",
    name: "Saman Malik",
    role: "Customer Support Lead",
  },
  {
    text: "This ERP's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.",
    image: "https://cdn.21st.dev/assets/mirror/d1/d1db668ef30403e132bab1de4720f1c9159e8ba03dc0f3d65d5bf95f3985b80a.jpg",
    name: "Omar Raza",
    role: "CEO",
  },
  {
    text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient.",
    image: "https://cdn.21st.dev/assets/mirror/9e/9ef716cb49c8a7e58c27a65358d91e806a1d4c8579a128772a5d9d09d62cb113.jpg",
    name: "Zainab Hussain",
    role: "Project Manager",
  },
  {
    text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.",
    image: "https://cdn.21st.dev/assets/mirror/7f/7f2f1b6a4c09f5092437fe960232360d1e2dcf7a198c8580f3c5478c7b2d9386.jpg",
    name: "Aliza Khan",
    role: "Business Analyst",
  },
  {
    text: "Our business functions improved with a user-friendly design and positive customer feedback.",
    image: "https://cdn.21st.dev/assets/mirror/f2/f25b1b7a6a351c0f748d81bf4fcaf8c5a2f8ed036563c2693d4c1ca3718d9d5d.jpg",
    name: "Farhan Siddiqui",
    role: "Marketing Director",
  },
  {
    text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.",
    image: "https://cdn.21st.dev/assets/mirror/41/417105f5784df0a25c3486becfe5c967d448e3c98b3c0231ef4ea0c59d27cb4b.jpg",
    name: "Sana Sheikh",
    role: "Sales Manager",
  },
  {
    text: "Using this ERP, our online presence and conversions significantly improved, boosting business performance.",
    image: "https://cdn.21st.dev/assets/mirror/62/6252a3b6790cbb48919cb8ea756a4e1ce829f3271a141731226871b3c3df9d6d.jpg",
    name: "Hassan Ali",
    role: "E-commerce Manager",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn = (props) => {
  const hasActiveCard = props.activeTestimonial && props.testimonials.some(t => t.name === props.activeTestimonial);

  return (
    <div className={props.className}>
      <div
        className={`${styles.testiCol} ${styles.testiScroll} ${hasActiveCard ? styles.testiScrollPaused : ''}`}
        style={{ animationDuration: `${props.duration || 10}s` }}
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => {
                const isActive = props.activeTestimonial === name;
                const hasActiveGlobally = props.activeTestimonial !== null;
                return (
                  <motion.div 
                    className={styles.testiCard} 
                    key={i}
                    onClick={() => props.onCardClick(isActive ? null : name)}
                    style={{ cursor: 'pointer', zIndex: isActive ? 10 : 1 }}
                    animate={{ 
                      scale: isActive ? 1.05 : 1, 
                      filter: !hasActiveGlobally || isActive ? 'blur(0px)' : 'blur(3px)',
                      opacity: !hasActiveGlobally || isActive ? 1 : 0.5
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.testiIndex}>
                      0{i + 1}
                    </div>
                    
                    <div className={styles.testiText}>{text}</div>
                    <div className={styles.testiProfile}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        width={40}
                        height={40}
                        src={image}
                        alt={name}
                        className={styles.testiAvatar}
                      />
                      <div className={styles.testiMeta}>
                        <div className={styles.testiName}>{name}</div>
                        <div className={styles.testiRole}>{role}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </React.Fragment>
          )),
        ]}
      </div>
    </div>
  );
};

const Testimonials = () => {
  const ref = useRef(null);
  const [activeTestimonial, setActiveTestimonial] = useState(null);

  return (
    <section className={styles.testiSection} ref={ref}>
      <div className={styles.testiContainer}>
        <div className={styles.testiSplitLayout}>
          {/* Left Column: Testimonials */}
          <div className={styles.testiLeft}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-100px" }}
              className={styles.testiHeader}
            >
              <h2 className={styles.testiHeading}>
                What our clients say
              </h2>
            </motion.div>

            <div className={styles.testiGrid}>
              <TestimonialsColumn 
                testimonials={firstColumn} 
                duration={15} 
                activeTestimonial={activeTestimonial}
                onCardClick={setActiveTestimonial} 
              />
              <TestimonialsColumn 
                testimonials={secondColumn} 
                duration={19} 
                activeTestimonial={activeTestimonial}
                onCardClick={setActiveTestimonial} 
              />
            </div>
          </div>

          {/* Right Column: Numbers of our site */}
          <div className={styles.testiRight} style={{ position: "relative", overflow: "hidden", padding: "3rem", borderRadius: "24px" }}>
            <AnimatedNumberBg />
            <div className={styles.impactGrid2x2} style={{ borderLeft: "none", paddingLeft: 0 }}>
              {METRICS.map((m, i) => (
                <motion.div
                  key={m.label}
                  className={styles.impactCard}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-15%' }}
                  transition={{ duration: 0.5, delay: 0.1 * i, ease: "easeOut" }}
                >
                  <div className={styles.impactCardValue}>
                    {m.value}{m.suffix}
                  </div>
                  <div className={styles.impactCardLabel}>
                    {m.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   CTA SECTION
───────────────────────────────────────────────────────── */
function CallToAction() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for signing up with ${email}!`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaCard}>
        {/* Dark base + purple radial glow — our CTA bg colors */}
        <div className={styles.ctaHeroBg} />

        {/* MeshGradient layer 1 — black + purple-950 at 90% opacity */}
        <MeshGradient
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, opacity: 0.9 }}
          colors={['#000000', '#000000', '#3b0764', '#3b0764']}
          speed={0.6}
          backgroundColor="#000000"
        />

        {/* MeshGradient layer 2 — wireframe, purple-950 */}
        <MeshGradient
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.9, zIndex: 2 }}
          colors={['#000000', '#3b0764', '#000000']}
          speed={0.4}
          wireframe={true}
          backgroundColor="transparent"
        />

        <motion.div
          className={styles.ctaContentCentered}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2 className={styles.ctaTitleCentered} variants={itemVariants}>
            Ready to deploy your next <em>mission?</em>
          </motion.h2>

          <motion.div variants={itemVariants} style={{ marginTop: '1.5rem' }}>
            <button className={styles.ctaButtonPill} onClick={(e) => { e.preventDefault(); alert('Contact initiated.'); }}>
              <Sparkles size={16} strokeWidth={2.5} />
              Contact OMOIKANE
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className={styles.ctaBottomSection}>
            <p className={styles.ctaSublabel}>BUILT FOR PERFORMANCE AND RELIABILITY.</p>
            <div className={styles.ctaTagsWrapper}>
              <div className={styles.ctaTags}>
                <span className={styles.ctaTag}>Embedded Systems</span>
                <span className={styles.ctaTag}>Flight Control</span>
                <span className={styles.ctaTag}>AI Integration</span>
                <span className={styles.ctaTag}>Robotic Platforms</span>
                <span className={styles.ctaTag}>Defense Tech</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
