"use client";

import React, { useRef } from 'react';
import styles from './page.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { ExpertiseSection } from '@/components/expertise/ExpertiseSection';
import { TechMarquee } from '@/components/expertise/TechMarquee';
import { ExpertiseHero } from '@/components/expertise/ExpertiseHero';
import CallToAction from '@/components/common/CallToAction';

gsap.registerPlugin(ScrollTrigger);

export default function ExpertisePage() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Lenis Smooth Scroll
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);



    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, { scope: containerRef });

  return (
    <main className={styles.container} ref={containerRef}>
      
      {/* Ultra Clean Hero */}
      <ExpertiseHero />

      {/* Scrolling Technologies Marquee */}
      <TechMarquee />

      {/* Main Expertise Presentation */}
      <ExpertiseSection />

      {/* About Us CTA */}
      <CallToAction />

    </main>
  );
}
