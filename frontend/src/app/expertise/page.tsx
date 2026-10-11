"use client";

import React, { useRef, useState } from 'react';
import styles from './page.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { ExpertiseSection } from '@/components/expertise/ExpertiseSection';
import { TechMarquee } from '@/components/expertise/TechMarquee';
import { OmoikaneEngineeringHero } from '@/components/omoikane-engineering-hero/OmoikaneEngineeringHero';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { MeshGradient } from '@paper-design/shaders-react';
import aboutStyles from '../about/page.module.css';

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
      <OmoikaneEngineeringHero />

      {/* Scrolling Technologies Marquee */}
      <TechMarquee />

      {/* Main Expertise Presentation */}
      <ExpertiseSection />

      {/* About Us CTA */}
      <CallToAction />

    </main>
  );
}

function CallToAction() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  } as const;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100, damping: 12 },
    },
  } as const;

  return (
    <section className={aboutStyles.ctaSection}>
      <div className={aboutStyles.ctaCard}>
        <div className={aboutStyles.ctaHeroBg} />

        <MeshGradient
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, opacity: 0.9, backgroundColor: '#000000' }}
          colors={['#000000', '#000000', '#3b0764', '#3b0764']}
          speed={0.6}
        />

        {/* MeshGradient layer 2 — wireframe, purple-950 */}
        <MeshGradient
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.9, zIndex: 2, backgroundColor: 'transparent' }}
          colors={['#000000', '#3b0764', '#000000']}
          speed={0.4}
        />

        <motion.div
          className={aboutStyles.ctaContentCentered}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2 className={aboutStyles.ctaTitleCentered} variants={itemVariants}>
            Ready to deploy your next <em>mission?</em>
          </motion.h2>

          <motion.div variants={itemVariants} style={{ marginTop: '1.5rem' }}>
            <button className={aboutStyles.ctaButtonPill} onClick={(e) => { e.preventDefault(); alert('Contact initiated.'); }}>
              <Sparkles size={16} strokeWidth={2.5} />
              Contact OMOIKANE
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className={aboutStyles.ctaBottomSection}>
            <p className={aboutStyles.ctaSublabel}>BUILT FOR PERFORMANCE AND RELIABILITY.</p>
            <div className={aboutStyles.ctaTagsWrapper}>
              <div className={aboutStyles.ctaTags}>
                <span className={aboutStyles.ctaTag}>Embedded Systems</span>
                <span className={aboutStyles.ctaTag}>Flight Control</span>
                <span className={aboutStyles.ctaTag}>AI Integration</span>
                <span className={aboutStyles.ctaTag}>Robotic Platforms</span>
                <span className={aboutStyles.ctaTag}>Defense Tech</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
