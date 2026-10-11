"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./HowWeWork.module.css";

const STEPS = [
  {
    number: "01",
    phase: "UNDERSTAND",
    title: "Start with the problem.",
    body: "We define the operating context, constraints and success criteria before deciding what to build.",
    result: "A clear set of requirements",
  },
  {
    number: "02",
    phase: "DESIGN",
    title: "Design the whole system.",
    body: "Hardware, embedded software and mechanical design are considered together, with interfaces and trade-offs resolved early.",
    result: "A system-level architecture",
  },
  {
    number: "03",
    phase: "INTEGRATE",
    title: "Make the parts work together.",
    body: "Subsystems are integrated and tested as a whole, so issues at the interfaces are found early—not at the end.",
    result: "An integrated, tested system",
  },
  {
    number: "04",
    phase: "REFINE",
    title: "Prove it in practice.",
    body: "Test findings guide the next iteration, improving reliability and readiness for the intended environment.",
    result: "Evidence-led refinement",
  },
];

const NODE_X = [150, 450, 750, 1050];
const ROUTE_PATH =
  "M150 45 C205 45 222 23 274 25 C331 28 386 72 450 45 C520 15 596 73 660 52 C704 39 720 31 750 45 C825 71 900 23 970 36 C1012 44 1030 45 1050 45";

export default function HowWeWork() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const routeRef = useRef<SVGPathElement | null>(null);
  const revealRectRef = useRef<SVGRectElement | null>(null);
  const signalRef = useRef<SVGCircleElement | null>(null);
  const [started, setStarted] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const clipId = `how-we-work-route-${useId().replace(/:/g, "")}`;

  // Start only when the section enters view. Reduced-motion users see the
  // complete process without being made to wait for the animation.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      setStarted(true);
      setActiveStep(3);
      revealRectRef.current?.setAttribute("width", "1200");
      signalRef.current?.setAttribute("cx", "1050");
      signalRef.current?.setAttribute("cy", "45");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.22, rootMargin: "0px 0px -4% 0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // The signal, route reveal, and content state share one master timeline.
  // Each node is reached at exactly 0, 2, 4, and 6 seconds.
  useEffect(() => {
    if (!started) return;

    const path = routeRef.current;
    const revealRect = revealRectRef.current;
    const signal = signalRef.current;
    if (!path || !revealRect || !signal) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      setActiveStep(3);
      revealRect.setAttribute("width", "1200");
      signal.setAttribute("cx", "1050");
      signal.setAttribute("cy", "45");
      return;
    }

    const totalLength = path.getTotalLength();
    const distances = NODE_X.map((targetX) => {
      let low = 0;
      let high = totalLength;
      for (let i = 0; i < 32; i += 1) {
        const middle = (low + high) / 2;
        if (path.getPointAtLength(middle).x < targetX) low = middle;
        else high = middle;
      }
      return (low + high) / 2;
    });

    const segmentMs = 2000;
    const duration = segmentMs * 3;
    let frameId = 0;
    let previousStep = -1;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = Math.min(now - startTime, duration);
      const segment = Math.min(2, Math.floor(elapsed / segmentMs));
      const progress = elapsed >= duration
        ? 1
        : (elapsed - segment * segmentMs) / segmentMs;

      // Smooth, controlled ease between points. No spring or bounce.
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const distance =
        distances[segment] +
        (distances[segment + 1] - distances[segment]) * eased;
      const point = path.getPointAtLength(distance);
      signal.setAttribute("cx", point.x.toFixed(2));
      signal.setAttribute("cy", point.y.toFixed(2));
      revealRect.setAttribute("width", Math.min(1200, point.x + 3).toFixed(2));

      const step = elapsed >= duration
        ? 3
        : Math.min(3, Math.floor(elapsed / segmentMs));
      if (step !== previousStep) {
        previousStep = step;
        setActiveStep(step);
      }

      if (elapsed < duration) {
        frameId = window.requestAnimationFrame(tick);
      } else {
        const lastPoint = path.getPointAtLength(distances[3]);
        signal.setAttribute("cx", lastPoint.x.toFixed(2));
        signal.setAttribute("cy", lastPoint.y.toFixed(2));
        revealRect.setAttribute("width", "1200");
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [started]);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${started ? styles.started : ""}`}
      aria-labelledby="how-we-work-title"
    >
      <div className={styles.paperGrid} aria-hidden="true" />
      <div className={styles.container}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          <span>HOW WE WORK</span>
          <span className={styles.eyebrowRule} />
          <span className={styles.eyebrowMuted}>A CLEAR PATH FROM BRIEF TO BUILD</span>
        </div>

        <header className={styles.header}>
          <h2 id="how-we-work-title">
            How we work<span>.</span>
          </h2>
          <p>
            Good engineering is a sequence of considered decisions. Four
            connected stages take a requirement toward a system that has been
            built, integrated and tested.
          </p>
        </header>

        <div className={styles.timeline}>
          <svg
            className={styles.route}
            viewBox="0 0 1200 90"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <clipPath id={clipId}>
                <rect ref={revealRectRef} x="0" y="0" width="150" height="90" />
              </clipPath>
            </defs>

            <path className={styles.routeBase} d={ROUTE_PATH} />
            <path
              ref={routeRef}
              className={styles.routeProgress}
              d={ROUTE_PATH}
              clipPath={`url(#${clipId})`}
            />

            {NODE_X.map((x, index) => {
              const y = index === 1 ? 45 : index === 2 ? 45 : index === 3 ? 45 : 45;
              return (
                <g
                  key={x}
                  className={`${styles.node} ${activeStep >= index ? styles.nodeActive : ""}`}
                >
                  <circle className={styles.nodeOuter} cx={x} cy={y} r="6" />
                  <circle className={styles.nodeInner} cx={x} cy={y} r="2" />
                </g>
              );
            })}
            <circle
              ref={signalRef}
              className={styles.signal}
              cx="150"
              cy="45"
              r="4.5"
            />
          </svg>

          <div className={styles.steps}>
            {STEPS.map((step, index) => (
              <article
                key={step.number}
                className={`${styles.step} ${activeStep >= index ? styles.stepVisible : ""}`}
                aria-current={activeStep === index ? "step" : undefined}
              >
                <div className={styles.stepMeta}>
                  <span className={styles.stepNumber}>{step.number}</span>
                  <span className={styles.phase}>{step.phase}</span>
                </div>
                <h3>{step.title}</h3>
                <p className={styles.stepBody}>{step.body}</p>
                <div className={styles.result}>
                  <span className={styles.resultLine} />
                  <span>{step.result}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <footer className={styles.footer}>
          <span>FROM REQUIREMENT TO VALIDATION</span>
          <span className={styles.footerRule} />
          <span>01 — 04</span>
        </footer>
      </div>
    </section>
  );
}
