"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
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
import styles from './page.module.css';

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
      {/* Background image with parallax */}
      <motion.div className={styles.heroImageWrap} style={{ y: imageY }}>
        <Image
          src="/images/about/hero-v4.jpg"
          alt="Advanced technology system"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        <div className={styles.heroImageGradient} />
      </motion.div>

      {/* Progressive overlay on scroll */}
      <motion.div className={styles.heroScrollOverlay} style={{ opacity: overlayOpacity }} />

      {/* Left — Typography column */}
      <motion.div className={styles.heroLeft} style={{ y: textY }}>
        <FadeUp delay={0.05}>
          <div className={styles.heroEyebrow}>
            <span className={styles.heroEyebrowSignal} />
            <span>OMK / ABOUT</span>
          </div>
        </FadeUp>

        <div className={styles.heroHeadlineWrap}>
          <h1 className={styles.heroH1Solid}>
            BUILT
          </h1>
          <h1 className={styles.heroH1Stroke}>
            FOR REALITY.
          </h1>
        </div>

        <FadeUp delay={0.35}>
          <p className={styles.heroBody}>
            Omoikane Innovations develops advanced embedded systems, autonomous platforms,
            and defense-grade technologies built for real-world deployment across aerospace,
            defense, and industrial environments.
          </p>
        </FadeUp>

        <FadeUp delay={0.45}>
          <div className={styles.heroDomainRow}>
            {['EMBEDDED', 'AUTONOMY', 'DEFENSE', 'INDUSTRIAL'].map((d) => (
              <span key={d} className={styles.heroDomainTag}>{d}</span>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.55}>
          <div className={styles.heroScrollHint}>
            <motion.div
              className={styles.heroScrollLine}
              animate={{ scaleY: [1, 0.4, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span>SCROLL TO EXPLORE</span>
          </div>
        </FadeUp>
      </motion.div>






    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   SECTION 02 — THE OMOIKANE SYSTEM
───────────────────────────────────────────────────────── */
const SYSTEM_NODES = [
  { id: 'embedded', label: 'EMBEDDED\n& CONTROL', angle: -90, desc: 'Rugged compute and real-time control architectures for extreme environments.' },
  { id: 'autonomy', label: 'AUTONOMY', angle: -38, desc: 'Advanced perception and navigation for true independent operation.' },
  { id: 'robotics', label: 'ROBOTICS', angle: 14, desc: 'Precision autonomous platforms built for industrial and tactical missions.' },
  { id: 'defense', label: 'DEFENSE\nELECTRONICS', angle: 66, desc: 'Mission-critical hardware powering situational awareness and secure ops.' },
  { id: 'ai', label: 'AI &\nINTELLIGENCE', angle: 118, desc: 'Edge AI and signal processing integrated directly at the source.' },
  { id: 'comms', label: 'COMMS', angle: 170, desc: 'Resilient data links and RF modules for secure remote control.' },
];

function OmoikaneSystemArchitecture() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className={styles.system} ref={ref}>
      <div className={styles.systemInner}>
        
        {/* Section Header (Small) */}
        <div className={styles.editorialSectionHeader}>
          <span className={styles.editorialIndex}>02</span>
          <span className={styles.editorialDash}>—</span>
          <span className={styles.editorialLabel}>HOW WE WORK</span>
        </div>

        {/* Editorial Hero */}
        <div className={styles.editorialHero}>
          <FadeUp delay={0.1}>
            <h2 className={styles.editorialHeading}>
              Complex capabilities, structured with <span className={styles.editorialHighlight}>clarity</span>.
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className={styles.editorialSub}>
              We organize advanced intelligence, robotics, and control into a single, reliable architecture.
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
              <div className={styles.editorialCardIndex}>OMK.{String(i + 1).padStart(2, '0')}</div>
              <h3 className={styles.editorialCardTitle}>{node.label.replace('\n', ' ')}</h3>
              <p className={styles.editorialCardDesc}>{node.desc}</p>
            </motion.div>
          ))}
        </div>
        
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
    tags: ['UAV SYSTEMS', 'FLIGHT CONTROL', 'AERIAL SENSING', 'NAVIGATION'],
  },
  {
    id: 'ground',
    index: '02',
    label: 'TERRAIN',
    focus: 'Autonomous ground mobility — navigation, terrain sensing, robotic control.',
    detail: 'Unmanned ground vehicles and robotic mobility platforms for logistics, reconnaissance, and operations across contested or industrial terrain.',
    accent: '#E6E5E1',
    image: '/images/about/domain-ground.jpg',
    imageAlt: 'Autonomous ground robotic platform representing Omoikane ground systems capabilities.',
    imagePosition: 'center 60%',
    tags: ['UGV PLATFORMS', 'TERRAIN SENSING', 'AUTONOMOUS MOBILITY', 'ROBOTIC CONTROL'],
  },
  {
    id: 'industrial',
    index: '03',
    label: 'INDUSTRIAL',
    focus: 'Automation, embedded control, and machine intelligence for demanding environments.',
    detail: 'High-performance embedded control systems, process automation platforms, and precision robotics for manufacturing, energy, and logistics.',
    accent: '#A7A8A5',
    image: '/images/about/domain-industrial.jpg',
    imageAlt: 'Precision robotic actuator machinery representing Omoikane industrial automation capabilities.',
    imagePosition: 'center center',
    tags: ['PROCESS AUTOMATION', 'PRECISION ROBOTICS', 'EMBEDDED CONTROL', 'INDUSTRIAL IoT'],
  },
  {
    id: 'defense',
    index: '04',
    label: 'DEFENSE',
    focus: 'Mission-critical electronics, situational awareness, AI-assisted capabilities.',
    detail: 'Advanced electronics and intelligent systems supporting C4ISR, signal processing, secure communications, and autonomous decision support in operational environments.',
    accent: '#E6E5E1',
    image: '/images/about/domain-defense.jpg',
    imageAlt: 'Rugged mission electronics representing Omoikane defense technology capabilities.',
    imagePosition: 'center 40%',
    tags: ['C4ISR', 'MISSION SYSTEMS', 'SIGNAL PROCESSING', 'SECURE COMMS'],
  },
];

