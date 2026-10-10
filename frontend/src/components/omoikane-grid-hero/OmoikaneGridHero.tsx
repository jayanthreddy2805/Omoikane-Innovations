 "use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./OmoikaneGridHero.module.css";

type ModuleKey = "embedded" | "autonomy" | "communications" | "systems";

const modules: Array<{
  id: ModuleKey;
  index: string;
  title: string;
  detail: string;
  code: string;
}> = [
  {
    id: "embedded",
    index: "01",
    title: "Embedded systems",
    detail: "Control electronics, firmware, sensor interfaces and real-time processing.",
    code: "EMB / CONTROL",
  },
  {
    id: "autonomy",
    index: "02",
    title: "Autonomous platforms",
    detail: "Robotics, UAV and UGV systems, perception and intelligent automation.",
    code: "AUT / PLATFORM",
  },
  {
    id: "communications",
    index: "03",
    title: "RF & communications",
    detail: "Connected systems, telemetry, RF design and resilient data links.",
    code: "RF / CONNECTIVITY",
  },
  {
    id: "systems",
    index: "04",
    title: "Integrated engineering",
    detail: "Electronics, software and mechanical design brought together as a product.",
    code: "SYS / INTEGRATION",
  },
];

function Cross({ className = "" }: { className?: string }) {
  return <span className={`${styles.cross} ${className}`} aria-hidden="true">+</span>;
}

