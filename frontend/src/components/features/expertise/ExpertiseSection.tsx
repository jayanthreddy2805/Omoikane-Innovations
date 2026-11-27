"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { expertise } from "./expertiseData";
import AerospaceVideoSequence from "./AerospaceVideoSequence";
import styles from "./ExpertiseSection.module.css";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_SETTLE_DELAY = 45;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

const subscribeViewport = (notify: () => void) => {
  const media = window.matchMedia('(max-width: 1100px)');
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
};
const mobileSnapshot = () => window.matchMedia('(max-width: 1100px)').matches;
const serverSnapshot = () => false;

export function ExpertiseSection() {
  const reducedMotion = useReducedMotion();
  const mobile = useSyncExternalStore(subscribeViewport, mobileSnapshot, serverSnapshot);
  const [activeIndex, setActiveIndex] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const sceneRefs = useRef<Array<HTMLElement | null>>([]);
  const navRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const activeIndexRef = useRef(0);
  const copyTimeline = useRef<gsap.core.Timeline | null>(null);

  const setSceneRef = useCallback((node: HTMLElement | null, index: number) => {
    sceneRefs.current[index] = node;
  }, []);

  const setNavRef = useCallback((node: HTMLButtonElement | null, index: number) => {
    navRefs.current[index] = node;
  }, []);

  const changeActive = useCallback(
    (nextIndex: number) => {
      if (nextIndex === activeIndexRef.current || nextIndex < 0 || nextIndex >= expertise.length) return;

      const previous = activeIndexRef.current;
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);

      if (reducedMotion) return;

      const heading = headingRef.current;
      const description = descriptionRef.current;
      if (!heading || !description) return;

      const direction = nextIndex > previous ? 1 : -1;
      copyTimeline.current?.kill();

      copyTimeline.current = gsap.timeline({ defaults: { overwrite: "auto" } });
      copyTimeline.current
        .set([heading, description], { y: direction * 18, autoAlpha: 0 })
        .to(heading, {
          y: 0,
          autoAlpha: 1,
          duration: 0.62,
          ease: "expo.out",
        })
        .to(
          description,
          {
            y: 0,
            autoAlpha: 1,
              duration: 0.68,
            ease: "expo.out",
          },
          "-=0.47",
        );
    },
    [reducedMotion],
  );

  useEffect(() => {
    if (!mobile) return;
    let frame: number | undefined;
    const followCategoryLink = () => {
      const index = expertise.findIndex(item => `#${item.id}` === window.location.hash);
      if (index < 0) return;
      changeActive(index);
      frame = window.requestAnimationFrame(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
    };
    followCategoryLink();
    window.addEventListener('hashchange', followCategoryLink);
    return () => {
      window.removeEventListener('hashchange', followCategoryLink);
      if (frame !== undefined) window.cancelAnimationFrame(frame);
    };
  }, [mobile, changeActive]);

  useEffect(() => {
    const scenes = sceneRefs.current.filter(Boolean) as HTMLElement[];
    if (!scenes.length) return;

    let settleTimer: number | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const index = scenes.indexOf(visible.target as HTMLElement);
        if (index < 0) return;

        window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(() => changeActive(index), SCROLL_SETTLE_DELAY);
      },
      {
        threshold: [0.22, 0.42, 0.62, 0.8],
        rootMargin: "-18% 0px -18% 0px",
      },
    );

    scenes.forEach((scene) => observer.observe(scene));

    return () => {
      window.clearTimeout(settleTimer);
      observer.disconnect();
    };
  }, [changeActive, mobile]);

  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set([headingRef.current, descriptionRef.current], { clearProps: "all" });
        return;
      }

      // Premium scene depth: very subtle, never changes the reference composition.
      sceneRefs.current.forEach((scene) => {
        if (!scene) return;
        const canvas = scene.querySelector<HTMLElement>(`.${styles.sceneCanvas}`);
        const grid = scene.querySelector<HTMLElement>(`.${styles.sceneGrid}`);
        const object = scene.querySelector<HTMLElement>(`.${styles.sceneObject}`);
        if (!canvas || !grid || !object) return;

        gsap.fromTo(
          canvas,
          { scale: 0.965, y: 22, autoAlpha: 0.76 },
          {
            scale: 1,
            y: 0,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              trigger: scene,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.1,
            },
          },
        );

        gsap.to(grid, {
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: scene,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4,
          },
        });

        gsap.to(object, {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: scene,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.6,
          },
        });
      });
    }, root);

    return () => {
      copyTimeline.current?.kill();
      ctx.revert();
    };
  }, [reducedMotion, mobile]);

  useEffect(() => {
    if (reducedMotion || mobile) {
      navRefs.current.forEach((button) => {
        if (!button) return;
        const arrow = button.querySelector<HTMLElement>(`.${styles.navArrow}`);
        const text = button.querySelector<HTMLElement>(`.${styles.navText}`);
        gsap.killTweensOf([button, arrow, text].filter(Boolean));
        gsap.set([button, arrow, text].filter(Boolean), { clearProps: "x" });
      });
      return;
    }

    const cleanups: Array<() => void> = [];

    navRefs.current.forEach((button, index) => {
      if (!button) return;
      const arrow = button.querySelector<HTMLElement>(`.${styles.navArrow}`);
      const text = button.querySelector<HTMLElement>(`.${styles.navText}`);
      if (!arrow || !text) return;

      const enter = () => {
        gsap.killTweensOf([button, arrow, text]);
        gsap.to(button, {
          x: index === activeIndexRef.current ? 2 : 5,
          duration: 0.5,
          ease: "expo.out",
        });
        gsap.to(arrow, {
          x: 6,
          duration: 0.55,
          ease: "expo.out",
        });
        gsap.to(text, {
          x: 2,
          duration: 0.45,
          ease: "power2.out",
        });
      };

      const leave = () => {
        gsap.to(button, { x: 0, duration: 0.7, ease: "expo.out" });
        gsap.to(arrow, { x: 0, duration: 0.7, ease: "expo.out" });
        gsap.to(text, { x: 0, duration: 0.5, ease: "power2.out" });
      };

      button.addEventListener("pointerenter", enter);
      button.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        button.removeEventListener("pointerenter", enter);
        button.removeEventListener("pointerleave", leave);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [reducedMotion, mobile]);

  useLayoutEffect(() => {
    if (reducedMotion) return;

    const activeButton = navRefs.current[activeIndex];
    if (!activeButton) return;

    const arrow = activeButton.querySelector<HTMLElement>(`.${styles.navArrow}`);
    if (!arrow) return;

    gsap.fromTo(
      arrow,
      { x: -8, autoAlpha: 0.35 },
      { x: 0, autoAlpha: 1, duration: 0.7, ease: "expo.out", overwrite: true },
    );
  }, [activeIndex, reducedMotion]);

  const jumpTo = (index: number) => {
    changeActive(index);
    if (typeof window !== "undefined" && window.innerWidth > 1100) {
      sceneRefs.current[index]?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "center",
      });
    }
  };

  const active = expertise[activeIndex];

  return (
    <section ref={sectionRef} id={mobile ? active.id : undefined} className={styles.section} aria-label="Omoikane expertise">
      <aside className={styles.leftRail} aria-label="Expertise navigation">
        <div className={styles.leftInner}>

          <div className={styles.copy} aria-live="polite">
            <h2 ref={headingRef} className={styles.title} key={`title-${active.id}`}>
              {active.title}
            </h2>
            <p ref={descriptionRef} className={styles.description} data-type-role="desc" key={`description-${active.id}`}>
              {active.description}
            </p>
            <div className={styles.systems} key={`systems-${active.id}`}>
              <h3 className={styles.systemsLabel}>Engineering focus</h3>
              <ul className={styles.systemsList}>
                {active.systems.map((system) => (
                  <li key={system} className={styles.systemsItem}>
                    <span className={styles.systemMarker} aria-hidden="true">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="5,1 9,5 5,9 1,5" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.25" />
                      </svg>
                    </span>
                    <span>{system}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Video / Visual embedded directly in the dark container */}
            {mobile && <div className={styles.mobileVisual}>
              {active.id === "aerospace" ? (
                <AerospaceVideoSequence active={true} reducedMotion={reducedMotion} />
              ) : (
                <div className={`${styles.sceneCanvas} ${styles.sceneCanvas3}`}>
                  <div className={styles.sceneIndex}>{String(activeIndex + 1).padStart(2, "0")}</div>
                  <div className={styles.sceneHint}>{active.title.toUpperCase()}</div>
                </div>
              )}
            </div>}
          </div>

          <nav className={styles.nav} aria-label="Expertise categories">
            {expertise.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item.id}
                  ref={(node) => setNavRef(node, index)}
                  type="button"
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                  aria-current={isActive ? "step" : undefined}
                  onClick={() => jumpTo(index)}
                >
                  <span className={styles.navArrow} aria-hidden="true">→</span>
                  <span className={styles.navText}>{item.title}</span>
                  <span className={styles.navGlow} aria-hidden="true" />
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {!mobile && <div className={styles.scenes}>
        {expertise.map((item, index) => (
          <article
            key={item.id}
            id={item.id}
            ref={(node) => setSceneRef(node, index)}
            className={styles.scene}
            aria-label={`${item.title} visual area`}
          >
            {item.id === "aerospace" ? (
              <AerospaceVideoSequence active={activeIndex === index} reducedMotion={reducedMotion} />
            ) : (
              <div className={`${styles.sceneCanvas} ${styles.sceneCanvas3}`}>
                <div className={styles.sceneIndex}>{String(index + 1).padStart(2, "0")}</div>
                <div className={styles.sceneHint}>{item.title.toUpperCase()}</div>
              </div>
            )}
          </article>
        ))}
      </div>}
    </section>
  );
}