function MissionDomainExplorer() {
  const [active, setActive] = useState('air');
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
                      transform: active === d.id && hovered ? 'scale(1.025)' : 'scale(1)',
                      transition: 'transform 1.4s cubic-bezier(0.16,1,0.3,1)',
                    }}
                  />
                </div>
              ))}
              {/* Gradient overlay — darker on right for text panel */}
              <div className={styles.domainImageGrad} />


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

            {/* Text panel — right side, over image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className={styles.domainPanel}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >

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
   SECTION 04 — CREDENTIALS & STANDARDS
   ALL VALUES ARE PLACEHOLDER — do not present as verified
───────────────────────────────────────────────────────── */
const CREDENTIALS = [
  // PLACEHOLDER — verify before launch
  { code: 'ISO 9001', title: 'QUALITY MANAGEMENT', scope: 'Production & Process Systems', year: '2024', status: 'PLACEHOLDER' },
  { code: 'AS9100', title: 'AEROSPACE QUALITY', scope: 'Aerospace Manufacturing & Services', year: '2024', status: 'PLACEHOLDER' },
  { code: 'MIL-STD-810', title: 'ENVIRONMENTAL TESTING', scope: 'Airborne & Ground Equipment', year: '2024', status: 'PLACEHOLDER' },
  { code: 'IEC 61508', title: 'FUNCTIONAL SAFETY', scope: 'Safety-Related Electronic Systems', year: '2024', status: 'PLACEHOLDER' },
  { code: 'ISO 27001', title: 'INFORMATION SECURITY', scope: 'Information Security Management', year: '2024', status: 'PLACEHOLDER' },
  { code: 'CMMI L3', title: 'CAPABILITY MATURITY', scope: 'Software & Systems Development', year: '2024', status: 'PLACEHOLDER' },
];

function CredentialVault() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [activeIndex, setActiveIndex] = useState(0);

  const activeCred = CREDENTIALS[activeIndex];

  return (
    <section className={styles.credentials} ref={ref}>
      <div className={styles.credInner}>
        <div className={styles.credHeader}>
          <FadeUp delay={0.08}>
            <h2 className={styles.credHeading}>VERIFICATION<br />&amp; STANDARDS</h2>
          </FadeUp>
        </div>

        <div className={styles.credLayout}>
          {/* Left: The Massive Interactive List */}
          <div className={styles.credList}>
            {CREDENTIALS.map((c, i) => (
              <div 
                key={c.code}
                className={`${styles.credListItem} ${activeIndex === i ? styles.credListItemActive : ''}`}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <div className={styles.credListLine} />
                <span className={styles.credListCode}>{c.code}</span>
              </div>
            ))}
          </div>

          {/* Right: The Dynamic Spotlight */}
          <div className={styles.credSpotlightWrapper}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCred.code}
                className={styles.credSpotlight}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={styles.credSpotlightInner}>
                  <div className={styles.credSpotlightTop}>
                    <span className={styles.credSpotlightLabel}>CERTIFICATION DOSSIER</span>
                    <span className={styles.credStatusDotPulse} />
                  </div>
                  
                  <div className={styles.credSpotlightGraphic}>
                    <motion.div 
                      className={styles.sealRingOuter}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div 
                      className={styles.sealRingInner}
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className={styles.sealText}>{activeCred.code}</div>
                  </div>

                  <h3 className={styles.credSpotlightTitle}>{activeCred.title}</h3>
                  <div className={styles.credSpotlightDivider} />
                  <p className={styles.credSpotlightScope}>{activeCred.scope}</p>
                  
                  <div className={styles.credSpotlightMeta}>
                    <div>
                      <span className={styles.credMetaKey}>YEAR VALIDATED</span>
                      <span className={styles.credMetaVal}>{activeCred.year}</span>
                    </div>
                    <div>
                      <span className={styles.credMetaKey}>STATUS</span>
                      <span className={styles.credMetaVal}>{activeCred.status}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
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
  // PLACEHOLDER values — verify before launch
  { value: '50', suffix: '+', label: 'PROJECTS & SYSTEMS', detail: 'delivered end-to-end' },
  { value: '120', suffix: '+', label: 'TECHNOLOGY MODULES', detail: 'built and validated' },
  { value: '15', suffix: '+', label: 'DEPLOYMENTS', detail: 'in active operation' },
  { value: '10', suffix: '+', label: 'YEARS', detail: 'of combined experience' },
];