function FileModule({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.fileModule} ${active ? styles.fileActive : ""}`}
      onClick={onClick}
      aria-expanded={active}
      aria-label={active ? "Close engineering systems detail" : "Open engineering systems detail"}
    >
      <span className={styles.filePaper}>
        <span className={styles.paperFold} />
        <span className={styles.paperKicker}>OMK / SYSTEMS</span>
        <span className={styles.paperTitle}>ENGINEERING<br />BRIEF</span>
        <span className={styles.paperRule} />
        <span className={styles.paperLine} />
        <span className={`${styles.paperLine} ${styles.paperLineShort}`} />
        <span className={styles.paperFoot}>DESIGN → INTEGRATE → VALIDATE</span>
        <span className={styles.paperCornerMark}>↗</span>
      </span>
      <span className={styles.fileOrbit} aria-hidden="true" />
      <span className={styles.fileHint}>{active ? "CLOSE BRIEF" : "OPEN SYSTEM BRIEF"} <b>{active ? "−" : "+"}</b></span>
    </button>
  );
}

export function OmoikaneGridHero() {
  const [activeModule, setActiveModule] = useState<ModuleKey>("embedded");
  const [briefOpen, setBriefOpen] = useState(false);
  const active = modules.find((item) => item.id === activeModule) ?? modules[0];

  return (
    <section className={styles.hero} aria-labelledby="omoikane-hero-title">
      <div className={styles.gridTexture} aria-hidden="true" />
      <div className={styles.topGlow} aria-hidden="true" />

      <svg className={styles.routeLines} viewBox="0 0 1440 760" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="omkRouteFade" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".15" />
            <stop offset="48%" stopColor="currentColor" stopOpacity=".8" />
            <stop offset="100%" stopColor="currentColor" stopOpacity=".22" />
          </linearGradient>
        </defs>
        <path className={styles.routeBase} d="M -30 225 C 120 185 215 280 350 235 S 490 140 620 230 S 790 335 925 250 S 1120 175 1470 310" />
        <path className={styles.routeDraw} pathLength="1" d="M -30 225 C 120 185 215 280 350 235 S 490 140 620 230 S 790 335 925 250 S 1120 175 1470 310" />
        <path className={styles.routeBase} d="M 75 525 C 205 455 270 590 385 510 S 495 430 565 525 S 700 620 825 550 S 1010 475 1125 555 S 1300 600 1460 520" />
        <path className={styles.routeDraw} pathLength="1" d="M 75 525 C 205 455 270 590 385 510 S 495 430 565 525 S 700 620 825 550 S 1010 475 1125 555 S 1300 600 1460 520" />
        <path className={styles.routeBase} d="M 1020 80 C 1100 120 1050 200 1140 225 S 1290 205 1375 270" />
        <circle className={styles.routeNode} r="4">
          <animateMotion dur="8s" repeatCount="indefinite" path="M -30 225 C 120 185 215 280 350 235 S 490 140 620 230 S 790 335 925 250 S 1120 175 1470 310" />
        </circle>
        <circle className={styles.routeNodeAlt} r="3">
          <animateMotion dur="10s" begin="-4s" repeatCount="indefinite" path="M 75 525 C 205 455 270 590 385 510 S 495 430 565 525 S 700 620 825 550 S 1010 475 1125 555 S 1300 600 1460 520" />
        </circle>
      </svg>

      <div className={styles.heroTopline}>
        <span className={styles.statusDot} />
        <span>OMOIKANE INNOVATIONS</span>
        <i />
        <span>ENGINEERING SYSTEMS</span>
        <span className={styles.toplineRight}>BENGALURU · INDIA</span>
      </div>

      <Cross className={styles.crossA} />
      <Cross className={styles.crossB} />
      <Cross className={styles.crossC} />
      <Cross className={styles.crossD} />
      <Cross className={styles.crossE} />

      <div className={styles.systemCard} aria-hidden="true">
        <div className={styles.systemCardTop}><span>LIVE SYSTEMS</span><span className={styles.liveDot} /></div>
        <div className={styles.signalBars}><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
        <div className={styles.systemCardBottom}><span>INTEGRATION STATUS</span><b>READY</b></div>
      </div>

      <FileModule active={briefOpen} onClick={() => setBriefOpen((value) => !value)} />

      <div className={styles.heroMain}>
        <p className={styles.eyebrow}>ENGINEERING THE NEXT GENERATION</p>
        <h1 id="omoikane-hero-title" className={styles.title}>
          <span className={styles.titleLineOne}>DEEP TECH</span>
          <span className={styles.titleLineTwo}>EXPERTISE<span className={styles.titlePeriod}>.</span></span>
        </h1>

        <div className={styles.copyRow}>
          <div className={styles.introCopy}>
            <p>We design and develop advanced technologies for aerospace, defense and intelligent automation—combining embedded electronics, autonomous platforms and product engineering.</p>
            <p className={styles.smallCopy}>From circuit to system. From prototype to real-world deployment.</p>
            <Link className={styles.cta} href="#expertise">
              <span>EXPLORE OUR CAPABILITIES</span>
              <span className={styles.ctaArrow} aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className={styles.moduleExplorer}>
            <div className={styles.moduleExplorerHead}>
              <span>CAPABILITY INDEX</span>
              <span>SELECT / 0{modules.findIndex((item) => item.id === activeModule) + 1}</span>
            </div>
            <div className={styles.moduleTabs} role="tablist" aria-label="Engineering capabilities">
              {modules.map((module) => (
                <button
                  key={module.id}
                  type="button"
                  role="tab"
                  aria-selected={activeModule === module.id}
                  className={`${styles.moduleTab} ${activeModule === module.id ? styles.moduleTabActive : ""}`}
                  onClick={() => setActiveModule(module.id)}
                >
                  <span className={styles.moduleIndex}>{module.index}</span>
                  <span>{module.title}</span>
                  <span className={styles.moduleArrow} aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
            <div className={styles.moduleDetail} key={active.id}>
              <span>{active.code}</span>
              <p>{active.detail}</p>
            </div>
          </div>
        </div>
      </div>

      {briefOpen && (
        <aside className={styles.briefPopover} aria-live="polite">
          <button className={styles.briefClose} type="button" onClick={() => setBriefOpen(false)} aria-label="Close system brief">×</button>
          <span className={styles.briefEyebrow}>OMK / ENGINEERING NOTE 001</span>
          <h2>Built as a system.<br />Validated as a product.</h2>
          <p>Hardware, firmware, software and mechanical design developed with integration and real-world performance in mind.</p>
          <div className={styles.briefTags}><span>EMBEDDED</span><span>AUTONOMY</span><span>INTEGRATION</span></div>
        </aside>
      )}

      <div className={styles.bottomMeta} aria-hidden="true">
        <div><span>ADVANCED SYSTEMS</span><i /><span>2026</span></div>
        <div className={styles.bottomMetaRight}><span>BUILT FOR PRECISION</span><b>01 — 04</b></div>
      </div>
    </section>
  );
}
