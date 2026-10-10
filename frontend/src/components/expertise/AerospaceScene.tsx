"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AerospaceScene.module.css";

gsap.registerPlugin(ScrollTrigger);

type AerospaceSceneProps = {
  active?: boolean;
  reducedMotion?: boolean;
};

const ASSETS = {
  background: "/aerospace/atmosphere.webp",
  midground: "/aerospace/hero.jpg",
  hero: "/aerospace/uav-hero.webp",
  foreground: "/aerospace/avionics-detail.webp",
};

export function AerospaceScene({
  active = false,
  reducedMotion = false,
}: AerospaceSceneProps) {
  const root = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  
  const bg = useRef<HTMLDivElement>(null);
  const mg = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const fg = useRef<HTMLDivElement>(null);

  const cursorX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const cursorY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useEffect(() => {
    const el = root.current;
    const worldEl = world.current;
    if (!el || !worldEl) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set([bg.current, mg.current, hero.current, fg.current], {
          clearProps: "all",
          opacity: 1,
        });
        return;
      }

      // Entrance animation sequence when scene becomes active
      const reveal = () => {
        gsap.killTweensOf([bg.current, mg.current, hero.current, fg.current]);
        
        // Initial setup for entrance
        gsap.set(bg.current, { opacity: 0, scale: 1.1 });
        gsap.set(mg.current, { opacity: 0, scale: 1.15, yPercent: 5 });
        gsap.set(hero.current, { opacity: 0, scale: 1.05, yPercent: 10 });
        gsap.set(fg.current, { opacity: 0, scale: 1.2, yPercent: 15 });

        const tl = gsap.timeline();
        
        tl.to(bg.current, { opacity: 1, scale: 1.05, duration: 1.5, ease: "power3.out" })
          .to(mg.current, { opacity: 1, scale: 1.05, yPercent: 0, duration: 1.5, ease: "power3.out" }, "-=1.0")
          .to(hero.current, { opacity: 1, scale: 1, yPercent: 0, duration: 1.8, ease: "expo.out" }, "-=1.2")
          .to(fg.current, { opacity: 1, scale: 1.1, yPercent: 0, duration: 2.0, ease: "expo.out" }, "-=1.5");
      };

      if (active) reveal();

      // Scroll choreography mapping
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress; // 0 to 1
          
          // Different rates of parallax for each layer
          gsap.set(bg.current, { yPercent: (0.5 - p) * 15 });
          gsap.set(mg.current, { yPercent: (0.5 - p) * -5 });
          gsap.set(hero.current, { yPercent: (0.5 - p) * -15 });
          gsap.set(fg.current, { yPercent: (0.5 - p) * -30 });
        },
      });

      // Pointer Parallax Interaction
      cursorX.current = gsap.quickTo(worldEl, "x", { duration: 1.2, ease: "power3.out" });
      cursorY.current = gsap.quickTo(worldEl, "y", { duration: 1.2, ease: "power3.out" });

      const onPointerMove = (event: PointerEvent) => {
        if (window.matchMedia("(pointer: coarse)").matches || !active) return;
        const rect = el.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;

        // Move layers subtly based on depth
        gsap.to(bg.current, { x: nx * 10, y: ny * 10, duration: 1.2, ease: "power3.out", overwrite: "auto" });
        gsap.to(mg.current, { x: nx * -10, y: ny * -10, duration: 1.2, ease: "power3.out", overwrite: "auto" });
        gsap.to(hero.current, { x: nx * -20, y: ny * -20, duration: 1.2, ease: "power3.out", overwrite: "auto" });
        gsap.to(fg.current, { x: nx * -40, y: ny * -40, duration: 1.2, ease: "power3.out", overwrite: "auto" });
      };

      el.addEventListener("pointermove", onPointerMove, { passive: true });

      // Subtle Idle breathing
      const idle = gsap.timeline({ repeat: -1, yoyo: true });
      idle.to(hero.current, { y: "-=5px", duration: 4, ease: "sine.inOut" })
          .to(mg.current, { scale: 1.06, duration: 5, ease: "sine.inOut" }, 0)
          .to(fg.current, { x: "+=10px", duration: 6, ease: "sine.inOut" }, 0);

      return () => {
        el.removeEventListener("pointermove", onPointerMove);
        st.kill();
        idle.kill();
      };
    }, el);

    return () => ctx.revert();
  }, [active, reducedMotion]);

  return (
    <section ref={root} className={styles.scene} aria-label="Aerospace visual">
      <div className={styles.viewport}>
        <div ref={world} className={styles.world}>
          
          <div ref={bg} className={`${styles.layer} ${styles.background}`}>
            <img src={ASSETS.background} alt="" className={styles.image} draggable={false} />
          </div>

          <div ref={mg} className={`${styles.layer} ${styles.midground}`}>
            <img src={ASSETS.midground} alt="" className={styles.image} draggable={false} />
          </div>

          <div ref={hero} className={`${styles.layer} ${styles.primary}`}>
            <img src={ASSETS.hero} alt="" className={styles.image} draggable={false} />
          </div>

          <div ref={fg} className={`${styles.layer} ${styles.foreground}`}>
            <img src={ASSETS.foreground} alt="" className={styles.image} draggable={false} />
          </div>

          <div className={styles.atmosphere} />

          <div className={styles.annotations}>
            <div className={`${styles.annotation} ${styles.annoTopRight}`}>FLIGHT CONTROL</div>
            <div className={`${styles.annotation} ${styles.annoBottomLeft}`}>RF TELEMETRY</div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