function ImpactTelemetry() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });

  return (
    <section className={styles.impact} ref={ref}>
      <div className={styles.impactInner}>
        <div className={styles.impactHeader}>
          <FadeUp delay={0.08}>
            <h2 className={styles.impactHeading}>GLOBAL TELEMETRY</h2>
          </FadeUp>
          <FadeUp delay={0.14}>
            <p className={styles.impactSub}>
              Built to move from concept to capability, from prototype to deployment.
              Real-world metrics tracked across all active systems.
            </p>
          </FadeUp>
        </div>

        <div className={styles.impactDashboard}>
          {/* Left Column: Stacked Metrics */}
          <div className={styles.impactMetricsStack}>
            {METRICS.slice(0, 3).map((m, i) => (
              <FadeUp key={m.label} delay={0.2 + i * 0.1}>
                <div className={styles.impactMetricRow}>
                  <div className={styles.impactMetricValue}>
                    {m.value}{m.suffix && <span className={styles.impactMetricSuffix}>{m.suffix}</span>}
                  </div>
                  <div className={styles.impactMetricLabel}>
                    {m.label.charAt(0) + m.label.slice(1).toLowerCase()} {m.detail}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Right Column: Illustration Image */}
          <div className={styles.impactIllustration}>
            <FadeUp delay={0.4}>
              <div className={styles.impactImageWrapper}>
                <Image 
                  src="/images/about/hero-v4.jpg" 
                  alt="Telemetry visualization" 
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </FadeUp>
          </div>
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
      <OmoikaneSystemArchitecture />
      <CredentialVault />
      <MissionDomainExplorer />

      <ImpactTelemetry />
      <FinalBrandStatement />
    </div>
  );
}
